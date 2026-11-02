#!/usr/bin/env python3
"""Hub pages for Netherlands, Singapore and Australia flagship courses; adds three cards to courses-hub.html (idempotent)."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
import flagship_data_nl as NL, flagship_data_sg as SG, flagship_data_au as AU
e = html.escape
def short(t, n=200):
    """Keep whole sentences (no mid-sentence cut) up to about n characters."""
    if len(t) <= n: return t
    cut = t[:n]; i = cut.rfind('. ')
    return cut[:i + 1] if i > 40 else t[:t.find('. ') + 1] if '. ' in t else t
R = [('nl', 'Netherlands', NL), ('sg', 'Singapore', SG), ('au', 'Australia', AU)]
for k, name, m in R:
    cards = ''.join(f'<li class="cc"><a href="learn-flagship-{c["id"].lower()}.html"><span class="pill lv">L4 Practitioner</span><h3>{e(c["title"])}</h3><p>{e(short(c["summary"]))}</p><p class="cm">8 modules · worked examples · ten-question check</p></a></li>' for c in m.C)
    body = B.sec('', 'ls', 'courses', f'{len(m.C)} full courses', f'<ul class="cgrid">{cards}</ul><p class="ws-note">Draft courses. Own wording. Not live.</p>')
    B.page(f'courses-{k}.html', f'{name} courses', f'{len(m.C)} full-depth courses for {name}, each with 8 modules, worked examples, rubric and check.', f'{name} courses', f'{len(m.C)} full-depth courses with 8 modules, worked examples, a rubric, a ten-question check and an L1 to L7 ladder.', body, B.crumb(('Courses', 'courses-hub.html'), (name, None)), kicker=f'{name} courses')
p = B.S / 'courses-hub.html'
t = p.read_text()
add = ''.join(f'<li class="cc"><a href="courses-{k}.html"><h3>{name} courses</h3><p>{len(m.C)} full-depth courses</p></a></li>' for k, name, m in R)
if 'courses-nl.html' not in t:
    marker = '<li class="cc"><a href="courses-all.html">'
    assert marker in t
    p.write_text(t.replace(marker, add + marker, 1))
print('hubs built')
