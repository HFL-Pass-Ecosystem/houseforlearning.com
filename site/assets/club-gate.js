/* Build Partners Club gate. Asks the members service who is signed in (no keys or tokens in the browser).
   Signed in: the page shows. Not signed in: the page is hidden and the log-in panel shows.
   Members service not switched on yet (503 or no answer): the page shows, so invited partners can test by link. */
(function () {
  var gate = document.getElementById('club-gate'), body = document.getElementById('club-body');
  if (!gate || !body) return;
  fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ action: 'me' }) })
    .then(function (r) { if (r.status === 401) { body.hidden = true; gate.hidden = false; } })
    .catch(function () {});
})();
