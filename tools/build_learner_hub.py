#!/usr/bin/env python3
"""Builds the learner-home pages that follow the learner journey: learning hub, live sessions, projects, career portal,
certificate hub, AI toolkit, community, learning feed, help, starter kit. Own words, no outside names, dummy data only.
Test only: nothing is sent, nothing is paid. Script lives in site/assets/learner-hub.js (no inline scripts).
Run: python3 tools/build_learner_hub.py"""
import os, re, html
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
skel = open(os.path.join(SITE, 'career-pathways.html')).read()
i = skel.find('<main'); j = skel.find('</main>')
HEAD, TAIL = skel[:i], skel[j:]
e = html.escape
CSSTXT = ('.lh{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}'
 '.lh .c{background:#fff;border:1px solid #d9d3c2;border-left:6px solid #0F85DB;border-radius:14px;padding:14px;min-width:0}'
 '.lh .c h3{margin:0 0 6px;font-size:1.05rem}.lh .st{display:inline-block;background:#F2EEE2;border-radius:999px;padding:3px 10px;font-size:.8rem;margin:6px 0}'
 '.lh .ok{border-left-color:#3CC261}.lh table{width:100%;border-collapse:collapse}.lh th,.lh td{text-align:left;padding:8px;border-bottom:1px solid #d9d3c2;vertical-align:top}'
 '.lhbar{background:#F2EEE2;border-radius:999px;height:12px;overflow:hidden}.lhbar i{display:block;height:100%;width:0;background:#3CC261}'
 '.lhtabs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.lhgo{font-size:1.1rem;padding:14px 22px}'
 '.lhph{background:#F2EEE2;border:2px dashed #0F85DB;border-radius:12px;padding:22px;text-align:center;color:#14202b}'
 '.lhn{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0}.lh label{display:block;margin:6px 0}.lh textarea,.lh input[type=text]{width:100%;max-width:560px;padding:8px}'
 '@media (prefers-color-scheme:dark){.lh .c{background:#18232d;border-color:#2a3948;color:#eef2f5}.lh .st,.lhbar,.lhph{background:#223241;color:#eef2f5}.lh th,.lh td{border-color:#2a3948}}')
open(os.path.join(SITE,'assets','learner-hub.css'),'w').write(CSSTXT+'\n')
CSS = ''
NOTE = '<p class="ws-note">Draft for testing. Sample content only. Nothing here sends real messages or takes real money.</p>'
def cards(items, cls=''):
    out = ''
    for it in items:
        t, d = it[0], it[1]; l = it[2] if len(it) > 2 else None; lt = it[3] if len(it) > 3 else 'Open'
        out += f'<div class="c {cls}"><h3>{e(t)}</h3><p>{e(d)}</p>' + (f'<a class="btn btn-ghost" href="{l}">{e(lt)}</a>' if l else '') + '</div>'
    return f'<div class="lh-grid lh">{out}</div>'
def table(head, rows):
    return '<div class="lh"><table><thead><tr>' + ''.join(f'<th>{e(h)}</th>' for h in head) + '</tr></thead><tbody>' + \
      ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows) + '</tbody></table></div>'
def ph(label): return f'<div class="lhph">Picture placeholder: {e(label)}</div>'
def sec(i, kick, h2, inner):
    return f'<section class="sec" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body"><div class="lh">{inner}</div></div></div></section>\n'
