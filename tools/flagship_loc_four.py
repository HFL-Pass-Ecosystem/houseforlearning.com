#!/usr/bin/env python3
"""Flagship LOCATION EDITIONS for the four places that use the global 75 list:
Hong Kong, Georgia/Israel, Cayman Islands, Mexico.
Own wording; generic titles; no brand, institution, teacher or person names; no fees beyond the standard learner price.
Rules named here are public law names only; every page tells the learner to check current rules with a local adviser.
Run: python3 tools/flagship_loc_four.py   -> site/learn-flagship-loc-<key>.html"""
import sys, pathlib, html, json, math
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = html.escape
ROOT = pathlib.Path(__file__).resolve().parent.parent
TOPICS = json.load(open(ROOT / 'data' / 'locations.json'))['global']['topics']
CHECK = 'Check current rules with a licensed local adviser before you act for real.'

# ---- the 75 global topics, grouped ----
CL = [
 ('A', 'Online selling and marketing', ['Lead Generation for Small Businesses','Online fulfilment business','Box Subscription Services','e- Commerce','E-Commerce Inventory Management','Affiliate Marketing','Online Car Dealership','Online Library','Online Tutoring Platform','Social Media Network','Influencer Marketing','Digital Marketing','Podcasting']),
 ('B', 'Technology and digital services', ['Robotics','Artificial Intelligence','Internet Infrastructure','IoT','Chatbots','Cloud Migration As A Service','DDoS Cyber Attack Prevention Security Company','Privacy Protection Firm','Biometric Sensor & Security Company','IT Service & Support','Mobile Application Testing Services','3D Printing','Tele & Video Conferencing','VR Live Events','Holographic Theater','360 Degree Photography','eSports','Virtual Event Planning Platform']),
 ('C', 'Health, care and wellbeing (regulated)', ['Selling PPE','Fitness Tech','Online Medical Supply and Equipment Provider','Online Therapy','Blockchain Health Record Digitization & Sharing Company','Virtual Medical Appointment System','DNA Analysis','Stem Cell Therapy','Nanotechnology In Medicine','Cryobank','Skincare Spa & Clinic','Senior At-Home Care','Veterinarian Business']),
 ('D', 'Mobility, aerial and space (regulated)', ['Space Tourism','Boat & Helicopter Tourism','Micro-Mobility Services','Car Sharing Business','Drones','Nanosatellites','Electric Car','Car Charging Stations','Portable Wireless Charging Station']),
 ('E', 'Energy, building and environment', ['Wind Energy','Biofuel Production','Solar Power','3D Home Building','Home Sharing','Greenhouse Gas Auditor','Plastic Alternatives','Control the Water']),
 ('F', 'Food and farming', ['Ghost Kitchens','Vertical Farming','Alternative Protein Food Products','Grow Meat In A Lab']),
 ('G', 'Money services (regulated)', ['P2P Lending Platform','Crowdfunding Platform','Wallet Payment Solution','Online Currency Exchange']),
 ('H', 'People and business support', ['Minority Businesses','Business Coach','Business Process Outsourcing Services','Coworking Spaces','Virtual Interior Design Consulting','Smart Apparel']),
]
_seen = {t for _, _, ts in CL for t in ts}
_extra = [t for t in TOPICS if t not in _seen]
CL[-1][2].extend(_extra)  # any topic not listed above goes to H, so all 75 are covered
def _n(s): return s.strip().lower()
_tn = {_n(t) for t in TOPICS}
for _, _, ts in CL: ts[:] = [t for t in ts if _n(t) in _tn]

def be(price, var, fixed):
    return math.ceil(fixed / (price - var))

