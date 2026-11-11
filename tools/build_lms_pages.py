#!/usr/bin/env python3
"""Write the LMS screens: pay.html, quiz.html, certificate.html, members-courses.html, reports.html.
They share the header, footer and styles of the rest of the site (taken from pay.html) and are filled in by assets/lms-pages.js.
No inline scripts: the site's security rules (CSP in netlify.toml) allow scripts from the site's own files only."""
import os, re
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
tpl = open(os.path.join(SITE, 'pay.html'), encoding='utf-8').read()
i, j = tpl.index('<main'), tpl.index('</main>') + len('</main>')
pre, post = tpl[:i], tpl[j:]
OLD = 'Join a course (test) | House for Learning'
if 'assets/lms-pages.js' not in post:
    post = post.replace('<script src="assets/access.js" defer></script>', '<script src="assets/access.js" defer></script>\n<script src="assets/lms-pages.js" defer></script>')
PAGES = [
    ('pay', 'Join this course', 'Members', 'Test only. No real money is taken.', 'test payment', 'Pay and open the course'),
    ('quiz', 'Final check', 'Members', 'Show what you have learned. Pass to earn your certificate.', 'final check', 'Questions'),
    ('certificate', 'Certificate', 'Members', 'Check or print a certificate.', 'certificate', 'Your certificate'),
    ('members-courses', 'My courses', 'Members', 'Your courses, your progress, your grades and your certificates.', 'my courses', 'Your courses'),
    ('author', 'Author Studio', 'Authors and trainers', 'Build a course on screen, send it to a trainer, publish it and earn from it.', 'author studio', 'Your courses'),
    ('learn', 'Courses by members', 'Members', 'Courses made by our members. Join, learn lesson by lesson, take the final check and earn a certificate.', 'courses by members', 'Courses'),
    ('reports', 'Facilitator report', 'Facilitators', 'Who joined, how far they have got, and how they did.', 'report', 'Learners and courses'),
]
KIND = {'pay': 'pay', 'quiz': 'quiz', 'certificate': 'verify', 'members-courses': 'courses', 'reports': 'reports', 'author': 'author', 'learn': 'play'}
for slug, h1, kick, lede, k2, h2 in PAGES:
    t = re.sub(r'(<title>)[^<]*(</title>)', rf'\g<1>{h1} | House for Learning\g<2>', pre)
    t = re.sub(r'(<meta property="og:title" content=")[^"]*(">)', rf'\g<1>{h1} | House for Learning\g<2>', t)
    t = t.replace('pay.html', slug + '.html')
    t = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{lede}">', t)
    t = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{lede}">', t)
    t = t.replace('<li aria-current="page">Join</li>', f'<li aria-current="page">{h1}</li>')
    main = (f'<main id="main" tabindex="-1" data-lms="{KIND[slug]}"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">{kick}</p><h1 id="h1">{h1}</h1><p>{lede}</p></div></div></section>'
            f'<section class="sec" aria-labelledby="h2"><div class="wrap"><div class="sec-head"><p class="kicker">{k2}</p><h2 id="h2">{h2}</h2></div><div class="sec-body"><div class="wrap"><div id="lms-box" class="acc-card"><p>Loading.</p></div><noscript><p>This page needs JavaScript.</p></noscript></div></div></div></section></main>')
    if slug in ('pay', 'quiz', 'reports', 'members-courses', 'author', 'learn'):
        t = t.replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex">')
    extra = {'author': 'author-studio.js', 'learn': 'author-player.js'}.get(slug)
    pp = post.replace('<script src="assets/lms-pages.js" defer></script>', '<script src="assets/lms-pages.js" defer></script>\n<script src="assets/%s" defer></script>' % extra) if extra else post
    open(os.path.join(SITE, slug + '.html'), 'w', encoding='utf-8').write(t + main + pp)
print('LMS pages written')
