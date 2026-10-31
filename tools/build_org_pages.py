"""Rebuild the organisation pages (organisations, workplace, academies, sectors + 12 sector pages,
services hub, how-we-help, partner) from the content below. Keeps each page's head, menu, footer and
pager; replaces <main>. Run from the repo root: python3 tools/build_org_pages.py
Wording comes from the Wix capture and knowledge-base/content-packs/hfl.md, in our own words."""
import json, re, html

SITE = 'site/'
E = html.escape

def read(f): return open(SITE + f, encoding='utf-8').read()

def hero(kicker, h1, lead, ctas=''):
    c = f'<div class="ctas">{ctas}</div>' if ctas else ''
    return (f'<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">{kicker}</p>'
            f'<h1 id="h1">{h1}</h1><p>{lead}</p>{c}</div></div></section>')

_n = [0]
def split(kicker, h2, body, lead='', alt=False, sid=None, full=False):
    _n[0] += 1
    sid = sid or f's{_n[0]}'
    ld = f'<p class="o-lead">{lead}</p>' if lead else ''
    cls = 'wrap o-full' if full else 'wrap o-split'
    return (f'<section class="sec{" alt" if alt else ""}" id="{sid}" aria-labelledby="{sid}-h"><div class="{cls}">'
            f'<div class="o-head"><p class="kicker">{kicker}</p><h2 id="{sid}-h">{h2}</h2>{ld}</div><div class="o-body">{body}</div></div></section>')

def rows(items, numbered=True):
    out = ['<ol class="o-rows">' if numbered else '<ul class="o-rows plain">']
    for i, (t, p) in enumerate(items, 1):
        n = f'<span class="n">{i:02d}</span>' if numbered else ''
        out.append(f'<li>{n}<div><h3>{t}</h3><p>{p}</p></div></li>')
    out.append('</ol>' if numbered else '</ul>')
    return ''.join(out)

def grid(items):
    out = ['<ul class="o-grid">']
    for it in items:
        t, p = it[0], it[1]
        href = it[2] if len(it) > 2 else None
        h = f'<a href="{href}">{t}</a>' if href else t
        more = f'<a class="o-more" href="{href}">Read more</a>' if href else ''
        out.append(f'<li><h3>{h}</h3><p>{p}</p>{more}</li>')
    out.append('</ul>')
    return ''.join(out)

def steps(items):
    return '<ol class="o-steps">' + ''.join(f'<li><h3>{t}</h3><p>{p}</p></li>' for t, p in items) + '</ol>'

def bullets(items):
    return '<ul class="o-bullets">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'

def band(kicker, h2, body):
    return f'<section class="o-band"><div class="wrap"><p class="kicker">{kicker}</p><h2>{h2}</h2>{body}</div></section>'

def cta(kicker, h2, p, btns):
    return (f'<section class="cta" aria-labelledby="cta-h"><div class="wrap cta-inner"><div><p class="kicker">{kicker}</p>'
            f'<h2 id="cta-h">{h2}</h2><p>{p}</p><div class="ctas">{btns}</div></div></div></section>')

def btn(href, text, ghost=False):
    return f'<a class="btn{" btn-ghost" if ghost else ""}" href="{href}">{text}</a>'

def write(f, main, title=None, desc=None, crumb=None):
    s = read(f)
    pager = re.search(r'<nav class="pager".*?</nav>', s, re.S)
    pager = pager.group(0) if pager else ''
    s = re.sub(r'<main.*?</main>', lambda m: '<main id="main" tabindex="-1">' + main + pager + '</main>', s, flags=re.S)
    if 'assets/org-lux.css' not in s:
        s = s.replace('<link rel="stylesheet" href="assets/site-lux.css">',
                      '<link rel="stylesheet" href="assets/site-lux.css">\n<link rel="stylesheet" href="assets/org-lux.css">')
    if title:
        s = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', s, 1)
        s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + title, s)
    if desc:
        s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + E(desc), s)
        s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + E(desc), s)
    open(SITE + f, 'w', encoding='utf-8').write(s)

CONTACT = 'contact.html#message-form'

