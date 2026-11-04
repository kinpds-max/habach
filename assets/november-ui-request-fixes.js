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
  if(group.querySelector('a[data-hb-church-press-menu],a[data-hb-church-press-menu]'))continue;
  const items=[...group.querySelectorAll('a[href]')].filter(a=>/^#\/?news-[1-9]\d*$/.test(a.getAttribute('href')||''));
  if(!items.length)continue;
  const last=items[items.length-1];
  let node=last;
  if(last.parentElement && last.parentElement!==group && last.parentElement.parentElement===group)node=last.parentElement;
  const clone=node.cloneNode(true);
  const a=clone.matches('a')?clone:clone.querySelector('a[href]');
  if(!a)continue;
  for(const el of [clone,...clone.querySelectorAll('[id]')])el.removeAttribute('id');
  a.href='#/news-press';
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


/* 언론 속 하늘바람교회: 원래 홈페이지 안의 커뮤니티 게시판 */
const hbPressRoute=()=>/^#\/?news-press(?:[?&]|$)/.test(location.hash);
let hbPressRows=[];
const hbPressCSS=document.createElement('style');
hbPressCSS.textContent='#hb-press-board{padding:5px 0 30px}#hb-press-board .hb-press-note{color:#71899e;font-size:13px;margin:0 0 18px}#hb-press-board .hb-press-records{border-top:2px solid #3b647f}#hb-press-board .hb-press-record{display:flex;gap:14px;align-items:center;padding:17px 8px;border-bottom:1px solid #dbe6ef;text-decoration:none;color:#2d526e;background:#fff}#hb-press-board .hb-press-record:hover{background:#f5f9fc}#hb-press-board .hb-press-no{font-size:12px;color:#8599a8;width:30px;text-align:center;flex-shrink:0}#hb-press-board .hb-press-content{flex:1;min-width:0}#hb-press-board .hb-press-name{font-weight:800;font-size:15px;line-height:1.55;word-break:keep-all}#hb-press-board .hb-press-byline{font-size:12px;color:#8194a3;margin-top:5px}#hb-press-board .hb-press-more{font-size:12px;color:#4380ac;white-space:nowrap}@media(max-width:520px){#hb-press-board .hb-press-more{display:none}#hb-press-board .hb-press-record{gap:7px;padding:14px 3px}}';
hbPressCSS.textContent+='#app .page-grid:has(#hb-press-board){display:grid;grid-template-columns:225px minmax(0,1fr);gap:45px;align-items:start;overflow:visible}#app .page-grid:has(#hb-press-board) .side{min-width:0;max-width:100%}#app .page-grid:has(#hb-press-board) .article{width:100%;min-width:0;max-width:100%;overflow:visible}#hb-press-board,#hb-press-board .hb-press-records,#hb-press-board .hb-press-expand{max-width:100%;min-width:0;box-sizing:border-box}#hb-press-board .hb-press-name{overflow-wrap:anywhere}#hb-press-board .hb-press-expand>div{padding-left:15px!important;padding-right:15px!important;overflow-wrap:anywhere}@media(max-width:900px){#app .page-grid:has(#hb-press-board){grid-template-columns:minmax(0,1fr);gap:22px}#app .page-grid:has(#hb-press-board) .side{width:100%;height:auto;min-height:48px;max-height:66px;overflow-x:auto;overflow-y:hidden;display:flex;flex-flow:row nowrap}#app .page-grid:has(#hb-press-board) .side>a{flex:0 0 auto}}';
document.head.append(hbPressCSS);
let hbPressSavedSide=null;
function hbPressRememberSidebar(){
 if(hbPressRoute())return;
 const nativeSide=document.querySelector('#app .page-grid .side');
 if(nativeSide&&nativeSide.querySelector('a[href]'))hbPressSavedSide=nativeSide.cloneNode(true);
}
function hbPressMakeSidebar(){
 const side=hbPressSavedSide?hbPressSavedSide.cloneNode(true):document.createElement('aside');
 side.classList.add('side');
 if(!side.querySelector('a[href]')){
  const heading=document.createElement('h3');heading.textContent='커뮤니티';side.append(heading);
  const labels=[['news-1','교회소식'],['news-2','주보'],['news-3','교회행사'],['news-4','교우소식'],['news-5','새가족 안내'],['news-6','교인사업장'],['news-7','자주 묻는 질문'],['news-10','교회일정']];
  const menuLinks=[...document.querySelectorAll('nav a[href],header a[href],[class*="dropdown"] a[href]')].filter(a=>/^#\/?news-\d+$/.test(a.getAttribute('href')||''));
  const found=new Map();
  for(const a of menuLinks){const href=a.getAttribute('href');if(!found.has(href))found.set(href,(a.textContent||'').trim())}
  for(const [route,label] of labels){
   const a=document.createElement('a');a.href='#/'+route;a.textContent=found.get('#/'+route)||label;side.append(a);
  }
 }
 side.querySelectorAll('a[data-hb-church-press-menu],a[href="#/news-press"]').forEach(a=>a.remove());
 const press=document.createElement('a');press.href='#/news-press';press.textContent='언론 속 하늘바람교회';press.className='on';press.setAttribute('aria-current','page');
 side.append(press);
 for(const a of side.querySelectorAll('a[href]')){
  if(a!==press){a.classList.remove('on');a.removeAttribute('aria-current')}
 }
 return side;
}
function hbPressShow(){
 const app=document.getElementById('app');if(!app)return;
 if(!hbPressRoute()){
  // The full two-column press view belongs exclusively to the community route.
  const owned=app.querySelector('[data-hb-press-page="1"]');
  if(owned)owned.remove();
  return;
 }
 // Never show the homepage preview inside the full community press page.
 app.querySelector('#hb-press-preview')?.remove();
 let layout=app.querySelector('.page-grid');
 if(!layout||!layout.querySelector('.side')){
  layout=document.createElement('div');layout.className='page-grid container';
  layout.dataset.hbPressPage='1';
  // The app's native route handler will render other pages again when navigated.
  app.replaceChildren(layout);
 }
 layout.classList.add('container');
 layout.style.maxWidth='1110px';
 layout.style.width='100%';
 layout.style.boxSizing='border-box';
 layout.style.marginLeft='auto';
 layout.style.marginRight='auto';
 let side=layout.querySelector('.side');
 if(!side){
  side=hbPressMakeSidebar();
  layout.prepend(side);
 }else if(!side.querySelector('a[href="#/news-press"]')){
  side.append(hbPressMakeSidebar().querySelector('a[href="#/news-press"]'));
 }
 // Only this route marks the press menu as active; other pages keep their own sidebar.
 const active=side.querySelector('a[href="#/news-press"]');
 if(active){side.querySelectorAll('a').forEach(a=>{a.classList.toggle('on',a===active);if(a===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
 let article=layout.querySelector('article.article');
 if(!article){article=document.createElement('article');article.className='article';layout.append(article)}
 article.style.minWidth='0';article.style.maxWidth='100%';article.style.overflowWrap='anywhere';
 if(article.querySelector('#hb-press-board'))return;
 article.replaceChildren();
 const title=document.createElement('h1');title.className='article-title';title.textContent='언론 속 하늘바람교회';
 const box=document.createElement('section');box.id='hb-press-board';
 const note=document.createElement('p');note.className='hb-press-note';note.textContent='하늘바람교회의 지역사회 섬김과 활동을 다룬 언론보도입니다.';
 const records=document.createElement('div');records.className='hb-press-records';box.append(note,records);article.append(title,box);
 hbPressRows.forEach((post,i)=>{
  const item=document.createElement('details');item.className='hb-press-expand';item.style.cssText='border-bottom:1px solid #dbe6ef;background:#fff';
  const summary=document.createElement('summary');summary.className='hb-press-record';
  summary.style.cssText='cursor:pointer;list-style:none';
  const n=document.createElement('span');n.className='hb-press-no';n.textContent=String(hbPressRows.length-i);
  const body=document.createElement('div');body.className='hb-press-content';
  const heading=document.createElement('div');heading.className='hb-press-name';heading.textContent=post.title||'언론보도';
  const meta=document.createElement('div');meta.className='hb-press-byline';meta.textContent=(post.source||'언론사')+' · '+(post.date?post.date.replaceAll('-','.'):'게시일 확인 중');
  const more=document.createElement('span');more.className='hb-press-more';more.textContent='펼치기 ▾';
  body.append(heading,meta);summary.append(n,body,more);
  const details=document.createElement('div');details.style.cssText='padding:2px 16px 20px 52px;background:#f8fbfe;color:#567188;font-size:14px;line-height:1.75';
  for(const paragraph of String(post.body||post.summary||'기사 본문을 준비 중입니다.').split(/\n\s*\n/)){
   const p=document.createElement('p');p.textContent=paragraph;p.style.cssText='margin:0 0 12px;white-space:pre-wrap';details.append(p);
  }
  if(/^https?:\/\//.test(post.url||'')){const original=document.createElement('a');original.href=post.url;original.target='_blank';original.rel='noopener noreferrer';original.textContent='기사 원문 보기 ↗';original.style.cssText='display:inline-block;margin-top:8px;padding:7px 0;color:#286e9e;font-weight:800;text-decoration:underline;text-underline-offset:3px';details.append(original);}
  item.append(summary,details);records.append(item);
  item.addEventListener('toggle',()=>{more.textContent=item.open?'접기 ▴':'펼치기 ▾'});
 });
}
let hbPressPending=false;function hbPressSchedule(){if(hbPressPending)return;hbPressPending=true;requestAnimationFrame(()=>{hbPressPending=false;hbPressShow()})}
fetch('/assets/church-press.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(data=>{hbPressRows=(Array.isArray(data)?data:[]).sort((a,b)=>(b.date||'').localeCompare(a.date||''));if(hbPressRoute()){document.querySelector('#hb-press-board')?.remove();hbPressSchedule()}}).catch(()=>{});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{hbPressRememberSidebar();hbPressSchedule()});else{hbPressRememberSidebar();hbPressSchedule()}
window.addEventListener('hashchange',()=>{hbPressRememberSidebar();hbPressSchedule()});
new MutationObserver(()=>{hbPressRememberSidebar();hbPressSchedule()}).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});

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