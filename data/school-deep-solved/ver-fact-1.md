# Fact check, SST grades 1 to 5 (ver-fact-1)

school-grade-01-sst.json | OK (no clear errors; UAE emergency numbers 999/998/997, 2 December 1971, seven emirates all correct)
school-grade-02-sst.json | 1 DOUBTFUL item (below)
school-grade-03-sst.json | OK (scale 4 cm x 100 m = 400 m, 40 x 7 = 280, oil export from Abu Dhabi 1962, pearl decline 1930s all correct)
school-grade-04-sst.json | 2 DOUBTFUL items (below); Jebel Jais 1,934 m, Everest 8,849 m, difference 6,915 m, GCC 1981, Saudi area, Rub' al Khali area all verified
school-grade-05-sst.json | 1 DOUBTFUL item (below); 3200 BCE, 105 CE, 868 CE, 1450, 1844, 1876, 1969, COP28 30 Nov to 13 Dec 2023, 24 x 7 = 168, 1844 to 1450 = 394 all verified

## Issues

school-grade-02-sst.json | G02-SST-01 | steps (Step 6) | "From the playground, walk straight past the library and turn right. The canteen is next to the office." | "From the playground, walk straight past the library and turn left. The canteen is next to the office." (or say "on your map, where the canteen is drawn") | DOUBTFUL: on the Step 2 map the gate is at the bottom, the playground at the top and the office on the right of the gate. Walking down the page from the playground, the office side is on your LEFT, not right, and the canteen was never placed on the map. Direction words flip when you face the other way, so the model answer contradicts the map. Not marked clear because the step says "your own school map".

school-grade-04-sst.json | G04-SST-02 | steps (Step 1) | "Locate each on a map by the Arabian Gulf coast." | "Locate each on a map; most lie on the Arabian Gulf coast, Oman faces the Gulf of Oman and Arabian Sea, and Riyadh is inland." | DOUBTFUL: oversimplified; Muscat is not on the Arabian Gulf and Riyadh is inland.

school-grade-04-sst.json | G04-SST-02 | steps (Step 4) | "Monsoon winds carried dhows from the Gulf to India's west coast in summer and back again in winter." | "Monsoon winds carried dhows between Arabia and India's west coast: the south-west monsoon of summer helped ships sailing east to India, and the north-east monsoon of winter helped them return." | DOUBTFUL: the direction is correct for the Arabian Sea (south-west monsoon out, north-east monsoon back), but Gulf ships often left in the cooler months and the pearl fleet worked in summer, so the statement is a simplification. Left as is is acceptable.

school-grade-05-sst.json | G05-SST-01 | steps (Step 4) | "radio around the 1900s" | "radio around 1900 to 1920" | DOUBTFUL: "the 1900s" is vague (could mean a decade or a century); first practical wireless messages were about 1895 to 1901 and broadcasting began about 1920.

## Notes
- No CLEAR ERROR found, so data/school-deep-solved/fix-fact-1.json holds an empty object.
- Units with no solved steps (G01-SST-03, G02-SST-03, G03-SST-01, G04-SST-03, G04-SST-04, G05-SST-02, G05-SST-03) were checked on title, outcome, intro, points, example and activity only; all facts there (seven emirates, 2 December 1971, 10 percent of 10,000 = 1,000) are correct.
- The checks (questions and model answers) in all five files are generic (verbs, Bloom levels, FA/SA weeks, evidence) and contain no history or geography claims.
