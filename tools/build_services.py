#!/usr/bin/env python3
"""Builds service-<slug>.html (six pages) and the Services cards on partner.html.
Text is the owner's real Wix text (Drive: HFL/wix-reference-2026-10-31/services-pages.md), kept in its own words.
Not carried over: old prices and the Ended/In progress labels, because the Wix pages contradict each other on them.
Run: python3 tools/build_services.py"""
import re, html, pathlib
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'
e = html.escape
tpl = (S / 'catalogue.html').read_text()
tpl = tpl.replace('<meta name="robots" content="index,follow">', '')
if 'name="robots"' not in tpl:
    tpl = tpl.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)
_anchor = '<link rel="stylesheet" href="assets/site-lux.css">' if '<link rel="stylesheet" href="assets/site-lux.css">' in tpl else '<link rel="stylesheet" href="assets/site.css">'
tpl = tpl.replace(_anchor, _anchor + '\n<link rel="stylesheet" href="assets/service-lux.css">', 1)
tpl = tpl.replace('<body class="learn">', '<body class="learn svc-page">', 1)

# slug, short name, page title, Wix tagline, paragraphs (Wix text), bullets heading, bullets, hue
SERV = [
 ('introduction', 'Introduction', 'Introduction', '', [], '', [], 'a'),
 ('smetech', 'SMETech', 'SMETech', "HFL's joined-up approach promotes collaboration between everyone involved.", [
  "HFL, in its SMETech operations, will focus on fast-growing skills in business, sales, information technology, creative learning, learning design and engineering. This gives small and medium enterprises (SMEs) a head start in reaching their upskilling and reskilling goals."], '', [], 'b'),
 ('edtech', 'EdTech', 'EdTech', 'Empowering individuals and institutions to learn it to earn it.', [
  "EdTech (education technology) is growing quickly across the world, and digital learning is now part of many school systems. HFL recognises the promise of digital learning and how well it suits bringing education to disadvantaged groups who cannot afford the best of traditional face-to-face learning.",
  "Globally, HFL's EdTech covers two broad markets: (1) K-12, which is education from kindergarten to grade 12; and (2) post-K-12, which is undergraduate, postgraduate and professional courses. In both, House for Learning aims to deliver live and self-paced learning on computers, tablets, smartphones and other portable electronic devices."], '', [], 'c'),
 ('emtech', 'EmTech', 'EmTech', 'Basic to advanced skills in artificial intelligence, machine learning, connected devices and big-data analytics.', [
  "EmTech (emerging technology) helps businesses by promoting skills in new technology products and services. At HFL, we believe in adopting new technologies early to solve the challenges facing people today in healthcare, climate change, sustainability and similar fields.",
  "We aim to create value where industries meet, through artificial intelligence, quantum computing, blockchain, cryptocurrency, the Internet of Things, augmented reality, nanotechnology and 3D printing."], '', [], 'd'),
 ('msmetech', 'MSMETech', 'MSMETech', 'Sustainable upskilling and reskilling for micro, small and medium enterprises.', [
  "Micro, small and medium enterprises (MSMEs) are supported by governments across the world for their role in economic growth. They make up much of the business world and employ a large share of the workforce. Their part in creating jobs is hard to overstate.",
  "Many new jobs will be needed in the years ahead. This is where HFL comes in, with a joined-up approach that links education providers, skills, workers and employers."],
  'Our core offerings for MSMEs will focus on', ['Upskilling platforms', 'Upskilling and reskilling programmes that build core skills', 'Certification programmes in trending skills and jobs', 'Job-readiness courses and bridge programmes for university students', 'Employability skill-development programmes for MSMEs'], 'a'),
 ('life-long-learning', 'Life Long Learning', 'Life Long Learning', 'Enhance yourself through digitisation and create a new wave of demand.', [
  "The creative economy is a large and growing source of work, especially for young people. HFL recognises the growing opportunities in creative arts and design, and we are exploring products and services for creators, users and lovers of modern creative arts and design."],
  'HFL solutions for the arts may be aimed at creative professionals and customers in the fields of', ['Photography', 'Film', 'Videography', 'Editing', 'Sound design', 'Music and sound engineering', 'Performing arts', 'Visual arts', 'Multimedia design', 'Interior design', 'Fashion design'], 'b'),
]
NAMES = {s: n for s, n, *_ in SERV}

