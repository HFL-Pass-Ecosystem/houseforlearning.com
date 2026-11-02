#!/usr/bin/env python3
"""Flagship-depth Canada courses (66). Own wording; generic titles; no person, brand or school names; no fees.
Output: site/learn-ca-NN-<slug>.html and site/canada-courses.html (new files). Data: data/canada-pathways.json."""
import sys, pathlib, html, json, re
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape
ROOT = pathlib.Path(__file__).resolve().parent.parent
PW = json.load(open(ROOT / 'data/canada-pathways.json'))

# ---- ten families: (keywords) -> content bank ----
F = {}
def fam(k, **kw): F[k] = kw

fam('tech', label='advanced technology and manufacturing',
 roles=['Technology aware learner','Lab or shop assistant','Technician','Product engineer or builder','Senior engineer or line lead','Programme or plant manager','Technology founder or director'],
 market=["List the people who would use a {t} offer today: a business buyer, a public body, a research group. Write what each pays now for the nearest alternative.",
  "Map the supply chain in four boxes: parts or inputs, making, testing, delivery. Mark where Canada is strong (research, skilled labour, clean power) and where you depend on imports."],
 rules=["Product safety and electrical or mechanical standards are set by recognised Canadian standards bodies; write down which ones apply to your product and who told you.",
  "Export of advanced technology can need a permit from the federal government; check before you share designs or sell abroad.",
  "Materials, chemicals and batteries have transport and storage rules; keep the safety data sheet for every material.",
  "Intellectual property: search first, then decide between a patent, a registered design, a trade secret or open licence. Keep dated lab notes."],
 craft=["Break the product into a block diagram of at most ten blocks. Each block has an input, an output and a test.",
  "Build the smallest working prototype first (a proof of function), then a prototype that looks like the product.",
  "Write a test plan before building: what you measure, with what instrument, to what limit, how many times.",
  "Keep a change log; when a test fails, change one thing and record it."],
 cex="A prototype sensor must read within 2% of a reference. Ten readings: 9 within 2%, 1 at 3.4%. The plan: find the cause (a loose connector), fix it, run ten more readings, and record both runs.",
 ops=["Set quality gates: incoming parts, first article, final test, with a pass limit for each.","Track yield: good units divided by started units; below 90% means find the top cause.","Calibrate instruments on a schedule and keep certificates.","Plan spares and lead times: a part with a 12-week lead time sets your schedule."],
 qa=("What are the three levels of a prototype plan?","Proof of function, looks-like prototype, then pilot batch built with production methods."),
 risk=["Write the top five technical risks with a trigger and a fallback for each.","Lab and shop safety: training, guards, protective gear, an incident log, and a named safety lead.","Ethics: state who could be harmed by misuse of the product and what you do about it."],
 price=(1200,780,40,'unit'), jobs=['Technician','Prototype engineer','Test engineer','Quality inspector','Product developer','Technology founder'])

fam('digital', label='software, data and digital services',
 roles=['Digital aware learner','Support assistant','Junior developer or analyst','Developer, consultant or builder','Senior specialist or team lead','Delivery or product manager','Digital director or founder'],
 market=["Interview five people who would use a {t} service. Ask: what do you do today, what does it cost in time and money, what breaks?",
  "Choose one narrow first user (for example a clinic, a small shop, a neighbourhood group) and write their problem in one sentence."],
 rules=["Federal private-sector privacy law (PIPEDA) and provincial laws set how you collect, use, store and share personal data; Quebec has its own stricter law.",
  "Anti-spam law (CASL) needs consent before you send commercial messages; keep proof of consent.",
  "Accessibility: aim for WCAG 2.1 AA so people with disabilities can use what you build; Ontario and federal rules apply to many organisations.",
  "Contracts: agree scope, ownership of code and data, support hours and what happens on termination in writing."],
 craft=["Write the user story: 'As a ___ I want ___ so that ___' and a test that proves it works.","Build in small releases of one to two weeks; each release is used by one real person.","Use version control, automated tests and a staging copy before you change anything live.","Document in plain language: how to run it, how to fix common faults, who to call."],
 cex="Story: 'As a clinic receptionist I want a reminder list so that fewer patients miss visits.' Test: 20 sample patients, list shows exactly the ones booked tomorrow. Release 1 in one week; no-shows tracked for a month.",
 ops=["Measure availability (percent of time working), response time and defects found per release.","Back up data on a schedule and test a restore at least once.","Write a runbook for the three most likely faults.","Review access: who can see what, and remove access when people leave."],
 qa=("Why test a restore, not only make a backup?","A backup you have never restored may not work when you need it."),
 risk=["Security basics: strong sign-in, least access, encryption, software updates, a breach plan with who tells whom and when.","Bias and fairness: check that a model or rule does not treat groups unfairly; keep a record of the check.","Vendor risk: note what happens if a supplier changes price or closes."],
 price=(85,30,300,'hour'), jobs=['Junior developer','Data analyst','IT consultant','Support engineer','Product owner','Digital founder'])

