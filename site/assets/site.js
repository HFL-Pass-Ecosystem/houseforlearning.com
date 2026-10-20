/* Mobile menu, cookie banner, offline contact form and the in-page quiz.
   No trackers, no outside calls. The cookie choice is the only thing stored, in this browser. */
(function () {
  var KEY = 'learn-cookie-choice';
  function closeMenu() {
    var t = document.querySelector('[data-menu-toggle][aria-expanded="true"]');
    if (!t) return null;
    t.setAttribute('aria-expanded', 'false');
    var nav = document.getElementById(t.getAttribute('aria-controls'));
    if (nav) nav.classList.remove('open');
    return t;
  }
  // Back / Forward in the trail bar: history when the visitor came from this site (or moved inside the preview), else Home.
  document.addEventListener('click', function (e) {
    var h = e.target.closest ? e.target.closest('[data-hist]') : null;
    if (!h) return;
    if (h.getAttribute('data-hist') === 'forward') { e.preventDefault(); history.forward(); return; }
    var inside = (document.referrer && document.referrer.indexOf(location.origin) === 0) || location.hash.indexOf('#/') === 0;
    if (inside && history.length > 1) { e.preventDefault(); history.back(); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-menu-toggle]') : null;
    if (t) {
      var nav = document.getElementById(t.getAttribute('aria-controls'));
      var open = t.getAttribute('aria-expanded') !== 'true';
      t.setAttribute('aria-expanded', String(open));
      if (nav) nav.classList.toggle('open', open);
      return;
    }
    var c = e.target.closest ? e.target.closest('[data-cookie]') : null;
    if (c) {
      try { localStorage.setItem(KEY, c.getAttribute('data-cookie')); } catch (err) {}
      var banner = c.closest('.cookie');
      if (banner) banner.hidden = true;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var t = closeMenu();
    if (t) t.focus();
  });
  /* Contact forms (owner 20 Oct 2026): Send opens the visitor's own email app with the message filled in,
     addressed to the site's contact. Nothing is sent from the page itself. */
  function mailForm(f) {
    var to = f.getAttribute('data-mailto');
    if (!to) return false;
    var lines = [];
    Array.prototype.forEach.call(f.elements, function (el) {
      if (!el.name || !el.value || el.type === 'checkbox' || el.type === 'radio' || el.type === 'submit' || el.type === 'reset' || el.type === 'button') return;
      var lab = el.id ? f.querySelector('label[for="' + el.id + '"]') : null;
      var n = lab ? lab.textContent.replace(/\s*\(optional\)\s*/i, '').trim() : el.name;
      lines.push(n + ': ' + el.value);
    });
    var t = f.querySelector('[name=topic],[name=route]');
    var subj = (f.getAttribute('data-subject') || 'Website message') + (t && t.value ? ': ' + t.value : '');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(lines.join('\n'));
    return true;
  }
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.hasAttribute) return;
    if (f.hasAttribute('data-offline')) {
      e.preventDefault();
      mailForm(f);
      var s = f.querySelector('.form-status');
      if (s) { s.textContent = f.getAttribute('data-thanks'); s.hidden = false; s.focus(); }
      return;
    }
    if (f.hasAttribute('data-quiz')) {
      e.preventDefault();
      var sets = f.querySelectorAll('fieldset'), right = 0;
      for (var i = 0; i < sets.length; i++) {
        var fs = sets[i], pick = fs.querySelector('input:checked'), ok = pick && pick.value === fs.getAttribute('data-correct');
        if (ok) right++;
        fs.className = ok ? 'right' : 'wrong';
        var w = fs.querySelector('.why');
        if (w) { w.textContent = (ok ? 'Right. ' : 'Not quite. ') + fs.getAttribute('data-why'); w.hidden = false; }
      }
      var st = f.querySelector('.form-status'), pct = Math.round(right / sets.length * 100), pass = +f.getAttribute('data-pass') || 0;
      if (st) {
        st.textContent = right + ' of ' + sets.length + ' right (' + pct + '%). ' + (pass ? (pct >= pass ? 'That is a pass.' : 'Look at the notes, then try again.') : '');
        st.hidden = false; st.focus();
      }
    }
  });
  document.addEventListener('reset', function (e) {
    var f = e.target;
    if (!f || !f.hasAttribute || !f.hasAttribute('data-quiz')) return;
    var sets = f.querySelectorAll('fieldset');
    for (var i = 0; i < sets.length; i++) { sets[i].className = ''; var w = sets[i].querySelector('.why'); if (w) w.hidden = true; }
    var st = f.querySelector('.form-status'); if (st) st.hidden = true;
  });
  function init() {
    var banner = document.querySelector('.cookie');
    if (!banner) return;
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (err) {}
    banner.hidden = !!v;
  }
  window.SiteUI = { init: init, closeMenu: closeMenu };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Our products page: pause for the moving icons, carousel arrows and dots, and the list filter.
   Without this script the page still shows every section and the whole list. */
