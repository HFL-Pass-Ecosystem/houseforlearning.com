/* Yoga chapter, public copy: members-only lessons are not in this file. Built by hfl-learning/_build/yoga/yoga.py from learning/yoga/public-v1/yoga-chapter.html; do not edit here. */
window.YogaStart=function(){

const $=s=>document.querySelector(s);
/* Build: "preview" uses a simulated sign-in; "public" (the site build) trusts the member zone's session in window.HFL_MEMBER. */
const BUILD="public";
/* Signed-in members: the member zone gives HFL_MEMBER.store (get, set), kept in the member's private area.
   Everyone else: this browser only. */
const MEM=window.HFL_MEMBER||null;
const store=(MEM&&MEM.store&&MEM.store.get&&MEM.store.set)?MEM.store:{get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const css=n=>getComputedStyle(document.getElementById("yoga-app")||document.documentElement).getPropertyValue(n).trim();
const R=d=>d*Math.PI/180, dir=a=>[Math.cos(R(a)),Math.sin(R(a))];
const ease=p=>.5-.5*Math.cos(Math.PI*Math.min(1,Math.max(0,p)));
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Guides */
const GUIDES={
 boy:{label:"Boy",k:.74,hr:7.2,hair:"short",cloth:"#2f7f86",w:.9,f0:220,skin:"#8d5a3b"},
 girl:{label:"Girl",k:.74,hr:7.2,hair:"pony",cloth:"#c47a2c",w:.85,f0:247,skin:"#c68e63"},
 man:{label:"Man",k:1,hr:6.2,hair:"short",cloth:"#3a5f95",w:1.1,f0:110,skin:"#5e3b28"},
 woman:{label:"Woman",k:.96,hr:6,hair:"bun",cloth:"#b0566a",w:.95,f0:196,skin:"#b57d55"},
 salwar:{label:"Woman, salwar kameez",k:.95,hr:6,hair:"pony",cloth:"#e6d3a8",top:"#2f6f6a",tunic:1,w:1,f0:205,skin:"#a8714c"},
 modest:{label:"Woman, modest wear",k:.95,hr:6,hair:"scarf",scarf:"#6a5a8c",cloth:"#3b3f4f",top:"#6a5a8c",tunic:1,w:.95,f0:190,skin:"#e3b892"},
 kurta:{label:"Man, kurta",k:1,hr:6.2,hair:"short",cloth:"#4a4f5a",top:"#efe6d2",tunic:1,w:1.1,f0:115,skin:"#7a4b32"},
 sman:{label:"Senior man",k:.96,hr:6.2,hair:"short",silver:1,cloth:"#5d7d5a",w:1.05,f0:98,skin:"#e0b48f"},
 swoman:{label:"Senior woman",k:.92,hr:6,hair:"bun",silver:1,cloth:"#7a5a8c",w:.95,f0:174,skin:"#9a6444"}
};
let guide=store.get("ss-guide")||"woman"; if(!GUIDES[guide]) guide="woman";

/* Poses: hip [x,y] (ground y=0, facing right), angles in degrees (0 right, 90 down) */
const S={
 pray:{h:[0,-46],t:-90,n:-90,ua:100,fa:-40,tn:90,sn:90,tf:90,sf:90},
 up:{h:[1,-46],t:-102,n:-112,ua:-108,fa:-112,tn:88,sn:92,tf:88,sf:92},
 fold:{h:[-4,-46],t:72,n:88,ua:110,fa:160,tn:85,sn:85,tf:85,sf:85},
 lungeA:{h:[-2,-18],t:-30,n:-55,ua:85,fa:92,tn:-8,sn:90,tf:148,sf:172},
 plank:{h:[-2,-17.5],t:-22,n:-25,ua:90,fa:90,tn:158,sn:158,tf:158,sf:158},
 eight:{h:[-4,-11],t:15,n:-15,ua:-100,fa:95,tn:155,sn:180,tf:155,sf:180},
 cobra:{h:[-4,-6],t:-48,n:-72,ua:92,fa:92,tn:172,sn:180,tf:172,sf:180},
 dog:{h:[-6,-42],t:45,n:60,ua:45,fa:45,tn:112,sn:112,tf:112,sf:112},
 lungeB:{h:[-2,-18],t:-30,n:-55,ua:85,fa:92,tn:148,sn:172,tf:-8,sf:90}
};
const C={
 pray:{h:[-4,-26],t:-90,n:-90,ua:100,fa:-40,tn:3,sn:90,tf:3,sf:90},
 up:{h:[-4,-26],t:-100,n:-106,ua:-105,fa:-110,tn:3,sn:90,tf:3,sf:90},
 fold:{h:[-4,-26],t:-8,n:15,ua:95,fa:95,tn:3,sn:90,tf:3,sf:90},
 kneeA:{h:[-4,-26],t:-85,n:-90,ua:60,fa:-20,tn:-40,sn:60,tf:3,sf:90},
 reach:{h:[-4,-26],t:-90,n:-90,ua:0,fa:0,tn:3,sn:90,tf:3,sf:90},
 curl:{h:[-4,-26],t:-62,n:25,ua:70,fa:60,tn:3,sn:90,tf:3,sf:90},
 open:{h:[-4,-26],t:-100,n:-112,ua:125,fa:110,tn:3,sn:90,tf:3,sf:90},
 lean:{h:[-4,-26],t:-25,n:-15,ua:-5,fa:-5,tn:3,sn:90,tf:3,sf:90},
 kneeB:{h:[-4,-26],t:-85,n:-90,ua:60,fa:-20,tn:3,sn:90,tf:-40,sf:60}
};
const STEPS=[
 {en:"Prayer pose",sa:"Pranamasana",b:"Breathe out",s:"pray",c:"pray",m:"Om Mitraya Namah",d:"ॐ मित्राय नमः",mean:"the friend of all",
  cue:"Stand tall, feet together, palms joined at the chest.",chair:"Sit tall at the front of the chair, palms joined."},
 {en:"Raised arms",sa:"Hasta Uttanasana",b:"Breathe in",s:"up",c:"up",m:"Om Ravaye Namah",d:"ॐ रवये नमः",mean:"the shining one",
  cue:"Stretch both arms up and lean back a little. Keep the hips steady.",chair:"Raise both arms and lift the chest."},
 {en:"Hand to foot",sa:"Hasta Padasana",b:"Breathe out",s:"fold",c:"fold",m:"Om Suryaya Namah",d:"ॐ सूर्याय नमः",mean:"the one who moves",
  cue:"Fold forward from the hips. Bend the knees as much as you need.",chair:"Fold forward over the thighs. Let the arms hang."},
 {en:"Rider pose",sa:"Ashwa Sanchalanasana",b:"Breathe in",s:"lungeA",c:"kneeA",m:"Om Bhanave Namah",d:"ॐ भानवे नमः",mean:"the giver of light",
  cue:"Step the {L} leg far back. Lower the knee if you like. Look up.",chair:"Hug the {R} knee toward the chest."},
 {en:"Plank",sa:"Dandasana",b:"Breathe out",s:"plank",c:"reach",m:"Om Khagaya Namah",d:"ॐ खगाय नमः",mean:"the one who moves in the sky",
  cue:"Step the other leg back. Body in one straight line. Knees down is fine.",chair:"Stretch both arms forward at shoulder height."},
 {en:"Eight-point salute",sa:"Ashtanga Namaskara",b:"Pause, breath out",s:"eight",c:"curl",m:"Om Pushne Namah",d:"ॐ पूष्णे नमः",mean:"the nourisher",
  cue:"Lower knees, chest and chin to the floor. Hips stay a little raised.",chair:"Round the back gently, chin toward the chest."},
 {en:"Cobra",sa:"Bhujangasana",b:"Breathe in",s:"cobra",c:"open",m:"Om Hiranyagarbhaya Namah",d:"ॐ हिरण्यगर्भाय नमः",mean:"the golden source",
  cue:"Slide forward and lift the chest. Elbows soft, shoulders down.",chair:"Hands behind you on the seat. Open the chest."},
 {en:"Mountain",sa:"Parvatasana",b:"Breathe out",s:"dog",c:"lean",m:"Om Marichaye Namah",d:"ॐ मरीचये नमः",mean:"the rays of light",
  cue:"Lift the hips up and back. Heels move toward the floor.",chair:"Lean forward with a long back, arms reaching ahead."},
 {en:"Rider pose",sa:"Ashwa Sanchalanasana",b:"Breathe in",s:"lungeB",c:"kneeB",m:"Om Adityaya Namah",d:"ॐ आदित्याय नमः",mean:"the son of Aditi",
  cue:"Bring the {L} foot forward between the hands. Look up.",chair:"Hug the {L} knee toward the chest."},
 {en:"Hand to foot",sa:"Hasta Padasana",b:"Breathe out",s:"fold",c:"fold",m:"Om Savitre Namah",d:"ॐ सवित्रे नमः",mean:"the one who awakens",
  cue:"Step the back foot forward and fold. Soft knees.",chair:"Fold forward over the thighs."},
 {en:"Raised arms",sa:"Hasta Uttanasana",b:"Breathe in",s:"up",c:"up",m:"Om Arkaya Namah",d:"ॐ अर्काय नमः",mean:"the one worthy of praise",
  cue:"Rise slowly with a long back, arms up.",chair:"Rise slowly and raise the arms."},
 {en:"Prayer pose",sa:"Pranamasana",b:"Breathe out",s:"pray",c:"pray",m:"Om Bhaskaraya Namah",d:"ॐ भास्कराय नमः",mean:"the source of light",
  cue:"Return to standing, palms at the chest. Feel the breath settle.",chair:"Palms at the chest. Sit quietly."}
];

/* Audio: our own drone, bell, and AUM voice tone made live in the browser */
let ac=null, A={};
function audio(){
  if(ac) return ac;
  try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; }
  A.master=ac.createGain(); A.master.gain.value=0; A.master.connect(ac.destination);
  A.lp=ac.createBiquadFilter(); A.lp.type="lowpass"; A.lp.frequency.value=800; A.lp.connect(A.master);
  A.dr=[0,1,2,3,4].map(()=>{ const o=ac.createOscillator(), g=ac.createGain(); g.gain.value=0; o.frequency.value=130.81; o.connect(g); g.connect(A.lp); o.start(); return {o,g}; });
  const l=ac.createOscillator(), lg=ac.createGain(); l.frequency.value=.08; lg.gain.value=150; l.connect(lg); lg.connect(A.lp.frequency); l.start();
  const buf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate), d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  A.noise=ac.createBufferSource(); A.noise.buffer=buf; A.noise.loop=true; A.nf=ac.createBiquadFilter(); A.nf.type="bandpass"; A.nf.frequency.value=500; A.nf.Q.value=.7;
  A.ng=ac.createGain(); A.ng.gain.value=0; A.noise.connect(A.nf); A.nf.connect(A.ng); A.ng.connect(A.lp); A.noise.start();
  A.vSrc=ac.createOscillator(); A.vSrc.type="sawtooth"; A.vSrc.frequency.value=GUIDES[guide].f0;
  const vib=ac.createOscillator(), vg=ac.createGain(); vib.frequency.value=5; vg.gain.value=1.2; vib.connect(vg); vg.connect(A.vSrc.frequency); vib.start();
  A.f1=ac.createBiquadFilter(); A.f1.type="bandpass"; A.f1.Q.value=6; A.f1.frequency.value=700;
  A.f2=ac.createBiquadFilter(); A.f2.type="bandpass"; A.f2.Q.value=8; A.f2.frequency.value=1100;
  A.vGain=ac.createGain(); A.vGain.gain.value=0;
  A.vSrc.connect(A.f1); A.vSrc.connect(A.f2); A.f1.connect(A.vGain); A.f2.connect(A.vGain); A.vGain.connect(ac.destination); A.vSrc.start();
  setStyle();
  return ac;
}
/* Music styles: all made live in the browser from our own code, so every style is ours and royalty-free. Recorded tracks come later. */
const STYLES={
 hindustani:{label:"Indian Hindustani (tanpura and sitar style)",dr:[[65.41,"sine",.35],[98,"triangle",.3],[130.81,"triangle",.45],[131.2,"triangle",.25],[196,"triangle",.15]],scale:[0,2,4,6,7,9,11],tone:"pluck",wind:0},
 carnatic:{label:"Indian Carnatic (veena style)",dr:[[65.41,"sine",.35],[130.81,"triangle",.45],[196,"triangle",.3],[261.63,"sine",.12],[130.5,"triangle",.2]],scale:[0,1,4,5,7,8,11],tone:"gamaka",wind:0},
 western:{label:"Soothing Western (soft pad)",dr:[[130.81,"sine",.3],[164.81,"sine",.22],[196,"sine",.22],[261.63,"sine",.12],[65.41,"sine",.2]],scale:[0,2,4,7,9,12,14],tone:"bell",wind:0},
 piano:{label:"Instrumental (piano)",dr:[[65.41,"sine",.12],[130.81,"sine",.05],[0,"sine",0],[0,"sine",0],[0,"sine",0]],scale:[0,2,4,5,7,9,11],tone:"piano",wind:0},
 eastasian:{label:"East Asian (pentatonic flute style)",dr:[[98,"sine",.2],[146.83,"sine",.12],[0,"sine",0],[0,"sine",0],[0,"sine",0]],scale:[0,2,5,7,9,12,14],tone:"flute",wind:.08},
 arabic:{label:"Middle Eastern (oud style)",dr:[[73.42,"sine",.3],[110,"triangle",.25],[146.83,"triangle",.15],[0,"sine",0],[0,"sine",0]],scale:[0,1,4,5,7,8,10],tone:"pluck",wind:0},
 nature:{label:"Nature calm (wind, no melody)",dr:[[65.41,"sine",.08],[0,"sine",0],[0,"sine",0],[0,"sine",0],[0,"sine",0]],scale:[],tone:"none",wind:.5},
 silent:{label:"Silence (breath cues only)",dr:[[0,"sine",0],[0,"sine",0],[0,"sine",0],[0,"sine",0],[0,"sine",0]],scale:[],tone:"none",wind:0}
};
function setStyle(){ if(!ac) return; const st=STYLES[$("#mstyle").value]||STYLES.hindustani, t=ac.currentTime;
  st.dr.forEach(([f,ty,g],k)=>{ const d=A.dr[k]; if(f){ d.o.type=ty; d.o.frequency.setTargetAtTime(f,t,.2);} d.g.gain.setTargetAtTime(g,t,.5); });
  A.ng.gain.setTargetAtTime(st.wind,t,.5); }
function note(deg){
  if(!ac||!$("#tMusic").checked) return; const st=STYLES[$("#mstyle").value]||STYLES.hindustani; if(!st.scale.length) return;
  const t=ac.currentTime, f=261.63*Math.pow(2,st.scale[deg%st.scale.length]/12), o=ac.createOscillator(), g=ac.createGain(); let dur=2.5;
  if(st.tone==="pluck"){ o.type="sawtooth"; const bp=ac.createBiquadFilter(); bp.type="lowpass"; bp.frequency.setValueAtTime(3000,t); bp.frequency.exponentialRampToValueAtTime(400,t+1.2); o.connect(bp); bp.connect(g); o.frequency.setValueAtTime(f*.97,t); o.frequency.linearRampToValueAtTime(f,t+.12); g.gain.setValueAtTime(.07,t); }
  else if(st.tone==="gamaka"){ o.type="triangle"; const l=ac.createOscillator(), lg=ac.createGain(); l.frequency.value=5.5; lg.gain.value=f*.02; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t+dur); o.frequency.value=f; o.connect(g); g.gain.setValueAtTime(.09,t); }
  else if(st.tone==="piano"){ o.type="triangle"; o.frequency.value=f; o.connect(g); g.gain.setValueAtTime(.12,t); dur=1.8; }
  else if(st.tone==="flute"){ o.type="sine"; o.frequency.value=f*2; o.connect(g); g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.07,t+.3); dur=2.2; }
  else { o.type="sine"; o.frequency.value=f*2; o.connect(g); g.gain.setValueAtTime(.06,t); dur=3.5; }
  g.gain.exponentialRampToValueAtTime(.0005,t+dur); g.connect(ac.destination); o.start(t); o.stop(t+dur+.1);
}
/* Breathing practices: own guides, beginner-safe counts. Holds only in the booklet rhythm, off by default. */
const BR={
 nadi:{name:"Alternate nostril breathing",sa:"Nadi Shodhana",care:"Breathe gently with no holding while learning. Stop if light-headed."},
 sukha:{name:"Easy breath",sa:"Sukha Pranayama",care:"Never force the breath."},
 kapala:{name:"Skull-shining breath",sa:"Kapalabhati",care:"Skip in pregnancy, with high blood pressure, heart disease, hernia, epilepsy, recent abdominal surgery, or during menstruation. Practise on an empty stomach. Stop if dizzy."},
 bhastrika:{name:"Bellows breath",sa:"Bhastrika",care:"Same cautions as Kapalabhati. Keep it slow while learning. Stop if dizzy."},
 shitali:{name:"Cooling breath, tongue",sa:"Shitali",care:"Skip with low blood pressure, asthma, a cold or cough, or in cold weather."},
 shitkari:{name:"Cooling breath, teeth",sa:"Shitkari",care:"Skip with low blood pressure, sensitive teeth, a cold, or in cold weather."},
 sadanta:{name:"Teeth breath",sa:"Sadanta",care:"Skip with sensitive teeth or a cold."},
 bhramari:{name:"Humming bee breath",sa:"Bhramari (Bhramara)",care:"Keep the hum soft. Skip with an ear infection."},
 suryaAV:{name:"Right-nostril breathing",sa:"Surya Anuloma Viloma",care:"In and out through the right nostril only. Breathe gently with no holding. Stop if light-headed."},
 chandraAV:{name:"Left-nostril breathing",sa:"Chandra Anuloma Viloma",care:"In and out through the left nostril only. Breathe gently with no holding. Stop if light-headed."},
 suryaBh:{name:"In right, out left",sa:"Surya Bhedana",care:"Skip with high blood pressure or a heart condition, and on hot days. Breathe gently. Stop if light-headed."},
 chandraBh:{name:"In left, out right",sa:"Chandra Bhedana",care:"Skip with low blood pressure, a cold or low mood. Breathe gently. Stop if light-headed."},
 booklet:{name:"Five breaths a minute",sa:"Booklet rhythm: out 5, hold 2, in 3, hold 2",care:"Holds are optional and off unless you tick them. Skip the holds if you are pregnant, or have high or low blood pressure, a heart condition or eye pressure (glaucoma). Never strain; if you feel short of air, breathe normally."}
};
const HAND_NOTE="Hand position (Nasika mudra): rest the index and middle fingers between the eyebrows. The thumb closes the right nostril, the ring finger closes the left. In tradition the right side is the sun side (Surya) and the left the moon side (Chandra).";
function buildBreath(n){
  const b=$("#bsel").value, R=(k,arr)=>{ for(let r=0;r<k;r++) arr.forEach(([ph,dur])=>sched.push({ph,r,dur})); };
  const slow=level()!=="steady";
  if(b==="nadi"){ const out=slow?4:6; R(Math.max(4,n+2),[["inL",4],["outR",out],["inR",4],["outL",out]]); }
  else if(b==="sukha") R(n+4,[["in",4],["out",slow?4:6]]);
  else if(b==="kapala"){ const k=Math.min(5,Math.max(2,Math.ceil(n/2))); for(let r=0;r<k;r++){ for(let j=0;j<(slow?15:25);j++) sched.push({ph:"pump",r,dur:slow?1:.7}); sched.push({ph:"rest",r,dur:15}); } }
  else if(b==="bhastrika"){ const k=Math.min(5,Math.max(2,Math.ceil(n/2))); for(let r=0;r<k;r++){ for(let j=0;j<10;j++) sched.push({ph:"in",r,dur:slow?1.5:1},{ph:"out",r,dur:slow?1.5:1}); sched.push({ph:"rest",r,dur:15}); } }
  else if(b==="bhramari") R(Math.max(3,n+1),[["in",4],["hum",8]]);
  else if(b==="suryaAV") R(n+4,[["inR",4],["outR",slow?4:6]]);
  else if(b==="chandraAV") R(n+4,[["inL",4],["outL",slow?4:6]]);
  else if(b==="suryaBh") R(n+4,[["inR",4],["outL",slow?4:6]]);
  else if(b==="chandraBh") R(n+4,[["inL",4],["outR",slow?4:6]]);
  else if(b==="booklet") R(n+4,$("#tHolds").checked?[["out",5],["holdOut",2],["in",3],["holdIn",2]]:[["out",5],["in",3]]);
  else R(n+4,[["inMouth",4],["out",6]]);
}
const BCUE={
 inL:["Breathe in, left","Close the right nostril with the thumb."],outR:["Breathe out, right","Close the left with the ring finger. Open the right."],
 inR:["Breathe in, right","Keep the left closed."],outL:["Breathe out, left","Close the right. Open the left."],
 in:["Breathe in","Slowly through the nose. Let the belly rise."],out:["Breathe out","Slowly through the nose. Let the belly fall."],
 pump:["Out!","A short, soft push of the belly. The in-breath happens by itself."],rest:["Rest","Breathe naturally and notice how you feel."],
 hum:["Hum out","Close the lips and hum softly like a bee. Feel the buzz in the head."],
 holdOut:["Pause, empty","Stay relaxed with the lungs empty. Breathe in early if it feels hard."],
 holdIn:["Pause, full","Lungs comfortably full, shoulders soft. Breathe out early if it feels hard."]
};
function breathCue(ph){
  const b=$("#bsel").value;
  if(ph==="inMouth") return b==="shitali"?["Breathe in through the tongue","Roll the tongue into a tube and sip the air in."]:b==="shitkari"?["Breathe in through the teeth","Teeth together, lips apart, sip the air in with a soft hiss."]:["Breathe in through the teeth","Teeth gently closed, draw the air in slowly."];
  if(ph==="out"&&/shit|sadanta/.test(b)) return ["Breathe out through the nose","Close the mouth and breathe out slowly."];
  if(b==="suryaAV") return ph==="inR"?["Breathe in, right","Ring finger closes the left nostril and keeps it closed."]:["Breathe out, right","Left stays closed. Breathe out slowly through the right."];
  if(b==="chandraAV") return ph==="inL"?["Breathe in, left","Thumb closes the right nostril and keeps it closed."]:["Breathe out, left","Right stays closed. Breathe out slowly through the left."];
  return BCUE[ph]||BCUE.in;
}
function musicLevel(inhale,secs){
  if(!ac) return; const t=ac.currentTime, on=$("#tMusic").checked;
  A.master.gain.cancelScheduledValues(t); A.master.gain.setValueAtTime(A.master.gain.value,t);
  A.master.gain.linearRampToValueAtTime(on?(inhale?.2:.11):0,t+Math.max(.3,secs*.9));
  A.lp.frequency.setTargetAtTime(inhale?1500:700,t,secs/3);
}
function bell(){
  if(!ac||!$("#tMusic").checked) return; const t=ac.currentTime;
  [[528,.14],[792,.06],[1056,.03]].forEach(([f,g])=>{const o=ac.createOscillator(),gn=ac.createGain(); o.frequency.value=f;
    gn.gain.setValueAtTime(g,t); gn.gain.exponentialRampToValueAtTime(.0005,t+2.6); o.connect(gn); gn.connect(ac.destination); o.start(t); o.stop(t+2.7);});
}
const VOW={A:[750,1150,.5],U:[340,800,.5],M:[240,480,.35],off:[300,600,0]};
function vowel(v,secs){
  if(!ac) return; const t=ac.currentTime, [a,b,g]=VOW[v];
  A.vSrc.frequency.setTargetAtTime(GUIDES[guide].f0,t,.05);
  A.f1.frequency.setTargetAtTime(a,t,.15); A.f2.frequency.setTargetAtTime(b,t,.15);
  A.vGain.gain.cancelScheduledValues(t); A.vGain.gain.setValueAtTime(A.vGain.gain.value,t);
  A.vGain.gain.linearRampToValueAtTime(g*1.6,t+.35);
  if(v==="M") A.vGain.gain.linearRampToValueAtTime(0,t+secs);
}
function say(text,lang){
  try{ const u=new SpeechSynthesisUtterance(text); u.rate=.85; u.lang=lang||"en-IN"; speechSynthesis.speak(u);}catch(e){}
}
function hush(){ try{speechSynthesis.cancel()}catch(e){} if(ac){ const t=ac.currentTime; A.vGain.gain.cancelScheduledValues(t); A.vGain.gain.setTargetAtTime(0,t,.1); A.master.gain.cancelScheduledValues(t); A.master.gain.setTargetAtTime(0,t,.3);} }

/* Practice state */
const STAGEPH0={pray:1,up:1,fold:1,plank:1,cobra:1};
const VIS=()=>STEPS.map((x,i)=>i).filter(i=>STAGEPH0[STEPS[i].s]);
let practice="surya", sched=[], elapsed=0, running=false, last=0, segIdx=-1, previewIdx=0, done=false;
const level=()=>$("#level").value;
function breathSec(){ return level()==="steady"?4:6; }
function build(){
  const n=+$("#rounds").value; sched=[];
  if(practice==="surya"){
    for(let r=0;r<n;r++){ VIS().forEach(i=>sched.push({i,r,dur:breathSec()*(i===5?.8:1)})); if(r<n-1) sched.push({rest:1,r,dur:6}); }
  } else if(practice==="aum"){
    const k=Math.max(3,Math.min(9,n+1));
    for(let r=0;r<k;r++){ sched.push({ph:"in",r,dur:4},{ph:"A",r,dur:3},{ph:"U",r,dur:3},{ph:"M",r,dur:5}); }
  } else if(practice==="nadi"){ buildBreath(n); }
}
const total=()=>sched.reduce((a,s)=>a+s.dur,0);
function at(t){ let acc=0; for(let k=0;k<sched.length;k++){ if(t<acc+sched[k].dur) return {k,p:(t-acc)/sched[k].dur}; acc+=sched[k].dur; } return {k:sched.length-1,p:1}; }
function rounds(){ return practice==="surya"? +$("#rounds").value : (sched.length? sched[sched.length-1].r+1 : 0); }

function onSeg(k){
  const s=sched[k]; if(!s) return;
  const cues=$("#tCues").checked, man=$("#tMantra").checked;
  try{speechSynthesis.cancel()}catch(e){}
  if(practice==="surya"){
    if(s.rest){ musicLevel(false,s.dur); if(cues) say("Rest. Round "+(s.r+2)+" next."); return; }
    const st=STEPS[s.i]; note(s.i); musicLevel(/in/.test(st.b),s.dur);
    if(cues) say(st.b+". "+st.en);
    if(man) say(st.d,"hi-IN");
  } else if(practice==="aum"){
    if(s.ph==="in"){ musicLevel(true,s.dur); if(cues&&s.r===0) say("Breathe in deeply."); vowel("off",.2); A.vGain&&A.vGain.gain.setTargetAtTime(0,ac.currentTime,.1); }
    else { musicLevel(false,s.dur); vowel(s.ph,s.dur); }
  } else {
    const ph=s.ph, prev=sched[k-1], first=!prev||prev.ph!==ph;
    if(ph==="pump"){ if(first&&cues) say("Short, soft pushes out."); musicLevel(false,.3); return; }
    musicLevel(/^in/.test(ph),s.dur);
    if(/^in/.test(ph)) note(s.r);
    if(ph==="hum") vowel("M",s.dur);
    if(cues&&first&&(s.r===0||ph==="rest")){ const c=breathCue(ph); say(c[0]+". "+c[1]); }
  }
}

/* Drawing */
const cv=$("#cv"), ctx=cv.getContext("2d");
function sizeCanvas(c){ const r=c.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1); c.width=Math.round(r.width*d); c.height=Math.round(r.height*d); }
function seg(c,a,b,w,col){ c.strokeStyle=col; c.lineWidth=w; c.lineCap="round"; c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.stroke(); }
const add=(p,a,l)=>{const d=dir(a); return [p[0]+d[0]*l,p[1]+d[1]*l];};
function shade(hex,f){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=(n>>8)&255,b=n&255; r=Math.round(r*f);g=Math.round(g*f);b=Math.round(b*f); return `rgb(${r},${g},${b})`; }
function drawChair(c,col){ c.strokeStyle=col; c.lineWidth=2.2; c.lineCap="round"; c.beginPath();
  c.moveTo(-16,-23.5); c.lineTo(10,-23.5); c.moveTo(-15,-23.5); c.lineTo(-17,-62); c.moveTo(-15,-23.5); c.lineTo(-15,0); c.moveTo(9,-23.5); c.lineTo(9,0); c.stroke(); }