# ---------------------------------------------------------------- organisations
def organisations():
    m = hero('for teams and partners', 'Learning built around your work',
             'Employers, institutions, small businesses and community groups can use our units, ladders and live classes for their own people.',
             btn(CONTACT, 'Talk to us') + btn('#tenders', 'Send a tender', True))
    m += split('who we work with', 'Four kinds of partner', rows([
        ('Employers and small businesses', 'Onboarding ladders and skill paths shaped around the roles in your team.'),
        ('Schools, colleges and academies', 'Blended units and live classes alongside your own teaching.'),
        ('Trainers', 'Train the trainer: learn to teach, coach and assess others with our units.'),
        ('Community groups', 'Learning for people who are often left out, close to where they live.')]),
        lead='Employers, institutions, trainers and community groups can all use our units, ladders and live classes.')
    m += split('how it works', 'From first call to first results', steps([
        ('Talk', 'Tell us about your people, roles and goals.'),
        ('Plan', 'We map your roles to units and an onboarding ladder.'),
        ('Run', 'Online units, practice and live classes, mixed 70-20-10: seventy parts practice, twenty social and mentoring, ten formal learning.'),
        ('Review', 'Every term we check results, feedback and safety, and adjust.')]), alt=True, full=True)
    m += split('for employers', 'What employers get, and what we ask', rows([
        ('Ladders for your roles', 'Onboarding steps 0 to 3 shaped around the jobs in your team.'),
        ('Evidence of skills', 'Quizzes and observed tasks show what each person can do, on their own record.'),
        ('Safety first', 'Safety units before hands-on work, and supervised practice on training rigs.'),
        ('Learn and earn', 'Planned routes where your people study and work on real projects side by side.')])
        + '<p class="o-note">In return we ask employers to protect study time, to supervise practical work safely, and to respect each learner’s privacy choices.</p>',
        sid='employers')
    m += band('partner programme', 'Four tiers, checked every quarter',
              '<p>Partners join at one of four levels, from partner and affiliate to value provider, in a hub-and-spoke network. Each level has a memorandum checklist, and every partner is reviewed once a quarter.</p>'
              '<div class="o-links">' + btn('partner.html', 'Partner with us') + btn('how-we-help.html', 'How we help', True) + '</div>')
    m += split('tenders and proposals', 'Training tenders and requests for proposal',
               '<p>Organisations can invite us to bid for training, learning platforms or campus programmes. Send your tender pack through the contact form.</p>'
               + steps([('Send', 'The tender pack, the closing date and a contact person.'),
                        ('Acknowledge', 'We reply within one working day and name the person handling it.'),
                        ('Clarify', 'We ask our questions in writing, before the closing date.'),
                        ('Propose', 'A written proposal in your format, with prices, plan and how we measure results.')])
               + '<div class="o-links">' + btn(CONTACT, 'Send a tender') + '</div>', sid='tenders', full=True)
    m += split('white-label editions', 'Our learning area, under your own name',
               '<p>An organisation can run a white-label edition of our learning area: the same units, ladders and live classes, shown in its own design and under its own name, with its own contact address.</p>'
               '<p>Each edition is kept separate: its learners see only that organisation’s name and pages, and their records stay apart from every other edition. Questions about an edition go to the contact shown on that organisation’s site.</p>',
               alt=True, sid='white-label')
    m += split('privacy', 'Insights for teams, never private answers',
               '<p>Organisations see learning insights at team level, and only for groups large enough that no one can be singled out. Private questions a learner asks stay private.</p>'
               '<p>A learner shares insights with their organisation only if they switch that on.</p>')
    m += split('explore', 'More for organisations', '<ul class="o-mini">' + ''.join(
        f'<li><a href="{h}">{t}</a></li>' for h, t in [('workplace.html', 'Workplace'), ('academies.html', 'Technical academies'),
        ('sectors.html', 'Sectors we serve'), ('services.html', 'Services'), ('how-we-help.html', 'How we help'), ('partner.html', 'Partner with us')]) + '</ul>', alt=True)
    m += cta('your next step', 'Plan learning for your team', 'Choose “Learning for my organisation” or “Become a trainer or partner” on the form.', btn(CONTACT, 'Contact form'))
    write('organisations.html', m)

