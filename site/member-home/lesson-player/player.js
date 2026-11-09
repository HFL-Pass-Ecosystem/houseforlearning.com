(function(){'use strict';
var L=window.HFL_LESSON,$=function(s){return document.querySelector(s)},KEY='hfl.lp.'+L.id;
var S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=S||{pos:0,notes:[],marks:[],answers:{},chat:[],tickets:[],circle:[],refl:'',cps:[]};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var cps=L.checkpoints.concat(S.cps).sort(function(a,b){return a.t-b.t});
var t=S.pos,playing=false,rate=1,asking=false,last=Date.now(),vid=null,mode='learn';
function fmt(x){x=Math.floor(x);return Math.floor(x/60)+':'+('0'+x%60).slice(-2)}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
$('#ttl').textContent=L.title;
if(L.src){vid=document.createElement('video');vid.src=L.src;vid.controls=false;$('#stage').innerHTML='';$('#stage').appendChild(vid);vid.currentTime=t}
function dur(){return vid&&vid.duration||L.duration}
function cur(){return vid?vid.currentTime:t}
function seek(x){x=Math.max(0,Math.min(dur(),x));t=x;if(vid)vid.currentTime=x;draw();save2()}
function save2(){S.pos=cur();save()}
function line(){var c=null;L.transcript.forEach(function(r){if(r[0]<=cur())c=r});return c}
function draw(){var p=cur();$('#fill').style.width=(p/dur()*100)+'%';$('#time').textContent=fmt(p)+' / '+fmt(dur());
 var l=line();if(!vid&&!asking)$('#cap').textContent=l?l[1]:'Press play';
 var ch='';L.chapters.forEach(function(c){if(c[0]<=p)ch=c[1]});$('#chap').textContent='Chapter: '+ch;
 document.querySelectorAll('#p-tx .row').forEach(function(r){r.classList.toggle('act',l&&+r.dataset.t===l[0])})}
function markers(){var b=$('#bar');b.querySelectorAll('.mk').forEach(function(m){m.remove()});
 cps.forEach(function(c){var m=document.createElement('i');m.className='mk';m.title='Question at '+fmt(c.t);m.style.left=(c.t/dur()*100)+'%';b.appendChild(m)});
 S.notes.forEach(function(n){var m=document.createElement('i');m.className='mk n';m.style.left=(n.t/dur()*100)+'%';b.appendChild(m)})}
function setPlay(v){playing=v;$('#play').textContent=v?'⏸ Pause':'▶ Play';last=Date.now();if(vid){v?vid.play():vid.pause()}}
function question(c){asking=true;setPlay(false);var st=$('#stage'),d=document.createElement('div');d.className='q';d.id='qbox';
 d.innerHTML='<h3>Pause and think</h3><p><b>'+esc(c.q)+'</b></p>'+c.o.map(function(o,i){return '<button class="opt" data-i="'+i+'">'+esc(o)+'</button>'}).join('')+'<p id="fb"></p><button class="btn" id="cont" hidden>Continue lesson</button>';
 st.appendChild(d);
 d.querySelectorAll('.opt').forEach(function(b){b.onclick=function(){var i=+b.dataset.i,ok=i===c.a;
  S.answers[c.t]={pick:i,ok:ok,at:Date.now()};save();
  d.querySelectorAll('.opt').forEach(function(x){x.disabled=true;if(+x.dataset.i===c.a)x.classList.add('ok')});
  if(!ok)b.classList.add('bad');
  $('#fb').textContent=(ok?'Well done. ':'Not quite. ')+c.why+(ok?'':' You can rewatch this part.');
  $('#cont').hidden=false;if(!ok)$('#fb').insertAdjacentHTML('afterend','<button class="btn o" id="rew">Rewatch this part</button>');
  var r=$('#rew');if(r)r.onclick=function(){d.remove();asking=false;seek(Math.max(0,c.t-20));setPlay(true)};
  $('#cont').onclick=function(){d.remove();asking=false;setPlay(true)};stats()}})}
function tick(){var now=Date.now();if(playing&&!asking){var p=cur();
  if(!vid){t=Math.min(L.duration,t+(now-last)/1000*rate)}
  last=now;var q=cps.filter(function(c){return c.t<=cur()&&c.t>p-1&&!S.answers[c.t]&&!(c._skip)})[0];
  if(q&&cur()>=q.t){if(vid)vid.currentTime=q.t;t=q.t;question(q)}
  else if(cur()>=dur()){setPlay(false);$('#cap').textContent='Lesson complete. Try the task at work.';S.done=true}
  save2()}last=now;draw()}
setInterval(tick,250);
$('#play').onclick=function(){if(cur()>=dur())seek(0);setPlay(!playing)};
$('#back').onclick=function(){seek(cur()-10)};$('#fwd').onclick=function(){seek(cur()+10)};
$('#spd').onchange=function(){rate=+$('#spd').value;if(vid)vid.playbackRate=rate};
$('#bar').onclick=function(e){var r=this.getBoundingClientRect();seek((e.clientX-r.left)/r.width*dur())};
document.addEventListener('keydown',function(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(e.key===' '){e.preventDefault();$('#play').click()}else if(e.key==='ArrowLeft')seek(cur()-10);else if(e.key==='ArrowRight')seek(cur()+10);else if(e.key==='n')$('#note').click()});
// notes and bookmarks
function notes(){var h=S.notes.slice().sort(function(a,b){return a.t-b.t}).map(function(n,i){return '<div class="row" data-t="'+n.t+'"><b>'+fmt(n.t)+'</b> '+esc(n.x)+'</div>'}).join('');
 h+=S.marks.map(function(m){return '<div class="row" data-t="'+m+'">🔖 <b>'+fmt(m)+'</b> bookmark</div>'}).join('');
 $('#nl').innerHTML=h||'<p class="small">No notes yet. Press "Note here" and type. Each note remembers the second.</p>';
 document.querySelectorAll('#nl .row').forEach(function(r){r.onclick=function(){seek(+r.dataset.t)}});markers()}
$('#note').onclick=function(){setPlay(false);tab('notes');var x=prompt('Note at '+fmt(cur())+':');if(x){S.notes.push({t:Math.floor(cur()),x:x});save();notes()}};
$('#mark').onclick=function(){S.marks.push(Math.floor(cur()));save();notes();tab('notes')};
$('#exp').onclick=function(){var x=S.notes.map(function(n){return fmt(n.t)+' '+n.x}).join('\n');try{navigator.clipboard.writeText(x)}catch(e){}$('#exp').textContent='Copied'};
// transcript
$('#p-tx').innerHTML=L.transcript.map(function(r){return '<div class="row" data-t="'+r[0]+'"><b>'+fmt(r[0])+'</b> '+esc(r[1])+'</div>'}).join('');
document.querySelectorAll('#p-tx .row').forEach(function(r){r.onclick=function(){seek(+r.dataset.t)}});
// chat with lesson + handover
function say(c,x,tm){S.chat.push({c:c,x:x,tm:tm});save();chat()}
function chat(){$('#log').innerHTML=S.chat.map(function(m){return '<div class="msg '+m.c+'">'+esc(m.x)+(m.tm!=null?' <a href="#" data-t="'+m.tm+'">▶ '+fmt(m.tm)+'</a>':'')+'</div>'}).join('');
 document.querySelectorAll('#log a').forEach(function(a){a.onclick=function(e){e.preventDefault();seek(+a.dataset.t)}})}
function answer(q){var w=q.toLowerCase().split(/\W+/).filter(function(x){return x.length>2}),best=null,bs=0;
 L.faq.forEach(function(f){var s=0;f[0].split(' ').forEach(function(k){if(w.indexOf(k)>-1)s++});if(s>bs){bs=s;best=f}});return best}
function ask(){var q=$('#q').value.trim();if(!q)return;$('#q').value='';say('me',q);var a=answer(q);
 if(a)say('bot',a[1]+' (from this lesson)',a[2]);else say('bot','I could not find that in this lesson. Press "Talk to a person" and a trainer will reply.')}
$('#ask').onclick=ask;$('#q').onkeydown=function(e){if(e.key==='Enter')ask()};
$('#human').onclick=function(){var last=S.chat.filter(function(m){return m.c==='me'}).pop();
 S.tickets.push({id:'T'+(S.tickets.length+1),at:Math.floor(cur()),q:last?last.x:'(no question typed)',state:'waiting'});save();
 say('hum','A person will reply. Your question is saved with lesson time '+fmt(cur())+'. (Demo: queue shown in Trainer view.)');stats()};
// 70-20-10
$('#mm').innerHTML='<div class="t70"><b>70% Do</b><br>'+esc(L.work70.task)+'</div><div class="t20"><b>20% Share</b><br>Ask your circle or mentor. Open the Circle tab.</div><div class="t10"><b>10% Learn</b><br>This lesson, with questions that pause the video.</div>';
$('#micro').innerHTML=L.micro.map(function(m){return '<p><b>'+esc(m[0])+':</b> '+esc(m[1])+'</p>'}).join('');
$('#wt').textContent=L.work70.task+' '+L.work70.prompt;$('#wr').value=S.refl;
$('#ws').onclick=function(){S.refl=$('#wr').value;save();$('#wm').textContent='Saved. Well done for trying it.'};
function circle(){$('#cl').innerHTML=L.social20.concat(S.circle).map(function(m){return '<div class="msg bot"><b>'+esc(m[0])+'</b><br>'+esc(m[1])+'</div>'}).join('')}
$('#cp').onclick=function(){var x=$('#ct').value.trim();if(x){S.circle.push(['You',x]);$('#ct').value='';save();circle()}};
$('#listen').onclick=function(){var l=line();if('speechSynthesis' in window&&l){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(l[1]))}};
// tabs, modes
function tab(p){document.querySelectorAll('#tabs button').forEach(function(b){b.classList.toggle('on',b.dataset.p===p)});document.querySelectorAll('.pane').forEach(function(x){x.classList.toggle('on',x.id==='p-'+p)})}
document.querySelectorAll('#tabs button').forEach(function(b){b.onclick=function(){tab(b.dataset.p)}});
function stats(){var a=Object.keys(S.answers),ok=a.filter(function(k){return S.answers[k].ok}).length;
 var h='<p class="small">Mode: '+mode+'</p>';
 if(mode==='author')h+='<p><b>Author (AMS):</b> add a pause question at '+fmt(cur())+'.</p><input id="aq" placeholder="Question"><input id="a0" placeholder="Right answer"><input id="a1" placeholder="Wrong answer"><p><button class="btn" id="add">Add pause question here</button></p>';
 else if(mode==='train')h+='<p><b>Trainer (TMS):</b></p><p>Questions answered: '+a.length+', right: '+ok+'</p><p>Waiting for a person:</p>'+(S.tickets.map(function(k){return '<div class="row">'+k.id+' at '+fmt(k.at)+': '+esc(k.q)+' <b>'+k.state+'</b></div>'}).join('')||'<p class="small">None</p>')+(S.tickets.length?'<p><button class="btn" id="rep">Mark first as answered</button></p>':'');
 else h+='<p>Score so far: '+ok+' of '+cps.length+'</p><p class="small">Progress, notes and answers are saved on this device (demo).</p>';
 $('#p-role').innerHTML=h;
 var ad=$('#add');if(ad)ad.onclick=function(){var q=$('#aq').value.trim();if(!q)return;var c={t:Math.floor(cur())+1,q:q,o:[$('#a0').value||'Right',$('#a1').value||'Wrong'],a:0,why:'Added by author (demo).'};S.cps.push(c);cps.push(c);cps.sort(function(a,b){return a.t-b.t});save();markers();$('#add').textContent='Added'};
 var rp=$('#rep');if(rp)rp.onclick=function(){var k=S.tickets.filter(function(x){return x.state==='waiting'})[0];if(k){k.state='answered';save();stats()}}}
document.querySelectorAll('#mode button').forEach(function(b){b.onclick=function(){mode=b.dataset.m;document.querySelectorAll('#mode button').forEach(function(x){x.classList.toggle('on',x===b)});tab('role');stats()}});
chat();notes();circle();stats();markers();draw();
if(!S.chat.length)say('bot','Hello. Ask me anything about this lesson, or press "Talk to a person".');
window.HFLPlayer={seek:seek,state:function(){return S}};
})();
