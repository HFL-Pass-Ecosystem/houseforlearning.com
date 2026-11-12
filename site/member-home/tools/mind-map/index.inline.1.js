"use strict";
var SVGNS="http://www.w3.org/2000/svg";
var COLORS=["#2B3A4A","#0F85DB","#3CC261","#E8A33D","#D9534F","#7A5BC7"];
var ICONS={
 eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z",
 ear:"M7 9a5 5 0 0110 0c0 3-3 4-3 7a2.5 2.5 0 01-5 0M10 9a2 2 0 014 0",
 pen:"M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
 hand:"M8 13V6a1.5 1.5 0 013 0v5M11 11V4.5a1.5 1.5 0 013 0V11M14 11V6a1.5 1.5 0 013 0v7a7 7 0 01-7 7h-1a6 6 0 01-5-3l-2-4a1.5 1.5 0 012.5-1.5L8 15",
 book:"M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13",
 bulb:"M9 18h6M10 21h4M12 3a6 6 0 00-3.5 11c.7.6 1 1.3 1 2h5c0-.7.3-1.4 1-2A6 6 0 0012 3z",
 target:"M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM12 11.5a.5.5 0 100 1",
 check:"M5 12l5 5 9-10",
 ask:"M9 9a3 3 0 116 0c0 2-3 2-3 5M12 18v.5",
 star:"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
 clock:"M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
 flag:"M5 21V4M5 4h11l-2 4 2 4H5"
};
function iconSvg(name){var s=document.createElementNS(SVGNS,"svg");s.setAttribute("viewBox","0 0 24 24");var p=document.createElementNS(SVGNS,"path");p.setAttribute("d",ICONS[name]);s.appendChild(p);return s}

var seq=0, root=null, sel=null, undo=[], viewOnly=false, present=false, steps=[], stepIdx=0, showAll=false;
var cam={x:40,y:40,k:1};
var KEY="sessionmap.v1";
var DEMO=false;

function mk(text){return {id:"n"+(++seq),text:text||"New box",note:"",color:"",icon:"",collapsed:false,children:[]}}
function find(id,n){n=n||root;if(n.id===id)return n;for(var i=0;i<n.children.length;i++){var r=find(id,n.children[i]);if(r)return r}return null}
function parentOf(t,n){n=n||root;for(var i=0;i<n.children.length;i++){if(n.children[i]===t)return n;var r=parentOf(t,n.children[i]);if(r)return r}return null}
function fixSeq(n){var m=parseInt(String(n.id).replace(/\D/g,""),10)||0;if(m>seq)seq=m;n.children.forEach(fixSeq)}
function clean(n,d){ // sanitise untrusted map data
 var o=mk(String(n&&n.text||"Box").slice(0,120));
 o.note=String(n&&n.note||"").slice(0,600);
 o.color=COLORS.indexOf(n&&n.color)>=0?n.color:"";
 o.icon=ICONS[n&&n.icon]?n.icon:"";
 o.collapsed=!!(n&&n.collapsed);
 if(n&&Array.isArray(n.children)&&d<12)o.children=n.children.slice(0,60).map(function(c){return clean(c,d+1)});
 return o}

function demoMap(){
 var r=mk("Demo Training Session");r.color=COLORS[0];r.note="Start here. Say the goal of the session in one line.";
 function add(p,t,note,col,ic){var n=mk(t);n.note=note||"";n.color=col||"";n.icon=ic||"";p.children.push(n);return n}
 var a=add(r,"Demo See it","Show a picture or a diagram first.",COLORS[1],"eye");
 add(a,"Demo Diagram","Draw the idea in three boxes.");add(a,"Demo Example","Show one finished example.");
 var b=add(r,"Demo Hear it","Explain in your own words. Ask learners to repeat it.",COLORS[2],"ear");
 add(b,"Demo Story","Tell one short story.");add(b,"Demo Discuss","Pairs talk for two minutes.");
 var c=add(r,"Demo Read and write it","Give a short handout. Learners write a summary.",COLORS[3],"pen");
 add(c,"Demo Key words","Five words to remember.");add(c,"Demo My summary","Write three lines.");
 var d=add(r,"Demo Do it","Learners try one task themselves.",COLORS[4],"hand");
 add(d,"Demo Task","One small hands-on task.");add(d,"Demo Check","Tick the checklist.");
 return r}
