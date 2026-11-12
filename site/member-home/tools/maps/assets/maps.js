/* Our own maps tool. No outside scripts, no map tiles, no tracking: the base map is
   Natural Earth (public domain) drawn by this file as SVG, so it works under the sites'
   strict Content-Security-Policy and on any phone, pad or desktop.
   Use: <div class="mp" data-map="data/public/places.json" data-basemap="data/basemap.json"></div>
   Each data file lists layers, areas (whole countries or Indian states) and points. */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var WORLD = 1024;                    // world width in map units at zoom 1
  var MIN_K = 1, MAX_K = 96;
  var STATUS = {
    open: 'In use now',
    planned: 'Planned',
    sample: 'Sample, not real'
  };
  var PRECISION = {
    exact: '',
    city: 'Shown at city level. The exact address is shared on request.',
    state: 'Area only. The exact place is not chosen yet.',
    country: 'Country only. The city is not chosen yet.'
  };
  var ICON = {
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    home: 'M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10',
    locate: 'M12 2v4M12 18v4M2 12h4M18 12h4M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
    full: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
    close: 'M6 6l12 12M18 6L6 18',
    search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14M16 16l5 5'
  };
  var basemapCache = {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------------ helpers
  function el(tag, attrs, parent, text) {
    var n = document.createElement(tag);
    for (var a in attrs) if (attrs[a] !== undefined && attrs[a] !== null) n.setAttribute(a, attrs[a]);
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function sv(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var a in attrs) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function icon(name, parent) {
    var s = sv('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', 'class': 'mp-ico' }, parent);
    sv('path', { d: ICON[name] }, s);
    return s;
  }
  function iconButton(parent, name, label, cls) {
    var b = el('button', { type: 'button', 'class': 'mp-btn ' + (cls || ''), title: label, 'aria-label': label }, parent);
    icon(name, b);
    return b;
  }
  function getJSON(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }
  function px(lon) { return (lon + 180) / 360 * WORLD; }
  function py(lat) {
    lat = Math.max(-85, Math.min(85, lat));
    var s = Math.sin(lat * Math.PI / 180);
    return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * WORLD;
  }
  function unproject(x, y) {
    var lon = x / WORLD * 360 - 180;
    var n = Math.PI - 2 * Math.PI * y / WORLD;
    return [lon, 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))];
  }
  function km(a, b) {             // straight-line distance, [lon, lat]
    var r = Math.PI / 180, dLat = (b[1] - a[1]) * r, dLon = (b[0] - a[0]) * r;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }
  function ringsPath(g, scale, box) {
    var d = '';
    for (var i = 0; i < g.length; i++) {
      var r = g[i];
      for (var j = 0; j < r.length; j += 2) {
        var x = px(r[j] / scale), y = py(r[j + 1] / scale);
        if (box) {
          if (x < box[0]) box[0] = x; if (y < box[1]) box[1] = y;
          if (x > box[2]) box[2] = x; if (y > box[3]) box[3] = y;
        }
        d += (j ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
      }
      d += 'Z';
    }
    return d;
  }
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // ------------------------------------------------------------------ the map
  function MapTool(root) {
    this.root = root;
    this.k = 1; this.cx = WORLD / 2; this.cy = WORLD / 2;
    this.layerOn = {};
    this.marks = [];
    this.pointers = {};
    this.frame = 0;
    var self = this;
    var bm = root.getAttribute('data-basemap') || 'data/basemap.json';
    root.classList.add('mp-loading');
    if (!basemapCache[bm]) basemapCache[bm] = getJSON(bm);
    Promise.all([basemapCache[bm], getJSON(root.getAttribute('data-map'))]).then(function (r) {
      self.base = r[0]; self.data = r[1];
      root.classList.remove('mp-loading');
      self.build();
    }).catch(function (e) {
      root.classList.remove('mp-loading');
      root.textContent = 'The map could not load. Please refresh the page.';
      if (window.console) console.error(e);
    });
  }

  MapTool.prototype.build = function () {
    var d = this.data, root = this.root, self = this;
    if (d.theme && !root.getAttribute('data-theme')) root.setAttribute('data-theme', d.theme);
    root.innerHTML = '';
    (d.layers || []).forEach(function (l) { self.layerOn[l.id] = l.on !== false; });
    this.fnIndex = {};
    (d.footnotes || []).forEach(function (f, i) { self.fnIndex[f.id] = i + 1; });

    if (d.title) el('h2', { 'class': 'mp-title' }, root, d.title);
    if (d.intro) el('p', { 'class': 'mp-intro' }, root, d.intro);

    // toolbar: search + layer switches
    var bar = el('div', { 'class': 'mp-bar' }, root);
    var sWrap = el('div', { 'class': 'mp-search' }, bar);
    var sid = 'mp-s-' + Math.random().toString(36).slice(2, 8);
    el('label', { 'for': sid, 'class': 'mp-sr' }, sWrap, 'Find a place on the map');
    icon('search', sWrap);
    this.searchInput = el('input', { id: sid, type: 'search', placeholder: 'Find a place', autocomplete: 'off',
      role: 'combobox', 'aria-expanded': 'false', 'aria-controls': sid + '-r', 'aria-autocomplete': 'list' }, sWrap);
    this.searchList = el('ul', { id: sid + '-r', role: 'listbox', 'class': 'mp-results', hidden: '' }, sWrap);
    if ((d.layers || []).length) {
      var fs = el('fieldset', { 'class': 'mp-layers' }, bar);
      el('legend', {}, fs, 'Show on map');
      d.layers.forEach(function (l) {
        var lab = el('label', { 'class': 'mp-layer' }, fs);
        var cb = el('input', { type: 'checkbox' }, lab);
        cb.checked = self.layerOn[l.id];
        el('span', { 'class': 'mp-sw mp-sw-' + (l.style || 'open') }, lab);
        el('span', {}, lab, l.name);
        cb.addEventListener('change', function () { self.layerOn[l.id] = cb.checked; self.refreshLayers(); });
      });
    }

    // the map frame
    this.frameEl = el('div', { 'class': 'mp-frame' }, root);
    this.svg = sv('svg', { 'class': 'mp-svg', role: 'application', tabindex: '0',
      'aria-label': (d.title || 'Map') + '. Drag or use arrow keys to move, plus and minus to zoom.' }, this.frameEl);
    sv('rect', { 'class': 'mp-sea', x: -WORLD, y: -WORLD, width: WORLD * 3, height: WORLD * 3 }, this.svg);
    this.gLand = sv('g', { 'class': 'mp-land' }, this.svg);
    this.gStates = sv('g', { 'class': 'mp-states' }, this.svg);
    this.gLabels = sv('g', { 'class': 'mp-labels', 'aria-hidden': 'true' }, this.svg);
    this.gMarks = sv('g', { 'class': 'mp-marks' }, this.svg);
    this.gClusters = sv('g', { 'class': 'mp-clusters' }, this.svg);
    this.drawBase();
    this.drawData();

    var ctl = el('div', { 'class': 'mp-ctl' }, this.frameEl);
    iconButton(ctl, 'plus', 'Zoom in').addEventListener('click', function () { self.zoomBy(2); });
    iconButton(ctl, 'minus', 'Zoom out').addEventListener('click', function () { self.zoomBy(0.5); });
    iconButton(ctl, 'home', 'Back to the start view').addEventListener('click', function () { self.home(true); });
    if (navigator.geolocation) iconButton(ctl, 'locate', 'Show where I am').addEventListener('click', function () { self.locate(); });
    this.fullBtn = iconButton(ctl, 'full', 'Full screen');
    this.fullBtn.addEventListener('click', function () { self.toggleFull(); });

    this.panel = el('aside', { 'class': 'mp-panel', 'aria-live': 'polite', hidden: '' }, this.frameEl);
    el('div', { 'class': 'mp-scale', 'aria-hidden': 'true' }, this.frameEl);

    this.drawLegend();
    this.drawList();
    this.drawFootnotes();
    this.bindInput();

    this.ro = window.ResizeObserver ? new ResizeObserver(function () { self.render(); }) : null;
    if (this.ro) this.ro.observe(this.frameEl); else window.addEventListener('resize', function () { self.render(); });
    if (!this.fromHash()) this.home(false);
  };

  MapTool.prototype.drawBase = function () {
    var b = this.base, s = b.scale, self = this;
    this.countryEls = {};
    this.labelItems = [];
    b.countries.forEach(function (c) {
      if (c.iso === 'AQ') return;
      var box = [1e9, 1e9, -1e9, -1e9];
      var p = sv('path', { d: ringsPath(c.g, s, box), 'class': 'mp-country' }, self.gLand);
      if (c.iso) self.countryEls[c.iso] = p;
      c.box = box;
      if (c.at) self.labelItems.push({ text: c.name, x: px(c.at[0]), y: py(c.at[1]), w: box[2] - box[0], kind: 'country' });
    });
    this.stateEls = {};
    b.states.forEach(function (st) {
      var box = [1e9, 1e9, -1e9, -1e9];
      var p = sv('path', { d: ringsPath(st.g, s, box), 'class': 'mp-state' }, self.gStates);
      self.stateEls[st.code] = p;
      st.box = box;
      if (st.at) self.labelItems.push({ text: st.name, x: px(st.at[0]), y: py(st.at[1]), w: box[2] - box[0], kind: 'state' });
    });
    b.places.forEach(function (p) {
      self.labelItems.push({ text: p[0], x: px(p[3]), y: py(p[4]), rank: p[5], kind: 'place' });
    });
  };

  MapTool.prototype.findArea = function (a) {
    var b = this.base, i;
    if (a.state) { for (i = 0; i < b.states.length; i++) if (b.states[i].code === a.state) return { el: this.stateEls[a.state], f: b.states[i] }; }
    if (a.country) { for (i = 0; i < b.countries.length; i++) if (b.countries[i].iso === a.country) return { el: this.countryEls[a.country], f: b.countries[i] }; }
    return null;
  };

  MapTool.prototype.drawData = function () {
    var d = this.data, self = this;
    this.areas = [];
    (d.areas || []).forEach(function (a) {
      var hit = self.findArea(a);
      if (!hit) return;
      var item = { kind: 'area', src: a, el: hit.el, box: hit.f.box, at: hit.f.at, name: a.name || hit.f.name };
      hit.el.classList.add('mp-area');
      hit.el.setAttribute('tabindex', '0');
      hit.el.setAttribute('role', 'button');
      hit.el.setAttribute('aria-label', item.name + ', ' + (STATUS[a.status] || a.status));
      self.areas.push(item);
      self.marks.push(item);
    });
    (d.points || []).forEach(function (p) {
      var g = sv('g', { 'class': 'mp-mark mp-' + p.status + (p.precision && p.precision !== 'exact' && p.precision !== 'city' ? ' mp-approx' : ''),
        tabindex: '0', role: 'button', 'aria-label': p.name + ', ' + (STATUS[p.status] || p.status) }, self.gMarks);
      if (p.precision === 'state' || p.precision === 'country') sv('circle', { r: 16, 'class': 'mp-halo' }, g);
      if (p.status === 'sample') sv('rect', { x: -6, y: -6, width: 12, height: 12, 'class': 'mp-dot' }, g);
      else sv('circle', { r: 7, 'class': 'mp-dot' }, g);
      sv('circle', { r: 22, 'class': 'mp-hit' }, g);
      var item = { kind: 'point', src: p, el: g, x: px(p.lon), y: py(p.lat), at: [p.lon, p.lat], name: p.name };
      self.marks.push(item);
    });
    this.marks.forEach(function (m) {
      var open = function () { self.select(m, false); };
      m.el.addEventListener('click', function (e) { if (!self.dragged) { e.stopPropagation(); open(); } });
      m.el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); open(); }
      });
    });
    this.refreshLayers();
  };

  MapTool.prototype.visible = function (m) {
    var l = m.src.layer;
    return !l || this.layerOn[l] !== false;
  };

  MapTool.prototype.refreshLayers = function () {
    var self = this;
    this.marks.forEach(function (m) {
      var on = self.visible(m);
      if (m.kind === 'area') {
        m.el.classList.toggle('mp-area', on);
        m.el.classList.toggle('mp-area-' + m.src.status, on);
        if (on) { m.el.setAttribute('tabindex', '0'); m.el.setAttribute('role', 'button'); }
        else { m.el.removeAttribute('tabindex'); m.el.removeAttribute('role'); }
      } else {
        m.el.style.display = on ? '' : 'none';
      }
      if (m.row) m.row.hidden = !on;
    });
    if (this.listEmpty) this.listEmpty.hidden = this.marks.some(function (m) { return self.visible(m); });
    if (this.current && !this.visible(this.current)) this.closePanel();
    if (this.svg && this.svg.getAttribute('viewBox')) this.render();
  };

  // ------------------------------------------------------------------ view
  MapTool.prototype.size = function () {
    var r = this.frameEl.getBoundingClientRect();
    return [Math.max(r.width, 1), Math.max(r.height, 1)];
  };
  MapTool.prototype.unitsPerPx = function () { return WORLD / (this.k * this.size()[0]); };

  MapTool.prototype.clamp = function () {
    this.k = Math.max(MIN_K, Math.min(MAX_K, this.k));
    var s = this.size(), hw = WORLD / this.k / 2, hh = hw * s[1] / s[0];
    var top = py(84), bottom = py(-60);
    this.cx = hw * 2 >= WORLD ? WORLD / 2 : Math.max(hw, Math.min(WORLD - hw, this.cx));
    this.cy = hh * 2 >= bottom - top ? (top + bottom) / 2 : Math.max(top + hh, Math.min(bottom - hh, this.cy));
  };

  MapTool.prototype.render = function () {
    var self = this;
    if (this.frame) return;
    this.frame = requestAnimationFrame(function () { self.frame = 0; self.draw(); });
  };

  MapTool.prototype.draw = function () {
    this.clamp();
    var s = this.size(), w = WORLD / this.k, h = w * s[1] / s[0];
    var x0 = this.cx - w / 2, y0 = this.cy - h / 2;
    this.svg.setAttribute('viewBox', x0.toFixed(3) + ' ' + y0.toFixed(3) + ' ' + w.toFixed(3) + ' ' + h.toFixed(3));
    var u = w / s[0];                                    // map units per screen pixel
    this.marks.forEach(function (m) {
      if (m.kind === 'point') m.el.setAttribute('transform', 'translate(' + m.x.toFixed(3) + ' ' + m.y.toFixed(3) + ') scale(' + u.toFixed(5) + ')');
    });
    this.cluster(x0, y0, u);
    this.svg.classList.toggle('mp-show-states', this.k >= 3);
    this.drawLabels(x0, y0, w, h, u);
    this.drawScale(u);
    if (this.you) this.you.setAttribute('transform', 'translate(' + this.you.x + ' ' + this.you.y + ') scale(' + u.toFixed(5) + ')');
  };

  // Points closer than 28 screen pixels join into one numbered circle; tapping it zooms in.
  MapTool.prototype.cluster = function (x0, y0, u) {
    var self = this, g = this.gClusters, groups = [];
    while (g.firstChild) g.removeChild(g.firstChild);
    this.marks.forEach(function (m) {
      if (m.kind !== 'point') return;
      m.el.classList.remove('mp-in-cluster');
      if (!self.visible(m) || m === self.current) return;
      var sx = (m.x - x0) / u, sy = (m.y - y0) / u;
      for (var i = 0; i < groups.length; i++) {
        var c = groups[i];
        if (Math.abs(c.sx - sx) < 28 && Math.abs(c.sy - sy) < 28) { c.items.push(m); return; }
      }
      groups.push({ sx: sx, sy: sy, items: [m] });
    });
    groups.forEach(function (c) {
      if (c.items.length < 2) return;
      var x = 0, y = 0, box = [1e9, 1e9, -1e9, -1e9];
      c.items.forEach(function (m) {
        m.el.classList.add('mp-in-cluster');
        x += m.x; y += m.y;
        box = [Math.min(box[0], m.x), Math.min(box[1], m.y), Math.max(box[2], m.x), Math.max(box[3], m.y)];
      });
      x /= c.items.length; y /= c.items.length;
      var names = c.items.map(function (m) { return m.name; });
      var cg = sv('g', { 'class': 'mp-cluster', tabindex: '0', role: 'button',
        'aria-label': c.items.length + ' places here: ' + names.slice(0, 5).join(', ') + (names.length > 5 ? ' and more' : '') + '. Zoom in to see them.',
        transform: 'translate(' + x.toFixed(3) + ' ' + y.toFixed(3) + ') scale(' + u.toFixed(5) + ')' }, g);
      sv('circle', { r: c.items.length > 9 ? 17 : 14 }, cg);
      var t = sv('text', { y: 4.5, 'text-anchor': 'middle' }, cg);
      t.textContent = c.items.length;
      var zoom = function () {
        if (box[2] - box[0] < 1e-3 && box[3] - box[1] < 1e-3) self.go(x, y, Math.min(MAX_K, self.k * 4), true);
        else self.fit([box[0] - 1e-3, box[1] - 1e-3, box[2] + 1e-3, box[3] + 1e-3], true, Math.max(self.k * 2, 1));
      };
      cg.addEventListener('click', function (e) { if (!self.dragged) { e.stopPropagation(); zoom(); } });
      cg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zoom(); } });
    });
  };

  MapTool.prototype.drawLabels = function (x0, y0, w, h, u) {
    var g = this.gLabels, k = this.k, placed = [], items = this.labelItems;
    while (g.firstChild) g.removeChild(g.firstChild);
    var placeRank = k < 3 ? 0 : k < 5 ? 1 : k < 8 ? 3 : k < 14 ? 4 : 8;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.x < x0 || it.x > x0 + w || it.y < y0 || it.y > y0 + h) continue;
      if (it.kind === 'country' && it.w / u < 70) continue;
      if (it.kind === 'state' && (k < 4 || it.w / u < 60)) continue;
      if (it.kind === 'place' && it.rank > placeRank) continue;
      var sx = (it.x - x0) / u, sy = (it.y - y0) / u, lw = it.text.length * 6.5;
      var clash = false;
      for (var j = 0; j < placed.length; j++) {
        var q = placed[j];
        if (Math.abs(q[0] - sx) < (q[2] + lw) / 2 + 4 && Math.abs(q[1] - sy) < 16) { clash = true; break; }
      }
      if (clash) continue;
      placed.push([sx, sy, lw]);
      var t = sv('g', { 'class': 'mp-lbl mp-lbl-' + it.kind, transform: 'translate(' + it.x.toFixed(3) + ' ' + it.y.toFixed(3) + ') scale(' + u.toFixed(5) + ')' }, g);
      if (it.kind === 'place') sv('circle', { r: 2.5 }, t);
      var tx = sv('text', { y: it.kind === 'place' ? -6 : 4, 'text-anchor': 'middle' }, t);
      tx.textContent = it.text;
      if (placed.length > 160) break;
    }
  };

  MapTool.prototype.drawScale = function (u) {
    var bar = this.frameEl.querySelector('.mp-scale');
    var lat = unproject(this.cx, this.cy)[1];
    var kmPerUnit = 40075 * Math.cos(lat * Math.PI / 180) / WORLD;
    var kmFor100 = 100 * u * kmPerUnit, steps = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
    var pick = steps[0];
    for (var i = 0; i < steps.length; i++) if (steps[i] <= kmFor100) pick = steps[i];
    bar.style.width = Math.round(pick / kmFor100 * 100) + 'px';
    bar.textContent = pick + ' km';
  };

  MapTool.prototype.fit = function (box, animate, maxK, cover) {
    var s = this.size(), bw = Math.max(box[2] - box[0], 1e-3), bh = Math.max(box[3] - box[1], 1e-3);
    var k = (cover ? Math.max : Math.min)(WORLD / bw, WORLD * s[1] / s[0] / bh) * 0.85;
    this.go((box[0] + box[2]) / 2, (box[1] + box[3]) / 2, Math.min(k, maxK || MAX_K), animate);
  };

  MapTool.prototype.go = function (cx, cy, k, animate) {
    var self = this;
    if (!animate || reduceMotion) { this.cx = cx; this.cy = cy; this.k = k; this.render(); return; }
    var a = { cx: this.cx, cy: this.cy, k: this.k }, t0 = performance.now(), dur = 450;
    cancelAnimationFrame(this.anim);
    var step = function (t) {
      var f = Math.min(1, (t - t0) / dur), e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      self.k = Math.exp(Math.log(a.k) + (Math.log(k) - Math.log(a.k)) * e);
      self.cx = a.cx + (cx - a.cx) * e; self.cy = a.cy + (cy - a.cy) * e;
      self.draw();
      if (f < 1) self.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  };

  MapTool.prototype.home = function (animate) {
    var v = this.data.view || {}, b = v.bounds || [[-170, -56], [190, 80]];
    if (b[1][0] > 180) b = [[b[0][0], b[0][1]], [180, b[1][1]]];
    var s = this.size();         // tall phone screens: fill the height instead of leaving empty sea
    this.fit([px(b[0][0]), py(b[1][1]), px(b[1][0]), py(b[0][1])], animate, MAX_K, s[1] > s[0] * 1.2 && !v.bounds);
  };

  MapTool.prototype.zoomBy = function (f, sx, sy) {
    var s = this.size();
    if (sx === undefined) { sx = s[0] / 2; sy = s[1] / 2; }
    var u = WORLD / this.k / s[0];
    var mx = this.cx + (sx - s[0] / 2) * u, my = this.cy + (sy - s[1] / 2) * u;
    var k = Math.max(MIN_K, Math.min(MAX_K, this.k * f)), u2 = WORLD / k / s[0];
    this.k = k; this.cx = mx - (sx - s[0] / 2) * u2; this.cy = my - (sy - s[1] / 2) * u2;
    this.render();
  };

  MapTool.prototype.panBy = function (dx, dy) {
    var u = this.unitsPerPx();
    this.cx -= dx * u; this.cy -= dy * u;
    this.render();
  };

  // ------------------------------------------------------------------ input
  MapTool.prototype.bindInput = function () {
    var self = this, svg = this.svg, P = this.pointers, last = null, moved = 0;
    svg.addEventListener('pointerdown', function (e) {
      if (e.button && e.button !== 0) return;
      P[e.pointerId] = [e.clientX, e.clientY];
      moved = 0; self.dragged = false;
      last = null;
    });
    svg.addEventListener('pointermove', function (e) {
      if (!P[e.pointerId]) return;
      var ids = Object.keys(P), prev = P[e.pointerId];
      P[e.pointerId] = [e.clientX, e.clientY];
      if (ids.length === 1) {
        var dx = e.clientX - prev[0], dy = e.clientY - prev[1];
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 6 && !self.dragged) {
          self.dragged = true;      // capture only once a drag starts, so taps still reach the markers
          try { svg.setPointerCapture(e.pointerId); } catch (x) { /* older browsers */ }
        }
        self.panBy(dx, dy);
      } else if (ids.length === 2) {
        var a = P[ids[0]], b = P[ids[1]], r = svg.getBoundingClientRect();
        var dist = Math.hypot(a[0] - b[0], a[1] - b[1]), mid = [(a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top];
        if (last) { self.zoomBy(dist / last.dist, mid[0], mid[1]); self.panBy(mid[0] - last.mid[0], mid[1] - last.mid[1]); }
        last = { dist: dist, mid: mid };
        self.dragged = true;
      }
    });
    var up = function (e) { delete P[e.pointerId]; last = null; };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = svg.getBoundingClientRect(), dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      self.zoomBy(Math.pow(2, -dy / 300), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    svg.addEventListener('dblclick', function (e) {
      var r = svg.getBoundingClientRect();
      self.zoomBy(e.shiftKey ? 0.5 : 2, e.clientX - r.left, e.clientY - r.top);
    });
    svg.addEventListener('click', function () { if (!self.dragged) self.closePanel(); });
    svg.addEventListener('keydown', function (e) {
      var m = { ArrowLeft: [80, 0], ArrowRight: [-80, 0], ArrowUp: [0, 80], ArrowDown: [0, -80] }[e.key];
      if (m) { e.preventDefault(); self.panBy(m[0], m[1]); return; }
      if (e.key === '+' || e.key === '=') { e.preventDefault(); self.zoomBy(2); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); self.zoomBy(0.5); }
      else if (e.key === '0') { e.preventDefault(); self.home(true); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (self.root.classList.contains('mp-full')) self.toggleFull();
      else self.closePanel();
    });

    // search
    var inp = this.searchInput, list = this.searchList, results = [], active = -1;
    var show = function () {
      var q = norm(inp.value.trim());
      while (list.firstChild) list.removeChild(list.firstChild);
      results = q.length < 2 ? [] : self.search(q);
      active = -1;
      results.forEach(function (r, i) {
        var li = el('li', { role: 'option', id: list.id + '-' + i, 'aria-selected': 'false' }, list);
        el('span', {}, li, r.label);
        if (r.sub) el('small', {}, li, r.sub);
        li.addEventListener('mousedown', function (e) { e.preventDefault(); choose(i); });
      });
      if (q.length >= 2 && !results.length) el('li', { 'class': 'mp-none' }, list, 'No match on this map');
      list.hidden = q.length < 2;
      inp.setAttribute('aria-expanded', list.hidden ? 'false' : 'true');
    };
    var choose = function (i) {
      var r = results[i];
      if (!r) return;
      list.hidden = true; inp.setAttribute('aria-expanded', 'false');
      inp.value = r.label;
      r.go();
    };
    var mark = function () {
      [].forEach.call(list.children, function (li, i) { li.setAttribute('aria-selected', i === active ? 'true' : 'false'); });
      if (active >= 0) inp.setAttribute('aria-activedescendant', list.id + '-' + active); else inp.removeAttribute('aria-activedescendant');
    };
    inp.addEventListener('input', show);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(results.length - 1, active + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); mark(); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(active < 0 ? 0 : active); }
      else if (e.key === 'Escape') { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); }
    });
    inp.addEventListener('blur', function () { setTimeout(function () { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); }, 150); });
    window.addEventListener('hashchange', function () { self.fromHash(); });
  };

  MapTool.prototype.search = function (q) {
    var out = [], self = this, b = this.base;
    var hit = function (name) { var n = norm(name); return n.indexOf(q) === 0 ? 0 : n.indexOf(q) > 0 ? 1 : -1; };
    this.marks.forEach(function (m) {
      if (!self.visible(m)) return;
      var h = hit(m.name);
      if (h >= 0) out.push({ score: h, label: m.name, sub: STATUS[m.src.status] || '', go: function () { self.select(m, true); } });
    });
    b.countries.forEach(function (c) {
      var h = hit(c.name);
      if (h >= 0 && c.box) out.push({ score: 2 + h, label: c.name, sub: 'Country', go: function () { self.fit(c.box, true); } });
    });
    b.states.forEach(function (st) {
      var h = hit(st.name);
      if (h >= 0) out.push({ score: 2 + h, label: st.name, sub: 'State or territory, India', go: function () { self.fit(st.box, true); } });
    });
    b.places.forEach(function (p) {
      var h = hit(p[0]);
      if (h >= 0) out.push({ score: 4 + h + p[5] / 10, label: p[0], sub: [p[2], p[1]].filter(Boolean).join(', '),
        go: function () { self.go(px(p[3]), py(p[4]), 24, true); } });
    });
    out.sort(function (a, c) { return a.score - c.score || a.label.localeCompare(c.label); });
    return out.slice(0, 8);
  };

  // ------------------------------------------------------------------ panel
  MapTool.prototype.select = function (m, fly) {
    var p = m.src, d = this.data, self = this, panel = this.panel;
    this.current = m;
    this.marks.forEach(function (o) { o.el.classList.toggle('mp-sel', o === m); });
    while (panel.firstChild) panel.removeChild(panel.firstChild);
    var close = iconButton(panel, 'close', 'Close', 'mp-close');
    close.addEventListener('click', function () { self.closePanel(); self.svg.focus(); });
    el('p', { 'class': 'mp-badge mp-badge-' + p.status }, panel, STATUS[p.status] || p.status);
    var h = el('h3', {}, panel, m.name);
    var layer = (d.layers || []).filter(function (l) { return l.id === p.layer; })[0];
    if (layer || p.place) el('p', { 'class': 'mp-place' }, panel, [p.place, layer && layer.name].filter(Boolean).join(' · '));
    if (p.note) el('p', {}, panel, p.note);
    var prec = m.kind === 'area' ? 'Whole area shown. Exact places are announced when they open.' : PRECISION[p.precision || 'exact'];
    if (prec) el('p', { 'class': 'mp-prec' }, panel, prec);
    if (p.fn && p.fn.length) {
      var fp = el('p', { 'class': 'mp-fnref' }, panel, 'Notes: ');
      p.fn.forEach(function (id, i) {
        if (i) fp.appendChild(document.createTextNode(', '));
        el('a', { href: '#' + self.root.id + '-fn-' + id }, fp, String(self.fnIndex[id] || id));
      });
    }
    var links = el('p', { 'class': 'mp-links' }, panel);
    if (m.kind === 'point' && (p.precision === 'exact' || p.precision === 'city' || !p.precision)) {
      var z = p.precision === 'city' ? 11 : 16;
      el('a', { href: 'https://www.openstreetmap.org/?mlat=' + p.lat + '&mlon=' + p.lon + '#map=' + z + '/' + p.lat + '/' + p.lon,
        target: '_blank', rel: 'noopener noreferrer' }, links, 'Open street map');
    }
    if (p.id) {
      var share = el('a', { href: '#map=' + encodeURIComponent(p.id) }, links, 'Link to this place');
      share.addEventListener('click', function (e) {
        e.preventDefault();
        history.replaceState(null, '', '#map=' + encodeURIComponent(p.id));
        if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { share.textContent = 'Link copied'; }, function () {});
      });
    }
    if (p.action && p.action.href && /^(\/|#|mailto:|https:\/\/)/.test(p.action.href)) el('a', { href: p.action.href, 'class': 'mp-cta' }, links, p.action.label || 'Ask about this');
    if (this.youAt) {
      var dkm = km(this.youAt, m.at);
      el('p', { 'class': 'mp-prec' }, panel, 'About ' + Math.round(dkm).toLocaleString() + ' km from you, in a straight line.');
    }
    panel.hidden = false;
    h.setAttribute('tabindex', '-1');
    if (fly) {
      if (m.kind === 'area') this.fit(m.box, true);
      else {
        // on phones the panel is a bottom sheet, so aim the place at the middle of the map that is still showing
        var k = Math.max(this.k, p.precision === 'country' ? 5 : p.precision === 'state' ? 8 : 16);
        var s = this.size(), sheet = panel.offsetWidth > s[0] * 0.9 ? Math.min(panel.offsetHeight, s[1] * 0.6) : 0;
        this.go(m.x, m.y + sheet / 2 * WORLD / (k * s[0]), k, true);
      }
    }
    if (m.row) m.row.classList.add('mp-row-sel');
    this.marks.forEach(function (o) { if (o.row && o !== m) o.row.classList.remove('mp-row-sel'); });
    this.render();
  };

  MapTool.prototype.closePanel = function () {
    this.current = null;
    this.panel.hidden = true;
    this.marks.forEach(function (o) { o.el.classList.remove('mp-sel'); if (o.row) o.row.classList.remove('mp-row-sel'); });
    if (this.svg.getAttribute('viewBox')) this.render();
  };

  MapTool.prototype.fromHash = function () {
    var m = /#map=([^&]+)/.exec(location.hash);
    if (!m) return false;
    var id = decodeURIComponent(m[1]);
    for (var i = 0; i < this.marks.length; i++) {
      if (this.marks[i].src.id === id && this.visible(this.marks[i])) { this.home(false); this.draw(); this.select(this.marks[i], true); return true; }
    }
    return false;
  };

  MapTool.prototype.toggleFull = function () {
    var on = this.root.classList.toggle('mp-full');
    document.documentElement.classList.toggle('mp-noscroll', on);
    this.fullBtn.setAttribute('aria-label', on ? 'Leave full screen' : 'Full screen');
    this.fullBtn.title = on ? 'Leave full screen' : 'Full screen';
    this.render();
  };

  // Your position stays in this browser. It is never sent anywhere.
  MapTool.prototype.locate = function () {
    var self = this;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var at = [pos.coords.longitude, pos.coords.latitude];
      self.youAt = at;
      if (!self.you) {
        self.you = sv('g', { 'class': 'mp-you', 'aria-hidden': 'true' }, self.gMarks);
        sv('circle', { r: 9 }, self.you);
      }
      self.you.x = px(at[0]).toFixed(3); self.you.y = py(at[1]).toFixed(3);
      var best = null;
      self.marks.forEach(function (m) {
        if (!self.visible(m) || !m.at || m.src.status === 'sample') return;
        var dk = km(at, m.at);
        if (!best || dk < best.d) best = { m: m, d: dk };
      });
      self.go(px(at[0]), py(at[1]), Math.max(self.k, 6), true);
      self.showNote(best ? 'Nearest on this map: ' + best.m.name + ', about ' + Math.round(best.d).toLocaleString() + ' km away in a straight line. Your position stays on your device.'
        : 'Your position is shown. It stays on your device.', best && best.m);
    }, function () {
      self.showNote('Your browser did not share a position. You can still search for a place.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 });
  };

  MapTool.prototype.showNote = function (text, target) {
    var self = this, panel = this.panel;
    this.current = null;
    while (panel.firstChild) panel.removeChild(panel.firstChild);
    iconButton(panel, 'close', 'Close', 'mp-close').addEventListener('click', function () { self.closePanel(); });
    el('p', {}, panel, text);
    if (target) {
      var b = el('button', { type: 'button', 'class': 'mp-textbtn' }, panel, 'Show ' + target.name);
      b.addEventListener('click', function () { self.select(target, true); });
    }
    panel.hidden = false;
  };

  // ------------------------------------------------------------------ legend, list, notes
  MapTool.prototype.drawLegend = function () {
    var used = {}, approx = false;
    this.marks.forEach(function (m) { used[m.kind === 'area' ? 'area-' + m.src.status : m.src.status] = 1; if (/state|country/.test(m.src.precision || '')) approx = true; });
    var ul = el('ul', { 'class': 'mp-legend', 'aria-label': 'Map key' }, this.root);
    var add = function (cls, text) { var li = el('li', {}, ul); el('span', { 'class': 'mp-key ' + cls, 'aria-hidden': 'true' }, li); el('span', {}, li, text); };
    if (used.open) add('mp-key-open', 'In use now');
    if (used.planned) add('mp-key-planned', 'Planned, not open yet');
    if (approx) add('mp-key-approx', 'Area only, place not chosen');
    if (used['area-planned']) add('mp-key-area', 'Planned across this area');
    if (used['area-open']) add('mp-key-area-open', 'Served now across this area');
    if (used.sample) add('mp-key-sample', 'Sample entry, not real');
  };

  MapTool.prototype.drawList = function () {
    var self = this, d = this.data;
    var det = el('details', { 'class': 'mp-list' }, this.root);
    el('summary', {}, det, d.listTitle || 'All places as a list');
    this.listEmpty = el('p', { 'class': 'mp-empty' }, det, d.empty || 'No places to show yet. Places appear here when they are confirmed.');
    if (!this.marks.length) return;
    var t = el('table', {}, det);
    var hr = el('tr', {}, el('thead', {}, t));
    ['Place', 'Status', 'Where', ''].forEach(function (h, i) { el('th', { scope: 'col', 'class': i === 3 ? 'mp-sr-th' : null }, hr, h || 'Action'); });
    var tb = el('tbody', {}, t);
    this.marks.forEach(function (m) {
      var tr = el('tr', {}, tb);
      el('th', { scope: 'row' }, tr, m.name);
      el('td', {}, tr, STATUS[m.src.status] || m.src.status);
      el('td', {}, tr, m.src.place || '');
      var b = el('button', { type: 'button', 'class': 'mp-textbtn' }, el('td', {}, tr), 'Show on map');
      b.addEventListener('click', function () { self.select(m, true); self.frameEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' }); });
      m.row = tr;
    });
    this.refreshLayers();
  };

  MapTool.prototype.drawFootnotes = function () {
    var d = this.data, root = this.root;
    if (!root.id) root.id = 'mp-' + Math.random().toString(36).slice(2, 8);
    var notes = (d.footnotes || []).slice();
    notes.push({ id: 'base', text: 'Base map: ' + this.base.source + '. Borders are simplified for the screen and are not an official survey map.' });
    var ol = el('ol', { 'class': 'mp-notes', 'aria-label': 'Notes about this map' }, root);
    notes.forEach(function (n) { el('li', { id: root.id + '-fn-' + n.id }, ol, n.text); });
  };

  function init() {
    [].forEach.call(document.querySelectorAll('.mp[data-map]'), function (n) {
      if (!n.mapTool) n.mapTool = new MapTool(n);
    });
  }
  window.OwnMaps = { init: init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
