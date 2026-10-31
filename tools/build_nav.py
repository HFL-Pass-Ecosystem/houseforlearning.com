"""Rewrite the main header menu on every page into five dropdown groups.
Run from the repo root: python3 tools/build_nav.py"""
import glob, re, html
GROUPS = [
 ("Learn", [("catalogue.html","Course catalogue"),("courses.html","All courses"),("learning-tracks.html","Learning tracks"),("pathways.html","Pathways"),("career-pathways.html","Career pathways"),("executive-programme.html","Executive programme"),("mba/index.html","Online MBA"),("how-learning-works.html","How learning works"),("webinars.html","Webinars"),("onboarding.html","Onboarding"),("yoga.html","Yoga for life")]),
 ("Products", [("products.html","Products"),("platform.html","Platform"),("marketplace.html","Marketplace"),("business-systems.html","Business systems"),("insights.html","Insights")]),
 ("Organisations", [("organisations.html","For organisations"),("workplace.html","Workplace"),("academies.html","Technical academies"),("sectors.html","Sectors we serve"),("services.html","Services"),("how-we-help.html","How we help"),("partner.html","Partner with us")]),
 ("Membership", [("membership.html","Membership"),("join.html","Join"),("credits.html","How credits stack"),("credentials.html","Credentials and assessment"),("payments.html","Payments")]),
 ("Help", [("about.html","About"),("team.html","Team roles"),("support.html","Support and access"),("faq.html","Questions (FAQ)"),("safety.html","Safety"),("contact.html","Contact")]),
]
def build(cur, actions):
    out = ['<nav class="site-nav" id="site-nav" aria-label="Main"><ul class="nav-groups">']
    for gi, (name, items) in enumerate(GROUPS):
        here = any(h == cur for h, _ in items)
        out.append(f'<li class="has-sub{" is-current" if here else ""}"><button class="sub-btn" type="button" aria-expanded="false" aria-controls="sub-{gi}">{html.escape(name)}</button><ul class="sub" id="sub-{gi}">')
        for h, t in items:
            ac = ' aria-current="page"' if h == cur else ''
            out.append(f'<li><a href="{h}"{ac}>{html.escape(t)}</a></li>')
        out.append('</ul></li>')
    out.append('</ul>' + actions + '</nav>')
    return ''.join(out)
n = 0
for f in glob.glob('site/*.html'):
    s = open(f).read()
    m = re.search(r'<nav class="site-nav".*?</nav>', s, re.S)
    if not m: continue
    a = re.search(r'<div class="head-actions">.*?</div>', m.group(0), re.S)
    s = s[:m.start()] + build(f.split('/')[-1], a.group(0) if a else '') + s[m.end():]
    open(f, 'w').write(s); n += 1
print(n, 'pages updated')
