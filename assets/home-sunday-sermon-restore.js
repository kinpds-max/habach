(()=>{'use strict';
const types={'주일설교':'sermon-1','새벽설교':'sermon-8','금요설교':'friday-evening'};
let feed={},queued=false;
const videoId=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{11}$/.test(id);
function apply(){
 if(!/^#\/?(?:home|index)?$/.test(location.hash||'#'))return;
 const labels=document.querySelectorAll('#app .home-six-item .home-six-label strong');
 for(const heading of labels){
  const key=types[heading.textContent.trim()];
  if(!key)continue;
  const latest=(feed[key]||[]).find(item=>item&&videoId(item.id)&&typeof item.title==='string'&&item.title.trim());
  if(!latest)continue;
  const box=heading.closest('.home-six-item');
  if(!box)continue;
  let card=box.querySelector('a.sermon-album-card');
  if(!card){
   card=document.createElement('a');
   card.className='sermon-album-card home-six-card';
   card.target='_blank';card.rel='noopener noreferrer';
   box.appendChild(card);
  }
  card.href='https://www.youtube.com/watch?v='+latest.id;
  card.dataset.video=latest.id;card.dataset.title=latest.title;
  card.target='_blank';card.rel='noopener noreferrer';
  let thumb=card.querySelector('.sermon-album-thumb');
  if(!thumb){thumb=document.createElement('span');thumb.className='sermon-album-thumb';card.prepend(thumb)}
  let img=thumb.querySelector('img');
  if(!img){img=document.createElement('img');img.loading='lazy';thumb.prepend(img)}
  if(!img.src.includes('/'+latest.id+'/'))img.src='https://i.ytimg.com/vi/'+latest.id+'/hqdefault.jpg';
  img.alt=latest.title+' 미리보기';
  if(!thumb.querySelector('i')){const icon=document.createElement('i');icon.setAttribute('aria-hidden','true');icon.textContent='▶';thumb.append(icon)}
  let copy=card.querySelector('.sermon-album-copy');
  if(!copy){copy=document.createElement('span');copy.className='sermon-album-copy';card.append(copy)}
  let label=copy.querySelector('strong');
  if(!label){label=document.createElement('strong');copy.append(label)}
  if(label.textContent!==latest.title)label.textContent=latest.title;
 }
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
async function refresh(){
 try{const r=await fetch('/assets/official-video-albums.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);feed=await r.json();queue()}catch(e){console.warn('공식 영상 홈 반영 실패:',e)}
}
refresh();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
addEventListener('hashchange',queue);
new MutationObserver(queue).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
})();