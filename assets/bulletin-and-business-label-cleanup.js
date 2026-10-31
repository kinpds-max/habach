(()=>{'use strict';let active=false;function fix(){if(active)return;active=true;try{
if(/^#\/?news-(?:1|2|6)$/.test(location.hash)){
 const article=document.querySelector('.page-grid article.article');
 const boardHead=article?.querySelector('.article-title + .boardhead');
 if(boardHead)boardHead.style.setProperty('display','none','important');
 }
if(location.hash==='#/news-2'||location.hash==='#news-2'){
const article=document.querySelector('.page-grid article.article');if(article){const title=article.querySelector('.article-title');if(title){let removed=0;for(let node=title.nextElementSibling;node&&removed<2;){const next=node.nextElementSibling;const empty=/^(HR|DIV)$/i.test(node.tagName)&&!(node.textContent||'').trim()&&!node.querySelector('a,img,button,input,table');if(empty&&((node.tagName==='HR')||node.offsetHeight<=3)){node.remove();removed++}node=next}}}
}
for(const heading of document.querySelectorAll('h2,h3,h4'))if(heading.textContent.trim()==='교인 사업자정보 영상')heading.textContent='사업자심방 영상';
}finally{active=false}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();addEventListener('hashchange',fix);new MutationObserver(()=>requestAnimationFrame(fix)).observe(document.documentElement,{childList:true,subtree:true});})();