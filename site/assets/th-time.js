/* Time hub: world clocks, time zone tools, clock changes, timers and countdowns. */
(function (T) {
  'use strict';
  var el = T.el, add = T.add, pad = T.pad, store = T.store, field = T.field, btn = T.btn, table = T.table;

  function dayNight(date, tz) { var h = T.parts(date, tz).hour; return h >= 6 && h < 18 ? 'day' : 'night'; }
  function relDay(date, tz, ref) {
    var a = T.ymd(date, tz), b = T.ymd(date, ref), n = T.dayNo(a.y, a.m, a.d) - T.dayNo(b.y, b.m, b.d);
    return n === 0 ? 'same day' : n > 0 ? 'next day' : 'previous day';
  }
  function clockCard(p, ref, onRemove) {
    var t = el('span', { class: 'th-ct' }), m = el('span', { class: 'th-cm' }), c = el('li', { class: 'th-card' }, [el('span', { class: 'th-cn' }, T.label(p)), t, m]);
    if (onRemove) c.appendChild(el('button', { type: 'button', class: 'th-x', 'aria-label': 'Remove ' + p.name, onclick: onRemove }, '×'));
    function upd(at) {
      var n = at || new Date();
      t.textContent = T.hm(n, p.tz, true);
      m.textContent = T.fmt(n, p.tz, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + T.offLabel(T.offMin(p.tz, n)) + ' · ' + dayNight(n, p.tz);
      c.className = 'th-card ' + dayNight(n, p.tz);
    }
    c.upd = upd;
    return c;
  }
  function liveCards(list, ref) { T.tick(function () { var n = new Date(); Array.prototype.forEach.call(list.children, function (c) { c.upd && c.upd(n); }); }); }

  /* ---------- world clock ---------- */
  T.reg('clock-main', function (box) {
    var names = ['Dubai', 'Mumbai', 'London', 'New York', 'Singapore', 'Sydney', 'Riyadh', 'Karachi', 'Dhaka', 'Bangkok', 'Hong Kong', 'Tokyo', 'Paris', 'Cairo', 'Nairobi', 'Johannesburg', 'Moscow', 'Toronto', 'Chicago', 'Los Angeles', 'Mexico City', 'Sao Paulo', 'Lagos', 'Auckland'];
    var list = el('ul', { class: 'th-cards', 'aria-label': 'World clock' });
    names.forEach(function (n) { list.appendChild(clockCard(T.findLocal(n))); });
    add(box, [el('p', null, 'Add a place to see its time next to the main cities:'), T.placeBox(null, function (p) { list.insertBefore(clockCard(p, null, function () { list.removeChild(this.parentNode); }), list.firstChild); liveCards(list); }, { geo: false }), list]);
    liveCards(list);
  }, 'The time right now in the main cities of the world. Day cards are light, night cards are dark.');

  T.reg('clock-extended', function (box) {
    var zones;
    try { zones = Intl.supportedValuesOf('timeZone'); } catch (e) { zones = T.CITIES.map(function (c) { return c.tz; }); }
    if (zones.indexOf('UTC') < 0) zones.unshift('UTC');
    var q = el('input', { type: 'search', placeholder: 'Type part of a zone name, for example Asia or Dubai', 'aria-label': 'Filter time zones' });
    var tb = el('tbody'), rows = zones.map(function (z) { var tt = el('td', { 'data-label': 'Time now' }), tf = el('td', { 'data-label': 'Offset' }); var tr = el('tr', null, [el('th', { scope: 'row' }, z.replace(/_/g, ' ')), tt, tf]); tr.z = z; tr.tt = tt; tr.tf = tf; tb.appendChild(tr); return tr; });
    var count = el('p', { class: 'th-hint', role: 'status' });
    function filter() { var s = q.value.trim().toLowerCase().replace(/ /g, '_'), n = 0; rows.forEach(function (r) { var show = !s || r.z.toLowerCase().indexOf(s) >= 0; r.hidden = !show; if (show) n++; }); count.textContent = n + ' of ' + rows.length + ' zones shown'; }
    q.addEventListener('input', filter); filter();
    var tbl = el('table', { class: 'data th-table' }, [el('thead', null, el('tr', null, ['Zone', 'Time now', 'Offset from UTC'].map(function (h) { return el('th', { scope: 'col' }, h); }))), tb]);
    add(box, [field('Find a zone', q), count, el('div', { class: 'th-scroll' }, tbl)]);
    T.tick(function () { var n = new Date(); rows.forEach(function (r) { if (r.hidden) return; r.tt.textContent = T.fmt(n, r.z, { weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); r.tf.textContent = T.offLabel(T.offMin(r.z, n)); }); });
  }, 'Every time zone your device knows, with its time right now.');

  T.reg('clock-personal', function (box) {
    var home = T.homePlace(), mine = store.get('personal', null) || [home, T.findLocal('London'), T.findLocal('New York'), T.findLocal('Singapore')];
    var list = el('ul', { class: 'th-cards' }), when = T.inp('datetime-local'), live = true, note = el('p', { class: 'th-hint', role: 'status' });
    function save() { store.set('personal', mine); }
    function redraw() {
      list.textContent = '';
      mine.forEach(function (p, i) { list.appendChild(clockCard(p, null, function () { mine.splice(i, 1); save(); redraw(); })); });
      paint();
    }
    function at() {
      if (live || !when.value) return new Date();
      var s = when.value.split('T'), a = T.parseISO(s[0]), t = (s[1] || '00:00').split(':');
      return a ? T.zoned(a.y, a.m, a.d, +t[0], +t[1], mine[0] ? mine[0].tz : 'UTC') : new Date();
    }
    function paint() { var n = at(); Array.prototype.forEach.call(list.children, function (c) { c.upd(n); }); }
    when.addEventListener('input', function () { live = !when.value; note.textContent = live ? 'Showing the live time.' : 'Showing this time in the first place on your list, converted for the rest.'; paint(); });
    add(box, [el('p', null, 'Save the places you care about. The list stays in this browser only. The first place is the one used when you choose a time below.'), T.placeBox(null, function (p) { if (mine.length < 24) { mine.push(p); save(); redraw(); } }), list,
      el('div', { class: 'th-row' }, [field('Show a chosen time instead of now', when), btn('Back to live time', function () { when.value = ''; live = true; paint(); })]), note]);
    redraw();
    T.tick(function () { if (live) paint(); });
  }, 'Your own list of places, kept in this browser. Choose any time to see it everywhere on your list.');

  T.reg('clock-site', function (box) {
    var p = T.homePlace(), title = T.inp('text', T.label(p), { maxlength: 40 }), theme = T.sel([['light', 'Light'], ['dark', 'Dark']], 'light'), out = el('textarea', { rows: 4, readonly: true, class: 'th-code', 'aria-label': 'Code to copy' }), prev = el('div', { class: 'th-preview' }), note = el('p', { class: 'th-hint', role: 'status' });
    function draw() {
      prev.textContent = '';
      var h = el('div', { 'data-hfl-widget': 'clock', 'data-tz': p.tz, 'data-title': title.value, 'data-theme': theme.value, 'data-ready': '1' });
      prev.appendChild(h); window.THWidget && window.THWidget.mount(h);
      out.value = '<div data-hfl-widget="clock" data-tz="' + p.tz + '" data-title="' + title.value.replace(/[<>&"]/g, '') + '" data-theme="' + theme.value + '"></div>\n<script async src="https://houseforlearning.com/assets/th-widget.js"><\/script>';
    }
    [title, theme].forEach(function (e) { e.addEventListener('input', draw); });
    add(box, [el('p', null, 'Put a live clock on your own web page. Pick a place, copy the code and paste it where the clock should appear. It shows no adverts and sends no information anywhere.'),
      T.placeBox(p, function (x) { p = x; title.value = T.label(x); draw(); }, { geo: false }), el('div', { class: 'th-row' }, [field('Title above the clock', title), field('Look', theme)]), el('h3', null, 'Preview'), prev, el('h3', null, 'Code to copy'), out,
      el('p', null, btn('Copy the code', function () { T.copy(out.value, note); })), note]);
    draw();
  }, 'A small live clock for your own web page.');

  T.reg('clock-utc', function (box) {
    var big = el('p', { class: 'th-big' }), rows = el('div'), refs = ['Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Singapore', 'Australia/Sydney'];
    add(box, [big, rows, el('p', null, 'UTC is the common reference time for the world. It does not change with the seasons. Other zones are described as UTC plus or minus a number of hours.')]);
    T.tick(function () {
      var n = new Date(), jd = T.jd(n), p = T.ymd(n, 'UTC'), w = T.isoWeek(p.y, p.m, p.d), doy = T.dayNo(p.y, p.m, p.d) - T.dayNo(p.y, 1, 1) + 1;
      big.textContent = T.hm(n, 'UTC', true) + ' UTC';
      rows.textContent = '';
      rows.appendChild(table(['Item', 'Value'], [['Date', T.dlong(n, 'UTC')], ['Standard format', n.toISOString()], ['Unix time (seconds)', String(Math.floor(n.getTime() / 1000))], ['Julian date', jd.toFixed(5)], ['Day of the year', String(doy)], ['ISO week', w.year + '-W' + pad(w.week)]]));
      rows.appendChild(table(['Place', 'Time now', 'Difference from UTC'], refs.map(function (z) { return [z.replace(/_/g, ' '), T.hm(n, z, true), T.offLabel(T.offMin(z, n))]; })));
    });
  }, 'Coordinated Universal Time, the common reference for every other clock.');

  /* ---------- time zone map ---------- */
  T.reg('tz-map', function (box) {
    var W = 1000, H = 500, S = T.svg, root = S('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'th-map', role: 'img', 'aria-label': 'World time zone map showing day and night' });
    var night = S('path', { fill: '#1d3550', opacity: 0.35 }), bands = S('g'), dots = S('g'), info = el('p', { class: 'th-big', role: 'status', 'aria-live': 'polite' }, 'Choose a city dot or a city button to see its time.');
    var x = function (lon) { return (lon + 180) / 360 * W; }, y = function (lat) { return (90 - lat) / 180 * H; };
    root.appendChild(S('rect', { x: 0, y: 0, width: W, height: H, fill: '#e9f1f7' }));
    for (var lat = -60; lat <= 60; lat += 30) root.appendChild(S('line', { x1: 0, x2: W, y1: y(lat), y2: y(lat), stroke: '#c9d5df', 'stroke-width': 1 }));
    for (var o = -12; o <= 12; o++) {
      root.appendChild(S('line', { x1: x(o * 15), x2: x(o * 15), y1: 0, y2: H, stroke: '#c9d5df', 'stroke-width': 1 }));
      var tx = S('text', { x: x(o * 15) + 2, y: 14, 'font-size': 11, fill: '#4f6276' }); tx.textContent = (o >= 0 ? '+' : '') + o; root.appendChild(tx);
    }
    root.appendChild(night); root.appendChild(bands); root.appendChild(dots);
    var rowsEl = el('ul', { class: 'th-pills', 'aria-label': 'Cities on the map' });
    T.CITIES.forEach(function (c) {
      var g = S('g', { tabindex: 0, role: 'button', 'aria-label': T.label(c) }), dot = S('circle', { cx: x(c.lon), cy: y(c.lat), r: 5, fill: '#d0732f', stroke: '#fffdf7', 'stroke-width': 1.5 });
      g.appendChild(dot);
      function show() { var n = new Date(); info.textContent = T.label(c) + ': ' + T.hm(n, c.tz, true) + ', ' + T.dlong(n, c.tz) + ' (' + T.offLabel(T.offMin(c.tz, n)) + ')'; }
      g.addEventListener('click', show); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
      dots.appendChild(g);
      rowsEl.appendChild(el('li', null, btn(c.name, show, 'btn-ghost')));
    });
    T.tick(function () {
      var n = new Date(), s = T.sunPos(n), th = (T.norm(280.46061837 + 360.98564736629 * (T.jd(n) - 2451545), 360)) * T.RAD, dec = s.dec || 0.0001, pts = [], lon, Hh, la;
      if (Math.abs(dec) < 0.002) dec = 0.002;
      for (lon = -180; lon <= 180; lon += 3) { Hh = th + lon * T.RAD - s.ra; la = Math.atan(-Math.cos(Hh) / Math.tan(dec)) / T.RAD; pts.push([x(lon), y(la)]); }
      var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L'), edge = dec > 0 ? H : 0;
      night.setAttribute('d', d + ' L' + W + ' ' + edge + ' L0 ' + edge + ' Z');
      bands.textContent = '';
      for (var o = -12; o <= 12; o++) { var t = S('text', { x: x(o * 15), y: H - 6, 'font-size': 11, 'text-anchor': o === -12 ? 'start' : o === 12 ? 'end' : 'middle', fill: '#1d3550' }); t.textContent = T.hm(new Date(n.getTime() + o * 3600000), 'UTC'); bands.appendChild(t); }
    });
    add(box, [root, el('p', { class: 'th-hint' }, 'Dark area is night. The numbers along the top are hours from UTC; the clock times along the bottom are the time in each hour-wide band. Real zone borders follow countries, so many places sit half an hour or more off these bands.'), info, rowsEl]);
  }, 'See where it is day and night right now, with the time in each band of the world.');

  /* ---------- converter ---------- */
  T.reg('tz-converter', function (box) {
    var from = T.homePlace(), tos = [T.findLocal('London'), T.findLocal('New York'), T.findLocal('Mumbai'), T.findLocal('Singapore'), T.findLocal('Sydney')], out = el('div');
    var now = new Date(), p0 = T.ymd(now, from.tz), dIn = T.inp('date', T.iso(p0.y, p0.m, p0.d)), tIn = T.inp('time', T.hm(now, from.tz));
    function inst() { var a = T.parseISO(dIn.value), t = (tIn.value || '0:0').split(':'); return a ? T.zoned(a.y, a.m, a.d, +t[0], +t[1], from.tz) : null; }
    function draw() {
      var i = inst(); out.textContent = '';
      if (!i) { out.textContent = 'Choose a date and time.'; return; }
      out.appendChild(table(['Place', 'Local time', 'Date', 'Difference'], [[T.label(from), T.hm(i, from.tz), T.dlong(i, from.tz), T.offLabel(T.offMin(from.tz, i))]].concat(tos.map(function (p) {
        return [T.label(p), T.hm(i, p.tz), T.dlong(i, p.tz) + ' (' + relDay(i, p.tz, from.tz) + ')', T.offLabel(T.offMin(p.tz, i))]; }))));
    }
    var chips = el('ul', { class: 'th-pills' });
    function chipsDraw() { chips.textContent = ''; tos.forEach(function (p, i) { chips.appendChild(el('li', null, [p.name + ' ', el('button', { type: 'button', class: 'th-x2', 'aria-label': 'Remove ' + p.name, onclick: function () { tos.splice(i, 1); chipsDraw(); draw(); } }, '×')])); }); }
    [dIn, tIn].forEach(function (e) { e.addEventListener('input', draw); });
    add(box, [el('h3', null, 'Convert from'), T.placeBox(from, function (p) { from = p; draw(); }), el('div', { class: 'th-row' }, [field('Date', dIn), field('Time', tIn), btn('Use the time now', function () { var n = new Date(), q = T.ymd(n, from.tz); dIn.value = T.iso(q.y, q.m, q.d); tIn.value = T.hm(n, from.tz); draw(); }, 'btn-ghost')]),
      el('h3', null, 'Convert to'), T.placeBox(null, function (p) { if (tos.length < 12) { tos.push(p); chipsDraw(); draw(); } }, { geo: false }), chips, out]);
    chipsDraw(); draw();
  }, 'Work out the time in any other place. Daylight saving changes are handled for the date you choose.');

  /* ---------- meeting planner ---------- */
  T.reg('tz-planner', function (box) {
    var ps = [T.homePlace(), T.findLocal('London'), T.findLocal('Mumbai')], n = new Date(Date.now() + 864e5), q = T.ymd(n, ps[0].tz), dIn = T.inp('date', T.iso(q.y, q.m, q.d)), out = el('div'), chips = el('ul', { class: 'th-pills' });
    var uniq = function (a) { return a.filter(function (p, i) { return a.indexOf(p) === i; }); };
    function draw() {
      out.textContent = '';
      var a = T.parseISO(dIn.value); if (!a || !ps.length) return;
      var best = [], rows = [];
      for (var h = 0; h < 24; h++) {
        var base = T.zoned(a.y, a.m, a.d, h, 0, ps[0].tz), ok = true;
        var cells = ps.map(function (p) { var hh = T.parts(base, p.tz).hour; if (hh < 8 || hh >= 20) ok = false; var c = hh >= 9 && hh < 17 ? 'w' : hh >= 7 && hh < 22 ? 'e' : 'n'; return el('td', { class: 'th-' + c, 'data-label': p.name }, T.fmt(base, p.tz, { weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })); });
        if (ok) best.push(T.hm(base, ps[0].tz));
        rows.push(el('tr', { class: ok ? 'tt-ok' : '' }, cells.concat(el('td', { 'data-label': 'Suits all?' }, ok ? 'Yes' : 'No'))));
      }
      out.appendChild(el('p', { class: 'th-big' }, best.length ? 'Good times in ' + ps[0].name + ': ' + best.join(', ') : 'No hour suits everyone between 08:00 and 20:00. Try another day or fewer places.'));
      out.appendChild(el('div', { class: 'th-scroll' }, el('table', { class: 'data th-table' }, [el('thead', null, el('tr', null, ps.map(function (p) { return el('th', { scope: 'col' }, T.label(p)); }).concat(el('th', { scope: 'col' }, 'Suits all?')))), el('tbody', null, rows)])));
      out.appendChild(el('p', { class: 'th-hint' }, 'Green is working hours (9 to 17), cream is early or late (7 to 22), grey is night. A row is "Yes" when everyone is between 08:00 and 20:00.'));
    }
    function chipsDraw() { chips.textContent = ''; ps.forEach(function (p, i) { chips.appendChild(el('li', null, [(i === 0 ? '★ ' : '') + p.name + ' ', i ? el('button', { type: 'button', class: 'th-x2', 'aria-label': 'Remove ' + p.name, onclick: function () { ps.splice(i, 1); chipsDraw(); draw(); } }, '×') : null])); }); }
    dIn.addEventListener('input', draw);
    add(box, [el('p', null, 'Add up to five places. The first place (★) sets the day and the rows.'), T.placeBox(null, function (p) { if (ps.length < 5) { ps.push(p); ps = uniq(ps); chipsDraw(); draw(); } }, { geo: false }), chips, field('Day of the meeting', dIn), out]);
    chipsDraw(); draw();
  }, 'Find an hour that suits everyone, in up to five places.');

  /* ---------- event time announcer ---------- */
  function hashParams() { var o = {}, q = location.hash.split('?')[1]; (q || '').split('&').forEach(function (kv) { var a = kv.split('='); if (a[0]) o[a[0]] = decodeURIComponent(a[1] || ''); }); return o; }
  function icsText(when, mins, name, details) {
    var z = function (x) { return x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
    var esc = function (s) { return String(s || '').replace(/[\\;,]/g, function (m) { return '\\' + m; }).replace(/\n/g, '\\n'); };
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//House for Learning//Time hub//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:' + when.getTime() + '-' + Math.random().toString(36).slice(2, 8) + '@houseforlearning.com', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(when), 'DTEND:' + z(new Date(when.getTime() + mins * 60000)), 'SUMMARY:' + esc(name), details ? 'DESCRIPTION:' + esc(details) : '', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
  }
  T.icsText = icsText;
  T.reg('tz-announcer', function (box) {
    var hp = hashParams(), from = T.homePlace(), n = new Date(Date.now() + 2 * 864e5), q = T.ymd(n, from.tz);
    var title = T.inp('text', hp.n || 'Live class', { maxlength: 80 }), dIn = T.inp('date', T.iso(q.y, q.m, q.d)), tIn = T.inp('time', '18:00'), len = T.inp('number', 60, { min: 15, max: 600 }), out = el('div'), note = el('p', { class: 'th-hint', role: 'status' }), cur = null;
    if (hp.t && !isNaN(+hp.t)) { cur = new Date(+hp.t); if (hp.z) { var z = T.findLocal(hp.z); from = z || { name: hp.z.replace(/_/g, ' '), country: '', tz: hp.z }; } var pp = T.ymd(cur, from.tz); dIn.value = T.iso(pp.y, pp.m, pp.d); tIn.value = T.hm(cur, from.tz); }
    var places = ['Dubai', 'Mumbai', 'London', 'New York', 'Los Angeles', 'Toronto', 'Singapore', 'Sydney', 'Nairobi', 'Johannesburg', 'Riyadh', 'Karachi'].map(T.findLocal);
    function inst() { var a = T.parseISO(dIn.value), t = (tIn.value || '0:0').split(':'); return a ? T.zoned(a.y, a.m, a.d, +t[0], +t[1], from.tz) : null; }
    function link(i) { return location.origin.replace('null', '') + location.pathname + '#tz-announcer?t=' + i.getTime() + '&z=' + encodeURIComponent(from.tz) + '&n=' + encodeURIComponent(title.value); }
    function draw() {
      var i = inst(); out.textContent = ''; if (!i) return;
      var l = link(i), box2 = el('textarea', { rows: 2, readonly: true, class: 'th-code', 'aria-label': 'Link to share' }, l);
      out.appendChild(el('p', { class: 'th-big' }, title.value + ': ' + T.dlong(i, from.tz) + ' at ' + T.hm(i, from.tz) + ' in ' + T.label(from)));
      out.appendChild(table(['Place', 'Local time', 'Date'], places.map(function (p) { return [T.label(p), T.hm(i, p.tz), T.dlong(i, p.tz)]; })));
      out.appendChild(el('p', null, 'Share this link. Whoever opens it sees the event in their own time zone:'));
      out.appendChild(box2);
      out.appendChild(el('div', { class: 'th-row' }, [btn('Copy link', function () { T.copy(l, note); }), btn('Download calendar file (.ics)', function () { T.download('event.ics', 'text/calendar', icsText(i, Math.max(15, +len.value || 60), title.value, 'Time hub link: ' + l)); note.textContent = 'Calendar file made.'; }, 'btn-ghost')]));
      out.appendChild(note);
    }
    [title, dIn, tIn, len].forEach(function (e) { e.addEventListener('input', draw); });
    add(box, [el('div', { class: 'th-row' }, [field('Event name', title), field('Date', dIn), field('Time', tIn), field('Length (minutes)', len)]), el('h3', null, 'Time is in'), T.placeBox(from, function (p) { from = p; draw(); }), out]);
    if (hp.t && cur) { var me = T.homePlace(); try { me = { name: 'Your time zone', country: '', tz: Intl.DateTimeFormat().resolvedOptions().timeZone }; } catch (e) {} box.insertBefore(el('p', { class: 'th-big' }, 'For you: ' + T.dlong(cur, me.tz) + ' at ' + T.hm(cur, me.tz) + ' (' + me.tz.replace(/_/g, ' ') + ')'), box.firstChild); }
    draw();
  }, 'Tell people when your event happens in their own time. Share one link and everyone sees their own time.');

  /* ---------- clock changes (daylight saving) ---------- */
  function transitions(tz, y) {
    var out = [], t = Date.UTC(y, 0, 1), end = Date.UTC(y + 1, 0, 1), prev = T.offMin(tz, new Date(t)), nx, lo, hi, mid, i;
    for (; t < end; t += 864e5) {
      nx = T.offMin(tz, new Date(t + 864e5));
      if (nx !== prev) { lo = t; hi = t + 864e5; for (i = 0; i < 20; i++) { mid = (lo + hi) / 2; if (T.offMin(tz, new Date(mid)) === prev) lo = mid; else hi = mid; } out.push({ at: new Date(Math.round(hi / 60000) * 60000), from: prev, to: nx }); prev = nx; }
    }
    return out;
  }
  T.transitions = transitions;
  T.reg('tz-dst', function (box) {
    var y = T.ymd(new Date(), 'UTC').y, yIn = T.inp('number', y, { min: 1970, max: 2100 }), out = el('div');
    function draw() {
      out.textContent = ''; var yy = +yIn.value || y, seen = {}, rows = [], none = [];
      T.CITIES.forEach(function (c) {
        if (seen[c.tz]) return; seen[c.tz] = 1;
        var tr = transitions(c.tz, yy);
        if (!tr.length) none.push(c.name);
        else rows.push([c.name + ' (' + c.country + ')', tr.map(function (r) { return T.fmt(r.at, c.tz, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) + ': clocks go ' + (r.to > r.from ? 'forward' : 'back') + ' ' + Math.abs(r.to - r.from) + ' min (' + T.offLabel(r.from) + ' to ' + T.offLabel(r.to) + ')'; }).join(' | ')]);
      });
      add(out, [table(['Place', 'Clock changes in ' + yy], rows), el('h3', null, 'No clock change in ' + yy), el('p', null, none.join(', ') + '.'), el('p', { class: 'th-hint' }, 'Worked out from the time zone rules built into your browser, so they follow the newest rules your browser knows. Rules can change at short notice, so check an official source for anything important.')]);
    }
    yIn.addEventListener('input', draw);
    add(box, [field('Year', yIn), out]); draw();
  }, 'When clocks change in the main places of the world, worked out for any year.');

  T.reg('tz-more', function (box) {
    var items = [['tz-map', 'Time zone map', 'Day and night on a world map.'], ['tz-converter', 'Time zone converter', 'One time, many places.'], ['tz-planner', 'Meeting planner', 'The best hour for everyone.'], ['tz-announcer', 'Event time announcer', 'A shareable link in everyone’s own time.'], ['tz-dst', 'Clock changes worldwide', 'When the clocks move.'], ['clock-personal', 'Personal world clock', 'Your own list of places.'], ['clock-utc', 'UTC time', 'The common reference time.'], ['classes', 'Live class time', 'House for Learning class times in your zone.']];
    add(box, el('ul', { class: 'th-links' }, items.map(function (i) { return el('li', null, [el('a', { href: '#' + i[0] }, i[1]), el('span', null, i[2])]); })));
  }, 'Everything about zones and clocks in one list.');

  /* ---------- timers ---------- */
  var audio;
  function beep() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var i, t0 = audio.currentTime;
      for (i = 0; i < 6; i++) { var o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audio.destination); g.gain.setValueAtTime(0.0001, t0 + i * 0.45); g.gain.exponentialRampToValueAtTime(0.4, t0 + i * 0.45 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.45 + 0.3); o.start(t0 + i * 0.45); o.stop(t0 + i * 0.45 + 0.35); }
    } catch (e) {}
  }
  var sw = { run: false, start: 0, base: 0, laps: [] }, timers = store.get('timers', []).map(function (t) { return Object.assign({}, t, { run: false, endAt: 0 }); }), watcher, banner;
  function dur(ms, cs) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600); return (h ? pad(h) + ':' : '') + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60) + (cs ? '.' + pad(Math.floor(ms % 1000 / 10)) : ''); }
  function watch() {
    if (watcher) return;
    watcher = setInterval(function () {
      var any = false;
      timers.forEach(function (t) { if (t.run) { any = true; if (Date.now() >= t.endAt) { t.run = false; t.left = 0; t.done = true; beep(); if (banner) banner.textContent = (t.label || 'Timer') + ' is finished.'; try { document.title = '⏰ ' + (t.label || 'Timer') + ' finished'; } catch (e) {} } } });
      if (!any) { clearInterval(watcher); watcher = null; }
    }, 250);
  }
  T.reg('tm-stopwatch', function (box) {
    var big = el('p', { class: 'th-clockbig', role: 'timer' }), laps = el('ol', { class: 'th-laps' }), go = btn('Start', toggle), lap = btn('Lap', function () { if (!sw.run) return; var t = cur(); sw.laps.unshift(t); drawLaps(); }, 'btn-ghost');
    function cur() { return sw.base + (sw.run ? Date.now() - sw.start : 0); }
    function toggle() { if (sw.run) { sw.base = cur(); sw.run = false; } else { sw.start = Date.now(); sw.run = true; } go.textContent = sw.run ? 'Pause' : sw.base ? 'Resume' : 'Start'; }
    function drawLaps() { laps.textContent = ''; sw.laps.forEach(function (t, i) { var prev = sw.laps[i + 1] || 0; laps.appendChild(el('li', null, 'Lap ' + (sw.laps.length - i) + ': ' + dur(t, true) + '  (+' + dur(t - prev, true) + ')')); }); }
    add(box, [big, el('div', { class: 'th-row' }, [go, lap, btn('Reset', function () { sw.run = false; sw.base = 0; sw.laps = []; go.textContent = 'Start'; drawLaps(); }, 'btn-ghost')]), laps]);
    go.textContent = sw.run ? 'Pause' : sw.base ? 'Resume' : 'Start'; drawLaps();
    var raf; function frame() { big.textContent = dur(cur(), true); raf = requestAnimationFrame(frame); } frame();
    T.onLeave(function () { cancelAnimationFrame(raf); });
  }, 'Time anything, with laps. It keeps counting if you visit another page of the hub.');

  T.reg('tm-timer', function (box) {
    var list = el('div', { class: 'th-timers' }); banner = el('p', { class: 'th-big', role: 'alert' });
    var lab = T.inp('text', '', { maxlength: 30, placeholder: 'Name (optional)' }), h = T.inp('number', 0, { min: 0, max: 99 }), m = T.inp('number', 5, { min: 0, max: 999 }), s = T.inp('number', 0, { min: 0, max: 59 });
    function save() { store.set('timers', timers.map(function (t) { return { id: t.id, label: t.label, total: t.total }; })); }
    function addT(total, label) { timers.push({ id: Date.now() + Math.random(), label: label || '', total: total, left: total, run: false, endAt: 0 }); save(); draw(); }
    function draw() {
      list.textContent = '';
      timers.forEach(function (t, i) {
        var disp = el('span', { class: 'th-clockbig sm', role: 'timer' }), go = btn(t.run ? 'Pause' : 'Start', function () {
          if (t.run) { t.left = Math.max(0, t.endAt - Date.now()); t.run = false; } else { if (t.left <= 0) t.left = t.total; t.endAt = Date.now() + t.left; t.run = true; t.done = false; try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume && audio.resume(); } catch (e) {} watch(); }
          banner.textContent = ''; draw();
        });
        t.disp = disp;
        list.appendChild(el('div', { class: 'th-timer' }, [el('strong', null, t.label || 'Timer ' + (i + 1)), disp, go, btn('Reset', function () { t.run = false; t.left = t.total; t.done = false; draw(); }, 'btn-ghost'), btn('Remove', function () { timers.splice(i, 1); save(); draw(); }, 'btn-ghost')]));
      });
      if (!timers.length) list.appendChild(el('p', null, 'No timers yet. Add one below.'));
    }
    var presets = el('div', { class: 'th-row' }, [1, 5, 10, 15, 25, 45].map(function (mn) { return btn(mn + ' min', function () { addT(mn * 60000, ''); }, 'btn-ghost'); }));
    add(box, [banner, list, el('h3', null, 'Add a timer'), presets, el('div', { class: 'th-row' }, [field('Name', lab), field('Hours', h), field('Minutes', m), field('Seconds', s), btn('Add timer', function () { var tot = ((+h.value || 0) * 3600 + (+m.value || 0) * 60 + (+s.value || 0)) * 1000; if (tot > 0) addT(tot, lab.value); })]),
      el('p', { class: 'th-hint' }, 'An alarm sound plays when a timer ends. Keep this page open and your sound on. You can run several timers at once.')]);
    draw();
    T.tick(function () { timers.forEach(function (t) { if (t.disp) t.disp.textContent = dur(t.run ? Math.max(0, t.endAt - Date.now()) : t.left); }); });
    T.onLeave(function () { banner = null; timers.forEach(function (t) { t.disp = null; }); });
  }, 'One or many timers, each with an alarm.');

  /* ---------- countdowns ---------- */
  function countdownView(box, o) {
    var big = el('p', { class: 'th-clockbig', role: 'timer' }), sub = el('p', { class: 'th-big' }), grid = el('div', { class: 'th-gridcd' });
    var cells = ['days', 'hours', 'minutes', 'seconds'].map(function (l) { var b = el('b'); grid.appendChild(el('div', null, [b, el('span', null, l)])); return b; });
    add(box, [sub, grid, o.note ? el('p', { class: 'th-hint' }, o.note) : null]);
    T.tick(function () {
      var tg = o.target(), ms = tg - Date.now();
      sub.textContent = o.title + ': ' + T.dlong(tg, o.tz || T.homePlace().tz) + ' (' + (o.tz || T.homePlace().tz).replace(/_/g, ' ') + ')';
      if (ms <= 0) { cells.forEach(function (c) { c.textContent = '0'; }); sub.textContent += ' · it is time!'; return; }
      var s = Math.floor(ms / 1000); cells[0].textContent = Math.floor(s / 86400); cells[1].textContent = pad(Math.floor(s % 86400 / 3600)); cells[2].textContent = pad(Math.floor(s % 3600 / 60)); cells[3].textContent = pad(s % 60);
    });
  }
  function nextYearly(m, da, tz) { var now = new Date(), y = T.ymd(now, tz).y, t = T.zoned(y, m, da, 0, 0, tz); return t > now ? t : T.zoned(y + 1, m, da, 0, 0, tz); }
  function nextFrom(list, name, tz) {
    var now = new Date(), y = T.ymd(now, tz).y, i, j, a, cand = [];
    for (i = y; i <= y + 2; i++) { a = T.islamic(i).filter(function (r) { return r[1].indexOf(name) === 0 && /day 1|begins/.test(r[1]); }); a.forEach(function (r) { var p = T.parseISO(r[0]); cand.push(T.zoned(p.y, p.m, p.d, 0, 0, tz)); }); }
    cand = cand.filter(function (t) { return t > now; }).sort(function (a, b) { return a - b; });
    return cand[0] || T.zoned(y + 1, 1, 1, 0, 0, tz);
  }
  function preset(id, title, fn, tzf, note) {
    T.reg(id, function (box) { var tz = tzf(); countdownView(box, { title: title, target: fn, tz: tz, note: note }); box.appendChild(el('p', null, [el('a', { href: '#tm-site' }, 'Put this countdown on your own site'), ' · ', el('a', { href: '#tm-countdown' }, 'Count down to any date')])); }, '');
  }
  var home = function () { return T.homePlace().tz; }, dub = function () { return 'Asia/Dubai'; };
  preset('tm-halloween', 'Halloween (31 October)', function () { return nextYearly(10, 31, home()); }, home);
  preset('tm-thanksgiving', 'Thanksgiving (US, fourth Thursday of November)', function () {
    var now = new Date(), tz = home(), y = T.ymd(now, tz).y, g = function (yy) { var first = T.wday(yy, 11, 1), da = 1 + ((4 - first + 7) % 7) + 21; return T.zoned(yy, 11, da, 0, 0, tz); };
    return g(y) > now ? g(y) : g(y + 1);
  }, home);
  preset('tm-newyear', 'New Year', function () { var now = new Date(), tz = home(), y = T.ymd(now, tz).y; return T.zoned(y + 1, 1, 1, 0, 0, tz); }, home, 'Counts down to midnight at the start of the next year in your home place.');
  preset('tm-national', 'UAE National Day (2 December)', function () { return nextYearly(12, 2, 'Asia/Dubai'); }, dub);
  preset('tm-eid-fitr', 'Eid al-Fitr (first day)', function () { return nextFrom(null, 'Eid al-Fitr', 'Asia/Dubai'); }, dub, 'Expected date from the Umm al-Qura calendar. The UAE confirms Eid by the official moon-sighting announcement, so the day can move by one.');
  preset('tm-eid-adha', 'Eid al-Adha (first day)', function () { return nextFrom(null, 'Eid al-Adha', 'Asia/Dubai'); }, dub, 'Expected date from the Umm al-Qura calendar. The UAE confirms Eid by the official moon-sighting announcement, so the day can move by one.');
  T.reg('tm-countdown', function (box) {
    var hp = hashParams(), from = T.homePlace(), q = T.ymd(new Date(Date.now() + 30 * 864e5), from.tz), title = T.inp('text', hp.n || 'My event', { maxlength: 60 }), dIn = T.inp('date', T.iso(q.y, q.m, q.d)), tIn = T.inp('time', '00:00'), view = el('div'), cur = null, note = el('p', { class: 'th-hint', role: 'status' });
    function inst() { var a = T.parseISO(dIn.value), t = (tIn.value || '0:0').split(':'); return a ? T.zoned(a.y, a.m, a.d, +t[0], +t[1], from.tz) : null; }
    if (hp.t && !isNaN(+hp.t)) { var tg = new Date(+hp.t); if (hp.z) from = T.findLocal(hp.z) || { name: hp.z, country: '', tz: hp.z }; var pp = T.ymd(tg, from.tz); dIn.value = T.iso(pp.y, pp.m, pp.d); tIn.value = T.hm(tg, from.tz); }
    function draw() { view.textContent = ''; T.ticks.length = 0; cur = inst(); if (!cur) return; countdownView(view, { title: title.value || 'Your date', target: function () { return cur; }, tz: from.tz }); var l = location.origin + location.pathname + '#tm-countdown?t=' + cur.getTime() + '&z=' + encodeURIComponent(from.tz) + '&n=' + encodeURIComponent(title.value); view.appendChild(el('p', null, [btn('Copy link to this countdown', function () { T.copy(l, note); }), ' ', note])); }
    [title, dIn, tIn].forEach(function (e) { e.addEventListener('input', draw); });
    add(box, [el('div', { class: 'th-row' }, [field('Name', title), field('Date', dIn), field('Time', tIn)]), T.placeBox(from, function (p) { from = p; draw(); }, { geo: false }), view]);
    draw();
  }, 'Count down to any date and time in any place.');
  T.reg('tm-site', function (box) {
    var from = T.homePlace(), q = T.ymd(new Date(Date.now() + 30 * 864e5), from.tz), title = T.inp('text', 'Opening day', { maxlength: 40 }), dIn = T.inp('date', T.iso(q.y, q.m, q.d)), tIn = T.inp('time', '09:00'), theme = T.sel([['light', 'Light'], ['dark', 'Dark']], 'light'), prev = el('div', { class: 'th-preview' }), out = el('textarea', { rows: 5, readonly: true, class: 'th-code', 'aria-label': 'Code to copy' }), note = el('p', { class: 'th-hint', role: 'status' });
    function draw() {
      prev.textContent = ''; var a = T.parseISO(dIn.value), t = (tIn.value || '0:0').split(':'); if (!a) return;
      var when = T.zoned(a.y, a.m, a.d, +t[0], +t[1], from.tz), h = el('div', { 'data-hfl-widget': 'countdown', 'data-target': when.toISOString(), 'data-title': title.value, 'data-theme': theme.value, 'data-ready': '1' });
      prev.appendChild(h); window.THWidget && window.THWidget.mount(h);
      out.value = '<div data-hfl-widget="countdown" data-target="' + when.toISOString() + '" data-title="' + title.value.replace(/[<>&"]/g, '') + '" data-theme="' + theme.value + '"></div>\n<script async src="https://houseforlearning.com/assets/th-widget.js"><\/script>';
    }
    [title, dIn, tIn, theme].forEach(function (e) { e.addEventListener('input', draw); });
    add(box, [el('p', null, 'Put a live countdown on your own web page. Pick the moment, copy the code and paste it into your page. It shows no adverts and sends no information anywhere.'), el('div', { class: 'th-row' }, [field('Title', title), field('Date', dIn), field('Time', tIn), field('Look', theme)]), T.placeBox(from, function (p) { from = p; draw(); }, { geo: false }), el('h3', null, 'Preview'), prev, el('h3', null, 'Code to copy'), out, el('p', null, btn('Copy the code', function () { T.copy(out.value, note); })), note]);
    draw();
  }, 'A small live countdown for your own web page.');
})(window.TH);