let skinPick=null;
function figure(c,P,g){
  const L={torso:30,ua:15,fa:14,th:23,sh:23}, skin=skinPick||g.skin||"#b57d55", cl=g.cloth, far=shade(cl,.72), hairCol=g.silver?"#c9c9c4":"#2b211c", top=g.top||cl, farTop=shade(top,.72);
  const hip=P.h, sh=add(hip,P.t,L.torso);
  const kN=add(hip,P.tn,L.th), fN=add(kN,P.sn,L.sh), kF=add(hip,P.tf,L.th), fF=add(kF,P.sf,L.sh);
  const el=add(sh,P.ua,L.ua), hd=add(el,P.fa,L.fa);
  const w=g.w;
  // far leg and arm
  seg(c,hip,kF,7.4*w,far); seg(c,kF,fF,6*w,far); seg(c,fF,add(fF,P.sf-90,5),3.2,shade(skin,.8));
  const el2=add(sh,P.ua2??P.ua,L.ua), hd2=add(el2,P.fa2??P.fa,L.fa);
  seg(c,[sh[0]-1.2,sh[1]],[el2[0]-1.2,el2[1]],4.6*w,farTop); seg(c,[el2[0]-1.2,el2[1]],[hd2[0]-1.2,hd2[1]],4*w,farTop);
  if(g.tunic) seg(c,hip,add(hip,P.tf,L.th*.5),9.4*w,farTop);
  // torso
  seg(c,hip,sh,11*w,top); c.fillStyle=top; c.beginPath(); c.arc(hip[0],hip[1],5.6*w,0,7); c.fill();
  // near leg
  seg(c,hip,kN,7.4*w,cl); seg(c,kN,fN,6*w,cl); seg(c,fN,add(fN,P.sn-90,5),3.2,skin);
  if(g.tunic) seg(c,hip,add(hip,P.tn,L.th*.5),9.4*w,top);
  // neck and head
  const hr=g.hr, hc=add(sh,P.n,3.5+hr);
  seg(c,sh,add(sh,P.n,4),3.4,skin);
  c.fillStyle=g.scarf||hairCol; c.beginPath(); const hb=add(hc,P.n-45,.9); c.arc(hb[0],hb[1],g.scarf?hr*1.22:hr,0,7); c.fill();
  if(g.scarf) seg(c,hb,add(sh,P.t+180,2),hr*1.1,g.scarf);
  if(g.hair==="bun"){ const b=add(hc,P.n-80,hr+1.2); c.beginPath(); c.arc(b[0],b[1],hr*.45,0,7); c.fill(); }
  if(g.hair==="pony"){ const b=add(hc,P.n-105,hr+1.5), b2=add(hc,P.n-125,hr+4.5); c.beginPath(); c.arc(b[0],b[1],hr*.38,0,7); c.arc(b2[0],b2[1],hr*.3,0,7); c.fill(); }
  c.fillStyle=skin; const fc=add(hc,P.n+135,.9); c.beginPath(); c.arc(fc[0],fc[1],hr*.92,0,7); c.fill();
  const eye=add(add(hc,P.n+90,hr*.55),P.n,hr*.12); c.fillStyle="#2b211c"; c.beginPath(); c.arc(eye[0],eye[1],.7,0,7); c.fill();
  // near arm and hand
  seg(c,sh,el,4.6*w,top); seg(c,el,hd,4*w,top); c.fillStyle=skin; c.beginPath(); c.arc(hd[0],hd[1],2.2,0,7); c.fill();
}
function lerpPose(a,b,p){ const o={h:[a.h[0]+(b.h[0]-a.h[0])*p,a.h[1]+(b.h[1]-a.h[1])*p]};
  for(const k of ["t","n","ua","fa","tn","sn","tf","sf","ua2","fa2"]){ const f=k==="ua2"?"ua":k==="fa2"?"fa":k, x=a[k]??a[f], y=b[k]??b[f]; let d=((y-x+540)%360)-180; o[k]=x+d*p; } return o; }
function scene(c,W,H,drawFn,{sky=true}={}){
  c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,W,H);
  const gr=c.createLinearGradient(0,0,0,H); gr.addColorStop(0,css("--sky1")); gr.addColorStop(1,css("--sky2")); c.fillStyle=gr; c.fillRect(0,0,W,H);
  if(sky){ c.fillStyle=css("--sun"); c.globalAlpha=.35; c.beginPath(); c.arc(W*.8,H*.86,H*.22,Math.PI,0); c.fill(); c.globalAlpha=1;
    c.fillStyle=css("--ground"); c.fillRect(0,H*.86,W,H*.14); }
  drawFn();
}
function worldTx(c,W,H,g){ const s=Math.min(W/130,H*.86/108); c.setTransform(s,0,0,s,W*.53,H*.86); c.scale(g.k,g.k); }
function surPose(i){ return (level()==="chair"?C:S)[level()==="chair"?STEPS[i].c:STEPS[i].s]; }

function drawSurya(){
  const W=cv.width,H=cv.height,g=GUIDES[guide];
  let i=previewIdx, prev=i, p=1, s=null, ph=0;
  if(sched.length && (running||elapsed>0) && !done){ const a=at(elapsed); s=sched[a.k]; ph=a.p;
    if(s.rest){ i=11; prev=11; } else { i=s.i; const pk=a.k-1; prev = pk>=0 && !sched[pk].rest ? sched[pk].i : (i===0?11:i-1); p=reduce?1:ease(ph/.45); } }
  scene(ctx,W,H,()=>{
    worldTx(ctx,W,H,g);
    if(level()==="chair") drawChair(ctx,css("--muted"));
    figure(ctx,lerpPose(surPose(prev),surPose(i),p),g);
  });
  // breath ring
  ctx.setTransform(1,0,0,1,0,0);
  const st=STEPS[i], inh=/in/.test(st.b)&&!(s&&s.rest), held=/Pause/.test(st.b);
  const rr=H*.06*(running? (held?1:(inh?.6+.6*ph:1.2-.6*ph)) : .9);
  ctx.strokeStyle=css("--acc"); ctx.lineWidth=Math.max(2,H*.006); ctx.beginPath(); ctx.arc(W*.1,H*.14,Math.max(4,rr),0,7); ctx.stroke();
  ctx.fillStyle=css("--ink"); ctx.font=`${Math.round(H*.035)}px "IBM Plex Mono",monospace`; ctx.textAlign="center";
  ctx.fillText(s&&s.rest?"Rest":(held?"Pause":(inh?"In":"Out")),W*.1,H*.14+H*.012);
}
function drawAum(){
  const W=cv.width,H=cv.height; let s=null,ph=0; if(sched.length&&(running||elapsed>0)&&!done){const a=at(elapsed); s=sched[a.k]; ph=a.p;}
  const cur=s?s.ph:"";
  scene(ctx,W,H,()=>{
    const sc=H/120; ctx.setTransform(sc,0,0,sc,W*.3,H*.06);
    const body=css("--soft"), glow=css("--glow");
    const zone=(y,r,on)=>{ if(!on) return; const a=.55+.45*Math.sin(ph*Math.PI); const gr=ctx.createRadialGradient(0,y,1,0,y,r); gr.addColorStop(0,glow); gr.addColorStop(1,"rgba(0,0,0,0)"); ctx.globalAlpha=a; ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(0,y,r,0,7); ctx.fill(); ctx.globalAlpha=1; };
    // body front view
    ctx.fillStyle=body; ctx.strokeStyle=body; ctx.lineCap="round";
    ctx.beginPath(); ctx.arc(0,10,8,0,7); ctx.fill();
    seg(ctx,[0,18],[0,22],5,body);
    ctx.beginPath(); ctx.moveTo(-13,23); ctx.lineTo(13,23); ctx.lineTo(10,58); ctx.lineTo(-10,58); ctx.closePath(); ctx.fill();
    seg(ctx,[-13,25],[-18,55],5,body); seg(ctx,[13,25],[18,55],5,body);
    seg(ctx,[-6,58],[-7,105],8,body); seg(ctx,[6,58],[7,105],8,body);
    zone(70,30,cur==="A"); zone(36,24,cur==="U"); zone(10,16,cur==="M");
    ctx.fillStyle=css("--ink"); ctx.textAlign="left"; ctx.font=`600 10px "Literata",serif`;
    [["M",13,"head: hum mm"],["U",40,"chest: oo"],["A",76,"belly, legs: aa"]].forEach(([l,y,t])=>{
      ctx.globalAlpha=cur===l?1:.45; ctx.fillText(l,30,y); ctx.font=`5px "IBM Plex Mono",monospace`; ctx.fillText(t,40,y-1); ctx.font=`600 10px "Literata",serif`; });
    ctx.globalAlpha=1;
  },{sky:false});
}
function drawNadi(){
  const W=cv.width,H=cv.height; let s=null,ph=0; if(sched.length&&(running||elapsed>0)&&!done){const a=at(elapsed); s=sched[a.k]; ph=a.p;}
  scene(ctx,W,H,()=>{
    const sc=H/100; ctx.setTransform(sc,0,0,sc,W/2,H*.5);
    const ink=css("--ink"), soft=css("--soft"), acc=css("--acc"), hl=css("--hl");
    ctx.fillStyle=soft; ctx.beginPath(); ctx.ellipse(0,0,26,32,0,0,7); ctx.fill();
    ctx.strokeStyle=ink; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(-10,-6,4,.2,Math.PI-.2); ctx.stroke(); ctx.beginPath(); ctx.arc(10,-6,4,.2,Math.PI-.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-4); ctx.lineTo(-3,9); ctx.quadraticCurveTo(0,12,3,9); ctx.stroke();
    ctx.beginPath(); ctx.arc(0,20,5,.3,Math.PI-.3); ctx.stroke();
    // viewer's left on screen is the person's right side
    const left=[3.5,10.5], right=[-3.5,10.5];
    ctx.fillStyle=ink; [left,right].forEach(n=>{ctx.beginPath(); ctx.arc(n[0],n[1],1.3,0,7); ctx.fill();});
    if(s&&!/[LR]$/.test(s.ph)){
      const p2=s.ph, inh=p2==="in"||p2==="inMouth", src=p2==="inMouth"?[0,20]:[0,10.5];
      ctx.fillStyle=acc; ctx.strokeStyle=acc;
      if(p2==="hum"){ for(let k=0;k<3;k++){ ctx.globalAlpha=.6*(1-((ph+k/3)%1)); ctx.lineWidth=1; ctx.beginPath(); ctx.arc(0,0,30+((ph+k/3)%1)*14,0,7); ctx.stroke(); } }
      else if(p2!=="rest"&&!/^hold/.test(p2)){ const q0=p2==="pump"?ph*1.8:ph;
        for(let k=0;k<5;k++){ let q=(q0+k/5)%1; if(!inh) q=1-q; const y=src[1]+16-q*30; ctx.globalAlpha=.25+.6*(1-Math.abs(.5-q)); ctx.beginPath(); ctx.arc(Math.sin(q*6+k)*3,y,1.8,0,7); ctx.fill(); } }
      ctx.globalAlpha=1; ctx.fillStyle=ink; ctx.font=`5px "IBM Plex Mono",monospace`; ctx.textAlign="center";
      const cnt=Math.ceil((1-ph)*s.dur); ctx.fillText({rest:"REST ",hum:"HUM ",pump:"OUT ",in:"IN ",inMouth:"IN ",out:"OUT ",holdIn:"PAUSE ",holdOut:"PAUSE "}[p2]+(p2==="pump"?"":cnt),0,44);
    }
    if(s&&/[LR]$/.test(s.ph)){
      const ph2=s.ph, side=ph2.endsWith("L")?left:right, closed=ph2.endsWith("L")?right:left, inh=ph2.startsWith("in");
      // closing finger
      ctx.fillStyle=hl; ctx.globalAlpha=.85; ctx.beginPath(); ctx.ellipse(closed[0]+(closed===left?5:-5),closed[1]-1,3.4,7,0,0,7); ctx.fill(); ctx.globalAlpha=1;
      // flowing dots
      ctx.fillStyle=acc;
      for(let k=0;k<5;k++){ let q=(ph+k/5)%1; if(!inh) q=1-q; const y=side[1]+12-q*40, x=side[0]+(side===left?1:-1)*Math.sin(q*3)*2;
        ctx.globalAlpha=.25+.6*(1-Math.abs(.5-q)); ctx.beginPath(); ctx.arc(x,y,1.8,0,7); ctx.fill(); }
      ctx.globalAlpha=1;
      ctx.fillStyle=ink; ctx.font=`5px "IBM Plex Mono",monospace`; ctx.textAlign="center";
      const cnt=Math.ceil((1-ph)*s.dur); ctx.fillText((inh?"IN ":"OUT ")+cnt,0,44);
    }
    ctx.font=`4.5px "IBM Plex Mono",monospace`; ctx.fillStyle=css("--muted"); ctx.textAlign="center";
    ctx.fillText("YOUR LEFT",24,-30); ctx.fillText("YOUR RIGHT",-24,-30);
  },{sky:false});
}
let stageKey="";
function draw(){ let i=previewIdx, k="pose:lotus";
  if(practice==="surya"){ if(sched.length&&(running||elapsed>0)&&!done){ const a=at(elapsed), q=sched[a.k]; if(q&&!q.rest) i=q.i; else i=-1; }
    k=(i>=0&&STAGEPH[STEPS[i].s])||"pose:lotus"; }
  if(k===stageKey) return; stageKey=k; const ph=phSrc(k), im=$("#stagePhoto"); im.src=ph[0]; im.srcset=ph[0]+" 800w, "+ph[1]+" 1600w"; }

/* Cue panel */
function cueFor(){
  let s=null,a=null; if(sched.length&&(running||elapsed>0)&&!done){ a=at(elapsed); s=sched[a.k]; }
  const side = r => (r%2===0)?["right","left"]:["left","right"];
  if(done){ $("#cNum").textContent="Complete"; $("#cName").textContent="Well done"; $("#cSa").textContent="Sit or lie down and rest for a minute.";
    $("#cBreath").textContent=""; $("#cText").textContent="Your practice was added to your streak."; $("#cMantra").textContent=""; return; }
  if(practice==="surya"){
    if(s&&s.rest){ $("#cNum").textContent="Round "+(s.r+1)+" done"; $("#cName").textContent="Rest"; $("#cSa").textContent="Stand easy";
      $("#cBreath").textContent="Breathe naturally"; $("#cText").textContent="Next round leads with the other leg."; $("#cMantra").textContent=""; return; }
    const i=s?s.i:previewIdx, r=s?s.r:0, st=STEPS[i], [L,Rr]=side(r);
    $("#cNum").textContent="Step "+(VIS().indexOf(i)+1)+" of "+VIS().length+(s?" · Round "+(r+1)+" of "+rounds():"");
    $("#cName").textContent=st.en; $("#cSa").textContent=st.sa;
    $("#cBreath").textContent=st.b;
    $("#cText").textContent=(level()==="chair"?st.chair:st.cue).replace("{L}",L).replace("{R}",Rr);
    $("#cMantra").innerHTML=`${st.d}<span>${st.m}, salutation to ${st.mean}</span>`;
    document.querySelectorAll(".chip").forEach((c,k)=>{ if(k===i) c.setAttribute("aria-current","step"); else c.removeAttribute("aria-current"); });
  } else if(practice==="aum"){
    const map={in:["Breathe in","Fill the belly, then the chest. Sit tall."],A:["A (aa)","Open mouth. Feel the sound in the belly, hips and legs."],U:["U (oo)","Round the lips. Feel the sound in the chest."],M:["M (mm)","Close the lips and hum. Feel the buzz in the head."]};
    const ph=s?s.ph:"A", [b,t]=map[ph];
    $("#cNum").textContent=s?"Chant "+(s.r+1)+" of "+rounds():"AUM, felt in three parts of the body";
    $("#cName").textContent="AUM chanting"; $("#cSa").textContent="A-kara, U-kara, M-kara";
    $("#cBreath").textContent=b; $("#cText").textContent=t;
    $("#cMantra").innerHTML="ॐ<span>Sit tall, eyes closed, hands resting on the knees.</span>";
  } else {
    const b=BR[$("#bsel").value]||BR.nadi, ph=s?s.ph:($("#bsel").value==="nadi"?"inL":($("#bsel").value.match(/shit|sadanta/)?"inMouth":"in")), [bt,t]=breathCue(ph);
    const bk=$("#bsel").value, holds=bk==="booklet"&&$("#tHolds").checked;
    $("#cNum").textContent=s?"Round "+(s.r+1)+" of "+rounds():(holds?"Gentle counts with short pauses":"Gentle counts, no breath holding");
    $("#cName").textContent=b.name; $("#cSa").textContent=b.sa;
    $("#cBreath").textContent=bt; $("#cText").textContent=t;
    $("#cMantra").innerHTML=`<span><strong>Take care:</strong> ${b.care}</span>`+(/nadi|AV|Bh$/.test(bk)?`<span>${HAND_NOTE}</span>`:"")+(bk==="booklet"?`<span>A relaxed adult breathes about 15 to 18 times a minute; this rhythm slows it to about 5.</span>`:"");
  }
}
function timeHint(){ if(!["surya","aum","nadi"].includes(practice)){ $("#timeHint").textContent=""; return; } const m=Math.round(total()/6)/10; $("#timeHint").textContent="This session takes about "+m+" minutes."+(practice==="surya"&&level()==="chair"?" Chair version: every step is done sitting.":""); }

/* Body map lesson: our own drawings and words. Traditional yoga ideas are marked as such; anatomy is general school level. */
const NS="http://www.w3.org/2000/svg";
const body=()=>`<g><circle class="soft" cx="120" cy="38" r="17"/><rect class="soft" x="113" y="53" width="14" height="10"/>
 <path class="soft" d="M88 64 H152 L146 150 H94 Z"/><path class="soft" d="M94 148 H146 L144 168 H96 Z"/>
 <line class="lineS" x1="90" y1="70" x2="74" y2="150" stroke-width="11"/><line class="lineS" x1="150" y1="70" x2="166" y2="150" stroke-width="11"/>
 <line class="lineS" x1="107" y1="166" x2="104" y2="262" stroke-width="15"/><line class="lineS" x1="133" y1="166" x2="136" y2="262" stroke-width="15"/></g>`;
/* Real studio photographs replace every drawing: pose library, course, stage and lessons. */
const POSEPH={shava:"corpse",setu:"bridge",nava:"boat",hala:"plough",matsya:"fish",padma:"lotus",danda:"staff",ushtra:"camel",twist:"twist",pasch:"pasch",cobra:"cobra",shalabha:"locust",plank:"plank",updog:"updog",child:"child",wheel:"wheel"};
const poseImg=(k,cls)=>`<picture class="pphoto ${cls||""}"><img src="assets/yoga/pose-${k}-800.webp" srcset="assets/yoga/pose-${k}-800.webp 800w, assets/yoga/pose-${k}-1600.webp 1600w" sizes="(max-width:700px) 92vw, 380px" alt="${(POSEALT[k]||k)} pose in the studio" decoding="async"></picture>`;
const POSEALT={corpse:"Corpse",bridge:"Bridge",boat:"Boat",plough:"Plough",fish:"Fish",lotus:"Lotus",staff:"Staff",camel:"Camel",twist:"Seated twist",pasch:"Seated forward bend",cobra:"Cobra",locust:"Locust",plank:"Plank",updog:"Upward dog",child:"Child's",wheel:"Wheel",crow:"Crow",birddog:"Bird-dog"};
const STAGEPH={pray:"ph:namaskar",up:"ph:raisedarm",fold:"ph:g-forward-fold",plank:"pose:plank",cobra:"pose:cobra"};
const MAPPH={tree:"ph:raisedarm",limbs:"pose:lotus",mudra:"pose:lotus",eyes:"ph:namaskar",inward:"ph:seated",kundalini:"pose:staff",skeleton:"pose:bridge",kosha:"pose:lotus",vayu:"pose:fish",lungs:"pose:camel",nerves:"pose:corpse",senses:"pose:lotus",food:"pose:pasch",muscle:"pose:plank",bandha:"pose:boat",repro:"pose:child",kriya:"pose:cobra",organs:"pose:wheel",heart:"pose:camel",stomach:"pose:pasch",pituitary:"pose:lotus",chakra:"pose:lotus",aumsea:"pose:lotus"};
function phSrc(v){ const [t,n]=v.split(":"); return t==="pose"?[`assets/yoga/pose-${n}-800.webp`,`assets/yoga/pose-${n}-1600.webp`]:(["namaskar","conch","raisedarm"].includes(n)?[`assets/yoga/${n}-800.webp`,`assets/yoga/${n}-1600.webp`]:n==="seated"?[`assets/yoga/seated-800.webp`,`assets/yoga/seated-1600.webp`]:[`assets/yoga/${n}-800.webp`,`assets/yoga/${n}-1600.webp`]); }
/* Lessons shown only while they have a real studio photograph; anatomy units return with licensed plates. */
const LESSON_PHOTO={tree:1,limbs:1,mudra:1,eyes:1,inward:1,kundalini:1};
let mapTopic="tree", mapAnim=null, mapSel=null;
const TOPICS={
 kosha:{name:"Five layers",gated:1,members:1},
 vayu:{name:"Five energies",gated:1,members:1},
 lungs:{name:"How breathing works",gated:1,members:1},
 nerves:{name:"Calm and alert",gated:1,members:1},
 senses:{name:"Five senses",gated:1,members:1},
 food:{name:"Food journey",gated:1,members:1},
 muscle:{name:"Muscles at work",gated:1,members:1}
};
function stopMapAnim(){ if(mapAnim){ cancelAnimationFrame(mapAnim); mapAnim=null; } }
function lungRun(){
  stopMapAnim(); const t0=performance.now(), a=audio(); if(a&&a.state==="suspended") a.resume();
  let lastIn=null;
  const step=ts=>{ const t=((ts-t0)/1000)%10, inh=t<4, q=inh? t/4 : 1-(t-4)/6, e=ease(q);
    if(inh!==lastIn){ lastIn=inh; musicLevel(inh,inh?4:6); }
    ["#lungL","#lungR"].forEach(id=>{ const g=$(id), cx=id==="#lungL"?95:145; g.setAttribute("transform",`translate(${cx} 118) scale(${1+.12*e} ${1+.14*e}) translate(${-cx} -118)`); });
    $("#dia").setAttribute("d",`M62 180 Q120 ${140+34*e} 178 180`);
    $("#lungTxt").textContent=(inh?"Breathe in ":"Breathe out ")+Math.ceil(inh?4-t:10-t);
    mapAnim=requestAnimationFrame(step); };
  mapAnim=requestAnimationFrame(step);
}

