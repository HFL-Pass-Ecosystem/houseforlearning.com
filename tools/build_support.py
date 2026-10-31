#!/usr/bin/env python3
"""Rebuilds the support, FAQ, safety, legal and contact pages (group 6 of the HFL makeover).

Keeps each page's <head>, header and footer as they are and replaces only <main>.
Run from the repo root: python3 tools/build_support.py
Text comes from the existing pages and the HFL content pack; nothing is invented here.
"""
import re, pathlib

SITE = pathlib.Path(__file__).resolve().parent.parent / "site"
MAIL = "engage@hfl-pass.com"
NT = '<span translate="no">House for Learning</span>'


def read(n):
    return (SITE / n).read_text(encoding="utf-8")


def pager(prev, nxt):
    def link(k, d, cls):
        return (f'<a class="pager-link {cls}" href="{d[0]}"><span class="pager-k">{k}</span>'
                f'<span class="pager-n">{d[1]}</span></a>')
    p = link("&larr; Previous page", prev, "pager-prev") if prev else "<span></span>"
    n = link("Next page &rarr;", nxt, "pager-next") if nxt else ""
    return (f'<nav class="pager" aria-label="Previous and next page"><div class="wrap pager-row">{p}{n}</div></nav>')


def hero(kicker, h1, lead, ctas="", meta=""):
    return (f'<section class="hero sx-hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div>'
            f'<p class="kicker">{kicker}</p><h1 id="h1">{h1}</h1><p class="sx-lead">{lead}</p>{meta}'
            f'<div class="ctas">{ctas}</div></div></div></section>')


def index(items):
    return ""
    li = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in items)
    return f'<nav class="sx-index" aria-label="On this page"><div class="wrap"><ol>{li}</ol></div></nav>'


def row(sid, kicker, title, body, alt=False):
    return (f'<section class="sec sx-row{" alt" if alt else ""}" id="{sid}" aria-labelledby="{sid}-h"><div class="wrap sx-grid">'
            f'<header class="sx-side"><p class="kicker">{kicker}</p><h2 id="{sid}-h">{title}</h2></header>'
            f'<div class="sx-body">{body}</div></div></section>')


def ruled(items):
    out = "".join(f'<li>{"<span class=sx-tag>" + t + "</span>" if t else ""}<h3>{h}</h3><p>{p}</p></li>' for t, h, p in items)
    return f'<ul class="sx-list">{out}</ul>'


def plain(items):
    return '<ul class="sx-plain">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def steps(items):
    return '<ol class="sx-steps">' + "".join(f"<li><h3>{h}</h3><p>{p}</p></li>" for h, p in items) + "</ol>"


def cta(h, p, a, b):
    return (f'<section class="cta" aria-labelledby="cta-h"><div class="wrap cta-inner"><div><p class="kicker">your next step</p>'
            f'<h2 id="cta-h">{h}</h2><p>{p}</p><div class="ctas">{a}{b}</div></div></div></section>')


BTN = '<a class="btn" href="{}">{}</a>'
GHOST = '<a class="btn btn-ghost" href="{}">{}</a>'

