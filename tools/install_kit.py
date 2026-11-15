#!/usr/bin/env python3
"""Install kit: makes a static site installable as an app on phone, tablet and computer.

Adds, inside one site folder (idempotent, safe to run again):
  manifest.webmanifest, sw.js, offline.html, get-app.html,
  assets/install.js, assets/install.css, icons/app-*.png
and puts two invisible lines (manifest link + install.js) into the home page only.
No page text changes anywhere else. Nothing here is paid or needs a store account.

Use (from the repository root):
  python3 -I tools/install_kit.py --root site --scope "" --name "Avyra Microsystems" --short Avyra \
     --desc "..." --theme "#4b5563" --icon assets/img/ams-logo-240.png --icon-mode logo \
     --template contact.html --origin https://www.avyramicrosystems.com
--scope is the sub-folder the app lives in ("" for the site root, "yantra" for /yantra/).
"""
import argparse, html, json, os, re, sys

MARK_A, MARK_B = "<!-- install-kit:start -->", "<!-- install-kit:end -->"


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def make_icons(src, bg, outdir, mode):
    from PIL import Image
    im = Image.open(src).convert("RGBA")
    bgc = tuple(int(bg.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)) + (255,)

    def canvas(size, fill):
        art = im.copy()
        art.thumbnail((int(size * fill), int(size * fill)), Image.LANCZOS)
        c = Image.new("RGBA", (size, size), bgc)
        c.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2))
        return c.convert("RGB")

    if mode == "full":  # square artwork that already fills its canvas
        full = Image.new("RGBA", im.size, bgc)
        full.alpha_composite(im)
        full = full.convert("RGB")
        fill_any, fill_mask = 1.0, 0.78
    else:  # transparent logo, give it breathing room on the brand colour
        full = None
        fill_any, fill_mask = 0.80, 0.62
    os.makedirs(outdir, exist_ok=True)
    for size in (192, 512):
        if full is not None:
            full.resize((size, size), Image.LANCZOS).save(os.path.join(outdir, "app-%d.png" % size), optimize=True)
        else:
            canvas(size, fill_any).save(os.path.join(outdir, "app-%d.png" % size), optimize=True)
    # maskable: artwork inside the central safe zone, solid colour to the edges
    base = full if full is not None else None
    if base is not None:
        art = base.resize((int(512 * fill_mask),) * 2, Image.LANCZOS)
        m = Image.new("RGB", (512, 512), bgc[:3])
        m.paste(art, ((512 - art.width) // 2, (512 - art.height) // 2))
        m.save(os.path.join(outdir, "app-maskable-512.png"), optimize=True)
    else:
        canvas(512, fill_mask).save(os.path.join(outdir, "app-maskable-512.png"), optimize=True)
    canvas(180, fill_any if full is None else 0.86).save(os.path.join(outdir, "app-180.png"), optimize=True)


CSS = """/* install kit: the Get the app page and the offline page. Self-contained colours so it reads well on any site theme. */
.pwa-install{--pi-ink:#1b2330;--pi-mut:#4a5565;--pi-line:#cfd6df;--pi-acc:%(theme)s;max-width:960px;margin:0 auto;padding:24px 16px 40px;color:var(--pi-ink)}
.pwa-install *{box-sizing:border-box}
.pwa-install h1{margin:0 0 8px;font-size:clamp(26px,5vw,38px);line-height:1.15}
.pwa-install .pi-lead{font-size:18px;line-height:1.5;margin:0 0 16px;max-width:60ch}
.pwa-install .pi-hero{display:flex;gap:16px;align-items:center;flex-wrap:wrap;background:#fff;border:1px solid var(--pi-line);border-left:6px solid var(--pi-acc);border-radius:8px;padding:16px 18px;margin:16px 0 8px;color:var(--pi-ink)}
.pwa-install .pi-hero img{width:64px;height:64px;border-radius:14px;flex:none}
.pwa-install .pi-hero .pi-txt{flex:1 1 220px;min-width:0}
.pwa-install .pi-hero strong{display:block;font-size:18px}
.pwa-install .pi-hero span{color:var(--pi-mut)}
.pwa-install .pi-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:11px 22px;border:0;border-radius:6px;background:var(--pi-acc);color:#fff;font-family:inherit;font-weight:700;font-size:16px;line-height:1.2;cursor:pointer;text-decoration:none}
.pwa-install .pi-btn[hidden]{display:none}
.pwa-install .pi-btn:focus-visible,.pwa-install summary:focus-visible{outline:3px solid #0b6a82;outline-offset:2px}
.pwa-install .pi-btn.alt{background:#fff;color:var(--pi-ink);border:1.5px solid var(--pi-ink)}
.pwa-install .pi-note{color:var(--pi-mut);margin:6px 0 0}
.pwa-install .pi-ok{display:none;background:#e7f6ec;border:1px solid #2f8f4e;color:#14532d;border-radius:8px;padding:12px 16px;margin:12px 0;font-weight:600}
.pwa-install.is-installed .pi-ok{display:block}
.pwa-install .pi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%%,290px),1fr));gap:14px;margin:18px 0}
.pwa-install .pi-card{background:#fff;border:1px solid var(--pi-line);border-radius:8px;padding:0;overflow:hidden;color:var(--pi-ink)}
.pwa-install .pi-card.is-mine{border:2px solid var(--pi-acc);box-shadow:0 2px 10px rgba(0,0,0,.08)}
.pwa-install .pi-card summary{list-style:none;cursor:pointer;padding:14px 16px;font-weight:700;font-size:17px;display:flex;justify-content:space-between;gap:8px;align-items:center}
.pwa-install .pi-card summary::-webkit-details-marker{display:none}
.pwa-install .pi-card summary::after{content:"+";font-size:22px;line-height:1;color:var(--pi-acc)}
.pwa-install .pi-card[open] summary::after{content:"\\2212"}
.pwa-install .pi-card .pi-tag{display:none;font-size:12px;font-weight:700;background:var(--pi-acc);color:#fff;border-radius:99px;padding:2px 10px;margin-left:8px}
.pwa-install .pi-card.is-mine .pi-tag{display:inline-block}
.pwa-install .pi-body{padding:0 16px 16px}
.pwa-install .pi-body ol{margin:0 0 8px;padding-left:22px}
.pwa-install .pi-body li{margin:0 0 8px;line-height:1.5}
.pwa-install .pi-body p{margin:8px 0;color:var(--pi-mut)}
.pwa-install .pi-small{font-size:14px;color:var(--pi-mut);margin-top:18px}
.pwa-install kbd{font-family:inherit;font-weight:600;font-size:14px;line-height:1;background:#eef1f5;border:1px solid var(--pi-line);border-radius:4px;padding:2px 6px}
.pwa-offline{max-width:560px;margin:12vh auto;padding:24px 16px;text-align:center;font:18px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1b2330}
.pwa-offline img{width:84px;height:84px;border-radius:18px}
.pwa-offline h1{font-size:28px;margin:16px 0 8px}
.pwa-offline .pi-btn{display:inline-flex;min-height:46px;align-items:center;padding:11px 24px;border:0;border-radius:6px;background:%(theme)s;color:#fff;font-family:inherit;font-weight:700;font-size:16px;line-height:1.2;cursor:pointer;margin-top:12px}
body.pwa-offline-page{margin:0;background:#f4f6f9}
"""

JS = r"""/* install kit: registers the small service worker, remembers the browser's install offer, and runs the Get the app page. */
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
"""

SW = """/* install kit service worker. Keeps the site always fresh: pages come from the network, and only when the
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
"""

STEPS = {
    "windows": ("Windows computer", """<ol>
<li>Open this site in <strong>Microsoft Edge</strong> or <strong>Google Chrome</strong>.</li>
<li>Look at the right end of the address bar. Click the small <strong>Install</strong> icon (a screen with a down arrow). Or press the <strong>Install now</strong> button above.</li>
<li>Click <strong>Install</strong> in the small box that opens.</li>
<li>The app opens in its own window and is added to your Start menu. Right-click its icon in the taskbar and choose <strong>Pin to taskbar</strong> to keep it handy.</li></ol>
<p>No Install icon? In Edge, click the three dots at the top right, then <strong>Apps</strong>, then <strong>Install this site as an app</strong>. In Chrome, click the three dots, then <strong>Cast, save and share</strong>, then <strong>Install page as app</strong>.</p>"""),
    "mac": ("Mac computer", """<ol>
<li>Open this site in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> and click the <strong>Install</strong> icon at the right end of the address bar (or press <strong>Install now</strong> above). Then click <strong>Install</strong>.</li>
<li>Using <strong>Safari</strong>? Click <strong>File</strong> in the top menu, then <strong>Add to Dock</strong>, then <strong>Add</strong>.</li>
<li>The app opens in its own window and sits in your Dock and in Launchpad.</li></ol>"""),
    "apple": ("iPhone and iPad", """<ol>
<li>Open this page in <strong>Safari</strong>. (This is the browser with the blue compass icon.)</li>
<li>Tap the <strong>Share</strong> button: a square with an arrow pointing up. On iPhone it is at the bottom, on iPad at the top.</li>
<li>Scroll the list and tap <strong>Add to Home Screen</strong>.</li>
<li>Tap <strong>Add</strong> at the top right. The app icon now sits on your Home Screen like any other app.</li></ol>
<p>On iPhone and iPad the app must be added from Safari. If you opened this page inside another app, tap the Share button and choose <strong>Open in Safari</strong> first.</p>"""),
    "android": ("Android phone and tablet (Samsung Galaxy too)", """<ol>
<li>Open this page in <strong>Chrome</strong> (on a Samsung you can also use <strong>Samsung Internet</strong>).</li>
<li>Tap the <strong>Install now</strong> button above. If it is not shown, tap the three dots at the top right of Chrome (in Samsung Internet, the three lines at the bottom right).</li>
<li>Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>), then tap <strong>Install</strong>.</li>
<li>The app icon appears on your Home screen and in your app list. It opens full screen with no browser bars.</li></ol>"""),
}
ORDER = ["windows", "mac", "apple", "android"]


def get_app_body(a):
    cards = ""
    for k in ORDER:
        title, steps = STEPS[k]
        cards += ('<details class="pi-card" data-device="%s"><summary><span>%s<span class="pi-tag">Your device</span></span></summary>'
                  '<div class="pi-body">%s</div></details>' % (k, title, steps))
    return (
        '<div class="pwa-install">'
        '<h1>Get the %(short)s app</h1>'
        '<p class="pi-lead">Put %(name)s on your phone, tablet or computer. It opens like any other app, with its own icon and window. '
        'It is free, needs no store account and no password, and always shows the latest version.</p>'
        '<div class="pi-hero"><img src="icons/app-192.png" width="64" height="64" alt="">'
        '<div class="pi-txt"><strong>%(name)s</strong><span data-detected>Choose your device below.</span></div>'
        '<button class="pi-btn" type="button" data-install-now hidden>Install now</button></div>'
        '<p class="pi-ok" role="status">The app is installed on this device. You can close this page and open the app from your Home screen, Start menu or Dock.</p>'
        '<div class="pi-grid">%(cards)s</div>'
        '<p><button class="pi-btn alt" type="button" data-copy-link>Send this page to another device</button></p>'
        '<p class="pi-small">Windows, Mac, iPhone, iPad, Samsung Galaxy and other Android devices are all covered above. '
        'Using Firefox on a computer? Open this page in Edge or Chrome to install. '
        'To remove the app later, press and hold its icon (or right-click it) and choose Remove or Uninstall.</p>'
        '</div>' % {"short": html.escape(a.short), "name": html.escape(a.name), "cards": cards})


def clone_page(root, template, new_title, desc, canonical, scope_dir, body):
    s = open(os.path.join(root, template), encoding="utf-8").read()
    s = re.sub(r"<title>.*?</title>", "<title>%s</title>" % html.escape(new_title), s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', '<meta name="description" content="%s">' % html.escape(desc, quote=True), s, count=1)
    for pat in (r'<link rel="canonical"[^>]*>', r'<meta property="og:[^>]*>', r'<meta name="twitter:[^>]*>',
                r'<script type="application/ld\+json">.*?</script>', r'<link rel="alternate" hreflang[^>]*>'):
        s = re.sub(pat, "", s, flags=re.S)
    if canonical:
        s = s.replace("</title>", '</title>\n<link rel="canonical" href="%s">' % canonical, 1)
    s = re.sub(r'<li aria-current="page">[^<]*</li>', "@@CRUMB@@", s)
    s = s.replace(' aria-current="page"', "").replace("@@CRUMB@@", '<li aria-current="page">Get the app</li>')
    s = re.sub(r"(<main[^>]*>).*?(</main>)", lambda m: m.group(1) + body + m.group(2), s, count=1, flags=re.S)
    s = re.sub(MARK_A + ".*?" + MARK_B, "", s, flags=re.S)
    s = s.replace("</head>", MARK_A + '<link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="assets/install.css"><script src="assets/install.js" defer></script>' + MARK_B + "</head>", 1)
    return s


def patch_home(path):
    s = open(path, encoding="utf-8").read()
    s = re.sub(MARK_A + ".*?" + MARK_B, "", s, flags=re.S)
    add = MARK_A + '<link rel="manifest" href="manifest.webmanifest"><script src="assets/install.js" defer></script>' + MARK_B
    if "</head>" not in s:
        raise SystemExit("no </head> in " + path)
    s = s.replace("</head>", add + "</head>", 1)
    open(path, "w", encoding="utf-8", newline="").write(s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True)
    ap.add_argument("--scope", default="")
    ap.add_argument("--name", required=True)
    ap.add_argument("--short", required=True)
    ap.add_argument("--desc", required=True)
    ap.add_argument("--theme", required=True)
    ap.add_argument("--bg", default="#ffffff")
    ap.add_argument("--accent", default="", help="colour for buttons and highlights on the Get the app page (default: the theme colour)")
    ap.add_argument("--icon", required=True, help="path relative to the scope folder, or absolute")
    ap.add_argument("--icon-mode", choices=["logo", "full"], default="logo")
    ap.add_argument("--template", default="404.html", help="a page of the site whose header and footer the Get the app page reuses")
    ap.add_argument("--home", default="index.html")
    ap.add_argument("--origin", default="")
    ap.add_argument("--lang", default="en")
    a = ap.parse_args()

    base = os.path.join(a.root, a.scope) if a.scope else a.root
    sc = "/" + a.scope.strip("/") + "/" if a.scope.strip("/") else "/"
    icon = a.icon if os.path.isabs(a.icon) else os.path.join(base, a.icon)
    make_icons(icon, a.bg, os.path.join(base, "icons"), a.icon_mode)

    manifest = {
        "id": sc, "name": a.name, "short_name": a.short, "description": a.desc,
        "start_url": sc, "scope": sc, "display": "standalone", "orientation": "any",
        "background_color": a.bg, "theme_color": a.theme, "lang": a.lang,
        "icons": [
            {"src": "icons/app-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "icons/app-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "icons/app-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }
    write(os.path.join(base, "manifest.webmanifest"), json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    write(os.path.join(base, "sw.js"), SW)
    write(os.path.join(base, "assets", "install.js"), JS)
    write(os.path.join(base, "assets", "install.css"), CSS % {"theme": a.accent or a.theme})
    write(os.path.join(base, "offline.html"),
          '<!doctype html><html lang="%s"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
          '<title>Offline | %s</title><meta name="description" content="This page needs an internet connection."><meta name="robots" content="noindex"><meta name="theme-color" content="%s">'
          '<link rel="stylesheet" href="assets/install.css"><script src="assets/install.js" defer></script></head>'
          '<body class="pwa-offline-page"><main class="pwa-offline"><img src="icons/app-192.png" width="84" height="84" alt="">'
          '<h1>You are offline</h1><p>%s needs an internet connection for this page. Please check your connection and try again.</p>'
          '<button class="pi-btn" type="button" data-reload>Try again</button></main></body></html>\n'
          % (a.lang, html.escape(a.name), a.theme, html.escape(a.name)))
    canonical = (a.origin.rstrip("/") + sc + "get-app.html") if a.origin else ""
    write(os.path.join(base, "get-app.html"),
          clone_page(base, a.template, "Get the %s app" % a.short,
                     "Install %s on your phone, tablet or computer. Free, no store account needed." % a.name,
                     canonical, base, get_app_body(a)))
    patch_home(os.path.join(base, a.home))
    print("install kit applied to", base, "scope", sc)


if __name__ == "__main__":
    main()