/* Pose library: course map A-F with the owner's booklet numbering; text and drawings are our own. */
const K={
 shava:{h:[0,-4],t:180,n:180,ua:2,fa:0,tn:0,sn:0,tf:0,sf:0},
 suptatw:{h:[0,-4],t:180,n:180,ua:-95,fa:-95,tn:-35,sn:55,tf:-35,sf:55},
 pavana:{h:[0,-4],t:185,n:-150,ua:-60,fa:20,tn:-120,sn:60,tf:-45,sf:-45},
 setu:{h:[0,-18],t:160,n:180,ua:30,fa:-60,tn:-20,sn:80,tf:-20,sf:80},
 nava:{h:[0,-5],t:-130,n:-120,ua:-30,fa:-30,tn:-45,sn:-45,tf:-45,sf:-45},
 hala:{h:[0,-30],t:80,n:10,ua:0,fa:0,tn:139,sn:139,tf:139,sf:139},
 matsya:{h:[0,-4],t:195,n:150,ua:45,fa:0,tn:0,sn:0,tf:0,sf:0},
 vipk:{h:[-6,-14],t:152,n:180,ua:10,fa:-60,tn:-85,sn:-85,tf:-85,sf:-85},
 suptav:{h:[0,-6],t:192,n:170,ua:180,fa:180,tn:0,sn:180,tf:0,sf:180},
 danda:{h:[0,-5],t:-90,n:-90,ua:90,fa:90,tn:0,sn:0,tf:0,sf:0},
 vakra:{h:[0,-5],t:-90,n:-100,ua:30,fa:-60,ua2:120,fa2:100,tn:-60,sn:90,tf:0,sf:0},
 padma:{h:[0,-6],t:-90,n:-90,ua:70,fa:60,tn:-5,sn:175,tf:-5,sf:175},
 parvata:{h:[0,-6],t:-90,n:-90,ua:-90,fa:-90,tn:-5,sn:175,tf:-5,sf:175},
 ushtra:{h:[0,-23],t:-120,n:-160,ua:100,fa:100,tn:90,sn:180,tf:90,sf:180},
 janu:{h:[-20,-5],t:-12,n:-5,ua:25,fa:10,tn:0,sn:0,tf:10,sf:175},
 simha:{h:[0,-10],t:-70,n:-60,ua:90,fa:95,tn:10,sn:178,tf:10,sf:178},
 ananta:{h:[0,-5],t:180,n:-170,ua:180,fa:-120,ua2:-80,fa2:-90,tn:0,sn:0,tf:-90,sf:-90},
 shirsha:{h:[0,-44],t:90,n:90,ua:135,fa:0,tn:-90,sn:-90,tf:-90,sf:-90},
 tada:{h:[0,-46],t:-90,n:-90,ua:92,fa:90,tn:90,sn:90,tf:90,sf:90},
 katic:{h:[0,-46],t:-96,n:-98,ua:92,fa:90,ua2:-96,fa2:-112,tn:90,sn:90,tf:90,sf:90},
 trik:{h:[0,-40.6],t:5,n:-10,ua:90,fa:90,ua2:-90,fa2:-90,tn:62,sn:62,tf:118,sf:118},
 ptrik:{h:[0,-40.6],t:22,n:10,ua:85,fa:88,ua2:-95,fa2:-95,tn:62,sn:62,tf:118,sf:118},
 utkat:{h:[-8,-35],t:-65,n:-70,ua:-62,fa:-62,tn:35,sn:110,tf:35,sf:110},
 virab:{h:[0,-30],t:-90,n:-90,ua:0,fa:0,ua2:180,fa2:180,tn:15,sn:90,tf:140,sf:140},
 pkona:{h:[0,-28],t:-20,n:-30,ua:100,fa:100,ua2:-37,fa2:-37,tn:10,sn:90,tf:143,sf:143},
 garuda:{h:[0,-43.2],t:-88,n:-90,ua:0,fa:-90,ua2:10,fa2:-95,tn:70,sn:110,tf:75,sf:105},
 vriksha:{h:[0,-46],t:-90,n:-90,ua:-100,fa:-80,ua2:-100,fa2:-80,tn:90,sn:90,tf:45,sf:135},
 achakra:{h:[2,-46],t:-120,n:-135,ua:110,fa:33,tn:85,sn:85,tf:85,sf:85},
 natara:{h:[0,-46],t:-45,n:-60,ua:-40,fa:-40,ua2:199,fa2:199,tn:90,sn:90,tf:-150,sf:-60},
 makara:{h:[0,-4],t:-5,n:-10,ua:10,fa:-150,tn:180,sn:180,tf:180,sf:180},
 updog:{h:[-4,-12],t:-45,n:-65,ua:95,fa:95,tn:165,sn:168,tf:165,sf:168},
 child:{h:[0,-10],t:5,n:20,ua:5,fa:0,tn:10,sn:178,tf:10,sf:178},
 shalabha:{h:[0,-4],t:0,n:-5,ua:175,fa:180,tn:180,sn:180,tf:200,sf:200},
 bow:{h:[0,-5],t:-40,n:-50,ua:187,fa:187,tn:200,sn:-40,tf:200,sf:-40},
 hamsa:{h:[-5,-14],t:-2,n:-5,ua:175,fa:90,tn:162,sn:162,tf:162,sf:162},
 mayura:{h:[-5,-14],t:2,n:5,ua:175,fa:90,tn:180,sn:180,tf:180,sf:180},
 baddha:{h:[0,-6],t:-90,n:-90,ua:75,fa:80,tn:-15,sn:160,tf:-15,sf:160},
 tiger:{h:[-12,-23],t:-12,n:-30,ua:90,fa:90,ua2:-5,fa2:-5,tn:90,sn:180,tf:178,sf:178},
 gate:{h:[0,-23],t:-75,n:-70,ua:-130,fa:-150,ua2:75,fa2:80,tn:90,sn:180,tf:30,sf:75},
 prasar:{h:[-4,-42],t:95,n:100,ua:92,fa:95,tn:75,sn:80,tf:105,sf:100},
 catcow:{h:[-12,-23],t:-12,n:-38,ua:90,fa:90,tn:90,sn:180,tf:90,sf:180},
 kneel:{h:[0,-10],t:-90,n:-90,ua:60,fa:50,tn:10,sn:178,tf:10,sf:178},
 gomukha:{h:[0,-6],t:-90,n:-90,ua:-100,fa:100,ua2:110,fa2:-80,tn:-10,sn:160,tf:-10,sf:160},
 twist:{h:[0,-6],t:-90,n:-95,ua:30,fa:-60,ua2:120,fa2:100,tn:-60,sn:90,tf:5,sf:175},
 pasch:{h:[-20,-5],t:-12,n:-5,ua:25,fa:10,tn:0,sn:0,tf:0,sf:0},
 uppad:{h:[0,-4],t:195,n:-150,ua:-98,fa:-98,tn:-135,sn:-135,tf:-135,sf:-135},
 sarvanga:{h:[0,-30],t:90,n:175,ua:-5,fa:-130,tn:-90,sn:-90,tf:-90,sf:-90},
 supta:{h:[0,-6],t:180,n:180,ua:180,fa:180,tn:0,sn:180,tf:0,sf:180},
 wheel:{h:[0,-42],t:150,n:110,ua:100,fa:100,tn:60,sn:100,tf:60,sf:100}
};
const GROUPS={A:"Lying on the back",B:"Lying on the front",C:"Sitting",D:"Standing",E:"Lying on the side",F:"Upside down (inverted), teacher-led"};
const GOALS={
 health:["General health","A balanced daily mix: Sun salutation, two standing poses, one back-bend, one forward bend, breathing and rest. 20 to 30 minutes."],
 fitness:["Fitness and strength","Hold standing and balancing poses a little longer each week and add Sun salutation rounds."],
 flex:["Flexibility","Forward bends, twists and hip openers, held for 5 to 8 slow breaths. Never bounce."],
 stress:["Stress and sleep","Slow poses, long out-breaths, humming breath and rest. Good in the evening."],
 back:["Posture and back care","Gentle back-bends and core work. With back pain or an injury, consult your doctor first."],
 breath:["Breathing","Chest-opening poses with daily breathing practice."],
 weight:["Healthy weight","Regular Sun salutation rounds and steady standing poses, alongside sensible food and sleep."],
 focus:["Focus and calm mind","Balancing poses, eye exercises and alternate nostril breathing."],
 recovery:["Medical reasons and recovery","Consult your doctor before you start. Yoga supports the care your doctor gives and does not replace it. Begin at Chair level with short holds."],
 prenatal:["Pregnancy","Only with your doctor's OK and a qualified prenatal teacher. Avoid lying on the belly, deep twists, strong back-bends, inversions and fast breathing."],
 senior:["Seniors","Chair level, a wall for balance, short holds. Ask your doctor first if you have a heart, blood pressure, bone or joint condition."],
 kids:["Children","Short, playful practice with an adult nearby. No breath-holding, inversions or advanced balances."]
};
const BELIEF={
 spiritual:["Spiritual","Practise as a quiet offering in your own tradition, with a silent prayer or mantra."],
 cultural:["Cultural","Rooted in India's yoga heritage. Sanskrit names are kept beside plain English."],
 traditional:["Traditional","Taught as in classical hatha yoga: steady, comfortable and aware of the breath."],
 secular:["Secular","Use it simply as exercise and relaxation. No belief is needed."]
};
// [code, en, sa, key, short, level, hold, goals, steps, care, story]
const PL=[
 ["A-1","Rest pose","Shavasana","shava","Lie flat on the back and let the whole body relax.","Beginner",120,["stress","health","senior","recovery"],["Lie on the back, feet a little apart, arms away from the body, palms up.","Close the eyes and let the breath become slow and easy (easy breath, Sukha Pranayama).","Let each out-breath become a little longer than the in-breath, for example in for 4, out for 6.","Blanket tip: the body cools quickly when it is still, so cover yourself with a light blanket or shawl before you settle.","Eye-cover tip: lay a folded soft cloth or eye pillow over the eyes to shut out light and help the face relax.","Relax the body part by part, from the toes to the head.","To come up, roll to the right side and rise slowly.","Starting position for the other lying poses (Sthiti): feet together, arms stretched overhead beside the ears, palms up, whole body long."],"Use a pillow under the knees for back comfort. In late pregnancy, rest on the left side instead.","Shava means a body at rest: complete stillness of the body with an awake mind."],
 ["A-2","Knee hug","Ekapada Pavana Muktasana","pavana","Hug one knee to the chest while the other leg rests long.","Beginner",20,["back","health","senior"],["Lie on the back.","Bend the right knee and hold it with both hands.","Breathe out and draw the knee toward the chest; lift the head only if comfortable.","Lower and change sides.","Knees to chest (Apanasana): hug both knees in, then rock gently side to side or circle the knees slowly to massage the lower back. Breathe out as the knees come closer."],"Keep the head down with neck problems. Skip after recent abdominal surgery, with hernia, or in pregnancy.","Pavana means wind; the pose is traditionally used to ease the belly."],
 ["A-3","Bridge","Setu Bandhasana","setu","Lift the hips with the feet and shoulders on the floor.","Beginner",20,["back","fitness","breath"],["Lie on the back, knees bent, feet hip-width apart near the hips.","Breathe in and lift the hips.","Support the lower back with the hands if you like.","Breathe out and lower the spine slowly.","One-leg variation (when the bridge feels steady): lift the hips, then straighten the right leg up or forward, hips level. Three breaths, lower the foot, then the hips. Change sides."],"Skip with neck injury. Keep the knees in line with the feet.","Setu means bridge."],
 ["A-4","Boat","Navasana","nava","Balance on the sitting bones with legs and chest lifted.","Steady",15,["fitness","focus"],["Sit with knees bent, hands beside the hips.","Lean back a little and lift the feet.","Straighten the legs if you can and reach the arms forward.","Breathe steadily and lower with control."],"Keep the knees bent while learning. Skip with lower-back pain, hernia, during menstruation or in pregnancy.","Nava means boat."],
 ["A-5","Plough","Halasana","hala","From the back, take the legs over the head toward the floor.","Advanced, teacher-led",20,["flex"],["Lie on the back, arms by the sides.","Lift the legs and hips, supporting the back with the hands.","Lower the feet behind the head only as far as is easy.","Roll down slowly, one vertebra at a time."],"Learn with a teacher. Never turn the head. Skip with neck or back problems, high blood pressure, heart disease, eye pressure problems, during menstruation or in pregnancy.","Hala means plough."],
 ["A-6","Fish","Matsyasana","matsya","Lift and open the chest while lying on the back.","Steady",20,["breath","back"],["Lie on the back, legs straight, hands under the hips.","Press the elbows down and lift the chest.","Let the head rest lightly on the floor, with no weight on the neck.","Lower the chest first, then the head."],"Skip with neck problems, high or low blood pressure, or migraine.","Matsya means fish. In story, the sage Matsyendra learned yoga while hidden inside a fish."],
 ["A-9","Legs up, supported","Viparita Karani","vipk","Lift the legs with the hands under the hips.","Steady",30,["stress","recovery"],["Lie on the back.","Lift the legs and hips; support the hips with the hands.","Keep the body at a slant, legs straight up.","Come down slowly. A gentler version is legs resting up a wall."],"The wall version is safest. Skip the hand-supported version with neck problems, high blood pressure, eye pressure problems, during menstruation or in pregnancy.","Viparita means upside down."],
 ["A-10","Reclining diamond","Supta Vajrasana","suptav","From kneeling, lie back between the heels with arms overhead.","Steady",20,["flex","breath"],["Sit on the heels in diamond pose.","Lean back onto the elbows, one at a time.","Lower the back to the floor and stretch the arms overhead.","Come up the same way, using the elbows."],"Skip with knee, ankle or lower-back problems. Use cushions behind you while learning.","Vajra means diamond or thunderbolt: firm and strong."],
 ["C-1","Staff pose","Dandasana","danda","Sit tall with the legs straight out in front.","Beginner",30,["back","health","senior"],["Sit with the legs together and straight.","Place the hands beside the hips.","Lift through the crown of the head; shoulders relaxed.","Press the backs of the legs down and draw the toes back toward you; feel even weight on both sitting bones.","Breathe steadily.","Between sitting poses, rest in an easy seat (Sthiti): legs loosely out in front, hands on the floor behind you, leaning back a little."],"Sit on a folded blanket if the lower back rounds, and bend the knees a little if the hamstrings are tight.","Danda means staff: straight and steady."],
 ["C-2","Simple twist","Vakrasana","vakra","A gentle seated twist with one knee bent.","Beginner",20,["flex","back","health"],["Sit in staff pose.","Bend the right knee and place the foot beside the left knee.","Place the right hand behind you and the left arm by the right knee.","Turn gently to the right, then change sides."],"Turn slowly from the waist up, never forcing with the arms. Ask your doctor first, or skip it, with any back or spine problem such as a slipped disc, after back or abdominal surgery, with hernia, or in pregnancy.","Vakra means twisted."],
 ["C-5","Lotus","Padmasana","padma","Cross-legged with each foot resting on the opposite thigh.","Steady",60,["focus","stress"],["Sit in staff pose.","Bend the right knee and place the foot on the left thigh.","Bring the left foot onto the right thigh only if the knees are happy.","Rest the hands on the knees. Meditate with eyes open on one point (outer focus) or with eyes closed (inner focus)."],"Never force the knees or hips: the turn must come from the hips, not the knee joint. Skip full lotus with any knee, hip or ankle problem. Easy option: sit simply cross-legged (Sukhasana) on a folded blanket, or try half lotus with one foot on the thigh.","Padma means lotus: rooted in mud, flowering clean above the water."],
 ["C-6","Mountain pose, seated","Parvatasana","parvata","In cross-legged sitting, stretch the joined palms high.","Beginner",20,["back","breath"],["Sit cross-legged or in lotus.","Join the palms and stretch the arms overhead.","Lengthen the spine on every in-breath.","Lower the arms slowly."],"Keep the arms lower with shoulder problems.","Parvata means mountain."],
 ["C-9","Camel","Ushtrasana","ushtra","Kneel and arch back to reach the heels.","Steady",15,["back","breath","flex"],["Kneel with the knees hip-width apart.","Place the hands on the lower back.","Lift the chest and arch back; reach for the heels only if easy.","Come up slowly with the chest leading."],"Start with the half version: hands stay on the lower back, chest lifts, and the head stays in line with the spine. Only let the head go back if the neck is healthy and it feels easy. Protect the lower back by pressing the hips forward. Skip with neck or lower-back injury, high or low blood pressure, heart disease, migraine, or in pregnancy. Come up slowly and stop if dizzy.","Ushtra means camel."],
 ["C-10","Head to knee","Janu Shirshasana","janu","Fold over one straight leg with the other knee bent.","Beginner",30,["flex","stress"],["Sit with the left leg straight and the right foot against the left thigh.","Breathe in and lengthen the spine.","Breathe out and fold over the straight leg.","Strap variation: loop a strap, belt or dupatta around the ball of the straight foot, hold one end in each hand, and walk the hands along it as you fold, keeping the back long.","Stay 5 breaths, come up on an in-breath, and change sides."],"Fold from the hips with a long back, not by rounding the lower back. Bend the straight knee or loop a strap around the foot if the back of the leg (hamstring) pulls; never bounce. Skip with lower-back pain, slipped disc, sciatica or a hamstring injury.","Janu means knee, shirsha means head."],
 ["C-13","Lion","Simhasana","simha","Kneel, lean forward and breathe out with the tongue out.","Beginner",10,["stress","kids"],["Kneel with the knees apart and hands on the floor or the knees.","Breathe in through the nose.","Breathe out through the mouth, tongue out, eyes wide, with a soft 'haa'.","Repeat 3 times."],"Keep it gentle with knee problems; you can do it sitting on a chair.","Simha means lion: a playful pose that relaxes the face and throat."],
 ["C-14","Easy seat","Sukhasana","sukha","Sit cross-legged with a tall spine; add side stretches.","Beginner",60,["stress","breath","flex","senior"],["Sit on a folded blanket and cross the shins, knees resting wide.","Rest the hands on the knees in the knowledge gesture (Jnana mudra) and breathe slowly.","Side stretch: breathe in and raise the right arm, breathe out and lean to the left, left hand on the floor. Three breaths, then change sides.","Change which shin is in front each day."],"Sit higher if the knees are above the hips or the back rounds. Skip the side stretch with a shoulder injury.","Sukha means ease: a seat you can stay in comfortably."],
 ["C-15","Accomplished pose","Siddhasana","sukha","A steady seat with one heel drawn in front of the other; add a gentle twist.","Steady",60,["focus","stress","flex"],["Sit on a block or folded blanket. Bend the left knee and bring the left heel close to the body.","Bring the right heel in front of the left, both shins on the floor.","Twist: breathe in to grow tall, breathe out and turn the chest to the right, left hand on the right knee. Three breaths, then change sides.","Change the front leg each day."],"Block tip: sitting on a block lets the knees drop below the hips and keeps the back straight. Skip with knee or hip injury; use the Easy seat instead.","A classic seat for breathing and meditation in the yoga texts."],
 ["C-16","Side gate","Parighasana","gate","Kneel on one knee, stretch the other leg out to the side and bend sideways over it.","Beginner",20,["flex","breath","back"],["Kneel tall. Stretch the right leg out to the right, foot flat, in line with the left knee.","Rest the right hand on the right leg. Breathe in and raise the left arm.","Breathe out and bend to the right, over the straight leg, without leaning forward.","Three breaths, come up on an in-breath, and change sides."],"Pad the kneeling knee with a folded blanket. Skip with a knee injury; sit on a chair and do the side bend instead.","Parigha means the bar that locks a gate: the straight leg is the bar."],
 ["C-17","Sage pose","Marichyasana","vakra","From staff pose, bend one knee and twist toward it.","Beginner",30,["back","flex"],["Sit in staff pose. Bend the right knee and place the right foot flat on the floor near the right sitting bone.","Stage one: hold the right shin with both hands, breathe in and sit tall, keeping the left leg long and its toes pointing up.","Stage two, the twist: place the right hand on the floor behind you, hug the right knee with the left arm, breathe in to grow tall, breathe out and turn the chest to the right.","Five breaths, unwind slowly on an out-breath, and change sides."],"Twist from the middle and upper back, not by pulling with the arms. Sit on a blanket if the back rounds. Skip the twist with a recent back injury or in pregnancy; stay in stage one instead.","Named after Marichi, one of the seven sages of tradition."],
 ["E-1","Side-lying leg raise","Anantasana","ananta","Lie on one side, head on the hand, and raise the top leg.","Steady",20,["flex","fitness","focus"],["Lie on the left side, body in one straight line.","Rest the head on the left hand.","Bend the right knee, hold the big toe, and straighten the leg up if you can.","Lower slowly and change sides."],"Keep the knee bent or use a strap. Skip with hip or shoulder injury.","Ananta is the endless serpent on which, in story, Vishnu rests."],
 ["F-1","Headstand","Shirshasana","shirsha","Balance upside down on the forearms and crown of the head.","Advanced, teacher-led",10,[],["Only learn this in person with a qualified teacher, near a wall, after months of regular practice.","Kneel, interlace the fingers and place the forearms on a folded blanket.","Place the crown of the head in the cupped hands; the forearms carry most of the weight.","Come down slowly and rest in child's pose."],"Never practise alone or from a page. Skip with any neck or spine problem, high blood pressure, heart disease, glaucoma or other eye pressure problems, ear infection, recent head injury, during menstruation, or in pregnancy. Never for children or beginners. Stop at once if you feel pressure in the head, neck pain or dizziness. Safe alternative for everyone: lie on the back with the legs resting up a wall for 2 to 5 minutes.","Shirsha means head. Traditionally called the king of poses, and some people keep practising it well into old age with care and guidance."],
 ["A-7","Raised leg hold","Urdhva Padangusthasana","uppad","Lie on the back and hold the big toes with both legs raised.","Steady",20,["flex","back"],["Lie on the back, legs together.","Raise both legs, then lift the head and shoulders.","Hold the big toes or the shins.","Breathe steadily, then lower slowly: head first, then legs."],"Bend the knees or use a strap. Skip with neck or lower-back injury, hernia, or in pregnancy.","Padangushtha means big toe."],
 ["A-8","Shoulder stand","Sarvangasana","sarvanga","Rest on the shoulders with the body and legs straight up.","Advanced, teacher-led",30,["focus"],["Lie on the back, arms by the sides.","Lift the legs and hips, supporting the back with the hands.","Straighten the body up over the shoulders. Never turn the head.","Come down slowly, rolling the spine onto the floor."],"Learn with a teacher. Keep the weight on the shoulders, not the neck. Use a folded blanket under the shoulders. Skip with any neck problem, high blood pressure, heart disease, glaucoma or other eye pressure problems, ear infection, during menstruation, or in pregnancy. Never in the first months of practice.","Sarva-anga means all the limbs: the whole body takes part."],
 ["A-11","Reclining hero","Supta Veerasana","supta","Kneel, sit between the heels, then lie back slowly.","Steady",30,["flex","breath","stress"],["Kneel with knees together, feet slightly wider than the hips.","Sit down between the heels; use a cushion if needed.","Lean back onto the elbows, then onto the back if comfortable.","Rest the arms by the sides or overhead. Come up the same way."],"Skip with knee, ankle or lower-back problems. Stop if the knees feel strained.","Veera means hero: the pose asks for a calm, brave mind."],
 ["A-12","Wheel","Chakrasana","wheel","Lift the body into a full arch on hands and feet.","Advanced, teacher-led",10,["flex","fitness"],["Lie on the back, knees bent, feet near the hips.","Palms beside the ears, fingers toward the shoulders.","Press hands and feet and lift the hips, then the chest.","Hold briefly, lower the head first and roll down slowly."],"Learn with a teacher. Skip with high blood pressure, heart conditions, back, wrist or shoulder injury, or in pregnancy.","Chakra means wheel: the round shape echoes the wheel of the sun."],
 ["A-13","Reclining twist","Supta Matsyendrasana","suptatw","Lie on the back, let both bent knees fall to one side, arms open.","Beginner",45,["back","stress","flex","senior"],["Lie on the back, knees bent, feet on the floor. Open the arms out to the sides at shoulder height, palms up.","Breathe out and let both knees fall slowly to the right. Turn the head gently to the left if the neck is happy.","Stay for 5 to 8 slow breaths, letting the back soften toward the floor.","Breathe in and bring the knees back to the middle, then change sides.","Easier: put a cushion under the knees. Deeper: straighten the lower leg and hold the top knee down with the opposite hand.","Reclining twist II, one leg: lie with the left leg long, hug the right knee in, then guide it across the body to the left with the left hand, right arm open.","Block tip: if the opposite shoulder lifts off the floor, rest it on a folded blanket or block, or let the knee rest on a cushion instead of forcing it down."],"Move slowly and keep the twist gentle. Skip with a recent back or spinal injury, or in pregnancy after the first months; keep the head straight with neck problems.","Matsyendra is remembered in tradition as one of the first teachers of hatha yoga."],
 ["B-1","Crocodile","Makarasana","makara","Rest on the front with the head on the hands.","Beginner",60,["stress","back"],["Lie on the front, legs a little apart, toes out.","Fold the arms and rest the forehead or chin on the hands.","Close the eyes and breathe into the belly.","This is also the starting and resting position (Sthiti) for every pose lying on the front."],"Use a pillow under the belly if the back aches. Skip in later pregnancy.","Makara, the crocodile, rests completely still."],
 ["B-2","Cobra","Bhujangasana, type 1","cobra","Lift the chest on the strength of the back, hands under the shoulders.","Beginner",20,["back","breath"],["Lie on the front, hands under the shoulders.","Press the hips down.","Lift the chest slowly using the back.","Keep the elbows soft. Lower down gently."],"Lift only as high as is easy, with no pinching in the lower back. Keep the neck long and look forward, not up. Skip with a back or neck injury, in pregnancy, with hernia or after recent abdominal surgery.","Bhujanga means serpent, a raised cobra hood."],
 ["B-3","Locust, one leg","Ekapada Shalabhasana","shalabha","Lift one straight leg while lying on the front.","Beginner",15,["back","fitness","health"],["Lie on the front, chin on the floor, hands under the thighs.","Breathe in and lift the right leg straight.","Keep the hips down. Hold for a few breaths.","Lower slowly and change legs."],"Skip in pregnancy, with recent abdominal surgery or a hernia. Lift only as high as is easy.","Shalabha means locust; the raised leg recalls its tail."],
 ["B-4","Balance plank","Tulasana","plank","Lift the body in one straight line on palms and toes.","Steady",20,["fitness","weight","back"],["Lie on the front, palms beside the chest.","Tuck the toes.","Press up, body in one straight line.","Hold, then lower slowly."],"Drop the knees if needed. Skip with wrist or shoulder injury.","Tula means balance or scales: the body is a level beam."],
 ["B-5","Upward dog","Urdhva Mukha Shvanasana","updog","Arms straight, chest lifted, thighs off the floor.","Steady",15,["back","breath"],["Lie on the front, hands beside the lower ribs.","Press the hands and straighten the arms.","Lift the chest and thighs; only hands and tops of feet touch the floor.","Shoulders away from the ears. Lower gently."],"Protect the lower back: keep the legs active and lift only as far as is easy, with no pinching. Spread the fingers and keep the wrists under the shoulders; use fists or a wedge if the wrists ache. Skip with wrist or lower-back injury, or in pregnancy.","A dog stretching upward after rest."],
 ["B-6","Downward dog","Adho Mukha Shvanasana","dog","Hips high, body in an upside-down V.","Beginner",30,["fitness","flex","health"],["Start on hands and knees.","Tuck the toes and lift the hips up and back.","Press the hands, let the head hang, heels toward the floor.","Bend the knees if the back rounds."],"The head goes below the heart, so treat it as a gentle inversion. Ask your doctor first, or skip it, with high or uncontrolled blood pressure, glaucoma or other eye pressure problems, recent eye surgery, or in pregnancy. Also skip with wrist or shoulder injury. Come up slowly and stop if you feel dizzy or pressure in the head.","A dog stretching forward after rest."],
 ["B-7","Child's pose (rabbit)","Shashankasana","child","Sit on the heels and fold forward to rest.","Beginner",60,["stress","back","senior"],["Kneel and sit on the heels.","Breathe in, raise the arms.","Breathe out, fold forward and rest the forehead and hands on the floor.","Breathe slowly into the back.","Extended child's pose: walk the hands far forward, arms long, palms down, and let the hips sink back to the heels.","Wide-knee version: open the knees wider than the hips, big toes touching, and let the chest settle between the thighs. Kinder on the belly and in pregnancy.","Side reach: walk both hands to the right, breathe into the left side for 3 breaths, then change sides.","Head support: rest the forehead on a cushion or stacked fists if it does not reach the floor."],"Go easy on the knees: put a folded blanket under them and a cushion between the hips and heels if they ache. Skip with a knee injury. In later pregnancy, widen the knees or skip it.","Shashanka, the moon-hare, sits quietly folded."],
 ["B-8","Eight-point salute","Ashtanga Namaskara","eight","Chin, chest, hands, knees and feet touch the floor.","Beginner",10,["fitness","health"],["From plank, lower the knees.","Lower the chest and chin between the hands.","Keep the hips slightly raised.","Breathe out and pause."],"Skip with shoulder or wrist injury and in later pregnancy.","Ashta means eight: a full-body bow to the sun."],
 ["B-9","Rider pose","Ashwa Sanchalanasana","lungeA","One leg forward, the other stretched back, chest lifted.","Beginner",20,["flex","fitness"],["From standing, step the right leg far back.","Lower the right knee if you like.","Hands beside the front foot, look ahead or slightly up.","Change sides."],"Keep the front knee over the ankle, not past the toes, and pad the back knee. Only tilt the head back a little, and keep it level if you have neck problems or feel dizzy. Skip with knee or hip injury.","Ashwa means horse: the rider's stance."],
 ["B-10","Bow","Dhanurasana","bow","Hold the ankles and lift chest and legs together.","Steady",15,["back","flex","breath"],["Lie on the front, bend the knees and hold the ankles.","Breathe in and press the feet into the hands.","Chest and thighs lift like a drawn bow.","Hold a few breaths, release slowly."],"Skip with high blood pressure, hernia, back injury, recent abdominal surgery, or in pregnancy.","Dhanu means bow, the archer's weapon of epic heroes."],
 ["B-11","Swan","Hamsasana","hamsa","Balance on bent arms with the toes on the floor.","Advanced, teacher-led",10,["fitness","focus"],["Kneel, palms on the floor, fingers toward the feet.","Bend the elbows and rest the belly on them.","Stretch the legs back, toes down, body straight.","Hold briefly, then lower the knees."],"Learn with a teacher, on an empty stomach. Skip in pregnancy, with wrist, elbow or abdominal problems, hernia, high blood pressure or heart conditions.","Hamsa, the swan, stands for wisdom that tells true from false."],
 ["B-12","Peacock","Mayurasana","mayura","Lift the whole body level on the hands.","Advanced, teacher-led",5,["fitness","focus"],["Start as in Swan, elbows under the belly.","Lean forward until the weight is on the hands.","Lift the feet so the body floats level.","Hold for a breath or two, then lower the feet."],"Only after Swan is easy, and with a teacher. Same cautions as Swan.","Mayura, the peacock, carries Kartikeya in Indian tradition."],
 ["B-13","Cat and cow","Marjariasana and Bitilasana","catcow","On hands and knees, round and arch the back with the breath.","Beginner",30,["back","flex","breath","senior"],["Come onto hands and knees: hands under the shoulders, knees under the hips.","Cow: breathe in, let the belly sink, lift the chest and tailbone, look gently forward.","Cat: breathe out, round the back up toward the ceiling, tuck the chin and tailbone.","Move slowly with the breath, 5 to 10 times. The breath leads, the spine follows."],"Pad the knees with a blanket. Keep the neck movement small with neck problems. With wrist pain, rest on the forearms.","Marjari means cat: the pose copies a cat stretching its back."],
 ["B-14","Tiger","Vyaghrasana","tiger","From hands and knees, stretch one leg back and, if steady, the opposite arm forward.","Beginner",20,["back","focus","fitness"],["Come onto hands and knees, hands under shoulders, knees under hips, fingers spread.","Breathe in and slide the right leg back, then lift it to hip height, toes pointing down.","If steady, also reach the left arm forward at shoulder height. Keep the hips level and the neck long.","Breathe out, lower, and change sides. Three to five times each side."],"Pad the knees. Keep the lower back flat rather than arched. With wrist pain, rest on the forearms; with a knee injury, skip it.","Vyaghra means tiger: a long, alert stretch."],
 ["C-3","Bound angle","Baddhakonasana","baddha","Soles together, knees gently opening.","Beginner",60,["flex","stress","senior","prenatal"],["Sit tall and bring the soles together.","Hold the feet and let the knees drop slowly.","Keep the back long.","Breathe into the hips."],"Support the knees with cushions. Skip with groin or knee injury.","Often used as a quiet seat for reflection."],
 ["C-4","Diamond pose","Vajrasana","kneel","Sit on the heels with a tall back.","Beginner",60,["health","focus","breath","stress"],["Kneel, knees together, big toes touching.","Sit back on the heels.","Hands on the thighs, back straight.","Breathe slowly. Start with one minute."],"Put a cushion between heels and hips. Skip with knee or ankle injury.","Vajra means diamond or thunderbolt. Traditionally used for sitting after meals."],
 ["C-7","Cow face","Gomukhasana","gomukha","Knees stacked, hands clasp behind the back.","Steady",30,["flex","back","breath"],["Sit and cross the right knee over the left, feet beside the hips.","Raise the right arm, bend it and reach down the back.","Bring the left hand up behind to meet it. Use a strap if needed.","Sit tall and breathe. Change sides."],"Use a strap. Skip with shoulder, knee or hip injury.","Gomukha means cow's face. In legend the cow Kamadhenu gives all that is good; the pose takes its name from its shape."],
 ["C-8","Half spinal twist","Ardha Matsyendrasana","twist","Turn the spine gently while seated.","Steady",30,["flex","back","health"],["Sit, bend the right knee and step the foot outside the left knee.","Fold the left leg, foot beside the right hip.","Right hand behind you; left arm hugs the knee.","Breathe in to grow tall, breathe out to turn. Change sides."],"Twist gently. Skip in pregnancy, with back injury, hernia or recent abdominal surgery.","Named after the sage Matsyendranath, who in legend learned yoga as a fish listening to Shiva."],
 ["C-11","Seated forward bend","Paschimottanasana","pasch","Fold forward over straight legs.","Beginner",30,["flex","stress","health"],["Sit with the legs straight and together.","Breathe in and raise the arms.","Breathe out and fold from the hips toward the feet.","Keep the back long. Bend the knees if needed."],"Bend the knees with back or hamstring problems. Skip with a slipped disc or in pregnancy.","Paschima means west: the back of the body faces west when you practise toward the sunrise."],
 ["C-12","Hero's seat","Veerasana","kneel","Sit between the heels with a tall back.","Beginner",60,["focus","stress","breath"],["Kneel, knees together, feet slightly wider than the hips.","Lower the hips between the heels, on a cushion if needed.","Hands on the knees, back straight.","Breathe slowly."],"Use cushions. Skip with knee or ankle injury.","Veera means hero."],
 ["D-1","Mountain","Tadasana","tada","Stand tall and steady, weight even on both feet.","Beginner",45,["health","back","senior","kids"],["Feet together or hip-width apart.","Lift the knee caps gently, lengthen the spine.","Shoulders relaxed, arms by the sides.","Breathe slowly, gaze at one point.","Feel the weight spread over the heel, the big-toe mound and the little-toe mound of each foot.","Lift the crown of the head as if a thread draws it up; keep the chin level.","Between standing poses, rest in an easy stance (Sthiti): feet a little apart, arms loose, shoulders soft."],"Stand near a wall if you feel dizzy, and keep the feet hip-width apart for better balance. Do not lock the knees; keep them soft if you have low blood pressure.","Tada means palm tree or mountain: tall and still."],
 ["D-2","Half waist wheel","Ardha Kati Chakrasana","katic","Stand and bend gently to the side with one arm overhead.","Beginner",20,["flex","breath","kids"],["Stand tall, feet together.","Raise the right arm beside the ear.","Breathe out and bend gently to the left.","Come up, lower the arm, change sides."],"Bend only a little at first, straight to the side without leaning forward. Move slowly and come up on an in-breath; stand near a wall and stop if you feel dizzy. Skip with lower-back pain, a back or neck injury, or a slipped disc.","Kati means waist; chakra means wheel."],
 ["D-3","Triangle","Trikonasana","trik","Legs wide, one hand to the shin, the other arm up.","Beginner",30,["flex","health","fitness"],["Feet about a leg's length apart.","Right foot out, left foot slightly in.","Arms to shoulder height, reach right and lower the right hand to the shin.","Left arm up, look up if comfortable. Change sides.","Keep both sides of the waist long, as if the body were between two panes of glass; the front knee stays soft, never locked."],"Look down if your neck is sore. Rest the lower hand on a block or a chair rather than reaching for the floor. Skip if it makes you dizzy.","Trikona means triangle, a shape of balance."],
 ["D-4","Chair pose","Utkatasana","utkat","Bend the knees and sit back as if on a chair.","Beginner",20,["fitness","weight","kids"],["Stand with feet together or hip-width.","Breathe in and raise the arms.","Breathe out, bend the knees and sit back.","Weight in the heels, chest lifted."],"Keep the knees behind the toes. With knee pain, bend only a little.","Utkata means powerful or fierce."],
 ["D-5","Revolved triangle","Parivritta Trikonasana","ptrik","Legs wide, turn the body and reach the opposite hand down.","Steady",20,["flex","focus"],["Feet wide, right foot out.","Turn the hips and chest to the right.","Left hand to the right shin or a block, right arm up.","Breathe and turn gently. Change sides."],"Turn from the chest with a long back; don't force the twist from the lower back. Use a block or a chair under the hand. For balance, widen the stance a little or keep a wall behind you, and come up slowly. Skip with lower-back pain or a back injury, low blood pressure, dizziness, or in pregnancy.","Parivritta means turned around."],
 ["D-6","Warrior","Veerabhadrasana","virab","Front knee bent, arms stretched wide.","Beginner",30,["fitness","focus","weight"],["Step the feet wide, front foot out.","Bend the front knee over the ankle.","Stretch the arms level with the floor.","Gaze over the front hand. Change sides.","Hips and shoulders face the side, the back foot turned in a little, its outer edge pressing down.","Reverse warrior: keep the front knee bent, turn the front palm up and sweep that arm up and back, the back hand sliding down the back leg. Three breaths, return to warrior, then change sides."],"Protect the front knee: keep it straight over the ankle, never past the toes and never falling inward. Bend only as deep as is comfortable and shorten the stance if the knee aches. Skip with knee or hip injury.","Named after Veerabhadra, a fierce warrior form of Shiva in the Puranas."],
 ["D-7","Side angle","Parshvakonasana","pkona","Front knee bent, one long line from back foot to fingertips.","Steady",30,["flex","fitness"],["Feet wide, right foot out.","Bend the right knee over the ankle.","Start with the right forearm resting on the thigh.","Left arm over the ear, one long line from the back heel to the fingertips. Change sides.","Full pose, when the forearm version is easy: lower the right hand to the floor or a block outside the front foot, keeping the chest open.","Wall tip: practise with the back heel pressed against a wall to feel a steady base and a straight back leg."],"Use the forearm on the thigh if the hand cannot reach. Keep the front knee over the ankle. Skip with hip or knee injury; look down if the neck is sore.","Parshva means side; kona means angle."],
 ["D-8","Eagle","Garudasana","garuda","Legs and arms wrapped, balancing on one leg.","Steady",20,["focus","flex"],["Stand and bend the knees a little.","Cross the right thigh over the left.","Cross the arms at the elbows, palms together if possible.","Lift the elbows, sit lower, gaze ahead. Change sides."],"Hold a wall. Skip with knee, ankle or shoulder injury.","Garuda, the eagle, carries Vishnu in Indian tradition."],
 ["D-9","Tree","Vrikshasana","vriksha","Balance on one leg, foot on the inner leg, hands joined above.","Beginner",30,["focus","kids","health"],["Stand tall.","Place one foot on the inner calf or thigh, never on the knee.","Join the palms, then raise them overhead.","Hold, then change sides."],"Balance takes practice: stand beside a wall and touch it lightly until you feel steady. Place the foot on the calf or inner thigh, never on the knee. Gaze at one still point. Skip with knee or ankle pain, dizziness or poor balance, or practise with the toes on the floor.","Vriksha means tree: rooted below, reaching above."],
 ["D-10","Hand to foot","Hastapadasana","fold","Fold forward and bring the hands toward the feet.","Beginner",20,["flex","stress"],["Stand tall and raise the arms.","Fold forward from the hips.","Hands to the shins, ankles or floor.","Bend the knees as needed. Come up slowly.","Half fold: from the fold, breathe in and lift the chest halfway, back long and flat, hands on the shins or thighs, gaze down a little ahead. Breathe out and fold again. Repeat 3 times."],"Bent knees are fine: fold from the hips and let the hands rest on the shins or a chair. The head goes below the heart, so come up slowly with a flat back and stop if you feel dizzy. Skip it with high blood pressure, eye pressure problems, lower-back pain or a slipped disc, or in pregnancy.","Hasta means hand, pada means foot."],
 ["D-11","Half wheel","Ardha Chakrasana","achakra","Hands on the lower back, bend gently backward.","Beginner",15,["back","breath"],["Stand with feet together.","Hands on the lower back, fingers down.","Breathe in and bend back gently from the upper back.","Hold, then come up slowly."],"Bend only a little at first. Skip with high blood pressure, vertigo, or back or neck injury.","Ardha means half; chakra means wheel."],
 ["D-12","Dancer","Natarajasana","natara","Hold one foot behind and reach the other arm forward.","Steady (intermediate)",20,["focus","flex","fitness"],["Stand on the left leg.","Bend the right knee and hold the right ankle.","Raise the left arm forward and up.","Lean the chest forward as the foot presses into the hand. Change sides."],"Balance caution: practise next to a wall or chair and touch it whenever you wobble. Lean forward only as far as you stay steady, and come out slowly. Skip with balance problems, dizziness, low blood pressure, or a knee or ankle injury.","Nataraja is Shiva as the cosmic dancer, whose dance stands for creation and renewal."],
 ["D-13","Extended mountain","Urdhva Hastasana","up","Stand tall and reach both arms up overhead.","Beginner",30,["health","back","breath","senior"],["Stand in Mountain pose, feet hip-width apart.","Breathe in and sweep the arms out to the sides and up, palms facing each other or touching.","Lengthen from the feet to the fingertips; keep the ribs soft and the lower back long, not arched.","Breathe out and lower the arms slowly. Repeat 3 to 5 times with the breath."],"Keep the shoulders away from the ears. With a shoulder injury or high blood pressure, raise the arms only to shoulder height. Look forward, not up, if you feel dizzy.","Urdhva means upward, hasta means hand."],
 ["D-14","Wide-leg forward fold","Prasarita Padottanasana","prasar","Stand with the feet wide apart and fold forward from the hips.","Beginner",30,["flex","back","stress"],["Step the feet wide apart, toes pointing forward, outer edges of the feet parallel.","Hands on the hips. Breathe in and lengthen the spine.","Breathe out and fold forward from the hips, hands to the floor, a block or a chair under the shoulders.","Stay 3 to 5 breaths. To come up, hands to hips, back flat, rise on an in-breath."],"Bend the knees a little if the back of the legs pulls. Head-below-heart caution: the head goes below the heart, so come up slowly, and skip with high blood pressure, eye pressure problems or in later pregnancy.","Prasarita means spread out, pada means foot, uttana means intense stretch."],
];
PL.sort((a,b)=>a[0][0]===b[0][0]? parseInt(a[0].slice(2))-parseInt(b[0].slice(2)) : a[0]<b[0]?-1:1);
const ADVANCED=[];
const poseKey=k=>K[k]||S[k];
let libGroup="D", libGoal=null, holdTimer=null;
function drawPoseCanvas(c,key){
  sizeCanvas(c); const x=c.getContext("2d"), W=c.width, H=c.height, g=GUIDES[guide], P=poseKey(key);
  x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,W,H); const gr=x.createLinearGradient(0,0,0,H); gr.addColorStop(0,css("--sky1")); gr.addColorStop(1,css("--sky2")); x.fillStyle=gr; x.fillRect(0,0,W,H);
  x.fillStyle=css("--ground"); x.fillRect(0,H*.84,W,H*.16);
  const s=Math.min(W/120,H*.8/95); x.setTransform(s,0,0,s,W*.5,H*.84); x.scale(g.k,g.k); figure(x,P,g);
}
function chipGroup(title,list){ return `<div class="cg"><div class="label">${title}</div><div class="chips">${list.map(([k,l,t,path])=>`<button class="cap" data-t="${encodeURIComponent(t)}" data-path="${path||""}">${l}</button>`).join("")}</div></div>`; }
function renderLib(){
  const hasPh=g=>PL.some(p=>p[0][0]===g&&POSEPH[p[3]]);
  if(!hasPh(libGroup)) libGroup=Object.keys(GROUPS).find(hasPh)||libGroup;
  $("#groupBar").innerHTML=Object.entries(GROUPS).filter(([k])=>hasPh(k)).map(([k,v])=>`<button class="cap" aria-pressed="${k===libGroup}" data-g="${k}"><b>${k}</b> ${v}</button>`).join("");
  $("#goalBar").innerHTML=`<button class="cap" aria-pressed="${!libGoal}" data-goal="">All goals</button>`+Object.entries(GOALS).map(([k,[l]])=>`<button class="cap" aria-pressed="${k===libGoal}" data-goal="${k}">${l}</button>`).join("");
  $("#goalNote").innerHTML=libGoal?`<strong>${GOALS[libGoal][0]}.</strong> ${GOALS[libGoal][1]}`:"";
  const list=PL.filter(p=>libGoal? p[7].includes(libGoal) : p[0][0]===libGroup);
  const kidsOnly=GUIDES[guide].k<.8;
  let html=list.filter(p=>POSEPH[p[3]]&&!(kidsOnly&&/Advanced/.test(p[5]))).map(p=>{ const [code,en,sa,key,short,lvl,hold,goals,steps,care,story]=p;
    return `<article class="pcard"><h3><span class="code">${code}</span> ${en}<span class="sa">${sa}</span></h3>${poseImg(POSEPH[key])}
    <p>${short}</p><div class="badges"><span class="badge ${/Advanced/.test(lvl)?"adv":""}">${lvl}</span><span class="badge">Hold ${hold} s</span></div>
    <button class="btn more" aria-expanded="false">Read more</button>
    <div class="moreBody" hidden><ol>${steps.map(s=>`<li>${s}</li>`).join("")}</ol>
      ${chipGroup("Your goal",goals.map(g=>[g,GOALS[g][0],GOALS[g][1],g]))}
      ${chipGroup("Your belief and background",Object.entries(BELIEF).filter(([k])=>k!=="spiritual"||spiritOn()).map(([k,[l,t]])=>[k,l,k==="spiritual"?story+" "+t:t,""]))}
      ${chipGroup("Level and time",[["lvl",lvl,"Level: "+lvl+". Hold for about "+hold+" seconds, or 3 to 6 slow breaths. Repeat 2 to 3 times.",""]])}
      ${chipGroup("Cautions",[["care","Read before you start",care+" This is general education, not medical advice.",""]])}
      <div class="capInfo" hidden></div>
      <button class="btn solid hold" data-h="${hold}" data-c="${code}">Start ${hold} s hold</button><span class="holdOut" aria-live="polite"></span>
    </div></article>`; }).join("");
  if(!libGoal&&libGroup==="F") html=`<div class="panel"><h2>Upside-down poses</h2><p>Only with a qualified teacher present, after months of regular practice. Never with neck problems, high blood pressure, heart disease, eye pressure problems, ear infection, during menstruation or in pregnancy. Shoulder stand (A-8) is the first step toward this group.</p></div>`+html;
  $("#poses").innerHTML=html||`<p class="hint">No poses match this goal yet.</p>`;
  $("#advList").innerHTML=ADVANCED.map(n=>`<li><strong>${n}</strong><span class="badge adv">Teacher-guided</span></li>`).join("");
  $("#advWrap").hidden=kidsOnly||(BUILD==="public"&&!gate.ok);
  $("#idxNote").textContent=libGroup==="B"&&!libGoal?"Numbering follows your Group B overview page. The detail pages swap two numbers: they call the Bow B-7 and Shashankasana B-10, while the overview has Shashankasana as B-7 and the Bow as B-10. The overview numbers are used here.":"";
  document.querySelectorAll("#groupBar .cap").forEach(b=>b.onclick=()=>{ libGroup=b.dataset.g; libGoal=null; renderLib(); });
  document.querySelectorAll("#goalBar .cap").forEach(b=>b.onclick=()=>{ libGoal=b.dataset.goal||null; renderLib(); });
  document.querySelectorAll(".pcard").forEach(card=>{
    const m=card.querySelector(".more"), body=card.querySelector(".moreBody"), info=card.querySelector(".capInfo");
    m.onclick=()=>{ body.hidden=!body.hidden; m.setAttribute("aria-expanded",!body.hidden); m.textContent=body.hidden?"Read more":"Show less"; };
    card.querySelectorAll(".chips .cap").forEach(c=>c.onclick=()=>{ card.querySelectorAll(".chips .cap").forEach(x=>x.removeAttribute("aria-pressed")); c.setAttribute("aria-pressed","true");
      const path=c.dataset.path; info.hidden=false; info.innerHTML=`<p>${decodeURIComponent(c.dataset.t)}</p>`+(path?`<button class="linkbtn" data-path="${path}">Follow this path</button>`:"");
      const lb=info.querySelector(".linkbtn"); if(lb) lb.onclick=()=>{ libGoal=path; renderLib(); $("#posesWrap").scrollIntoView({behavior:reduce?"auto":"smooth"}); }; });
    const hb=card.querySelector(".hold"), out=card.querySelector(".holdOut");
    hb.onclick=()=>{ clearInterval(holdTimer); const a=audio(); if(a&&a.state==="suspended") a.resume(); let left=+hb.dataset.h, t=0;
      const tick=()=>{ if(left<=0){ clearInterval(holdTimer); out.textContent=" Release slowly. Well done."; bell(); markPose(hb.dataset.c); return; }
        const inh=Math.floor(t/4)%2===0; if(t%4===0) musicLevel(inh,4); out.textContent=` ${left} s · ${inh?"breathe in":"breathe out"}`; left--; t++; };
      tick(); holdTimer=setInterval(tick,1000); };
  });
}
/* More lessons. Members-only topics need the entry screen first. */
function hand(spec){
  const fx=[25,36,47,57], len=[30,34,31,24], ink=css("--ink"), soft=css("--soft");
  const st=(d,w)=>`<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w+2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${soft}" stroke-width="${w}" stroke-linecap="round"/>`;
  let back="", front="";
  spec.f.forEach((s,i)=>{ const x=fx[i];
    if(s==="u") back+=st(`M${x} 60 L${x} ${58-len[i]}`,8);
    else if(s==="t") back+=st(`M${x} 60 Q${x} 30 14 48`,7);
    else if(s==="b") back+=st(`M${x} 60 Q${x} 42 26 74`,7);
    else front+=st(`M${x} 62 L${x} 70`,8); });
  const th={out:"M22 92 L6 62",touch:"M22 92 L13 50",in:"M22 92 L46 82",up:"M22 92 L17 42",over:"M22 92 L50 68"}[spec.th];
  const palm=`<rect x="18" y="55" width="46" height="50" rx="12" fill="${soft}" stroke="${ink}" stroke-width="1"/>`;
  return back+palm+front+st(th,8);
}
const MUDRAS=[
 ["bhairava","Bhairava","Right hand rests on the left, palms up, in the lap.","Meditation",{two:"stack"}],
 ["bhairavi","Bhairavi","Left hand rests on the right, palms up, in the lap.","Meditation",{two:"stack"}],
 ["nasika","Nasika","Fold the index and middle fingers. Thumb and ring finger close the nostrils in turn.","Alternate nostril breathing",{f:["c","c","u","u"],th:"out"}],
 ["namaskara","Namaskara","Palms together at the chest.","Greeting, centring",{two:"namaste"}],
 ["brahma","Brahma","Both fists, thumbs tucked inside, knuckles touching at the navel.","Full breathing",{f:["c","c","c","c"],th:"in"}],
 ["hrudaya","Hrudaya","Index finger to the base of the thumb; middle and ring fingers to the thumb tip; little finger straight.","Quiet sitting",{f:["b","t","t","u"],th:"touch"}],
 ["jnana","Jnana","Index tip touches the thumb tip; other fingers straight; palms up on the knees.","Meditation",{f:["t","u","u","u"],th:"touch"}],
 ["chin","Chin","As Jnana, with the palms facing down on the knees.","Grounded sitting",{f:["t","u","u","u"],th:"touch"}],
 ["chinmaya","Chinmaya","Index to thumb; the other three fingers fold into the palm.","Chest breathing",{f:["t","c","c","c"],th:"touch"}],
 ["musti","Musti","A soft fist with the thumb over the fingers.","Steady attention",{f:["c","c","c","c"],th:"over"}],
 ["adi","Adi","Thumb tucked into the palm, fingers folded over it.","Upper-chest breathing",{f:["c","c","c","c"],th:"in"}],
 ["linga","Linga","Fingers interlaced, one thumb pointing up.","Warmth, steadiness",{f:["c","c","c","c"],th:"up"}],
 ["surya","Surya","Ring finger folds under the thumb; other fingers straight.","Alertness",{f:["u","u","c","u"],th:"over"}],
 ["shanmukha","Shanmukha","Thumbs close the ears, index fingers rest on the eyelids, middle fingers beside the nose, ring and little fingers around the lips.","Turning the senses inward (with humming breath)",{face:"shan"}],
 ["kaka","Kaka","Purse the lips like a beak and sip the air in slowly; breathe out through the nose.","Cooling breath",{face:"kaka"}],
 ["kechari","Kechari","The tip of the tongue rests lightly on the roof of the mouth. Advanced forms only with a teacher.","Quiet sitting",{face:"kechari"}]
];
function mudraSVG(m){
  const sp=m[4], ink=css("--ink"), soft=css("--soft"), hl=css("--hl");
  if(sp.face){ let s=`<ellipse cx="120" cy="130" rx="60" ry="74" fill="${soft}"/><path d="M95 112 q8 6 16 0 M129 112 q8 6 16 0" stroke="${ink}" fill="none" stroke-width="2"/><path d="M120 118 L114 146 Q120 150 126 146" stroke="${ink}" fill="none" stroke-width="2"/>`;
    if(sp.face==="shan") s+=`<path d="M100 166 Q120 172 140 166" stroke="${ink}" fill="none" stroke-width="2"/>`+[[58,130],[182,130],[103,112],[137,112],[110,140],[130,140],[104,166],[136,166]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="${hl}" opacity=".75"/>`).join("");
    if(sp.face==="kaka") s+=`<ellipse cx="120" cy="168" rx="7" ry="5" fill="none" stroke="${ink}" stroke-width="2"/><path d="M120 196 L120 176" stroke="${hl}" stroke-width="2" marker-end="none"/>`;
    if(sp.face==="kechari") s+=`<path d="M102 166 Q120 172 138 166" stroke="${ink}" fill="none" stroke-width="2"/><text x="120" y="230" text-anchor="middle" class="sm">tongue rests on the roof of the mouth</text>`;
    return s; }
  if(sp.two==="namaste") return `<g transform="translate(55 40) scale(1.6)">${hand({f:["u","u","u","u"],th:"up"})}</g><g transform="translate(185 40) scale(-1.6 1.6)">${hand({f:["u","u","u","u"],th:"up"})}</g>`;
  if(sp.two==="stack") return `<g transform="translate(50 30) scale(1.5)">${hand({f:["u","u","u","u"],th:"out"})}</g><g transform="translate(80 90) scale(1.5)" opacity=".85">${hand({f:["u","u","u","u"],th:"out"})}</g><text x="120" y="270" text-anchor="middle" class="sm">${m[0]==="bhairava"?"right hand on top":"left hand on top"}</text>`;
  return `<g transform="translate(60 40) scale(1.8)">${hand(sp)}</g>`;
}
let medStep=0;
Object.assign(TOPICS,{
 tree:{name:"The yoga tree",open:1,
  intro:["The yoga tree: four paths","A traditional picture of yoga as a tree. Tap a part to read about that path."],
  items:{karma:["Karma yoga","The roots: action","Doing your work well and without selfishness, through the senses and hands that act in the world.","Serve, help, finish what you start."],
         bhakti:["Bhakti yoga","The trunk: devotion","Love and gratitude toward what you hold highest. It carries strength from the roots to the branches.","Gratitude, kindness, prayer or quiet thanks in your own way."],
         jnana:["Jnana yoga","The canopy: knowledge","Study and clear thinking about who we are.","Read, reflect, ask questions."],
         raja:["Raja yoga","The crown: the mind","Training the mind through posture, breath and meditation. The eight limbs belong here.","Daily practice on this site."]},
  draw(){ const g=css("--acc"), h=css("--hl");
    let s=`<defs><linearGradient id="trk" x1="0" x2="1"><stop offset="0" stop-color="#6b4a2e"/><stop offset=".5" stop-color="#9a7048"/><stop offset="1" stop-color="#5a3d26"/></linearGradient><radialGradient id="cn1" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#7fb58a"/><stop offset="1" stop-color="#2f6b4a"/></radialGradient><radialGradient id="cn2" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#9cc9a0"/><stop offset="1" stop-color="#3f8460"/></radialGradient><radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f4c77a"/><stop offset="1" stop-color="#f4c77a" stop-opacity="0"/></radialGradient><linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c7a4"/><stop offset="1" stop-color="#efe6d2"/></linearGradient></defs>`;
    s+=`<circle id="treeSun" cx="120" cy="22" r="22" fill="url(#sun)"/><circle cx="120" cy="22" r="6" fill="#e9a85c"/>`;
    s+=`<rect x="0" y="200" width="240" height="80" fill="url(#soil)"/><path d="M0 200 Q60 196 120 200 T240 200" fill="none" stroke="#a88f64" stroke-width=".8"/>`;
    s+=`<g class="hot" data-k="karma" tabindex="0" role="button" aria-label="Karma yoga"><path class="zone" d="M40 200 h160 v76 h-160z"/>${[[-64,246],[-40,258],[-16,264],[16,264],[40,258],[64,246]].map(([d,y])=>`<path d="M118 200 C118 222 ${120+d*.4} 236 ${120+d} ${y} M122 200 C122 222 ${120+d*.4} 236 ${120+d} ${y}" stroke="#7a5634" fill="none" stroke-width="1.4" stroke-linecap="round"/><path d="M${120+d} ${y} q${d>0?5:-5} 7 ${d>0?10:-10} 9" stroke="#7a5634" fill="none" stroke-width=".7"/>`).join("")}<text x="120" y="277" text-anchor="middle">Karma · the roots</text></g>`;
    s+=`<g class="hot" data-k="bhakti" tabindex="0" role="button" aria-label="Bhakti yoga"><path class="zone" d="M96 112 h48 v88 h-48z"/><path d="M106 202 C112 170 110 140 112 110 L128 110 C130 140 128 170 134 202 C126 198 114 198 106 202Z" fill="url(#trk)" stroke="#4a3220" stroke-width=".6"/><path d="M116 190 C118 160 117 140 118 116" stroke="#c9a47a" stroke-width=".6" fill="none" opacity=".5"/><text x="150" y="162">Bhakti · the trunk</text></g>`;
    s+=`<g class="hot" data-k="jnana" tabindex="0" role="button" aria-label="Jnana yoga"><circle class="zone" cx="78" cy="82" r="50"/><path d="M118 112 C96 124 52 120 40 92 C32 66 52 44 80 46 C104 48 122 70 118 112Z" fill="url(#cn1)" stroke="#2a5a3e" stroke-width=".6"/><text x="80" y="86" text-anchor="middle" class="onleaf">Jnana</text><text x="80" y="97" text-anchor="middle" class="onleaf sm2">knowledge</text></g>`;
    s+=`<g class="hot" data-k="raja" tabindex="0" role="button" aria-label="Raja yoga"><circle class="zone" cx="162" cy="82" r="50"/><path d="M122 112 C144 124 188 120 200 92 C208 66 188 44 160 46 C136 48 118 70 122 112Z" fill="url(#cn2)" stroke="#2a5a3e" stroke-width=".6"/><text x="160" y="86" text-anchor="middle" class="onleaf">Raja</text><text x="160" y="97" text-anchor="middle" class="onleaf sm2">the mind</text></g>`;
    return s; }},
 limbs:{name:"Meditation and the eight limbs",open:1,
  intro:["Meditation and the eight limbs","The classical path of Raja yoga has eight limbs, shown as a ring. Meditation grows from the inner limbs. Tap a limb, or press Start for a short guided sit."],
  items:{yama:["Yama","1. How we treat others","Non-harming, truthfulness, not stealing, moderation, not grasping.","Kind words, honest dealings."],
         niyama:["Niyama","2. How we treat ourselves","Cleanliness, contentment, discipline, self-study, surrender to something greater.","A clean space, a steady routine."],
         asana:["Asana","3. Posture","A seat that is steady and comfortable.","The pose library."],
         pranayama:["Pranayama","4. Breath","Lengthening and guiding the breath.","The breathing practices."],
         pratyahara:["Pratyahara","5. Senses turned inward","Letting outside sights and sounds fade.","Eyes closed, humming breath."],
         dharana:["Dharana","6. Concentration","Holding attention on one point.","Breath counting, candle gazing."],
         dhyana:["Dhyana","7. Meditation","Attention flows without effort.","Sit daily, even five minutes."],
         samadhi:["Samadhi","8. Absorption","Complete stillness and unity, described as the fruit of practice.","Not forced; it comes in its own time."]},
  steps:["Settle: sit tall, close the eyes.","Body: relax the face, shoulders and belly.","Breath: notice ten slow breaths.","Focus: rest on the breath at the nostrils, or a sound like AUM.","Open: let thoughts pass like clouds.","Return: three deep breaths, open the eyes slowly."],
  draw(){ const keys=Object.keys(this.items); let s=`<circle cx="120" cy="140" r="34" fill="${css("--soft")}"/><text x="120" y="137" text-anchor="middle">Meditation</text><text x="120" y="148" text-anchor="middle" class="sm" id="medTxt">sit and breathe</text>`;
    keys.forEach((k,i)=>{ const a=(-90+i*45)*Math.PI/180, x=120+92*Math.cos(a), y=140+92*Math.sin(a);
      s+=`<g class="hot" data-k="${k}" tabindex="0" role="button" aria-label="${this.items[k][0]}"><circle class="zone" cx="${x}" cy="${y}" r="24"/><circle class="ring" cx="${x}" cy="${y}" r="20"/><text x="${x}" y="${y+3}" text-anchor="middle" class="sm">${this.items[k][0]}</text></g>`; });
    return s; },
  extra:`<div class="ys6"><button class="btn solid" id="medGo">Start a 6-step sit</button><button class="btn" id="medStop">Stop</button></div>`},
 mudra:{name:"Mudras (hand gestures)",open:1,
  intro:["Mudras: hand gestures","Sixteen traditional hand gestures used with breathing and meditation. Pick one to see how to hold it."],
  items:Object.fromEntries(MUDRAS.map(m=>[m[0],[m[1]+" mudra",m[3],m[2],"Hold for a few minutes while breathing slowly."]])),
  draw(){ const m=MUDRAS.find(x=>x[0]===(mapSel||"jnana")); return mudraSVG(m)+`<text x="120" y="22" text-anchor="middle">${m[1]} mudra</text>`; },
  extra:`<div class="chips" id="mudraChips">${MUDRAS.map(m=>`<button class="cap" data-m="${m[0]}">${m[1]}</button>`).join("")}</div>`},
 bandha:{name:"Body locks",gated:1,members:1},
 eyes:{name:"Eye exercises",open:1,
  intro:["Eye exercises (Trataka)","Gentle eye movements and steady gazing. Choose an exercise and follow the dot with the eyes only, head still."],
  items:{},
  draw(){ let s=`<circle cx="120" cy="140" r="96" fill="none" stroke="${css("--line")}" stroke-width="1.5"/>`;
    for(let i=1;i<=12;i++){ const a=(i*30-90)*Math.PI/180; s+=`<text x="${120+108*Math.cos(a)}" y="${143+108*Math.sin(a)}" text-anchor="middle" class="sm">${i}</text>`; }
    return s+`<g id="eyeLayer"></g><circle id="eyeDot" cx="120" cy="140" r="8" fill="${css("--hl")}"/><text x="120" y="272" text-anchor="middle" id="eyeTxt">Choose an exercise</text>`; },
  extra:`<div class="seg" role="group" aria-label="Eye exercise"><button data-v="clock">Clock</button><button data-v="updown">Up and down</button><button data-v="side">Side to side</button><button data-v="circle">Circles</button><button data-v="candle">Candle gaze</button></div>
   <p><strong>Take care:</strong> blink whenever you need to and never strain. Rub the palms warm and rest them over closed eyes after each exercise. Skip candle gazing with epilepsy, glaucoma, recent eye surgery or eye pain. Keep a real candle at arm's length at eye level and never leave it unattended.</p>`},
 aumsea:{name:"AUM and the three seas",spiritual:1,
  intro:["AUM and the three seas","A traditional teaching image: at India's southern tip three waters meet. The Arabian Sea is linked with A, the Indian Ocean with U, and the Bay of Bengal with M. Together they make AUM, as the three sounds join in one chant. Shown only on the spiritual track."],
  items:{A:["A","Arabian Sea","The open first sound, felt low in the body.","Chant A for three counts."],U:["U","Indian Ocean","The rounded middle sound, felt in the chest.","Chant U for three counts."],M:["M","Bay of Bengal","The closing hum, felt in the head.","Hum M for five counts."]},
  draw(){ const ink=css("--ink"), soft=css("--soft"), acc=css("--acc");
    let s=`<rect x="0" y="0" width="240" height="280" fill="${acc}" opacity=".12"/><path d="M60 20 L180 20 L170 90 L150 150 L128 220 L120 238 L112 220 L90 150 L70 90 Z" fill="${soft}" stroke="${ink}" stroke-width="1"/>`;
    return s+[["A",40,180],["U",120,262],["M",200,180]].map(([k,x,y])=>`<g class="hot" data-k="${k}" tabindex="0" role="button" aria-label="${this.items[k][1]}"><circle class="zone" cx="${x}" cy="${y}" r="24"/><circle class="ring" cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="14px">${k}</text><text x="${x}" y="${y-24}" text-anchor="middle" class="sm">${this.items[k][1]}</text></g>`).join("")+`<text x="120" y="60" text-anchor="middle" class="sm">India (our outline)</text>`; }},
 repro:{name:"Reproductive system (adults)",gated:1,adult:1,members:1}
});
TOPICS.kosha.gated=1; TOPICS.vayu.gated=1; TOPICS.lungs.gated=1; TOPICS.nerves.gated=1; TOPICS.senses.gated=1; TOPICS.food.gated=1; TOPICS.muscle.gated=1;
let gate={ok:false,adult:false};
if(BUILD==="public"){ const m=window.HFL_MEMBER; gate={ok:false,adult:false}; /* public copy: members lessons are not in this file */ }
const isKid=()=>GUIDES[guide].k<.8;
function topicVisible(k){ const T=TOPICS[k]; if(T.optin&&!$("#tSpirit").checked) return false; if(T.spiritual&&!spiritOn()) return false; if(T.adult&&(isKid()||(gate.ok&&!gate.adult))) return false; return true; }
function eyeRun(mode){
  stopMapAnim(); const t0=performance.now(), dot=$("#eyeDot"), txt=$("#eyeTxt"), layer=$("#eyeLayer");
  const step=ts=>{ const t=(ts-t0)/1000; let x=120,y=140;
    if(mode==="clock"){ const i=Math.floor(t/2)%12+1, a=(i*30-90)*Math.PI/180; x=120+96*Math.cos(a); y=140+96*Math.sin(a); txt.textContent="Look at "+i+" o'clock"; layer.innerHTML=""; }
    else if(mode==="updown"){ const up=Math.floor(t/2)%2===0; y=up?44:236; txt.textContent=up?"Look up":"Look down"; }
    else if(mode==="side"){ const l=Math.floor(t/2)%2===0; x=l?24:216; txt.textContent=l?"Look left":"Look right"; }
    else if(mode==="circle"){ const dir=Math.floor(t/16)%2===0?1:-1, a=dir*t*Math.PI*2/8; x=120+96*Math.cos(a); y=140+96*Math.sin(a); txt.textContent=dir>0?"Circle clockwise":"Circle the other way"; }
    else { const fl=1+.08*Math.sin(t*9)+.05*Math.sin(t*13); const left=Math.max(0,60-Math.floor(t));
      layer.innerHTML=`<rect x="114" y="150" width="12" height="60" fill="${css("--soft")}"/><path d="M120 ${150-34*fl} Q132 136 120 150 Q108 136 120 ${150-34*fl}Z" fill="${css("--hl")}"/>`;
      y=126; txt.textContent=left>0?"Gaze softly at the flame: "+left+" s":"Close the eyes and watch the after-image"; if(t>90){ stopMapAnim(); txt.textContent="Done. Palm the eyes and rest."; return; } }
    dot.setAttribute("cx",x); dot.setAttribute("cy",y); dot.setAttribute("opacity",mode==="candle"?0:1);
    mapAnim=requestAnimationFrame(step); };
  mapAnim=requestAnimationFrame(step);
}
function medRun(){
  stopMapAnim(); const T=TOPICS.limbs, t0=performance.now(); const a=audio(); if(a&&a.state==="suspended") a.resume();
  let last=-1;
  const step=ts=>{ const t=Math.max(0,(ts-t0)/1000), i=Math.floor(t/30); if(i>=T.steps.length){ $("#medTxt").textContent="Well done"; bell(); return; }
    if(i!==last){ last=i; $("#medTxt").textContent=(i+1)+" of 6"; if($("#tCues").checked) say(T.steps[i]); bell(); const c=$("#medCue"); if(c) c.textContent=T.steps[i]; }
    musicLevel(Math.floor(t/5)%2===0,5); mapAnim=requestAnimationFrame(step); };
  mapAnim=requestAnimationFrame(step);
}
function renderMap(){
  stopMapAnim();
  if(!topicVisible(mapTopic)) mapTopic="tree";
  const T=TOPICS[mapTopic];
  $("#topics").innerHTML=Object.entries(TOPICS).filter(([k])=>topicVisible(k)&&LESSON_PHOTO[k]).sort((a,b)=>(!!a[1].gated)-(!!b[1].gated)).map(([k,t])=>`<button data-t="${k}" aria-current="${k===mapTopic}">${t.name}${t.gated?' <span class="lock">Members</span>':""}</button>`).join("");
  document.querySelectorAll("#topics button").forEach(b=>b.onclick=()=>{ mapTopic=b.dataset.t; mapSel=null; renderMap(); });
  const locked=T.gated&&!gate.ok;
  $("#gate").hidden=!locked; $("#mapBody").hidden=locked;
  if(locked) return;
  const ph=phSrc(MAPPH[mapTopic]||"pose:lotus"), im=$("#mphoto"); im.src=ph[0]; im.srcset=ph[0]+" 800w, "+ph[1]+" 1600w"; im.alt="Studio photograph for "+T.name; $("#mwm").textContent=vid+" · "+new Date().toISOString().slice(0,10); $("#msvg").innerHTML="";
  const sel=mapSel&&T.items[mapSel]?T.items[mapSel]:null;
  $("#mtext").innerHTML=`<div class="card"><h3>${T.intro[0]}</h3><p>${T.intro[1]}</p>${mapTopic==="mudra"?(T.extra||""):""}${mapTopic==="limbs"?'<p id="medCue" class="breath ys7"></p>':""}</div>`+
    (sel?`<div class="card"><div class="label">${sel[1]}</div><h3>${sel[0]}</h3><p>${sel[2]}</p><p><strong>In practice:</strong> ${sel[3]}</p></div>`:"")+
    `<p class="hint">General education in our own words, not medical advice.</p>`;
  const itemKeys=mapTopic==="mudra"?[]:Object.keys(T.items||{}); if(itemKeys.length){ $("#mtext").insertAdjacentHTML("afterbegin",`<div class="chips mitems">${itemKeys.map(k=>`<button class="cap" data-k="${k}" aria-pressed="${k===mapSel}">${T.items[k][0]}</button>`).join("")}</div>`); document.querySelectorAll("#mtext .mitems .cap").forEach(b=>b.onclick=()=>{ mapSel=b.dataset.k; renderMap(); }); }
  if(mapTopic!=="mudra") return;
  document.querySelectorAll("#msvg .hot").forEach(g=>{ if(g.dataset.k===mapSel) g.classList.add("on");
    const pick=()=>{ mapSel=g.dataset.k; renderMap(); }; g.onclick=pick; g.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pick(); } }; });
  if(mapTopic==="nerves") document.querySelectorAll(".seg button").forEach(b=>{ b.setAttribute("aria-pressed",b.dataset.v===(mapSel||"calm")); b.onclick=()=>{ mapSel=b.dataset.v; renderMap(); }; });
  if(mapTopic==="eyes") document.querySelectorAll(".seg button").forEach(b=>{ b.setAttribute("aria-pressed","false"); b.onclick=()=>{ document.querySelectorAll(".seg button").forEach(x=>x.setAttribute("aria-pressed",x===b)); eyeRun(b.dataset.v); }; });
  if(mapTopic==="mudra") document.querySelectorAll("#mudraChips .cap").forEach(b=>{ if(b.dataset.m===(mapSel||"jnana")) b.setAttribute("aria-pressed","true"); b.onclick=()=>{ mapSel=b.dataset.m; renderMap(); }; });
  if(mapTopic==="limbs"){ $("#medGo").onclick=medRun; $("#medStop").onclick=()=>{ stopMapAnim(); try{speechSynthesis.cancel()}catch(e){} }; }
  if(mapTopic==="repro"){ const b=$("#reproOpen"); b.setAttribute("aria-expanded",mapSel==="open"); b.textContent=mapSel==="open"?"Hide this section":"Show this section"; b.onclick=()=>{ mapSel=mapSel==="open"?null:"open"; renderMap(); }; }
  if(mapTopic==="heart"){ heartRun(); $("#toAnahata").onclick=()=>{ if(!$("#tSpirit").checked){ $("#toAnahata").textContent="Tick 'Show spiritual content' in Your practice track to see it"; return; } mapTopic="chakra"; mapSel="anahata"; renderMap(); }; }
  if(mapTopic==="stomach"){ $("#stPlay").onclick=stRun; $("#stPrev").onclick=()=>{ stStep=Math.max(0,stStep-1); renderMap(); }; $("#stNext").onclick=()=>{ stStep=Math.min(5,stStep+1); renderMap(); }; stWave(); }
  if(mapTopic==="pituitary"){ const b=$("#pitRepro"); if(isKid()||!gate.adult){ b.hidden=true; } b.setAttribute("aria-expanded",pitRepro); b.textContent=pitRepro?"Hide reproductive hormones":"Show reproductive hormones (adults)"; b.onclick=()=>{ pitRepro=!pitRepro; mapSel=null; renderMap(); }; }
  if(mapTopic==="aumsea"){ $("#seaGo").onclick=seaRun; }
  if(mapTopic==="kundalini"){ $("#kGo").onclick=kundRun; $("#kStop").onclick=()=>{ stopMapAnim(); hush(); $("#kTxt").textContent="Stopped"; }; }
  if(mapTopic==="inward"){ $("#inGo").onclick=inwardRun; $("#inStop").onclick=()=>{ stopMapAnim(); try{speechSynthesis.cancel()}catch(e){} $("#inTxt").textContent="Stopped"; }; }
  if(mapTopic==="lungs"){ $("#lungGo").onclick=lungRun; $("#lungStop").onclick=()=>{ stopMapAnim(); $("#lungTxt").textContent="Stopped"; }; }
  if(mapTopic==="food" && !reduce){ const path=$("#gut"), L=path.getTotalLength(), dot=$("#bolus"); const t0=performance.now();
    const step=ts=>{ const q=((ts-t0)/14000)%1, p=path.getPointAtLength(q*L); dot.setAttribute("cx",p.x); dot.setAttribute("cy",p.y); mapAnim=requestAnimationFrame(step); }; mapAnim=requestAnimationFrame(step); }
}
function wmSVG(){ return `<text class="ys8" x="236" y="283" text-anchor="end">${vid} · ${new Date().toISOString().slice(0,10)}</text>`; }
if($("#gateForm")) $("#gateForm").addEventListener("submit",e=>{ e.preventDefault();
  const id=$("#gId").value.trim(), pw=$("#gPw").value, age=document.querySelector('input[name="gAge"]:checked'), ok=$("#gAgree").checked;
  $("#gPw").value="";
  if(!id||!pw){ $("#gMsg").textContent="Enter your member ID and password."; return; }
  if(!age){ $("#gMsg").textContent="Choose your age option."; return; }
  if(!ok){ $("#gMsg").textContent="Tick the box to agree to the code of conduct and terms."; return; }
  gate={ok:true,adult:age.value==="adult"}; $("#gMsg").textContent=""; renderMap(); });
