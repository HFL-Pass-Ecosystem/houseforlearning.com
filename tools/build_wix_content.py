#!/usr/bin/env python3
"""Builds sectors.html, sector-<slug>.html, services.html, service-<slug>.html, how-we-help.html and team.html
from the text of the old site, rewritten in our own words (brand-neutral: no person names, no street address,
no old prices, no quotes). Run: python3 tools/build_wix_content.py
Draft: pages are noindex until the owner approves the wording."""
import re, html, pathlib
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'
e = html.escape
DRAFT = 'Draft wording, carried over from the old website. Prices are shown on the Membership page only.'
tpl = (S / 'catalogue.html').read_text()
if 'name="robots"' not in tpl or 'index,follow' in tpl:
    tpl = tpl.replace('<meta name="robots" content="index,follow">', '')
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)

def page(fn, title, desc, h1, lead, body, crumbs, kick):
    t = tpl
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, 1, re.S)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, 1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, 1)
    t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li>' + crumbs + '</ol>', t, 1, re.S)
    main = (f'<main id="main" tabindex="-1"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div>'
            f'<p class="kicker">{e(kick)}</p><h1 id="h1">{e(h1)}</h1><p>{e(lead)}</p></div></div></section>{body}</main>')
    t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, 1, re.S)
    (S / fn).write_text(t)

