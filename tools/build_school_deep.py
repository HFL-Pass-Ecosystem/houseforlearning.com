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


# Solved examples keyed on unit title words (checked by hand). Other units keep the method frame only.
WE = [
 (r'adding within 20|addition to 100|^addition', "47 + 28. Tens: 40 + 20 = 60. Ones: 7 + 8 = 15. Add: 60 + 15 = 75. Check by taking away: 75 - 28 = 47."),
 (r'subtraction|taking away', "83 - 47. Count up: 47 to 50 is 3, 50 to 80 is 30, 80 to 83 is 3. Total 3 + 30 + 3 = 36. Check: 36 + 47 = 83."),
 (r'multiplication', "6 bags with 4 apples in each. Repeated adding: 4 + 4 + 4 + 4 + 4 + 4 = 24. As multiplication: 6 x 4 = 24. Check by turning it round: 4 x 6 = 24."),
 (r'^division|sharing and grouping', "36 sweets shared equally among 4 children: 36 / 4 = 9 each. Check: 4 x 9 = 36."),
 (r'place value|large numbers|knowing our numbers|numbers to 10 lakh|whole numbers', "5,38,246 has 5 lakh, 38 thousand, 2 hundreds, 4 tens and 6 ones. The 8 stands for 8,000. Rounded to the nearest thousand it is 5,38,000."),
 (r'^fractions$|fractions and decimals|fractions: halves', "3/4 + 1/6. Common denominator 12. 9/12 + 2/12 = 11/12. Half of 12 is 6 and a quarter of 12 is 3."),
 (r'decimals', "3.6 + 2.45. Line up the decimal points: 3.60 + 2.45 = 6.05. Check by estimate: 4 + 2 is about 6."),
 (r'percentages|comparing quantities|ratio and proportion|direct and inverse', "20% of 350 = 350 x 20 / 100 = 70. Share 40 sweets in the ratio 3 : 5: 8 parts, each part is 5, so 15 and 25. If 5 pens cost 40, one costs 8 and 12 cost 96."),
 (r'factors|hcf', "HCF and LCM of 12 and 18. 12 = 2 x 2 x 3 and 18 = 2 x 3 x 3. HCF = 2 x 3 = 6. LCM = 2 x 2 x 3 x 3 = 36. Check: 6 x 36 = 216 = 12 x 18."),
 (r'circles and constructions|areas related to circles', "A circle with radius 7 cm, using 22/7 for pi. Area = 22/7 x 7 x 7 = 154 square cm. Circumference = 2 x 22/7 x 7 = 44 cm."),
 (r'perimeter|area|mensuration|measurement and perimeter|surface', "Rectangle 12 cm by 5 cm. Perimeter = 2 x (12 + 5) = 34 cm. Area = 12 x 5 = 60 square cm. A cuboid 12 x 5 x 3 has volume 180 cubic cm."),
 (r'lines and angles|angles and shapes', "Two angles on a straight line add to 180 degrees. If one is 65 degrees the other is 180 - 65 = 115 degrees."),
 (r'triangle', "Angles of a triangle add to 180 degrees. If two angles are 50 and 60, the third is 180 - 110 = 70 degrees."),
 (r'pair of linear', "x + y = 10 and x - y = 2. Add the equations: 2x = 12, so x = 6, then y = 4. Check: 6 + 4 = 10 and 6 - 4 = 2."),
 (r'simple equations|linear equations in one|algebra beginnings|algebra introduction', "3x + 5 = 20. Take 5 from both sides: 3x = 15. Divide by 3: x = 5. Check: 3 x 5 + 5 = 20."),
 (r'quadratic', "x squared - 5x + 6 = 0 factorises as (x - 2)(x - 3) = 0, so x = 2 or x = 3. Check x = 2: 4 - 10 + 6 = 0."),
 (r'polynomials|factorisation|identities|algebraic expressions', "x squared - 9 = (x - 3)(x + 3). Check by expanding: x squared + 3x - 3x - 9 = x squared - 9."),
 (r'statistics|data and averages|data handling|index numbers', "Data 4, 7, 7, 9, 13. Mean = 40 / 5 = 8. Median (middle value) = 7. Mode (most common) = 7."),
 (r'probability', "A fair die has 6 faces and 3 are even, so P(even) = 3/6 = 1/2."),
 (r'^time', "A train leaves at 9:45 and the journey takes 2 hours 30 minutes. 9:45 + 2:00 = 11:45, then + 30 minutes = 12:15."),
 (r'money', "3 books at 45 each: 3 x 45 = 135. Paid 200, so change = 200 - 135 = 65."),
 (r'length|mass|capacity', "2 m 35 cm = 200 + 35 = 235 cm. 1.5 kg = 1.5 x 1000 = 1500 g."),
 (r'squares, square roots|exponents|real numbers|number systems|rational', "Square root of 196: 14 x 14 = 196, so the root is 14. 2 cubed x 2 to the 4 = 2 to the 7 = 128. 0.75 = 3/4 is rational; the square root of 2 is not."),
 (r'trigonometr', "Right triangle, opposite side 3, hypotenuse 5, adjacent side 4. sin = 3/5 = 0.6, cos = 4/5 = 0.8, tan = 3/4 = 0.75."),
 (r'coordinate|straight lines', "Points (1, 2) and (4, 6). Distance = square root of (3 squared + 4 squared) = square root of 25 = 5. Slope = (6 - 2) / (4 - 1) = 4/3."),
 (r'differentiation|derivatives|limits', "d/dx of (3x squared + 5x) = 6x + 5; at x = 2 the gradient is 17. Limit as x goes to 2 of (x squared - 4)/(x - 2) = limit of (x + 2) = 4."),
 (r'integral', "The integral of (6x + 5) dx = 3x squared + 5x + C. Check by differentiating: 6x + 5."),
 (r'progression|sequences', "2, 5, 8, ... has a = 2 and d = 3. The 10th term = 2 + 9 x 3 = 29. The sum of 10 terms = 10/2 x (2 + 29) = 155."),
 (r'sets', "A = {1, 2, 3} and B = {2, 3, 4}. Union = {1, 2, 3, 4}. Intersection = {2, 3}."),
 (r'matrices', "[1 2; 3 4] + [0 1; 1 0] = [1 3; 4 4]. The determinant of [1 2; 3 4] = 1 x 4 - 2 x 3 = -2."),
 (r'permutations', "Arrange 5 books in 3 places: 5 x 4 x 3 = 60 ways. Choose 3 of 5: 60 / 6 = 10 ways."),
 (r'integers', "-7 + 12 = 5. (-3) x (-4) = 12. -5 - (-2) = -3."),
 (r'patterns', "3, 7, 11, 15: add 4 each time, so next is 19. The nth term is 4n - 1; check n = 4: 15."),
 (r'symmetry|solid shapes|shapes around', "A rectangle has 2 lines of symmetry; a square has 4; a cube has 6 faces, 12 edges and 8 vertices."),
 (r'vectors', "a = (2, 3) and b = (1, -1). a + b = (3, 2). Twice a = (4, 6)."),
 (r'binomial', "(1 + x) to the 4 = 1 + 4x + 6x squared + 4x cubed + x to the 4. The coefficients are row 4 of Pascal's triangle."),
 (r'inequalities', "2x - 3 < 7. Add 3: 2x < 10. Divide by 2: x < 5. Check x = 4: 5 < 7, true."),
 (r'complex', "(2 + 3i)(1 - i) = 2 - 2i + 3i - 3i squared = 2 + i + 3 = 5 + i, because i squared = -1."),
 (r'induction', "Show 1 + 2 + ... + n = n(n + 1)/2. n = 1: 1 = 1. Assume it holds for k. Add k + 1: k(k + 1)/2 + (k + 1) = (k + 1)(k + 2)/2, which is the rule for k + 1. So it holds for all n."),
 (r'euclid', "Axiom: things equal to the same thing are equal to each other. So if AB = CD and CD = EF then AB = EF."),
 (r'congruence', "SAS: two triangles each with sides 5 cm and 7 cm and a 60 degree angle between them are congruent."),
 (r'relations, functions|functions', "f(x) = 2x + 1. f(3) = 7. For input 0, 1, 2 the outputs are 1, 3, 5, so each input has exactly one output."),
 (r'motion', "Speed = distance / time. A bus covers 120 km in 2 hours: 120 / 2 = 60 km/h. Starting at 0 and reaching 20 m/s in 5 s means acceleration = 20 / 5 = 4 m/s squared."),
 (r'force', "Force = mass x acceleration. A 5 kg trolley accelerating at 2 m/s squared needs F = 5 x 2 = 10 N."),
 (r'work and energy|gravitation', "Work = force x distance. 20 N over 3 m = 60 J. Kinetic energy of 2 kg at 3 m/s = 1/2 x 2 x 9 = 9 J."),
 (r'sound', "Echo: sound at 340 m/s returns after 2 s, so it travelled 680 m there and back, and the wall is 340 m away."),
 (r'electric|current', "V = I x R. A 6 V cell across a 2 ohm resistor gives I = 6 / 2 = 3 A."),
 (r'matter|solution|mixture', "10 g of salt in 90 g of water: solution mass 100 g, so concentration = 10 / 100 x 100 = 10 percent by mass."),
 (r'atoms|molecules|chemical', "Water is H2O: 2 hydrogen atoms and 1 oxygen atom. Mass = 2 x 1 + 16 = 18 units. Check atoms balance on both sides of an equation."),
 (r'cell|tissue', "Plant cells have a cell wall and chloroplasts; animal cells do not. A tissue is a group of similar cells doing one job, for example muscle tissue for movement."),
 (r'light|reflection', "Law of reflection: the angle of incidence equals the angle of reflection. A ray hitting a mirror at 30 degrees to the normal leaves at 30 degrees."),
 (r'acids|salts', "A solution that turns blue litmus red is an acid. Acid + base gives salt + water, for example hydrochloric acid + sodium hydroxide gives sodium chloride + water."),
 (r'photosynthesis|plants', "Carbon dioxide + water, in light and with chlorophyll, gives glucose + oxygen. Test: a leaf kept in the dark makes no starch."),
 (r'phonics|spelling', "Sound out each part: s-t-ay stays; r-ai-n rain; b-oa-t boat. Vowel pairs ai, ay, oa, ee make one sound. Write three more words that share one pair."),
 (r'nouns', "In 'Mira has a dog called Bruno', 'dog' is a common noun, 'Mira' and 'Bruno' are proper nouns and need capital letters."),
 (r'punctuation', "'what is your name' becomes 'What is your name?' - capital letter at the start and a question mark at the end. 'I have a pen a book and a bag' needs commas: 'I have a pen, a book and a bag.'"),
]

