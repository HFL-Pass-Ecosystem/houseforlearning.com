#!/usr/bin/env python3
"""Builds FULL course pages (not a catalogue): one page per course title with modules, lessons,
Bloom outcomes, task/condition/standard, assessment, level L1-L7, and ten-location localisation,
plus hub pages B2B, B2C, D2C and learner-group pages (ESL, Primary, Secondary, Post-secondary, UG, PG, PhD/systemic).
Method: Course builder fields (summary, task/condition/standard, level, prerequisites, topics, time, outcomes,
requirements, who for, materials, team) + pathway ladder (Foundation, Practitioner, Expert).
Sources: data/catalogue.json, data/lessons/*.md (full lesson text), data/school-scope.csv.
Run: python3 tools/build_full_courses.py   Draft: all pages noindex."""
import json, re, html, csv, pathlib, collections
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'; Dt = R / 'data'
e = html.escape
cat = json.load(open(Dt / 'catalogue.json'))
tpl = (S / 'catalogue.html').read_text()
if 'name="robots"' not in tpl:
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)
tpl = tpl.replace('<li><a href="catalogue.html" aria-current="page">Catalogue</a></li>', '<li><a href="courses-hub.html">Courses</a></li><li><a href="catalogue.html">Catalogue</a></li>', 1)
tpl = tpl.replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="stylesheet" href="assets/site.css">\n<link rel="stylesheet" href="assets/courses.css">', 1)

# ---------- ten locations + global ----------
LOC = [
 dict(k='in', name='India (Bengaluru)', cur='INR', lang='English, Hindi, Kannada', reg='Udyam (small business) or company registration with the Ministry of Corporate Affairs', data='Digital Personal Data Protection Act 2023', frame='National Skills Qualifications Framework (NSQF) and the national credit framework', tax='GST', food='FSSAI', cons='Consumer Protection Act 2019', partner='an industrial-training institute, a polytechnic, a small-business cluster or a Bengaluru incubator', note='Follows the latest national education policy for credits, entry and exit points.'),
 dict(k='nl', name='Netherlands (Eindhoven area)', cur='EUR', lang='Dutch, English', reg='registration with the Chamber of Commerce (KvK)', data='EU GDPR (Dutch: AVG), supervised by the Autoriteit Persoonsgegevens', frame='the Dutch qualification framework (NLQF) linked to the European Qualifications Framework', tax='BTW (VAT)', food='NVWA', cons='EU and Dutch consumer rules (14-day cooling-off for online sales)', partner='a regional college (MBO), a maker space or a Brainport-area small firm', note='Europe phase-1 priority region.'),
 dict(k='ae', name='UAE (Dubai and Abu Dhabi)', cur='AED', lang='Arabic, English', reg='a trade licence from the emirate economic department or a free-zone licence', data='Federal Decree-Law No. 45 of 2021 (personal data protection)', frame='the emirate education and training regulators (for example KHDA in Dubai) and the national qualifications framework', tax='VAT (5%)', food='the municipality food-control team (for example Dubai Municipality)', partner='a free-zone business centre, a training institute or a municipality-licensed operator', note='Learners and trainers use own bank or UPI-style payment pages only; no card gateway.'),
 dict(k='br', name='Brazil (Sao Paulo)', cur='BRL', lang='Portuguese (Spanish and English support)', reg='CNPJ registration, or MEI for micro-entrepreneurs', data='LGPD (Lei Geral de Protecao de Dados)', frame='the national technical-education catalogue and the S-system training bodies (SENAI, SENAC)', tax='the simplified tax regime (Simples Nacional) where eligible', food='ANVISA and MAPA', cons='the Consumer Defence Code (CDC)', partner='SEBRAE small-business support, a technical school or a local cooperative', note='Course text is delivered in Portuguese first.'),
 dict(k='ca', name='Canada (Toronto)', cur='CAD', lang='English, French', reg='federal or Ontario business registration', data='PIPEDA, with provincial rules where they apply', frame='the provincial colleges framework and the national credential-recognition guidance', tax='HST (13% in Ontario)', food='the Canadian Food Inspection Agency (CFIA)', partner='a community college, a settlement agency or a Toronto business hub', note='Offer English and French versions of every learner-facing page.'),
 dict(k='us', name='United States', cur='USD', lang='English, Spanish', reg='state registration (Secretary of State) and a federal tax ID', data='state privacy laws (for example California), and COPPA for children under 13', frame='state and community-college credit systems', tax='state sales tax (differs by state)', food='the FDA and the state health department', partner='a community college, a workforce board or a small-business development centre', note='Rules differ by state: always name the state when you write local evidence.'),
 dict(k='sg', name='Singapore', cur='SGD', lang='English, Mandarin, Malay, Tamil', reg='registration with ACRA', data='Personal Data Protection Act (PDPA)', frame='SkillsFuture Singapore frameworks and the national credit system', tax='GST', food='the Singapore Food Agency (SFA)', partner='a channel partner, a polytechnic or a SkillsFuture-linked training provider', note='Delivered with channel partners.'),
 dict(k='au', name='Australia', cur='AUD', lang='English', reg='an ABN and, for companies, ASIC registration', data='the Privacy Act 1988 and the Australian Privacy Principles', frame='the Australian Qualifications Framework (AQF) levels', tax='GST (10%)', food='Food Standards Australia New Zealand (FSANZ) and the state health authority', partner='a TAFE or registered training organisation, or a regional business chamber', note='Delivered with channel partners.'),
]
for _L in LOC: _L.setdefault('cons','local consumer-protection law')
RUSSIA = 'Russian Federation: HELD. A sanctions and licensing check by our lawyer must finish before any course is offered there. No localised version is published.'
GLOBAL = dict(cur='USD (or your own currency, written next to every number)', note='The global version uses plain English, metric units, and your own currency. Machine translation is available in every language; the English text is the official text. Before you act for real, check your local rules with an adviser.')

