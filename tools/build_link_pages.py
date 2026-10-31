"""Builds the detail pages that sit behind every button that used to point at the contact form or a generic page.
Run from repo root: python3 tools/build_link_pages.py"""
import re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from link_pages_data import FN, Q, INSIDE
tpl = open("site/credits.html", encoding="utf-8").read()
head, rest = tpl.split('<main id="main" tabindex="-1">', 1)
tail = rest[rest.index("</main>"):]

def mkhead(title, desc, slug):
    h = head
    h = re.sub(r"<title>.*?</title>", "<title>%s | House for Learning</title>" % title, h)
    h = re.sub(r'(<meta name="description" content=")[^"]*', r"\g<1>" + desc.replace("\\", ""), h)
    h = re.sub(r'(<meta property="og:title" content=")[^"]*', r"\g<1>%s | House for Learning" % title, h)
    h = re.sub(r'(<meta property="og:description" content=")[^"]*', r"\g<1>" + desc, h)
    h = re.sub(r'(rel="canonical" href="[^"]*/)credits\.html', r"\g<1>" + slug + ".html", h)
    h = re.sub(r'(property="og:url" content="[^"]*/)credits\.html', r"\g<1>" + slug + ".html", h)
    h = h.replace('<li aria-current="page">How credits stack</li>', '<li aria-current="page">%s</li>' % title)
    return h

def sec(i, k, h, body):
    alt = " alt" if i % 2 == 0 else ""
    return ('<section class="sec%s" aria-labelledby="s%d-h"><div class="wrap"><div class="sec-head"><p class="kicker">%s</p><h2 id="s%d-h">%s</h2></div><div class="sec-body">%s</div></div></section>\n'
            % (alt, i, k, i, h, body))

def page(slug, title, kicker, lead, sections, cta_h, cta_p, btns, note=""):
    out = mkhead(title, lead, slug)
    out += '<main id="main" tabindex="-1">\n'
    out += '<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">%s</p><h1 id="h1">%s</h1><p>%s</p></div></div></section>\n' % (kicker, title, lead)
    for i, (k, h, b) in enumerate(sections):
        out += sec(i, k, h, b)
    if note:
        out += '<section class="sec" aria-label="Note"><div class="wrap"><p class="note">%s</p></div></section>\n' % note
    out += '<section class="cta" aria-labelledby="cta-h"><div class="wrap cta-inner"><div><p class="kicker">your next step</p><h2 id="cta-h">%s</h2><p>%s</p><div class="ctas">%s</div></div></div></section>\n' % (cta_h, cta_p, btns)
    return out + tail

def p_(t): return "<p>%s</p>" % t

for f in FN:
    related = "".join('<li><a href="workspace-fn-%s.html">%s</a></li>' % (s, n) for s, n in f["rel"])
    sections = [
     ("where it sits", f["layer"], p_("<strong>%s.</strong> %s" % (f["tag"], f["lead"]))),
     ("what it covers", "What this covers", '<ul class="ticks">' + "".join("<li>%s</li>" % c for c in f["covers"]) + "</ul>"),
     ("how it works", "How it works", '<ol class="steps">' + "".join("<li><h3>%s</h3><p>%s</p></li>" % s for s in f["steps"]) + "</ol>"),
     ("what you get", "What you get", p_(f["gets"])),
     ("nearby", "Related functions", '<ul class="ticks">' + related + "</ul>"),
    ]
    html = page("workspace-fn-" + f["slug"], f["title"], "workspace", f["lead"], sections,
        "Back to the three layers", "See where this function sits among the nine.",
        '<a class="btn" href="workspace.html">Workspace home</a><a class="btn btn-ghost" href="workspace-enterprise.html">Marketplace and workplace</a>', INSIDE)
    open("site/workspace-fn-%s.html" % f["slug"], "w", encoding="utf-8").write(html)

for q in Q:
    mail = "mailto:engage@hfl-pass.com?subject=" + q["mail"].replace(" ", "%20")
    rel = "".join('<a class="btn btn-ghost" href="%s">%s</a>' % r for r in q["related"])
    html = page(q["slug"], q["title"], q["kicker"], q["lead"], q["sections"],
        "Still want to write?", "A person reads every message. Nothing here is automatic.",
        '<a class="btn" href="%s">Email us about this</a>%s' % (mail, rel))
    open("site/%s.html" % q["slug"], "w", encoding="utf-8").write(html)
print(len(FN), len(Q))
