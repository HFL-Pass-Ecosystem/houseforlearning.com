/* Voice feedback on the Yoga page. A small HFL badge next to each picture and each audio control opens a recorder.
   The note is sent to /api/voicefeedback and waits in a reviewed list. Nothing on any page changes until the team approves.
   No inline script or style (CSP). The microphone is used only after the visitor presses Record. */
(function(){
'use strict';
var API='/api/voicefeedback', MAXS=90, MAXB64=900000;
var NS_MARK='<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="19" fill="#0F85DB"/><path d="M8.5 20.5 20 10l11.5 10.5" fill="none" stroke="#F2EEE2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 19.5V30h16V19.5" fill="none" stroke="#F2EEE2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="15.2" y="22.5" width="2.4" height="4.5" rx="1.2" fill="#3CC261"/><rect x="18.8" y="20.5" width="2.4" height="8.5" rx="1.2" fill="#3CC261"/><rect x="22.4" y="23" width="2.4" height="3.5" rx="1.2" fill="#3CC261"/></svg>';
var AUDIO=[
 {sel:'label[for="mstyle"]',name:'Music style'},
 {sel:'label[for="tMusic"]',name:'Music'},
 {sel:'label[for="tCues"]',name:'Spoken cues'},
 {sel:'label[for="tMantra"]',name:'Chanted mantras'},
 {sel:'label[for="tChants"]',name:'Traditional chants'},
 {sel:'audio, video',name:'Audio'}
];
var dlg=null, ctx={item:'',kind:''}, rec=null, stream=null, chunks=[], blob=null, tick=null, secs=0, started=0;
function $(s,r){return (r||document).querySelector(s);}
function all(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
function badge(item,kind,cls){
  var b=el('button','hfl-vf'+(cls?' '+cls:''));b.type='button';b.setAttribute('data-vf-btn','1');
  b.setAttribute('aria-label','Give voice feedback about '+item+' (HFL)');b.title='Tell us by voice: '+item;
  b.innerHTML=NS_MARK;
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();open(item,kind);});
  return b;
}
function clean(s,n){return String(s||'').replace(/\s+/g,' ').trim().slice(0,n||90);}
function scan(){
  all('img').forEach(function(img){
    if(img.closest('header,footer,dialog,.brand,#hx-ask,[data-vf-btn]'))return;
    var src=img.getAttribute('src')||'';
    if(src.indexOf('yoga/')<0&&img.id!=='stagePhoto'&&img.id!=='mphoto')return;
    var host=img.closest('figure,.stage,.mapstage,.ylux-media')||img.parentElement;
    if(host&&host.classList.contains('ylux-media')&&host.parentElement)host=host.parentElement; /* hero picture sits under overlays: badge goes on the section */
    if(!host||host.getAttribute('data-vf'))return;
    host.setAttribute('data-vf','1');
    if(getComputedStyle(host).position==='static')host.classList.add('hfl-vf-host');
    var cap=host.querySelector('figcaption');
    var name=clean(img.getAttribute('alt'))||clean(cap&&cap.textContent)||(img.id==='stagePhoto'?'Practice picture':'Yoga picture');
    host.appendChild(badge('Picture: '+name,'picture','on-pic'));
  });
  AUDIO.forEach(function(a){
    all(a.sel).forEach(function(n){
      if(n.getAttribute('data-vf')||n.closest('dialog'))return;
      n.setAttribute('data-vf','1');
      n.insertAdjacentElement('afterend',badge('Audio: '+a.name,'audio',''));
    });
  });
}
function ensure(){
  if(dlg)return;
  dlg=el('dialog','hfl-vf-dlg');dlg.setAttribute('aria-labelledby','hfl-vf-h');
  var inn=el('div','hfl-vf-in');
  var head=el('div','hfl-vf-head');var lg=el('span','hfl-vf-logo');lg.innerHTML=NS_MARK;head.appendChild(lg);
  var h=el('h2',null,'Tell us in your voice');h.id='hfl-vf-h';head.appendChild(h);inn.appendChild(head);
  inn.appendChild(el('p','hfl-vf-about'));
  inn.appendChild(el('p','hfl-vf-note','Press Record and say what you like or what we could improve. Up to 90 seconds. Our team listens to every note. Nothing on this page changes until it has been reviewed and approved. Please do not say your phone number or address.'));
  var st=el('p','hfl-vf-status');st.setAttribute('role','status');st.setAttribute('aria-live','polite');inn.appendChild(st);
  var pl=el('audio','hfl-vf-play');pl.controls=true;pl.hidden=true;inn.appendChild(pl);
  var row=el('div','hfl-vf-row');
  function B(c,t,id){var b=el('button','hfl-vf-b '+c,t);b.type='button';b.setAttribute('data-a',id);row.appendChild(b);return b;}
  B('go','Record','rec');B('stop','Stop','stop').hidden=true;B('main','Send','send').hidden=true;B('','Record again','again').hidden=true;B('','Close','close');
  inn.appendChild(row);dlg.appendChild(inn);document.body.appendChild(dlg);
  row.addEventListener('click',function(e){var a=e.target.getAttribute&&e.target.getAttribute('data-a');if(!a)return;
    if(a==='rec'||a==='again')start();else if(a==='stop')stop();else if(a==='send')send();else if(a==='close')dlg.close();});
  dlg.addEventListener('close',cleanup);
  dlg.addEventListener('cancel',function(){});
}
function btn(a){return $('[data-a="'+a+'"]',dlg);}
function say(msg,cls){var s=$('.hfl-vf-status',dlg);s.textContent=msg;s.className='hfl-vf-status'+(cls?' '+cls:'');}
function show(map){Object.keys(map).forEach(function(k){btn(k).hidden=!map[k];});}
function open(item,kind){
  ensure();ctx={item:item,kind:kind};cleanupAudio();
  $('.hfl-vf-about',dlg).textContent='About: '+item;
  var pl=$('.hfl-vf-play',dlg);pl.hidden=true;pl.removeAttribute('src');
  btn('send').disabled=false;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||typeof MediaRecorder==='undefined'){
    show({rec:false,stop:false,send:false,again:false,close:true});
    say('Voice recording is not available on this device or browser. Please write to us from the Contact page.','err');
  }else{show({rec:true,stop:false,send:false,again:false,close:true});say('Ready when you are.');}
  if(!dlg.open)dlg.showModal();btn('close').focus();
}
function pick(){var t=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];for(var i=0;i<t.length;i++){if(MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t[i]))return t[i];}return '';}
function start(){
  cleanupAudio();blob=null;chunks=[];var pl=$('.hfl-vf-play',dlg);pl.hidden=true;
  say('Asking for your microphone…');
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){
    stream=s;var m=pick(),o={audioBitsPerSecond:24000};if(m)o.mimeType=m;
    try{rec=new MediaRecorder(s,o);}catch(e){rec=new MediaRecorder(s);}
    rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
    rec.onstop=done;rec.start(1000);started=Date.now();secs=0;dlg.classList.add('hfl-vf-rec');
    show({rec:false,stop:true,send:false,again:false,close:true});time();
    tick=setInterval(function(){secs=Math.round((Date.now()-started)/1000);time();if(secs>=MAXS)stop();},250);
  }).catch(function(){
    show({rec:true,stop:false,send:false,again:false,close:true});
    say('We could not use the microphone. Please allow it in your browser, or write to us from the Contact page.','err');
  });
}
function time(){var s=$('.hfl-vf-status',dlg);s.className='hfl-vf-status';s.innerHTML='';var t=el('span','hfl-vf-time','Recording '+Math.floor(secs/60)+':'+('0'+secs%60).slice(-2)+' / 1:30');s.appendChild(t);}
function stop(){if(tick){clearInterval(tick);tick=null;}if(rec&&rec.state!=='inactive')rec.stop();}
function done(){
  dlg.classList.remove('hfl-vf-rec');if(stream){stream.getTracks().forEach(function(t){t.stop();});stream=null;}
  var type=(rec&&rec.mimeType)||'audio/webm';blob=new Blob(chunks,{type:type});
  if(!blob.size){show({rec:true,stop:false,send:false,again:false,close:true});say('Nothing was recorded. Please try again.','err');return;}
  var pl=$('.hfl-vf-play',dlg);pl.src=URL.createObjectURL(blob);pl.hidden=false;
  show({rec:false,stop:false,send:true,again:true,close:true});say('Listen if you like, then press Send.');
}
function send(){
  if(!blob)return;btn('send').disabled=true;say('Sending…');
  var fr=new FileReader();
  fr.onload=function(){
    var d=String(fr.result),b64=d.slice(d.indexOf(',')+1);
    if(b64.length>MAXB64){say('That note is too long. Please record a shorter one.','err');btn('send').disabled=false;return;}
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({item:ctx.item,kind:ctx.kind,page:location.pathname,site:'houseforlearning.com',mime:blob.type,seconds:secs,audio:b64,website:''})})
    .then(function(r){return r.json().catch(function(){return {};}).then(function(j){return {s:r.status,j:j};});})
    .then(function(x){
      if(x.s===200){show({rec:false,stop:false,send:false,again:false,close:true});say('Thank you. Your note is saved (ref '+(x.j.ref||'')+'). We will listen and tell you if we change anything.','good');}
      else if(x.s===503){btn('send').disabled=false;say('Our feedback inbox is not switched on yet, so your note was not sent. It is still here: please try Send again later.','err');}
      else{btn('send').disabled=false;say((x.j&&x.j.error)||'Not sent. Please try again.','err');}
    }).catch(function(){btn('send').disabled=false;say('No connection. Please try Send again.','err');});
  };
  fr.readAsDataURL(blob);
}
function cleanupAudio(){
  if(tick){clearInterval(tick);tick=null;}
  if(rec&&rec.state!=='inactive'){rec.onstop=null;try{rec.stop();}catch(e){}}
  if(stream){stream.getTracks().forEach(function(t){t.stop();});stream=null;}
  if(dlg){dlg.classList.remove('hfl-vf-rec');var pl=$('.hfl-vf-play',dlg);if(pl&&pl.src){try{URL.revokeObjectURL(pl.src);}catch(e){}}}
}
function cleanup(){cleanupAudio();blob=null;chunks=[];}
var timer=null;
function later(){if(timer)return;timer=setTimeout(function(){timer=null;scan();},600);}
function init(){scan();try{new MutationObserver(later).observe(document.body,{childList:true,subtree:true});}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
