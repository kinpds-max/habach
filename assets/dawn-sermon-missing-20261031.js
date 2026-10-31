(()=>{'use strict';
const vid='L27QCTEVw0k',url='https://www.youtube.com/live/'+vid;
function update(){
 const hs=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.getClientRects().length&&/새벽설교\s*영상\s*앨범|새벽예배\s*영상\s*앨범/.test(h.textContent||''));
 for(const h of hs){
  const root=h.closest('section,article,[class*="album"]')||h.parentElement?.parentElement;
  if(!root)return;
  const grid=root.querySelector('.hb-static-sermon-grid,[class*="sermon-grid"],[class*="album-grid"]')||[...root.querySelectorAll('div')].find(e=>[...e.children].filter(x=>x.querySelector('img')&&x.querySelector('a[href]')).length>=2);
  if(!grid)continue;
  const cards=[...grid.querySelectorAll('a[data-video],a[href*="youtube.com"],a[href*="youtu.be"]')].filter(a=>a.querySelector('img'));
  const getid=a=>a.dataset.video||a.href.match(/(?:watch\?v=|live\/|youtu\.be\/)([\w-]{11})/)?.[1];
  const seen=new Set();
  for(const a of cards){const id=getid(a);if(!id)continue;
   const label=a.querySelector('strong')?.textContent?.trim()||'';
   const dated=/10월\s*29일|2026[.\- ]+10[.\- ]+29/.test(label+' '+a.textContent);
   if(seen.has(id)||(dated&&seen.has('2026-10-29'))){a.remove();continue}
   seen.add(id);if(dated)seen.add('2026-10-29');
  }
  if(!grid.querySelector('a[href*="'+vid+'"]')){
   const a=document.createElement('a');a.className='sermon-album-card static-sermon-card';a.dataset.video=vid;a.href=url;a.target='_blank';a.rel='noopener noreferrer';
   a.innerHTML='<span class="sermon-album-thumb"><img loading="lazy" src="https://i.ytimg.com/vi/'+vid+'/hqdefault.jpg" alt="새벽예배 영상"><i aria-hidden="true">▶</i></span><span class="sermon-album-copy"><strong>새벽예배 · 최신 등록 영상</strong></span>';
   grid.prepend(a);
   fetch('https://noembed.com/embed?url='+encodeURIComponent(url)).then(r=>r.json()).then(d=>{if(d.title)a.querySelector('strong').textContent=d.title}).catch(()=>{});
  }
 }
}
let pending=false;function tick(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();addEventListener('hashchange',tick);new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
})();