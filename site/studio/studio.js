(function(){
var items=[["index.html","Studio"],["image.html","Image"],["pdf.html","PDF"],["documents.html","Documents"],["diagrams.html","Diagrams"],["media.html","Media"],["engines.html","Engines"]];
var cur=location.pathname.split("/").pop()||"index.html";
var h=document.createElement("header");h.className="top";
h.innerHTML='<a class="brand" href="index.html">House for Learning Studio</a>'+items.slice(1).map(function(i){return '<a class="m'+(i[0]==cur?' on':'')+'" href="'+i[0]+'">'+i[1]+'</a>'}).join("");
h.innerHTML+='<a class="back-site" href="../index.html">House for Learning</a>';document.body.prepend(h);
window.$=function(s,r){return (r||document).querySelector(s)};
window.download=function(blob,name){var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},2000)};
window.dropzone=function(el,cb){["dragenter","dragover"].forEach(function(e){el.addEventListener(e,function(ev){ev.preventDefault();el.classList.add("over")})});["dragleave","drop"].forEach(function(e){el.addEventListener(e,function(ev){ev.preventDefault();el.classList.remove("over")})});el.addEventListener("drop",function(ev){cb([].slice.call(ev.dataTransfer.files))});var inp=el.querySelector("input[type=file]");if(inp)inp.addEventListener("change",function(){cb([].slice.call(inp.files))})};
})();
