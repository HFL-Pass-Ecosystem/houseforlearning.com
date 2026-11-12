// House for Learning member home (preview, sample data).
// The site CSP blocks data-s="" attributes, so markup uses data-s and applyStyles() copies it onto element.style (CSSOM is allowed).
function applyStyles(root){(root||document).querySelectorAll('[data-s]').forEach(e=>{e.style.cssText=e.getAttribute('data-s');e.removeAttribute('data-s')})}

const I={
 home:'<path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/>',
 bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20h4"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
 check:'<path d="m5 12 5 5 9-10"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2"/>',
 cart:'<path d="M3 4h2l2 12h11l2-8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>',
 desk:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8S9 3 7 5s5 3 5 3 5-1 5-3-5-2-5 3"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 tree:'<circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v4M5 17v-3h14v3M12 10v7"/>',
 head:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
 out:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 play:'<path d="m7 4 13 8-13 8z"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 bug:'<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8V5M4 13h3M17 13h3M5 19l2.5-2M19 19l-2.5-2M5 7l2.5 2M19 7l-2.5 2"/>'
};
const svg=(k)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[k]||''}</svg>`;

// [route, label, icon, badge?, children?]
const NAV=[
 {g:'Main',items:[['home','Home','home'],['notifications','Notifications','bell',4]]},
 {g:'Onboarding',items:[['starter','Starter kit','gift',0,[['verify','Confirm email'],['devices','Link your devices'],['pathway','My role pathway'],['referral','Add referrers']]]]},
 {g:'Systems',items:[['lms','LMS · Learning','book'],['ams','AMS · Assessments','check'],['tms','TMS · Training','users'],['ems','EMS · Events','cal'],['market','Marketplace','cart'],['work','Workplace','desk'],['career','Career portal','brief'],['networks','Networks','globe'],['frameworks','Frameworks','tree'],['phygital','PHYGITAL hub','pin']]},
 {g:'Create and connect',items:[['match','Meet and match','users'],['gpt','HFL GPT','spark'],['resume','Resume builder','pen'],['studio','Image and video studio','play']]},
 {g:'Learning hub',items:[['learn-overview','Overview','chart'],['bonus','Bonus learning','book',0,[['all-courses','All courses'],['tools-workshop','AI tools workshop']]],['certs','Certificate hub','award'],['live','Live sessions','cal',0,[['calendar','Calendar'],['coaching','Live coaching']]]]},
 {g:'AI toolkit',items:[['tools','Overview','spark'],['premium','Premium AI tools','spark',0,[['offers','Free and available offers'],['claimed','Claimed offers'],['genai','House of GenAI']]],['agents','Agent bank','spark'],['custom-gpts','Custom GPTs','spark'],['skills','Skills library','book'],['gpt','HFL GPT','spark'],['resources','Workshop resources','book'],['wallet','Wallet · pay as you go','cart']]},
 {g:'Community',items:[['community','Community','users',0,[['community','Overview'],['gallery','Project gallery'],['gratitude','Impact and gratitude'],['achievers','Achievers'],['posts','My posts'],['alumni','Notable alumni']]],['feed','AI feed','spark'],['referral','Referral','gift',0,[['referral','My referrals'],['rewards','Rewards history']]]]},
 {g:'Settings',items:[['support','Support','head',0,[['avatar','AI avatar'],['voice','Voice agent'],['chat','Chat with us']]],['devices','My devices','desk'],['apps','Download apps','desk'],['profile','Profile','user',0,[['profile','My profile'],['career','Job portal'],['certs','My certificates'],['my-learning','My learning'],['saved','Saved videos']]],['gpt','Go to HFL GPT','spark'],['bug','Report a problem','bug'],['logout','Log out','out']]}
];
const PROGRAMS=[
 {n:'AI Solutions Builder',sys:'LMS'},{n:'Energy AI Skills Assessment',sys:'AMS'},{n:'Trainer Batch B7',sys:'TMS'},
 {n:'Demo Day 2026',sys:'EMS'},{n:'Seller: shift report template',sys:'Marketplace'},{n:'Energy AI squad',sys:'Workplace'}
];
let prog=0;

let mode='All';
const S={done:{}}; try{Object.assign(S.done,JSON.parse(localStorage.getItem('hfl-done')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('hfl-done',JSON.stringify(S.done))}catch(e){}};

// Sample data (examples only, to be replaced by live data)
const SESS=[
 {id:'s1',course:'AI for Energy Operations',title:'Build an AI assistant for plant shift reports',date:'14 Nov',time:'18:00 – 21:00 GST',host:'HFL Faculty',mode:'Hybrid',venue:'Dubai learning hub + online',days:5,mod:'LMS'},
 {id:'s2',course:'Founder Track',title:'Price your first digital product',date:'16 Nov',time:'11:00 – 12:30 GST',host:'Ajan SNS mentors',mode:'Digital',venue:'Online',days:7,mod:'EMS'},
 {id:'s3',course:'Skills Lab',title:'Hands-on drone and sensor workshop',date:'22 Nov',time:'10:00 – 16:00 GST',host:'Yantra lab team',mode:'Physical',venue:'Yantra lab, Bengaluru',days:13,mod:'TMS'}
];
const TODO=[
 {id:'t1',icon:'play',t:'Watch the recording',s:'AI for Energy Operations · Session 2',m:'Digital'},
 {id:'t2',icon:'spark',t:'Post your project',s:'Share progress on the Showcase wall',m:'Digital'},
 {id:'t3',icon:'check',t:'Take the week 2 check-in',s:'AMS · 12 questions · 15 minutes',m:'Digital'},
 {id:'t4',icon:'pin',t:'Book a lab seat',s:'TMS · Yantra lab, 22 Nov',m:'Physical'}
];
const PHASES=[
 {p:'Phase 1.1',t:'AI basics for your own role',st:'done'},
 {p:'Phase 1.2',t:'Build personal AI assistants',st:'now'},
 {p:'Phase 1.3',t:'Voice agents and content engines',st:'locked'},
 {p:'Phase 1.4',t:'Automate business operations',st:'locked'},
 {p:'Phase 2.1',t:'Launch a product on the Marketplace',st:'locked'},
 {p:'Phase 2.2',t:'Lead a team in the Workplace',st:'locked'}
];
const MODS=[
 ['lms','LMS','Learning','Courses, recordings, notes and certificates for your pathway.','3 courses · 42% done'],
 ['ams','AMS','Assessments','Quizzes, projects and skill scores that unlock the next phase.','2 due this week'],
 ['tms','TMS','Training','Batches, trainers, attendance and lab bookings.','Batch B7 · 92% attendance'],
 ['ems','EMS','Events','Live classes, meetups, demo days and expos.','3 upcoming'],
 ['tools','AI','Toolkit','The AI tools your plan includes, switched on in one place.','14 tools on'],
 ['career','JOB','Career Portal','Roles, internships and gigs matched to your pathway.','6 matches'],
 ['market','MKT','Marketplace','Sell what you build: templates, agents, services, hardware.','1 listing draft'],
 ['work','WRK','Workplace','Team spaces, tasks and meetings for projects and clients.','2 teams'],
 ['phygital','PHY','PHYGITAL','Everything above, tagged physical, hybrid or digital.','Hub view']
];

const show=(m)=>mode==='All'||m===mode;
const modeChip=(m)=>`<span class="mode ${m}">${m}</span>`;
const greet=()=>{const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'};

function topbar(title,sub){
 return `<div class="top"><div data-s="display:flex;gap:12px;align-items:flex-start"><button class="menu-btn" data-act="menu" aria-label="Open menu">☰</button><div><h1>${title}</h1><p>${sub}</p></div></div>
 <div class="modes" role="group" aria-label="Filter by format">${['All','Physical','Hybrid','Digital'].map(x=>`<button class="${x===mode?'on':''}" data-mode="${x}">${x}</button>`).join('')}</div></div>`;
}

function home(){
 const s=SESS.filter(x=>show(x.mode))[0];
 return topbar(`${greet()}, Sanjay`,'Keep your learning, work and earning moving in one place.')+askBar()+`
 <div class="banners">
  <div class="ban ok"><p><b>${DEVICES.length} devices linked and in sync.</b> New sign-ins are approved from a device you already use. <a href="#devices">See devices</a></p></div>
  ${S.done.email?`<div class="ban ok"><p><b>Email confirmed.</b> Certificates are unlocked.</p></div>`:`<div class="ban warn"><p>Confirm <b>${email}</b> to unlock certificates. It takes one step on this screen.</p><a class="btn pri" href="#verify" data-s="text-decoration:none">Confirm email</a></div>`}
 </div>
 <div class="hero">
  ${s?`<section class="card live"><div>
    <span class="pill course">${svg('book').replace('<svg','<svg width="14" height="14"')} ${s.course}</span> ${modeChip(s.mode)}
    <h2>${s.title}</h2>
    <div class="meta"><span>${svg('cal')} ${s.date}</span><span>${svg('clock')} ${s.time}</span><span>${svg('user')} ${s.host}</span><span>${svg('pin')} ${s.venue}</span></div>
    <div class="cta-row"><button class="btn pri" data-toast="Pre-work opened">View session pre-work</button><small>Starts in ${s.days} days</small><a href="#ems">See full schedule →</a></div>
   </div><div class="dial"><canvas id="dial" width="360" height="360" aria-hidden="true"></canvas><span>Live session</span></div></section>`
   :`<section class="card"><p class="eyebrow">Live session</p><h2 data-s="margin-top:8px">No ${mode.toLowerCase()} sessions coming up</h2><p class="sample">Try another format filter.</p></section>`}
  <section class="card prep"><p class="eyebrow">Before your next session</p><h2 data-s="font-size:24px;margin-top:8px">Get ready in three steps</h2>
   <ul>${[['p1','mic','Test your audio and internet'],['p2','pen','Keep a notebook ready'],['p3','clock','Join five minutes early']].map(([id,ic,t])=>`<li><label><input type="checkbox" data-done="${id}" ${S.done[id]?'checked':''}> <span class="ic">${svg(ic)}</span> ${t}</label></li>`).join('')}</ul>
   <div class="note">Recordings appear in LMS within 24 hours. Physical attendees also get the lab notes pack.</div></section>
 </div>
 <section><div class="sec-h"><h2>To do</h2><span class="sample">Sample tasks</span></div>
  <div class="todo">${TODO.filter(t=>show(t.m)).map(t=>`<div class="card ${S.done[t.id]?'done':''}"><span class="ic">${svg(t.icon)}</span><div><b>${t.t}</b><small>${t.s}</small></div><button class="go" data-done-toggle="${t.id}" aria-label="Mark ${t.t} done">${svg(S.done[t.id]?'check':'arrow')}</button></div>`).join('')||'<p class="sample">Nothing in this format.</p>'}</div></section>
 <section><div class="sec-h"><h2>Your journey</h2><a href="#pathway">Open full roadmap →</a></div>
  <div class="card journey" data-s="margin-top:12px"><div class="head"><p class="eyebrow">Current phase</p><b>${PROGRAMS[prog].n}: Build personal AI assistants</b></div>
  <div class="track"><div class="steps"><div class="line"></div>${PHASES.map(p=>`<div class="step ${p.st}"><span class="node">${svg(p.st==='done'?'check':p.st==='now'?'play':'lock')}</span><div class="box"><span class="eyebrow">${p.p}</span><b>${p.t}</b><small>${p.st==='done'?'Completed':p.st==='now'?'In progress · 3 of 7 lessons':'Unlocks after the phase before'}</small></div></div>`).join('')}</div></div></div></section>
 <section><div class="sec-h"><h2>Your ecosystem</h2><span class="sample">One sign-in for every module</span></div>
  <div class="mods">${MODS.map(([h,a,n,d,st])=>`<a class="card mod" href="#${h}"><span class="abbr">${a}</span><b>${n}</b><p>${d}</p><span class="stat">${st}</span></a>`).join('')}</div></section>
 <footer>House for Learning · Avyra Microsystems · Yantra · HFL Global Investments · HFL-Pass<br>Prototype with sample data. Nothing here is live.</footer>`;
}

function listCard(title,rows,note){return `<section class="card"><div class="sec-h"><h2>${title}</h2>${note?`<span class="sample">${note}</span>`:''}</div><div class="list">${rows.filter(r=>show(r[3]||'Digital')).map(r=>`<div class="row"><div><b>${r[0]}</b><small>${r[1]}</small></div>${modeChip(r[3]||'Digital')}<span class="state ${r[2][0]}">${r[2][1]}</span></div>`).join('')||'<p class="sample">Nothing in this format.</p>'}</div></section>`}
function kpis(arr){return `<div class="kpis">${arr.map(([v,l,p])=>`<div class="card kpi"><b>${v}</b><small>${l}</small>${p!=null?`<div class="bar"><i data-s="width:${p}%"></i></div>`:''}</div>`).join('')}</div>`}

const PAGES={
 notifications:()=>topbar('Notifications','Everything that needs you, newest first.')+listCard('Inbox',[
  ['Session 3 recording is ready','LMS · 2 hours ago',['ok','New'],'Digital'],
  ['Lab seat confirmed for 22 Nov','TMS · Yantra lab, Bengaluru',['ok','Booked'],'Physical'],
  ['Week 2 check-in closes Friday','AMS · 12 questions',['warn','Due'],'Digital'],
  ['A member used your referral code','Referrals · reward pending',['ok','Reward'],'Digital']],'Sample'),
 lms:()=>topbar('LMS · Learning','Courses, recordings and certificates for your pathway.')+kpis([['3','Active courses',null],['42%','Pathway done',42],['11 h','Learning this month',null],['2','Certificates',null]])+`<div class="two">`+
  listCard('My courses',[['AI for Energy Operations','Module 2 of 6 · next: shift report assistant',['ok','In progress'],'Hybrid'],['Founder Track','Pricing and packaging',['ok','In progress'],'Digital'],['Drone and Sensor Basics','Starts 22 Nov',['lock','Upcoming'],'Physical']],'Sample')+
  listCard('Recordings and notes',[['Session 2: Prompting for operations','98 min · notes attached',['ok','Watch'],'Digital'],['Session 1: Your AI starting point','84 min',['ok','Watched'],'Digital']])+`</div>`,
 ams:()=>topbar('AMS · Assessments','Checks, projects and skill scores that unlock your next phase.')+kpis([['78','Skill score',78],['2','Due this week',null],['5','Projects submitted',null],['A-','Last grade',null]])+
  listCard('Assessments',[['Week 2 check-in','12 questions · closes Friday',['warn','Due'],'Digital'],['Project: shift report assistant','Peer review + mentor review',['warn','Due'],'Hybrid'],['Practical: sensor wiring','Assessed at the lab',['lock','Booked'],'Physical'],['Week 1 check-in','Score 9/12',['ok','Passed'],'Digital']],'Sample'),
 tms:()=>topbar('TMS · Training','Batches, trainers, attendance and lab seats.')+kpis([['B7','Your batch',null],['92%','Attendance',92],['4','Trainers',null],['1','Lab seat booked',null]])+
  listCard('Training calendar',SESS.map(s=>[s.title,`${s.date} · ${s.time} · ${s.venue}`,['ok','Enrolled'],s.mode]),'Sample'),
 ems:()=>topbar('EMS · Events','Live classes, meetups, demo days and expos.')+
  listCard('Upcoming',[...SESS.map(s=>[s.title,`${s.date} · ${s.time} · ${s.venue}`,['ok','Going'],s.mode]),['Demo Day: member products','5 Dec · Dubai + livestream',['warn','RSVP'],'Hybrid']],'Sample'),
 tools:()=>topbar('AI Toolkit','The tools your plan includes, switched on in one place.')+`<section class="card"><p>Turn tools on or off from the <a href="https://claude.ai/artifact/GTuYoVFEZPxAbnXRwkN4U9" target="_blank" rel="noopener">Ajan SNS Switchboard</a>. Members see what each tool does; paid tools are billed to whoever switches them on.</p></section>`+
  listCard('Switched on for you',[['Writing and research assistant','Drafts, summaries, reports',['ok','On'],'Digital'],['Meeting notes and action plans','Turns recordings into tick-box tasks',['ok','On'],'Digital'],['Design studio','Social posts and slides (your own account)',['warn','Connect'],'Digital'],['HFL assistant','Ask about your course, jobs and orders',['ok','On'],'Digital']],'Sample'),
 career:()=>topbar('Career Portal','Roles, internships and gigs matched to your pathway.')+kpis([['6','Matches',null],['2','Applications',null],['1','Interview',null],['70%','Profile complete',70]])+
  listCard('Matched for you',[['AI Operations Lead, Energy','Ajan HFL partner · Dubai',['ok','92% match'],'Hybrid'],['Freelance: chatbot for a clinic','Marketplace gig · 2 weeks',['ok','81% match'],'Digital'],['Field robotics intern','Yantra · Bengaluru',['warn','Apply by 30 Nov'],'Physical']],'Sample'),
 market:()=>topbar('Marketplace','Sell what you build. Buy what helps you build.')+`<div class="two">`+
  listCard('Your listings',[['Shift report assistant (template)','Draft · set a price to publish',['warn','Draft'],'Digital']])+
  listCard('Trending',[['Sensor starter kit','Yantra · ships in UAE and India',['ok','In stock'],'Physical'],['Proposal writer agent','Member-built',['ok','4.8 ★'],'Digital'],['1:1 mentor hour','Book online or at a hub',['ok','Open'],'Hybrid']],'Sample')+`</div>`,
 work:()=>topbar('Workplace','Team spaces, tasks and meetings for projects and clients.')+
  listCard('My teams',[['Energy AI squad','5 members · 3 open tasks',['ok','Active'],'Hybrid'],['Founder Track pod','4 members · weekly call',['ok','Active'],'Digital']],'Sample')+
  listCard('Action items from meetings',[['Send plant data sample to mentor','From Session 2 · due 12 Nov',['warn','Open'],'Digital'],['Book lab for team demo','From pod call · due 18 Nov',['warn','Open'],'Physical']]),
 phygital:()=>topbar('PHYGITAL hub','Physical, hybrid and digital, side by side. Use the filter to switch.')+`<div class="ph3">
  <div class="card"><span class="mode Physical">Physical</span><h3>Hubs and labs</h3><p>Campus classes, Yantra labs, kits shipped to you, in-person exams and meetups.</p></div>
  <div class="card"><span class="mode Hybrid">Hybrid</span><h3>Room plus stream</h3><p>Classes and demo days run in a hub and online at once. Same notes, same credit.</p></div>
  <div class="card"><span class="mode Digital">Digital</span><h3>Anywhere, any device</h3><p>Courses, AI tools, marketplace and workplace on phone, iPad or PC with one sign-in.</p></div></div>`+
  listCard('Everything this month',[...SESS.map(s=>[s.title,`${s.mod} · ${s.date} · ${s.venue}`,['ok','Booked'],s.mode]),['Sensor starter kit delivery','Marketplace · arrives 18 Nov',['warn','Shipping'],'Physical']],'Sample'),
 referral:refPage,
 pathway:()=>topbar('My role pathway','From where you are (point A) to where you want to be (point B).')+`<section class="card"><p>Your pathway comes from the sector-to-role tree you choose at onboarding. Each role shows who is Responsible, who Approves, who Supports and who is Informed.</p><p><a class="btn pri" data-s="text-decoration:none;display:inline-block" href="https://claude.ai/artifact/2nFWaKLk7hfXzX9Y2znMKC" target="_blank" rel="noopener">Open the Role Pathfinder</a></p></section>`+
  `<section class="card journey"><div class="track"><div class="steps"><div class="line"></div>${PHASES.map(p=>`<div class="step ${p.st}"><span class="node">${svg(p.st==='done'?'check':p.st==='now'?'play':'lock')}</span><div class="box"><span class="eyebrow">${p.p}</span><b>${p.t}</b></div></div>`).join('')}</div></div></section>`,
 support:()=>topbar('Support','Real people and the HFL assistant.')+`<section class="card"><p>Ask in the chat bubble, or write to the support desk. We reply on the same screen you asked from.</p></section>`,
 profile:()=>topbar('Profile','Sanjay Raghavendra Acharya')+listCard('Details',[['Role','General Manager, Energy sector',['ok','Set']],['Pathway','AI Solutions Builder',['ok','Set']],['Sign-in','Email code or passkey, same screen',['ok','On']],['Referral code','HFL-SANJ-156',['ok','Active']]]),
 bug:()=>topbar('Report a problem','Tell us what went wrong and where.')+`<section class="card"><form id="bugForm" data-s="display:grid;gap:10px"><label for="bugTxt">What happened?</label><textarea id="bugTxt" rows="4" data-s="font:inherit;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)"></textarea><button class="btn pri" data-s="justify-self:start">Send report</button></form></section>`,
 logout:()=>topbar('Signed out','This is a prototype, so nothing changed.')+`<section class="card"><a href="#home">Back to home</a></section>`
};

const DEVICES=[
 {n:'iPad Pro',os:'iPadOS',ic:'desk',where:'Dubai',main:true},
 {n:'iPhone',os:'iOS',ic:'mic',where:'Dubai'},
 {n:'Windows PC (Win10PRO-HFL-DT-PC)',os:'Windows 10 Pro',ic:'desk',where:'Dubai office'},
 {n:'Android phone',os:'Android 15',ic:'mic',where:'Dubai'}
];
let pending=null;
function approvalCard(){
 if(!pending) return '';
 return `<section class="card" data-s="border-color:var(--gold);background:var(--gold-soft)"><p class="eyebrow">Shown on your ${DEVICES[0].n} right now</p>
  <h2 data-s="font-size:20px;margin:6px 0">${pending.what}</h2>
  <p data-s="margin:0 0 4px">${pending.detail}</p><p class="sample" data-s="margin:0 0 12px">Request #${pending.no} · expires in 2 minutes · matching number on both screens: <b data-s="font-family:var(--mono)">${pending.match}</b></p>
  <div data-s="display:flex;gap:10px;flex-wrap:wrap"><button class="btn pri" data-decide="yes">Approve</button><button class="btn" data-decide="no">This wasn't me</button></div></section>`;
}
let email='promoters@avyramicrosystems.com', timer=null, left=0, codeNo=1, codeAt=new Date().toTimeString().slice(0,5);
function startTimer(bump){if(bump!==false&&document.getElementById('resend')&&left<=0){}left=30;clearInterval(timer);const tick=()=>{const el=document.getElementById('resend');if(!el){clearInterval(timer);return}el.innerHTML=left>0?`Resend code in <b>${left}s</b>`:`<button class="btn" data-otp-retry>Resend code</button>`;if(left--<=0)clearInterval(timer)};tick();timer=setInterval(tick,1000)}
const simple=(t,s,rows,note='Sample')=>()=>topbar(t,s)+listCard(t,rows,note);
Object.assign(PAGES,{
 verify:()=>topbar('Confirm your email','One step, on this screen. No app switching.')+`<section class="card" data-s="max-width:560px;border-color:var(--accent)">
  <p class="eyebrow">No code needed</p><h2 data-s="font-size:20px;margin:6px 0">Pick the quickest way</h2>
  <div class="list">
   <div class="row"><div><b>1. Passkey</b><small>Face, fingerprint or device PIN. Syncs across your Apple, Android and Windows devices.</small></div><span></span><button class="btn pri" data-decide-passkey>Use passkey</button></div>
   <div class="row"><div><b>2. Approve on a linked device</b><small>Tap Approve on your ${DEVICES.map(d=>d.n.split(' ')[0]).join(', ')} and this screen confirms by itself.</small></div><span></span><button class="btn" data-approve="email">Send request</button></div>
   <div class="row"><div><b>3. Magic link by email</b><small>Tap the link in the email on any device; this screen updates on its own.</small></div><span></span><button class="btn" data-toast="Magic link sent (prototype)">Email link</button></div>
  </div></section>
  <p class="sample" data-s="margin:-8px 0 0">4. Last resort: type a code.</p>
  <section class="card" data-s="max-width:560px">
  <p>We sent a 6-digit code to <b id="emailShown">${email}</b>. <button class="btn" data-edit-email data-s="padding:3px 10px">Edit email</button></p>
  <form id="emailEdit" hidden data-s="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap"><input id="newEmail" type="email" value="${email}" data-s="flex:1 1 220px;font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink)" aria-label="Email"><button class="btn pri">Send code</button></form>
  <form id="otp6Form"><div class="otp6">${[0,1,2,3,4,5].map(i=>`<input id="o${i}" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}" ${i===0?'autocomplete="one-time-code"':''}>`).join('')}</div>
  <div data-s="display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap"><button class="btn pri">Confirm email</button><span id="resend" class="sample"></span></div></form>
  <p class="note" data-s="margin-top:16px">Current code: <b>#${codeNo}</b>, sent at ${codeAt}. Only the newest code works, and the email subject shows the same number. Can't find it? Check spam or promotions.</p>
  <p class="eyebrow" data-s="margin-top:16px">Get the code another way</p>
  <div data-s="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn" data-otp-retry>Email again</button><button class="btn" data-toast="Code sent by SMS (prototype)">SMS</button><button class="btn" data-toast="Code sent on WhatsApp too (prototype)">WhatsApp (optional)</button><button class="btn" data-toast="Passkey sign-in opens here on the live site">Use a passkey</button></div></section>
  <section class="card" data-s="max-width:560px"><p class="eyebrow">What the email looks like</p>
   <div data-s="border:1px solid var(--line);border-radius:12px;padding:16px;margin-top:10px">
    <small class="sample">From: House for Learning · Subject: Your HFL code #${codeNo}: 482913</small>
    <p data-s="margin:10px 0 6px">Use this code to confirm your email. It works for 10 minutes and replaces any earlier code.</p>
    <div data-s="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><code data-s="font:600 26px var(--mono);letter-spacing:.2em;background:var(--accent-soft);color:var(--accent);padding:6px 12px;border-radius:8px">482913</code><button class="btn pri" data-fill="482913">Copy code</button></div>
    <p class="sample" data-s="margin-top:8px">The code sits in the subject line and in a plain block, so Gmail and phones offer one-tap copy and autofill.</p></div></section>`,
 devices:()=>topbar('My devices','Every phone, tablet and computer you use, linked and kept in sync.')+approvalCard()+
  kpis([[DEVICES.length,'Devices linked',null],['2 s','Last sync',null],['0','Codes typed this month',null],['1.4 s','Average approval time',null]])+
  `<section class="card"><div class="sec-h"><h2>Linked devices</h2><span class="sample">Sample devices</span></div><div class="list">${DEVICES.map((d,i)=>`<div class="row"><div data-s="display:flex;gap:12px;align-items:center"><span class="ic">${svg(d.ic)}</span><div><b>${d.n}</b><small>${d.os} · ${d.where}${d.main?' · approves new sign-ins':''}</small></div></div><span class="state ok">Ready · synced</span><button class="btn" data-unlink="${i}" data-s="padding:4px 10px">Sign out</button></div>`).join('')}</div>
  <div data-s="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn pri" data-approve="device">Try it: sign in on a new laptop</button><button class="btn" data-toast="All devices signed out except this one (prototype)">Sign out everywhere else</button><button class="btn" data-toast="Lost-device lock sent (prototype)">I lost a device</button></div></section>
  <section class="card"><h2 data-s="font-size:20px">How it stays fast and safe</h2><div class="list" data-s="margin-top:8px">
   ${[['One private channel per member','Each of your devices keeps an encrypted link to HFL, so updates, messages and approvals arrive in seconds on all of them at once.'],
      ['Approve, don\'t type','A new phone, tablet or laptop is confirmed by tapping Approve on a device you already use. Codes are the backup, never the only way.'],
      ['Passkeys on every device','Face, fingerprint or device PIN instead of passwords. Works on Apple, Android and Windows.'],
      ['Matching number check','The same short number shows on both screens, so nobody can approve a sign-in that isn\'t yours.'],
      ['Instant control','See every device, sign one out, or lock a lost one from anywhere.']].map(([a,b])=>`<div class="row" data-s="grid-template-columns:1fr"><div><b>${a}</b><small>${b}</small></div></div>`).join('')}</div></section>`,
 starter:()=>topbar('Starter kit','Everything to set up before your first session.')+listCard('Your setup',[['Confirm email','6-digit code, same screen',[S.done.email?'ok':'warn',S.done.email?'Done':'To do']],['Choose your role pathway','Sector to role tree, point A to point B',['warn','To do']],['Add referrers (optional)','Several rows allowed',['lock','Optional']],['Book your first lab seat','Physical members only',['lock','Optional'],'Physical']],'')+`<section class="card"><a href="#verify">Confirm email</a> · <a href="#pathway">Choose pathway</a> · <a href="#referral">Add referrers</a></section>`,
 networks:()=>topbar('Networks','The communities, partners and hubs you belong to.')+kpis([['6','Networks joined',null],['1,240','Members reachable',null],['3','Hubs near you',null],['12','Mentors',null]])+
  listCard('Your networks',[['Ajan SNS: six-network system','Work, learning, trade, social, personal and life networks',['ok','Member'],'Hybrid'],['Energy sector circle','Peers and mentors in energy',['ok','Member'],'Digital'],['Founders and side income','Members building businesses',['ok','Member'],'Digital'],['Dubai learning hub','Meetups and lab days',['ok','Nearby'],'Physical'],['Alumni network','Graduates across all programs',['lock','After phase 2'],'Digital']]),
 frameworks:()=>topbar('Frameworks','The models behind every pathway, role and project.')+
  listCard('Frameworks in use',[['Point A to point B','Where you are and where your role pathway leads',['ok','Active']],['RASI / DASI','Who is Responsible, Approves, Supports, Informed for each role',['ok','Active']],['7-tier ecosystem ladder','From learner to founder',['ok','Active']],['PHYGITAL delivery','Each item tagged physical, hybrid or digital',['ok','Active']],['Learn, build, earn','LMS → AMS → Marketplace and Career portal',['ok','Active']]],''),
 'learn-overview':()=>topbar('Learning hub','Your courses, certificates and sessions at a glance.')+kpis([['3','Active courses',null],['42%','Pathway done',42],['2','Certificates',null],['3','Upcoming sessions',null]])+`<div class="mods">${MODS.slice(0,4).map(([h,a,n,d,st])=>`<a class="card mod" href="#${h}"><span class="abbr">${a}</span><b>${n}</b><p>${d}</p><span class="stat">${st}</span></a>`).join('')}</div>`,
 bonus:simple('Bonus learning','Extra courses that come with your membership.',[['All courses','Browse the full catalogue',['ok','Open']],['AI tools workshop','Hands-on with the toolkit',['ok','Open'],'Hybrid']],''),
 'all-courses':()=>topbar('All courses','The nine subject families from our public catalogue. Pick one to see its courses.')+listCard('Subject families',[['<a href="../catalogue.html#families">Learning skills</a>','Outcomes, study goals, short study bursts and asking good questions.',['ok','Browse'],'Digital'],['<a href="../catalogue.html#families">Safety and well-being</a>','Safety rules before practical work, protective clothing, breaks and looking after yourself.',['ok','Browse'],'Hybrid'],['<a href="../catalogue.html#families">Electrical and energy</a>','Reading diagrams and low-voltage boards, then supervised inspection on a training rig.',['ok','Browse'],'Physical'],['<a href="../catalogue.html#families">Industry and engineering</a>','Quality basics, process steps and keeping a digital thread.',['ok','Browse'],'Hybrid'],['<a href="../catalogue.html#families">Digital basics and data</a>','Your learning record, privacy, data care and everyday digital tools.',['ok','Browse'],'Digital'],['<a href="../catalogue.html#families">Enterprise and small business</a>','Organising your work, simple records and finding partners.',['ok','Browse'],'Digital'],['<a href="../catalogue.html#families">Leading people</a>','Coaching new colleagues and leading small pieces of work.',['ok','Browse'],'Hybrid'],['<a href="../catalogue.html#families">Teaching and coaching</a>','Writing outcomes, teaching in short units and assessing fairly.',['ok','Browse'],'Hybrid'],['<a href="../catalogue.html#families">Community and sustainability</a>','Local stewardship, water and energy care, and learning close to home.',['ok','Browse'],'Physical']],'From catalogue')+`<section class="card"><p><a href="../catalogue.html#pathways">See learning pathways</a> · <a href="../catalogue.html#series">See course series</a></p></section>`,
 'tools-workshop':simple('AI tools workshop','Short, hands-on sessions per tool.',[['Research assistant','45 min',['ok','Watch']],['Meeting notes to action plans','40 min',['ok','Watch']],['Live build clinic','Sat 16 Nov · hub + online',['warn','RSVP'],'Hybrid']]),
 certs:simple('Certificate hub','Every certificate you earn, ready to share.',[['AI basics for your own role','Issued 2 Nov 2026',['ok','Download']],['Week 1 check-in','Badge',['ok','Earned']],['AI Solutions Builder','After phase 1.4',['lock','Locked']]]),
 live:()=>PAGES.ems(),
 calendar:()=>topbar('Calendar','All sessions across every system.')+listCard('This month',SESS.map(s=>[s.title,`${s.mod} · ${s.date} · ${s.time}`,['ok','Booked'],s.mode]),'Sample'),
 coaching:simple('Live coaching','Book a mentor for your project.',[['Office hours: AI projects','Every Tue 19:00 GST',['ok','Open']],['1:1 founder mentoring','30 min slots',['warn','Book'],'Hybrid'],['Lab coaching','At the Yantra lab',['warn','Book'],'Physical']]),
 premium:simple('Premium AI tools','Offers included with your program.',[['Available offers','4 tools ready to claim',['ok','View']],['Claimed offers','2 tools in use',['ok','View']]],''),
 offers:()=>offerPage(false),
 claimed:()=>offerPage(true),
 agents:()=>libPage('agents'),
 wallet:walletPage,
 genai:simple('House of GenAI','Every AI tool in the ecosystem, by what it helps you do.',[['Write and translate','Letters, posts, CVs, any language',['ok','Free tier'],'Digital'],['Make pictures and video','Posters, product photos, short clips',['warn','Pay as you go'],'Digital'],['Talk and listen','Voice assistant and live translation',['ok','Free tier'],'Digital'],['Build and automate','Agents that do repeat work for you',['warn','Pay as you go'],'Digital'],['Hands-on with hardware','Drones, sensors, robots at the lab',['warn','Pay as you go'],'Physical']]),
 'custom-gpts':simple('Custom GPTs','Assistants set up for one job each.',[['CV and interview coach','Builds your CV by talking with you',['ok','Free'],'Digital'],['Energy operations helper','Shift reports, checklists, safety notes',['ok','Members'],'Digital'],['Small shop advisor','Pricing, stock and promotions',['ok','Free'],'Digital'],['Make your own','Turn your know-how into an assistant others pay to use',['warn','Earn'],'Digital']]),
 skills:()=>libPage('skills'),
 gpt:gptPage,
 match:matchPage,
 resume:resumePage,
 studio:studioPage,
 resources:simple('Workshop resources','Templates, prompts and notes from each workshop.',[['Prompt pack: operations','12 prompts',['ok','Open']],['Shift report template','Spreadsheet',['ok','Open']],['Lab safety sheet','For physical sessions',['ok','Open'],'Physical']]),
 community:simple('Community','Members learning and building together.',[['Project gallery','48 member projects',['ok','Open']],['Impact and gratitude','Stories from members',['ok','Open']],['Achievers','This month\'s top builders',['ok','Open']],['Meetup: Dubai hub','30 Nov',['warn','RSVP'],'Physical']]),
 gallery:simple('Project gallery','What members built this month.',[['Plant shift report assistant','Energy AI squad',['ok','12 likes']],['Clinic booking chatbot','Founder pod',['ok','9 likes']],['Sensor dashboard','Yantra lab',['ok','7 likes'],'Physical']]),
 gratitude:simple('Impact and gratitude','Members say what changed for them.',[['"Got my first freelance client"','Founder Track',['ok','Story']],['"Cut report time by half"','Energy AI',['ok','Story']]]),
 achievers:simple('Achievers','Top builders this month.',[['Priya','5 projects shipped',['ok','Gold']],['Ram','Mentor of the month',['ok','Gold']]]),
 posts:()=>topbar('My posts','Share progress, ask for help, thank someone.')+`<section class="card"><form id="postForm" data-s="display:grid;gap:10px"><label for="postIn">New post</label><textarea id="postIn" rows="3" placeholder="Say or type what you built or learned this week" data-s="font:inherit;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)"></textarea><div data-s="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri">Post</button><button type="button" class="btn" data-mic>Speak instead</button></div></form></section>`+listCard('Your posts',[...MYPOSTS.map(p=>[p,'Just now · 0 replies',['ok','Posted']]),['Week 1 reflection','3 Nov · 6 replies',['ok','Posted']]],'Sample'),
 alumni:simple('Notable alumni','Graduates now leading teams and businesses.',[['Placeholder alumni profile','Add real stories with consent',['lock','Pending']]],'Placeholder'),
 feed:simple('AI feed','Short updates on AI for your sector.',[['New model release: what it means for operations','3 min read',['ok','New']],['Case study: AI in grid maintenance','5 min read',['ok','New']]]),
 rewards:simple('Rewards history','Every reward from your referral chain.',[['Priya joined Founder Track','3 Nov · amount not set',['warn','Pending']]]),
 avatar:simple('AI avatar','A video guide that answers on screen.',[['Ask the avatar','Opens on the live site',['lock','Coming soon']]],''),
 voice:simple('Voice agent','Talk to support by voice.',[['Call the voice agent','Opens on the live site',['lock','Coming soon']]],''),
 chat:simple('Chat with us','Support replies on this same screen.',[['Start a chat','Average reply 10 min',['ok','Open']]],''),
 apps:simple('Download apps','One account on every device.',[['iPad and iPhone','App Store',['lock','Coming soon']],['Android','Play Store',['lock','Coming soon']],['Windows and Mac','Desktop app',['lock','Coming soon']]],''),
 'my-learning':()=>PAGES.lms(),
 saved:simple('Saved videos','Clips you bookmarked.',[['Prompting for operations, 34:10','Session 2',['ok','Play']]])
});
const OFFERS=[
 {id:'o1',t:'Speak to start',d:'Learn the basics of a phone or computer just by talking. No reading or typing needed.',who:'No computer skills',m:'Digital',f:'Free forever'},
 {id:'o2',t:'First 30 days of AI helpers',d:'Writing, translation and research helpers, by voice or typing.',who:'Everyone',m:'Digital',f:'Free 30 days'},
 {id:'o3',t:'Earn your first income',d:'A guided first gig or first product listing, with a mentor checking your work.',who:'Youth and job seekers',m:'Hybrid',f:'Free'},
 {id:'o4',t:'Walk-in hub day',d:'Come to a learning hub, use the computers and get help in person.',who:'No computer skills',m:'Physical',f:'Free monthly'},
 {id:'o5',t:'Career check',d:'Tell us your work in your own words; get a role pathway and three job matches.',who:'Everyone',m:'Digital',f:'Free'},
 {id:'o6',t:'Typing and phone basics',d:'Short daily practice that adapts to how you like to learn.',who:'Grown-ups new to tech',m:'Digital',f:'Free forever'},
 {id:'o7',t:'Youth builders club',d:'Weekend projects with AI, drones and sensors. Show your work at Demo Day.',who:'Ages 14 to 24',m:'Hybrid',f:'Free entry'},
 {id:'o8',t:'Sell one thing free',d:'List one product or service on the Marketplace with no listing fee.',who:'Everyone',m:'Digital',f:'Free'}
];
function offerPage(claimed){
 const list=OFFERS.filter(o=>!!S.done['offer-'+o.id]===claimed&&show(o.m));
 return topbar(claimed?'Claimed offers':'Available offers',claimed?'Offers you are using now.':'Free ways in. Claim one with a tap; use it by voice or typing.')+
 (list.length?`<div class="mods">${list.map(o=>`<div class="card mod"><div data-s="display:flex;gap:6px;flex-wrap:wrap"><span class="state ok">${o.f}</span>${modeChip(o.m)}</div><b data-s="font:600 18px var(--display)">${o.t}</b><p>${o.d}</p><span class="stat">For: ${o.who}</span>${claimed?`<button class="btn" data-toast="Opens on the live site">Open</button>`:`<button class="btn pri" data-claim="${o.id}">Claim free</button>`}</div>`).join('')}</div>`
 :`<section class="card" data-s="text-align:center"><h2 data-s="font-size:20px">${claimed?'Nothing claimed yet':'You have claimed every offer here'}</h2><p class="sample">${claimed?'Pick a free offer to get started.':'New offers appear every month.'}</p><a class="btn pri" data-s="text-decoration:none;display:inline-block" href="#${claimed?'offers':'agents'}">${claimed?'See free offers':'Explore the Agent bank'}</a></section>`);
}
const ADMIN=0.20;
const USAGE=[['AI writing helper','1,200 words',0.60],['Voice translation','15 minutes',1.50],['Lab seat, half day','Yantra lab',8.00],['Mentor hour','1:1 online',12.00]];
const money=n=>'US$ '+n.toFixed(2);
function walletPage(){
 const base=USAGE.reduce((a,r)=>a+r[2],0);
 return topbar('Wallet · pay as you go','Pay only for what you use. Every price shows the 20% admin charge that covers taxes and upkeep.')+
 kpis([[money(42.5),'Earned this month',null],[money(base*(1+ADMIN)),'Spent this month',null],[money(42.5-base*(1+ADMIN)),'Net in your pocket',null],['20%','Admin charge, flat',null]])+
 `<section class="card"><div class="sec-h"><h2>This month's use</h2><span class="sample">Sample prices</span></div>
 <div data-s="overflow-x:auto"><table data-s="width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;margin-top:8px;font-size:15px"><thead><tr data-s="text-align:left;color:var(--muted)"><th data-s="padding:8px 4px">Item</th><th>Used</th><th data-s="text-align:right">Price</th><th data-s="text-align:right">+20% admin</th><th data-s="text-align:right">You pay</th></tr></thead>
 <tbody>${USAGE.map(r=>`<tr data-s="border-top:1px solid var(--line)"><td data-s="padding:10px 4px">${r[0]}</td><td>${r[1]}</td><td data-s="text-align:right">${money(r[2])}</td><td data-s="text-align:right">${money(r[2]*ADMIN)}</td><td data-s="text-align:right;font-weight:700">${money(r[2]*(1+ADMIN))}</td></tr>`).join('')}
 <tr data-s="border-top:2px solid var(--ink)"><td data-s="padding:10px 4px"><b>Total</b></td><td></td><td data-s="text-align:right">${money(base)}</td><td data-s="text-align:right">${money(base*ADMIN)}</td><td data-s="text-align:right;font-weight:700">${money(base*(1+ADMIN))}</td></tr></tbody></table></div></section>
 <section class="card" data-s="max-width:560px"><h2 data-s="font-size:20px">Check a price</h2><p class="sample">Type any price to see what a member pays.</p>
 <div data-s="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px"><label for="calcIn">Price (US$)</label><input id="calcIn" type="number" min="0" step="0.01" value="10" data-s="width:120px;font:inherit;padding:8px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink)"><span id="calcOut" data-s="font-variant-numeric:tabular-nums">+ ${money(2)} admin = <b>${money(12)}</b></span></div></section>
 <section class="card"><h2 data-s="font-size:20px">How earning works</h2><div class="list" data-s="margin-top:6px">
 ${[['Earn from your work','Gigs, product sales, mentoring and referrals pay into this wallet.'],['Spend only what you use','No subscription. Top up any amount, or pay from what you earned.'],['One clear charge','The same 20% admin charge on everything, shown before you pay.'],['Free stays free','Free offers never take money from your wallet.']].map(([a,b])=>`<div class="row" data-s="grid-template-columns:1fr"><div><b>${a}</b><small>${b}</small></div></div>`).join('')}</div></section>`;
}
let style='V';
const STYLES=[['V','See it','Pictures, diagrams and video'],['A','Hear it','Listen and talk it through'],['R','Read it','Notes and step-by-step text'],['K','Do it','Hands-on tasks and labs']];
function askBar(){return `<section class="card" data-s="padding:16px">
 <form id="askForm" data-s="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button type="button" class="go" data-mic aria-label="Speak" data-s="margin:0;width:46px;height:46px">${svg('mic')}</button>
 <input id="askIn" placeholder="Say or type what you need, for example 'find me work near Dubai'" aria-label="Ask" data-s="flex:1 1 240px;min-width:0;font:inherit;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)"><button class="btn pri">Ask</button></form>
 <div data-s="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px"><span class="eyebrow">I learn best by (VARK-LS)</span>${STYLES.map(([k,a,b])=>`<button class="btn" data-style="${k}" title="${b}" data-s="${style===k?'background:var(--accent-soft);border-color:var(--accent);color:var(--accent)':''}">${k} · ${a}</button>`).join('')}</div>
 <p class="sample" data-s="margin:8px 0 0">Lessons, tasks and help switch to your style: ${STYLES.find(s=>s[0]===style)[2].toLowerCase()}.</p></section>`}
/* ---------- Libraries (agents, skills) ---------- */
const MYPOSTS=[];
const LIB={
 agents:{t:'Agent bank',s:'Ready-made AI agents and automations. Open one, tell it your goal, and it does the steps.',count:'250+ planned · 16 shown',items:[
  ['Post writer for LinkedIn','Finds trends in your field and drafts posts with images for you to approve','Content and social','Medium'],
  ['Short video maker','Turns a topic into a 15-second script, visuals and voice-over','Content and social','Medium'],
  ['Spend tracker','Reads receipts and payment messages and keeps a running budget','Money','Easy'],
  ['CV screener','Ranks candidates against a job description, with reasons','Hiring and careers','Medium'],
  ['Inbox helper','Sorts mail, drafts replies in your voice, flags what needs you','Productivity','Hard'],
  ['Attachment filer','Saves email attachments into the right folders','Productivity','Easy'],
  ['Calendar agent','Books and moves meetings from plain-language requests','Productivity','Easy'],
  ['Company brief before a call','Pulls recent news and leadership changes for any company','Sales and growth','Easy'],
  ['Chat bot for your shop','Answers customers on WhatsApp, Telegram or your site','Sales and growth','Medium'],
  ['Job search with matched CV','Finds roles, tailors your resume and drafts a cover note','Hiring and careers','Hard'],
  ['Form feedback summary','Reads survey answers and returns themes and quotes','Data and reports','Easy'],
  ['Lead finder','Finds and enriches prospects that fit your customer profile','Sales and growth','Medium'],
  ['Landing page review','Checks a page for copy, layout and conversion gaps','Sales and growth','Easy'],
  ['Shift report assistant','Turns plant logs into a clean shift report','Energy and operations','Medium'],
  ['Meeting to action plan','Turns a recording into tick-box tasks per person','Productivity','Easy'],
  ['Lab seat booker','Books seats and kits at the nearest hub','Learning','Easy']]},
 skills:{t:'Skills library',s:'Step-by-step skills your assistants follow. Use them, or publish your own and earn when others do.',count:'40+ planned · 14 shown',items:[
  ['Clean a messy dataset','Fixes a spreadsheet and logs every change','Data','Easy'],
  ['Diagnose an underperforming ad','Finds where an ad loses people and what to change','Marketing','Medium'],
  ['Mark a test and find gaps','Item-by-item analysis with a reteach plan','Education','Medium'],
  ['Check an insurance claim pack','Spots missing items before submission','Healthcare','Hard'],
  ['Write a content brief','Turns a vague request into a brief a writer can follow','Content','Easy'],
  ['Review a contract','Explains each clause in business terms and flags gaps','Business owners','Hard'],
  ['Plan stock reorders','Forecast demand with safety stock and reorder points','Operations','Medium'],
  ['13-week cash plan','Rolling cash forecast with scenarios and warnings','Finance','Medium'],
  ['Hard conversations','Plan price rises, late payments and scope changes','Business owners','Medium'],
  ['Explain tech to leaders','Turns technical detail into a decision brief','Tech','Easy'],
  ['Find why answers are wrong','Sorts mistakes by type and fixes the pattern','Students','Easy'],
  ['Clinical notes from dictation','Structures spoken notes into a clean record','Healthcare','Hard'],
  ['Campaign plan','Funnel targets, channel split, messages and stop rules','Marketing','Medium'],
  ['Turn a meeting into an action plan','Owners, dates and tick boxes from any recording','Productivity','Easy']]}
};
const libState={q:'',dom:'',diff:''};
function libPage(k){const L=LIB[k];const doms=[...new Set(L.items.map(i=>i[2]))];
 const rows=L.items.filter(i=>(!libState.q||(i[0]+i[1]).toLowerCase().includes(libState.q))&&(!libState.dom||i[2]===libState.dom)&&(!libState.diff||i[3]===libState.diff));
 const dc={Easy:'ok',Medium:'warn',Hard:'lock'};const fld='font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink)';
 return topbar(L.t,L.s)+`<section class="card"><div data-s="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><input id="libQ" data-lib="${k}" value="${libState.q}" placeholder="Search ${L.t.toLowerCase()}" aria-label="Search" data-s="flex:1 1 220px;min-width:0;${fld}">
  <select id="libDom" data-lib="${k}" aria-label="Domain" data-s="${fld}"><option value="">All domains</option>${doms.map(d=>`<option ${d===libState.dom?'selected':''}>${d}</option>`).join('')}</select>
  <select id="libDiff" data-lib="${k}" aria-label="Difficulty" data-s="${fld}"><option value="">Any difficulty</option>${['Easy','Medium','Hard'].map(d=>`<option ${d===libState.diff?'selected':''}>${d}</option>`).join('')}</select><span class="sample">${L.count}</span></div>
  <div data-s="overflow-x:auto;margin-top:12px"><table data-s="width:100%;border-collapse:collapse;font-size:15px;min-width:560px"><thead><tr data-s="text-align:left;color:var(--muted);font-size:13px"><th data-s="padding:8px 4px">#</th><th>Name</th><th>Domain</th><th>Level</th><th></th></tr></thead><tbody>
  ${rows.map((r,i)=>`<tr data-s="border-top:1px solid var(--line)"><td data-s="padding:10px 4px;color:var(--muted);font:500 12px var(--mono)">${String(i+1).padStart(2,'0')}</td><td data-s="padding:10px 8px 10px 0"><b>${r[0]}</b><br><small data-s="color:var(--muted)">${r[1]}</small></td><td><span class="mode Digital" data-s="text-transform:none">${r[2]}</span></td><td><span class="state ${dc[r[3]]}">${r[3]}</span></td><td><button class="btn" data-toast="Opens on the live app">Open →</button></td></tr>`).join('')||'<tr><td colspan="5" data-s="padding:14px 4px" class="sample">No match. Clear a filter.</td></tr>'}
  </tbody></table></div></section>`}
/* ---------- Meet and match ---------- */
const ROLES=['Employer','Employee','Consultant','Advisor','Part-time (PTE)','Full-time (FTE)','SLA partner','JV partner','REEF economy partner'];
let myRole='Employee', assessed=null;
const PEOPLE=[
 {id:'p1',n:'GridCo Energy',r:'Employer',what:'Hiring an AI operations lead, hybrid, Dubai',disc:[70,40,35,75],fit:88,kind:'Long-term partnership',cx:'Promoter'},
 {id:'p2',n:'Meera K.',r:'Consultant',what:'Solar plant audits, 3-month SLA',disc:[45,60,55,70],fit:72,kind:'One-time opportunity',cx:'Neutral'},
 {id:'p3',n:'Yantra Labs',r:'JV partner',what:'Co-build sensor kits for schools',disc:[60,75,50,55],fit:91,kind:'Long-term partnership',cx:'Promoter'},
 {id:'p4',n:'QuickStaff Ltd',r:'Employer',what:'Night-shift contract, no training budget',disc:[85,30,20,40],fit:38,kind:'Not a good fit now',cx:'Detractor'}
];
const ME_DISC=[65,55,45,70];
const DISC=['D · Drive','I · Influence','S · Steadiness','C · Care for detail'];
function discBars(v,label){return `<div data-s="min-width:0"><b data-s="font-size:14px">${label}</b>${v.map((x,i)=>`<div data-s="display:grid;grid-template-columns:120px 1fr 34px;gap:8px;align-items:center;font-size:13px;margin-top:6px"><span>${DISC[i]}</span><div class="bar" data-s="margin:0"><i data-s="width:${x}%"></i></div><span data-s="font-variant-numeric:tabular-nums">${x}</span></div>`).join('')}</div>`}
function matchPage(){
 const a=assessed&&PEOPLE.find(p=>p.id===assessed);
 const cxCls={Promoter:'ok',Neutral:'warn',Detractor:'lock'};
 return topbar('Meet and match','Talk informally first. Your AI agent quietly checks the fit, and only you see the result.')+
 `<section class="card"><p class="eyebrow">I am joining as</p><div data-s="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${ROLES.map(r=>`<button class="btn" data-role="${r}" data-s="${r===myRole?'background:var(--accent-soft);border-color:var(--accent);color:var(--accent)':''}">${r}</button>`).join('')}</div></section>`+
 (a?`<section class="card" data-s="border-color:var(--accent)"><div class="sec-h"><h2>Private result: you and ${a.n}</h2><button class="btn" data-assess="">Close</button></div>
  <div class="kpis" data-s="margin-top:12px"><div class="card kpi"><b>${a.fit}%</b><small>Fit score</small><div class="bar"><i data-s="width:${a.fit}%"></i></div></div><div class="card kpi"><b data-s="font-size:18px">${a.kind}</b><small>Type of partnership</small></div><div class="card kpi"><b data-s="font-size:18px"><span class="state ${cxCls[a.cx]}" data-s="font-size:16px">${a.cx}</span></b><small>Effect on your career</small></div><div class="card kpi"><b data-s="font-size:18px">${a.r}</b><small>Their side</small></div></div>
  <div class="two" data-s="margin-top:14px">${discBars(ME_DISC,'Your DISC profile')}${discBars(a.disc,a.n+"'s DISC profile")}</div>
  <p class="note" data-s="margin-top:14px">${a.cx==='Promoter'?'Your styles complement each other and this moves you toward your point B. Suggested next step: a paid trial project.':a.cx==='Neutral'?'Good for a single piece of work. It will not change your pathway much.':'Styles and terms pull against your goals. Your agent suggests politely passing for now.'} They see their own result, never yours.</p></section>`:'')+
 `<section class="card"><div class="sec-h"><h2>People open to a chat</h2><span class="sample">Sample people</span></div><div class="list">${PEOPLE.map(p=>`<div class="row"><div><b>${p.n}</b><small>${p.r} · ${p.what}</small></div><button class="btn" data-toast="Informal chat opens here on the live site">Say hello</button><button class="btn pri" data-assess="${p.id}">Assess privately</button></div>`).join('')}</div></section>
 <section class="card"><h2 data-s="font-size:20px">How it works</h2><div class="list" data-s="margin-top:6px">${[['Chat, not interview','Coffee-style chat, voice or text, in a hub or online.'],['Each side clicks its own agent','Your agent reads the chat, profiles and work history with your permission. Nothing is shared without your OK.'],['DISC profile and verdict','You get both DISC profiles, a fit score, the type of partnership, and whether it would be a promoter, neutral or detractor for your career.'],['You decide','Accept, propose a trial, or pass politely. The other side is told only your decision.']].map(([x,y])=>`<div class="row" data-s="grid-template-columns:1fr"><div><b>${x}</b><small>${y}</small></div></div>`).join('')}</div></section>`;
}
/* ---------- HFL GPT ---------- */
let chat=[{me:false,t:'Hi Sanjay. I can find work, build your resume, make images or videos, plan a lesson, or set up a partnership chat. What do you need?'}];
const ROUTES=[['resume|cv','resume','I can build that. Opening the resume builder with your profile filled in.'],['video|film|movie|series|image|picture|poster','studio','Opening the studio. Pick a length and describe your idea.'],['partner|employer|consultant|meet|match|jv','match','Opening Meet and match. Pick who you are and say hello to someone.'],['job|work|gig','career','Here are the roles that match your pathway.'],['learn|course|lesson','lms','Here are your courses.'],['money|wallet|price','wallet','Here is your wallet.']];
function gptPage(){return topbar('HFL GPT','One assistant that can use every tool in the ecosystem for you.')+
 `<section class="card" data-s="display:grid;gap:10px">${chat.map(m=>`<div data-s="justify-self:${m.me?'end':'start'};max-width:80%;background:${m.me?'var(--accent)':'var(--bg)'};color:${m.me?'var(--accent-ink)':'var(--ink)'};padding:10px 14px;border-radius:14px">${m.t}${m.go?` <a href="#${m.go}" data-s="color:inherit;font-weight:700">Open →</a>`:''}</div>`).join('')}
 <form id="gptForm" data-s="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="go" data-mic aria-label="Speak" data-s="margin:0">${svg('mic')}</button><input id="askIn" placeholder="Say or type, for example 'make a 15 second video for my shop'" data-s="flex:1 1 220px;min-width:0;font:inherit;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)" aria-label="Message"><button class="btn pri">Send</button></form>
 <div data-s="display:flex;gap:8px;flex-wrap:wrap">${['Build my resume for LinkedIn','Make a 9 second video','Find a JV partner','Plan my week of learning'].map(s=>`<button class="btn" data-suggest="${s}">${s}</button>`).join('')}</div></section>
 <p class="sample">In the live app, HFL GPT runs on top AI models and can use every agent, skill and tool listed in the AI Toolkit.</p>`}
