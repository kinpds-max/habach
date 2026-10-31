(()=>{'use strict';
const playlist='PLmD7ZicLdWIqYlRu54fXWc82k0mGBZMnv',playlistURL='https://www.youtube.com/playlist?list='+playlist;
let entries=[];let shown=30;fetch('/assets/three-minute-sermon-videos.json',{cache:'no-store'}).then(r=>r.json()).then(v=>{if(Array.isArray(v)){entries=v;render()}}).catch(console.warn);
function koTitle(value){const t=String(value||'').trim();if(!t)return '3분설교';if(/[가-힣]/.test(t))return t;const heading=t.replace(/^3[- ]Minute Sermon\s*:?\s*/i,'').replace(/\s*[-–]\s*(Gimpo|Kimpo|Sky Wind Church|Haneul Baram Church).*$/i,'').trim();return '3분설교 · '+(heading||'말씀 영상')}
function render(){if(!/sermon-11/.test(location.hash))return;
 const heading=[...document.querySelectorAll('h1,h2,h3')].find(h=>h.getClientRects().length&&h.textContent.trim()==='3분설교');if(!heading)return;
 const root=heading.closest('article,.article,.page-content,.content-body')||heading.parentElement?.parentElement;if(!root)return;
 // A single top playlist panel styled like Sunday sermon.
 let box=root.querySelector('#hb-three-minute-playlist-summary');
 if(!box){box=document.createElement('section');box.id='hb-three-minute-playlist-summary';box.style.cssText='padding:22px;margin:22px 0;background:#eff6fc;border:1px solid #dbe9f3;border-radius:12px';
 const top=document.createElement('div');top.style.cssText='display:flex;gap:16px;align-items:center;justify-content:space-between';
 const text=document.createElement('div'),h=document.createElement('h3');h.textContent='3분설교 전체 재생목록';h.style.cssText='margin:0 0 9px;color:#284d69';
 const note=document.createElement('p');note.textContent='유튜브 재생목록에서 모든 3분설교 영상을 이어서 볼 수 있습니다.';note.style.cssText='margin:0;color:#8094a7;font-size:14px';text.append(h,note);
 const a=document.createElement('a');a.href=playlistURL;a.target='_blank';a.rel='noopener noreferrer';a.textContent='전체 영상 보기 ↗';a.style.cssText='flex:none;padding:11px 16px;border-radius:7px;background:#436a8e;color:#fff;text-decoration:none;font-weight:700';top.append(text,a);
 const details=document.createElement('details');details.style.cssText='border-top:1px solid #dbe6ee;margin-top:16px;padding-top:13px';const summary=document.createElement('summary');summary.textContent='재생목록 바로 재생하기';summary.style.cssText='cursor:pointer;color:#355f7d;font-weight:700';details.append(summary);details.addEventListener('toggle',()=>{if(details.open&&!details.querySelector('iframe')){const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/videoseries?list='+playlist;f.title='3분설교 전체 재생목록';f.loading='lazy';f.allowFullscreen=true;f.style.cssText='width:100%;aspect-ratio:16/9;border:0;margin-top:15px;border-radius:8px';details.append(f)}});box.append(top,details);heading.closest('.article-title')?.insertAdjacentElement('afterend',box)||heading.insertAdjacentElement('afterend',box)}
 // The requested "3분설교 영상 앨범" panel is removed, while the top playlist remains.
 for(const id of ['hb-three-minute-video-cards','hb-three-minute-full-playlist']){
  root.querySelectorAll('#'+id).forEach(el=>el.remove());
 }
 for(const box of root.querySelectorAll('.hb-static-board')){
  const title=box.querySelector('h2,h3,h4');
  if(title&&/3분설교\s*영상\s*앨범/.test(title.textContent||''))box.remove();
 }
 for(const box of root.querySelectorAll('.hb-video-list-bottom')){
  box.remove();
 }

}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;render()})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
})();