#!/usr/bin/env python3
"""Builds site/topic-procurement-analytics.html: a learning topic guide (outcomes, key ideas, practice cases). No fee shown. Process skills only.
Own words, no outside names. (The internal market-intelligence page from the same draft is left out: it named an outside publisher.)"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = B.e
# ---- learning topic guide
OUTS = [("Explain", "what a spend cube is", "using a one-page sample purchase list", "naming supplier, category, period and amount"),
        ("Classify", "twenty purchase lines into categories", "from a clean list with item codes", "with no more than two lines in the wrong category"),
        ("Calculate", "share of spend, top ten suppliers and on-time delivery", "from a sample delivery record", "with every figure traceable to a line"),
        ("Judge", "whether a supplier record is complete enough to trust", "given a data-quality checklist", "listing each gap and who fixes it"),
        ("Plan", "three rule-based alerts a buying team could use", "for contract end dates, late deliveries and price jumps", "each with its trigger, owner and next step")]
IDEAS = [("Start with clean data", "Analytics is only as good as the item codes, supplier names and dates behind it. Fix the data first: one name per supplier, one code per item, a date on every line."),
         ("See the spend", "Group purchases by category, supplier and month. A few categories and suppliers usually hold most of the spend. That is where to look first."),
         ("Watch the record", "Track promised against actual delivery, and payments against terms. Late and early patterns show which suppliers to talk to."),
         ("Read the contract dates", "List contract and offer end dates. Alerts a month ahead leave time to renegotiate."),
         ("Let rules suggest, people decide", "Simple rules (a price rose more than a set share, a supplier was late three times) can suggest an action. A person approves every purchase.")]
CASES = ["Case 1: a list of 40 purchase lines with messy supplier names. Clean the names and count suppliers before and after.",
         "Case 2: monthly spend for a year. Find the three categories that hold most of the spend and say what you would ask about each.",
         "Case 3: twelve deliveries with promised and actual dates. Work out the on-time share and name the supplier to call first.",
         "Case 4: five contracts with end dates. Build the alert list for the next ninety days.",
         "Case 5: write three rules for a small buying team, each with trigger, owner and next step."]
body = (B.sec('', 'tp1', 'what you will be able to do', 'Outcomes', '<ul>' + ''.join(f'<li><span class="bz">{e(v)}</span> {e(t)}, {e(c)}, {e(s)}.</li>' for v, t, c, s in OUTS) + '</ul>')
        + B.sec('alt', 'tp2', 'key ideas', 'Five ideas to learn', '<ol>' + ''.join(f'<li><strong>{e(h)}.</strong> {e(p)}</li>' for h, p in IDEAS) + '</ol>')
        + B.sec('', 'tp3', 'practise', 'Practice cases', '<ul>' + ''.join(f'<li>{e(c)}</li>' for c in CASES) + '</ul>')
        + B.sec('alt', 'tp4', 'who it is for', 'Who this is for', '<p>Buyers, accounts and operations staff, engineers who raise purchase requests, and learners who want a skill employers ask for. No special software: a spreadsheet is enough.</p><p>This guide teaches process and reading of records. It gives no financial, tax or legal advice, and a named expert must review any real decision.</p>')
        + B.sec('', 'tp5', 'status', 'Where this stands', '<p>This is a topic guide. A full course with eight modules, worked examples, checks and a certificate is next, and is not built yet.</p><p><a class="btn" href="courses-all.html">See all courses</a></p>'))
B.page('topic-procurement-analytics.html', 'Procurement analytics: topic guide', 'A topic guide: read spend, supplier and contract records, and use simple rules to suggest actions. Five outcomes and five practice cases.', 'Procurement analytics',
       'Learn to read spend, delivery and contract records, clean the data behind them, and use simple rules to suggest what to do next.', body,
       '<li><a href="courses-hub.html">Courses</a></li><li aria-current="page">Procurement analytics</li>', kicker='learning topic')
print('topic-procurement-analytics.html written')
