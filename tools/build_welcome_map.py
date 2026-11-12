#!/usr/bin/env python3
"""Builds site/welcome-map.html: a one-page cluster of the first steps for a new learner (link, sign-in, notifications, weekly live sessions and Q and A, ask a question, announcements).
Own words, no outside brand names. Honest status labels. Run: python3 tools/build_welcome_map.py"""
import os, re, html
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
skel = open(os.path.join(SITE, 'career-pathways.html')).read()
i = skel.find('<main'); j = skel.find('</main>')
HEAD, TAIL = skel[:i], skel[j:]
e = html.escape
# (title, what it is for you, link, link text, status)
NODES = [
 ('1 Your learning link', 'One web address for everything: your courses, sessions, notes and recordings. Save it on your phone home screen.', 'my-learning.html', 'Open My learning', 'Test page works now'),
 ('2 Your sign-in', 'Use your registered phone number or email. A one-time code comes to you; no password to remember.', 'members.html', 'Go to Members', 'Test sign-in works now'),
 ('3 Notifications', 'Reminders by WhatsApp and in your learning home: next session, pre-read ready, recording ready.', 'help.html', 'See reminders and help', 'Page built; real reminders need the owner\'s go-ahead'),
 ('4 Weekly live sessions and Q and A', 'Live coaching at the weekend and an open Q and A on weekdays. Join from one button; it turns into "watch recording" after the session.', 'live-sessions.html', 'See live sessions', 'Page works; dates are samples'),
 ('5 Ask your question here', 'One tap opens a ready-made message; you only add your question. A holding reply comes quickly, the full answer within the stated time, and a person if you need one.', 'help.html', 'Ask a question', 'Works as a test; nothing is sent'),
 ('6 Announcements from us', 'Batch dates, new lessons and offers arrive in one place, and by WhatsApp when you allow it.', 'learning-hub.html', 'See your updates', 'Page works; real sending is not on'),
]
FAQ = [('I signed in but everything looks locked. Why?', 'Usually only the booking amount is paid. Finish registration and the rest unlocks, with all bonuses. If you finished today, allow 24 hours.'),
       ('How do I get my certificate?', 'Phase by phase, after you finish the phase lessons and its quiz.'),
       ('Who do I ask about payment?', 'Our admissions team, through the contact page. Payment questions are never answered in a public chat.')]
CSS_TXT = ('.fsm{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));align-items:stretch}'
       '.fsm .hub{grid-column:1/-1;background:#0F85DB;color:#fff;border-radius:16px;padding:18px;text-align:center;font-weight:700;font-size:1.15rem}'
       '.fsm .nd{background:#fff;border:1px solid #d9d3c2;border-left:6px solid #3CC261;border-radius:14px;padding:14px;min-width:0}'
       '.fsm .nd h3{margin:0 0 6px;font-size:1.05rem}.fsm .st{display:inline-block;background:#F2EEE2;border-radius:999px;padding:3px 10px;font-size:.8rem;margin:6px 0}'
       '.fsm .btn{margin-top:6px}@media (prefers-color-scheme:dark){.fsm .nd{background:#18232d;border-color:#2a3948;color:#eef2f5}.fsm .st{background:#223241}}')
open(os.path.join(SITE,'assets','welcome-map.css'),'w').write(CSS_TXT+'\n')
CSS = '<link rel="stylesheet" href="assets/welcome-map.css">'
def build():
    h = HEAD.replace('Course and Career Pathways | House for Learning', 'Your first steps | House for Learning')
    h = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Your first steps as a new learner: your link, your sign-in, reminders, live sessions, questions and announcements.">', h)
    h = h.replace('career-pathways.html">', 'welcome-map.html">')
    h = h.replace('<li aria-current="page">Career pathways</li>', '<li aria-current="page">Your first steps</li>')
    cards = ''.join(f'<div class="nd"><h3>{e(t)}</h3><p>{e(d)}</p><span class="st">{e(s)}</span><br><a class="btn btn-ghost" href="{l}">{e(lt)}</a></div>' for t, d, l, lt, s in NODES)
    body = ('<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">start here</p><h1 id="h1">Your first steps</h1>'
            '<p>Six things to know on day one. Tap any box to go there. Full access opens within 24 hours of joining.</p>'
            '<p class="lux-note">Draft for testing. Nothing here sends real messages or takes real money.</p></div></div></section>\n'
            '<section class="sec" aria-labelledby="wm"><div class="wrap"><div class="sec-head"><p class="kicker">the map</p><h2 id="wm">Everything in one cluster</h2></div>'
            f'<div class="sec-body">{CSS}<div class="fsm"><div class="hub">Your learning home</div>{cards}</div>'
            '<h3>Common questions</h3>' + ''.join(f'<details class="lux-panel"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in FAQ) +
            '<p class="ws-note">Choose how you learn: see it in the roadmap, hear it in live sessions, do it in the tasks, write it in your notes.</p></div></div></section>\n')
    open(os.path.join(SITE, 'welcome-map.html'), 'w').write(h + '<main id="main" tabindex="-1">\n' + body + TAIL)
    print('welcome-map written')
if __name__ == '__main__':
    build()
