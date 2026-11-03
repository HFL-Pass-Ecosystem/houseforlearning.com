# GL-16 Mobile Application Testing Services: full lesson text (DRAFT v0.1, 31 Oct 2026)

Long Module, about 60 hours (DO 42 h, SHARE 12 h, STUDY 6 h). Brand-neutral. Aligned with recognised software-testing and accessibility practice. This is not a licence or a certificate. Test only apps you are allowed to test (your own, a sample app, or one with written permission). Report problems privately to the owner first. Currency is always shown: use your own currency and write it next to every money number.

Tools: a free sample app or an open-source app, a phone or free emulator, a free spreadsheet for the test log, a free document editor.

Journey: Idea > Action > Value > Empowerment > Regeneration.

## Lesson 1 - Idea (STUDY, 2 h): What testing is for
Goal: choose a sample app and decide what 'good enough' means for its users.
1. Explain in plain words: testing is looking for the difference between what the app should do and what it does, before users find it.
2. Pick a sample app (a to-do list, a simple booking or notes app) with the owner's permission or an open-source one.
3. Write the user: who uses it, on what phone, in what place (poor signal, one hand, bright sun).
4. List the 5 most important things a user must be able to do and what failure would cost them.
Evidence: app choice, user note and the top-5 task list.

## Lesson 2 - Idea (SHARE, 3 h): Kick-off circle
1. Each learner reads their one-page plan aloud (3 minutes).
2. Peers ask three questions: who is it for, why you, what could go wrong.
3. The mentor agrees the evidence you will produce in this module: a test plan, 40 test cases, a defect list of real findings and a summary report.
Evidence: your revised plan and the agreed evidence list.

## Lesson 3 - Action (DO, 14 h): Write the test plan
1. Scope: what you will test and what you will not. Environments: which phones, versions, screen sizes, network speeds.
2. Write 40 test cases in a table: id, goal, steps, expected result, actual result, pass or fail.
3. Include the happy path, wrong inputs, empty fields, very long text, special characters, rotating the screen, interruptions (call, low battery), no network.
4. Add accessibility cases: large text, screen reader, contrast, tap size.
Evidence: test plan and 40 test cases.

## Lesson 4 - Action (STUDY, 2 h): Test design, device coverage and reporting
Short modules:
- Test design: equivalence groups (one value from each kind), boundaries (just inside and just outside a limit), and exploring with a time limit and a goal.
- Device coverage: why different phones, versions and screens matter, choosing a small set that covers most users using public usage statistics for your market.
- Reporting: a defect needs a clear title, exact steps, expected versus actual, evidence (screen capture), device and version, severity and who it affects.
Check: 10 questions at the end of the module.

## Lesson 5 - Action (DO, 14 h): Run the tests and find defects
1. Run all 40 cases on at least two device set-ups. Mark each result.
2. For each failure try to repeat it three times and find the shortest steps.
3. Write each defect clearly. Rate severity: blocks use, serious, minor, cosmetic.
4. Spend one hour on free exploration with a goal (for example 'break the booking form') and log what you find.
Evidence: completed test table, defect list with evidence, exploration notes.

## Lesson 6 - Value (SHARE, 6 h): Defect-review circle
1. Peers try to reproduce three of your defects from the text only. Note any that fail.
2. Count: tests passed, failed, defects by severity, defects found per hour.
3. A mentor with testing experience reviews your coverage and tells you which risk area you missed.
Evidence: reproduction results and counts.

## Lesson 7 - Value (DO, 14 h): Finish and measure
1. Rewrite unclear defects and add tests for the missed risk area.
2. Retest after any fix released by the owner and record the result.
3. Write three lessons learned and one decision: ready to release, release with known issues, or hold.
Evidence: final defect list, retest results, decision note.

## Lesson 8 - Empowerment (SHARE, 3 h): Review room
1. Present to a review room: the app, the plan, the findings, the counts and your release recommendation.
2. Give two peers written feedback: one thing that is strong, one thing to fix.
3. Ask one real user, customer or reviewer for a short written note.
Evidence: slides or notes, two peer reviews, the written note.

## Lesson 9 - Regeneration (STUDY, 2 h): Check and next step
1. Take the 10-question check. Pass mark is 70% (draft).
2. Write your 90-day plan: what you will do next, how you will measure it, what you will learn next. Good follow-on courses: Mobile Application Building (Europe course EU-04); IT Service and Support; Fitness Technology.
3. Contribute back: share your test-case template, defect-report template or device-coverage sheet so the next learner starts higher. Accepted items earn credits (rates will be confirmed before opening).
Evidence: check result and the 90-day plan.

## Worked examples
1. 40 test cases on 2 phones = 80 runs. Result: 70 pass, 10 fail. Pass rate = 87.5%.
2. Of 10 fails, 3 are the same cause (long text breaks the layout) = 8 unique defects. Severity: 1 blocks use, 2 serious, 3 minor, 2 cosmetic.
3. Defects per hour: 8 found in 6 hours of testing = 1.3 per hour.
4. Boundary test: field accepts 1 to 99 items; test 0, 1, 99, 100. Found 100 is accepted (should refuse).

## Case exercise
A defect would let anyone see another user's booking by changing a number in the address. Questions: Severity? Who do you tell and how? Should it go in the public list? Write the report.

## Check questions (draft set, 10)
1. What is testing for? 2. What is a boundary test? 3. Why test on more than one phone? 4. What does a good defect report contain? 5. Why repeat a failure three times? 6. Name two accessibility checks. 7. What does severity mean? 8. Why test with no network? 9. What is exploratory testing? 10. What was your release recommendation and why?

## Rules for this module
No brand names or logos of other companies on any page, slide or file. No personal data of real people in shared files. Do not publish defects in a live app that could be abused before the owner fixes them. No real user data.
