C = dict(id='GL-36', title='Virtual Event Planning', group='Business and Commerce', level=3,
 summary='Plan and deliver an online event that people enjoy and finish: set goals, build the run of show, manage speakers and tech, and measure what happened.',
 outcomes=['Explain event types, goals and the roles needed.', 'Plan a programme, budget and promotion.', 'Analyse registration, attendance and feedback.', 'Create a run of show, tech checklist and speaker brief.', 'Evaluate the event and write lessons for the next.'],
 task='Plan, promote and deliver an online event of 45 to 90 minutes for at least 30 registrants, with run of show and a results report.',
 cond='A conferencing or webinar tool, a registration form, a spreadsheet, two helpers, a mentor with events experience and a peer circle. About 10 weeks part-time.',
 std='Goal and audience written; speakers briefed; full tech rehearsal done; captions or notes offered; consent for recording; at least 60% of registrants attend; satisfaction 4 of 5 or better; report within a week.',
 who='Event assistants, teachers, community leaders, marketers, students.', req='None.',
 safety='Protect attendee data and consent. Check accessibility. Do not share private links publicly.',
 mods=[
 ('Event types and goals', 'Know what the event is for.', ['Webinar, workshop, panel, launch, training.', 'Goal: learn, sell, connect, celebrate.', 'Audience size and level.', 'Success measure.'], 'Goal: 40 attendees learn to price a product; 80% report a plan.', 'Write goal and measure.', 'Measure is numeric.'),
 ('Programme and speakers', 'Short, active sessions.', ['Open, teach, interact, close.', 'Speaker brief and rehearsal.', 'Time per part.', 'Questions plan.'], '60 minutes: 5 welcome, 25 talk, 15 activity, 10 questions, 5 close.', 'Draft programme and speaker brief.', 'Times add to total.'),
 ('Budget and tools', 'Count the real costs.', ['Tool costs, speaker fees, design, promotion.', 'Free options.', 'Contingency 10%.', 'Break-even if paid.'], 'Budget 250 including 10% contingency.', 'Create a budget.', 'Total and currency shown.'),
 ('Registration and promotion', 'People must hear and sign up.', ['Landing page with date, time zone, benefit.', 'Consent for contact.', 'Reminders at 7 days, 1 day, 1 hour.', 'Partners help share.'], 'With reminders, attendance rises from 40% to 60% of sign-ups.', 'Build the form and reminders.', 'Form tested.'),
 ('Tech and rehearsal', 'Rehearse every piece.', ['Test audio, slides, polls, breakouts.', 'Roles: host, producer, moderator.', 'Backup plan: phone number, extra link.', 'Recording rules.'], 'Rehearsal finds slides not shared; fixed in two minutes.', 'Rehearse with all.', 'Checklist signed.'),
 ('Access and inclusion', 'Everyone can join.', ['Captions and slides ahead.', 'Time zones.', 'Plain language.', 'Low-data options.'], 'Slides sent the day before; audio-only option offered.', 'Run the access checklist.', 'All items done.'),
 ('Deliver', 'Smooth and warm.', ['Open early; greet.', 'Keep time.', 'Handle chat and issues.', 'Thank and share next steps.'], 'The producer posts the link to slides at minute 30.', 'Run the event.', 'Runs to time within 5 minutes.'),
 ('Measure and learn', 'Close the loop.', ['Attendance rate = attendees / registered.', 'Feedback form.', 'Follow-up email within a day.', 'Lessons and next plan.'], '42 of 60 attended = 70%; satisfaction 4.4.', 'Write the report.', 'Report names three changes.')],
 quiz=[('Name event types.', 'Webinar, workshop, panel, launch and training.'), ('Attendance rate?', 'Attendees divided by registered.'), ('Why rehearse?', 'To find problems before the audience does.'), ('Why reminders?', 'They raise attendance.'), ('Contingency purpose?', 'To cover surprises.'), ('Who is the producer?', 'The person who handles tech while the host speaks.'), ('Why captions?', 'Access and clarity.'), ('When may you record?', 'With notice and consent.'), ('What follows the event?', 'Thanks, feedback and materials.'), ('How measure success?', 'Against the numeric goal.')],
 rubric=[('Goal and plan', 'Numeric goal; programme', 'Plan adapted from rehearsal'), ('Promotion', 'Form and reminders', 'Partners share'), ('Delivery', 'On time', 'Smooth faults'), ('Access', 'Checklist done', 'Feedback from users with needs'), ('Report', 'Three changes', 'Changes applied next time')],
 jobs=[('Virtual event coordinator', 'Plans online events'), ('Webinar producer', 'Runs tech'), ('Community events assistant', 'Supports programmes'), ('Training coordinator', 'Organises courses')],
 next='Tele and Video Conferencing Operations; Online Library Building; Crowdfunding Platform Practice.',
 local='Data, consent and recording rules differ by place and attendee place; check each.',
 evidence='Your evidence: goal note, programme, budget, form, rehearsal checklist, access checklist, run of show and report.',
 ladder=[('Basics of meetings', 'Join and host a small call. Notes: practise.'), ('Awareness', 'Know event types. Notes: attend two.'), ('Foundation', 'This course. Notes: first event.'), ('Practitioner', 'Run a series. Notes: templates.'), ('Specialist', 'Larger events. Notes: sponsors.'), ('Advanced', 'Lead an events team. Notes: budgets.'), ('Super expert', 'Set method and teach teachers. Notes: review yearly.')])

