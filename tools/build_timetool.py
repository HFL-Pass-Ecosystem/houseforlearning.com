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
 + sec('alt', 't4', 'many places at once', 'World clock', '<ul class="tt-clocks" id="tt-clocks" aria-label="World clock"></ul><div class="tt-grid">' + f('tt-add', 'Add a place', '<select id="tt-add"></select>') + '</div><p><button class="btn btn-sm" type="button" id="tt-addbtn">Add to the clock</button></p>')
 + sec('', 't5', 'find a time that suits everyone', 'Meeting planner', '<div class="tt-grid">' + f('tt-pdate', 'Day', '<input id="tt-pdate" type="date">') + f('tt-p1', 'Place 1', '<select id="tt-p1"></select>') + f('tt-p2', 'Place 2', '<select id="tt-p2"></select>') + f('tt-p3', 'Place 3 (optional)', '<select id="tt-p3"></select>') + '</div><div id="tt-plan"></div>')
 + sec('alt', 't6', 'days between and days later', 'Date maths',
  '<h3 class="ws-h3">Days between two dates</h3><div class="tt-grid">' + f('tt-a', 'First date', '<input id="tt-a" type="date">') + f('tt-b', 'Second date', '<input id="tt-b" type="date">') + '</div><p class="tt-big" id="tt-diff" role="status" aria-live="polite"></p>'
  '<h3 class="ws-h3">Add or take away days</h3><div class="tt-grid">' + f('tt-base', 'Start date', '<input id="tt-base" type="date">') + f('tt-n', 'Days (use a minus sign to go back)', '<input id="tt-n" type="number" step="1">') + '</div><p class="tt-big" id="tt-res" role="status" aria-live="polite"></p>'
  '<p class="ws-note">Everything runs in your own browser. Nothing you type is sent to us or stored.</p>'))
main = ('<main id="main" tabindex="-1"><section class="hero" aria-labelledby="h1"><div class="wrap hero-grid solo"><div><p class="kicker">live classes</p><h1 id="h1">Time and date tool</h1>'
        '<p>See any class in your own time zone, count down to it, add it to your calendar, compare clocks around the world and plan a meeting.</p></div></div></section>' + body + '</main>')
t = tpl
t = re.sub(r'<title>.*?</title>', lambda m: '<title>Time and date tool | House for Learning</title>', t, 1, re.S)
t = re.sub(r'<meta name="description" content=".*?">', lambda m: '<meta name="description" content="Class time in your own time zone, countdown, calendar file, world clock, meeting planner and date maths.">', t, 1)
t = re.sub(r'(<link rel="canonical" href="https://houseforlearning.com/)[^"]*', lambda m: m.group(1) + 'time-tool.html', t, 1)
t = re.sub(r'<ol class="crumbs">.*?</ol>', lambda m: '<ol class="crumbs"><li><a href="index.html">Home</a></li><li><a href="webinars.html">Webinars</a></li><li aria-current="page">Time and date tool</li></ol>', t, 1, re.S)
t = re.sub(r'<main id="main".*?</main>', lambda m: main, t, 1, re.S)
t = t.replace('<script src="assets/lang.js" defer></script>', '<script src="assets/lang.js" defer></script>\n<script src="assets/timetool.js" defer></script>', 1)
t = t.replace('<meta name="robots" content="noindex">', '')
(S / 'time-tool.html').write_text(t)
# Webinars picture links to the tool
w = (S / 'webinars.html').read_text()
if 'time-tool.html' not in w:
    m = re.search(r'<figure>(<svg class="art".*?</svg>)</figure>', w, re.S)
    w = w.replace(m.group(0), '<figure><a class="tt-pic" href="time-tool.html" aria-label="Open the time and date tool">' + m.group(1) + '</a><figcaption><a href="time-tool.html">Open the time and date tool</a></figcaption></figure>', 1)
    w = w.replace('Your own time zone', 'Your own time zone', 1)
    (S / 'webinars.html').write_text(w)
print('ok')
