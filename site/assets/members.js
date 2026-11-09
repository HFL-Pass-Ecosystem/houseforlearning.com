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
  /* The code is typed or pasted on the screen that asked for it. There is no hand-over from another device: anyone can
     ask for a code for someone else's email, so a sign-in finished elsewhere must never land on this screen. */
  document.addEventListener('submit', function (e) {
    var f = e.target, kind = f && f.getAttribute && f.getAttribute('data-member');
    if (!kind) return;
    e.preventDefault();
    var btn = f.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
    var body = { action: kind, code: val(f, 'code'), email: val(f, 'email'), password: val(f, 'password'), name: val(f, 'name'), website: val(f, 'website') };
    show(f, 'One moment...', false);
    call(body).then(function (d) {
      if (btn) btn.disabled = false;
      if ((kind === 'login' || kind === 'verify') && d.ok) { location.href = 'members.html'; return; }
      if (d.message) {
        var cf = kind === 'magic' && f.parentNode.querySelector('[data-code-form]');
        if (cf) { var st = f.querySelector('.form-status'); if (st) st.hidden = true; openCode(f, cf, body); return; }
        show(f, d.message, false);
        if (kind === 'signup' || kind === 'magic') f.reset(); return; }
      offline(f, d);
    }).catch(function () { if (btn) btn.disabled = false; offline(f, {}); });
  });
  /* The code box opens where the email box was (owner, 9 Nov 2026: everything in the same pane).
     Send a new code after a minute (the email service allows one a minute), Change email, and sign in
     as soon as six digits are typed or pasted. */
  function openCode(f, cf, body) {
    cf.elements.email.value = body.email;
    cf._ask = { form: f, body: body };
    f.hidden = true; cf.hidden = false;
    var st = cf.querySelector('.form-status');
    st.textContent = 'If ' + body.email + ' can be used, a 6-digit code is on its way to it.';
    st.className = 'form-status'; st.hidden = false;
    var box = cf.elements.code; box.value = ''; box.dispatchEvent(new Event('input')); box.focus();
    wait60(cf);
  }
  function wait60(cf) {
    var b = cf.querySelector('[data-resend]'); if (!b) return;
    clearInterval(cf._t);
    var left = 60;
    function tick() {
      if (left <= 0) { clearInterval(cf._t); b.disabled = false; b.textContent = 'Send a new code'; return; }
      b.disabled = true; b.textContent = 'Send a new code in 0:' + (left < 10 ? '0' : '') + left; left--;
    }
    tick(); cf._t = setInterval(tick, 1000);
  }
  document.addEventListener('click', function (e) {
    var r = e.target.closest && e.target.closest('[data-resend]'), c = e.target.closest && e.target.closest('[data-change]');
    var cf = (r || c) && (r || c).form; if (!cf || !cf._ask) return;
    if (c) { clearInterval(cf._t); cf.hidden = true; cf._ask.form.hidden = false; cf._ask.form.elements.email.focus(); return; }
    var body = cf._ask.body;
    call(body).then(function (d) {
      if (!d.message) { offline(cf, d); return; }
      show(cf, 'A new code is on its way. Use the newest email.', false); wait60(cf);
    }).catch(function () { offline(cf, {}); });
  });
  document.addEventListener('input', function (e) {
    var box = e.target, cf = box && box.form;
    if (!cf || !cf.hasAttribute('data-code-form') || box.name !== 'code') return;
    if (box.value.replace(/\D/g, '').length === 6 && cf.checkValidity()) cf.requestSubmit ? cf.requestSubmit() : cf.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
  /* Each code box looks like six boxes but stays one field, so paste, the phone's code fill and screen readers work. */
  function digits(v) { return (v || '').replace(/\D/g, '').slice(0, 6); }
  [].forEach.call(document.querySelectorAll('input.code'), function (box) {
    var wrap = document.createElement('div'), cells = [];
    wrap.className = 'code6';
    box.parentNode.insertBefore(wrap, box);
    for (var i = 0; i < 6; i++) { var c = document.createElement('span'); c.className = 'cell'; c.setAttribute('aria-hidden', 'true'); wrap.appendChild(c); cells.push(c); }
    wrap.appendChild(box);
    box.removeAttribute('maxlength');
    function paint() { var v = box.value; cells.forEach(function (c, n) { c.textContent = v.charAt(n); c.classList.toggle('now', n === v.length); }); }
    function end() { var n = box.value.length; try { box.setSelectionRange(n, n); } catch (x) {} }
    box.addEventListener('input', function () { var d = digits(box.value); if (box.value !== d) box.value = d; paint(); end(); });
    box.addEventListener('paste', function (e) {
      var t = e.clipboardData ? e.clipboardData.getData('text') : '', m = t.match(/(\d{3})[\s-]?(\d{3})/), d = m ? m[1] + m[2] : digits(t);
      if (!d) return;
      e.preventDefault(); box.value = d; box.dispatchEvent(new Event('input', { bubbles: true }));
    });
    box.addEventListener('focus', function () { paint(); setTimeout(end, 0); });
    box.addEventListener('click', end);
    box.addEventListener('blur', paint);
    paint();
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
  /* Landing page after Google, Microsoft or an email link: signs in this device only. */
  var cb = document.getElementById('auth-callback');
  if (cb) {
    var th = new URLSearchParams(location.search).get('th');
    var h = new URLSearchParams(location.hash.replace(/^#/, ''));
    var tok = h.get('access_token');
    history.replaceState(null, '', location.pathname);
    if (th) oneTap(cb, th, true);
    else if (!tok) { cb.textContent = 'This link did not work. Please go back and try again.'; }
    else call({ action: 'session', access_token: tok, refresh_token: h.get('refresh_token') || '' }).then(function (d) {
      if (!d.ok) { cb.textContent = d.error || 'Please try again.'; return; }
      location.replace('members.html');
    });
  }
  /* The one-tap link under the code in the email (?th=...). In the browser that asked for the code it signs in by itself.
     Anywhere else the server answers "ask" and nothing is used up until the person presses Sign in here, so a mail scanner
     that opens links cannot spend the code. Either way only this browser is signed in. */
  function oneTap(cb, th, auto) {
    call({ action: 'confirm', token_hash: th, auto: auto }).then(function (d) {
      if (d.ok) { location.replace('members.html'); return; }
      if (d.ask) { askHere(cb, th); return; }
      cb.textContent = d.status === 503 || !d.status ? 'The members area is not switched on yet. Please write to us on the Contact page.'
        : (d.error || 'This link did not work. Please ask for a new code.');
    }).catch(function () { cb.textContent = 'This link did not work. Please try again.'; });
  }
  function askHere(cb, th) {
    var hd = document.getElementById('cb-h'); if (hd) hd.textContent = 'Sign in on this device?';
    cb.textContent = 'This signs you in here, on this device. If you asked for the code on another computer or phone, type the code there instead.';
    var p = document.createElement('p'), b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.textContent = 'Sign in here';
    b.addEventListener('click', function () { p.hidden = true; cb.textContent = 'One moment...'; oneTap(cb, th, false); });
    p.appendChild(b); cb.parentNode.appendChild(p);
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
