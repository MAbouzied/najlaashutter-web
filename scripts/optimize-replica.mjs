import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {transform} from 'esbuild';
const root=path.resolve('wordpress-static/fixed-site');
const dir=path.join(root,'mirror-assets');
const replacements=new Map();let before=0,after=0;
for(const name of fs.readdirSync(dir)) {
 if(!/\.(?:jpe?g|png)$/i.test(name))continue;
 const file=path.join(dir,name),raw=fs.readFileSync(file);if(raw.length<12000)continue;
 const next=await sharp(raw).rotate().webp({quality:82,effort:5}).toBuffer();
 if(next.length>=raw.length*.9)continue;
 const newName=name.replace(/\.[^.]+$/,'.webp');fs.writeFileSync(path.join(dir,newName),next);
 replacements.set('/mirror-assets/'+name,'/mirror-assets/'+newName);before+=raw.length;after+=next.length;
}
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
for(const file of walk(root)) {
 if(!/\.(?:html|css|json)$/.test(file))continue;
 let s=fs.readFileSync(file,'utf8');for(const [a,b] of replacements)s=s.split(a).join(b);
 if(file.endsWith('.html'))s=s.replace(/<img\b[^>]*>/g,tag=> /pw-hgal-img/.test(tag)&&!tag.includes('loading=')?tag.replace('<img','<img loading="lazy" decoding="async"'):tag);
 fs.writeFileSync(file,s);
}
// Preserve captured image geometry. Adding HTML height to a width:100% image
// can stretch it: footer logos use w-100 without Bootstrap img-fluid.
// Responsive variants change only the image source candidates, not geometry.
const imageInfo=new Map();
for(const file of walk(root).filter(f=>f.endsWith('.html'))) {
 let text=fs.readFileSync(file,'utf8');
 const tags=[...text.matchAll(/<img\b[^>]*>/g)];
 for(const match of tags) {
  let tag=match[0];const src=/\bsrc=["']([^"']+)/.exec(tag)?.[1];
  if(!src?.startsWith('/mirror-assets/'))continue;
  const filePath=path.join(root,src);
  if(!fs.existsSync(filePath))continue;
  if(!imageInfo.has(src)) {try {imageInfo.set(src,await sharp(filePath).metadata());}catch {imageInfo.set(src,{});}}
  const info=imageInfo.get(src);if(!info.width||!info.height)continue;
  if(/fetchpriority="high"/.test(tag)&&!tag.includes('srcset=')&&info.width>768) {
   const sizes=[];
   for(const width of [480,768,1200].filter(w=>w<info.width)) {
    const variant=src.replace(/\.[^.]+$/,`-w${width}.webp`);
    if(!fs.existsSync(path.join(root,variant)))await sharp(filePath).resize({width,withoutEnlargement:true}).webp({quality:82,effort:5}).toFile(path.join(root,variant));
    sizes.push(`${variant} ${width}w`);
   }
   sizes.push(`${src} ${info.width}w`);
   const hero=tag.includes('d-block w-100');
   tag=tag.replace('<img',`<img srcset="${sizes.join(', ')}" sizes="${hero?'100vw':'(max-width: 767px) calc(100vw - 24px), (max-width: 991px) 72vw, 760px'}"`);
  }
  text=text.replace(match[0],tag);
 }
 fs.writeFileSync(file,text);
}
// Minification retains selectors, ordering and animations; no CSS purge.
for(const file of walk(root).filter(f=>f.endsWith('.css'))) {
 const result=await transform(fs.readFileSync(file,'utf8'),{loader:'css',minify:true,target:'es2020'});
 fs.writeFileSync(file,result.code);
}
// Content-address every served resource before assigning immutable cache headers.
for (const css of [false,true]) {
 const map=new Map();
 for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.css')===css)) {
  const raw=fs.readFileSync(path.join(dir,name));const digest=createHash('sha256').update(raw).digest('hex').slice(0,12);const next=digest+'-'+name;fs.writeFileSync(path.join(dir,next),raw);map.set('/mirror-assets/'+name,'/mirror-assets/'+next);
 }
 for(const file of walk(root).filter(f=>/\.(?:html|css|json|js)$/.test(f))) {let text=fs.readFileSync(file,'utf8');for(const [a,b] of map)text=text.split(a).join(b);fs.writeFileSync(file,text);}
}
const report={status:'completed',optimized_images:replacements.size,source_bytes:before,optimized_bytes:after,reduction_percent:Math.round((1-after/before)*100),note:'Stored image sizes only; not a measured page-load or Lighthouse score.'};
fs.writeFileSync('wordpress-static/qa/performance-optimization.json',JSON.stringify(report,null,2)+'\n');console.log(report);
