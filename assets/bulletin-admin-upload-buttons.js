(()=>{'use strict';
const admin='/admin/bulletin.html';
function isHome(){return !location.hash||/^#\/?(?:home)?$/.test(location.hash)}
function isBulletin(){return /news-|bulletin|주보/.test(location.hash)&&[...document.querySelectorAll('h1,h2,h3,h4')].some(h=>/주보/.test(h.textContent||''))}
function add(){
 const headings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getClientRects().length&&/주보/.test(h.textContent||'')&&h.textContent.length<70);
 if(!headings.length)return;
 if(!isHome()&&!isBulletin())return;
 const h=headings.find(h=>/이번\s*주|교회\s*주보|주보/.test(h.textContent));
 if(!h)return;
 const scope=h.closest('section,article,[class*="bulletin"],[class*="news-card"]')||h.parentElement;
 if(!scope||scope.querySelector('[data-hb-bulletin-upload]'))return;
 const a=document.createElement('a');a.href=admin;a.dataset.hbBulletinUpload='yes';a.textContent='이번 주 교회주보 업로드';a.style.cssText='display:block;width:max-content;max-width:100%;box-sizing:border-box;padding:12px 20px;margin:14px auto;background:#e5f2ff;border-radius:28px;color:#24577b;text-decoration:none;font-weight:700;text-align:center';
 h.insertAdjacentElement('afterend',a);
}
let busy=false;function update(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;add()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();addEventListener('hashchange',update);new MutationObserver(update).observe(document.documentElement,{subtree:true,childList:true});
})();