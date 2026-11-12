/* Staff gate for insight-desk.html: shows the desk only to a signed-in facilitator or admin (checked by /api/lms on the server).
   The site's security rules block style="" in HTML, so element styles written as data-s are applied here through the CSSOM. */
(function () {
  function apply(root) { if (!root.querySelectorAll) return; if (root.hasAttribute && root.hasAttribute('data-s')) { root.style.cssText = root.getAttribute('data-s'); root.removeAttribute('data-s'); } Array.prototype.forEach.call(root.querySelectorAll('[data-s]'), function (e) { e.style.cssText = e.getAttribute('data-s'); e.removeAttribute('data-s'); }); }
  new MutationObserver(function (ms) { ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) apply(n); }); if (m.type === 'attributes' && m.target.hasAttribute('data-s')) apply(m.target); }); }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-s'] });
  function go() {
    apply(document.body);
    var app = document.getElementById('idk-app'), gate = document.getElementById('idk-gate'), msg = document.getElementById('idk-msg');
    var signed = /(?:^|; )hfl_in=1/.test(document.cookie);
    function deny(t) { msg.textContent = t; gate.querySelector('.idk-login').hidden = false; }
    if (!signed) return deny('This desk is for House for Learning staff. Please sign in with a staff account.');
    fetch('/api/lms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'state' }) })
      .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        if (x.s === 200 && x.j.user && x.j.user.staff) { gate.hidden = true; app.hidden = false; window.dispatchEvent(new Event('resize')); return; }
        if (x.s === 200) return deny('This desk is for staff (facilitators and admins) only. Your account is a learner account.');
        deny('We could not confirm a staff sign-in just now. Please sign in again with a staff account.');
      })
      .catch(function () { deny('We could not reach the sign-in check. Please try again in a moment.'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
