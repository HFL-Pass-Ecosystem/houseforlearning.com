# Ladder levels L1-L7 and task/condition/standard for 25 sectors (set B).
def _m(rows):
    return [(t, b, "Notes: " + n) for t, b, n in rows]

LAD_B = {}
TCS_B = {}

LAD_B["biometric-sensor-security-company"] = _m([
 ("Name biometric sensor types", "Name 4 sensor types (fingerprint, face, iris, palm) and state one use and one weakness of each.", "Show four sample readers or photos and ask the learner to label each. Check that every weakness is real, such as wet fingers failing."),
 ("Biometric data and consent", "Describe what makes biometric data sensitive and list 5 points a consent notice must cover before enrolment.", "Give a mock notice with 2 gaps and ask the learner to spot them. Remind them to check local rules with an expert."),
 ("Plan a door-access pilot", "Plan a pilot for 1 office, 20 staff and 1 door, with a reader type, a fallback method and a 4-week test window.", "Ask for a one-page plan. Check that it names a non-biometric fallback for staff who opt out."),
 ("Run a false accept test", "Run 100 test scans on one reader and record false accepts and false rejects, then state both rates as percentages.", "Use a borrowed reader and 5 volunteers. Check the tally sheet adds up to 100."),
 ("Design secure template storage", "Design storage for templates that uses encryption, a retention limit of 90 days after exit and a named access list of 3 roles.", "Review a diagram with the learner and ask who can read a template. Any answer of everyone fails."),
 ("Analyse a spoofing incident", "Analyse a mock spoof attempt and rank 5 controls (liveness check, dual factor, log review, alerts, lockout) by cost and effect.", "Hand over a short incident log. Check that the ranking is reasoned and that the root cause is named."),
 ("Lead a site rollout", "Lead a rollout across 3 sites with a data impact review, staff briefing, 30-day tuning and a signed exit plan for removing data.", "Role-play the briefing with a peer as a worried employee. Check the answers are honest and the review is filed."),
])
TCS_B["biometric-sensor-security-company"] = ("a one-door biometric access pilot pack with consent notice, test results and data-handling plan", "Done in 2 weeks using a borrowed reader and sample data, then reviewed by a mentor and a peer; check local rules with an expert before using real staff data.", "The pack has a consent notice, a 100-scan test with both error rates, a fallback method and a retention limit; 6 of 7 review items pass.")

LAD_B["skincare-spa-clinic"] = _m([
 ("Name skin types and services", "Name the 5 common skin types and match each to one suitable spa service from a menu of 5.", "Show five skin photos or cards and ask for a match. Check that oily skin is not given a heavy scrub."),
 ("Hygiene and safe practice", "Describe 6 hygiene steps between clients and state which tasks need a licensed clinician.", "Walk the learner through a mock room reset and ask what is missed. Check local rules with an expert for licensing."),
 ("Build a service menu", "Build a menu of 5 services with time, price in {cur} and one skin-type warning each.", "Review the printed menu. Check that every price covers products and time, with a margin shown."),
 ("Run a client consultation", "Run a 10-minute consultation with a 12-item form and record allergies, medicines and goals before any treatment.", "A peer plays the client with a nut-oil allergy. Check that the learner catches it and changes the product."),
 ("Design a treatment room flow", "Design a day plan for 1 room and 2 staff covering 8 bookings, with 15-minute resets and a stock check.", "Give a messy booking list. Check that no two clients overlap and that resets are in place."),
 ("Analyse service margins", "Analyse 5 services by margin per hour and drop or reprice the lowest one with a written reason.", "Provide product costs and times. Check the learner finds the weakest service using real arithmetic."),
 ("Lead a clinic partnership", "Lead a plan to add clinic care with a licensed partner, covering a referral rule, a consent form and an incident log.", "Role-play the partner meeting with a mentor. Check that clinical tasks stay with licensed staff only."),
])
TCS_B["skincare-spa-clinic"] = ("a spa service menu with a consultation form and a one-day room schedule", "Done in one week using sample prices and a mock client, checked by a mentor and a peer; licensed care needs a licensed partner and local rules checked with an expert.", "The menu lists 5 services with time, price and warnings, the form has 12 items, and the schedule shows 8 bookings with resets and no overlaps.")

LAD_B["biofuel-production"] = _m([
 ("Name biofuel feedstocks", "Name 5 feedstocks (used oil, crop waste, sugar crops, algae, tallow) and state one pro and one con for each.", "Show five sample cards and ask for a quick sort by local supply. Check that used oil is placed as the easiest start."),
 ("Fuel safety and rules", "Describe 6 safety rules for handling methanol, oil and heat, and name the permits a plant may need.", "Show a photo of a cluttered store and ask for hazards. Check local rules with an expert for permits and storage."),
 ("Plan a small pilot", "Plan a pilot of 200 litres of oil per week from 10 restaurants, with a collection route and a storage tank size.", "Ask for a map and weekly sheet. Check the route covers 10 stops and the tank holds one week plus a buffer."),
 ("Test fuel quality", "Run a quality check on 3 batches using water content, acid value and clarity, and record pass or fail against the target.", "Give three sample jars and a checklist. Check that a cloudy batch is marked fail with a reason."),
 ("Design the process and mass balance", "Design a batch process and a mass balance showing oil in, fuel out and glycerol, with yield as a percentage.", "Check that the inputs and outputs add up within 5 percent. A yield over 100 percent fails."),
 ("Analyse cost per litre", "Analyse cost per litre in {cur} including feedstock, power, chemicals and labour, and find the one cost to cut first.", "Provide a cost sheet. Check the learner works out the answer by sums and not by guess."),
 ("Lead scale-up and audit", "Lead a scale-up plan to 5 times the volume with a safety audit, an emissions record and a supplier contract review.", "A mentor plays an inspector. Check the audit has dated findings and an action owner."),
])
TCS_B["biofuel-production"] = ("a pilot plan with a batch mass balance, quality log and cost per litre", "Done in 10 days from sample data, then reviewed by a mentor and a peer; check local rules with an expert for fuel permits and safe storage.", "Mass balance closes within 5 percent, 3 batches are tested, cost per litre is shown in {cur}, and 6 safety rules are listed.")

