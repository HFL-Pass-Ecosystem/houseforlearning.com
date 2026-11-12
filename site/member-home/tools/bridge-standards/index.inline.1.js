const boxes=[...document.querySelectorAll("input[type=checkbox]")];
function load(){try{return JSON.parse(localStorage.getItem("bp_checks"))||{}}catch(e){return {}}}
const st=load();boxes.forEach(b=>{b.checked=!!st[b.dataset.k];b.onchange=()=>{st[b.dataset.k]=b.checked;try{localStorage.setItem("bp_checks",JSON.stringify(st))}catch(e){}show()}});
function show(){const n=boxes.filter(b=>b.checked).length;document.getElementById("prog").textContent=n+" of "+boxes.length+" checks ticked. Ticks stay on this device."}show();
