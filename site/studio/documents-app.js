function parse(){return $("#src").value.split(/\n\s*\n/).map(function(b){var t="",l=[];b.split("\n").forEach(function(x){x=x.trim();if(x[0]==="#")t=x.replace(/^#+\s*/,"");else if(x)l.push(x.replace(/^[-*]\s*/,""))});return t||l.length?{t:t,l:l}:null}).filter(Boolean)}
function esc(s){return s.replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c]})}
function render(){$("#pv").innerHTML=parse().map(function(s,i){return '<div class="sl'+(s.l.length?'':' t')+'"><div><h3>'+esc(s.t)+'</h3>'+(s.l.length?'<ul>'+s.l.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+'</div></div>'}).join('')}
$("#src").oninput=render;render();
$("#ppt").onclick=function(){var p=new PptxGenJS();p.layout="LAYOUT_16x9";parse().forEach(function(s){var sl=p.addSlide();sl.background={color:"0C1620"};sl.addShape(p.ShapeType.rect,{x:0,y:0,w:.12,h:5.63,fill:{color:"3CC261"}});
sl.addText(s.t,{x:.7,y:s.l.length?.4:2,w:8.6,h:1,fontFace:"Georgia",fontSize:s.l.length?30:40,color:"FFFFFF"});
if(s.l.length)sl.addText(s.l.map(function(x){return{text:x,options:{bullet:true,breakLine:true}}}),{x:.7,y:1.6,w:8.6,h:3.4,fontFace:"Arial",fontSize:20,color:"E8EEF2",valign:"top"})});p.writeFile({fileName:"studio-deck.pptx"})};
$("#pdf").onclick=async function(){var L=PDFLib,d=await L.PDFDocument.create(),f=await d.embedFont(L.StandardFonts.Helvetica),fb=await d.embedFont(L.StandardFonts.HelveticaBold);
parse().forEach(function(s){var pg=d.addPage([960,540]);pg.drawRectangle({x:0,y:0,width:960,height:540,color:L.rgb(.05,.09,.125)});pg.drawRectangle({x:0,y:0,width:10,height:540,color:L.rgb(.235,.76,.38)});
pg.drawText(s.t,{x:60,y:s.l.length?450:280,size:s.l.length?36:46,font:fb,color:L.rgb(1,1,1),maxWidth:840});s.l.forEach(function(x,i){pg.drawText("-  "+x,{x:70,y:380-i*44,size:22,font:f,color:L.rgb(.9,.93,.95),maxWidth:820})})});
download(new Blob([await d.save()],{type:"application/pdf"}),"studio-deck.pdf")};