["copy","cut","contextmenu","dragstart"].forEach(ev=>$("#memberWrap").addEventListener(ev,e=>e.preventDefault()));
$("#reportBtn").onclick=()=>{ $("#reportBox").hidden=!$("#reportBox").hidden; };
$("#reportSend").onclick=()=>{ const v=$("#reportTxt").value.trim(); if(!v){ $("#reportMsg").textContent="Please describe the problem first."; return; }
  const who=MEM&&MEM.id?"Member ID: "+MEM.id+"\n":"";
  if(window.siteMessage){ window.siteMessage.open({to:"engage@hfl-pass.com",team:"Learning safety",subject:"Report a concern: Yoga chapter",message:who+"Page: "+location.href.split("#")[0]+"\n\n"+v}); $("#reportMsg").textContent="Your message is ready to send. Our moderators read every report."; $("#reportTxt").value=""; }
  else { location.href="mailto:engage@hfl-pass.com?subject="+encodeURIComponent("Report a concern: Yoga chapter")+"&body="+encodeURIComponent(v); } };

/* Practice track: universal by default; traditions and chants are opt-in. */
const TRAD=[
 ["universal","Universal (default)","Breath, body and mind. Every person is a living being with an inner life; practice helps that life feel steady and clear. No belief needed.","Silent breath focus, or humming breath.","western"],
 ["cosmic","Cosmic wonder","For anyone who finds meaning in the universe itself: the same elements that make the stars make us. Sit with that wonder.","A slow hum while picturing the night sky.","eastasian"],
 ["humanist","Secular and humanist","Practice for health, clarity and kindness to others, grounded in evidence and reason.","Counting ten slow breaths.","piano"],
 ["hindu","Hindu","Practice as an offering, with gratitude to the source of all life.","AUM chanting; the traditional chants below.","hindustani"],
 ["buddhist","Buddhist","Practise mindful breathing and loving-kindness toward all beings.","Mindful breathing; a quiet loving-kindness wish.","eastasian"],
 ["jain","Jain","Practise with non-harming and calm, gentle with every living being.","Silent breath focus with an intention of non-harm.","hindustani"],
 ["sikh","Sikh","Practise in remembrance and gratitude, with service to others.","Quiet remembrance in your own words, in rhythm with the breath.","hindustani"],
 ["christian","Christian","Practise stillness and gratitude; many use a short prayer word with the breath.","A short prayer of your choice, silently, on the out-breath.","western"],
 ["muslim","Muslim","Practise calm, cleanliness and gratitude; keep the movements as health exercise.","Silent remembrance in your own words, with slow breathing.","arabic"],
 ["jewish","Jewish","Practise gratitude for the breath of life and rest of body and mind.","A quiet word of thanks on each out-breath.","western"],
 ["bahai","Bahá'í","Practise reflection, unity and service.","Silent reflection with steady breathing.","western"],
 ["taoist","Taoist","Practise flowing with the natural way, soft and balanced.","Slow belly breathing, attention below the navel.","eastasian"],
 ["shinto","Shinto","Practise purity, gratitude and harmony with nature.","Breath with attention to the sounds of nature.","eastasian"],
 ["zoroastrian","Zoroastrian","Practise good thoughts, good words and good deeds.","Three breaths, one for each.","arabic"],
 ["indigenous","Indigenous and earth-based","Practise respect for the land, the ancestors and the community.","Breath with the feet on the ground, listening to nature.","nature"]
];
const CHANTS=[
 ["Before meals (Bhojan mantra)","Brahmarpanam brahma havir brahmagnau brahmana hutam, brahmaiva tena gantavyam brahma-karma-samadhina.","The offering, the food and the fire are all one sacred whole; whoever sees the sacred in every act reaches it."],
 ["Sun salutation verse","Om hiranmayena patrena satyasyapihitam mukham, tat tvam pushann apavrinu satya-dharmaya drishtaye.","The face of truth is covered by a golden lid; O nourishing sun, uncover it so that we may see the truth."],
 ["Purnamadah","Om purnam adah purnam idam, purnat purnam udacyate, purnasya purnam adaya purnam evavashishyate. Om shantih shantih shantih.","That is whole, this is whole. From the whole the whole arises. Take the whole from the whole and the whole remains."],
 ["Peace verse (Shanti patha)","Om bhadram karnebhih shrinuyama devah, bhadram pashyemakshabhir yajatrah, sthirair angais tushtuvamsas tanubhih, vyashema devahitam yad ayuh. Om shantih shantih shantih.","May our ears hear what is good, may our eyes see what is good. With steady bodies, may we live our full span in gratitude. Peace, peace, peace."],
 ["Gayatri","Om bhur bhuvah svah, tat savitur varenyam, bhargo devasya dhimahi, dhiyo yo nah prachodayat.","We meditate on the bright light of the sun, source of all; may it awaken our understanding."],
 ["Learning together (Saha navavatu)","Om saha navavatu, saha nau bhunaktu, saha viryam karavavahai, tejasvi navadhitam astu, ma vidvishavahai. Om shantih shantih shantih.","May we be protected together, nourished together, and work together with energy. May our learning be bright, and may there be no ill will between us. Peace, peace, peace."],
 ["Honouring those who guide us (Matru devo bhava)","Om matru devo bhava, om pitru devo bhava, om atithi devo bhava, om acharya devo bhava. Om shantih shantih shantih.","Honour your mother as sacred. Honour your father as sacred. Honour your guest as sacred. Honour your teacher as sacred."],
 ["The nine heavenly bodies (Navagraha)","Om namah suryaya chandraya mangalaya budhaya cha, guru shukra shanibhyash cha rahave ketave namah. Om shantih shantih shantih.","Salutations to the Sun, the Moon, Mars, Mercury, Jupiter, Venus and Saturn, and to Rahu and Ketu, the two lunar nodes. Traditionally chanted three or nine times."],
 ["For health and freedom from fear (Maha Mrityunjaya)","Om tryambakam yajamahe sugandhim pushtivardhanam, urvarukam iva bandhanan mrityor mukshiya mamritat. Om shantih shantih shantih.","We honour the three-eyed one, fragrant, who nourishes all. As a ripe cucumber is freed from its vine, may we be freed from death, and not from what is everlasting."],
 ["May all be well (Sarve bhavantu)","Om sarve bhavantu sukhinah, sarve santu niramayah, sarve bhadrani pashyantu, ma kashchid duhkha bhag bhavet. Om shantih shantih shantih.","May all be happy. May all be free from illness. May all see what is good. May no one suffer."],
 ["Before asana practice (Yogena chittasya)","Yogena chittasya padena vacham, malam sharirasya cha vaidyakena, yo'pakarot tam pravaram muninam, patanjalim pranjalir anato'smi. Om shantih shantih shantih.","With folded hands I bow to Patanjali, the finest of sages, who removed impurity of the mind through yoga, of speech through grammar, and of the body through medicine."],
 ["From darkness to light (Asato ma)","Om asato ma sad gamaya, tamaso ma jyotir gamaya, mrityor ma amritam gamaya. Om shantih shantih shantih.","Lead me from the unreal to the real. Lead me from darkness to light. Lead me from death to what is everlasting."],
 ["Before breathing practice (Pranasyedam)","Om pranasyedam vashe sarvam, tridive yat pratishthitam, mateva putran rakshasva, shrishcha prajnam cha vidhehi na iti. Om shantih shantih shantih.","All that exists, even in the heavens, rests in the power of the life breath. Protect us as a mother protects her children, and grant us well-being and wisdom."],
 ["Five elements (Panchasheela)","Om akasha deva bhava, om agni deva bhava, om prithvi deva bhava, om vayu deva bhava, om jala deva bhava. Lokah samastah sukhino bhavantu.","Honour to space, fire, earth, air and water. May all beings everywhere be happy."]
];
const spiritOn=()=>$("#tSpirit").checked && $("#trad").value!=="universal" && $("#trad").value!=="humanist";
function renderOrigin(){
  const t=$("#trad").value, deep=spiritOn()&&t==="hindu";
  const story="In the yogic tradition, yoga began with Shiva, honoured as the <strong>Adi Yogi</strong>, the first yogi. He is said to have first taught it to seven sages, the Saptarishis, who carried it to people across the world. Much later the sage <strong>Patanjali</strong> gathered the teaching into the <strong>Yoga Sutras</strong>, the short guide this course follows. Historians usually date the Yoga Sutras to between about 200 BCE and 400 CE.";
  let note;
  if(deep) note="With gratitude we bow to Adi Yogi Shiva, the source of yoga, and to Maharishi Patanjali, who set it down for all of us to use.";
  else if(t==="universal"||t==="humanist"||t==="cosmic") note="Here this is shared as the traditional story of where the practice comes from. You do not need to hold any belief to practise.";
  else note="This is shared as the history of the practice. You can practise yoga within your own faith; nothing here asks you to take up another.";
  $("#origin").innerHTML=`<p>${story}</p><p>${note}</p>`;
}
function renderTrack(){
  renderOrigin();
  const t=TRAD.find(x=>x[0]===$("#trad").value)||TRAD[0];
  $("#tradCard").innerHTML=`<div class="label">Your intention</div><h3>${t[1]}</h3><p>${t[2]}</p><p><strong>Sound or breath practice:</strong> ${t[3]}</p><p class="hint">Suggested music: ${STYLES[t[4]].label}. Omkar (AUM) meditation stays the core practice of this course; this card offers a close equivalent in your own tradition, practised with whatever devotion you feel. Yoga is shared here as a science of body, breath and mind, not as part of any religion.</p>`;
  const showCh=spiritOn()&&t[0]==="hindu"&&$("#tChants").checked;
  $("#chantWrap").hidden=!showCh;
  $("#chantRow").hidden=!(spiritOn()&&t[0]==="hindu");
  $("#chants").innerHTML=CHANTS.map((c,i)=>`<div class="card"><h3>${c[0]}</h3><p><em>${c[1]}</em></p><p>${c[2]}</p><button class="btn" data-c="${i}">Listen (device voice)</button></div>`).join("");
  document.querySelectorAll("#chants button").forEach(b=>b.onclick=()=>{ try{speechSynthesis.cancel()}catch(e){} say(CHANTS[+b.dataset.c][1],"hi-IN"); });
  if(!$("#memberWrap").hidden) renderMap();
  if(!$("#posesWrap").hidden) renderLib();
}
["trad","tSpirit","tChants"].forEach(id=>$("#"+id).onchange=()=>{ store.set("ss-"+id, $("#"+id).type==="checkbox"?($("#"+id).checked?"1":"0"):$("#"+id).value); renderTrack(); });
$("#tradUse").onclick=()=>{ const t=TRAD.find(x=>x[0]===$("#trad").value); $("#mstyle").value=t[4]; store.set("ss-mstyle",t[4]); setStyle(); $("#tradUse").textContent="Music set"; setTimeout(()=>$("#tradUse").textContent="Use the suggested music",1500); };
/* Outer to inner awareness: our own diagram of the senses turning inward through the five layers. */
Object.assign(TOPICS,{
 inward:{name:"Outer to inner awareness",open:1,
  intro:["From outer senses to inner awareness","A traditional teaching picture. Attention starts with the five outer senses, passes through the outer mind and the five layers of the self, and settles in the inner mind, where the same five senses are turned inward. Press Start to follow the journey, or tap any part."],
  items:{outer:["Outer senses","1. Outer awareness","Eyes, nose, tongue, ears and skin take in the world. This is where everyday attention lives.","Notice five things you can see, hear and feel, then close the eyes."],
         omind:["Outer mind","2. Outer mind","The busy part of the mind that reacts to what the senses bring in.","Let thoughts come and go without following them."],
         anna:["Annamaya","Layer 1: the food body","The physical body, built from the food we eat.","Relax the body from feet to head."],
         pranal:["Pranamaya","Layer 2: the energy body","The body of breath and life energy.","Watch the breath without changing it."],
         mano:["Manomaya","Layer 3: the mind body","Thoughts, feelings and memories.","Name a feeling, then let it soften."],
         vijnana:["Vijnanamaya","Layer 4: the wisdom body","Understanding, judgement and insight.","Ask: what do I really need today?"],
         ananda:["Anandamaya","Layer 5: the bliss body","Deep peace and quiet joy, described as the innermost layer.","Rest in stillness for a few breaths."],
         imind:["Inner mind","4. Inner mind","Quiet, steady attention, turned inward.","Rest attention on the breath at the heart."],
         inner:["Inner senses","5. Inner awareness","The same five senses turned inward: inner seeing, listening, feeling. Calm inner awareness is like water for a seed: it helps understanding grow.","Sit for a minute and notice what you sense with the eyes closed."],
         pranas:["Five pranas","The five breaths","Traditional names for five movements of life energy: Prana (in-breath, chest), Apana (downward, lower belly), Samana (balancing, navel), Udana (upward, throat), Vyana (spreading through the whole body).","Feel the breath move in, down, around, up and through."]},
  draw(){ const ink=css("--ink"), soft=css("--soft"), acc=css("--acc"), hl=css("--hl");
    const S5=["Eye","Nose","Tongue","Ear","Skin"]; let s="";
    s+=`<g class="hot" data-k="outer" tabindex="0" role="button" aria-label="Outer senses"><rect class="zone" x="14" y="4" width="212" height="46"/>`+S5.map((t,i)=>{ const x=32+i*44; return `<path d="M${x} 44 Q${x-16} 24 ${x} 8 Q${x+16} 24 ${x} 44Z" fill="${soft}" stroke="${acc}"/><text x="${x}" y="31" text-anchor="middle" class="sm">${t}</text>`; }).join("")+`</g>`;
    const R=[["omind",104,58,"Outer mind"],["anna",90,50,"Annamaya"],["pranal",76,42,"Pranamaya"],["mano",62,34,"Manomaya"],["vijnana",48,26,"Vijnanamaya"],["ananda",34,18,"Anandamaya"]];
    R.forEach(([k,rx,ry,t],i)=>{ s+=`<g class="hot" data-k="${k}" tabindex="0" role="button" aria-label="${t}"><ellipse class="zone" cx="120" cy="140" rx="${rx}" ry="${ry}" opacity="0"/><ellipse id="ring_${k}" class="ring" cx="120" cy="140" rx="${rx}" ry="${ry}" fill="${i%2?soft:"none"};fill-opacity:.35"/><text x="${120+rx-4}" y="${140+3}" text-anchor="end" class="sm">${i?t:""}</text></g>`; });
    s+=`<text x="120" y="${140-58+9}" text-anchor="middle" class="sm">outer mind</text>`;
    s+=`<g class="hot" data-k="imind" tabindex="0" role="button" aria-label="Inner mind"><circle class="zone" cx="120" cy="140" r="14"/><circle id="ring_imind" cx="120" cy="140" r="10" fill="${hl}" opacity=".5"/><text x="120" y="143" text-anchor="middle" class="sm">inner</text></g>`;
    const P=[["Prana",-150],["Udana",-110],["Vyana",180],["Samana",150],["Apana",110]];
    s+=`<g class="hot" data-k="pranas" tabindex="0" role="button" aria-label="Five pranas">`+P.map(([t,a])=>{ const r=a*Math.PI/180, x=120+104*Math.cos(r), y=140+58*Math.sin(r); return `<circle class="zone" cx="${x}" cy="${y}" r="9"/><circle cx="${x}" cy="${y}" r="3.5" fill="${acc}"/><text x="${x+(Math.cos(r)<0?-5:5)}" y="${y+(Math.sin(r)<-.5?-5:Math.sin(r)>.5?10:3)}" text-anchor="${Math.cos(r)<-.2?"end":"middle"}" class="sm">${t}</text>`; }).join("")+`</g>`;
    s+=`<g class="hot" data-k="inner" tabindex="0" role="button" aria-label="Inner senses"><rect class="zone" x="14" y="222" width="212" height="40"/>`+S5.map((t,i)=>{ const x=32+i*44; return `<path d="M120 152 Q${(120+x)/2} 205 ${x} 236" fill="none" stroke="${css("--line")}" stroke-width="1"/><circle cx="${x}" cy="240" r="9" fill="${soft}" stroke="${hl}"/><text x="${x}" y="260" text-anchor="middle" class="sm">inner ${t.toLowerCase()}</text>`; }).join("")+`</g>`;
    return s+`<circle id="inDot" cx="120" cy="40" r="5" class="dot" opacity="0"/><text x="120" y="276" text-anchor="middle" id="inTxt" class="sm">Press Start to follow the journey</text>`; },
  extra:`<div class="ys6"><button class="btn solid" id="inGo">Start the journey</button><button class="btn" id="inStop">Stop</button></div>`}
});
const IN_STAGES=[["outer","Outer senses: notice what you see, hear, smell, taste and touch."],["omind","Outer mind: let thoughts pass by."],["anna","Food body: relax the whole body."],["pranal","Energy body: watch the breath."],["mano","Mind body: let feelings soften."],["vijnana","Wisdom body: rest in quiet knowing."],["ananda","Bliss body: rest in deep peace."],["imind","Inner mind: steady, inward attention."],["inner","Inner senses: notice what you sense with the eyes closed."]];
function inwardRun(){
  stopMapAnim(); const t0=performance.now(), a=audio(); if(a&&a.state==="suspended") a.resume(); let last=-1;
  const dot=$("#inDot"), txt=$("#inTxt"), per=reduce?8:7;
  const step=ts=>{ const t=Math.max(0,(ts-t0)/1000), i=Math.floor(t/per);
    if(i>=IN_STAGES.length){ txt.textContent="Done. Open the eyes slowly."; dot.setAttribute("opacity",0); bell(); mapAnim=null; return; }
    if(i!==last){ last=i; const [k,c]=IN_STAGES[i]; txt.textContent=(i+1)+" of 9 · "+c.split(":")[0]; if($("#tCues").checked) say(c); note(i);
      document.querySelectorAll("#msvg .hot").forEach(g=>g.classList.toggle("on",g.dataset.k===k)); }
    const q=(t%per)/per, k=IN_STAGES[i][0];
    let y= k==="outer"? 26+q*20 : k==="inner"? 152+q*84 : k==="imind"? 140 : 140-[58,50,42,34,26,18][IN_STAGES.findIndex(x=>x[0]===k)-1]*(1-q*.3);
    dot.setAttribute("cy",y); dot.setAttribute("opacity",1);
    musicLevel(Math.floor(t/5)%2===0,5); mapAnim=requestAnimationFrame(step); };
  mapAnim=requestAnimationFrame(step);
}

