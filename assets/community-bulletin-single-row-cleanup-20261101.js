(()=>{'use strict';
function apply(){
 if(!/^#\/?news-2(?:[?&]|$)/.test(location.hash))return;
 const article=document.querySelector('#app article.article');if(!article)return;
 // Delete only the obsolete one-line empty-board notice. Keep the bulletin page, menu, posts and uploads intact.
 const empty=[...article.querySelectorAll('.empty,.hb-static-empty')];
 for(const row of empty)if(/등록된 게시물이 없습니다|관리자 게시판은 추후 연결됩니다/.test(row.textContent||''))row.remove();
}
let busy=false;function tick(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
window.addEventListener('hashchange',tick);
const app=document.getElementById('app')||document.documentElement;
new MutationObserver(tick).observe(app,{childList:true,subtree:false});
})();