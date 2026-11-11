// Adds one small "Tools" link to every tool page, so a member can always get back to the Tools list.
(function () {
  'use strict';
  var s = document.currentScript;
  var home = (s && s.getAttribute('data-home')) || '../';
  function add() {
    if (document.querySelector('.hubbar')) return;
    var a = document.createElement('a');
    a.className = 'hubbar';
    a.href = home;
    a.textContent = '← Tools';
    a.setAttribute('aria-label', 'Back to the Tools list');
    document.body.appendChild(a);
  }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