def write(fn, title, desc, kicker, h1, lead, body):
    h = HEAD.replace('Course and Career Pathways | House for Learning', f'{title} | House for Learning')
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(desc)}">', h)
    h = h.replace('career-pathways.html">', fn + '">')
    h = h.replace('<li aria-current="page">Career pathways</li>', f'<li aria-current="page">{e(title)}</li>')
    hero = (f'<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">{e(kicker)}</p><h1 id="h1">{e(h1)}</h1><p>{e(lead)}</p></div></div></section>\n')
    t = h + '<main id="main" tabindex="-1">\n' + hero + CSS + body + NOTE + '\n' + TAIL
    if 'name="robots"' in t: t = re.sub(r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="noindex">', t, 1)
    else: t = t.replace('</head>', '<meta name="robots" content="noindex">\n</head>', 1)
    if 'learner-hub.css' not in t: t = t.replace('</head>', '<link rel="stylesheet" href="assets/learner-hub.css">\n</head>', 1)
    if 'learner-hub.js' not in t: t = t.replace('</body>', '<script src="assets/learner-hub.js" defer></script>\n</body>', 1)
    open(os.path.join(SITE, fn), 'w').write(t)
    print(fn, 'written')

# ---------- Learning hub ----------
write('learning-hub.html', 'Learning hub', 'Your path in one place: courses, live sessions, projects, career and certificates.', 'members', 'Learning hub',
 'Your structured path from first lesson to certificate. No prior knowledge needed: everything starts from scratch.',
 sec('lh1', 'four doors', 'Where do you want to go?', cards([
  ('Course library', 'All courses and units. Updated every week.', 'courses-all.html', 'Open courses'),
  ('Live sessions and recordings', 'Weekend coaching, weekday questions, and every recording.', 'live-sessions.html', 'Open sessions'),
  ('Project library', 'Short real-world projects you can finish at your own pace.', 'projects.html', 'Open projects'),
  ('Career portal', 'Open roles, your applications and your profile.', 'career-portal.html', 'Open career portal')], 'ok')) +
 sec('lh0', 'start', 'Start here', '<p><a class="btn lhgo" href="start.html">Start learning, training, authoring, earning and more</a></p>') +
 sec('lh2', 'more', 'And also', cards([
  ('Certificate hub', 'Finish a session, pass its quiz, receive your certificate.', 'certificate-hub.html', 'Open certificates'),
  ('AI toolkit', 'Tool offers, assistants, agent templates and a skills directory.', 'ai-toolkit.html', 'Open toolkit'),
  ('Community', 'Alumni, project gallery, gratitude wall and achievements.', 'community.html', 'Open community'),
  ('Learning feed', 'Short tips and facts instead of endless scrolling.', 'learning-feed.html', 'Open feed'),
  ('Help', 'Ask a question in one tap. A person is always one step away.', 'help.html', 'Get help'),
  ('Starter kit', 'Read once before you begin.', 'starter-kit.html', 'Open starter kit')])) +
 sec('lh3', 'your roadmap', 'Your learning roadmap', '<p>Progress on the sample path: <strong id="lhp-t">0 of 21 lessons</strong></p><div class="lhbar" role="img" aria-label="progress bar"><i id="lhp-b"></i></div>'
  '<p class="note">The bar is a sample. Your real progress shows once you join a course.</p>' +
  table(['Phase', 'What you do', 'Status'], [
   ['1 Build', '5 weeks: make working things with AI helpers', 'Upcoming'], ['2 Sell', '4 weeks: find clients, pitch, price', 'Upcoming'],
   ['3 Hackathon', '1 week: build, pitch and show', 'Upcoming'], ['Capstone', 'One final project that goes in your showcase', 'Upcoming']])))

# ---------- Live sessions ----------
SESS = [('Sat', 'Live coaching: build your first AI-powered page', '2026-11-28T14:00:00Z'), ('Sun', 'Live coaching: improve it and share it', '2026-11-29T14:00:00Z')]
write('live-sessions.html', 'Live sessions', 'Weekend live coaching, weekday open questions, key dates and recordings.', 'members', 'Live sessions',
 'Live coaching at the weekend. Open questions on weekdays. Every session is recorded.',
 sec('ls1', 'next up', 'Your next live session',
  '<div class="c ok"><h3>Live coaching: build your first AI-powered page</h3><p>Sample date shown in your own time zone: <strong data-utc="2026-11-28T14:00:00Z">Saturday 28 November, 14:00 UTC</strong></p>'
  '<p><button class="btn lhgo" id="lhjoin" data-start="2026-11-28T14:00:00Z" data-end="2026-11-28T16:00:00Z" type="button">Opens soon</button></p>'
  '<p class="note">One button: it says "Join live session" during the session and "Watch recording" afterwards. Notes appear beside it.</p>'
  '<details class="lux-panel"><summary>Before you join (pre-read)</summary><ul><li>Read the pre-read page the day before</li><li>Check sound and internet</li><li>Keep a notebook ready</li><li>Join five minutes early</li></ul></details>'
  '<details class="lux-panel"><summary>After the session (post-read)</summary><p>Your notes and the recording appear here about a day after class.</p></details></div>') +
 sec('ls2', 'key dates', 'Key dates', table(['What', 'When (your time zone)'], [
  ['First live coaching session (morning batch)', '<span data-utc="2026-11-28T14:00:00Z">28 Nov 2026</span>'],
  ['Alternate batch starts a week later', '<span data-utc="2026-12-05T14:00:00Z">5 Dec 2026</span>'],
  ['Registration deadline', '<span data-utc="2026-11-26T18:29:00Z">26 Nov 2026</span>'],
  ['Batch-choice form deadline', '<span data-utc="2026-11-26T18:29:00Z">26 Nov 2026</span>']]) +
  '<p class="note">These are sample dates for the test site. Real dates are set for each batch.</p>') +
 sec('ls3', 'choose a batch', 'Pick your batch', '<form class="lhf"><label><input type="radio" name="batch" value="morning" checked> Morning batch (the default)</label>'
  '<label><input type="radio" name="batch" value="evening"> Evening batch, one week later</label><p id="lhbatch" class="note" aria-live="polite">Do nothing and you stay in the morning batch.</p></form>') +
 sec('ls4', 'calendar', 'Weekly rhythm', table(['Day', 'What happens', 'Format'], [
  ['Monday to Friday', 'Open questions: ask anything about your lessons', 'Live, chat and open microphone'],
  ['Saturday and Sunday', 'Live coaching: learn, do, share', 'About 2 hours, recorded'],
  ['After each session', 'Recording, notes and a short quiz', 'In your learning home']]) +
  '<p>A live session plan: welcome (10 min), show (40), do together (40), dates and next steps (10), questions (20).</p>') +
 sec('ls5', 'previous recordings', 'Previous recordings', '<p>No recordings yet. After your first session this list fills in, newest first, with a note and a quiz link beside each.</p>'
  '<p class="note">Lifetime access to your recordings is planned; the exact terms will be stated on the join page before anyone pays.</p>'))

# ---------- Projects ----------
PR = [('Spreadsheet summaries in minutes', '1 h 10 min', 6), ('Build a one-page website with an AI helper', '2 h 00 min', 9), ('A simple online shop page', '2 h 30 min', 10),
 ('Clean and chart a small data set', '1 h 40 min', 8), ('Write a client proposal that wins', '1 h 15 min', 6), ('A resume and profile makeover', '1 h 00 min', 5),
 ('Automate a weekly report', '1 h 50 min', 8), ('A question-answering helper over your own notes', '2 h 20 min', 9), ('Turn business numbers into a clear one-page summary', '1 h 30 min', 7)]
VERB = [('Start learning', 'start-a-course.html'), ('Start training', 'training.html'), ('Start earning', 'earning.html'), ('Start authoring', 'author-a-module.html'), ('Start LAB', 'lab.html'), ('Start LEAP', 'leap.html')]
write('projects.html', 'Project library', 'Short self-paced projects with hours, lessons and a start button, plus a showcase.', 'members', 'Project library',
 'Real-world mini projects. Pick one, finish it, put it in your showcase.',
 sec('pj1', 'all projects', 'Choose a project', '<div class="lh-grid lh">' + ''.join(
  f'<div class="c"><h3>{e(t)}</h3><p>{e(h)} · {n} lessons</p><span class="st">Sample project</span><br><a class="btn btn-ghost" href="{VERB[i % len(VERB)][1]}">{VERB[i % len(VERB)][0]}</a></div>' for i, (t, h, n) in enumerate(PR)) + '</div>') +
 sec('pj2', 'showcase', 'Project showcase', '<p>Share your finished project and get feedback from your peers. Show only what you are happy to share.</p>' + ph('showcase screenshot grid') +
  '<p><a class="btn btn-ghost" href="community.html">Open the project gallery</a></p>'))

# ---------- Career portal ----------
write('career-portal.html', 'Career portal', 'Open roles, your applications and your profile.', 'members', 'Career portal',
 'Opportunities, your applications and your profile in one place.',
 sec('cp1', 'open roles', 'Active opportunities', table(['Role', 'Type', 'Where', ''], [
  ['Junior data assistant', 'Part time', 'Remote', '<a class="btn btn-ghost" href="#cp2">Apply</a>'],
  ['Content and web helper', 'Freelance', 'Remote', '<a class="btn btn-ghost" href="#cp2">Apply</a>'],
  ['Training coordinator', 'Full time', 'Dubai', '<a class="btn btn-ghost" href="#cp2">Apply</a>']]) + '<p class="note">Sample roles for testing.</p>') +
 sec('cp2', 'my applications', 'My applications', '<p id="lhapps">You have not applied for anything yet. Applications you start will be listed here with their status.</p>') +
 sec('cp3', 'my profile', 'My career profile', '<p>Your skills, your certificates and your showcase projects in one profile you control. You choose what employers can see.</p>'
  '<p><a class="btn btn-ghost" href="members.html">Open my page</a></p>'))

# ---------- Certificate hub ----------
write('certificate-hub.html', 'Certificate hub', 'Finish a session, pass its quiz, receive your certificate.', 'members', 'Certificate hub',
 'Three ticks per lesson: session, quiz, certificate. Everything you earn is kept on this page.',
 sec('ch1', 'how it works', 'How you earn a certificate', table(['Step', 'What you do', 'Tick'], [
  ['1 Session', 'Join the live session or watch the recording', '&#9744;'], ['2 Quiz', 'Take the short quiz. Pass mark 70 percent', '&#9744;'],
  ['3 Certificate', 'Your certificate is issued with a code anyone can check', '&#9744;']]) +
  '<p>Certificates come phase by phase, after the lessons and the quiz of that phase.</p>') +
 sec('ch2', 'my certificates', 'My certificates', '<p>None yet. Pass your first quiz and it appears here.</p><p><a class="btn btn-ghost" href="certificate.html">Check a certificate code</a> <a class="btn btn-ghost" href="members-courses.html">My courses</a></p>'))

# ---------- AI toolkit ----------
OFFERS = [('Meeting notes helper', 'A sample offer: 6 months free'), ('Slide maker', 'A sample offer: 3 months free'), ('Data helper', 'A sample offer: 6 months free'),
 ('Automation builder', 'A sample offer: 6 months free'), ('Voice dictation', 'A sample offer: 3 months free')]
AGENTS = [('Resume tailor', 'Rewrites your resume for one job advert', 'Recruitment and career', 'Easy'), ('Lead follow-up writer', 'Drafts a polite follow-up for each lead', 'Sales and marketing', 'Easy'),
 ('Weekly report builder', 'Turns a sheet of numbers into a short report', 'Data and analytics', 'Medium'), ('Post planner', 'Plans a week of short posts', 'Content and social', 'Easy'),
 ('Budget explainer', 'Explains a budget in plain words. Learning only, never advice', 'Finance learning', 'Medium'), ('Meeting summariser', 'Turns notes into actions', 'Operations', 'Medium')]
ASSIST = [('Website helper', 'Helps you plan and publish a simple site'), ('App idea sketcher', 'Turns an idea into screens and steps'), ('Notes question-answerer', 'Answers questions from your own documents'),
 ('Formula helper', 'Spreadsheet formulas from plain words'), ('Database checker', 'Spots queries that look wrong')]
SKILLS = [('Weak-ad check', 'Finds what is wasting money in an ad account', 'Marketing'), ('Marks to reteach plan', 'Turns marks into topic gaps and a reteach plan', 'Educators'),
 ('Answer structurer', 'Helps structure exam answers', 'Students'), ('Content brief builder', 'Builds a brief for a writer', 'Content'),
 ('Contract terms review', 'Highlights terms to ask about. Not legal advice', 'Business owners'), ('Demand and reorder forecast', 'Forecasts what to reorder', 'Operations')]
write('ai-toolkit.html', 'AI toolkit', 'Tool offers, agent templates, assistants and a skills directory for learners.', 'members', 'AI toolkit',
 'Everything to put AI to work, with a short guide for each.',
 sec('at1', 'six cards', 'What is inside', cards([
  ('Premium AI tools', 'Offers with a short guide and a claim button.', '#at2', 'See offers'), ('Custom assistants', 'Helpers built for different jobs.', '#at4', 'See assistants'),
  ('Agent bank', 'Ready-made agent templates with a how-to video.', '#at3', 'See agents'), ('Workshop resources', 'Files, notes and bonus material from your workshop.', 'learning-hub.html', 'Open hub'),
  ('Our AI assistant', 'Ask anything. Small, quick model first, a bigger one only when needed.', 'help.html', 'Ask'), ('Skills directory', 'Ready-made skills by who they are for.', '#at5', 'See skills')], 'ok')) +
 sec('at2', 'offers', 'Premium AI tools', '<p>Watch the short guide, press claim, and the offer moves to Claimed. Claiming opens the day after you join.</p>'
  '<div class="lh-grid lh">' + ''.join(f'<div class="c" data-offer="{i}"><h3>{e(t)}</h3><p>{e(d)}</p><p><a href="start-a-course.html">Short guide</a></p><button class="btn btn-ghost" type="button" data-claim="{i}">Claim it</button></div>' for i, (t, d) in enumerate(OFFERS)) + '</div>'
  '<h3>Claimed offers</h3><p id="lhclaimed" aria-live="polite">Nothing claimed yet.</p><p class="note">Sample offers. The code stays hidden until you tap show.</p>') +
 sec('at3', 'agents', 'Agent bank', table(['#', 'Agent', 'What it does', 'Category', 'Level'], [[str(i + 1), e(a), e(b), e(c), e(d)] for i, (a, b, c, d) in enumerate(AGENTS)]) +
  '<p class="note">Showing 6 of a larger library. Finance rows are for learning only.</p>') +
 sec('at4', 'assistants', 'Custom assistants', cards(ASSIST)) +
 sec('at5', 'skills', 'Skills directory', '<div class="lh-grid lh"><div class="c"><h3>What are skills?</h3><p>Reusable instructions and knowledge that extend the assistant for one job.</p></div>'
  '<div class="c"><h3>Built-in and your own</h3><p>Use a skill from the library or write your own.</p></div></div>' +
  table(['Skill', 'What it does', 'For'], [[e(a), e(b), e(c)] for a, b, c in SKILLS])))

# ---------- Community ----------
write('community.html', 'Community', 'A space to connect, collaborate and grow.', 'members', 'Community',
 'Meet alumni, show your projects, say thank you and celebrate achievements.',
 sec('cm1', 'five spaces', 'Choose a space', cards([
  ('Notable alumni', 'Learners who went on to do well. Shown only with their written consent.'), ('Project gallery', 'Show your latest project and get feedback.', 'projects.html#pj2', 'Open'),
  ('Impact and gratitude', 'Thank a peer or a teacher who helped you.', '#cm2', 'Write a thank-you'), ('Achievements', 'Celebrate a certificate, a milestone or a new role. We check proof before featuring anyone.', 'certificate-hub.html', 'Apply'),
  ('My posts', 'Your own space to share and join in.')], 'ok')) +
 sec('cm2', 'gratitude wall', 'Gratitude wall', '<form class="lhf"><label>Thank someone (no names or contact details)<input type="text" id="lhthanks" maxlength="140"></label>'
  '<button class="btn" type="button" id="lhthanksb">Post to the wall</button></form><ul id="lhwall"><li>Thank you to the peer who helped me finish my first page.</li></ul>'
  '<p class="note">Sample wall. Posts stay in this browser during testing.</p>'))

# ---------- Feed ----------
FEED = [('Tip', 'Ask the assistant to explain a thing like you are new to it, then ask for one small exercise.'), ('Fact', 'Short, regular practice beats one long session.'),
 ('News', 'Sample card: a plain-words summary of one useful change in AI tools this week.'), ('Tip', 'Save every prompt that works in one notebook.')]
write('learning-feed.html', 'Learning feed', 'Short tips and facts that teach something while you scroll.', 'members', 'Learning feed',
 'Learn while you scroll. A calm daily limit keeps it useful.',
 sec('fd1', 'today', 'Today', '<div class="lh-grid lh">' + ''.join(f'<div class="c"><span class="st">{t}</span><h3>{e(x)}</h3><button class="btn btn-ghost" type="button" data-like>Like</button> <button class="btn btn-ghost" type="button" data-save>Save</button></div>' for t, x in FEED) + '</div>'
  + ph('short video card') + '<p class="note">Four cards a day in this test. Best in the members app once it is live.</p>'))

# ---------- Help ----------
write('help.html', 'Help', 'Ask a question in one tap. Three ways to get help, and a person is always one step away.', 'members', 'Help',
 'Ask in one tap. The message is already written; you only add your question.',
 sec('hp1', 'ask now', 'Ask for help', '<form class="lhf" id="lhask"><label>Your message<textarea id="lhmsg" rows="4">I need help with my course. My question: </textarea></label>'
  '<p><button class="btn" type="button" id="lhsend">Send my question</button></p><p id="lhreply" class="note" aria-live="polite"></p></form>'
  '<p class="note">Test only: your question is kept in this browser. Nothing is sent to anyone.</p>') +
 sec('hp2', 'three routes', 'Three ways to get help', cards([
  ('Chat helper', 'Answers at once with clear steps. Ask for a person any time.', '#hp1', 'Ask now'), ('Talk to a person', 'Press "talk to a person". A quick holding reply comes first; the full answer within 4 working hours.', '#hp1', 'Ask a person'),
  ('Voice helper', 'One big "Talk now" button. Coming later.')], 'ok') + '<p>If a helper cannot solve it, you can go back to the chat or hand over to a person.</p>') +
 sec('hp3', 'common questions', 'Quick answers', ''.join(f'<details class="lux-panel"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in [
  ('I cannot sign in', 'Use the email or phone number you registered with. Enter the six-digit code. Wait for the timer, then ask for a new code.'),
  ('Everything looks locked', 'Registration may not be finished. Finish it and the rest opens, within 24 hours.'),
  ('Who answers payment questions?', 'Our admissions team, through the contact page. Never in a public chat.')])) +
 sec('hp4', 'report a bug', 'Report a problem', '<form class="lhf"><label>What went wrong?<textarea rows="3" id="lhbug"></textarea></label><button class="btn btn-ghost" type="button" id="lhbugb">Send report</button><p id="lhbugr" class="note" aria-live="polite"></p></form>'))

