#!/usr/bin/env python3
"""Deeper local editions for ten priority sectors x four places (40 pages): site/learn-deep-<k>-<slug>.html. Own wording."""
import sys, pathlib, html, copy
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import flagship_loc_four as F, loc_editions as LE, build_full_courses as B
e = html.escape
# per sector: (slug, topic, 8 x (lesson point, worked example sentence)); {c}=currency code
S = [
 ('ecommerce','e- Commerce',[
  ('Sell one product line to one customer group first; a wide shop hides what works.','Start with 12 products for one group; after 4 weeks drop the 6 with no orders and reorder the 3 best.'),
  ('Compare three models: own shop, marketplace, messaging-app orders. Pick by cost per order.','Own shop {c} 40 per order to win a customer, marketplace {c} 25 plus fee, app orders {c} 10 but slow: choose by margin left.'),
  ('List the shop licence, the tax set-up and the returns rule before the first listing.','Licence table row: tax registration, shop terms page, returns page, delivery terms; each has a date checked.'),
  ('Collect only the data an order needs: name, address, phone, payment status.','A checkout that asks for 6 fields instead of 14 and stores nothing else.'),
  ('Write product pages in the customer language with size, price, delivery days and returns in the first screen.','Page test: 100 visitors, 8 add to basket, 3 order: a 3% order rate; move delivery days above the price and test again.'),
  ('Count landed cost: product, packing, delivery, returns share, payment fee.','Item cost 100, packing 8, delivery 15, returns 6, fee 3: landed 132; a price of 180 leaves 48.'),
  ('Split tasks: pick and pack, support replies, supplier calls; write a daily checklist.','Part-time packer 4 h per day: pick, pack, label, hand over by 3 pm.'),
  ('Launch with a go or no-go rule: 30 orders in 6 weeks at a margin above 20%.','Week 6 count: 34 orders at 24% margin: go; 18 orders: improve pages, do not buy more stock.')]),
 ('digital-marketing','Digital Marketing',[
  ('Sell outcomes (leads, bookings), not posts.','Offer: 20 qualified enquiries per month for a local clinic, reported weekly.'),
  ('Pick a customer type and one channel to prove results before adding more.','Channel test: short videos vs. search ads for 2 weeks; compare cost per enquiry.'),
  ('Check advertising rules, claims rules and what a client contract must say.','Contract lists scope, monthly fee, report date, ownership of accounts and a notice period.'),
  ('Handle client data with care: access lists, shared passwords never, consent records.','Access sheet: who can see which account and the date each login was removed.'),
  ('Build a proof page: one case with before and after numbers.','Case: enquiries rose from 12 to 31 per month in 8 weeks; method in 5 lines.'),
  ('Price per month with a clear scope and report; add a set-up fee for the first month.','Monthly fee {c} 100 per 1 unit of effort: 40 hours at {c} 25 cost 1000; price 1500 leaves 500.'),
  ('Use freelancers for design and video with a one-page brief and a delivery date.','Brief: goal, audience, size, deadline, price, two revisions.'),
  ('Launch with three pilot clients and a review at day 30.','Go rule: two of three pilots renew at day 30.')]),
 ('ai','Artificial Intelligence',[
  ('Use AI to remove one slow task for a small firm; do not sell the word AI.','Task: reply drafts for 40 daily emails cut from 4 hours to 1.5 hours.'),
  ('Choose between a ready tool, a no-code build and custom work by cost and risk.','Ready tool {c} 30 per month vs custom {c} 3000 once; the ready tool pays back first.'),
  ('Read the rules on automated decisions, advertising claims and cross-border data.','Rule table: where the tool stores data, who owns outputs, what must be disclosed.'),
  ('Never paste confidential data into an unchecked tool; write a use policy of one page.','Policy: allowed data, forbidden data, review step before any output leaves.'),
  ('Show a before and after demo with real time saved, measured.','Demo: 100 invoices sorted in 12 minutes instead of 3 hours, with 2 errors caught by a human check.'),
  ('Price per task or per month and count tool and review time.','Tool {c} 30, review 5 h at {c} 20 = 100; total 130; price 400 leaves 270.'),
  ('Train one person at the client to own the tool; write a one-page guide.','Guide: where to click, what never to paste, who to call.'),
  ('Launch with two pilots; stop if errors above 5% after correction.','Pilot review: error rate 3% after human check: go.')]),
 ('it-support','IT Service & Support',[
  ('Sell uptime and fast replies to firms of 5 to 30 people.','Offer: remote support in 2 hours, on-site in 1 day, monthly check.'),
  ('Choose a plan: pay per call, monthly plan or project; pick by regular income.','12 clients at 1 unit of monthly plan each covers fixed costs before project work.'),
  ('Check contract limits, liability and what you may access.','Contract: scope, response times, what you may not touch, a backup duty.'),
  ('Keep client passwords in a vault with a log; never email them.','Vault log: who opened what and when.'),
  ('Prove value with a monthly report: tickets closed, time to fix, risks found.','Report: 38 tickets, median fix 1.5 hours, 3 risks removed.'),
  ('Price plans per device or user; add set-up and a minimum term.','25 devices at {c} 12 = 300 per month; cost of 12 hours at {c} 15 = 180; margin 120.'),
  ('Build a backup technician rota so no client waits.','Rota: primary and backup each week with a phone list.'),
  ('Launch with 3 pilot clients and a 30-day review.','Go rule: 3 pilots rate response time 4 of 5 or better.')]),
 ('solar','Solar Power',[
  ('Start with a survey service: roof, shade, use and bill; install through a certified partner.','Survey of a 20 square metre usable roof, 3 hours of shade check, 12-month bills.'),
  ('Compare buy, lease and shared models by years to pay back.','Cost 10000, yearly saving 1800: payback 5.6 years; lease keeps cost at zero but saves less.'),
  ('Check building permits, grid-connection rules and installer certification.','Permit table: owner approval, grid approval, installer certificate, inspection date.'),
  ('Keep site photos and home data private; agree who may share them.','Consent form for survey photos with a deletion date.'),
  ('Show customers a plain bill comparison before and after.','Before 220 per month; after 130; saving 90 per month, 1080 per year.'),
  ('Price survey, design and project fee separately; show payback.','Survey 60, design 140, project fee 5% of 10000 = 500.'),
  ('Work with a certified installer; write who does what and who is liable.','Partner letter: installer builds and certifies; you survey and support.'),
  ('Launch with 5 surveys and a rule: 2 become projects.','Go rule: 2 of 5 surveys sign within 8 weeks.')]),
 ('ghost-kitchen','Ghost Kitchens',[
  ('One menu of 8 dishes for delivery only; every dish must travel well.','Menu test: 8 dishes, remove any that arrive cold or soggy.'),
  ('Compare own site, delivery apps and phone orders by margin after fees.','App fee 25% on 100 sale leaves 75; own site fee 3% leaves 97.'),
  ('Check food licence, kitchen inspection, labels and allergen rules.','Licence table: food business licence, inspection, allergen chart, waste rule.'),
  ('Keep customer order data minimal; record complaints and allergen incidents.','Incident log: date, dish, issue, action.'),
  ('Photograph each dish; show delivery time honestly.','Page promises 35 minutes and meets it 9 of 10 times.'),
  ('Cost each dish: food, packing, labour, fee; price above total.','Food 30, packing 5, labour 15, fee 25 = 75; price 110 leaves 35.'),
  ('Run two shifts with a prep list and a closing checklist.','Shift card: prep at 10, open at 12, clean at 22.'),
  ('Launch with a 4-week trial and a rule: 25 orders per day by week 4.','Week 4 count 28: go; 14: change the menu.')]),
 ('online-tutoring','Online Tutoring Platform',[
  ('Start with one subject and one age group; trust grows with results.','Pilot: reading help for ages 8 to 10, 2 sessions a week.'),
  ('Compare live groups, one-to-one and recorded lessons by cost and results.','Group of 6 at 20 earns 120 per hour; one-to-one at 40 earns 40.'),
  ('Check rules for teaching, child safety, background checks and payments.','Safety table: two adults on every call, recorded sessions, parent consent.'),
  ('Protect children\'s data: parents consent, minimal data, deletion on request.','Consent form with parent signature and a deletion contact.'),
  ('Show progress with a monthly report; parents want proof.','Report: reading score up from 12 to 16 of 20 in 8 weeks.'),
  ('Price per month with a clear refund rule; pay tutors per hour.','Tutor 15 per hour; group of 6 at 20: margin 105 per hour before costs.'),
  ('Train tutors with a one-page lesson plan and a safety briefing.','Plan: warm up 5, teach 20, practise 20, check 5.'),
  ('Launch with 20 pupils and a rule: 80% attend 8 of 10 sessions.','Review at week 6.')]),
 ('business-coach','Business Coach',[
  ('Coach one type of founder through one result, such as first 10 customers.','Programme: 8 weeks, weekly 45 minutes, one task each week.'),
  ('Choose group, one-to-one or both; compare income and time.','8 group members at 50 per month = 400; one-to-one 4 hours at 40 = 160.'),
  ('Check what you may claim and promise; no guarantees of income.','Claims list: allowed statements and banned statements.'),
  ('Keep client notes private; agree confidentiality in writing.','Notes locked; shared only with written consent.'),
  ('Prove results with client numbers (with permission).','Client moved from 2 to 9 monthly orders in 8 weeks.'),
  ('Price per programme; offer one trial session at a fair rate.','Programme 600; time 8 weeks x 3 hours at 25 = 600; margin from group scale.'),
  ('Use a simple tracker and templates; partner with a referral source.','Tracker: goal, task, due date, result.'),
  ('Launch with 3 pilots and a review at week 8.','Go rule: 2 of 3 reach their goal.')]),
 ('coworking','Coworking Spaces',[
  ('Serve one group, such as freelancers or small teams; rent by the desk or by the day.','Pilot: 10 desks, 2 rooms for hire.'),
  ('Compare lease, shared lease and partner-hosted models by risk.','Lease 5000 per month vs partner space 2000 plus share of income.'),
  ('Check lease terms, safety, fire and signage rules.','Table: lease clause, occupancy limit, fire exit, insurance.'),
  ('Handle member data: door logs and cameras need notices.','Notice at the door and in the member terms.'),
  ('Sell the community: events and introductions, not only desks.','Monthly event with 25 guests, 6 become desk users.'),
  ('Price day pass, desk and room; count occupancy.','10 desks at 150 = 1500 at 70% = 1050; rent 700 leaves 350.'),
  ('Hire a host part-time; write a daily open and close routine.','Host 20 hours per week; checklist at open and close.'),
  ('Launch with a 3-month trial and a rule: 60% desks filled by month 3.','Month 3 count decides.')]),
 ('podcasting','Podcasting',[
  ('One show for one listener type; promise one outcome per episode.','Show: 15 minutes for first-time founders, weekly.'),
  ('Compare solo, guest and series formats by effort and reach.','Solo: 3 hours per episode; guest: 5 hours with booking.'),
  ('Check music, quote and guest-release rules.','Release form for every guest; only licensed music.'),
  ('Handle listener data: email lists with consent.','Sign-up with a clear opt-out.'),
  ('Prove reach: downloads, replies and subscribers per episode.','Episode 6: 420 downloads, 18 replies, 9 sign-ups.'),
  ('Earn from sponsors, services or membership; count your time.','5 hours per episode at 20 = 100; one sponsor pays 150.'),
  ('Use an editor and a guest booker with a one-page brief.','Editor delivers in 3 days; price per episode agreed.'),
  ('Launch with 8 episodes and a rule: 300 downloads per episode by episode 8.','Review after episode 8.')])]
