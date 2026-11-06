(function(){
"use strict";
var D=window.BOOST_DATA,KEY="hfl_boost_v1",PKEY="hfl_points",DAY=86400000;
var $=function(id){return document.getElementById(id);};
var INTERVALS=[0,1,2,4,8]; /* days by box 0..4 */
var S=load();
var cur=null,mode=null,answered=false,t0=0;

function blank(){return {vark:null,cards:{},topics:{},points:0,days:{},today:{d:"",n:0},cap:6,recent:[],badges:{}};}
function load(){try{var j=localStorage.getItem(KEY);if(j){var o=JSON.parse(j);var b=blank();for(var k in b){if(!(k in o))o[k]=b[k];}return o;}}catch(e){}return blank();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));localStorage.setItem(PKEY,String(S.points));}catch(e){}}
function dayKey(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild);}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pts(n){S.points+=n;$("xp").textContent="Points: "+S.points;}

/* ---------- Step 1: learning style (VARK) ---------- */
var vi=0,vs={V:0,A:0,R:0,K:0},LET=["V","A","R","K"];
$("v-start").addEventListener("click",function(){vi=0;vs={V:0,A:0,R:0,K:0};$("v-intro").hidden=true;$("v-form").hidden=false;askV();});
function askV(){
  var q=D.vark[vi];$("v-count").textContent="Question "+(vi+1)+" of "+D.vark.length;$("v-q").textContent=q[0];
  var box=$("v-opts");clear(box);
  for(var i=1;i<=4;i++){(function(i){var b=el("button",null,q[i]);b.type="button";b.addEventListener("click",function(){vs[LET[i-1]]++;vi++;if(vi<D.vark.length)askV();else doneV();});box.appendChild(b);})(i);}
  box.firstChild.focus();
}
function doneV(){
  var tot=0,k;for(k in vs)tot+=vs[k];S.vark={};for(k in vs)S.vark[k]=Math.round(vs[k]/tot*100);
  $("v-form").hidden=true;$("v-intro").hidden=false;$("v-start").textContent="Retake";
  badge("style");save();show();
}
function topVark(){
  if(!S.vark)return "R";var best="R",m=-1;["V","A","R","K"].forEach(function(k){if(S.vark[k]>m){m=S.vark[k];best=k;}});return best;
}
var VNAME={V:"seeing it",A:"hearing it",R:"reading it",K:"doing it"};

/* ---------- Memory and weakness ---------- */
function acc(t){var x=S.topics[t]||{seen:0,right:0};return (x.right+1)/(x.seen+2);}
function status(t){var x=S.topics[t]||{seen:0,right:0};if(x.seen<2)return "new";var a=x.right/x.seen;return a>=0.8?"strong":a<0.6?"weak":"mid";}
function cardId(i){return "c"+i;}
function pickTopic(cands){ /* weighted by weakness */
  var w=[],tot=0;cands.forEach(function(t){var x=1+(1-acc(t))*3;w.push(x);tot+=x;});
  var r=Math.random()*tot;for(var i=0;i<cands.length;i++){r-=w[i];if(r<=0)return cands[i];}return cands[0];
}
function dueCards(){var n=Date.now(),o=[];D.cards.forEach(function(c,i){var m=S.cards[cardId(i)];if(m&&m.due<=n)o.push(i);});return o;}
function pick(){
  var n=Date.now(),i,idxs=[];
  if(mode==="float"){
    var due=dueCards();
    if(due.length)return {i:due[Math.floor(Math.random()*due.length)],kind:"review"};
    /* nothing due: replay a gentle calm card, or the strongest known card */
    var calm=[];D.cards.forEach(function(c,i){if(c[0]==="stress")calm.push(i);});
    if(calm.length)return {i:calm[Math.floor(Math.random()*calm.length)],kind:"calm"};
  }
  /* boost: new learning, steered to weak topics */
  var unseenByTopic={};
  D.cards.forEach(function(c,i){if(!S.cards[cardId(i)]){(unseenByTopic[c[0]]=unseenByTopic[c[0]]||[]).push(i);}});
  var topics=Object.keys(unseenByTopic);
  if(topics.length){var t=pickTopic(topics);var l=unseenByTopic[t];return {i:l[Math.floor(Math.random()*l.length)],kind:"new"};}
  var due2=dueCards();
  if(due2.length)return {i:due2[Math.floor(Math.random()*due2.length)],kind:"review"};
  /* everything learned and nothing due: revisit the lowest box */
  var low=0,lb=99;D.cards.forEach(function(c,i){var b=S.cards[cardId(i)].box;if(b<lb){lb=b;low=i;}});
  return {i:low,kind:"review"};
}

