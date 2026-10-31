(()=>{'use strict';
const playlists={
 'sermon-member-6':{list:'PLmD7ZicLdWIo789op9oY2lBV5GepGgjCP',name:'BT나눔축제',first:'5Q3k0rM6954'},
 'sermon-member-7':{list:'PLmD7ZicLdWIqG1Hn-kmTOXVzmtKv6LW9h',name:'BT',first:'pg0m3-oCf3E'}
};
let data={},scheduled=false;
const current=()=>location.hash.replace(/^#\\/?/,'').split(/[?&]/)[0];
function makeCard(video){
 const a=document.createElement('a');a.className='sermon-album-card static-sermon-card';
 a.dataset.hbBtVideo=video.id;a.dataset.video=video.id;
 a.href='https://www.youtube.com/watch?v='+encodeURIComponent(video.id);a.target='_blank';a.rel='noopener noreferrer';
 const thumb=document.createElement('span');thumb.className='sermon-album-thumb';
 const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg';img.alt=video.title;img.loading='lazy';
 const play=document.createElement('i');play.textContent='▶';thumb.append(img,play);
 const copy=document.createElement('span');copy.className='sermon-album-copy';
 const heading=document.createElement('strong');heading.textContent=video.title;copy.append(heading);a.append(thumb,copy);
 return a;
}
function apply(){
 const key=current(),p=playlists[key];if(!p)return;
 const article=document.querySelector('#app article.article');if(!article)return;
 const board=article.querySelector('.hb-static-board');if(!board)return;
 const grid=board.querySelector('.hb-static-sermon-grid');if(!grid)return;
 grid.classList.add('hb-bt-video-list');
 const videos=Array.isArray(data[key])?data[key].filter(v=>v&&/^[\\w-]{11}$/.test(v.id)):[],
 existing=[...grid.querySelectorAll('a[data-video],a[data-hb-bt-video]')];
 const known=new Set(existing.map(a=>a.dataset.video||a.dataset.hbBtVideo).filter(Boolean));
 for(const video of videos){if(known.has(video.id))continue;grid.append(makeCard(video));known.add(video.id)}
 // Preserve the first verified video even if playlist synchronization has not run yet.
 if(!known.size){grid.append(makeCard({id:p.first,title:p.name+' 첫 영상'}));known.add(p.first)}
 // The cards ARE the album. Remove stale large playlist embeds and duplicate teaser blocks.
 board.querySelectorAll('#hb-bt-playlist-inline').forEach(el=>el.remove());
 const count=board.querySelector('.hb-static-board-head span');
 if(count)count.textContent='영상 '+known.size+'개';
 const styleId='hb-bt-list-layout';
 if(!document.getElementById(styleId)){const style=document.createElement('style');style.id=styleId;style.textContent=
 '.hb-bt-video-list{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;width:100%!important}' +
 '.hb-bt-video-list>a{display:flex!important;flex-direction:column!important;min-width:0!important;width:100%!important;max-width:100%!important}' +
 '.hb-bt-video-list .sermon-album-thumb{display:block;position:relative;aspect-ratio:16/9;width:100%;overflow:hidden}' +
 '.hb-bt-video-list .sermon-album-thumb img{display:block;width:100%;height:100%;object-fit:cover}' +
 '.hb-bt-video-list .sermon-album-thumb i{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#ffffffeb;border-radius:50%;padding:12px;font-style:normal;color:#275d7a}' +
 '@media(max-width:900px){.hb-bt-video-list{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}}';
 document.head.append(style)}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.addEventListener('hashchange',schedule);
fetch('/assets/bt-playlist-videos.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(x=>{data=x||{};schedule()}).catch(()=>schedule());
const root=document.getElementById('app')||document.documentElement;
new MutationObserver(schedule).observe(root,{childList:true,subtree:false});
})();
