(function(){
"use strict";
var SW=window.SW,$=function(i){return document.getElementById(i)};
var fmt="headlines",src="shared",pat="",answers={},last=[],member="Guest",order=0;

var mem={};
function sget(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return mem[k]!==undefined?mem[k]:d}}
function sset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){mem[k]=v}}
function slug(s){return (s||"guest").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"guest"}
function key(n){return "dd."+slug(member)+"."+n}
function getMine(){return sget(key("patterns"),[])}
function getDR(){return sget(key("drafts"),[])}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function opt(sel,v,t){var o=el("option",null,t);o.value=v;sel.appendChild(o)}
function tokens(lines){var s={},o=[];lines.forEach(function(l){(l.match(/\{\{(\w+)\}\}/g)||[]).forEach(function(t){var k=t.slice(2,-2);if(!s[k]){s[k]=1;o.push(k)}})});return o}
function msg(id,t){$(id).textContent=t;setTimeout(function(){$(id).textContent=""},3000)}

Object.keys(SW.sectors).forEach(function(k){opt($("sector"),k,SW.sectors[k])});
Object.keys(SW.types).forEach(function(k){opt($("tbType"),k,SW.types[k].name)});

/* patterns available for the chosen format and source */
function patterns(){
  if(src==="shared"){var m=(SW.types[fmt]||{models:{}}).models;return Object.keys(m).map(function(k){return {id:k,name:m[k].name,note:m[k].note,lines:m[k].lines,fields:m[k].fields}})}
  return getMine().filter(function(p){return p.type===fmt}).map(function(p){return {id:p.id,name:p.name,note:"Your own pattern.",lines:p.lines,fields:tokens(p.lines)}});
}
function current(){var l=patterns().filter(function(p){return p.id===pat});return l[0]||null}

function renderFormats(){
  var g=$("formats");clear(g);
  Object.keys(SW.types).forEach(function(k){
    var b=el("button","fmt"+(k===fmt?" on":""),SW.types[k].name);
    b.addEventListener("click",function(){fmt=k;pat="";renderAll()});
    g.appendChild(b);
  });
}
function renderPatterns(){
  var box=$("patterns");clear(box);var list=patterns();
  if(!list.some(function(p){return p.id===pat}))pat=list.length?list[0].id:"";
  $("patNote").textContent=list.length?"":(src==="mine"?"You have no patterns for this format yet. Open Pattern maker to write one.":"");
  list.forEach(function(p){
    var d=el("div","pat"+(p.id===pat?" on":""));
    d.appendChild(el("b",null,p.name));d.appendChild(el("small",null,p.note));
    if(p.id===pat){
      var ul=el("ul");
      p.lines.forEach(function(l){var li=el("li");l.split(/(\{\{\w+\}\})/).forEach(function(x){if(/^\{\{\w+\}\}$/.test(x))li.appendChild(el("span","tok",x.slice(2,-2)));else li.appendChild(document.createTextNode(x))});ul.appendChild(li)});
      d.appendChild(ul);
    }
    d.addEventListener("click",function(){if(pat!==p.id){pat=p.id;renderPatterns();renderQuestions();renderDraft()}});
    box.appendChild(d);
  });
  $("srcShared").classList.toggle("on",src==="shared");$("srcMine").classList.toggle("on",src==="mine");
}
function example(k){var f=SW.fields[k];if(!f)return "your words";return f.ex[$("sector").value]||f.ex.all||"your words"}
function renderQuestions(){
  var box=$("questions");clear(box);var p=current();if(!p)return;
  p.fields.forEach(function(k){
    var f=SW.fields[k]||{q:"Fill in: "+k},d=el("div","q");
    var lab=el("label",null,f.q);lab.setAttribute("for","a_"+k);
    var ta=el("textarea");ta.id="a_"+k;ta.value=answers[k]||"";
    ta.addEventListener("input",function(){answers[k]=ta.value;renderDraft()});
    d.appendChild(lab);d.appendChild(ta);d.appendChild(el("small",null,"For instance: "+example(k)));box.appendChild(d);
  });
}
function generate(){
  var p=current();if(!p)return [];var out=[];
  p.lines.forEach(function(l){
    var ok=true;
    var s=l.replace(/\{\{(\w+)\}\}/g,function(_,k){var v=(answers[k]||"").trim();if(!v)ok=false;return v});
    if(ok)out.push(s.replace(/ +\n/g,"\n").replace(/\s+$/,"").replace(/\.\./g,"."));
  });
  if(order&&(fmt==="headlines"||fmt==="cta")){out=out.slice();for(var i=out.length-1;i>0;i--){var j=(i*7+order)%(i+1);var t=out[i];out[i]=out[j];out[j]=t}}
  return out;
}
function renderDraft(){
  var ol=$("results");clear(ol);last=generate();var p=current();
  $("blueprint").textContent=p?SW.types[fmt].name+" - "+p.name:"";
  if(!last.length){ol.appendChild(el("li",null,"Your draft appears here. Answer at least two questions."));return}
  last.forEach(function(t){ol.appendChild(el("li",null,t))});
}
function renderAll(){renderFormats();renderPatterns();renderQuestions();renderDraft()}

