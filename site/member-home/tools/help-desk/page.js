/* Workplace help desk: staff requests for IT, building, supplies and people matters. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var tickets = K.get('hlpTickets'), meta = K.get('hlpMeta'), solved = K.get('hlpSolved');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var people = (W && Array.isArray(W.team) && W.team.length ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dina', 'Demo Eli', 'Demo Farah'])
    .map(function (p) { return String(p).replace(/[<>]/g, '').slice(0, 40); }).filter(function (p) { return p; });
  var AREAS = ['IT', 'Building', 'Supplies', 'People'];
  var URG = ['Low', 'Normal', 'High', 'Stop-work'];
  var HOUR = 3600000, TARGET = { 'Stop-work': HOUR, High: 4 * HOUR, Normal: 24 * HOUR, Low: 72 * HOUR };
  var TLABEL = { 'Stop-work': '1 hour', High: '4 hours', Normal: '1 day', Low: '3 days' };
  var STEPS = ['New', 'Taken', 'Waiting', 'Fixed', 'Closed'];
  var ANSWERS = [
    ['pw', 'I forgot my password', 'Open your own account page and choose "Reset password". Answer your saved questions, then pick a new password. It works at once.'],
    ['light', 'A light is out', 'Note the room and the light (for example "Meeting room 2, near the window"). Ask for help with area "Building" and urgency "Low".'],
    ['paper', 'The printer has no paper', 'Paper is in the supply cupboard by the printer. If the cupboard is empty, ask for help with area "Supplies" so more is ordered.'],
    ['print', 'My printing does not come out', 'Check the printer screen for a jam or an empty tray. Then turn the printer off, wait ten seconds and turn it on again.'],
    ['net', 'The network is slow or gone', 'Turn your computer\'s wireless off and on again. If others near you have the same problem, ask for help with urgency "High".'],
    ['screen', 'My second screen stays dark', 'Check both ends of the cable. Then press the screen\'s own input button until it shows your computer.'],
    ['leave', 'How do I ask for leave?', 'Use the leave page on your own account page. Pick the days, add a short reason and send it to your team lead.'],
    ['key', 'I lost my door card', 'Tell the front desk today so the old card is switched off. Then ask for help with area "Building" for a new card.']
  ];

  function pad(n) { return ('0' + n).slice(-2); }
  function stamp(ms) { var d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function due(t) { return t.made + TARGET[t.urg]; }
  function isLate(t) { var end = t.fixedAt || (t.st === 'Closed' ? t.closedAt : 0) || Date.now(); return end > due(t); }
  function span(ms) {
    var m = Math.round(Math.abs(ms) / 60000), d = Math.floor(m / 1440), hr = Math.floor((m % 1440) / 60), mi = m % 60;
    return (d ? d + ' d ' : '') + (d || hr ? hr + ' h ' : '') + mi + ' min';
  }
  function clock(t) {
    if (t.st === 'Fixed' || t.st === 'Closed') return isLate(t) ? 'Fixed after the target time.' : 'Fixed in time.';
    var left = due(t) - Date.now();
    return left >= 0 ? 'Time left: ' + span(left) + '.' : 'Late by ' + span(left) + '.';
  }
  function nextNo() {
    var n = 0;
    tickets.forEach(function (t) { var x = parseInt(String(t.no).slice(2), 10); if (x > n) n = x; });
    return 'H-' + ('000' + (n + 1)).slice(-4);
  }
  function log(t, by, text) { t.log.push({ at: Date.now(), by: by, text: text }); }
  function badText(s) {
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(s)) return 'Please remove the email address. Do not type email addresses here.';
    if (/\+?\d[\d\s().-]{7,}\d/.test(s)) return 'Please remove the phone number. Do not type phone numbers here.';
    if (/[$€£₹¥]|\b(rs|inr|usd|eur|gbp)\.?\s*\d|\d\s*(rs|inr|usd|eur|gbp|dollars?|rupees?|euros?|pounds?)\b/i.test(s)) return 'Please remove the money amount. Do not type prices or amounts here.';
    return '';
  }
  function opts(sel, list, first) {
    if (first) sel.appendChild(h('option', { value: '', text: first }));
    list.forEach(function (x) { sel.appendChild(h('option', { value: x, text: x })); });
  }

  /* Sample tickets, added once on first use */
  if (meta.indexOf('seeded') < 0) {
    var now = Date.now(), P = function (i) { return people[i % people.length]; };
    var S = [
      [0, 'IT', 'Normal', 'My laptop will not start after the update.', 3 * HOUR, 'New'],
      [1, 'Building', 'Low', 'The light over desk 4 is out.', 20 * HOUR, 'Taken', 2],
      [2, 'Supplies', 'Normal', 'We need more printer paper on floor 2.', 30 * HOUR, 'Waiting', 3],
      [3, 'IT', 'Stop-work', 'The shared drive will not open for the whole team.', 2 * HOUR, 'Taken', 4],
      [4, 'People', 'Low', 'Please explain how to change my working days.', 26 * HOUR, 'Fixed', 5],
      [5, 'Building', 'High', 'Water is dripping from the ceiling in meeting room 1.', 6 * HOUR, 'Closed', 0],
      [1, 'IT', 'High', 'I cannot print from my computer.', 0.5 * HOUR, 'New']
    ];
    S.forEach(function (r, i) {
      var made = now - r[4], t = { id: K.id(), no: 'H-' + ('000' + (i + 1)).slice(-4), who: P(r[0]), area: r[1], urg: r[2], what: r[3], made: made, st: 'New', helper: '', fixer: '', log: [{ at: made, by: P(r[0]), text: 'Asked for help (sample).' }] };
      var at = made;
      if (r[5] !== 'New') { t.helper = P(r[6]); at += 0.2 * HOUR; t.log.push({ at: at, by: t.helper, text: 'Taken by ' + t.helper + '.' }); t.st = 'Taken'; }
      if (r[5] === 'Waiting') { at += 0.5 * HOUR; t.log.push({ at: at, by: t.helper, text: 'Waiting: new paper is on order.' }); t.st = 'Waiting'; }
      if (r[5] === 'Fixed' || r[5] === 'Closed') { at += 1.5 * HOUR; t.fixer = t.helper; t.fixedAt = at; t.log.push({ at: at, by: t.helper, text: 'Marked fixed.' }); t.st = 'Fixed'; }
      if (r[5] === 'Closed') { at += 1 * HOUR; t.closedAt = at; t.log.push({ at: at, by: t.who, text: 'Asker confirmed it is fixed. Closed.' }); t.st = 'Closed'; }
      tickets.push(t);
    });
    meta.push('seeded'); K.save();
  }

  /* Tabs */
  var TABS = ['Ask', 'Queue', 'Faq'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      if (n === 'Queue') drawQueue(); if (n === 'Faq') drawFaq();
    });
  });

  /* Ask for help */
  opts($('aWho'), people); opts($('aArea'), AREAS); opts($('aUrg'), URG); $('aUrg').value = 'Normal';
  function info() { $('aInfo').textContent = 'Target time for ' + $('aUrg').value + ': ' + TLABEL[$('aUrg').value] + '.'; }
  $('aUrg').addEventListener('change', info);
  $('aSend').addEventListener('click', function () {
    var who = $('aWho').value, what = $('aWhat').value.trim().replace(/[<>]/g, '').slice(0, 300), bad;
    if (!who) { K.say('Please pick who is asking.'); return; }
    if (what.length < 5) { K.say('Please write what is wrong, in a few words.'); $('aWhat').focus(); return; }
    bad = badText(what);
    if (bad) { K.say('Not sent. ' + bad); $('aWhat').focus(); return; }
    var t = { id: K.id(), no: nextNo(), who: who, area: $('aArea').value, urg: $('aUrg').value, what: what, made: Date.now(), st: 'New', helper: '', fixer: '', log: [] };
    log(t, who, 'Asked for help.');
    tickets.push(t); $('aWhat').value = '';
    if (K.save()) K.say('Sent. Your ticket is ' + t.no + '. Target time: ' + TLABEL[t.urg] + ' (by ' + stamp(due(t)) + ').');
  });

  /* Queue */
  opts($('qMe'), people); opts($('qArea'), AREAS, 'All areas'); opts($('qSt'), STEPS, 'All statuses');
  $('qArea').addEventListener('change', drawQueue); $('qSt').addEventListener('change', drawQueue);
  function act(t, fn) { return function () { var me = $('qMe').value, msg = fn(me); if (msg) { K.save(); drawQueue(); K.say(t.no + ': ' + msg); } }; }
  function drawQueue() {
    var ul = K.clear($('qList')), fa = $('qArea').value, fs = $('qSt').value;
    var list = tickets.filter(function (t) { return (!fa || t.area === fa) && (!fs || t.st === fs); });
    list.sort(function (a, b) { return (STEPS.indexOf(a.st) - STEPS.indexOf(b.st)) || (due(a) - due(b)); });
    list.forEach(function (t) {
      var b = [];
      if (t.st === 'New') b.push(K.btn('Take it (as helper)', act(t, function (me) { if (me === t.who) { K.say(t.no + ': ' + me + ' asked for this one. Another person must take it, so the fix can be checked.'); return ''; } t.helper = me; t.st = 'Taken'; log(t, me, 'Taken by ' + me + '.'); return 'taken by ' + me + '.'; }), 'k-small'));
      if (t.st === 'Taken') b.push(K.btn('Mark waiting', act(t, function (me) { t.st = 'Waiting'; log(t, me, 'Waiting for something.'); return 'now waiting.'; })));
      if (t.st === 'Waiting') b.push(K.btn('Back to work', act(t, function (me) { t.st = 'Taken'; log(t, me, 'Back to work.'); return 'back to work.'; })));
      if (t.st === 'Taken' || t.st === 'Waiting') b.push(K.btn('Mark fixed', act(t, function (me) {
        if (me !== t.helper) { K.say(t.no + ': only the helper ' + t.helper + ' can mark this fixed. Change "Acting as".'); return ''; }
        t.st = 'Fixed'; t.fixer = me; t.fixedAt = Date.now(); log(t, me, 'Marked fixed.'); return 'marked fixed. ' + t.who + ' now needs to confirm.'; }), 'k-small'));
      if (t.st === 'Fixed') {
        b.push(K.btn('Confirm fixed and close', act(t, function (me) {
          if (me === t.fixer || me === t.helper) { K.say(t.no + ': not closed. A helper cannot close their own fix. ' + t.who + ' must confirm it.'); return ''; }
          if (me !== t.who) { K.say(t.no + ': not closed. Only the person who asked (' + t.who + ') can confirm it is fixed.'); return ''; }
          t.st = 'Closed'; t.closedAt = Date.now(); log(t, me, 'Asker confirmed it is fixed. Closed.'); return 'closed. Thank you for confirming.'; }), 'k-small'));
        b.push(K.btn('Still not fixed', act(t, function (me) {
          if (me !== t.who) { K.say(t.no + ': only the person who asked (' + t.who + ') can say it is still not fixed.'); return ''; }
          t.st = 'Taken'; t.fixedAt = 0; log(t, me, 'Asker says it is still not fixed. Back to the helper.'); return 'sent back to ' + t.helper + '.'; })));
      }
      var late = t.st !== 'Closed' && t.st !== 'Fixed' ? isLate(t) : !!(t.fixedAt && isLate(t));
      ul.appendChild(h('li', { class: 'k-item' }, [
        h('h3', { text: t.no + ' - ' + t.area + ' - ' + t.urg }),
        h('p', { text: t.what + '\nAsked by: ' + t.who + ', ' + stamp(t.made) + (t.helper ? '\nHelper: ' + t.helper : '') + '\nTarget: by ' + stamp(due(t)) + ' (' + TLABEL[t.urg] + ')' }),
        h('p', {}, [h('span', { class: 'k-tag' + (t.st === 'Closed' ? ' k-ok' : ''), text: t.st }),
          late ? h('span', { class: 'k-tag k-warn', text: 'Late' }) : null,
          h('span', { class: 'k-tag', 'data-clock': t.id, text: clock(t) })]),
        h('details', {}, [h('summary', { text: 'Log (' + t.log.length + ' steps)' }),
          h('ul', {}, t.log.map(function (l) { return h('li', { text: stamp(l.at) + ', ' + l.by + ': ' + l.text }); }))]),
        h('div', { class: 'k-mini' }, b)]));
    });
    if (!list.length) ul.appendChild(h('li', { class: 'k-note', text: 'No tickets match this filter.' }));
    var open = tickets.filter(function (t) { return t.st !== 'Fixed' && t.st !== 'Closed'; });
    $('qSum').textContent = 'Showing ' + list.length + ' of ' + tickets.length + ' ticket(s). Open: ' + open.length + ', late: ' + open.filter(isLate).length + '.';
  }
  setInterval(function () {
    if ($('vQueue').hidden) return;
    tickets.forEach(function (t) { var e = document.querySelector('[data-clock="' + t.id + '"]'); if (e) e.textContent = clock(t); });
  }, 30000);
  $('qDown').addEventListener('click', function () {
    if (!tickets.length) { K.say('There is no ticket to download yet.'); return; }
    var q = function (x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; };
    K.download('help-desk-tickets.csv', 'Ticket,Asked by,Area,Urgency,What is wrong,Asked at,Target by,Status,Helper,Late,Log\r\n' + tickets.map(function (t) {
      return [t.no, t.who, t.area, t.urg, t.what, stamp(t.made), stamp(due(t)), t.st, t.helper, isLate(t) ? 'Yes' : 'No',
        t.log.map(function (l) { return stamp(l.at) + ' ' + l.by + ': ' + l.text; }).join(' | ')].map(q).join(','); }).join('\r\n') + '\r\n');
  });

  /* Simple answers */
  function count(id) { for (var i = 0; i < solved.length; i++) if (solved[i].id === id) return solved[i]; var c = { id: id, n: 0 }; solved.push(c); return c; }
  function drawFaq() {
    var ul = K.clear($('fList'));
    ANSWERS.forEach(function (a) {
      var c = count(a[0]);
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: a[1] }), h('p', { text: a[2] }),
        h('p', { class: 'k-note', text: 'Solved it for ' + c.n + ' person' + (c.n === 1 ? '' : 's') + ' so far.' }),
        h('div', { class: 'k-mini' }, [K.btn('This solved it', function () { c.n++; K.save(); drawFaq(); K.say('Thank you. Glad "' + a[1] + '" is sorted.'); }, 'k-small')])]));
    });
  }
  info(); drawQueue(); drawFaq();
})();