fam('creative', label='content, creative and marketing work',
 roles=['Creative aware learner','Content assistant','Junior creator','Professional creator or freelancer','Senior creator or studio lead','Creative director or editor','Agency owner or head of content'],
 market=["Study ten working examples of {t}: who made them, who pays, how often and how much per piece.","Write your niche in one sentence: the audience, the problem, the style."],
 rules=["Copyright: you own what you create unless a contract says otherwise; licence only images, music and text you have the right to use, and keep the licence record.","Advertising must be truthful; paid or sponsored posts must be clearly marked.","Anti-spam law (CASL) needs consent before commercial emails or messages.","Contracts: agree brief, revisions, deadline, payment dates and who owns the final files."],
 craft=["Start from a brief: purpose, audience, one message, one action you want.","Make three rough options before polishing one; get a reaction from a real member of the audience.","Edit in passes: structure, clarity, style, then checks for facts, spelling and licences.","Build a portfolio of five finished pieces, each with a short case note: brief, action, result."],
 cex="Brief: a local gym wants more sign-ups. Option B (a short before/after story) gets the best reaction from 5 of 8 members. Result after a month: 14 enquiries against a usual 6.",
 ops=["Keep a content calendar for four weeks ahead.","Track time per piece so that you can price it.","Use a checklist before delivery: facts, spelling, licences, file formats, links.","Keep a folder system and back up client files."],
 qa=("What do you record for every image or track you use?","The source, the licence, the date and where it is stored."),
 risk=["Never publish personal details of a person without consent.","Check claims in health, money and safety topics against reliable sources.","Handle feedback calmly: separate taste from error and agree changes in writing."],
 price=(65,0,50,'hour'), jobs=['Content creator','Copywriter','Social media coordinator','Graphic designer','Virtual assistant','Freelance consultant'])

fam('commerce', label='commerce, retail and online selling',
 roles=['Commerce aware learner','Shop or order assistant','Seller or buyer','Store or channel manager','Senior merchandiser','Head of commerce','Retail or marketplace owner'],
 market=["Compare ten similar listings or shelves for {t}: price, photos, delivery time and reviews. Note the gap you can fill.","Pick a niche you can serve well and say who it is not for."],
 rules=["Consumer protection law is provincial; return, refund, warranty and price display rules differ by province.","Collect and remit the federal and provincial sales tax once your sales pass the small-supplier limit, or register earlier by choice.","Marketplace platforms have their own seller rules; read them and keep a copy of what you accepted.","Product rules: labels, bilingual packaging for many goods, safety limits for children's products, and import duties for goods from abroad."],
 craft=["Source: ask three suppliers for price, minimum order and lead time; test samples.","Write listings with plain titles, honest photos, size and condition, and delivery cost.","Set stock levels from sales speed: reorder point = daily sales x lead time + safety stock.","Pack and ship in a way that survives the trip; record damage and fix the cause."],
 cex="Daily sales 4 units, lead time 10 days, safety stock 12: reorder point = 4 x 10 + 12 = 52 units.",
 ops=["Count stock monthly and compare with records.","Answer messages within one working day.","Track returns by reason; fix the top reason first.","Record every sale with date, price, tax, fees and shipping."],
 qa=("How do you compute a reorder point?","Daily sales times lead time plus safety stock."),
 risk=["Do not sell fakes, recalled or unsafe goods; check recall lists for used goods.","Protect buyer data and payment details; use the platform's secure checkout.","Watch cash: stock bought but not sold is money locked up."],
 price=(48,26,200,'order'), jobs=['Online seller','Buyer or merchandiser','Store manager','Marketplace account manager','Inventory planner','Retail owner'])

