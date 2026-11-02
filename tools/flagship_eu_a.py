#!/usr/bin/env python3
"""Flagship-depth pages for EU-01..EU-05. Own wording. Output: site/learn-flagship-eu-0N.html (new files)."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from flagship_data_eu_ladder import LADDER
from flagship_eu_a_rubric import RUBRIC
from ladder_common import deep_slide, LADDER_MODULE_IDX, quiz_for_module, pick_module, MODULE_OVERRIDE
LV = {1: 'L1 Basic', 2: 'L2 Awareness', 3: 'L3 Foundation', 4: 'L4 Practitioner', 5: 'L5 Specialist', 6: 'L6 Advanced', 7: 'L7 Super expert'}
e = html.escape

RUBRIC_STD = [("Evidence quality", "Claims without records", "Records for most claims", "Every claim linked to a dated record"),
              ("Numbers and units", "Missing units or currency", "Correct, units shown", "Correct, with a check calculation and sensible rounding"),
              ("Safety and rules", "Rules ignored", "Rules named and followed", "Rules checked with the local authority and a written note kept"),
              ("Customer or user focus", "No real user", "One real user", "Several real users with changes made from their feedback"),
              ("Reflection", "No lessons written", "Three lessons written", "Lessons turned into a changed plan with dates")]

C = []
# ---------------- EU-01 FOOD ----------------
C.append(dict(id='EU-01', title='Food Industry and Food Technology', lvl='L4 Practitioner', hours=150,
 summary='Plan, make, price and sell one small food product safely, from first idea to a 30-day pilot with real buyers.',
 outcomes=[('Understand','Explain the main food hazards and how a simple hazard-control plan stops them.'),('Apply','Scale a recipe, run trial batches and log yield, time and temperature.'),('Analyse','Calculate cost per unit, margin and waste, and find the biggest cost.'),('Evaluate','Judge shelf life from tests and decide scale, change or stop.'),('Create','Design a compliant label, a pack and a one-page product file.')],
 task='Run a 30-day pilot of one small food product with a local anchor partner and keep a full record.',
 cond='About 150 hours over 3 to 6 months. A licensed shared kitchen or partner premises, a scale, a thermometer, a free spreadsheet, a mentor and a peer circle.',
 std='Hazard plan complete; every batch logged; cost sheet reviewed by a mentor; label checked with the local food authority; at least 70% on the check.',
 safety='Process learning only. You must follow your local food-safety law and may only sell from premises and with registrations your local food authority accepts.',
 mods=[
 ("Find a gap and a first buyer","Understand",5,"Good food businesses start with a person who will pay, not a recipe. Spend an hour in a market or shop and see what is missing.",
  ["Write down 10 products with price per kilo or pack (with currency) and who buys them.","Look for a gap: taste, size, diet, price point, freshness, convenience.","Talk to 5 possible buyers (a cafe, a shop, a canteen, neighbours): what do you buy now, how often, what do you pay, what annoys you?","Write a one-page idea: product, buyer, hoped-for price, pack size."],
  "A shopper survey of 5 cafes finds all buy bought-in biscuits at EUR 0.60 each and complain about stale stock. Idea: fresh small-batch oat biscuits, 12 per tray, EUR 0.45 each, delivered twice a week.",
  "Complete the market table and the 5 buyer notes; draft the one-page idea.","Ten products priced; five buyers spoken to; one buyer named."),
 ("Food safety as a way of thinking","Apply",6,"Hazard thinking means: list each step, ask what could go wrong, and decide how you stop it. The aim is not paperwork; it is preventing harm.",
  ["Four kinds of hazard: germs (biological), chemical, foreign bodies (physical) and allergens.","Control points: cooking temperature, cooling time, cold storage, cleaning, hand washing, separating raw from ready food.","Safe temperatures: keep cold food cold and hot food hot; the danger zone is the range where germs grow quickly. Use your authority's exact figures.","Records: a simple daily log of temperatures, cleaning and batch codes is your proof."],
  "Step 'cool cooked rice': hazard = spores grow if left warm; control = cool quickly to the authority's limit and refrigerate; check = timed temperature log; if it fails, discard.",
  "Draw the flow of your product from delivery to sale and mark every hazard and control.","Every step has a hazard question and a control; the allergen list is complete."),
 ("Recipe, scaling and yield","Apply",10,"A home recipe is not a production recipe. Weigh everything and record process, time and temperature.",
  ["Convert to weight (grams) not cups: weight is repeatable.","Scale by a factor, then test: some things (salt, spice, baking time) do not scale in a straight line.","Yield = weight out divided by weight in. Track it for every batch.","Change one thing per trial; record taste, texture, colour and yield."],
  "Batch of 1.0 kg dough bakes to 0.85 kg: yield 85%. Scaling to 5 kg gives 4.25 kg expected. If you get 4.0 kg, investigate: oven time, moisture, measuring error.",
  "Build three trial batches, one change each; record all in a table.","Three records with yield and a chosen final recipe with reasons."),
 ("Shelf life and storage","Analyse",8,"Shelf life is what you can prove, not what you hope. Heat, water in the food, acid, salt, sugar, air and packaging all matter.",
  ["Keep samples of each batch in the same pack as sold and check on days 1, 3, 7 and 14.","Judge look, smell, texture and (with your authority's guidance) safe testing.","Use a date label that is shorter than the tested life, with a safety margin.","Store and transport at the temperature your tests used."],
  "Samples stored at 5 °C stay good to day 10. You set a 7-day 'use by' with a 3-day safety margin.",
  "Run a shelf-life test and decide the date label.","Sample records for four dates; label date is shorter than tested life."),
 ("Packs and labels","Create",8,"A label is a legal document and a sales tool. Each country has its own rules; write down the rule you must follow and who told you.",
  ["Usual items: name, ingredients in weight order, allergens clearly shown, net weight, batch code, date, maker contact.","Never print health claims such as 'cures' or 'boosts immunity'.","Pack choice affects shelf life, cost and waste; avoid over-packing.","Ask the local food authority to check your label draft before printing."],
  "A label draft shows 'Oat biscuits. Ingredients: oats, butter (milk), sugar, flour (wheat). Contains: milk, wheat. Net weight 250 g. Batch 0417. Use by 24.05.' It was checked by the authority.",
  "Draft the label and get one expert comment.","All required items present; allergens highlighted; no claims."),
 ("Costing and pricing","Evaluate",12,"Know the cost of one unit before you set the price. Many beginners forget packaging, energy, rent share, delivery and waste.",
  ["Cost per unit = total cost divided by units sold (not units made).","Margin = (price minus cost) divided by price.","Include labour at a fair hourly rate, even if you pay yourself.","Check the break-even: fixed costs divided by margin per unit."],
  "Batch of 100 biscuits: ingredients EUR 14, packaging EUR 6, energy EUR 3, kitchen share EUR 12, labour 3 h at EUR 12 = EUR 36; total EUR 71; waste 5 units; cost per sold unit = 71/95 = EUR 0.75. At price EUR 1.20 margin = 37.5%.",
  "Build your cost sheet with currency on every line; present it to your peer circle.","Mentor finds no missing cost; margin is calculated twice by different routes."),
 ("Run the 30-day pilot","Apply",60,"Pilot means small, real and recorded. Sell to real buyers, or offer a paid trial, and learn quickly.",
  ["Daily log: date, batch code, cost, units made, sold, waste, complaints.","Keep a sample of every batch until it expires.","Write down each complaint: what happened and what you changed.","Review weekly with your mentor."],
  "Week 2 log shows 12 returned units from one batch. Cause found: under-baked centre. Fix: add a timed check and a core-temperature rule. Returns fall to 2 in week 3.",
  "Run the 30 days and keep the log.","30 days recorded; every complaint answered; weekly review notes kept."),
 ("Present, decide and plan","Evaluate",41,"A decision beats a feeling. Compare your first plan with what happened, and choose scale, change or stop.",
  ["Make a before/after table: cost per unit, waste percent, repeat buyers.","Write three lessons learned.","Decide: scale (what you need), change (what), or stop (why).","Give two peers written feedback: one thing strong, one thing to fix."],
  "Result: waste fell from 14% to 5%; repeat buyers 6 of 9. Decision: scale to two cafes, buy a second tray rack, keep price.",
  "Present to a review room; collect a written note from one buyer.","Decision supported by numbers; two peer reviews given."),
 ],
 quiz=[('Name the four kinds of food hazard.', 'Biological (germs), chemical, physical (foreign bodies), allergens.', 2), ('Why separate raw and ready foods?', 'To stop germs moving from raw to food that will not be cooked again.', 2), ('Yield for 4.0 kg out from 5.0 kg in?', '80%.', 3), ('Margin: price EUR 1.20, cost EUR 0.75?', '(EUR 1.20 - EUR 0.75) / EUR 1.20 = 37.5%.', 6), ('What must a label show?', 'Name, ingredients by weight, allergens, net weight, batch code, date, maker contact.', 5), ('Two factors that lengthen shelf life?', 'Lower temperature, acid, salt, sugar, less water, suitable packaging.', 4), ('Why keep a sample from each batch?', 'To check what happens to a batch over its life and trace problems.', 4), ('What do you do after a complaint?', 'Record it, find the cause, change the process, note the change.', 7), ('Which costs do beginners forget?', 'Packaging, energy, rent share, delivery, waste, labour.', 6), ('What decision options end the pilot?', 'Scale, change or stop, with reasons from the numbers.', 8)],
 jobs=["Small-batch food producer","Production assistant in a food factory","Food-safety record keeper","Cafe or canteen supplier","Quality assistant"],
 prereq="None", ))

# ---------------- EU-02 CRAFT ----------------
C.append(dict(id='EU-02', title='Handmade Goods and Craft Enterprise', lvl='L4 Practitioner', hours=150,
 summary='Turn a craft into a repeatable small business: batch making, honest pricing, product photos and a story that sells.',
 outcomes=[('Understand','Explain unit economics for handmade goods.'),('Apply','Make and sell 20 units through a pilot channel.'),('Analyse','Compare time, material cost and margin per unit.'),('Evaluate','Judge which channel and price work best.'),('Create','Produce product photos, a story and a customer-safe label.')],
 task='Make and sell 20 units of one handmade product through a pilot channel and record time, materials and margin per unit.',
 cond='About 150 hours over 3 to 6 months. Own tools and materials, a phone camera, free spreadsheet, a pilot channel (market stall, shop partner or online page), a mentor and a peer circle.',
 std='20 units sold or placed; cost sheet reviewed; photos meet the checklist; product safety and consumer rules checked with the local authority; 70% on the check.',
 safety='Check product-safety and consumer-goods rules for your product type and place (for example toys, cosmetics and candles have special rules). This course gives method only.',
 mods=[
 ("Choose a product and a customer","Understand",6,"A product that a particular person wants beats a beautiful product nobody asked for.",
  ["List 5 things you can make well and 5 types of buyer.","Pick one pairing and write why this buyer would pay.","Look at 10 similar products: price, size, material, story.","Decide what is different: material, design, size, purpose, story."],
  "Maker of cotton pouch bags notes 10 market stalls sell plain pouches at EUR 8 to 12. Gap: pouches sized for reading glasses with a pocket, at EUR 14.",
  "Complete the 10-product comparison and a one-page product idea.","Ten comparisons; one clear difference; one named buyer."),
 ("Time and materials","Apply",10,"Handmade means time. Measure how long each step takes, because time is usually the biggest hidden cost.",
  ["Break the job into steps: cut, sew or shape, finish, pack.","Time five makes; use the average.","List each material with quantity, cost and waste.","Write a simple method so another person could make the same item."],
  "Times for five pouches: 42, 39, 41, 37, 36 min; average 39 min. Fabric 0.4 m at EUR 6/m = EUR 2.40, thread EUR 0.20, lining EUR 0.60.",
  "Time five items and write the method card.","Five times recorded; method card clear enough for a peer to follow."),
 ("Quality and batch making","Apply",14,"A batch is a group made together: faster and more consistent. Quality means every item meets the same standard.",
  ["Make jigs, templates and patterns so sizes repeat.","Write a quality checklist: size, finish, strength, look.","Make 20 in batches of 5 and compare times.","Reject and rework items that fail the checklist; log them."],
  "With a cutting template, cutting time drops from 9 to 4 minutes; batch of 5 takes 140 min against 195 min making one by one.",
  "Build 20 units to your checklist.","Batch time lower than single time; rejection rate recorded."),
 ("Pricing for profit","Evaluate",14,"Price is not cost plus hope. Price covers materials, your time, tools, selling costs and a profit for growth.",
  ["Unit cost = materials + labour (time x fair hourly rate) + packaging + selling cost share.","Margin = (price minus cost) divided by price.","Test two prices with different buyers and watch what happens.","Check against competitors but do not copy their price without your own numbers."],
  "Pouch: materials EUR 3.20, labour 39 min at EUR 12/h = EUR 7.80, packaging EUR 0.40, stall fee share EUR 0.90; cost EUR 12.30. At EUR 14, margin = 12%; at EUR 18, margin 32%. Test 18.",
  "Build your cost sheet and choose two test prices.","Currency on all lines; margin computed for both prices."),
 ("Photos, story and listing","Create",12,"Buyers cannot touch your product online, so photos and words do the work.",
  ["Photograph in daylight near a window, plain background, 5 angles including scale and detail.","Write a short story: who made it, from what, why it is useful.","Describe size, material, care and delivery plainly.","Never use a photo of another maker's work."],
  "A listing shows 5 photos and the text 'Hand-sewn cotton pouch, 18 x 9 cm, fits glasses and a card. Wash cold. Ships in 3 days.'",
  "Photograph and write one listing; get two peers to say what they would ask.","Five photos meet the checklist; the listing answers likely questions."),
 ("Sell in a pilot channel","Apply",50,"Sell your 20 units where real buyers are: a stall, a shop partner or an online page.",
  ["Agree terms in writing with any shop (price, share, payment date).","Record every sale: date, item, price, buyer type (no personal data).","Ask each buyer one question: why did you pick this?","Note repeat buyers and requests."],
  "Stall day: 11 sold of 20 at EUR 18; four buyers asked for a different colour. Add two colours next batch.",
  "Sell 20 units and keep the sales record.","Sales table complete; two buyer comments acted on."),
 ("Rules and safety","Analyse",12,"Selling means obeying rules: consumer rights, product safety, tax and (for some products) labelling.",
  ["Find which rules apply to your product and place; ask the local authority or a small-business adviser.","Keep receipts and sales records.","Give a clear returns promise and keep it.","Do not claim materials or origin you cannot prove."],
  "A candle maker learns that labels must carry warning text and a batch code; she adds both and keeps a test log for every batch.",
  "Write a one-page rules note naming each rule and its source.","Each rule has a named source and a date."),
 ("Review and plan","Evaluate",32,"After the pilot, decide how to grow without losing quality.",
  ["Compare time and margin for batch 1 and batch 4.","Write three lessons learned.","Choose: more of the same, a new colour or size, or a new channel.","Give two peers written feedback."],
  "Margin rose from 12% to 32% after templates and a price change; plan: one new stall and a 40-unit batch.",
  "Present evidence at a review room.","Plan with numbers and dates; two peer reviews given."),
 ],
 quiz=[('Why time each step?', 'Time is often the biggest hidden cost.', 2), ('Define batch making.', 'Making a group of items together for speed and consistency.', 3), ('Unit cost formula?', 'Materials + labour + packaging + selling cost share.', 4), ('Margin when price is EUR 18 and cost is EUR 12.30?', '(18 - 12.30) / 18 = 31.7%, about 32%.', 4), ('What belongs in a listing?', 'Photos, size, material, care, delivery, a short story.', 5), ('Why a quality checklist?', 'So every item meets the same standard and rejects are caught.', 3), ('What should you do when a shop sells for you?', 'Agree price, share and payment date in writing.', 6), ('Why ask buyers why they chose it?', 'To learn what the market values and improve.', 6), ('Name one product-safety step.', 'Check the rules for your product type with the local authority.', 7), ('What decides growth?', 'Margin and quality at the higher volume, not only demand.', 8)],
 jobs=["Craft entrepreneur","Production assistant","Product photographer assistant","Market and online seller","Craft trainer"], prereq="None"))

# ---------------- EU-03 ONLINE SALES ----------------
C.append(dict(id='EU-03', title='Online Sales and E-Commerce Operations', lvl='L4 Practitioner', hours=150,
 summary='Set up and run a small online shop: product pages, stock, orders, delivery, payments, customer service and simple numbers.',
 outcomes=[('Understand','Explain the order journey from visit to delivery.'),('Apply','Build product pages and run 20 real orders.'),('Analyse','Read conversion, order value and return numbers.'),('Evaluate','Judge delivery, price and page changes by results.'),('Create','Write clear policies and customer messages.')],
 task='Run a small online shop through at least 20 real or trial orders and keep a full record.',
 cond='About 150 hours over 3 to 6 months. A free or low-cost shop tool, a product with stock, a card or bank-transfer payment page, a mentor and a peer circle.',
 std='20 orders processed; every order tracked; policies written; numbers reported weekly; data-protection and consumer rules checked; 70% on the check.',
 safety='Collect only the personal data you need, keep it safe and delete it when no longer needed; follow your place\'s consumer and data law.',
 mods=[
 ("The order journey","Understand",8,"Every sale is a chain: visit, view, add to basket, checkout, pay, pick, pack, ship, deliver, support. A break anywhere loses money.",
  ["Draw the chain for your shop and mark where customers drop out.","Learn the four key numbers: visits, conversion rate, average order value, returns.","Know who does what: you, courier, payment partner, customer.","Set a promise: price, delivery time and returns."],
  "100 visits, 3 orders: conversion 3%. Average order EUR 28. Revenue EUR 84 per 100 visits. Doubling conversion to 6% doubles revenue without more visitors.",
  "Draw your order journey and compute the four numbers for a sample week.","Journey complete; four numbers calculated correctly."),
 ("Product pages that sell","Create",14,"Buyers decide in seconds. A page answers: what is it, is it for me, can I trust it, what does it cost, when does it arrive?",
  ["Title: plain words a buyer would search.","Photos: clear, several angles, scale.","Description: size, material, use, care; the top 3 benefits first.","Price, delivery and returns visible without scrolling."],
  "Weak title 'Item 17'. Strong title 'Glass water bottle 750 ml with cork lid'. Add: 'Delivered in 3 working days. Returns within 14 days.'",
  "Build five product pages and have two peers try to buy.","Peers find price, delivery and returns within 10 seconds."),
 ("Stock and suppliers","Apply",16,"Stock is cash sitting on a shelf. Too little loses sales; too much traps money.",
  ["Count stock weekly and compare with the shop's records.","Reorder point = daily sales x supplier lead time + safety stock.","Track cost per item including delivery to you.","Mark slow sellers and discount before they become dead stock."],
  "Sales 4 per day, lead time 5 days, safety stock 8: reorder when 28 remain.",
  "Set reorder points for your five products.","Counts match records within 2%; reorder rules written."),
 ("Payments, delivery and returns","Apply",16,"Choose simple, trusted ways to be paid and to deliver.",
  ["Use card or bank-transfer payment pages and trusted partners; never store card numbers.","Compare couriers on price, speed, tracking and damage record.","Set a returns policy you can afford and describe it clearly.","Reconcile payments with orders every week."],
  "Courier A EUR 4.20 in 2 days; courier B EUR 3.50 in 4 days. For orders over EUR 40 offer free delivery on A.",
  "Write delivery and returns rules and test the process with one order.","Rules published; test order delivered; reconciliation done."),
 ("Customer service","Create",14,"Service wins repeat buyers. Answer fast, politely and with a clear next step.",
  ["Answer within one working day; say when you will update.","Use short templates for the ten commonest questions.","When something is wrong, apologise once, fix it, and say what changed.","Keep a log of problems and review it monthly."],
  "Template: 'Thank you for your message. Your order 1042 left us on Monday and the tracking link is below. If it has not arrived by Friday, write to us and we will trace it.'",
  "Write ten templates and role-play two hard messages.","Each template has a clear next step; two role-plays reviewed."),
 ("Get visitors and measure","Analyse",20,"Traffic costs time or money. Choose a few channels and measure each.",
  ["Free channels: search-friendly titles, social posts, word of mouth, marketplace listings.","Paid: only with a budget cap and a target cost per order.","Track source of each order if you can.","Cost per order = spend divided by orders from that spend."],
  "EUR 30 on a social ad brings 6 orders: EUR 5 per order. Average margin per order EUR 9, so the ad earns EUR 4 per order.",
  "Run two small channels for two weeks and compare.","Spend, orders and cost per order tabulated."),
 ("Run 20 orders","Apply",48,"Practice is the course. Process orders with care and learn from every error.",
  ["Order log: date, order number, items, value, delivery, issue, fix.","Pack carefully; photograph packed orders for proof.","Review mistakes weekly and add a check to stop repeats.","Keep personal data only as long as needed."],
  "Week 3 log shows two wrong-size orders. New check added: read size aloud when picking. No repeats in week 4.",
  "Complete 20 orders with a full log.","20 orders logged; every issue has a fix."),
 ("Report, decide and plan","Evaluate",14,"Report to yourself like a manager: weekly numbers, decisions, next steps.",
  ["Weekly report: visits, conversion, average order, returns, margin.","Change one thing at a time and compare.","Three lessons learned.","Decide: grow, fix or stop."],
  "Page change raised conversion from 2.5% to 3.4% in two weeks; plan: replicate on all products.",
  "Present at a review room; give two peers feedback.","Decision supported by numbers."),
 ],
 quiz=[('Conversion rate for 5 orders from 200 visits?', '2.5%.', 1), ('Reorder point formula?', 'Daily sales x lead time + safety stock.', 3), ('What must a product page show quickly?', 'Price, delivery and returns.', 2), ('Why never store card numbers?', 'It creates security and legal risk; use trusted payment partners.', 4), ('What belongs in an order log?', 'Date, order number, items, value, delivery, issue, fix.', 7), ('Cost per order for EUR 40 spend and 8 orders?', 'EUR 5.', 6), ('Why reconcile payments weekly?', 'To catch missing or wrong payments early.', 4), ('How soon should you answer a customer?', 'Within one working day, with a next step.', 5), ('Why change one thing at a time?', 'So you know what caused the result.', 8), ('What does average order value mean?', 'Total revenue divided by number of orders.', 1)],
 jobs=["E-commerce operations assistant","Online shop owner","Customer service representative","Marketplace listing specialist","Inventory controller"], prereq="None"))

# ---------------- EU-04 MOBILE APPS ----------------
C.append(dict(id='EU-04', title='Mobile Application Building', lvl='L4 Practitioner', hours=150,
 summary='Design, build, test and release a small useful mobile app for one real user, using free tools.',
 outcomes=[('Understand','Explain the app lifecycle from idea to update.'),('Apply','Build a working prototype with a clear data model.'),('Analyse','Read test results and user feedback to rank fixes.'),('Evaluate','Judge security, privacy and accessibility against a checklist.'),('Create','Release a small app to 10 real users and plan the next version.')],
 task='Build and release a small mobile app that solves one real problem for 10 real users.',
 cond='About 150 hours over 3 to 6 months. A computer and a phone, free design and build tools, a mentor and a peer circle.',
 std='App installs and runs; core task completed by 8 of 10 users; privacy note published; accessibility checklist passed; 70% on the check.',
 safety='Collect minimum personal data, get clear consent, protect children, and never publish keys or passwords in code.',
 mods=[
 ("Find the problem and the user","Understand",8,"An app is a tool for a person with a problem. Start with the person.",
  ["Interview 5 possible users: what is hard, how do you cope now, what would success look like?","Write the problem in one sentence and one measurable goal.","List the 3 things the first version must do and 3 it will not do.","Check if a simple form or message already solves it."],
  "Five delivery riders say they lose time hunting for addresses. Goal: cut search time from 6 to 3 minutes. First version: save addresses, one-tap call, map link.",
  "Interview five users and write the one-page brief.","Problem, goal, must-do and will-not-do lists present."),
 ("Design screens and flow","Create",14,"Paper first. Draw the screens a user taps through before you write code.",
  ["Make a flow: start, task steps, finish, error.","Keep one main action per screen; large tap targets.","Use clear words; test labels with a user.","Plan for small phones, bright light and slow connections."],
  "A three-screen flow: List, Add place, Place detail with call and map buttons.",
  "Draw the flow and test the paper version with two users.","Both users complete the task on paper without help."),
 ("Data and logic","Apply",20,"Apps store and change data. Decide what you store, in what shape, and who can see it.",
  ["Make a table of items: field, type (text, number, date), required or not.","Plan how data is saved on the phone and, if needed, on a server.","Write the rules in plain sentences before code.","Keep personal data to the minimum needed."],
  "Place table: name (text), address (text), phone (text), notes (text), last used (date). Rule: delete all data when the user taps 'Remove my data'.",
  "Write your data table and the rules.","Every field has a reason; deletion rule written."),
 ("Build the prototype","Apply",38,"Build the smallest working version with a free tool or beginner-friendly framework.",
  ["Build one screen at a time and test each.","Use version saving so you can go back.","Keep secrets (keys, passwords) out of the code.","Write a short note for each feature: what it does, how to test it."],
  "Screen 1 lists places from saved data; screen 2 saves a new place; screen 3 shows detail and opens the phone dialler.",
  "Reach a working prototype that completes the core task.","Core task works end to end on a real phone."),
 ("Test and fix","Analyse",20,"Testing finds what you cannot see. Test on real phones with real users.",
  ["Write 10 test steps and expected results.","Test on two phone sizes and one weak connection.","Watch users without helping; note where they hesitate.","Rank problems: blocks the task, annoys, cosmetic. Fix in that order."],
  "Test shows 3 of 5 users miss the Add button. Move it to the top right and enlarge: next test 5 of 5 find it.",
  "Run the 10 test steps and a user test with five people.","Problems ranked; top three fixed and retested."),
 ("Security, privacy, accessibility","Evaluate",16,"Trust is the product. Protect data and include everyone.",
  ["Privacy note in plain words: what you collect, why, how long, how to delete.","Use secure connections; never store passwords in plain text.","Accessibility: readable text size, strong contrast, labels for buttons, works with larger fonts.","Children: do not collect their data without proper guardian consent."],
  "A checklist of 12 points: 11 pass, 1 fails (low contrast on grey text). Fix and retest.",
  "Complete a 12-point checklist for your app.","Every failure has a fix and a retest date."),
 ("Release to ten users","Apply",26,"Release small. Give the app to 10 real users and listen.",
  ["Prepare an install guide and a one-minute video or picture steps.","Collect feedback with three questions: did it work, what was hard, would you use it again?","Track crashes and complaints.","Send a thank-you and a promise of what you will change."],
  "8 of 10 users completed the task. Two asked for night mode. Next version: night mode and offline lists.",
  "Release and collect feedback from ten users.","Ten users reached; feedback table complete."),
 ("Plan version two and the business","Evaluate",8,"After release, decide whether to grow, change or stop, and how the app could earn.",
  ["Options: free for a service, paid app, subscription, sponsor, or a tool for your own business.","Estimate costs: time, hosting, support.","Write three lessons learned.","Plan version two with dates."],
  "Plan: free for riders, EUR 3 per month for each dispatch office; hosting and support cost about EUR 120 a month, so 40 offices x EUR 3 = EUR 120 cover them.",
  "Present at a review room; give two peers feedback.","Plan has numbers and dates."),
 ],
 quiz=[('Why interview users before designing?', 'To solve a real problem for a real person.', 1), ('What does a data table list?', 'Fields, their types and whether each is required.', 3), ('Why test on real phones?', 'Behaviour differs from a computer preview.', 5), ('How should you rank bugs?', 'Blocks the task, annoys, cosmetic.', 5), ('What belongs in a privacy note?', 'What is collected, why, how long, how to delete.', 6), ('Why keep secrets out of code?', 'Anyone who sees the code could misuse them.', 4), ('Name two accessibility checks.', 'Text size, contrast, labels, large tap targets.', 6), ('Why release to only ten users first?', 'To learn cheaply before scaling.', 7), ('What are three feedback questions?', 'Did it work, what was hard, would you use it again?', 7), ('What should a version-two plan include?', 'Changes, dates and cost estimate.', 8)],
 jobs=["Junior app developer","Mobile tester","Product assistant","UX designer assistant","Freelance app builder"], prereq="None"))

# ---------------- EU-05 IT BUSINESS ----------------
C.append(dict(id='EU-05', title='IT Business and Managed Services', lvl='L4 Practitioner', hours=150,
 summary='Start and run a small IT services business: define services, price them, onboard a client and deliver reliable support.',
 outcomes=[('Understand','Explain what managed services are and how contracts work.'),('Apply','Onboard one real client and set up monitoring and backup.'),('Analyse','Read tickets and response times to find weak spots.'),('Evaluate','Judge price, risk and service levels.'),('Create','Write a service catalogue, a simple agreement and a monthly report.')],
 task='Deliver a managed IT service to one real small client for 30 days and report the results.',
 cond='About 150 hours over 3 to 6 months. A computer, free or trial tools for tickets and monitoring, a friendly small client, a mentor and a peer circle.',
 std='Service catalogue written; client onboarded; 30-day ticket log; monthly report delivered; security and privacy checks done; 70% on the check.',
 safety='Only access systems you have written permission to access; protect client data; never use a client\'s passwords outside the agreed task.',
 mods=[
 ("What managed services are","Understand",8,"A managed service means you look after a client's IT every month for a fixed fee, instead of fixing things only when they break.",
  ["Break-fix: client calls, you fix, you bill by the hour. Managed: you prevent problems and promise response times.","Typical services: help desk, device set-up, updates, backup, security checks, small projects.","Clients value predictable cost and fewer outages.","You value steady income, but must keep promises."],
  "A 10-person office pays EUR 450 per month for a help desk, updates, backup checks and a monthly report.",
  "Write a one-page description of your service in plain words.","A non-technical reader understands what is included and what is not."),
 ("Service catalogue and service levels","Create",14,"List what you do, how fast, and what it costs. Clear limits protect both sides.",
  ["Package services in 2 or 3 levels: Basic, Standard, Plus.","Define response targets: urgent in 1 hour, normal in 1 working day.","State exclusions: what needs a separate quote.","Agree support hours and how to reach you."],
  "Basic EUR 25 per user per month (help desk, updates); Standard EUR 40 (adds backup and security checks); Plus EUR 55 (adds monthly review).",
  "Write the catalogue with prices and response targets.","Each level lists inclusions, exclusions, targets and price."),
 ("Pricing and the business case","Evaluate",16,"Price must cover your time, tools, risk and profit.",
  ["Cost of delivery: hours x hourly cost + tools + insurance + learning time.","Break-even clients = fixed monthly costs divided by margin per client.","Include onboarding time in the first month price.","Test the price with two possible clients."],
  "Monthly fixed costs EUR 900; margin per client EUR 260; break-even = 900/260 = 3.5 so 4 clients.",
  "Build a simple cost and break-even sheet.","Currency on every line; break-even calculated twice."),
 ("Agreements, risk and rules","Apply",14,"A clear agreement prevents arguments. Get legal advice before using any template.",
  ["Parts: scope, price, term, response targets, exclusions, data protection, how to end.","Written permission to access systems is essential.","Insurance and limits of liability: ask an adviser.","Keep records of changes and approvals."],
  "A one-page agreement checked by an adviser lists scope, price, 3-month term, 30-day notice and a data-protection clause.",
  "Draft the agreement and get an adviser's comment.","Draft covers all parts; adviser's comments recorded."),
 ("Onboard a client","Apply",30,"Onboarding is the first impression. Do it in a clear order.",
  ["Inventory: devices, accounts, software, licences, backups.","Fix the basics: updates, passwords policy, backup, antivirus or equivalent.","Set up a ticket system and tell users how to get help.","Hold a short kick-off meeting and give a one-page guide."],
  "Inventory finds 12 devices, 3 old laptops and no backup. Plan: replace backups first, then update laptops.",
  "Onboard one real or practice client and keep a checklist.","Checklist complete; one-page guide delivered."),
 ("Run the service for 30 days","Apply",40,"Deliver the promises every day and record everything.",
  ["Log each ticket: time received, urgency, first response, fix, closed.","Check backups weekly and test one restore.","Apply updates in a planned window and tell users.","Keep a change log."],
  "Week 2: 14 tickets, 12 answered within target. Two late: both after hours. Adjust cover or the promise.",
  "Run 30 days with a full ticket log.","Ticket log complete; backup restore tested."),
 ("Report and improve","Analyse",20,"A monthly report shows value: what you did, what is at risk, what to do next.",
  ["Numbers: tickets, response times, outages, updates done, backup tests.","Top three repeat problems and a fix.","Risks: old devices, weak passwords, missing backups.","One-page plan for next month."],
  "Report shows 22 tickets, 91% within target, repeated printer issue; recommendation: replace the printer (EUR 180).",
  "Write and present the report to the client.","Report uses numbers and ends with actions."),
 ("Grow the business and your skills","Evaluate",8,"Plan growth without breaking quality.",
  ["How many clients can you serve well alone?","Which tool or skill saves the most time?","Three lessons learned.","Decide: grow, change or stop."],
  "Capacity: 8 clients at 6 hours each per week. Plan: automate updates to serve 12.",
  "Present at a review room; give two peers feedback.","Plan has numbers and dates."),
 ],
 quiz=[('Difference between break-fix and managed?', 'Break-fix reacts and bills by the hour; managed prevents and bills a fixed fee.', 1), ('Why exclusions in a catalogue?', 'To protect both sides from unclear scope.', 2), ('Break-even clients for fixed costs 900, margin 260?', '4 (3.5 rounded up).', 3), ('Why written permission?', "It is the legal basis to touch the client's systems.", 4), ('What do you do in onboarding?', 'Inventory, fix basics, set up tickets, kick-off and guide.', 5), ('Why test a restore?', 'A backup you have not restored is unproven.', 6), ('What belongs in a monthly report?', 'Tickets, response times, outages, updates, backup tests, risks, next actions.', 7), ('Name two response targets.', 'Urgent within 1 hour, normal within 1 working day.', 2), ('Why get an adviser to check the agreement?', 'Laws differ and mistakes are costly.', 4), ('What limits growth?', 'Hours per client and your capacity to keep promises.', 8)],
 jobs=["IT support technician","Managed services coordinator","Small IT business owner","Help desk analyst","Systems administrator assistant"], prereq="None"))

def ladder_html(c):
    out = ''
    used = []
    texts = [' || '.join([m[0], m[3], ' '.join(m[4]), m[5], m[6]]) for m in c['mods']]
    for i, (tt, n) in enumerate(LADDER[c['id']], 1):
        k = pick_module(texts, tt, n, LADDER_MODULE_IDX[i-1], used); k = MODULE_OVERRIDE.get((c['id'], i), k); used.append(k)
        on, nt = deep_slide(i, tt, n, c['mods'][k], quiz_for_module(c['quiz'], k + 1))
        out += f'<details class="mod"><summary>Slide {i}. {LV[i]}: {e(tt)}</summary><p><strong>On the slide:</strong> {LV[i]} · {e(on)}</p><p><strong>Notes:</strong> {e(nt)}</p></details>'
    return out

def build(c):
    total = sum(m[2] for m in c['mods'])
    mods = ''
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(c['mods'], 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz_t = []
    for q, ans, n in c['quiz']:
        assert 1 <= n <= len(c['mods']), (c['id'], q, n)
        mt, mstd = c['mods'][n-1][0], c['mods'][n-1][7]
        quiz_t.append((q, ans.rstrip() + f' (Covered in module {n}: {mt}. To pass that module: {mstd.rstrip().rstrip(".")}.)'))
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(quiz_t))
    rub = ('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'
           + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(cc)}</td><td>{e(d)}</td></tr>' for a, b, cc, d in RUBRIC[c['id']]) + '</tbody></table></div>')
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">{e(c["lvl"])}</span><span class="pill">About {c["hours"]} h</span><span class="pill">Practice 70% · Share 20% · Study 10%</span></div>'
        f'<p class="kit-intro">{e(c["summary"])}</p><ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in c['outcomes']) + '</ul>'
        f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["cond"])}</p></div><div><h4>Standard</h4><p>{e(c["std"])}</p></div></div>'
        f'<p class="ws-note">{e(c["safety"])}</p><p><strong>Requirements:</strong> {e(c["prereq"])}. Currency is shown on every number.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', f'{len(c["mods"])} modules with worked examples ({total} h guided)', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', f'<p>Evidence: your record, numbers and reflections. Two peers and one mentor mark it with this rubric. Pass: no criterion at "Not yet" and at least 70% on the check.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
            + B.sec('alt', 'ld', 'ladder L1 to L7', 'Slide by slide, with notes', '<p>Seven slides, one for each level. Step in at your level and move up; credits stack.</p>' + ladder_html(c))
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul>' + ''.join(f'<li>{e(j)}</li>' for j in c['jobs']) + '</ul>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Use your own currency, language and local rules. Check each rule with your local authority.</p>' + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Currency {L["cur"]}; language {e(L["lang"])}; set up legally: {e(L["reg"])}; personal data: {e(L["data"])}; where to practise: {e(L["partner"])}.</p></details>' for L in B.LOC))
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship-depth course. Own wording. Not live.</p>'))
    fn = f'learn-flagship-{c["id"].lower()}.html'
    B.page(fn, c['title'] + ' (full course)', c['summary'][:150], c['title'], e(c['summary']), body, B.crumb(('Courses', 'courses-hub.html'), ('Europe chapters', None)), kicker=f'{c["id"]} · full course')

for c in C: build(c)
print(len(C), 'courses built')
