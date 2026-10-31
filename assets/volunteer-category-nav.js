(()=>{'use strict';
const names=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
function render(){
 if(!location.hash.includes('ministry-5'))return;
 const heading=[...document.querySelectorAll('h1,h2')].reverse().find(h=>h.getClientRects().length&&/봉사와\s*섬김/.test(h.textContent||''));
 if(!heading)return;
 const root=heading.closest('article,.article,.page-content,main')||heading.parentElement;
 if(!root||root.querySelector('#hb-volunteer-categories'))return;
 const section=document.createElement('section');section.id='hb-volunteer-categories';section.style.cssText='margin:24px 0;padding:18px;border:1px solid #dce7ef;border-radius:14px;background:#f7fafc';
 const header=document.createElement('h3');header.textContent='봉사와 섬김';section.append(header);
 const tabs=document.createElement('div');tabs.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:16px';
 const original=[...root.children].filter(e=>e!==section&&!e.contains(heading)&&!e.matches('script,style')&&e.getBoundingClientRect().top>heading.getBoundingClientRect().bottom);
 const panels=names.map((name,i)=>{const panel=document.createElement('div');panel.dataset.category=name;panel.hidden=i!==0;if(i===0){original.forEach(e=>panel.append(e));}else{const p=document.createElement('p');p.textContent=name+' 게시물이 등록되면 이곳에 표시됩니다.';p.style.cssText='color:#62778a;margin:14px 0';panel.append(p);}section.append(panel);return panel});
 names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.style.cssText='min-width:0;padding:10px 4px;border:1px solid #c8dbe6;border-radius:9px;font-size:clamp(11px,2.8vw,15px);font-weight:700;cursor:pointer';b.onclick=()=>{panels.forEach((p,j)=>p.hidden=i!==j);[...tabs.children].forEach((x,j)=>{x.style.background=i===j?'#dceef8':'white';x.style.color=i===j?'#135679':'#34566d'});};tabs.append(b)});
 section.insertBefore(tabs,section.children[1]);root.append(section);tabs.children[0].click();
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();