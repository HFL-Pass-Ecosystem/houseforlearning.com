#!/usr/bin/env python3
"""Builds the Executive MBA subject library: site/emba.html (hub) and site/emba-01.html .. emba-19.html (one page per subject).
The 19 subjects and their chapters follow the programme register (EMBA Programme / 04 Curriculum and open library / curriculum.json).
Teaching text is our own, in tools/emba_data_a.py, emba_data_b.py and emba_data_c.py. No school, author, case or company names.

Every subject page meets the flagship standard used by tools/audit_course_pages.py: task, condition, standard; one part per chapter
with a Bloom label and a worked example; ten checks with model answers tagged to a part; an L1 to L7 ladder of seven slides with
speaker notes; a rubric; and the jobs it leads to.

Free entry: the three pre-programme subjects (01 to 03) are free for everyone. In every other subject, Part 1 is a free preview
(assets/access.js locks the rest until the test payment). Every part offers "Listen", "Speak your answer" and a typing box
(assets/emba.js), and a See / Hear / Do / Read-and-write route. Draft: noindex. Run: python3 tools/build_emba.py"""
import re, html, pathlib, sys
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'
sys.path.insert(0, str(R / 'tools'))
from emba_data_a import S as A
from emba_data_b import S as B
from emba_data_c import S as C
SUBJ = A + B + C
e = html.escape
TERMS = [('PRE', 'Pre-programme, open term'), ('Y1A', 'Year 1, term A'), ('Y1B', 'Year 1, term B'), ('Y1C', 'Year 1, term C'), ('Y1D', 'Year 1, term D'),
         ('Y1E', 'Year 1, term E'), ('Y2A', 'Year 2, term A'), ('Y2B', 'Year 2, term B'), ('Y2C', 'Year 2, term C'), ('Y2D', 'Year 2, term D'),
         ('Y2E', 'Year 2, term E: action project')]
TN = dict(TERMS)
FREE = {'01', '02', '03'}
HUB = 'emba.html'
DRAFT = 'Draft for review. Not live. Credit values are aligned with the European credit system for orientation only and are not an accreditation.'

tpl = (S / 'catalogue.html').read_text()
if 'name="robots"' not in tpl:
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)

def page(fn, title, desc, kicker, h1, lead, body, crumbs, gated):
    t = tpl
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, count=1)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, count=1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, count=1)
    t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li>' + crumbs + '</ol>', t, count=1, flags=re.S)
    main = (f'<main id="main" tabindex="-1"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">{e(kicker)}</p>'
            f'<h1 id="h1">{e(h1)}</h1><p>{lead}</p></div></div></section>{body}</main>')
    t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, count=1, flags=re.S)
    if 'assets/courses.css' not in t:
        t = t.replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="stylesheet" href="assets/site.css">\n<link rel="stylesheet" href="assets/courses.css">', 1)
    if 'assets/emba.css' not in t:
        t = t.replace('<link rel="stylesheet" href="assets/courses.css">', '<link rel="stylesheet" href="assets/courses.css">\n<link rel="stylesheet" href="assets/emba.css">', 1)
    if 'assets/emba.js' not in t:
        t = t.replace('</body>', '<script src="assets/emba.js" defer></script>\n</body>', 1)
    if gated and 'assets/access.js' not in t:
        t = t.replace('</body>', '<script src="assets/access.js" defer></script>\n</body>', 1)
    (S / fn).write_text(t)

def sec(cls, i, kick, h2, inner):
    return (f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p>'
            f'<h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>')

def table(cap, head, rows):
    return ('<div class="scroll-x"><table class="ws-table"><caption>' + e(cap) + '</caption><thead><tr>' + ''.join(f'<th scope="col">{e(h)}</th>' for h in head)
            + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td>{e(c)}</td>') for i, c in enumerate(r)) + '</tr>' for r in rows)
            + '</tbody></table></div>')

def hours(s):
    return round(s['ects'] * 25 / len(s['ch']))

def vark(title):
    t = e(title.lower())
    return ('<ul class="emba-vark">'
            f'<li><strong>See.</strong> Sketch "{t}" as a picture: boxes, arrows and the key number.</li>'
            '<li><strong>Hear.</strong> Press Listen, or explain the worked example aloud to someone.</li>'
            '<li><strong>Do.</strong> Do the activity with your own work or a practice case.</li>'
            '<li><strong>Read and write.</strong> Write the idea in three lines in your own words below.</li></ul>')

def say(key, prompt):
    return (f'<div class="emba-say" data-key="{e(key)}"><p class="emba-q"><strong>Your answer.</strong> {e(prompt)}</p>'
            f'<label class="sr-only" for="t-{e(key)}">Your answer</label><textarea id="t-{e(key)}" rows="3" placeholder="Type here, or press Speak and talk"></textarea></div>')

