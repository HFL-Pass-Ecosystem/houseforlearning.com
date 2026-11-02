/* Members: Log In, Sign up, reset and the My page view. Talks only to /api/auth (no keys or tokens in the browser). */
(function () {
  var api = '/api/auth';
  function call(body) {
    return fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  function show(f, msg, bad) {
    var s = f.querySelector('.form-status'); if (!s) return;
    s.textContent = msg; s.hidden = false; s.className = 'form-status' + (bad ? ' bad' : ''); s.focus();
  }
  function val(f, n) { var el = f.elements[n]; return el && el.value ? el.value : ''; }
  function offline(f, d) {
    show(f, d.status === 503 || !d.status ? 'The members area is not switched on yet. Please write to us on the Contact page.' : (d.error || 'Something went wrong. Please try again.'), true);
  }
  /* Sign in on one device, finish on the other: this screen waits and signs in as soon as the email link is opened anywhere. */
  function newWait() {
    var a = new Uint8Array(16); crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  var polling = null;
  function startWaiting(f, wait) {
    if (!wait) return;
    clearInterval(polling);
    var n = 0;
    polling = setInterval(function () {
      if (++n > 240) { clearInterval(polling); return; }
      call({ action: 'poll', wait: wait }).then(function (d) {
        if (d.ok) { clearInterval(polling); location.href = 'members.html'; }
        else if (d.status === 503 || d.status === 400) clearInterval(polling);
      }).catch(function () {});
    }, 2500);
  }
  document.addEventListener('submit', function (e) {
    var f = e.target, kind = f && f.getAttribute && f.getAttribute('data-member');
    if (!kind) return;
    e.preventDefault();
    var btn = f.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
    var wait = '';
    if (kind === 'magic') { wait = newWait(); }
    var body = { wait: wait, action: kind, code: val(f, 'code'), email: val(f, 'email'), password: val(f, 'password'), name: val(f, 'name'), website: val(f, 'website') };
    show(f, 'One moment...', false);
    call(body).then(function (d) {
      if (btn) btn.disabled = false;
      if ((kind === 'login' || kind === 'verify') && d.ok) { location.href = 'members.html'; return; }
      if (d.message) { show(f, d.message, false); if (kind === 'magic') { startWaiting(f, wait);
          var cf = document.querySelector('[data-code-form]');
          if (cf) { cf.elements.email.value = body.email; cf.hidden = false; }
        }
        if (kind === 'signup' || kind === 'magic') f.reset(); return; }
      offline(f, d);
    }).catch(function () { if (btn) btn.disabled = false; offline(f, {}); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-reset]'); if (!b) return;
    var f = b.form, em = val(f, 'email');
    if (!em) { show(f, 'Type your email above first, then press Forgot password.', true); return; }
    call({ action: 'reset', email: em }).then(function (d) { d.message ? show(f, d.message, false) : offline(f, d); });
  });
  /* One-tap options: show only the ones that are switched on. */
  var ot = document.getElementById('onetap');
  if (ot) {
    call({ action: 'config' }).then(function (d) {
      var on = d.providers || [], any = false;
      [].forEach.call(ot.querySelectorAll('[data-oauth]'), function (b) { if (on.indexOf(b.getAttribute('data-oauth')) > -1) { b.hidden = false; any = true; } });
      var f = ot.querySelector('[data-email-only]'); if (f && on.indexOf('email') > -1) { f.hidden = false; any = true; }
      if (!any || d.status === 503 || !d.status) ot.hidden = true;
    }).catch(function () { ot.hidden = true; });
    ot.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-oauth]'); if (!b) return;
      call({ action: 'oauth', provider: b.getAttribute('data-oauth') }).then(function (d) {
        if (d.url) location.href = d.url;
        else { var s = document.getElementById('onetap-status'); s.textContent = 'That option is not available yet.'; s.hidden = false; }
      });
    });
  }
  /* Landing page after Google, Microsoft or an email link. */
  var cb = document.getElementById('auth-callback');
  if (cb) {
    var h = new URLSearchParams(location.hash.replace(/^#/, ''));
    var tok = h.get('access_token');
    var wq = new URLSearchParams(location.search).get('w');
    history.replaceState(null, '', location.pathname);
    if (!tok) { cb.textContent = 'This link did not work. Please go back and try again.'; }
    else call({ action: 'session', access_token: tok, refresh_token: h.get('refresh_token') || '' }).then(function (d) {
      if (!d.ok) { cb.textContent = d.error || 'Please try again.'; return; }
      var w = wq;
      var go = function () { location.replace('members.html'); };
      if (w) call({ action: 'handoff', wait: w, access_token: tok, refresh_token: h.get('refresh_token') || '' }).then(go, go); else go();
    });
  }
  var box = document.getElementById('my-page');
  if (box) {
    call({ action: 'me' }).then(function (d) {
      var out = box.querySelector('[data-out]');
      if (d.status === 401 || d.status === 503 || !d.status) { document.cookie = 'hfl_in=; Max-Age=0; Path=/'; location.href = 'login.html'; return; }
      out.querySelector('[data-name]').textContent = d.name || d.email;
      out.querySelector('[data-email]').textContent = d.email;
      out.querySelector('[data-plan]').textContent = d.plan;
      out.querySelector('[data-since]').textContent = d.since ? new Date(d.since).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      box.querySelector('[data-wait]').hidden = true; out.hidden = false;
    }).catch(function () { location.href = 'login.html'; });
    var lo = document.getElementById('logout');
    if (lo) lo.addEventListener('click', function () { call({ action: 'logout' }).then(function () { location.href = 'index.html'; }); });
  }
})();
