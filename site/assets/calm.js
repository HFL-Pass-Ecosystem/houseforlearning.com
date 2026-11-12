/* Flip cards open only on tap/click, Enter/Space, or a deliberate ~0.6 s pointer rest. Never on pass-over.
   A pointer that keeps moving restarts the rest timer; leaving closes after the same rest. Escape closes. */
(function(){
  var REST=600;
  document.querySelectorAll('.flip').forEach(function(c){
    var b=c.querySelector('.flip-in'),f=c.querySelector('.flip-f'),k=c.querySelector('.flip-b'),t=null,out=null;
    if(!b||!f||!k)return;
    function set(o){c.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));k.setAttribute('aria-hidden',String(!o));f.setAttribute('aria-hidden',String(o))}
    set(false);
    b.addEventListener('click',function(){clearTimeout(t);set(!c.classList.contains('open'))});
    function rested(){if(!c.classList.contains('open'))t=setTimeout(function(){set(true)},REST)}
    c.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){clearTimeout(out);rested()}});
    c.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;clearTimeout(t);clearTimeout(out);rested()});
    c.addEventListener('pointerleave',function(e){clearTimeout(t);if(e.pointerType==='mouse')out=setTimeout(function(){set(false)},REST)});
    c.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  });
})();
