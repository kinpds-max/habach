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
 // Replace the original navigation link rather than leaving two visible parent labels.
 current.remove();
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
 const titleText=title.querySelector('h2');if(titleText&&titleText.textContent.trim()!=='봉사와 섬김')titleText.textContent='봉사와 섬김';
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
 // Restore the original regional / cultural ministry explanation if another renderer omitted it.
 if(selected===0 && !content.querySelector('.source-subhead')){
  const original=document.createElement('div');original.className='hb-restored-volunteer-description';
  original.innerHTML='<p class="lead">사람을 사랑하며 지역 공동체를 섬깁니다</p><h3 class="source-subhead">문화적 섬김과 아트센터</h3><p>하늘바람교회는 음악과 문화적 섬김을 통해 교회를 찾는 이와 지역 공동체가 함께 행복해지는 교회를 지향합니다.</p><h3 class="source-subhead">크리스천 바우처 사역</h3><p>지역 공동체와 도움이 필요한 이웃을 섬기기 위해 생활 지원, 의료 지원, 교육, 식사, 집수리 등 실생활의 부족함을 채우는 섬김을 소개하고 있습니다.</p><div class="source-feature-grid"><div><strong>러브트리 · 메디컬트리</strong><p>생활 및 의료 영역의 이웃 사랑</p></div><div><strong>에듀트리 · 푸드트리</strong><p>교육과 따뜻한 식사 나눔</p></div><div><strong>하우스트리</strong><p>주거 및 집수리 섬김</p></div></div>';
  content.prepend(original);
 }
 if(selected===0){if(area.childNodes.length)area.replaceChildren();delete area.dataset.choice;return}
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