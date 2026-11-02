#!/usr/bin/env python3
"""Builds the Electrical academy hub and lessons (site/electrical-*.html) from the career-pathways skeleton.
Lesson text is our own words: general engineering principles, brand neutral, no part numbers."""
import os, re
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
skel = open(os.path.join(SITE, 'career-pathways.html')).read()
i = skel.find('<main'); j = skel.find('</main>')
HEAD, TAIL = skel[:i], skel[j:]

LESSONS = [
 dict(slug='electrical-keep-dry', n=1, title='Keeping a switchboard dry', mins=10,
  lede='Damp air is a quiet enemy of electrical equipment. This lesson shows why panels collect moisture and how a few small heaters stop it.',
  secs=[
  ('Why moisture forms', ['Air holds less water vapour as it cools. When a panel cools below the temperature at which the air in it is saturated, water appears on the cold metal. That is condensation.',
    'Big swings between day and night make it worse. A panel that sits idle, with no current flowing, cools right down and is most at risk.',
    'For outdoor panels, expect condensation. It always needs a plan.']),
  ('What the rules expect', ['The general standard for low-voltage assemblies assumes, as an example value, indoor air that stays at or below about half relative humidity when the temperature is as high as 40 °C. Cooler air is allowed to be more humid. Follow the current national wiring rules and the maker\'s data.',
    'As a teaching rule of thumb (an example value, not a limit), if the daily average humidity is around 80 per cent or higher, plan for anti-condensation heating.']),
  ('Two ways to keep a panel warm', ['Let the equipment do it: steady power losses of around 100 W (an example value) from continuous current can hold a cubicle just above the surrounding air.',
    'Add heaters: where losses are small, or current often stops for long periods, fit anti-condensation heaters. A qualified electrician sizes and fits them for each board, using the manufacturer tables, the room temperature, the humidity and how much the enclosure cools by itself.']),
  ('Where to put heaters', ['Place heaters below the parts you want to protect, because warm air rises past them.',
    'Use several small heaters instead of one large one. The heat spreads more evenly and no single spot gets too hot.',
    'Keep heaters on a thermostat, and fit them where they cannot touch cables.',
    'In a panel with sliding or withdrawable units, put them low in both the equipment and cable compartments.']),
  ],
  check=[('A panel is installed outdoors. What should you expect?','Condensation. Plan heating or other protection from the start.'),
         ('Why is one big heater worse than several small ones?','Heat spreads unevenly with one heater and a hot spot can damage nearby parts.'),
         ('Where should a heater sit relative to the parts it protects?','Below them.')]),
 dict(slug='electrical-motor-starting', n=2, title='Starting a motor: normal and heavy duty', mins=12,
  lede='A motor draws far more current for a few seconds when it starts. This lesson explains what makes a start heavy and why that changes the circuit.',
  secs=[
  ('The surge at start', ['When a motor is switched straight onto the supply, called direct-on-line starting, it can draw about six times its running current while it speeds up.',
    'Normal protection is chosen so that this short surge does not trip it. The motor is up to speed in a few seconds and the current falls to its running value.']),
  ('What makes a start heavy', ['Three things describe a start: how long it takes, how high the current is, and how often it is repeated.',
    'As a teaching guide (example values), a start is heavy when it lasts roughly 5 to 30 seconds, or when the current is more than six times running current, or both.',
    'Heavy loads usually have a lot of spinning mass: large fans, centrifuges and similar machines. Ask the owner of the machine, because the supplier of the motor knows its starting data.']),
  ('Why it matters for the circuit', ['A long start heats cables and contacts much more than the running current does.',
    'The overload protection must be chosen so it copes with a normal start without nuisance tripping while still protecting the motor, and the rest of the main circuit must be chosen for the longer, hotter start: contacts, wiring and protection. A qualified person makes these choices from the motor maker\'s data.']),
  ('Repeated starts', ['Every start adds heat. The number of starts per hour is limited, and the limit assumes a standard ambient temperature.',
    'Between starts the cables and switching devices must cool. If the machine needs frequent starts, treat it as a separate design case.']),
  ],
  check=[('Roughly how many times its running current can a motor draw at direct-on-line start?','About six times.'),
         ('Name two machines with a heavy start.','For example a large fan and a centrifuge.'),
         ('Why does a heavy start need its protection chosen for it?','A normal-start choice could trip during the start, so a qualified person must choose protection and the main circuit for it.')]),
 dict(slug='electrical-cable-length', n=3, title='How long can a cable be?', mins=15,
  lede='A longer cable resists fault current more. If the fault current gets too small, the protection may not trip quickly. This lesson shows the idea with a worked example.',
  secs=[
  ('The idea', ['In a short circuit between a live conductor and neutral or earth, the current flows out along the cable and back again. This path is called the fault loop.',
    'The longer the cable and the thinner its conductor, the more resistance in the loop and the less current flows in a fault.',
    'Protective devices trip fast only above a certain current. If the cable is too long, the fault current can fall below that level and the device trips slowly or not at all.']),
  ('A worked example', ['Take a copper cable of 4 mm² and 100 m, with a 230 V supply to earth and a 32 A circuit.',
    'Loop resistance is about 2 × 0.0225 × 100 ÷ 4 = 1.125 ohms. Fault current is about 230 ÷ 1.125 = 204 A.',
    'A breaker of this size may need roughly 160 to 320 A to trip instantly. At about 204 A it may trip slowly, so the cable is near the limit.',
    'This is an illustration with rounded example numbers. Real designs are done and verified by qualified people, using the supply source resistance, warmer cable resistance, and the maker\'s tables.']),
  ('What sets the longest workable length', ['The cable cross-section: thicker conductors allow longer runs.',
    'The protective device: its type and its rating.',
    'The supply voltage, and the room temperature.',
    'The number of cores and how the cable is laid.']),
  ('A second check: voltage drop', ['Even when protection works, a long cable drops voltage under load. Motors and electronics need near-rated voltage, so check voltage drop separately from the fault-current check.',
    'If either check fails, the options a qualified designer considers are a thicker cable, a shorter route, or a device with a lower trip level.']),
  ],
  check=[('Why does a longer cable reduce fault current?','More loop resistance.'),
         ('Name two things that decide the longest workable cable length.','For example conductor cross-section and the protective device.'),
         ('Is the fault-current check the same as the voltage-drop check?','No. Do both.')]),
 dict(slug='electrical-wiring-inside', n=4, title='Wiring inside a switchboard', mins=12,
  lede='Cables inside a panel sit in warmer, tighter spaces than cables in a room. This lesson covers how to size and fit them.',
  secs=[
  ('Size for the hottest place', ['Inside a closed panel, the air can be well above room temperature. Planning rules often assume values such as about 35 °C for the panel and as much as 55 °C where the wiring runs (example values; use the current local wiring rules and the maker\'s data).',
    'Choose the cable cross-section for the hotter figure, not the room.',
    'If the room is warmer than the rule assumes, reduce the allowed heat loss to stay inside the limit.']),
  ('Pick the right cable', ['Use heat-resistant insulation rated for high conductor temperatures. Halogen-free types give less smoke if there is a fire.',
    'Thin conductors are usually laid in ducts and bundles. Heavier ones are laid in air, in small bundles.']),
  ('Protect against two different problems', ['Overload is a slow rise in current. The protection must match the cable\'s current rating.',
    'Short circuit is a sudden, very large current. The cable must survive until the protective device clears it, so check how long that takes.',
    'Where a device limits the fault current, the section between busbar and device may sometimes be sized for the smaller load, but only a qualified designer decides this from the maker\'s data.']),
  ('Hold short wiring firmly', ['In a short circuit, conductors push apart with great force. Keep short runs tight, use cable supports, or run them in plastic ducts.']),
  ],
  check=[('Which temperature should you size inside-panel wiring for?','The warmer temperature inside the device compartment, not the room.'),
         ('What are the two faults wiring must be protected against?','Overload and short circuit.'),
         ('Why support short wiring?','Short-circuit forces push conductors apart.')]),
 dict(slug='electrical-arc-vents', n=5, title='Fitting circuit breakers: keep the vents clear', mins=8,
  lede='When a breaker clears a big fault, hot gas escapes through vents. This lesson shows why those vents must stay open and what to fit around them.',
  secs=[
  ('What happens in a fault', ['Opening a large fault current creates an arc inside the breaker. The arc heats the air and makes hot, ionised gas and metal vapour.',
    'Vents let that gas out, away from live parts, so the arc does not restart outside the breaker.']),
  ('Rules to follow', ['Do not block the vents with barriers, panels or neighbouring devices.',
    'Fit phase separators or terminal covers where the maker requires them. They keep phases apart and leave the vents free.',
    'Use insulated bars or cables to connect the breaker.',
    'Follow the maker\'s installation sheet for each fixing style, whether fixed, plug-in or withdrawable.']),
  ('Alternatives need proof', ['If you want a different layout from the maker\'s, it must be checked by test, not by opinion.']),
  ],
  check=[('Why do breakers have vents?','To let hot arc gas escape away from live parts.'),
         ('Name two things you must not do.','Block the vents, or use bare conductors where insulated ones are required.'),
         ('Who must prove an alternative layout?','Whoever proposes it must show test evidence, and a qualified designer approves it. Opinion is not proof.')]),
]

