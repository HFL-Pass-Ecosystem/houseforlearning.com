/* Job board: jobs posted by a buyer or staff, claimed by vendors or freelancers, awarded by a different person, then handed in, checked and closed. No amounts. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var mine = K.get('jobs'), claims = K.get('jobsClaims'), states = K.get('jobsState');
  var KINDS = ['Physical', 'Hybrid', 'Digital'], STEPS = ['Awarded', 'Work handed in', 'Checked', 'Closed'];
  function J(n, kind, title, area, days, scope) { return { id: 'j' + n, kind: kind, title: title, area: area, days: days, scope: scope, by: 'Staff', sample: true }; }
  var SAMPLES = [
    J(1, 'Physical', 'Sheet-metal job work: 40 brackets', 'Fabrication', 10, 'Cut, bend and punch 40 mild steel brackets to the drawing we share. Deburred, zinc plated, packed in tens. Handed in at our store with a short check sheet.'),
    J(2, 'Physical', 'Panel wiring for two small control boxes', 'Electrical', 14, 'Wire two control boxes to the schematic. Ferrules on every end, labels on every terminal. Hand in with a continuity test sheet.'),
    J(3, 'Physical', 'Machined bushes, short run', 'Machining', 7, 'Turn 25 bronze bushes to the drawing. Measure five at random and write the sizes on the hand-in note.'),
    J(4, 'Hybrid', 'Site survey with a remote report review', 'Survey', 12, 'One visit to measure and photograph a workshop floor, then a shared review of the written report by video call.'),
    J(5, 'Hybrid', 'Commissioning support for a pump skid', 'Commissioning', 9, 'Two days of start-up checks on site, a written punch list, and two weeks of online follow-up on open points.'),
    J(6, 'Digital', 'Drawing check: 12 fabrication drawings', 'Design review', 5, 'Check 12 drawings for missing sizes, tolerances and notes. Hand in a marked-up copy and a list of points.'),
    J(7, 'Digital', 'Translation of a user manual', 'Translation', 15, 'About forty pages of technical wording into two languages. Keep the headings and the table layout.'),
    J(8, 'Digital', 'Spare parts list from scanned pages', 'Data entry', 6, 'Type about 300 lines from scanned parts pages into a sheet: part code, name, quantity per machine.')
  ];
  var D = (window.SITE_DATA && window.SITE_DATA.jobs) || null;
  if (Array.isArray(D) && D.length) {
    SAMPLES = D.filter(function (r) { return Array.isArray(r) && r[0]; }).map(function (r, i) {
      var k = KINDS.indexOf(r[1]) >= 0 ? r[1] : KINDS[0], d = Math.max(1, Math.min(365, parseInt(r[3], 10) || 7));
      return J(i + 1, k, clean(r[0], 90), clean(r[2] || '', 60), d, 'Work in ' + (clean(r[2] || '', 60) || 'this area') + '. Ask for the full scope when you claim.');
    });
  }
  function clean(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n); }
  function all() { return mine.concat(SAMPLES); }
  function byId(id) { return all().filter(function (j) { return j.id === id; })[0]; }
  function claimsOf(id) { return claims.filter(function (c) { return c.job === id; }); }
  function stateOf(id, make) {
    var s = states.filter(function (x) { return x.job === id; })[0];
    if (!s && make) { s = { job: id, step: -1, vendor: '', claim: '', rating: 0, log: [] }; states.push(s); }
    return s;
  }
  function status(id) { var s = stateOf(id); return s && s.step >= 0 ? STEPS[s.step] : 'Open'; }
  function stamp() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function addLog(id, who, what) { stateOf(id, true).log.push({ t: stamp(), who: who, what: what }); }
  function same(a, b) { return a.trim().toLowerCase().replace(/\s+/g, ' ') === b.trim().toLowerCase().replace(/\s+/g, ' '); }
  function bad(t) {
    if (/\d\s*(usd|aed|inr|eur|gbp|cad|rs\.?|dollars?|rupees?|dirhams?|euros?|pounds?)\b|\b(usd|aed|inr|eur|gbp|cad|rs\.?)\s*\d|[$€£₹]\s*\d/i.test(t)) return 'Please take the amount out. Jobs here are "price on request".';
    if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(t) || /(\+|\b)\d[\d\s().-]{7,}\d\b/.test(t)) return 'Please take out phone numbers and emails.';
    return '';
  }
  function field(id, label, el) { el.id = id; return h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: id, text: label }), el]); }
  function need(el, what, n) { var v = clean(el.value, n || 60); if (!v) { K.say('Please write ' + what + '.'); el.focus(); } return v; }

  /* Open jobs */
  var openForm = {};
  function claimForm(j) {
    var vn = h('input', { class: 'k-in', maxlength: 60, placeholder: 'for example Demo Vendor A' });
    var dy = h('input', { class: 'k-in', type: 'number', min: 1, max: 365, value: j.days });
    var hw = h('input', { class: 'k-in', maxlength: 140, placeholder: 'one line on how you will do it' });
    return h('div', {}, [h('div', { class: 'k-row' }, [field('cv' + j.id, 'Vendor or freelancer name', vn), field('cd' + j.id, 'Days you need', dy)]),
      h('div', { class: 'k-row' }, [field('ch' + j.id, 'How you will do it (one line)', hw)]),
      h('div', { class: 'k-mini' }, [h('button', { type: 'button', class: 'k-btn k-small', id: 'cs' + j.id, text: 'Send my claim', onclick: function () {
        var v = need(vn, 'your vendor name'); if (!v) return;
        var d = parseInt(dy.value, 10); if (!(d >= 1 && d <= 365)) { K.say('Please write the days you need: a whole number from 1 to 365.'); dy.focus(); return; }
        var w = need(hw, 'one line on how you will do it', 140); if (!w) return;
        var b = bad(v + ' ' + w); if (b) { K.say(b); return; }
        if (claimsOf(j.id).some(function (c) { return same(c.vendor, v); })) { K.say(v + ' has already claimed this job.'); return; }
        claims.push({ id: K.id(), job: j.id, n: claimsOf(j.id).length + 1, vendor: v, days: d, how: w, t: stamp() });
        addLog(j.id, v, 'Claimed: ' + d + ' day(s). ' + w);
        openForm[j.id] = false; K.save(); drawAll(); K.say('Claim sent for "' + j.title + '". It now shows in Award.');
      } }), K.btn('Cancel', function () { openForm[j.id] = false; drawOpen(); })])]);
  }
  function card(j, where) {
    var n = claimsOf(j.id).length, st = status(j.id), open = st === 'Open';
    return h('li', { class: 'k-item' }, [h('h3', { text: j.title }), h('p', {}, [
      h('span', { class: 'k-tag', text: j.kind }), j.area ? h('span', { class: 'k-tag', text: j.area }) : null,
      h('span', { class: 'k-tag' + (open ? ' k-ok' : ' k-warn'), text: st }),
      h('span', { class: 'k-tag', text: j.sample ? 'Sample' : 'Posted by ' + j.by })]),
      h('p', { text: j.scope }),
      h('p', { class: 'k-note', text: 'Finish within ' + j.days + ' day' + (j.days === 1 ? '' : 's') + '. Price on request. ' + n + ' claim' + (n === 1 ? '' : 's') + ' so far.' }),
      where === 'open' && open && openForm[j.id] ? claimForm(j) : null,
      h('div', { class: 'k-mini' }, [
        where === 'open' && open && !openForm[j.id] ? h('button', { type: 'button', class: 'k-btn k-small', id: 'cl' + j.id, text: 'Claim this job', onclick: function () { openForm[j.id] = true; drawOpen(); var f = $('cv' + j.id); if (f) f.focus(); } }) : null,
        where === 'mine' && !n ? K.btn('Remove', function () { if (confirm('Remove this job?')) { mine.splice(mine.indexOf(j), 1); K.save(); drawAll(); K.say('Job removed.'); } }) : null])]);
  }
  function drawOpen() {
    var ul = K.clear($('jList')), k = $('fKind').value, n = 0;
    all().forEach(function (j) { if (k && j.kind !== k) return; n++; ul.appendChild(card(j, 'open')); });
    $('fShown').textContent = n + ' of ' + all().length + ' jobs shown.';
    if (!n) ul.appendChild(h('li', { class: 'k-note', text: 'No job of this kind. Try "All kinds".' }));
  }
  function drawMine() {
    var ul = K.clear($('pList'));
    mine.forEach(function (j) { ul.appendChild(card(j, 'mine')); });
    if (!mine.length) ul.appendChild(h('li', { class: 'k-note', text: 'You have not posted a job yet.' }));
  }

  /* Award and the steps after it */
  function stepBox(j, s) {
    var box = h('div', { class: 'k-row' }), nm = h('input', { class: 'k-in', maxlength: 60 });
    function go(who, what, extra) { if (extra) extra(); s.step++; addLog(j.id, who, what); K.save(); drawAll(); K.say('"' + j.title + '": ' + STEPS[s.step] + '.'); }
    if (s.step === 0) {
      box.appendChild(field('sn' + j.id, 'Name of the person handing in the work', nm));
      box.appendChild(h('button', { type: 'button', class: 'k-btn k-small', id: 'sb' + j.id, text: 'Work handed in', onclick: function () { var w = need(nm, 'the name of the person handing in'); if (w) go(w, 'Work handed in'); } }));
    } else if (s.step === 1) {
      box.appendChild(field('sn' + j.id, 'Checker name (not the vendor)', nm));
      box.appendChild(h('button', { type: 'button', class: 'k-btn k-small', id: 'sb' + j.id, text: 'Checked', onclick: function () {
        var w = need(nm, 'the checker name'); if (!w) return;
        if (same(w, s.vendor)) { K.say('Refused: the checker must be a different person from the vendor (' + s.vendor + ').'); nm.focus(); return; }
        go(w, 'Work checked against the scope');
      } }));
    } else if (s.step === 2) {
      var rt = h('select', { class: 'k-in' }, ['5 Very good', '4 Good', '3 All right', '2 Poor', '1 Very poor'].map(function (x) { return h('option', { value: x.charAt(0), text: x }); }));
      box.appendChild(field('sr' + j.id, 'Rating for the vendor', rt)); box.appendChild(field('sn' + j.id, 'Your name', nm));
      box.appendChild(h('button', { type: 'button', class: 'k-btn k-small', id: 'sb' + j.id, text: 'Close the job', onclick: function () {
        var w = need(nm, 'your name'); if (!w) return; var r = parseInt(rt.value, 10);
        if (!(r >= 1 && r <= 5)) { K.say('Please pick a rating from 1 to 5.'); return; }
        go(w, 'Closed with rating ' + r + ' of 5', function () { s.rating = r; });
      } }));
    } else box.appendChild(h('p', { class: 'k-note', text: 'Closed. Rating ' + s.rating + ' of 5.' }));
    return box;
  }
  function awardItem(j) {
    var s = stateOf(j.id, true), cs = claimsOf(j.id), aw = h('input', { class: 'k-in', maxlength: 60, placeholder: 'for example Demo Buyer' });
    var kids = [h('h3', { text: j.title }), h('p', {}, [h('span', { class: 'k-tag', text: j.kind }), h('span', { class: 'k-tag' + (s.step < 0 ? ' k-ok' : ' k-warn'), text: status(j.id) })])];
    var ul = h('ul', { class: 'k-list' });
    cs.forEach(function (c) {
      var won = s.claim === c.id;
      ul.appendChild(h('li', { class: 'k-item' }, [h('p', { text: 'Claim ' + c.n + ': ' + c.vendor + ', ' + c.days + ' day(s). ' + c.how }),
        h('p', { class: 'k-note', text: 'Sent ' + c.t + (won ? '. Awarded.' : '') }),
        s.step < 0 ? h('div', { class: 'k-mini' }, [h('button', { type: 'button', class: 'k-btn k-small', id: 'ab' + j.id + '-' + c.n, text: 'Award to ' + c.vendor, onclick: function () {
          var w = need(aw, 'the name of the person who awards'); if (!w) return;
          if (same(w, c.vendor)) { K.say('Refused: the person who awards must be different from the claiming vendor (' + c.vendor + ').'); aw.focus(); return; }
          s.step = 0; s.vendor = c.vendor; s.claim = c.id; addLog(j.id, w, 'Awarded to ' + c.vendor + ' (claim ' + c.n + ')');
          K.save(); drawAll(); K.say('"' + j.title + '" awarded to ' + c.vendor + '.');
        } })]) : null]));
    });
    kids.push(ul);
    if (s.step < 0) kids.push(h('div', { class: 'k-row' }, [field('aw' + j.id, 'Your name, to award (must differ from the vendor)', aw)]));
    else { kids.push(h('p', { class: 'k-note', text: 'Vendor: ' + s.vendor + '. Next: ' + (s.step < 3 ? STEPS[s.step + 1] : 'nothing, the job is closed') + '.' })); kids.push(stepBox(j, s)); }
    kids.push(h('h3', { text: 'Log' }));
    kids.push(h('ul', { class: 'k-list', id: 'lg' + j.id }, s.log.map(function (e) { return h('li', { class: 'k-note', text: e.t + ' | ' + e.who + ' | ' + e.what }); })));
    return h('li', { class: 'k-item', id: 'aj' + j.id }, kids);
  }
  function drawAward() {
    var ul = K.clear($('aList')), list = all().filter(function (j) { return claimsOf(j.id).length; });
    list.forEach(function (j) { ul.appendChild(awardItem(j)); });
    if (!list.length) ul.appendChild(h('li', { class: 'k-note', text: 'No job has a claim yet. Go to Open jobs and press "Claim this job".' }));
    $('aCount').textContent = '(' + list.length + ')';
  }
  function drawAll() { drawOpen(); drawMine(); drawAward(); }
  function report() {
    return 'JOB BOARD: all jobs and logs\nMade ' + stamp() + '. Price on request for every job.\n\n' + all().map(function (j) {
      var s = stateOf(j.id), cs = claimsOf(j.id);
      return 'JOB ' + j.id + ': ' + j.title + '\nKind: ' + j.kind + (j.area ? ' | Area: ' + j.area : '') + ' | Finish within ' + j.days + ' day(s) | Status: ' + status(j.id) + (s && s.rating ? ' | Rating ' + s.rating + ' of 5' : '') +
        '\nScope: ' + j.scope + '\nClaims: ' + (cs.length ? '\n' + cs.map(function (c) { return '  ' + c.n + '. ' + c.vendor + ', ' + c.days + ' day(s): ' + c.how; }).join('\n') : 'none') +
        '\nLog: ' + (s && s.log.length ? '\n' + s.log.map(function (e) { return '  ' + e.t + ' | ' + e.who + ' | ' + e.what; }).join('\n') : 'none') + '\n';
    }).join('\n----\n');
  }

  var TABS = ['Open', 'Post', 'Award'];
  function show(n) { TABS.forEach(function (m) { $('t' + m).setAttribute('aria-selected', m === n ? 'true' : 'false'); $('v' + m).hidden = m !== n; }); }
  TABS.forEach(function (n) { $('t' + n).addEventListener('click', function () { show(n); }); });
  $('fKind').addEventListener('change', drawOpen);
  $('pAdd').addEventListener('click', function () {
    var t = clean($('pTitle').value, 90), d = clean($('pScope').value, 600), n = parseInt($('pDays').value, 10);
    if (!t) { K.say('Please write a title.'); $('pTitle').focus(); return; }
    if (!d) { K.say('Please write the scope.'); $('pScope').focus(); return; }
    if (!(n >= 1 && n <= 365)) { K.say('Please write the days to finish: a whole number from 1 to 365.'); $('pDays').focus(); return; }
    var b = bad(t + ' ' + d); if (b) { K.say(b); return; }
    mine.unshift({ id: 'm' + K.id(), kind: KINDS.indexOf($('pKind').value) >= 0 ? $('pKind').value : KINDS[0], title: t, area: '', days: n, scope: d, by: $('pBy').value === 'Staff' ? 'Staff' : 'Buyer' });
    $('pTitle').value = ''; $('pScope').value = ''; if (K.save()) K.say('Job posted. It now shows in Open jobs.'); drawAll();
  });
  $('aDown').addEventListener('click', function () { K.download('job-board.txt', report()); });
  drawAll();
})();
