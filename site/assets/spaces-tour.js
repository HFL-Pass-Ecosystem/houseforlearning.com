/* Quick guide for the working spaces: a short first-visit walk-through, one step at a time.
   Remembers which spaces you have seen in this browser only. */
(function () {
  'use strict';
  var root = document.getElementById('sp-app');
  if (!root) return;
  var SPACE = root.getAttribute('data-space') || 'paver';
  var KEY = 'hfl-spaces-tour';
  var STEPS = {
    paver: [['.sp-paths', 'Pick a pathway here.'], ['.sp-ladder', 'Join a level, then mark it finished.'],
      ['#sp-progress', 'Your credits grow here.'], ['#sp-roles', 'See which jobs open up.']],
    collate: [['#sp-new-topic', 'Type a topic and make a shelf.'], ['#sp-item-title', 'Add notes, links and examples.'],
      ['#sp-board, .sp-story', 'Move items up or down.'], ['[data-act="to-leap"]', 'Turn the shelf into a lesson.']],
    leap: [['#c-title', 'Give your lesson a name.'], ['#sp-meter', 'Fill the lines until all seven are ready.'],
      ['[data-act="send-lab"]', 'Send it to LAB to be checked.']],
    lab: [['#sp-reviewer', 'Type your name as the checker.'], ['.sp-checklist, .sp-shelves', 'Tick the seven lines.'],
      ['#sp-chain', 'The log shows nothing was changed.']]
  }[SPACE] || [];
  var panel = null, idx = 0, list = [], lit = null;

  function seen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function markSeen() { try { var s = seen(); s[SPACE] = 1; localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }
  function unlight() { if (lit) { lit.style.outline = ''; lit.style.outlineOffset = ''; lit = null; } }

  function place() {
    if (!panel) return;
    var small = window.innerWidth < 600, bottom = 16;
    var ck = document.querySelector('.cookie');
    if (ck && !ck.hidden && getComputedStyle(ck).display !== 'none') {
      var r = ck.getBoundingClientRect();
      if (r.height) bottom = Math.max(16, window.innerHeight - r.top + 12);
    }
    var s = panel.style;
    s.bottom = bottom + 'px';
    if (small) { s.left = '8px'; s.right = '8px'; s.width = 'auto'; s.maxWidth = 'none'; }
    else { s.left = 'auto'; s.right = '16px'; s.width = '320px'; s.maxWidth = 'calc(100vw - 32px)'; }
  }

  function close() {
    unlight();
    var had = panel && panel.contains(document.activeElement);
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    markSeen();
    var a = document.querySelector('.sp-tour-again');
    if (had && a) a.focus();
  }

  function show() {
    unlight();
    var t = document.querySelector(list[idx][0]);
    if (t) { lit = t; t.style.outline = '3px solid #3CC261'; t.style.outlineOffset = '3px'; try { t.scrollIntoView({ block: 'center' }); } catch (e) { t.scrollIntoView(); } }
    var last = idx === list.length - 1;
    panel.querySelector('.sp-tour-count').textContent = 'Step ' + (idx + 1) + ' of ' + list.length;
    panel.querySelector('.sp-tour-text').textContent = list[idx][1];
    var nx = panel.querySelector('.sp-tour-next');
    nx.textContent = last ? 'Done' : 'Next';
    place();
    nx.focus();
  }

  function open() {
    list = STEPS.filter(function (s) { return document.querySelector(s[0]); });
    if (!list.length) return;
    if (!panel) {
      panel = el('div', 'sp-tour');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Quick guide');
      panel.style.cssText = 'position:fixed;z-index:70;box-sizing:border-box;padding:14px 16px;background:#F2EEE2;color:#1b1b1b;' +
        'border:2px solid #0F85DB;border-radius:12px;box-shadow:0 14px 40px -16px rgba(0,0,0,.45);font-size:15.5px;line-height:1.45';
      var count = el('p', 'sp-tour-count');
      count.style.cssText = 'margin:0 0 4px;font-size:13px;font-weight:700;color:#0F85DB';
      var text = el('p', 'sp-tour-text');
      text.style.cssText = 'margin:0 0 12px';
      var row = el('div', 'sp-tour-row');
      row.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end';
      var skip = el('button', 'btn btn-ghost btn-sm sp-tour-skip', 'Skip guide');
      var next = el('button', 'btn btn-sm sp-tour-next', 'Next');
      skip.type = next.type = 'button';
      skip.addEventListener('click', function () { close(); });
      next.addEventListener('click', function () {
        if (idx >= list.length - 1) { close(); return; }
        idx++;
        while (idx < list.length - 1 && !document.querySelector(list[idx][0])) idx++;
        show();
      });
      row.appendChild(skip); row.appendChild(next);
      panel.appendChild(count); panel.appendChild(text); panel.appendChild(row);
      document.body.appendChild(panel);
    }
    idx = 0;
    show();
  }

  function addAgain() {
    var foot = root.querySelector('.sp-foot');
    if (!foot || foot.querySelector('.sp-tour-again')) return;
    var b = el('button', 'btn btn-ghost btn-sm sp-tour-again', 'Show the guide again');
    b.type = 'button';
    b.addEventListener('click', function () { open(); });
    foot.appendChild(b);
  }

  document.addEventListener('keydown', function (e) {
    if (panel && (e.key === 'Escape' || e.key === 'Esc')) { e.preventDefault(); close(); }
  });
  window.addEventListener('resize', place);
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cookie]')) setTimeout(place, 0);
  });

  function start() {
    addAgain();
    new MutationObserver(addAgain).observe(root, { childList: true, subtree: true });
    if (!seen()[SPACE]) open();
  }
  if (root.getAttribute('data-ready')) start();
  else setTimeout(start, 0);
})();
