(()=>{'use strict';
const route=()=>location.hash.replace(/^#\/?/,'');
function update(){
 const key=route();
 if(key==='sermon-event-4'){location.replace(location.href.split('#')[0]+'#/sermon-event-2');return}
 if(key==='sermon-3'){
  const box=document.querySelector('#app article.article .hb-static-sermon-grid');
  if(box){
   const healing=box.querySelector('a[data-video="4L61vuVFlKM"]');
   if(healing&&box.firstElementChild!==healing)box.prepend(healing);
   const trio=box.querySelector('a[data-video="q1RTJ9zfils"]');
   if(trio)trio.remove();
  }
 }
 if(key==='sermon-event-2'){
  const title=document.querySelector('#app article.article .article-title h2');
  if(title&&title.textContent!=='힐링음악회')title.textContent='힐링음악회';
 }
}
let queued=false;
function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
window.addEventListener('hashchange',refresh);
const app=document.getElementById('app');if(app)new MutationObserver(refresh).observe(app,{childList:true,subtree:false});
})();