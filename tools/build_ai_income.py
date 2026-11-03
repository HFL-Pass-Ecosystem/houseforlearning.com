#!/usr/bin/env python3
"""Builds the AI side-income path: site/ai-side-income.html (series hub) and ai-income-1..15 lesson pages.
Own words, generic titles, no outside brand, trainer or tool names. No prices on the pages (the join step shows them).
Lesson 1 is the free preview; assets/access.js reads data-series on <main>. Run: python3 tools/build_ai_income.py"""
import os, re, html
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
skel = open(os.path.join(SITE, 'career-pathways.html')).read()
i = skel.find('<main'); j = skel.find('</main>')
HEAD, TAIL = skel[:i], skel[j:]
e = html.escape
HUB = 'ai-side-income.html'
NOTE = ('<p class="lux-note">Learning material, not financial, legal or tax advice, and no income is promised. Results depend on your work. '
        'Use practice data only. Check the rules where you live on contracts, tax and personal data before you sell anything.</p>')

# (slug, title, phase, bloom objective, lede, sections[(h, text)], task, condition, standard, checks[(q,a)])
L = [
 ('website-product', 'Build an AI-powered website or product', 'Build',
  'Build a small working web page or product with an AI assistant.',
  'A first working product in one sitting: describe what you want, let an AI assistant draft it, then test and fix it yourself.',
  [('Start with one customer and one problem', 'Write one sentence: who is it for and what does it help them do? A small product that solves one problem clearly sells better than a big one that does five things badly.'),
   ('Describe, draft, test, fix', 'Give the assistant a clear brief: the page goal, the words, the look, what must happen when someone clicks. Read what it makes. Test every button yourself. Ask for one change at a time and test again.'),
   ('Know what you must check', 'An assistant can make mistakes or invent facts. You check the facts, the links, the prices and that nothing private is shown. You are responsible for what you publish.')],
  'Build a one-page site or small tool for one named customer type.', 'An AI assistant, a free practice account, practice content only.', 'It opens, every button works, the facts are checked by you, and a peer can say in one sentence what it does.',
  [('Why start with one customer and one problem?', 'A clear, small product is easier to build, test and sell.'), ('Who checks the facts an assistant writes?', 'You do.'), ('How many changes do you ask for at a time?', 'One, then test.')]),
 ('content-channels', 'Create a content channel with AI, without showing your face', 'Build',
  'Plan and produce a small content channel using AI tools for scripts, voice and visuals.',
  'Many people earn from channels that never show a face. You will plan a niche, make one short piece, and set a weekly rhythm.',
  [('Pick a niche you can serve for a year', 'Choose a topic where you can keep making useful pieces. Check that people ask questions about it. Write who watches and what they will do after.'),
   ('Script, voice, visuals, edit', 'Use an assistant to draft a script in your words, check every fact, then add a voice and simple visuals. Keep pieces short. Say where AI helped if the platform asks.'),
   ('Rules to respect', 'Use only music, images and text you may use. Do not copy another creator. Do not copy a real person\'s voice or face without their written yes.')],
  'Produce one short piece and a four-week posting plan.', 'AI tools of your choice, content you have the right to use.', 'Facts checked, rights clear, one clear call to action, a plan a peer can follow.',
  [('Can you copy another creator\'s video?', 'No. Make your own.'), ('Who must agree before you copy a real voice?', 'That person, in writing.'), ('What ends every piece?', 'One clear call to action.')]),
 ('crm-erp', 'Build a simple CRM and business tool with an AI coding assistant', 'Build',
  'Design a small customer-record and order tool and build a first version with an AI coding assistant.',
  'Small businesses pay for tidy tools. Learn to turn their messy list into a simple app with records, status and reminders.',
  [('Draw the records first', 'List what the business tracks: customers, deals, orders, invoices. Draw the boxes and the links on paper before you ask for code.'),
   ('Build in small steps', 'Ask the assistant for one screen at a time: add a record, list records, change status. Test each with practice data before the next.'),
   ('Protect the data', 'Never use real customer data while learning. Plan who can see what, and how data is backed up and deleted.')],
  'Build a three-screen tool: add, list and update a customer or order.', 'An AI coding assistant, practice data only.', 'Add, list and update all work; no real personal data; one page of notes on who can see what.',
  [('What do you draw before you ask for code?', 'The records and how they link.'), ('What data do you use while learning?', 'Practice data only.'), ('How do you build?', 'One small step at a time, testing each.')]),
 ('enterprise-brain', 'Build an AI brain for a company', 'Build',
  'Set up an assistant that answers staff questions from a company\'s own documents.',
  'An enterprise brain lets staff ask questions in plain words and get answers from the firm\'s own policies and files, with sources shown.',
  [('Choose the questions it must answer', 'Ask what staff look up most: leave rules, prices, steps for a task. Collect the documents that hold the answers.'),
   ('Clean, load, test', 'Remove old and wrong versions. Load the rest. Ask 20 real questions and mark each answer right or wrong, and whether it showed its source.'),
   ('Set the guard rails', 'Decide what it must never answer, who may see which documents, and how people report a wrong answer.')],
  'Build a question-and-answer assistant over 10 sample documents.', 'Sample company documents you wrote yourself, no real company files.', 'At least 16 of 20 test answers right with a source shown; guard rails written down.',
  [('Why remove old versions?', 'So it does not answer from outdated rules.'), ('What do you show with every answer?', 'The source document.'), ('Who decides what it must never answer?', 'The company, with you, before launch.')]),
 ('agent-team', 'Build a team of personal AI agents', 'Build',
  'Design several small assistants that each do one job, and a simple way for them to hand work on.',
  'One assistant for research, one for drafting, one for checking. Small agents with clear jobs are easier to trust than one that does everything.',
  [('One job, one agent', 'Write each agent\'s job, its inputs, what it must hand back, and what it must not do.'),
   ('Hand-offs and a human check', 'Chain the agents so one result feeds the next, but put a person at the points that matter: money, messages sent out, anything that cannot be undone.'),
   ('Keep a log', 'Record what each agent did. If something goes wrong you can see where.')],
  'Design and run a three-agent chain for one weekly task.', 'AI assistants of your choice, practice task, no real accounts connected.', 'Each agent has a written job; a human check at every risky step; a log you can read.',
  [('Why give each agent one job?', 'It is easier to test and trust.'), ('Where does a person check?', 'Money, outgoing messages and anything that cannot be undone.'), ('Why keep a log?', 'To find where it went wrong.')]),
 ('voice-agents', 'Build a real-time voice agent', 'Build',
  'Plan and test a voice assistant that answers calls for a simple business task, such as booking.',
  'Voice agents answer calls and bookings. You will script the conversation, test it and decide when it hands over to a person.',
  [('Script the call', 'Write the greeting, the questions, the confirmations and the goodbye. Keep sentences short, because people hear, not read.'),
   ('Test with people', 'Have three people call the practice line with different accents and speeds. Note where it misheard or confused.'),
   ('Know when to hand over', 'If the caller is upset, confused or asks something outside the script, the agent offers a person. Say clearly that it is an AI at the start.')],
  'Script and test one booking call.', 'A voice assistant tool, practice phone line, willing friends as callers.', 'Three test calls completed, problems listed, hand-over rule written, AI disclosed at the start.',
  [('What must the agent say at the start?', 'That it is an AI.'), ('When does it hand over?', 'When the caller is upset, confused or off-script.'), ('Why test different voices?', 'To find where it mishears.')]),
 ('trading-learning', 'Think about markets with AI: learn and test on paper only', 'Build',
  'Explain how to test a trading idea honestly on past data, using paper money only.',
  'This lesson teaches how to think, not what to buy. You test ideas on past data with pretend money and learn why most ideas fail.',
  [('Write the idea as rules', 'State when to enter, when to leave, and how much to risk. If you cannot write it as rules, you cannot test it.'),
   ('Test fairly', 'Use data the idea has not seen. Include costs and slippage. Count the trades: very few trades prove nothing. Watch the biggest fall, not only the gain.'),
   ('Know the limits', 'Past results do not promise future ones. This is not advice. Do not use real money while learning, and know that dealing for others needs a licence where you live.')],
  'Write one idea as rules and test it on past data with costs.', 'Past price data, a testing tool, paper money only.', 'Rules written, costs included, trade count and biggest fall reported, and a note on why it might fail.',
  [('Can past results promise the future?', 'No.'), ('Why include costs?', 'They can turn a gain into a loss.'), ('Do you use real money to learn?', 'No, paper money only.')]),
 ('investing-learning', 'Think about investing with AI: learn and compare on paper only', 'Build',
  'Compare long-term investing ideas using AI to summarise, and judge the answers yourself.',
  'AI can summarise reports and explain terms. It cannot know your goals or the future. You learn to ask good questions and check answers.',
  [('Know your own goal and time', 'Write the goal, the time, how much loss you could bear. Without these, no idea is suitable.'),
   ('Use AI to explain, not to decide', 'Ask it to explain terms, risks and fees in plain words, and to show both sides. Check numbers against the original source.'),
   ('Keep a decision log on paper', 'Write why you would choose each idea and what would change your mind. Review it later and learn.')],
  'Make a paper comparison of two ideas with risks and fees.', 'Public information, an AI assistant, paper money only.', 'Goal and time written; risks and fees stated; numbers checked at source; a log written.',
  [('What must you know first?', 'Your goal, time and the loss you can bear.'), ('Does AI decide for you?', 'No, it explains. You decide.'), ('Where do you check numbers?', 'In the original source.')]),
 ('automation-billing', 'Automate invoicing and billing', 'Build',
  'Set up a simple automatic flow from an order to an invoice and a reminder.',
  'Automation saves hours every month. You will connect an order, an invoice and a payment reminder, with a human check.',
  [('Map the steps first', 'Write what happens from order to money in the bank. Mark which steps repeat. Automate the repeating ones.'),
   ('Build, then test with fake orders', 'Create the flow with a tool of your choice. Run five fake orders including one wrong one. Check the totals, tax lines and dates.'),
   ('Keep records and privacy', 'Invoices carry personal data and tax details. Keep the records the law requires, and share only with those who need them.')],
  'Automate order to invoice to reminder for five fake orders.', 'An automation tool, practice data only.', 'All five invoices correct including the wrong order caught; records kept; reminder works.',
  [('What do you automate?', 'The steps that repeat.'), ('How do you test?', 'With fake orders, including a wrong one.'), ('Why is privacy a concern?', 'Invoices hold personal and tax data.')]),
 ('ai-ads', 'Make marketing ads with AI that people want to share', 'Build',
  'Create a short ad and test two versions to see which works.',
  'An ad that works says one clear thing to one clear person. AI helps you make versions quickly. You test and learn.',
  [('One message for one person', 'Write who it is for, what they get, and what to do next. Remove anything else.'),
   ('Make two versions', 'Use AI to draft two different openings or images. Keep everything else the same so the test is fair.'),
   ('Be honest', 'Do not make false claims, fake reviews or fake faces of real people. Mark paid or AI content where rules say so.')],
  'Make two versions of one ad and a plan to test them.', 'AI tools, rights-cleared content.', 'One message each, one change between versions, claims checked, test plan written.',
  [('Why change only one thing between versions?', 'So you know what made the difference.'), ('Can you use a fake review?', 'No.'), ('What does a good ad say?', 'One clear thing to one clear person.')]),
 ('find-clients', 'Find high-paying clients', 'Sell',
  'Identify and list clients who have the need, the money and the authority to buy.',
  'Good clients have a clear problem, a budget and a person who can say yes. You will find them and open a polite conversation.',
  [('Choose who you serve', 'Pick one sector and one problem you can solve. Write the result you deliver in money, time or risk saved.'),
   ('Build a short list', 'List 30 businesses that fit. For each, write the problem you think they have and the person who decides.'),
   ('Open a respectful conversation', 'Send a short message about their problem, not about you. Follow the rules on unwanted messages where they live. Stop when told no.')],
  'Build a 30-business list and write one opening message.', 'Public information only; no bought personal lists.', 'Each entry has a likely problem and decision-maker; message is short and about them.',
  [('What makes a good client?', 'A clear problem, a budget and a decision-maker.'), ('What does your first message talk about?', 'Their problem.'), ('What do you do when someone says no?', 'Stop, politely.')]),
 ('proposals-pricing', 'Write proposals and price your work', 'Sell',
  'Write a one-page proposal and set a fair price with a clear scope.',
  'A proposal shows you understand the problem, what you will do, by when and for how much. Clear scope prevents arguments later.',
  [('The one-page proposal', 'Problem in their words, what you will deliver, steps and dates, what you need from them, price, how to say yes.'),
   ('Price by value and effort', 'Estimate your hours and the value to the client. Add a margin for surprises. Offer a small paid first step to build trust.'),
   ('Write what is out of scope', 'List what is not included and how changes are priced. Mention how you protect their data and who owns the work.')],
  'Write a proposal and price for a practice client.', 'A sample brief; invent the client.', 'One page; scope and exclusions clear; price explained; next step clear.',
  [('What prevents later arguments?', 'A clear scope and exclusions.'), ('What is a good first offer?', 'A small paid first step.'), ('What goes in "not included"?', 'Anything outside the agreed work, and how changes are priced.')]),
 ('pitch-negotiate-close', 'Pitch, negotiate and close', 'Sell',
  'Practise a client call: pitch, handle price talk and agree next steps.',
  'Calls are a skill you can practise. Listen first, show the result, handle price calmly and agree one next step.',
  [('Listen, then show the result', 'Ask what matters most to them. Repeat it back. Show how your work gets that result, with one small example.'),
   ('Handle price and doubts', 'When price is too high, show value and offer a smaller scope instead of cutting your price. Ask what worries them and answer that.'),
   ('Close with one next step', 'End every call with a date and a task for each side. Send a short written summary the same day.')],
  'Complete two mock client calls and write the summary.', 'A partner and the flip cards on the path page.', 'You listened first, handled one price doubt, and ended with a dated next step.',
  [('What do you do first on a call?', 'Listen and ask what matters.'), ('Price is too high. What then?', 'Show value or offer a smaller scope.'), ('How does a call end?', 'With a dated next step for each side.')]),
 ('brand-portfolio', 'Build your online brand and portfolio', 'Sell',
  'Create a simple profile and portfolio that shows real results.',
  'Clients look you up before they reply. A clear profile and two or three real examples build trust.',
  [('Say who you help and how', 'One headline: who, what result. Keep your profile photo and words clear and friendly.'),
   ('Show work with results', 'For each example: the problem, what you did, the result. Ask permission before you show any client work or name.'),
   ('Review weekly', 'Once a week, update one item and ask a peer to read it as a client would.')],
  'Publish a profile and two portfolio examples.', 'Your own work or practice projects, with permission for any client work.', 'Headline clear; each example has problem, action, result; permissions held.',
  [('What goes in a headline?', 'Who you help and what result.'), ('What do you ask before showing client work?', 'Their permission.'), ('How often do you review it?', 'Weekly.')]),
 ('hackathon-capstone', 'Capstone: build, pitch and show one solution', 'Hackathon',
  'Create a complete small solution and present it to a panel as if to a client.',
  'One week to bring it together: choose a real problem, build a first version, pitch it, and take feedback.',
  [('Choose and plan', 'Pick one problem from your earlier lessons. Write the goal, what done looks like and what you will cut if time runs short.'),
   ('Build and test', 'Build the smallest version that works. Test it with two people who match the customer. Fix the top three problems.'),
   ('Pitch and reflect', 'Present for five minutes: the problem, the demo, the result, the price and next step. Ask for feedback. Write what you would do next.')],
  'Deliver a working solution, a five-minute pitch and a reflection.', 'Any tools from the path; practice data only.', 'It works for the target person; the pitch is clear; feedback is recorded and answered.',
  [('What do you cut first if time is short?', 'Whatever is not in the "done looks like" list.'), ('How many people test it?', 'At least two who match the customer.'), ('What do you write last?', 'What you would do next.')]),
]
N = len(L)