# ---------------------------------------------------------------- support
def support():
    main = hero("Support and access", "Help is close, and easy to ask for",
                "Learning works best when help is easy to find. Here is who supports you, how we make learning accessible, and how to ask for what you need.",
                BTN.format("contact.html#message-form", "Ask for help") + GHOST.format("faq.html", "Read the questions"))
    main += index([("who", "Who helps"), ("access", "Accessibility"), ("adjustments", "Adjustments"),
                   ("stations", "Where you study"), ("wellbeing", "Well-being"), ("parents", "Parents")])
    main += row("who", "who helps you", "People and guides on your side", ruled([
        ("support desk", "Learner support", "Help with sign-up, your learning record, access needs and well-being."),
        ("faculty", "Faculty", "Teach live classes, answer questions about a unit and give feedback."),
        ("coach", "Coach or mentor", "Helps you choose your next unit and keep going when it gets hard."),
        ("labs", "Lab supervisor", "A qualified person present for every hands-on unit on a training rig."),
        ("coming soon", "Loka and Vidya", "Our AI guides: Loka for finding a path, Vidya for study help. Both will say they are AI, and will hand you to a person when you ask."),
    ]), alt=True)
    main += row("access", "accessibility", "Learning built for everyone", '<ul class="sx-cols">' + "".join(f"<li>{t}</li>" for t in [
        "Captions on every live session",
        "Plain words, short sentences and one idea at a time",
        "Pages that work with a keyboard and a screen reader, and are checked for contrast and clear headings",
        "Text you can enlarge without losing anything",
        "Short units you can pause and pick up later",
        "Each language checked by a native speaker before it is shown",
        "Transcripts and low-data versions of units <em>(planned)</em>",
        "A read-along voice in your language <em>(planned)</em>"]) + "</ul>")
    main += row("adjustments", "adjustments", "Asking for an adjustment", steps([
        ("Tell us", "Use the contact form and choose “Learner support or an adjustment”. You do not need to share medical details."),
        ("Agree it", "Together we agree what helps, such as extra time, another format, a quiet room or a support person."),
        ("Keep it private", "The adjustment is noted privately on your record so you do not have to ask again."),
        ("Review it", "We check each term that it still works for you."),
    ]), alt=True)
    main += row("stations", "where you study", "Study stations: campus or home", ruled([
        ("at home", "Home study station", "A quiet corner, a device, headphones and a steady connection. A 10-minute break is enough for many units."),
        ("on campus", "Campus study station", "A booked desk with a device and headphones, close to learner support."),
        ("hands-on", "Practice station", "For hands-on units only: a campus training rig, de-energised, with a supervisor present."),
    ]))
    main += row("wellbeing", "safety and well-being first", "Looking after you while you learn", plain([
        "Safety units always come before hands-on work",
        "Training rigs are de-energised, and a qualified supervisor is present",
        "Breaks are built into longer units",
        "Anyone can stop a task they think is unsafe",
        "You can raise a concern with learner support at any time",
        "A safeguarding role looks after learners under 18"]) +
        '<p class="sx-more"><a href="safety.html">Read about safety</a></p>', alt=True)
    main += row("parents", "for parents and guardians", "If your child learns with us", plain([
        "Learners under 16, or the age set by local law, need your consent to join",
        "We never show advertising and never sell anyone’s data",
        "Hands-on units are always supervised, and safety units come first",
        "Every data choice starts switched off, and you can ask to see or delete the record",
        "A safeguarding role is responsible for young learners"]) +
        '<p>Questions? Use the contact form and choose “A question from a parent or guardian”. A person reads every message.</p>')
    main += cta("Need help now?", "Tell us what you need. A person reads every message and writes back.",
                BTN.format("contact.html#message-form", "Contact form"), GHOST.format("faq.html", "Questions"))
    main += pager(("credits.html", "How credits stack"), ("faq.html", "Questions (FAQ)"))
    return main


