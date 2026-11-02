// House for Learning - online MBA programme data (test only, nothing live).
// All wording is our own. No school, author, case or company names.
window.MBA = (function () {
  var terms = [
    { n: 1, months: "1 to 4", theme: "Foundations: knowing yourself and honest work" },
    { n: 2, months: "5 to 8", theme: "Framing the issue and choosing where to compete" },
    { n: 3, months: "9 to 12", theme: "Persuasion and clear numbers" },
    { n: 4, months: "13 to 16", theme: "Teams and turnarounds" },
    { n: 5, months: "17 to 20", theme: "New markets, buying and integrity" },
    { n: 6, months: "21 to 24", theme: "Executive operations and capstone" }
  ];
  // week = [title, key idea, what you do]
  var courses = [
    { id: "EM101", term: 1, title: "Knowing yourself and how people behave",
      blurb: "See how you act under pressure, read how others act, and turn feedback into a plan.",
      outcomes: ["Describe your own behaviour pattern with evidence from others.", "Spot four common behaviour styles in a meeting and adjust your approach.", "Write a personal development plan you can check every month."],
      tools: ["Behaviour-style profile", "Feedback log", "Honour pledge"],
      game: "Exposure audit arena: you get a tense workplace scene and have 10 minutes to choose how to respond; the group compares choices.",
      weeks: [
        ["Your habits under pressure", "Stress shows your default habits first. Naming them early makes them easier to change.", "Write three recent tense moments and what you did in each."],
        ["Behaviour styles and how to spot them", "People differ in pace and in focus on task or on people. Four simple styles cover most meetings.", "Watch one meeting and note the style of each speaker."],
        ["Asking for and using feedback", "Good feedback is specific: what happened, the effect, and a change to try.", "Ask five people for feedback in that three-part form."],
        ["Mental traps in decisions", "We favour what is recent, vivid or agrees with us. A short checklist catches many errors.", "Re-read one past decision and mark which trap fits."],
        ["Energy, time and attention", "Attention is the scarce resource. Plan the hard work for your best hours.", "Track one week of energy and move one hard task."],
        ["Working with people unlike you", "Match your pace and language to the other person before you ask for anything.", "Plan a request to someone with a different style."],
        ["Turning insight into a plan", "A plan needs one change, one measure and one person who will ask how it went.", "Draft your 90-day plan."],
        ["Presenting your self-audit", "Show evidence, not adjectives. Ten minutes, three findings, one plan.", "Give your audit in a recorded or live session."]
      ] },
    { id: "EM102", term: 1, title: "Honest, original work",
      blurb: "Build habits of integrity, credit sources properly and use AI tools openly and safely.",
      outcomes: ["Credit every idea and number you use, in a consistent way.", "Read research with care and say how strong the evidence is.", "Defend your own work live, including how you made it."],
      tools: ["Source log", "Evidence-strength scale", "Integrity pledge"],
      game: "Standards court: two learners argue whether a short piece of work meets the honour code; a third decides and explains.",
      weeks: [
        ["Why integrity pays", "Trust is slow to build and quick to lose. Careers and companies run on it.", "Write the honour pledge in your own words."],
        ["Sources and how to credit them", "Credit is a courtesy and a map. Keep a log from the first note.", "Start a source log for this course."],
        ["Reading research with care", "Ask who paid, how many, how long and what else could explain it.", "Grade the strength of three articles."],
        ["Writing your own argument", "Your claim comes first; sources support it. Paraphrase only after you understand.", "Write 500 words that make one claim with two sources."],
        ["Using AI tools openly and safely", "Say when and how you used a tool. Never paste private data. You remain responsible for the result.", "Add a tool-use note to your draft."],
        ["Rapid prototyping of an idea", "A rough working version teaches faster than a perfect plan.", "Build a one-page prototype of a service idea."],
        ["Peer review that helps", "Review the work, not the person: what works, what is unclear, what to try.", "Review two classmates using the three-part form."],
        ["Defending your work live", "Be ready to explain every choice and every source in two minutes.", "Take part in a live integrity defence."]
      ] },
    { id: "EM201", term: 2, title: "Framing the real issue",
      blurb: "Move from the symptom people describe to the problem worth solving.",
      outcomes: ["Separate symptoms from causes with a simple chain.", "Interview a client or boss to uncover what is really needed.", "Write a one-page issue statement others can act on."],
      tools: ["Cause chain", "Interview guide", "80/20 sort", "Affinity grouping"],
      game: "Problem-framing lab: you get a vague complaint and may ask ten questions before you must state the issue.",
      weeks: [
        ["Symptoms and causes", "What people complain about is rarely the cause. Ask why until the answer is something you can change.", "Take one complaint and build a cause chain."],
        ["Asking clear questions", "Open questions find facts; closed questions check them. Keep each question short.", "Rewrite ten weak questions."],
        ["Interviewing a client or boss", "Start with their goal, then the obstacle, then what they tried.", "Run a 20-minute practice interview and note surprises."],
        ["Breaking a problem into parts", "Parts should not overlap and should cover the whole. Test with a simple tree.", "Build an issue tree for a real problem."],
        ["Sorting with the 80/20 rule", "A few causes drive most of the effect. Count before you choose.", "Sort 30 notes into groups and rank them."],
        ["Finding the bottleneck", "Output is limited by the slowest step. Improve there first.", "Map a process and mark the slowest step."],
        ["The one-page issue statement", "State who, what, why now, and what good looks like in one page.", "Write your issue statement."],
        ["Pitching the frame", "Win agreement on the problem before you offer solutions.", "Pitch your frame in five minutes."]
      ] },
    { id: "EM202", term: 2, title: "Choosing where to compete",
      blurb: "Read the outside world, judge your strengths and choose a clear position.",
      outcomes: ["Scan the outside world and rank what matters most.", "Test whether a strength is valuable and hard to copy.", "Write a strategy on one page and say what you will not do."],
      tools: ["Outside scan", "Five forces", "Strength test", "Portfolio grid"],
      game: "Rival moves war game: teams run rival firms for three rounds and react to each other's moves.",
      weeks: [
        ["Reading the outside world", "Politics, money, society, technology, law and environment shift the ground. Rank by impact and certainty.", "Scan one industry and rank six changes."],
        ["Industry forces", "Profit depends on buyers, suppliers, new entrants, substitutes and rivalry.", "Rate each force for your industry."],
        ["Strengths that are hard to copy", "A strength must be valuable, rare, hard to copy and used well.", "Test five strengths of a firm you know."],
        ["A portfolio of bets", "Grow, hold, fix or leave each business based on its share and its market.", "Place a firm's businesses on a grid."],
        ["Cost, difference or focus", "You can be cheapest, be different, or serve one group best. Muddling all three loses.", "Choose one for a case firm and defend it."],
        ["Rival moves", "Think two moves ahead: what will rivals do if you do this?", "Play the rival moves war game."],
        ["Choosing and saying no", "Strategy is also what you refuse to do.", "List three things your firm will stop."],
        ["Strategy on a page", "Where to play, how to win, what it needs, how to measure.", "Submit your one-page strategy."]
      ] },
    { id: "EM301", term: 3, title: "Answer-first persuasion",
      blurb: "Lead with the answer, support it with grouped reasons and handle hard questions.",
      outcomes: ["Write a message that opens with the answer.", "Group reasons so each group makes one point.", "Handle hard questions calmly in a live setting."],
      tools: ["Answer-first outline", "Grouping check", "Question rehearsal"],
      game: "Deck restructuring run: you receive a messy ten-slide deck and have 30 minutes to rebuild it answer-first.",
      weeks: [
        ["Lead with the answer", "Busy readers want the answer first and the proof after.", "Rewrite three emails to start with the answer."],
        ["Grouping ideas", "Each group needs one clear point and supporting items of the same kind.", "Group 12 loose points into three."],
        ["Reasoning up and down", "Going up asks 'so what?'; going down asks 'why?'. Both must agree.", "Check the logic of a short memo both ways."],
        ["Short writing", "Cut words that do no work. One idea per sentence.", "Cut a page to half a page."],
        ["Emails and memos that get action", "Say who must do what by when, in the first lines.", "Write one action memo."],
        ["Speaking in the room", "Open with the answer, use your voice, pause, stop on time.", "Give a three-minute talk."],
        ["Handling hard questions", "Listen fully, check the question, answer first, then explain.", "Face a panel of three hard questions."],
        ["Rebuild a messy deck", "Fewer slides, one message per slide, a clear ask.", "Hand in your rebuilt deck."]
      ] },
    { id: "EM302", term: 3, title: "Showing numbers and stories clearly",
      blurb: "Choose the right chart, remove clutter and tell the story behind the numbers.",
      outcomes: ["Pick a chart type by the comparison you want to show.", "Report numbers honestly, including what is uncertain.", "Prepare a short board report with a clear recommendation."],
      tools: ["Chart chooser", "Clutter check", "Uncertainty note"],
      game: "Chart-selection challenge: ten data sets, one minute each, choose and defend the best chart.",
      weeks: [
        ["What is the message", "Decide the one sentence the reader should take away before you draw anything.", "Write the message for three data sets."],
        ["Picking a chart by comparison", "Comparing items, change over time, parts of a whole and relationships each suit different charts.", "Match 12 examples to chart types."],
        ["Removing clutter", "Every line, label and colour must earn its place.", "Redraw a cluttered chart."],
        ["Tables or charts", "Use tables for exact lookup and charts for pattern.", "Convert one chart to a table and back."],
        ["Numbers into a story", "Setting, change, effect, next step.", "Write a 150-word data story."],
        ["Honest scales and uncertainty", "Start bars at zero, show ranges, say what you do not know.", "Fix three misleading charts."],
        ["Dashboards for decisions", "Show few measures, with targets, that lead to an action.", "Sketch a one-screen dashboard."],
        ["Reporting to the board", "Recommendation first, evidence next, risks last.", "Prepare a three-page board report."]
      ] },
    { id: "EM401", term: 4, title: "Teams that work across functions",
      blurb: "Build teams from different functions that trust each other and decide well.",
      outcomes: ["Name the factors that make a team effective.", "Run a conflict so that it improves the decision.", "Repair a team that has lost trust."],
      tools: ["Team health check", "Role grid", "Meeting rules"],
      game: "Saboteur audit: one hidden member quietly blocks the team; the group must find the pattern, not the person.",
      weeks: [
        ["What makes teams work", "Clear goals, clear roles, trust and a way to decide.", "Score a team you know on the four factors."],
        ["Roles and goals", "Write who decides, who advises and who does, for each task.", "Build a role grid for a project."],
        ["Trust and safety", "People speak up when mistakes are treated as information.", "Plan one team habit that builds safety."],
        ["Conflict that helps", "Argue about ideas, not people. Agree how to disagree first.", "Run a structured disagreement."],
        ["Saboteur patterns", "Blocking, hiding information and silent agreement are patterns that can be named.", "Play the saboteur audit."],
        ["Meetings and decisions", "Every meeting needs a purpose, an owner and a recorded decision.", "Redesign a weekly meeting."],
        ["Remote and cross-border teams", "Write more down, agree overlap hours, and check understanding.", "Write a team agreement for a distributed team."],
        ["Team repair", "Start with facts, share impact, agree two changes, follow up.", "Present a repair plan."]
      ] },
    { id: "EM402", term: 4, title: "Turning an operation around",
      blurb: "Read the warning signs, protect cash and lead a 100-day recovery.",
      outcomes: ["Read operating ratios and spot where value leaks.", "Redesign a service step by step.", "Plan the first 100 days of a turnaround."],
      tools: ["Health ratios", "Leak map", "100-day plan"],
      game: "Turnaround exercise: a failing retail chain with six months of cash; teams choose actions each month.",
      weeks: [
        ["Reading the health ratios", "Margin, stock days, collection days and cash cover tell the story quickly.", "Compute five ratios for a case firm."],
        ["Finding the leaks", "Follow a unit of money or work from start to finish and note where it is lost.", "Draw a leak map."],
        ["Service redesign", "Remove steps the customer does not value, then speed up the rest.", "Redesign one service journey."],
        ["Cash first", "A firm that runs out of cash stops, however good its plan.", "Build a 13-week cash view."],
        ["People in a turnaround", "Say what is happening, what is not, and when you will say more.", "Write the first message to staff."],
        ["Quick wins and real fixes", "Quick wins buy trust; real fixes buy the future. Do both.", "Sort 15 actions into the two."],
        ["Plan the first 100 days", "Stabilise, fix, then grow, with named owners and dates.", "Draft a 100-day plan."],
        ["Simulated turnaround", "Make monthly choices and live with the results.", "Complete the turnaround exercise."]
      ] },
    { id: "EM501", term: 5, title: "Growth in new markets and pricing for low incomes",
      blurb: "Design offers that fit low-income customers and new markets without losing money.",
      outcomes: ["Explain how a new idea spreads through a market.", "Price for customers with small and irregular incomes.", "Design a low-cost offer with a realistic supply chain."],
      tools: ["Adoption curve", "Pricing sandbox", "Cost teardown"],
      game: "Pricing sandbox: set price, pack size and payment terms for a low-income market and watch demand react.",
      weeks: [
        ["How new things spread", "A few early users, then many, then the rest. Each group needs a different message.", "Place a product on the adoption curve."],
        ["Leapfrogging", "Some markets skip steps and jump straight to the newest method.", "Find two examples of leapfrogging."],
        ["Understanding low-income customers", "Income is small and uneven, so time, trust and place matter as much as price.", "Interview or study three households."],
        ["Pricing sandbox", "Small packs, pay-as-you-go and shared use can open a market.", "Play the pricing sandbox."],
        ["Low-cost design", "Remove features, not quality. Use local materials.", "Do a cost teardown of one product."],
        ["Sourcing and supply chain", "Short, reliable chains beat cheap, fragile ones.", "Map a supply chain and its weak links."],
        ["Local partners", "Partners bring trust and reach; agree roles and fair shares.", "Write a partner term sheet."],
        ["Business model pitch", "Show customer, offer, price, cost and how it grows.", "Pitch your model."]
      ] },
    { id: "EM502", term: 5, title: "Buying, stakeholders and integrity",
      blurb: "Sell to and buy from large institutions fairly, with clean records.",
      outcomes: ["Map everyone who can help or block a large purchase.", "Explain how institutions buy and bid.", "Keep red lines and records that stand up to review."],
      tools: ["Stakeholder map", "Bid checklist", "Decision ledger"],
      game: "Ministry-style purchase negotiation, followed by a ledger defence where you justify every choice.",
      weeks: [
        ["Mapping stakeholders", "List who decides, who influences, who uses and who pays.", "Map the stakeholders of one large purchase."],
        ["How big institutions buy", "Needs, budget, rules, approval, contract. Each step has a gatekeeper.", "Draw the buying steps for an institution."],
        ["Tenders and bids", "Follow the rules to the letter and answer the stated need.", "Complete a mock bid checklist."],
        ["Negotiating with officials", "Be clear on what is open and what is fixed, and keep it in writing.", "Run the negotiation exercise."],
        ["Gifts, favours and red lines", "Decide your lines before you are tested and tell your team.", "Write your red-line list."],
        ["Records that stand up", "Write down why, who and when for every key decision.", "Build a decision ledger."],
        ["Fixing a conflict of interest", "Declare it, step aside, record it.", "Resolve three conflict cases."],
        ["Ledger defence", "Explain your decisions to a reviewer calmly and with evidence.", "Defend your ledger live."]
      ] },
    { id: "EM601", term: 6, title: "Running executive operations",
      blurb: "Plan capacity, quality, suppliers and change so the plan becomes daily practice.",
      outcomes: ["Map operations and find limits to capacity.", "Build a roadmap from idea to implementation.", "Lead a change so that it sticks."],
      tools: ["Operations map", "Roadmap", "Readiness review"],
      game: "Executive simulation: run an operation for four quarters under shocks in demand and supply.",
      weeks: [
        ["The operations map", "Draw how work flows, where it waits and who owns each step.", "Map one operation end to end."],
        ["Capacity and flow", "A plan fails if one step cannot keep up.", "Find the limiting step and size it."],
        ["Quality and risk", "Prevent defects early and list what could go wrong with an owner for each.", "Build a risk table."],
        ["Suppliers", "Rate suppliers on cost, quality, delivery and trust; keep a back-up.", "Score three suppliers."],
        ["Roadmaps", "Five stages: idea, test, build, launch, review.", "Create a roadmap for a real initiative."],
        ["Budget and measures", "Few measures, each with a target and an owner.", "Choose seven measures."],
        ["Leading change", "People change when they see why, what is in it for them, and the first step.", "Write a change message."],
        ["Readiness review", "Check people, process, tools and money before launch.", "Run a readiness review."]
      ] },
    { id: "EM699", term: 6, title: "Executive capstone: proposal and live defence",
      blurb: "Bring everything together in a ten-slide executive proposal and defend it live.",
      outcomes: ["Choose a real problem and gather evidence.", "Compare options and recommend one.", "Present ten slides and defend them live."],
      tools: ["Evidence table", "Options matrix", "Ten-slide template"],
      game: "Live boardroom defence in front of a panel with a recorded decision.",
      weeks: [
        ["Choose a topic", "Pick a problem with a real owner, real data and a decision to make.", "Submit a topic note."],
        ["Gather evidence", "Collect facts, figures and voices; label strength.", "Build an evidence table."],
        ["Generate options", "Aim for at least three real choices, including do nothing.", "Draft an options matrix."],
        ["Draft the proposal", "Answer first, then reasons, then risks, then the ask.", "Write a first full draft."],
        ["Peer clinic", "Each learner gets two reviews and gives two.", "Give and receive peer reviews."],
        ["Ten slides", "One message per slide; maximum ten.", "Finish the slides."],
        ["Rehearsal", "Time it, vary pace, prepare for the hardest three questions.", "Rehearse with a mentor."],
        ["Live defence", "Twenty minutes: present, answer, reflect.", "Take part in the live defence."]
      ] }
  ];
  // Assessment pattern: three graded pieces per course (week due, weight, kind).
  var pattern = [
    { k: "A1", name: "Individual memo", w: 30, week: 3, kind: "Written memo, about 2,000 words" },
    { k: "A2", name: "Group practice task", w: 30, week: 6, kind: "Group submission with a process canvas" },
    { k: "A3", name: "Live defence", w: 40, week: 8, kind: "Ten slides and a live oral defence" }
  ];
  var capPattern = [
    { k: "A1", name: "Topic note and evidence table", w: 20, week: 2, kind: "Two pages" },
    { k: "A2", name: "Written proposal", w: 40, week: 6, kind: "Ten slides and notes" },
    { k: "A3", name: "Live boardroom defence", w: 40, week: 8, kind: "Twenty minutes with a panel" }
  ];
  courses.forEach(function (c, i) {
    c.index = i;
    c.startWeek = i * 8;
    c.assess = (c.id === "EM699" ? capPattern : pattern).map(function (p) {
      return { id: c.id + "-" + p.k, name: p.name, w: p.w, week: p.week, kind: p.kind };
    });
  });

  var specialist = [
    ["Where are we exposed? A cross-border audit", "Measure how exposed a business is to other countries and where the gaps are."],
    ["Culture and business negotiation", "Read cultural habits in deals and plan a negotiation that respects them."],
    ["Talking across cultures", "Find where a message breaks between sender and receiver and repair it."],
    ["Escalating well across borders", "Raise problems upward without blame, and mediate between two sides."],
    ["Distance, trade and a connected world", "Model four kinds of distance and what they do to trade."],
    ["Rooted yet global strategy", "Keep a strong local base while using global scale."],
    ["Working abroad: the whole journey", "The cost and care of sending someone abroad and bringing them home."],
    ["A career across borders", "Plan a career that crosses countries without dropping family or finances."],
    ["Teams and conflict", "Lead people from different backgrounds through disagreement."],
    ["Ethics across borders", "Decide what is right when laws and customs differ."],
    ["Ethics and shared governance", "Design rules and checks so that good behaviour is the easy path."],
    ["Numbers for decisions", "Use cost, volume and profit logic and clean data to decide."],
    ["Reading the three statements together", "See how profit, cash and the balance sheet connect."],
    ["Excel and statistics workshop", "Spreadsheet skills and basic statistics for managers."]
  ].map(function (m, i) {
    return { n: i + 1, title: m[0], blurb: m[1], hours: 75, ects: 2.5,
      parts: ["Credit note (aligned-with statement, to be checked before any promise)", "Applied case", "Practice game with tasks, conditions and standards", "Yearly refresh of the research", "Marking guide"],
      assess: [["Written memo", 30], ["Live simulation", 35], ["Board brief", 35]] };
  });

  return { terms: terms, courses: courses, specialist: specialist,
    startDefault: "2027-01-11", liveDay: 4, liveTime: "18:00",
    bands: [["A", 3.67], ["B", 2.67], ["C", 2.0], ["Not yet passed", 0]] };
})();