$("srcShared").addEventListener("click",function(){src="shared";pat="";renderAll()});
$("srcMine").addEventListener("click",function(){src="mine";pat="";renderAll()});
$("sector").addEventListener("change",renderQuestions);
$("shuffleBtn").addEventListener("click",function(){order++;renderDraft()});
$("copyBtn").addEventListener("click",function(){
  var t=last.join("\n\n");
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){msg("saveMsg","Copied")},function(){msg("saveMsg","Select and copy by hand")});
});
$("saveBtn").addEventListener("click",function(){
  if(!last.length){msg("saveMsg","Nothing to save yet");return}
  var p=current(),d=getDR();
  d.unshift({id:"d"+Date.now(),name:$("title").value.trim()||"Untitled",sector:$("sector").value,type:fmt,model:p.name,text:last.join("\n\n"),status:"Draft",created:new Date().toISOString().slice(0,16).replace("T"," ")});
  sset(key("drafts"),d);renderSaved();msg("saveMsg","Saved as draft");
});

function renderSaved(){
  var d=getDR(),box=$("draftList");clear(box);$("draftCount").textContent=d.length;
  if(!d.length)box.appendChild(el("p","note","No drafts yet."));
  d.forEach(function(x){
    var c=el("div","card");
    c.appendChild(el("h4",null,x.name+" ("+SW.types[x.type].name+")"));
    c.appendChild(el("div","st",x.status+" - "+x.created+" - "+SW.sectors[x.sector]));
    c.appendChild(el("div",null,x.text));
    var row=el("div","row");
    var a=el("button","btn green","Ask owner to review");
    a.addEventListener("click",function(){x.status="Waiting for owner review (nothing sent out)";sset(key("drafts"),d);renderSaved()});
    var del=el("button","btn ghost","Archive");
    del.addEventListener("click",function(){sset(key("drafts"),getDR().filter(function(y){return y.id!==x.id}));renderSaved()});
    row.appendChild(a);row.appendChild(del);c.appendChild(row);box.appendChild(c);
  });
}
function download(name,obj){
  var b=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");
  a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(u)},500);
}
$("exportDrafts").addEventListener("click",function(){download("drafts-"+slug(member)+".json",{ecosystem:"AjanSNS",member:member,drafts:getDR()})});

/* pattern maker */
function renderBlanks(){var c=$("tbBlanks");clear(c);tokens($("tbLines").value.split("\n")).forEach(function(k){c.appendChild(el("span",null,k))})}
$("tbLines").addEventListener("input",renderBlanks);
function renderMine(){
  var box=$("tbList");clear(box);var l=getMine();
  if(!l.length)box.appendChild(el("p","note","None yet."));
  l.forEach(function(t){
    var c=el("div","card");c.appendChild(el("h4",null,t.name+" ("+SW.types[t.type].name+")"));c.appendChild(el("div",null,t.lines.join("\n")));
    var row=el("div","row");var del=el("button","btn ghost","Archive");
    del.addEventListener("click",function(){sset(key("patterns"),getMine().filter(function(y){return y.id!==t.id}));renderMine();renderAll()});
    row.appendChild(del);c.appendChild(row);box.appendChild(c);
  });
}
$("tbSave").addEventListener("click",function(){
  var name=$("tbName").value.trim(),lines=$("tbLines").value.split("\n").map(function(s){return s.trim()}).filter(Boolean);
  if(!name||!lines.length){msg("tbMsg","Add a name and at least one line");return}
  var l=getMine();l.push({id:"t"+Date.now(),name:name,type:$("tbType").value,lines:lines});sset(key("patterns"),l);
  $("tbName").value="";$("tbLines").value="";renderBlanks();renderMine();renderAll();msg("tbMsg","Pattern kept");
});
$("tbExport").addEventListener("click",function(){download("patterns-"+slug(member)+".json",{ecosystem:"AjanSNS",member:member,templates:getMine()})});
$("tbImport").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){try{var j=JSON.parse(r.result),l=getMine();
    (j.templates||[]).forEach(function(t){if(t&&t.name&&Array.isArray(t.lines)&&SW.types[t.type])l.push({id:"t"+Date.now()+Math.floor(Math.random()*1e4),name:String(t.name),type:t.type,lines:t.lines.map(String)})});
    sset(key("patterns"),l);renderMine();renderAll();msg("tbMsg","Loaded")}catch(x){msg("tbMsg","That file could not be read")}};
  r.readAsText(f);
});

function setMember(m){member=m||"Guest";$("who").textContent=member;renderSaved();renderMine();renderAll()}
$("memberSave").addEventListener("click",function(){var v=$("memberId").value.trim();sset("dd.member",v);setMember(v);msg("memberMsg","Saved")});
document.querySelectorAll(".tab").forEach(function(b){b.addEventListener("click",function(){
  document.querySelectorAll(".tab").forEach(function(x){x.classList.toggle("on",x===b)});
  ["desk","saved","maker","profile"].forEach(function(v){$("view-"+v).hidden=v!==b.getAttribute("data-view")});
})});
var saved=sget("dd.member","");$("memberId").value=saved;setMember(saved);
})();
