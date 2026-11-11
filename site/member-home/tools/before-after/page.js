// Before and after slider: the page around the picture.
// Lets a member put in two own pictures, add numbered notes, and download everything as one page.
// Pictures and notes are kept in this browser only (IndexedDB). Nothing is sent anywhere.
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var MAX_SIDE = 1800;

  function sample() {
    return {
      own: false,
      title: 'Room makeover: before and after',
      before: 'sample/before.svg',
      after: 'sample/after.svg',
      ratio: 1.6, ratioB: 1.6, ratioA: 1.6,
      notes: [
        { x: 37, y: 37, title: 'Window', text: 'The heavy dark curtains are gone. Light white curtains let the daylight in. The window itself did not move.' },
        { x: 45, y: 87, title: 'Floor', text: 'The worn brown carpet is replaced with light wood and one pale rug.' },
        { x: 50, y: 21, title: 'Light', text: 'The bare bulb is replaced with a blue hanging lamp that gives a soft, warm light.' },
        { x: 64, y: 60, title: 'Sofa', text: 'Same place, same size. The old brown sofa is replaced with a blue one and two cushions.' },
        { x: 78, y: 32, title: 'Walls', text: 'Cracks and the damp patch are repaired. The walls are painted warm ivory, which makes the room look bigger.' }
      ]
    };
  }

  // ---- storage (this browser only) ----
  var db = null;
  function openDb() {
    return new Promise(function (ok) {
      try {
        var rq = indexedDB.open('before-after', 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore('kv'); };
        rq.onsuccess = function () { db = rq.result; ok(); };
        rq.onerror = function () { ok(); };
      } catch (e) { ok(); }
    });
  }
  function load() {
    return new Promise(function (ok) {
      if (!db) return ok(null);
      try {
        var rq = db.transaction('kv').objectStore('kv').get('project');
        rq.onsuccess = function () { ok(rq.result || null); };
        rq.onerror = function () { ok(null); };
      } catch (e) { ok(null); }
    });
  }
  var saveT = 0;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      if (!db) return;
      try { db.transaction('kv', 'readwrite').objectStore('kv').put(state, 'project'); } catch (e) {}
    }, 300);
  }

  // ---- pictures ----
  function readPicture(file) {
    return new Promise(function (ok, fail) {
      var fr = new FileReader();
      fr.onerror = function () { fail(); };
      fr.onload = function () {
        var img = new Image();
        img.onerror = function () { fail(); };
        img.onload = function () {
          var w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h) return fail();
          var k = Math.min(1, MAX_SIDE / Math.max(w, h));
          var c = document.createElement('canvas');
          c.width = Math.round(w * k); c.height = Math.round(h * k);
          var g = c.getContext('2d');
          g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
          g.drawImage(img, 0, 0, c.width, c.height);
          ok({ url: c.toDataURL('image/jpeg', 0.86), ratio: w / h });
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  function shape(r) {
    var known = [[1, '1:1'], [4 / 3, '4:3'], [3 / 2, '3:2'], [16 / 10, '16:10'], [16 / 9, '16:9'], [3 / 4, '3:4'], [2 / 3, '2:3'], [9 / 16, '9:16']];
    for (var i = 0; i < known.length; i++) if (Math.abs(known[i][0] - r) / r < 0.02) return known[i][1];
    return r >= 1 ? 'wide ' + r.toFixed(2) + ' to 1' : 'tall 1 to ' + (1 / r).toFixed(2);
  }

  var state, view, pending = { before: null, after: null }, placing = null;

  function setMsg(id, text, kind) {
    var m = $(id);
    m.textContent = text || '';
    m.className = 'bp-msg' + (kind ? ' bp-' + kind : '');
  }

  function refreshOwn() {
    var b = state.own || pending.before, a = state.own || pending.after;
    $('sBefore').textContent = b ? 'Chosen' : 'Not chosen yet';
    $('sBefore').className = 'bp-state' + (b ? ' bp-ok' : '');
    $('sAfter').textContent = a ? 'Chosen' : 'Not chosen yet';
    $('sAfter').className = 'bp-state' + (a ? ' bp-ok' : '');
    $('bSample').hidden = !state.own && !pending.before && !pending.after;
    if (state.own) {
      var diff = Math.abs(state.ratioB - state.ratioA) / state.ratioB;
      if (diff < 0.02) setMsg('matchMsg', 'Good match. Both pictures have the same shape (' + shape(state.ratioB) + ').', 'good');
      else setMsg('matchMsg', 'The two pictures have different shapes (before is ' + shape(state.ratioB) + ', after is ' + shape(state.ratioA) + '). They will not line up well. Make the AFTER picture again from the same photo, without cropping.', 'warn');
    } else if (pending.before || pending.after) {
      setMsg('matchMsg', 'Now choose the ' + (pending.before ? 'AFTER' : 'BEFORE') + ' picture. The slider changes when both are chosen.');
    } else setMsg('matchMsg', '');
  }

  function pick(which, file) {
    if (!file) return;
    setMsg('matchMsg', 'Opening the picture...');
    readPicture(file).then(function (p) {
      if (state.own) {
        state[which] = p.url;
        if (which === 'before') { state.ratioB = p.ratio; state.ratio = p.ratio; } else state.ratioA = p.ratio;
      } else {
        pending[which] = p;
        if (pending.before && pending.after) {
          state = {
            own: true, title: 'Before and after',
            before: pending.before.url, after: pending.after.url,
            ratio: pending.before.ratio, ratioB: pending.before.ratio, ratioA: pending.after.ratio,
            notes: []
          };
          pending = { before: null, after: null };
          $('iTitle').value = state.title;
        }
      }
      view.setData(state); renderNotes(); refreshOwn(); save();
    }).catch(function () {
      setMsg('matchMsg', 'This picture could not be opened. Please save it as JPG or PNG and try again.', 'warn');
    });
  }

  // ---- notes ----
  function stopPlacing() {
    placing = null;
    view.setTap(null); view.setEditing(false);
    $('bAdd').classList.remove('bp-live');
    $('bAdd').textContent = '+ Add a note';
    setMsg('addMsg', '');
  }
  function startPlacing(index) {
    placing = { index: index };
    view.setEditing(true);
    $('bAdd').classList.add('bp-live');
    $('bAdd').textContent = 'Cancel';
    setMsg('addMsg', index == null ? 'Now tap the place on the picture where the note belongs.' : 'Now tap the new place on the picture for note ' + (index + 1) + '.');
    view.stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
    view.setTap(function (x, y) {
      var i = placing.index;
      x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10;
      if (i == null) { state.notes.push({ x: x, y: y, title: 'Note ' + (state.notes.length + 1), text: '' }); i = state.notes.length - 1; }
      else { state.notes[i].x = x; state.notes[i].y = y; }
      stopPlacing();
      view.render(); view.select(i, true); renderNotes(); save();
      var f = document.querySelector('#noteList li:nth-child(' + (i + 1) + ') input');
      if (f && placingWasNew) { f.focus(); f.select(); }
    });
  }
  var placingWasNew = false;

  function field(labelText, node, id) {
    var w = document.createElement('div');
    var l = document.createElement('label');
    l.className = 'bp-lab'; l.textContent = labelText; l.htmlFor = id; node.id = id;
    w.appendChild(l); w.appendChild(node);
    return w;
  }
  function renderNotes() {
    var list = $('noteList');
    list.textContent = '';
    if (!state.notes.length) {
      var e = document.createElement('p');
      e.className = 'bp-msg';
      e.textContent = 'No notes yet. Press "+ Add a note", then tap the picture.';
      list.appendChild(e);
      return;
    }
    state.notes.forEach(function (n, i) {
      var li = document.createElement('li');
      var num = document.createElement('span');
      num.className = 'bp-num'; num.textContent = String(i + 1);
      var box = document.createElement('div');
      box.className = 'bp-fields';
      var t = document.createElement('input');
      t.type = 'text'; t.className = 'bp-in'; t.maxLength = 40; t.value = n.title || '';
      t.addEventListener('input', function () { n.title = t.value; view.render(); view.select(i, true); save(); });
      var x = document.createElement('textarea');
      x.className = 'bp-in'; x.maxLength = 400; x.value = n.text || '';
      x.addEventListener('input', function () { n.text = x.value; view.select(i, true); save(); });
      var row = document.createElement('div');
      row.className = 'bp-mini';
      var mv = document.createElement('button');
      mv.type = 'button'; mv.className = 'bp-btn bp-quiet'; mv.textContent = 'Move dot ' + (i + 1);
      mv.addEventListener('click', function () { placingWasNew = false; startPlacing(i); });
      var rm = document.createElement('button');
      rm.type = 'button'; rm.className = 'bp-btn bp-quiet'; rm.textContent = 'Remove note ' + (i + 1);
      rm.addEventListener('click', function () {
        if (!confirm('Remove note ' + (i + 1) + '?')) return;
        state.notes.splice(i, 1);
        view.render(); renderNotes(); save();
      });
      row.appendChild(mv); row.appendChild(rm);
      box.appendChild(field('Short name', t, 'nT' + i));
      box.appendChild(field('What changed', x, 'nX' + i));
      box.appendChild(row);
      li.appendChild(num); li.appendChild(box);
      list.appendChild(li);
    });
  }

  // ---- download as one page ----
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function text(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.text(); }); }
  function inlinePicture(src) {
    if (src.indexOf('data:') === 0) return Promise.resolve(src);
    return text(src).then(function (svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
  }
  function download() {
    setMsg('downMsg', 'Preparing the page...');
    Promise.all([text('view.css'), text('view.js'), inlinePicture(state.before), inlinePicture(state.after)]).then(function (r) {
      var title = state.title || 'Before and after';
      var data = { before: r[2], after: r[3], ratio: state.ratio, notes: state.notes };
      var json = JSON.stringify(data).replace(/</g, '\\u003c').split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');
      var html = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>' + esc(title) + '</title>\n<style>\nbody{margin:0;padding:24px 16px;background:#F2EEE2;color:#17222B;font-family:Montserrat,"Segoe UI",system-ui,sans-serif}\nmain{max-width:1100px;margin:0 auto}\nh1{font-size:26px;line-height:1.2;margin:0 0 14px}\n' + r[0] + '\n</style>\n</head>\n<body>\n<main>\n<h1>' + esc(title) + '</h1>\n<div id="ba"></div>\n</main>\n<script>\n' + r[1] + '\n</' + 'script>\n<script>\nBAView.mount(document.getElementById("ba"), ' + json + ');\n</' + 'script>\n</body>\n</html>\n';
      var name = (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'before-after') + '.html';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      setMsg('downMsg', 'Saved as "' + name + '" in your Downloads folder. Open it with a double click. It works without the internet.', 'good');
    }).catch(function () {
      setMsg('downMsg', 'The page could not be prepared. Please try again.', 'warn');
    });
  }

  // ---- start ----
  function start(saved) {
    state = (saved && saved.before && saved.after && Array.isArray(saved.notes)) ? saved : sample();
    view = window.BAView.mount($('view'), state);
    $('iTitle').value = state.title || '';
    renderNotes(); refreshOwn();

    $('bBefore').addEventListener('click', function () { $('fBefore').click(); });
    $('bAfter').addEventListener('click', function () { $('fAfter').click(); });
    $('fBefore').addEventListener('change', function () { pick('before', this.files[0]); this.value = ''; });
    $('fAfter').addEventListener('change', function () { pick('after', this.files[0]); this.value = ''; });
    $('bSample').addEventListener('click', function () {
      if (state.own && !confirm('Go back to the sample room? Your two pictures and your notes will be taken off this page.')) return;
      pending = { before: null, after: null };
      state = sample();
      $('iTitle').value = state.title;
      view.setData(state); renderNotes(); refreshOwn(); save();
    });
    $('bAdd').addEventListener('click', function () {
      if (placing) return stopPlacing();
      placingWasNew = true; startPlacing(null);
    });
    $('iTitle').addEventListener('input', function () { state.title = this.value; save(); });
    $('bDown').addEventListener('click', download);
    var full = $('bFull');
    if (!view.root.requestFullscreen) full.hidden = true;
    full.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else view.root.requestFullscreen().catch(function () {});
    });
    document.addEventListener('fullscreenchange', function () {
      full.textContent = document.fullscreenElement ? 'Leave full screen' : 'Show full screen';
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && placing) stopPlacing(); });
  }

  openDb().then(load).then(start);
})();
