#!/usr/bin/env python3
"""Read-only page weight audit for site/*.html. Usage: python3 tools/qa_page_weight.py [report.md]
Per page: html size, local css/js/img sizes (each file once), images over 200 KB, <img> with no width/height or no alt,
render-blocking <script src> (no defer/async/module). Writes the worst 20 by total weight."""
import os, re, sys, glob, collections
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); site = os.path.join(root, 'site')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'audits', 'page-weight.md')
def size(ref, base):
    ref = ref.split('#')[0].split('?')[0]
    if not ref or re.match(r'(https?:|//|data:|mailto:|tel:)', ref): return None
    p = os.path.normpath(os.path.join(site, ref.lstrip('/')))
    return os.path.getsize(p) if os.path.isfile(p) else None
rows = []; agg = collections.Counter()
for f in sorted(glob.glob(os.path.join(site, '*.html'))):
    h = open(f, encoding='utf-8', errors='ignore').read(); name = os.path.basename(f)
    h2 = re.sub(r'<!--.*?-->', '', h, flags=re.S)
    tot = len(h.encode()); big = []; nodim = 0; noalt = 0; block = 0; seen = set()
    for t in re.findall(r'<img\b[^>]*>', h2, re.I):
        src = re.search(r'\bsrc="([^"]*)"', t); w = re.search(r'\bwidth=', t); hh = re.search(r'\bheight=', t)
        if not (w and hh): nodim += 1
        if not re.search(r'\balt=', t): noalt += 1
        if src and src.group(1) not in seen:
            seen.add(src.group(1)); s = size(src.group(1), f)
            if s:
                tot += s
                if s > 200 * 1024: big.append((src.group(1), s // 1024))
    for ref in re.findall(r'<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"', h2) + re.findall(r'<link[^>]+href="([^"]+)"[^>]*rel="stylesheet"', h2):
        if ref not in seen: seen.add(ref); tot += size(ref, f) or 0
    for t in re.findall(r'<script\b[^>]*\bsrc="[^"]+"[^>]*>', h2, re.I):
        ref = re.search(r'src="([^"]+)"', t).group(1)
        if ref not in seen: seen.add(ref); tot += size(ref, f) or 0
        if not re.search(r'\b(defer|async)\b|type="module"', t): block += 1
    rows.append((name, tot // 1024, len(big), nodim, noalt, block, big))
    agg['pages'] += 1; agg['nodim'] += nodim > 0; agg['noalt'] += noalt > 0; agg['block'] += block > 0; agg['big'] += len(big) > 0
rows.sort(key=lambda r: -r[1])
with open(out, 'w') as o:
    o.write('# Page weight audit\n\n%d pages. Pages with an image lacking width/height: %d; with an img lacking alt: %d; with a render-blocking script: %d; with an image over 200 KB: %d.\n\n' % (agg['pages'], agg['nodim'], agg['noalt'], agg['block'], agg['big']))
    o.write('## Worst 20 by total weight (KB, html + local css/js/img, each file once)\n\n| page | KB | imgs >200KB | imgs no width/height | imgs no alt | blocking scripts |\n|---|---|---|---|---|---|\n')
    for r in rows[:20]: o.write('| %s | %d | %d | %d | %d | %d |\n' % r[:6])
    o.write('\n## Images over 200 KB\n\n')
    for r in rows:
        for s, k in r[6]: o.write('- %s: %s (%d KB)\n' % (r[0], s, k))
print(dict(agg)); [print(r[:6]) for r in rows[:20]]
