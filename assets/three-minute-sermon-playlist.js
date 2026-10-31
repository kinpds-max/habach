(()=>{'use strict';
const playlist='PLmD7ZicLdWIqYlRu54fXWc82k0mGBZMnv';
const playlistURL='https://www.youtube.com/playlist?list='+playlist;
const datasetURL='/assets/three-minute-sermon-videos.json?v=restore20261101';
let entries=[],shown=30,loadingTitles=new Set(),queued=false;
fetch(datasetURL,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('3분설교 데이터 불러오기 실패');return r.json()}).then(v=>{if(Array.isArray(v))entries=v;queue()}).catch(e=>console.warn(e));
const original=(s)=>String(s||'').trim();
async function officialKorean(id){
 for(const endpoint of [
   'https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json&hl=ko',
   'https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)
 ]){
  try{const r=await fetch(endpoint);if(!r.ok)continue;const j=await r.json();if(j.title&&/[가-힣]/.test(j.title))return j.title.trim()}catch(_){}
 }
 return '';
}
function render(){
 if(!/^#\/?sermon-11$/.test(location.hash))return;
 const article=document.querySelector('#app article.article');if(!article)return;
 const board=[...article.querySelectorAll('.hb-static-board')].find(x=>/3분설교/.test(x.querySelector('h2,h3,h4')?.textContent||''))||article.querySelector('.hb-static-board');
 if(!board)return;
 board.style.removeProperty('display');
 let heading=board.querySelector('.hb-static-board-head h3');
 if(heading)heading.textContent='3분설교 영상 앨범';
 const native=board.querySelector('.hb-static-sermon-grid:not([data-three-minute-restored])');
 if(native)native.style.setProperty('display','none','important');
 const oldSummary=article.querySelector('#hb-three-minute-playlist-summary');
 if(oldSummary)oldSummary.remove();
 let grid=board.querySelector('[data-three-minute-restored]');
 if(!grid){grid=document.createElement('div');grid.dataset.threeMinuteRestored='1';grid.className='hb-static-sermon-grid';board.append(grid)}
 const values=entries.filter(v=>/^[\w-]{11}$/.test(v.id||'')).filter((v,i,a)=>a.findIndex(w=>w.id===v.id)===i);
 const shownEntries=values.slice(0,shown);
 for(const v of shownEntries){
  if(grid.querySelector('[data-video="'+v.id+'"]'))continue;
  const a=document.createElement('a');a.className='sermon-album-card static-sermon-card';a.dataset.video=v.id;
  a.href='https://www.youtube.com/watch?v='+v.id;a.target='_blank';a.rel='noopener noreferrer';
  const image=document.createElement('img');image.loading='lazy';image.alt=original(v.title)||'3분설교';image.src='https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg';image.style.cssText='display:block;width:100%;aspect-ratio:16/9;object-fit:cover';
  const label=document.createElement('strong');label.textContent=original(v.title)||'3분설교';label.style.cssText='display:block;padding:10px;line-height:1.5';
  a.append(image,label);grid.append(a);
  if(!/[가-힣]/.test(v.title||'')&&!loadingTitles.has(v.id)){
   loadingTitles.add(v.id);officialKorean(v.id).then(t=>{if(t){label.textContent=t;image.alt=t;v.title=t}});
  }
 }
 let more=board.querySelector('[data-three-minute-more]');
 if(!more){more=document.createElement('button');more.type='button';more.dataset.threeMinuteMore='1';more.style.cssText='display:block;margin:20px auto;padding:11px 22px;border:1px solid #cddfea;border-radius:9px;background:#eaf4fc;color:#315b7d;font-weight:700;cursor:pointer';more.onclick=()=>{shown+=30;queue()};board.append(more)}
 more.textContent='더보기 +30';more.style.display=values.length>shown?'block':'none';
 let all=board.querySelector('[data-three-minute-full]');
 if(!all){all=document.createElement('a');all.dataset.threeMinuteFull='1';all.href=playlistURL;all.target='_blank';all.rel='noopener noreferrer';all.textContent='공식 전체 영상 보기 ↗';all.style.cssText='display:table;margin:16px auto 24px;padding:12px 20px;background:#e8f2fb;color:#315e80;border-radius:9px;text-decoration:none;font-weight:700';board.append(all)}
 const footer=article.querySelector('.hb-video-list-bottom');if(footer)footer.style.setProperty('display','none','important');
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue);else queue();
window.addEventListener('hashchange',queue);
const root=document.getElementById('app')||document.documentElement;
new MutationObserver(queue).observe(root,{subtree:true,childList:true});
})();