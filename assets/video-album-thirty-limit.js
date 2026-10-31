(()=>{'use strict';
const lists={'sermon-8':'PLmD7ZicLdWIpZeJVlgfXuYYaOSHjwuG6R','sermon-event-1':'PLmD7ZicLdWIr2ZEuTbox3JN1HtmZPL4G-','sermon-event-2':'PLmD7ZicLdWIogu1FRwzVeQEl5u65ergLO','sermon-member-1':'PLmD7ZicLdWIqhiIi5ZfjOzIx1uiJI8f0c','sermon-member-2':'PLmD7ZicLdWIqmp13mlhv_6a_qVi59Fjkm','sermon-member-3':'PLmD7ZicLdWIpFunENSvRQ9OM-LkHr_-07','sermon-member-4':'PLmD7ZicLdWIr3-kWBB-H1-hD9D4NokQyU','sermon-member-5':'PLmD7ZicLdWIqfKtJXSTyp8e1Qb2DIQ5tr'};
let fetched={};const shown={};let queued=false;
fetch('/assets/official-video-albums.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(x=>{fetched=x;requestAnimationFrame(render)}).catch(()=>{});
function render(){const key=(location.hash.match(/(?:sermon-member-\d+|sermon-event-\d+|sermon-\d+)/)||[])[0];if(!key||key==='sermon-11')return;
const title=[...document.querySelectorAll('h2,h3,h4')].find(h=>h.getClientRects().length&&/영상 앨범/.test(h.textContent||'')&&!h.closest('header'));
if(!title)return;const box=title.closest('.hb-static-board')||title.closest('section');if(!box)return;
const grid=box.querySelector('.hb-static-sermon-grid');if(!grid)return;
const data=Array.isArray(fetched[key])?fetched[key]:[];
let official=box.querySelector('[data-hb-official-grid]');
if(data.length){if(!official){official=document.createElement('div');official.dataset.hbOfficialGrid='1';official.className='hb-static-sermon-grid';grid.insertAdjacentElement('afterend',official)}
const existed=new Set([...official.querySelectorAll('[data-video]')].map(e=>e.dataset.video));for(const v of data){if(!v.id||!/^[A-Za-z0-9_-]{11}$/.test(v.id)||existed.has(v.id))continue;existed.add(v.id);const a=document.createElement('a');a.dataset.video=v.id;a.className='sermon-album-card static-sermon-card';a.href='https://www.youtube.com/watch?v='+v.id;a.target='_blank';a.rel='noopener noreferrer';const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg';img.alt=v.title||'교회 영상';img.loading='lazy';img.style.cssText='width:100%;aspect-ratio:16/9;object-fit:cover';const label=document.createElement('strong');label.textContent=v.title||'교회 영상';label.style.cssText='display:block;padding:10px';a.append(img,label);official.append(a)}grid.style.setProperty('display','none','important')}
const target=data.length?official:grid;
const seen=new Set();const cards=[...target.querySelectorAll('a[data-video]')].filter(a=>{if(seen.has(a.dataset.video)){a.remove();return false}seen.add(a.dataset.video);return true});
const limit=shown[key]||30;
cards.forEach((a,i)=>a.style.setProperty('display',i<limit?'block':'none','important'));
let more=box.querySelector('[data-hb-show-more]');if(!more){more=document.createElement('button');more.type='button';more.dataset.hbShowMore='1';more.style.cssText='display:block;margin:20px auto;padding:12px 28px;border-radius:9px;border:1px solid #cddfea;background:#eaf4fc;color:#315b7d;font-weight:700;cursor:pointer';box.append(more);more.onclick=()=>{shown[key]=(shown[key]||30)+30;render()}}
more.textContent='더보기 +30';more.style.display=cards.length>limit?'block':'none';
// Only one official link, and place it at the end of the album.
const buttons=[...box.querySelectorAll('a,button')].filter(a=>(a.textContent||'').trim()==='공식 전체 영상 보기 ↗');
let link=buttons[0];if(!link){link=document.createElement('a');link.textContent='공식 전체 영상 보기 ↗';link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='display:table;margin:18px auto 22px;padding:12px 20px;background:#e8f2fb;color:#315e80;border-radius:9px;text-decoration:none;font-weight:700';box.append(link)}
buttons.slice(1).forEach(a=>a.remove());
const article=box.closest('article');if(article){for(const a of article.querySelectorAll('a,button')){if(a===link)continue;if((a.textContent||'').trim()==='공식 전체 영상 보기 ↗')a.remove();}}
link.href=lists[key]?'https://www.youtube.com/playlist?list='+lists[key]:'https://www.youtube.com/@Gimpo_HBC/videos';link.target='_blank';link.rel='noopener noreferrer';
if(link.parentElement===box&&box.lastElementChild!==link)box.append(link);
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();