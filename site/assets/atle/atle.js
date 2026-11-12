(function(){try{var r=localStorage.getItem("atle-role");if(r==="author"||r==="trainer"||r==="both"){document.documentElement.setAttribute("data-atle-role",r);}}catch(e){}
var s=document.getElementById("atle-suite-open"),l=document.getElementById("atle-suite-locked");
if(s&&l&&document.documentElement.getAttribute("data-atle-role")){s.hidden=false;l.hidden=true;}})();
