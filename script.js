// Question Ball logic: edit BASE to change initial 30 questions.
(()=>{'use strict';
const BASE=[
['fun','살면서 누군가에게 닮았다는 말을 들어본 가장 의외의 연예인, 캐릭터, 동물은?'],
['fun','내가 생각하는 나의 가장 쓸데없는 재능은?'],
['fun','하루 동안 동물로 살아야 한다면 어떤 동물이 되고 싶어?'],
['fun','지금까지 했던 가장 어이없는 실수는?'],
['fun','내 인생에서 가장 황당했던 별명은?'],
['fun','내 인생이 예능 프로그램이라면 제목은 뭐라고 지을래?'],
['fun','만약 갑자기 100억이 생긴다면 가장 먼저 할 일은?'],
['fun','내가 유독 잘 못하는, 남들은 쉽게 하는 일이 있다면?'],
['fun','내 휴대폰에서 가장 많이 사용하는 이모지는?'],
['fun','아무도 이해 못 하지만 나만의 이상한 습관이 있다면?'],
['taste','평생 딱 한 가지 음식만 먹어야 한다면?'],
['taste','아무런 일정도 없는 완벽한 휴일! 나는 어떻게 보낼까?'],
['taste','요즘 내가 가장 소소하게 행복을 느끼는 순간은?'],
['taste','나만 알고 있기 아까운 맛집이나 장소가 있다면?'],
['taste','사람들이 나를 잘 모르고 있는 의외의 취향은?'],
['taste','지금 당장 비행기 표를 준다면 어디로 떠나고 싶어?'],
['taste','어릴 때 가장 좋아했던 만화나 캐릭터는?'],
['taste','최근에 나를 가장 많이 웃게 만든 것은?'],
['taste','내가 절대 포기할 수 없는 사소한 일상 루틴은?'],
['taste','친구들이 나에게 가장 자주 하는 말은?'],
['deep','처음 만난 사람들이 나를 어떻게 생각하는 것 같아? 실제 모습과 다른 점은?'],
['deep','내가 생각하는 나의 가장 큰 매력 포인트는?'],
['deep','친해지고 싶은 사람에게 나는 어떻게 다가가는 편이야?'],
['deep','나는 어떤 순간에 ‘아, 이 사람이랑 친해졌다!’라고 느껴?'],
['deep','어릴 때 꿈꿨던 직업은? 지금과 얼마나 달라졌어?'],
['deep','타임머신을 타고 내 인생의 어느 한 시점으로 돌아갈 수 있다면?'],
['deep','요즘 새롭게 도전해 보고 싶은 일이 있다면?'],
['deep','누군가 나에게 해줬던 말 중 기억에 남는 칭찬은?'],
['deep','나를 기분 좋게 만드는 아주 사소한 행동은?'],
['deep','올해가 끝나기 전에 꼭 해보고 싶은 한 가지는?']
].map((x,i)=>({id:'base-'+(i+1),category:x[0],text:x[1]}));
const STORAGE='question-ball-v1';const $=id=>document.getElementById(id);const cats={all:'🎲 전체 랜덤',fun:'🤣 웃긴 질문',taste:'🍕 취향·일상',deep:'💗 서로 알아가기'};
function load(){try{const s=JSON.parse(localStorage.getItem(STORAGE));if(s&&Array.isArray(s.questions)&&s.questions.length&&Array.isArray(s.history)&&['all','fun','taste','deep'].includes(s.category)){const questions=s.questions.filter(q=>q&&typeof q.id==='string'&&typeof q.text==='string'&&cats[q.category]).map(q=>({...q,text:q.text.slice(0,300)}));if(questions.length)return {questions,history:s.history.filter(h=>h&&typeof h.id==='string'&&cats[h.category]).slice(-200),category:s.category};}}catch(e){}return {questions:BASE.map(q=>({...q})),history:[],category:'all'};}
let state=load(),busy=false,timers=[],countdownId=0,toastTimer;const save=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(e){toast('저장 공간을 사용할 수 없어요.');}};
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600);}
function pool(){return state.questions.filter(q=>state.category==='all'||q.category===state.category)}
function usedIds(){return new Set(state.history.map(h=>h.id))}
function eligible(){const used=usedIds();return pool().filter(q=>!used.has(q.id))}
function currentEntry(){return [...state.history].reverse().find(h=>state.category==='all'||h.category===state.category)}
function renderProgress(){const p=pool(),used=usedIds(),done=p.filter(q=>used.has(q.id)).length;$('progressText').textContent=`${done} / ${p.length}`;$('progressFill').style.width=(p.length?100*done/p.length:0)+'%';document.querySelectorAll('[data-cat]').forEach(b=>{const active=b.dataset.cat===state.category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});const entry=currentEntry();$('undoBtn').disabled=!entry;$('nextBtn').textContent=p.length===0?'질문을 추가해주세요':eligible().length===0?'🎉 완료 화면 보기':'✨ '+(entry?'다음 질문 뽑기':'첫 질문 뽑기');$('nextBtn').disabled=busy||p.length===0;}
function setStage(html){$('stageContent').innerHTML='<div class="fadein">'+html+'</div>'}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderStage(){const p=pool(),entry=currentEntry(),q=entry&&state.questions.find(x=>x.id===entry.id);if(!p.length){setStage('<div class="ball">?</div><div class="eyebrow">NO QUESTIONS</div><h2>아직 질문이 없어요!</h2><p class="sub">질문 편집에서 새 질문을 추가해주세요.</p>');return;}if(!eligible().length&&!q){setStage('<div class="ball">🎉</div><div class="eyebrow">ALL DONE</div><h2>모든 질문 완료! 🥳</h2><p class="sub">서로에 대해 조금 더 알게 되었나요?<br>다시 시작하면 새로운 순서로 즐길 수 있어요.</p>');return;}if(q){const num=state.questions.findIndex(x=>x.id===q.id)+1;setStage(`<div class="eyebrow">QUESTION ${String(num).padStart(2,'0')}</div><h2>${safe(q.text)}</h2><p class="sub" style="margin-top:24px">이야기를 나눴다면 다음 질문으로 넘어가요! ✨</p>`);}else{setStage('<div class="ball">?</div><div class="eyebrow">LET\'S GET TO KNOW EACH OTHER</div><h2>질문을 뽑고,<br>서로를 알아가요! 🎉</h2><p class="sub">버튼을 눌러 질문을 뽑고 자유롭게 답해보세요.<br>이야기를 나눴다면 다음 질문으로 넘어가요!</p>');}}
function finishBusy(){timers.forEach(clearTimeout);timers=[];busy=false;countdownId++;renderProgress();}
function render(){finishBusy();renderStage();renderProgress()}
function next(){if(busy)return;const available=eligible();if(!available.length){setStage('<div class="ball">🎉</div><div class="eyebrow">ALL DONE</div><h2>모든 질문 완료! 🥳</h2><p class="sub">서로에 대해 조금 더 알게 되었나요?<br>다시 시작하면 새로운 순서로 즐길 수 있어요.</p>');return;}const arr=new Uint32Array(1);let idx;if(window.crypto&&crypto.getRandomValues){crypto.getRandomValues(arr);idx=arr[0]%available.length}else idx=Math.floor(Math.random()*available.length);const picked=available[idx];busy=true;renderProgress();let n=3;const token=++countdownId;function step(){if(token!==countdownId)return;if(n>0){$('stageContent').innerHTML=`<div class="eyebrow">READY?</div><div class="stage-countdown" key="${n}">${n}</div><p class="sub">두근두근... 어떤 질문이 나올까?</p>`;n--;timers.push(setTimeout(step,570));}else{state.history.push({id:picked.id,category:picked.category});save();busy=false;renderStage();renderProgress();}}step();}
function undo(){if(busy)return;const ix=state.history.findLastIndex?state.history.findLastIndex(h=>state.category==='all'||h.category===state.category):state.history.map(h=>state.category==='all'||h.category===state.category).lastIndexOf(true);if(ix<0)return;state.history.splice(ix,1);save();render();toast('이전 질문을 뽑기 전으로 돌아갔어요.');}
function restart(){if(busy)return;if(!confirm('현재 '+cats[state.category]+'의 진행 기록을 초기화할까요? 질문 내용은 유지됩니다.'))return;if(state.category==='all')state.history=[];else state.history=state.history.filter(h=>h.category!==state.category);save();render();toast('새 게임이 시작됐어요!');}
function setCategory(cat){if(busy)return;state.category=cat;save();render();}
function editor(){const list=$('questionList');list.replaceChildren();state.questions.forEach((q,i)=>{const row=document.createElement('div');row.className='question-row';const number=document.createElement('span');number.textContent=i+1;const area=document.createElement('textarea');area.value=q.text;area.maxLength=300;area.setAttribute('aria-label',`${i+1}번 질문`);area.addEventListener('input',()=>{q.text=area.value;save();renderProgress()});area.addEventListener('blur',()=>{q.text=q.text.trim()||'새 질문';area.value=q.text;save();renderStage()});const side=document.createElement('div');side.className='question-row-side';const select=document.createElement('select');select.setAttribute('aria-label',`${i+1}번 카테고리`);for(const [key,label] of Object.entries(cats)){if(key==='all')continue;const opt=document.createElement('option');opt.value=key;opt.textContent=label;select.append(opt);}select.value=q.category;select.addEventListener('change',()=>{q.category=select.value;state.history=state.history.map(h=>h.id===q.id?{...h,category:q.category}:h);save();renderProgress();renderStage()});const remove=document.createElement('button');remove.className='remove';remove.textContent='삭제';remove.setAttribute('aria-label',`${i+1}번 질문 삭제`);remove.addEventListener('click',()=>{if(state.questions.length===1){toast('질문은 최소 1개가 필요해요.');return;}state.questions=state.questions.filter(x=>x.id!==q.id);state.history=state.history.filter(h=>h.id!==q.id);save();editor();renderProgress();renderStage()});side.append(select,remove);row.append(number,area,side);list.append(row);});}
function openEditor(){if(busy)return;editor();$('overlay').classList.add('open');document.body.style.overflow='hidden';$('closeEdit').focus();}
function closeEditor(){$('overlay').classList.remove('open');document.body.style.overflow='';render();}
function addQuestion(){const txt=$('newQuestion').value.trim();if(!txt){toast('새 질문을 입력해주세요!');return;}state.questions.push({id:'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),text:txt.slice(0,300),category:$('newCategory').value});$('newQuestion').value='';save();editor();renderProgress();toast('질문을 추가했어요!');$('newQuestion').focus();}
function restore(){if(!confirm('편집한 질문을 모두 지우고 기본 30개 질문으로 복원할까요? 진행 기록도 초기화됩니다.'))return;state.questions=BASE.map(q=>({...q}));state.history=[];save();editor();renderProgress();toast('기본 질문 30개를 복원했어요.');}
async function fullscreen(){try{if(document.fullscreenElement){await document.exitFullscreen();}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();}else{document.body.classList.toggle('presentation');toast('브라우저 전체화면이 지원되지 않아 큰 화면 모드로 전환했어요.');}}catch(e){document.body.classList.toggle('presentation');toast('전체화면 대신 큰 화면 모드로 전환했어요.');}syncFullscreen();}
function syncFullscreen(){const on=!!document.fullscreenElement||document.body.classList.contains('presentation');document.body.classList.toggle('presentation',on);$('fullscreenLabel').textContent=on?'전체화면 종료':'전체화면';}
$('nextBtn').addEventListener('click',next);$('undoBtn').addEventListener('click',undo);$('restartBtn').addEventListener('click',restart);document.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.cat)));$('editBtn').addEventListener('click',openEditor);$('closeEdit').addEventListener('click',closeEditor);$('saveCloseBtn').addEventListener('click',closeEditor);$('overlay').addEventListener('mousedown',e=>{if(e.target===$('overlay'))closeEditor();});$('addQuestion').addEventListener('click',addQuestion);$('restoreBtn').addEventListener('click',restore);$('fullscreenBtn').addEventListener('click',fullscreen);document.addEventListener('fullscreenchange',syncFullscreen);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('overlay').classList.contains('open')){closeEditor();return;}if(e.target.closest('input,textarea,select,button')||e.altKey||e.ctrlKey||e.metaKey||$('overlay').classList.contains('open'))return;if(e.code==='Space'){e.preventDefault();next();}else if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}else if(e.key.toLowerCase()==='e'){e.preventDefault();openEditor();}});
render();
})();
