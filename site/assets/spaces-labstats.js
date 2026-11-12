/* LAB dashboard card: counts, published capsules per pathway (SVG bar chart + table), most active reviewer.
   Reads the shared store "hfl-spaces-v1" each time spaces.js re-renders. textContent only (CSP safe). */
(function () {
  'use strict';
  var root = document.getElementById('sp-app');
  if (!root || root.getAttribute('data-space') !== 'lab') return;
  var KEY = 'hfl-spaces-v1', NS = 'http://www.w3.org/2000/svg';
  var PATHS = [['P', 'Professional'], ['A', 'Academic'], ['V', 'Vocational'], ['E', 'Entrepreneurial'], ['R', 'Recreational']];

  function el(tag, attrs, text) {
    var e = document.createElement(tag), k;
    for (k in attrs || {}) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function sv(tag, attrs, text) {
    var e = document.createElementNS(NS, tag), k;
    for (k in attrs || {}) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function readStore() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    return s || { capsules: [], log: [] };
  }

  function build() {
    var S = readStore(), caps = S.capsules || [], log = S.log || [];
    var n = { review: 0, returned: 0, published: 0 }, authors = {}, nAuthors = 0, per = {}, i;
    for (i = 0; i < PATHS.length; i++) per[PATHS[i][0]] = 0;
    for (i = 0; i < caps.length; i++) {
      var c = caps[i];
      if (n.hasOwnProperty(c.status)) n[c.status]++;
      if (c.author && !authors[c.author]) { authors[c.author] = 1; nAuthors++; }
      if (c.status === 'published' && per.hasOwnProperty(c.path)) per[c.path]++;
    }
    var rev = {}, best = '', bestN = 0;
    for (i = 0; i < log.length; i++) {
      var e = log[i];
      if ((e.what === 'published' || e.what === 'returned') && e.by) {
        rev[e.by] = (rev[e.by] || 0) + 1;
        if (rev[e.by] > bestN) { bestN = rev[e.by]; best = e.by; }
      }
    }

    var card = el('div', { 'class': 'sp-card sp-labstats', id: 'sp-labstats' });
    card.appendChild(el('h3', null, 'LAB dashboard'));
    var row = el('div', { style: 'display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px' });
    [['Waiting', n.review], ['Returned', n.returned], ['Published', n.published], ['Authors', nAuthors]].forEach(function (t) {
      var tile = el('div', { 'class': 'sp-stat', 'data-stat': t[0].toLowerCase(),
        style: 'flex:1 1 70px;min-width:70px;padding:8px 10px;border:1px solid #d9d3c2;border-radius:10px;text-align:center' });
      tile.appendChild(el('div', { 'class': 'sp-stat-n', style: 'font-size:1.6rem;font-weight:700;color:#0F85DB' }, String(t[1])));
      tile.appendChild(el('div', { style: 'font-size:.85rem' }, t[0]));
      row.appendChild(tile);
    });
    card.appendChild(row);

    card.appendChild(el('h4', null, 'Published capsules per pathway'));
    var max = 1, summary = [];
    PATHS.forEach(function (p) { if (per[p[0]] > max) max = per[p[0]]; summary.push(p[1] + ' ' + per[p[0]]); });
    var W = 360, LW = 110, BW = 200, RH = 30, H = PATHS.length * RH + 6;
    var svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img', focusable: 'false',
      'aria-label': 'Bar chart of published capsules per pathway: ' + summary.join(', ') + '.',
      style: 'display:block;max-width:560px;height:auto' });
    PATHS.forEach(function (p, k) {
      var v = per[p[0]], y = 4 + k * RH, w = v ? Math.max(3, Math.round(BW * v / max)) : 0;
      svg.appendChild(sv('text', { x: LW - 8, y: y + 17, 'text-anchor': 'end', 'font-size': '13', fill: 'currentColor' }, p[1]));
      svg.appendChild(sv('rect', { x: LW, y: y + 3, width: BW, height: 20, rx: 4, fill: '#F2EEE2' }));
      if (w) svg.appendChild(sv('rect', { x: LW, y: y + 3, width: w, height: 20, rx: 4, fill: '#0F85DB' }));
      svg.appendChild(sv('text', { x: LW + w + 6, y: y + 18, 'font-size': '13', 'font-weight': '700', fill: 'currentColor' }, String(v)));
    });
    card.appendChild(svg);

    var det = el('details');
    det.appendChild(el('summary', null, 'Show as a table'));
    var tbl = el('table', { 'class': 'sp-labstats-table' }), thead = el('thead'), hr = el('tr'), tb = el('tbody');
    tbl.appendChild(el('caption', { 'class': 'sp-hint' }, 'Published capsules per pathway'));
    hr.appendChild(el('th', { scope: 'col', style: 'text-align:left;padding-right:16px' }, 'Pathway'));
    hr.appendChild(el('th', { scope: 'col', style: 'text-align:right' }, 'Published'));
    thead.appendChild(hr);
    PATHS.forEach(function (p) {
      var tr = el('tr');
      tr.appendChild(el('th', { scope: 'row', style: 'text-align:left;font-weight:400;padding-right:16px' }, p[1]));
      tr.appendChild(el('td', { style: 'text-align:right' }, String(per[p[0]])));
      tb.appendChild(tr);
    });
    tbl.appendChild(thead); tbl.appendChild(tb); det.appendChild(tbl);
    card.appendChild(det);

    card.appendChild(el('p', { 'class': 'sp-hint', id: 'sp-labstats-reviewer', style: 'margin-top:12px' },
      best ? 'Most active reviewer: ' + best + ' (' + bestN + (bestN === 1 ? ' decision)' : ' decisions)') : 'Most active reviewer: none yet (0 decisions)'));
    return card;
  }

  function ensure() {
    var body = root.querySelector('.sp-body');
    var cards = root.querySelectorAll('#sp-labstats'), i;
    if (!body) return;
    if (cards.length === 1 && cards[0].parentNode === body) return;
    for (i = 0; i < cards.length; i++) cards[i].parentNode.removeChild(cards[i]);
    body.appendChild(build());
  }

  var mo = new MutationObserver(function () { ensure(); });
  mo.observe(root, { childList: true, subtree: true });
  ensure();
})();