LAD_B["grow-meat-in-a-lab"] = _m([
 ("Name the lab-meat steps", "Name the 5 main steps (cell source, growth medium, bioreactor, scaffold, harvest) and say what each one does.", "Show a flow card with steps shuffled and ask for the right order. Check that the learner explains medium as the food for cells."),
 ("Food safety and approval", "Describe 5 safety checks and the approval path a new food must follow before sale in {place}.", "Ask for the path in the learner's words. Check local rules with an expert, because approval differs by country."),
 ("Frame a pilot question", "Plan a pilot question, such as making 10 kg of mince blend at a set cost per kg, and name one partner lab.", "Review a one-page brief. Check the question has a number and a deadline."),
 ("Run a cost model", "Run a cost model for medium, energy, labour and equipment per kg and find the largest cost share.", "Give a sheet of costs. Check that the shares add to 100 percent and the largest item is named."),
 ("Design a tasting test", "Design a blind taste test with 30 tasters, 3 samples and a 5-point score, with allergy notices on every form.", "Check the plan has a control sample and a consent line for each taster."),
 ("Analyse scale-up risks", "Analyse 5 scale-up risks such as contamination, growth rate and medium cost, and rank them by impact and chance.", "Hand over a failed-batch note. Check the learner finds contamination and proposes one control."),
 ("Lead a partner and regulator plan", "Lead a 12-month plan with a lab partner, a safety dossier, a pricing path and a consumer information plan.", "A mentor plays a regulator and asks 5 questions. Check answers cite records, not claims."),
])
TCS_B["grow-meat-in-a-lab"] = ("a pilot brief with a process flow, a cost-per-kg model and a blind taste test plan", "Done in two weeks from open reading and sample figures, reviewed by a mentor and a peer; check local rules with an expert for food approval.", "The brief has one measurable question, a cost model whose shares total 100 percent, 5 ranked risks and a 30-taster test plan.")

LAD_B["virtual-event-planning-platform"] = _m([
 ("Name virtual event formats", "Name 5 formats (webinar, workshop, expo, summit, demo day) and match each to one audience need.", "Give three buyer cases and ask for the best format. Check that the reason is stated."),
 ("Platform features and privacy", "Describe 8 core features such as registration, chat, polls and replay, and state what attendee data you collect and why.", "Show a sign-up form with 12 fields and ask which are needed. Check local rules with an expert for data law."),
 ("Plan one live event", "Plan a 60-minute event for 100 attendees with a run sheet, 3 speakers and a 15-minute tech test.", "Review the run sheet minute by minute. Check there is a backup plan for a dropped speaker."),
 ("Run a rehearsal and measure", "Run a rehearsal with 10 testers and record load time, audio faults and the drop-off point.", "Give a test log. Check that three numbers are logged and one fix is made."),
 ("Design ticket and pricing tiers", "Design 3 ticket tiers in {cur} with a margin per tier and a break-even attendance figure.", "Check the break-even sum by hand. A tier that loses money per head fails."),
 ("Analyse event data", "Analyse registration, attendance and replay numbers from 3 events, and give 2 changes that could lift attendance by a set percent.", "Hand over a table. Check the show-up rate is worked out correctly."),
 ("Lead a multi-event season", "Lead a 6-event season with a sponsor pack, a support rota and a post-event report within 5 days of each event.", "A peer plays a sponsor. Check the pack has real numbers and a clear promise."),
])
TCS_B["virtual-event-planning-platform"] = ("a run sheet, ticket plan and rehearsal report for one virtual event", "Done in one week using a free video tool and 10 testers, checked by a mentor and a peer; check local rules with an expert for attendee data.", "Run sheet covers 60 minutes with a backup plan, 3 tiers show a break-even figure, and the rehearsal log has 3 measured numbers.")

LAD_B["vr-live-events"] = _m([
 ("Name VR event parts", "Name the 6 parts of a VR event (headset, world, audio, host, platform, support) and say what each does.", "Show a setup photo and ask the learner to point to each part. Check that audio is not missed."),
 ("Comfort and safety basics", "Describe 6 comfort and safety rules, such as session limits, motion sickness and age limits, for headset users.", "Ask how long a first session should be. Check the answer includes breaks and an exit option."),
 ("Plan a pilot class", "Plan a pilot of 1 class for 30 people on headsets with a join guide, 2 helpers and a 20-minute test.", "Review the join guide. Check a first-time user can enter in under 5 minutes."),
 ("Run a test session", "Run a test with 8 users and log join time, comfort scores and faults, then fix the top fault.", "Give a score sheet. Check the learner reports numbers and the fix is tested again."),
 ("Design ticket and access models", "Compare 3 models (ticket, pass, free with sponsor) and pick one with a break-even count in {cur}.", "Check the sum by hand. Ask why the other two were not picked."),
 ("Analyse retention", "Analyse attendance across 4 events and find the minute where most users leave, then propose one change.", "Provide a drop-off chart. Check the learner reads it correctly."),
 ("Lead a live series", "Lead a 6-event series with a moderator plan, a safety code, an incident log and a refund rule.", "Role-play a harassment report with a peer. Check the response follows the written code."),
])
TCS_B["vr-live-events"] = ("a pilot event pack with a join guide, a safety code and a test report", "Done in one week with borrowed headsets or a desktop preview, reviewed by a mentor and a peer.", "Join guide works in under 5 minutes, safety code has 6 rules, and the test report has join time, comfort scores and one fixed fault.")