function gptReply(q){chat.push({me:true,t:q.replace(/</g,'&lt;')});const l=q.toLowerCase();const r=ROUTES.find(([k])=>new RegExp(k).test(l));chat.push(r?{me:false,t:r[2],go:r[1]}:{me:false,t:'I can help with that on the live app. For now, try resumes, videos, jobs, partners, learning or your wallet.'});render()}
/* ---------- Resume builder ---------- */
const TARGETS={
 'LinkedIn':{len:'Headline 220 characters, About up to 2,600',tone:'First person, keyword rich, achievements with numbers'},
 'HFL Profile':{len:'One screen, linked to your verified certificates and projects',tone:'Skills-first, proof attached from LMS and AMS'},
 'Glassdoor':{len:'2 pages max',tone:'Clear job titles and dates; salary history kept private'},
 'Adecco':{len:'2 pages, ATS-safe plain layout',tone:'Matches the job ad keywords; availability up front'},
 'Indeed':{len:'1 to 2 pages, ATS-safe',tone:'Short bullets, location and shift preferences'},
 'Stanton Chase (executive)':{len:'Executive brief, 2 to 3 pages',tone:'Board-level outcomes, P&L, leadership and transformation'}
};
let tgt='LinkedIn';
function resumePage(){const T=TARGETS[tgt];return topbar('Resume builder','Tell it once. Get a version tuned for every site and headhunter.')+
 `<section class="card"><p class="eyebrow">Tune for</p><div data-s="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${Object.keys(TARGETS).map(k=>`<button class="btn" data-tgt="${k}" data-s="${k===tgt?'background:var(--accent-soft);border-color:var(--accent);color:var(--accent)':''}">${k}</button>`).join('')}</div></section>
 <div class="two"><section class="card"><h2 data-s="font-size:20px">About your work</h2><p class="sample">Speak or type. Filled from your profile as an example.</p>
 <textarea id="cvIn" rows="8" data-s="width:100%;font:inherit;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);margin-top:8px">General Manager and specialist technocrat in the energy sector. Led plant operations and digital programs. Now building AI assistants for shift reporting and maintenance. Founder, Ajan HFL.</textarea></section>
 <section class="card"><p class="eyebrow">${tgt} version</p><h2 data-s="font-size:20px;margin:6px 0">Sanjay Raghavendra Acharya</h2><p data-s="margin:0;color:var(--accent);font-weight:600">${tgt.startsWith('Stanton')?'Energy Executive · Digital and AI Transformation Leader':'Energy Operations Leader | AI for Plants and Grids | Founder, Ajan HFL'}</p>
 <ul data-s="padding-left:18px;margin:10px 0">${(tgt.startsWith('Stanton')?['Led multi-site energy operations with full P&L ownership','Drove digital and AI transformation across plant operations','Founded Ajan HFL, an ecosystem for skills, work and enterprise']:['Built AI assistants that cut shift-report time (add your number)','Led plant operations and digital programs in the energy sector','Founder of Ajan HFL; mentor in the Energy AI squad']).map(x=>`<li>${x}</li>`).join('')}</ul>
 <div class="note"><b>Length:</b> ${T.len}<br><b>Style:</b> ${T.tone}</div>
 <div data-s="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn pri" data-toast="AI rewrite runs on the live app">Rewrite with AI</button><button class="btn" data-toast="Export opens on the live app">Export</button></div></section></div>`}
