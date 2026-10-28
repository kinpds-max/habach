/* Bible copying + small group report for habach.kr */
(function(){
'use strict';
const BOOKS=["창세기","출애굽기","레위기","민수기","신명기","여호수아","사사기","룻기","사무엘상","사무엘하","열왕기상","열왕기하","역대상","역대하","에스라","느헤미야","에스더","욥기","시편","잠언","전도서","아가","이사야","예레미야","예레미야애가","에스겔","다니엘","호세아","요엘","아모스","오바댜","요나","미가","나훔","하박국","스바냐","학개","스가랴","말라기","마태복음","마가복음","누가복음","요한복음","사도행전","로마서","고린도전서","고린도후서","갈라디아서","에베소서","빌립보서","골로새서","데살로니가전서","데살로니가후서","디모데전서","디모데후서","디도서","빌레몬서","히브리서","야고보서","베드로전서","베드로후서","요한일서","요한이서","요한삼서","유다서","요한계시록"];
const COUNTS=[[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],[22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],[17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],[54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],[46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],[22,23,18,22],[28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],[53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],[18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],[17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],[11,70,13,24,17,22,28,36,15,44],[11,20,32,23,19,19,73,18,38,39,36,47,31],[22,23,15,17,14,14,10,17,32,3],[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],[18,26,22,16,20,12,29,17,18,20,10,14],[17,17,11,16,16,13,13,14],[31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],[19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],[22,22,66,22,22],[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],[21,49,30,37,31,28,28,27,27,21,45,13],[11,23,5,19,15,11,16,14,17,15,12,14,16,9],[20,32,21],[15,16,15,13,27,14,17,14,15],[21],[17,10,10,11],[16,13,12,13,15,16,20],[15,13,19],[17,20,19],[18,15,20],[15,23],[21,13,10,14,11,15,14,23,17,12,17,14,9,21],[14,17,18,6],[25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],[45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],[80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],[51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],[26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],[24,17,18,18,21,18,16,24,15,18,33,21,14],[24,21,29,31,26,18],[23,22,21,32,33,24],[30,30,21,23],[29,23,25,18],[10,20,13,18,28],[12,17,18],[20,15,16,16,25,21],[18,26,17,22],[16,15,15],[25],[14,18,19,16,14,20,28,13,28,39,40,29,25],[27,26,18,17,20],[25,25,22,19,14],[21,22,18],[10,29,24,21,21],[13],[14],[25],[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21]];

const offsets=[];let offset=0;
COUNTS.forEach(arr=>{const row=[];arr.forEach(count=>{row.push(offset);offset+=count});offsets.push(row)});
const versesCache={};
const safe=(s)=>String(s??'');
const read=(key,fallback='')=>{try{return localStorage.getItem(key)||fallback}catch{return fallback}};
const write=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
const fmtToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function make(tag,props={},text){
 const el=document.createElement(tag);Object.entries(props).forEach(([k,v])=>{if(k==='className')el.className=v;else if(k==='style')Object.assign(el.style,v);else el.setAttribute(k,v)});if(text!==undefined)el.textContent=safe(text);return el;
}
function attach(parent,tag,props,text){const n=make(tag,props,text);parent.appendChild(n);return n}
function title(parent,name){attach(parent,'h3',{},name)}
function field(parent,label,type='text',placeholder=''){
 const wrapper=attach(parent,'label',{className:'hb-program-field'});
 attach(wrapper,'span',{},label);
 const control=attach(wrapper,type==='textarea'?'textarea':'input',type==='textarea'?{rows:'4',placeholder}:{type,placeholder});
 return control;
}
function downloadText(name,body){
 const blob=new Blob([body],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);
 const a=make('a',{href:url,download:name});document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
const base=views['resources-4'];
if(base){
 views['resources-6']=base
 .replace('자료실 &nbsp; / &nbsp; 프로그램','자료실 &nbsp; / &nbsp; 순보고서')
 .replace('<h2>프로그램</h2>','<h2>순보고서</h2>')
 .replace(/<div class="boardhead"><span>번호<\/span><span>제목<\/span><span>작성일<\/span><\/div><div class="empty">[\s\S]*?<\/div>/,'<div id="hb-group-report"></div>');
}
async function loadTranslation(version){
 if(versesCache[version])return versesCache[version];
 let verses;
 try{
  const response=await fetch('https://veghdecosrimscedkrdo.supabase.co/functions/v1/habach-bible-source?version='+encodeURIComponent(version),{cache:'force-cache'});
  if(!response.ok)throw Error('Server response '+response.status);
  const data=await response.json();
  verses=data.verses;
 }catch(err){
  // Direct file fallback if the hosting environment does not enable API functions.
  const urls={
    revised:'https://d2ol7oe51mr4n9.cloudfront.net/user_38vbAv9qgw2UH7cP3nl562ZKIOp/0e84bc77-74bf-4bb6-93b1-dd32e408e124.txt',
    modern:'https://d2ol7oe51mr4n9.cloudfront.net/user_38vbAv9qgw2UH7cP3nl562ZKIOp/8fb5c23a-907b-4218-9833-8420af9e1569.txt'
  };
  const response=await fetch(urls[version]);
  if(!response.ok)throw Error('성경 본문 로딩 실패');
  const buffer=await response.arrayBuffer();
  verses=new TextDecoder('euc-kr').decode(buffer).replace(/\r/g,'').split('\n');if(verses.length===31103&&verses[31102]==='')verses.pop();verses=verses.map(x=>x.trim());
 }
 if(!Array.isArray(verses)||verses.length!==31102)throw Error('성경 본문 총 절 수가 일치하지 않습니다.');
 versesCache[version]=verses;return verses;
}
function initBible(){
 const host=document.getElementById('hb-bible-app');if(!host)return;
 host.innerHTML='';host.classList.add('hb-bible-new');
 const state=(()=>{try{return JSON.parse(read('hb-bible-position-v2','{}'))||{}}catch{return {}}})();
 let version=['revised','modern'].includes(state.version)?state.version:'revised';
 let book=Math.min(65,Math.max(0,Number(state.book)||0));
 let chapter=Math.min(COUNTS[book].length,Math.max(1,Number(state.chapter)||1));
 const heading=attach(host,'div',{className:'hb-program-head'});
 title(heading,'말씀을 읽고 한 절씩 필사하기');
 attach(heading,'p',{},'개역개정 · 현대인의 성경 / 총 66권 1,189장. 각 말씀 바로 아래에 필사해 보세요.');

 const modeBar=attach(host,'div',{className:'hb-copy-mode-tabs'});
 const normalMode=attach(modeBar,'button',{type:'button',class:'active','aria-pressed':'true'},'일반 성경필사');
 const mcheyneMode=attach(modeBar,'button',{type:'button','aria-pressed':'false'},'맥체인 성경필사');
 const plan=attach(host,'section',{className:'hb-mcheyne-plan',hidden:'hidden'});
 const planHeader=attach(plan,'div',{className:'hb-mcheyne-header'});
 attach(planHeader,'h3',{},'맥체인 성경읽기표에 따른 필사');
 attach(planHeader,'p',{},'날짜별 네 곳 · 앞의 두 곳 가족과 함께, 뒤의 두 곳 개인 묵상');
 const dateLabel=attach(plan,'label',{className:'hb-mcheyne-date-label'},'날짜 선택');
 const datePicker=attach(dateLabel,'input',{type:'date'});
 const passageGrid=attach(plan,'div',{className:'hb-mcheyne-grid'});
 const planStatus=attach(plan,'p',{className:'hb-mcheyne-status',role:'status'},'맥체인 읽기표를 불러오는 중입니다.');
 let calendar=null;
 const aliases="창 출 레 민 신 수 삿 룻 삼상 삼하 왕상 왕하 대상 대하 스 느 에 욥 시 잠 전 아 사 렘 애 겔 단 호 욜 암 옵 욘 미 나 합 습 학 슥 말 마 막 눅 요 행 롬 고전 고후 갈 엡 빌 골 살전 살후 딤전 딤후 딛 몬 히 약 벧전 벧후 요일 요이 요삼 유 계".split(' ');
 const lookup=aliases.map((v,i)=>({v,i})).sort((a,b)=>b.v.length-a.v.length);
 let currentPlanPassage='';
 function setMode(mode){
  const selected=mode==='mcheyne';
  if(selected)plan.removeAttribute('hidden');else plan.setAttribute('hidden','');
  normalMode.classList.toggle('active',!selected);mcheyneMode.classList.toggle('active',selected);
  normalMode.setAttribute('aria-pressed',String(!selected));mcheyneMode.setAttribute('aria-pressed',String(selected));
  write('hb-bible-copy-mode',selected?'mcheyne':'normal');
  if(selected)renderPlan();
 }
 function parsePassage(raw){
  const clean=String(raw).replace(/\s+/g,'');
  const entry=lookup.find(x=>clean.startsWith(x.v));if(!entry)return null;
  const spec=clean.slice(entry.v.length);
  const m=spec.match(/^(\d+)(?::(\d+))?(?:~(\d+)(?::(\d+))?)?$/);
  if(!m)return null;
  return {book:entry.i,chapter:Number(m[1]),startVerse:m[2]?Number(m[2]):null,endChapter:m[3]?Number(m[3]):Number(m[1]),endVerse:m[4]?Number(m[4]):null,raw};
 }
 function openPlanReference(raw){
  const ref=parsePassage(raw);
  if(!ref){planStatus.textContent='읽기표 구간을 해석할 수 없습니다: '+raw;return;}
  if(ref.chapter<1||ref.chapter>COUNTS[ref.book].length)return;
  currentPlanPassage=raw;
  book=ref.book;chapter=ref.chapter;
  bsel.value=String(book);
  // Existing manual mode remains available even after selecting a reading-plan passage.
  display();
  const caption=ref.endChapter!==ref.chapter?' · '+BOOKS[book]+' '+ref.chapter+'~'+ref.endChapter+'장':'';
  planStatus.textContent='선택한 본문: '+BOOKS[book]+' '+ref.chapter+'장'+caption+(ref.startVerse?' '+ref.startVerse+'절부터':'')+'. 아래에서 한 절씩 필사하세요.';
  const targetEl=host.querySelector('.hb-bible-verse-list');
  if(targetEl)targetEl.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function renderPlan(){
  passageGrid.replaceChildren();
  if(!calendar){planStatus.textContent='읽기표 데이터를 불러오는 중입니다.';return;}
  const key=datePicker.value.slice(5);
  const readings=calendar[key];
  if(!readings){planStatus.textContent='이 날짜에 해당하는 읽기표가 없습니다.';return;}
  planStatus.textContent='원하는 성경 구간을 선택하면 기존 절별 필사 화면으로 이동합니다.';
  readings.forEach((raw,i)=>{
   const tile=attach(passageGrid,'button',{type:'button',className:'hb-mcheyne-reading'});
   attach(tile,'span',{className:'hb-mcheyne-reading-type'},i<2?'가족과 함께':'개인 묵상');
   attach(tile,'strong',{},raw);
   tile.addEventListener('click',()=>openPlanReference(raw));
  });
 }
 const now=new Date();
 const koreanDate=new Date(now.toLocaleString('en-US',{timeZone:'Asia/Seoul'}));
 datePicker.value=koreanDate.getFullYear()+'-'+String(koreanDate.getMonth()+1).padStart(2,'0')+'-'+String(koreanDate.getDate()).padStart(2,'0');
 datePicker.addEventListener('change',renderPlan);
 normalMode.addEventListener('click',()=>setMode('normal'));
 mcheyneMode.addEventListener('click',()=>setMode('mcheyne'));
 fetch('/assets/mcheyne-calendar.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{calendar=data.schedule;renderPlan()}).catch(()=>{planStatus.textContent='읽기표를 불러오지 못했습니다. 다시 새로고침해 주세요.';});
 setMode(read('hb-bible-copy-mode','normal'));
 const sticky=attach(host,'div',{className:'hb-bible-sticky'});
 const toolbar=attach(sticky,'div',{className:'hb-bible-toolbar'});
 const vlabel=attach(toolbar,'label',{},'성경 번역');
 const vsel=attach(vlabel,'select');
 [['revised','개역개정'],['modern','현대인의 성경']].forEach(([value,name])=>{const o=attach(vsel,'option',{value},name);});
 vsel.value=version;
 const blabel=attach(toolbar,'label',{},'성경책');
 const bsel=attach(blabel,'select');BOOKS.forEach((name,i)=>attach(bsel,'option',{value:String(i)},name));
 bsel.value=String(book);
 const clabel=attach(toolbar,'label',{},'장');
 const csel=attach(clabel,'select');
 const action=attach(sticky,'div',{className:'hb-bible-actions'});
 const prev=attach(action,'button',{type:'button'},'‹ 이전 장');
 const status=attach(action,'strong',{},'');
 const next=attach(action,'button',{type:'button'},'다음 장 ›');
 const progress=attach(sticky,'div',{className:'hb-program-progress'});const progressFill=attach(progress,'span');
 const info=attach(host,'p',{className:'hb-bible-message',role:'status'},'말씀을 불러오는 중입니다.');
 const list=attach(host,'div',{className:'hb-bible-verse-list'});
 const shareSection=attach(host,'section',{className:'hb-rank-share'});
 title(shareSection,'성경필사 공유');
 attach(shareSection,'p',{},'한 장의 모든 절을 정확하게 필사한 후 이름과 직분을 기재해 순위에 등록할 수 있습니다. 공개되는 이름은 다른 방문자에게 표시됩니다.');
 const shareName=field(shareSection,'필사자 (이름·직분)','text','예: 김동현 집사');
 shareName.value=read('hb-rank-display-name');
 shareName.addEventListener('change',()=>write('hb-rank-display-name',shareName.value));
 const shareButton=attach(shareSection,'button',{type:'button',class:'hb-rank-submit'},'이 장 필사 완료 공유');
 const shareMessage=attach(shareSection,'p',{role:'status',className:'hb-rank-feedback'},'모든 절을 필사하면 공유할 수 있습니다.');
 const ranking=attach(host,'section',{className:'hb-bible-rankboard'});
 title(ranking,'성경필사 누적 순위');
 const tabs=attach(ranking,'div',{className:'hb-rank-tabs'});
 const rankRows=attach(ranking,'div',{className:'hb-rank-rows'});
 const histories=attach(ranking,'div',{className:'hb-rank-history'});
 const periods=[['all','누적순위'],['month','매달순위'],['week','매주순위'],['day','매일순위']];
 let activePeriod='all',rankingData={};
 const rankingUrl='https://veghdecosrimscedkrdo.supabase.co/functions/v1/habach-bible-ranking';
 function renderRanking(){
  rankRows.replaceChildren();histories.replaceChildren();
  const rows=rankingData.rankings?.[activePeriod]||[];
  const max=Math.max(1,...rows.map(x=>x.verses));
  if(!rows.length){attach(rankRows,'p',{className:'hb-rank-empty'},'아직 등록된 필사 기록이 없습니다. 첫 번째 필사자가 되어 주세요.');return;}
  rows.forEach((x,i)=>{
   const line=attach(rankRows,'div',{className:'hb-rank-line'});
   attach(line,'span',{className:'hb-rank-position'},i+1+'위');
   const mid=attach(line,'div',{className:'hb-rank-middle'});
   attach(mid,'strong',{},x.name);
   const track=attach(mid,'div',{className:'hb-rank-track'});
   const bar=attach(track,'span',{className:'hb-rank-bar'});
   bar.style.setProperty('--rank-width',Math.max(4,x.verses/max*100)+'%');
   attach(line,'span',{className:'hb-rank-count'},x.chapters+'장 · '+x.verses+'절');
  });
  const recent=rankingData.history||[];
  attach(histories,'h4',{},'최근 공유된 필사 기록');
  recent.slice(0,10).forEach(x=>attach(histories,'p',{},x.participant_name+' · '+BOOKS[x.book_index]+' '+x.chapter+'장 · '+x.verse_count+'절 · '+new Date(x.created_at).toLocaleDateString('ko-KR')));
 }
 periods.forEach(([id,name])=>{
  const b=attach(tabs,'button',{type:'button'},name);
  b.addEventListener('click',()=>{activePeriod=id;tabs.querySelectorAll('button').forEach((el,i)=>el.classList.toggle('selected',periods[i][0]===id));renderRanking();});
 });
 tabs.firstElementChild.classList.add('selected');
 async function fetchRanks(){
  try{const r=await fetch(rankingUrl,{cache:'no-store'});if(!r.ok)throw Error(String(r.status));rankingData=await r.json();renderRanking();}
  catch{rankRows.textContent='순위 서버에 연결할 수 없습니다. 새로고침해 주세요.';}
 }
 shareButton.addEventListener('click',async()=>{
  const name=shareName.value.trim();
  if(name.length<2){shareMessage.textContent='필사자 이름과 직분을 입력해 주세요.';shareName.focus();return;}
  if(!currentVerses.length){shareMessage.textContent='말씀을 먼저 불러와 주세요.';return;}
  const writing=[...list.querySelectorAll('textarea')].map(x=>x.value);
  const norm=t=>String(t||'').replace(/\s/g,'');
  if(!writing.every((x,i)=>norm(x)&&norm(x)===norm(currentVerses[i]))){shareMessage.textContent='현재 장의 모든 절을 정확하게 필사해야 공유할 수 있습니다.';return;}
  let id=read('hb-rank-visitor-id');if(!id){id=crypto.randomUUID();write('hb-rank-visitor-id',id);}
  shareButton.disabled=true;shareMessage.textContent='필사 기록을 확인하고 공유하는 중입니다.';
  try{
   const r=await fetch(rankingUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,version,book,chapter,writings:writing,visitorId:id})});
   const result=await r.json();
   if(!r.ok)throw Error(result.error||'등록 오류');
   shareMessage.textContent=BOOKS[book]+' '+chapter+'장 필사 공유가 완료되었습니다. 순위에 반영됩니다.';
   await fetchRanks();
  }catch(e){shareMessage.textContent='공유 실패: '+e.message;}
  finally{shareButton.disabled=false;}
 });
 fetchRanks();
 const bottom=attach(host,'div',{className:'hb-bible-actions'});
 const exportButton=attach(bottom,'button',{type:'button'},'이 장 필사 TXT 저장');
 const topButton=attach(bottom,'button',{type:'button'},'맨 위로 ↑');
 attach(host,'p',{className:'hb-program-caution'},'필사 내용은 이 브라우저에 자동 저장됩니다. 다른 기기와 동기화되지 않으므로 주기적으로 TXT로 보관해 주세요.');
 let currentVerses=[];
 const key=(v)=>'hb-bible-verse-v2:'+version+':'+book+':'+chapter+':'+v;
 function persistPos(){write('hb-bible-position-v2',JSON.stringify({version,book,chapter}));}
 function loadChapters(){csel.replaceChildren();COUNTS[book].forEach((_,i)=>attach(csel,'option',{value:String(i+1)},(i+1)+'장'));csel.value=String(chapter);}
 function completion(){
  const inputs=list.querySelectorAll('textarea');let completed=0;
  inputs.forEach((input,i)=>{
   const actual=(input.value||'').replace(/\s/g,'');const original=(currentVerses[i]||'').replace(/\s/g,'');
   const done=actual.length>0&&actual===original;
   input.closest('.hb-bible-verse').classList.toggle('is-complete',done);
   if(done)completed++;
  });
  const total=inputs.length,pct=total?Math.round(completed/total*100):0;
  status.textContent=BOOKS[book]+' '+chapter+'장 · '+completed+'/'+total+'절 완료';
  progressFill.style.width=pct+'%';
 }
 async function display(){
  persistPos();loadChapters();list.replaceChildren();info.textContent='선택한 장의 말씀을 불러오는 중입니다.';
  const token=version+'-'+book+'-'+chapter;display.last=token;
  try{
   const all=await loadTranslation(version);
   if(display.last!==token)return;
   const start=offsets[book][chapter-1],count=COUNTS[book][chapter-1];
   currentVerses=all.slice(start,start+count);
   currentVerses.forEach((verse,i)=>{
    const v=i+1;
    const item=attach(list,'section',{className:'hb-bible-verse'});
    const header=attach(item,'div',{className:'hb-bible-original'});
    attach(header,'span',{className:'hb-bible-verse-num'},String(v)+'절');
    attach(header,'span',{},verse);
    const ta=attach(item,'textarea',{rows:'2','aria-label':BOOKS[book]+' '+chapter+'장 '+v+'절 필사',placeholder:'이 말씀을 아래에 직접 필사하세요.'});
    ta.value=read(key(v));
    ta.addEventListener('input',()=>{write(key(v),ta.value);completion()});
    ta.addEventListener('keydown',e=>{
     if(e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
     if(e.key!=='ArrowDown'&&e.key!=='ArrowUp'&&e.key!=='Enter')return;
     const text=ta.value;const pos=ta.selectionStart;
     const before=text.slice(0,pos),after=text.slice(ta.selectionEnd);
     // Keep normal text navigation within multiline content; change verse at its boundaries.
     const moveNext=e.key==='Enter'||(e.key==='ArrowDown'&&!after.includes('\n'));
     const movePrevious=e.key==='ArrowUp'&&!before.includes('\n');
     if(!moveNext&&!movePrevious)return;
     const inputs=[...list.querySelectorAll('textarea')];
     const index=inputs.indexOf(ta);const other=inputs[index+(moveNext?1:-1)];
     if(!other){if(e.key==='Enter'&&e.target.value.trim())return;return;}
     e.preventDefault();other.focus();other.setSelectionRange(moveNext?0:other.value.length,moveNext?0:other.value.length);
     other.closest('.hb-bible-verse').scrollIntoView({block:'center',behavior:'smooth'});
    });
   });
   info.textContent=BOOKS[book]+' '+chapter+'장의 말씀 '+count+'절이 표시되었습니다.';
   prev.disabled=book===0&&chapter===1;
   next.disabled=book===65&&chapter===COUNTS[65].length;
   completion();
  }catch(e){info.textContent='성경 원문을 불러올 수 없습니다. 잠시 후 새로고침해 주세요.';status.textContent='연결 확인 필요';}
 }
 vsel.addEventListener('change',()=>{version=vsel.value;display()});
 bsel.addEventListener('change',()=>{book=Number(bsel.value);chapter=1;display()});
 csel.addEventListener('change',()=>{chapter=Number(csel.value);display()});
 prev.addEventListener('click',()=>{if(chapter>1)chapter--;else if(book>0){book--;chapter=COUNTS[book].length;}bsel.value=String(book);display()});
 next.addEventListener('click',()=>{if(chapter<COUNTS[book].length)chapter++;else if(book<65){book++;chapter=1;}bsel.value=String(book);display()});
 exportButton.addEventListener('click',()=>{
  const body=[BOOKS[book]+' '+chapter+'장 ('+vsel.selectedOptions[0].textContent+')','',...currentVerses.map((text,i)=>[i+1+'절 '+text,'필사: '+read(key(i+1)),''].join('\n'))].join('\n');
  downloadText('성경필사_'+BOOKS[book]+'_'+chapter+'장.txt',body);
 });
 topButton.addEventListener('click',()=>host.scrollIntoView({behavior:'smooth',block:'start'}));
 loadChapters();display();
}
function initReport(){
 const host=document.getElementById('hb-group-report');if(!host)return;
 host.innerHTML='';host.className='hb-group-report';
 const top=attach(host,'div',{className:'hb-program-head'});title(top,'순모임 보고서 작성');
 attach(top,'p',{},'모임 일자와 나눔, 기도제목을 기록합니다. 기기에 자동 저장되며 TXT로 내려받을 수 있습니다.');
 const grid=attach(host,'div',{className:'hb-report-grid'});
 const f={
  date:field(grid,'모임 날짜','date'),
  name:field(grid,'순 이름','text','예: 은혜순'),
  leader:field(grid,'순장 / 작성자','text','이름'),
  place:field(grid,'모임 장소','text','장소'),
  count:field(grid,'참석 인원','number','0')
 };
 f.scripture=field(host,'말씀 본문 / 성경 구절','textarea','오늘 함께 나눈 말씀');
 f.sharing=field(host,'나눔 내용','textarea','감사, 간증, 말씀 나눔');
 f.prayer=field(host,'합심기도 및 기도제목','textarea','기도제목 기록');
 f.next=field(host,'다음 모임 계획','textarea','일정과 준비사항');
 const message=attach(host,'p',{className:'hb-bible-message',role:'status'},'자동저장됩니다.');
 const actions=attach(host,'div',{className:'hb-bible-actions'});
 const save=attach(actions,'button',{type:'button'},'보고서 보관');
 const fresh=attach(actions,'button',{type:'button'},'새 보고서');
 const exportBtn=attach(actions,'button',{type:'button'},'TXT 다운로드');
 const listTitle=attach(host,'h3',{},'저장된 순보고서');
 const savedList=attach(host,'div',{className:'hb-report-saved'});
 const draftKey='hb-group-draft-v1',listKey='hb-group-reports-v1';
 const names=Object.keys(f);
 const value=()=>Object.fromEntries(names.map(k=>[k,f[k].value]));
 function setValue(data={}){names.forEach(k=>{f[k].value=safe(data[k]||'')});if(!f.date.value)f.date.value=fmtToday()}
 function persist(){write(draftKey,JSON.stringify(value()))}
 function entries(){try{const v=JSON.parse(read(listKey,'[]'));return Array.isArray(v)?v:[]}catch{return []}}
 function exportOne(record){const lines=['하늘바람교회 순보고서','',...names.map(k=>({date:'모임 날짜',name:'순 이름',leader:'순장 / 작성자',place:'모임 장소',count:'참석 인원',scripture:'말씀',sharing:'나눔',prayer:'기도제목',next:'다음 계획'}[k]+': '+safe(record[k])))];downloadText('순보고서_'+(record.date||'')+'.txt',lines.join('\n\n'))}
 function refresh(){
  savedList.replaceChildren();
  const records=entries();
  if(!records.length){attach(savedList,'p',{},'저장된 보고서가 없습니다.');return}
  records.forEach((record,index)=>{
   const row=attach(savedList,'div',{className:'hb-report-row'});
   const open=attach(row,'button',{type:'button'},(record.date||'날짜 없음')+' · '+(record.name||'순 이름 없음')+' · '+(record.leader||''));
   open.addEventListener('click',()=>{setValue(record);persist();host.scrollIntoView({behavior:'smooth'});message.textContent='선택한 보고서를 불러왔습니다.'});
   const del=attach(row,'button',{type:'button',class:'hb-report-delete'},'삭제');
   del.addEventListener('click',()=>{if(!confirm('이 보고서를 삭제하시겠습니까?'))return;const next=entries();next.splice(index,1);write(listKey,JSON.stringify(next));refresh()});
  });
 }
 try{setValue(JSON.parse(read(draftKey,'{}')))}catch{setValue()}
 names.forEach(k=>f[k].addEventListener('input',persist));
 save.addEventListener('click',()=>{
  const record=value();const records=entries();records.unshift({...record,id:Date.now()});
  if(!write(listKey,JSON.stringify(records.slice(0,100)))){message.textContent='저장 공간이 부족합니다. TXT로 보관해 주세요.';return}
  message.textContent='보고서를 이 기기에 보관했습니다.';refresh();
 });
 fresh.addEventListener('click',()=>{if(!confirm('새 보고서를 작성하시겠습니까? 기존 초안은 변경됩니다.'))return;setValue({});persist();message.textContent='새 보고서 작성을 시작합니다.'});
 exportBtn.addEventListener('click',()=>exportOne(value()));
 refresh();
}
function upgrade(){
 if(location.hash==='#/resources-6'&&!document.getElementById('hb-group-report')&&typeof render==='function')render();
 if(location.hash==='#/resources-5')initBible();
 if(location.hash==='#/resources-6')initReport();
}
window.addEventListener('hashchange',()=>setTimeout(upgrade,0));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade);else upgrade();
})();