(()=>{'use strict';
const playlist='PLmD7ZicLdWIqYlRu54fXWc82k0mGBZMnv';
function apply(){
 const active=/sermon-(?:5|10)|3분설교/.test(location.hash+' '+document.title)||[...document.querySelectorAll('h1,h2,h3')].some(h=>h.getClientRects().length&&/3분\s*설교/.test(h.textContent||''));
 if(!active)return;
 const heading=[...document.querySelectorAll('h1,h2,h3')].find(h=>h.getClientRects().length&&/3분\s*설교/.test(h.textContent||''));
 if(!heading)return;
 const parent=heading.closest('article,section,.article,.page-content')||heading.parentElement?.parentElement;
 if(!parent||parent.querySelector('#hb-three-minute-full-playlist'))return;
 const wrap=document.createElement('section');wrap.id='hb-three-minute-full-playlist';wrap.style.cssText='padding:0;margin:18px 0 28px;border:0;background:transparent';
 const title=document.createElement('h3');title.textContent='3분설교 영상 앨범';title.style.cssText='font-size:clamp(20px,3vw,26px);font-weight:800;color:#244e65;margin:0 0 16px';
 const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/videoseries?list='+playlist;iframe.title='하늘바람교회 3분설교 전체 영상';iframe.loading='lazy';iframe.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share';iframe.allowFullscreen=true;iframe.style.cssText='display:block;width:100%;aspect-ratio:16/9;border:1px solid #dce5ee;border-radius:14px;background:#111';
 const link=document.createElement('a');link.href='https://www.youtube.com/playlist?list='+playlist;link.target='_blank';link.rel='noopener noreferrer';link.textContent='유튜브에서 3분설교 전체 목록 보기';link.style.cssText='display:block;margin-top:12px;padding:13px;text-align:center;border-radius:10px;background:#066d94;color:white;text-decoration:none;font-weight:700';
 wrap.append(title,iframe,link);heading.insertAdjacentElement('afterend',wrap);
}
let busy=false;function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;apply()})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
})();