# ---------- levels (L1 basic ... L7 super expert) ----------
ADV = {'Cloud Migration as a Service','DDoS and Cyber-Attack Prevention','Biometric Sensor and Security Solutions','Greenhouse Gas Auditing','Artificial Intelligence in Practice','Internet of Things (IoT)','Robotics Fundamentals','Blockchain Health-Record Concepts','Nanosatellites and Space Data','Industrial Activity: Machinery, High-Tech and Process','Construction and Built Environment','Wind Energy Fundamentals','Solar Power Design and Installation Basics','Nanotechnology in Medicine (Awareness Level)'}
def level(c):
    t = c['title']
    if 'Awareness' in t or 'Overview' in t: return 2
    if t in ADV: return 5
    if re.search(r'Basics|Fundamentals|Concepts|Introduction', t): return 3
    if c['id'].startswith('EU'): return 4
    return 4
LNAME = {1:'L1 Basic',2:'L2 Awareness',3:'L3 Foundation',4:'L4 Practitioner',5:'L5 Specialist',6:'L6 Advanced',7:'L7 Super expert'}
SENIOR = re.compile(r'Senior|Podcast|Library|Privacy|Wallet|Social Media|Tutoring|Skincare|Fitness|Home Sharing|Greenhouse|Water|Coaching|Handmade|Food|Childcare|Plastic|Online Therapy|Virtual Medical|Crowdfunding', re.I)

# ---------- parse lesson text ----------
def md_inline(s):
    s = e(s.strip())
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
def md_block(lines):
    out, ol, ul = [], [], []
    def flush():
        nonlocal ol, ul
        if ol: out.append('<ol>' + ''.join(f'<li>{md_inline(x)}</li>' for x in ol) + '</ol>'); ol = []
        if ul: out.append('<ul>' + ''.join(f'<li>{md_inline(x)}</li>' for x in ul) + '</ul>'); ul = []
    for l in lines:
        l = l.rstrip()
        if not l.strip(): flush(); continue
        m = re.match(r'\s*\d+\.\s+(.*)', l); b = re.match(r'\s*[-*]\s+(.*)', l)
        if m: ul and flush(); ol.append(m.group(1))
        elif b: ol and flush(); ul.append(b.group(1))
        else: flush(); out.append(f'<p>{md_inline(l)}</p>')
    flush(); return ''.join(out)
