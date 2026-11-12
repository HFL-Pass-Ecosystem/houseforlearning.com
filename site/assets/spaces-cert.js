/* PAVER demo certificates: adds "Print certificate" to finished rungs and shows a printable dialog.
   Demo only. No inline scripts or <style> (CSP); text is set with textContent. */
(function () {
  'use strict';
  var root = document.getElementById('sp-app');
  if (!root || root.getAttribute('data-space') !== 'paver' || !window.MutationObserver) return;
  var PATHS = {
    P: ['Professional', ['Workplace basics', 'Writing clear messages', 'Planning your week', 'Leading a small team', 'Managing a project', 'Managing people and budgets', 'Leading a department']],
    A: ['Academic', ['How to study', 'Reading and note-making', 'Simple statistics', 'Writing a short report', 'Research methods', 'Writing a paper', 'Supervising research']],
    V: ['Vocational', ['Safety first', 'Tools and measuring', 'Reading a drawing', 'Basic wiring practice', 'Fault finding', 'Supervising a site crew', 'Running a workshop']],
    E: ['Entrepreneurial', ['Is this idea worth it?', 'Talking to customers', 'Pricing and costs', 'Your first sale', 'Cash flow', 'Hiring your first people', 'Growing to new markets']],
    R: ['Recreational', ['Breathing and calm', 'Moving every day', 'Sleep and energy', 'Learning a hobby', 'Coaching a group', 'Leading a club', 'Running community events']]
  };
  function fnv(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function state() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem('hfl-spaces-v1') || 'null'); } catch (e) { s = null; }
    return s || {};
  }
  function el(tag, style, text) {
    var e = document.createElement(tag);
    if (style) e.setAttribute('style', style);
    if (text != null) e.textContent = text;
    return e;
  }
  var dlg = null, hidden = [], printing = false;
  function restore() {
    if (!printing) return;
    printing = false;
    for (var i = 0; i < hidden.length; i++) hidden[i][0].style.display = hidden[i][1];
    hidden = [];
    document.documentElement.classList.remove('sp-printing');
  }
  function doPrint() {
    if (printing) return;
    printing = true;
    document.documentElement.classList.add('sp-printing');
    var kids = document.body.children;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i] !== dlg) { hidden.push([kids[i], kids[i].style.display]); kids[i].style.display = 'none'; }
    }
    window.addEventListener('afterprint', restore, { once: true });
    try { window.print(); } finally { setTimeout(restore, 1000); }
  }
  function open(idx) {
    var s = state(), me = (s.me && s.me.name) || 'Demo Learner';
    var pid = (s.paver && s.paver.path) || 'P', p = PATHS[pid] || PATHS.P;
    var course = p[1][idx] || '', d = new Date();
    var date = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    var code = fnv(me + '|' + p[0] + '|' + (idx + 1) + '|' + date);
    if (dlg && dlg.parentNode) { if (dlg.open) dlg.close(); dlg.parentNode.removeChild(dlg); }
    dlg = el('dialog', 'max-width:640px;width:calc(100% - 32px);border:0;border-radius:12px;padding:0;background:#F2EEE2;color:#1a1a1a;');
    dlg.className = 'sp-cert-dialog';
    dlg.setAttribute('aria-labelledby', 'sp-cert-title');
    var card = el('div', 'margin:16px;padding:28px 24px;border:3px solid #0F85DB;border-radius:10px;background:#fff;text-align:center;font-family:Georgia,serif;');
    card.appendChild(el('p', 'margin:0 0 4px;color:#0F85DB;font-weight:700;letter-spacing:.04em;', 'House for Learning · Demo certificate'));
    var t = el('h2', 'margin:12px 0 6px;font-size:1.9rem;', me); t.id = 'sp-cert-title'; card.appendChild(t);
    card.appendChild(el('p', 'margin:0 0 12px;font-size:1.1rem;', 'has finished Level ' + (idx + 1) + ' · Demo: ' + course + ' on the ' + p[0] + ' pathway'));
    card.appendChild(el('p', 'margin:0;', 'Date: ' + date));
    var c = el('p', 'margin:4px 0 14px;font-family:monospace;', 'Check code: ' + code); c.className = 'sp-cert-code'; card.appendChild(c);
    card.appendChild(el('p', 'margin:0;padding:8px;border-top:2px solid #3CC261;color:#555;font-size:.9rem;', 'Demo certificate for testing. Not a real award.'));
    dlg.appendChild(card);
    var row = el('div', 'display:flex;gap:8px;justify-content:center;margin:0 16px 16px;');
    var pb = el('button', null, 'Print'); pb.type = 'button'; pb.className = 'btn'; pb.setAttribute('data-act', 'cert-print');
    var cb = el('button', null, 'Close'); cb.type = 'button'; cb.className = 'btn btn-ghost'; cb.setAttribute('data-act', 'cert-close');
    pb.addEventListener('click', doPrint);
    cb.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('close', function () { restore(); });
    row.appendChild(pb); row.appendChild(cb); dlg.appendChild(row);
    document.body.appendChild(dlg);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    pb.focus();
  }
  function decorate() {
    var rungs = root.querySelectorAll('li.sp-rung');
    for (var i = 0; i < rungs.length; i++) {
      var li = rungs[i];
      if (!li.classList.contains('done') || li.querySelector('.sp-cert')) continue;
      var b = el('button', null, 'Print certificate');
      b.type = 'button'; b.className = 'btn btn-ghost btn-sm sp-cert'; b.setAttribute('data-act', 'cert-' + i);
      b.addEventListener('click', (function (n) { return function () { open(n); }; })(i));
      (li.querySelector('.sp-row') || li).appendChild(b);
    }
  }
  new MutationObserver(decorate).observe(root, { childList: true, subtree: true });
  decorate();
})();
