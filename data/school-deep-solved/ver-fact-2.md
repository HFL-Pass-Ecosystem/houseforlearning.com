# Fact check 2: SST grades 06 to 10

Method: read every unit's title, outcome, example and steps (steps taken from out-*.json overridden by fix-*.json where present, else from the file). Intro, points, activity and standard are generic template text with no facts. The checks are generic apart from four items (verb and Bloom level, FA/SA weeks, unit weeks, evidence), and all were cross-checked against each file's modules; all agree. Arithmetic re-run in Python (scale, time difference, ranges, lapse rate, percentage points, years, yields, depletion, land-use shares): all correct.

Format of issues: file | unit id | field | exact old text | corrected text | CLEAR ERROR or DOUBTFUL (and why)

school-grade-06-sst.json: OK (no clear errors; one doubtful item below)
school-grade-07-sst.json: OK (no clear errors; one doubtful item below)
school-grade-08-sst.json: OK (no clear errors; two doubtful items below)
school-grade-09-sst.json: OK (no errors)
school-grade-10-sst.json: OK (no clear errors; three doubtful items below)

## Doubtful items (none is a wrong fact; all are fit or oversimplification)

school-grade-06-sst.json | G06-SST-02 | example | Solved: Earth rotates once in 24 hours (day and night) and orbits the Sun in about 365 days (a year). Earthquakes happen where plates meet; rivers and wind erode land. | Suggest replacing with text that matches the outcome (solar system, latitude and longitude), e.g. "Latitude lines run east to west and are measured 0 to 90 degrees north or south of the Equator; longitude lines run pole to pole and are measured 0 to 180 degrees east or west of the Prime Meridian. Earth turns 360 degrees in 24 hours, which is 15 degrees an hour." | DOUBTFUL (facts true, but the example does not teach the stated outcome)

school-grade-07-sst.json | G07-SST-02 | example | Solved: Earth rotates once in 24 hours ... rivers and wind erode land. | Suggest an example about the rock cycle, e.g. "Igneous rock forms from cooled magma; weathering and erosion break rock into sediment; sediment pressed together forms sedimentary rock; heat and pressure change either into metamorphic rock." | DOUBTFUL (same text reused from grade 06; rock cycle is in the outcome but not in the example)

school-grade-08-sst.json | G08-SST-02 | steps (Step 2) | Desert sunlight in Rajasthan or Arabia: renewable and potential until panels are built. | Desert sunlight in Rajasthan or Arabia: a renewable resource, only partly developed because large solar farms already use some of it. | DOUBTFUL (large solar parks already operate in both regions, so "until panels are built" is oversimplified)

school-grade-08-sst.json | G08-SST-03 | example | Solved: Renewable: sun, wind, water. Non-renewable: coal, oil. Write two ways your home can use less of one non-renewable resource. | Suggest: "Subsistence farmers grow mainly for their own family; commercial farmers grow for sale. Rice is a kharif (monsoon) crop and wheat a rabi (winter) crop. Primary, secondary and tertiary industries: sort mining, steel and banking." | DOUBTFUL (resources text reused; does not match agriculture and industry)

school-grade-10-sst.json | G10-SST-01 | example | Solved: Compare two ideas in a table: who holds power, who owns property, what rights people have. Then write one sentence on each effect. | Suggest: "Nationalism: a shared sense of belonging to one nation. Put three events on a timeline: 1789 French Revolution, 1861 Italy united under one king, 1871 German Empire proclaimed. Say what they have in common." | DOUBTFUL (text reused from grade 09 socialism/Nazism; does not match nationalism)

school-grade-10-sst.json | G10-SST-02 | steps (Step 4) | Suppose a factory needs 3 tonnes of coal and 2 of ore for 1 tonne of steel | Suppose a factory needs 4 tonnes of heavy raw material for each tonne of product (for steel, the real amounts are roughly 1.5 to 1.7 t of iron ore and under 1 t of coking coal per tonne) | DOUBTFUL (labelled "suppose", so not wrong, but real steelmaking uses more ore than coal, the reverse of the stated numbers)

school-grade-10-sst.json | G10-SST-03 | example | Sort three tasks (defence, local roads, schools) into the tier that decides them. | Sort three tasks (defence, local roads, police) ... or note that schools are shared between centre and state | DOUBTFUL (in the Indian Constitution education is on the concurrent list, so "schools" has no single tier)

## Checked and found correct (no action)
- G06-SST-03: 1:50,000 means 2 cm = 1 km; 6.4 x 25 = 160 km; 7.5 x 10 = 75 km; Dubai about 25 N 55 E, Mumbai about 19 N 73 E; Tropic of Cancer 23.5 N crosses India and the UAE; UTC+4 vs UTC+5:30 gives 11:30; Everest 8,849 m.
- G07-SST-01: Rajaraja I 985 to 1014; temple about 1010; Delhi Sultanate 1206; Vijayanagara 1336; Panipat 1526; 320 years; Rajendra Chola expedition about 1025; monsoon wind directions.
- G07-SST-03: ranges 1 C and 20 C; lapse rate 6.5 C per 1,000 m gives 10.5 C at 3,000 m.
- G08-SST-01: charter 1600; Plassey 1757; Buxar 1764; Diwani 1765; 190 years; Crown rule 1858; Congress 1885; Bengal partition 1905; Jallianwala Bagh 13 April 1919; Dandi March 12 March to 6 April 1930 (about 385 km); Quit India 8 Aug 1942; independence 15 Aug 1947; Constitution in force 26 Jan 1950.
- G08-SST-03: yields 5 and 3 t/ha; 2011 census literacy about 74 percent; kharif/rabi crop timing.
- G09-SST-02: 1917 events; Versailles 1919; 1923 hyperinflation; Nazi vote 2.6 percent (1928) and 37.3 percent (July 1932), rise 34.7 points; 30 Jan 1933; Enabling Act March 1933; Nuremberg Laws 1935; six million; 1 Sept 1939.
- G10-SST-01: Napoleonic Code 1804; Italy 1861 and Rome 1870 (about 11 years from 1859); Prussian wars 1864, 1866, 1870 to 1871; empire proclaimed 18 Jan 1871 at Versailles; Non-Cooperation 1920 to 1922.
- G10-SST-02: 12/20 = 60 percent, 3/20 = 15 percent, remainder 25 percent; mineral locations; Jamshedpur, Mumbai cotton mills.
- G09-SST-01, G06-SST-01, G07-SST-04, G08-SST-04, G09-SST-03/04/05, G10-SST-04 examples: correct (10,000 at 10 percent gives 1,000 a year).

Totals: 0 CLEAR ERROR, 7 DOUBTFUL. No fix-fact-2.json written because there is no clear error inside any unit's steps.
