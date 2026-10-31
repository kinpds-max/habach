(()=>{
'use strict';
const videos=['sR93A8BKczI','6BDJJURGAds','NU4ypCTh7Qs','rXfUJ5jDVdY','K3eKiMtkFls','z8HuQ6vtGDA'];
const isSmall=t=>/2\s*[.·ㆍ]?\s*3\s*[.·ㆍ]?\s*4\s*스몰모임/.test(t||'');
const isAlbum=t=>/영상\s*앨범|영상\s*게시판/.test(t||'');
function mount(){
 const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5')].filter(h=>h.getClientRects().length);
 const group=headings.find(h=>isSmall(h.textContent)&&h.textContent.trim().length<85);
 if(!group)return;
 const album=headings.find(h=>isAlbum(h.textContent)&&h.getBoundingClientRect().top>group.getBoundingClientRect().top);
 if(!album)return;
 const existing=[...document.querySelectorAll('a[href],iframe[src],[data-video-id]')].map(el=>el.getAttribute('href')||el.getAttribute('src')||el.dataset.videoId||'').join(' ');
 let holder=document.getElementById('hb-small234-extra-videos');
 if(!holder){
  holder=document.createElement('section');
  holder.id='hb-small234-extra-videos';
  holder.setAttribute('aria-label','2·3·4 스몰모임 추가 영상');
  holder.style.cssText='margin:18px 0 30px;width:100%';
  const title=document.createElement('h3');title.textContent='2·3·4 스몰모임 영상';title.style.cssText='font-size:20px;margin:0 0 14px;color:#294d63';
  const grid=document.createElement('div');grid.className='hb-small234-video-grid';grid.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px';
  holder.append(title,grid);
  const root=album.closest('section,article')||album.parentElement?.parentElement||album.parentElement;
  root.insertAdjacentElement('afterend',holder);
 }
 const grid=holder.querySelector('.hb-small234-video-grid');
 for(const id of videos){
  if(grid.querySelector('[data-video-id="'+id+'"]'))continue;
  if(existing.includes(id))continue;
  const a=document.createElement('a');a.dataset.videoId=id;a.href='https://www.youtube.com/shorts/'+id;a.target='_blank';a.rel='noopener noreferrer';
  a.style.cssText='border:1px solid #dce5e9;border-radius:15px;overflow:hidden;text-decoration:none;color:#23485d;background:white;display:block';
  const imageBox=document.createElement('div');imageBox.style.cssText='aspect-ratio:4 / 3;position:relative;background:#122e42;display:flex;align-items:center;justify-content:center';
  const img=document.createElement('img');img.loading='lazy';img.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';img.alt='2·3·4 스몰모임 쇼츠';img.style.cssText='width:100%;height:100%;object-fit:contain;display:block';
  const play=document.createElement('span');play.textContent='▶';play.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#ffffffdc;border-radius:50%;width:42px;height:42px;display:grid;place-items:center;color:#24526b;font-size:18px';
  const label=document.createElement('div');label.textContent='2·3·4 스몰모임 영상';label.style.cssText='font-weight:700;font-size:14px;padding:10px 12px';
  imageBox.append(img,play);a.append(imageBox,label);grid.append(a);
 }
 if(!grid.children.length)holder.remove();
}
let pending=false;
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mount()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.addEventListener('hashchange',schedule);
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();