#!/usr/bin/env python3
"""Flagship: Brazil location courses (55 topics). Own wording; no brand, institution or person names; no fees.
Run: python3 tools/flagship_brazil.py   (writes site/learn-brazil-*.html and learn-brazil-hub.html)"""
import sys, pathlib, html, re, json
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape
ROOT = pathlib.Path(__file__).resolve().parent.parent
TOPICS = [t.rstrip('…') for t in json.load(open(ROOT / 'data' / 'locations.json'))['br']['topics']]

# name -> (thing delivered, customer, unit, main risk, key resource, price BRL per unit, variable cost, fixed per month, units per month)
D = {
"Internet Companies": ("an online service or marketplace", "a user who finds, compares and buys online", "order", "losing trust through slow service or leaked data", "a tested web platform", 120, 70, 18000, 700),
"IT": ("a software or support service", "an office that depends on working systems", "support contract month", "outage or an unfixed fault", "a skilled engineer and a ticket log", 900, 450, 15000, 40),
"Health": ("a health or wellness service", "a patient or member of the public", "visit", "harm from a wrong or late decision", "a trained, registered professional", 180, 80, 14000, 220),
"Real Estate": ("a property sale, lease or management service", "an owner, buyer or tenant", "closed deal", "a defective title or a wrong valuation", "a verified property file", 4500, 900, 12000, 6),
"Food": ("a safe, labelled food product", "a household or retail buyer", "case", "contamination or a broken cold chain", "a clean, controlled kitchen or plant", 150, 90, 10000, 400),
"Energy": ("a power service or installation", "a home, firm or utility", "kilowatt installed", "electrical fault, fire or poor design", "tested equipment and a qualified electrician", 4200, 3000, 20000, 30),
"Oil & Gas": ("a field or supply-chain service", "an operator or contractor", "job order", "a leak, fire or stoppage", "a permit-to-work system", 22000, 15000, 60000, 8),
"Telecom": ("a network or connectivity service", "a household or business subscriber", "subscriber month", "dropped service and unpaid churn", "a mapped, monitored network", 90, 45, 40000, 1500),
"Smart Home Builder": ("a home built with connected controls", "a home owner", "home fitted", "a system that cannot be used by the family", "a tested wiring and control plan", 18000, 12000, 25000, 4),
"Road & Bridge Development": ("a road or bridge work package", "a public or private owner", "section built", "ground failure or a worker injury", "a surveyed, designed section", 90000, 65000, 70000, 3),
"Automated Farming Equipment": ("a machine or kit that does a field task", "a farm owner or cooperative", "unit sold or hired", "a breakdown in the busy season", "spare parts and trained operators", 38000, 26000, 20000, 3),
"Construction Safety Management": ("a site safety service", "a builder or site owner", "site month", "a fall, a collapse or a missed inspection", "a daily check routine and records", 6500, 3000, 12000, 8),
"Sensor Manufacture": ("a calibrated sensor", "a machine maker or plant", "sensor", "a drifting reading that goes unnoticed", "a calibration bench", 260, 150, 30000, 400),
"Internet Infrastructure": ("hosting, links or data-centre capacity", "a firm that needs steady online systems", "rack month", "downtime and slow recovery", "power, cooling and backup links", 1800, 700, 50000, 60),
"International Trade": ("a cross-border sale or purchase", "a buyer or seller abroad", "shipment", "a rejected consignment or a payment dispute", "correct customs papers", 25000, 21000, 9000, 4),
"Tourist Automation": ("a booking, guide or visit tool", "a visitor and a local operator", "booking", "a wrong time, price or place shown", "an accurate live listing", 60, 22, 12000, 500),
"Online / AI Investment Management": ("an online investment guidance service", "a saver with a goal", "client month", "advice that ignores the client's limits", "a documented risk profile", 80, 25, 20000, 300),
"Universities": ("a degree-level teaching programme", "a student and an employer", "student term", "teaching that does not match the task", "qualified staff and clear outcomes", 4800, 2600, 90000, 120),
"Technical & Vocational Schools": ("a hands-on trade programme", "a learner and a local employer", "learner month", "training that never touches real equipment", "a workshop with safe tools", 600, 280, 25000, 90),
"Sustainability Management": ("a measured plan to cut waste and emissions", "a firm or city office", "assessment", "claims that cannot be proven", "a measured baseline", 9000, 3500, 15000, 6),
"Drones": ("a flight or inspection service", "a farm, builder or utility", "flight job", "a crash, a lost link or a breach of airspace rules", "a checked aircraft and a licensed pilot", 2500, 900, 12000, 12),
"Distribution Companies": ("a stock-to-shop supply service", "a retailer or maker", "route day", "late or short deliveries", "a route plan and stock records", 2200, 1500, 30000, 60),
"Package Delivery Services": ("a last-mile parcel service", "a sender and a receiver", "parcel", "a lost parcel or a missed address", "scanned hand-overs", 14, 9, 22000, 6000),
"Renewable Energy for Homes, Offices, Malls, Multiplexes": ("a solar or other clean-power system", "a building owner", "kilowatt-peak installed", "poor roof work or a wrong size", "a site survey and a sized design", 4800, 3400, 25000, 20),
"Sports": ("a coaching, event or facility service", "a player, club or school", "session", "an injury from poor load or a wrong drill", "a safe space and a qualified coach", 90, 35, 8000, 300),
"Brand Management": ("a clear name, promise and look", "a firm and its customers", "brand project", "a promise the firm cannot keep", "a written brand guide", 12000, 4000, 9000, 4),
"Travel Agencies": ("a planned and booked trip", "a traveller or group", "trip", "a failed supplier or a missed visa", "checked suppliers and papers", 3200, 2500, 10000, 25),
"Microgreens Farming": ("a tray of young salad greens", "a restaurant or home cook", "tray", "mould or poor seed", "a clean rack room with light and water", 18, 7, 3500, 700),
"Care for Disabled and Elderly People": ("daily support and care", "a person and their family", "care day", "a fall, a missed dose or neglect", "a trained carer and a care plan", 220, 150, 12000, 400),
"Private Medicare": ("a private clinic or plan service", "a patient or a payer", "consultation", "a missed diagnosis or a billing error", "registered clinicians and records", 350, 190, 60000, 500),
"Home Security and Monitoring Services": ("a fitted alarm and watch service", "a household or small shop", "monitored home month", "a false alarm or a missed alert", "tested sensors and a response routine", 120, 55, 18000, 400),
"Language Schools": ("a taught language course", "an adult or school learner", "learner month", "lessons that never reach real speaking", "a placed level and a plan", 380, 180, 15000, 120),
"Courses for Foreigners": ("Portuguese and settling-in lessons", "a newcomer worker or student", "learner month", "content that ignores daily needs", "a level test and local scenarios", 420, 200, 12000, 80),
"Construction and Technical Services": ("a build, repair or install job", "a home owner or a firm", "job", "unsafe work or a cost overrun", "a scoped, priced job sheet", 7500, 5000, 14000, 10),
"Winery": ("bottled wine", "a shop, a restaurant or a guest", "case of 6", "spoilage or a mislabelled bottle", "clean tanks and a harvest plan", 520, 300, 22000, 120),
"Export and Import Business": ("goods moved across a border", "an overseas buyer or a local importer", "shipment", "wrong classification or customs delay", "a verified paper set", 40000, 34000, 12000, 3),
"Financing Start-ups": ("funding and support for a new firm", "a founder and an investor", "start-up funded", "money given without a plan or tracking", "a milestone plan", 150000, 5000, 20000, 1),
"Food Trucking": ("meals sold from a vehicle", "a street or event customer", "meal", "food poisoning or a fire", "a licensed, clean truck", 32, 13, 9000, 2400),
"Bed and Breakfast Business": ("a guest room and a morning meal", "a leisure or business guest", "room-night", "bad reviews from small failures", "clean rooms and a clear booking system", 280, 90, 6000, 90),
"Hostel or Hotel Business": ("beds, rooms and services", "a traveller or group", "room-night", "empty rooms and slow cleaning", "a booking and housekeeping routine", 340, 130, 45000, 600),
"Carpentry": ("a made or fitted wooden piece", "a home owner or a builder", "piece", "a cut injury or a poor fit", "sharp, guarded tools and dry timber", 1800, 900, 6000, 12),
"Event Organization and Management": ("a planned and run event", "a client and guests", "event", "an unsafe crowd or a missed supplier", "a run sheet and a risk plan", 14000, 8500, 8000, 5),
"Franchise Business": ("a repeatable outlet under a shared model", "a franchisee and the customer", "outlet month", "a model that does not travel", "an operations manual", 52000, 38000, 15000, 4),
"Manufacturing Business": ("a made product in a steady process", "a trade buyer", "batch", "defects that pass inspection", "a documented process and gauges", 9000, 6200, 45000, 30),
"Apparels and Accessories": ("clothes and accessories", "a shopper or a retailer", "piece", "unsold stock and poor fit", "a sized pattern and a stock plan", 130, 60, 12000, 500),
"Beauty": ("a hair, skin or nail service", "a client", "treatment", "a skin reaction or a spread of infection", "clean tools and a client record", 150, 45, 7000, 220),
"Dental": ("a dental care visit", "a patient", "visit", "an infection or a wrong treatment", "sterile instruments and chart", 260, 110, 30000, 300),
"Cleaning Services": ("a scheduled cleaning job", "a home or office", "visit", "slips from wet floors and misused chemicals", "a checklist and labelled products", 160, 85, 6000, 220),
"Warehousing and Storage Services": ("safe stock keeping", "a seller or maker", "pallet month", "lost stock or a fire", "a mapped, counted store", 55, 22, 28000, 1500),
"Transportation and Courier Services": ("a moved load or document", "a firm or a household", "trip", "a crash, a delay or a damaged load", "a checked vehicle and driver hours log", 380, 250, 20000, 150),
"3D Printing Business": ("a printed part or model", "a designer or maker", "part", "a weak print and wasted material", "a calibrated printer and a test routine", 95, 40, 9000, 220),
"App Development": ("a working mobile or web app", "a user and a client", "release", "a launch that users cannot use", "a tested build and a backlog", 55000, 30000, 25000, 1),
"Small and Medium Entrepreneur Business": ("a small firm's steady trade", "a local customer base", "month of trade", "cash running out before sales arrive", "a monthly cash plan", 38000, 24000, 9000, 1),
"Outsourcing Services": ("a handled back-office or support process", "a client firm", "service month", "errors that reach the client's customer", "a trained team and service levels", 16000, 9500, 22000, 5),
"Electronics Sales & Repair Services": ("sold and repaired electronic goods", "a household or small firm", "repair", "an electric shock or a lost customer device", "an anti-static bench and a job tag", 180, 70, 8000, 200),
}
from brazil_deep_1 import DEEP as _D1
from brazil_deep_2 import DEEP as _D2
DEEP = {**_D1, **_D2}
assert set(DEEP) == set(D), set(D) ^ set(DEEP)
assert set(D) == set(TOPICS), (set(TOPICS) - set(D), set(D) - set(TOPICS))
PHASE1 = set(TOPICS[:8])

