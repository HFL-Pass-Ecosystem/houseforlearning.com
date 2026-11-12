#!/usr/bin/env python3
"""Builds the Executive programme pages (24-month online programme and its 14 modules) from the data below.
Draft: noindex. Owner's choice of 11 Nov 2026: a certificate of completion only, no degree words, no academic credit
(no ECTS or other credit values, no master-level or doctoral wording, no credit table)."""
import re, html, pathlib
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'
e = html.escape
tpl = (S / 'catalogue.html').read_text()
if 'name="robots"' not in tpl:
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)
DRAFT = 'Planned. Names and lengths may change before opening.'
CERT = 'These are professional executive programmes with a certificate of completion. They are not university degrees and do not carry academic credit.'

def page(fn, title, desc, h1, lead, body, crumbs):
    t = tpl
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, count=1)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, count=1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, count=1)
    # share tags: the template's are the catalogue page's own
    t = re.sub(r'<meta property="og:title" content=".*?">', lambda m: f'<meta property="og:title" content="{e(title)} | House for Learning">', t, count=1)
    t = re.sub(r'<meta property="og:description" content=".*?">', lambda m: f'<meta property="og:description" content="{e(desc)}">', t, count=1)
    t = re.sub(r'(<meta property="og:url" content="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, count=1)
    t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li>' + crumbs + '</ol>', t, count=1, flags=re.S)
    main = (f'<main id="main" tabindex="-1"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">executive programme</p>'
            f'<h1 id="h1">{e(h1)}</h1><p>{e(lead)}</p></div></div></section>{body}</main>')
    t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, count=1, flags=re.S)
    (S / fn).write_text(t)

