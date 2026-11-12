/* HFL class time tool (part of the time and date hub): class time converter, countdown, calendar file.
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

  tick(); setInterval(tick, 1000);
  $('tt-yourzone').textContent = MINE.replace(/_/g, ' ');
})();
