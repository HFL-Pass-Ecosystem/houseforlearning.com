/* Time hub: calendars, holidays, history, reference pages, news notes and date calculators. */
(function (T) {
  'use strict';
  var el = T.el, add = T.add, pad = T.pad, store = T.store, field = T.field, btn = T.btn, table = T.table, M = T.MONTHS, D = T.DAYS;
  function todayISO() { return T.isoOf(new Date(), T.homePlace().tz); }
  function wk(cc) { return /^(SA|QA|KW|OM|BH|EG)$/.test(cc) ? [5, 6] : cc === 'IN' ? [0] : [0, 6]; }
  function countrySel(v, fn) { return T.sel(T.COUNTRIES.map(function (c) { return [c[0], c[1]]; }), v, fn); }
  function longDate(dn) { var p = T.fromDayNo(dn); return D[T.wday(p.y, p.m, p.d)] + ' ' + p.d + ' ' + M[p.m - 1] + ' ' + p.y; }
  function ymdDiff(a, b) {
    var y = b.y - a.y, m = b.m - a.m, d = b.d - a.d;
    if (d < 0) { m--; d += T.daysIn(b.m === 1 ? b.y - 1 : b.y, b.m === 1 ? 12 : b.m - 1); }
    if (m < 0) { y--; m += 12; }
    return { y: y, m: m, d: d };
  }
  function addDate(p, y, m, d) {
    var tm = p.y * 12 + (p.m - 1) + y * 12 + m, ny = Math.floor(tm / 12), nm = tm % 12 + 1, nd = Math.min(p.d, T.daysIn(ny, nm));
    return T.fromDayNo(T.dayNo(ny, nm, nd) + d);
  }
  function plural(n, w) { return n + ' ' + w + (Math.abs(n) === 1 ? '' : 's'); }

  /* ---------- calendar view ---------- */
  function myEvents() { return store.get('events', []); }
  function monthTable(y, m, o) {
    var first = T.wday(y, m, 1), start = (first - o.first + 7) % 7, n = T.daysIn(y, m), wkend = o.weekend, tb = el('tbody'), tr, i, c, day, key, hol, ev, cell, today = todayISO();
    var head = el('tr', null, (o.weeks ? [el('th', { scope: 'col', class: 'th-wn' }, 'Wk')] : []).concat([0, 1, 2, 3, 4, 5, 6].map(function (k) { var dd = (o.first + k) % 7; return el('th', { scope: 'col', class: wkend.indexOf(dd) >= 0 ? 'th-we' : '' }, D[dd].slice(0, o.mini ? 1 : 3)); })));
    for (i = 0; i < 42; i++) {
      if (i % 7 === 0) { if (i >= start + n) break; tr = el('tr'); if (o.weeks) { var dn0 = i - start + 1, ref = T.fromDayNo(T.dayNo(y, m, 1) + Math.min(Math.max(dn0, 1), n) - 1 + 3); tr.appendChild(el('th', { scope: 'row', class: 'th-wn' }, String(T.isoWeek(ref.y, ref.m, Math.min(ref.d, T.daysIn(ref.y, ref.m))).week))); } tb.appendChild(tr); }
      day = i - start + 1;
      if (day < 1 || day > n) { tr.appendChild(el('td', { class: 'th-empty' })); continue; }
      key = T.iso(y, m, day); hol = o.hols[key]; ev = o.events[key];
      var cls = [wkend.indexOf((o.first + i % 7) % 7) >= 0 ? 'th-we' : '', hol ? 'th-hol' : '', ev ? 'th-ev' : '', key === today ? 'th-today' : ''].join(' ');
      cell = el('td', { class: cls }, [el('span', { class: 'th-dn' }, String(day)), hol && !o.mini ? el('span', { class: 'th-hn' }, hol.join('; ')) : null, ev && !o.mini ? el('span', { class: 'th-en' }, ev.join('; ')) : null]);
      if (hol || ev) cell.setAttribute('title', (hol || []).concat(ev || []).join('; '));
      tr.appendChild(cell);
    }
    return el('table', { class: 'th-cal' + (o.mini ? ' mini' : '') }, [el('caption', null, o.mini ? M[m - 1] : M[m - 1] + ' ' + y), el('thead', null, head), tb]);
  }
  function calView(box, o) {
    o = o || {};
    var home = T.homePlace(), cc = o.cc || (home.cc && T.COUNTRIES.some(function (c) { return c[0] === home.cc; }) ? home.cc : 'AE'), now = new Date(), cy = T.ymd(now, home.tz);
    var st = { mode: o.mode || 'month', y: o.y || cy.y, m: o.m || cy.m, cc: cc, first: o.first != null ? o.first : (T.COUNTRIES.filter(function (c) { return c[0] === cc; })[0] || [0, 0, 1])[2], weeks: !!o.weeks, hols: true, ev: true };
    var out = el('div', { class: 'th-printarea' }), listBox = el('div'), ctrl = el('div', { class: 'th-row th-noprint' });
    var mode = T.sel([['month', 'One month'], ['year', 'Whole year']], st.mode, function () { st.mode = mode.value; draw(); }), yIn = T.inp('number', st.y, { min: 1583, max: 9999 }), mSel = T.sel(M.map(function (x, i) { return [i + 1, x]; }), st.m, function () { st.m = +mSel.value; draw(); });
    var cSel = countrySel(cc, function () { st.cc = cSel.value; var c = T.COUNTRIES.filter(function (x) { return x[0] === st.cc; })[0]; fSel.value = c[2]; st.first = c[2]; draw(); });
    var fSel = T.sel([[0, 'Sunday'], [1, 'Monday'], [6, 'Saturday']], st.first, function () { st.first = +fSel.value; draw(); });
    var wkC = T.inp('checkbox'), hC = T.inp('checkbox'), eC = T.inp('checkbox'), title = T.inp('text', o.title || '', { maxlength: 60, placeholder: 'Title for the top of the page' }), notes = el('textarea', { rows: 2, placeholder: 'A line of notes for the page', maxlength: 200, 'aria-label': 'Notes' });
    wkC.checked = st.weeks; hC.checked = true; eC.checked = true;
    yIn.addEventListener('input', function () { st.y = Math.max(1583, Math.min(9999, +yIn.value || st.y)); draw(); });
    [wkC, hC, eC, title, notes].forEach(function (e) { e.addEventListener('input', function () { st.weeks = wkC.checked; st.hols = hC.checked; st.ev = eC.checked; draw(); }); });
    var chk = function (c, t) { return el('label', { class: 'th-chk' }, [c, ' ' + t]); };
    add(ctrl, [field('Show', mode), field('Year', yIn), o.fixedMonth ? null : field('Month', mSel), field('Country', cSel), field('Week starts on', fSel), chk(wkC, 'Week numbers'), chk(hC, 'Holidays'), chk(eC, 'My events')]);
    var extra = o.creator ? el('div', { class: 'th-row th-noprint' }, [field('Title', title), field('Notes', notes)]) : null;
    var tools = el('div', { class: 'th-row th-noprint' }, [btn('Print or save as PDF', function () { window.print(); }), btn('Download my events (.ics)', function () { downloadEvents(); }, 'btn-ghost')]);
    function hmap(list) { var h = {}; list.forEach(function (r) { (h[r.date] = h[r.date] || []).push(r.name); }); return h; }
    function emap() { var e = {}; myEvents().forEach(function (x) { (e[x.date] = e[x.date] || []).push(x.title); }); return e; }
    var seq = 0;
    function draw() {
      var me = ++seq, yrs = [st.y];
      out.textContent = ''; listBox.textContent = '';
      Promise.all(st.hols ? [T.holidays(st.cc, st.y)] : [Promise.resolve([])]).then(function (r) {
        if (me !== seq) return;
        var hs = r[0], hm = hmap(hs), opt = { first: st.first, weekend: wk(st.cc), weeks: st.weeks, hols: hm, events: st.ev ? emap() : {} };
        out.textContent = '';
        if (o.creator && (title.value || notes.value)) add(out, el('div', { class: 'th-ctitle' }, [el('h3', null, title.value || ''), notes.value ? el('p', null, notes.value) : null]));
        if (st.mode === 'month') add(out, monthTable(st.y, st.m, opt));
        else { var g = el('div', { class: 'th-year' }); for (var m = 1; m <= 12; m++) g.appendChild(monthTable(st.y, m, Object.assign({ mini: true }, opt))); add(out, [el('h3', { class: 'th-yeartitle' }, String(st.y)), g]); }
        var shown = hs.filter(function (h) { return st.mode === 'year' || +h.date.slice(5, 7) === st.m; });
        listBox.textContent = '';
        if (st.hols) {
          add(listBox, [el('h3', null, 'Holidays and observances'), shown.length ? table(['Date', 'Name'], shown.map(function (h) { var p = T.parseISO(h.date); return [D[T.wday(p.y, p.m, p.d)].slice(0, 3) + ' ' + p.d + ' ' + M[p.m - 1].slice(0, 3), h.name]; })) : el('p', null, 'No holiday list is available for this choice right now. Add your own dates in "Add your own events".'), el('p', { class: 'th-hint' }, (T.NOTE[st.cc] || '') + ' Weekend shown for ' + T.countryName(st.cc) + ': ' + wk(st.cc).map(function (x) { return D[x]; }).join(' and ') + '.')]);
        }
      });
    }
    add(box, [ctrl, extra, tools, out, listBox]);
    draw();
  }
  function downloadEvents() {
    var ev = myEvents(), parts = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//House for Learning//Time hub//EN'];
    ev.forEach(function (e) {
      var a = T.parseISO(e.date), t = (e.time || '09:00').split(':'), w = T.zoned(a.y, a.m, a.d, +t[0], +t[1], e.tz || 'UTC'), x = T.icsText(w, e.mins || 60, e.title, '').split('\r\n').filter(function (l) { return !/^(BEGIN|END):VCALENDAR|^VERSION|^PRODID|^CALSCALE/.test(l); });
      parts = parts.concat(x);
    });
    parts.push('END:VCALENDAR');
    T.download('my-events.ics', 'text/calendar', parts.join('\r\n'));
  }
  T.reg('cal-2026', function (b) { calView(b, { mode: 'year', y: 2026 }); }, 'The whole of 2026 with holidays.');
  T.reg('cal-2027', function (b) { calView(b, { mode: 'year', y: 2027 }); }, 'The whole of 2027 with holidays.');
  T.reg('cal-month', function (b) {
    var h = {}; (location.hash.split('?')[1] || '').split('&').forEach(function (kv) { var a = kv.split('='); h[a[0]] = decodeURIComponent(a[1] || ''); });
    calView(b, { mode: h.mode === 'year' ? 'year' : 'month', y: +h.y || 0, m: +h.m || 0, cc: h.c || '' });
  }, 'Any month or year, for any country, with holidays and your own events.');
  T.reg('cal-print', function (b) { calView(b, { mode: 'year', weeks: true }); }, 'Choose a month or a year, press the print button and pick "Save as PDF" as the printer.');
  T.reg('cal-creator', function (b) { calView(b, { mode: 'month', creator: true, weeks: true }); }, 'Make a calendar page with your own title and notes, then print it or save it as a PDF.');

  /* ---------- own events ---------- */
  T.reg('cal-events', function (box) {
    var home = T.homePlace(), title = T.inp('text', '', { maxlength: 80, placeholder: 'What is happening?' }), dIn = T.inp('date', todayISO()), tIn = T.inp('time', '09:00'), len = T.inp('number', 60, { min: 5, max: 1440 }), list = el('div'), place = home;
    function draw() {
      list.textContent = ''; var ev = myEvents().sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; });
      if (!ev.length) { list.textContent = 'No events yet.'; return; }
      add(list, table(['When', 'Event', ''], ev.map(function (e, i) { return [e.date + ' ' + e.time + ' (' + (e.tz || '').replace(/_/g, ' ') + ')', e.title, btn('Delete', function () { var all = myEvents().filter(function (x) { return x.id !== e.id; }); store.set('events', all); draw(); }, 'btn-ghost')]; })));
    }
    add(box, [el('p', null, 'Your events stay in this browser only. They appear on the monthly calendar, and you can download them as a calendar file for your phone or computer.'), el('div', { class: 'th-row' }, [field('Event', title), field('Date', dIn), field('Time', tIn), field('Minutes', len)]), T.placeBox(home, function (p) { place = p; }, { geo: false }),
      el('p', null, [btn('Save event', function () { if (!title.value.trim() || !dIn.value) return; var all = myEvents(); all.push({ id: Date.now() + '' + Math.random(), title: title.value.trim(), date: dIn.value, time: tIn.value || '09:00', tz: place.tz, mins: +len.value || 60 }); store.set('events', all); title.value = ''; draw(); }), ' ', btn('Download all (.ics)', downloadEvents, 'btn-ghost'), ' ', el('a', { class: 'btn btn-sm btn-ghost', href: '#cal-month' }, 'Open calendar')]), list]);
    draw();
  }, 'Add your own dates and download them as a calendar file.');

  /* ---------- holidays worldwide ---------- */
  T.reg('cal-holidays', function (box) {
    var yIn = T.inp('number', T.ymd(new Date(), 'UTC').y, { min: 1990, max: 2100 }), cs = countrySel('AE', draw), out = el('div');
    function draw() {
      out.textContent = 'Loading…';
      T.holidays(cs.value, +yIn.value).then(function (r) {
        out.textContent = '';
        add(out, [r.length ? table(['Date', 'Day', 'Holiday'], r.map(function (h) { var p = T.parseISO(h.date); return [h.date, D[T.wday(p.y, p.m, p.d)], h.name]; })) : el('p', null, 'No list could be loaded for this country. Check your internet connection or try another country.'), el('p', { class: 'th-hint' }, (T.NOTE[cs.value] || '') + (T.NOTE[cs.value] ? '' : 'Public holidays come from a free public list. Dates can change, so confirm with your employer or the government.'))]);
      });
    }
    yIn.addEventListener('input', draw);
    add(box, [el('div', { class: 'th-row' }, [field('Country', cs), field('Year', yIn)]), out]); draw();
  }, 'Public holidays for many countries. The United Arab Emirates is shown first.');

  /* ---------- on this day ---------- */
  T.reg('cal-history', function (box) {
    var t = T.ymd(new Date(), T.homePlace().tz), mSel = T.sel(M.map(function (x, i) { return [i + 1, x]; }), t.m, draw), dIn = T.inp('number', t.d, { min: 1, max: 31 }), out = el('div'), kind = T.sel([['events', 'Events'], ['births', 'Births'], ['deaths', 'Deaths']], 'events', draw), data = null, key = '';
    function show() {
      out.textContent = ''; var rows = (data[kind.value] || []).slice().sort(function (a, b) { return a.year - b.year; });
      add(out, [rows.length ? el('ul', { class: 'th-hist' }, rows.map(function (r) { return el('li', null, [el('b', null, String(r.year)), ' ', r.text]); })) : el('p', null, 'Nothing listed.'), el('p', { class: 'th-hint' }, 'History notes come from a free public feed (Wikipedia contributors, licence CC BY-SA 4.0) and are shown here unchanged.')]);
    }
    function draw() {
      var k = mSel.value + '-' + dIn.value;
      if (data && key === k) { show(); return; }
      out.textContent = 'Loading…';
      fetch('https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/' + pad(+mSel.value) + '/' + pad(+dIn.value)).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { data = j; key = k; show(); }).catch(function () { out.textContent = 'The history feed could not be reached. Check your internet connection and try again.'; });
    }
    dIn.addEventListener('change', draw);
    add(box, [el('div', { class: 'th-row' }, [field('Month', mSel), field('Day', dIn), field('Show', kind), btn('Today', function () { mSel.value = t.m; dIn.value = t.d; draw(); }, 'btn-ghost')]), out]); draw();
  }, 'What happened on any day of the year.');

  /* ---------- fun and learning days ---------- */
  var FUN = '01-04|World Braille Day;01-24|International Day of Education;02-11|International Day of Women and Girls in Science;02-13|World Radio Day;02-14|Valentine’s Day;02-21|International Mother Language Day;03-08|International Women’s Day;03-14|Pi Day;03-20|International Day of Happiness;03-21|World Poetry Day;03-22|World Water Day;03-23|World Meteorological Day;04-01|April Fools’ Day;04-07|World Health Day;04-22|Earth Day;04-23|World Book and Copyright Day;04-30|International Jazz Day;05-01|Workers’ Day;05-12|International Nurses Day;05-22|International Day for Biological Diversity;06-05|World Environment Day;06-08|World Oceans Day;06-21|International Day of Yoga;06-21|World Music Day;07-07|World Chocolate Day;07-11|World Population Day;07-17|World Emoji Day;07-30|International Day of Friendship;08-08|International Cat Day;08-12|International Youth Day;08-19|World Humanitarian Day;09-05|Teachers’ Day (India);09-08|International Literacy Day;09-19|Talk Like a Pirate Day;09-21|International Day of Peace;09-27|World Tourism Day;10-01|International Coffee Day;10-04|World Animal Day;10-05|World Teachers’ Day;10-10|World Mental Health Day;10-16|World Food Day;10-24|United Nations Day;10-31|Halloween;11-13|World Kindness Day;11-14|World Diabetes Day;11-20|World Children’s Day;12-01|UAE Commemoration Day;12-02|UAE National Day;12-10|Human Rights Day;12-18|International Migrants Day;12-25|Christmas Day'.split(';').map(function (s) { var a = s.split('|'); return { m: +a[0].slice(0, 2), d: +a[0].slice(3), name: a[1] }; });
  T.FUN = FUN;
  T.reg('cal-fun', function (box) {
    var t = T.ymd(new Date(), T.homePlace().tz), ms = T.sel([[0, 'All months']].concat(M.map(function (x, i) { return [i + 1, x]; })), t.m, draw), out = el('div');
    function draw() { var m = +ms.value, rows = FUN.filter(function (f) { return !m || f.m === m; }).map(function (f) { return [f.d + ' ' + M[f.m - 1], f.name]; }); out.textContent = ''; add(out, [table(['Date', 'Day to enjoy'], rows), el('p', { class: 'th-hint' }, 'Fixed-date days only. Days that move each year, such as Mother’s Day, are not listed.')]); }
    add(box, [field('Month', ms), out]); draw();
  }, 'Learning days, awareness days and a few just-for-fun days.');

  /* ---------- reference pages ---------- */
  T.reg('cal-months', function (box) {
    var facts = ['From a Roman god of doors and new beginnings.', 'From a Roman festival of cleansing. The shortest month.', 'From Mars. In the old Roman calendar the year began here.', 'Often tied to the idea of opening, as buds open in spring.', 'Linked to Maia, a goddess of growth.', 'Linked to Juno, a leading goddess.', 'Renamed to honour Julius Caesar.', 'Renamed to honour the emperor Augustus.', 'Latin for “seventh”, from when the year began in March.', 'Latin for “eighth”.', 'Latin for “ninth”.', 'Latin for “tenth”.'];
    var y = T.ymd(new Date(), 'UTC').y;
    add(box, [table(['Month', 'Days', 'Where the name comes from'], M.map(function (m, i) { return [m, i === 1 ? '28 (29 in a leap year)' : String(T.daysIn(2025, i + 1)), facts[i]]; })),
      el('h3', null, 'The Islamic (Hijri) months'), table(['No.', 'Month'], ['Muharram', 'Safar', 'Rabi al-awwal', 'Rabi al-thani', 'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'].map(function (m, i) { return [String(i + 1), m]; })),
      el('p', { class: 'th-hint' }, 'Hijri months follow the Moon. Each lasts 29 or 30 days and the year is about 11 days shorter than the Gregorian year.')]);
  }, 'The twelve months, how long they are and where the names come from.');
  T.reg('cal-days', function (box) {
    var o = ['The Sun', 'The Moon', 'Tiw, an old English god of war (the Roman Mars)', 'Woden, chief of the old English gods (the Roman Mercury)', 'Thor, god of thunder (the Roman Jupiter)', 'Frigg, a goddess of love and home (the Roman Venus)', 'Saturn, an old Roman god of farming'];
    add(box, [table(['Day', 'ISO number', 'Named after'], [1, 2, 3, 4, 5, 6, 0].map(function (i) { return [D[i], String(i || 7), o[i]]; })),
      el('p', null, 'The ISO standard counts Monday as day 1 and Sunday as day 7, and starts the week on Monday. Many countries start the week on Sunday.'),
      el('h3', null, 'Weekends around the Gulf and beyond'), table(['Place', 'Usual weekend'], [['United Arab Emirates', 'Saturday and Sunday (since 2022)'], ['Saudi Arabia, Qatar, Kuwait, Oman, Bahrain', 'Friday and Saturday'], ['India', 'Sunday (many workplaces also Saturday)'], ['United Kingdom, Europe, Americas', 'Saturday and Sunday']])]);
  }, 'The seven days, where the names come from and how weekends differ.');
  T.reg('cal-leap', function (box) {
    var y = T.ymd(new Date(), 'UTC').y, yIn = T.inp('number', y, { min: 1, max: 9999 }), ans = el('p', { class: 'th-big', role: 'status' }), next = el('div');
    function draw() { var v = +yIn.value; ans.textContent = v + (T.isLeap(v) ? ' is a leap year: February has 29 days and the year has 366 days.' : ' is not a leap year: February has 28 days and the year has 365 days.'); var ys = [], k = v; while (ys.length < 10 && k < 10000) { k++; if (T.isLeap(k)) ys.push(String(k)); } next.textContent = 'The next leap years after ' + v + ': ' + ys.join(', ') + '.'; }
    yIn.addEventListener('input', draw);
    add(box, [el('p', null, 'The Earth takes about 365.2422 days to go round the Sun. A calendar of 365 days slips by nearly a quarter of a day each year, so we add one extra day, 29 February, in most years that divide by 4.'), el('h3', null, 'The rule'), el('ul', { class: 'ticks' }, [el('li', null, 'A year divisible by 4 is a leap year.'), el('li', null, 'But a year divisible by 100 is not, …'), el('li', null, '… unless it is also divisible by 400. So 1900 was not a leap year but 2000 was.')]), field('Check a year', yIn), ans, next,
      el('p', null, 'People born on 29 February are called “leaplings”. In the Islamic calendar there is no leap day, but some years have a longer last month.')]);
    draw();
  }, 'Why we have a 29 February, and a quick checker for any year.');

  /* ---------- news notes ---------- */
  var ECL = [['2027-02-06', 'Annular solar eclipse', 'Seen from parts of South America and Africa'], ['2027-02-20', 'Penumbral lunar eclipse', 'Very faint shading of the Moon'], ['2027-07-18', 'Penumbral lunar eclipse', 'Very faint shading of the Moon'], ['2027-08-02', 'Total solar eclipse', 'Path crosses north Africa and the Middle East'], ['2027-08-17', 'Penumbral lunar eclipse', 'Very faint shading of the Moon'], ['2028-01-12', 'Partial lunar eclipse', 'Seen from the Americas, Europe and Africa'], ['2028-01-26', 'Annular solar eclipse', 'Seen from South America and southern Europe'], ['2028-07-06', 'Partial lunar eclipse', 'Seen from Europe, Africa, Asia and Australia'], ['2028-07-22', 'Total solar eclipse', 'Path crosses Australia and New Zealand'], ['2028-12-31', 'Total lunar eclipse', 'Seen from Asia, Australia, Europe and Africa'], ['2029-01-14', 'Partial solar eclipse', 'Seen from North America'], ['2029-06-12', 'Partial solar eclipse', 'Seen from the Arctic'], ['2029-06-26', 'Total lunar eclipse', 'Seen from the Americas, Europe and Africa'], ['2029-07-11', 'Partial solar eclipse', 'Seen from the southern oceans'], ['2029-12-05', 'Partial solar eclipse', 'Seen from the Antarctic region'], ['2029-12-20', 'Total lunar eclipse', 'Seen from the Americas, Europe, Africa and Asia']];
  T.ECLIPSES = ECL;
  function newsBlock(title, rows) { return el('section', { class: 'th-note' }, [el('h3', null, title), el('ul', null, rows.map(function (r) { return el('li', null, r); }))]); }
  T.newsBlock = newsBlock;
  function upcomingEclipse() { var t = todayISO(); return ECL.filter(function (e) { return e[0] >= t; }).slice(0, 4); }
  T.reg('news-astronomy', function (box) {
    var home = T.homePlace(), now = new Date(), ph = T.moonPhase(now), cr = T.crossings(function (d) { return T.norm(T.moonPos(d).lon - T.sunPos(d).lon, 360); }, [0, 90, 180, 270], now, 40, 12), seas = T.crossings(function (d) { return T.sunPos(d).lon; }, [0, 90, 180, 270], now, 370, 12), nm = { 0: 'New Moon', 90: 'First quarter', 180: 'Full Moon', 270: 'Last quarter' }, sn = { 0: 'March equinox', 90: 'June solstice', 180: 'September equinox', 270: 'December solstice' };
    add(box, [el('p', { class: 'th-hint' }, 'Sky notes are worked out by this page from the movements of the Sun and Moon, and written by House for Learning. They are not a news feed.'),
      newsBlock('The Moon now', [ph.name + ', about ' + Math.round(ph.lit * 100) + '% lit.']),
      newsBlock('Next Moon phases', cr.slice(0, 4).map(function (c) { return nm[c.target] + ': ' + T.dlong(c.at, home.tz) + ' at ' + T.hm(c.at, home.tz) + ' (' + T.label(home) + ')'; })),
      newsBlock('Next season change', seas.slice(0, 1).map(function (c) { return sn[c.target] + ': ' + T.dlong(c.at, home.tz) + ' at ' + T.hm(c.at, home.tz); })),
      newsBlock('Next eclipses', upcomingEclipse().map(function (e) { return e[0] + ': ' + e[1] + '. ' + e[2] + '.'; })),
      el('p', null, [el('a', { href: '#sky-tonight' }, 'See the sky tonight'), ' · ', el('a', { href: '#sky-eclipses' }, 'All eclipses'), ' · ', el('a', { href: '#sky-phases' }, 'Moon phases')])]);
  }, 'What to look for in the sky next, from the Moon to eclipses.');
  T.reg('news-timezones', function (box) {
    var home = T.homePlace(), y = T.ymd(new Date(), 'UTC').y, now = new Date(), zs = [['Europe/London', 'United Kingdom'], ['Europe/Paris', 'Central Europe'], ['America/New_York', 'US East'], ['America/Los_Angeles', 'US West'], ['Australia/Sydney', 'Sydney'], ['Pacific/Auckland', 'New Zealand'], [home.tz, T.label(home) + ' (your home place)']], seen = {}, rows = [];
    zs.forEach(function (z) { if (seen[z[0]]) return; seen[z[0]] = 1; var tr = T.transitions(z[0], y).concat(T.transitions(z[0], y + 1)).filter(function (r) { return r.at > now; }).slice(0, 1); rows.push(tr.length ? z[1] + ': ' + T.fmt(tr[0].at, z[0], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ', clocks go ' + (tr[0].to > tr[0].from ? 'forward' : 'back') + ' ' + Math.abs(tr[0].to - tr[0].from) + ' minutes' : z[1] + ': no clock change in the next two years'); });
    add(box, [el('p', { class: 'th-hint' }, 'Written by House for Learning from the zone rules built into your browser.'), newsBlock('Next clock changes', rows),
      newsBlock('Good to know', ['The United Arab Emirates and India keep the same time all year.', 'Not every place changes on the same day: Europe and North America move on different weekends, and the southern hemisphere moves the other way.', 'Governments can change the rules at short notice. For something important, check with an official source.']),
      el('p', null, [el('a', { href: '#tz-dst' }, 'Clock changes worldwide'), ' · ', el('a', { href: '#tz-planner' }, 'Meeting planner')])]);
  }, 'The next clock changes, and what to remember when you meet across zones.');
  T.reg('news-calendar', function (box) {
    var cs = countrySel('AE', draw), out = el('div');
    function draw() {
      var tz = T.homePlace().tz, now = T.ymd(new Date(), tz), t = T.iso(now.y, now.m, now.d); out.textContent = 'Loading…';
      Promise.all([T.holidays(cs.value, now.y), T.holidays(cs.value, now.y + 1)]).then(function (r) {
        var up = r[0].concat(r[1]).filter(function (h) { return h.date >= t; }).slice(0, 6), dn = T.dayNo(now.y, now.m, now.d), days = FUN.map(function (f) { var y2 = (f.m * 100 + f.d >= now.m * 100 + now.d) ? now.y : now.y + 1, n = T.dayNo(y2, f.m, f.d); return { n: n, f: f }; }).filter(function (x) { return x.n - dn <= 45; }).sort(function (a, b) { return a.n - b.n; }).slice(0, 6);
        out.textContent = '';
        add(out, [newsBlock('Next public holidays in ' + T.countryName(cs.value), up.length ? up.map(function (h) { var p = T.parseISO(h.date); return D[T.wday(p.y, p.m, p.d)] + ' ' + p.d + ' ' + M[p.m - 1] + ' ' + p.y + ': ' + h.name; }) : ['No holiday list could be loaded. Check your connection.']),
          newsBlock('Days to enjoy in the next 45 days', days.map(function (x) { return x.f.d + ' ' + M[x.f.m - 1] + ': ' + x.f.name; })), el('p', { class: 'th-hint' }, T.NOTE[cs.value] || 'Public holiday lists can change. Please confirm the date with your employer or the government.')]);
      });
    }
    add(box, [field('Country', cs), out]); draw();
  }, 'The next public holidays and special days.');
  T.reg('news-newsletter', function (box) {
    add(box, [el('p', null, 'We plan a short, calm newsletter for learners: new units, live class dates and the odd useful note. We send nothing until you ask, and it carries no adverts.'), el('p', null, 'To hear first, leave your details on our contact form and choose “Webinars and live classes”.'), el('p', null, [el('a', { class: 'btn', href: 'contact.html#message-form' }, 'Open the contact form'), ' ', el('a', { class: 'btn btn-ghost', href: 'privacy.html' }, 'How we treat your details')])]);
  }, 'A short, ad-free newsletter, only when you ask for it.');
  T.reg('news-live', function (box) {
    var ev = myEvents().filter(function (e) { return e.date >= todayISO(); }).sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; }).slice(0, 5);
    add(box, [el('p', null, 'Live classes bring a faculty member and a group of learners together. Dates and booking open with the members area. Until then, use these tools to be ready:'), el('ul', { class: 'th-links' }, [['classes', 'Live class time in your own zone', 'See any class time where you live.'], ['tz-announcer', 'Event time announcer', 'Share a time with a group.'], ['tz-planner', 'Meeting planner', 'Find an hour that suits all.'], ['cal-events', 'Add your own events', 'Keep your own dates.']].map(function (i) { return el('li', null, [el('a', { href: '#' + i[0] }, i[1]), el('span', null, i[2])]); })),
      newsBlock('Your next saved events', ev.length ? ev.map(function (e) { return e.date + ' ' + e.time + ': ' + e.title; }) : ['None saved yet.']), el('p', null, el('a', { class: 'btn btn-ghost', href: 'webinars.html' }, 'Webinars and live classes'))]);
  }, 'Live classes and events, and the tools to be ready for them.');

  /* ---------- calculators ---------- */
  function bizSettings() {
    var cs = countrySel('AE', null), wkS = T.sel([['sat-sun', 'Saturday and Sunday'], ['fri-sat', 'Friday and Saturday'], ['sun', 'Sunday only'], ['none', 'None (every day counts)']], 'sat-sun'), extra = el('textarea', { rows: 2, placeholder: 'Extra days off, one per line as YYYY-MM-DD', 'aria-label': 'Extra days off' }), useH = T.inp('checkbox'), note = el('p', { class: 'th-hint', role: 'status' });
    useH.checked = true;
    cs.addEventListener('change', function () { var w = wk(cs.value); wkS.value = w.length === 2 ? (w[0] === 5 ? 'fri-sat' : 'sat-sun') : 'sun'; });
    var node = el('details', { class: 'th-biz', open: true }, [el('summary', null, 'Working days and holidays (United Arab Emirates by default)'), el('div', { class: 'th-row' }, [field('Country holidays', cs), field('Weekend', wkS)]), el('label', { class: 'th-chk' }, [useH, ' Skip public holidays']), field('Extra days off', extra), note]);
    function weekend() { return { 'sat-sun': [0, 6], 'fri-sat': [5, 6], sun: [0], none: [] }[wkS.value]; }
    function holSet(y1, y2) {
      var set = {}, ps = [], y;
      extra.value.split(/[\s,;]+/).forEach(function (s) { if (T.parseISO(s)) set[s] = 'Extra day off'; });
      if (useH.checked) for (y = y1; y <= Math.min(y2, y1 + 8); y++) ps.push(T.holidays(cs.value, y));
      return Promise.all(ps).then(function (r) { r.forEach(function (l) { l.forEach(function (h) { set[h.date] = h.name; }); }); return set; });
    }
    return { node: node, weekend: weekend, holSet: holSet, note: note, isBiz: function (dn, w, hs) { var p = T.fromDayNo(dn); return w.indexOf(T.wday(p.y, p.m, p.d)) < 0 && !hs[T.iso(p.y, p.m, p.d)]; } };
  }
  function datePair(a, b) { var t = todayISO(), dn = T.dayNo.apply(null, Object.values(T.parseISO(t))), q = T.fromDayNo(dn + 30); return [T.inp('date', a || t), T.inp('date', b || T.iso(q.y, q.m, q.d))]; }
  function onAll(els, fn) { els.forEach(function (e) { e.addEventListener('input', fn); e.addEventListener('change', fn); }); }

  T.reg('calc-d2d', function (box) {
    var p = datePair(), inc = T.inp('checkbox'), out = el('div');
    function draw() {
      var a = T.parseISO(p[0].value), b = T.parseISO(p[1].value); out.textContent = ''; if (!a || !b) return;
      var na = T.dayNo(a.y, a.m, a.d), nb = T.dayNo(b.y, b.m, b.d), swap = nb < na, lo = swap ? b : a, hi = swap ? a : b, n = Math.abs(nb - na) + (inc.checked ? 1 : 0), df = ymdDiff(lo, hi);
      add(out, [el('p', { class: 'th-big' }, plural(n, 'day') + (swap ? ' (the second date is earlier)' : '')), table(['As', 'Result'], [['Years, months and days', plural(df.y, 'year') + ', ' + plural(df.m, 'month') + ', ' + plural(df.d, 'day') + (inc.checked ? ' (plus the end day)' : '')], ['Weeks and days', plural(Math.floor(n / 7), 'week') + ' and ' + plural(n % 7, 'day')], ['Hours', (n * 24).toLocaleString('en-GB')], ['Minutes', (n * 1440).toLocaleString('en-GB')], ['Seconds', (n * 86400).toLocaleString('en-GB')], ['First date', longDate(na)], ['Second date', longDate(nb)]])]);
    }
    onAll([p[0], p[1], inc], draw);
    add(box, [el('div', { class: 'th-row' }, [field('From', p[0]), field('To', p[1])]), el('label', { class: 'th-chk' }, [inc, ' Count the end day too']), out]); draw();
  }, 'How long is it between two dates?');

  T.reg('calc-bd2d', function (box) {
    var p = datePair(), bs = bizSettings(), out = el('div'), seq = 0;
    function draw() {
      var a = T.parseISO(p[0].value), b = T.parseISO(p[1].value); out.textContent = ''; if (!a || !b) return;
      var na = T.dayNo(a.y, a.m, a.d), nb = T.dayNo(b.y, b.m, b.d), lo = Math.min(na, nb), hi = Math.max(na, nb), me = ++seq;
      if (hi - lo > 36600) { out.textContent = 'Please choose dates less than 100 years apart.'; return; }
      bs.holSet(T.fromDayNo(lo).y, T.fromDayNo(hi).y).then(function (hs) {
        if (me !== seq) return; var w = bs.weekend(), biz = 0, we = 0, hd = [], n;
        for (n = lo; n <= hi; n++) { var q = T.fromDayNo(n), key = T.iso(q.y, q.m, q.d), isW = w.indexOf(T.wday(q.y, q.m, q.d)) >= 0; if (isW) we++; else if (hs[key]) hd.push(key + ' ' + hs[key]); else biz++; }
        out.textContent = '';
        add(out, [el('p', { class: 'th-big' }, plural(biz, 'working day') + ' from ' + longDate(lo) + ' to ' + longDate(hi) + ' (both days included)'), table(['Count', 'Days'], [['Calendar days', String(hi - lo + 1)], ['Working days', String(biz)], ['Weekend days', String(we)], ['Holiday days on weekdays', String(hd.length)]]), hd.length ? newsBlock('Holidays skipped', hd) : null]);
      });
    }
    onAll([p[0], p[1]], draw); bs.node.addEventListener('change', draw); bs.node.addEventListener('input', draw);
    add(box, [el('div', { class: 'th-row' }, [field('From', p[0]), field('To', p[1])]), bs.node, out]); draw();
  }, 'Count only working days between two dates.');

  T.reg('calc-add', function (box) {
    var t = todayISO(), base = T.inp('date', t), dir = T.sel([[1, 'Add'], [-1, 'Take away']], 1), y = T.inp('number', 0, { min: 0 }), m = T.inp('number', 0, { min: 0 }), w = T.inp('number', 0, { min: 0 }), d = T.inp('number', 30, { min: 0 }), out = el('div');
    function draw() { var a = T.parseISO(base.value); out.textContent = ''; if (!a) return; var s = +dir.value, r = addDate(a, s * (+y.value || 0), s * (+m.value || 0), s * ((+w.value || 0) * 7 + (+d.value || 0))), dn = T.dayNo(r.y, r.m, r.d); out.appendChild(el('p', { class: 'th-big' }, longDate(dn) + ' (week ' + T.isoWeek(r.y, r.m, r.d).week + ')')); }
    onAll([base, dir, y, m, w, d], draw);
    add(box, [field('Start date', base), el('div', { class: 'th-row' }, [field('Do', dir), field('Years', y), field('Months', m), field('Weeks', w), field('Days', d)]), out]); draw();
  }, 'Add or take away years, months, weeks and days.');

  T.reg('calc-bdate', function (box) {
    var base = T.inp('date', todayISO()), n = T.inp('number', 10, { min: -5000, max: 5000 }), bs = bizSettings(), out = el('div'), seq = 0;
    function draw() {
      var a = T.parseISO(base.value), cnt = Math.trunc(+n.value || 0); out.textContent = ''; if (!a) return;
      var me = ++seq, y1 = a.y - 1, y2 = a.y + Math.ceil(Math.abs(cnt) / 200) + 1;
      bs.holSet(Math.max(y1, 1900), y2).then(function (hs) {
        if (me !== seq) return; var w = bs.weekend(), dn = T.dayNo(a.y, a.m, a.d), step = cnt < 0 ? -1 : 1, left = Math.abs(cnt), guard = 0;
        while (left > 0 && guard++ < 100000) { dn += step; if (bs.isBiz(dn, w, hs)) left--; }
        out.textContent = ''; add(out, [el('p', { class: 'th-big' }, (cnt < 0 ? plural(-cnt, 'working day') + ' before ' : plural(cnt, 'working day') + ' after ') + longDate(T.dayNo(a.y, a.m, a.d)) + ' is ' + longDate(dn)), el('p', { class: 'th-hint' }, 'The start day is not counted. Weekends and the holidays chosen above are skipped.')]);
      });
    }
    onAll([base, n], draw); bs.node.addEventListener('change', draw); bs.node.addEventListener('input', draw);
    add(box, [el('div', { class: 'th-row' }, [field('Start date', base), field('Working days (use a minus sign to go back)', n)]), bs.node, out]); draw();
  }, 'Add or take away working days, skipping weekends and holidays.');

  T.reg('calc-weekday', function (box) {
    var base = T.inp('date', todayISO()), out = el('div'), wd = T.sel(D.map(function (x, i) { return [i, x]; }), 5, draw), mo = T.sel(M.map(function (x, i) { return [i + 1, x]; }), T.ymd(new Date(), 'UTC').m, draw), yr = T.inp('number', T.ymd(new Date(), 'UTC').y, { min: 1583, max: 9999 }), list = el('div');
    function draw() {
      var a = T.parseISO(base.value); out.textContent = ''; if (a) { var dn = T.dayNo(a.y, a.m, a.d), today = T.dayNo.apply(null, Object.values(T.parseISO(todayISO()))); out.appendChild(el('p', { class: 'th-big' }, longDate(dn) + ' · ' + (dn === today ? 'today' : dn > today ? plural(dn - today, 'day') + ' from today' : plural(today - dn, 'day') + ' ago'))); }
      list.textContent = ''; var v = +yr.value, m = +mo.value, ds = [], i; for (i = 1; i <= T.daysIn(v, m); i++) if (T.wday(v, m, i) === +wd.value) ds.push(i);
      add(list, el('p', null, D[+wd.value] + 's in ' + M[m - 1] + ' ' + v + ': ' + ds.map(function (x) { return x + ' ' + M[m - 1].slice(0, 3); }).join(', ') + '.'));
    }
    onAll([base, yr], draw);
    add(box, [field('Which day of the week is this date?', base), out, el('h3', null, 'All of one weekday in a month'), el('div', { class: 'th-row' }, [field('Day', wd), field('Month', mo), field('Year', yr)]), list]); draw();
  }, 'Find the weekday of any date, or every Friday in a month.');

  T.reg('calc-week', function (box) {
    var base = T.inp('date', todayISO()), out = el('div');
    function draw() {
      var a = T.parseISO(base.value); out.textContent = ''; if (!a) return; var w = T.isoWeek(a.y, a.m, a.d), dn = T.dayNo(a.y, a.m, a.d), wd = (T.wday(a.y, a.m, a.d) + 6) % 7, mon = dn - wd, doy = dn - T.dayNo(a.y, 1, 1) + 1, inY = T.isoWeek(a.y, 12, 28).week;
      add(out, [el('p', { class: 'th-big' }, 'Week ' + w.week + ' of ' + w.year), table(['Item', 'Result'], [['Week runs from', longDate(mon)], ['to', longDate(mon + 6)], ['Day of the year', doy + ' of ' + (T.isLeap(a.y) ? 366 : 365)], ['Quarter', 'Q' + Math.ceil(a.m / 3)], ['Weeks in ' + a.y + ' (ISO)', String(inY)], ['Days left in the year', String((T.isLeap(a.y) ? 366 : 365) - doy)]]), el('p', { class: 'th-hint' }, 'Weeks follow the ISO rule: they start on Monday and week 1 is the week that holds the first Thursday of the year.')]);
    }
    onAll([base], draw); add(box, [field('Date', base), out]); draw();
  }, 'Which week of the year is a date?');

  function toRoman(n) { var r = '', k = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; k.forEach(function (x) { while (n >= x[0]) { r += x[1]; n -= x[0]; } }); return r; }
  function fromRoman(s) { s = s.toUpperCase().replace(/\s/g, ''); if (!/^[MDCLXVI]+$/.test(s)) return null; var v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }, t = 0, i; for (i = 0; i < s.length; i++) { var c = v[s[i]], nx = v[s[i + 1]] || 0; t += c < nx ? -c : c; } return toRoman(t) === s ? t : null; }
  T.reg('calc-roman', function (box) {
    var num = T.inp('number', T.ymd(new Date(), 'UTC').y, { min: 1, max: 3999 }), rom = T.inp('text', '', { maxlength: 20, placeholder: 'For example MMXXVI' }), a = el('p', { class: 'th-big', role: 'status' }), b = el('p', { class: 'th-big', role: 'status' });
    function d1() { var n = +num.value; a.textContent = n >= 1 && n <= 3999 && n === Math.floor(n) ? n + ' = ' + toRoman(n) : 'Choose a whole number from 1 to 3999.'; }
    function d2() { if (!rom.value.trim()) { b.textContent = ''; return; } var v = fromRoman(rom.value); b.textContent = v ? rom.value.toUpperCase() + ' = ' + v : 'That is not a correct Roman numeral.'; }
    num.addEventListener('input', d1); rom.addEventListener('input', d2);
    add(box, [el('h3', null, 'Number to Roman numeral'), field('Number', num), a, el('h3', null, 'Roman numeral to number'), field('Roman numeral', rom), b, el('p', { class: 'th-hint' }, 'Roman numerals use I, V, X, L, C, D and M. They go up to 3999 in the standard way.')]); d1();
  }, 'Change numbers into Roman numerals and back.');

  T.reg('calc-age', function (box) {
    var birth = T.inp('date', '1990-01-01'), asof = T.inp('date', todayISO()), out = el('div');
    function draw() {
      var a = T.parseISO(birth.value), b = T.parseISO(asof.value); out.textContent = ''; if (!a || !b) return; var na = T.dayNo(a.y, a.m, a.d), nb = T.dayNo(b.y, b.m, b.d);
      if (nb < na) { out.textContent = 'The birth date must be before the other date.'; return; }
      var df = ymdDiff(a, b), days = nb - na, nxt = addDate(a, b.y - a.y, 0, 0), nn = T.dayNo(nxt.y, nxt.m, nxt.d); if (nn <= nb) { nxt = addDate(a, b.y - a.y + 1, 0, 0); nn = T.dayNo(nxt.y, nxt.m, nxt.d); }
      var planets = [['Mercury', 0.2408], ['Venus', 0.6152], ['Mars', 1.8808], ['Jupiter', 11.862], ['Saturn', 29.457]];
      add(out, [el('p', { class: 'th-big' }, plural(df.y, 'year') + ', ' + plural(df.m, 'month') + ' and ' + plural(df.d, 'day')), table(['Your age in', 'Amount'], [['Months', String(df.y * 12 + df.m)], ['Weeks', Math.floor(days / 7).toLocaleString('en-GB')], ['Days', days.toLocaleString('en-GB')], ['Hours', (days * 24).toLocaleString('en-GB')], ['Minutes', (days * 1440).toLocaleString('en-GB')], ['Seconds', (days * 86400).toLocaleString('en-GB')], ['Next birthday', longDate(nn) + ' (in ' + plural(nn - nb, 'day') + ')']]),
        el('h3', null, 'Your age on other planets'), table(['Planet', 'Years old'], planets.map(function (p) { return [p[0], (days / 365.25 / p[1]).toFixed(1)]; })), el('p', { class: 'th-hint' }, 'A planet year is the time that planet takes to go round the Sun. Mercury’s is much shorter than ours, Saturn’s much longer.')]);
    }
    onAll([birth, asof], draw); add(box, [el('div', { class: 'th-row' }, [field('Date of birth', birth), field('Age on', asof)]), out]); draw();
  }, 'Your age in months, days, seconds and even planet years.');

  T.reg('calc-pattern', function (box) {
    var start = T.inp('date', todayISO()), mode = T.sel([['every', 'Every N days, weeks, months or years'], ['nth', 'A chosen weekday of every month']], 'every'), n = T.inp('number', 2, { min: 1, max: 1000 }), unit = T.sel([['d', 'days'], ['w', 'weeks'], ['m', 'months'], ['y', 'years']], 'w'), nth = T.sel([[1, 'first'], [2, 'second'], [3, 'third'], [4, 'fourth'], [-1, 'last']], 2), wd = T.sel(D.map(function (x, i) { return [i, x]; }), 2), cnt = T.inp('number', 12, { min: 1, max: 200 }), out = el('div'), a = el('div'), b = el('div'), note = el('p', { class: 'th-hint', role: 'status' }), last = '';
    function draw() {
      var s = T.parseISO(start.value); out.textContent = ''; if (!s) return; var rows = [], k, c = Math.min(200, +cnt.value || 1), dates = [];
      a.hidden = mode.value !== 'every'; b.hidden = mode.value !== 'nth';
      if (mode.value === 'every') { for (k = 0; k < c; k++) { var q = unit.value === 'd' ? T.fromDayNo(T.dayNo(s.y, s.m, s.d) + k * n.value) : unit.value === 'w' ? T.fromDayNo(T.dayNo(s.y, s.m, s.d) + k * 7 * n.value) : unit.value === 'm' ? addDate(s, 0, k * n.value, 0) : addDate(s, k * n.value, 0, 0); dates.push(q); } }
      else { var yy = s.y, mm = s.m; while (dates.length < c && yy < 9999) { var days = T.daysIn(yy, mm), list = []; for (k = 1; k <= days; k++) if (T.wday(yy, mm, k) === +wd.value) list.push(k); var pick = +nth.value === -1 ? list[list.length - 1] : list[+nth.value - 1]; if (pick && T.dayNo(yy, mm, pick) >= T.dayNo(s.y, s.m, s.d)) dates.push({ y: yy, m: mm, d: pick }); mm++; if (mm > 12) { mm = 1; yy++; } } }
      last = dates.map(function (q) { return T.iso(q.y, q.m, q.d); }).join('\n');
      add(out, [table(['#', 'Date', 'Day'], dates.map(function (q, i) { return [String(i + 1), q.d + ' ' + M[q.m - 1] + ' ' + q.y, D[T.wday(q.y, q.m, q.d)]]; })), el('p', null, btn('Copy the dates', function () { T.copy(last, note); }, 'btn-ghost')), note]);
    }
    a.appendChild(el('div', { class: 'th-row' }, [field('Every', n), field('Unit', unit)])); b.appendChild(el('div', { class: 'th-row' }, [field('Which', nth), field('Weekday', wd)]));
    onAll([start, mode, n, unit, nth, wd, cnt], draw);
    add(box, [field('Starting from', start), field('Pattern', mode), a, b, field('How many dates', cnt), out]); draw();
  }, 'List dates that repeat, for example every 2 weeks or the second Tuesday of each month.');

  T.reg('calc-distance', function (box) {
    var A = T.findLocal('Dubai'), B = T.findLocal('London'), out = el('div');
    function draw() {
      out.textContent = ''; if (!A || !B || A.lat == null || B.lat == null) { out.textContent = 'Search for two places with a map position (cities work best).'; return; }
      var R = 6371.0088, f1 = A.lat * T.RAD, f2 = B.lat * T.RAD, dl = (B.lon - A.lon) * T.RAD, df = f2 - f1, h = Math.sin(df / 2) * Math.sin(df / 2) + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) * Math.sin(dl / 2), km = 2 * R * Math.asin(Math.sqrt(h)), brg = T.norm(Math.atan2(Math.sin(dl) * Math.cos(f2), Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl)) / T.RAD, 360), comp = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round(brg / 45) % 8], now = new Date(), hrs = km / 850 + 0.5;
      add(out, [el('p', { class: 'th-big' }, Math.round(km).toLocaleString('en-GB') + ' km in a straight line'), table(['Measure', 'Result'], [['Kilometres', km.toFixed(0)], ['Miles', (km * 0.621371).toFixed(0)], ['Nautical miles', (km * 0.539957).toFixed(0)], ['Direction from ' + A.name + ' to ' + B.name, Math.round(brg) + '° (' + comp + ')'], ['Flight time (rough, 850 km/h plus 30 minutes)', Math.floor(hrs) + ' h ' + Math.round((hrs % 1) * 60) + ' min'], ['Time difference now', ((T.offMin(B.tz, now) - T.offMin(A.tz, now)) / 60).toFixed(1).replace('.0', '') + ' hours (' + B.name + ' compared with ' + A.name + ')']]), el('p', { class: 'th-hint' }, 'Great-circle distance over the Earth’s surface, not road or flight route.')]);
    }
    add(box, [el('div', { class: 'th-row2' }, [el('div', null, [el('h3', null, 'From'), T.placeBox(A, function (p) { A = p; draw(); })]), el('div', null, [el('h3', null, 'To'), T.placeBox(B, function (p) { B = p; draw(); })])]), out]); draw();
  }, 'The distance between two places, with direction and a rough flight time.');
})(window.TH);
