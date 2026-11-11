// Picks which data file the map shows, from ?view= in the address. Built by tools-hub/build.py for this site only.
(function () {
  var files = { hfl: 'data/public/hfl.json' };
  var v = (/[?&]view=([a-z]+)/.exec(location.search) || [])[1];
  if (!files[v]) v = 'hfl';
  document.getElementById('map').setAttribute('data-map', files[v]);
  [].forEach.call(document.querySelectorAll('.demo-tabs a'), function (a) {
    if (a.getAttribute('href') === '?view=' + v) a.setAttribute('aria-current', 'page');
  });
})();