function starterMap(){
 var r=mk("Session topic");r.color=COLORS[0];r.note="Say the goal of the session here.";
 ["First step","Second step","Third step"].forEach(function(t,i){var n=mk(t);n.color=COLORS[i+1];r.children.push(n)});
 return r}

/* ---------- layout ---------- */
var mctx=document.createElement("canvas").getContext("2d");
function tw(t){mctx.font="600 14px Montserrat,Segoe UI,sans-serif";return mctx.measureText(t).width}
var NH=38,GY=14,GX=60,pos={};
function kids(n){
 if(present&&!showAll){return n.children.filter(function(c){return revealed[c.id]})}
 return n.collapsed&&!present?[]:n.children}
var revealed={};
function layout(){
 pos={};var colW=[];
 (function m(n,d){var w=Math.max(70,Math.ceil(tw(n.text))+28+(n.icon?26:0)+(n.children.length?22:0));
  n._w=w;colW[d]=Math.max(colW[d]||0,w);kids(n).forEach(function(c){m(c,d+1)})})(root,0);
 var xs=[0];for(var i=1;i<colW.length;i++)xs[i]=xs[i-1]+colW[i-1]+GX;
 var y=0;
 (function p(n,d){var ks=kids(n),cy;
  if(!ks.length){cy=y;y+=NH+GY}else{ks.forEach(function(c){p(c,d+1)});cy=(pos[ks[0].id].y+pos[ks[ks.length-1].id].y)/2}
  pos[n.id]={x:xs[d],y:cy,w:n._w,d:d}})(root,0)}
function colorOf(n){var c=n.color;if(c)return c;var p=parentOf(n);return p?colorOf(p):COLORS[0]}

