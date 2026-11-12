#!/usr/bin/env python3
"""Builds site/session-kit*.html from data/training-sessions.json: facilitator, participant and admin guides, pre/during/post priming,
assessments with consent rules, and a clickable agenda with time stamps. Own words, no outside brand or person names. Test only.
Run: python3 tools/build_session_kit.py"""
import os, re, html, json
ROOT = os.path.join(os.path.dirname(__file__), '..')
SITE = os.path.join(ROOT, 'site')
D = json.load(open(os.path.join(ROOT, 'data', 'training-sessions.json'), encoding='utf-8'))
skel = open(os.path.join(SITE, 'career-pathways.html')).read()
i = skel.find('<main'); j = skel.find('</main>')
HEAD, TAIL = skel[:i], skel[j:]
e = html.escape
PAGES = [('session-kit.html', 'Session kit'), ('session-kit-facilitator.html', 'Facilitator guide'), ('session-kit-participant.html', 'Participant guide'),
         ('session-kit-admin.html', 'Admin guide'), ('session-kit-priming.html', 'Pre, during, post'), ('session-kit-assessments.html', 'Assessments')]
VL = D['vark_ls']
def tags(v): return ' '.join(f'<span class="st" title="{e(VL[x])}">{x}</span>' for x in v)
def fmt(t): return f'{t//3600}:{t%3600//60:02d}:{t%60:02d}' if t >= 3600 else f'{t//60}:{t%60:02d}'
CSS = ('<style>.sk table{border-collapse:collapse;width:100%;font-size:.95rem}.sk td,.sk th{border:1px solid #d9d3c2;padding:6px 8px;text-align:left;vertical-align:top}'
       '.sk .st{display:inline-block;background:#F2EEE2;border-radius:999px;padding:1px 9px;font-size:.78rem}.sk .ts{background:#0F85DB;color:#fff;border:0;border-radius:8px;padding:4px 10px;cursor:pointer;font:inherit}'
       '.sk video{width:100%;max-width:640px}@media (prefers-color-scheme:dark){.sk td,.sk th{border-color:#2a3948}.sk .st{background:#223241}}</style>')
def page(fn, title, intro, body, script=''):
    h = HEAD.replace('Course and Career Pathways | House for Learning', title + ' | House for Learning')
    h = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % e(intro[:150]), h)
    h = h.replace('career-pathways.html">', fn + '">')
    h = h.replace('<li aria-current="page">Career pathways</li>', '<li aria-current="page">%s</li>' % e(title))
    nav = ' '.join(f'<a class="btn btn-ghost" href="{f}">{t}</a>' for f, t in PAGES)
    out = ('<main id="main" tabindex="-1">\n<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">session kit</p><h1 id="h1">%s</h1><p>%s</p>'
           '<p class="lux-note">Draft for testing. Nothing here sends real messages, takes money or goes live.</p></div></div></section>\n'
           '<section class="sec"><div class="wrap"><div class="sk">%s<p>%s</p>%s<p class="ws-note">VARK LS: V visual, A aural, R read/write, K kinaesthetic, Au authoring, T training, L learning, E earning. Choose how you learn: see it, hear it, write it, do it.</p></div></div></section>\n'
           % (e(title), e(intro), CSS, nav, body))
    open(os.path.join(SITE, fn), 'w').write(h + out + (script and '<script>%s</script>' % script) + TAIL)
def plan_rows(who):
    return ''.join(f'<tr><td>{s["min"]} min</td><td><b>{e(s["name"])}</b><br>{tags(s["vark"])}</td><td>{e(s[who])}</td><td>{e(", ".join(s["bloom"]))}</td></tr>' for s in D['session_plan'])
def ul(xs): return '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in xs) + '</ul>'
def agenda(stamps, player_id='rec', video=''):
    v = f'<video id="{player_id}" controls preload="none" {"src=%s" % chr(34)+e(video)+chr(34) if video else ""}></video>' + ('' if video else '<p class="ws-note">The recording link is added after the session. The time buttons then jump the video.</p>')
    rows = ''.join(f'<tr><td><button class="ts" data-t="{s["t"]}" data-p="{player_id}">{fmt(s["t"])}</button></td><td>{e(s["label"])}</td></tr>' for s in stamps)
    return v + f'<table><tr><th>Jump to</th><th>What happens</th></tr>{rows}</table>'
