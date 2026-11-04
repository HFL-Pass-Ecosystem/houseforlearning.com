/* Team list of voice feedback notes. The review code is kept only in this page's memory, never stored. */
(function(){
'use strict';
var API='/api/voicefeedback', code='', notes=[];
function $(i){return document.getElementById(i);}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
function msg(t){$('vfMsg').textContent=t;}
function call(path,opt){opt=opt||{};opt.headers=Object.assign({'x-review-token':code,'Content-Type':'application/json'},opt.headers||{});
  return fetch(path,opt).then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok)throw new Error(j.error||('Error '+r.status));return j;});});}
function draw(){
  var f=$('vfFilter').value,box=$('vfList');box.textContent='';
  var shown=notes.filter(function(n){return !f||n.status===f;});
  msg(shown.length+' note'+(shown.length===1?'':'s')+' shown.');
  shown.forEach(function(n){
    var c=el('div','box');
    c.appendChild(el('p','item',n.item||'(no label)'));
    var m=el('p','meta',n.ref+' · '+new Date(n.created_at).toLocaleString()+' · '+(n.seconds||0)+'s · '+(n.page||''));
    m.appendChild(document.createTextNode(' '));m.appendChild(el('span','tag '+n.status,n.status));c.appendChild(m);
    var row=el('div','row');
    var play=el('button','hfl-vf-b','Listen');play.type='button';
    var au=el('audio');au.controls=true;au.hidden=true;
    play.onclick=function(){
      if(au.src){au.hidden=false;au.play();return;}
      play.disabled=true;
      call(API+'?audio='+encodeURIComponent(n.ref)).then(function(j){
        var bin=atob(j.audio),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
        au.src=URL.createObjectURL(new Blob([u],{type:j.mime}));au.hidden=false;play.disabled=false;au.play();
      }).catch(function(e){play.disabled=false;msg(e.message);});
    };
    row.appendChild(play);row.appendChild(au);c.appendChild(row);
    var r2=el('div','row');
    var sel=el('select');['new','reviewed','approved','declined'].forEach(function(s){var o=el('option',null,s);o.value=s;if(s===n.status)o.selected=true;sel.appendChild(o);});
    sel.setAttribute('aria-label','Status for '+n.ref);
    var note=el('textarea');note.value=n.decision_note||'';note.setAttribute('aria-label','Decision note for '+n.ref);note.placeholder='Decision note (optional)';
    var save=el('button','hfl-vf-b main','Save');save.type='button';
    save.onclick=function(){save.disabled=true;
      call(API,{method:'POST',body:JSON.stringify({action:'status',ref:n.ref,status:sel.value,decision_note:note.value})})
      .then(function(){n.status=sel.value;n.decision_note=note.value;save.disabled=false;draw();msg('Saved '+n.ref+'.');})
      .catch(function(e){save.disabled=false;msg(e.message);});};
    r2.appendChild(sel);r2.appendChild(save);c.appendChild(r2);c.appendChild(note);
    box.appendChild(c);
  });
}
$('vfLoad').onclick=function(){code=$('vfCode').value;msg('Loading…');
  call(API+'?list=1').then(function(j){notes=j.notes||[];draw();}).catch(function(e){msg(e.message==='Review code needed'?'The review code was not accepted.':e.message);});};
$('vfFilter').onchange=draw;
})();