# ---------------------------------------------------------------- faq
FAQ = [
    ("start", "getting started", "Getting started", [
        ("Where do I start?", 'Pick the subject family closest to your work in the <a href="catalogue.html">catalogue</a> and take its first unit. If you are unsure, our learner support desk will suggest one.'),
        ("How long is a unit?", "Between 5 and 90 minutes. Most first units take 10 to 15 minutes."),
        ("Do I need to be near a campus?", "No. Most units work at a home study station. Hands-on units need a supervised practice station on a campus."),
        ("Where will " + NT + " be offered?", "Online, everywhere. The group plans offices across India and hubs abroad that will serve learners worldwide with partners. Each location is announced when it opens."),
        ("What do head, heart and hands mean?", "Every unit has an outcome for what you know, why it matters to you, and what you can do."),
    ]),
    ("credits", "pathways and credits", "Pathways and credits", [
        ("Do units add up to something bigger?", 'That is the plan: units into micro-credits, short courses, a certificate stage, and then diploma and degree pathways. See <a href="credits.html">how credits stack</a>.'),
        ("Is " + NT + " accredited?", "We make no accreditation claim. A degree can only be awarded by a body entitled to award it, and any degree pathway will be named only once an agreement is in place."),
        ("What is learn and earn?", "A planned route to study and work on real projects at the same time, with study time protected and safety first."),
        ("What if I fail a quick check?", "Review your answers and try again. The pass mark is 80%, and your best score is kept."),
    ]),
    ("live", "live classes", "Live classes", [
        ("When are the live classes?", "Dates open with the members area. Members will see the calendar in their own time zone."),
        ("Do live classes have captions?", "Yes. Every live session will have captions in the session language."),
    ]),
    ("support", "support", "Support and accessibility", [
        ("Can I get extra time or another format?", 'Yes. Ask learner support for an adjustment; you do not need to share medical details. See <a href="support.html#adjustments">adjustments</a>.'),
        ("I am a parent. What can my child do here?", 'Young learners can join with your consent if they are under 16, or the age set by local law. See <a href="support.html#parents">for parents and guardians</a>.'),
        ("Who can I talk to if something feels unsafe?", "Stop the task and tell learner support or the lab supervisor straight away. Anyone can stop a task they think is unsafe."),
        ("Are Loka and Vidya real people?", "No. They are our AI guides and they will always say so. They are coming soon, and they will hand you to a person when you ask."),
    ]),
    ("member", "membership and payments", "Membership, payments and your data", [
        ("How much does it cost?", "Membership from $5 a year for eligible people. Plans for organisations, and for people who can pay more, are shown after sign-in."),
        ("How do I pay?", 'By UPI or direct bank payment. For a bank payment you choose Request payment details and we send them to you by email. We never publish bank numbers on this site. See <a href="payments.html">payments</a>.'),
        ("Can I get my money back?", "Full refund within 14 days, then unused months less 10%. There is no exit fee, and membership does not renew by itself unless you switch renewal on."),
        ("Do you sell my data?", "No. Every data choice starts switched off, and we never sell your data or show advertising."),
        ("Is sign-up open now?", "Online sign-up opens with the members area. Until then, the Members login button takes you to the contact form."),
    ]),
    ("org", "organisations", "For employers and institutions", [
        ("Can you build learning for my team?", 'Yes. We map your roles to units and an onboarding ladder. See <a href="organisations.html">For organisations</a>.'),
        ("Will I see my staff’s private answers?", "No. Organisations see insights only at team level, for groups large enough that no one can be singled out, and only for learners who switched sharing on."),
        ("Can trainers teach our units?", "Experienced practitioners can follow the trainer and coach pathway to teach and assess with our units."),
    ]),
]


def faq():
    main = hero("You asked", "Questions and answers",
                "Plain answers to the questions people ask most. If yours is not here, write to us and a person will reply.",
                BTN.format("contact.html#message-form", "Ask a question"))
    main += index([(g[0] + "-faq", g[2].split(",")[0]) for g in FAQ])
    main += ('<section class="sx-find"><div class="wrap"><label for="faq-find">Search the questions</label>'
             '<input type="search" id="faq-find" placeholder="Type a word, such as refund or captions" autocomplete="off">'
             '<p class="sx-count" id="faq-count" role="status" aria-live="polite"></p></div></section>')
    for n, (gid, kick, title, qs) in enumerate(FAQ):
        det = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in qs)
        main += row(gid + "-faq", kick, title, f'<div class="sx-faq">{det}</div>', alt=bool(n % 2 == 0))
    main += '<section class="sx-none" id="faq-none" hidden><div class="wrap"><p>No question matches that. <a href="contact.html#message-form">Ask us directly</a>.</p></div></section>'
    main += cta("Still wondering?", "Write to us. A person reads every message and writes back.",
                BTN.format("contact.html#message-form", "Contact form"), GHOST.format("catalogue.html", "Course catalogue"))
    main += pager(("support.html", "Support and access"), ("contact.html", "Contact"))
    return main