LOCS = [
 dict(k='hk', LKEY='hk', name='Hong Kong', cur='HKD', unit='sessions', price=120, var=30, fixed=9000, item='a small online fitness-class business',
  tax='No sales tax or VAT; profits tax has a lower first-band rate, so read the current table', lang='Cantonese, Mandarin and English; write the page in Traditional Chinese and English',
  ctx=['A dense, trade-led city. Space is costly, so online and shared-space models fit well.',
       'Money moves fast by bank transfer and fast-payment apps; customers expect instant confirmation.',
       'Three languages in daily use: your page in two (Traditional Chinese and English) is the minimum.',
       'Close to the wider region: many small firms serve customers across the border, so shipping and data rules matter early.'],
  clus={'A':'Strong fit: customers shop on phones and expect delivery within a day. Compete on speed and service, not price.','B':'Fit for services sold to small firms: IT support, testing, privacy. Offices are small, so offer monthly plans.','C':'Regulated. Practise only with the right licence and registration. This course teaches planning, not practice.','D':'Regulated and space-limited. Plan around airspace and road rules; start with charging points or shared mobility on paper.','E':'High-rise living drives smart-energy, water and home-sharing ideas. Check building rules and landlord approval first.','F':'Land is scarce: vertical farms, ghost kitchens and alternative proteins suit small floor areas.','G':'Regulated money services. Plan as a partner of a licensed firm; never hold customer money without a licence.','H':'Coaching, coworking and outsourcing fit well; many one-person firms need flexible support.'},
  reg=['Register the business with the tax authority (business registration) before you trade; companies are also listed with the companies registry.','Choose sole trader, partnership or company: a company separates personal and business risk, but has yearly filing duties.','Some activities need an extra licence (food, health, money, education centres). List yours before you take a first order.','Keep a registered address and a named contact; a shared-office address is common for a first year.'],
  data=['The personal data ordinance sets six principles, from collection and use to security and access.','Say in plain words what you collect and why; give a way to see and correct it.','Direct marketing needs a clear choice for the customer to say no; keep that record.','Sending data outside the city may need a safeguard; check with a local expert and list every tool that stores customer data.'],
  cust=['Channels: messaging apps, social media and marketplaces are where customers already are.','Language: show both languages side by side; keep prices in HKD only.','Payments: bank transfer and fast-payment apps first; give an instant receipt.','Trust: put the business registration number, a real address and a refund note on every page.'],
  people=['Employers usually pay a compulsory retirement-fund contribution for staff; budget it from the first hire.','Written terms, rest days and paid leave follow the employment law; keep signed copies.','Freelancers are common; write scope, price and date in one page before work starts.','Partner with a college, training body or business chamber to find helpers and to practise.'],
  jobs=[('Online shop operator','runs product pages, orders and delivery for a small seller'),('Digital marketing assistant','plans posts, reports results and tests offers'),('IT support technician','fixes and monitors small-office systems'),('Coworking community coordinator','runs events and member support'),('Business coach assistant','prepares plans, trackers and follow-ups for clients'),('Compliance and data assistant','keeps privacy notices and records current')],
  ladder=['Know the local words for licence, registration, invoice and refund in two languages.','Describe the city market and name three sectors from the list that fit it.','Register a practice business on paper and list its first three licences.','Run a small sector plan with numbers in HKD and one real customer test.','Specialise in one cluster and write its compliance checklist.','Lead a team plan with staff, partner and data safeguards.','Mentor others, audit a plan against the ordinance and publish a local case.'],
  caution='A city with high costs: test one small offer before you sign a lease.'),
 dict(k='ge', LKEY='ge', name='Georgia and Israel', cur='GEL or ILS', curx='GEL', unit='boxes', price=60, var=35, fixed=3000, item='a small box-subscription business (shown in GEL)',
  tax='Local sales tax and income tax differ in each country; a small-business regime may apply in one and a dealer type in the other', lang='Georgian, Hebrew, Arabic, Russian and English depending on the country and customer',
  ctx=['Two different countries, two sets of rules. Pick the country first, then use that country’s list in every module.','Both have strong technology and start-up activity; many small firms sell abroad from day one.','Languages differ by customer: write the page in the local language plus English.','Public holidays and the working week differ; put the working days on every delivery promise.'],
  clus={'A':'Strong fit in both: small firms sell online to the region. Check delivery rules and returns for each country.','B':'Both countries have a technology culture: security, privacy, cloud and testing services sell to small firms.','C':'Regulated in both. Practise only under the right licence. This course teaches planning, not practice.','D':'Regulated. Airspace and port rules are strict in the region; plan on paper and with a licensed partner.','E':'Sunny and windy sites make energy services a fit; hold permits and grid rules before any build.','F':'Strong farming and food tradition: ghost kitchens, vertical farms and food science fit well; check food-safety rules.','G':'Regulated money services; plan as a partner of a licensed firm.','H':'Coaching, coworking and outsourcing fit; many founders need flexible support in more than one language.'},
  reg=['Name the country first. Each has its own registration route: an individual-entrepreneur or small-business type in one, a dealer type or a company in the other.','Compare the types by tax, liability and filing work before you choose; write the table.','Licences vary by activity (food, health, money, education centres); list yours before the first order.','Keep a local address and a named contact in the country where you trade.'],
  data=['Both countries have a personal-data law; read the one for the country where the customer lives.','Say in plain words what you collect and why; give a way to see and correct it.','Keep marketing consent records; customers must be able to say no.','Moving data between the two countries or to a third place may need a safeguard; check with a local expert.'],
  cust=['Channels: messaging apps and social media are strong in both; add a local marketplace.','Language: one page in the local language, one in English; never mix currencies on one price.','Payments: bank transfer and local payment methods; show the currency code next to every price.','Trust: registration number, address, delivery days and a refund note on every page.'],
  people=['Employment rules, notice and social contributions differ; read the one for the country of the worker.','Written terms and signed copies for every helper, even part-time.','Freelancers are common: write scope, price, language and date in one page.','Partner with a local college, chamber or training body to find helpers and to practise.'],
  jobs=[('Subscription shop operator','runs boxes, orders and delivery for a small seller'),('Export assistant','prepares documents and delivery notes for cross-border sales'),('Security and privacy assistant','keeps customer data safe in small firms'),('Food business assistant','plans menus, safety logs and orders'),('Solar and energy assistant','prepares site data and quotes'),('Business coach assistant','prepares plans and follow-ups for clients')],
  ladder=['Know the words for licence, registration, invoice and refund in the local language and in English.','Describe both markets in one page and name the differences.','Register a practice business in one country on paper and list its first licences.','Run a small sector plan with numbers in the local currency and one customer test.','Specialise in one cluster and write its checklist for each country.','Lead a team plan that works in both countries.','Mentor others, audit plans against both countries’ rules and publish a local case.'],
  caution='The final country choice is still to be confirmed. Keep every page tagged by country.'),
 dict(k='ky', LKEY='ky', name='Cayman Islands', cur='KYD', unit='boxes', price=45, var=28, fixed=3400, item='a small box-subscription business',
  tax='No income tax or sales tax; import duty and fees are the main costs; check the current rates', lang='English; Spanish helps with some staff and customers',
  ctx=['A small island economy built on finance, tourism and construction. Most goods are imported, so freight and duty shape every price.','No income tax, so costs sit in duty, licence fees, rent and pay. Work out landed cost for every item.','Many workers are on work permits; hiring rules favour local hiring, so check them.','Small market: one strong niche beats a broad range. Word of mouth is powerful.'],
  clus={'A':'Fit for imported-goods retail and subscriptions; plan duty, freight and delivery times by sea or air.','B':'Fit for services to firms and finance companies: security, privacy, cloud, testing and IT support.','C':'Regulated. Practise only with the right licence and registration. This course teaches planning, not practice.','D':'Regulated; airspace, harbour and road rules are strict. Boat and charging ideas fit tourism; plan on paper first.','E':'Strong fit for solar, water and plastic alternatives: costly imported energy and fragile reefs raise the value.','F':'Strong fit for vertical farming and ghost kitchens: imported food is costly and land is limited.','G':'Regulated money services; plan as a partner of a licensed firm only.','H':'Coaching, coworking and outsourcing fit a finance-led island with many small advisers.'},
  reg=['A trade and business licence is needed before trading; the type depends on the activity and on who owns the business.','Ownership and work-permit rules can affect who may start and who may be hired; check them first.','Companies are registered with the registry; keep the registered office and yearly filings current.','Some activities (food, health, money, tourism) need extra approval; list yours before the first order.'],
  data=['The data protection law sets eight principles; read the plain-language guide from the regulator.','Say in plain words what you collect and why; give a way to see and correct it.','Report a data breach quickly and keep an incident log.','Many customers are overseas finance and tourism clients: keep a list of every place customer data goes.'],
  cust=['Channels: word of mouth, messaging apps, hotel and tourism partners, local social groups.','Language: English first; add Spanish for community offers.','Payments: bank transfer and local payment methods; show prices in KYD with landed cost explained.','Trust: licence number, local address, delivery days and a refund note on every page.'],
  people=['Work permits and local-hiring rules apply; plan time for approvals before a start date.','Pension and health-insurance contributions apply to staff; check the rates and budget them.','Seasonal tourism swings need flexible staffing; write a seasonal roster.','Partner with a local training body or business chamber to find helpers and to practise.'],
  jobs=[('Island retail and delivery operator','runs imported-goods sales, duty and delivery'),('Tourism services assistant','plans boat, tour and event bookings'),('Cybersecurity and privacy assistant','protects customer data for small firms'),('Solar and water assistant','prepares surveys and quotes'),('Food and ghost-kitchen assistant','plans menus, safety logs and orders'),('Compliance assistant','keeps licences, records and filings current')],
  ladder=['Know the words for licence, duty, work permit and invoice.','Describe the island market and name three sectors that fit it.','Register a practice business on paper and list its licences and permits.','Run a small plan with landed-cost numbers in KYD and one customer test.','Specialise in one cluster and write its compliance checklist.','Lead a team plan with permits, partners and data safeguards.','Mentor others, audit plans against local rules and publish a local case.'],
  caution='Import duty can change a price by a lot: always work in landed cost.'),
 dict(k='mx', LKEY='mx', name='Mexico', cur='MXN', unit='boxes', price=450, var=270, fixed=27000, item='a small box-subscription business',
  tax='Income tax plus a sales tax (IVA); a simple regime may fit small firms, and most sales need an electronic invoice', lang='Spanish first; add English for tourism and trade customers',
  ctx=['A large market with strong regional differences. Start in one city and one niche.','Many customers use bank transfers, cash-payment points and cards; a lot of buying is on messaging apps.','Electronic invoices are part of daily trade: learn them in week one.','Close to the northern trading partners: near-shoring creates demand for services, testing and training.'],
  clus={'A':'Strong fit: messaging-app selling and marketplaces. Offer cash-payment and bank-transfer options.','B':'Strong fit: near-shoring means firms need IT support, testing, security and cloud services in Spanish.','C':'Regulated. Practise only with the right licence and registration. This course teaches planning, not practice.','D':'Regulated; airspace and transport rules apply. Charging points and shared mobility suit big cities.','E':'Strong fit: sunshine, wind and water stress make solar and water services valuable. Hold permits first.','F':'Strong fit: food and farming are central; check health-risk rules for food and alternative proteins.','G':'Regulated money services; plan as a partner of a licensed firm only.','H':'Coaching, coworking and outsourcing fit a young workforce; many founders need support in Spanish.'},
  reg=['Register with the tax authority (a tax ID) before you invoice; choose sole trader or company.','A simplified small-taxpayer regime may fit a first year; read the current limits.','Issue electronic invoices as the tax rules require; learn the tool before the first customer.','Some activities need extra licences (food, health, tourism, money); list yours before the first order.'],
  data=['The private-sector data law needs a privacy notice (check the current text): who you are, what you collect, why and how to correct it.','Customers may ask to see, correct, remove or object to use of their data; set a reply time.','Keep marketing consent records; offer a clear way to stop messages.','Keep a list of every tool that stores customer data, including messaging apps.'],
  cust=['Channels: messaging apps, social media and marketplaces; local fairs and markets for a first test.','Language: Spanish first, in plain words; add English only if customers ask.','Payments: bank transfer, cards and cash-payment points; show prices with the sales tax clearly.','Trust: tax ID, address, delivery days and a refund note on every page; consumer rules apply.'],
  people=['Employers register staff for social security and pay the year-end bonus; budget both.','Staff may share in profits; small and new firms can differ, so read the rule before you hire.','Written contracts and signed copies for every helper, even part-time.','Partner with a technical college or business chamber to find helpers and to practise.'],
  jobs=[('Online seller','runs product pages, orders, invoices and delivery'),('Digital marketing assistant','plans posts and reports results in Spanish'),('IT and testing technician','supports near-shoring firms with testing and support'),('Solar and water assistant','prepares surveys and quotes'),('Food business assistant','plans menus, safety logs and orders'),('Accounting and invoice assistant','issues invoices and keeps records current')],
  ladder=['Know the words for tax ID, invoice, privacy notice and refund in Spanish.','Describe the market in one page and name three sectors that fit it.','Register a practice business on paper and issue a practice invoice.','Run a small plan with numbers in MXN, sales tax included, and one customer test.','Specialise in one cluster and write its compliance checklist.','Lead a team plan with staff costs, partners and data safeguards.','Mentor others, audit plans against local rules and publish a local case.'],
  caution='A large country: start in one city, test one offer, then grow.'),
]
THEMES = [('Read your local market','Understand',4),('Choose your sector','Analyse',4),('Register and license','Apply',4),('Protect data and customers','Apply',3),('Find and serve customers','Create',4),('Price, tax and money','Evaluate',4),('People and partners','Apply',3),('Launch plan and review','Create',4)]

