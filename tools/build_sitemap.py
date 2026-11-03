#!/usr/bin/env python3
"""Build site/sitemap.xml from the pages: every site/*.html (and site/*/index.html) that is indexable, sorted by file name.
Indexable = no <meta name="robots" content="noindex"> and no meta refresh, and not 404.html. The home page is listed as the root address.
<lastmod> keeps the date already in sitemap.xml for an address; a new address gets the date of its file's last git commit (today if none).
Deterministic: a second run changes nothing. Run from anywhere:  python3 tools/build_sitemap.py"""
import re, pathlib, subprocess, datetime
ROOT = pathlib.Path(__file__).resolve().parents[1]; SITE = ROOT / 'site'; BASE = 'https://houseforlearning.com/'
def indexable(h): return not re.search(r'<meta[^>]+name="robots"[^>]*noindex', h, re.I) and not re.search(r'http-equiv="refresh"', h, re.I)
def lastmod(f):
    r = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', str(f)], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    return r or datetime.date.today().isoformat()
old = {}
sm = SITE / 'sitemap.xml'
if sm.exists(): old = dict(re.findall(r'<loc>([^<]*)</loc><lastmod>([^<]*)</lastmod>', sm.read_text()))
pages = sorted(SITE.glob('*.html')) + sorted(SITE.glob('*/index.html'))
rows = []
for f in pages:
    rel = f.relative_to(SITE).as_posix()
    if rel == '404.html' or not indexable(f.read_text(encoding='utf-8', errors='ignore')): continue
    loc = BASE if rel == 'index.html' else BASE + rel
    rows.append((rel, loc, old.get(loc) or lastmod(f)))
rows.sort(key=lambda r: ('' if r[0] == 'index.html' else r[0]))
out = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    f'<url><loc>{l}</loc><lastmod>{d}</lastmod></url>\n' for _, l, d in rows) + '</urlset>\n'
if not sm.exists() or sm.read_text() != out: sm.write_text(out)
print(len(rows), 'addresses in sitemap.xml')
