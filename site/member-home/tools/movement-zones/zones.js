(function(){
"use strict";
var ZONES=[
{id:"surya-flow",name:"Surya Flow",kind:"Yoga",color:"#E8A33D",bpm:60,root:55,mode:"calm",blurb:"Slow yoga flow with a soft drone and bells. Breathe in, breathe out.",
 plan:[["Settle",120,0],["Sun flow",360,1],["Standing poses",300,1],["Floor poses",300,0],["Rest",180,0]]},
{id:"bala-lab",name:"Bala Lab",kind:"Bodyweight training",color:"#0F85DB",bpm:124,root:49,mode:"beat",blurb:"No kit. Short hard rounds with short rests. The beat gets stronger when work starts.",
 plan:[["Warm up",180,0],["Work 40s",40,2],["Rest 20s",20,0],["Work 40s",40,2],["Rest 20s",20,0],["Work 40s",40,2],["Rest 20s",20,0],["Work 40s",40,2],["Cool down",180,0]]},
{id:"samooh-studio",name:"Samooh Studio",kind:"Group class",color:"#3CC261",bpm:118,root:52,mode:"beat",blurb:"A class for many people at once. One plan, one music line, all moving together.",
 plan:[["Welcome",120,0],["Warm up",300,1],["Main block",900,2],["Cool down",300,0],["Stretch",180,0]]},
{id:"shakti-strength",name:"Shakti Strength",kind:"Strength",color:"#B35A1B",bpm:92,root:44,mode:"beat",blurb:"Heavy, steady music for lifting and holding. Long rests between sets.",
 plan:[["Warm up",240,0],["Set 1",60,2],["Rest",90,0],["Set 2",60,2],["Rest",90,0],["Set 3",60,2],["Rest",90,0],["Stretch",240,0]]},
{id:"layam-dance",name:"Layam Dance Cardio",kind:"Dance cardio",color:"#D6336C",bpm:130,root:57,mode:"beat",blurb:"Fast and happy. Move to the beat, any style, any age.",
 plan:[["Warm up",180,1],["Dance 1",240,2],["Water break",60,0],["Dance 2",240,2],["Cool down",180,0]]},
{id:"shanti-calm",name:"Shanti Calm",kind:"Breath and stretch",color:"#6C5CE7",bpm:50,root:52,mode:"calm",blurb:"Gentle breath work and stretching with a quiet pad. Good for evening.",
 plan:[["Arrive",120,0],["Breath",300,0],["Stretch",360,0],["Rest",240,0]]}
];
var $=function(i){return document.getElementById(i)};
var grid=$("zones"),player=$("player"),cur=null,tracks=[],timer=null,state=null,eng=null;
function fmt(s){s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function total(z){return z.plan.reduce(function(a,p){return a+p[1]},0)}
// ---- sound engine (own sound, made in the browser) ----
function Engine(z){
 var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
 var ctx=new AC(),master=ctx.createGain();master.gain.value=0.7;master.connect(ctx.destination);
 var level=0,step=0,next=0,id=null,vol=0.7;
 var scale=[0,3,5,7,10,12],chord=[0,3,7,10];
 var noise=ctx.createBuffer(1,ctx.sampleRate*0.5,ctx.sampleRate),d=noise.getChannelData(0);
 for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 function hz(n){return 440*Math.pow(2,(n-69)/12)}
 function env(g,t,a,r,peak){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+r)}
 function kick(t,p){var o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);env(g,t,0.005,0.28,p);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.35)}
 function hat(t,p){var s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;f.type="highpass";f.frequency.value=7000;env(g,t,0.002,0.05,p);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+0.1)}
 function tone(t,n,len,type,peak,cut){var o=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();o.type=type;o.frequency.value=hz(n);f.type="lowpass";f.frequency.value=cut;env(g,t,0.02,len,peak);o.connect(f);f.connect(g);g.connect(master);o.start(t);o.stop(t+len+0.1)}
 function tick(){
  var spb=60/z.bpm,s16=spb/4;
  while(next<ctx.currentTime+0.15){
   var t=next,bar=Math.floor(step/16),k=step%16;
   if(z.mode==="calm"){
    if(k===0){tone(t,z.root+12*0+0,spb*6,"sine",0.18,500);tone(t,z.root+7,spb*6,"sine",0.1,500);
     if(level>0&&bar%2===0)tone(t,z.root+24+scale[bar%scale.length],spb*3,"triangle",0.07,2400)}
   }else{
    var p=level===0?0.0:level===1?0.5:1;
    if(level>0&&k%4===0)kick(t,0.9*p+0.1);
    if(level>1&&k%4===2)hat(t,0.12);else if(level>0&&k%2===0)hat(t,0.05);
    if(k%4===0||k===10)tone(t,z.root-12+chord[(bar+(k>>2))%4]*(level>1?1:0),s16*3,"sawtooth",0.14*(level?1:0.5),600+200*level);
    if(k===0)tone(t,z.root+12+chord[bar%4],spb*3.8,"triangle",0.08,1800);
    if(level>1&&(k===6||k===14))tone(t,z.root+24+scale[(bar*2+k)%scale.length],s16*1.5,"square",0.04,2600);
   }
   next+=s16;step++;
  }
 }
 return{
  start:function(){ctx.resume();next=ctx.currentTime+0.05;step=0;id=setInterval(tick,25)},
  setLevel:function(l){level=l},
  setVol:function(v){vol=v;master.gain.setTargetAtTime(v,ctx.currentTime,0.05)},
  stop:function(){clearInterval(id);try{ctx.close()}catch(e){}},
  ctx:ctx
 };
}
// ---- UI ----
function renderZones(){
 grid.innerHTML="";
 ZONES.forEach(function(z){
  var c=document.createElement("article");c.className="zone";c.style.setProperty("--c",z.color);
  var h=document.createElement("h3");h.textContent=z.name;
  var m=document.createElement("div");m.className="meta";m.textContent=z.kind+" · "+Math.round(total(z)/60)+" min · "+z.bpm+" beats per minute";
  var p=document.createElement("p");p.textContent=z.blurb;
  var b=document.createElement("button");b.type="button";b.textContent="Open "+z.name;b.setAttribute("data-zone",z.id);
  b.addEventListener("click",function(){openZone(z)});
  [h,m,p,b].forEach(function(e){c.appendChild(e)});grid.appendChild(c);
 });
}
function openZone(z){
 stop();cur=z;grid.hidden=true;document.querySelector(".hero").hidden=true;player.hidden=false;
 $("p-name").textContent=z.name+" · "+z.kind;$("p-blurb").textContent=z.blurb;
 $("p-phase").textContent="Ready";$("p-time").textContent=fmt(total(z));$("p-bar").style.width="0";
 var pl=$("p-plan");pl.innerHTML="";
 z.plan.forEach(function(p,i){var li=document.createElement("li");li.id="ph"+i;li.textContent=p[0]+" · "+fmt(p[1]);pl.appendChild(li)});
 var sel=$("p-src");sel.innerHTML="";
 var o=document.createElement("option");o.value="engine";o.textContent="Zone sound (our own)";sel.appendChild(o);
 tracks.filter(function(t){return t.status==="cleared"&&t.zones.indexOf(z.id)>-1}).forEach(function(t){
  var op=document.createElement("option");op.value=t.file;op.textContent=t.title;sel.appendChild(op)});
 window.scrollTo(0,0);
}
function closeZone(){stop();player.hidden=true;grid.hidden=false;document.querySelector(".hero").hidden=false;cur=null}
function start(){
 if(!cur)return;stop();
 var src=$("p-src").value,a=$("p-audio");
 if(src==="engine"){eng=Engine(cur);if(eng){eng.setVol($("p-vol").value/100);eng.start()}}
 else{a.src=src;a.volume=$("p-vol").value/100;a.loop=true;var pr=a.play();if(pr&&pr.catch)pr.catch(function(){})}
 state={i:-1,t0:Date.now(),pt:0};$("p-start").disabled=true;$("p-stop").disabled=false;$("p-src").disabled=true;
 timer=setInterval(loop,250);loop();
}
function loop(){
 var z=cur,el=(Date.now()-state.t0)/1000,acc=0,idx=-1,left=0;
 for(var i=0;i<z.plan.length;i++){if(el<acc+z.plan[i][1]){idx=i;left=acc+z.plan[i][1]-el;break}acc+=z.plan[i][1]}
 if(idx<0){$("p-phase").textContent="Well done";$("p-time").textContent="00:00";$("p-bar").style.width="100%";stop(true);return}
 if(idx!==state.i){state.i=idx;if(eng)eng.setLevel(z.plan[idx][2]);
  [].forEach.call(document.querySelectorAll("#p-plan li"),function(l){l.className=""});$("ph"+idx).className="on"}
 $("p-phase").textContent=z.plan[idx][0];$("p-time").textContent=fmt(left);$("p-bar").style.width=(el/total(z)*100)+"%";
}
function stop(done){
 clearInterval(timer);timer=null;if(eng){eng.stop();eng=null}
 var a=$("p-audio");a.pause();
 $("p-start").disabled=false;$("p-stop").disabled=true;$("p-src").disabled=false;
 if(!done&&cur){$("p-phase").textContent="Ready"}
}
$("p-start").addEventListener("click",start);
$("p-stop").addEventListener("click",function(){stop()});
$("p-close").addEventListener("click",closeZone);
$("p-vol").addEventListener("input",function(){var v=this.value/100;if(eng)eng.setVol(v);$("p-audio").volume=v});
renderZones();
fetch("music/tracks.json").then(function(r){return r.json()}).then(function(j){tracks=j.tracks||[]}).catch(function(){});
window.__zones=ZONES;
})();