LAD_B["social-media-network"] = _m([
 ("Name network building blocks", "Name 6 building blocks (profile, feed, post, follow, message, report) and say what each does.", "Show a screen mock and ask for labels. Check that the report tool is included."),
 ("Rules, safety and data", "Describe 5 community rules and 4 safety tools, and state what member data is stored and why.", "Give a bad-post example and ask which rule it breaks. Check local rules with an expert for data law and minors."),
 ("Launch one niche community", "Plan a launch for one niche with 50 invited members, one core action and a week-one posting plan.", "Review the invite list. Check that 50 real targets are named, not a vague group."),
 ("Run a week of moderation", "Run a week of moderation with a queue, a 24-hour response time and a log of each decision.", "Provide 10 sample reports. Check that each is closed with a rule cited."),
 ("Design growth and retention loops", "Design a loop that brings 1 new member from every 5 active ones, with a metric and a test of 2 weeks.", "Check that the metric is counted weekly. Ask what would prove the loop wrong."),
 ("Analyse engagement", "Analyse weekly active members, posts per member and 30-day return rate, and pick the weakest of the three.", "Hand over a table of 8 weeks. Check the sums and the choice."),
 ("Lead trust and revenue plan", "Lead a 6-month plan covering ad rules, member consent, an appeal process and cost per member in {cur}.", "A peer plays a banned member. Check the appeal steps are fair and timed."),
])
TCS_B["social-media-network"] = ("a niche community launch plan with rules, a moderation log and a growth loop", "Done in two weeks using a free group tool and 50 invited members, reviewed by a mentor and a peer; check local rules with an expert for data and minors.", "Plan names 50 invitees, 5 rules, a 24-hour report response and one weekly metric; 10 sample reports are all closed with a rule.")

LAD_B["space-tourism"] = _m([
 ("Name space experience types", "Name 5 experience types (ground camp, balloon view, parabolic flight, suborbital, orbital) and rank them by cost and risk.", "Give five cards and ask for a ranking. Check that ground and balloon sit at the low end."),
 ("Safety and licence basics", "Describe 6 safety layers such as medical screening, training and abort plans, and name who must hold a flight licence.", "Ask who flies the craft. The answer must be a licensed operator. Check local rules with an expert."),
 ("Plan a ground training day", "Plan one ground day for 12 guests with a briefing, a centrifuge or simulator slot and a 30-minute medical form check.", "Review the schedule. Check the medical form is in before any activity."),
 ("Run a customer journey", "Run a mock journey from enquiry to return, with 8 touchpoints and a response time of 24 hours.", "A peer plays a nervous guest. Check that the learner answers risk questions honestly."),
 ("Design pricing and deposit terms", "Design a package in {cur} with a deposit, a refund rule for weather and a margin per guest.", "Check the sums and that the refund rule is clear in plain words."),
 ("Analyse partner and risk", "Analyse 3 operator partners on safety record, insurance and capacity and recommend one with 3 stated reasons.", "Provide three fact sheets. Check the choice relies on records, not on style."),
 ("Lead an experience launch", "Lead a launch plan with an insurance review, an incident plan, a guest briefing pack and a 12-month calendar.", "A mentor plays an insurer with 5 questions. Check the answers are written and sourced."),
])
TCS_B["space-tourism"] = ("a ground-based experience plan with a guest journey, pricing and a safety brief", "Done in ten days from open facts, reviewed by a mentor and a peer; flights stay with licensed operators and local rules must be checked with an expert.", "Plan has 12 guests, a medical check step, a refund rule, a margin per guest and 8 touchpoints with response times.")

LAD_B["fitness-tech"] = _m([
 ("Name fitness tech parts", "Name 6 parts of a fitness product (sensor, app, plan, coach, data, reward) and say what each does.", "Show a wearable and an app screen and ask for labels. Check that data is named as a part."),
 ("Health data and safe advice", "Describe 5 safety limits for exercise advice and say how health data must be protected.", "Ask what the app does if a user reports chest pain. Check local rules with an expert for health data."),
 ("Scope a 20-minute plan app", "Plan an app scope for busy parents with 3 workouts, a 20-minute limit and a weekly goal of 3 sessions.", "Review a one-page scope. Check that anything beyond three workouts is cut."),
 ("Run a user test", "Run a test with 10 users for 2 weeks and record sessions completed and drop-offs.", "Hand over a log. Check the completion rate is worked out as a percentage."),
 ("Design habit and reward loop", "Design a loop with a streak, a reminder and a reward and set a target of 40 percent weekly return.", "Ask what would stop the loop working. Check it avoids unsafe pushing."),
 ("Analyse retention and pricing", "Analyse 30-day retention and a price test between two plans in {cur}, and choose one with numbers.", "Provide two tables. Check the choice uses revenue per 100 users."),
 ("Lead a product roadmap", "Lead a 6-month roadmap with 3 releases, a safety review, a data audit and a coach partner agreement.", "A peer plays a coach asking for data access. Check the answer sets limits."),
])
TCS_B["fitness-tech"] = ("a scoped fitness app plan with a user test result and a retention target", "Done in two weeks with a paper or no-code prototype and 10 testers, checked by a mentor and a peer; check local rules with an expert for health data.", "Scope has 3 workouts and a 20-minute limit, test log shows completion rate, and a safety limit list has 5 items.")

