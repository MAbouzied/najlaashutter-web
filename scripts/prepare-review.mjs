// Copy a built release into the existing private review checkout. Never publish
// tracking or indexable copies to the private review origin.
import fs from 'node:fs';
import path from 'node:path';
const dest=process.argv[2];
if(!dest||!fs.existsSync(path.join(dest,'.openai/hosting.json')))throw Error('Existing review checkout required');
const output=path.join(dest,'dist');fs.rmSync(output,{recursive:true,force:true});fs.cpSync('dist',output,{recursive:true});
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
for(const f of walk(output).filter(f=>f.endsWith('.html'))) {
 let s=fs.readFileSync(f,'utf8');
 s=s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,tag=>/gtm\.start|googletagmanager\.com/.test(tag)?'':tag)
  .replace(/<noscript>[\s\S]*?googletagmanager\.com[\s\S]*?<\/noscript>/gi,'')
  .replace(/<meta\s+name=["']robots["'][^>]*>/gi,'')
  .replace('</head>','<meta name="robots" content="noindex,nofollow"></head>');
 fs.writeFileSync(f,s);
}
fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(output,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log('Private preview prepared with tracking removed and indexing disabled.');