def sec(cls, i, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>'
def table(cap, head, rows):
    return ('<div class="scroll-x"><table class="ws-table"><caption>' + e(cap) + '</caption><thead><tr>' + ''.join(f'<th scope="col">{e(h)}</th>' for h in head) + '</tr></thead><tbody>'
            + ''.join('<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if i == 0 else f'<td>{e(c)}</td>') for i, c in enumerate(r)) + '</tr>' for r in rows) + '</tbody></table></div>')
note = f'<p class="ws-note">{e(DRAFT)}</p>'

terms = [('1', 'Months 1 to 4', 'Foundations, self-management and academic standards', 'Executive self-awareness and behavioural dynamics; Academic integrity and executive research standards'),
 ('2', 'Months 5 to 8', 'Framing issues and strategic analysis', 'Managerial diagnostics and client-needs assessment; Strategic positioning and scanning the environment'),
 ('3', 'Months 9 to 12', 'High-impact communication and data visualisation', 'The architecture of persuasion (answer first); Visual storytelling and quantitative reporting'),
 ('4', 'Months 13 to 16', 'Team dynamics, conflict and turnarounds', 'High-performing cross-functional teams; Operational restructuring and turnaround management'),
 ('5', 'Months 17 to 20', 'Emerging markets and business-model innovation', 'Disruptive technologies and emerging-market dynamics; Stakeholder management and large institutional procurement'),
 ('6', 'Months 21 to 24', 'Executive operations capstone', 'Course 11 and the capstone: a structured executive proposal of at most 10 slides, defended live')]
certs = [('Certificate of completion, stage 1', 'Terms 1 and 2 (months 1 to 8)'), ('Certificate of completion, stage 2', 'Terms 1 to 4 (months 1 to 16)'), ('Certificate of completion, full programme', 'All six terms (24 months)')]
practice = [('1', 'Exposure audit, self-management challenge, behaviour decoder, standards adjudication lab, rapid prototyping'), ('2', 'Problem-formulation lab, questioning role-plays, bottleneck triage, competitive war games'),
 ('3', 'Drafting drills, chart-selection challenges, deck restructuring runs'), ('4', 'Saboteur audit, cross-function conflict simulations, turnaround exercises'),
 ('5', 'Pricing sandbox, low-cost hardware challenge, procurement negotiation, integration and offshoring war games, ethics compliance court'), ('6', 'Capstone simulation, 10-slide proposal, live boardroom defence')]
body = (sec('', 'e1', 'six terms of four months', 'The 24 months, term by term', table('Terms and courses', ['Term', 'When', 'Theme', 'Courses'], terms) + '<p>Online, with live video boardroom defences. 11 courses plus a capstone.</p>')
 + sec('alt', 'e2', 'stack as you go', 'Certificates along the way', table('Certificates of completion along the way', ['Certificate', 'Covers'], certs) + '<p>Each certificate stands on its own, and the next one builds on it. ' + e(CERT) + '</p>')
 + sec('', 'e3', 'learn by playing it out', 'Practice in every term', table('Hands-on practice by term', ['Term', 'What you do'], practice))
 + sec('alt', 'e4', 'first term marking', 'How term 1 is assessed', table('Term 1 assessment', ['Part', 'Weight'], [('Individual feedback-analysis audit (2,000 words)', '30%'), ('Group profiling strategy (3,000 words plus a process canvas)', '30%'), ('Live prototyping and integrity defence (10 slides and an oral defence)', '40%')]) + '<p>Grades are given in bands: A for 3.67 to 4.00, B for 2.67 to 3.33, below 2.00 is a fail.</p>')
 + sec('', 'e5', 'shorter option', 'Prefer to take it a module at a time?', '<p>The same ideas are also offered as 14 short, stackable modules of 75 hours each.</p><p><a class="btn" href="executive-modules.html">See the 14 modules</a></p>' + note))
page('executive-programme.html', 'Executive programme, 24 months online', 'A 24-month online executive programme in six terms, with a certificate of completion at each stage.', '24-month online executive programme', 'Six terms, eleven courses and a capstone, taught online with live defences.', body, '<li aria-current="page">Executive programme</li>')

mods = [('1', 'Global exposure audit and distance diagnostics', ['Profile memo 10%', 'Wargame participation 10%', 'Midterm case 20%', 'Governance quiz 20%', 'Market-entry memo 40%']),
 ('2', 'Cultural intelligence and business-to-business negotiation', None),
 ('3', 'Cross-cultural communication and decentering', ['Audit memo 30%', 'Live channel simulation 35%', 'Bilateral video brief 35%']),
 ('3B', 'Escalation, attribution bias and transnational mediation', ['Memo 30%', 'Live mediation 35%', 'Joint governance brief 35%']),
 ('5', 'Semi-globalisation, distance modelling and trade gravity', ['Econometric audit 30%', 'Allocator simulation 35%', 'Board presentation 35%']),
 ('6', 'Rooted cosmopolitanism: adapt, aggregate, arbitrage', None),
 ('7', 'Global mobility, expatriate lifecycle economics and repatriation', None),
 ('8', 'Transnational career architecture and the expatriate balance sheet', None),
 ('9', 'Cross-cultural team dynamics and conflict arbitration', None),
 ('10', 'Operational ethics and cross-cultural moral architecture', None),
 ('11', 'Cross-border ethics, moral reasoning and tamper-proof governance', None),
 ('12', 'Social-contract ethics and multi-sector governance', None),
 ('13', 'Quantitative decision science and the data pipeline', None),
 ('14', 'The accounting equation, linked statements and enterprise assurance', None)]
shared = ['Written memo 30%', 'Live interactive simulation 35%', 'Boardroom presentation 35%']
frame = ['Applied case analysis', 'Simulation arena with a tasks, conditions and standards matrix', 'A yearly refresh of the research', 'Assessment matrix and marking bands (A, B, fail)']
mslug = lambda n: 'executive-module-' + n.lower() + '.html'
rows = ''.join(f'<li><a href="{mslug(n)}">Module {e(n)}: {e(t)}</a></li>' for n, t, _ in mods)
body = (sec('', 'm1', '14 modules', 'Each is 75 hours and stacks', f'<ul class="ws-plist cl">{rows}</ul>')
 + sec('alt', 'm2', 'same four parts every time', 'What each module contains', '<ol class="ws-chips">' + ''.join(f'<li>{e(x)}</li>' for x in frame) + '</ol><p>Each module is 75 hours of study, and each one you complete earns a certificate of completion from House for Learning. ' + e(CERT) + '</p><p>Module 4 is reserved and not yet published.</p>' + note))
page('executive-modules.html', 'Executive modules', 'Fourteen stackable executive modules of 75 hours each.', 'Executive modules', 'Fourteen stackable modules, each 75 hours of study.', body, '<li><a href="executive-programme.html">Executive programmes</a></li><li aria-current="page">Modules</li>')
for n, t, wts in mods:
    ws = wts or shared
    b = (sec('', 'a1', 'what you take', f'Module {n}', f'<ul class="cards"><li class="card"><h3>Size</h3><p>75 hours of study.</p></li><li class="card"><h3>Certificate</h3><p>A certificate of completion from House for Learning when you complete the module. It is not a university degree and does not carry academic credit.</p></li></ul>')
         + sec('alt', 'a2', 'how it is marked', 'Assessment', '<ul class="ws-chips">' + ''.join(f'<li>{e(x)}</li>' for x in ws) + '</ul><p>Marking bands: A, B or fail. Presentations use at most 10 slides, with a short live defence.</p>' + ('' if wts else '<p>Weights shown follow the shared pattern for modules 3 to 14, and will be confirmed.</p>'))
         + '<section class="sec alt" aria-labelledby="lg-h"><div class="wrap"><div class="sec-head"><p class="kicker">language</p><h2 id="lg-h">Choose your language</h2></div><div class="sec-body"><p>This module is in English first. Choose any language in the world and the page is translated for you by machine, with the English kept as the official text.</p><p><button class="btn" type="button" data-lang-toggle aria-haspopup="dialog" aria-controls="lang-panel" aria-expanded="false">Choose language</button></p></div></div></section>' 
         + sec('', 'a3', 'next', 'Keep going', '<p><a class="btn" href="executive-modules.html">All modules</a></p>' + note))
    page(mslug(n), f'Module {n}: {t}', f'{t}, a 75-hour executive module.', f'Module {n}: {t}', 'A 75-hour executive module.', b,
         '<li><a href="executive-modules.html">Modules</a></li><li aria-current="page">Module ' + e(n) + '</li>')

print('ok', 2 + len(mods))