/* Six cleansing practices (Shat Kriyas): two guided here, four for information only. */
const KRIYA_INFO="For information only. This is an internal cleansing practice that is learned in person with a qualified teacher. No steps are given here.";
Object.assign(TOPICS,{
 kriya:{name:"Six cleansing practices",gated:1,members:1}
});
/* Seven chakras: traditional yogic teaching, opt-in with the spiritual switch. */
Object.assign(TOPICS,{
 chakra:{name:"Seven chakras (tradition)",open:1,optin:1,
  intro:["Sapta Chakras: the seven centres","In traditional yogic teaching, seven centres (chakras) sit along the spine, linked by three channels (nadis): Ida on the left, Pingala on the right and Sushumna in the centre. This is shared as the author's personal view from family teaching, as a picture for meditation, not as anatomy. Tap a centre."],
  items:{mula:["Muladhara","1. Root, base of the spine","Traditionally linked with earth, steadiness and feeling grounded.","Sit tall and feel the contact with the floor."],
         svadhi:["Svadhisthana","2. Sacral, below the navel","Traditionally linked with water, flow and creativity.","Breathe slowly into the lower belly."],
         mani:["Manipura","3. Navel","Traditionally linked with fire, energy and will.","Feel the belly rise and fall."],
         anahata:["Anahata","4. Heart","Traditionally linked with air, love and kindness.","Rest attention at the centre of the chest."],
         vishuddha:["Vishuddha","5. Throat","Traditionally linked with space, speech and expression.","Hum softly and feel the throat."],
         ajna:["Ajna","6. Between the eyebrows","Traditionally linked with insight and clear attention.","Rest attention gently between the eyebrows."],
         sahasrara:["Sahasrara","7. Crown of the head","Traditionally linked with wholeness and stillness.","Sit in silence for a few breaths."],
         nadis:["Ida, Pingala and Sushumna","The three channels","In tradition, Ida (left, cooling, moon), Pingala (right, warming, sun) and Sushumna (centre) carry life energy. Alternate nostril breathing is said to balance Ida and Pingala.","Try alternate nostril breathing under Breathing practices."]},
  draw(){ const ink=css("--ink"), soft=css("--soft"), acc=css("--acc"), hl=css("--hl");
    let s=`<circle cx="120" cy="52" r="20" fill="${soft}"/><path d="M106 72 Q120 78 134 72 L150 200 Q120 212 90 200 Z" fill="${soft}"/><ellipse cx="120" cy="214" rx="72" ry="18" fill="${soft}"/>`;
    const Y=[200,182,160,132,86,48,30], K=["mula","svadhi","mani","anahata","vishuddha","ajna","sahasrara"];
    s+=`<g class="hot" data-k="nadis" tabindex="0" role="button" aria-label="Three channels"><path class="zone" d="M100 205 L140 205 L140 45 L100 45Z" opacity="0"/><line x1="120" y1="205" x2="120" y2="48" stroke="${acc}" stroke-width="2"/>`;
    let pI="M120 205", pP="M120 205"; for(let i=1;i<6;i++){ const m=(Y[i-1]+Y[i])/2, d=i%2?14:-14; pI+=` Q${120-d} ${m} 120 ${Y[i]}`; pP+=` Q${120+d} ${m} 120 ${Y[i]}`; }
    s+=`<path d="${pI}" fill="none" stroke="${css("--muted")}" stroke-width="1.4"/><path d="${pP}" fill="none" stroke="${hl}" stroke-width="1.4"/></g>`;
    K.forEach((k,i)=>{ const left=i%2===0; s+=`<g class="hot" data-k="${k}" tabindex="0" role="button" aria-label="${this.items[k][0]}"><circle class="zone" cx="120" cy="${Y[i]}" r="11"/><circle cx="120" cy="${Y[i]}" r="6" fill="${hl}" opacity=".8"/><text x="${left?96:144}" y="${Y[i]+3}" text-anchor="${left?"end":"start"}" class="sm">${this.items[k][0]}</text></g>`; });
    return s+`<text x="20" y="262" class="sm">grey: Ida (left)</text><text x="220" y="262" text-anchor="end" class="sm">orange: Pingala (right)</text><text x="120" y="275" text-anchor="middle" class="sm">blue: Sushumna (centre)</text>`; }}
});
Object.assign(TOPICS,{
 organs:{name:"Organs of the body",gated:1,members:1}
});
/* Kundalini and seed sounds, made simple: plain words, a gentle hum practice and a checklist. */
const BIJA=[["LAM","Base of the spine","Muladhara"],["VAM","Below the navel","Svadhisthana"],["RAM","Navel","Manipura"],["YAM","Heart","Anahata"],["HAM","Throat","Vishuddha"],["OM","Between the eyebrows","Ajna"],["(silence)","Crown of the head","Sahasrara"]];
Object.assign(TOPICS,{
 kundalini:{name:"Kundalini and seed sounds, made simple",open:1,
  intro:["Kundalini and seed sounds, made simple","Many yoga centres, bhajan groups and satsangs invite people to kundalini yoga and seed-sound (bija) mantras. Here is a plain explanation, shared as the author's personal view from family teaching. It is a calm practice for focus and well-being and does not cure anything."],
  items:{chakra:["Chakra","A word","Sanskrit for wheel. In tradition, seven centres along the spine used as points of attention in meditation.","Rest attention on one point at a time."],
         nadi:["Nadi","A word","Sanskrit for channel or stream. In tradition, paths along which life energy flows; the three main ones are Ida, Pingala and Sushumna.","Alternate nostril breathing is the classic nadi practice."],
         kundalini:["Kundalini","A word","In tradition, a resting energy pictured as coiled at the base of the spine, said to rise as the mind grows still and clear. Here it is treated as a picture for inner growth, not something to force.","Steady daily practice, never strain."],
         bija:["Bija sounds","A word","Bija means seed. Each centre has a one-syllable seed sound: LAM, VAM, RAM, YAM, HAM and OM, then silence at the crown. Humming them is a simple way to move attention up the body.","Press Start for a gentle guided hum."]},
  draw(){ const hl=css("--hl"), soft=css("--soft"), ink=css("--ink"), keys=["kundalini","nadi","chakra","bija"];
    let s=`<line x1="120" y1="236" x2="120" y2="30" stroke="${css("--acc")}" stroke-width="2"/>`;
    BIJA.forEach((b,i)=>{ const y=230-i*33; s+=`<circle id="bj${i}" cx="120" cy="${y}" r="11" fill="${soft}" stroke="${hl}"/><text x="120" y="${y+3}" text-anchor="middle" class="sm" font-weight="600">${b[0]==="(silence)"?"...":b[0]}</text><text x="138" y="${y+3}" class="sm">${b[1]}</text>`; });
    keys.forEach((k,i)=>{ const y=40+i*56; s+=`<g class="hot" data-k="${k}" tabindex="0" role="button" aria-label="${this.items[k][0]}"><rect class="zone" x="4" y="${y-12}" width="76" height="22"/><rect class="ring" x="6" y="${y-10}" width="72" height="18" rx="9"/><text x="42" y="${y+2}" text-anchor="middle" class="sm" font-weight="600">${this.items[k][0]}</text></g>`; });
    return s+`<text x="120" y="274" text-anchor="middle" id="kTxt" class="sm">Press Start to hum the seed sounds</text>`; },
  extra:`<div class="ys6"><button class="btn solid" id="kGo">Start the seed-sound sit</button><button class="btn" id="kStop">Stop</button></div>
   <p class="hint">Sit tall, eyes closed. For each sound: breathe in for 4, then hum the sound softly for 8 and feel it at that point. About two minutes.</p>
   <div class="card ys9"><strong>Before you join a class, ask:</strong><ul>
    <li>What training has the teacher had, and who taught them?</li>
    <li>Is it gentle, and can I stop or sit out at any time?</li>
    <li>Is there any pressure to stay, pay more, or promise loyalty? There should be no fees for an "awakening".</li>
    <li>Are breath-holding or very fast breathing avoided for beginners?</li>
   </ul></div>
   <p><strong>Take care:</strong> intense breathing and long sessions can unsettle some people. If you have a mental-health condition, a heart condition or high blood pressure, go slowly, keep sessions short and seek guidance from your doctor and a qualified teacher. Stop if you feel anxious, dizzy or unwell.</p>`}
});
function kundRun(){
  stopMapAnim(); const a=audio(); if(a&&a.state==="suspended") a.resume(); const t0=performance.now(); let last=-1, ph="";
  const step=ts=>{ const t=Math.max(0,(ts-t0)/1000), i=Math.floor(t/12), q=t%12;
    if(i>=BIJA.length){ $("#kTxt").textContent="Done. Sit quietly, then open the eyes."; bell(); mapAnim=null; return; }
    const p=q<4?"in":"hum";
    if(i!==last||p!==ph){ last=i; ph=p; BIJA.forEach((_,k)=>{ const c=$("#bj"+k); if(c) c.setAttribute("fill",k===i?css("--hl"):css("--soft")); });
      if(p==="in"){ musicLevel(true,4); $("#kTxt").textContent="Breathe in · "+BIJA[i][1]; if($("#tCues").checked) say(BIJA[i][0]==="(silence)"?"Now rest in silence":"Breathe in, then hum "+BIJA[i][0]); }
      else { musicLevel(false,8); $("#kTxt").textContent=(BIJA[i][0]==="(silence)"?"Rest in silence":"Hum "+BIJA[i][0])+" · "+BIJA[i][1]; if(BIJA[i][0]!=="(silence)") vowel("M",8); } }
    mapAnim=requestAnimationFrame(step); };
  mapAnim=requestAnimationFrame(step);
}
/* Heart, stomach emptying, master gland and skeleton: our own textbook drawings. */
let pitRepro=false, stStep=0;
const BONES={skull:["Skull","22 bones","Protects the brain and holds the face.","Keep the neck long in every pose. Eye exercises and gentle neck turns."],
 spine:["Spine","26 bones in adults","7 neck (cervical), 12 upper-back (thoracic) and 5 lower-back (lumbar) vertebrae, plus the sacrum and tailbone.","Cobra B-2, Bridge A-3, Child's pose B-7, Seated twist C-2, Half waist wheel D-2."],
 ribs:["Rib cage","12 pairs of ribs and the breastbone","Protects the heart and lungs and moves with every breath.","Breathing practices, Fish A-6, Camel C-9."],
 shoulder:["Shoulder girdle","Collarbones and shoulder blades","Connects the arms to the trunk.","Cow face C-7, seated Mountain C-6, Downward dog B-6."],
 arm:["Arm bones","Humerus, radius and ulna","The upper arm and forearm bones.","Balance plank B-4, Upward dog B-5."],
 hand:["Hands and wrists","27 bones in each hand","Small bones that make fine movement possible.","Mudras; spread the fingers to protect the wrists in plank."],
 pelvis:["Pelvis","Hip bones, sacrum and tailbone","A strong bowl that carries the weight of the upper body.","Bound angle C-3, Lotus C-5, Warrior D-6."],
 femur:["Thigh bone (femur)","The longest bone","Joins the hip to the knee.","Warrior D-6, Tree D-9, Chair pose."],
 knee:["Kneecap (patella)","A small shield bone","Protects the front of the knee joint.","Diamond pose C-4 and Hero's seat C-12, with a cushion if needed."],
 leg:["Lower leg and foot","Tibia, fibula and 26 bones in each foot","Carry our weight and keep us balanced.","Mountain D-1, Tree D-9."]};
