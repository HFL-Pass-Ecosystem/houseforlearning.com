#!/usr/bin/env python3
"""Builds the campus standards (site/campus-*.html) and the BIM academy (site/bim-*.html) from the career-pathways skeleton.
Data: tools/campus_bim_data.py. Own words, brand neutral: no supplier, maker or landlord names, no prices, no addresses."""
import os, re, html
import campus_bim_data as D
e = html.escape
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
skel = open(os.path.join(SITE, 'career-pathways.html'), encoding='utf-8').read()
i = skel.find('<main'); j = skel.find('</main>')
HEAD, TAIL = skel[:i], skel[j:]

def sec(cls, sid, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{sid}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{sid}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>\n'
def ul(items): return '<ul class="lux-list one">' + ''.join(f'<li>{x}</li>' for x in items) + '</ul>'
def table(cap, head, rows):
    return ('<div class="scroll-x"><table class="ws-table"><caption>' + e(cap) + '</caption><thead><tr>' + ''.join(f'<th scope="col">{e(h)}</th>' for h in head) + '</tr></thead><tbody>'
            + ''.join('<tr>' + ''.join((f'<th scope="row">{e(c)}</th>' if k == 0 else f'<td>{e(c)}</td>') for k, c in enumerate(r)) + '</tr>' for r in rows) + '</tbody></table></div>')
def hero(kick, h1, lede, extra=''):
    return f'<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">{e(kick)}</p><h1 id="h1">{e(h1)}</h1><p>{e(lede)}</p>{extra}</div></div></section>\n'
def ctas(*pairs):
    return '<div class="ctas">' + ''.join(f'<a class="btn{"" if k == 0 else " btn-ghost"}" href="{h}">{e(t)}</a>' for k, (h, t) in enumerate(pairs)) + '</div>'
NOTE = f'<p class="lux-note">{e(D.NOTE)}</p>'
SAFE = '<p class="lux-note">Learning material, not a design or safety instruction. Real buildings are designed and signed off by licensed professionals under local rules.</p>'

def page(slug, title, desc, body, crumb_root, prev, nxt):
    h = HEAD.replace('Course and Career Pathways | House for Learning', f'{title} | House for Learning')
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(desc, quote=True)}">', h)
    h = h.replace('career-pathways.html">', slug + '.html">')
    h = h.replace('<li aria-current="page">Career pathways</li>', (f'<li><a href="{crumb_root[0]}">{crumb_root[1]}</a></li><li aria-current="page">{e(title)}</li>') if crumb_root[0] != slug + '.html' else f'<li aria-current="page">{e(title)}</li>')
    pager = ('<nav class="pager" aria-label="Previous and next page"><div class="wrap pager-row">'
             f'<a class="pager-link pager-prev" href="{prev[0]}"><span class="pager-k">&larr; Previous</span><span class="pager-n">{e(prev[1])}</span></a>'
             f'<a class="pager-link pager-next" href="{nxt[0]}"><span class="pager-k">Next &rarr;</span><span class="pager-n">{e(nxt[1])}</span></a></div></nav>\n')
    open(os.path.join(SITE, slug + '.html'), 'w', encoding='utf-8').write(h + '<main id="main" tabindex="-1">\n' + body + pager + TAIL)

# ---------------- campus standards ----------------
STD = [
 ('campus-std-tiers', 'Campus tiers and sites', 'Three campus sizes and the rules for choosing a site.'),
 ('campus-std-spaces', 'Space programme', 'Every space a campus holds, with size and seat rules.'),
 ('campus-std-shell', 'Modular shell', 'The flat-pack module, stacking, stairs, glass and terraces.'),
 ('campus-std-interiors', 'Interiors and finishes', 'Floors, partitions, ceilings, doors and wall finishes.'),
 ('campus-std-furniture', 'Furniture kit', 'The standard furniture set and its rules.'),
 ('campus-std-services', 'Building services', 'Power, cooling, water, fire, data, energy and security.'),
 ('campus-std-safety', 'Safety and access', 'Exits, rails, step-free access, children and wellbeing.'),
 ('campus-std-elements', 'Element library', 'Coded elements every drawing and model uses.'),
 ('campus-std-bim', 'BIM and LOD rules', 'What every designer must deliver, and at what level.'),
]
HUB = ('campus-standards.html', 'Campus standards')
ORDER = [('campus-standards.html', 'Campus standards')] + [(s + '.html', t) for s, t, _ in STD] + [('bim-academy.html', 'BIM academy')]

