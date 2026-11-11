/* My board: sticky notes. Every member gets a blank board. Notes you write are yours; trainers can pin a note on one board or on every board;
   a note for today is made automatically. Talks to /api/board. Text is set with textContent only. No inline script or style. */
(function () {
  var main = document.querySelector('main[data-lms="board"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess, notes = [], staff = false, COLORS = ['ivory', 'blue', 'green'];
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function api(b) {
    return fetch('/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(b) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  function btn(t, f, c) { var b = el('button', c || 'btn btn-ghost', t); b.type = 'button'; b.addEventListener('click', f); return b; }
  function field(label, type) { var l = el('label', 'au-f'); l.appendChild(el('span', 'au-l', label)); var i = el(type === 'area' ? 'textarea' : 'input'); if (type === 'area') i.rows = 3; else i.type = type || 'text'; i.maxLength = 500; l.appendChild(i); l.input = i; return l; }
  function colorPick() { var s = el('select'); s.setAttribute('aria-label', 'Note colour'); COLORS.forEach(function (c) { var o = el('option', '', c === 'ivory' ? 'Ivory' : c === 'blue' ? 'Blue' : 'Green'); o.value = c; s.appendChild(o); }); return s; }

  A.ready.then(function () {
    if (!A.signedIn()) { box.appendChild(el('p', '', 'Sign in first.')); var a = el('a', 'btn', 'Sign in'); a.href = 'login.html'; box.appendChild(a); return; }
    if (A.mode !== 'server') { box.appendChild(say('Your board is kept in your member account. Please sign in with your member account (this browser is in test mode).', true)); return; }
    load();
  });
  function load() {
    api({ action: 'list' }).then(function (x) {
      if (x.status !== 200) { box.textContent = ''; box.appendChild(say(x.error || 'Could not load your board.', true)); return; }
      notes = x.notes; staff = !!x.staff; draw();
    });
  }
  function draw() {
    box.textContent = '';
    var f = el('form', 'bd-new'); f.noValidate = true;
    var t = field('New note', 'area'), d = field('Due date (optional)', 'date'), c = colorPick(), go = el('button', 'btn', 'Stick it on my board'); go.type = 'submit';
    f.appendChild(t); f.appendChild(d); f.appendChild(c); f.appendChild(go);
    var out = el('div'); out.setAttribute('aria-live', 'polite');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); out.textContent = '';
      if (!t.input.value.trim()) { out.appendChild(say('Write something on the note first.', true)); return; }
      api({ action: 'add', body: t.input.value, due: d.input.value, color: c.value }).then(function (x) { if (x.note) { notes.unshift(x.note); draw(); } else out.appendChild(say(x.error || 'Could not save.', true)); });
    });
    box.appendChild(f); box.appendChild(out);
    var open = notes.filter(function (n) { return !n.done; }), done = notes.filter(function (n) { return n.done; });
    var wall = el('div', 'bd-wall'); box.appendChild(wall);
    if (!open.length) wall.appendChild(el('p', '', 'Your board is clear. Add a note above.'));
    open.forEach(function (n) { wall.appendChild(sticky(n)); });
    if (done.length) { box.appendChild(el('h3', '', 'Done')); var w2 = el('div', 'bd-wall'); done.forEach(function (n) { w2.appendChild(sticky(n)); }); box.appendChild(w2); }
    if (staff) assign();
  }
  function sticky(n) {
    var d = el('div', 'bd-note bd-' + n.color + (n.done ? ' bd-done' : '')); d.setAttribute('data-kind', n.kind);
    d.appendChild(el('span', 'bd-kind', n.kind === 'auto' ? 'Today' : n.kind === 'assigned' ? 'From your trainer' : 'My note'));
    d.appendChild(el('p', 'bd-body', n.body));
    if (n.due) d.appendChild(el('p', 'bd-due', 'Due ' + n.due));
    var row = el('div', 'bd-act');
    if (n.link) { var a = el('a', 'btn btn-ghost', 'Open'); a.href = n.link; row.appendChild(a); }
    row.appendChild(btn(n.done ? 'Undo' : 'Done', function () { api({ action: 'update', id: n.id, done: !n.done }).then(function (x) { if (x.note) { n.done = x.note.done; draw(); } }); }));
    row.appendChild(btn('Remove', function () { api({ action: 'remove', id: n.id }).then(function () { notes = notes.filter(function (m) { return m.id !== n.id; }); draw(); }); }));
    d.appendChild(row); return d;
  }
  function assign() {
    var s = el('section', 'bd-staff'); s.appendChild(el('h3', '', 'Trainers: put a note on a board'));
    var to = field('Member email, or type all for every board', 'text'), t = field('Note', 'area'), d = field('Due date (optional)', 'date'), l = field('Page link on this site (optional, e.g. learn.html)', 'text'), c = colorPick();
    var out = el('div'); out.setAttribute('aria-live', 'polite');
    var go = btn('Send the note', function () {
      out.textContent = '';
      api({ action: 'assign', to: to.input.value, body: t.input.value, due: d.input.value, link: l.input.value, color: c.value }).then(function (x) { out.appendChild(x.sent ? say('Sent to ' + x.sent + (x.sent === 1 ? ' board.' : ' boards.')) : say(x.error || 'Could not send.', true)); });
    }, 'btn');
    [to, t, d, l, c, go, out].forEach(function (e) { s.appendChild(e); }); box.appendChild(s);
  }
})();
