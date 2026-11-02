#!/usr/bin/env python3
"""Flagship builds for GL-07..GL-40 (own wording, vendor-neutral). One data file per course in tools/gl_data/glNN.py (each defines C).
Writes site/learn-flagship-gl-NN.html. Run: python3 tools/flagship_gl_b.py"""
import sys, pathlib, html, importlib.util, glob
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import quiz_tag as QT
e = html.escape
SAFE = 'Check your local rules with an adviser before you act for real.'
BL = ['Understand', 'Understand', 'Apply', 'Apply', 'Analyse', 'Create', 'Evaluate', 'Create']
HRS = [4, 6, 8, 8, 8, 10, 6, 4]
OUT = ['Understand', 'Apply', 'Analyse', 'Create', 'Evaluate']
LV = {1: 'L1 Basic', 2: 'L2 Awareness', 3: 'L3 Foundation', 4: 'L4 Practitioner', 5: 'L5 Specialist', 6: 'L6 Advanced', 7: 'L7 Super expert'}

def build(c):
    assert len(c['mods']) == 8 and len(c['quiz']) == 10 and len(c['rubric']) == 5 and len(c['ladder']) == 7 and len(c['outcomes']) == 5, c['id']
    mods = ''
    D = c.get('deep') or {}
    for i, (t, intro, pts, ex, act, std) in enumerate(c['mods'], 1):
        dx = ''
        if c.get('intro_add'): intro = intro + ' ' + c['intro_add'][i-1]
        if D.get('extra'): pts = list(pts) + list(D['extra'][i-1])
        if D:
            mi, e2, sc = D['mods'][i-1]
            dx = (f'<p><strong>Common mistake.</strong> {e(mi)}</p><div class="evi"><strong>Second worked example.</strong> {e(e2)}</div>'
                  f'<p><strong>Check yourself.</strong> {e(sc)}</p>')
        mods += (f'<details class="mod" {"open" if i == 1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{HRS[i-1]} h</span><span class="pill bz">{BL[i-1]}</span></summary>'
                 f'<p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p>{dx}</details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(QT.tag(c["id"], i, a, [m[0] for m in c["mods"]], [m[5] for m in c["mods"]]))}</p></details>' for i, (q, a) in enumerate(c['quiz']))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>Missing, or claimed without a record</td><td>{e(m)}</td><td>{e(x)}</td></tr>' for a, m, x in c['rubric']) + '</tbody></table></div>')
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in c['jobs']) + '</ul>'
    slides = ''.join(f'<details class="mod"><summary>Slide {i}. {LV[i]}: {e(t)}</summary><p><strong>On the slide:</strong> {LV[i]} · {e(t)}</p><p><strong>Notes:</strong> {e(n)}</p></details>' for i, (t, n) in enumerate(c['ladder'], 1))
    deep = ''
    if D:
        gl = '<dl class="gl">' + ''.join(f'<dt>{e(a)}</dt><dd>{e(b)}</dd>' for a, b in D['gloss']) + '</dl>'
        cs = ''.join(f'<details class="mod"><summary>Case {i}. {e(t)}</summary><p>{e(tx)}</p><p><strong>Question:</strong> {e(q)}</p><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (t, tx, q, a) in enumerate(D['cases'], 1))
        deep = B.sec('alt', 'cs', 'case cards and glossary', 'Practise on cases; learn the words', cs + '<h3 class="ws-h3">Glossary</h3>' + gl)
    total = sum(HRS)
    top = (f'<div class="cb-facts"><span class="pill lv">{LV[c["level"]]}</span><span class="pill">{total} h of lessons plus practice</span><span class="pill">About 8 to 12 weeks part-time</span>'
           '</div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + f'<p class="kit-intro">{e(c["summary"])}</p><ul class="blm">'
        + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in zip(OUT, c['outcomes'])) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
        f'<div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["cond"])}</p></div><div><h4>Standard</h4><p>{e(c["std"])}</p></div></div>'
        f'<p><strong>Who it is for:</strong> {e(c["who"])} <strong>Requirements:</strong> {e(c["req"])} <strong>Materials:</strong> lesson text, worked examples, templates, rubric, 10-question check.</p>'
        + (f'<p class="ws-note"><strong>Safety and limits:</strong> {e(c["safety"])}</p>' if c.get('safety') else ''))
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
        + deep + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>{e(c["evidence"])} A mentor and one peer mark it with this rubric. Pass: no criterion at \'Not yet\', and at least 8 of 10 check answers right.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
        + B.sec('alt', 'jb', 'jobs this leads to', 'Where this takes you', jobs + f'<p>Next courses: {e(c["next"])}</p>')
        + B.sec('', 'lc', 'ten locations and global', 'Your place', f'<p>{e(c["local"])} {SAFE}</p>'
                + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Currency: write {L["cur"]} next to every number. Language: {e(L["lang"])}. Personal data law to check: {e(L["data"])}. Level frame: {e(L["frame"])}. Partner to practise with: {e(L["partner"])}.</p></details>' for L in B.LOC))
        + B.sec('alt', 'ld', 'ladder L1 to L7', 'Slide by slide, with notes', '<p>Seven slides, one for each level. Step in at your level and move up; credits stack.</p>' + slides)
        + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording; no outside brand, school or person names. Not live.</p><p><a class="btn" href="courses-hub.html">All courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    B.page(f'learn-flagship-{c["id"].lower()}.html', c['title'] + ' (flagship course)', c['summary'][:150], c['title'], e(c['summary']), body,
           B.crumb(('Courses', 'courses-hub.html'), (c['group'], None)), kicker=f'flagship course · {c["id"]}')

n = 0
for f in sorted(glob.glob(str(pathlib.Path(__file__).parent / 'gl_data' / 'gl*.py'))):
    sp = importlib.util.spec_from_file_location('m', f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    build(m.C); n += 1
print('built', n)
