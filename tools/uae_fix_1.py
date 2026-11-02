# Corrected modules (proofread)
FIX = {'petroleum': [('Read a process flow and a permit',
                'Analyse',
                8,
                'Every job on a hydrocarbon site starts with two papers: the flow diagram that '
                'shows where the product goes, and the permit that says who may do what.',
                ['On a flow diagram, trace one product from tank to dispatch and name each vessel, '
                 'pump, valve and instrument on the way.',
                 'A permit states the job, place, time limit, hazards, isolations and the '
                 'signatures of issuer and receiver. A permit with a blank line is not valid.',
                 'Gas tests come before hot work and are repeated at set intervals; write down '
                 'each reading with time and tester.',
                 'Handover between shifts must name open permits, isolated equipment and any '
                 'abnormal readings.'],
                'A pump seal job: isolate and drain, gas test 0% of the lower explosive limit '
                '(LEL), permit signed 07:10, expires 15:00. At 12:30 the wind changes and a test '
                'reads 8% of the LEL; work stops and the permit is suspended until a fresh test is '
                'clear.',
                'Trace a flow diagram supplied by your mentor and fill a sample permit for a pump '
                'seal change, naming every isolation.',
                'Every vessel and valve on the route named; permit has no blank lines; stop-work '
                'trigger stated.'),
               ('Measure, balance and account for oil',
                'Apply',
                10,
                'Oil is sold by measured quantity, so measurement accuracy is money. A balance '
                'compares what came in with what went out.',
                ['Quantity depends on temperature: volume at observed temperature is corrected to '
                 'a standard temperature before it is compared.',
                 'Check the tank gauge, a manual dip and the flow meter against one another; '
                 'differences beyond the allowed band are investigated, not averaged away.',
                 'Mass balance: opening stock plus receipts minus dispatches minus closing stock '
                 'should equal the loss, and the loss should be small and explained.',
                 'Record each custody transfer with the time, meter readings, seal numbers and '
                 'both signatures.'],
                'Opening stock 40,000 barrels, receipts 12,000, dispatches 11,700, closing stock '
                '40,280. Loss = 40,000 + 12,000 - 11,700 - 40,280 = 20 barrels, which is 0.17% of '
                'the 12,000 barrels received (20 / 12,000 x 100). Within a 0.5% band, so log it '
                'and note the cause.',
                'Complete a three-day mass balance from sample data and explain any gap above '
                '0.2%.',
                'Arithmetic checked twice; loss percent stated; cause or next check named for '
                'every gap.'),
               ('Abnormal situations and escalation',
                'Evaluate',
                9,
                'Most incidents begin as small deviations that nobody wrote down. The skill is to '
                'notice early and escalate clearly.',
                ['Know alarm priorities: act on the highest first, never silence an alarm without '
                 'a note.',
                 'Use a short report format: what, where, when, how bad, what is done, what is '
                 'needed.',
                 'Practise three drills on paper: small leak, power loss, high tank level. For '
                 'each write the first three actions in order.',
                 'Review near-misses weekly; the point is to learn, not to blame.'],
                'A high-level alarm sounds at 82% on a tank due to reach 90% in 40 minutes. '
                'Actions: confirm with a manual dip, stop the incoming transfer, tell the control '
                'room, log the time and decision.',
                'Write the first three actions for each of the three drills and have your '
                'supervisor mark them.',
                'Actions in a safe order; reports use the six-part format; a near-miss review note '
                'is filed.')],
 'petrochemicals': [('From feedstock to product: the reaction chain',
                     'Understand',
                     8,
                     'Plants turn simple gases and liquids into building blocks, and then into '
                     'plastics. Knowing the chain explains why one upset affects many products.',
                     ['Draw the chain from feedstock to a final plastic and name each '
                      'intermediate.',
                      'Heat, pressure and a catalyst decide how much product forms; each has a '
                      'safe window.',
                      'Side products are not always waste: some are sold or burned for energy.',
                      'A change in feed quality changes everything downstream, so feed is tested '
                      'on arrival.'],
                     'A feed lot arrives with more water than allowed. The lab flags it, the lot '
                     'is held, and the plant uses stock from another tank instead of risking the '
                     'catalyst.',
                     'Draw the chain for one plastic and mark where heat, pressure and a catalyst '
                     'act.',
                     'Every step labelled; each safe window written; feed test named.'),
                    ('Runaway reactions and pressure safety',
                     'Apply',
                     10,
                     'A reaction that makes its own heat can speed up faster than cooling can '
                     'follow. Pressure relief and interlocks exist for that moment.',
                     ['Know the signs: rising temperature with cooling at maximum, pressure rising '
                      'faster than normal.',
                      'A relief valve opens at a set pressure and sends gas to a safe place; it '
                      'must never be isolated without a permit.',
                      'An interlock stops the feed automatically if a limit is crossed; never '
                      'bypass one without written approval.',
                      'Practise the shutdown order on paper: stop feed, keep cooling, vent safely, '
                      'call for help.'],
                     'Reactor temperature climbs 3 degrees Celsius per minute with cooling full. '
                     'At the alarm limit the interlock stops the feed. The operator confirms, '
                     'keeps cooling and reports the time to the supervisor.',
                     'Write the shutdown order for a reactor and list which devices act at each '
                     'step.',
                     'Order is safe; no step relies on bypassing a protection.'),
                    ('Quality of plastics: tests and records',
                     'Evaluate',
                     9,
                     'Customers buy by property: how easily the plastic melts, how dense it is, '
                     'how strong. Each lot carries a test certificate.',
                     ['Typical tests: melt flow, density, tensile strength, colour and moisture.',
                      'Sample the same way every time: from several places, labelled and sealed.',
                      'Compare results with the written specification; out-of-limit lots are held, '
                      'retested and decided by the quality lead.',
                      'Keep records for each lot so a complaint can be traced to the exact shift.'],
                     'Lot 114 melt flow is 8.4 g per 10 minutes against a limit of 7.0 to 8.0 g '
                     'per 10 minutes. It is held; a retest gives 8.3; the lot is sold as a lower '
                     'grade with the customer told.',
                     'Fill a certificate for three sample lots and decide each as pass, hold or '
                     'downgrade.',
                     'Every result compared with a limit; decisions explained.')],
 'aluminum': [('Electricity is the main ingredient',
               'Analyse',
               8,
               'Making metal from its oxide uses large electric current day and night, so power '
               'cost and stability shape everything.',
               ['Energy per tonne (kWh per tonne) is the key cost number; track it daily.',
                'A power dip can freeze a production cell, so planned power cuts are rare and well '
                'warned.',
                'Efficiency is the share of current that actually makes metal; losses show up as '
                'heat.',
                'Heat is useful but dangerous: hot cell surfaces and spilled metal can burn you '
                'even from a distance.'],
               'A cell uses 14,000 kWh of electricity per tonne against a target of 13,500 kWh. '
               'The 500 extra kWh cost AED 0.2 each (500 x 0.2), so each tonne costs AED 100 more '
               'than planned.',
               'Calculate energy cost per tonne for a week of sample data and mark the days above '
               'target.',
               'Units shown; AED cost per tonne correct; days above target explained.'),
              ('Casting safely: water and molten metal',
               'Apply',
               10,
               'Water meeting molten metal can explode. Every mould, tool and charge must be dry.',
               ['Preheat tools and moulds; check for damp before each pour.',
                'Wear the full rated clothing: face shield, heat-proof coat, boots over trouser '
                'legs.',
                'Keep a clear escape path and a second person watching.',
                'Skim dross and weigh it; dross is lost metal and a measure of care.'],
               'A damp ladle is found on the preheat rack. It is tagged, set aside and the pour is '
               'delayed by 20 minutes. Delay costs less than an incident.',
               'Write a dry-check list for a casting shift and mark who signs each item.',
               'Every item has a signer; escape path drawn.'),
              ('Alloy, grade and customer needs',
               'Evaluate',
               9,
               "Customers do not buy 'aluminium'; they buy a grade with stated composition and "
               'strength.',
               ['Know that small additions change the metal: strength, flow, finish.',
                'Each cast is sampled and the composition tested before release.',
                'Out-of-grade metal is recycled into a lower grade or remelted.',
                'Match the grade to the end use: facade profile, car part or foil.'],
               'A cast shows more iron than allowed for a facade grade. It is sold for a less '
               'demanding use at a lower price, with the certificate showing the actual '
               'composition.',
               'Match five end uses to grades from a list and explain each match.',
               'Matches justified by composition or strength.')],
 'fertilizer': [('Nutrients and crop needs',
                 'Understand',
                 8,
                 'Crops need nitrogen, phosphorus and potassium in different amounts at different '
                 'stages. A grade like 20-10-10 states the percentage of each.',
                 ['Read a grade and work out kilograms of each nutrient in a 50 kg bag.',
                  'Sandy desert soils hold little water and nutrients, so timing and split doses '
                  'matter.',
                  'Over-use wastes money and can harm water; match dose to a soil test.',
                  'Slow-release products cost more but last longer.'],
                 'A 50 kg bag of 20-10-10 holds 10 kg nitrogen (N), 5 kg phosphate (P2O5) and 5 kg '
                 'potash (K2O), because the three numbers are percentages by weight (50 x 0.20 = '
                 '10; 50 x 0.10 = 5).',
                 'Calculate nutrient weights for three bag grades.',
                 'Arithmetic correct; units shown.'),
                ('Granulation, drying and storage hazards',
                 'Apply',
                 10,
                 'Granules spread evenly and store better than powder, but some fertilisers can '
                 'decompose or burn if stored carelessly.',
                 ['Keep stores dry, ventilated and away from fuels and heat.',
                  'Never mix incompatible products; follow the segregation chart.',
                  'Dust can be explosive in air; control it.',
                  'Know the first-aid and spill steps from the safety data sheet.'],
                 'A damaged bag is found leaking beside a pallet of another product. It is cleaned '
                 'up with dry methods, the area is ventilated and both pallets are moved apart.',
                 'Draw a store layout with segregation and fire routes.',
                 'Incompatible items separated; routes clear.'),
                ('Quality: size, moisture and caking',
                 'Evaluate',
                 9,
                 'A good granule is the right size, dry, and strong enough to survive transport.',
                 ['Screen samples to find the share within the target size.',
                  'Moisture above the limit leads to lumps and weaker bags.',
                  'Add anti-caking coatings where specified.',
                  'Record each lot with date, grade and test results.'],
                 'A sieve test shows 91% of granules in range against a 90% target. Pass with a '
                 'thin margin; the operator checks the screen for wear.',
                 'Fill a quality sheet for four sample lots and decide each.',
                 'All fields completed; decisions explained.')],
 'construction-materials': [('Read a bill of quantities and order',
                             'Apply',
                             8,
                             "A contractor's list says what is needed and when. Your job is to "
                             'supply it complete.',
                             ['Convert the quantities on the drawings into delivery units: bags, '
                              'bars, pallets, truckloads.',
                              'Add waste allowance by material; tiles break more than blocks.',
                              'Group by delivery date to reduce truck trips.',
                              'Confirm quantities and dates by message.'],
                             'A wall needs 1,200 blocks; with 4% waste order 1,248, which is 8 '
                             'pallets of 156.',
                             'Convert a sample list into an order with waste and pallets.',
                             'Arithmetic correct; waste shown.'),
                            ('Storage, heat and handling',
                             'Apply',
                             9,
                             'Heat and damp spoil adhesives, paints and cement. Stacks that fall '
                             'injure people.',
                             ['Store bagged goods off the floor and under cover; first in, first '
                              'out.',
                              "Stack heights follow the material's safe limit.",
                              'Check batch and expiry on chemicals.',
                              'Lifting: use machines or teams; no single heavy lifts.'],
                             'Tile adhesive stored in sun reaches its heat limit; stock is moved '
                             'indoors and the oldest bags are used first.',
                             'Draw a yard layout with zones and stack limits.',
                             'Zones labelled; limits stated.'),
                            ('Quality checks on delivery',
                             'Evaluate',
                             9,
                             'Reject at the gate, not on site. Check the paperwork and a sample.',
                             ['Check the delivery note against the order.',
                              'Measure a sample: size, thickness, weight.',
                              'Look for damage, mixed batches and wrong grade.',
                              "Record a rejection with a photo and the driver's signature."],
                             'Steel bars measured at 11.4 mm diameter against 12 mm specified, '
                             'outside the allowed tolerance, are rejected and replaced within two '
                             'days.',
                             'Fill a goods-in sheet for three sample deliveries.',
                             'Checks complete; one decision explained.')],
 'textiles': [('Fabric, weight and fit',
               'Understand',
               8,
               'Fabric choice sets comfort, wear and price.',
               ['Learn weave, knit and blend.',
                'GSM (grams per square metre) shows weight; light fabrics suit heat.',
                'Shrinkage must be tested before cutting.',
                'Colour fastness: rub and wash tests.'],
               'A cotton sample shrinks 4% in length; the pattern is lengthened by 4%.',
               'Test shrinkage on a sample and adjust a pattern.',
               'Result recorded; pattern adjusted.'),
              ('Cutting and stitching line',
               'Apply',
               9,
               'Plan the cut to waste less and the line to avoid waiting.',
               ['Lay pieces to use cloth well.',
                'Balance operations so no one waits.',
                'Check measurements at set points.',
                'Safety: needles, scissors, lighting.'],
               'A better cut plan raises usage from 82% to 88% of cloth, saving about 7 metres of '
               'cloth in every 100 metres (82 / 0.88 = 93 metres needed for the same output).',
               'Draw a cut plan and compare two layouts.',
               'Waste percent computed.'),
              ('Inspect and pack to a sample rule',
               'Evaluate',
               9,
               'A sampling rule decides if a lot is accepted.',
               ['Pick a sample size by lot size.',
                'Count and classify defects.',
                'Decide accept or reject by the rule.',
                'Record and feed back to the line.'],
               'From a lot of 500, a sample of 50 shows 3 defects; the accept limit is 3, so the '
               'lot is accepted.',
               'Inspect a sample lot and decide.',
               'Rule used correctly; defects classified.')],
 'transport': [('Daily vehicle and driver checks',
                'Apply',
                9,
                'A five-minute check prevents most breakdowns and many crashes.',
                ['Check tyres, lights, brakes, fluids, air conditioning and seat belts.',
                 'Record defects and tag the vehicle out if unsafe.',
                 'Check the driver is rested and within the legal driving-hours rules.',
                 'Keep documents in the vehicle.'],
                'A worn tyre found at 06:10 is replaced before the 07:00 run, avoiding a roadside '
                'stop in 40 degrees Celsius heat.',
                'Write a pre-trip checklist and use it on five vehicles or a sample.',
                'Checklist complete; defects logged.'),
               ('Route, cost per trip and punctuality',
                'Evaluate',
                9,
                'Cost per trip and on-time rate decide profit.',
                ['Cost per trip = fuel + driver + wear + overhead share.',
                 'Plan routes to avoid peak traffic.',
                 'Measure on-time percent weekly.',
                 'Share delay causes with the team.'],
                'Fuel AED 55, driver AED 90, wear AED 25, overhead AED 60: cost AED 230 against a '
                'price of AED 320 gives margin 28.1%.',
                'Cost three routes and choose the best.',
                'Margins shown; punctuality plan set.')]}
