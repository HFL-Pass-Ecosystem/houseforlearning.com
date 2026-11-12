"""GROWTH(TM) marks and the day's anchors for houseforlearning.com.

The owner's rule (6 Nov 2026): the GROWTH(TM) mark goes wherever a pane offers growth to a person, and it leads straight to
the part of the site that the pane is about. Here that is the course catalogue, the course and career pathways, the
webinars and live classes, and the planned workplace and marketplace pages.

Run: python3 tools/apply_growth.py        (safe to run again; re-run it after a tool rebuilds a page, e.g. build_courses.py)
     python3 tools/apply_growth.py --check (changes nothing; fails if a page is not as this file says)

What it does, and only on the pages named in PANES:
- marks each listed pane (a section, found by its aria-labelledby) with data-growth="on" data-activity="<pathway>";
  the script tag carries data-panes="[data-growth]", so only these panes get a mark. On a pathway's own page the mark is
  a badge, not a link, so a mark never leads to the page the visitor is already on;
- puts one row of three anchors after the home page's hero; on a phone the row stays at the foot of the screen, and the
  back-to-top button and the cookie notice sit above it (assets/growth.css);
- adds the script tag to every page it marks, and takes it off any other page.

The script and its style rules are site/v1/embed/ (hfl.js and gbd.css): this site's own build of the Gandaberunda API.
It names no other site, sends nothing anywhere, sets no cookies and, on this site, writes nothing to the browser, so the
cookies page needs no change. The site's Content-Security-Policy allows it as it is: the script is a file of this site,
and its style rules are a file of this site or a constructed style sheet, never a style tag.
To refresh it: in the Gandaberunda API's own source folder run
    node tools/build-static.js --mode live --site hfl --out <an empty folder>
and copy that folder's v1/embed/ over site/v1/embed/ (both files, never the script alone).
"""
import os
import re
import sys

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')
SCRIPT = '<script src="v1/embed/hfl.js" data-panes="[data-growth]" defer></script>'
STYLE = '<link rel="stylesheet" href="assets/growth.css">'
ANCHORS = '<div class="gbd-home"><div class="wrap"><div data-anchors data-sticky="bottom"></div></div></div>'

# Where each pathway leads (the same pages as this site's entry in the Gandaberunda API's data/sites.json).
LEADS = {'course': 'catalogue.html', 'career': 'career-pathways.html', 'community': 'webinars.html',
         'workplace': 'workplace.html', 'marketplace': 'marketplace.html'}

# page -> [(the aria-labelledby of the pane, the pathway it offers)]
PANES = {
    'index.html': [('roles-h', 'career'),          # Four roles you can grow through, starting as a learner
                   ('s4-h', 'course'),             # Small steps that add up: units stack into pathways
                   ('mw-h', 'workplace')],         # One place to learn, one place to work
    'pathways.html': [('h1', 'career')],           # Your growth, our goal
    'career-pathways.html': [('h1', 'career')],    # its own page: a badge
    'catalogue.html': [('h1', 'course')],          # its own page: a badge
    'webinars.html': [('h1', 'community')],        # its own page: a badge
    'workplace.html': [('h1', 'workplace')],       # its own page: a badge
    'marketplace.html': [('h1', 'marketplace')],   # its own page: a badge
    'how-learning-works.html': [('s3-h', 'course'),           # From one unit to a pathway
                                ('learn-earn-h', 'workplace')],  # Study and real work, side by side
    'credits.html': [('s0-h', 'career')],          # From one unit to a degree pathway
    'onboarding.html': [('h1', 'career')],         # The onboarding ladder: your first three years in a role
    'train-ladder.html': [('h1', 'career')],       # Role and level ladder
    'learning-tracks.html': [('h1', 'course')],    # Where would you like to grow?
    'learn-shelves.html': [('h1', 'course')],      # Learn by segment
    'academies.html': [('h1', 'career')],          # Specialist learning, built role by role
    'author-a-module.html': [('h1', 'marketplace')],  # Turn what you know into a module others can take
}
# Every course page: the course is a step on a pathway, so its heading leads to the course and career pathways.
for name in sorted(os.listdir(SITE)):
    if re.fullmatch(r'course-(gl|eu)-\d+\.html', name):
        PANES[name] = [('h1', 'career')]

HOME = 'index.html'
MARK = re.compile(r'\s+data-growth="[^"]*"(\s+data-activity="[^"]*")?')


def section_tag(html, label):
    """The opening tag of the section labelled by this id: (start, end) in html."""
    m = re.search(r'<section\b[^>]*\baria-labelledby="%s"[^>]*>' % re.escape(label), html)
    return (m.start(), m.end()) if m else None


def mark(html, label, activity, page):
    at = section_tag(html, label)
    if not at:
        raise SystemExit(f'apply_growth.py: {page} has no section labelled {label}')
    tag = MARK.sub('', html[at[0]:at[1]])
    tag = tag[:-1] + f' data-growth="on" data-activity="{activity}">'
    return html[:at[0]] + tag + html[at[1]:]


def unmark(html):
    return re.sub(r'<section\b[^>]*>', lambda m: MARK.sub('', m.group(0)), html)


def without(html, piece):
    return html.replace(piece, '')


def apply(page, html):
    html = unmark(without(without(without(html, SCRIPT), STYLE), ANCHORS))
    if page not in PANES:
        return html
    for label, activity in PANES[page]:
        html = mark(html, label, activity, page)
    if page == HOME:
        hero = section_tag(html, 'h1')
        nxt = html.find('<section', hero[1]) if hero else -1
        if nxt < 0:
            raise SystemExit('apply_growth.py: the home page has no section after its hero')
        html = html[:nxt] + ANCHORS + html[nxt:]
        head = html.find('</head>')
        html = html[:head] + STYLE + html[head:]
    body = html.rfind('</body>')
    if body < 0:
        raise SystemExit(f'apply_growth.py: {page} has no </body>')
    return html[:body] + SCRIPT + html[body:]


def main(check=False):
    for activity, target in LEADS.items():
        if not os.path.exists(os.path.join(SITE, target)):
            raise SystemExit(f'apply_growth.py: {target} ({activity}) is not a page of this site')
    for f in ('v1/embed/hfl.js', 'v1/embed/gbd.css', 'assets/growth.css'):
        if not os.path.exists(os.path.join(SITE, f)):
            raise SystemExit(f'apply_growth.py: site/{f} is missing')
    changed, marks = [], 0
    for name in sorted(os.listdir(SITE)):
        if not name.endswith('.html'):
            continue
        path = os.path.join(SITE, name)
        old = open(path, encoding='utf-8').read()
        new = apply(name, old)
        marks += len(re.findall(r'data-growth="on"', new))
        if new != old:
            changed.append(name)
            if not check:
                open(path, 'w', encoding='utf-8').write(new)
    if check and changed:
        raise SystemExit(f'apply_growth.py --check: {len(changed)} pages differ, e.g. {", ".join(changed[:5])}; run python3 tools/apply_growth.py')
    print(f'GROWTH marks: {marks} on {len(PANES)} pages; anchors on {HOME}; ' + ('checked, nothing to change' if check else f'{len(changed)} pages written'))


if __name__ == '__main__':
    main(check='--check' in sys.argv[1:])
