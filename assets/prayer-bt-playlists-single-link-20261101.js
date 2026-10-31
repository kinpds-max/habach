(()=>{'use strict';
const config={
 'sermon-prayer-1':{id:'DHK5f86-DOY',playlist:'PLmD7ZicLdWIpmQHw1_1mLb8xYyxcvfSgp'},
 'sermon-member-7':{id:'pg0m3-oCf3E',playlist:'PLmD7ZicLdWIqG1Hn-kmTOXVzmtKv6LW9h'},
 'sermon-member-6':{id:'5Q3k0rM6954',playlist:'PLmD7ZicLdWIo789op9oY2lBV5GepGgjCP'}
};
let pending=false;
function apply(){
 const key=(location.hash||'').replace(/^#\/?/,'').split(/[?&]/)[0],cfg=config[key];
 if(!cfg)return;
 const article=document.querySelector('#app article.article');
 if(!article)return;
 const board=article.querySelector('.hb-static-board')||article;
 const playlist='https://www.youtube.com/playlist?list='+cfg.playlist;
 const start='https://www.youtube.com/watch?v='+cfg.id+'&list='+cfg.playlist;
 const card=article.querySelector('a[data-video="'+cfg.id+'"]');
 if(card&&card.getAttribute('href')!==start){card.href=start;card.target='_blank';card.rel='noopener noreferrer'}
 // Keep exactly one playlist action, at the bottom of the video album.
 let main=board.querySelector('#hb-one-official-playlist-action');
 if(!main){
   main=document.createElement('a');main.id='hb-one-official-playlist-action';
   main.textContent='공식 전체 영상 보기 ↗';
   main.style.cssText='display:table;margin:22px auto 18px;padding:12px 20px;background:#e8f2fb;color:#315e80;border-radius:9px;text-decoration:none;font-weight:700;text-align:center';
   board.append(main);
 }
 if(main.href!==playlist)main.href=playlist;
 main.target='_blank';main.rel='noopener noreferrer';
 if(board.lastElementChild!==main)board.append(main);
 for(const a of [...article.querySelectorAll('a[href]')]){
  if(a===main||a===card)continue;
  const label=(a.textContent||'').replace(/\s+/g,'').trim();
  if(/공식.*(?:전체|재생목록).*보기/.test(label) ||
     ((a.href||'').includes('youtube.com/playlist?list=')&&a.closest('.hb-video-list-bottom'))){
    const wrapper=a.closest('.hb-video-list-bottom');
    if(wrapper&&wrapper!==board)wrapper.remove();else a.remove();
  }
 }
 // Drop any empty wrappers left by previous scripts.
 for(const w of article.querySelectorAll('.hb-video-list-bottom'))if(!w.querySelector('a'))w.remove();
}
function queue(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue);else queue();
addEventListener('hashchange',queue);
const app=document.getElementById('app')||document.documentElement;
new MutationObserver(queue).observe(app,{subtree:true,childList:true});
})();