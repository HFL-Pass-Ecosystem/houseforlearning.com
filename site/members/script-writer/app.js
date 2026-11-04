(function(){
"use strict";
var SW=window.SW,$=function(i){return document.getElementById(i)};
var step=1,last=[],member="guest",answers={};

/* storage, safe if blocked */
var mem={};
function sget(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return mem[k]!==undefined?mem[k]:d}}
function sset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){mem[k]=v}}
function slug(s){return (s||"guest").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"guest"}
function key(n){return "sw."+slug(member)+"."+n}
function getPT(){return sget(key("templates"),[])}
function getDR(){return sget(key("drafts"),[])}

function opt(sel,val,txt){var o=document.createElement("option");o.value=val;o.textContent=txt;sel.appendChild(o)}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild)}
function tokens(lines){var s={},out=[];lines.forEach(function(l){(l.match(/\{\{(\w+)\}\}/g)||[]).forEach(function(t){var k=t.slice(2,-2);if(!s[k]){s[k]=1;out.push(k)}})});return out}

/* ---------- init lists ---------- */
Object.keys(SW.sectors).forEach(function(k){opt($("sector"),k,SW.sectors[k])});
Object.keys(SW.types).forEach(function(k){opt($("tbType"),k,SW.types[k].name)});

function currentModel(){
  var src=$("source").value,t=$("stype").value,m=$("smodel").value;
  if(src==="common"){var mm=(SW.types[t]||{models:{}}).models[m];return mm?{name:mm.name,note:mm.note,lines:mm.lines,fields:mm.fields,type:t}:null}
  var p=getPT().filter(function(x){return x.id===m})[0];
  return p?{name:p.name,note:"Your own template.",lines:p.lines,fields:tokens(p.lines),type:p.type}:null;
}
function fillTypes(){
  var st=$("stype");clear(st);var src=$("source").value;
  if(src==="common"){Object.keys(SW.types).forEach(function(k){opt(st,k,SW.types[k].name)})}
  else{var seen={};getPT().forEach(function(p){if(!seen[p.type]){seen[p.type]=1;opt(st,p.type,SW.types[p.type].name)}})}
  fillModels();
}
function fillModels(){
  var sm=$("smodel");clear(sm);var src=$("source").value,t=$("stype").value;
  if(src==="common"&&SW.types[t]){Object.keys(SW.types[t].models).forEach(function(k){opt(sm,k,SW.types[t].models[k].name)})}
  else{getPT().filter(function(p){return p.type===t}).forEach(function(p){opt(sm,p.id,p.name)})}
  renderPreview();
}
function renderPreview(){
  var m=currentModel(),ul=$("preview");clear(ul);
  if(!m){$("modelNote").textContent=$("source").value==="personal"?"You have no personal templates yet. Open Template Builder to make one.":"";return}
  $("modelNote").textContent=m.note;
  m.lines.forEach(function(l){
    var li=document.createElement("li");
    l.split(/(\{\{\w+\}\})/).forEach(function(part){
      if(/^\{\{\w+\}\}$/.test(part)){var s=document.createElement("span");s.className="tok";s.textContent=part.slice(2,-2);li.appendChild(s)}
      else li.appendChild(document.createTextNode(part));
    });
    ul.appendChild(li);
  });
}

/* ---------- questions ---------- */
function exampleFor(k){
  var f=SW.fields[k];if(!f)return "Your words";
  return f.ex[$("sector").value]||f.ex.all||"Your words";
}
function renderQuestions(){
  var m=currentModel(),box=$("questions");clear(box);if(!m)return;
  m.fields.forEach(function(k){
    var f=SW.fields[k]||{q:"Fill in: "+k},d=document.createElement("div");d.className="q";
    var lab=document.createElement("label");lab.setAttribute("for","a_"+k);lab.textContent=f.q;
    var ta=document.createElement("textarea");ta.id="a_"+k;ta.value=answers[k]||"";
    ta.addEventListener("input",function(){answers[k]=ta.value});
    var sm=document.createElement("small");sm.textContent="Example: "+exampleFor(k);
    d.appendChild(lab);d.appendChild(ta);d.appendChild(sm);box.appendChild(d);
  });
}

