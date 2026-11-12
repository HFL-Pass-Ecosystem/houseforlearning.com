/* Built by tools/import_executive_editions.py from the Executive Programme page. Do not edit by hand. */
/* The site's security policy (style-src 'self') refuses style attributes written into markup. The page writes a
   few (rung heights, a margin or two). They reach the browser as data-style instead, and each is applied through
   the style object, which the policy allows: once for the page as loaded, and again whenever the page replaces
   part of itself. */
(function () {
  function apply(el) { var s = el.getAttribute('data-style'); el.removeAttribute('data-style'); if (s) el.style.cssText = s; }
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.hasAttribute('data-style')) apply(root);
    var list = root.querySelectorAll('[data-style]');
    for (var i = 0; i < list.length; i++) apply(list[i]);
  }
  var d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (d && d.set && d.get) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      configurable: true, enumerable: d.enumerable,
      get: function () { return d.get.call(this); },
      set: function (v) {
        if (typeof v === 'string' && v.indexOf('style=') !== -1) v = v.replace(/(<[^<>]*?\s)style=(["'])/g, '$1data-style=$2');
        d.set.call(this, v); scan(this);
      }
    });
  }
  scan(document.body);
})();

(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons (line icons drawn for this page) ---------- */
const ICONS = {
  learn:'<path d="M3 8.5 12 4l9 4.5-9 4.5z"/><path d="M7 10.6V15c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.4M21 8.5v5.5"/>',
  spark:'<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 10.9 10.1 9z"/><path d="M19 3v3.5M20.8 4.7h-3.5"/>',
  doc:'<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h5"/>',
  target:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2"/>',
  author:'<path d="M12 20h8.5M16.6 3.6a2.1 2.1 0 0 1 3 3L7.3 18.9 3.5 20l1.1-3.8z"/>',
  search:'<circle cx="11" cy="11" r="6.8"/><path d="m20.5 20.5-4.7-4.7"/>',
  train:'<path d="M3 4h18v11H3zM12 15v3M8.5 21 12 18l3.5 3"/><path d="M7 9h6M7 12h3.5"/>',
  users:'<circle cx="9" cy="8" r="3.6"/><path d="M2.5 20v-1.2A4.8 4.8 0 0 1 7.3 14h3.4a4.8 4.8 0 0 1 4.8 4.8V20M16 4.6a3.6 3.6 0 0 1 0 6.8M18.5 14.3a4.8 4.8 0 0 1 3 4.5V20"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.5V12l3 2"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5"/>',
  speaker:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',
  send:'<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z"/>',
  chat:'<path d="M20.5 15a2 2 0 0 1-2 2H8l-4.5 3.5V5.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>',
  image:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-8.5 8.5"/>',
  bolt:'<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>',
  hybrid:'<path d="M7.5 19.5S3 15.6 3 12.2a4.5 4.5 0 0 1 9 0c0 3.4-4.5 7.3-4.5 7.3z"/><circle cx="7.5" cy="12.1" r="1.5"/><rect x="13" y="4" width="8.5" height="6.5" rx="1"/><path d="M15.5 13h3.5M17.2 10.5V13"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M11 18.5h2"/>',
  badge:'<circle cx="12" cy="9" r="5.8"/><path d="M8.6 13.7 7.5 21l4.5-2.4 4.5 2.4-1.1-7.3"/>',
  route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18h6a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7h6"/>',
  info:'<circle cx="12" cy="12" r="8.8"/><path d="M12 16.5v-5M12 8h.01"/>',
  arrow:'<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  chevl:'<path d="m15 6-6 6 6 6"/>',
  chev:'<path d="m9 6 6 6-6 6"/>',
  book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  shield:'<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
  live:'<rect x="3" y="5.5" width="13" height="13" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  record:'<path d="M6 3h11.5a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5H6zM9.5 3v18M12.5 8H16M12.5 11.5H16"/>',
  help:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.6"/><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  pkg:'<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
  flask:'<path d="M9 3h6M10 3v6.2L4.8 18.6A1.6 1.6 0 0 0 6.2 21h11.6a1.6 1.6 0 0 0 1.4-2.4L14 9.2V3"/><path d="M7.5 15h9"/>',
  case:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 12.5h18"/>',
  pause:'<rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/>',
  bank:'<path d="M3 9.5 12 4l9 5.5M4.5 9.5V18M9 9.5V18M15 9.5V18M19.5 9.5V18M3 20.5h18"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.spark}</svg>`;

/* The pointing hand, drawn for this page: index finger up, fingertip at (11.5, 2) */
const HAND_D = 'M9 4.5a2.5 2.5 0 0 1 5 0V12.5a2.25 2.25 0 0 1 4.5 0V13.5a2.25 2.25 0 0 1 4.5 0V15a1.75 1.75 0 0 1 3.5 0V22c0 4-3 7-7 7h-4c-2.3 0-3.9-1-5.2-2.6L4.2 19.3a1.9 1.9 0 0 1 2.8-2.5L9 18.6Z';
const HAND_K = 'M14 12.5V16M18.5 13.5V16.5M23 15V17.5';
const handSvg = (fill, line, size) => `<svg xmlns="http://www.w3.org/2000/svg"${size ? ` width="${size}" height="${size}"` : ''} viewBox="0 0 32 32"><path d="${HAND_D}" fill="${fill}" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/><path d="${HAND_K}" fill="none" stroke="${line}" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const handIcon = cls => `<svg class="ic hand-ic ${cls || ''}" viewBox="0 0 32 32" aria-hidden="true"><path d="${HAND_D}"/><path d="${HAND_K}"/></svg>`;

/* ---------- choices kept on this device only ---------- */
const KEY = 'hfl-exec-programme';
function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
const S = Object.assign({ed:1, hand:true, sector:'other'}, load());
if (![1,2,3,4].includes(S.ed)) S.ed = 1;
function save(){ try { localStorage.setItem(KEY, JSON.stringify({ed:S.ed, hand:S.hand, sector:S.sector})); } catch (e) {} }

/* ---------- the programme ---------- */
const EDITIONS = [
  {n:1, short:'International Business', title:'Executive Programme in International Business', years:'1 year', span:'Months 1 to 12', pp:100,
   stage:'Earner, first level', units:'25 Foundation units, free',
   who:'For people in work who want a sound, practical grounding in business across borders: new managers, owners of small firms, professionals moving into business roles, and people starting a venture.',
   entry:'Open to anyone who can give about 10 hours a week. There is no entrance examination.',
   study:'Blocks 1 to 3: managing yourself, diagnosing a business, and making a case with data. The 25 Foundation units run alongside, five minutes at a time.',
   plan:'You build a business plan for a real venture in five stages: frame it, draft it with several AI assistants, check every claim against public sources, rewrite it as your own work, and pitch it to a peer panel. The plan runs to 10 to 12 pages.',
   finish:'A certificate of completion, 100 practice points, and the first Earner stage of your career path.'},
  {n:2, short:'Business Leadership', title:'Executive Programme in Business Leadership', years:'2 years', span:'Months 1 to 24', pp:200,
   stage:'Earner, second level, or Service provider', units:'50 units: Foundation and Practitioner',
   who:'For managers and team leaders responsible for people, budgets or a business unit, and for owners growing a firm.',
   entry:'Edition 1, or several years of work experience, discussed in a short conversation.',
   study:'All six blocks: the first year, then team dynamics and service operations, innovation for underserved markets and large-scale procurement, and the executive capstone. The 25 Practitioner units follow the Foundation units.',
   plan:'Four more stages take your plan into the field: interviews with at least eight customers, partners or experts, a market size and a three-year financial model, a cross-border and ethics check, and a defence before a board panel that includes an outside practitioner. The plan grows to 20 to 25 pages with a 10-slide deck.',
   finish:'A certificate of completion, 200 practice points, and the second Earner stage or the Service provider stage.'},
  {n:3, short:'Specialist', title:'Specialist Executive Programme', years:'3 years', span:'Months 1 to 36', pp:300,
   stage:'Author, Trainer or Partner', units:'75 units: Foundation to Advanced',
   who:'For experienced professionals who want depth in one sector and wish to write and teach from their own practice.',
   entry:'Edition 2, or substantial experience in your sector.',
   study:'The first two years, then a specialist year in one of 50 sectors, from healthcare and construction to data and AI. The 25 Advanced units follow, and you author a sector example or a unit for our library at the Author and Trainer Desk, or take the trainer induction and co-lead sessions beside a certified trainer.',
   plan:'Three more stages: a specialist chapter that only someone in your field could write, an investor-ready pack with a valuation and a roll-out roadmap, and a presentation to a real outside audience, with written feedback. The plan grows to 30 to 40 pages, and you coach one first-year learner.',
   finish:'A certificate of completion, 300 practice points, and the Author, Trainer or Partner stage.'},
  {n:4, short:'Research', title:'Executive Research Programme', years:'4 years', span:'Months 1 to 48', pp:400,
   stage:'Leader or Expert', units:'All 100 units',
   who:'For senior practitioners who want to study a real question in their field, lead others and train the next group of learners.',
   entry:'Edition 3, or senior experience and a research question you care about.',
   study:'The first three years, then a research year in three blocks of four months: you frame a question from your own sector and plan the study, gather and analyse the evidence with consent, then write it up and present it. A supervisor guides you throughout, and the 25 Mastery units run beside the research.',
   plan:'Your project starts with a short proposal and an ethics review, and ends in a report of about 10,000 words that answers your question with evidence and names every source, and in a public talk to people from your sector, with questions from a panel that includes an outside practitioner. You also lead one learning group as a trainer, or write a module of connected units for our library, and you mentor two learners.',
   finish:'A certificate of completion, 400 practice points, and the Leader or Expert stage.', research:true}
];
const BLOCKS = [
  {n:1, m:'Months 1 to 4', name:'Self-management and ethics', mods:[['MC-101','Managing yourself: strengths, feedback and working styles'],['MC-102','Working styles and team behaviour'],['MC-103','Research and integrity standards']]},
  {n:2, m:'Months 5 to 8', name:'Strategic diagnostics', mods:[['MC-201','Client discovery and issue analysis'],['MC-202','Strategy and competitive advantage'],['MC-203','Structuring and synthesis lab']]},
  {n:3, m:'Months 9 to 12', name:'Persuasive storytelling with data', mods:[['MC-301','Answer-first writing and storylines'],['MC-302','Data visualisation and information design'],['MC-303','Board presentation lab']]},
  {n:4, m:'Months 13 to 16', name:'Restructuring and team dynamics', mods:[['MC-401','Team problems and constructive challenge'],['MC-402','Service operations and restructuring'],['MC-403','Cross-functional alignment workshop']]},
  {n:5, m:'Months 17 to 20', name:'Emerging technology and scale', mods:[['MC-501','Innovation for underserved markets'],['MC-502','Large-scale institutional and public procurement'],['MC-503','Technology leapfrogging lab']]},
  {n:6, m:'Months 21 to 24', name:'Executive capstone', mods:[['MC-601','Growth proposal'],['MC-602','Executive defence and stakeholders'],['MC-603','Capstone and board presentation']]},
  {n:7, m:'Months 37 to 40', name:'Research question and design', mods:[['MC-701','A research question from your own practice'],['MC-702','Methods for applied research: interviews, surveys, cases and small trials'],['MC-703','Research proposal, consent and ethics review']]},
  {n:8, m:'Months 41 to 44', name:'Fieldwork and analysis', mods:[['MC-801','Fieldwork: gathering evidence with consent'],['MC-802','Analysing what you found and checking every claim'],['MC-803','Analysis lab with peer review']]},
  {n:9, m:'Months 45 to 48', name:'Report, public talk and leading others', mods:[['MC-901','The research report, in your own words'],['MC-902','Public talk and panel questions'],['MC-903','Leading a learning group or a module of units, and mentoring']]}
];
const LATER = [
  {n:3, m:'Months 25 to 36', name:'Specialist year', mods:[['Sector','One of 50 sectors, chosen by you'],['Units','25 Advanced units'],['Author or train','A sector example or unit you author, or sessions you co-lead after the trainer induction']]}
];
const YEARS = [
  {n:1, m:'Months 1 to 12', title:'Foundations', items:[['learn','Block 1: Self-management and ethics'],['learn','Block 2: Strategic diagnostics'],['learn','Block 3: Persuasive storytelling with data'],['spark','25 Foundation units'],['doc','Business plan, stages 1 to 5, ending in a pitch']]},
  {n:2, m:'Months 13 to 24', title:'Leadership', items:[['learn','Block 4: Restructuring and team dynamics'],['learn','Block 5: Emerging technology and scale'],['learn','Block 6: Executive capstone'],['spark','25 Practitioner units'],['doc','Business plan, stages 6 to 9, ending in a board defence']]},
  {n:3, m:'Months 25 to 36', title:'Specialist year', items:[['target','A specialist year in one of 50 sectors'],['spark','25 Advanced units'],['doc','Business plan, stages 10 to 12, ending before an outside audience'],['author','A sector example or unit you author, or sessions you co-lead as a trainer']]},
  {n:4, m:'Months 37 to 48', title:'Research year', items:[['search','Block 7: Research question and design'],['search','Block 8: Fieldwork and analysis'],['doc','Block 9: Report, public talk and leading others'],['spark','25 Mastery units, beside a supervised research project'],['train','A learning group you lead as a trainer, or a module of units you author'],['users','Mentoring two learners']]}
];
const MODES = [
  ['image','See','A picture or diagram of each idea, with a caption, and a short video where one exists.'],
  ['speaker','Hear','Every unit read aloud, and your answers taken by voice.'],
  ['doc','Read and write','The unit text, a reading list and your own notes, written in your own words.'],
  ['bolt','Do','A task to try today in your real work or life, with the evidence kept as a photo, a voice note or a line of text.']
];
const WAYS = [
  ['mic','Speak or type','Every step works by speaking or by typing, in plain words. A phone is enough; no computer skills are needed.'],
  ['hybrid','Online, hybrid or at a centre','Join live classes online, in a hybrid group, or at a centre where one is open. Classes are recorded.'],
  ['clock','Five minutes at a time','Each unit has seven short parts: a hook, the idea, an example from your sector, a task for today, a quiet caution, a reflection and one check.']
];
/* Collaborate, the fifth stage of the loop, and its seven spaces (learning pack 1.6, 11 November 2026). */
const SPACES = [
  ['flask','LAB™','Our content studio: authors and trainers find what learners need, make the units and course material, test them and improve them.'],
  ['learn','LEAP™','The platform where courses, activities, checks with feedback, and course and career pathways are built and published.'],
  ['users','HCF™','Our human capital framework and network: it develops and certifies trainers and coaches, and joins learners with coaches, mentors and partners.'],
  ['pkg','Marketplace','Where earners and partners offer products, projects, solutions and services, from enquiry and quote to order, under published trust rules.'],
  ['case','Workplace','Where teams deliver real work: listening meetings, improvement sessions, recognition and two-way mentoring, with the outcomes recorded.'],
  ['doc','COLLATE™','One place to collect and share study notes, work notes, recordings and sketches, so that a group keeps one shared record.'],
  ['route','PAVER™','Your career record across five paths: professional, academic, vocational, education and entrepreneurship, and resilience and recreation.']
];
/* What stays with you when AI helps (learning pack 1.7, 11 November 2026). */
const KEEPS = [
  ['learn','Understanding','When you learn, you answer each check yourself and write your reflection in your own words: listen, reflect, then live it.'],
  ['target','Judgement','When you earn, you decide what to offer and what to promise, approve every message before it goes, and answer for the result.'],
  ['author','Your name and honest credit','When you author, the case and the words are yours, with a plain note of what AI helped with.'],
  ['train','The teacher in the room','When you train, you see each learner, encourage, correct with care and pass on what you know, person to person.'],
  ['users','Trust','When you collaborate, you listen, keep your promises and decide together with the people a decision affects.'],
  ['shield','The final word','Every change to the programme is approved by a named person, and the time AI saves goes back into teaching and mentoring.']
];
const STRANDS = ["Self-mastery and daily habits", "Purpose, values and integrity", "Leading people and teams", "Communication and presence", "Negotiation, selling and customer value", "Cost and decision accounting", "Finance, budgets and control", "Personal money habits", "Strategy, markets and growth", "Processes, systems and quality (ERP, CRM, MIS)", "Learning culture and leader development", "Conscience: what not to do with a genius mindset"];
const SECTORS = [["other", "Independent, gig and new ventures"], ["software", "Software and IT services"], ["healthcare", "Healthcare services"], ["manufacturing", "Manufacturing and factories"], ["consulting", "Consulting and business services"], ["banking", "Banking and financial services"], ["insurance", "Insurance"], ["transport", "Transport and mobility"], ["aerospace", "Aerospace and defence"], ["energy", "Energy: oil, gas and power"], ["hospitality", "Hotels, travel and leisure"], ["retail", "Retail and shops"], ["meddevices", "Medical devices and supplies"], ["pharma", "Pharma and medicines"], ["realestate", "Real estate and property"], ["telecom", "Telecom and networks"], ["chemicals", "Chemicals and materials"], ["hardware", "Computer hardware and electronics"], ["biotech", "Biotech and life sciences"], ["foodprod", "Food and beverage production"], ["restaurants", "Restaurants, cafes and catering"], ["utilities", "Utilities: power, water and gas supply"], ["wholesale", "Wholesale and distribution"], ["automotive", "Automotive and electric vehicles"], ["media", "Media, news and content"], ["consumer", "Consumer products and brands"], ["construction", "Construction and building"], ["education", "Education and training"], ["agriculture", "Agriculture, farming and forestry"], ["transequip", "Ships, rail, aircraft and handling equipment"], ["government", "Government and public services"], ["smartcities", "Smart cities and urban development"], ["water", "Water and sanitation"], ["waste", "Waste, recycling and circular economy"], ["climate", "Climate and sustainability"], ["cleanenergy", "Clean energy and renewables"], ["nature", "Nature, wildlife and animals"], ["space", "Space and satellites"], ["cyber", "Cybersecurity and data protection"], ["dataai", "Data, AI and analytics"], ["datacentre", "Data centres and cloud"], ["engineering", "Engineering and project services"], ["logistics", "Logistics and supply chain"], ["investment", "Investment and capital"], ["accounting", "Accounting, audit and tax"], ["legal", "Legal, compliance and governance"], ["gaming", "Gaming, animation and immersive media"], ["arts", "Arts, culture and heritage"], ["sport", "Sport, fitness and wellbeing"], ["social", "Social impact and community"]];
const UNIT = {"id": "S1-01", "title": "Habits shape futures", "hook": "What you repeat every day decides where you will be in five years.", "idea": "Small actions repeated daily compound over time. A habit has a cue, a routine and a reward, so design the cue and keep the first step tiny. A new daily habit takes about 66 days on average to feel automatic, with a range from 18 to 254 days (Lally and colleagues, 2010), not the popular 21 days.", "try_it_today": "Choose one tiny habit linked to something you already do every day (for example, after morning tea, write today's three priorities) and log it for 14 days.", "quiet_caution": "A habit that serves only you can still harm others; check who else it touches.", "reflection": "Which one habit, kept for a year, would change your work the most?", "check_question": "On average, how long does a new daily habit take to feel automatic?", "options": ["About two months, and it varies widely", "One week", "Exactly 21 days"], "answer": "A"};
const EXAMPLES = {"other": ["For a freelancer, a tiny daily habit could be a two-minute check of repeat-client rate at the start of each working day.", ""], "software": ["For a software developer, a tiny daily habit could be a two-minute check of defect escape rate at the start of each working day.", ""], "healthcare": ["For a clinic manager, a tiny daily habit could be a two-minute check of patient waiting time at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "manufacturing": ["For a production supervisor, a tiny daily habit could be a two-minute check of first-pass yield at the start of each working day.", ""], "consulting": ["For a business consultant, a tiny daily habit could be a two-minute check of billable utilisation at the start of each working day.", ""], "banking": ["For a branch manager, a tiny daily habit could be a two-minute check of loan turnaround time at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "insurance": ["For an insurance advisor, a tiny daily habit could be a two-minute check of claim settlement time at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "transport": ["For a fleet manager, a tiny daily habit could be a two-minute check of on-time delivery rate at the start of each working day.", ""], "aerospace": ["For an aircraft maintenance engineer, a tiny daily habit could be a two-minute check of aircraft turnaround time at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "energy": ["For a plant operations engineer, a tiny daily habit could be a two-minute check of plant availability at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "hospitality": ["For a hotel manager, a tiny daily habit could be a two-minute check of occupancy rate at the start of each working day.", ""], "retail": ["For a store manager, a tiny daily habit could be a two-minute check of sales per square metre at the start of each working day.", ""], "meddevices": ["For a field service engineer, a tiny daily habit could be a two-minute check of device uptime at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "pharma": ["For a medical representative, a tiny daily habit could be a two-minute check of stock availability at pharmacies at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "realestate": ["For a property consultant, a tiny daily habit could be a two-minute check of days to close a deal at the start of each working day.", ""], "telecom": ["For a network engineer, a tiny daily habit could be a two-minute check of network uptime at the start of each working day.", ""], "chemicals": ["For a process engineer, a tiny daily habit could be a two-minute check of batch yield at the start of each working day.", ""], "hardware": ["For a hardware engineer, a tiny daily habit could be a two-minute check of board yield at the start of each working day.", ""], "biotech": ["For a research scientist, a tiny daily habit could be a two-minute check of assay turnaround time at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "foodprod": ["For a food production supervisor, a tiny daily habit could be a two-minute check of batch rejection rate at the start of each working day.", ""], "restaurants": ["For a restaurant owner, a tiny daily habit could be a two-minute check of table turnaround time at the start of each working day.", ""], "utilities": ["For a distribution engineer, a tiny daily habit could be a two-minute check of supply reliability at the start of each working day.", ""], "wholesale": ["For a distributor, a tiny daily habit could be a two-minute check of days of stock at the start of each working day.", ""], "automotive": ["For a quality engineer, a tiny daily habit could be a two-minute check of defects per vehicle at the start of each working day.", ""], "media": ["For an editor, a tiny daily habit could be a two-minute check of audience reach at the start of each working day.", ""], "consumer": ["For a brand manager, a tiny daily habit could be a two-minute check of repeat-purchase rate at the start of each working day.", ""], "construction": ["For a site engineer, a tiny daily habit could be a two-minute check of schedule variance at the start of each working day.", ""], "education": ["For a teacher, a tiny daily habit could be a two-minute check of course completion rate at the start of each working day.", ""], "agriculture": ["For a farmer, a tiny daily habit could be a two-minute check of yield per acre at the start of each working day.", ""], "transequip": ["For a marine engineer, a tiny daily habit could be a two-minute check of on-time delivery at the start of each working day.", ""], "government": ["For an administrative officer, a tiny daily habit could be a two-minute check of days to approve an application at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "smartcities": ["For a smart city manager, a tiny daily habit could be a two-minute check of resolution time at the start of each working day.", ""], "water": ["For a water treatment operator, a tiny daily habit could be a two-minute check of non-revenue water at the start of each working day.", ""], "waste": ["For a waste manager, a tiny daily habit could be a two-minute check of recycling rate at the start of each working day.", ""], "climate": ["For a sustainability manager, a tiny daily habit could be a two-minute check of emissions intensity at the start of each working day.", ""], "cleanenergy": ["For a solar project engineer, a tiny daily habit could be a two-minute check of capacity installed per month at the start of each working day.", ""], "nature": ["For a veterinarian, a tiny daily habit could be a two-minute check of recovery rate at the start of each working day.", ""], "space": ["For a satellite engineer, a tiny daily habit could be a two-minute check of test pass rate at the start of each working day.", ""], "cyber": ["For a security analyst, a tiny daily habit could be a two-minute check of mean time to respond at the start of each working day.", ""], "dataai": ["For a data analyst, a tiny daily habit could be a two-minute check of report accuracy at the start of each working day.", ""], "datacentre": ["For a data centre manager, a tiny daily habit could be a two-minute check of uptime at the start of each working day.", ""], "engineering": ["For a project engineer, a tiny daily habit could be a two-minute check of schedule adherence at the start of each working day.", ""], "logistics": ["For a warehouse manager, a tiny daily habit could be a two-minute check of order accuracy at the start of each working day.", ""], "investment": ["For a fund manager, a tiny daily habit could be a two-minute check of portfolio return after fees at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "accounting": ["For an accountant, a tiny daily habit could be a two-minute check of days to close the books at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "legal": ["For a corporate lawyer, a tiny daily habit could be a two-minute check of turnaround time per matter at the start of each working day.", "Regulated sector: apply your regulator's rules; this example is general education."], "gaming": ["For a game producer, a tiny daily habit could be a two-minute check of player retention at the start of each working day.", ""], "arts": ["For an artist, a tiny daily habit could be a two-minute check of audience attendance at the start of each working day.", ""], "sport": ["For a fitness coach, a tiny daily habit could be a two-minute check of member retention at the start of each working day.", ""], "social": ["For a programme manager, a tiny daily habit could be a two-minute check of people reached at the start of each working day.", ""]};
const OFFERS = [
  ['mic','Speak or type','Ask anything by voice or by typing, in your own language. A phone is enough.'],
  ['spark','The 25 Foundation units','Every Foundation unit, to see, hear, read and do, with practice points.'],
  ['book','Free reading first','Reading lists drawn from public libraries, open texts and free courses.'],
  ['live','An open live class each month','Open to everyone, with the recording and a short recap. Seats as the room allows; the recording stays free.'],
  ['record','Your learning record','One record of every unit, check and task, with Foundation badges and practice points.'],
  ['author','CV and interview practice','A CV built from your own evidence, and interview practice by voice.'],
  ['help','Help when you need it','By speaking, by typing, or by asking for a person.']
];
const GETS = [
  ['badge','A certificate of completion','From House for Learning, for each edition you complete.'],
  ['record','Your learning record','Every unit, check and task you completed, with your practice points, to download and share.'],
  ['doc','Your business plan and project work','The plan, the deck and the evidence behind them are yours to keep and use.'],
  ['users','People you have worked with','Your cohort, your mentors, and the customers and experts you met in the field.']
];
const PATH = [
  ['Learner','You start with the free units, and your record opens.','0'],
  ['Earner, first level','Edition 1 complete, with one task tried and accepted.','100'],
  ['Earner, second level, or Service provider','Edition 2 complete, with three accepted tasks and one peer review.','200'],
  ['Author, Trainer or Partner','Edition 3 complete, with a sector example or unit accepted into our library, or sessions co-led beside a certified trainer.','300'],
  ['Leader or Expert','Edition 4 complete, with a learning group led on your own or a module of units accepted, and two learners mentored.','400']
];
const FEE_RULES = [
  ['The Foundation units, the reading lists, your learning record and one open live class a month are free, and stay free.'],
  ['The fee for each edition is shown in full before you enrol, including our administration charge. Nothing is added at the end.'],
  ['You pay as you go, one four-month term at a time, with no subscription and no stored balance. You may pause between terms.'],
  ['Payment is by bank transfer or UPI. Employers and partners can sponsor seats.'],
  ['A clear refund policy and a named contact for complaints come with every enrolment.']
];
const PAGE_SUMMARY = 'House for Learning offers an executive programme in four editions. Edition 1, in International Business, takes one year. Edition 2, in Business Leadership, takes two years. Edition 3, the Specialist Executive Programme, takes three years and adds a specialist year in your own sector. Edition 4, the Executive Research Programme, takes four years and adds an applied research year. Each edition includes the one before it, so you can start with one year and continue. Study takes about 10 to 12 hours a week, online, in a hybrid group or at a centre, and every step works by speaking or by typing. The 25 Foundation units are free. The fee for each edition is shown in full before you enrol, and is paid by bank transfer or UPI. These are professional programmes with a certificate of completion; they are not university degrees.';

/* Questions answered on this page (matched on this device; nothing is sent) */
const FAQ = [
  {q:'Is this a degree?', k:['degree','mba','phd','doctor','master','university','accredit','recogni','ugc','academic','equivalen','valid'],
   a:'No. These are professional executive programmes, not university degrees, and they do not carry academic credit. Each edition you complete earns a certificate of completion from House for Learning and a record of the work you did.', go:'leave'},
  {q:'How long does it take?', k:['how long','duration','years','months','finish','length'],
   a:'Edition 1 takes one year, Edition 2 two years, Edition 3 three years and Edition 4 four years. Each edition includes the one before it, so the years add up as you climb.', go:'years'},
  {q:'What does it cost?', k:['fee','cost','price','pay','money','expensive','afford','instal','upi','bank','charge'],
   a:'The Foundation units, the reading lists, your learning record and one open live class a month are free. The fee for each edition is available on request and is always shown in full before you enrol, including our administration charge. There is no subscription, and payment is by bank transfer or UPI.', go:'fees'},
  {q:'Can I start free?', k:['free','trial','start','begin','try'],
   a:'Yes. You can start today with the 25 Foundation units, the free reading lists, your learning record, an open live class each month, CV and interview practice, and help by voice, chat or a person. None of these needs a payment to continue.', go:'free'},
  {q:'Can I study on my phone?', k:['phone','mobile','voice','speak','type','typing','computer','skill','tablet'],
   a:'Yes. A phone is enough. Every step works by speaking or by typing, every unit can be read aloud, and you choose to see, hear, read or do each one.', go:'learn'},
  {q:'What do I receive at the end?', k:['certificate','receive','get at the end','outcome','leave with','award','end of'],
   a:'A certificate of completion for each edition you complete, your learning record with practice points, your business plan and project work, and the next stage of your career path.', go:'leave'},
  {q:'How many hours a week?', k:['hours','week','workload','busy','part time','part-time','job','time'],
   a:'Plan on about 10 to 12 hours a week, spread as suits you. Units take about five minutes each, and much of the work is done on your own job or venture.', go:'years'},
  {q:'Who can join?', k:['join','entry','eligib','qualif','requirement','admission','apply','exam','test','who can'],
   a:'Edition 1 is open to anyone who can give about 10 hours a week; there is no entrance examination. Later editions ask for the edition below or equivalent experience, discussed in a short conversation with our admissions team.', go:'register'},
  {q:'Can I move up to the next edition?', k:['move up','next edition','upgrade','continue','switch','climb','carry','later edition'],
   a:'Yes. Each edition includes the one before it, and everything you complete carries forward: your units, practice points, business plan and record. You can stop after any edition and return later.', go:'years'},
  {q:'Where do I study?', k:['where','online','centre','center','campus','hybrid','classroom','location','city','country','abroad'],
   a:'Online, in a hybrid group, or at a centre where one is open. Live classes are recorded, so you can catch up if you miss one.', go:'learn'},
  {q:'What is the business plan?', k:['business plan','practicum','project','venture','pitch','capstone','plan'],
   a:'In every edition you build a business plan for a real venture. You draft it with several AI assistants, check every claim yourself, make it your own and test it with real people. Edition 1 ends with a pitch to a peer panel, Edition 2 with a board defence before an outside practitioner, and Edition 3 with a presentation to a real outside audience.', go:'editions'},
  {q:'Which sectors are covered?', k:['sector','industry','specialis','field','domain'],
   a:'Examples in every unit come from your own sector, with 50 to choose from, from healthcare and construction to data and AI. Edition 3 adds a full specialist year in one sector.', go:'learn'},
  {q:'Who teaches?', k:['teach','faculty','trainer','mentor','who leads','professor','coach','tutor'],
   a:'Small cohorts are led by practitioners who have done the work they teach and have completed our trainer induction. From Edition 3 you can take the induction yourself and co-lead sessions beside a certified trainer. Editions 2 to 4 add mentoring for your project.', go:'editions'},
  {q:'Can my employer pay?', k:['employer','company','sponsor','corporate','team','reimburse','organisation','organization'],
   a:'Yes. Employers and partners can sponsor seats, and teams can follow a workplace pathway together. Mention it in the form below.', go:'register'},
  {q:'How is my data used?', k:['data','privacy','personal','information','delete','share','safe','secure'],
   a:'We ask only for what we need to reply to you. Your notes and record are yours: you can see, download or delete them at any time, and we never sell personal data.', go:'register'},
  {q:'Can I pause?', k:['pause','break','stop','quit','refund','cancel','leave the'],
   a:'Yes. You pay as you go, one four-month term at a time, so you can pause between terms and return later. A clear refund policy and a named contact for complaints come with every enrolment.', go:'fees'},
  {q:'What language is it taught in?', k:['language','hindi','english','arabic','tamil','marathi','gujarati','bengali','translate'],
   a:'Classes are taught in English. You can ask questions by speaking or typing in your own language, and further languages are added over time.', go:'learn'},
  {q:'How is AI used?', k:[' ai','ai ','artificial','assistant','machine','chatbot'],
   a:'You learn to use AI assistants well and safely: you draft with several of them, compare their answers, check every claim against public sources and keep personal details out of them. The judgement and the final work are always yours.', go:'editions'},
  {q:'Do I work with other people?', k:['collaborat','together','other people','with others','network','marketplace','workplace','shared','peer'],
   a:'Yes. Alongside your cohort and mentors, you work with others in seven shared spaces: a studio where units are made and improved, a platform where courses are built, a network of trainers, coaches and mentors, a marketplace, a workplace, one shared place for notes, and your career record.', go:'collab'},
  {q:'Why learn this if AI can do it?', k:['why learn','ai can do','ai does','replace','replace me','replace us','replace people','replace my','take my job','human','humans','still need','left for people','what stays'],
   a:'Because what carries meaning and responsibility stays with people. AI can explain, draft, check and summarise, and you learn to use it well. Your understanding, your judgement, your name on what you author, the care you show as a trainer and the trust you build with others stay with you, and the time AI saves goes back into people.', go:'human'},
  {q:'What happens in the research year?', k:['research','fourth year','year 4','edition 4','supervis','fieldwork','ethics review','thesis','dissertation','public talk'],
   a:'In the fourth year you study a question from your own sector. In the first four months you frame the question and plan the study, with a short proposal and an ethics review before you begin. In the next four you gather the evidence with consent and analyse it with your peers. In the last four you write a report of about 10,000 words and give a public talk, with questions from a panel. A supervisor guides you throughout, and you also lead a learning group or write a module of units, and mentor two learners.', go:'editions'}
];
const FAQ_FIRST = 6;

/* ---------- small helpers ---------- */
let toastTimer = 0;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, Math.min(9000, 3000 + msg.length * 45));
}
function goTo(id){
  const el = document.getElementById(id); if (!el) return;
  el.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'});
}
const edOf = n => EDITIONS[n - 1];

/* ---------- reading aloud (built into the browser; nothing is recorded or sent) ---------- */
let speakBtn = null, speakRun = 0;
function voiceLang(){ const l = navigator.language || ''; return /^en/i.test(l) ? l : 'en-IN'; }
function setSpeakState(btn){
  if (speakBtn && speakBtn !== btn) paintListen(speakBtn, false);
  speakBtn = btn || null;
  if (btn) paintListen(btn, true);
}
function paintListen(btn, on){
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  const sw = btn.querySelector('.sw'); if (sw) sw.innerHTML = ic(on ? 'stop' : 'speaker', 'sm');
  const lbl = btn.querySelector('.lbl'); if (lbl) lbl.textContent = on ? 'Stop' : (btn.dataset.l || 'Listen');
}
function stopSpeaking(){ speakRun++; try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} if (speakBtn) { paintListen(speakBtn, false); speakBtn = null; } }
function say(text, btn){
  if (btn && speakBtn === btn) { stopSpeaking(); return; }
  stopSpeaking();
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { toast('Reading aloud is not available in this browser.'); return; }
  const parts = String(text || '').replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*\s*/g) || [];
  if (!parts.length) return;
  const run = ++speakRun; setSpeakState(btn);
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p.trim()); u.lang = voiceLang(); u.rate = 0.96;
    if (i === parts.length - 1) { u.onend = u.onerror = () => { if (run === speakRun && speakBtn === btn) { if (btn) paintListen(btn, false); speakBtn = null; } }; }
    try { synth.speak(u); } catch (e) {}
  });
}
const listenBtn = (key, label) => `<button class="btn quiet small" type="button" data-say="${key}" aria-pressed="false"${label ? ` data-l="${esc(label)}"` : ''}><span class="sw">${ic('speaker','sm')}</span><span class="lbl">${esc(label || 'Listen')}</span></button>`;

/* ---------- speaking instead of typing ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let rec = null, recFor = '';
function micHint(){
  return window.matchMedia('(pointer: coarse)').matches
    ? 'Speaking needs the microphone, which this view does not allow. Tap the box, then the microphone key on your keyboard, and speak.'
    : 'Speaking needs the microphone, which this view does not allow. Click the box, press the Windows key and H (on a Mac, the Fn key twice), and speak.';
}
function paintMics(){
  $$('[data-mic]').forEach(b => {
    const on = !!rec && b.dataset.mic === recFor;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.innerHTML = ic(on ? 'stop' : 'mic', 'sm') + (b.classList.contains('btn') ? (on ? 'Stop' : 'Speak') : '');
    b.setAttribute('aria-label', on ? 'Stop listening' : (b.dataset.mic === 'askInput' ? 'Speak your question' : 'Speak instead of typing'));
  });
}
function dictate(id){
  if (rec) { try { rec.stop(); } catch (e) {} return; }
  const box = document.getElementById(id);
  if (!SR) { toast(micHint()); if (box) box.focus(); return; }
  try {
    stopSpeaking();
    const r = rec = new SR(); recFor = id;
    const base = box && box.value.trim() ? box.value.trim() + ' ' : '';
    let heard = '';
    r.lang = navigator.language || 'en-IN'; r.interimResults = true; r.maxAlternatives = 1;
    r.onresult = ev => { let interim = ''; for (let i = ev.resultIndex; i < ev.results.length; i++) { const x = ev.results[i]; if (x.isFinal) heard += x[0].transcript; else interim += x[0].transcript; } if (box) box.value = base + heard + interim; };
    r.onerror = ev => { const c = ev && ev.error; if (['not-allowed','service-not-allowed','audio-capture','network'].includes(c)) toast(micHint()); else if (c !== 'aborted' && c !== 'no-speech') toast('I could not hear that. Please try again, or type.'); };
    r.onend = () => { if (rec === r) { rec = null; recFor = ''; } paintMics(); if (id === 'askInput' && heard.trim() && box && box.value.trim()) answer(box.value); };
    r.start(); paintMics();
  } catch (e) { rec = null; recFor = ''; paintMics(); toast(micHint()); }
}

/* ---------- hero, ladder and the edition panel ---------- */
function renderFixed(){
  $('#listenPage .sw').innerHTML = ic('speaker','sm');
  $$('.hw').forEach(x => { x.innerHTML = handIcon('sm'); });
  $('#heroFree').innerHTML = `${ic('spark','sm')}Start free`;
  $('#facts').innerHTML = [['cal','1 to 4 years'],['clock','About 10 to 12 hours a week'],['hybrid','Online, hybrid or at a centre'],['mic','Speak or type']]
    .map(f => `<li>${ic(f[0],'sm')}${esc(f[1])}</li>`).join('');
  $('#ladderCap').innerHTML = `${ic('info','sm')}<span>Each edition includes the one below it. Choose one to open it.</span>`;
  $('#ladder').innerHTML = EDITIONS.map(e => `<button class="rung" type="button" data-rung="${e.n}" aria-pressed="false">
      <span class="r-ed">Edition ${e.n}</span><span class="r-yr">${esc(e.years)}</span><span class="r-t">${esc(e.short)}</span><span class="r-pp">${e.pp} points</span></button>`).join('');
  $('#edCaps').innerHTML = EDITIONS.map(e => `<button class="cap" type="button" data-ed="${e.n}" aria-pressed="false">Edition ${e.n} · ${esc(e.years)}</button>`).join('');
  $('#spans').innerHTML = EDITIONS.map(e => `<button class="span" type="button" data-ed="${e.n}" aria-pressed="false"><span>Edition ${e.n}</span><small>${esc(e.span.replace('Months ', 'months '))}</small></button>`).join('');
  $('#yearCards').innerHTML = YEARS.map(y => `<article class="year" data-year="${y.n}">
      <span class="m">Year ${y.n} · ${esc(y.m)}</span><h3>${esc(y.title)}</h3>
      <ul>${y.items.map(i => `<li>${ic(i[0],'sm')}<span>${esc(i[1])}</span></li>`).join('')}</ul>
      <span class="ends">${ic('check','sm')}Edition ${y.n} completes here</span></article>`).join('');
  $('#modes').innerHTML = MODES.map(m => `<div class="mode"><span class="badge">${ic(m[0],'lg')}</span><h3>${esc(m[1])}</h3><p>${esc(m[2])}</p></div>`).join('');
  $('#ways').innerHTML = WAYS.map(w => `<div class="way">${ic(w[0])}<div><b>${esc(w[1])}</b><span>${esc(w[2])}</span></div></div>`).join('');
  $('#spaces').innerHTML = SPACES.map(w => `<li>${ic(w[0])}<div><b>${esc(w[1])}</b><span>${esc(w[2])}</span></div></li>`).join('');
  $('#keeps').innerHTML = KEEPS.map(w => `<li>${ic(w[0])}<div><b>${esc(w[1])}</b><span>${esc(w[2])}</span></div></li>`).join('');
  renderOffers(false);
  $('#gets').innerHTML = GETS.map(g => `<li>${ic(g[0])}<div><b>${esc(g[1])}</b><span>${esc(g[2])}</span></div></li>`).join('');
  $('#feeRules').innerHTML = FEE_RULES.map(f => `<li>${ic('check','sm')}<span>${esc(f[0])}</span></li>`).join('');
  $('#feeRows').innerHTML = `<tr><td>Foundation units and the free offers</td><td>Any time</td><td class="fee">Free</td></tr>` +
    EDITIONS.map(e => `<tr><td>Edition ${e.n}: ${esc(e.title)}</td><td>${esc(e.years)}</td><td class="fee">Fee on request</td></tr>`).join('');
  $('#dockAsk').innerHTML = `${ic('chat')}Ask`;
  $('#dockFree').innerHTML = `${ic('spark')}Start free`;
  $('#dockReg').innerHTML = `${ic('send')}Register`;
  $('#askSend').innerHTML = ic('send','sm');
  renderChips(false); renderStrands(false); renderSectors(false);
}
function renderOffers(all){
  $('#offers').innerHTML = (all ? OFFERS : OFFERS.slice(0, 4)).map(o => `<li class="offer">${ic(o[0])}<div><b>${esc(o[1])}</b><span>${esc(o[2])}</span></div></li>`).join('');
  $('#offerMore').innerHTML = all ? `<button class="cap more" type="button" data-offers="0">Fewer</button>` : `<button class="cap more" type="button" data-offers="1">${OFFERS.length - 4} more free offers</button>`;
}
function renderStrands(all){
  const shown = all ? STRANDS : STRANDS.slice(0, 6);
  $('#strands').innerHTML = shown.map(s => `<li>${esc(s)}</li>`).join('');
  $('#strandMore').innerHTML = all ? `<button class="cap more" type="button" data-strands="0">Fewer</button>` : `<button class="cap more" type="button" data-strands="1">${STRANDS.length - 6} more strands</button>`;
}
function renderSectors(all){
  const top = ['other','retail','healthcare','construction','software','agriculture','education','hospitality'];
  const list = all ? SECTORS : SECTORS.filter(s => top.includes(s[0]) || s[0] === S.sector);
  $('#sectors').innerHTML = list.map(s => `<button class="cap" type="button" data-sector="${esc(s[0])}" aria-pressed="${s[0] === S.sector}">${esc(s[1])}</button>`).join('') +
    (all ? `<button class="cap more" type="button" data-sectors="0">Fewer</button>` : `<button class="cap more" type="button" data-sectors="1">All 50 sectors</button>`);
}
function edText(e){
  return `Edition ${e.n}. ${e.title}. ${e.years}. ${e.who} ${e.study} Your business plan: ${e.plan} You finish with ${e.finish.charAt(0).toLowerCase() + e.finish.slice(1)}`;
}
let showMods = false;
function renderEdition(){
  const e = edOf(S.ed);
  $$('[data-rung]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.rung === S.ed)));
  $$('#edCaps [data-ed], #spans [data-ed]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.ed === S.ed)));
  $$('#yearCards .year').forEach(y => y.classList.toggle('out', +y.dataset.year > S.ed));
  $('#path').innerHTML = PATH.map((p, i) => `<li${i <= S.ed ? ' class="reach"' : ''}><span class="dot">${i === 0 ? ic('spark','sm') : 'E' + i}</span><div><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div><small>${p[2]} pts</small></li>`).join('');
  const blocks = BLOCKS.filter(b => b.n <= (S.ed === 1 ? 3 : S.ed === 4 ? 9 : 6)), later = LATER.filter(l => l.n <= S.ed);
  const count = blocks.length * 3, first = blocks.filter(b => b.n <= 6), research = blocks.filter(b => b.n > 6);
  const blockHtml = list => `<div class="blocks">${list.map(b => `<div class="block"><span class="m">${b.mods[0][0].startsWith('MC') ? `Block ${b.n} · ` : `Year ${b.n} · `}${esc(b.m)}</span><h5>${esc(b.name)}</h5>
      <ul>${b.mods.map(m => `<li><span class="code">${esc(m[0])}</span><span>${esc(m[1])}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
  $('#edPanel').innerHTML = `
    <div class="ed-top"><span class="code">Edition ${e.n}</span><span class="muted">${esc(e.years)} · ${esc(e.span)}</span><span class="grow"></span>${listenBtn('ed')}</div>
    <div><h3>${esc(e.title)}</h3><p class="who">${esc(e.who)}</p></div>
    <dl class="kv">
      <div><dt>Length</dt><dd>${esc(e.years)}</dd></div>
      <div><dt>Study time</dt><dd>About 10 to 12 hours a week</dd></div>
      <div><dt>Practice points</dt><dd>${e.pp}</dd></div>
      <div><dt>Career stage</dt><dd>${esc(e.stage)}</dd></div>
    </dl>
    <div class="ed-body">
      <div><h4>${ic('learn','sm')}What you study</h4><p>${esc(e.study)}</p></div>
      <div><h4>${ic(e.research ? 'search' : 'doc','sm')}${e.research ? 'Your research project' : 'Your business plan'}</h4><p>${esc(e.plan)}</p></div>
      <div><h4>${ic('badge','sm')}You finish with</h4><p>${esc(e.finish)}</p><p class="muted entry-note"><b>Who can join.</b> ${esc(e.entry)}</p></div>
    </div>
    <div class="mods">
      ${showMods ? blockHtml(first) + (later.length ? blockHtml(later) : '') + (research.length ? blockHtml(research) : '') + `<p class="muted fine">The business plan practicum, <span class="code">MC-604</span>, runs through the first three years.</p>` : ''}
      <div class="ed-act">
        <button class="cap more" type="button" data-mods="${showMods ? 0 : 1}" aria-expanded="${showMods}">${showMods ? 'Hide the modules' : `See the ${count} modules${later.length ? ' and the specialist year' : ''}`}</button>
      </div>
    </div>
    <div class="ed-act">
      <button class="btn primary" type="button" data-regfor="${e.n}">${ic('send','sm')}Register interest in Edition ${e.n}</button>
      <a class="btn quiet" href="#free">${ic('spark','sm')}Start free</a>
    </div>`;
}
function selectEdition(n, open){
  S.ed = n; save(); renderEdition();
  if (open) goTo('editions');
}

/* ---------- the free sample unit ---------- */
const STEPS = ['Hook','Idea','Your sector','Try it today','Caution','Reflect','Check'];
const U = {step:0, seen:new Set([0]), picked:null, note:''};
function sectorLabel(k){ const s = SECTORS.find(x => x[0] === k); return s ? s[1] : SECTORS[0][1]; }
function stepText(i){
  const ex = EXAMPLES[S.sector] || EXAMPLES.other;
  return [UNIT.hook, UNIT.idea, `${sectorLabel(S.sector)}. ${ex[0]}`, UNIT.try_it_today, UNIT.quiet_caution, UNIT.reflection,
    `${UNIT.check_question} ${UNIT.options.map((o, j) => `Option ${'ABC'[j]}: ${o}.`).join(' ')}`][i];
}
const LOOP_SVG = `<svg class="loop" viewBox="0 0 360 200" role="img" aria-label="A habit is a loop: a cue leads to a routine, the routine to a reward, and the reward strengthens the cue.">
  <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="h" d="M0 0 10 5 0 10z"/></marker></defs>
  <path class="a" d="M128 56 Q180 28 232 56" marker-end="url(#ah)"/>
  <path class="a" d="M276 104 Q262 150 214 166" marker-end="url(#ah)"/>
  <path class="a" d="M146 166 Q98 150 84 104" marker-end="url(#ah)"/>
  <rect class="n" x="20" y="44" width="104" height="52" rx="14"/><text x="72" y="75" text-anchor="middle">Cue</text>
  <rect class="n" x="236" y="44" width="104" height="52" rx="14"/><text x="288" y="75" text-anchor="middle">Routine</text>
  <rect class="n" x="128" y="140" width="104" height="52" rx="14"/><text x="180" y="171" text-anchor="middle">Reward</text>
  <text class="c" x="180" y="22" text-anchor="middle">after morning tea…</text>
  <text class="c" x="180" y="112" text-anchor="middle">keep the first step tiny</text>
</svg>`;
function renderUnit(){
  const i = U.step;
  const ex = EXAMPLES[S.sector] || EXAMPLES.other;
  let body = '';
  if (i === 0) body = `<p class="u-text">${esc(UNIT.hook)}</p><p class="u-small">${ic('clock','sm')} About five minutes. Use Next, or choose any part above.</p>`;
  else if (i === 1) body = `<p class="u-text sm">${esc(UNIT.idea)}</p>${LOOP_SVG}`;
  else if (i === 2) body = `<div class="sector-pick"><p class="u-small">Your sector</p><div class="caps" id="unitSectors"></div></div>
      <p class="u-text">${esc(ex[0])}</p>${ex[1] ? `<div class="note">${ic('shield','sm')}<span>${esc(ex[1])}</span></div>` : ''}`;
  else if (i === 3) body = `<p class="u-text">${esc(UNIT.try_it_today)}</p><p class="u-small">This is the Do part: on the live site you keep your evidence as a photo, a voice note or a line of text.</p>`;
  else if (i === 4) body = `<p class="u-text">${esc(UNIT.quiet_caution)}</p><p class="u-small">Every unit carries one quiet caution: what not to do, even when you could.</p>`;
  else if (i === 5) body = `<p class="u-text">${esc(UNIT.reflection)}</p>
      <label class="sr" for="unitNote">Your reflection</label>
      <textarea class="box" id="unitNote" placeholder="Speak or type your answer">${esc(U.note)}</textarea>
      <div class="row"><button class="btn quiet small" type="button" data-mic="unitNote" aria-pressed="false" aria-label="Speak instead of typing"></button><span class="u-small">What you write stays on this page. Nothing is sent or kept.</span></div>`;
  else {
    const ans = 'ABC'.indexOf(UNIT.answer);
    body = `<p class="u-text sm" id="chkQ">${esc(UNIT.check_question)}</p>
      <div class="opts" role="group" aria-labelledby="chkQ">${UNIT.options.map((o, j) => `<button class="opt${U.picked === j ? (j === ans ? ' right' : ' wrong') : ''}${U.picked != null && U.picked !== j && j === ans ? ' right' : ''}" type="button" data-opt="${j}"><b>${'ABC'[j]}</b>${esc(o)}</button>`).join('')}</div>
      ${U.picked == null ? '' : `<div class="fb${U.picked === ans ? ' ok' : ''}" role="status">${U.picked === ans
        ? 'Correct. Research suggests about two months on average, with wide variation. On the live site, this unit would add 4 practice points to your record.'
        : 'Not quite. Research suggests about two months on average, with wide variation; the popular figure of 21 days is not supported.'}</div>`}`;
  }
  $('#unit').innerHTML = `
    <div class="unit-top"><div class="grow"><span class="code">Unit ${esc(UNIT.id)} · Foundation · free</span><h3>${esc(UNIT.title)}</h3></div>${listenBtn('unit','Listen to this part')}</div>
    <div class="steps" role="group" aria-label="Parts of the unit">${STEPS.map((s, j) => `<button class="step${U.seen.has(j) && j !== i ? ' done' : ''}" type="button" data-step="${j}"${j === i ? ' aria-current="step"' : ''}><b>${j + 1}</b>${esc(s)}</button>`).join('')}</div>
    <div class="u-body">${body}</div>
    <div class="u-nav">
      <button class="btn quiet small${i === 0 ? ' is-hidden' : ''}" type="button" data-unav="-1"${i === 0 ? ' disabled' : ''}>${ic('chevl','sm')}Back</button>
      ${i < STEPS.length - 1 ? `<button class="btn primary small" type="button" data-unav="1">Next: ${esc(STEPS[i + 1])}${ic('chev','sm')}</button>` : `<a class="btn primary small" href="#register">${ic('send','sm')}Register interest</a>`}
    </div>`;
  if (i === 2) $('#unitSectors').innerHTML = SECTORS.filter(s => ['other','retail','healthcare','construction','software','agriculture'].includes(s[0]) || s[0] === S.sector)
    .map(s => `<button class="cap" type="button" data-usector="${esc(s[0])}" aria-pressed="${s[0] === S.sector}">${esc(s[1])}</button>`).join('') + `<button class="cap more" type="button" data-usector="*">All 50</button>`;
  paintMics();
}
function unitGo(i){
  if (i < 0 || i >= STEPS.length) return;
  const note = $('#unitNote'); if (note) U.note = note.value;
  stopSpeaking(); U.step = i; U.seen.add(i); renderUnit();
}

/* ---------- questions ---------- */
let chipsAll = false;
function renderChips(all){
  chipsAll = all;
  const list = all ? FAQ : FAQ.slice(0, FAQ_FIRST);
  $('#askChips').innerHTML = list.map(f => `<button class="cap" type="button" data-q="${FAQ.indexOf(f)}">${esc(f.q)}</button>`).join('') +
    `<button class="cap more" type="button" data-chips="${all ? 0 : 1}">${all ? 'Fewer' : `${FAQ.length - FAQ_FIRST} more questions`}</button>`;
}
let lastAnswer = null;
function renderAnswer(){
  const box = $('#answer');
  if (!lastAnswer) {
    box.innerHTML = `<p class="eyebrow">Answer</p><p class="muted">Choose a question on the left, or ask your own by speaking or typing. The answer appears here and can be read aloud.</p>`;
    return;
  }
  const a = lastAnswer;
  box.innerHTML = `<p class="q">${esc(a.q)}</p><p class="a">${esc(a.a)}</p>
    <div class="row">${listenBtn('answer')}${a.go ? `<a class="btn quiet small" href="#${esc(a.go)}">${ic('arrow','sm')}Show me</a>` : ''}${a.unknown ? `<button class="btn primary small" type="button" data-askform="1">${ic('send','sm')}Put my question in the form</button>` : ''}</div>`;
}
function match(text){
  const t = ' ' + String(text || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
  let best = null, score = 0;
  FAQ.forEach(f => {
    let s = 0; f.k.forEach(k => { if (t.includes(k)) s += k.trim().length > 4 ? 2 : 1; });
    if (f.q.toLowerCase().replace(/[?]/g, '').split(' ').every(w => t.includes(w))) s += 3;
    if (s > score) { score = s; best = f; }
  });
  return score > 0 ? best : null;
}
function answer(text){
  const q = String(text || '').trim(); if (!q) { $('#askInput').focus(); return; }
  const f = match(q);
  lastAnswer = f ? {q:f.q === q ? f.q : q, a:f.a, go:f.go} : {q, a:'I do not have a ready answer to that. Leave your question in the form below, and the admissions team will reply by email.', unknown:true};
  if (f && f.q !== q) lastAnswer.a = f.a;
  stopSpeaking(); renderAnswer();
  if (window.matchMedia('(max-width: 900px)').matches) $('#answer').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'nearest'});
}

/* ---------- register interest (sent to the site's message service) ---------- */
const FIND = ['A friend or colleague','Our website','Social media','An event'];
const FIND_MORE = ['A partner organisation','A search engine','News or a magazine','Another way'];
const R = {ed:null, how:'Online', find:null, findMore:false, sent:false, err:'', vals:{}, busy:false, fail:false, ref:''};
function regValues(){
  const v = {}; ['regEmail','regName','regCode','regQ'].forEach(id => { const el = document.getElementById(id); if (el) v[id] = el.value; });
  const n = document.getElementById('regNews'); if (n) v.regNews = n.checked;
  return Object.assign(R.vals, v);
}
function renderReg(){
  const v = R.vals, ed = R.ed == null ? S.ed : R.ed;
  if (R.sent) {
    $('#regWrap').innerHTML = `<div class="card done-card" role="status"><h3>${ic('check')}Thank you</h3>
      <p>Your interest in ${ed === 0 ? 'the programme' : `Edition ${ed}, ${esc(edOf(ed).title)},`} has reached our admissions team${R.ref ? ` (reference <span class="code">${esc(R.ref)}</span>)` : ''}.</p>
      <p class="muted">They reply by email. You can start the free units at once.</p>
      <div class="row"><a class="btn primary small" href="#free">${ic('spark','sm')}Start free</a><button class="btn quiet small" type="button" data-regedit="1">Change my answers</button></div></div>`;
    return;
  }
  const capRow = (name, list, cur) => list.map(x => `<button class="cap" type="button" data-${name}="${esc(x)}" aria-pressed="${x === cur}">${esc(x)}</button>`).join('');
  $('#regWrap').innerHTML = `<form class="card form" id="regForm" novalidate>${R.fail ? `<p class="err" role="alert">We could not send your note just now. Please try again in a little while, or write to us on the <a href="contact.html">Contact page</a>.</p>` : ''}<div class="hp" aria-hidden="true"><label for="regWeb">Leave this empty</label><input id="regWeb" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <div class="two">
      <div class="field"><label for="regEmail">Email</label><input id="regEmail" type="email" inputmode="email" autocomplete="email" required value="${esc(v.regEmail || '')}" aria-describedby="regEmailErr">
        <span class="err" id="regEmailErr"${R.err ? '' : ' hidden'}>${esc(R.err)}</span></div>
      <div class="field"><label for="regName">Your name <span class="hint">(optional)</span></label><input id="regName" type="text" autocomplete="name" value="${esc(v.regName || '')}"></div>
    </div>
    <div class="field"><span class="lbl" id="lblEd">Edition</span><div class="caps" role="group" aria-labelledby="lblEd">
      ${EDITIONS.map(e => `<button class="cap" type="button" data-red="${e.n}" aria-pressed="${ed === e.n}">Edition ${e.n} · ${esc(e.years)}</button>`).join('')}
      <button class="cap" type="button" data-red="0" aria-pressed="${ed === 0}">Not sure yet</button></div></div>
    <div class="field"><span class="lbl" id="lblHow">How would you like to study?</span><div class="caps" role="group" aria-labelledby="lblHow">${capRow('rhow', ['Online','Hybrid','At a centre'], R.how)}</div></div>
    <div class="field"><span class="lbl" id="lblFind">How did you find us? <span class="hint">(optional)</span></span><div class="caps" role="group" aria-labelledby="lblFind">
      ${capRow('rfind', R.findMore ? FIND.concat(FIND_MORE) : FIND, R.find)}${R.findMore ? '' : `<button class="cap more" type="button" data-rfindmore="1">More</button>`}</div></div>
    <div class="two">
      <div class="field"><label for="regCode">Referral code <span class="hint">(optional)</span></label><input id="regCode" type="text" autocomplete="off" value="${esc(v.regCode || '')}"></div>
      <div class="field"><span class="lbl">&nbsp;</span><span class="hint">If a member referred you, their code links you both. You will receive your own code when you join.</span></div>
    </div>
    <div class="field"><label for="regQ">Your question <span class="hint">(optional)</span></label>
      <textarea class="box" id="regQ" placeholder="Speak or type">${esc(v.regQ || '')}</textarea>
      <div class="row"><button class="btn quiet small" type="button" data-mic="regQ" aria-pressed="false" aria-label="Speak instead of typing"></button><span class="hint">Your employer or a partner may sponsor your seat; mention it here.</span></div></div>
    <label class="check"><input type="checkbox" id="regNews"${v.regNews ? ' checked' : ''}><span>Also tell me about open live classes. <span class="muted">You can stop these at any time.</span></span></label>
    <div class="row"><button class="btn primary" type="submit">${ic('send','sm')}Register interest</button><span class="hint">We use your email only to reply to you, and delete it on request.</span></div>
  </form>`;
  paintMics();
}
function renderRegNotes(){
  $('#regNotes').innerHTML = [
    ['spark','Start today','The 25 Foundation units are free. You do not need to wait for a reply.'],
    ['shield','Your details','We ask only for what we need to reply. You can ask us to delete them at any time.'],
    ['bank','When enrolment opens','The full fee for your edition is shown before you decide. Payment is by bank transfer or UPI.']
  ].map(n => `<div class="way">${ic(n[0])}<div><b>${esc(n[1])}</b><span>${esc(n[2])}</span></div></div>`).join('');
}

/* ---------- the pointing hand ---------- */
const root = document.documentElement;
const cur = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}") 11 2`;
root.style.setProperty('--cur-hand', cur(handSvg('#FFFFFF', '#14202B', 32)) + ', auto');
root.style.setProperty('--cur-hand-on', cur(handSvg('#E3EFF9', '#0B6AAE', 32)) + ', pointer');
root.style.setProperty('--cur-hand-press', cur(handSvg('#0F85DB', '#0B3F66', 32)) + ', pointer');
const thand = $('#thand');
thand.innerHTML = handSvg('#FFFFFF', '#14202B');
const TIP = {x: 11.5 / 32 * 62, y: 2 / 32 * 62};
let touchMode = window.matchMedia('(pointer: coarse)').matches, parked = true, hx = 0, hy = 0, aimed = null, drag = null;
const INTERACTIVE = 'a[href],button,input,textarea,label,summary,[role="button"],[tabindex]:not([tabindex="-1"])';
function ripple(x, y){
  if (reduceMotion) return;
  const r = document.createElement('span'); r.className = 'ripple'; r.style.left = x + 'px'; r.style.top = y + 'px';
  document.body.appendChild(r); setTimeout(() => r.remove(), 560);
}
function targetAt(x, y){
  const els = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
  for (const el of els) { if (!el || thand.contains(el)) continue; return el.closest(INTERACTIVE); }
  return null;
}
function aim(){
  const t = parked || thand.hidden ? null : targetAt(hx, hy);
  if (t === aimed) return;
  if (aimed) aimed.classList.remove('hand-aim');
  aimed = t; if (t) t.classList.add('hand-aim');
}
function placeHand(x, y){
  hx = Math.max(6, Math.min(window.innerWidth - 6, x)); hy = Math.max(6, Math.min(window.innerHeight - 6, y));
  thand.style.transform = `translate(${hx - TIP.x}px, ${hy - TIP.y}px)`; aim();
}
function park(){
  const dock = $('.dock'), dh = dock && getComputedStyle(dock).display !== 'none' ? dock.offsetHeight : 0;
  parked = true; placeHand(window.innerWidth - 62 - 14 + TIP.x, window.innerHeight - dh - 62 - 16 + TIP.y);
}
function syncHand(){
  root.classList.toggle('hand-on', !!S.hand);
  ['#handToggle', '#handToggle2'].forEach(s => { const b = $(s); if (b) b.setAttribute('aria-pressed', String(!!S.hand)); });
  thand.hidden = !(S.hand && touchMode);
  if (!thand.hidden && parked) park();
  if (thand.hidden && aimed) { aimed.classList.remove('hand-aim'); aimed = null; }
}
function activate(t){
  if (t.matches('input[type=email],input[type=text],textarea')) { t.focus(); return; }
  t.click();
}
thand.addEventListener('pointerdown', e => {
  e.preventDefault(); try { thand.setPointerCapture(e.pointerId); } catch (er) {}
  drag = {id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:hx - e.clientX, oy:hy - e.clientY, t:Date.now(), moved:0};
  thand.classList.add('held');
});
thand.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy));
  if (drag.moved > 6) { parked = false; placeHand(e.clientX + drag.ox, e.clientY + drag.oy); }
});
thand.addEventListener('pointerup', e => {
  if (!drag || e.pointerId !== drag.id) return;
  const tap = drag.moved <= 6 && Date.now() - drag.t < 450; drag = null; thand.classList.remove('held');
  if (!tap) return;
  if (parked) { toast('Drag the hand onto anything on the page, then tap the hand to open it.'); return; }
  const t = targetAt(hx, hy); ripple(hx, hy);
  if (t) activate(t); else toast('Nothing to open here. Drag the hand onto a button, a capsule or a link.');
});
thand.addEventListener('pointercancel', () => { drag = null; thand.classList.remove('held'); });
document.addEventListener('pointerdown', e => {
  if (thand.contains(e.target)) return;
  if (e.pointerType === 'touch' && !touchMode) { touchMode = true; syncHand(); }
  if (!S.hand) return;
  if (e.pointerType === 'mouse') root.classList.add('hand-press');
  ripple(e.clientX, e.clientY);
}, {passive:true});
document.addEventListener('pointerup', () => root.classList.remove('hand-press'), {passive:true});
window.addEventListener('blur', () => root.classList.remove('hand-press'));
let aimFrame = 0;
window.addEventListener('scroll', () => { if (aimFrame) return; aimFrame = requestAnimationFrame(() => { aimFrame = 0; aim(); }); }, {passive:true});
window.addEventListener('resize', () => { if (thand.hidden) return; if (parked) park(); else placeHand(hx, hy); });
document.addEventListener('focusin', e => { if (e.target.matches && e.target.matches('input[type=email],input[type=text],textarea')) thand.classList.add('away'); });
document.addEventListener('focusout', () => thand.classList.remove('away'));

