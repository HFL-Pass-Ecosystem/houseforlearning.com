#!/usr/bin/env python3
"""CPD course pages (36 = 12 sectors x 3) from data/cpd-courses.txt. No fee shown (owner sets fees). Process skills only: no clinical, legal, tax or financial advice."""
import sys, pathlib, html, re, collections
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import cpd_detail as CD
MM = CD.load_modmap()
DET = CD.load()
e = html.escape; R = B.R
rows = [l.rstrip('\n').split('|', 5) for l in (R / 'data' / 'cpd-courses.txt').read_text().splitlines() if l and not l.startswith('#')]
slug = lambda t: 'cpd-' + re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')[:60] + '.html'
CS = []
for idx, (sec_, title, lv, hrs, desc, rest) in enumerate(rows):
    outs, agenda = rest.rsplit('|', 1)
    outcomes = [o.split('|') for o in outs.split('##')]
    CS.append(dict(code=CD.CODES[idx], sector=sec_, title=title, lv=int(lv), hrs=hrs, desc=desc, outs=outcomes, agenda=agenda.split(';')))
LV = {3: 'L3 Foundation', 4: 'L4 Practitioner', 5: 'L5 Specialist'}
SAFE = 'These courses teach process, communication and recording. They give no clinical, legal, tax, financial or engineering sign-off. A named subject expert must review every line, and you must check your own professional body\'s current CPD rules, before you rely on a certificate.'

def _low(x): return x[:1].lower() + x[1:] if x else x
def learn_text(c, title, std):
    """Topic-specific Learn line: built from this course's own module title, standard and sector (no text shared between courses)."""
    base = f'Study the rule, checklist or template behind "{title}" in {c["sector"].lower()} work, then follow one worked example of it in a real setting for "{_low(c["title"])}".'
    return base + (f' By the end you can do this: {_low(std).rstrip(".")}.' if std else '')
def practise_text(c, i, title=''):
    n = len(c['outs'])
    v, t, cn, st = c['outs'][min(i, n) - 1]
    tl = (title or '').strip().lower()
    if tl.startswith('practice'):
        names = '; '.join(f'{_low(o[0])} {o[1]}' for o in c['outs'])
        return f'Run one full practice round for "{_low(c["title"])}" on a case card or template: work through each outcome in turn ({names}).'
    if tl.startswith('check'):
        return f'Take the end check for "{_low(c["title"])}": show that you can {_low(v)} {t}, {cn}, {st}, and meet every outcome standard above.'
    again = f' Use a new case this time (round {(i-1)//n+1}).' if i > n else ''
    return f'Practise with a case card or template: {_low(v)} {t}, {cn}, {st}.{again}'

