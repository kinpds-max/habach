(()=>{'use strict';
const PAGES=[
'https://files.mallary.ai/uploads/900/chatgpt_1793444947230_bf066151de14f8d1.png',
'https://files.mallary.ai/uploads/900/chatgpt_1793444952790_16e3c7d345f4ffde.png',
'https://files.mallary.ai/uploads/900/chatgpt_1793444957877_10bec27b7e245292.png'];
const LABEL='이번 주 교회주보';
function findHeads(){return [...document.querySelectorAll('h1,h2,h3,h4,h5')].filter(e=>/이번\s*주\s*교회\s*주보|교회\s*주보\s*미리보기/.test(e.textContent.trim())&&e.textContent.length<80)}
function make(tag,css,text){const e=document.createElement(tag);if(css)e.style.cssText=css;if(text)e.textContent=text;return e}
function display(){
 const heads=findHeads();if(!heads.length)return;
 for(const h of heads){
  const box=h.closest('section,article,[class*="bulletin"]')||h.parentElement?.parentElement;
  if(!box||box===document.body)continue;
  // Build one reliable image viewer, rather than mutate several independently rendered galleries.
  let viewer=box.querySelector('#hb-canonical-bulletin-viewer');
  if(!viewer){
   viewer=make('section','display:block!important;width:100%;max-width:860px;margin:18px auto 8px');
   viewer.id='hb-canonical-bulletin-viewer';
   const link=make('a','display:block;width:100%');link.target='_blank';link.rel='noopener noreferrer';
   const image=make('img','display:block;width:100%;height:auto;max-height:1100px;object-fit:contain;border-radius:9px;border:1px solid #d9e5ed');
   image.alt='2026년 11월 1일 교회 주보 1쪽';link.append(image);viewer.append(link);
   const controls=make('div','display:flex;justify-content:center;align-items:center;gap:14px;margin:14px 0');
   const prev=make('button','padding:9px 17px;border:1px solid #cadce8;border-radius:8px;background:white;color:#244b61;font-weight:700;cursor:pointer','‹ 이전');
   const count=make('span','font-weight:700;color:#35586f','1 / 3쪽');
   const next=make('button','padding:9px 17px;border:1px solid #cadce8;border-radius:8px;background:white;color:#244b61;font-weight:700;cursor:pointer','다음 ›');
   let index=0;function show(n){index=(n+PAGES.length)%PAGES.length;link.href=PAGES[index];image.src=PAGES[index];image.alt='2026년 11월 1일 교회 주보 '+(index+1)+'쪽';count.textContent=(index+1)+' / '+PAGES.length+'쪽'}
   prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);
   controls.append(prev,count,next);viewer.append(controls);
   const note=make('p','text-align:center;font-size:12px;color:#839ab0;margin:7px 0 0','주보를 한 페이지씩 넘기고, 이미지를 누르면 확대해서 볼 수 있습니다.');
   viewer.append(note);show(0);
  }
  let headRow=box.querySelector('#hb-bulletin-heading-row');
  if(!headRow){headRow=make('div','display:flex;flex-wrap:nowrap;align-items:center;justify-content:space-between;gap:8px;width:100%');headRow.id='hb-bulletin-heading-row';h.parentNode.insertBefore(headRow,h);headRow.append(h)}
  h.textContent=LABEL;h.style.cssText+=';margin:0!important;flex:1 1 auto;min-width:0';
  let actions=headRow.querySelector('#hb-bulletin-actions');
  if(!actions){actions=make('div','display:flex;align-items:center;gap:6px;flex:0 0 auto;white-space:nowrap');actions.id='hb-bulletin-actions';headRow.append(actions)}
  const candidates=[...box.querySelectorAll('a,button')].filter(el=>!viewer.contains(el)&&/이번\s*주\s*교회\s*주보\s*업로드|주보\s*게시판/.test(el.textContent||''));
  for(const el of candidates.slice(0,2)){actions.append(el);el.style.cssText+=';display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;width:auto!important;max-width:none!important;margin:0!important;padding:8px 9px!important;font-size:clamp(10px,2.4vw,13px)!important;white-space:nowrap!important'}
  if(headRow.nextElementSibling!==viewer)headRow.insertAdjacentElement('afterend',viewer);
  // Hide legacy feed, static November gallery and any old dated gallery, without touching the new viewer.
  for(const selector of ['#hb-shared-bulletin-feed','#hb-november-first-bulletin','#hb-bulletin-20261025','#hb-home-latest-bulletin','#hb-home-latest-bulletin-restored','#hb-bulletin-one-line-actions','#hb-bulletin-inline-actions']){
   for(const el of box.querySelectorAll(selector))if(!viewer.contains(el)&&el!==actions)el.style.setProperty('display','none','important');
  }
  for(const el of box.querySelectorAll('p,small,span'))if(!viewer.contains(el)&&el.children.length===0&&/주보를 한 페이지씩 넘기고/.test(el.textContent||''))el.style.setProperty('display','none','important');
 }
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;display()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();