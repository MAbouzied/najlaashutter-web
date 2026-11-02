import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const out=await build({entryPoints:['src/worker.ts'],bundle:true,write:false,format:'esm',platform:'browser'});
fs.writeFileSync('/tmp/najlaa-worker-test.mjs',out.outputFiles[0].text);
const {default:worker}=await import('file:///tmp/najlaa-worker-test.mjs');
const calls=[];
const assets={async fetch(req){
 const u=new URL(req.url);calls.push(u);
 const name=decodeURI(u.pathname);let f=path.resolve('dist','.'+name);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
 if(!fs.existsSync(f))return new Response(fs.readFileSync('dist/404.html'),{status:404,headers:{'Content-Type':'text/html'}});
 return new Response(fs.readFileSync(f),{headers:{'Content-Type':f.endsWith('.html')?'text/html':f.endsWith('.css')?'text/css':'application/octet-stream'}});
}};
let checks=0;
for(const [host,p,expect,en,blocked] of [
 ['najlaashutter.com','/',200,false,false],
 ['najlaashutter.com','/contact-us/',200,false,false],
 ['najlaashutter.com','/window-shutters-jeddah/?utm_source=google',200,false,true],
 ['najlaashutter.com','/en/',200,true,true],
 ['ads.najlaashutter.com','/?utm_source=google',200,false,true],
 ['ads.najlaashutter.com','/en/',200,true,true],
 ['najlaashutter-web.mohamed-abouzied.workers.dev','/',200,false,true],
 ['najlaashutter.com','/does-not-exist/',404,false,false]]){
 const r=await worker.fetch(new Request('https://'+host+p),{ASSETS:assets});assert.equal(r.status,expect);const html=await r.text();
 if(en)assert.ok(/lang="en"/.test(html));
 if(expect===200) {assert.equal(!!r.headers.get('X-Robots-Tag'),blocked);if(host==='ads.najlaashutter.com'&&p.startsWith('/?')) {assert.equal(calls.at(-1).pathname,'/window-shutters-jeddah/');assert.equal(calls.at(-1).searchParams.get('utm_source'),'google');assert.ok(html.includes('https://ads.najlaashutter.com/'));}if(host.includes('workers.dev'))assert.ok(!html.includes('gtm.start'));}
 assert.ok(r.headers.has('X-Najlaa-Release'));checks++;
}
for(const p of ['/about/','/about']) {const r=await worker.fetch(new Request('https://najlaashutter.com'+p+'?x=1'),{ASSETS:assets});assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://najlaashutter.com/about-us/?x=1');checks++;}
const www=await worker.fetch(new Request('https://www.najlaashutter.com/en/?x=1'),{ASSETS:assets});assert.equal(www.headers.get('location'),'https://najlaashutter.com/en/?x=1');checks++;
for(const host of ['najlaashutter.com','ads.najlaashutter.com','preview.workers.dev']) {const r=await worker.fetch(new Request('https://'+host+'/robots.txt'),{ASSETS:assets});const s=await r.text();assert.ok(s.includes('User-agent: AdsBot-Google\nAllow: /'));assert.equal(s.includes('Sitemap:'),host==='najlaashutter.com');checks++;}
const sample=fs.readdirSync('dist/mirror-assets').find(x=>x.endsWith('.webp'));const cached=await worker.fetch(new Request('https://najlaashutter.com/mirror-assets/'+sample),{ASSETS:assets});assert.ok(cached.headers.get('Cache-Control').includes('immutable'));checks++;
for(const p of ['/','/window-shutters-jeddah/','/en/']) {const f='dist'+p+'index.html',s=fs.readFileSync(f,'utf8');assert.ok(s.includes('GTM-WXVGK7F4'));assert.ok(!s.includes('GT-5D482QCG'));if(p==='/')assert.ok(s.includes('data-contact-form'));else assert.ok(s.includes('data-conversion="whatsapp"')&&s.includes('data-conversion="phone"'));checks++;}
console.log(JSON.stringify({status:'passed',checks,scope:'Actual Worker module with local static binding; no live deployment assertion.'},null,2));

const robots = await (await worker.fetch(new Request('https://najlaashutter.com/robots.txt'),{ASSETS:assets})).text();
assert.ok(!robots.includes('Disallow: /en/'),'Google can crawl the ads noindex directive');
const runtime = await worker.fetch(new Request('https://najlaashutter.com/fixes-runtime.js'),{ASSETS:assets});
assert.equal(runtime.headers.get('Cache-Control'),'public, max-age=0, must-revalidate');
const paid = await worker.fetch(new Request('https://ads.najlaashutter.com/?gclid=test-click&utm_campaign=test-campaign'),{ASSETS:assets});
assert.equal(calls.at(-1).searchParams.get('gclid'),'test-click');
assert.equal(calls.at(-1).searchParams.get('utm_campaign'),'test-campaign');
console.log('Additional crawler, mutable-asset cache and ad attribution checks passed.');
