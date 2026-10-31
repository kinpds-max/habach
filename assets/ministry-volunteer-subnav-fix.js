(()=>{'use strict';
const names=['지역·문화섬김','자녀세대섬김','부모세대섬김'];
const ministry=()=>/ministry-5/.test(location.hash)||[...document.querySelectorAll('h1,h2,h3')].some(h=>/봉사와\s*섬김/.test(h.textContent||''));
const norm=s=>String(s||'').replace(/\s+/g,'').trim();
function mainNav(){
 const controls=[...document.querySelectorAll('button,a,[role="tab"],li')].filter(e=>e.getClientRects().length);
 const active=controls.find(e=>norm(e.textContent).replace(/[›⌄∨>]/g,'')==='봉사와섬김'||norm(e.textContent).startsWith('봉사와섬김'));
 if(!active)return null;
 let node=active.parentElement;
 for(let k=0;node&&k<8;k++,node=node.parentElement){
  const matches=[...node.querySelectorAll('button,a,[role="tab"]')].filter(e=>['예배','기도회','새가족안내','전도·선교','봉사와섬김','소그룹교제'].some(t=>norm(e.textContent).startsWith(norm(t)))).length;
  if(matches>=5)return node;
 }
 return active.closest('nav,ul')||active.parentElement;
}

function ensure(){
 if(!ministry())return;
 const row=mainNav();if(!row)return;
 let tabs=document.querySelector('.hb-volunteer-submenu-matches-smallgroups');
 const menu=document.querySelector('#hb-volunteer-categories');
 if(!tabs){
  tabs=document.createElement('div');
  tabs.className='hb-volunteer-submenu-matches-smallgroups';
  names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;tabs.append(b)});
 }
 if(row.nextElementSibling!==tabs)row.insertAdjacentElement('afterend',tabs);
 tabs.style.cssText='display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;padding:12px!important;margin:8px 0 0!important;border:1px solid #dce7ef!important;border-radius:14px!important;background:#f5f9fc!important;box-sizing:border-box!important;width:100%!important';
 [...tabs.children].forEach((b,i)=>{
  b.style.cssText='min-height:43px!important;padding:8px 5px!important;border:1px solid #d5e0e7!important;border-radius:11px!important;background:'+(tabs.dataset.selected==i?'#dceef8':'#fff')+'!important;color:#23516a!important;font-weight:700!important;cursor:pointer';
  if(b.dataset.bound==='yes')return;
  b.dataset.bound='yes';
  b.addEventListener('click',()=>{
   tabs.dataset.selected=String(i);
   const panels=[...document.querySelectorAll('#hb-volunteer-categories [data-category]')];
   panels.forEach((p,j)=>{p.hidden=i!==j});
   [...tabs.children].forEach((c,j)=>c.style.setProperty('background',i===j?'#dceef8':'#fff','important'));
   if(typeof history.replaceState==='function'){} 
  });
 });
 if(tabs.dataset.selected===undefined){tabs.dataset.selected='0';tabs.children[0]?.style.setProperty('background','#dceef8','important')}
 if(menu){for(const other of menu.querySelectorAll('.hb-volunteer-submenu-matches-smallgroups'))if(other!==tabs)other.remove()}
}
let busy=false;function tick(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;ensure()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
addEventListener('hashchange',tick);new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
})();