(()=>{'use strict';
const names=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
function render(){
 if(!/ministry-5|봉사와.?섬김/.test(location.hash+location.pathname+' '+document.title)&&![...document.querySelectorAll('h1,h2,h3')].some(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||'')))return;
 const heading=[...document.querySelectorAll('h1,h2,h3,h4')].reverse().find(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||'')&&h.textContent.trim().length<75);
 if(!heading)return;
 const root=heading.closest('article,.article,.page-content,.content-body,.subpage-content')||heading.parentElement?.parentElement||heading.parentElement;
 if(!root||root.querySelector('#hb-volunteer-categories'))return;
 const section=document.createElement('section');section.id='hb-volunteer-categories';section.style.cssText='margin:24px 0;padding:18px;border:1px solid #dce7ef;border-radius:14px;background:#f7fafc';
 const header=document.createElement('h3');header.textContent='봉사와 섬김';section.append(header);
 const tabs=document.createElement('div');tabs.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:16px';
 const original=[...root.children].filter(e=>e!==section&&!e.contains(heading)&&!e.matches('script,style')&&e.getBoundingClientRect().top>=heading.getBoundingClientRect().top);
 const panels=names.map((name,i)=>{const panel=document.createElement('div');panel.dataset.category=name;panel.hidden=i!==0;if(i===0){original.forEach(e=>panel.append(e));}else{const title=document.createElement('h3');title.textContent=i===1?'너는 잘될 거야':'덕분에 잘됐습니다';title.style.cssText='margin:18px 0 8px;font-size:clamp(22px,4vw,30px);font-weight:800;color:#205676';const p=document.createElement('p');p.textContent='활동 사진과 영상이 등록될 예정입니다.';p.style.cssText='color:#62778a;margin:14px 0';const album=document.createElement('div');album.className='hb-volunteer-media-album';album.dataset.service=i===1?'children':'parents';panel.append(title,p,album);}section.append(panel);return panel});
 names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.style.cssText='min-width:0;padding:10px 4px;border:1px solid #c8dbe6;border-radius:9px;font-size:clamp(11px,2.8vw,15px);font-weight:700;cursor:pointer';b.onclick=()=>{panels.forEach((p,j)=>p.hidden=i!==j);[...tabs.children].forEach((x,j)=>{x.style.background=i===j?'#dceef8':'white';x.style.color=i===j?'#135679':'#34566d'});};tabs.append(b)});
 section.insertBefore(tabs,section.children[1]);root.insertBefore(section,original[0]||null);tabs.children[0].click();
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();