# ---------- Starter kit ----------
write('starter-kit.html', 'Starter kit', 'A welcome kit to read once before you begin.', 'members', 'Starter kit',
 'Read this once. It takes five minutes.',
 sec('sk1', 'welcome', 'Welcome', '<ol><li>Open your learning home and save it on your phone.</li><li>Sign in with your registered email or phone.</li><li>Confirm your email and your WhatsApp number so reminders reach you.</li>'
  '<li>Allow notifications in the members app when it is live.</li><li>See the live sessions page for your first date.</li><li>Do the pre-read before each session; do the post-read after.</li></ol>'
  '<p>Three promises we ask of every learner: attend your sessions, finish your assignments by the deadline, and put into practice what you learn.</p>' +
  cards([('Your first steps', 'The six-box map for day one.', 'welcome-map.html', 'Open'), ('Live sessions', 'Dates, batches and recordings.', 'live-sessions.html', 'Open'), ('Help', 'Ask in one tap.', 'help.html', 'Open')], 'ok')))


# ---------- Start here: many ways in ----------
START = [
 ('Start learning', 'Pick a course and open lesson one.', 'start-a-course.html', 'Start learning'),
 ('Start training', 'Short practical training with a facilitator and a task to finish.', 'training.html', 'Start training'),
 ('Start authoring', 'Turn what you know into a short module others can finish.', 'author-a-module.html', 'Start authoring'),
 ('Start earning', 'Offer your skills, find work and get paid.', 'earning.html', 'Start earning'),
 ('Visit the PHYGITAL marketplace', 'Learning, services and products where online meets in person.', 'marketplace.html', 'Visit the marketplace'),
 ('Visit the PHYGITAL workplace', 'Teams, tasks and tools in one place.', 'workplace.html', 'Visit the workplace'),
 ('Start LEAP', 'Build a capsule: one clear lesson, made step by step.', 'leap.html', 'Start LEAP'),
 ('Start LAB', 'Train the trainers: check, approve and publish capsules.', 'lab.html', 'Start LAB'),
 ('Start PAVER', 'Five pathways: professional, academic, vocational, entrepreneurial, recreational.', 'paver.html', 'Start PAVER'),
 ('Start COLLATE', 'Gather notes, boards and storyboards into one shelf.', 'collate.html', 'Start COLLATE')]
