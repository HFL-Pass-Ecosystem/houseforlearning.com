C = dict(id='GL-34', title='Online Tutoring Platform', group='Business and Commerce', level=4,
 summary='Set up and run a small tutoring service online: safe tutor onboarding, good lessons, fair pricing, scheduling, learner progress and child safeguarding.',
 outcomes=['Explain how an online tutoring service works and its safeguarding duties.', 'Design a lesson format and a tutor checklist.', 'Analyse learner progress and tutor quality.', 'Create onboarding, scheduling and feedback processes.', 'Evaluate safety, learning gains and finance.'],
 task='Pilot an online tutoring service with at least 3 tutors and 10 learners (or a full simulation) for 4 weeks, with safeguarding rules, lesson plans, progress measures and finances.',
 cond='A video tool, scheduling tool, lesson templates, a spreadsheet, a mentor with education experience and a peer circle. About 12 weeks part-time.',
 std='Tutors checked and trained; safeguarding policy followed (no private contact, recorded sessions where agreed, parent consent); learning goals set; progress measured; feedback 4 of 5 or better; finances positive per hour.',
 who='Teachers, tutors, education entrepreneurs, students, community educators.', req='None.',
 safety='Children first: background checks where the law allows, consent from parents, sessions in view of agreed rules, no personal contact outside the platform. Follow child-protection law in your place.',
 mods=[
 ('What tutoring is', 'Support that fills a gap in learning.', ['Types: homework help, exam prep, skills, language.', 'One-to-one or small group.', 'What works: goals, practice, feedback.', 'Gaps and strengths first.'], 'A learner can add but struggles with fractions: start with a diagnostic.', 'List five learner needs and best formats.', 'Table with reasons.'),
 ('Safeguarding', 'Protect learners before everything.', ['Checks and references for tutors.', 'Parent consent and clear rules.', 'No private messages or meetings.', 'Reporting route and records.'], 'A tutor asks for a learner\'s personal number: refuse, report, review.', 'Write a safeguarding policy.', 'Mentor confirms it matches local rules.'),
 ('Recruit and train tutors', 'Quality tutors make the service.', ['Skills test and sample lesson.', 'Training on the platform and rules.', 'Code of conduct.', 'Ongoing observation.'], 'Of 10 applicants 4 pass a test lesson; those 4 complete training.', 'Design an onboarding path.', 'Path has check, training, sign-off.'),
 ('Lesson design', 'Short, clear, active.', ['Goal, warm-up, teach, practice, check, recap.', 'Use shared screen and exercises.', 'Adapt to age and level.', 'Record homework and next step.'], '45 minutes: 5 warm-up, 10 teach, 20 practice, 5 check, 5 recap.', 'Plan three lessons.', 'Each has a measurable goal.'),
 ('Scheduling and tools', 'Make booking simple.', ['Time zones and reminders.', 'Cancellation rules.', 'Tool checks before the lesson.', 'Backup for tech failures.'], 'A reminder 24 hours before cuts no-shows from 15% to 5%.', 'Set up booking and reminders.', 'Test with a family.'),
 ('Pricing and finance', 'Fair to tutors and families.', ['Hourly rate; package; discounts.', 'Platform fee; tutor pay.', 'Payment through a licensed partner.', 'Refund rules.'], 'Price 20 an hour; tutor 14; fees 1.20; margin 4.80.', 'Build a pricing sheet.', 'Margin positive per hour.'),
 ('Progress and feedback', 'Show learning, not just attendance.', ['Pre and post checks.', 'Parent update after each month.', 'Tutor reviews.', 'Adjust goals.'], 'Quiz score from 40% to 70% in 4 weeks.', 'Measure progress for 10 learners.', 'Gain calculated.'),
 ('Quality and growth', 'Keep standards as you grow.', ['Observe lessons.', 'Handle complaints.', 'Collect testimonials with consent.', 'Plan 90 days.'], 'Observations find tutors talk 80% of the time; coach to ask more.', 'Report on the pilot.', 'Report lists three changes.')],
 quiz=[('Why safeguarding first?', 'Children\'s safety comes before anything else.'), ('No private contact because?', 'It prevents harm and protects tutors.'), ('Name lesson steps.', 'Goal, warm-up, teach, practice, check, recap.'), ('How measure progress?', 'Pre and post checks.'), ('Why reminders?', 'They reduce no-shows.'), ('What must tutors sign?', 'Code of conduct.'), ('How to pay?', 'Through a licensed payment partner.'), ('Why observe lessons?', 'To keep quality up.'), ('What is a diagnostic?', 'A short check to find gaps.'), ('Who gets updates?', 'Parents or guardians.')],
 rubric=[('Safeguarding', 'Policy followed', 'Audit finds no gaps'), ('Lessons', 'Plans with goals', 'Observation scores high'), ('Operations', 'Booking works', 'No-show rate under 8%'), ('Learning', 'Gains measured', 'Gains above target'), ('Finance', 'Margin positive', 'Plan for growth')],
 jobs=[('Online tutor', 'Teaches learners'), ('Tutoring coordinator', 'Runs schedules and quality'), ('Learning support assistant', 'Helps learners'), ('Education entrepreneur', 'Runs a small service')],
 next='Online Library Building; Virtual Event Planning; Tele and Video Conferencing Operations.',
 local='Child-protection, tutor registration and privacy rules differ by place; check before you launch.',
 evidence='Your evidence: safeguarding policy, tutor onboarding, lesson plans, scheduling test, pricing sheet, progress data and pilot report.',
 ladder=[('Basics of helping learners', 'Explain a topic to a friend. Notes: teach-back.'), ('Awareness', 'Know safeguarding. Notes: read policy.'), ('Foundation', 'Tutor a peer. Notes: observed.'), ('Practitioner', 'This course. Notes: pilot.'), ('Specialist', 'Exam or special-needs tutoring. Notes: training.'), ('Advanced', 'Lead a team of tutors. Notes: quality system.'), ('Super expert', 'Set method and teach teachers. Notes: safeguarding review.')])

