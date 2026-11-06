(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Timeline reveal
  var evs = document.querySelectorAll(".ev");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, {threshold: 0.2});
    evs.forEach(function(e){ io.observe(e); });
  } else { evs.forEach(function(e){ e.classList.add("in"); }); }

  // Bars grow when seen
  function fill(box){
    box.querySelectorAll("i[data-w]").forEach(function(i){
      var max = parseFloat(i.getAttribute("data-max") || "130");
      var pct = Math.min(100, parseFloat(i.getAttribute("data-w")) / max * 100);
      i.style.width = pct + "%";
    });
  }
  var boxes = document.querySelectorAll("[data-bars]");
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { fill(e.target); io2.unobserve(e.target); } });
    }, {threshold: 0.25});
    boxes.forEach(function(b){ io2.observe(b); });
  } else { boxes.forEach(fill); }

  // Switch the power off
  var sw = document.getElementById("sw"), sec = document.getElementById("sectors");
  if (sw && sec) {
    sw.addEventListener("click", function(){
      var off = sec.classList.toggle("dark-mode");
      sw.setAttribute("aria-pressed", off ? "true" : "false");
      sw.innerHTML = off ? "&#128161; Switch the power back on" : "&#9889; Switch the power off";
    });
  }

  // Soft ambient music made in the browser. Off until the visitor presses the button.
  var btn = document.getElementById("snd"), ctx = null, master = null, nodes = [];
  function start(){
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.textContent = "Music not supported"; return; }
    ctx = ctx || new AC();
    if (ctx.resume) ctx.resume();
    master = ctx.createGain(); master.gain.value = 0;
    master.connect(ctx.destination);
    var f = [110, 164.81, 220, 277.18, 329.63];
    f.forEach(function(hz, k){
      var o = ctx.createOscillator(), g = ctx.createGain(), l = ctx.createOscillator(), lg = ctx.createGain();
      o.type = "sine"; o.frequency.value = hz;
      g.gain.value = 0.05 / (1 + k * 0.5);
      l.frequency.value = 0.07 + k * 0.03; lg.gain.value = g.gain.value * 0.6;
      l.connect(lg); lg.connect(g.gain);
      o.connect(g); g.connect(master);
      o.start(); l.start(); nodes.push(o, l);
    });
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 3);
  }
  function stop(){
    if (!ctx || !master) return;
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    var n = nodes; nodes = [];
    setTimeout(function(){ n.forEach(function(o){ try { o.stop(); } catch (e) {} }); }, 1200);
  }
  if (btn) btn.addEventListener("click", function(){
    var on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.innerHTML = on ? "&#9835; Music: on" : "&#9835; Music: off";
    if (on) start(); else stop();
  });
})();
