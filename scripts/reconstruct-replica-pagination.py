#!/usr/bin/env python3
"""Complete archive pagination from captured original cards and public WP data.

The two upstream page-2 requests returned a database error. Keep that evidence,
and assemble their actual posts using the existing archive markup and taxonomies.
"""
from pathlib import Path
import importlib.util, json, re
from urllib.parse import unquote

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('mirror',ROOT/'scripts/mirror-wordpress.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
pages=m.read_json(m.PAGE_INDEX,{})
posts=m.read_json(m.SOURCE/'posts.json',[])
cache=Path('/workspace/sites/najlaa-shutter-copy/source-cache')
inventory=m.read_json(cache/'inventory.json',[])
cards={}
for row in pages.values():
    d=m.Document((m.SOURCE/row['file']).read_text())
    grid=d.find(tag='div',cls='row-cols-2')
    if not grid:continue
    for n in d.nodes:
        if n.get('parent') is not grid or n['tag']!='div':continue
        a=next((a for a in d.nodes if a['tag']=='a' and n['start']<a['start']<n['end']),None)
        if a and a['attrs'].get('href'):cards[m.normalized(a['attrs']['href'])]=d.outer(n)
count=0
for failed in inventory:
    if not failed['response'].startswith('500') or '/page/' not in failed['url']:continue
    url=m.normalized(failed['url']);base=url.split('/page/')[0]+'/'
    row=pages.get(m.normalized(base))
    if not row:raise SystemExit('Missing archive template: '+base)
    d=m.Document((m.SOURCE/row['file']).read_text())
    classes=d.find(tag='body')['attrs'].get('class','')
    tax=re.search(r'(?:category|tag|term)-(\d+)\b',classes)
    if not tax:raise SystemExit('Cannot identify taxonomy: '+classes)
    field='categories' if '/category/' in base else 'tags'
    matching=sorted([p for p in posts if int(tax[1]) in p[field]],key=lambda p:p['date'],reverse=True)
    page=int(re.search(r'/page/(\d+)/',url)[1]);selected=matching[(page-1)*10:page*10]
    missing=[p['link'] for p in selected if m.normalized(p['link']) not in cards]
    if missing:raise SystemExit('Missing original archive card: '+str(missing))
    grid=d.find(tag='div',cls='row-cols-2');nav=d.find(tag='div',cls='nav-links')
    contents='\n'.join(cards[m.normalized(p['link'])] for p in selected)
    paginator='<a class="prev page-numbers" href="'+base+'"><i class="bi bi-arrow-right-square"></i></a>\n<a class="page-numbers" href="'+base+'">1</a>\n<span aria-current="page" class="page-numbers current">2</span>'
    source=d.source
    for start,end,value in sorted([(grid['open_end'],grid['close_start'],contents),(nav['open_end'],nav['close_start'],paginator)],reverse=True):
        source=source[:start]+value+source[end:]
    source=re.sub(r'(<link rel="canonical" href=")[^"]*',lambda x:x[1]+url,source)
    path=m.SOURCE/'pages'/(m.sha(url.encode())+'.html');path.write_text(source)
    error=m.SOURCE/'upstream-errors'/(m.sha(url.encode())+'.html');error.parent.mkdir(exist_ok=True);error.write_bytes(Path(failed['file']).read_bytes())
    pages[url]=dict(url=url,requested=url,status=200,file=str(path.relative_to(m.SOURCE)),sha256=m.sha(source.encode()),
        reconstructed_from=base,upstream_status=500,post_ids=[p['id'] for p in selected],
        upstream_error=str(error.relative_to(m.SOURCE)),reason='Original archive cards; membership and order from public WordPress post metadata')
    print('Reconstructed',unquote(url),'posts',[p['id'] for p in selected]);count+=1
m.write_json(m.PAGE_INDEX,pages)
print('Reconstructed archive pages:',count)
