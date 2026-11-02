import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync(new URL('./fixes-runtime.js',import.meta.url),'utf8');
function setup({share=false,clipboard=false}={}) {
 const listeners={},fields={name:{value:'',setCustomValidity(v){this.error=v;}},message:{value:'',setCustomValidity(v){this.error=v;}}};
 const status={textContent:'',items:[],append(x){this.items.push(x);},replaceChildren(x){this.items=[x];}};
 const form={querySelector(s){return s==='[name=name]'?fields.name:s==='[name=message]'?fields.message:status;},querySelectorAll(){return Object.values(fields).map(f=>({...f,addEventListener(){}}));},addEventListener(e,f){listeners['form:'+e]=f;},reportValidity(){return !fields.name.error&&!fields.message.error;}};
 const shareStatus={...status,items:[]};
 const document={title:'تواصل معنا',querySelector(){return {textContent:'تواصل معنا'};},querySelectorAll(s){return s==='form[data-contact-form]'?[form]:[];},getElementById(id){if(id==='pw-share')return {addEventListener(e,f){listeners['share:'+e]=f;}};if(id==='share-status')return shareStatus;return null;},createTextNode:s=>s,createElement:t=>({tag:t,setAttribute(){},focus(){},select(){}}),documentElement:{classList:{toggle(){}}}};
 const opened=[],shared=[],copied=[];
 const navigator={};if(share)navigator.share=async x=>shared.push(x);if(clipboard)navigator.clipboard={writeText:async x=>copied.push(x)};
 const window={open:(...args)=>opened.push(args),matchMedia:()=>({matches:false,addEventListener(){}})};
 const context={window,document,navigator,location:{pathname:'/contact-us/',search:'?utm_source=google&utm_campaign=جدة&unrelated=secret'},URL,URLSearchParams,addEventListener(){},Error};vm.runInNewContext(code,context);
 return {listeners,fields,opened,shared,copied,status:shareStatus,window};
}
let checks=0;
const s=setup();
for(const message of ['طلب مقاسات جديدة','Price & installation + warranty #1','100% مناسب؟','سطر أول\nسطر ثاني','https://example.com/?a=1&b=2']) {
 s.fields.name.value='محمد & أحمد';s.fields.message.value=message;
 s.listeners['form:submit']({preventDefault(){}});
 const u=new URL(s.opened.at(-1)[0]);assert.equal(u.searchParams.get('phone'),'966535344170');assert.equal([...u.searchParams.keys()].sort().join(','),'phone,text');const text=u.searchParams.get('text');assert.ok(text.includes(message));assert.ok(text.includes('محمد & أحمد'));assert.ok(text.includes('utm_source=google'));assert.ok(!text.includes('unrelated=secret'));checks++;
}
const before=s.opened.length;s.fields.name.value='   ';s.fields.message.value='طلب';s.listeners['form:submit']({preventDefault(){}});assert.equal(s.opened.length,before);checks++;
s.fields.name.value='محمد';s.fields.message.value=' ';s.listeners['form:submit']({preventDefault(){}});assert.equal(s.opened.length,before);checks++;
// No keyup or input event: current autofilled/pasted values must still be used.
s.fields.name.value='تعبئة آلية';s.fields.message.value='لصق بالماوس & تفاصيل';s.listeners['form:submit']({preventDefault(){}});assert.ok(new URL(s.opened.at(-1)[0]).searchParams.get('text').includes('لصق بالماوس & تفاصيل'));checks++;
const c=setup({clipboard:true});await c.listeners['share:click']();assert.equal(c.copied[0],'https://najlaashutter.com/contact-us/');checks++;
const sh=setup({share:true});await sh.listeners['share:click']();assert.equal(sh.shared[0].url,'https://najlaashutter.com/contact-us/');checks++;
const fallback=setup();await fallback.listeners['share:click']();assert.equal(fallback.status.items.at(-1).value,'https://najlaashutter.com/contact-us/');checks++;
console.log(JSON.stringify({status:'passed',checks,scope:'Actual repair runtime with form/clipboard/window adapters; no messages sent and no real browser claim.'},null,2));
