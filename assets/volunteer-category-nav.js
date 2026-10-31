(()=>{'use strict';
const V=[{id:'nweyrCQwGPs',sel:'.hb-ministry-children',name:'너는 잘될 거야'},{id:'uUId-pRdB_w',sel:'.hb-ministry-parents',name:'덕분에 잘되었습니다'}];
const photos=['chatgpt_1793426450783_0c594477ea84204c.jpg','chatgpt_1793426453670_e345e10bd41d27f7.jpg','chatgpt_1793426456099_aee978fbeb1f582b.jpg','chatgpt_1793426459734_ee4e9a5e493d7e4b.jpg','chatgpt_1793426462359_42e9763907b0fdab.jpg','chatgpt_1793426465419_3226d05108103e6f.jpg'];
function apply(){
 if(!/^#\\/ministry-5(?:$|[?#])/.test(location.hash))return;
 const article=document.querySelector('#app .page-grid article.article');if(!article)return;
 article.removeAttribute('data-hb-volunteer-category');
 article.querySelectorAll('#hb-volunteer-side-accordion,.hb-volunteer-native-menu').forEach(el=>el.remove());
 const current=document.querySelector('.page-grid aside.side a[href="#/ministry-5"]');if(current)current.style.removeProperty('display');
 const original=article.querySelector('#hb-volunteer-original-content');if(original)original.style.setProperty('display','block','important');
 const chosen=article.querySelector('#hb-volunteer-selected-content');if(chosen){chosen.replaceChildren();chosen.remove();}
 const group=article.querySelector('.hb-unified-ministry-group');if(!group)return;
 V.forEach((v,i)=>{
  const target=group.querySelector(v.sel);if(!target||target.querySelector('.hb-generation-media'))return;
  const wrap=document.createElement('div');wrap.className='hb-generation-media';
  const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+v.id;a.target='_blank';a.rel='noopener noreferrer';a.className='hb-generation-video-card';
  const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg';img.alt=v.name+' 유튜브 영상';img.loading='lazy';
  const label=document.createElement('strong');label.textContent=v.name+' · 유튜브 영상 보기';
  a.append(img,label);wrap.append(a);
  if(i===0){
   const h=document.createElement('h4');h.textContent='덕분에 잘되었습니다 · 자녀세대 행사 사진';wrap.append(h);
   const gallery=document.createElement('div');gallery.className='hb-youth-gratitude-gallery hb-generation-photo-grid';
   photos.forEach((p,j)=>{const url='https://files.mallary.ai/uploads/900/'+p;const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';const pic=document.createElement('img');pic.src=url;pic.alt='자녀세대 행사 사진 '+(j+1);pic.loading='lazy';link.append(pic);gallery.append(link)});
   wrap.append(gallery);
  }
  target.append(wrap);
 });
}
const style=document.createElement('style');style.textContent='#app .hb-generation-video-card{display:block;text-decoration:none;color:#315675;max-width:520px;margin:16px 0 26px}#app .hb-generation-video-card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px}#app .hb-generation-video-card strong{display:block;margin:9px 0;font-size:16px}#app .hb-generation-photo-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important}#app .hb-generation-photo-grid img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px}@media(max-width:700px){#app .hb-generation-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}}';document.head.append(style);
let queued=false;function tick(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
window.addEventListener('hashchange',tick);
const watch=()=>{const app=document.getElementById('app');if(app)new MutationObserver(tick).observe(app,{childList:true,subtree:false})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();