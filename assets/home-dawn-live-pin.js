(()=>{'use strict';
const isHome=()=>!location.hash||/^#\/?(?:home|index)?$/.test(location.hash);
const exact=t=>/^(?:새벽기도|새벽설교|새벽예배)$/.test(String(t||'').replace(/\s+/g,''));
let latest=null,pressItems=[],queued=false;
const css=document.createElement('style');css.textContent=
'#hb-press-preview{max-width:1180px;margin:42px auto;padding:26px 20px 32px;background:#f7fafc;border:1px solid #e2eaf2;border-radius:16px;box-sizing:border-box;width:calc(100% - 24px)}'+
'#hb-press-preview .hb-press-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;flex-wrap:wrap}'+
'#hb-press-preview h2{margin:0;font-size:clamp(22px,3vw,29px);color:#244967}'+
'#hb-press-preview .hb-press-all{font-size:14px;font-weight:750;text-decoration:none;color:#2875ab}'+
'#hb-press-preview .hb-press-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}'+
'#hb-press-preview .hb-press-item{display:flex;flex-direction:column;gap:8px;padding:19px;background:#fff;border:1px solid #dce7ef;border-radius:12px;text-decoration:none;min-width:0;box-shadow:0 3px 9px rgba(20,60,100,.04)}'+
'#hb-press-preview .hb-press-meta{font-size:12px;color:#6e8498;font-weight:700}'+
'#hb-press-preview .hb-press-title{font-size:16px;font-weight:800;color:#294c67;line-height:1.5;word-break:keep-all}'+
'#hb-press-preview .hb-press-desc{font-size:12px;color:#758a9c;line-height:1.6}'+
'#hb-press-preview .hb-press-open{font-size:12px;color:#2d77a7;font-weight:750;margin-top:auto}'+
'@media(max-width:720px){#hb-press-preview .hb-press-list{grid-template-columns:repeat(2,minmax(0,1fr))}}'+
'@media(max-width:490px){#hb-press-preview .hb-press-list{grid-template-columns:1fr}#hb-press-preview{margin:24px auto;padding:22px 14px}}';
document.head.append(css);
async function refreshData(){
 try{
  const r=await fetch('/assets/official-video-albums.json',{cache:'no-store'});
  if(r.ok){const data=await r.json();const items=Array.isArray(data['sermon-8'])?data['sermon-8']:[];const valid=items.find(v=>v&&/^[A-Za-z0-9_-]{11}$/.test(v.id)&&/새벽/.test(v.title||''));if(valid){latest=valid;queue();}}
 }catch(e){console.warn('최신 새벽예배 링크 조회 실패',e)}
 try{
  const r=await fetch('/assets/church-press.json',{cache:'no-store'});
  if(r.ok){pressItems=(await r.json()).sort((a,b)=>(b.date||'').localeCompare(a.date||''));queue();}
 }catch(e){console.warn('언론보도 조회 실패',e)}
}
function dawn(){
 if(!isHome()||!latest)return;
 const headings=[...document.querySelectorAll('h2,h3,h4,h5,strong')].filter(x=>exact(x.textContent)&&x.getClientRects().length);
 const id=latest.id,url='https://www.youtube.com/watch?v='+id;
 for(const heading of headings){
  let scope=heading.parentElement;
  for(let depth=0;scope&&depth<5;depth++,scope=scope.parentElement){
   const cards=[...scope.querySelectorAll('a,[class*="video-card"],[class*="video-item"],[class*="media-card"]')].filter(el=>el.querySelector('img')&&el.getBoundingClientRect().top>=heading.getBoundingClientRect().top-15);
   if(!cards.length)continue;
   const card=cards[0],a=card.matches('a')?card:card.querySelector('a');
   if(card.dataset.hbLatestDawn===id)return;
   if(a){a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.onclick=null}
   const img=card.querySelector('img');if(img){img.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';img.removeAttribute('srcset');img.alt=latest.title||'하늘바람교회 새벽예배'}
   const label=card.querySelector('h3,h4,h5,[class*="title"]');if(label)label.textContent=latest.title||'하늘바람교회 새벽예배';
   card.dataset.hbLatestDawn=id;return;
  }
 }
}
function press(){
 if(!isHome()||!pressItems.length)return;
 const app=document.querySelector('#app');if(!app||!isHome()||app.querySelector('#hb-press-preview'))return;
 const section=document.createElement('section');section.id='hb-press-preview';section.setAttribute('aria-label','언론 속 하늘바람교회');
 section.style.cssText='background:#fff;border:1px solid #dce6ef;box-shadow:none;max-width:1180px';
 const head=document.createElement('div');head.className='hb-press-head';
 const title=document.createElement('h2');title.textContent='언론 속 하늘바람교회';
 const all=document.createElement('a');all.className='hb-press-all';all.href='#/news-press';all.textContent='전체보기 →';
 head.append(title,all);section.append(head);
 const list=document.createElement('div');list.style.cssText='border-top:2px solid #315a79';
 pressItems.forEach((item,i)=>{
  const details=document.createElement('details');details.style.cssText='border-bottom:1px solid #e0e9f1;background:#fff';details.dataset.pressIndex=String(i);details.hidden=i>=4;
  const header=document.createElement('summary');header.style.cssText='display:flex;align-items:center;gap:10px;padding:13px 4px;cursor:pointer;color:#284f6d';
  const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');number.style.cssText='color:#8094a5;font-size:12px;flex:0 0 24px';
  const copy=document.createElement('span');copy.style.cssText='display:flex;flex-direction:column;gap:4px;min-width:0;flex:1';
  const strong=document.createElement('strong');strong.textContent=item.title;strong.style.cssText='font-size:14px;line-height:1.5;word-break:keep-all';
  const meta=document.createElement('small');meta.textContent=item.source+' · '+(item.date?item.date.replaceAll('-','.'):'게시일 확인 중');meta.style.cssText='color:#7890a3;font-size:12px';
  copy.append(strong,meta);header.append(number);
  if(item.image){const thumb=document.createElement('img');thumb.src=item.image;thumb.alt=item.imageAlt||item.title||'보도자료 사진';thumb.loading='lazy';thumb.style.cssText='width:78px;height:58px;border-radius:8px;object-fit:cover;flex:0 0 auto';header.append(thumb)}
  header.append(copy);
  const body=document.createElement('div');body.style.cssText='padding:3px 16px 18px 36px;font-size:13px;line-height:1.7;color:#5a7488;background:#f8fbfe';
  if(item.image){const photo=document.createElement('img');photo.src=item.image;photo.alt=item.imageAlt||item.title||'보도자료 사진';photo.loading='lazy';photo.style.cssText='display:block;width:100%;max-width:640px;height:auto;object-fit:contain;border-radius:12px;margin:12px auto 18px';body.append(photo)}
  for(const paragraph of String(item.body||item.summary||'기사 내용을 준비 중입니다.').split(/\n\s*\n/)){
   const p=document.createElement('p');p.textContent=paragraph;p.style.cssText='margin:0 0 12px;white-space:pre-wrap';body.append(p);
  }
  if(/^https?:\/\//.test(item.url||'')){const original=document.createElement('a');original.href=item.url;original.target='_blank';original.rel='noopener noreferrer';original.textContent='기사 원문 보기 ↗';original.style.cssText='display:inline-block;margin-top:8px;color:#286e9e;font-weight:800;text-decoration:underline;text-underline-offset:3px';body.append(original);}
  details.append(header,body);list.append(details);
 });
 section.append(list);
 if(pressItems.length>4){
  const btn=document.createElement('button');
  btn.type='button';btn.className='hb-home-press-more';
  btn.style.cssText='display:block;margin:18px auto 0;padding:12px 24px;border:1px solid #b5ccdd;border-radius:10px;background:white;color:#275574;font-weight:800;cursor:pointer;min-height:44px';
  let visible=4;
  const render=()=>{
   list.querySelectorAll('details[data-press-index]').forEach(row=>{row.hidden=Number(row.dataset.pressIndex)>=visible});
   btn.textContent=visible>=pressItems.length?'접기 ▴':'보도자료 더보기 ('+(pressItems.length-visible)+'건) ▾';
  };
  btn.addEventListener('click',()=>{visible=visible>=pressItems.length?4:Math.min(pressItems.length,visible+4);render()});
  render();section.append(btn);
 }
 const headings=[...app.querySelectorAll('h2,h3,h4')];
 const schedule=headings.find(h=>/월간\s*교회일정|교회일정/.test(h.textContent||''));
 const bulletin=headings.find(h=>/이번\s*주\s*교회\s*주보/.test(h.textContent||''));
 const anchor=schedule||bulletin,holder=anchor&&(anchor.closest('section')||anchor.parentElement);
 if(holder&&holder.parentNode)holder.insertAdjacentElement(schedule?'afterend':'beforebegin',section);
 else app.append(section);
}
function apply(){
 const oldPreview=document.getElementById('hb-press-preview');
 if(!isHome()){
  if(oldPreview)oldPreview.remove();
  return;
 }
 dawn();
 press();
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{queue();refreshData()});else{queue();refreshData()}
window.addEventListener('hashchange',queue);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshData()});
new MutationObserver(queue).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});
})();