#!/usr/bin/env python3
"""Russia flagship courses (HELD for a lawyer's check). Builds files into held/russia/ ONLY, never into site/.
Nothing links to these files. Data: tools/flagship_ru_data_1..5.py (each defines COURSES). Run: python3 tools/flagship_ru.py"""
import sys, pathlib, html, importlib
HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
import build_full_courses as B
e = html.escape
OUT = HERE.parent / 'held' / 'russia'
HELD = ('HELD. This course is built but not offered. A sanctions and licensing check by our lawyer must finish before any '
        'Russian Federation course is linked, published or sold. Do not link this file from any page.')
LV = ['L1 Basic', 'L2 Awareness', 'L3 Foundation', 'L4 Practitioner', 'L5 Specialist', 'L6 Advanced', 'L7 Super expert']
BLOOM = {'Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'}

def check(c):
    errs = []
    if len(c['outcomes']) != 5: errs.append('outcomes!=5')
    if len(c['modules']) != 8: errs.append('modules!=8')
    if len(c['quiz']) != 10: errs.append('quiz!=10')
    if len(c['rubric']) != 5: errs.append('rubric!=5')
    if len(c['ladder']) != 7: errs.append('ladder!=7')
    for m in c['modules']:
        if len(m) != 8 or m[1] not in BLOOM or len(m[4]) < 4: errs.append('bad module ' + m[0])
    for k in ('id', 'title', 'summary', 'task', 'condition', 'standard', 'who', 'req', 'safety', 'jobs', 'next'):
        if not c.get(k): errs.append('missing ' + k)
    return errs

def build(c):
    mods, total = '', 0
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(c['modules'], 1):
        total += h
        mods += (f'<details class="mod" {"open" if i == 1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>'
                 + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(c['quiz']))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(m)}</td><td>{e(d)}</td></tr>' for a, b, m, d in c['rubric']) + '</tbody></table></div>')
    ladder = ('<div class="scroll-x"><table class="ws-table"><caption>Levels L1 to L7 for this sector</caption><thead><tr><th>Level</th><th>What you can do</th></tr></thead><tbody>'
              + ''.join(f'<tr><th scope="row">{LV[i]}</th><td>{e(t)}</td></tr>' for i, t in enumerate(c['ladder'])) + '</tbody></table></div>')
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}</li>' for a, b in c['jobs']) + '</ul>'
    top = f'<div class="cb-facts"><span class="pill lv">{e(c.get("level", "L4 Practitioner"))}</span><span class="pill">{total} h of lessons plus practice</span><span class="pill">HELD</span></div>'
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + f'<p class="kit-intro">{e(c["summary"])}</p><ul class="blm">'
        + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in c['outcomes']) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
        f'<div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["condition"])}</p></div><div><h4>Standard</h4><p>{e(c["standard"])}</p></div></div>'
        f'<p><strong>Who it is for:</strong> {e(c["who"])} <strong>Requirements:</strong> {e(c["req"])} <strong>Materials:</strong> lesson text, worked examples, templates, rubric, 10-question check.</p>'
        f'<p class="ws-note"><strong>Safety and limits:</strong> {e(c["safety"])}</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>{e(c.get("evidence", "Evidence: the records and products from each module."))} A mentor and one peer mark it with this rubric. Pass: no criterion at \'Not yet\', and at least 8 of 10 check answers right.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + B.sec('alt', 'lv', 'levels L1 to L7', 'How this sector grows with you', ladder)
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', jobs + f'<p>Next courses: {e(c["next"])}</p>')
            + B.sec('alt', 'hd', 'held', 'Status', f'<p class="ws-note">{e(HELD)}</p><p>Draft. Own wording; no outside brand, school or person names; no fees.</p>'))
    fn = f'{c["id"].lower()}.html'
    B.S = OUT
    B.page(fn, c['title'] + ' (Russian Federation, HELD)', c['summary'][:150], c['title'], e(c['summary']), body,
           B.crumb(('Held', None), (c['title'], None)), kicker=f'HELD · {c["id"]}')
    p = OUT / fn
    t = p.read_text().replace('href="assets/', 'href="../../site/assets/').replace('src="assets/', 'src="../../site/assets/')
    t = t.replace('<head>', '<head><meta name="robots" content="noindex,nofollow">', 1)
    p.write_text(t)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    allc = []
    for n in range(1, 6):
        try: allc += importlib.import_module(f'flagship_ru_data_{n}').COURSES
        except ModuleNotFoundError: pass
    bad = 0
    for c in allc:
        errs = check(c)
        if errs: bad += 1; print('FAIL', c.get('id'), errs)
        else: build(c)
    print('built', len(allc) - bad, 'of', len(allc))
if __name__ == '__main__': main()
