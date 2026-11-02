import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const code=fs.readFileSync('wordpress-static/fixed-site/mirror-assets/29bf278110c1f70de628f916.js','utf8');
function run(selectors, withLibraries) {
 const calls=[];
 const jq=()=>new Proxy({},{get:()=>()=>jq()});
 const context={document:{querySelectorAll:()=>[],querySelector:s=>selectors.includes(s)?{}:null},
  window:{},jQuery:f=>typeof f==='function'?f():jq()};
 if(withLibraries){
  context.Swiper=function(selector,options){calls.push({selector,options});};
  context.Fancybox={bind(){}};context.AOS={init(){}};
  Object.assign(context.window,{Swiper:context.Swiper,Fancybox:context.Fancybox,AOS:context.AOS});
 }
 vm.runInNewContext(code,context);
 return calls;
}
assert.equal(run([],false).length,0,'Contact page works with gallery/slider libraries omitted');
assert.equal(run([],true).length,0,'No empty Swiper instances');
const home=run(['.pw-hom-swp1','.pw-hom-swp2','.pw-hom-swp3','.pw-hom-swp4'],true);
assert.equal(home.length,4);
assert.deepEqual(home.map(c=>c.options.autoplay.delay),[2500,5000,3000,3500]);
assert.equal(home[2].options.loop,true);
console.log('Template runtime: omitted-library guards and all 4 original autoplay settings passed.');
