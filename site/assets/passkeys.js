/* Passkeys on the members pages: sign in with Face ID, Touch ID, fingerprint or device PIN. Talks only to /api/passkey. */
(function () {
  'use strict';
  var api = '/api/passkey';
  function e64(buf) {
    var s = '', b = new Uint8Array(buf);
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
  function d64(t) {
    t = t.replace(/-/g, '+').replace(/_/g, '/');
    var s = atob(t), a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a.buffer;
  }
  function call(body) {
    return fetch(api, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { d.status = r.status; return d; }); });
  }
  var ctl = null;
  function signal() { if (ctl) ctl.abort(); ctl = new AbortController(); return ctl.signal; }
  var supported = !!(window.PublicKeyCredential && navigator.credentials);

  function signIn(conditional) {
    return call({ action: 'auth-options' }).then(function (o) {
      if (!o.challenge) throw new Error('off');
      var req = { publicKey: { challenge: d64(o.challenge), rpId: o.rpId, userVerification: o.userVerification, timeout: o.timeout }, signal: signal() };
      if (conditional) req.mediation = 'conditional';
      return navigator.credentials.get(req);
    }).then(function (c) {
      var r = c.response;
      return call({ action: 'auth-verify', id: c.id, clientDataJSON: e64(r.clientDataJSON), authenticatorData: e64(r.authenticatorData), signature: e64(r.signature) });
    }).then(function (d) { if (!d.ok) throw new Error(d.error || 'failed'); location.href = 'members.html'; });
  }

  function add(label) {
    return call({ action: 'reg-options' }).then(function (o) {
      if (!o.challenge) throw new Error(o.error || 'off');
      o.challenge = d64(o.challenge); o.user.id = d64(o.user.id);
      o.excludeCredentials = (o.excludeCredentials || []).map(function (k) { return { type: k.type, id: d64(k.id) }; });
      return navigator.credentials.create({ publicKey: o, signal: signal() });
    }).then(function (c) {
      return call({ action: 'reg-verify', label: label, clientDataJSON: e64(c.response.clientDataJSON), attestationObject: e64(c.response.attestationObject) });
    }).then(function (d) { if (!d.ok) throw new Error(d.error || 'failed'); });
  }

  /* Login page */
  var go = document.getElementById('pk-go');
  if (go) {
    var bad = document.getElementById('pk-bad');
    if (!supported) { go.hidden = true; }
    else {
      document.getElementById('pk-box').hidden = false;
      go.addEventListener('click', function () { bad.hidden = true; signIn(false).catch(function (x) { if (x && x.name !== 'AbortError') { bad.hidden = false; } }); });
      /* The keyboard's AutoFill bar then lists the saved passkey next to saved passwords. */
      if (window.PublicKeyCredential.isConditionalMediationAvailable) {
        window.PublicKeyCredential.isConditionalMediationAvailable().then(function (ok) { if (ok) signIn(true).catch(function () {}); });
      }
    }
  }

  /* My page */
  var box = document.getElementById('pk-manage');
  if (box) {
    var list = box.querySelector('[data-pk-list]'), err = box.querySelector('[data-pk-err]'), btn = box.querySelector('[data-pk-add]');
    var render = function () {
      call({ action: 'list' }).then(function (d) {
        if (d.status === 503 || !d.status) { box.hidden = true; return; }
        list.textContent = '';
        (d.keys || []).forEach(function (k) {
          var li = document.createElement('li');
          li.appendChild(document.createTextNode(k.label + ' (added ' + new Date(k.created_at).toLocaleDateString('en-GB') + ') '));
          var b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-sm btn-ghost'; b.textContent = 'Remove';
          b.addEventListener('click', function () { call({ action: 'remove', id: k.id }).then(render); });
          li.appendChild(b); list.appendChild(li);
        });
        if (!(d.keys || []).length) list.innerHTML = '<li>None yet.</li>';
      });
    };
    if (!supported) { btn.disabled = true; btn.textContent = 'This device cannot use passkeys'; }
    else btn.addEventListener('click', function () {
      err.hidden = true;
      add(box.querySelector('[data-pk-label]').value || 'My device').then(render, function (x) { if (!x || x.name !== 'NotAllowedError') { err.hidden = false; } });
    });
    render();
  }
})();
