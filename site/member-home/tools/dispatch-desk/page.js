/* Dispatch desk: pack, check, dispatch, deliver and close marketplace shipments. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var ships = K.get('dspShipments'), seeded = K.get('dspSeeded');
  var W = (window.SITE_DATA && window.SITE_DATA.work) || null;
  var TEAM = ((W && Array.isArray(W.team) && W.team.length) ? W.team : ['Demo Asha', 'Demo Ben', 'Demo Chen', 'Demo Dara', 'Demo Eli', 'Demo Farah'])
    .map(function (x) { return String(x || '').trim().slice(0, 40); }).filter(function (x) { return x; });
  var KINDS = ['Courier', 'Own vehicle', 'Customer collects', 'Online hand-over'];
  var STEPS = ['packed', 'checked', 'dispatched', 'delivered', 'closed'];
  var SN = { packed: 'Packed', checked: 'Checked', dispatched: 'Dispatched', delivered: 'Delivered', closed: 'Closed' };

  function pad(n) { return ('0' + n).slice(-2); }
  function day(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return day(new Date()); }
  function shift(n) { var d = new Date(); d.setDate(d.getDate() + n); return day(d); }
  function stamp() { var d = new Date(); return day(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function clean(t, n) { return String(t || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n || 80); }
  /* Returns a reason when free text holds an amount, a phone number or an email. */
  function badText(t) {
    if (/\S+@\S+\.\S+/.test(t)) return 'an email address';
    if (/\+?\d[\d ().-]{7,}\d/.test(t)) return 'a phone number';
    if (/[$€£₹¥]|\b(rs|inr|usd|eur|gbp|rupees?|dollars?|euros?|pounds?)\b\.?/i.test(t)) return 'a price or money amount';
    return '';
  }
  function badPlace(t) {
    if (/\d/.test(t)) return true;
    return /\b(street|road|lane|avenue|house|flat|floor|block|plot|building|apartment|sector|marg|postcode|pin ?code|zip)\b/i.test(t);
  }
  function late(s) {
    if (s.step === 'packed' || s.step === 'checked' || s.step === 'dispatched') return today() > s.due;
    return !!(s.deliveredOn && s.deliveredOn > s.due);
  }
  function log(s, who, what) { s.log.push({ at: stamp(), who: who, what: what }); }
  function byRef(r) { for (var i = 0; i < ships.length; i++) if (ships[i].ref.toLowerCase() === r.toLowerCase()) return ships[i]; return null; }

  /* Built-in practice shipments, added once. */
  if (!seeded.length && !ships.length) {
    var P = function (i) { return TEAM[i % TEAM.length]; };
    var mk = function (ref, kind, town, country, due, packer, lines, step) {
      var s = { id: K.id(), ref: ref, kind: kind, town: town, country: country, due: due, packer: packer, lines: lines, step: 'packed', log: [] };
      log(s, packer, 'Packed ' + lines.length + ' row(s)');
      if (STEPS.indexOf(step) >= 1) { s.checker = P(1) === packer ? P(2) : P(1); log(s, s.checker, 'Checked the packing list line by line'); }
      if (STEPS.indexOf(step) >= 2) { s.tracking = 'DEMO-TRK-' + ref.slice(-4); s.dispatchedOn = shift(-3); log(s, P(3), 'Dispatched. Reference ' + s.tracking); }
      if (STEPS.indexOf(step) >= 3) { s.receivedBy = 'Demo Customer ' + ref.slice(-1); s.deliveredOn = shift(-1); log(s, P(4), 'Delivered. Received by ' + s.receivedBy); }
      if (STEPS.indexOf(step) >= 4) log(s, P(0), 'Closed');
      s.step = step; return s;
    };
    ships.push(mk('DEMO-ORD-1001', 'Courier', 'Pune', 'India', shift(3), P(0),
      [{ item: 'Demo steel bracket', qty: 4, pkg: '1' }, { item: 'Demo cable roll', qty: 2, pkg: '1' }, { item: 'Demo fitting guide (paper)', qty: 1, pkg: '2' }], 'packed'));
    ships.push(mk('DEMO-ORD-1002', 'Own vehicle', 'Nashik', 'India', shift(1), P(2),
      [{ item: 'Demo wooden shelf', qty: 1, pkg: '1' }, { item: 'Demo shelf screws, bag', qty: 1, pkg: '1' }], 'checked'));
    ships.push(mk('DEMO-ORD-1003', 'Courier', 'Lyon', 'France', shift(-2), P(3),
      [{ item: 'Demo ceramic mug', qty: 6, pkg: '1' }, { item: 'Demo gift box', qty: 6, pkg: '2' }], 'dispatched'));
    ships.push(mk('DEMO-ORD-1004', 'Online hand-over', 'Nairobi', 'Kenya', shift(2), P(4),
      [{ item: 'Demo design pack (digital file)', qty: 1, pkg: 'Online' }], 'delivered'));
    ships.push(mk('DEMO-ORD-1005', 'Customer collects', 'Mumbai', 'India', shift(-5), P(1),
      [{ item: 'Demo desk lamp', qty: 2, pkg: '1' }], 'closed'));
    seeded.push(1); K.save();
  }

  function fillPeople(sel) { K.clear(sel); TEAM.forEach(function (n) { sel.appendChild(h('option', { text: n })); }); }

  /* Tabs */
  var TABS = ['New', 'Board', 'Papers'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      if (n === 'Board') drawBoard(); if (n === 'Papers') drawPapers();
    });
  });

  /* New shipment */
  KINDS.forEach(function (k) { $('nKind').appendChild(h('option', { text: k })); });
  fillPeople($('nPacker')); $('nDue').value = shift(2);
  var rowN = 0;
  function addRow() {
    rowN++;
    var li = h('li', { class: 'k-item' }, [
      h('div', { class: 'k-row' }, [
        h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: 'nItem' + rowN, text: 'Item' }), h('input', { class: 'k-in n-item', id: 'nItem' + rowN, maxlength: '60' })]),
        h('div', {}, [h('label', { class: 'k-lab', for: 'nQty' + rowN, text: 'Quantity' }), h('input', { class: 'k-in n-qty', id: 'nQty' + rowN, type: 'number', min: '1', max: '9999', value: '1' })]),
        h('div', {}, [h('label', { class: 'k-lab', for: 'nPkg' + rowN, text: 'Package number' }), h('input', { class: 'k-in n-pkg', id: 'nPkg' + rowN, maxlength: '10', value: $('nKind').value === 'Online hand-over' ? 'Online' : '1' })])
      ])
    ]);
    li.appendChild(h('div', { class: 'k-mini' }, [K.btn('Remove this row', function () {
      if ($('nLines').children.length < 2) { K.say('A packing list needs at least one row.'); return; }
      li.remove(); })]));
    $('nLines').appendChild(li);
  }
  addRow();
  $('nAdd').addEventListener('click', function () { addRow(); var all = document.querySelectorAll('.n-item'); all[all.length - 1].focus(); });
  $('nSave').addEventListener('click', function () {
    var ref = clean($('nRef').value, 30), town = clean($('nTown').value, 40), country = clean($('nCountry').value, 40), due = $('nDue').value, packer = $('nPacker').value, why;
    if (!ref) { K.say('Please write the order reference.'); $('nRef').focus(); return; }
    if ((why = badText(ref))) { K.say('Not saved: the order reference looks like it holds ' + why + '. Use letters, numbers and dashes only.'); $('nRef').focus(); return; }
    if (byRef(ref)) { K.say('Not saved: order reference ' + ref + ' is already on the board.'); $('nRef').focus(); return; }
    if (!town || !country) { K.say('Please write the destination town and the country.'); (town ? $('nCountry') : $('nTown')).focus(); return; }
    if ((why = badText(town + ' ' + country))) { K.say('Not saved: the destination looks like it holds ' + why + '. Write the town and the country only.'); $('nTown').focus(); return; }
    if (badPlace(town) || badPlace(country)) { K.say('Not saved: write the town name only. No street address, house number or postcode.'); $('nTown').focus(); return; }
    if (!due) { K.say('Please pick the promised delivery date.'); $('nDue').focus(); return; }
    var lines = [], items = document.querySelectorAll('.n-item'), qtys = document.querySelectorAll('.n-qty'), pkgs = document.querySelectorAll('.n-pkg');
    for (var i = 0; i < items.length; i++) {
      var it = clean(items[i].value, 60), q = Number(qtys[i].value), p = clean(pkgs[i].value, 10);
      if (!it && i > 0) continue;
      if (!it) { K.say('Please write the item on row ' + (i + 1) + '.'); items[i].focus(); return; }
      if ((why = badText(it))) { K.say('Not saved: row ' + (i + 1) + ' looks like it holds ' + why + '. Write only what the item is.'); items[i].focus(); return; }
      if (!(q >= 1 && q <= 9999 && Math.floor(q) === q)) { K.say('Row ' + (i + 1) + ': quantity must be a whole number from 1 to 9999.'); qtys[i].focus(); return; }
      if (!p) { K.say('Row ' + (i + 1) + ': please write the package number.'); pkgs[i].focus(); return; }
      lines.push({ item: it, qty: q, pkg: p });
    }
    var s = { id: K.id(), ref: ref, kind: $('nKind').value, town: town, country: country, due: due, packer: packer, lines: lines, step: 'packed', log: [] };
    log(s, packer, 'Packed ' + lines.length + ' row(s)');
    ships.push(s);
    if (K.save()) K.say('Saved ' + ref + ' as packed by ' + packer + '. Next: a different person checks it on the Board.');
    $('nRef').value = ''; $('nTown').value = ''; $('nCountry').value = '';
    K.clear($('nLines')); addRow();
  });

  /* Board */
  fillPeople($('bWho')); if (TEAM.length > 1) $('bWho').value = TEAM[1];
  $('bWho').addEventListener('change', drawBoard);
  var openCheck = '';
  function textFrom(id, what) {
    var v = clean($(id).value, 40), why;
    if (!v) { K.say('Please write the ' + what + '.'); $(id).focus(); return null; }
    if ((why = badText(v))) { K.say('Not saved: the ' + what + ' looks like it holds ' + why + '. Please remove it.'); $(id).focus(); return null; }
    return v;
  }
  function card(s) {
    var tags = [h('span', { class: 'k-tag' + (s.step === 'closed' || s.step === 'delivered' ? ' k-ok' : ''), text: SN[s.step] }), h('span', { class: 'k-tag', text: s.kind })];
    if (late(s)) tags.push(h('span', { class: 'k-tag k-warn', text: s.deliveredOn ? 'Delivered late' : 'Late' }));
    var info = 'To: ' + s.town + ', ' + s.country + '\nPromised by: ' + s.due + '\nPacked by: ' + s.packer + (s.checker ? '\nChecked by: ' + s.checker : '') +
      (s.tracking ? '\nTracking reference: ' + s.tracking : '') + (s.receivedBy ? '\nReceived by: ' + s.receivedBy : '') +
      '\nRows: ' + s.lines.length + ', items: ' + s.lines.reduce(function (a, l) { return a + l.qty; }, 0);
    var kids = [h('h3', { text: s.ref }), h('p', {}, tags), h('p', { text: info })], who = $('bWho').value, box = [];
    if (s.step === 'packed') {
      if (openCheck === s.id) {
        s.lines.forEach(function (l, i) {
          box.push(h('label', { class: 'k-check' }, [h('input', { type: 'checkbox', class: 'ck-' + s.id }), h('span', { text: (i + 1) + '. ' + l.item + ', quantity ' + l.qty + ', package ' + l.pkg })]));
        });
        box.push(h('div', { class: 'k-mini' }, [K.btn('Confirm checked', function () {
          if (who === s.packer) { K.say('Not checked: ' + who + ' packed ' + s.ref + '. A different person must check it.'); return; }
          var cks = document.querySelectorAll('.ck-' + s.id), n = 0;
          for (var i = 0; i < cks.length; i++) if (cks[i].checked) n++;
          if (n < cks.length) { K.say('Not checked: tick every line of the packing list first. ' + n + ' of ' + cks.length + ' ticked.'); return; }
          s.step = 'checked'; s.checker = who; log(s, who, 'Checked the packing list line by line'); openCheck = '';
          if (K.save()) K.say(s.ref + ' checked by ' + who + '. Next: dispatch it.'); drawBoard();
        }, 'k-small'), K.btn('Close the list', function () { openCheck = ''; drawBoard(); })]));
      } else box.push(h('div', { class: 'k-mini' }, [K.btn('Check packing list', function () {
        if (who === s.packer) { K.say('Not allowed: ' + who + ' packed ' + s.ref + '. Pick a different person in "Who is doing this step".'); return; }
        openCheck = s.id; drawBoard(); K.say('Tick each line once you have seen it in the package.'); }, 'k-small')]));
    } else if (s.step === 'checked') {
      var lab = s.kind === 'Online hand-over' ? 'Hand-over reference' : s.kind === 'Courier' ? 'Courier tracking reference' : 'Dispatch reference';
      box.push(h('label', { class: 'k-lab', for: 'tr-' + s.id, text: lab }), h('input', { class: 'k-in', id: 'tr-' + s.id, maxlength: '40' }));
      box.push(h('div', { class: 'k-mini' }, [K.btn('Mark dispatched', function () {
        var v = textFrom('tr-' + s.id, 'tracking reference'); if (v === null) return;
        s.step = 'dispatched'; s.tracking = v; s.dispatchedOn = today(); log(s, who, 'Dispatched. Reference ' + v);
        if (K.save()) K.say(s.ref + ' dispatched by ' + who + '.'); drawBoard();
      }, 'k-small')]));
    } else if (s.step === 'dispatched') {
      box.push(h('label', { class: 'k-lab', for: 'rb-' + s.id, text: 'Proof: received by (name)' }), h('input', { class: 'k-in', id: 'rb-' + s.id, maxlength: '40' }));
      box.push(h('div', { class: 'k-mini' }, [K.btn('Mark delivered', function () {
        var v = textFrom('rb-' + s.id, 'name of the person who received it'); if (v === null) return;
        s.step = 'delivered'; s.receivedBy = v; s.deliveredOn = today(); log(s, who, 'Delivered. Received by ' + v);
        if (K.save()) K.say(s.ref + ' delivered. Received by ' + v + '.'); drawBoard();
      }, 'k-small')]));
    } else if (s.step === 'delivered') {
      box.push(h('div', { class: 'k-mini' }, [K.btn('Close shipment', function () {
        s.step = 'closed'; log(s, who, 'Closed');
        if (K.save()) K.say(s.ref + ' closed by ' + who + '.'); drawBoard();
      }, 'k-small')]));
    }
    var hist = s.log.map(function (e) { return e.at + '  ' + e.who + ': ' + e.what; }).join('\n');
    kids = kids.concat(box, [h('details', {}, [h('summary', { text: 'Log (' + s.log.length + ')' }), h('p', { text: hist })])]);
    return h('li', { class: 'k-item', 'data-ref': s.ref }, kids);
  }
  function drawBoard() {
    var wrap = K.clear($('bSteps')), nLate = 0;
    STEPS.forEach(function (st) {
      var list = ships.filter(function (s) { return s.step === st; });
      var ul = h('ul', { class: 'k-list', id: 'step-' + st });
      list.forEach(function (s) { if (late(s) && !s.deliveredOn) nLate++; ul.appendChild(card(s)); });
      if (!list.length) ul.appendChild(h('li', { class: 'k-note', text: 'None.' }));
      wrap.appendChild(h('h3', { class: 'k-lab', text: SN[st] + ' (' + list.length + ')' }));
      wrap.appendChild(ul);
    });
    $('bSum').textContent = ships.length + ' shipment(s). ' + nLate + ' late and not yet delivered.';
  }

  /* Papers */
  function rows(s) { return s.lines.map(function (l, i) { return '  ' + (i + 1) + '. ' + l.item + '  |  Quantity: ' + l.qty + '  |  Package: ' + l.pkg; }).join('\n'); }
  function packs(s) { var m = {}; s.lines.forEach(function (l) { m[l.pkg] = 1; }); return Object.keys(m).length; }
  function head(s, t) {
    return t + '\n' + new Array(t.length + 1).join('=') + '\nOrder reference: ' + s.ref + '\nDelivery kind: ' + s.kind + '\nDestination: ' + s.town + ', ' + s.country +
      '\nPromised by: ' + s.due + '\nStep now: ' + SN[s.step] + (late(s) ? ' (late)' : '') + '\n';
  }
  function packText(s) {
    return head(s, 'PACKING LIST') + 'Packed by: ' + s.packer + '\nChecked by: ' + (s.checker || 'not checked yet') + '\n\nLines:\n' + rows(s) +
      '\n\nPackages: ' + packs(s) + '\nItems in total: ' + s.lines.reduce(function (a, l) { return a + l.qty; }, 0) + '\n\nPractice data only.\n';
  }
  function noteText(s) {
    return head(s, 'DELIVERY NOTE') + 'Dispatched on: ' + (s.dispatchedOn || 'not dispatched yet') + '\nTracking reference: ' + (s.tracking || '-') +
      '\nDelivered on: ' + (s.deliveredOn || 'not delivered yet') + '\nReceived by: ' + (s.receivedBy || '-') + '\n\nGoods:\n' + rows(s) +
      '\n\nLog:\n' + s.log.map(function (e) { return '  ' + e.at + '  ' + e.who + ': ' + e.what; }).join('\n') + '\n\nPractice data only.\n';
  }
  function cur() { for (var i = 0; i < ships.length; i++) if (ships[i].id === $('pShip').value) return ships[i]; return null; }
  function drawPapers() {
    var sel = $('pShip'), was = sel.value; K.clear(sel);
    ships.forEach(function (s) { sel.appendChild(h('option', { value: s.id, text: s.ref + ' (' + SN[s.step] + ')' })); });
    if (was && ships.some(function (s) { return s.id === was; })) sel.value = was;
    var s = cur(); $('pView').textContent = s ? packText(s) : 'No shipment yet.';
  }
  $('pShip').addEventListener('change', function () { var s = cur(); $('pView').textContent = s ? packText(s) : ''; });
  function safe(r) { return r.replace(/[^A-Za-z0-9-]/g, '_'); }
  $('pPack').addEventListener('click', function () { var s = cur(); if (!s) { K.say('Pick a shipment first.'); return; } $('pView').textContent = packText(s); K.download('packing-list-' + safe(s.ref) + '.txt', packText(s)); });
  $('pNote').addEventListener('click', function () { var s = cur(); if (!s) { K.say('Pick a shipment first.'); return; } $('pView').textContent = noteText(s); K.download('delivery-note-' + safe(s.ref) + '.txt', noteText(s)); });

  drawBoard(); drawPapers();
})();
