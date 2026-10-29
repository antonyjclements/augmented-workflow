const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/wren-idle.js'),'utf8');
function setup({reduced=false,stored=null,fail=false,defer=false,visible=true,theme='light',pose='perched'}={}) {
 let now=0,id=0,element;
 const timers=new Map(),rafs=new Map(),events={},pending=[];
 const rect={width:150,height:150,top:30,left:600,bottom:180,right:750};
 const image={complete:true,naturalWidth:627,className:'wren-hero',dataset:{wrenPose:pose,wrenTheme:theme},getAttribute:()=>`assets/wren/wren-${pose}.png`,replaceWith(node){element=node;}};
 const pref={matches:reduced,addEventListener:(name,fn)=>events.preference=fn};
 const button={setAttribute(k,v){this[k]=v;},addEventListener:(name,fn)=>events.click=fn};
 const document={hidden:false,querySelector:()=>button,querySelectorAll:()=>[image],addEventListener:(name,fn)=>events[name]=fn,
 createElement(){return {style:{},setAttribute(){},getBoundingClientRect:()=>visible?rect:{...rect,top:-100}};}};
 const storage={value:stored,getItem(){return this.value;},setItem(k,v){this.value=v;}};
 vm.runInNewContext(source,{document,localStorage:storage,matchMedia:()=>pref,innerWidth:1200,innerHeight:800,
 Image:class {set src(url){this.url=url;pending.push(this);if(!defer)(fail?this.onerror:this.onload)();}},
 setTimeout(fn,ms){timers.set(++id,{fn,at:now+ms});return id;},clearTimeout:id=>timers.delete(id),
 requestAnimationFrame(fn){rafs.set(++id,fn);return id;},cancelAnimationFrame:id=>rafs.delete(id),
 window:{addEventListener:(name,fn)=>events[name]=fn}});
 async function flush(){for(let i=0;i<8;i++)await Promise.resolve();}
 async function advance(ms){now+=ms;for(const [key,t] of [...timers])if(t.at<=now){timers.delete(key);t.fn();}await flush();}
 function frame(time){for(const [key,fn]of [...rafs]){rafs.delete(key);fn(time);}}
 return {get element(){return element;},rect,events,pref,button,document,storage,pending,timers,rafs,advance,frame,flush};
}
// TBS-013: pose changes inside a fixed box, never element movement.
test('waits 10 seconds, changes frames without moving the box, and returns to the original pose',async()=>{
 const s=setup();const original={...s.element.style};await s.advance(9999);assert.equal(s.pending.length,0);await s.advance(1);assert.equal(s.pending.length,4);
 s.frame(0);const first=s.element.style.backgroundPosition;s.frame(500);assert.notEqual(s.element.style.backgroundPosition,first);
 assert.equal(s.element.style.backgroundSize,'400% 200%');assert.equal(s.element.style.transform,undefined);assert.equal(s.element.style.left,undefined);assert.equal(s.element.style.top,undefined);
 s.frame(3500);assert.equal(s.rafs.size,0);assert.deepEqual(s.element.style,original);
});
for(const pose of ['perched','gathering','alert','in-flight'])for(const theme of ['light','dark'])test(`${pose} completes all four phases and returns home (${theme})`,async()=>{
 const s=setup({pose,theme});const original={...s.element.style};const next={'perched':'gathering','gathering':'alert','alert':'in-flight','in-flight':'perched'};
 await s.advance(10000);let current=pose;
 for(let segment=0;segment<4;segment++){
  s.frame(segment*875);assert.ok(s.element.style.backgroundImage.includes(`wren-${current}-to-${next[current]}-${theme}.png`));
  assert.equal(s.element.style.backgroundPosition,'0% 0%');current=next[current];
 }
 assert.equal(current,pose);s.frame(3500);assert.deepEqual(s.element.style,original);assert.equal(s.rafs.size,0);
 await s.advance(10000);s.frame(5000);assert.ok(s.element.style.backgroundImage.includes(`wren-${pose}-to-${next[pose]}-${theme}.png`));
});
for(const event of ['pointermove','pointerdown','keydown','scroll','touchstart','wheel','resize'])test(`${event} interrupts playback and restores the resting pose`,async()=>{
 const s=setup();const rest={...s.element.style};await s.advance(10000);s.frame(0);s.frame(500);s.events[event]();assert.deepEqual(s.element.style,rest);assert.equal(s.rafs.size,0);await s.advance(9999);assert.equal(s.rafs.size,0);await s.advance(1);assert.equal(s.rafs.size,1);
});
// TBS-014: preferences and lifecycle.
test('reduced motion prevents playback and reacts to runtime changes',async()=>{
 const s=setup({reduced:true});await s.advance(10000);assert.equal(s.pending.length,0);assert.equal(s.button.disabled,true);
 s.pref.matches=false;s.events.preference();await s.advance(10000);s.frame(0);s.pref.matches=true;s.events.preference();assert.equal(s.rafs.size,0);assert.equal(s.timers.size,0);
});
test('toggle persists off state and restores the choice on a new page',async()=>{
 const s=setup();s.events.click();assert.equal(s.storage.value,'off');await s.advance(10000);assert.equal(s.pending.length,0);assert.equal(setup({stored:'off'}).timers.size,0);
 s.events.click();await s.advance(10000);assert.equal(s.rafs.size,1);
});
test('hidden tabs and pagehide cancel motion; returning starts a fresh idle interval',async()=>{
 const s=setup();await s.advance(10000);s.frame(0);s.document.hidden=true;s.events.visibilitychange();assert.equal(s.rafs.size,0);assert.equal(s.timers.size,0);
 s.document.hidden=false;s.events.visibilitychange();await s.advance(9999);assert.equal(s.rafs.size,0);await s.advance(1);assert.equal(s.rafs.size,1);s.events.pagehide();assert.equal(s.rafs.size,0);s.events.pageshow();assert.equal(s.timers.size,1);
});
// TBS-015: lazy loading, stable artwork, theme matching, and cancellation races.
test('offscreen birds cause no image downloads or playback',async()=>{const s=setup({visible:false});await s.advance(10000);assert.equal(s.pending.length,0);});
test('dark-section Wren uses the light-colored dark sheet',async()=>{const s=setup({theme:'dark'});await s.advance(10000);assert.match(s.pending[0].url,/-dark\.png$/);});
test('failed sheet leaves resting artwork visible and is retried later',async()=>{
 const s=setup({fail:true});const rest={...s.element.style};await s.advance(10000);assert.deepEqual(s.element.style,rest);assert.equal(s.rafs.size,0);await s.advance(10000);assert.equal(s.pending.length,8);
});
test('interaction during loading prevents stale playback',async()=>{
 const s=setup({defer:true});await s.advance(10000);s.events.pointerdown();s.pending.forEach(image=>image.onload());await s.flush();assert.equal(s.rafs.size,0);
});
