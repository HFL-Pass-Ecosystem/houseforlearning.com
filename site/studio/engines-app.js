import * as pdfjs from "./vendor/pdf.min.mjs";pdfjs.GlobalWorkerOptions.workerSrc="./vendor/pdf.worker.min.mjs";
let rows=[];
function show(){const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];$("#tb").innerHTML="<tr>"+keys.map(k=>"<th>"+k+"</th>").join("")+"</tr>"+rows.slice(0,200).map(r=>"<tr>"+keys.map(k=>"<td>"+(r[k]==null?"":String(typeof r[k]==="object"?JSON.stringify(r[k]):r[k]).replace(/[<&]/g,"")).slice(0,120)+"</td>").join("")+"</tr>").join("");$("#cnt").textContent=rows.length+" rows"+(rows.length>200?" (first 200 shown)":"");$("#csv").disabled=$("#json").disabled=!rows.length}
const flat=(o,p="")=>Object.entries(o).reduce((a,[k,v])=>(v&&typeof v==="object"&&!Array.isArray(v)?Object.assign(a,flat(v,p+k+".")):a[p+k]=v,a),{});
async function ingest(files){const log=[];for(const f of files){const ext=f.name.split(".").pop().toLowerCase();let n=0;try{
if(ext==="csv"){const r=Papa.parse(await f.text(),{header:true,skipEmptyLines:true});r.data.forEach(x=>rows.push({source:f.name,...x}));n=r.data.length}
else if(["xlsx","xls"].includes(ext)){const wb=XLSX.read(await f.arrayBuffer());wb.SheetNames.forEach(s=>XLSX.utils.sheet_to_json(wb.Sheets[s]).forEach(x=>{rows.push({source:f.name+" / "+s,...x});n++}))}
else if(ext==="json"){let j=JSON.parse(await f.text());if(!Array.isArray(j))j=Object.values(j).find(Array.isArray)||[j];j.forEach(x=>rows.push({source:f.name,...flat(x)}));n=j.length}
else if(ext==="pdf"){const d=await pdfjs.getDocument({data:await f.arrayBuffer()}).promise;for(let i=1;i<=d.numPages;i++){const t=(await(await d.getPage(i)).getTextContent()).items.map(x=>x.str).join(" ");rows.push({source:f.name,page:i,text:t.slice(0,2000)});n++}}
else{const t=await f.text();t.split(/\n+/).filter(Boolean).forEach((l,i)=>{rows.push({source:f.name,line:i+1,text:l});n++})}
log.push(f.name+": "+n+" rows read.")}catch(e){log.push(f.name+": could not be read.")}}
$("#log").innerHTML=log.join("<br>");show()}
dropzone($("#drop"),ingest);
$("#run").onclick=async()=>{const u=$("#urls").value.split("\n").map(s=>s.trim()).filter(Boolean);let ok=0;for(const url of u){try{let j=await(await fetch(url)).json();if(!Array.isArray(j))j=Object.values(j).find(Array.isArray)||[j];j.forEach(x=>rows.push({source:new URL(url).host,...flat(x)}));ok++}catch(e){}}
$("#st").textContent=ok+" of "+u.length+" addresses read.";show()};
$("#csv").onclick=()=>download(new Blob([Papa.unparse(rows)],{type:"text/csv"}),"collated.csv");
$("#json").onclick=()=>download(new Blob([JSON.stringify(rows,null,1)],{type:"application/json"}),"collated.json");
