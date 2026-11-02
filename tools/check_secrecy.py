#!/usr/bin/env python3
"""Secrecy check: banned words and patterns must not appear in anything the browser receives.
Run from the repo root:  python3 tools/check_secrecy.py [site_dir]
Word list: data/secrecy-words.json (edit rules there). Scans site/ files: html, js, css, json, xml, txt, webmanifest, svg
(comments included, because comments are served too). Prints a short list and exits 1. No network."""
import json, re, sys, pathlib, fnmatch, collections
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / 'site'
CFG = json.load(open(ROOT / 'data' / 'secrecy-words.json', encoding='utf-8'))
EXT = {'.html', '.js', '.css', '.json', '.xml', '.txt', '.webmanifest', '.svg', '.mjs'}
rules = []
for r in CFG['rules']:
    rules.append((r, re.compile(r['pattern'], 0 if r.get('case') else re.I)))
hits = collections.defaultdict(list)
nfiles = 0
for f in sorted(SITE.rglob('*')):
    if not f.is_file() or f.suffix.lower() not in EXT: continue
    rel = f.relative_to(SITE).as_posix()
    if any(rel.startswith(d) or ('/' + d) in '/' + rel for d in CFG.get('skip_dirs', [])): continue
    nfiles += 1
    text = f.read_text(encoding='utf-8', errors='replace')
    visible = None
    for r, rx in rules:
        if 'only' in r and not any(fnmatch.fnmatch(rel, g) for g in r['only']): continue
        if 'except' in r and rel in r['except']: continue
        body = text
        if r.get('html_text_only') and f.suffix == '.html':
            if visible is None:
                visible = re.sub(r'<!--.*?-->', ' ', re.sub(r'<(script|style)\b.*?</\1>', ' ', text, flags=re.S | re.I), flags=re.S)
                visible = re.sub(r'<[^>]+>', ' ', visible)
            body = visible
        m = rx.search(body)
        if m:
            s = body[max(0, m.start() - 30): m.end() + 30].replace('\n', ' ')
            hits[r['id']].append((rel, s.strip()))
if hits:
    print('SECRECY CHECK FAILED')
    why = {r['id']: r['why'] for r in CFG['rules']}
    for k, v in hits.items():
        print(f'{k}: {len(v)} file(s) ({why[k]})')
        for rel, s in v[:5]: print(f'    {rel}: ...{s}...')
        if len(v) > 5: print(f'    ... and {len(v) - 5} more files')
    sys.exit(1)
print(f'Secrecy check passed: {nfiles} files.')
