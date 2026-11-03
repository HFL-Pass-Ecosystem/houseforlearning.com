#!/usr/bin/env python3
"""Builds site/start-a-course.html: one plain page that lists real courses a visitor can open, join (test pay) and take.
Every link is checked to exist and to carry the join step (access.js). Added to rebuild_all after the course builders."""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
S = B.S
e = B.e
GROUPS = [
 ('ESL (English as a second language)', ['school-esl-e1-esl.html']),
 ('Primary', ['school-grade-03-eng.html', 'school-grade-05-eng.html']),
 ('Secondary', ['school-grade-09-eng.html']),
 ('Post-secondary', ['school-grade-11-humanities-geo.html']),
 ('Undergraduate and postgraduate', ['executive-module-1.html', 'learn-flagship-gl-01.html']),
 ('Business, for teams (B2B)', ['learn-ent-business-analyst-track.html', 'learn-ent-business-applications-erp-crm.html']),
 ('For you, as a person (B2C and D2C)', ['learn-flagship-career-launch.html', 'cpd-analysing-ratios-for-a-board.html']),
 ('AI side-income path (learn and earn)', ['ai-income-1.html']),
 ('By place, full course', ['learn-flagship-ae-petroleum.html']),
]
def title(fn):
    t = (S / fn).read_text()
    m = re.search(r'<title>(.*?) \| House for Learning</title>', t, re.S)
    return m.group(1) if m else fn
def ok(fn):
    p = S / fn
    return p.exists() and 'access.js' in p.read_text()
rows = ''
for name, files in GROUPS:
    items = ''.join(f'<li><a class="btn btn-ghost" href="{f}">{e(title(f))}</a></li>' for f in files if ok(f))
    if items:
        rows += f'<h3>{e(name)}</h3><ul class="cgrid">{items}</ul>'
steps = ('<ol><li>Sign in. On this preview only, use the button here: <button class="btn" type="button" id="ti" hidden>Test sign-in (preview only)</button> <span id="tis" aria-live="polite"></span></li>'
         '<li>Click a course below.</li><li>On the course page, click <strong>Join this course</strong>.</li>'
         '<li>Click the test pay step (test only, no real money).</li><li>You come back to the same page with every module open. Click <strong>Continue</strong> to take it.</li></ol>'
         '<p>Module 1 of every course is free to read before you join. On the real site, you sign in with your email link.</p>'
         '<script>(function(){var h=location.hostname;if(!(/\\.netlify\\.app$/.test(h)||h==="localhost"))return;var b=document.getElementById("ti"),s=document.getElementById("tis");'
         'function on(){return /(?:^|; )hfl_in=1/.test(document.cookie)}function show(){if(on()){b.hidden=true;s.textContent="You are signed in (test). Pick a course."}else{b.hidden=false;s.textContent=""}}'
         'b.addEventListener("click",function(){document.cookie="hfl_in=1; Path=/; Max-Age=86400";show()});show()})();</script>')
body = (B.sec('', 'st', 'four clicks', 'How to take a course', steps)
        + B.sec('alt', 'ls', 'start here', 'Pick a course', rows + '<p><a class="btn" href="my-learning.html">My learning home</a> <a class="btn" href="courses-all.html">See all courses</a> <a class="btn btn-ghost" href="catalogue.html">Catalogue</a></p>'))
fit = ('<ul class="cgrid">'
       '<li><strong>Learn (the course system)</strong><br>Works on this preview: join, modules, progress, My courses. <a href="members-courses.html">My courses</a></li>'
       '<li><strong>Earn (work and income)</strong><br>Page built, not working yet: no real jobs or payments. <a href="workspace.html">My workspace</a></li>'
       '<li><strong>Network (your profile)</strong><br>Page built, not working yet: no member-to-member network. <a href="members.html">My page</a></li>'
       '<li><strong>Marketplace</strong><br>Page built, not working yet: no live listings. <a href="marketplace.html">Marketplace</a></li></ul>')
body += B.sec('', 'fit', 'how it fits together', 'Learn, earn, network, marketplace', fit)
B.page('start-a-course.html', 'Start a course', 'Pick a course, join it, and take it. Four clicks.', 'Start a course',
       'Pick one course below. Join it with the test pay step and take it from Module 1.', body,
       '<li><a href="courses-hub.html">Courses</a></li><li>Start a course</li>', kicker='courses')
print('start-a-course.html written')
