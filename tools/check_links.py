#!/usr/bin/env python3
"""Internal link checker for the built pages. Run from the repo root:  python3 tools/check_links.py
For every page in site/ (and site subfolders):
  - each local href/src must point to a file that exists (query strings ignored);
  - each #anchor must exist as an id (or name) in the target page;
  - no link to a Russia page (names with "russia" or "-ru-"), and no link to another brand's domain.
Prints a short list and exits 1 if anything is wrong. No network.
Allowed external hosts: ALLOWED_HOSTS below (this site, standards, payment/legal pointers). Add to it only on purpose."""
import re, sys, pathlib, collections
from urllib.parse import urlsplit, unquote
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'
ALLOWED_HOSTS = {'houseforlearning.com', 'www.houseforlearning.com', 'hfl-pass.com', 'www.hfl-pass.com',
                 'w3.org', 'www.w3.org', 'schema.org', 'fonts.googleapis.com', 'fonts.gstatic.com',
                 'canada.ca', 'www.canada.ca'}  # canada.ca: official government sources cited on the Canada pages
RUSSIA = re.compile(r'russia|[-/]ru[-.]', re.I)
ATTR = re.compile(r'<(?:a|link|img|script|source|iframe|form|video|audio)\b[^>]*?\s(?:href|src|action|poster)\s*=\s*("([^"]*)"|\'([^\']*)\')', re.I | re.S)
ATTR_ALL = re.compile(r'\s(href|src|action|poster)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')', re.I)
ID = re.compile(r'\s(?:id|name)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')', re.I)
TAG = re.compile(r'<(a|link|img|script|source|iframe|form|video|audio)\b([^>]*)>', re.I | re.S)
_ids = {}
def ids_of(p):
    if p not in _ids:
        s = p.read_text(encoding='utf-8', errors='replace')
        s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
        _ids[p] = {a or b for a, b in ID.findall(s)}
    return _ids[p]
errors = collections.defaultdict(list)
pages = sorted(SITE.rglob('*.html'))
for page in pages:
    rel = page.relative_to(SITE).as_posix()
    s = page.read_text(encoding='utf-8', errors='replace')
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    s = re.sub(r'<(script|style)\b[^>]*>.*?</\1>', lambda m: re.match(r'<[^>]*>', m.group(0)).group(0), s, flags=re.S | re.I)  # keep the tag, drop the body
    for tag, attrs in TAG.findall(s):
        for _, v1, v2 in ATTR_ALL.findall(' ' + attrs):
            url = (v1 or v2).strip()
            if not url or url.startswith(('mailto:', 'tel:', 'javascript:', 'data:', 'sms:')) or '{' in url:
                continue
            if url == '#' or url.startswith('#/'):  # '#/..' = in-app routes of the MBA page
                continue
            u = urlsplit(url)
            if u.scheme or url.startswith('//'):
                host = (u.hostname or '').lower()
                if host and host not in ALLOWED_HOSTS and not any(host.endswith('.' + h) for h in ALLOWED_HOSTS):
                    errors['other domain'].append(f'{rel}: {url}')
                continue
            path = unquote(u.path)
            if RUSSIA.search(path) and not RUSSIA.search(rel):
                errors['Russia link'].append(f'{rel}: {url}')
            target = page if path == '' else (SITE / path.lstrip('/') if path.startswith('/') else (page.parent / path)).resolve()
            try:
                target.relative_to(SITE.resolve())
            except ValueError:
                errors['outside site'].append(f'{rel}: {url}'); continue
            if target.is_dir():
                target = target / 'index.html'
            if not target.exists():
                errors['missing file'].append(f'{rel}: {url}'); continue
            if u.fragment and target.suffix == '.html' and unquote(u.fragment) not in ids_of(target):
                errors['missing anchor'].append(f'{rel}: {url}')
if errors:
    print('LINK CHECK FAILED')
    for k, v in errors.items():
        print(f'{k}: {len(v)}')
        for x in sorted(set(v))[:15]: print('    ' + x)
        if len(set(v)) > 15: print(f'    ... and {len(set(v)) - 15} more')
    sys.exit(1)
print(f'Link check passed: {len(pages)} pages.')
