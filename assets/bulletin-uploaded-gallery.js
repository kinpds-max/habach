(()=>{'use strict';
const API='https://veghdecosrimscedkrdo.supabase.co/functions/v1/habach-bulletin-upload';
let latest=null,allBulletins=[],inflight=null,scheduled=false;
const page=()=>location.hash.replace(/^#\/?/,'').split(/[?&]/)[0];
async function load(){
 if(inflight)return inflight;
 inflight=fetch(API,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('주보 API '+r.status);return r.json()}).then(data=>{
  const rows=(data.bulletins||[]).filter(v=>Array.isArray(v.image_urls)&&v.image_urls.length);
  rows.sort((a,b)=>String(b.bulletin_date||'').localeCompare(String(a.bulletin_date||''))||String(b.created_at||'').localeCompare(String(a.created_at||'')));
  allBulletins=rows;latest=rows[0]||null;update();return latest;
 }).catch(e=>{console.warn('Latest bulletin synchronization:',e);return null}).finally(()=>{inflight=null});
 return inflight;
}
function createViewer(id){
 const viewer=document.createElement('section');viewer.id=id;viewer.className='hb-synced-bulletin-viewer';
 const link=document.createElement('a');link.target='_blank';link.rel='noopener noreferrer';link.className='hb-synced-bulletin-image-link';
 const image=document.createElement('img');image.loading='lazy';image.style.cssText='display:block;width:100%;height:auto;max-height:1200px;object-fit:contain;border-radius:10px';link.append(image);
 const caption=document.createElement('p');caption.className='hb-synced-bulletin-title';
 const controls=document.createElement('div');controls.className='hb-synced-bulletin-controls';
 const prev=document.createElement('button');prev.type='button';prev.textContent='‹ 이전';
 const counter=document.createElement('span');
 const next=document.createElement('button');next.type='button';next.textContent='다음 ›';
 controls.append(prev,counter,next);viewer.append(caption,link,controls);return viewer;
}
function bind(viewer,entry){
 const pages=entry.image_urls;
 const key=String(entry.id||entry.bulletin_date)+'-'+pages.join('|');
 if(viewer.dataset.syncedKey===key)return;
 viewer.dataset.syncedKey=key;
 const title=entry.title||String(entry.bulletin_date||'')+' 교회 주보';
 const img=viewer.querySelector('img'),link=viewer.querySelector('a'),caption=viewer.querySelector('.hb-synced-bulletin-title');
 const buttons=viewer.querySelectorAll('button'),counter=viewer.querySelector('.hb-synced-bulletin-controls span');
 let position=0;
 function show(index){position=(index+pages.length)%pages.length;img.src=pages[position];img.alt=title+' '+(position+1)+'쪽';link.href=pages[position];counter.textContent=(position+1)+' / '+pages.length+'쪽';}
 caption.textContent=title;
 buttons[0].onclick=()=>show(position-1);buttons[1].onclick=()=>show(position+1);show(0);
}
function update(){
 if(!latest)return;
 const route=page();
 if(route==='index'||route===''||route==='home'){
  const canonical=document.getElementById('hb-canonical-bulletin-viewer');
  if(canonical){
   // Preserve the homepage's existing viewer controls while synchronizing its pages.
   const a=canonical.querySelector('a[href]'),img=a?.querySelector('img');
   const buttons=canonical.querySelectorAll('button'),counter=canonical.querySelector('button')?.parentElement?.querySelector('span');
   if(a&&img&&buttons.length>=2){
    const key=String(latest.id)+'-'+latest.image_urls.join('|');
    if(canonical.dataset.syncedKey!==key){
     canonical.dataset.syncedKey=key;let i=0;const pages=latest.image_urls;
     function show(n){i=(n+pages.length)%pages.length;img.src=pages[i];a.href=pages[i];img.alt=(latest.title||'교회 주보')+' '+(i+1)+'쪽';if(counter)counter.textContent=(i+1)+' / '+pages.length+'쪽';}
     buttons[0].onclick=()=>show(i-1);buttons[buttons.length-1].onclick=()=>show(i+1);show(0);
    }
   }
  }else{
   const heading=[...document.querySelectorAll('h2,h3')].find(h=>/이번\s*주\s*교회\s*주보/.test(h.textContent||''));
   if(heading){let v=document.getElementById('hb-home-synced-bulletin');if(!v){v=createViewer('hb-home-synced-bulletin');heading.insertAdjacentElement('afterend',v)}bind(v,latest)}
  }
 }
 if(route==='news-2'){
  const article=document.querySelector('#app .page-grid article.article');if(!article)return;
  const board=[...article.querySelectorAll('h2,h3,h4')].find(e=>(e.textContent||'').replace(/\s+/g,'').includes('주보게시판'));
  if(!board)return;
  let viewer=article.querySelector('#hb-community-synced-bulletin');
  if(!viewer){viewer=createViewer('hb-community-synced-bulletin');const row=board.closest('.hb-board-title-row')||board;row.insertAdjacentElement('afterend',viewer)}
  // Every bulletin uses the same one-page-at-a-time slide viewer with arrows.
  const signature=allBulletins.map(e=>String(e.id||e.bulletin_date)+':'+e.image_urls.join('|')).join('~');
  if(viewer.dataset.collectionKey!==signature){
   viewer.dataset.collectionKey=signature;
   viewer.replaceChildren();
   for(const entry of allBulletins){
    const section=createViewer('hb-bulletin-entry-'+String(entry.id||entry.bulletin_date).replace(/[^a-zA-Z0-9-]/g,''));
    section.removeAttribute('id');section.classList.add('hb-bulletin-archive-slide');
    bind(section,entry);
    viewer.append(section);
   }
  }
  article.querySelectorAll('#hb-community-single-bulletin-viewer,#hb-community-uploaded-bulletin').forEach(el=>el.remove());
 }
}
const style=document.createElement('style');style.textContent='#app .hb-synced-bulletin-viewer{margin:15px 0 25px;padding:12px;border:1px solid #dce7f0;border-radius:14px;background:#f7fafd}#app .hb-synced-bulletin-title{font-weight:800;color:#2e5570;margin:0 0 12px}#app .hb-synced-bulletin-controls{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:12px}#app .hb-synced-bulletin-controls button{background:white;border:1px solid #cbdce9;border-radius:8px;padding:9px 15px;color:#315779;font-weight:700;cursor:pointer}';style.textContent+='#app .hb-community-bulletin-two-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;align-items:start}#app .hb-community-bulletin-two-grid a{display:block;width:100%;min-width:0;border:1px solid #d9e4ed;border-radius:10px;overflow:hidden;background:#fff}#app .hb-community-bulletin-two-grid img{display:block;width:100%;height:auto;object-fit:contain} @media(max-width:600px){#app .hb-community-bulletin-two-grid{gap:8px!important}}';style.textContent+='#app #hb-community-synced-bulletin{border:0!important;background:transparent!important;padding:0!important}#app .hb-bulletin-archive-slide{margin:16px 0 28px;padding:16px;border:1px solid #dce7f0;border-radius:14px;background:#f7fafd}#app .hb-bulletin-archive-slide .hb-synced-bulletin-image-link{display:block;width:100%}#app .hb-bulletin-archive-slide img{display:block;width:100%;height:auto;max-height:none;object-fit:contain}';document.head.append(style);
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;update()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
window.addEventListener('hashchange',()=>{schedule();load()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
new MutationObserver(schedule).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:false});
setInterval(()=>{if(!document.hidden)load()},60000);
})();