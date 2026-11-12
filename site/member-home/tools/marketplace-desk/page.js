/* Marketplace desk: browse physical, hybrid and digital listings, make your own, and prepare one enquiry. No amounts. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var mine = K.get('listings'), basket = K.get('basket'), msg = K.get('basketMsg');
  var KINDS = ['Physical', 'Hybrid', 'Digital'], TYPES = ['Offer', 'Need'], HOWS = ['Collected', 'Delivered', 'On site', 'Online', 'On site and online'];
  function S(id, type, kind, how, title, text) { return { id: 's' + id, type: type, kind: kind, how: how, title: title, text: text, sample: true }; }
  var SAMPLES = [
    S(1, 'Offer', 'Physical', 'Delivered', 'Bench power supply, used and tested', 'Variable output, with leads and a test note. Packed for transport.'),
    S(2, 'Offer', 'Physical', 'On site', 'Workshop bay by the day', 'A clear bay with bench, power points and good light. Safety briefing on arrival.'),
    S(3, 'Need', 'Physical', 'Delivered', 'Set of calibration weights', 'Looking for a full set with a current certificate. New or used.'),
    S(4, 'Offer', 'Physical', 'Collected', 'Storage racks, steel, adjustable', 'Six bays, taken down and bundled. Buyer collects.'),
    S(5, 'Offer', 'Hybrid', 'On site and online', 'Commissioning support: two days on site, then remote follow-up', 'Start-up checks on site, a written punch list, and four weeks of online follow-up.'),
    S(6, 'Offer', 'Hybrid', 'On site and online', 'Training day with online practice', 'One day hands-on for a small group, then three weeks of guided practice online.'),
    S(7, 'Need', 'Hybrid', 'On site and online', 'Site survey with a remote report review', 'One visit to measure and photograph, then a shared review of the report by video call.'),
    S(8, 'Offer', 'Hybrid', 'On site and online', 'Maintenance plan: quarterly visit and monthly remote check', 'Planned visits, a remote health check each month, and a simple log you can read.'),
    S(9, 'Offer', 'Digital', 'Online', 'Wiring diagram template pack', 'Editable templates with a symbol sheet and a short how-to.'),
    S(10, 'Offer', 'Digital', 'Online', 'Remote design review, one hour', 'Send your drawings ahead. You get a marked-up copy and a list of points.'),
    S(11, 'Need', 'Digital', 'Online', 'Translation of a user manual', 'About forty pages, technical wording. Two languages needed.'),
    S(12, 'Offer', 'Digital', 'Online', 'Seat on an online short course', 'Four weekly sessions with practice tasks and a certificate of completion.')
  ];
  var D = (window.SITE_DATA && window.SITE_DATA.market) || null, PROV = [];
  function sharedNote(x) { if (!x || !x.href) return; var p = document.createElement('p'); p.className = 'k-card'; p.id = 'shared'; p.appendChild(document.createTextNode((x.text || '') + ' ')); var a = document.createElement('a'); a.href = x.href; a.textContent = x.label || x.href; p.appendChild(a); var h = document.querySelector('main h1'); if (h) h.parentNode.insertBefore(p, h.nextSibling); }
  sharedNote(D && D.shared);
  if (D && Array.isArray(D.listings) && D.listings.length) {
    SAMPLES = D.listings.map(function (r, i) { var s = S(i + 1, r[0], r[1], r[2], r[3], r[4]); s.prov = r[5] || ''; return s; });
    PROV = D.providers || [];
  }
  var orders = K.get('orders'), me = K.get('provider');
  if (!me.length) me.push({ step: 0 });
  var ME = me[0];
  function myProv() { return ME.step >= 4 ? { id: 'me', name: ME.name, area: ME.area, level: 'Trained', reply: 'Your own profile (' + ME.pid + ')' } : null; }
  if (myProv()) PROV.unshift(myProv());
  function provName(id) { var p = PROV.filter(function (x) { return x.id === id; })[0]; return p ? p.name : ''; }
  function all() { return mine.concat(SAMPLES); }
  function byId(id) { return all().filter(function (l) { return l.id === id; })[0]; }
  function clean(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n); }
  function pick(v, list) { return list.indexOf(v) >= 0 ? v : list[0]; }
  function card(l, where) {
    var inB = basket.indexOf(l.id) >= 0;
    return h('li', { class: 'k-item' }, [h('h3', { text: l.title }), h('p', {}, [
      h('span', { class: 'k-tag' + (l.type === 'Need' ? ' k-warn' : ' k-ok'), text: l.type }), h('span', { class: 'k-tag', text: l.kind }), h('span', { class: 'k-tag', text: l.how }),
      l.sample ? h('span', { class: 'k-tag', text: 'Sample' }) : h('span', { class: 'k-tag', text: l.from === 'file' ? 'From a share file' : 'Mine' })]),
      h('p', { text: l.text }), h('p', { class: 'k-note', text: (l.prov ? 'From ' + provName(l.prov) + '. ' : '') + 'Price on request' }),
      h('div', { class: 'k-mini' }, [
        where !== 'basket' ? K.btn(inB ? 'In the basket' : 'Add to enquiry basket', function () { if (!inB) { basket.push(l.id); K.save(); K.say('Added to the enquiry basket.'); drawAll(); } }, 'k-small' + (inB ? ' k-quiet' : '')) : null,
        where === 'basket' ? K.btn('Take out', function () { basket.splice(basket.indexOf(l.id), 1); K.save(); drawAll(); }) : null,
        where === 'mine' ? K.btn('Remove', function () { if (confirm('Remove this listing?')) { mine.splice(mine.indexOf(l), 1); var b = basket.indexOf(l.id); if (b >= 0) basket.splice(b, 1); K.save(); drawAll(); K.say('Listing removed.'); } }) : null])]);
  }
  function drawBrowse() {
    var ul = K.clear($('lList')), k = $('fKind').value, t = $('fType').value, pv = $('fProv').value, f = $('fFind').value.trim().toLowerCase(), n = 0;
    all().forEach(function (l) {
      if ((k && l.kind !== k) || (t && l.type !== t) || (pv && l.prov !== pv) || (f && (l.title + ' ' + l.text).toLowerCase().indexOf(f) < 0)) return;
      n++; ul.appendChild(card(l, 'browse'));
    });
    $('fShown').textContent = n + ' of ' + all().length + ' listings shown.';
    if (!n) ul.appendChild(h('li', { class: 'k-note', text: 'Nothing matches. Try fewer words or "All kinds".' }));
  }
  function drawMine() {
    var ul = K.clear($('mList'));
    mine.forEach(function (l) { ul.appendChild(card(l, 'mine')); });
    if (!mine.length) ul.appendChild(h('li', { class: 'k-note', text: 'You have no listing yet.' }));
  }
  function enquiry() {
    var items = basket.map(byId).filter(Boolean);
    return 'ENQUIRY\n' + (items.length ? items.map(function (l, i) { return (i + 1) + '. ' + l.title + ' [' + l.type + ', ' + l.kind + ', ' + l.how + ']'; }).join('\n') : '(the basket is empty)') +
      '\n\nMessage:\n' + ($('bMsg').value.trim() || '(no message yet)') + '\n\nPlease send me the price and the next step for each line.\n';
  }
  function drawBasket() {
    var ul = K.clear($('bList')), items = basket.map(byId).filter(Boolean);
    items.forEach(function (l) { ul.appendChild(card(l, 'basket')); });
    if (!items.length) ul.appendChild(h('li', { class: 'k-note', text: 'The basket is empty. Go to Browse and add a listing.' }));
    $('bCount').textContent = '(' + items.length + ')'; $('bText').textContent = enquiry();
  }
  function drawProv() {
    var ul = K.clear($('pList'));
    PROV.forEach(function (p) {
      var n = all().filter(function (l) { return l.prov === p.id; }).length;
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: p.name }), h('p', {}, [
        h('span', { class: 'k-tag' + (p.level === 'Accredited' ? ' k-ok' : ''), text: p.level }), h('span', { class: 'k-tag', text: n + ' listing' + (n === 1 ? '' : 's') })]),
        h('p', { text: p.area + '. ' + p.reply + '.' }),
        h('div', { class: 'k-mini' }, [K.btn('See their listings', function () { $('fProv').value = p.id; show('Browse'); drawBrowse(); K.say('Showing listings from ' + p.name + '.'); }, 'k-small')])]));
    });
    if (!PROV.length) ul.appendChild(h('li', { class: 'k-note', text: 'Provider profiles are added when providers join.' }));
  }

  /* Orders: seven steps, each written into a record with a running check code so later changes can be seen. */
  var STEPS = ['Enquiry sent', 'Quote received', 'Accepted', 'Payment proof added', 'Payment checked', 'Delivered', 'Closed with feedback'];
  function code(str) { var x = 2166136261; for (var i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; } return ('0000000' + x.toString(16)).slice(-8); }
  function stamp() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function addLog(o, who, what) {
    var prev = o.log.length ? o.log[o.log.length - 1].c : '00000000', e = { t: stamp(), who: who, what: what };
    e.c = code(prev + '|' + e.t + '|' + e.who + '|' + e.what); o.log.push(e);
  }
  function intact(o) {
    var prev = '00000000';
    for (var i = 0; i < o.log.length; i++) { var e = o.log[i]; if (e.c !== code(prev + '|' + e.t + '|' + e.who + '|' + e.what)) return false; prev = e.c; }
    return true;
  }
  function orderText(o) {
    return 'ORDER ' + o.no + ' (' + STEPS[o.step] + ')\nFor: ' + o.who + '\n' + o.lines.map(function (l, i) { return (i + 1) + '. ' + l; }).join('\n') +
      '\n\nRecord:\n' + o.log.map(function (e) { return e.t + ' | ' + e.who + ' | ' + e.what + ' | ' + e.c; }).join('\n') + '\nRecord check: ' + (intact(o) ? 'intact' : 'CHANGED') + '\n';
  }
  function field(id, label, el) { el.id = id; return h('div', { class: 'k-grow' }, [h('label', { class: 'k-lab', for: id, text: label }), el]); }
  function stepForm(o) {
    var box = h('div', { class: 'k-row' }), go = function (who, what, extra) { if (extra) extra(); o.step++; addLog(o, who, what); K.save(); drawOrders(); K.say('Step ' + (o.step + 1) + ' done: ' + STEPS[o.step] + '.'); };
    var nm = h('input', { class: 'k-in', maxlength: 60 });
    function need(el, what) { var v = clean(el.value, 60); if (!v) { K.say('Please write ' + what + '.'); el.focus(); } return v; }
    if (o.step === 0) {
      var ref = h('input', { class: 'k-in', maxlength: 30, placeholder: 'for example Q-0412' });
      box.appendChild(field('q' + o.id, 'Quote reference you received', ref));
      box.appendChild(K.btn('Record the quote', function () { var r = need(ref, 'the quote reference'); if (r) go('Provider', 'Quote received, reference ' + r + '. Amounts stay on the quote.'); }, 'k-small'));
    } else if (o.step === 1) {
      box.appendChild(field('a' + o.id, 'Your name, to accept', nm));
      box.appendChild(K.btn('Accept the quote', function () { var w = need(nm, 'your name'); if (w) go(w, 'Quote accepted'); }, 'k-small'));
    } else if (o.step === 2) {
      var how = h('select', { class: 'k-in' }, ['Bank transfer', 'UPI (India)', 'Bank transfer (UAE)'].map(function (x) { return h('option', { text: x }); }));
      var pr = h('input', { class: 'k-in', maxlength: 30, placeholder: 'payment reference only' });
      box.appendChild(field('m' + o.id, 'How you paid', how)); box.appendChild(field('r' + o.id, 'Payment reference (never a card or account number)', pr)); box.appendChild(field('w' + o.id, 'Your name', nm));
      box.appendChild(K.btn('Add payment proof', function () {
        var r = clean(pr.value, 30); if (!/^[A-Za-z0-9-]{6,30}$/.test(r) || /^\d{12,}$/.test(r)) { K.say('Please type the payment reference only: 6 to 30 letters or digits, never a full account or card number.'); pr.focus(); return; }
        var w = need(nm, 'your name'); if (w) go(w, 'Payment proof added: ' + how.value + ', reference ' + r + ' (test only)', function () { o.maker = w.toLowerCase(); });
      }, 'k-small'));
    } else if (o.step === 3) {
      box.appendChild(field('c' + o.id, 'Checker name (a different person)', nm));
      box.appendChild(K.btn('Payment checked', function () {
        var w = need(nm, 'the checker name'); if (!w) return;
        if (w.toLowerCase() === o.maker) { K.say('The checker must be a different person from the one who added the payment proof.'); nm.focus(); return; }
        go(w, 'Payment checked against the bank record');
      }, 'k-small'));
    } else if (o.step === 4) {
      var dv = h('select', { class: 'k-in' }, ['Collected', 'Delivered', 'Online access given', 'Done on site'].map(function (x) { return h('option', { text: x }); }));
      box.appendChild(field('d' + o.id, 'How it reached you', dv)); box.appendChild(field('n' + o.id, 'Your name', nm));
      box.appendChild(K.btn('Mark as delivered', function () { var w = need(nm, 'your name'); if (w) go(w, 'Delivered: ' + dv.value); }, 'k-small'));
    } else if (o.step === 5) {
      var st = h('select', { class: 'k-in' }, ['5 Very good', '4 Good', '3 All right', '2 Poor', '1 Very poor'].map(function (x) { return h('option', { text: x }); }));
      var cm = h('input', { class: 'k-in', maxlength: 120 });
      box.appendChild(field('s' + o.id, 'How was it?', st)); box.appendChild(field('f' + o.id, 'One line of feedback', cm));
      box.appendChild(K.btn('Close with feedback', function () { go(o.who, 'Feedback ' + st.value.charAt(0) + ' of 5' + (clean(cm.value, 120) ? ': ' + clean(cm.value, 120) : '')); }, 'k-small'));
    } else box.appendChild(h('p', { class: 'k-note', text: 'This order is closed. Thank you.' }));
    return box;
  }
  function drawOrders() {
    var ul = K.clear($('oList'));
    orders.forEach(function (o) {
      var ok = intact(o);
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: 'Order ' + o.no + ' for ' + o.who }),
        h('p', {}, [h('span', { class: 'k-tag' + (o.step === 6 ? ' k-ok' : ''), text: 'Step ' + (o.step + 1) + ' of 7: ' + STEPS[o.step] }), h('span', { class: 'k-tag', text: o.lines.length + ' line' + (o.lines.length === 1 ? '' : 's') })]),
        h('p', { text: o.lines.join('\n') }), h('progress', { max: 6, value: o.step, 'aria-label': 'Order progress' }),
        stepForm(o),
        h('details', {}, [h('summary', { text: 'Order record (' + o.log.length + ' entries)' }), h('pre', { class: 'k-item', text: o.log.map(function (e) { return e.t + ' | ' + e.who + ' | ' + e.what + ' | ' + e.c; }).join('\n') })]),
        h('div', { class: 'k-mini' }, [
          K.btn('Check the record', function () { K.say(intact(o) ? 'Record intact: nothing was changed after it was written.' : 'Warning: this record was changed after it was written.'); }),
          K.btn('Download this order', function () { K.download('order-' + o.no + '.txt', orderText(o)); }),
          K.btn('Remove', function () { if (confirm('Remove this order from this browser?')) { orders.splice(orders.indexOf(o), 1); K.save(); drawOrders(); } })]),
        ok ? null : h('p', { class: 'k-note', text: 'Warning: the record was changed after it was written.' })]));
    });
    if (!orders.length) ul.appendChild(h('li', { class: 'k-note', text: 'No order yet. Fill the enquiry basket, then press "Make it an order".' }));
    $('oCount').textContent = '(' + orders.filter(function (o) { return o.step < 6; }).length + ')';
  }
  /* Become a provider: profile, rules, three questions, first listing, then a practice card. */
  var RULES = ['Every listing says "price on request". I never write amounts in a listing.', 'I never write phone numbers, emails or home addresses in a listing.',
    'I reply to every enquiry within the time on my profile.', 'Payment is by bank transfer or UPI only, and a second person checks it.',
    'I describe the real condition of goods, and I say when I am late.', 'On site, I follow the safety briefing and stop work if it is unsafe.'];
  var QUIZ = [['A buyer asks for your price. Where does the amount go?', ['In the listing title', 'In the quote you send', 'In the listing details'], 1],
    ['Who checks a payment?', ['The person who added the proof', 'A different person', 'Nobody'], 1],
    ['You will be two days late. What do you do?', ['Say nothing', 'Tell the buyer now', 'Cancel the order'], 1]];
  RULES.forEach(function (r, i) { $('jRules').appendChild(h('label', { class: 'k-check' }, [h('input', { type: 'checkbox', id: 'jr' + i }), r])); });
  QUIZ.forEach(function (q, i) {
    $('jQuiz').appendChild(h('fieldset', { class: 'k-item' }, [h('legend', { text: (i + 1) + '. ' + q[0] })].concat(q[1].map(function (a, j) {
      return h('label', { class: 'k-check' }, [h('input', { type: 'radio', name: 'jq' + i, id: 'jq' + i + '_' + j, value: String(j) }), a]); }))));
  });
  function ownListings() { return mine.filter(function (l) { return l.from !== 'file'; }).length; }
  function cardText() {
    return 'PRACTICE PROVIDER CARD\nProvider ID: ' + ME.pid + '\nName: ' + ME.name + '\nOffers: ' + ME.area + '\nKinds: ' + ME.kinds.join(', ') + '\nLevel: Trained\nRules agreed: ' + RULES.length +
      '\nQuestions passed: ' + QUIZ.length + ' of ' + QUIZ.length + '\nIssued: ' + stamp() + '\nPractice card made in this browser. Accreditation comes later, after a check by our team.\n';
  }
  function drawJoin() {
    var done = ['Profile', 'Training', 'Questions', 'First listing'].map(function (n, i) { return (ME.step > i ? 'Done: ' : 'To do: ') + n; });
    $('jState').textContent = ME.step >= 4 ? 'All four steps done. You are a provider at level "Trained" (' + ME.pid + ').' : done.join('  |  ');
    if (ME.name) { $('jName').value = ME.name; $('jArea').value = ME.area; ['Physical', 'Hybrid', 'Digital'].forEach(function (k) { $('jk' + k).checked = ME.kinds.indexOf(k) >= 0; }); }
    $('j4').textContent = ownListings() ? 'You have ' + ownListings() + ' listing(s) of your own. Step 4 is ready.' : 'You have no listing yet. Go to My listings and add one.';
    $('jCard').hidden = $('jDown').hidden = ME.step < 4; if (ME.step >= 4) $('jCard').textContent = cardText();
  }
  $('jSave1').addEventListener('click', function () {
    var n = clean($('jName').value, 60), a = clean($('jArea').value, 80), k = ['Physical', 'Hybrid', 'Digital'].filter(function (x) { return $('jk' + x).checked; });
    if (!n) { K.say('Please write your business or team name.'); $('jName').focus(); return; }
    if (/@|\d{6,}|\+\d/.test(n + ' ' + a)) { K.say('Please take out phone numbers and emails.'); return; }
    if (!a) { K.say('Please write what you offer.'); $('jArea').focus(); return; }
    if (!k.length) { K.say('Please tick at least one kind.'); return; }
    ME.name = n; ME.area = a; ME.kinds = k; ME.step = Math.max(ME.step, 1); K.save(); drawJoin(); K.say('Step 1 done. Now the rules.');
  });
  $('jSave2').addEventListener('click', function () {
    if (ME.step < 1) { K.say('Please do step 1 first.'); return; }
    var miss = RULES.filter(function (r, i) { return !$('jr' + i).checked; }).length;
    if (miss) { K.say(miss + ' rule(s) not ticked yet. Please read and tick each one.'); return; }
    ME.step = Math.max(ME.step, 2); K.save(); drawJoin(); K.say('Step 2 done. Now three short questions.');
  });
  $('jSave3').addEventListener('click', function () {
    if (ME.step < 2) { K.say('Please do steps 1 and 2 first.'); return; }
    var wrong = [];
    QUIZ.forEach(function (q, i) { var c = document.querySelector('input[name="jq' + i + '"]:checked'); if (!c || +c.value !== q[2]) wrong.push(i + 1); });
    if (wrong.length) { K.say('Please look again at question ' + wrong.join(' and ') + '.'); return; }
    ME.step = Math.max(ME.step, 3); K.save(); drawJoin(); K.say('Step 3 done. Now make your first listing.');
  });
  $('jGoMine').addEventListener('click', function () { show('Mine'); $('mTitle').focus(); });
  $('jFinish').addEventListener('click', function () {
    if (ME.step < 3) { K.say('Please do steps 1, 2 and 3 first.'); return; }
    if (!ownListings()) { K.say('Please make your first listing in My listings.'); return; }
    if (ME.step < 4) {
      ME.step = 4; ME.pid = 'DEMO-PRV-' + K.id().slice(-4).toUpperCase();
      mine.forEach(function (l) { if (l.from !== 'file') l.prov = 'me'; });
      PROV.unshift(myProv()); $('fProv').insertBefore(h('option', { value: 'me', text: ME.name }), $('fProv').options[1] || null); $('fProv').parentNode.hidden = false;
      K.save();
    }
    drawAll(); K.say('Done. You are a provider at level "Trained". Your card is below.');
  });
  $('jDown').addEventListener('click', function () { K.download('provider-card.txt', cardText()); });
  $('jReset').addEventListener('click', function () {
    if (!confirm('Start the provider steps again?')) return;
    if (ME.step >= 4) { PROV.shift(); var o = $('fProv').querySelector('option[value="me"]'); if (o) o.remove(); mine.forEach(function (l) { if (l.prov === 'me') l.prov = ''; }); }
    me[0] = ME = { step: 0 }; K.save(); ['jName', 'jArea'].forEach(function (k) { $(k).value = ''; }); drawAll(); K.say('Started again.');
  });
  function drawAll() { drawBrowse(); drawMine(); drawBasket(); drawProv(); drawOrders(); drawJoin(); }

  var TABS = ['Browse', 'Mine', 'Prov', 'Join', 'Basket', 'Orders'];
  function show(n) { TABS.forEach(function (m) { $('t' + m).setAttribute('aria-selected', m === n ? 'true' : 'false'); $('v' + m).hidden = m !== n; }); }
  TABS.forEach(function (n) { $('t' + n).addEventListener('click', function () { show(n); }); });
  if (D && D.intro) $('intro').textContent = D.intro; else $('intro').hidden = true;
  PROV.forEach(function (p) { $('fProv').appendChild(h('option', { value: p.id, text: p.name })); });
  if (!PROV.length) $('fProv').parentNode.hidden = true;
  $('bOrder').addEventListener('click', function () {
    var items = basket.map(byId).filter(Boolean), w = clean($('bWho').value, 60);
    if (!items.length) { K.say('The basket is empty. Go to Browse and add a listing.'); return; }
    if (!w) { K.say('Please write your name or team name.'); $('bWho').focus(); return; }
    var o = { id: K.id(), no: 'D-' + (1001 + orders.length), who: w, step: 0, maker: '', lines: items.map(function (l) { return l.title + ' [' + l.type + ', ' + l.kind + ', ' + l.how + ']'; }), log: [] };
    addLog(o, w, 'Enquiry sent' + ($('bMsg').value.trim() ? ': ' + clean($('bMsg').value, 200) : ''));
    orders.unshift(o); basket.length = 0; K.save(); drawAll(); show('Orders'); K.say('Order ' + o.no + ' made. Follow the steps below.');
  });
  $('oDown').addEventListener('click', function () { if (!orders.length) { K.say('There is no order yet.'); return; } K.download('order-records.txt', orders.map(orderText).join('\n----\n')); });
  ['fKind', 'fType', 'fProv'].forEach(function (k) { $(k).addEventListener('change', drawBrowse); });
  $('fFind').addEventListener('input', drawBrowse);
  $('mAdd').addEventListener('click', function () {
    var t = clean($('mTitle').value, 90), d = clean($('mText').value, 600);
    if (!t) { K.say('Please write a title.'); $('mTitle').focus(); return; }
    if (!d) { K.say('Please write the details.'); $('mText').focus(); return; }
    if (/\d\s*(usd|aed|inr|eur|gbp|cad|rs\.?|dollars?|rupees?|dirhams?)\b|[$€£₹]\s*\d/i.test(t + ' ' + d)) { K.say('Please take the amount out. Listings here are "price on request".'); return; }
    mine.unshift({ id: K.id(), type: $('mType').value, kind: $('mKind').value, how: $('mHow').value, title: t, text: d, prov: ME.step >= 4 ? 'me' : '' });
    $('mTitle').value = ''; $('mText').value = ''; if (K.save()) K.say('Listing added. It now shows in Browse, marked "Mine".'); drawAll();
  });
  $('mDown').addEventListener('click', function () {
    var own = mine.filter(function (l) { return l.from !== 'file'; });
    if (!own.length) { K.say('Make a listing first.'); return; }
    K.download('my-listings.json', JSON.stringify({ kind: 'marketplace-listings', v: 1, listings: own.map(function (l) { return { type: l.type, kind: l.kind, how: l.how, title: l.title, text: l.text }; }) }, null, 1));
  });
  $('mUp').addEventListener('click', function () { $('mFile').click(); });
  $('mFile').addEventListener('change', function () {
    var f = $('mFile').files[0]; if (!f) return;
    if (f.size > 200000) { K.say('That file is too large to be a share file.'); return; }
    var r = new FileReader();
    r.onload = function () {
      var n = 0;
      try {
        var d = JSON.parse(r.result); if (!d || d.kind !== 'marketplace-listings' || !Array.isArray(d.listings)) throw 0;
        d.listings.slice(0, 50).forEach(function (l) {
          var t = clean(l.title, 90), x = clean(l.text, 600); if (!t || !x) return;
          mine.push({ id: K.id(), type: pick(l.type, TYPES), kind: pick(l.kind, KINDS), how: pick(l.how, HOWS), title: t, text: x, from: 'file' }); n++;
        });
      } catch (e) { K.say('That is not a share file from this screen.'); return; }
      K.save(); drawAll(); K.say(n + ' listing(s) loaded from the share file.');
    };
    r.readAsText(f); $('mFile').value = '';
  });
  $('bMsg').value = msg[0] || '';
  $('bMsg').addEventListener('input', function () { msg[0] = $('bMsg').value; K.save(); $('bText').textContent = enquiry(); });
  $('bDown').addEventListener('click', function () { if (!basket.length) { K.say('The basket is empty.'); return; } K.download('enquiry.txt', enquiry()); });
  $('bCopy').addEventListener('click', function () {
    if (!basket.length) { K.say('The basket is empty.'); return; }
    var t = enquiry();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { K.say('Copied. Paste it into the contact or order page.'); }, function () { K.say('Copy was not allowed here. Use Download instead.'); });
    else K.say('Copy is not available in this browser. Use Download instead.');
  });
  $('bClear').addEventListener('click', function () { basket.length = 0; K.save(); drawAll(); K.say('Basket emptied.'); });
  drawAll();
})();
