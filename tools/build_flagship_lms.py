#!/usr/bin/env python3
"""Flagship 2: Learning Platform Administration. Built from the owner's 'top 29 LMS features' article, rewritten in our own words, vendor-neutral."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from ladder_common import ladder_sec
from flagship_data_misc_ladder import LADDER
e = html.escape
M = [
 ("Choosing the right kind of platform", "Analyse", 3,
  "Before features, decide which KIND of learning platform you need. Five choices shape everything else.",
  ["Size: a small organisation values fast set-up and ease; an enterprise (for example a few hundred staff or more, possibly customers and partners too) needs automation, segmenting of users and links to other systems.",
   "Open source or paid: open source has no licence fee, but you must install, host, secure and upgrade it, which can cost more than a subscription. Count the staff time.",
   "Cloud or installed: cloud is the norm; installed is chosen only when a law or network rule requires it.",
   "Integrated or standalone: can it exchange data with HR, CRM, payment and meeting tools?",
   "Course builder or not: some platforms only play ready-made packages; most also let you build courses from slides, documents, video and audio."],
  "A 40-person training company: cloud, paid, quick set-up, builder included, payment link. A 5,000-person manufacturer: cloud, automation, HR link, groups by plant and role, single sign-in.",
  "Write a one-page needs brief for a real organisation: size, five choices, three must-haves, three nice-to-haves.",
  "Name a decision on all five choices in the brief with one reason each, and make the must-haves testable."),
 ("Building and packaging courses", "Create", 4,
  "Covers course management and learning-package standards.",
  ["Course management: drag, drop and order content; mix PDFs, slides, video, audio and live sessions.",
   "Package standards: SCORM and xAPI are the common formats that let a course made in one tool run on another platform and report results. Test an upload before you promise a date.",
   "Learning paths: sequenced (one after another) when order matters; learner choice (finish any 3 of 5) when it does not.",
   "Blended learning: pair online study with a live session; schedule it inside the platform so records stay in one place."],
  "Path for new sales staff: Product basics (must finish first), then choose 2 of 4 skills modules, then a live role-play session, then a short exam.",
  "Build a three-step learning path in a practice platform with one uploaded package, one live session and one exam.",
  "Run the path end to end, have a test learner complete it, and show the completion record in the report."),
 ("Organising people: portals, groups, roles", "Apply", 4,
  "Covers learning portals, roles and permissions, and groups.",
  ["Portals: a top-level portal controls several sub-portals, one per audience (staff, customers, partners). Copy a course between portals instead of rebuilding.",
   "Roles: give each person only the rights they need: view, edit, create, delete. Mirror your real structure: director, manager, trainer, learner.",
   "Groups: collect people by team, role or place. Use filter rules so people move in and out automatically, for example 'joined in the last 30 days' feeds the onboarding group.",
   "Report by group so each manager sees only their own people."],
  "New-hire rule: if joined date is within 30 days, add to Onboarding group and assign the three starter courses. After 30 days, remove from Onboarding.",
  "Design the portal, role and group map for a real organisation on one page; write three group filter rules.",
  "Give every audience a portal or group, give no role more rights than its tasks need, and make the rules testable."),
 ("Automating the work", "Apply", 4,
  "Covers integrations, automation, dynamic rules and notifications.",
  ["Integrations: link HR, CRM, meeting tools and payment. Single sign-in lets people use one login. An open data interface lets other systems add users and pull results.",
   "Automation: add and remove users from the HR list, enrol by role, send due-date reminders.",
   "Dynamic rules are 'if this, then that': if onboarding is complete then award the certificate and enrol in the next course.",
   "Notifications: personal, timely, not endless. Use the person's name, one clear action and one date."],
  "Rule: IF course 'Safety basics' is complete THEN issue certificate AND enrol in 'Site safety practical' AND send message to line manager.",
  "Write five automation rules for your brief, each with trigger, action and a test case.",
  "Give each rule a trigger, an action and a way to check it fired, and ensure no rule can send more than one message a day to a person."),
 ("Assessing, certifying and reporting", "Evaluate", 4,
  "Covers exams, surveys, reporting, skills and certificate tracking, and selling courses.",
  ["Exams: several question types; auto-marking gives fast feedback. Match the question verb to the course outcome verb.",
   "Surveys inside a course show what to fix. Ask one question per idea.",
   "Reports: progress, results, survey answers; schedule and export them. Look for patterns (for example, written lessons pass better than video).",
   "Certificates: auto-issue on completion; set expiry dates and automatic re-enrolment for renewals; keep records audit-ready.",
   "Selling: a built-in store or payment link, bundles of courses, plans for groups, member discounts."],
  "Pattern found in a sample report (example values): video lessons pass at 62%, written lessons at 81%. Action: add a written summary to each video lesson and compare next month.",
  "Choose three measures for your brief (for example completion rate, first-attempt pass rate, time to certificate) and sketch the report that shows them.",
  "Define each measure, set a target, and state an action to take if it is missed."),
 ("Experience, security and reliability", "Evaluate", 4,
  "Covers learner experience, branding, language, mobile, security, reliability and migration.",
  ["Learner experience: easy to find, works on any device, offers extra optional courses so learners steer their own learning. Social tools (forums, sharing) keep people engaged.",
   "Branding: your colours and logo; white-labelling also removes the supplier's marks and sets your own web address.",
   "Languages and mobile: the interface in learners' own languages, and a design that works on phones and weak connections.",
   "Security: ask about independent security audits, data-protection law compliance, staff training and encryption. Keep personal data to what you need.",
   "Reliability: ask for the uptime record and maintenance windows; plan what happens when the platform is down.",
   "Migration: moving platforms is like moving house; list what must move (users, records, courses), test with a sample first."],
  "Checklist question: 'Show us your last independent security audit and how you handle a data-protection request from a learner.' A good answer is specific, dated and documented.",
  "Complete a 15-line due-diligence checklist for a platform you could choose and score it.",
  "Give each line evidence, a score and a reason, and name two risks with a mitigation."),
]
M[5:5] = [
 ("Engagement, community and gamification", "Apply", 3,
  "People finish courses when the experience is social, clear and rewarding. Learn simple engagement tools and how to check they help.",
  ["Points, badges and progress bars show effort; keep rules public and fair.",
   "Forums, groups and shared projects make learners talk to each other; assign a moderator and house rules.",
   "Leaderboards can discourage some people; make them optional and show personal progress too.",
   "Measure the effect: compare completion before and after a change, with the same kind of learners."],
  "Illustration with example values: a 30-learner onboarding group has 18 completions in a month (60 per cent). After a progress bar and a weekly group message the next group has 24 of 30 (80 per cent). The change is noted, and the team repeats it with a third group before calling it proven.",
  "Choose two engagement tools for your brief, write the rule for each and a way to measure whether it works.",
  "Give each tool a fair public rule, a measure and a stop condition, and base the claim of benefit on a comparison."),
 ("Pilot, roll-out and review", "Create", 4,
  "Test with a small group first, then roll out in steps, then review with data.",
  ["Pilot with a small group of real learners and one friendly manager.",
   "Write success measures before the pilot: completion, first-attempt pass, learner score, support requests.",
   "Roll out in steps by group; keep a rollback plan and a support rota.",
   "Review at 30 and 90 days and update the brief."],
  "Example values: a pilot with 30 learners reaches 27 completions: 27 / 30 = 90 per cent against a target of 85 per cent. Three support requests were all about login, so a one-page login guide is added before roll-out.",
  "Write a one-page pilot and roll-out plan for your brief with measures, dates and a rollback step.",
  "Plan has at least three measures with targets, three dates and a rollback step."),
]
RUBRIC = [('Needs brief', 'Platform choice not reasoned', 'Decision and reason on all five choices; testable must-haves', 'Also costs staff time and compares two platforms'), ('Learning path', 'Path does not run', 'Path runs end to end and a test learner completes it', 'Also includes a live session and a retake rule'), ('People and automation', 'Rights too wide or rules untestable', 'Roles least-rights; five rules each with trigger, action and test', 'Also limits messages to one a day per person'), ('Reports and measures', 'Measures undefined', 'Three measures with definition, target and action', 'Also shows a report with a pattern and a fix'), ('Due-diligence checklist', 'Lines without evidence', 'Every line has evidence, score and reason; two risks have a mitigation', 'Also plans a migration test with a sample')]

QUIZ = [("Give two costs of an open source platform that a licence fee hides.", "Hosting, installing, securing, upgrading and staff time."),
 ("When would you pick a sequenced path and when learner choice?", "Sequenced when order matters; learner choice when order does not."),
 ("What does SCORM or xAPI let you do?", "Move a course between tools and report results to the platform."),
 ("Why give each role only the rights it needs?", "Less risk and less clutter for each person."),
 ("Write a dynamic rule for onboarding.", "IF onboarding course complete THEN issue certificate AND enrol in the next course."),
 ("Name two single-sign-in benefits.", "Fewer password resets for IT; one verified login for learners."),
 ("What should a notification contain?", "Person's name, one action, one date."),
 ("How do you make a certificate renew?", "Set an expiry date and automatic re-enrolment with a reminder."),
 ("Name three questions for a security review.", "Latest independent audit; data-protection compliance; how requests and breaches are handled."),
 ("Why test a small sample before migrating?", "To find missing users, records or course errors before the full move.")]
def build():
    mods = ''
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(M, 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(QUIZ))
    total = sum(m[2] for m in M)
    outs = [('Analyse', 'Compare platform types and decide what an organisation needs.'), ('Create', 'Build a learning path with a package, a live session and an exam.'), ('Apply', 'Set up portals, roles, groups and automation rules.'), ('Evaluate', 'Judge reports, security and reliability, and recommend a platform.')]
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">{total} h lessons plus practice</span><span class="pill">Mentor review available</span></div>'
        '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Write a needs brief, build a sample learning path, design the people and automation set-up, and score one platform against a checklist.</p></div>'
        '<div><h4>Condition</h4><p>A practice platform (free trial or open demo), a real or sample organisation, a mentor review. About 5 weeks part-time.</p></div>'
        '<div><h4>Standard</h4><p>All 29 features in the map below are covered by a decision or a reason; a test learner completes your path; your scoring has evidence for every line.</p></div></div>'
        '<p><strong>Who it is for:</strong> training managers, HR staff, school and college administrators, trainers who run an online academy. <strong>Requirements:</strong> none. <strong>Source:</strong> built from our own list of platform features, written in our own words; no supplier is named.</p>')
    feat = ['Course management', 'Package standards (SCORM, xAPI)', 'Learning portals', 'Branding', 'White-labelling', 'Integrations', 'Automation', 'Learner experience', 'Exams', 'Surveys', 'Webinar link', 'Blended learning', 'Gamification', 'Roles and permissions', 'Groups', 'Social learning', 'Reporting', 'Skills and certificate tracking', 'Selling courses', 'Learning paths', 'Data migration', 'Dynamic rules', 'Notifications', 'Multilingual interface', 'Security', 'Reliability', 'Responsive design', 'Mobile and remote ready', 'Single sign-on']
    fmap = B.sec('alt', 'fm', 'feature map', 'The 29 features, and where you learn each', '<ol class="ws-chips">' + ''.join(f'<li>{e(f)}</li>' for f in feat) + '</ol>')
    body = (about + fmap + B.sec('', 'md', 'lesson by lesson', f'{len(M)} modules with worked examples', mods)
            + B.sec('alt', 'as', 'assessment', 'How you are checked', '<p>Evidence: needs brief, learning path, people and automation map, scored checklist. A mentor and one peer mark it with this rubric. Pass: no criterion at Not yet.</p>' + '<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(m)}</td><td>{e(d)}</td></tr>' for a, b, m, d in RUBRIC) + '</tbody></table></div>' + '<h3 class="ws-h3">Ten-question check, with model answers</h3>' + quiz)
            + ladder_sec(LADDER['platform'], '')
            + B.sec('alt', 'jb', 'jobs this leads to', 'Where this takes you', '<ul><li>Learning platform administrator</li><li>Training operations coordinator</li><li>Instructional technologist</li><li>E-learning project lead</li><li>Independent consultant for small academies</li></ul>')
            + B.sec('', 'lc', 'ten locations and global', 'Your place', '<p>Choose a platform that can store learner data in a place your law allows.</p>' + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Personal data law to check: {e(L["data"])}. Credit and level frame: {e(L["frame"])}.</p></details>' for L in B.LOC))
            + B.sec('alt', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording. Not live.</p>'))
    B.page('learn-flagship-platform-admin.html', 'Learning Platform Administration (flagship course)', 'Choose, build and run a learning platform: 29 features, eight modules.', 'Learning Platform Administration', e('Choose, build and run a learning platform: from course packages to security, with all 29 key features covered.'), body, B.crumb(('Courses', 'courses-hub.html'), ('Learning technology', None)), kicker='flagship course')
build()
