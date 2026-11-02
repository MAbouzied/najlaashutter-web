import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const staging=process.argv.includes('--staging');
const run=(bin,args,options={})=>execFileSync(bin,args,{stdio:'inherit',...options});
run('python3',['scripts/mirror-wordpress.py','build']);
run('python3',['scripts/verify-replica.py']);
run('python3',['scripts/improve-replica.py',...(staging?[]:['--production'])]);
run('python3',['scripts/prepare-performance-seo.py']);
run(process.execPath,['scripts/optimize-replica.mjs']);
run(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{env:{...process.env,PUBLIC_DISABLE_GTM:staging?'true':'false'}});
fs.cpSync('wordpress-static/fixed-site','dist',{recursive:true});
if(!fs.existsSync('dist/404.html')) fs.writeFileSync('dist/404.html','<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>الصفحة غير موجودة — نجلاء شتر</title><style>body{font-family:Arial,sans-serif;background:#f4f5f6;color:#13304e;max-width:650px;margin:12vh auto;padding:24px;line-height:2}a{color:#13304e}</style></head><body><h1>الصفحة غير موجودة</h1><p>يمكنك العودة إلى <a href="/">الرئيسية</a> أو <a href="/contact-us/">التواصل معنا</a>.</p></body></html>');
// Cache only immutable resources; the Worker decides indexing by actual host.
fs.writeFileSync('dist/_headers',staging?'/*\n  X-Robots-Tag: noindex, nofollow\n':'/mirror-assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=86400\n');
for(const route of ['window-shutters-jeddah','en']) {
 const file=`dist/${route}/index.html`;let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<meta\s+name=["']robots["'][^>]*>/gi,'').replace('</head>','<meta name="robots" content="noindex, follow"></head>');fs.writeFileSync(file,html);
}
run('python3',['scripts/prepare-performance-seo.py','--ads-only']);
run('python3',['scripts/verify-full-export.py']);
run('python3',['scripts/verify-performance-seo.py',...(staging?['--staging']:[])]);
run(process.execPath,['scripts/test-template-runtime.mjs']);
if(!staging) run(process.execPath,['scripts/test-full-site.mjs']);
console.log('Combined full site and Arabic/English landing pages in dist/');