/* ---------- Mode: the coach suggests, the learner clicks ---------- */
function suggest(){
  var h=new Date().getHours(),r=S.recent.slice(-3),wrong=r.filter(function(x){return !x;}).length;
  if(r.length>=3&&wrong>=2)return ["float","Your last answers suggest a tired mind. Float mode may feel kinder now."];
  if(h>=21||h<5)return ["float","It is late. Float mode keeps it light. Sleep is also learning."];
  if(h>=5&&h<12)return ["boost","Mornings are often fresh. Boost mode may suit you. You decide."];
  return ["","How is your energy? Tap one. You decide."];
}
function setMode(m){
  mode=m;$("m-boost").setAttribute("aria-pressed",m==="boost"?"true":"false");$("m-float").setAttribute("aria-pressed",m==="float"?"true":"false");
  nextDose();
}
$("m-boost").addEventListener("click",function(){setMode("boost");});
$("m-float").addEventListener("click",function(){setMode("float");});

/* ---------- Daily cap: respect the learner's day ---------- */
function todayN(){var k=dayKey();if(S.today.d!==k){S.today={d:k,n:0};}return S.today.n;}
function capReached(){return todayN()>=S.cap;}
var override=false;

/* ---------- Showing a dose ---------- */
function nextDose(){
  answered=false;
  if(!override&&capReached()){
    $("d-tag").textContent="Done for today";$("d-hook").textContent="Well done. That is enough for today.";
    clear($("d-body"));
    $("d-body").appendChild(el("p","fmt","Rest, work and family time matter too. Your coach will keep your reviews safe. Come back when you like."));
    $("d-quiz").hidden=true;$("d-next").hidden=false;$("d-next").textContent="I want one more";$("d-stop").hidden=true;
    $("cap-note").textContent="You set "+S.cap+" doses a day. You can change this under Settings.";
    return;
  }
  $("cap-note").textContent="Dose "+(todayN()+1)+" of "+S.cap+" today.";
  var p=pick();cur=p;var c=D.cards[p.i];
  var tag=p.kind==="review"?"Quick reminder":p.kind==="calm"?"Gentle moment":"New and short";
  $("d-tag").textContent=tag+" · "+D.topics[c[0]][1];
  $("d-hook").textContent=c[1];
  var body=$("d-body");clear(body);
  var primary=topVark();
  var fm={
    V:function(){var f=el("div","flow");c[3].forEach(function(s,i){if(i)f.appendChild(el("i",null,"→"));f.appendChild(el("span",null,s));});return f;},
    A:function(){var b=el("button","ghost","▶ Listen to this");b.type="button";b.addEventListener("click",function(){speak(c[1]+" "+c[2]);});return b;},
    R:function(){return el("p",null,c[2]);},
    K:function(){return el("p","try","Try it: "+c[4]);}
  };
  var order=[primary].concat(["V","A","R","K"].filter(function(x){return x!==primary;}));
  /* the main text is always there; the preferred format leads */
  body.appendChild(fm[primary]());
  if(primary!=="R")body.appendChild(el("p","fmt",c[2]));
  if(primary!=="K")body.appendChild(el("p","try","Try it: "+c[4]));
  var more=el("details","fmt");more.appendChild(el("summary",null,"Other ways to take this in"));
  order.slice(1).forEach(function(k){if(k==="R"||k==="K")return;more.appendChild(fm[k]());});
  if(more.childNodes.length>1)body.appendChild(more);
  /* question */
  $("d-q").textContent=c[5];$("d-fb").textContent="";
  var opts=$("d-opts");clear(opts);
  shuffle([0,1,2]).forEach(function(oi){var b=el("button",null,c[6][oi]);b.type="button";b.addEventListener("click",function(){answer(oi===0,b);});opts.appendChild(b);});
  $("d-quiz").hidden=false;$("d-next").hidden=true;$("d-stop").hidden=true;t0=Date.now();
}
function speak(t){try{if(!window.speechSynthesis)return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.rate=0.95;window.speechSynthesis.speak(u);}catch(e){}}

