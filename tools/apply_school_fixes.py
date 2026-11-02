#!/usr/bin/env python3
"""Apply corrected step-by-step working from data/school-deep-solved/<fix files> to the saved master data files data/school-deep/<slug>.json,
re-derive that course's 10 checks from the updated steps, then re-render the page. Usage: python3 tools/apply_school_fixes.py fix-sweep-3.json [more.json]
Islamic studies is never touched. Run python3 tools/build_school_deep.py afterwards to confirm a rebuild leaves the pages unchanged."""
import sys, json, csv, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_school_deep as S
B = S.B
def main(files):
    fixes = {}
    for f in files: fixes.update(json.load(open(B.Dt / 'school-deep-solved' / f)))
    rows = {}
    for (p, s), rs in B.plans.items():
        for i, r in enumerate(rs): rows[r['unit_id']] = (p, s, i)
    touched, changed = {}, 0
    for uid, v in fixes.items():
        if uid not in rows: print('unknown unit', uid); continue
        p, s, i = rows[uid]
        if s == 'ISL': continue
        slug = B.school_slug(p, s)
        fp = S.OUT / (slug[:-5] + '.json')
        d = touched.get(slug) or json.loads(fp.read_text())
        steps = [x for x in v['steps'] if isinstance(x, str) and x.strip()]
        if d['modules'][i].get('steps') != steps:
            d['modules'][i]['steps'] = steps; changed += 1
        touched[slug] = d
    n = 0
    for slug, d in touched.items():
        bd = S.BAND[d['band']]
        d['checks'] = [list(x) for x in S.checks(d['subject'], d['kind'], d['modules'], bd, d['label'])]
        (S.OUT / (slug[:-5] + '.json')).write_text(json.dumps(d, indent=1, ensure_ascii=False))
        S.render(d)
        pg = B.S / slug; t = pg.read_text(); pg.write_text(t.replace('defer></script></body>', 'defer></script>\n</body>', 1)); n += 1
    print('units changed', changed, 'courses re-rendered', n)
if __name__ == '__main__': main(sys.argv[1:])