/* ---------- Studio ---------- */
const LENGTHS=(()=>{const a=[];for(let s=30;s<=180*60;s+=15){if(s<=300||s%300===0)a.push(s)}return a})();
const fmtLen=s=>s<60?s+' s':s<3600?(Math.floor(s/60)+' min'+(s%60?' '+s%60+' s':'')):(Math.floor(s/3600)+' h'+(s%3600?' '+(s%3600)/60+' min':''));
let vidLen=15, vidMode='clip', seasons=2, eps=8, epLen=2700;
function studioPage(){
 const scenes=vidMode==='clip'?Math.max(1,Math.round(vidLen/(vidLen<=15?3:vidLen<=300?10:120))):seasons*eps;
 const total=vidMode==='clip'?vidLen:seasons*eps*epLen;
 const sel=(on)=>on?'background:var(--accent-soft);border-color:var(--accent);color:var(--accent)':'';
 const fld='font:inherit;padding:6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)';
 return topbar('Image and video studio','Describe it by voice or typing. Shape it as you watch.')+
 `<div class="two"><section class="card"><h2 data-s="font-size:20px">Image</h2>
  <div data-s="display:grid;gap:8px;margin-top:10px"><input id="imgIn" value="Solar panels on a school roof at sunrise" aria-label="Image idea" data-s="font:inherit;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)">
  <div data-s="display:flex;gap:8px;flex-wrap:wrap">${['Photo','Poster','Sketch','3D'].map((s,i)=>`<button class="btn" data-imgstyle="${i}">${s}</button>`).join('')}</div>
  <canvas id="imgCv" width="640" height="360" data-s="width:100%;border-radius:12px;background:var(--bg)"></canvas>
  <p class="sample" data-s="margin:0">Preview sketch. The live studio draws the real image and lets you point at parts to change them.</p></div></section>
 <section class="card"><h2 data-s="font-size:20px">Video</h2>
  <div data-s="display:flex;gap:8px;margin-top:10px"><button class="btn" data-vmode="clip" data-s="${sel(vidMode==='clip')}">Clip or film</button><button class="btn" data-vmode="series" data-s="${sel(vidMode==='series')}">Series</button></div>
  ${vidMode==='clip'?`<div data-s="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${[3,5,6,9,12,15].map(s=>`<button class="btn" data-len="${s}" data-s="${s===vidLen?'background:var(--ink);color:var(--surface)':''}">${s} s</button>`).join('')}</div>
  <label for="lenSel" data-s="display:block;margin-top:10px">Longer, in 15-second steps up to 3 hours</label><select id="lenSel" data-s="${fld};max-width:100%"><option value="">Choose a longer length</option>${LENGTHS.map(s=>`<option value="${s}" ${s===vidLen?'selected':''}>${fmtLen(s)}</option>`).join('')}</select>`
  :`<div data-s="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center"><label>Seasons <input id="seaIn" type="number" min="1" max="20" value="${seasons}" data-s="width:64px;${fld}"></label><label>Episodes each <input id="epIn" type="number" min="1" max="30" value="${eps}" data-s="width:64px;${fld}"></label><label>Episode length <select id="epLen" data-s="${fld}">${[900,1800,2700,3600].map(s=>`<option value="${s}" ${s===epLen?'selected':''}>${fmtLen(s)}</option>`).join('')}</select></label></div>`}
  <div class="kpis" data-s="grid-template-columns:repeat(2,1fr);margin-top:12px"><div class="card kpi"><b>${fmtLen(total)}</b><small>Total running time</small></div><div class="card kpi"><b>${scenes}</b><small>${vidMode==='clip'?'Scenes in storyboard':'Episodes to plan'}</small></div></div>
  <div data-s="display:flex;gap:4px;margin-top:12px;overflow-x:auto">${Array.from({length:Math.min(scenes,24)},(_,i)=>`<div data-s="flex:0 0 46px;height:30px;border-radius:5px;background:var(--accent-soft);color:var(--accent);font:500 10px var(--mono);display:grid;place-items:center">${vidMode==='clip'?i+1:'S'+(Math.floor(i/eps)+1)+'E'+(i%eps+1)}</div>`).join('')}${scenes>24?`<span class="sample" data-s="align-self:center;white-space:nowrap">+${scenes-24} more</span>`:''}</div>
  <button class="btn pri" data-s="margin-top:12px" data-toast="Rendering runs on the live studio">Make storyboard</button></section></div>`;
}
let imgStyle=0;
function drawImg(){const c=document.getElementById('imgCv');if(!c)return;const x=c.getContext('2d'),cs=getComputedStyle(document.documentElement),acc=cs.getPropertyValue('--accent').trim(),gold=cs.getPropertyValue('--gold').trim(),soft=cs.getPropertyValue('--accent-soft').trim(),ink=cs.getPropertyValue('--ink').trim();
 const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,gold);g.addColorStop(1,soft);x.fillStyle=g;x.fillRect(0,0,640,360);
 x.fillStyle=gold;x.beginPath();x.arc(500,110,46,0,7);x.fill();
 x.fillStyle=acc;x.fillRect(0,250,640,110);for(let i=0;i<7;i++){x.save();x.translate(60+i*80,230);x.transform(1,0,-.4,1,0,0);x.fillStyle=ink;x.globalAlpha=imgStyle===2?.4:.85;x.fillRect(0,0,64,34);x.restore()}
 x.globalAlpha=1;x.fillStyle=ink;x.font='600 18px Outfit, sans-serif';x.fillText((document.getElementById('imgIn')?.value||'').slice(0,48),20,32);x.font='500 13px JetBrains Mono, monospace';x.fillText(['PHOTO','POSTER','SKETCH','3D'][imgStyle]+' · sample preview',20,54)}
