/* Learning core in the browser. Course pages show the outline plus the first unit as a preview; after joining, the SAME page opens every unit,
   with a Done tick per unit, progress and resume. When a member is really signed in, joining and progress are kept in the member's account
   (server: /api/lms, database: Supabase). When only the test sign-in is used, or the server is not switched on, everything stays in this
   browser (localStorage hfl_access) so the pages still work. TEST ONLY: no real money, no payment provider. */
(function () {
  var KEY = 'hfl_access', API = '/api/lms';
  function lload() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function lsave(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function signedIn() { return /(?:^|; )hfl_in=1/.test(document.cookie); }
  var file = (location.pathname.split('/').pop() || 'index.html'); if (file.indexOf('.') < 0) file += '.html'; /* Netlify may show /course-eu-01 without .html */
  /* the bar, progress and lock styles live in courses.css: make sure every page that uses this script has them */
  (function () {
    var me = document.querySelector('script[src$="access.js"]'); if (!me) return;
    if (Array.prototype.some.call(document.querySelectorAll('link[rel=stylesheet]'), function (l) { return /courses\.css/.test(l.getAttribute('href') || ''); })) return;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = me.getAttribute('src').replace(/access\.js$/, 'courses.css'); document.head.appendChild(l);
  })();
  var mode = 'local', S = null, synced = {}, timer = null;
  function call(body) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  function lastOf(done, total) { if (!done.length) return 0; return Math.min(Math.max.apply(null, done) + 1, Math.max(total - 1, 0)); }
  function pushProgress(d) {
    if (mode !== 'server') return;
    Object.keys(d).forEach(function (k) {
      var r = d[k]; if (!r || !r.paid || !r.total) return;
      var sig = JSON.stringify([r.done || [], r.total]); if (synced[k] === sig) return;
      synced[k] = sig;
      call({ action: 'progress', course: k, total: r.total, done: r.done || [], last: lastOf(r.done || [], r.total) }).then(function (x) { if (x.enrolment && S) mergeOne(x.enrolment); }).catch(function () { delete synced[k]; });
    });
  }
  function save(d) { lsave(d); if (mode === 'server') { clearTimeout(timer); timer = setTimeout(function () { pushProgress(d); }, 300); } }
  function mergeOne(e) {
    var d = lload(); var r = d[e.course] || {};
    d[e.course] = { paid: true, title: e.title, total: e.total, done: e.done || [], paidAt: r.paidAt || Date.parse(e.enrolledAt) || Date.now(), updated: Date.parse(e.updatedAt) || Date.now(), server: true };
    synced[e.course] = JSON.stringify([e.done || [], e.total]);
    lsave(d);
    if (S) { var i = -1; (S.enrolments || []).forEach(function (x, n) { if (x.course === e.course) i = n; }); if (i > -1) S.enrolments[i] = Object.assign({}, S.enrolments[i], e); else S.enrolments.unshift(e); }
  }
  window.addEventListener('pagehide', function () { if (mode === 'server') { clearTimeout(timer); pushProgress(lload()); } });
  window.HFLAccess = {
    load: lload, save: save, signedIn: signedIn, call: call,
    get mode() { return mode; }, get server() { return S; },
    /* Join a course. Server mode: recorded in the member's account. Local mode: recorded in this browser. Resolves to true when joined. */
    enrol: function (course, title, total, method, ref) {
      var d = lload(), r = d[course] || {};
      function local() { d = lload(); d[course] = { paid: true, title: title, total: total || r.total || 0, done: r.done || [], paidAt: Date.now(), updated: Date.now() }; lsave(d); return true; }
      if (mode !== 'server') return Promise.resolve(local());
      return call({ action: 'enrol', course: course, title: title, total: total || r.total || 1, method: method, ref: ref }).then(function (x) {
        if (x.enrolment) { mergeOne(x.enrolment); if (r.done && r.done.length && !(x.enrolment.done || []).length) { var dd = lload(); dd[course].done = r.done; dd[course].total = x.enrolment.total; lsave(dd); pushProgress(dd); } return true; }
        return false;
      });
    },
    ready: null
  };
  var ready = new Promise(function (resolve) {
    if (!signedIn()) return resolve();
    var done = false, to = setTimeout(function () { if (!done) { done = true; resolve(); } }, 4000);
    call({ action: 'state' }).then(function (x) {
      if (done) return; done = true; clearTimeout(to);
      if (x.status === 200 && x.enrolments) {
        mode = 'server'; S = x;
        var d = lload();
        x.enrolments.forEach(function (e) { d[e.course] = { paid: true, title: e.title, total: e.total, done: e.done || [], paidAt: Date.parse(e.enrolledAt) || Date.now(), updated: Date.parse(e.updatedAt) || Date.now(), server: true }; synced[e.course] = JSON.stringify([e.done || [], e.total]); });
        lsave(d);
        /* courses joined in this browser before the account was linked: bring them across once */
        var have = {}; x.enrolments.forEach(function (e) { have[e.course] = 1; });
        Object.keys(d).forEach(function (k) { var r = d[k]; if (r && r.paid && !r.server && !have[k]) { call({ action: 'enrol', course: k, title: r.title || k, total: r.total || 1, method: 'bank', ref: 'moved-from-browser' }).then(function (y) { if (y.enrolment) { synced[k] = ''; pushProgress(lload()); } }); } });
      }
      resolve();
    }).catch(function () { if (!done) { done = true; clearTimeout(to); resolve(); } });
  });
  function extras(act, key, c, t) {
    var q = document.createElement('a'); q.className = 'acc-link'; q.href = 'quiz.html?course=' + encodeURIComponent(key); q.textContent = c >= t ? 'Take the final check' : 'Final check'; act.appendChild(q);
    var cert = S && (S.certificates || []).filter(function (x) { return x.course === key; })[0];
    if (cert) { var ce = document.createElement('a'); ce.className = 'acc-link'; ce.href = 'certificate.html?code=' + encodeURIComponent(cert.code); ce.textContent = 'My certificate'; act.appendChild(ce); }
    if (mode !== 'server') { var n = document.createElement('p'); n.className = 'acc-note'; n.textContent = 'Test mode: your progress is saved in this browser only. Sign in with your member account to keep it in your account.'; act.appendChild(n); }
  }
  window.HFLAccess.ready = ready;
  /* The site's security rules (CSP) block style="" written into HTML, so bar widths are set here from data-w. */
  function paint() { Array.prototype.forEach.call(document.querySelectorAll('[data-w]'), function (e) { var w = e.getAttribute('data-w') + '%'; if (e.style.width !== w) e.style.width = w; }); }
  window.HFLAccess.paint = paint;
  if (window.MutationObserver) new MutationObserver(paint).observe(document.documentElement, { childList: true, subtree: true });
  if (/^(pay|members-courses)\.html$/.test(file)) return;
  ready.then(init);
  function init() {
  // Lesson series (one lesson per page, e.g. Electrical academy, Career Launch). The builder sets data-series (the series hub file), data-lesson, data-lessons, data-title on <main>.
  // Lesson 1 is the free preview. Joining the series (test payment on pay.html) opens every lesson, with a Done tick per lesson.
  var sm = document.querySelector('main[data-series]');
  if (sm) {
    var skey = sm.getAttribute('data-series'), sn = parseInt(sm.getAttribute('data-lesson'), 10) || 1, st = parseInt(sm.getAttribute('data-lessons'), 10) || 1, stitle = sm.getAttribute('data-title') || skey;
    var sstate = lload(), srec = sstate[skey], spaid = !!(srec && srec.paid);
    var shero = sm.querySelector('.hero') || sm.firstElementChild;
    var sbar = document.createElement('section'); sbar.className = 'acc-bar'; sbar.setAttribute('aria-live', 'polite');
    if (shero && shero.parentNode) shero.parentNode.insertBefore(sbar, shero.nextSibling); else sm.insertBefore(sbar, sm.firstChild);
    if (!spaid && sn > 1) {
      var after = false; Array.prototype.slice.call((shero && shero.parentNode ? shero.parentNode : sm).children).forEach(function (c) { if (c === shero) { after = true; return; } if (after && c !== sbar) c.classList.add('acc-hidden'); });
    }
    if (!spaid) {
      sbar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">Preview</p><p class="acc-t">' + (sn > 1 ? 'This lesson is part of ' + stitle + '. Join to open all ' + st + ' lessons.' : 'Lesson 1 of ' + st + ' is a free preview. Join ' + stitle + ' to open all ' + st + ' lessons.') + '</p></div><div class="acc-act"></div></div>';
      var sa = document.createElement('a'); sa.className = 'btn';
      if (signedIn()) { sa.href = 'pay.html?course=' + encodeURIComponent(skey) + '&t=' + encodeURIComponent(stitle) + '&n=' + st; sa.textContent = 'Join this course'; } else { sa.href = 'login.html?next=' + encodeURIComponent(file); sa.textContent = 'Sign in to join'; }
      sbar.querySelector('.acc-act').appendChild(sa);
      var sno = document.createElement('p'); sno.className = 'acc-note'; sno.textContent = 'Test only. No real money is taken.'; sbar.querySelector('.acc-act').appendChild(sno);
    } else {
      var sdone = srec.done || [];
      var sdraw = function () {
        var c = sdone.length;
        sbar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">' + (c ? 'Your course' : 'You are in') + '</p><p class="acc-t">Lesson ' + sn + ' of ' + st + '. ' + c + ' of ' + st + ' done.' + (c === st ? ' Course complete.' : ' Tick Done under each lesson when you finish it.') + '</p><div class="acc-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + st + '" aria-valuenow="' + c + '"><span data-w="' + Math.round(100 * c / st) + '"></span></div></div><div class="acc-act"></div></div>';
        var act = sbar.querySelector('.acc-act'), lab = document.createElement('label'); lab.className = 'acc-done';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = sdone.indexOf(sn) >= 0;
        cb.addEventListener('change', function () { var p = sdone.indexOf(sn); if (cb.checked && p < 0) sdone.push(sn); if (!cb.checked && p >= 0) sdone.splice(p, 1); sdraw(); });
        lab.appendChild(cb); lab.appendChild(document.createTextNode(' Done')); act.appendChild(lab);
        var l = document.createElement('a'); l.href = 'members-courses.html'; l.className = 'acc-link'; l.textContent = 'My courses'; act.appendChild(l); extras(act, skey, c, st);
        sstate = lload(); sstate[skey] = { paid: true, title: stitle, total: st, done: sdone, paidAt: srec.paidAt || Date.now(), updated: Date.now() }; save(sstate);
      };
      sdraw();
    }
    return;
  }
  var mods = Array.prototype.slice.call(document.querySelectorAll('details.mod'));
  if (!mods.length) {
    /* Step-table courses: the "Lesson outline" table is the course, one row per step. Steps 1 and 2 are the free preview. */
    var tb = Array.prototype.filter.call(document.querySelectorAll('table.ws-table'), function (t) { var c = t.querySelector('caption'); return c && /Lesson outline/i.test(c.textContent); })[0];
    var rows = tb ? Array.prototype.slice.call(tb.querySelectorAll('tbody tr')) : [];
    if (rows.length < 2) return;
    var ttl = ((document.querySelector('h1') || {}).textContent || file).trim(), tmain = document.getElementById('main') || document.body, thero = tmain.querySelector('.hero') || tmain.firstElementChild;
    var tst = lload(), trec = tst[file], tpaid = !!(trec && trec.paid), T = rows.length, tdone = (trec && trec.done) || [];
    var tbar = document.createElement('section'); tbar.className = 'acc-bar'; tbar.setAttribute('aria-live', 'polite');
    if (thero && thero.parentNode) thero.parentNode.insertBefore(tbar, thero.nextSibling); else tmain.insertBefore(tbar, tmain.firstChild);
    var orig = rows.map(function (r) { return r.innerHTML; });
    function tdraw() {
      var c = tdone.length;
      if (!tpaid) {
        rows.forEach(function (r, i) { if (i < 2) return; r.classList.add('acc-locked'); r.innerHTML = '<th scope="row">' + (i + 1) + '</th><td colspan="4"><span class="acc-lock">Locked</span> Join this course to open this step.</td>'; });
        tbar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">Preview</p><p class="acc-t">You can read steps 1 and 2. Join this course to open all ' + T + ' steps and tick them off.</p></div><div class="acc-act"></div></div>';
        var a = document.createElement('a'); a.className = 'btn';
        if (signedIn()) { a.href = 'pay.html?course=' + encodeURIComponent(file) + '&t=' + encodeURIComponent(ttl) + '&n=' + T; a.textContent = 'Join this course'; } else { a.href = 'login.html?next=' + encodeURIComponent(file); a.textContent = 'Sign in to join'; }
        tbar.querySelector('.acc-act').appendChild(a);
        var nn = document.createElement('p'); nn.className = 'acc-note'; nn.textContent = 'Test only. No real money is taken.'; tbar.querySelector('.acc-act').appendChild(nn);
        return;
      }
      tbar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">' + (c ? 'Your course' : 'You are in') + '</p><p class="acc-t">' + c + ' of ' + T + ' steps done.' + (c === T ? ' Course complete.' : ' Tick Done at the end of each step below.') + '</p><div class="acc-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + T + '" aria-valuenow="' + c + '"><span data-w="' + Math.round(100 * c / T) + '"></span></div></div><div class="acc-act"></div></div>';
      var act = tbar.querySelector('.acc-act'), l = document.createElement('a'); l.href = 'members-courses.html'; l.className = 'acc-link'; l.textContent = 'My courses'; act.appendChild(l); extras(act, file, c, T);
      rows.forEach(function (r, i) {
        r.classList.remove('acc-locked'); r.innerHTML = orig[i];
        var last = r.lastElementChild, lab = document.createElement('label'); lab.className = 'acc-done';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = tdone.indexOf(i) >= 0; cb.setAttribute('aria-label', 'Mark step ' + (i + 1) + ' as done');
        cb.addEventListener('change', function () { var p = tdone.indexOf(i); if (cb.checked && p < 0) tdone.push(i); if (!cb.checked && p >= 0) tdone.splice(p, 1); tdraw(); });
        lab.appendChild(cb); lab.appendChild(document.createTextNode(' Done')); last.appendChild(document.createElement('br')); last.appendChild(lab);
      });
      tst = lload(); tst[file] = { paid: true, title: ttl, total: T, done: tdone, paidAt: trec.paidAt || Date.now(), updated: Date.now(), server: trec.server }; save(tst);
    }
    tdraw();
    return;
  }
  var numbered = mods.filter(function (d) { var m = d.querySelector('summary .mn'); return m && /^(Module|Session|Unit|Part)\s+\d+/.test(m.textContent.trim()); });
  if (!numbered.length) return;
  var title = (document.querySelector('h1') || {}).textContent || file;
  title = title.trim();
  var main = document.getElementById('main') || document.body;
  var hero = main.querySelector('.hero') || main.firstElementChild;
  var state = lload(), rec = state[file];
  var paid = !!(rec && rec.paid);
  var first = numbered[0];
  var firstOfModules = numbered.filter(function (d) { return /^(Module|Session|Unit|Part)\s+1$/.test(d.querySelector('summary .mn').textContent.trim()); })[0] || first;
  var rubric = Array.prototype.slice.call(document.querySelectorAll('.scroll-x, table.rubric, table.ws-table'));

  var bar = document.createElement('section');
  bar.className = 'acc-bar'; bar.setAttribute('aria-live', 'polite');
  if (hero && hero.parentNode) hero.parentNode.insertBefore(bar, hero.nextSibling); else main.insertBefore(bar, main.firstChild);

  function pill(txt) { var s = document.createElement('span'); s.className = 'acc-lock'; s.textContent = txt; return s; }
  function joinHref() { return 'pay.html?course=' + encodeURIComponent(file) + '&t=' + encodeURIComponent(title) + '&n=' + numbered.length; }

  // Teaser: each locked module gets a "Preview" button. It shows the module goal (its first paragraph) and its one worked example (.evi).
  // Nothing else is shown: no activity, no standard, no checks, no marking table. Added only, nothing removed. Built from text already on the page.
  function addPeeks() {
    mods.forEach(function (d, i) {
      if (!d.classList.contains('acc-locked')) return;
      var s = d.querySelector('summary'); if (!s || s.querySelector('.acc-peek')) return;
      var goal = d.querySelector(':scope > p'), ex = d.querySelector(':scope > .evi');
      if (!goal && !ex) return;
      var id = 'acc-peek-' + i, panel = document.createElement('div');
      panel.className = 'acc-peekbox'; panel.id = id; panel.hidden = true; panel.setAttribute('role', 'region');
      panel.setAttribute('aria-label', 'Preview of ' + (s.querySelector('.mn') || {textContent: 'this module'}).textContent.trim());
      var k = document.createElement('p'); k.className = 'acc-k'; k.textContent = 'Preview. Goal'; panel.appendChild(k);
      if (goal) { var g = document.createElement('p'); g.textContent = goal.textContent; panel.appendChild(g); }
      if (ex) { var e = document.createElement('div'); e.className = 'evi'; e.textContent = ex.textContent; panel.appendChild(e); }
      var j = document.createElement('p'); j.className = 'acc-note'; j.textContent = 'This is a taste only. Join this course to open the full module, the activity, the checks and the marking table.';
      panel.appendChild(j);
      d.parentNode.insertBefore(panel, d.nextSibling);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'acc-peek'; b.textContent = 'Preview';
      b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', id);
      b.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        var open = panel.hidden; panel.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false'); b.textContent = open ? 'Hide preview' : 'Preview';
      });
      b.addEventListener('keydown', function (ev) { ev.stopPropagation(); });
      s.appendChild(b);
    });
  }

  function lockAll() {
    mods.forEach(function (d) {
      if (d === firstOfModules) return;
      d.classList.add('acc-locked'); d.open = false;
      var s = d.querySelector('summary'); if (s && !s.querySelector('.acc-lock')) s.appendChild(pill('Locked'));
    });
    rubric.forEach(function (r) { r.classList.add('acc-hidden'); });
    addPeeks();
    bar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">Preview</p><p class="acc-t">You are reading the outline and Module 1. Join this course to open every module, the checks and the marking table.</p></div><div class="acc-act"></div></div>';
    var act = bar.querySelector('.acc-act'), a = document.createElement('a');
    a.className = 'btn';
    if (signedIn()) { a.href = joinHref(); a.textContent = 'Join this course'; }
    else { a.href = 'login.html?next=' + encodeURIComponent(file); a.textContent = 'Sign in to join'; }
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
      bar.innerHTML = '<div class="wrap acc-in"><div><p class="acc-k">' + (c ? 'Your course' : 'You are in') + '</p><p class="acc-t">' + c + ' of ' + t + ' done.' + (c === t ? ' Course complete.' : ' Tick Done at the end of each one below.') + '</p><div class="acc-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + t + '" aria-valuenow="' + c + '"><span data-w="' + Math.round(100 * c / t) + '"></span></div></div><div class="acc-act"></div></div>';
      var act = bar.querySelector('.acc-act'), b = document.createElement('button');
      b.type = 'button'; b.className = 'btn'; b.textContent = c === 0 ? 'Start' : (c === t ? 'Review' : 'Continue');
      b.addEventListener('click', function () { var d = numbered[nextIdx < 0 ? 0 : nextIdx]; d.open = true; d.scrollIntoView({ behavior: calm, block: 'start' }); var sm0 = d.querySelector('summary'); if (sm0) sm0.focus({ preventScroll: true }); });
      act.appendChild(b);
      var l = document.createElement('a'); l.href = 'members-courses.html'; l.className = 'acc-link'; l.textContent = 'My courses'; act.appendChild(l); extras(act, file, c, t);
      state = lload(); state[file] = { paid: true, title: title, total: t, done: done, paidAt: rec.paidAt || Date.now(), updated: Date.now() }; save(state);
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
  }
  /* A small always-visible line at the bottom of the screen, so progress ("Progress: 1 of 9 steps done") is seen while ticking Done far down the page. */
  var pill = null;
  function paintPill() {
    var bar = document.querySelector('.acc-bar'), t = bar && bar.querySelector('.acc-t');
    if (!t || !bar.querySelector('.acc-prog')) { if (pill) pill.hidden = true; return; }
    var m = /\d+ of \d+[a-z ]*done/i.exec(t.textContent || '');
    if (!m) { if (pill) pill.hidden = true; return; }
    if (!pill) { pill = document.createElement('div'); pill.className = 'acc-pill'; pill.setAttribute('role', 'status'); pill.setAttribute('aria-live', 'polite'); document.body.appendChild(pill); }
    var txt = 'Progress: ' + m[0]; if (pill.textContent !== txt) pill.textContent = txt; pill.hidden = false;
  }
  setInterval(paintPill, 500); paintPill();
})();
