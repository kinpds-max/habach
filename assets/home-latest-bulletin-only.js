(()=>{'use strict';
const pages=['https://files.mallary.ai/uploads/900/chatgpt_1793441710393_49871ef90359295e.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793441713476_eed03a6645c3857b.jpg','https://files.mallary.ai/uploads/900/chatgpt_1793441718789_f40aec5ec4270029.jpg'];
const HOME=()=>!location.hash||/^#\/?(?:home)?$/.test(location.hash);
const matching=t=>/^(?:이번\s*주\s*)?(?:교회\s*)?주보(?:\s*(?:미리보기|앨범))?$/.test((t||'').trim());
function fix(){
 if(!HOME())return;
 // Multiple gallery scripts can append the exact same dated bulletin card.
 // Keep the first complete 3-page gallery; remove later sibling gallery cards.
 const dated=[...document.querySelectorAll('h2,h3,h4')].filter(h=>h.textContent.trim()==='2026년 10월 25일 교회 주보');
 if(dated.length>1){
  const card=h=>h.closest('section,article,[class*="card"]')||h.parentElement;
  const firstCard=card(dated[0]);
  for(const h of dated.slice(1)){
   const duplicate=card(h);
   if(duplicate&&duplicate!==firstCard&&!duplicate.contains(firstCard)&&!firstCard.contains(duplicate))duplicate.remove();
  }
 }

 const headings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getClientRects().length&&matching(h.textContent));
 if(!headings.length)return;
 const first=headings[0];const block=h=>h.closest('section,article,[class*="bulletin-card"],[class*="bulletin-section"]')||h.parentElement?.parentElement||h.parentElement;
 const main=block(first);if(!main)return;
 for(const h of headings.slice(1)){const el=block(h);if(el&&el!==main&&!el.contains(main)&&!main.contains(el))el.remove();}
 let wrap=main.querySelector('#hb-home-latest-bulletin');
 if(wrap)return;
 // Replace only bulletin previews, leaving surrounding home sections untouched.
 for(const el of [...main.querySelectorAll('img')]){const parent=el.closest('a,figure,[class*="preview"],[class*="bulletin"]')||el;if(parent!==main)parent.remove();}
 for(const e of [...main.querySelectorAll('a')])if(/주보|bulletin/.test((e.textContent||'')+' '+(e.getAttribute('href')||''))&&!e.closest('nav'))e.remove();
 wrap=document.createElement('div');wrap.id='hb-home-latest-bulletin';wrap.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0 18px';
 pages.forEach((src,i)=>{const a=document.createElement('a');a.href=src;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','최신 주보 '+(i+1)+'쪽 크게 보기');const img=document.createElement('img');img.src=src;img.loading='lazy';img.alt='2026년 10월 25일 하늘바람교회 주보 '+(i+1)+'쪽';img.style.cssText='width:100%;aspect-ratio:0.72;object-fit:contain;display:block;border:1px solid #dae4ec;border-radius:8px;background:white';a.append(img);wrap.append(a)});
 const caption=document.createElement('p');caption.textContent='최신 등록 주보 · 2026년 10월 25일 (3쪽)';caption.style.cssText='font-size:14px;color:#536f81;margin:5px 0 12px';
 main.append(caption,wrap);
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;fix()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();