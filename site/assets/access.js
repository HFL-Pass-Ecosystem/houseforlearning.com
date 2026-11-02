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
  var mods = Array.prototype.slice.call(document.querySelectorAll('details.mod'));
  if (!mods.length) return;
  var numbered = mods.filter(function (d) { var m = d.querySelector('summary .mn'); return m && /^(Module|Session|Unit)\s+\d+/.test(m.textContent.trim()); });
  if (!numbered.length) return;
  var title = (document.querySelector('h1') || {}).textContent || file;
  title = title.trim();
  var main = document.getElementById('main') || document.body;
  var hero = main.querySelector('.hero') || main.firstElementChild;
  var state = load(), rec = state[file];
  var paid = !!(rec && rec.paid);
  var first = numbered[0];
  var firstOfModules = numbered.filter(function (d) { return /^(Module|Session|Unit)\s+1$/.test(d.querySelector('summary .mn').textContent.trim()); })[0] || first;
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
  document.addEventListener('click', function (e) {
    var s = e.target.closest && e.target.closest('details.acc-locked > summary');
    if (!s) return;
    e.preventDefault();
    bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      b.addEventListener('click', function () { var d = numbered[nextIdx < 0 ? 0 : nextIdx]; d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      act.appendChild(b);
      var l = document.createElement('a'); l.href = 'members-courses.html'; l.className = 'acc-link'; l.textContent = 'My courses'; act.appendChild(l);
      state = load(); state[file] = { paid: true, title: title, total: t, done: done, paidAt: rec.paidAt || Date.now(), updated: Date.now() }; save(state);
    }
    numbered.forEach(function (d, i) {
      var s = d.querySelector('summary'); if (!s || s.querySelector('.acc-done')) return;
      var lab = document.createElement('label'); lab.className = 'acc-done';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = done.indexOf(i) >= 0;
      cb.addEventListener('click', function (e) { e.stopPropagation(); });
      cb.addEventListener('change', function () { var p = done.indexOf(i); if (cb.checked && p < 0) done.push(i); if (!cb.checked && p >= 0) done.splice(p, 1); refresh(); });
      lab.addEventListener('click', function (e) { e.stopPropagation(); });
      lab.appendChild(cb); lab.appendChild(document.createTextNode(' Done')); s.appendChild(lab);
    });
    refresh();
  }
  if (paid) unlock(); else lockAll();
})();
