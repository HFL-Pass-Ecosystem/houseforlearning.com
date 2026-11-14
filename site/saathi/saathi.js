
(function(){
  const $=s=>document.querySelector(s);
  const screen=$('#screen'), tabsEl=$('#tabs'), toastEl=$('#toast');
  let lite=true, L=0, tab='chats', openChat=null, qDone=false;
  const LN=[['EN','English'],['हिं','हिंदी'],['SW','Kiswahili'],['PT','Português']];
  const T={
    chats:['Chats','चैट','Mazungumzo','Conversas'], learn:['Learn','सीखें','Jifunze','Aprender'], alerts:['Alerts','सूचना','Arifa','Alertas'], watch:['Watch','देखें','Tazama','Assistir'], explore:['Explore','खोजें','Gundua','Explorar'],
    search:['Search chats, alerts, questions','चैट, सूचना, प्रश्न खोजें','Tafuta mazungumzo, arifa, maswali','Buscar conversas, alertas, questões'], today:["Today's plan","आज की योजना","Mpango wa leo","Plano de hoje"],
    pinned:['Pinned','पिन किए गए','Zilizobandikwa','Fixadas'], recent:['Recent','हाल के','Za hivi karibuni','Recentes'], msg:['Type a doubt or message','अपना प्रश्न या संदेश लिखें','Andika swali au ujumbe','Escreva uma dúvida ou mensagem']
  };
  const t=k=>T[k][L];
  const ICON={
    chats:'<path d="M4 5h16v11H9l-5 4z"/>',
    learn:'<path d="M3 8l9-4 9 4-9 4z"/><path d="M7 10v5c3 2 7 2 10 0v-5"/>',
    alerts:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20h4"/>',
    watch:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 9l5 3-5 3z"/>',
    explore:'<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/>'
  };

  const chats=[
    {id:'tutor',n:'AI Doubt Tutor',c:'#0d6670',i:'AI',tag:'AI',last:'Step 2: 12% of 450 = 54',w:'07:41',u:0,sub:'Answers from the HFL question bank · experts check flagged ones'},
    {id:'circle',n:'SSC 2027 Study Circle',c:'#7a4fa0',i:'SC',last:'@quant_rider: who is doing the 8pm mock?',w:'07:30',u:4,sub:'18 members · encrypted'},
    {id:'jobs',n:'Rajasthan Job Alerts',c:'#b4610b',i:'RJ',tag:'Channel',last:'Patwari exam: last date 28 Nov',w:'06:55',u:2,sub:'Channel · 1.2 lakh subscribers'},
    {id:'daily',n:'HFL Daily',c:'#e08a1e',i:'HD',tag:'Channel',last:"Today's 3 solved questions are up",w:'06:00',u:1,sub:'Engagement team · daily drop'},
    {id:'room',n:'Quant live doubt room',c:'#2f7d4a',i:'LR',last:'Facilitator: room opens at 7 pm',w:'Yest',u:0,sub:'Facilitator-led · audio first'},
    {id:'mentor',n:'Career mentor desk',c:'#3b5b7a',i:'CM',last:'Your eligibility report is ready',w:'Mon',u:0,sub:'HFL staff · replies within 24 h'}
  ];
  const threads={
    tutor:[
      {me:1,x:'A shop gives 12% discount on a price of ₹450. What is the selling price?',w:'07:40'},
      {me:0,x:'Here is the method.<div class="step">Step 1: discount = 12% × 450<br>Step 2: 0.12 × 450 = 54<br>Step 3: 450 − 54 = ₹396</div>Answer: <b>₹396</b>. Source: HFL Quant bank, Percentages Q-118.',w:'07:41',rev:1}
    ],
    circle:[{me:0,x:'@quant_rider: who is doing the 8pm mock?',w:'07:30'},{me:0,x:'@neet_dreamer: me, after dinner',w:'07:31'}],
    jobs:[{me:0,x:'<b>Patwari Direct Recruitment</b><br>Posts: 2,020 · Graduate · Age 18–40<br>Last date: 28 Nov',w:'06:55'}],
    daily:[{me:0,x:"Today's 3 solved questions are up in Watch. Streak bonus for finishing all three by 9 pm.",w:'06:00'}],
    room:[{me:0,x:'Facilitator: room opens at 7 pm. Send doubts here first and I will take the most common ones.',w:'Yest'}],
    mentor:[{me:0,x:'Your eligibility report is ready. You qualify for 6 of the 9 exams you follow.',w:'Mon'}]
  };
  const alerts=[
    {s:'Rajasthan',q:'Graduate',n:'Patwari Direct Recruitment',posts:'2,020',age:'18–40',last:'28 Nov',ok:true},
    {s:'Central',q:'12th pass',n:'Staff Selection: Constable (GD)',posts:'39,481',age:'18–23',last:'31 Oct',ok:false},
    {s:'Uttar Pradesh',q:'Graduate',n:'UP Lekhpal',posts:'7,994',age:'18–40',last:'5 Dec',ok:true},
    {s:'Central',q:'Graduate',n:'Banking: Probationary Officer',posts:'4,455',age:'20–30',last:'21 Nov',ok:true}
  ];
  const vids=[
    {eq:'450 × 0.88\n= 396',h:'Discount in one line: the 0.88 trick',sub:'Quant · Percentages',d:58,lite:1.2,hd:6.8},
    {eq:'A:B = 3:5\nB:C = 2:7',h:'Chain ratios without fractions',sub:'Quant · Ratio',d:72,lite:1.4,hd:8.1},
    {eq:'Art. 21\n→ life',h:'Article 21 in 60 seconds',sub:'Polity',d:61,lite:1.2,hd:7.0}
  ];
  const tiles=[
    ['GE','Govt exams','Live','#0d6670'],['IT','IT & Digital','Live','#3b5b7a'],['MB','EMBA','Phase 2','#7a4fa0'],
    ['CS','Creation Studio','Phase 2','#e08a1e'],['LB','Open Library','Phase 2','#2f7d4a'],['QZ','Quizzes','Phase 2','#b4610b'],
    ['NW','News','Phase 3','#566a70'],['TV','Shows','Phase 3','#566a70'],['WL','Wallet','Live','#0d6670'],
    ['EN','Enterprise','Phase 2','#3b5b7a'],['CM','Communities','Phase 2','#7a4fa0'],['PR','Your rights','Live','#2f7d4a']
  ];

  function toast(m){toastEl.textContent=m;toastEl.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.hidden=true,2200)}
  function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

  function renderTabs(){
    tabsEl.innerHTML=['chats','learn','alerts','watch','explore'].map(k=>
      `<button role="tab" aria-selected="${k===tab}" data-t="${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>${t(k)}</button>`).join('');
  }
  tabsEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.t;openChat=null;render()});

  function vChats(){
    const row=c=>`<button class="row" data-c="${c.id}"><div class="av" style="background:${c.c}">${c.i}</div><div class="meta"><div class="name">${c.n}${c.tag?` <span class="tag${c.tag==='Channel'?' m':''}">${c.tag}</span>`:''}</div><div class="last">${c.last}</div></div><div class="when">${c.w}${c.u?`<br><span class="badge">${c.u}</span>`:''}</div></button>`;
    return `<div class="search">${t('search')}</div><div class="section-l">${t('pinned')}</div>${chats.slice(0,2).map(row).join('')}<div class="section-l">${t('recent')}</div>${chats.slice(2).map(row).join('')}`;
  }
  function vChat(){
    return `<div class="chat" id="chatLog">${threads[openChat].map(m=>`<div class="bub ${m.me?'me':'them'}">${m.x}${m.rev?`<div class="review"><button data-rv="ok">Clear</button><button data-rv="exp">Ask an expert</button></div>`:''}<small>${m.w}${m.me?' ✓✓':''}</small></div>`).join('')}</div>`;
  }
  function vLearn(){
    const ring=(r,c,frac,off)=>`<circle r="${r}" cx="50" cy="50" fill="none" stroke="var(--sunk)" stroke-width="9"/><circle r="${r}" cx="50" cy="50" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*r*frac).toFixed(1)} 999" transform="rotate(-90 50 50)"/>`;
    const p=qDone?15:14;
    return `<div class="card"><div class="section-l" style="margin:0 0 8px">${t('today')} · 7-day streak</div><div class="plan">
      <svg width="96" height="96" viewBox="0 0 100 100" aria-label="Progress rings">${ring(42,'var(--peacock)',p/20)}${ring(30,'var(--marigold)',.5)}${ring(18,'var(--ink)',0)}</svg>
      <div class="legend"><div><span><i style="background:var(--peacock)"></i>Practice 70</span><span class="mono">${p}/20</span></div><div><span><i style="background:var(--marigold)"></i>Lessons 20</span><span class="mono">1/2</span></div><div><span><i style="background:var(--ink)"></i>Facilitator 10</span><span class="mono">7 pm</span></div></div></div></div>
      <div class="card"><div class="section-l" style="margin:0 0 4px">Practice · question ${p+ (qDone?0:1)} of 20</div><div style="font-size:.88rem">A train covers 360 km in 4 h 30 min. What is its average speed?</div>
      <div class="q-opts" id="qopts">${['72 km/h','80 km/h','84 km/h','90 km/h'].map((o,i)=>`<button data-o="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><div class="fb" id="qfb">Works offline. Answers sync when you are back online.</div></div>
      <div class="card task"><div class="ic" style="background:var(--marigold-soft);color:var(--warn)">20</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.86rem">Lesson: Time and distance basics</div><div class="bar"><b style="width:40%"></b></div></div><button class="btn ghost" data-go="watch">Play</button></div>
      <div class="card task"><div class="ic" style="background:var(--sunk)">10</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.86rem">Live doubt room · Quant</div><div style="font-size:.76rem;color:var(--muted)">Facilitator · 7:00 pm · audio first</div></div><button class="btn" data-remind="1">Remind</button></div>`;
  }
  let fil='All';
  function vAlerts(){
    const list=alerts.filter(a=>fil==='All'||a.s===fil||a.q===fil);
    return `<div class="filters">${['All','Central','Rajasthan','Uttar Pradesh','Graduate','12th pass'].map(f=>`<button aria-pressed="${f===fil}" data-f="${f}">${f}</button>`).join('')}</div>
    ${list.map(a=>`<div class="card alert"><div style="display:flex;justify-content:space-between;gap:6px"><span class="tag">${a.s}</span>${a.ok?'<span class="tag" style="background:color-mix(in srgb,var(--good) 18%,transparent);color:var(--good)">You are eligible</span>':'<span class="tag m">Check age</span>'}</div>
    <h4 style="margin-top:6px">${a.n}</h4><div class="facts"><span>Posts <b>${a.posts}</b></span><span>Age <b>${a.age}</b></span><span>Min. <b>${a.q}</b></span><span>Last date <b>${a.last}</b></span></div>
    <div class="acts"><button class="btn" data-remind="1">Remind me</button><button class="btn ghost" data-share="1">Share to circle</button></div></div>`).join('')}
    <div style="font-size:.74rem;color:var(--muted)">Sample listings for the prototype. Live alerts come from verified official notices.</div>`;
  }
  function vWatch(){
    return `<div class="card" style="font-size:.8rem">Playing at <b>${lite?'Lite (audio + slides, 144p)':'HD (480p)'}</b>. Toggle Lite at the top.<div class="devices"><span class="chip">Phone</span><span class="chip">Tablet</span><span class="chip">PC</span><span class="chip">TV cast</span></div></div>
    ${vids.map(v=>`<div class="vid"><div class="thumb"><span>▶ ${v.d}s</span><span class="eq">${v.eq.replace('\n','<br>')}</span><span>Solved</span></div><div><h4>${v.h}</h4><div class="facts">${v.sub}<br>${lite?v.lite:v.hd} MB at ${lite?'Lite':'HD'}</div><div style="display:flex;gap:6px;margin-top:8px"><button class="btn ghost" data-dl="1">Save offline</button><button class="btn ghost" data-share="1">Share</button></div></div></div>`).join('')}`;
  }
  function vExplore(){
    return `<div class="card" style="background:var(--peacock-soft);border-color:var(--peacock)"><div style="font-weight:600">You follow Govt exams</div><div style="font-size:.8rem;color:var(--muted)">Next step suggested for you: IT & Digital foundations, free for 14 days.</div></div>
    <div class="grid">${tiles.map(([i,n,p,c])=>`<button class="tile${p.startsWith('Phase 3')?' locked':''}" data-tile="${n}|${p}"><div class="ico" style="background:${c};color:#fff">${i}</div>${n}<span class="ph">${p}</span></button>`).join('')}</div>`;
  }

  function render(){
    renderTabs();
    $('#net').textContent=lite?'2G · Lite on':'4G · Lite off';
    const inChat=tab==='chats'&&openChat;
    $('#appbar').hidden=!!inChat; $('#backbar').hidden=!inChat; $('#compose').hidden=!inChat;
    $('#msgIn').placeholder=t('msg');
    if(inChat){const c=chats.find(x=>x.id===openChat);$('#chatTitle').textContent=c.n;$('#chatSub').textContent=c.sub;$('#chatAv').textContent=c.i;$('#chatAv').style.background=c.c;
      const ro=c.tag==='Channel';$('#compose').hidden=ro; screen.innerHTML=vChat()+(ro?'<div class="fb" style="text-align:center">Only admins post here. Reply in the linked discussion group.</div>':''); screen.scrollTop=screen.scrollHeight; return}
    screen.innerHTML={chats:vChats,learn:vLearn,alerts:vAlerts,watch:vWatch,explore:vExplore}[tab]();
    screen.scrollTop=0;
  }

  screen.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    if(b.dataset.c){openChat=b.dataset.c;const c=chats.find(x=>x.id===openChat);c.u=0;render();return}
    if(b.dataset.rv){toast(b.dataset.rv==='ok'?'Marked clear. Thanks.':'Sent to an expert. You will get a reply in this chat.');if(b.dataset.rv==='exp')addMsg(0,'An expert has picked up your question. Expected reply within 4 hours.');return}
    if(b.dataset.o!==undefined&&!qDone){const ok=b.dataset.o==='1';b.classList.add(ok?'right':'wrong');if(!ok)$('#qopts').children[1].classList.add('right');
      $('#qfb').textContent=(ok?'Correct. ':'Not quite. ')+'360 ÷ 4.5 = 80 km/h. Saved to your practice record.';qDone=true;setTimeout(()=>{if(tab==='learn'){const s=screen.scrollTop;render();screen.scrollTop=s;$('#qfb').textContent=(ok?'Correct. ':'Not quite. ')+'360 ÷ 4.5 = 80 km/h. Saved to your practice record.'}},900);return}
    if(b.dataset.go){tab=b.dataset.go;render();return}
    if(b.dataset.remind){toast('Reminder set. You will get a push and an SMS.');return}
    if(b.dataset.share){toast('Shared to SSC 2027 Study Circle');return}
    if(b.dataset.dl){toast(lite?'Saved: 1.2 MB. Plays without signal.':'Saved in HD. Switch on Lite to save data.');return}
    if(b.dataset.f){fil=b.dataset.f;render();return}
    if(b.dataset.tile){const [n,p]=b.dataset.tile.split('|');toast(n==='Your rights'?'Opens the HFL privacy and data rights page for your country, in your language':p==='Live'?`Opening ${n}`:`${n} opens in ${p}`);return}
  });

  function addMsg(me,x){const now=new Date();const w=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');threads[openChat].push({me,x,w});render()}
  $('#compose').addEventListener('submit',e=>{e.preventDefault();const v=$('#msgIn').value.trim();if(!v)return;$('#msgIn').value='';addMsg(1,esc(v));
    if(openChat==='tutor'){setTimeout(()=>{threads.tutor.push({me:0,x:'I could not find this in the HFL question bank with enough confidence, so I have sent it to an expert. You will get the checked answer here, and it will be added for every learner who asks the same thing.',w:'now',rev:0});if(openChat==='tutor')render()},700)}
    else if(openChat==='circle'){setTimeout(()=>{threads.circle.push({me:0,x:'@quant_rider: 👍 see you at 8',w:'now'});if(openChat==='circle')render()},700)}
  });
  $('#backBtn').addEventListener('click',()=>{openChat=null;render()});
  $('#liteBtn').addEventListener('click',e=>{lite=!lite;e.currentTarget.classList.toggle('on',lite);e.currentTarget.setAttribute('aria-pressed',lite);toast(lite?'Lite on: images on tap, audio-first video':'Lite off: full quality');render()});
  $('#langBtn').addEventListener('click',()=>{L=(L+1)%LN.length;$('#langBtn').textContent=LN[L][0]+' ▾';toast('Language: '+LN[L][1]+'. Lessons and voice doubts follow.');render()});

  // blueprint tabs
  const bpt=$('#bpTabs');
  bpt.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    bpt.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b));
    document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.p)});

  render();
})();

