/* Shift roster: a week of shifts per team member, cover per shift, rest rules and supervisor-approved swaps. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var SHIFTS = ['Morning', 'Afternoon', 'Night'], WORK = ['Morning', 'Afternoon', 'Night', 'Remote'];
  var CHOICES = ['Off', 'Morning', 'Afternoon', 'Night', 'Remote', 'Leave'];
  var MIN_IDS = ['rMinM', 'rMinA', 'rMinN'], MAX_SHIFTS = 5, MAX_ROW = 6;

  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var roster = K.get('roster'), mins = K.get('rosterMin'), swaps = K.get('rosterSwaps');
  if (!roster.length) {
    var start = (W && Array.isArray(W.team) && W.team.length) ? W.team : ['Demo Lead', 'Demo Operator A', 'Demo Operator B', 'Demo Technician', 'Demo Assistant', 'Demo Helper'];
    start.forEach(function (n) { roster.push({ name: String(n).slice(0, 40), days: ['Off', 'Off', 'Off', 'Off', 'Off', 'Off', 'Off'] }); });
  }
  if (mins.length !== 3) { mins.length = 0; mins.push(1, 1, 1); }
  function isWork(v) { return WORK.indexOf(v) >= 0; }
  function names() { return roster.map(function (p) { return p.name; }); }
  function person(n) { for (var i = 0; i < roster.length; i++) if (roster[i].name === n) return roster[i]; return null; }

  var TABS = ['Week', 'Swap'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (m) { $('t' + m).setAttribute('aria-selected', m === n ? 'true' : 'false'); $('v' + m).hidden = m !== n; });
    });
  });

  /* Cover: how many people are on each shift each day, against the minimum. */
  function count(d, s) { return roster.filter(function (p) { return p.days[d] === s; }).length; }
  function shortBy(d, si) { return Math.max(0, mins[si] - count(d, SHIFTS[si])); }

  /* Rule checks for one person. Returns a list of plain sentences. */
  function problems(p) {
    var out = [], run = 0, best = 0, n = 0;
    for (var d = 0; d < 7; d++) {
      if (d < 6 && p.days[d] === 'Night' && p.days[d + 1] === 'Morning') out.push(p.name + ': Night on ' + DAYS[d] + ' then Morning on ' + DAYS[d + 1] + '. Not enough rest between shifts.');
      if (isWork(p.days[d])) { n++; run++; if (run > best) best = run; } else run = 0;
    }
    if (best > MAX_ROW) out.push(p.name + ': works ' + best + ' days in a row. The most is ' + MAX_ROW + '.');
    if (n > MAX_SHIFTS) out.push(p.name + ': has ' + n + ' working shifts. The most is ' + MAX_SHIFTS + '.');
    return out;
  }

  function drawCover() {
    var tf = K.clear(document.querySelector('#rTable tfoot')), gaps = 0;
    SHIFTS.forEach(function (s, si) {
      var cells = [h('th', { scope: 'row', text: 'Cover: ' + s + ' (need ' + mins[si] + ')' })];
      for (var d = 0; d < 7; d++) {
        var sh = shortBy(d, si); if (sh) gaps++;
        cells.push(h('td', {}, [h('span', { class: 'k-tag' + (sh ? ' k-warn' : ' k-ok'), id: 'cv' + si + '_' + d, text: sh ? 'short by ' + sh : 'ok' })]));
      }
      tf.appendChild(h('tr', {}, cells));
    });
    var need = 7 * (mins[0] + mins[1] + mins[2]);
    $('rSum').textContent = (gaps ? gaps + ' of 21 shifts this week do not have enough people.' : 'Every shift this week has enough people.') +
      ' The week needs ' + need + ' on-site places; ' + roster.length + ' people at ' + MAX_SHIFTS + ' shifts each give at most ' + roster.length * MAX_SHIFTS + '.' +
      (need > roster.length * MAX_SHIFTS ? ' Add people or lower the numbers needed to cover every shift.' : '');
    var ul = K.clear($('rRules')), all = [];
    roster.forEach(function (p) { all = all.concat(problems(p)); });
    all.forEach(function (t) { ul.appendChild(h('li', { class: 'k-item' }, [h('span', { class: 'k-tag k-warn', text: 'Check' }), t])); });
    if (!all.length) ul.appendChild(h('li', { class: 'k-item', id: 'rRulesOk' }, [h('span', { class: 'k-tag k-ok', text: 'OK' }), 'No rest or working-time rule is broken.']));
  }

  function drawTable() {
    var tb = K.clear(document.querySelector('#rTable tbody'));
    roster.forEach(function (p, r) {
      var cells = [h('th', { scope: 'row', text: p.name })];
      p.days.forEach(function (v, d) {
        var sel = h('select', { class: 'k-in', id: 'c' + r + '_' + d, 'aria-label': p.name + ', ' + DAYS[d], onchange: function () {
          p.days[d] = sel.value; K.save(); drawCover(); K.say(p.name + ' set to ' + sel.value + ' on ' + DAYS[d] + '.');
        } }, CHOICES.map(function (c) { return h('option', { text: c, selected: c === v }); }));
        cells.push(h('td', {}, [sel]));
      });
      tb.appendChild(h('tr', {}, cells));
    });
    drawCover();
  }

  function drawMins() { MIN_IDS.forEach(function (id, i) { $(id).value = mins[i]; }); }
  MIN_IDS.forEach(function (id, i) {
    $(id).addEventListener('change', function () {
      var v = parseInt($(id).value, 10);
      if (isNaN(v) || v < 0) v = 0; if (v > 20) v = 20;
      mins[i] = v; $(id).value = v; K.save(); drawCover(); K.say(SHIFTS[i] + ' needs ' + v + ' people.');
    });
  });

  /* Fair first draft: only fills Off cells, round-robin, keeping the rest rules. */
  function canTake(p, d, s) {
    if (p.days[d] !== 'Off') return false;
    if (p.days.filter(isWork).length >= MAX_SHIFTS) return false;
    if (s === 'Morning' && d > 0 && p.days[d - 1] === 'Night') return false;
    if (s === 'Night' && d < 6 && p.days[d + 1] === 'Morning') return false;
    var run = 1, i;
    for (i = d - 1; i >= 0 && isWork(p.days[i]); i--) run++;
    for (i = d + 1; i < 7 && isWork(p.days[i]); i++) run++;
    return run <= MAX_ROW;
  }
  $('rFill').addEventListener('click', function () {
    var turn = 0, added = 0, left = 0, moved = true;
    /* One place per shift per pass, so any gap left is spread over the week and not piled on Sunday. */
    while (moved) {
      moved = false;
      for (var d = 0; d < 7; d++) {
        for (var si = SHIFTS.length - 1; si >= 0; si--) {
          if (!shortBy(d, si)) continue;
          var pick = null, best = 99;
          for (var k = 0; k < roster.length; k++) {
            var p = roster[(turn + k) % roster.length], load = p.days.filter(isWork).length;
            if (canTake(p, d, SHIFTS[si]) && load < best) { pick = p; best = load; }
          }
          if (pick) { pick.days[d] = SHIFTS[si]; turn = (roster.indexOf(pick) + 1) % roster.length; added++; moved = true; }
        }
      }
    }
    for (var dd = 0; dd < 7; dd++) for (var sj = 0; sj < 3; sj++) left += shortBy(dd, sj);
    K.save(); drawTable();
    K.say('Filled ' + added + ' shift(s).' + (left ? ' ' + left + ' place(s) could not be filled without breaking a rule.' : ' Every shift has enough people.'));
  });
  $('rClear').addEventListener('click', function () {
    if (!confirm('Set every day for everyone back to Off?')) return;
    roster.forEach(function (p) { for (var d = 0; d < 7; d++) p.days[d] = 'Off'; });
    K.save(); drawTable(); K.say('The week is clear.');
  });
  $('rDown').addEventListener('click', function () {
    var q = function (x) { return '"' + String(x || '').replace(/"/g, '""') + '"'; };
    var rows = [['Team member'].concat(DAYS)].concat(roster.map(function (p) { return [p.name].concat(p.days); }));
    SHIFTS.forEach(function (s, si) {
      var r = ['Cover ' + s + ' (need ' + mins[si] + ')'];
      for (var d = 0; d < 7; d++) r.push(shortBy(d, si) ? 'short by ' + shortBy(d, si) : 'ok');
      rows.push(r);
    });
    K.download('shift-roster.csv', rows.map(function (r) { return r.map(q).join(','); }).join('\r\n') + '\r\n');
  });

  /* Swaps: ask, the other person accepts or declines, a supervisor approves, then the roster changes. */
  function fillSelects() {
    ['sFrom', 'sTo', 'sSup'].forEach(function (id, i) {
      var sel = $(id), v = sel.value; K.clear(sel);
      names().forEach(function (n) { sel.appendChild(h('option', { text: n })); });
      if (v) sel.value = v; else sel.selectedIndex = Math.min(i, roster.length - 1);
    });
    var dd = $('sDay'), dv = dd.value; K.clear(dd);
    DAYS.forEach(function (d, i) { dd.appendChild(h('option', { value: String(i), text: d })); });
    if (dv) dd.value = dv;
  }
  var ST = { ask: 'Waiting for the other person', acc: 'Accepted, waiting for the supervisor', dec: 'Declined', ok: 'Approved', no: 'Not approved' };
  function drawSwaps() {
    var ul = K.clear($('sList'));
    swaps.forEach(function (x) {
      var btns = [];
      if (x.st === 'ask') {
        btns.push(K.btn(x.to + ': accept', function () { x.st = 'acc'; K.save(); drawSwaps(); K.say(x.to + ' accepted. ' + x.sup + ' can approve it now.'); }, 'k-small'));
        btns.push(K.btn(x.to + ': decline', function () { x.st = 'dec'; K.save(); drawSwaps(); K.say(x.to + ' declined the swap.'); }));
      } else if (x.st === 'acc') {
        btns.push(K.btn(x.sup + ': approve', function () {
          var a = person(x.from), b = person(x.to);
          if (!a || !b) { K.say('One of these people is no longer on the roster.'); return; }
          var t = a.days[x.day]; a.days[x.day] = b.days[x.day]; b.days[x.day] = t;
          x.st = 'ok'; K.save(); drawTable(); drawSwaps();
          K.say('Swap approved by ' + x.sup + '. ' + DAYS[x.day] + ': ' + a.name + ' now ' + a.days[x.day] + ', ' + b.name + ' now ' + b.days[x.day] + '.');
        }, 'k-small'));
        btns.push(K.btn(x.sup + ': do not approve', function () { x.st = 'no'; K.save(); drawSwaps(); K.say('Swap not approved. The roster stays as it was.'); }));
      } else {
        btns.push(K.btn('Remove', function () { swaps.splice(swaps.indexOf(x), 1); K.save(); drawSwaps(); }));
      }
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: x.from + ' and ' + x.to + ', ' + DAYS[x.day] }),
        h('p', { text: x.from + ' gives ' + x.give + ', ' + x.to + ' gives ' + x.take + '. Supervisor: ' + x.sup + '.' }),
        h('span', { class: 'k-tag' + (x.st === 'ok' ? ' k-ok' : (x.st === 'ask' || x.st === 'acc') ? ' k-warn' : ''), text: ST[x.st] }),
        h('div', { class: 'k-mini' }, btns)]));
    });
    if (!swaps.length) ul.appendChild(h('li', { class: 'k-note', text: 'No swap asked for yet.' }));
  }
  $('sAsk').addEventListener('click', function () {
    var f = $('sFrom').value, t = $('sTo').value, s = $('sSup').value, d = parseInt($('sDay').value, 10);
    if (f === t) { K.say('Please pick two different people to swap.'); return; }
    if (s === f || s === t) { K.say('The supervisor must be a different person from both people swapping.'); return; }
    var a = person(f), b = person(t);
    if (!a || !b || isNaN(d)) return;
    if (!isWork(a.days[d])) { K.say(f + ' has no shift on ' + DAYS[d] + ' to swap.'); return; }
    if (a.days[d] === b.days[d]) { K.say('Both already have ' + a.days[d] + ' on ' + DAYS[d] + '. Nothing to swap.'); return; }
    swaps.unshift({ id: K.id(), from: f, to: t, sup: s, day: d, give: a.days[d], take: b.days[d], st: 'ask' });
    if (K.save()) K.say('Swap asked. ' + t + ' can accept or decline below.'); drawSwaps();
  });

  drawMins(); drawTable(); fillSelects(); drawSwaps();
})();