# ---------------------------------------------------------------- workplace
def workplace():
    m = hero('marketplace and workplace', 'Where learning becomes work',
             'The workplace joins people to real tasks. Every task has a clear condition and standard, so you know what good looks like and are recognised when you reach it.',
             btn('career-pathways.html', 'Career pathways') + btn('organisations.html', 'For organisations', True))
    m += split('how work is organised', 'Task, condition, standard', rows([
        ('Task', 'A clear piece of work with a defined outcome.'),
        ('Condition', 'The tools, time, safety and support available.'),
        ('Standard', 'How good the result must be, so it can be checked fairly.'),
        ('Record', 'Work done to standard is added to your record.')]),
        lead='Skills of many people are joined with automated systems to solve a task to a stated condition and standard.')
    m += split('make and check', 'The system makes, you check',
               '<p>The system makes an output. The learner or manager checks and approves it, or sends it round again to improve it. An ask-me-anything coach answers questions from trusted libraries and public information.</p>'
               '<p>Mentors and facilitators guide professional, academic, vocational, entrepreneurial and recreational goals.</p>', alt=True)
    m += split('who it is for', 'For people and for teams', rows([
        ('Individuals', 'Find tasks that fit your skills and grow your record.'),
        ('Teams and organisations', 'Build learning around real roles and see team-level insights only.'),
        ('Mentors and facilitators', 'Guide others and be recognised for it.')], numbered=False))
    m += band('the journey', 'Idea, action, value, empowerment, regeneration',
              '<p>Every pathway follows the same five steps, across seven sides of a life: professional, academic, vocational, entrepreneurial, employer or employee, resilience and recreation.</p>'
              '<div class="o-links">' + btn('pathways.html', 'See the pathways') + btn('marketplace.html', 'Marketplace', True) + '</div>')
    m += split('what sits around it', 'One place to learn, work and trade', bullets([
        'A business suite for planning, customers, reporting and office tools, with no-code apps',
        'Open-standard course and career pathways joined to a marketplace and a workplace',
        'Consultancy, channel and support services',
        'A partner, affiliate and value-provider network in four levels',
        'Artificial intelligence, machine learning, big data and analytics']), alt=True)
    m += cta('your next step', 'Pilot the workplace with us', 'Tell us about your team and the work you need done.', btn('contact.html', 'Contact us'))
    write('workplace.html', m)

# ---------------------------------------------------------------- academies
def academies():
    m = hero('technical academies', 'Specialist learning, built role by role',
             'Engineering, manufacturing, energy, digital systems and cybersecurity, as programmes become available.',
             btn(CONTACT, 'Ask about an academy') + btn('executive-programme.html', 'Executive programme', True))
    m += split('what an academy offers', 'Learning built around a job', rows([
        ('Role-based programmes', 'Safety first, then skills, then supervised practice.'),
        ('Practical learning', 'Workshops and training rigs with a qualified supervisor present.'),
        ('Evidence of skill', 'Assessed tasks that show what each person can do.'),
        ('Custom academies', 'An academy shaped for one organisation, by enquiry.')]),
        lead='Seventy parts practice, twenty parts mentoring, ten parts formal learning, with one coach for every ten to twenty learners.')
    m += split('how programmes are sized', 'From one hour to a doctorate',
               '<ul class="o-rows plain">' + ''.join(f'<li><div><h3>{a}</h3><p>{b}</p></div></li>' for a, b in [
                   ('Short module', '1 hour to 1 month'), ('Long module', '1 to 3 months'), ('Learning course', '3 to 6 months'),
                   ('Diploma', '12 months'), ('Advanced diploma', '24 months'), ('Undergraduate', '36 to 48 months'),
                   ('Postgraduate', '12 or 24 months'), ('Doctorate', '36 to 60 months')]) + '</ul>'
               '<p class="o-note">Lifelong learning has no end and stacks into all of these. Small credentials add up to larger ones.</p>', alt=True)
    m += band('train the trainer', 'Diagnose, develop, certify, sustain',
              '<p>A standard teaching method for measurable efficiency, safety and performance. A facilitator starts with a baseline of technical and teaching skill, builds pedagogy and scenario facilitation, is assessed against objective rubrics, and is re-checked through feedback and requalification.</p>'
              + rows([('101 Instructional excellence', 'Adult learning, cognitive load, simulator and scenario instruction, and blameless debriefs.'),
                      ('102 Technical evaluation', 'Rubric design, digital-twin assessments, safety-critical task analysis and performance data.'),
                      ('103 Human factors', 'Ergonomics, human factors and safety.')])
              + '<p>Lectures are capped at twenty percent of teaching time; at least eighty percent is hands-on practice and scenarios.</p>')
    m += split('honest status', 'Planned, not yet open',
               '<p>No dates, fees or qualifications are promised on this page. An academy opens only after its content, supervisors and assessments are approved.</p>')
    m += cta('your next step', 'Tell us what you need', 'Describe the roles and skills, and we will say honestly what we can offer and when.', btn(CONTACT, 'Contact form'))
    write('academies.html', m)

