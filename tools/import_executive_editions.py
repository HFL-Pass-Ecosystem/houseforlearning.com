#!/usr/bin/env python3
"""Brings the Executive Programme page (four editions) into the site.

The page is written and rebuilt in its own project folder (ajan-sns-executive: source/template.html and
source/build.py). It comes in one file in Artifact format: no doctype, html or body tags, with its CSS and
JavaScript inline and its typefaces loaded from an outside font service. This site refuses all three
(netlify.toml: Content-Security-Policy with style-src, script-src and font-src 'self'), so this script:

  1. takes the page as built, unchanged in its own folder;
  2. removes the review-only lines: the preview strip at the top, the preview paragraph in the footer and
     the preview sentences in the form confirmation;
  3. says "Ajan SNS" instead of "the Ajan SNS ecosystem" (public pages carry no "ecosystem" wording);
  4. sends the register-interest form to the site's message service (/api/messages, the route the
     Contact page uses), with the same hidden spam field, and shows the reference it returns;
  5. writes the CSS and JavaScript to their own files under assets/executive/, with the typefaces
     (Montserrat and JetBrains Mono, SIL Open Font License) served from the site itself;
  6. applies the few style attributes the page writes into its markup through the style object, which
     the security policy allows (it refuses style attributes in markup);
  7. wraps it all in a full page: lang="en", a viewport, the site's head (canonical address, favicons,
     message service), and links to the site's home, contact, privacy, cookies and terms pages;
  8. points the "Open the Learning Room" link (id roomLink, added in version 5) at the site's own Learning Room,
     learning-room/, in the same tab, when site/learning-room/index.html is in this branch; otherwise it leaves
     the whole block (id roomGo) out, so the page never links to a room the site does not have, nor to the
     room's private review page. Run the import again once the room is in the branch.

The page stays out of search results (noindex) until the owner says it may be published.

Run from the repository root after each rebuild of the page:
    python3 tools/import_executive_editions.py /mnt/project-files/ajan-sns-executive/hfl-executive-programme.html
Writes site/executive-programme.html and site/assets/executive/editions.css and editions.js.
Never edit those three by hand: change the page's own template, rebuild it, and run this again.
"""
import html
import pathlib
import re
import sys

R = pathlib.Path(__file__).resolve().parents[1]
SITE = R / 'site'
OUT = SITE / 'assets' / 'executive'
PAGE = 'executive-programme.html'
URL = 'https://houseforlearning.com/' + PAGE
TITLE = 'Executive Programme: four editions | House for Learning'
NOTE = '/* Built by tools/import_executive_editions.py from the Executive Programme page. Do not edit by hand. */\n'


def fail(msg):
    sys.exit('import_executive_editions: ' + msg)


def once(text, old, new, what):
    """Replace exactly one occurrence of old, or stop: a rebuild that moved it must be looked at."""
    n = text.count(old)
    if n != 1:
        fail(f'{what}: expected the marked text once, found it {n} times. Look at the rebuilt page.')
    return text.replace(old, new)


def split(src):
    if '<style>' not in src or '</style>' not in src or '<script>' not in src or '</script>' not in src:
        fail('the page should hold one <style> and one <script> block')
    if src.count('<style>') != 1 or src.count('<script>') != 1:
        fail('the page should hold exactly one <style> and one <script> block')
    head, rest = src.split('<style>', 1)
    css, rest = rest.split('</style>', 1)
    body, rest = rest.split('<script>', 1)
    js, tail = rest.split('</script>', 1)
    if tail.strip():
        fail('unexpected markup after the script')
    return head, css, body, js


def head_value(head, pattern, what):
    m = re.search(pattern, head, re.S)
    if not m:
        fail(f'no {what} in the page head')
    return html.unescape(m.group(1).strip())


