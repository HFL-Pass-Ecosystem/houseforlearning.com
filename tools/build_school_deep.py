#!/usr/bin/env python3
"""Deep school courses (grades 1 to 12 and ESL), flagship standard (see learn-flagship-cv.html).
Step 1 writes one data file per course: data/school-deep/<slug>.json (modules, worked examples, rubric, 10 checks, L1-L7 notes).
Step 2 renders site/school-*.html from those files (overwrites the thin pages made by build_full_courses.py).
Run after build_full_courses.py:  python3 tools/build_school_deep.py
Own wording. No outside brand, school or teacher names. No fees. Draft: noindex; educator review needed before use."""
import sys, json, re, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape
OUT = B.Dt / 'school-deep'; OUT.mkdir(exist_ok=True)

SUBJ = {'ENG': ('English', 'lang'), 'ESL': ('English as a second language', 'lang'), 'ARA': ('Arabic', 'lang'), 'HIN': ('Hindi', 'lang'), 'FRE': ('French', 'lang'),
        'MAT': ('Mathematics', 'maths'), 'SCI': ('Science', 'sci'), 'PHY': ('Physics', 'sci'), 'CHE': ('Chemistry', 'sci'), 'BIO': ('Biology', 'sci'),
        'SST': ('Social science', 'soc'), 'HIS': ('History', 'soc'), 'GEO': ('Geography', 'soc'), 'POL': ('Political science', 'soc'), 'ECO': ('Economics', 'soc'), 'PSY': ('Psychology', 'soc'), 'PED': ('Physical education', 'soc'),
        'VAL': ('Values and life skills', 'val'), 'ISL': ('Islamic studies', 'val'), 'COM': ('Computing', 'comp'), 'CSC': ('Computer science', 'comp'),
        'ACC': ('Accountancy', 'biz'), 'BST': ('Business studies', 'biz')}
BLOOM = {'Remember': 'read recite name list say spell recall identify copy match label count repeat', 'Understand': 'describe explain classify tell retell summarise summarize interpret discuss outline give state',
         'Apply': 'use solve find calculate record apply measure draw write add subtract multiply divide convert perform follow carry show demonstrate prepare', 'Analyse': 'analyse analyze compare distinguish examine contrast investigate',
         'Evaluate': 'evaluate judge justify assess argue critique', 'Create': 'create design compose build make produce construct plan'}
V2B = {v: k for k, vs in BLOOM.items() for v in vs.split()}
def bloom(outcome): return V2B.get(outcome.split()[0].lower(), 'Apply')

def band_of(p):
    if p.startswith('esl'): return 'esl'
    n = int(re.match(r'\d+', p.replace('grade-', '')).group())
    return 'primary' if n <= 5 else 'secondary' if n <= 10 else 'post'
def level_of(p):
    if p.startswith('esl'): return 1
    n = int(re.match(r'\d+', p.replace('grade-', '')).group())
    return 1 if n <= 2 else 2 if n <= 5 else 3 if n <= 8 else 4 if n <= 10 else 5
BAND = {'esl': dict(w='short, spoken, with pictures and real objects', t='15 to 25 minutes', std='at least 4 of 5 attempts understood by a listener who does not know you', ev='a voice note or one page of work'),
        'primary': dict(w='short, playful, with objects, pictures and talk', t='20 to 30 minutes', std='at least 4 of 5 attempts correct, said or written, with one real example from home or school', ev='one page in your learning book'),
        'secondary': dict(w='with notes, a worked line and a self-mark', t='30 to 40 minutes', std='at least 8 of 10 marks on a short task, with one line of reasoning for each answer', ev='a worked task and a corrected copy'),
        'post': dict(w='with exam-style questions and written reasoning', t='40 to 50 minutes', std='at least 70 percent on an exam-style task, with the method shown', ev='a timed paper and an error log')}