import re as _re
_RULE = _re.compile(r'\b(tax|taxes|vat|duty|duties|licen[cs]e|licen[cs]es|permit|permits|law|laws|legal|regulat\w*|rule|rules|registration|compliance|customs|data protection|privacy|labour law|work permit)\b', _re.I)
def _expert(pt):
    return pt if (not _RULE.search(pt) or 'local expert' in pt) else pt.rstrip() + (' ' if pt.rstrip().endswith('.') else '. ') + 'Check with a local expert.'
def build(L, idx, sl, topic, rows):
    L = copy.deepcopy(L); c = L['cur'].split(' or ')[0]
    L['price'], L['var'], L['fixed'] = LE.scaled(L, idx)
    L['item'] = f'a small {topic} business'
    mods = F.modules(L)
    mods[1] = LE.build.__globals__['F'].modules(L)[1]
    out = []
    for j, m in enumerate(mods):
        pt, ex = rows[j]
        out.append((m[0], m[1], m[2], m[3], [_expert(pt.replace('{c}', c))] + [_expert(x) for x in m[4]], ex.replace('{c}', c) + ' | Local example: ' + m[5], m[6], m[7]))
    mh = ''.join(f'<details class="mod" {"open" if j==0 else ""}><summary><span class="mn">Module {j+1}</span> {e(m[0])} <span class="pill">{m[2]} h</span><span class="pill bz">{m[1]}</span></summary><p>{e(m[3])}</p><ul>' + ''.join(f'<li>{e(x)}</li>' for x in m[4]) + f'</ul><div class="evi"><strong>Worked example.</strong> {e(m[5])}</div><p><strong>Activity.</strong> {e(m[6])}</p><p><strong>Standard to meet.</strong> {e(m[7])}</p></details>' for j, m in enumerate(out))
    q = F.quiz(L); q[0] = (f'What is the first move for a {topic} business in {L["name"]}?', rows[0][0].replace('{c}', c))
    q[1] = ('Which model comparison belongs to this sector?', rows[1][0].replace('{c}', c))
    qz = ''.join(f'<details class="mod"><summary>Q{j+1}. {e(a)}</summary><p><strong>Model answer:</strong> {e(b)}</p></details>' for j, (a, b) in enumerate(q))
    rub = '<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(x)}</td><td>{e(d)}</td></tr>' for a, b, x, d in F.rubric(L)) + '</tbody></table></div>'
    jobs = '<ul>' + ''.join(f'<li><strong>{e(a)}.</strong> {e(b)}.</li>' for a, b in [(f'{topic} assistant', f'supports a small {topic} business in {L["name"]}')] + L['jobs'][:5]) + '</ul>'
    body = (B.sec('', 'ab', 'about', f'{topic}: {L["name"]} deep edition', f'<p>{e(topic)} planned in detail for {e(L["name"])}: sector lessons plus local rules, jobs and {e(L["cur"])} examples. {e(F.CHECK)}</p>')
            + B.sec('alt', 'md', 'lesson by lesson', '8 modules with worked examples', mh) + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Pass: no criterion at Not yet and 8 of 10 right.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{qz}')
            + B.sec('alt', 'jb', 'jobs', 'Where this takes you', jobs) + B.sec('', 'ld', 'ladder', 'Ladder L1 to L7', F.ladder(L)))
    fn = f'learn-deep-{L["k"]}-{sl}.html'
    B.page(fn, f'{topic}: {L["name"]} deep edition', f'{topic} in detail for {L["name"]}.', f'{topic}: {L["name"]} deep edition', e(f'Sector lessons, local rules, jobs and {L["cur"]} examples.'), body, B.crumb(('Courses', 'courses-hub.html'), (f'{L["name"]} editions', f'learn-loc-{L["k"]}-hub.html'), (topic, None)), kicker=f'deep location edition · {L["k"].upper()}')
if __name__ == '__main__':
    n = 0
    for L in F.LOCS:
        for i, (sl, t, rows) in enumerate(S, 1): build(L, i, sl, t, rows); n += 1
    print('built', n)
