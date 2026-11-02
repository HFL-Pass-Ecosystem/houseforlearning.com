#!/usr/bin/env python3
"""Audit every school page against the full spec: Bloom verbs, task/condition/standard, rubric, worked example and steps per unit,
L1-L7 slides with notes, where it fits, next steps. Prints gaps. Usage: python3 tools/audit_school_spec.py"""
import json, glob, re, os, collections
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = json.load(open(f'{root}/data/verbs.json')) if os.path.exists(f'{root}/data/verbs.json') else {}
verbs = set()
def walk(x):
    if isinstance(x, dict):
        for k, v in x.items(): walk(v) if isinstance(v, (dict, list)) else verbs.add(str(v).lower()); verbs.add(str(k).lower())
    elif isinstance(x, list):
        for v in x: walk(v) if isinstance(v, (dict, list)) else verbs.add(str(v).lower())
walk(V)
gaps = collections.defaultdict(list)
for f in sorted(glob.glob(f'{root}/data/school-deep/*.json')):
    d = json.load(open(f)); s = d['slug']; h = open(f'{root}/site/{s}').read(); isl = d['subject'] == 'ISL'
    for k in ('task', 'condition', 'standard'):
        if len(d.get(k, '')) < 30: gaps['no ' + k].append(s)
    if len(d.get('rubric', [])) < 4 or any(len(r) < 4 for r in d['rubric']): gaps['rubric thin'].append(s)
    if len(d['checks']) != 10: gaps['checks not 10'].append(s)
    for m in d['modules']:
        u = f"{s}#{m['n']}"
        v = m['outcome'].split()[0].lower()
        if V and v not in verbs: gaps['outcome verb not in verbs.json'].append(u + ' ' + v)
        if m['bloom'] not in h: gaps['bloom missing on page'].append(u)
        if len(m.get('example', '')) < 60: gaps['no worked example'].append(u)
        if not isl and not m.get('steps'): gaps['no step working'].append(u)
        if len(m.get('points', [])) < 3: gaps['few points'].append(u)
        if len(m.get('standard', '')) < 30: gaps['no unit standard'].append(u)
        if len(m.get('activity', '')) < 30: gaps['no activity'].append(u)
    if 'Slide 7.' not in h and not isl: gaps['ladder not 7 slides'].append(s)
    if h.count('<strong>Notes:</strong>') < 7 and not isl: gaps['ladder notes < 7'].append(s)
    if isl and 'L1' not in h: gaps['isl ladder table missing'].append(s)
    if not isl and 'where this leads' not in h and 'Next course' not in h: gaps['no next steps'].append(s)
    if not isl and 'pathways.html' not in h: gaps['no pathways link'].append(s)
    if 'Rubric' not in h and 'rubric' not in h: gaps['rubric not on page'].append(s)
    if 'L%d' % d['level'] not in h: gaps['level not shown'].append(s)
    for m in d['modules']:
        if not isl and 'Covered in unit' not in h: gaps['no unit tags'].append(s); break
print({k: len(v) for k, v in gaps.items()} or 'no gaps')
for k, v in gaps.items(): print(k, v[:6])
json.dump(gaps, open(os.environ.get('OUT', os.path.join(__import__('tempfile').gettempdir(), 'spec-gaps.json')), 'w'))
