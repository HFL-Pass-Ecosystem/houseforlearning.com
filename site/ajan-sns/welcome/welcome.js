(function () {
  'use strict';
  var API = '/api/ajan-consent';
  var $ = function (id) { return document.getElementById(id); };
  var OPTS = [
    { id: 'workers', t: 'Explore our AI workers', cap: 'Ajan SNS workers', sub: 'Specialist helpers for sales, support, finance and more.', q: 'Which worker should draft my supplier reply?' },
    { id: 'api', t: 'Build with the Ajan SNS API', cap: 'Ajan SNS API', sub: 'One call reaches the right worker for the job.', q: 'How do I call a worker from my own app?' },
    { id: 'build', t: 'Build apps and bring ideas to life', cap: 'Build with us', sub: 'From a sketch to a working app, step by step.', q: 'Turn my enquiry form idea into an app.' },
    { id: 'chat', t: 'Chat with Manav AI', cap: 'Manav AI', sub: 'Our friendly assistant, in your own language.', q: 'Help me plan my week.' }
  ];
  var HUES = ['#59c3a4', '#e0a02a', '#6f8cff', '#e078c0'];
  var picked = [];
  var stateKey = 'ajan_sns_welcome_v1';

  // anonymous random id so each browser keeps one record trail
  function clientId() {
    try { var c = localStorage.getItem('ajan_client'); if (c) return c; } catch (e) {}
    var a = new Uint8Array(16); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; });
    var c2 = Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    try { localStorage.setItem('ajan_client', c2); } catch (e) {}
    return c2;
  }
  function post(body) {
    body.client = clientId();
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function toast(m) { var t = $('toast'); t.textContent = m; t.className = 'toast on'; setTimeout(function () { t.className = 'toast'; }, 1800); }

  var steps = ['s1', 's2', 's3', 's4'];
  var arts = { 1: ['a1'], 2: ['a2'], 3: ['a3'], 4: ['a1'] };
  function show(n) {
    steps.forEach(function (s, i) { $(s).hidden = i !== n - 1; });
    ['a1', 'a2', 'a2s', 'a3'].forEach(function (a) { $(a).hidden = true; });
    if (n === 2) { picked.length ? $('a2s').hidden = false : $('a2').hidden = false; } else (arts[n] || []).forEach(function (a) { $(a).hidden = false; });
    window.scrollTo(0, 0);
  }

  // step 1
  var c1 = $('c1'), go1 = $('go1');
  c1.addEventListener('change', function () { go1.disabled = !c1.checked; });
  var consentDone = false;
  go1.addEventListener('click', function () {
    if (!c1.checked) return;
    go1.disabled = true; $('e1').textContent = '';
    post({ adult_professional: true, marketing_opt_in: $('c2').checked, interests: [] })
      .then(function () { consentDone = true; show(2); })
      .catch(function () { go1.disabled = false; $('e1').textContent = 'We could not save your choice just now. Please try again in a moment.'; });
  });

  // step 2 options, carousel, stacked cards
  var optsEl = $('opts');
  OPTS.forEach(function (o) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.setAttribute('aria-pressed', 'false'); b.dataset.id = o.id;
    b.innerHTML = '<span>' + o.t + '</span><span class="ic" aria-hidden="true">+</span>';
    b.addEventListener('click', function () {
      var i = picked.indexOf(o.id);
      if (i < 0) picked.push(o.id); else picked.splice(i, 1);
      b.setAttribute('aria-pressed', i < 0 ? 'true' : 'false'); b.querySelector('.ic').textContent = i < 0 ? '✓' : '+';
      $('go2').disabled = !picked.length; renderStack(); show(2);
    });
    optsEl.appendChild(b);
  });
  function slideSvg(i) {
    var h = HUES[i];
    return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#0b1316"/>' +
      '<g fill="' + h + '">' + Array.apply(null, Array(70)).map(function (_, k) { var x = (k * 53 + i * 31) % 400, y = (k * 97 + i * 17) % 230; return '<circle cx="' + x + '" cy="' + y + '" r="' + (1 + (k % 3) * .6) + '" opacity="' + (.25 + (k % 5) / 8) + '"/>'; }).join('') + '</g>' +
      '<g fill="none" stroke="' + h + '" stroke-width="3" opacity=".9"><rect x="150" y="50" width="100" height="40" rx="20"/><rect x="150" y="105" width="100" height="40" rx="20" opacity=".6"/><circle cx="200" cy="200" r="' + (28 + i * 4) + '" opacity=".35"/></g></svg>';
  }
  var sl = $('slides'), dots = $('dots'), cur = 0, timer;
  OPTS.forEach(function (o, i) {
    var d = document.createElement('div'); d.className = 'slide' + (i ? '' : ' on');
    d.innerHTML = slideSvg(i) + '<div class="cap"><b>' + o.cap + '</b><span>' + o.sub + '</span></div>';
    sl.appendChild(d);
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show ' + o.cap); if (!i) b.className = 'on';
    b.addEventListener('click', function () { go(i); }); dots.appendChild(b);
  });
  function go(i) {
    cur = i; Array.prototype.forEach.call(sl.children, function (s, k) { s.classList.toggle('on', k === i); });
    Array.prototype.forEach.call(dots.children, function (s, k) { s.classList.toggle('on', k === i); });
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(function () { go((cur + 1) % OPTS.length); }, 4000);

  function renderStack() {
    var st = $('stack'); st.innerHTML = '';
    var order = picked.slice().reverse(); // last picked on top
    order.forEach(function (id, n) {
      var o = OPTS.filter(function (x) { return x.id === id; })[0], idx = OPTS.indexOf(o);
      var c = document.createElement('div'); c.className = 'sc c' + idx;
      c.style.zIndex = 20 - n; c.style.transform = 'translate(' + (n * -14) + 'px,' + (n * -12) + 'px) rotate(' + (n * -2.4) + 'deg)'; c.style.opacity = n > 3 ? 0 : 1 - n * .12;
      c.innerHTML = (n === 0 ? '<span class="ok" aria-hidden="true">✓</span>' : '') + '<h3>' + o.q + '</h3><div class="ln"></div><div class="ln"></div><div class="ln"></div><div class="in">Ask ' + o.cap + '</div>';
      st.appendChild(c);
    });
    var top = order[0] ? OPTS.filter(function (x) { return x.id === order[0]; })[0] : null;
    $('stackcap').textContent = top ? top.t : '';
  }
  $('skip2').addEventListener('click', function () { finishInterests(true); });
  $('go2').addEventListener('click', function () { finishInterests(false); });
  function finishInterests(skipped) {
    post({ adult_professional: true, marketing_opt_in: $('c2').checked, interests: skipped ? [] : picked, skipped_interests: skipped }).catch(function () {});
    clearInterval(timer); setKey(); show(3);
  }

  // step 3: key and snippets. A real key is shown only when the page is given one (window.AJAN_KEY) after the account is activated.
  var ENDPOINT = 'https://ajan-sns.houseforlearning.com/v1/ask';
  var KEY = window.AJAN_KEY || 'ajan_sk_PREVIEW_0000_SAMPLE';
  var real = !!window.AJAN_KEY, shown = false;
  function setKey() { $('kval').textContent = shown ? KEY : '…' + KEY.slice(-4); $('keynote').textContent = real ? '' : 'This is a sample key for the preview. Your own key appears here once your Ajan SNS account is activated.'; }
  $('eye').addEventListener('click', function () { shown = !shown; setKey(); });
  $('copykey').addEventListener('click', function () { copy(KEY, 'Key copied'); });
  function copy(t, m) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast(m); }, function () { toast('Press Ctrl+C to copy'); }); }
  var SN = {
    py: 'import requests\n\nr = requests.post(\n    "' + ENDPOINT + '",\n    headers={"Authorization": "Bearer YOUR_KEY"},\n    json={"worker": "manav", "question": "Explain AI in a few words"},\n)\nprint(r.json()["answer"])',
    js: 'const r = await fetch("' + ENDPOINT + '", {\n  method: "POST",\n  headers: { "Authorization": "Bearer YOUR_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ worker: "manav", question: "Explain AI in a few words" }),\n});\nconsole.log((await r.json()).answer);',
    sh: 'curl -X POST "' + ENDPOINT + '" \\\n  -H "Authorization: Bearer YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"worker":"manav","question":"Explain AI in a few words"}\''
  };
  var lang = 'py';
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function paint() {
    var h = esc(SN[lang]).replace(/(&quot;|")([^"\n]*)\1/g, '<span class="s">"$2"</span>').replace(/\b(import|print|const|await|curl)\b/g, '<span class="k">$1</span>');
    $('snip').innerHTML = h;
  }
  Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
    t.addEventListener('click', function () { lang = t.dataset.l; Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (x) { x.setAttribute('aria-selected', x === t); }); paint(); });
  });
  $('copycode').addEventListener('click', function () { copy(SN[lang].replace('YOUR_KEY', KEY), 'Example copied'); });
  paint(); setKey();
  $('back3').addEventListener('click', function () { show(2); });
  function done() { try { localStorage.setItem(stateKey, '1'); } catch (e) {} show(4); }
  $('skip3').addEventListener('click', done); $('go3').addEventListener('click', done);

  var q = location.search;
  if (q.indexOf('step=') > -1) { var n = +q.split('step=')[1][0]; if (n > 1 && n < 5) show(n); else show(1); } else show(1);
})();