LAD_B["three-sixty-degree-photography"] = _m([
 ("Name 360 camera gear", "Name 6 pieces of gear (camera, tripod, remote, stitch software, light, host site) and say why each matters.", "Lay out gear photos and ask for a pick for a small cafe. Check that a low tripod is chosen."),
 ("Capture basics and consent", "Describe 5 steps for a clean capture, including no-parallax distance and hiding yourself, and when people in a shot need consent.", "Show a bad shot with a visible tripod. Check local rules with an expert for privacy and signage."),
 ("Shoot a first tour", "Shoot a tour of 1 cafe with 6 spots, 3 exposures each and a final stitch with no visible seams.", "Review the tour on a screen. Check for seams and doorway lights blown out."),
 ("Edit and publish a tour", "Run an edit that fixes horizon, colour and logo patch, and publish a tour that loads in under 5 seconds.", "Time the load with a phone. Ask what to cut if it is slow."),
 ("Design a client package", "Design a package of 5 locations with price in {cur}, a delivery date and a revision limit of 2.", "Check the price covers the hours and the file storage."),
 ("Analyse tour performance", "Analyse views, time spent and enquiries from 5 tours and pick the one change that could raise enquiries.", "Give a stats table. Check that the learner links a change to a number."),
 ("Lead a studio workflow", "Lead a workflow for 3 shooters with a shot list, a naming rule, a QA check of 10 points and a client sign-off.", "Run a mock hand-over. Check that a missing file is caught by the checklist."),
])
TCS_B["three-sixty-degree-photography"] = ("a published 6-spot 360 tour of one local place with a short client package", "Done in one week using a borrowed or phone-based 360 camera, reviewed by a mentor and a peer; check local rules with an expert for privacy in shots.", "Tour has 6 spots with no visible seams, loads in under 5 seconds, and the package states price, delivery date and 2 revisions.")

LAD_B["electric-car"] = _m([
 ("Name electric car parts", "Name 6 parts (battery, motor, inverter, charger, controller, cooling) and state what each does.", "Show a simple cut-away picture and ask for labels. Check that the battery is described as the energy store."),
 ("High-voltage safety and rules", "Describe 6 high-voltage safety rules and name the training a technician needs before touching a pack.", "Ask what to do before opening a service cover. Check local rules with an expert for training and permits."),
 ("Run a battery health check", "Run a health check on 3 sample cars using state-of-health, range test and cell balance, and record each as a figure.", "Use a sample report. Check that a 20 percent loss is flagged."),
 ("Plan a charging service", "Plan a charging service for 20 users with 2 chargers, a booking slot of 2 hours and a price per kWh in {cur}.", "Review the rota. Check no two bookings clash and power supply is checked."),
 ("Design a fleet conversion plan", "Design advice for a fleet of 10 vans with cost per km, charge time and a payback period in months.", "Check the sums for petrol and electric side by side."),
 ("Analyse total cost of ownership", "Analyse 5-year cost for two cars including power, repair, tax and resale, and pick the cheaper with numbers.", "Give a data sheet. Check each line is used and the sum is right."),
 ("Lead a service business launch", "Lead a launch with a safety procedure, a parts supply deal, a warranty rule and a training plan for 3 staff.", "A mentor plays an owner after a fault. Check the response follows the written procedure."),
])
TCS_B["electric-car"] = ("a battery-check report and a charging or fleet advice sheet for one use case", "Done in one week from sample data, reviewed by a mentor and a peer; high-voltage work needs trained staff and local rules checked with an expert.", "Report covers 3 cars with a figure each, the advice sheet shows cost per km and payback in months, and 6 safety rules are listed.")

LAD_B["ddos-prevention-security"] = _m([
 ("Name attack types", "Name 5 attack types (volumetric, protocol, application, amplification, botnet) and give one sign of each.", "Show five traffic graphs and ask for a match. Check that a sudden spike is described in numbers."),
 ("Authorised testing and law", "Describe why you may only test systems you own or have written permission for, and list 5 items a permission letter needs.", "Hand over a draft letter with 2 gaps. Check local rules with an expert, as laws differ."),
 ("Protect a small shop site", "Plan protection for 10 small shop sites with a traffic filter, a rate limit and a failover page.", "Ask what happens at 10 times normal traffic. Check the answer names the filter and the page."),
 ("Run a safe traffic drill", "Run a drill in a lab with test traffic and record time to detect and time to recover in minutes.", "Use a sandbox only. Check that both times are logged and compared with a target of 5 minutes."),
 ("Design layered defence", "Design a defence with 4 layers (edge, filter, origin, monitor) and an on-call plan with 2 contacts per shift.", "Review a diagram. Check that a single point of failure is found and fixed."),
 ("Analyse an attack log", "Analyse a log of 24 hours, find the start, the source pattern and the cost in lost orders in {cur}.", "Provide a sample log. Check the timeline is correct to the hour."),
 ("Lead a service and response team", "Lead a service with a service promise, a 30-minute response target, a customer report and a post-attack review.", "Role-play a customer under attack with a peer. Check the updates come every 15 minutes."),
])
TCS_B["ddos-prevention-security"] = ("a defence plan and a lab drill report for a small online shop", "Done in one week on a lab setup only, reviewed by a mentor and a peer; test only with written permission and check local rules with an expert.", "Plan has 4 layers and an on-call rota, the drill report shows detect and recover times in minutes, and a permission letter has 5 items.")