def subject(s):
    free = s['no'] in FREE
    lab = 'Chapter' if free else 'Part'
    h = hours(s)
    tcs = (f'<div class="tcs"><div><h4>Task</h4><p>{e(s["task"])}</p></div><div><h4>Condition</h4><p>{e(s["cond"])}</p></div>'
           f'<div><h4>Standard</h4><p>{e(s["std"])}</p></div></div><p><strong>Who it is for:</strong> {e(s["who"])}</p>')
    b = sec('', 'r1', 'task, condition, standard', 'What you will be able to do', tcs)
    access = ('<p><strong>Free for everyone.</strong> This pre-programme subject is open to all, with no payment and no sign-in needed. It is a good first step if you are new to study or to computers.</p>'
              if free else
              '<p><strong>Part 1 is free to try.</strong> Read it, listen to it and answer it before you decide. Join the programme, or this subject on its own, to open the other parts.</p>')
    how = (access + '<ul class="emba-vark"><li><strong>Listen.</strong> Every part has a Listen button that reads it aloud.</li>'
           '<li><strong>Speak or type.</strong> Answer each part by talking (press Speak) or by typing. Your answers stay on this device only.</li>'
           '<li><strong>Learn your way.</strong> Every part has a See, Hear, Do and Read-and-write route. Not sure which suits you? Take the '
           '<a href="emba-02.html#vark-check">eight-question learning-style check</a>.</li></ul>')
    b += sec('alt', 'r0', 'how this subject works', 'Free entry, voice and your learning style', how)
    parts = ''
    for k, (ct, bloom, lede, pts, ex, act, std) in enumerate(s['ch'], 1):
        parts += (f'<details class="mod"{" open" if k == 1 else ""} id="p{k}"><summary><span class="mn">{lab} {k}</span> {e(ct)} <span class="pill">{h} h</span>'
                  f'<span class="pill bz">{e(bloom)}</span></summary><div class="emba-part">'
                  f'<p>{e(lede)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                  f'<p><strong>Worked example:</strong> Worked-example figures, in your currency. {e(ex)}</p>'
                  f'<p><strong>Activity:</strong> {e(act)}</p><p><strong>Standard:</strong> {e(std)}</p>'
                  f'<h4>Learn your way</h4>{vark(ct)}'
                  + ('<div id="vark-check" class="emba-vk" aria-live="polite"><p><strong>Learning-style check.</strong> Eight quick questions. It works without a computer too: read them aloud and count your answers on paper.</p></div>' if s['no'] == '02' and k == 1 else '')
                  + say(f'emba-{s["no"]}-{k}', act) + '</div></details>')
    b += sec('', 'r2', f'{len(s["ch"])} {lab.lower()}s', f'The {lab.lower()}s, with worked examples', parts)
    names = {k: ct for k, (ct, *_r) in enumerate(s['ch'], 1)}
    chk = '<ol>' + ''.join(f'<li><strong>Q{n}. {e(q)}</strong><br>Model answer: {e(a)} <em>(Covered in {lab.lower()} {c}: {e(names[c])}.)</em></li>'
                           for n, (q, a, c) in enumerate(s['chk'], 1)) + '</ol>'
    b += sec('alt', 'r3', 'ten checks', 'Check yourself', '<p>Say or write your answer first, then read the model answer.</p>' + chk)
    lad = '<ol class="lad">' + ''.join(
        f'<li><strong>Slide {n}: L{n} {e(t)}.</strong> {e(x)} <em>Speaker note:</em> Say: put "{e(t.lower())}" in one sentence and give one example from work. '
        f'Check: ask one learner to say it back in their own words. Mistake: moving on before the numbers are clear.</li>'
        for n, (t, x) in enumerate(s['lad'], 1)) + '</ol>'
    b += sec('', 'r4', 'slides L1 to L7', 'The seven-level ladder, slide by slide', lad)
    rub = table('Marking rubric (Not yet, Meets, Exceeds)', ['Criterion', 'Not yet', 'Meets', 'Exceeds'], [
        ('Accuracy', 'Several figures or facts are wrong.', 'Main figures are correct and the working is shown.', 'Figures are correct and checked a second way.'),
        (f'Use of {s["title"].lower()} tools', 'Tools are named but not used.', 'The right tools are used for each step.', 'Tools are adapted to the case and their limits are stated.'),
        ('Recommendation', 'No clear answer.', 'A clear answer backed by the analysis.', 'A clear answer that also says what would change it.'),
        ('Communication', 'Hard to follow.', 'Answer first, clear and short.', 'Clear, short and persuasive under questions.')])
    b += sec('alt', 'r5', 'how it is judged', 'Marking rubric', rub)
    b += sec('', 'r6', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li><strong>{e(r)}.</strong> {e(d)}</li>' for r, d in s['jobs']) + '</ul>')
    b += sec('alt', 'lg-h', 'language', 'Choose your language',
             '<p>This subject is in English first. Choose any language and the page is translated for you by machine, with the English kept as the official text.</p>'
             '<p><button class="btn" type="button" data-lang-toggle aria-haspopup="dialog" aria-controls="lang-panel" aria-expanded="false">Choose language</button></p>')
    i = SUBJ.index(s)
    prv = SUBJ[i - 1] if i else None; nxt = SUBJ[i + 1] if i + 1 < len(SUBJ) else None
    nav = f'<a class="btn" href="{HUB}">All subjects</a>'
    if prv: nav += f'<a class="btn btn-ghost" href="emba-{prv["no"]}.html">Previous: {e(prv["title"])}</a>'
    if nxt: nav += f'<a class="btn btn-ghost" href="emba-{nxt["no"]}.html">Next: {e(nxt["title"])}</a>'
    b += sec('', 'a3', 'next', 'Keep going', f'<div class="ctas">{nav}</div><p class="ws-note">{e(DRAFT)}</p>')
    lead = f'{e(TN[s["term"]])}. {s["ects"]} ECTS, about {round(s["ects"] * 25)} hours, {len(s["ch"])} {lab.lower()}s.' + (' Free for everyone.' if free else ' Part 1 is free.')
    page(f'emba-{s["no"]}.html', f'{s["title"]}: Executive MBA subject {s["no"]}', f'{s["title"]}: an Executive MBA subject with worked examples, checks, voice and typing.',
         'executive MBA subject ' + s['no'], s['title'], lead, b,
         f'<li><a href="{HUB}">Executive MBA subjects</a></li><li aria-current="page">{e(s["title"])}</li>', gated=not free)

def hub():
    free = ('<ul class="emba-vark">'
            '<li><strong>Start free.</strong> The three pre-programme subjects, Managerial Skills, Individual Skills and Team Skills, are free for everyone. '
            'They suit young people starting out and adults who are new to study or to computers.</li>'
            '<li><strong>Try before you join.</strong> Part 1 of every other subject is free to read, listen to and answer.</li>'
            '<li><strong>Talk or type.</strong> Every part has a Listen button, a Speak button and a typing box. You never have to type if you prefer to talk.</li>'
            '<li><strong>Learn your way.</strong> Every part offers See, Hear, Do and Read-and-write routes. Take the '
            '<a href="emba-02.html#vark-check">learning-style check</a> to find yours.</li>'
            '<li><strong>Pay as you go.</strong> Join the whole programme, or take one subject at a time. Fees are shown at the join step.</li></ul>')
    body = sec('', 'h1a', 'free entry', 'Start free, learn your way', free)
    rows = []
    for code, name in TERMS:
        ss = [s for s in SUBJ if s['term'] == code]
        if not ss: continue
        cards = ''.join(f'<li class="card"><span class="tag">subject {s["no"]}{" · free" if s["no"] in FREE else ""}</span><h3>{e(s["title"])}</h3>'
                        f'<p>{e(s["who"])}</p><p class="note">{s["ects"]} ECTS · {len(s["ch"])} {"chapters" if s["no"] in FREE else "parts"}</p>'
                        f'<a class="more" href="emba-{s["no"]}.html">Open {e(s["title"])}</a></li>' for s in ss)
        rows.append(sec('alt' if len(rows) % 2 == 0 else '', 'h-' + code.lower(), name, name, f'<ul class="cards">{cards}</ul>'))
    body += ''.join(rows)
    tot = sum(s['ects'] for s in SUBJ); nch = sum(len(s['ch']) for s in SUBJ)
    body += sec('', 'h2b', 'the whole programme', 'Programme at a glance',
                table('Executive MBA subjects', ['Subject', 'Term', 'ECTS', 'Parts'], [(f'{s["no"]} {s["title"]}', TN[s['term']], str(s['ects']), str(len(s['ch']))) for s in SUBJ])
                + f'<p>{len(SUBJ)} subjects, {nch} parts, {tot:g} ECTS in the subjects. Take it in 24 months, or at your own pace over 1 to 10 years.</p>'
                '<p><a class="btn btn-ghost" href="executive-programme.html">Executive programme</a> <a class="btn btn-ghost" href="mba/index.html">Online MBA (test)</a></p>'
                f'<p class="ws-note">{e(DRAFT)}</p>')
    page(HUB, 'Executive MBA subjects', 'Nineteen Executive MBA subjects with free entry, voice and typing, and learning-style routes.',
         'executive MBA', 'Executive MBA subjects',
         f'{len(SUBJ)} subjects from first steps to the action project. Start free, listen or read, and answer by speaking or typing.', body,
         '<li aria-current="page">Executive MBA subjects</li>', gated=False)

def main():
    for s in SUBJ:
        assert len(s['chk']) == 10 and len(s['lad']) == 7, s['no']
        assert all(1 <= c <= len(s['ch']) for _q, _a, c in s['chk']), s['no']
        subject(s)
    hub()
    print(len(SUBJ), 'subjects,', sum(len(s['ch']) for s in SUBJ), 'parts, 1 hub written')

if __name__ == '__main__':
    main()
