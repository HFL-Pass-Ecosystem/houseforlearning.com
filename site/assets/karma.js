/* Karma points, in the spirit of Karma Yoga from the Bhagavad Gita: members earn points for right action and effort
   (learning, serving others, steady practice), never for results alone. Shared by all six sites.
   Add once per page (site.js loads it next to warm.js):  <script src="/assets/karma.js" defer></script>
   - Signed-in members see a small "✨ 120 karma · Helper" pill, and a +points burst when they earn some.
   - The server decides the points (GET/POST /api/karma); this file only asks. Guests see nothing.
   - Earning moments it already knows: a daily visit, a form sent with a reference (warm.js tells it),
     telling us how you feel, and any element marked  data-karma="lesson" data-karma-ref="unit-3"  when clicked.
   - Put  <div data-karma-panel></div>  on a profile or member home page to show the total, level, next level and recent points.
   - Put  <span data-karma-badge></span>  in a header to show the pill there instead of the floating one.
   Other code can call  Karma.earn('help', 'answer-123')  or listen for the 'karma:earned' event.
   No inline styles or scripts (the sites' Content-Security-Policy blocks them): styles go in a constructed stylesheet. */
(function () {
  if (window.Karma) return;
  var D = document, API = (window.KARMA_API || '/api/karma');
  /* Same levels as karma-rules.json on the server. */
  var LEVELS = [[0, 'Shishya', '🌱', 'the learner'], [50, 'Sadhaka', '🪔', 'the practitioner'], [150, 'Sevak', '🤝', 'the one who serves'],
    [400, 'Karma Yogi', '🪷', 'acts with full effort, unattached to reward'], [1000, 'Margdarshak', '🧭', 'the guide'], [2500, 'Acharya', '🌳', 'teaches by example']];
  var VERSE = 'Do your work with full heart, and let go of worry about the fruit. (Bhagavad Gita 2.47, in spirit)';
  var KIND = [[/order|buy|cart|checkout|quote|purchase|pay/i, 'order'], [/join|register|sign.?up|enrol|enroll|apply/i, 'join'],
    [/feedback|idea|suggest|comment|review|rate|opinion/i, 'feedback']];
  var state = { on: false, points: 0 };
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function level(p) { var l = LEVELS[0], n = null; for (var i = 0; i < LEVELS.length; i++) { if (p >= LEVELS[i][0]) l = LEVELS[i]; else { n = LEVELS[i]; break; } } return { name: l[1], icon: l[2], meaning: l[3], next: n }; }
  function el(t, c, txt) { var e = D.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function call(method, body) {
    return fetch(API, { method: method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: false, j: {} }; }); });
  }

  var CSS = ':host{all:initial}*{box-sizing:border-box}' +
    '.pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:#fff6dc;color:#5a3e00;font:600 13px/1.2 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;border:1px solid #f0d58a;box-shadow:0 4px 14px rgba(0,0,0,.12);text-decoration:none}' +
    '.float{position:fixed;left:20px;bottom:20px;z-index:2147482990}.plus{position:absolute;left:50%;top:-6px;font:700 15px system-ui,sans-serif;color:#b7791f;pointer-events:none;white-space:nowrap}' +
    '.panel{font:15px/1.45 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:inherit;border:1px solid rgba(0,0,0,.1);border-radius:16px;padding:16px;background:rgba(255,246,220,.5)}' +
    '.big{font-size:32px;font-weight:800}.bar{height:10px;background:rgba(0,0,0,.08);border-radius:999px;overflow:hidden;margin:8px 0 4px}.bar i{display:block;height:100%;background:linear-gradient(90deg,#f6c453,#e8892b)}' +
    'ul{list-style:none;padding:0;margin:10px 0 0}li{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-top:1px dashed rgba(0,0,0,.12);font-size:14px}li b{color:#b7791f}' +
    '.how{font-size:13px;opacity:.8;margin-top:8px}' +
    '@media (max-width:480px){.float{left:8px;bottom:8px}}' +
    '@media (prefers-color-scheme:dark){.pill{background:#3a2f12;color:#f7e2a8;border-color:#6b5420}.panel{background:rgba(58,47,18,.35);border-color:rgba(255,255,255,.12)}}' +
    '@media (prefers-reduced-motion:no-preference){.plus{animation:up 1.4s ease-out forwards}@keyframes up{0%{opacity:0;transform:translate(-50%,0) scale(.6)}20%{opacity:1;transform:translate(-50%,-10px) scale(1.15)}100%{opacity:0;transform:translate(-50%,-40px)}}' +
    '.pill.glow{animation:g 1s ease-out}@keyframes g{30%{box-shadow:0 0 0 6px rgba(246,196,83,.45)}}.bar i{transition:width .8s ease}}';
  function shadow(host) { var r = host.attachShadow({ mode: 'open' }); try { var s = new CSSStyleSheet(); s.replaceSync(CSS); r.adoptedStyleSheets = [s]; } catch (e) {} return r; }

  var pills = [];
  function drawPill() {
    if (!state.on) return;
    if (!pills.length) {
      var slots = D.querySelectorAll('[data-karma-badge]'), hosts = slots.length ? Array.prototype.slice.call(slots) : [D.body.appendChild(el('div'))];
      hosts.forEach(function (h) {
        var r = shadow(h), a = el('a', 'pill' + (slots.length ? '' : ' float')); a.href = window.KARMA_HOME || '#karma';
        r.appendChild(a); pills.push(a);
      });
    }
    var l = level(state.points);
    pills.forEach(function (a) { a.textContent = '✨ ' + state.points + ' karma · ' + l.icon + ' ' + l.name; a.setAttribute('aria-label', state.points + ' karma points, level ' + l.name); });
  }
  function burst(n) {
    pills.forEach(function (a) {
      var p = el('span', 'plus', '+' + n + ' ✨'); p.setAttribute('aria-hidden', 'true'); a.appendChild(p);
      a.classList.remove('glow'); void a.offsetWidth; a.classList.add('glow');
      setTimeout(function () { p.remove(); }, still ? 400 : 1500);
    });
  }

  var panels = [];
  function drawPanels(data) {
    D.querySelectorAll('[data-karma-panel]').forEach(function (h) {
      var r = h.shadowRoot || shadow(h); r.innerHTML = '';
      var box = el('section', 'panel'); box.id = 'karma';
      if (!state.on) { box.appendChild(el('p', null, 'Sign in to earn karma for right action: learning, serving others and steady practice.')); r.appendChild(box); return; }
      var l = level(state.points);
      box.appendChild(el('div', null, l.icon + ' ' + l.name + ', ' + l.meaning));
      box.appendChild(el('div', 'big', state.points + ' karma'));
      if (l.next) {
        var prev = 0; for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i][1] === l.name) prev = LEVELS[i][0];
        var bar = el('div', 'bar'), fill = el('i'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-valuemin', prev); bar.setAttribute('aria-valuemax', l.next[0]); bar.setAttribute('aria-valuenow', state.points);
        fill.style.width = Math.round(100 * (state.points - prev) / (l.next[0] - prev)) + '%'; bar.appendChild(fill); box.appendChild(bar);
        box.appendChild(el('div', 'how', (l.next[0] - state.points) + ' more to reach ' + l.next[2] + ' ' + l.next[1]));
      }
      var recent = (data && data.recent) || [];
      if (recent.length) {
        var ul = el('ul');
        recent.slice(0, 8).forEach(function (x) { var li = el('li'); li.appendChild(el('span', null, x.label || x.action)); li.appendChild(el('b', null, '+' + x.points)); ul.appendChild(li); });
        box.appendChild(ul);
      }
      box.appendChild(el('div', 'how', 'Karma honours the effort, not only the result: learning, serving other members, sharing ideas and steady daily practice.'));
      box.appendChild(el('div', 'how', VERSE));
      r.appendChild(box);
    });
  }

  function refresh() {
    return call('GET').then(function (x) {
      state.on = !!(x.ok && x.j && x.j.member); state.points = state.on ? (x.j.points || 0) : 0;
      drawPill(); drawPanels(x.j); return x.j;
    }).catch(function () { drawPanels(null); });
  }

  /* Ask the server for points. It checks the rules and daily limits, and gives each (action, ref) only once. */
  function earn(action, ref) {
    if (!state.on) return Promise.resolve(null);
    return call('POST', { action: action, ref: String(ref || today()).slice(0, 80) }).then(function (x) {
      if (!x.ok || !x.j || !x.j.awarded) return x.j;
      state.points = x.j.points; drawPill(); burst(x.j.awarded);
      if (window.Warm && window.Warm.note) window.Warm.note('+' + x.j.awarded + ' karma ✨ ' + (x.j.label || ''));
      if (x.j.levelUp) { var l = level(state.points); if (window.Warm) window.Warm.ack({ state: 'done', emoji: l.icon, text: 'You are now ' + l.name + ', ' + l.meaning + '.', line: VERSE }); }
      try { D.dispatchEvent(new CustomEvent('karma:earned', { detail: x.j })); } catch (e) {}
      refresh(); return x.j;
    }).catch(function () { return null; });
  }

  D.addEventListener('warm:sent', function (e) {
    var d = e.detail || {}, a = 'message';
    if (!d.ref) return;
    for (var i = 0; i < KIND.length; i++) if (KIND[i][0].test(d.kind || '')) { a = KIND[i][1]; break; }
    earn(a, d.ref);
  });
  D.addEventListener('warm:feeling', function (e) { earn('feeling', (e.detail && e.detail.ref) || today()); });
  D.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-karma]'); if (!t) return;
    earn(t.getAttribute('data-karma'), t.getAttribute('data-karma-ref') || location.pathname);
  }, true);

  window.Karma = { earn: earn, refresh: refresh, level: level };
  function go() { refresh().then(function () { if (state.on) earn('visit', today()); }); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})();
