(()=>{'use strict';
const images=["https://files.mallary.ai/uploads/900/chatgpt_1793444947230_bf066151de14f8d1.png","https://files.mallary.ai/uploads/900/chatgpt_1793444952790_16e3c7d345f4ffde.png","https://files.mallary.ai/uploads/900/chatgpt_1793444957877_10bec27b7e245292.png"];
function run(){
 const heads=[...document.querySelectorAll('h1,h2,h3,h4,h5')].filter(h=>h.getClientRects().length&&/이번\s*주\s*교회\s*주보|교회\s*주보/.test(h.textContent||'')&&h.textContent.trim().length<65);
 for(const h of heads){
  const box=h.closest('section,article,[class*="bulletin"]')||h.parentElement?.parentElement;
  if(!box||box===document.body)continue;
  const buttons=[...box.querySelectorAll('a,button')].filter(e=>/이번\s*주\s*교회\s*주보\s*업로드|주보\s*게시판/.test(e.textContent||''));
  let header=box.querySelector('#hb-bulletin-inline-heading');
  if(!header){header=document.createElement('div');header.id='hb-bulletin-inline-heading';header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:nowrap;width:100%;margin:0 0 12px';h.parentElement.insertBefore(header,h);header.append(h)}
  h.style.cssText+=';margin:0!important;flex:0 1 auto;min-width:0;font-size:clamp(15px,2.8vw,26px)';
  let actions=header.querySelector('#hb-bulletin-inline-actions');
  if(!actions){actions=document.createElement('div');actions.id='hb-bulletin-inline-actions';actions.style.cssText='display:flex;gap:6px;align-items:center;justify-content:flex-end;flex:0 1 auto;white-space:nowrap';header.append(actions)}
  buttons.forEach(b=>{actions.append(b);b.style.cssText+=';display:inline-flex!important;width:auto!important;flex:0 0 auto!important;min-width:0!important;max-width:none!important;white-space:nowrap!important;padding:8px 9px!important;margin:0!important;font-size:clamp(10px,1.7vw,13px)!important;line-height:1.2!important;box-sizing:border-box!important'});
  for(const old of [...box.querySelectorAll('#hb-bulletin-one-line-actions')])if(!old.children.length)old.remove();
  const title=box.querySelector('h2,h3,h4');if(title&&/2026년\s*10월\s*25일/.test(title.textContent))title.textContent='2026년 11월 1일 교회 주보';
  let gallery=box.querySelector('#hb-november-first-bulletin');
  if(!gallery){gallery=document.createElement('div');gallery.id='hb-november-first-bulletin';header.insertAdjacentElement('afterend',gallery)}
  gallery.style.cssText='width:100%;margin:14px 0;display:flex;flex-direction:column;align-items:center;gap:10px';
  if(!gallery.querySelector('[data-bulletin-slide]')){
   const viewer=document.createElement('div');viewer.dataset.bulletinSlide='1';viewer.style.cssText='width:100%;position:relative';
   const link=document.createElement('a');link.href=images[0];link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='display:block;width:100%';
   const img=document.createElement('img');img.src=images[0];img.alt='이번 주 교회 주보 1쪽';img.style.cssText='width:100%;height:auto;display:block;object-fit:contain;border-radius:8px;border:1px solid #dce7ed';link.append(img);viewer.append(link);
   const nav=document.createElement('div');nav.style.cssText='display:flex;align-items:center;justify-content:center;gap:14px';
   const back=document.createElement('button');back.type='button';back.textContent='‹ 이전';const count=document.createElement('span');count.textContent='1 / 3';const next=document.createElement('button');next.type='button';next.textContent='다음 ›';
   for(const b of [back,next])b.style.cssText='border:1px solid #cadbe5;background:#f5f9fc;border-radius:9px;padding:9px 17px;cursor:pointer;font-weight:700;color:#24546d';
   let index=0;const change=n=>{index=(n+images.length)%images.length;img.src=images[index];img.alt='이번 주 교회 주보 '+(index+1)+'쪽';link.href=images[index];count.textContent=(index+1)+' / '+images.length};back.onclick=()=>change(index-1);next.onclick=()=>change(index+1);
   nav.append(back,count,next);gallery.append(viewer,nav);
  }
  // Hide legacy thumbnail strips only; preserve the new single-page viewer.
  const legacy=[...box.querySelectorAll('img')].filter(im=>!gallery.contains(im)&&/mallary|주보|bulletin/.test(im.src+' '+im.alt));
  legacy.forEach(im=>{const container=im.closest('a')||im;if(container.parentNode)container.remove()});
 }
}
let busy=false;function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;run()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();