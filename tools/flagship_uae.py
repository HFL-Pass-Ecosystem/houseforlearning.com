#!/usr/bin/env python3
"""Flagship-depth UAE courses (39). Own wording. No fees, no brand/person names. Output: site/learn-flagship-ae-<slug>.html (new files)."""
import sys, pathlib, html, math
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from uae_data import T
from uae_pathways import P
from uae_deep import D
import importlib
for _n in ('1','2','3'):
    try:
        for _k,_v in importlib.import_module('uae_fix_'+_n).FIX.items(): D[_k]=list(_v)
    except ModuleNotFoundError: pass
for _n in ('a','b','c','d'):
    try:
        for _k,_v in importlib.import_module('uae_deep_'+_n).D2.items(): D.setdefault(_k,[]); D[_k]=D[_k]+list(_v)
    except ModuleNotFoundError: pass
LAD = {}
for _n in ('a','b','c','d'):
    try: LAD.update(importlib.import_module('uae_ladder_'+_n).LAD)
    except ModuleNotFoundError: pass
LVN = ['L1 Basic','L2 Awareness','L3 Foundation','L4 Practitioner','L5 Specialist','L6 Advanced','L7 Super expert']
e = html.escape
RUB = [("Evidence quality","Claims without records","Records for most claims","Every claim linked to a dated record"),
 ("Numbers and units","Missing units or currency","Correct, units shown (AED)","Correct, with a check calculation"),
 ("Safety and rules","Rules ignored","Rules named and followed","Rules confirmed with the local authority, note kept"),
 ("Customer or user focus","No real user","One real user","Several users, changes made from feedback"),
 ("Reflection","No lessons","Three lessons written","Lessons turned into a dated plan")]
LADDER = [("L1 Awareness","Name the main parts of {k} and the safety rules.","You can describe a day at work and spot one hazard."),
 ("L2 Assistant","Carry out simple steps under direct supervision.","You follow a written checklist without missing a step."),
 ("L3 Operator","Run one routine task alone and record it.","Your records are complete and correct for a full week."),
 ("L4 Practitioner","Plan and run the whole workflow, costed and measured (this course).","You meet the standard of this course with real evidence."),
 ("L5 Specialist","Improve the process using data and fix root causes.","You cut a cost, delay or fault by a measured amount."),
 ("L6 Lead","Lead a team, set standards and train others.","Your team meets the standard when you are away."),
 ("L7 Director","Set strategy, partnerships and risk limits for the whole unit.","You grow results over a year within agreed risk limits.")]
def plu(u,n=2):
    if n==1: return u
    irr={'child':'children','analysis':'analyses','policy':'policies','kg':'kg','MWh':'MWh','tonne':'tonnes'}
    return irr.get(u,u+'s')
