#!/usr/bin/env python3
"""Flagship builds for GL-01..GL-06 (own wording, vendor-neutral). Data in tools/flagship_data_gl_a1.py and _a2.py.
Writes site/learn-flagship-gl-01.html ... gl-06.html. Run: python3 tools/flagship_gl_a.py"""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import quiz_tag as QT
from flagship_data_gl_a1 import COURSES as C1
from flagship_data_gl_a2 import COURSES as C2
from flagship_data_gl_a_ladder import LADDER
LV = {1: 'L1 Basic', 2: 'L2 Awareness', 3: 'L3 Foundation', 4: 'L4 Practitioner', 5: 'L5 Specialist', 6: 'L6 Advanced', 7: 'L7 Super expert'}
e = html.escape
SAFE_DEFAULT = 'Check your local rules with an adviser before you act for real.'

def build(c):
    mods = ''
    total = 0
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(c['modules'], 1):
        total += h
        mods += (f'<details class="mod" {"open" if i == 1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} '
                 f'<span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>'
                 + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div>'
                 f'<p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(QT.tag(c["id"], i, a, [m[0] for m in c["modules"]], [m[7] for m in c["modules"]]))}</p></details>' for i, (q, a) in enumerate(c['quiz']))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(m)}</td><td>{e(d)}</td></tr>' for a, b, m, d in c['rubric']) + '</tbody></table></div>')
    ld = LADDER[c['id']]; assert len(ld) == 7
    slides = ''.join(f'<details class="mod"><summary>Slide {i}. {LV[i]}: {e(t)}</summary><p><strong>On the slide:</strong> {LV[i]} · {e(t)}</p><p><strong>Notes:</strong> {e(n)}</p></details>' for i, (t, n) in enumerate(ld, 1))
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in c['jobs']) + '</ul>'
    top = (f'<div class="cb-facts"><span class="pill lv">{e(c["level"])}</span><span class="pill">{total} h of lessons plus practice</span>'
           f'<span class="pill">{e(c["length"])}</span></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + f'<p class="kit-intro">{e(c["summary"])}</p><ul class="blm">'
        + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in c['outcomes']) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
        f'<div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["condition"])}</p></div><div><h4>Standard</h4><p>{e(c["standard"])}</p></div></div>'
        f'<p><strong>Who it is for:</strong> {e(c["who"])} <strong>Requirements:</strong> {e(c["req"])} <strong>Materials:</strong> lesson text, worked examples, templates, rubric, 10-question check.</p>'
        + (f'<p class="ws-note"><strong>Safety and limits:</strong> {e(c["safety"])}</p>' if c.get('safety') else ''))
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>{e(c["evidence"])} A mentor and one peer mark it with this rubric. Pass: no criterion at \'Not yet\', and at least 8 of 10 check answers right.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + B.sec('alt', 'ld', 'ladder L1 to L7', 'Slide by slide, with notes', '<p>Seven slides, one for each level. Step in at your level and move up; credits stack.</p>' + slides)
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', jobs + f'<p>Next courses: {e(c["next"])}</p>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', f'<p>{e(c["local"])} {SAFE_DEFAULT}</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Currency: write {L["cur"]} next to every number. Language: {e(L["lang"])}. Personal data law to check: {e(L["data"])}. Level frame: {e(L["frame"])}. Partner to practise with: {e(L["partner"])}.</p></details>' for L in B.LOC)
                    + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording; no outside brand, school or person names. Not live.</p><p><a class="btn" href="courses-hub.html">All courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    B.page(f'learn-flagship-{c["id"].lower()}.html', c['title'] + ' (flagship course)', c['summary'][:150], c['title'], e(c['summary']), body,
           B.crumb(('Courses', 'courses-hub.html'), (c['group'], None)), kicker=f'flagship course · {c["id"]}')

for c in C1 + C2: build(c)
print('built', len(C1 + C2))
