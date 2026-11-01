#!/usr/bin/env python3
"""Create a branch-hosted review copy with an explicit path prefix.

The production export remains in site/ with normal root-relative routes.
Review files work on a static file CDN that has no directory-index routing.
"""
from pathlib import Path
import base64, hashlib, json, mimetypes, re, shutil

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'wordpress-static'
SRC = WORK / 'site'
OUT = WORK / 'review'
PREFIX = '/MAbouzied/najlaashutter-web/replica-static-exact-2026-11-01/wordpress-static/review/'
ORIGIN = 'https://raw.githack.com'
ROUTES = json.loads((WORK / 'routes.json').read_text())
REVISION=hashlib.sha256(b''.join(p.read_bytes() for p in sorted(SRC.rglob('*')) if p.is_file())).hexdigest()[:12]

def indexed(value):
    path, mark, tail = value.partition('?')
    if path in ROUTES: path += 'index.html'
    return PREFIX + path.lstrip('/') + (mark + tail if mark else '')

if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir(parents=True)
assets=json.loads((WORK/'source/assets.json').read_text())
resources={}
css=[]
def data_uri(data,mime):return 'data:'+mime+';base64,'+base64.b64encode(data).decode()
for row in assets.values():
    if row['status']!=200:continue
    path=SRC/'mirror-assets'/Path(row['file']).name
    key='/mirror-assets/'+path.name
    mime=row.get('content_type','').split(';')[0] or mimetypes.guess_type(str(path))[0] or 'application/octet-stream'
    if mime=='text/css' or path.suffix=='.css':css.append((key,path))
    else:resources[key]=data_uri(path.read_bytes(),mime)
for key,path in css:
    content=path.read_text()
    for ref,uri in resources.items():content=content.replace(ref,uri)
    resources[key]=data_uri(content.encode(),'text/css')
resources['/mirror-runtime.js']=data_uri((SRC/'mirror-runtime.js').read_bytes(),'text/javascript')

bundles=[];entries={};size=0
def flush():
    global entries,size
    if not entries:return
    name='assets-'+str(len(bundles)).zfill(3)+'.js'
    (OUT/name).write_text('Object.assign(window.REPLICA_RESOURCE_MAP ||= {},'+json.dumps(entries,ensure_ascii=False)+');\n')
    bundles.append(name);entries={};size=0
for key,value in resources.items():
    if size+len(value)>650000:flush()
    entries[key]=value;size+=len(value)
flush()
scripts=''.join('<script src="'+PREFIX+n+'?v='+REVISION+'"></script>' for n in bundles)
wrapper='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>نجلاء شتر</title></head><body>'+scripts+'<script src="'+PREFIX+'loader.js?v='+REVISION+'"></script></body></html>'
for route,record in ROUTES.items():
    original=SRC/record['file'];dest=OUT/'pages'/record['file'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(original.read_text())
    entry=OUT/record['file'];entry.parent.mkdir(parents=True,exist_ok=True);entry.write_text(wrapper)
for name in ['mirror-runtime.js','search-index.json']:
    shutil.copyfile(SRC/name,OUT/name)
(OUT/'loader.js').write_text((ROOT/'scripts/replica-review-loader.js').read_text().replace('__PREFIX__',PREFIX).replace('__REVISION__',REVISION))

(OUT / 'compare.html').write_text('''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>مقارنة نسخة نجلاء شتر</title>
<style>*{box-sizing:border-box}body{margin:0;font:16px Arial;background:#eef2f6;color:#13304e}header{height:56px;padding:14px;display:flex;gap:14px;align-items:center}select{font:inherit;padding:5px}.grid{display:grid;grid-template-columns:1fr 1fr;direction:ltr;gap:2px}.column{overflow:hidden}h2{text-align:center;font:18px Arial;margin:0;padding:10px;background:white}iframe{display:block;border:0;background:white;transform-origin:top left}.mobile .grid{display:flex;justify-content:center;gap:40px}.mobile .column{width:390px}</style>
</head><body><header>مقارنة النسخة الثابتة بالموقع الأصلي <select id="route"><option value="/">الرئيسية</option><option value="/about-us/">من نحن</option><option value="/contact-us/">تواصل معنا</option><option value="/category/services/">الخدمات</option><option value="/window-shutters-with-remote-control/">خدمة</option><option value="/our-works/">أعمالنا</option><option value="/faq/">الأسئلة الشائعة</option><option value="/category/blog/">المدونة</option><option value="/how-do-you-choose-the-right-type-of-shutter-for-your-home/">مقال</option><option value="/privacy-policy/">الخصوصية</option></select><select id="size"><option value="desktop">كمبيوتر</option><option value="mobile">موبايل</option></select></header>
<div class="grid"><section class="column"><h2>الموقع الأصلي</h2><iframe id="original"></iframe></section><section class="column"><h2>النسخة الثابتة</h2><iframe id="replica"></iframe></section></div>
<script>const prefix=''' + json.dumps(PREFIX) + ''';const current=new URL(location.hostname==='htmlpreview.github.io'?location.search.slice(1):location.href);const p=new URLSearchParams(current.search);const route=document.querySelector('#route'),size=document.querySelector('#size');route.value=p.get('route')||'/';size.value=p.get('size')||'desktop';function draw(){const mobile=size.value==='mobile';document.body.className=mobile?'mobile':'';const w=mobile?390:1200;const scale=mobile?1:(innerWidth/2-1)/1200;for(const f of document.querySelectorAll('iframe')){f.style.width=w+'px';f.style.height=(mobile?1000:1900)+'px';f.style.transform='scale('+scale+')';}document.querySelector('#original').src='https://najlaashutter.com'+route.value;document.querySelector('#replica').src='https://htmlpreview.github.io/?https://raw.githubusercontent.com'+prefix+route.value.slice(1)+'index.html';}route.onchange=size.onchange=draw;draw();</script></html>''')

qa = (ROOT / 'scripts' / 'replica-browser-qa.html').read_text().replace('__PREFIX__', PREFIX).replace('__REVISION__',REVISION)
(OUT / 'qa.html').write_text(qa)
print('Review URL:', ORIGIN + PREFIX + 'index.html')
print('Comparison:', ORIGIN + PREFIX + 'compare.html')
print('Browser QA:', ORIGIN + PREFIX + 'qa.html')