def money(L):
    p, v, f = L['price'], L['var'], L['fixed']
    cm = p - v
    be_u = be(p, v, f)
    return p, v, f, cm, be_u

def modules(L):
    p, v, f, cm, bu = money(L)
    cur = L['cur']
    cl = ''.join(f'{k}: {n}; ' for k, n, _ in CL)
    M = []
    M.append((THEMES[0][0], THEMES[0][1], THEMES[0][2],
      f'Every plan starts with the place. Read {L["name"]} as your customer does before you choose a sector.', L['ctx'],
      f'Market page for {L["name"]}: size in one line, three languages or fewer, main payment methods, three public holidays that affect delivery, and one risk. Each line has a source you can open and a date.',
      'Write a one-page market page with sources and dates. Ask two local people to correct it.',
      'Every line has a source and a date; two local readers confirm the facts; one risk is named with a response.'))
    M.append((THEMES[1][0], THEMES[1][1], THEMES[1][2],
      f'The global list has {len(TOPICS)} sectors in {len(CL)} clusters. Pick by local fit, not by fashion.',
      [f'Cluster {k}, {n}: {L["clus"][k]}' for k, n, _ in CL[:5]] + [f'Cluster {k}, {n}: {L["clus"][k]}' for k, n, _ in CL[5:]],
      f'Scoring example: pick three sectors, score each 1 to 5 on local demand, skills you hold, start-up cost, rules and partner access. A sector that scores 5 on demand but 1 on rules is a later project, not a first one. Pick the sector with the highest total and a rules score of 3 or more.',
      'Score six sectors from at least three clusters. Choose one and write the reason in three lines.',
      'Six sectors scored on five criteria; the choice has a stated reason; any regulated sector is marked as planning only.'))
    M.append((THEMES[2][0], THEMES[2][1], THEMES[2][2],
      f'Rules differ by place. {CHECK}', L['reg'],
      f'Licence list for {L["item"]}: registration type, tax registration, address, any activity licence, insurance. Next to each, write who issues it, what it costs in {cur} (from their public page), how long it takes, and the date you checked.',
      'Build a licence table for your chosen sector with issuer, cost, time and the date checked. Do not apply; this is a plan.',
      'Table is complete; every row has a public source; the order of steps is logical; one adviser question is written.'))
    M.append((THEMES[3][0], THEMES[3][1], THEMES[3][2],
      'Trust is the real product. Protect customer data and keep your promises in writing.', L['data'],
      'Privacy notice in five lines: who we are; what we collect; why; who sees it; how to ask for a copy, correction or removal. Plus a data map listing each tool and where it stores data.',
      'Write the five-line notice and a data map for your plan. Ask a peer to find any gap.',
      'Notice is plain words; data map lists every tool; refund and complaint steps are written and dated.'))
    M.append((THEMES[4][0], THEMES[4][1], THEMES[4][2],
      f'Go where your customers already are, in the language they use. Language: {L["lang"]}.', L['cust'],
      f'Test plan: show the offer to 20 real people through two channels over two weeks; count enquiries, replies and first orders. Example result: 20 shown, 6 enquiries, 2 orders: a 10% order rate. Change one thing (price or wording) and test again.',
      'Run a two-channel test with 20 people. Record results in a table and write the next change.',
      'Test has a start and end date; results are counted, not guessed; one change is chosen and justified.'))
    unit = L['unit']
    utxt = f'{bu} units per month (one unit = {unit})' if L.get('unit_one') else f'{bu} {unit} per month'
    M.append((THEMES[5][0], THEMES[5][1], THEMES[5][2],
      f'Know your numbers in {cur}. Tax rule in one line: {L["tax"]}.',
      [f'Write {cur} next to every number.', 'Contribution per unit = price minus the cost of each unit.', 'Break-even units = fixed monthly cost divided by contribution per unit; round up.', 'Add tax and duty explicitly; never bury them in a price.', 'Check against a worse case: if sales are 25% lower, do you still cover costs?'],
      f'For {L["item"]} (all amounts are estimates): price {L.get("curx",cur)} {p:,} per unit, cost {L.get("curx",cur)} {v:,} per unit, fixed cost {L.get("curx",cur)} {f:,} per month. Contribution = {p:,} - {v:,} = {cm:,}. Break-even = {f:,} / {cm:,} = {f/cm:.1f}, so {utxt}. If sales fall 25% from {bu*2}, you sell {int(bu*2*0.75)} and the margin is {int(bu*2*0.75)*cm - f:,}.' + risk_note(p, v, f),
      f'Build your own sheet in {cur}: price, unit cost, fixed cost, contribution, break-even and a 25% worse case. Put the tax and duty rules in a separate line with a source.',
      f'Sheet has all six lines in {cur}; arithmetic is checked by a peer; the worse case is shown.'))
    M.append((THEMES[6][0], THEMES[6][1], THEMES[6][2],
      'Plans become real through people. Hire, partner and write every promise down.', L['people'],
      f'Role card for a first helper: tasks, hours, pay in {cur}, trial period, review date, and one measure of success. Signed by both sides.',
      'Write one role card and one partner letter (what each side gives). Role-play a first meeting for 10 minutes.',
      'Role card has pay in local currency, hours and a review date; partner letter is balanced; both are signed copies.'))
    M.append((THEMES[7][0], THEMES[7][1], THEMES[7][2],
      'Finish with a one-page launch plan and a plan to review it every month.',
      ['Dates: first test, first order, first review.', 'One measure per week: enquiries, orders or revenue; pick one.', 'A monthly review: what we planned, what happened, what we change.', 'Keep a risk list with a response for each; include a rules change.', f'Local caution: {L["caution"]}'],
      f'Launch page for {L["name"]}: Week 1 licence table done; Week 2 test with 20 people; Week 3 numbers sheet checked; Week 4 launch decision with a go or no-go rule written in advance.',
      'Write the launch page and present it to two people for 10 minutes. Record their questions and your answers.',
      'Plan has dates, one weekly measure, a go or no-go rule and a risk list; presenter answers three questions with evidence.'))
    return M

