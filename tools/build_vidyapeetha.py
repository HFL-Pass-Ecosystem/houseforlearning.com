#!/usr/bin/env python3
"""Write the HFL Vidyapeetha pages: vidyapeetha.html (overview), tutor-join.html, tutors.html, complaints.html,
transcript.html and vidyapeetha-desk.html. Same header, footer and styles as the rest of the site (taken from pay.html).
Screens are filled in by assets/vidyapeetha.js. No inline scripts (the site's CSP allows the site's own files only)."""
import os, re
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
tpl = open(os.path.join(SITE, 'pay.html'), encoding='utf-8').read()
i, j = tpl.index('<main'), tpl.index('</main>') + len('</main>')
pre, post = tpl[:i], tpl[j:]
post = post.replace('<script src="assets/lms-pages.js" defer></script>', '<script src="assets/vidyapeetha.js" defer></script>')
pre = pre.replace('</head>', '<link rel="stylesheet" href="assets/vidyapeetha.css">\n</head>')


def sec(kicker, h2, body, n):
    return (f'<section class="sec" aria-labelledby="h2-{n}"><div class="wrap"><div class="sec-head"><p class="kicker">{kicker}</p>'
            f'<h2 id="h2-{n}">{h2}</h2></div><div class="sec-body">{body}</div></div></section>')


def card(h, p, href=None, label=None):
    a = f'<p><a class="btn btn-sm" href="{href}">{label}</a></p>' if href else ''
    return f'<div class="vp-card"><h3>{h}</h3><p>{p}</p>{a}</div>'


OVERVIEW = (
    sec('three ways to learn', 'Choose how you want to learn',
        '<div class="vp-grid3">'
        + card('A. Programmes', 'Systematic study over terms, 30 to 120 credits, with a transcript and a programme certificate. Each module moves you up a Sopana level.', 'catalogue.html', 'See the catalogue')
        + card('B. Lifelong short courses', 'Single-credit, two-credit and three-credit courses in languages, skills and interests, at any age. One certificate per course. Credits stack towards a programme when subjects match.', 'courses-all.html', 'Browse courses')
        + card('C. Skill credentials', 'A HUMI badge, a skill certificate and a digital badge with its own code and fingerprint, so anyone can check it is genuine. Show it to employers and clients.', 'transcript.html', 'My transcript and badges')
        + '</div>', 1)
    + sec('credits', 'One credit is 30 learning hours',
          '<p>Class time, practice and self-study all count. A course carries credit only once the desk has rated it; the rating shows on your transcript next to each certificate. '
          'We make no accreditation claim: a credit here is our own measure until a body entitled to award qualifications recognises it. <a href="credits.html">How credits stack</a>.</p>', 2)
    + sec('teach and earn', 'Teach on Vidyapeetha and keep 70%',
          '<p>Anyone qualified can teach, run classes or publish a course, and keep 70% of each sale. AHFL keeps 30% for the platform, safety checks and support. All payments go through the platform only.</p>'
          '<p><strong>No police clearance, no teaching.</strong> Every tutor, man or woman, gives:</p>'
          '<ol class="vp-steps"><li class="ok">A photo ID and a live check by our desk.</li>'
          '<li class="ok">A police clearance certificate from the police of the area where they live now.</li>'
          '<li class="ok">Two references, one of them from work.</li>'
          '<li class="ok">A passed safety exam (taken full screen, timed and recorded).</li></ol>'
          '<p>The clearance is renewed every 12 months, and every 3 months for tutors who visit homes. On top of the police, our own assessors and auditors make random checks. '
          'When a clearance runs out, the tutor is hidden at once, bookings freeze and payouts are held until it is renewed.</p>'
          '<p><a class="btn" href="tutor-join.html">Become a verified tutor</a> <a class="btn btn-ghost" href="tutors.html">See verified tutors</a></p>', 3)
    + sec('home visits', 'Extra protection when tutors visit homes',
          '<ul><li>Bookings only through the platform, never by phone or private chat.</li>'
          '<li>Check in and check out on the app at every visit.</li>'
          '<li>For any learner under 18, a parent or guardian must be at home.</li>'
          '<li>Random home-visit checks by our assessors, who work with the police.</li>'
          '<li>A safety report pauses the tutor at once while the desk looks into it.</li></ul>', 4)
    + sec('one fixed path', 'If something goes wrong',
          '<p>Every matter goes through one form, with set time limits: received within 24 hours, a decision within 5 working days, one appeal within 7 days, then final. '
          'Messages are judged on facts. Angry or abusive messages are not accepted, and email or chat escalations are sent back to the form. Safety reports always go first.</p>'
          '<p><a class="btn" href="complaints.html">Report a concern</a></p>', 5)
    + sec('free tools', 'Free meeting, email and document tools',
          '<p>Members are shown, step by step, how to open their own free accounts for video meetings, email, documents and storage, within each provider\'s free limits. '
          'Each person signs up in their own name; we never resell or share anyone\'s licence. Where no free tool exists, we build our own, starting with our own meeting rooms.</p>', 6)
)

