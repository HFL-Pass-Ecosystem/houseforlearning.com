# GL-10 Cloud Migration as a Service: full lesson text (DRAFT v0.1, 31 Oct 2026)

Long Module, about 60 hours (DO 42 h, SHARE 12 h, STUDY 6 h). Brand-neutral. Aligned with recognised cloud-security, resilience and cost-management practice. This is not a licence or a certificate. Use sample workloads, not real customer data. Cloud costs can grow quickly: always set a spending alert and check the free-limits register before you create anything. Currency is always shown: use your own currency and write it next to every money number.

Tools: a free spreadsheet, free diagram tool, free cloud tiers within their limits (check the free-limits register first).

Journey: Idea > Action > Value > Empowerment > Regeneration.

## Lesson 1 - Idea (STUDY, 2 h): What moving to the cloud means
Goal: choose one sample workload and decide what 'success' means for it.
1. Explain in plain words: running programs and storing data on rented computers in a provider's data centre instead of on your own machines.
2. Learn the three service levels: renting raw machines, renting a place to run your programs, renting ready-made software. Give one everyday example each.
3. Describe a sample workload: for example a small shop website with a database, 200 visitors a day, files and daily backup. List parts, size, who uses it, what happens if it stops.
4. Set success rules: cost limit per month (with currency), maximum downtime, and a security rule.
Evidence: workload description and success rules.

## Lesson 2 - Idea (SHARE, 3 h): Kick-off circle
1. Each learner reads their one-page plan aloud (3 minutes).
2. Peers ask three questions: who is it for, why you, what could go wrong.
3. The mentor agrees the evidence you will produce in this module: an inventory, a migration plan, a cost and risk table and a rollback plan.
Evidence: your revised plan and the agreed evidence list.

## Lesson 3 - Action (DO, 14 h): Take the inventory
1. List every part: programs, databases, files, schedules, logins, outside services, and how they connect.
2. For each part, note owner, size, how often it changes, and how critical it is (1 to 5).
3. Mark data that is personal or sensitive and where law may require it to stay in a country or region.
4. Draw the 'today' diagram.
Evidence: inventory table, sensitivity marks, today diagram.

## Lesson 4 - Action (STUDY, 2 h): Cloud models, security and cost control
Short modules:
- Cloud models: public, private, mixed; the shared-responsibility idea (the provider secures the building and hardware, you secure your settings, accounts and data).
- Security: strong sign-in with a second step, least access for each person, encryption of stored and moving data, backups tested by restoring, logs kept.
- Cost control: pay per use, idle resources still cost, set budgets and alerts, right-size, turn off what you do not need, compare with the cost of staying put.
Check: 10 questions at the end of the module.

## Lesson 5 - Action (DO, 14 h): Plan the move
1. For each part choose: keep as is, move as is, rebuild, replace, or retire. Write the reason.
2. Draw the 'target' diagram and a step-by-step order of moves with a test after each.
3. Estimate monthly cost with the public price calculators of two providers; show assumptions. Add a 20% safety margin.
4. Write the risk table (what, chance, effect, reduction) and the rollback plan: how to return to the old setup within an hour.
Evidence: target diagram, move order, cost estimate, risk table, rollback plan.

## Lesson 6 - Value (SHARE, 6 h): Migration-review circle
1. Peers play 'what if' on your plan: what if a database is larger than you thought, what if the provider has an outage, what if a password leaks.
2. Compare the cost of staying versus moving over 3 years, including your time.
3. A mentor with IT operations experience reviews the rollback plan and the security rules.
Evidence: what-if notes, three-year comparison, reviewed rollback.

## Lesson 7 - Value (DO, 14 h): Finish and measure
1. Update the plan with the what-ifs.
2. Optionally run a small practice move of a sample website on a free tier and time it.
3. Write three lessons learned and one decision: move now, move later in phases, or stay.
Evidence: updated plan, practice-move timing if done, decision note.

## Lesson 8 - Empowerment (SHARE, 3 h): Review room
1. Present to a review room: the workload, the inventory, the plan, the costs, the risks and your decision.
2. Give two peers written feedback: one thing that is strong, one thing to fix.
3. Ask one real user, customer or reviewer for a short written note.
Evidence: slides or notes, two peer reviews, the written note.

## Lesson 9 - Regeneration (STUDY, 2 h): Check and next step
1. Take the 10-question check. Pass mark is 70% (draft).
2. Write your 90-day plan: what you will do next, how you will measure it, what you will learn next. Good follow-on courses: Internet Infrastructure Basics; Privacy Protection Practice; IT Service and Support.
3. Contribute back: share your inventory template, risk table or cost-estimate sheet so the next learner starts higher. Accepted items earn credits (rates are placeholders until the owner fixes the revenue plan).
Evidence: check result and the 90-day plan.

## Worked examples
1. Sample shop website: 200 visitors a day. Current monthly cost on rented hardware: 30. Cloud estimate: small server 12, database 10, storage and backup 4, traffic 2 = 28. Add 20% margin = 33.6.
2. Three years: staying 30 x 36 = 1,080. Cloud 33.6 x 36 = 1,209.6, plus 12 hours of migration work at 25 = 300, total 1,509.6. Moving costs 429.6 more; gain must come from resilience and less maintenance.
3. Rollback: switching the name record back takes 10 minutes if its time-to-live is set to 5 minutes before the move.
4. Downtime target 1 hour a month = 99.86% availability (1 - 1/720).

## Case exercise
A database is 3 times larger than listed and holds customer emails that may need to stay in your country. Questions: What changes in cost? In location? Which decision is yours and which belongs to an adviser? Write the updated plan.

## Check questions (draft set, 10)
1. Explain 'the cloud' in one sentence. 2. Name the three service levels. 3. What does shared responsibility mean? 4. Why keep a rollback plan? 5. Why test a backup by restoring? 6. Why do idle resources matter? 7. What data may need to stay in a country? 8. What does 'rebuild' mean compared with 'move as is'? 9. Why add a 20% margin to a cost estimate? 10. What was your decision and why?

## Rules for this module
No brand names or logos of other companies on any page, slide or file. No personal data of real people in shared files. No real customer data. No resources left running. Spending alert set before anything is created.
