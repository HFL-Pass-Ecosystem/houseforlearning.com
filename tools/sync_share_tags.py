#!/usr/bin/env python3
"""Keep every page's share tags (og:title, og:description, og:url) in step with the page's own <title>,
meta description and canonical address. Runs last in rebuild_all.py so no builder can leave a copied tag behind."""
import re, pathlib
SITE = pathlib.Path(__file__).resolve().parents[1] / 'site'
def sync(s):
    t = re.search(r'<title>(.*?)</title>', s, re.S)
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    c = re.search(r'<link rel="canonical" href="([^"]*)"', s)
    for pat, m in (('og:title', t), ('og:description', d), ('og:url', c)):
        if m:
            s = re.sub(r'(<meta property="%s" content=")[^"]*' % pat, lambda x: x.group(1) + m.group(1), s)
    return s
n = 0
for f in sorted(SITE.glob('*.html')):
    s = f.read_text(encoding='utf-8'); new = sync(s)
    if new != s: f.write_text(new, encoding='utf-8'); n += 1
print(f'share tags synced on {n} pages')
