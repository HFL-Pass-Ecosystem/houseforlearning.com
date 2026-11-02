#!/usr/bin/env python3
"""Run after build_full_courses.py. Plain wording on the audience entry pages, a way into the business routes from the learners page,
and the other English courses on the ESL page. Idempotent. Generic wording only."""
import pathlib, re
S = pathlib.Path(__file__).resolve().parents[1] / 'site'
def sub(fn, a, b):
    p = S / fn; t = p.read_text()
    if a in t: p.write_text(t.replace(a, b))
def sec(i, kick, h2, inner, alt=False):
    return (f'<section class="sec{" alt" if alt else ""}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{kick}</p><h2 id="{i}">{h2}</h2></div><div class="sec-body">{inner}</div></div></section>')
def add_before_main_end(fn, marker, block):
    p = S / fn; t = p.read_text()
    if marker in t: return
    p.write_text(t.replace('</main>', block + '</main>', 1))
OLD1 = 'The owner has not fixed the age range; this is our default and can be changed in one place.'
for fn in ['learners-esl', 'learners-primary', 'learners-secondary', 'learners-post-secondary']:
    sub(fn + '.html', OLD1, 'This age range is our default and can be changed.')
for fn in ['learners-ug', 'learners-pg', 'learners-phd']:
    sub(fn + '.html', 'Age range is our default; the owner can change it.', 'Age range is our default and can be changed.')
add_before_main_end('learners.html', 'id="ways"', sec('ways', 'also for', 'Organisations, families and direct learners',
    '<ul class="cgrid"><li class="cc"><a href="b2b.html"><h3>B2B</h3><p>Courses for organisations and training partners</p></a></li>'
    '<li class="cc"><a href="b2c.html"><h3>B2C</h3><p>Courses for learners on our marketplace</p></a></li>'
    '<li class="cc"><a href="d2c.html"><h3>D2C</h3><p>Learn direct from House for Learning</p></a></li>'
    '<li class="cc"><a href="cpd.html"><h3>Professional development</h3><p>Short courses for working people</p></a></li></ul>', True))
add_before_main_end('learners-esl.html', 'id="more-en"', sec('more-en', 'more English', 'English for work and for health care',
    '<ul class="cgrid"><li class="cc"><a href="learn-flagship-in-30-english-as-a-second-language.html"><h3>English as a second language, adult course</h3><p>A full course for adults, with units, outcomes and checks.</p></a></li>'
    '<li class="cc"><a href="cpd-talking-with-patients-and-families-in-a-second-language.html"><h3>Talking with patients and families in a second language</h3><p>A short professional course for care workers.</p></a></li>'
    '<li class="cc"><a href="cpd-plain-english-for-ward-handovers.html"><h3>Plain English for ward handovers</h3><p>A short professional course for clear spoken handovers.</p></a></li></ul>', True))
