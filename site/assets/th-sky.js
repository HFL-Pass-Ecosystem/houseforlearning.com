/* Time hub: sun, moon and sky tools, weather, and the hub home page. */
(function (T) {
  'use strict';
  var el = T.el, add = T.add, pad = T.pad, store = T.store, field = T.field, btn = T.btn, table = T.table, S = T.svg, M = T.MONTHS, D = T.DAYS;
  function hmx(date, tz) { return date ? T.hm(date, tz) : '–'; }
  function placeWithMap(box, fn, o) {
    var p = T.homePlace(), out = el('div');
    if (p.lat == null) p = T.CITIES[0];
    var pb = T.placeBox(p, function (x) { p = x; draw(); }, o);
    function draw() { out.textContent = ''; if (T.needLatLon(p, out)) fn(out, p); }
    add(box, [pb, out]); draw();
    return { place: function () { return p; }, redraw: draw };
  }
  function listTimes(r, tz) { return r.length ? r.map(function (x) { return T.hm(x, tz); }).join(', ') : '–'; }

  /* ---------- sunrise and sunset ---------- */
  T.reg('sky-sun', function (box) {
    var home = T.homePlace(), q = T.ymd(new Date(), home.tz), dIn = T.inp('date', T.iso(q.y, q.m, q.d)), res;
    function draw(out, p) {
      var a = T.parseISO(dIn.value); if (!a) return;
      var sun = T.riseSet('Sun', p.lat, p.lon, p.tz, a.y, a.m, a.d, -0.833), civ = T.riseSet('Sun', p.lat, p.lon, p.tz, a.y, a.m, a.d, -6), nau = T.riseSet('Sun', p.lat, p.lon, p.tz, a.y, a.m, a.d, -12), ast = T.riseSet('Sun', p.lat, p.lon, p.tz, a.y, a.m, a.d, -18);
      var len = sun.rises[0] && sun.sets[0] ? (sun.sets[0] - sun.rises[0]) / 6e4 : (sun.allDay ? 1440 : 0), lenTxt = !sun.rises.length && !sun.sets.length ? (sun.up ? 'The Sun stays up all day (polar day)' : 'The Sun does not rise today (polar night)') : Math.floor(len / 60) + ' h ' + Math.round(len % 60) + ' min';
      out.textContent = '';
      add(out, [el('p', { class: 'th-big' }, T.label(p) + ' · ' + T.dlong(zonedNoon(a, p.tz), p.tz)), table(['Event', 'Time'], [['Sunrise', listTimes(sun.rises, p.tz)], ['Solar noon (Sun highest)', hmx(sun.noon, p.tz) + ', ' + Math.round(sun.max) + '° high'], ['Sunset', listTimes(sun.sets, p.tz)], ['Length of day', lenTxt], ['Civil dawn / dusk', listTimes(civ.rises, p.tz) + ' / ' + listTimes(civ.sets, p.tz)], ['Nautical dawn / dusk', listTimes(nau.rises, p.tz) + ' / ' + listTimes(nau.sets, p.tz)], ['Astronomical dawn / dusk', listTimes(ast.rises, p.tz) + ' / ' + listTimes(ast.sets, p.tz)]]), el('h3', null, M[a.m - 1] + ' ' + a.y + ', day by day')]);
      var rows = [], i, n = T.daysIn(a.y, a.m);
      for (i = 1; i <= n; i++) { var s = T.riseSet('Sun', p.lat, p.lon, p.tz, a.y, a.m, i, -0.833), l = s.rises[0] && s.sets[0] ? Math.round((s.sets[0] - s.rises[0]) / 6e4) : 0; rows.push([i + ' ' + M[a.m - 1].slice(0, 3), listTimes(s.rises, p.tz), listTimes(s.sets, p.tz), Math.floor(l / 60) + ':' + pad(l % 60)]); }
      add(out, [table(['Day', 'Sunrise', 'Sunset', 'Day length'], rows), el('p', { class: 'th-hint' }, 'Worked out for the place you chose, in its own time zone, to within about a minute. The Sun’s upper edge is used for sunrise and sunset.')]);
    }
    function zonedNoon(a, tz) { return T.zoned(a.y, a.m, a.d, 12, 0, tz); }
    add(box, [field('Date', dIn)]);
    res = placeWithMap(box, draw); dIn.addEventListener('input', res.redraw);
  }, 'Sunrise, sunset, day length and twilight times for any place and date.');

  /* ---------- moon phases ---------- */
  var PH = { 0: 'New Moon', 90: 'First quarter', 180: 'Full Moon', 270: 'Last quarter' };
  T.reg('sky-phases', function (box) {
    var home = T.homePlace(), now = new Date(), ph = T.moonPhase(now), age = ph.elong / 360 * 29.530589;
    var cr = T.crossings(function (d) { return T.norm(T.moonPos(d).lon - T.sunPos(d).lon, 360); }, [0, 90, 180, 270], now, 380, 12);
    add(box, [el('div', { class: 'th-moonrow' }, [T.moonDrawing(ph.elong, 150), el('div', null, [el('p', { class: 'th-big' }, ph.name), el('p', null, 'About ' + Math.round(ph.lit * 100) + '% of the Moon’s face is lit.'), el('p', null, 'The Moon is about ' + age.toFixed(1) + ' days old (a full cycle is 29.5 days).')])]),
      el('h3', null, 'The next Moon phases, in ' + T.label(home) + ' time'), table(['Phase', 'Date', 'Time'], cr.slice(0, 16).map(function (c) { return [PH[c.target], T.dlong(c.at, home.tz), T.hm(c.at, home.tz)]; })),
      el('p', { class: 'th-hint' }, 'Worked out from the positions of the Sun and Moon, good to within about an hour. In the southern hemisphere the lit part appears on the other side.')]);
  }, 'Today’s Moon and the dates of the next New Moon, quarters and Full Moon.');

  T.reg('sky-moonrise', function (box) {
    var home = T.homePlace(), q = T.ymd(new Date(), home.tz), mo = T.sel(M.map(function (x, i) { return [i + 1, x]; }), q.m), yr = T.inp('number', q.y, { min: 1900, max: 2100 }), res;
    function draw(out, p) {
      var y = +yr.value, m = +mo.value, n = T.daysIn(y, m), rows = [], i;
      for (i = 1; i <= n; i++) { var r = T.riseSet('Moon', p.lat, p.lon, p.tz, y, m, i, 0.125), ph = T.moonPhase(T.zoned(y, m, i, 12, 0, p.tz)); rows.push([i + ' ' + M[m - 1].slice(0, 3), listTimes(r.rises, p.tz), listTimes(r.sets, p.tz), Math.round(ph.lit * 100) + '% · ' + ph.name]); }
      out.textContent = ''; add(out, [el('p', { class: 'th-big' }, T.label(p) + ' · ' + M[m - 1] + ' ' + y), table(['Day', 'Moonrise', 'Moonset', 'Phase at noon'], rows), el('p', { class: 'th-hint' }, 'A dash means the Moon does not rise or set on that calendar day. Times are in the place’s own time zone, to within a few minutes.')]);
    }
    add(box, [el('div', { class: 'th-row' }, [field('Month', mo), field('Year', yr)])]);
    res = placeWithMap(box, draw); [mo, yr].forEach(function (e) { e.addEventListener('input', res.redraw); });
  }, 'When the Moon rises and sets, day by day.');

  T.reg('sky-eclipses', function (box) {
    var t = T.isoOf(new Date(), T.homePlace().tz), rows = T.ECLIPSES.filter(function (e) { return e[0] >= t; });
    add(box, [el('p', null, 'A solar eclipse happens when the Moon passes between us and the Sun. A lunar eclipse happens when the Earth’s shadow falls on the Moon. These are the next ones worldwide:'), table(['Date', 'Kind', 'Where it can be seen'], rows), el('p', { class: 'th-hint' }, 'Dates only. Exact times and what you can see from your own place depend on where you are, so please check a national observatory or almanac before you plan to watch. Never look at the Sun without proper eclipse glasses.'),
      el('h3', null, 'The kinds of eclipse'), el('ul', { class: 'ticks' }, [el('li', null, 'Total solar: the Sun is fully covered for a few minutes along a narrow path.'), el('li', null, 'Annular solar: the Moon is a little too far away, so a bright ring is left.'), el('li', null, 'Partial: only part of the Sun or Moon is covered.'), el('li', null, 'Penumbral lunar: a very faint shading, hard to notice.')])]);
  }, 'The next eclipses of the Sun and Moon.');

  /* ---------- sky tonight ---------- */
  function az8(a) { return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(a / 45) % 8]; }
  T.reg('sky-tonight', function (box) {
    function draw(out, p) {
      var now = new Date(), q = T.ymd(now, p.tz), sun = T.riseSet('Sun', p.lat, p.lon, p.tz, q.y, q.m, q.d, -0.833), ast = T.riseSet('Sun', p.lat, p.lon, p.tz, q.y, q.m, q.d, -18), moon = T.riseSet('Moon', p.lat, p.lon, p.tz, q.y, q.m, q.d, 0.125), ph = T.moonPhase(now);
      var look = T.zoned(q.y, q.m, q.d, 21, 0, p.tz), rows = [], names = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
      names.forEach(function (n) { var aa = T.altaz(T.planetPos(n, look), look, p.lat, p.lon); rows.push([n, aa.alt > 0 ? Math.round(aa.alt) + '° up, towards ' + az8(aa.az) : 'below the horizon', aa.alt > 10 ? 'Look for it' : aa.alt > 0 ? 'Low, near the horizon' : 'Not tonight']); });
      var ma = T.altaz(T.moonPos(look), look, p.lat, p.lon);
      rows.unshift(['Moon', ma.alt > 0 ? Math.round(ma.alt) + '° up, towards ' + az8(ma.az) : 'below the horizon', ph.name + ', ' + Math.round(ph.lit * 100) + '% lit']);
      out.textContent = '';
      add(out, [el('p', { class: 'th-big' }, T.label(p) + ' · ' + T.dlong(now, p.tz)), el('div', { class: 'th-moonrow' }, [T.moonDrawing(ph.elong, 110), table(['Tonight', 'Time'], [['Sunset', listTimes(sun.sets, p.tz)], ['Sky fully dark (astronomical dusk)', listTimes(ast.sets, p.tz)], ['Moonrise', listTimes(moon.rises, p.tz)], ['Moonset', listTimes(moon.sets, p.tz)], ['Sky starts to brighten (astronomical dawn)', listTimes(ast.rises, p.tz)]])]),
        el('h3', null, 'What is up at 21:00 local time'), table(['Object', 'Where', 'Note'], rows), el('p', { class: 'th-hint' }, 'Planet positions are approximate (within about a degree), enough to know where to look. Planets near the Sun are hard to see. Directions are compass points: N north, E east, S south, W west.')]);
    }
    placeWithMap(box, draw);
  }, 'The Moon and the bright planets, and when the sky is dark enough.');

  /* ---------- weather ---------- */
  var cache = {};
  function getJSON(url) { if (cache[url] && Date.now() - cache[url].t < 600000) return Promise.resolve(cache[url].v); return fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { cache[url] = { t: Date.now(), v: j }; return j; }); }
  function forecast(p, extra) { return getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + p.lat + '&longitude=' + p.lon + '&timezone=auto' + extra); }
  var CUR = '&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,is_day';
  var DAILY = '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max';
  var HOURLY = '&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,is_day';
  var WC = { 0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail' };
  function wxIcon(code, day, size) {
    var s = size || 36, g = S('svg', { viewBox: '0 0 40 40', width: s, height: s, role: 'img', 'aria-label': WC[code] || 'Weather' }), sun = function (cx, cy, r) { var k = S('g'); k.appendChild(S('circle', { cx: cx, cy: cy, r: r, fill: '#d0732f' })); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; k.appendChild(S('line', { x1: cx + Math.cos(a) * (r + 3), y1: cy + Math.sin(a) * (r + 3), x2: cx + Math.cos(a) * (r + 6), y2: cy + Math.sin(a) * (r + 6), stroke: '#d0732f', 'stroke-width': 2, 'stroke-linecap': 'round' })); } return k; };
    var cloud = function (dx, dy, col) { return S('path', { d: 'M' + (10 + dx) + ' ' + (28 + dy) + 'h18a6 6 0 0 0 0-12 8 8 0 0 0-15-2 6 6 0 0 0-3 14z', fill: col || '#8fa3b5' }); };
    if (code === 0 || code === 1) { if (day === 0) { g.appendChild(S('path', { d: 'M26 8a12 12 0 1 0 8 20A10 10 0 0 1 26 8z', fill: '#2b5d8a' })); } else g.appendChild(sun(20, 20, 8)); }
    else if (code === 2) { g.appendChild(sun(14, 14, 6)); g.appendChild(cloud(2, 4)); }
    else if (code === 3) g.appendChild(cloud(0, 0, '#6f879c'));
    else if (code === 45 || code === 48) { [14, 21, 28].forEach(function (y) { g.appendChild(S('line', { x1: 8, x2: 32, y1: y, y2: y, stroke: '#8fa3b5', 'stroke-width': 3, 'stroke-linecap': 'round' })); }); }
    else { g.appendChild(cloud(0, -4, '#8fa3b5')); var snow = (code >= 71 && code <= 77) || code === 85 || code === 86, storm = code >= 95; if (storm) g.appendChild(S('path', { d: 'M21 22l-5 8h4l-2 6 7-9h-4z', fill: '#d0732f' })); else [13, 20, 27].forEach(function (x) { g.appendChild(snow ? S('circle', { cx: x, cy: 34, r: 2, fill: '#2b5d8a' }) : S('line', { x1: x, y1: 30, x2: x - 3, y2: 37, stroke: '#2b5d8a', 'stroke-width': 2.2, 'stroke-linecap': 'round' })); }); }
    return g;
  }
  T.wxIcon = wxIcon;
  function wxPage(box, fn, o) {
    return placeWithMap(box, function (out, p) {
      out.textContent = 'Loading the weather…';
      fn(p).then(function (nodes) { out.textContent = ''; add(out, [el('p', { class: 'th-big' }, T.label(p)), nodes, el('p', { class: 'th-hint' }, 'Weather figures come from a free public weather service and are loaded straight to your browser when you open this page. Forecasts can change; for safety decisions use your national weather service.')]); }).catch(function () { out.textContent = 'The weather could not be loaded. Check your internet connection and try again.'; });
    }, o);
  }
  function wind(deg) { return az8(deg); }
  T.reg('wx-local', function (box) {
    wxPage(box, function (p) {
      return forecast(p, CUR + DAILY + HOURLY + '&forecast_days=2').then(function (j) {
        var c = j.current, d = j.daily, now = (c.time || '').slice(0, 13), h = j.hourly, i0 = Math.max(0, h.time.findIndex(function (t) { return t.slice(0, 13) >= now; })), rows = [], i;
        for (i = i0; i < i0 + 24 && i < h.time.length; i++) rows.push([h.time[i].slice(11), el('span', { class: 'th-wxcell' }, [wxIcon(h.weather_code[i], h.is_day[i], 24), ' ' + (WC[h.weather_code[i]] || '')]), Math.round(h.temperature_2m[i]) + '°C', (h.precipitation_probability[i] == null ? '–' : h.precipitation_probability[i] + '%'), Math.round(h.wind_speed_10m[i]) + ' km/h']);
        return el('div', null, [el('div', { class: 'th-wxnow' }, [wxIcon(c.weather_code, c.is_day, 72), el('div', null, [el('p', { class: 'th-clockbig sm' }, Math.round(c.temperature_2m) + ' °C'), el('p', null, (WC[c.weather_code] || '') + ', feels like ' + Math.round(c.apparent_temperature) + ' °C')])]),
          table(['Now', 'Reading'], [['Humidity', c.relative_humidity_2m + '%'], ['Wind', Math.round(c.wind_speed_10m) + ' km/h from ' + wind(c.wind_direction_10m)], ['Pressure', Math.round(c.pressure_msl) + ' hPa'], ['Rain in the last hour', c.precipitation + ' mm'], ['Today', 'High ' + Math.round(d.temperature_2m_max[0]) + ' °C, low ' + Math.round(d.temperature_2m_min[0]) + ' °C'], ['Sunrise / sunset', d.sunrise[0].slice(11) + ' / ' + d.sunset[0].slice(11)], ['UV index (highest today)', String(Math.round(d.uv_index_max[0]))]]),
          el('h3', null, 'Next 24 hours'), table(['Hour', 'Sky', 'Temperature', 'Rain chance', 'Wind'], rows)]);
      });
    });
  }, 'The weather right now where you are, or anywhere you search.');

  T.reg('wx-14', function (box) {
    wxPage(box, function (p) {
      return forecast(p, DAILY + '&forecast_days=14').then(function (j) {
        var d = j.daily;
        return table(['Day', 'Sky', 'High', 'Low', 'Rain chance', 'Rain', 'Wind (max)'], d.time.map(function (t, i) { var q = T.parseISO(t); return [D[T.wday(q.y, q.m, q.d)].slice(0, 3) + ' ' + q.d + ' ' + M[q.m - 1].slice(0, 3), el('span', { class: 'th-wxcell' }, [wxIcon(d.weather_code[i], 1, 24), ' ' + (WC[d.weather_code[i]] || '')]), Math.round(d.temperature_2m_max[i]) + '°C', Math.round(d.temperature_2m_min[i]) + '°C', (d.precipitation_probability_max[i] == null ? '–' : d.precipitation_probability_max[i] + '%'), d.precipitation_sum[i] + ' mm', Math.round(d.wind_speed_10m_max[i]) + ' km/h']; }));
      });
    });
  }, 'The next 14 days, day by day.');

  function lineChart(vals, labels, o) {
    var W = 900, H = 220, pad = 36, min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), c = S('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'th-chart', role: 'img', 'aria-label': o.label });
    if (max === min) max = min + 1;
    var x = function (i) { return pad + i * (W - 2 * pad) / Math.max(1, vals.length - 1); }, y = function (v) { return H - pad - (v - min) / (max - min) * (H - 2 * pad); };
    [min, (min + max) / 2, max].forEach(function (v) { c.appendChild(S('line', { x1: pad, x2: W - pad, y1: y(v), y2: y(v), stroke: '#ddd5c2' })); var t = S('text', { x: 4, y: y(v) + 4, 'font-size': 12, fill: '#4f6276' }); t.textContent = Math.round(v) + (o.unit || ''); c.appendChild(t); });
    c.appendChild(S('polyline', { points: vals.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' '), fill: 'none', stroke: '#d0732f', 'stroke-width': 2.5 }));
    labels.forEach(function (l, i) { if (!l) return; var t = S('text', { x: x(i), y: H - 8, 'font-size': 12, 'text-anchor': 'middle', fill: '#4f6276' }); t.textContent = l; c.appendChild(t); });
    return c;
  }
  T.reg('wx-hourly', function (box) {
    wxPage(box, function (p) {
      return forecast(p, HOURLY + '&forecast_days=7').then(function (j) {
        var h = j.hourly, days = [], i; h.time.forEach(function (t) { if (days.indexOf(t.slice(0, 10)) < 0) days.push(t.slice(0, 10)); });
        var sel = T.sel(days.map(function (d) { var q = T.parseISO(d); return [d, D[T.wday(q.y, q.m, q.d)] + ' ' + q.d + ' ' + M[q.m - 1]]; }), days[0]), tb = el('div'), chart = lineChart(h.temperature_2m.slice(0, 168), h.time.slice(0, 168).map(function (t, i) { return i % 24 === 0 ? D[T.wday.apply(null, Object.values(T.parseISO(t.slice(0, 10))))].slice(0, 3) : ''; }), { label: 'Temperature for the next seven days', unit: '°' });
        function draw() { var rows = []; h.time.forEach(function (t, k) { if (t.slice(0, 10) === sel.value) rows.push([t.slice(11), el('span', { class: 'th-wxcell' }, [wxIcon(h.weather_code[k], h.is_day[k], 24), ' ' + (WC[h.weather_code[k]] || '')]), Math.round(h.temperature_2m[k]) + '°C (feels ' + Math.round(h.apparent_temperature[k]) + '°)', h.precipitation_probability[k] == null ? '–' : h.precipitation_probability[k] + '%', Math.round(h.wind_speed_10m[k]) + ' km/h']); }); tb.textContent = ''; tb.appendChild(table(['Hour', 'Sky', 'Temperature', 'Rain chance', 'Wind'], rows)); }
        sel.addEventListener('change', draw); draw();
        return el('div', null, [el('h3', null, 'Temperature, next 7 days'), chart, field('Choose a day', sel), tb]);
      });
    });
  }, 'Every hour for the next seven days.');

  T.reg('wx-past', function (box) {
    wxPage(box, function (p) {
      return forecast(p, '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&past_days=7&forecast_days=1').then(function (j) {
        var d = j.daily, rows = d.time.map(function (t, i) { var q = T.parseISO(t); return [D[T.wday(q.y, q.m, q.d)].slice(0, 3) + ' ' + q.d + ' ' + M[q.m - 1].slice(0, 3), el('span', { class: 'th-wxcell' }, [wxIcon(d.weather_code[i], 1, 24), ' ' + (WC[d.weather_code[i]] || '')]), Math.round(d.temperature_2m_max[i]) + '°C', Math.round(d.temperature_2m_min[i]) + '°C', d.precipitation_sum[i] + ' mm', Math.round(d.wind_speed_10m_max[i]) + ' km/h']; });
        return el('div', null, [table(['Day', 'Sky', 'High', 'Low', 'Rain', 'Wind (max)'], rows), lineChart(d.temperature_2m_max, d.time.map(function (t) { return t.slice(8); }), { label: 'Highest temperature each day for the past week', unit: '°' })]);
      });
    });
  }, 'What the weather did over the last seven days.');

  T.reg('wx-climate', function (box) {
    wxPage(box, function (p) {
      var y = T.ymd(new Date(), 'UTC').y, y1 = y - 10, y2 = y - 1;
      return getJSON('https://archive-api.open-meteo.com/v1/archive?latitude=' + p.lat + '&longitude=' + p.lon + '&start_date=' + y1 + '-01-01&end_date=' + y2 + '-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto').then(function (j) {
        var d = j.daily, hi = [], lo = [], pr = [], n = [], i, m;
        for (m = 0; m < 12; m++) { hi[m] = 0; lo[m] = 0; pr[m] = 0; n[m] = 0; }
        d.time.forEach(function (t, k) { m = +t.slice(5, 7) - 1; if (d.temperature_2m_max[k] != null) { hi[m] += d.temperature_2m_max[k]; lo[m] += d.temperature_2m_min[k]; n[m]++; } pr[m] += d.precipitation_sum[k] || 0; });
        var hiA = hi.map(function (v, k) { return v / (n[k] || 1); }), loA = lo.map(function (v, k) { return v / (n[k] || 1); }), prA = pr.map(function (v) { return v / 10; });
        return el('div', null, [el('p', null, 'Average for each month over ' + y1 + ' to ' + y2 + ' (ten full years).'), table(['Month', 'Average high', 'Average low', 'Rain in a month'], M.map(function (name, k) { return [name, hiA[k].toFixed(1) + '°C', loA[k].toFixed(1) + '°C', prA[k].toFixed(0) + ' mm']; })), el('h3', null, 'Average high through the year'), lineChart(hiA, M.map(function (x) { return x.slice(0, 3); }), { label: 'Average high temperature by month', unit: '°' })]);
      });
    });
  }, 'What each month is usually like, from the last ten years of records.');

  T.reg('wx-world', function (box) {
    var names = ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Mumbai', 'Delhi', 'Bengaluru', 'Karachi', 'Dhaka', 'Singapore', 'Hong Kong', 'Tokyo', 'Sydney', 'Auckland', 'London', 'Paris', 'Berlin', 'Moscow', 'Cairo', 'Nairobi', 'Lagos', 'Johannesburg', 'New York', 'Toronto', 'Mexico City', 'Sao Paulo'], cs = names.map(T.findLocal), out = el('div', null, 'Loading the weather…');
    getJSON('https://api.open-meteo.com/v1/forecast?current=temperature_2m,weather_code,is_day&timezone=auto&latitude=' + cs.map(function (c) { return c.lat; }).join(',') + '&longitude=' + cs.map(function (c) { return c.lon; }).join(',')).then(function (j) {
      j = Array.isArray(j) ? j : [j]; out.textContent = '';
      add(out, [table(['City', 'Sky', 'Temperature', 'Local time'], j.map(function (r, i) { return [T.label(cs[i]), el('span', { class: 'th-wxcell' }, [wxIcon(r.current.weather_code, r.current.is_day, 24), ' ' + (WC[r.current.weather_code] || '')]), Math.round(r.current.temperature_2m) + ' °C', T.hm(new Date(), cs[i].tz)]; })), el('p', { class: 'th-hint' }, 'Free public weather figures, loaded when you open this page.')]);
    }).catch(function () { out.textContent = 'The weather could not be loaded. Check your internet connection and try again.'; });
    add(box, [out, el('p', null, [el('a', { href: '#wx-local' }, 'Weather for your own place'), ' · ', el('a', { href: '#wx-14' }, '2-week forecast')])]);
  }, 'Right now in the world’s main cities.');

  /* ---------- hub home ---------- */
  function card(title, kids, more) { return el('section', { class: 'th-panel' }, [el('h3', null, title), kids, more || null]); }
  function links(items) { return el('ul', { class: 'th-links' }, items.map(function (i) { return el('li', null, [el('a', { href: '#' + i[0] }, i[1]), i[2] ? el('span', null, i[2]) : null]); })); }
  function more(href, text) { return el('a', { class: 'btn btn-sm btn-ghost th-more', href: '#' + href }, text); }
  T.home = function (box) {
    var home = T.homePlace(), grid = el('div', { class: 'th-grid' });
    /* current time */
    var big = el('p', { class: 'th-clockbig', role: 'timer' }), dt = el('p', { class: 'th-date' }), where = el('p', { class: 'th-where' }), setBox = el('div', { hidden: true }), searchRes = el('p', { class: 'th-big', role: 'status' });
    var setBtn = btn('Set home location', function () { setBox.hidden = !setBox.hidden; }, 'btn-ghost');
    setBox.appendChild(T.placeBox(home, function (p) { home = p; store.set('home', p); setBox.hidden = true; paintTop(); }));
    var wsearch = T.placeBox(null, function (p) { var n = new Date(); searchRes.textContent = T.label(p) + ': ' + T.hm(n, p.tz, true) + ', ' + T.dlong(n, p.tz); var l = store.get('personal', null) || []; }, { geo: false, placeholder: 'World clock: search for a city or place' });
    function paintTop() { var n = new Date(); big.textContent = T.hm(n, home.tz, true); dt.textContent = T.dlong(n, home.tz) + ' · ' + T.offLabel(T.offMin(home.tz, n)); where.textContent = T.label(home); }
    T.tick(paintTop);
    add(grid, card('Current time', [big, dt, where, setBtn, setBox, el('h4', null, 'World clock'), wsearch, searchRes, links([['clock-main', 'World clock', 'The time around the world.'], ['clock-personal', 'Personal world clock', 'Your own favourite places.']])], more('tz-dst', 'Clock changes worldwide')));
    /* time zones */
    add(grid, card('Time zones', links([['tz-map', 'Time zone map', 'Day, night and the time in every band.'], ['tz-converter', 'Time zone converter', 'The time difference between places.'], ['tz-planner', 'Meeting planner', 'The best hour for a meeting across zones.'], ['tz-announcer', 'Event time announcer', 'Share your event time worldwide.']]), more('tz-more', 'More time zone tools')));
    /* calendar */
    var mode = T.sel([['year', 'Full year'], ['month', 'Month']], 'month'), now = T.ymd(new Date(), home.tz), y = T.inp('number', now.y, { min: 1583, max: 9999 }), mo = T.sel(M.map(function (x, i) { return [i + 1, x]; }), now.m), cs = T.sel(T.COUNTRIES.map(function (c) { return [c[0], c[1]]; }), 'AE');
    add(grid, card('Calendar', [el('div', { class: 'th-form' }, [field('Show', mode), field('Year', y), field('Month', mo), field('Country', cs)]), btn('View calendar', function () { location.hash = '#cal-month?mode=' + mode.value + '&y=' + y.value + '&m=' + mo.value + '&c=' + cs.value; }), links([['cal-print', 'Printable calendar (PDF)', 'Print or save a calendar.'], ['cal-events', 'Add your own events', 'Keep your own dates.']])], more('cal-holidays', 'Holidays and observances worldwide')));
    /* calculators and timers */
    add(grid, card('Calculators and timers', links([['calc-d2d', 'Date to date', 'How many days between two dates.'], ['calc-add', 'Date calculator', 'Add or take away days, months or years.'], ['tm-countdown', 'Countdown to any date', 'Make your own countdown.'], ['tm-timer', 'Timer with alarm', 'One or many timers.'], ['tm-stopwatch', 'Stopwatch', 'With laps.']]), more('calc-d2d', 'Explore the calculators')));
    /* sun moon space */
    var ph = T.moonPhase(new Date());
    add(grid, card('Sun, Moon and space', [el('div', { class: 'th-moonrow' }, [T.moonDrawing(ph.elong, 64), el('p', null, 'Moon today: ' + ph.name + ', ' + Math.round(ph.lit * 100) + '% lit')]), links([['sky-sun', 'Sunrise and sunset', 'Local times, day length, dawn and dusk.'], ['sky-phases', 'Moon phases', 'Exact dates of each phase.'], ['sky-moonrise', 'Moonrise and moonset', 'Times for your place.'], ['sky-eclipses', 'Eclipses', 'The next eclipses.'], ['sky-tonight', 'The sky tonight', 'What is up after dark.']])], more('sky-tonight', 'Explore the sky')));
    /* weather */
    var wxNow = el('div', { class: 'th-wxnow' }, 'Loading…');
    if (home.lat != null) forecast(home, '&current=temperature_2m,weather_code,is_day&forecast_days=1').then(function (j) { wxNow.textContent = ''; add(wxNow, [wxIcon(j.current.weather_code, j.current.is_day, 48), el('div', null, [el('p', { class: 'th-clockbig sm' }, Math.round(j.current.temperature_2m) + ' °C'), el('p', null, (WC[j.current.weather_code] || '') + ' in ' + home.name)])]); }).catch(function () { wxNow.textContent = 'Weather is not available right now.'; }); else wxNow.textContent = 'Search a city to see its weather.';
    add(grid, card('Weather', [wxNow, links([['wx-local', 'Current weather', 'Now, today, tomorrow and later.'], ['wx-14', '2-week forecast', 'Fourteen days ahead.'], ['wx-hourly', 'Hour by hour', 'Every hour for seven days.'], ['wx-past', 'Past week', 'What it was like.'], ['wx-climate', 'Climate', 'A normal year in your place.']])], more('wx-world', 'Weather around the globe')));
    /* news strip */
    var strip = el('ul', { class: 'th-strip' }), now2 = new Date();
    var full = T.crossings(function (d) { return T.norm(T.moonPos(d).lon - T.sunPos(d).lon, 360); }, [180], now2, 40, 12)[0], dst = T.transitions(home.tz, now.y).concat(T.transitions(home.tz, now.y + 1)).filter(function (r) { return r.at > now2; })[0], ec = T.ECLIPSES.filter(function (e) { return e[0] >= T.isoOf(now2, home.tz); })[0];
    add(strip, [el('li', null, [el('a', { href: '#news-astronomy' }, 'Next Full Moon'), full ? ': ' + T.dlong(full.at, home.tz) : '']), el('li', null, [el('a', { href: '#news-timezones' }, 'Clock changes'), dst ? ': ' + T.label(home) + ' on ' + T.dlong(dst.at, home.tz) : ': ' + T.label(home) + ' has no clock change coming up']), ec ? el('li', null, [el('a', { href: '#sky-eclipses' }, 'Next eclipse'), ': ' + ec[0] + ', ' + ec[1]]) : null, el('li', null, [el('a', { href: '#tm-national' }, 'UAE National Day'), ' countdown']), el('li', null, [el('a', { href: '#news-live' }, 'Live classes'), ' and events'])]);
    var news = el('section', { class: 'th-panel wide' }, [el('h3', null, 'News and notes'), strip, el('p', null, [el('a', { href: '#news-calendar' }, 'Calendar and holiday news'), ' · ', el('a', { href: '#news-newsletter' }, 'Newsletter'), ' · ', el('a', { href: '#classes' }, 'Live class time')])]);
    add(box, [grid, news]);
  };
  T.start();
})(window.TH);
