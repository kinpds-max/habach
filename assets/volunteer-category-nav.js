(()=>{'use strict';
const V=[{id:'nweyrCQwGPs',sel:'.hb-ministry-children',name:'너는 잘될 거야'},{id:'uUId-pRdB_w',sel:'.hb-ministry-parents',name:'덕분에 잘되었습니다'}];
const photos=['chatgpt_1793426450783_0c594477ea84204c.jpg','chatgpt_1793426453670_e345e10bd41d27f7.jpg','chatgpt_1793426456099_aee978fbeb1f582b.jpg','chatgpt_1793426459734_ee4e9a5e493d7e4b.jpg','chatgpt_1793426462359_42e9763907b0fdab.jpg','chatgpt_1793426465419_3226d05108103e6f.jpg'];

function correctVolunteerGallery(article,group){
 const gallery=article.querySelector('.hb-service-album');
 if(gallery){
  const cards=[...gallery.querySelectorAll('.hb-service-album-card')];
  const names=['연예인 지역뮤지컬공연','지역모노드라마공연','위대한응원'];
  cards.slice(0,3).forEach((card,i)=>{const heading=card.querySelector('h3,h4,strong');if(heading)heading.textContent=names[i]});
 }
 const child=group.querySelector('.hb-ministry-children');
 if(child){
  child.style.setProperty('border-top','0','important');
  const prev=group.previousElementSibling;
  if(prev?.classList.contains('hb-ministry-regional'))prev.style.setProperty('border-bottom','0','important');
 }
}
function polishMinistry(article,group){
 const regional=article.querySelector('.hb-ministry-regional');
 const children=group.querySelector('.hb-ministry-children');
 const parents=group.querySelector('.hb-ministry-parents');
 const original=article.querySelector('#hb-volunteer-original-content');
 const list=[[regional,'1. 지역·문화섬김'],[children,'2. 자녀세대섬김'],[parents,'3. 부모세대섬김']];
 for(const [section,label] of list){
  if(!section)continue;
  section.classList.add('hb-readable-ministry-section');
  let heading=section.querySelector('h3');
  if(!heading){heading=document.createElement('h3');section.prepend(heading)}
  heading.textContent=label;
 }
 if(regional){
  // Move the heading before the actual introductory paragraph, not to a detached regional placeholder.
  const introPara=[...article.querySelectorAll('p')].find(p=>p.textContent.trim()==='사람을 사랑하며 지역 공동체를 섬깁니다');
  let heading=article.querySelector('#hb-regional-leading-heading');
  if(!heading){heading=document.createElement('div');heading.id='hb-regional-leading-heading'}
  heading.innerHTML='<h3>1. 지역·문화섬김</h3>';
  if(introPara&&introPara.previousElementSibling!==heading)introPara.insertAdjacentElement('beforebegin',heading);
  const originalDescription=regional.querySelector('p');
  if(originalDescription)originalDescription.remove();
  const oldHeading=regional.querySelector('h3');if(oldHeading)oldHeading.remove();
  // Gallery cards are rendered asynchronously. Move the whole gallery after the voucher cards.
  const gallery=article.querySelector('.hb-service-album');
  const voucherGrid=article.querySelector('.source-feature-grid');
  if(gallery&&voucherGrid&&voucherGrid.nextElementSibling!==gallery)voucherGrid.insertAdjacentElement('afterend',gallery);
  if(gallery){gallery.style.setProperty('display','grid','important');gallery.style.removeProperty('visibility');}
  if(regional&&!regional.children.length)regional.remove();
 }
 // Preserve all existing media while moving specifically titled cultural cards below House Tree.
 const house=[...original?.querySelectorAll('strong,h3,h4')||[]].find(e=>(e.textContent||'').trim()==='하우스트리');
 const mediaNames=['연예인 지역뮤지컬','지역 모노드라마'];
 if(house){
  const anchor=house.closest('div')||house.parentElement;
  let extra=original.querySelector('#hb-regional-stage-arts');
  if(!extra){extra=document.createElement('div');extra.id='hb-regional-stage-arts';anchor.insertAdjacentElement('afterend',extra)}
  for(const name of mediaNames){
   const heading=[...original.querySelectorAll('h3,h4,strong,span')].find(el=>el!==house&&(el.textContent||'').trim()===name&&!extra.contains(el));
   const card=heading?.closest('.hb-service-album-card,.hb-service-card,.album-card,article,li');
   if(card&&card!==anchor&&!card.contains(anchor))extra.append(card);
  }
 }
}

function apply(){
 if(!location.hash.startsWith('#/ministry-5'))return;
 const article=document.querySelector('#app .page-grid article.article');if(!article)return;
 article.removeAttribute('data-hb-volunteer-category');
 article.querySelectorAll('#hb-volunteer-side-accordion,.hb-volunteer-native-menu').forEach(el=>el.remove());
 const current=document.querySelector('.page-grid aside.side a[href="#/ministry-5"]');if(current)current.style.removeProperty('display');
 const original=article.querySelector('#hb-volunteer-original-content');if(original)original.style.setProperty('display','block','important');
 const chosen=article.querySelector('#hb-volunteer-selected-content');if(chosen){chosen.replaceChildren();chosen.remove();}
 const group=article.querySelector('.hb-unified-ministry-group');if(!group)return;
 polishMinistry(article,group);
 correctVolunteerGallery(article,group);
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
const polishStyle=document.createElement('style');polishStyle.id='hb-unified-ministry-legibility-20261101';
polishStyle.textContent=`
#app .hb-readable-ministry-section{margin:56px 0 0!important;padding-top:28px!important;border-top:1px solid #dce6ef!important}
#app .hb-readable-ministry-section h3,#app #hb-regional-leading-heading h3{font-size:clamp(23px,2.6vw,29px)!important;font-weight:800!important;letter-spacing:-.045em!important;line-height:1.4!important;color:#284e6b!important;margin:0 0 14px!important}
#app #hb-regional-leading-heading{margin:12px 0 26px!important;padding:0 0 10px!important}
#app .hb-readable-ministry-section p,#app #hb-regional-leading-heading p{font-size:clamp(15px,1.55vw,17px)!important;line-height:1.9!important;letter-spacing:-.015em!important;color:#50697b!important;margin:0 0 22px!important;overflow-wrap:break-word}
#app .hb-readable-ministry-section h4{font-size:clamp(18px,1.9vw,21px)!important;line-height:1.5!important;margin:24px 0 12px!important;color:#315675!important}
#app .hb-readable-ministry-section .hb-generation-photo-grid{margin-top:16px!important}
#app #hb-regional-stage-arts{margin:18px 0 26px;display:grid;gap:14px}
#app .hb-service-album img{max-width:100%;height:auto}
@media(max-width:700px){
#app .hb-readable-ministry-section{margin-top:42px!important;padding-top:24px!important}
#app #hb-regional-leading-heading{margin:10px 0 22px!important}
#app .hb-readable-ministry-section p,#app #hb-regional-leading-heading p{line-height:1.85!important}
}`;
document.head.append(polishStyle);
const cleanLine=document.createElement('style');cleanLine.textContent='#app .hb-unified-ministry-group{border-top:0!important}#app .hb-unified-ministry-group .hb-ministry-children{border-top:0!important}';document.head.append(cleanLine);
let queued=false;function tick(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
window.addEventListener('hashchange',tick);
const watch=()=>{const app=document.getElementById('app');if(app)new MutationObserver(tick).observe(app,{childList:true,subtree:true})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();