# Second bank: keyed on (subjects, title pattern). Checked by hand. Religious and ministry-set content keeps the method frame only.
WE2 = [
 (('ESL',), r'hello and me', "A: Hello, I am Sara. What is your name? B: Hello Sara, I am Omar. A: How old are you? B: I am eight. Spell it: O-M-A-R."),
 (('ESL',), r'numbers, colours', "Count aloud: one, two, three, up to twenty. 'I have three red circles and two blue squares.' Point and count: 3 + 2 = 5 shapes."),
 (('ESL',), r'family and my home', "'This is my mother. She is in the kitchen. My brother is in the bedroom.' Rooms: kitchen, bedroom, bathroom, living room."),
 (('ESL',), r'school things', "Teacher: 'Open your book. Take out a pencil. Please sit down.' Learner does each action and can ask: 'Can you repeat, please?'"),
 (('ESL',), r'food and drink', "'I like apples. I do not like fish. Can I have some water, please?' Order: 'A sandwich and a juice, please.'"),
 (('ESL',), r'daily routines', "'I wake up at 6:30. I eat breakfast at 7:00. I go to school at 7:30.' Ask a partner: 'What time do you wake up?'"),
 (('ESL',), r'past events', "'Yesterday I visited my aunt. We played a game and ate lunch.' Regular past: play, played; visit, visited. Irregular: go, went; eat, ate."),
 (('ENG',), r'reading simple words|writing letters', "Blend c-a-t = cat, d-o-g = dog, s-u-n = sun. A name starts with a capital letter: Sara."),
 (('ENG',), r'simple sentences|picture composition', "Picture of a boy with a kite. 'A boy has a kite. The kite is red. The wind is strong. He is happy.' Four connected sentences, each ending in a full stop."),
 (('ENG',), r'naming words', "In 'The cat sat on the mat', cat and mat are naming words (nouns)."),
 (('ENG',), r'action words|verbs', "'The girl runs.' Add describing words: 'The tall girl runs fast.' Tense: walk, walked, will walk."),
 (('ENG',), r'rhymes|poems', "cat, hat and mat rhyme. Make a couplet: 'The sun is high, a bird can fly.' High and fly rhyme."),
 (('ENG',), r'reading short passages|reading stories', "Passage: 'Ravi has a red kite. He flies it on the hill.' Who? Ravi. What? A red kite. Where? On the hill."),
 (('ENG',), r'subject and predicate', "'The tall boy | kicked the ball.' Subject: the tall boy. Predicate: kicked the ball."),
 (('ENG',), r'speaking and listening', "Retell in order with first, next, then, last. Ask: 'What happened next?' Reply politely: 'Thank you, I agree because...'"),
 (('FRE',), r'greetings and introductions', "Bonjour, je m'appelle Lea. Et toi? Je m'appelle Omar. Enchante. Comment ca va? Ca va bien, merci."),
 (('FRE',), r'verbs to have and to be', "etre: je suis, tu es, il est. avoir: j'ai, tu as, il a. 'Je suis grand. J'ai un chat.'"),
 (('FRE',), r'numbers and colours', "un, deux, trois, quatre, cinq. rouge, bleu, vert. 'J'ai trois stylos bleus.'"),
 (('ARA',), r'greetings', "Marhaba (hello). Ismi Sara (my name is Sara). Ma ismuk? (what is your name?) Shukran (thank you)."),
 (('HIN',), r'matras', "Short and long vowel signs change the sound: ka, kaa, ki, kee. Read: kamal, kaam, kitaab."),
 (('HIN',), r'family and home', "Maa (mother), pitaji (father), bhai (brother), behan (sister). 'Yeh mera ghar hai.' (This is my home.)"),
 (('SCI',), r'my body and my senses', "Five senses: sight (eyes), hearing (ears), smell (nose), taste (tongue), touch (skin). A lemon: you see yellow, smell sharp, taste sour, feel a bumpy skin."),
 (('SCI',), r'animals and their homes|^animals$', "A bird lives in a nest, a bee in a hive, a fish in water. Sort animals by where they live: land, water, air."),
 (('SCI',), r'water and the water cycle|^water$', "Heat makes water evaporate, it cools and condenses into clouds, then falls as rain, then flows back to rivers and sea. Boiling a kettle and watching steam on a cold lid shows this."),
 (('SCI',), r'weather|air and weather|seasons', "Record 5 days: Mon sunny 32 C, Tue cloudy 29 C, Wed rain 27 C, Thu sunny 33 C, Fri sunny 34 C. Most common: sunny (3 days). Hottest: Friday."),
 (('SCI',), r'materials', "Test: does it float? A wooden spoon floats, a metal spoon sinks. Is it see-through? Glass yes, wood no. Choose a raincoat material: waterproof, light, bendy."),
 (('SCI',), r'food and healthy|keeping healthy|food and digestion', "A healthy plate has a half of fruit and vegetables, a quarter of grains, a quarter of protein. Wash hands before eating for 20 seconds. Digestion: mouth, food pipe, stomach, small intestine, large intestine."),
 (('SCI',), r'plant life', "Plants need light, water, air and warmth. Test: two seedlings, one in light and one in a dark cupboard, same water. After a week the dark one is pale and weak."),
 (('SST',), r'family and my school|home and neighbourhood', "Draw a map of the route from home to school with 3 landmarks. Tell it: 'First pass the shop, then the park, then the school gate.'"),
 (('SST',), r'maps and directions', "North is at the top. If the school is east of the park, go right (east) from the park. Scale 1 cm = 100 m: 4 cm on the map is 400 m."),
 (('SST',), r'needs and wants', "Needs: food, water, shelter, clothes. Wants: a toy, a game. With 100 coins: spend 70 on needs and 30 on wants, and save any extra."),
 (('SST',), r'communities and helpers', "A doctor heals, a teacher teaches, a farmer grows food, a police officer keeps us safe. Match each helper to a need in the community."),
 (('COM',), r'parts of a computer', "Input: keyboard, mouse. Output: screen, printer. Processing: CPU. Storage: hard drive. Press a key (input), the screen shows a letter (output)."),
 (('COM',), r'mouse and keyboard|typing', "Home row: A S D F for the left hand, J K L ; for the right. Type 'sad lad' ten times without looking. Aim for no errors, then raise speed."),
 (('COM',), r'online safety|staying safe', "Never share your password, address or school name. If a stranger messages you: do not reply, close it, tell a trusted adult. Strong password: three random words plus a number."),
 (('COM',), r'algorithms|giving clear instructions|loops', "Algorithm to make toast: 1 take two slices, 2 put in toaster, 3 press down, 4 wait, 5 take out. Loop: repeat 4 times: step forward, turn right = draw a square."),
 (('COM',), r'coding with blocks', "Blocks: when green flag clicked, repeat 10: move 10 steps, turn 36 degrees. The sprite draws a ten-sided shape (36 x 10 = 360)."),
 (('COM',), r'spreadsheets', "Cells A1 = 12, A2 = 18, A3 = 20. In A4 type =SUM(A1:A3) to get 50. =AVERAGE(A1:A3) gives 16.67. Change A1 and the totals update."),
 (('VAL',), r'kindness|compassion', "A classmate drops books. Kind action: help pick them up and say 'Are you OK?'. Reflect: how did it feel for them, and for you?"),
 (('VAL',), r'honesty', "You break a cup. Honest action: tell the adult straight away, say what happened and offer to help clean. Trust grows when we tell the truth even when it is hard."),
 (('VAL',), r'responsibility|fairness and rules', "Class jobs: Monday Asha waters plants, Tuesday Ben tidies books. A fair rule: everyone takes a turn, and everyone knows it in advance."),
 (('VAL',), r'environment|earth', "Reduce, reuse, recycle: use both sides of paper, refill a water bottle, put bottles in the recycling bin. Count how many bottles your class saves in a week."),
 (('CSC',), r'python', "name = 'Sara'; total = 0; for n in [3, 5, 7]: total = total + n; print(name, total) prints Sara 15. Trace each line to check."),
 (('CSC',), r'sql|databases', "SELECT name, marks FROM students WHERE marks > 80 ORDER BY marks DESC; returns the students above 80, highest first."),
 (('CSC',), r'stacks and queues', "Stack (last in, first out): push 3, push 5, pop gives 5. Queue (first in, first out): enqueue 3, enqueue 5, dequeue gives 3."),
 (('CSC',), r'number systems|computer systems', "Binary 1011 = 8 + 0 + 2 + 1 = 11. Decimal 13 = 8 + 4 + 1 = 1101."),
 (('ACC',), r'accounting concepts|equation', "Assets = Liabilities + Capital. Cash 5,000 + Stock 3,000 = Loan 2,000 + Capital 6,000. If the owner pays 1,000 of the loan in cash: Assets 7,000 = Liabilities 1,000 + Capital 6,000."),
 (('ACC',), r'journal|ledger', "Bought goods for 4,000 cash. Journal: Purchases A/c Dr 4,000, To Cash A/c 4,000. Post to the ledger: debit side of Purchases, credit side of Cash."),
 (('ACC',), r'depreciation', "Machine cost 50,000, scrap value 5,000, life 5 years. Straight line: (50,000 - 5,000) / 5 = 9,000 per year."),
 (('ACC',), r'financial statements of sole', "Sales 90,000 - cost of goods sold 60,000 = gross profit 30,000. Less expenses 12,000 = net profit 18,000. Capital + net profit - drawings gives closing capital."),
 (('BST',), r'.', "A small stall buys fruit for 50 and sells for 80. Revenue 80, cost 50, profit 30. Name which function of management you used: planning (how much to buy), organising (who sells), controlling (check the cash)."),
 (('ECO',), r'central tendency|data', "Marks 10, 20, 20, 30, 40. Mean = 120 / 5 = 24. Median = 20. Mode = 20. Range = 40 - 10 = 30."),
 (('ECO',), r'demand|supply|price', "If price of tea falls from 20 to 15 and quantity demanded rises from 100 to 130 cups, demand has extended along the same curve: the law of demand."),
 (('HIS', 'GEO', 'POL', 'PSY'), r'.', "Take one source or data set. Ask five questions: who made it, when, why, what does it show, what is missing? Write three sentences using one piece of evidence each, then say what other source you would check."),
 (('PHY',), r'work, energy', "Power = work / time. 600 J of work in 12 s gives P = 50 W. Potential energy of 2 kg at 5 m = 2 x 10 x 5 = 100 J (g = 10)."),
 (('PHY',), r'oscillations|waves', "Wave speed = frequency x wavelength. 50 Hz and 6.8 m gives 340 m/s. Period = 1 / frequency = 0.02 s."),
 (('CHE',), r'basic concepts', "Moles = mass / molar mass. 36 g of water (18 g per mole) is 2 moles, which contains 2 x 6.02 x 10 to the 23 molecules."),
 (('BIO',), r'.', "Draw and label the structure, state the function of each part in one line, then link structure to function: for example, thin walls of the air sacs let oxygen pass quickly into the blood."),
 (('MAT',), r'numbers to 20|numbers to 100|numbers to 1000', "Show 47 as 4 tens and 7 ones. Compare 47 and 74: 7 tens is more than 4 tens, so 74 is greater. Count on in tens from 47: 57, 67, 77."),
 (('MAT',), r'shapes and data|geometry|shapes', "A square has 4 equal sides and 4 right angles; a rectangle has 2 pairs of equal sides. A tally of 5 red, 3 blue and 2 green shows most children like red."),
 (('MAT',), r'quadrilaterals', "Angles of a quadrilateral add to 360 degrees. If three are 90, 80 and 100, the fourth is 360 - 270 = 90 degrees."),
 (('MAT',), r'measurement', "A pencil is 15 cm; 4 pencils end to end are 60 cm. Estimate first, measure, then compare."),
 (('MAT',), r'four operations', "A shop sells 24 pens at 5 each and 12 books at 30 each. Pens 120 + books 360 = 480. Pay 500: change 20."),
 (('MAT',), r'linear equations in two', "2x + y = 7 and x - y = 2. Add: 3x = 9, x = 3, y = 1. Check: 6 + 1 = 7 and 3 - 1 = 2."),
]
def solved2(title, subj):
    for subs, pat, txt in WE2:
        if subj in subs and re.search(pat, title.lower()): return txt
    return None

def solved(title):
    for pat, txt in WE:
        if re.search(pat, title.lower()): return txt
    return None

def modules(rows, kind, bd):
    f = FR[kind]; out = []
    for i, r in enumerate(rows):
        sj = r['subject']
        o = r['outcome'].split(' (grade')[0].strip(); t = r['unit']; b = bloom(o)
        out.append(dict(n=i + 1, title=t, bloom=b, weeks=[int(r['first_week']), int(r['last_week'])], hours=int(r['weeks']) * 3, outcome=o,
                        intro=f"In this unit you work on '{t}', taught in a way that is {bd['w']}. The target is clear: {o}. You move from seeing it, to saying it, to doing it alone.",
                        points=[s.format(t=t, o=o) for s in f['steps']], example=(((lambda sv: ('Solved: ' + sv + ' Method: ') if sv else '')(solved2(t, sj) or (solved(t) if kind in ('maths', 'sci', 'lang') else None))) + f['ex'].format(t=t, o=o)),
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
