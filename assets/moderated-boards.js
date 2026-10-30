/* Moderated church education & group boards */
(() => {
  const cfg = window.HABACH_CONFIG || {};
  const base = (cfg.supabaseUrl || 'https://veghdecosrimscedkrdo.supabase.co').replace(/\/$/,'');
  const key = cfg.supabasePublishableKey || 'sb_publishable_cwKdgTkhjPQGM4jRclWjkQ_rlpawUxO';
  const categories = [
    ['영유아부','education:infants'],['유치부','education:preschool'],['유초등부','education:elementary'],
    ['초등부','education:elementary'],['청소년부','education:teens'],['중고등부','education:teens'],
    ['청년1부','education:youth1'],['청년2부','education:youth2'],['교육부서','education:general'],
    ['2·3·4 스몰모임','community:small234'],['2.3.4 스몰모임','community:small234'],
    ['남자들의모임','community:men'],['형제들의모임','community:men'],
    ['자매들의모임','community:women'],['청년들의모임','community:youth'],
    ['소그룹교제','community:general']
  ];
  const normalize = v => (v || '').replace(/\s+/g,'').trim();
  let active = null;
  function determine(){
    const headings = [...document.querySelectorAll('main h1,main h2,article h1,article h2,.page-title,h1,h2')].filter(el => el.offsetWidth || el.offsetHeight);
    for(const el of headings){
      const name=normalize(el.textContent);
      const item=categories.find(([label])=>name===normalize(label));
      if(item)return {label:item[0],key:item[1],anchor:el};
    }
    return null;
  }
  function api(method,query,payload){
    return fetch(base+'/rest/v1/church_community_submissions'+query,{
      method,headers:{apikey:key,'Content-Type':'application/json',Prefer:'return=minimal'},
      ...(payload?{body:JSON.stringify(payload)}:{})
    }).then(async response=>{if(!response.ok)throw Error((await response.text()).slice(0,300));return response.status===204?[]:response.json();});
  }
  function openForm(section){
    document.getElementById('habach-board-form')?.remove();
    const overlay=document.createElement('div');overlay.id='habach-board-form';
    overlay.innerHTML='<div class="habach-board-modal" role="dialog" aria-modal="true"><button type="button" class="habach-board-close" aria-label="닫기">×</button><h3>게시글 작성</h3><p>게시물은 관리자 승인 후 공개됩니다. 홍보·광고·스팸 글은 게시되지 않습니다.</p><form><label>작성자<input name="author_name" minlength="2" maxlength="30" required></label><label>제목<input name="title" minlength="3" maxlength="100" required></label><label>내용<textarea name="body" minlength="10" maxlength="3000" rows="6" required></textarea></label><button type="submit">승인 요청하기</button><p class="habach-board-result" aria-live="polite"></p></form></div>';
    document.body.append(overlay);
    overlay.querySelector('.habach-board-close').onclick=()=>overlay.remove();
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
    overlay.querySelector('form').onsubmit=async e=>{
      e.preventDefault();
      const form=e.currentTarget, result=form.querySelector('.habach-board-result');
      const data=Object.fromEntries(new FormData(form));
      const txt=(data.title+' '+data.body).toLowerCase();
      if(/https?:\/\/|www\.|카톡|텔레그램|무료수익|도박|카지노|코인투자|광고문의|대출문의/i.test(txt)){
        result.textContent='광고 또는 스팸으로 의심되는 내용은 접수할 수 없습니다.';return;
      }
      const submit=form.querySelector('button[type="submit"]');submit.disabled=true;result.textContent='저장 중...';
      try{
        await api('POST','',{section_key:section.key,author_name:data.author_name.trim(),title:data.title.trim(),body:data.body.trim(),status:'pending'});
        result.textContent='접수되었습니다. 관리자가 승인한 후 게시됩니다.';form.reset();
      }catch(err){result.textContent='저장하지 못했습니다. 잠시 후 다시 시도해 주세요.';}
      submit.disabled=false;
    };
  }
  async function loadPosts(section,host){
    try{
      const rows=await api('GET','?select=title,body,author_name,created_at&section_key=eq.'+encodeURIComponent(section.key)+'&status=eq.approved&order=created_at.desc&limit=30');
      const list=host.querySelector('.habach-board-approved');
      list.replaceChildren();
      rows.forEach(post=>{
        const item=document.createElement('article');item.className='habach-board-post';
        const h=document.createElement('h4');h.textContent=post.title;
        const small=document.createElement('small');small.textContent=post.author_name+' · '+new Date(post.created_at).toLocaleDateString('ko-KR');
        const body=document.createElement('p');body.textContent=post.body;
        item.append(h,small,body);list.append(item);
      });
    }catch(e){/* Existing page remains functional on service errors. */}
  }
  function attach(){
    const page=determine();
    if(!page)return;
    const old=document.getElementById('habach-moderated-board');
    if(old?.dataset.key===page.key)return;
    old?.remove();
    active=page;
    const panel=document.createElement('div');panel.id='habach-moderated-board';panel.dataset.key=page.key;
    panel.innerHTML='<div class="habach-board-toolbar"><span>게시판</span><button type="button">글쓰기</button></div><div class="habach-board-approved"></div>';
    const anchor=page.anchor.closest('section,article') || page.anchor;
    anchor.insertAdjacentElement('afterend',panel);
    panel.querySelector('button').onclick=()=>openForm(page);
    loadPosts(page,panel);
  }
  const style=document.createElement('style');
  style.textContent='#habach-moderated-board{margin:26px auto 36px;max-width:1100px}.habach-board-toolbar{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8e2e8;padding:10px 0 16px;font-weight:800;color:#265d78}.habach-board-toolbar button,.habach-board-modal button[type=submit]{background:#176688;color:white;border:0;padding:11px 22px;border-radius:10px;font-weight:800;cursor:pointer}.habach-board-post{padding:18px 4px;border-bottom:1px solid #e0e8ed}.habach-board-post h4{margin:0 0 5px}.habach-board-post small{color:#738291}.habach-board-post p{white-space:pre-wrap;line-height:1.7}#habach-board-form{position:fixed;inset:0;z-index:99999;background:#0008;display:grid;place-items:center;padding:14px}.habach-board-modal{position:relative;background:white;border-radius:18px;width:min(100%,560px);max-height:92vh;overflow:auto;padding:25px;box-shadow:0 16px 50px #0003}.habach-board-modal h3{margin:0}.habach-board-modal>p{font-size:14px;color:#667}.habach-board-modal label{display:block;font-weight:700;margin:14px 0}.habach-board-modal input,.habach-board-modal textarea{display:block;width:100%;box-sizing:border-box;border:1px solid #cbd6df;border-radius:9px;padding:12px;font:inherit;margin-top:7px}.habach-board-close{position:absolute;right:18px;top:14px;background:none;border:none;font-size:29px;cursor:pointer}.habach-board-result{font-size:14px;color:#216380}';
  document.head.append(style);
  let scheduled=false;
  const schedule=()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;attach()},180)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
  new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});
  window.addEventListener('hashchange',schedule);
})();