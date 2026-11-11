// Keeps tools readable on sites with a strict page-security rule (no style="" attributes allowed).
// The browser ignores style="" there, so this applies the same text through the style object, which is allowed.
(function () {
  'use strict';
  var done = new WeakMap();
  function fix(el) {
    if (!el || el.nodeType !== 1) return;
    var v = el.getAttribute('style');
    if (v == null || done.get(el) === v) return;
    try { el.style.cssText = v; } catch (e) { return; }
    done.set(el, el.getAttribute('style'));
  }
  function sweep(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.hasAttribute('style')) fix(root);
    var all = root.querySelectorAll('[style]');
    for (var i = 0; i < all.length; i++) fix(all[i]);
  }
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === 'attributes') fix(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) sweep(m.addedNodes[j]);
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
  document.addEventListener('DOMContentLoaded', function () { sweep(document.documentElement); });
})();