;
/* House for Learning: shared site bar and footer. Built by build_site.py; edit the site map there. */
(function(){
var MAP=[{"id": "start", "t": "Start learning", "p": [["programmes/first-lessons.html", "Free First Lessons"], ["programmes/diagnostic-test.html", "Common Core Diagnostic"], ["programmes/readiness-gateway.html", "Readiness and Gateway"], ["programmes/courses/entrepreneurship-essentials.html", "Entrepreneurship Essentials"], ["programmes/courses/yoga-foundations.html", "Yoga Foundations"], ["programmes/courses/how-to-design-a-digital-lesson.html", "How to Design a Digital Lesson"], ["programmes/builder-75.html", "Builder 75"]]}, {"id": "degrees", "t": "Degrees and credentials", "p": [["programmes/degree-pathways.html", "Degree Pathways"], ["programmes/pathway-ladders.html", "Pathway Ladders"], ["programmes/common-core-standard.html", "Common Core Standard"], ["programmes/emba-catalogue.html", "Online EMBA Catalogue"], ["programmes/stackable-credentials.html", "Stackable Credentials"], ["programmes/specialist-mba-atlas.html", "Specialist MBA Atlas"], ["programmes/global-recognition.html", "Global Recognition Kit"], ["programmes/it-education-track.html", "IT Track"]]}, {"id": "library", "t": "Library and learning tools", "p": [["library/index.html", "Open Executive Library"], ["../reference-intelligence/", "Reference Intelligence"], ["programmes/microlearning-catalogue.html", "Microlearning Catalogue"], ["programmes/chapter-learning-journey.html", "Chapter Learning Journey"], ["tools/attribution-studio.html", "Attribution Studio"], ["tools/creation-studio.html", "Creation Studio"], ["tools/ai-studio.html", "HFL AI Studio"]]}, {"id": "lms", "t": "Learning system", "p": [["lms/index.html", "HFL Learning Campus"], ["lms/teach.html", "HFL Faculty Desk"], ["lms/admin.html", "HFL Academic Office"]]}, {"id": "market", "t": "Marketplace", "p": [["marketplace/index.html", "HFL Marketplace"], ["marketplace/seller-desk.html", "Seller Desk"], ["marketplace/supplier-directory.html", "Supplier Directory"]]}, {"id": "platform", "t": "Platform", "p": [["login.html", "Sign in"], ["platform/home-portal.html", "HFL Home Portal"], ["platform/career-portal.html", "Career Portal"], ["platform/trainer-management.html", "HFL Lectern"], ["platform/ams.html", "Academic Records"], ["platform/ems.html", "HFL Earn Pro"], ["platform/workplace.html", "HFL Workplace"], ["platform/live-classroom-platform.html", "Live Classroom"], ["platform/learning-platform-blueprint.html", "Learning Platform Blueprint"], ["platform/data-rights.html", "Data Rights"], ["platform/member-ids.html", "Member IDs"]]}, {"id": "apps", "t": "Group apps", "p": [["saathi-app.html", "HFL Saathi"], ["hfl-nivesh-app.html", "HFL Nivesh"]]}, {"id": "governance", "t": "Strategy and governance", "p": [["strategy/outreach-model.html", "Outreach and Expansion Model"], ["platform/invite-and-coach.html", "Invite and Coach"], ["platform/hfl-pass-devices.html", "HFL Pass on All Devices"], ["platform/domain-tree.html", "Find Your Work"], ["governance/decisions-register.html", "Decisions Register"], ["governance/app-suite-plan.html", "100-App Suite and Browser Plan"], ["governance/govt-exam-prep-plan.html", "Government Exam Prep Plan"], ["governance/confidential-support.html", "HFL Aashray"], ["governance/brand-lines.html", "Brand Lines"], ["governance/ip-register.html", "IP Register"]]}],TAG="Education · Enterprise · Engagement";
var me=document.currentScript;var root=new URL('..',me.src);
var here=decodeURIComponent(location.href.split('#')[0].split('?')[0]).slice(decodeURIComponent(root.href).length);
var flat=[];MAP.forEach(function(s){s.p.forEach(function(p){flat.push({s:s,u:p[0],t:p[1]})})});
var cur=-1;flat.forEach(function(f,i){if(f.u===here)cur=i});
var C=cur>=0?flat[cur]:null;
var css=':host{all:initial;display:block;font:14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--bg:#fff;--fg:#18233a;--mu:#5b6578;--ru:#dde1e8;--ac:#22355e;--br:#94711f;color:var(--fg)}'+
'@media (prefers-color-scheme:dark){:host{--bg:#151b27;--fg:#e6e9f0;--mu:#9aa3b5;--ru:#2b3445;--ac:#8fa8e0;--br:#d6b25c}}'+
'*{box-sizing:border-box}a{color:inherit;text-decoration:none}a:hover{color:var(--ac)}a:focus-visible,button:focus-visible{outline:2px solid var(--ac);outline-offset:2px;border-radius:3px}'+
'.bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--bg);border-bottom:1px solid var(--ru);padding:8px max(16px,env(safe-area-inset-left,0px))}'+
'.mk{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:4px;background:var(--ac);color:var(--bg);font-weight:700;font-size:11px;letter-spacing:.04em}'+
'.home{display:flex;align-items:center;gap:8px;font-weight:600}.sep{color:var(--mu)}.sec{color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}'+
'button{font:inherit;color:inherit;background:transparent;border:1px solid var(--ru);border-radius:4px;padding:4px 10px;cursor:pointer}button:hover{border-color:var(--ac)}'+
'.panel{background:var(--bg);border-bottom:1px solid var(--ru);padding:14px max(16px,env(safe-area-inset-left,0px)) 18px;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px 24px}'+
'.panel[hidden]{display:none}.panel h4{margin:0 0 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--br)}.panel ul{list-style:none;margin:0;padding:0;display:grid;gap:4px}'+
'.panel a[aria-current]{color:var(--ac);font-weight:600}'+
'.foot{background:var(--bg);border-top:1px solid var(--ru);padding:14px max(16px,env(safe-area-inset-left,0px)) 22px;display:grid;gap:10px}'+
'.pn{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.pn a{display:grid;gap:2px;max-width:48%}.pn small{color:var(--mu);font-size:12px}.pn .nx{text-align:right;margin-left:auto}'+
'.tag{color:var(--mu);font-size:12.5px;display:flex;gap:6px 14px;flex-wrap:wrap}.tag b{color:var(--br);font-weight:600;letter-spacing:.02em}';
function el(t,a,txt){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;return e}
function href(u){return new URL(u,root).href}
// top bar
var top=el('div',{'data-hfl-site':'bar'});var sr=top.attachShadow({mode:'open'});sr.appendChild(el('style',null,css));
var bar=el('nav',{'class':'bar','aria-label':'House for Learning'});
var home=el('a',{'class':'home',href:href('index.html')});home.appendChild(el('span',{'class':'mk','aria-hidden':'true'},'HFL'));home.appendChild(el('span',null,'House for Learning'));bar.appendChild(home);
var sec=el('span',{'class':'sec'});if(C){sec.textContent='· '+C.s.t+' · '+C.t}bar.appendChild(sec);
var btn=el('button',{'aria-expanded':'false','aria-controls':'hfl-all'},'All pages');bar.appendChild(btn);sr.appendChild(bar);
var panel=el('div',{'class':'panel',id:'hfl-all',hidden:''});
MAP.forEach(function(s){var d=el('div');d.appendChild(el('h4',null,s.t));var ul=el('ul');s.p.forEach(function(p){var li=el('li');var a=el('a',{href:href(p[0])},p[1]);if(p[0]===here)a.setAttribute('aria-current','page');li.appendChild(a);ul.appendChild(li)});d.appendChild(ul);panel.appendChild(d)});
sr.appendChild(panel);
btn.addEventListener('click',function(){var o=panel.hidden;panel.hidden=!o;btn.setAttribute('aria-expanded',String(o))});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;btn.setAttribute('aria-expanded','false')}});
document.body.insertBefore(top,document.body.firstChild);
// footer
var ft=el('div',{'data-hfl-site':'footer'});var fr=ft.attachShadow({mode:'open'});fr.appendChild(el('style',null,css));
var f=el('footer',{'class':'foot'});
if(C){var pn=el('nav',{'class':'pn','aria-label':'Previous and next page'});
 function lk(i,cls,lab){var x=flat[(i+flat.length)%flat.length];var a=el('a',{href:href(x.u),'class':cls});a.appendChild(el('small',null,lab+' · '+x.s.t));a.appendChild(el('span',null,x.t));return a}
 pn.appendChild(lk(cur-1,'pv','Previous'));pn.appendChild(lk(cur+1,'nx','Next'));f.appendChild(pn)}
