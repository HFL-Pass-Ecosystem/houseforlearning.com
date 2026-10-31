/* Working forms on the inside pages. Sends the fields to /api/forms and shows the answer on the page. */
(function () {
  document.querySelectorAll('form[data-kind]').forEach(function (f) {
    var out = f.querySelector('.form-status');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var body = { kind: f.getAttribute('data-kind'), page: location.pathname };
      new FormData(f).forEach(function (v, k) { body[k] = v; });
      var btn = f.querySelector('button[type=submit]');
      if (btn) btn.disabled = true;
      if (out) out.textContent = 'Sending...';
      fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (x) {
          if (out) out.textContent = x.ok ? 'Saved. Your reference is ' + x.d.ref + '.' : (x.d && x.d.error) || 'Not saved. Please try again.';
          if (x.ok) f.reset();
        })
        .catch(function () { if (out) out.textContent = 'Could not reach the server. Please try again.'; })
        .then(function () { if (btn) btn.disabled = false; });
    });
  });
})();
