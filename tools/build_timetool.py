#!/usr/bin/env python3
"""Builds site/time-tool.html (the HFL time and date tool) around assets/timetool.js, and links the Webinars picture to it."""
import re, html, pathlib
R = pathlib.Path(__file__).resolve().parents[1]; S = R / 'site'; e = html.escape
tpl = (S / 'catalogue.html').read_text()
def sec(cls, i, kick, h2, inner):
    return f'<section class="sec {cls}" aria-labelledby="{i}"><div class="wrap"><div class="sec-head"><p class="kicker">{e(kick)}</p><h2 id="{i}">{e(h2)}</h2></div><div class="sec-body">{inner}</div></div></section>'
def f(i, label, inner): return f'<div class="field"><label for="{i}">{e(label)}</label>{inner}</div>'
inp = lambda i, t, extra='': f'<input id="{i}" type="{t}" {extra}>'
sel = lambda i: f'<select id="{i}"></select>'
body = (
 sec('', 't1', 'one class, any place', 'Class time in your time zone',
  '<p>Your time zone is <strong id="tt-yourzone">detected</strong>. You can change it below.</p><div class="field-row">' + f('tt-date', 'Class date', inp('tt-date', 'date')).replace('<label for="tt-date">', '<label for="tt-date">') + '</div>'
  if False else
  '<p>Your time zone is <strong id="tt-yourzone">detected</strong>. You can change it below.</p><div class="tt-grid">'
  + f('tt-date', 'Class date', '<input id="tt-date" type="date">') + f('tt-time', 'Class time', '<input id="tt-time" type="time">')
  + f('tt-from', 'Class is held in', '<select id="tt-from"></select>') + f('tt-to', 'Show it in', '<select id="tt-to"></select>')
  + '</div><p><button class="btn btn-sm btn-ghost" type="button" id="tt-mine">Use my time zone</button></p><p class="tt-big" id="tt-conv" role="status" aria-live="polite"></p>')
 + sec('alt', 't2', 'until the class', 'Countdown', '<p class="tt-big" id="tt-count" role="timer"></p><p>It counts down to the class time chosen above.</p>')
 + sec('', 't3', 'add to your calendar', 'Calendar file',
  '<div class="tt-grid">' + f('tt-title', 'Name of the class', '<input id="tt-title" type="text" maxlength="80" value="HFL live class">') + f('tt-mins', 'Length in minutes', '<input id="tt-mins" type="number" min="15" max="600" value="60">')
  + '</div><p><button class="btn" type="button" id="tt-ics">Download calendar file (.ics)</button></p><p id="tt-ics-note" role="status" aria-live="polite"></p><p>The file opens in the calendar on your phone or computer and keeps the class at the right moment in your own time zone.</p>')
)
main = ('<main id="main" tabindex="-1"><section class="hero th-hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">live classes and learning across zones</p><h1 id="h1">Time and date hub</h1>'
        '<p>World clocks, time zones, calendars, timers, calculators, sun, moon and weather in one place. Free to use, no adverts, and everything is worked out in your own browser.</p></div></div></section>'
        '<section class="th-wrap" aria-label="Time and date hub"><div class="wrap"><div id="th-app"><p>Loading the hub…</p></div><noscript><p>The hub needs JavaScript. Please turn it on in your browser.</p></noscript></div></section>'
        '<div id="classes-wrap">' + body + '</div></main>')
t = tpl
t = re.sub(r'<title>.*?</title>', lambda m: '<title>Time and Date Hub | House for Learning</title>', t, 1, re.S)
t = re.sub(r'<meta name="description" content=".*?">', lambda m: '<meta name="description" content="Free time and date hub: world clock, time zones, meeting planner, calendars and holidays, timers and countdowns, calculators, sun, moon and weather. No adverts.">', t, 1)
t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + 'time-tool.html', t, 1)
t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li><li><a href="webinars.html">Webinars</a></li><li aria-current="page">Time and date hub</li></ol>', t, 1, re.S)
t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, 1, re.S)
t = t.replace('<script src="assets/lang.js" defer></script>', '<script src="assets/lang.js" defer></script>\n<link rel="stylesheet" href="assets/timehub.css">\n<script src="assets/th-widget.js" defer></script>\n<script src="assets/th-core.js" defer></script>\n<script src="assets/th-time.js" defer></script>\n<script src="assets/th-cal.js" defer></script>\n<script src="assets/timetool.js" defer></script>\n<script src="assets/th-sky.js" defer></script>', 1)
t = t.replace('<meta name="robots" content="noindex">', '')
(S / 'time-tool.html').write_text(t)
# Webinars picture links to the tool
w = (S / 'webinars.html').read_text()
if 'time-tool.html' not in w:
    m = re.search(r'<figure>(<svg class="art".*?</svg>)</figure>', w, re.S)
    w = w.replace(m.group(0), '<figure><a class="tt-pic" href="time-tool.html" aria-label="Open the time and date hub">' + m.group(1) + '</a><figcaption><a href="time-tool.html">Open the time and date hub</a></figcaption></figure>', 1)
    w = w.replace('Your own time zone', 'Your own time zone', 1)
    (S / 'webinars.html').write_text(w)
print('ok')