SCRIPT = ("document.querySelectorAll('.ts').forEach(function(b){b.addEventListener('click',function(){var v=document.getElementById(b.dataset.p);"
          "if(v&&v.src){v.currentTime=+b.dataset.t;v.play()}})});")
page('session-kit.html', 'HFL Courses session kit', 'A simple kit for running a friendly, well-timed live session of about 2 hours.',
     '<div class="lux-panel"><p>Pick a guide above. Facilitators run the session. Participants know what to do. Admins set up and care for data.</p></div>'
     '<h2>Agenda with time stamps</h2>' + agenda(D['agenda_stamps']), SCRIPT)
page('session-kit-facilitator.html', 'Facilitator guide', 'Run a 2-hour live session: friendly, on time, every learner able to do one real thing.',
     '<h2>Before</h2>' + ul(['Test sound, screen and recording 30 minutes early.', 'Pin one chat message: login steps, support route, key dates.', 'Switch on live captions.', 'Have two helpers in chat.', 'Open the poll tool and the quiz link.', 'Prepare one finished example.'])
     + f'<h2>The 2-hour run</h2><table><tr><th>Time</th><th>Step</th><th>You do</th><th>Bloom\'s verbs</th></tr>{plan_rows("facilitator")}</table>'
     '<h2>Keep the room alive</h2>' + ul(['Ask a real question in chat, not just "type yes".', 'Wait about 15 seconds for a form, then move on.', 'Give a short holding line for a long question, then follow up.', 'Show it, say it, write it, let them do it.', 'Say what is optional. Never press anyone to pay or share in teaching time.'])
     + '<h2>Agenda with time stamps</h2>' + agenda(D['agenda_stamps']) + '<h2>After</h2>' + ul(['Post the recording and post-read within 24 hours.', 'Read the anonymous feedback and write one change for next time.']), SCRIPT)
page('session-kit-participant.html', 'Participant guide', 'What to do before, during and after a live session.',
     '<h2>Before</h2><ol><li>Read the pre-read (about 10 minutes).</li><li>Check sound and internet.</li><li>Keep a notebook.</li><li>Join 5 minutes early.</li></ol>'
     f'<h2>During</h2><table><tr><th>Time</th><th>Step</th><th>You do</th><th>Bloom\'s verbs</th></tr>{plan_rows("learner")}</table>'
     '<h2>After</h2><ol><li>Watch the recording if you missed a part: use the time buttons to jump.</li><li>Read the post-read.</li><li>Do the follow-up task.</li><li>Take the quiz for your certificate (your choice).</li><li>Write your private reflection.</li></ol>'
     '<h2>Three promises to yourself</h2>' + ul(['I will come to my sessions.', 'I will finish my tasks on time.', 'I will use what I learn.']) + '<h2>Need help?</h2><p>Use the help button. A helper answers at once; ask for a person any time.</p>')
ret = ''.join(f'<tr><td>{e(a["name"])}</td><td>{a["keep_days"]} days, then delete</td></tr>' for a in D['assessments'])
page('session-kit-admin.html', 'Admin guide', 'Set up a session, run the checks, support learners and look after their data.',
     '<h2>Set up</h2>' + ul(['Create the session: title, date, time (stored once, shown in each learner\'s time zone), join button, recording slot.', 'Load the pre-read and post-read.', 'Schedule reminders: 3 days, 1 day, 2 hours.', 'Create polls and the quiz; each one has a stated purpose.', 'Set the help route and reply time.', 'Test as a learner with demo data only.'])
     + '<h2>On the day</h2>' + ul(['Rehearse 30 minutes before.', 'One helper on chat, one on the join page.', 'Log problems without naming learners.']) + '<h2>After</h2>' + ul(['Check the recording is up and the join button says "watch recording".', 'Send the notification and check attendance.', 'Issue certificates only to learners who passed the quiz.', 'Add real time stamps to the recording agenda.'])
     + '<h2>Data care</h2>' + ul(D['consent_principles']) + f'<h2>Retention</h2><table><tr><th>Item</th><th>Keep</th></tr>{ret}</table><p>Real mail, SMS or WhatsApp and going live need written approval first.</p>')