def std_body(slug):
    if slug == 'campus-std-tiers':
        cards = '<ul class="cards">' + ''.join(f'<li class="card"><span class="tag">tier {k}</span><h3>{e(n)}</h3><p>{e(a)}</p><p>{e(b)}</p></li>' for k, (n, a, b) in enumerate(D.TIERS, 1)) + '</ul>'
        return (hero('campus standards · 1', 'Campus tiers and sites', 'One family of campuses, three sizes. Every size is built from the same elements.') +
                sec('', 't1', 'three sizes', 'Flagship, business park and satellite', cards) +
                sec('alt', 't2', 'site rules', 'Rules for choosing a site', ul(D.SITE_RULES)) + sec('', 't3', 'note', 'How to use this page', NOTE))
    if slug == 'campus-std-spaces':
        rows = [(n, g, sz, str(s) if s else '-', r) for n, g, sz, s, r in D.SPACES]
        return (hero('campus standards · 2', 'Space programme', 'Every space a standard campus holds. Sizes are planning values you can check in the model.') +
                sec('', 's1', 'the list', 'Spaces, sizes and seats', table('Space programme', ['Space', 'Group', 'Size', 'Seats', 'Rule'], rows) + NOTE) +
                sec('alt', 's2', 'how groups work', 'Six kinds of space', ul(['<strong>Learn:</strong> studios and assembly rooms.', '<strong>Collaborate:</strong> project, brainstorm and meeting spaces.', '<strong>Focus:</strong> silent study, quiet rooms and the library.', '<strong>Work:</strong> desks and offices.', '<strong>Care:</strong> food, rest, lockers and play.', '<strong>Welcome and support:</strong> reception, stores and washrooms.'])))
    if slug == 'campus-std-shell':
        facts = '<ul class="lux-list">' + ''.join(f'<li><strong>{e(k)}:</strong> {e(v)}</li>' for k, v in D.SHELL_FACTS) + '</ul>'
        return (hero('campus standards · 3', 'Modular shell', 'A campus is built from one kind of steel module. It arrives flat, is bolted together in hours and can be moved.') +
                sec('', 'h1a', 'picture', 'Four modules make two floors', facts) +
                sec('alt', 'h1b', 'parts', 'What the shell is made of', table('Shell parts', ['Part', 'Standard'], D.SHELL) + NOTE))
    if slug == 'campus-std-interiors':
        return (hero('campus standards · 4', 'Interiors and finishes', 'Finishes make a room feel like ours. They also decide sound, cleaning and fire safety.') +
                sec('', 'i1', 'standard', 'Eight rules for finishes', table('Interior finishes', ['Element', 'Standard'], D.INTERIORS) + NOTE))
    if slug == 'campus-std-furniture':
        return (hero('campus standards · 5', 'Furniture kit', 'One kit for every campus, so a learner feels at home in any of them.') +
                sec('', 'f1', 'the kit', 'Standard furniture', table('Furniture kit', ['Item', 'Standard'], D.FURNITURE)) +
                sec('alt', 'f2', 'rules', 'Rules for all furniture', ul(D.FURN_RULES)))
    if slug == 'campus-std-services':
        return (hero('campus standards · 6', 'Building services', 'The systems that make a campus work: power, air, water, safety, data and energy.') +
                sec('', 'v1', 'systems', 'Eight services', table('Building services', ['Service', 'Standard'], D.SERVICES) + NOTE))
    if slug == 'campus-std-safety':
        return (hero('campus standards · 7', 'Safety and access', 'A campus is only good if everyone can use it safely, including children, elders and people with disabilities.') +
                sec('', 'y1', 'rules', 'Seven safety rules', table('Safety and access', ['Topic', 'Standard'], D.SAFETY)) + sec('alt', 'y2', 'note', 'Local rules come first', '<p>Where a local safety rule is stricter than this page, the local rule wins. Where ours is stricter, ours wins.</p>' + NOTE))
    if slug == 'campus-std-elements':
        return (hero('campus standards · 8', 'Element library', 'Every object in a drawing or a model has a code from this list. Codes keep lists, quantities and lessons clean, and they replace any maker name.') +
                sec('', 'e1', 'codes', 'Coded elements', table('Element library', ['Code', 'Element', 'Group', 'Unit'], D.ELEMENTS) +
                    '<p>Codes are written CS-GG-NN: campus standard, group, number. New elements are added by the standards team with a short reason. Suppliers are never named in the library.</p>'))
    if slug == 'campus-std-bim':
        lod = table('Levels of development', ['Level', 'Name', 'What the element carries', 'Campus use'], D.LOD)
        return (hero('campus standards · 9', 'BIM and LOD rules', 'What we ask of any designer or builder who works on an HFL campus, and how to learn it.') +
                sec('', 'b1', 'levels', 'Levels of development', '<p>A level of development says how much a model element can be trusted for a decision. Use the least detail that supports the decision.</p>' + lod) +
                sec('alt', 'b2', 'information', 'Information every element carries', ul(D.LOI)) +
                sec('', 'b3', 'rules', 'Seven model rules', ul(D.BIM_RULES)) +
                sec('alt', 'b4', 'learn it', 'Learn to work to this standard', '<p>The BIM academy teaches these rules from level 1 to level 7.</p>' + ctas(('bim-academy.html', 'Open the BIM academy'), ('bim-career-pathways.html', 'Career pathways'))))
    raise KeyError(slug)

