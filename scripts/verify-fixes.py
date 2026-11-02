#!/usr/bin/env python3
"""Verify repaired output without weakening immutable replica/source checks."""
from pathlib import Path
from urllib.parse import urlsplit,unquote
import importlib.util,json,collections,re,sys
R=Path(__file__).resolve().parents[1];W=R/'wordpress-static';D=W/'fixed-site'
sp=importlib.util.spec_from_file_location('m',R/'scripts/mirror-wordpress.py');m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
errors=[];counts=collections.Counter();routes=json.loads((W/'routes.json').read_text());assets=json.loads((W/'source/assets.json').read_text());known404={'/mirror-assets/'+Path(x['file']).name for x in assets.values() if x['status']==404}
for route,row in routes.items():
 f=D/row['file'];s=f.read_text();d=m.Document(s);counts['pages']+=1
 ids=collections.Counter(n['attrs']['id'] for n in d.nodes if n['attrs'].get('id'))
 if any(v>1 for v in ids.values()):errors.append('Duplicate IDs '+route)
 if sum(n['tag']=='h1' for n in d.nodes)!=1:errors.append('Expected one H1 '+route)
 for token in ['var name1','let pwShr','GTM-','sc_project=','https://www.facebook.com/','https://www.instagram.com/','https://www.tiktok.com/','https://htmcssjs.com/shut"','المصدر: فورم الصفحة الرئيسية']:
  if token in s:errors.append('Unexpected token '+token+' '+route)
 for n in d.nodes:
  a=n['attrs']
  for key in ['data-bs-target','aria-controls']:
   if a.get(key) and a[key].lstrip('#') not in ids:errors.append('Invalid target '+route+' '+a[key])
  if n['tag']=='a' and a.get('href','').startswith('/') and not a['href'].startswith('//'):
   path=unquote(urlsplit(a['href']).path)
   if path and path not in routes and not (D/path.lstrip('/')).is_file() and not (D/path.lstrip('/')/'index.html').is_file():errors.append('Missing link '+path+' on '+route)
  if n['tag']=='form' and 'data-contact-form' in a:
   form=d.inner(n);counts['contact_forms']+=1
   if 'type="submit"' not in form or 'name="name"' not in form or 'required' not in form:errors.append('Invalid contact form '+route)
 if not any(n['tag']=='meta' and n['attrs'].get('name')=='description' for n in d.nodes):errors.append('Missing description '+route)
 if not any(n['attrs'].get('type')=='application/ld+json' for n in d.nodes):errors.append('Missing schema '+route)
 for ref in m.asset_references(s,'https://fixed.example'+route):
  u=urlsplit(ref)
  if u.netloc=='fixed.example':
   p=unquote(u.path)
   if p not in known404 and not (D/p.lstrip('/')).is_file():errors.append('Missing resource '+p+' '+route)
reviews=json.loads((W/'customer-reviews.json').read_text());home=(D/'index.html').read_text()
if len(reviews['items'])!=3 or len(set(x['name'] for x in reviews['items']))!=3:errors.append('Expected three distinct verified reviews')
for r in reviews['items']:
 if r['quote'] not in home or r['url'].replace('&','&amp;') not in home:errors.append('Review/source mismatch')
for r in ['/window-shutters-with-remote-control/','/manual-shutter/','/interior-window-shutters/','/external-window-shutters/','/smart-shutter-windows/']:
 d=m.Document((D/r.lstrip('/')/'index.html').read_text());t=m.plain(d.inner(d.find(cls='post-content')))
 if len(t.split())<140:errors.append('Service details incomplete '+r)
assert (D/'about/index.html').is_file()
assert (D/'sitemap.xml').is_file()
assert 'Disallow: /' in (D/'robots.txt').read_text()
r={'status':'passed' if not errors else 'failed','checks':dict(counts),'verified_review_cards':3,'errors':errors,'browser_qa':'Native browser unavailable; no new visual sign-off claimed.'}
(W/'qa/fixes-verification.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(r,ensure_ascii=False,indent=2));sys.exit(bool(errors))