C['deep'] = dict(mods=[
 ('No measurable goal.', '40 attendees; 80% report a plan.', 'What is your measure?'),
 ('Long talks.', '25 minutes of talk and 15 of activity.', 'How do you keep interaction?'),
 ('Forgetting contingency.', 'A 10% reserve covers a late fee.', 'What is your reserve?'),
 ('Single reminder.', 'Three reminders raise attendance.', 'When are yours?'),
 ('Testing the day itself.', 'A rehearsal finds the slides not shared.', 'What did rehearsal find?'),
 ('No captions.', 'Captions and slides ahead.', 'What did you provide?'),
 ('Overrunning.', 'Cut questions to stay on time.', 'Did you finish on time?'),
 ('Skipping follow-up.', 'Send thanks and slides in a day.', 'What did you send?')],
 gloss=[('Run of show', 'A timed script.'), ('Producer', 'Handles tech while the host speaks.'), ('Moderator', 'Manages questions.'), ('Registration', 'Sign-up for the event.'), ('Breakout', 'Small group room.'), ('Follow-up', 'Messages after the event.')],
 cases=[('The no-show speaker', 'A key speaker does not appear.', 'What do you do?', 'Run the backup activity, try the contact number and reschedule the talk.'),
        ('Low attendance', 'Only 30% of registrants attend.', 'Fix?', 'Send reminders, offer a recording, check time zones.')])
C['deep']['extra'] = [
 ['Study one event format.', 'Choose a date away from holidays.'],
 ['Brief speakers in writing.', 'Run a speaker rehearsal.'],
 ['Get quotes for tools.', 'Track spending weekly.'],
 ['Add the time zone to all notices.', 'Use a short link.'],
 ['Prepare a backup link.', 'Test sound with a guest.'],
 ['Offer notes and a recording.', 'Check colour contrast.'],
 ['Keep a facilitator for chat.', 'Thank attendees.'],
 ['Analyse feedback by theme.', 'Share lessons.']]

_ex = ['Goal: 40 attendees learn to price a product; success means 80% write a price plan by the end. Everything else follows from this line.', 'Programme for 60 minutes: 5 welcome, 25 talk, 15 activity, 10 questions, 5 close, with the speaker named for each part.', 'Budget 250 with 10% contingency: tool 60, design 40, promotion 80, speaker thanks 45, reserve 25.', 'Reminders at 7 days, 1 day and 1 hour raise attendance from 40% to 60% of 100 sign-ups, which is 20 more people.', 'Rehearsal finds slides were not shared and the poll tool was off. Both are fixed in 5 minutes during the rehearsal.', 'Slides are sent the day before, captions are on, and an audio-only option is offered. One attendee uses it.', 'The event starts at 10:00 and ends at 10:58; the producer posts the slide link at minute 30 and the feedback form at minute 55.', '42 of 60 registrants attended (70%); satisfaction 4.4; three changes: shorter intro, one more break, earlier reminder.']
_extra = ['Draw a one-page picture of the event day with roles and times.', 'List three questions the audience will probably ask and prepare answers.', 'Choose a title that tells people the benefit.', 'Set up a registration form that asks only for what you need.', 'Send speakers a technical guide with a test link.', 'Check time zones for the main audience.', 'Decide when and how recording will be announced.', 'Keep a printed run sheet in case of power or tool failure.', 'Have a second person ready to take over as host.', 'Prepare a closing slide with next steps.', 'Send thanks and a feedback form within a day.', 'Collect questions you did not answer and reply later.', 'Count what worked and what did not in a short table.', 'Keep all attendee data safe and delete it when the purpose ends.', 'Share the lessons with your peer circle.', 'Plan your next event date before the lessons fade.']
C['deep']['mods'] = [(m[0], _ex[i], m[2]) for i, m in enumerate(C['deep']['mods'])]
C['deep']['extra'] = [_extra[2*i:2*i+2] for i in range(8)]
