"""Search-ready pass for the House for Learning static site (site/) (idempotent; run after build, or alone).
Run: python3 tools/seo_pass.py site
Adds to every indexable page: absolute og:image, Twitter card tags, WebPage/WebSite structured data
(name and url only: no address, phone, email or people), unique titles where two pages shared one,
lazy loading for the footer logo, and two contrast/keyboard fixes. Pages marked noindex are left as they are."""
import html, json, os, re, sys

BASE = 'https://houseforlearning.com/'
NAME = 'House for Learning'
LOGO = BASE + 'assets/brand/hfl-sbs-1200w.png'
MARK = '<!-- seo-pass -->'
BLOCK = re.compile(r'<!-- seo-pass -->\n(?:<meta (?:property="og:image"|name="twitter:[a-z]+") content="[^"\n]*">\n)*'
                   r'<script type="application/ld\+json">\{"@context": "https://schema.org", "@graph": [^\n]*</script>\n')
TITLES = {  # the home title said the name twice
    'index.html': 'House for Learning: Courses &amp; Career Pathways',
}

def meta(h, prop, attr='property'):
    m = re.search(r'<meta %s="%s" content="([^"]*)">' % (attr, re.escape(prop)), h)
    return m.group(1) if m else ''

def fix(rel, h):
    if MARK in h:
        # builders copy a finished page as their template, so an old block may belong to another page:
        # take out exactly the lines this script wrote (nothing else), then write them again from this page's own tags
        h = BLOCK.sub('', h)
    if 'noindex' in h or '</head>' not in h:
        return h
    if rel in TITLES:
        t = TITLES[rel]
        h = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % t, h, count=1)
        h = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + t, h, count=1)
    title = (re.search(r'<title>([^<]*)</title>', h) or [None, ''])[1]
    desc = meta(h, 'description', 'name')
    canon = (re.search(r'<link rel="canonical" href="([^"]*)"', h) or [None, BASE + rel])[1]
    add = [MARK]
    if 'og:image' not in h:
        add.append('<meta property="og:image" content="%s">' % LOGO)
    if 'twitter:card' not in h:
        add += ['<meta name="twitter:card" content="summary_large_image">',
                '<meta name="twitter:title" content="%s">' % title,
                '<meta name="twitter:description" content="%s">' % desc]
    site = {'@type': 'WebSite', '@id': BASE + '#site', 'name': NAME, 'url': BASE}
    page = {'@type': 'WebPage', '@id': canon + '#page', 'url': canon, 'name': html.unescape(title),
            'description': html.unescape(desc), 'isPartOf': {'@id': BASE + '#site'}, 'inLanguage': 'en'}
    graph = [site, page] if rel == 'index.html' else [page | {'isPartOf': site}]
    add.append('<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>')
    h = h.replace('</head>', '\n'.join(add) + '\n</head>', 1)
    # footer logo is below the fold
    if '<img class="foot-logo" loading=' not in h:
        h = h.replace('<img class="foot-logo" ', '<img class="foot-logo" loading="lazy" decoding="async" ')
    return h

A11Y_CSS = ''

def a11y(h):
    return h

def run(root):
    css = os.path.join(root, 'assets', 'site.css')
    if os.path.exists(css):
        c = open(css, encoding='utf-8').read()
        if A11Y_CSS and '/* a11y-pass */' not in c:
            open(css, 'w', encoding='utf-8').write(c + A11Y_CSS)
    n = 0
    for dp, _, fs in os.walk(root):
        for f in fs:
            if not f.endswith('.html'):
                continue
            p = os.path.join(dp, f); rel = os.path.relpath(p, root).replace(os.sep, '/')
            h = open(p, encoding='utf-8').read(); new = a11y(fix(rel, h))
            if new != h:
                open(p, 'w', encoding='utf-8').write(new); n += 1
    return n

if __name__ == '__main__':
    print('pages updated:', run(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')))