def parse(cid):
    fs = list((Dt / 'lessons').glob(cid + '-*FULL.md'))
    if not fs: return None
    txt = fs[0].read_text()
    head, *secs = re.split(r'\n## ', txt)
    intro = '\n'.join(l for l in head.splitlines()[1:] if l.strip())
    lessons, extra = [], []
    for s in secs:
        title, *body = s.splitlines()
        m = re.match(r'Lesson (\d+) - (\w+) \((\w+), (\d+) h\): (.*)', title)
        if m:
            goal = next((re.sub(r'^Goal:\s*', '', l) for l in body if l.startswith('Goal:')), '')
            ev = next((re.sub(r'^Evidence:\s*', '', l) for l in body if l.startswith('Evidence:')), '')
            rest = [l for l in body if not l.startswith('Goal:') and not l.startswith('Evidence:')]
            lessons.append(dict(n=int(m.group(1)), stage=m.group(2), kind=m.group(3), h=int(m.group(4)), title=m.group(5), goal=goal, ev=ev, body=rest))
        else: extra.append((title, body))
    return dict(intro=intro, lessons=lessons, extra=extra)

BLOOM = {'Idea':('Understand','explain'),'Action':('Apply','build'),'Value':('Evaluate','judge'),'Empowerment':('Create','present'),'Regeneration':('Create','plan')}
KIND = {'DO':'Practice','SHARE':'Share and mentoring','STUDY':'Study'}

def page(fn, title, desc, h1, lead, body, crumbs, kicker='courses'):
    t = tpl
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, 1, re.S)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, 1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, 1)
    t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li>' + crumbs + '</ol>', t, 1, re.S)
    main = (f'<main id="main" tabindex="-1"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div>'
            f'<p class="kicker">{e(kicker)}</p><h1 id="h1">{e(h1)}</h1><p>{lead}</p></div></div></section>{body}</main>')
    t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, 1, re.S)
    (S / fn).write_text(t)