fam('finance', label='finance and accounting',
 roles=['Finance aware learner','Clerk or assistant','Bookkeeper or junior analyst','Accountant or adviser','Senior adviser or manager','Head of finance','Partner or chief officer'],
 market=["Interview five clients or employers about {t}: what they need, what they pay, what they distrust.","Write the service in one sentence with the client type and what is not offered."],
 rules=["Giving investment or credit advice, dealing in securities and managing money for others needs registration with the provincial securities regulator; know the line before you cross it.","Anti-money-laundering rules need you to know your client, keep records and report suspicious activity.","Professional accounting titles are protected; claim only what you hold.","Client data is confidential; privacy law (PIPEDA) applies to what you hold."],
 craft=["Set up the books: chart of accounts, bank link, monthly close checklist.","Reconcile bank to books every month and explain each difference.","Report plainly: income, costs, profit, cash, and three notes on what changed.","For any advice, write the client's goal, time frame, risk comfort and the reason for each step."],
 cex="Bank shows 12,480; books show 12,150. Differences: cheque not cleared 450, bank fee 120. 12,480 - 450 = 12,030; 12,150 - 120 = 12,030. Reconciled.",
 ops=["Close each month by a fixed day.","Keep a document trail for every entry.","Use two-person review for payments above a set amount.","File tax returns and remittances by their due dates; set reminders a week early."],
 qa=("What must a reconciliation explain?","Every difference between the bank statement and the books."),
 risk=["Conflicts of interest: tell the client in writing.","Fraud signs: round amounts, missing documents, rushed approvals.","Never promise returns; show ranges and risks."],
 price=(95,10,60,'hour'), jobs=['Bookkeeper','Accounting clerk','Financial analyst','Tax preparer','Adviser trainee','Compliance officer'])

fam('property', label='property, construction and smart buildings',
 roles=['Built environment aware learner','Site or office assistant','Tradesperson or coordinator','Supervisor or agent','Project manager','Development manager','Developer or company director'],
 market=["Walk three local sites or listings for {t}; record price per square metre or per unit, demand and gaps.","Write who the customer is: owner, tenant, builder, investor, municipality."],
 rules=["Building codes are provincial and enforced by the local municipality; permits come before work.","Real estate agents are licensed by provincial regulators; know what needs a licence.","Landlord and tenant law is provincial; know notice, deposit and entry rules.","Workplace safety boards require training, protective gear and incident reports on site."],
 craft=["Read drawings: plan, section, details; mark scope, quantity and risk.","Estimate by quantity x rate, add a contingency (for example 10%) and a schedule.","Sequence work and inspections so that nothing is covered before it is checked.","For smart building systems, list sensors, controllers, network and who maintains each."],
 cex="Wall area 40 m2 x rate 55 per m2 = 2,200. Add 10% contingency = 2,420. Schedule: 3 days work + 1 day inspection.",
 ops=["Daily site log: weather, crew, work, problems, deliveries.","Hold an inspection before closing each stage.","Track variations: every change gets a written cost and approval.","Keep as-built drawings and warranty papers for handover."],
 qa=("Why write down every change in a project?","A written, priced and approved change stops cost and time disputes."),
 risk=["Falls, electricity, trenches and heavy lifting are the main site hazards; plan controls before work.","Deposits and trust money must be kept as the law requires.","Energy and accessibility rules affect design; check early."],
 price=(2420,1750,9,'job'), jobs=['Site coordinator','Estimator','Property manager','Building technician','Project coordinator','Developer'])

fam('food', label='food, farming and hospitality',
 roles=['Food aware learner','Kitchen or farm assistant','Cook, grower or host','Lead cook, grower or supervisor','Chef, farm or venue manager','Operations manager','Owner or director'],
 market=["Visit five competitors for {t}; record menu or product range, prices, quality and queues.","Ask ten likely customers what they cannot find today."],
 rules=["Food businesses need a permit and inspection by the local public health unit; food handlers follow safe-handling training.","Food labels in Canada must meet federal labelling rules, including allergens and bilingual text for many products.","Farming and growing follow provincial rules for land, water, pesticides and animal welfare.","Allergen claims such as gluten-free have defined limits; never claim what you cannot test or control."],
 craft=["Standardise recipes in grams with yield and portion cost.","Plan the flow of the kitchen or field: receive, store, prepare, serve or sell.","Write cleaning and temperature logs and keep them with date and initials.","Plan a seasonal menu or crop plan against supply and demand."],
 cex="Dish ingredients cost 3.10 per portion; selling price 12.00; food cost = 3.10 / 12.00 = 26%. Target 25 to 35%.",
 ops=["Check deliveries for temperature and date.","Use first-in, first-out and label every container.","Record waste by cause; reduce the top cause first.","Separate allergens in storage and preparation."],
 qa=("How do you compute food cost percent?","Ingredient cost per portion divided by selling price."),
 risk=["Cross-contact of allergens is the leading cause of serious incidents; train and separate.","Cold chain breaks and cooking-temperature misses must trigger a discard rule.","Weather, pests and supplier failure need a plan B."],
 price=(12,3.1,900,'portion'), jobs=['Cook','Farm technician','Food safety lead','Venue supervisor','Kitchen manager','Food business owner'])