# ---------------------------------------------------------------- safety
POSTERS = [
    ("Evacuation", ["Stop work", "Leave by the marked route", "Help others", "Go to the assembly point"], 1),
    ("Fire", ["Raise the alarm", "Check your exit", "Small fire only", "Close doors behind you"], 1),
    ("First aid", ["Check for danger", "Call for help", "Use the kit and defibrillator", "Stay until help arrives"], 1),
    ("Electrical safety", ["Switch off the supply", "Keep clear", "Call for help", "Start first aid"], 2),
]
SEVEN = ["Prepare", "Mark the work area", "Isolate and secure", "Test for no voltage", "Earth and short-circuit",
         "Guard live parts nearby", "Close the permit"]
SIGNS = [
    ("Safe condition", ["Emergency exit route", "First aid point", "Assembly point", "Defibrillator", "Eye wash station", "Exit by the stairs"]),
    ("Fire", ["Fire extinguisher", "Fire alarm point", "Fire hose reel", "Emergency telephone"]),
    ("Warn", ["Electrical hazard", "Slip hazard", "Fall hazard", "Fire hazard"]),
    ("Stop", ["No open flame", "No entry", "Do not switch on", "Do not use lift in a fire"]),
    ("Must", ["Wear a helmet", "Wear eye protection", "Wear gloves", "Wear ear protection", "Wear safety boots",
              "Wear a high-visibility vest", "Wear a face mask", "Isolate and lock off"]),
]
L1 = ["Fundamentals of Risk Management", "International general certificate in occupational health and safety"]
L2 = ["PLC, Telemetry and SCADA Technologies", "Practical On-Line PLC Programming"]


def safety():
    main = hero("Safety first", "Safe habits come before skills",
                "Every hands-on unit starts with safety, runs on de-energised training rigs, and has a qualified supervisor present. Anyone can stop a task they think is unsafe.",
                BTN.format("contact.html", "Raise a concern") + GHOST.format("support.html#wellbeing", "How we look after you"))
    main += index([("promise", "Our promise"), ("posters", "Posters"), ("steps", "Seven steps"), ("signs", "Twenty-six signs")])
    main += row("promise", "our promise", "How we keep learning safe", plain([
        "Safety units always come before hands-on work",
        "Training rigs are de-energised, and a qualified supervisor is present",
        "Please never practise on live equipment",
        "Breaks are built into longer units",
        "Anyone can stop a task they think is unsafe",
        "A safeguarding role looks after learners under 18"]), alt=True)
    cols = ""
    for name, st, lvl in POSTERS:
        crs = L1 if lvl == 1 else L2
        meta = "level 1, 12 h" if lvl == 1 else "level 2, 24 h"
        cols += (f'<article class="sx-poster"><h3>{name}</h3><ol>' + "".join(f"<li>{s}</li>" for s in st) + "</ol>"
                 f'<p class="sx-learn"><span>Taught in</span>{crs[0]}; {crs[1]} <em>({meta})</em></p></article>')
    main += row("posters", "four poster routines", "What to do, in four steps", f'<div class="sx-posters">{cols}</div>')
    main += row("steps", "before work on electrical equipment", "Seven steps to safe isolation",
                '<ol class="sx-seven">' + "".join(f"<li>{s}</li>" for s in SEVEN) + "</ol>"
                f'<p class="sx-learn"><span>Taught in</span>{L2[0]}; {L2[1]} <em>(level 2, 24 h)</em></p>', alt=True)
    tbl = "".join(
        f'<div class="sx-sign"><h3>{c}<small>{len(v)}</small></h3><ul>' + "".join(f"<li>{x}</li>" for x in v) + "</ul></div>"
        for c, v in SIGNS)
    main += row("signs", "the sign set", "Twenty-six signs, five classes",
                f'<div class="sx-signs">{tbl}</div><p class="sx-note">Shapes and colours follow the common sign convention, so anyone can read them at a glance.</p>')
    main += cta("Something feels unsafe?", "Stop the task and tell learner support or the lab supervisor straight away. Then write to us.",
                BTN.format("contact.html#message-form", "Contact form"), GHOST.format("support.html", "Support and access"))
    main += pager(("terms.html", "Terms"), ("insights.html", "Insight tables"))
    return main


