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
 // Hide the standalone pale green Kakao map card, preserving Naver map and other controls.
 const anchors=[...document.querySelectorAll('a')].filter(a=>/카카오맵에서 지도 보기/.test(a.textContent||''));
 anchors.forEach(a=>{const c=a.closest('section,article,.card,[class*="map-card"]')||a.parentElement; if(c&&!c.querySelector('#hb-naver-map-location'))c.style.display='none'});
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
let busy=false;function run(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;fix()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();addEventListener('hashchange',run);new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();