def page(slug, title, desc, body, prev, nxt, lesson=None):
    h = HEAD.replace('Course and Career Pathways | House for Learning', f'{title} | House for Learning')
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(desc)}">', h)
    h = h.replace('career-pathways.html">', slug + '.html">')
    crumb = (f'<li><a href="{HUB}">AI side-income path</a></li><li aria-current="page">{e(title)}</li>' if slug != HUB[:-5] else '<li aria-current="page">AI side-income path</li>')
    h = h.replace('<li aria-current="page">Career pathways</li>', crumb)
    pager = ('<nav class="pager" aria-label="Previous and next page"><div class="wrap pager-row">'
             f'<a class="pager-link pager-prev" href="{prev[0]}"><span class="pager-k">&larr; Previous</span><span class="pager-n">{e(prev[1])}</span></a>'
             f'<a class="pager-link pager-next" href="{nxt[0]}"><span class="pager-k">Next &rarr;</span><span class="pager-n">{e(nxt[1])}</span></a></div></nav>\n')
    gate = f' data-series="{HUB}" data-lesson="{lesson}" data-lessons="{N}" data-title="AI side-income path"' if lesson else ''
    out = h + f'<main id="main" tabindex="-1"{gate}>\n' + body + pager + TAIL
    if lesson:
        if 'assets/courses.css' not in out: out = out.replace('<link rel="stylesheet" href="assets/site.css">', '<link rel="stylesheet" href="assets/site.css">\n<link rel="stylesheet" href="assets/courses.css">', 1)
        if 'assets/access.js' not in out: out = out.replace('</body>', '<script src="assets/access.js" defer></script>\n</body>', 1)
    open(os.path.join(SITE, slug + '.html'), 'w').write(out)