# ---------------------------------------------------------------- sectors
SECTORS = [
 ('sector-education', 'Education and development', 'Schools, learning places and programmes for people of every ability.'),
 ('sector-sustainability', 'Sustainability', 'Safe, smart, secure and sustainable technology for small economies and villages.'),
 ('sector-space', 'Outer space projects', 'Holding and managing ventures that work in and around space.'),
 ('sector-commercial', 'Commercial enterprises and management', 'Trade, transport, contracting and finance businesses, held and managed together.'),
 ('sector-agriculture', 'Agricultural enterprises and management', 'Farming, fisheries, land and markets for crops.'),
 ('sector-sport', 'Sport enterprises and development', 'Sports grounds, facilities and projects.'),
 ('sector-health-tech', 'Technology for life sciences and healthcare', 'Health, environment, digital and artificial intelligence ventures.'),
 ('sector-msme', 'Micro, small and medium enterprises', 'Keeping small businesses agile, profitable and skilled.'),
 ('sector-energy-ict', 'Technology for energy, communications and connected devices', 'Information, communication, energy and connected-device ventures.'),
 ('sector-industry', 'Industrial enterprises and management', 'Industry, extraction and converting businesses.'),
 ('sector-energy-fuels', 'Oil and natural gas projects', 'Oil and gas projects, held and managed together.'),
 ('sector-water', 'Water enterprises and development', 'Water infrastructure and projects.'),
]
# course ids (from data/catalogue.json) that relate to each sector, matched by title keyword
KEYS = {
 'sector-education': ['learning', 'tutor', 'school', 'education', 'teach', 'child'],
 'sector-sustainability': ['solar', 'wind', 'biofuel', 'recycl', 'sustainab', 'waste', 'environment'],
 'sector-space': ['space', 'drone', 'satellite'],
 'sector-commercial': ['e-commerce', 'marketplace', 'inventory', 'trading', 'distribution', 'selling', 'subscription'],
 'sector-agriculture': ['agricult', 'farm', 'fish', 'food', 'crop'],
 'sector-sport': ['fitness', 'sport'],
 'sector-health-tech': ['medical', 'therapy', 'dna', 'stem cell', 'fitness', 'health'],
 'sector-msme': ['small business', 'lead generation', 'e-commerce', 'handmade', 'managed services'],
 'sector-energy-ict': ['iot', 'internet', 'wind', 'solar', 'charging', 'electric', 'artificial intelligence'],
 'sector-industry': ['machinery', 'robotics', '3d printing', 'construction', 'industrial'],
 'sector-energy-fuels': ['biofuel', 'fuel', 'energy'],
 'sector-water': ['water'],
}
SERVICE_LINKS = {
 'sector-education': [('service-edtech.html', 'EdTech'), ('service-life-long-learning.html', 'Life Long Learning')],
 'sector-msme': [('service-msmetech.html', 'MSMETech'), ('service-smetech.html', 'SMETech')],
 'sector-energy-ict': [('service-emtech.html', 'EmTech')],
 'sector-health-tech': [('service-emtech.html', 'EmTech')],
 'sector-sustainability': [('service-emtech.html', 'EmTech')],
}

def load_courses():
    d = json.load(open('data/catalogue.json'))
    out = []
    for c in d['courses']:
        out.append((c['id'], c['title'], 'course-' + c['id'].lower() + '.html'))
    for c in d['chapters']:
        out.append((c['id'], c['title'], 'course-' + c['id'].lower() + '.html'))
    return out

