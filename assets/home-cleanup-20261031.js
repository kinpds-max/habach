(()=>{'use strict';
const home=()=>!location.hash||/^#\/?(?:home)?$/.test(location.hash);
const disclaimer='목표 및 비전이며 실제 달성 실적을 의미하지 않습니다';
function clean(){
 for(const el of document.querySelectorAll('p,small,span,div'))if(!el.children.length&&el.textContent.includes(disclaimer))el.remove();
 if(!home())return;
 for(const el of [...document.querySelectorAll('#hb-home-latest-bulletin,#hb-home-latest-bulletin-restored,#hb-bulletin-20261025')])el.remove();
 for(const h of [...document.querySelectorAll('h2,h3,h4')]){
  if(!/^2026년\s*10월\s*25일\s*교회\s*주보$/.test(h.textContent.trim()))continue;
  const box=h.closest('section,article,[class*="bulletin-card"]')||h.parentElement;
  if(box&&box!==document.body&&box.querySelectorAll('img').length>=1)box.remove();
 }
}
let busy=false;function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;clean()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();