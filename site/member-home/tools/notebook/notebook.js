/*
 * Smart notebook: write with pen or finger, turn writing into typed text, and record sound that
 * stays linked to what was written. Tap any word or line later and the recording jumps there.
 *
 * Everything runs and is stored on this device (IndexedDB). Nothing is sent to our server.
 * Writing-to-text uses the browser's own handwriting reader when it has one; otherwise a free
 * reader (Tesseract, in notebook/reader/) is loaded from our own server and runs on the device.
 *
 * Mounts into <div id="nb-app" data-viewer="..." data-reader="/notebook/reader/">.
 */
(function () {
  'use strict';

  const W = 1000, H = 1414;                 // logical page size (A4 shape); strokes are stored in these units
  const COLORS = ['#111827', '#1d4ed8', '#b91c1c', '#047857', '#7c3aed'];
  const SIZES = [2, 4, 8];
  const PAPERS = ['lined', 'grid', 'dots', 'plain'];

  const root = document.getElementById('nb-app');
  if (!root) return;

  // Where the reader files live; absolute, because the reader's worker resolves paths from its own URL.
  const READER = new URL(root.dataset.reader || '/notebook/reader/', location.href).href;

  /* ---------- storage (IndexedDB, on this device only) ---------- */

  let dbp = null;
  function db() {
    if (!dbp) {
      dbp = new Promise((ok, fail) => {
        const r = indexedDB.open('smart-notebook', 1);
        r.onupgradeneeded = () => {
          r.result.createObjectStore('notes', { keyPath: 'id' });
          r.result.createObjectStore('audio');
        };
        r.onsuccess = () => ok(r.result);
        r.onerror = () => fail(r.error);
      });
    }
    return dbp;
  }
  async function tx(store, mode, fn) {
    const d = await db();
    return new Promise((ok, fail) => {
      const t = d.transaction(store, mode);
      const res = fn(t.objectStore(store));
      t.oncomplete = () => ok(res && 'result' in res ? res.result : res);
      t.onerror = () => fail(t.error);
    });
  }
  const allNotes = () => tx('notes', 'readonly', s => s.getAll());
  const putNote = n => tx('notes', 'readwrite', s => s.put(n));
  const delNote = id => tx('notes', 'readwrite', s => s.delete(id));
  const putAudio = (k, blob) => tx('audio', 'readwrite', s => s.put(blob, k));
  const getAudio = k => tx('audio', 'readonly', s => s.get(k));
  const delAudio = k => tx('audio', 'readwrite', s => s.delete(k));

  /* ---------- helpers ---------- */

  const $ = (sel, el = root) => el.querySelector(sel);
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'class') e.className = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : String(k));
    return e;
  }
  /** A button that asks "Tap again to ..." before acting, instead of a pop-up box. */
  function twoStep(label, sure, action) {
    let armed = null;
    const b = h('button', { class: 'nb-btn danger', onclick: () => {
      if (armed) { clearTimeout(armed); armed = null; action(); return; }
      b.textContent = sure;
      armed = setTimeout(() => { armed = null; b.textContent = label; }, 4000);
    } }, label);
    return b;
  }
  const demo = root.dataset.demo === 'true';
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clock = s => {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  let toastTimer;
  function toast(msg) {
    const t = $('.nb-toast') || root.appendChild(h('div', { class: 'nb-toast', role: 'status', 'aria-live': 'polite' }));
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 3500);
  }
  function newNote() {
    const now = Date.now();
    return {
      id: uid(), title: 'Untitled note', subject: '', created: now, updated: now, paper: 'lined',
      pages: [{ strokes: [], bg: null }], blocks: [{ id: uid(), text: '', r: null, t: null }],
      recordings: [], transcript: [], marks: []
    };
  }

  /* ---------- state ---------- */

  let notes = [];
  let note = null;          // the open note
  let pageIx = 0;
  let saveTimer = null;
  const ui = { tool: 'pen', color: COLORS[0], size: 1, fingerDraws: true, penSeen: false, listen: false, query: '', subject: '' };
  const undo = [], redo = [];
  let selection = null;     // {x0,y0,x1,y1} in page units

  function save() {
    if (!note) return;
    note.updated = Date.now();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => putNote(note).catch(() => toast('Could not save on this device.')), 500);
  }

  /* ---------- sound: recording and playback ---------- */

  const audio = new Audio();
  audio.preload = 'auto';
  let loadedRec = -1;
  const rec = { mr: null, chunks: [], start: 0, pausedAt: 0, pausedTotal: 0, ix: -1, speech: null, live: false };

  const recording = () => rec.mr && rec.mr.state !== 'inactive';
  function recTime() {
    if (!recording()) return null;
    const now = rec.mr.state === 'paused' ? rec.pausedAt : performance.now();
    return (now - rec.start - rec.pausedTotal) / 1000;
  }
  /** Time stamp for something written now: the live recording, or the recording being played. */
  function stamp() {
    if (recording()) return { r: rec.ix, t: recTime() };
    if (loadedRec >= 0 && !audio.paused) return { r: loadedRec, t: audio.currentTime };
    return { r: null, t: null };
  }

  async function startRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      toast('This browser cannot record sound. Try Chrome, Edge or Safari.');
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      toast('Sound recording was not allowed. You can still add a sound file with "Add sound file".');
      return;
    }
    const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported(t)) || '';
    rec.mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    rec.chunks = [];
    rec.ix = note.recordings.length;
    rec.pausedTotal = 0;
    note.recordings.push({ at: Date.now(), duration: 0, type: rec.mr.mimeType || type || 'audio/webm', name: 'Recording ' + (rec.ix + 1) });
    const myNote = note, myIx = rec.ix;
    rec.mr.ondataavailable = e => e.data.size && rec.chunks.push(e.data);
    rec.mr.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(rec.chunks, { type: myNote.recordings[myIx].type });
      await putAudio(myNote.id + ':' + myIx, blob);
      if (note === myNote) { save(); loadRecording(myIx); renderPlayer(); }
      else putNote(myNote);
    };
    rec.mr.start(1000);
    rec.start = performance.now();
    if (ui.liveWords) startSpeech();
    tickRecording();
    renderPlayer();
  }
  function pauseRecording() {
    if (!recording()) return;
    if (rec.mr.state === 'recording') { rec.mr.pause(); rec.pausedAt = performance.now(); stopSpeech(); }
    else { rec.pausedTotal += performance.now() - rec.pausedAt; rec.mr.resume(); if (ui.liveWords) startSpeech(); }
    renderPlayer();
  }
  function stopRecording() {
    if (!recording()) return;
    note.recordings[rec.ix].duration = recTime();
    stopSpeech();
    rec.mr.stop();
    toast('Recording saved. Tap any writing to hear that moment.');
  }
  function tickRecording() {
    if (!recording()) return;
    const el = $('.nb-rec-time');
    if (el) el.textContent = clock(recTime());
    setTimeout(tickRecording, 500);
  }

  // Live words: the browser's own speech-to-text, where it has one. Each line keeps its time.
  function startSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast('Live words are not offered by this browser. The sound is still recorded.'); ui.liveWords = false; return; }
    const sr = new SR();
    sr.continuous = true;
    sr.interimResults = false;
    sr.lang = lang().speech;
    let heardAt = recTime();
    sr.onspeechstart = () => (heardAt = recTime());
    sr.onresult = e => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (!e.results[i].isFinal) continue;
        const text = e.results[i][0].transcript.trim();
        if (text) note.transcript.push({ r: rec.ix, t: Math.max(0, heardAt ?? recTime()), text });
        heardAt = recTime();
      }
      save();
      renderSide();
    };
    sr.onend = () => { if (rec.speech === sr && recording() && rec.mr.state === 'recording') try { sr.start(); } catch (e) { /* already running */ } };
    rec.speech = sr;
    try { sr.start(); } catch (e) { /* ignore */ }
  }
  function stopSpeech() {
    const sr = rec.speech;
    rec.speech = null;
    if (sr) try { sr.stop(); } catch (e) { /* ignore */ }
  }

  async function loadRecording(ix) {
    if (ix === loadedRec && audio.src) return true;
    const blob = await getAudio(note.id + ':' + ix);
    if (!blob) { toast('That recording is not on this device.'); return false; }
    if (audio.src) URL.revokeObjectURL(audio.src);
    audio.src = URL.createObjectURL(blob);
    loadedRec = ix;
    return true;
  }
  async function playAt(r, t) {
    if (r == null || t == null) return;
    if (recording()) { toast('Stop recording first.'); return; }
    if (!(await loadRecording(r))) return;
    const go = () => { audio.currentTime = Math.max(0, t - 1.5); audio.play().catch(() => {}); };
    if (audio.readyState >= 1) go(); else audio.addEventListener('loadedmetadata', go, { once: true });
    renderPlayer();
  }
  function recDuration(ix) {
    const d = note.recordings[ix] && note.recordings[ix].duration;
    return isFinite(audio.duration) && loadedRec === ix && audio.duration > 0 ? audio.duration : d || 0;
  }

  async function addSoundFile(file) {
    if (!file) return;
    const ix = note.recordings.length;
    note.recordings.push({ at: Date.now(), duration: 0, type: file.type || 'audio/mpeg', name: file.name.slice(0, 60) });
    await putAudio(note.id + ':' + ix, file);
    await loadRecording(ix);
    audio.addEventListener('loadedmetadata', () => {
      if (isFinite(audio.duration)) { note.recordings[ix].duration = audio.duration; save(); renderPlayer(); }
    }, { once: true });
    save();
    renderPlayer();
    toast('Sound added. Press play, then write: your writing links to the moment you hear.');
  }

  audio.addEventListener('timeupdate', () => { updateTimeline(); if (ui.listen) drawPage(); });
  audio.addEventListener('play', () => renderPlayer());
  audio.addEventListener('pause', () => { renderPlayer(); drawPage(); });

  /* ---------- canvas: writing with pen or finger ---------- */

  let canvas, ctx, scale = 1, live = null, downAt = null, moved = false;

  function paper(c, kind, bg) {
    c.fillStyle = '#fffdf8';
    c.fillRect(0, 0, W, H);
    if (bg && bg.img) c.drawImage(bg.img, 0, 0, W, W * bg.img.height / bg.img.width);
    c.strokeStyle = '#dbe4f0';
    c.fillStyle = '#c3cfdf';
    c.lineWidth = 1;
    if (kind === 'lined') {
      for (let y = 120; y < H; y += 44) { c.beginPath(); c.moveTo(40, y); c.lineTo(W - 40, y); c.stroke(); }
      c.strokeStyle = '#f3c4c4';
      c.beginPath(); c.moveTo(110, 0); c.lineTo(110, H); c.stroke();
    } else if (kind === 'grid') {
      for (let x = 0; x < W; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
      for (let y = 0; y < H; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    } else if (kind === 'dots') {
      for (let x = 20; x < W; x += 40) for (let y = 20; y < H; y += 40) c.fillRect(x - 1.5, y - 1.5, 3, 3);
    }
  }
  function drawStroke(c, s, alpha) {
    const p = s.pts;
    if (!p.length) return;
    c.save();
    c.globalAlpha = (s.tool === 'hl' ? 0.35 : 1) * (alpha ?? 1);
    c.strokeStyle = s.c;
    c.fillStyle = s.c;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    if (p.length === 1) {
      c.beginPath(); c.arc(p[0][0], p[0][1], s.w * (0.5 + p[0][2]) / 2, 0, 7); c.fill();
    } else if (s.tool === 'hl') {
      c.lineWidth = s.w;
      c.beginPath(); c.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]);
      c.stroke();
    } else {
      for (let i = 1; i < p.length; i++) {
        c.lineWidth = s.w * (0.5 + (p[i][2] + p[i - 1][2]) / 2);
        c.beginPath();
        const a = p[i - 2] || p[i - 1], b = p[i - 1], d = p[i];
        c.moveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        c.quadraticCurveTo(b[0], b[1], (b[0] + d[0]) / 2, (b[1] + d[1]) / 2);
        c.stroke();
      }
    }
    c.restore();
  }
  const bgCache = new Map();
  function pageBg(pg) {
    if (!pg.bg) return null;
    let e = bgCache.get(pg.bg);
    if (!e) {
      e = { img: new Image() };
      e.img.onload = () => drawPage();
      e.img.src = pg.bg;
      bgCache.set(pg.bg, e);
    }
    return e.img.complete && e.img.naturalWidth ? e : null;
  }
  function drawPage() {
    if (!canvas || !note) return;
    const pg = note.pages[pageIx];
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    paper(ctx, note.paper, pageBg(pg));
    // While listening, writing not yet reached in the sound shows faint, like ink appearing again.
    const replay = ui.listen && loadedRec >= 0 && audio.src && (!audio.paused || audio.currentTime > 0);
    for (const s of pg.strokes) {
      const later = replay && s.r === loadedRec && s.t > audio.currentTime;
      drawStroke(ctx, s, later ? 0.18 : 1);
    }
    if (live) drawStroke(ctx, live);
    if (selection) {
      ctx.save();
      ctx.setLineDash([8, 6]); ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2;
      const r = norm(selection);
      ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
      ctx.restore();
    }
  }
  const norm = r => ({ x0: Math.min(r.x0, r.x1), y0: Math.min(r.y0, r.y1), x1: Math.max(r.x0, r.x1), y1: Math.max(r.y0, r.y1) });

  function sizeCanvas() {
    if (!canvas) return;
    const wrap = canvas.parentElement;
    const cssW = Math.min(wrap.clientWidth, 900);
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssW * H / W + 'px';
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssW * H / W * dpr);
    scale = canvas.width / W;
    drawPage();
  }
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5;
    return [Math.round((e.clientX - r.left) * W / r.width * 10) / 10, Math.round((e.clientY - r.top) * H / r.height * 10) / 10, Math.round(p * 100) / 100];
  }
  /** A finger that should scroll instead of write (the hand resting on the screen, for example). */
  function ignoreTouch(e) {
    return e.pointerType === 'touch' && (!ui.fingerDraws || ui.penSeen);
  }
  function nearestStroke(x, y, pg, onlyTimed) {
    let best = null, bestD = 30 * 30;
    for (const s of pg.strokes) {
      if (onlyTimed && s.t == null) continue;
      for (const p of s.pts) {
        const d = (p[0] - x) ** 2 + (p[1] - y) ** 2;
        if (d < bestD) { bestD = d; best = s; }
      }
    }
    return best;
  }
  function eraseAt(x, y, op) {
    const pg = note.pages[pageIx];
    for (let i = pg.strokes.length - 1; i >= 0; i--) {
      if (pg.strokes[i].pts.some(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 < 18 * 18)) {
        op.removed.push({ s: pg.strokes[i], i });
        pg.strokes.splice(i, 1);
      }
    }
  }
  let eraseOp = null;

  function onDown(e) {
    if (e.pointerType === 'pen' && !ui.penSeen) {
      ui.penSeen = true;
      toast('Pen found. Your finger now scrolls; only the pen writes.');
      renderTools();
    }
    if (ignoreTouch(e)) { canvas.style.touchAction = 'pan-y pinch-zoom'; return; }
    canvas.style.touchAction = 'none';
    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
    const p = pos(e);
    downAt = p; moved = false;
    if (ui.listen) return;
    if (ui.tool === 'eraser') { eraseOp = { type: 'erase', page: pageIx, removed: [] }; eraseAt(p[0], p[1], eraseOp); drawPage(); return; }
    if (ui.tool === 'select') { selection = { x0: p[0], y0: p[1], x1: p[0], y1: p[1] }; return; }
    const st = stamp();
    live = { tool: ui.tool === 'hl' ? 'hl' : 'pen', c: ui.color, w: ui.tool === 'hl' ? 26 : SIZES[ui.size], pts: [p], r: st.r, t: st.t };
    drawPage();
  }
  function onMove(e) {
    if (!downAt || ignoreTouch(e)) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs.length ? evs : [e]) {
      const p = pos(ev);
      if ((p[0] - downAt[0]) ** 2 + (p[1] - downAt[1]) ** 2 > 36) moved = true;
      if (ui.listen) continue;
      if (eraseOp) eraseAt(p[0], p[1], eraseOp);
      else if (selection && ui.tool === 'select') { selection.x1 = p[0]; selection.y1 = p[1]; }
      else if (live) live.pts.push(p);
    }
    drawPage();
  }
  function onUp(e) {
    if (!downAt) return;
    const p = downAt;
    downAt = null;
    if (ui.listen) {
      if (!moved) {
        const s = nearestStroke(p[0], p[1], note.pages[pageIx], true);
        if (s) playAt(s.r, s.t); else toast('No sound is linked to that spot.');
      }
      return;
    }
    if (eraseOp) {
      if (eraseOp.removed.length) { undo.push(eraseOp); redo.length = 0; save(); }
      eraseOp = null;
      return;
    }
    if (ui.tool === 'select') {
      if (!moved) selection = null;
      drawPage();
      renderTools();
      return;
    }
    if (live) {
      note.pages[pageIx].strokes.push(live);
      undo.push({ type: 'add', page: pageIx, s: live });
      redo.length = 0;
      live = null;
      save();
      drawPage();
      if (recording()) renderSide();
    }
  }
  function doUndo(from, to) {
    const op = from.pop();
    if (!op) return;
    const pg = note.pages[op.page];
    if (!pg) return;
    if (op.type === 'add') {
      const i = pg.strokes.indexOf(op.s);
      if (i >= 0) { pg.strokes.splice(i, 1); to.push({ type: 'erase', page: op.page, removed: [{ s: op.s, i }] }); }
    } else {
      for (const { s, i } of [...op.removed].reverse()) pg.strokes.splice(Math.min(i, pg.strokes.length), 0, s);
      to.push({ type: 'add-many', page: op.page, removed: op.removed });
    }
    save();
    drawPage();
  }
  // 'add-many' (from undoing a long erase) is undone by erasing the same strokes again.
  function undoAny(from, to) {
    const op = from[from.length - 1];
    if (op && op.type === 'add-many') {
      from.pop();
      const pg = note.pages[op.page];
      const removed = [];
      for (const { s } of op.removed) { const i = pg.strokes.indexOf(s); if (i >= 0) { pg.strokes.splice(i, 1); removed.push({ s, i }); } }
      to.push({ type: 'erase', page: op.page, removed });
      save(); drawPage();
      return;
    }
    doUndo(from, to);
  }

  /* ---------- handwriting to typed text ---------- */

  function chosenStrokes() {
    const pg = note.pages[pageIx];
    const ink = pg.strokes.filter(s => s.tool !== 'hl');
    if (!selection) return ink;
    const r = norm(selection);
    return ink.filter(s => s.pts.some(p => p[0] >= r.x0 && p[0] <= r.x1 && p[1] >= r.y0 && p[1] <= r.y1));
  }
  async function readWithBrowser(strokes) {
    if (!('createHandwritingRecognizer' in navigator)) return null;
    const langs = lang().hand;
    try {
      const ok = await navigator.queryHandwritingRecognizer({ languages: langs });
      if (!ok) return null;
      const reader = await navigator.createHandwritingRecognizer({ languages: langs });
      const drawing = reader.startDrawing({ recognitionType: 'text', inputType: ui.penSeen ? 'stylus' : 'touch' });
      for (const s of strokes) {
        const hs = new HandwritingStroke();
        s.pts.forEach((p, i) => hs.addPoint({ x: p[0], y: p[1], t: i * 10 }));
        drawing.addStroke(hs);
      }
      const out = await drawing.getPrediction();
      drawing.clear();
      reader.finish();
      return out && out[0] ? out[0].text : '';
    } catch (e) {
      return null;
    }
  }
  function loadScript(src) {
    return new Promise((ok, fail) => {
      if (window.Tesseract) return ok();
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.append(s);
    });
  }
  // Writing language: one choice for the writing reader, the browser's reader and live words.
  const LANGS = {
    en: { label: 'English', reader: 'eng', hand: ['en'], speech: 'en-IN' },
    hi: { label: 'हिन्दी (Hindi)', reader: 'hin', hand: ['hi'], speech: 'hi-IN' },
    both: { label: 'Hindi + English', reader: 'hin+eng', hand: ['hi', 'en'], speech: 'hi-IN' }
  };
  // A host that cannot serve .gz files gives data-reader-lang, a pattern with {lang}, one language at a time.
  const LANG_PATTERN = root.dataset.readerLang || '';
  const langChoices = () => Object.keys(LANGS).filter(k => !LANG_PATTERN || !LANGS[k].reader.includes('+'));
  const lang = () => LANGS[ui.lang] || LANGS.en;
  let readerWorker = null, readerLang = '';
  /** One reader per language per page visit; the first use loads it (English about 7 MB), then the browser caches it. */
  function tesseract() {
    const code = lang().reader;
    if (readerWorker && readerLang !== code) { readerWorker.then(w => w.terminate()).catch(() => {}); readerWorker = null; }
    if (!readerWorker) {
      readerLang = code;
      readerWorker = loadScript(READER + 'tesseract.min.js').then(() => window.Tesseract.createWorker(code.split('+'), 1, {
        workerPath: READER + 'worker.min.js',
        corePath: READER + 'tesseract-core-lstm.wasm.js',
        langPath: LANG_PATTERN ? new URL(LANG_PATTERN.replace('{lang}', code), location.href).href : READER.replace(/\/$/, ''),
        workerBlobURL: false,   // load the worker as a plain file from our own site, so strict page-security rules allow it
        gzip: true
      }));
      readerWorker.catch(() => { readerWorker = null; });
    }
    return readerWorker;
  }
  function setLang(k) {
    ui.lang = k;
    try { localStorage.setItem('nb-lang', k); } catch (e) { /* storage blocked */ }
  }
  async function readWithTesseract(strokes) {
    // Draw only the chosen ink, black on white, with some margin; that is what the reader sees.
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (const s of strokes) for (const p of s.pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    const m = 30, k = 1.5;
    const c = document.createElement('canvas');
    c.width = Math.ceil((x1 - x0 + 2 * m) * k);
    c.height = Math.ceil((y1 - y0 + 2 * m) * k);
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    g.setTransform(k, 0, 0, k, (m - x0) * k, (m - y0) * k);
    for (const s of strokes) drawStroke(g, { ...s, c: '#000', w: Math.max(s.w, 3) });
    const worker = await tesseract();
    const res = await worker.recognize(c);
    return (res.data.text || '').trim();
  }
  async function convert() {
    const strokes = chosenStrokes();
    if (!strokes.length) { toast('Nothing written here yet.'); return; }
    const box = $('.nb-convert');
    box.hidden = false;
    const out = $('.nb-convert textarea');
    out.value = 'Reading your writing...';
    let text = await readWithBrowser(strokes), failed = false;
    if (text == null) {
      try {
        // Some sites do not allow the reader to run. Find out at once, and never wait for ever.
        new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]));
        text = await Promise.race([readWithTesseract(strokes), new Promise((_, no) => setTimeout(() => no(new Error('slow')), 90000))]);
      } catch (e) { text = ''; failed = true; }
    }
    out.value = text || '';
    out.dataset.r = '';
    // The typed text keeps the time of the first stroke, so it plays from the same moment.
    const first = strokes.filter(s => s.t != null).sort((a, b) => a.t - b.t)[0];
    out.dataset.r = first ? first.r : '';
    out.dataset.t = first ? first.t : '';
    out.focus();
    if (failed) toast('The writing reader could not start here. Please type the words in the box.');
    else if (!text) toast('Nothing readable found. Write a little bigger, or type it in the box.');
  }
  function acceptConversion() {
    const out = $('.nb-convert textarea');
    const text = out.value.trim();
    if (text) {
      const b = { id: uid(), text, r: out.dataset.r === '' ? null : +out.dataset.r, t: out.dataset.t === '' ? null : +out.dataset.t, fromInk: true };
      const last = note.blocks[note.blocks.length - 1];
      if (last && !last.text) note.blocks.splice(note.blocks.length - 1, 0, b); else note.blocks.push(b);
      save();
      renderBlocks();
      toast('Added to your typed notes.');
    }
    $('.nb-convert').hidden = true;
    selection = null;
    drawPage();
    renderTools();
  }

  /* ---------- typed notes: one line each, each with its moment in the sound ---------- */

  function renderBlocks() {
    const list = $('.nb-blocks');
    if (!list) return;
    list.textContent = '';
    note.blocks.forEach((b, i) => {
      const ta = h('textarea', { rows: 1, class: 'nb-block', 'aria-label': 'Typed line ' + (i + 1), placeholder: i === note.blocks.length - 1 ? 'Type here (or write with your pen into this box on iPad)...' : '' });
      ta.value = b.text;
      const grow = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
      ta.addEventListener('input', () => {
        b.text = ta.value;
        if (b.t == null && b.text) {
          const st = stamp();
          if (st.t != null) { b.r = st.r; b.t = st.t; renderChip(row, b); }
        }
        grow();
        save();
      });
      ta.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const nb = { id: uid(), text: '', r: null, t: null };
          note.blocks.splice(i + 1, 0, nb);
          save(); renderBlocks();
          list.querySelectorAll('textarea')[i + 1].focus();
        } else if (e.key === 'Backspace' && !ta.value && note.blocks.length > 1) {
          e.preventDefault();
          note.blocks.splice(i, 1);
          save(); renderBlocks();
          const tas = list.querySelectorAll('textarea');
          tas[Math.max(0, i - 1)].focus();
        }
      });
      const row = h('div', { class: 'nb-line' + (b.fromInk ? ' from-ink' : '') }, h('span', { class: 'nb-chip-slot' }), ta);
      renderChip(row, b);
      list.append(row);
      requestAnimationFrame(grow);
    });
  }
  function renderChip(row, b) {
    const slot = row.querySelector('.nb-chip-slot');
    slot.textContent = '';
    if (b.t != null) slot.append(h('button', { class: 'nb-chip', title: 'Play from here', onclick: () => playAt(b.r, b.t) }, '▶ ' + clock(b.t)));
  }

  /* ---------- side panel: live words and bookmarks ---------- */

  function renderSide() {
    const tl = $('.nb-transcript');
    if (!tl) return;
    tl.textContent = '';
    if (!note.transcript.length) tl.append(h('p', { class: 'nb-muted' }, 'Spoken words appear here when "Live words" is on while recording.'));
    for (const w of note.transcript) {
      tl.append(h('button', { class: 'nb-word', onclick: () => playAt(w.r, w.t), title: 'Play from ' + clock(w.t) }, h('small', {}, clock(w.t)), ' ', w.text));
    }
    const ml = $('.nb-marks');
    ml.textContent = '';
    for (const m of note.marks) {
      ml.append(h('button', { class: 'nb-chip', onclick: () => playAt(m.r, m.t) }, '★ ' + clock(m.t) + (m.label ? ' ' + m.label : '')));
    }
  }
  function addMark() {
    const st = stamp();
    if (st.t == null) { toast('Bookmarks work while recording or playing.'); return; }
    note.marks.push({ r: st.r, t: st.t, label: 'Mark ' + (note.marks.length + 1) });
    toast('Bookmark added at ' + clock(st.t) + '.');
    save();
    renderSide();
    updateTimeline();
  }

  /* ---------- player bar ---------- */

  function renderPlayer() {
    const bar = $('.nb-player');
    if (!bar || !note) return;
    bar.textContent = '';
    if (recording()) {
      const paused = rec.mr.state === 'paused';
      bar.append(
        h('span', { class: 'nb-dot' + (paused ? ' paused' : '') }),
        h('span', { class: 'nb-rec-time', 'aria-live': 'off' }, clock(recTime())),
        h('button', { class: 'nb-btn', onclick: pauseRecording }, paused ? 'Resume' : 'Pause'),
        h('button', { class: 'nb-btn', onclick: addMark, title: 'Bookmark this moment' }, '★ Mark'),
        h('label', { class: 'nb-small' }, h('input', { type: 'checkbox', checked: ui.liveWords, onchange: e => { ui.liveWords = e.target.checked; e.target.checked ? startSpeech() : stopSpeech(); } }), ' Live words'),
        h('button', { class: 'nb-btn danger', onclick: stopRecording }, '■ Stop'));
      return;
    }
    const sel = h('select', { 'aria-label': 'Choose recording', onchange: e => { audio.pause(); loadRecording(+e.target.value).then(renderPlayer); } },
      note.recordings.map((r, i) => h('option', { value: i, selected: i === loadedRec }, (r.name || 'Recording ' + (i + 1)) + ' (' + clock(r.duration) + ')')));
    bar.append(h('button', { class: 'nb-btn rec', onclick: startRecording, title: 'Record sound linked to your writing' }, '● Record'));
    if (note.recordings.length) {
      if (loadedRec < 0) loadRecording(note.recordings.length - 1).then(renderPlayer);
      bar.append(
        sel,
        h('button', { class: 'nb-btn', onclick: () => { audio.currentTime = Math.max(0, audio.currentTime - 10); }, title: 'Back 10 seconds' }, '↺10'),
        h('button', { class: 'nb-btn play', onclick: () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()) }, audio.paused ? '▶ Play' : '❚❚ Pause'),
        h('div', { class: 'nb-timeline' },
          h('input', { type: 'range', min: 0, max: 1000, value: 0, 'aria-label': 'Position in recording', oninput: e => { audio.currentTime = e.target.value / 1000 * recDuration(loadedRec); if (ui.listen) drawPage(); } }),
          h('div', { class: 'nb-ticks' })),
        h('span', { class: 'nb-time' }, '0:00'),
        h('select', { 'aria-label': 'Speed', onchange: e => (audio.playbackRate = +e.target.value) },
          [1, 1.25, 1.5, 2, 0.75].map(v => h('option', { value: v, selected: audio.playbackRate === v }, v + '×'))),
        h('button', { class: 'nb-btn', onclick: addMark, title: 'Bookmark this moment' }, '★'));
      updateTimeline(true);
    } else {
      bar.append(h('span', { class: 'nb-muted' }, 'Press Record, then write or type. Later, tap any writing to hear that moment.'));
    }
    bar.append(h('label', { class: 'nb-btn file' }, 'Add sound file', h('input', { type: 'file', accept: 'audio/*', hidden: true, onchange: e => addSoundFile(e.target.files[0]) })));
  }
  function updateTimeline(rebuildTicks) {
    const range = $('.nb-timeline input');
    if (!note || !range || loadedRec < 0) return;
    const d = recDuration(loadedRec);
    if (d > 0) range.value = Math.round(audio.currentTime / d * 1000);
    const t = $('.nb-time');
    if (t) t.textContent = clock(audio.currentTime) + ' / ' + clock(d);
    const ticks = $('.nb-ticks');
    if (ticks && (rebuildTicks || !ticks.childElementCount) && d > 0) {
      ticks.textContent = '';
      const seen = new Set();
      for (const pg of note.pages) for (const s of pg.strokes) {
        if (s.r !== loadedRec || s.t == null) continue;
        const pct = Math.round(s.t / d * 200) / 2;
        if (seen.has(pct)) continue;
        seen.add(pct);
        ticks.append(h('i', { style: 'left:' + pct + '%' }));
      }
      for (const m of note.marks) if (m.r === loadedRec) ticks.append(h('b', { style: 'left:' + (m.t / d * 100) + '%', title: m.label || 'Bookmark' }));
    }
  }

  /* ---------- toolbar ---------- */

  function renderTools() {
    const bar = $('.nb-tools');
    if (!bar) return;
    bar.textContent = '';
    const tool = (id, label, icon) => h('button', {
      class: 'nb-tool' + (ui.tool === id && !ui.listen ? ' on' : ''), 'aria-pressed': ui.tool === id && !ui.listen, title: label,
      onclick: () => { ui.tool = id; ui.listen = false; if (id !== 'select') selection = null; renderTools(); drawPage(); }
    }, icon, h('span', {}, label));
    bar.append(
      tool('pen', 'Pen', '✎'), tool('hl', 'Highlighter', '▬'), tool('eraser', 'Eraser', '⌫'), tool('select', 'Select', '⬚'),
      h('button', { class: 'nb-tool' + (ui.listen ? ' on' : ''), 'aria-pressed': ui.listen, title: 'Tap writing to hear it', onclick: () => { ui.listen = !ui.listen; selection = null; renderTools(); drawPage(); } }, '▶', h('span', {}, 'Tap to hear')),
      h('span', { class: 'nb-sep' }),
      ...COLORS.map(c => h('button', { class: 'nb-color' + (ui.color === c ? ' on' : ''), style: 'background:' + c, 'aria-label': 'Colour', onclick: () => { ui.color = c; renderTools(); } })),
      h('span', { class: 'nb-sep' }),
      ...SIZES.map((s, i) => h('button', { class: 'nb-size' + (ui.size === i ? ' on' : ''), 'aria-label': 'Line size ' + (i + 1), onclick: () => { ui.size = i; renderTools(); } }, h('i', { style: 'width:' + (s + 4) + 'px;height:' + (s + 4) + 'px' }))),
      h('span', { class: 'nb-sep' }),
      h('button', { class: 'nb-tool', title: 'Undo', onclick: () => undoAny(undo, redo) }, '↶', h('span', {}, 'Undo')),
      h('button', { class: 'nb-tool', title: 'Redo', onclick: () => undoAny(redo, undo) }, '↷', h('span', {}, 'Redo')),
      h('button', { class: 'nb-tool strong', title: 'Turn writing into typed text', onclick: convert }, 'Aa', h('span', {}, selection ? 'To text (selected)' : 'To text')),
      h('select', { 'aria-label': 'Writing language', title: 'Language of your writing and speech', onchange: e => setLang(e.target.value) },
        langChoices().map(k => h('option', { value: k, selected: ui.lang === k }, LANGS[k].label))),
      h('label', { class: 'nb-small', title: 'When off, a finger scrolls and only a pen writes' },
        h('input', { type: 'checkbox', checked: ui.fingerDraws && !ui.penSeen, onchange: e => { ui.fingerDraws = e.target.checked; ui.penSeen = false; renderTools(); } }), ' Finger writes'));
  }

  /* ---------- pages ---------- */

  function renderPager() {
    const p = $('.nb-pager');
    p.textContent = '';
    p.append(
      h('button', { class: 'nb-btn', disabled: pageIx === 0, onclick: () => goPage(pageIx - 1) }, '‹'),
      h('span', {}, 'Page ' + (pageIx + 1) + ' of ' + note.pages.length),
      h('button', { class: 'nb-btn', disabled: pageIx >= note.pages.length - 1, onclick: () => goPage(pageIx + 1) }, '›'),
      h('button', { class: 'nb-btn', onclick: () => { note.pages.splice(pageIx + 1, 0, { strokes: [], bg: null }); save(); goPage(pageIx + 1); } }, '+ Page'),
      h('select', { 'aria-label': 'Paper', onchange: e => { note.paper = e.target.value; save(); drawPage(); } },
        PAPERS.map(k => h('option', { value: k, selected: note.paper === k }, k[0].toUpperCase() + k.slice(1) + ' paper'))),
      h('label', { class: 'nb-btn file', title: 'Put a photo or handout under your writing' }, 'Photo under page',
        h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: e => photoUnder(e.target.files[0]) })),
      note.pages.length > 1 ? twoStep('Delete page', 'Tap again to delete page', () => {
        note.pages.splice(pageIx, 1); save(); goPage(Math.min(pageIx, note.pages.length - 1));
      }) : '');
  }
  function goPage(i) {
    pageIx = i; selection = null; undo.length = 0; redo.length = 0;
    renderPager(); drawPage();
  }
  function photoUnder(file) {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      // Shrink to page width so the note stays light on the device.
      const c = document.createElement('canvas');
      c.width = Math.min(1400, img.width);
      c.height = Math.round(img.height * c.width / img.width);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      note.pages[pageIx].bg = c.toDataURL('image/jpeg', 0.8);
      save(); drawPage();
    };
    // Read the photo as a data address (not a blob address): strict page-security rules allow it.
    const fr = new FileReader();
    fr.onload = () => { img.src = fr.result; };
    fr.readAsDataURL(file);
  }

  /* ---------- note screen ---------- */

  function openNote(n) {
    if (recording()) stopRecording();
    audio.pause();
    if (audio.src) { URL.revokeObjectURL(audio.src); audio.removeAttribute('src'); }
    loadedRec = -1;
    note = n; pageIx = 0; selection = null; undo.length = 0; redo.length = 0; ui.listen = false;
    root.textContent = '';
    const title = h('input', { class: 'nb-title', value: n.title, 'aria-label': 'Note title', oninput: e => { n.title = e.target.value || 'Untitled note'; save(); } });
    const subject = h('input', { class: 'nb-subject', value: n.subject, placeholder: 'Subject (e.g. Training, Meetings)', list: 'nb-subjects', 'aria-label': 'Subject', oninput: e => { n.subject = e.target.value.trim(); save(); } });
    canvas = h('canvas', { class: 'nb-canvas', 'aria-label': 'Writing page. Write with a pen or finger.' });
    ctx = canvas.getContext('2d');
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    root.append(
      h('div', { class: 'nb-head' },
        h('button', { class: 'nb-btn', onclick: () => { if (recording()) stopRecording(); showList(); } }, '‹ All notes'),
        title, subject,
        h('datalist', { id: 'nb-subjects' }, [...new Set(notes.map(x => x.subject).filter(Boolean))].map(s => h('option', { value: s }))),
        demo ? '' : h('button', { class: 'nb-btn', onclick: () => printNote(n) }, 'Print / PDF'),
        twoStep('Delete note', 'Tap again to delete note', () => deleteNote(n))),
      h('div', { class: 'nb-player', role: 'region', 'aria-label': 'Sound' }),
      h('div', { class: 'nb-tools', role: 'toolbar', 'aria-label': 'Writing tools' }),
      h('div', { class: 'nb-main' },
        h('div', { class: 'nb-pagecol' },
          h('div', { class: 'nb-pager' }),
          h('div', { class: 'nb-canvas-wrap' }, canvas),
          h('div', { class: 'nb-convert', hidden: true },
            h('b', {}, 'Your writing as text. Fix anything, then add it.'),
            h('textarea', { rows: 4, 'aria-label': 'Converted text' }),
            h('div', {}, h('button', { class: 'nb-btn strong', onclick: acceptConversion }, 'Add to typed notes'),
              h('button', { class: 'nb-btn', onclick: () => { $('.nb-convert').hidden = true; } }, 'Cancel')))),
        h('aside', { class: 'nb-side' },
          h('h3', {}, 'Typed notes'),
          h('div', { class: 'nb-blocks' }),
          h('h3', {}, 'Bookmarks'),
          h('div', { class: 'nb-marks' }),
          h('h3', {}, 'Live words'),
          h('div', { class: 'nb-transcript' }))));
    renderTools(); renderPlayer(); renderPager(); renderBlocks(); renderSide();
    requestAnimationFrame(sizeCanvas);
  }

  /* ---------- list screen ---------- */

  function matches(n, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return [n.title, n.subject, ...n.blocks.map(b => b.text), ...n.transcript.map(t => t.text), ...n.marks.map(m => m.label)]
      .some(s => s && s.toLowerCase().includes(q));
  }
  async function showList() {
    if (note) { clearTimeout(saveTimer); await putNote(note); }
    if (demo && !localStorage.getItem('nb-demo-seeded')) await seedDemo();
    audio.pause();
    note = null; canvas = null;
    notes = (await allNotes()).sort((a, b) => b.updated - a.updated);
    root.textContent = '';
    const subjects = [...new Set(notes.map(n => n.subject).filter(Boolean))].sort();
    const grid = h('div', { class: 'nb-grid' });
    const fill = () => {
      grid.textContent = '';
      const shown = notes.filter(n => (!ui.subject || n.subject === ui.subject) && matches(n, ui.query));
      if (!shown.length) grid.append(h('p', { class: 'nb-muted' }, notes.length ? 'No note matches.' : 'No notes yet. Press "New note" to start.'));
      for (const n of shown) {
        const strokes = n.pages.reduce((a, p) => a + p.strokes.length, 0);
        const first = n.blocks.map(b => b.text).find(Boolean) || (n.transcript[0] && n.transcript[0].text) || '';
        grid.append(h('button', { class: 'nb-card', onclick: () => openNote(n) },
          h('b', {}, n.title),
          h('small', {}, new Date(n.updated).toLocaleString() + (n.subject ? ' · ' + n.subject : '')),
          h('span', { class: 'nb-snip' }, first.slice(0, 120)),
          h('span', { class: 'nb-badges' },
            n.pages.length + (n.pages.length === 1 ? ' page' : ' pages'),
            strokes ? ' · ✎ ' + strokes : '',
            n.recordings.length ? ' · 🎙 ' + n.recordings.length : '')));
      }
    };
    root.append(
      h('div', { class: 'nb-head' },
        h('h2', {}, 'My notes'),
        h('button', { class: 'nb-btn strong', onclick: () => { const n = newNote(); notes.unshift(n); putNote(n); openNote(n); } }, '+ New note'),
        h('input', { type: 'search', class: 'nb-search', placeholder: 'Search words, typed text and spoken words', value: ui.query, 'aria-label': 'Search notes', oninput: e => { ui.query = e.target.value; fill(); } })),
      subjects.length ? h('div', { class: 'nb-subjects' },
        h('button', { class: 'nb-chip' + (!ui.subject ? ' on' : ''), onclick: () => { ui.subject = ''; showList(); } }, 'All'),
        subjects.map(s => h('button', { class: 'nb-chip' + (ui.subject === s ? ' on' : ''), onclick: () => { ui.subject = s; showList(); } }, s))) : '',
      grid,
      h('details', { class: 'nb-help', open: demo || !notes.length },
        h('summary', {}, 'How to use (5 steps)'),
        h('ol', {},
          h('li', {}, 'Press "+ New note".'),
          h('li', {}, 'Press "● Record" if you want the sound (a class, a meeting, a call on speaker).'),
          h('li', {}, 'Write on the page with your finger or any pen, or type on the right.'),
          h('li', {}, 'Press "Aa To text" to turn your writing into typed text. Fix it and press "Add".'),
          h('li', {}, 'Later, press "▶ Tap to hear" and tap any writing, or tap any ▶ time next to typed lines. The sound jumps to that moment.')),
        h('p', { class: 'nb-muted' }, 'Works on any phone, tablet or computer browser. No special pen or paper needed. Notes stay on this device; use "Back up" to keep a copy or move them to another device.')),
      demo ? '' : h('div', { class: 'nb-foot' },
        h('button', { class: 'nb-btn', onclick: backup }, 'Back up all notes'),
        h('label', { class: 'nb-btn file' }, 'Bring back from backup', h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: e => restore(e.target.files[0]) }))));
    fill();
  }
  async function deleteNote(n) {
    if (recording()) stopRecording();
    clearTimeout(saveTimer);
    note = null;
    await delNote(n.id);
    for (let i = 0; i < n.recordings.length; i++) await delAudio(n.id + ':' + i);
    showList();
  }

  /* ---------- backup, restore, print ---------- */

  const blobToData = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });
  async function backup() {
    const all = await allNotes();
    const sounds = {};
    for (const n of all) for (let i = 0; i < n.recordings.length; i++) {
      const b = await getAudio(n.id + ':' + i);
      if (b) sounds[n.id + ':' + i] = await blobToData(b);
    }
    const file = new Blob([JSON.stringify({ kind: 'smart-notebook-backup', version: 1, at: new Date().toISOString(), notes: all, sounds })], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(file), download: 'my-notes-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.append(a); a.click(); a.remove();
    toast('Backup file saved. Keep it somewhere safe.');
  }
  async function restore(file) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.kind !== 'smart-notebook-backup' || !Array.isArray(data.notes)) throw new Error('not a backup');
      let added = 0;
      for (const n of data.notes) {
        if (!n || typeof n.id !== 'string' || !Array.isArray(n.pages)) continue;
        await putNote(n);
        added++;
      }
      for (const [k, v] of Object.entries(data.sounds || {})) {
        if (typeof v === 'string' && v.startsWith('data:audio/')) await putAudio(k, await (await fetch(v)).blob());
      }
      toast(added + ' notes brought back.');
      showList();
    } catch (e) {
      toast('That file is not a notes backup.');
    }
  }
  function printNote(n) {
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const g = off.getContext('2d');
    const imgs = n.pages.map(pg => { paper(g, n.paper, pageBg(pg)); pg.strokes.forEach(s => drawStroke(g, s)); return off.toDataURL('image/png'); });
    const win = window.open('', '_blank');
    if (!win) { toast('Allow pop-ups to print.'); return; }
    const d = win.document;
    d.title = n.title;
    const style = d.createElement('style');
    style.textContent = 'body{font:14px/1.5 system-ui,sans-serif;margin:24px;color:#111}img{width:100%;max-width:800px;display:block;margin:0 auto 16px;border:1px solid #ddd;page-break-after:always}small{color:#666}';
    d.head.append(style);
    const add = (tag, text) => { const e = d.createElement(tag); e.textContent = text; d.body.append(e); return e; };
    add('h1', n.title);
    add('small', (n.subject ? n.subject + ' · ' : '') + new Date(n.updated).toLocaleString() + ' · ' + (root.dataset.viewer || ''));
    imgs.forEach(src => { const i = d.createElement('img'); i.src = src; i.alt = 'Handwritten page'; d.body.append(i); });
    if (n.blocks.some(b => b.text)) { add('h2', 'Typed notes'); n.blocks.filter(b => b.text).forEach(b => add('p', (b.t != null ? '[' + clock(b.t) + '] ' : '') + b.text)); }
    if (n.transcript.length) { add('h2', 'Spoken words'); n.transcript.forEach(w => add('p', '[' + clock(w.t) + '] ' + w.text)); }
    setTimeout(() => win.print(), 400);
  }

  /** Preview only: one example note so the first screen shows what the notebook does. */
  async function seedDemo() {
    try { localStorage.setItem('nb-demo-seeded', '1'); } catch (e) { /* storage blocked */ }
    const n = newNote();
    n.title = 'Example: site visit notes';
    n.subject = 'Example';
    const wave = (x, y, len) => { const pts = []; for (let i = 0; i <= len; i += 6) pts.push([x + i, y + Math.sin(i / 9) * 7, 0.5]); return pts; };
    n.pages[0].strokes = [
      { tool: 'pen', c: '#1d4ed8', w: 4, pts: wave(130, 150, 360), r: null, t: null },
      { tool: 'pen', c: '#111827', w: 4, pts: wave(130, 238, 520), r: null, t: null },
      { tool: 'pen', c: '#111827', w: 4, pts: wave(130, 282, 430), r: null, t: null },
      { tool: 'hl', c: '#f59e0b', w: 26, pts: [[125, 282, .5], [560, 282, .5]], r: null, t: null },
      { tool: 'pen', c: '#b91c1c', w: 4, pts: wave(130, 370, 300), r: null, t: null }];
    n.blocks = [
      { id: uid(), text: 'Example lines. Your own notes replace these.', r: null, t: null },
      { id: uid(), text: 'Main board: check the cable size before ordering.', r: null, t: null, fromInk: true },
      { id: uid(), text: '', r: null, t: null }];
    await putNote(n);
  }

  /* ---------- start ---------- */

  window.addEventListener('resize', () => { if (canvas) sizeCanvas(); });
  document.addEventListener('keydown', e => {
    if (!note || e.target.closest('input,textarea,select')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undoAny(e.shiftKey ? redo : undo, e.shiftKey ? undo : redo); }
  });
  window.addEventListener('pagehide', () => { if (note) putNote(note); });
  try { ui.lang = localStorage.getItem('nb-lang') || ''; } catch (e) { ui.lang = ''; }
  if (!langChoices().includes(ui.lang)) ui.lang = (root.dataset.lang || navigator.language || '').startsWith('hi') ? 'hi' : 'en';
  if (!window.indexedDB) { root.textContent = 'This browser cannot keep notes on the device. Please use Chrome, Edge, Safari or Firefox.'; return; }
  showList();
})();