# Subject-kind frames: four moves for every unit. {t}=unit title, {o}=outcome.
FR = {
 'lang': dict(steps=["Listen first: your teacher or a recording says the new words or sentences from '{t}' twice. You repeat them aloud.", "Notice the pattern: find where the new sound, word form or sentence rule appears in a short text and mark it.",
                     "Use it: {o}, first with help, then alone.", "Check and fix: read your work aloud once more; fix one thing you hear is wrong."],
              ex="Model run for '{t}'. Teacher text (3 lines about a daily activity). Step 1, read it aloud together. Step 2, mark every word or sentence that uses the new pattern. Step 3, a learner writes or says two new lines of their own that use the same pattern. Step 4, the learner reads them aloud and corrects one slip. What a good answer looks like: the pattern is used correctly in both lines, the lines make sense, and the learner can say which part is the pattern.",
              rub=[('Accuracy', 'Many slips', 'A few slips', 'Correct and self-corrected'), ('Understanding', 'Needs help to follow', 'Follows the main idea', 'Explains the idea to someone else'), ('Speaking or writing', 'Single words', 'Full sentences', 'Connected sentences with variety'),
                   ('Listening and reading', 'Misses key words', 'Gets the main point', 'Gets main point and detail'), ('Practice habit', 'Rarely practises', 'Practises weekly', 'Practises most days and keeps evidence')]),
 'maths': dict(steps=["Show it with objects or a picture: build or draw the idea in '{t}' before using symbols.", "Say the rule in your own words, then write one worked line, naming each step.",
                      "Use it: {o}. Start with one easy question, then one with a real-life story.", "Check it: use a second method, estimate, or work backwards to test your answer."],
               ex="Model run for '{t}'. Read the question and underline what is asked. Draw or write what is known. Choose the method named in the unit. Work it line by line, one idea per line, with units where they apply. Estimate first so the answer can be tested for sense. Check by working backwards. What a good answer looks like: correct method, every step visible, units stated, and a one-line check.",
               rub=[('Accuracy', 'Frequent errors', 'Mostly correct', 'Correct, checked'), ('Method shown', 'Answer only', 'Steps shown', 'Steps shown with reasons'), ('Problem solving', 'Needs the method told', 'Chooses the method', 'Chooses and explains why'),
                    ('Communication', 'Hard to follow', 'Clear working', 'Clear working with correct terms'), ('Practice habit', 'Rarely practises', 'Practises weekly', 'Practises most days with an error log')]),
 'sci': dict(steps=["Observe: see, touch, measure or watch a safe demonstration linked to '{t}' and write what you notice.", "Explain: use the key words of the unit to say what is happening and why, in a few lines.",
                    "Use it: {o}. Use a diagram, table or short calculation where it fits.", "Test and conclude: say what evidence supports your answer and what you would change."],
             ex="Model run for '{t}'. Question: what do we want to find out? Prediction: one sentence. Method: three safe steps with the equipment named. Record: a small table with units. Conclusion: one sentence that uses the evidence and the key words of the unit. What a good answer looks like: a fair test, measured values with units, and a conclusion that matches the table.",
             rub=[('Scientific ideas', 'Ideas mixed up', 'Main ideas right', 'Ideas right and linked'), ('Evidence and data', 'No record', 'Record made', 'Clear record used in the conclusion'), ('Safe, fair method', 'Needs reminding', 'Safe and mostly fair', 'Safe, fair and improved'),
                  ('Use of key words', 'Few', 'Some', 'Accurate and confident'), ('Practice habit', 'Rarely practises', 'Practises weekly', 'Practises most days and reflects')]),
 'soc': dict(steps=["Place it: find where and when '{t}' happens, on a map, a timeline or in a local example.", "Gather: read or listen to two short sources and note who is speaking and why.",
                    "Use it: {o}. Give a reason and one piece of evidence for every point.", "Weigh it: say what another person might think, and why, before you decide."],
             ex="Model run for '{t}'. Question: what happened, or what is the situation, and why? Sources: two short extracts, a map or table. Notes: who, what, where, when, why. Answer: three sentences, each with a reason and a piece of evidence. Check: is there a point of view that you have not considered? What a good answer looks like: facts are correct, reasons are linked to evidence, and one other point of view is named fairly.",
             rub=[('Knowledge', 'Gaps', 'Main facts right', 'Facts right and linked'), ('Use of evidence', 'No evidence', 'Some evidence', 'Evidence for every point'), ('Reasoning', 'Statements only', 'Reasons given', 'Reasons weighed against another view'),
                  ('Maps, dates and terms', 'Often wrong', 'Mostly right', 'Accurate and used well'), ('Practice habit', 'Rarely practises', 'Practises weekly', 'Practises most days and reflects')]),
 'val': dict(steps=["Listen and talk: hear a short story, text or example linked to '{t}' and say what it means in your own words.", "Connect: name one place in your own day where it applies.",
                    "Use it: {o}. Practise with care and respect, in class and at home.", "Reflect: what went well, what was hard, and one thing you will do next time."],
             ex="Model run for '{t}'. A short text or story is read aloud. Learners say the main lesson in one sentence. In pairs they find one moment in school or home where this lesson would help. Each learner plans one small action for the week and tells it to a partner. At the end of the week they report back. What a good answer looks like: the lesson is in the learner's own words, the example is real and local, and the action is small enough to do. Content follows the approved local syllabus and is checked by a qualified teacher.",
             rub=[('Understanding', 'Needs help', 'States the main idea', 'Explains with an example'), ('Practice in daily life', 'Not yet', 'Sometimes', 'Often, with a record'), ('Respect and care in discussion', 'Needs reminding', 'Mostly', 'Always and helps others'),
                  ('Own reflection', 'None', 'Short', 'Honest and specific'), ('Practice habit', 'Rarely', 'Weekly', 'Most days')]),
 'comp': dict(steps=["See it: watch or try the skill in '{t}' on a teacher screen or a safe device.", "Name the parts: write the key words and what each part does.",
                     "Use it: {o}. Save your work in a named file or folder.", "Test and fix: run it, find one fault, correct it, and note what you changed."],
              ex="Model run for '{t}'. Goal in one sentence. Plan: list the steps in order before touching the device. Do: follow the plan, saving after each step. Test: try normal input and one unusual input. Fix: change one thing and test again. Share: show a partner and explain it. What a good answer looks like: it works for normal input, steps match the plan, and the learner can explain each part. Online safety rules apply at all times.",
              rub=[('It works', 'Does not run', 'Runs with help', 'Runs and handles odd input'), ('Understanding of the parts', 'Cannot name', 'Names most', 'Names and explains'), ('Planning', 'None', 'A list', 'A clear ordered plan'),
                   ('Safety and care', 'Needs reminding', 'Follows rules', 'Follows rules and helps others'), ('Practice habit', 'Rarely', 'Weekly', 'Most days')]),
 'biz': dict(steps=["Read the idea in '{t}' and tie it to a small real business, such as a school shop or a family stall.", "Write the rule or format in your own words and keep one clean example.",
                    "Use it: {o}. Work from source papers or a short story of transactions.", "Check it: totals agree, each entry has a reason, and every figure can be traced."],
             ex="Model run for '{t}'. Story: a small shop starts the month with cash and stock and has a short list of transactions. Step 1, list each transaction and what it changes. Step 2, record it in the format of the unit. Step 3, total and check that both sides agree. Step 4, write one sentence about what the figures tell the owner. What a good answer looks like: every transaction is recorded in the right place, totals agree, and the sentence states a useful message. Use local money units and local rules.",
             rub=[('Accuracy', 'Frequent errors', 'Mostly correct', 'Correct, totals agree'), ('Layout and terms', 'Unclear', 'Correct layout', 'Correct layout and terms'), ('Reasoning', 'Entries only', 'Reasons for most', 'Reasons for every entry'),
                  ('Interpretation', 'None', 'States a figure', 'States what it means for the owner'), ('Practice habit', 'Rarely', 'Weekly', 'Most days with an error log')]),
}
LADDER = {
 'lang': ["L1: say and read familiar words and short sentences.", "L2: read short texts and write connected sentences.", "L3: write paragraphs and speak on a topic with notes.", "L4: write for different purposes and analyse how texts persuade.", "L5: write and argue at length; handle unseen texts.",
          "L6 (degree): academic reading, writing and citation.", "L7 (postgraduate): publish, teach or translate with expert accuracy."],
 'maths': ["L1: count, add and subtract small numbers; name shapes.", "L2: use the four operations, fractions and simple measures.", "L3: work with ratio, algebra beginnings and geometry reasoning.", "L4: algebra, geometry proof, trigonometry and statistics.", "L5: functions, calculus, vectors and probability.",
           "L6 (degree): proof, linear algebra and modelling.", "L7 (postgraduate): research mathematics, data science or teaching at depth."],
 'sci': ["L1: observe, sort and describe the living and non-living world.", "L2: run simple tests and explain with key words.", "L3: use models and equations; plan a fair test.", "L4: link physics, chemistry and biology ideas with calculation.", "L5: specialise; design, analyse and evaluate experiments.",
         "L6 (degree): laboratory science, instrumentation and analysis.", "L7 (postgraduate): research design and expert practice."],
 'soc': ["L1: talk about family, place and community.", "L2: read maps and timelines; describe local government and history.", "L3: compare societies; use sources.", "L4: analyse causes and consequences; argue from evidence.", "L5: specialise in history, geography, politics or economics; write extended answers.",
         "L6 (degree): research methods and applied social science.", "L7 (postgraduate): policy, research or teaching at depth."],
 'val': ["L1: kindness, honesty and sharing in daily life.", "L2: responsibility, courage and care for others and nature.", "L3: fairness, respect for difference and service.", "L4: ethical choices and citizenship.", "L5: leadership, wellbeing and ethical reasoning.",
         "L6 (degree): applied ethics, culture and community work.", "L7 (postgraduate): scholarship, counselling or teaching at depth."],
 'comp': ["L1: use a device safely; click, type and draw.", "L2: create documents; follow simple instructions in blocks.", "L3: spreadsheets, algorithms and simple programs.", "L4: programming, data and networks.", "L5: software design, databases and security.",
          "L6 (degree): software engineering and systems.", "L7 (postgraduate): research, architecture or AI practice."],
 'biz': ["L1: count money and understand need and want.", "L2: record simple income and spending.", "L3: understand shops, trade and profit.", "L4: record transactions and read simple accounts.", "L5: prepare statements and analyse a business.",
         "L6 (degree): management accounting, finance and enterprise.", "L7 (postgraduate): strategy, audit or entrepreneurship at depth."],
}

