(()=>{'use strict';
const names=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
function render(){
 if(!/ministry-5|봉사와.?섬김/.test(location.hash+location.pathname+' '+document.title)&&![...document.querySelectorAll('h1,h2,h3')].some(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||'')))return;
 const heading=[...document.querySelectorAll('h1,h2,h3,h4')].reverse().find(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||'')&&h.textContent.trim().length<75);
 if(!heading)return;
 const root=heading.closest('article,.article,.page-content,.content-body,.subpage-content')||heading.parentElement?.parentElement||heading.parentElement;
 if(!root||root.querySelector('#hb-volunteer-categories'))return;
 const section=document.createElement('section');section.id='hb-volunteer-categories';section.style.cssText='margin:0 0 22px;padding:0;border:0;background:transparent';
 
 const tabs=document.createElement('div');tabs.className='hb-volunteer-submenu-matches-smallgroups';tabs.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0 0 20px';
 const existingBoard=[...root.querySelectorAll('section,div')].find(e=>e!==root&&e.querySelector('input[placeholder*="제목 검색"]')&&/봉사와\s*섬김\s*게시판/.test(e.textContent||''));if(existingBoard)existingBoard.style.display='none';const original=[...root.children].filter(e=>e!==section&&e!==existingBoard&&!e.contains(heading)&&!e.matches('script,style')&&e.getBoundingClientRect().top>=heading.getBoundingClientRect().top);
 const panels=names.map((name,i)=>{const panel=document.createElement('div');panel.dataset.category=name;panel.hidden=i!==0;if(i===0){original.forEach(e=>panel.append(e));}else{const title=document.createElement('h3');title.textContent=i===1?'너는 잘될 거야':'덕분에 잘됐습니다';title.style.cssText='margin:18px 0 8px;font-size:clamp(22px,4vw,30px);font-weight:800;color:#205676';const p=document.createElement('p');p.textContent='활동 사진과 영상이 등록될 예정입니다.';p.style.cssText='color:#62778a;margin:14px 0';const album=document.createElement('div');album.className='hb-volunteer-media-album';album.dataset.service=i===1?'children':'parents';if(i===1){p.textContent='5월 가정의 달 · 너는 잘될 거야';album.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0';const images=["https://files.mallary.ai/uploads/900/chatgpt_1793426450783_0c594477ea84204c.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426453670_e345e10bd41d27f7.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426456099_aee978fbeb1f582b.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426459734_ee4e9a5e493d7e4b.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426462359_42e9763907b0fdab.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426465419_3226d05108103e6f.jpg"];images.forEach((src,j)=>{const a=document.createElement('a');a.href=src;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;border-radius:12px;overflow:hidden;border:1px solid #dae6ec';const im=document.createElement('img');im.src=src;im.alt='너는 잘될 거야 가정의 달 행사 사진 '+(j+1);im.loading='lazy';im.style.cssText='display:block;width:100%;aspect-ratio:4/3;object-fit:cover';a.append(im);album.append(a);});}panel.append(title,p,album);}section.append(panel);return panel});
 names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.style.cssText='min-width:0;min-height:65px;padding:12px 6px;border:1px solid #d5e0e7;border-radius:12px;font-size:clamp(12px,2.9vw,16px);font-weight:700;cursor:pointer';b.onclick=()=>{panels.forEach((p,j)=>p.hidden=i!==j);[...tabs.children].forEach((x,j)=>{x.style.background=i===j?'#dceef8':'white';x.style.color=i===j?'#135679':'#34566d'});isolateVolunteerCategory();};tabs.append(b)});
 const menu=[...document.querySelectorAll('button,a,[role="tab"]')].find(el=>el.getClientRects().length&&el.textContent.replace(/\s+/g,' ').trim()==='봉사와 섬김');
 const row=menu&&[menu.parentElement,menu.parentElement?.parentElement,menu.parentElement?.parentElement?.parentElement].find(el=>el&&[...el.querySelectorAll('button,a,[role="tab"]')].filter(x=>['예배','기도회','새가족 안내','전도·선교','봉사와 섬김','소그룹교제'].includes(x.textContent.trim())).length>=5);
 if(!document.getElementById('hb-volunteer-subnav-layout')){const st=document.createElement('style');st.id='hb-volunteer-subnav-layout';st.textContent='#hb-volunteer-categories .hb-volunteer-submenu-matches-smallgroups,.hb-volunteer-submenu-matches-smallgroups{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;padding:8px 12px!important;margin:8px 0 0!important;border:1px solid #dce7ef!important;border-radius:15px!important;background:#f5f9fc!important;width:100%!important;box-sizing:border-box!important}.hb-volunteer-submenu-matches-smallgroups>button{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:43px!important;min-height:43px!important;max-height:43px!important;margin:0!important;padding:7px 5px!important;border:1px solid #d5e0e7!important;border-radius:12px!important;font-size:clamp(12px,2.9vw,16px)!important;line-height:1.35!important;text-align:center!important}.hb-volunteer-submenu-matches-smallgroups>button:last-child:nth-child(odd){grid-column:1!important}';document.head.append(st);}

 // Sidebar nested navigation like the existing small-group section.
 const side=[...document.querySelectorAll('aside,nav,[class*="sidebar"],[class*="snb"]')].find(x=>[...x.querySelectorAll('a,button')].some(e=>e.textContent.trim()==='소그룹교제')&&[...x.querySelectorAll('a,button')].some(e=>/봉사와\s*섬김/.test(e.textContent.trim())));
 const parentButton=side&&[...side.querySelectorAll('a,button')].find(e=>e.textContent.replace(/\s+/g,'').trim()==='봉사와섬김');
 if(parentButton){
   let sub=side.querySelector('#hb-volunteer-sidebar-subnav');
   if(!sub){sub=document.createElement('div');sub.id='hb-volunteer-sidebar-subnav';sub.style.cssText='display:flex;flex-direction:column;padding:0 0 3px 14px';const holder=parentButton.closest('li')||parentButton;holder.insertAdjacentElement('afterend',sub);}
   [...tabs.children].forEach((b,i)=>{b.style.cssText='display:block;width:100%;min-height:35px;height:auto;text-align:left;padding:9px 12px;border:0;border-bottom:1px solid #e4eaf0;background:transparent;color:#46627d;font-size:13px;cursor:pointer';sub.append(b)});
   tabs.classList.remove('hb-volunteer-submenu-matches-smallgroups');tabs.classList.add('hb-volunteer-sidebar-tabs');tabs.style.cssText='display:flex!important;flex-direction:column!important;gap:0!important;width:100%!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important';
   sub.style.display='flex';
 }
 root.insertBefore(section,root.firstChild);
 if(parentButton){side.querySelector('#hb-volunteer-sidebar-subnav button')?.click();}
 else {section.insertBefore(tabs,section.firstChild);tabs.children[0]?.click();}
 // Keep the actual sidebar submenu; remove only any stray duplicate in the content.

}
function labelRegionalPerformances(){
 if(!/ministry-5/.test(location.hash))return;
 const local=[...document.querySelectorAll('h2,h3,h4,h5')].filter(h=>h.getClientRects().length&&/^(지역공연|봉사와 섬김 현장)$/.test(h.textContent.trim()));
 for(const h of local){
   const title=h.textContent.trim();
   const card=h.closest('[class*="card"],article,section')||h.parentElement;
   if(title==='봉사와 섬김 현장'){
     const img=card?.querySelector('img');
     if(img){h.textContent='지역 연예인 뮤지컬 공연';h.style.marginBottom='16px';}
     else h.remove();
   }else if(title==='지역공연'){
     h.textContent='지역 모노드라마 공연';
     h.style.marginBottom='16px';
   }
 }
 for(const h of document.querySelectorAll('h4')){
   if(h.textContent.trim()==='지역 연예인 뮤지컬 공연'&&h.previousElementSibling?.textContent?.trim()==='지역 모노드라마 공연')h.remove();
   if(h.textContent.trim()==='지역 모노로그 공연')h.textContent='지역 모노드라마 공연';
 }
}
function moveMusicalTitleAbovePhoto(){
 if(!/ministry-5/.test(location.hash))return;
 const heads=[...document.querySelectorAll('h2,h3,h4,h5')].filter(h=>h.getClientRects().length&&h.textContent.trim()==='지역 연예인 뮤지컬 공연');
 for(const h of heads){
   const card=h.closest('[class*="card"],section,article')||h.parentElement;
   const image=card?.querySelector('img');
   if(!image)continue;
   const figure=image.closest('figure')||image.closest('a')||image;
   if(figure.contains(h))continue;
   if(h.compareDocumentPosition(figure)&Node.DOCUMENT_POSITION_PRECEDING){
      figure.parentElement.insertBefore(h,figure);
      h.style.margin='0 0 16px';
   }
 }
}
function isolateVolunteerCategory(){
 if(!/ministry-5/.test(location.hash))return;
 const panel=document.querySelector('#hb-volunteer-categories [data-category]:not([hidden])');
 if(!panel)return;
 const local=panel.dataset.category==='지역·문화섬김';
 for(const h of document.querySelectorAll('h2,h3,h4,h5')){
   if(!/^(지역 모노드라마 공연|지역 연예인 뮤지컬 공연|위대한 응원)$/.test((h.textContent||'').trim()))continue;
   const card=h.closest('[class*="card"],article,section')||h.parentElement;
   if(!card||card.id==='hb-volunteer-categories'||card.contains(document.querySelector('#hb-volunteer-categories .hb-volunteer-submenu-matches-smallgroups')))continue;
   if(card.closest('#hb-volunteer-categories [data-category]'))continue;
   const desired=local?'':'none';
   if(card.style.display!==desired)card.style.display=desired;
 }
}
function placeCheerButton(){
 if(!/ministry-5/.test(location.hash))return;
 const h=[...document.querySelectorAll('h2,h3,h4,h5')].find(e=>e.getClientRects().length&&e.textContent.trim()==='위대한 응원');
 if(!h)return;
 const card=h.closest('article,section,[class*="card"],[class*="album-item"]')||h.parentElement?.parentElement;
 if(!card||card.querySelector('[data-cheer-action]'))return;
 const img=card.querySelector('img');if(!img)return;
 const a=document.createElement('a');a.dataset.cheerAction='1';a.href='https://naver.me/5SKXOhp0';a.target='_blank';a.rel='noopener noreferrer';a.textContent='응원영상보러가기';a.style.cssText='display:block;width:max-content;max-width:100%;box-sizing:border-box;text-align:center;margin:14px auto 0;padding:12px 23px;border-radius:10px;background:#086b94;color:#fff;text-decoration:none;font-size:16px;font-weight:800';
 (img.closest('a')||img).insertAdjacentElement('afterend',a);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();placeCheerButton();labelRegionalPerformances();moveMusicalTitleAbovePhoto();isolateVolunteerCategory()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();