def build_standards():
    for k, (slug, title, desc) in enumerate(STD):
        prev = ORDER[k]; nxt = ORDER[k + 2]
        page(slug, title, desc, std_body(slug), HUB, prev, nxt)
    cards = '<ul class="cards">' + ''.join(f'<li class="card"><span class="tag">standard {k}</span><h3>{e(t)}</h3><p>{e(d)}</p><a class="more" href="{s}.html">Open</a></li>' for k, (s, t, d) in enumerate(STD, 1)) + '</ul>'
    body = (hero('our own campus standards', 'Campus standards', 'One set of standards that every HFL campus follows, from a flagship to a single mobile unit. Only elements, sizes and rules are shown, so the standards belong to us.',
                 ctas(('campus-std-spaces.html', 'See the space programme'), ('bim-academy.html', 'Learn to build to it'))) +
            sec('', 'c1', 'what is inside', 'Nine standards', cards) +
            sec('alt', 'c2', 'why one standard', 'Why every campus looks and works alike', ul(['Learners and teachers move between campuses and find the same things in the same places.', 'Parts are made in one factory run and fit every site.', 'A model made once is reused many times.', 'Safety and access are checked once and trusted everywhere.'])) +
            sec('', 'c3', 'next', 'From standard to skill', '<p>The standards are also a course. Young people learn to model, coordinate and audit campuses to this standard, and can then do the same for builders anywhere.</p>' + ctas(('bim-academy.html', 'BIM academy'), ('bim-career-pathways.html', 'BIM career pathways'))) + NOTE)
    page('campus-standards', 'Campus standards', 'Our own standards for every HFL campus: tiers, spaces, shell, interiors, furniture, services, safety, element codes and BIM rules.', body, HUB, ('catalogue.html', 'Course catalogue'), (STD[0][0] + '.html', STD[0][1]))