function answer(ok,btn){
  if(answered)return;answered=true;
  var c=D.cards[cur.i],id=cardId(cur.i),m=S.cards[id]||{box:0,due:0,seen:0};
  var tp=S.topics[c[0]]||{seen:0,right:0};tp.seen++;if(ok)tp.right++;S.topics[c[0]]=tp;
  m.seen++;
  if(ok){m.box=Math.min(4,m.box+1);}else{m.box=1;}
  m.due=Date.now()+INTERVALS[m.box]*DAY;S.cards[id]=m;
  var gain=ok?(cur.kind==="new"?10:5):2;pts(gain);
  S.recent.push(ok);if(S.recent.length>6)S.recent.shift();
  S.today.n=todayN()+1;S.days[dayKey()]=1;
  var opts=$("d-opts").children;
  for(var i=0;i<opts.length;i++){opts[i].disabled=true;if(opts[i].textContent===c[6][0])opts[i].classList.add("ok");}
  if(!ok&&btn)btn.classList.add("no");
  $("d-fb").textContent=(ok?"Yes. +"+gain+" points. ":"Close. +"+gain+" for trying. ")+c[7]+(ok?"":" We will bring this back soon.");
  checkBadges();save();renderMap();
  $("d-next").textContent="Another dose";$("d-next").hidden=false;$("d-stop").hidden=false;
  if(capReached()&&!override){$("cap-note").textContent="That was your last dose for today. Well done.";}
}
$("d-next").addEventListener("click",function(){
  if(capReached()&&$("d-next").textContent==="I want one more"){override=true;}
  nextDose();
});
$("d-stop").addEventListener("click",function(){
  clear($("d-body"));$("d-tag").textContent="See you soon";$("d-hook").textContent="Good. Go and live your day.";
  $("d-quiz").hidden=true;$("d-next").hidden=true;$("d-stop").hidden=true;$("cap-note").textContent="Your reviews are saved. Come back whenever you like.";
});

/* ---------- Badges ---------- */
var BADGES=[["style","Know my style"],["first","First dose"],["ten","10 right answers"],["three","3 subjects tried"],["turn","Weak to strong"]];
function badge(k){if(!S.badges[k]){S.badges[k]=1;pts(20);}}
function checkBadges(){
  var right=0,seen=0,subj={},t;
  for(t in S.topics){right+=S.topics[t].right;seen+=S.topics[t].seen;if(S.topics[t].seen)subj[D.topics[t][0]]=1;}
  if(seen>=1)badge("first");if(right>=10)badge("ten");if(Object.keys(subj).length>=3)badge("three");
  for(t in S.topics){var x=S.topics[t];if(x.seen>=4&&x.right/x.seen>=0.75&&x.seen-x.right>=1)badge("turn");}
}

/* ---------- Map ---------- */
function rowbar(host,label,pct,cls){
  var r=el("div","rowbar");r.appendChild(el("span",null,label));
  var tr=el("div","track"),i=el("i",cls||"");i.style.width=pct+"%";tr.appendChild(i);r.appendChild(tr);r.appendChild(el("span",null,pct+"%"));host.appendChild(r);
}
function renderMap(){
  var m=$("map");clear(m);
  Object.keys(D.topics).forEach(function(t){
    var x=S.topics[t],st=status(t),label=D.topics[t][1]+(st==="new"?" (new)":"");
    rowbar(m,label,x&&x.seen?Math.round(x.right/x.seen*100):0,st==="weak"?"weak":st==="strong"?"strong":"");
  });
  var v=$("vark");clear(v);
  if(S.vark){[["V","Seeing"],["A","Hearing"],["R","Reading"],["K","Doing"]].forEach(function(p){rowbar(v,p[1],S.vark[p[0]]);});v.appendChild(el("p","hint","Most of your doses lead with "+VNAME[topVark()]+". Other ways are always one tap away."));}
  var b=$("badges");clear(b);BADGES.forEach(function(x){b.appendChild(el("li",S.badges[x[0]]?"on":"",x[1]));});
  $("xp").textContent="Points: "+S.points;
  var days=Object.keys(S.days).length;
  $("c-sub").textContent="You have learned on "+days+(days===1?" day":" days")+". Rest days are healthy and never reset anything.";
}

/* ---------- Page flow ---------- */
function show(){
  var has=!!S.vark;
  $("step-coach").hidden=!has;$("step-map").hidden=!has;
  $("step-vark").hidden=has&&!window.__retake;
  if(has){
    $("c-greet").textContent="How is your energy now?";
    var s=suggest();$("m-hint").textContent=s[1];
    renderMap();
    if(!mode){clear($("d-body"));$("d-tag").textContent="Ready when you are";$("d-hook").textContent="Choose Boost or Float.";$("d-quiz").hidden=true;$("d-next").hidden=true;$("d-stop").hidden=true;$("cap-note").textContent="";}
  }
}
$("cap").addEventListener("change",function(){S.cap=parseInt($("cap").value,10)||6;override=false;save();if(mode)nextDose();});
$("retake").addEventListener("click",function(){window.__retake=true;$("step-vark").hidden=false;$("v-intro").hidden=false;$("v-form").hidden=true;$("step-vark").scrollIntoView();});
$("wipe").addEventListener("click",function(){
  if(!window.confirm("Clear all your coach data from this device?"))return;
  try{localStorage.removeItem(KEY);localStorage.removeItem(PKEY);}catch(e){}
  S=blank();mode=null;window.__retake=false;$("v-start").textContent="Start";show();
});
$("cap").value=String(S.cap);
$("xp").textContent="Points: "+S.points;
show();
})();
