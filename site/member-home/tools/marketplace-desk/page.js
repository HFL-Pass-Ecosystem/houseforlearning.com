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
  function all() { return mine.concat(SAMPLES); }
  function byId(id) { return all().filter(function (l) { return l.id === id; })[0]; }
  function clean(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n); }
  function pick(v, list) { return list.indexOf(v) >= 0 ? v : list[0]; }
  function card(l, where) {
    var inB = basket.indexOf(l.id) >= 0;
    return h('li', { class: 'k-item' }, [h('h3', { text: l.title }), h('p', {}, [
      h('span', { class: 'k-tag' + (l.type === 'Need' ? ' k-warn' : ' k-ok'), text: l.type }), h('span', { class: 'k-tag', text: l.kind }), h('span', { class: 'k-tag', text: l.how }),
      l.sample ? h('span', { class: 'k-tag', text: 'Sample' }) : h('span', { class: 'k-tag', text: l.from === 'file' ? 'From a share file' : 'Mine' })]),
      h('p', { text: l.text }), h('p', { class: 'k-note', text: 'Price on request' }),
      h('div', { class: 'k-mini' }, [
        where !== 'basket' ? K.btn(inB ? 'In the basket' : 'Add to enquiry basket', function () { if (!inB) { basket.push(l.id); K.save(); K.say('Added to the enquiry basket.'); drawAll(); } }, 'k-small' + (inB ? ' k-quiet' : '')) : null,
        where === 'basket' ? K.btn('Take out', function () { basket.splice(basket.indexOf(l.id), 1); K.save(); drawAll(); }) : null,
        where === 'mine' ? K.btn('Remove', function () { if (confirm('Remove this listing?')) { mine.splice(mine.indexOf(l), 1); var b = basket.indexOf(l.id); if (b >= 0) basket.splice(b, 1); K.save(); drawAll(); K.say('Listing removed.'); } }) : null])]);
  }
  function drawBrowse() {
    var ul = K.clear($('lList')), k = $('fKind').value, t = $('fType').value, f = $('fFind').value.trim().toLowerCase(), n = 0;
    all().forEach(function (l) {
      if ((k && l.kind !== k) || (t && l.type !== t) || (f && (l.title + ' ' + l.text).toLowerCase().indexOf(f) < 0)) return;
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
  function drawAll() { drawBrowse(); drawMine(); drawBasket(); }

  ['Browse', 'Mine', 'Basket'].forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      ['Browse', 'Mine', 'Basket'].forEach(function (m) { $('t' + m).setAttribute('aria-selected', m === n ? 'true' : 'false'); $('v' + m).hidden = m !== n; });
    });
  });
  ['fKind', 'fType'].forEach(function (k) { $(k).addEventListener('change', drawBrowse); });
  $('fFind').addEventListener('input', drawBrowse);
  $('mAdd').addEventListener('click', function () {
    var t = clean($('mTitle').value, 90), d = clean($('mText').value, 600);
    if (!t) { K.say('Please write a title.'); $('mTitle').focus(); return; }
    if (!d) { K.say('Please write the details.'); $('mText').focus(); return; }
    if (/\d\s*(usd|aed|inr|eur|gbp|cad|rs\.?|dollars?|rupees?|dirhams?)\b|[$€£₹]\s*\d/i.test(t + ' ' + d)) { K.say('Please take the amount out. Listings here are "price on request".'); return; }
    mine.unshift({ id: K.id(), type: $('mType').value, kind: $('mKind').value, how: $('mHow').value, title: t, text: d });
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
