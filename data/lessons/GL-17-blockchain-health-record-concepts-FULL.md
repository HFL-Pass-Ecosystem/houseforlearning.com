# GL-17 Blockchain Health-Record Concepts: full lesson text (DRAFT v0.1, 31 Oct 2026)

Long Module, about 60 hours (DO 42 h, SHARE 12 h, STUDY 6 h). Brand-neutral. Aligned with recognised health-data protection and consent principles. This is not a licence or a certificate. This is a concepts module. You work only with invented sample records. It gives no medical, legal or technical-compliance advice, and no real patient data is ever used. Currency is always shown: use your own currency and write it next to every money number.

Tools: a free diagramming tool, a free spreadsheet, a free document editor, an optional free open-source ledger demo run on your own computer.

Journey: Idea > Action > Value > Empowerment > Regeneration.

## Lesson 1 - Idea (STUDY, 2 h): Why health records are hard to share
Goal: state the sharing problem in one patient story and ask whether a shared ledger helps.
1. Write a short invented story: a traveller falls ill far from home and the new clinic cannot see past records.
2. Explain a ledger in plain words: a list of entries that many parties keep copies of, where old entries cannot be quietly changed.
3. Explain that a blockchain is one kind of shared ledger; list what it is good at (tamper evidence, shared history) and what it is bad at (privacy, deleting, speed, storing big files).
4. Write the question: what should a ledger hold, and what must it never hold?
Evidence: the story and the question.

## Lesson 2 - Idea (SHARE, 3 h): Kick-off circle
1. Each learner reads their one-page plan aloud (3 minutes).
2. Peers ask three questions: who is it for, why you, what could go wrong.
3. The mentor agrees the evidence you will produce in this module: a record-flow map, a consent model, a risk table and a recommendation.
Evidence: your revised plan and the agreed evidence list.

## Lesson 3 - Action (DO, 14 h): Map how a shared record could work
1. Draw the actors: patient, clinic, laboratory, insurer, regulator. Draw what each can see and change.
2. Decide what goes on the shared ledger (for example only a proof that a record exists, a link, and a consent receipt) and what stays in the clinic's own protected system (the record itself).
3. Draw the flow when the patient grants a clinic access for 30 days.
4. Note what happens when the patient withdraws consent.
Evidence: actor map, data placement table, consent flow.

## Lesson 4 - Action (STUDY, 2 h): Ledger basics, health-data rules and consent
Short modules:
- Ledger basics: blocks, hashes (a fingerprint of data), why changing old data breaks the chain, public versus permissioned ledgers, why speed and cost differ from a normal database.
- Health-data rules: health data is sensitive; many countries require a lawful basis, tight access control, audit trails and a right to correct; the 'right to erase' and an unchangeable ledger can conflict, so personal data is kept off the ledger.
- Consent: clear, specific, time-limited, easy to withdraw, recorded; patients can see who looked at their record.
Check: 10 questions at the end of the module.

## Lesson 5 - Action (DO, 14 h): Test the idea on paper and with a demo
1. Take 5 invented records. Show which parts go to the clinic system and which fingerprint goes to the ledger.
2. Optionally run a small open-source ledger demo on your own computer. Add an entry, change the data, and watch the check fail.
3. Write a risk table: lost keys, wrong data entered, a clinic leaves the network, a court order, a breach at one clinic, a patient asks for erasure. For each, the effect and the control.
4. Compare with a plain secure database that has an audit log. When is that simpler and better?
Evidence: placement table for 5 records, demo notes if done, risk table, comparison.

## Lesson 6 - Value (SHARE, 6 h): Challenge circle
1. Peers play a patient, a clinic manager and a regulator and challenge your design.
2. List three problems that a ledger does not solve (wrong data at entry, access by staff who should not look, usability).
3. A mentor with health-IT or privacy experience reviews your data placement and consent model.
Evidence: challenge notes and reviewed design.

## Lesson 7 - Value (DO, 14 h): Finish and measure
1. Update the design.
2. Write a one-page recommendation: use a ledger for X, use a database for Y, or do not use a ledger.
3. Write three lessons learned and one decision.
Evidence: recommendation and decision note.

## Lesson 8 - Empowerment (SHARE, 3 h): Review room
1. Present to a review room: the patient story, the design, the risks, the comparison and your recommendation.
2. Give two peers written feedback: one thing that is strong, one thing to fix.
3. Ask one real user, customer or reviewer for a short written note.
Evidence: slides or notes, two peer reviews, the written note.

## Lesson 9 - Regeneration (STUDY, 2 h): Check and next step
1. Take the 10-question check. Pass mark is 70% (draft).
2. Write your 90-day plan: what you will do next, how you will measure it, what you will learn next. Good follow-on courses: Privacy Protection Practice; Biometric Sensor and Security Solutions; Virtual Medical Appointment Systems.
3. Contribute back: share your actor-map template, consent-flow drawing or risk table so the next learner starts higher. Accepted items earn credits (rates are placeholders until the owner fixes the revenue plan).
Evidence: check result and the 90-day plan.

## Worked examples
1. Invented records: 5 patients, each has 40 data fields; the ledger stores only a fingerprint (hash) of 64 characters and a consent receipt. 5 x 64 = 320 characters on the ledger instead of 200 data fields.
2. Tamper demo: change one letter in a record; the hash differs completely, so the check fails.
3. Access: a clinic is granted 30 days; day 31 access ends automatically. A consent receipt shows date, clinic, purpose, end date.
4. Comparison: a plain database with audit log handles 1,000 writes per second; a typical shared ledger may handle far fewer, so for daily clinic data the database is simpler.

## Case exercise
A patient asks to erase a record whose fingerprint is on the ledger. Questions: What can be erased? What stays? How does your design avoid a conflict? Write a half-page answer.

## Check questions (draft set, 10)
1. What is a ledger? 2. What is a hash? 3. Name one thing a blockchain does well and one it does badly. 4. Why keep personal data off the ledger? 5. How can the right to erase conflict with a ledger? 6. What does a consent receipt show? 7. What happens when a patient withdraws consent? 8. When is a normal database with an audit log better? 9. Name a problem a ledger does not solve. 10. What was your recommendation and why?

## Rules for this module
No brand names or logos of other companies on any page, slide or file. No personal data of real people in shared files. Invented records only. No real patient data. No claims that a ledger makes records safe by itself.
