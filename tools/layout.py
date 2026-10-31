"""Shared layout helpers for the link pages: vary section layouts, accordions for questions, cards for lists,
callouts for one-line notes, and a style block that removes monospace labels. Same file in both repos."""
import re, zlib
CSS = """<style>
.lp .kicker,.lp caption,.lp .table-wrap th,.lp .sec-head p{font-family:inherit!important;letter-spacing:.04em;text-transform:none;font-weight:600}
.lp .lp-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:2rem;align-items:start}
.lp .lp-two .sec-head{margin:0}
@media(max-width:760px){.lp .lp-two{grid-template-columns:1fr}}
.lp details.lp-q{border:1px solid rgba(128,128,128,.35);border-radius:10px;padding:.8rem 1.1rem;margin:.6rem 0}
.lp details.lp-q summary{cursor:pointer;font-weight:600}
.lp details.lp-q p{margin:.6rem 0 0}
.lp .lp-note{border-left:4px solid currentColor;padding:.2rem 0 .2rem 1rem;margin:1.2rem 0 0;opacity:.9}
.lp ul.cards.lp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;list-style:none;padding:0}
</style>"""
def _is_faq(b):
    ps = re.findall(r"<p><strong>.*?</strong> .*?</p>", b, re.S)
    return bool(ps) and re.sub(r"<p><strong>.*?</strong> .*?</p>", "", b, flags=re.S).strip() == ""
def _faq(b):
    return "".join('<details class="lp-q"><summary>%s</summary><p>%s</p></details>' % m for m in re.findall(r"<p><strong>(.*?)</strong> (.*?)</p>", b, re.S))
def _cards(b):
    m = re.fullmatch(r'<ul class="ticks">(.*)</ul>', b, re.S)
    if not m: return b
    items = re.findall(r"<li>(.*?)</li>", m.group(1), re.S)
    if len(items) < 3: return b
    out = ""
    for it in items:
        if ":" in it and len(it.split(":", 1)[0]) < 48:
            h, t = it.split(":", 1); out += '<li class="card"><h3>%s</h3><p>%s</p></li>' % (h.strip(), t.strip())
        else:
            out += '<li class="card"><p>%s</p></li>' % it
    return '<ul class="cards lp-cards">%s</ul>' % out
def render(slug, secs, secfmt):
    """secs: [(kicker, heading, body)] -> html. secfmt(i, kicker, heading, body, two_col) renders one section."""
    seed = zlib.crc32(slug.encode()) % 3
    out, last = "", None
    for i, (k, h, b) in enumerate(secs):
        if _is_faq(b): b = _faq(b)
        plain = re.sub(r"<[^>]+>", "", b)
        if b.startswith("<p>") and b.count("<p>") == 1 and len(plain) < 230 and out:
            out += '<div class="wrap"><p class="lp-note"><strong>%s.</strong> %s</p></div>\n' % (h, plain) if False else ""
            out = out.rstrip()
            out += '\n<section class="sec" aria-label="%s"><div class="wrap"><p class="lp-note"><strong>%s.</strong> %s</p></div></section>\n' % (h, h, plain)
            continue
        v = (i + seed) % 3
        if v == 2: b = _cards(b)
        out += secfmt(i, k, h, b, v == 1)
    return out
