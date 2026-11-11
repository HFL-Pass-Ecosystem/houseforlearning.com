/* Course player for courses made in Author Studio, plus the list of published courses.
   learn.html            -> list of published courses made by members
   learn.html?c=<key>    -> open one: join (test pay), learn lesson by lesson with progress and resume, then the final check and certificate.
   Uses the same progress, final check and certificate pipeline as every other course (HFLAccess, /api/lms). Text is set with textContent only. */
(function () {
  var main = document.querySelector('main[data-lms="play"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function btn(t, f, c) { var b = el('button', c || 'btn', t); b.type = 'button'; b.addEventListener('click', f); return b; }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  function api(b) {
    return fetch('/api/author', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(b) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  var key = (/[?&]c=([^&]*)/.exec(location.search) || [])[1]; key = key ? decodeURIComponent(key) : '';

  A.ready.then(function () {
    if (!A.signedIn()) { box.appendChild(el('p', '', 'Sign in first.')); var a = el('a', 'btn', 'Sign in'); a.href = 'login.html'; box.appendChild(a); return; }
    if (A.mode !== 'server') { box.appendChild(say('Courses by members need your member account. Please sign in with your member account (this browser is in test mode).', true)); return; }
    key ? player() : catalogue();
  });

  function catalogue() {
    box.appendChild(say('Loading courses.'));
    api({ action: 'catalogue' }).then(function (x) {
      box.textContent = '';
      if (x.status !== 200) { box.appendChild(say(x.error || 'Could not load courses.', true)); return; }
      if (!x.courses.length) box.appendChild(el('p', '', 'No member courses are published yet. Be the first: open Author Studio.'));
      x.courses.forEach(function (c) {
        var d = el('div', 'au-card'); d.appendChild(el('strong', '', c.title)); d.appendChild(el('p', '', c.summary));
        d.appendChild(el('p', '', 'By ' + c.author + '. ' + c.units + ' lessons. ' + (c.price > 0 ? 'USD ' + c.price.toFixed(2) + ' (test)' : 'Free') + '.'));
        var l = el('a', 'btn btn-ghost', 'Open'); l.href = 'learn.html?c=' + encodeURIComponent(c.key); d.appendChild(l); box.appendChild(d);
      });
    });
  }

  function enrolment() { return ((A.server || {}).enrolments || []).filter(function (e) { return e.course === key; })[0]; }
  function player() {
    api({ action: 'play', key: key }).then(function (x) {
      box.textContent = '';
      if (!x.course) { box.appendChild(say(x.error || 'Course not found.', true)); return; }
      var c = x.course, en = enrolment(), units = [];
      c.modules.forEach(function (m, mi) { m.lessons.forEach(function (l) { units.push({ mod: m.title, mi: mi, l: l }); }); });
      box.appendChild(el('h3', '', c.title)); box.appendChild(el('p', '', c.summary + ' By ' + c.author + '.'));
      if (c.status !== 'published') box.appendChild(say('Preview: this course is not published yet. Progress is not kept.'));
      if (!en && c.status === 'published') return join(c, units.length);
      if (!en) { lesson(0); return; }
      var done = (en.done || []).slice(), at = Math.min(Math.max(en.last == null ? 0 : en.last, 0), units.length - 1);
      lesson(at);
    });
    function join(c, n) {
      box.appendChild(el('p', '', 'The first lesson is free to look at. Join to open every lesson, keep your place and take the final check.'));
      var f = el('div'); f.appendChild(el('p', '', c.price > 0 ? 'Price: USD ' + c.price.toFixed(2) + '. This is a test: no money is taken.' : 'This course is free.'));
      f.appendChild(btn(c.price > 0 ? 'Join (test pay)' : 'Join (free)', function () {
        A.enrol(key, c.title, n, 'bank', c.price > 0 ? 'test' : 'free').then(function (ok) { if (ok) location.reload(); else f.appendChild(say('Joining did not work. Please try again.', true)); });
      })); box.appendChild(f);
    }
    function lesson(i) {
      var c = null;
      api({ action: 'play', key: key }).then(function (x) {
        c = x.course; var units = [];
        c.modules.forEach(function (m) { m.lessons.forEach(function (l) { units.push({ mod: m.title, l: l }); }); });
        var en = enrolment(), joined = !!en, canSee = joined || i === 0 || c.preview;
        var done = joined ? (en.done || []) : [];
        box.textContent = '';
        box.appendChild(el('h3', '', c.title));
        if (joined) {
          var pb = el('div', 'acc-prog'); pb.setAttribute('role', 'progressbar'); pb.setAttribute('aria-valuemin', '0'); pb.setAttribute('aria-valuemax', String(units.length)); pb.setAttribute('aria-valuenow', String(done.length));
          var sp = el('span'); sp.setAttribute('data-w', String(units.length ? Math.round(100 * done.length / units.length) : 0)); pb.appendChild(sp); box.appendChild(pb);
          box.appendChild(el('p', '', done.length + ' of ' + units.length + ' lessons done.'));
        }
        var nav = el('div', 'au-nav'); units.forEach(function (u, k) {
          var b = btn((k + 1) + '. ' + u.l.title, function () { if (joined || k === 0 || c.preview) lesson(k); else box.insertBefore(say('Join the course to open this lesson.', true), nav); }, 'au-lesson' + (k === i ? ' on' : '') + (done.indexOf(k) > -1 ? ' done' : ''));
          nav.appendChild(b);
        }); box.appendChild(nav);
        var u = units[i]; box.appendChild(el('p', 'au-k', u.mod)); box.appendChild(el('h4', '', u.l.title));
        var listen = [];
        u.l.blocks.forEach(function (b) { box.appendChild(renderBlock(b)); if (b.text) listen.push(b.text); });
        if ('speechSynthesis' in window && listen.length) {
          box.appendChild(btn('Listen to this lesson', function () { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(listen.join(' '))); }, 'btn btn-ghost'));
        }
        var acts = el('div', 'au-row');
        if (i > 0) acts.appendChild(btn('Previous', function () { lesson(i - 1); }, 'btn btn-ghost'));
        if (joined) {
          var isDone = done.indexOf(i) > -1;
          acts.appendChild(btn(isDone ? 'Done (tap to undo)' : 'Mark done', function () {
            var d = A.load(), r = d[key] || { paid: true, title: c.title, total: units.length, done: [] }, set = {}; (r.done || []).forEach(function (n) { set[n] = 1; });
            if (set[i]) delete set[i]; else set[i] = 1; r.done = Object.keys(set).map(Number).sort(function (a, b) { return a - b; }); r.total = units.length; d[key] = r; A.save(d);
            en.done = r.done; en.last = Math.min(i + 1, units.length - 1); setTimeout(function () { lesson(set[i] && i < units.length - 1 ? i + 1 : i); }, 500);
          }));
        }
        if (i < units.length - 1) acts.appendChild(btn('Next', function () { if (joined || c.preview) lesson(i + 1); else box.appendChild(say('Join the course to open the next lesson.', true)); }, 'btn btn-ghost'));
        box.appendChild(acts);
        if (joined) {
          var fin = el('a', 'btn', done.length >= units.length ? 'Take the final check' : 'Final check'); fin.href = 'quiz.html?course=' + encodeURIComponent(key); box.appendChild(fin);
        } else if (c.status === 'published') {
          box.appendChild(btn('Join this course', function () { box.textContent = ''; player(); }, 'btn'));
        }
        A.paint && A.paint();
      });
    }
  }

  function renderBlock(b) {
    var d = el('div', 'au-b au-b-' + b.type);
    if (b.type === 'text') d.appendChild(el('p', '', b.text));
    if (b.type === 'callout') { d.appendChild(el('strong', '', 'Key point')); d.appendChild(el('p', '', b.text)); }
    if (b.type === 'image') { var im = el('img'); im.src = b.url; im.alt = b.alt || ''; im.loading = 'lazy'; im.className = 'au-img'; d.appendChild(im); }
    if (b.type === 'video') { var v = el('a', 'btn btn-ghost', 'Watch: ' + (b.title || 'video')); v.href = b.url; v.target = '_blank'; v.rel = 'noopener noreferrer'; d.appendChild(v); }
    if (b.type === 'flashcards') {
      b.items.forEach(function (i) { var c = el('button', 'au-card-flip', i.front); c.type = 'button'; var on = false; c.addEventListener('click', function () { on = !on; c.textContent = on ? i.back : i.front; c.setAttribute('aria-pressed', String(on)); }); d.appendChild(c); });
      d.appendChild(el('p', 'au-hint', 'Tap a card to turn it over.'));
    }
    if (b.type === 'scenario') {
      d.appendChild(el('p', '', b.prompt)); var fb = el('p', 'acc-msg'); fb.setAttribute('role', 'status');
      b.choices.forEach(function (c) { d.appendChild(btn(c.text, function () { fb.textContent = c.feedback || 'Noted.'; }, 'btn btn-ghost')); }); d.appendChild(fb);
    }
    return d;
  }
})();
