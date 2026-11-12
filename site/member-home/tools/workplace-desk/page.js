/* Workplace desk: shift handover (physical), week plan (hybrid) and work log with a timer (digital). Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var hand = K.get('handovers'), week = K.get('week'), log = K.get('worklog');
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], WHERE = ['On site', 'Remote', 'Mixed', 'Off'];
  if (week.length !== 7) { week.length = 0; DAYS.forEach(function (d, i) { week.push({ where: i < 5 ? 'On site' : 'Off', task: '' }); }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fmt(s) { var m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2) : ('0' + m).slice(-2)) + ':' + ('0' + (s % 60)).slice(-2); }

  var TABS = ['Board', 'Team', 'Hand', 'Plan', 'Log'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (m) { $('t' + m).setAttribute('aria-selected', m === n ? 'true' : 'false'); $('v' + m).hidden = m !== n; });
    });
  });

  /* Team, task board (R, A, C, I and a checker who is not the doer) and leave requests. */
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  function sharedNote(x) { if (!x || !x.href) return; var p = document.createElement('p'); p.className = 'k-card'; p.id = 'shared'; p.appendChild(document.createTextNode((x.text || '') + ' ')); var a = document.createElement('a'); a.href = x.href; a.textContent = x.label || x.href; p.appendChild(a); var h = document.querySelector('main h1'); if (h) h.parentNode.insertBefore(p, h.nextSibling); }
  sharedNote(W && W.shared);
  var team = K.get('team'), tasks = K.get('tasks'), leave = K.get('leave');
  var COLS = [['todo', 'To do'], ['doing', 'Doing'], ['check', 'Waiting for check'], ['done', 'Done']];
  if (!team.length) (W && W.team ? W.team : ['Demo Team Lead', 'Demo Coordinator', 'Demo Specialist', 'Demo Assistant', 'Demo Checker']).forEach(function (n) { team.push(n); });
  if (!K.get('workSeeded').length) {
    (W && W.tasks ? W.tasks : [['Plan the week', 'Remote', 'todo', 1, 0], ['Set up the work area', 'On site', 'doing', 2, 0], ['Review the report draft', 'Remote', 'check', 2, 0]]).forEach(function (r) {
      tasks.push({ id: K.id(), title: r[0], mode: r[1], col: r[2], r: team[r[3]] || team[0], a: team[r[4]] || team[0], c: '', i: '', by: r[2] === 'done' ? team[4] || team[team.length - 1] : '', sample: true });
    });
    K.get('workSeeded').push(1); K.save();
  }
  function opts(sel, blank) { var v = sel.value; K.clear(sel); if (blank) sel.appendChild(h('option', { value: '', text: '(nobody)' })); team.forEach(function (n) { sel.appendChild(h('option', { text: n })); }); if (v) sel.value = v; }
  function colIx(c) { for (var i = 0; i < COLS.length; i++) if (COLS[i][0] === c) return i; return 0; }
  function drawBoard() {
    var box = K.clear($('bCols'));
    COLS.forEach(function (c, ci) {
      var list = tasks.filter(function (t) { return t.col === c[0]; });
      var ul = h('ul', { class: 'k-list' });
      list.forEach(function (t) {
        var chk = null;
        if (c[0] === 'check') { chk = h('select', { class: 'k-in', 'aria-label': 'Checked by, for ' + t.title }); team.forEach(function (n) { if (n !== t.r) chk.appendChild(h('option', { text: n })); }); }
        ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: t.title }),
          h('p', {}, [h('span', { class: 'k-tag', text: t.mode }), t.sample ? h('span', { class: 'k-tag', text: 'Sample' }) : null]),
          h('p', { class: 'k-note', text: 'R: ' + t.r + '\nA: ' + t.a + (t.c ? '\nC: ' + t.c : '') + (t.i ? '\nI: ' + t.i : '') + (t.by ? '\nChecked by: ' + t.by : '') }),
          chk ? h('label', { class: 'k-lab', text: 'Checked by' }) : null, chk,
          h('div', { class: 'k-mini' }, [
            ci > 0 ? K.btn('Back', function () { t.col = COLS[ci - 1][0]; t.by = ''; K.save(); drawTeamBoard(); }) : null,
            ci < 3 ? K.btn(ci === 2 ? 'Checked: move to Done' : 'Move on', function () {
              if (ci === 2) {
                var who = chk.value; if (!who || who === t.r) { K.say('A different person from the doer must check it.'); return; }
                t.by = who;
              }
              t.col = COLS[ci + 1][0]; K.save(); drawTeamBoard(); K.say('"' + t.title + '" moved to ' + COLS[ci + 1][1] + '.');
            }, 'k-small') : null,
            K.btn('Remove', function () { if (confirm('Remove this task?')) { tasks.splice(tasks.indexOf(t), 1); K.save(); drawTeamBoard(); } })])]));
      });
      if (!list.length) ul.appendChild(h('li', { class: 'k-note', text: 'Nothing here.' }));
      box.appendChild(h('div', { class: 'k-col' }, [h('h3', { text: c[1] + ' (' + list.length + ')' }), ul]));
    });
    var done = tasks.filter(function (t) { return t.col === 'done'; }).length;
    $('bSum').textContent = tasks.length + ' tasks: ' + COLS.map(function (c) { return tasks.filter(function (t) { return t.col === c[0]; }).length + ' ' + c[1].toLowerCase(); }).join(', ') + '. ' + (tasks.length ? Math.round(100 * done / tasks.length) : 0) + '% done.';
  }
  function onLeave(n, d) { return leave.some(function (l) { return l.who === n && l.st === 'Approved' && l.from <= d && l.to >= d; }); }
  function drawTeam() {
    var tb = K.clear(document.querySelector('#tTable tbody')), d = today(), off = 0;
    team.forEach(function (n) {
      var away = onLeave(n, d); if (away) off++;
      var open = tasks.filter(function (t) { return t.r === n && t.col !== 'done'; }).length;
      tb.appendChild(h('tr', {}, [h('th', { scope: 'row', text: n }), h('td', {}, [h('span', { class: 'k-tag' + (away ? ' k-warn' : ' k-ok'), text: away ? 'On leave' : 'In' })]), h('td', { text: String(open) })]));
    });
    $('tSum').textContent = 'Today: ' + (team.length - off) + ' of ' + team.length + ' in, ' + off + ' on leave. ' + leave.filter(function (l) { return l.st === 'Waiting'; }).length + ' leave request(s) waiting.';
    var ul = K.clear($('lList'));
    leave.forEach(function (l) {
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: l.who + ': ' + l.type }), h('p', { text: l.from + ' to ' + l.to + '. Approver: ' + l.by + '.' }),
        h('span', { class: 'k-tag' + (l.st === 'Approved' ? ' k-ok' : l.st === 'Waiting' ? ' k-warn' : ''), text: l.st }),
        h('div', { class: 'k-mini' }, l.st === 'Waiting' ? [
          K.btn(l.by + ': approve', function () { l.st = 'Approved'; K.save(); drawTeamBoard(); K.say('Leave approved by ' + l.by + '.'); }, 'k-small'),
          K.btn(l.by + ': decline', function () { l.st = 'Declined'; K.save(); drawTeamBoard(); K.say('Leave declined.'); })] :
          [K.btn('Remove', function () { leave.splice(leave.indexOf(l), 1); K.save(); drawTeamBoard(); })])]));
    });
    if (!leave.length) ul.appendChild(h('li', { class: 'k-note', text: 'No leave asked for yet.' }));
  }
  function drawTeamBoard() { ['bR', 'bA', 'lWho', 'lBy'].forEach(function (k) { opts($(k)); }); ['bC', 'bI'].forEach(function (k) { opts($(k), true); }); drawBoard(); drawTeam(); }
  $('bAdd').addEventListener('click', function () {
    var t = $('bTitle').value.trim().slice(0, 90);
    if (!t) { K.say('Please write the task.'); $('bTitle').focus(); return; }
    tasks.unshift({ id: K.id(), title: t, mode: $('bMode').value, col: 'todo', r: $('bR').value, a: $('bA').value, c: $('bC').value, i: $('bI').value, by: '' });
    $('bTitle').value = ''; if (K.save()) K.say('Task added to To do.'); drawTeamBoard();
  });
  $('bDown').addEventListener('click', function () {
    if (!tasks.length) { K.say('There is no task yet.'); return; }
    var q = function (x) { return '"' + String(x || '').replace(/"/g, '""') + '"'; };
    K.download('task-board.csv', 'Task,Where,Column,R,A,C,I,Checked by\r\n' + tasks.map(function (t) { return [t.title, t.mode, COLS[colIx(t.col)][1], t.r, t.a, t.c, t.i, t.by].map(q).join(','); }).join('\r\n') + '\r\n');
  });
  $('tAdd').addEventListener('click', function () {
    var n = $('tNew').value.trim().replace(/[<>]/g, '').slice(0, 40);
    if (!n) { K.say('Please write a role or a first name.'); $('tNew').focus(); return; }
    if (team.indexOf(n) >= 0) { K.say('That name is already in the team.'); return; }
    team.push(n); $('tNew').value = ''; K.save(); drawTeamBoard(); K.say(n + ' added to the team.');
  });
  $('lAsk').addEventListener('click', function () {
    var f = $('lFrom').value, t = $('lTo').value || f;
    if (!f) { K.say('Please pick the first day.'); $('lFrom').focus(); return; }
    if (t < f) { K.say('The last day is before the first day.'); return; }
    if ($('lBy').value === $('lWho').value) { K.say('Please pick an approver who is not the person asking.'); return; }
    leave.unshift({ id: K.id(), who: $('lWho').value, type: $('lType').value, from: f, to: t, by: $('lBy').value, st: 'Waiting' });
    if (K.save()) K.say('Leave asked. ' + $('lBy').value + ' can approve it below.'); drawTeamBoard();
  });

  function drawHand() {
    var ul = K.clear($('hList'));
    hand.forEach(function (x, i) {
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: x.date + ', ' + x.shift + ' shift, ' + x.area }),
        h('p', { text: 'Done: ' + x.done }), h('p', { text: 'Open: ' + (x.open || 'Nothing open') }), h('p', { text: 'Safety: ' + x.safe }),
        h('span', { class: 'k-tag' + (x.read ? ' k-ok' : ' k-warn'), text: x.read ? 'Read by the next shift' : 'Not yet read by the next shift' }),
        h('div', { class: 'k-mini' }, [K.btn(x.read ? 'Mark as not read' : 'Next shift: mark as read', function () { x.read = !x.read; K.save(); drawHand(); }),
          K.btn('Remove', function () { if (confirm('Remove this handover?')) { hand.splice(i, 1); K.save(); drawHand(); } })])]));
    });
    if (!hand.length) ul.appendChild(h('li', { class: 'k-note', text: 'No handover saved yet.' }));
  }
  $('hSave').addEventListener('click', function () {
    var need = [['hArea', 'the area or line'], ['hDone', 'what was done'], ['hSafe', 'the safety notes (or "None")']];
    for (var i = 0; i < need.length; i++) if (!$(need[i][0]).value.trim()) { K.say('Please write ' + need[i][1] + '.'); $(need[i][0]).focus(); return; }
    hand.unshift({ id: K.id(), date: today(), area: $('hArea').value.trim(), shift: $('hShift').value, done: $('hDone').value.trim(), open: $('hOpen').value.trim(), safe: $('hSafe').value.trim(), read: false });
    ['hDone', 'hOpen', 'hSafe'].forEach(function (k) { $(k).value = ''; });
    if (K.save()) K.say('Handover saved. The next shift can mark it as read.'); drawHand();
  });
  $('hDown').addEventListener('click', function () {
    if (!hand.length) { K.say('There is no handover to download yet.'); return; }
    K.download('shift-handovers.txt', hand.map(function (x) {
      return x.date + ' | ' + x.shift + ' shift | ' + x.area + '\nDone: ' + x.done + '\nOpen: ' + (x.open || 'Nothing open') + '\nSafety: ' + x.safe + '\n' + (x.read ? 'Read by the next shift' : 'Not yet read') + '\n'; }).join('\n'));
  });

  function sum() {
    var c = {}; week.forEach(function (d) { c[d.where] = (c[d.where] || 0) + 1; });
    $('wSum').textContent = 'This week: ' + WHERE.map(function (w) { return (c[w] || 0) + ' ' + w.toLowerCase(); }).join(', ') + '.';
  }
  function drawWeek() {
    var tb = K.clear(document.querySelector('#wTable tbody'));
    week.forEach(function (d, i) {
      var sel = h('select', { class: 'k-in', 'aria-label': 'Where on ' + DAYS[i], onchange: function () { d.where = sel.value; K.save(); sum(); K.say(DAYS[i] + ' set to ' + d.where + '.'); } },
        WHERE.map(function (w) { return h('option', { text: w, selected: w === d.where }); }));
      var inp = h('input', { class: 'k-in', maxlength: 120, value: d.task, 'aria-label': 'Main task on ' + DAYS[i], onchange: function () { d.task = inp.value.trim(); K.save(); } });
      tb.appendChild(h('tr', {}, [h('th', { scope: 'row', text: DAYS[i] }), h('td', {}, [sel]), h('td', {}, [inp])]));
    });
    sum();
  }
  $('wDown').addEventListener('click', function () {
    K.download('week-plan.txt', week.map(function (d, i) { return DAYS[i] + ': ' + d.where + (d.task ? ' | ' + d.task : ''); }).join('\n') + '\n');
  });

  var t0 = 0, tick = null;
  function drawLog() {
    var tb = K.clear(document.querySelector('#gTable tbody')), tot = 0, td = today();
    log.forEach(function (x, i) {
      if (x.date === td) tot += x.secs;
      tb.appendChild(h('tr', {}, [h('td', { text: x.date }), h('td', { text: x.task }), h('td', { text: fmt(x.secs) }),
        h('td', {}, [K.btn('Remove', function () { log.splice(i, 1); K.save(); drawLog(); })])]));
    });
    if (!log.length) tb.appendChild(h('tr', {}, [h('td', { colspan: 4, text: 'Nothing logged yet.' })]));
    $('gTotal').textContent = 'Logged today: ' + fmt(tot) + ' in ' + log.filter(function (x) { return x.date === td; }).length + ' entr' + (log.filter(function (x) { return x.date === td; }).length === 1 ? 'y' : 'ies') + '.';
  }
  $('gStart').addEventListener('click', function () {
    if (!$('gTask').value.trim()) { K.say('Please write what you are working on.'); $('gTask').focus(); return; }
    t0 = Date.now(); $('gStart').disabled = true; $('gStop').disabled = false; $('gTask').readOnly = true;
    tick = setInterval(function () { $('gClock').textContent = fmt(Math.floor((Date.now() - t0) / 1000)); }, 250); K.say('Timer running.');
  });
  $('gStop').addEventListener('click', function () {
    clearInterval(tick); var s = Math.max(1, Math.round((Date.now() - t0) / 1000));
    log.unshift({ id: K.id(), date: today(), task: $('gTask').value.trim(), secs: s });
    $('gStart').disabled = false; $('gStop').disabled = true; $('gTask').readOnly = false; $('gTask').value = ''; $('gClock').textContent = '00:00';
    if (K.save()) K.say('Logged ' + fmt(s) + '.'); drawLog();
  });
  $('gDown').addEventListener('click', function () {
    if (!log.length) { K.say('There is nothing to download yet.'); return; }
    K.download('work-log.csv', 'Date,Task,Minutes\r\n' + log.map(function (x) { return x.date + ',"' + x.task.replace(/"/g, '""') + '",' + (x.secs / 60).toFixed(1); }).join('\r\n') + '\r\n');
  });
  drawTeamBoard(); drawHand(); drawWeek(); drawLog();
})();
