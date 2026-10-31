/* How-to video player (floating picture-in-picture). No dependencies.
   Drag with mouse, touch or pen. Resize, minimise, native pop-out where the browser has it.
   MP4 video, WebVTT captions, step list. Keeps its place between pages in the same tab. */
(function () {
  'use strict';
  if (window.HowtoPlayer) return;
  var KEY = 'htp-state-v1', EDGE = 8, SIZES = { S: 280, M: 420, L: 760 };
  var el, vid, state = {}, drag = null, saveT = 0, steps = [], tracks = [], stepEls = [];

  function $(s, r) { return (r || document).querySelector(s); }
  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); var m = Math.floor(t / 60), s = t % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function ico(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }
  var I = {
    steps: ico('<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>'),
    cc: ico('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 10a2.5 2.5 0 1 0 0 4M17 10a2.5 2.5 0 1 0 0 4"/>'),
    pip: ico('<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="11" y="11" width="8" height="6" rx="1"/>'),
    min: ico('<path d="M5 12h14"/>'), max: ico('<path d="M5 5h14v14H5z"/>'), close: ico('<path d="M6 6l12 12M18 6L6 18"/>'),
    back: ico('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'), fwd: ico('<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>'),
    size: ico('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'), grab: ico('<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>'),
    play: ico('<path d="M7 4l13 8-13 8z"/>'), pause: ico('<path d="M8 5v14M16 5v14"/>')
  };

  /* ---------- WebVTT chapters/steps ---------- */
  function ts(s) { var p = s.trim().split(':').map(parseFloat); if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2]; if (p.length === 2) return p[0] * 60 + p[1]; return p[0] || 0; }
  function parseVtt(txt) {
    var out = [], blocks = txt.replace(/\r/g, '').split(/\n\n+/);
    blocks.forEach(function (b) {
      var lines = b.split('\n'), i = 0;
      while (i < lines.length && lines[i].indexOf('-->') < 0) i++;
      if (i >= lines.length) return;
      var t = ts(lines[i].split('-->')[0]), body = lines.slice(i + 1).join('\n').trim();
      if (!body) return;
      var parts = body.split('\n');
      out.push({ t: t, title: parts[0], text: parts.slice(1).join(' ') });
    });
    return out;
  }

  /* ---------- build ---------- */
  function build() {
    el = mk('section', 'htp');
    el.hidden = true; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'How-to video player');
    el.innerHTML =
      '<div class="htp-bar" tabindex="0" role="group" aria-label="Video window. Drag to move, or use the arrow keys.">' + '<span class="htp-grab">' + I.grab + '</span>' +
      '<span class="htp-title"></span>' +
      '<span class="htp-tools-min"><button type="button" class="htp-btn htp-pp" aria-label="Play or pause"></button></span>' +
      '<button type="button" class="htp-btn htp-bsteps" aria-label="Show or hide the steps" aria-pressed="true">' + I.steps + '</button>' +
      '<button type="button" class="htp-btn htp-bsize" aria-label="Change window size (small, medium, large)">' + I.size + '</button>' +
      '<button type="button" class="htp-btn htp-bmin" aria-label="Minimise. The sound keeps playing.">' + I.min + '</button>' +
      '<button type="button" class="htp-btn htp-bclose" aria-label="Close video">' + I.close + '</button></div>' +
      '<div class="htp-body"><div class="htp-main"><div class="htp-stage"><video playsinline preload="metadata" controls></video>' +
      '<div class="htp-pipmsg">Playing in the pop-out window. Follow the steps here.</div><div class="htp-msg" aria-live="polite"></div></div>' +
      '<div class="htp-tools">' +
      '<button type="button" class="htp-btn htp-bback" aria-label="Back 10 seconds">' + I.back + '<span>10</span></button>' +
      '<button type="button" class="htp-btn htp-bfwd" aria-label="Forward 10 seconds"><span>10</span>' + I.fwd + '</button>' +
      '<button type="button" class="htp-btn htp-bspeed" aria-label="Playback speed">1×</button>' +
      '<button type="button" class="htp-btn htp-bcc" aria-label="Captions" aria-pressed="false">' + I.cc + '</button>' +
      '<button type="button" class="htp-btn htp-bpip" aria-label="Pop out of the page" hidden>' + I.pip + '</button></div></div>' +
      '<ol class="htp-steps" aria-label="Steps"></ol></div>' +
      '<div class="htp-grip" tabindex="0" role="slider" aria-label="Resize window. Drag, or use the arrow keys." aria-valuemin="240" aria-valuemax="1000" aria-valuenow="420">' + ico('<path d="M4 20L20 4M12 20l8-8"/>') + '</div>';
    document.body.appendChild(el);
    vid = $('video', el);
    wire();
  }

  function msg(t) { var m = $('.htp-msg', el); m.textContent = t; m.classList.add('on'); clearTimeout(msg.h); msg.h = setTimeout(function () { m.classList.remove('on'); }, 2200); }

  function wire() {
    var bar = $('.htp-bar', el), grip = $('.htp-grip', el);
    bar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      if (e.button && e.button !== 0) return;
      var r = el.getBoundingClientRect(); drag = { k: 'move', dx: e.clientX - r.left, dy: e.clientY - r.top, id: e.pointerId };
      bar.setPointerCapture(e.pointerId); e.preventDefault();
    });
    bar.addEventListener('pointermove', function (e) { if (!drag || drag.k !== 'move') return; place(e.clientX - drag.dx, e.clientY - drag.dy); });
    bar.addEventListener('pointerup', endDrag); bar.addEventListener('pointercancel', endDrag);
    bar.addEventListener('keydown', function (e) {
      var st = e.shiftKey ? 80 : 20, r = el.getBoundingClientRect(), k = e.key;
      if (e.target !== bar) return;
      if (k === 'ArrowLeft') place(r.left - st, r.top); else if (k === 'ArrowRight') place(r.left + st, r.top);
      else if (k === 'ArrowUp') place(r.left, r.top - st); else if (k === 'ArrowDown') place(r.left, r.top + st);
      else if (k === 'Enter' || k === ' ') { toggleMin(); } else return;
      e.preventDefault();
    });
    grip.addEventListener('pointerdown', function (e) {
      var r = el.getBoundingClientRect(); drag = { k: 'size', x: e.clientX, w: r.width, id: e.pointerId };
      grip.setPointerCapture(e.pointerId); e.preventDefault(); e.stopPropagation();
    });
    grip.addEventListener('pointermove', function (e) { if (drag && drag.k === 'size') setW(Math.min(drag.w + (e.clientX - drag.x), innerWidth - el.getBoundingClientRect().left - EDGE), true); });
    grip.addEventListener('pointerup', endDrag); grip.addEventListener('pointercancel', endDrag);
    grip.addEventListener('keydown', function (e) {
      var w = el.getBoundingClientRect().width, st = e.shiftKey ? 80 : 20;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setW(w + st); else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setW(w - st); else return;
      e.preventDefault(); save();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (!state.min) { toggleMin(); e.stopPropagation(); } }
    });
    $('.htp-bclose', el).onclick = close;
    $('.htp-bmin', el).onclick = toggleMin;
    $('.htp-pp', el).onclick = function () { vid.paused ? vid.play() : vid.pause(); };
    $('.htp-bsteps', el).onclick = function () { state.hideSteps = !state.hideSteps; applySteps(); fit(); save(); };
    $('.htp-bsize', el).onclick = function () {
      var w = el.getBoundingClientRect().width, vw = innerWidth - 2 * EDGE;
      var next = w < 340 ? SIZES.M : (w < 560 ? SIZES.L : SIZES.S);
      setW(next); msg(next === SIZES.S ? 'Small' : next === SIZES.M ? 'Medium' : 'Large'); save();
    };
    $('.htp-bback', el).onclick = function () { vid.currentTime = Math.max(0, vid.currentTime - 10); };
    $('.htp-bfwd', el).onclick = function () { vid.currentTime = Math.min(vid.duration || 1e9, vid.currentTime + 10); };
    var speeds = [1, 1.25, 1.5, 0.75];
    $('.htp-bspeed', el).onclick = function () {
      var i = (speeds.indexOf(vid.playbackRate) + 1) % speeds.length; vid.playbackRate = speeds[i]; this.textContent = speeds[i] + '×'; msg('Speed ' + speeds[i] + '×');
    };
    $('.htp-bcc', el).onclick = cycleCaptions;
    var bp = $('.htp-bpip', el);
    if (document.pictureInPictureEnabled && vid.requestPictureInPicture && !vid.disablePictureInPicture) bp.hidden = false;
    else if (vid.webkitSupportsPresentationMode && vid.webkitSupportsPresentationMode('picture-in-picture')) bp.hidden = false;
    bp.onclick = function () {
      try {
        if (document.pictureInPictureElement) document.exitPictureInPicture();
        else if (vid.requestPictureInPicture) vid.requestPictureInPicture().catch(function () { msg('Pop-out is not available here.'); });
        else vid.webkitSetPresentationMode(vid.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
      } catch (_) { msg('Pop-out is not available here.'); }
    };
    vid.addEventListener('enterpictureinpicture', function () { el.classList.add('htp-pip'); });
    vid.addEventListener('leavepictureinpicture', function () { el.classList.remove('htp-pip'); });
    vid.addEventListener('webkitpresentationmodechanged', function () { el.classList.toggle('htp-pip', vid.webkitPresentationMode === 'picture-in-picture'); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (!drag) fit(); }).observe(el);
    vid.addEventListener('timeupdate', onTime);
    ['play', 'pause'].forEach(function (n) { vid.addEventListener(n, syncPP); });
    vid.addEventListener('ended', function () { save(); });
    vid.addEventListener('error', function () { msg('This video could not be loaded.'); });
    window.addEventListener('resize', function () { fit(); });
    window.addEventListener('orientationchange', function () { setTimeout(fit, 250); });
    window.addEventListener('pagehide', save);
    document.addEventListener('keydown', function (e) {
      if (el.hidden || !e.altKey) return;
      if (e.key.toLowerCase() === 'v') { toggleMin(); e.preventDefault(); }
    });
  }

  function endDrag(e) { if (drag) { try { e.target.releasePointerCapture(drag.id); } catch (_) { } } drag = null; save(); }
  function place(x, y) {
    var r = el.getBoundingClientRect(), w = r.width, h = r.height;
    x = w <= innerWidth - 2 * EDGE ? clamp(x, EDGE, innerWidth - EDGE - w) : clamp(x, EDGE - w + 90, innerWidth - 90); y = h <= innerHeight - 2 * EDGE ? clamp(y, EDGE, innerHeight - EDGE - h) : clamp(y, 0, innerHeight - 48);
    el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; state.x = x; state.y = y;
  }
  function setW(w, keepLeft) {
    var max = innerWidth - 2 * EDGE; w = clamp(w, Math.min(240, max), Math.min(1000, max));
    el.style.width = w + 'px'; state.w = w; el.classList.toggle('htp-wide', w >= 600);
    var g = $('.htp-grip', el); g.setAttribute('aria-valuenow', Math.round(w)); if (!keepLeft) fit();
  }
  function fit() {
    if (el.hidden) return;
    var max = innerWidth - 2 * EDGE;
    if (state.w) { var w = clamp(state.w, Math.min(240, max), Math.min(1000, max)); el.style.width = w + 'px'; el.classList.toggle('htp-wide', w >= 600); }
    var r = el.getBoundingClientRect();
    var x = r.width <= innerWidth - 2 * EDGE ? clamp(r.left, EDGE, innerWidth - EDGE - r.width) : clamp(r.left, EDGE - r.width + 90, innerWidth - 90);
    var y = r.height <= innerHeight - 2 * EDGE ? clamp(r.top, EDGE, innerHeight - EDGE - r.height) : 0;
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }
  function toggleMin() {
    state.min = !state.min; el.classList.toggle('htp-min', state.min);
    var b = $('.htp-bmin', el); b.innerHTML = state.min ? I.max : I.min; b.setAttribute('aria-label', state.min ? 'Open the video again' : 'Minimise. The sound keeps playing.');
    if (state.min && document.activeElement && el.contains(document.activeElement) && document.activeElement !== b) b.focus();
    fit(); save();
  }
  function syncPP() { var b = $('.htp-pp', el); b.innerHTML = vid.paused ? I.play : I.pause; b.setAttribute('aria-label', vid.paused ? 'Play' : 'Pause'); }

  /* ---------- captions ---------- */
  function ttracks() { return Array.prototype.filter.call(vid.textTracks, function (t) { return t.kind === 'captions' || t.kind === 'subtitles'; }); }
  function setCaps(idx) { // idx -1 = off
    ttracks().forEach(function (t, i) { t.mode = (i === idx) ? 'showing' : 'disabled'; });
    state.cc = idx; var b = $('.htp-bcc', el); b.setAttribute('aria-pressed', idx >= 0 ? 'true' : 'false');
    var t = ttracks()[idx]; b.setAttribute('aria-label', idx >= 0 ? 'Captions on: ' + (t && t.label || '') : 'Captions off');
  }
  function cycleCaptions() {
    var n = ttracks().length; if (!n) { msg('No captions for this video.'); return; }
    var next = state.cc + 1; if (next >= n) next = -1; setCaps(next);
    msg(next < 0 ? 'Captions off' : 'Captions: ' + ttracks()[next].label);
  }

  /* ---------- steps ---------- */
  function applySteps() {
    var ol = $('.htp-steps', el), on = steps.length && !state.hideSteps;
    ol.hidden = !on; $('.htp-bsteps', el).setAttribute('aria-pressed', on ? 'true' : 'false');
    $('.htp-bsteps', el).hidden = !steps.length;
  }
  function renderSteps() {
    var ol = $('.htp-steps', el); ol.innerHTML = ''; stepEls = [];
    steps.forEach(function (s, i) {
      var li = mk('li'), b = mk('button', 'htp-step',
        '<span class="htp-n">' + (i + 1) + '</span><span><span class="htp-st">' + esc(s.title) + '</span>' + (s.text ? '<span class="htp-sx">' + esc(s.text) + '</span>' : '') + '</span><span class="htp-tm">' + fmt(s.t) + '</span>');
      b.type = 'button'; b.onclick = function () { vid.currentTime = s.t + 0.01; if (vid.paused) vid.play().catch(function () { }); };
      li.appendChild(b); ol.appendChild(li); stepEls.push(b);
    });
    applySteps(); onTime(true);
  }
  function onTime(force) {
    var t = vid.currentTime || 0, cur = -1;
    for (var i = 0; i < steps.length; i++) if (steps[i].t <= t + 0.25) cur = i;
    if (cur !== onTime.cur || force === true) {
      onTime.cur = cur;
      stepEls.forEach(function (b, i) { if (i === cur) { b.setAttribute('aria-current', 'step'); var ol = b.parentNode.parentNode, top = b.parentNode.offsetTop; if (top < ol.scrollTop || top + b.offsetHeight > ol.scrollTop + ol.clientHeight) ol.scrollTop = top - 8; } else b.removeAttribute('aria-current'); });
    }
    if (Date.now() - saveT > 1500) save();
  }

  /* ---------- state ---------- */
  function save() {
    saveT = Date.now(); if (!el || el.hidden || !state.src) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ o: state.opts, t: vid.currentTime || 0, x: state.x, y: state.y, w: state.w, min: state.min, hs: state.hideSteps, cc: state.cc })); } catch (_) { }
  }
  function clearSaved() { try { sessionStorage.removeItem(KEY); } catch (_) { } }

  function open(o, resume) {
    if (!o || !o.src) return;
    if (!el) build();
    var keepPos = !el.hidden;
    state.opts = o; state.src = o.src; state.cc = -1;
    if (document.pictureInPictureElement) { try { document.exitPictureInPicture(); } catch (_) { } }
    vid.pause(); vid.removeAttribute('src');
    Array.prototype.forEach.call(vid.querySelectorAll('track'), function (t) { t.remove(); });
    vid.src = o.src; if (o.poster) vid.poster = o.poster; else vid.removeAttribute('poster');
    tracks = o.tracks || [];
    tracks.forEach(function (tr, i) {
      var t = mk('track'); t.kind = 'captions'; t.src = tr.src; t.srclang = tr.srclang || 'en'; t.label = tr.label || tr.srclang || 'English'; if (i === 0) t.default = true; vid.appendChild(t);
    });
    $('.htp-title', el).textContent = o.title || 'How-to video';
    el.setAttribute('aria-label', 'How-to video: ' + (o.title || ''));
    steps = (o.steps || []).slice().sort(function (a, b) { return a.t - b.t; });
    onTime.cur = -2; renderSteps();
    if (!steps.length && o.stepsSrc) {
      fetch(o.stepsSrc).then(function (r) { return r.text(); }).then(function (txt) { steps = parseVtt(txt); renderSteps(); }).catch(function () { });
    }
    el.hidden = false; vid.playbackRate = 1; $('.htp-bspeed', el).textContent = '1×'; syncPP();
    // caption default: first track on
    setTimeout(function () { var n = ttracks().length; if (n) setCaps(resume && resume.cc != null ? resume.cc : 0); else setCaps(-1); }, 60);
    var vw = innerWidth, w = (resume && resume.w) || (keepPos && state.w) || (vw < 480 ? vw - 2 * EDGE : SIZES.M);
    state.hideSteps = resume ? !!resume.hs : (keepPos ? state.hideSteps : false);
    el.classList.remove('htp-min'); state.min = false; $('.htp-bmin', el).innerHTML = I.min;
    setW(w); applySteps();
    if (resume && resume.x != null) { place(resume.x, resume.y); }
    else if (!keepPos) { // bottom-right, clear of page chrome
      var r = el.getBoundingClientRect(); place(innerWidth - r.width - 12, innerHeight - r.height - 12);
    }
    if (resume && resume.min) toggleMin();
    var start = o.start || (resume && resume.t) || 0;
    var go = function () { if (start) try { vid.currentTime = start; } catch (_) { } if (!resume && o.autoplay !== false) vid.play().catch(function () { msg('Tap play to start.'); }); else if (resume) msg('Tap play to carry on.'); };
    if (vid.readyState >= 1) go(); else vid.addEventListener('loadedmetadata', function f() { vid.removeEventListener('loadedmetadata', f); go(); });
    fit(); save();
    document.dispatchEvent(new CustomEvent('htp:open', { detail: o }));
    var bar = $('.htp-bar', el); if (!resume) bar.focus({ preventScroll: true });
  }
  function close() {
    if (!el) return; vid.pause(); if (document.pictureInPictureElement) { try { document.exitPictureInPicture(); } catch (_) { } }
    el.hidden = true; state.src = null; clearSaved(); document.dispatchEvent(new CustomEvent('htp:close'));
  }

  /* ---------- turn page markup into players ---------- */
  function J(s, d) { if (!s) return d; try { return JSON.parse(s); } catch (_) { return d; } }
  function optsFrom(n) { // n = <a>, or <video>
    var d = n.dataset, src = d.src || n.getAttribute('href') || n.currentSrc || n.getAttribute('src');
    if (!src) { var s = n.querySelector && n.querySelector('source[type="video/mp4"],source'); if (s) src = s.getAttribute('src'); }
    var tr = J(d.tracks, null);
    if (!tr) { tr = []; if (d.vtt) tr.push({ src: d.vtt, srclang: d.lang || document.documentElement.lang || 'en', label: d.langLabel || 'English' });
      if (n.querySelectorAll) Array.prototype.forEach.call(n.querySelectorAll('track[kind="captions"],track[kind="subtitles"]'), function (t) { tr.push({ src: t.getAttribute('src'), srclang: t.srclang, label: t.label }); }); }
    var stepsSrc = d.stepsSrc; if (!stepsSrc && n.querySelector) { var ch = n.querySelector('track[kind="chapters"]'); if (ch) stepsSrc = ch.getAttribute('src'); }
    return { src: src, title: d.title || n.getAttribute('title') || n.getAttribute('aria-label') || (n.textContent || '').trim().slice(0, 80), poster: d.poster || n.getAttribute('poster') || '', tracks: tr, steps: J(d.steps, null), stepsSrc: stepsSrc };
  }
  function enhance(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('a[data-howto]:not([data-htp])'), function (a) {
      a.setAttribute('data-htp', '1'); a.addEventListener('click', function (e) { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); open(optsFrom(a)); });
    });
    Array.prototype.forEach.call((root || document).querySelectorAll('video:not([data-htp])'), function (v) {
      if (el && el.contains(v)) return; v.setAttribute('data-htp', '1');
      if (v.dataset.howto === 'off') return;
      var wrap = mk('div', 'htp-wrap'); v.parentNode.insertBefore(wrap, v); wrap.appendChild(v);
      var b = mk('button', 'htp-float', 'Float this video'); b.type = 'button';
      b.setAttribute('aria-label', 'Float this video on top of the page so you can follow the steps');
      b.onclick = function () { var o = optsFrom(v); o.start = v.currentTime || 0; v.pause(); open(o); };
      wrap.appendChild(b);
      if (v.dataset.autofloat !== 'off' && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { en.forEach(function (x) { if (!x.isIntersecting && !v.paused && !v.ended) { var o = optsFrom(v); o.start = v.currentTime || 0; v.pause(); open(o); } }); }, { threshold: 0.15 }).observe(v);
      }
    });
  }

  function init() {
    enhance();
    if ('MutationObserver' in window) new MutationObserver(function () { clearTimeout(init.h); init.h = setTimeout(enhance, 200); }).observe(document.body, { childList: true, subtree: true });
    var s; try { s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (_) { }
    if (s && s.o && s.o.src) open(s.o, s);
  }
  window.HowtoPlayer = { open: open, close: close, minimise: function () { if (el && !state.min) toggleMin(); }, enhance: enhance };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