def modules(rows, kind, bd):
    f = FR[kind]; out = []
    for i, r in enumerate(rows):
        o = r['outcome'].split(' (grade')[0].strip(); t = r['unit']; b = bloom(o)
        out.append(dict(n=i + 1, title=t, bloom=b, weeks=[int(r['first_week']), int(r['last_week'])], hours=int(r['weeks']) * 3, outcome=o,
                        intro=f"In this unit you work on '{t}', taught in a way that is {bd['w']}. The target is clear: {o}. You move from seeing it, to saying it, to doing it alone.",
                        points=[s.format(t=t, o=o) for s in f['steps']], example=f['ex'].format(t=t, o=o),
                        activity=f"About {bd['t']} of class work, then one short practice task for home. Keep evidence: {bd['ev']}.",
                        standard=f"{o[:1].upper() + o[1:]}: {bd['std']}."))
    return out

def checks(subj, kind, mods, bd, plan_lbl):
    qs = []
    for m in mods[:6]:
        qs.append((f"Unit {m['n']} ({m['title']}): show that you can {m['outcome']}. What are the first and last step you used?",
                   f"Any correct example is fine. A good answer names the first step (see or say the idea) and the last step (check or reflect) from the model run, and meets the standard: {bd['std']}."))
    vs = {m['bloom'] for m in mods}
    qs.append((f"Which action verb starts the outcome of Unit 1 ({mods[0]['title']}), and at which Bloom level is it?", f"'{mods[0]['outcome'].split()[0]}', at the {mods[0]['bloom']} level."))
    qs.append(("When do the formative checks FA1 to FA4 and the summative checks SA1 and SA2 happen?", "FA1 to FA4 around weeks 6, 12, 24 and 30; SA1 in week 18; SA2 in week 36."))
    qs.append((f"In which weeks does Unit {mods[-1]['n']} ({mods[-1]['title']}) run?", f"Weeks {mods[-1]['weeks'][0]} to {mods[-1]['weeks'][1]}."))
    qs.append(("What evidence do you keep for each unit, and why?", f"{bd['ev'][:1].upper() + bd['ev'][1:]}. It shows what you can really do and lets a teacher check it against the standard."))
    return qs[:10]

