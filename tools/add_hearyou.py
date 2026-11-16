"""Add the We Hear You responses to every page: a reaction, read ticks, typing dots and a warm reply with our slogan
after a visitor's message goes through, a listening wave while they type, and a small 'We're listening' link on every page.
Head tags only (no inline code, CSP-safe). Idempotent. Runs late in tools/rebuild_all.py so rebuilt pages keep it."""
import glob, os
ROOT = os.path.join(os.path.dirname(__file__), '..', 'site')
TAG = 'assets/hearyou/hearyou.js'
HEAD = ('<link rel="stylesheet" href="{p}assets/hearyou/hearyou.css">'
        '<link rel="stylesheet" href="{p}assets/hearyou/theme.css">'
        '<script src="{p}assets/hearyou/settings.js" defer></script>'
        '<script src="{p}assets/hearyou/hearyou.js" defer></script>')
changed = 0
for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
    rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
    if rel.startswith('drafts/') or rel.startswith('assets/'):
        continue
    s = open(f, encoding='utf-8').read()
    if TAG in s or '</head>' not in s:
        continue
    p = '../' * rel.count('/')
    s = s.replace('</head>', HEAD.format(p=p) + '\n</head>', 1)
    open(f, 'w', encoding='utf-8').write(s)
    changed += 1
print('hearyou: added to %d page(s)' % changed)