def slug(n): return 'learn-brazil-' + re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-') + '.html'
def money(x): return f'R$ {x:,.0f}'.replace(',', '.')

def mods(n):
    th, cu, un, rk, kit, pr, vc, fx, vol = D[n]
    cm = pr - vc; be = -(-fx // cm); prof = cm * vol - fx
    m = []
    m.append(("Know your customer and market", "Analyse", 4,
      f"Every sound business in {n.lower()} begins with one clear customer and one clear problem. In Sao Paulo and the wider state, demand is real but crowded, so a small, well-described customer group wins before a broad one.",
      [f"Write the customer in one sentence: {cu}. Add the place, the moment of need and what they use today.",
       "List five rivals or substitutes within reach. For each, record price, strength, weakness and how people reach it.",
       "Interview at least eight real customers with open questions. Record exact words, not your summary.",
       f"Count the market in units: how many {un}s could one area buy in a month? Use two public sources and your own count, then take the lower figure.",
       "Choose one first segment and say why the others wait."],
      f"Weak: 'Everyone needs {th}.' Strong: 'Our first customer is {cu} within 8 km of the centre, who today pays {money(pr*1.1)} per {un} and complains about delay. We target 20 {un}s a month by month three.'",
      "Write the one-sentence customer, a five-row rival table and eight interview records. Share them with a peer for a challenge round.",
      "Customer is specific; rival table has prices; every claim traces to an interview or a source."))
    m.append(("Rules, registration and data duties in Brazil", "Understand", 4,
      "Brazil asks every trader to be visible and accountable. Know which register, tax regime and sector rules apply before the first sale, and check each against the current official text.",
      ["Choose a legal form: micro-entrepreneur (MEI) for the smallest traders, or a company registered with a CNPJ. Check the current limits and activity lists on the official portal.",
       "Learn the tax regime that fits your size and write down which taxes you will collect and pay, and when.",
       f"Find the sector rules for {n.lower()}: licences, inspections, professional registers. List each with the office that issues it and the renewal date.",
       "Personal data of customers falls under Brazil's data protection law (LGPD). Collect only what you need, say why, keep it safe, and name who answers questions.",
       "Consumer law gives buyers clear rights on information, returns and complaints. Put your terms in plain Portuguese."],
      f"Checklist for a new {n.lower()} trader: 1) legal form and CNPJ or MEI; 2) city operating licence; 3) sector licence or register; 4) tax set-up; 5) privacy notice; 6) written terms. Each has an owner and a date.",
      "Build your own six-line compliance table for your first location. Mark what is done, what is pending and who confirms it.",
      "Every line cites an official source; nothing is assumed; pending items have dates. Local law always wins over this course."))
    m.append(("Design the offer", "Create", 4,
      f"An offer states what the customer gets, how well, by when and at what price. For {th}, the offer must make the quality visible and the next step easy.",
      [f"Describe the core offer in three lines: what is delivered ({th}), the standard it meets, and the time it takes.",
       "Add one proof for each promise: a sample, a test result, a guarantee or a customer record.",
       "Price from cost upward and from customer value downward, then pick a price inside both.",
       "Write a simple one-page terms sheet: what is included, what is extra, how to cancel.",
       "Create two options at most, so choice stays easy."],
      f"Offer: '{th.capitalize()}, delivered within agreed time, checked against a written standard, price {money(pr)} per {un}. Proof: photo record and sign-off by the customer. Cancel any time before work begins.'",
      "Write the offer card, the proof list and the terms sheet. Test them with three customers and note every point where they hesitated.",
      "Promise, proof and price are consistent; terms fit one page; three customer reactions are recorded."))
    m.append(("Run the work step by step", "Apply", 5,
      f"Good operations make results repeatable. For {n.lower()}, write each step so a new person could follow it on their first day, and measure each step.",
      [f"Map the process from first contact to paid and closed. Typical stages: enquiry, quote, preparation, delivery of the {un}, check, payment, follow-up.",
       f"Name the key resource at each stage: {kit}. Note what happens if it is missing.",
       "Write a one-page standard procedure per stage: who, what, tool, time, record.",
       "Choose three measures: speed, quality (errors per 100) and customer rating. Review them every week.",
       "Fix the cause of a defect, not the symptom. Ask 'why' five times and record the answer."],
      f"Stage record: 'Prepare. Owner: lead. Time: 30 min. Tool: checklist. Record: signed sheet. Defect found on 3 of 40 {un}s last week; cause: missing check on {kit}; fix: add check at start, review next Friday.'",
      "Draw the process map and write procedures for the two riskiest stages. Run each once and time it.",
      "Procedures are followable by a stranger; measures have weekly numbers; one defect is traced to a root cause."))
    m.append(("Safety, quality and risk", "Evaluate", 4,
      f"The most serious risk in this field is {rk}. A calm, written risk routine protects people first and the business second.",
      ["List ten things that could go wrong. Score each for how likely (1 to 5) and how serious (1 to 5). Multiply and sort.",
       "For the top five, choose a control: remove the hazard, replace it, guard it, train people, or use protective gear, in that order of preference.",
       "Write who does what in an emergency, and rehearse it once a quarter.",
       "Keep an incident and near-miss log. Near-misses are free lessons.",
       "Check that insurance and legal duties match the risk you actually carry."],
      f"Risk row: 'Hazard: {rk}. Likelihood 3, severity 5, score 15. Control: written check before each {un}, trained staff, log sheet. Owner: site lead. Review monthly.'",
      "Build a ten-row risk register and a one-page emergency plan. Run a ten-minute drill with a peer and note two improvements.",
      "Top risks have controls ranked by preference; drill done; log started. Where a regulation applies, follow the official rule."))
    m.append(("People, skills and service", "Apply", 4,
      "People deliver the promise. Define roles, train to a standard and give feedback in the open.",
      ["Write a role card for each person: purpose, five tasks, the standard for each, and who to ask for help.",
       "Train by showing, doing with support, then doing alone with a check. Record sign-off per task.",
       "Set service rules for answering customers: reply times, tone, how to apologise and fix.",
       "Hold a ten-minute team check each day: yesterday's problem, today's plan, one risk.",
       "Build a growth path: what a new person can do in week 1, month 3 and month 12."],
      "Training record: 'Task: handle a complaint. Shown 2 May; done with support 4 May; done alone 8 May, checked: apology, fix, follow-up call. Signed by lead.'",
      "Write two role cards and a training plan for one new hire. Role-play a hard customer conversation twice and review.",
      "Role cards have measurable standards; training shows sign-off steps; service rules are written in plain words."))
    m.append(("Money: cost, price and break-even", "Analyse", 5,
      "A business lives or dies on a few numbers. Know your contribution per unit, your fixed costs and the volume you need.",
      [f"Contribution per {un} = price minus variable cost. Fixed costs are paid whether you sell or not.",
       "Break-even units = fixed cost divided by contribution. Plan to pass it by a safe margin.",
       "Make a 12-month cash plan. Cash timing matters as much as profit: customers may pay late, suppliers may want money first.",
       "Keep money for business and money for the owner apart.",
       "Test the plan: what if sales fall by a quarter, or cost rises by a tenth?"],
      f"Worked example, all figures in reais: price {money(pr)}, variable cost {money(vc)}, contribution {money(cm)} per {un}. Fixed cost {money(fx)} a month. Break-even = {money(fx)} / {money(cm)} = {be} {un}s a month. At {vol} {un}s a month, profit = {money(cm)} x {vol} - {money(fx)} = {money(prof)}. These are teaching figures; use your own.",
      "Build your own table: price, variable cost, contribution, fixed cost, break-even and a downside case at 75% of sales. Show it to a peer or mentor.",
      "Arithmetic is correct; every figure has a source or is marked as an assumption; a downside case is shown."))
    m.append(("Grow, measure and renew", "Evaluate", 4,
      "Growth should follow proof. Measure, learn, then add; and keep returning to the customer.",
      ["Pick one growth lever at a time: new customers, a higher repeat rate, a better price, or a new offer.",
       "Set one measurable target for 90 days, such as 'raise repeat customers from 20% to 30%'.",
       "Ask each customer how they found you, and record it. Spend more where the record shows results.",
       "Review monthly: numbers, defects, complaints, cash. Write three decisions each time.",
       "Plan the renewal of licences, equipment and skills a year ahead."],
      f"90-day plan: 'Lever: repeat customers. Action: follow-up call after every {un}. Target: repeat rate from 20% to 30%. Check: weekly count. Review date: day 45 and day 90.'",
      "Write a 90-day plan with one target, three actions and a review date. Present it in five minutes and take questions.",
      "Target is measurable and dated; actions are small enough to start this week; review date is in the calendar."))
    for k, mod in enumerate(m):
        mod[4].insert(0, 'In ' + n.lower() + ': ' + DEEP[n][k])
    m = [tuple(x) for x in m]
    return m

def quiz(n):
    th, cu, un, rk, kit, pr, vc, fx, vol = D[n]
    cm = pr - vc; be = -(-fx // cm)
    return [("Why write the customer in one sentence?", "It makes the offer, the price and the message specific; you can test it with real people."),
     ("Name the two Brazilian registers a small trader may choose between.", "MEI for micro-entrepreneurs, or a company with a CNPJ (check current limits)."),
     ("Which Brazilian law governs customer personal data?", "LGPD, the general data protection law."),
     ("What three parts does an offer state?", "What is delivered, to what standard and by when, and at what price, with proof."),
     ("Why write a procedure per stage?", "So any trained person can repeat it and so each stage can be measured."),
     (f"What is the main risk named for {n.lower()} in this course, and what is the first control to try?", f"{rk.capitalize()}. Try to remove or replace the hazard before guarding, training or protective gear."),
     ("Order the controls from best to last.", "Remove, replace, guard, train, protect with gear."),
     ("Define contribution per unit.", "Price minus variable cost per unit."),
     (f"Using the worked example, what is break-even in {un}s?", f"{be} {un}s a month (fixed {money(fx)} / contribution {money(cm)}, rounded up)."),
     ("Why change only one growth lever at a time?", "So you can tell which change caused the result.")]

RUBRIC = [("Customer and market", "Everyone is the customer", "One segment with interviews", "Segment, interviews and a counted market"),
          ("Rules and records", "Unaware of duties", "Table with sources", "Table kept current, owner and dates"),
          ("Offer and operations", "No written standard", "Offer card and procedures", "Procedures measured weekly"),
          ("Safety and risk", "No register", "Ranked register", "Register, drill and incident log"),
          ("Money", "No numbers", "Break-even correct", "Break-even, cash plan and downside case")]

LADDER = [("L1 Basic", "Name the main parts of {n} and the words used. Notes: for a first-time learner, no experience needed."),
 ("L2 Awareness", "Describe how {n} works for a customer and the rules that apply. Notes: suits school leavers and career changers."),
 ("L3 Foundation", "Perform the core tasks under supervision to a written standard. Notes: needs L2 knowledge."),
 ("L4 Practitioner", "Run the whole service or process alone to standard. Notes: this course is pitched here."),
 ("L5 Specialist", "Diagnose faults and improve a process with data. Notes: needs a year of practice."),
 ("L6 Advanced", "Design systems, lead a team and manage risk and budgets. Notes: for managers and owners."),
 ("L7 Super expert", "Set standards, advise others and shape the sector. Notes: for recognised leaders and examiners.")]

def build(n, i):
    th, cu, un, rk, kit = D[n][:5]
    ms = mods(n)
    mh = ''
    for k, (t, bl, h, intro, pts, ex, act, std) in enumerate(ms, 1):
        mh += (f'<details class="mod" {"open" if k==1 else ""}><summary><span class="mn">Module {k}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
               f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    qz = ''.join(f'<details class="mod"><summary>Q{j+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for j, (q, a) in enumerate(quiz(n)))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in RUBRIC) + '</tbody></table></div>')
    lad = '<ol class="ladder">' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b.format(n=n.lower()))}</li>' for a, b in LADDER) + '</ol>'
    total = sum(m[2] for m in ms)
    outs = [(m[1], f'{m[0]}: ' + m[7].split(';')[0].rstrip('.') + '.') for m in ms]
    phase = 'Phase 1 (2026 to 2027)' if n in PHASE1 else 'Phase 2 (2027 to 2028)'
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">8 modules · {total} h lessons plus practice</span><span class="pill">Brazil, Sao Paulo · {phase}</span></div>'
        '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Plan, start and run {e(n.lower())} in Sao Paulo: serve {e(cu)}, deliver {e(th)}, keep records, and show a working month of numbers.</p></div>'
        '<div><h4>Condition</h4><p>About 8 weeks part-time. Own phone or computer, real customers or a real practice site, a peer and a mentor for the final review. Local rules and licences checked against official sources.</p></div>'
        '<div><h4>Standard</h4><p>Every module standard is met; all claims are true and backed by records; peers and a mentor mark the evidence \'Meets\' or better.</p></div></div>'
        '<p><strong>Who it is for:</strong> students, graduates, career changers, owners, workers and returners. <strong>Requirements:</strong> none. <strong>Materials:</strong> lesson text, templates, tracker, rubric, check with answers.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mh)
        + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: customer file, compliance table, offer card, procedures, risk register, role cards, money table, 90-day plan. Mentor and peers mark it with this rubric. Pass: no criterion at \'Not yet\'.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{qz}')
        + B.sec('alt', 'ld', 'levels L1 to L7', 'Where this sits on the ladder', lad)
        + B.sec('', 'lc', 'ten locations and global', 'Your place', '<p>Local rules change licences, taxes, data duties and customer rights. This course is written for Sao Paulo. Check the current official text for your own place.</p>'
                + ''.join(f'<details class="loc"{" open" if L["k"]=="br" else ""}><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Currency: {L["cur"]}. Registration: {e(L["reg"])}. Data rule for what you publish: {e(L["data"])}. Skills frame to cite: {e(L["frame"])}.</p></details>' for L in B.LOC)
                + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>'
                + f'<details class="loc"><summary>Global</summary><p>{e(B.GLOBAL["note"])}</p></details>')
        + B.sec('alt', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording; teaching figures are examples, not forecasts. Not live.</p>'))
    B.page(slug(n), f'{n} (Brazil flagship course)', f'An eight-module course on {n.lower()} for Sao Paulo.', n, e(f'Eight modules take you from the first customer to a running, measured service in {n.lower()}.'), body,
           B.crumb(('Courses', 'courses-hub.html'), ('Brazil', 'learn-brazil-hub.html'), (n, None)), kicker='flagship course · Brazil')

def hub():
    cards = ''.join(f'<li><a href="{slug(n)}">{e(n)}</a></li>' for n in TOPICS)
    B.page('learn-brazil-hub.html', 'Brazil location courses', 'Fifty-five flagship courses for Sao Paulo.', 'Brazil location courses', 'Fifty-five full courses for Sao Paulo, each with eight modules, worked examples, a rubric and a ten-question check.',
           B.sec('', 'bz', 'all topics', '55 courses', f'<ul class="ticks">{cards}</ul>'), B.crumb(('Courses', 'courses-hub.html'), ('Brazil', None)), kicker='Brazil')

if __name__ == '__main__':
    for i, n in enumerate(TOPICS): build(n, i)
    hub(); print(len(TOPICS), 'courses built')
