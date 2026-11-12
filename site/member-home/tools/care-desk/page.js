/* Customer care desk: after-sales questions, complaints, returns and warranty claims. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var cases = K.get('care.cases'), seeded = K.get('care.seeded');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var TEAM = ((W && Array.isArray(W.team) && W.team.length) ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dana', 'Demo Eli', 'Demo Farah'])
    .map(function (n) { return String(n).slice(0, 40); }).filter(function (n) { return n; });
  var TYPES = ['Question', 'Complaint', 'Return', 'Warranty'];
  var REMEDIES = ['Repair', 'Replace', 'Refund in kind', 'Answer only'];
  var PRI = { Normal: 24, Urgent: 2 };
  var STEPS = ['received', 'looked', 'offered', 'answered', 'closed'];
  var ST = { received: 'Received', looked: 'Looked into', offered: 'Remedy offered', answered: 'Customer answered', closed: 'Closed' };
  var HOUR = 3600000, MIN = 60000;

  function pad(n) { return ('0' + n).slice(-2); }
  function when(ms) { var d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function span(ms) {
    var s = Math.floor(Math.abs(ms) / 1000), hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    return (hh ? hh + ' h ' : '') + mm + ' min ' + pad(ss) + ' s';
  }
  function num(n) { return 'C-' + ('000' + n).slice(-4); }
  function nextNo() { var m = 0; cases.forEach(function (c) { if (c.n > m) m = c.n; }); return m + 1; }
  function late(c) { return c.replied ? c.replied > c.due : Date.now() > c.due; }
  function stLabel(c) { return c.st === 'answered' ? (c.agreed ? 'Customer agreed' : 'Customer did not agree') : ST[c.st]; }

  /* Refuse money amounts, phone numbers and email addresses in typed text. */
  function bad(t) {
    if (/[$€£₹¥]/.test(t) || /\b(usd|inr|eur|gbp|rs|rupees?|dollars?|euros?|pounds?|cents?|paise)\b/i.test(t)) return 'Please remove the money amount. This desk keeps no prices or amounts.';
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(t)) return 'Please remove the email address. Keep contact details out of this screen.';
    var runs = t.match(/\+?\d[\d\s().-]{6,}\d/g) || [];
    for (var i = 0; i < runs.length; i++) if (runs[i].replace(/\D/g, '').length >= 9) return 'Please remove the phone number. Keep contact details out of this screen.';
    return '';
  }
  function clean(t, max) { return String(t || '').trim().replace(/[<>]/g, '').slice(0, max); }

  function makeCase(n, type, order, what, want, pri, handler, created) {
    var c = { id: K.id(), n: n, no: num(n), type: type, order: order, what: what, want: want, pri: pri, handler: handler,
      created: created, due: created + PRI[pri] * HOUR, st: 'received', remedy: '', maker: '', approver: '', agreed: null, replied: 0, log: [] };
    c.log.push({ t: created, who: handler, what: 'Received. ' + type + ', ' + pri + '. Customer wants: ' + want + '.' });
    return c;
  }
  function step(c, t, who, st, text) { c.st = st; c.log.push({ t: t, who: who, what: text }); if (st === 'looked' && !c.replied) c.replied = t; }

  /* Six practice cases, made once on first open. */
  if (!seeded.length && !cases.length) {
    var now = Date.now(), p = TEAM, a, b;
    a = makeCase(1, 'Complaint', 'DEMO-ORD-2041', 'Parcel arrived with a cracked lid on the storage box.', 'Replace', 'Urgent', p[0], now - 3 * HOUR);
    cases.push(a);
    cases.push(makeCase(2, 'Return', 'DEMO-ORD-2056', 'Customer ordered the wrong size of the desk lamp shade.', 'Replace', 'Normal', p[1 % p.length], now - 5 * HOUR));
    b = makeCase(3, 'Warranty', 'DEMO-ORD-1977', 'Kettle stopped heating after three weeks of use.', 'Repair', 'Normal', p[2 % p.length], now - 30 * HOUR);
    step(b, now - 20 * HOUR, b.handler, 'looked', 'Looked into. Asked for a photo of the base plate.');
    b.remedy = 'Repair'; b.maker = b.handler; b.approver = p[3 % p.length];
    step(b, now - 6 * HOUR, b.handler, 'offered', 'Remedy offered: Repair. Approved by ' + b.approver + '.');
    cases.push(b);
    b = makeCase(4, 'Question', 'DEMO-ORD-2002', 'Customer asked how to fold the travel stand flat.', 'Answer only', 'Normal', p[3 % p.length], now - 50 * HOUR);
    step(b, now - 22 * HOUR, b.handler, 'looked', 'Looked into. First reply was sent after the reply-by time.');
    b.remedy = 'Answer only'; b.maker = b.handler; b.approver = p[4 % p.length];
    step(b, now - 21 * HOUR, b.handler, 'offered', 'Remedy offered: Answer only. Approved by ' + b.approver + '.');
    b.agreed = true; step(b, now - 18 * HOUR, b.handler, 'answered', 'Customer agreed.');
    step(b, now - 17 * HOUR, b.handler, 'closed', 'Closed.');
    cases.push(b);
    cases.push(makeCase(5, 'Return', 'DEMO-ORD-2060', 'Wrong colour sent. Customer needs it for an event this week.', 'Replace', 'Urgent', p[4 % p.length], now - 50 * MIN));
    b = makeCase(6, 'Complaint', 'DEMO-ORD-1903', 'Two cups in a set of six arrived chipped.', 'Refund in kind', 'Normal', p[5 % p.length], now - 72 * HOUR);
    step(b, now - 60 * HOUR, b.handler, 'looked', 'Looked into. Checked the packing photo.');
    b.remedy = 'Replace'; b.maker = b.handler; b.approver = p[0];
    step(b, now - 50 * HOUR, b.handler, 'offered', 'Remedy offered: Replace. Approved by ' + b.approver + '.');
    b.agreed = false; step(b, now - 40 * HOUR, b.handler, 'answered', 'Customer did not agree. Wants a refund in kind.');
    cases.push(b);
    seeded.push(1); K.save();
  }

  /* Tabs */
  var TABS = ['New', 'Cases', 'Sum'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      if (n === 'Cases') drawCases(); if (n === 'Sum') drawSum();
    });
  });
  function fill(sel, list, val) { K.clear(sel); list.forEach(function (x) { sel.appendChild(h('option', { value: x, text: x })); }); if (val) sel.value = val; return sel; }

  /* New case */
  fill($('nType'), TYPES); fill($('nWant'), REMEDIES); fill($('nWho'), TEAM);
  K.clear($('nPri'));
  $('nPri').appendChild(h('option', { value: 'Normal', text: 'Normal (reply within 24 hours)' }));
  $('nPri').appendChild(h('option', { value: 'Urgent', text: 'Urgent (reply within 2 hours)' }));
  function info() { $('nInfo').textContent = cases.length + ' case(s) so far. The next case will be ' + num(nextNo()) + '.'; }
  $('nAdd').addEventListener('click', function () {
    var order = clean($('nOrder').value, 40), what = clean($('nWhat').value, 400), msg;
    if (!order) { K.say('Please write the order reference.'); $('nOrder').focus(); return; }
    if (!what) { K.say('Please write what happened.'); $('nWhat').focus(); return; }
    msg = bad(order) || bad(what);
    if (msg) { K.say('Not logged. ' + msg); return; }
    var c = makeCase(nextNo(), $('nType').value, order, what, $('nWant').value, $('nPri').value, $('nWho').value, Date.now());
    cases.push(c);
    $('nOrder').value = ''; $('nWhat').value = '';
    if (K.save()) K.say('Logged ' + c.no + ' (' + c.type + ', ' + c.pri + '). Reply by ' + when(c.due) + '.');
    info();
  });

  /* Cases */
  var ticks = [];
  fill($('cFilter'), []);
  [['all', 'All cases'], ['open', 'Open cases (not closed)'], ['late', 'Late only']].concat(STEPS.map(function (s) { return [s, ST[s]]; }))
    .forEach(function (o) { $('cFilter').appendChild(h('option', { value: o[0], text: o[1] })); });
  $('cFilter').addEventListener('change', drawCases);

  function clock(c, el) {
    var left = c.due - Date.now(), isLate = late(c);
    if (c.replied) el.textContent = isLate ? 'Late: first reply came ' + span(c.replied - c.due) + ' after the reply-by time' : 'First reply on time';
    else el.textContent = isLate ? 'Late by ' + span(left) : 'Reply in ' + span(left);
    el.className = 'k-tag ' + (isLate ? 'k-warn' : 'k-ok');
  }
  setInterval(function () { ticks.forEach(function (x) { clock(x.c, x.el); }); }, 1000);

  function pick(id, label, list, val) {
    return h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: id, text: label }), fill(h('select', { class: 'k-in', id: id }), list, val)]);
  }

  function drawCases() {
    var f = $('cFilter').value || 'all', ul = K.clear($('cList'));
    ticks = [];
    var shown = cases.filter(function (c) {
      return f === 'all' || (f === 'open' && c.st !== 'closed') || (f === 'late' && late(c)) || c.st === f;
    }).slice().reverse();
    shown.forEach(function (c) {
      var k = c.id, tag = h('span', { class: 'k-tag' }), kids = [], ctl = [];
      ticks.push({ c: c, el: tag }); clock(c, tag);
      kids.push(h('h3', { text: c.no + ', ' + c.type + ', order ' + c.order }));
      kids.push(h('p', {}, [h('span', { class: 'k-tag' + (c.st === 'closed' ? ' k-ok' : ''), text: stLabel(c) }),
        h('span', { class: 'k-tag' + (c.pri === 'Urgent' ? ' k-warn' : ''), text: c.pri }), tag]));
      kids.push(h('p', { text: 'What happened: ' + c.what + '\nCustomer wants: ' + c.want + '\nHandler: ' + c.handler +
        '\nReceived: ' + when(c.created) + '. Reply by: ' + when(c.due) + '.' +
        (c.remedy ? '\nRemedy offered: ' + c.remedy + ' (made by ' + c.maker + ', approved by ' + c.approver + ')' : '') }));
      if (c.st !== 'closed') {
        var row = [pick('w' + k, 'Done by', TEAM, c.handler)];
        if (c.st === 'looked') {
          row.push(pick('r' + k, 'Remedy to offer', REMEDIES, c.want));
          row.push(pick('a' + k, 'Approved by (not the handler)', TEAM, TEAM.filter(function (n) { return n !== c.handler; })[0]));
        }
        ctl.push(h('div', { class: 'k-row' }, row));
        ctl.push(h('label', { class: 'k-lab', for: 'n' + k, text: 'Note (optional)' }));
        ctl.push(h('input', { class: 'k-in', id: 'n' + k, maxlength: '160' }));
        var btns = [];
        if (c.st === 'received') btns.push(K.btn('Mark looked into', function () { act(c, 'looked'); }, 'k-small'));
        if (c.st === 'looked') btns.push(K.btn('Offer remedy', function () { act(c, 'offered'); }, 'k-small'));
        if (c.st === 'offered') {
          btns.push(K.btn('Customer agreed', function () { act(c, 'yes'); }, 'k-small'));
          btns.push(K.btn('Customer did not agree', function () { act(c, 'no'); }, 'k-small'));
        }
        if (c.st === 'answered') {
          btns.push(K.btn('Close case', function () { act(c, 'closed'); }, 'k-small'));
          if (!c.agreed) btns.push(K.btn('Offer a new remedy', function () { act(c, 'again'); }));
        }
        ctl.push(h('div', { class: 'k-mini' }, btns));
      }
      var log = h('ol', {}, c.log.map(function (e) { return h('li', { text: when(e.t) + ', ' + e.who + ': ' + e.what }); }));
      kids.push(h('details', {}, [h('summary', { text: 'Step log (' + c.log.length + ')' }), log]));
      ul.appendChild(h('li', { class: 'k-item', 'data-case': c.no }, kids.concat(ctl)));
    });
    if (!shown.length) ul.appendChild(h('li', { class: 'k-note', text: 'No cases to show.' }));
    $('cSum').textContent = 'Showing ' + shown.length + ' of ' + cases.length + ' case(s). ' + cases.filter(late).length + ' late.';
  }

  function act(c, what) {
    var k = c.id, who = $('w' + k).value, note = clean($('n' + k).value, 160), t = Date.now(), msg = note ? bad(note) : '';
    if (msg) { K.say('Not saved. ' + msg); return; }
    var tail = note ? ' Note: ' + note : '';
    if (what === 'looked') step(c, t, who, 'looked', 'Looked into. First reply sent.' + tail);
    else if (what === 'offered') {
      var rem = $('r' + k).value, appr = $('a' + k).value;
      if (appr === c.handler || appr === who) { K.say('Not offered. ' + appr + ' cannot approve: the approver must be a different person from the case handler (' + c.handler + ') and from the person making the offer.'); return; }
      c.remedy = rem; c.maker = who; c.approver = appr;
      step(c, t, who, 'offered', 'Remedy offered: ' + rem + '. Approved by ' + appr + '.' + tail);
    } else if (what === 'yes') { c.agreed = true; step(c, t, who, 'answered', 'Customer agreed.' + tail); }
    else if (what === 'no') { c.agreed = false; step(c, t, who, 'answered', 'Customer did not agree.' + tail); }
    else if (what === 'again') { c.agreed = null; c.remedy = ''; c.maker = ''; c.approver = ''; step(c, t, who, 'looked', 'Back to looked into, to offer a new remedy.' + tail); }
    else if (what === 'closed') step(c, t, who, 'closed', 'Closed.' + tail);
    if (K.save()) K.say(c.no + ': ' + stLabel(c) + '. Logged for ' + who + ' at ' + when(t) + '.');
    drawCases();
  }

  /* Summary */
  function table(id, head, rows) {
    var th = K.clear(document.querySelector('#' + id + ' thead')), tb = K.clear(document.querySelector('#' + id + ' tbody'));
    th.appendChild(h('tr', {}, head.map(function (x) { return h('th', { scope: 'col', text: x }); })));
    rows.forEach(function (r) { tb.appendChild(h('tr', {}, r.map(function (x, i) { return h(i ? 'td' : 'th', i ? { text: String(x) } : { scope: 'row', text: String(x) }); }))); });
  }
  function avgSteps() { if (!cases.length) return '0'; var s = 0; cases.forEach(function (c) { s += c.log.length; }); return (s / cases.length).toFixed(1); }
  function drawSum() {
    var nLate = cases.filter(late).length;
    $('sTop').textContent = cases.length + ' case(s). ' + nLate + ' late. ' + cases.filter(function (c) { return c.st !== 'closed'; }).length +
      ' open. Average steps logged per case: ' + avgSteps() + '.';
    table('sType', ['Type', 'Cases', 'Open', 'Late'], TYPES.map(function (t) {
      var l = cases.filter(function (c) { return c.type === t; });
      return [t, l.length, l.filter(function (c) { return c.st !== 'closed'; }).length, l.filter(late).length];
    }));
    table('sStat', ['Status', 'Cases', 'Late'], STEPS.map(function (s) {
      var l = cases.filter(function (c) { return c.st === s; });
      return [ST[s], l.length, l.filter(late).length];
    }));
  }
  $('sDown').addEventListener('click', function () {
    if (!cases.length) { K.say('There is no case to download yet.'); return; }
    var out = ['Customer care desk: all cases (practice data)', 'Made ' + when(Date.now()), ''];
    cases.forEach(function (c) {
      out.push(c.no + ' | ' + c.type + ' | ' + c.pri + ' | ' + stLabel(c) + (late(c) ? ' | LATE' : ''));
      out.push('  Order: ' + c.order);
      out.push('  What happened: ' + c.what);
      out.push('  Customer wants: ' + c.want);
      out.push('  Handler: ' + c.handler + '. Received ' + when(c.created) + '. Reply by ' + when(c.due) + '.');
      if (c.remedy) out.push('  Remedy offered: ' + c.remedy + ' (made by ' + c.maker + ', approved by ' + c.approver + ')');
      out.push('  Step log:');
      c.log.forEach(function (e) { out.push('    ' + when(e.t) + ', ' + e.who + ': ' + e.what); });
      out.push('');
    });
    K.download('care-cases.txt', out.join('\r\n'));
  });

  info(); drawCases(); drawSum();
})();
