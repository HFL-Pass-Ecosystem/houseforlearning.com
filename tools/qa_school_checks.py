#!/usr/bin/env python3
"""Audit the 'N-question check' block on every school page. Read-only: writes one markdown table.
Usage: python3 tools/qa_school_checks.py [out.md]"""
import re, glob, sys, collections, subprocess, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
GEN = re.compile(r'Any correct example is fine|A good answer names the first step')
rows = []; tot = collections.Counter(); by = collections.Counter(); tags = collections.Counter()
for f in sorted(glob.glob(str(root / 'site' / 'school-*.html'))):
    s = open(f).read(); i = s.find('-question check'); j = s.find('</section>', i)
    items = re.findall(r'<details[^>]*>.*?</details>', s[i:j], re.S) if i >= 0 else []
    q = len(items); gen = sum(1 for it in items if GEN.search(it))
    tg = sum(1 for it in items if 'Covered in' in it)
    for it in items:
        m = re.search(r'Covered in(?: (unit|module) \d+)?', it)
        if m: tags[m.group(1) or 'page-section'] += 1
    rows.append((pathlib.Path(f).name, q, gen, tg))
    tot['pages'] += 1; tot['checks'] += q; tot['generic'] += gen; tot['tagged'] += tg; by[q] += 1
head = subprocess.run(['git', '-C', str(root), 'rev-parse', '--short', 'HEAD~0'], capture_output=True, text=True).stdout.strip()
out = sys.argv[1] if len(sys.argv) > 1 else str(root / 'audits' / 'school-checks.md')
with open(out, 'w') as o:
    o.write(f'# School pages: checks audit (branch base {head})\n\n')
    o.write(f"{tot['pages']} pages, {tot['checks']} checks, {tot['generic']} generic answers, {tot['tagged']} 'Covered in' tags ({dict(tags)}).\n\n")
    o.write('Pages by number of checks: ' + ', '.join(f'{k} checks: {v}' for k, v in sorted(by.items())) + '\n\n')
    o.write('| page | checks | generic answers | Covered in tags |\n|---|---|---|---|\n')
    for r in rows: o.write('| ' + ' | '.join(map(str, r)) + ' |\n')
print(dict(tot), dict(by), dict(tags))