def m(n): return f'{n:,.0f}' if n==int(n) else f'{n:,.2f}'
def course(t):
    (slug,title,mode,prod,buyers,haz,steps,kpi,unit,price,cost,vol,terms,jobs,local)=t
    s=[x.strip() for x in steps.split(',')]
    marg=(price-cost)/price*100; unitgain=price-cost; month=unitgain*vol
    be=math.ceil(month*0.0+ (cost*vol*0.2)/unitgain) if unitgain>0 else 0   # fixed cost = 20% of variable cost base
    fixed=cost*vol*0.2
    t1,t2,t3=terms
    pl = mode=='plant'
    hrs=120 if pl else 150
    do = "a supervised learning simulation and workplace observation" if pl else "a real or simulated 30-day pilot"
    task = (f'Produce a safety-first process brief, a costed throughput model and a 30-day observation log for {prod}, in a simulated or supervised setting.' if pl
            else f'Run {do} for {prod} in the UAE and keep a full record of every step, cost and result.')
    cond = (f'About {hrs} hours over 3 to 6 months. A supervised site visit or virtual plant walk-through, a free spreadsheet, a mentor and a peer circle. You do not operate live plant alone.' if pl
            else f'About {hrs} hours over 3 to 6 months. A partner site or a simulated customer, a free spreadsheet, a phone, a mentor and a peer circle.')
    std = 'Hazards named with controls; every number has a unit and AED; records complete; rules confirmed with the local authority; at least 70% on the check; rubric at Meets or better.'
    safety = (f'Process learning only. Main risks: {haz}. You work only under a competent supervisor and follow the site permit and safety rules.' if pl
              else f'Process learning only. Main risk to manage: {haz}. Follow UAE federal and emirate rules and any licence needed before you charge a customer. {local}')
    M=[]
    M.append(("Map the market and the people","Understand",5,
      f"Start with who needs {prod} and why. Around {buyers} drive demand in Dubai, Abu Dhabi and the other emirates.",
      [f"List 10 offers or suppliers in the UAE with price per {unit} in AED and who buys.",
       f"Interview 5 people from {buyers}: what do they buy now, how often, what do they pay, what annoys them?",
       f"Learn three terms: {t1[0]} ({t1[1]}); {t2[0]} ({t2[1]}); {t3[0]} ({t3[1]}).",
       "Write a one-page brief: user, need, hoped-for price, and the rule that matters most."],
      f"Five interviews all say delay is the main pain. You write: 'Reliable {prod}, answer in one day, price near AED {m(price)} per {unit}.'",
      "Complete the market table, five interview notes and the brief.","Ten offers priced; five users heard; one need stated in one sentence."))
    M.append(("Rules, hazards and licences","Apply",6,
      f"Know the rule before the work. Main hazards here: {haz}. Hazard thinking means list each step, ask what could go wrong, and decide the control.",
      ["Ask your local authority or free zone which licence, permit or inspection applies. Write the answer and the date you asked.",
       f"For each step ({'; '.join(s)}) write the hazard and the control.",
       "Use a hierarchy: remove the hazard, replace it, separate people from it, change the way of work, then protective equipment last.",
       "Keep a one-page incident rule: who you call, what you stop, what you record."],
      f"Step '{s[0]}': hazard = {haz.split(' and ')[0]}; control = written check before start and a named supervisor; record = signed log line.",
      "Draw the flow and mark hazard and control at each step.","Every step has a hazard and a control; licence question answered in writing."))
    M.append(("Core workflow, step by step","Apply",12,
      f"The work is a short chain: {', '.join(s)}. Learn each link, then link them with records.",
      [f"Write a checklist for each of the {len(s)} steps: input, action, check, output.",
       "Time each step three times and note the slowest.",
       "Record a defect or delay each time it happens: what, where, cause, fix.",
       f"Measure {kpi}; this is your main number."],
      f"Three timed runs of '{s[1]}' take 42, 38 and 51 minutes. Average 43.7; the 51-minute run had a missing tool. Fix: a tool tray checked at start.",
      "Run the chain three times (simulated or real) and fill the log.","Three complete logs; the slowest step has a cause and a fix."))
    M.append(("Quality and measurement","Analyse",10,
      f"What you do not measure you cannot improve. Your main measure is {kpi}.",
      [f"Define {kpi}: what counts, what does not, and over what period.",
       "Draw a simple chart of the last 10 results and mark the average.",
       "Find the top two causes of loss with a tally sheet, then fix the biggest one first.",
       "Check measuring tools: are they accurate, clean and in date?"],
      f"Tally of 40 faults: 22 from late inputs, 9 from wrong settings, 9 other. Fix late inputs first: that is 55% of faults.",
      "Collect a tally for one week and make a Pareto chart.","Tally complete; biggest cause named; one fix planned with a date."))
    M.append(("Costing and pricing in AED","Evaluate",12,
      f"Know the cost of one {unit} before you set the price. Include materials, labour, energy, transport, licence share, waste and a safety margin.",
      [f"Cost per {unit} = total cost divided by {plu(unit)} sold (not made).","Margin = (price minus cost) divided by price.",
       "Break-even units = fixed costs divided by gain per unit.","Test the price with two users and write down the answer."],
      f"At AED {m(price)} per {unit} and cost AED {m(cost)}, gain is AED {m(unitgain)} and margin {marg:.1f}%. At {m(vol)} {plu(unit,vol)} a month, gross gain is AED {m(month)}. If fixed costs are AED {m(fixed)}, break-even is {m(math.ceil(fixed/unitgain))} {plu(unit,math.ceil(fixed/unitgain))}.",
      "Build the cost sheet with AED on every line and have your mentor check it.","No missing cost found; margin calculated twice by different routes."))
    M.append(("Serve and sell responsibly","Apply",12,
      f"Customers return when you keep promises. Promise only what your workflow can deliver.",
      ["Write a one-page offer: what is included, what is not, price, time, how you fix mistakes.","Write a short script for the first call or visit.",
       "Agree dates in writing; confirm each change.","Handle a complaint in four steps: listen, apologise for the impact, fix, record what changed."],
      f"Offer: '{prod.capitalize()} delivered within one working day; price AED {m(price)} per {unit}; faults corrected free within 3 days.'",
      "Present the offer to two users and note changes.","Offer has scope, price, time and fix rule; two users commented."))
    M.append((("Run the 30-day observation" if pl else "Run the 30-day pilot"),"Create",55,
      "Small, real and recorded. Change one thing at a time and learn quickly.",
      ["Keep a daily log: date, units, cost, delays, defects, safety notes.","Hold a 15-minute review each week with your mentor.","Write down every complaint and what you changed.",
       "Take photos only where allowed and never of people without consent."],
      f"Week 2 shows {kpi} at 71%; week 4 at 84% after the tool tray and an earlier input check.",
      "Complete 30 days of the log and four weekly reviews.","30 days logged; each defect has a cause; weekly notes kept."))
    M.append(("Review, decide and plan","Evaluate",38,
      "A decision beats a feeling. Compare plan with result and choose to scale, change or stop.",
      ["Make a before and after table: cost per unit, defects, delays, repeat users.","Write three lessons.","Decide scale, change or stop, with the numbers behind it.",
       "Give two peers one strength and one fix each."],
      f"Result: cost per {unit} fell from AED {m(cost)} to AED {m(cost*0.94)}; repeat users 6 of 9. Decision: scale to a second site; keep price.",
      "Present to a review room and collect one written comment from a user.","Decision backed by numbers; two peer reviews given."))
    M.extend(D.get(slug,[]))
    # Each question carries the TITLE of the module whose content teaches the answer (checked at build time).
    # The tag (module number, title, standard) is derived from that module in build(); nothing is typed by hand there.
    RH,MK,WF,CS,RV="Rules, hazards and licences","Map the market and the people","Core workflow, step by step","Costing and pricing in AED","Review, decide and plan"
    Q=[(f"Name the main hazards in this work.", haz.capitalize()+".", RH),
       ("Why ask your local authority about licences?", "Rules differ by emirate and activity; written answers protect you.", RH),
       (f"Gain per {unit} if price is AED {m(price)} and cost is AED {m(cost)}?", f"AED {m(unitgain)}.", CS),
       (f"Margin for the same figures?", f"{marg:.1f}%.", CS),
       ("Name the steps of the workflow.", '; '.join(s).capitalize()+".", WF),
       (f"What is {t1[0]}?", t1[1].capitalize()+".", MK),
       (f"What is {t2[0]}?", t2[1].capitalize()+".", MK),
       (f"What is {t3[0]}?", t3[1].capitalize()+".", MK),
       ("Which control comes first in the hierarchy?", "Remove the hazard; protective equipment comes last.", RH),
       ("What three options end the pilot?", "Scale, change or stop, with reasons from the numbers.", RV)]
    return dict(slug=slug,title=title,hours=hrs,prod=prod,task=task,cond=cond,std=std,safety=safety,M=M,Q=Q,jobs=jobs,kpi=kpi,
        outcomes=[("Understand",f"Explain the UAE market, rules and hazards for {title.lower()}."),("Apply",f"Run the workflow: {', '.join(s)}."),("Analyse",f"Measure {kpi} and find the biggest cause of loss."),("Evaluate","Cost and price in AED and judge scale, change or stop."),("Create","Produce a record pack a supervisor can audit.")])
