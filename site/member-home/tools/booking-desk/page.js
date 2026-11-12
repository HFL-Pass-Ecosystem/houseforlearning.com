/* Booking desk: rooms, hot desks and shared equipment for on-site and hybrid work. Kept in this browser. */
(function () {
  'use strict';
  var K = window.Kit, h = K.h, $ = K.$;
  var books = K.get('bookings');
  var B = (window.SITE_DATA && window.SITE_DATA.booking) || null;
  var SAMPLE = [['Demo Room North', 'room', 8], ['Demo Room South', 'room', 4], ['Demo Room Garden', 'room', 12],
    ['Demo Desk 1', 'desk', 1], ['Demo Desk 2', 'desk', 1], ['Demo Desk 3', 'desk', 1], ['Demo Desk 4', 'desk', 1], ['Demo Desk 5', 'desk', 1], ['Demo Desk 6', 'desk', 1],
    ['Demo projector', 'equipment', 0], ['Demo test bench', 'equipment', 0]];
  var KINDS = { room: 'Meeting room', desk: 'Hot desk', equipment: 'Equipment' };
  function kindOf(k) { k = String(k || '').toLowerCase(); return k.indexOf('desk') >= 0 ? 'desk' : k.indexOf('room') >= 0 ? 'room' : 'equipment'; }
  var spaces = ((B && Array.isArray(B.spaces) && B.spaces.length) ? B.spaces : SAMPLE).filter(function (r) { return r && r[0]; }).map(function (r) {
    return { name: String(r[0]).slice(0, 60), kind: kindOf(r[1]), seats: Number(r[2]) || 0 };
  });
  var SLOTS = [];
  for (var m = 7 * 60; m <= 20 * 60; m += 30) SLOTS.push(('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2));
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function nowHM() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function label(s) { return s.name + ' (' + KINDS[s.kind] + (s.kind === 'room' && s.seats ? ', ' + s.seats + ' seats' : '') + ')'; }
  function live(b) { return b.st !== 'cancelled'; }
  function ended(b) { var t = today(); return b.date < t || (b.date === t && nowHM() >= b.to); }
  var ST = { booked: 'Booked', in: 'Checked in', noshow: 'No-show' };

  var TABS = ['Book', 'Day', 'Mine'];
  TABS.forEach(function (n) {
    $('t' + n).addEventListener('click', function () {
      TABS.forEach(function (x) { $('t' + x).setAttribute('aria-selected', x === n ? 'true' : 'false'); $('v' + x).hidden = x !== n; });
      if (n === 'Day') drawDay(); if (n === 'Mine') drawMine();
    });
  });

  /* Book */
  spaces.forEach(function (s, i) { $('bSpace').appendChild(h('option', { value: String(i), text: label(s) })); });
  SLOTS.forEach(function (t, i) {
    if (i < SLOTS.length - 1) $('bFrom').appendChild(h('option', { text: t }));
    if (i > 0) $('bTo').appendChild(h('option', { text: t }));
  });
  $('bFrom').value = '09:00'; $('bTo').value = '10:00'; $('bDate').value = today();
  function info() { var s = spaces[+$('bSpace').value]; $('bInfo').textContent = s ? label(s) + '. ' + books.filter(function (b) { return live(b) && b.space === s.name && b.date === $('bDate').value; }).length + ' booking(s) on that day.' : ''; }
  $('bSpace').addEventListener('change', info); $('bDate').addEventListener('change', info);
  $('bBook').addEventListener('click', function () {
    var s = spaces[+$('bSpace').value], d = $('bDate').value, f = $('bFrom').value, t = $('bTo').value;
    var who = $('bWho').value.trim().replace(/[<>]/g, '').slice(0, 40), what = $('bWhat').value.trim().slice(0, 120);
    if (!s) { K.say('Please pick a space or an item.'); return; }
    if (!d) { K.say('Please pick a date.'); $('bDate').focus(); return; }
    if (!who) { K.say('Please write who the booking is for.'); $('bWho').focus(); return; }
    if (t <= f) { K.say('The end time must be after the start time.'); $('bTo').focus(); return; }
    for (var i = 0; i < books.length; i++) {
      var b = books[i];
      if (live(b) && b.space === s.name && b.date === d && f < b.to && b.from < t) {
        K.say('Not booked: this clashes with ' + b.who + ' in ' + b.space + ' on ' + b.date + ', ' + b.from + ' to ' + b.to + '.'); return;
      }
    }
    var x = { id: K.id(), space: s.name, kind: s.kind, date: d, from: f, to: t, who: who, what: what, online: $('bOnline').checked, st: 'booked' };
    books.push(x); books.sort(function (a, c) { return (a.date + a.from) < (c.date + c.from) ? -1 : 1; });
    $('bWhat').value = ''; $('bOnline').checked = false;
    if (K.save()) K.say('Booked: ' + s.name + ' on ' + d + ', ' + f + ' to ' + t + ' for ' + who + '.' + (x.online ? ' Online link to be added.' : ''));
    info();
  });

  /* Day view */
  $('dDate').value = today();
  $('dDate').addEventListener('change', drawDay);
  $('dToday').addEventListener('click', function () { $('dDate').value = today(); drawDay(); });
  function drawDay() {
    var d = $('dDate').value || today(), cols = SLOTS.slice(0, -1);
    var head = K.clear(document.querySelector('#dGrid thead')), tb = K.clear(document.querySelector('#dGrid tbody'));
    head.appendChild(h('tr', {}, [h('th', { scope: 'col', text: 'Space' })].concat(cols.map(function (t) { return h('th', { scope: 'col', text: t }); }))));
    var day = books.filter(function (b) { return live(b) && b.date === d; }), freeDesks = 0, desks = 0, taken = 0;
    spaces.forEach(function (s) {
      var mine = day.filter(function (b) { return b.space === s.name; });
      if (s.kind === 'desk') { desks++; if (!mine.length) freeDesks++; }
      if (mine.length) taken++;
      var row = [h('th', { scope: 'row', text: s.name })];
      cols.forEach(function (t) {
        var b = null;
        mine.forEach(function (x) { if (x.from <= t && t < x.to) b = x; });
        row.push(b ? h('td', { title: b.who + ', ' + b.from + ' to ' + b.to }, [h('span', { class: 'k-tag ' + (b.st === 'in' ? 'k-ok' : 'k-warn'), text: b.from === t ? b.who : 'Taken' })]) : h('td', { text: '' }));
      });
      tb.appendChild(h('tr', {}, row));
    });
    $('dSum').textContent = d + ': ' + day.length + ' booking(s), ' + taken + ' of ' + spaces.length + ' spaces used. Free desks all day: ' + freeDesks + ' of ' + desks + '.';
  }

  /* My bookings */
  function drawMine() {
    var ul = K.clear($('mList')), t = today(), act = books.filter(live);
    act.forEach(function (b) {
      var btns = [];
      if (b.st === 'booked' && b.date === t) btns.push(K.btn('Check in', function () { b.st = 'in'; K.save(); drawMine(); K.say('Checked in to ' + b.space + '.'); }, 'k-small'));
      if (b.st === 'booked' && ended(b)) btns.push(K.btn('Mark as no-show', function () { b.st = 'noshow'; K.save(); drawMine(); K.say(b.space + ' marked as no-show.'); }));
      if (!ended(b)) btns.push(K.btn('Cancel', function () { if (confirm('Cancel this booking?')) { b.st = 'cancelled'; K.save(); drawMine(); K.say('Booking cancelled. The space is free again.'); } }));
      ul.appendChild(h('li', { class: 'k-item' }, [h('h3', { text: b.space + ', ' + b.date + ', ' + b.from + ' to ' + b.to }),
        h('p', { text: 'Who: ' + b.who + (b.what ? '\nPurpose: ' + b.what : '') + (b.online ? '\nAlso online: online link to be added.' : '') }),
        h('p', {}, [h('span', { class: 'k-tag' + (b.st === 'in' ? ' k-ok' : b.st === 'noshow' ? ' k-warn' : ''), text: ST[b.st] }), h('span', { class: 'k-tag', text: KINDS[b.kind] || 'Space' })]),
        h('div', { class: 'k-mini' }, btns)]));
    });
    if (!act.length) ul.appendChild(h('li', { class: 'k-note', text: 'No bookings yet.' }));
    $('mSum').textContent = act.length + ' booking(s): ' + act.filter(function (b) { return b.date >= t && b.st === 'booked'; }).length + ' coming up, ' +
      act.filter(function (b) { return b.st === 'in'; }).length + ' checked in, ' + act.filter(function (b) { return b.st === 'noshow'; }).length + ' no-show.';
  }
  $('mDown').addEventListener('click', function () {
    var act = books.filter(live);
    if (!act.length) { K.say('There is no booking to download yet.'); return; }
    var q = function (x) { return '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"'; };
    K.download('bookings.csv', 'Space,Kind,Date,Start,End,Who,Purpose,Also online,Status\r\n' + act.map(function (b) {
      return [b.space, KINDS[b.kind] || '', b.date, b.from, b.to, b.who, b.what, b.online ? 'Yes (link to be added)' : 'No', ST[b.st]].map(q).join(','); }).join('\r\n') + '\r\n');
  });
  info(); drawDay(); drawMine();
})();
