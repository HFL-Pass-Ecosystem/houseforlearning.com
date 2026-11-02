#!/usr/bin/env python3
"""Flagship: Earthing and Ground Potential Rise (safety awareness and method). Own wording; topic ideas only from the owner's article set; no third-party text."""
import sys, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from ladder_common import ladder_sec
from flagship_data_misc_ladder import LADDER
e = html.escape
M = [
 ("Why we earth: the three jobs", "Understand", 3,
  "An earthing system gives fault current a safe, low-resistance path back to its source, holds exposed metal near earth potential, and lets protection operate quickly. Three jobs: protect people, protect equipment, keep the supply stable.",
  ["Fault current: when insulation fails, current flows through the fault path. A good earth path makes the current large enough for a protective device to trip quickly.",
   "Touch voltage: the voltage between a metal part a person touches and the ground under their feet. Step voltage: the voltage between two feet on the ground.",
   "Bonding: joining metal parts so they rise and fall together, so no dangerous difference appears between them.",
   "Earthing is not a substitute for protection devices; it makes them work."],
  "A pump casing becomes live through damaged insulation. With good earthing, a large fault current flows and the breaker trips in a fraction of a second. With poor earthing, the casing stays live at a dangerous voltage while the breaker does not trip.",
  "Draw one simple diagram of a fault in a small installation, showing the fault path, the protective device and where touch voltage appears. Label each in plain words.",
  "Diagram shows a complete loop from source to fault and back; three terms used correctly."),
 ("Soil and resistance basics", "Understand", 3,
  "How well current spreads into the ground depends on soil resistivity, electrode size and shape, and moisture.",
  ["Soil resistivity changes with moisture, temperature, salts and layers. Dry sand and rock are poor; moist clay is better. Measure; do not guess.",
   "Electrode resistance falls as you add length, depth or parallel electrodes, but with diminishing returns. As a rule of thumb, parallel rods spaced about their own length apart overlap less; the engineer decides the spacing.",
   "Seasonal change: measure in the driest season, or allow a margin.",
   "Measurement methods are done by a competent person with a calibrated instrument and a written procedure."],
  "Illustration with example values: two rods 3 m long placed close together do not give half the resistance of one; spaced further apart they come closer to it. The calculation and the measurement must be done by a qualified engineer; this course teaches you to read and question the numbers.",
  "Given a table of three soil readings (ohm-metres) and a target resistance, rank the three sites and write which one needs the most extra electrode length and why.",
  "Ranking correct; the reason mentions moisture or resistivity; no claim of a final design."),
 ("Parts of an earthing system", "Apply", 3,
  "Learn the names and purposes of each part and read them on a drawing.",
  ["Earth electrode: rod, plate or buried conductor in contact with soil. Earthing conductor: links the installation to the electrode. Main earthing terminal: the one point where earthing and bonding meet.",
   "Protective conductor: runs with the circuits to every exposed metal part. Equipotential bonding: links pipes, structural steel and other conductive parts.",
   "Earth mat or grid: a buried mesh of conductors used at substations to spread current and limit voltages across the site.",
   "Records: label every connection point, record test dates and results."],
  "On a drawing: rod (E1), earthing conductor (colour depends on local rules), main terminal (MET), bonding to water pipe, protective conductors to the distribution board.",
  "Mark up a sample single-line drawing with the six parts above and give each one sentence.",
  "All six parts correctly identified; labels readable."),
 ("Ground potential rise: what it is", "Analyse", 4,
  "When a large fault current flows into an earth system, the ground around it rises in voltage compared with a distant point (remote earth). This rise is called ground potential rise.",
  ["Order of magnitude: GPR is roughly the earth fault current that flows into the earth system times the earth system resistance. A small resistance still gives a big voltage at high current.",
   "Transferred potential: a metal path (a fence, a cable sheath, a pipe) can carry that rise to a remote point and give a shock where none is expected.",
   "Homes and public: GPR near substations and pylon bases is why we separate or bond systems carefully, and why isolation rules exist for communications and pipes entering sites.",
   "Control methods: lower resistance, grading conductors, insulating or isolating metallic paths, bonding intentionally, limiting fault current and clearing faults fast. Every design is verified by a competent engineer."],
  "Example values (illustration only, not for design): 5,000 A flowing into an earth system of 0.5 ohm gives a rise of 2,500 V relative to remote earth. At the edge of the site, the voltage falls with distance; the gradient across your stride is the step voltage.",
  "Calculate the rise for three given fault currents and resistances; list two metal paths in a sample site plan that could transfer potential.",
  "Three calculations correct with units; two transfer paths named; a short note says a qualified engineer designs and approves the controls."),
 ("Reading test results and inspection records", "Evaluate", 4,
  "You will not design the system, but you must judge whether a record is complete and whether results are plausible.",
  ["A complete record has: date, instrument and calibration date, method, weather and soil condition, positions, values and the person's name.",
   "Compare to the design target and to the last result. A sudden rise suggests a broken connection or corrosion.",
   "Visual inspection: corrosion at joints, loose clamps, cut conductors, missing labels.",
   "Escalate: any result outside the design limit goes to the responsible engineer promptly, as your procedure requires."],
  "Example values: last year 2.1 ohm; this year 6.8 ohm on the same electrode. Likely causes: dry season, loose joint, corrosion. Action: retest, inspect joints, tell the engineer.",
  "Review three sample records; mark each complete or incomplete, plausible or suspicious, and write the next action.",
  "Three records judged with reasons; escalation named for any suspicious result."),
 ("Safe work, communication and next steps", "Create", 3,
  "Earthing work is designed, tested and verified only by qualified, authorised people. Your job in this course is awareness, clear records and clear communication.",
  ["Safe isolation and permits come first; never test or open live earth connections without authority.",
   "Storms and faults: stay away from earth electrodes and fences during faults or lightning.",
   "Explain to a non-expert in 60 seconds why earthing and bonding matter at home and at work.",
   "Next courses: protection settings, cable selection, substation design awareness."],
  "A 60-second explanation: 'If a wire inside a washing machine touches the metal case, the earth wire gives the current an easy path, the breaker trips, and you do not get a shock.'",
  "Write and record (or present to a peer) a 60-second explanation, a one-page checklist for reviewing earthing records, and a three-item next-step plan.",
  "Explanation understood by a non-expert peer; checklist has at least eight items; plan has dates."),
]
M[5:5] = [
 ("Touch and step voltage in practice", "Analyse", 3,
  "When the ground around an earth system rises in voltage, a person can be exposed between a touched part and the ground, or between two feet. Learn to work out the simple difference and see who is at risk.",
  ["Touch voltage is the voltage of the touched part minus the voltage of the ground where the person stands.",
   "Step voltage is the difference between the ground voltage at two foot positions; it falls the further you are from the electrode.",
   "People at greatest risk are those close to fences, poles, pump houses and substations during a fault, especially when wet.",
   "Controls include grading conductors, insulating surfaces, keeping people away and clearing faults fast. A qualified engineer chooses and approves them."],
  "Example values (illustration only, not for design): a fence post rises to 300 V relative to remote earth in a fault, and the ground one metre away is at 120 V. A person touching the post there sees a touch voltage of 300 - 120 = 180 V.",
  "Given three pairs of readings (part voltage and ground voltage), work out the touch voltage for each, rank the three by risk and write one control for the worst case.",
  "Three subtractions correct with units; the ranking follows the numbers; the control is named and the note says a qualified engineer approves it."),
 ("Bonding and special locations", "Apply", 3,
  "Some places need extra care because water, metal and people are close together. Learn where bonding is checked and what a record should show.",
  ["Equipotential bonding links incoming metal pipes, structural steel and other conductive parts so they stay at the same voltage.",
   "Bathrooms, kitchens, swimming areas, farms, workshops and fuel stores each have their own local rules.",
   "Check for missing links, loose clamps, painted-over joints and unlabelled conductors.",
   "Do not make or change bonding yourself unless you are competent and authorised."],
  "A metal water pipe enters a workshop and is not linked to the main earthing terminal. A fault on a machine could raise the machine above the pipe, so a person touching both is at risk. Action: record it, tell the responsible engineer, and have a competent person correct it.",
  "Review a sample workshop plan and list three metal parts that need bonding, then write one line on what you would record for each.",
  "Three parts correctly named; each record line has what, where and who was told; no repair is attempted by the reviewer."),
]
RUBRIC = [('Diagram and terms', 'Loop incomplete or terms wrong', 'Complete fault loop with three terms used correctly', 'Also shows where touch voltage appears and why the device trips'), ('Calculations', 'Missing units or wrong arithmetic', 'Rise and touch voltage correct with units', 'Also notes limits of the illustration'), ('Record review', 'Records not judged or reasons missing', 'Each record marked complete or not and plausible or not, with next action', 'Also spots trends across records'), ('Safety and limits', 'Claims a design or repair', 'States that a qualified engineer designs and approves; no live work', 'Also names the permit and isolation steps'), ('Explanation', 'Not understood by a peer', '60-second explanation understood by a non-expert peer', 'Also uses a home example and a work example')]