LAD_B["senior-at-home-care"] = _m([
 ("Name daily care needs", "Name 6 daily needs (meals, mobility, medicine reminders, company, bathing, errands) and say which need a licensed carer.", "Show a day card and ask for a sort between companion tasks and clinical tasks. Check local rules with an expert for licences."),
 ("Respect, safety and privacy", "Describe 6 safe-visit rules, including dignity, fall risk and keeping client records private.", "Role-play a visit start. Check the learner asks permission before entering a room."),
 ("Plan a 2-hour visit", "Plan a 2-hour visit with meal help, a short walk and a note to family, with a checklist of 8 items.", "Review the checklist. Check that a fall hazard check is in it."),
 ("Run intake and care plan", "Run an intake with a 15-question form and write a care plan with 3 goals and a review date at 30 days.", "A peer plays a client. Check the goals are measurable and agreed."),
 ("Design a visit schedule and pricing", "Design a weekly rota for 3 carers and 12 clients with travel time and price per hour in {cur}.", "Check no carer is double booked and travel time is counted."),
 ("Analyse incidents and quality", "Analyse 10 visit notes and 2 incidents, find a pattern and propose one training change.", "Give sample notes. Check the pattern is backed by the notes."),
 ("Lead a care team", "Lead a team of 5 with a hiring check, a training plan, an emergency rule and a family update every week.", "A mentor plays a worried family member. Check the answers are calm and honest."),
])
TCS_B["senior-at-home-care"] = ("a visit checklist, an intake form and a 30-day care plan for one mock client", "Done in one week with a role-play client, reviewed by a mentor and a peer; clinical care needs a licensed partner, so check local rules with an expert.", "Checklist has 8 items with a fall check, the intake has 15 questions, and the plan has 3 measurable goals and a review date.")

LAD_B["p2p-lending-platform"] = _m([
 ("Name lending roles", "Name 5 roles (borrower, lender, platform, partner bank, collector) and state what each does.", "Draw the money flow on a board and ask the learner to label each arrow. Check the bank role is clear."),
 ("Licence, risk and fairness", "Describe 5 risks such as default, fraud and fees, and why a licensed firm must hold the money and approve the product.", "Ask who holds funds. Check local rules with an expert, because lending law varies by place."),
 ("Plan a small loan product", "Plan a product for small businesses with a loan of 1,000 to 5,000 {cur}, 12 months and a stated fee.", "Review the term sheet. Check the cost of borrowing is shown in plain terms."),
 ("Run a credit check sample", "Run a check on 10 mock applicants using income, history and 3 other items and record approve or decline with reasons.", "Give ten profiles. Check each decision has a written reason."),
 ("Design a loss and pricing model", "Design a model with a default rate of 5 percent, fee income and lender return, and show the break-even.", "Check by hand that the lender return is not shown as guaranteed."),
 ("Analyse a loan book", "Analyse 100 sample loans for late rates by group and find one rule change that cuts lates by a set percent.", "Hand over a table. Check the late rate is computed correctly."),
 ("Lead compliance and trust", "Lead a compliance plan with a partner firm, a complaint process of 15 days, a lender risk notice and an annual audit.", "A peer plays a complaining borrower. Check the process steps are followed and dated."),
])
TCS_B["p2p-lending-platform"] = ("a plan-only loan product sheet with a risk model and a partner compliance outline", "Done in ten days with sample data, reviewed by a mentor and a peer; planning only, so partner with a licensed firm and check local rules with an expert.", "Sheet shows loan size, term and fee, a default model at 5 percent with break-even, a complaint path of 15 days, and a plain risk notice for lenders.")

LAD_B["virtual-interior-design"] = _m([
 ("Name room design basics", "Name 6 design basics (layout, colour, light, scale, texture, flow) and give one example each.", "Show a room photo and ask for two problems. Check that scale or flow is mentioned."),
 ("Measure and brief a client", "Describe how to take a room brief with 10 measurements and 8 questions about use, budget and style.", "A peer plays a client. Check a budget in {cur} is asked first."),
 ("Create a package", "Build a package for one living room with 2 layouts, 1 colour plan and 1 shopping list of 15 items.", "Review the pack. Check that every item has a price and a link to a type, not a brand."),
 ("Run a design review", "Run a review call of 30 minutes that collects 3 changes and delivers a revised layout in 3 days.", "Time a mock call. Check the changes are written back to the client."),
 ("Design for budget and fit", "Design three options at low, mid and high budgets in {cur} and show what changes between them.", "Check that the low option still works. Ask the learner to defend one cut."),
 ("Analyse project profit", "Analyse hours, software cost and fee across 5 projects and find the one that lost money.", "Give a sheet. Check the cause is named, such as too many revisions."),
 ("Lead a design studio", "Lead a studio with a contract, a revision cap, a file naming rule and a supplier list for 3 designers.", "Review the contract. Check scope, revisions and payment dates are clear."),
])
TCS_B["virtual-interior-design"] = ("a living-room design package with two layouts, a colour plan and a priced shopping list", "Done in one week for a mock client using free design software, reviewed by a mentor and a peer.", "Package has 2 layouts, 1 colour plan and 15 priced items inside the stated budget; a revision round is delivered within 3 days.")

