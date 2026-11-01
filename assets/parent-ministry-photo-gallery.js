(()=>{'use strict';
const photos=["https://files.mallary.ai/uploads/900/chatgpt_1793538858186_2ca1e22bd96da495.png","https://files.mallary.ai/uploads/900/chatgpt_1793538873619_de64d3e3b6417a9e.png","https://files.mallary.ai/uploads/900/chatgpt_1793538882478_e11927675e81f016.png","https://files.mallary.ai/uploads/900/chatgpt_1793538902472_e80f6579e6e390a8.png","https://files.mallary.ai/uploads/900/chatgpt_1793538923430_81ee0f7c2c18d97f.png","https://files.mallary.ai/uploads/900/chatgpt_1793538941028_c9b84e2769ee7eff.png"];
const css=document.createElement('style');css.id='hb-parent-ministry-six-photos-style';css.textContent=`
#app .hb-parent-six-photos{width:100%;margin:22px 0 34px;clear:both}
#app .hb-parent-six-photos>h4{font-size:clamp(18px,2.6vw,24px);font-weight:800;color:#315675;margin:0 0 16px}
#app .hb-parent-six-photos-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important;width:100%}
#app .hb-parent-six-photos-grid a{display:block;min-width:0;overflow:hidden;border-radius:12px;border:1px solid #dce7ee;background:#fff;line-height:0}
#app .hb-parent-six-photos-grid img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;height:auto;transition:transform .2s ease}
#app .hb-parent-six-photos-grid a:hover img{transform:scale(1.03)}
@media(max-width:700px){#app .hb-parent-six-photos-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}}
`;document.head.append(css);
function mount(){const article=document.querySelector('#app article.article');if(!article)return;
const heading=[...article.querySelectorAll('h2,h3,h4')].find(el=>/^(?:0?3[.\s]*)?부모\s*세대\s*섬김/.test((el.textContent||'').trim()));if(!heading)return;
let section=heading.closest('.hb-ministry-parents')||heading.closest('section')||heading.parentElement;if(!section||section===article)return;
let gallery=article.querySelector('#hb-parent-ministry-six-photos');if(!gallery){gallery=document.createElement('section');gallery.id='hb-parent-ministry-six-photos';gallery.className='hb-parent-six-photos';gallery.setAttribute('aria-label','부모세대 섬김 사진앨범');const title=document.createElement('h4');title.textContent='부모세대 섬김 사진앨범';const grid=document.createElement('div');grid.className='hb-parent-six-photos-grid';photos.forEach((src,i)=>{const link=document.createElement('a');link.href=src;link.target='_blank';link.rel='noopener noreferrer';link.title='부모세대 섬김 사진 '+(i+1)+' 크게 보기';const image=document.createElement('img');image.src=src;image.loading='lazy';image.alt='하늘바람교회 부모세대 섬김 기념사진 '+(i+1);link.append(image);grid.append(link)});gallery.append(title,grid)}
// Keep the gallery at the bottom of the parent ministry section, below its existing video.
if(gallery.parentElement!==section||gallery!==section.lastElementChild)section.append(gallery);
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mount()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:false});
})();