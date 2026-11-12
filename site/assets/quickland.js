/* Quick Landing v1 — "Browse the site" or "Take me straight there".
   One file, no libraries, works on any static site.
   Reads its settings from window.QL_CONFIG (set by the page) :
     { site, accent, browseTarget, whatsapp, agentEndpoint,
       destinations: [{ id, label, icon, url, hint, keywords: [] }] }
   Deep links: https://site/?go=<id>  or  https://site/#go=<id>
   (the tiny head snippet written by inject_quickland.py jumps there before the page draws). */
(function () {
  "use strict";
  var C = window.QL_CONFIG;
  if (!C) return;
  var STARTED = false;
  if (C.auto) { autoStart(); return; }
  if (!C.destinations || !C.destinations.length) return;
  var m0 = document.getElementById("ql-mount");
  if (m0) start(C.destinations, m0);

  /* Inside pages (auto mode): build the tiles from what the reader can already see on this page,
     its side-menu entries or its section headings, so nothing new is revealed. Waits for the
     page to be unlocked, and puts the pane back if the page redraws itself. */
  function autoStart() {
    var A = C.auto === true ? {} : C.auto;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      var gate = document.getElementById("gate");
      var locked = gate && gate.offsetParent !== null;
      var app = document.getElementById("app");
      if (!locked && (!app || app.children.length)) {
        var D = collect(A);
        if (D.length >= 2) { clearInterval(t); place(D, A); }
      }
      if (tries > 600) clearInterval(t);
    }, 250);
  }
  function txt(el) {
    var out = "";
    (function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1) {
          if (c.matches("small,.pct,svg")) continue;
          if (getComputedStyle(c).display === "none") continue;
          walk(c); out += " ";
        }
      }
    })(el);
    return out.replace(/\s+/g, " ").trim();
  }
  function collect(A) {
    var out = [], n = 0;
    var side = document.querySelector(A.nav || "#side");
    if (!side) {
      Array.prototype.some.call(document.querySelectorAll("nav,[role=tablist],.tabs"), function (nv) {
        if (nv.closest("header,footer,.ql")) return false;
        if (nv.querySelectorAll("a,button").length >= 2) { side = nv; return true; }
        return false;
      });
    }
    if (side) {
      Array.prototype.forEach.call(side.querySelectorAll("button,a"), function (b) {
        var l = txt(b); if (!l) return;
        if (!b.offsetParent && getComputedStyle(b).display === "none") return;
        var sm = b.querySelector("small");
        out.push({ id: "s" + (++n), label: l.replace(/^\d+\s+/, ""), hint: sm ? sm.textContent.trim() : "", icon: "&#10148;", el: b, url: "#", keywords: sm ? sm.textContent.split(/[ ,]+/) : [] });
      });
    }
    if (out.length < 2) {
      out = [];
      Array.prototype.forEach.call(document.querySelectorAll(A.headings || "h2"), function (h) {
        if (h.closest(".ql,#gate,footer,header,nav")) return;
        if (!h.offsetParent) return;
        var host = h.closest("section[id]") || h;
        if (!host.id) host.id = "ql-s" + (++n);
        out.push({ id: host.id, label: txt(h).slice(0, 70), icon: "&#10148;", url: "#" + host.id, keywords: [] });
      });
    }
    return out.slice(0, A.max || 14);
  }
  function place(D, A) {
    var mount = document.createElement("div");
    mount.id = "ql-mount";
    function put() {
      var after = document.querySelector(A.after || ".hero");
      if (after && after.parentNode) after.parentNode.insertBefore(mount, after.nextSibling);
      else { var b = document.body; b.insertBefore(mount, b.firstChild); }
    }
    put();
    start(D, mount);
    setInterval(function () { if (!document.body.contains(mount)) put(); }, 1000);
  }

  function start(D, mount) {
  if (STARTED) return; STARTED = true;

  // ---------- styles (scoped) ----------
  var accent = C.accent || "#0b6bcb";
  var css =
    ".ql{--ql-ac:" + accent + ";--ql-bg:#ffffff;--ql-fg:#0e1726;--ql-mut:#5b6678;--ql-line:rgba(14,23,38,.12);--ql-card:#f4f7fb;" +
    "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ql-fg);background:var(--ql-bg);" +
    "border:1px solid var(--ql-line);border-radius:18px;padding:18px;margin:18px auto;max-width:1100px;box-sizing:border-box;" +
    "box-shadow:0 8px 30px rgba(0,0,0,.08);position:relative;z-index:5}" +
    "@media (prefers-color-scheme:dark){.ql{--ql-bg:#0f1a2e;--ql-fg:#eaf0fb;--ql-mut:#9aa8c2;--ql-line:rgba(255,255,255,.14);--ql-card:#16243d}}" +
    "[data-theme=dark] .ql,.dark .ql{--ql-bg:#0f1a2e;--ql-fg:#eaf0fb;--ql-mut:#9aa8c2;--ql-line:rgba(255,255,255,.14);--ql-card:#16243d}" +
    "[data-theme=light] .ql,.light .ql{--ql-bg:#ffffff;--ql-fg:#0e1726;--ql-mut:#5b6678;--ql-line:rgba(14,23,38,.12);--ql-card:#f4f7fb}" +
    ".ql.ql-dark{--ql-bg:#0f1a2e;--ql-fg:#eaf0fb;--ql-mut:#9aa8c2;--ql-line:rgba(255,255,255,.14);--ql-card:#16243d}" +
    ".ql.ql-light{--ql-bg:#ffffff;--ql-fg:#0e1726;--ql-mut:#5b6678;--ql-line:rgba(14,23,38,.12);--ql-card:#f4f7fb}" +
    ".ql *{box-sizing:border-box}" +
    ".ql-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
    ".ql-big{display:flex;align-items:center;justify-content:center;gap:10px;min-height:64px;padding:12px 16px;border-radius:14px;" +
    "font-size:1.12rem;font-weight:700;cursor:pointer;border:2px solid var(--ql-ac);text-decoration:none;line-height:1.2;text-align:center}" +
    ".ql-browse{background:transparent;color:var(--ql-fg)}" +
    ".ql-go{background:var(--ql-ac);color:#fff}" +
    ".ql-big:focus-visible,.ql-tile:focus-visible,.ql-in:focus-visible,.ql-ic:focus-visible{outline:3px solid var(--ql-ac);outline-offset:2px}" +
    ".ql-ask{display:flex;gap:8px;margin-top:12px}" +
    ".ql-in{flex:1;min-width:0;min-height:52px;border-radius:12px;border:1px solid var(--ql-line);background:var(--ql-card);color:var(--ql-fg);" +
    "font-size:1rem;padding:0 14px}" +
    ".ql-ic{min-width:52px;min-height:52px;border-radius:12px;border:1px solid var(--ql-line);background:var(--ql-card);color:var(--ql-fg);" +
    "font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none}" +
    ".ql-ic.on{background:#c62828;color:#fff;border-color:#c62828}" +
    ".ql-wa{background:#1f8f4e;color:#fff;border-color:#1f8f4e}" +
    ".ql-msg{min-height:1.4em;margin:8px 2px 0;font-size:.92rem;color:var(--ql-mut)}" +
    ".ql-msg b{color:var(--ql-fg)}" +
    ".ql-grid{display:none;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-top:12px}" +
    ".ql.open .ql-grid{display:grid}" +
    ".ql-tile{position:relative;display:flex;flex-direction:column;gap:4px;min-height:84px;padding:12px 40px 12px 12px;border-radius:12px;" +
    "background:var(--ql-card);border:1px solid var(--ql-line);color:var(--ql-fg);text-decoration:none}" +
    ".ql-tile:hover{border-color:var(--ql-ac)}" +
    ".ql-tile .i{font-size:1.4rem}.ql-tile .l{font-weight:700}.ql-tile .h{font-size:.8rem;color:var(--ql-mut)}" +
    ".ql-share{position:absolute;top:6px;right:6px;width:32px;height:32px;border-radius:8px;border:0;background:transparent;" +
    "color:var(--ql-mut);cursor:pointer;font-size:1rem}" +
    ".ql-share:hover{color:#1f8f4e}" +
    ".ql-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}" +
    ".ql-chip{padding:8px 12px;border-radius:999px;border:1px solid var(--ql-ac);color:var(--ql-fg);text-decoration:none;font-size:.92rem}" +
    "@media (max-width:560px){.ql{margin:12px 0;padding:12px;max-width:100%}.ql-ic{min-width:44px}.ql-ask{gap:6px}.ql-two{grid-template-columns:1fr}.ql-big{min-height:56px;font-size:1.02rem}}" +
    ".ql-hl{animation:qlhl 1.6s ease-out 1}@keyframes qlhl{0%{box-shadow:0 0 0 4px var(--ql-ac)}100%{box-shadow:0 0 0 0 transparent}}";
  // externalCss: the site loads quickland.css itself (strict Content-Security-Policy, no <style> allowed)
  if (!C.externalCss) {
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function deepLink(d) {
    var base = location.origin && location.origin !== "null" ? location.origin + location.pathname : (C.site || "");
    return base + "?go=" + encodeURIComponent(d.id);
  }
  function go(d) {
    if (d.el) {
      d.el.click();
      var tgt = document.querySelector(C.auto && C.auto.main || "#main") || d.el;
      setTimeout(function () { tgt.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      return;
    }
    var u = d.url;
    if (u.charAt(0) === "#") {
      var el = document.getElementById(u.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ql-hl");
        var fi = el.querySelector("input,textarea,select");
        if (fi) setTimeout(function () { try { fi.focus({ preventScroll: true }); } catch (e) {} }, 350);
        setTimeout(function () { el.classList.remove("ql-hl"); }, 1700);
        try { history.replaceState(null, "", u); } catch (e) {}
        return;
      }
    }
    location.href = u;
  }

  // ---------- on-device intent matcher (instant, no network) ----------
  var STOP = "i im i'm me my we our you your a an the to of for in on at and or is are be can could would want wanna need please pls show take go get open find where how what do does page site link me".split(" ");
  var stop = {}; STOP.forEach(function (w) { stop[w] = 1; });
  function norm(s) { return String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim(); }
  function toks(s) { return norm(s).split(" ").filter(function (w) { return w && !stop[w]; }); }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var p = [], i, j;
    for (j = 0; j <= b.length; j++) p[j] = j;
    for (i = 1; i <= a.length; i++) {
      var prev = p[0]; p[0] = i;
      for (j = 1; j <= b.length; j++) {
        var t = p[j];
        p[j] = Math.min(p[j] + 1, p[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = t;
      }
    }
    return p[b.length];
  }
  var INDEX = D.map(function (d) {
    var phrases = [d.label].concat(d.keywords || []).map(norm);
    var words = {};
    phrases.forEach(function (p) { p.split(" ").forEach(function (w) { if (w && !stop[w]) words[w] = 1; }); });
    return { d: d, phrases: phrases, words: Object.keys(words) };
  });
  function score(q) {
    var nq = norm(q), qt = toks(q);
    return INDEX.map(function (x) {
      var s = 0;
      x.phrases.forEach(function (p) { if (p.length > 2 && (" " + nq + " ").indexOf(" " + p + " ") >= 0) s += 2 + p.split(" ").length * 2; });
      qt.forEach(function (w) {
        var best = 0;
        x.words.forEach(function (k) {
          if (k === w) best = Math.max(best, 3);
          else if (w.length >= 3 && (k.indexOf(w) === 0 || w.indexOf(k) === 0) && Math.min(k.length, w.length) >= 3) best = Math.max(best, 2);
          else if (w.length >= 4 && lev(w, k) <= (w.length >= 7 ? 2 : 1)) best = Math.max(best, 1.5);
        });
        s += best;
      });
      return { d: x.d, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
  }

  // ---------- render ----------
  var waBtn = C.whatsapp
    ? '<a class="ql-ic ql-wa" href="https://wa.me/' + esc(String(C.whatsapp).replace(/\D/g, "")) + "?text=" + encodeURIComponent("Hi, I'd like to go to: ") +
      '" target="_blank" rel="noopener" title="Ask on WhatsApp" aria-label="Ask on WhatsApp">&#128172;</a>'
    : "";
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micBtn = SR ? '<button type="button" class="ql-ic ql-mic" title="Speak" aria-label="Speak your request">&#127908;</button>' : "";
  mount.innerHTML =
    '<div class="ql' + (C.theme === "dark" ? " ql-dark" : C.theme === "light" ? " ql-light" : "") + '" role="region" aria-label="Quick start">' +
    '<div class="ql-two">' +
    (C.noBrowse ? "" : '<button type="button" class="ql-big ql-browse">&#128065;&#xFE0F; ' + esc(C.browseLabel || "Browse the site") + "</button>") +
    '<button type="button" class="ql-big ql-go" aria-expanded="false">&#9889; Take me straight there</button>' +
    "</div>" +
    '<form class="ql-ask" autocomplete="off">' +
    '<input class="ql-in" type="search" enterkeyhint="go" placeholder="' + esc(C.askPlaceholder || "Say or type what you want to do") + '" aria-label="What do you want to do?">' +
    micBtn + '<button type="submit" class="ql-ic" title="Go" aria-label="Go">&#10140;</button>' + waBtn +
    "</form>" +
    '<div class="ql-msg" aria-live="polite"></div>' +
    '<div class="ql-grid">' +
    D.map(function (d, i) {
      return '<a class="ql-tile" href="' + esc(d.url) + '" data-i="' + i + '"><span class="i">' + (d.icon || "&#10148;") + '</span><span class="l">' + esc(d.label) +
        "</span>" + (d.hint ? '<span class="h">' + esc(d.hint) + "</span>" : "") +
        (d.el || C.noShare ? "" : '<button type="button" class="ql-share" data-i="' + i + '" title="Send this link on WhatsApp" aria-label="Send ' + esc(d.label) + ' link on WhatsApp">&#128279;</button>') + "</a>";
    }).join("") +
    "</div></div>";

  var root = mount.firstChild, inp = root.querySelector(".ql-in"), msg = root.querySelector(".ql-msg");
  var goBtn = root.querySelector(".ql-go");

  if (C.noBrowse) root.querySelector(".ql-two").style.gridTemplateColumns = "1fr";
  if (!C.noBrowse) root.querySelector(".ql-browse").onclick = function () {
    var t = C.browseTarget && document.querySelector(C.browseTarget);
    if (!t) { t = mount.nextElementSibling; }
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  goBtn.onclick = function () {
    var o = root.classList.toggle("open");
    goBtn.setAttribute("aria-expanded", o ? "true" : "false");
    if (o) { var f = root.querySelector(".ql-tile"); if (f) f.focus({ preventScroll: true }); }
  };
  root.querySelector(".ql-grid").addEventListener("click", function (e) {
    var sh = e.target.closest(".ql-share");
    if (sh) {
      e.preventDefault(); e.stopPropagation();
      var d = D[+sh.getAttribute("data-i")];
      window.open("https://wa.me/?text=" + encodeURIComponent(d.label + ": " + deepLink(d)), "_blank", "noopener");
      return;
    }
    var t = e.target.closest(".ql-tile");
    if (t) { e.preventDefault(); go(D[+t.getAttribute("data-i")]); }
  });

  function answer(q, how) {
    var t0 = performance.now();
    q = (q || "").trim();
    if (!q) { root.classList.add("open"); return; }
    var r = score(q), top = r[0], second = r[1] || { s: 0 };
    var ms = Math.max(1, Math.round(performance.now() - t0));
    if (top.s >= 3 && top.s >= second.s * 1.4) {
      msg.innerHTML = top.d.note ? esc(top.d.note) : "Taking you to <b>" + esc(top.d.label) + "</b> (found in " + ms + " ms)";
      setTimeout(function () { go(top.d); }, 250);
      return;
    }
    var opts = r.filter(function (x) { return x.s > 0; }).slice(0, 3);
    if (!opts.length && C.agentEndpoint) return askAgent(q);
    if (!opts.length) {
      msg.textContent = "I couldn't place that. Pick one of these:";
      root.classList.add("open"); goBtn.setAttribute("aria-expanded", "true");
      return;
    }
    msg.innerHTML = "Did you mean:" + '<div class="ql-chips">' + opts.map(function (x) {
      return '<a class="ql-chip" href="' + esc(x.d.url) + '" data-id="' + esc(x.d.id) + '">' + (x.d.icon || "") + " " + esc(x.d.label) + "</a>";
    }).join("") + "</div>";
  }
  msg.addEventListener("click", function (e) {
    var c = e.target.closest(".ql-chip"); if (!c) return;
    e.preventDefault();
    var id = c.getAttribute("data-id");
    for (var i = 0; i < D.length; i++) if (D[i].id === id) return go(D[i]);
  });
  // Optional server agent for free-form questions the on-device matcher can't place.
  // Expects POST {q, site} -> {id} ; must answer within 4 s or we fall back to the tiles.
  function askAgent(q) {
    msg.textContent = "Working it out…";
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);
    fetch(C.agentEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: q, site: C.site }), signal: ctl && ctl.signal })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(timer);
        for (var i = 0; i < D.length; i++) if (D[i].id === j.id) { msg.innerHTML = "Taking you to <b>" + esc(D[i].label) + "</b>"; return go(D[i]); }
        throw 0;
      })
      .catch(function () { msg.textContent = "Pick one of these:"; root.classList.add("open"); });
  }

  root.querySelector(".ql-ask").onsubmit = function (e) { e.preventDefault(); answer(inp.value, "text"); };

  // Voice
  var mic = root.querySelector(".ql-mic");
  if (mic && SR) {
    var rec = null;
    mic.onclick = function () {
      if (rec) { rec.stop(); return; }
      rec = new SR();
      rec.lang = C.voiceLang || navigator.language || "en-US";
      rec.interimResults = true; rec.maxAlternatives = 1;
      mic.classList.add("on"); msg.textContent = "Listening…";
      rec.onresult = function (ev) {
        var t = "", fin = false;
        for (var i = ev.resultIndex; i < ev.results.length; i++) { t += ev.results[i][0].transcript; if (ev.results[i].isFinal) fin = true; }
        inp.value = t;
        if (fin) answer(t, "voice");
      };
      rec.onerror = function () { msg.textContent = "I couldn't hear that. Type it instead, or pick below."; };
      rec.onend = function () { mic.classList.remove("on"); rec = null; };
      try { rec.start(); } catch (e) { mic.classList.remove("on"); rec = null; }
    };
  }

  // "/" focuses the ask box (desktop)
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "")) { e.preventDefault(); inp.focus(); }
  });

  // Deep link to an in-page section (external ones were already handled in <head>)
  if (window.__QL_GO) { for (var i = 0; i < D.length; i++) if (D[i].id === window.__QL_GO) { go(D[i]); break; } }
  }
})();
