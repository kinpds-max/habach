(()=>{'use strict';
const home=()=>!location.hash||/^#\/?(?:home)?$/.test(location.hash);
function fix(){
 // Hide ornamental CHURCH BULLETIN eyebrow, not the Korean heading.
 for(const e of document.querySelectorAll('span,small,p,div'))if(e.children.length===0&&e.textContent.trim()==='CHURCH BULLETIN')e.style.display='none';
 // Keep exactly one image viewer and move its help text underneath the pagination.
 const viewer=document.getElementById('hb-canonical-bulletin-viewer');
 if(viewer){const notes=[...document.querySelectorAll('p,small,span')].filter(e=>e.children.length===0&&/주보를 한 페이지씩 넘기고/.test(e.textContent||''));notes.forEach(e=>{if(!viewer.contains(e))e.remove()})}
 const heading=[...document.querySelectorAll('h1,h2,h3,h4')].find(e=>/이번\s*주\s*교회\s*주보/.test(e.textContent||'')&&e.textContent.length<40);
 if(heading){const box=heading.closest('section,article,[class*="bulletin"]')||heading.parentElement?.parentElement;const bar=box?.querySelector('#hb-bulletin-heading-row');const actions=bar?.querySelector('#hb-bulletin-actions');if(bar&&actions){bar.style.cssText+=';display:flex!important;flex-wrap:nowrap!important;align-items:center!important';actions.style.cssText+=';display:flex!important;flex-wrap:nowrap!important;gap:6px!important;width:auto!important;flex:0 0 auto!important';}}
 for(const e of document.querySelectorAll('small,span,div'))if(e.children.length===0&&/목사\s*[·ㆍ]\s*담당\s*문의/.test(e.textContent||''))e.textContent=e.textContent.replace(/목사\s*[·ㆍ]\s*담당\s*문의/,'담당 · 대표 문의');
 // Remove only the Kakao map card and Kakao buttons; keep the Naver map.
 const kakao=[...document.querySelectorAll('a,button')].filter(e=>/카카오맵에서\s*(지도\s*)?보기|카카오맵에서\s*지도\s*보기/.test(e.textContent||''));
 for(const e of kakao){
   const card=e.closest('.card,[class*="map-card"],[class*="map-preview"]');
   if(card&&!card.querySelector('#hb-naver-map-location')&&!/네이버\s*지도/.test(card.textContent||'')){card.remove();continue}
   const box=e.closest('section,article');
   if(box&&!box.querySelector('#hb-naver-map-location')&&/김포\s*하늘바람교회/.test(box.textContent||'')&&(box.textContent||'').length<250){box.remove();continue}
   const panel=e.closest('div');
   if(panel&&panel.parentElement&&!panel.parentElement.querySelector('#hb-naver-map-location')&&/김포\s*하늘바람교회/.test(panel.parentElement.textContent||'')&&(panel.parentElement.textContent||'').length<250){panel.parentElement.remove();continue}
   e.remove();
 }
 const navermap=document.getElementById('hb-naver-map-location');
 if(navermap&&!document.getElementById('hb-church-location-video')){
  const block=document.createElement('section');block.id='hb-church-location-video';block.style.cssText='margin:18px 0 26px';
  const h=document.createElement('h3');h.textContent='하늘바람교회 영상';h.style.cssText='margin:0 0 12px;color:#24526b';
  const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/k-Q5Wjq7uPM';frame.loading='lazy';frame.title='하늘바람교회 영상 미리보기';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';frame.allowFullscreen=true;frame.style.cssText='display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:12px';
  block.append(h,frame);navermap.insertAdjacentElement('afterend',block);
 }
 // Remove repeated copies of the same Mission Bridge sermon from the Sunday album.
 const sunday=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getClientRects().length&&/주일설교\s*영상\s*앨범/.test(h.textContent||''));
 for(const heading of sunday){const root=heading.closest('section,article')||heading.parentElement?.parentElement;if(!root)continue;const cards=[...root.querySelectorAll('a[href*="youtube"],a[href*="youtu.be"]')].filter(a=>a.querySelector('img'));const seen=new Set();for(const a of cards){const id=a.href.match(/(?:watch\?v=|live\/|youtu\.be\/|shorts\/)([\w-]{11})/)?.[1]||a.dataset.video;if(!id)continue;if(seen.has(id))a.closest('[class*="card"],article')?.remove();else seen.add(id)}}
}

/* Keep video playback immediately below the clicked card's row on mobile.
   Also remove empty placeholder cards that leave white holes on the home page. */
const uiStyle=document.createElement('style');
uiStyle.textContent=`
#app .sermon-album-grid>.sermon-album-detail,#app .hb-static-sermon-grid>.sermon-album-detail,#app .home-video-six-grid>.sermon-album-detail{grid-column:1/-1!important;grid-row:auto!important;position:relative!important;margin:8px 0 12px!important;min-height:0!important}
#app .sermon-album-grid>.sermon-album-detail[hidden],#app .hb-static-sermon-grid>.sermon-album-detail[hidden]{display:none!important}
#app .sermon-album-grid{grid-auto-flow:row!important;align-items:start!important}
#app .sermon-album-grid>.sermon-album-card{grid-row:auto!important}
#app .sermon-player-frame{aspect-ratio:16/9!important;height:auto!important;min-height:0!important}
#app .sermon-player-frame iframe{width:100%!important;aspect-ratio:16/9!important}
`;
document.head.append(uiStyle);
let lastSelectedCard=null;
document.addEventListener('click',event=>{
 const card=event.target.closest?.('#app .sermon-album-grid .sermon-album-card,#app .hb-static-sermon-grid .sermon-album-card,#app .home-video-six-grid .sermon-album-card');
 if(card)lastSelectedCard=card;
},true);
let placing=false;
function fixInlinePlayers(){
 if(placing)return;
 for(const grid of document.querySelectorAll('#app .sermon-album-grid,#app .hb-static-sermon-grid,#app .home-video-six-grid')){
  const detail=grid.querySelector(':scope > .sermon-album-detail:not([hidden])');
  if(!detail)continue;
  const selected=lastSelectedCard&&grid.contains(lastSelectedCard)?lastSelectedCard:null;
  if(!selected)continue;
  const isHome=selected.closest('.home-six-item');
  const cards=[...grid.children].filter(el=>isHome?el.classList.contains('home-six-item'):el.classList.contains('sermon-album-card'));
  if(!cards.length)continue;
  const target=isHome||selected;
  const top=target.getBoundingClientRect().top;
  const row=cards.filter(c=>Math.abs(c.getBoundingClientRect().top-top)<14);
  const anchor=row[row.length-1]||target;
  if(detail.previousElementSibling!==anchor){
   placing=true;anchor.after(detail);placing=false;
  }
 }
}
const playerObserver=new MutationObserver(()=>requestAnimationFrame(fixInlinePlayers));
playerObserver.observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('click',()=>requestAnimationFrame(fixInlinePlayers));

let busy=false;function run(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;fix()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();addEventListener('hashchange',run);new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();