def sec(cls, i, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>'
def crumb(*items):
    return ''.join(f'<li><a href="{h}">{e(t)}</a></li>' if h else f'<li aria-current="page">{e(t)}</li>' for t, h in items)

# ---------- course pages ----------
courses = cat['chapters'] + cat['courses']
meta = {}
for c in courses:
    c['level'] = level(c)
    c['grp'] = c.get('group') or 'Europe chapters'
byg = collections.defaultdict(list)
for c in courses: byg[c['grp']].append(c)
def prereq(c):
    lower = [x for x in byg[c['grp']] if x['level'] < c['level']]
    return lower[0] if lower else None
def hhmm(h): return f'{h}:00'
SLUG = lambda c: 'learn-' + c['id'].lower() + '.html'

def loc_box(c, L):
    t = c['title']
    return (f'<details class="loc"><summary>{e(L["name"])}</summary><dl>'
            f'<dt>Currency</dt><dd>{e(L["cur"])}: write it next to every price, cost and margin in your evidence.</dd>'
            f'<dt>Language of delivery</dt><dd>{e(L["lang"])}; machine translation to any language.</dd>'
            f'<dt>Set up legally</dt><dd>{e(L["reg"])}. Tax: {e(L["tax"])}.</dd>'
            f'<dt>Personal data</dt><dd>{e(L["data"])}. Keep no buyer or learner personal data in shared files.</dd>'
            f'<dt>Levels and credit</dt><dd>{e(L["frame"])}. This course sits at {LNAME[c["level"]]}; it is aligned with, not accredited by, these frameworks.</dd>'
            f'<dt>Where to practise</dt><dd>Agree your practice task for <em>{e(t)}</em> with {e(L["partner"])}.</dd>'
            f'<dt>Consumer and product rules</dt><dd>{e(L["cons"])}. For food, health or safety topics, check with {e(L["food"])} and a local adviser before you sell or act.</dd>'
            f'<dt>Local note</dt><dd>{e(L["note"])}</dd></dl></details>')

def course_page(c):
    P = parse(c['id'])
    if not P: return False
    L = P['lessons']; lvl = c['level']; total = sum(x['h'] for x in L)
    do = sum(x['h'] for x in L if x['kind'] == 'DO'); sh = sum(x['h'] for x in L if x['kind'] == 'SHARE'); st = total - do - sh
    pre = prereq(c)
    outcomes = [
        ('Understand', f'Explain who needs {c["title"]} and name one real first user, with evidence from your own market scan.'),
        ('Apply', f'Build and run the practice task: {c["practice_70"]}'),
        ('Analyse', 'Record every step, cost and problem, then compare the plan with what really happened.'),
        ('Evaluate', 'Judge your result against your goal using numbers, and write three lessons learned.'),
        ('Create', 'Present your evidence to a review room and give two peers written feedback.'),
        ('Create', 'Plan your next 90 days and contribute one template or worked example back to learners.'),
    ]
    summary = f'{c["title"]}: {c["practice_70"]}'
    top = (f'<div class="cb-facts"><span class="pill lv">{LNAME[lvl]}</span><span class="pill">{hhmm(total)} h total</span>'
           f'<span class="pill">{e(c["length"])}</span><span class="pill">Practice {do} h · Share {sh} h · Study {st} h</span>'
           f'<span class="pill pr">USD 39 per learner per month, or USD 79 with mentor review</span></div>')
    about = sec('', 'ab', 'about this course', 'What you will be able to do',
        top + f'<p class="kit-intro">{e(summary)}</p><ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outcomes) + '</ul>'
        + f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(c["practice_70"])}</p></div>'
        f'<div><h4>Condition</h4><p>About {total} hours over {e(c["length"].split(",")[-1].strip())}. Own tools, free spreadsheet and form tools, and a real practice partner. Mentor and peer circle available. Currency written on every number.</p></div>'
        f'<div><h4>Standard</h4><p>Evidence reviewed by a mentor; at least 70% on the 10-question check; two written peer reviews given; every number carries its currency and unit.</p></div></div>'
        + '<h3 class="ws-h3">Who it is for, requirements and materials</h3><ul>'
        + f'<li><strong>Who it is for:</strong> learners aged 16 and over, small-business starters, workers moving to a new field, and teams (see <a href="b2b.html">B2B</a>, <a href="b2c.html">B2C</a>, <a href="d2c.html">D2C</a>).</li>'
        + f'<li><strong>Requirements:</strong> ' + ('none; start here.' if not pre else f'finish <a href="{SLUG(pre)}">{e(pre["title"])}</a> first, or show equivalent work.') + '</li>'
        + '<li><strong>Materials included:</strong> lesson text, worked examples, case exercise, 10-question check, templates in My page.</li>'
        + '<li><strong>Teaching team:</strong> a trainer from our network, a mentor who reviews your evidence, and a peer circle. Names are given at enrolment.</li></ul>')
    mods = ''
    for x in L:
        z, v = BLOOM[x['stage']]
        mods += (f'<details class="mod" {"open" if x["n"]==1 else ""}><summary><span class="mn">Module {x["n"]}</span> {e(x["title"])} '
                 f'<span class="pill">{e(x["stage"])}</span><span class="pill">{KIND[x["kind"]]} · {x["h"]} h</span><span class="pill bz">{z}</span></summary>'
                 + (f'<p><strong>Goal:</strong> {e(x["goal"])}</p>' if x['goal'] else '')
                 + md_block(x['body']) + (f'<p class="evi"><strong>Evidence you keep:</strong> {e(x["ev"])}</p>' if x['ev'] else '') + '</details>')
    modules = sec('alt', 'md', 'lesson by lesson', f'{len(L)} modules, in the order you do them', mods)
    ex = ''
    for t, b in P['extra']:
        if t.startswith('Rules'): continue
        ex += f'<details class="mod"><summary>{e(t)}</summary>{md_block(b)}</details>'
    rules = next((md_block(b) for t, b in P['extra'] if t.startswith('Rules')), '')
    practice = sec('', 'px', 'practice material and assessment', 'Worked examples, case, check and local law pointers', ex + (f'<h3 class="ws-h3">Rules for this course</h3>{rules}' if rules else ''))
    locs = sec('alt', 'lc', 'ten locations and global', 'Your place: localised for each region',
        f'<p>Open your location. The global version is the default: {e(GLOBAL["note"])}</p>'
        + ''.join(loc_box(c, l) for l in LOC) + f'<details class="loc"><summary>Russian Federation</summary><p>{e(RUSSIA)}</p></details>')
    ladder = sec('', 'ld', 'where next', 'Ladder: Foundation, Practitioner, Expert',
        f'<ol class="ws-chips"><li>Foundation: short units in {e(c["grp"])}</li><li>Practitioner: this course ({LNAME[lvl]})</li><li>Expert: advanced practice and research (L{min(lvl+2,7)})</li></ol>'
        + '<p>Credits stack. You can step in and out. Aligned with the national policy approach to credits and multiple entry and exit points; not an accredited qualification.</p>'
        + f'<p><a class="btn" href="b2c.html">Find similar courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'
        + '<p class="ws-note">Draft course. Pricing, levels and wording are for the owner to confirm. Nothing is live.</p>')
    page(SLUG(c), c['title'] + ' (course)', summary[:150], c['title'], e(summary),
         about + modules + practice + locs + ladder,
         crumb(('Courses', 'courses-hub.html'), (c['grp'], None)), kicker=f'{c["id"]} · {c["grp"]}')
    return True