let refRows=[{who:'',code:''}];
function refPage(){
 return topbar('Referrals','Everyone who brings someone in shares the reward.')+`
 <section class="card"><p class="eyebrow">Your code</p><div class="ref-code"><code id="myCode">HFL-SANJ-156</code><button class="btn" data-copy>Copy</button><button class="btn gold" data-toast="Share sheet opens on a live site">Share</button></div>
 <p class="sample" data-s="margin-top:10px">Every member gets a code, whether they joined alone or were invited. Reward amounts are not set yet.</p></section>
 <section class="card"><div class="sec-h"><h2>Who referred you</h2><span class="sample">Optional</span></div>
  <div class="ref-rows" id="refRows">${refRows.map((r,i)=>`<div class="ref-row"><input id="rw${i}" placeholder="Name or phone" value="${r.who}" data-ref="${i}" data-k="who" aria-label="Referrer ${i+1}"><input id="rc${i}" placeholder="Their code" value="${r.code}" data-ref="${i}" data-k="code" aria-label="Code ${i+1}"><button data-delrow="${i}" aria-label="Remove row">✕</button></div>`).join('')}</div>
  <div data-s="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn" data-addrow>+ Add another referrer</button><button class="btn pri" data-toast="Referrers saved">Save</button><button class="btn" data-toast="Skipped for now">Skip for now</button></div></section>
 <section class="card"><div class="sec-h"><h2>Your referral chain</h2><span class="sample">Sample</span></div>
  <div class="chain"><span>Ram</span>→<span><b>You</b></span>→<span>Priya</span>→<span>2 more</span></div>
  <div class="list" data-s="margin-top:12px"><div class="row"><div><b>Priya joined Founder Track</b><small>Used your code · 3 Nov</small></div><span></span><span class="state ok">Reward pending</span></div></div></section>`;
}

