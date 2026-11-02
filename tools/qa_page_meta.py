#!/usr/bin/env python3
"""Read-only audit of page basics for site/*.html: <title>, meta description, exactly one <h1>, <html lang>, canonical link.
Usage: python3 tools/qa_page_meta.py [report.md]. Lists counts per problem and the pages."""
import os, re, sys, glob, collections, html
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); site = os.path.join(root, 'site')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'audits', 'page-meta.md')
prob = collections.defaultdict(list); titles = collections.defaultdict(list); n = 0
for f in sorted(glob.glob(os.path.join(site, '*.html'))):
    h = open(f, encoding='utf-8', errors='ignore').read(); name = os.path.basename(f); n += 1
    body = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S)
    t = re.search(r'<title[^>]*>(.*?)</title>', h, re.S | re.I); t = html.unescape(re.sub(r'\s+', ' ', t.group(1))).strip() if t else ''
    if not t: prob['no title'].append(name)
    else:
        titles[t].append(name)
        if len(t) > 70: prob['title over 70 chars'].append(name)
    d = re.search(r'<meta[^>]+name="description"[^>]*content="([^"]*)"', h, re.I) or re.search(r'<meta[^>]+content="([^"]*)"[^>]*name="description"', h, re.I)
    if not d or not d.group(1).strip(): prob['no meta description'].append(name)
    elif len(d.group(1)) > 170: prob['description over 170 chars'].append(name)
    elif len(d.group(1)) < 40: prob['description under 40 chars'].append(name)
    h1 = len(re.findall(r'<h1\b', body, re.I))
    if h1 != 1: prob['h1 count %d' % h1].append(name)
    if not re.search(r'<html[^>]+\blang="[a-zA-Z-]+"', h, re.I): prob['no html lang'].append(name)
    c = re.search(r'<link[^>]+rel="canonical"[^>]*href="([^"]*)"', h, re.I) or re.search(r'<link[^>]+href="([^"]*)"[^>]*rel="canonical"', h, re.I)
    if not c: prob['no canonical'].append(name)
    elif name != 'index.html' and not c.group(1).rstrip('/').endswith(name[:-5]) and not c.group(1).endswith(name): prob['canonical does not match file'].append(name)
dups = {t: v for t, v in titles.items() if len(v) > 1}
with open(out, 'w') as o:
    o.write('# Page basics audit\n\n%d pages.\n\n' % n)
    for k, v in sorted(prob.items(), key=lambda x: -len(x[1])): o.write('- **%s**: %d pages\n' % (k, len(v)))
    o.write('- **duplicate titles**: %d titles shared by %d pages\n\n' % (len(dups), sum(len(v) for v in dups.values())))
    for k, v in sorted(prob.items(), key=lambda x: -len(x[1])): o.write('\n## %s\n\n' % k + '\n'.join('- ' + x for x in v[:60]) + ('\n- ...' if len(v) > 60 else '') + '\n')
    o.write('\n## Duplicate titles (first 30)\n\n')
    for t, v in list(dups.items())[:30]: o.write('- "%s": %s\n' % (t[:80], ', '.join(v[:4])))
print(n, {k: len(v) for k, v in prob.items()}, len(dups))