BTNS = '<div class="ctas"><a class="btn" href="electrical-academy.html">Electrical academy</a><a class="btn btn-ghost" href="catalogue.html">Open the catalogue</a></div>'
SAFE = '<p class="lux-note">Learning material, not a design or safety instruction. Electrical work must be done by qualified people following the maker\'s instructions and local rules.</p>'

def page(slug, title, desc, body, crumb_prev, crumb_next, lesson=None):
    h = HEAD.replace('Course and Career Pathways | House for Learning', f'{title} | House for Learning')
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', h)
    h = h.replace('career-pathways.html">', slug + '.html">').replace('<li aria-current="page">Career pathways</li>', f'<li><a href="electrical-academy.html">Electrical academy</a></li><li aria-current="page">{title}</li>' if slug != 'electrical-academy' else '<li aria-current="page">Electrical academy</li>')
    pager = ('<nav class="pager" aria-label="Previous and next page"><div class="wrap pager-row">'
      f'<a class="pager-link pager-prev" href="{crumb_prev[0]}"><span class="pager-k">&larr; Previous</span><span class="pager-n">{crumb_prev[1]}</span></a>'
      f'<a class="pager-link pager-next" href="{crumb_next[0]}"><span class="pager-k">Next &rarr;</span><span class="pager-n">{crumb_next[1]}</span></a></div></nav>\n')
    # test pay-to-access: lesson 1 is the free preview; assets/access.js reads these attributes
    gate = f' data-series="electrical-academy.html" data-lesson="{lesson}" data-lessons="{len(LESSONS)}" data-title="Electrical academy"' if lesson else ''
    out = h + f'<main id="main" tabindex="-1"{gate}>\n' + body + pager + TAIL
    if lesson:
        if 'assets/courses.css' not in out: out = out.replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="stylesheet" href="assets/site.css">\n<link rel="stylesheet" href="assets/courses.css">', 1)
        if 'assets/access.js' not in out: out = out.replace('</body>', '<script src="assets/access.js" defer></script>\n</body>', 1)
    open(os.path.join(SITE, slug + '.html'), 'w').write(out)

