var cv=new fabric.Canvas("c",{backgroundColor:"#fff"}),base=null;
function layers(){var o=cv.getObjects();$("#layers").innerHTML=o.map(function(x,i){return '<div>'+(i+1)+'. '+(x.type==='image'?'Photo':x.type==='i-text'?'Text':'Shape')+'</div>'}).join('')}
cv.on("object:added",layers);cv.on("object:removed",layers);
function load(file){var r=new FileReader();r.onload=function(){fabric.Image.fromURL(r.result,function(im){var s=Math.min(1,900/im.width);cv.setWidth(im.width*s);cv.setHeight(im.height*s);im.scale(s);im.selectable=true;base=im;cv.clear();cv.backgroundColor="#fff";cv.add(im);cv.renderAll()})};r.readAsDataURL(file)}
dropzone($("#drop"),function(f){f[0]&&load(f[0])});$("#f").onchange=function(){this.files[0]&&load(this.files[0])};
function fx(){if(!base)return;var f=[];var b=+$("#br").value/100,c=+$("#co").value/100,s=+$("#sa").value/100,bl=+$("#bl").value/20;
if(b)f.push(new fabric.Image.filters.Brightness({brightness:b}));if(c)f.push(new fabric.Image.filters.Contrast({contrast:c}));if(s)f.push(new fabric.Image.filters.Saturation({saturation:s}));if(bl)f.push(new fabric.Image.filters.Blur({blur:bl}));if($("#gr").checked)f.push(new fabric.Image.filters.Grayscale());base.filters=f;base.applyFilters();cv.renderAll()}
["br","co","sa","bl","gr"].forEach(function(i){$("#"+i).oninput=fx});
$("#addtxt").onclick=function(){var t=new fabric.IText("Your text",{left:40,top:40,fontFamily:"Montserrat",fontSize:42,fill:"#0F85DB"});cv.add(t).setActiveObject(t)};
$("#addrect").onclick=function(){var r=new fabric.Rect({left:60,top:60,width:200,height:120,fill:"rgba(60,194,97,.35)",stroke:"#3CC261"});cv.add(r).setActiveObject(r)};
$("#del").onclick=function(){var a=cv.getActiveObject();a&&cv.remove(a)};
$("#up").onclick=function(){var a=cv.getActiveObject();a&&cv.bringForward(a)};
$("#crop").onclick=function(){var a=cv.getActiveObject();if(!a)return;var r=a.getBoundingRect(),url=cv.toDataURL({left:r.left,top:r.top,width:r.width,height:r.height});cv.remove(a);fabric.Image.fromURL(url,function(im){cv.clear();cv.setWidth(r.width);cv.setHeight(r.height);base=im;cv.add(im)})};
$("#rsb").onclick=function(){var m=+$("#rs").value,w=cv.getWidth(),h=cv.getHeight(),k=m/Math.max(w,h);cv.setZoom(cv.getZoom()*k);cv.setWidth(w*k);cv.setHeight(h*k)};
function out(t){cv.discardActiveObject();cv.renderAll();var u=cv.toDataURL({format:t,quality:.92});fetch(u).then(function(r){return r.blob()}).then(function(b){download(b,"studio-image."+(t==="jpeg"?"jpg":"png"))})}
$("#png").onclick=function(){out("png")};$("#jpg").onclick=function(){out("jpeg")};
