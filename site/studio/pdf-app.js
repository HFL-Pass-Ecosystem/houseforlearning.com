import * as pdfjs from "./vendor/pdf.min.mjs";
pdfjs.GlobalWorkerOptions.workerSrc="./vendor/pdf.worker.min.mjs";
const docs=[];let pages=[];let sel=new Set();
async function add(files){for(const f of files){const buf=await f.arrayBuffer();const v=await pdfjs.getDocument({data:buf.slice(0)}).promise;docs.push({buf,v});for(let i=0;i<v.numPages;i++)pages.push({d:docs.length-1,i,rot:0,txt:[],id:Math.random()})}draw()}
async function thumb(p,h){const pg=await docs[p.d].v.getPage(p.i+1);const vp0=pg.getViewport({scale:1,rotation:(pg.rotate+p.rot)%360});const s=h/vp0.height;const vp=pg.getViewport({scale:s,rotation:(pg.rotate+p.rot)%360});const c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;return c}
async function draw(){const th=$("#th");th.innerHTML="";for(let n=0;n<pages.length;n++){const p=pages[n];const c=await thumb(p,150);c.style.outline=sel.has(p.id)?"3px solid #0F85DB":"none";c.title="Page "+(n+1);c.onclick=e=>{sel.has(p.id)?sel.delete(p.id):sel.add(p.id);draw();big(p)};th.appendChild(c)}$("#st").textContent=pages.length+" pages"}
async function big(p){const c=await thumb(p,900);const b=$("#big");b.width=c.width;b.height=c.height;b.getContext("2d").drawImage(c,0,0)}
const chosen=()=>pages.filter(p=>sel.has(p.id));
$("#rot").onclick=()=>{chosen().forEach(p=>p.rot=(p.rot+90)%360);draw()};
$("#del").onclick=()=>{pages=pages.filter(p=>!sel.has(p.id));sel.clear();draw()};
function mv(k){const idx=pages.map((p,i)=>sel.has(p.id)?i:-1).filter(i=>i>=0);if(k<0)idx.forEach(i=>{if(i>0&&!sel.has(pages[i-1].id))[pages[i-1],pages[i]]=[pages[i],pages[i-1]]});else idx.reverse().forEach(i=>{if(i<pages.length-1&&!sel.has(pages[i+1].id))[pages[i+1],pages[i]]=[pages[i],pages[i+1]]});draw()}
$("#left").onclick=()=>mv(-1);$("#right").onclick=()=>mv(1);
$("#stampb").onclick=()=>{const t=$("#stamp").value;if(t)chosen().forEach(p=>p.txt.push(t));$("#stamp").value="";$("#st").textContent="Stamp added to "+chosen().length+" page(s). Saved when you press Save."};
$("#save").onclick=async()=>{const {PDFDocument,rgb,StandardFonts,degrees}=PDFLib;const out=await PDFDocument.create();const font=await out.embedFont(StandardFonts.Helvetica);const src=await Promise.all(docs.map(d=>PDFDocument.load(d.buf)));
for(const p of pages){const [pg]=await out.copyPages(src[p.d],[p.i]);pg.setRotation(degrees((pg.getRotation().angle+p.rot)%360));out.addPage(pg);p.txt.forEach((t,k)=>pg.drawText(t,{x:36,y:pg.getHeight()-48-k*22,size:16,font,color:rgb(.06,.52,.86)}))}
const bytes=await out.save();download(new Blob([bytes],{type:"application/pdf"}),"studio-edited.pdf")};
dropzone($("#drop"),add);