const closedG=new Set(), openSub=new Set();
function renderNav(){
 const cur=(location.hash||'#home').slice(1);
 document.getElementById('progName').textContent=PROGRAMS[prog].n;
 document.getElementById('nav').innerHTML=NAV.map((g,gi)=>`<div class="grp ${closedG.has(gi)?'closed':''}" id="g${gi}"><button aria-expanded="${!closedG.has(gi)}" data-grp="${gi}">${g.g}<span class="chev">▾</span></button><ul>${g.items.map(([h,l,ic,x,kids],ii)=>{
   const key=gi+'-'+ii, inKids=kids&&kids.some(k=>k[0]===cur), open=openSub.has(key)||inKids;
   if(!kids) return `<li><a href="#${h}" class="${cur===h?'on':''} ${h==='logout'?'logout':''}"><span class="ic">${svg(ic)}</span>${l}${x?`<span class="badge">${x}</span>`:''}</a></li>`;
   return `<li><a href="#${h}" data-sub="${key}" class="${cur===h&&!inKids?'on':''}"><span class="ic">${svg(ic)}</span>${l}<span class="tag">${open?'▾':'▸'}</span></a>${open?`<ul class="sub">${kids.map(([kh,kl])=>`<li><a href="#${kh}" class="${cur===kh?'on':''}">${kl}</a></li>`).join('')}</ul>`:''}</li>`;
 }).join('')}</ul></div>`).join('');
}
function progMenu(){
 const box=document.getElementById('progMenu');
 if(!box.hidden){box.hidden=true;return}
 box.innerHTML=PROGRAMS.map((p,i)=>`<button class="${i===prog?'on':''}" data-prog="${i}"><span class="mode Digital">${p.sys}</span> ${p.n}</button>`).join('')+`<a href="#all-courses">+ Join another program</a>`;
 box.hidden=false;
}
function drawDial(){
 const c=document.getElementById('dial'); if(!c) return; const x=c.getContext('2d'),cs=getComputedStyle(document.documentElement);
 const acc=cs.getPropertyValue('--accent').trim(),soft=cs.getPropertyValue('--accent-soft').trim(),sur=cs.getPropertyValue('--surface').trim(),ink=cs.getPropertyValue('--accent').trim();
 x.clearRect(0,0,360,360);
 [170,140,110].forEach((r,i)=>{x.beginPath();x.arc(180,180,r,0,Math.PI*2);x.fillStyle=i===0?soft:'transparent';x.fill();x.strokeStyle=acc;x.globalAlpha=.25+i*.15;x.lineWidth=2;x.stroke();x.globalAlpha=1});
 for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.arc(180+150*Math.cos(a),180+150*Math.sin(a),4,0,7);x.fillStyle=acc;x.globalAlpha=.5;x.fill();x.globalAlpha=1}
 x.fillStyle=sur;x.beginPath();x.roundRect?x.roundRect(115,115,130,130,22):x.rect(115,115,130,130);x.fill();
 x.fillStyle=ink;x.font='700 46px Outfit, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('AI',180,182);
}
function render(){
 const cur=(location.hash||'#home').slice(1);
 const v=document.getElementById('view');
 v.innerHTML=(cur==='home'||!PAGES[cur])?home():PAGES[cur]();
 applyStyles(); renderNav(); applyStyles(); drawDial(); drawImg(); if(cur==='verify'&&!timer)startTimer(); if(cur!=='verify'){clearInterval(timer);timer=null}
 document.getElementById('rail').classList.remove('open');document.getElementById('scrim').classList.remove('open');
}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

