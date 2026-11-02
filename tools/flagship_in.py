#!/usr/bin/env python3
"""Flagship India location courses (29 topics from data/locations.json 'in'). Own wording; no person, company, school or brand names; no fees.
Data: tools/india_data_*.py each define COURSES = [dict(...)]. Run: python3 tools/flagship_in.py"""
import sys, pathlib, html, glob, importlib.util
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape
LN = ['L1 Basic','L2 Awareness','L3 Foundation','L4 Practitioner','L5 Specialist','L6 Advanced','L7 Super expert']
INL = {}
for _n in 'AB':
    try: INL.update(__import__(f'india_ladder_{_n}').__dict__[f'INL_{_n}'])
    except Exception as _ex: print('skip india ladder', _n, _ex)

def M(title, bloom, h, pts, ex, act, std, q, a): return (title, bloom, h, pts, ex, act, std, q, a)
def booklet(c):
    try:
        import india_booklet as IB
    except Exception:
        return ''
    b = IB.BK.get(c['slug'])
    if not b: return ''
    h = '<p>These routes come from the India pathway tables. They show where this course leads, in my own words.</p>'
    h += '<h3 class="ws-h3">Career role families</h3><ul>' + ''.join(f'<li>{e(r)}</li>' for r in b['roles']) + '</ul>'
    h += f'<p><strong>Ways to work:</strong> {e(b["emp"])} <strong>Who buys:</strong> {e(b["chan"])}'
    if b['journey']: h += f' <strong>Learner journey:</strong> {e(b["journey"])}'
    h += '</p>'
    if b['ax']:
        h += '<div class="scroll-x"><table class="ws-table"><caption>Three subject axes</caption><thead><tr><th>Axis</th><th>Subjects</th><th>What it gives you</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(x)}</td><td>{e(w)}</td></tr>' for a, x, w in b['ax']) + '</tbody></table></div>'
    return B.sec('', 'bk', 'career routes', 'Roles, routes and subjects', h)
def load():
    out = []
    for f in sorted(glob.glob(str(pathlib.Path(__file__).parent / 'india_data_*.py'))):
        s = importlib.util.spec_from_file_location(pathlib.Path(f).stem, f); m = importlib.util.module_from_spec(s); m.M = M; s.loader.exec_module(m)
        for c in m.COURSES:
            idx = [i for i, o in enumerate(out) if o['slug'] == c['slug']]
            if idx: out[idx[0]] = c
            else: out.append(c)
    return out
def build(c, n):
    mods = ''
    for i, (t, bl, h, pts, ex, act, std, q, a) in enumerate(c['mods'], 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    checks = [(m[7], m[8]) for m in c['mods']] + list(c['extra'])
    assert len(checks) == 10 and len(c['mods']) == 8 and len(c['ladder']) == 7, c['slug']
    def _tag(i, a):
        if i < 8:
            m = c['mods'][i]
            return a.rstrip() + f' (Covered in module {i+1}: {m[0]}. To pass that module: {m[6].rstrip().rstrip(".")}.)'
        return a.rstrip() + ' (Covered in: Task, condition and standard, near the top of this page.)'
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(_tag(i, a))}</p></details>' for i, (q, a) in enumerate(checks))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(x)}</td><td>{e(d)}</td></tr>' for a, b, x, d in c['rubric']) + '</tbody></table></div>')
    lad = '<ol class="blm">' + ''.join(f'<li><strong>{LN[i]}.</strong> {e(t)}</li>' for i, t in enumerate(c['ladder'])) + '</ol>'
    sld = INL.get(c['slug'])
    if sld:
        assert len(sld) == 7, c['slug']
        lad += ('<h3 class="ws-h3">Slide by slide</h3><p>Seven slides, one per level. Open each for the slide text and the speaker notes.</p>'
                + ''.join(f'<details class="mod"><summary><span class="mn">Slide {i}</span> {LN[i-1]}: {e(t)}</summary><p>{e(b)}</p><p class="ws-note"><strong>Speaker notes.</strong> {e(n.removeprefix("Notes:").strip())}</p></details>' for i, (t, b, n) in enumerate(sld, 1)))
    total = sum(m[2] for m in c['mods'])
    outs = ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in c['outs'])
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">{e(c["level"])}</span><span class="pill">8 modules · {total} h lessons plus practice</span></div><p>{e(c["summary"])}</p><ul class="blm">{outs}</ul>'
        f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["cond"])}</p></div><div><h4>Standard</h4><p>{e(c["standard"])}</p></div></div>'
        f'<p><strong>Who it is for:</strong> {e(c["who"])} <strong>Requirements:</strong> {e(c["req"])} <strong>Materials:</strong> lesson text, templates, rubric, check with answers.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
        + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: the work product from each module, kept in one folder with dates. A mentor and two peers mark it with this rubric. Pass: no criterion at \'Not yet\'.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
        + B.sec('alt', 'lv', 'seven levels', 'Your ladder, L1 to L7', f'<p>This course sits at {e(c["level"])}. Each level adds to the one below.</p>{lad}')
        + booklet(c) + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li>{e(j)}</li>' for j in c['jobs']) + '</ul>')
        + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Local rules change licences, data handling, pricing words and names of bodies. Check them for your place before you act.</p>'
                + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Currency: {L["cur"]}. Data rule for what you publish: {e(L["data"])}. Skills frame to cite: {e(L["frame"])}.</p></details>' for L in B.LOC)
                + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
        + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording. Not live.</p>'))
    fn = f'learn-flagship-in-{n:02d}-{c["slug"]}.html'
    B.page(fn, c['title'] + ' (flagship course, India)', c['summary'][:150], c['title'], e(c['summary']), body, B.crumb(('Courses', 'courses-hub.html'), ('India flagship', 'learn-flagship-in.html'), (c['title'], None)), kicker='flagship course')
    return fn
def main():
    cs = load(); fns = []
    for n, c in enumerate(cs, 1): fns.append((c, build(c, n)))
    cards = ''.join(f'<li><a href="{fn}">{e(c["title"])}</a> <span class="pill">{e(c["level"])}</span></li>' for c, fn in fns)
    B.page('learn-flagship-in.html', 'India flagship courses', 'Full courses for India.', 'India flagship courses', 'Full courses for the India topics.', B.sec('', 'ix', 'courses', f'{len(fns)} courses', f'<ul>{cards}</ul>'), B.crumb(('Courses', 'courses-hub.html'), ('India flagship', None)), kicker='flagship course')
    print(len(fns), 'courses')
main()
