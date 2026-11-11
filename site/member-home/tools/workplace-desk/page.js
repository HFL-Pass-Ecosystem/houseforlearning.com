/* Workplace desk: shift handover (physical), week plan (hybrid) and work log with a timer (digital). Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var hand = K.get('handovers'), week = K.get('week'), log = K.get('worklog');
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], WHERE = ['On site', 'Remote', 'Mixed', 'Off'];
  if (week.length !== 7) { week.length = 0; DAYS.forEach(function (d, i) { week.push({ where: i < 5 ? 'On site' : 'Off', task: '' }); }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fmt(s) { var m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2) : ('0' + m).slice(-2)) + ':' + ('0' + (s % 60)).slice(-2); }

  ['Hand', 'Plan', 'Log'].forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      ['Hand', 'Plan', 'Log'].forEach(function (m) { $('t' + m).setAttribute('aria-selected', m === n ? 'true' : 'false'); $('v' + m).hidden = m !== n; });
    });
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
  drawHand(); drawWeek(); drawLog();
})();
