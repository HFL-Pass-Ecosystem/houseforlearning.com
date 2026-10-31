(function(){
  var s=document.currentScript; if(!s) return;
  var root=new URL('../',s.src); // site root
  var path=location.pathname, rel=path.slice(root.pathname.length);
  var isHome=/^(index\.html)?$/.test(rel);
  var hasHead=!!document.querySelector('.site-head');
  var page=(document.title||'').split(' | ')[0].trim();
  var crumbs=[['Home',root.href+'index.html']];
  var inStudio=/^studio\//.test(rel), inMba=/^mba\//.test(rel);
  if(inStudio){crumbs.push(['Products',root.href+'products.html']);crumbs.push(['Studio',root.href+'studio/index.html']);}
  else if(inMba){crumbs.push(['Learn',root.href+'learning-tracks.html']);}
  else{
    var cur=null;document.querySelectorAll('.site-nav .sub a').forEach(function(a){
      if(new URL(a.getAttribute('href'),location.href).pathname===path) cur=a;});
    if(cur){var li=cur.closest('.has-sub');var b=li&&li.querySelector('.sub-btn');
      if(b){var first=li.querySelector('.sub a');crumbs.push([b.textContent.trim(),first?new URL(first.getAttribute('href'),location.href).href:null]);}}
  }
  var last=crumbs[crumbs.length-1][0];
  var leaf=(inStudio&&/index\.html$/.test(rel))?null:page;
  if(!isHome&&leaf&&leaf!==last&&leaf!=='Studio'&&!(inMba&&leaf==='Online MBA'&&false)) crumbs.push([leaf,null]);
  document.querySelectorAll('.site-head nav[aria-label="You are here"]').forEach(function(n){n.remove();});
  var bar=document.createElement('div');bar.className='wayfind';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Where you are');
  var h='';
  if(!hasHead){h+='<a class="wf-logo" href="'+root.href+'index.html" aria-label="House for Learning, home"><img src="'+root.href+'assets/brand/hfl-sbs-300w.png" alt="" width="56" height="44"></a>';}
  h+='<div class="wf-btns"><button type="button" class="wf-b" data-wf="back" aria-label="Go back">&larr; Back</button><button type="button" class="wf-b" data-wf="fwd" aria-label="Go forward">Forward &rarr;</button><a class="wf-b wf-home" href="'+root.href+'index.html">Home</a></div>';
  if(!isHome){h+='<ol class="wf-trail">'+crumbs.slice(1).map(function(c,i){
    var end=i===crumbs.length-2,t=c[0].replace(/[&<>]/g,'');
    return '<li>'+(c[1]&&!end?'<a href="'+c[1]+'">'+t+'</a>':'<span'+(end?' aria-current="page"':'')+'>'+t+'</span>')+'</li>';}).join('')+'</ol>';}
  bar.innerHTML=h;
  var head=document.querySelector('.site-head')||document.querySelector('header');
  if(hasHead&&head.parentNode){head.parentNode.insertBefore(bar,head.nextSibling);}
  else{var sk=document.querySelector('.skip');(sk&&sk.parentNode?sk.parentNode:document.body).insertBefore(bar,sk?sk.nextSibling:document.body.firstChild);}
  var bk=bar.querySelector('[data-wf=back]');if(bk&&history.length<=1)bk.hidden=true;
  var fw=bar.querySelector('[data-wf=fwd]');
  function syncFw(){if(fw&&window.navigation&&typeof navigation.canGoForward==='boolean'){fw.disabled=!navigation.canGoForward;}}
  syncFw();window.addEventListener('pageshow',syncFw);
  bar.addEventListener('click',function(e){var b=e.target.closest('[data-wf]');if(!b)return;
    if(b.dataset.wf==='back'){if(history.length>1)history.back();else location.href=root.href+'index.html';}
    else history.forward();});
})();
