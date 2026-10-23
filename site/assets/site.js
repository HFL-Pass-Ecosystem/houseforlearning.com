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
      // keep the whole open menu on screen, whatever the header height (the menu scrolls inside)
      if (nav && open) nav.style.maxHeight = Math.max(200, window.innerHeight - nav.getBoundingClientRect().top) + 'px';
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

/* Site enhancements shared by all four sites (owner 22 Oct 2026: "much better than premium site builders").
   Page search, an "On this page" guide, a reading bar, a gentle reveal on scroll, back to top and section links.
   No outside calls and nothing stored: search reads this site's own pages (same folder), or the page templates
   in the preview. Runs again after each preview page change through SiteUI.init. */
(function () {
  var D = document, W = window;
  var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var UP = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function make(tag, cls, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function text(n) { return (n && n.textContent || '').replace(/\s+/g, ' ').trim(); }
  function words(n) {  // text with a space between elements, so search snippets read naturally
    var out = [], w = D.createTreeWalker(n, 4, null), t;
    while ((t = w.nextNode())) { if (!t.parentNode.closest('svg,script,style,template,.vh,.enh-anchor')) out.push(t.nodeValue); }
    return out.join(' ').replace(/\s+/g, ' ').trim();
  }
  function isPreview() { return !!D.getElementById('pv-sel'); }

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = D.querySelector('.enh-toast') || D.body.appendChild(make('div', 'enh-toast'));
    t.setAttribute('role', 'status'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 1800);
  }

  /* ---------- reading bar + back to top (once per document) ---------- */
  function chrome() {
    if (D.querySelector('.enh-progress')) return;
    var bar = D.body.appendChild(make('div', 'enh-progress')); bar.setAttribute('aria-hidden', 'true');
    var top = D.body.appendChild(make('button', 'enh-top', UP + '<span class="vh">Back to top</span>'));
    top.type = 'button'; top.title = 'Back to top';
    top.addEventListener('click', function () {
      W.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var m = D.getElementById('main'); if (m) m.focus({ preventScroll: true });
    });
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      W.requestAnimationFrame(function () {
        var h = D.documentElement.scrollHeight - W.innerHeight, y = W.scrollY || W.pageYOffset;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
        top.classList.toggle('on', y > 900);
        ticking = false;
      });
    }
    W.addEventListener('scroll', onScroll, { passive: true }); W.addEventListener('resize', onScroll); onScroll();
  }

  /* ---------- reveal on scroll ---------- */
  var io;
  function reveal() {
    if (reduce || !('IntersectionObserver' in W)) return;
    D.documentElement.classList.add('enh-rv');
    if (!io) io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    var sel = 'main .sec .sec-head, main .sec .split > *, main .sec .sec-body > *, main .sec .cards > li, main .cta .wrap > *, main .hero .hero-grid > *';
    D.querySelectorAll(sel).forEach(function (n) {
      if (n.classList.contains('rv')) return;
      if (n.matches('.sec-body') && n.querySelector('.cards')) return;
      n.classList.add('rv');
      if (n.parentNode && n.parentNode.classList && n.parentNode.classList.contains('cards')) {
        var i = Array.prototype.indexOf.call(n.parentNode.children, n);
        n.style.transitionDelay = (i % 4) * 70 + 'ms';
      }
      io.observe(n);
    });
  }

  /* ---------- fact band: numbers count up once, when they come into view ---------- */
  function counters() {
    if (reduce || !('IntersectionObserver' in W)) return;
    var ns = D.querySelectorAll('.fact-n[data-to]:not([data-done])'); if (!ns.length) return;
    var ob = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; ob.unobserve(e.target);
        var n = e.target, to = +n.getAttribute('data-to'), pre = n.getAttribute('data-pre') || '', post = n.getAttribute('data-post') || '';
        if (to < 2) return;
        var t0 = null, dur = 900;
        n.setAttribute('aria-label', pre + to + post);
        function step(t) {
          if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          n.textContent = pre + v + post; if (k < 1) W.requestAnimationFrame(step);
        }
        W.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    ns.forEach(function (n) { n.setAttribute('data-done', ''); ob.observe(n); });
  }

  /* ---------- section links ---------- */
  function anchors() {
    if (isPreview()) return;
    D.querySelectorAll('main .sec h2[id]').forEach(function (h) {
      if (h.querySelector('.enh-anchor')) return;
      var sec = h.closest('section'), id = (sec && sec.id) || h.id;
      var a = make('a', 'enh-anchor', '#'); a.href = '#' + id;
      a.setAttribute('aria-label', 'Copy a link to this section: ' + text(h));
      a.addEventListener('click', function (e) {
        var url = location.href.split('#')[0] + '#' + id;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          e.preventDefault(); history.replaceState(null, '', '#' + id);
          navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { location.hash = id; });
        }
      });
      h.appendChild(a);
    });
  }

  /* ---------- On this page ---------- */
  function guide() {
    var main = D.getElementById('main'); if (!main || main.querySelector('.enh-toc')) return;
    var secs = [].slice.call(main.querySelectorAll(':scope > section.sec')).filter(function (s) { return s.querySelector('h2'); });
    if (secs.length < 4) return;
    var nav = make('nav', 'enh-toc'); nav.setAttribute('aria-label', 'On this page');
    var ul = make('ul');
    var links = secs.map(function (s) {
      var h = s.querySelector('h2'), id = s.id || h.id;
      if (!id) { id = 'sec-' + Math.random().toString(36).slice(2, 8); s.id = id; }
      var li = make('li'), a = make('a', '', esc(text(h).replace(/#$/, '')));
      a.href = '#' + id; li.appendChild(a); ul.appendChild(li); return a;
    });
    var wrap = make('div', 'wrap enh-toc-row', '<span class="enh-toc-k">On this page</span>');
    wrap.appendChild(ul); nav.appendChild(wrap);
    var first = secs[0]; first.parentNode.insertBefore(nav, first);
    var head = D.querySelector('.site-head');
    function setTop() { if (head) nav.style.top = head.getBoundingClientRect().height + 'px'; }
    setTop(); W.addEventListener('resize', setTop);
    if (!('IntersectionObserver' in W)) return;
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = secs.indexOf(e.target);
        links.forEach(function (a, j) { if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        var a = links[i], r = a.getBoundingClientRect(), u = ul.getBoundingClientRect();
        if (r.left < u.left || r.right > u.right) ul.scrollLeft += r.left - u.left - 24;
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- search ---------- */
  var index = null, loading = null;
  function pagesFromPreview() {
    var sel = D.getElementById('pv-sel'), cur = (location.hash.match(/^#\/([a-z]+)\//) || [])[1];
    var out = [];
    [].forEach.call(sel.options, function (o) {
      var v = o.value, parts = v.slice(2).split('/');
      if (parts.length > 1 && cur && parts[0] !== cur) return;  // the AMS preview holds two sites: search only the one in view
      var t = D.getElementById('r-' + parts.join('-')); if (!t) return;
      var m = t.content.querySelector('main'); if (!m) return;
      out.push(entry(m, o.textContent.replace(/^[^·]*·\s*/, ''), v, true));
    });
    return Promise.resolve(out);
  }
  function entry(m, name, url, pv) {
    var h1 = m.querySelector('h1');
    var secs = [].map.call(m.querySelectorAll('section.sec'), function (s) {
      var h = s.querySelector('h2'); return h ? { id: s.id || h.id, t: text(h).replace(/#$/, ''), x: words(s).toLowerCase() } : null;
    }).filter(Boolean);
    return { name: name, title: h1 ? text(h1) : name, url: url, pv: pv, secs: secs, x: words(m).toLowerCase() };
  }
  function pagesFromSite() {
    var brand = D.querySelector('a.brand'), base = new URL(brand ? brand.getAttribute('href') : 'index.html', location.href);
    var dir = base.pathname.replace(/[^/]*$/, ''), seen = {}, list = [];
    D.querySelectorAll('.site-head a[href], .site-foot a[href], footer a[href]').forEach(function (a) {
      var h = a.getAttribute('href'); if (!h || /^(mailto:|tel:|#|https?:)/.test(h)) return;
      var u = new URL(h, location.href); if (u.origin !== location.origin) return;
      var p = u.pathname; if (/\/$/.test(p)) p += 'index.html';
      if (!/\.html$/.test(p) || p.replace(/[^/]*$/, '') !== dir || seen[p] || /\/404\.html$/.test(p)) return;
      seen[p] = 1; list.push({ p: p, name: text(a) });
    });
    if (!seen[dir + 'index.html']) list.unshift({ p: dir + 'index.html', name: 'Home' });
    return Promise.all(list.map(function (it) {
      return fetch(it.p, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
        if (!html) return null;
        var doc = new DOMParser().parseFromString(html, 'text/html'), m = doc.getElementById('main');
        return m ? entry(m, it.name || text(doc.querySelector('h1')), it.p, false) : null;
      }).catch(function () { return null; });
    })).then(function (a) { return a.filter(Boolean); });
  }
  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = (isPreview() ? pagesFromPreview() : pagesFromSite()).then(function (a) { index = a; return a; });
    return loading;
  }
  function hrefFor(pg, id) {
    if (pg.pv) return pg.url + (id && /^[a-z-]+$/.test(id) ? '/' + id : '');
    return pg.url + (id ? '#' + id : '');
  }
  function snippet(x, q) {
    var i = x.indexOf(q); if (i < 0) return '';
    var s = Math.max(0, i - 50), part = x.slice(s, i + q.length + 70);
    var k = part.indexOf(q);
    return (s > 0 ? '…' : '') + esc(part.slice(0, k)) + '<mark>' + esc(part.slice(k, k + q.length)) + '</mark>' + esc(part.slice(k + q.length)) + '…';
  }
  function find(q) {
    q = q.toLowerCase().trim(); if (!q) return [];
    var words = q.split(/\s+/), res = [];
    index.forEach(function (pg) {
      var all = words.every(function (w) { return pg.x.indexOf(w) >= 0; }); if (!all) return;
      var score = 1 + (pg.title.toLowerCase().indexOf(q) >= 0 ? 20 : 0) + (pg.name.toLowerCase().indexOf(q) >= 0 ? 20 : 0);
      res.push({ s: score, pg: pg, href: hrefFor(pg, ''), t: pg.name, sub: pg.title !== pg.name ? pg.title : '', snip: snippet(pg.x, words[0]) });
      pg.secs.forEach(function (sc) {
        if (!words.every(function (w) { return sc.x.indexOf(w) >= 0; })) return;
        var hs = sc.t.toLowerCase().indexOf(q) >= 0 ? 12 : 2;
        res.push({ s: hs, pg: pg, id: sc.id, href: hrefFor(pg, sc.id), t: sc.t, sub: pg.name, snip: snippet(sc.x, words[0]) });
      });
    });
    return res.sort(function (a, b) { return b.s - a.s; }).slice(0, 14);
  }
  var dlg;
  function openSearch() {
    if (!dlg) {
      dlg = make('dialog', 'enh-dlg');
      dlg.setAttribute('aria-label', 'Search this site');
      dlg.innerHTML = '<form class="enh-q" role="search" method="dialog">' + ICON +
        '<label class="vh" for="enh-q-in">Search this site</label><input id="enh-q-in" type="search" autocomplete="off" spellcheck="false" placeholder="Search pages and sections">' +
        '<button type="button" class="enh-x" value="close">Close<span class="vh"> search</span></button></form>' +
        '<p class="enh-hint" id="enh-hint">Type a word, such as membership, quality or contact. Use the arrow keys to move and Enter to open.</p>' +
        '<ul class="enh-res" id="enh-res" aria-describedby="enh-hint"></ul>';
      D.body.appendChild(dlg);
      var inp = dlg.querySelector('input'), ul = dlg.querySelector('.enh-res'), hint = dlg.querySelector('.enh-hint');
      dlg.querySelector('.enh-x').addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      dlg.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var a = ul.querySelector('a'); if (a) a.click(); });
      var run = function () {
        load().then(function () {
          var r = find(inp.value);
          ul.innerHTML = r.map(function (it) {
            return '<li><a href="' + esc(it.href) + '" data-id="' + esc(it.id || '') + '"><span class="enh-rt">' + esc(it.t) + '</span>' +
              (it.sub ? '<span class="enh-rs">' + esc(it.sub) + '</span>' : '') + (it.snip ? '<span class="enh-rx">' + it.snip + '</span>' : '') + '</a></li>';
          }).join('');
          hint.textContent = !inp.value.trim() ? 'Type a word, such as membership, quality or contact. Use the arrow keys to move and Enter to open.'
            : (r.length ? r.length + ' result' + (r.length > 1 ? 's' : '') + '.' : 'Nothing found. Try a shorter word, or use the Contact page and a person will help.');
        });
      };
      inp.addEventListener('input', run);
      dlg.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        var items = [inp].concat([].slice.call(ul.querySelectorAll('a'))); if (items.length < 2) return;
        e.preventDefault();
        var i = Math.max(0, items.indexOf(D.activeElement)), n = items.length;
        items[e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n].focus();
      });
      ul.addEventListener('click', function (e) {
        var a = e.target.closest('a'); if (!a) return;
        var id = a.getAttribute('data-id'); dlg.close();
        if (isPreview() && id && !/^[a-z-]+$/.test(id)) {
          setTimeout(function () { var t = D.getElementById(id); if (t) t.scrollIntoView(); }, 60);
        }
      });
    }
    if (W.SiteUI && W.SiteUI.closeMenu) W.SiteUI.closeMenu();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var inp = dlg.querySelector('input'); inp.select(); inp.focus();
    load();
  }
  function searchButton() {
    var row = D.querySelector('.site-head .head-row'); if (!row || row.querySelector('.enh-sbtn')) return;
    var b = make('button', 'enh-sbtn', ICON + '<span class="enh-sl">Search</span><kbd aria-hidden="true">/</kbd>');
    b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog'); b.title = 'Search this site (press /)';
    b.addEventListener('click', openSearch);
    var menu = row.querySelector('.menu-btn'); row.insertBefore(b, menu || null);
    var trail = D.querySelector('.site-head .trail-row');  // on phones the search button sits in the Back / Forward row
    if (trail && !trail.querySelector('.enh-sbtn')) {
      var t = make('button', 'enh-sbtn enh-sbtn-t', ICON + '<span class="enh-sl">Search</span>');
      t.type = 'button'; t.setAttribute('aria-haspopup', 'dialog'); t.addEventListener('click', openSearch); trail.insertBefore(t, trail.querySelector('nav'));
    }
  }
  D.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable);
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) {
      if (!D.querySelector('.enh-sbtn')) return;
      e.preventDefault(); openSearch();
    }
  });

  function init() {
    if (!D.body) return;
    chrome(); searchButton(); guide(); anchors(); reveal(); counters();
  }
  var base = W.SiteUI && W.SiteUI.init;
  if (W.SiteUI) W.SiteUI.init = function () { if (base) base.apply(this, arguments); init(); };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', init); else init();
})();
