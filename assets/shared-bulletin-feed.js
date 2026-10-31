(()=>{'use strict';
const API='https://script.google.com/macros/s/AKfycbxh6n5kWfC5LC_3MjWJYjfAmNcCjr7kJz9WU_yGgncuU2UaXlgOHgmTNnPwa2WH4O1oLw/exec';
const normalize=s=>String(s||'').replace(/\s+/g,'');
const relevant=()=>[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getClientRects().length&&/주보/.test(h.textContent||'')&&h.textContent.length<55);
let cache=null,at=0,busy=false;
async function load(){if(cache&&Date.now()-at<30000)return cache;const r=await fetch(API+'?action=getBulletins',{cache:'no-store'});if(!r.ok)throw Error('bulletin API '+r.status);const j=await r.json();if(j.result!=='success')throw Error('bulletin response');cache=(j.bulletins||[]).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));at=Date.now();return cache}
function render(posts){
 for(const h of relevant()){
  const section=h.closest('section,article,[class*="bulletin"]')||h.parentElement?.parentElement;
  if(!section)continue;
  let host=section.querySelector('#hb-shared-bulletin-feed');
  if(!host){host=document.createElement('div');host.id='hb-shared-bulletin-feed';host.style.cssText='margin:14px 0;padding:12px 14px;background:#f3f8fc;border:1px solid #dce8f0;border-radius:12px';h.insertAdjacentElement('afterend',host)}
  if(!posts.length){host.style.display='none';continue}
  const latest=posts[0],url=latest.cafeUrl||'';
  if(host.dataset.url===url&&host.dataset.date===latest.date)return;
  host.dataset.url=url;host.dataset.date=latest.date||'';
  host.replaceChildren();
  const meta=document.createElement('strong');meta.textContent='최신 등록 주보 · '+(latest.date||'')+' '+(latest.title||latest.dayType||'교회 주보');meta.style.cssText='display:block;color:#28536e;margin-bottom:8px';host.append(meta);
  if(/^https?:\/\//.test(url)){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='최신 주보 원본 보기 ↗';link.style.cssText='display:inline-block;padding:9px 14px;background:#e5f1fa;border-radius:8px;color:#225779;font-weight:700;text-decoration:none';host.append(link)}
  if(section.querySelector('#hb-november-first-bulletin')&&latest.date>'2026-11-01'){
   section.querySelector('#hb-november-first-bulletin').style.display='none';
  }
 }
}
async function tick(){if(busy||!relevant().length)return;busy=true;try{render(await load())}catch(e){console.warn('주보 연동:',e.message)}finally{busy=false}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
addEventListener('hashchange',()=>{cache=null;tick()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){cache=null;tick()}});
new MutationObserver(()=>{if(!busy&&cache)render(cache)}).observe(document.documentElement,{childList:true,subtree:true});
})();