# ---------------------------------------------------------------- legal
def legal(kind):
    if kind == "privacy":
        sec = [
            ("collect", "What we collect", "<p>Only what you choose to send us in a form or email: your name, email, organisation, role, country and your message. We do not ask for identity documents, passport details, biometric data, health data or bank details through this website.</p>"),
            ("why", "Why we use it", "<p>To answer your message, to suggest courses, and to keep a record of our conversation. We do not sell your data, and we do not use it for advertising.</p>"),
            ("records", "Learning records (members area, opening soon)",
             "<p>When you join, you choose what we may learn about you, and every choice starts switched off. If you choose to help us learn, we record how you use our services so we can improve them for you. We do not use sensitive personal data, we never sell your data, and you can switch this off at any time in your settings.</p>"
             "<p>Organisations see learning insights only at team level, for groups large enough that no one can be singled out, and only for learners who switched sharing on.</p>"
             "<p>Learners under 16, or the age set by local law, need a parent or guardian’s consent before they sign up.</p>"),
            ("cookies", "Cookies and storage",
             '<p>This site sets no analytics, advertising or tracking cookies. It stores one item in your browser, and nothing else. <a href="cookies.html">See the full cookies page</a>.</p>'),
            ("who", "Who sees it", "<p>Only the staff who handle your message, and service providers that host our website and email under contract. We share data with authorities only when the law requires it.</p>"),
            ("keep", "How long we keep it", "<p>As long as needed to answer you and for any learning that follows, and then as the law requires. After that we delete it.</p>"),
            ("rights", "Your rights", "<p>You can ask to see, correct, download or delete your data, or withdraw your consent, at any time. We follow applicable data protection laws, including India’s Digital Personal Data Protection Act 2023, the EU and UK GDPR, the UAE data protection law and Canada’s PIPEDA, and give the same protection to visitors from other countries.</p>"),
            ("contact", "Contact", f'<p><a href="mailto:{MAIL}">{MAIL}</a></p>'),
        ]
        h = hero("privacy", "Privacy notice", f"What {NT} collects through this website, and why. Short, plain and in your favour.",
                 meta='<p class="meta">Last updated: on publishing</p>')
        pg = pager(("you-said.html", "You said, we did"), ("cookies.html", "Cookies"))
    elif kind == "cookies":
        tbl = ('<div class="table-wrap"><table class="data"><caption>Stored in your browser</caption><thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">How long</th></tr></thead><tbody>'
               '<tr><th scope="row" data-label="Name">learn-cookie-choice</th><td data-label="Purpose">Remembers whether you pressed Accept or Reject on the notice</td><td data-label="How long">Until you clear your browser storage</td></tr></tbody></table></div>')
        sec = [
            ("none", "What we set", "<p>This site sets no analytics, advertising or tracking cookies, and shares nothing with outside partners. Your browser keeps only your own choices.</p>" + tbl),
            ("fonts", "Typefaces", "<p>Our pages load typefaces from a public font service, which receives your browser’s address in order to send the fonts. It sets no cookies on this site.</p>"),
            ("optional", "If optional cookies are ever added", "<p>They stay off unless you accept, and this page will list them first.</p>"),
            ("choose", "Change your choice", '<p>Use <strong>Manage preferences</strong> in the notice at the foot of the page, or clear this site’s data in your browser to be asked again.</p>'),
            ("more", "More", '<p>Read the <a href="privacy.html">privacy notice</a> for what we collect and your rights, or write to <a href="mailto:' + MAIL + '">' + MAIL + "</a>.</p>"),
        ]
        h = hero("cookies", "Cookies and storage", "No tracking, no advertising. One small note in your browser remembers your choice.")
        pg = pager(("privacy.html", "Privacy"), ("terms.html", "Terms"))
    else:
        sec = [
            ("information", "Information only", "<p>The pages on this site describe our courses and how we teach. They are not an offer or a promise of a place. A place on a course exists only when we confirm it.</p>"),
            ("credits", "Credits and awards", "<p>Badges and stacking credits are planned. We make no accreditation claim. A degree can only be awarded by a body entitled to award it, and any degree pathway will be named only once an agreement is in place.</p>"),
            ("safety", "Safety", "<p>Hands-on units run only on de-energised training rigs with a qualified supervisor present. Please never practise on live equipment.</p>"),
            ("use", "Use of the site", "<p>Please do not try to break into, copy in bulk or misuse this site, or send harmful files or content through its forms.</p>"),
            ("messages", "Your messages", '<p>What you send us stays yours. We use it only to answer you, as the <a href="privacy.html">privacy notice</a> explains.</p>'),
            ("content", "Our content", f"<p>Text, drawings and course material on this site belong to {NT} unless stated otherwise. You may link to them, but please ask before copying them.</p>"),
            ("liability", "No liability for site errors", "<p>We work to keep the site accurate, but we are not liable for losses caused by errors or by the site being unavailable.</p>"),
            ("changes", "Changes", "<p>We may update these terms. The date at the top shows the latest version.</p>"),
            ("platform", "Dealing with us safely",
             "<p>We want every dealing with us to be simple, fair and safe for you. So we ask one thing: please arrange everything with us through this website, using its forms and the contact details shown on it. That includes questions, sign-ups, agreements, payments and any changes to them.</p>"
             '<ul class="sx-plain"><li><strong>We only recognise what is agreed here.</strong> An agreement, price or promise counts only when it is made or confirmed through this website. That keeps a clear written record, for you and for us.</li>'
             "<li><strong>Arrangements made elsewhere are at your own risk.</strong> If you arrange something with one of our staff, channels, partners or suppliers outside the website, for example by private message or through a personal account, we cannot see it or check it. That arrangement is at your own risk, and we cannot be responsible for it.</li>"
             "<li><strong>Your identity details are safe with us.</strong> The identity and verification details (often called KYC) that learners, members, suppliers and partners give us belong to the company. We keep them safely and use them only for the purpose they were given for. Misuse of these details, or of our name, may lead to legal action.</li>"
             '<li><strong>Tell us if something feels wrong.</strong> If anyone contacts you claiming to act for us outside the website, or asks you to pay somewhere else, please let us know through the <a href="contact.html">contact page</a>. We will check and reply.</li></ul>'
             "<p>Thank you for helping us keep every dealing open and fair.</p>"),
            ("renewing", "Paying and renewing",
             '<ul class="sx-plain"><li><strong>No hidden renewals.</strong> Membership is paid for one year in advance and does not renew by itself unless you choose to switch renewal on.</li>'
             "<li><strong>You see it before you pay.</strong> The price and the end date are shown on screen before any payment.</li>"
             "<li><strong>A reminder first.</strong> If you switch renewal on, we remind you before it renews, so you can change your mind.</li>"
             "<li><strong>Cancel in one click.</strong> You can stop renewal at any time from your account, with one click.</li>"
             "<li><strong>Deleting the app does not cancel.</strong> Removing an app or a bookmark does not stop a renewal. Please switch it off in your account.</li>"
             '<li><strong>Refunds.</strong> Full refund within 14 days, then unused months less 10%. No exit fee, ever. See <a href="payments.html">payments</a>.</li></ul>'),
            ("contact", "Contact", f'<p><a href="mailto:{MAIL}">{MAIL}</a></p>'),
        ]
        h = hero("terms", "Terms of use", f"The plain rules for using this website and dealing with {NT}.",
                 meta='<p class="meta">Last updated: on publishing</p>')
        pg = pager(("privacy.html", "Privacy"), ("safety.html", "Safety"))
    toc = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t, _ in sec)
    body = "".join(f'<section class="sx-clause" id="{i}" aria-labelledby="{i}-h"><h2 id="{i}-h">{t}</h2>{b}</section>' for i, t, b in sec)
    return (h + '<section class="sec sx-legal" aria-label="Text"><div class="wrap sx-legal-grid">'
            f'<nav class="sx-toc" aria-label="On this page"><p class="kicker">on this page</p><ol>{toc}</ol></nav>'
            f'<div class="sx-doc">{body}</div></div></section>' + pg)


