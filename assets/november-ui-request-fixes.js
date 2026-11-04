(()=>{'use strict';
const path=()=>location.hash.replace(/^#\/?/,'').split(/[?&]/)[0];

/* 커뮤니티 메뉴 마지막: 언론 속 하늘바람교회 (PC/모바일 공통) */
function addChurchPressMenu(){
 const links=[...document.querySelectorAll('a[href]')].filter(a=>
  /^#\/?news-[1-9]\d*$/.test(a.getAttribute('href')||'') &&
  a.closest('nav,header,aside,[class*="nav"],[class*="menu"],[class*="sidebar"],[class*="dropdown"]') &&
  !a.closest('#app article.article')
 );
 const groups=new Set();
 for(const link of links){
  let parent=link.parentElement;
  for(let depth=0;parent&&depth<5;depth++,parent=parent.parentElement){
   const articleLinks=[...parent.querySelectorAll('a[href]')].filter(a=>/^#\/?news-[1-9]\d*$/.test(a.getAttribute('href')||''));
   if(articleLinks.length<2)continue;
   if(parent.querySelectorAll('a[href]').length>20)break;
   groups.add(parent);break;
  }
 }
 for(const group of groups){
  if(group.querySelector('a[data-hb-church-press-menu],a[href="/press.html"]'))continue;
  const items=[...group.querySelectorAll('a[href]')].filter(a=>/^#\/?news-[1-9]\d*$/.test(a.getAttribute('href')||''));
  if(!items.length)continue;
  const last=items[items.length-1];
  let node=last;
  if(last.parentElement && last.parentElement!==group && last.parentElement.parentElement===group)node=last.parentElement;
  const clone=node.cloneNode(true);
  const a=clone.matches('a')?clone:clone.querySelector('a[href]');
  if(!a)continue;
  for(const el of [clone,...clone.querySelectorAll('[id]')])el.removeAttribute('id');
  a.href='/press.html';
  a.textContent='언론 속 하늘바람교회';
  a.dataset.hbChurchPressMenu='1';
  if(node.parentElement)node.insertAdjacentElement('afterend',clone);
 }
}
let hbPressMenuQueued=false;
function queueChurchPressMenu(){
 if(hbPressMenuQueued)return;hbPressMenuQueued=true;
 requestAnimationFrame(()=>{hbPressMenuQueued=false;addChurchPressMenu()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queueChurchPressMenu);
else queueChurchPressMenu();
window.addEventListener('hashchange',queueChurchPressMenu);
new MutationObserver(queueChurchPressMenu).observe(document.documentElement,{childList:true,subtree:true});

const style=document.createElement('style');style.id='hb-community-fixes-v3';style.textContent=`
#app .hb-business-card h4,#app .hb-business-line{font-weight:750!important}
#app .hb-business-line{font-size:15px!important;line-height:1.85!important}
#app .hb-bulletin-admin-link{display:inline-flex;align-items:center;justify-content:center;background:#e8f3fd;color:#245477;font-weight:800;text-decoration:none;padding:10px 15px;border-radius:12px;white-space:nowrap;font-size:clamp(12px,2.5vw,15px)}
#app .hb-news-bulletin-heading{display:flex!important;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
#app .hb-news-bulletin-heading h2{margin:0}
#app .hb-prayer-full-videos{display:block;width:max-content;max-width:100%;padding:12px 17px;background:#e8f3fd;color:#245477;border-radius:10px;text-decoration:none;font-weight:800;margin:22px 0}
#app .hb-verified-schedule-link{display:block;border:1px solid #d9e6f1;background:#f7fbff;padding:15px;border-radius:12px;margin-top:18px}

/* Only on the three community pages: remove the extra divider beneath the title. */
#app .hb-community-clean .article-title{border-bottom:0!important;margin-bottom:12px!important;padding-bottom:10px!important}
#app .hb-community-clean .hb-legacy-bulletin-preview{display:none!important}
#app .hb-community-clean .hb-bulletin-admin-link{display:none!important}
#app .hb-community-clean .hb-board-title-row{display:flex!important;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
#app .hb-community-clean .hb-board-title-row>a{font-size:13px;font-weight:750;padding:9px 12px;border-radius:9px;background:#e9f3fb;color:#245477;text-decoration:none;white-space:nowrap}
`;document.head.append(style);
function apply(){
 const key=path(),article=document.querySelector('#app .page-grid article.article');
 if(!article)return;
 if(['news-1','news-2','news-6'].includes(key))article.classList.add('hb-community-clean');
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
  article.querySelectorAll('#hb-community-single-bulletin-viewer').forEach(el=>el.remove());
  // The uploaded bulletin board below remains untouched.

  // Remove all legacy preview content between page title and real bulletin board.
  const boardHeading=[...article.querySelectorAll('h1,h2,h3,h4,h5')].find(e=>/주보\s*게시판/.test(e.textContent||''));
  const pageTitle=article.querySelector('.article-title');
  if(boardHeading&&pageTitle){
    let node=pageTitle.nextElementSibling;
    let limit=0;
    while(node&&node!==boardHeading&&!node.contains(boardHeading)&&limit++<20){
      const next=node.nextElementSibling;
      // Do not erase the actual shared bulletin board or its uploaded images.
      if(!node.querySelector('.hb-board-title-row,.board-table,.board-results,#hb-community-single-bulletin-viewer')){
        node.style.setProperty('display','none','important');
      }
      node=next;
    }
  }
  // The old slideshow may be injected into a wrapper; identify by its broken image plus caption.
  for(const label of [...article.querySelectorAll('h2,h3,h4,span,p')]){
    if(label.children.length||label.textContent.trim()!=='교회 주보')continue;
    const holder=label.closest('.hb-book-section,.hb-book-gallery,.hb-book-preview,.hb-bulletin-legacy,.hb-book-viewer')||label.parentElement;
    if(holder&&holder!==article&&!holder.contains(boardHeading))holder.style.setProperty('display','none','important');
  }

  // Remove the legacy standalone bulletin slideshow above the actual bulletin board.
  // Keep the Supabase-backed board and its uploaded images intact.
  const heading=[...article.querySelectorAll('h2,h3,h4')].find(h=>(h.textContent||'').replace(/\s+/g,'').includes('주보게시판'));
  if(heading){
    let node=article.querySelector('.article-title')?.nextElementSibling;
    const boundary=heading.closest('section')||heading.parentElement;
    while(node&&node!==boundary&&!node.contains(heading)){
      const next=node.nextElementSibling;
      if(node.matches('.hb-book-section,.hb-book-gallery,.hb-book-reader,.hb-book-preview,[id*="bulletin-legacy"],[class*="book-section"]') ||
        (node.querySelector('button')&&/교회\s*주보/.test(node.textContent||'')&&/이전|다음/.test(node.textContent||''))){
        node.style.setProperty('display','none','important');
      }
      node=next;
    }
    for(const el of [...article.querySelectorAll('div,section')]){
      if(el.contains(heading)||el.closest('.hb-board-title-row'))continue;
      const tx=(el.textContent||'').replace(/\s+/g,'');
      if(tx.length<100&&tx.includes('교회주보')&&tx.includes('이전')&&tx.includes('다음')&&el.querySelector('button')){
        el.style.setProperty('display','none','important');
      }
    }
  }

  // Native board data stays intact. Remove the broken old book viewer and duplicate upload pills.
  article.querySelectorAll('.hb-book-reader,.hb-book-controls,.hb-book-section,.hb-book-gallery,.hb-book-preview').forEach(el=>{
    el.classList.add('hb-legacy-bulletin-preview');el.style.setProperty('display','none','important');
  });
  for(const img of article.querySelectorAll('img')){
    if(!img.complete||img.naturalWidth===0){
      const wrapper=img.closest('.hb-book-page,.hb-book-reader,.hb-book-section,.hb-book-gallery');
      if(wrapper)wrapper.style.setProperty('display','none','important');
    }
  }
  const headings=[...article.querySelectorAll('h2,h3,h4')];
  const boardTitle=headings.find(h=>/주보\\s*게시판/.test(h.textContent||''));
  if(boardTitle){
    let row=boardTitle.closest('.hb-board-title-row');
    if(!row){row=document.createElement('div');row.className='hb-board-title-row';boardTitle.parentNode.insertBefore(row,boardTitle);row.append(boardTitle)}
    let upload=row.querySelector('a[href="/admin/bulletin.html"]');
    if(!upload){upload=document.createElement('a');upload.href='/admin/bulletin.html';upload.textContent='업로드';row.append(upload)}
  }
  // Hide other upload controls, keeping exactly the one beside the board heading.
  for(const el of article.querySelectorAll('a,button')){
    const label=(el.textContent||'').replace(/\\s+/g,'');
    if(!/^(이번주교회주보업로드|교회주보업로드|업로드)$/.test(label))continue;
    if(el.closest('.hb-board-title-row'))continue;
    el.style.setProperty('display','none','important');
  }
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