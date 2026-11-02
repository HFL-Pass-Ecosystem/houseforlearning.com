# GL-12 DDoS and Cyber-Attack Prevention: full lesson text (DRAFT v0.1, 31 Oct 2026)

Long Module, about 60 hours (DO 42 h, SHARE 12 h, STUDY 6 h). Brand-neutral. Aligned with recognised security-hardening and incident-response practice. This is not a licence or a certificate. Test only your own lab with traffic you generate yourself at small, safe volumes. Attacking anyone else's service is illegal. This module teaches defence only. Currency is always shown: use your own currency and write it next to every money number.

Tools: a free virtual-machine tool, a free open-source web server, a free load-testing tool run at small volume on your own lab, a free spreadsheet.

Journey: Idea > Action > Value > Empowerment > Regeneration.

## Lesson 1 - Idea (STUDY, 2 h): How services get overwhelmed, and who suffers
Goal: understand attack types in plain words and choose a lab service to protect.
1. Explain a DDoS in plain words: many machines send so many requests that real users cannot get through, like a crowd blocking a shop door.
2. Learn the main families: flooding the network, exhausting the server, and hitting the application with costly requests. Learn that other attacks (stolen passwords, unpatched software, tricking staff) are far more common.
3. Choose a lab service: a small website on a virtual machine that you own.
4. Write what 'working' means: for example the home page answers within 1 second for 95% of requests.
Evidence: attack-family summary and the service-level target.

## Lesson 2 - Idea (SHARE, 3 h): Kick-off circle
1. Each learner reads their one-page plan aloud (3 minutes).
2. Peers ask three questions: who is it for, why you, what could go wrong.
3. The mentor agrees the evidence you will produce in this module: a baseline test, a hardening checklist, a before/after test and an incident plan.
Evidence: your revised plan and the agreed evidence list.

## Lesson 3 - Action (DO, 14 h): Baseline the lab service
1. Set up the lab web server on a virtual machine you own. Record its address and resources.
2. Run a small, permitted load test from your own second machine: start at 10 requests per second, then 50. Record response times and errors.
3. Find the point where it starts to slow. Record CPU, memory and network use.
4. Write the baseline: the volume it handles, and what breaks first.
Evidence: lab setup notes, baseline test table.

## Lesson 4 - Action (STUDY, 2 h): Attack types, mitigations and legal limits
Short modules:
- Attack types: network flood, connection exhaustion, slow requests, amplification, application-level abuse; why attackers choose each.
- Mitigations: rate limits, caching, a content-delivery network or scrubbing service, filtering at the edge, spare capacity, turning off unused services, keeping software updated, strong sign-in.
- Legal limits: computer-misuse laws in most countries; only test what you own or have written permission for; keep records; report a vulnerability responsibly.
Check: 10 questions at the end of the module.

## Lesson 5 - Action (DO, 14 h): Harden and retest
1. Apply three mitigations to the lab: for example rate limiting, caching of static pages, closing unused ports.
2. Rerun the same load test at the same volumes. Record response times and errors.
3. Compare with the baseline. If one change made it worse, undo it and note why.
4. Write the monitoring plan: what you watch, what number raises an alert, who is called.
Evidence: hardening checklist, retest table, monitoring plan.

## Lesson 6 - Value (SHARE, 6 h): Defence review circle
1. Present before and after. Peers suggest the next weakness.
2. Walk through a tabletop incident: 'at 9 am the site is slow'. Who does what in the first 30 minutes?
3. A mentor with security operations experience reviews the incident plan.
Evidence: tabletop notes and reviewed incident plan.

## Lesson 7 - Value (DO, 14 h): Finish and measure
1. Write the one-page incident plan: detect, confirm, contain, communicate, recover, learn.
2. Retest after any new change and record the final numbers.
3. Write three lessons learned and one decision for a small business: what to buy, what to configure, what to practise.
Evidence: incident plan, final numbers, decision note.

## Lesson 8 - Empowerment (SHARE, 3 h): Review room
1. Present to a review room: the service, the baseline, the hardening, the retest, the incident plan and your decision.
2. Give two peers written feedback: one thing that is strong, one thing to fix.
3. Ask one real user, customer or reviewer for a short written note.
Evidence: slides or notes, two peer reviews, the written note.

## Lesson 9 - Regeneration (STUDY, 2 h): Check and next step
1. Take the 10-question check. Pass mark is 70% (draft).
2. Write your 90-day plan: what you will do next, how you will measure it, what you will learn next. Good follow-on courses: Internet Infrastructure Basics; Privacy Protection Practice; IT Service and Support.
3. Contribute back: share your hardening checklist, incident plan template or tabletop scenario so the next learner starts higher. Accepted items earn credits (rates are placeholders until the owner fixes the revenue plan).
Evidence: check result and the 90-day plan.

## Worked examples
1. Baseline: lab server handles 50 requests per second with 95% under 1 second; at 100 it fails 12% of requests.
2. Mitigation 1: caching static pages raises the comfortable rate to 150 per second (3 times).
3. Mitigation 2: rate limit of 10 requests per second per visitor drops abusive traffic: of 1,000 requests from one source in 10 seconds, 100 are allowed, 900 refused (90%).
4. Availability goal 99.9% = 43.2 minutes allowed down in a 30-day month (0.001 x 43,200).

## Case exercise
At 9 am your site is slow and the logs show 20,000 requests a minute from many places, normally 600. Questions: What are your first three steps? Who do you call? What do you say to customers? Write the tabletop plan.

## Check questions (draft set, 10)
1. Explain a DDoS in one sentence. 2. Name two families of attack. 3. Why are stolen passwords a bigger risk than floods for most small firms? 4. What does rate limiting do? 5. Why test only your own lab? 6. What does a baseline show? 7. Name three mitigations. 8. What are the six steps in the incident plan? 9. Why practise a tabletop incident? 10. What was your decision and why?

## Rules for this module
No brand names or logos of other companies on any page, slide or file. No personal data of real people in shared files. Never test a system you do not own. Never share attack tools or targets. Keep load tests small and inside your lab.