/* ---------- generate ---------- */
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function generate(reshuffle){
  var m=currentModel();if(!m)return [];
  var out=[];
  m.lines.forEach(function(l){
    var ok=true;
    var s=l.replace(/\{\{(\w+)\}\}/g,function(_,k){var v=(answers[k]||"").trim();if(!v)ok=false;return v});
    if(ok){s=s.replace(/ +\n/g,"\n").replace(/\s+$/,"").replace(/\.\./g,".");out.push(s)}
  });
  if(reshuffle&&(m.type==="headlines"||m.type==="cta"))out=shuffle(out);
  return out;
}
function showResults(reshuffle){
  var ol=$("results");clear(ol);last=generate(reshuffle);
  if(!last.length){var li=document.createElement("li");li.textContent="Nothing yet. Go Back and answer at least two questions.";ol.appendChild(li);return}
  last.forEach(function(t){var li=document.createElement("li");li.textContent=t;ol.appendChild(li)});
  $("againBtn").hidden=!(currentModel().type==="headlines"||currentModel().type==="cta");
}

/* ---------- steps ---------- */
function setStep(n){
  step=n;
  document.querySelectorAll(".step").forEach(function(s){s.hidden=Number(s.getAttribute("data-step"))!==step});
  var st=$("steps");clear(st);
  for(var i=1;i<=4;i++){var sp=document.createElement("span");sp.textContent="STEP "+i;if(i===step)sp.className="on";st.appendChild(sp)}
  $("backBtn").hidden=step===1;$("nextBtn").hidden=step===4;
  if(step===3)renderQuestions();
  if(step===4)showResults(false);
  window.scrollTo(0,0);
}
$("nextBtn").addEventListener("click",function(){
  if(step===1&&!$("scriptName").value.trim()){$("scriptName").focus();return}
  if(step===2&&!currentModel())return;
  setStep(step+1);
});
$("backBtn").addEventListener("click",function(){setStep(step-1)});
$("source").addEventListener("change",fillTypes);
$("stype").addEventListener("change",fillModels);
$("smodel").addEventListener("change",function(){answers={};renderPreview()});
$("makeBtn").addEventListener("click",function(){showResults(false)});
$("againBtn").addEventListener("click",function(){showResults(true)});
$("copyBtn").addEventListener("click",function(){
  var txt=last.join("\n\n");
  if(navigator.clipboard)navigator.clipboard.writeText(txt).then(function(){msg("saveMsg","Copied")},function(){msg("saveMsg","Select and copy by hand")});
});
function msg(id,t){$(id).textContent=t;setTimeout(function(){$(id).textContent=""},3000)}

$("saveBtn").addEventListener("click",function(){
  if(!last.length){msg("saveMsg","Nothing to save yet");return}
  var m=currentModel(),d=getDR();
  d.unshift({id:"d"+Date.now(),name:$("scriptName").value.trim(),sector:$("sector").value,type:m.type,model:m.name,text:last.join("\n\n"),status:"Draft",created:new Date().toISOString().slice(0,16).replace("T"," ")});
  sset(key("drafts"),d);renderDrafts();msg("saveMsg","Saved as draft");
});

/* ---------- drafts ---------- */
function renderDrafts(){
  var d=getDR(),box=$("draftList");clear(box);$("draftCount").textContent=d.length;
  if(!d.length){var p=document.createElement("p");p.className="note";p.textContent="No drafts yet.";box.appendChild(p)}
  d.forEach(function(x){
    var c=document.createElement("div");c.className="card";
    var h=document.createElement("h4");h.textContent=x.name+" ("+SW.types[x.type].name+")";
    var st=document.createElement("div");st.className="st";st.textContent=x.status+" - "+x.created+" - "+SW.sectors[x.sector];
    var pre=document.createElement("div");pre.textContent=x.text;
    var row=document.createElement("div");row.className="row";
    var a=document.createElement("button");a.className="btn green";a.textContent="Send to owner approval";
    a.addEventListener("click",function(){x.status="Waiting for owner approval (nothing sent out)";sset(key("drafts"),d);renderDrafts()});
    var del=document.createElement("button");del.className="btn ghost";del.textContent="Archive";
    del.addEventListener("click",function(){var all=getDR().filter(function(y){return y.id!==x.id});sset(key("drafts"),all);renderDrafts()});
    row.appendChild(a);row.appendChild(del);
    [h,st,pre,row].forEach(function(n){c.appendChild(n)});box.appendChild(c);
  });
}
function download(name,obj){
  var b=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");
  a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(u)},500);
}
$("exportDrafts").addEventListener("click",function(){download("drafts-"+slug(member)+".json",{ecosystem:"AjanSNS",member:member,drafts:getDR()})});

