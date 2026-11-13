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
    'Sri. V.R. Raghavendra Acharya and the family today', 'In the press',
    'assets/family/shamacharya.jpg', 'assets/family/ramacharya-rukmini-bai.jpg', 'assets/family/family-today.jpg',
    'assets/family/press-dekra-2015.jpg', 'assets/family/press-mep-2015-cover.jpg', 'assets/family/press-mep-2015-column.jpg',
    # IISc story, building stones and gallery (13 Nov)
    'The Indian Institute of Science and our family', 'Vedavyasacharya', 'Mountbatten',
    'assets/iisc-hrl-1951.jpg', 'assets/iisc-hrl-1953.jpg', 'assets/iisc-hrl-flume.jpg',
    'V. S. RAMACHARYA, ENGINEER-IN-CHARGE', 'key features of the project',
    'Vidhana Soudha', 'State Bank of Mysore head office',
]
s = open(PAGE, encoding='utf-8').read()
missing = [m for m in MUST_HAVE if m not in s]
for m in MUST_HAVE:
    if m.startswith('assets/') and not os.path.exists('site/' + m):
        missing.append('file ' + m)
if missing:
    print("founders' story: MISSING parts:"); [print('  -', m) for m in missing]; sys.exit(1)
print("founders' story OK (%d parts)" % len(MUST_HAVE))
