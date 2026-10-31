(()=>{'use strict';
const ids=['Nsdeq7or5Kw','icuBPEbxOcg','Y6iVSxI8OWg'];
const service=/교인\s*사업|사업자\s*정보|사업장\s*정보|사업\s*정보/;
function init(){
 const headings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(el=>el.getClientRects().length&&service.test(el.textContent||'')&&el.textContent.length<75);
 if(!headings.length)return;
 const h=headings[headings.length-1];
 const host=h.closest('article,.article,.page-content,.subpage-content,section')||h.parentElement;
 if(!host||host.querySelector('#hb-business-shorts'))return;
 const section=document.createElement('section');section.id='hb-business-shorts';section.style.cssText='margin:25px 0;padding:16px 0';
 const title=document.createElement('h3');title.textContent='교인 사업자정보 영상';title.style.cssText='margin:0 0 16px;font-size:clamp(20px,4vw,26px);color:#234f68';
 const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px';
 section.append(title,grid);
 const existing=[...host.querySelectorAll('a[href]')].map(a=>a.href).join(' ');
 for(const id of ids){
  if(existing.includes(id))continue;
  const a=document.createElement('a');a.href='https://youtube.com/shorts/'+id;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='min-width:0;border:1px solid #dce5eb;border-radius:15px;overflow:hidden;text-decoration:none;background:white;color:#224b63';
  const frame=document.createElement('div');frame.style.cssText='aspect-ratio:4/3;background:#1e2c3a;position:relative';
  const image=document.createElement('img');image.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';image.loading='lazy';image.alt='사업자정보 영상';image.style.cssText='display:block;width:100%;height:100%;object-fit:contain';
  const play=document.createElement('span');play.textContent='▶';play.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#23536e';
  const label=document.createElement('div');label.textContent='사업자정보 영상';label.style.cssText='padding:12px;font-weight:700;line-height:1.4;min-height:44px';
  frame.append(image,play);a.append(frame,label);grid.append(a);
  fetch('https://noembed.com/embed?url='+encodeURIComponent(a.href)).then(r=>r.json()).then(data=>{if(data.title)label.textContent=data.title}).catch(()=>{});
 }
 if(!grid.children.length)return;
 host.append(section);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;init()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();