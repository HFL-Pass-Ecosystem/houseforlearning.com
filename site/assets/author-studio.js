/* Author Studio: build a course on screen (modules, lessons, blocks, final check), save, send to a trainer, publish, see earnings.
   Trainers (facilitators) also get the review queue. Talks to /api/author. Text is always set with textContent. No inline script, no inline style. */
(function () {
  var main = document.querySelector('main[data-lms="author"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess, model = null, staff = false;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function api(b) {
    return fetch('/api/author', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(b) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  function btn(t, f, c) { var b = el('button', c || 'btn', t); b.type = 'button'; b.addEventListener('click', f); return b; }
  function field(label, val, on, opts) {
    opts = opts || {}; var l = el('label', 'au-f'); l.appendChild(el('span', 'au-l', label));
    var i = el(opts.area ? 'textarea' : 'input'); if (opts.area) i.rows = opts.rows || 4; else i.type = opts.type || 'text';
    if (opts.max) i.maxLength = opts.max; if (opts.step) i.step = opts.step; if (opts.min != null) i.min = opts.min;
    i.value = val == null ? '' : val; i.addEventListener('input', function () { on(i.value); }); l.appendChild(i); return l;
  }
  function row(kids, c) { var d = el('div', c || 'au-row'); kids.forEach(function (k) { d.appendChild(k); }); return d; }

  A.ready.then(function () {
    if (!A.signedIn()) { box.appendChild(el('p', '', 'Sign in first.')); var a = el('a', 'btn', 'Sign in'); a.href = 'login.html'; box.appendChild(a); return; }
    if (A.mode !== 'server') { box.appendChild(say('Author Studio keeps your courses in your member account. Please sign in with your member account (this browser is in test mode).', true)); return; }
    home();
  });

  /* ---------- home: my courses, review queue, earnings ---------- */
  function home(note) {
    box.textContent = ''; model = null;
    if (note) box.appendChild(note);
    box.appendChild(row([btn('Start a new course', function () { edit(blank()); }), btn('Earnings', earnings, 'btn btn-ghost')]));
    var list = el('div', 'au-list'); box.appendChild(list); list.appendChild(say('Loading your courses.'));
    api({ action: 'mine' }).then(function (x) {
      list.textContent = '';
      if (x.status !== 200) { list.appendChild(say(x.error || 'Could not load your courses.', true)); return; }
      staff = !!x.staff;
      list.appendChild(el('h3', '', 'My courses'));
      if (!x.courses.length) list.appendChild(el('p', '', 'You have no courses yet. Start a new course to build your first one.'));
      x.courses.forEach(function (c) { list.appendChild(card(c, function () { open(c.id); })); });
      if (staff) queue();
    });
  }
  function card(c, onOpen, extra) {
    var d = el('div', 'au-card'); d.appendChild(el('strong', '', c.title));
    d.appendChild(el('span', 'au-tag au-' + c.status, ({ draft: 'Draft', review: 'With a trainer', changes: 'Changes asked', approved: 'Approved', published: 'Published' })[c.status] || c.status));
    d.appendChild(el('p', '', c.units + ' lessons. ' + (c.price > 0 ? 'USD ' + c.price.toFixed(2) : 'Free') + '.'));
    d.appendChild(btn(extra || 'Open', onOpen, 'btn btn-ghost')); return d;
  }
  function open(id) { api({ action: 'get', id: id }).then(function (x) { if (x.course) edit(x.course); else home(say(x.error || 'Could not open the course.', true)); }); }
  function queue() {
    var q = el('div', 'au-list'); box.appendChild(q); q.appendChild(el('h3', '', 'Trainer review queue'));
    api({ action: 'queue' }).then(function (x) {
      if (x.status !== 200) return;
      if (!x.courses.length) q.appendChild(el('p', '', 'No courses are waiting for review.'));
      x.courses.forEach(function (c) { q.appendChild(card(c, function () { review(c.id); }, 'Review')); });
    });
  }

  /* ---------- earnings ---------- */
  function earnings() {
    box.textContent = ''; box.appendChild(btn('Back', function () { home(); }, 'btn btn-ghost'));
    box.appendChild(el('h3', '', 'Earnings')); var out = el('div'); box.appendChild(out);
    api({ action: 'earnings' }).then(function (x) {
      if (x.status !== 200) { out.appendChild(say(x.error || 'Could not load.', true)); return; }
      out.appendChild(el('p', '', 'Sales: ' + x.sales + '. Gross: USD ' + x.gross.toFixed(2) + '. Yours: USD ' + x.yours.toFixed(2) + '. Platform: USD ' + x.platform.toFixed(2) + '.'));
      out.appendChild(say(x.rule));
    });
  }

  /* ---------- trainer review ---------- */
  function review(id) {
    box.textContent = ''; box.appendChild(btn('Back', function () { home(); }, 'btn btn-ghost'));
    api({ action: 'get', id: id }).then(function (x) {
      if (!x.course) { box.appendChild(say(x.error || 'Could not open.', true)); return; }
      var c = x.course; box.appendChild(el('h3', '', 'Review: ' + c.title)); box.appendChild(el('p', '', c.summary));
      c.modules.forEach(function (m, i) {
        box.appendChild(el('h4', '', 'Module ' + (i + 1) + ': ' + m.title));
        m.lessons.forEach(function (l) { box.appendChild(el('p', '', '- ' + l.title + ' (' + l.blocks.length + ' blocks)')); });
      });
      box.appendChild(el('p', '', 'Final check: ' + c.quiz.length + ' questions.'));
      var note = ''; box.appendChild(field('Note to the author', '', function (v) { note = v; }, { area: true, max: 1000 }));
      var out = el('div');
      function decide(d) { api({ action: 'review', id: id, decision: d, note: note }).then(function (y) { if (y.course) home(say('Done: ' + (d === 'approve' ? 'approved' : 'sent back for changes') + '.')); else out.appendChild(say(y.error || 'Could not save.', true)); }); }
      box.appendChild(row([btn('Approve', function () { decide('approve'); }), btn('Ask for changes', function () { decide('changes'); }, 'btn btn-ghost')])); box.appendChild(out);
    });
  }

  /* ---------- the studio ---------- */
  function blank() { return { id: '', title: '', summary: '', price: 0, status: 'draft', note: '', modules: [{ title: 'Module 1', lessons: [{ title: 'Lesson 1', blocks: [{ type: 'text', text: '' }] }] }], quiz: [] }; }
  var BLOCKS = { text: 'Text', callout: 'Key point', image: 'Picture', video: 'Video link', flashcards: 'Flashcards', scenario: 'Scenario' };
  function newBlock(t) {
    return ({ text: { type: 'text', text: '' }, callout: { type: 'callout', text: '' }, image: { type: 'image', url: '', alt: '' }, video: { type: 'video', url: '', title: '' },
      flashcards: { type: 'flashcards', items: [{ front: '', back: '' }] }, scenario: { type: 'scenario', prompt: '', choices: [{ text: '', feedback: '' }, { text: '', feedback: '' }] } })[t];
  }
  function edit(c) {
    model = c; var sel = { m: 0, l: 0 };
    function draw() {
      box.textContent = '';
      box.appendChild(row([btn('Back to my courses', function () { home(); }, 'btn btn-ghost')]));
      var st = el('p', 'au-status', 'Status: ' + ({ draft: 'Draft', review: 'With a trainer', changes: 'Changes asked', approved: 'Approved', published: 'Published' })[model.status] + (model.note ? '. Trainer note: ' + model.note : '') + '.'); box.appendChild(st);
      box.appendChild(field('Course title', model.title, function (v) { model.title = v; }, { max: 140 }));
      box.appendChild(field('One-line summary', model.summary, function (v) { model.summary = v; }, { max: 600 }));
      box.appendChild(field('Price in USD (0 = free). You keep 90%. Test sales only for now.', model.price, function (v) { model.price = Number(v) || 0; }, { type: 'number', min: 0, step: '0.5' }));
      box.appendChild(el('h3', '', 'Outline'));
      var cols = el('div', 'au-cols'), side = el('div', 'au-side'), pane = el('div', 'au-pane'); cols.appendChild(side); cols.appendChild(pane); box.appendChild(cols);
      model.modules.forEach(function (m, mi) {
        var mb = el('div', 'au-mod'); mb.appendChild(field('Module title', m.title, function (v) { m.title = v; }, { max: 120 }));
        m.lessons.forEach(function (l, li) {
          var b = btn((mi + 1) + '.' + (li + 1) + ' ' + (l.title || 'Lesson'), function () { sel = { m: mi, l: li }; draw(); }, 'au-lesson' + (mi === sel.m && li === sel.l ? ' on' : '')); mb.appendChild(b);
        });
        mb.appendChild(btn('Add lesson', function () { m.lessons.push({ title: 'Lesson ' + (m.lessons.length + 1), blocks: [{ type: 'text', text: '' }] }); sel = { m: mi, l: m.lessons.length - 1 }; draw(); }, 'btn btn-ghost'));
        side.appendChild(mb);
      });
      side.appendChild(btn('Add module', function () { model.modules.push({ title: 'Module ' + (model.modules.length + 1), lessons: [{ title: 'Lesson 1', blocks: [{ type: 'text', text: '' }] }] }); sel = { m: model.modules.length - 1, l: 0 }; draw(); }, 'btn btn-ghost'));
      var mod = model.modules[sel.m], les = mod && mod.lessons[sel.l];
      if (les) {
        pane.appendChild(field('Lesson title', les.title, function (v) { les.title = v; }, { max: 120 }));
        les.blocks.forEach(function (b, bi) { pane.appendChild(blockEditor(les, b, bi)); });
        var add = el('div', 'au-add'); add.appendChild(el('span', 'au-l', 'Add a block: '));
        Object.keys(BLOCKS).forEach(function (t) { add.appendChild(btn(BLOCKS[t], function () { les.blocks.push(newBlock(t)); draw(); }, 'btn btn-ghost')); });
        pane.appendChild(add);
        pane.appendChild(btn('Remove this lesson', function () { if (mod.lessons.length > 1) { mod.lessons.splice(sel.l, 1); sel.l = 0; draw(); } }, 'btn btn-ghost'));
      }
      box.appendChild(el('h3', '', 'Final check'));
      box.appendChild(el('p', '', 'Learners need 70% to pass. Mark the right answer for each question.'));
      model.quiz.forEach(function (q, qi) {
        var qb = el('div', 'au-q'); qb.appendChild(field('Question ' + (qi + 1), q.q, function (v) { q.q = v; }, { max: 500 }));
        q.o.forEach(function (o, oi) {
          var r = el('input'); r.type = 'radio'; r.name = 'ans' + qi; r.checked = q.a === oi; r.setAttribute('aria-label', 'Right answer ' + (oi + 1)); r.addEventListener('change', function () { q.a = oi; });
          qb.appendChild(row([r, field('Answer ' + (oi + 1), o, function (v) { q.o[oi] = v; }, { max: 300 })]));
        });
        qb.appendChild(row([btn('Add answer', function () { if (q.o.length < 6) { q.o.push(''); draw(); } }, 'btn btn-ghost'), btn('Remove question', function () { model.quiz.splice(qi, 1); draw(); }, 'btn btn-ghost')]));
        box.appendChild(qb);
      });
      box.appendChild(btn('Add a question', function () { model.quiz.push({ q: '', o: ['', ''], a: 0 }); draw(); }, 'btn btn-ghost'));
      var out = el('div'); out.setAttribute('aria-live', 'polite');
      function save(after) {
        out.textContent = '';
        api({ action: 'save', id: model.id, title: model.title, summary: model.summary, price: model.price, modules: model.modules, quiz: model.quiz.filter(function (q) { return q.q && q.o.filter(Boolean).length >= 2; }).map(function (q) { var o = [], a = 0; q.o.forEach(function (x, i) { if (x) { if (i === q.a) a = o.length; o.push(x); } }); return { q: q.q, o: o, a: a }; }) }).then(function (x) {
          if (x.course) { model = x.course; if (after) after(); else { draw(); box.appendChild(say('Saved.')); } } else out.appendChild(say(x.error || 'Could not save.', true));
        });
      }
      var acts = row([btn('Save', function () { save(); })]);
      acts.appendChild(btn('Send to a trainer for review', function () { save(function () { api({ action: 'submit', id: model.id }).then(function (x) { if (x.course) home(say('Sent to a trainer. You will be told when it is reviewed.')); else { draw(); box.appendChild(say(x.error || 'Could not send.', true)); } }); }); }, 'btn btn-ghost'));
      if (model.status === 'approved') acts.appendChild(btn('Publish', function () { api({ action: 'publish', id: model.id }).then(function (x) { if (x.course) home(say('Published. Learners can find it on the Courses by members page.')); else { draw(); box.appendChild(say(x.error || 'Could not publish.', true)); } }); }));
      if (model.status === 'approved' || model.status === 'published') box.appendChild(say('If you change and save an approved or published course, it goes back to a trainer first.'));
      if (model.id) { var pv = el('a', 'btn btn-ghost', 'Preview as a learner'); pv.href = 'learn.html?c=' + encodeURIComponent(model.key); acts.appendChild(pv); }
      box.appendChild(acts); box.appendChild(out);
    }
    draw();
  }
  function blockEditor(les, b, bi) {
    var d = el('div', 'au-block'); d.appendChild(el('strong', '', BLOCKS[b.type]));
    if (b.type === 'text' || b.type === 'callout') d.appendChild(field('Write here', b.text, function (v) { b.text = v; }, { area: true, rows: 5, max: 6000 }));
    if (b.type === 'image') { d.appendChild(field('Picture web address (https)', b.url, function (v) { b.url = v; }, { max: 400 })); d.appendChild(field('Describe the picture', b.alt, function (v) { b.alt = v; }, { max: 200 })); }
    if (b.type === 'video') { d.appendChild(field('Video web address (https)', b.url, function (v) { b.url = v; }, { max: 400 })); d.appendChild(field('Video title', b.title, function (v) { b.title = v; }, { max: 120 })); }
    if (b.type === 'flashcards') {
      b.items.forEach(function (i) { d.appendChild(row([field('Front', i.front, function (v) { i.front = v; }, { max: 300 }), field('Back', i.back, function (v) { i.back = v; }, { max: 600 })])); });
      d.appendChild(btn('Add card', function () { b.items.push({ front: '', back: '' }); d.parentNode.replaceChild(blockEditor(les, b, bi), d); }, 'btn btn-ghost'));
    }
    if (b.type === 'scenario') {
      d.appendChild(field('Situation', b.prompt, function (v) { b.prompt = v; }, { area: true, rows: 3, max: 1200 }));
      b.choices.forEach(function (c) { d.appendChild(row([field('Choice', c.text, function (v) { c.text = v; }, { max: 300 }), field('What happens', c.feedback, function (v) { c.feedback = v; }, { max: 600 })])); });
      d.appendChild(btn('Add choice', function () { if (b.choices.length < 5) { b.choices.push({ text: '', feedback: '' }); d.parentNode.replaceChild(blockEditor(les, b, bi), d); } }, 'btn btn-ghost'));
    }
    d.appendChild(btn('Remove block', function () { les.blocks.splice(bi, 1); d.parentNode.removeChild(d); }, 'btn btn-ghost')); return d;
  }
})();
