/* install kit service worker. Keeps the site always fresh: pages come from the network, and only when the
   connection is gone does it show the saved home page, this page or a plain offline notice.
   It never saves sign-in, member, shop or API pages, and never touches forms. */
var V = "install-v1";
var HOME = new URL("./", self.registration.scope).href;
var CORE = ["offline.html", "assets/install.css", "assets/install.js", "icons/app-192.png", "get-app.html"].map(function (p) { return new URL(p, HOME).href; });
CORE.push(HOME);
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x.indexOf("install-") === 0 && x !== V; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || r.mode !== "navigate") return;
  e.respondWith(fetch(r).then(function (res) {
    if (res && res.ok && (r.url === HOME || r.url === HOME + "index.html" || r.url === new URL("get-app.html", HOME).href)) {
      var cp = res.clone(); caches.open(V).then(function (c) { c.put(r.url === HOME + "index.html" ? HOME : r, cp); });
    }
    return res;
  }).catch(function () {
    return caches.match(r.url).then(function (m) { return m || caches.match(new URL("offline.html", HOME).href); });
  }));
});
