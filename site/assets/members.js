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
  document.addEventListener('submit', function (e) {
    var f = e.target, kind = f && f.getAttribute && f.getAttribute('data-member');
    if (!kind) return;
    e.preventDefault();
    var btn = f.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
    var body = { action: kind, email: val(f, 'email'), password: val(f, 'password'), name: val(f, 'name'), website: val(f, 'website') };
    show(f, 'One moment...', false);
    call(body).then(function (d) {
      if (btn) btn.disabled = false;
      if (kind === 'login' && d.ok) { location.href = 'members.html'; return; }
      if (d.message) { show(f, d.message, false); if (kind === 'signup') f.reset(); return; }
      offline(f, d);
    }).catch(function () { if (btn) btn.disabled = false; offline(f, {}); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-reset]'); if (!b) return;
    var f = b.form, em = val(f, 'email');
    if (!em) { show(f, 'Type your email above first, then press Forgot password.', true); return; }
    call({ action: 'reset', email: em }).then(function (d) { d.message ? show(f, d.message, false) : offline(f, d); });
  });
  var box = document.getElementById('my-page');
  if (box) {
    call({ action: 'me' }).then(function (d) {
      var out = box.querySelector('[data-out]');
      if (d.status === 401 || d.status === 503 || !d.status) { location.href = 'login.html'; return; }
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
