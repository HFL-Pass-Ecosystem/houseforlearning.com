var v=$("#v"),a=0,b=0;
function load(f){v.src=URL.createObjectURL(f);v.onloadedmetadata=function(){a=0;b=v.duration;upd();$("#go").disabled=false}}
function upd(){$("#rng").textContent="Start "+a.toFixed(1)+" s, end "+b.toFixed(1)+" s"}
dropzone($("#drop"),function(f){f[0]&&load(f[0])});
$("#ss").onclick=function(){a=v.currentTime;if(b<=a)b=v.duration;upd()};$("#se").onclick=function(){b=v.currentTime;if(a>=b)a=0;upd()};
$("#go").onclick=function(){if(!v.captureStream||!window.MediaRecorder){$("#st").textContent="This browser cannot record clips. Try a recent Chrome, Edge or Firefox.";return}
var s=v.captureStream(),mr=new MediaRecorder(s),ch=[];mr.ondataavailable=function(e){ch.push(e.data)};
mr.onstop=function(){download(new Blob(ch,{type:"video/webm"}),"studio-clip.webm");$("#st").textContent="Saved.";v.pause()};
v.currentTime=a;v.onseeked=function(){v.onseeked=null;mr.start();v.play();$("#st").textContent="Recording...";var t=setInterval(function(){if(v.currentTime>=b||v.ended){clearInterval(t);mr.stop()}},80)}};