LAD_B["holographic-theater"] = _m([
 ("Name hologram show parts", "Name 6 parts (projector, screen, content, sound, lighting, operator) and say how each shapes the effect.", "Show a stage diagram and ask for labels. Check that lighting is linked to image clarity."),
 ("Venue safety and rights", "Describe 5 safety checks for dark rooms and crowds and say why music, images and likenesses need written rights.", "Ask what happens if a clip uses a song without permission. Check local rules with an expert for rights."),
 ("Plan a 10-minute show", "Plan a 10-minute demo for 20 seats with a script, 3 scenes and a 30-minute setup time.", "Review the script by timing it aloud. Check each scene has a cue."),
 ("Run a technical rehearsal", "Run a rehearsal that logs brightness, sync delay and 3 faults, and fix the worst one before the next run.", "Give a rehearsal log. Check that a sync delay over 100 ms is flagged."),
 ("Design a show run and price", "Design 3 shows per day with a ticket price in {cur}, a cost per show and a break-even audience.", "Check the sum by hand and ask what happens at half capacity."),
 ("Analyse audience feedback", "Analyse 50 feedback forms for score, comments and repeat visits and pick one content change.", "Provide the forms. Check the average and a top comment theme are correct."),
 ("Lead a touring or venue plan", "Lead a plan for 2 venues with a transport kit list, a staff rota of 4 and a rights log for every asset.", "A mentor plays a venue manager. Check the rights log answers every asset query."),
])
TCS_B["holographic-theater"] = ("a 10-minute show plan with a script, a rehearsal log and a break-even sheet", "Done in one week using a simple screen or projector effect, reviewed by a mentor and a peer; check local rules with an expert for rights.", "Script has 3 cued scenes, rehearsal log lists 3 faults with one fixed, and the sheet shows break-even audience for 20 seats.")

LAD_B["three-d-printing"] = _m([
 ("Name printer types and materials", "Name 4 print methods (FDM, resin, powder, metal) and 4 materials, and pair each with a use.", "Show sample parts and ask which method made each. Check that a smooth detailed part is matched to resin."),
 ("Safe operation and rights", "Describe 6 safety rules for heat, fumes and resin and explain why you must not copy a protected design.", "Ask where resin waste goes. Check local rules with an expert for waste and design rights."),
 ("Print a first useful part", "Print a replacement knob for a workshop with a measured fit within 0.3 mm and a print time under 2 hours.", "Check the fit with callipers. A loose or tight part is reprinted."),
 ("Run a small batch", "Run a batch of 20 clips and log failures, material used in grams and time per part.", "Give a batch sheet. Check that a failure rate is stated as a percentage."),
 ("Design for printing", "Design a part with wall thickness, overhang limits and a support plan, then test it on 3 settings.", "Compare the three prints. Ask which setting is cheapest at equal strength."),
 ("Analyse unit cost and demand", "Analyse cost per part in {cur} including material, power, time and failures and set a price with a stated margin.", "Check the arithmetic. A price below cost fails."),
 ("Lead a print service", "Lead a service for 5 workshops with a quote form, a quality check of 8 points, a lead time of 3 days and a spare printer plan.", "Run a mock order. Check the quality list is signed before dispatch."),
])
TCS_B["three-d-printing"] = ("a tested printed part with a unit cost sheet and a quote for 20 pieces", "Done in one week using a shared or school printer, reviewed by a mentor and a peer; check local rules with an expert for design rights.", "Part fits within 0.3 mm, failures are counted, unit cost in {cur} is shown with margin, and the quote has a 3-day lead time.")

LAD_B["influencer-marketing"] = _m([
 ("Name campaign parts", "Name 6 parts of a creator campaign (brief, creator, content, tag, link, report) and say what each is for.", "Show a sample post and ask the learner to find the tag and the link. Check that disclosure is spotted."),
 ("Disclosure and fair claims", "Describe 5 rules for paid posts, including clear labels and no false claims, and who is responsible for each.", "Hand over a post with a missing label. Check local rules with an expert, as advertising law varies."),
 ("Match brands and creators", "Run a match of 3 food brands with 10 creators of 5,000 followers using audience fit, past posts and a score out of 10.", "Provide ten profiles. Check each score has a reason."),
 ("Write a brief and contract", "Write a one-page brief and a simple agreement covering deliverables, dates, fee in {cur} and approval steps.", "A peer plays a creator and asks 3 questions. Check the answers are in the document."),
 ("Design a pilot and tracking", "Design a 4-week pilot with unique links, a goal of 200 clicks and a report on day 7 and day 28.", "Check that each creator has a distinct link. Ask how fakes would be spotted."),
 ("Analyse campaign results", "Analyse reach, clicks, sales and cost per sale for 10 creators and rank them with numbers.", "Give a results table. Check the cost per sale is correct and the ranking is explained."),
 ("Lead an agency workflow", "Lead a roster of 30 creators with onboarding, a payment run in 14 days, a content check and a monthly client report.", "Role-play a late post issue with a peer. Check the fix keeps the contract."),
])
TCS_B["influencer-marketing"] = ("a pilot campaign pack with a brief, an agreement and a tracking plan", "Done in ten days with sample creators, reviewed by a mentor and a peer; check local rules with an expert for ad disclosure.", "Pack has a one-page brief, a fee and dates, unique links for each creator, a 200-click goal and a labelled sample post.")

LAD_B["boat-helicopter-tourism"] = _m([
 ("Name tour types and assets", "Name 5 tour types (harbour, coast, island, scenic flight, sunset) and the craft each needs.", "Show a map and ask for a route per visitor group. Check the craft matches the group size."),
 ("Safety and licences", "Describe 8 safety items such as life jackets, weather limits and briefings, and say that only licensed operators run craft.", "Ask who decides to cancel in poor weather. Check local rules with an expert for licences and insurance."),
 ("Plan a 2-hour route", "Plan a 2-hour harbour trip for 20 family guests with stops, a timeline and a weather cut-off.", "Review the timeline. Check the return buffer is at least 15 minutes."),
 ("Run a guest journey", "Run a mock booking to farewell journey with a safety brief of 5 minutes and a 24-hour reply to enquiries.", "A peer plays a guest with a child. Check the brief covers child jackets."),
 ("Design pricing and capacity", "Design a price per head in {cur} with fuel, crew and fees and a break-even occupancy figure.", "Check the sums by hand. Ask what happens when 5 seats stay empty."),
 ("Analyse season demand", "Analyse bookings, weather cancels and reviews over 12 months and move two departure times to raise occupancy.", "Provide a table. Check the cancel rate is computed."),
 ("Lead operator partnership", "Lead a plan with a licensed operator including a contract, an incident drill each quarter and an insurance review.", "A mentor plays an auditor. Check each drill has a dated record."),
])
TCS_B["boat-helicopter-tourism"] = ("a tour plan with a route timeline, a safety brief and a price and break-even sheet", "Done in one week as a desk plan, reviewed by a mentor and a peer; craft are run by licensed operators only, so check local rules with an expert.", "Route lasts 2 hours with a 15-minute buffer and weather cut-off, the brief has 8 items, and break-even occupancy is shown in {cur}.")

