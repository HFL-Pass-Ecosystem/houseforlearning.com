/* Meeting notes and actions: agenda, notes, decisions and actions for on-site, online and mixed meetings. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var meets = K.get('mtgMeetings'), seeded = K.get('mtgSeeded'), meSaved = K.get('mtgMe');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var team = (W && Array.isArray(W.team) ? W.team : []).map(function (x) { return String(x || '').slice(0, 50); }).filter(function (x) { return x; });
  if (team.length < 3) team = ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dina', 'Demo Eli', 'Demo Farah'];
  var current = null, draftPoints = [];

  function pad(n) { return ('0' + n).slice(-2); }
  function day(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return day(new Date()); }
  function shift(n) { var d = new Date(); d.setDate(d.getDate() + n); return day(d); }
  function stamp() { var d = new Date(); return day(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function me() { return $('me').value; }
  function log(m, what) { m.log = m.log || []; m.log.push({ at: stamp(), who: me(), what: what }); }
  function find(id) { for (var i = 0; i < meets.length; i++) if (meets[i].id === id) return meets[i]; return null; }
  function clean(t, max) { return String(t || '').replace(/[<>]/g, '').trim().slice(0, max); }

  /* Refuse money amounts, phone numbers and emails in typed text. */
  function badText(t) {
    if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(t)) return 'an email address';
    var runs = t.match(/\+?\d[\d\s().\-]{7,}\d/g) || [];
    for (var i = 0; i < runs.length; i++) if (runs[i].replace(/\D/g, '').length >= 10) return 'a phone number';
    if (/[$€£₹¥]|\b(rs|inr|usd|eur|gbp|rupees?|dollars?|euros?|pounds?|lakhs?|crores?)\b/i.test(t)) return 'a price or money amount';
    return '';
  }
  function check(t, what) {
    var b = badText(t);
    if (b) { K.say('Not saved: ' + what + ' looks like it has ' + b + '. Please leave out prices, money, phone numbers and emails.'); return false; }
    return true;
  }

  /* Samples */
  function sample() {
    var T = team;
    var a1 = { id: K.id(), what: 'Put new fire exit signs on floor two', who: T[2], due: shift(-4), st: 'open' };
    var a2 = { id: K.id(), what: 'Share the updated first aid list with all teams', who: T[3], due: shift(-9), st: 'done', askBy: T[3], doneBy: T[0], doneAt: shift(-8) + ' 10:15' };
    var a3 = { id: K.id(), what: 'Book a practice fire drill with the site team', who: T[4], due: shift(5), st: 'asked', askBy: T[4], askAt: shift(-1) + ' 16:40' };
    var a4 = { id: K.id(), what: 'Write a short guide for joining mixed meetings', who: T[1], due: shift(7), st: 'open' };
    var a5 = { id: K.id(), what: 'Test the room camera and microphone before each meeting', who: T[5] || T[0], due: shift(-1), st: 'open' };
    return [
      { id: K.id(), title: 'Demo monthly safety meeting', date: shift(-12), where: 'On site', chair: T[0], taker: T[1], people: [T[0], T[1], T[2], T[3], T[4]],
        points: [{ id: K.id(), title: 'Fire exits and signs', notes: 'Two signs on floor two are faded. The stairs are clear.', decisions: 'Replace the faded signs this month.', actions: [a1] },
          { id: K.id(), title: 'First aid', notes: 'The first aid list on the board is old.', decisions: 'Keep one list and update it each quarter.', actions: [a2] },
          { id: K.id(), title: 'Fire drill', notes: 'The last drill was a long time ago.', decisions: 'Hold a practice drill next month.', actions: [a3] }],
        approved: { by: T[0], at: shift(-11) + ' 09:30' },
        log: [{ at: shift(-12) + ' 09:00', who: T[1], what: 'Set up the meeting' }, { at: shift(-12) + ' 10:05', who: T[1], what: 'Saved notes' }, { at: shift(-11) + ' 09:30', who: T[0], what: 'Approved the minutes (locked)' }] },
      { id: K.id(), title: 'Demo weekly team catch-up', date: shift(-3), where: 'Mixed', chair: T[2], taker: T[3], people: [T[0], T[1], T[2], T[3], T[5] || T[4]],
        points: [{ id: K.id(), title: 'Mixed meeting set-up', notes: 'People online could not hear the room well.', decisions: 'Test the room kit before each meeting.', actions: [a5, a4] },
          { id: K.id(), title: 'Next week plan', notes: '', decisions: '', actions: [] }],
        approved: null,
        log: [{ at: shift(-3) + ' 11:00', who: T[3], what: 'Set up the meeting' }, { at: shift(-3) + ' 11:40', who: T[3], what: 'Saved notes' }] }
    ];
  }
  if (!meets.length && !seeded.length) { sample().forEach(function (m) { meets.push(m); }); seeded.push('yes'); K.save(); }

  /* People selects */
  function fill(sel, names, first) {
    K.clear(sel);
    if (first) sel.appendChild(h('option', { value: '', text: first }));
    names.forEach(function (n) { sel.appendChild(h('option', { value: n, text: n })); });
  }
  fill($('me'), team); fill($('nChair'), team, 'Pick the chair'); fill($('nTaker'), team, 'Pick the note-taker');
  if (meSaved[0] && team.indexOf(meSaved[0]) >= 0) $('me').value = meSaved[0];
  $('me').addEventListener('change', function () { meSaved.length = 0; meSaved.push(me()); K.save(); K.say('You are now acting as ' + me() + '.'); drawActs(); drawList(); });
  team.forEach(function (n, i) {
    $('nPeople').appendChild(h('label', { class: 'k-check' }, [h('input', { type: 'checkbox', id: 'np' + i, value: n }), h('span', { text: n })]));
  });
  $('nDate').value = today();

  /* Tabs */
  var TABS = ['New', 'Act', 'List'];
  function show(n) {
    TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
    if (n === 'Act') drawActs(); if (n === 'List') drawList(); if (n === 'New') drawRun();
  }
  TABS.forEach(function (n) { $('t' + n).addEventListener('click', function () { show(n); }); });

  /* New meeting: agenda points */
  function drawDraft() {
    var ul = K.clear($('nPoints'));
    draftPoints.forEach(function (p, i) {
      ul.appendChild(h('li', { class: 'k-item' }, [h('p', { text: (i + 1) + '. ' + p }), h('div', { class: 'k-mini' }, [
        K.btn('Up', function () { K.move(draftPoints, i, -1); drawDraft(); }),
        K.btn('Down', function () { K.move(draftPoints, i, 1); drawDraft(); }),
        K.btn('Remove', function () { draftPoints.splice(i, 1); drawDraft(); })])]));
    });
    if (!draftPoints.length) ul.appendChild(h('li', { class: 'k-note', text: 'No agenda points yet. Add at least one.' }));
  }
  $('nAdd').addEventListener('click', function () {
    var t = clean($('nPoint').value, 100);
    if (!t) { K.say('Please write the agenda point first.'); $('nPoint').focus(); return; }
    if (!check(t, 'the agenda point')) return;
    draftPoints.push(t); $('nPoint').value = ''; $('nPoint').focus(); drawDraft(); K.say('Agenda point added.');
  });
  $('nPoint').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('nAdd').click(); } });
  $('nStart').addEventListener('click', function () {
    var title = clean($('nTitle').value, 80), d = $('nDate').value, chair = $('nChair').value, taker = $('nTaker').value;
    if (!title) { K.say('Please write a title for the meeting.'); $('nTitle').focus(); return; }
    if (!check(title, 'the title')) return;
    if (!d) { K.say('Please pick a date.'); $('nDate').focus(); return; }
    if (!chair) { K.say('Please pick the chair.'); $('nChair').focus(); return; }
    if (!taker) { K.say('Please pick the note-taker.'); $('nTaker').focus(); return; }
    if (chair === taker) { K.say('Not saved: the chair and the note-taker must be two different people. The chair checks what the note-taker writes.'); $('nTaker').focus(); return; }
    if (!draftPoints.length) { K.say('Please add at least one agenda point.'); $('nPoint').focus(); return; }
    var people = team.filter(function (n, i) { return $('np' + i).checked || n === chair || n === taker; });
    var m = { id: K.id(), title: title, date: d, where: $('nWhere').value, chair: chair, taker: taker, people: people,
      points: draftPoints.map(function (p) { return { id: K.id(), title: p, notes: '', decisions: '', actions: [] }; }), approved: null, log: [] };
    log(m, 'Set up the meeting');
    meets.push(m);
    if (!K.save()) return;
    draftPoints = []; drawDraft(); $('nTitle').value = '';
    team.forEach(function (n, i) { $('np' + i).checked = false; });
    current = m.id; drawRun();
    K.say('Meeting saved: ' + title + '. Write notes for each point below.');
    $('run').scrollIntoView();
  });

  /* During the meeting */
  function readNotes(m) {
    var out = [];
    for (var i = 0; i < m.points.length; i++) {
      var p = m.points[i], n = $('pn-' + p.id), d = $('pd-' + p.id);
      if (!n) continue;
      var nv = clean(n.value, 2000), dv = clean(d.value, 1000);
      if (!check(nv, 'the notes for "' + p.title + '"') || !check(dv, 'the decisions for "' + p.title + '"')) return null;
      out.push([p, nv, dv]);
    }
    return out;
  }
  function saveNotes(m, quiet) {
    if (m.approved) { K.say('Refused: these minutes were approved by ' + m.approved.by + ' and are locked. They cannot be changed.'); return false; }
    var r = readNotes(m); if (!r) return false;
    var changed = false;
    r.forEach(function (x) { if (x[0].notes !== x[1] || x[0].decisions !== x[2]) changed = true; x[0].notes = x[1]; x[0].decisions = x[2]; });
    if (changed) log(m, 'Saved notes');
    if (!K.save()) return false;
    if (!quiet) K.say(changed ? 'Notes saved for ' + m.title + '.' : 'Nothing changed. Notes are already saved.');
    return true;
  }
  function drawRun() {
    var m = current && find(current), box = K.clear($('rPoints'));
    $('run').hidden = !m; if (!m) return;
    var lock = !!m.approved;
    $('rHead').textContent = 'During the meeting: ' + m.title;
    $('rInfo').textContent = m.date + ', ' + m.where + '. Chair: ' + m.chair + '. Note-taker: ' + m.taker + '. Attendees: ' + m.people.join(', ') + '.' +
      (lock ? ' Approved by ' + m.approved.by + ' on ' + m.approved.at + '. Locked: no changes allowed.' : '');
    m.points.forEach(function (p, i) {
      var acts = h('ul', { class: 'k-list' });
      p.actions.forEach(function (a, j) {
        acts.appendChild(h('li', { class: 'k-item' }, [h('p', { text: a.what + '\nWho: ' + a.who + '. Due: ' + a.due + '.' }),
          lock ? null : h('div', { class: 'k-mini' }, [K.btn('Remove action', function () {
            if (!saveNotes(m, true)) return;
            p.actions.splice(j, 1); log(m, 'Removed action: ' + a.what); if (K.save()) K.say('Action removed.'); drawRun(); })])]));
      });
      var who = h('select', { class: 'k-in', id: 'ao-' + p.id }); fill(who, m.people, 'Pick who');
      box.appendChild(h('div', { class: 'k-item' }, [
        h('h3', { text: (i + 1) + '. ' + p.title }),
        h('label', { class: 'k-lab', for: 'pn-' + p.id, text: 'Notes' }),
        h('textarea', { class: 'k-in', id: 'pn-' + p.id, maxlength: '2000', disabled: lock }),
        h('label', { class: 'k-lab', for: 'pd-' + p.id, text: 'Decisions' }),
        h('textarea', { class: 'k-in', id: 'pd-' + p.id, maxlength: '1000', disabled: lock }),
        h('p', { class: 'k-lab', text: 'Actions' }), acts,
        lock ? null : h('div', { class: 'k-row' }, [
          h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: 'aw-' + p.id, text: 'New action: what' }), h('input', { class: 'k-in', id: 'aw-' + p.id, maxlength: '140' })]),
          h('div', {}, [h('label', { class: 'k-lab', for: 'ao-' + p.id, text: 'Who' }), who]),
          h('div', {}, [h('label', { class: 'k-lab', for: 'ad-' + p.id, text: 'Due date' }), h('input', { class: 'k-in', type: 'date', id: 'ad-' + p.id })]),
          K.btn('Add action', function () { addAction(m, p); }, 'k-small')])]));
      $('pn-' + p.id).value = p.notes; $('pd-' + p.id).value = p.decisions;
    });
  }
  function addAction(m, p) {
    if (m.approved) { K.say('Refused: these minutes are locked.'); return; }
    var what = clean($('aw-' + p.id).value, 140), who = $('ao-' + p.id).value, due = $('ad-' + p.id).value;
    if (!what) { K.say('Please write what the action is.'); $('aw-' + p.id).focus(); return; }
    if (!check(what, 'the action')) return;
    if (!who) { K.say('Please pick who does the action.'); $('ao-' + p.id).focus(); return; }
    if (!due) { K.say('Please pick a due date for the action.'); $('ad-' + p.id).focus(); return; }
    if (!saveNotes(m, true)) return;
    p.actions.push({ id: K.id(), what: what, who: who, due: due, st: 'open' });
    log(m, 'Added action for ' + who + ': ' + what);
    if (K.save()) K.say('Action added for ' + who + ', due ' + due + '.');
    drawRun();
  }
  $('rSave').addEventListener('click', function () { var m = find(current); if (m) saveNotes(m); });
  $('rClose').addEventListener('click', function () {
    var m = find(current);
    if (m && !m.approved && !saveNotes(m, true)) return;
    current = null; drawRun(); K.say('Meeting closed. Open it again from the Meetings tab.');
  });

  /* Actions across meetings */
  function allActs() {
    var out = [];
    meets.forEach(function (m) { m.points.forEach(function (p) { p.actions.forEach(function (a) { out.push({ a: a, m: m, p: p }); }); }); });
    return out.sort(function (x, y) { return x.a.due < y.a.due ? -1 : x.a.due > y.a.due ? 1 : 0; });
  }
  function checker(m, a) { return a.who === m.chair ? m.taker : m.chair; }
  var AST = { open: 'Open', asked: 'Reported done, waiting for check', done: 'Done (confirmed)' };
  function drawActs() {
    var ul = K.clear($('aList')), list = allActs(), t = today(), mode = $('aShow').value;
    var open = list.filter(function (x) { return x.a.st !== 'done'; }), late = open.filter(function (x) { return x.a.due < t; });
    $('aSum').textContent = open.length + ' open action(s), ' + late.length + ' overdue, ' + (list.length - open.length) + ' done.';
    (mode === 'all' ? list : open).forEach(function (x) {
      var a = x.a, m = x.m, ck = checker(m, a), over = a.st !== 'done' && a.due < t, btns = [];
      if (a.st === 'open') btns.push(K.btn('Report done', function () { report(x); }));
      if (a.st === 'asked') { btns.push(K.btn('Confirm done (' + ck + ')', function () { confirmDone(x); }, 'k-small')); btns.push(K.btn('Not done yet', function () { reopen(x); })); }
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: a.what }),
        h('p', { text: 'Who: ' + a.who + '. Due: ' + a.due + '.\nMeeting: ' + m.title + ' (' + m.date + '), point: ' + x.p.title + '.\nChecked by: ' + ck +
          (a.st === 'asked' ? '\nReported done by ' + a.askBy + ' on ' + a.askAt + '.' : '') + (a.st === 'done' ? '\nConfirmed by ' + a.doneBy + ' on ' + a.doneAt + '.' : '') }),
        h('p', {}, [h('span', { class: 'k-tag' + (a.st === 'done' ? ' k-ok' : ''), text: AST[a.st] }), over ? h('span', { class: 'k-tag k-warn', text: 'Overdue' }) : null]),
        btns.length ? h('div', { class: 'k-mini' }, btns) : null]));
    });
    if (!ul.firstChild) ul.appendChild(h('li', { class: 'k-note', text: mode === 'all' ? 'No actions yet.' : 'No open actions. Well done.' }));
  }
  $('aShow').addEventListener('change', drawActs);
  function report(x) {
    x.a.st = 'asked'; x.a.askBy = me(); x.a.askAt = stamp();
    log(x.m, me() + ' reported done: ' + x.a.what);
    if (K.save()) K.say('Reported as done. Now ' + checker(x.m, x.a) + ' must confirm it.');
    drawActs();
  }
  function confirmDone(x) {
    var ck = checker(x.m, x.a);
    if (me() === x.a.who) { K.say('Refused: ' + x.a.who + ' owns this action, so cannot confirm it. ' + ck + ' must confirm it.'); return; }
    if (me() !== ck) { K.say('Refused: only ' + ck + ' can confirm this action. You are acting as ' + me() + '.'); return; }
    x.a.st = 'done'; x.a.doneBy = me(); x.a.doneAt = stamp();
    log(x.m, me() + ' confirmed done: ' + x.a.what);
    if (K.save()) K.say('Confirmed done: ' + x.a.what + '.');
    drawActs();
  }
  function reopen(x) {
    var ck = checker(x.m, x.a);
    if (me() !== ck && me() !== x.a.who) { K.say('Refused: only ' + x.a.who + ' or ' + ck + ' can send this action back.'); return; }
    x.a.st = 'open'; delete x.a.askBy; delete x.a.askAt;
    log(x.m, me() + ' sent back as not done: ' + x.a.what);
    if (K.save()) K.say('The action is open again.');
    drawActs();
  }

  /* Meetings list */
  function minutes(m) {
    var L = [], n = 0;
    L.push('MINUTES: ' + m.title, 'Date: ' + m.date, 'Where: ' + m.where, 'Chair: ' + m.chair, 'Note-taker: ' + m.taker, 'Attendees: ' + m.people.join(', '),
      'Status: ' + (m.approved ? 'Approved by ' + m.approved.by + ' on ' + m.approved.at : 'Draft, not approved yet'), '');
    m.points.forEach(function (p, i) {
      L.push((i + 1) + '. ' + p.title, '   Notes: ' + (p.notes || '(none)'), '   Decisions: ' + (p.decisions || '(none)'));
      if (!p.actions.length) L.push('   Actions: (none)');
      p.actions.forEach(function (a) { n++; L.push('   Action ' + n + ': ' + a.what + ' | Who: ' + a.who + ' | Due: ' + a.due + ' | ' + AST[a.st]); });
      L.push('');
    });
    L.push('Log:'); (m.log || []).forEach(function (g) { L.push('   ' + g.at + '  ' + g.who + ': ' + g.what); });
    L.push('', 'Practice record. Kept in this browser on this device only.');
    return L.join('\r\n') + '\r\n';
  }
  function approve(m) {
    if (m.approved) { K.say('These minutes are already approved by ' + m.approved.by + '.'); return; }
    if (me() !== m.chair) { K.say('Refused: only the chair, ' + m.chair + ', can approve these minutes. You are acting as ' + me() + '.'); return; }
    if (me() === m.taker) { K.say('Refused: the note-taker cannot approve their own minutes.'); return; }
    if (current === m.id && !saveNotes(m, true)) return;
    if (!m.points.some(function (p) { return p.notes || p.decisions; })) { K.say('Not approved: write notes or decisions for at least one agenda point first.'); return; }
    m.approved = { by: me(), at: stamp() };
    log(m, 'Approved the minutes (locked)');
    if (K.save()) K.say('Minutes approved and locked: ' + m.title + '.');
    drawList(); drawRun();
  }
  function drawList() {
    var ul = K.clear($('lList')), list = meets.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    $('lSum').textContent = list.length + ' meeting(s), ' + list.filter(function (m) { return m.approved; }).length + ' approved.';
    list.forEach(function (m) {
      var acts = 0, open = 0;
      m.points.forEach(function (p) { p.actions.forEach(function (a) { acts++; if (a.st !== 'done') open++; }); });
      var lg = h('ul', { class: 'k-note' }); (m.log || []).forEach(function (g) { lg.appendChild(h('li', { text: g.at + ' ' + g.who + ': ' + g.what })); });
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: m.title }),
        h('p', { text: m.date + ', ' + m.where + '. Chair: ' + m.chair + '. Note-taker: ' + m.taker + '.\n' + m.people.length + ' attendee(s), ' + m.points.length + ' agenda point(s), ' + acts + ' action(s), ' + open + ' open.' }),
        h('p', {}, [h('span', { class: 'k-tag' + (m.approved ? ' k-ok' : ''), text: m.approved ? 'Approved and locked' : 'Draft' }), h('span', { class: 'k-tag', text: m.where })]),
        h('details', {}, [h('summary', { text: 'Who did what' }), lg]),
        h('div', { class: 'k-mini' }, [
          K.btn('Open', function () { current = m.id; show('New'); $('run').scrollIntoView(); K.say('Opened ' + m.title + '.'); }),
          m.approved ? null : K.btn('Approve minutes', function () { approve(m); }, 'k-small'),
          K.btn('Download minutes (text file)', function () { K.download('minutes-' + m.date + '.txt', minutes(m)); })])]));
    });
    if (!list.length) ul.appendChild(h('li', { class: 'k-note', text: 'No meetings yet.' }));
  }

  drawDraft(); drawRun();
})();
