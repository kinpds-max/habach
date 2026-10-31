(()=>{'use strict';
const API='https://veghdecosrimscedkrdo.supabase.co/functions/v1/habach-bulletin-upload';
let latest=null,loading=false;
function home(){return !location.hash||/^#\/?(?:home)?$/.test(location.hash)}
async function load(){if(loading)return;loading=true;try{const r=await fetch(API,{cache:'no-store'});if(!r.ok)throw Error('bulletin fetch');const data=await r.json();latest=(data.bulletins||[]).find(b=>Array.isArray(b.image_urls)&&b.image_urls.length);update()}catch(e){console.warn('Bulletin sync',e)}finally{loading=false}}
function setViewer(viewer,pages,title,id){if(viewer.dataset.uploadedId===id)return;const a=viewer.querySelector('a[href]'),img=a?.querySelector('img'),controls=viewer.querySelector('button')?.parentElement;if(!a||!img||!controls)return;viewer.dataset.uploadedId=id;let i=0;const back=controls.querySelector('button:first-child'),next=controls.querySelector('button:last-child'),count=controls.querySelector('span');function show(n){i=(n+pages.length)%pages.length;img.src=pages[i];a.href=pages[i];img.alt=title+' '+(i+1)+'쪽';if(count)count.textContent=(i+1)+' / '+pages.length+'쪽'}if(back)back.onclick=()=>show(i-1);if(next)next.onclick=()=>show(i+1);show(0)}
function update(){if(!latest)return;const pages=latest.image_urls;const main=document.getElementById('hb-canonical-bulletin-viewer');if(main)setViewer(main,pages,latest.title||'교회 주보',latest.id);
 // Remove the broken duplicate "최신 교회 주보" card and its empty controls.
 document.querySelectorAll('#hb-community-uploaded-bulletin').forEach(el=>el.remove());
 // Community page retains its native bulletin board; remove the old broken injected viewer.
 document.querySelectorAll('#hb-community-single-bulletin-viewer,#hb-community-uploaded-bulletin').forEach(e=>e.remove());
 return;
 // Render one actual picture viewer in the community bulletin page only.
 const isCommunity=/news-|bulletin|주보/.test(location.hash);
 if(!isCommunity)return;
 const h=[...document.querySelectorAll('h1,h2,h3')].find(el=>el.getClientRects().length&&el.textContent.trim()==='주보'&&!el.closest('#hb-canonical-bulletin-viewer'));
 if(!h)return;
 const container=h.closest('article,section,.page-content,.subpage-content')||h.parentElement;
 if(!container)return;
 let viewer=container.querySelector('#hb-community-single-bulletin-viewer');
 if(!viewer){viewer=document.createElement('section');viewer.id='hb-community-single-bulletin-viewer';viewer.style.cssText='margin:20px 0;max-width:100%';const a=document.createElement('a');a.target='_blank';a.rel='noopener noreferrer';const img=document.createElement('img');img.alt='교회 주보';img.style.cssText='display:block;width:100%;height:auto;border-radius:10px';a.append(img);const row=document.createElement('div');row.style.cssText='display:flex;justify-content:center;gap:12px;align-items:center;margin-top:12px';const back=document.createElement('button');back.textContent='‹ 이전';const count=document.createElement('span');const next=document.createElement('button');next.textContent='다음 ›';row.append(back,count,next);viewer.append(a,row);h.insertAdjacentElement('afterend',viewer)}
 setViewer(viewer,pages,latest.title||'교회 주보',latest.id);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();addEventListener('hashchange',()=>{latest=null;document.querySelectorAll('#hb-community-uploaded-bulletin').forEach(e=>e.remove());load()});
let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;update()})}).observe(document.documentElement,{childList:true,subtree:true});
})();