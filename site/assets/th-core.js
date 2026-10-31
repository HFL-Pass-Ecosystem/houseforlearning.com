/* House for Learning time and date hub: core (helpers, places, astronomy maths, holidays, menus, home).
   Runs in the visitor's browser. Nothing is sent to us. The only outside calls are two free, keyless public services
   (weather and place search) made straight from the visitor's browser, and only when a weather or place tool is used. */
window.TH = (function () {
  'use strict';
  var d = document, T = { panels: {}, ticks: [], RAD: Math.PI / 180 };

  /* ---------- small helpers ---------- */
  function add(e, k) {
    if (k == null || k === false) return;
    if (Array.isArray(k)) k.forEach(function (x) { add(e, x); });
    else e.appendChild(typeof k === 'object' ? k : d.createTextNode(String(k)));
  }
  function el(tag, props, kids) {
    var e = d.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    add(e, kids);
    return e;
  }
  function svg(tag, props, kids) {
    var e = d.createElementNS('http://www.w3.org/2000/svg', tag);
    if (props) Object.keys(props).forEach(function (k) { e.setAttribute(k, props[k]); });
    add(e, kids);
    return e;
  }
  function pad(n, w) { return String(Math.abs(n)).padStart(w || 2, '0'); }
  var store = {
    get: function (k, def) { try { var v = localStorage.getItem('th-' + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem('th-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function field(label, input, hint) { return el('div', { class: 'field' }, [el('label', null, label), input, hint ? el('span', { class: 'th-hint' }, hint) : null]); }
  function btn(text, fn, cls) { return el('button', { type: 'button', class: 'btn btn-sm ' + (cls || ''), onclick: fn }, text); }
  function sel(options, value, onchange) {
    var s = el('select');
    options.forEach(function (o) { var v = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; var op = el('option', { value: v }, t); if (String(v) === String(value)) op.selected = true; s.appendChild(op); });
    if (onchange) s.addEventListener('change', onchange);
    return s;
  }
  function inp(type, value, extra) { var i = el('input', Object.assign({ type: type }, extra || {})); if (value != null) i.value = value; return i; }
  function table(head, rows, cls) {
    var t = el('table', { class: 'data th-table ' + (cls || '') });
    t.appendChild(el('thead', null, el('tr', null, head.map(function (h) { return el('th', { scope: 'col' }, h); }))));
    var tb = el('tbody');
    rows.forEach(function (r) { tb.appendChild(el('tr', null, r.map(function (c, i) { return el(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : { 'data-label': head[i] }, c); }))); });
    t.appendChild(tb);
    return el('div', { class: 'th-scroll' }, t);
  }
  function copy(text, note) {
    function done(ok) { if (note) note.textContent = ok ? 'Copied.' : 'Select the text and copy it by hand.'; }
    try { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); } catch (e) { done(false); }
  }
  function download(name, type, text) {
    var a = el('a', { href: URL.createObjectURL(new Blob([text], { type: type })), download: name });
    d.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- time zones ---------- */
  var dtfs = {};
  function dtf(tz) {
    return dtfs[tz] || (dtfs[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }));
  }
  function parts(date, tz) {
    var o = {};
    dtf(tz).formatToParts(date).forEach(function (p) { if (p.type !== 'literal') o[p.type] = +p.value; });
    if (o.hour === 24) o.hour = 0;
    return o;
  }
  function offMin(tz, date) {
    var p = parts(date, tz);
    return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  }
  function offLabel(m) { var a = Math.abs(m); return 'UTC' + (m < 0 ? '-' : '+') + Math.floor(a / 60) + (a % 60 ? ':' + pad(a % 60) : ''); }
  function zoned(y, mo, da, h, mi, tz) {
    var g = Date.UTC(y, mo - 1, da, h, mi, 0), u = g - offMin(tz, new Date(g)) * 60000, o2 = offMin(tz, new Date(u));
    return new Date(g - o2 * 60000);
  }
  function fmt(date, tz, o) { try { return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: tz }, o)).format(date); } catch (e) { return ''; } }
  function hm(date, tz, sec) { var p = parts(date, tz); return pad(p.hour) + ':' + pad(p.minute) + (sec ? ':' + pad(p.second) : ''); }
  function dlong(date, tz) { return fmt(date, tz, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }
  function ymd(date, tz) { var p = parts(date, tz); return { y: p.year, m: p.month, d: p.day }; }
  function iso(y, m, da) { return y + '-' + pad(m) + '-' + pad(da); }
  function isoOf(date, tz) { var p = ymd(date, tz); return iso(p.y, p.m, p.d); }
  function daysIn(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function wday(y, m, da) { return new Date(Date.UTC(y, m - 1, da)).getUTCDay(); }
  function dayNo(y, m, da) { return Date.UTC(y, m - 1, da) / 864e5; }
  function fromDayNo(n) { var x = new Date(n * 864e5); return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() }; }
  function parseISO(s) { var p = String(s || '').split('-'); return p.length === 3 && +p[0] ? { y: +p[0], m: +p[1], d: +p[2] } : null; }
  function isoWeek(y, m, da) {
    var n = dayNo(y, m, da), wd = (wday(y, m, da) + 6) % 7, th = n - wd + 3, ty = fromDayNo(th).y, jan4 = dayNo(ty, 1, 4);
    return { week: 1 + Math.floor((th - (jan4 - ((wday(ty, 1, 4) + 6) % 7) + 3)) / 7), year: ty };
  }
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---------- places ---------- */
  var CITY_TXT = 'Dubai|United Arab Emirates|Asia/Dubai|25.2048|55.2708|AE;Abu Dhabi|United Arab Emirates|Asia/Dubai|24.4539|54.3773|AE;Riyadh|Saudi Arabia|Asia/Riyadh|24.7136|46.6753|SA;Doha|Qatar|Asia/Qatar|25.2854|51.531|QA;Kuwait City|Kuwait|Asia/Kuwait|29.3759|47.9774|KW;Muscat|Oman|Asia/Muscat|23.588|58.3829|OM;Manama|Bahrain|Asia/Bahrain|26.2285|50.586|BH;Baghdad|Iraq|Asia/Baghdad|33.3152|44.3661|IQ;Tehran|Iran|Asia/Tehran|35.6892|51.389|IR;Amman|Jordan|Asia/Amman|31.9454|35.9284|JO;Mumbai|India|Asia/Kolkata|19.076|72.8777|IN;Delhi|India|Asia/Kolkata|28.6139|77.209|IN;Bengaluru|India|Asia/Kolkata|12.9716|77.5946|IN;Chennai|India|Asia/Kolkata|13.0827|80.2707|IN;Kolkata|India|Asia/Kolkata|22.5726|88.3639|IN;Hyderabad|India|Asia/Kolkata|17.385|78.4867|IN;Karachi|Pakistan|Asia/Karachi|24.8607|67.0011|PK;Dhaka|Bangladesh|Asia/Dhaka|23.8103|90.4125|BD;Colombo|Sri Lanka|Asia/Colombo|6.9271|79.8612|LK;Kathmandu|Nepal|Asia/Kathmandu|27.7172|85.324|NP;Tashkent|Uzbekistan|Asia/Tashkent|41.2995|69.2401|UZ;Singapore|Singapore|Asia/Singapore|1.3521|103.8198|SG;Kuala Lumpur|Malaysia|Asia/Kuala_Lumpur|3.139|101.6869|MY;Jakarta|Indonesia|Asia/Jakarta|-6.2088|106.8456|ID;Bangkok|Thailand|Asia/Bangkok|13.7563|100.5018|TH;Hong Kong|Hong Kong|Asia/Hong_Kong|22.3193|114.1694|HK;Shanghai|China|Asia/Shanghai|31.2304|121.4737|CN;Beijing|China|Asia/Shanghai|39.9042|116.4074|CN;Tokyo|Japan|Asia/Tokyo|35.6762|139.6503|JP;Seoul|South Korea|Asia/Seoul|37.5665|126.978|KR;Manila|Philippines|Asia/Manila|14.5995|120.9842|PH;Sydney|Australia|Australia/Sydney|-33.8688|151.2093|AU;Melbourne|Australia|Australia/Melbourne|-37.8136|144.9631|AU;Perth|Australia|Australia/Perth|-31.9505|115.8605|AU;Auckland|New Zealand|Pacific/Auckland|-36.8485|174.7633|NZ;London|United Kingdom|Europe/London|51.5072|-0.1276|GB;Dublin|Ireland|Europe/Dublin|53.3498|-6.2603|IE;Paris|France|Europe/Paris|48.8566|2.3522|FR;Berlin|Germany|Europe/Berlin|52.52|13.405|DE;Madrid|Spain|Europe/Madrid|40.4168|-3.7038|ES;Rome|Italy|Europe/Rome|41.9028|12.4964|IT;Amsterdam|Netherlands|Europe/Amsterdam|52.3676|4.9041|NL;Zurich|Switzerland|Europe/Zurich|47.3769|8.5417|CH;Stockholm|Sweden|Europe/Stockholm|59.3293|18.0686|SE;Athens|Greece|Europe/Athens|37.9838|23.7275|GR;Istanbul|Turkey|Europe/Istanbul|41.0082|28.9784|TR;Moscow|Russia|Europe/Moscow|55.7558|37.6173|RU;Reykjavik|Iceland|Atlantic/Reykjavik|64.1466|-21.9426|IS;Cairo|Egypt|Africa/Cairo|30.0444|31.2357|EG;Nairobi|Kenya|Africa/Nairobi|-1.2921|36.8219|KE;Lagos|Nigeria|Africa/Lagos|6.5244|3.3792|NG;Accra|Ghana|Africa/Accra|5.6037|-0.187|GH;Addis Ababa|Ethiopia|Africa/Addis_Ababa|9.03|38.74|ET;Johannesburg|South Africa|Africa/Johannesburg|-26.2041|28.0473|ZA;Casablanca|Morocco|Africa/Casablanca|33.5731|-7.5898|MA;New York|United States|America/New_York|40.7128|-74.006|US;Chicago|United States|America/Chicago|41.8781|-87.6298|US;Denver|United States|America/Denver|39.7392|-104.9903|US;Los Angeles|United States|America/Los_Angeles|34.0522|-118.2437|US;Anchorage|United States|America/Anchorage|61.2181|-149.9003|US;Honolulu|United States|Pacific/Honolulu|21.3069|-157.8583|US;Toronto|Canada|America/Toronto|43.6532|-79.3832|CA;Vancouver|Canada|America/Vancouver|49.2827|-123.1207|CA;Mexico City|Mexico|America/Mexico_City|19.4326|-99.1332|MX;Bogota|Colombia|America/Bogota|4.711|-74.0721|CO;Lima|Peru|America/Lima|-12.0464|-77.0428|PE;Santiago|Chile|America/Santiago|-33.4489|-70.6693|CL;Buenos Aires|Argentina|America/Argentina/Buenos_Aires|-34.6037|-58.3816|AR;Sao Paulo|Brazil|America/Sao_Paulo|-23.5505|-46.6333|BR';
  var CITIES = CITY_TXT.split(';').map(function (s) { var a = s.split('|'); return { name: a[0], country: a[1], tz: a[2], lat: +a[3], lon: +a[4], cc: a[5] }; });
  var UTC = { name: 'UTC', country: 'Coordinated Universal Time', tz: 'UTC', lat: null, lon: null, cc: '' };
  function label(p) { return p.country && p.country !== p.name ? p.name + ', ' + p.country : p.name; }
  function findLocal(q) {
    q = String(q || '').trim().toLowerCase();
    if (!q) return null;
    if (q === 'utc' || q === 'gmt') return UTC;
    var name = q.split(',')[0].trim(), i, c;
    for (i = 0; i < CITIES.length; i++) if (CITIES[i].name.toLowerCase() === name) return CITIES[i];
    for (i = 0; i < CITIES.length; i++) if (CITIES[i].name.toLowerCase().indexOf(name) === 0) return CITIES[i];
    for (i = 0; i < CITIES.length; i++) { c = CITIES[i]; if (c.country.toLowerCase() === name) return c; }
    return null;
  }
  function geocode(q) {
    return fetch('https://geocoding-api.open-meteo.com/v1/search?count=5&language=en&format=json&name=' + encodeURIComponent(q.split(',')[0].trim()))
      .then(function (r) { return r.json(); })
      .then(function (j) { return (j.results || []).map(function (r) { return { name: r.name, country: [r.admin1, r.country].filter(Boolean).join(', '), tz: r.timezone || 'UTC', lat: r.latitude, lon: r.longitude, cc: r.country_code || '' }; }); })
      .catch(function () { return []; });
  }
  function lookup(q) {
    var l = findLocal(q);
    if (l) return Promise.resolve([l]);
    return geocode(q);
  }
  function homePlace() {
    var h = store.get('home');
    if (h && h.tz) return h;
    return CITIES[0]; /* Dubai until the visitor sets a home place */
  }
  var dl;
  function datalist() {
    if (dl) return dl.id;
    dl = el('datalist', { id: 'th-cities' });
    CITIES.forEach(function (c) { dl.appendChild(el('option', { value: label(c) })); });
    dl.appendChild(el('option', { value: 'UTC' }));
    d.body.appendChild(dl);
    return dl.id;
  }
  /* A text box that turns a place name into a place; calls onPick(place). */
  function placeBox(initial, onPick, o) {
    o = o || {};
    var cur = initial, input = el('input', { type: 'text', list: datalist(), autocomplete: 'off', 'aria-label': o.label || 'Place', placeholder: o.placeholder || 'Search for a city or place', value: initial ? label(initial) : '' });
    var note = el('p', { class: 'th-hint', role: 'status', 'aria-live': 'polite' });
    function pick(p) { cur = p; input.value = label(p); note.textContent = ''; onPick && onPick(p); }
    function go() {
      var q = input.value;
      if (!q.trim()) return;
      note.textContent = 'Searching…';
      lookup(q).then(function (r) {
        if (!r.length) { note.textContent = 'Place not found. Try a bigger city nearby, or check your internet connection.'; return; }
        pick(r[0]);
        if (r.length > 1) note.textContent = 'Showing ' + label(r[0]) + '. Other matches: ' + r.slice(1).map(label).join('; ');
      });
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    input.addEventListener('change', function () { var l = findLocal(input.value); if (l && label(l).toLowerCase() === input.value.trim().toLowerCase()) pick(l); });
    var row = el('div', { class: 'th-row' }, [input, btn('Search', go)]);
    if (o.geo !== false && navigator.geolocation) row.appendChild(btn('My location', function () {
      note.textContent = 'Asking your device…';
      navigator.geolocation.getCurrentPosition(function (pos) {
        var tz = 'UTC'; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
        pick({ name: 'My location', country: '', tz: tz, lat: pos.coords.latitude, lon: pos.coords.longitude, cc: '' });
      }, function () { note.textContent = 'Your device did not share its location. Type a place instead.'; }, { timeout: 10000 });
    }, 'btn-ghost'));
    var box = el('div', { class: 'th-place' }, [row, note]);
    box.get = function () { return cur; };
    box.set = pick;
    return box;
  }
  function needLatLon(p, box) {
    if (p && p.lat != null) return true;
    add(box, el('p', { class: 'th-warn' }, 'This place has no map position. Search for a city instead of a time zone.'));
    return false;
  }

  /* ---------- astronomy (low-precision formulas, good for minutes) ---------- */
  var RAD = T.RAD;
  function jd(date) { return date.getTime() / 864e5 + 2440587.5; }
  function norm(x, m) { x = x % m; return x < 0 ? x + m : x; }
  function eps(n) { return (23.439291 - 0.0000004 * n) * RAD; }
  function sunPos(date) {
    var n = jd(date) - 2451545, L = norm(280.46 + 0.9856474 * n, 360), g = norm(357.528 + 0.9856003 * n, 360) * RAD;
    var lam = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g), l = lam * RAD, e = eps(n);
    return { lon: norm(lam, 360), ra: Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l)), dec: Math.asin(Math.sin(e) * Math.sin(l)) };
  }
  function moonPos(date) {
    var n = jd(date) - 2451545, t = n / 36525, s = function (x) { return Math.sin(norm(x, 360) * RAD); };
    var Lp = 218.3164477 + 481267.88123421 * t, D = 297.8501921 + 445267.1114034 * t, M = 357.5291092 + 35999.0502909 * t, Mp = 134.9633964 + 477198.8675055 * t, F = 93.272095 + 483202.0175233 * t;
    var lon = Lp + 6.288774 * s(Mp) + 1.274027 * s(2 * D - Mp) + 0.658314 * s(2 * D) + 0.213618 * s(2 * Mp) - 0.185116 * s(M) - 0.114332 * s(2 * F) + 0.058793 * s(2 * D - 2 * Mp) + 0.057066 * s(2 * D - M - Mp) + 0.053322 * s(2 * D + Mp) + 0.045758 * s(2 * D - M) - 0.040923 * s(M - Mp) - 0.03472 * s(D) - 0.030383 * s(M + Mp);
    var lat = 5.128122 * s(F) + 0.280602 * s(Mp + F) + 0.277693 * s(Mp - F) + 0.173237 * s(2 * D - F) + 0.055413 * s(2 * D - Mp + F) + 0.046271 * s(2 * D - Mp - F) + 0.032573 * s(2 * D + F);
    var l = lon * RAD, b = lat * RAD, e = eps(n);
    return { lon: norm(lon, 360), ra: Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l)), dec: Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l)) };
  }
  var ELEM = { /* a, e, I, L, long.peri, long.node at J2000 and per century (JPL approximate elements) */
    Mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.2503235, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
    Venus: [0.72333566, 0.0000039, 0.00677672, -0.00004107, 3.39467605, -0.0007889, 181.9790995, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
    Earth: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0],
    Mars: [1.52371034, 0.00001847, 0.0933941, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
    Jupiter: [5.202887, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
    Saturn: [9.53667594, -0.0012506, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794]
  };
  function helio(name, t) {
    var q = ELEM[name], a = q[0] + q[1] * t, e = q[2] + q[3] * t, I = (q[4] + q[5] * t) * RAD, L = q[6] + q[7] * t, wb = q[8] + q[9] * t, Om = (q[10] + q[11] * t) * RAD;
    var w = wb * RAD - Om, M = norm(L - wb, 360); if (M > 180) M -= 360; M *= RAD;
    var E = M, i; for (i = 0; i < 8; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    var xv = a * (Math.cos(E) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
    var cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I);
    return [(cw * cO - sw * sO * cI) * xv + (-sw * cO - cw * sO * cI) * yv, (cw * sO + sw * cO * cI) * xv + (-sw * sO + cw * cO * cI) * yv, (sw * sI) * xv + (cw * sI) * yv];
  }
  function planetPos(name, date) {
    var t = (jd(date) - 2451545) / 36525, p = helio(name, t), e = helio('Earth', t), g = [p[0] - e[0], p[1] - e[1], p[2] - e[2]], ep = 23.43928 * RAD;
    var ye = Math.cos(ep) * g[1] - Math.sin(ep) * g[2], ze = Math.sin(ep) * g[1] + Math.cos(ep) * g[2];
    return { ra: Math.atan2(ye, g[0]), dec: Math.atan2(ze, Math.sqrt(g[0] * g[0] + ye * ye)), dist: Math.sqrt(g[0] * g[0] + g[1] * g[1] + g[2] * g[2]) };
  }
  function altaz(pos, date, lat, lon) {
    var th = (norm(280.46061837 + 360.98564736629 * (jd(date) - 2451545), 360) + lon) * RAD, H = th - pos.ra, ph = lat * RAD;
    var alt = Math.asin(Math.sin(ph) * Math.sin(pos.dec) + Math.cos(ph) * Math.cos(pos.dec) * Math.cos(H));
    var az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(ph) - Math.tan(pos.dec) * Math.cos(ph)) / RAD + 180;
    return { alt: alt / RAD, az: norm(az, 360) };
  }
  var BODY = {
    Sun: function (dt, la, lo) { return altaz(sunPos(dt), dt, la, lo).alt; },
    Moon: function (dt, la, lo) { return altaz(moonPos(dt), dt, la, lo).alt; }
  };
  /* Rise, set and best-height times of a body on a local day. h0 = altitude (degrees) that counts as "up". */
  function riseSet(body, lat, lon, tz, y, m, da, h0) {
    var t0 = zoned(y, m, da, 0, 0, tz).getTime(), t1 = zoned(y, m, da + 1, 0, 0, tz).getTime(), step = 600000, out = { rises: [], sets: [], noon: null, max: -99 }, prev = null, pt = null, t, a;
    for (t = t0; t <= t1; t += step) {
      a = BODY[body](new Date(t), lat, lon);
      if (a > out.max) { out.max = a; out.noon = new Date(t); }
      if (prev != null) {
        if (prev < h0 && a >= h0) out.rises.push(new Date(pt + step * (h0 - prev) / (a - prev)));
        if (prev >= h0 && a < h0) out.sets.push(new Date(pt + step * (prev - h0) / (prev - a)));
      }
      prev = a; pt = t;
    }
    out.up = out.max >= h0; out.allDay = out.rises.length === 0 && out.sets.length === 0 && out.max >= h0;
    return out;
  }
  function moonPhase(date) {
    var e = norm(moonPos(date).lon - sunPos(date).lon, 360);
    return { elong: e, lit: (1 - Math.cos(e * RAD)) / 2, name: e < 5 || e >= 355 ? 'New Moon' : e < 85 ? 'Waxing Crescent' : e < 95 ? 'First Quarter' : e < 175 ? 'Waxing Gibbous' : e < 185 ? 'Full Moon' : e < 265 ? 'Waning Gibbous' : e < 275 ? 'Last Quarter' : 'Waning Crescent' };
  }
  /* Times when the Sun-Moon angle (or the Sun's longitude) reaches a target; scans forward from "from". */
  function crossings(fn, targets, from, days, stepH) {
    var out = [], step = stepH * 3600000, t = from.getTime(), end = t + days * 864e5, prev = {}, k;
    targets.forEach(function (g) { prev[g] = norm(fn(new Date(t)) - g + 180, 360) - 180; });
    for (t += step; t <= end; t += step) targets.forEach(function (g) {
      var v = norm(fn(new Date(t)) - g + 180, 360) - 180;
      if (prev[g] < 0 && v >= 0 && v - prev[g] < 90) {
        var lo = t - step, hi = t, mid, i;
        for (i = 0; i < 24; i++) { mid = (lo + hi) / 2; if (norm(fn(new Date(mid)) - g + 180, 360) - 180 < 0) lo = mid; else hi = mid; }
        out.push({ at: new Date(hi), target: g });
      }
      prev[g] = v;
    });
    return out.sort(function (a, b) { return a.at - b.at; });
  }
  function moonDrawing(elong, size) {
    var r = size / 2, e = elong * RAD, k = Math.cos(e), waxing = elong < 180, rx = Math.abs(k) * r, c = svg('svg', { viewBox: '0 0 ' + size + ' ' + size, width: size, height: size, role: 'img', 'aria-label': 'Moon phase drawing' });
    c.appendChild(svg('circle', { cx: r, cy: r, r: r - 1, fill: '#1d3550' }));
    var path = 'M' + r + ' 1 A' + (r - 1) + ' ' + (r - 1) + ' 0 0 1 ' + r + ' ' + (size - 1) + ' A' + rx + ' ' + (r - 1) + ' 0 0 ' + (k > 0 ? 0 : 1) + ' ' + r + ' 1 Z';
    var lit = svg('path', { d: path, fill: '#fffdf7' });
    if (!waxing) lit.setAttribute('transform', 'translate(' + size + ' 0) scale(-1 1)');
    c.appendChild(lit);
    c.appendChild(svg('circle', { cx: r, cy: r, r: r - 1, fill: 'none', stroke: '#d8d1bd', 'stroke-width': 1.5 }));
    return c;
  }

  /* ---------- holidays ---------- */
  var COUNTRIES = [['AE', 'United Arab Emirates', 1], ['IN', 'India', 0], ['SA', 'Saudi Arabia', 0], ['QA', 'Qatar', 0], ['KW', 'Kuwait', 0], ['OM', 'Oman', 0], ['BH', 'Bahrain', 0], ['GB', 'United Kingdom', 1], ['IE', 'Ireland', 1], ['US', 'United States', 0], ['CA', 'Canada', 0], ['AU', 'Australia', 1], ['NZ', 'New Zealand', 1], ['SG', 'Singapore', 1], ['MY', 'Malaysia', 1], ['ID', 'Indonesia', 0], ['PH', 'Philippines', 0], ['JP', 'Japan', 0], ['KR', 'South Korea', 0], ['CN', 'China', 1], ['PK', 'Pakistan', 1], ['BD', 'Bangladesh', 0], ['LK', 'Sri Lanka', 1], ['NP', 'Nepal', 0], ['DE', 'Germany', 1], ['FR', 'France', 1], ['ES', 'Spain', 1], ['IT', 'Italy', 1], ['NL', 'Netherlands', 1], ['CH', 'Switzerland', 1], ['SE', 'Sweden', 1], ['TR', 'Turkey', 1], ['EG', 'Egypt', 6], ['ZA', 'South Africa', 1], ['NG', 'Nigeria', 1], ['KE', 'Kenya', 1], ['BR', 'Brazil', 0], ['MX', 'Mexico', 0], ['AR', 'Argentina', 0]];
  function countryName(cc) { for (var i = 0; i < COUNTRIES.length; i++) if (COUNTRIES[i][0] === cc) return COUNTRIES[i][1]; return cc; }
  /* Islamic dates from the Umm al-Qura calendar built into the browser: expected dates, the official moon-sighting announcement can differ by a day. */
  var hijriF;
  function hijri(y, m, da) {
    try { hijriF = hijriF || new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) { return null; }
    var o = {}; hijriF.formatToParts(new Date(Date.UTC(y, m - 1, da, 12))).forEach(function (p) { if (p.type !== 'literal') o[p.type] = +p.value; });
    return o;
  }
  function islamic(y) {
    var out = [], n = dayNo(y, 1, 1), end = dayNo(y, 12, 31), last = null, i, h, g;
    for (i = n - 2; i <= end + 2; i++) {
      g = fromDayNo(i); h = hijri(g.y, g.m, g.d); if (!h) return out;
      if (g.y !== y) continue;
      var key = h.month * 100 + h.day;
      if (key === 101) out.push([iso(g.y, g.m, g.d), 'Islamic New Year']);
      if (key === 1003 - 2 && false) out.push();
      if (key === 1001) out.push([iso(g.y, g.m, g.d), 'Eid al-Fitr (day 1)'], [iso(fromDayNo(i + 1).y, fromDayNo(i + 1).m, fromDayNo(i + 1).d), 'Eid al-Fitr (day 2)'], [iso(fromDayNo(i + 2).y, fromDayNo(i + 2).m, fromDayNo(i + 2).d), 'Eid al-Fitr (day 3)']);
      if (key === 1209) out.push([iso(g.y, g.m, g.d), 'Arafat Day']);
      if (key === 1210) out.push([iso(g.y, g.m, g.d), 'Eid al-Adha (day 1)'], [iso(fromDayNo(i + 1).y, fromDayNo(i + 1).m, fromDayNo(i + 1).d), 'Eid al-Adha (day 2)'], [iso(fromDayNo(i + 2).y, fromDayNo(i + 2).m, fromDayNo(i + 2).d), 'Eid al-Adha (day 3)']);
      if (key === 901) out.push([iso(g.y, g.m, g.d), 'Ramadan begins']);
    }
    return out;
  }
  var FIXED = {
    AE: [[1, 1, "New Year's Day"], [12, 1, 'Commemoration Day'], [12, 2, 'UAE National Day'], [12, 3, 'UAE National Day holiday']],
    IN: [[1, 26, 'Republic Day'], [8, 15, 'Independence Day'], [10, 2, 'Gandhi Jayanti'], [12, 25, 'Christmas Day']],
    SA: [[9, 23, 'Saudi National Day']], QA: [[12, 18, 'Qatar National Day']], KW: [[2, 25, 'Kuwait National Day']], OM: [[11, 18, 'Oman National Day']], BH: [[12, 16, 'Bahrain National Day']]
  };
  var NOTE = { AE: 'New Year, National Day, Eid and the Islamic New Year. Islamic dates are expected dates and are confirmed by the official announcement.', IN: 'Fixed-date national days only. Festival dates change every year, so please add yours in My events.' };
  var hcache = {};
  /* Returns Promise of [{date:'YYYY-MM-DD', name}] for a country and year. */
  function holidays(cc, y) {
    var k = cc + y;
    if (hcache[k]) return hcache[k];
    var base = (FIXED[cc] || []).map(function (a) { return [iso(y, a[0], a[1]), a[2]]; });
    if (cc === 'AE' || cc === 'SA' || cc === 'QA' || cc === 'KW' || cc === 'OM' || cc === 'BH') base = base.concat(islamic(y));
    var p;
    if (FIXED[cc] && cc !== 'US') p = Promise.resolve(base.map(function (a) { return { date: a[0], name: a[1] }; }));
    else p = fetch('https://date.nager.at/api/v3/PublicHolidays/' + y + '/' + cc).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { return j.map(function (h) { return { date: h.date, name: h.name }; }); }).catch(function () { return null; });
    hcache[k] = p.then(function (r) { return r ? r.sort(function (a, b) { return a.date < b.date ? -1 : 1; }) : []; });
    return hcache[k];
  }

  /* ---------- menus and routes ---------- */
  var MENU = [
    ['news', 'News', [['news-astronomy', 'Astronomy news'], ['news-timezones', 'Time zone news'], ['news-calendar', 'Calendar and holiday news'], ['news-newsletter', 'Newsletter'], ['news-live', 'Live events']]],
    ['clock', 'World Clock', [['clock-main', 'Main world clock'], ['clock-extended', 'Extended world clock'], ['clock-personal', 'Personal world clock'], ['clock-site', 'Clock for your site'], ['clock-utc', 'UTC time']]],
    ['tz', 'Time Zones', [['tz-map', 'Time zone map'], ['tz-converter', 'Time zone converter'], ['tz-planner', 'Meeting planner'], ['tz-announcer', 'Event time announcer'], ['tz-dst', 'Clock changes worldwide'], ['tz-more', 'More time zone tools']]],
    ['cal', 'Calendar', [['cal-2026', 'Calendar 2026'], ['cal-2027', 'Calendar 2027'], ['cal-month', 'Monthly calendar'], ['cal-print', 'Printable calendar (PDF)'], ['cal-events', 'Add your own events'], ['cal-creator', 'Calendar creator'], ['cal-holidays', 'Holidays worldwide'], ['cal-history', 'On this day in history'], ['cal-fun', 'Fun holidays'], ['cal-months', 'Months of the year'], ['cal-days', 'Days of the week'], ['cal-leap', 'About leap years'], ['news-calendar', 'Calendar and holiday news']]],
    ['wx', 'Weather', [['wx-world', 'Worldwide'], ['wx-local', 'Local weather'], ['wx-14', '2-week forecast'], ['wx-hourly', 'Hour by hour'], ['wx-past', 'Past week'], ['wx-climate', 'Climate']]],
    ['sky', 'Sun, Moon and Space', [['sky-sun', 'Sunrise and sunset'], ['sky-phases', 'Moon phases'], ['sky-moonrise', 'Moonrise and moonset'], ['sky-eclipses', 'Eclipses'], ['sky-tonight', 'The sky tonight']]],
    ['timers', 'Timers', [['tm-stopwatch', 'Stopwatch'], ['tm-timer', 'Timer with alarm'], ['tm-countdown', 'Countdown to any date'], ['tm-halloween', 'Halloween countdown'], ['tm-thanksgiving', 'Thanksgiving countdown'], ['tm-newyear', 'New Year countdown'], ['tm-eid-fitr', 'Eid al-Fitr countdown'], ['tm-eid-adha', 'Eid al-Adha countdown'], ['tm-national', 'UAE National Day countdown'], ['tm-site', 'Countdown for your site']]],
    ['calc', 'Calculators', [['calc-d2d', 'Date to date'], ['calc-bd2d', 'Business days between dates'], ['calc-add', 'Date calculator (add or take away)'], ['calc-bdate', 'Business date'], ['calc-weekday', 'Weekday calculator'], ['calc-week', 'Week number'], ['calc-roman', 'Roman numerals'], ['calc-age', 'Alternative age calculator'], ['calc-pattern', 'Date pattern calculator'], ['calc-distance', 'Distance calculator']]]
  ];
  T.MENU = MENU;
  var LABEL = {};
  MENU.forEach(function (m) { m[2].forEach(function (i) { if (!LABEL[i[0]]) LABEL[i[0]] = { label: i[1], menu: m[1] }; }); });
  T.reg = function (id, fn, desc) { T.panels[id] = { fn: fn, desc: desc || '' }; };
  T.tick = function (fn) { T.ticks.push(fn); fn(); };
  var app, stage, cleanup = [];
  T.onLeave = function (fn) { cleanup.push(fn); };

  function menuBar() {
    var nav = el('nav', { class: 'th-menu', 'aria-label': 'Time and date menus' }), ul = el('ul'), openBtn = null;
    function close() { if (openBtn) { openBtn.setAttribute('aria-expanded', 'false'); openBtn.nextSibling.hidden = true; openBtn = null; } }
    MENU.forEach(function (m) {
      var b = el('button', { type: 'button', class: 'th-top', 'aria-expanded': 'false', 'aria-haspopup': 'true' }, [m[1], el('span', { class: 'th-caret', 'aria-hidden': 'true' }, '▾')]);
      var sub = el('ul', { class: 'th-sub', hidden: true }, m[2].map(function (i) { return el('li', null, el('a', { href: '#' + i[0], onclick: close }, i[1])); }));
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var was = openBtn === b; close();
        if (!was) { b.setAttribute('aria-expanded', 'true'); sub.hidden = false; openBtn = b; }
      });
      ul.appendChild(el('li', { class: 'th-item' }, [b, sub]));
    });
    d.addEventListener('click', function (e) { if (openBtn && !nav.contains(e.target)) close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openBtn) { var b = openBtn; close(); b.focus(); } });
    nav.appendChild(ul);
    return nav;
  }
  function footBlock() {
    var services = [['clock-main', 'World clock'], ['tz-converter', 'Time zones'], ['cal-month', 'Calendar'], ['wx-local', 'Weather'], ['sky-sun', 'Sun and Moon'], ['tm-timer', 'Timers'], ['calc-d2d', 'Calculators'], ['tm-site', 'Widgets for your site']];
    var legal = [['privacy.html', 'Privacy'], ['privacy.html#cookies', 'Cookies'], ['terms.html', 'Terms'], ['contact.html', 'Contact us'], ['support.html', 'Support and access'], ['webinars.html', 'Webinars and live classes']];
    function col(t, items, hash) { return el('div', null, [el('h3', null, t), el('ul', null, items.map(function (i) { return el('li', null, el('a', { href: hash ? '#' + i[0] : i[0] }, i[1])); }))]); }
    return el('section', { class: 'th-foot', 'aria-label': 'Hub services and legal' }, [col('Services', services, true), col('Legal and help', legal, false),
      el('div', null, [el('h3', null, 'About this hub'), el('p', null, 'Built by House for Learning for learners and teams who meet across time zones. No adverts, no tracking. Times and sky figures are worked out in your own browser; weather and place search use free public services only when you ask.')])]);
  }

  function render() {
    var id = (location.hash || '#home').slice(1).split('?')[0] || 'home', hubOnly = /[?&]clock=|[?&]embed/.test(location.hash);
    T.ticks.length = 0;
    cleanup.splice(0).forEach(function (f) { try { f(); } catch (e) {} });
    stage.textContent = '';
    var classes = d.getElementById('classes-wrap'); if (classes) classes.hidden = id !== 'home' && id !== 'classes';
    var p = T.panels[id], meta = LABEL[id];
    if (id === 'classes') { stage.appendChild(el('p', { class: 'th-crumb' }, [el('a', { href: '#home' }, 'Time and date hub'), ' › Live class time'])); d.title = 'Live class time | House for Learning'; stage.scrollIntoView && 0; return; }
    if (id === 'home') { d.title = 'Time and Date Hub | House for Learning'; T.home(stage); stage.appendChild(footBlock()); return; }
    if (!p) { stage.appendChild(el('p', null, ['That page is not in the hub. ', el('a', { href: '#home' }, 'Back to the hub home')])); return; }
    d.title = (meta ? meta.label : 'Hub') + ' | House for Learning';
    stage.appendChild(el('p', { class: 'th-crumb' }, [el('a', { href: '#home' }, 'Time and date hub'), meta ? ' › ' + meta.menu : '', ' › ', meta ? meta.label : id]));
    stage.appendChild(el('h2', { class: 'th-h' }, meta ? meta.label : id));
    if (p.desc) stage.appendChild(el('p', { class: 'th-lead' }, p.desc));
    var box = el('div', { class: 'th-box' });
    stage.appendChild(box);
    try { p.fn(box); } catch (e) { box.appendChild(el('p', { class: 'th-warn' }, 'This tool could not start in your browser.')); if (window.console) console.error(e); }
    stage.appendChild(footBlock());
    if (!hubOnly) { var h = stage.querySelector('.th-h'); if (h && !location.hash.match(/skip/)) { h.setAttribute('tabindex', '-1'); } }
  }
  T.start = function () {
    app = d.getElementById('th-app');
    if (!app) return;
    app.textContent = '';
    app.appendChild(menuBar());
    stage = el('div', { class: 'th-stage' });
    app.appendChild(stage);
    window.addEventListener('hashchange', function () { render(); window.scrollTo(0, app.offsetTop - 10); });
    setInterval(function () { T.ticks.forEach(function (f) { f(); }); }, 1000);
    render();
  };

  Object.assign(T, { el: el, svg: svg, add: add, pad: pad, store: store, field: field, btn: btn, sel: sel, inp: inp, table: table, copy: copy, download: download,
    parts: parts, offMin: offMin, offLabel: offLabel, zoned: zoned, fmt: fmt, hm: hm, dlong: dlong, ymd: ymd, iso: iso, isoOf: isoOf, daysIn: daysIn, wday: wday, dayNo: dayNo, fromDayNo: fromDayNo, parseISO: parseISO, isoWeek: isoWeek, isLeap: isLeap, MONTHS: MONTHS, DAYS: DAYS,
    CITIES: CITIES, UTC: UTC, label: label, findLocal: findLocal, lookup: lookup, homePlace: homePlace, placeBox: placeBox, needLatLon: needLatLon, norm: norm,
    sunPos: sunPos, moonPos: moonPos, planetPos: planetPos, altaz: altaz, riseSet: riseSet, moonPhase: moonPhase, crossings: crossings, moonDrawing: moonDrawing,
    COUNTRIES: COUNTRIES, countryName: countryName, holidays: holidays, islamic: islamic, hijri: hijri, NOTE: NOTE, LABEL: LABEL, jd: jd });
  return T;
})();
