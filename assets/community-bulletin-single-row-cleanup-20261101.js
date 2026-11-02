(()=>{'use strict';
function apply(){

 const article=document.querySelector('#app article.article')||document.querySelector('#app');if(!article)return;
 for(const row of article.querySelectorAll('.empty,.hb-static-empty')){
  if(/등록된 게시물이 없습니다|관리자 게시판은 추후 연결됩니다/.test(row.textContent||''))row.remove();
 }
 // Remove the duplicated dated November list on both homepage and community bulletin.
 for(const h of [...article.querySelectorAll('*')]){
  if(h.children.length || !/^2026년\s*11월\s*교회\s*일정$/.test((h.textContent||'').trim()))continue;
  let box=h.parentElement;
  for(let i=0;i<6&&box&&box!==article;i++,box=box.parentElement){
   const t=box.textContent||'';
   if(/2026-11-01/.test(t)&&/2026-11-17/.test(t)&&t.length<4500){box.remove();break;}
  }
 }
 if(!/^#\\/?news-2(?:[?&]|$)/.test(location.hash))return;
 // Remove the broken, duplicate bulletin preview above the upload button.
 // Preserve the upload action, bulletin board, and all bulletin records.
 const upload=[...article.querySelectorAll('a,button')].find(e=>/이번\s*주\s*교회\s*주보\s*업로드/.test(e.textContent||''));
 const headings=[...article.querySelectorAll('h1,h2,h3,h4,h5,p,div,span')].filter(e=>
  e.children.length===0 && /^교회\s*주보$/.test((e.textContent||'').trim()));
 for(const heading of headings){
  if(!heading.isConnected)continue;
  let block=heading.parentElement;
  for(let i=0;i<4&&block&&block!==article;i++,block=block.parentElement){
   if(upload&&block.contains(upload))break;
   const buttons=[...block.querySelectorAll('button,a')].filter(e=>/^(‹?\s*이전|다음\s*›?)$/.test((e.textContent||'').trim()));
   if(buttons.length>=2){
    block.remove();
    break;
   }
  }
 }
 // Some versions render the title and paging controls as siblings.
 const controls=[...article.querySelectorAll('button,a')].filter(e=>/^(‹?\s*이전|다음\s*›?)$/.test((e.textContent||'').trim()));
 if(controls.length>=2){
  const first=controls[0],last=controls[1];
  const parent=first.parentElement;
  if(parent&&parent===last.parentElement&&(!upload||!parent.contains(upload))){
   const preceding=parent.previousElementSibling;
   if(preceding&&/^교회\s*주보$/.test((preceding.textContent||'').trim()))preceding.remove();
   parent.remove();
  }
 }
}
let busy=false;function tick(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
window.addEventListener('hashchange',tick);
const app=document.getElementById('app')||document.documentElement;
new MutationObserver(tick).observe(app,{childList:true,subtree:true});
})();