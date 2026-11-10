(()=>{'use strict';let feed={},queued=false;
function apply(){if(!/^#\/resources-2$/.test(location.hash))return;
const article=document.querySelector('#app article.article');if(!article||article.querySelector('[data-worship-resources]'))return;
const root=document.createElement('section');root.dataset.worshipResources='1';
for(const [key,label] of [['sermon-1','주일예배'],['sermon-8','새벽기도']]){
const videos=feed[key]||[];if(!videos.length)continue;
const h=document.createElement('h3');h.textContent=label;root.append(h);
const grid=document.createElement('div');grid.className='hb-static-sermon-grid';
for(const video of videos.slice(0,6)){
const a=document.createElement('a');a.className='sermon-album-card static-sermon-card';a.href='https://www.youtube.com/watch?v='+video.id;a.dataset.video=video.id;a.dataset.title=video.title;
const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg';img.alt=video.title;img.loading='lazy';img.style.cssText='width:100%;aspect-ratio:16/9;object-fit:cover';
const title=document.createElement('strong');title.textContent=video.title;title.style.cssText='display:block;padding:12px';a.append(img,title);grid.append(a);
}root.append(grid);
const more=document.createElement('a');more.href='#/'+key;more.textContent=label+' 전체보기 →';more.style.cssText='display:block;margin:16px 0 28px';root.append(more);
}
if(root.children.length){for(const card of article.querySelectorAll('.infocard'))if(/자동 등록 준비 중|아직 연결되지/.test(card.textContent))card.remove();article.querySelector('.article-title')?.insertAdjacentElement('afterend',root);}
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
fetch('/assets/official-video-albums.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{feed=data;queue()}).catch(()=>{});
addEventListener('hashchange',queue);new MutationObserver(queue).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true});})();