# ---------------- BIM academy ----------------
LV = D.LEVELS
def lev_body(L):
    k = L['n']
    tcs = ul([f'<strong>Task.</strong> {e(L["task"])}', f'<strong>Condition.</strong> {e(L["cond"])}', f'<strong>Standard.</strong> {e(L["std"])}'])
    mods = ''.join(
        f'<details class="lux-panel"{" open" if i == 1 else ""}><summary>Module {i}: {e(t)} ({h} h; {e(bl)})</summary>' + ul([e(p) for p in pts]) +
        f'<p><strong>Worked example.</strong> {e(ex)}</p><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard.</strong> {e(std)}</p></details>'
        for i, (t, bl, h, pts, ex, act, std) in enumerate(L['mods'], 1))
    qs = ''.join(f'<details class="lux-panel"><summary>Q{i}. {e(q)}</summary><p><strong>Model answer.</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(L['checks'], 1))
    jobs = ul([f'<strong>{e(r)}.</strong> {e(w)}' for r, w in L['jobs']])
    stairs = '<ol class="lux-list one">' + ''.join(f'<li>{"<strong>" if x["n"] == k else ""}<a href="{x["slug"]}.html">{e(x["name"])}</a>: {e(x["title"])}{"</strong> (you are here)" if x["n"] == k else ""}</li>' for x in LV) + '</ol>'
    return (hero(f'BIM academy · {L["name"]} · {L["hours"]} hours', L['title'], L['lede'], ctas(('bim-academy.html', 'BIM academy'), ('campus-std-bim.html', 'The BIM and LOD rules'))) +
            sec('', 'bt', 'task, condition, standard', 'What you will be able to do', tcs) +
            sec('alt', 'bm', 'four modules', 'Modules, with worked examples', mods) +
            sec('', 'bq', 'five checks', 'Check yourself', '<p>Think of your answer first, then open the question.</p>' + qs) +
            sec('alt', 'bj', 'where this takes you', 'Jobs this supports', jobs) +
            sec('', 'bl', 'ladder L1 to L7', 'The seven levels', '<p>Step in at your level and move up. Credits stack.</p>' + stairs + SAFE))

def build_academy():
    for k, L in enumerate(LV):
        prev = ('bim-academy.html', 'BIM academy') if k == 0 else (LV[k - 1]['slug'] + '.html', LV[k - 1]['name'])
        nxt = ('bim-career-pathways.html', 'BIM career pathways') if k == len(LV) - 1 else (LV[k + 1]['slug'] + '.html', LV[k + 1]['name'])
        page(L['slug'], f'{L["name"]}: {L["title"]}', L['lede'], lev_body(L), ('bim-academy.html', 'BIM academy'), prev, nxt)
    cards = '<ul class="cards">' + ''.join(f'<li class="card"><span class="tag">{e(L["name"])} · {L["hours"]} h</span><h3>{e(L["title"])}</h3><p>{e(L["lede"])}</p><a class="more" href="{L["slug"]}.html">Open {e(L["name"])}</a></li>' for L in LV) + '</ul>'
    total = sum(L['hours'] for L in LV)
    body = (hero('learn and earn', 'BIM academy', 'Learn to design, coordinate and hand over buildings with digital models, to our own campus standards. Seven levels, from first steps to leading a network of campuses.',
                 ctas(('bim-l1.html', 'Start at level 1'), ('bim-career-pathways.html', 'See career pathways'), ('campus-standards.html', 'Campus standards'))) +
            sec('', 'a1', 'seven levels', f'L1 to L7, about {total} hours in all', cards) +
            sec('alt', 'a2', 'how it works', 'Learn by building our own campus', ul(['Every level uses the same campus module, so the skills build on each other.', 'Each module has a worked example, an activity and a clear standard to meet.', 'Every level ends with five checks and model answers.', 'We teach the method, not a software brand: open formats and open standards.', 'Supplier and maker names never appear in a course model. You learn to describe what a part must do.'])) +
            sec('', 'a3', 'levels of development', 'LOD in one picture', '<p>LOD says how much detail a model element carries. You learn all six levels, and when to stop adding detail.</p><p><a class="more" href="campus-std-bim.html">Read the LOD table</a></p>') + SAFE)
    page('bim-academy', 'BIM academy', 'Seven levels of BIM and LOD learning, from basics to leading a network of campuses, built on our own campus standards.', body, ('bim-academy.html', 'BIM academy'), ('catalogue.html', 'Course catalogue'), ('bim-l1.html', LV[0]['name']))

def build_careers():
    rows = [(n, lv, d) for n, lv, d in D.CAREERS]
    steps = '<ol class="lux-list one">' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}</li>' for a, b in D.CAREER_STEPS) + '</ol>'
    body = (hero('from course to career', 'BIM career pathways', 'How a level of the BIM academy becomes a job, a portfolio and, over time, a global career.', ctas(('bim-academy.html', 'BIM academy'), ('career-pathways.html', 'All career pathways'))) +
            sec('', 'k1', 'five steps', 'Learn, show, apply, perform, create value', steps) +
            sec('alt', 'k2', 'six career steps', 'Roles by level', table('Roles by level', ['Career step', 'Levels', 'What you do'], rows)) +
            sec('', 'k3', 'portfolio', 'What goes in your portfolio', ul(['Your best model from each level, with its checklist.', 'An issue list that shows how you found and fixed problems.', 'A short note on what you would do differently.', 'Your credits and the mentor who reviewed your work.'])) +
            sec('alt', 'k4', 'around the world', 'The same standard, anywhere', '<p>The campus standard is the same everywhere and local annexes cover local rules. A modeller trained in one country can take work in another by reading the local annex.</p>' + SAFE))
    page('bim-career-pathways', 'BIM career pathways', 'How BIM academy levels become jobs, a portfolio and a global career.', body, ('bim-academy.html', 'BIM academy'), (LV[-1]['slug'] + '.html', LV[-1]['name']), ('campus-standards.html', 'Campus standards'))

if __name__ == '__main__':
    build_standards(); build_academy(); build_careers()