document.addEventListener('click',e=>{
 const t=e.target.closest('button,a'); if(!t) return;
 if(t.dataset.mode){mode=t.dataset.mode;render();return}
 if(t.dataset.act==='menu'){document.getElementById('rail').classList.add('open');document.getElementById('scrim').classList.add('open');return}
 if(t.dataset.grp!=null){const n=+t.dataset.grp;closedG.has(n)?closedG.delete(n):closedG.add(n);renderNav();return}
 if(t.dataset.doneToggle){S.done[t.dataset.doneToggle]=!S.done[t.dataset.doneToggle];save();render();return}
 if(t.dataset.toast){toast(t.dataset.toast);return}
 if(t.hasAttribute('data-addrow')){refRows.push({who:'',code:''});render();return}
 if(t.dataset.delrow!=null){refRows.splice(+t.dataset.delrow,1);if(!refRows.length)refRows=[{who:'',code:''}];render();return}
 if(t.hasAttribute('data-copy')){const c=document.getElementById('myCode').textContent;navigator.clipboard?.writeText(c).then(()=>toast('Code copied'),()=>{getSelection().selectAllChildren(document.getElementById('myCode'));toast('Press copy on your keyboard')});return}
 if(t.id==='progBtn'){progMenu();return}
 if(t.dataset.approve){pending={kind:t.dataset.approve,no:Math.floor(Math.random()*900+100),match:Math.floor(Math.random()*90+10),t0:Date.now(),
   what:t.dataset.approve==='email'?'Confirm your email on HFL?':'New sign-in on a MacBook Air',
   detail:t.dataset.approve==='email'?`Confirms ${email} for your account.`:'Dubai · Safari · just now. Approve to link it to your account.'};
   location.hash==='#devices'?render():(location.hash='#devices');setTimeout(()=>document.querySelector('[data-decide]')?.scrollIntoView({block:'center'}),50);return}
 if(t.dataset.decide){const p=pending;pending=null;
   if(t.dataset.decide==='yes'){if(p.kind==='email')S.done.email=true;else DEVICES.push({n:'MacBook Air',os:'macOS',ic:'desk',where:'Dubai'});save();toast(`Approved in ${((Date.now()-p.t0)/1000).toFixed(1)} s. No code typed.`);location.hash=p.kind==='email'?'#home':'#devices';render()}
   else{toast('Blocked. We signed that device out and will email you.');render()}return}
 if(t.dataset.role){myRole=t.dataset.role;render();return}
 if(t.dataset.assess!=null){assessed=t.dataset.assess||null;render();if(assessed)scrollTo({top:0});return}
 if(t.dataset.tgt){tgt=t.dataset.tgt;render();return}
 if(t.dataset.suggest){gptReply(t.dataset.suggest);return}
 if(t.dataset.len){vidLen=+t.dataset.len;render();return}
 if(t.dataset.vmode){vidMode=t.dataset.vmode;render();return}
 if(t.dataset.imgstyle){imgStyle=+t.dataset.imgstyle;drawImg();return}
 if(t.dataset.claim){S.done['offer-'+t.dataset.claim]=true;save();render();toast('Claimed. Find it under Claimed offers.');return}
 if(t.dataset.style){style=t.dataset.style;render();return}
 if(t.hasAttribute('data-mic')){toast('Voice works in the live app; type here for now');document.getElementById('askIn').focus();return}
 if(t.hasAttribute('data-decide-passkey')){S.done.email=true;save();toast('Confirmed with your passkey in 0.8 s');location.hash='#home';return}
 if(t.dataset.unlink!=null){if(DEVICES.length>1){DEVICES.splice(+t.dataset.unlink,1);render();toast('Device signed out')}else toast('Keep at least one device');return}
 if(t.dataset.prog!=null){prog=+t.dataset.prog;document.getElementById('progMenu').hidden=true;render();toast('Switched to '+PROGRAMS[prog].n);return}
 if(t.dataset.sub){const k=t.dataset.sub;openSub.has(k)?openSub.delete(k):openSub.add(k);}
 if(t.dataset.otpRetry!=null){codeNo++;codeAt=new Date().toTimeString().slice(0,5);render();startTimer();toast('Code #'+codeNo+' sent to '+email);return}
 if(t.dataset.fill){navigator.clipboard?.writeText(t.dataset.fill).catch(()=>{});t.dataset.fill.split('').forEach((d,i)=>{const b=document.getElementById('o'+i);if(b)b.value=d});toast('Code copied and filled in');return}
 if(t.dataset.editEmail!=null){const f=document.getElementById('emailEdit');f.hidden=!f.hidden;return}
 if(t.id==='helpBtn'){const p=document.getElementById('helpPop');p.hidden=!p.hidden;return}
 if(t.id==='helpGo'){document.getElementById('helpPop').hidden=true;toast('The guide opens here on the live site');return}
});
document.getElementById('scrim').onclick=()=>{document.getElementById('rail').classList.remove('open');document.getElementById('scrim').classList.remove('open')};
document.addEventListener('change',e=>{
 if(e.target.id==='libDom'){libState.dom=e.target.value;render();return}
 if(e.target.id==='libDiff'){libState.diff=e.target.value;render();return}
 if(e.target.id==='lenSel'){if(e.target.value){vidLen=+e.target.value;render()}return}
 if(e.target.id==='seaIn'){seasons=Math.max(1,Math.min(20,+e.target.value||1));render();return}
 if(e.target.id==='epIn'){eps=Math.max(1,Math.min(30,+e.target.value||1));render();return}
 if(e.target.id==='epLen'){epLen=+e.target.value;render();return}
 if(e.target.id==='imgIn'){drawImg();return}if(e.target.dataset.done){S.done[e.target.dataset.done]=e.target.checked;save()}});
