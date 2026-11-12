/* Find a course (find.html): search every course that has a final check, filter by area, open it.
   Reads assets/course-index.json (built by tools/build_course_index.py). Works signed out.
   Courses joined in this browser or account get a "Joined" mark and a Continue button.
   Text is set with textContent only. No inline script or style. Nothing is sent anywhere. */
(function () {
  var main = document.querySelector('main[data-lms="find"]'); if (!main) return;
  var box = document.getElementById('lms-box'); if (!box) return;
  var PAGE = 50;
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function words(s) { return String(s || '').toLowerCase().split(/[^a-z0-9À-￿]+/).filter(Boolean); }
  function joinedSet() {
    var out = {}, A = window.HFLAccess;
    if (!A) return out;
    try { var d = A.load() || {}; Object.keys(d).forEach(function (k) { if (d[k] && d[k].paid) out[k] = 1; }); } catch (e) { /* nothing joined */ }
    try { var S = A.mode === 'server' && A.server; if (S && S.enrolments) S.enrolments.forEach(function (x) { if (x && x.course) out[x.course] = 1; }); } catch (e) { /* signed out */ }
    return out;
  }
  function fail(msg) { box.textContent = ''; box.appendChild(el('p', 'acc-msg bad', msg)); }

  fetch('assets/course-index.json', { credentials: 'same-origin' }).then(function (r) {
    if (!r.ok) throw new Error('index ' + r.status); return r.json();
  }).then(function (rows) {
    if (!Array.isArray(rows) || !rows.length) return fail('No courses to show yet. Please try again later.');
    rows.forEach(function (r) { r.w = words(r.t).join(' '); });
    var areas = []; rows.forEach(function (r) { if (areas.indexOf(r.a) < 0) areas.push(r.a); }); areas.sort();
    var joined = {}, shown = PAGE;

    box.textContent = '';
    box.classList.add('cf-box');
    var wrap = el('div', 'cf-wrap');
    var form = el('form', 'cf-form'); form.setAttribute('role', 'search'); form.setAttribute('aria-label', 'Find a course');
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    var l1 = el('label', 'cf-field'); l1.setAttribute('for', 'cf-q'); l1.appendChild(el('span', 'cf-lab', 'Search courses'));
    var q = el('input', 'cf-q'); q.type = 'search'; q.id = 'cf-q'; q.name = 'q'; q.autocomplete = 'off'; q.placeholder = 'For example: food, lead, grade 5';
    l1.appendChild(q);
    var l2 = el('label', 'cf-field'); l2.setAttribute('for', 'cf-area'); l2.appendChild(el('span', 'cf-lab', 'Area'));
    var sel = el('select', 'cf-area'); sel.id = 'cf-area'; sel.name = 'area';
    var o0 = el('option', '', 'All areas'); o0.value = ''; sel.appendChild(o0);
    areas.forEach(function (a) { var n = rows.filter(function (r) { return r.a === a; }).length; var o = el('option', '', a + ' (' + n + ')'); o.value = a; sel.appendChild(o); });
    l2.appendChild(sel);
    form.appendChild(l1); form.appendChild(l2);
    var count = el('p', 'note cf-count'); count.setAttribute('aria-live', 'polite'); count.id = 'cf-count';
    var list = el('ul', 'cf-list'); list.setAttribute('aria-labelledby', 'cf-count');
    var more = el('button', 'btn btn-ghost cf-more', 'Show more'); more.type = 'button'; more.hidden = true;
    wrap.appendChild(form); wrap.appendChild(count); wrap.appendChild(list); wrap.appendChild(more);
    box.appendChild(wrap);

    function matches() {
      var ws = words(q.value), a = sel.value;
      return rows.filter(function (r) {
        if (a && r.a !== a) return false;
        for (var i = 0; i < ws.length; i++) if (r.w.indexOf(ws[i]) < 0) return false;
        return true;
      });
    }
    function card(r) {
      var li = el('li', 'cf-item');
      var head = el('div', 'cf-main');
      var h = el('h3', 'cf-title', r.t); head.appendChild(h);
      var meta = el('p', 'cf-meta');
      meta.appendChild(el('span', 'cf-areatag', r.a));
      meta.appendChild(document.createTextNode(' · '));
      meta.appendChild(el('span', 'cf-q-n', 'Final check: ' + r.q + ' question' + (r.q === 1 ? '' : 's')));
      head.appendChild(meta);
      var act = el('div', 'cf-act');
      var isIn = !!joined[r.c];
      if (isIn) { var j = el('span', 'cf-joined', 'Joined'); act.appendChild(j); }
      var open = el('a', 'btn btn-sm' + (isIn ? ' btn-ghost' : ''), 'Open the course'); open.href = r.c; open.setAttribute('aria-label', 'Open the course: ' + r.t); act.appendChild(open);
      if (isIn) { var c = el('a', 'btn btn-sm cf-continue', 'Continue'); c.href = r.c; c.setAttribute('aria-label', 'Continue: ' + r.t); act.appendChild(c); }
      li.appendChild(head); li.appendChild(act);
      return li;
    }
    function draw() {
      var m = matches(), n = Math.min(shown, m.length);
      list.textContent = '';
      for (var i = 0; i < n; i++) list.appendChild(card(m[i]));
      count.textContent = m.length ? 'Showing ' + n + ' of ' + m.length + ' course' + (m.length === 1 ? '' : 's') + '.' : 'No courses match. Try fewer or shorter words, or pick All areas.';
      more.hidden = n >= m.length;
      if (!more.hidden) more.textContent = 'Show more (' + Math.min(PAGE, m.length - n) + ' more)';
    }
    function reset() { shown = PAGE; draw(); }
    var t = null;
    q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(reset, 120); });
    sel.addEventListener('change', reset);
    more.addEventListener('click', function () {
      var before = list.children.length; shown += PAGE; draw();
      var first = list.children[before]; if (first) { var a = first.querySelector('a'); if (a) a.focus(); }
    });

    try {
      var p = new URLSearchParams(location.search);
      if (p.get('q')) q.value = p.get('q').slice(0, 100);
      var pa = p.get('area'); if (pa && areas.indexOf(pa) > -1) sel.value = pa;
    } catch (e) { /* old browser: no prefill */ }
    joined = joinedSet(); draw();
    var A = window.HFLAccess;
    if (A && A.ready && A.ready.then) A.ready.then(function () { joined = joinedSet(); draw(); });
  }).catch(function () { fail('The course list could not load. Please refresh the page.'); });
})();