import json
def rich(L):
    f = os.path.join(os.path.dirname(__file__), '..', 'data', 'electrical', L['slug'].replace('electrical-', '') + '.json')
    if not os.path.exists(f): return ''
    x = json.load(open(f)); ms = x['modules']
    def sec(cls, i, kick, h2, inner):
        return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{kick}</p><h2 id="{i}">{h2}</h2></div><div class="sec-body">{inner}</div></div></section>\n'
    tcs = f'<ul class="lux-list one"><li><strong>Task.</strong> {x["task"]}</li><li><strong>Condition.</strong> {x["condition"]}</li><li><strong>Standard.</strong> {x["standard"]}</li></ul>'
    mod = ''.join(f'<details class="lux-panel" {"open" if i==1 else ""}><summary>Part {i}: {m["title"]} ({m["minutes"]} min, {m["bloom"]})</summary><p>{m["intro"]}</p><ul class="lux-list one">' + ''.join(f'<li>{q}</li>' for q in m['points']) + f'</ul><p><strong>Worked example.</strong> {m["example"]}</p><p><strong>Activity.</strong> {m["activity"]}</p><p><strong>Standard.</strong> {m["standard"]}</p></details>' for i, m in enumerate(ms, 1))
    qs = ''.join(f'<details class="lux-panel"><summary>{q["q"]}</summary><p>{q["a"]} <em>(Covered in part {q["module"]}: {ms[q["module"]-1]["title"]}. To pass that part: {ms[q["module"]-1]["standard"].rstrip().rstrip(".")}.)</em></p></details>' for q in x['quiz'])
    lad = ''.join(f'<li><strong>Slide {j}: {l["title"]}.</strong> {l["slide"]} <em>Speaker note:</em> {l["notes"]}</li>' for j, l in enumerate(x['ladder'], 1))
    rub = '<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{r["criterion"]}</th><td>{r["not_yet"]}</td><td>{r["meets"]}</td><td>{r["exceeds"]}</td></tr>' for r in x['rubric']) + '</tbody></table></div>'
    jobs = '<ul class="lux-list one">' + ''.join(f'<li><strong>{j["role"]}.</strong> {j["what"]}</li>' for j in x['jobs']) + '</ul>'
    return (sec('', 'rt', 'task, condition, standard', 'What you will be able to do', tcs) + sec('alt', 'rm', 'four parts', 'The parts, with worked examples', mod)
            + sec('', 'rq', 'ten checks', 'Check yourself in depth', qs) + sec('alt', 'rl', 'slides L1 to L7', 'The seven-level ladder, slide by slide', '<ol>' + lad + '</ol>')
            + sec('', 'rr', 'how it is judged', 'Marking rubric', rub) + sec('alt', 'rj', 'where it leads', 'Jobs this supports', jobs))

