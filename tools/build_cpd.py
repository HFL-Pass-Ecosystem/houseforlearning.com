#!/usr/bin/env python3
"""CPD course pages (36 = 12 sectors x 3) from data/cpd-courses.txt. No fee shown (owner sets fees). Process skills only: no clinical, legal, tax or financial advice."""
import sys, pathlib, html, re, collections
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import cpd_detail as CD
MM = CD.load_modmap()
DET = CD.load()
FULL = CD.load_full()
e = html.escape; R = B.R
rows = [l.rstrip('\n').split('|', 5) for l in (R / 'data' / 'cpd-courses.txt').read_text().splitlines() if l and not l.startswith('#')]
slug = lambda t: 'cpd-' + re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')[:60] + '.html'
CS = []
for idx, (sec_, title, lv, hrs, desc, rest) in enumerate(rows):
    outs, agenda = rest.rsplit('|', 1)
    outcomes = [o.split('|') for o in outs.split('##')]
    CS.append(dict(code=CD.CODES[idx], sector=sec_, title=title, lv=int(lv), hrs=hrs, desc=desc, outs=outcomes, agenda=agenda.split(';')))
def fmt_time(mins):
    h, m = divmod(int(mins), 60)
    return f'{h} h {m} min' if h and m else (f'{h} h' if h else f'{m} min')
for _c in CS:
    _f = FULL.get(_c['code'])
    if _f: _c['hrs'] = fmt_time(sum(int(m['min']) for m in _f['modules']))
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
    on = f' for "{_low(title.strip())}"' if title and title.strip() else ''
    return f'Practise with a case card or template{on}: {_low(v)} {t}, {cn}, {st}.{again}'

