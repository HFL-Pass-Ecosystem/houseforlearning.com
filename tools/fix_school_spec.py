#!/usr/bin/env python3
"""Spec fixes on the master school data files (2 Nov): re-derive each unit's Bloom level from its outcome verb (with the extended verb list),
turn the template 'Model run' example into a solved one from the unit's own first steps, then re-derive checks and re-render changed pages.
Usage: python3 tools/fix_school_spec.py"""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_school_deep as S
B = S.B
changed = 0
for (p, s), rs in B.plans.items():
    slug = B.school_slug(p, s); fp = S.OUT / (slug[:-5] + '.json')
    if not fp.exists(): continue
    d = json.loads(fp.read_text()); ch = False
    for m in d['modules']:
        nb = S.bloom(m['outcome'])
        if nb != m['bloom']: m['bloom'] = nb; ch = True
        if m.get('steps') and (m['example'].startswith('Model run') or not m['example'].startswith('Solved')) and d['subject'] != 'ISL':
            m['example'] = 'Solved: ' + ' '.join(m['steps'][:2]); ch = True
    nbl = sorted({m['bloom'] for m in d['modules']}, key=list(S.BLOOM).index)
    if nbl != d['blooms']: d['blooms'] = nbl; ch = True
    if not ch: continue
    d['checks'] = [list(x) for x in S.checks(d['subject'], d['kind'], d['modules'], S.BAND[d['band']], d['label'])]
    fp.write_text(json.dumps(d, indent=1, ensure_ascii=False)); S.render(d)
    pg = B.S / slug; t = pg.read_text(); pg.write_text(t.replace('defer></script></body>', 'defer></script>\n</body>', 1)); changed += 1
print('pages changed', changed)
