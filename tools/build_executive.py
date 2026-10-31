#!/usr/bin/env python3
"""Builds the Executive programme pages (24-month online programme, 14 modules, credit table) from the data below.
Draft: noindex. Credit translations need a lawyer or registrar check before public use. Wording is 'aligned with', never 'accredited'."""
import re, html, pathlib
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'
e = html.escape
tpl = (S / 'catalogue.html').read_text()
if 'name="robots"' not in tpl:
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)
DRAFT = 'Draft. Names, lengths and credit values may change before opening. Credit values are being checked and are shown for orientation only.'

def page(fn, title, desc, h1, lead, body, crumbs):
    t = tpl
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, count=1)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, count=1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, count=1)
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
exits = [('Executive certificate', 'Terms 1 and 2', '20 ECTS'), ('Executive diploma', 'Terms 1 to 4', '40 ECTS'), ('Master-level award', 'All 24 months', '60 ECTS')]
practice = [('1', 'Exposure audit, self-management challenge, behaviour decoder, standards adjudication lab, rapid prototyping'), ('2', 'Problem-formulation lab, questioning role-plays, bottleneck triage, competitive war games'),
 ('3', 'Drafting drills, chart-selection challenges, deck restructuring runs'), ('4', 'Saboteur audit, cross-function conflict simulations, turnaround exercises'),
 ('5', 'Pricing sandbox, low-cost hardware challenge, procurement negotiation, integration and offshoring war games, ethics compliance court'), ('6', 'Capstone simulation, 10-slide proposal, live boardroom defence')]
body = (sec('', 'e1', 'six terms of four months', 'The 24 months, term by term', table('Terms and courses', ['Term', 'When', 'Theme', 'Courses'], terms) + '<p>Online, with live video boardroom defences. 11 courses plus a capstone.</p>')
 + sec('alt', 'e2', 'stack as you go', 'Awards along the way', table('Stackable awards, aligned with the European credit system', ['Award', 'Covers', 'Credits'], exits) + '<p>Each award stands on its own and counts towards the next. As a guide, one US-style credit is about 45 hours of study; a 3-credit course is about 150 hours.</p>')
 + sec('', 'e3', 'learn by playing it out', 'Practice in every term', table('Hands-on practice by term', ['Term', 'What you do'], practice))
 + sec('alt', 'e4', 'first term marking', 'How term 1 is assessed', table('Term 1 assessment', ['Part', 'Weight'], [('Individual feedback-analysis audit (2,000 words)', '30%'), ('Group profiling strategy (3,000 words plus a process canvas)', '30%'), ('Live prototyping and integrity defence (10 slides and an oral defence)', '40%')]) + '<p>Grades are given in bands: A for 3.67 to 4.00, B for 2.67 to 3.33, below 2.00 is a fail.</p>')
 + sec('', 'e5', 'shorter option', 'Prefer to take it a module at a time?', '<p>The same ideas are also offered as 14 short, stackable modules of 75 hours each.</p><p><a class="btn btn-ghost" href="mba/index.html">Try the online programme (test)</a></p><p><a class="btn" href="executive-modules.html">See the 14 modules</a> <a class="btn btn-ghost" href="executive-credits.html">Credit table</a></p>' + note))
page('executive-programme.html', 'Executive programme, 24 months online', 'A 24-month online executive programme in six terms, with stackable awards.', '24-month online executive programme', 'Six terms, eleven courses and a capstone, taught online with live defences.', body, '<li aria-current="page">Executive programme</li>')

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
frame = ['Credit table for 16 countries', 'Applied case analysis', 'Simulation arena with a tasks, conditions and standards matrix', 'A yearly refresh of the research', 'Assessment matrix and marking bands (A, B, fail)']
mslug = lambda n: 'executive-module-' + n.lower() + '.html'
rows = ''.join(f'<li><a href="{mslug(n)}">Module {e(n)}: {e(t)}</a></li>' for n, t, _ in mods)
body = (sec('', 'm1', '14 modules', 'Each is 75 hours and stacks', f'<ul class="ws-plist cl">{rows}</ul>')
 + sec('alt', 'm2', 'same five parts every time', 'What each module contains', '<ol class="ws-chips">' + ''.join(f'<li>{e(x)}</li>' for x in frame) + '</ol><p>Each module is 2.5 ECTS, which is 75 hours of study, and fits the recommended approach to small, stackable credentials. Modules bridge the executive programme to specialist master-level and doctoral routes.</p><p>Module 4 is reserved and not yet published.</p>' + note))
