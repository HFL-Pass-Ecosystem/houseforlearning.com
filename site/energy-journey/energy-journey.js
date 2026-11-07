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

  // Trend chart and history from metrics.json (append-only record)
  var chart = document.getElementById("chart");
  if (chart && window.fetch) {
    fetch("metrics.json").then(function(r){ return r.json(); }).then(function(d){
      var cols = {workforce_published_m:"#0F85DB", workforce_low_m:"#7bc9a0", workforce_mid_m:"#3CC261", workforce_high_m:"#1F7A3A"};
      var lab = {}, unit = {}; d.series.forEach(function(s){ lab[s.id] = s.label; unit[s.id] = s.unit; });
      var pts = {}; var all = [];
      d.snapshots.forEach(function(sn){ Object.keys(sn.values).forEach(function(k){
        if (unit[k] !== "million people") return;
        var t = Date.parse(sn.date); (pts[k] = pts[k] || []).push([t, sn.values[k].value]); all.push([t, sn.values[k].value]); }); });
      var t0 = Math.min.apply(null, all.map(function(a){return a[0];})), t1 = Math.max.apply(null, all.map(function(a){return a[0];}));
      if (t1 === t0) t1 = t0 + 86400000 * 365;
      var W = 760, H = 300, L = 46, B = 36, T = 16, R = 24, vmax = 160;
      function X(t){ return L + (t - t0) / (t1 - t0) * (W - L - R); }
      function Y(v){ return H - B - v / vmax * (H - B - T); }
      var g = "";
      [0, 40, 80, 120, 160].forEach(function(v){ g += '<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#0b254022"/><text x="'+(L-6)+'" y="'+(Y(v)+4)+'" text-anchor="end" font-size="11" fill="#4a5b6c">'+v+'</text>'; });
      var yrs = {}; all.forEach(function(a){ yrs[new Date(a[0]).getUTCFullYear()] = a[0]; });
      Object.keys(yrs).forEach(function(y){ g += '<text x="'+X(yrs[y])+'" y="'+(H-12)+'" text-anchor="middle" font-size="11" fill="#4a5b6c">'+y+'</text>'; });
      Object.keys(pts).forEach(function(k){
        var p = pts[k], c = cols[k] || "#0B2540";
        if (p.length > 1) g += '<polyline fill="none" stroke="'+c+'" stroke-width="3" points="'+p.map(function(a){return X(a[0])+","+Y(a[1]);}).join(" ")+'"/>';
        p.forEach(function(a){ g += '<circle cx="'+X(a[0])+'" cy="'+Y(a[1])+'" r="5" fill="'+c+'"><title>'+lab[k]+": "+a[1]+' million</title></circle><text x="'+(X(a[0])+(X(a[0])<L+30?10:-8))+'" y="'+(Y(a[1])-9)+'" text-anchor="'+(X(a[0])<L+30?"start":"end")+'" font-size="11" font-weight="700" fill="'+c+'">'+a[1]+'</text>'; });
      });
      chart.innerHTML = '<svg viewBox="0 0 '+W+' '+H+'" role="presentation">'+g+'</svg>';
      var lg = document.getElementById("legend"); lg.textContent = "";
      Object.keys(pts).forEach(function(k){ var sp = document.createElement("span"); sp.style.color = cols[k] || "#0B2540"; sp.textContent = "\u25A0 "; lg.appendChild(sp); lg.appendChild(document.createTextNode(lab[k] + "   ")); });
      lg.appendChild(document.createTextNode("(millions of people)"));
      // schedule
      var due = {monthly:1, quarterly:3, "half-yearly":6, yearly:12}, cad = document.getElementById("cad");
      if (cad) cad.innerHTML = Object.keys(due).map(function(c){
        var last = null; d.snapshots.forEach(function(sn){ if (sn.cadence.indexOf(c) > -1 && (!last || sn.date > last)) last = sn.date; });
        var nx = "";
        if (last) { var x = new Date(last); x.setUTCMonth(x.getUTCMonth() + due[c]); nx = x.toISOString().slice(0,10); }
        return '<div class="card"><b>'+c.charAt(0).toUpperCase()+c.slice(1)+' refresh</b><br><span class="note">Last: '+(last||"none yet")+'<br>Next due: '+(nx||"to be set")+'</span></div>';
      }).join("");
      // table (newest first)
      var rows = [];
      d.snapshots.slice().reverse().forEach(function(sn){ Object.keys(sn.values).forEach(function(k){
        var v = sn.values[k]; rows.push('<tr><td>'+sn.date+'</td><td>'+sn.cadence.join(", ")+'</td><td>'+lab[k]+'</td><td>'+v.value+' '+unit[k]+'</td><td>'+v.basis+'</td><td>'+v.source+'</td></tr>'); }); });
      document.getElementById("hist").innerHTML = rows.join("");
    }).catch(function(){ chart.innerHTML = '<p class="note">The history could not be loaded just now.</p>'; });
  }
})();