def prow(xs, a, b): return ''.join(f'<tr><td>{e(x[a])}</td><td>{e(x["what"])}</td><td>{tags(x[b]) if isinstance(x[b], list) else e(x[b])}</td></tr>' for x in xs)
pr = D['priming']
page('session-kit-priming.html', 'Pre, during and post priming', 'Reading and reminders before, prompts during, notes and follow-ups after a live session.',
     f'<h2>Before</h2><table><tr><th>When</th><th>What</th><th>VARK LS</th></tr>{prow(pr["pre"], "when", "vark")}</table>'
     f'<h2>During</h2><table><tr><th>At</th><th>Prompt</th><th>Bloom\'s verb</th></tr>{prow(pr["during"], "at", "bloom")}</table>'
     f'<h2>After</h2><table><tr><th>When</th><th>What</th><th>VARK LS</th></tr>{prow(pr["post"], "when", "vark")}</table>'
     '<h2>Pre-read shape</h2><ol><li>Aim in one line.</li><li>Five key words, one plain line each.</li><li>One picture.</li><li>One small task, 10 minutes.</li></ol>'
     '<h2>Post-read shape</h2><ol><li>What we did, in steps.</li><li>Links and files.</li><li>Follow-up task with a due day.</li><li>Where to get help.</li></ol>')
rows = ''.join(f'<tr><td><b>{e(a["name"])}</b><br>{e(a["when"])}</td><td>{e(a["purpose"])}</td><td>{e(a["collects"])}</td><td>{"No" if a["anonymous"] else "Yes"}</td><td>{a["keep_days"]} d</td><td>{e(a["consent"])}</td></tr>' for a in D['assessments'])
QS = json.dumps(D['quiz_sample'])
page('session-kit-assessments.html', 'Assessments, mindfully collected', 'Polls, quick checks, a quiz and reflection, each with a reason, the least data and your choice.',
     '<h2>Our care rules</h2><ol>' + ''.join(f'<li>{e(p)}</li>' for p in D['consent_principles']) + '</ol>'
     f'<h2>What we collect</h2><table><tr><th>Type</th><th>Why</th><th>Collects</th><th>Tied to you?</th><th>Keep</th><th>Consent</th></tr>{rows}</table>'
     '<h2>Reflection prompts</h2><ol>' + ''.join(f'<li>{e(r)}</li>' for r in D['reflection_prompts']) + '</ol>'
     '<h2>Try the sample quiz</h2><p>Nothing is sent or saved. Your score stays on this page.</p><div id="quiz"></div><p><button class="ts" id="go">Check my answers</button></p><p id="res" aria-live="polite"></p>',
     "var Q=%s,box=document.getElementById('quiz');Q.forEach(function(q,i){var d=document.createElement('div');var b=document.createElement('b');b.textContent=(i+1)+'. '+q.q;d.appendChild(b);"
     "q.options.forEach(function(o,j){var l=document.createElement('label');l.style.display='block';var r=document.createElement('input');r.type='radio';r.name='q'+i;r.value=j;l.appendChild(r);l.appendChild(document.createTextNode(' '+o));d.appendChild(l)});box.appendChild(d)});"
    "document.getElementById('go').onclick=function(){var s=0,o=[];Q.forEach(function(q,i){var c=document.querySelector('input[name=q'+i+']:checked');var ok=c&&+c.value===q.answer;if(ok)s++;o.push((ok?'Right. ':'Not yet. ')+q.why)});document.getElementById('res').textContent='Score '+s+' of '+Q.length+'. '+o.join(' ')};" % QS)
# recordings agenda page for the two classes (private notes stay private; these show our own pattern only)
print('session kit written')
if __name__ == '__main__': pass
