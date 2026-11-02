#!/usr/bin/env python3
"""Flagship-depth courses for Netherlands (10), Singapore (10), Australia (7).
Own wording. No brand, institution, teacher or person names; no fees. Output: site/learn-flagship-<id>.html (new files only).
Course content lives in flagship_data_nl.py, flagship_data_sg.py, flagship_data_au.py."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape

RUBRIC = [("Evidence quality", "Claims without records", "Records for most claims", "Every claim linked to a dated record"),
          ("Numbers and units", "Missing units or currency", "Correct, units shown", "Correct, with a check calculation"),
          ("Rules and safety", "Rules ignored", "Rules named and followed", "Rules checked with the local authority, note kept"),
          ("User focus", "No real user", "One real user", "Several users, changes made from feedback"),
          ("Reflection", "No lessons written", "Three lessons written", "Lessons turned into a changed plan with dates")]
LADDER = [(1, "L1 Basic", "First contact: words, tools and safety. Short units, about 2 to 6 hours, no record needed."),
          (2, "L2 Awareness", "Explain what the field is and who it serves. Shared with schools and community groups."),
          (3, "L3 Foundation", "Do guided tasks with a checklist. Evidence is a small set of records."),
          (4, "L4 Practitioner", "Run the full task alone with a mentor. This course sits here."),
          (5, "L5 Specialist", "Take one narrow area to depth and teach a peer circle."),
          (6, "L6 Advanced", "Lead a team, design a service or a study, and review other people's evidence."),
          (7, "L7 Super expert", "Set the standard: write the method, audit others, publish worked examples back to learners.")]

def M(t, bl, h, intro, pts, ex, act, std, q, a):
    return dict(t=t, bl=bl, h=h, intro=intro, pts=pts.split('|'), ex=ex, act=act, std=std, q=q, a=a)

def build(c, region):
    mods, quiz = c['mods'], []
    total = sum(m['h'] for m in mods)
    mh = ''
    for i, m in enumerate(mods, 1):
        mh += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(m["t"])} <span class="pill">{m["h"]} h</span><span class="pill bz">{m["bl"]}</span></summary><p>{e(m["intro"])}</p><ul>'
               + ''.join(f'<li>{e(p)}</li>' for p in m['pts']) + '</ul>'
               f'<div class="evi"><strong>Worked example.</strong> {e(m["ex"])}</div><p><strong>Activity.</strong> {e(m["act"])}</p><p><strong>Standard to meet.</strong> {e(m["std"])}</p></details>')
        quiz.append((m['q'], m['a']))
    quiz += [("What is the task of this course, in one sentence?", c['task']),
             ("What standard must your final evidence meet?", c['std'])]
    qh = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(quiz))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(x)}</td><td>{e(d)}</td></tr>' for a, b, x, d in RUBRIC) + '</tbody></table></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">8 modules · {total} h guided</span><span class="pill">Practice 70% · Share 20% · Study 10%</span></div>'
        f'<p class="kit-intro">{e(c["summary"])}</p><ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in c['outcomes']) + '</ul>'
        f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["cond"])}</p></div><div><h4>Standard</h4><p>{e(c["std"])}</p></div></div>'
        f'<p class="ws-note">{e(c["safety"])}</p><p><strong>Requirements:</strong> none. <strong>Who it is for:</strong> learners 16 and over, workers changing field, small-business starters, teams. Currency is shown on every number.</p>')
    ladder = ('<ol class="ws-chips">' + ''.join(f'<li><strong>{n}</strong>: {e(t)}</li>' for k, n, t in LADDER) + '</ol>'
              f'<p>Notes: credits stack and you can step in and out. This course is L4. After it, L5 takes one narrow area of {e(c["title"])} to depth; L6 leads a team; L7 sets and audits the standard. Aligned with, not accredited by, national credit frameworks.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', f'8 modules with worked examples ({total} h guided)', mh)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: your records, numbers and reflections. Two peers and one mentor mark it with this rubric. Pass: no criterion at "Not yet" and at least 70% on the check.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{qh}')
            + B.sec('alt', 'ld', 'where next', 'Ladder L1 to L7, with notes', ladder)
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li>{e(j)}</li>' for j in c['jobs']) + '</ul>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Local custom changes rules, language, currency and who you practise with. Check each rule with your local authority before you act.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Currency: {L["cur"]}. Data rule for what you publish: {e(L["data"])}. Skills frame to cite: {e(L["frame"])}.</p></details>' for L in B.LOC)
                    + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship-depth course. Own wording from the planning booklet; no third-party text. Not live.</p>'))
    fn = f'learn-flagship-{c["id"].lower()}.html'
    B.page(fn, c['title'] + ' (full course)', c['summary'][:150], c['title'], e(c['summary']), body, B.crumb(('Courses', 'courses-hub.html'), (region, None)), kicker=f'{c["id"]} · full course')
    return fn

if __name__ == '__main__':
    import flagship_data_nl, flagship_data_sg, flagship_data_au
    n = 0
    for mod, region in ((flagship_data_nl, 'Netherlands'), (flagship_data_sg, 'Singapore'), (flagship_data_au, 'Australia')):
        for c in mod.C:
            assert len(c['mods']) == 8, c['id']
            build(c, region); n += 1
    print(n, 'courses built')