def build(c):
    total=sum(x[2] for x in c['M'])
    import re as _re
    c['cond']=_re.sub(r'About \d+ hours',f'About {total} hours',c['cond'])
    mods=''
    for i,(t,bl,h,intro,pts,ex,act,std) in enumerate(c['M'],1):
        mods+=(f'<details class="mod" {"open" if i==1 else ""}><summary><span class="mn">Module {i}</span> {e(t)} <span class="pill">{h} h</span><span class="pill bz">{bl}</span></summary><p>{e(intro)}</p><ul>'+''.join(f'<li>{e(p)}</li>' for p in pts)+'</ul>'
               f'<div class="evi"><strong>Worked example.</strong> {e(ex)}</div><p><strong>Activity.</strong> {e(act)}</p><p><strong>Standard to meet.</strong> {e(std)}</p></details>')
    def tag(ref):
        if ref is None: return ' (Covered in: Task, condition and standard, near the top of this page.)'
        hits=[i for i,x in enumerate(c['M'],1) if x[0]==ref]
        assert len(hits)==1, (c['slug'], ref, hits)
        i=hits[0]; x=c['M'][i-1]
        return f' (Covered in module {i}: {x[0]}. To pass that module: {x[7].rstrip().rstrip(".")}.)'
    quiz=''.join(f'<details class="mod"><summary>Q{i+1}. {e(q)}</summary><p><strong>Model answer:</strong> {e(a.rstrip()+tag(r))}</p></details>' for i,(q,a,r) in enumerate(c['Q']))
    rub=('<div class="scroll-x"><table class="ws-table"><caption>Marking rubric</caption><thead><tr><th>Criterion</th><th>Not yet</th><th>Meets</th><th>Exceeds</th></tr></thead><tbody>'+''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b)}</td><td>{e(x)}</td><td>{e(d)}</td></tr>' for a,b,x,d in RUB)+'</tbody></table></div>')
    lad=('<div class="scroll-x"><table class="ws-table"><caption>Seven-level ladder</caption><thead><tr><th>Level</th><th>You can</th><th>Evidence</th></tr></thead><tbody>'+''.join(f'<tr><th scope="row">{e(a)}</th><td>{e(b.format(k=c["title"].lower()))}</td><td>{e(d)}</td></tr>' for a,b,d in LADDER)+'</tbody></table></div>')
    if c['slug'] in LAD:
        sl=LAD[c['slug']]; assert len(sl)==7, c['slug']
        lad=('<p>Seven slides, one for each level. Step in at your level and move up; credits stack.</p>'+''.join(
            f'<details class="mod"><summary>Slide {k}. {e(LVN[k-1])}: {e(t)}</summary><p><strong>On the slide:</strong> {e(LVN[k-1])} · {e(t)}</p><p><strong>Notes:</strong> {e(n)}</p></details>' for k,(t,n) in enumerate(sl,1)))
    about=B.sec('','ab','about this course','What you will be able to do',
      f'<div class="cb-facts"><span class="pill lv">L4 Practitioner</span><span class="pill">About {sum(x[2] for x in c["M"])} h</span><span class="pill">Practice 70% · Share 20% · Study 10%</span><span class="pill">UAE (Dubai and Abu Dhabi)</span></div>'
      '<ul class="blm">'+''.join(f'<li><span class="bz">{b}</span> {e(t)}</li>' for b,t in c['outcomes'])+'</ul>'
      f'<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs"><div><h4>Task</h4><p>{e(c["task"])}</p></div><div><h4>Condition</h4><p>{e(c["cond"])}</p></div><div><h4>Standard</h4><p>{e(c["std"])}</p></div></div>'
      f'<p class="ws-note">{e(c["safety"])}</p><p><strong>Requirements:</strong> none. Currency: AED on every number.</p>')
    body=(about+B.sec('alt','md','lesson by lesson',f'{len(c["M"])} modules with worked examples ({total} h guided)',mods)
      +B.sec('','as','assessment','How you are checked',f'<p>Evidence: your records, numbers and reflections. Two peers and one mentor mark it with this rubric. Pass: no criterion at "Not yet" and at least 70% on the check.</p>{rub}<h3 class="ws-h3">Ten-question check, with model answers</h3>{quiz}')
      +B.sec('alt','ld','levels L1 to L7','Slide by slide, with notes' if c['slug'] in LAD else 'Where this sits on the ladder',lad)
      +B.sec('','jb','jobs this leads to','Where this takes you','<ul>'+''.join(f'<li>{e(j)}</li>' for j in c['jobs'])+'</ul>')
      +B.sec('alt','lc','ten locations and global','Your place','<p>Use your own currency, language and local rules. Check each rule with your local authority.</p>'+''.join(f'<details class="loc"><summary>{e(L["name"])}</summary><p>Currency {L["cur"]}; language {e(L["lang"])}; set up legally: {e(L["reg"])}; personal data: {e(L["data"])}; where to practise: {e(L["partner"])}.</p></details>' for L in B.LOC)+f'<details class="loc"><summary>Russian Federation</summary><p>{e(B.RUSSIA)}</p></details>')
      +B.sec('','nx','next','Draft','<p class="ws-note">Draft flagship-depth course. Own wording. Not live.</p>'))
    B.page(f'learn-flagship-ae-{c["slug"]}.html',c['title']+' in the UAE (full course)',f'Full course: {c["title"]}, UAE.',c['title'],e(f'Learn {c["title"].lower()} for the UAE: rules, workflow, costing in AED and a recorded 30-day practice.'),body,B.crumb(('Courses','courses-hub.html'),('UAE','learn-uae-hub.html'),(c['title'],None)),kicker='UAE · full course')
