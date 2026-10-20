/* Yoga chapter loader: signed-in members get the members copy from the member zone, everyone else the public copy.
   The member zone sets window.HFL_MEMBER = {id, adult, store} before this runs, or sends the "hfl-member" event later. */
(function(){
  var me=document.currentScript, pub=me?me.src.replace(/yoga-boot\.js(\?.*)?$/,"yoga.js"):"assets/yoga.js";
  function load(src,fallback){ var s=document.createElement("script"); s.src=src; s.defer=true; if(fallback) s.onerror=function(){ load(fallback); }; document.head.appendChild(s); }
  if(window.HFL_MEMBER) load("/members/assets/yoga-full.js", pub); else load(pub);
  document.addEventListener("hfl-member",function(){ if(!window.YogaMembersCopy) location.reload(); },{once:true});
})();
