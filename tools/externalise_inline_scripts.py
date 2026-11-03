#!/usr/bin/env python3
"""Move inline <script> code into files under site/assets/pages/.
Why: the site's security rules (Content-Security-Policy in netlify.toml) allow scripts from the site's own files only,
so inline scripts never run on the live site (a page can then sit on "Loading." forever). Data scripts
(type="application/ld+json" and other non-JavaScript types) are left alone. Safe to re-run."""
import glob, os, re
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
OUT = os.path.join(SITE, 'assets', 'pages')
os.makedirs(OUT, exist_ok=True)
pat = re.compile(r'<script(?P<a>(?![^>]*\bsrc=)[^>]*)>(?P<b>.*?)</script>', re.S)
n = 0
for f in sorted(glob.glob(os.path.join(SITE, '**', '*.html'), recursive=True)):
    t = open(f, encoding='utf-8').read()
    rel = os.path.relpath(f, SITE)
    depth = rel.count(os.sep)
    stem = re.sub(r'[^a-z0-9]+', '-', rel[:-5].lower()).strip('-')
    idx = [0]
    def rep(m):
        a, b = m.group('a'), m.group('b')
        ty = re.search(r'type="([^"]*)"', a)
        if (ty and ty.group(1) not in ('text/javascript', 'module')) or not b.strip():
            return m.group(0)
        idx[0] += 1
        name = f'{stem}{"" if idx[0] == 1 else "-" + str(idx[0])}.js'
        open(os.path.join(OUT, name), 'w', encoding='utf-8').write(b.strip() + '\n')
        return f'<script src="{"../" * depth}assets/pages/{name}" defer></script>'
    t2 = pat.sub(rep, t)
    if t2 != t:
        open(f, 'w', encoding='utf-8').write(t2); n += 1
print(n, 'pages changed')
