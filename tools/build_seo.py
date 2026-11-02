#!/usr/bin/env python3
"""Last-but-one step of the rebuild (after build_nav): tidy <title> and <meta name="description"> on every site/*.html.
Idempotent and deterministic (a second run changes nothing).
1. Titles are at most 70 characters, topic first. Wordy brackets are shortened, the suffix drops to ' | HFL' when needed,
   and a long topic is cut at a word with an ellipsis.
2. Titles are unique: EU and NL flagship pages carry their region; four hub pages have set titles.
3. A meta description shorter than 60 characters is rewritten, 120 to 160 characters, from the page's own Task and Standard
   (or its first long paragraph). Descriptions that are already fine are left alone."""
import re, html, glob, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]; SITE = ROOT / 'site'
SUF = ' | House for Learning'; SHORT = ' | HFL'
SET = {'pathways.html': 'Pathways: your growth, our goal', 'courses.html': 'Planned course chapters',
       'courses-hub.html': 'Courses hub: full courses for organisations, learners and families'}
SETDESC = {'learn-flagship-in.html': 'Full courses for India: 35 flagship courses with eight modules, worked examples, a marking rubric, a ten-question check and a seven-level ladder.',
           'learn-loc-mx-hub.html': 'All 75 global courses as Mexico editions: every course with local rules, jobs and MXN examples, from lead generation to robotics and space tourism.',
           'enterprise-software.html': 'Full courses on business software, from L1 to L7: CRM administration, creative suites, finance applications, ERP, and cloud office administration.'}
REPL = [(' (flagship course, India)', ' (India)'), (' (Canada flagship course)', ' (Canada)')]
def e(s): return html.escape(s, quote=True)
def fit(core):
    for a, b in REPL:
        if len(core + SUF) > 70: core = core.replace(a, b)
    if len(core + SUF) <= 70: return core + SUF
    if len(core + SHORT) <= 70: return core + SHORT
    room = 70 - len(SHORT)
    if ': ' in core:                      # keep the place or edition after the colon: it tells pages apart
        topic, tail = core.split(': ', 1)
        keep = room - len(tail) - 3
        if keep >= 20: return topic[:keep].rsplit(' ', 1)[0].rstrip(' ,:;-(&') + '…: ' + tail + SHORT
    cut = core[:room - 1].rsplit(' ', 1)[0].rstrip(' ,:;-(&')
    return cut + '…' + SHORT
def text(raw): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', raw))).strip()
def cut(s, lo=120, hi=160):
    s = s.strip()
    if len(s) <= hi: return s
    c = s[:hi]; i = max(c.rfind('. '), c.rfind('; '))
    if i >= lo: return c[:i + 1]
    return c.rsplit(' ', 1)[0].rstrip(' ,:;-') + '…'
def describe(h, name):
    main = re.search(r'<main.*?</main>', h, re.S); main = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', main.group(0) if main else h, flags=re.S)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', main, re.S); h1 = text(h1.group(1)) if h1 else ''; h1 = h1.replace(' deep edition', '')
    def after(label):
        m = re.search(r'<h4>%s</h4>\s*<p>(.*?)</p>' % label, main, re.S); return text(m.group(1)) if m else ''
    task, std = after('Task'), after('Standard')
    if task and std:
        d = '%s: %s. Standard: %s' % (h1, task.rstrip('.'), std.rstrip('.') + '.')
    else:
        paras = [text(p) for p in re.findall(r'<p(?: [^>]*)?>(.*?)</p>', main, re.S)]
        paras = [p for p in paras if len(p) >= 50]
        d = (h1 + ': ' if h1 else '') + (paras[0] if paras else '')
        if len(d) < 120 and len(paras) > 1: d += ' ' + paras[1]
    return cut(d)
def tidy(f):
    h = f.read_text(encoding='utf-8'); o = h; name = f.name
    m = re.search(r'<title>(.*?)</title>', h, re.S)
    if m:
        t = html.unescape(m.group(1)).strip(); core = t[:-len(SUF)] if t.endswith(SUF) else (t[:-len(SHORT)] if t.endswith(SHORT) else t)
        if core.endswith('…') and t.endswith(SHORT): core = None
        if core is not None:
            if name in SET: core = SET[name]
            mm = re.match(r'learn-flagship-(eu|nl)-', name)
            if mm:
                tag = {'eu': 'Europe', 'nl': 'Netherlands'}[mm.group(1)]
                if not re.search(r'\((Europe|Netherlands)\)$', core): core = re.sub(r' \(full course\)$', '', core) + ' (%s)' % tag
            t2 = fit(core)
            h = h.replace(m.group(0), '<title>%s</title>' % e(t2), 1)
    d = re.search(r'<meta name="description" content="([^"]*)"', h)
    if d and name in SETDESC and html.unescape(d.group(1)) != SETDESC[name] and len(html.unescape(d.group(1))) < 60:
        h = h.replace(d.group(0), '<meta name="description" content="%s"' % e(SETDESC[name]), 1); d = None
    if d and len(html.unescape(d.group(1)).strip()) < 60:
        nd = describe(h, name)
        if len(nd) >= 80: h = h.replace(d.group(0), '<meta name="description" content="%s"' % e(nd), 1)
    if h != o: f.write_text(h, encoding='utf-8')
    return h != o
if __name__ == '__main__':
    n = sum(tidy(f) for f in sorted(SITE.glob('*.html'))); print(n, 'pages tidied')