Object.assign(TOPICS,{
 heart:{name:"Heart and lungs",gated:1,members:1},
 stomach:{name:"Stomach emptying",gated:1,members:1},
 pituitary:{name:"The master gland",gated:1,members:1},
 skeleton:{name:"The skeleton",open:1,
  intro:["The skeleton","An adult has 206 bones. Front view on the left, back view on the right. Tap a bone to see which poses use or stretch that area."],
  items:BONES,
  draw(){ const ink=css("--ink"), soft=css("--soft"), acc=css("--acc");
    const g=(k,inner)=>`<g class="hot" data-k="${k}" tabindex="0" role="button" aria-label="${BONES[k][0]}">${inner}</g>`;
    const view=(c,back)=>{ let s="";
      s+=g("skull",`<circle class="zone" cx="${c}" cy="34" r="16"/><circle cx="${c}" cy="34" r="13" fill="${soft}" stroke="${ink}" stroke-width=".8"/>`+(back?"":`<circle cx="${c-5}" cy="32" r="2.5" fill="${ink}"/><circle cx="${c+5}" cy="32" r="2.5" fill="${ink}"/>`));
      let v=""; for(let i=0;i<24;i++){ const y=50+i*4.2, col=i<7?css("--hl"):i<19?acc:css("--kick"); v+=`<rect x="${c-2.5}" y="${y}" width="5" height="3.2" fill="${col}"/>`; }
      s+=g("spine",`<rect class="zone" x="${c-6}" y="48" width="12" height="104"/>`+v);
      let r=""; for(let i=0;i<6;i++){ const y=66+i*9; r+=`<path d="M${c} ${y} Q${c-22} ${y+2} ${c-20} ${y+10} M${c} ${y} Q${c+22} ${y+2} ${c+20} ${y+10}" fill="none" stroke="${ink}" stroke-width=".9"/>`; }
      s+=g("ribs",`<ellipse class="zone" cx="${c}" cy="92" rx="24" ry="30"/>`+r);
      s+=g("shoulder",`<rect class="zone" x="${c-28}" y="54" width="56" height="12"/>`+(back?`<path d="M${c-6} 64 L${c-22} 62 L${c-14} 84Z M${c+6} 64 L${c+22} 62 L${c+14} 84Z" fill="${soft}" stroke="${ink}" stroke-width=".7"/>`:`<path d="M${c-3} 58 L${c-24} 60 M${c+3} 58 L${c+24} 60" stroke="${ink}" stroke-width="2"/>`));
      s+=g("arm",`<path class="zone" d="M${c-26} 62 L${c-32} 150 M${c+26} 62 L${c+32} 150" stroke="${css("--glow")}" stroke-width="10" fill="none"/><path d="M${c-25} 62 L${c-29} 108 L${c-32} 150 M${c+25} 62 L${c+29} 108 L${c+32} 150" stroke="${ink}" stroke-width="2.4" fill="none"/>`);
      s+=g("hand",`<circle class="zone" cx="${c-33}" cy="158" r="8"/><circle class="zone" cx="${c+33}" cy="158" r="8"/><circle cx="${c-33}" cy="158" r="5" fill="${soft}" stroke="${ink}" stroke-width=".7"/><circle cx="${c+33}" cy="158" r="5" fill="${soft}" stroke="${ink}" stroke-width=".7"/>`);
      s+=g("pelvis",`<ellipse class="zone" cx="${c}" cy="160" rx="22" ry="12"/><path d="M${c-18} 152 Q${c} 146 ${c+18} 152 L${c+12} 170 Q${c} 174 ${c-12} 170Z" fill="${soft}" stroke="${ink}" stroke-width=".8"/>`);
      s+=g("femur",`<path class="zone" d="M${c-10} 170 L${c-12} 212 M${c+10} 170 L${c+12} 212" stroke="${css("--glow")}" stroke-width="10" fill="none"/><path d="M${c-10} 170 L${c-12} 212 M${c+10} 170 L${c+12} 212" stroke="${ink}" stroke-width="3" fill="none"/>`);
      if(!back) s+=g("knee",`<circle class="zone" cx="${c-12}" cy="215" r="6"/><circle class="zone" cx="${c+12}" cy="215" r="6"/><circle cx="${c-12}" cy="215" r="3.5" fill="${soft}" stroke="${ink}"/><circle cx="${c+12}" cy="215" r="3.5" fill="${soft}" stroke="${ink}"/>`);
      s+=g("leg",`<path class="zone" d="M${c-12} 218 L${c-12} 258 M${c+12} 218 L${c+12} 258" stroke="${css("--glow")}" stroke-width="10" fill="none"/><path d="M${c-12} 218 L${c-12} 256 L${c-20} 262 M${c+12} 218 L${c+12} 256 L${c+20} 262" stroke="${ink}" stroke-width="2.4" fill="none"/>`);
      return s+`<text x="${c}" y="276" text-anchor="middle" class="sm">${back?"back":"front"}</text>`; };
    return view(64,false)+view(176,true)+`<text x="120" y="60" text-anchor="middle" class="sm" fill="${css("--hl")}">neck 7</text><text x="120" y="90" text-anchor="middle" class="sm" fill="${acc}">upper back 12</text><text x="120" y="140" text-anchor="middle" class="sm" fill="${css("--kick")}">lower back 5</text>`; }}
});
TOPICS.aumsea.extra=(TOPICS.aumsea.extra||"")+`<button class="btn solid" id="seaGo">Play A, then U, then M</button>`;
function heartRun(){
  const path="M84 30 L84 112 L98 160 L110 150 Q110 60 60 60 L40 60 L180 60 Q150 70 150 114 L148 164 L140 150 Q140 30 120 30 Q100 30 104 50", P=document.createElementNS("http://www.w3.org/2000/svg","path"); P.setAttribute("d",path);
  const L=P.getTotalLength(), dot=$("#hDot"), ecg=$("#ecg"), tx=$("#ecgTxt"), t0=performance.now();
  const step=ts=>{ const t=Math.max(0,(ts-t0)/1000), q=(t/6)%1, p=P.getPointAtLength(q*L); dot.setAttribute("cx",p.x); dot.setAttribute("cy",p.y);
    let d="", beat=(t%1); for(let x=0;x<=230;x+=2){ const ph=((x/230)*3+t)%1; let y=250; if(ph<.06) y=250-24*Math.sin(ph/.06*Math.PI); else if(ph>.3&&ph<.36) y=250-10*Math.sin((ph-.3)/.06*Math.PI); d+=(x?"L":"M")+(x+5)+" "+y.toFixed(1); }
    ecg.setAttribute("d",d); tx.textContent=beat<.06?"lub":beat>.3&&beat<.36?"dub":"rest"; mapAnim=requestAnimationFrame(step); };
  if(!reduce) mapAnim=requestAnimationFrame(step);
}
function stRun(){ stopMapAnim(); stStep=0; renderMap(); let k=0; const iv=setInterval(()=>{ if(mapTopic!=="stomach"||++k>5){ clearInterval(iv); return; } stStep=k; renderMap(); },3500); }
function stWave(){ const w=$("#stWave"); if(!w||reduce) return; const t0=performance.now(); const step=ts=>{ const q=(Math.max(0,ts-t0)/2000)%1, y=70+q*90, x=50+q*110; w.setAttribute("d",`M${x-14} ${y} Q${x} ${y+6} ${x+10} ${y-8}`); mapAnim=requestAnimationFrame(step); }; mapAnim=requestAnimationFrame(step); }
function seaRun(){ stopMapAnim(); const a=audio(); if(a&&a.state==="suspended") a.resume(); const seq=["A","U","M"]; let i=0;
  const go=()=>{ if(i>=3||mapTopic!=="aumsea"){ document.querySelectorAll("#msvg .hot").forEach(g=>g.classList.remove("on")); return; } const k=seq[i]; document.querySelectorAll("#msvg .hot").forEach(g=>g.classList.toggle("on",g.dataset.k===k)); vowel(k,3); i++; setTimeout(go,3200); };
  go(); }
/* Eight limbs beside Maslow and Bloom: parallels for learning, not claims of borrowing. */
const PY={
 yoga:[["yama","Yama","Social ethics","Five restraints in how we treat others: non-harming, truthfulness, not stealing, moderation, not grasping. The foundation for everything above."],
  ["niyama","Niyama","Personal ethics","Five observances for ourselves: cleanliness, contentment, self-discipline, self-study and surrender to something greater."],
  ["asana","Asana","Posture","A seat that is steady and at ease (sutra 2.46). The body made comfortable so the mind can settle."],
  ["pranayama","Pranayama","Breath","Lengthening and guiding the breath. Beginners breathe gently with no holding; longer holds only with a teacher."],
  ["pratyahara","Pratyahara","Senses turned inward","Drawing attention back from the senses so outside pulls lose their grip."],
  ["dharana","Dharana","Concentration","Holding attention on one point or object (sutra 3.1)."],
  ["dhyana","Dhyana","Meditation","Attention that flows without a break: concentration made continuous (sutra 3.2)."],
  ["samadhi","Samadhi","Absorption","Complete absorption in which only the object shines (sutra 3.3). Tradition speaks of a stage with a seed of thought (savikalpa) and one beyond it (nirvikalpa)."]],
 maslow:{
  classic:[["phys","Physiological","Body needs","Air, food, water, sleep and warmth."],["safety","Safety","Security","Health, shelter and a predictable life."],["belong","Love and belonging","Connection","Friendship, family and community."],["esteem","Esteem","Respect","Respect from others and self-respect."],["actual","Self-actualization","Growth","Becoming the best one can be; growth for its own sake."]],
  renov:[["k0","Immediate physiological needs","Survival","Hunger, thirst and warmth."],["k1","Self-protection","Safety","Protection from harm."],["k2","Affiliation","Belonging","Friendships and groups."],["k3","Status and esteem","Respect","Standing and respect in the group."],["k4","Mate acquisition","Partnership","Finding a life partner."],["k5","Mate retention","Partnership","Keeping a partnership strong."],["k6","Parenting","Care for the next generation","Raising and caring for children."]]
 },
 bloom:{
  "1956":[["remember","Knowledge","Recall","Recall facts and basic ideas."],["understand","Comprehension","Explain","Explain ideas in your own words."],["apply","Application","Use","Use what you learned in a new situation."],["analyze","Analysis","Break down","See the parts and how they connect."],["create","Synthesis","Combine","Put parts together into something new."],["evaluate","Evaluation","Judge","Judge and justify a choice."]],
  "2001":[["remember","Remember","Recall","Recall facts and basic ideas."],["understand","Understand","Explain","Explain ideas in your own words."],["apply","Apply","Use","Use what you learned in a new situation."],["analyze","Analyze","Break down","See the parts and how they connect."],["evaluate","Evaluate","Judge","Judge and justify a choice."],["create","Create","Make new","Put parts together into something new and original."]]
 }
};
PY.maslow.later=PY.maslow.classic.concat([["trans","Self-transcendence","Beyond the self","In his later writings Maslow described going beyond the self: serving others or a cause, and moments of oneness with all things."]]);
const LINK={
 yama:{m:["safety","belong"],r:["k1","k2","k6"],b:["remember","understand"],n:"Both modern models keep safety and living well with others near the base. The Sutras put ethics at the very bottom, before the body; Maslow puts body needs first."},
 niyama:{m:["esteem"],r:["k3"],b:["understand","apply"],n:"Self-discipline and contentment echo healthy self-respect: esteem that grows from within rather than from praise."},
 asana:{m:["phys"],r:["k0"],b:["apply"],n:"A steady, comfortable body meets the most basic layer of need. In learning terms, this is knowledge applied in the body."},
 pranayama:{m:["phys"],r:["k0"],b:["apply","analyze"],n:"Breath is the most immediate physical need. Watching the breath closely also trains careful noticing, the start of analysis."},
 pratyahara:{m:["esteem"],r:["k3"],b:["analyze"],n:"Letting go of outside pulls echoes the move from needing approval to inner steadiness, and sorting inner signals from outer noise."},
 dharana:{m:["actual"],r:[],b:["analyze","evaluate"],n:"Sustained focus is a tool for growth and deep learning. The 2010 renovated pyramid has no level for this."},
 dhyana:{m:["actual","trans"],r:[],b:["evaluate","create"],n:"Flowing awareness resonates with what Maslow called peak experiences, and with reflecting on one's own thinking."},
 samadhi:{m:["trans"],r:[],b:["create"],n:"Maslow's later idea of self-transcendence comes closest. Bloom's top level is about making new work rather than stillness; what they share is a summit that gathers every level below it."}
};
const PYN={yoga:"Eight limbs",maslow:"Maslow",bloom:"Bloom"};
let pySel=null;
function pyRows(set){ return set==="yoga"?PY.yoga:set==="maslow"?PY.maslow[$("#mVer").value]:PY.bloom[$("#bVer").value]; }
function pyLinks(set,id){ const mk=$("#mVer").value==="renov"?"r":"m";
  if(set==="yoga"){ const L=LINK[id]; return {yoga:[id],maslow:L[mk],bloom:L.b}; }
  const key=set==="maslow"?mk:"b"; return {yoga:Object.keys(LINK).filter(k=>LINK[k][key].includes(id)),maslow:set==="maslow"?[id]:[],bloom:set==="bloom"?[id]:[]}; }
function pyrSVG(set,rows){ const n=rows.length,H=282,top=14,h=(H-top)/n,W=y=>40+250*((y-top)/(H-top)); let s="";
  rows.forEach((r,i)=>{ const y0=H-i*h, y1=y0-h, last=i===n-1, a=W(y0)/2, b=W(y1)/2;
    const pts=last?`${150-a},${y0} ${150+a},${y0} 150,${y1-8}`:`${150-a},${y0} ${150+a},${y0} ${150+b},${y1} ${150-b},${y1}`;
    const ly=last?y0-8:y0-h/2+4, av=last?a*2*(16/(h+8)):W(y0-h/2), fs=Math.min(11.5,av*.9/(r[1].length*.55));
    s+=`<g class="hot" data-set="${set}" data-id="${r[0]}" tabindex="0" role="button" aria-label="${PYN[set]}: ${r[1]}"><polygon class="tier" points="${pts}"/><text x="150" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${fs.toFixed(1)}px">${r[1]}</text></g>`; });
  return s; }
