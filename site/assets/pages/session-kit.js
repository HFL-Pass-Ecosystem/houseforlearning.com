document.querySelectorAll('.ts').forEach(function(b){b.addEventListener('click',function(){var v=document.getElementById(b.dataset.p);if(v&&v.src){v.currentTime=+b.dataset.t;v.play()}})});
