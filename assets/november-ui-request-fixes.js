(()=>{'use strict';
const path=()=>location.hash.replace(/^#\/?/,'').split(/[?&]/)[0];
const style=document.createElement('style');style.id='hb-community-fixes-v3';style.textContent=`
#app .hb-business-card h4,#app .hb-business-line{font-weight:750!important}
#app .hb-business-line{font-size:15px!important;line-height:1.85!important}
#app .hb-bulletin-admin-link{display:inline-flex;align-items:center;justify-content:center;background:#e8f3fd;color:#245477;font-weight:800;text-decoration:none;padding:10px 15px;border-radius:12px;white-space:nowrap;font-size:clamp(12px,2.5vw,15px)}
#app .hb-news-bulletin-heading{display:flex!important;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
#app .hb-news-bulletin-heading h2{margin:0}
#app .hb-prayer-full-videos{display:block;width:max-content;max-width:100%;padding:12px 17px;background:#e8f3fd;color:#245477;border-radius:10px;text-decoration:none;font-weight:800;margin:22px 0}
#app .hb-verified-schedule-link{display:block;border:1px solid #d9e6f1;background:#f7fbff;padding:15px;border-radius:12px;margin-top:18px}
`;document.head.append(style);
function apply(){
 const key=path(),article=document.querySelector('#app .page-grid article.article');
 if(!article)return;
 if(key==='news-1'||key==='news-6'){
  // Remove only the redundant separator directly below the page heading.
  const title=article.querySelector('.article-title');if(title){
   for(let el=title.nextElementSibling,count=0;el&&count<3;el=el.nextElementSibling,count++)if(el.tagName==='HR'||el.classList.contains('boardhead'))el.style.setProperty('display','none','important');
  }
  if(key==='news-6'){
   for(const titleEl of article.querySelectorAll('.hb-business-card h4,.hb-business-line')){
    if(titleEl.textContent.includes('하스놀')&&titleEl.children.length===0){
      const newText=titleEl.textContent.replace(/(?:\\(주\\)\\s*하스놀|하스놀\\s*\\(주\\))/g,'하스놀(주)');
      if(titleEl.textContent!==newText)titleEl.textContent=newText;
    }
    titleEl.style.setProperty('font-weight','750','important');
   }
  }
 }
 if(key==='news-2'){
  const title=article.querySelector('.article-title');
  if(title){
   title.classList.add('hb-news-bulletin-heading');
   let link=title.querySelector('.hb-bulletin-admin-link');
   if(!link){link=document.createElement('a');link.className='hb-bulletin-admin-link';link.href='/admin/bulletin.html';link.textContent='교회주보 업로드';title.append(link)}
  }
  // Old "book" image carousel should never cover the shared bulletin board.
  article.querySelectorAll('.hb-book-reader,.hb-book-controls').forEach(el=>el.style.setProperty('display','none','important'));
 }
 if(key==='next-1'){
   article.querySelectorAll('.hb-education-schedule').forEach(el=>{
    if(!el.textContent.includes('주짓수'))return;
    const textNodes=[...el.childNodes];const text=textNodes.find(n=>n.nodeType===3&&n.textContent.includes('주짓수'));
    if(text)text.textContent=text.textContent.replace(/주짓수/g,'');
    const strong=[...el.querySelectorAll('strong')].find(n=>n.textContent.trim()==='활동');
    if(strong){const prev=strong.previousSibling;const next=strong.nextSibling;if(prev?.nodeType===1&&prev.tagName==='BR')prev.remove();strong.remove();if(next?.nodeType===3&&!next.textContent.trim())next.remove()}
   });
 }
 if(key==='ministry-2'){
  const section=article.querySelector('.hb-prayer-section')||article;
  let button=section.querySelector('#hb-prayer-video-all');
  if(!button){button=document.createElement('button');button.type='button';button.id='hb-prayer-video-all';button.className='hb-prayer-full-videos';button.textContent='기도집회 영상 전체 보기 ▾';button.style.cursor='pointer';section.append(button)}
  if(button.tagName==='A'){const replacement=document.createElement('button');replacement.id=button.id;replacement.className=button.className;replacement.type='button';replacement.textContent='기도집회 영상 전체 보기 ▾';replacement.style.cursor='pointer';button.replaceWith(replacement);button=replacement}
  if(!button.dataset.previewBound){
   button.dataset.previewBound='1';
   button.setAttribute('aria-expanded','false');
   button.onclick=()=>{
    let preview=section.querySelector('#hb-prayer-video-preview');
    if(!preview){
     preview=document.createElement('div');preview.id='hb-prayer-video-preview';
     preview.style.cssText='width:100%;margin:12px 0 28px';
     const frame=document.createElement('iframe');
     frame.title='하늘바람교회 기도집회 영상 미리보기';
     frame.src='https://www.youtube-nocookie.com/embed/videoseries?list=PLmD7ZicLdWIpmQHw1_1mLb8xYyxcvfSgp';
     frame.loading='lazy';frame.allow='accelerometer;autoplay;encrypted-media;picture-in-picture;fullscreen';frame.allowFullscreen=true;
     frame.style.cssText='width:100%;aspect-ratio:16/9;border:0;border-radius:14px;display:block;background:#132d42';
     const link=document.createElement('a');link.href='#/sermon-9';link.textContent='기도집회 영상 앨범 전체 보기 →';
     link.style.cssText='display:inline-block;margin:12px 0;font-weight:700;color:#285b7d';
     preview.append(frame,link);button.insertAdjacentElement('afterend',preview);
    }else{preview.hidden=!preview.hidden}
    button.setAttribute('aria-expanded',String(!preview.hidden));
    button.textContent=preview.hidden?'기도집회 영상 전체 보기 ▾':'기도집회 영상 미리보기 닫기 ▴';
   };
  }
 }
 if(key==='news-10'){
  if(!article.querySelector('.hb-verified-schedule-link')){
   const section=document.createElement('div');section.className='hb-verified-schedule-link';
   const a=document.createElement('a');a.href='#/news-2';a.textContent='이번 주 주보에서 교회 일정 확인하기 →';section.append(a);
   (article.querySelector('#hbSharedBoardCalendar')||article.querySelector('.article-title')||article).insertAdjacentElement('afterend',section);
  }
 }
}
let q=false;function run(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();window.addEventListener('hashchange',run);
new MutationObserver(run).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:false});
})();