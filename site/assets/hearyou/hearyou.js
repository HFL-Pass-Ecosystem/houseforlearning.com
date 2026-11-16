/* We Hear You kit v1.1. No dependencies, no inline code, works under a strict CSP.
   Settings come from window.HEARYOU (set in sites/<site>.settings.js, loaded before this file).
   Auto-wires every <form data-hear="contact|chat|signup|verify|portal">. Chat widgets call HearYou.chatSent(bubbleEl). */
(function(){
  'use strict';
  var C = Object.assign({
    reaction: '\u{1F64F}',
    slogan: '', sloganTranslation: '',
    brand: 'our team',
    replyWithin: 'within one working day',
    presence: true, presenceText: 'We’re listening, around the clock',
    sparks: ['✨','❤️','✨','⭐','✨','❤️'],
    copy: {},
    forms: 'form[data-hear]',          /* live sites widen this, e.g. 'form.contact[data-offline], form[data-kind], form[data-hear]' */
    live: false,                       /* true: the site sends the form itself; we react only after its own status line says it worked */
    ok: /thank|saved|sent|received|welcome|check your (e-?mail|inbox)/i,
    fail: /could not|not saved|error|try again|invalid|failed/i,
    presenceHref: '', presenceHide: '', cardLift: 0
  }, window.HEARYOU || {});

  var COPY = {
    contact: {title:'Message received', reply:'Thank you{name}. Your message is with our team now, and a real person will reply {within}.'},
    chat:    {title:'We’re here', reply:'Got it{name}. Give us a moment, we’re looking into it right now.'},
    signup:  {title:'Welcome aboard', reply:'Welcome{name}! Your place is saved. We’ve sent your next step to you, and we’re glad you’re here.'},
    verify:  {title:'Checking now', reply:'Thank you{name}. We’re verifying this securely. You’ll see the result here in a moment.'},
    portal:  {title:'Request logged', reply:'Done{name}. Your request is logged, assigned to an owner and tracked until it’s closed.'}
  };
  Object.keys(C.copy||{}).forEach(function(k){ COPY[k] = Object.assign({}, COPY[k]||{}, C.copy[k]); });

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = reduce ? {recv:0, read:200, typing:300} : {recv:350, read:1000, typing:1500};
  var live;

  function el(tag, cls, text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
  function announce(msg){
    if(!live){ live=el('div','hy-sr'); live.setAttribute('aria-live','polite'); document.body.appendChild(live); }
    live.textContent=''; setTimeout(function(){ live.textContent=msg; }, 30);
  }
  function ref(){
    var d=new Date(), p=function(n){return String(n).padStart(2,'0');};
    return 'HY-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  }
  function firstName(form){
    if(!form) return '';
    var f=form.querySelector('[name=name],[name=fullname],[name=first_name],[autocomplete="name"],[autocomplete="given-name"]');
    var v=f&&f.value.trim(); return v ? ', '+v.split(/\s+/)[0] : '';
  }

  /* listening chip above a form */
  function wireForm(form){
    if(form.__hy) return; form.__hy=true;
    if(form.getAttribute('data-hear')==='off' || form.querySelector('input[type=password]') || form.hasAttribute('data-quiz') || form.hasAttribute('data-member') || form.getAttribute('role')==='search') return;
    var kind=form.getAttribute('data-hear')||(/signup|sign-up|notify/i.test(form.className+' '+(form.getAttribute('data-subject')||'')) ? 'signup' : (form.hasAttribute('data-kind') ? 'portal' : 'contact'));
    var chip=el('div','hy-listen'); chip.setAttribute('aria-hidden','true');
    var wave=el('span','hy-wave'); for(var i=0;i<4;i++) wave.appendChild(el('i'));
    chip.appendChild(wave); var txt=el('span',null,'We’re listening'); chip.appendChild(txt);
    form.insertBefore(chip, form.firstChild);
    var idle;
    form.addEventListener('focusin', function(){ chip.classList.add('on'); });
    form.addEventListener('input', function(){
      chip.classList.add('on','typing'); txt.textContent='We’re listening…';
      clearTimeout(idle); idle=setTimeout(function(){ chip.classList.remove('typing'); txt.textContent='Take your time, we’re here'; }, 1400);
    });
    form.addEventListener('focusout', function(){ setTimeout(function(){ if(!form.contains(document.activeElement)) chip.classList.remove('on','typing'); }, 150); });
    form.addEventListener('submit', function(e){
      chip.classList.remove('on','typing');
      var name=firstName(form), inline=form.hasAttribute('data-hear-inline') ? form : null;
      if(!C.live && !form.hasAttribute('data-hear-live')){
        if(form.getAttribute('data-hear-handled')!=='site') e.preventDefault();
        if(!form.checkValidity || form.checkValidity()){
          respond(kind, {name:name, inline:inline});
          if(form.getAttribute('data-hear-reset')!=='no') setTimeout(function(){ form.reset(); }, 50);
        }
        return;
      }
      /* live: wait for the site's own status line, so we never claim a message arrived when it did not */
      if(window.Warm && C.deferToWarm!==false) return;   /* the site's own warm reply card answers; we keep the listening wave and the presence light */
      var st=form.querySelector('.form-status,[role=status],[aria-live]'); if(!st) return;
      var done=false, mo, stop=setTimeout(function(){ if(mo) mo.disconnect(); }, 20000);
      function check(){
        if(done) return; var t=(st.textContent||'').trim(); if(!t || st.hidden) return;
        if(C.fail.test(t)){ done=true; mo.disconnect(); clearTimeout(stop); return; }
        if(C.ok.test(t)){ done=true; mo.disconnect(); clearTimeout(stop);
          var m=t.match(/reference(?: is)?\s*([A-Z0-9][A-Z0-9-]{3,})/i);
          respond(kind, {name:name, inline:inline, ref:m?m[1]:null});
        }
      }
      mo=new MutationObserver(check); mo.observe(st,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['hidden']});
      setTimeout(check, 0);
    });
  }

  /* the response sequence: reaction, received, read, typing, warm reply with slogan */
  function respond(kind, opt){
    opt=opt||{}; var c=COPY[kind]||COPY.contact; var r=opt.ref||ref();
    var old=document.querySelector('.hy-card:not(.inline)'); if(old && !opt.inline) old.remove();
    var card=el('section','hy-card'+(opt.inline?' inline':'')); card.setAttribute('role','status');
    if(C.cardLift && !opt.inline) card.style.bottom='calc('+C.cardLift+'px + env(safe-area-inset-bottom,0px))';
    var close=el('button','hy-close','×'); close.type='button'; close.setAttribute('aria-label','Close'); close.addEventListener('click',function(){card.remove();});
    var top=el('div','hy-top'), rx=el('div','hy-react'), emo=el('span','hy-emo',C.reaction); rx.appendChild(emo);
    if(!reduce) C.sparks.forEach(function(s,i){ var sp=el('span','hy-spark',s); var a=(i/C.sparks.length)*Math.PI*2; sp.style.setProperty('--dx',Math.round(Math.cos(a)*42)+'px'); sp.style.setProperty('--dy',Math.round(Math.sin(a)*42)+'px'); rx.appendChild(sp); });
    var head=el('div','hy-head'); head.appendChild(el('p','hy-title',c.title));
    var st=el('div','hy-status'), ticks=el('span','hy-ticks','✓'), stt=el('span',null,'Sent');
    st.appendChild(ticks); st.appendChild(stt); head.appendChild(st);
    top.appendChild(rx); top.appendChild(head); card.appendChild(close); card.appendChild(top);
    if(opt.inline){ opt.inline.parentNode.insertBefore(card, opt.inline.nextSibling); } else document.body.appendChild(card);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ card.classList.add('in'); }); });
    announce(c.title+'. We have your message.');
    setTimeout(function(){ ticks.textContent='✓✓'; stt.textContent='Received'; }, T.recv);
    setTimeout(function(){ ticks.classList.add('read'); stt.textContent='Read by our team'; var d=el('div','hy-dots'); d.setAttribute('aria-hidden','true'); d.appendChild(el('i')); d.appendChild(el('i')); d.appendChild(el('i')); card.appendChild(d); card.__dots=d; }, T.read);
    setTimeout(function(){
      if(card.__dots) card.__dots.remove();
      var msg=el('p','hy-msg', c.reply.replace('{name}',opt.name||'').replace('{within}',C.replyWithin)); card.appendChild(msg);
      if(C.slogan){ var s=el('p','hy-slogan'); s.appendChild(el('b',null,C.slogan)); if(C.sloganTranslation) s.appendChild(el('span',null,C.sloganTranslation)); card.appendChild(s); }
      var m=el('div','hy-meta'); var a=el('span',null,'Reference '); a.appendChild(el('code',null,r)); m.appendChild(a); m.appendChild(el('span',null,'Reply '+C.replyWithin)); card.appendChild(m);
      announce(msg.textContent);
    }, T.read+T.typing);
    return r;
  }

  /* chat widgets: call after the visitor's bubble is added */
  function chatSent(bubble){
    var ack=el('div','hy-bubble-ack'); var t=el('span','hy-ticks','✓'); var s=el('span',null,'Sent'); var rx=el('span','hy-bubble-react',C.reaction);
    ack.appendChild(t); ack.appendChild(s); ack.appendChild(rx); bubble.appendChild(ack);
    setTimeout(function(){ t.textContent='✓✓'; s.textContent='Delivered'; }, T.recv);
    setTimeout(function(){ t.classList.add('read'); s.textContent='Read'; rx.classList.add('on'); }, T.read);
    return { typing: function(host){ var d=el('div','hy-dots'); d.appendChild(el('i')); d.appendChild(el('i')); d.appendChild(el('i')); host.appendChild(d); return function(){ d.remove(); }; } };
  }

  function presence(){
    if(!C.presence || document.querySelector('.hy-presence')) return;
    var p=el(C.presenceHref?'a':'div','hy-presence'); if(C.presenceHref){ p.href=C.presenceHref; p.setAttribute('aria-label',C.presenceText+'. Write to us'); }
    p.appendChild(el('span','hy-live')); p.appendChild(el('span','hy-ptext',C.presenceText)); document.body.appendChild(p);
    if(C.presenceHide){
      var sync=function(){ var o=document.querySelector(C.presenceHide); p.hidden=!!(o && !o.hidden && o.getClientRects().length>0); };
      sync(); document.addEventListener('click', function(){ setTimeout(sync,50); }); setInterval(sync, 800);
    }
  }

  function init(){ document.querySelectorAll(C.forms).forEach(wireForm); presence(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
  var pend=false; new MutationObserver(function(){ if(pend) return; pend=true; setTimeout(function(){ pend=false; document.querySelectorAll(C.forms).forEach(wireForm); }, 250); }).observe(document.documentElement,{childList:true,subtree:true});

  window.HearYou = { respond: respond, chatSent: chatSent, wire: wireForm, config: C, setReaction: function(e){ C.reaction=e; }, setSlogan: function(s,t){ C.slogan=s; C.sloganTranslation=t||''; } };
})();