def lesson_body(L):
    b = f'<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">electrical academy · lesson {L["n"]} · about {L["mins"]} minutes</p><h1 id="h1">{L["title"]}</h1><p>{L["lede"]}</p>{SAFE}</div></div></section>\n'
    for k, (h, paras) in enumerate(L['secs']):
        items = paras if len(paras) < 3 else None
        inner = ''.join(f'<p>{p}</p>' for p in paras) if items else '<ul class="lux-list one">' + ''.join(f'<li>{p}</li>' for p in paras) + '</ul>'
        b += f'<section class="sec{" alt" if k % 2 else ""}" aria-labelledby="s{k}"><div class="wrap"><div class="sec-head"><h2 id="s{k}">{h}</h2></div><div class="sec-body">{inner}</div></div></section>\n'
    qs = ''.join(f'<details class="lux-panel"><summary>{q}</summary><p>{a}</p></details>' for q, a in L['check'])
    b += f'<section class="sec" aria-labelledby="chk"><div class="wrap"><div class="sec-head"><p class="kicker">check yourself</p><h2 id="chk">Three quick questions</h2></div><div class="sec-body"><p>Think of your answer first, then open the question.</p>{qs}{SAFE}{BTNS}</div></div></section>\n'
    return b + rich(L)

SEGMENTS = [
 ('Power', [('Generation', ['Electric utility power generation']), ('Transmission and distribution', ['Electric distribution up to 60 kV']), ('Other utilities', ['Gas utilities', 'Water and heat utilities'])]),
 ('Industry', [('Oil and gas', ['Oil and gas production', 'Petrochemicals', 'Chemicals']), ('Process industry', ['Water and wastewater', 'Mining and minerals', 'Cement and glass', 'Metals', 'Pulp and paper']), ('Discrete and hybrid industry', ['Food and beverage', 'Pharmaceuticals and cosmetics', 'Electronics and semiconductors', 'Automotive', 'Rubber and plastics', 'Printing', 'Textile', 'Agriculture and forestry', 'Machinery and electrical equipment', 'Waste and recycling', 'Other industries'])]),
 ('Transport and infrastructure', [('Transport', ['Land transport', 'Logistics', 'Air transport', 'Electric vehicle charging', 'Cranes', 'Marine', 'Railway']), ('Buildings', ['Residential buildings', 'Commercial and institutional buildings', 'Industrial buildings', 'Building infrastructure', 'Real estate', 'Hospitals', 'Education and science', 'Data centres'])]),
]
BA_SOLUTIONS = ['Smart home systems', 'Guest-room management', 'Lighting management', 'Energy management', 'Door entry', 'Wiring accessories']
BA_AUDIENCE = ['System integrators', 'Electrical design consultants', 'Low-voltage design consultants', 'Energy consultants', 'Hotel operators']