def swap(t, fn, title, desc, crumbs, main):
    t = re.sub(r'<title>.*?</title>', lambda m: f'<title>{e(title)} | House for Learning</title>', t, 1, re.S)
    t = re.sub(r'<meta name="description" content=".*?">', lambda m: f'<meta name="description" content="{e(desc)}">', t, 1)
    t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, 1)
    t = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + e(title) + ' | House for Learning', t, 1)
    t = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + e(desc), t, 1)
    t = re.sub(r'(<meta property="og:url" content="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + fn, t, 1)
    t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li>' + crumbs + '</ol>', t, 1, re.S)
    return re.sub(r'<main id="main".*?</main>', lambda m: main, t, 1, re.S)

def enquiry(slug, name):
    return (f'<section class="svc-form" id="enquiry" aria-labelledby="enq-h"><div class="svc-in"><p class="svc-kick">enquire</p><h2 id="enq-h">Ask about {e(name)}</h2>'
      f'<form class="contact svc-enq" action="#" method="post" data-offline data-subject="Service enquiry" data-thanks="Thank you. Your message has been sent. We reply by email." aria-labelledby="enq-h">'
      f'<div class="vh" aria-hidden="true"><label for="e-website">Leave this empty</label><input id="e-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>'
      f'<div class="field"><label for="e-service">Service</label><input type="text" id="e-service" name="topic" value="{e(name)}" readonly></div>'
      f'<div class="field-row"><div class="field"><label for="e-name">Full name</label><input type="text" id="e-name" name="name" autocomplete="name" required></div><div class="field"><label for="e-email">Email</label><input type="email" id="e-email" name="email" autocomplete="email" required></div></div>'
      f'<div class="field-row"><div class="field"><label for="e-org">Organisation <span class="opt">(optional)</span></label><input type="text" id="e-org" name="organisation" autocomplete="organization"></div><div class="field"><label for="e-country">Country <span class="opt">(optional)</span></label><input type="text" id="e-country" name="country" autocomplete="country-name"></div></div>'
      f'<div class="field"><label for="e-details">What would you like to ask?</label><textarea id="e-details" name="details" required></textarea></div>'
      f'<label class="check"><input type="checkbox" name="consent" required><span>I agree that <span translate="no">House for Learning</span> may contact me about this enquiry. I have read the <a href="privacy.html">Privacy notice</a>.</span></label>'
      f'<div><button class="btn" type="submit">Send enquiry</button></div><p class="form-status" role="status" tabindex="-1" hidden></p></form></div></section>')

def others(cur):
    return '<ul class="svc-others">' + ''.join(f'<li><a href="service-{s}.html"{" aria-current=\"page\"" if s == cur else ""}>{e(n)}</a></li>' for s, n, *_ in SERV) + '</ul>'

for slug, name, title, tag, ps, bh, bl, hue in SERV:
    lead = f'<p class="svc-lead">{e(tag)}</p>' if tag else '<p class="svc-lead svc-meta">Duration: 1 hour</p>'
    body = ''.join(f'<p>{e(p)}</p>' for p in ps)
    if bl: body += f'<h2>{e(bh)}</h2><ul class="svc-list">' + ''.join(f'<li>{e(x)}</li>' for x in bl) + '</ul>'
    if slug == 'introduction':
        body = '<p>A one-hour introduction with House for Learning. Tell us who you are and what you are looking for, and we will arrange a time.</p>'
    main = (f'<main id="main" tabindex="-1"><section class="svc-hero hue-{hue}" aria-labelledby="h1"><div class="svc-in"><p class="svc-kick">partner with us · service</p><h1 id="h1">{e(title)}</h1>{lead}'
            f'<p class="svc-cta"><a class="svc-btn" href="#enquiry">Ask about {e(name)}</a><a class="svc-btn ghost" href="partner.html">All services</a></p></div></section>'
            f'<section class="svc-body" aria-label="About {e(name)}"><div class="svc-in svc-cols"><div class="svc-text">{body}</div><aside class="svc-side" aria-label="Our services"><h2>Our services</h2>{others(slug)}</aside></div></section>'
            + enquiry(slug, name) + '</main>')
    desc = (tag or 'A one-hour introduction with House for Learning.')
    (S / f'service-{slug}.html').write_text(swap(tpl, f'service-{slug}.html', title, desc,
        '<li><a href="partner.html">Partner with us</a></li><li aria-current="page">' + e(title) + '</li>', main))

# services.html is written by build_org_pages.py (sole owner); not written here.

# partner.html: keep "Join us / Become a leader today"; each service card goes to its own page
pp = (S / 'partner.html').read_text()
cards = '<ul class="cards">' + ''.join(
    f'<li class="card" data-hue="{ {"a":"blue","b":"ochre","c":"green","d":"blue"}[h] }">' + (f'<span class="tag">1 hr</span>' if s == 'introduction' else '<span class="tag">service</span>')
    + f'<h3>{e(n)}</h3>' + (f'<p>{e(t)}</p>' if t else '') + f'<a class="more" href="service-{s}.html">View {e(n)}</a></li>' for s, n, _, t, _, _, _, h in SERV) + '</ul>'
pp = re.sub(r'<ul class="cards">.*?</ul>', lambda m: cards, pp, 1, re.S)
pp = re.sub(r'<p>Work with HFL as a partner.*?</p>', '', pp, 1)
pp = re.sub(r'<section class="cta" aria-labelledby="cta-h">.*?</section>', '', pp, 1, re.S)
(S / 'partner.html').write_text(pp)
print('service pages:', len(SERV))