function pyNames(set,ids){ const l=pyRows(set).filter(r=>ids.includes(r[0])).map(r=>r[1]); return l.length?l.join(", "):"no matching level in this version"; }
function renderPyr(){
  if(pySel&&!pyRows(pySel.set).some(r=>r[0]===pySel.id)) pySel=null;
  const L=pySel?pyLinks(pySel.set,pySel.id):{yoga:[],maslow:[],bloom:[]};
  ["yoga","maslow","bloom"].forEach(set=>{ const svg=$("#py_"+set); svg.innerHTML=pyrSVG(set,pyRows(set));
    svg.querySelectorAll(".hot").forEach(g=>{ const id=g.dataset.id; if(pySel&&pySel.set===set&&pySel.id===id) g.classList.add("on"); else if(L[set].includes(id)) g.classList.add("link");
      const pick=()=>{ pySel={set,id}; renderPyr(); }; g.onclick=pick; g.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pick(); } }; }); });
  if(!pySel){ $("#pyrInfo").innerHTML=`<h2>Tap a level in any pyramid</h2><p class="hint">The level you tap turns orange. Levels that echo it in the other two pyramids glow.</p>`; return; }
  const row=pyRows(pySel.set).find(r=>r[0]===pySel.id);
  let h=`<div class="label">${PYN[pySel.set]} · ${row[2]}</div><h2>${row[1]}</h2><p>${row[3]}</p>`;
  if(pySel.set==="yoga"){ const k=LINK[pySel.id]; h+=`<p><strong>Echoes in Maslow:</strong> ${pyNames("maslow",L.maslow)}.</p><p><strong>Echoes in Bloom:</strong> ${pyNames("bloom",L.bloom)}.</p><p>${k.n}</p>`; }
  else { h+=`<p><strong>Echoes in the eight limbs:</strong> ${pyNames("yoga",L.yoga)}.</p>`+(L.yoga.length?`<ul>${L.yoga.map(y=>`<li><strong>${PY.yoga.find(r=>r[0]===y)[1]}:</strong> ${LINK[y].n}</li>`).join("")}</ul>`:""); }
  $("#pyrInfo").innerHTML=h+`<p class="hint">A parallel to think about, not a claim that one idea came from the other.</p>`;
}
["mVer","bVer"].forEach(id=>$("#"+id).onchange=()=>{ store.set("ss-"+id,$("#"+id).value); renderPyr(); });

/* Loop */
function frame(ts){
  if(running){ const dt=(ts-last)/1000*pace; last=ts; elapsed+=dt;
    const a=at(elapsed); if(a.k!==segIdx){ segIdx=a.k; onSeg(a.k); }
    if(elapsed>=total()){ finish(); }
    $("#prog").style.width=(100*Math.min(1,elapsed/total()))+"%";
  }
  if(["surya","aum","nadi"].includes(practice)){ draw(); cueFor(); playerTick(); }
  requestAnimationFrame(frame);
}
function start(){ if(stillMode) setStill(false); if(done) restart(); const x=audio(); if(x&&x.state==="suspended") x.resume(); running=true; last=performance.now(); segIdx=-1; $("#go").textContent="Pause"; }
function pause(){ running=false; hush(); $("#go").textContent="Resume"; logMinutes(); }
function restart(){ running=false; hush(); elapsed=0; segIdx=-1; done=false; logged=0; build(); $("#prog").style.width="0"; $("#go").textContent="Start"; timeHint(); }
function finish(){ running=false; done=true; hush(); $("#go").textContent="Start again"; logMinutes(); bell(); }
$("#go").onclick=()=>running?pause():start();
$("#reset").onclick=restart;
["level","rounds","bsel"].forEach(id=>$("#"+id).onchange=()=>{ store.set("ss-"+id,$("#"+id).value); holdsVis(); restart(); });
function holdsVis(){ $("#tHoldsL").hidden=!(practice==="nadi"&&$("#bsel").value==="booklet"); }
$("#tHolds").onchange=()=>restart();
$("#tMusic").onchange=()=>{ if(!$("#tMusic").checked&&ac){ A.master.gain.setTargetAtTime(0,ac.currentTime,.2);} };

/* Habit tracker */
let logged=0;
function day(d){ return d.toISOString().slice(0,10); }
function readLog(){ try{ return JSON.parse(store.get("ss-log")||"{}"); }catch(e){ return {}; } }
function logMinutes(){
  const mins=(elapsed-logged)/60; if(mins<.25) return; logged=elapsed;
  const L=readLog(), k=day(new Date()); L[k]=Math.round(((L[k]||0)+mins)*10)/10; store.set("ss-log",JSON.stringify(L)); habits();
}
function habits(){
  const L=readLog(), today=new Date(); let streak=0, week=0, tot=0;
  Object.values(L).forEach(v=>tot+=v);
  for(let i=0;;i++){ const d=new Date(today); d.setDate(d.getDate()-i); if(L[day(d)]) streak++; else if(i>0) break; if(i>3650) break; }
  for(let i=0;i<7;i++){ const d=new Date(today); d.setDate(d.getDate()-i); week+=L[day(d)]||0; }
  $("#sStreak").textContent=streak; $("#sWeek").textContent=Math.round(week); $("#sTotal").textContent=Math.round(tot);
  let h=""; for(let i=27;i>=0;i--){ const d=new Date(today); d.setDate(d.getDate()-i); const k=day(d);
    h+=`<span class="${L[k]?"on":""} ${i===0?"today":""}" title="${k}${L[k]?": "+L[k]+" min":""}"></span>`; }
  $("#g28").innerHTML=h;
}

/* Guide picker */
function drawThumb(c,key){
  sizeCanvas(c); const x=c.getContext("2d"), W=c.width, H=c.height, g=GUIDES[key];
  x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,W,H); x.fillStyle=css("--sky1"); x.fillRect(0,0,W,H);
  x.fillStyle=css("--ground"); x.fillRect(0,H*.9,W,H*.1);
  const s=H*.86/100; x.setTransform(s,0,0,s,W*.5,H*.9); x.scale(g.k,g.k); figure(x,S.up,g);
}
function guides(){
  $("#guides").innerHTML=Object.entries(GUIDES).map(([k,g])=>`<button class="guide" data-g="${k}" aria-pressed="${k===guide}"><canvas aria-hidden="true"></canvas>${g.label}<small>${g.silver?"Chair version suggested":(g.k<.8?"Ages 8 to 15":"Adults")}</small></button>`).join("");
  document.querySelectorAll(".guide").forEach(b=>{ drawThumb(b.querySelector("canvas"),b.dataset.g);
    b.onclick=()=>{ guide=b.dataset.g; store.set("ss-guide",guide); document.querySelectorAll(".guide").forEach(x=>x.setAttribute("aria-pressed",x===b));
      if(GUIDES[guide].silver && level()!=="chair" && !running){ $("#level").value="chair"; store.set("ss-level","chair"); restart(); }
      gHint(); if(!$("#posesWrap").hidden) renderLib(); if(!$("#memberWrap").hidden) renderMap(); }; });
  gHint();
}
function gHint(){ $("#gHint").textContent=GUIDES[guide].silver?"Chair level switched on for the senior guide. You can change it under Level.":"Your guide moves with you. Children should practise with an adult nearby."; }

/* Six-week beginner course: our own plan built from our pose library. Structure idea only; no outside text or photos. */
const COURSE=[
 {plan:"Suggested this week: two optimal sessions (about 25 minutes) and one leisure class (about an hour). On busy days, use crunch time.",verse:["Chale vāte chalaṁ chittaṁ, niśchale niśchalaṁ bhavet.","When the breath is restless, the mind is restless; when the breath is still, the mind becomes still. (Hatha Yoga Pradipika 2.2, our own translation)"],key:"A-2",ins:"In our home, practice always began with stillness. Stillness first; movement follows.",t:"Week 1 · Breath and foundations",f:"Start with breath awareness: notice the breath without changing it, then let it slow down. Then learn twelve foundation poses, lying, kneeling, sitting and standing, and finish with a short sequence that links them.",p:["A-1","A-2","A-3","A-13","B-1","B-13","B-7","C-14","C-4","D-1","D-13","D-10"],halfsun:1,seq:["D-1","D-13","D-10","B-13","B-7","C-14","A-3","A-13","A-2","A-1"],b:"sukha",s:3,m:20,tip:"Pick one time of day and keep it. Practise on an empty stomach, on a mat or a folded blanket."},
 {key:"D-1",ins:"Stand like a mountain: feet on the earth, head toward the sky, and a quiet mind in between.",t:"Week 2 · Foundations and balance",f:"Every pose rests on a foundation: the feet when standing, the hands and knees on all fours, the sitting bones when seated. This week, press evenly through that base, then let the breath lead each movement: breathe in to lengthen or lift, breathe out to fold, twist or settle.",found:1,p:["D-1","B-14","C-16","D-6","D-3","D-7","D-14","D-9","C-1","C-17","C-10","A-13"],plan:"Suggested this week: session 1 (optimal), Tiger, Side gate, Mountain, Warrior, Triangle and Side angle; session 2 (crunch or a short optimal), Wide-leg fold, the seated poses and Reclining twist; session 3 (leisure), the full class. Always finish with rest pose.",b:"nadi",s:3,m:20,tip:"Practise next to a wall or a chair. Touch it whenever you wobble; that is good practice, not cheating."},
 {key:"C-1",ins:"Sit tall and the breath has room to move. A straight spine is a kind of respect for yourself.",t:"Week 3 · Sitting and forward bends",f:"Sit comfortably with a long spine, and fold forward without forcing.",p:["C-1","C-3","C-4","C-6","C-10","C-11","C-2"],b:"bhramari",s:3,m:20,tip:"Sit on a folded blanket or cushion so the hips are higher than the knees. Bend the knees in forward bends."},
 {key:"B-2",ins:"Open the chest the way you open a door to a guest: gently, and with a welcome.",t:"Week 4 · Gentle backbends",f:"Open the chest and strengthen the back, lying on the front.",p:["B-1","B-2","B-3","B-6","B-9","B-7","A-3"],b:"booklet",s:4,m:25,sun:2,tip:"Try two slow rounds of the Sun salutation at the Gentle level. Rest in Child's pose after each backbend."},
 {key:"D-6",ins:"Real strength is not loud. It is steady, daily and kind.",t:"Week 5 · Twists and strength",f:"Twist the spine gently and build strength in the arms, legs and belly.",p:["C-2","C-8","D-5","D-6","D-7","B-4","A-4"],b:"suryaAV",s:4,m:25,sun:4,tip:"Breathe in to grow tall, breathe out to twist. Never twist from the neck; let the head follow the chest."},
 {key:"D-6",ins:"Now the poses become one practice. Keep the practice, and the practice will keep you.",t:"Week 6 · Putting it together",f:"One full session: warm up, stand, bend back, fold, twist, rest.",p:["D-6","D-3","D-9","B-2","B-7","C-11","C-8","A-3","A-1"],b:"nadi",s:4,m:30,sun:4,aum:1,tip:"Write down how you feel before and after each session. Notice sleep, mood and stiffness, without judging."}
];
K.halffold={h:[-4,-46],t:5,n:15,ua:95,fa:95,tn:85,sn:85,tf:85,sf:85};
const HALFSUN=[["pray","Mountain, hands at heart","Breathe out"],["up","Extended mountain","Breathe in"],["fold","Forward fold","Breathe out"],["halffold","Half fold, flat back","Breathe in"],["fold","Forward fold","Breathe out"],["up","Rise to extended mountain","Breathe in"],["pray","Mountain, hands at heart","Breathe out"]];
function halfSunHTML(){ return `<div class="halfsun"><p><strong>Half Sun salutation:</strong> seven steps, one breath each. Repeat 3 to 5 times as a warm-up. Bend the knees in the folds and come up slowly.</p><ol class="hsteps">${HALFSUN.map(([k,n,b],i)=>`<li><canvas data-k="${k}" role="img" aria-label="Step ${i+1}: ${n}"></canvas><b>${i+1} · ${b}</b><span>${n}</span></li>`).join("")}</ol></div>`; }
K.crescent={h:[-2,-18],t:-86,n:-96,ua:-100,fa:-102,tn:-8,sn:90,tf:148,sf:172};
K.sukha={h:[0,-6],t:-90,n:-90,ua:72,fa:12,tn:-12,sn:165,tf:-12,sf:165};
const COURSE_WELCOME=`<div class="panel cwel"><canvas data-k="crescent" role="img" aria-label="Our own drawing of a crescent lunge with arms raised"></canvas><div>
 <h3>Welcome</h3>
 <p>Namaste, and welcome. I learned physical culture as a child at home, not from a book, and yoga has walked beside me ever since. I offer this course in the same spirit: not as a test to pass, but as a companion for your own journey.</p>
 <p>Come as you are. Some days your body will feel light and some days stiff; both are part of practice. Go slowly, breathe, and be kind to yourself. Six weeks from now, I hope yoga will feel like an old friend you meet each morning.</p>
 <p class="hint">Crescent lunge, our own drawing. You will meet the low lunge (Rider pose, B-9) in Week 4; raise the arms only when the legs feel steady.</p></div></div>
<div class="panel"><h3>About the author</h3>
 <p>The author of this chapter is from Karnataka, India. My grandfather, Sri V. S. Ramacharya, was an ardent student of physical culture and taught it to me himself.</p>
 <p>What I share here comes from that lineage and from my family's teachings. It is my personal view of practice, one path among many, offered with respect for every teacher and tradition.</p></div>`;
const COURSE_BASICS=[
 ["Why practise","Many people find that regular, gentle yoga helps them feel more flexible, steadier on their feet, calmer in the mind and more aware of their breath. Results differ from person to person; enjoy the practice for its own sake."],
 ["Choosing a style","Pick what fits your goal. Want calm? Favour slow holds and breathing. Want strength? Add standing poses and Sun salutations. Recovering or older? Start with the Chair level and lying poses. Use the goal buttons in the pose library to see what suits you."],
 ["Best time to practise","In our family, early morning and early evening are the times for practice, around sunrise or sunset. Any steady time works. Leave 2 to 3 hours after a full meal, or about an hour after a light snack."],
 ["Food and water","Practise on an empty stomach, or wait 2 to 3 hours after a full meal. Keep water nearby and take small sips between poses rather than large gulps during them."],
 ["Your body is your teacher","No book, video or teacher feels what you feel. A mild stretch is good; sharp, burning or shooting pain means come out at once. Every day the body is a little different; follow it."],
 ["Little and often","Fifteen minutes most days does more than one long session a week. Keep a regular time, keep it short at first, and let the habit grow."],
 ["Warming up","Begin with a minute of easy breathing, then roll the shoulders, circle the wrists and ankles, and turn the head slowly side to side. Two gentle rounds of the Sun salutation also warm the whole body."],
 ["Your practice space","A clean, airy spot with room to stretch your arms and legs in every direction. Keep the floor clear, phones on silent, and a wall or chair close by for balance. Natural light is lovely; a quiet corner is enough."]
];
const KIT_SVG=(d)=>`<svg viewBox="0 0 120 70" class="kitsvg" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${d}</svg>`;
const KIT=[
 ["Mat","A non-slip surface the length of your body, to stop hands and feet sliding.","A cotton dhurrie or a folded blanket on a firm, non-slippery floor.",`<path d="M10 50 L95 50 Q108 50 108 38 Q108 26 95 26 L95 50"/><path d="M10 50 L10 40 L95 40"/>`],
 ["Block","A light foam block that brings the floor closer in standing poses and forward bends.","A thick hardback book, or two books taped together.",`<path d="M25 30 L70 30 L90 20 L45 20 Z"/><path d="M25 30 L25 55 L70 55 L70 30"/><path d="M70 55 L90 45 L90 20"/>`],
 ["Brick","A firm, heavier block for steady support under the hips or hands.","A sturdy wooden board, a low stool, or a folded mat stacked firm.",`<rect x="25" y="25" width="60" height="25" rx="2"/><path d="M85 25 L97 18 L97 43 L85 50"/><path d="M25 25 L37 18 L97 18"/>`],
 ["Bolster","A long firm cushion to lie or sit on in resting and restorative poses.","Two or three bed pillows inside a pillowcase, or a rolled quilt tied with string.",`<ellipse cx="22" cy="38" rx="10" ry="14"/><path d="M22 24 L98 24"/><path d="M22 52 L98 52"/><path d="M98 24 Q108 38 98 52"/>`],
 ["Blanket","Folded under the hips for sitting, under the knees for kneeling, or over you in rest pose.","Any thick shawl, bedsheet folded in four, or a towel.",`<path d="M15 25 L100 25 L100 50 L15 50 Z"/><path d="M15 33 L100 33"/><path d="M15 41 L100 41"/>`],
 ["Strap","A long belt that extends your reach when the hands cannot meet the feet.","A cloth belt, a dupatta, a long scarf or a towel.",`<path d="M10 45 Q35 15 60 40 Q85 65 105 30"/><rect x="52" y="34" width="12" height="10"/>`]
];
const KIT_HTML=`<div class="panel"><h3>What you need</h3><p>Yoga needs very little. You can buy props, or use what is already at home; both work equally well.</p>
 <div class="kit">${KIT.map(([n,t,h,d])=>`<div class="kitem">${KIT_SVG(d)}<div><strong>${n}</strong><p>${t}</p><p class="hint"><strong>Use what's at home:</strong> ${h}</p></div></div>`).join("")}</div>
 <h3>What to wear</h3><ul>
  <li>Anything that lets you stretch and breathe freely, in a fabric that does not slip: cotton is ideal in warm weather.</li>
  <li>Track pants or leggings with a fitted top; a kurta with churidar or loose pyjama; salwar kameez with the dupatta set aside or tied back; a long tunic over leggings.</li>
  <li>Modest wear: a fitted head covering pinned so it stays in place when you bend or lie down, long sleeves and a longer top, and leggings or loose trousers. Every pose in this course works in modest dress.</li>
  <li>Practise barefoot for grip. Remove jewellery, watches and anything that could press or catch.</li>
  <li>Keep a light shawl nearby for rest pose, as the body cools quickly.</li></ul>
 <p class="hint">No brands are recommended. Simple, inexpensive props work as well as costly ones.</p></div>`;
const EASY_SEAT=`<div class="panel cwel"><canvas data-k="sukha" role="img" aria-label="Our own drawing of an easy cross-legged seat with hands resting on the knees"></canvas><div>
 <h3>Easy seat with the knowledge gesture</h3><p class="sa">Sukhasana with Jnana mudra</p>
 <p>Sit cross-legged on a folded blanket so the hips are a little higher than the knees. Lengthen the spine and relax the shoulders. Rest the backs of the hands on the knees, and touch the tip of each index finger to the tip of the thumb, the other three fingers soft and straight. Close the eyes and breathe slowly. This is the seat for breathing practice and for resting between poses.</p>
 <p class="hint">Knees or hips stiff? Sit on a higher cushion, or on a chair with both feet flat on the floor.</p></div></div>`;
const BEFORE_START=["Upside-down poses (headstand, shoulder stand, plough) are not part of this course. Learn them only with a qualified teacher, and never with neck problems, high blood pressure, eye pressure problems or in pregnancy.","Protect the knees: keep the knee over the ankle in lunges, pad the knees when kneeling, and never force the legs into crossed or kneeling seats.","Talk to your doctor or a qualified health professional before you begin, and take extra care if you are pregnant, older, or live with a long-term or recurring health condition.","Do not practise after drinking alcohol or taking recreational drugs, or with medicines that make you drowsy or dizzy.","Stop any pose or breath that causes pain or strong discomfort, and get medical advice if it does not pass.","This course is general education in our own words. It is not medical advice, diagnosis or treatment, and it does not promise any result."];
function poseByCode(c){ return PL.find(p=>p[0]===c); }
/* Daily basics and body coverage: every path, every look, every time mode. Coverage is kept on this device for 14 days. */
const BASICS_DAILY=[["Breathe","At least 10 slow breaths, out-breath longer than the in-breath."],["Water","Sip water through the day; a glass before and after practice."],["Rest","A regular bedtime and a few minutes of lying still each day."],["Stress","Pause three times a day: drop the shoulders, breathe out slowly."],["Lifestyle","Walk, eat simply, step away from screens, and move a little every hour."]];
function dailyHTML(){ return `<div class="panel daily"><h3>Daily basics, for everyone</h3><div class="dgrid">${BASICS_DAILY.map(([h,t])=>`<div><strong>${h}</strong><span>${t}</span></div>`).join("")}</div></div>`; }
const PARTS=[["neck","Neck"],["shoulders","Shoulders"],["arms","Arms"],["wrists","Wrists and hands"],["spine","Spine and back"],["hips","Hips"],["legs","Legs"],["knees","Knees"],["ankles","Ankles and feet"]];
const POSE_PARTS={"A-1":["neck"],"A-2":["hips","spine"],"A-3":["spine","legs","hips"],"A-4":["spine","legs"],"A-6":["neck","spine"],"A-7":["legs","hips"],"A-9":["legs"],"A-10":["knees","ankles","spine"],"A-11":["knees","ankles"],
 "B-1":["spine","neck"],"B-2":["spine","arms","neck"],"B-3":["legs","spine"],"B-4":["arms","wrists"],"B-5":["arms","wrists","spine"],"B-6":["shoulders","arms","wrists","legs","ankles"],"B-7":["spine","hips","knees"],"B-8":["arms","wrists"],"B-9":["hips","legs","knees"],"B-10":["spine","shoulders","legs"],"B-13":["spine","wrists","neck"],"A-13":["spine","hips","shoulders"],"B-14":["spine","legs","shoulders","wrists"],"C-16":["spine","hips","legs","knees"],"C-17":["spine","hips","shoulders"],"D-14":["legs","spine","hips"],"D-13":["shoulders","arms","spine"],
 "C-1":["spine","legs","ankles"],"C-2":["spine","neck"],"C-3":["hips","knees"],"C-4":["knees","ankles"],"C-5":["hips","knees"],"C-6":["shoulders","arms","spine"],"C-7":["shoulders","arms","hips"],"C-8":["spine","hips","neck"],"C-9":["spine","shoulders","knees"],"C-10":["legs","spine"],"C-11":["legs","spine"],"C-12":["knees","ankles"],"C-13":["neck","wrists"],"C-14":["spine","shoulders","hips"],"C-15":["hips","spine","knees"],
 "D-1":["ankles","legs"],"D-2":["spine","arms"],"D-3":["legs","spine","shoulders"],"D-4":["legs","knees","arms"],"D-5":["spine","legs"],"D-6":["legs","knees","arms","shoulders"],"D-7":["legs","hips","shoulders"],"D-8":["shoulders","arms","knees","ankles"],"D-9":["ankles","legs","hips"],"D-10":["legs","spine"],"D-11":["spine","neck"],"D-12":["legs","shoulders","ankles"],"E-1":["hips","legs"]};
const PART_TIP={neck:"Slow neck turns, or Lion (C-13)",shoulders:"Seated mountain (C-6) or Cow face arms (C-7)",arms:"Cobra (B-2) or Chair pose (D-4)",wrists:"Wrist circles, then Downward dog (B-6)",spine:"Simple twist (C-2) or Cobra (B-2)",hips:"Bound angle (C-3) or Knee hug (A-2)",legs:"Triangle (D-3) or Warrior (D-6)",knees:"Diamond pose (C-4), gently",ankles:"Ankle circles, then Tree (D-9)"};
const coverGet=()=>{ try{ return JSON.parse(store.get("ss-cover")||"{}"); }catch(e){ return {}; } };
function markParts(parts){ const c=coverGet(), d=new Date().toISOString().slice(0,10); parts.forEach(p=>c[p]=d); store.set("ss-cover",JSON.stringify(c)); }
function markPose(code){ markParts(POSE_PARTS[code]||[]); }
function covered(){ const c=coverGet(), lim=Date.now()-14*864e5; return PARTS.map(([k])=>k).filter(k=>c[k]&&Date.parse(c[k])>=lim); }
function missingFirst(codes){ const have=new Set(covered()); return [...codes].sort((a,b)=>(POSE_PARTS[b]||[]).filter(p=>!have.has(p)).length-(POSE_PARTS[a]||[]).filter(p=>!have.has(p)).length); }
function coverHTML(){ const have=new Set(covered()), miss=PARTS.filter(([k])=>!have.has(k)), on=k=>have.has(k)?"on":"";
  const fig=`<svg viewBox="0 0 120 210" class="bodymap" role="img" aria-label="Body map: ${have.size} of ${PARTS.length} parts worked in the last 14 days">
   <circle cx="60" cy="20" r="13" class="bz"/><rect x="54" y="33" width="12" height="9" class="bz ${on("neck")}"/>
   <rect x="34" y="42" width="52" height="10" rx="4" class="bz ${on("shoulders")}"/><rect x="50" y="52" width="20" height="48" class="bz ${on("spine")}"/>
   <rect x="24" y="52" width="9" height="50" rx="4" class="bz ${on("arms")}"/><rect x="87" y="52" width="9" height="50" rx="4" class="bz ${on("arms")}"/>
   <circle cx="28" cy="110" r="6" class="bz ${on("wrists")}"/><circle cx="92" cy="110" r="6" class="bz ${on("wrists")}"/>
   <rect x="40" y="100" width="40" height="16" rx="5" class="bz ${on("hips")}"/>
   <rect x="42" y="116" width="14" height="34" class="bz ${on("legs")}"/><rect x="64" y="116" width="14" height="34" class="bz ${on("legs")}"/>
   <circle cx="49" cy="156" r="7" class="bz ${on("knees")}"/><circle cx="71" cy="156" r="7" class="bz ${on("knees")}"/>
   <rect x="43" y="163" width="12" height="30" class="bz ${on("legs")}"/><rect x="65" y="163" width="12" height="30" class="bz ${on("legs")}"/>
   <rect x="38" y="194" width="20" height="8" rx="3" class="bz ${on("ankles")}"/><rect x="62" y="194" width="20" height="8" rx="3" class="bz ${on("ankles")}"/></svg>`;
  return `<div class="panel cover">${fig}<div><h3>Whole-body tracker</h3><p>Even 10 breaths and one or two poses a day count. The plan rotates the poses so that over one to two weeks you work every part of the body.</p>
   <p><strong>${have.size} of ${PARTS.length}</strong> parts worked in the last 14 days.</p>
   ${miss.length?`<p><strong>Next to work:</strong> ${miss[0][1]}. Try ${PART_TIP[miss[0][0]]}.</p><p class="hint">Still to do: ${miss.map(m=>m[1]).join(", ")}.</p>`:`<p><strong>Every part covered.</strong> Keep the rotation going.</p>`}
   <p class="hint">Parts fill in when you finish a hold timer in the pose library, or tick "I did today's poses" in a week. Kept only on this device.</p></div></div>`; }
/* Time modes: same week, three lengths. Planned reels and videos come in the same three cuts. */
const MODES={leisure:["Leisure time","about 60 minutes","The full class: arrive, warm up, key pose, the week's poses twice, breathing and a long rest."],
 optimal:["Optimal time","about 25 minutes","A standard session: short warm-up, the week's poses once, breathing and rest."],
 crunch:["Crunch time","about 8 minutes","A quick version: 2 minutes of breathing and 3 key poses, then a minute of rest."]};
let mode=store.get("ss-mode"); if(!MODES[mode]) mode="optimal";
function modeBar(){ return `<div class="modebar" role="group" aria-label="How much time do you have?"><span class="label">How much time do you have?</span>${Object.entries(MODES).map(([k,[l,d]])=>`<button class="cap" data-mode="${k}" aria-pressed="${k===mode}"><b>${l}</b> ${d}</button>`).join("")}</div>`; }
function bindModes(root){ root.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{ mode=b.dataset.mode; store.set("ss-mode",mode); const rr={crunch:"2",optimal:"4",leisure:"6"}[mode]; if(!running){ $("#rounds").value=rr; store.set("ss-rounds",rr); restart(); } renderCourse(); if($("#helpDlg").open) openHelp(); }); }
function classPlan(w){ const k=poseByCode(w.key), rest=w.p.filter(c=>c!==w.key).map(c=>poseByCode(c)).filter(Boolean), br=BR[w.b];
  let rows;
  if(mode==="crunch"){ const three=[k,...missingFirst(w.p.filter(c=>c!==w.key)).slice(0,2).map(poseByCode)];
    rows=[["0 to 2 min",`Breathing: ${br.name}, seated or lying.`],["2 to 7 min","Three key poses, 5 slow breaths each, both sides: "+three.map(p=>p[1]).join(", ")+". The second and third rotate to the body parts you have not worked yet."],["7 to 8 min","Rest pose (Shavasana) for a minute."]]; }
  else if(mode==="optimal"){
    rows=[["0 to 3 min","Arrive: easy seat, slow breathing."],["3 to 8 min","Warm up: shoulders, wrists, ankles, neck"+(w.sun?`, then ${Math.min(2,w.sun)} gentle rounds of the Sun salutation.`:".")],
     ["8 to 20 min",`Key pose: ${k[1]}. Then the week's poses once through: `+rest.map(p=>p[1]).join(", ")+"."],["20 to 25 min",`Breathing: ${br.name}, then rest pose.`]]; }
  else rows=[["0 to 5 min",w.b==="sukha"?"Arrive: lie in rest pose with full breathing, filling the belly, then the ribs, then the chest, and emptying in the same order. Out-breath longer than the in-breath.":"Arrive: easy seat with the knowledge gesture, eyes closed, slow breathing."],["5 to 15 min","Warm up: shoulder rolls, wrist and ankle circles, slow neck turns"+(w.sun?`, then ${w.sun} gentle rounds of the Sun salutation.`:".")],
   ["15 to 20 min",`Key pose of the week: ${k[1]} (${k[2]}). Hold 3 times for 5 slow breaths, resting between.`],
   ["20 to 45 min","The week's sequence, twice through: "+rest.map(p=>p[1]).join(", ")+"."],
   ["45 to 52 min",`Breathing: ${br.name} (${br.sa}).`+(w.aum?" Then three rounds of AUM.":"")],["52 to 60 min","Cool down with Knee hug and Reclining twist, then Rest pose (Shavasana) under a light blanket. Sit up slowly and note one thing you noticed in your journal."]];
  return `<ol class="cplan">${rows.map(([t,d])=>`<li><b>${t}</b> ${d}</li>`).join("")}</ol>`; }
