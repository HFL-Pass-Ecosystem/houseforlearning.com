#!/usr/bin/env python3
"""Flagship course: Resume and Professional Profile (career launch). Own wording; ideas from the owner's module slides only."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from ladder_common import ladder_sec
from flagship_data_misc_ladder import LADDER
e = html.escape

LESSONS = [
 ("1", "Why achievements beat duties", "Understand", 2,
  "Recruiters often skim a CV quickly (a rule of thumb, not a fixed time). They are asking one question: what will this person do for us? A list of duties answers a different question (what was your job title's paperwork?). An achievement answers it.",
  ["Duty: 'Responsible for customer complaints.' Achievement: 'Cut complaint response time from 5 days to 2 days across a 12-person team, and kept the rate at 2 days for 9 months.'",
   "A strong achievement line has four parts: an ACTION VERB (what you did), the SCALE (how many, how big), the RESULT (a number, before and after) and the TIME (how long, or by when).",
   "No number yet? Estimate honestly and say so ('about 30 families a week'). Never invent. Ask a colleague or check old records."],
  "Three versions of one line (all numbers are example values). Weak: 'Helped with school careers advice.' Better: 'Coached 500 students in careers skills.' Strong: 'Coached 500+ students and ran two classes of 25, so that 90% of final-year students were ready to apply for jobs by graduation.' Notice how each version adds scale, then a result.",
  "Take your last three jobs or projects. For each, write the duty line, then rewrite it as an achievement line with action verb, scale, result and time. Keep all nine lines in My page.",
  "Each rewritten line has all four parts; at least 6 of 9 carry a number; none claims something you cannot show."),
 ("2", "Finding your achievement stories", "Apply", 3,
  "Most people cannot think of achievements when asked. Use the SMART story frame: Situation, Mission, Action, Result, Takeaway. It turns a memory into evidence you can use on a CV, on a profile and in an interview.",
  ["Situation: where were you, what was wrong or needed? One sentence.",
   "Mission: what were you asked, or what did you decide, to do? One sentence.",
   "Action: the 2 or 3 things YOU did (not 'we'). Start each with a verb.",
   "Result: the number, the praise, the change. Then Takeaway: what you learned or would repeat.",
   "Aim for 3 to 4 stories per role, and pick stories that match the job you want next."],
  "Situation: the shop's online orders were arriving with wrong addresses. Mission: reduce failed deliveries. Action: checked 200 orders, found 3 causes, changed the form to a drop-down list and added a confirm step. Result: failed deliveries fell from 14% to 4% in two months. Takeaway: fix the form before blaming the courier.",
  "Write three SMART stories for your three strongest skills. Read one aloud in 90 seconds to a partner in your peer circle and ask which part they would repeat back.",
  "Each story has all five parts, uses 'I' for actions, has one measurable result, and takes under 90 seconds to tell."),
 ("3", "Myths about CVs, busted", "Analyse", 2,
  "Four common beliefs waste your time. Test each one against what employers and recruiters actually do.",
  ["Myth: a CV is simply good or bad. Reality: a CV is good or bad FOR A TARGET job. The same page can win one role and lose another.",
   "Myth: always start with an objective statement. Reality: a two-line summary of what you offer (not what you want) is more useful. Delete 'seeking a challenging position'.",
   "Myth: a long list of responsibilities impresses. Reality: lists blur together; three or four achievement lines per role stand out.",
   "Myth: the CV is the most important job-search tool. Reality: people, referrals and a clear public profile often open the door first; the CV confirms."],
  "Before: 'Objective: to obtain a position where I can use my skills.' After: 'Operations assistant with 3 years in retail logistics; cut stock errors by 35% and trained 6 new staff.' Same person, now useful to the reader.",
  "Audit your current CV against the four myths. Mark each line as duty, achievement, or filler. Cross out filler. Count your achievement lines.",
  "Audit table complete; filler removed; at least one achievement line per role."),
 ("4", "Choosing a target and benchmarking", "Analyse", 3,
  "You cannot tailor a CV without a target. Benchmark means comparing yourself to what real roles ask for, then closing the gap honestly.",
  ["Collect 5 real job adverts for the role you want. Highlight every skill or duty that appears in 3 or more.",
   "Build a gap table: skill asked | evidence I have | evidence I need | action and date.",
   "Look at 5 public profiles of people already in that role (public information only; do not contact anyone in a pushy way). Note their path: first job, second job, courses.",
   "Choose keywords from the adverts and use them truthfully in your summary, skills and achievement lines."],
  "Target: junior data analyst. Advert keywords seen 4 or more times: spreadsheet, dashboard, SQL, stakeholder reporting. Evidence you have: monthly spreadsheet report for a shop (3 months). Evidence needed: one SQL exercise. Action: complete a free SQL practice set by Friday.",
  "Complete a gap table for your target role with at least 6 rows and a date on every action.",
  "Five adverts cited; six rows; each 'have' row points to a real piece of evidence in My page."),
 ("5", "Writing the CV", "Create", 4,
  "One page for under 5 years of experience; two pages at most after that. Plain layout so that both people and software can read it.",
  ["Order: name and contact, two-line summary, key skills (6 to 8, matched to the advert), experience (newest first, achievement lines), education and courses, optional extras.",
   "Each role: job title, organisation, dates, then 3 to 4 achievement lines. Start every line with a different action verb: led, built, reduced, designed, trained, negotiated, analysed.",
   "Use one simple font, no photos or tables unless your region expects a photo, and save a copy as a plain document and as a PDF.",
   "Do not list personal details your region does not need (check local custom): ID numbers, bank details, full home address."],
  "A finished entry: 'Sales coordinator, small trading company, 2022-2025. Raised repeat orders by 22% by building a simple follow-up call list for 120 customers. Cut quote preparation from 2 days to 4 hours using a shared template. Trained 3 new colleagues.'",
  "Write your target CV. Ask two peers to read it for 30 seconds each and tell you what they remember.",
  "Fits the page limit; every role has 3 to 4 achievement lines; no spelling errors; peers remember at least one number."),
 ("6", "Your public professional profile", "Apply", 3,
  "A public professional profile is your CV that people can find, in your own words, and it can show your work. Use it to be found, to be trusted and to start conversations.",
  ["Headline: what you do and for whom, short enough to read at a glance (about 120 characters is a common limit; check your platform). Not just a job title.",
   "About section: first 2 lines matter most; state what you do, one proof with a number, and what you are looking for.",
   "Experience: reuse your achievement lines. Skills: pick the ones in your target adverts. Add a clear, friendly photo where local custom allows.",
   "Show expertise: write about three topics you know well (a short post, a tip, a lesson learned). Give before you take: comment helpfully, thank people, share others' good work.",
   "Privacy and safety: never post personal ID, never share an employer's confidential material, check who can see what."],
  "Headline weak: 'Student'. Headline strong: 'Final-year electrical student | solar installation and site safety | seeking a trainee technician role'. About, first lines: 'I help small buildings use less electricity. Last year I audited 12 shops and found savings of about 15% in each.'",
  "Rewrite your headline and About section; choose 3 expert topics; write one short post and ask two people for feedback. Keep drafts in My page.",
  "Headline is short and names a role and a focus; About has one number; 3 topics listed; one post drafted."),
 ("7", "Building connections the fair way", "Apply", 2,
  "Networking works when it is generous and specific. A good message is short, personal, and asks for something small.",
  ["Give first: share a useful article, congratulate a promotion, answer a question.",
   "Message pattern: who you are in one line, why this person, one small ask (a 15-minute call, one piece of advice). Make it easy to say no.",
   "Follow up with thanks and tell them what you did with the advice. Keep a simple tracker: name, date, what they said, next step.",
   "Respect: no mass messages, no pressure, no asking strangers for a job."],
  "Weak: 'Hi, please give me a job.' Strong: 'Hello, I am finishing a diploma in electrical installation and read your post on testing solar strings. Could I ask two questions about how you started? I know your time is limited, so a short reply is fine.'",
  "Write three messages to three different people (a classmate, a trainer, a professional in your target role). Send none until you have had peer feedback.",
  "Each message is under 80 words, has one specific ask, and passes a peer 'would I reply?' check."),
 ("8", "Interviews and keeping the proof", "Create", 3,
  "Your SMART stories become your interview answers. Prepare five stories that can answer most questions: a result, a problem solved, a team moment, a mistake and what you learned, and a time you learned something fast.",
  ["Study the organisation: what it does, who it serves, one recent thing you can honestly respect.",
   "Prepare two questions to ask them. Practise out loud, with a timer, with a peer.",
   "After every interview or conversation: write down what went well, what you would change and one thing to follow up. Send a short thank-you note within a day.",
   "Keep a living file in My page: CV versions, stories, gap table, tracker. Update it every 3 months."],
  "Question: 'Tell me about a mistake.' Answer in SMART: Situation (a late shipment), Mission (fix it for the customer), Action (called the customer, found a faster route, made a checklist), Result (delivered 1 day late, customer stayed, checklist used by team), Takeaway (confirm dates in writing).",
  "Do a 10-minute mock interview with a peer using your five stories. Record yourself if you can. Score yourself on the rubric and write two improvements.",
  "Five stories ready; mock interview done; rubric scored; two improvements dated."),
]
QUIZ = [
 ("Name the four parts of a strong achievement line.", "Action verb, scale, result (number, before and after) and time."),
 ("Rewrite: 'Responsible for training new staff.' Add scale and result.", "Example: 'Trained 6 new staff in 4 weeks; all 6 passed the 30-day check.' Any version with scale and result is correct."),
 ("What does SMART stand for in this course?", "Situation, Mission, Action, Result, Takeaway (the story frame)."),
 ("Why is 'seeking a challenging position' a weak summary?", "It says what you want, not what you offer; the reader gains nothing."),
 ("How many achievement lines should each role have, and why?", "Three to four: enough to prove skill, few enough to be read."),
 ("Give two ways to find keywords for your CV.", "Highlight words used in 3 or more real adverts; look at public profiles of people in the role."),
 ("What should the first two lines of your About section contain?", "What you do and for whom, plus one proof with a number."),
 ("Name two things never to post on a public profile.", "Personal ID or bank details; an employer's confidential information."),
 ("What makes a networking message easy to answer?", "Short, personal, one small specific ask, easy to decline."),
 ("What do you do within one day after an interview?", "Send a short thank-you and write down what went well and what to change."),
]
RUBRIC = [("Achievement lines", "Duties only", "Some numbers", "All lines have action, scale, result, time"),
          ("Targeting", "No target", "Target named", "Target, gap table and matched keywords"),
          ("Honesty and evidence", "Claims without proof", "Some proof kept", "Every claim linked to a real record"),
          ("Clarity", "Hard to read", "Readable", "30-second read leaves one memorable number"),
          ("Public profile", "None or unsafe", "Complete", "Complete, safe, with three expert topics and a post")]
JOBS = [("Career-launch advisor, school or college", "Coaches students to write CVs and profiles"), ("Recruitment coordinator", "Screens CVs against advert keywords"),
        ("Training or HR assistant", "Runs workshops on job-search skills"), ("Freelance CV and profile writer", "Offers paid writing and review"),
        ("Any role you target next", "Wins interviews with evidence, not duties")]

def build():
    total = sum(l[3] for l in LESSONS)
    mods = ''
    for n, t, bl, h, intro, pts, ex, act, std in LESSONS:
        mods += (f'<details class="mod" {"open" if n=="1" else ""}><summary><span class="mn">Module {n}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary>'
                 f'<p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div>'
                 f'<p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(QUIZ))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in RUBRIC) + '</tbody></table></div>')
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in JOBS) + '</ul>'
    outcomes = [('Understand', 'Explain why achievements beat duties on a CV.'), ('Apply', 'Write three SMART stories and nine achievement lines.'), ('Analyse', 'Audit a CV against four myths and a gap table for a target role.'),
                ('Create', 'Produce a target CV, a public profile and five interview stories.'), ('Evaluate', 'Score your own mock interview against a rubric and plan two improvements.')]
    top = (f'<div class="cb-facts"><span class="pill lv">L3 Foundation</span><span class="pill">{total} h of lessons plus 30 h practice and sharing</span>'
           '<span class="pill">Self-paced with peer circle</span><span class="pill">Mentor review available</span></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outcomes) + '</ul>'
        + '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Produce a target CV, a public professional profile and five interview stories for one real target role.</p></div>'
        '<div><h4>Condition</h4><p>Own computer or phone, five real job adverts, two peers for feedback, a mentor for the final review. About 6 weeks part-time.</p></div>'
        '<div><h4>Standard</h4><p>Every claim is true and backed by a record; every role has 3 to 4 achievement lines with numbers; two peers rate the CV and the profile \'Meets\' or better on the rubric below.</p></div></div>'
        '<p><strong>Who it is for:</strong> school and college leavers, graduates, career changers, returners and seniors. <strong>Requirements:</strong> none. <strong>Materials:</strong> lesson text, worked examples, templates, rubric, quiz, tracker.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Your evidence: CV, profile, gap table, five stories, mock interview record. Two peers and one mentor mark it with this rubric. Pass: no criterion at \'Not yet\'.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + ladder_sec(LADDER['cv'], 'alt')
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', jobs + '<p>Next courses: communication and presentation, digital marketing, a sector course for your target role.</p>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Local custom changes what a CV contains (photo, age, ID details, length). Check it for your place first.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Write salary or numbers in {L["cur"]}. Personal data rule for what you publish: {e(L["data"])}. Skills frame to name on your CV: {e(L["frame"])}.</p></details>' for L in B.LOC))
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Written in our own words from our own module outline; no third-party text is used. Not live.</p><p><a class="btn" href="b2c.html">More courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    B.page('learn-flagship-cv.html', 'Resume and Professional Profile (flagship course)', 'Write a CV that proves achievements, build a safe public profile and prepare interview stories.', 'Resume and Professional Profile',
           e('Build a CV and public profile that prove what you achieved, and five stories you can tell in any interview.'), body,
           B.crumb(('Courses', 'courses-hub.html'), ('Career launch', None)), kicker='flagship course')
build()
