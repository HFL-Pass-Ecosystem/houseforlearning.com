#!/usr/bin/env python3
"""The site's Content-Security-Policy is script-src 'self', so inline <script> blocks never run.
Move each inline JS block into site/assets/inline/<page>-<n>.js and load it with defer.
Safe to re-run. JSON-LD and other non-JS script types are left alone."""
import re, pathlib, sys
S = pathlib.Path(__file__).resolve().parent.parent / 'site'
OUT = S / 'assets' / 'inline'
pat = re.compile(r'<script>(.+?)</script>', re.S)
pages = sys.argv[1:] or [p.name for p in sorted(S.glob('*.html'))]
n_files = 0
for name in pages:
    p = S / name
    t = p.read_text()
    if not pat.search(t):
        continue
    OUT.mkdir(parents=True, exist_ok=True)
    k = [0]
    def rep(m):
        k[0] += 1
        fn = f'{p.stem}-{k[0]}.js'
        (OUT / fn).write_text(m.group(1).strip() + '\n')
        return f'<script src="assets/inline/{fn}" defer></script>'
    p.write_text(pat.sub(rep, t))
    n_files += k[0]
print('externalised', n_files, 'inline scripts')