PAGES = [
    ('vidyapeetha', 'HFL Vidyapeetha', 'Learn, teach, earn', 'Programmes with credits, lifelong short courses and skill badges, taught by tutors who are checked by the police and by us.', None, True),
    ('tutor-join', 'Become a verified tutor', 'Teach on Vidyapeetha', 'ID, police clearance, two references and a safety exam. Then teach and keep 70%.', 'join', False),
    ('tutors', 'Verified tutors', 'Vidyapeetha', 'Every tutor here has a police clearance in date and has passed our checks.', 'tutors', True),
    ('complaints', 'Report a concern', 'Vidyapeetha', 'One form, one path, fixed time limits. Safety reports go first.', 'complaints', False),
    ('transcript', 'My transcript and badges', 'Vidyapeetha', 'Your certificates, credits and badges on one printable page. Anyone can check a badge code here.', 'transcript', False),
    ('vidyapeetha-desk', 'Moderation desk', 'Desk staff', 'Tutor checks, police clearance dates, random checks, cases and course credits.', 'desk', False),
]
for slug, h1, kick, lede, vp, index in PAGES:
    t = re.sub(r'(<title>)[^<]*(</title>)', rf'\g<1>{h1} | House for Learning\g<2>', pre)
    t = re.sub(r'(<meta property="og:title" content=")[^"]*(">)', rf'\g<1>{h1} | House for Learning\g<2>', t)
    t = t.replace('pay.html', slug + '.html')
    t = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{lede}">', t)
    t = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{lede}">', t)
    crumb = f'<li aria-current="page">{h1}</li>' if slug == 'vidyapeetha' else f'<li><a href="vidyapeetha.html">Vidyapeetha</a></li><li aria-current="page">{h1}</li>'
    t = t.replace('<li><a href="courses-hub.html">Courses</a></li><li aria-current="page">Join this course</li>', '<li><a href="courses-hub.html">Courses</a></li>' + crumb)
    t = re.sub(r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="%s">' % ('index,follow' if index else 'noindex'), t)
    hero = f'<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">{kick}</p><h1 id="h1">{h1}</h1><p>{lede}</p></div></div></section>'
    if vp:
        body = sec(kick.lower(), h1, f'<div class="wrap"><div id="vp-box" class="vp-box" data-vp="{vp}"><p>Loading.</p></div><noscript><p>This page needs JavaScript.</p></noscript></div>', 1)
        p = post
    else:
        body = OVERVIEW
        p = post.replace('<script src="assets/vidyapeetha.js" defer></script>\n', '').replace('<script src="assets/vidyapeetha.js" defer></script>', '')
    open(os.path.join(SITE, slug + '.html'), 'w', encoding='utf-8').write(t + f'<main id="main" tabindex="-1">{hero}{body}</main>' + p)
print('Vidyapeetha pages written')
