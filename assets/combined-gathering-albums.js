(()=>{'use strict';
const configs=[
 {title:/2\s*[·.ㆍ]?\s*3\s*[·.ㆍ]?\s*4\s*스몰모임/,extra:'#hb-small234-extra-videos'},
 {title:/남자들의\s*모임/,extra:'[data-hb-men-video]'}
];
const css=document.createElement('style');css.textContent=`
.hb-unified-album{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;width:100%!important}
.hb-unified-album>*{min-width:0!important;max-width:none!important;width:100%!important;height:100%!important;margin:0!important;box-sizing:border-box!important}
.hb-unified-album a{display:flex!important;flex-direction:column!important;height:100%!important;text-decoration:none!important}
.hb-unified-album a>div:first-child,.hb-unified-album .video-thumbnail,.hb-unified-album .video-thumb,.hb-unified-album [class*=thumbnail],.hb-unified-album [class*=thumb]{aspect-ratio:4/3!important;width:100%!important;max-height:none!important}
.hb-unified-album img{object-fit:contain!important;max-height:100%!important}
.hb-unified-album .hb-unified-caption{font-size:14px!important;font-weight:700!important;line-height:1.45!important;padding:11px!important;min-height:62px!important;box-sizing:border-box!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}
@media(min-width:860px){.hb-unified-album{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
`;document.head.append(css);
const getId=url=>{const m=(url||'').match(/(?:shorts\/|youtu\.be\/|watch\?v=|embed\/|vi\/)([\w-]{11})/);return m?.[1]||null};
function visible(e){return e.getClientRects().length>0}
function videoCard(el){return el.querySelector('img')&&!![...el.querySelectorAll('a[href],iframe[src]')].some(a=>getId(a.href||a.src))||el.matches('a[href]')&&getId(el.href)}
async function nameCard(a,id){if(!id)return;const titleNode=a.querySelector('.hb-unified-caption,[class*=title],h3,h4')||a.lastElementChild;if(!titleNode)return;if(!titleNode.classList.contains('hb-unified-caption'))titleNode.classList.add('hb-unified-caption');if(titleNode.dataset.titleResolved)return;titleNode.dataset.titleResolved='1';try{const response=await fetch('https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id));if(!response.ok)return;const info=await response.json();if(info.title&&info.title!=='YouTube'){titleNode.textContent=info.title;}}catch(_){}}
function run(config){
 const headings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(e=>visible(e)&&config.title.test(e.textContent||'')&&e.textContent.trim().length<90);
 if(!headings.length)return;
 const extra=document.querySelector(config.extra);if(!extra)return;
 const extraCards=[...extra.querySelectorAll('a[href]')].filter(a=>getId(a.href));
 if(!extraCards.length)return;
 const albumHeading=[...document.querySelectorAll('h2,h3,h4')].filter(e=>visible(e)&&/영상\s*(앨범|게시판)|스몰모임\s*영상/.test(e.textContent||'')&&e.getBoundingClientRect().top>=headings[0].getBoundingClientRect().top).at(0);
 const section=albumHeading?.closest('section')||albumHeading?.parentElement?.parentElement;
 let grid=null;
 if(section){grid=[...section.querySelectorAll('div,ul')].find(e=>e.children.length>=1&&[...e.children].filter(videoCard).length>=1)}
 if(!grid){const prior=extra.previousElementSibling;grid=[...(prior?.querySelectorAll('div,ul')||[])].find(e=>e.children.length>=1&&[...e.children].some(videoCard))}
 if(!grid)return;
 grid.classList.add('hb-unified-album');
 const cards=[...grid.children].filter(videoCard);
 const ids=new Set(cards.flatMap(c=>[...c.querySelectorAll('a[href],iframe[src]')].map(e=>getId(e.href||e.src)).filter(Boolean)));
 for(const a of extraCards){const id=getId(a.href);if(ids.has(id))continue;ids.add(id);grid.append(a)}
 for(const item of [...grid.children]){if(!videoCard(item))continue;const a=item.matches('a')?item:item.querySelector('a[href]');const id=getId(a?.href||'')||getId(item.querySelector('iframe[src]')?.src);if(a)nameCard(a,id)}
 if(extra!==grid&&!extra.contains(grid))extra.remove();
}
let running=false;function schedule(){if(running)return;running=true;requestAnimationFrame(()=>{running=false;configs.forEach(run)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
})();