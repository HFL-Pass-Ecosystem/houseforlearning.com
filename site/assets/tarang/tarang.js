/*! Tarang wave field. AHFL shared component. Drop-in, no dependencies.
   Use: <div data-tarang data-palette="site-houseforlearning"></div>
   Load tarang-palettes-ahfl.js (or -ams.js) first, then tarang.js. No visitor controls.
   plus a script tag loading tarang.js (defer)
   The element needs a size (e.g. height:100%). Canvas fills it. */
(function () {
  "use strict";
  var TAU = Math.PI * 2;
  var reduceMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

  function hex(c) {
    c = c.trim().replace("#", "");
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var n = parseInt(c, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lut(stops) {
    var s = stops.map(hex), out = new Uint8Array(256 * 3);
    for (var i = 0; i < 256; i++) {
      var p = (i / 255) * (s.length - 1), k = Math.min(Math.floor(p), s.length - 2), f = p - k;
      for (var c = 0; c < 3; c++) out[i * 3 + c] = Math.round(s[k][c] + (s[k + 1][c] - s[k][c]) * f);
    }
    return out;
  }

  // Two silk ribbons, like sea swells seen from the side.
  var RIBBONS = [
    { y: 0.36, amp: 0.17, thick: 0.30, freq: 0.85, ph: 0.0, skew: 0.10 },
    { y: 0.80, amp: 0.13, thick: 0.26, freq: 0.70, ph: 2.3, skew: -0.08 }
  ];

  function Field(el) {
    this.el = el;
    this.cv = document.createElement("canvas");
    this.cv.setAttribute("aria-hidden", "true");
    this.cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.insertBefore(this.cv, el.firstChild);
    this.ctx = this.cv.getContext("2d");
    // Owner settings: data-palette="<key>" looks up window.TARANG_PALETTES (tarang-palettes-*.js).
    var pal = (window.TARANG_PALETTES || {})[el.getAttribute("data-palette") || ""] || {};
    this.setColors(el.getAttribute("data-colors") || pal.colors || "#0fb5a6,#2f6fe0,#f2a43a");
    this.speed = parseFloat(el.getAttribute("data-speed") || pal.speed || "1");
    this.density = parseFloat(el.getAttribute("data-density") || "1");
    this.visible = true; this.raf = 0; this.last = 0; this.t = 37;
    var self = this;
    this.ro = new ResizeObserver(function () { self.resize(); });
    this.ro.observe(el);
    this.io = new IntersectionObserver(function (e) { self.visible = e[0].isIntersecting; self.kick(); });
    this.io.observe(el);
    document.addEventListener("visibilitychange", function () { self.kick(); });
    if (reduceMQ && reduceMQ.addEventListener) reduceMQ.addEventListener("change", function () { self.kick(); });
    this.resize();
  }
  Field.prototype.setColors = function (str) { this.lut = lut(str.split(",")); if (this.img) this.draw(); };
  Field.prototype.resize = function () {
    var r = this.el.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = Math.max(1, Math.round(r.width * this.dpr));
    this.h = Math.max(1, Math.round(r.height * this.dpr));
    this.cv.width = this.w; this.cv.height = this.h;
    this.img = this.ctx.createImageData(this.w, this.h);
    this.buf = new Uint32Array(this.img.data.buffer);
    this.draw(); this.kick();
  };
  Field.prototype.running = function () {
    return this.visible && !document.hidden && !(reduceMQ && reduceMQ.matches);
  };
  Field.prototype.kick = function () {
    var self = this;
    if (this.running()) {
      if (!this.raf) this.raf = requestAnimationFrame(function loop(now) {
        if (!self.running()) { self.raf = 0; return; }
        if (now - self.last > 40) { // ~25 fps is plenty for slow swells
          if (self.last) self.t += Math.min(now - self.last, 100) / 1000 * self.speed;
          self.last = now; self.draw();
        }
        self.raf = requestAnimationFrame(loop);
      });
    } else { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; this.last = 0; this.draw(); }
  };
  Field.prototype.draw = function () {
    var W = this.w, H = this.h, d = this.img.data, L = this.lut, s = this.t * 0.16;
    this.buf.fill(0);
    var ds = this.dpr >= 1.25 ? 2 : 1;
    var lines = Math.round(64 * this.density);
    var pts = Math.round(Math.min(260, Math.max(90, W / (3.2 * this.dpr))) * this.density);
    for (var r = 0; r < RIBBONS.length; r++) {
      var R = RIBBONS[r];
      for (var i = 0; i < lines; i++) {
        var v = i / (lines - 1) - 0.5, edge = 1 - 4 * v * v;
        for (var j = 0; j < pts; j++) {
          var u = j / (pts - 1);
          var ph = R.ph, a1 = u * R.freq * TAU;
          var center = R.y + R.amp * (0.7 * Math.sin(a1 + s * 1.0 + ph) + 0.3 * Math.sin(a1 * 1.9 - s * 0.7 + ph * 1.7));
          var twist = Math.sin(u * 2.6 + s * 0.55 + ph);
          var y = center + v * R.thick * twist + 0.012 * Math.sin(v * 9 + u * 17 + s * 2.2);
          var x = u * 1.2 - 0.1 + v * R.skew * Math.cos(u * 3 + s * 0.4 + ph);
          var px = Math.round(x * W), py = Math.round(y * H);
          if (px < 0 || py < 0 || px >= W - ds || py >= H - ds) continue;
          var ct = 0.55 * (R.y + R.amp - center) / (2 * R.amp) + 0.45 * u + 0.15 * v * twist;
          var ci = Math.max(0, Math.min(255, Math.round(ct * 255))) * 3;
          var endFade = Math.min(1, u * 6, (1 - u) * 6);
          var al = Math.round(235 * edge * endFade * (0.55 + 0.45 * Math.abs(twist)));
          for (var oy = 0; oy < ds; oy++) for (var ox = 0; ox < ds; ox++) {
            var o = ((py + oy) * W + px + ox) * 4, na = d[o + 3] + al;
            d[o] = L[ci]; d[o + 1] = L[ci + 1]; d[o + 2] = L[ci + 2]; d[o + 3] = na > 255 ? 255 : na;
          }
        }
      }
    }
    this.ctx.putImageData(this.img, 0, 0);
  };

  function init(root) {
    (root || document).querySelectorAll("[data-tarang]").forEach(function (el) {
      if (!el.__tarang) el.__tarang = new Field(el);
    });
  }
  window.Tarang = { init: init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
