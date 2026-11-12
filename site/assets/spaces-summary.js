/* Learning hub: a live summary of the four working spaces (PAVER, COLLATE, LEAP, LAB),
   read from the shared demo store in this browser (localStorage key "hfl-spaces-v1"). */
(function () {
  'use strict';
  var box = document.getElementById('sp-summary');
  if (!box) return;
  var NAMES = { P: 'Professional', A: 'Academic', V: 'Vocational', E: 'Entrepreneurial', R: 'Recreational' };
  var S = null;
  try { S = JSON.parse(localStorage.getItem('hfl-spaces-v1') || 'null'); } catch (e) { S = null; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = String(text);
    return n;
  }
  function link(href, text) { var a = el('a', 'btn btn-ghost', text); a.href = href; return a; }
  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }

  if (!S || S.v !== 2) {
    var p = el('p', null, 'Open PAVER to start: your progress will show here. ');
    p.appendChild(link('paver.html', 'Open PAVER'));
    box.appendChild(p);
    return;
  }

  var me = (S.me && S.me.name) || '';
  var pv = S.paver || {}, done = pv.done || {}, path = NAMES[pv.path] ? pv.path : 'P';
  var levels = 0;
  for (var i = 0; i < 7; i++) if (done[path + i]) levels++;
  var shelves = arr(S.shelves), items = 0;
  for (var j = 0; j < shelves.length; j++) items += arr(shelves[j] && shelves[j].items).length;
  var caps = arr(S.capsules), mine = { draft: 0, review: 0, returned: 0 }, waiting = 0, published = 0;
  for (var k = 0; k < caps.length; k++) {
    var c = caps[k] || {};
    if (c.status === 'review') waiting++;
    if (c.status === 'published') published++;
    if (c.author === me && mine.hasOwnProperty(c.status)) mine[c.status]++;
  }

  function card(title, lines, href, extra) {
    var c = el('div', 'c ok');
    c.appendChild(el('h3', null, title));
    for (var n = 0; n < lines.length; n++) c.appendChild(el('p', null, lines[n]));
    if (extra) c.appendChild(extra);
    c.appendChild(link(href, 'Open ' + title));
    return c;
  }

  var bar = el('div', 'lhbar');
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '7');
  bar.setAttribute('aria-valuenow', String(levels));
  bar.setAttribute('aria-label', 'Levels finished on ' + NAMES[path]);
  bar.style.margin = '0 0 10px';
  var fill = el('i');
  fill.style.width = Math.round(levels * 100 / 7) + '%';
  bar.appendChild(fill);

  var grid = el('div', 'lh');
  grid.appendChild(card('PAVER', [path + ' · ' + NAMES[path] + ' pathway', levels + ' of 7 levels finished'], 'paver.html', bar));
  grid.appendChild(card('COLLATE', [shelves.length + (shelves.length === 1 ? ' shelf' : ' shelves') + ', ' + items + (items === 1 ? ' item' : ' items')], 'collate.html'));
  grid.appendChild(card('LEAP', ['Your capsules' + (me ? ' (' + me + ')' : '') + ':',
    mine.draft + ' drafts, ' + mine.review + ' in review, ' + mine.returned + ' returned'], 'leap.html'));
  grid.appendChild(card('LAB', [waiting + ' waiting for review', published + ' published'], 'lab.html'));
  box.appendChild(el('h3', null, 'Where you are now'));
  box.appendChild(grid);
})();
