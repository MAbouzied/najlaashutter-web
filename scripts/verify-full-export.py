from pathlib import Path
import importlib.util,json,collections,sys
from urllib.parse import urlsplit,unquote
R=Path(__file__).resolve().parents[1];D=R/'dist';spec=importlib.util.spec_from_file_location('m',R/'scripts/mirror-wordpress.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
errors=[];pages=0;refs=set()
for f in D.rglob('*.html'):
 pages+=1;s=f.read_text();route='/'+str(f.relative_to(D)).removesuffix('index.html');d=m.Document(s)
 ids=collections.Counter(n['attrs']['id'] for n in d.nodes if n['attrs'].get('id'))
 if any(v>1 for v in ids.values()):errors.append('Duplicate IDs '+route)
 for ref in m.asset_references(s,'https://najlaashutter.com'+route):
  u=urlsplit(ref)
  if u.hostname=='najlaashutter.com':refs.add(unquote(u.path))
 for n in d.nodes:
  href=n['attrs'].get('href','')
  if n['tag']=='a' and href.startswith('/') and not href.startswith('//'):
   p=unquote(urlsplit(href).path)
   if p and not (D/p.lstrip('/')).is_file() and not (D/p.lstrip('/')/'index.html').is_file():errors.append('Missing navigation '+p+' on '+route)
for f in D.rglob('*.css'):
 for ref in m.asset_references(f.read_text(),'https://najlaashutter.com/'+str(f.relative_to(D)),css=True):
  u=urlsplit(ref)
  if u.hostname=='najlaashutter.com':refs.add(unquote(u.path))
for p in refs:
 if not (D/p.lstrip('/')).is_file():errors.append('Missing resource '+p)
r={'status':'passed' if not errors else 'failed','html_files':pages,'local_resource_targets':len(refs),'errors':errors};(R/'wordpress-static/qa/full-export.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2));sys.exit(bool(errors))