C['deep'] = dict(mods=[
 ('Starting with price instead of learner need.', 'A diagnostic reveals fractions are the gap.', 'What gap did you find?'),
 ('Skipping checks.', 'Checks and references before any tutor teaches.', 'What checks did you do?'),
 ('Lenient onboarding.', 'Only four of ten pass a sample lesson.', 'How do you select?'),
 ('Lessons that are all talking.', 'Practice time is 20 of 45 minutes.', 'How much do learners do?'),
 ('Complicated booking.', 'Reminders cut no-shows to 5%.', 'What is your no-show rate?'),
 ('Hidden fees.', 'Clear price with a platform fee shown.', 'What is the margin?'),
 ('Reporting attendance only.', 'Show pre and post scores.', 'What gain?'),
 ('Ignoring complaints.', 'Respond within a day.', 'How many complaints?')],
 gloss=[('Safeguarding', 'Protecting learners from harm.'), ('Diagnostic', 'A short check of what a learner knows.'), ('Onboarding', 'Bringing tutors into the service.'), ('Session recording', 'A recording kept with consent.'), ('Progress measure', 'Evidence of learning gain.'), ('Code of conduct', 'Rules tutors agree to.')],
 cases=[('The private message', 'A tutor messages a learner outside the platform.', 'What do you do?', 'Stop, report per policy, inform the parent, review the tutor.'),
        ('The no-show', 'A learner misses three sessions.', 'Response?', 'Contact the parent, adjust times, offer a pause.')])
C['deep']['extra'] = [
 ['Interview parents.', 'Check exam boards for your place.'],
 ['Keep a safeguarding lead.', 'Run annual refreshers.'],
 ['Observe sample lessons.', 'Give tutors a handbook.'],
 ['Share slides with learners.', 'Plan quick wins.'],
 ['Test time zones.', 'Keep a backup tool.'],
 ['Pay tutors on time.', 'Refund fairly.'],
 ['Update parents monthly.', 'Re-test after eight weeks.'],
 ['Collect testimonials with consent.', 'Plan to scale slowly.']]

_ex = ['A diagnostic shows a learner scores 4 of 10 on fractions and 9 of 10 on addition; the first six sessions focus on fractions.', 'Of 10 tutor applicants, 4 pass a sample lesson, 3 pass reference checks and 3 begin training; the process stays strict by design.', 'A 45-minute lesson: 5 warm-up, 10 teach, 20 practice, 5 check, 5 recap. The tutor speaks for about 15 minutes in total.', 'A reminder 24 hours and 1 hour before cuts no-shows from 15% to 5%, saving about 4 lost lessons in 80.', 'Price 20 an hour; tutor 14; fees 1.20; margin 4.80. At 50 hours a month that is 240.', 'Pre-quiz 40% and post-quiz 70% after 4 weeks give a gain of 30 points; the report shows both.', 'A parent complains the tutor ran 10 minutes over. You reply within a day, set a timer rule and check the next two sessions.', 'Three tutors observed: one talks 80% of the time. Coaching on open questions drops it to 45% in a month.']
_extra = ['Visit a tutoring session as an observer, with permission, and note what the learner did.', 'Write the safeguarding policy in plain language that parents can read.', 'Check that only approved tools and accounts are used for lessons.', 'Record sessions only where parents have agreed in writing.', 'Give learners a way to report a worry that does not depend on the tutor.', 'Keep all tutor documents in a locked place with access logs.', 'Set standard lesson plans but allow tutors to adapt them.', 'Share a one-page guide for parents on how to prepare.', 'Test a lesson on slow internet and write the fallback.', 'Agree a cancellation and make-up lesson policy.', 'Check payments are through a licensed partner.', 'Collect feedback from learners in a short, friendly way.', 'Compare progress for different groups of learners to spot gaps.', 'Thank tutors with regular, specific feedback.', 'Review the safeguarding policy every term.', 'Write a 90-day plan with a number of learners, tutors and a quality target.']
C['deep']['mods'] = [(m[0], _ex[i], m[2]) for i, m in enumerate(C['deep']['mods'])]
C['deep']['extra'] = [_extra[2*i:2*i+2] for i in range(8)]
