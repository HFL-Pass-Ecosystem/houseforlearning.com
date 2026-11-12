/* PAVER, COLLATE, LEAP and LAB working spaces (test only, demo data).
   One shared store in this browser (localStorage key "hfl-spaces-v1"), so the four spaces talk to each other:
   COLLATE shelf -> LEAP capsule -> LAB check and publish -> PAVER pathway.
   Nothing is sent to a server. No inline scripts (CSP). User text is always set with textContent. */
(function () {
  'use strict';
  var root = document.getElementById('sp-app');
  if (!root) return;
  var SPACE = root.getAttribute('data-space');
  var KEY = 'hfl-spaces-v1';

  // ---------- demo data ----------
  var PATHS = [
    { id: 'P', name: 'Professional', blurb: 'Grow at work: managing, engineering and specialist roles.',
      courses: ['Workplace basics', 'Writing clear messages', 'Planning your week', 'Leading a small team', 'Managing a project', 'Managing people and budgets', 'Leading a department'] },
    { id: 'A', name: 'Academic', blurb: 'Study and research: from first notes to a published paper.',
      courses: ['How to study', 'Reading and note-making', 'Simple statistics', 'Writing a short report', 'Research methods', 'Writing a paper', 'Supervising research'] },
    { id: 'V', name: 'Vocational', blurb: 'Hands-on trades: safe, skilled and certified.',
      courses: ['Safety first', 'Tools and measuring', 'Reading a drawing', 'Basic wiring practice', 'Fault finding', 'Supervising a site crew', 'Running a workshop'] },
    { id: 'E', name: 'Entrepreneurial', blurb: 'Start and grow your own business.',
      courses: ['Is this idea worth it?', 'Talking to customers', 'Pricing and costs', 'Your first sale', 'Cash flow', 'Hiring your first people', 'Growing to new markets'] },
    { id: 'R', name: 'Recreational', blurb: 'Resilience, wellbeing and recreation for life.',
      courses: ['Breathing and calm', 'Moving every day', 'Sleep and energy', 'Learning a hobby', 'Coaching a group', 'Leading a club', 'Running community events'] }
  ];
  var CREDITS = [1, 2, 3, 4, 5, 6, 8];
  var CHECKS = [
    'The need is one sentence.',
    'The goal says what the learner can do at the end.',
    'The task is a real job or life task.',
    'The standard says how good is good enough.',
    'There is practice before the check.',
    'The check question tests the goal.',
    'Plain words, our own words, no outside brand names.'
  ];
  // [pathway, level, title, need, goal, task, standard, practice, author, check question, answer]
  var MORE = [
    ['P', 1, 'A clear two-line update', 'New staff write long updates that managers do not read.', 'Write a two-line work update that says what is done and what is next.', 'Send your team lead today\'s update.', 'Two lines, no more than 40 words, one clear next step.', 'Cut a long demo update down to two lines.', 'Demo Author D', 'What two things must the update say?', 'What is done and what is next.'],
    ['P', 2, 'Plan your week in ten minutes', 'People start the week without knowing their three most important tasks.', 'Pick and schedule your three most important tasks for the week.', 'Plan next week on a one-page planner.', 'Three tasks, each with a day and a time.', 'Sort ten demo tasks into must, should and later.', 'Demo Author A', 'How many top tasks do you pick?', 'Three.'],
    ['A', 1, 'Take notes you can use', 'New learners copy everything and cannot find the main idea later.', 'Make one page of notes with the main idea, three points and one question.', 'Take notes on a ten-minute demo talk.', 'One page: main idea, three points, one question.', 'Turn a long demo paragraph into three points.', 'Demo Author E', 'What goes at the top of the page?', 'The main idea.'],
    ['A', 2, 'Read a simple chart', 'Learners misread charts because they skip the labels.', 'Read the title, the axes and one trend from a simple chart.', 'Explain a demo sales chart to a friend in three sentences.', 'Title, both axes and one trend, all correct.', 'Label the parts of three demo charts.', 'Demo Author E', 'What do you read first on a chart?', 'The title.'],
    ['V', 1, 'Measure twice, cut once', 'New trainees waste material by cutting before checking the size.', 'Measure and mark a cut that is within 1 mm.', 'Cut a demo board to a size from a drawing.', 'Within 1 mm, measured twice, marked clearly.', 'Measure five demo pieces and write the sizes.', 'Demo Author A', 'How many times do you measure before you cut?', 'Twice.'],
    ['E', 1, 'Is your idea worth testing?', 'New founders spend months on ideas nobody asked for.', 'Score an idea on need, reach and cost in fifteen minutes.', 'Score your own business idea with the three-line sheet.', 'All three lines scored with one reason each.', 'Score two demo ideas and pick one.', 'Demo Author C', 'What are the three lines?', 'Need, reach and cost.'],
    ['R', 2, 'A ten-minute walk plan', 'People want to move more but never start.', 'Plan five ten-minute walks in your week.', 'Put five walks in your calendar for next week.', 'Five walks, each with a day, a time and a place.', 'Find three ten-minute gaps in a demo day.', 'Demo Author F', 'How long is each walk?', 'Ten minutes.']
  ];
  // Where each pathway leads: [role, level needed]
  var ROLES = {
    P: [['Demo role: Team assistant', 2], ['Demo role: Team lead', 4], ['Demo role: Department manager', 7]],
    A: [['Demo role: Research assistant', 3], ['Demo role: Analyst', 5], ['Demo role: Research supervisor', 7]],
    V: [['Demo role: Trainee technician', 2], ['Demo role: Technician', 4], ['Demo role: Site supervisor', 6]],
    E: [['Demo role: Freelancer', 3], ['Demo role: Small business owner', 5], ['Demo role: Growing company founder', 7]],
    R: [['Demo role: Wellbeing helper', 2], ['Demo role: Group coach', 5], ['Demo role: Club leader', 6]]
  };
  function now() { return new Date().toISOString(); }
  function uid(p) { return p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function seed() {
    var s = {
      v: 2,
      me: { name: 'Demo Learner' },
      reviewer: 'Demo Trainer B',
      paver: { path: 'P', joined: {}, done: {} },
      shelves: [
        { id: 'sh-demo1', topic: 'Demo shelf: Protection and control', path: 'V', items: [
          { id: 'i1', kind: 'Note', title: 'Why protection matters', text: 'A fault must be cleared fast and only where it happened.' },
          { id: 'i2', kind: 'Example', title: 'Demo case: feeder trip', text: 'A demo feeder tripped twice in one week. We traced it step by step.' },
          { id: 'i3', kind: 'Link', title: 'Our segment shelf', text: 'collate-shelves.html' },
          { id: 'i4', kind: 'Practice', title: 'Try it', text: 'Mark the breaker that should open first on the demo drawing.' }] },
        { id: 'sh-demo2', topic: 'Demo shelf: Pricing your first offer', path: 'E', items: [
          { id: 'i5', kind: 'Note', title: 'Cost plus margin', text: 'Add up every cost, then add the margin you need to grow.' },
          { id: 'i6', kind: 'Example', title: 'Demo cafe menu', text: 'A demo cafe priced tea from its cost per cup.' }] }
      ],
      capsules: [
        { id: 'cap-demo1', title: 'Demo capsule: Safe isolation in five steps', path: 'V', level: 3, author: 'Demo Author A',
          need: 'New technicians skip a step when they isolate a circuit.', goal: 'Isolate a demo circuit safely in five steps.',
          task: 'Isolate the demo lighting circuit before changing a fitting.', standard: 'All five steps, in order, with a test before touch.',
          practice: 'Put the five step cards in the right order.', q: 'What do you do just before you touch the wires?', a: 'Test that it is dead.',
          status: 'published', feedback: '', reviewer: 'Demo Trainer B', updated: '2026-11-10T09:00:00Z' },
        { id: 'cap-demo2', title: 'Demo capsule: Your first customer call', path: 'E', level: 2, author: 'Demo Author C',
          need: 'New founders talk too much and listen too little on first calls.', goal: 'Run a ten-minute customer call that is mostly listening.',
          task: 'Call one demo customer and ask five open questions.', standard: 'You talk for less than a third of the call.',
          practice: 'Rewrite three closed questions as open ones.', q: 'Which question is open: "Do you like it?" or "How do you use it today?"', a: 'How do you use it today?',
          status: 'review', feedback: '', reviewer: '', updated: '2026-11-11T10:30:00Z' },
        { id: 'cap-demo3', title: 'Demo capsule: Five-minute calm', path: 'R', level: 1, author: 'Demo Learner',
          need: 'Busy people feel stressed and have no quick way to reset.', goal: 'Do a five-minute breathing reset.',
          task: '', standard: 'Five minutes, slow breaths, phone away.',
          practice: 'Breathe in for four counts and out for six counts, ten times.', q: 'How long is the out-breath?', a: 'Six counts.',
          status: 'returned', feedback: 'Please add the real-life task: when in the day will the learner do this?', reviewer: 'Demo Trainer B', updated: '2026-11-11T12:00:00Z' }
      ],
      log: []
    };
    MORE.forEach(function (m, i) {
      s.capsules.push({ id: 'cap-more' + (i + 1), title: 'Demo capsule: ' + m[2], path: m[0], level: m[1], author: m[8], need: m[3], goal: m[4], task: m[5], standard: m[6],
        practice: m[7], q: m[9], a: m[10], status: 'published', feedback: '', reviewer: 'Demo Trainer B', updated: '2026-11-09T08:0' + i + ':00Z' });
    });
    var prev = null;
    s.capsules.filter(function (c) { return c.status === 'published'; }).sort(function (a, b) { return a.updated < b.updated ? -1 : 1; }).forEach(function (c) {
      prev = chainEntry(prev, { what: 'published', id: c.id, title: c.title, by: c.reviewer, at: c.updated }); s.log.push(prev);
    });
    return s;
  }

  // ---------- tamper-evident log (simple chained fingerprint) ----------
  function fnv(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function chainEntry(prev, body) {
    var p = prev ? prev.fp : '00000000';
    var e = { what: body.what, id: body.id, title: body.title, by: body.by, at: body.at, prev: p };
    e.fp = fnv(JSON.stringify([e.what, e.id, e.title, e.by, e.at, e.prev]));
    return e;
  }
  function chainOk(log) {
    var p = '00000000';
    for (var i = 0; i < log.length; i++) {
      var e = log[i];
      if (e.prev !== p) return i;
      if (fnv(JSON.stringify([e.what, e.id, e.title, e.by, e.at, e.prev])) !== e.fp) return i;
      p = e.fp;
    }
    return -1;
  }

  // ---------- store ----------
  var S;
  function load() {
    try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
    if (!S || S.v !== 2) { S = seed(); save(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private window: works for this visit only */ } }
  function addLog(what, cap, by) { S.log.push(chainEntry(S.log[S.log.length - 1] || null, { what: what, id: cap.id, title: cap.title, by: by, at: now() })); }
  function pathName(id) { for (var i = 0; i < PATHS.length; i++) if (PATHS[i].id === id) return PATHS[i].name; return id; }
  function cap(id) { for (var i = 0; i < S.capsules.length; i++) if (S.capsules[i].id === id) return S.capsules[i]; return null; }
  function shelf(id) { for (var i = 0; i < S.shelves.length; i++) if (S.shelves[i].id === id) return S.shelves[i]; return null; }
  function param(n) { var m = new RegExp('[?&]' + n + '=([^&]*)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; }

  // ---------- tiny DOM helper ----------
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') el.textContent = attrs[k];
      else if (k === 'on') for (var ev in attrs.on) el.addEventListener(ev, attrs.on[ev]);
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) el.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
      else el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }
  function btn(label, fn, cls, extra) { var a = { type: 'button', class: 'btn ' + (cls || ''), on: { click: fn } }; if (extra) for (var k in extra) a[k] = extra[k]; return h('button', a, label); }
  function field(label, input) { return h('label', { class: 'sp-f' }, h('span', { text: label }), input); }
  function sel(id, opts, val) {
    var s = h('select', { id: id });
    opts.forEach(function (o) { var op = h('option', { value: o[0] }, o[1]); if (String(o[0]) === String(val)) op.selected = true; s.appendChild(op); });
    return s;
  }
  function pathOpts() { return PATHS.map(function (p) { return [p.id, p.id + ' · ' + p.name]; }); }
  var live;
  function say(msg) { if (live) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); } }
  function badge(st) {
    var map = { draft: 'Draft', review: 'In LAB review', returned: 'Returned to author', published: 'Published' };
    return h('span', { class: 'sp-badge sp-' + st }, map[st] || st);
  }

  // ---------- the shared bar on top of every space ----------
  function topbar() {
    var name = h('input', { type: 'text', id: 'sp-me', value: S.me.name, autocomplete: 'name', 'aria-describedby': 'sp-me-hint' });
    name.addEventListener('change', function () { S.me.name = name.value.trim() || 'Demo Learner'; save(); say('Name saved.'); render(); });
    var nav = h('nav', { class: 'sp-switch', 'aria-label': 'The four spaces' },
      [['paver', 'PAVER', 'paver.html'], ['collate', 'COLLATE', 'collate.html'], ['leap', 'LEAP', 'leap.html'], ['lab', 'LAB', 'lab.html']].map(function (x, i) {
        return h('a', { href: x[2], class: 'sp-tab' + (x[0] === SPACE ? ' on' : ''), 'aria-current': x[0] === SPACE ? 'page' : null }, (i + 1) + '. ' + x[1]);
      }));
    return h('div', { class: 'sp-top' }, nav,
      h('div', { class: 'sp-me' }, field('Your name (demo)', name), h('p', { class: 'sp-hint', id: 'sp-me-hint', text: 'Kept only in this browser. Use a demo name.' })));
  }

  // ================= PAVER =================
  function paver(box) {
    var P = S.paver;
    var cur = PATHS.filter(function (p) { return p.id === P.path; })[0] || PATHS[0];
    var tabs = h('div', { class: 'sp-paths', role: 'group', 'aria-label': 'Choose a pathway' }, PATHS.map(function (p) {
      return btn(p.id + ' · ' + p.name, function () { P.path = p.id; save(); render(); say(p.name + ' pathway chosen.'); },
        p.id === P.path ? '' : 'btn-ghost', { 'aria-pressed': p.id === P.path ? 'true' : 'false', 'data-path': p.id });
    }));
    var earned = 0, total = 0, doneN = 0;
    cur.courses.forEach(function (c, i) { var k = cur.id + i; total += CREDITS[i]; if (P.done[k]) { earned += CREDITS[i]; doneN++; } });
    var pubs = S.capsules.filter(function (c) { return c.status === 'published' && c.path === cur.id; });
    pubs.forEach(function (c) { if (P.done['cap:' + c.id]) earned += 1; total += 1; });
    var pct = total ? Math.round(earned * 100 / total) : 0;
    var nextI = -1; for (var i = 0; i < 7; i++) if (!P.done[cur.id + i]) { nextI = i; break; }

    var ladder = h('ol', { class: 'sp-ladder' }, cur.courses.map(function (c, i) {
      var k = cur.id + i, joined = !!P.joined[k], done = !!P.done[k], locked = i > 0 && !P.done[cur.id + (i - 1)] && !done;
      return h('li', { class: 'sp-rung' + (done ? ' done' : '') + (locked ? ' locked' : '') },
        h('div', { class: 'sp-rung-h' }, h('strong', { text: 'L' + (i + 1) + ' · Demo: ' + c }), h('span', { class: 'sp-cr', text: CREDITS[i] + ' credits' })),
        h('div', { class: 'sp-row' },
          done ? h('span', { class: 'sp-badge sp-published', text: 'Certificate earned' }) :
          locked ? h('span', { class: 'sp-hint', text: 'Opens after L' + i + '.' }) :
          !joined ? btn('Join', function () { P.joined[k] = 1; save(); render(); say('Joined L' + (i + 1) + '.'); }, '', { 'data-act': 'join-' + i }) :
          btn('Mark finished', function () { P.done[k] = 1; save(); render(); say('L' + (i + 1) + ' finished. Credits added.'); }, '', { 'data-act': 'done-' + i }),
          done ? btn('Undo', function () { delete P.done[k]; save(); render(); }, 'btn-ghost btn-sm') : null));
    }));

    var capList = pubs.length ? h('div', { class: 'lh' }, pubs.map(function (c) {
      var k = 'cap:' + c.id;
      return h('div', { class: 'c ok' }, h('h3', { text: c.title }), h('p', { text: 'Goal: ' + c.goal }),
        h('details', null, h('summary', null, 'Open capsule'),
          h('p', null, h('strong', null, 'Task: '), c.task), h('p', null, h('strong', null, 'Standard: '), c.standard),
          h('p', null, h('strong', null, 'Practice: '), c.practice), h('p', null, h('strong', null, 'Check: '), c.q),
          h('p', { class: 'sp-hint', text: 'Author ' + c.author + ' · approved in LAB by ' + c.reviewer })),
        P.done[k] ? h('span', { class: 'sp-badge sp-published', text: 'Done · 1 credit' }) :
          btn('Mark done (+1 credit)', function () { P.done[k] = 1; save(); render(); say('Capsule done.'); }, 'btn-ghost'));
    })) : h('p', { class: 'sp-hint', text: 'No published capsules on this pathway yet. Build one in LEAP and approve it in LAB, and it appears here.' });

    box.appendChild(h('div', { class: 'sp-card' },
      h('h3', { text: 'Step 1. Choose your pathway' }), tabs,
      h('p', { class: 'sp-lead', text: cur.name + ': ' + cur.blurb })));
    box.appendChild(h('div', { class: 'sp-card' },
      h('h3', { text: 'Your progress on ' + cur.name }),
      h('div', { class: 'lhbar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': 'Progress' }, h('i', { style: 'width:' + pct + '%' })),
      h('p', { id: 'sp-progress', text: earned + ' of ' + total + ' credits · ' + doneN + ' of 7 levels · ' + pct + '%' }),
      h('p', { class: 'sp-next', text: nextI >= 0 ? 'Your next step: L' + (nextI + 1) + ' · Demo: ' + cur.courses[nextI] : 'You finished all seven levels of this pathway. Well done.' })));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 2. Climb the ladder: seven levels' }), ladder));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 3. Short capsules on this pathway (from LAB)' }), capList));

    var lvl = 0; for (var j = 0; j < 7; j++) if (P.done[cur.id + j]) lvl = j + 1; else break;
    var roles = h('ul', { class: 'sp-roles', id: 'sp-roles' }, ROLES[cur.id].map(function (r) {
      var ready = lvl >= r[1];
      return h('li', { class: ready ? 'ok' : 'no' }, h('strong', { text: r[0] }), ' ',
        h('span', { class: 'sp-badge ' + (ready ? 'sp-published' : 'sp-draft'), text: ready ? 'You are ready to apply' : 'Needs L' + r[1] + ' (you have L' + lvl + ')' }));
    }));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 4. Where it leads: jobs and certificates' }),
      h('p', { class: 'sp-hint', text: 'Finish levels in order. Each finished level is a certificate; roles open as you climb.' }), roles,
      h('div', { class: 'sp-row' },
        h('a', { class: 'btn', href: 'career-portal.html', 'data-act': 'to-careers' }, 'Open the career portal'),
        h('a', { class: 'btn btn-ghost', href: 'certificate-hub.html', 'data-act': 'to-certs' }, 'See my certificates'),
        h('a', { class: 'btn btn-ghost', href: 'career-pathways.html' }, 'All career pathways'))));
  }

  // ================= COLLATE =================
  function collate(box) {
    var curId = param('shelf') && shelf(param('shelf')) ? param('shelf') : (S.cur || (S.shelves[0] && S.shelves[0].id));
    var cur = shelf(curId);
    // new shelf
    var t = h('input', { type: 'text', id: 'sp-new-topic', placeholder: 'For example: Reading a drawing' });
    var p = sel('sp-new-path', pathOpts(), 'P');
    var make = h('form', { class: 'sp-form', on: { submit: function (ev) {
      ev.preventDefault(); var v = t.value.trim(); if (!v) { say('Please type a topic first.'); t.focus(); return; }
      var s = { id: uid('sh'), topic: v, path: p.value, items: [] }; S.shelves.unshift(s); S.cur = s.id; save(); render(); say('Shelf made.');
    } } }, field('Topic', t), field('Pathway', p), h('button', { class: 'btn', type: 'submit', 'data-act': 'new-shelf' }, 'Make the shelf'));

    var list = h('div', { class: 'sp-shelves', role: 'group', 'aria-label': 'Your shelves' }, S.shelves.map(function (s) {
      return btn(s.topic + ' (' + s.items.length + ')', function () { S.cur = s.id; save(); render(); }, s.id === curId ? '' : 'btn-ghost', { 'aria-pressed': s.id === curId ? 'true' : 'false' });
    }));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 1. Pick or make a shelf' }), list, make));
    if (!cur) return;

    // add item
    var kind = sel('sp-kind', [['Note', 'Note'], ['Link', 'Link'], ['Example', 'Example'], ['Video', 'Video'], ['Practice', 'Practice'], ['Question', 'Question']], 'Note');
    var it = h('input', { type: 'text', id: 'sp-item-title', placeholder: 'Short title' });
    var tx = h('textarea', { id: 'sp-item-text', rows: '3', placeholder: 'What it says, in your own words' });
    var add = h('form', { class: 'sp-form', on: { submit: function (ev) {
      ev.preventDefault(); if (!it.value.trim()) { say('Please give the item a title.'); it.focus(); return; }
      cur.items.push({ id: uid('it'), kind: kind.value, title: it.value.trim(), text: tx.value.trim() }); save(); render(); say('Added to the board.');
    } } }, field('Kind', kind), field('Title', it), field('Text', tx), h('button', { class: 'btn', type: 'submit', 'data-act': 'add-item' }, 'Add to the board'));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 2. Collect: ' + cur.topic }), h('p', { class: 'sp-hint', text: 'Pathway: ' + pathName(cur.path) }), add));

    // board
    var board = h('ul', { class: 'sp-board', id: 'sp-board' }, cur.items.map(function (x, i) {
      return h('li', { class: 'sp-note sp-k-' + x.kind.toLowerCase() },
        h('span', { class: 'sp-kind', text: x.kind }), h('strong', { text: x.title }), h('p', { text: x.text }),
        h('div', { class: 'sp-row' },
          btn('Up', function () { if (i > 0) { var a = cur.items.splice(i, 1)[0]; cur.items.splice(i - 1, 0, a); save(); render(); } }, 'btn-ghost btn-sm', { 'aria-label': 'Move ' + x.title + ' up', disabled: i === 0 }),
          btn('Down', function () { if (i < cur.items.length - 1) { var a = cur.items.splice(i, 1)[0]; cur.items.splice(i + 1, 0, a); save(); render(); } }, 'btn-ghost btn-sm', { 'aria-label': 'Move ' + x.title + ' down', disabled: i === cur.items.length - 1 }),
          btn('Remove', function () { cur.items.splice(i, 1); save(); render(); say('Removed.'); }, 'btn-ghost btn-sm', { 'aria-label': 'Remove ' + x.title })));
    }));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 3. Arrange the board' }),
      cur.items.length ? board : h('p', { class: 'sp-hint', text: 'The board is empty. Add your first item above.' })));

    // storyboard
    var story = h('ol', { class: 'sp-story' }, cur.items.map(function (x) { return h('li', null, h('span', { class: 'sp-kind', text: x.kind }), h('strong', { text: x.title })); }));
    var exp = btn('Download the shelf (file)', function () {
      var blob = new Blob([JSON.stringify(cur, null, 2)], { type: 'application/json' });
      var a = h('a', { href: URL.createObjectURL(blob), download: 'shelf-' + cur.id + '.json' }); document.body.appendChild(a); a.click(); a.remove(); say('Shelf file saved.');
    }, 'btn-ghost');
    var del = btn('Delete this shelf', function () {
      if (del.getAttribute('data-sure') !== '1') { del.setAttribute('data-sure', '1'); del.textContent = 'Press again to delete'; return; }
      S.shelves = S.shelves.filter(function (s) { return s.id !== cur.id; }); S.cur = null; save(); render(); say('Shelf deleted.');
    }, 'btn-ghost');
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 4. Storyboard and share' }),
      cur.items.length ? story : h('p', { class: 'sp-hint', text: 'Frames appear here in board order.' }),
      h('div', { class: 'sp-row' }, h('a', { class: 'btn', href: 'leap.html?shelf=' + encodeURIComponent(cur.id), 'data-act': 'to-leap' }, 'Turn this shelf into a LEAP capsule'), exp, del)));
  }

  // ================= LEAP =================
  function autoChecks(c) {
    var words = (c.need || '').trim().split(/\s+/).filter(Boolean).length;
    var sentences = (c.need || '').split(/[.!?]+/).filter(function (x) { return x.trim(); }).length;
    return [
      !!c.need && sentences === 1 && words <= 30,
      !!(c.goal && c.goal.trim().length > 8),
      !!(c.task && c.task.trim().length > 8),
      !!(c.standard && c.standard.trim().length > 4),
      !!(c.practice && c.practice.trim().length > 4),
      !!(c.q && c.q.trim() && c.a && c.a.trim()),
      !!(c.title && c.title.trim())
    ];
  }
  function leap(box) {
    var editId = S.edit && cap(S.edit) && cap(S.edit).status !== 'published' && cap(S.edit).status !== 'review' ? S.edit : null;
    var from = param('shelf') ? shelf(param('shelf')) : null;
    var c = editId ? cap(editId) : { title: '', path: from ? from.path : 'P', level: 1, need: '', goal: '', task: '', standard: '', practice: '', q: '', a: '' };
    if (!editId && from && !S._prefilled) {
      c.title = 'Capsule: ' + from.topic.replace(/^Demo shelf:\s*/, '');
      var pr = from.items.filter(function (x) { return x.kind === 'Practice'; })[0];
      if (pr) c.practice = pr.text;
      var nt = from.items.filter(function (x) { return x.kind === 'Note'; })[0];
      if (nt) c.need = nt.text.split(/(?<=[.!?])\s/)[0];
      c.shelf = from.id;
    }
    function inp(id, label, val, area, hint) {
      var el = area ? h('textarea', { id: id, rows: '2' }) : h('input', { type: 'text', id: id });
      el.value = val || '';
      el.addEventListener('input', meter);
      return h('div', null, field(label, el), hint ? h('p', { class: 'sp-hint', text: hint }) : null);
    }
    var form = h('form', { class: 'sp-form', id: 'sp-leap-form', novalidate: true },
      inp('c-title', 'Capsule title', c.title),
      field('Pathway', sel('c-path', pathOpts(), c.path)),
      field('Level', sel('c-level', [1, 2, 3, 4, 5, 6, 7].map(function (n) { return [n, 'L' + n]; }), c.level)),
      inp('c-need', '1. The need (one sentence)', c.need, true, 'Who struggles with what? One sentence only.'),
      inp('c-goal', '2. The goal', c.goal, true, 'What can the learner do at the end?'),
      inp('c-task', '3. The real task', c.task, true, 'A real job or life task.'),
      inp('c-standard', '4. The standard', c.standard, true, 'How good is good enough?'),
      inp('c-practice', '5. Practice', c.practice, true),
      inp('c-q', '6. Check question', c.q),
      inp('c-a', '6b. Right answer', c.a));
    var meterBox = h('ul', { class: 'sp-checks', id: 'sp-meter', 'aria-live': 'polite' });
    function read() {
      function v(id) { return (document.getElementById(id) || {}).value || ''; }
      return { title: v('c-title').trim(), path: v('c-path'), level: +v('c-level') || 1, need: v('c-need').trim(), goal: v('c-goal').trim(), task: v('c-task').trim(),
        standard: v('c-standard').trim(), practice: v('c-practice').trim(), q: v('c-q').trim(), a: v('c-a').trim() };
    }
    function meter() {
      var r = autoChecks(read()), n = r.filter(Boolean).length;
      meterBox.textContent = '';
      CHECKS.forEach(function (t, i) { meterBox.appendChild(h('li', { class: r[i] ? 'ok' : 'no' }, (r[i] ? 'Ready: ' : 'Not yet: ') + t)); });
      var b = document.getElementById('sp-send'); if (b) b.disabled = n < 7;
      var s = document.getElementById('sp-score'); if (s) s.textContent = n + ' of 7 ready';
    }
    function store(status) {
      var d = read();
      if (!d.title) { say('Please give the capsule a title.'); document.getElementById('c-title').focus(); return; }
      var target = editId ? cap(editId) : null;
      if (!target) { target = { id: uid('cap'), author: S.me.name, feedback: '', reviewer: '' }; S.capsules.unshift(target); }
      for (var k in d) target[k] = d[k];
      if (c.shelf) target.shelf = c.shelf;
      target.author = target.author || S.me.name;
      target.status = status; target.updated = now();
      if (status === 'review') { target.feedback = ''; addLog('sent to LAB', target, S.me.name); }
      S.edit = status === 'draft' ? target.id : null; S._prefilled = !!param('shelf');
      save();
      if (status === 'review') { history.replaceState(null, '', 'leap.html'); S._prefilled = false; save(); }
      render(); say(status === 'review' ? 'Sent to LAB for checking.' : 'Draft saved.');
    }
    box.appendChild(h('div', { class: 'sp-card' },
      h('h3', { text: editId ? 'Fix your capsule' : 'Build a capsule' }),
      from && !editId ? h('p', { class: 'sp-hint', text: 'Started from the COLLATE shelf "' + from.topic + '".' }) : null,
      editId && c.feedback ? h('p', { class: 'sp-fb', text: 'LAB feedback: ' + c.feedback }) : null,
      form,
      h('h4', null, 'Seven-line readiness ', h('span', { id: 'sp-score', class: 'sp-badge' })), meterBox,
      h('div', { class: 'sp-row' },
        btn('Save draft', function () { store('draft'); }, 'btn-ghost', { 'data-act': 'save-draft' }),
        btn('Send to LAB', function () { store('review'); }, '', { id: 'sp-send', 'data-act': 'send-lab' }),
        editId ? btn('Start a new capsule', function () { S.edit = null; save(); render(); }, 'btn-ghost') : null)));
    meter();

    var mine = S.capsules.filter(function (x) { return x.author === S.me.name; });
    var tbl = h('table', null, h('thead', null, h('tr', null, h('th', null, 'Capsule'), h('th', null, 'Pathway'), h('th', null, 'Status'), h('th', null, 'Action'))),
      h('tbody', null, mine.map(function (x) {
        return h('tr', null, h('td', { text: x.title }), h('td', { text: pathName(x.path) + ' · L' + x.level }), h('td', null, badge(x.status), x.feedback ? h('p', { class: 'sp-hint', text: x.feedback }) : null),
          h('td', null, x.status === 'draft' || x.status === 'returned' ? btn('Open and fix', function () { S.edit = x.id; save(); history.replaceState(null, '', 'leap.html'); render(); window.scrollTo(0, root.offsetTop); }, 'btn-ghost btn-sm', { 'data-act': 'fix-' + x.id }) :
            x.status === 'published' ? h('a', { href: 'paver.html', class: 'btn btn-ghost btn-sm' }, 'See it in PAVER') : h('a', { href: 'lab.html', class: 'btn btn-ghost btn-sm' }, 'Waiting in LAB')));
      })));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'My capsules (' + S.me.name + ')' }),
      mine.length ? h('div', { class: 'lh sp-table' }, tbl) : h('p', { class: 'sp-hint', text: 'None yet under this name.' })));
  }

  // ================= LAB =================
  function lab(box) {
    var rv = h('input', { type: 'text', id: 'sp-reviewer', value: S.reviewer || '' });
    rv.addEventListener('change', function () { S.reviewer = rv.value.trim(); save(); render(); say('Reviewer name saved.'); });
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Who is checking?' }), field('Reviewer name (demo)', rv),
      h('p', { class: 'sp-hint', text: 'Rule: the author never approves their own capsule. A separate approver signs off.' })));

    var queue = S.capsules.filter(function (x) { return x.status === 'review'; });
    var pick = S.labPick && cap(S.labPick) && cap(S.labPick).status === 'review' ? cap(S.labPick) : queue[0];
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 1. The queue (' + queue.length + ' waiting)' }),
      queue.length ? h('div', { class: 'sp-shelves' }, queue.map(function (x) {
        return btn(x.title, function () { S.labPick = x.id; save(); render(); }, pick && pick.id === x.id ? '' : 'btn-ghost', { 'aria-pressed': pick && pick.id === x.id ? 'true' : 'false' });
      })) : h('p', { class: 'sp-hint', text: 'Nothing waiting. Send a capsule from LEAP to see it here.' })));

    if (pick) {
      var ticks = CHECKS.map(function (t, i) {
        var cb = h('input', { type: 'checkbox', id: 'chk' + i, 'data-chk': String(i) });
        cb.addEventListener('change', gate);
        return h('li', null, h('label', { for: 'chk' + i }, cb, ' ' + (i + 1) + '. ' + t));
      });
      var fb = h('textarea', { id: 'sp-feedback', rows: '3', placeholder: 'What should the author fix? Be kind and exact.' });
      var same = (S.reviewer || '').trim().toLowerCase() === (pick.author || '').trim().toLowerCase();
      var why = h('p', { class: 'sp-fb', id: 'sp-why', 'aria-live': 'polite' });
      var ap = btn('Approve and publish', function () {
        if (same) return;
        pick.status = 'published'; pick.reviewer = S.reviewer; pick.updated = now(); pick.feedback = '';
        addLog('published', pick, S.reviewer); S.labPick = null; save(); render(); say('Published. It now shows in PAVER.');
      }, '', { id: 'sp-approve', 'data-act': 'approve', disabled: true });
      var rt = btn('Return to author with feedback', function () {
        if (!fb.value.trim()) { say('Please write the feedback first.'); fb.focus(); return; }
        pick.status = 'returned'; pick.feedback = fb.value.trim(); pick.reviewer = S.reviewer; pick.updated = now();
        addLog('returned', pick, S.reviewer); S.labPick = null; save(); render(); say('Returned to the author.');
      }, 'btn-ghost', { 'data-act': 'return' });
      function gate() {
        var all = ticks.every(function (li) { return li.querySelector('input').checked; });
        ap.disabled = !all || same || !(S.reviewer || '').trim();
        why.textContent = same ? 'You wrote this capsule, so you cannot approve it. Ask another trainer.' :
          !(S.reviewer || '').trim() ? 'Type your reviewer name first.' : all ? 'All seven lines ticked. You can approve.' : 'Tick all seven lines to approve, or return it with feedback.';
      }
      box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 2. Check: ' + pick.title }),
        h('dl', { class: 'sp-dl' }, [['Author', pick.author], ['Pathway', pathName(pick.path) + ' · L' + pick.level], ['Need', pick.need], ['Goal', pick.goal], ['Task', pick.task], ['Standard', pick.standard], ['Practice', pick.practice], ['Check', pick.q + '  (answer: ' + pick.a + ')']]
          .map(function (r) { return [h('dt', { text: r[0] }), h('dd', { text: r[1] || '(empty)' })]; }).reduce(function (a, b) { return a.concat(b); }, [])),
        h('h4', null, 'The seven-line check'), h('ul', { class: 'sp-checklist' }, ticks),
        field('Feedback', fb), why, h('div', { class: 'sp-row' }, ap, rt)));
      gate();
    }

    var bad = chainOk(S.log);
    var logT = h('table', null, h('thead', null, h('tr', null, h('th', null, 'When'), h('th', null, 'What'), h('th', null, 'Capsule'), h('th', null, 'By'), h('th', null, 'Fingerprint'))),
      h('tbody', null, S.log.slice().reverse().map(function (e) {
        return h('tr', null, h('td', { text: e.at.slice(0, 16).replace('T', ' ') }), h('td', { text: e.what }), h('td', { text: e.title }), h('td', { text: e.by }), h('td', null, h('code', { text: e.fp })));
      })));
    box.appendChild(h('div', { class: 'sp-card' }, h('h3', { text: 'Step 3. The log (tamper-evident)' }),
      h('p', { id: 'sp-chain', class: bad < 0 ? 'sp-okline' : 'sp-fb', text: bad < 0 ? 'Log check: all ' + S.log.length + ' entries link up. Nothing was changed.' : 'Log check: entry ' + (bad + 1) + ' does not match. Something was changed.' }),
      h('div', { class: 'lh sp-table' }, logT)));
  }

  // ---------- render ----------
  function render() {
    root.textContent = '';
    live = h('p', { class: 'sp-live', role: 'status', 'aria-live': 'polite' });
    root.appendChild(topbar());
    root.appendChild(live);
    var box = h('div', { class: 'sp-body' });
    root.appendChild(box);
    ({ paver: paver, collate: collate, leap: leap, lab: lab }[SPACE] || paver)(box);
    root.appendChild(h('div', { class: 'sp-row sp-foot' },
      h('span', { class: 'sp-hint', text: 'Demo data, kept only in this browser.' }),
      btn('Reset demo data', function () { S = seed(); save(); history.replaceState(null, '', location.pathname); render(); say('Demo data reset.'); }, 'btn-ghost btn-sm', { 'data-act': 'reset' })));
  }
  load();
  render();
  root.setAttribute('data-ready', '1');
})();
