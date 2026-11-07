#!/usr/bin/env python3
"""Adds the 'Our story' click-to-expand box to site/about.html (idempotent). Run: python3 tools/our_story_patch.py
Draft: the father's letter is NOT signed yet. Do not take this live until Mr. VR Raghavendra and Mrs. Meera R sign."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import our_story
SITE = os.path.join(HERE, "..", "site")
MAP = ".os{--ink:var(--ink);--mute:var(--muted);--card:var(--surface);--sand:var(--panel);--bg:var(--bg)}.os-box>summary h2{font-family:var(--lx-display,Georgia,serif);font-weight:500}\n"
open(os.path.join(SITE, "assets/our-story.css"), "w", encoding="utf-8").write(MAP + our_story.CSS)
p = os.path.join(SITE, "about.html"); t = open(p, encoding="utf-8").read()
if 'id="our-story"' not in t: t = t.replace("</main>", our_story.our_story("hfl") + "\n</main>", 1)
L = '<link rel="stylesheet" href="assets/our-story.css">'
if L not in t: t = t.replace("</head>", L + "</head>", 1)
open(p, "w", encoding="utf-8").write(t)
print("our story box added to site/about.html")