LAD_B["online-fulfilment"] = _m([
 ("Name fulfilment steps", "Name the 6 steps (receive, store, pick, pack, ship, return) and say what can go wrong at each.", "Walk through a parcel journey and ask for the failure at each step. Check returns are included."),
 ("Stock, labels and customs", "Describe how a SKU, a barcode and a shipping label link to an order and when customs forms are needed.", "Show a label with an error. Check local rules with an expert for customs and tax."),
 ("Pilot for small-parcel sellers", "Plan a pilot for sellers shipping 20 to 100 orders a week with a pick list, a pack standard and a same-day dispatch cut-off.", "Review the pick list. Check it is sorted by shelf location."),
 ("Run a pick and pack test", "Run a test of 50 orders and record pick accuracy, pack time and damage rate.", "Hand over a tally. Check accuracy is stated as a percentage with a 99 percent target."),
 ("Design layout and pricing", "Design a shelf layout and a price per order in {cur} covering space, labour and materials with a margin.", "Check the sums. Ask what happens at double volume."),
 ("Analyse carrier and error data", "Analyse delivery times and error causes across 200 orders and pick one carrier or process change.", "Provide a data sheet. Check the cause is traced to numbers."),
 ("Lead a scaling plan", "Lead a plan to handle 5 times the volume with a staffing rota, a stock count each week and a service agreement.", "A peer plays a seller after a lost parcel. Check the claim steps are followed."),
])
TCS_B["online-fulfilment"] = ("a pilot fulfilment process sheet with pick list, pack standard and a 50-order test result", "Done in one week with sample orders, reviewed by a mentor and a peer; check local rules with an expert for customs and tax.", "Test covers 50 orders with accuracy at or above 99 percent, a damage rate is logged, and the price per order in {cur} includes a margin.")

LAD_B["micro-mobility-services"] = _m([
 ("Name vehicle and zone basics", "Name 4 vehicle types (bike, e-bike, scooter, moped) and match each to a trip length.", "Show four trip cards and ask for a match. Check that short trips go to scooters or bikes."),
 ("Rider safety and city rules", "Describe 6 rider safety rules and the parking, speed and age rules that apply in {place}.", "Ask where a scooter may be parked. Check local rules with an expert, as they differ by city."),
 ("Pilot one zone", "Plan a pilot of 20 bikes in 1 square kilometre with docks, a charging round and a lost-bike rule.", "Review a map. Check that the docks sit near real trip starts."),
 ("Run a utilisation week", "Run a week of tracking and report rides per bike per day, idle hours and faults found.", "Give a data sheet. Check the learner works out the average and finds the idle zone."),
 ("Design pricing and fleet care", "Design a price per minute in {cur} with unlock fee, battery swap costs and a weekly care plan of 5 checks.", "Check that the price covers costs per ride. Ask what happens when 2 bikes break."),
 ("Analyse trip data", "Analyse 500 trips and find the busiest hour, the longest idle zone and one place to move 5 vehicles.", "Provide a trip table. Check the answer ties to the numbers."),
 ("Lead city permit and expansion", "Lead a plan with a permit file, an insurance review, a 30-minute fault response and a second zone.", "A mentor plays a city officer. Check the answers cite the permit file."),
])
TCS_B["micro-mobility-services"] = ("a one-zone pilot plan with a map, a price model and a weekly care checklist", "Done in one week from sample trip data, reviewed by a mentor and a peer; check local rules with an expert for permits and insurance.", "Plan has 20 vehicles in a 1 square km zone, price per minute in {cur} covers cost per ride, and 5 care checks are listed.")

LAD_B["virtual-medical-appointment-system"] = _m([
 ("Name booking flow steps", "Name the 6 steps (find, book, remind, join, consult, follow up) in a video visit and say what the system does at each.", "Show a flow card in mixed order and ask for the right sequence. Check follow-up is not forgotten."),
 ("Privacy and safe use", "Describe 6 privacy rules for health data and name 3 cases where video care is not safe and a visit in person is needed.", "Ask what happens in an emergency during a call. Check local rules with an expert for health data and licensing."),
 ("Map a clinic flow", "Map the 6 steps for one clinic type, with a reminder 24 hours before and a 5-minute join test.", "Review the map. Check there is a back-up phone path if video fails."),
 ("Run a mock visit test", "Run 10 mock visits and record join success, wait time and drop rate, then fix the top fault.", "Give a log. Check that join success is a percentage and the fix is retested."),
 ("Design scheduling and no-show rules", "Design slot lengths, buffers and a no-show reminder plan aiming to cut no-shows by 20 percent.", "Check the buffer maths and ask how double booking is blocked."),
 ("Analyse access and outcomes", "Analyse waiting time, no-show rate and satisfaction over 4 weeks and choose one change with numbers.", "Provide a table. Check the rates are right and no personal data appears."),
 ("Lead a clinic rollout", "Lead a rollout with a consent form, a staff training of 2 hours, an incident log and a link to licensed clinicians.", "A peer plays a clinician with a worry. Check answers keep care with licensed staff."),
])
TCS_B["virtual-medical-appointment-system"] = ("a planning pack with a booking flow map, a privacy checklist and a mock visit test log", "Done in one week as a planning exercise with mock patients, reviewed by a mentor and a peer; care stays with licensed clinicians and local rules must be checked with an expert.", "Flow map has 6 steps and a phone back-up, privacy list has 6 rules, and the log covers 10 visits with a fixed fault.")

