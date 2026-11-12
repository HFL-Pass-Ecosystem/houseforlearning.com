/* Speak instead of type, for the PAVER, COLLATE, LEAP and LAB working spaces.
   Adds a "Speak" button after every text box in #sp-app. Uses the browser's own speech
   recognition (Edge, Chrome). If the browser has none, no buttons are added.
   No inline scripts (CSP). Recognised text is set as a value, never as HTML. */
(function () {
  'use strict';
  var root = document.getElementById('sp-app');
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!root || !Rec) return;

  var LANG = document.documentElement.lang || 'en-GB';
  var MSG = { 'not-allowed': 'Microphone blocked. Allow it in the browser to speak.',
              'service-not-allowed': 'Microphone blocked. Allow it in the browser to speak.',
              'no-speech': 'No speech heard. Tap Speak and try again.' };
  var active = null; // the one recognition running now: { rec, btn }

  // The visible label text for a field.
  function labelOf(f) {
    var lab = f.closest('label') || (f.id && document.querySelector('label[for="' + f.id + '"]'));
    var span = lab && lab.querySelector('span');
    var t = (span ? span.textContent : lab ? lab.textContent : '') || f.getAttribute('aria-label') || f.placeholder || 'this box';
    return t.trim();
  }

  function idle(btn) {
    btn.textContent = 'Speak';
    btn.setAttribute('aria-pressed', 'false');
  }

  function stop() {
    if (!active) return;
    try { active.rec.stop(); } catch (e) { /* already stopped */ }
  }

  function listen(btn, f) {
    var wasMine = active && active.btn === btn;
    stop();
    if (wasMine) return; // second tap on the same button just stops
    var rec = new Rec();
    rec.lang = LANG;
    rec.interimResults = false;
    rec.continuous = false;
    active = { rec: rec, btn: btn };
    rec.onresult = function (ev) {
      var text = '';
      for (var i = ev.resultIndex || 0; i < ev.results.length; i++) text += ev.results[i][0].transcript;
      text = text.trim();
      if (!text) return;
      // spaces.js may have re-rendered; find the live field by id if the old one is gone.
      var target = document.body.contains(f) ? f : (f.id && document.getElementById(f.id)) || f;
      target.value = target.value ? target.value.replace(/\s+$/, '') + ' ' + text : text;
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
    };
    rec.onerror = function (ev) {
      btn.title = MSG[ev.error] || 'Speech did not work (' + ev.error + '). Try again.';
      idle(btn);
    };
    rec.onend = function () {
      idle(btn);
      if (active && active.rec === rec) active = null;
    };
    btn.title = '';
    btn.textContent = 'Listening… tap to stop';
    btn.setAttribute('aria-pressed', 'true');
    try { rec.start(); } catch (e) { btn.title = 'Speech could not start. Try again.'; idle(btn); active = null; }
  }

  // Add one button after each text box that does not have one yet.
  function scan() {
    var fields = root.querySelectorAll('textarea, input[type="text"]');
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f.getAttribute('data-mic') === '1') continue;
      f.setAttribute('data-mic', '1');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost btn-sm sp-mic';
      b.setAttribute('aria-label', 'Speak into ' + labelOf(f));
      idle(b);
      b.addEventListener('click', (function (btn, field) {
        return function (ev) { ev.preventDefault(); listen(btn, field); };
      })(b, f));
      f.parentNode.insertBefore(b, f.nextSibling);
    }
  }

  scan();
  new MutationObserver(scan).observe(root, { childList: true, subtree: true });
})();