write('start.html', 'Start here', 'Many ways in: learning, training, authoring, earning, the marketplace and workplace, LEAP, LAB, PAVER and COLLATE.', 'start', 'Start here',
 'Choose how you want to begin. You can do more than one.', sec('st1', 'ten ways in', 'Where would you like to start?', cards(START, 'ok')))

def stepage(fn, title, kick, lead, what, steps, nxt, ph_label):
    body = sec('a1', kick, 'What it is', '<p>' + e(what) + '</p>' + ph(ph_label)) + \
      sec('a2', 'how it goes', 'Four steps', '<ol>' + ''.join(f'<li>{e(s)}</li>' for s in steps) + '</ol>') + \
      sec('a3', 'next', 'Go on', cards(nxt, 'ok') + '<p><a class="btn btn-ghost" href="start.html">Back to Start here</a></p>')
    write(fn, title, lead, 'start', title, lead, body)
stepage('training.html', 'Start training', 'training', 'Short practical training with a task to finish and a check at the end.',
 'Training here is doing, with help. A facilitator shows it, you do it, and a short check proves it.',
 ['Pick a training unit.', 'Read the pre-read.', 'Join the live session and do the task.', 'Pass the short check and earn your certificate.'],
 [('Live sessions', 'Dates and recordings.', 'live-sessions.html', 'Open'), ('Certificate hub', 'Your certificates.', 'certificate-hub.html', 'Open')], 'training session photo')
