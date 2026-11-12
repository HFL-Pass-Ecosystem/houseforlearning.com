/* COLLATE: "Load a shelf file" control. Reads a shelf JSON saved with "Download the shelf (file)",
   checks it strictly, adds it as a new shelf in the shared store and reloads so spaces.js shows it. */
(function () {
  'use strict';
  var root = document.getElementById('sp-app');
  if (!root || root.getAttribute('data-space') !== 'collate') return;
  var KEY = 'hfl-spaces-v1';
  var PATHS = ['P', 'A', 'V', 'E', 'R'];
  var KINDS = ['Note', 'Link', 'Example', 'Video', 'Practice', 'Question'];
  var BAD = 'That file is not a shelf file.';

  function str(v, max) { return typeof v === 'string' ? v.slice(0, max) : ''; }
  function clean(d) {
    if (!d || typeof d !== 'object' || Object.prototype.toString.call(d.items) !== '[object Array]') return null;
    var topic = typeof d.topic === 'string' ? d.topic.trim() : '';
    if (!topic || topic.length > 120 || d.items.length > 200) return null;
    var base = Date.now().toString(36), items = [];
    for (var i = 0; i < d.items.length; i++) {
      var x = d.items[i];
      if (!x || typeof x !== 'object') continue;
      items.push({ id: 'it-' + base + '-' + i, kind: KINDS.indexOf(x.kind) >= 0 ? x.kind : 'Note',
        title: str(x.title, 200), text: str(x.text, 2000) });
    }
    return { id: 'sh-' + base, topic: topic, path: PATHS.indexOf(d.path) >= 0 ? d.path : 'P', items: items };
  }
  function say(fb, msg) { fb.textContent = msg; }
  function onFile(input, fb) {
    var f = input.files && input.files[0];
    input.value = '';
    if (!f) return;
    if (f.size > 1048576) { say(fb, 'That file is too big (over 1 MB).'); return; }
    var r = new FileReader();
    r.onload = function () {
      var d = null;
      try { d = clean(JSON.parse(String(r.result))); } catch (e) { d = null; }
      if (!d) { say(fb, BAD); return; }
      var S = null;
      try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
      if (!S || S.v !== 2 || Object.prototype.toString.call(S.shelves) !== '[object Array]') { say(fb, 'Open the space once, then try again.'); return; }
      S.shelves.unshift(d); S.cur = d.id;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { say(fb, 'This browser could not save the shelf.'); return; }
      say(fb, 'Shelf loaded.');
      location.reload();
    };
    r.onerror = function () { say(fb, BAD); };
    r.readAsText(f);
  }
  function build() {
    var wrap = document.createElement('div');
    wrap.className = 'sp-row sp-import-wrap';
    var lab = document.createElement('label');
    lab.className = 'btn btn-ghost sp-import';
    var input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,application/json'; input.id = 'sp-import-file';
    var st = input.style;
    st.position = 'absolute'; st.width = '1px'; st.height = '1px'; st.overflow = 'hidden';
    st.clip = 'rect(0 0 0 0)'; st.whiteSpace = 'nowrap'; st.border = '0'; st.padding = '0'; st.margin = '-1px';
    lab.appendChild(input);
    lab.appendChild(document.createTextNode('Load a shelf file'));
    var fb = document.createElement('p');
    fb.className = 'sp-fb'; fb.setAttribute('role', 'status');
    input.addEventListener('change', function () { onFile(input, fb); });
    wrap.appendChild(lab); wrap.appendChild(fb);
    return wrap;
  }
  function ensure() {
    var all = root.querySelectorAll('.sp-import');
    var cards = root.querySelectorAll('.sp-card'), card = null;
    for (var i = 0; i < cards.length; i++) {
      var h3 = cards[i].querySelector('h3');
      if (h3 && h3.textContent.indexOf('Step 1.') === 0) { card = cards[i]; break; }
    }
    if (!card) return;
    if (all.length === 1 && all[0].parentNode && all[0].parentNode.previousSibling === card) return;
    for (var j = 0; j < all.length; j++) { var w = all[j].parentNode; if (w && w.parentNode) w.parentNode.removeChild(w); }
    card.parentNode.insertBefore(build(), card.nextSibling);
  }
  ensure();
  new MutationObserver(ensure).observe(root, { childList: true, subtree: true });
})();
