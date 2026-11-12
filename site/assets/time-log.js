/* My learning time ("time is golden"): log the minutes you learn each day, set a weekly goal and see this week at a glance.
   Kept in this browser only: localStorage hfl_time = {goal: minutes a week, days: {"YYYY-MM-DD": {m: minutes, what: short text}}}.
   Bar widths come from data-w (set by HFLAccess.paint). Text is set with textContent only. No inline script or style. */
(function () {
  var main = document.querySelector('main[data-lms="timelog"]'); if (!main) return;
  var box = document.getElementById('lms-box'), A = window.HFLAccess, KEY = 'hfl_time';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function say(m, bad) { var p = el('p', 'acc-msg' + (bad ? ' bad' : ''), m); p.setAttribute('role', 'status'); return p; }
  function load() {
    var d = null; try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
    if (!d || typeof d !== 'object') d = {};
    var g = Number(d.goal); if (!(g >= 30 && g <= 3000)) g = 150;
    var days = d.days && typeof d.days === 'object' ? d.days : {};
    return { goal: g, days: days };
  }
  function store(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (e) { return false; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function add(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function monday(d) { return add(d, -((d.getDay() + 6) % 7)); }
  function mins(D, key) { var r = D.days[key]; return r && r.m > 0 ? Number(r.m) : 0; }
  function weekTotal(D, start) { var t = 0; for (var i = 0; i < 7; i++) t += mins(D, ymd(add(start, i))); return t; }
  function nice(d) { return d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getFullYear(); }
  function streak(D) {
    var d = today(); if (!mins(D, ymd(d))) d = add(d, -1);
    var n = 0; while (mins(D, ymd(d)) && n < 3660) { n++; d = add(d, -1); }
    return n;
  }
  function field(label, input) { var l = el('label', 'au-f'); l.appendChild(el('span', 'au-l', label)); l.appendChild(input); return l; }

  A.ready.then(function () {
    box.textContent = '';
    if (!A.signedIn()) {
      box.appendChild(el('p', '', 'Sign in first.'));
      var a = el('a', 'btn', 'Sign in'); a.href = 'login.html?next=timelog.html'; box.appendChild(a); return;
    }
    box.appendChild(el('p', '', 'Time is golden. Log the minutes you learn each day and watch your week fill up.'));
    box.appendChild(el('p', 'note', 'Kept in this browser only.'));

    /* form: add learning time */
    var f = el('form', 'tl-form'); f.noValidate = true;
    f.appendChild(el('h3', '', 'Add learning time'));
    var row = el('div', 'tl-row');
    var dIn = el('input'); dIn.type = 'date'; dIn.name = 'date'; dIn.required = true;
    var mIn = el('input'); mIn.type = 'number'; mIn.name = 'minutes'; mIn.min = '1'; mIn.max = '600'; mIn.step = '1'; mIn.required = true; mIn.inputMode = 'numeric';
    var cSel = el('select'); cSel.name = 'course';
    var paid = A.load(); Object.keys(paid).forEach(function (k) { var r = paid[k]; if (r && r.paid) { var o = el('option', '', r.title || k); o.value = r.title || k; cSel.appendChild(o); } });
    var other = el('option', '', 'Something else'); other.value = ''; cSel.appendChild(other); cSel.value = '';
    var wIn = el('input'); wIn.type = 'text'; wIn.name = 'what'; wIn.maxLength = 80; wIn.autocomplete = 'off';
    row.appendChild(field('Date', dIn)); row.appendChild(field('Minutes', mIn)); f.appendChild(row);
    var row2 = el('div', 'tl-row');
    row2.appendChild(field('Course', cSel)); row2.appendChild(field('What did you learn? (optional, up to 80 letters)', wIn)); f.appendChild(row2);
    var go = el('button', 'btn', 'Add'); go.type = 'submit'; f.appendChild(go);
    var fMsg = el('div', 'tl-msg'); fMsg.setAttribute('aria-live', 'polite'); f.appendChild(fMsg);
    box.appendChild(f);

    /* weekly goal */
    var g = el('form', 'tl-goal'); g.noValidate = true;
    var gIn = el('input'); gIn.type = 'number'; gIn.name = 'goal'; gIn.min = '30'; gIn.max = '3000'; gIn.step = '1'; gIn.inputMode = 'numeric';
    var grow = el('div', 'tl-row'); grow.appendChild(field('Weekly goal (minutes, 30 to 3000)', gIn));
    var gb = el('button', 'btn btn-ghost', 'Save goal'); gb.type = 'submit'; grow.appendChild(gb); g.appendChild(grow);
    var gMsg = el('div', 'tl-msg'); gMsg.setAttribute('aria-live', 'polite'); g.appendChild(gMsg);
    box.appendChild(g);

    var out = el('div', 'tl-out'); box.appendChild(out);
    var undoMsg = el('div', 'tl-undo'); undoMsg.setAttribute('aria-live', 'polite'); var undoTimer = null;

    function resetDate() { var t = ymd(today()); dIn.max = t; if (!dIn.value) dIn.value = t; }

    function draw() {
      var D = load(), t0 = today(), start = monday(t0), tkey = ymd(t0);
      gIn.value = String(D.goal); resetDate();
      out.textContent = '';
      out.appendChild(el('h3', '', 'This week'));
      out.appendChild(el('p', 'au-hint', 'Monday ' + nice(start) + ' to Sunday ' + nice(add(start, 6))));
      var vals = [], max = 0;
      for (var i = 0; i < 7; i++) { var k = ymd(add(start, i)), v = mins(D, k); vals.push({ key: k, m: v, day: DAYS[i], future: k > tkey }); if (v > max) max = v; }
      var ul = el('ul', 'tl-week'); ul.setAttribute('aria-label', 'Minutes per day this week');
      vals.forEach(function (x) {
        var li = el('li', 'tl-dayrow' + (x.key === tkey ? ' tl-today' : '')); li.setAttribute('data-day', x.key);
        li.appendChild(el('span', 'acc-sr', x.day + ': ' + x.m + ' minutes' + (x.key === tkey ? ' (today)' : '')));
        var name = el('span', 'tl-name', x.day.slice(0, 3) + (x.key === tkey ? ' (today)' : '')); name.setAttribute('aria-hidden', 'true'); li.appendChild(name);
        var track = el('span', 'tl-track'); track.setAttribute('aria-hidden', 'true');
        var fill = el('span', 'tl-fill'); fill.setAttribute('data-w', String(max ? Math.round(100 * x.m / max) : 0)); track.appendChild(fill); li.appendChild(track);
        var num = el('span', 'tl-num', x.m + ' min'); num.setAttribute('aria-hidden', 'true'); li.appendChild(num);
        var r = D.days[x.key];
        if (r && r.what) { var w = el('span', 'tl-what', r.what); li.appendChild(w); }
        if (x.m) {
          var rm = el('button', 'btn btn-ghost btn-sm tl-rm', 'Remove'); rm.type = 'button'; rm.setAttribute('aria-label', 'Remove ' + x.day + ' time');
          rm.addEventListener('click', function () { remove(x.key, x.day); }); li.appendChild(rm);
        }
        ul.appendChild(li);
      });
      out.appendChild(ul);

      var tot = weekTotal(D, start), pct = Math.round(100 * tot / D.goal);
      var sum = el('div', 'tl-sum');
      sum.appendChild(el('p', 'tl-total', 'This week: ' + tot + ' of ' + D.goal + ' minutes (' + pct + '%)'));
      var prog = el('div', 'acc-prog tl-prog'); prog.setAttribute('role', 'progressbar'); prog.setAttribute('aria-label', 'Weekly goal');
      prog.setAttribute('aria-valuemin', '0'); prog.setAttribute('aria-valuemax', String(D.goal)); prog.setAttribute('aria-valuenow', String(Math.min(tot, D.goal)));
      var ps = el('span'); ps.setAttribute('data-w', String(Math.min(100, pct))); prog.appendChild(ps); sum.appendChild(prog);
      var s = streak(D);
      sum.appendChild(el('p', 'tl-streak', 'Streak: ' + s + (s === 1 ? ' day' : ' days') + ' in a row'));
      if (tot >= D.goal) sum.appendChild(el('p', 'acc-msg tl-met', 'Well done. You met your goal for this week.'));
      else if (tot > 0) sum.appendChild(el('p', 'note', (D.goal - tot) + ' minutes to go this week.'));
      out.appendChild(sum);
      out.appendChild(undoMsg);

      out.appendChild(el('h3', '', 'Last 4 weeks'));
      var wrap = el('div', 'scroll-x tl-table'), tb = el('table'), cap = el('caption', 'acc-sr', 'Minutes per week for the last 4 weeks');
      tb.appendChild(cap);
      var th = el('thead'), hr = el('tr'); ['Week starting', 'Minutes', 'Goal met'].forEach(function (h) { var c = el('th', '', h); c.scope = 'col'; hr.appendChild(c); }); th.appendChild(hr); tb.appendChild(th);
      var bd = el('tbody');
      for (var w = 0; w < 4; w++) {
        var ws = add(start, -7 * w), wt = weekTotal(D, ws), tr = el('tr');
        var c0 = el('th', '', nice(ws) + (w === 0 ? ' (this week)' : '')); c0.scope = 'row'; tr.appendChild(c0);
        tr.appendChild(el('td', '', String(wt))); tr.appendChild(el('td', '', wt >= D.goal ? 'yes' : 'no')); bd.appendChild(tr);
      }
      tb.appendChild(bd); wrap.appendChild(tb); out.appendChild(wrap);
      if (A.paint) A.paint();
    }

    function remove(key, day) {
      var D = load(), old = D.days[key]; if (!old) return;
      delete D.days[key]; store(D);
      clearTimeout(undoTimer);
      draw();
      undoMsg.textContent = '';
      var p = say('Removed ' + day + ' (' + old.m + ' minutes). ');
      var u = el('button', 'btn btn-sm tl-undo-btn', 'Undo'); u.type = 'button';
      u.addEventListener('click', function () {
        clearTimeout(undoTimer); var E = load(), cur = E.days[key];
        E.days[key] = cur ? { m: Math.min(cur.m + old.m, 1440), what: cur.what || old.what || '' } : old; store(E);
        draw(); undoMsg.textContent = ''; undoMsg.appendChild(say('Put back.'));
      });
      p.appendChild(u); undoMsg.appendChild(p); u.focus({ preventScroll: true });
      undoTimer = setTimeout(function () { undoMsg.textContent = ''; }, 5000);
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault(); fMsg.textContent = '';
      var t = ymd(today()), dv = dIn.value, d = parse(dv), m = Number(mIn.value);
      if (!d) { fMsg.appendChild(say('Please pick a date.', true)); dIn.focus(); return; }
      if (dv > t) { fMsg.appendChild(say('That date is in the future. Pick today or an earlier day.', true)); dIn.focus(); return; }
      if (!mIn.value || !isFinite(m) || Math.floor(m) !== m || m < 1 || m > 600) { fMsg.appendChild(say('Minutes must be a whole number from 1 to 600.', true)); mIn.focus(); return; }
      var what = (wIn.value || '').trim(), c = cSel.value;
      if (c && what) what = c + ': ' + what; else if (c) what = c;
      what = what.slice(0, 80);
      var D = load(), r = D.days[dv] || { m: 0, what: '' };
      var w = r.what && what && r.what.indexOf(what) < 0 ? (r.what + '; ' + what).slice(0, 80) : (what || r.what || '');
      D.days[dv] = { m: Math.min(r.m + m, 1440), what: w };
      if (!store(D)) { fMsg.appendChild(say('Could not save in this browser. Your browser may block saving.', true)); return; }
      fMsg.appendChild(say('Added ' + m + ' minutes to ' + DAYS[(d.getDay() + 6) % 7] + ' ' + nice(d) + '.'));
      mIn.value = ''; wIn.value = '';
      draw();
    });

    g.addEventListener('submit', function (e) {
      e.preventDefault(); gMsg.textContent = '';
      var v = Number(gIn.value);
      if (!gIn.value || !isFinite(v) || Math.floor(v) !== v || v < 30 || v > 3000) { gMsg.appendChild(say('The goal must be a whole number from 30 to 3000 minutes.', true)); gIn.focus(); return; }
      var D = load(); D.goal = v;
      if (!store(D)) { gMsg.appendChild(say('Could not save in this browser.', true)); return; }
      draw(); gMsg.appendChild(say('Goal saved: ' + v + ' minutes a week.'));
    });

    draw();
  });
})();
