#!/usr/bin/env python3
"""Flagship 2: Learning Platform Administration. Built from the owner's 'top 29 LMS features' article, rewritten in our own words, vendor-neutral."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape
M = [
 ("Choosing the right kind of platform", "Analyse", 3,
  "Before features, decide which KIND of learning platform you need. Five choices shape everything else.",
  ["Size: a small organisation values fast set-up and ease; an enterprise (about 500 or more staff, possibly customers and partners too) needs automation, segmenting of users and links to other systems.",
   "Open source or paid: open source has no licence fee, but you must install, host, secure and upgrade it, which can cost more than a subscription. Count the staff time.",
   "Cloud or installed: cloud is the norm; installed is chosen only when a law or network rule requires it.",
   "Integrated or standalone: can it exchange data with HR, CRM, payment and meeting tools?",
   "Course builder or not: some platforms only play ready-made packages; most also let you build courses from slides, documents, video and audio."],
  "A 40-person training company: cloud, paid, quick set-up, builder included, payment link. A 5,000-person manufacturer: cloud, automation, HR link, groups by plant and role, single sign-in.",
  "Write a one-page needs brief for a real organisation: size, five choices, three must-haves, three nice-to-haves.",
  "Brief names a decision on all five choices with one reason each; must-haves are testable."),
 ("Building and packaging courses", "Create", 4,
  "Features 1 and 2 of the 29: course management and learning-package standards.",
  ["Course management: drag, drop and order content; mix PDFs, slides, video, audio and live sessions.",
   "Package standards: SCORM and xAPI are the common formats that let a course made in one tool run on another platform and report results. Test an upload before you promise a date.",
   "Learning paths: sequenced (one after another) when order matters; learner choice (finish any 3 of 5) when it does not.",
   "Blended learning: pair online study with a live session; schedule it inside the platform so records stay in one place."],
  "Path for new sales staff: Product basics (must finish first), then choose 2 of 4 skills modules, then a live role-play session, then a short exam.",
  "Build a three-step learning path in a practice platform with one uploaded package, one live session and one exam.",
  "Path runs end to end; a test learner completes it; the completion record appears in the report."),
 ("Organising people: portals, groups, roles", "Apply", 4,
  "Features 3, 12, 13 and 14: learning portals, roles and permissions, groups.",
  ["Portals: a top-level portal controls several sub-portals, one per audience (staff, customers, partners). Copy a course between portals instead of rebuilding.",
   "Roles: give each person only the rights they need: view, edit, create, delete. Mirror your real structure: director, manager, trainer, learner.",
   "Groups: collect people by team, role or place. Use filter rules so people move in and out automatically, for example 'joined in the last 30 days' feeds the onboarding group.",
   "Report by group so each manager sees only their own people."],
  "New-hire rule: if joined date is within 30 days, add to Onboarding group and assign the three starter courses. After 30 days, remove from Onboarding.",
  "Design the portal, role and group map for a real organisation on one page; write three group filter rules.",
  "Every audience has a portal or group; no role has more rights than its tasks need; rules are testable."),
 ("Automating the work", "Apply", 4,
  "Features 7, 8, 24 and 25: integrations, automation, dynamic rules, notifications.",
  ["Integrations: link HR, CRM, meeting tools and payment. Single sign-in lets people use one login. An open data interface lets other systems add users and pull results.",
   "Automation: add and remove users from the HR list, enrol by role, send due-date reminders.",
   "Dynamic rules are 'if this, then that': if onboarding is complete then award the certificate and enrol in the next course.",
   "Notifications: personal, timely, not endless. Use the person's name, one clear action and one date."],
  "Rule: IF course 'Safety basics' is complete THEN issue certificate AND enrol in 'Site safety practical' AND send message to line manager.",
  "Write five automation rules for your brief, each with trigger, action and a test case.",
  "Each rule has a trigger, an action and a way to check it fired; no rule can send more than one message a day to a person."),
 ("Assessing, certifying and reporting", "Evaluate", 4,
  "Features 10, 11, 20, 21 and 22: exams, surveys, reporting, skills and certificate tracking, selling courses.",
  ["Exams: several question types; auto-marking gives fast feedback. Match the question verb to the course outcome verb.",
   "Surveys inside a course show what to fix. Ask one question per idea.",
   "Reports: progress, results, survey answers; schedule and export them. Look for patterns (for example, written lessons pass better than video).",
   "Certificates: auto-issue on completion; set expiry dates and automatic re-enrolment for renewals; keep records audit-ready.",
   "Selling: a built-in store or payment link, bundles of courses, plans for groups, member discounts."],
  "Pattern found in a report: video lessons pass at 62%, written lessons at 81%. Action: add a written summary to each video lesson and compare next month.",
  "Choose three measures for your brief (for example completion rate, first-attempt pass rate, time to certificate) and sketch the report that shows them.",
  "Each measure has a definition, a target and an action to take if it is missed."),
 ("Experience, security and reliability", "Evaluate", 4,
  "Features 9, 15 to 19 and 26 to 29: learner experience, branding, language, mobile, security, uptime, migration.",
  ["Learner experience: easy to find, works on any device, offers extra optional courses so learners steer their own learning. Social tools (forums, sharing) keep people engaged.",
   "Branding: your colours and logo; white-labelling also removes the supplier's marks and sets your own web address.",
   "Languages and mobile: the interface in learners' own languages, and a design that works on phones and weak connections.",
   "Security: ask about independent security audits, data-protection law compliance, staff training and encryption. Keep personal data to what you need.",
   "Reliability: ask for the uptime record and maintenance windows; plan what happens when the platform is down.",
   "Migration: moving platforms is like moving house; list what must move (users, records, courses), test with a sample first."],
  "Checklist question: 'Show us your last independent security audit and how you handle a data-protection request from a learner.' A good answer is specific, dated and documented.",
  "Complete a 15-line due-diligence checklist for a platform you could choose and score it.",
  "Each line has evidence, a score and a reason; two risks are named with a mitigation."),
]
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
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">{total} h lessons plus practice</span><span class="pill pr">USD 39 per learner per month, or USD 79 with mentor review</span></div>'
        '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Write a needs brief, build a sample learning path, design the people and automation set-up, and score one platform against a checklist.</p></div>'
        '<div><h4>Condition</h4><p>A practice platform (free trial or open demo), a real or sample organisation, a mentor review. About 5 weeks part-time.</p></div>'
        '<div><h4>Standard</h4><p>All 29 features in the map below are covered by a decision or a reason; a test learner completes your path; your scoring has evidence for every line.</p></div></div>'
        '<p><strong>Who it is for:</strong> training managers, HR staff, school and college administrators, trainers who run an online academy. <strong>Requirements:</strong> none. <strong>Source:</strong> built from the owner\'s "top 29 platform features" article, rewritten in our own words; no supplier is named.</p>')
    feat = ['Course management', 'Package standards (SCORM, xAPI)', 'Learning portals', 'Branding', 'White-labelling', 'Integrations', 'Automation', 'Learner experience', 'Exams', 'Surveys', 'Webinar link', 'Blended learning', 'Gamification', 'Roles and permissions', 'Groups', 'Social learning', 'Reporting', 'Skills and certificate tracking', 'Selling courses', 'Learning paths', 'Data migration', 'Dynamic rules', 'Notifications', 'Multilingual interface', 'Security', 'Reliability', 'Responsive design', 'Mobile and remote ready', 'Single sign-on']
    fmap = B.sec('alt', 'fm', 'feature map', 'The 29 features, and where you learn each', '<ol class="ws-chips">' + ''.join(f'<li>{e(f)}</li>' for f in feat) + '</ol>')
    body = (about + fmap + B.sec('', 'md', 'lesson by lesson', '6 modules with worked examples', mods)
            + B.sec('alt', 'as', 'assessment', 'How you are checked', '<p>Evidence: needs brief, learning path, people and automation map, scored checklist. A mentor and one peer mark it. Pass: every standard met.</p><h3 class="ws-h3">Ten-question check, with model answers</h3>' + quiz)
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul><li>Learning platform administrator</li><li>Training operations coordinator</li><li>Instructional technologist</li><li>E-learning project lead</li><li>Independent consultant for small academies</li></ul>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Choose a platform that can store learner data in a place your law allows.</p>' + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Personal data law to check: {e(L["data"])}. Credit and level frame: {e(L["frame"])}.</p></details>' for L in B.LOC) + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording. Not live.</p>'))
    B.page('learn-flagship-platform-admin.html', 'Learning Platform Administration (flagship course)', 'Choose, build and run a learning platform: 29 features, six modules.', 'Learning Platform Administration', e('Choose, build and run a learning platform: from course packages to security, with all 29 key features covered.'), body, B.crumb(('Courses', 'courses-hub.html'), ('Learning technology', None)), kicker='flagship course')
build()