# ---------- card lists ----------
def card(c, aud=''):
    return (f'<li class="cc" data-g="{e(c["grp"])}" data-l="{c["level"]}" data-t="{e((c["title"]+" "+c["grp"]).lower())}">'
            f'<a href="{SLUG(c)}"><span class="pill lv">{LNAME[c["level"]]}</span><h3>{e(c["title"])}</h3>'
            f'<p>{e(c["practice_70"][:140])}</p><p class="cm">{e(c["length"])} · USD 39 / 79 per learner per month</p></a></li>')
FILTER_JS = ('<script>(function(){var q=document.getElementById("q"),g=document.getElementById("g"),l=document.getElementById("l"),n=document.getElementById("n");'
             'function f(){var c=0;document.querySelectorAll("li.cc").forEach(function(x){var ok=(!q.value||x.dataset.t.indexOf(q.value.toLowerCase())>-1)&&(!g.value||x.dataset.g==g.value)&&(!l.value||x.dataset.l==l.value);x.hidden=!ok;if(ok)c++});n.textContent=c+" courses shown"}'
             '[q,g,l].forEach(function(x){x.addEventListener("input",f)});f()})()</script>')
def filters(lst):
    gs = sorted({c['grp'] for c in lst}); ls = sorted({c['level'] for c in lst})
    return ('<form class="cf" onsubmit="return false"><label>Search <input id="q" type="search"></label>'
            '<label>Subject <select id="g"><option value="">All</option>' + ''.join(f'<option>{e(x)}</option>' for x in gs) + '</select></label>'
            '<label>Level <select id="l"><option value="">All</option>' + ''.join(f'<option value="{x}">{LNAME[x]}</option>' for x in ls) + '</select></label>'
            '<p id="n" class="note" aria-live="polite"></p></form>')
def hub(fn, h1, lead, intro, lst, crumbs, extra_top='', kicker='courses'):
    body = sec('', 'in', 'how it works', 'What you get', intro) + extra_top + sec('alt', 'ls', 'courses', f'{len(lst)} full courses', filters(lst) + '<ul class="cgrid">' + ''.join(card(c) for c in lst) + '</ul>' + FILTER_JS)
    page(fn, h1, lead[:150], h1, e(lead), body, crumbs, kicker)

# ---------- school plans ----------
rows = list(csv.DictReader(open(Dt / 'school-scope.csv')))
plans = collections.OrderedDict()
for r in rows: plans.setdefault((r['plan'], r['subject']), []).append(r)
def band(plan):
    if plan.startswith('esl'): return 'esl'
    if plan.startswith('grade-'):
        g = plan.split('-')[1]
        n = int(re.match(r'\d+', g).group())
        return 'primary' if n <= 5 else 'secondary' if n <= 10 else 'post'
    return 'post'
BANDS = {'esl': ('ESL, English as a second language', 'All ages', 'learners-esl.html'),
         'primary': ('Primary', 'Ages 5 to 11 (default; you can change it)', 'learners-primary.html'),
         'secondary': ('Secondary', 'Ages 11 to 16 (default)', 'learners-secondary.html'),
         'post': ('Post-secondary', 'Ages 16 to 18 (default)', 'learners-post-secondary.html')}
def plan_label(p):
    if p.startswith('esl'): return 'ESL level ' + p[-2:].upper()
    g = p.replace('grade-', '').replace('-', ' ')
    return 'Grade ' + g.title()
