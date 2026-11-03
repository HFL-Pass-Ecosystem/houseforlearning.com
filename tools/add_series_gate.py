#!/usr/bin/env python3
"""Stamp the pay-to-access series attributes onto the Career Launch lesson pages (site/career-launch-lesson-1..9.html).
Lesson 1 stays a free preview; assets/access.js does the rest. Idempotent. Run: python3 tools/add_series_gate.py"""
import pathlib, re
S = pathlib.Path(__file__).resolve().parent.parent / 'site'
N = 9
for n in range(1, N + 1):
    p = S / f'career-launch-lesson-{n}.html'
    t = p.read_text()
    new = f'<main id="main" tabindex="-1" data-series="career-launch.html" data-lesson="{n}" data-lessons="{N}" data-title="Career Launch">'
    t2 = re.sub(r'<main id="main" tabindex="-1"[^>]*>', new, t, count=1)
    if 'assets/courses.css' not in t2: t2 = t2.replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="stylesheet" href="assets/site.css">\n<link rel="stylesheet" href="assets/courses.css">', 1)
    if 'assets/access.js' not in t2: t2 = t2.replace('</body>', '<script src="assets/access.js" defer></script>\n</body>', 1)
    if t2 != t: p.write_text(t2)
print('stamped', N)