# ---------------------------------------------------------------- contact
def contact(old):
    form = re.search(r"<form class=\"contact\".*?</form>", old, re.S).group(0)
    main = hero("say hello", "Contact us",
                "Tell us what you want to learn, or what your team needs. A person reads every message and writes back.",
                BTN.format("#message-form", "Write to us") + GHOST.format("faq.html", "Read the questions"))
    main += ('<section class="sec sx-contact" id="message-form" aria-labelledby="message-form-h"><div class="wrap sx-contact-grid">'
             '<div class="sx-formcol"><p class="kicker">general message form</p><h2 id="message-form-h">Send us a message</h2>' + form + "</div>"
             '<aside class="sx-aside" aria-label="Other ways to reach us"><h3>Write to us</h3><dl class="details">'
             f'<dt>Email</dt><dd><a href="mailto:{MAIL}">{MAIL}</a></dd>'
             "<dt>Members</dt><dd>Members login opens with the members area. Until then, use this form.</dd>"
             "<dt>Loka and Vidya</dt><dd>Our AI guides are coming soon.</dd></dl>"
             '<h3>Before you write</h3><ul class="sx-plain">'
             "<li>We never ask for passwords, identity documents or bank details through this site</li>"
             "<li>Under 16? Ask a parent or guardian to write with you</li>"
             "<li>Course fees are shown to members after sign-in</li></ul>"
             '<p class="sx-more"><a href="faq.html">Questions we are often asked</a></p></aside></div></section>')
    main += pager(("faq.html", "Questions (FAQ)"), ("you-said.html", "You said, we did"))
    return main