def build_segments():
    cols = ''
    for m, groups in SEGMENTS:
        g = ''.join(f'<h3>{gn}</h3><ul class="lux-list">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>' for gn, items in groups)
        cols += f'<div class="lux-panel"><h2>{m}</h2>{g}</div>'
    body = ('<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">training by market segment</p><h1 id="h1">Training by market segment</h1>'
      '<p>Electrical and automation skills look different in a power plant, a food factory, a railway and a hospital. We organise training topics by the market a learner works in, so a course can speak to real jobs.</p>'
      '<div class="ctas"><a class="btn" href="catalogue.html">Open the catalogue</a><a class="btn btn-ghost" href="electrical-academy.html">Electrical academy</a></div></div></div></section>\n'
      f'<section class="sec" aria-labelledby="seg"><div class="wrap"><div class="sec-head"><p class="kicker">three markets</p><h2 id="seg">Where our learners work</h2></div><div class="sec-body"><div class="split2 seg3">{cols}</div></div></div></section>\n'
      '<section class="sec alt" aria-labelledby="ba"><div class="wrap"><div class="sec-head"><p class="kicker">building automation</p><h2 id="ba">Comfort, safety and efficiency in buildings</h2></div><div class="sec-body">'
      '<p>Every building has its own needs, so building automation training is tailored to the application, from homes and offices to factories and luxury hotels. Topics cover:</p>'
      '<ul class="lux-list">' + ''.join(f'<li>{i}</li>' for i in BA_SOLUTIONS) + '</ul>'
      '<h3>Who it is for</h3><ul class="lux-list">' + ''.join(f'<li>{i}</li>' for i in BA_AUDIENCE) + '</ul>'
      '<p>Learners use product selection guides, a solution brochure for intelligent building control and a configuration tool for their system.</p></div></div></section>\n')
    page('training-by-segment', 'Training by market segment', 'Our training topics are organised by the market a learner works in: power, industry, transport and infrastructure, and buildings.', body, ('electrical-academy.html', 'Electrical academy'), ('catalogue.html', 'Course catalogue'))

def main():
    for k, L in enumerate(LESSONS):
        prev = ('electrical-academy.html', 'Electrical academy') if k == 0 else (LESSONS[k-1]['slug'] + '.html', LESSONS[k-1]['title'])
        nxt = ('electrical-academy.html', 'Electrical academy') if k == len(LESSONS)-1 else (LESSONS[k+1]['slug'] + '.html', LESSONS[k+1]['title'])
        page(L['slug'], L['title'], L['lede'], lesson_body(L), prev, nxt, lesson=L['n'])
    cards = '<li class="card"><span class="tag">catalogue</span><h3>Training by market segment</h3><p>How we organise topics by the market a learner works in, with building automation as a first example.</p><a class="more" href="training-by-segment.html">See the segments</a></li>' + ''.join(f'<li class="card"><span class="tag">lesson {L["n"]} · {L["mins"]} min</span><h3>{L["title"]}</h3><p>{L["lede"]}</p><a class="more" href="{L["slug"]}.html">Start lesson {L["n"]}</a></li>' for L in LESSONS)
    hub = ('<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">skills for the trade</p><h1 id="h1">Electrical academy</h1>'
      '<p>Short lessons on the thinking behind low-voltage switchboards. Each one uses plain words, a worked idea and three questions to check yourself.</p>' + SAFE + '<div class="ctas"><a class="btn" href="electrical-keep-dry.html">Start with lesson 1</a><a class="btn btn-ghost" href="catalogue.html">Open the catalogue</a></div></div></div></section>\n'
      f'<section class="sec" aria-labelledby="ls"><div class="wrap"><div class="sec-head"><p class=\"kicker\">five lessons</p><h2 id=\"ls\">Choose a lesson</h2></div><div class="sec-body"><ul class="cards">{cards}</ul></div></div></section>\n'
      '<section class="sec alt" aria-labelledby="who"><div class="wrap"><div class="sec-head"><h2 id="who">Who it is for</h2></div><div class="sec-body"><p>Apprentices, technicians, panel builders, maintenance teams and supervisors who want the reasons behind the rules. The lessons teach principles. They are not a substitute for the maker\'s instructions or for the standards that apply where you work.</p></div></div></section>\n')
    build_segments()
    page('electrical-academy', 'Electrical academy', 'Five short lessons on moisture, motor starting, cable length, wiring and breaker fitting in low-voltage switchboards.', hub, ('catalogue.html', 'Course catalogue'), (LESSONS[0]['slug'] + '.html', LESSONS[0]['title']))
if __name__ == '__main__':
    main()
