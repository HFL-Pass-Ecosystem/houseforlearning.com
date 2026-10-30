#!/usr/bin/env python3
"""Builds site/courses.html and one page per course/chapter from data/catalogue.json.
Edit the data file or the wording constants below, then run: python3 tools/build_courses.py
Draft: pages are noindex and carry a draft note until the owner confirms the chapter list and wording."""
import json, re, html, pathlib
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'
D = json.load(open(R / 'data' / 'catalogue.json'))
e = html.escape
# Wording the owner has not yet confirmed: change here only.
L70, L20, L10 = 'Practice (70%)', 'Share and mentoring (20%)', 'Study (10%)'
DRAFT = 'Draft course list. Chapters, wording and lengths may change before opening.'
def outlines():
    out = {}
    src = (R / 'data' / 'lesson-outlines.md').read_text()
    for blk in re.split(r'\n## ', src)[1:]:
        cid = blk.split(' ', 1)[0]
        rows = [[x.strip() for x in l.strip().strip('|').split('|')] for l in blk.splitlines() if re.match(r'\|\s*\d+\s*\|', l)]
        info = {k: v.strip() for k, v in (m.groups() for m in (re.match(r'(Length|Evidence kept in My page|Pass rule \(draft\)|Safety and limits): ?(.*)', l) for l in blk.splitlines()) if m)}
        out[cid] = {'rows': rows, 'info': info}
    return out
OUT = outlines()
tpl = (S / 'catalogue.html').read_text()
tpl = tpl.replace('<meta name="robots" content="index,follow">', '')
if 'name="robots"' not in tpl:
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)

def page(fn, title, desc, h1, lead, body, crumbs):
    t = tpl
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, 1, re.S)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, 1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, 1)
    t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li>' + crumbs + '</ol>', t, 1, re.S)
    main = (f'<main id="main" tabindex="-1"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div>'
            f'<p class="kicker">course catalogue</p><h1 id="h1">{e(h1)}</h1><p>{e(lead)}</p></div></div></section>{body}</main>')
    t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, 1, re.S)
    (S / fn).write_text(t)

def sec(cls, i, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>'
note = f'<p class="ws-note">{e(DRAFT)}</p>'
slug = lambda c: 'course-' + c['id'].lower() + '.html'

def detail(c, kind):
    parts = []
    if c.get('outcome'): parts.append(f'<p class="kit-intro">{e(c["outcome"])}</p>')
    rows = [(L70, c['practice_70']), (L20, c['social_20']), (L10, c['formal_10'])]
    parts.append('<ul class="cards">' + ''.join(f'<li class="card"><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a, b in rows) + '</ul>')
    parts.append('<h3 class="ws-h3">The journey</h3><ol class="ws-chips">' + ''.join(f'<li>{e(j)}</li>' for j in c['journey']) + '</ol>')
    parts.append(f'<p><strong>Length:</strong> {e(c["length"])}.' + (f' <strong>Where:</strong> {e(c["region"])}.' if c.get('region') else '') + '</p>')
    if c.get('contributions_open'): parts.append('<p>Experts and training partners are welcome to contribute to this course. <a href="partner.html">Partner with us</a></p>')
    o = OUT.get(c['id'])
    extra = ''
    if o and o['rows']:
        extra = sec('alt', 'l-h', 'lesson by lesson', 'The nine steps',
            ('<p>' + e(o['info'].get('Length', '')) + '</p>' if o['info'].get('Length') else '')
            + '<div class="scroll-x"><table class="ws-table"><caption>Lesson outline</caption><thead><tr><th scope="col">Step</th><th scope="col">Stage</th><th scope="col">Kind</th><th scope="col">Hours</th><th scope="col">What you do</th></tr></thead><tbody>'
            + ''.join('<tr><th scope="row">' + ''.join(e(x) if i == 0 else '</th><td>' + e(x) if False else '' for i, x in enumerate(r[:1])) + '</th>' + ''.join(f'<td>{e(x)}</td>' for x in r[1:]) + '</tr>' for r in o['rows'])
            + '</tbody></table></div>'
            + ''.join(f'<p><strong>{e(lbl)}:</strong> {e(o["info"][k])}</p>' for k, lbl in [('Evidence kept in My page', 'Kept in My page'), ('Pass rule (draft)', 'To pass (draft)'), ('Safety and limits', 'Limits')] if o['info'].get(k)))
    return sec('', 'c-h', 'how it is taught', 'Practice, sharing and study', ''.join(parts)) + extra + sec('alt', 'n-h', 'next', 'Back to the list', '<p><a class="btn" href="courses.html">All courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>' + note)

for c in D['chapters']:
    page(slug(c), c['title'], c.get('outcome', c['title'])[:150], c['title'], c.get('region', ''), detail(c, 'chapter'),
         '<li><a href="courses.html">Courses</a></li><li aria-current="page">' + e(c['title']) + '</li>')
for c in D['courses']:
    page(slug(c), c['title'], f'{c["title"]}: {c["group"]}', c['title'], c['group'], detail(c, 'course'),
         '<li><a href="courses.html">Courses</a></li><li aria-current="page">' + e(c['title']) + '</li>')

def lst(items):
    return '<ul class="ws-plist cl">' + ''.join(f'<li><a href="{slug(c)}">{e(c["title"])}</a> <small>{e(c["length"].split(",")[0])}</small></li>' for c in items) + '</ul>'
groups = {}
for c in D['courses']: groups.setdefault(c['group'], []).append(c)
body = sec('', 'ch-h', f'{len(D["chapters"])} chapters', 'Chapters to open first', lst(D['chapters']))
for i, (g, items) in enumerate(sorted(groups.items())):
    body += sec('alt' if i % 2 == 0 else '', f'g{i}', f'{len(items)} courses', g, lst(items))
body += sec('', 'how-h', 'how every course is taught', 'Practice first, then share, then study',
            f'<p>Every course mixes {e(L70.lower())}, {e(L20.lower())} and {e(L10.lower())}, and follows the same five-step journey: Idea, Action, Value, Empowerment, Regeneration.</p>' + note)
page('courses.html', 'Courses', 'Draft list of course chapters and courses.', 'Courses', f'{len(D["chapters"])} chapters and {len(D["courses"])} courses, each taught by practice, sharing and study.', body, '<li aria-current="page">Courses</li>')
print('pages:', len(D['chapters']) + len(D['courses']) + 1)