# ---------------------------------------------------------------- write
def swap(name, main, body_class="learn sx"):
    s = read(name)
    s = re.sub(r"<main id=\"main\" tabindex=\"-1\">.*?</main>", lambda m: f'<main id="main" tabindex="-1">\n{main}\n</main>', s, flags=re.S)
    if "support-lux.css" not in s:
        s = s.replace('<link rel="stylesheet" href="assets/site-lux.css">',
                      '<link rel="stylesheet" href="assets/site-lux.css">\n<link rel="stylesheet" href="assets/support-lux.css">')
    s = re.sub(r'<body class="[^"]*"', f'<body class="{body_class}"', s, count=1)
    if name == "faq.html" and "support.js" not in s:
        s = s.replace('<script src="assets/lang.js" defer></script>', '<script src="assets/lang.js" defer></script>\n<script src="assets/support.js" defer></script>')
    (SITE / name).write_text(s, encoding="utf-8")


def make_cookies():
    s = read("privacy.html")
    s = s.replace("Privacy notice | ", "Cookies and storage | ", 1) if "Privacy notice | " in s else s
    s = re.sub(r"<title>.*?</title>", "<title>Cookies and storage | House for Learning</title>", s, count=1)
    s = re.sub(r'(<meta name="description" content=")[^"]*', r"\1No tracking and no advertising cookies: the one item this site keeps in your browser, and how to change your choice.", s, count=1)
    s = s.replace("https://houseforlearning.com/privacy.html", "https://houseforlearning.com/cookies.html")
    s = re.sub(r'(<li aria-current="page">)[^<]*(</li>)', r"\1Cookies\2", s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', r"\1Cookies and storage | House for Learning", s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', r"\1No tracking and no advertising cookies: the one item this site keeps in your browser.", s, count=1)
    (SITE / "cookies.html").write_text(s, encoding="utf-8")
    swap("cookies.html", legal("cookies"))


if __name__ == "__main__":
    old_contact = read("contact.html")
    swap("support.html", support())
    swap("faq.html", faq())
    swap("safety.html", safety())
    swap("privacy.html", legal("privacy"))
    swap("terms.html", legal("terms"))
    swap("contact.html", contact(old_contact))
    make_cookies()
    print("built support, faq, safety, privacy, terms, contact, cookies")
