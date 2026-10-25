/* Mobile menu, cookie banner, offline contact form and the in-page quiz.
   No trackers, no outside calls. The cookie choice is the only thing stored, in this browser. */
(function () {
  var KEY = 'hfl-cookie-choice';
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
  (function () {
    var idx = document.getElementById('sidx'), out = document.getElementById('sr'), inp = document.getElementById('sq');
    if (!idx || !out || !inp) return;
    var data = JSON.parse(idx.textContent), q0 = (new URLSearchParams(location.search).get('q') || '');
    function run(q) {
      var w = q.toLowerCase().split(/\s+/).filter(Boolean), h = '';
      if (!w.length) { out.innerHTML = ''; return; }
      data.map(function (p) { var t = (p.t + ' ' + p.d).toLowerCase(), n = 0; w.forEach(function (x) { if (t.indexOf(x) > -1) n += (p.t.toLowerCase().indexOf(x) > -1 ? 3 : 1); }); return { p: p, n: n }; })
        .filter(function (r) { return r.n; }).sort(function (a, b) { return b.n - a.n; })
        .forEach(function (r) { var a = document.createElement('li'), l = document.createElement('a'); l.href = r.p.u; l.textContent = r.p.t; a.appendChild(l); var d = document.createElement('p'); d.textContent = r.p.d; a.appendChild(d); out.appendChild(a); });
      out.innerHTML = ''; data.forEach(function () {});
      var res = data.map(function (p) { var t = (p.t + ' ' + p.d).toLowerCase(), n = 0; w.forEach(function (x) { if (t.indexOf(x) > -1) n += (p.t.toLowerCase().indexOf(x) > -1 ? 3 : 1); }); return { p: p, n: n }; }).filter(function (r) { return r.n; }).sort(function (a, b) { return b.n - a.n; });
      if (!res.length) { var e = document.createElement('li'); e.textContent = 'No page found for \u201c' + q + '\u201d. Try another word, or ask the platform team.'; out.appendChild(e); }
      res.forEach(function (r) { var a = document.createElement('li'), l = document.createElement('a'); l.href = r.p.u; l.textContent = r.p.t; a.appendChild(l); var d = document.createElement('p'); d.textContent = r.p.d; a.appendChild(d); out.appendChild(a); });
    }
    inp.value = q0; run(q0);
    inp.form.addEventListener('submit', function (e) { e.preventDefault(); run(inp.value); });
  })();
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
    var cc = '';
    var rt = f.getAttribute('data-routes');
    if (rt && t && t.value) {
      try { var m = JSON.parse(rt)[t.value]; if (m && m.length) { to = m[0]; cc = m.slice(1).join(','); } } catch (x) { /* keep the default address */ }
    }
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subj) + (cc ? '&cc=' + encodeURIComponent(cc) : '') + '&body=' + encodeURIComponent(lines.join('\n'));
    return true;
  }
  Array.prototype.forEach.call(document.querySelectorAll('form[data-api]'), function (f) {
    var sel = f.querySelector('select[name=topic]');
    if (!sel) return;
    fetch(f.getAttribute('data-api') + '/api/help/topics?brand=' + encodeURIComponent(f.getAttribute('data-brand')))
      .then(function (r) { return r.json(); })
      .then(function (j) { (j.topics || []).forEach(function (t) { var o = document.createElement('option'); o.value = t.id; o.textContent = t.label; sel.appendChild(o); }); })
      .catch(function () { var st = f.querySelector('.form-status'); if (st) { st.textContent = 'Our message desk is starting up. Please reload this page in a minute.'; st.hidden = false; } });
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.hasAttribute) return;
    if (f.hasAttribute('data-api')) {
      e.preventDefault();
      var st0 = f.querySelector('.form-status'), btn = f.querySelector('button[type=submit]');
      var say = function (t) { if (st0) { st0.textContent = t; st0.hidden = false; st0.focus(); } };
      var v = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
      var body = { brand: f.getAttribute('data-brand'), topic: v('topic'), email: v('email'), mobile: v('mobile'), message: v('details'),
                   consent: !!(f.elements.consent && f.elements.consent.checked), name: v('name'), organisation: v('organisation'), role: v('role'), country: v('country') };
      if (btn) btn.disabled = true;
      say('Sending your message...');
      fetch(f.getAttribute('data-api') + '/api/help/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (o) {
          if (btn) btn.disabled = false;
          if (o.ok && o.j.reference) { say('Thank you. Your message is saved. Your reference number is ' + o.j.reference + '. ' + (o.j.promise || '')); f.reset(); }
          else say((o.j && (o.j.error || o.j.message)) || 'We could not save your message. Please check the fields and try again.');
        })
        .catch(function () { if (btn) btn.disabled = false; say('We could not reach our message desk just now. Please try again in a minute.'); });
      return;
    }
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

(function(){
  function closeAll(except){Array.prototype.forEach.call(document.querySelectorAll('.has-sub'),function(li){if(li!==except){li.classList.remove('open');var b=li.querySelector('.sub-btn');if(b)b.setAttribute('aria-expanded','false');}});}
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-sub-toggle]');
    if(b){var li=b.parentNode,o=!li.classList.contains('open');closeAll(li);li.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));return;}
    if(!(e.target.closest&&e.target.closest('.has-sub')))closeAll(null);
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll(null);});
})();