def build(c):
    outs = ''.join(f'<li><span class="bz">{e(v)}</span> {e(t)}, {e(cn)}, {e(s)}.</li>' for v, t, cn, s in c['outs'])
    ag = ''
    for i, a in enumerate(c['agenda'], 1):
        ag += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Session {i}</span> {e(a)}</summary>'
               f'<p><strong>Learn:</strong> {e(learn_text(c, a, None))}</p>'
               f'<p><strong>Practise:</strong> {e(practise_text(c, i, a))}</p>'
               f'<p><strong>Check:</strong> a short pass or not-yet check using the standard in the outcome.</p></details>')
    det = dict((k, v) for k, v in DET[c['code']]['detail']); fl = dict((k, v) for k, v in DET[c['code']]['flag'])
    mods = CD.modules(fl.get('Modules', []))
    F = FULL.get(c['code'])
    if F:
        assert len(F['modules']) == 8 and len(F['slides']) == 7, c['code']
        mods = [(m['t'], str(m['min'])) for m in F['modules']]
    mm = MM.get(c['code']); stds = [m['std'] for m in F['modules']] if F else (mm['standards'] if mm else None)
    if mm and not F: assert len(stds) == len(mods), c['code']
    if mods:
        ag = ''
        for i, (mt, mn) in enumerate(mods, 1):
            ag += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(mt)} <span class="pill">{e(mn)} min</span></summary>'
                   + (f'<ul>' + ''.join(f'<li>{e(x)}</li>' for x in F['modules'][i-1]['pts']) + f'</ul><div class="evi"><strong>Worked example.</strong> {e(F["modules"][i-1]["ex"])}</div>' if F else
                   f'<p><strong>Learn:</strong> {e(learn_text(c, mt, stds[i-1] if stds else None))}</p>')
                   + f'<p><strong>Practise:</strong> {e(practise_text(c, i, mt))}</p>'
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
        n = len(re.findall(r'(?:^|\s)\d+\.?\s+(.+?)\s+\*(.+?)\*(?=\s+\d+\.?\s|\s*$)', ' '.join(l for l in lst if l.strip() != '---')))
        return None if chk is None else [CD.covered_tag(x, mods, stds) for x in chk[off:off + n]], n
    for k, v in DET[c['code']]['detail']:
        if k.startswith('Check'):
            t1, nn = tg(v, 0); ck1, n1 = CD.checks_html(v, t1)
    mr = fl.get('More checks', [])
    t2, _ = tg(mr, n1) if mr else (None, 0)
    ck2, n2 = CD.checks_html(mr, t2)
    if chk is not None: assert len(chk) == n1 + n2, c['code']
    if F and n1 + n2 == 9:
        x = F['extra_check']; assert 1 <= x['module'] <= 8
        ck2 += (f'<details class="loc"><summary>{CD.inline(x["q"])}</summary><p><strong>Model answer:</strong> {CD.inline(x["a"])} {e(CD.covered_tag(x["module"], mods, stds))}</p></details>'); n2 += 1
    if F: assert n1 + n2 == 10, (c['code'], n1, n2)
    gl = fl.get('Glossary')
    practice = B.sec('', 'pr', 'practice', 'Worked example and case cards', extra) if extra else ''
    checks = B.sec('alt', 'ck', 'checks', f'{n1 + n2} check questions with model answers', ck1 + ck2) if (n1 + n2) else ''
    gloss = B.sec('', 'gl', 'glossary', 'Words used in this course', CD.render_lines(gl)) if gl else ''
    rub = B.sec('alt', 'rb', 'marking', 'How the practice and assessment are marked', '<table class="rubric"><tr><th>Level</th><th>Meaning</th><th>Marks of 4</th></tr><tr><td>Secure</td><td>Meets the standard in the outcome every time, no prompts</td><td>4</td></tr><tr><td>Meeting</td><td>Meets the standard with one small slip, corrected when prompted</td><td>3</td></tr><tr><td>Developing</td><td>Meets part of the standard; needs a re-attempt</td><td>2</td></tr><tr><td>Not yet</td><td>Standard not met</td><td>1</td></tr></table><p>Pass = average 3 or more, and no outcome at 1. You may re-attempt after feedback. The subject expert sets any stricter pass mark.</p>')
    body = (B.sec('', 'ab', 'about this course', 'What you will be able to do',
                  f'<div class="cb-facts"><span class="pill lv">{LV[c["lv"]]}</span><span class="pill">About {e(c["hrs"] if "h" in c["hrs"] or "min" in c["hrs"] else c["hrs"] + " hours")} of CPD</span><span class="pill">Self-study plus role-play</span><span class="pill">{e(c["sector"])}</span></div>'
                  f'<p class="kit-intro">{e(c["desc"])}</p><ul class="blm">{outs}</ul>'
                  + (f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(F["task"])}</p></div><div><h4>Condition</h4><p>{e(F["cond"])}</p></div><div><h4>Standard</h4><p>{e(F["std"])}</p></div></div>' if F else '')
                  + f'<p class="ws-note">{e(SAFE)}</p>')
            + B.sec('alt', 'ag', 'sessions', f'{len(mods) or len(c["agenda"])} modules' if mods else f'{len(c["agenda"])} sessions', ag)
            + practice + checks + gloss + rub
            + (B.sec('alt', 'ld', 'where next', 'Ladder L1 to L7, slide by slide with notes', '<ol class="slides">' + ''.join(f'<li><strong>Slide {j}: {e(sl["t"])}.</strong> <em>Speaker note:</em> {e(sl["note"])}</li>' for j, sl in enumerate(F['slides'], 1)) + f'</ol><p>This course sits at {LV[c["lv"]]}. Credits stack; aligned with, not accredited by, any framework.</p>') if F else '')
            + (B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li>{e(j)}</li>' for j in F['jobs']) + '</ul>') if F else '')
            + B.sec('', 'as', 'assessment and certificate', 'How you are checked',
                    '<p>Each outcome is checked against its standard with a checklist or a short test. A digital CPD record shows the hours. Keep evidence in My page. Aligned with common CPD practice; not accredited. Learners check their own body\'s rules.</p>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Use your own body\'s forms, units and currency. Local professional bodies set the rules for CPD hours; check them first.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Personal data: {e(L["data"])}. Credit and levels: {e(L["frame"])}.</p></details>' for L in B.LOC))
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft CPD course. It opens only after final checks. No fee is shown.</p><p><a class="btn" href="cpd.html">All CPD courses</a></p>'))
    B.page(slug(c['title']), c['title'] + ' (CPD)', c['desc'][:150], c['title'], e(c['desc']), body, B.crumb(('Courses', 'courses-hub.html'), ('CPD', 'cpd.html'), (c['sector'], None)), kicker='CPD · ' + c['sector'])
for c in CS: build(c)
by = collections.OrderedDict()
for c in CS: by.setdefault(c['sector'], []).append(c)
hub = ''.join(B.sec('alt' if i % 2 else '', f'x{i}', 'sector', s, '<ul class="cgrid">' + ''.join(f'<li class="cc"><a href="{slug(c["title"])}"><span class="pill lv">{LV[c["lv"]]}</span><h3>{e(c["title"])}</h3><p>{e(c["desc"])}</p><p class="cm">About {e(c["hrs"] if "min" in c["hrs"] or " h" in c["hrs"] else c["hrs"] + " h")}</p></a></li>' for c in l) + '</ul>') for i, (s, l) in enumerate(by.items()))
B.page('cpd.html', 'CPD courses by profession', '36 CPD courses across 12 professions', 'CPD: courses for 12 professions', e('Continuing professional development, built to task, condition and standard. 36 courses.'),
       hub + B.sec('', 'sf', 'safety', 'Read this first', f'<p>{e(SAFE)}</p>'), B.crumb(('Courses', 'courses-hub.html'), ('CPD', None)), kicker='CPD')
print('cpd courses', len(CS))