def fix_body(body):
    # 2. the review-only lines
    body, n = re.subn(r'<div class="strip" role="note"><div class="wrap">(?:(?!</div>).)*?Preview for review.*?</div></div>\s*', '', body, flags=re.S)
    if n > 1:
        fail('more than one preview strip')
    body, n2 = re.subn(r'\s*<p>Preview for review[^<]*</p>', '', body)
    if re.search(r'preview', re.sub(r'<[^>]+>', ' ', body), re.I):
        fail('the word "preview" is still in the page text')
    # 3. no "ecosystem" wording on public pages
    body = body.replace('the Ajan SNS ecosystem', 'Ajan SNS')
    if re.search(r'ecosystem', re.sub(r'<[^>]+>', ' ', body), re.I):
        fail('"ecosystem" is still in the page text')
    # 6. style attributes in the markup reach the browser as data-style (see CSP_STYLES)
    body = re.sub(r'(<[^<>]*?\s)style=(["\'])', r'\1data-style=\2', body)
    # 7. the site's own pages, in the footer
    links = ('<p class="site-links"><a href="index.html">House for Learning home</a> <span aria-hidden="true">·</span> '
             '<a href="contact.html">Contact</a> <span aria-hidden="true">·</span> <a href="privacy.html">Privacy</a> '
             '<span aria-hidden="true">·</span> <a href="cookies.html">Cookies</a> <span aria-hidden="true">·</span> '
             '<a href="terms.html">Terms</a></p>')
    body, n3 = re.subn(r'(<footer>.*?)</div>(\s*<div class="caps">)', lambda m: m.group(1) + links + '\n    </div>' + m.group(2), body, count=1, flags=re.S)
    if n3 != 1:
        fail('could not find the footer column for the site links')
    # 8. the Learning Room: the site's own room when this branch has it, else no link at all
    block = re.compile(r'\s*<div class="room-go" id="roomGo">.*?</a></div>', re.S)
    if len(block.findall(body)) != 1:
        fail('expected the Learning Room block (id roomGo) once. Look at the rebuilt page.')
    if (SITE / 'learning-room' / 'index.html').is_file():
        body, k = re.subn(r'<a class="([^"]*)" id="roomLink" data-room-link="1" href="[^"]*" target="_blank" rel="noopener">',
                          r'<a class="\1" id="roomLink" data-room-link="1" href="learning-room/">', body)
        if k != 1:
            fail('could not point the Learning Room link at learning-room/')
    else:
        body = block.sub('', body)
    if 'claude.ai' in body:
        fail('the page still links to a private review page')
    return body, n, n2


CSP_STYLES = r'''/* The site's security policy (style-src 'self') refuses style attributes written into markup. The page writes a
   few (rung heights, a margin or two). They reach the browser as data-style instead, and each is applied through
   the style object, which the policy allows: once for the page as loaded, and again whenever the page replaces
   part of itself. */
(function () {
  function apply(el) { var s = el.getAttribute('data-style'); el.removeAttribute('data-style'); if (s) el.style.cssText = s; }
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.hasAttribute('data-style')) apply(root);
    var list = root.querySelectorAll('[data-style]');
    for (var i = 0; i < list.length; i++) apply(list[i]);
  }
  var d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (d && d.set && d.get) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      configurable: true, enumerable: d.enumerable,
      get: function () { return d.get.call(this); },
      set: function (v) {
        if (typeof v === 'string' && v.indexOf('style=') !== -1) v = v.replace(/(<[^<>]*?\s)style=(["'])/g, '$1data-style=$2');
        d.set.call(this, v); scan(this);
      }
    });
  }
  scan(document.body);
})();
'''

SEND = r'''
/* ---------- the note goes to the site's message service (added when the page joined the site) ---------- */
function regMessage(ed){
  const v = R.vals, lines = [];
  lines.push('Edition: ' + (ed === 0 ? 'Not sure yet' : `Edition ${ed}, ${edOf(ed).title}`));
  lines.push('Way of study: ' + R.how);
  if (R.find) lines.push('How they found us: ' + R.find);
  if (v.regCode && v.regCode.trim()) lines.push('Referral code: ' + v.regCode.trim());
  if (v.regQ && v.regQ.trim()) lines.push('Question: ' + v.regQ.trim());
  lines.push('News about open live classes: ' + (v.regNews ? 'yes, asked for' : 'no'));
  return lines.join('\n');
}
function sendReg(){
  if (R.busy) return;
  const ed = R.ed == null ? S.ed : R.ed, v = R.vals;
  const m = document.querySelector('meta[name="messages-api"]');
  const api = (m && m.getAttribute('content')) || '/api/messages';
  const hp = document.getElementById('regWeb');
  R.busy = true; R.fail = false;
  const b = document.querySelector('#regForm button[type="submit"]'); if (b) b.disabled = true;
  toast('Sending...');
  fetch(api, {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name:(v.regName || '').trim(), email:(v.regEmail || '').trim(),
      topic:'Executive Programme: ' + (ed === 0 ? 'not sure yet' : `Edition ${ed}`), message:regMessage(ed),
      page:location.pathname, site:location.hostname, website: hp ? hp.value : ''})})
    .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(d => { R.busy = false; R.sent = true; R.ref = d && d.ref ? String(d.ref) : ''; renderReg(); goTo('register'); toast('Sent. We reply by email.'); })
    .catch(() => { R.busy = false; R.fail = true; renderReg(); goTo('register'); toast('Not sent. Please try again.'); });
}
'''