page('executive-modules.html', 'Executive modules', 'Fourteen stackable executive modules of 75 hours each.', 'Executive modules', 'Fourteen stackable modules, each 2.5 ECTS or 75 hours.', body, '<li><a href="executive-programme.html">Executive programme</a></li><li aria-current="page">Modules</li>')
for n, t, wts in mods:
    ws = wts or shared
    b = (sec('', 'a1', 'what you take', f'Module {n}', f'<ul class="cards"><li class="card"><h3>Size</h3><p>2.5 ECTS, 75 hours of study.</p></li><li class="card"><h3>Credit</h3><p>Counts in 16 countries. <a href="executive-credits.html">See the table</a>.</p></li></ul>')
         + sec('alt', 'a2', 'how it is marked', 'Assessment', '<ul class="ws-chips">' + ''.join(f'<li>{e(x)}</li>' for x in ws) + '</ul><p>Marking bands: A, B or fail. Presentations use at most 10 slides, with a short live defence.</p>' + ('' if wts else '<p>Weights shown follow the shared pattern for modules 3 to 14, and will be confirmed.</p>'))
         + sec('', 'a3', 'next', 'Keep going', '<p><a class="btn" href="executive-modules.html">All modules</a></p>' + note))
    page(mslug(n), f'Module {n}: {t}', f'{t}, a 75-hour executive module.', f'Module {n}: {t}', 'A 2.5 ECTS executive module, 75 hours.', b,
         '<li><a href="executive-modules.html">Modules</a></li><li aria-current="page">Module ' + e(n) + '</li>')

cred = [('United States', "Master's", '1.25 semester credit hours (45 hours per credit)'), ('United Kingdom', 'Level 7', '5 CATS credits'), ('India', 'Level 8 (national credit framework)', '2.5 credits'),
 ('United Arab Emirates', 'Level 9', '1.25 graduate semester credits'), ('Singapore', "Master's track", '2.5 modular credits'), ('Malaysia', 'Level 7', '2 credits (40 hours per credit)'),
 ('Philippines', 'Level 8', '1.5 graduate units'), ('Australia', 'Level 8', '6 credit points'), ('New Zealand', 'Level 8', '5 credits'), ('Germany', 'Level 7', '2.5 ECTS'),
 ('Switzerland', 'Level 7', '2.5 ECTS'), ('Italy', 'Level 7', '2.5 CFU'), ('Spain', 'Level 7 (European framework)', '2.5 ECTS'), ('Russia', 'Level 7', '2 credit units'), ('Ukraine', 'Level 7', '2.5 ECTS'), ('Georgia', 'Level 7', '2.5 ECTS')]
body = sec('', 'c1', 'for one 75-hour module', 'How one module counts in 16 countries', table('Credit equivalence, orientation only', ['Country', 'Level', 'Credit'], cred)
    + '<p class="ws-note">These are our working translations, being checked. They are not a promise that any institution will accept them. We say "aligned with", never "accredited".</p>')
page('executive-credits.html', 'Credit table, 16 countries', 'How one 75-hour module is expressed in 16 countries.', 'Credit table', 'One 2.5 ECTS module, in 16 countries.', body, '<li><a href="executive-programme.html">Executive programme</a></li><li aria-current="page">Credit table</li>')
print('ok', 4 + len(mods) - 1)