def school_slug(p, s): return 'school-' + re.sub(r'[^a-z0-9]+', '-', (p + '-' + s).lower()).strip('-') + '.html'
def school_page(p, s, rs):
    wk = sum(int(r['weeks']) for r in rs)
    items = ''.join(f'<details class="mod"><summary><span class="mn">Unit {i+1}</span> {e(r["unit"])} <span class="pill">Weeks {r["first_week"]} to {r["last_week"]}</span></summary>'
                    f'<p><strong>By the end you will:</strong> {e(r["outcome"])}.</p>'
                    f'<p><strong>Do:</strong> practise it in class tasks and a short activity; keep one piece of evidence.</p>'
                    f'<p><strong>Check:</strong> teacher observation plus the formative or summative assessment for this unit (see the assessment plan below).</p></details>'
                    for i, r in enumerate(rs))
    b = BANDS[band(p)]
    body = (sec('', 'ab', 'about this course', 'Aim and shape', f'<div class="cb-facts"><span class="pill">{e(b[0])}</span><span class="pill">{len(rs)} units</span><span class="pill">{wk} weeks of teaching</span><span class="pill">36-week school year</span></div>'
                  '<p>Every unit has an outcome that starts with an action verb. Units run in the order shown. Classroom tasks are practical and short; the teacher keeps observation notes.</p>'
                  '<h3 class="ws-h3">Assessment plan</h3><p>Formative checks FA1 to FA4 around weeks 6, 12, 24 and 30; summative checks SA1 in week 18 and SA2 in week 36. International school standard, our own wording.</p>')
            + sec('alt', 'un', 'unit by unit', f'{len(rs)} units', items)
            + sec('', 'lc', 'ten locations and global', 'Localised for your place', '<p>Teach in the local language first, with English support. Use local currency, units and examples in every worksheet. '
                  'Local curriculum and ministry rules are checked before use in a school; Arabic, Islamic, Social and Moral content needs licensed educators and ministry review. '
                  'Child-safety rules apply for every learner under 18.</p>' + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Use {L["cur"]} in money problems; deliver in {e(L["lang"])}; personal data rule: {e(L["data"])}; guardian contact for every learner under 18.</p></details>' for L in LOC)))
    page(school_slug(p, s), f'{plan_label(p)} {s}', f'{plan_label(p)} {s}: {len(rs)} units with outcomes and assessment plan', f'{plan_label(p)}: {s}',
         e(f'{len(rs)} units across the school year, each with an outcome, a practice task and a check.'), body,
         crumb(('Learners', 'learners.html'), (b[0], b[2]), (f'{plan_label(p)} {s}', None)), kicker='school course')
def school_card(p, s, rs):
    return (f'<li class="cc"><a href="{school_slug(p, s)}"><span class="pill lv">{e(plan_label(p))}</span><h3>{e(s)}</h3>'
            f'<p>{len(rs)} units · {sum(int(r["weeks"]) for r in rs)} weeks</p><p class="cm">{e(rs[0]["outcome"][:110])}</p></a></li>')

# ---------- main ----------
def main():
    built = [c for c in courses if course_page(c)]
    for (p, s), rs in plans.items(): school_page(p, s, rs)
    adult = built
    c_by = {c['id']: c for c in adult}
    ug = [c for c in adult if 2 <= c['level'] <= 4]; pg = [c for c in adult if c['level'] >= 4]
    phd = [c for c in adult if c['level'] >= 5]; sysl = [c for c in adult if SENIOR.search(c['title'])]
    # B2B / B2C / D2C
    hub('b2b.html', 'B2B: courses for organisations and training partners',
        'Train a team, a department or a whole workforce with real courses. Every course ends in evidence your managers can review.',
        '<ul class="ticks"><li><strong>Teams of 5 to 500.</strong> Seat plans, cohort dates and a manager view of progress and evidence.</li><li><strong>Task, condition and standard</strong> for every practical unit, so you know what good looks like.</li><li><strong>Ten locations plus global.</strong> Each course opens with local currency, law pointers and practice partners.</li><li><strong>Price:</strong> USD 39 per learner per month, USD 79 with mentor review. No auto-renew; 14-day refund.</li><li>Training partners can <a href="partner.html">contribute courses</a> and trainers.</li></ul>', adult, crumb(('Courses', 'courses-hub.html'), ('B2B', None)), kicker='for organisations')
    hub('b2c.html', 'B2C: courses for learners on our marketplace',
        'Pick a course, learn at your own pace, keep your evidence in My page. Real tasks, real feedback.',
        '<ul class="ticks"><li><strong>Learn on the marketplace.</strong> Browse by subject and level, then join.</li><li><strong>Stack credits:</strong> foundation, practitioner, expert. Step in and out.</li><li><strong>Earn while you learn:</strong> contribute a template or worked example and earn credits (rates to be confirmed).</li><li><strong>Price:</strong> USD 39 per learner per month, USD 79 with mentor review; USD 5 a year membership.</li></ul>', adult, crumb(('Courses', 'courses-hub.html'), ('B2C', None)), kicker='for individual learners')
    hub('d2c.html', 'D2C: learn direct from House for Learning',
        'Straight from us to you: no middle step. Start on your phone, pay by bank or UPI, and keep going with a mentor and a circle.',
        '<ul class="ticks"><li><strong>Direct enrolment</strong> with House for Learning; one account, one My page.</li><li><strong>Phone first, offline friendly,</strong> many languages.</li><li><strong>Family and senior friendly:</strong> short steps, large text, calm pace.</li><li><strong>Payment:</strong> bank and UPI only; 14-day refund; no auto-renew.</li></ul>', adult, crumb(('Courses', 'courses-hub.html'), ('D2C', None)), kicker='direct to learner')
    # learner groups
    gl = {}
    for k, (name, ages, fn) in BANDS.items():
        lst = [(p, s, rs) for (p, s), rs in plans.items() if band(p) == k]
        body = sec('', 'in', 'ages and levels', 'Who this is for', f'<p><strong>{e(ages)}.</strong> The owner has not fixed the age range; this is our default and can be changed in one place.</p><p>Every course has weekly units, outcomes that start with an action verb, practice tasks, and assessments at set weeks.</p>') \
            + sec('alt', 'ls', 'courses', f'{len(lst)} courses', '<ul class="cgrid">' + ''.join(school_card(p, s, rs) for p, s, rs in lst) + '</ul>')
        page(fn, name, f'{name} courses: {len(lst)} full courses', name, e(f'{ages}. {len(lst)} full courses with units and outcomes.'), body, crumb(('Learners', 'learners.html'), (name, None)), 'learner group')
    def adult_group(fn, name, ages, lst, why):
        hub(fn, name, f'{ages}. {why}', '<p>' + e(why) + '</p><p>Age range is our default; the owner can change it.</p>', lst, crumb(('Learners', 'learners.html'), (name, None)), kicker='learner group')
    adult_group('learners-ug.html', 'UG: undergraduate learners', 'Ages 18 to 22 (default)', ug, 'Foundation and practitioner courses (L2 to L4) that build skills, credits and a portfolio alongside a degree.')
    adult_group('learners-pg.html', 'PG: postgraduate and working learners', 'Age 21 and over (default)', pg, 'Practitioner and specialist courses (L4 to L5) for graduates and working people moving up.')
    adult_group('learners-phd.html', 'PhD and systemic learners (seniors)', 'Age 25 and over; seniors are called systemic learners', phd + [c for c in sysl if c not in phd], 'Specialist courses (L5) for research-minded learners, plus courses chosen for seniors: calm pace, large text, hands-on, experience-led.')
    # learners index + courses hub
    items = ''.join(f'<li class="cc"><a href="{fn}"><h3>{e(n)}</h3><p>{e(a)}</p></a></li>' for n, a, fn in BANDS.values())
    items += ''.join(f'<li class="cc"><a href="{fn}"><h3>{e(n)}</h3><p>{e(a)}</p></a></li>' for fn, n, a in [('learners-ug.html', 'UG', 'Ages 18 to 22 (default)'), ('learners-pg.html', 'PG', 'Age 21 and over (default)'), ('learners-phd.html', 'PhD and systemic learners (seniors)', 'Age 25 and over')])
    page('learners.html', 'Courses for every learner group', 'ESL, Primary, Secondary, Post-secondary, UG, PG, PhD and systemic learners', 'Courses for every learner group', e('Pick your group. Age ranges are defaults and can be changed.'),
         sec('', 'g', 'groups', 'Seven learner groups', '<ul class="cgrid">' + items + '</ul>'), crumb(('Courses', 'courses-hub.html'), ('Learners', None)))
    page('courses-hub.html', 'Courses', 'Full courses for organisations, learners and families', 'Courses', e(f'{len(adult)} full adult and business courses and {len(plans)} school courses, each localised for ten places and global.'),
         sec('', 'w', 'ways to learn', 'Choose how you learn', '<ul class="cgrid"><li class="cc"><a href="b2b.html"><h3>B2B</h3><p>For organisations and training partners</p></a></li><li class="cc"><a href="b2c.html"><h3>B2C</h3><p>For learners on the marketplace</p></a></li><li class="cc"><a href="d2c.html"><h3>D2C</h3><p>Direct from House for Learning</p></a></li><li class="cc"><a href="learners.html"><h3>By learner group</h3><p>ESL to PhD and systemic learners</p></a></li></ul>'),
         crumb(('Courses', None)))
    print('adult courses', len(adult), 'school courses', len(plans), 'groups', len(BANDS) + 3)
main()