def fix_js(js):
    js = once(js, '/* ---------- register interest (this preview sends nothing) ---------- */',
              "/* ---------- register interest (sent to the site's message service) ---------- */", 'form heading')
    js = once(js, "const R = {ed:null, how:'Online', find:null, findMore:false, sent:false, err:'', vals:{}};",
              "const R = {ed:null, how:'Online', find:null, findMore:false, sent:false, err:'', vals:{}, busy:false, fail:false, ref:''};", 'form state')
    js = once(js, 'is noted on this page only. This is a preview, so nothing was sent.</p>',
              "has reached our admissions team${R.ref ? ` (reference <span class=\"code\">${esc(R.ref)}</span>)` : ''}.</p>", 'confirmation')
    js = once(js, '<p class="muted">On the live site, your note goes to the admissions team, who reply by email. You can start the free units at once.</p>',
              '<p class="muted">They reply by email. You can start the free units at once.</p>', 'confirmation note')
    js = once(js, '<form class="card form" id="regForm" novalidate>',
              '<form class="card form" id="regForm" novalidate>${R.fail ? `<p class="err" role="alert">We could not send your note just now. '
              'Please try again in a little while, or write to us on the <a href="contact.html">Contact page</a>.</p>` : \'\'}'
              '<div class="hp" aria-hidden="true"><label for="regWeb">Leave this empty</label><input id="regWeb" name="website" type="text" tabindex="-1" autocomplete="off"></div>',
              'form start')
    js = once(js, "R.err = ''; if (R.ed == null) R.ed = S.ed; R.sent = true; renderReg(); goTo('register');",
              "R.err = ''; if (R.ed == null) R.ed = S.ed; sendReg();", 'form submit')
    js = once(js, '/* ---------- start ---------- */', SEND.strip('\n') + '\n\n/* ---------- start ---------- */', 'start marker')
    if re.search(r'preview', js, re.I):
        fail('the word "preview" is still in the script')
    if re.search(r'ecosystem', js, re.I):
        fail('"ecosystem" is still in the script')
    return CSP_STYLES + js


EXTRA_CSS = '''
/* Added when the page joined the site: the site's own pages in the footer, and the hidden spam field. */
.site-links{margin-top:14px}
.site-links a{color:inherit;text-decoration:underline;text-underline-offset:3px}
.site-links a:hover{color:var(--accent-strong)}
.hp{position:absolute!important;left:-10000px!important;width:1px;height:1px;overflow:hidden}
'''


def main():
    if len(sys.argv) != 2:
        fail('usage: python3 tools/import_executive_editions.py <path to hfl-executive-programme.html>')
    src = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
    head, css, body, js = split(src)
    desc = head_value(head, r'<meta name="description" content="([^"]*)"', 'description')
    if 'fonts.googleapis.com' not in head:
        fail('the page no longer loads its typefaces from outside; check fonts.css still matches')
    if re.search(r'@import|url\(\s*["\']?https?:', css):
        fail('the CSS loads something from outside the site')
    if re.search(r'<(?:img|iframe|script|link)[^>]+(?:src|href)="https?:', body):
        fail('the markup loads something from outside the site')
    body, strips, notes = fix_body(body)
    js = fix_js(js)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'editions.css').write_text(NOTE + css.strip('\n') + '\n' + EXTRA_CSS, encoding='utf-8')
    (OUT / 'editions.js').write_text(NOTE + js.strip('\n') + '\n', encoding='utf-8')
    e = html.escape
    page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="messages-api" content="/api/messages">
<meta name="robots" content="noindex">
<title>{e(TITLE)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{URL}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="House for Learning">
<meta property="og:title" content="{e(TITLE)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{URL}">
<meta property="og:locale" content="en_GB">
<meta name="contact-url" content="contact.html">
<meta name="theme-color" content="#2b5d8a">
<link rel="icon" href="assets/brand/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="assets/brand/favicon-192.png"><link rel="apple-touch-icon" href="assets/brand/favicon-180.png">
<link rel="stylesheet" href="assets/executive/fonts.css">
<link rel="stylesheet" href="assets/executive/editions.css">
</head>
<body>
{body.strip(chr(10))}
<script src="assets/executive/editions.js"></script>
</body>
</html>
'''
    (SITE / PAGE).write_text(page, encoding='utf-8')
    print(f'wrote site/{PAGE}, assets/executive/editions.css and editions.js '
          f'(preview strip removed: {strips}, preview footer lines removed: {notes})')


if __name__ == '__main__':
    main()
