(()=>{'use strict';
const pages=['https://files.mallary.ai/uploads/900/chatgpt_1793441710393_49871ef90359295e.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793441713476_eed03a6645c3857b.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793441718789_f40aec5ec4270029.jpg'];
function home(){return !location.hash||/^#\/?(?:home)?$/.test(location.hash)}
function fix(){
 if(!home())return;
 const headings=[...document.querySelectorAll('h2,h3,h4')].filter(h=>h.textContent.trim()==='2026년 10월 25일 교회 주보');
 let existing=document.getElementById('hb-home-latest-bulletin-restored');
 if(existing&&existing.isConnected)return;
 // Use the first dated bulletin card as its location. Remove only exact duplicate bulletin cards.
 const card=h=>h.closest('section,article')||h.parentElement;
 const primary=headings.length?card(headings[0]):null;
 for(const h of headings.slice(1)){
  const extra=card(h);
  if(extra&&extra!==primary&&!extra.contains(primary)&&!primary?.contains(extra))extra.remove();
 }
 const host=primary||[...document.querySelectorAll('section,article,div')].find(el=>el.children.length<15&&[...el.querySelectorAll('h2,h3')].some(h=>/^(?:교회\s*)?주보$/.test(h.textContent.trim())));
 if(!host)return;
 const old=host.querySelector('#hb-home-latest-bulletin');if(old)old.remove();
 // Avoid changing the surrounding page or removing unrelated elements.
 const gallery=document.createElement('div');gallery.id='hb-home-latest-bulletin-restored';gallery.style.cssText='padding:12px 0;display:grid;grid-template-columns:1fr;gap:14px';
 pages.forEach((src,i)=>{const link=document.createElement('a');link.href=src;link.target='_blank';link.rel='noopener noreferrer';const img=document.createElement('img');img.src=src;img.alt='2026년 10월 25일 교회 주보 '+(i+1)+'쪽';img.loading=i===0?'eager':'lazy';img.style.cssText='width:100%;height:auto;display:block;border:1px solid #dbe5eb;border-radius:9px';link.append(img);gallery.append(link)});
 host.append(gallery);
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;fix()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();