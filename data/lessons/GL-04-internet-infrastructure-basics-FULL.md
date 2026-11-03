# GL-04 Internet Infrastructure Basics: full lesson text (DRAFT v0.1, 31 Oct 2026)

Long Module, about 60 hours (DO 42 h, SHARE 12 h, STUDY 6 h). Brand-neutral. Aligned with recognised network-design and basic security practice. This is not a licence or a certificate. Only test on your own equipment or a lab you are allowed to use; never scan or probe a network you do not own. Currency is always shown: use your own currency and write it next to every money number.

Tools: a free network simulator or a home router and two devices, a free spreadsheet, a free diagramming tool.

Journey: Idea > Action > Value > Empowerment > Regeneration.

## Lesson 1 - Idea (STUDY, 2 h): How data travels: from your phone to a server
Goal: draw how a message crosses a small network and pick the lab to build.
1. Trace one action, such as opening a web page, in plain words: your device, the local network, the router, the internet service provider, name lookup, the server, and back.
2. Write what each part does in one line: device, switch, router, modem, name server, server.
3. List the devices in your home or lab with their type and how they connect (cable or wireless).
4. Write a one-page plan: what small network you will set up or simulate, with how many devices and one goal (for example two groups of devices that cannot see each other).
Evidence: the traced path, the device list and the plan.

## Lesson 2 - Idea (SHARE, 3 h): Kick-off circle
1. Each learner reads their one-page plan aloud (3 minutes).
2. Peers ask three questions: who is it for, why you, what could go wrong.
3. The mentor agrees the evidence you will produce in this module: a network map, an address table, a set of tests and a security checklist.
Evidence: your revised plan and the agreed evidence list.

## Lesson 3 - Action (DO, 14 h): Draw and set up the network
1. Draw the network map: each device, each link, and the router in the middle.
2. Give each device an address. Write the table: device, address, group, purpose. Keep addresses in the private ranges meant for local use.
3. Set up the network in the simulator or on your own equipment. Change the default router password and the default wireless name.
4. Test that each device can reach the router and each other: record command, result and time.
Evidence: network map, address table, first test results.

## Lesson 4 - Action (STUDY, 2 h): Addressing, routing and security basics
Short modules:
- Addressing: what an address is, private and public ranges, what a subnet mask does, why two devices need to be in the same subnet to talk directly.
- Routing: what a router decides, what a default route is, what happens when a path is down, how name lookup turns a name into an address.
- Security basics: strong unique passwords, updates, turning off services you do not use, separating guest and main devices, why default settings are dangerous.
Check: 10 questions at the end of the module.

## Lesson 5 - Action (DO, 14 h): Separate, document, and break it safely
1. Create two groups of devices (for example office and guest). Set it so guests reach the internet but not the office devices.
2. Test the separation: record what should work, what should fail, and what actually happened.
3. Break one thing on purpose (unplug a link, change an address). Predict what fails first, then check and note the symptoms.
4. Write the documentation a stranger could use to rebuild the network: map, table, passwords policy (not the passwords), test list.
Evidence: separation test results, break-and-fix notes, rebuild document.

## Lesson 6 - Value (SHARE, 6 h): Review circle
1. Swap documents with a peer. Try to rebuild their network from the paper alone and note every gap.
2. Compare time to detect and fix the broken link. Discuss what a monitoring tool would add.
3. A mentor with network experience reviews your security checklist and tells you one risk you missed.
Evidence: peer rebuild notes, reviewed security checklist.

## Lesson 7 - Value (DO, 14 h): Finish and measure
1. Close the gaps found by your peer and the mentor.
2. Run the full test list again and record the results.
3. Write three lessons learned and one decision: expand the network, harden it more, or hand it over.
Evidence: final test list and decision note.

## Lesson 8 - Empowerment (SHARE, 3 h): Review room
1. Present to a review room: the map, the address table, the tests, the break-and-fix story and your decision.
2. Give two peers written feedback: one thing that is strong, one thing to fix.
3. Ask one real user, customer or reviewer for a short written note.
Evidence: slides or notes, two peer reviews, the written note.

## Lesson 9 - Regeneration (STUDY, 2 h): Check and next step
1. Take the 10-question check. Pass mark is 70% (draft).
2. Write your 90-day plan: what you will do next, how you will measure it, what you will learn next. Good follow-on courses: Internet of Things (IoT); DDoS and Cyber-Attack Prevention; IT Service and Support.
3. Contribute back: share your network map in your own drawing, rebuild guide or test list so the next learner starts higher. Accepted items earn credits (rates will be confirmed before opening).
Evidence: check result and the 90-day plan.

## Worked examples
1. Lab network: 4 devices. Private range 192.168.10.0 with mask 255.255.255.0 gives 254 usable addresses. Router 192.168.10.1, laptop .10, phone .11, printer .20.
2. Two groups: office 192.168.10.0/24 and guest 192.168.20.0/24. Guest must reach the internet but not office. Test: guest to internet pass, guest to printer fail (expected).
3. Break-and-fix: unplug the link to the router. Expected: every device loses the internet but office devices still reach the printer. Observed matched. Time to find the fault: 4 minutes.
4. Address count: a /24 has 2^8 = 256 addresses, minus network and broadcast = 254 usable.

## Case exercise
A guest phone can print on the office printer. Questions: What is likely wrong? How do you test it? What fix, and how do you prove it worked? Write the steps and the test table.

## Check questions (draft set, 10)
1. Name the main steps a web page request takes. 2. What does a router decide? 3. What is a private address range for? 4. Why must default passwords be changed? 5. What does separating guest and office devices achieve? 6. What is name lookup? 7. Why break something on purpose in a lab? 8. What goes into a rebuild document? 9. Why must you only test your own network? 10. What was your decision and why?

## Rules for this module
No brand names or logos of other companies on any page, slide or file. No personal data of real people in shared files. Never probe, scan or test networks you do not own. Never publish real passwords, addresses of real offices or personal devices.