fam('care', label='health, care, wellness and education',
 roles=['Care aware learner','Support worker or assistant','Practitioner or coach','Senior practitioner or tutor','Team lead or programme lead','Service manager','Director or founder'],
 market=["Speak with five people or families who would use {t}: what they need, what they do now, what worries them.","Define the people you serve and the limits of your service."],
 rules=["Health and care professions are regulated by provincial colleges; practise only inside your scope and title.","Health information is protected by provincial health privacy laws as well as PIPEDA.","Working with children or vulnerable people needs a background check and safe-practice training.","Wellness claims must be honest and supportable; do not promise cures."],
 craft=["Start every session with a short intake: goals, needs, limits and consent.","Plan in small steps with a measure for each (for example sessions attended, skill shown, comfort scale).","Write notes the same day: what was done, what was seen, what next.","Adapt to the person: language, ability, culture and pace."],
 cex="Goal: walk 10 minutes without rest. Week 1: 4 minutes. Week 4: 8 minutes. Week 8: 11 minutes. Notes show pace, rest points and pain scale each time.",
 ops=["Keep consent, notes and contact records safe and private.","Review each person's plan every four weeks.","Know when to refer on to another professional.","Clean and check equipment before each use."],
 qa=("When should you refer a person to another professional?","When the need is outside your scope, training or title, or when risk is rising."),
 risk=["Safeguarding: know the signs, the duty to report and who to call.","Never give diagnosis or medicine advice unless your title allows it.","Look after yourself: workload, supervision and a debrief habit."],
 price=(70,8,30,'hour'), jobs=['Support worker','Coach','Tutor','Care coordinator','Patient advocate','Service manager'])

fam('services', label='local, logistics and field services',
 roles=['Service aware learner','Helper','Service provider','Lead provider','Supervisor','Operations manager','Owner or director'],
 market=["Ask ten households or businesses what they pay for {t} and what goes wrong with current providers.","Choose a service area you can reach in 30 minutes."],
 rules=["Register the business and, when sales pass the small-supplier limit, collect sales tax.","Insurance: liability cover and, where needed, vehicle or equipment cover.","Workplace injury cover is provincial; know whether you must register yourself or your crew.","Driving and carrying goods need the right licence and vehicle checks; delivery apps have their own contractor terms."],
 craft=["Write the service in steps with a time for each step.","Quote from a checklist: size, condition, access, frequency, extras.","Plan routes by area and time windows to cut travel.","Do a quality check at the end with the customer or a photo."],
 cex="Job takes 2.5 hours at a wage-plus-costs of 32 per hour = 80, plus 12 travel and materials = 92; quote 120 gives a margin of 28 or about 23%.",
 ops=["Keep a job sheet for each visit.","Check tools and vehicles weekly.","Ask for a rating after every job and act on the low ones.","Keep a schedule buffer of 15% for delays."],
 qa=("What goes into a quote?","Time, wage cost, travel, materials, extras and margin."),
 risk=["Lifting, chemicals, ladders, driving: assess and use protective gear.","Enter homes only with clear consent; follow privacy and safety rules.","Cash handling: record and bank daily."],
 price=(120,92,40,'job'), jobs=['Service technician','Courier','Cleaner or housekeeper','Landscaper','Dispatcher','Service owner'])

