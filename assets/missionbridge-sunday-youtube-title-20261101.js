(()=>{'use strict';
const ID='fGjG3fzcIzw';
const TARGET='https://www.youtube.com/watch?v='+ID;
let titlePromise;
async function officialTitle(){
 if(!titlePromise)titlePromise=(async()=>{
  for(const endpoint of [
   'https://www.youtube.com/oembed?url='+encodeURIComponent(TARGET)+'&format=json',
   'https://noembed.com/embed?url='+encodeURIComponent(TARGET)
  ]){
   try{const r=await fetch(endpoint,{cache:'no-store'});if(!r.ok)continue;const data=await r.json();const title=(data.title||'').trim();if(title&&!/^(youtube|video unavailable|private video)$/i.test(title))return title}catch(_){}
  }
  return '';
 })();
 return titlePromise;
}
function apply(title){
 if(!title)return;
 for(const link of document.querySelectorAll('a[data-video="'+ID+'"],a[href*="'+ID+'"]')){
  const headline=link.querySelector('.sermon-album-copy strong,.video-title,.card-title,.album-title,strong');
  if(headline&&headline.textContent.trim()!==title)headline.textContent=title;
  if(link.dataset.title)link.dataset.title=title;
  const img=link.querySelector('img');if(img)img.alt=title+' 썸네일';
 }
}
let queued=false;
function refresh(){
 if(queued)return;queued=true;
 requestAnimationFrame(()=>{queued=false;officialTitle().then(apply)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
window.addEventListener('hashchange',refresh);
const host=document.getElementById('app')||document.documentElement;
new MutationObserver(refresh).observe(host,{childList:true,subtree:true});
})();