/* ---------- one listener for every capsule and button ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('button,a'); if (!b) return;
  const d = b.dataset;
  if (d.rung) { selectEdition(+d.rung, true); return; }
  if (d.ed && (b.closest('#edCaps') || b.closest('#spans'))) { selectEdition(+d.ed, false); return; }
  if (d.mods) { showMods = d.mods === '1'; renderEdition(); return; }
  if (d.say) {
    if (d.say === 'page') say(PAGE_SUMMARY, b);
    else if (d.say === 'ed') say(edText(edOf(S.ed)), b);
    else if (d.say === 'unit') say(stepText(U.step), b);
    else if (d.say === 'answer' && lastAnswer) say(lastAnswer.a, b);
    return;
  }
  if (d.mic) { dictate(d.mic); return; }
  if (d.strands) { renderStrands(d.strands === '1'); return; }
  if (d.offers) { renderOffers(d.offers === '1'); return; }
  if (d.sectors) { renderSectors(d.sectors === '1'); return; }
  if (d.sector) { S.sector = d.sector; save(); renderSectors(false); U.seen.add(2); U.step = 2; stopSpeaking(); renderUnit(); goTo('unit'); return; }
  if (d.usector) {
    if (d.usector === '*') { renderSectors(true); goTo('learn'); toast('Choose your sector from the list of 50.'); return; }
    S.sector = d.usector; save(); renderUnit(); renderSectors(false); return;
  }
  if (d.step) { unitGo(+d.step); return; }
  if (d.unav) { unitGo(U.step + +d.unav); return; }
  if (d.opt) { U.picked = +d.opt; U.seen.add(6); renderUnit(); return; }
  if (d.q) { const f = FAQ[+d.q]; lastAnswer = {q:f.q, a:f.a, go:f.go}; stopSpeaking(); renderAnswer(); if (window.matchMedia('(max-width: 900px)').matches) $('#answer').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'nearest'}); return; }
  if (d.chips) { renderChips(d.chips === '1'); return; }
  if (d.askform) { regValues(); R.vals.regQ = lastAnswer ? lastAnswer.q : ''; R.sent = false; renderReg(); goTo('register'); setTimeout(() => { const q = $('#regEmail'); if (q) q.focus({preventScroll:true}); }, 450); return; }
  if (d.regfor) { regValues(); R.ed = +d.regfor; R.sent = false; renderReg(); goTo('register'); return; }
  if (d.red != null) { regValues(); R.ed = +d.red; renderReg(); return; }
  if (d.rhow) { regValues(); R.how = d.rhow; renderReg(); return; }
  if (d.rfind) { regValues(); R.find = R.find === d.rfind ? null : d.rfind; renderReg(); return; }
  if (d.rfindmore) { regValues(); R.findMore = true; renderReg(); return; }
  if (d.regedit) { R.sent = false; renderReg(); return; }
  if (b.id === 'handToggle' || b.id === 'handToggle2') { S.hand = !S.hand; save(); syncHand(); toast(S.hand ? 'The pointing hand is on.' : 'The pointing hand is off.'); return; }
});
document.addEventListener('submit', e => {
  if (e.target.id === 'askForm') { e.preventDefault(); const i = $('#askInput'); answer(i.value); return; }
  if (e.target.id === 'regForm') {
    e.preventDefault(); regValues();
    const em = $('#regEmail');
    if (!em.value.trim() || !em.checkValidity()) { R.err = em.value.trim() ? 'Please check the email address.' : 'Please enter your email address so that we can reply.'; renderReg(); $('#regEmail').focus(); return; }
    R.err = ''; if (R.ed == null) R.ed = S.ed; sendReg();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { stopSpeaking(); if (rec) { try { rec.stop(); } catch (er) {} } }
});
window.addEventListener('pagehide', stopSpeaking);

/* ---------- the note goes to the site's message service (added when the page joined the site) ---------- */
function regMessage(ed){
  const v = R.vals, lines = [];
  lines.push('Edition: ' + (ed === 0 ? 'Not sure yet' : `Edition ${ed}, ${edOf(ed).title}`));
  lines.push('Way of study: ' + R.how);
  if (R.find) lines.push('How they found us: ' + R.find);
  if (v.regCode && v.regCode.trim()) lines.push('Referral code: ' + v.regCode.trim());
  if (v.regQ && v.regQ.trim()) lines.push('Question: ' + v.regQ.trim());
  lines.push('News about open live classes: ' + (v.regNews ? 'yes, asked for' : 'no'));
  return lines.join('\n');
}
function sendReg(){
  if (R.busy) return;
  const ed = R.ed == null ? S.ed : R.ed, v = R.vals;
  const m = document.querySelector('meta[name="messages-api"]');
  const api = (m && m.getAttribute('content')) || '/api/messages';
  const hp = document.getElementById('regWeb');
  R.busy = true; R.fail = false;
  const b = document.querySelector('#regForm button[type="submit"]'); if (b) b.disabled = true;
  toast('Sending...');
  fetch(api, {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name:(v.regName || '').trim(), email:(v.regEmail || '').trim(),
      topic:'Executive Programme: ' + (ed === 0 ? 'not sure yet' : `Edition ${ed}`), message:regMessage(ed),
      page:location.pathname, site:location.hostname, website: hp ? hp.value : ''})})
    .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(d => { R.busy = false; R.sent = true; R.ref = d && d.ref ? String(d.ref) : ''; renderReg(); goTo('register'); toast('Sent. We reply by email.'); })
    .catch(() => { R.busy = false; R.fail = true; renderReg(); goTo('register'); toast('Not sent. Please try again.'); });
}

/* ---------- start ---------- */
renderFixed(); renderEdition(); renderUnit(); renderAnswer(); renderReg(); renderRegNotes(); syncHand();
})();
