#!/usr/bin/env python3
"""Improve the reviewed export only. Captured WordPress source stays immutable."""
from pathlib import Path
import html, importlib.util, json, re, sys
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('mirror', ROOT/'scripts/mirror-wordpress.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
BASE = 'https://najlaashutter.com'
BUSINESS = {'@type':'HomeAndConstructionBusiness','@id':BASE+'/#business',
 'name':'نجلاء شتر','alternateName':'Najlaa Shutter','url':BASE+'/',
 'telephone':'+966535344170','email':'info@najlaashutter.com',
 # Only the locality/region already displayed on the site. No invented street/unit.
 'address':{'@type':'PostalAddress','addressLocality':'جدة','addressRegion':'مكة المكرمة','addressCountry':'SA'},
 'areaServed':[{'@type':'City','name':'جدة'},{'@type':'City','name':'مكة'}],
 'hasMap':'https://maps.app.goo.gl/bLh4sDaxyG6zkRJ57'}
SERVICES = {'/window-shutters-with-remote-control/','/smart-shutter-windows/',
 '/manual-shutter/','/interior-window-shutters/','/external-window-shutters/'}
LABELS = {'/category/services/':'الخدمات','/category/blog/':'المدونة',
 '/category/blog/page/2/':'المدونة — الصفحة الثانية'}
DESCRIPTIONS = {
 '/category/services/':'خدمات شتر النوافذ في جدة ومكة: شتر داخلي وخارجي ويدوي وكهربائي وخيارات التحكم الذكي. تعرف على تفاصيل كل نوع ومتطلبات طلب عرض السعر.',
 '/category/blog/':'مقالات نجلاء شتر عن أنواع شتر النوافذ واختيار الخامات والتشغيل والتركيب في جدة ومكة. تصفح أحدث المقالات والأدلة.',
 '/category/blog/page/2/':'الصفحة الثانية من مدونة نجلاء شتر: المزيد من المقالات عن شتر النوافذ والعزل والتركيب واختيار الحل المناسب في جدة ومكة.'}

def change(s, edits):
 for start,end,value in sorted(edits, reverse=True): s=s[:start]+value+s[end:]
 return s

def tag(name, attrs, inner=None):
 opening='<'+name+' '+ ' '.join(k if v is None else k+'="'+html.escape(str(v),quote=True)+'"' for k,v in attrs.items())+'>'
 return opening if inner is None else opening+inner+'</'+name+'>'

def structured(s, route, ads=False):
 d=m.Document(s); canonical=BASE+route
 title=m.plain(d.inner(d.find(tag='h1'))) or m.plain(d.inner(d.find(tag='title')))
 image=next((n['attrs'].get('src') for n in d.nodes if n['tag']=='img' and 'wp-post-image' in n['attrs'].get('class','')),None)
 description=next((n['attrs'].get('content','') for n in d.nodes if n['tag']=='meta' and n['attrs'].get('name')=='description'),'')
 edits=[]
 for n in d.nodes:
  a=n['attrs']
  if n['tag']=='link' and a.get('rel') in ['canonical','shortlink'] or n['tag']=='script' and a.get('type')=='application/ld+json': edits.append((n['start'],n['end'],''))
  elif n['tag']=='meta' and a.get('name')=='description' and route in DESCRIPTIONS:
   description=DESCRIPTIONS[route]; edits.append((n['start'],n['end'],tag('meta',{'name':'description','content':description})))
  elif n['tag']=='meta' and a.get('property')=='og:description' and route in DESCRIPTIONS: edits.append((n['start'],n['end'],tag('meta',{'property':'og:description','content':DESCRIPTIONS[route]})))
  elif route in LABELS and n['tag']=='title': edits.append((n['start'],n['end'],'<title>'+LABELS[route]+' | نجلاء شتر</title>'))
  elif route in LABELS and n['tag']=='meta' and a.get('property')=='og:title': edits.append((n['start'],n['end'],tag('meta',{'property':'og:title','content':LABELS[route]+' | نجلاء شتر'})))
 s=change(s,edits)
 business=dict(BUSINESS)
 site={'@type':'WebSite','@id':BASE+'/#website','url':BASE+'/','name':'نجلاء شتر','alternateName':'Najlaa Shutter','inLanguage':'ar-SA','publisher':{'@id':BUSINESS['@id']}}
 page={'@type':'WebPage','@id':canonical+'#webpage','url':canonical,'name':title,'description':description,'inLanguage':'en' if route=='/en/' else 'ar-SA','isPartOf':{'@id':site['@id']}}
 graph=[business,site,page]
 if route not in ['/','/404/'] and not ads and not route.startswith(('/search/','/tag/','/author/','/slide','/category/slider/')):
  crumbs=[{'@type':'ListItem','position':1,'name':'الرئيسية','item':BASE+'/'}]
  parent='/category/services/' if route in SERVICES else '/category/blog/' if d.find(cls='post-content') and route not in ['/contact-us/','/about-us/','/faq/','/privacy-policy/','/our-works/'] else None
  if parent: crumbs.append({'@type':'ListItem','position':2,'name':LABELS[parent],'item':BASE+parent})
  crumbs.append({'@type':'ListItem','position':len(crumbs)+1,'name':LABELS.get(route,title),'item':canonical})
  breadcrumb={'@type':'BreadcrumbList','@id':canonical+'#breadcrumb','itemListElement':crumbs}
  graph.append(breadcrumb); page['breadcrumb']={'@id':breadcrumb['@id']}
 if route in SERVICES:
  graph.append({'@type':'Service','@id':canonical+'#service','name':title,'description':description,'url':canonical,'provider':{'@id':business['@id']},'areaServed':business['areaServed'],'mainEntityOfPage':{'@id':page['@id']}})
 elif d.find(cls='post-content') and route not in ['/contact-us/','/about-us/','/faq/','/privacy-policy/','/our-works/'] and not ads and not route.startswith(('/slide','/search/')):
  article={'@type':'BlogPosting','@id':canonical+'#article','headline':title,'description':description,'url':canonical,'inLanguage':'ar-SA','publisher':{'@id':business['@id']},'mainEntityOfPage':{'@id':page['@id']}}
  if image: article['image']=urljoin(BASE,image)
  # Preserve only author/date explicitly present in visible markup.
  author=next((n for n in d.nodes if n['tag']=='a' and '/author/' in n['attrs'].get('href','')),None)
  if author and m.plain(d.inner(author)): article['author']={'@type':'Person','name':m.plain(d.inner(author)),'url':urljoin(BASE,author['attrs']['href'])}
  graph.append(article)
 graph_json=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('</','<\\/')
 return s.replace('</head>',tag('link',{'rel':'canonical','href':canonical})+'<script type="application/ld+json">'+graph_json+'</script></head>')

def performance(s, route):
 d=m.Document(s)
 has_swiper=any('swiper' in n['attrs'].get('class','').split() for n in d.nodes)
 has_gallery=any('data-fancybox' in n['attrs'] or 'wp-block-gallery' in n['attrs'].get('class','').split() for n in d.nodes)
 has_aos=any('data-aos' in n['attrs'] for n in d.nodes)
 mobile=d.find(ident='pwCarouselMob') if route=='/' else None
 mobile_first=next((n for n in d.nodes if n['tag']=='img' and mobile and mobile['start']<n['start']<mobile['end']),None)
 edits=[];fix_script=''
 for n in d.nodes:
  a=n['attrs']; ident=a.get('id',''); body=d.inner(n)
  if n['tag']=='script':
   src=a.get('src','')
   if (ident=='jquery-migrate-js' or ident=='wp-emoji-settings' or 'wpEmojiSettingsSupports' in body or src.endswith('169990702e2f9883a5b4063b.js')):
    edits.append((n['start'],n['end'],'')); continue
   if ident=='swiper-js' and not has_swiper or ident=='fancybox-js' and not has_gallery or ident=='aos-js' and not has_aos:
    edits.append((n['start'],n['end'],''));continue
   if src=='/fixes-runtime.js':
    fix_script=tag('script',{'src':src,'defer':None},'');edits.append((n['start'],n['end'],''));continue
   if src.startswith('/') and not ident.startswith('googlesitekit'):
    attrs=dict(a);attrs['defer']=None;edits.append((n['start'],n['end'],tag('script',attrs,'')))
  elif n['tag']=='link' and (ident=='swiper-css' and not has_swiper or ident=='fancybox-css' and not has_gallery or ident=='aos-css' and not has_aos): edits.append((n['start'],n['end'],''))
  elif n['tag']=='img' and (a.get('fetchpriority')=='high' or n is mobile_first or route=='/' and a.get('src','').endswith('c82f779d382d6eef160d38aa.jpg')):
   attrs=dict(a);attrs['loading']='eager';attrs['fetchpriority']='high';attrs['decoding']='async';edits.append((n['start'],n['end'],tag('img',attrs)))
 s=change(s,edits).replace('</body>',fix_script+'</body>')
 return s

def main():
 ads='--ads-only' in sys.argv; directory=ROOT/'dist' if ads else ROOT/'wordpress-static/fixed-site'
 for f in directory.rglob('*.html'):
  if ads and f.relative_to(directory).as_posix() not in ['en/index.html','window-shutters-jeddah/index.html']:continue
  route='/'+f.relative_to(directory).as_posix().removesuffix('index.html')
  if route in ['/about/','/404.html']:continue
  s=f.read_text()
  if not ads:s=performance(s,route)
  f.write_text(structured(s,route,ads))
 if not ads:
  # Same library settings and transitions; initialize only existing components.
  theme=directory/'mirror-assets/29bf278110c1f70de628f916.js';s=theme.read_text()
  s=s.replace('Fancybox.bind("[data-fancybox]", {});','if (window.Fancybox) Fancybox.bind("[data-fancybox]", {});').replace('AOS.init();','if (window.AOS) AOS.init();')
  s=re.sub(r'var swiper = new Swiper\("([^"]+)"',r'if (window.Swiper && document.querySelector("\1")) new Swiper("\1"',s)
  theme.write_text(s)
 print('Prepared performance/SEO:', 'ads' if ads else 'full site')

if __name__=='__main__':main()
