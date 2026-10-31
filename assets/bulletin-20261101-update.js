(()=>{'use strict';
const images=['https://files.mallary.ai/uploads/900/chatgpt_1793444947230_bf066151de14f8d1.png','https://files.mallary.ai/uploads/900/chatgpt_1793444952790_16e3c7d345f4ffde.png','https://files.mallary.ai/uploads/900/chatgpt_1793444957877_10bec27b7e245292.png'];
function run(){
 const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5')].filter(x=>x.getClientRects().length&&/이번\s*주\s*교회\s*주보|교회\s*주보/.test(x.textContent||'')&&x.textContent.trim().length<60);
 for(const h of headings){
   let box=h.closest('section,article,[class*="bulletin"]')||h.parentElement?.parentElement;
   if(!box||box===document.body)continue;
   const oldImages=[...box.querySelectorAll('img')].filter(im=>/mallary|주보|bulletin/.test(im.src+' '+im.alt));
   if(oldImages.length>=3){
     oldImages.slice(0,3).forEach((im,i)=>{if(im.src!==images[i]){im.src=images[i];im.alt='2026년 11월 1일 교회 주보 '+(i+1)+'쪽';const a=im.closest('a[href]');if(a&&/mallary|주보|bulletin/.test(a.href))a.href=images[i]}});
     oldImages.slice(3).forEach(im=>{const c=im.closest('a')||im;if(c.parentElement)c.remove()});
   }
   const title=box.querySelector('h2,h3,h4');if(title&&/2026년\s*10월\s*25일/.test(title.textContent))title.textContent='2026년 11월 1일 교회 주보';
   const buttons=[...box.querySelectorAll('a,button')].filter(e=>/이번\s*주\s*교회\s*주보\s*업로드|주보\s*게시판/.test(e.textContent||''));
   if(buttons.length){
    let row=box.querySelector('#hb-bulletin-one-line-actions');
    if(!row){row=document.createElement('div');row.id='hb-bulletin-one-line-actions';row.style.cssText='display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:center!important;gap:8px!important;width:100%!important;margin:12px 0!important';buttons[0].parentElement.insertBefore(row,buttons[0]);}
    buttons.forEach(b=>{row.append(b);b.style.cssText+=';display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:1 1 0!important;min-width:0!important;white-space:nowrap!important;font-size:clamp(11px,2.8vw,15px)!important;padding:11px 5px!important;box-sizing:border-box!important;text-align:center!important'});
   }
 }
}
let q=false;function schedule(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;run()})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();