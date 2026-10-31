(()=>{'use strict';
const PAGES=[
'https://files.mallary.ai/uploads/900/chatgpt_1793444947230_bf066151de14f8d1.png',
'https://files.mallary.ai/uploads/900/chatgpt_1793444952790_16e3c7d345f4ffde.png',
'https://files.mallary.ai/uploads/900/chatgpt_1793444957877_10bec27b7e245292.png'];
const LABEL='이번주교회주보';
function findHeads(){return [...document.querySelectorAll('h1,h2,h3,h4,h5')].filter(e=>/이번\s*주\s*교회\s*주보|교회\s*주보\s*미리보기/.test(e.textContent.trim())&&e.textContent.length<80)}
function make(tag,css,text){const e=document.createElement(tag);if(css)e.style.cssText=css;if(text)e.textContent=text;return e}
function display(){
 if(location.hash && !/^#\/?(?:index|home)?$/.test(location.hash))return;
 const heads=findHeads();if(!heads.length)return;
 for(const h of heads){
  const box=h.closest('section,article,[class*="bulletin"]')||h.parentElement?.parentElement;
  if(!box||box===document.body)continue;
  // Build one reliable image viewer, rather than mutate several independently rendered galleries.
  let viewer=box.querySelector('#hb-canonical-bulletin-viewer');
  if(!viewer){
   viewer=make('section','display:block!important;width:100%;max-width:none;margin:18px auto 8px');
   viewer.id='hb-canonical-bulletin-viewer';box.style.setProperty('max-width','none','important');
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
  if(!headRow){headRow=make('div','');headRow.id='hb-bulletin-heading-row';h.parentNode.insertBefore(headRow,h);headRow.append(h)}
  headRow.style.cssText='display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:space-between!important;gap:6px!important;width:100%!important;max-width:100%!important;margin:0 0 12px!important';
  h.textContent=LABEL;
  h.setAttribute('aria-label',LABEL);

  h.style.cssText='margin:0!important;padding:0!important;flex:1 1 auto!important;min-width:0!important;font-size:clamp(15px,2.6vw,25px)!important;white-space:nowrap!important';
  let actions=headRow.querySelector('#hb-bulletin-actions');
  if(!actions){actions=make('div','');actions.id='hb-bulletin-actions';headRow.append(actions)}
  actions.style.cssText='display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-end!important;gap:5px!important;width:auto!important;min-width:0!important;flex:0 0 auto!important;margin:0!important;padding:0!important';
  const btns=[['업로드','/admin/bulletin.html'],['주보게시판','#/news-2']];
  for(const old of [...actions.querySelectorAll('a')]){
    if(!btns.some(([,href])=>old.getAttribute('href')===href))old.remove();
  }
  for(const [label,url] of btns){
    let a=actions.querySelector('[data-hb-bulletin-action="'+url+'"]');
    if(!a){a=document.createElement('a');a.dataset.hbBulletinAction=url;a.href=url;a.textContent=label;actions.append(a)}
    a.style.cssText='display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;padding:8px 9px!important;margin:0!important;border-radius:8px!important;border:1px solid #cee0ec!important;white-space:nowrap!important;font-size:clamp(10px,1.9vw,13px)!important;text-decoration:none!important;background:#fff!important;color:#215476!important';
  }
  // Existing buttons are moved out of sight; only this shared action row is visible.
  for(const other of box.querySelectorAll('a,button')){
    if(actions.contains(other)||viewer.contains(other))continue;
    const value=(other.textContent||'').replace(/\\s+/g,'');
    if(value.includes('이번주교회주보업로드')||value.includes('주보게시판'))other.style.setProperty('display','none','important');
  }
  // Force header and both actions into a single horizontal line.
  headRow.style.setProperty('display','flex','important');
  headRow.style.setProperty('flex-direction','row','important');
  headRow.style.setProperty('flex-wrap','nowrap','important');
  headRow.style.setProperty('align-items','center','important');
  headRow.style.setProperty('justify-content','space-between','important');
  actions.style.setProperty('display','flex','important');
  actions.style.setProperty('flex-direction','row','important');
  actions.style.setProperty('flex-wrap','nowrap','important');
  for(const a of actions.querySelectorAll('a'))if(a.href.includes('bulletin.html'))a.textContent='업로드';
  // Hide duplicated standalone upload pills, without hiding the two heading actions.
  for(const el of box.querySelectorAll('a,button')){
    if(actions.contains(el)||viewer.contains(el))continue;
    if(/^(이번\\s*주\\s*교회주보\\s*업로드|이번주교회주보업로드|주보\\s*게시판)$/.test((el.textContent||'').trim()))el.style.setProperty('display','none','important');
  }
  if(headRow.nextElementSibling!==viewer)headRow.insertAdjacentElement('afterend',viewer);
  // The native book reader below the canonical viewer is a duplicate. Keep its code/data intact but remove its visual footprint.
  for(const legacy of box.querySelectorAll('.hb-book-reader,.hb-book-controls,.hb-book-heading>a[href="#/news-2"]')){
   if(!viewer.contains(legacy))legacy.style.setProperty('display','none','important');
  }
  // Remove secondary bulletin gallery blocks, preserving only the current 3-page canonical viewer.
  for(const legacy of box.querySelectorAll('#hb-home-latest-bulletin-restored,#hb-home-latest-bulletin,#hb-community-uploaded-bulletin')){
   if(!viewer.contains(legacy))legacy.style.setProperty('display','none','important');
  }
  // Make the canonical bulletin align with the available width of the page.
  box.style.setProperty('width','100%','important');
  box.style.setProperty('max-width','none','important');
  viewer.style.setProperty('width','100%','important');
  viewer.style.setProperty('max-width','none','important');
  // Hide legacy feed, static November gallery and any old dated gallery, without touching the new viewer.
  for(const selector of ['#hb-shared-bulletin-feed','#hb-november-first-bulletin','#hb-bulletin-20261025','#hb-home-latest-bulletin','#hb-home-latest-bulletin-restored','#hb-bulletin-one-line-actions','#hb-bulletin-inline-actions']){
   for(const el of box.querySelectorAll(selector))if(!viewer.contains(el)&&el!==actions)el.style.setProperty('display','none','important');
  }
  // Retain the single main viewer; remove secondary bulletin images/cards below it.
  if(!location.hash||/^#\/?(?:home)?$/.test(location.hash)){
    for(const img of [...box.querySelectorAll('img')]){
      if(viewer.contains(img))continue;
      if(img.src.includes('chatgpt_179344')){
        const anchor=img.closest('a[href]');
        const card=anchor?.parentElement;
        if(card && card.querySelectorAll('img').length>=2 && !card.contains(viewer)){
          card.remove();
        }else if(anchor && !anchor.contains(viewer))anchor.remove();
        else if(!img.contains(viewer))img.remove();
      }
    }
  }
  for(const el of box.querySelectorAll('p,small,span'))if(!viewer.contains(el)&&el.children.length===0&&/주보를 한 페이지씩 넘기고/.test(el.textContent||''))el.style.setProperty('display','none','important');
 }
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;display()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();