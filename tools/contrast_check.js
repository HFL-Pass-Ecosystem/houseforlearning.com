// Colour-contrast check (WCAG AA) for built pages, using Playwright. Usage: node tools/contrast_check.js page1.html page2.html ...  (run from the repo root; prints each page and any failing text colour pairs). Not run in CI: needs a browser.
const {chromium}=require('playwright');
const files=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});
for(const f of files){await p.goto('file://'+process.cwd()+'/site/'+f);
 await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
 const r=await p.evaluate(()=>{
 const parse=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const v=m[1].split(/[ ,\/]+/).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}};
 const lum=c=>{const f=x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)};
 const bgOf=el=>{let layers=[];for(let e=el;e;e=e.parentElement){const cs=getComputedStyle(e);if(cs.backgroundImage!=='none')return null;const c=parse(cs.backgroundColor);if(c&&c.a>0){layers.push(c);if(c.a>=1)break}}
  let base={r:255,g:255,b:255};for(let i=layers.length-1;i>=0;i--){const c=layers[i];base={r:c.r*c.a+base.r*(1-c.a),g:c.g*c.a+base.g*(1-c.a),b:c.b*c.a+base.b*(1-c.a)}}return base};
 const out={};const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const t=n.nodeValue.trim();if(!t)continue;const el=n.parentElement;if(!el||['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName))continue;
  const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||el.offsetParent===null&&cs.position!=='fixed')continue;
  const fg=parse(cs.color);const bg=bgOf(el);if(!fg||!bg)continue;
  const fa={r:fg.r*fg.a+bg.r*(1-fg.a),g:fg.g*fg.a+bg.g*(1-fg.a),b:fg.b*fg.a+bg.b*(1-fg.a)};
  const L1=lum(fa),L2=lum(bg);const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
  const size=parseFloat(cs.fontSize),bold=parseInt(cs.fontWeight)>=700;const large=size>=24||(size>=18.66&&bold);
  if(ratio<(large?3:4.5)){const k=(el.className||el.tagName)+'|'+cs.color+'|'+JSON.stringify([Math.round(bg.r),Math.round(bg.g),Math.round(bg.b)]);out[k]=out[k]||{ratio:+ratio.toFixed(2),n:0,t:t.slice(0,30)};out[k].n++}}
 return out});
 const ks=Object.keys(r);console.log(f,ks.length?'':'ok');ks.slice(0,8).forEach(k=>console.log('  ',k,JSON.stringify(r[k])))}
await b.close()})();