def sec(cls, i, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>'
note = f'<p class="ws-note">{e(DRAFT)}</p>'
def paras(ps): return ''.join(f'<p>{e(p)}</p>' for p in ps)
def bullets(xs): return '<ul class="ws-plist cl">' + ''.join(f'<li>{e(x)}</li>' for x in xs) + '</ul>'
def cards(items, base):
    return '<ul class="cards">' + ''.join(f'<li class="card"><h3><a href="{base}{s}.html">{e(t)}</a></h3><p>{e(d)}</p></li>' for s, t, d, _ in items) + '</ul>'
CTA = '<p><a class="btn" href="join.html">Join</a> <a class="btn btn-ghost" href="partner.html">Partner with us</a> <a class="btn btn-ghost" href="contact.html">Contact</a></p>'

# Sector text from the old home page flip cards, in our words. (slug, title, one line, paragraphs)
SECT = [
 ('education', 'Education and development', 'Schools, learning places and programmes for people of every ability.', [
  'This sector covers investment in learning places and in projects that build people up: schools and colleges, programmes for people with special needs and for children with autism, and work that grows knowledge and human development.',
  'It also covers the management and organising work that keeps those places running well.']),
 ('sustainability', 'Sustainability', 'Safe, smart, secure and sustainable technology for small economies and villages.', [
  'We help build the hardware, software, cloud, data and analytics skills needed to use safe, smart, secure and sustainable technology, with a focus on micro, small and medium economies.',
  'Rural and underserved communities come first, through village care and village adoption programmes. We work with government schemes, development programmes and charitable foundations to widen access to education and to reduce poverty.']),
 ('space', 'Outer space projects', 'Holding and managing ventures that work in and around space.', [
  'This sector covers holding companies that invest in, own and manage ventures working on space-related activity, using home or foreign capital.']),
 ('commercial', 'Commercial enterprises and management', 'Trade, transport, contracting and finance businesses, held and managed together.', [
  'This sector covers holding companies that invest in, own and manage businesses in trade, transport, contracting and finance.']),
 ('agriculture', 'Agricultural enterprises and management', 'Farming, fisheries, land and markets for crops.', [
  'This sector covers holding companies that own and manage farming businesses: land reclamation, animal and poultry farming, marketing of crops, and the use of fish and other sea resources.']),
 ('sport', 'Sport enterprises and development', 'Sports grounds, facilities and projects.', [
  'This sector covers holding companies that own, run and manage sports infrastructure and sports projects.']),
 ('health-tech', 'Technology for life sciences and healthcare', 'Health, environment, digital and artificial intelligence ventures.', [
  'This sector covers holding companies that set up and manage technology ventures in life sciences and healthcare, the environment, digital technology and artificial intelligence.']),
 ('msme', 'Micro, small and medium enterprises', 'Keeping small businesses agile, profitable and skilled.', [
  'Small businesses create jobs and support both the economy and society, and they must stay agile and profitable. New technology is making many old processes obsolete, and large firms are leaning on automation to cut headcount. Skill gaps follow.',
  'So small businesses need to build upskilling and reskilling into the way they work. We connect education providers, skills, workers, certifiers and employers in one joined-up approach.']),
 ('energy-ict', 'Technology for energy, communications and connected devices', 'Information, communication, energy and connected-device ventures.', [
  'This sector covers holding companies that set up and manage technology ventures in information and communications technology, energy and renewable energy, the environment, digital technology and artificial intelligence.']),
 ('industry', 'Industrial enterprises and management', 'Industry, extraction and converting businesses.', [
  'This sector covers holding companies that own and manage industrial, extraction and converting businesses.']),
 ('energy-fuels', 'Oil and natural gas projects', 'Oil and gas projects, held and managed together.', [
  'This sector covers holding companies that own and manage oil and natural gas projects and run them in an operating role.']),
 ('water', 'Water enterprises and development', 'Water infrastructure and projects.', [
  'This sector covers holding companies that own and manage water infrastructure and water projects and run them in an operating role.']),
]
SECT = [(s, t, d, p) for s, t, d, p in SECT]
for s, t, d, ps in SECT:
    body = sec('', 's-h', 'what it covers', t, paras(ps)) + sec('alt', 'n-h', 'next', 'Work with us', CTA + note)
    page(f'sector-{s}.html', t, d, t, d, body, '<li><a href="sectors.html">Sectors</a></li><li aria-current="page">' + e(t) + '</li>', 'sectors we serve')
page('sectors.html', 'Sectors we serve', 'The twelve sectors House for Learning works across.', 'Sectors we serve',
     'Twelve sectors, one learning platform: skills, careers and enterprise support for each.',
     sec('', 'all-h', f'{len(SECT)} sectors', 'Pick a sector', cards(SECT, 'sector-')) + sec('alt', 'n-h', 'next', 'Not sure where you fit?', '<p>Tell us what you do and we will point you to the right pathway.</p>' + CTA + note),
     '<li aria-current="page">Sectors</li>', 'sectors we serve')

# Services (old service pages), prices left out on purpose
SERV = [
 ('smetech', 'Skills for small and medium businesses', 'Fast-growing skills in business, sales, IT, creative learning, learning design and engineering.', [
  'Our work for small and medium businesses focuses on fast-growing skills: business, sales, information technology, creative learning, learning design and engineering.',
  'The aim is to give these businesses a head start towards their upskilling and reskilling goals, through close collaboration with everyone involved.']),
 ('edtech', 'Digital learning for people and institutions', 'Learn it to earn it: school years and beyond, live or in your own time.', [
  'Digital learning has grown quickly across the world, and the pandemic pushed it into formal schooling. It suits people who cannot afford the best of face-to-face teaching, so we see real promise in it.',
  'We work in two broad markets: school years (kindergarten to grade 12) and after school (undergraduate, postgraduate and professional courses).',
  'In both, we deliver live and in-your-own-time learning on computers, tablets, smartphones and other portable devices.']),
 ('emtech', 'Emerging technology skills', 'Basic to advanced skills in artificial intelligence, machine learning, connected devices and big data.', [
  'We help businesses build skills across new technology products and services. We believe in adopting new technology early, to tackle problems in healthcare, climate change and sustainability.',
  'We look for the places where industries meet and value can be made together: artificial intelligence, quantum computing, blockchain, digital currency, connected devices, augmented reality, nanotechnology and 3D printing.']),
 ('msmetech', 'Sustainable upskilling for small enterprises', 'Core skills, certificates and job readiness for micro, small and medium enterprises.', [
  'Governments everywhere support micro, small and medium enterprises because of their part in growth. About 90% of businesses worldwide are of this kind, and they sustain over half of the global workforce.',
  'The World Bank estimates that about 600 million jobs will be needed by 2030. We help by linking education providers, skills, workers and employers.']),
 ('life-long-learning', 'Life long learning and creative skills', 'Digital skills for creators, users and lovers of the creative arts and design.', [
  'UNESCO estimates that the global creative economy earns about USD 2,250 billion a year and employs more people aged 15 to 29 than any other sector. We are building products and services for creators, users and lovers of modern creative arts and design.']),
]
LLL_LIST = ['Photography', 'Film and videography', 'Editing', 'Sound design', 'Music and sound engineering', 'Performing arts', 'Visual arts', 'Multimedia design', 'Interior design', 'Fashion design']
MSME_LIST = ['Upskilling platforms', 'Upskilling and reskilling programmes that build core skills', 'Certificates in trending skills and jobs', 'Job-readiness courses and bridge programmes for university students', 'Employability skill programmes for small enterprises']
for s, t, d, ps in SERV:
    inner = paras(ps)
    if s == 'life-long-learning': inner += '<h3 class="ws-h3">Fields we look at</h3>' + bullets(LLL_LIST)
    if s == 'msmetech': inner += '<h3 class="ws-h3">What we offer</h3>' + bullets(MSME_LIST)
    body = sec('', 's-h', 'what it is', t, inner) + sec('alt', 'p-h', 'price and dates', 'Price and start dates', '<p>Prices and dates are shown on the <a href="membership.html">Membership</a> page, so there is one place to look. The old site showed prices in other currencies that no longer apply.</p>' + CTA + note)
    page(f'service-{s}.html', t, d, t, d, body, '<li><a href="services.html">Services</a></li><li aria-current="page">' + e(t) + '</li>', 'services')
page('services.html', 'Services', 'Five learning services from the old site, brought into our own pages.', 'Services',
     'Five services that link learning, skills and work.',
     sec('', 'all-h', f'{len(SERV)} services', 'Pick a service', cards([(s, t, d, p) for s, t, d, p in SERV], 'service-')) + sec('alt', 'n-h', 'next', 'Join or partner', CTA + note),
     '<li aria-current="page">Services</li>', 'services')

# How we help: platform wording and suite
THINK = [('Reading', 'Understands what a text means.'), ('Understanding', 'Takes whole steps such as decisions and actions.'),
         ('Writing', 'Turns the system data into plain human language to reply.'),
         ('Make and check', 'The system makes the output; you check and approve it, or send it round again to improve it.'),
         ('Ask me anything coach', 'Takes your questions and uses the libraries and public information you use most, so you get the best set of answers.')]
SUITE = ['Connected-device services and people', 'Information and communication technology services and people',
         'A full business stack (planning, customers, reporting, office tools) with no-code tools, built on our own interfaces and apps',
         'An open-standards ecosystem of course and career pathways, joined to a marketplace and a workplace',
         'Consultancy, channel, business-operations, support and full-service ecosystem',
         'A partner, affiliate and value-provider network in four levels, hub and spoke',
         'Artificial intelligence and machine learning', 'Big data and analytics', 'Career pathways', 'Authoring, training, marketplace and workplace']
body = (sec('', 'w-h', 'our promise', 'Skills, learning and market reach',
            paras(['We help people and institutions across the world improve their skills, their learning and their reach into the market, using our digital enterprise platform, emerging technology and deep domain knowledge.',
                   'Learn and earn: bloom where you are planted. Course and career pathways: your growth is our goal.',
                   'Our approach is open: it works with many systems, software and hardware, and many ways of doing business. Our teaching method, our processes and our growth method connect sectors and communities, and record social needs in line with data-protection law, the UN Sustainable Development Goals and OECD guidance, and each country and community\'s own rules.']))
        + sec('alt', 't-h', 'think digital', 'How our digital helpers work',
              '<p>Skills of people are joined with automated systems and resources to make solutions and run them to the task and standard. Five helpers do the work:</p>'
              + '<ul class="cards">' + ''.join(f'<li class="card"><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a, b in THINK) + '</ul>')
        + sec('', 'm-h', 'marketplace and workplace', 'One place to learn, work and trade',
              paras(['We believe in early use of new technology to meet big human problems in healthcare, climate and sustainability. We give you a ready marketplace and workplace for building skills in many new technology products and services.',
                     'Investment, enterprise, development and management come with a full suite:']) + bullets(SUITE)
              + paras(['Experienced mentors and facilitators guide your professional, academic, trade, business and leisure goals. Our artificial intelligence and game-style learning keep you engaged and joined up, with paths you can trace back and forth, so you can move freely and grow skilled while staying delighted.']))
        + sec('alt', 'n-h', 'next', 'See more', '<p><a class="btn" href="platform.html">The platform</a> <a class="btn btn-ghost" href="marketplace.html">Marketplace</a> <a class="btn btn-ghost" href="workplace.html">Workplace</a> <a class="btn btn-ghost" href="sectors.html">Sectors</a></p>' + note))
page('how-we-help.html', 'How we help', 'Our promise, our digital helpers and the marketplace and workplace suite.', 'How we help',
     'Skills, learning and market reach, joined up in one place.', body, '<li aria-current="page">How we help</li>', 'about us')

# Team roles only: names are not shown on public pages
ROLES = [('Chief Administrative Officer', 'Runs day-to-day administration.'), ('Chief Strategy Officer', 'Sets direction and growth plans.'),
         ('Blended development', 'Joins online and in-person learning.'), ('Director, content', 'Leads course and material quality.'),
         ('Director, cognitive processes', 'Leads how people learn and think.'), ('Small-enterprise development', 'Supports small and medium businesses.'),
         ('Digital enterprise', 'Leads platform and digital work.'), ('Co-scholastic learning', 'Leads arts, sport and life skills.')]
body = (sec('', 'r-h', f'{len(ROLES)} roles', 'The people behind the work',
            '<p>Eight leaders started this initiative. We show roles here, not names, so the page stays about the work.</p><ul class="cards">' + ''.join(f'<li class="card"><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a, b in ROLES) + '</ul>')
        + sec('alt', 'n-h', 'next', 'Talk to us', CTA + note))
page('team.html', 'Team roles', 'The roles of the leaders who started House for Learning.', 'Team roles', 'Who leads which part of the work.', body, '<li aria-current="page">Team roles</li>', 'about us')
print('pages:', len(SECT) + len(SERV) + 4)