def quiz(L):
    p, v, f, cm, bu = money(L)
    return [
     (f'Why read the place before choosing a sector in {L["name"]}?', 'Local market, languages, payments and rules decide what fits.'),
     ('How many sectors and clusters are on the global list?', f'{len(TOPICS)} sectors in {len(CL)} clusters.'),
     ('Which clusters are marked regulated?', 'Health and care, mobility and aerial, and money services.'),
     ('What do you do if a sector is regulated and you hold no licence?', 'Treat it as planning only and partner with a licensed firm.'),
     ('Name three items in a licence table.', 'Issuer, cost, time, and the date checked (any three).'),
     ('Name the five lines of a privacy notice.', 'Who we are, what we collect, why, who sees it, how to ask for a copy, correction or removal.'),
     ('How do you test an offer?', 'Show it to about 20 real people through two channels and count enquiries and orders.'),
     (f'Price {L.get("curx", L["cur"])} {p:,}, unit cost {v:,}, fixed {f:,}. What is the contribution per unit?', f'{p:,} - {v:,} = {cm:,}.'),
     (f'With the same numbers, what is break-even per month?', f'{f:,} / {cm:,} = {f/cm:.1f}, rounded up to {bu:,}.'),
     ('What goes on a role card?', 'Tasks, hours, pay, trial period, review date and one measure of success.')]