var tg=el('div',{'class':'tag'});tg.appendChild(el('b',null,TAG));tg.appendChild(el('span',null,'© 2026 House for Learning. All rights reserved.'));f.appendChild(tg);
fr.appendChild(f);document.body.appendChild(ft);
})();

/* HFL Warm Response · House for Learning
   Every time someone messages, submits, asks or types, the page answers at once:
   an emoji reaction, a "we're listening" cue, and a warm line in their language.
   Built into assets/hfl-site.js by website-ops/build_site.py. Opt out on any element
   with data-hfl-warm="off". API: HFLWarm.say(text, emoji), HFLWarm.react(el, emoji). */
(function(){
if (window.HFLWarm) return;
var TAG = 'Education · Enterprise · Engagement';
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- words ---------- */
var EN = {
  listen: "We're listening…",
  message: [['🙏',"We hear you. Thank you for telling us."],['❤️',"Your words reached us, and they matter here."],['🤝',"Thank you for speaking up. Every voice shapes this house."]],
  ask:     [['💡',"Good question. Asking is how learning starts."],['💡',"We're on it. Curious minds build this house."]],
  join:    [['🙌',"Welcome in. There is room for you under this roof."],['🌱',"You just took a real step. Small steps stack into big ones."],['🎉',"Done. Your journey with us has begun."]],
  submit:  [['✅',"Received with thanks. We'll take it from here."],['🙌',"Done. You just moved one step forward."],['🌱',"Got it. Every step you take here counts."]],
  save:    [['✅',"Saved. Your work is safe with us."],['📌',"Kept safe. Pick up whenever you're ready."]],
  learn:   [['🌱',"Lovely. Every lesson leads somewhere. Keep going."],['📖',"Let's learn. One small step today, a bigger you tomorrow."]],
  sign:    [['🔑',"Welcome back. We kept your place."],['🔑',"Your code is on its way. We're right here."]],
  pay:     [['🤝',"Thank you for your trust. We'll make it worth it."]],
  share:   [['✨',"Shared. Good things grow when they're passed on."]],
  like:    [['❤️',"Thank you. That warms our house."]],
  generic: [['✨',"Got it. Thank you."],['🙂',"Done. We're with you."]],
  nudge:   [['🤗',"Almost there. Just one small thing to fix, and you're through."],['💪',"Nearly done. Fix the note above and try again, we're right here."]],
  hello: function(h){return (h<5?"Still up? ":h<12?"Good morning. ":h<17?"Good afternoon. ":"Good evening. ")+"Welcome home to House for Learning."}
};
var L10N = {
  hi:{nudge:[['🤗',"बस थोड़ा सा बाकी है। ऊपर की बात ठीक करें, हम साथ हैं।"]],listen:"हम सुन रहे हैं…", message:[['🙏',"हम आपको सुन रहे हैं। बताने के लिए धन्यवाद।"]], generic:[['✨',"मिल गया। धन्यवाद।"]], submit:[['🙌',"मिल गया। आप एक कदम आगे बढ़ गए।"]], hello:"घर में आपका स्वागत है।"},
  mr:{listen:"आम्ही ऐकतोय…", message:[['🙏',"आम्ही तुमचं ऐकतोय. सांगितल्याबद्दल धन्यवाद."]], generic:[['✨',"मिळालं. धन्यवाद."]], submit:[['🙌',"मिळालं. तुम्ही एक पाऊल पुढे गेलात."]], hello:"घरी तुमचं स्वागत आहे."},
  gu:{listen:"અમે સાંભળીએ છીએ…", message:[['🙏',"અમે તમને સાંભળીએ છીએ. જણાવવા બદલ આભાર."]], generic:[['✨',"મળી ગયું. આભાર."]], submit:[['🙌',"મળી ગયું. તમે એક ડગલું આગળ વધ્યા."]], hello:"ઘરમાં તમારું સ્વાગત છે."},
  kn:{listen:"ನಾವು ಕೇಳುತ್ತಿದ್ದೇವೆ…", message:[['🙏',"ನಾವು ನಿಮ್ಮ ಮಾತು ಕೇಳುತ್ತಿದ್ದೇವೆ. ಧನ್ಯವಾದ."]], generic:[['✨',"ಸಿಕ್ಕಿತು. ಧನ್ಯವಾದ."]], submit:[['🙌',"ಸಿಕ್ಕಿತು. ನೀವು ಒಂದು ಹೆಜ್ಜೆ ಮುಂದೆ ಇಟ್ಟಿರಿ."]], hello:"ಮನೆಗೆ ಸ್ವಾಗತ."},
  ar:{listen:"نحن نستمع…", message:[['🙏',"نحن نسمعك. شكرًا لأنك أخبرتنا."]], generic:[['✨',"تم الاستلام. شكرًا لك."]], submit:[['🙌',"تم الاستلام. لقد خطوت خطوة إلى الأمام."]], hello:"أهلًا بك في بيتك."}
};
function lang(){var l=(document.documentElement.lang||'en').slice(0,2).toLowerCase();return L10N[l]?l:'en'}
function words(kind){var l=L10N[lang()];if(l){if(l[kind])return l[kind];if(kind!=='listen'&&kind!=='hello'&&kind!=='nudge')return l.submit&&/join|save|learn|pay/.test(kind)?l.submit:(l.message&&/ask|message/.test(kind)?l.message:l.generic)}return EN[kind]||EN.generic}
var turn={};function pick(kind){var a=words(kind);turn[kind]=((turn[kind]||0)+1)%a.length;return a[turn[kind]]}

/* ---------- what did they just do? ---------- */
var RX=[
  ['sign',/\b(sign ?in|log ?in|otp|code|verify|passkey)\b/i],
  ['pay',/\b(pay|buy|checkout|top ?up|order|purchase|wallet|quote)\b/i],
  ['ask',/\b(ask|doubt|question|help|query|enquir)/i],
  ['message',/\b(send|message|reply|chat|comment|post|feedback|contact|tell us|say)/i],
  ['join',/\b(join|enrol|enroll|register|sign ?up|apply|invite|subscribe|book|claim|accept)/i],
  ['save',/\b(save|keep|bookmark|draft)/i],
  ['learn',/\b(start|begin|lesson|learn|try|practi[cs]e|watch|play|continue)\b/i],
  ['share',/\b(share|publish|list|upload|submit work)/i],
  ['like',/\b(like|love|thank|rate|vote|clap)\b/i],
  ['submit',/\b(submit|confirm|done|finish|complete|create|add|request|next|go|ok)\b/i]
];
var SKIP=/\b(search|find|filter|sort|close|cancel|back|menu|previous|next page|lite|language|theme|dark|light|tab|open|show|hide|view|more|less|clear|reset|zoom)\b/i;
function label(el){return ((el.getAttribute&&(el.getAttribute('aria-label')||el.getAttribute('title')))||el.value||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,80)}
function kindOf(text){for(var i=0;i<RX.length;i++)if(RX[i][1].test(text))return RX[i][0];return null}
function off(el){return el&&el.closest&&el.closest('[data-hfl-warm="off"]')}

/* ---------- look ---------- */
var css='.hflw-t{position:fixed;left:50%;top:calc(64px + env(safe-area-inset-top,0px));transform:translate(-50%,-12px);width:max-content;z-index:2147483000;display:flex;gap:12px;align-items:center;max-width:min(440px,calc(100vw - 32px));padding:12px 16px 12px 12px;border-radius:14px;background:var(--hflw-bg);color:var(--hflw-ink);border:1px solid var(--hflw-rule);box-shadow:0 10px 30px rgba(15,25,45,.18);font:500 14.5px/1.4 "Public Sans",system-ui,-apple-system,"Segoe UI",sans-serif;opacity:0;pointer-events:none;transition:opacity .22s,transform .22s}'
+'.hflw-t.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}'
+'.hflw-e{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:var(--hflw-soft)}'
+'.hflw-t.on .hflw-e{animation:hflw-pop .5s cubic-bezier(.3,1.6,.5,1)}'
+'.hflw-x{display:grid;gap:2px;min-width:0}.hflw-x small{font:500 10.5px/1.2 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--hflw-brass)}'
+'.hflw-d{display:inline-flex;gap:4px;align-items:center}.hflw-d i{width:6px;height:6px;border-radius:50%;background:var(--hflw-brass);animation:hflw-b 1s infinite}.hflw-d i:nth-child(2){animation-delay:.15s}.hflw-d i:nth-child(3){animation-delay:.3s}'
+'.hflw-f{position:fixed;z-index:2147483001;pointer-events:none;font-size:26px;animation:hflw-up 1.1s ease-out forwards}'
+'.hflw-l{position:absolute;z-index:2147482999;pointer-events:none;display:inline-flex;gap:6px;align-items:center;padding:3px 9px;border-radius:999px;background:var(--hflw-bg);color:var(--hflw-brass);border:1px solid var(--hflw-rule);font:500 11.5px/1.3 "Public Sans",system-ui,sans-serif;box-shadow:0 2px 8px rgba(15,25,45,.1);opacity:0;transition:opacity .2s}.hflw-l.on{opacity:1}'
+'.hflw-l b{width:7px;height:7px;border-radius:50%;background:#2e9e6a;animation:hflw-p 1.2s infinite}'
+'.hflw-r{display:inline-block;margin-left:6px;font-size:15px;line-height:1;vertical-align:middle;animation:hflw-pop .5s cubic-bezier(.3,1.6,.5,1)}'
+'@keyframes hflw-pop{0%{transform:scale(.3)}100%{transform:scale(1)}}@keyframes hflw-b{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}'
+'@keyframes hflw-up{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:1;transform:translateY(-10px) scale(1.15)}100%{opacity:0;transform:translateY(-70px) scale(1)}}@keyframes hflw-p{0%,100%{opacity:1}50%{opacity:.35}}'
+':root{--hflw-bg:#fff;--hflw-ink:#18233a;--hflw-rule:#dde1e8;--hflw-soft:#f3ecd9;--hflw-brass:#94711f}'
+'@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--hflw-bg:#1d2534;--hflw-ink:#e6e9f0;--hflw-rule:#2f3a4e;--hflw-soft:#3a3220;--hflw-brass:#d6b25c}}'
+':root[data-theme="dark"]{--hflw-bg:#1d2534;--hflw-ink:#e6e9f0;--hflw-rule:#2f3a4e;--hflw-soft:#3a3220;--hflw-brass:#d6b25c}'
+'@media (prefers-reduced-motion:reduce){.hflw-t,.hflw-l{transition:none}.hflw-t.on .hflw-e,.hflw-r,.hflw-d i,.hflw-l b{animation:none}.hflw-f{display:none}}'
+'@media (max-width:560px){.hflw-t{left:16px;right:16px;width:auto;max-width:none;top:auto;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateY(12px)}.hflw-t.on{transform:none}}';

var toast,live,timer;
function setup(){
  if(toast)return;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  toast=document.createElement('div');toast.className='hflw-t';toast.setAttribute('data-hfl-warm','off');
  toast.innerHTML='<span class="hflw-e" aria-hidden="true"></span><span class="hflw-x"><span class="hflw-m"></span><small>'+TAG+'</small></span>';
  live=document.createElement('div');live.setAttribute('aria-live','polite');live.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  document.body.appendChild(toast);document.body.appendChild(live);
}
function show(emoji,html,ms){setup();clearTimeout(timer);toast.querySelector('.hflw-e').textContent=emoji;toast.querySelector('.hflw-m').innerHTML=html;
  toast.classList.remove('on');void toast.offsetWidth;toast.classList.add('on');timer=setTimeout(function(){toast.classList.remove('on')},ms||4200)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* the answer: a reaction where they acted, "listening" dots, then the warm line */
var last=0;
function respond(kind,el){
  var now=Date.now();if(now-last<500)return;last=now;hideChip();
  var p=pick(kind||'generic');
  if(el)burst(el,p[0]);
  try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}
  show(p[0],'<span class="hflw-d" aria-hidden="true"><i></i><i></i><i></i></span> '+esc(words('listen')),1400);
  var scope=el&&el.closest?(el.closest('form,section,article,.card,[role=dialog]')||el.parentNode):null;
  setTimeout(function(){if(scope&&trouble(scope))p=pick('nudge');show(p[0],esc(p[1]));live.textContent=p[1]},RM?120:650);
}
/* if the page answered with an error, encourage instead of thanking */
function trouble(sc){var q=sc.querySelectorAll('[aria-invalid="true"],[role=alert],.error,.err,.invalid,.warn,[class*="error"],[class*="err-"],.msg-bad');
  for(var i=0;i<q.length;i++){var n=q[i];if(n.offsetParent!==null&&(n.getAttribute('aria-invalid')==='true'||n.textContent.trim()))return true}
  q=sc.querySelectorAll('p,div,span,small');for(i=0;i<q.length&&i<400;i++){n=q[i];if(n.children.length||!n.offsetParent)continue;var t=n.textContent.trim();if(t&&t.length<120&&/^(please|enter|add|choose|pick|fill|required|missing|invalid|check)/i.test(t)){var c=getComputedStyle(n).color.match(/\d+/g);if(c&&+c[0]>150&&+c[1]<90)return true}}
  return false}
function burst(el,emoji){
  if(RM||!el.getBoundingClientRect)return;var r=el.getBoundingClientRect();if(!r.width&&!r.height)return;
  var f=document.createElement('span');f.className='hflw-f';f.textContent=emoji;f.setAttribute('aria-hidden','true');
  f.style.left=Math.min(innerWidth-36,Math.max(4,r.left+r.width/2-13))+'px';f.style.top=Math.max(4,r.top-8)+'px';
  document.body.appendChild(f);setTimeout(function(){f.remove()},1200);
}

/* ---------- 1. sends and submits ---------- */
document.addEventListener('submit',function(e){
  var f=e.target;if(off(f))return;
  var txt=label(f.querySelector('[type=submit],button')||f)+' '+(f.getAttribute('aria-label')||'')+' '+(f.id||'')+' '+(f.className||'');
  var only=f.querySelectorAll('input:not([type=hidden]),textarea,select');
  if(only.length===1&&only[0].type==='search')return;
  if(/search|find/i.test(txt)&&!/compose|send|msg/i.test(txt))return;
  var k=/compose|chat|msg|message/i.test(txt)?'message':(kindOf(txt)||'submit');
  if(k==='message'||k==='ask')markMine(f,k);
  respond(k,f.querySelector('[type=submit],button')||f);
},true);

/* ---------- 2. action buttons outside forms ---------- */
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('button,[role=button],input[type=submit],input[type=button],a.btn,a.button,a.cta');
  if(!b||off(b)||b.disabled)return;
  if(b.form&&(b.type==='submit'||b.getAttribute('type')===null&&b.tagName==='BUTTON'))return; /* the submit handler answers */
  if(b.closest('header,nav,[role=tablist],.hfl-bar,#hfl-bar'))return;
  var t=label(b);if(!t||t.length>48||SKIP.test(t))return;
  var k=kindOf(t.split(' ')[0]);if(!k)return; /* buttons lead with their verb: Send, Join, Ask, Save */
  respond(k,b);
},true);

