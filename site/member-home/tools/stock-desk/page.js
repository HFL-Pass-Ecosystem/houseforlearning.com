/* Stock desk: quantities in a small store. Goods in, goods out, transfers, counts with approval, reorder list. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var items = K.get('stk.items'), moves = K.get('stk.moves'), counts = K.get('stk.counts');
  var W = window.SITE_DATA && window.SITE_DATA.work;
  var TEAM = (W && Array.isArray(W.team) && W.team.length ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dara', 'Demo Eli', 'Demo Faye'])
    .map(function (n) { return String(n).slice(0, 40); }).filter(Boolean);
  var PLACES = ['Shelf A1', 'Shelf A2', 'Shelf B1', 'Shelf B2', 'Back room', 'Packing table'];
  var KIND = { in: 'Goods in', out: 'Goods out', move: 'Transfer', adjust: 'Count adjustment' };
  var SAMPLE = [
    ['ST-001', 'Demo cotton tote bag', 'pcs', 40, 15, 'Shelf A1'], ['ST-002', 'Demo ceramic mug', 'pcs', 12, 12, 'Shelf A2'],
    ['ST-003', 'Demo notebook, lined', 'pcs', 55, 20, 'Shelf A1'], ['ST-004', 'Demo shipping box, small', 'box', 6, 25, 'Back room'],
    ['ST-005', 'Demo shipping box, large', 'box', 30, 10, 'Back room'], ['ST-006', 'Demo packing tape', 'roll', 4, 8, 'Packing table'],
    ['ST-007', 'Demo bubble wrap', 'roll', 9, 5, 'Packing table'], ['ST-008', 'Demo scented candle', 'pcs', 18, 10, 'Shelf B1'],
    ['ST-009', 'Demo phone stand, wood', 'pcs', 3, 6, 'Shelf B2'], ['ST-010', 'Demo greeting card pack', 'pack', 25, 10, 'Shelf B1'],
    ['ST-011', 'Demo loose tea', 'kg', 7, 5, 'Shelf B2'], ['ST-012', 'Demo thank-you sticker', 'roll', 2, 4, 'Packing table']];
  if (!items.length) {
    SAMPLE.forEach(function (r) { var p = {}; p[r[5]] = r[3]; items.push({ code: r[0], name: r[1], unit: r[2], reorder: r[4], home: r[5], at: p }); });
    K.save();
  }

  function pad(n) { return ('0' + n).slice(-2); }
  function stamp() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function total(it) { var s = 0, k; for (k in it.at) s += it.at[k]; return s; }
  function byCode(c) { for (var i = 0; i < items.length; i++) if (items[i].code === c) return items[i]; return null; }
  function placesOf(it) { return Object.keys(it.at).filter(function (p) { return it.at[p] > 0 || p === it.home; }); }
  function placeText(it) { return placesOf(it).map(function (p) { return p + ': ' + (it.at[p] || 0); }).join(', '); }
  function low(it) { return total(it) <= it.reorder; }
  function below(it) { return total(it) < it.reorder; }
  function suggest(it) { return it.reorder * 2 - total(it); }
  function label(it) { return it.code + ' ' + it.name; }
  /* Free text must not hold money amounts, phone numbers or email addresses. */
  function badText(t) {
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(t)) return 'an email address';
    if (/[$€£₹¥]|\b(usd|eur|gbp|inr|rs|rupees?|dollars?|euros?|pounds?|price|cost|paid|pay)\b/i.test(t)) return 'a money amount or price';
    var runs = t.match(/[+(]?\d[\d\s().-]*\d/g) || [];
    for (var i = 0; i < runs.length; i++) if (runs[i].replace(/\D/g, '').length >= 10) return 'a phone number';
    return '';
  }
  function fillPeople(sel) { TEAM.forEach(function (n) { sel.appendChild(h('option', { text: n })); }); }
  function q(x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; }
  function cell(t) { return h('td', { text: String(t) }); }

  var TABS = ['Stock', 'Move', 'Count', 'Re'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      drawAll();
    });
  });

  /* Stock */
  function drawStock() {
    var tb = K.clear(document.querySelector('#sTable tbody')), n = 0;
    items.forEach(function (it) {
      var l = low(it); if (l) n++;
      tb.appendChild(h('tr', { 'data-code': it.code }, [cell(it.code), cell(it.name), cell(it.unit), h('td', {}, [h('strong', { text: String(total(it)) })]),
        cell(it.reorder), cell(placeText(it)), h('td', {}, [h('span', { class: 'k-tag ' + (l ? 'k-warn' : 'k-ok'), text: l ? 'Reorder' : 'OK' })])]));
    });
    $('sSum').textContent = items.length + ' items. ' + n + ' at or below reorder level.';
  }
  $('sDown').addEventListener('click', function () {
    K.download('stock.csv', 'Code,Name,Unit,On hand,Reorder level,Places,State\r\n' + items.map(function (it) {
      return [it.code, it.name, it.unit, total(it), it.reorder, placeText(it), low(it) ? 'Reorder' : 'OK'].map(q).join(','); }).join('\r\n') + '\r\n');
  });
  $('sMovesDown').addEventListener('click', function () {
    if (!moves.length) { K.say('There is no move to download yet.'); return; }
    K.download('stock-moves.csv', 'When,Who,Kind,Code,Item,Quantity,From,To,Reference\r\n' + moves.map(function (m) {
      return [m.t, m.who, KIND[m.type], m.code, m.name, m.qty, m.from, m.to, m.ref].map(q).join(','); }).join('\r\n') + '\r\n');
  });

  /* Move stock */
  items.forEach(function (it) { $('mItem').appendChild(h('option', { value: it.code, text: label(it) })); });
  PLACES.forEach(function (p) { $('mTo').appendChild(h('option', { text: p })); });
  fillPeople($('mWho'));
  function moveForm() {
    var t = $('mType').value, it = byCode($('mItem').value), from = $('mFrom'), keep = from.value;
    K.clear(from);
    placesOf(it).forEach(function (p) { from.appendChild(h('option', { value: p, text: p + ' (' + (it.at[p] || 0) + ' on hand)' })); });
    if (keep && it.at[keep] != null) from.value = keep;
    from.parentNode.hidden = t === 'in';
    $('mTo').parentNode.hidden = t === 'out';
    if (t === 'in' && !$('mTo').dataset.touched) $('mTo').value = it.home;
    $('mRefLab').textContent = t === 'in' ? 'Supplier reference' : t === 'out' ? 'Order or job reference' : 'Reason (optional)';
    $('mInfo').textContent = label(it) + ': ' + total(it) + ' ' + it.unit + ' on hand in all. ' + placeText(it) + '.';
  }
  $('mType').addEventListener('change', moveForm); $('mItem').addEventListener('change', moveForm);
  $('mTo').addEventListener('change', function () { $('mTo').dataset.touched = '1'; });
  $('mGo').addEventListener('click', function () {
    var t = $('mType').value, it = byCode($('mItem').value), n = Number($('mQty').value), who = $('mWho').value;
    var ref = $('mRef').value.trim().replace(/[<>]/g, '').slice(0, 60), from = $('mFrom').value, to = $('mTo').value, bad = badText(ref);
    if (!it) { K.say('Please pick an item.'); return; }
    if (!(n > 0) || Math.floor(n) !== n) { K.say('Please type a whole quantity of 1 or more.'); $('mQty').focus(); return; }
    if (bad) { K.say('Not saved: the reference looks like it has ' + bad + '. Write only a short reference, like PO-12 or Order 345.'); $('mRef').focus(); return; }
    if (t === 'in' && !ref) { K.say('Please write the supplier reference for goods in.'); $('mRef').focus(); return; }
    if (t === 'out' && !ref) { K.say('Please write the order or job reference for goods out.'); $('mRef').focus(); return; }
    if (t !== 'in') {
      var have = it.at[from] || 0;
      if (n > have) { K.say('Not saved: only ' + have + ' ' + it.unit + ' of ' + it.name + ' on hand in ' + from + '. You cannot take out ' + n + '.'); $('mQty').focus(); return; }
    }
    if (t === 'move' && from === to) { K.say('Please pick a different place to move to.'); $('mTo').focus(); return; }
    if (t !== 'in') it.at[from] = (it.at[from] || 0) - n;
    if (t !== 'out') it.at[to] = (it.at[to] || 0) + n;
    moves.push({ id: K.id(), t: stamp(), who: who, type: t, code: it.code, name: it.name, qty: n, from: t === 'in' ? '' : from, to: t === 'out' ? '' : to, ref: ref });
    $('mQty').value = ''; $('mRef').value = '';
    if (K.save()) K.say('Saved: ' + KIND[t] + ', ' + n + ' ' + it.unit + ' of ' + it.name + '. Now ' + total(it) + ' on hand.');
    drawAll();
  });
  function drawLog() {
    var tb = K.clear(document.querySelector('#mLog tbody'));
    moves.slice().reverse().forEach(function (m) {
      tb.appendChild(h('tr', {}, [cell(m.t), cell(m.who), cell(KIND[m.type]), cell(m.code + ' ' + m.name), cell(m.qty), cell(m.from || '-'), cell(m.to || '-'), cell(m.ref || '-')]));
    });
    if (!moves.length) tb.appendChild(h('tr', {}, [h('td', { colspan: '8', text: 'No moves yet.' })]));
  }

  /* Count */
  fillPeople($('cWho')); fillPeople($('cBy')); $('cBy').selectedIndex = Math.min(1, TEAM.length - 1);
  var draft = {};
  function lines() {
    var out = [];
    items.forEach(function (it) { placesOf(it).forEach(function (p) { out.push({ code: it.code, name: it.name, place: p, sys: it.at[p] || 0 }); }); });
    return out;
  }
  function drawCount() {
    var tb = K.clear(document.querySelector('#cTable tbody'));
    lines().forEach(function (l) {
      var key = l.code + '|' + l.place, inp = h('input', { class: 'k-in', type: 'number', min: '0', step: '1', inputmode: 'numeric', 'aria-label': 'Counted ' + l.name + ' in ' + l.place, 'data-key': key });
      if (draft[key] != null) inp.value = draft[key];
      inp.addEventListener('input', function () { draft[key] = inp.value; });
      tb.appendChild(h('tr', {}, [cell(l.code + ' ' + l.name), cell(l.place), cell(l.sys), h('td', {}, [inp]), h('td', { class: 'cDiff', 'data-key': key, text: '' })]));
    });
  }
  function readDiffs() {
    var res = { diffs: [], counted: 0, err: '' };
    lines().forEach(function (l) {
      var v = draft[l.code + '|' + l.place];
      if (v == null || String(v).trim() === '') return;
      var n = Number(v);
      if (!(n >= 0) || Math.floor(n) !== n) { res.err = 'Counted quantities must be whole numbers of 0 or more (' + l.name + ', ' + l.place + ').'; return; }
      res.counted++;
      if (n !== l.sys) res.diffs.push({ code: l.code, name: l.name, place: l.place, sys: l.sys, counted: n });
    });
    return res;
  }
  function showDiffs() {
    var r = readDiffs();
    if (r.err) { K.say(r.err); return null; }
    Array.prototype.forEach.call(document.querySelectorAll('#cTable td.cDiff'), function (td) {
      var key = td.getAttribute('data-key'), v = draft[key], sys = Number(key && lines().filter(function (l) { return l.code + '|' + l.place === key; })[0].sys);
      td.textContent = (v == null || String(v).trim() === '') ? '' : (Number(v) - sys > 0 ? '+' : '') + (Number(v) - sys);
    });
    $('cInfo').textContent = r.counted + ' line(s) counted. ' + r.diffs.length + ' difference(s).';
    return r;
  }
  $('cDiff').addEventListener('click', function () { var r = showDiffs(); if (r) K.say(r.diffs.length ? r.diffs.length + ' difference(s) found. Send them for approval.' : 'No differences in what you counted.'); });
  $('cSend').addEventListener('click', function () {
    var r = showDiffs(); if (!r) return;
    var note = $('cNote').value.trim().replace(/[<>]/g, '').slice(0, 80), bad = badText(note);
    if (!r.counted) { K.say('Please type at least one counted quantity first.'); return; }
    if (bad) { K.say('Not sent: the note looks like it has ' + bad + '. Please remove it.'); $('cNote').focus(); return; }
    if (!r.diffs.length) { K.say('No differences, so nothing needs approval. The count matches the records.'); return; }
    counts.push({ id: K.id(), t: stamp(), who: $('cWho').value, note: note, lines: r.diffs, st: 'wait' });
    draft = {}; $('cNote').value = '';
    if (K.save()) K.say('Sent for approval: ' + r.diffs.length + ' difference(s). A different person must approve.');
    drawAll();
  });
  function decide(c, ok) {
    var by = $('cBy').value;
    if (by === c.who) { K.say('Not done: ' + by + ' did this count. A different person must approve or reject it.'); $('cBy').focus(); return; }
    if (ok) {
      for (var i = 0; i < c.lines.length; i++) {
        var l = c.lines[i], it = byCode(l.code), now = it ? (it.at[l.place] || 0) : 0;
        if (!it || now + (l.counted - l.sys) < 0) { K.say('Not approved: ' + l.name + ' in ' + l.place + ' would go below zero, because stock moved since the count. Please count again.'); return; }
      }
      c.lines.forEach(function (l) {
        var it = byCode(l.code), d = l.counted - l.sys;
        it.at[l.place] = (it.at[l.place] || 0) + d;
        moves.push({ id: K.id(), t: stamp(), who: by, type: 'adjust', code: it.code, name: it.name, qty: d, from: d < 0 ? l.place : '', to: d > 0 ? l.place : '', ref: 'Count by ' + c.who + ', approved by ' + by });
      });
    }
    c.st = ok ? 'ok' : 'no'; c.by = by; c.at = stamp();
    if (K.save()) K.say(ok ? 'Approved by ' + by + '. Quantities are updated and logged.' : 'Rejected by ' + by + '. Quantities did not change.');
    drawAll();
  }
  function drawCounts() {
    var ul = K.clear($('cList')), any = false;
    counts.slice().reverse().forEach(function (c) {
      if (c.st === 'wait') any = true;
      var st = c.st === 'wait' ? 'Waiting for approval' : c.st === 'ok' ? 'Approved by ' + c.by + ', ' + c.at : 'Rejected by ' + c.by + ', ' + c.at;
      var body = c.lines.map(function (l) { var d = l.counted - l.sys; return l.code + ' ' + l.name + ', ' + l.place + ': record ' + l.sys + ', counted ' + l.counted + ' (' + (d > 0 ? '+' : '') + d + ')'; }).join('\n');
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: 'Count by ' + c.who + ', ' + c.t }),
        h('p', { text: body + (c.note ? '\nNote: ' + c.note : '') }),
        h('p', {}, [h('span', { class: 'k-tag' + (c.st === 'ok' ? ' k-ok' : c.st === 'wait' ? ' k-warn' : ''), text: st })]),
        c.st === 'wait' ? h('div', { class: 'k-mini' }, [K.btn('Approve', function () { decide(c, true); }, 'k-small'), K.btn('Reject', function () { decide(c, false); })]) : null]));
    });
    if (!counts.length) ul.appendChild(h('li', { class: 'k-note', text: 'No counts sent yet.' }));
    else if (!any) ul.appendChild(h('li', { class: 'k-note', text: 'Nothing is waiting for approval.' }));
  }

  /* Reorder list */
  function drawRe() {
    var tb = K.clear(document.querySelector('#rTable tbody')), list = items.filter(below);
    list.forEach(function (it) { tb.appendChild(h('tr', {}, [cell(it.code), cell(it.name), cell(total(it)), cell(it.reorder), h('td', {}, [h('strong', { text: String(suggest(it)) })]), cell(it.unit)])); });
    if (!list.length) tb.appendChild(h('tr', {}, [h('td', { colspan: '6', text: 'No item is below its reorder level.' })]));
    $('rSum').textContent = list.length + ' item(s) to reorder.';
  }
  $('rDown').addEventListener('click', function () {
    var list = items.filter(below);
    if (!list.length) { K.say('No item is below its reorder level, so there is nothing to request.'); return; }
    var txt = 'STOCK REQUEST - PRICE ON REQUEST\r\nDate: ' + stamp().slice(0, 10) + '\r\nFrom: Demo store (practice data)\r\n\r\nPlease send availability and price on request for these items:\r\n\r\n' +
      list.map(function (it, i) { return (i + 1) + '. ' + it.code + '  ' + it.name + '  -  ' + suggest(it) + ' ' + it.unit; }).join('\r\n') +
      '\r\n\r\nQuantities only. Price on request.\r\n';
    K.download('reorder-request.txt', txt);
  });

  function drawAll() { drawStock(); moveForm(); drawLog(); drawCount(); drawCounts(); drawRe(); }
  drawAll();
})();
