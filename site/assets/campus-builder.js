/* Campus builder: picks a campus type from the campus standards for a learner number.
   Data comes from assets/campus-builder-data.js (generated). Everything is worked out in the browser. Nothing is sent anywhere. */
(function () {
  'use strict';
  var D = window.HFL_CAMPUS;
  var out = document.getElementById('cb-out');
  if (!D || !out) return;
  var $ = function (id) { return document.getElementById(id); };
  var lastText = '';

  function el(tag, text, cls) {
    var n = document.createElement(tag);
    if (text !== undefined && text !== null) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }
  function fmt(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function byCode(c) { for (var i = 0; i < D.types.length; i++) if (D.types[i].code === c) return D.types[i]; return null; }

  function pick(n, ownWc) {
    var order = ['S1', 'S2', ownWc ? 'S6' : 'S4', 'BP', 'FL'];
    for (var i = 0; i < order.length; i++) { var t = byCode(order[i]); if (t && n <= t.learners) return { t: t, sets: 1 }; }
    var fl = byCode('FL');
    return { t: fl, sets: Math.ceil(n / fl.learners) };
  }

  function table(caption, head, rows) {
    var wrap = el('div', null, 'scroll-x'), t = el('table', null, 'ws-table'), th = el('thead'), tr = el('tr'), tb = el('tbody');
    t.appendChild(el('caption', caption));
    head.forEach(function (h) { var c = el('th', h); c.scope = 'col'; tr.appendChild(c); });
    th.appendChild(tr); t.appendChild(th);
    rows.forEach(function (r) {
      var row = el('tr');
      r.forEach(function (c, k) { var cell = el(k === 0 ? 'th' : 'td', c); if (k === 0) cell.scope = 'row'; row.appendChild(cell); });
      tb.appendChild(row);
    });
    t.appendChild(tb); wrap.appendChild(t);
    return wrap;
  }

  function run() {
    var n = parseInt($('cb-n').value, 10);
    var note = $('cb-note');
    if (!n || n < 1 || n > 5000) { note.textContent = 'Please type a number of learners from 1 to 5000.'; return; }
    var id = ($('cb-id').value || 'C01').toUpperCase();
    if (!/^C[0-9]{2}$/.test(id)) { id = 'C01'; $('cb-id').value = id; }
    var ownWc = $('cb-wc').value === 'own';
    var res = pick(n, ownWc), t = res.t, k = res.sets;
    var ax = D.annex.filter(function (a) { return a.slug === $('cb-cl').value; })[0] || D.annex[0];
    note.textContent = '';
    out.textContent = '';

    var head = el('p');
    var strong = el('strong', 'Campus ' + id + ': ' + (k > 1 ? k + ' x ' : '') + t.name + ' (' + t.code + ')');
    head.appendChild(strong);
    out.appendChild(head);
    var facts = el('ul', null, 'lux-list');
    [['Tier', t.tier], ['Modules', fmt(t.mods * k)], ['Floors', String(t.floors)], ['Floor area', 'about ' + fmt(t.area * k) + ' m2'],
     ['Learners at one time', fmt(t.learners * k) + ' (you asked for ' + fmt(n) + ')'], ['Climate annex', ax.name]].forEach(function (f) {
      var li = el('li'); li.appendChild(el('strong', f[0] + ': ')); li.appendChild(document.createTextNode(f[1])); facts.appendChild(li);
    });
    out.appendChild(facts);
    if (k > 1) out.appendChild(el('p', 'This is more than one flagship holds. Plan ' + k + ' flagship campuses, or one flagship with satellites, and give each its own campus number.'));
    if (!ownWc && (t.code === 'S1' || t.code === 'S2' || t.code === 'S4')) out.appendChild(el('p', 'Washrooms are those of the host site. Check that the route to them is step-free.'));
    var link = el('p'); var a = el('a', 'Open the ' + t.name + ' page', 'more'); a.href = t.slug + '.html'; link.appendChild(a); out.appendChild(link);

    var rows = t.q.map(function (q) { return [q[0], q[1], fmt(Math.round(q[2] * k * 10) / 10), q[3]]; });
    out.appendChild(table('Element list for campus ' + id, ['Code', 'Element', 'Quantity', 'Unit'], rows));

    out.appendChild(el('h3', 'File names'));
    var fl = el('ul', null, 'lux-list one');
    ['ARC', 'STR', 'MEP'].forEach(function (d) { fl.appendChild(el('li', id + '-B1-L1-' + d)); });
    out.appendChild(fl);

    out.appendChild(el('h3', 'Steps to model it'));
    var ol = el('ol', null, 'lux-list one');
    D.stages.forEach(function (s) { ol.appendChild(el('li', s[0] + (s[1] === 'none' ? '' : ' (' + s[1] + ')') + ': ' + s[2])); });
    out.appendChild(ol);

    out.appendChild(el('h3', 'Checks for the ' + ax.name.toLowerCase() + ' climate'));
    var cl = el('ul', null, 'lux-list one');
    ax.checks.forEach(function (c) { cl.appendChild(el('li', c)); });
    out.appendChild(cl);
    var al = el('p'); var aa = el('a', 'Open the ' + ax.name.toLowerCase() + ' annex', 'more'); aa.href = ax.slug + '.html'; al.appendChild(aa); out.appendChild(al);
    out.appendChild(el('p', 'Planning values for learning and early design. A licensed local engineer and the local authority confirm every real project.', 'lux-note'));

    lastText = 'Campus ' + id + ': ' + (k > 1 ? k + ' x ' : '') + t.name + ' (' + t.code + ')\n' +
      'Modules ' + t.mods * k + ', floors ' + t.floors + ', area about ' + t.area * k + ' m2, learners at one time ' + t.learners * k + ', climate annex ' + ax.name + '\n\n' +
      'Code\tElement\tQuantity\tUnit\n' + rows.map(function (r) { return r.join('\t'); }).join('\n') + '\n';
  }

  function copy() {
    var note = $('cb-note');
    if (!lastText) run();
    if (!lastText) return;
    var done = function () { note.textContent = 'Copied. Paste it into your notes or a spreadsheet.'; };
    var fail = function () { note.textContent = 'Copy did not work in this browser. Select the table and copy it by hand.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lastText).then(done, fail);
    else fail();
  }

  $('cb-go').addEventListener('click', run);
  $('cb-copy').addEventListener('click', copy);
  $('cb-n').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') run(); });
  run();
})();
