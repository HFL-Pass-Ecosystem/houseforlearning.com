mermaid.initialize({startOnLoad:false,theme:"base",themeVariables:{primaryColor:"#e6f2fb",primaryBorderColor:"#0F85DB",lineColor:"#14202b",fontFamily:"Montserrat,Segoe UI,sans-serif"}});
var n=0;$("#mr").onclick=async function(){try{var r=await mermaid.render("g"+(++n),$("#m").value);$("#mo").innerHTML=r.svg}catch(e){$("#mo").textContent="Check the text: one line per step, like A --> B."}};
$("#ms").onclick=function(){var s=$("#mo").innerHTML;s&&download(new Blob([s],{type:"image/svg+xml"}),"flowchart.svg")};$("#mr").click();
var ch;$("#cr").onclick=function(){var r=Papa.parse($("#d").value.trim(),{header:true,skipEmptyLines:true}),h=r.meta.fields,pal=["#0F85DB","#3CC261","#14202b","#b5a77a","#7aa9c9"];
var lab=r.data.map(function(x){return x[h[0]]});if(ch)ch.destroy();var pie=/pie|doughnut/.test($("#ct").value);
ch=new Chart($("#cc"),{type:$("#ct").value,data:{labels:lab,datasets:h.slice(1).map(function(k,i){return{label:k,data:r.data.map(function(x){return +x[k]}),backgroundColor:pie?pal:pal[i],borderColor:pal[i]}})},options:{responsive:true}})};$("#cr").click();
$("#cs").onclick=function(){$("#cc").toBlob(function(b){download(b,"chart.png")})};
