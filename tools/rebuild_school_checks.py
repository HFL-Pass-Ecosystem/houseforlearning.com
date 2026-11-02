#!/usr/bin/env python3
"""Re-derive the 10 checks of the named school courses from their saved master data files and re-render the pages.
Usage: python3 tools/rebuild_school_checks.py ISL   (a subject code) or a slug such as school-grade-03-isl.html"""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_school_deep as S
B = S.B
want = set(sys.argv[1:]); n = 0
for (p, s), rs in B.plans.items():
    slug = B.school_slug(p, s)
    if s not in want and slug not in want: continue
    fp = S.OUT / (slug[:-5] + '.json'); d = json.loads(fp.read_text())
    d['checks'] = [list(x) for x in S.checks(d['subject'], d['kind'], d['modules'], S.BAND[d['band']], d['label'])]
    fp.write_text(json.dumps(d, indent=1, ensure_ascii=False)); S.render(d)
    pg = B.S / slug; t = pg.read_text(); pg.write_text(t.replace('defer></script></body>', 'defer></script>\n</body>', 1)); n += 1
print('courses rebuilt', n)
