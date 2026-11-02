#!/usr/bin/env python3
"""Cross-page release invariants for SEO, image priority and script dependencies."""
from pathlib import Path
import importlib.util, json, sys
from urllib.parse import urlsplit, unquote
R=Path(__file__).resolve().parents[1];D=R/'dist'
sp=importlib.util.spec_from_file_location('m',R/'scripts/mirror-wordpress.py');m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
errors=[];counts={'pages':0,'schema_nodes':0,'deferred_scripts':0};descriptions={}
for f in D.rglob('index.html'):
 route='/'+f.relative_to(D).as_posix().removesuffix('index.html')
 if route=='/about/':continue
 s=f.read_text();d=m.Document(s);counts['pages']+=1
 canon=[n['attrs'].get('href') for n in d.nodes if n['tag']=='link' and n['attrs'].get('rel')=='canonical']
 if canon!=['https://najlaashutter.com'+route]:errors.append('Canonical mismatch '+route)
 graphs=[]
 for n in d.nodes:
  if n['attrs'].get('type')=='application/ld+json':
   try:graphs.extend(json.loads(d.inner(n)).get('@graph',[]))
   except Exception as e:errors.append('Invalid schema '+route+' '+str(e))
 counts['schema_nodes']+=len(graphs)
 business=next((n for n in graphs if n.get('@id')=='https://najlaashutter.com/#business'),{})
 if not business.get('address',{}).get('addressCountry')=='SA':errors.append('Missing known address '+route)
 if any(k in business for k in ['aggregateRating','review','openingHours','priceRange']):errors.append('Unverified business claims '+route)
 if route.startswith(('/window-shutters-jeddah/','/en/')):
  if 'noindex' not in s:errors.append('Ads became indexable '+route)
  continue
 if 'wpEmojiSettingsSupports' in s or 'jquery-migrate-js' in s:errors.append('Unused legacy runtime '+route)
 has_swiper=any('swiper' in n['attrs'].get('class','').split() for n in d.nodes)
 if not has_swiper and any(n['attrs'].get('id')=='swiper-js' for n in d.nodes):errors.append('Unused swiper '+route)
 for n in d.nodes:
  a=n['attrs']
  if n['tag']=='script' and a.get('src','').startswith('/') and not a.get('id','').startswith('googlesitekit'):
   if 'defer' not in a:errors.append('Blocking local script '+route+' '+a['src'])
   counts['deferred_scripts']+=1
 images=[n for n in d.nodes if n['tag']=='img' and 'wp-post-image' in n['attrs'].get('class','')]
 if images and route in ['/','/contact-us/','/our-works/','/category/services/','/category/blog/','/external-window-shutters/']:
  a=images[0]['attrs']
  if a.get('loading')!='eager' or a.get('fetchpriority')!='high':errors.append('First content image delayed '+route)
 if route.startswith('/category/blog/'):
  descriptions[route]=next((n['attrs'].get('content') for n in d.nodes if n['attrs'].get('name')=='description'),None)
 if route.startswith(('/tag/','/author/','/search/')) and 'noindex' not in s:errors.append('Utility became indexable '+route)
 if '--staging' not in sys.argv and route in ['/category/services/','/category/blog/','/category/blog/page/2/'] and 'noindex' in s:errors.append('Archive unexpectedly noindex '+route)
 if 'pause-motion' in s:errors.append('Removed button returned '+route)
if len(set(descriptions.values()))!=len(descriptions):errors.append('Duplicate blog descriptions')
result={'status':'passed' if not errors else 'failed','checks':counts,'errors':errors,'address_limit':'Locality, region and country only. Street/unit not supplied or invented.','browser_click_test':'blocked: native browser sandbox startup failure','rich_results_test':'not run; local graph checks only'}
(R/'wordpress-static/qa/performance-seo-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(bool(errors))