document.addEventListener('input',e=>{if(e.target.id==='libQ'){libState.q=e.target.value.toLowerCase();const pos=e.target.selectionStart;render();const n=document.getElementById('libQ');n.focus();n.setSelectionRange(pos,pos);return}
 if(e.target.id==='calcIn'){const v=Math.max(0,parseFloat(e.target.value)||0);document.getElementById('calcOut').innerHTML=`+ ${money(v*ADMIN)} admin = <b>${money(v*(1+ADMIN))}</b>`;return}
 const r=e.target.dataset.ref;if(r!=null)refRows[+r][e.target.dataset.k]=e.target.value;
 const m=/^o(\d)$/.exec(e.target.id);if(m){const v=e.target.value.replace(/\D/g,'');if(v.length>1){v.slice(0,6).split('').forEach((d,i)=>{const b=document.getElementById('o'+i);if(b)b.value=d});document.getElementById('o'+Math.min(5,v.length-1)).focus();return}e.target.value=v;if(v&&+m[1]<5)document.getElementById('o'+(+m[1]+1)).focus()}});
document.addEventListener('keydown',e=>{const m=/^o(\d)$/.exec(e.target.id||'');if(m&&e.key==='Backspace'&&!e.target.value&&+m[1]>0)document.getElementById('o'+(m[1]-1)).focus()});
document.addEventListener('paste',e=>{const m=/^o(\d)$/.exec(e.target.id||'');if(!m)return;const v=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);if(!v)return;e.preventDefault();v.split('').forEach((d,i)=>{const b=document.getElementById('o'+i);if(b)b.value=d});document.getElementById('o'+(v.length-1)).focus()});
document.addEventListener('submit',e=>{e.preventDefault();
 if(e.target.id==='otp6Form'){const v=[0,1,2,3,4,5].map(i=>document.getElementById('o'+i).value).join('');if(/^\d{6}$/.test(v)){S.done.email=true;save();toast('Email confirmed');location.hash='#home'}else toast('Enter all 6 digits from the email')}
 if(e.target.id==='emailEdit'){const n=document.getElementById('newEmail').value.trim();if(n.includes('@')){email=n;document.getElementById('emailShown').textContent=n;e.target.hidden=true;startTimer();toast('Code sent to '+n)}}
 if(e.target.id==='postForm'){const v=document.getElementById('postIn').value.trim();if(v){MYPOSTS.unshift(v.replace(/</g,'&lt;'));render();toast('Posted to the community')}return}
 if(e.target.id==='gptForm'){const q=document.getElementById('askIn').value.trim();if(q)gptReply(q);return}
 if(e.target.id==='askForm'){const q=document.getElementById('askIn').value.toLowerCase();if(!q){toast('Say or type what you need');return}
   const map=[['work|job|gig|career','career'],['sell|shop|market','market'],['free|offer','offers'],['learn|course|class','lms'],['money|wallet|pay|earn','wallet'],['device|phone|laptop','devices']];
   const hit=map.find(([k])=>new RegExp(k).test(q));location.hash='#'+(hit?hit[1]:'agents');toast(hit?'Here is what I found':'Try an agent from the Agent bank');}
 if(e.target.id==='bugForm'){toast('Report saved in this prototype');e.target.reset()}
});
document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.toLowerCase();const hit=MODS.find(m=>(m[1]+m[2]+m[3]).toLowerCase().includes(q));if(hit)location.hash='#'+hit[0];else toast('No match in this prototype')}});
window.addEventListener('hashchange',render);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',drawDial);
new MutationObserver(drawDial).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
render();
