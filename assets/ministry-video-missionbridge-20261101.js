(()=>{'use strict';
const VIDEO='nrGqSz59HD0';
const MISSION_LOGO='https://missionbridge.kr/assets/embedded/cb92e83c16385a09dcb13978.webp';
const route=()=>((location.hash||'').match(/^#\/?([\w-]+)/)||[])[1]||'index';
function addChurchVideo(){
 if(route()!=='sermon-6')return;
 const article=document.querySelector('#app article.article');
 if(!article)return;
 const old=[...article.querySelectorAll('a[href]')].find(a=>a.href.includes(VIDEO));
 if(old)return;
 let grid=article.querySelector('.hb-static-sermon-grid')||article.querySelector('.hb-unified-album');
 if(!grid){
  const h=[...article.querySelectorAll('h2,h3,h4')].find(h=>/교회영상/.test(h.textContent||''));
  if(!h)return;
  grid=document.createElement('div');grid.className='hb-static-sermon-grid hb-added-church-videos';
  (h.closest('.hb-static-board')||article).append(grid);
 }
 const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+VIDEO;a.target='_blank';a.rel='noopener noreferrer';
 a.dataset.video=VIDEO;a.className='sermon-album-card static-sermon-card';
 const thumb=document.createElement('span');thumb.className='sermon-album-thumb';
 const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+VIDEO+'/hqdefault.jpg';img.alt='하늘바람교회 영상 미리보기';img.loading='lazy';thumb.append(img);
 const title=document.createElement('span');title.className='sermon-album-copy';
 const strong=document.createElement('strong');strong.textContent='하늘바람교회 영상';title.append(strong);
 a.append(thumb,title);grid.prepend(a);
 loadTitle(VIDEO).then(t=>{if(t&&a.isConnected)strong.textContent=t});
}
const titleCache=new Map();
async function loadTitle(id){
 if(titleCache.has(id))return titleCache.get(id);
 const work=(async()=>{for(const endpoint of [
  'https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json',
  'https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)
 ]){try{const response=await fetch(endpoint);if(!response.ok)continue;const data=await response.json();if(typeof data.title==='string'&&data.title.trim()&&!/^youtube$/i.test(data.title.trim()))return data.title.trim()}catch(_){}}return ''})();
 titleCache.set(id,work);return work;
}
function fixWednesday(){
 if(!['sermon-2','index','home'].includes(route()))return;
 for(const a of document.querySelectorAll('a[data-video],a[href*="youtube.com/watch"]')){
  const id=a.dataset.video||a.href.match(/[?&]v=([a-zA-Z0-9_-]{11})/)?.[1];
  if(!id||!a.closest('.home-six-item,.hb-static-board,.hb-static-sermon-grid'))continue;
  const heading=route()==='sermon-2'||a.closest('.home-six-item')?.querySelector('.home-six-label')?.textContent.includes('수요설교');
  if(!heading)continue;
  const strong=a.querySelector('.sermon-album-copy strong,.video-title,.album-title');
  if(!strong||!/^\[?수요설교\]?\s*영상\s+[a-zA-Z0-9_-]{11}$/.test(strong.textContent.trim())||a.dataset.hbWednesdayTitleFetch===id)continue;
  a.dataset.hbWednesdayTitleFetch=id;
  loadTitle(id).then(t=>{if(!t||!a.isConnected)return;const normalized=t.replace(/\s+/g,' ').trim();if(/^(?:video unavailable|private video|youtube)$/i.test(normalized))return;strong.textContent=normalized;a.dataset.title=normalized;const image=a.querySelector('img');if(image)image.alt=normalized+' 썸네일'});
 }
}
function missionBridge(){
 if(route()!=='ministry-4')return;
 const article=document.querySelector('#app article.article');if(!article||article.querySelector('#hb-missionbridge-mission-card'))return;
 const card=document.createElement('section');card.id='hb-missionbridge-mission-card';
 const a=document.createElement('a');a.href='https://missionbridge.kr/';a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','미션브릿지 공식 홈페이지 열기');
 const image=document.createElement('img');image.src=MISSION_LOGO;image.alt='미션브릿지 공식 로고';image.loading='lazy';
 const info=document.createElement('span');info.innerHTML='<strong>미션브릿지</strong><small>선교사역과 열방을 위한 기도 · 공식 홈페이지 방문 ↗</small>';
 a.append(image,info);card.append(a);
 const board=article.querySelector('.detail-board,.hb-static-board,[class*="board"]');
 if(board)board.parentElement.insertBefore(card,board);else article.append(card);
}
function moveServiceBoard(){
 if(route()!=='ministry-5')return;
 const article=document.querySelector('#app article.article');if(!article)return;
 const original=article.querySelector('#hb-volunteer-original-content');
 const items=[...article.querySelectorAll('.hb-service-board,.detail-board,.hb-static-board,.hb-card-board,.hb-note-grid')].filter(x=>!x.closest('#hb-missionbridge-mission-card'));
 if(!items.length)return;
 const album=article.querySelector('.hb-service-album');
 const target=original||article;
 for(const el of items){
  if(el.dataset.hbServiceBoardBottom==='1')continue;
  // Keep the service board within the original regional/cultural panel, so it is hidden on youth/parent tabs.
  if(album&&album.parentElement===target)album.insertAdjacentElement('afterend',el);
  else target.append(el);
  el.dataset.hbServiceBoardBottom='1';
 }
}
let waiting=false;function apply(){if(waiting)return;waiting=true;requestAnimationFrame(()=>{waiting=false;addChurchVideo();fixWednesday();missionBridge();moveServiceBoard()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
window.addEventListener('hashchange',apply);
const start=()=>{const root=document.getElementById('app');if(root)new MutationObserver(apply).observe(root,{childList:true,subtree:false})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
