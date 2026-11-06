(function(){
"use strict";
var $=function(id){return document.getElementById(id);};
var pts=0,done={};
function award(key,n){ if(done[key])return; done[key]=1; pts+=n; $("xp").textContent="Points: "+pts; }

// 1. Plan your 24 hours
var hk=["sleep","work","learn","move","people","play"],hs={};
function hours(){
  var t=0; hk.forEach(function(k){var i=$("h-"+k);hs[k]=parseFloat(i.value);i.parentNode.querySelector("output").textContent=hs[k];t+=hs[k];});
  hk.forEach(function(k){document.querySelector('#bar24 i[data-s="'+k+'"]').style.width=(hs[k]/Math.max(24,t)*100)+"%";});
  var d=24-t,r=$("h-read");
  r.textContent=d===0?"Exactly 24 hours. Well planned.":d>0?d+" hours still free. Give them a home.":(-d)+" hours too many. Take some back.";
  return d;
}
hk.forEach(function(k){$("h-"+k).addEventListener("input",hours);}); hours();
$("h-go").addEventListener("click",function(){
  if(hours()!==0){return;}
  var m=hs.sleep<6?"Under 6 hours of sleep is a warning sign. Try 7 to 8.":hs.move<0.5?"Add a little movement. Even 30 minutes helps.":hs.people<1?"Make time for people. It is the strongest predictor of a happy life.":"Balanced. Keep it for a week and see how you feel.";
  $("h-read").textContent="Locked in. +10 points. "+m; award("hours",10);
});

// 2. Balance the load
var M=[["Lights",1],["Lathe",3],["Welder",4],["Compressor",2.5],["Oven",3],["Computers",1.5],["Pump",2],["Air-con",2.5]];
var on=[],box=$("machs");
M.forEach(function(m,i){
  var b=document.createElement("button");b.type="button";b.setAttribute("aria-pressed","false");
  b.innerHTML=m[0]+"<b>"+m[1]+" kW</b>";
  b.addEventListener("click",function(){ if($("ld-fill").parentNode.classList.contains("trip"))return; on[i]=!on[i];b.setAttribute("aria-pressed",on[i]?"true":"false");load(); });
  box.appendChild(b);
});
function load(){
  var t=0;M.forEach(function(m,i){if(on[i])t+=m[1];});
  var meter=$("ld-fill").parentNode,r=$("ld-read");
  $("ld-fill").style.width=Math.min(100,t*10)+"%";
  if(t>10){meter.classList.add("trip");r.textContent=t+" kW. CLICK. The breaker tripped. Reset it and try a different mix.";}
  else if(t>=8){r.textContent=t+" kW of 10 kW. In the efficient zone. +10 points."; award("load",10);}
  else r.textContent=t+" kW of 10 kW";
}
$("ld-reset").addEventListener("click",function(){
  on=[];$("ld-fill").parentNode.classList.remove("trip");
  Array.prototype.forEach.call(box.children,function(b){b.setAttribute("aria-pressed","false");});load();
});

// 3. Memory spark
var pads=$("pads").children,seq=[],pos=0,busy=false,reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function flash(p,cb){pads[p].classList.add("on");setTimeout(function(){pads[p].classList.remove("on");setTimeout(cb,150);},reduce?500:380);}
function play(i){ if(i>=seq.length){busy=false;pos=0;$("sp-read").textContent="Your turn. Repeat "+seq.length+".";return;} flash(seq[i],function(){play(i+1);}); }
function next(){seq.push(Math.floor(Math.random()*4));busy=true;$("sp-read").textContent="Watch...";setTimeout(function(){play(0);},500);}
$("sp-go").addEventListener("click",function(){seq=[];this.textContent="Restart";next();});
Array.prototype.forEach.call(pads,function(b){
  b.addEventListener("click",function(){
    if(busy||!seq.length)return; var p=+b.getAttribute("data-p");
    pads[p].classList.add("on");setTimeout(function(){pads[p].classList.remove("on");},150);
    if(p!==seq[pos]){var s=seq.length-1;$("sp-read").textContent="Missed. You remembered "+s+". Press Restart to beat it."+(s>=5?" +10 points.":"");if(s>=5)award("spark",10);seq=[];return;}
    pos++; if(pos===seq.length){ if(seq.length>=5)award("spark",10); $("sp-read").textContent="Yes! Round "+seq.length+" done.";busy=true;setTimeout(next,800);}
  });
});

// 4. Skill ladder quest
var Q=[
 ["Level 1: Which is a good first step when learning something new?",["Memorise everything at once","Try a small piece and practise it","Wait until you feel ready"],1],
 ["Level 2: Why does testing yourself work better than re-reading?",["It makes you retrieve the answer, which strengthens memory","It is faster","It uses less energy"],0],
 ["Level 3: You learn best when you also...",["Teach it to someone else","Sleep less","Avoid mistakes"],0]];
var qi=0,score=0,qt=$("q-text"),qa=$("q-ans"),lad=$("ladder").children;
function ask(){
  if(qi>=Q.length){qt.textContent="Quest complete: "+score+" of "+Q.length+".";qa.innerHTML="";
    $("q-read").textContent=score===Q.length?"Perfect. +20 points.":"Try again to climb higher.";if(score===Q.length)award("quest",20);$("q-share").hidden=false;return;}
  qt.textContent=Q[qi][0];qa.innerHTML="";
  Q[qi][1].forEach(function(a,i){var b=document.createElement("button");b.type="button";b.textContent=a;
    b.addEventListener("click",function(){var ok=i===Q[qi][2];b.className=ok?"ok":"no";if(ok){score++;lad[qi].className="up";}
      Array.prototype.forEach.call(qa.children,function(x){x.disabled=true;});setTimeout(function(){qi++;ask();},900);});
    qa.appendChild(b);});
}
ask();
$("q-share").addEventListener("click",function(){
  var t="I reached "+score+" of 3 on the House for Learning skill ladder. Can you beat it? "+location.href;
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){$("q-read").textContent="Copied. Paste it to a friend.";},function(){$("q-read").textContent=t;}); else $("q-read").textContent=t;
});
})();
