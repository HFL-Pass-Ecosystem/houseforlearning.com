(function(){
'use strict';
// ---- DEMO DATA (sample only) ----
var MEMBER={name:'Demo Member',id:'HFL-DEMO-0001',emailOk:false,phoneOk:false};
var SPACES=[
 {k:'learn',n:'Learning space',s:'LMS',tab:['Learn','📚','lms'],note:'Let us keep your learning going.',
  up:['UP NEXT · LIVE CLASS','Demo Class: Plan Your Learning Path',['📅 14 November','🕕 6:00 PM – 9:00 PM','👤 Demo Trainer'],'View class checklist','live'],
  prep:['BEFORE YOUR FIRST CLASS','You are almost ready',['🎤 Check your sound and internet','📓 Keep a notebook ready','⏰ Join 5 minutes early'],'The recording arrives 24 hours after class.'],
  todo:[['Watch the recording','Demo Class: Welcome to HFL','live'],['Share your progress','Post one line in the Welcome room','community']],
  sense:'Your class is close. I moved the class checklist to the top and kept the rest quiet.'},
 {k:'earn',n:'Earning space',s:'EMS',tab:['Earn','💰','ems'],note:'Let us grow your earnings today.',
  up:['UP NEXT · EARNING STEP','Demo: Finish your first side-income plan',['📅 This week','⏱ 30 minutes','🎯 Goal: first sample task'],'Open earning paths','paths'],
  prep:['BEFORE YOU START','Three small things',['🧾 Check how pay as you go works','🪪 Keep your profile ready','📸 Add one sample of your work'],'Admin charge is added on top. Demo figures only.'],
  todo:[['See free offers','5 free things to try','free'],['Invite a friend','Use your referral code','refer']],
  sense:'You want to earn. I put earning paths and free offers first, and hid class menus.'},
 {k:'author',n:'Author space',s:'AMS',tab:['Author','✍️','ams'],note:'Let us write something useful today.',
  up:['UP NEXT · DRAFT','Demo: Intro to Safe Wiring, lesson 2',['📅 Due 16 November','✍️ 40% written','👥 1 reviewer'],'Open my draft','ams'],
  prep:['BEFORE YOU WRITE','Get set',['💡 Pick one idea for the lesson','🎯 Write the goal in one line','🖼️ Keep one picture ready'],'Reviewers reply within 2 days (demo).'],
  todo:[['Check the review queue','Empty today','ams'],['Find a skill to add','Skills library','skills']],
  sense:'You are writing. I opened author tools and put skills and agents close.'},
 {k:'train',n:'Trainer space',s:'TMS',tab:['Train','🧑‍🏫','tms'],note:'Let us help your learners today.',
  up:['UP NEXT · CLASS TO TEACH','Demo: Safety Basics for Beginners',['📅 15 November','🕕 10:00 AM','👥 12 learners (demo)'],'Open class kit','tms'],
  prep:['BEFORE YOU TEACH','Ready your class',['🎤 Test your sound','🖥️ Open your slides','📋 Read learner questions'],'Learners get the recording after 24 hours.'],
  todo:[['Answer learner questions','2 waiting','tms'],['Plan the next class','Open calendar','cal']],
  sense:'You teach soon. I put your class kit and learner questions first.'},
 {k:'market',n:'Marketplace',s:'Market',tab:['Market','🛒','market'],note:'Let us find what you need, or sell what you make.',
  up:['UP NEXT · LISTING','Demo: Add your first listing',['🏷️ Courses, kits, hours','📸 One photo','📝 Two lines'],'Open marketplace','market'],
  prep:['BEFORE YOU SELL','Quick checklist',['🪪 Profile is ready','📸 Add a clear photo','🧾 Read how pay as you go works'],'Admin charge is added on top. Demo figures only.'],
  todo:[['Browse offers','Sample listings','offers'],['See my earnings','Nothing yet','ems']],
  sense:'You are in the marketplace. I put offers and earnings next to each other.'},
 {k:'work',n:'Workplace',s:'Work',tab:['Work','💼','work'],note:'Let us get today\'s work done.',
  up:['UP NEXT · TASK','Demo: Send the weekly update',['📅 Today','🕕 5:00 PM','👥 Team room'],'Open my tasks','work'],
  prep:['BEFORE YOU START','Today\'s checklist',['✅ Check 2 open tasks','💬 Read 1 team message','📁 Open shared files'],'Tasks sync across all your devices (demo).'],
  todo:[['Reply in the team room','1 new message','work'],['Find a job or gig','Job portal','jobs']],
  sense:'You are at work. I hid learning menus and put tasks and the team first.'},
 {k:'phygital',n:'Phygital space',s:'Phygital',tab:['Phygital','🔷','phygital'],note:'Physical, hybrid or digital. You choose.',
  up:['UP NEXT · HYBRID EVENT','Demo: Open Day, join in the room or on screen',['📅 20 November','🕕 11:00 AM','📍 Room or online'],'See all ways to join','phygital'],
  prep:['BEFORE YOU JOIN','Pick how you join',['🏢 Physical: bring your ID','🔀 Hybrid: test your screen','💻 Digital: check internet'],'You can change the way you join later.'],
  todo:[['Choose how to learn','Physical, hybrid, digital','phygital'],['Find a nearby event','Demo list','cal']],
  sense:'You work across rooms and screens. I show all three ways side by side.'}
];
var GRP_SP={'LEARN (LMS)':['learn','train','phygital'],'EARN (EMS)':['earn','market','work'],'AUTHOR AND TRAIN':['author','train'],'TOOLS AND CAREERS':['earn','work','learn','author'],'NETWORKS AND FRAMEWORKS':['market','work','phygital','train']};
function curSpace(){return SPACES.filter(function(x){return x.k===state.space})[0]}
var MENU=[
 {g:'MAIN',items:[['home','🏠','Home'],['notes','🔔','Notifications',4],['kit','🎒','Starter kit']]},
 {g:'LEARN (LMS)',items:[['lms','📚','My courses'],['live','📅','Live classes'],['cal','🗓️','Calendar'],['coach','🤝','Coaching'],['cert','🎓','Certificates'],['saved','🎞️','Saved videos']]},
 {g:'EARN (EMS)',items:[['ems','💰','Earning hub'],['market','🛒','Marketplace'],['work','💼','Workplace'],['free','🎁','Free offers'],['paths','🛤️','Earning paths'],['payg','🧾','Pay as you go'],['offers','🏷️','Offers'],['jobs','📋','Job portal']]},
 {g:'AUTHOR AND TRAIN',items:[['ams','✍️','Author studio (AMS)'],['tms','🧑‍🏫','Trainer studio (TMS)']]},
 {g:'TOOLS AND CAREERS',items:[['tools','🧰','Tools'],['careers','🧭','Career portal'],['phygital','🔷','Phygital']]},
 {g:'NETWORKS AND FRAMEWORKS',items:[['nets','🕸️','Networks'],['frames','🧩','Frameworks']]},
 {g:'COMMUNITY',items:[['community','👥','Overview'],['gallery','🖼️','Project gallery'],['impact','🙏','Impact and gratitude'],['ach','🏆','Achievers'],['posts','📝','My posts']]},
 {g:'AI AND EARNING',items:[['feed','✨','AI feed'],['refer','🎁','Referrals and rewards'],['assistant','🤖','Go to assistant'],['agents','🧑‍💻','Agent bank'],['skills','🛠️','Skills library']]},
 {g:'ME',items:[['profile','👤','My profile'],['jobs','📋','Job portal'],['mycerts','🎓','My certificates'],['mylearn','📖','My learnings'],['saved','🎞️','Saved videos'],['devices','🔐','Devices and sign-in']]},
 {g:'SETTINGS',items:[['support','🎧','Support'],['apps','📲','Download apps'],['bug','🐞','Report a problem'],['out','↩','Log out']]}
];
var SYSTEMS={
 lms:{t:'Learning (LMS)',rows:[['Electrical Basics: Level 1','L1 · 3 of 9 done'],['Safe Wiring Practice','L2 · not started'],['Project Reports','L3 · locked']]},
 live:{t:'Live classes',rows:[['Demo Class: Plan Your Learning Path','14 Nov · 6:00 PM – 9:00 PM'],['Demo Class: Build a Side Income','21 Nov · 6:00 PM']]},
 cert:{t:'Certificates',rows:[['Welcome Badge (demo)','Earned'],['Level 1 Certificate','Opens after Level 1']]},
 ems:{t:'Earning (EMS)',rows:[['Side-income ideas for you','3 new'],['Open gigs near you (demo)','5 open'],['My referral earnings','0 so far']]},
 market:{t:'Marketplace',rows:[['Demo Course Pack','Sample listing'],['Demo Toolkit','Sample listing'],['Demo Mentor Hour','Sample listing']]},
 work:{t:'Workplace',rows:[['My tasks','2 open'],['Team room','1 new message'],['Shared files','4 files']]},
 ams:{t:'Author studio (AMS)',rows:[['My draft: Intro to Safe Wiring','Draft'],['Ideas shelf','6 ideas'],['Review queue','Empty']]},
 tms:{t:'Trainer studio (TMS)',rows:[['My classes','0 booked'],['Learner questions','2 waiting'],['Class kit','Ready']]},
 tools:{t:'Tools',rows:[['Cable size calculator (demo)','Open'],['Study planner','Open'],['CV helper','Open']]},
 community:{t:'Community',rows:[['Welcome room','12 members (demo)'],['Study circles','3 circles'],['Ask an expert','Open']]},
 notes:{t:'Notifications',rows:[['Welcome to HFL (demo)','Today'],['Your Level 1 course is ready','Today'],['A live class is 5 days away','Today'],['Please verify your email','Today']]},
 refer:{t:'Referrals and rewards',rows:[['Rewards history','Nothing yet'],['Your code','HFL-DEMO-REF-01'],['Friends joined','0'],['Rules for rewards','Waiting for owner approval']]},
 support:{t:'Support',rows:[['Helper with a face (AI avatar)','Beta · demo'],['Voice helper (talk to it)','Demo'],['Chat on WhatsApp','Demo'],['Talk to a person','On request'],['My tickets','None']]},
 profile:{t:'Profile',rows:[['Name',MEMBER.name],['Email',MEMBER.email||'demo@example.invalid'],['Member ID',MEMBER.id],['Language','English (change anytime)']]},
 kit:{t:'Starter kit',rows:[['Set up your profile','Step 1'],['Pick your goal','Step 2'],['Join your first class','Step 3']]},
 cal:{t:'Calendar',rows:[['14 Nov · Demo live class','6:00 PM'],['21 Nov · Demo coaching call','5:00 PM']]},
 coach:{t:'Coaching',rows:[['Book a coach (demo)','Open'],['My sessions','None yet']]},
 saved:{t:'Saved videos',rows:[['Demo: Welcome to HFL','Saved'],['Demo: Safe wiring tips','Saved']]},
 free:{t:'Free offers',rows:[['Free starter course: Use your phone for learning','Free'],['Free voice class: Ask, listen, learn','Free'],['Free skill check and goal map','Free'],['Free community circle','Free'],['Free career tree walk-through','Free']]},
 paths:{t:'Earning paths',rows:[['Learn a skill, then offer it as a service','Side income'],['Teach what you know (Trainer studio)','Teaching income'],['Write a short course (Author studio)','Author income'],['Sell in the marketplace','Selling income'],['Take tasks in the workplace','Task income'],['Refer friends who join','Referral income']]},
 offers:{t:'Offers',rows:[['Demo member offer','Sample only']]},
 jobs:{t:'Job portal',rows:[['Demo Junior Technician','Sample'],['Demo Site Assistant','Sample']]},
 ach:{t:'Achievers',rows:[['A. (demo)','Level 3'],['B. (demo)','Level 2']]},
 apps:{t:'Download apps',rows:[['App Store (iPhone and iPad)','Coming soon'],['Play Store (Android)','Coming soon'],['Windows app','Coming soon']]},
 nets:{t:'Networks',rows:[['My study circles','3 (demo)'],['My trainer network','2 (demo)'],['My business network','1 (demo)'],['Find people by sector','Open']]},
 frames:{t:'Frameworks',rows:[['Learn: levels L1 to L7','How you grow'],['Earn: side income to business','How you earn'],['Author: idea, draft, review, publish','How you write'],['Train: plan, teach, review','How you teach'],['Phygital: physical, hybrid, digital','How you deliver']]},
 gallery:{t:'Project gallery',rows:[['Demo: Solar lamp for a village school','Shared by A.'],['Demo: Mobile repair stall plan','Shared by B.'],['Demo: Study timetable app','Shared by C.']]},
 impact:{t:'Impact and gratitude',rows:[['Thank you note: A. helped B. finish Level 1','Today'],['Group learning hour: 40 minutes given (demo)','This week'],['Say thank you to someone','Open']]},
 posts:{t:'My posts',rows:[['Welcome post (demo)','2 likes'],['My first project update','Draft']]},
 feed:{t:'AI feed',rows:[['Today: 3 new ways to earn from your phone (demo)','For you'],['New free class added','Learn'],['A helper tip: speak your goal','Tip']]},
 assistant:{t:'Go to assistant',rows:[['Ask by voice or type','Demo only'],['Ask about my courses','Demo only'],['Plan my week','Demo only']]},
 mycerts:{t:'My certificates',rows:[['Welcome Badge (demo)','Earned'],['Level 1 Certificate','Opens after Level 1']]},
 mylearn:{t:'My learnings',rows:[['Electrical Basics: Level 1','3 of 9 done'],['Free voice class','Done']]},
 bug:{t:'Report a problem',rows:[['Tell us what went wrong','Opens a short form (demo)']]}
};
var ADMIN=0.20;
var AGENT_CATS={Recruitment:['Resume checker','Job matcher','Interview coach','Offer letter helper','Candidate screener','Reference check helper','Career road planner','Skill gap finder','Hiring tracker'],
 Finance:['Budget helper','Invoice writer','Expense sorter','Tax date reminder','Pricing helper','Cash flow viewer','Savings planner','Payment chaser','Report maker'],
 Content:['Post writer','Course outliner','Quiz maker','Translator','Script writer','Image caption helper','Newsletter drafter','Lesson summariser','Story helper'],
 Productivity:['Day planner','Meeting notes taker','Task sorter','Email drafter','Reminder helper','File finder','Habit tracker','Focus timer','Weekly review'],
 Health:['Study break coach','Sleep reminder','Posture reminder','Stress check-in','Water reminder','Walk reminder','Eye rest timer','Mood journal']};
var SKILL_CATS={Learning:['Note taking','Memory methods','Speed reading','Exam planning','Teach back method','Mind maps','Revision cycles'],
 Technology:['Phone basics','Spreadsheets','Safe browsing','Simple websites','Data basics','Using AI helpers','Cloud files'],
 Business:['Pricing a service','Talking to customers','Simple accounts','Selling online','Making an offer','Time and money plans','Local marketing'],
 Communication:['Clear emails','Public speaking','Listening well','Negotiation basics','Writing a short story','Group work','Giving feedback','Writing a report'],
 Careers:['CV writing','Interview practice','Networking','Choosing a sector','Freelancing basics','Remote work habits'],
 Life:['Saving habits','Health routines','Time balance','Digital safety','Teaching your family','Helping your community']};
function bankRows(cats){var r=[];Object.keys(cats).forEach(function(c){cats[c].forEach(function(n){r.push([n,c])})});return r}
var VARK={V:['Visual','See pictures, charts and short videos.'],A:['Aural','Listen and speak. Voice first.'],R:['Read and write','Read notes and type answers.'],K:['Hands-on','Learn by doing, step by step.']};
var VOICE_MAP=[['free','free'],['earn','paths'],['income','paths'],['money','paths'],['course','lms'],['learn','lms'],['class','live'],['job','jobs'],['career','careers'],['sell','market'],['teach','tms'],['write','ams'],['pay','payg'],['help','support'],['device','devices']];
var MODES={
 physical:{t:'Physical',d:'In a room, with people. Classroom, lab, workshop and site visits.',items:['Demo Workshop: Hands-on Wiring','Demo Lab Day','Demo Site Visit']},
 hybrid:{t:'Hybrid',d:'Some in the room, some on screen. Join from wherever you are.',items:['Demo Hybrid Class: Safety Basics','Demo Study Circle','Demo Open Day']},
 digital:{t:'Digital',d:'Fully online. Videos, live classes, quizzes and tools.',items:['Demo Course: Electrical Basics','Demo Live Class (online)','Demo Quiz Pack']}
};
var LEVELS=[
 ['L1','Starter','Open now'],['L2','Practitioner','Finish L1 to open'],['L3','Skilled','Finish L2 to open'],
 ['L4','Advanced','Finish L3 to open'],['L5','Specialist','Finish L4 to open'],['L6','Expert','Finish L5 to open'],['L7','Leader','Finish L6 to open']];
var NEXT=new Date(Date.now()+5*24*3600*1000);
var state={space:'learn',view:'home',mode:'digital',banner:0};

function $(s,r){return (r||document).querySelector(s)}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function greet(){var h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function days(){return Math.max(0,Math.ceil((NEXT-Date.now())/86400000))}

// ---- Side menu ----
function renderSide(){
 var s=$('#side');s.innerHTML='';
 s.appendChild(el('div','logo','HFL <span>Member</span>'));
 var q=el('input','search');q.placeholder='Search menu…';q.setAttribute('aria-label','Search menu');s.appendChild(q);
 var sp=SPACES.filter(function(x){return x.k===state.space})[0];
 var chip=el('button','chip','<small>Current space</small><b>'+esc(sp.n)+' ▾</b>');chip.type='button';s.appendChild(chip);
 var pl=el('div','plist');SPACES.forEach(function(x){
  var b=el('button',null,esc(x.n)+' <small>('+x.s+')</small>');b.type='button';
  b.onclick=function(){setSpace(x.k)};pl.appendChild(b)});
 s.appendChild(pl);chip.onclick=function(){pl.classList.toggle('open')};
 var wrap=el('div');s.appendChild(wrap);
 function draw(filter){wrap.innerHTML='';MENU.forEach(function(g){
  if(!filter&&!state.allMenu&&GRP_SP[g.g]&&GRP_SP[g.g].indexOf(state.space)<0)return;
  var items=g.items.filter(function(i){return !filter||i[2].toLowerCase().indexOf(filter)>-1});
  if(!items.length)return;wrap.appendChild(el('div','grp',esc(g.g)));
  items.forEach(function(i){
   var b=el('button','item'+(state.view===i[0]?' on':''),'<span class="ic">'+i[1]+'</span><span>'+esc(i[2])+'</span>'+(i[3]?'<span class="badge">'+i[3]+'</span>':''));
   b.type='button';b.dataset.v=i[0];b.onclick=function(){go(i[0])};wrap.appendChild(b)})})}
 draw('');
 var more=el('button','item',state.allMenu?'<span class="ic">➖</span><span>Show fewer menus</span>':'<span class="ic">➕</span><span>More menus</span>');more.type='button';more.onclick=function(){state.allMenu=!state.allMenu;renderSide()};s.appendChild(more);
 q.oninput=function(){draw(q.value.trim().toLowerCase())};
}
function setSpace(k){$('#side').classList.remove('open');state.space=k;state.view='home';renderSide();renderMain();renderTabs();window.scrollTo(0,0)}
function renderTabs(){
 var sp=curSpace();var t=$('#tabs');if(!t)return;
 var tabs=[['home','🏠','Home'],[sp.tab[2],sp.tab[1],sp.tab[0]],['feed','✨','Sixth sense'],['tools','🧰','Tools'],['community','👥','Community']];
 t.innerHTML='';tabs.forEach(function(x){var b=el('button','tab'+(state.view===x[0]?' on':''),'<span>'+x[1]+'</span><small>'+esc(x[2])+'</small>');b.type='button';b.onclick=function(){go(x[0])};t.appendChild(b)});
}
function go(v){
 if(v==='out'){if(window.HFLAuth.live){window.HFLAuth.signOut()}else{alert('Demo mode: you would be logged out here.')}return}
 if(v==='careers'){state.view='careers';renderSide();renderMain();return}
 state.filter='all';state.bank='All';state.view=v;$('#side').classList.remove('open');renderSide();renderMain();renderTabs();$('#main').focus();window.scrollTo(0,0);
}

// ---- Main views ----
function banners(){
 var items=[];
 if(!MEMBER.emailOk)items.push(['✉️','Your email is not verified. Please verify it to open all features.','Verify email','email']);
 if(!MEMBER.phoneOk)items.push(['📱','Add your phone for class reminders. You can skip this.','Add phone','phone']);
 if(!items.length)return '';
 if(state.banner>=items.length)state.banner=0;
 var h='<div class="banners">';
 items.forEach(function(b,i){h+='<div class="banner'+(i===state.banner?' on':'')+'"><span>'+b[0]+' '+esc(b[1])+'</span><button class="btn o" data-fix="'+b[3]+'">'+esc(b[2])+'</button></div>'});
 h+='</div>';
 if(items.length>1){h+='<div class="dots">';items.forEach(function(_,i){h+='<i class="'+(i===state.banner?'on':'')+'" data-dot="'+i+'" role="button" aria-label="Show task '+(i+1)+'"></i>'});h+='</div>'}
 else h+='<div style="height:16px"></div>';
 return h;
}
function homeView(){
 var sp=curSpace();var u=sp.up,p=sp.prep;
 var h='<div class="hello"><span class="av">'+esc(MEMBER.name.charAt(0))+'</span><div><small>'+greet()+'</small><h1>'+esc(MEMBER.name)+'</h1></div></div><p class="sub">'+esc(sp.note)+'</p>'+banners();
 h+='<div class="card sense"><div class="eyebrow">✨ YOUR SIXTH SENSE</div><p><b>'+esc(sp.sense)+'</b></p>'
  +'<p class="small">Shatjalan guides you before you ask: by what you see, think, feel and do. It is more than six networks. It is a sixth sense for your day.</p>'
  +'<div class="modes" style="margin:8px 0 0">';
 [['1','1D · Text and voice'],['2','2D · Pictures and screens'],['3','3D · Immersive (preview)']].forEach(function(d){h+='<button class="mode'+((state.dim||'1')===d[0]?' on':'')+'" data-dim="'+d[0]+'">'+d[1]+'</button>'});
 h+='</div>'+({1:'<p class="small">Showing: simple words and voice.</p>',2:'<p class="small">Showing: pictures, charts and short videos.</p>',3:'<p class="small">3D, AR and VR views are a preview here. They come later with the apps.</p>'}[state.dim||'1'])+'</div>';
 h+=voiceBar()+'<div class="grid2"><div class="card"><div class="eyebrow">'+esc(u[0])+'</div><h2>'+esc(u[1])+'</h2>'
  +'<div class="meta">'+u[2].map(function(m){return '<span>'+esc(m)+'</span>'}).join('')+'</div>'
  +'<button class="btn" data-v="'+u[4]+'">'+esc(u[3])+'</button><div class="count">starts in '+days()+' days</div>'
  +'<button class="link" data-v="cal">View full schedule →</button></div>'
  +'<div class="card"><div class="eyebrow">'+esc(p[0])+'</div><h2>'+esc(p[1])+'</h2><ul class="ck">'+p[2].map(function(i){return '<li>'+esc(i)+'</li>'}).join('')+'</ul>'
  +'<div class="note">'+esc(p[3])+'</div></div></div>';
 h+='<h3 class="sec">To do</h3><div class="todo">'+sp.todo.map(function(t){return '<div class="card" data-v="'+t[2]+'" role="button" tabindex="0"><div><b>'+esc(t[0])+'</b><small>'+esc(t[1])+'</small></div><span class="arrow">→</span></div>'}).join('')+'</div>';
 h+='<h3 class="sec">Phygital: choose how you learn and work</h3><div class="modes">';
 Object.keys(MODES).forEach(function(k){h+='<button class="mode'+(state.mode===k?' on':'')+'" data-mode="'+k+'">'+MODES[k].t+'</button>'});
 var m=MODES[state.mode];
 h+='</div><div class="card"><b>'+m.t+'</b><p class="small">'+esc(m.d)+'</p><div class="list">'+m.items.map(function(i){return '<div><span>'+esc(i)+'</span><span class="tag">'+m.t+'</span></div>'}).join('')+'</div></div>';
 h+='<h3 class="sec">All seven spaces</h3><div class="tiles">'+SPACES.map(function(x){return '<button class="tile" data-space="'+x.k+'" type="button"><span class="t">'+x.tab[1]+'</span><b>'+esc(x.n)+'</b><small>'+esc(x.s)+'</small></button>'}).join('')+'</div>';
 h+='<h3 class="sec">Your journey <a data-v="lms">Jump to roadmap →</a></h3><div class="path">';
 LEVELS.forEach(function(l,i){h+='<div class="lvl'+(i?' lock':' cur')+'"><span class="n">'+(i?'🔒':l[0])+'</span><b>'+l[0]+' · '+l[1]+'</b><small>'+l[2]+'</small></div>'});
 return h+'</div>';
}
function voiceBar(){
 var v=state.vark||'A';
 var h='<div class="card" style="margin-bottom:20px"><div class="eyebrow">SPEAK OR TYPE</div><div style="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap">'
  +'<button class="btn g" id="mic" type="button" aria-label="Speak">🎤 Speak</button>'
  +'<input id="say" placeholder="Say or type what you want, e.g. free classes, earn money" aria-label="Say or type what you want" style="flex:1;min-width:200px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;font:inherit">'
  +'<button class="btn" id="go" type="button">Go</button></div><p class="small" id="voicemsg">No computer skills needed. Say it, we take you there.</p>'
  +'<div class="eyebrow" style="margin-top:8px">HOW DO YOU LEARN BEST?</div><div class="modes" style="margin-top:8px">';
 Object.keys(VARK).forEach(function(k){h+='<button class="mode'+(v===k?' on':'')+'" data-vark="'+k+'" title="'+esc(VARK[k][1])+'">'+VARK[k][0]+'</button>'});
 return h+'</div><p class="small">'+esc(VARK[v][1])+' Your home adapts to this.</p></div>';
}
function voiceGo(t){t=(t||'').toLowerCase();var hit=VOICE_MAP.filter(function(m){return t.indexOf(m[0])>-1})[0];
 if(hit){go(hit[1])}else{var m=$('#voicemsg');if(m)m.textContent='Sorry, I did not catch that. Try: free classes, earn money, find a job.'}}
function tile(v,i,t,s){return '<button class="tile" data-v="'+v+'" type="button"><span class="t">'+i+'</span><b>'+t+'</b><small>'+s+'</small></button>'}
var MODEKEYS=['physical','hybrid','digital'];
var DELIVERY={lms:1,live:1,cert:1,ems:1,market:1,work:1,ams:1,tms:1,tools:1,kit:1,cal:1,coach:1,nets:1,community:1,jobs:1,offers:1};
function listView(v){
 if(v==='profile')SYSTEMS.profile.rows=[['Name',MEMBER.name],['Email',MEMBER.email||'demo@example.invalid'],['Member ID',MEMBER.id],['Language','English (change anytime)']];
 var d=SYSTEMS[v];
 if(!d)return '<h1>'+esc(v)+'</h1>';
 var tabs='';var rows=d.rows;
 if(DELIVERY[v]){var f=state.filter||'all';
  tabs='<div class="modes">'+['all'].concat(MODEKEYS).map(function(k){return '<button class="mode'+(f===k?' on':'')+'" data-filter="'+k+'">'+(k==='all'?'All':MODES[k].t)+'</button>'}).join('')+'</div>';
  rows=rows.map(function(r,i){return r.concat([MODEKEYS[i%3]])}).filter(function(r){return f==='all'||r[2]===f});}
 return '<div class="panel"><h1>'+esc(d.t)+'</h1><p class="sub">Demo data. Real items arrive when this is connected.</p>'+(v==='tools'?'<p><a class="btn" id="openTools" href="tools/index.html">Open the Tools page (6 working tools)</a></p>':'')+tabs+'<div class="list">'
  +rows.map(function(r){return '<div><span>'+esc(r[0])+(r[2]?' <span class="tag">'+MODES[r[2]].t+'</span>':'')+'</span><span class="tag">'+esc(r[1])+'</span></div>'}).join('')+(rows.length?'':'<div>Nothing here yet in this mode.</div>')+'</div><p><button class="btn o" data-v="home">← Back to home</button></p></div>';
}
function devicesView(){
 var h='<div class="panel"><h1>Devices and sign-in</h1><p class="sub">Demo. Your devices stay in step, and you approve a new one with one tap. No codes to type.</p>';
 h+='<div class="card"><b>Passkey</b><p class="small">Status: '+(state.passkey?'On. Sign in with your face, finger or screen lock.':'Not set up yet.')+'</p>'
  +'<button class="btn g" data-pk="1">'+(state.passkey?'Passkey is on ✓':'Set up passkey')+'</button></div><h3 class="sec">Trusted devices</h3><div class="list">';
 DEVICES.forEach(function(d){h+='<div><span>'+d[0]+' '+esc(d[1])+'</span><span class="tag">'+esc(d[2])+'</span></div>'});
 h+='</div>';
 if(!state.approved){h+='<h3 class="sec">New sign-in waiting</h3><div class="card"><b>Demo Tablet (Android) wants to sign in</b><p class="small">Is this you? Tap to approve on this trusted device.</p><button class="btn g" data-ap="1">Approve</button> <button class="btn o" data-ap="0">Not me</button></div>'}
 else h+='<p class="note">'+esc(state.approved)+'</p>';
 return h+'<p><button class="btn o" data-v="home">← Back to home</button></p></div>';
}
var DEVICES=[['📱','Demo Phone (Apple)','This device'],['💻','Demo Laptop (Windows)','Trusted'],['📲','Demo Tablet (Android)','Not yet trusted']];
function bankView(v){
 var cats=v==='agents'?AGENT_CATS:SKILL_CATS;var all=bankRows(cats);var f=state.bank||'All';
 var rows=all.filter(function(r){return f==='All'||r[1]===f});
 var tabs='<div class="modes">'+['All'].concat(Object.keys(cats)).map(function(k){return '<button class="mode'+(f===k?' on':'')+'" data-bank="'+k+'">'+k+'</button>'}).join('')+'</div>';
 return '<div class="panel"><h1>'+(v==='agents'?'Agent bank':'Skills library')+' <small style="font-size:14px;color:var(--mute)">('+all.length+')</small></h1><p class="sub">Demo list. '+(v==='agents'?'Helpers that do small jobs for you.':'Short skills sorted by topic.')+' Showing '+rows.length+'.</p>'+tabs
  +'<div class="list">'+rows.map(function(r){return '<div><span>'+esc(r[0])+'</span><span class="tag">'+esc(r[1])+'</span></div>'}).join('')+'</div><p><button class="btn o" data-v="home">← Back to home</button></p></div>';
}
function paygView(){
 var amt=state.payAmt==null?1000:state.payAmt;var fee=Math.round(amt*ADMIN*100)/100;
 return '<div class="panel"><h1>Pay as you go</h1><p class="sub">You pay only for what you use. We add a 20% admin charge on top, to pay our taxes and keep the ecosystem running. No monthly lock-in.</p>'
  +'<div class="card"><b>Try it (demo figures only)</b><p><input id="amt" type="number" min="0" value="'+amt+'" style="padding:8px;border:1px solid var(--line);border-radius:8px;font:inherit;width:140px" aria-label="Demo amount"> demo units</p>'
  +'<div class="list"><div><span>Your item</span><span>'+amt+'</span></div><div><span>Admin charge (20%)</span><span>'+fee+'</span></div><div><b>Total</b><b>'+(amt+fee)+'</b></div></div>'
  +'<p class="small">These are sample numbers. Real prices are shown to you only when you pick a real item.</p></div><p><button class="btn o" data-v="home">← Back to home</button></p></div>';
}
var PATH_TXT=null;
function savedPath(){
 var id=new URLSearchParams(location.search).get('path');
 try{var u=window.HFLAuth&&window.HFLAuth.user;if(!id&&u&&u.user_metadata)id=u.user_metadata.career_path;if(!id)id=localStorage.getItem('hfl.careerPath')}catch(e){}
 return id||null;
}
function resolvePath(id){
 if(PATH_TXT||!id)return;
 fetch('../career-tree/tree.json').then(function(r){return r.json()}).then(function(T){
  var p=id.split('.'),sec=null,sub=null,sp=null;
  T.groups.forEach(function(g){g.sectors.forEach(function(s){if(s.code===p[0]){sec=s;s.subs.forEach(function(b){if(b.code===p[1]){sub=b;b.specs.forEach(function(x){if(x.code===p[2])sp=x})}})}})});
  var L=T.ladder.filter(function(l){return l.tier===p[3]})[0];
  if(sec&&sub&&sp&&L){PATH_TXT={now:L.title.replace('{s}',sp.name.toLowerCase()).replace('{S}',sp.name),sector:sec.name,area:sub.name,b:T.ladder[3].title.replace('{s}',sp.name.toLowerCase()),courses:L.courses};
   if(state.view==='careers')renderMain()}
 }).catch(function(){});
}
function careersView(){
 var id=savedPath();resolvePath(id);var mine='';
 if(PATH_TXT)mine='<div class="card"><b>Your path</b><p>Point A: '+esc(PATH_TXT.now)+'</p><p>Point B: '+esc(PATH_TXT.b)+'</p><p class="small">'+esc(PATH_TXT.sector)+' › '+esc(PATH_TXT.area)+' · '+esc(PATH_TXT.courses)+'</p><a class="btn o" href="../career-tree/index.html">See the full road</a></div>';
 return '<div class="panel"><h1>Career portal</h1><p class="sub">Pick a sector, then an area, a speciality and a role. See the road from where you are (point A) to where you want to be (point B).</p>'+mine
  +'<div class="card"><p><b>50 sectors · 1200 roles</b></p><p class="small">Choose your sector, area, speciality and where you are now. You see your road and who decides what.</p>'
  +'<a class="btn" href="../career-tree/index.html">'+(PATH_TXT?'Change my path':'Open career tree')+'</a></div><p><button class="btn o" data-v="home">← Back to home</button></p></div>';
}
function phygitalView(){
 var h='<div class="panel"><h1>Phygital</h1><p class="sub">Physical + hybrid + digital, in one place.</p><div class="tiles" style="grid-template-columns:repeat(3,1fr)">';
 Object.keys(MODES).forEach(function(k){h+='<div class="card"><h2>'+MODES[k].t+'</h2><p class="small">'+esc(MODES[k].d)+'</p></div>'});
 return h+'</div><p><button class="btn o" data-v="home">← Back to home</button></p></div>';
}
function renderMain(){
 var c=$('#content');
 var h=state.view==='home'?homeView():state.view==='careers'?careersView():state.view==='phygital'?phygitalView():state.view==='devices'?devicesView():state.view==='payg'?paygView():(state.view==='agents'||state.view==='skills')?bankView(state.view):listView(state.view);
 c.innerHTML=h;
 c.querySelectorAll('[data-v]').forEach(function(n){
  n.addEventListener('click',function(e){e.preventDefault();go(n.dataset.v)});
  n.addEventListener('keydown',function(e){if(e.key==='Enter'){go(n.dataset.v)}})});
 c.querySelectorAll('[data-mode]').forEach(function(n){n.onclick=function(){state.mode=n.dataset.mode;renderMain()}});
 c.querySelectorAll('[data-filter]').forEach(function(n){n.onclick=function(){state.filter=n.dataset.filter;renderMain()}});
 c.querySelectorAll('[data-vark]').forEach(function(n){n.onclick=function(){state.vark=n.dataset.vark;renderMain()}});
 var gb=$('#go',c);if(gb){gb.onclick=function(){voiceGo($('#say',c).value)};$('#say',c).onkeydown=function(e){if(e.key==='Enter')voiceGo(this.value)};
  $('#mic',c).onclick=function(){var SR=window.SpeechRecognition||window.webkitSpeechRecognition;var m=$('#voicemsg',c);
   if(!SR){m.textContent='Voice is not available in this browser. Please type instead.';return}
   var r=new SR();r.lang='en-IN';r.onresult=function(e){var t=e.results[0][0].transcript;$('#say',c).value=t;voiceGo(t)};r.onerror=function(){m.textContent='Could not hear you. Please type instead.'};m.textContent='Listening…';r.start()}}
 var am=$('#amt',c);if(am){am.oninput=function(){state.payAmt=Math.max(0,+am.value||0);var pos=am.selectionStart;renderMain();var n=$('#amt');n.focus()}}
 c.querySelectorAll('[data-dim]').forEach(function(n){n.onclick=function(){state.dim=n.dataset.dim;renderMain()}});
 c.querySelectorAll('[data-space]').forEach(function(n){n.onclick=function(){setSpace(n.dataset.space)}});
 c.querySelectorAll('[data-bank]').forEach(function(n){n.onclick=function(){state.bank=n.dataset.bank;renderMain()}});
 c.querySelectorAll('[data-pk]').forEach(function(n){n.onclick=function(){state.passkey=true;renderMain()}});
 c.querySelectorAll('[data-ap]').forEach(function(n){n.onclick=function(){state.approved=n.dataset.ap==='1'?'Approved. Demo Tablet is now trusted and stays in step.':'Blocked. We will ask you to change your password (demo).';if(n.dataset.ap==='1')DEVICES[2][2]='Trusted';renderMain()}});
 c.querySelectorAll('[data-dot]').forEach(function(n){n.onclick=function(){state.banner=+n.dataset.dot;renderMain()}});
 c.querySelectorAll('[data-fix]').forEach(function(n){n.onclick=function(){
  if(n.dataset.fix==='email')MEMBER.emailOk=true;else MEMBER.phoneOk=true;state.banner=0;renderMain()}});
 c.querySelectorAll('[data-act=prereq]').forEach(function(n){n.onclick=function(){alert('Demo checklist:\n1. Check sound and internet\n2. Keep a notebook\n3. Join 5 minutes early')}});
}

// ---- Help bubble ----
var hb=$('#helpbox');
$('#help').onclick=function(){hb.hidden=!hb.hidden};
hb.addEventListener('click',function(e){var a=e.target.dataset&&e.target.dataset.h;if(!a)return;
 if(a==='close'){hb.hidden=true}
 else $('#helpmsg').textContent=a==='ai'?'Demo: the HFL helper would open here.':'Demo: a person would reply to you here.'});
$('#menuBtn').onclick=function(e){e.stopPropagation();$('#side').classList.toggle('open')};
document.addEventListener('click',function(e){var sd=$('#side');if(sd.classList.contains('open')&&!sd.contains(e.target)){sd.classList.remove('open')}});

// ---- Start: show grey shapes, then fill in ----
$('#bell').onclick=function(){go('notes')};
function start(user){
 if(user){MEMBER.name=window.HFLAuth.nameOf(user);MEMBER.id='Signed in';MEMBER.emailOk=!!user.email_confirmed_at||!!user.confirmed_at;MEMBER.email=user.email}
 $('#gate').hidden=true;$('#skeleton').hidden=false;$('#content').hidden=true;
 renderSide();renderTabs();
 setTimeout(function(){renderMain();$('#skeleton').hidden=true;$('#content').hidden=false},user?200:700);
}
window.HFLAuth.gate(start);
})();