QUIZ = [("Name the three jobs of an earthing system.", "Protect people, protect equipment, keep the supply stable (and let protection operate)."),
 ("What is touch voltage?", "The voltage between a touched metal part and the ground under the person's feet."),
 ("Why measure soil resistivity in the driest season?", "Resistance is usually highest then, so the result is closer to the worst case."),
 ("What is the main earthing terminal for?", "The single point where earthing and bonding conductors meet."),
 ("Define ground potential rise.", "The voltage rise of an earth system compared with remote earth during a fault current."),
 ("Calculate GPR for 2,000 A and 0.4 ohm.", "About 800 V (2,000 x 0.4); example values only, a qualified engineer designs and verifies the real system."),
 ("What is transferred potential and one example?", "A metal path carrying the rise elsewhere; example a metal fence or cable sheath."),
 ("Name three items a test record must show.", "Date, instrument and calibration, method, values, person (any three)."),
 ("A result rose from 2 to 7 ohm. What do you do?", "Retest, inspect joints, and report to the responsible engineer promptly (example: the same day)."),
 ("Who designs and approves earthing controls?", "A qualified, authorised engineer; this course gives awareness only.")]
def build():
    mods = ''
    for i, (t, bl, h, intro, pts, ex, act, std) in enumerate(M, 1):
        mods += (f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in pts) + '</ul>'
                 f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    quiz = ''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a)}</p></details>' for i, (q, a) in enumerate(QUIZ))
    total = sum(m[2] for m in M)
    outs = [('Explain', 'why earthing and bonding protect people and equipment.'), ('Identify', 'the parts of an earthing system on a drawing.'), ('Calculate', 'a simple ground potential rise from fault current and resistance.'), ('Evaluate', 'a test record for completeness and plausibility.'), ('Communicate', 'the risk and the next action to a non-expert.')]
    about = B.sec('', 'ab', 'about this course', 'What you will be able to do',
        f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">{total} h lessons plus practice</span><span class="pill">Mentor review available</span></div><ul class="blm">' + ''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b, t in outs) + '</ul>'
        '<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>Mark up a drawing, calculate a simple rise, judge three test records and explain the risk in 60 seconds.</p></div><div><h4>Condition</h4><p>Sample drawings and records supplied; calculator; mentor review; no live equipment. About 3 weeks part-time.</p></div><div><h4>Standard</h4><p>All calculations correct with units; every record judged with a reason; the explanation is understood by a non-expert peer.</p></div></div>'
        '<p class="ws-note">Safety: this course gives awareness and method. It does not qualify you to design, test or approve an earthing system. Work on live or fault-carrying equipment is done only by authorised, competent people under your local rules.</p>')
    body = (about + B.sec('alt', 'md', 'lesson by lesson', f'{len(M)} modules with worked examples', mods)
            + B.sec('', 'as', 'assessment', 'How you are checked', '<p>Evidence: diagram, calculations, three record reviews, 60-second explanation. A mentor with electrical experience marks it with this rubric. Pass: no criterion at Not yet.</p>' + '<div class="scroll-x"><table class="ws-table"><caption>Marking rubric (Not yet, Meets, Exceeds)</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(m)}</td><td>{e(d)}</td></tr>' for a, b, m, d in RUBRIC) + '</tbody></table></div>' + '<h3 class="ws-h3">Ten-question check, with model answers</h3>' + quiz)
            + ladder_sec(LADDER['earthing'], 'alt')
            + B.sec('', 'jb', 'jobs this leads to', 'Where this takes you', '<ul><li>Electrical technician trainee</li><li>Site safety assistant</li><li>Inspection and testing assistant</li><li>Utility field assistant</li></ul><p>Next: Selecting a cable, Checking a protection setting, Preparing a site test record.</p>')
            + B.sec('alt', 'lc', 'ten locations and global', 'Your place', '<p>Wiring and earthing rules, colours and test limits differ by place. Always work to your own national code and your employer\'s procedure.</p>' + ''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Language: {e(L["lang"])}. Use your national wiring code and the local regulator for electrical safety. Credit frame: {e(L["frame"])}.</p></details>' for L in B.LOC))
            + B.sec('', 'nx', 'next', 'Draft', '<p class="ws-note">Draft flagship. Own wording; topic ideas only from the owner\'s reading set. A named engineer must review before publish. Not live.</p>'))
    B.page('learn-flagship-earthing.html', 'Earthing and Ground Potential Rise (flagship course)', 'Understand earthing, bonding and ground potential rise: awareness and method.', 'Earthing and Ground Potential Rise', e('Understand how earthing keeps people safe, what ground potential rise is, and how to review test records.'), body, B.crumb(('Courses', 'courses-hub.html'), ('Electrical', None)), kicker='flagship course')
build()