/* "How to use this" help, one per tab */
const HELP={
 surya:"Pick a guide, a level and a number of rounds, then press Start. Follow the moving figure and the spoken cues; the steps below show the whole sequence. Children practise with an adult nearby.",
 aum:"Sit tall, press Start and chant along: A in the belly, U in the chest, M in the head. Keep the sound soft.",
 nadi:"Choose a breathing practice, read the care note, then press Start and follow the counts. The drawing shows which nostril is open. Stop if you feel light-headed.",
 course:"Work through the weeks in order, at your own pace, and repeat any week. Each week: a thought, the poses (tap one to open its card), breathing, a home tip, session ticks, a class to finish the week and a private journal.",
 poses:"Browse by group (A to F) or by goal. Tap Read more for steps, cautions and a hold timer. Advanced poses are teacher-led only.",
 map:"Tap a lesson on the left. Open lessons are free; lessons marked Members need you to sign in. Spiritual lessons appear only if you choose a faith track and tick spiritual content.",
 pyramid:"Tap any level to compare the eight limbs of yoga with two modern models. These are parallels to learn from, not proof."};
function openHelp(){ const d=$("#helpDlg"), tab=document.querySelector('#tabs button[aria-selected="true"]');
  $("#helpBody").innerHTML=`<h2>How to use this: ${tab?tab.textContent:"this page"}</h2><p>${HELP[practice]||HELP.surya}</p>
  <h3>How the course unfolds</h3><ol class="cplan">${COURSE.map(w=>`<li><b>${w.t.split(" · ")[0]}</b> ${w.t.split(" · ")[1]}</li>`).join("")}<li><b>Then</b> Keep practising three to five times a week, try the Steady level, and find a good teacher for the next steps.</li></ol>
  <h3>Pick your time</h3><p class="hint">Every week comes in three lengths. The planned reels and videos follow the same three cuts, so they play the length you choose.</p>${modeBar()}
  <ul>${Object.values(MODES).map(([l,d,t])=>`<li><strong>${l} (${d}):</strong> ${t}</li>`).join("")}</ul>`;
  bindModes(d); if(!d.open) d.showModal(); }
function renderCourse(){
  const done=k=>store.get("ss-course-"+k)==="1";
  const intro=`<div class="panel only-studio"><h3>Six weeks to a steady practice</h3><p>Short sessions, clear steps, real progress. Start on the floor, build up to a full 30-minute flow, and track every session. No experience and no flexibility needed: just a mat, some space and a few minutes a day.</p><p class="hint">Sanskrit names are shown in small type for reference. Switch the look in "Your practice track" any time.</p></div>
  <div class="panel only-family"><h3>From our family to yours</h3><p>This course is taught the way physical culture was taught in our home in Karnataka: little by little, every day, with respect for the body and the breath.</p></div>`+COURSE_WELCOME+`<div class="panel"><h3>How to use this course</h3><p><strong>Go at your own pace.</strong> Repeat any week as often as you like, and come back to earlier weeks whenever you want. Each week has a thought to carry with you, how-to guides for every pose, a one-hour class to finish the week that opens with the week's key pose, and a private journal for what you notice.</p><p>Six weeks, three or four short sessions a week, from lying on the floor to one complete session. Do the week's poses in order, holding each for 3 to 6 slow breaths, then rest. On the other days, do the breathing practice for 5 minutes. Repeat a week if it felt hard; there is no hurry. Every pose links to its card in the pose library, with steps, a hold timer and care notes.</p></div><h3 class="csec">The basics</h3>`+EASY_SEAT+KIT_HTML+`<div class="cintro">${COURSE_BASICS.map(([h,t])=>`<div class="panel"><h3>${h}</h3><p>${t}</p></div>`).join("")}</div>`;
  const before=`<div class="panel warn"><h3>Before you start</h3><ul>${BEFORE_START.map(t=>`<li>${t}</li>`).join("")}</ul><label for="cAgree"><input type="checkbox" id="cAgree" ${done("agree")?"checked":""}> I have read this and will practise with care.</label></div>`;
  const weeks=COURSE.map((w,i)=>{ const br=BR[w.b];
    const sess=Array.from({length:w.s},(_,k)=>`<label><input type="checkbox" class="cSess" data-k="w${i+1}s${k+1}" ${done("w"+(i+1)+"s"+(k+1))?"checked":""}> Session ${k+1}</label>`).join("");
    const poses=w.p.map(c=>{ const p=poseByCode(c); return p?`<button class="cpose" data-c="${c}"><canvas data-k="${p[3]}" role="img" aria-label="Drawing of ${p[1]}"></canvas><span><b>${c}</b> ${p[1]}<em>${p[2]}</em></span></button>`:""; }).join("");
    const extra=(w.sun?`<button class="btn" data-go="surya" data-r="${w.sun}">Sun salutation, ${w.sun} rounds, Gentle</button>`:"")+(w.aum?`<button class="btn" data-go="aum">Finish with AUM chanting</button>`:"");
    return `<article class="panel cweek"><h3>${w.t}</h3><p class="cins">“${w.ins}”</p>${w.verse?`<p class="hint"><em>${w.verse[0]}</em> ${w.verse[1]}</p>`:""}<p>${w.f}</p>${w.plan?`<p><strong>${w.plan}</strong></p>`:""}<p class="hint">${w.s} sessions this week, ${MODES[mode][1]} each (${MODES[mode][0].toLowerCase()}).</p>
      <div class="cposes">${poses}</div>
      ${w.halfsun?halfSunHTML():""}
      ${w.found?`<ul class="found"><li><strong>Feet (foot lock, pada bandha):</strong> feet hip-width and parallel, toes spread; weight on the heel, the big-toe mound and the little-toe mound; toes long and relaxed.</li><li><strong>Hands (hand lock, hasta bandha):</strong> fingers spread wide, press through the knuckles and fingertips so the wrists are not carrying all the load.</li><li><strong>Sitting bones:</strong> rock side to side to feel the two bones under the hips, then sit evenly on both, on a cushion if the back rounds.</li><li><strong>Breath leads:</strong> start each movement with the breath and finish the movement before the breath ends.</li></ul><p class="hint">Arm balances with the legs lifted, such as the crow, are teacher-guided only and are not part of this course.</p>`:""}
      ${w.seq?`<p><strong>Closing sequence:</strong> ${w.seq.map(c=>poseByCode(c)[1]).join(" → ")}. Three slow breaths in each.</p>`:""}
      <p><strong>Breathing:</strong> ${br.name} (${br.sa}), 5 minutes.${w.b==="booklet"?" Keep the pauses off this week.":""}</p>
      <div class="controls"><button class="btn solid" data-br="${w.b}">Open the breathing practice</button>${extra}</div>
      <p><strong>Home practice tip:</strong> ${w.tip}</p><div class="toggles">${sess}</div><p><button class="btn" data-did="${i}">I did today's poses</button> <span class="hint didOut"></span></p>
      <details class="cclass"><summary><strong>End-of-week class, ${MODES[mode][0].toLowerCase()} (${MODES[mode][1]})</strong> (opens with ${poseByCode(w.key)[1]})</summary>${classPlan(w)}</details>
      <details class="cjournal"><summary><strong>My practice journal, Week ${i+1}</strong></summary><p class="hint">Private notes. When you are signed in they are kept in your private member area; otherwise only on this device.</p>
        <label class="sel" for="jn${i+1}"><span class="label">What did I notice? (body, breath, mood, sleep)</span><textarea id="jn${i+1}" class="jn" data-k="${i+1}" rows="4">${(store.get("ss-journal-w"+(i+1))||"").replace(/</g,"&lt;")}</textarea></label></details></article>`; }).join("");
  const total=COURSE.reduce((a,w)=>a+w.s,0), got=COURSE.reduce((a,w,i)=>a+Array.from({length:w.s},(_,k)=>done("w"+(i+1)+"s"+(k+1))?1:0).reduce((x,y)=>x+y,0),0);
  const next=`<div class="panel"><h3>How to spot a good teacher</h3><ul><li>They ask about your health, injuries and experience before the first class.</li><li>They offer easier options and props, and never push you into pain.</li><li>They can explain why a pose is done and how to come out of it safely.</li><li>They have recognised training and keep learning, and are happy to tell you where they trained.</li><li>They respect your body, your beliefs and your boundaries, and ask before any hands-on help.</li><li>Your classes leave you calmer and steadier, not hurt or exhausted.</li></ul></div><div class="panel"><h3>What next</h3><ul><li>Keep three to five sessions a week; repeat Week 6 or mix your favourite poses with the goal buttons in the pose library.</li><li>Try the Steady level and more Sun salutation rounds when the Gentle level feels easy.</li><li>Explore the Lessons tab to learn how the body and breath work.</li><li>Advanced and upside-down poses only with a qualified teacher present.</li></ul></div>`;
  $("#courseBody").innerHTML=`${modeBar()}${dailyHTML()}${coverHTML()}${intro}${worldHTML()}${before}<h3 class="csec">The poses and sequences</h3><p class="hint" id="cProg">Progress: ${got} of ${total} sessions ticked on this device.</p>${weeks}${next}`;
  document.querySelectorAll("#courseBody canvas").forEach(c=>{ const k=POSEPH[c.dataset.k]; if(k) c.outerHTML=poseImg(k); else c.remove(); });
  document.querySelectorAll("#styleChips .cap").forEach(b=>b.onclick=()=>{ document.querySelectorAll("#styleChips .cap").forEach(x=>x.removeAttribute("aria-pressed")); b.setAttribute("aria-pressed","true"); const [l,t]=STYLE_FOR[b.dataset.s]; $("#styleOut").innerHTML=`<strong>${l}:</strong> ${t}`; });
  document.querySelectorAll(".jn").forEach(t=>t.oninput=()=>store.set("ss-journal-w"+t.dataset.k,t.value));
  bindModes($("#courseBody"));
  document.querySelectorAll("[data-did]").forEach(b=>b.onclick=()=>{ const w=COURSE[+b.dataset.did]; (mode==="crunch"?missingFirst(w.p.filter(c=>c!==w.key)).slice(0,2).concat(w.key):w.p).forEach(markPose); renderCourse(); });
  $("#cAgree").onchange=e=>store.set("ss-course-agree",e.target.checked?"1":"0");
  document.querySelectorAll(".cSess").forEach(x=>x.onchange=()=>{ store.set("ss-course-"+x.dataset.k,x.checked?"1":"0"); renderCourse(); });
  const tab=p=>document.querySelector(`#tabs button[data-p="${p}"]`);
  document.querySelectorAll(".cpose").forEach(b=>b.onclick=()=>{ libGroup=b.dataset.c[0]; libGoal=null; tab("poses").click();
    const card=[...document.querySelectorAll(".pcard")].find(a=>a.querySelector(".code").textContent===b.dataset.c); if(card){ card.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"}); card.classList.add("flash"); setTimeout(()=>card.classList.remove("flash"),1600);} });
  document.querySelectorAll("[data-br]").forEach(b=>b.onclick=()=>{ $("#bsel").value=b.dataset.br; $("#tHolds").checked=false; tab("nadi").click(); $("#studio").scrollIntoView({behavior:reduce?"auto":"smooth"}); });
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{ if(b.dataset.r){ $("#level").value="gentle"; $("#rounds").value=b.dataset.r; } tab(b.dataset.go).click(); $("#studio").scrollIntoView({behavior:reduce?"auto":"smooth"}); });
}

/* Skin tone picker: every guide can be shown in any tone. */
const SKINS=[["","Guide's own tone"],["#f1cfae","Very light"],["#e3b892","Light"],["#c68e63","Medium"],["#a8714c","Tan"],["#7a4b32","Brown"],["#4f3022","Deep brown"]];
$("#skinSel").innerHTML=SKINS.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
(()=>{ const v=store.get("ss-skin"); if(v&&SKINS.some(x=>x[0]===v)){ $("#skinSel").value=v; skinPick=v; } })();
$("#skinSel").onchange=()=>{ skinPick=$("#skinSel").value||null; store.set("ss-skin",$("#skinSel").value); guides();
  if(!$("#posesWrap").hidden) renderLib(); if(!$("#courseWrap").hidden) renderCourse(); };
/* Yoga around the world: generic style names only, no teachers, brands or claims. */
const WORLD=[
 {h:"Eastern roots",t:"Where yoga began, in India, and how it is still passed on.",items:[
  ["Family and lineage teaching","Learned at home or from one teacher over many years, as this chapter was. Physical culture, breath and daily discipline go together."],
  ["Classical eight-limb path","The path of the Yoga Sutras: how we live, posture, breath, the senses, concentration and stillness. See the Eight limbs tab."],
  ["Traditional hatha schools","Poses, breathing, locks and cleansings practised as one system, usually in the morning, with a fixed order."],
  ["Devotion, knowledge and service","Paths of yoga beyond the body: devotion (bhakti), study and self-enquiry (jnana) and selfless work (karma)."],
  ["Self-paced room practice","Each student works through a set sequence at their own breath and speed, while the teacher moves around the room helping one person at a time. This way of teaching grew in Karnataka and is now found worldwide."],
  ["Gurukul and ashram life","Learning by living with a teacher: early rising, simple food, chanting, study and community work."]]},
 {h:"Western studio styles",t:"Ways of teaching that grew in studios in Europe, the Americas and Australia.",items:[
  ["Alignment-focused","Slow, precise poses, often with props such as belts, blocks and walls. Good for learning form safely."],
  ["Flowing (vinyasa)","Poses linked together with the breath in a moving sequence. Good for fitness and focus."],
  ["Slow and deep (yin)","Floor poses held for several minutes with relaxed muscles. Good for calm and gentle flexibility."],
  ["Dynamic set series","The same demanding sequence each class. Good for those who like routine and challenge."],
  ["Heated room classes","A tough workout in a room heated well above normal. <strong>Heat caution:</strong> drink water before, during and after, and leave the room if you feel dizzy, sick or faint. Skip heated classes if you are pregnant, or have a heart condition or high or low blood pressure, unless your doctor agrees."],
  ["Restorative","Lying and supported poses with cushions and blankets, for deep rest."]]},
 {h:"Global and modern forms",t:"New ways people practise everywhere today.",items:[
  ["Chair yoga","Every pose done seated or holding a chair. For older people, offices and anyone with limited balance. See the Chair level."],
  ["Partner yoga","Two people support and balance each other. Builds trust and fun; go slowly and talk."],
  ["Aerial yoga","Poses in a soft fabric hammock hung from the ceiling. Only in a studio with a trained teacher and safe fittings."],
  ["Laughter yoga","Group laughing exercises with deep breathing. Playful and social; no poses needed."],
  ["Online and community classes","Practice at home with video, or free classes in parks and community halls on shared days."]]}
];
const STYLE_FOR={calm:["Feel calmer","Slow and deep (yin), Restorative, and breathing practices. In this course: Weeks 1 and 3."],strength:["Get stronger","Flowing (vinyasa), Dynamic set series, and Sun salutations. In this course: Weeks 5 and 6."],workout:["A tough workout","Dynamic set series or Heated room classes, once you know the basics. Read the heat caution first, and build up slowly."],form:["Learn the poses safely","Alignment-focused and Chair yoga. In this course: start at Week 1 with the Gentle level."],senior:["Older age or limited balance","Chair yoga and Restorative. Use the Chair level and keep a wall close."],ownpace:["Learn at my own pace","Self-paced room practice, or this course at home: repeat any week as often as you like."],social:["Practise with others","Partner yoga, Laughter yoga, and community classes."],inner:["The spiritual side","The classical eight-limb path and family or lineage teaching. See the Eight limbs tab and AUM chanting."]};
function worldHTML(){
  return `<h3 class="csec">Yoga around the world</h3><p>Yoga began in India and is now practised on every continent, in many forms. What you see in most magazines is one interpretation, mostly from Western studios. Here is the wider landscape, starting from our own roots.</p>
  <div class="cintro">${WORLD.map(c=>`<div class="panel"><h3>${c.h}</h3><p class="hint">${c.t}</p><ul>${c.items.map(([n,t])=>`<li><strong>${n}.</strong> ${t}</li>`).join("")}</ul></div>`).join("")}</div>
  <div class="panel"><h3>Find the style for your goal</h3><div class="chips" id="styleChips">${Object.entries(STYLE_FOR).map(([k,[l]])=>`<button class="cap" data-s="${k}">${l}</button>`).join("")}</div><p id="styleOut" class="hint">Tap a goal.</p>
  <p class="hint">Every style can be practised by every body: our drawings and planned videos show people of different ages, sizes and skin tones, in track wear, salwar kameez, sari-friendly wear, kurta and modest wear with a head covering. Pick a guide and a skin tone above.</p></div>`;
}

/* Player: play, pause, seek, step, pace, captions, language, still images, dial and keys. Plain web player: works in any modern browser on TV, phone, tablet or computer. */
let pace=+(store.get("ss-pace")||1); if(!(pace>=.5&&pace<=1.5)) pace=1;
let stillMode=false, capsOn=store.get("ss-caps")!=="0", capLang=store.get("ss-caplang")||"en";
const LANGS={en:["English","en-IN"],hi:["हिन्दी Hindi","hi-IN"],kn:["ಕನ್ನಡ Kannada","kn-IN"],ta:["தமிழ் Tamil","ta-IN"],te:["తెలుగు Telugu","te-IN"],ar:["العربية Arabic","ar-AE"],fr:["Français","fr-FR"],es:["Español","es-ES"],zh:["中文 Chinese","zh-CN"]};
const WORDS={in:{hi:"साँस लें",kn:"ಉಸಿರು ಒಳಗೆ ತೆಗೆದುಕೊಳ್ಳಿ",ta:"மூச்சை உள்ளிழுங்கள்",te:"శ్వాస లోపలికి తీసుకోండి",ar:"شهيق",fr:"Inspirez",es:"Inhala",zh:"吸气"},
 out:{hi:"साँस छोड़ें",kn:"ಉಸಿರು ಹೊರಗೆ ಬಿಡಿ",ta:"மூச்சை வெளியே விடுங்கள்",te:"శ్వాస బయటకు వదలండి",ar:"زفير",fr:"Expirez",es:"Exhala",zh:"呼气"},
 rest:{hi:"आराम करें",kn:"ವಿಶ್ರಾಂತಿ",ta:"ஓய்வு",te:"విశ్రాంతి",ar:"استرخِ",fr:"Repos",es:"Descansa",zh:"休息"},
 hold:{hi:"रुकें",kn:"ತಡೆಯಿರಿ",ta:"நிறுத்துங்கள்",te:"ఆగండి",ar:"توقّف",fr:"Pause",es:"Pausa",zh:"停"},
 hum:{hi:"गुनगुनाएँ",kn:"ಗುನುಗಿ",ta:"ஹம் செய்யுங்கள்",te:"హమ్ చేయండి",ar:"همهمة",fr:"Fredonnez",es:"Tararea",zh:"哼鸣"}};
function wordKey(t){ t=(t||"").toLowerCase(); if(/^breathe in|^in |^inhale/.test(t)) return "in"; if(/^breathe out|^out|^exhale/.test(t)) return "out"; if(/^rest|^stand easy/.test(t)) return "rest"; if(/^hold|^pause/.test(t)) return "hold"; if(/^hum/.test(t)) return "hum"; return null; }
function tr(t){ if(capLang==="en") return t; const k=wordKey(t); return k?WORDS[k][capLang]:t; }
const sayBase=say;
say=function(text,lang){ if(capLang==="en") return sayBase(text,lang); const k=wordKey(text); if(!k) return; sayBase(WORDS[k][capLang],LANGS[capLang][1]); };
function segStarts(){ const o=[]; let a=0; sched.forEach(s=>{ o.push(a); a+=s.dur; }); return o; }
function seekTo(t){ if(!sched.length) build(); elapsed=Math.max(0,Math.min(total()-.01,t)); done=false; segIdx=at(elapsed).k; last=performance.now(); try{speechSynthesis.cancel()}catch(e){} $("#prog").style.width=(100*elapsed/total())+"%"; }
function step(d){ if(!sched.length) build(); const st=segStarts(), k=at(elapsed).k, n=Math.max(0,Math.min(st.length-1,k+d)); if(running&&!stillMode) pause(); seekTo(st[n]+.001); }
function setPace(v){ pace=v; store.set("ss-pace",String(v)); $("#paceSel").value=String(v); }
function setStill(v){ stillMode=v; $("#stillBtn").setAttribute("aria-pressed",v); $("#dialWrap").hidden=!v; if(v&&running) pause(); }
function fmt(t){ t=Math.max(0,Math.round(t)); return Math.floor(t/60)+":"+String(t%60).padStart(2,"0"); }
function playerTick(){ $("#pPlay").textContent=running?"⏸ Pause":"▶ Play"; $("#tcode").textContent=fmt(elapsed)+" / "+fmt(total()); const c=$("#capt"); c.hidden=!capsOn||!(running||elapsed>0)||done;
  if(!c.hidden){ c.textContent=tr($("#cBreath").textContent)+(capLang==="en"?" · "+$("#cName").textContent:" · "+$("#cSa").textContent); c.dir=capLang==="ar"?"rtl":"ltr"; } }
$("#paceSel").onchange=()=>setPace(+$("#paceSel").value);
$("#capBtn").onclick=()=>{ capsOn=!capsOn; store.set("ss-caps",capsOn?"1":"0"); $("#capBtn").setAttribute("aria-pressed",capsOn); };
$("#langSel").innerHTML=Object.entries(LANGS).map(([k,[l]])=>`<option value="${k}">${l}</option>`).join(""); $("#langSel").value=LANGS[capLang]?capLang:"en";
$("#langSel").onchange=()=>{ capLang=$("#langSel").value; store.set("ss-caplang",capLang); };
$("#pPlay").onclick=()=>running?pause():start();
$("#back10").onclick=()=>seekTo(elapsed-10); $("#fwd10").onclick=()=>seekTo(elapsed+10);
$("#prevStep").onclick=()=>step(-1); $("#nextStep").onclick=()=>step(1);
$("#stillBtn").onclick=()=>setStill(!stillMode);
$("#fsBtn").onclick=()=>{ const el=$("#studio"); try{ document.fullscreenElement?document.exitFullscreen():(el.requestFullscreen||el.webkitRequestFullscreen).call(el); }catch(e){} };
$("#capBtn").setAttribute("aria-pressed",capsOn); setPace(pace);
/* On-screen dial: turn clockwise to go forward one step every 30 degrees, anticlockwise to go back. Mouse wheel, trackpad and watch-crown style scroll do the same. */
(()=>{ const d=$("#dial"); let a0=null, acc=0;
  const ang=e=>{ const r=d.getBoundingClientRect(); return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI; };
  d.addEventListener("pointerdown",e=>{ a0=ang(e); acc=0; d.setPointerCapture(e.pointerId); });
  d.addEventListener("pointermove",e=>{ if(a0===null) return; let a=ang(e), dd=((a-a0+540)%360)-180; a0=a; acc+=dd; $("#dialKnob").style.transform=`rotate(${(parseFloat(d.dataset.r||0)+dd)}deg)`; d.dataset.r=parseFloat(d.dataset.r||0)+dd;
    while(acc>=30){ acc-=30; step(1); } while(acc<=-30){ acc+=30; step(-1); } });
  d.addEventListener("pointerup",()=>{ a0=null; });
  let wacc=0; const onWheel=e=>{ if(!stillMode) return; e.preventDefault(); wacc+=e.deltaY; if(wacc>60){ wacc=0; step(1); } if(wacc<-60){ wacc=0; step(-1); } };
  d.addEventListener("wheel",onWheel,{passive:false}); $("#cv").addEventListener("wheel",onWheel,{passive:false});
})();
document.addEventListener("keydown",e=>{ if(!["surya","aum","nadi"].includes(practice)) return; if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable) return;
  const k=e.key; let h=true;
  if(k===" "||k==="k"||k==="MediaPlayPause"){ running?pause():start(); }
  else if(k==="ArrowRight"||k==="MediaTrackNext") step(1); else if(k==="ArrowLeft"||k==="MediaTrackPrevious") step(-1);
  else if(k==="l") seekTo(elapsed+10); else if(k==="j") seekTo(elapsed-10);
  else if(k==="c") $("#capBtn").click(); else if(k==="s") setStill(!stillMode); else if(k==="f") $("#fsBtn").click();
  else if(k==="]"||k===">") setPace(Math.min(1.5,+(pace+.25).toFixed(2))); else if(k==="["||k==="<") setPace(Math.max(.5,+(pace-.25).toFixed(2)));
  else h=false; if(h) e.preventDefault(); });

/* Tabs and steps */
document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{
  practice=b.dataset.p; document.querySelectorAll("#tabs button").forEach(x=>x.setAttribute("aria-selected",x===b));
  const st=["surya","aum","nadi"].includes(practice);
  $("#stepsWrap").hidden=practice!=="surya"; $("#studio").hidden=!st; $("#memberWrap").hidden=practice!=="map"; $("#posesWrap").hidden=practice!=="poses"; $("#pyrWrap").hidden=practice!=="pyramid"; $("#courseWrap").hidden=practice!=="course"; $("#bselL").hidden=practice!=="nadi"; holdsVis();
  stopMapAnim(); clearInterval(holdTimer); restart(); if(practice==="map") renderMap(); if(practice==="poses") renderLib(); if(practice==="pyramid") renderPyr(); if(practice==="course") renderCourse(); fit();
});
$("#steps").innerHTML=VIS().map((k,n)=>{ const s=STEPS[k]; return `<button class="chip" data-k="${k}"><b>${n+1}</b>${s.en}<em>${s.sa}</em></button>`; }).join("");
document.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{ if(running) return; restart(); previewIdx=+c.dataset.k; });

/* Boot */
$("#mstyle").innerHTML=Object.entries(STYLES).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("");
$("#bsel").innerHTML=Object.entries(BR).map(([k,v])=>`<option value="${k}">${v.name} (${v.sa})</option>`).join("");
$("#trad").innerHTML=TRAD.map(t=>`<option value="${t[0]}">${t[1]}</option>`).join("");
$("#mstyle").onchange=()=>{ store.set("ss-mstyle",$("#mstyle").value); setStyle(); };
["tSpirit","tChants"].forEach(id=>{ $("#"+id).checked=store.get("ss-"+id)==="1"; });
["level","rounds","mstyle","bsel","trad","mVer","bVer"].forEach(id=>{ const v=store.get("ss-"+id); if(v&&[...$("#"+id).options].some(o=>o.value===v)) $("#"+id).value=v; });
const vid=(MEM&&MEM.id?String(MEM.id):"")||store.get("yoga-viewer")||("V-"+Math.random().toString(36).slice(2,8).toUpperCase()); store.set("yoga-viewer",vid);
/* The page watermark (site-wide) shows the member ID when signed in. */
function fit(){ sizeCanvas(cv); }
new ResizeObserver(fit).observe(cv); fit();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>guides());
/* Look switcher */
const LOOK_HINT={"":"Traditional: Indian names alongside English, warm paper colours.","family":"Family lineage: the course in our family's voice, warm earth colours.","studio":"Studio style: clean and modern, English first, for gym and studio practice. Same poses, same safety notes."};
function setLook(v){ if(v) document.documentElement.dataset.look=v; else delete document.documentElement.dataset.look; $("#lookHint").textContent=LOOK_HINT[v]; store.set("ss-look",v);
  if(!$("#posesWrap").hidden) renderLib(); if(!$("#courseWrap").hidden) renderCourse(); guides(); }
(()=>{ const v=store.get("ss-look")||""; $("#lookSel").value=LOOK_HINT[v]!==undefined?v:""; })();
$("#helpBtn").onclick=openHelp; $("#dailyTop").innerHTML=dailyHTML();
$("#lookSel").onchange=()=>setLook($("#lookSel").value);
if(BUILD==="public"){ TOPICS.kriya.open=0; TOPICS.kriya.gated=1; }
setLook($("#lookSel").value); restart(); habits(); renderTrack(); requestAnimationFrame(frame);

if(MEM&&$("#trackSave")) $("#trackSave").textContent="Saved in your private member area.";

};
/* Start when the page part is on screen (the site page, or the single-file preview after a route change). */
(function(){ function go(){ var a=document.getElementById("yoga-app"); if(!a||a.getAttribute("data-started")) return; a.setAttribute("data-started","1");
  try{ window.YogaStart(); }catch(e){ a.setAttribute("data-error", String(e&&e.message||e)); throw e; } }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",go); else go();
  new MutationObserver(go).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",function(e){ var c=e.target.closest&&e.target.closest("[data-dlg-close]"); if(c){ var d=c.closest("dialog"); if(d) d.close(); } }); })();
