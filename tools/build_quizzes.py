#!/usr/bin/env python3
"""Build the final-check quizzes for the LMS from the course pages themselves.
Writes site/assets/quiz/<course>.json (questions only, no answers) and netlify/functions/quizkeys.json (answer keys, server side).
Question kinds: a key idea taken from a module/lesson (distractors come from other modules of the same course),
and, for step-table courses, which kind of work a step is (DO, SHARE or STUDY).
Run:  python3 tools/build_quizzes.py        (safe to re-run; deterministic)"""
import glob, hashlib, html, json, os, re, random

ROOT = os.path.join(os.path.dirname(__file__), '..')
SITE = os.path.join(ROOT, 'site')
OUT = os.path.join(SITE, 'assets', 'quiz')
os.makedirs(OUT, exist_ok=True)
for f in glob.glob(os.path.join(OUT, '*.json')):
    os.remove(f)

def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

def rng(key):
    return random.Random(int(hashlib.sha256(key.encode()).hexdigest()[:12], 16))

def title_of(t):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
    return clean(m.group(1)) if m else ''

def idea_questions(key, units, limit=10):
    """units = [(unit title, [bullets])]. One question per unit, distractors from other units."""
    r = rng(key)
    pool = [(i, b) for i, (_, bl) in enumerate(units) for b in bl]
    qs = []
    for i, (ut, bl) in enumerate(units):
        if not bl:
            continue
        right = bl[0] if len(bl) == 1 else r.choice(bl)
        others = [b for j, b in pool if j != i and b != right and b not in bl]
        if len(others) < 2:
            continue
        r.shuffle(others)
        opts = [right] + others[:3]
        r.shuffle(opts)
        qs.append({'q': f'In "{ut}", which of these is a key idea?', 'o': opts, 'a': opts.index(right)})
    if len(qs) > limit:
        step = len(qs) / limit
        qs = [qs[int(k * step)] for k in range(limit)]
    return qs

def mod_units(t):
    units = []
    for m in re.finditer(r'<details class="mod"[^>]*><summary>(.*?)</summary>(.*?)</details>', t, re.S):
        sm = clean(re.sub(r'<span class="pill">.*?</span>', '', m.group(1)))
        sm = re.sub(r'^(Module|Session|Unit|Part)\s+\d+\s*[-:.]?\s*', '', sm).strip() or sm
        bl = [clean(x) for x in re.findall(r'<li>(.*?)</li>', m.group(2), re.S)]
        units.append((sm, [b for b in bl if 12 <= len(b) <= 160]))
    return units

KINDS = ['DO', 'SHARE', 'STUDY']
def step_questions(key, t, limit=6):
    rows = re.findall(r'<tr><th scope="row">(\d+)</th><td>([^<]*)</td><td>(DO|SHARE|STUDY)</td><td>[^<]*</td><td>(.*?)</td></tr>', t, re.S)
    qs = []
    for n, stage, kind, what in rows:
        w = clean(what)
        if not (25 <= len(w) <= 220):
            continue
        qs.append({'q': f'Step {n}: "{w}" Which kind of work is this? (DO = practise, SHARE = learn with others, STUDY = read and learn.)', 'o': KINDS[:], 'a': KINDS.index(kind)})
    if len(qs) > limit:
        step = len(qs) / limit
        qs = [qs[int(k * step)] for k in range(limit)]
    return qs

pages = {}
for f in sorted(glob.glob(os.path.join(SITE, '*.html'))):
    pages[os.path.basename(f)] = open(f, encoding='utf-8').read()

courses = {}   # key -> (title, questions)
series = {}    # hub file -> {lesson: (title, bullets)}
for name, t in pages.items():
    m = re.search(r'<main[^>]*data-series="([^"]+)"[^>]*data-lesson="(\d+)"[^>]*data-title="([^"]*)"', t)
    if m:
        hub, n, st = m.group(1), int(m.group(2)), html.unescape(m.group(3))
        ul = re.search(r'<ul class="ideas">(.*?)</ul>', t, re.S) or re.search(r'<main.*?<ul[^>]*>(.*?)</ul>', t, re.S)
        bl = [clean(x) for x in re.findall(r'<li>(.*?)</li>', ul.group(1), re.S)] if ul else []
        series.setdefault(hub, {'title': st, 'lessons': {}})['lessons'][n] = (title_of(t), [b for b in bl if 12 <= len(b) <= 160])
        continue
    mods = mod_units(t)
    if len(mods) >= 2:
        qs = idea_questions(name, mods)
        if len(qs) >= 3:
            courses[name] = (title_of(t), qs)
        continue
    if 'Lesson outline' in t and 'class="ws-table"' in t:
        qs = step_questions(name, t)
        if len(qs) >= 3:
            courses[name] = (title_of(t), qs)
for hub, s in series.items():
    units = [(s['lessons'][n][0], s['lessons'][n][1]) for n in sorted(s['lessons'])]
    qs = idea_questions(hub, units)
    if len(qs) >= 3:
        courses[hub] = (s['title'], qs)

keys = {}
for key, (title, qs) in sorted(courses.items()):
    keys[key] = ''.join(str(q['a']) for q in qs)
    with open(os.path.join(OUT, key + '.json'), 'w', encoding='utf-8') as fh:
        json.dump({'course': key, 'title': title, 'pass': 70, 'questions': [{'q': q['q'], 'o': q['o']} for q in qs]}, fh, ensure_ascii=False, separators=(',', ':'))
with open(os.path.join(ROOT, 'netlify', 'functions', 'quizkeys.json'), 'w') as fh:
    json.dump(keys, fh, separators=(',', ':'), sort_keys=True)
print(f'{len(keys)} final checks written')