/* ---------- 3. "we're listening" while they type ---------- */
var chip,idle;
document.addEventListener('input',function(e){
  var el=e.target;if(!el||off(el))return;
  var ok=el.tagName==='TEXTAREA'||(el.tagName==='INPUT'&&/^(text|email|tel|)$/.test(el.type||'')&&!/search|find|filter|otp|code|pin/i.test((el.name||'')+(el.id||'')+(el.placeholder||'')));
  if(!ok||String(el.value).length<3){hideChip();return}
  setup();
  if(!chip){chip=document.createElement('span');chip.className='hflw-l';chip.setAttribute('aria-hidden','true');chip.setAttribute('data-hfl-warm','off');document.body.appendChild(chip)}
  chip.innerHTML='<b></b>'+esc(words('listen'));
  var r=el.getBoundingClientRect();
  chip.style.left=(scrollX+Math.max(8,Math.min(r.right-150,innerWidth-170)))+'px';
  chip.style.top=(scrollY+Math.max(4,r.top-26))+'px';
  chip.classList.add('on');clearTimeout(idle);idle=setTimeout(hideChip,2600);
},true);
document.addEventListener('focusout',function(){hideChip()},true);
function hideChip(){if(chip)chip.classList.remove('on')}

/* ---------- 4. a reaction on their own chat bubble, kept through re-renders ---------- */
var mine=[];var BUB='.bub.me,.msg.me,.message.me,.bubble.me,[data-me="1"]';
function markMine(form,k){var inp=form.querySelector('input:not([type=hidden]),textarea');var v=inp&&inp.value.trim();if(!v)return;
  mine.push([v.slice(0,60),words(k)[((turn[k]||0)+1)%words(k).length][0]]);if(mine.length>40)mine.shift();setTimeout(paint,30);setTimeout(paint,300)}
