/* FAQ search: filters the questions as you type; groups with no match are hidden. */
(function () {
  var box = document.getElementById('faq-find');
  if (!box) return;
  var groups = [].slice.call(document.querySelectorAll('.sx-row'));
  var count = document.getElementById('faq-count');
  var none = document.getElementById('faq-none');
  function run() {
    var q = box.value.trim().toLowerCase(), shown = 0;
    groups.forEach(function (g) {
      var any = false;
      [].forEach.call(g.querySelectorAll('details'), function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) > -1;
        d.hidden = !hit;
        if (hit) { any = true; shown++; if (q) d.open = true; }
        else d.open = false;
      });
      g.hidden = !any;
    });
    count.textContent = q ? shown + (shown === 1 ? ' question matches' : ' questions match') : '';
    if (none) none.hidden = !q || shown > 0;
  }
  box.addEventListener('input', run);
})();
