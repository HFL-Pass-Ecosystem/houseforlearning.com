/* House for Learning time hub: small clock and countdown widgets that any web page can embed.
   Use:  <div data-hfl-widget="clock" data-tz="Asia/Dubai" data-title="Dubai"></div>
         <div data-hfl-widget="countdown" data-target="2026-12-02T00:00:00+04:00" data-title="National Day"></div>
         <script async src="https://houseforlearning.com/assets/th-widget.js"></script>
   No adverts, no tracking, no network calls: the time is worked out in the visitor's own browser. */
(function () {
  'use strict';
  var CSS = ':host{display:inline-block;max-width:100%}.w{box-sizing:border-box;min-width:190px;padding:14px 18px;border:1.5px solid #2b5d8a;border-radius:14px;background:#fffdf7;color:#1d3550;font-family:Literata,Georgia,serif;text-align:center}' +
    '.t{margin:0 0 6px;font-size:14px;color:#4f6276}.b{margin:0;font:600 30px/1.1 "IBM Plex Mono",ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums;color:#1d3550}' +
    '.s{margin:6px 0 0;font-size:13px;color:#4f6276}.g{display:flex;gap:8px;justify-content:center}.g div{min-width:46px}.g b{display:block;font:600 26px/1.1 "IBM Plex Mono",ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums}.g span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4f6276}' +
    '.d{margin:6px 0 0;font-size:11px}.d a{color:#a64e10}.w.dark{background:#1d3550;color:#fffdf7;border-color:#d0732f}.dark .t,.dark .s,.dark .g span{color:#d8d1bd}.dark .b{color:#fffdf7}';
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(tz, o) { try { return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: tz }, o)).format(new Date()); } catch (e) { return ''; } }
  function mount(host) {
    var type = host.getAttribute('data-hfl-widget'), tz = host.getAttribute('data-tz') || 'UTC', title = host.getAttribute('data-title') || '', target = new Date(host.getAttribute('data-target') || ''), dark = host.getAttribute('data-theme') === 'dark';
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host, st = document.createElement('style'), w = document.createElement('div');
    st.textContent = CSS; w.className = 'w' + (dark ? ' dark' : '');
    root.appendChild(st); root.appendChild(w);
    function draw() {
      var h = '<p class="t">' + title.replace(/[<>&]/g, '') + '</p>';
      if (type === 'countdown') {
        var ms = target - Date.now();
        if (isNaN(ms)) h += '<p class="b">Set a date</p>';
        else if (ms <= 0) h += '<p class="b">Now</p>';
        else { var s = Math.floor(ms / 1000); h += '<div class="g"><div><b>' + Math.floor(s / 86400) + '</b><span>days</span></div><div><b>' + pad(Math.floor(s % 86400 / 3600)) + '</b><span>hours</span></div><div><b>' + pad(Math.floor(s % 3600 / 60)) + '</b><span>min</span></div><div><b>' + pad(s % 60) + '</b><span>sec</span></div></div>'; }
      } else {
        h += '<p class="b">' + fmt(tz, { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }) + '</p><p class="s">' + fmt(tz, { weekday: 'short', day: 'numeric', month: 'short' }) + '</p>';
      }
      h += '<p class="d"><a href="https://houseforlearning.com/time-tool.html" target="_blank" rel="noopener">House for Learning time hub</a></p>';
      w.innerHTML = h;
    }
    draw(); setInterval(draw, 1000);
  }
  window.THWidget = { mount: mount };
  function auto() { Array.prototype.forEach.call(document.querySelectorAll('[data-hfl-widget]'), function (h) { if (!h.getAttribute('data-ready')) { h.setAttribute('data-ready', '1'); mount(h); } }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
