(function () {
  var $ = function (id) { return document.getElementById(id); };
  function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (x) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (x) {} }
  // dates in the learner's own time zone
  document.querySelectorAll('[data-utc]').forEach(function (n) {
    var d = new Date(n.getAttribute('data-utc')); if (isNaN(d)) return;
    n.textContent = d.toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  });
  // one join button
  var j = $('lhjoin');
  if (j) {
    var s = new Date(j.dataset.start), en = new Date(j.dataset.end), now = new Date();
    if (now >= s && now <= en) { j.textContent = 'Join live session'; }
    else if (now > en) { j.textContent = 'Watch recording'; }
    else { j.textContent = 'Opens soon'; j.disabled = true; }
  }
  // batch picker
  var radios = document.querySelectorAll('input[name=batch]');
  if (radios.length) {
    var saved = get('hfl_batch', 'morning');
    radios.forEach(function (r) {
      r.checked = r.value === saved;
      r.addEventListener('change', function () {
        put('hfl_batch', r.value);
        $('lhbatch').textContent = r.value === 'evening' ? 'Saved: evening batch, one week later.' : 'Saved: morning batch.';
      });
    });
  }
  // roadmap bar (sample)
  var pt = $('lhp-t'), pb = $('lhp-b');
  if (pt && pb) { var n = get('hfl_done', 0); pt.textContent = n + ' of 21 lessons'; pb.style.width = Math.round(n * 100 / 21) + '%'; }
  // offers
  var cl = $('lhclaimed');
  function drawClaimed() {
    var c = get('hfl_claimed', []); if (!cl) return;
    cl.textContent = '';
    if (!c.length) { cl.textContent = 'Nothing claimed yet.'; return; }
    c.forEach(function (name) {
      var p = document.createElement('p'); p.textContent = name + ' (claimed) ';
      var code = document.createElement('span'); code.textContent = 'code hidden'; var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn-ghost'; b.textContent = 'Show';
      b.addEventListener('click', function () { code.textContent = code.textContent === 'code hidden' ? 'SAMPLE-0000' : 'code hidden'; b.textContent = b.textContent === 'Show' ? 'Hide' : 'Show'; });
      p.appendChild(code); p.appendChild(b); cl.appendChild(p);
    });
  }
  document.querySelectorAll('[data-claim]').forEach(function (b) {
    var name = b.parentNode.querySelector('h3').textContent;
    if (get('hfl_claimed', []).indexOf(name) > -1) { b.textContent = 'Claimed'; b.disabled = true; }
    b.addEventListener('click', function () { var c = get('hfl_claimed', []); if (c.indexOf(name) < 0) c.push(name); put('hfl_claimed', c); b.textContent = 'Claimed'; b.disabled = true; drawClaimed(); });
  });
  drawClaimed();
  // feed
  document.querySelectorAll('[data-like]').forEach(function (b) { b.addEventListener('click', function () { b.textContent = 'Liked'; }); });
  document.querySelectorAll('[data-save]').forEach(function (b) { b.addEventListener('click', function () { b.textContent = 'Saved'; }); });
  // gratitude wall
  var tb = $('lhthanksb');
  if (tb) {
    var wall = $('lhwall'); get('hfl_wall', []).forEach(function (t) { var li = document.createElement('li'); li.textContent = t; wall.appendChild(li); });
    tb.addEventListener('click', function () { var v = $('lhthanks').value.trim(); if (!v) return; var li = document.createElement('li'); li.textContent = v; wall.appendChild(li); var w = get('hfl_wall', []); w.push(v); put('hfl_wall', w); $('lhthanks').value = ''; });
  }
  // help: holding reply
  var sb = $('lhsend');
  if (sb) sb.addEventListener('click', function () {
    var v = $('lhmsg').value.trim(); var q = get('hfl_questions', []); q.push({ t: Date.now(), m: v }); put('hfl_questions', q);
    $('lhreply').textContent = 'Thank you. We are looking into this and will share the best answer shortly. A person replies within 4 working hours. (Test only: nothing was sent.)';
  });
  var bb = $('lhbugb');
  if (bb) bb.addEventListener('click', function () { var v = $('lhbug').value.trim(); if (!v) return; var q = get('hfl_bugs', []); q.push(v); put('hfl_bugs', q); $('lhbugr').textContent = 'Thank you. Your report is saved (test only).'; $('lhbug').value = ''; });
})();