(function () {
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-op-marquee]'), function (m) {
      var b = m.querySelector('.op-pause');
      if (!b || b.dataset.ready) return; b.dataset.ready = '1';
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on)); m.classList.toggle('op-paused', on);
        b.setAttribute('aria-label', on ? 'Play the moving icons' : 'Pause the moving icons');
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-op-car]'), function (c) {
      if (c.dataset.ready) return; c.dataset.ready = '1';
      var list = c.querySelector('.op-slides'), slides = list.children, dots = c.querySelectorAll('.op-dot');
      function at() { return Math.round(list.scrollLeft / Math.max(1, slides[0].offsetWidth + 16)); }
      function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); list.scrollTo({ left: slides[i].offsetLeft - list.offsetLeft, behavior: 'smooth' }); }
      function mark() { var i = at(); Array.prototype.forEach.call(dots, function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); }); }
      c.querySelector('.op-prev').addEventListener('click', function () { go(at() - 1); });
      c.querySelector('.op-next').addEventListener('click', function () { go(at() + 1); });
      Array.prototype.forEach.call(dots, function (d, k) { d.addEventListener('click', function () { go(k); }); });
      list.addEventListener('scroll', function () { clearTimeout(list._t); list._t = setTimeout(mark, 80); });
      list.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(at() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(at() - 1); } });
    });
    var f = document.querySelector('[data-op-form]');
    if (f && !f.dataset.ready) {
      f.dataset.ready = '1';
      var Q = f.querySelector('[name=q]'), K = f.querySelector('[name=kind]'), SE = f.querySelector('[name=sector]');
      var items = document.querySelectorAll('.op-item'), groups = document.querySelectorAll('.op-group'), count = f.querySelector('[data-op-count]');
      var apply = function () {
        var q = Q.value.trim().toLowerCase(), k = K.value, s = SE.value, n = 0;
        Array.prototype.forEach.call(items, function (it) {
          var ok = (!q || it.textContent.toLowerCase().indexOf(q) !== -1) && (!k || k.split(',').indexOf(it.getAttribute('data-kind')) !== -1) &&
            (!s || (' ' + it.getAttribute('data-sect') + ' ').indexOf(' ' + s + ' ') !== -1);
          it.hidden = !ok; if (ok) n++;
        });
        Array.prototype.forEach.call(groups, function (g) { var any = g.querySelector('.op-item:not([hidden])'); g.hidden = !any; if (any && (q || k || s)) g.open = true; });
        count.textContent = n + (n === 1 ? ' offer' : ' offers') + (q || k || s ? ' match' + (n === 1 ? 'es' : '') : '');
      };
      f.addEventListener('input', apply); f.addEventListener('change', apply);
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('[data-op-filter]');
        if (!a) return;
        var p = a.getAttribute('data-op-filter').split(':');
        Q.value = ''; if (p[0] === 'kind' && p[1].indexOf(',') !== -1) { var o = K.querySelector('option[data-multi]') || K.appendChild(document.createElement('option')); o.setAttribute('data-multi', ''); o.value = p[1]; o.textContent = a.textContent.replace(/^See /, ''); }
        K.value = p[0] === 'kind' ? p[1] : ''; SE.value = p[0] === 'sector' ? p[1] : '';
        apply();
      });
    }
  }
  var base = window.SiteUI && window.SiteUI.init;
  if (window.SiteUI) window.SiteUI.init = function () { if (base) base.apply(this, arguments); init(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