/* ---------- draw ---------- */
function el(t,a,parent){var e=document.createElementNS(SVGNS,t);for(var k in a)e.setAttribute(k,a[k]);if(parent)parent.appendChild(e);return e}
function draw(){
 layout();
 var E=document.getElementById("edges"),N=document.getElementById("nodes");
 E.textContent="";N.textContent="";
 (function walk(n){
  var p=pos[n.id];if(!p)return;var col=colorOf(n);
  kids(n).forEach(function(c){var q=pos[c.id];
   var x1=p.x+p.w,y1=p.y+NH/2,x2=q.x,y2=q.y+NH/2,mx=(x1+x2)/2;
   el("path",{d:"M"+x1+" "+y1+"C"+mx+" "+y1+" "+mx+" "+y2+" "+x2+" "+y2,fill:"none",stroke:colorOf(c),"stroke-width":2.5,"stroke-linecap":"round"},E);
   walk(c)})
 })(root);
 (function walk(n){
  var p=pos[n.id];if(!p)return;var col=colorOf(n),isRoot=n===root;
  var g=el("g",{"data-id":n.id,transform:"translate("+p.x+","+p.y+")",style:"cursor:pointer"},N);
  var on=(sel===n&&!present&&!viewOnly)||(present&&steps[stepIdx]===n);
  el("rect",{width:p.w,height:NH,rx:10,fill:isRoot?col:"#fff",stroke:col,"stroke-width":on?4:2},g);
  var tx=14;
  if(n.icon){var ig=el("g",{transform:"translate(10,8) scale(.9)",fill:"none",stroke:isRoot?"#fff":col,"stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},g);
   el("path",{d:ICONS[n.icon]},ig);tx=36}
  var t=el("text",{x:tx,y:NH/2+5,"font-size":14,"font-weight":600,"font-family":"Montserrat,Segoe UI,sans-serif",fill:isRoot?"#fff":"#1d2a36"},g);t.textContent=n.text;
  if(n.note&&!present){el("circle",{cx:p.w-8,cy:7,r:3.5,fill:"#E8A33D"},g)}
  if(n.children.length&&!present){
   var fb=el("g",{"data-fold":n.id,transform:"translate("+(p.w+2)+","+(NH/2)+")",style:"cursor:pointer"},g);
   el("circle",{r:10,fill:"#fff",stroke:col,"stroke-width":2},fb);
   var s=n.collapsed?"M-4 0H4M0 -4V4":"M-4 0H4";el("path",{d:s,stroke:col,"stroke-width":2,"stroke-linecap":"round"},fb);
  }
  kids(n).forEach(walk)})(root);
 applyCam();
}
function applyCam(){document.getElementById("cam").style.transform="translate("+cam.x+"px,"+cam.y+"px) scale("+cam.k+")"}
function bounds(){var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(var id in pos){var p=pos[id];x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x+p.w+14);y1=Math.max(y1,p.y+NH)}return {x0:x0,y0:y0,x1:x1,y1:y1}}
function fit(anim){
 var st=document.getElementById("stage"),W=st.clientWidth,H=st.clientHeight-(present?90:0),b=bounds();
 var k=Math.min(2,Math.min((W-60)/(b.x1-b.x0),(H-60)/(b.y1-b.y0)));if(!(k>0))k=1;
 setCam(W/2-k*(b.x0+b.x1)/2,H/2-k*(b.y0+b.y1)/2,k,anim)}
function setCam(x,y,k,anim){var c=document.getElementById("cam");cam={x:x,y:y,k:k};
 c.style.transition=anim?"transform .55s ease":"none";
 applyCam()}

/* ---------- editing ---------- */
function snap(){undo.push(JSON.stringify(root));if(undo.length>60)undo.shift();updUndo()}
function updUndo(){document.getElementById("bUndo").disabled=!undo.length}
function save(){if(viewOnly)return;try{localStorage.setItem(KEY,JSON.stringify(root))}catch(e){}}
function select(n){sel=n;syncPanel();draw()}
function syncPanel(){
 var t=document.getElementById("fText"),nt=document.getElementById("fNote");
 t.value=sel?sel.text:"";nt.value=sel?sel.note:"";t.disabled=nt.disabled=!sel||viewOnly;
 [].forEach.call(document.querySelectorAll("#colors .sw"),function(b){b.classList.toggle("on",!!sel&&b.dataset.c===(sel.color||""))});
 [].forEach.call(document.querySelectorAll("#icons .ic"),function(b){b.classList.toggle("on",!!sel&&b.dataset.i===(sel.icon||""))})}
function addChild(){if(viewOnly||!sel)return;snap();var n=mk("New box");sel.collapsed=false;sel.children.push(n);sel=n;syncPanel();draw();save();focusText()}
function addSibling(){if(viewOnly||!sel)return;var p=parentOf(sel);if(!p){addChild();return}snap();var n=mk("New box");p.children.splice(p.children.indexOf(sel)+1,0,n);sel=n;syncPanel();draw();save();focusText()}
function del(){if(viewOnly||!sel)return;var p=parentOf(sel);if(!p)return;snap();p.children.splice(p.children.indexOf(sel),1);sel=p;syncPanel();draw();save()}
function focusText(){var t=document.getElementById("fText");t.focus();t.select()}
function toggleFold(n){if(!n||!n.children.length)return;n.collapsed=!n.collapsed;draw();save()}
function doUndo(){if(!undo.length)return;var id=sel&&sel.id;root=JSON.parse(undo.pop());sel=find(id)||root;updUndo();syncPanel();draw();save()}
function setMap(r,keepFit){root=r;fixSeq(r);sel=r;undo=[];updUndo();syncPanel();draw();fit()}

/* ---------- share / export ---------- */
function b64(u8){var s="";for(var i=0;i<u8.length;i++)s+=String.fromCharCode(u8[i]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function unb64(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function pack(obj){var raw=new TextEncoder().encode(JSON.stringify(obj));
 if(window.CompressionStream){var cs=new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw"));var z=new Uint8Array(await new Response(cs).arrayBuffer());return "z."+b64(z)}
 return "j."+b64(raw)}
async function unpack(s){var f=s.slice(0,2),u=unb64(s.slice(2));
 if(f==="z."){var ds=new Blob([u]).stream().pipeThrough(new DecompressionStream("deflate-raw"));u=new Uint8Array(await new Response(ds).arrayBuffer())}
 return JSON.parse(new TextDecoder().decode(u))}
async function share(){
 var link=location.href.split("#")[0]+"#v="+await pack(root);
 try{await navigator.clipboard.writeText(link);toast("Link copied. Learners see a read-only map.")}
 catch(e){window.prompt("Copy this link:",link)}}
function toast(m){var b=document.getElementById("bantxt");var bn=document.getElementById("banner");var old=bn.style.display;bn.style.display="block";var prev=b.textContent;b.textContent=m;document.getElementById("copyMine").style.display="none";setTimeout(function(){b.textContent=prev;bn.style.display=old;document.getElementById("copyMine").style.display=""},3000)}
function download(name,blob){var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function outline(){var out=[];(function w(n,d){out.push("  ".repeat(d)+"- "+n.text+(n.note?" : "+n.note.replace(/\s+/g," "):""));n.children.forEach(function(c){w(c,d+1)})})(root,0);return out.join("\n")+"\n"}
function cleanSvg(){ // standalone copy of the map, all text and colours inline
 var wasP=present;layout();var b=bounds(),pad=24,W=b.x1-b.x0+pad*2,H=b.y1-b.y0+pad*2;
 var s=document.createElementNS(SVGNS,"svg");s.setAttribute("xmlns",SVGNS);s.setAttribute("width",W);s.setAttribute("height",H);s.setAttribute("viewBox","0 0 "+W+" "+H);
 el("rect",{width:W,height:H,fill:"#ffffff"},s);
 var g=el("g",{transform:"translate("+(pad-b.x0)+","+(pad-b.y0)+")"},s);
 g.appendChild(document.getElementById("edges").cloneNode(true));g.appendChild(document.getElementById("nodes").cloneNode(true));
 [].forEach.call(g.querySelectorAll("[data-fold]"),function(x){x.remove()});
 return {svg:s,W:W,H:H}}
function exportAs(kind){
 if(!kind)return;var base="session-map";
 if(kind==="json")download(base+".json",new Blob([JSON.stringify(root,null,1)],{type:"application/json"}));
 else if(kind==="md")download(base+".txt",new Blob([outline()],{type:"text/plain"}));
 else{var c=cleanSvg(),xml=new XMLSerializer().serializeToString(c.svg);
  if(kind==="svg")download(base+".svg",new Blob([xml],{type:"image/svg+xml"}));
  else{var img=new Image(),sc=2;img.onload=function(){var cv=document.createElement("canvas");cv.width=c.W*sc;cv.height=c.H*sc;var x=cv.getContext("2d");x.scale(sc,sc);x.drawImage(img,0,0);cv.toBlob(function(b){download(base+".png",b)},"image/png")};
   img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(xml)}}
 document.getElementById("bExport").value=""}

/* ---------- present ---------- */
function order(){var a=[];(function w(n){a.push(n);n.children.forEach(w)})(root);return a}
function enterPresent(){
 present=true;showAll=false;steps=order();stepIdx=0;revealed={};revealed[root.id]=true;
 document.body.classList.add("present");go(0)}
function go(i){
 stepIdx=Math.max(0,Math.min(steps.length-1,i));
 revealed={};for(var j=0;j<=stepIdx;j++)revealed[steps[j].id]=true;
 showAll=false;draw();focusStep();caption()}
function focusStep(){
 var n=steps[stepIdx],p=pos[n.id],st=document.getElementById("stage");
 var W=st.clientWidth,H=st.clientHeight-90,k=Math.min(1.6,Math.max(.6,W/900));
 // keep the path visible: if the whole revealed tree fits at a readable size, fit it
 var b=bounds(),kf=Math.min((W-80)/(b.x1-b.x0),(H-60)/(b.y1-b.y0));
 if(kf>=k*1.0){fit(true);return}
 setCam(W/2-k*(p.x+p.w/2),H/2-k*(p.y+NH/2),k,true)}
function caption(){var n=steps[stepIdx];document.getElementById("capT").textContent=n.text;document.getElementById("capN").textContent=n.note||"";
 document.getElementById("pCount").textContent=showAll?"All shown":(stepIdx+1)+" of "+steps.length;
 document.getElementById("pPrev").disabled=stepIdx===0;document.getElementById("pNext").disabled=stepIdx>=steps.length-1&&!showAll}
function exitPresent(){present=false;document.body.classList.remove("present");if(document.fullscreenElement)document.exitFullscreen();draw();fit()}
function showEverything(){showAll=true;draw();fit(true);caption()}
function toggleFull(){var s=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else if(s.requestFullscreen)s.requestFullscreen()}

/* ---------- events ---------- */
var svg=document.getElementById("svg"),drag=null,moved=false;
svg.addEventListener("pointerdown",function(e){drag={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y};moved=false;svg.setPointerCapture(e.pointerId)});
svg.addEventListener("pointermove",function(e){if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){moved=true;svg.classList.add("drag")}if(moved)setCam(drag.cx+dx,drag.cy+dy,cam.k)});
svg.addEventListener("pointerup",function(e){svg.classList.remove("drag");
 var was=moved;drag=null;if(was)return;
 var t=e.target.closest("[data-fold]");if(t){toggleFold(find(t.getAttribute("data-fold")));return}
 var g=e.target.closest("[data-id]");if(g&&!present){var n=find(g.getAttribute("data-id"));if(n){select(n)}}});
svg.addEventListener("dblclick",function(e){if(viewOnly||present)return;var g=e.target.closest("[data-id]");if(g){select(find(g.getAttribute("data-id")));focusText()}});
svg.addEventListener("wheel",function(e){e.preventDefault();var r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,f=e.deltaY<0?1.1:1/1.1,k=Math.max(.2,Math.min(4,cam.k*f));
 setCam(mx-(mx-cam.x)*k/cam.k,my-(my-cam.y)*k/cam.k,k)},{passive:false});
var pinch=null;
svg.addEventListener("touchmove",function(e){if(e.touches.length!==2)return;var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
 if(pinch){var k=Math.max(.2,Math.min(4,cam.k*d/pinch));cam.k=k;applyCam()}pinch=d;e.preventDefault()},{passive:false});
svg.addEventListener("touchend",function(){pinch=null});

document.getElementById("fText").addEventListener("input",function(e){if(!sel)return;if(!sel._s){snap();sel._s=1;setTimeout(function(){if(sel)sel._s=0},800)}sel.text=e.target.value||"Box";draw();save()});
document.getElementById("fNote").addEventListener("input",function(e){if(!sel)return;if(!sel._s){snap();sel._s=1;setTimeout(function(){if(sel)sel._s=0},800)}sel.note=e.target.value;draw();save()});
(function(){var c=document.getElementById("colors");
 [""].concat(COLORS).forEach(function(col){var b=document.createElement("button");b.className="sw";b.dataset.c=col;b.title=col?"Colour":"Same as parent";b.style.background=col||"repeating-linear-gradient(45deg,#ddd,#ddd 4px,#fff 4px,#fff 8px)";
  b.onclick=function(){if(!sel)return;snap();sel.color=col;syncPanel();draw();save()};c.appendChild(b)});
 var ic=document.getElementById("icons");
 [""].concat(Object.keys(ICONS)).forEach(function(k){var b=document.createElement("button");b.className="ic";b.dataset.i=k;b.title=k||"No icon";
  if(k)b.appendChild(iconSvg(k));else b.textContent="-";
  b.onclick=function(){if(!sel)return;snap();sel.icon=k;syncPanel();draw();save()};ic.appendChild(b)})})();

document.getElementById("bAdd").onclick=addChild;
document.getElementById("bSib").onclick=addSibling;
document.getElementById("bDel").onclick=del;
document.getElementById("bUndo").onclick=doUndo;
document.getElementById("bFold").onclick=function(){toggleFold(sel)};
document.getElementById("bFit").onclick=function(){fit(true)};
document.getElementById("bPresent").onclick=enterPresent;
document.getElementById("bShare").onclick=share;
document.getElementById("bExport").onchange=function(e){exportAs(e.target.value)};
document.getElementById("bOpen").onclick=function(){document.getElementById("file").click()};
document.getElementById("file").onchange=function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{setMap(clean(JSON.parse(r.result),0));save()}catch(x){alert("This file is not a map file.")}};r.readAsText(f);e.target.value=""};
document.getElementById("bNew").onclick=function(){if(confirm("Start a new map? Your current map stays in Undo.")){snap();var u=undo.slice();setMap(starterMap());undo=u;updUndo();save()}};
document.getElementById("pNext").onclick=function(){if(stepIdx<steps.length-1)go(stepIdx+1)};
document.getElementById("pPrev").onclick=function(){go(stepIdx-1)};
document.getElementById("pAll").onclick=showEverything;
document.getElementById("pFull").onclick=toggleFull;
document.getElementById("pExit").onclick=exitPresent;
document.getElementById("copyMine").onclick=function(){viewOnly=false;document.body.classList.remove("view");history.replaceState(null,"",location.pathname+location.search);setMap(clean(JSON.parse(JSON.stringify(root)),0));save()};

document.addEventListener("keydown",function(e){
 var inField=/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"");
 if(present){
  if(e.key==="ArrowRight"||e.key===" "||e.key==="PageDown"){e.preventDefault();if(stepIdx<steps.length-1)go(stepIdx+1)}
  else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();go(stepIdx-1)}
  else if(e.key==="Escape"){exitPresent()}
  else if(e.key==="f"||e.key==="F"){toggleFull()}
  else if(e.key==="a"||e.key==="A"){showEverything()}
  return}
 if(inField){if(e.key==="Enter"&&e.target.id==="fText"){e.preventDefault();addSibling()}return}
 if(e.ctrlKey&&e.key.toLowerCase()==="z"){e.preventDefault();doUndo();return}
 if(!sel)return;
 var p=parentOf(sel),i=p?p.children.indexOf(sel):0;
 if(e.key==="Tab"){e.preventDefault();addChild()}
 else if(e.key==="Enter"){e.preventDefault();addSibling()}
 else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();del()}
 else if(e.key==="F2"&&!viewOnly){e.preventDefault();focusText()}
 else if(e.key===" "){e.preventDefault();toggleFold(sel)}
 else if(e.key==="ArrowLeft"&&p){select(p)}
 else if(e.key==="ArrowRight"&&sel.children.length&&!sel.collapsed){select(sel.children[0])}
 else if(e.key==="ArrowUp"&&p&&i>0){select(p.children[i-1])}
 else if(e.key==="ArrowDown"&&p&&i<p.children.length-1){select(p.children[i+1])}
});
window.addEventListener("resize",function(){if(!present)return;focusStep()});
document.addEventListener("fullscreenchange",function(){if(present)setTimeout(focusStep,150)});

/* ---------- start ---------- */
async function start(){
 try{var r=await fetch("config.json",{cache:"no-store"});if(r.ok){var c=await r.json();DEMO=!!c.demo}}catch(e){}
 var h=location.hash;
 if(h.indexOf("#v=")===0){
  try{var m=clean(await unpack(h.slice(3)),0);viewOnly=true;document.body.classList.add("view");setMap(m);return}
  catch(e){alert("This share link is broken or cut short.")}}
 var saved=null;try{saved=JSON.parse(localStorage.getItem(KEY))}catch(e){}
 setMap(saved?clean(saved,0):(DEMO?demoMap():starterMap()));
}
start();
