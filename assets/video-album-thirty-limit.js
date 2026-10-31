(()=>{'use strict';
const playlists={
'sermon-8':'PLmD7ZicLdWIpZeJVlgfXuYYaOSHjwuG6R',
'sermon-member-1':'PLmD7ZicLdWIqhiIi5ZfjOzIx1uiJI8f0c',
'sermon-member-2':'PLmD7ZicLdWIqmp13mlhv_6a_qVi59Fjkm',
'sermon-member-3':'PLmD7ZicLdWIpFunENSvRQ9OM-LkHr_-07',
'sermon-member-4':'PLmD7ZicLdWIr3-kWBB-H1-hD9D4NokQyU',
'sermon-member-5':'PLmD7ZicLdWIqfKtJXSTyp8e1Qb2DIQ5tr',
'sermon-11':'PLmD7ZicLdWIqYlRu54fXWc82k0mGBZMnv'
};let pending=false;
function run(){const key=location.hash.match(/sermon(?:-member)?-\d+/)?.[0];if(!key)return;
 const heading=[...document.querySelectorAll('h1,h2,h3')].find(h=>h.getClientRects().length&&(/영상 앨범/.test(h.textContent||'')||/재생목록/.test(h.textContent||'')));
 if(!heading)return;
 const scope=heading.closest('.hb-static-board,#hb-three-minute-video-cards,section,article')||heading.parentElement;
 if(!scope)return;
 const anchors=[...scope.querySelectorAll('a[data-video]')];const seen=new Set();let n=0;
 anchors.forEach(a=>{const id=a.dataset.video||a.href.match(/[?&]v=([\w-]{11})/)?.[1];if(id&&seen.has(id)){a.remove();return}if(id)seen.add(id);n++;if(n>30)a.style.setProperty('display','none','important')});
 const p=playlists[key];
 let existing=scope.querySelector('#hb-album-official-all');
 if(!existing){existing=document.createElement('a');existing.id='hb-album-official-all';existing.target='_blank';existing.rel='noopener noreferrer';existing.textContent='공식 전체 영상 보기 ↗';existing.style.cssText='display:table;margin:22px auto;padding:12px 20px;border-radius:9px;background:#e9f3fc;color:#315c7b;font-weight:700;text-decoration:none';scope.append(existing)}
 existing.href=p?'https://www.youtube.com/playlist?list='+p:'https://www.youtube.com/@Gimpo_HBC/videos';
 // The dynamic 3-minute gallery implements its own limit; do not override it.
 if(key==='sermon-11'){existing.remove();return}
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;run()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
})();