fam('green', label='energy, environment and resource work',
 roles=['Sustainability aware learner','Field or plant assistant','Technician','Specialist','Senior specialist or lead','Programme manager','Director or founder'],
 market=["Find who pays for {t}: municipalities, industry, communities. List the rule or incentive that creates the demand.","Map who is affected on the ground and who must agree."],
 rules=["Environmental assessment and permits are federal and provincial; start early, since they set the schedule.","Duty to consult and work with Indigenous communities, and community agreements, apply to many projects on or near their land.","Waste, emissions and water have limits and reporting rules; keep measurement records.","Worker safety in hazardous settings needs training, monitoring and a rescue plan."],
 craft=["Set a baseline: measure what is happening now with a method others can repeat.","Choose a measure and a target (for example tonnes of waste diverted, kilowatt-hours saved).","Design a pilot with a control or a before/after comparison.","Report with units, method, uncertainty and the next step."],
 cex="Baseline waste 120 t per month; after the pilot 78 t, of which 42 t diverted. Diversion rate = 42 / 120 = 35%.",
 ops=["Calibrate instruments; keep a measurement log.","Plan maintenance for equipment and vehicles.","Set emergency plans for spills, fire, weather and remote travel.","Keep community contacts and a complaints log."],
 qa=("Why start with a baseline?","Without it you cannot show a change or claim an impact."),
 risk=["Environmental harm, worker safety and community trust are the three risks to rate first.","Weather and remote distance make supply and rescue harder; keep spare time and stock.","Do not make green claims you cannot prove."],
 price=(5400,3900,12,'project'), jobs=['Environmental technician','Energy auditor','Waste coordinator','Field operator','Sustainability analyst','Programme manager'])

fam('pro', label='professional, scientific and community services',
 roles=['Practice aware learner','Assistant','Associate','Practitioner','Senior practitioner or team lead','Practice or programme head','Partner or director'],
 market=["Interview five clients about {t}: what decision they face, what evidence they need, what they paid last time.","Write your offer: question answered, method, output, time."],
 rules=["Registered professions have protected titles and scope set by provincial bodies.","Immigration help can be given only by those authorised under the federal regime; know who may represent whom.","Research with people needs consent and ethics review; follow data-handling rules.","Indigenous data and knowledge belong to the community; follow the principles of ownership, control, access and possession and ask first."],
 craft=["Frame the question, define success, and agree the scope in writing.","Gather evidence from at least two kinds of source and note their limits.","Analyse with a method you can show; test your answer against the strongest objection.","Deliver in answer-first form: answer, three reasons, risks, next steps."],
 cex="Question: should a small bakery add delivery? Evidence: 40 customer replies (28 yes), cost model shows break-even at 22 orders a week. Answer: pilot for 6 weeks with a stop rule at 15 orders a week.",
 ops=["Keep a project folder with version names.","Check numbers twice and have a peer review key pages.","Track time against the quote and report at the half-way point.","Close each project with a lessons note."],
 qa=("What does answer-first mean?","Lead with the answer, then reasons, risks and next steps."),
 risk=["Conflicts of interest and confidentiality must be declared in writing.","Do not stretch evidence to fit a wanted answer.","Respect cultural protocols and community consent."],
 price=(150,35,20,'hour'), jobs=['Associate consultant','Research assistant','Community liaison','Policy analyst','Settlement worker','Practice owner'])

KEYS = [('tech', ['quantum','3d print','electric car manufacturer','phone manufactur','greenhouse gas','screen manufactur','sensor manufactur','electronic computer','hydrogen']),
 ('digital', ['machine learning','blockchain','internet development','artificial intelligence','mobile application','computer services','mobile services','information technology','start-up']),
 ('creative', ['blog','writing','graphic','social media','copywriter','virtual assistant','film']),
 ('commerce', ['sell products','thrift','marketplace','wholesale','e-commerce']),
 ('finance', ['financial','bookkeeping','portfolio','investment banking','consulting']),
 ('property', ['smart condo','real estate','renting','construction','handym']),
 ('food', ['vertical garden','agriculture','food services','gluten','restaurant']),
 ('care', ['fitness','wellness','patient','healthcare','childcare','tutoring','online education','hobbies','petcare']),
 ('green', ['waste','charging','climate','mining','arctic']),
 ('services', ['transportation','driving','delivery','courier','housekeeping','cleaning','gardening'])]
def family(t):
    s = t.lower()
    for k, ws in KEYS:
        if any(w in s for w in ws): return k
    return 'pro'

LADDER_VERB = ['Define', 'Describe', 'Apply', 'Analyse', 'Evaluate', 'Create', 'Lead']
LADDER_DO = ['name the main terms, people and rules of {t}', 'explain how {t} works from first contact to result', 'carry out a routine task in {t} to a written standard',
             'diagnose why a {t} result missed its target and fix it', 'judge options for {t} against cost, risk and quality', 'design and pilot a new offer or process in {t}', 'run a team or business in {t} and develop others']
