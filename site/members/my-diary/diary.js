/* My Diary: one calm place for work, play, life, health and calendar.
   Privacy: everything is stored in this browser only. No network calls (the page's
   security policy blocks them), no tracking, no accounts. Export or erase any time. */
(function () {
  'use strict';
  var D = window.DIARY_DATA, KEY = 'mydiary.v1';
  var LINKS = [ /* sibling tools in the member zone; relative so they work on whichever site hosts this */
    { t: 'Life balance', d: 'Check in on the twelve parts of life', href: '/balance' },
    { t: 'Smart notebook', d: 'Handwriting and voice notes', href: '/me/notebook' },
    { t: 'Health index', d: 'A fuller health picture', href: '/health' },
    { t: 'Personal choices', d: 'Your way of living, in your words', href: '/choices' }
  ];

  /* ---------- storage ---------- */
  var mem = null;
  function blank() { return { v: 1, consent: false, profile: { name: '', region: '', tz: tz(), weekStart: 1, units: 'metric', theme: 'auto',
    diet: { pattern: 'all', avoid: [], goal: 'maintain', age: '', sex: 'na', height: '', weight: '', activity: 1.375, care: false } },
    events: [], items: [], logs: {}, plans: {} }; }
  function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }
  function load() {
    try { var s = localStorage.getItem(KEY); if (s) return Object.assign(blank(), JSON.parse(s)); } catch (e) {}
    return mem || blank();
  }
  var S = load();
  function save() { mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ---------- helpers ---------- */
  function h(tag, a) {
    var e = document.createElement(tag); a = a || {};
    for (var k in a) { if (k === 'style') a[k].split(';').forEach(function (d) { var i = d.indexOf(':'); if (i > 0) e.style.setProperty(d.slice(0, i).trim(), d.slice(i + 1).trim()); }); else if (k === 'class') e.className = a[k]; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), a[k]); else if (a[k] === true) e.setAttribute(k, ''); else if (a[k] !== false && a[k] != null) e.setAttribute(k, a[k]); }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) { if (c == null || c === false) return; if (Array.isArray(c)) c.forEach(function (x) { add(e, x); }); else e.appendChild(c.nodeType ? c : document.createTextNode(String(c))); }
  var ICONS = { sun: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z',
    swap: 'M7 7h11l-3-3M17 17H6l3 3', plus: 'M12 5v14M5 12h14', trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13', down: 'M12 4v12M7 11l5 5 5-5M5 20h14', up: 'M12 16V4M7 9l5-5 5 5M5 20h14', lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3' };
  function icon(n) { var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'i'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); var p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', ICONS[n]); s.appendChild(p); return s; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseYmd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function fmtDate(d, o) { try { return d.toLocaleDateString(undefined, o || { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ymd(d); } }
  function log(date) { return S.logs[date] || (S.logs[date] = { water: 0, eaten: {} }); }
  function download(name, type, text) { var a = h('a', { href: URL.createObjectURL(new Blob([text], { type: type })), download: name }); document.body.appendChild(a); a.click(); a.remove(); }
  function field(label, input, id) { id = id || 'f' + uid(); input.id = id; return h('div', {}, h('label', { for: id }, label), input); }
  function sel(opts, val, on) { var s = h('select', { onchange: function () { on(s.value); } }); opts.forEach(function (o) { var op = h('option', { value: o[0] }, o[1]); if (String(o[0]) === String(val)) op.selected = true; s.appendChild(op); }); return s; }
  function chip(label, on, tog) { var b = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(!!on), onclick: function () { on = !on; b.setAttribute('aria-pressed', String(on)); tog(on); } }, label); return b; }

  /* ---------- calendar: events, repeat, .ics in and out ---------- */
  function unfold(t) { return t.replace(/\r?\n[ \t]/g, '').split(/\r?\n/); }
  function icsText(v) { return v.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1'); }
  function icsDate(v) { var m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(v); if (!m) return null; if (m[4] == null) return { date: m[1] + '-' + m[2] + '-' + m[3], time: '' };
    if (m[7]) { var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])); return { date: ymd(d), time: pad(d.getHours()) + ':' + pad(d.getMinutes()) }; }
    return { date: m[1] + '-' + m[2] + '-' + m[3], time: m[4] + ':' + m[5] }; }
  function parseIcs(text) {
    var out = [], cur = null;
    unfold(text).forEach(function (line) {
      if (line === 'BEGIN:VEVENT') cur = {}; else if (line === 'END:VEVENT') { if (cur && cur.title && cur.date) out.push(cur); cur = null; }
      else if (cur) { var i = line.indexOf(':'); if (i < 0) return; var name = line.slice(0, i).split(';')[0].toUpperCase(), v = line.slice(i + 1);
        if (name === 'SUMMARY') cur.title = icsText(v); else if (name === 'LOCATION') cur.place = icsText(v); else if (name === 'DESCRIPTION') cur.notes = icsText(v); else if (name === 'UID') cur.uid = v;
        else if (name === 'DTSTART') { var s = icsDate(v); if (s) { cur.date = s.date; cur.time = s.time; } } else if (name === 'DTEND') { var e = icsDate(v); if (e) cur.endTime = e.time; }
        else if (name === 'RRULE') { var r = {}; v.split(';').forEach(function (p) { var kv = p.split('='); r[kv[0]] = kv[1]; }); cur.rep = { f: r.FREQ, n: +r.INTERVAL || 1, until: r.UNTIL ? (icsDate(r.UNTIL) || {}).date : '', count: +r.COUNT || 0 }; } }
    });
    return out;
  }
  function occursOn(ev, ds) {
    if (ev.date === ds) return true; if (!ev.rep || ds < ev.date) return false; if (ev.rep.until && ds > ev.rep.until) return false;
    var a = parseYmd(ev.date), b = parseYmd(ds), days = Math.round((b - a) / 864e5), n = ev.rep.n || 1, k = -1;
    if (ev.rep.f === 'DAILY' && days % n === 0) k = days / n;
    else if (ev.rep.f === 'WEEKLY' && days % (7 * n) === 0) k = days / (7 * n);
    else if (ev.rep.f === 'MONTHLY' && a.getDate() === b.getDate()) { var mo = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); if (mo % n === 0) k = mo / n; }
    else if (ev.rep.f === 'YEARLY' && a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && (b.getFullYear() - a.getFullYear()) % n === 0) k = (b.getFullYear() - a.getFullYear()) / n;
    return k >= 0 && (!ev.rep.count || k < ev.rep.count);
  }
  function eventsOn(ds) { return S.events.filter(function (e) { return occursOn(e, ds); }).sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); }); }
  function toIcs() {
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//My Diary//EN'], esc = function (s) { return String(s || '').replace(/[\;,]/g, '\\$&').replace(/\n/g, '\\n'); };
    S.events.forEach(function (e) { var d = e.date.replace(/-/g, ''); L.push('BEGIN:VEVENT', 'UID:' + (e.uid || e.id), 'DTSTAMP:' + ymd(new Date()).replace(/-/g, '') + 'T000000');
      L.push(e.time ? 'DTSTART:' + d + 'T' + e.time.replace(':', '') + '00' : 'DTSTART;VALUE=DATE:' + d); if (e.endTime && e.time) L.push('DTEND:' + d + 'T' + e.endTime.replace(':', '') + '00');
      L.push('SUMMARY:' + esc(e.title)); if (e.place) L.push('LOCATION:' + esc(e.place)); if (e.notes) L.push('DESCRIPTION:' + esc(e.notes));
      if (e.rep) L.push('RRULE:FREQ=' + e.rep.f + (e.rep.n > 1 ? ';INTERVAL=' + e.rep.n : '')); L.push('END:VEVENT'); });
    L.push('END:VCALENDAR'); return L.join('\r\n');
  }

  /* ---------- diet: energy target and day plan ---------- */
  var SLOTS = [['Breakfast', { starch: .25, protein: .17, dairy: .5, fruit: .34, veg: 0, fat: .15 }], ['Mid-morning', { starch: .1, protein: 0, dairy: 0, fruit: .33, veg: 0, fat: .15 }],
    ['Lunch', { starch: .3, protein: .33, dairy: 0, fruit: 0, veg: .4, fat: .25 }], ['Afternoon', { starch: .1, protein: .17, dairy: .5, fruit: .33, veg: 0, fat: .15 }],
    ['Dinner', { starch: .25, protein: .33, dairy: 0, fruit: 0, veg: .6, fat: .3 }]];
  function dietNum(x) { x = parseFloat(x); return isFinite(x) && x > 0 ? x : 0; }
  function target() {
    var p = S.profile.diet, imp = S.profile.units === 'imperial', w = dietNum(p.weight) * (imp ? .4536 : 1), ht = dietNum(p.height) * (imp ? 2.54 : 1), age = dietNum(p.age);
    var restricted = p.care || (age && age < 18), goal = restricted ? 'maintain' : p.goal, kcal, basis;
    if (w && ht && age) { var bmr = 10 * w + 6.25 * ht - 5 * age + (p.sex === 'm' ? 5 : p.sex === 'f' ? -161 : -78); kcal = bmr * p.activity; basis = 'your details'; } else { kcal = 1900; basis = 'a typical adult (add your details in Settings for a closer fit)'; }
    kcal *= goal === 'loss' ? .85 : goal === 'gain' ? 1.1 : 1; kcal = Math.max(1200, Math.round(kcal / 50) * 50);
    var protein = Math.min(10, Math.max(4, Math.round(kcal / 270))), fat = Math.round(kcal * .2 / 45), veg = 4, dairy = 2, fruit = 3;
    var starch = Math.max(3, Math.round((kcal - dairy * 85 - fruit * 60 - fat * 45 - veg * 25 - protein * 55) / 72));
    return { kcal: kcal, basis: basis, restricted: restricted, goal: goal, n: { starch: starch, protein: protein, dairy: dairy, fruit: fruit, veg: veg, fat: fat } };
  }
  var LIGHT = ['s1','s2','s4','s5','s8','s11','s12','s14','p7','p8','p9','p10','p11','p14','t4','t7','t8','t9','t10','t11','t12','t13','t14','t15','t16'], MAINLY = ['s1','s2','s3','s6','s7','s9','s10','s13','s14','s15','s16','s17','s18','p1','p2','p3','p4','p5','p6','p7','p9','p11','p12','p13','p14','t1','t2','t3','t4','t5','t6','t12','t13','t14','t15'];
  function slotPool(g, si) { var all = allowed(g), ok = all.filter(function (f) { return g === 'veg' || g === 'fruit' || g === 'dairy' || (si === 2 || si === 4 ? MAINLY : LIGHT).indexOf(f.id) >= 0; }); return ok.length ? ok : all; }
  function allowed(group) {
    var pat = D.PATTERNS[S.profile.diet.pattern] || D.PATTERNS.all, out = pat.out.concat(S.profile.diet.avoid);
    return D.FOODS.filter(function (f) { return f.group === group && !f.flags.some(function (x) { return out.indexOf(x) >= 0; }); });
  }
  function split(total, shares) { var raw = shares.map(function (s) { return s * total; }), base = raw.map(Math.floor), left = total - base.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (r, i) { return [r - base[i], i]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, left).forEach(function (x) { base[x[1]]++; }); return base; }
  function makePlan(ds) {
    var T = target(), seed = ds.split('-').reduce(function (a, b) { return a * 31 + +b; }, 7), plan = SLOTS.map(function () { return []; }), kosher = (D.PATTERNS[S.profile.diet.pattern] || {}).separate;
    var meatFlags = ['beef', 'lamb', 'poultry'];
    Object.keys(T.n).forEach(function (g) { var parts = split(T.n[g], SLOTS.map(function (s) { return s[1][g]; }));
      parts.forEach(function (n, si) { var pool = slotPool(g, si); if (!n || !pool.length) return; var tries = 0, f;
        do { f = pool[(seed + si * 3 + g.length + tries) % pool.length]; tries++; } while (kosher && tries < pool.length && f.flags.indexOf('dairy') >= 0 && plan[si].some(function (x) { return foodById(x.id).flags.some(function (y) { return meatFlags.indexOf(y) >= 0; }); }) );
        plan[si].push({ id: f.id, n: n, g: g }); }); });
    return plan;
  }
  function foodById(id) { for (var i = 0; i < D.FOODS.length; i++) if (D.FOODS[i].id === id) return D.FOODS[i]; return D.FOODS[0]; }
  function planFor(ds) { if (!S.plans[ds]) { S.plans[ds] = makePlan(ds); save(); } return S.plans[ds]; }
  function swap(ds, si, ii) { var it = S.plans[ds][si][ii], pool = slotPool(it.g, si), k = pool.findIndex(function (f) { return f.id === it.id; }), kos = (D.PATTERNS[S.profile.diet.pattern] || {}).separate, meat = ['beef', 'lamb', 'poultry'];
    for (var j = 1; j <= pool.length; j++) { var f = pool[(k + j) % pool.length]; if (kos && f.flags.indexOf('dairy') >= 0 && S.plans[ds][si].some(function (x) { return foodById(x.id).flags.some(function (y) { return meat.indexOf(y) >= 0; }); })) continue; it.id = f.id; break; }
    delete log(ds).eaten[si + ':' + ii]; save(); }

  /* ---------- views ---------- */
  var VIEWS = [['today', 'Today'], ['calendar', 'Calendar'], ['work', 'Work'], ['play', 'Play'], ['life', 'Life'], ['health', 'Health and diet'], ['settings', 'Settings']];
  var sel_date = ymd(new Date()), cal_month = new Date(); cal_month.setDate(1);

  function shell(view, body) {
    var app = document.getElementById('app'); app.textContent = '';
    document.documentElement.dataset.theme = S.profile.theme === 'auto' ? '' : S.profile.theme; if (S.profile.theme === 'auto') delete document.documentElement.dataset.theme;
    app.appendChild(h('header', { class: 'top' }, h('div', { class: 'brand' }, h('i'), 'My Diary'),
      h('nav', { class: 'tabs', 'aria-label': 'Sections' }, VIEWS.map(function (v) { return h('a', { href: '#' + v[0], 'aria-current': v[0] === view ? 'page' : null }, v[1]); }))));
    app.appendChild(h('main', { id: 'main' }, body));
    app.appendChild(h('footer', { class: 'f' }, 'Stored only on this device. Nothing is sent anywhere. General guidance on food and health is not medical advice.'));
  }

  function consentView() {
    document.getElementById('app').textContent = '';
    var name = h('input', { type: 'text', autocomplete: 'off', placeholder: 'Optional' });
    document.getElementById('app').appendChild(h('div', { class: 'consent' }, h('div', { class: 'brand' }, h('i'), 'My Diary'), h('h1', { style: 'margin-top:22px' }, 'One calm place for your whole day.'),
      h('p', { class: 'mute' }, 'Work, play, family and personal life, health and food, and your calendar. Together, without a drawer full of apps.'),
      h('div', { class: 'card panel' }, h('h2', {}, 'Before you start'),
        h('ul', {}, h('li', {}, 'Everything you write stays in this browser on this device.'), h('li', {}, 'No account, no tracking, no adverts, nothing sent to us.'),
          h('li', {}, 'You can download all of it, or erase all of it, at any time in Settings.'), h('li', {}, 'Food and health pages offer general guidance. They are not medical advice.')),
        h('div', { style: 'max-width:280px;margin:14px 0' }, field('What should we call you?', name)),
        h('button', { onclick: function () { S.consent = true; S.profile.name = name.value.trim(); save(); location.hash = '#settings'; render(); } }, icon('lock'), 'I agree. Begin'))));
  }

  function greeting() { var hr = new Date().getHours(); return hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening'; }

  function itemList(zone, ds) {
    var box = h('div'), list = S.items.filter(function (i) { return i.zone === zone && (ds === undefined || (i.date === ds) || (!i.date && !i.done)); });
    if (!list.length) box.appendChild(h('p', { class: 'mute small' }, 'Nothing here yet.'));
    box.appendChild(h('ul', { class: 'list' }, list.sort(function (a, b) { return (a.done - b.done) || (a.date || '9').localeCompare(b.date || '9'); }).map(function (i) {
      return h('li', { class: i.done ? 'done' : '' }, h('input', { type: 'checkbox', checked: i.done, 'aria-label': 'Done: ' + i.title, onchange: function (e) { i.done = e.target.checked; save(); render(); } }),
        h('div', { class: 'grow' }, h('div', { class: 't' }, i.title), i.date ? h('div', { class: 'small mute' }, fmtDate(parseYmd(i.date), { weekday: 'short', day: 'numeric', month: 'short' })) : null),
        h('button', { class: 'quiet', 'aria-label': 'Delete ' + i.title, onclick: function () { S.items = S.items.filter(function (x) { return x !== i; }); save(); render(); } }, icon('trash'))); })));
    return box;
  }
  function addItem(zone) {
    var t = h('input', { type: 'text', placeholder: 'Add something to this list', 'aria-label': 'New item' }), d = h('input', { type: 'date', 'aria-label': 'Date (optional)' });
    return h('form', { class: 'row', onsubmit: function (e) { e.preventDefault(); if (!t.value.trim()) return; S.items.push({ id: uid(), zone: zone, title: t.value.trim(), date: d.value, done: false }); save(); render(); } },
      h('div', { style: 'flex:1;min-width:180px' }, t), h('div', { style: 'width:150px' }, d), h('button', { type: 'submit' }, icon('plus'), 'Add'));
  }

  function todayView() {
    var ds = ymd(new Date()), L = log(ds), T = target(), plan = planFor(ds), total = 0, eaten = 0;
    plan.forEach(function (sl, si) { sl.forEach(function (it, ii) { total++; if (L.eaten[si + ':' + ii]) eaten++; }); });
    var evs = eventsOn(ds), note = h('textarea', { 'aria-label': 'Diary note for today', placeholder: 'A few lines about today, only for you.', onchange: function () { L.note = note.value; save(); } }); note.value = L.note || '';
    var hero = h('div', { class: 'hero' }, h('div', { class: 'date' }, fmtDate(new Date())), h('h1', {}, greeting() + (S.profile.name ? ', ' + S.profile.name : '') + '.'),
      S.profile.region ? h('p', { class: 'mute' }, 'Your zone: ' + S.profile.region + (S.profile.tz ? ' (' + S.profile.tz.replace(/_/g, ' ') + ')' : '')) : null);
    var water = h('div', { class: 'row' }, [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return h('button', { class: 'chip', 'aria-pressed': String(L.water >= n), 'aria-label': n + ' glasses', onclick: function () { L.water = L.water === n ? n - 1 : n; save(); render(); } }, String(n)); }));
    return [hero, h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, h('h2', {}, 'Your day'), evs.length ? h('ul', { class: 'list' }, evs.map(function (e) { return h('li', {}, h('span', { class: 'pill' }, e.time || 'All day'), h('div', { class: 'grow' }, h('div', {}, e.title), e.place ? h('div', { class: 'small mute' }, e.place) : null)); })) : h('p', { class: 'mute small' }, 'No events today.'),
        ['work', 'play', 'life'].map(function (z) { var l = S.items.filter(function (i) { return i.zone === z && !i.done && (!i.date || i.date <= ds); }); return l.length ? h('div', {}, h('h3', { style: 'margin-top:14px;text-transform:capitalize' }, z), h('ul', { class: 'list' }, l.slice(0, 5).map(function (i) { return h('li', {}, h('input', { type: 'checkbox', 'aria-label': 'Done: ' + i.title, onchange: function () { i.done = true; save(); render(); } }), h('div', { class: 'grow' }, i.title)); }))) : null; })),
      h('div', { class: 'card' }, h('h2', {}, 'Food today'), h('div', { class: 'row sp' }, h('div', {}, h('div', { class: 'num' }, T.kcal), h('div', { class: 'small mute' }, 'kcal guide')), h('div', { class: 'small mute' }, eaten + ' of ' + total + ' portions ticked')),
        h('div', { class: 'bar', style: 'margin:12px 0' }, h('i', { style: 'width:' + (total ? Math.round(100 * eaten / total) : 0) + '%' })), h('a', { class: 'btn ghost', href: '#health' }, 'Open meal plan'),
        h('h3', { style: 'margin-top:18px' }, 'Water, ' + L.water + ' of 8 glasses'), water),
      h('div', { class: 'card panel' }, h('h2', {}, 'A few lines for you'), note),
      h('div', { class: 'card' }, h('h2', {}, 'Connected tools'), h('ul', { class: 'list' }, LINKS.map(function (l) { return h('li', {}, h('div', { class: 'grow' }, h('a', { href: l.href }, l.t), h('div', { class: 'small mute' }, l.d))); }))))];
  }

  function calendarView() {
    var m = cal_month, first = new Date(m.getFullYear(), m.getMonth(), 1), ws = S.profile.weekStart, lead = (first.getDay() - ws + 7) % 7, cells = [], now = ymd(new Date());
    for (var i = 0; i < 7; i++) cells.push(h('div', { class: 'h' }, fmtDate(new Date(2024, 0, 7 + ((i + ws) % 7)), { weekday: 'short' })));
    for (var c = 0; c < 42; c++) { var d = addDays(first, c - lead), ds = ymd(d), evs = eventsOn(ds);
      cells.push(h('div', { class: (d.getMonth() !== m.getMonth() ? 'off ' : '') + (ds === now ? 'today ' : '') + (ds === sel_date ? 'sel' : ''), tabindex: 0, role: 'button', 'aria-label': fmtDate(d) + ', ' + evs.length + ' events',
        onclick: (function (s) { return function () { sel_date = s; render(); }; })(ds), onkeydown: (function (s) { return function (e) { if (e.key === 'Enter') { sel_date = s; render(); } }; })(ds) }, h('b', {}, String(d.getDate())), evs.slice(0, 3).map(function (e) { return h('span', {}, e.title); }))); }
    var t = h('input', { type: 'text', required: true }), dt = h('input', { type: 'date', value: sel_date, required: true }), tm = h('input', { type: 'time' }), et = h('input', { type: 'time' }), pl = h('input', { type: 'text' }),
      rp = sel([['', 'Does not repeat'], ['DAILY', 'Every day'], ['WEEKLY', 'Every week'], ['MONTHLY', 'Every month'], ['YEARLY', 'Every year']], '', function () {});
    var file = h('input', { type: 'file', accept: '.ics,text/calendar', hidden: true, onchange: function () { var f = file.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { var got = parseIcs(String(r.result)), have = {}; S.events.forEach(function (e) { if (e.uid) have[e.uid] = 1; }); var n = 0;
      got.forEach(function (e) { if (e.uid && have[e.uid]) return; e.id = uid(); S.events.push(e); n++; }); save(); alert(n + ' event' + (n === 1 ? '' : 's') + ' added' + (got.length - n ? ', ' + (got.length - n) + ' already there' : '') + '.'); render(); }; r.readAsText(f); } });
    var day = eventsOn(sel_date);
    return [h('div', { class: 'row sp', style: 'margin-bottom:14px' }, h('h1', {}, fmtDate(m, { month: 'long', year: 'numeric' })), h('div', { class: 'row' },
      h('button', { class: 'ghost', 'aria-label': 'Previous month', onclick: function () { cal_month = new Date(m.getFullYear(), m.getMonth() - 1, 1); render(); } }, 'Previous'),
      h('button', { class: 'ghost', onclick: function () { cal_month = new Date(); cal_month.setDate(1); sel_date = ymd(new Date()); render(); } }, 'Today'),
      h('button', { class: 'ghost', 'aria-label': 'Next month', onclick: function () { cal_month = new Date(m.getFullYear(), m.getMonth() + 1, 1); render(); } }, 'Next'))),
      h('div', { class: 'grid g2', style: 'grid-template-columns:minmax(0,2fr) minmax(280px,1fr)' }, h('div', { class: 'cal' }, cells),
        h('div', { class: 'grid' }, h('div', { class: 'card' }, h('h2', {}, fmtDate(parseYmd(sel_date), { weekday: 'long', day: 'numeric', month: 'long' })),
          day.length ? h('ul', { class: 'list' }, day.map(function (e) { return h('li', {}, h('span', { class: 'pill' }, e.time ? e.time + (e.endTime ? '-' + e.endTime : '') : 'All day'), h('div', { class: 'grow' }, h('div', {}, e.title), e.place ? h('div', { class: 'small mute' }, e.place) : null, e.rep ? h('div', { class: 'small mute' }, 'Repeats') : null),
            h('button', { class: 'quiet', 'aria-label': 'Delete ' + e.title, onclick: function () { S.events = S.events.filter(function (x) { return x !== e; }); save(); render(); } }, icon('trash'))); })) : h('p', { class: 'mute small' }, 'Nothing planned.')),
          h('form', { class: 'card', onsubmit: function (e) { e.preventDefault(); S.events.push({ id: uid(), title: t.value.trim(), date: dt.value, time: tm.value, endTime: et.value, place: pl.value.trim(), rep: rp.value ? { f: rp.value, n: 1 } : null }); save(); render(); } },
            h('h2', {}, 'Add an event'), field('What', t), h('div', { class: 'fields' }, field('Date', dt), field('Starts', tm), field('Ends', et)), field('Where', pl), h('div', { style: 'margin:10px 0' }, field('Repeat', rp)), h('button', { type: 'submit' }, icon('plus'), 'Add event')),
          h('div', { class: 'card panel' }, h('h2', {}, 'Bring your calendar'), h('p', { class: 'small mute' }, 'Import any .ics file from another calendar, or export yours. Read on this device only.'),
            h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: function () { file.click(); } }, icon('up'), 'Import .ics'), h('button', { class: 'ghost', onclick: function () { download('my-diary.ics', 'text/calendar', toIcs()); } }, icon('down'), 'Export .ics'), file))))];
  }

  function zoneView(zone, title, blurb) {
    return [h('h1', {}, title), h('p', { class: 'mute' }, blurb), h('div', { class: 'card' }, addItem(zone), itemList(zone))];
  }

  function healthView() {
    var ds = ymd(new Date()), T = target(), plan = planFor(ds), L = log(ds), p = S.profile.diet;
    var head = [h('h1', {}, 'Health and diet'), h('p', { class: 'mute' }, 'A plan that fits your needs, your food culture and your day. Swap anything you do not fancy.'),
      h('div', { class: 'note' }, 'General guidance, not medical advice. It does not replace a doctor or registered dietitian. If you are pregnant, breastfeeding, under 18, or live with a medical condition, ask your clinician before changing how you eat.'),
      T.restricted ? h('div', { class: 'note' }, 'Your plan is set to maintenance because of what you told us. Please agree any change with your clinician.') : null];
    var meals = SLOTS.map(function (s, si) { return h('div', { class: 'card meal' }, h('h3', {}, s[0]), h('ul', { class: 'list' }, plan[si].map(function (it, ii) {
      var f = foodById(it.id), k = si + ':' + ii; return h('li', { class: L.eaten[k] ? 'done' : '' }, h('input', { type: 'checkbox', checked: !!L.eaten[k], 'aria-label': 'Eaten: ' + f.name, onchange: function (e) { if (e.target.checked) L.eaten[k] = 1; else delete L.eaten[k]; save(); render(); } }),
        h('div', { class: 'grow' }, h('div', { class: 't' }, (it.n > 1 ? it.n + ' x ' : '') + f.name), h('div', { class: 'small mute' }, (it.n > 1 ? it.n + ' portions of ' : '') + f.qty + ' | ' + D.GROUPS[it.g].label)),
        h('button', { class: 'quiet', 'aria-label': 'Swap ' + f.name, title: 'Swap for something similar', onclick: function () { swap(ds, si, ii); render(); } }, icon('swap'))); }))); });
    var shop = {}; plan.forEach(function (sl) { sl.forEach(function (it) { var f = foodById(it.id); shop[f.name] = (shop[f.name] || 0) + it.n; }); });
    var summary = h('div', { class: 'card panel' }, h('h2', {}, 'Your guide'), h('div', { class: 'num' }, T.kcal + ' kcal'), h('p', { class: 'small mute' }, 'Based on ' + T.basis + '. Goal: ' + ({ maintain: 'keep steady', loss: 'gentle loss', gain: 'gentle gain' })[T.goal] + '.'),
      h('ul', { class: 'list' }, Object.keys(T.n).map(function (g) { return h('li', {}, h('div', { class: 'grow' }, D.GROUPS[g].label, h('div', { class: 'small mute' }, D.GROUPS[g].note)), h('b', {}, String(T.n[g]))); })),
      h('div', { class: 'row noprint' }, h('button', { class: 'ghost', onclick: function () { delete S.plans[ds]; save(); render(); } }, icon('swap'), 'New plan for today'), h('button', { class: 'ghost', onclick: function () { window.print(); } }, 'Print')));
    var quick = h('div', { class: 'card' }, h('h2', {}, 'Tune it to you'), h('div', { class: 'fields' }, field('Way of eating', sel(Object.keys(D.PATTERNS).map(function (k) { return [k, D.PATTERNS[k].label]; }), p.pattern, function (v) { p.pattern = v; S.plans = {}; save(); render(); }))),
      h('label', {}, 'Leave out'), h('div', { class: 'chips' }, Object.keys(D.AVOIDS).map(function (k) { return chip(D.AVOIDS[k], p.avoid.indexOf(k) >= 0, function (on) { p.avoid = p.avoid.filter(function (x) { return x !== k; }); if (on) p.avoid.push(k); S.plans = {}; save(); render(); }); })),
      h('p', { class: 'small mute', style: 'margin-top:12px' }, 'Add age, height, weight and activity in Settings for a closer energy guide.'));
    var checkin = h('div', { class: 'card' }, h('h2', {}, 'Today check-in'), h('div', { class: 'fields' }, field('Sleep (hours)', h('input', { type: 'number', min: 0, max: 24, step: .5, value: L.sleep || '', onchange: function (e) { L.sleep = e.target.value; save(); } })),
      field('Energy', sel([['', 'Choose'], [1, 'Low'], [2, 'Fair'], [3, 'Good'], [4, 'Great']], L.energy || '', function (v) { L.energy = v; save(); }))), h('p', { class: 'small mute' }, 'Deeper reflection lives in Life balance.'));
    var tips = h('div', { class: 'card' }, h('h2', {}, 'Everyday tips'), h('ul', { class: 'list' }, D.TIPS.map(function (t) { return h('li', {}, h('div', { class: 'grow small' }, t)); })));
    var list = h('div', { class: 'card' }, h('h2', {}, 'Shopping list for today'), h('ul', { class: 'list' }, Object.keys(shop).map(function (n) { return h('li', {}, h('div', { class: 'grow small' }, n), h('span', { class: 'small mute' }, shop[n] + (shop[n] > 1 ? ' portions' : ' portion'))); })));
    return head.concat([h('div', { class: 'grid g2' }, h('div', { class: 'grid', style: 'align-content:start' }, meals), h('div', { class: 'grid', style: 'align-content:start' }, summary, quick, checkin, list, tips))]);
  }

  function settingsView() {
    var P = S.profile, p = P.diet, imp = P.units === 'imperial', name = h('input', { type: 'text', value: P.name }), reg = h('input', { type: 'text', value: P.region, placeholder: 'For example: Dubai, UAE' });
    var num = function (k, lab) { return field(lab, h('input', { type: 'number', min: 0, value: p[k], onchange: function (e) { p[k] = e.target.value; S.plans = {}; save(); } })); };
    var file = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: function () { var f = file.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { var o = JSON.parse(String(r.result)); if (o.v !== 1) throw 0; S = Object.assign(blank(), o); save(); alert('Restored.'); render(); } catch (e) { alert('That file is not a My Diary backup.'); } }; r.readAsText(f); } });
    return [h('h1', {}, 'Settings'), h('div', { class: 'grid g2' },
      h('div', { class: 'card' }, h('h2', {}, 'Your zone'), h('p', { class: 'small mute' }, 'Your region and time zone shape dates, week start and units.'), h('div', { class: 'fields' }, field('Name', name), field('Region or city', reg),
        field('Time zone', h('input', { type: 'text', value: P.tz, onchange: function (e) { P.tz = e.target.value; save(); } })),
        field('Week starts on', sel([[1, 'Monday'], [0, 'Sunday'], [6, 'Saturday']], P.weekStart, function (v) { P.weekStart = +v; save(); })), field('Units', sel([['metric', 'Metric (kg, cm)'], ['imperial', 'Imperial (lb, in)']], P.units, function (v) { P.units = v; save(); render(); })),
        field('Appearance', sel([['auto', 'Match my device'], ['light', 'Light'], ['dark', 'Dark']], P.theme, function (v) { P.theme = v; save(); render(); }))),
        h('button', { onclick: function () { P.name = name.value.trim(); P.region = reg.value.trim(); save(); render(); } }, 'Save')),
      h('div', { class: 'card' }, h('h2', {}, 'About you, for the diet planner'), h('p', { class: 'small mute' }, 'All optional. Kept on this device. Leave blank for a typical-adult guide.'),
        h('div', { class: 'fields' }, num('age', 'Age'), field('Sex', sel([['na', 'Prefer not to say'], ['f', 'Female'], ['m', 'Male']], p.sex, function (v) { p.sex = v; S.plans = {}; save(); })), num('height', imp ? 'Height (inches)' : 'Height (cm)'), num('weight', imp ? 'Weight (lb)' : 'Weight (kg)'),
          field('Activity', sel([[1.2, 'Mostly sitting'], [1.375, 'Light activity'], [1.55, 'Active'], [1.725, 'Very active']], p.activity, function (v) { p.activity = +v; S.plans = {}; save(); })),
          field('Aim', sel([['maintain', 'Keep steady'], ['loss', 'Gentle loss'], ['gain', 'Gentle gain']], p.goal, function (v) { p.goal = v; S.plans = {}; save(); }))),
        chip('I am pregnant, breastfeeding, or have a medical condition that affects food', p.care, function (on) { p.care = on; S.plans = {}; save(); render(); })),
      h('div', { class: 'card panel' }, h('h2', {}, 'Your data'), h('p', { class: 'small mute' }, 'It is yours. Download a backup, bring it to another device, or erase everything.'),
        h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: function () { download('my-diary-backup.json', 'application/json', JSON.stringify(S)); } }, icon('down'), 'Download backup'), h('button', { class: 'ghost', onclick: function () { file.click(); } }, icon('up'), 'Restore backup'),
          h('button', { class: 'ghost', onclick: function () { if (confirm('Erase everything in My Diary on this device? This cannot be undone.')) { try { localStorage.removeItem(KEY); } catch (e) {} mem = null; S = blank(); location.hash = ''; render(); } } }, icon('trash'), 'Erase everything'), file)))];
  }

  /* ---------- router ---------- */
  function render() {
    if (!S.consent) return consentView();
    var v = (location.hash || '#today').slice(1); if (!VIEWS.some(function (x) { return x[0] === v; })) v = 'today';
    var body = { today: todayView, calendar: calendarView, health: healthView, settings: settingsView,
      work: function () { return zoneView('work', 'Work', 'Tasks, follow-ups and deadlines. Put a date on anything that must happen on a day.'); },
      play: function () { return zoneView('play', 'Play', 'Hobbies, sport, travel, friends and the things that fill your cup.'); },
      life: function () { return zoneView('life', 'Life', 'Home, family, money matters and personal life.'); } }[v]();
    shell(v, body); window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);
  window.__diary = { parseIcs: parseIcs, target: target, makePlan: makePlan, state: function () { return S; } };
  render();
})();
