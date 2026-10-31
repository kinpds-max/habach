(()=>{'use strict';
const css=document.createElement('style');css.id='hb-requested-ui-fixes-20261101';css.textContent=`
#app .hb-requested-businesses strong,#app .hb-requested-businesses b{font-weight:800!important}
#app .hb-requested-businesses p{font-size:15px;line-height:1.9;font-weight:650;color:#2d526b}
#app .hb-requested-bulletin-controls{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap}
#app .hb-requested-bulletin-controls a{padding:9px 14px;background:#e8f3fb;border-radius:10px;text-decoration:none;color:#245476;font-weight:750}
#app .hb-requested-calendar-notice{border:1px solid #d9e8f1;border-radius:12px;padding:16px;margin-top:18px;background:#f8fbfe}
#app .hb-requested-calendar-notice h3{color:#315975;font-size:18px;margin:0 0 9px}
#app .hb-requested-calendar-notice a{color:#225e88}
`;document.head.append(css);
const route=()=>location.hash.replace(/^#\\/?/,'').split(/[?&]/)[0];
function run(){
 const key=route(),article=document.querySelector('#app .page-grid article.article');if(!article)return;
 if(['news-1','news-6'].includes(key)){
   const title=article.querySelector('.article-title');
   if(title){
    let n=title.nextElementSibling,removed=0;
    while(n&&removed<2){const next=n.nextElementSibling;if((n.tagName==='HR'||n.matches('.boardhead'))&&!(n.textContent||'').trim()){n.style.display='none';removed++}n=next}
   }
   if(key==='news-6'){
    article.classList.add('hb-requested-businesses');
    const bold=article.querySelectorAll('p,li,div');
    for(const el of bold)if(el.children.length===0&&/하스놀|하늘매트|하맘컨텐츠|데오럭스|성규에이전시|론파인드|썬빈로스터리/.test(el.textContent)){el.style.fontWeight='750';el.textContent=el.textContent.replace(/\\(주\\)하스놀|하스놀\\(주\\)|\\(주\\)하스놀/g,'하스놀(주)')}
   }
 }
 if(key==='news-2'){
  const title=article.querySelector('.article-title');if(title){
   let action=title.querySelector('.hb-requested-bulletin-controls');
   if(!action){action=document.createElement('div');action.className='hb-requested-bulletin-controls';title.append(action)}
   if(!action.querySelector('a')){const a=document.createElement('a');a.href='/admin/bulletin.html';a.textContent='교회주보 업로드';action.append(a)}
  }
  article.querySelectorAll('.hb-book-reader,.hb-book-controls').forEach(el=>el.style.display='none');
 }
 if(key==='next-1'){
  for(const item of article.querySelectorAll('.hb-education-schedule'))item.innerHTML=item.innerHTML.replace(/<br\\s*\\/?>(?:\\s*<strong>활동<\\/strong>)\\s*주짓수/g,'').replace(/<strong>활동<\\/strong>\\s*주짓수/g,'');
 }
 if(key==='ministry-2'){
  if(!article.querySelector('#hb-prayer-watch-link')){const section=article.querySelector('.hb-prayer-section')||article;const a=document.createElement('a');a.id='hb-prayer-watch-link';a.href='#/sermon-9';a.textContent='기도집회 영상 전체 보기 →';a.style.cssText='display:inline-block;padding:12px 18px;border-radius:10px;background:#e7f3fc;color:#275b7b;font-weight:800;margin:18px 0;text-decoration:none';section.append(a)}
 }
 if(key==='news-10'){
  const box=article.querySelector('#hbSharedBoardCalendar')||article;
  if(!article.querySelector('#hb-202611-bulletin-calendar-note')){
   const panel=document.createElement('div');panel.id='hb-202611-bulletin-calendar-note';panel.className='hb-requested-calendar-notice';
   const h=document.createElement('h3');h.textContent='2026년 11월 주보 안내 일정';const p=document.createElement('p');p.textContent='11월 11일, 15일, 17일 예배 및 모임 안내는 이번 주 교회주보를 참고해 주세요. 상세 시간과 행사는 확인 후 일정표에 등록됩니다.';const a=document.createElement('a');a.href='#/news-2';a.textContent='이번 주 주보 확인 →';panel.append(h,p,a);box.insertAdjacentElement('afterend',panel);
  }
 }
}
let scheduled=false;function tick(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;run()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();window.addEventListener('hashchange',tick);new MutationObserver(tick).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:false});
})();