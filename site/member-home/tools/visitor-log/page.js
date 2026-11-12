/* Visitor log: sign visitors in and out of a physical workplace. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var visits = K.get('vis.visits'), log = K.get('vis.log');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var team = ((W && Array.isArray(W.team) && W.team.length) ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chitra', 'Demo Dev', 'Demo Elena', 'Demo Farid'])
    .map(function (n) { return String(n || '').trim().slice(0, 60); }).filter(function (n) { return n; });
  var AREAS = ['Reception', 'Office', 'Workshop', 'Test bay', 'Store'];
  var RISKY = { 'Workshop': 1, 'Test bay': 1 };
  var BRIEF = ['Shown the fire exits and the assembly point', 'Given safety glasses, safety shoes and a hi-vis vest',
    'Told to stay with the host and keep out of marked danger zones', 'Told what the alarm sounds like and what to do when it rings'];

  function two(n) { return ('0' + n).slice(-2); }
  function day(t) { var d = new Date(t); return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()); }
  function hm(t) { if (!t) return ''; var d = new Date(t); return two(d.getHours()) + ':' + two(d.getMinutes()); }
  function dur(a, b) { var m = Math.max(0, Math.round(((b || Date.now()) - a) / 60000)); return (m >= 60 ? Math.floor(m / 60) + ' h ' : '') + (m % 60) + ' min'; }
  function same(a, b) { return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase(); }
  function badgeNo() {
    var n = 0;
    visits.forEach(function (v) { var x = parseInt(String(v.badge).slice(2), 10); if (x > n) n = x; });
    return 'V-' + ('00' + (n + 1)).slice(-3);
  }
  function note(who, what) { log.unshift({ t: Date.now(), who: who, what: what }); if (log.length > 500) log.length = 500; }
  /* Refuse money amounts, phone numbers and emails in typed text. */
  function bad(s) {
    if (/\S+@\S+\.\S+/.test(s)) return 'an email address';
    if (/\+?\d[\d\s().-]{7,}\d/.test(s)) return 'a phone number';
    if (/[$₹€£¥]|\b(usd|inr|eur|gbp|rs\.?|rupees?|dollars?|euros?|pounds?)\b/i.test(s)) return 'a money amount';
    return '';
  }
  function clean(s, n) { return String(s || '').trim().replace(/[<>]/g, '').replace(/\s+/g, ' ').slice(0, n); }

  var TABS = ['In', 'Now', 'Hist'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      if (n === 'Now') drawNow(); if (n === 'Hist') drawHist(); if (n === 'In') $('iBadge').value = badgeNo();
    });
  });

  /* Sign in */
  $('iHost').appendChild(h('option', { value: '', text: 'Pick a host' }));
  team.forEach(function (n) { $('iHost').appendChild(h('option', { value: n, text: n })); });
  AREAS.forEach(function (a) { $('iArea').appendChild(h('option', { value: a, text: a + (RISKY[a] ? ' (safety briefing needed)' : '') })); });
  BRIEF.forEach(function (b, i) {
    $('iBrief').appendChild(h('label', { class: 'k-check' }, [h('input', { type: 'checkbox', id: 'iB' + i }), h('span', { text: b })]));
  });
  $('iBadge').value = badgeNo();
  $('iGo').addEventListener('click', function () {
    var name = clean($('iName').value, 60), org = clean($('iOrg').value, 60), host = $('iHost').value, area = $('iArea').value;
    var why = clean($('iWhy').value, 120), desk = clean($('iDesk').value, 60), i, ticks = [];
    for (i = 0; i < BRIEF.length; i++) if ($('iB' + i).checked) ticks.push(i);
    if (!name) { K.say('Not signed in: please type the visitor name.'); $('iName').focus(); return; }
    if (!/^demo\b/i.test(name)) { K.say('Not signed in: this is a practice tool, so the visitor name must start with "Demo".'); $('iName').focus(); return; }
    var fields = [['Visitor name', name], ['Organisation', org], ['Purpose', why], ['Reception name', desk]];
    for (i = 0; i < fields.length; i++) {
      var b = bad(fields[i][1]);
      if (b) { K.say('Not signed in: ' + fields[i][0] + ' looks like it has ' + b + '. Please leave that out.'); return; }
    }
    if (org && !/^demo\b/i.test(org)) { K.say('Not signed in: this is a practice tool, so the organisation must start with "Demo".'); $('iOrg').focus(); return; }
    if (!host) { K.say('Not signed in: every visitor needs a host. Please pick a host.'); $('iHost').focus(); return; }
    if (RISKY[area] && ticks.length < BRIEF.length) { K.say('Not signed in: the ' + area + ' needs all four safety briefing points ticked. ' + (BRIEF.length - ticks.length) + ' still missing.'); return; }
    if (!desk) { K.say('Not signed in: please type the reception name (who is signing the visitor in).'); $('iDesk').focus(); return; }
    if (!/^demo\b/i.test(desk)) { K.say('Not signed in: this is a practice tool, so the reception name must start with "Demo".'); $('iDesk').focus(); return; }
    if (same(desk, host)) { K.say('Not signed in: the host must be a different person from the reception person, so someone else can confirm.'); return; }
    for (i = 0; i < visits.length; i++) if (!visits[i].out && same(visits[i].name, name)) { K.say('Not signed in: ' + name + ' is already on site with badge ' + visits[i].badge + '.'); return; }
    var v = { id: K.id(), badge: badgeNo(), name: name, org: org, host: host, area: area, why: why, brief: ticks, desk: desk, inAt: Date.now(), out: 0, met: '', metAt: 0 };
    visits.push(v);
    note(desk, 'Signed in ' + name + ' (' + v.badge + ') to see ' + host + ' in ' + area + '.');
    if (K.save()) K.say('Signed in: ' + name + ', badge ' + v.badge + ', ' + area + '. Host ' + host + ' still needs to confirm they met them.');
    ['iName', 'iOrg', 'iWhy'].forEach(function (x) { $(x).value = ''; });
    for (i = 0; i < BRIEF.length; i++) $('iB' + i).checked = false;
    $('iHost').value = ''; $('iBadge').value = badgeNo();
  });

  /* On site now */
  function onSite() { return visits.filter(function (v) { return !v.out; }); }
  function drawNow() {
    var now = onSite(), tb = K.clear(document.querySelector('#nCount tbody')), ul = K.clear($('nList'));
    AREAS.forEach(function (a) {
      tb.appendChild(h('tr', {}, [h('th', { scope: 'row', text: a }), h('td', { text: String(now.filter(function (v) { return v.area === a; }).length) })]));
    });
    $('nSum').textContent = now.length + ' visitor(s) on site now. ' + now.filter(function (v) { return !v.met; }).length + ' not yet confirmed by their host.';
    now.forEach(function (v) {
      var sel = h('select', { class: 'k-in', id: 'm' + v.id, 'aria-label': 'Who is confirming for ' + v.name }, [h('option', { value: '', text: 'I am...' })]
        .concat(team.map(function (n) { return h('option', { value: n, text: n }); })));
      var btns = [];
      if (!v.met) {
        btns.push(sel);
        btns.push(K.btn('Host: confirm I met them', function () {
          var who = sel.value;
          if (!who) { K.say('Not confirmed: please pick your name first.'); return; }
          if (same(who, v.desk)) { K.say('Not confirmed: ' + who + ' signed this visitor in. The host must be a different person.'); return; }
          if (!same(who, v.host)) { K.say('Not confirmed: only the host, ' + v.host + ', can confirm meeting ' + v.name + '.'); return; }
          v.met = who; v.metAt = Date.now(); note(who, 'Confirmed meeting ' + v.name + ' (' + v.badge + ').');
          if (K.save()) K.say(who + ' confirmed meeting ' + v.name + '.'); drawNow();
        }, 'k-small'));
      }
      btns.push(K.btn('Sign out', function () {
        v.out = Date.now(); note('Reception', 'Signed out ' + v.name + ' (' + v.badge + ') after ' + dur(v.inAt, v.out) + '.');
        if (K.save()) K.say('Signed out: ' + v.name + ', badge ' + v.badge + '. Please collect the badge.'); drawNow();
      }));
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: v.badge + ': ' + v.name + (v.org ? ', ' + v.org : '') }),
        h('p', { text: 'Host: ' + v.host + '\nArea: ' + v.area + '\nTime in: ' + hm(v.inAt) + ' (' + dur(v.inAt) + ' ago)' + (v.why ? '\nPurpose: ' + v.why : '') + '\nSigned in by: ' + v.desk }),
        h('p', {}, [h('span', { class: 'k-tag ' + (v.met ? 'k-ok' : 'k-warn'), text: v.met ? 'Host met them at ' + hm(v.metAt) : 'Waiting for host' }),
          h('span', { class: 'k-tag' + (v.brief.length === BRIEF.length ? ' k-ok' : ''), text: 'Briefing ' + v.brief.length + ' of ' + BRIEF.length })]),
        h('div', { class: 'k-mini' }, btns)]));
    });
    if (!now.length) ul.appendChild(h('li', { class: 'k-note', text: 'Nobody is signed in right now.' }));
  }
  $('nEvac').addEventListener('click', function () {
    var now = onSite(), t = Date.now();
    var lines = ['EVACUATION LIST', 'Made: ' + day(t) + ' ' + hm(t), 'People on site: ' + now.length, ''];
    AREAS.forEach(function (a) {
      var here = now.filter(function (v) { return v.area === a; });
      lines.push(a + ' (' + here.length + ')');
      here.forEach(function (v) { lines.push('  [ ] ' + v.badge + '  ' + v.name + (v.org ? ', ' + v.org : '') + '  host: ' + v.host + '  in since ' + hm(v.inAt)); });
      if (!here.length) lines.push('  nobody');
      lines.push('');
    });
    lines.push('Tick each person at the assembly point. Tell the person in charge about anyone missing.');
    note('Reception', 'Downloaded the evacuation list (' + now.length + ' on site).'); K.save();
    K.download('evacuation-list-' + day(t) + '.txt', lines.join('\r\n') + '\r\n');
  });

  /* History */
  function shown() { var d = $('hDate').value; return visits.filter(function (v) { return !d || day(v.inAt) === d; }); }
  function row(v) {
    return [day(v.inAt), v.badge, v.name, v.org, v.host, v.area, hm(v.inAt), v.out ? hm(v.out) : 'On site', dur(v.inAt, v.out) + (v.out ? '' : ' so far'), v.desk, v.met ? v.met + ' at ' + hm(v.metAt) : 'Not yet'];
  }
  function drawHist() {
    var list = shown().slice().reverse(), tb = K.clear(document.querySelector('#hTab tbody'));
    list.forEach(function (v) { tb.appendChild(h('tr', {}, row(v).map(function (c) { return h('td', { text: c }); }))); });
    if (!list.length) tb.appendChild(h('tr', {}, [h('td', { colspan: '11', text: 'No visits to show.' })]));
    $('hSum').textContent = ($('hDate').value ? 'Date ' + $('hDate').value : 'All dates') + ': ' + list.length + ' visit(s), ' + list.filter(function (v) { return !v.out; }).length + ' still on site.';
    var ul = K.clear($('hLog'));
    log.slice(0, 50).forEach(function (e) { ul.appendChild(h('li', { class: 'k-item' }, [h('p', { text: day(e.t) + ' ' + hm(e.t) + ', ' + e.who + ': ' + e.what })])); });
    if (!log.length) ul.appendChild(h('li', { class: 'k-note', text: 'Nothing has happened yet.' }));
  }
  $('hDate').addEventListener('change', drawHist);
  $('hAll').addEventListener('click', function () { $('hDate').value = ''; drawHist(); });
  $('hDown').addEventListener('click', function () {
    var list = shown();
    if (!list.length) { K.say('There is no visit to download yet.'); return; }
    var q = function (x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; };
    K.download('visitor-log.csv', 'Date,Badge,Visitor,Organisation,Host,Area,Time in,Time out,Duration,Signed in by,Host confirmed\r\n' +
      list.map(function (v) { return row(v).map(q).join(','); }).join('\r\n') + '\r\n');
  });
  drawNow(); drawHist();
})();
