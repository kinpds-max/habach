(function(){
'use strict';
const QUESTIONS=[["창세기에서 하나님이 창조를 마치고 쉬신 날은?","일곱째 날",["첫째 날","셋째 날","여섯째 날"]],["노아가 홍수를 피하기 위해 만든 것은?","방주",["성막","성전","망대"]],["출애굽을 이끈 지도자는?","모세",["여호수아","사무엘","엘리야"]],["모세가 십계명을 받은 산은?","시내산",["갈멜산","감람산","시온산"]],["여리고 성을 무너뜨린 이스라엘의 지도자는?","여호수아",["기드온","삼손","사울"]],["골리앗과 싸운 인물은?","다윗",["솔로몬","요나단","사무엘"]],["지혜를 구한 이스라엘 왕은?","솔로몬",["사울","아합","여로보암"]],["물고기 뱃속에서 사흘 밤낮을 지낸 선지자는?","요나",["호세아","아모스","하박국"]],["사자 굴에 던져졌던 인물은?","다니엘",["느헤미야","에스라","스룹바벨"]],["예수님이 태어나신 곳은?","베들레헴",["나사렛","가버나움","예루살렘"]],["예수님에게 세례를 베푼 사람은?","세례 요한",["베드로","바울","야고보"]],["예수님의 첫 번째 표적이 기록된 장소는?","가나",["베다니","여리고","나인"]],["예수님을 세 번 부인한 제자는?","베드로",["안드레","빌립","도마"]],["오순절 성령 강림이 기록된 성경책은?","사도행전",["로마서","히브리서","요한계시록"]],["사랑은 오래 참고 사랑은 온유하며라는 말씀이 있는 장은?","고린도전서 13장",["로마서 8장","에베소서 6장","빌립보서 4장"]],["예수님의 부활을 기념하여 예배하는 날은?","주일",["안식일 전날","속죄일","초막절"]],["신약성경에서 가장 먼저 나오는 책은?","마태복음",["마가복음","누가복음","요한복음"]],["탕자의 비유가 기록된 복음서는?","누가복음",["마태복음","마가복음","요한복음"]],["바울과 실라가 감옥에서 기도하고 찬송한 도시는?","빌립보",["고린도","로마","예루살렘"]],["성령의 열매를 설명하는 편지는?","갈라디아서",["빌레몬서","유다서","요한삼서"]]];
const base=views['resources-4'];
if(base){
 views['resources-7']=base.replace('자료실 &nbsp; / &nbsp; 프로그램','자료실 &nbsp; / &nbsp; 성경퀴즈게임').replace('<h2>프로그램</h2>','<h2>성경퀴즈게임</h2>').replace(/<div class="boardhead"><span>번호<\/span><span>제목<\/span><span>작성일<\/span><\/div><div class="empty">[\s\S]*?<\/div>/,'<div id="hb-bible-quiz"></div>');
}
function init(){
if(location.hash!=='#/resources-7')return;
if(!document.getElementById('hb-bible-quiz')&&typeof render==='function')render();
const host=document.getElementById('hb-bible-quiz');if(!host||host.dataset.ready)return;host.dataset.ready='1';
let count=10,current=0,score=0,chosen=[],pool=[];
function elem(type,cls,txt,container){const x=document.createElement(type);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;(container||host).append(x);return x;}
function start(){
 pool=[...QUESTIONS].sort(()=>Math.random()-.5).slice(0,count).map(q=>{const opts=[q[1],...q[2]];for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]];}return {text:q[0],answer:q[1],options:opts}});
 current=0;score=0;chosen=[];render();
}
function render(){
host.replaceChildren();
elem('h3','hb-quiz-heading','성경퀴즈 도전',host);
elem('p','hb-quiz-intro','성경 지식을 게임처럼 즐겨 보세요. 매번 문제가 섞이며 1문제당 10점입니다.',host);
const stat=elem('div','hb-quiz-stat',current>=pool.length?'퀴즈 완료':(current+1)+' / '+pool.length+' 문제  ·  현재 '+score+'점',host);
if(current>=pool.length){
 elem('div','hb-quiz-score',score+' / '+pool.length*10+'점',host);
 elem('p','hb-quiz-result',score===pool.length*10?'축하합니다! 모두 맞혔습니다.':'수고하셨습니다! 다시 도전해 보세요.',host);
 const again=elem('button','hb-quiz-next','다시 도전',host);again.onclick=start;return;
}
const q=pool[current];elem('div','hb-quiz-question',q.text,host);
const list=elem('div','hb-quiz-options',undefined,host);
const msg=elem('p','hb-quiz-feedback','정답 하나를 선택해 주세요.',host);
const next=elem('button','hb-quiz-next','다음 문제 →',host);next.disabled=true;
q.options.forEach((v,i)=>{
const btn=elem('button','hb-quiz-option',String.fromCharCode(65+i)+'. '+v,list);
btn.onclick=()=>{
 if(chosen[current]!==undefined)return;
 const correct=v===q.answer;chosen[current]=v;if(correct)score+=10;
 [...list.children].forEach(el=>{el.disabled=true;if(el.textContent.endsWith(q.answer))el.classList.add('correct');});
 if(!correct)btn.classList.add('wrong');
 msg.textContent=correct?'정답입니다!':'정답: '+q.answer;
 stat.textContent=(current+1)+' / '+pool.length+' 문제  ·  현재 '+score+'점';
 next.disabled=false;
};
});
next.onclick=()=>{current++;render()};
}
start();
}
window.addEventListener('hashchange',()=>setTimeout(init,40));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();