/* ---------- template builder ---------- */
function renderBlanks(){
  var c=$("tbBlanks");clear(c);
  tokens($("tbLines").value.split("\n")).forEach(function(k){var s=document.createElement("span");s.textContent=k;c.appendChild(s)});
}
$("tbLines").addEventListener("input",renderBlanks);
function renderPT(){
  var box=$("tbList");clear(box);var list=getPT();
  if(!list.length){var p=document.createElement("p");p.className="note";p.textContent="None yet.";box.appendChild(p)}
  list.forEach(function(t){
    var c=document.createElement("div");c.className="card";
    var h=document.createElement("h4");h.textContent=t.name+" ("+SW.types[t.type].name+")";
    var pre=document.createElement("div");pre.textContent=t.lines.join("\n");
    var row=document.createElement("div");row.className="row";
    var del=document.createElement("button");del.className="btn ghost";del.textContent="Archive";
    del.addEventListener("click",function(){sset(key("templates"),getPT().filter(function(y){return y.id!==t.id}));renderPT();fillTypes()});
    row.appendChild(del);[h,pre,row].forEach(function(n){c.appendChild(n)});box.appendChild(c);
  });
}
$("tbSave").addEventListener("click",function(){
  var name=$("tbName").value.trim(),lines=$("tbLines").value.split("\n").map(function(s){return s.trim()}).filter(Boolean);
  if(!name||!lines.length){msg("tbMsg","Add a name and at least one line");return}
  var l=getPT();l.push({id:"t"+Date.now(),name:name,type:$("tbType").value,lines:lines});
  sset(key("templates"),l);$("tbName").value="";$("tbLines").value="";renderBlanks();renderPT();fillTypes();msg("tbMsg","Template saved");
});
$("tbExport").addEventListener("click",function(){download("templates-"+slug(member)+".json",{ecosystem:"AjanSNS",member:member,templates:getPT()})});
$("tbImport").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){try{
    var j=JSON.parse(r.result),l=getPT();
    (j.templates||[]).forEach(function(t){if(t&&t.name&&Array.isArray(t.lines)&&SW.types[t.type]){l.push({id:"t"+Date.now()+Math.floor(Math.random()*1e4),name:String(t.name),type:t.type,lines:t.lines.map(String)})}});
    sset(key("templates"),l);renderPT();fillTypes();msg("tbMsg","Loaded");
  }catch(x){msg("tbMsg","That file could not be read")}};
  r.readAsText(f);
});

/* ---------- member + nav ---------- */
function setMember(m){member=m||"Guest";$("who").textContent="Member: "+member;renderDrafts();renderPT();fillTypes()}
$("memberSave").addEventListener("click",function(){var v=$("memberId").value.trim();sset("sw.member",v);setMember(v);msg("memberMsg","Saved")});
document.querySelectorAll(".nav").forEach(function(b){b.addEventListener("click",function(){
  document.querySelectorAll(".nav").forEach(function(x){x.classList.toggle("on",x===b)});
  ["create","drafts","builder","account"].forEach(function(v){$("view-"+v).hidden=v!==b.getAttribute("data-view")});
  $("nextBtn").parentNode.hidden=b.getAttribute("data-view")!=="create";
  if(b.getAttribute("data-view")==="create"&&step===4){answers={};$("scriptName").value="";setStep(1)}
})});

var saved=sget("sw.member","");$("memberId").value=saved;setMember(saved);setStep(1);
})();
