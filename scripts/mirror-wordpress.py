#!/usr/bin/env python3
"""Export captured public WordPress responses without redesigning their markup.

Capture is resumable; build is fully offline. Original files and SHA-256 hashes
remain available for checking that styles, scripts and content were preserved.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote, quote, parse_qs
import argparse, base64, hashlib, html, json, re, shutil, subprocess, time

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://najlaashutter.com/'
WORK = ROOT / 'wordpress-static'
SOURCE = WORK / 'source'
SITE = WORK / 'site'
ASSET_INDEX = SOURCE / 'assets.json'
PAGE_INDEX = SOURCE / 'pages.json'
MEDIA = re.compile(r'\.(?:png|jpe?g|webp|gif|svg|ico|avif|mp4|webm|pdf|woff2?|ttf|eot|otf)(?:[?#]|$)', re.I)
CSS_URL = re.compile(r'url\(\s*([\'\"]?)(.*?)\1\s*\)', re.I)
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

def read_json(p, default):
    return json.loads(p.read_text()) if p.exists() else default

def write_json(p, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def normalized(url):
    u = urlsplit(html.unescape(url))
    return urlunsplit((u.scheme or 'https', u.netloc.lower(),
                     quote(unquote(u.path), safe='/@:+'), u.query, ''))

def sha(data):
    return hashlib.sha256(data).hexdigest()

def asset_bytes(row):
    raw = SOURCE / row['file']
    if raw.exists(): return raw.read_bytes()
    return base64.b64decode(raw.with_name(raw.name+'.b64').read_text())

def asset_exists(row):
    raw = SOURCE / row['file']
    return raw.exists() or raw.with_name(raw.name+'.b64').exists()

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.lines = [0]
        self.nodes = []
        self.stack = []
        for m in re.finditer('\n', source): self.lines.append(m.end())
        self.feed(source)

    def pos(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        start = self.pos()
        node = dict(tag=tag, attrs=dict(attrs), start=start,
                    open_end=start + len(self.get_starttag_text()),
                    parent=self.stack[-1] if self.stack else None)
        self.nodes.append(node)
        if tag in VOID: node['end'] = node['open_end']
        else: self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            node = self.stack.pop()
            node['end'] = node['open_end']

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]['tag'] == tag:
                for node in self.stack[i:]:
                    node['close_start'] = self.pos()
                    node['end'] = self.source.find('>', self.pos()) + 1
                del self.stack[i:]
                break

    def find(self, tag=None, cls=None, ident=None):
        return next((n for n in self.nodes if
                     (not tag or n['tag'] == tag) and
                     (not cls or cls in n['attrs'].get('class', '').split()) and
                     (not ident or n['attrs'].get('id') == ident)), None)

    def outer(self, n):
        return self.source[n['start']:n.get('end', n['open_end'])] if n else ''

    def inner(self, n):
        return self.source[n['open_end']:n.get('close_start', n['open_end'])] if n else ''

def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', s))).strip()

def asset_references(source, base, css=False):
    refs = set()
    def add(value):
        if value and not value.startswith(('data:', '#', 'blob:', 'javascript:')):
            u = normalized(urljoin(base, value))
            if urlsplit(u).scheme in ('http', 'https'): refs.add(u)
    if css:
        source = re.sub(r'/\*.*?\*/', '', source, flags=re.S)
        for m in CSS_URL.finditer(source): add(m[2])
        for m in re.finditer(r'@import\s+[\'\"]([^\'\"]+)', source): add(m[1])
        return refs
    doc = Document(source)
    for match in re.finditer(r'https?://[^\s\"\'<>]+', re.sub(r'<!--.*?-->', '', source, flags=re.S).replace('\\/','/')):
        candidate = html.unescape(match[0]).rstrip(');,')
        if re.search(r'\.(?:js|css|png|jpe?g|gif|svg|webp|woff2?)(?:[?#]|$)', candidate, re.I):
            add(candidate)
    for node in doc.nodes:
        t, a = node['tag'], node['attrs']
        if t in ('img', 'script', 'video', 'audio', 'source', 'embed'):
            add(a.get('src')); add(a.get('poster'))
            if a.get('srcset') and not a['srcset'].startswith('data:'):
                for item in a['srcset'].split(','): add(item.strip().split()[0])
        if t == 'link' and set(a.get('rel', '').split()) & {'stylesheet', 'icon', 'apple-touch-icon'}:
            add(a.get('href'))
        if t == 'a' and MEDIA.search(a.get('href', '')): add(a['href'])
        if a.get('style'):
            for m in CSS_URL.finditer(a['style']): add(m[2])
        if t == 'style':
            for m in CSS_URL.finditer(doc.inner(node)): add(m[2])
    return refs

def import_cache(directory):
    rows = read_json(directory / 'inventory.json', [])
    pages = read_json(PAGE_INDEX, {})
    for row in rows:
        if not row['response'].startswith(('200\n', '404\n')): continue
        src = Path(row['file'])
        if not src.exists(): src = directory / src.name
        if not src.exists(): continue
        data = src.read_bytes()
        if b'<html' not in data.lower(): continue
        requested = normalized(row['url'])
        effective = normalized(row['response'].split('\n')[-1])
        key = sha(requested.encode())
        dest = SOURCE / 'pages' / (key + '.html')
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        pages[requested] = dict(url=effective, requested=requested,
            status=int(row['response'][:3]), file=str(dest.relative_to(SOURCE)), sha256=sha(data))
    write_json(PAGE_INDEX, pages)
    print(f'Imported {len(pages)} page responses', flush=True)

def fetch(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + '.part')
    result = subprocess.run(['curl', '-L', '--max-time', '45', '-sS',
        '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        '-w', '%{http_code}\n%{content_type}\n%{url_effective}', url, '-o', str(tmp)],
        capture_output=True, text=True)
    parts = result.stdout.split('\n')
    status = int(parts[0]) if parts and parts[0].isdigit() else 0
    if status == 200 and tmp.exists() and tmp.stat().st_size:
        tmp.replace(dest)
        return dict(status=200, content_type=parts[1], final_url=parts[-1])
    tmp.unlink(missing_ok=True)
    return dict(status=status, error=result.stderr, final_url=parts[-1] if parts else url)

def capture_assets(external_only=False):
    assets = read_json(ASSET_INDEX, {})
    refs = set()
    for row in read_json(PAGE_INDEX, {}).values():
        refs |= asset_references((SOURCE / row['file']).read_text(), row['url'])
    # Original content includes tracker scripts. Keep live tracker endpoints live;
    # they are intentionally not converted into a frozen copy of third-party APIs.
    def runtime_service(u):
        return urlsplit(u).netloc in {'www.googletagmanager.com', 'www.statcounter.com', 'c.statcounter.com'}
    visited = set()
    while True:
        pending = sorted(u for u in refs - visited if not runtime_service(u) and
            (not external_only or urlsplit(u).netloc not in {'najlaashutter.com', 'www.najlaashutter.com'}))
        if not pending: break
        for url in pending:
            visited.add(url)
            old = assets.get(url)
            if old and old.get('status') == 200 and asset_exists(old):
                row = old
            else:
                ext = Path(unquote(urlsplit(url).path)).suffix.lower()
                if not re.fullmatch(r'\.[a-z0-9]{1,6}', ext): ext = '.css' if urlsplit(url).netloc == 'fonts.googleapis.com' else '.bin'
                dest = SOURCE / 'assets' / (sha(url.encode())[:24] + ext)
                result = fetch(url, dest)
                row = dict(url=url, file=str(dest.relative_to(SOURCE)), **result)
                if row['status'] == 200:
                    row['sha256'] = sha(dest.read_bytes())
                    row['size'] = dest.stat().st_size
                assets[url] = row
                write_json(ASSET_INDEX, assets)
                print('ASSET', row['status'], len(visited), url, flush=True)
                if row['status'] == 429:
                    print('Source rate limit: asset capture paused; rerun after cooldown.', flush=True)
                    return
                time.sleep(3 if urlsplit(url).netloc == 'najlaashutter.com' else 0.3)
            if row.get('status') == 200 and ('text/css' in row.get('content_type', '') or row['file'].endswith('.css')):
                refs |= asset_references(asset_bytes(row).decode(), url, css=True)
    print('Assets captured:', sum(r.get('status') == 200 for r in assets.values()), 'known:', len(assets), flush=True)

def page_path(url):
    u = urlsplit(url)
    query = parse_qs(u.query)
    if 's' in query: return '/search/'
    return unquote(u.path) or '/'

def build():
    pages = read_json(PAGE_INDEX, {})
    assets = read_json(ASSET_INDEX, {})
    if not pages: raise SystemExit('No captured source pages')
    SITE.mkdir(parents=True, exist_ok=True)
    asset_map = {url: '/mirror-assets/' + Path(row['file']).name for url, row in assets.items() if row.get('status') == 200}
    aliases = {requested: page_path(row['url']) for requested, row in pages.items()}
    def local_asset(value, base):
        if value.startswith(('data:', 'blob:', '#')): return value
        return asset_map.get(normalized(urljoin(base, value)), value)
    def css_rewrite(source, base):
        return CSS_URL.sub(lambda m: 'url(' + m[1] + local_asset(m[2], base) + m[1] + ')', source)
    def rewrite(source, base):
        # Rewrite exact resource URL strings, including inline resource configs.
        for original, dest in sorted(asset_map.items(), key=lambda p: -len(p[0])):
            for spelling in {original, unquote(original), html.escape(original, quote=False), original.replace('&', '&#038;'), original.replace('/','\\/')}:
                source = source.replace(spelling, dest)
        doc = Document(source)
        changes = []
        for n in doc.nodes:
            t, a = n['tag'], n['attrs']
            tag = source[n['start']:n['open_end']]
            def attr(m):
                key, q, value = m[1], m[2], html.unescape(m[3])
                result = value
                if key == 'href' and t == 'a' or key == 'action' and t == 'form':
                    absolute = normalized(urljoin(base, value))
                    if urlsplit(absolute).netloc in {'najlaashutter.com', 'www.najlaashutter.com'} and not MEDIA.search(absolute):
                        u = urlsplit(value)
                        result = aliases.get(absolute, (unquote(u.path) or '/') + ('?' + u.query if u.query else ''))
                        if u.fragment: result += '#' + u.fragment
                    if t == 'form' and a.get('role') == 'search': result = '/search/'
                elif key in {'src', 'poster', 'href'}: result = local_asset(value, base)
                elif key == 'srcset' and not value.startswith('data:'):
                    result = ', '.join(' '.join([local_asset(p[0], base), *p[1:]]) for part in value.split(',') if (p := part.strip().split()))
                elif key == 'style': result = css_rewrite(value, base)
                return key + '=' + q + html.escape(result, quote=True) + q
            tag = re.sub(r'\b(href|src|poster|srcset|action|style)\s*=\s*([\'\"])(.*?)\2', attr, tag, flags=re.S)
            if tag != source[n['start']:n['open_end']]: changes.append((n['start'], n['open_end'], tag))
        for start, end, text in reversed(changes): source = source[:start] + text + source[end:]
        source = css_rewrite(source, base)
        # Query routing is the only adaptation needed for static search/category aliases.
        source = source.replace('</body>', '<script src="/mirror-runtime.js" defer></script>\n</body>')
        return source
    for url, row in assets.items():
        if row.get('status') != 200: continue
        src = SOURCE / row['file']
        dest = SITE / asset_map[url].lstrip('/')
        dest.parent.mkdir(parents=True, exist_ok=True)
        if 'text/css' in row.get('content_type', '') or src.suffix == '.css':
            dest.write_text(css_rewrite(asset_bytes(row).decode(), url))
        else: dest.write_bytes(asset_bytes(row))
    routes, search_records = {}, []
    for requested, row in pages.items():
        if row['status'] == 404:
            (SITE / '404.html').write_text(rewrite((SOURCE / row['file']).read_text(), row['url']))
            continue
        if row['status'] != 200: continue
        path = page_path(row['url'])
        source = (SOURCE / row['file']).read_text()
        rendered = rewrite(source, row['url'])
        dest = SITE / path.lstrip('/') / 'index.html'
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(rendered)
        routes[path] = dict(source_url=row['url'], file=str(dest.relative_to(SITE)), source_sha256=row['sha256'])
        d = Document(rendered)
        content = d.find(cls='post-content')
        title = d.find(tag='h1', cls='post-title')
        if content and title:
            image = d.find(tag='img', cls='wp-post-image')
            body = d.find(tag='body')
            match = re.search(r'(?:postid-|page-id-)(\d+)', body['attrs'].get('class','')) if body else None
            search_records.append(dict(url=path, title=plain(d.inner(title)), text=plain(d.inner(content)),
                search_text=html.unescape(d.inner(content)), order=int(match[1]) if match else 0,
                image=image['attrs'].get('src', '') if image else ''))
    # Deduplicate aliases before indexing content.
    search_records = list({r['url']:r for r in search_records}.values())
    write_json(SITE / 'search-index.json', search_records)
    write_json(WORK / 'routes.json', routes)
    (SITE / 'mirror-runtime.js').write_text((ROOT / 'scripts' / 'mirror-runtime.js').read_text())
    (SITE / '_headers').write_text('/*\n  X-Robots-Tag: noindex, nofollow\n')
    (SITE / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
    write_json(WORK / '.openai' / 'hosting.json', {'static': {'directory': 'site'}})
    write_json(WORK / 'package.json', {'name':'najlaa-wordpress-static-replica','private':True,'scripts':{}})
    print('Built routes:', len(routes), 'local assets:', len(asset_map), 'search documents:', len(search_records))

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('command', choices=['import', 'assets', 'build'])
    p.add_argument('--cache', type=Path)
    p.add_argument('--external-only', action='store_true')
    a = p.parse_args()
    if a.command == 'import': import_cache(a.cache)
    elif a.command == 'assets': capture_assets(a.external_only)
    else: build()

if __name__ == '__main__': main()