def build(c):
    outs = ''.join(f'<li><span class="bz">{e(v)}</span> {e(t)}, {e(cn)}, {e(s)}.</li>' for v, t, cn, s in c['outs'])
    ag = ''
    for i, a in enumerate(c['agenda'], 1):
        ag += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Session {i}</span> {e(a)}</summary>'
               f'<p><strong>Learn:</strong> {e(learn_text(c, a, None))}</p>'
               f'<p><strong>Practise:</strong> {e(practise_text(c, i))}</p>'
               f'<p><strong>Check:</strong> a short pass or not-yet check using the standard in the outcome.</p></details>')
    det = dict((k, v) for k, v in DET[c['code']]['detail']); fl = dict((k, v) for k, v in DET[c['code']]['flag'])
    mods = CD.modules(fl.get('Modules', []))
    mm = MM.get(c['code']); stds = mm['standards'] if mm else None
    if mm: assert len(stds) == len(mods), c['code']
    if mods:
        ag = ''
        for i, (mt, mn) in enumerate(mods, 1):
            ag += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(mt)} <span class="pill">{e(mn)} min</span></summary>'
                   f'<p><strong>Learn:</strong> {e(learn_text(c, mt, stds[i-1] if stds else None))}</p>'
                   f'<p><strong>Practise:</strong> {e(practise_text(c, i, mt))}</p>'
                   + (f'<p><strong>Standard to meet.</strong> {e(stds[i-1])}</p>' if stds else '') + '</details>')
    extra = ''
    for k, v in DET[c['code']]['detail']:
        if k.startswith('Check'): continue
        extra += f'<div class="wk"><h3>{e(k)}</h3>{CD.render_lines(v)}</div>'
    cc2 = fl.get('Case card 2')
    if cc2: extra += f'<div class="wk"><h3>Case card 2</h3>{CD.render_lines(cc2)}</div>'
    ck1 = ''; n1 = 0; ck2 = ''; n2 = 0
    chk = mm['checks'] if mm else None
    def tg(lst, off):
        n = len(re.findall(r'(?:^|\s)\d+\.?\s+(.+?)\s+\*(.+?)\*(?=\s+\d+\.?\s|\s*$)', ' '.join(lst)))
        return None if chk is None else [CD.covered_tag(x, mods, stds) for x in chk[off:off + n]], n
    for k, v in DET[c['code']]['detail']:
        if k.startswith('Check'):
            t1, nn = tg(v, 0); ck1, n1 = CD.checks_html(v, t1)
    mr = fl.get('More checks', [])
    t2, _ = tg(mr, n1) if mr else (None, 0)
    ck2, n2 = CD.checks_html(mr, t2)
    if chk is not None: assert len(chk) == n1 + n2, c['code']
    gl = fl.get('Glossary')
    practice = B.sec('', 'pr', 'practice', 'Worked example and case cards', extra) if extra else ''
    checks = B.sec('alt', 'ck', 'checks', f'{n1 + n2} check questions with model answers', ck1 + ck2) if (n1 + n2) else ''
    gloss = B.sec('', 'gl', 'glossary', 'Words used in this course', CD.render_lines(gl)) if gl else ''
    rub = B.sec('alt', 'rb', 'marking', 'How the practice and assessment are marked', '<table class="rubric"><tr><th>Level</th><th>Meaning</th><th>Marks of 4</th></tr><tr><td>Secure</td><td>Meets the standard in the outcome every time, no prompts</td><td>4</td></tr><tr><td>Meeting</td><td>Meets the standard with one small slip, corrected when prompted</td><td>3</td></tr><tr><td>Developing</td><td>Meets part of the standard; needs a re-attempt</td><td>2</td></tr><tr><td>Not yet</td><td>Standard not met</td><td>1</td></tr></table><p>Pass = average 3 or more, and no outcome at 1. You may re-attempt after feedback. The subject expert sets any stricter pass mark.</p>')
    body = (B.sec('', 'ab', 'about this course', 'What you will be able to do',
                  f'<div class="cb-facts"><span class="pill lv">{LV[c["lv"]]}</span><span class="pill">About {e(c["hrs"])} hours of CPD</span><span class="pill">Self-study plus role-play</span><span class="pill">{e(c["sector"])}</span></div>'
                  f'<p class="kit-intro">{e(c["desc"])}</p><ul class="blm">{outs}</ul><p class="ws-note">{e(SAFE)}</p>')
            + B.sec('alt', 'ag', 'sessions', f'{len(mods) or len(c["agenda"])} modules' if mods else f'{len(c["agenda"])} sessions', ag)
            + practice + checks + gloss + rub
            + B.sec('', 'as', 'assessment and certificate', 'How you are checked',
                    '<p>Each outcome is checked against its standard with a checklist or a short test. A digital CPD record shows the hours. Keep evidence in My page. Aligned with common CPD practice; not accredited. Learners check their own body\'s rules.</p>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Use your own body\'s forms, units and currency. Local professional bodies set the rules for CPD hours; check them first.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Personal data: {e(L["data"])}. Credit and levels: {e(L["frame"])}.</p></details>' for L in B.LOC)
                    + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft CPD course. Published only on the owner\'s yes. No fee is shown.</p><p><a class="btn" href="cpd.html">All CPD courses</a></p>'))
    B.page(slug(c['title']), c['title'] + ' (CPD)', c['desc'][:150], c['title'], e(c['desc']), body, B.crumb(('Courses', 'courses-hub.html'), ('CPD', 'cpd.html'), (c['sector'], None)), kicker='CPD · ' + c['sector'])
for c in CS: build(c)
by = collections.OrderedDict()
for c in CS: by.setdefault(c['sector'], []).append(c)
hub = ''.join(B.sec('alt' if i % 2 else '', f'x{i}', 'sector', s, '<ul class="cgrid">' + ''.join(f'<li class="cc"><a href="{slug(c["title"])}"><span class="pill lv">{LV[c["lv"]]}</span><h3>{e(c["title"])}</h3><p>{e(c["desc"])}</p><p class="cm">About {e(c["hrs"])} h</p></a></li>' for c in l) + '</ul>') for i, (s, l) in enumerate(by.items()))
B.page('cpd.html', 'CPD courses by profession', '36 CPD courses across 12 professions', 'CPD: courses for 12 professions', e('Continuing professional development, built to task, condition and standard. 36 courses.'),
       hub + B.sec('', 'sf', 'safety', 'Read this first', f'<p>{e(SAFE)}</p>'), B.crumb(('Courses', 'courses-hub.html'), ('CPD', None)), kicker='CPD')
print('cpd courses', len(CS))
