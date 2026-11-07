"""ATLE(it) logo + click funnel for a built static site.

Author it, Train it, Learn it, Earn it.  The logo is "ATLE" in capitals with a small lowercase "it" as a superscript.
Run on a finished site folder (idempotent, standard library only):
    python3 tools/atle/atle.py <site_dir> <ahfl|hfl-pass|yantra> [--template <relative html file>]
It (1) writes the logo SVG, one CSS file and one JS file, (2) writes the funnel page, (3) adds a slim ribbon under <body>
and a lateral strip above </footer> on every page, (4) swaps the old "Learn it to Earn it" invitation for the ATLE(it) wording.
No inline scripts (CSP). Nothing goes live from here: it only changes files in the folder you give it."""
import os, re, sys, html

# Logo drawn as paths (no font needed, so it looks the same everywhere). Blue to green, "it" lifted as a superscript.
LOGO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276 100" role="img" aria-labelledby="t"><title id="t">ATLE(it): Author it, Train it, Learn it, Earn it</title>
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0F85DB"/><stop offset="1" stop-color="#3CC261"/></linearGradient></defs>
<g fill="none" stroke="url(#g)" stroke-width="11" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="4" transform="translate(0,6)">
<path d="M5 84 L30 22 L55 84 M14 62 H46"/><path d="M64 22 H114 M89 22 V84"/><path d="M128 22 V84 H168"/><path d="M216 22 H182 V84 H216 M182 53 H210"/></g>
<g fill="none" stroke="#3CC261" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M240 24 V44"/><path d="M257 12 V36 Q257 44 266 44 M249 24 H266"/></g><circle cx="240" cy="14" r="4.4" fill="#3CC261"/></svg>
'''

CSS = '''/* ATLE(it): shared by every page. Light surfaces with their own colours so it sits on any site theme. */
.atle-rib{background:#F2EEE2;color:#14202b;font:600 .8rem/1.2 Montserrat,system-ui,sans-serif;text-align:right;padding:6px 16px}
.atle-rib a{color:#0B66A8;text-decoration:none;display:inline-flex;align-items:center;gap:8px;min-height:32px}
.atle-rib a:hover{text-decoration:underline}.atle-rib img{height:22px;width:auto;display:block}
.atle-rib a:focus-visible,.atle-foot a:focus-visible,.atle-pg a:focus-visible{outline:3px solid #0F85DB;outline-offset:2px}
.atle-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px 28px;margin:0 auto;max-width:1100px;padding:14px 16px;font:500 .85rem/1.4 Montserrat,system-ui,sans-serif;color:inherit}
.atle-foot img{height:30px;width:auto;display:block}.atle-foot a{color:inherit}.atle-foot span{flex:1 1 220px}
.atle-in{white-space:nowrap;font-weight:700;color:#0B66A8;text-decoration:none}.atle-in sup{font-size:.6em;font-weight:700;text-transform:none;color:#1f7a3a;margin-left:1px}.atle-in:hover{text-decoration:underline}
.atle-pg{font-family:Montserrat,system-ui,sans-serif;color:#14202b;background:#fff}.atle-pg .w{max-width:1100px;margin:0 auto;padding:0 16px}
.atle-hero{background:#F2EEE2;padding:40px 0}.atle-hero img{width:min(420px,80%);height:auto;display:block;margin:0 0 14px}
.atle-hero h1{font-size:clamp(1.5rem,3.2vw,2.2rem);line-height:1.2;margin:0 0 10px}.atle-hero p{max-width:640px;line-height:1.7;margin:0}
.atle-steps{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0 0;padding:0}
.atle-acts{display:flex;flex-wrap:wrap;gap:12px}
.atle-steps .atle-btn{padding:12px 22px}
.atle-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;padding:28px 0}
.atle-card{border:1px solid #d9d4c5;border-top:5px solid #0F85DB;border-radius:14px;padding:22px;background:#fff}
.atle-card.g{border-top-color:#3CC261}.atle-card h2{font-size:1.15rem;margin:0 0 8px}.atle-card p{line-height:1.65;margin:0 0 14px}
.atle-btn{display:inline-flex;align-items:center;justify-content:center;background:#0B66A8;color:#fff;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:999px;min-height:44px;box-sizing:border-box}
.atle-btn:hover{background:#094f82}.atle-btn.alt{background:#fff;color:#0B66A8;border:2px solid #0B66A8}
.atle-suite{border:1px solid #d9d4c5;border-radius:14px;padding:22px;margin:0 0 28px;background:#F2EEE2}
.atle-suite ul{margin:0;padding-left:1.2em;line-height:1.9}.atle-own{border:1px solid #d9d4c5;border-left:5px solid #3CC261;border-radius:14px;padding:22px;margin:0 0 28px;background:#fff}.atle-own h2{font-size:1.15rem;margin:0 0 8px}.atle-own p{line-height:1.65;max-width:720px}.atle-own-steps{line-height:1.8;padding-left:1.2em}.atle-note2{font-size:.88rem;color:#4a5a68}.atle-lock{font-weight:600}
.atle-tiers{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 14px;padding:0;list-style:none}.atle-tiers li{background:#F2EEE2;border-radius:10px;padding:10px 14px;font-weight:600}
.atle-note{font-size:.88rem;color:#4a5a68;padding-bottom:36px}
'''

# Reveals the creator suite when the members app has marked this browser as an Author or Trainer. No inline script.
JS = '''(function(){try{var r=localStorage.getItem("atle-role");if(r==="author"||r==="trainer"||r==="both"){document.documentElement.setAttribute("data-atle-role",r);}}catch(e){}
var s=document.getElementById("atle-suite-open"),l=document.getElementById("atle-suite-locked");
if(s&&l&&document.documentElement.getAttribute("data-atle-role")){s.hidden=false;l.hidden=true;}})();
'''

SITES = {
 # root: how pages link to each other. "rel" = flat relative links, "abs" = root-absolute links.
 'ahfl': dict(contact='contact.html', author='diy-atle-workflow-author.html', train='diy-atle-workflow-trainer.html', learn='diy-atle-workflow-learner.html', earn='diy-atle-workflow-earner.html', mode='rel', page='atle.html', template='help.html', name='AHFL Global', signin='signin.html',
   market='grow-marketplace.html', work='grow-workplace.html', how='diy-atle-workflow.html', join='join.html',
   suite=[('Author Studio', 'diy-atle-workflow-author.html'), ('Trainer certification', 'diy-atle-workflow-trainer.html'), ('Earner marketplace', 'diy-atle-workflow-earner.html')],
   prices=False),
 'hfl-pass': dict(contact='help.html', author='studio/index.html', train='studio/guide.html', learn='who.html', earn='plans.html', mode='rel', page='atle.html', template='help.html', name='HFL-Pass', signin='signin.html',
   market='who.html', work='stack.html', how='onboard.html', join='onboard.html',
   suite=[('Studio: scripts, images, video, documents', 'studio/index.html'), ('Studio guide', 'studio/guide.html')],
   prices=True),
 'hfl': dict(contact='contact.html', author='author-a-module.html', train='webinars.html', learn='courses-all.html', earn='workplace.html', mode='rel', page='atle.html', template='contact.html', name='House for Learning', signin='login.html',
   market='marketplace.html', work='workplace.html', how='how-learning-works.html', join='membership.html',
   suite=[('Author a module', 'author-a-module.html'), ('Start a course', 'start-a-course.html')], prices='member'),
 'yantra': dict(contact='/contact/', author='/start/academy/', train='/start/academy/', learn='/start/learn/', earn='/start/careers/', mode='abs', page='/atle/', template='start/learn/index.html', name='Yantra Global', signin='/signin/',
   market='/start/buy/', work='/platform/', how='/start/learn/', join='/start/',
   suite=[('Academy: build and teach a course', '/start/academy/'), ('Learn', '/start/learn/')],
   prices=True),
}
STRIP_TEXT = 'Author it, Train it, Learn it, Earn it'
NEW_LINE = 'Author it, Train it, Learn it, Earn it ('
MARK = 'data-atle'

def rel_prefix(path, root):
    d = os.path.relpath(os.path.dirname(path), root)
    return '' if d == '.' else '../' * (d.count(os.sep) + 1)

def href(cfg, target, prefix):
    if cfg['mode'] == 'abs' or target.startswith('/'): return target
    return prefix + target

def funnel_main(cfg, P):
    h = lambda t: href(cfg, t, P)
    suite = ''.join(f'<li><a href="{h(u)}">{html.escape(n)}</a></li>' for n, u in cfg['suite'])
    if cfg['prices'] == 'member':
        tiers = f'<p>Pay as you go. See <a href="{h(cfg["join"])}">Membership</a> for plans. 14-day refund. No automatic renewal.</p>'
    elif cfg['prices']:
        tiers = ('<ul class="atle-tiers"><li>USD 39 per learner per month</li><li>USD 79 per learner per month</li><li>Membership USD 5 a year</li></ul>'
                 '<p>Pay as you go. 14-day refund. No automatic renewal. Payment by bank transfer or UPI only.</p>')
    else:
        tiers = ('<ul class="atle-tiers"><li>Membership from USD 5 a year</li></ul>'
                 '<p>Pay as you go. 14-day refund. No automatic renewal. Payment by bank transfer or UPI only.</p>')
    return f'''<main id="main" tabindex="-1" class="atle-pg" {MARK}="page"><section class="atle-hero"><div class="w">
<img src="{h('assets/atle/atle-logo.svg') if cfg['mode']=='rel' else '/assets/atle/atle-logo.svg'}" alt="ATLE(it)" width="420" height="152">
<h1>Author it. Train it. Learn it. Earn it.</h1>
<p>One path from an idea to income. Write a course, teach it, learn a skill, and earn from it, all in one place, and pay only as you go.</p>
<nav class="atle-steps" aria-label="The four steps"><a class="atle-btn" href="{h(cfg['author'])}">Author it</a><a class="atle-btn" href="{h(cfg['train'])}">Train it</a><a class="atle-btn" href="{h(cfg['learn'])}">Learn it</a><a class="atle-btn" href="{h(cfg['earn'])}">Earn it</a></nav></div></section>
<div class="w"><div class="atle-grid">
<section class="atle-card"><h2>I am an Author or Trainer</h2><p>Sign in to open your creator tools. Subscribed Authors and Trainers go straight in.</p><a class="atle-btn" href="{h(cfg['signin'])}">Sign in</a></section>
<section class="atle-card g"><h2>I want to learn or earn</h2><p>Browse the marketplace to find work and learning, then open your workplace to do it.</p><div class="atle-acts"><a class="atle-btn" href="{h(cfg['market'])}">Open the marketplace</a><a class="atle-btn alt" href="{h(cfg['work'])}">Open the workplace</a></div></section>
<section class="atle-card"><h2>New here</h2><p>Join as a member, then add Author or Trainer when you are ready. You pay only for what you use.</p><a class="atle-btn" href="{h(cfg['join'])}">How to join</a></section></div>
<section class="atle-own" id="own-process" aria-labelledby="own-h"><h2 id="own-h">Prefer your own way of working?</h2>
<p>If clicking through our steps is hard for you, keep your standard process. Upload it, we read it and understand it, then we match our clicks and selections to your steps. We adapt to your process, you do not have to change it.</p>
<ol class="atle-own-steps"><li>Upload your standard process.</li><li>We read it and map each of your steps to where you click and select.</li><li>You work in your own order and your own words.</li></ol>
<p>For our own formality we will pass through a few steps, so that we meet your requirements on time, at the right cost and quality, with health, safety and care for the environment.</p>
<p class="atle-note2">Uploads open after sign-in. Test preview: nothing is sent yet.</p>
<a class="atle-btn" href="{h(cfg['contact'])}">Tell us your process</a></section>
<section class="atle-suite" id="suite" aria-labelledby="suite-h"><h2 id="suite-h">The creator suite</h2>
<p id="atle-suite-locked" class="atle-lock">Opens after you sign in as a subscribed Author or Trainer.</p>
<div id="atle-suite-open" hidden><ul>{suite}</ul></div></section>
<section aria-labelledby="pay-h"><h2 id="pay-h">Pay as you go</h2>{tiers}</section>
<p class="atle-note">Plans and prices may change before launch. <a href="{h(cfg['how'])}">See how it works</a>.</p></div></main>'''

def head_extra(P, cfg):
    css = (P + 'assets/atle/atle.css') if cfg['mode'] == 'rel' else '/assets/atle/atle.css'
    js = (P + 'assets/atle/atle.js') if cfg['mode'] == 'rel' else '/assets/atle/atle.js'
    return css, js

def patch_page(txt, path, root, cfg):
    if MARK + '="ribbon"' in txt or '<body' not in txt: return txt, False
    P = rel_prefix(path, root) if cfg['mode'] == 'rel' else ''
    css, js = head_extra(P, cfg)
    logo = css.rsplit('/', 1)[0] + '/atle-logo.svg'
    link = href(cfg, cfg['page'], P)
    lab = 'ATLE(it): Author it, Train it, Learn it, Earn it'
    rib = (f'<div class="atle-rib" {MARK}="ribbon"><a href="{link}" aria-label="{lab}"><img src="{logo}" alt="" width="60" height="22">'
           f'<span>Author it, Train it, Learn it, Earn it</span></a></div>')
    foot = (f'<div class="atle-foot" {MARK}="foot"><a href="{link}" aria-label="{lab}"><img src="{logo}" alt="ATLE(it)" width="82" height="30"></a>'
            f'<span>Author it, Train it, Learn it, Earn it. <a href="{link}">Start here</a>.</span></div>')
    txt = re.sub(r'</head>', f'<link rel="stylesheet" href="{css}"><script src="{js}" defer></script></head>', txt, count=1)
    txt = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + rib, txt, count=1)
    if '</footer>' in txt:
        txt = txt.replace('</footer>', foot + '</footer>', 1)
    else:
        txt = txt.replace('</body>', foot + '</body>', 1)
    return txt, True

def swap_invite(txt, P, cfg):
    link = href(cfg, cfg['page'], P)
    new = (f'{NEW_LINE}<a class="atle-in" href="{link}" aria-label="ATLE(it)">ATLE<sup>it</sup></a>).')
    return re.sub(r'(?:“|&ldquo;|&#8220;)Learn it to Earn it(?:”|&rdquo;|&#8221;) experience\.', new, txt)

def apply(site_dir, key, template=None):
    cfg = SITES[key]; root = os.path.abspath(site_dir)
    adir = os.path.join(root, 'assets', 'atle'); os.makedirs(adir, exist_ok=True)
    for n, c in (('atle-logo.svg', LOGO), ('atle.css', CSS), ('atle.js', JS)):
        open(os.path.join(adir, n), 'w', encoding='utf-8').write(c)
    # funnel page: copy the look (head, header, footer) of an existing page and swap its main block
    tpl = os.path.join(root, template or cfg['template'])
    page_rel = cfg['page'].lstrip('/'); page_rel = page_rel + 'index.html' if page_rel.endswith('/') else page_rel
    dest = os.path.join(root, page_rel); os.makedirs(os.path.dirname(dest), exist_ok=True)
    t = open(tpl, encoding='utf-8').read()
    t = re.sub(r'(?s)<main\b.*?</main>', lambda m: funnel_main(cfg, rel_prefix(dest, root) if cfg['mode']=='rel' else ''), t, count=1)
    t = re.sub(r'(?s)<title>.*?</title>', f'<title>ATLE(it): Author it, Train it, Learn it, Earn it | {cfg["name"]}</title>', t, count=1)
    t = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Author it, Train it, Learn it, Earn it. Write a course, teach it, learn a skill and earn from it, and pay as you go.">', t, count=1)
    t = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + href(cfg, cfg['page'], '') , t, count=1) if cfg['mode']=='abs' else re.sub(r'(<link rel="canonical" href="[^"]*/)[^/"]*"', lambda m: m.group(1) + cfg['page'] + '"', t, count=1)
    t = re.sub(r'(?s)<!-- *ATLE-DROP.*?-->', '', t)
    t = t.replace('Help &amp; Support', 'ATLE(it)').replace('Help & Support', 'ATLE(it)')
    n = 0
    open(dest, 'w', encoding='utf-8').write(t)
    for dp, _, fs in os.walk(root):
        for f in fs:
            if not f.endswith('.html'): continue
            p = os.path.join(dp, f); s = open(p, encoding='utf-8', errors='surrogateescape').read()
            P = rel_prefix(p, root) if cfg['mode'] == 'rel' else ''
            s2 = swap_invite(s, P, cfg)
            s2, ch = patch_page(s2, p, root, cfg)
            if s2 != s:
                open(p, 'w', encoding='utf-8', errors='surrogateescape').write(s2); n += 1
    print(f'ATLE(it): {n} pages updated in {root}')

if __name__ == '__main__':
    a = sys.argv[1:]
    apply(a[0], a[1], a[a.index('--template') + 1] if '--template' in a else None)
