#!/usr/bin/env python3
"""No-browser accessibility check for site/*.html. Exit 1 on any failure.
Checks every page for: one h1, no skipped heading level, lang on <html>, alt on images, names on buttons and links,
labels on form controls, no duplicate ids; and checks that the text colours set in the shared CSS keep AA contrast (4.5:1)
against the backgrounds they sit on. The full per-page colour check needs a browser: see tools/contrast_check.js."""
import re, sys, pathlib, collections
ROOT = pathlib.Path(__file__).resolve().parent.parent / 'site'

def lum(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda x: x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
def ratio(a, b):
    x, y = lum(a), lum(b)
    return (max(x, y) + .05) / (min(x, y) + .05)

# (css file, regex capturing the text colour, [background colours it sits on], note)
PAIRS = [
    ('site-lux.css', r'--kick:(#[0-9a-fA-F]{6})', ['#F2EEE2', '#EAE4D3', '#FBF8EF'], 'kicker gold'),
    ('courses.css', r'\.mn\{color:(#[0-9a-fA-F]{6})', ['#FFFFFF', '#F2EEE2'], 'module label'),
    ('courses.css', r'text-transform:uppercase;color:(#[0-9a-fA-F]{6})\}', ['#F2EEE2'], 'preview label'),
    ('courses.css', r'\.pill\.lv\{background:(#[0-9a-fA-F]{6});color:#fff', ['#FFFFFF'], 'level pill (white text on this colour)'),
    ('wayfind.css', r'\.wf-home\{background:(#[0-9a-fA-F]{6});border-color:[^;]+;color:#fff', ['#FFFFFF'], 'Home button (white text on this colour)'),
    ('career-launch.css', r'--gold-text:(#[0-9a-fA-F]{6})', ['#FFFDF8', '#F6F1E7'], 'Career Launch gold on light'),
    ('career-launch.css', r'--gold-on-dark:(#[0-9a-fA-F]{6})', ['#14231F'], 'Career Launch gold on dark'),
    ('site.css', r'\.skip\{[^}]*background:(#[0-9a-fA-F]{6})', ['#FFFFFF'], 'skip link (white text on this colour)'),
]

def css_checks():
    bad = []
    for fn, rx, bgs, note in PAIRS:
        t = (ROOT / 'assets' / fn).read_text()
        m = re.search(rx, t)
        if not m: bad.append(f'{fn}: could not find the colour for "{note}" (rule changed? update tools/check_a11y.py)'); continue
        col = m.group(1)
        for bg in bgs:
            r = ratio(col, bg)
            if r < 4.5: bad.append(f'{fn}: {note} {col} on {bg} is {r:.2f}:1 (needs 4.5:1)')
    return bad

def page_checks(f):
    s = f.read_text(); bad = []
    body = re.sub(r'<(script|style)\b.*?</\1>', '', s, flags=re.S)
    if not re.search(r'<html[^>]*\blang="[a-z]{2}', s): bad.append('no lang on <html>')
    hs = [int(x) for x in re.findall(r'<h([1-6])\b', body)]
    if hs.count(1) != 1: bad.append(f'{hs.count(1)} h1')
    for a, c in zip(hs, hs[1:]):
        if c > a + 1: bad.append(f'heading jumps from h{a} to h{c}'); break
    for m in re.finditer(r'<img\b[^>]*>', body):
        if not re.search(r'\balt=', m.group(0)): bad.append('image without alt'); break
    for m in re.finditer(r'<button\b[^>]*>(.*?)</button>', body, re.S):
        if not re.sub(r'<[^>]+>', '', m.group(1)).strip() and 'aria-label' not in m.group(0): bad.append('button without a name'); break
    for m in re.finditer(r'<a\b[^>]*>(.*?)</a>', body, re.S):
        if not re.sub(r'<[^>]+>', '', m.group(1)).strip() and 'aria-label' not in m.group(0) and '<img' not in m.group(1): bad.append('link without a name'); break
    ids = re.findall(r'\bid="([^"]+)"', body)
    d = [k for k, v in collections.Counter(ids).items() if v > 1]
    if d: bad.append('duplicate id ' + d[0])
    # form controls: a label[for], a wrapping label, or aria-label / aria-labelledby / title
    for m in re.finditer(r'<(input|select|textarea)\b([^>]*)>', body):
        a = m.group(2)
        if re.search(r'type="(hidden|submit|button)"', a) or re.search(r'aria-label|title=', a): continue
        i = re.search(r'\bid="([^"]+)"', a)
        if i and re.search(r'for="%s"' % re.escape(i.group(1)), body): continue
        before = body[:m.start()]
        if before.rfind('<label') > before.rfind('</label>'): continue
        bad.append('form control without a label'); break
    return bad

def main():
    fails = [('shared css', b) for b in css_checks()]
    for f in sorted(ROOT.glob('*.html')):
        fails += [(f.name, b) for b in page_checks(f)]
    for n, b in fails[:60]: print(f'FAIL {n}: {b}')
    print(f'{len(fails)} problem(s) in {len(list(ROOT.glob("*.html")))} pages')
    return 1 if fails else 0
if __name__ == '__main__': sys.exit(main())