def sectors():
    m = hero('sectors we serve', 'Twelve sectors, one learning platform',
             'Skills, careers and enterprise support for each.',
             btn('join.html', 'Join') + btn('partner.html', 'Partner with us', True))
    m += split('the twelve', 'Pick a sector', grid([(t, p, f + '.html') for f, t, p in SECTORS]),
               lead='Twelve sectors, one learning platform.', full=True)
    m += cta('not sure where you fit?', 'Tell us what you do', 'We will point you to the right pathway.',
             btn('join.html', 'Join') + btn('partner.html', 'Partner with us', True) + btn('contact.html', 'Contact', True))
    write('sectors.html', m)

    courses = load_courses()
    for f, title, short in SECTORS:
        s = read(f + '.html')
        body = re.search(r'id="s-h">.*?</h2></div><div class="sec-body">(.*?)</div></div></section>', s, re.S)
        if not body:  # already rebuilt: keep the stored text
            body = re.search(r'<div class="o-body">(.*?)</div></div></section>', s, re.S)
        text = body.group(1)
        text = re.sub(r'<p class="ws-note">.*?</p>', '', text)
        ps = re.findall(r'<p>.*?</p>', text, re.S)
        lead = re.sub(r'</?p>', '', ps[0]) if ps else short
        rest = ''.join(ps[1:])
        rel = []
        for cid, ct, href in courses:
            if any(k in ct.lower() for k in KEYS[f]):
                rel.append((href, f'{ct}'))
        rel = rel[:12]
        m = hero('sectors we serve', title, short, btn('join.html', 'Join') + btn('partner.html', 'Partner with us', True))
        m += split('what it covers', 'In this sector', rest, lead=lead)
        if rel:
            m += split('learn in this sector', 'Related courses',
                       '<ul class="o-mini">' + ''.join(f'<li><a href="{h}">{E(t)}</a></li>' for h, t in rel) + '</ul>'
                       '<p class="o-note">Course outlines are drafts and are not yet open for enrolment.</p>', alt=True)
        svc = SERVICE_LINKS.get(f)
        if svc:
            m += split('services', 'Where to start', '<ul class="o-mini">' + ''.join(f'<li><a href="{h}">{t}</a></li>' for h, t in svc) + '</ul>')
        m += cta('next', 'Work with us', 'Join as a learner, partner with us, or write to us about your sector.',
                 btn('join.html', 'Join') + btn('partner.html', 'Partner with us', True) + btn('contact.html', 'Contact', True))
        write(f + '.html', m)

# ---------------------------------------------------------------- services, partner, how we help
SERVICES = [
 ('service-introduction', 'Introduction', 'A one-hour taster of how we teach and what you can learn.', '1 hour'),
 ('service-smetech', 'SMETech', 'A holistic approach that promotes stakeholder collaboration, with fast-growing skills in business, sales, IT, creative learning, learning design and engineering.', ''),
 ('service-edtech', 'EdTech', 'Empowering individuals and institutions to learn it to earn it, in school and after school, live or at your own pace.', ''),
 ('service-emtech', 'EmTech', 'Basic to advanced skills: AI, machine learning, connected devices and big-data analytics, with themes of healthcare, climate and sustainability.', ''),
 ('service-msmetech', 'MSMETech', 'Sustainable upskilling and reskilling in micro, small and medium businesses: core skills, trending-skill certification and employability programmes.', ''),
 ('service-life-long-learning', 'Life Long Learning', 'Enhance yourself through digitisation, with photography, film, music, performing and visual arts, multimedia, interior and fashion design.', ''),
]

def services():
    m = hero('services', 'Six ways to start', 'Programmes for people, small businesses and institutions.',
             btn(CONTACT, 'Ask a question'))
    m += split('our services', 'Pick a service', grid([(t, p, f + '.html') for f, t, p, _ in SERVICES]),
               lead='Learn and earn: bloom where you are planted.', full=True)
    m += cta('your next step', 'Not sure which one?', 'Tell us your goal and we will suggest a service.', btn(CONTACT, 'Contact form') + btn('partner.html', 'Partner with us', True))
    write('services.html', m)