n=0
for t in T+P:
    build(course(t)); n+=1
print(n,'UAE courses built (39 + 10 pathways)')

# ---- UAE hub page + link from the courses hub (idempotent) ----
def hub():
    import re
    cards=''
    for t in T+P:
        c=course(t)
        n=len(c['M'])+len(D.get(t[0],[]))*0
        cards+=(f'<li class="cc" data-t="{e((c["title"]+" uae").lower())}"><a href="learn-flagship-ae-{c["slug"]}.html"><span class="pill lv">L4 Practitioner</span><h3>{e(c["title"])}</h3>'
                f'<p>{e(c["task"][:140])}</p><p class="cm">{sum(x[2] for x in c["M"])} h</p></a></li>')
    body=B.sec('','ls','courses',f'{len(T)+len(P)} full courses for the UAE',f'<p>{len(T)} location topics and {len(P)} pathway courses for Dubai and Abu Dhabi. Each has modules with worked examples, a rubric, a ten-question check and a seven-level ladder.</p><ul class="cgrid">{cards}</ul>')
    B.page('learn-uae-hub.html','UAE location courses','Full courses for Dubai and Abu Dhabi.','UAE location courses','Full courses for Dubai and Abu Dhabi: 39 location topics and 10 pathways.',body,B.crumb(('Courses','courses-hub.html'),('UAE',None)),kicker='flagship courses · UAE')
    p=B.S/'courses-hub.html'
    s=p.read_text()
    if 'learn-uae-hub.html' not in s:
        card='<li class="cc"><a href="learn-uae-hub.html"><h3>UAE location courses</h3><p>49 full courses for Dubai and Abu Dhabi</p></a></li>'
        i=s.find('class="cgrid"')
        j=s.find('</ul>',i)
        if i>-1 and j>-1: p.write_text(s[:j]+card+s[j:])
hub()
print('hub built')
