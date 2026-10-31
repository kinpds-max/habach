(()=>{'use strict';
const groups=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
let selected=0;
function init(){
 const side=document.querySelector('.page-grid aside.side');
 if(!side||!/^#\/?ministry-/.test(location.hash))return;
 const current=side.querySelector('a[href="#/ministry-5"]');
 let menu=side.querySelector('#hb-volunteer-side-accordion');
 if(!current&&!menu)return;
 if(!menu){
  menu=document.createElement('details');menu.id='hb-volunteer-side-accordion';menu.className='hb-small-group-menu hb-volunteer-native-menu';
  const summary=document.createElement('summary');summary.textContent='봉사와 섬김';
  const arrow=document.createElement('span');arrow.textContent='⌄';summary.append(arrow);
  const links=document.createElement('div');links.className='hb-small-group-links';
  groups.forEach((name,i)=>{const a=document.createElement('a');a.href='#/ministry-5';a.textContent=name;a.dataset.volunteerCategory=String(i);a.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();selected=i;menu.open=true;const y=window.scrollY;if(location.hash!=='#/ministry-5'){location.hash='#/ministry-5';requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo({top:y,behavior:'instant'});tick()}));}else{show();tick()}});links.append(a)});
  menu.append(summary,links);
  if(current)current.insertAdjacentElement('afterend',menu);
  else {const group=side.querySelector('.hb-small-group-menu');if(group)group.insertAdjacentElement('beforebegin',menu);else side.append(menu)}
 }
 // Preserve the original navigation node so the accordion survives repeated renders.
 if(current)current.style.setProperty('display','none','important');
 if(!menu.dataset.bound){menu.dataset.bound='1';menu.querySelector('summary').addEventListener('click',()=>{if(location.hash!=='#/ministry-5'){selected=0;const y=window.scrollY;location.hash='#/ministry-5';requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo({top:y,behavior:'instant'});tick()}));}else{tick()}})}
 const active=/^#\/?ministry-5$/.test(location.hash);
 if(menu.open!==active)menu.open=active;
 menu.style.setProperty('display','block','important');
 menu.querySelector('.hb-small-group-links')?.style.setProperty('display',active?'block':'none','important');
 menu.querySelectorAll('[data-volunteer-category]').forEach((a,i)=>a.classList.toggle('on',active&&selected===i));
 if(active)show();
}
function show(){
 const article=document.querySelector('.page-grid article.article');
 if(!article||!/^#\/?ministry-5$/.test(location.hash))return;
 const title=article.querySelector('.article-title');
 if(!title)return;
 const titleText=title.querySelector('h2');if(titleText&&titleText.textContent.trim()!=='봉사와 섬김')titleText.textContent='봉사와 섬김';
 article.dataset.hbVolunteerCategory=String(selected);
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
 if(area.dataset.choice===String(selected)&&area.querySelector('.hb-volunteer-generation-video'))return;
 area.dataset.choice=String(selected);
 const id=selected===1?'nweyrCQwGPs':'uUId-pRdB_w';
 const label=selected===1?'너는 잘될 거야':'덕분에 잘되었습니다';
 const h=document.createElement('h3');h.textContent=label;h.style.cssText='margin:0 0 12px;color:#244860;font-size:clamp(21px,3vw,28px)';
 const intro=document.createElement('p');intro.textContent=selected===1?'자녀세대를 향한 응원과 축복을 함께 나눕니다.':'부모세대를 향한 감사와 사랑을 함께 나눕니다.';
 intro.style.cssText='margin:0 0 20px;color:#607486;line-height:1.7';
 const video=document.createElement('div');video.className='hb-volunteer-generation-video';
 video.style.cssText='width:100%;max-width:900px;margin:18px 0 28px';
 const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id;
 frame.title=label+' · 하늘바람교회';frame.loading='lazy';frame.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share';frame.allowFullscreen=true;
 frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
 frame.style.cssText='display:block;width:100%;aspect-ratio:16/9;height:auto;min-height:220px;border:0;border-radius:14px;background:#152837';
 const link=document.createElement('a');link.href='https://www.youtube.com/watch?v='+id;link.target='_blank';link.rel='noopener noreferrer';link.textContent='유튜브 원본 영상 보기 ↗';link.style.cssText='display:inline-block;margin-top:12px;color:#315c78;font-weight:700;text-decoration:underline';
 video.append(frame,link);area.replaceChildren(h,intro,video);
 if(selected===2){
  // The six individual photographs were previously stored with the former youth gallery.
  // Display them exclusively for "덕분에 잘되었습니다" and preserve the 16:9 video above.
  const photos=["https://files.mallary.ai/uploads/900/chatgpt_1793426450783_0c594477ea84204c.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426453670_e345e10bd41d27f7.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426456099_aee978fbeb1f582b.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426459734_ee4e9a5e493d7e4b.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426462359_42e9763907b0fdab.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426465419_3226d05108103e6f.jpg"];
  const title=document.createElement('h3');title.textContent='덕분에 잘되었습니다 · 행사 사진';
  title.style.cssText='margin:20px 0 14px;color:#244860;font-size:clamp(19px,2.5vw,24px)';
  const gallery=document.createElement('div');gallery.className='hb-parent-gratitude-gallery';
  gallery.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;width:100%';
  photos.forEach((src,i)=>{
   const anchor=document.createElement('a');anchor.href=src;anchor.target='_blank';anchor.rel='noopener noreferrer';
   const photo=document.createElement('img');photo.src=src;photo.loading='lazy';photo.decoding='async';
   photo.alt='덕분에 잘되었습니다 행사 사진 '+(i+1);
   photo.style.cssText='display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px';
   anchor.append(photo);gallery.append(anchor);
  });
  const note=document.createElement('p');note.textContent='사진을 누르면 원본을 크게 볼 수 있습니다.';
  note.style.cssText='font-size:13px;color:#748698;margin:12px 0 18px';
  area.append(title,gallery,note);
 }

}
let queued=false;
function tick(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;init()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
addEventListener('hashchange',tick);
new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
})();