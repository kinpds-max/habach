(()=>{'use strict';
const idOf=url=>{const m=String(url||'').match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?(?:[^#]*?&)?v=|embed\/|live\/))([\w-]{11})/);return m?.[1]||null};
const norm=s=>String(s||'').replace(/\s+/g,'').toLowerCase();
const isAlbum=h=>/교회영상|찬양영상/.test(h.textContent||'')&&/앨범|영상/.test(h.textContent||'')&&h.textContent.length<90;
function albumRoot(h){
 let e=h.parentElement;
 for(let i=0;e&&i<5;i++,e=e.parentElement){
  const cards=[...e.querySelectorAll('a[href]')].filter(a=>idOf(a.href)&&a.querySelector('img'));
  if(cards.length>=2&&cards.length<=200)return e;
 }
 return null;
}
function titleNode(a){
 return a.querySelector('.sermon-album-copy strong,.video-title,.card-title,.album-title,strong,h3,h4')||
 [...a.querySelectorAll('div,span')].reverse().find(x=>x.children.length===0&&x.textContent.trim().length>0&&!/^[▶▷]$/.test(x.textContent.trim()));
}
async function titleFromYouTube(id){
 for(const endpoint of [
  'https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json',
  'https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)]){
  try{const response=await fetch(endpoint);if(!response.ok)continue;const data=await response.json();if(data.title&&!/^youtube$/i.test(data.title))return data.title}catch(_){}
 }
 return '';
}
let generation=0;
function refresh(){
 const headings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getClientRects().length&&isAlbum(h));
 for(const h of headings){
  const root=albumRoot(h);if(!root)continue;
  const type=/찬양영상/.test(h.textContent)?'praise':'church';
  const cards=[...root.querySelectorAll('a[href]')].filter(a=>idOf(a.href)&&a.querySelector('img'));
  for(const a of cards){
   const id=idOf(a.href);const node=titleNode(a);if(!id||!node)continue;
   const existingTitle=node.textContent.trim();
   if(type==='praise'&&/이승빈\s*집사|정석호\s*장로/.test(existingTitle)){
     const card=a.closest('.sermon-album-card,.video-card,.album-card,[class*="video-item"],[class*="album-item"]')||a;
     card.remove();continue;
   }
   if(type==='church'&&(/^(?:교회영상\s*)?\d+$|^교회영상\s*\d+$/i.test(existingTitle)||!/[가-힣]/.test(existingTitle))&&a.dataset.hbTitleFetch!==id){
    a.dataset.hbTitleFetch=id;
    titleFromYouTube(id).then(title=>{if(title&&a.isConnected){const n=titleNode(a);if(n&&/^교회영상\s*\d+$/i.test(n.textContent.trim()))n.textContent=title}});
   }
  }
 }
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.addEventListener('hashchange',schedule);
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
})();