def build_data(p, s, rs):
    name, kind = SUBJ[s]; bd = BAND[band_of(p)]; lvl = level_of(p)
    mods = modules(rs, kind, bd); lbl = B.plan_label(p)
    wk = sum(int(r['weeks']) for r in rs)
    d = dict(slug=B.school_slug(p, s), plan=p, subject=s, subject_name=name, kind=kind, label=lbl, band=band_of(p), level=lvl, weeks=wk,
             task=f"Meet the outcome of every unit in {lbl} {name}, and keep one piece of evidence for each.",
             condition=f"A 36-week school year, {len(rs)} units, a teacher or guide, a learning book or device, and local examples in the local language first with English support.",
             standard=f"Each unit: {bd['std']}. Course pass: no unit at 'Not yet' after one retry, and a pass in SA1 and SA2.",
             modules=mods, rubric=[list(x) for x in FR[kind]['rub']], checks=[list(x) for x in checks(s, kind, mods, bd, lbl)],
             ladder=LADDER[kind], jobs=[], blooms=sorted({m['bloom'] for m in mods}, key=list(BLOOM).index))
    return d

def render(d):
    mods = ''.join(f'<details class="mod" {"open" if m["n"] == 1 else ""}><summary><span class="mn">Unit {m["n"]}</span> {e(m["title"])} <span class="pill">Weeks {m["weeks"][0]} to {m["weeks"][1]}</span><span class="pill bz">{m["bloom"]}</span></summary>'
                   f'<p>{e(m["intro"])}</p><ul>' + ''.join(f'<li>{e(x)}</li>' for x in m['points']) + '</ul>'
                   f'<div class="evi"><strong>Worked example.</strong> {e(m["example"])}</div><p><strong>Activity.</strong> {e(m["activity"])}</p><p><strong>Standard to meet.</strong> {e(m["standard"])}</p></details>' for m in d['modules'])
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(x)}</td></tr>' for a, b, c, x in d['rubric']) + '</tbody></table></div>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i + 1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(d['checks']))
    names = ['L1 Foundation', 'L2', 'L3', 'L4', 'L5', 'L6 Degree', 'L7 Postgraduate']
    lad = ('<div class="scroll-x"><table class="ws-table"><caption>Levels L1 to L7 for ' + e(d['subject_name']) + '</caption><thead><tr><th>Level</th><th>What you can do</th><th>This course</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{names[i]}</th><td>{e(t.split(": ", 1)[1] if ": " in t else t)}</td><td>{"You are here" if i + 1 == d["level"] else ""}</td></tr>' for i, t in enumerate(d['ladder'])) + '</tbody></table></div>')
    verbs = ', '.join(d['blooms'])
    outcomes = '<ul class="blm">' + ''.join(f'<li><span class="bz">{m["bloom"]}</span> {e(m["outcome"][:1].upper() + m["outcome"][1:])}.</li>' for m in d['modules']) + '</ul>'
    b = B.BANDS[d['band']]
    top = (f'<div class="cb-facts"><span class="pill lv">L{d["level"]}</span><span class="pill">{e(b[0])}</span><span class="pill">{len(d["modules"])} units</span><span class="pill">{d["weeks"]} teaching weeks</span><span class="pill">36-week school year</span><span class="pill">Bloom levels: {e(verbs)}</span></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do', top + outcomes
        + f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(d["task"])}</p></div><div><h4>Condition</h4><p>{e(d["condition"])}</p></div><div><h4>Standard</h4><p>{e(d["standard"])}</p></div></div>'
        '<h3 class="ws-h3">Assessment plan</h3><p>Formative checks FA1 to FA4 around weeks 6, 12, 24 and 30; summative checks SA1 in week 18 and SA2 in week 36.</p>')
    body = (about + B.sec('alt', 'un', 'unit by unit', f'{len(d["modules"])} units with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence for each unit is marked with this rubric by a teacher, and by a peer where the unit allows. Pass: no criterion at \'Not yet\' after one retry.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + B.sec('alt', 'ld', 'levels L1 to L7', 'Where this course sits on the ladder', lad + '<p>Notes: a level is reached when you can meet its standard, not by age. Learners may move up or down a level by subject.</p>')
            + B.sec('', 'lc', 'ten locations and global', 'Localised for your place', '<p>Teach in the local language first, with English support. Use local currency, units and examples in every worksheet. Local curriculum and ministry rules are checked before use in a school; Arabic, Islamic, Social and Moral content needs licensed educators and ministry review. Child-safety rules apply for every learner under 18.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Use {L["cur"]} in money problems; deliver in {e(L["lang"])}; personal data rule: {e(L["data"])}; guardian contact for every learner under 18.</p></details>' for L in B.LOC))
            + B.sec('alt', 'nx', 'next', 'Draft', '<p class="ws-note">Draft course in our own words. Needs review by a qualified teacher before classroom use. Not live.</p>'
                    f'<p><a class="btn" href="{B.BANDS[d["band"]][2]}">More {e(b[0])} courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    B.page(d['slug'], f'{d["label"]} {d["subject_name"]}', f'{d["label"]} {d["subject_name"]}: {len(d["modules"])} units with worked examples, rubric, ten checks and levels L1 to L7', f'{d["label"]}: {d["subject_name"]}',
           e(f'{len(d["modules"])} units across the school year. Each has a worked example, an activity and a standard to meet.'), body,
           B.crumb(('Learners', 'learners.html'), (b[0], b[2]), (f'{d["label"]} {d["subject_name"]}', None)), kicker='school course')

def main():
    n = 0
    for (p, s), rs in B.plans.items():
        d = build_data(p, s, rs)
        (OUT / (d['slug'][:-5] + '.json')).write_text(json.dumps(d, indent=1, ensure_ascii=False))
        render(d); n += 1
    print('school deep courses', n)
if __name__ == '__main__': main()
