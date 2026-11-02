#!/usr/bin/env python3
"""Enterprise software courses (7), flagship structure. Own words; generic titles; no vendor names on pages."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import ent_data as D
import ent_data2  # adds role tracks and LMS/EMS courses
import json
X = pathlib.Path(__file__).resolve().parents[1] / 'data' / 'enterprise'
e = html.escape

def covered(i, m):
    """Tag derived from data: each self-check question is generated from module i of c['mods'] (its answer text is that module's intro and standard), so number, title (m[1]) and standard (m[8]) come from that same module tuple."""
    return f'(Covered in module {i}: {m[1]}. To pass that module: {m[8].rstrip().rstrip(".")}.)'

def build(c):
    x = json.load(open(X / (c['slug'] + '.json')))
    t8, b8, h8, i8, p8, e8, a8, s8 = x['module8']
    c = dict(c, mods=list(c['mods']) + [(7, t8, b8, h8, i8, p8, e8, a8, s8, [(t8 + ': the idea', i8), (t8 + ': your turn', a8)])])
    mods = ''
    total = sum(m[3] for m in c['mods'])
    for i, (lv, t, bl, h, intro, pts, ex, act, std, slides) in enumerate(c['mods'], 1):
        sl = ''.join(f'<li><strong>Slide {j}: {e(st)}{'' if st[-1:] in '?!' else '.'}</strong> <em>Speaker note:</em> {e(sn)}</li>' for j, (st, sn) in enumerate(slides, 1))
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span><span class="pill lv">{D.LV[lv]}</span></summary>'
                 f'<p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div>'
                 f'<p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p>'
                 f'<h3>Slides with notes</h3><ol class="slides">{sl}</ol></details>')
    assert len(x['quiz']) == 10 and len(x['ladder']) == 7 and len(x['quiz_module']) == 10 and set(x['quiz_module']) == set(range(1, 9)), c['slug']
    quiz = ''.join(f'<details class="mod"><summary>Q{i}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)} {e(covered(n, c["mods"][n-1]))}</p></details>' for i, ((q, a), n) in enumerate(zip(x['quiz'], x['quiz_module']), 1))
    ladder = ''.join(f'<details class="mod"><summary><span class="mn">Slide {i}</span> {D.LV[i]}: {e(t)}</summary><p>{e(b)}</p><p class="ws-note"><strong>Speaker notes.</strong> {e(n)}</p></details>' for i, (t, b, n) in enumerate(x['ladder'], 1))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           '<tr><th scope="row">Accuracy</th><td>Steps wrong</td><td>Steps right on practice data</td><td>Right and explained to a peer</td></tr>'
           '<tr><th scope="row">Evidence</th><td>No records</td><td>Records for each module</td><td>Records and a lessons note</td></tr>'
           '<tr><th scope="row">Safety and privacy</th><td>Real data used</td><td>Practice data only</td><td>Rules written for others</td></tr>'
           '<tr><th scope="row">Standard</th><td>Misses the standard</td><td>Meets every module standard</td><td>Meets and improves it</td></tr></tbody></table></div>')
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in c['jobs']) + '</ul>'
    outs = [(m[2], f'{m[2]} : {m[1].lower()}.') for m in c['mods']]
    top = (f'<div class="cb-facts"><span class="pill lv">L1 to L7 ladder</span><span class="pill">{total}:00 h of lessons plus practice and sharing</span>'
           '<span class="pill">Self-paced with peer circle</span></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(c["short"])} Finish all 8 modules on a practice set-up.</p></div>'
        '<div><h4>Condition</h4><p>A free trial or practice account, practice data only (never real customer data), a peer circle and a mentor for the final review.</p></div>'
        '<div><h4>Standard</h4><p>Every module standard is met; records are kept; a peer and a mentor rate the work \'Meets\' or better on the rubric.</p></div></div>'
        f'<p><strong>Who it is for:</strong> {e(c["who"])} <strong>Requirements:</strong> a computer and internet. <strong>Materials:</strong> slides with notes, worked examples, activities, quiz, rubric.</p>'
        '<p><strong>How the ladder works:</strong> modules climb from L1 (remember) to L7 (create); the ladder section shows each level as a slide. Take them in order; the first three suit new learners, 4 and 5 suit practitioners, 6 and 7 suit advanced staff.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
        + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: your records from each activity. A peer and a mentor mark it. Pass: no criterion at \'Not yet\'.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
        + B.sec('alt', 'lad', 'levels L1 to L7', 'The ladder, slide by slide', '<p>Seven slides, one per level. Open each for the slide text and the speaker notes.</p>' + ladder)
        + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', jobs + '<p>Next courses: data skills, process improvement, a sector course for your target employer.</p>')
        + B.sec('', 'lc', 'ten locations and global', 'Your place', '<p>Local law changes how you store customer data and issue invoices. Check it for your place first.</p>'
                + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Use {L["cur"]} for amounts. Personal data rule: {e(L["data"])}. Skills frame to cite: {e(L["frame"])}.</p></details>' for L in B.LOC))
        + B.sec('alt', 'nx', 'next', 'Draft', '<p class="ws-note">Draft course. Written in our own words from our own training outlines; no third-party text is used. Not live.</p><p><a class="btn" href="b2b.html">More courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    fn = f'learn-{c["slug"]}.html'
    B.page(fn, c['title'], c['short'], c['title'], e(c['short']), body, B.crumb(('Courses', 'courses-hub.html'), ('Enterprise software', None)), kicker='enterprise software course')
    return fn

if __name__ == '__main__':
    fns = [build(c) for c in D.COURSES]
    idx = ''.join(f'<li><a href="{fn}">{e(c["title"])}</a>: {e(c["short"])}</li>' for fn, c in zip(fns, D.COURSES))
    body = B.sec('', 'ix', 'enterprise software', 'Full courses', f'<ul>{idx}</ul><p class="ws-note">Draft. Not live.</p>')
    B.page('enterprise-software.html', 'Enterprise Software Courses', 'Full courses on business software, from L1 to L7.', 'Enterprise Software Courses', 'Full courses on business software, from L1 to L7.', body, B.crumb(('Courses', 'courses-hub.html'), ('Enterprise software', None)))
    print(len(fns), 'built')
