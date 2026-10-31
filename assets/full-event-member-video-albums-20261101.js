(()=>{'use strict';
const dataURL='/assets/official-video-albums.json?v=20261101-all-video-gallery';
let data=null,loading=null,scheduled=false;
async function load(){if(data)return data;if(!loading)loading=fetch(dataURL,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('video albums unavailable');return r.json()}).then(v=>{data=v;tick();return v}).catch(()=>({}));return loading}
const routes={
 'sermon-3':['sermon-event-2','sermon-event-1','sermon-event-3'],
 'sermon-5':['sermon-member-1','sermon-member-2','sermon-member-3','sermon-member-4','sermon-member-5']
};
function allEntries(key){
 const keys=routes[key]||[];
 const seen=new Set(),out=[];
 function add(v,category){if(!v||!/^[A-Za-z0-9_-]{11}$/.test(v.id||'')||seen.has(v.id))return;seen.add(v.id);out.push({id:v.id,title:v.title||category,category})}
 if(key==='sermon-3'){
  // Healing music first, then individual festival videos.
  for(const v of data['sermon-event-2']||[])add(v,'힐링음악회');
  for(const v of data['sermon-event-1']||[])add(v,'우리집축제');
  for(const v of data['sermon-event-3']||[])add(v,'좋아요축제');
  add({id:'B5DVZMhX1Ns',title:'아로마테라피'},'아로마테라피');
 }else{
  const cats=['2025 제특새','2024 장로회배 BT 페스티벌','2024 제특새','2023 제특새','2022 제특새'];
  keys.forEach((k,i)=>(data[k]||[]).forEach(v=>add(v,cats[i])));
  add({id:'5Q3k0rM6954',title:'BT나눔축제'},'BT나눔축제');
  add({id:'pg0m3-oCf3E',title:'BT'},'BT');
 }
 return out;
}
function run(){
 const key=(location.hash||'').replace(/^#\/?/,'');
 if(!routes[key])return;
 if(!data){load();return}
 const article=document.querySelector('#app article.article');
 const board=article?.querySelector('.hb-static-board');
 if(!board)return;
 const values=allEntries(key);
 let root=board.querySelector('[data-hb-combined-videos="'+key+'"]');
 if(!root){
  root=document.createElement('div');root.dataset.hbCombinedVideos=key;
  root.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));gap:16px;margin:18px 0 22px';
  const head=board.querySelector('.hb-static-board-head');
  if(head)head.insertAdjacentElement('afterend',root);else board.prepend(root);
 }
 // Replace the category preview with one combined, deduplicated list.
 for(const grid of board.querySelectorAll('.hb-static-sermon-grid:not([data-hb-combined-videos])'))grid.style.setProperty('display','none','important');
 const oldGallery=board.querySelector('#hb-member-sharing-gallery');if(oldGallery)oldGallery.style.setProperty('display','none','important');
 const head=board.querySelector('.hb-static-board-head h3');if(head)head.textContent=key==='sermon-3'?'행사영상 전체 앨범':'성도나눔 전체 영상 앨범';
 const count=board.querySelector('.hb-static-board-head span');if(count)count.textContent='등록 영상 '+values.length+'개';
 const existing=new Set([...root.querySelectorAll('a[data-video]')].map(a=>a.dataset.video));
 for(const v of values){
  if(existing.has(v.id))continue;existing.add(v.id);
  const a=document.createElement('a');a.dataset.video=v.id;a.href='https://www.youtube.com/watch?v='+v.id;a.target='_blank';a.rel='noopener noreferrer';
  a.className='sermon-album-card static-sermon-card';a.style.cssText='display:flex;flex-direction:column;min-width:0;text-decoration:none;color:inherit;overflow:hidden';
  const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg';img.alt=v.title;img.loading='lazy';img.style.cssText='width:100%;aspect-ratio:16/9;object-fit:cover';
  const title=document.createElement('strong');title.textContent=v.title;title.style.cssText='padding:10px 10px 4px;font-size:14px;line-height:1.45';
  const small=document.createElement('span');small.textContent=v.category;small.style.cssText='color:#6b8498;font-size:12px;padding:0 10px 12px';
  a.append(img,title,small);root.append(a);
 }
 // The section already contains the complete videos. Retain a single external official button only below.
 for(const box of article.querySelectorAll('.hb-video-list-bottom'))box.style.setProperty('display','none','important');
 let button=board.querySelector('[data-hb-combined-more]');
 if(!button){button=document.createElement('button');button.dataset.hbCombinedMore='1';button.type='button';button.style.cssText='display:block;margin:18px auto 25px;padding:11px 22px;background:#eaf4fc;color:#315b7d;border:1px solid #cbdcea;border-radius:9px;cursor:pointer;font-weight:700';button.dataset.limit='30';button.onclick=()=>{button.dataset.limit=String(Number(button.dataset.limit||30)+30);tick()};board.append(button)}
 const limit=Number(button.dataset.limit||30);
 for(const [i,a] of [...root.children].entries())a.style.setProperty('display',i<limit?'flex':'none','important');
 button.textContent='더보기 +30';button.style.setProperty('display',values.length>limit?'block':'none','important');
}
function tick(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;run()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
window.addEventListener('hashchange',tick);
const host=document.getElementById('app')||document.documentElement;
new MutationObserver(tick).observe(host,{childList:true,subtree:false});
})();