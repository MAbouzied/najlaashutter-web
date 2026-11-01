#!/usr/bin/env python3
"""Check the exported files against captured source; no network or browser claims."""
from pathlib import Path
from urllib.parse import urlsplit, unquote, urljoin
import importlib.util, json, re, hashlib, sys

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('mirror', ROOT / 'scripts/mirror-wordpress.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
W = ROOT / 'wordpress-static'
pages = json.loads((W / 'source/pages.json').read_text())
assets = json.loads((W / 'source/assets.json').read_text())
routes = json.loads((W / 'routes.json').read_text())
errors, warnings = [], []

class VisibleText(m.HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.parts = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        if tag in {'script','style','head','noscript','template'}: self.skip += 1
    def handle_endtag(self, tag):
        if tag in {'script','style','head','noscript','template'}: self.skip -= 1
    def handle_data(self, value):
        if not self.skip: self.parts.append(value)
    def text(self): return re.sub(r'\s+', ' ', ' '.join(self.parts)).strip()

def invariant(d):
    return [(n['tag'], {k:v for k,v in n['attrs'].items()
                       if k not in {'href','src','srcset','action','style','poster'}})
            for n in d.nodes if not (n['tag']=='script' and n['attrs'].get('src')=='/mirror-runtime.js')]

checked = set()
resource_refs = set()
internal_links = set()
for row in pages.values():
    if row['status'] != 200: continue
    route = m.page_path(row['url'])
    if route in checked: continue
    checked.add(route)
    source = (W / 'source' / row['file']).read_text()
    built_path = W / 'site' / route.lstrip('/') / 'index.html'
    if not built_path.exists(): errors.append('Missing route: '+route); continue
    built = built_path.read_text()
    if VisibleText(source).text() != VisibleText(built).text(): errors.append('Visible text changed: '+route)
    original_doc, built_doc = m.Document(source), m.Document(built)
    if invariant(original_doc) != invariant(built_doc): errors.append('Element structure/attributes changed: '+route)
    original_motion = [n['attrs'] for n in original_doc.nodes if 'data-aos' in n['attrs']]
    built_motion = [n['attrs'] for n in built_doc.nodes if 'data-aos' in n['attrs']]
    if [(a.get('data-aos'),a.get('data-aos-duration'),a.get('data-aos-delay')) for a in original_motion] != [(a.get('data-aos'),a.get('data-aos-duration'),a.get('data-aos-delay')) for a in built_motion]:
        errors.append('Motion attributes changed: '+route)
    for ref in m.asset_references(built, 'https://replica.example'+route):
        u = urlsplit(ref)
        if u.netloc=='replica.example': resource_refs.add(unquote(u.path))
        elif u.netloc not in {'www.googletagmanager.com','www.statcounter.com','c.statcounter.com'}:
            errors.append('Unlocalized asset: '+ref)
    for node in built_doc.nodes:
        a = node['attrs']
        if node['tag']=='a' and a.get('href','').startswith('/') and not a['href'].startswith('//'):
            u=urlsplit(a['href']); path=unquote(u.path)
            if path.startswith('/mirror-assets/') or path.startswith('/cdn-cgi/l/email-protection'): continue
            internal_links.add(path)

for url, row in assets.items():
    if row['status'] != 200:
        errors.append('Uncaptured asset '+str(row['status'])+': '+url); continue
    raw=W/'source'/row['file']
    raw_bytes=m.asset_bytes(row)
    if hashlib.sha256(raw_bytes).hexdigest()!=row['sha256']:errors.append('Source hash mismatch: '+url)
    dest=W/'site/mirror-assets'/Path(row['file']).name
    if not dest.exists():errors.append('Missing compiled asset: '+url); continue
    if 'text/css' in row.get('content_type','') or raw.suffix=='.css':
        clean=lambda s:m.CSS_URL.sub('url(RESOURCE)',s)
        if clean(raw_bytes.decode())!=clean(dest.read_text()):errors.append('CSS changed beyond resource URLs: '+url)
        for ref in m.asset_references(dest.read_text(),'https://replica.example/mirror-assets/'+dest.name,css=True):
            u=urlsplit(ref)
            if u.netloc=='replica.example':resource_refs.add(unquote(u.path))
            else:errors.append('Unlocalized CSS dependency: '+ref)
    elif raw_bytes!=dest.read_bytes(): errors.append('Asset bytes changed: '+url)

for path in resource_refs:
    if not (W/'site'/path.lstrip('/')).is_file():errors.append('Missing local resource: '+path)
for path in internal_links:
    if not path: continue
    if path in routes or (W/'site'/path.lstrip('/')).is_file(): continue
    if path.rstrip('/')=='/about':warnings.append('Original /about/ footer link is a source-site 404; custom 404 preserved.')
    else:errors.append('Internal route not exported: '+path)

result=dict(status='passed' if not errors else 'failed',
    pages_checked=len(checked), asset_files_checked=sum(r['status']==200 for r in assets.values()),
    local_resource_targets=len(resource_refs), internal_link_targets=len(internal_links),
    checks=['visible text unchanged','element structure and presentation attributes unchanged',
            'AOS effect/duration/delay unchanged','original CSS preserved except local resource URLs',
            'original JS/image/font bytes unchanged','internal routes and local assets resolve'],
    errors=sorted(set(errors)), warnings=sorted(set(warnings)),
    note='This is source/file verification. Actual browser/visual review is recorded separately.')
path=W/'qa/source-verification.json';path.parent.mkdir(exist_ok=True);path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in {'checks'}},ensure_ascii=False,indent=2))
sys.exit(bool(errors))
