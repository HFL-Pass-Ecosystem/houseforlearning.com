/* HFL time and date tool: class time converter, world clock, meeting planner, date maths, countdown, calendar file.
   Runs in the visitor's browser only. Nothing is sent anywhere. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ZONES;
  try { ZONES = Intl.supportedValuesOf('timeZone'); } catch (e) { ZONES = ['UTC', 'Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/New_York', 'America/Toronto', 'Asia/Singapore', 'Australia/Sydney']; }
  if (ZONES.indexOf('UTC') < 0) ZONES.unshift('UTC');
  var HOME = 'Asia/Dubai', MINE = 'UTC';
  try { MINE = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) {}
  var CITIES = ['Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/Toronto', 'Asia/Singapore', 'Australia/Sydney'];

  var ALIAS = { 'Asia/Kolkata': 'Asia/Calcutta', 'Asia/Calcutta': 'Asia/Kolkata' };
  function fill(sel, val) {
    if (ZONES.indexOf(val) < 0 && ALIAS[val] && ZONES.indexOf(ALIAS[val]) >= 0) val = ALIAS[val];
    sel.innerHTML = '';
    ZONES.forEach(function (z) { var o = document.createElement('option'); o.value = z; o.textContent = z.replace(/_/g, ' '); if (z === val) o.selected = true; sel.appendChild(o); });
  }
  function fmt(d, zone, opts) {
    try { return new Intl.DateTimeFormat(undefined, Object.assign({ timeZone: zone }, opts)).format(d); } catch (e) { return ''; }
  }
  function parts(d, zone) {
    var o = {}; new Intl.DateTimeFormat('en-CA', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }
  /* The instant for a wall-clock time (y,m,d,h,mi) in a zone: start from UTC and correct by the zone's offset, twice. */
  function instant(y, m, d, h, mi, zone) {
    var t = Date.UTC(y, m - 1, d, h, mi, 0);
    for (var i = 0; i < 2; i++) {
      var p = parts(new Date(t), zone);
      var shown = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, 0);
      t += Date.UTC(y, m - 1, d, h, mi, 0) - shown;
    }
    return new Date(t);
  }
  function offsetLabel(d, zone) {
    var p = parts(d, zone), m = (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(d.getTime() / 1000) * 1000) / 60000;
    var s = m < 0 ? '-' : '+', a = Math.abs(Math.round(m));
    return 'UTC' + s + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0');
  }
  var LONG = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };

  /* 1. class time converter + 5. countdown + 6. calendar file */
  var cd = $('tt-date'), ct = $('tt-time'), cz = $('tt-from'), cm = $('tt-to'), cout = $('tt-conv'), cdown = $('tt-count'), title = $('tt-title');
  function today(offset) { var n = new Date(Date.now() + offset * 864e5), p = parts(n, HOME); return p.year + '-' + p.month + '-' + p.day; }
  fill(cz, HOME); fill(cm, MINE);
  cd.value = today(3); ct.value = '18:00';
  function classInstant() {
    var d = (cd.value || '').split('-'), t = (ct.value || '').split(':');
    if (d.length < 3 || t.length < 2) return null;
    return instant(+d[0], +d[1], +d[2], +t[0], +t[1], cz.value);
  }
  function convert() {
    var i = classInstant();
    if (!i) { cout.textContent = 'Choose a date and a time.'; return; }
    cout.textContent = fmt(i, cm.value, LONG) + ' (' + offsetLabel(i, cm.value) + ') in ' + cm.value.replace(/_/g, ' ') + ', which is ' + fmt(i, cz.value, LONG) + ' where the class is held.';
    $('tt-ics-note').textContent = '';
  }
  [cd, ct, cz, cm].forEach(function (e) { e.addEventListener('input', convert); e.addEventListener('change', convert); });
  $('tt-mine').addEventListener('click', function () { cm.value = MINE; convert(); });
  convert();
  function tick() {
    var i = classInstant(), ms = i ? i - Date.now() : NaN;
    if (isNaN(ms)) cdown.textContent = '';
    else if (ms <= 0) cdown.textContent = 'This class time has passed.';
    else { var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60); cdown.textContent = d + ' days, ' + h + ' hours, ' + m + ' minutes, ' + (s % 60) + ' seconds to go.'; }
    clocks();
  }
  function ics(i, mins, name) {
    function z(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
    var end = new Date(i.getTime() + mins * 60000), now = new Date();
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//House for Learning//Time tool//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:' + i.getTime() + '@houseforlearning.com', 'DTSTAMP:' + z(now), 'DTSTART:' + z(i), 'DTEND:' + z(end), 'SUMMARY:' + name.replace(/[\r\n,;]/g, ' '), 'DESCRIPTION:House for Learning live class', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  $('tt-ics').addEventListener('click', function () {
    var i = classInstant(); if (!i) { $('tt-ics-note').textContent = 'Choose a date and a time first.'; return; }
    var name = (title.value || 'HFL live class').slice(0, 80), text = ics(i, Math.max(15, +$('tt-mins').value || 60), name);
    try {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar' })); a.download = 'hfl-class.ics';
      document.body.appendChild(a); a.click(); a.remove();
      $('tt-ics-note').textContent = 'Calendar file made. Open it to add the class to your calendar.';
    } catch (e) { $('tt-ics-note').textContent = 'Could not make a file here. Note the time above instead.'; }
  });

  /* 2. world clock */
  var list = $('tt-clocks'), picks = CITIES.slice();
  var add = $('tt-add'); fill(add, 'Europe/Paris');
  function clocks() {
    var n = new Date();
    list.innerHTML = '';
    picks.forEach(function (z) {
      var li = document.createElement('li'); li.className = 'tt-clock';
      var h = +parts(n, z).hour, day = h >= 7 && h < 19;
      li.innerHTML = '<span class="tt-city"></span><span class="tt-time"></span><span class="tt-day"></span><button type="button" class="btn btn-sm btn-ghost">Remove</button>';
      li.children[0].textContent = z.replace(/_/g, ' ');
      li.children[1].textContent = fmt(n, z, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      li.children[2].textContent = fmt(n, z, { weekday: 'short', day: 'numeric', month: 'short' }) + ', ' + (day ? 'daytime' : 'night') + ', ' + offsetLabel(n, z);
      li.children[3].setAttribute('aria-label', 'Remove ' + z);
      li.children[3].addEventListener('click', function () { picks = picks.filter(function (x) { return x !== z; }); clocks(); });
      list.appendChild(li);
    });
  }
  $('tt-addbtn').addEventListener('click', function () { if (picks.indexOf(add.value) < 0 && picks.length < 12) { picks.push(add.value); clocks(); } });

  /* 3. meeting planner */
  var pz = [$('tt-p1'), $('tt-p2'), $('tt-p3')], pd = $('tt-pdate'), pout = $('tt-plan');
  fill(pz[0], HOME); fill(pz[1], 'Asia/Kolkata'); fill(pz[2], 'Europe/London');
  var none = document.createElement('option'); none.value = ''; none.textContent = 'None'; pz[2].insertBefore(none, pz[2].firstChild);
  pd.value = today(1);
  function plan() {
    var zs = pz.map(function (s) { return s.value; }).filter(Boolean), d = (pd.value || '').split('-');
    if (d.length < 3) { pout.innerHTML = ''; return; }
    var head = '<thead><tr>' + zs.map(function (z) { return '<th scope="col">' + z.replace(/_/g, ' ') + '</th>'; }).join('') + '<th scope="col">Everyone awake?</th></tr></thead>';
    var rows = '', best = [];
    for (var h = 0; h < 24; h++) {
      var base = instant(+d[0], +d[1], +d[2], h, 0, zs[0]), ok = true, cells = '';
      zs.forEach(function (z) { var p = +parts(base, z).hour; if (p < 8 || p >= 20) ok = false; cells += '<td>' + fmt(base, z, { weekday: 'short', hour: '2-digit', minute: '2-digit' }) + '</td>'; });
      if (ok) best.push(fmt(base, zs[0], { hour: '2-digit', minute: '2-digit' }));
      rows += '<tr' + (ok ? ' class="tt-ok"' : '') + '>' + cells + '<td>' + (ok ? 'Yes' : 'No') + '</td></tr>';
    }
    pout.innerHTML = '<p>' + (best.length ? 'Good times in ' + zs[0].replace(/_/g, ' ') + ' (everyone between 08:00 and 20:00): ' + best.join(', ') + '.' : 'No time suits everyone between 08:00 and 20:00. Try fewer zones or another day.') + '</p><div class="table-wrap"><table class="data">' + head + '<tbody>' + rows + '</tbody></table></div>';
  }
  pz.concat([pd]).forEach(function (e) { e.addEventListener('change', plan); e.addEventListener('input', plan); });
  plan();

  /* 4. date maths */
  var a = $('tt-a'), b = $('tt-b'), diff = $('tt-diff'), base = $('tt-base'), n = $('tt-n'), res = $('tt-res');
  a.value = today(0); b.value = today(30); base.value = today(0); n.value = '14';
  function days(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  function dm() {
    if (a.value && b.value) { var x = days(b.value) - days(a.value), ab = Math.abs(x); diff.textContent = ab + ' days (' + Math.floor(ab / 7) + ' weeks and ' + (ab % 7) + ' days) ' + (x >= 0 ? 'from the first date to the second.' : 'back from the first date to the second.'); }
    if (base.value && n.value !== '') { var t = new Date((days(base.value) + (+n.value)) * 864e5); res.textContent = fmt(t, 'UTC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '.'; }
  }
  [a, b, base, n].forEach(function (e) { e.addEventListener('input', dm); e.addEventListener('change', dm); });
  dm();
  tick(); setInterval(tick, 1000);
  $('tt-yourzone').textContent = MINE.replace(/_/g, ' ');
})();