# which module each of the ten checks belongs to (1-based), from the question content
QMOD = [1, 2, 3, 3, 3, 4, 5, 6, 6, 7]
def risk_note(p, v, f):
    """If the price falls 25 per cent, say plainly when it drops to or below the unit cost (no break-even)."""
    lo = p * 3 / 4
    if lo > v: return ''
    return f' Risk: if the price falls 25% to {lo:,.0f}, it is not above the unit cost of {v:,}, so every sale loses money and there is no break-even; plan a price floor or a lower cost before you launch.'

def tag_quiz(q, mods, qmap=None):
    """Append '(Covered in module N: title. To pass that module: standard.)' to each model answer."""
    qm = list(QMOD)
    for i, n in (qmap or {}).items(): qm[i] = n
    out = []
    for (a, b), n in zip(q, qm):
        m = mods[n - 1]
        out.append((a, b.rstrip() + f' (Covered in module {n}: {m[0]}. To pass that module: {m[7].rstrip().rstrip(".")}.)'))
    return out

def rubric(L):
    return [('Local fit','Generic page','Local facts with sources','Local facts, sources, dates and two local readers'),
            ('Rules','Rules ignored','Licence table with sources','Table, adviser questions and dated checks'),
            ('Numbers','No numbers','All lines in local currency','Checked by a peer with a worse case'),
            ('Customer proof','No test','20-person test counted','Test, result, change and re-test'),
            ('People and trust','No notice','Privacy notice and role card','Notice, data map, signed role card and partner letter')]

