/* Skills matrix: who can do what, sign-off for levels 3 and 4, gaps and a training plan. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var cells = K.get('skl.cells'), log = K.get('skl.log'), plan = K.get('skl.plan'), seed = K.get('skl.seed');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var DEMO = ['Demo Asha', 'Demo Ben', 'Demo Chitra', 'Demo Dev', 'Demo Elena', 'Demo Farid'];
  var people = ((W && Array.isArray(W.team) && W.team.length) ? W.team : DEMO).map(function (x) { return String(x || '').slice(0, 60); }).filter(Boolean);
  var SKILLS = [
    { n: 'Safe isolation', safe: true }, { n: 'First aid', safe: true }, { n: 'Forklift', safe: true }, { n: 'Test bench use' },
    { n: 'Drawing reading' }, { n: 'Customer calls' }, { n: 'Quality check' }, { n: 'Remote support' }];
  var LV = ['0 not trained', '1 learning', '2 can do with help', '3 can do alone', '4 can teach'];

  function pad(n) { return ('0' + n).slice(-2); }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return ymd(new Date()); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return ymd(d); }
  function stamp() { var d = new Date(); return ymd(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function skill(n) { for (var i = 0; i < SKILLS.length; i++) if (SKILLS[i].n === n) return SKILLS[i]; return null; }
  function cell(p, s) { for (var i = 0; i < cells.length; i++) if (cells[i].p === p && cells[i].s === s) return cells[i]; return null; }
  function lvOf(p, s) { var c = cell(p, s); return c ? c.lv : 0; }
  function expired(c) { var sk = skill(c.s); return !!(sk && sk.safe && c.lv >= 3 && c.exp && c.exp < today()); }
  function okAt3(p, s) { var c = cell(p, s); return !!(c && c.lv >= 3 && !expired(c)); }
  function setCell(p, s, lv, exp) {
    var c = cell(p, s);
    if (!c) { c = { p: p, s: s, lv: 0, exp: '' }; cells.push(c); }
    c.lv = lv; if (exp !== undefined) c.exp = exp;
    return c;
  }
  function bad(t) {
    if (/\S+@\S+\.\S+/.test(t)) return 'an email address';
    var ph = t.match(/\+?\d[\d\s().-]{7,}\d/g) || [];
    for (var i = 0; i < ph.length; i++) if (ph[i].replace(/\D/g, '').length >= 9) return 'a phone number';
    if (/[$€£₹¥]|\b(rs|inr|usd|eur|gbp|rupees?|dollars?|euros?|pounds?)\b\.?\s*\d|\d\s*(rs|inr|usd|eur|gbp|rupees?|dollars?|euros?|pounds?|k)\b/i.test(t)) return 'a money amount';
    return '';
  }
  function clean(id) {
    var t = $(id).value.trim().replace(/[<>]/g, '').slice(0, 120), b = bad(t);
    if (b) { K.say('Not saved: the text looks like it has ' + b + '. Please keep personal details and amounts out of this screen.'); $(id).focus(); return null; }
    return t;
  }

  /* Sample levels on first use (practice data). */
  if (!seed.length) {
    var ROWS = [[4, 3, 2, 4, 3, 1, 3, 0], [3, 4, 0, 2, 4, 0, 2, 1], [2, 1, 4, 0, 2, 4, 3, 2],
      [3, 3, 1, 3, 1, 2, 4, 0], [1, 2, 3, 1, 0, 3, 1, 4], [0, 1, 0, 2, 3, 1, 2, 1]];
    people.forEach(function (p, i) {
      ROWS[i % ROWS.length].forEach(function (lv, j) {
        var sk = SKILLS[j], exp = '';
        if (sk.safe && lv >= 3) exp = (i % 6 === 3 && j === 1) ? addDays(-12) : addDays(120 + i * 40 + j * 15);
        setCell(p, sk.n, lv, exp);
      });
    });
    seed.push({ t: stamp() });
    K.save();
  }

  var TABS = ['Matrix', 'Sign', 'Plan'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () { show(n); });
  });
  function show(n) {
    TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
    if (n === 'Matrix') drawMatrix(); if (n === 'Sign') { info(); drawLog(); } if (n === 'Plan') { drawGaps(); drawPlan(); }
  }
  function fill(sel, list) { list.forEach(function (x) { $(sel).appendChild(h('option', { value: x, text: x })); }); }
  ['sWho', 'sBy', 'pWho'].forEach(function (id) { fill(id, people); });
  ['sSkill', 'pSkill'].forEach(function (id) { fill(id, SKILLS.map(function (s) { return s.n + (s.safe ? ' (safety)' : ''); })); });
  ['sSkill', 'pSkill'].forEach(function (id) { var o = $(id).options; for (var i = 0; i < o.length; i++) o[i].value = SKILLS[i].n; });
  if (people.length > 1) $('sBy').value = people[1];

  /* Matrix */
  LV.forEach(function (t, i) { $('mKey').appendChild(h('li', {}, [h('span', { class: 'lv lv' + i, text: t })])); });
  $('mKey').appendChild(h('li', {}, [h('span', { class: 'lv lvx', text: 'Safety skill run out' })]));
  function counts() {
    return SKILLS.map(function (s) { return people.filter(function (p) { return okAt3(p, s.n); }).length; });
  }
  function drawMatrix() {
    var head = K.clear(document.querySelector('#mGrid thead')), tb = K.clear(document.querySelector('#mGrid tbody')), ft = K.clear(document.querySelector('#mGrid tfoot'));
    head.appendChild(h('tr', {}, [h('th', { scope: 'col', text: 'Person' })].concat(SKILLS.map(function (s) { return h('th', { scope: 'col', text: s.n + (s.safe ? ' (safety)' : '') }); }))));
    people.forEach(function (p) {
      var row = [h('th', { scope: 'row', text: p })];
      SKILLS.forEach(function (s) {
        var c = cell(p, s.n) || { p: p, s: s.n, lv: 0, exp: '' }, x = expired(c);
        var sel = h('select', { class: 'k-in', 'aria-label': 'Level for ' + p + ' in ' + s.n });
        for (var i = 0; i <= 2; i++) sel.appendChild(h('option', { value: String(i), text: String(i) }));
        if (c.lv >= 3) sel.appendChild(h('option', { value: String(c.lv), text: c.lv + ' signed' }));
        sel.value = String(c.lv);
        sel.addEventListener('change', function () {
          var v = +sel.value, from = lvOf(p, s.n);
          if (v === from) return;
          if (v >= 3) { K.say('Levels 3 and 4 need a sign-off. Use the Sign off tab.'); sel.value = String(from); return; }
          setCell(p, s.n, v);
          log.unshift({ t: stamp(), kind: 'change', who: p, skill: s.n, from: from, to: v });
          if (K.save()) K.say(p + ': ' + s.n + ' set to level ' + v + '.');
          drawMatrix();
        });
        var kids = [h('span', { class: 'lv ' + (x ? 'lvx' : 'lv' + c.lv), text: x ? c.lv + ' run out' : String(c.lv) })];
        if (s.safe && c.lv >= 3 && c.exp) kids.push(h('span', { class: 'sk-exp', text: (x ? 'Ran out ' : 'Runs out ') + c.exp }));
        kids.push(sel);
        row.push(h('td', { class: 'sk-cell' }, kids));
      });
      tb.appendChild(h('tr', {}, row));
    });
    var n = counts(), risky = [];
    ft.appendChild(h('tr', {}, [h('th', { scope: 'row', text: 'People at 3 or more' })].concat(n.map(function (k, i) {
      if (k < 2) risky.push(SKILLS[i].n);
      return h('td', { class: k < 2 ? 'sk-risk' : '' }, [h('strong', { text: String(k) }), k < 2 ? h('span', { class: 'sk-exp', text: 'Single-point risk' }) : null]);
    }))));
    $('mSum').textContent = people.length + ' people, ' + SKILLS.length + ' skills. ' + (risky.length ? 'Single-point risk (fewer than 2 people at level 3 or more): ' + risky.join(', ') + '.' : 'Every skill has at least 2 people at level 3 or more.');
  }
  $('mDown').addEventListener('click', function () {
    var q = function (x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; };
    var head = ['Person'];
    SKILLS.forEach(function (s) { head.push(s.n); if (s.safe) head.push(s.n + ' expiry'); });
    var rows = people.map(function (p) {
      var r = [p];
      SKILLS.forEach(function (s) { var c = cell(p, s.n); r.push(c ? c.lv : 0); if (s.safe) r.push(c && c.lv >= 3 && c.exp ? c.exp + (expired(c) ? ' (run out)' : '') : ''); });
      return r;
    });
    var n = counts(), last = ['People at 3 or more'];
    SKILLS.forEach(function (s, i) { last.push(n[i] + (n[i] < 2 ? ' (single-point risk)' : '')); if (s.safe) last.push(''); });
    rows.push(last);
    K.download('skills-matrix.csv', [head].concat(rows).map(function (r) { return r.map(q).join(','); }).join('\r\n') + '\r\n');
  });

  /* Sign off */
  function info() {
    var p = $('sWho').value, s = $('sSkill').value, sk = skill(s), c = cell(p, s);
    var teachers = people.filter(function (x) { var t = cell(x, s); return t && t.lv === 4 && !expired(t); });
    $('sExp').disabled = !(sk && sk.safe);
    $('sInfo').textContent = p + ' is at level ' + (c ? c.lv : 0) + ' in ' + s + (c && expired(c) ? ' (run out)' : '') + '. Can sign off this skill: ' + (teachers.length ? teachers.join(', ') : 'nobody yet') + '.';
  }
  ['sWho', 'sSkill'].forEach(function (id) { $(id).addEventListener('change', info); });
  $('sGo').addEventListener('click', function () {
    var p = $('sWho').value, s = $('sSkill').value, lv = +$('sLv').value, by = $('sBy').value, sk = skill(s), exp = $('sExp').value;
    var c = cell(p, s), from = c ? c.lv : 0, b = cell(by, s);
    if (!p || !sk || !by) { K.say('Please pick a learner, a skill and who signs off.'); return; }
    if (by === p) { K.say('Refused: ' + p + ' cannot sign off their own level. Pick a different person.'); $('sBy').focus(); return; }
    if (!b || b.lv !== 4) { K.say('Refused: ' + by + ' is at level ' + (b ? b.lv : 0) + ' in ' + s + '. Only someone at level 4 can sign off.'); $('sBy').focus(); return; }
    if (expired(b)) { K.say('Refused: ' + by + ' has run out in ' + s + ' (' + b.exp + '). They must renew first.'); return; }
    if (lv <= from && !(c && expired(c))) { K.say(p + ' is already at level ' + from + ' in ' + s + '. Pick a higher level.'); return; }
    if (sk.safe && !exp) { K.say('Please give an expiry date. ' + s + ' is a safety skill.'); $('sExp').focus(); return; }
    if (sk.safe && exp <= today()) { K.say('The expiry date must be after today.'); $('sExp').focus(); return; }
    var note = clean('sNote'); if (note === null) return;
    setCell(p, s, lv, sk.safe ? exp : '');
    log.unshift({ t: stamp(), kind: 'sign', who: p, skill: s, from: from, to: lv, by: by, exp: sk.safe ? exp : '', note: note });
    $('sNote').value = '';
    if (K.save()) K.say('Signed off: ' + p + ' is now level ' + lv + ' in ' + s + ', signed by ' + by + '.' + (sk.safe ? ' Runs out ' + exp + '.' : ''));
    info(); drawLog();
  });
  function drawLog() {
    var ul = K.clear($('sLog'));
    log.slice(0, 40).forEach(function (e) {
      var line = e.kind === 'sign' ? e.who + ': ' + e.skill + ' from ' + e.from + ' to ' + e.to + ', signed off by ' + e.by + (e.exp ? '. Runs out ' + e.exp : '') + '.'
        : e.who + ': ' + e.skill + ' changed from ' + e.from + ' to ' + e.to + ' on the matrix.';
      ul.appendChild(h('li', { class: 'k-item' }, [h('p', {}, [h('span', { class: 'k-tag' + (e.kind === 'sign' ? ' k-ok' : ''), text: e.kind === 'sign' ? 'Sign-off' : 'Change' }), e.t]),
        h('p', { text: line + (e.note ? '\nChecked: ' + e.note : '') })]));
    });
    if (!log.length) ul.appendChild(h('li', { class: 'k-note', text: 'No sign-offs or changes yet.' }));
  }

  /* Plan */
  $('pBy').value = addDays(30);
  function gaps() {
    var g = [], n = counts();
    people.forEach(function (p) { SKILLS.forEach(function (s) { var c = cell(p, s.n); if (c && expired(c)) g.push({ who: p, skill: s.n, text: p + ': ' + s.n + ' ran out on ' + c.exp + '.' }); }); });
    SKILLS.forEach(function (s, i) { if (n[i] < 2) g.push({ who: '', skill: s.n, text: s.n + ': only ' + n[i] + ' ' + (n[i] === 1 ? 'person' : 'people') + ' at level 3 or more. Single-point risk.' }); });
    return g;
  }
  function drawGaps() {
    var ul = K.clear($('pGaps')), g = gaps();
    g.forEach(function (x) {
      var planned = plan.filter(function (l) { return !l.done && l.skill === x.skill && (!x.who || l.who === x.who); }).length;
      ul.appendChild(h('li', { class: 'k-item' }, [h('p', {}, [h('span', { class: 'k-tag ' + (planned ? 'k-ok' : 'k-warn'), text: planned ? 'Planned' : 'Gap' }), x.text]),
        h('div', { class: 'k-mini' }, [K.btn('Plan this', function () { if (x.who) $('pWho').value = x.who; $('pSkill').value = x.skill; $('pNote').focus(); K.say('Pick who and a date, then press Add to plan.'); })])]));
    });
    if (!g.length) ul.appendChild(h('li', { class: 'k-note', text: 'No gaps right now.' }));
  }
  $('pAdd').addEventListener('click', function () {
    var who = $('pWho').value, s = $('pSkill').value, by = $('pBy').value;
    if (!who || !s) { K.say('Please pick who and a skill.'); return; }
    if (!by) { K.say('Please pick a by date.'); $('pBy').focus(); return; }
    if (by < today()) { K.say('The by date cannot be in the past.'); $('pBy').focus(); return; }
    var note = clean('pNote'); if (note === null) return;
    plan.push({ id: K.id(), t: stamp(), who: who, skill: s, by: by, note: note, done: '' });
    plan.sort(function (a, b) { return a.by < b.by ? -1 : a.by > b.by ? 1 : 0; });
    $('pNote').value = '';
    if (K.save()) K.say('Added to plan: ' + who + ', ' + s + ', by ' + by + '.');
    drawGaps(); drawPlan();
  });
  function drawPlan() {
    var ul = K.clear($('pList'));
    plan.forEach(function (l, i) {
      var late = !l.done && l.by < today();
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: l.who + ': ' + l.skill }),
        h('p', { text: 'By ' + l.by + (l.note ? '\nHow: ' + l.note : '') + '\nAdded ' + l.t + (l.done ? '\nDone ' + l.done : '') }),
        h('p', {}, [h('span', { class: 'k-tag' + (l.done ? ' k-ok' : late ? ' k-warn' : ''), text: l.done ? 'Done' : late ? 'Late' : 'Planned' })]),
        h('div', { class: 'k-mini' }, [l.done ? null : K.btn('Mark done', function () { l.done = stamp(); K.save(); drawGaps(); drawPlan(); K.say('Plan line marked done. Use Sign off to raise the level.'); }, 'k-small'),
          K.btn('Remove', function () { plan.splice(i, 1); K.save(); drawGaps(); drawPlan(); K.say('Plan line removed.'); })])]));
    });
    if (!plan.length) ul.appendChild(h('li', { class: 'k-note', text: 'No plan lines yet.' }));
  }
  $('pDown').addEventListener('click', function () {
    if (!plan.length) { K.say('There is no plan line to download yet.'); return; }
    var q = function (x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; };
    K.download('training-plan.csv', 'Who,Skill,By date,How,Added,Done\r\n' + plan.map(function (l) { return [l.who, l.skill, l.by, l.note, l.t, l.done].map(q).join(','); }).join('\r\n') + '\r\n');
  });

  drawMatrix(); info(); drawLog(); drawGaps(); drawPlan();
})();
