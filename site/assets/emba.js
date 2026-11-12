/* Executive MBA subject pages (test only).
   - Every part (details.mod) gets Listen (reads the part aloud with the browser's own voice) and Speak (voice to text into the answer box).
   - Answers are kept on this device only (localStorage "emba-notes"); nothing is sent to a server.
   - #vark-check on emba-02.html renders an eight-question learning-style check (Visual, Aural, Read and write, Kinesthetic).
   No outside scripts. Works without voice: the buttons hide and typing still works. */
(function () {
  var KEY = 'emba-notes', notes = {};
  try { notes = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {} }
  var synth = window.speechSynthesis || null;
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var lang = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2);
  function btn(txt) { var b = document.createElement('button'); b.type = 'button'; b.textContent = txt; b.setAttribute('aria-pressed', 'false'); return b; }
  function text(n) { return (n.innerText || n.textContent || '').replace(/\s+/g, ' ').trim(); }

  Array.prototype.forEach.call(document.querySelectorAll('.emba-say'), function (box) {
    var key = box.getAttribute('data-key'), ta = box.querySelector('textarea'), part = box.closest('.emba-part');
    if (notes[key]) ta.value = notes[key];
    ta.addEventListener('input', function () { notes[key] = ta.value; save(); });
    var bar = document.createElement('div'); bar.className = 'emba-tools';
    var msg = document.createElement('span'); msg.className = 'emba-msg'; msg.setAttribute('aria-live', 'polite');
    if (synth && part) {
      var lb = btn('Listen');
      lb.addEventListener('click', function () {
        if (lb.getAttribute('aria-pressed') === 'true') { synth.cancel(); lb.setAttribute('aria-pressed', 'false'); lb.textContent = 'Listen'; return; }
        synth.cancel();
        var clone = part.cloneNode(true); Array.prototype.forEach.call(clone.querySelectorAll('.emba-say,.emba-vk'), function (x) { x.remove(); });
        var u = new SpeechSynthesisUtterance(text(clone)); u.lang = lang;
        u.onend = function () { lb.setAttribute('aria-pressed', 'false'); lb.textContent = 'Listen'; };
        lb.setAttribute('aria-pressed', 'true'); lb.textContent = 'Stop'; synth.speak(u);
      });
      bar.appendChild(lb);
    }
    if (Rec) {
      var sb = btn('Speak your answer'), rec = null;
      sb.addEventListener('click', function () {
        if (rec) { rec.stop(); return; }
        rec = new Rec(); rec.lang = document.documentElement.getAttribute('lang') || 'en'; rec.interimResults = false; rec.continuous = false;
        rec.onresult = function (ev) { var said = ev.results[0][0].transcript; ta.value = (ta.value ? ta.value + ' ' : '') + said; notes[key] = ta.value; save(); msg.textContent = 'Added what you said. You can edit it.'; };
        rec.onerror = function () { msg.textContent = 'Voice did not work here. Please type instead.'; };
        rec.onend = function () { rec = null; sb.setAttribute('aria-pressed', 'false'); sb.textContent = 'Speak your answer'; };
        sb.setAttribute('aria-pressed', 'true'); sb.textContent = 'Stop listening'; msg.textContent = 'Listening. Speak now.'; rec.start();
      });
      bar.appendChild(sb);
    } else {
      msg.textContent = 'Voice typing is not available in this browser, so please type. Your phone keyboard microphone also works.';
    }
    bar.appendChild(msg);
    box.insertBefore(bar, ta);
  });

  var vk = document.getElementById('vark-check');
  if (vk) {
    var Q = [
      ['You need directions to a new place. You would rather:', ['look at a map', 'be told the way', 'read written directions', 'just start and find it']],
      ['You are learning a new phone app. You would rather:', ['watch the screens and icons', 'have someone talk you through it', 'read the help page', 'tap around and try']],
      ['To remember a new idea you usually:', ['picture it', 'say it aloud', 'write it down', 'use it straight away']],
      ['In a class you enjoy most:', ['charts and diagrams', 'talk and discussion', 'handouts and notes', 'exercises and real cases']],
      ['Choosing something to buy, you trust most:', ['photos and videos', 'what friends tell you', 'written reviews', 'trying it in the shop']],
      ['To explain a process to someone you would:', ['draw it', 'talk them through it', 'write the steps', 'show them by doing it']],
      ['When cooking something new you:', ['look at the pictures', 'ask someone or listen to a video', 'follow the written recipe', 'make it and adjust']],
      ['When studying for a test you prefer:', ['colour and mind maps', 'talking it over', 'lists and summaries', 'practice questions']]];
    var L = ['Visual', 'Aural', 'Read and write', 'Kinesthetic'];
    var TIP = ['draw a picture of each part before you read it', 'press Listen on each part and explain it aloud', 'write the three-line summary for each part', 'do the activity first, then read the part'];
    var f = document.createElement('form');
    Q.forEach(function (q, i) {
      var fs = document.createElement('fieldset'), lg = document.createElement('legend'); lg.textContent = (i + 1) + '. ' + q[0]; fs.appendChild(lg);
      q[1].forEach(function (o, j) { var l = document.createElement('label'), r = document.createElement('input'); r.type = 'radio'; r.name = 'vk' + i; r.value = j; l.appendChild(r); l.appendChild(document.createTextNode(' ' + o)); fs.appendChild(l); });
      f.appendChild(fs);
    });
    var go = document.createElement('button'); go.type = 'submit'; go.className = 'btn'; go.textContent = 'Show my learning style'; f.appendChild(go);
    var out = document.createElement('div'); out.className = 'emba-res'; out.hidden = true;
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var c = [0, 0, 0, 0], n = 0;
      for (var i = 0; i < Q.length; i++) { var s = f.querySelector('input[name="vk' + i + '"]:checked'); if (s) { c[+s.value]++; n++; } }
      if (!n) { out.hidden = false; out.textContent = 'Please answer at least one question.'; return; }
      var order = [0, 1, 2, 3].sort(function (a, b) { return c[b] - c[a]; });
      out.hidden = false;
      out.innerHTML = '';
      var p = document.createElement('p'); p.textContent = 'Your mix: ' + order.map(function (k) { return L[k] + ' ' + Math.round(100 * c[k] / n) + '%'; }).join(', ') + '.'; out.appendChild(p);
      var t = document.createElement('p'); t.textContent = 'Strongest: ' + L[order[0]] + '. Tip: ' + TIP[order[0]] + '. Keep using the other routes too.'; out.appendChild(t);
      notes['emba-vark'] = { mix: c, n: n, at: Date.now() }; save();
    });
    vk.appendChild(f); vk.appendChild(out);
  }
})();