def ladder(L, extra='', place=False):
    names = ['L1 Basic','L2 Awareness','L3 Foundation','L4 Practitioner','L5 Specialist','L6 Advanced','L7 Super expert']
    ev = ['A short glossary in two languages.','A one-page market page.','A practice registration table.','A numbers sheet and a 20-person test.','A cluster checklist with sources.','A team plan with people, partners and data.','A published local case and a plan audit.']
    if place:
        import loc_ladder as _LL
        extra = _LL.place_slides_html(L, e, names, ev)
    rows = ''.join(f'<tr><th scope="row">{names[i]}</th><td>{e(L["ladder"][i])}</td><td>{e(ev[i])}</td></tr>' for i in range(7))
    return ('<div class="scroll-x"><table class="ws-table"><caption>Ladder L1 to L7 for this location (this course covers L1 to L4; L5 to L7 follow in the sector courses)</caption>'
            '<thead><tr><th>Level</th><th>Can do</th><th>Evidence</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
            '<p class="ws-note">Notes: each level uses action verbs (name, describe, register, run, specialise, lead, mentor). A level is passed only when its evidence is checked by a mentor and a peer.</p>' + extra)

def clusters_html(L):
    out = ''
    for k, n, ts in CL:
        out += f'<details class="loc"><summary>Cluster {k}: {e(n)} ({len(ts)} sectors)</summary><p><strong>Local angle.</strong> {e(L["clus"][k])}</p><p>{e("; ".join(ts))}.</p></details>'
    return out