stepage('earning.html', 'Start earning', 'earning', 'Offer your skills, find work and get paid.',
 'Earning is the fourth step after authoring, training and learning: put what you can do in front of people who need it.',
 ['Finish a project and put it in your showcase.', 'Build your career profile.', 'Apply for an open role or offer a service.', 'Agree the scope in writing and get paid through the site.'],
 [('Career portal', 'Open roles and applications.', 'career-portal.html', 'Open'), ('Project library', 'Finish a project first.', 'projects.html', 'Open'), ('PHYGITAL marketplace', 'Offer a service.', 'marketplace.html', 'Visit')], 'earning story card')
stepage('leap.html', 'Start LEAP', 'leap', 'Build a capsule: one clear lesson, made step by step.',
 'LEAP is where you author. A capsule is one short lesson with a goal, a task, practice and a check.',
 ['Name the need in one sentence.', 'Write the goal, the task and the standard.', 'Add practice and a short check.', 'Send the capsule to LAB for approval.'],
 [('Write a module', 'The authoring guide.', 'author-a-module.html', 'Open'), ('Start LAB', 'Get it checked.', 'lab.html', 'Start LAB')], 'capsule builder screen')
stepage('lab.html', 'Start LAB', 'lab', 'Train the trainers: check, approve and publish capsules.',
 'LAB is where capsules are checked, improved by a trainer, approved and published. A separate approver signs off, never the author.',
 ['Receive a capsule from LEAP.', 'Run the seven-line check.', 'Give feedback; the author fixes it.', 'Approve and publish.'],
 [('Start LEAP', 'Build a capsule.', 'leap.html', 'Start LEAP'), ('Learning hub', 'Back to the hub.', 'learning-hub.html', 'Open')], 'review checklist screen')
stepage('paver.html', 'Start PAVER', 'paver', 'Five pathways: professional, academic, vocational, entrepreneurial, recreational.',
 'PAVER groups learning and careers into five pathways so you can see where a course leads.',
 ['Choose a pathway: professional, academic, vocational, entrepreneurial or recreational.', 'See the courses and credits on it.', 'Join the first course.', 'Move along the ladder as you earn certificates.'],
 [('Career pathways', 'See all pathways.', 'career-pathways.html', 'Open'), ('Pathways', 'Learning and careers together.', 'pathways.html', 'Open'), ('Courses', 'All courses.', 'courses-all.html', 'Open')], 'five pathways map')
stepage('collate.html', 'Start COLLATE', 'collate', 'Gather notes, boards and storyboards into one shelf.',
 'COLLATE keeps everything on one topic together: your notes, a creative board and a storyboard, so you stop searching and start learning.',
 ['Pick a topic.', 'Collect notes, links and examples.', 'Arrange them on a board and a storyboard.', 'Share the shelf with your group.'],
 [('Segment shelves', 'Shelves by segment.', 'collate-shelves.html', 'Open'), ('Start LEAP', 'Turn a shelf into a capsule.', 'leap.html', 'Start LEAP')], 'creative board')
