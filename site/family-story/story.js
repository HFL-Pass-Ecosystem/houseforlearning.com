
(function(){
  var d=document.getElementById('viewer'),im=document.getElementById('viewer-img'),cap=document.getElementById('viewer-cap');
  document.querySelectorAll('[data-full]').forEach(function(b){
    b.addEventListener('click',function(){im.src=b.getAttribute('data-full');im.alt=b.getAttribute('data-cap')||'';cap.textContent=b.getAttribute('data-cap')||'';try{d.showModal()}catch(e){d.setAttribute('open','')}});
  });
  document.getElementById('viewer-close').addEventListener('click',function(){d.close()});
  d.addEventListener('click',function(e){if(e.target===d)d.close()});
})();
