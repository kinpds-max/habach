(()=>{'use strict';
const groups=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
let selected=0;
function init(){
 const side=document.querySelector('.page-grid aside.side');
 if(!side||!/^#\/?ministry-/.test(location.hash))return;
 const current=side.querySelector('a[href="#/ministry-5"]');
 if(!current)return;
 let menu=side.querySelector('#hb-volunteer-side-accordion');
 if(!menu){
  menu=document.createElement('details');menu.id='hb-volunteer-side-accordion';menu.className='hb-small-group-menu hb-volunteer-native-menu';
  const summary=document.createElement('summary');summary.textContent='봉사와 섬김';
  const arrow=document.createElement('span');arrow.textContent='⌄';summary.append(arrow);
  const links=document.createElement('div');links.className='hb-small-group-links';
  groups.forEach((name,i)=>{const a=document.createElement('a');a.href='#/ministry-5';a.textContent=name;a.dataset.volunteerCategory=String(i);a.addEventListener('click',e=>{e.preventDefault();selected=i;menu.open=true;if(location.hash!=='#/ministry-5')location.hash='#/ministry-5';else show();});links.append(a)});
  menu.append(summary,links);current.insertAdjacentElement('afterend',menu);
 }
 current.style.display='none';
 if(!menu.dataset.bound){menu.dataset.bound='1';menu.querySelector('summary').addEventListener('click',()=>{if(location.hash!=='#/ministry-5')location.hash='#/ministry-5'})}
 const active=/^#\/?ministry-5$/.test(location.hash);
 menu.open=active;
 menu.querySelectorAll('[data-volunteer-category]').forEach((a,i)=>a.classList.toggle('on',active&&selected===i));
 if(active)show();
}
function show(){
 const article=document.querySelector('.page-grid article.article');
 if(!article||!/^#\/?ministry-5$/.test(location.hash))return;
 const title=article.querySelector('.article-title');
 if(!title)return;
 title.querySelector('h2')?.replaceChildren(document.createTextNode('봉사와 섬김'));
 title.style.textAlign='center';
 // Always keep the native centered title and existing introduction; only add category content where needed.
 let area=article.querySelector('#hb-volunteer-selected-content');
 if(!area){area=document.createElement('section');area.id='hb-volunteer-selected-content';title.insertAdjacentElement('afterend',area)}
 let content=article.querySelector('#hb-volunteer-original-content');
 if(!content){
  content=document.createElement('div');content.id='hb-volunteer-original-content';
  while(area.nextSibling)content.append(area.nextSibling);
  area.insertAdjacentElement('afterend',content);
 }
 content.style.display=selected===0?'':'none';
 if(selected===0){area.replaceChildren();return}
 if(area.dataset.choice===String(selected))return;
 area.dataset.choice=String(selected);
 const h=document.createElement('h3');h.textContent=selected===1?'너는 잘될 거야':'덕분에 잘됐습니다';
 const intro=document.createElement('p');intro.textContent=selected===1?'5월 가정의 달 · 너는 잘될 거야':'부모세대 섬김 활동';
 area.replaceChildren(h,intro);
 if(selected===1){
  const images=['https://files.mallary.ai/uploads/900/chatgpt_1793426450783_0c594477ea84204c.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793426453670_e345e10bd41d27f7.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793426456099_aee978fbeb1f582b.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793426459734_ee4e9a5e493d7e4b.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793426462359_42e9763907b0fdab.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793426465419_3226d05108103e6f.jpg'];
  const gallery=document.createElement('div');gallery.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px';
  images.forEach((src,i)=>{const a=document.createElement('a');a.href=src;a.target='_blank';a.rel='noopener noreferrer';const img=document.createElement('img');img.src=src;img.alt='자녀세대섬김 행사 '+(i+1);img.loading='lazy';img.style.cssText='width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px';a.append(img);gallery.append(a)});
  area.append(gallery);
 }
}
let queued=false;
function tick(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;init()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
addEventListener('hashchange',tick);
new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
})();