(()=>{'use strict';
const admin='/admin/bulletin.html';
function isHome(){return !location.hash||/^#\/?(?:home)?$/.test(location.hash)}
function isBulletin(){return /news-|bulletin|주보/.test(location.hash)&&[...document.querySelectorAll('h1,h2,h3,h4')].some(h=>/주보/.test(h.textContent||''))}
function add(){
 // Upload control is owned by the bulletin board heading, not the old preview.
 document.querySelectorAll('[data-hb-bulletin-upload]').forEach(el=>el.remove());
 if(!/^#\/?news-2(?:$|[?&])/.test(location.hash))return;
 const article=document.querySelector('#app .page-grid article.article');
 if(!article)return;
 const heading=[...article.querySelectorAll('h2,h3,h4')].find(h=>/주보\s*게시판/.test(h.textContent||''));
 if(!heading)return;
 let row=heading.closest('.hb-board-title-row');
 if(!row){row=document.createElement('div');row.className='hb-board-title-row';heading.parentNode.insertBefore(row,heading);row.append(heading)}
 if(!row.querySelector('a[href="/admin/bulletin.html"]')){
  const link=document.createElement('a');link.href='/admin/bulletin.html';link.textContent='업로드';row.append(link);
 }
}
let busy=false;function update(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;add()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();addEventListener('hashchange',update);new MutationObserver(update).observe(document.documentElement,{subtree:true,childList:true});
})();