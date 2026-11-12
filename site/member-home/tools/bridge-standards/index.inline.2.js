const $=s=>document.querySelector(s);
const LANGS=[["en","English"],["hi","Hindi"],["ar","Arabic"],["bn","Bengali"],["ta","Tamil"],["te","Telugu"],["mr","Marathi"],["gu","Gujarati"],["kn","Kannada"],["ml","Malayalam"],["fr","French"],["de","German"],["es","Spanish"],["pt","Portuguese"],["nl","Dutch"],["it","Italian"],["ru","Russian"],["zh-CN","Chinese"],["ja","Japanese"],["ko","Korean"],["id","Indonesian"],["tr","Turkish"],["sw","Swahili"],["ur","Urdu"]];
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function applyLang(code){
  store("hfl_lang",code);
  document.querySelectorAll("select.lang").forEach(s=>s.value=code);
  const mt=$("#mt"); if(mt) mt.style.display = code==="en" ? "none":"block";
  const c=document.querySelector("select.goog-te-combo");
  if(c){c.value=code==="en"?"":code;c.dispatchEvent(new Event("change"))}
}
function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:"en",autoDisplay:false},"gt");setTimeout(()=>applyLang(store("hfl_lang")||"en"),600)}
document.querySelectorAll("select.lang").forEach(s=>{s.innerHTML=LANGS.map(l=>`<option value="${l[0]}">${l[1]}</option>`).join("");s.onchange=()=>applyLang(s.value)});
applyLang(store("hfl_lang")||"en");

document.querySelectorAll(".flip").forEach(b=>{
  let t=null;const toggle=()=>{b.classList.toggle("open");b.setAttribute("aria-pressed",b.classList.contains("open"))};
  b.onclick=toggle;
  b.addEventListener("pointerenter",e=>{if(e.pointerType!=="mouse")return;t=setTimeout(()=>{if(!b.classList.contains("open"))toggle()},650)});
  b.addEventListener("pointerleave",()=>{clearTimeout(t)});
});
const wm=$(".wm");if(wm)wm.textContent="Test version · "+new Date().toISOString().slice(0,16).replace("T"," ")+" UTC";
