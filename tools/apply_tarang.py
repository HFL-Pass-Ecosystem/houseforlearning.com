"""Add the Tarang wave panel to the empty right half of text-only heroes.
Idempotent. Skips frozen pages. Palette per space is set in PREFIX below (owner setting)."""
import re, glob, os
ROOT = os.path.join(os.path.dirname(__file__), '..', 'site')
FROZEN = {'index.html', 'about.html'}
FROZEN_DIRS = ('family-story',)
PREFIX = [  # page name prefix -> palette key in assets/tarang/tarang-palettes-ahfl.js
    ('bim', 'ahfl-construction-and-project-delivery'),
    ('campus', 'ahfl-education-and-edtech-campus'),
    ('school', 'ahfl-education-and-edtech-campus'),
    ('ai-', 'ahfl-ai-and-software'),
    ('electrical', 'ahfl-smart-manufacturing'),
    ('emba', 'ahfl-strategy-and-management-consulting'),
    ('executive', 'ahfl-strategy-and-management-consulting'),
    ('career', 'ahfl-careers-hr-and-hybrid-teams'),
    ('canada', 'ahfl-nri-and-global-mobility'),
    ('yoga', 'ahfl-healthcare-and-family-wellness'),
    ('cpd', 'ahfl-quality-testing-and-certification'),
    ('workplace', 'ahfl-careers-hr-and-hybrid-teams'),
    ('workspace', 'ahfl-careers-hr-and-hybrid-teams'),
]
HEAD = ('<link rel="stylesheet" href="{p}assets/tarang/tarang.css">'
        '<script src="{p}assets/tarang/tarang-palettes-ahfl.js" defer></script>'
        '<script src="{p}assets/tarang/tarang.js" defer></script>')
def palette(name):
    for pre, key in PREFIX:
        if name.startswith(pre): return key
    return 'site-houseforlearning'
changed = 0
for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
    rel = os.path.relpath(f, ROOT)
    if rel in FROZEN or rel.startswith(FROZEN_DIRS) or rel.startswith('drafts'): continue
    s = open(f, encoding='utf-8').read()
    if 'data-tarang' in s: continue
    m = re.search(r'(<section class="hero"[^>]*>)<div class="wrap hero-grid">(.*?)</div></section>', s, re.S)
    if not m: continue
    inner = m.group(2)
    if any(t in inner for t in ('<figure', '<img', '<svg', 'hero-art')): continue
    pal = palette(os.path.basename(rel))
    new = (m.group(1) + '<div class="wrap hero-grid has-tarang">' + inner +
           '<div class="tarang-panel" data-tarang data-palette="%s" aria-hidden="true"></div></div></section>' % pal)
    s = s[:m.start()] + new + s[m.end():]
    p = '../' * rel.count(os.sep)
    s = s.replace('</head>', HEAD.format(p=p) + '</head>', 1)
    open(f, 'w', encoding='utf-8').write(s); changed += 1
print('pages changed:', changed)
