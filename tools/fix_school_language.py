#!/usr/bin/env python3
"""Plain-words intro for the English and ESL unit pages (2 Nov): the old intro said "taught in a way that is with notes..." which is not grammatical.
Edits the master data JSON, then re-renders those pages. Safe to rerun. Usage: python3 tools/fix_school_language.py [SUBJECT ...]  (default ENG ESL)"""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_school_deep as S
B = S.B
# outcomes that opened with a verb the project list bans as an action ('hear', 'enjoy'): same teaching, a verb a learner can be seen to do
OUTCOME_FIX = {'school-grade-01-eng.html': {1: [('hear, say and match the 26 letter sounds and blend three-letter words', 'say and match the 26 letter sounds and blend three-letter words')]},
               'school-grade-02-ara.html': {4: [('enjoy and retell short stories', 'retell short stories and sing short songs')]}}
want = set(sys.argv[1:]) or {'ENG', 'ESL'}; n = 0
for (p, s), rs in B.plans.items():
    slug = B.school_slug(p, s)
    if s not in want and slug not in OUTCOME_FIX: continue
    fp = S.OUT / (slug[:-5] + '.json')
    if not fp.exists(): continue
    d = json.loads(fp.read_text()); bd = S.BAND[d['band']]; ch = False
    for m in d['modules']:
        for old, new_o in OUTCOME_FIX.get(slug, {}).get(m['n'], []):
            if m['outcome'] == old: m['outcome'] = new_o; m['standard'] = m['standard'].replace(old[:1].upper() + old[1:], new_o[:1].upper() + new_o[1:], 1); m['points'] = [x.replace(old, new_o) for x in m['points']]; m['activity'] = m['activity'].replace(old, new_o); m['intro'] = m['intro'].replace(old, new_o); ch = True
        new = S.unit_intro(m['title'], m['outcome'], bd)
        if d['subject'] in want and m['intro'] != new: m['intro'] = new; ch = True
    if not ch: continue
    for m in d['modules']: m['bloom'] = S.bloom(m['outcome'])
    d['blooms'] = sorted({m['bloom'] for m in d['modules']}, key=list(S.BLOOM).index)
    d['checks'] = [list(x) for x in S.checks(d['subject'], d['kind'], d['modules'], bd, d['label'])]
    fp.write_text(json.dumps(d, indent=1, ensure_ascii=False)); S.render(d)
    pg = B.S / slug; t = pg.read_text(); pg.write_text(t.replace('defer></script></body>', 'defer></script>\n</body>', 1)); n += 1
print('pages changed', n)
