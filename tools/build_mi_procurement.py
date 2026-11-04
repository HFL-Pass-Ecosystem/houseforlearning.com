#!/usr/bin/env python3
"""Builds two pages about procurement analytics:
 - site/mi-procurement-analytics.html : internal market-intelligence entry (noindex, not in menus). Figures are the publisher's own.
 - site/topic-procurement-analytics.html : learning topic guide (outcomes, key ideas, practice cases). No fee shown. Process skills only.
Added to rebuild_all before build_nav."""
import sys, pathlib, re
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
e = B.e; S = B.S
SOURCE = ("Source: press release of Global Market Insights Inc., Procurement Analytics Market report, received 4 Nov 2026. "
          "Figures are the publisher's own and have not been checked against another source. "
          "The release also names five leading players; that list does not describe this software market and is left out here.")
MI = [("Headline", "The publisher states the market will cross USD 21.1 bn by 2035."),
      ("Market size", "Solutions segment USD 3.3 bn in 2025, projected 63.0% of revenue by 2035. Services segment projected USD 7.8 bn by 2035 (18.2% CAGR 2026-2035). Spend analytics USD 1.3 bn in 2025, 25.6% share by 2035."),
      ("Deployment and buyers", "Cloud USD 2.75 bn in 2025, 72.5% of revenue by 2035. Large enterprises USD 3.07 bn in 2025, 57.3% by 2035. Banking and financial services USD 0.8 bn in 2025, 15.2% by 2035."),
      ("Regions", "North America USD 1.6 bn in 2025 (34.0%). Europe USD 1.0 bn in 2025, 15.7% CAGR 2026-2035. Asia Pacific projected USD 6.8 bn by 2035 (32.2%), the fastest-growing region: China, India, Japan."),
      ("Drivers named by the publisher", "AI inside enterprise procurement platforms; procurement leaders mandated to move to analytics; agentic AI inside source-to-pay (supplier risk, bid analysis, contract intelligence, purchasing decisions); real-time supplier monitoring and resilience.")]
HEADING = ("Where it is heading (our reading of public commentary, direction only, no figures)",
  ["Spend analysis, supplier risk, contract reading and invoice matching are where buyers see value first.",
   "Software is moving from reports to assistants that suggest the next step; people still approve purchases.",
   "Data quality comes first: clean item codes, supplier records and contract dates decide whether analytics helps."])
def block(h,p): return f"<h2>{e(h)}</h2><p>{e(p)}</p>"
def mi_html(): return "".join(block(h,p) for h,p in MI)
def heading_html():
    return f"<h2>{e(HEADING[0])}</h2><ul>" + "".join(f"<li>{e(x)}</li>" for x in HEADING[1]) + "</ul>"
def us_html(items): return "<h2>What it means for us</h2><ul>" + "".join(f"<li>{e(x)}</li>" for x in items) + "</ul>"

def noindex(fn):
    p = S / fn; t = p.read_text()
    if 'name="robots"' not in t: t = t.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex,nofollow">', 1)
    p.write_text(t)

# ---- internal market-intelligence entry
US = ["Learning: procurement analytics is a skill with demand on both sides, buyers and the people who serve them. A topic guide is live; a full course is next.",
      "Earn: certificates in spend analysis and supplier records can be shown on a learner profile and used for work in the marketplace.",
      "Regions: Asia Pacific is the fastest-growing region in the publisher's view, which suits learners in India first.",
      "Next, not built: a full eight-module course, a practice data set, and a certificate. Nothing here is a promise of jobs or income."]
body = (B.sec('', 'mi0', 'source', 'Where these figures come from', f'<p class="callout">{e(SOURCE)}</p>')
        + "".join(B.sec('alt' if i % 2 == 0 else '', f'mi{i+1}', 'market', h, f'<p>{e(p)}</p>') for i, (h, p) in enumerate(MI))
        + B.sec('', 'mi7', 'direction', HEADING[0], '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in HEADING[1]) + '</ul>')
        + B.sec('alt', 'mi8', 'for us', 'What it means for us', '<ul>' + ''.join(f'<li>{e(x)}</li>' for x in US) + '</ul><p><a class="btn" href="topic-procurement-analytics.html">Open the learning topic</a></p>'))
B.page('mi-procurement-analytics.html', 'Procurement analytics: market intelligence', 'Internal market intelligence entry on procurement analytics.', 'Procurement analytics',
       'Size, growth, regions and drivers of the procurement analytics market, and what it means for learning and work. Internal.', body,
       '<li>Market intelligence</li><li aria-current="page">Procurement analytics</li>', kicker='market intelligence')
noindex('mi-procurement-analytics.html')

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
print('mi-procurement-analytics.html and topic-procurement-analytics.html written')
