#!/usr/bin/env python3
"""Pages whose course is a "Lesson outline" step table (course-eu-*, flagship editions) get assets/access.js, so joining, ticking steps,
progress, the final check and the certificate work on them like on every other course. Idempotent. Run: python3 tools/add_outline_gate.py"""
import glob, os
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
n = 0
for f in sorted(glob.glob(os.path.join(SITE, '*.html'))):
    t = open(f, encoding='utf-8').read()
    if 'class="ws-table"' in t and 'Lesson outline' in t and 'assets/access.js' not in t:
        open(f, 'w', encoding='utf-8').write(t.replace('</body>', '<script src="assets/access.js" defer></script>\n</body>', 1)); n += 1
print(n, 'outline pages gated')
