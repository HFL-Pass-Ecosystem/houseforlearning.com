#!/usr/bin/env python3
"""Flagship global courses GL-41..GL-75. One JSON data file per course in data/flagship/GL-NN.json.
Same layout as build_flagship_cv.py plus an L1-L7 ladder (slide by slide, with notes). Own wording; no fees; draft, noindex.
Run: python3 tools/build_flagship_gl.py [GL-41 ...]  (no args = every file found)"""
import sys, json, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import quiz_tag as QT
e = html.escape
D = pathlib.Path(__file__).resolve().parents[1] / 'data' / 'flagship'
LN = {1:'L1 Basic',2:'L2 Awareness',3:'L3 Foundation',4:'L4 Practitioner',5:'L5 Specialist',6:'L6 Advanced',7:'L7 Super expert'}

def build(c):
    mods = ''
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(c['modules'], 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{e(bl)}</span></summary>'
                 f'<p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div>'
                 f'<p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    total = sum(m[2] for m in c['modules'])
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(QT.tag(c["id"], i, a, [m[0] for m in c["modules"]], [m[7] for m in c["modules"]]))}</p></details>' for i, (q, a) in enumerate(c['quiz']))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(x)}</td><td>{e(d)}</td></tr>' for a, b, x, d in c['rubric']) + '</tbody></table></div>')
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in c['jobs']) + '</ul>'
    ladder = ''.join(f'<details class="mod"><summary><span class="mn">Slide {i}</span> {LN[i]}: {e(t)}</summary><p>{e(body)}</p><p class="ws-note"><strong>Speaker notes.</strong> {e(note)}</p></details>' for i, (t, body, note) in enumerate(c['ladder'], 1))
    top = (f'<div class="cb-facts"><span class="pill lv">{LN[c["level"]]}</span><span class="pill">{total}:00 h of lessons plus practice and sharing</span><span class="pill">Self-paced with peer circle</span></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in c['outcomes']) + '</ul>'
        + '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
        f'<div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["condition"])}</p></div><div><h4>Standard</h4><p>{e(c["standard"])}</p></div></div>'
        f'<p><strong>Who it is for:</strong> {e(c["who"])} <strong>Requirements:</strong> {e(c.get("req","none"))}. <strong>Materials:</strong> lesson text, worked examples, templates, rubric, quiz, tracker.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
        + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Your evidence: {e(c["evidence"])}. Two peers and one mentor mark it with this rubric. Pass: no criterion at \'Not yet\'.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
        + B.sec('alt', 'lad', 'levels L1 to L7', 'The ladder, slide by slide', '<p>Seven slides, one per level. Open each for the slide text and the speaker notes.</p>' + ladder)
        + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', jobs + f'<p>Next courses: {e(c["next"])}</p>')
        + B.sec('alt', 'lc', 'ten locations and global', 'Your place', f'<p>{e(c["local"])}</p>'
                + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Write numbers in {L["cur"]}. Personal data rule: {e(L["data"])}. Skills frame to name in your evidence: {e(L["frame"])}. Consumer rule: {e(L["cons"])}.</p></details>' for L in B.LOC)
                + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>'
                + f'<details class="loc"><summary>Global</summary><p>{e(B.GLOBAL["note"])} Currency: {e(B.GLOBAL["cur"])}.</p></details>')
        + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Written in our own words. Not live. Check local rules with an adviser before you act for real.</p><p><a class="btn" href="b2c.html">More courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    fn = f'learn-flagship-{c["id"].lower()}.html'
    B.page(fn, f'{c["title"]} (flagship course)', c['desc'], c['title'], e(c['desc']), body, B.crumb(('Courses', 'courses-hub.html'), (c['title'], None)), kicker='flagship course')
    return fn

if __name__ == '__main__':
    ids = sys.argv[1:]
    for p in sorted(D.glob('GL-*.json')):
        if ids and p.stem not in ids: continue
        c = json.load(open(p))
        assert len(c['modules']) == 8 and len(c['quiz']) == 10 and len(c['ladder']) == 7 and len(c['rubric']) >= 4, p
        print(build(c))