def sec(cls, i, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>\n'

def vark(title):
    return ('<ul class="lux-list one">'
            f'<li><strong>See.</strong> Sketch the steps of "{e(title.lower())}" as a simple picture or flow before you start.</li>'
            '<li><strong>Hear.</strong> Say each step aloud to a partner, or record yourself and play it back.</li>'
            '<li><strong>Do.</strong> Work with your hands on the practice task, then tick each step as you finish it.</li>'
            '<li><strong>Read and write.</strong> Write your result in five lines in your own words.</li></ul>')

def lesson_body(k):
    slug, title, phase, obj, lede, secs, task, cond, std, chk = L[k]
    n = k + 1
    b = (f'<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">ai side-income path · {e(phase.lower())} · lesson {n} of {N}</p>'
         f'<h1 id="h1">{e(title)}</h1><p>{e(lede)}</p>{NOTE}</div></div></section>\n')
    b += sec('', 'ob', 'your aim', 'What you will be able to do', f'<p><strong>{e(obj.split()[0])}</strong> {e(" ".join(obj.split()[1:]))}</p>'
             f'<ul class="lux-list one"><li><strong>Task.</strong> {e(task)}</li><li><strong>Condition.</strong> {e(cond)}</li><li><strong>Standard.</strong> {e(std)}</li></ul>')
    b += sec('alt', 'pre', 'before the live session', 'Pre-read: get ready in 10 to 15 minutes',
             '<p>Read this one or two days before the live session.</p><ul class="lux-list one">'
             f'<li><strong>Read.</strong> The aim above and the three steps below. Note one thing you do not understand.</li>'
             f'<li><strong>Prepare.</strong> Open the tool you will use for "{e(title.lower())}" and check that it works.</li>'
             '<li><strong>Bring.</strong> One question to ask in the live session.</li></ul>')
    for q, (h2, txt) in enumerate(secs):
        b += sec('alt' if q % 2 == 0 else '', f's{q}', f'step {q + 1}', h2, f'<p>{e(txt)}</p>')
    b += sec('alt', 'vk', 'learn your way', 'See it, hear it, do it, write it', vark(title))
    b += sec('', 'post', 'after the live session', 'Post-read: your notes and recording',
             '<p>After the live session the join button changes to "watch recording", and the notes are added here.</p><ul class="lux-list one">'
             '<li><strong>Watch.</strong> The recording, if you missed any part.</li>'
             f'<li><strong>Read.</strong> The notes for "{e(title.lower())}" and tick off each step.</li>'
             '<li><strong>Share.</strong> Put your result on your showcase for feedback.</li></ul>'
             '<p class="ws-note">Draft. Recordings and notes are not working yet in this test.</p>')
    qs = ''.join(f'<details class="lux-panel"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in chk)
    b += sec('', 'chk', 'check yourself', 'Three quick questions', '<p>Think of your answer first, then open the question.</p>' + qs
             + f'<div class="ctas"><a class="btn" href="{HUB}">AI side-income path</a><a class="btn btn-ghost" href="start-a-course.html">Start a course</a></div>')
    return b

def main():
    for k, row in enumerate(L):
        prev = (HUB, 'AI side-income path') if k == 0 else (f'ai-income-{k}.html', L[k - 1][1])
        nxt = (HUB, 'AI side-income path') if k == N - 1 else (f'ai-income-{k + 2}.html', L[k + 1][1])
        page(f'ai-income-{k + 1}', row[1], row[4], lesson_body(k), prev, nxt, lesson=k + 1)
    def cards(ph):
        return ''.join(f'<li class="card"><span class="tag">lesson {k + 1}</span><h3>{e(r[1])}</h3><p>{e(r[4])}</p><a class="more" href="ai-income-{k + 1}.html">Open lesson {k + 1}</a></li>' for k, r in enumerate(L) if r[2] == ph)
    ms = ('<ol class="lux-list one"><li><strong>Apply</strong> for the practice exam. You get access to it; prepare meanwhile.</li>'
          '<li><strong>Pass</strong> the practice exam. It is built like the real one, with several attempts.</li>'
          '<li><strong>Sit</strong> the main Microsoft exam. Your team books it and covers the exam cost.</li>'
          '<li><strong>Become</strong> a certified professional once you pass.</li></ol>'
          '<p>Subjects: data reporting, presentations and spreadsheets. Learning material is in your course portal.</p>')
    bonus = ['One-to-one mentor calls', 'Mastering international clients', 'One place for the major AI assistants', 'A freelancing and consulting community',
             'Live mock client calls', 'Live sessions with founders and chief executives', 'Help to set up client payments and invoices',
             'Weekly profile and portfolio reviews', 'Microsoft certification with the exam cost covered', 'Access to premium AI tools']
    bon = '<ul class="lux-list">' + ''.join(f'<li>{e(x)}</li>' for x in bonus) + '</ul><p class="ws-note">Draft. Bonuses are planned and will be confirmed before the path goes live.</p>'
    plan = ('<ul class="lux-list one"><li><strong>Build, 5 weeks.</strong> Ten lessons, two live sessions a week of about three hours.</li>'
            '<li><strong>Sell, 4 weeks.</strong> Four lessons, two live sessions a week of about three hours.</li>'
            '<li><strong>Hackathon, 1 week.</strong> One capstone lesson: build, pitch and show.</li>'
            '<li><strong>Live Q and A.</strong> Five a week, optional: three by chat and two with an open microphone.</li></ul>')
    vk = ('<ul class="lux-list one"><li><strong>Visual.</strong> Every lesson starts with a picture of the steps.</li><li><strong>Aural.</strong> Say it aloud, listen on the audio version, and join live sessions.</li>'
          '<li><strong>Read and write.</strong> Short plain steps and five-line write-ups.</li><li><strong>Kinesthetic.</strong> Every lesson has a task you do with your hands, then tick off.</li>'
          '<li><strong>Authoring, training and learning and earning.</strong> You build, teach one step to a peer, and earn from real work.</li></ul>')
    hub = ('<section class="hero" aria-labelledby="h1"><div class="wrap hero-grid"><div><p class="kicker">learn and earn</p><h1 id="h1">AI side-income path</h1>'
           '<p>Twelve weeks to build and sell AI solutions as a side income. Learn it, practise it, and earn from it, in the way you learn best.</p>' + NOTE +
           f'<div class="ctas"><a class="btn" href="ai-income-1.html">Try lesson 1 free</a><a class="btn btn-ghost" href="start-a-course.html">How to join</a></div></div></div></section>\n')
    hub += sec('', 'pl', 'the plan', 'Twelve weeks in three parts', plan)
    road = ('<p>Each lesson follows the same flow: pre-read, live session, post-read. Steps open one by one as you join and as the dates arrive.</p>'
            '<ol class="lux-list one">'
            + ''.join(f'<li><strong>Lesson {k + 1}: {e(r[1])}.</strong> {"Free to read now." if k == 0 else "Opens when you join."} Pre-read, live session (join button, then watch recording), post-read notes.</li>' for k, r in enumerate(L))
            + '</ol><p class="ws-note">Draft. Dates are shown once the batch is confirmed. In this test no step is locked by date.</p>')
    hub += sec('alt', 'rm', 'your roadmap', 'Lesson by lesson', road)
    hub += sec('', 'bd', 'phase one', 'Build', f'<ul class="cards">{cards("Build")}</ul>')
    hub += sec('alt', 'sl', 'phase two', 'Sell', f'<ul class="cards">{cards("Sell")}</ul>')
    hub += sec('', 'hk', 'phase three', 'Hackathon', f'<ul class="cards">{cards("Hackathon")}</ul>')
    hub += sec('alt', 'vk', 'learn your way', 'For every kind of learner', vk)
    hub += sec('', 'ms', 'certificate', 'Your way to a Microsoft certificate', ms)
    hub += sec('alt', 'bn', 'also included', 'Ten extras that come with the path', bon)
    hub += sec('', 'jn', 'how to join', 'Join, then take every lesson', '<p>Lesson 1 is free to read. Join the path at the join step to open all lessons. Fees are shown at the join step. Pay by bank transfer or UPI. You can take a refund within 14 days.</p><p class="ws-note">Draft. Not live. In this test no real money is taken.</p>')
    page('ai-side-income', 'AI side-income path', 'Twelve weeks to build and sell AI solutions: ten build lessons, four sell lessons and a capstone.', hub,
         ('catalogue.html', 'Course catalogue'), ('ai-income-1.html', L[0][1]))
    print(N, 'lessons and 1 hub written')
if __name__ == '__main__':
    main()