LADDER_NOTE = ['Start here if new. Evidence: a one-page glossary and a visit or interview note.', 'Evidence: a flow chart and a two-minute spoken explanation.', 'Evidence: a supervised task record that meets the standard once.',
               'Evidence: a fault or gap analysis with a fix and a repeat test. This course targets this level.', 'Evidence: an options paper with numbers and a recommendation defended to a panel.',
               'Evidence: a pilot with measured results over at least 30 days.', 'Evidence: a record of results over a year and of people you have coached to a higher level.']

def slug(t, n): return f'learn-ca-{n:02d}-' + re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')[:48].strip('-') + '.html'

def course(p):
    t, n = p['title'], p['n']; tl = t[0].lower() + t[1:] if not t.isupper() else t
    k = family(t); f = F[k]
    HW = ROOT / 'data/canada-handwritten' / f'{n:02d}.json'
    hw = json.load(open(HW)) if HW.exists() else {}
    price, cost, vol, unit = hw.get('price', f['price'])
    margin = price - cost; pct = round(100 * margin / price) if price else 0
    fixed = round(vol * margin * 0.6); be = round(fixed / margin) if margin > 0 else 0
    M = []
    M.append(("Find a real user and a real need", "Understand", 6,
        f"Every good {tl} offer starts with a person who will use it, not with an idea. This module gives you a way to find that person and write their need in one line.",
        [x.format(t=tl) for x in f['market']] + ["Write a one-line value statement: 'For [who] who need [what], our {0} gives [result], unlike [what they do now].'".format(tl),
         "Score three possible first users out of 5 on need, ability to pay and ease of reaching them; pick the highest and say why."],
        f"Value statement example: 'For small clinics that lose visits to missed appointments, our {tl} gives a weekly list and call script, unlike paper notes.' Scores: clinics 4/4/5, schools 3/2/3, gyms 3/4/4; clinics chosen.",
        "Speak with five possible users, fill the score table and write the value statement.", "Five conversations recorded with dates; scores have reasons; value statement fits one line."))
    M.append(("Know the rules in Canada", "Apply", 6,
        f"Rules differ by federal, provincial and local level. Your task is to find which apply to {tl}, who enforces them, and what you must do first.",
        f['rules'] + ["Make a rules table: rule, who enforces it, what you must do, by when, evidence you hold. Update it every quarter."],
        "Rules table row: 'Sales tax | federal tax agency | register once taxable sales pass the small-supplier limit | before the next sale after the limit | registration number kept on file'.",
        "Build your rules table for your province, citing the official page for each row and the date you checked it.", "Every row has an enforcer, an action and a dated source; no rule is guessed."))
    M.append(("Do the core work to a standard", "Apply", 10, f"The core craft of {tl} is learned by doing small, checked pieces of real work.", f['craft'], f['cex'],
        f"Complete one core task for {tl} with a written method, a measurement and a before/after record.", "Task done twice; second run is better than first; method and measures are written down."))
    M.append(("Price it and prove it pays", "Evaluate", 8,
        "A business that does not cover its costs closes. You will build a cost sheet and a break-even number, and test a price with real people.",
        ["Variable cost is the cost each extra {u} adds (materials, fees, direct time). Fixed cost is paid whatever you sell (rent, insurance, tools, software).".format(u=unit),
         "Margin per {u} = price - variable cost. Margin percent = margin / price.".format(u=unit),
         "Break-even volume = fixed cost / margin per {u}. If you cannot reach it within your capacity, change price, cost or scope.".format(u=unit),
         "Test the price with at least five real people before you commit; note the reaction, not only the answer."],
        f"Price {price:,} per {unit}, variable cost {cost:,}: margin {margin:,.2f} per {unit} ({pct}%). Fixed cost per month {fixed:,} gives break-even = {fixed:,} / {margin:,.2f} = about {be} {unit}s a month. Figures are teaching numbers in CAD, not market data.",
        "Build the cost sheet in a free spreadsheet, compute break-even, and write what you would change if you were 30% short.", "Units and currency shown; formulas visible; three what-if cases; a mentor checks the arithmetic."))
    M.append(("Run it well every day", "Apply", 8, f"Operations turn a good plan into steady results for {tl}.", f['ops'],
        "Weekly check: three numbers on one page (volume, quality, cash) and one action chosen from them.", "Run a 4-week log with the weekly one-page check and one improvement.", "Log has four weekly pages; each improvement is dated and its result noted."))
    M.append(("Sell, partner and be found", "Create", 6, "Customers find you through people they trust. Build two or three routes that you can run every week.",
        ["Pick channels: direct contact, local partners, online listing, referrals, public tenders where they exist; choose at most three at first.",
         "Write a one-page offer: who, what, result, proof, price basis, how to start.",
         "Keep it bilingual (English and French) where your customers or the law need it.",
         "Track a funnel: contacts, conversations, offers, accepted; improve the weakest step."],
        "Funnel for four weeks: 40 contacts, 12 conversations, 5 offers, 2 accepted. The weakest step is contact to conversation (30%); test a new first message.",
        "Run a 4-week funnel, send 20 messages and book 5 conversations.", "Funnel numbers recorded; offer page under one page; one test and its result written."))
    M.append(("Keep people, data and the community safe", "Evaluate", 6, "Trust is earned by how you handle risk, personal data and your community.",
        f['risk'] + ["Privacy: collect only what you need, tell people why, store it safely, delete it on schedule, and have a person who answers questions.",
         "Reconciliation and inclusion: ask who is missing from the table, including Indigenous, Francophone, newcomer and disabled people, and invite them in."],
        "Risk row: 'Customer list stolen | likely 2, harm 4 | strong sign-in, encrypted backup, access list reviewed monthly | owner | review each month'.",
        "Write a risk register of eight rows and a one-page privacy note.", "Each risk has likelihood, harm, control, owner and review date; the privacy note is in plain words."))
    M.append(("Pilot, review and grow", "Create", 8, "A pilot proves the idea at small size before you put more money and time in.",
        ["Define the pilot: scope, length (30 to 90 days), measures and a stop rule agreed in advance.",
         "Record weekly: what was planned, what happened, what was learned.",
         "At the end compare results with the standard, decide: stop, change, or grow, with reasons.",
         "Write a 12-month plan with three milestones, a budget and who helps you."],
        f"Stop rule: 'If fewer than {max(be//2,3)} {unit}s are sold in 60 days, we stop and write lessons.' Result at day 60: {be} {unit}s; decision: grow in steps of 25%.",
        "Run the pilot, write the review and the 12-month plan, and present to a panel of three.", "Pilot has measures and a stop rule; review decides with evidence; panel can repeat the plan."))
    QZ = [("What belongs in a one-line value statement?", "Who it is for, the need, the result and how it differs from what they do now.", 1),
          ("Why make a rules table with a date and an official source?", "Rules change and differ by province; a dated source shows what you checked and when.", 2),
          f['qa'] + (3,),
          ("How do you find break-even volume?", "Fixed cost divided by margin per unit.", 4),
          ("What is margin percent?", "Margin per unit divided by price.", 4),
          ("Name the three measures on a weekly one-page check.", "Volume, quality and cash.", 5),
          ("Which funnel step do you improve first?", "The weakest step, found from the conversion numbers.", 6),
          ("What two things must a privacy note state?", "What data you collect and why, and how you protect and delete it.", 7),
          ("What must be agreed before a pilot starts?", "Scope, length, measures and a stop rule.", 8),
          ("What is the safest response when you cannot find a rule for your case?", "Ask the official body or a licensed adviser and keep their answer in writing.", 2)]
    RUB = [("Evidence quality", "Claims without records", "Dated records for claims", "Every claim linked to a dated source or measure"),
           ("Numbers and units", "Missing units or currency", "Correct with units", "Correct with a check and what-if cases"),
           ("Rules and safety", "Rules guessed", "Rules named with enforcers", "Rules confirmed in writing with the official body"),
           ("User focus", "No real user", "Five users heard", "Changes made from user feedback"),
           ("Reflection", "No lessons", "Three lessons", "Lessons turned into a dated plan")]
    for k_, v_ in hw.get('mods', {}).items():
        i_ = int(k_) - 1; o = list(M[i_])
        for fld, ix in (('title', 0), ('intro', 3), ('pts', 4), ('ex', 5), ('act', 6), ('std', 7)):
            if fld in v_: o[ix] = v_[fld]
        M[i_] = tuple(o)
    if hw.get('quiz'): QZ = hw['quiz']
    if hw.get('jobs'): f = dict(f, jobs=hw['jobs'])
    hours = sum(m[2] for m in M)
    mods = ''
    for i, (mt, bl, h, intro, pts, ex, act, std) in enumerate(M, 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(mt)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(x)}</li>' for x in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    def tag(mn):
        # Derived from the module data: number, title and standard come from M, never typed by hand.
        if mn:
            mt_, std_ = M[mn - 1][0], M[mn - 1][7]
            return f' (Covered in module {mn}: {mt_}. To pass that module: {std_.rstrip().rstrip(".")}.)'
        return ' (Background fact, not taught in a single module. Check it with your mentor and note the source in your records; see the "Rules and safety" and "Evidence quality" rows of the marking rubric.)'
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a.rstrip() + tag(mn))}</p></details>' for i, (q, a, mn) in enumerate(QZ))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in RUB) + '</tbody></table></div>')
    lad = ('<div class="scroll-x"><table class="ws-table"><caption>Seven levels, L1 to L7</caption><thead><tr><th>Level</th><th>Role</th><th>You can</th><th>Notes and evidence</th></tr></thead><tbody>' +
           ''.join(f'<tr><th scope="row">L{i+1}</th><td>{e(f["roles"][i])}</td><td>{LADDER_VERB[i]}: {e(LADDER_DO[i].format(t=tl))}</td><td>{e(LADDER_NOTE[i])}</td></tr>' for i in range(7)) + '</tbody></table></div>')
    outs = [(m[1], m[3].split('. ')[0] + '.') for m in M]
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">8 modules · {hours} h</span><span class="pill">{e(p["domain"])}</span><span class="pill">{e(p["phase"])}</span></div>'
        '<ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(tx)}</li>' for b, tx in outs) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
        f'<div><h4>Task</h4><p>Run a 30 to 90 day pilot of a small {e(tl)} offer for real users in Canada and keep a full record.</p></div>'
        f'<div><h4>Condition</h4><p>About {hours} hours over 3 to 6 months. A free spreadsheet, a phone or computer, one mentor, a peer circle and at least five real users. Practice partners are agreed locally.</p></div>'
        '<div><h4>Standard</h4><p>Rules table complete with dated sources; cost sheet checked by a mentor; risk register and privacy note written; pilot reviewed with evidence; at least 70% on the ten-question check.</p></div></div>'
        f'<p><strong>Field:</strong> {e(f["label"])}. <strong>Who it is for:</strong> students, career changers, returners, newcomers to Canada, small-business starters. <strong>Requirements:</strong> none. <strong>Materials:</strong> lesson text, templates, rules table, cost sheet, risk register, rubric, ten-question check with answers.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: value statement, rules table, core task record, cost sheet, 4-week log, funnel, risk register and privacy note, pilot review and 12-month plan. A mentor and two peers mark it with this rubric. Pass: no criterion at "Not yet".</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + B.sec('alt', 'lv', 'levels', 'Seven levels, L1 to L7', '<p>Use this ladder to see where you are and what to show next. Each level builds on the one below.</p>' + lad)
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li>{e(j)}</li>' for j in f['jobs']) + '</ul>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', f'<p>The course is written for Canada. The same method works elsewhere; local rules, currency and levels change. Pick your place.</p>'
                    + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Currency: {L["cur"]}. Registering: {e(L["reg"])}. Data rule: {e(L["data"])}. Levels frame to cite: {e(L["frame"])}.</p></details>' for L in B.LOC)
                    + f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship course. Own wording. Teaching figures are examples, not market data. Not live.</p>'))
    fn = slug(t, n)
    B.page(fn, f'{t} (Canada flagship course)', f'{hours}-hour course on {tl} in Canada: eight modules, worked examples, rubric and ten-question check.', t, e(f'Run a real {tl} pilot in Canada: eight modules from user need to review, with rules, costs, risks and a seven-level ladder.'),
           body, B.crumb(('Courses', 'courses-hub.html'), ('Canada courses', 'canada-courses.html'), (t, None)), kicker=f'Canada · {p["phase"]}')
    return fn, hours, k

def main():
    out = []
    for p in PW: out.append((p,) + course(p))
    cards = ''.join(f'<li><a href="{fn}"><strong>{e(p["title"])}</strong></a> <span class="pill">{h} h</span> <span class="pill">{e(p["phase"])}</span></li>' for p, fn, h, k in out)
    B.page('canada-courses.html', 'Canada courses', 'Sixty-six Canada flagship courses.', 'Canada courses', 'Sixty-six flagship courses for Canada, each with eight modules, worked examples, a rubric, a ten-question check and a seven-level ladder.',
           B.sec('', 'cl', 'all courses', '66 courses', f'<ul class="clist">{cards}</ul>'), B.crumb(('Courses', 'courses-hub.html'), ('Canada courses', None)), kicker='Canada')
    print(len(out), 'courses')
main()
