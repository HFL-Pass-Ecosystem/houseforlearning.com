"""Guard for the founders' story on site/about.html.

Fails if any approved part of the story, or any of its pictures, goes missing.
Add a line here whenever the founder approves a new part; never remove one
without the founder's word.
"""
import os, sys

PAGE = 'site/about.html'
MUST_HAVE = [
    # version 0 (12 Nov): family tribute, letter, founder's story
    'id="our-story"', 'From the Desk of the Chairpersons Emeritus', 'How I learned to Touch, Move and Inspire',
    # Our roots (13 Nov), family records and press
    'Our roots: a family of exemplars', 'Pujya Shri. V. Shyamacharya', 'Pujya Sri. Ramacharya and Smt. Rukumini Bai',
    'In the press', 'href="family-story/"',
    'assets/family/shamacharya.jpg', 'assets/family/ramacharya-rukmini-bai.jpg',
    'assets/family/press-dekra-2015.jpg', 'assets/family/press-mep-2015-cover.jpg', 'assets/family/press-mep-2015-column.jpg',
    # IISc story, building stones and gallery (13 Nov)
    'The Indian Institute of Science and our family', 'Vedavyasacharya', 'He worked with Dr. Rajendra Prasad, the first President of India.<',
    'assets/iisc-hrl-1951.jpg', 'assets/iisc-hrl-1953.jpg', 'assets/iisc-hrl-flume.jpg',
    'V. S. RAMACHARYA, ENGINEER-IN-CHARGE', 'The Hydraulic Research Laboratory</h4>',
    'Vidhana Soudha', 'State Bank of Mysore head office',
]
s = open(PAGE, encoding='utf-8').read()
missing = [m for m in MUST_HAVE if m not in s]
for m in MUST_HAVE:
    if m.startswith('assets/') and not os.path.exists('site/' + m):
        missing.append('file ' + m)
# FROZEN by the founder, 13 Nov 2026 22:54Z ("freeze this change"): the family story page, every file. Opening paragraphs revised on his word 14 Nov 2026.
import hashlib
FS_HASH = '98ad78fc882cccf986f58872f0a960829e2340d7bf1d41a85a2e4c32463277ab'
d = 'site/family-story'
lines = ''.join('%s  ./%s\n' % (hashlib.sha256(open(os.path.join(d, f), 'rb').read()).hexdigest(), f)
                for f in sorted((os.path.relpath(os.path.join(r, n), d) for r, _, ns in os.walk(d) for n in ns), key=lambda x: x.encode()))
if hashlib.sha256(lines.encode()).hexdigest() != FS_HASH:
    missing.append('family-story page changed (frozen by the founder 13 Nov 22:54Z; change only on his word)')
if missing:
    print("founders' story: MISSING parts:"); [print('  -', m) for m in missing]; sys.exit(1)
print("founders' story OK (%d parts)" % len(MUST_HAVE))