LAD_B["privacy-protection-firm"] = _m([
 ("Name personal data types", "Name 6 types of personal data (contact, ID, location, health, payment, device) and say which are sensitive.", "Show a sign-up form and ask the learner to highlight each type. Check that location is marked."),
 ("Principles and law basics", "Describe 6 privacy principles such as purpose, minimum data, consent, access, security and retention.", "Ask which principle a 10-year log breaks. Check local rules with an expert, as data law differs by place."),
 ("Run a 10-point check", "Run a 10-point privacy check for a 5-person shop and list 5 gaps with a fix for each.", "Give a mock shop profile. Check the gaps are real and each has an owner."),
 ("Map data flows", "Run a data map showing where 8 data items enter, are stored and are shared, with the legal reason for each.", "Review the diagram. Check a third-party tool is shown."),
 ("Design policies and training", "Design a privacy notice, a request process with a 30-day reply and a one-hour staff training with a 5-question quiz.", "Test the notice for plain words. Check the quiz covers a breach."),
 ("Analyse a data breach", "Analyse a mock breach, set a timeline, list people to tell and rank 4 fixes by cost and risk cut.", "Hand over a short incident story. Check the first 24 hours are planned."),
 ("Lead a privacy programme", "Lead a programme with a risk register of 10 items, a vendor review, a yearly audit and a quarterly report.", "A mentor plays a customer asking for deletion. Check the steps and dates are right."),
])
TCS_B["privacy-protection-firm"] = ("a 10-point privacy check report with a data map and a fix list for a small shop", "Done in one week on a mock business, reviewed by a mentor and a peer; check local rules with an expert for data law.", "Report has 10 checked points, a data map of 8 items with reasons, 5 gaps with owners, and a request process with a 30-day reply.")

LAD_B["3d-home-building"] = _m([
 ("Name 3D build parts", "Name 6 parts of a 3D print build (printer, mix, nozzle, wall, foundation, finishing) and say what each does.", "Show a wall cross-section and ask for labels. Check that the foundation is traditional work."),
 ("Codes, safety and sign-off", "Describe 6 site safety rules and explain why a licensed builder and engineer must sign off any home.", "Ask who approves the wall design. Check local rules with an expert for permits and codes."),
 ("Plan a garden room", "Plan a single-room build of 15 square metres with a drawing, a mix test and a permit list.", "Review the plan. Check the drawing shows wall thickness and openings."),
 ("Run a mix and strength test", "Run a mix test on 6 samples and record slump and strength against the target given by the engineer.", "Provide results. Check that a weak sample is rejected and logged."),
 ("Design the build schedule and cost", "Design a schedule of 3 weeks with print hours, curing and finishing and a cost per square metre in {cur}.", "Check the curing days are not cut. Review the sums."),
 ("Analyse risks and defects", "Analyse 10 sample defects such as layer gaps and cracks, and rank them by safety effect with a repair method.", "Hand over photos. Check the structural ones are escalated to an engineer."),
 ("Lead a small estate plan", "Lead a plan for 4 units with a supplier contract, an inspector schedule, a snag list and a handover pack.", "A mentor plays an inspector. Check that every hold point has a signed record."),
])
TCS_B["3d-home-building"] = ("a one-room build plan with a schedule, a mix test record and a cost per square metre", "Done in two weeks as a desk plan, reviewed by a mentor and a peer; a licensed builder and engineer must sign off and local rules need an expert check.", "Plan covers 15 square metres, has 6 mix samples logged, a 3-week schedule with curing, a cost in {cur} and 6 safety rules.")

LAD_B["veterinarian-business"] = _m([
 ("Name animal groups and services", "Name 5 animal groups and 5 services (check-up, vaccine, dental, surgery, emergency) and say which need a licensed vet.", "Show service cards and ask for a sort. Check local rules with an expert for who may do what."),
 ("Welfare, hygiene and records", "Describe 6 hygiene steps, a handling rule for nervous animals and the 8 items that go in a patient record.", "Role-play a check-in. Check the learner records weight and allergy."),
 ("Plan a small-pet clinic", "Plan a small-pet clinic with 2 consult rooms, a service list of 6 and an opening hours chart.", "Review the floor plan. Check that dogs and cats have separate waiting space."),
 ("Run a booking and reminder system", "Run a booking test for 20 appointments with a 24-hour reminder and a recall for vaccines at 12 months.", "Use a sample calendar. Check no overlaps and that recalls are set."),
 ("Design pricing and stock", "Design a price list in {cur}, a stock reorder level for 10 items and a margin on each service.", "Check the sums. Ask what happens when a vaccine stock runs out."),
 ("Analyse clinic performance", "Analyse visits, revenue per visit and no-show rate over 3 months and pick one change.", "Provide a table. Check the numbers drive the choice."),
 ("Lead a practice team", "Lead a team of 6 with a vet contract, a rota, an emergency plan and a clinical audit every quarter.", "Role-play an out-of-hours call. Check the plan sends the owner to a licensed vet quickly."),
])
TCS_B["veterinarian-business"] = ("a small-pet clinic plan with a service list, price list and booking and recall test", "Done in one week as a desk plan, reviewed by a mentor and a peer; care is given by licensed vets only, so check local rules with an expert.", "Plan has 6 services, priced in {cur} with a margin, a 20-appointment calendar with no overlaps, and a recall set at 12 months.")