function paint(){if(!mine.length)return;document.querySelectorAll(BUB).forEach(function(b){if(b.querySelector('.hflw-r'))return;
  var t=b.textContent.replace(/\s+/g,' ').trim();for(var i=mine.length-1;i>=0;i--){if(t.indexOf(mine[i][0])===0){var s=document.createElement('span');s.className='hflw-r';s.textContent=mine[i][1];s.title='Seen and heard';
    var sm=b.querySelector('small');(sm||b).appendChild(s);break}}})}
if(window.MutationObserver)new MutationObserver(function(){if(mine.length)paint()}).observe(document.documentElement,{childList:true,subtree:true});

/* ---------- 5. a hello, once a visit ---------- */
function hello(){var seen;try{seen=sessionStorage.getItem('hflw-hi');sessionStorage.setItem('hflw-hi','1')}catch(e){seen=window.__hflwHi;window.__hflwHi=1}
  if(seen)return;var l=L10N[lang()];var h=new Date().getHours();
  setTimeout(function(){show('🏠',esc(l?l.hello:EN.hello(h)),3800)},900)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hello);else hello();

window.HFLWarm={say:function(text,emoji){show(emoji||'✨',esc(text));setup();live.textContent=text},react:function(el,emoji){burst(el,emoji||'❤️')},respond:respond};
})();
