/* Test pay-to-access for course pages. TEST ONLY: no real money, no payment provider. State stays in this browser (localStorage hfl_access).
   A course page shows the outline plus the first module as a preview. After the test payment the SAME page opens every module, with progress. */
(function () {
  var KEY = 'hfl_access';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function signedIn() { return /(?:^|; )hfl_in=1/.test(document.cookie); }
  var file = (location.pathname.split('/').pop() || 'index.html');
  window.HFLAccess = { load: load, save: save, signedIn: signedIn };
  if (/^(pay|members-courses)\.html$/.test(file)) return;
  // Lesson series (one lesson per page, e.g. Electrical academy, Career Launch). The builder sets data-series (the series hub file), data-lesson, data-lessons, data-title on <main>.
  // Lesson 1 is the free preview. Joining the series (test payment on pay.html) opens every lesson, with a Done tick per lesson.
  var sm = document.querySelector('main[data-series]');
  if (sm) {
    var skey = sm.getAttribute('data-series'), sn = parseInt(sm.getAttribute('data-lesson'), 10) || 1, st = parseInt(sm.getAttribute('data-lessons'), 10) || 1, stitle = sm.getAttribute('data-title') || skey;
    var sstate = load(), srec = sstate[skey], spaid = !!(srec && srec.paid);
    var shero = sm.querySelector('.hero') || sm.firstElementChild;
    var sbar = document.createElement('section'); sbar.className = 'acc-bar'; sbar.setAttribute('aria-live', 'polite');
    if (shero && shero.parentNode) shero.parentNode.insertBefore(sbar, shero.nextSibling); else sm.insertBefore(sbar, sm.firstChild);
    if (!spaid && sn > 1) {
      var after = false; Array.prototype.slice.call((shero && shero.parentNode ? shero.parentNode : sm).children).forEach(function (c) { if (c === shero) { after = true; return; } if (after && c !== sbar) c.classList.add('acc-hidden'); });
    }
    if (!spaid) {
      sbar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">Preview</p><p class="acc-t">' + (sn > 1 ? 'This lesson is part of ' + stitle + '. Join to open all ' + st + ' lessons.' : 'Lesson 1 of ' + st + ' is a free preview. Join ' + stitle + ' to open all ' + st + ' lessons.') + '</p></div><div class="acc-act"></div></div>';
      var sa = document.createElement('a'); sa.className = 'btn';
      if (signedIn()) { sa.href = 'pay.html?course=' + encodeURIComponent(skey) + '&t=' + encodeURIComponent(stitle); sa.textContent = 'Join this course'; } else { sa.href = 'login.html'; sa.textContent = 'Sign in to join'; }
      sbar.querySelector('.acc-act').appendChild(sa);
      var sno = document.createElement('p'); sno.className = 'acc-note'; sno.textContent = 'Test only. No real money is taken.'; sbar.querySelector('.acc-act').appendChild(sno);
    } else {
      var sdone = srec.done || [];
      var sdraw = function () {
        var c = sdone.length;
        sbar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">' + (c ? 'Your course' : 'You are in') + '</p><p class="acc-t">Lesson ' + sn + ' of ' + st + '. ' + c + ' of ' + st + ' done.' + (c === st ? ' Course complete.' : '') + '</p><div class="acc-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + st + '" aria-valuenow="' + c + '"><span style="width:' + Math.round(100 * c / st) + '%"></span></div></div><div class="acc-act"></div></div>';
        var act = sbar.querySelector('.acc-act'), lab = document.createElement('label'); lab.className = 'acc-done';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = sdone.indexOf(sn) >= 0;
        cb.addEventListener('change', function () { var p = sdone.indexOf(sn); if (cb.checked && p < 0) sdone.push(sn); if (!cb.checked && p >= 0) sdone.splice(p, 1); sdraw(); });
        lab.appendChild(cb); lab.appendChild(document.createTextNode(' Done')); act.appendChild(lab);
        var l = document.createElement('a'); l.href = 'members-courses.html'; l.className = 'acc-link'; l.textContent = 'My courses'; act.appendChild(l);
        sstate = load(); sstate[skey] = { paid: true, title: stitle, total: st, done: sdone, paidAt: srec.paidAt || Date.now(), updated: Date.now() }; save(sstate);
      };
      sdraw();
    }
    return;
  }
  var mods = Array.prototype.slice.call(document.querySelectorAll('details.mod'));
  if (!mods.length) return;
  var numbered = mods.filter(function (d) { var m = d.querySelector('summary .mn'); return m && /^(Module|Session|Unit|Part)\s+\d+/.test(m.textContent.trim()); });
  if (!numbered.length) return;
  var title = (document.querySelector('h1') || {}).textContent || file;
  title = title.trim();
  var main = document.getElementById('main') || document.body;
  var hero = main.querySelector('.hero') || main.firstElementChild;
  var state = load(), rec = state[file];
  var paid = !!(rec && rec.paid);
  var first = numbered[0];
  var firstOfModules = numbered.filter(function (d) { return /^(Module|Session|Unit|Part)\s+1$/.test(d.querySelector('summary .mn').textContent.trim()); })[0] || first;
  var rubric = Array.prototype.slice.call(document.querySelectorAll('.scroll-x, table.rubric, table.ws-table'));

  var bar = document.createElement('section');
  bar.className = 'acc-bar'; bar.setAttribute('aria-live', 'polite');
  if (hero && hero.parentNode) hero.parentNode.insertBefore(bar, hero.nextSibling); else main.insertBefore(bar, main.firstChild);

  function pill(txt) { var s = document.createElement('span'); s.className = 'acc-lock'; s.textContent = txt; return s; }
  function joinHref() { return 'pay.html?course=' + encodeURIComponent(file) + '&t=' + encodeURIComponent(title); }

  function lockAll() {
    mods.forEach(function (d) {
      if (d === firstOfModules) return;
      d.classList.add('acc-locked'); d.open = false;
      var s = d.querySelector('summary'); if (s && !s.querySelector('.acc-lock')) s.appendChild(pill('Locked'));
    });
    rubric.forEach(function (r) { r.classList.add('acc-hidden'); });
    bar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">Preview</p><p class="acc-t">You are reading the outline and Module 1. Join this course to open every module, the checks and the marking table.</p></div><div class="acc-act"></div></div>';
    var act = bar.querySelector('.acc-act'), a = document.createElement('a');
    a.className = 'btn';
    if (signedIn()) { a.href = joinHref(); a.textContent = 'Join this course'; }
    else { a.href = 'login.html'; a.textContent = 'Sign in to join'; }
    act.appendChild(a);
    var n = document.createElement('p'); n.className = 'acc-note'; n.textContent = 'Test only. No real money is taken.'; act.appendChild(n);
  }
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  var say = document.createElement('p'); say.className = 'acc-sr'; say.setAttribute('role', 'status'); if (bar.parentNode) bar.parentNode.insertBefore(say, bar.nextSibling);
  document.addEventListener('click', function (e) {
    var s = e.target.closest && e.target.closest('details.acc-locked > summary');
    if (!s) return;
    e.preventDefault();
    say.textContent = ''; setTimeout(function () { say.textContent = 'This part is locked. Join this course to open it.'; }, 30);
    var jl = bar.querySelector('a.btn'); if (jl) jl.focus({ preventScroll: true });
    bar.scrollIntoView({ behavior: calm, block: 'center' });
    bar.classList.add('acc-flash'); setTimeout(function () { bar.classList.remove('acc-flash'); }, 900);
  });

  function unlock() {
    var done = rec.done || [];
    function refresh() {
      var c = done.length, t = numbered.length;
      var nextIdx = -1; for (var i = 0; i < numbered.length; i++) if (done.indexOf(i) < 0) { nextIdx = i; break; }
      bar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">' + (c ? 'Your course' : 'You are in') + '</p><p class="acc-t">' + c + ' of ' + t + ' done.' + (c === t ? ' Course complete.' : '') + '</p><div class="acc-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + t + '" aria-valuenow="' + c + '"><span style="width:' + Math.round(100 * c / t) + '%"></span></div></div><div class="acc-act"></div></div>';
      var act = bar.querySelector('.acc-act'), b = document.createElement('button');
      b.type = 'button'; b.className = 'btn'; b.textContent = c === 0 ? 'Start' : (c === t ? 'Review' : 'Continue');
      b.addEventListener('click', function () { var d = numbered[nextIdx < 0 ? 0 : nextIdx]; d.open = true; d.scrollIntoView({ behavior: calm, block: 'start' }); var sm0 = d.querySelector('summary'); if (sm0) sm0.focus({ preventScroll: true }); });
      act.appendChild(b);
      var l = document.createElement('a'); l.href = 'members-courses.html'; l.className = 'acc-link'; l.textContent = 'My courses'; act.appendChild(l);
      state = load(); state[file] = { paid: true, title: title, total: t, done: done, paidAt: rec.paidAt || Date.now(), updated: Date.now() }; save(state);
    }
    numbered.forEach(function (d, i) {
      var s = d.querySelector('summary'); if (!s || s.querySelector('.acc-done')) return;
      var lab = document.createElement('label'); lab.className = 'acc-done';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = done.indexOf(i) >= 0; cb.setAttribute('aria-label', 'Mark as done: ' + (function () { var c = s.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('.pill,.acc-done,.acc-lock'), function (x) { x.remove(); }); return c.textContent.replace(/\s+/g, ' ').trim().slice(0, 90); })());
      cb.addEventListener('click', function (e) { e.stopPropagation(); });
      cb.addEventListener('change', function () { var p = done.indexOf(i); if (cb.checked && p < 0) done.push(i); if (!cb.checked && p >= 0) done.splice(p, 1); refresh(); });
      lab.addEventListener('click', function (e) { e.stopPropagation(); });
      lab.appendChild(cb); lab.appendChild(document.createTextNode(' Done')); s.appendChild(lab);
    });
    refresh();
  }
  if (paid) unlock(); else lockAll();
})();