def partner():
    m = hero('join us', 'Become a leader today', 'Choose a service, or talk to us about becoming a partner.',
             btn('contact.html', 'Contact us') + btn('organisations.html', 'For organisations', True))
    m += split('our services', 'Services', grid([(t, p, f + '.html') for f, t, p, _ in SERVICES]), full=True)
    m += band('partner programme', 'Four levels, one network',
              '<p>Partners, affiliates and value providers work together in a hub-and-spoke network in four levels. Each level has a memorandum checklist and a quarterly review.</p>'
              '<div class="o-links">' + btn('organisations.html', 'For organisations') + btn('how-we-help.html', 'How we help', True) + '</div>')
    m += split('contact us', 'Feel free to contact us about any queries',
               '<p>Use the contact form, or write to <a href="mailto:engage@hfl-pass.com">engage@hfl-pass.com</a>.</p><div class="o-links">' + btn('contact.html', 'Contact us') + '</div>', alt=True)
    write('partner.html', m)

def how_we_help():
    m = hero('about us', 'How we help', 'Skills, learning and market reach, joined up in one place.',
             btn('about.html', 'About us') + btn('contact.html', 'Contact us', True))
    m += split('our promise', 'Skills, learning and market reach',
               '<p>We help people and institutions across the world improve their skills, their learning and their reach into the market, using our digital enterprise platform, emerging technology and deep domain knowledge.</p>'
               '<p>Our approach is open: it works with many systems, software and hardware, and many ways of doing business. It is aligned with data-protection law, the UN Sustainable Development Goals, OECD guidance, and each country and community’s own rules.</p>',
               lead='Learn and earn: bloom where you are planted. Course and career pathways: your growth is our goal.')
    m += split('think digital', 'How our digital helpers work', rows([
        ('Reading', 'Understands what a text means.'),
        ('Understanding', 'Takes whole steps such as decisions and actions.'),
        ('Writing', 'Turns the system data into plain human language to reply.'),
        ('Make and check', 'The system makes the output; you check and approve it, or send it round again to improve it.'),
        ('Ask me anything coach', 'Takes your questions and uses the libraries and public information you use most, so you get the best set of answers.')]),
        lead='Skills of people are joined with automated systems and resources to make solutions and run them to the task and standard.', alt=True)
    m += split('two markets', 'School and after school',
               '<p>We serve school education, from kindergarten to grade 12, and after school: undergraduate, postgraduate and professional learning. In both, learning is live or at your own pace, on computers, tablets and phones.</p>')
    m += band('marketplace and workplace', 'One place to learn, work and trade',
              '<p>We believe in early use of new technology to meet big human problems in healthcare, climate and sustainability, and we give you a ready marketplace and workplace for building skills in new technology products and services.</p>'
              '<div class="o-links">' + btn('marketplace.html', 'Marketplace') + btn('workplace.html', 'Workplace', True) + btn('platform.html', 'The platform', True) + '</div>')
    m += split('what comes with it', 'A full suite', bullets([
        'Connected-device services and people',
        'Information and communication technology services and people',
        'A full business stack (planning, customers, reporting, office tools) with no-code tools, built on our own interfaces and apps',
        'An open-standards ecosystem of course and career pathways, joined to a marketplace and a workplace',
        'Consultancy, channel, business-operations, support and full-service ecosystem',
        'A partner, affiliate and value-provider network in four levels, hub and spoke',
        'Artificial intelligence and machine learning; big data and analytics']), alt=True)
    m += split('career pathways', 'Authoring, training, marketplace and workplace',
               '<p>Experienced mentors and facilitators guide your professional, academic, trade, business and leisure goals. Our artificial intelligence and game-style learning keep you engaged and joined up, with paths you can trace back and forth, so you can move freely and grow skilled while staying delighted.</p>'
               '<div class="o-links">' + btn('pathways.html', 'Pathways') + btn('sectors.html', 'Sectors', True) + '</div>')
    m += cta('see more', 'Authoring, training, learning, earning', 'Dive into any domain you want. Our AI and game-style learning keep you engaged.', btn('join.html', 'Join') + btn('contact.html', 'Contact us', True))
    write('how-we-help.html', m)

if __name__ == '__main__':
    organisations(); workplace(); academies(); sectors(); services(); partner(); how_we_help()
    print('done')