def build(L):
    mods = ''
    total = 0
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(modules(L), 1):
        total += h
        mods += (f'<details class="mod" {"open" if i == 1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>'
                 + ''.join(f'<li>{e(x)}</li>' for x in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    qz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(tag_quiz(quiz(L), modules(L))))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(m)}</td><td>{e(d)}</td></tr>' for a, b, m, d in rubric(L)) + '</tbody></table></div>')
    import loc_ladder as _LL
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in L['jobs']) + '</ul>' + _LL.roles_html('small business', e)
    outs = [('Understand', f'Explain the {L["name"]} market in one page with sources.'), ('Analyse', 'Score sectors from the global list for local fit.'), ('Apply', 'Build a licence table and a privacy notice.'),
            ('Create', 'Run a customer test and a launch plan.'), ('Evaluate', f'Judge a plan with a worse-case sheet in {L["cur"]}.')]
    top = (f'<div class="cb-facts"><span class="pill lv">L1 to L4 location edition</span><span class="pill">8 modules, {total} h plus practice</span><span class="pill">About 6 weeks part-time</span></div>')
    about = B.sec('', 'ab', 'about this course', f'{L["name"]} edition: what you will be able to do', top +
        f'<p class="kit-intro">The global course list applied to {e(L["name"])}: local context, rules, jobs and examples, with numbers in {e(L["cur"])}.</p><ul class="blm">'
        + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
        f'<div><h4>Task</h4><p>Plan a small business from the global list for {e(L["name"])}, from market page to launch plan, with a checked licence table and numbers.</p></div>'
        '<div><h4>Condition</h4><p>About six weeks part-time. Own phone or computer, public sources, two local readers and a mentor for the final review.</p></div>'
        '<div><h4>Standard</h4><p>All module standards are met; every claim has a public source and a date; a mentor and one peer mark the evidence \'Meets\' or better.</p></div></div>'
        f'<p><strong>Who it is for:</strong> students, career changers, returners, small-business founders and trainers. <strong>Requirements:</strong> none. <strong>Materials:</strong> lesson text, worked examples, tables, rubric, 10-question check. <strong>Languages:</strong> {e(L["lang"])}.</p>'
        f'<p class="ws-note"><strong>Safety and limits:</strong> {e(CHECK)} Regulated sectors are planning only; this course does not give legal, tax, medical or financial advice.</p>')
    body = (about + B.sec('alt', 'cl', 'the global list', f'The {len(TOPICS)} global sectors, seen from {L["name"]}', clusters_html(L))
            + B.sec('', 'md', 'lesson by lesson', '8 modules with worked examples', mods)
            + B.sec('alt', 'as', 'assessment', 'How you are checked', f'<p>Evidence: market page, scored sector list, licence table, privacy notice and data map, test results, numbers sheet in {e(L["cur"])}, role card, launch plan. A mentor and one peer mark it with this rubric. Pass: no criterion at \'Not yet\', and at least 8 of 10 check answers right.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{qz}')
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', jobs + f'<p>Next courses: the sector courses from the global list, at L5 to L7.</p>')
            + B.sec('alt', 'ld', 'ladder', 'Ladder L1 to L7', ladder(L, place=True))
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship location edition. Own wording; no outside brand, school or person names. Not live.</p><p><a class="btn" href="courses-hub.html">All courses</a> <a class="btn btn-ghost" href="join.html">Join</a></p>'))
    B.page(f'learn-flagship-loc-{L["k"]}.html', f'{L["name"]} edition: starting a business from the global list', f'Global course list applied to {L["name"]}: local context, rules, jobs and worked examples in {L["cur"]}.', f'{L["name"]} edition',
           e(f'The global sector list applied to {L["name"]}: local context, rules, jobs and examples, in eight modules.'), body,
           B.crumb(('Courses', 'courses-hub.html'), (f'{L["name"]} edition', None)), kicker=f'flagship location edition · {L["k"].upper()}')

if __name__ == '__main__':
    for L in LOCS: build(L)
    print('built', len(LOCS), 'pages;', sum(len(ts) for _, _, ts in CL), 'topics clustered of', len(TOPICS))
