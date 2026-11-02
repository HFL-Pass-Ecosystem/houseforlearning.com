# GL-05 Internet of Things (IoT): full lesson text (DRAFT v0.1, 31 Oct 2026)

Long Module, about 60 hours (DO 42 h, SHARE 12 h, STUDY 6 h). Brand-neutral. Aligned with recognised device-security and data-minimisation practice. This is not a licence or a certificate. Use low-voltage parts only; do not collect personal data from people; check your local radio rules before using wireless links. Currency is always shown: use your own currency and write it next to every money number.

Tools: a free code editor, a low-cost microcontroller kit or a simulator, a free dashboard tool within its free limits (check the free-limits register first), a free spreadsheet.

Journey: Idea > Action > Value > Empowerment > Regeneration.

## Lesson 1 - Idea (STUDY, 2 h): Things that sense and report
Goal: choose one measurement that matters to a real person and one place to measure it.
1. Explain the chain in plain words: sensor, small computer, network link, storage, dashboard, alert.
2. Walk a home, farm, shop or school. List 8 things worth measuring (temperature, soil moisture, door open, water level, light, power use).
3. Pick one that costs money or causes worry when it goes wrong (for example a cold-store door left open). Ask the person affected what number would make them act.
4. Write the plan: what is measured, how often, who sees it, what alert and what limit.
Evidence: the measurement list, the person's alert number and the plan.

## Lesson 2 - Idea (SHARE, 3 h): Kick-off circle
1. Each learner reads their one-page plan aloud (3 minutes).
2. Peers ask three questions: who is it for, why you, what could go wrong.
3. The mentor agrees the evidence you will produce in this module: a working sensor-to-dashboard chain, a week of readings, an alert test and a security note.
Evidence: your revised plan and the agreed evidence list.

## Lesson 3 - Action (DO, 14 h): Build the sensor chain
1. Connect the sensor to the board or simulator. Read one value to the screen and check it against a trusted instrument or a known condition.
2. Send the reading over the network to the free dashboard tool at a sensible interval (every minute is often plenty; faster wastes power and free limits).
3. Show the readings as a line chart with units on the axis and the time zone written down.
4. Add the alert rule: when the value passes the limit, show a flag or send a message to yourself.
Evidence: wiring photo or screen capture, check against a trusted reading, first chart.

## Lesson 4 - Action (STUDY, 2 h): Sensors, protocols and device security
Short modules:
- Sensors: accuracy, drift, placement, why calibration matters, why a reading must have a unit and a time stamp.
- Protocols: in plain words, how small devices send light messages (publish and subscribe), why Wi-Fi, long-range radio and wired links differ in range, power and cost.
- Device security: change default passwords, keep software updated, send only what you need, encrypt the link, never leave test keys in code you share, plan how a lost device is switched off.
Check: 10 questions at the end of the module.

## Lesson 5 - Action (DO, 14 h): Run it for a week
1. Leave the chain running for 7 days in the real place with the person's agreement.
2. Each day record: readings received versus expected, gaps, alert flags, false alarms, battery or power issues.
3. Fix the biggest cause of gaps (power, signal, code) and note the change.
4. Test the alert on purpose once (for example open the door) and record how long it took to notice.
Evidence: 7-day readings log, gap fixes, alert test.

## Lesson 6 - Value (SHARE, 6 h): Show-and-review circle
1. Present the chart and the gaps. Peers question units, placement and the alert limit.
2. Work out uptime = readings received divided by readings expected. Aim to explain every gap.
3. A mentor reviews the security note: where are keys, who can see the data, what happens if the device is stolen.
Evidence: uptime figure, reviewed security note.

## Lesson 7 - Value (DO, 14 h): Finish and measure
1. Improve placement or code to reach the uptime you promised.
2. Give the person a one-page guide: what the chart means, what to do on an alert.
3. Write three lessons learned and one decision: scale to more places, keep as is, or stop.
Evidence: uptime result, user guide, decision note.

## Lesson 8 - Empowerment (SHARE, 3 h): Review room
1. Present to a review room: the problem, the chain, a week of data, the alert test, the security note and your decision.
2. Give two peers written feedback: one thing that is strong, one thing to fix.
3. Ask one real user, customer or reviewer for a short written note.
Evidence: slides or notes, two peer reviews, the written note.

## Lesson 9 - Regeneration (STUDY, 2 h): Check and next step
1. Take the 10-question check. Pass mark is 70% (draft).
2. Write your 90-day plan: what you will do next, how you will measure it, what you will learn next. Good follow-on courses: Robotics Fundamentals; Internet Infrastructure Basics; Drones: Operations and Applications.
3. Contribute back: share your wiring guide in your own drawing, alert-limit worksheet or security checklist so the next learner starts higher. Accepted items earn credits (rates will be confirmed before opening).
Evidence: check result and the 90-day plan.

## Worked examples
1. Cold-store sensor: reading every 60 seconds. Per day = 24 x 60 = 1,440 readings. Over 7 days = 10,080 expected.
2. Received 9,576. Uptime = 9,576 / 10,080 = 95%. Gaps came from two Wi-Fi drops (about 8 hours total).
3. Alert limit: the owner acts above 8 degrees. Test: the door was left open and the reading rose from 4 to 9 degrees; the alert fired 2 minutes after the first reading above 8.
4. Interval choice: every 10 seconds would be 6x the data (8,640 a day), with no gain because the temperature changes slowly.

## Case exercise
The device is stolen from the shop with the network key stored in its code. Questions: What can the thief do? How do you switch the device off? How should keys be stored next time? Write a one-page security note.

## Check questions (draft set, 10)
1. Name the parts of a sensor-to-dashboard chain. 2. Why does a reading need a unit and a time stamp? 3. What is calibration? 4. Why not send readings every second? 5. Name two device-security habits. 6. What does uptime mean here and how is it calculated? 7. Why test the alert on purpose? 8. What happens if a device is stolen? 9. Why collect only the data you need? 10. What was your decision and why?

## Rules for this module
No brand names or logos of other companies on any page, slide or file. No personal data of real people in shared files. No cameras or microphones pointed at people without clear consent and a lawful reason. Do not store personal data.
