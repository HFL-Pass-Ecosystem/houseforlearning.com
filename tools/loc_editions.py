#!/usr/bin/env python3
"""Local edition of every global sector course for Hong Kong, Georgia/Israel, Cayman Islands, Mexico.
New files only: site/learn-loc-<k>-<NN>.html (75 per place) + site/learn-loc-<k>-hub.html. Own wording; no outside names.
Run: python3 tools/loc_editions.py [hk ge ky mx]"""
import sys, pathlib, html, re, copy
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import flagship_loc_four as F
import build_full_courses as B
import loc_ladder as LL
e = html.escape
def _bz(t): return t if t.lower().endswith(('business', 'businesses')) else t + ' business'

def slug(i): return f'{i:02d}'
def cluster_of(t):
    for k, n, ts in F.CL:
        if t in ts: return k, n
    return 'H', 'People and business support'
def scaled(L, i):
    f = 1 + (i % 5) * 0.25
    price = round(L['price'] * f); var = round(price * (L['var'] / L['price'])); fixed = round(L['fixed'] * (1 + (i % 4) * 0.2) / 100) * 100
    if price - var <= 0: var = price - 1
    return price, var, fixed
def build(L, i, t):
    L = copy.deepcopy(L); k, cn = cluster_of(t)
    if L['k'] == 'ge': L['cur'] = 'GEL'
    L['price'], L['var'], L['fixed'] = scaled(L, i)
    L['item'] = f'a small {t if t.lower().endswith(("business", "businesses")) else t + " business"}'
    mods = F.modules(L)
    reg = k in 'CDG'
    mods[1] = ('Check the fit of this sector', 'Analyse', 4, f'{t} sits in the cluster "{cn}". Judge its fit for {L["name"]} before spending money.',
        [f'Local angle: {L["clus"][k]}', 'Score demand, skills you hold, start-up cost, rules and partner access from 1 to 5.', 'A rules score below 3 makes this a later project.', ('Regulated: planning only. Partner with a licensed firm.' if reg else 'Not on the regulated list, but check any activity licence.')],
        f'Fit table for {t} in {L["name"]}: list three local customer groups, one local competitor type (no names), one rule that could stop you and one partner type. Score each criterion with a reason.',
        f'Write a fit table for {t} with scores and reasons. Ask one local reader to challenge two scores.',
        'Five criteria scored with reasons; one rule risk named; regulated status stated.')
    q = F.quiz(L); q[0] = (f'In which cluster is {t}, and is it regulated?', f'{cn}; ' + ('regulated, so planning only.' if reg else 'not on the regulated list, but check licences.'))
    mh = ''.join(f'<details class="mod" {"open" if j==0 else ""}><summary><span class="mn">Module {j+1}</span> {e(m[0])} <span class="pill">{m[2]} h</span><span class="pill bz">{m[1]}</span></summary><p>{e(m[3])}</p><ul>' + ''.join(f'<li>{e(x)}</li>' for x in m[4]) + f'</ul><div class="evi"><strong>Worked example.</strong> {e(m[5])}</div><p><strong>Activity.</strong> {e(m[6])}</p><p><strong>Standard to meet.</strong> {e(m[7])}</p></details>' for j, m in enumerate(mods))
    qz = ''.join(f'<details class="mod"><summary>Q{j+1}. {e(a)}</summary><p><strong>Model answer:</strong> {e(b)}</p></details>' for j, (a, b) in enumerate(F.tag_quiz(q, mods, {0: 2})))
    rub = '<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in F.rubric(L)) + '</tbody></table></div>'
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in [(f'{t} assistant', f'supports a small {t if t.lower().endswith(("business", "businesses")) else t + " business"} in {L["name"]}')] + L['jobs'][:5]) + '</ul>' + LL.roles_html(t, e)
    about = (f'<div class="cb-facts"><span class="pill lv">L1 to L4 location edition</span><span class="pill">8 modules</span></div>'
        f'<p>{e(t)} from the global list, applied to {e(L["name"])}: local rules, jobs and examples in {e(L["cur"])}.</p><h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Plan a small {e(t)} business for {e(L["name"])} from fit check to launch plan.</p></div>'
        '<div><h4>Condition</h4><p>About six weeks part-time; public sources, two local readers and a mentor.</p></div><div><h4>Standard</h4><p>All module standards met; every claim has a public source and date; mentor and peer mark \'Meets\' or better.</p></div></div>'
        f'<p class="ws-note">{e(F.CHECK)} Draft; not legal, tax, medical or financial advice. All amounts are estimates for planning, not quotes.</p>')
    body = (B.sec('', 'ab', 'about this course', f'{t}: {L["name"]} edition', about) + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mh)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Pass: no criterion at Not yet and 8 of 10 right.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{qz}')
            + B.sec('alt', 'jb', 'jobs', 'Where this takes you', jobs) + B.sec('', 'ld', 'ladder', 'Ladder L1 to L7', F.ladder(L, LL.slides_html(LL.topic_slug(t), L, e))))
    fn = f'learn-loc-{L["k"]}-{slug(i)}.html'
    B.page(fn, f'{t}: {L["name"]} edition', f'{t} applied to {L["name"]}: local rules, jobs and examples in {L["cur"]}.', f'{t}: {L["name"]} edition', e(f'The global course "{t}" with local rules, jobs and examples for {L["name"]}.'), body,
           B.crumb(('Courses', 'courses-hub.html'), (f'{L["name"]} editions', f'learn-loc-{L["k"]}-hub.html'), (t, None)), kicker=f'location edition · {L["k"].upper()}')
    return fn
def hub(L, items):
    L = dict(L)
    if L['k'] == 'ge': L['cur'] = 'GEL'
    lis = ''.join(f'<li><a href="{fn}">{e(t)}</a></li>' for fn, t in items)
    B.page(f'learn-loc-{L["k"]}-hub.html', f'{L["name"]} editions', f'All {len(items)} global courses as {L["name"]} editions.', f'{L["name"]} editions', e(f'Every global course with local rules, jobs and {L["cur"]} examples.'),
        B.sec('', 'ls', 'all courses', f'{len(items)} courses', f'<p><a href="learn-flagship-loc-{L["k"]}.html">Overview edition for {e(L["name"])}</a></p><ul>{lis}</ul>'), B.crumb(('Courses', 'courses-hub.html'), (f'{L["name"]} editions', None)), kicker='location editions')
if __name__ == '__main__':
    want = sys.argv[1:] or [L['k'] for L in F.LOCS]
    for L in F.LOCS:
        if L['k'] not in want: continue
        items = [(build(L, i, t), t) for i, t in enumerate(F.TOPICS, 1)]
        hub(L, items); print(L['k'], len(items))
