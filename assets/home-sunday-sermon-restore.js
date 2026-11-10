(()=>{'use strict';let feed={},queued=false;
function apply(){if(!/^#\/?(?:home|index)?$/.test(location.hash||'#'))return;
for(const heading of document.querySelectorAll('#app h2,#app h3,#app h4')){
const key=({'주일설교':'sermon-1','새벽설교':'sermon-8','금요설교':'friday-evening'})[heading.textContent.trim()];const latest=(feed[key]||[])[0];if(!latest)continue;
const box=heading.closest('.home-six-item')||heading.parentElement;
const card=box?.querySelector('a.home-six-card,a.sermon-album-card');if(!card||card.dataset.video===latest.id)continue;
card.href='https://www.youtube.com/watch?v='+latest.id;card.dataset.video=latest.id;card.dataset.title=latest.title;
const img=card.querySelector('img');if(img){img.src='https://i.ytimg.com/vi/'+latest.id+'/hqdefault.jpg';img.alt=latest.title;}
const title=card.querySelector('.sermon-album-copy strong');if(title)title.textContent=latest.title;
}}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
fetch('/assets/official-video-albums.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{feed=data;queue()}).catch(()=>{});
addEventListener('hashchange',queue);new MutationObserver(queue).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});})();
