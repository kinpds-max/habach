(()=>{'use strict';
const path=()=>location.hash.replace(/^#\/?/,'').split(/[?&]/)[0];

/* 커뮤니티 메뉴 마지막: 언론 속 하늘바람교회 (PC/모바일 공통) */
function hbDeduplicatePressLinks(root){
 const links=[...root.querySelectorAll('a[href]')].filter(a=>
  a.getAttribute('href')==='#/news-press'||a.dataset.hbChurchPressMenu==='1'||(a.textContent||'').trim()==='언론 속 하늘바람교회'
 );
 if(!links.length)return;
 const keep=links[0];keep.href='#/news-press';keep.dataset.hbChurchPressMenu='1';
 for(const duplicate of links.slice(1))duplicate.remove();
}
function addChurchPressMenu(){
 const pressHref='#/news-press';
 // Remove unintended copies inserted into home schedule cards by the
 // old whole-document ancestor search. Keep the actual press preview.
 for(const link of document.querySelectorAll('#app a[href="#/news-press"],#app a[data-hb-church-press-menu]')){
  if(link.closest('#app .side,#hb-press-preview'))continue;
  if((link.textContent||'').trim()==='언론 속 하늘바람교회'||link.dataset.hbChurchPressMenu==='1'){
   const wrapper=link.closest('#hb-missionbridge-calendar-2026');
   if(wrapper)wrapper.remove();else link.remove();
  }
 }
 const menus=[];
 for(const group of document.querySelectorAll('.desktopnav .nav-group,.nav-group')){
  const parent=[...group.children].find(el=>el.tagName==='A');
  if(parent?.textContent.trim()==='커뮤니티'){
   const menu=group.querySelector('.drop');if(menu)menus.push(menu);
  }
 }
 for(const group of document.querySelectorAll('#siteMobileNav > details')){
  if(group.querySelector(':scope > summary')?.textContent.trim()==='커뮤니티')menus.push(group);
 }
 for(const side of document.querySelectorAll('#app .side')){
  const parent=side.querySelector('.hb-mobile-section-grid')||side;
  if(parent.querySelectorAll('a[href^="#/news-"]').length>=5)menus.push(parent);
 }
 for(const menu of new Set(menus)){
  hbDeduplicatePressLinks(menu);
  const existing=[...menu.querySelectorAll('a[href]')].find(a=>a.getAttribute('href')===pressHref);
  if(existing)continue;
  const links=[...menu.querySelectorAll('a[href]')].filter(a=>/^#\/news-\d+$/.test(a.getAttribute('href')||''));
  const last=links[links.length-1];if(!last)continue;
  const clone=last.cloneNode(true);clone.href=pressHref;clone.dataset.hbChurchPressMenu='1';
  clone.textContent='언론 속 하늘바람교회';clone.classList.remove('on','active');
  clone.removeAttribute('aria-current');clone.removeAttribute('id');
  last.insertAdjacentElement('afterend',clone);
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
hbPressCSS.textContent+='#app .page-grid:has(#hb-press-board) .article{min-width:0;max-width:100%;overflow-wrap:anywhere}#hb-press-board,#hb-press-board .hb-press-records,#hb-press-board .hb-press-expand{max-width:100%;min-width:0;box-sizing:border-box}#hb-press-board .hb-press-name{overflow-wrap:anywhere}#hb-press-board .hb-press-expand>div{padding-left:clamp(12px,2.5vw,24px)!important;padding-right:clamp(12px,2.5vw,24px)!important;overflow-wrap:anywhere}#hb-press-board .hb-press-no{display:none}@media(max-width:900px){#app .page-grid:has(#hb-press-board){display:flex!important;flex-direction:column!important;gap:20px!important}#app .page-grid:has(#hb-press-board) .side.hb-mobile-grid-ready{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}#app .page-grid:has(#hb-press-board) .hb-mobile-section-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}#hb-press-board .hb-press-record{gap:10px!important;padding:14px 2px!important}#hb-press-board .hb-press-record>img{width:95px!important;height:76px!important}#hb-press-board .article-title{margin-top:8px}}';
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
  // Reuse the site's native community view instead of replacing the entire app.
  // The native view includes the hero, breadcrumb and mobile three-column tabs.
  if(typeof render==='function' && typeof views!=='undefined' && views['news-press']){
   render();
   layout=app.querySelector('.page-grid');
  }
  if(!layout||!layout.querySelector('.side'))return;
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
 hbDeduplicatePressLinks(side);
 const active=side.querySelector('a[href="#/news-press"]');
 if(active){side.querySelectorAll('a').forEach(a=>{a.classList.toggle('on',a===active);if(a===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
 let article=layout.querySelector('article.article');
 if(!article){article=document.createElement('article');article.className='article';layout.append(article)}
 article.style.minWidth='0';article.style.maxWidth='100%';article.style.overflowWrap='anywhere';
 if(article.querySelector('#hb-press-board'))return;
 article.replaceChildren();
 const crumbs=document.createElement('div');crumbs.className='breadcrumbs';
 crumbs.textContent='HOME / 커뮤니티 / 언론 속 하늘바람교회';
 const title=document.createElement('div');title.className='article-title';
 const small=document.createElement('small');small.textContent='HANEUL BARAM CHURCH';
 const h2=document.createElement('h2');h2.textContent='언론 속 하늘바람교회';
 title.append(small,h2);
 article.append(crumbs);
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
  if(post.image){const thumb=document.createElement('img');thumb.src=post.image;thumb.alt=post.imageAlt||post.title||'보도자료 사진';thumb.loading='lazy';thumb.style.cssText='width:92px;height:66px;object-fit:cover;border-radius:8px;flex:0 0 auto';summary.append(n,thumb,body,more)}else{summary.append(n,body,more)}
  body.append(heading,meta);
  const details=document.createElement('div');details.style.cssText='padding:2px 16px 20px 52px;background:#f8fbfe;color:#567188;font-size:14px;line-height:1.75';
  if(post.galleryTitle){const heading=document.createElement('h3');heading.textContent=post.galleryTitle;heading.style.cssText='margin:18px 0 14px;color:#244d69;font-size:clamp(16px,2.6vw,20px);font-weight:800';details.append(heading)}
  {const gallery=Array.isArray(post.images)&&post.images.length?post.images:(post.image?[post.image]:[]);gallery.forEach((src,i)=>{const fig=document.createElement('figure');fig.style.cssText='margin:12px auto 20px;max-width:680px';const img=document.createElement('img');img.src=src;img.alt=i===0?(post.imageAlt||post.title||'보도자료 사진'):(post.title||'보도자료 사진')+' 사진 '+(i+1);img.loading='lazy';img.style.cssText='display:block;width:100%;height:auto;object-fit:contain;border-radius:12px';fig.append(img);const text=Array.isArray(post.imageCaptions)?post.imageCaptions[i]:'';if(text){const cap=document.createElement('figcaption');cap.textContent=text;cap.style.cssText='margin:6px 0 0;text-align:center;color:#7890a3;font-size:12px';fig.append(cap)}details.append(fig)})}
  for(const paragraph of String(post.body||post.summary||'기사 본문을 준비 중입니다.').split(/\n\s*\n/)){
   const p=document.createElement('p');p.textContent=paragraph;p.style.cssText='margin:0 0 12px;white-space:pre-wrap';details.append(p);
  }
  if(/^https?:\/\//.test(post.url||'')){const original=document.createElement('a');original.href=post.url;original.target='_blank';original.rel='noopener noreferrer';original.textContent='기사 원문 보기 ↗';original.style.cssText='display:inline-block;margin-top:8px;padding:7px 0;color:#286e9e;font-weight:800;text-decoration:underline;text-underline-offset:3px';details.append(original);}
  item.append(summary,details);records.append(item);
  item.addEventListener('toggle',()=>{more.textContent=item.open?'접기 ▴':'펼치기 ▾'});
 });
}
let hbPressPending=false;function hbPressSchedule(){if(hbPressPending)return;hbPressPending=true;requestAnimationFrame(()=>{hbPressPending=false;hbPressShow()})}
fetch('/assets/church-press.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(data=>{hbPressRows=(Array.isArray(data)?data:[]).sort((a,b)=>(a.displayOrder??999)-(b.displayOrder??999));if(hbPressRoute()){document.querySelector('#hb-press-board')?.remove();hbPressSchedule()}}).catch(()=>{});
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

/* Home: latest official Naver blog posts, synced by GitHub Actions. */
function hbHomeBlogPreview(){
 const root=document.getElementById('app');if(!root||document.getElementById('hb-home-naver-blog'))return;
 const section=document.createElement('section');section.id='hb-home-naver-blog';
 section.style.cssText='max-width:1160px;margin:32px auto;padding:24px 18px;background:transparent;border-radius:0';
 section.innerHTML='<div class="hb-blog-heading" style="text-align:center;margin-bottom:22px"><h2 style="margin:0;color:#314e66;font-size:24px;font-weight:800;line-height:1.3">하늘바람교회 블로그 최신글</h2><p style="margin:12px 0 0;color:#8295a4;font-size:15px;line-height:1.6">하늘바람교회의 새로운 소식을 만나보세요.</p></div><div class="hb-blog-cards" style="display:grid;grid-template-columns:minmax(0,1fr);gap:14px;max-width:600px;margin:0 auto"><p style="text-align:center">최신 블로그 글을 불러오는 중입니다.</p></div>';
 const videoHeading=[...root.querySelectorAll('h1,h2,h3')].find(el=>(el.textContent||'').trim()==='하늘바람교회 영상');
 if(videoHeading){const videoSection=videoHeading.closest('.home-video-six');if(videoSection)videoSection.classList.add('hb-home-video-aligned');}
 if(!document.getElementById('hb-home-blog-layout-20261124')){const css=document.createElement('style');css.id='hb-home-blog-layout-20261124';css.textContent=`
 #app #hb-home-naver-blog,#app .hb-home-video-aligned{width:100%!important;max-width:1160px!important;box-sizing:border-box!important;margin-left:auto!important;margin-right:auto!important}
 #app #hb-home-naver-blog .hb-blog-heading h2,#app .hb-home-video-aligned .home-video-six-header h2{font-size:24px!important;font-weight:800!important;line-height:1.3!important;color:#314e66!important;letter-spacing:-.025em!important;margin:0!important}
 #app #hb-home-naver-blog .hb-blog-heading p,#app .hb-home-video-aligned .home-video-six-header p{font-size:15px!important;color:#8295a4!important;line-height:1.6!important;margin:12px 0 0!important}
 @media(min-width:701px){#app #hb-home-naver-blog .hb-blog-cards{max-width:none!important;width:100%!important}#app #hb-home-naver-blog .hb-blog-cards>a{display:grid!important;grid-template-columns:minmax(0,42%) minmax(0,1fr);grid-template-rows:auto auto;column-gap:26px;align-content:center;align-items:center;padding:18px!important}#app #hb-home-naver-blog .hb-blog-cards>a>img{grid-row:1 / 3;margin:0!important;align-self:center}#app #hb-home-naver-blog .hb-blog-cards>a>h3,#app #hb-home-naver-blog .hb-blog-cards>a>p{text-align:left!important;grid-column:2}#app #hb-home-naver-blog .hb-blog-cards>a>h3{font-size:20px!important;align-self:end}#app #hb-home-naver-blog .hb-blog-cards>a>p{align-self:start;-webkit-line-clamp:4!important}}
 @media(max-width:700px){#app #hb-home-naver-blog{padding-left:4px!important;padding-right:4px!important}#app #hb-home-naver-blog .hb-blog-cards>a{padding:10px!important}#app #hb-home-naver-blog .hb-blog-cards>a>h3{font-size:16px!important;word-break:keep-all;overflow-wrap:break-word}#app #hb-home-naver-blog .hb-blog-heading h2,#app .hb-home-video-aligned .home-video-six-header h2{font-size:21px!important}#app #hb-home-naver-blog .hb-blog-heading p,#app .hb-home-video-aligned .home-video-six-header p{font-size:13px!important}}
 `;document.head.append(css);}

 const target=root.querySelector('.home-video-six-grid')?.closest('section')||root.querySelector('footer,.footer,#footer');if(target)target.parentNode.insertBefore(section,target);else root.prepend(section);
 fetch('/assets/habach-naver-blog.json',{cache:'no-store'}).then(res=>{if(!res.ok)throw Error('blog feed unavailable');return res.json()}).then(data=>{
  if(!section.isConnected)return;
  const cards=section.querySelector('.hb-blog-cards');cards.replaceChildren();
  const posts=(data.posts||[]).filter(post=>/^https:\/\/blog\.naver\.com\//.test(post.url||''));
  posts.sort((a,b)=>Date.parse(b.date||0)-Date.parse(a.date||0));
  for(const post of posts.slice(0,1)){
   const a=document.createElement('a');a.href=post.url;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;text-decoration:none;color:#203e4d;background:white;border:1px solid #e0e9ee;border-radius:14px;padding:16px';
   if(typeof post.image==='string'&&/^https:\/\//.test(post.image)){
    const image=document.createElement('img');image.src=post.image;image.loading='lazy';image.referrerPolicy='no-referrer';image.alt=post.title||'블로그 대표 이미지';
    image.style.cssText='display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;margin-bottom:12px';image.onerror=()=>image.remove();a.append(image);
   }
   const h=document.createElement('h3');const title=post.title||'교회 블로그 글';const parts=title.split(/(전승학\s*목사)/g);for(let i=0;i<parts.length;i++){if(i%2){const name=document.createElement('span');name.style.whiteSpace='nowrap';name.textContent=parts[i];h.append(name)}else h.append(document.createTextNode(parts[i]));}h.style.cssText='font-size:17px;line-height:1.5;margin:0 0 10px;text-align:center';
   const p=document.createElement('p');p.textContent=post.excerpt||'네이버 블로그에서 글 읽기';p.style.cssText='font-size:14px;line-height:1.65;color:#667983;margin:0;text-align:center;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden';
   a.append(h,p);cards.append(a);
  }
  if(!cards.children.length)throw Error('no posts');
 }).catch(()=>{const cards=section.querySelector('.hb-blog-cards');if(cards)cards.innerHTML='<p style="text-align:center">최신 글을 불러오지 못했습니다. <a href="https://blog.naver.com/habachurch" target="_blank" rel="noopener noreferrer">블로그 더보기 →</a></p>'});
}
/* Naver cafe menu 2 preview directly below the home blog card. */
function hbHomeCafePreview(){
 const blog=document.getElementById('hb-home-naver-blog');
 if(!blog||document.getElementById('hb-home-cafe-preview'))return;
 const url='https://m.cafe.naver.com/ca-fe/web/cafes/31371644/menus/2';
 const section=document.createElement('section');section.id='hb-home-cafe-preview';
 section.style.cssText='box-sizing:border-box;width:100%;max-width:1160px;margin:0 auto 36px;padding:16px 18px 24px;text-align:center';
 const h=document.createElement('h2');h.textContent='하늘바람교회 카페 포토갤러리';h.style.cssText='margin:0 0 10px;color:#314e66;font-size:24px;font-weight:800;line-height:1.3;letter-spacing:-.025em';
 const p=document.createElement('p');p.textContent='교회 사진과 현장 소식을 네이버 카페에서 만나보세요.';p.style.cssText='margin:12px 0 0;color:#8295a4;font-size:15px;line-height:1.6;text-align:center';
 const preview=document.createElement('a');preview.href=url;preview.target='_blank';preview.rel='noopener noreferrer';preview.setAttribute('aria-label','하늘바람교회 카페 포토갤러리 열기');
 preview.style.cssText='box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;max-width:600px;margin:0 auto;padding:30px 24px;min-height:180px;background:#f7fbfd;border:1px solid #dce7ee;border-radius:14px;text-decoration:none;color:#245477';
 // A responsive preview matching the supplied cafe join screen, without blocked iframe content.
 preview.style.cssText='box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;max-width:600px;margin:0 auto;padding:34px 22px 24px;min-height:370px;background:#fff;border:1px solid #e8ecef;border-radius:14px;text-decoration:none;color:#171717';
 const hint=document.createElement('span');hint.textContent='카페에 가입하면 바로 글을 볼 수 있어요!';hint.style.cssText='font-size:15px;color:#989898;margin:0 0 20px';
 const count=document.createElement('strong');count.style.cssText='font-size:clamp(22px,5vw,30px);line-height:1.5;letter-spacing:-.04em';count.innerHTML='하늘바람교회 멤버와 함께하는<br><span style="color:#009ee7">김포하늘바람교회</span>에<br>가입해 보세요.';
 const mission=document.createElement('span');mission.textContent='12 교회를 세우고, 300명의 선교사를 파송하고, 5000명을 먹이는 하나님이 일하시는 교회, 하늘바람 교회';mission.style.cssText='font-size:14px;color:#989898;line-height:1.7;max-width:430px;margin:8px auto 14px';
 const cta=document.createElement('span');cta.textContent='10초 만에 가입하기';cta.style.cssText='box-sizing:border-box;display:block;width:100%;padding:15px 12px;border-radius:12px;background:#00b35a;color:#fff;font-weight:800;font-size:19px';
 preview.append(hint,count,mission,cta);
 if(!document.getElementById('hb-cafe-heading-size-match')){const css=document.createElement('style');css.id='hb-cafe-heading-size-match';css.textContent='#app #hb-home-cafe-preview h2,#app #hb-home-naver-blog .hb-blog-heading h2,#app .hb-home-video-aligned .home-video-six-header h2{font-size:24px!important;font-weight:800!important;line-height:1.3!important;letter-spacing:-.025em!important;color:#314e66!important;margin:0!important;text-align:center!important}#app #hb-home-cafe-preview>p,#app #hb-home-naver-blog .hb-blog-heading p,#app .hb-home-video-aligned .home-video-six-header p{font-size:15px!important;font-weight:400!important;line-height:1.6!important;color:#8295a4!important;margin:12px 0 0!important;text-align:center!important}#app #hb-home-cafe-preview{padding-top:24px!important}#app #hb-home-cafe-preview>a{margin-top:22px!important}#app #hb-home-naver-blog .hb-blog-heading{margin-bottom:22px!important}';document.head.append(css)}
 section.append(h,p,preview);blog.insertAdjacentElement('afterend',section);
}

/* Home video cards: update each service independently from verified official uploads. */
let hbVideoRefreshAt=0;
function hbRefreshHomeVideos(){
 if(Date.now()-hbVideoRefreshAt<60000)return;hbVideoRefreshAt=Date.now();
 fetch('/assets/official-video-albums.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('feed');return r.json()}).then(data=>{
  const dawn=(data['sermon-8']||[])[0],friday=(data['friday-evening']||[])[0],david=(data['david-worship']||[])[0];
  for(const [label,video] of [['새벽설교',dawn],['금요설교',friday],['주일설교',david]]){
   if(!video||!/^[-_a-zA-Z0-9]{11}$/.test(video.id||''))continue;
   const headers=[...document.querySelectorAll('#app h2,#app h3,#app h4')];
   const heading=headers.find(h=>(h.textContent||'').trim()===label);if(!heading)continue;
   const section=heading.closest('.home-six-item')||heading.closest('section')||heading.parentElement?.parentElement;if(!section)continue;
   const card=[...section.querySelectorAll('a[href]')].find(a=>a.querySelector('img')&&a.textContent.trim().length>4);
   if(!card)continue;
   const link='https://www.youtube.com/watch?v='+video.id;
   card.href=link;card.target='_blank';card.rel='noopener noreferrer';
   const img=card.querySelector('img');if(img){img.src='https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg';img.alt=video.title||label;}
   const title=[...card.querySelectorAll('h3,h4,h5,p')].find(e=>(e.textContent||'').trim().length>4);
   if(title)title.textContent=video.title||label;
  }
 }).catch(()=>{});
}
function hbVisionBanner(){const old=document.querySelector('.hb-mbmc-footer-banner');if(!old||document.getElementById('hb-vision-2027'))return;const el=document.createElement('section');el.id='hb-vision-2027';el.className='container';el.style.cssText='max-width:1180px;margin:24px auto 0;padding:0 16px';const img=document.createElement('img');img.src='/assets/vision-fund-2027.jpg';img.alt='2027 비전펀드 — 주일의 신앙을 넘어, 삶의 모든 순간 하나님과 함께';img.style.cssText='display:block;width:100%;height:auto;object-fit:contain';img.onerror=()=>{img.remove();const panel=document.createElement('div');panel.style.cssText='box-sizing:border-box;width:100%;aspect-ratio:1536/600;min-height:170px;padding:clamp(20px,4vw,55px);background:linear-gradient(120deg,#173e73,#2988a5);color:#fff;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-radius:8px';panel.innerHTML='<div style="font-size:clamp(24px,5vw,66px);font-weight:900">2027, 비전펀드</div><div style="font-size:clamp(13px,2.2vw,25px);font-weight:700">주일의 신앙을 넘어, 삶의 모든 순간 하나님과 함께</div><div style="font-size:clamp(11px,1.7vw,20px)">1. 기도를 회복하라　 2. 말씀으로 살아가라　 3. 하나님을 의지하라</div><div style="font-size:clamp(10px,1.5vw,18px)">너의 처음 사랑을 버렸느니라 ··· 처음 행위를 가지라 (계 2:4~5)</div>';el.append(panel)};el.append(img);old.before(el);}
function hbVideoBoardButton(){const h=[...document.querySelectorAll('#app h1,#app h2,#app h3')].find(e=>e.textContent.trim()==='하늘바람교회 영상');if(!h||document.getElementById('hb-video-board-actions'))return;const row=document.createElement('div');row.id='hb-video-board-actions';row.style.cssText='display:flex;justify-content:flex-end;margin:8px 0 12px;gap:8px';const a=document.createElement('a');a.href='/videos/';a.textContent='영상게시판';a.style.cssText='display:inline-flex;align-items:center;border:1px solid #cee0ec;border-radius:8px;padding:8px 12px;color:#215476;background:white;font-size:12px;text-decoration:none';const upload=document.createElement('a');upload.href='/admin.html#bulkVideo';upload.title='영상 등록';upload.setAttribute('aria-label','영상 등록');upload.style.cssText=a.style.cssText;upload.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V3m-5 5 5-5 5 5M4 16v4h16v-4"/></svg>';row.append(upload);const next=h.nextElementSibling; h.parentElement.style.position='relative';row.style.cssText='position:absolute;right:0;top:0;margin:0';h.style.paddingInline='48px';h.parentElement.append(row);}
function apply(){
 const key=path();if(!key||key==='home'){hbHomeBlogPreview();hbHomeCafePreview();hbRefreshHomeVideos();hbVideoBoardButton();hbVisionBanner();}
 const article=document.querySelector('#app .page-grid article.article');
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
  // Remove navigation buttons labeled bulletin board, not the actual board heading.
  article.querySelectorAll('a,button,[role="button"]').forEach(el=>{
    if((el.textContent||'').replace(/\\s+/g,'').trim()==='주보게시판')el.style.setProperty('display','none','important');
  });
  // Replace redundant bulletin-board navigation buttons with an inline expandable list.
  for(const el of article.querySelectorAll('a,button')){
    if((el.textContent||'').replace(/\\s+/g,'').trim()==='주보게시판'){
      el.style.setProperty('display','none','important');
    }
  }
  const bulletinRows=[...article.querySelectorAll('.board-table tbody tr,.board-results > li,.board-list > li,.hb-bulletin-list > li')];
  if(bulletinRows.length>5){
    let more=article.querySelector('#hb-bulletin-more');
    if(!more){
      more=document.createElement('button');more.id='hb-bulletin-more';more.type='button';more.textContent='더보기';
      more.style.cssText='display:block;margin:16px auto;padding:10px 26px;border:1px solid #d4dce4;background:#fff;border-radius:8px;color:#23527a;cursor:pointer';
      bulletinRows[bulletinRows.length-1].closest('table,ul,ol')?.after(more);
      more.addEventListener('click',()=>{const expanded=more.getAttribute('aria-expanded')==='true';more.setAttribute('aria-expanded',String(!expanded));more.textContent=expanded?'더보기':'접기';bulletinRows.forEach((row,i)=>{row.style.display=expanded&&i>=5?'none':''});});
    }
    if(more.getAttribute('aria-expanded')!=='true')bulletinRows.forEach((row,i)=>{if(i>=5)row.style.display='none'});
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
/* Add Naver BAND immediately below Naver Blog in the SNS dropdown. */
function hbAddBandToSNS(){
 const url='https://www.band.us/n/afa8b7sf94f3c';
 const nodes=[...document.querySelectorAll('a,button,[role="menuitem"]')];
 for(const el of nodes){
  const label=(el.textContent||'').replace(/\\s+/g,'').trim();
  const href=el.getAttribute('href')||'';
  if(!(label==='네이버블로그'||label==='NaverBlog'||label==='NAVER블로그'||(href.includes('blog.naver.com')&&!el.closest('#hb-home-naver-blog'))))continue;
  if(el.closest('#hb-home-naver-blog'))continue;
  const row=el.closest('li')||el;
  const parent=row.parentElement;if(!parent||parent.querySelector('[data-hb-sns-band="1"]'))continue;
  const copy=row.cloneNode(true);
  copy.dataset.hbSnsBand='1';
  const link=copy.matches('a')?copy:copy.querySelector('a');
  if(link){link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='네이버 밴드';link.setAttribute('aria-label','하늘바람교회 네이버 밴드 열기')}
  else {copy.textContent='네이버 밴드';copy.setAttribute('role','link');copy.tabIndex=0;copy.addEventListener('click',()=>window.open(url,'_blank','noopener'));copy.addEventListener('keydown',e=>{if(e.key==='Enter')window.open(url,'_blank','noopener')})}
  row.insertAdjacentElement('afterend',copy);
 }
}
let q=false;function run(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply();hbAddBandToSNS()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();window.addEventListener('hashchange',run);
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();