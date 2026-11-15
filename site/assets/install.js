/* install kit: registers the small service worker, remembers the browser's install offer, and runs the Get the app page. */
(function () {
  "use strict";
  var me = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var base = new URL("../", me.src);            /* folder the app lives in */
  var deferred = null;

  function standalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(new URL("sw.js", base).href, { scope: base.pathname }).catch(function () {});
    });
  }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e; show();
  });
  window.addEventListener("appinstalled", function () { deferred = null; mark(true); show(); });

  function root() { return document.querySelector(".pwa-install"); }
  function mark(v) { var r = root(); if (r) r.classList.toggle("is-installed", !!v); }
  function show() {
    var b = document.querySelector("[data-install-now]");
    if (b) b.hidden = !deferred || standalone();
  }

  function detect() {
    var ua = navigator.userAgent || "", touch = (navigator.maxTouchPoints || 0) > 1;
    var ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && touch);
    if (/iPhone|iPod/.test(ua) || ipad) return "apple";
    if (/Android/.test(ua)) return "android";
    if (/Windows/.test(ua)) return "windows";
    if (/Macintosh/.test(ua)) return "mac";
    return "";
  }
  var NAMES = { apple: "an iPhone or iPad", android: "an Android phone or tablet", windows: "a Windows computer", mac: "a Mac computer" };

  function page() {
    var r = root(); if (!r) return;
    var d = detect();
    if (d) {
      var c = r.querySelector('[data-device="' + d + '"]');
      if (c) { c.classList.add("is-mine"); c.open = true; c.parentNode.insertBefore(c, c.parentNode.firstChild); }
      var t = r.querySelector("[data-detected]");
      if (t) t.textContent = "You are on " + NAMES[d] + ". Your steps are first below.";
    } else {
      var all = r.querySelectorAll("details.pi-card"); for (var i = 0; i < all.length; i++) all[i].open = true;
    }
    if (standalone()) mark(true);
    var b = r.querySelector("[data-install-now]");
    if (b) b.addEventListener("click", function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function (ch) { if (ch && ch.outcome === "accepted") mark(true); deferred = null; show(); });
    });
    var cp = r.querySelector("[data-copy-link]");
    if (cp) cp.addEventListener("click", function () {
      var url = location.href.split("#")[0];
      if (navigator.share) { navigator.share({ title: document.title, url: url }).catch(function () {}); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { cp.textContent = "Link copied"; });
    });
    show();
  }
  function reloadBtn() {
    var b = document.querySelector("[data-reload]");
    if (b) b.addEventListener("click", function () { location.reload(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { page(); reloadBtn(); });
  else { page(); reloadBtn(); }
})();
