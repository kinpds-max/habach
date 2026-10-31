(()=>{'use strict';
const names=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
function render(){
 if(!/ministry-5|봉사와.?섬김/.test(location.hash+location.pathname+' '+document.title)&&![...document.querySelectorAll('h1,h2,h3')].some(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||'')))return;
 const heading=[...document.querySelectorAll('h1,h2,h3,h4')].reverse().find(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||'')&&h.textContent.trim().length<75);
 if(!heading)return;
 const root=heading.closest('article,.article,.page-content,.content-body,.subpage-content')||heading.parentElement?.parentElement||heading.parentElement;
 if(!root||root.querySelector('#hb-volunteer-categories'))return;
 const section=document.createElement('section');section.id='hb-volunteer-categories';section.style.cssText='margin:0 0 22px;padding:0;border:0;background:transparent';
 
 const tabs=document.createElement('div');tabs.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:16px';
 const existingBoard=[...root.querySelectorAll('section,div')].find(e=>e!==root&&e.querySelector('input[placeholder*="제목 검색"]')&&/봉사와\s*섬김\s*게시판/.test(e.textContent||''));if(existingBoard)existingBoard.style.display='none';const original=[...root.children].filter(e=>e!==section&&e!==existingBoard&&!e.contains(heading)&&!e.matches('script,style')&&e.getBoundingClientRect().top>=heading.getBoundingClientRect().top);
 const panels=names.map((name,i)=>{const panel=document.createElement('div');panel.dataset.category=name;panel.hidden=i!==0;if(i===0){original.forEach(e=>panel.append(e));}else{const title=document.createElement('h3');title.textContent=i===1?'너는 잘될 거야':'덕분에 잘됐습니다';title.style.cssText='margin:18px 0 8px;font-size:clamp(22px,4vw,30px);font-weight:800;color:#205676';const p=document.createElement('p');p.textContent='활동 사진과 영상이 등록될 예정입니다.';p.style.cssText='color:#62778a;margin:14px 0';const album=document.createElement('div');album.className='hb-volunteer-media-album';album.dataset.service=i===1?'children':'parents';if(i===1){p.textContent='5월 가정의 달 · 너는 잘될 거야';album.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0';const images=["https://files.mallary.ai/uploads/900/chatgpt_1793426450783_0c594477ea84204c.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426453670_e345e10bd41d27f7.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426456099_aee978fbeb1f582b.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426459734_ee4e9a5e493d7e4b.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426462359_42e9763907b0fdab.jpg","https://files.mallary.ai/uploads/900/chatgpt_1793426465419_3226d05108103e6f.jpg"];images.forEach((src,j)=>{const a=document.createElement('a');a.href=src;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;border-radius:12px;overflow:hidden;border:1px solid #dae6ec';const im=document.createElement('img');im.src=src;im.alt='너는 잘될 거야 가정의 달 행사 사진 '+(j+1);im.loading='lazy';im.style.cssText='display:block;width:100%;aspect-ratio:4/3;object-fit:cover';a.append(im);album.append(a);});}panel.append(title,p,album);}section.append(panel);return panel});
 names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.style.cssText='min-width:0;padding:10px 4px;border:1px solid #c8dbe6;border-radius:9px;font-size:clamp(11px,2.8vw,15px);font-weight:700;cursor:pointer';b.onclick=()=>{panels.forEach((p,j)=>p.hidden=i!==j);[...tabs.children].forEach((x,j)=>{x.style.background=i===j?'#dceef8':'white';x.style.color=i===j?'#135679':'#34566d'});};tabs.append(b)});
 section.insertBefore(tabs,section.firstChild);root.insertBefore(section,root.firstChild);tabs.children[0].click();
}
function placeCheerButton(){
 if(!/ministry-5/.test(location.hash))return;
 const h=[...document.querySelectorAll('h2,h3,h4,h5')].find(e=>e.getClientRects().length&&e.textContent.trim()==='위대한 응원');
 if(!h)return;
 const card=h.closest('article,section,[class*="card"],[class*="album-item"]')||h.parentElement?.parentElement;
 if(!card||card.querySelector('[data-cheer-action]'))return;
 const img=card.querySelector('img');if(!img)return;
 const a=document.createElement('a');a.dataset.cheerAction='1';a.href='https://naver.me/5SKXOhp0';a.target='_blank';a.rel='noopener noreferrer';a.textContent='응원하기';a.style.cssText='display:inline-block;margin:14px 0 0;padding:12px 23px;border-radius:10px;background:#086b94;color:#fff;text-decoration:none;font-size:16px;font-weight:800';
 (img.closest('a')||img).insertAdjacentElement('afterend',a);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();placeCheerButton()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();