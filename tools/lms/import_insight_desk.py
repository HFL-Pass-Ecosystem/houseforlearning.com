#!/usr/bin/env python3
"""Import the House for Learning Insight Desk from the BI suite page (bi-suite/out/site/hfl/index.html) into site/.
Makes it fit the site's security rules (CSP: own files only, no inline script or style, no outside fonts):
  - the page <style> goes to assets/insight-desk.css and the <script> to assets/insight-desk.js
  - every style="..." (in HTML and in the script's templates) becomes data-s="...", applied by assets/insight-gate.js
  - Google Fonts are dropped (system fonts are used)
The desk is wrapped in a staff gate: assets/insight-gate.js shows it only to a facilitator or admin (checked by /api/lms).
Run:  python3 tools/lms/import_insight_desk.py path/to/bi-suite/out/site/hfl/index.html"""
import re, sys, os
SITE = os.path.join(os.path.dirname(__file__), '..', '..', 'site')
src = open(sys.argv[1], encoding='utf-8').read()
styles = re.findall(r'<style[^>]*>(.*?)</style>', src, re.S)
css = max(styles, key=len)
for f in ('"Montserrat",', '"Inter",', '"JetBrains Mono",'):
    css = css.replace(f, '')
css = ('/* House for Learning Insight Desk (staff only). Imported from the BI suite by tools/lms/import_insight_desk.py. DEMO DATA. */\n'
       '[hidden]{display:none!important}\n' + css +
       '\n.idk-gate{max-width:560px;margin:15vh auto;padding:24px;font-family:system-ui,sans-serif;background:var(--panel);border:1px solid var(--line);border-radius:8px;color:var(--ink)}\n.idk-gate a{color:var(--accent)}\n')
js = max(re.findall(r'<script[^>]*>(.*?)</script>', src, re.S), key=len)
js = js.replace('style="', 'data-s="').replace('(owner only)', '(restricted)')
assert 'style="' not in js
body = src[src.find('<body>') + 6:src.rfind('</body>')]
body = re.sub(r'<title>.*?</title>|<meta[^>]*>|<link[^>]*>|<style[^>]*>.*?</style>|<script[^>]*>.*?</script>', '', body, flags=re.S).strip()
body = body.replace('style="', 'data-s="').replace('(owner only)', '(restricted)')
views = sorted(set(re.findall(r'href="#([a-z][a-z0-9-]*)"', body)))
anchors = '<div hidden>' + ''.join(f'<span id="{v}"></span>' for v in views if f'id="{v}"' not in body) + '</div>'
open(os.path.join(SITE, 'assets', 'insight-desk.css'), 'w', encoding='utf-8').write(css)
open(os.path.join(SITE, 'assets', 'insight-desk.js'), 'w', encoding='utf-8').write(
    '/* Insight Desk charts and tables (DEMO DATA). Imported by tools/lms/import_insight_desk.py; style attributes are carried as data-s and applied by insight-gate.js. */\n' + js.strip() + '\n')
html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Insight Desk (staff) | House for Learning</title>
<meta name="description" content="Staff-only business insight desk for House for Learning. Demo data.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="assets/brand/favicon.ico" sizes="any">
<link rel="stylesheet" href="assets/insight-desk.css">
<script src="assets/insight-gate.js" defer></script>
<script src="assets/insight-desk.js" defer></script>
</head>
<body>
<div class="idk-gate" id="idk-gate" role="status" aria-live="polite"><p class="idk-gate-t"><strong>Insight Desk</strong></p><p id="idk-msg">Checking your staff sign-in.</p><p class="idk-login" hidden><a href="login.html?next=insight-desk.html">Staff sign in</a> &middot; <a href="index.html">Home</a></p></div>
<div id="idk-app" hidden>
{anchors}
{body}
</div>
</body>
</html>
'''
open(os.path.join(SITE, 'insight-desk.html'), 'w', encoding='utf-8').write(html)
print('Insight Desk imported:', len(views), 'views,', body.count('data-s='), 'styled elements in HTML')
