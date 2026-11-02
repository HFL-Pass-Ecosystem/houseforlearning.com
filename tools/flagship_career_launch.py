#!/usr/bin/env python3
"""Flagship: Career Launch (9 modules). Own wording; no person, company or school names; no revenue figures."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from ladder_common import ladder_sec
from flagship_data_misc_ladder import LADDER
import build_flagship_cv as CV   # reuses its content for module 4 (page already written by that import; harmless)
e = html.escape

M = [
 ("Start with intent", "Understand", 4,
  "A job search that starts with a plan beats one that starts with a job board. The order is simple: know yourself, choose targets, shape your story, then meet people. Steadiness matters as much as skill.",
  ["Write the goal in one sentence with a date: 'By 31 March I will start a role as a ___ in ___.' A goal you can test is a goal you can work toward.",
   "Split the search into four weekly blocks: thinking (self and targets), making (CV, stories), meeting (conversations), and practising (interviews). Put each block in your calendar.",
   "Many roles are often filled through conversations before they are advertised, so plan for conversations, not only applications.",
   "Build habits that survive a bad week: a fixed start time, a daily minimum (for example 2 conversations or 3 applications), a short end-of-day note of what moved.",
   "Choose one honest measure of progress per week: number of useful conversations held."],
  "Weak plan: 'Apply to lots of jobs.' Strong plan: 'Goal: junior operations role in logistics by 31 March. Weekly: 6 hours thinking and making, 5 conversations, 2 practice interviews. Daily minimum: 2 messages sent.'",
  "Write your one-sentence goal, your weekly four-block calendar, and your daily minimum. Share them with a peer who checks them each Friday.",
  "Goal has a date and a role; calendar has all four blocks with times; daily minimum is small enough to do on your worst day."),
 ("Know what drives you", "Analyse", 3,
  "Choices feel random until you name what matters to you. Your answers become the filter for every role you look at.",
  ["Rank what matters at work: learning, income, freedom, impact, security, status, balance. Force a ranking: only two can be first.",
   "Find strengths with two questions: where do you lose track of time, and where do others come to you for help? Ask three people who know you and compare with your own list.",
   "Decide the size of your next move: a small step (same field, next level), a bigger jump (new field, same skills) or a complete change. Each needs different evidence and a different timeline.",
   "Turn the answers into a one-page filter: top 3 motivators, top 3 strengths, move size, and three deal-breakers."],
  "Example filter: motivators learning, balance, impact; strengths explaining, organising, calm under pressure; move size: bigger jump into training coordination; deal-breaker: a commute of more than 10 hours a week.",
  "Complete the one-page filter. Test it on two real job adverts: does each pass or fail, and why?",
  "Ranking has no ties; strengths are backed by one example each; both adverts are judged against the filter in writing."),
 ("Aim, do not scatter", "Apply", 3,
  "A short, well-chosen list of targets beats a long, vague one. One page per target keeps you focused.",
  ["Pick 8 to 12 target organisations or roles that pass your filter. If you cannot say why one fits, remove it.",
   "Target page: why it fits (two lines), what they need (from adverts and their public information), who you know, who you need to meet, next step with a date.",
   "Review weekly: move names between columns (cold, warm, in conversation, interviewing, closed).",
   "Count conversations as well as applications; conversations lead to openings."],
  "Target page: 'Regional training provider. Fit: growing, needs coordinators, matches my organising strength. I know: one former classmate works there. Need to meet: the training manager. Next step: message classmate by Friday.'",
  "Build 8 target pages and a one-screen board with the five columns.",
  "Every target has a fit reason and a dated next step; board is updated twice in the week."),
 ("Prove it with stories", "Create", 4,
  "Employers hire results, not duties. Grow each story in three passes, keep your CV to results, and make your public profile match.",
  ["Three passes per story: what you did; what improved (number, before and after); what a leader would call outstanding (scale and lasting effect).",
   "Use the story frame: Situation, Mission, Action, Result, Takeaway. Use 'I' for what you did.",
   "CV: one page up to five years of experience. Three to four achievement lines per role, each with an action verb, scale, result and time. Plain layout.",
   "Public profile: headline with role and focus; first two lines of the About section with one number; three expert topics; consistent with your CV; no confidential information or personal ID."],
  "Pass one: 'Helped with school careers advice.' Pass two: 'Coached 500 students.' Pass three: 'Coached 500+ students and ran two classes of 25 so that most final-year students were ready to apply by graduation.'",
  "Write three stories through all three passes; write a one-page CV; rewrite your profile headline and first two lines. See the full flagship 'Resume and Professional Profile' for the detailed method.",
  "All stories have a number; CV is one page; two peers can repeat one number from your CV after a quick read."),
 ("Meet people before openings", "Apply", 4,
  "Hunt for conversations, not only adverts. Four routes work together: advertised roles, recruiters, your network and direct approaches.",
  ["Advertised roles: as a rule of thumb, apply where you meet most of the requirements (many people use about two thirds), and tailor your summary to the advert's key words.",
   "Recruiters: send a short note with your target, your evidence and your dates; keep it professional; never pay a fee to be placed.",
   "Network: start with people you already know. A short information conversation asks for advice, never for a job.",
   "Direct approaches: a short message to a person in a target organisation, with one specific question.",
   "Keep a weekly tracker: name, date, route, what was said, next step. Effort that is not recorded disappears."],
  "Message: 'Hello, I am moving from retail into training coordination and read your note on onboarding. May I ask two questions about how your team started? Ten minutes of your time would be a real help; a reply by message is fine.'",
  "Send five messages across at least three routes. Keep the tracker for one week. Write a one-page review: what worked, what to change.",
  "Each message under 80 words with one small ask; tracker complete; review names one change."),
 ("Interview with confidence", "Create", 5,
  "Interviewers predict future behaviour from past examples. Prepare six stories and tell each in five beats.",
  ["Six stories: leadership, conflict, failure, change, teamwork, initiative.",
   "Five beats: context, challenge, action, result, lesson. About two minutes each; say 'I', give a number, and end on the lesson.",
   "Practise out loud with a timer. Record yourself and listen for filler words and missing results.",
   "Prepare two questions about the role and the team. Research the organisation: what it does, who it serves, one recent development you can honestly respect.",
   "Plan the logistics: route, time, documents, a calm start."],
  "Failure story in five beats: Context (a late delivery to a key client). Challenge (fix it within two days). Action (I called the client, rebuilt the schedule, added a check). Result (arrived one day late, client stayed, check now used by the team). Lesson (confirm dates in writing).",
  "Write six stories in five beats. Do a 20-minute mock interview with a peer using a rubric. Score and note two improvements.",
  "Each story takes about two minutes or less; mock interview done; two improvements dated."),
 ("Turn interviews into offers", "Evaluate", 3,
  "Follow up well and know when you have talked to enough people. Keep several serious conversations running so no single result decides your future.",
  ["Send a thank-you within the same day; add one new idea or a useful detail you forgot to mention.",
   "Ask what happens next and when you will hear back; put the date in your tracker.",
   "As a rule of thumb, aim for about seven serious conversations at once, give or take two. Fewer than that makes every result feel life-or-death; more spreads you too thin.",
   "Review honestly every week: conversations held, interviews, second interviews, offers. Let the numbers guide where to spend effort.",
   "Handle silence: one polite follow-up after the stated date, then move on."],
  "Follow-up note: 'Thank you for the time today. After our talk, I thought of one more example: last quarter I cut quote time from two days to four hours. I would be glad to share the template.'",
  "Write three follow-up notes for three real or practice interviews. Build a pipeline table with stages and counts.",
  "Notes sent within a day; pipeline table has dates; one action is chosen from the numbers."),
 ("Negotiate the package", "Evaluate", 4,
  "A package is more than salary. Research a fair range, use more than one offer honestly and agree in writing.",
  ["List the whole package: base pay, bonus, benefits, growth, flexibility, notice period, working place, training budget.",
   "Research a fair range from several public sources for your place and level; write the range down before you talk numbers.",
   "Say what you want in one clear sentence with a reason; then stop talking and listen.",
   "More than one offer gives you a calm voice, but never invent offers; honesty protects your reputation.",
   "Get the final terms in writing, thank everyone, and decline politely with a reason and a door left open."],
  "Script: 'I am excited about the role. Based on my research for this level and place, I was expecting a range of X to Y. Is there flexibility toward the upper end given my track record in cutting costs?'",
  "Write a package comparison for two real or practice offers. Write the exact sentence you would say, and role-play it twice with a peer.",
  "All package parts compared; range sourced; sentence is clear and honest."),
 ("Keep your momentum", "Create", 3,
  "Land well, keep learning and carry your method into every future move.",
  ["The first 90 days set your reputation: listen first, learn how work really gets done, and deliver one early win.",
   "Write a 30-60-90 day plan with a goal, a measure and a person to check in with for each stage.",
   "Keep your target map, stories and network alive even when you are happy; update once a quarter.",
   "Review your motivators each year; careers change as you do.",
   "Help the next person: share what worked; generosity returns."],
  "30-60-90: Day 30: learn the process and meet every teammate. Day 60: fix one small recurring problem. Day 90: present results and a next-step plan to your manager.",
  "Write your 30-60-90 plan and a yearly review date. Mentor one peer for 20 minutes.",
  "Plan has three dated goals with measures; review date is in the calendar; one peer is helped."),
]
QUIZ = [("Why plan before you browse job boards?", "A plan gives order and focus; many roles often fill through conversations before they are advertised."),
 ("Name the four weekly blocks.", "Thinking, making, meeting, practising."),
 ("What goes on your one-page filter?", "Top three motivators, top three strengths, move size and three deal-breakers."),
 ("What goes on a target page?", "Why it fits, what they need, who you know, who to meet, next step with a date."),
 ("Name the three passes of an achievement story.", "What you did; what improved; what a leader would call outstanding."),
 ("Name the four search routes.", "Advertised roles, recruiters, network, direct approaches."),
 ("What are the five beats of an interview story?", "Context, challenge, action, result, lesson."),
 ("About how many serious conversations should you run at once?", "About seven, give or take two."),
 ("Name four parts of a package beyond salary.", "Bonus, benefits, growth, flexibility, notice period (any four)."),
 ("What are the three goals in a 30-60-90 plan?", "Learn and meet people; fix one small problem; present results and a next step.")]
RUBRIC = [("Plan and focus", "No date or targets", "Goal and targets", "Goal, board, weekly review all in use"),
          ("Evidence", "Duties only", "Some numbers", "All stories have numbers and records"),
          ("Conversations", "Few or none", "Weekly tracker", "Tracker plus follow-ups and pipeline"),
          ("Interview", "Unstructured", "Five beats", "Five beats, timed, with lesson"),
          ("Package", "Salary only", "Whole package", "Sourced range, honest, in writing")]
JOBS = ["Career coach or advisor", "Recruitment coordinator", "HR or training assistant", "Student employability officer", "Freelance CV and interview coach", "Any role you target next"]

def build():
    mods = ''
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(M, 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} hours ({h*60} minutes)</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(QUIZ))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in RUBRIC) + '</tbody></table></div>')
    total = sum(m[2] for m in M)
    outs = [('Understand', 'Explain a plan-first job search and set a dated goal.'), ('Analyse', 'Name your motivators and strengths and turn them into a filter.'), ('Apply', 'Build a target board and run four search routes with a tracker.'),
            ('Create', 'Write achievement stories, a CV, a profile and six interview stories.'), ('Evaluate', 'Compare packages and negotiate honestly.'), ('Create', 'Plan your first 90 days and keep your method alive.')]
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">9 modules · about {total} hours ({total*60:,} minutes) of study and practice</span></div>'
        '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Run a complete job search from plan to accepted offer, keeping a record of every step.</p></div>'
        '<div><h4>Condition</h4><p>About 8 weeks part-time. Own phone or computer, real adverts, two peers, a mentor for the final review.</p></div>'
        '<div><h4>Standard</h4><p>Every module standard is met; all claims are true and backed by records; two peers and a mentor mark the evidence \'Meets\' or better.</p></div></div>'
        '<p><strong>Who it is for:</strong> students, graduates, career changers, returners, seniors. <strong>Requirements:</strong> none. <strong>Materials:</strong> lesson text, templates, tracker, rubric, check with answers.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '9 modules with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: goal and calendar, filter, target board, stories, CV and profile, tracker, mock interview record, package comparison, 90-day plan. Mentor and peers mark it with this rubric. Pass: no criterion at \'Not yet\'.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + ladder_sec(LADDER['career'], 'alt')
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li>{e(j)}</li>' for j in JOBS) + '</ul>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Local custom changes CV content, salary talk and notice periods. Check them for your place.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Currency: {L["cur"]}. Data rule for what you publish: {e(L["data"])}. Skills frame to cite: {e(L["frame"])}.</p></details>' for L in B.LOC))
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording from the programme outline; no third-party text. Not live.</p>'))
    B.page('learn-flagship-career-launch.html', 'Career Launch (flagship course)', 'A nine-module job search method from plan to offer.', 'Career Launch', e('Nine modules take you from a plan to an accepted offer, with stories, conversations, interviews and negotiation.'), body, B.crumb(('Courses', 'courses-hub.html'), ('Career launch', None)), kicker='flagship course')
build()
