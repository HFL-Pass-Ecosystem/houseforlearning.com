#!/usr/bin/env python3
"""All full-depth courses, grouped. Scans site/ and writes courses-all.html. Links to Russia pages are never added."""
import sys, pathlib, re, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape; S = B.R / 'site'
def title(f):
    m = re.search(r'<title>(.*?)(?: \| House for Learning)?</title>', f.read_text(), re.S)
    return html.unescape(m.group(1)).strip() if m else f.stem
G = [
 ('Core flagship courses', ['learn-flagship-cv', 'learn-flagship-platform-admin', 'learn-flagship-earthing', 'learn-flagship-career-launch']),
 ('Enterprise software, levels L1 to L7', ['learn-ent-']),
 ('Europe: ten chapters', ['learn-flagship-eu-']),
 ('Global: 75 courses for every market', ['learn-flagship-gl-']),
 ('India', []),
 ('UAE (Dubai and Abu Dhabi)', ['learn-flagship-ae-']),
 ('Brazil', ['learn-brazil-']),
 ('Canada and North America', ['learn-ca-']),
 ('Netherlands', ['learn-flagship-nl-']),
 ('Singapore', ['learn-flagship-sg-']),
 ('Australia', ['learn-flagship-au-']),
]
body = ''; n = 0
for i, (name, pre) in enumerate(G):
    fs = sorted(f for f in S.glob('learn-*.html') if any(f.stem.startswith(p) for p in pre) and 'russia' not in f.stem)
    if not fs: continue
    n += len(fs)
    cards = ''.join(f'<li class="cc"><a href="{f.name}"><h3>{e(title(f))}</h3></a></li>' for f in fs)
    body += B.sec('alt' if i % 2 else '', f'g{i}', 'courses', f'{name} ({len(fs)})', f'<ul class="cgrid">{cards}</ul>')
B.page('courses-all.html', 'All full-depth courses', f'{n} full-depth courses by area', 'All full-depth courses', e(f'{n} courses with modules, worked examples, rubrics and checks. Draft; nothing is live.'),
       body, B.crumb(('Courses', 'courses-hub.html'), ('All full-depth courses', None)), kicker='Courses')
print('indexed', n)
