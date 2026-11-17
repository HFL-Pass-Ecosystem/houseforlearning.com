#!/usr/bin/env python3
"""Country courses for every country of the world (HFL Vidyapeetha). Staged, one country at a time.
Input (drafted by outside AI helpers from the AHFL briefs, then checked here):
  data/country-courses/<ISO>/needs.json      top 50 to 100 needs of that country, ranked
  data/country-courses/<ISO>/<ISO>-NN.json   one full course per need (same shape as the Netherlands courses)
Output: site/learn-country-<iso>-hub.html and site/learn-flagship-cc-<iso>-NN.html (same depth and look as the
existing flagship courses; the site's language menu translates every page).
Run: python3 tools/build_country_courses.py [ISO ...]   (no ISO = every country folder). --check = validate only."""
import sys, json, re, pathlib, html
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_full_courses as B
from flagship_nl_sg_au import build, M
e = html.escape
D = B.R / 'data' / 'country-courses'
BANNED = re.compile(r'\b(claude|anthropic|chatgpt|openai|gemini|copilot|perplexity|lorem|placeholder|tbd|xxx)\b', re.I)
CF = ['id', 'title', 'summary', 'task', 'cond', 'std', 'safety', 'outcomes', 'jobs', 'mods']
MF = ['t', 'bl', 'h', 'intro', 'pts', 'ex', 'act', 'std', 'q', 'a']
BL = {'Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'}

def check_needs(n, iso):
    p = []
    if n.get('iso', '').upper() != iso: p.append('needs.json iso does not match folder')
    for k in ('country', 'currency', 'languages', 'needs'):
        if not n.get(k): p.append(f'needs.json missing {k}')
    needs = n.get('needs', [])
    if not 50 <= len(needs) <= 100: p.append(f'needs.json has {len(needs)} needs (need 50 to 100)')
    for i, x in enumerate(needs, 1):
        for k in ('rank', 'need', 'sector', 'why', 'scope'):
            if not x.get(k): p.append(f'need {i} missing {k}')
        if x.get('scope') not in ('universal', 'country'): p.append(f'need {i} scope must be universal or country')
    return p

def check_course(c, cur):
    p = [f'missing {k}' for k in CF if not c.get(k)]
    if p: return p
    if len(c['mods']) != 8: p.append(f'{len(c["mods"])} modules (need 8)')
    if len(c['outcomes']) < 4: p.append('fewer than 4 outcomes')
    if len(c['jobs']) < 4: p.append('fewer than 4 jobs')
    for i, m in enumerate(c['mods'], 1):
        p += [f'module {i} missing {k}' for k in MF if not m.get(k)]
        if m.get('bl') not in BL: p.append(f'module {i} level "{m.get("bl")}" not in {sorted(BL)}')
        if len(m.get('pts', [])) < 4: p.append(f'module {i} has fewer than 4 points')
        if len(m.get('intro', '')) < 150: p.append(f'module {i} intro too short')
        if len(m.get('ex', '')) < 200: p.append(f'module {i} worked example too short')
        if cur and cur not in m.get('ex', ''): p.append(f'module {i} worked example has no {cur} amount')
    if not 120 <= sum(int(m.get('h', 0)) for m in c['mods']) <= 200: p.append('guided hours must total 120 to 200')
    bad = BANNED.findall(json.dumps(c))
    if bad: p.append('banned words: ' + ', '.join(sorted(set(bad))))
    return p

def load(iso, only_check):
    f = D / iso
    needs = json.loads((f / 'needs.json').read_text())
    probs = check_needs(needs, iso)
    courses = []
    for cf in sorted(f.glob(f'{iso}-*.json')):
        c = json.loads(cf.read_text())
        c['id'] = f'CC-{iso}-{cf.stem.split("-")[-1]}'
        c['mods'] = [dict(m, pts=m['pts'] if isinstance(m['pts'], list) else m['pts'].split('|')) for m in c.get('mods', [])]
        cp = check_course(c, needs.get('currency', ''))
        probs += [f'{cf.name}: {x}' for x in cp]
        if not cp: courses.append(c)
    return needs, courses, probs

def hub(iso, needs, built):
    by_rank = {c.get('need_rank'): c for c in built}
    rows = ''.join(f'<tr><td>{x["rank"]}</td><td>{e(x["need"])}</td><td>{e(x["sector"])}</td><td>{"Shared" if x["scope"]=="universal" else "Special to " + e(needs["country"])}</td>'
                   f'<td>{"<a href=\"learn-flagship-" + by_rank[x["rank"]]["id"].lower() + ".html\">Open course</a>" if x["rank"] in by_rank else "Being written"}</td></tr>' for x in needs['needs'])
    body = (B.sec('', 'nd', 'what this country needs', f'Top {len(needs["needs"])} needs in {e(needs["country"])}',
                  f'<p>Languages: {e(", ".join(needs["languages"]))}. Currency: {e(needs["currency"])}. Use the language menu at the top to read any page in your language.</p>'
                  '<div class="scroll-x"><table class="ws-table"><caption>Needs, ranked</caption><thead><tr><th>Rank</th><th>Need</th><th>Sector</th><th>Course type</th><th>Course</th></tr></thead><tbody>' + rows + '</tbody></table></div>')
            + B.sec('alt', 'nx', 'next', 'Draft', '<p class="ws-note">Draft. Own wording. Not live until approved.</p>'))
    fn = f'learn-country-{iso.lower()}-hub.html'
    B.page(fn, f'Courses for {needs["country"]}', f'Courses built around the top needs of {needs["country"]}.', f'Courses for {needs["country"]}',
           e(f'{len(built)} full courses so far, built around the top needs of {needs["country"]}. Draft.'), body,
           B.crumb(('Courses', 'courses-hub.html'), ('Countries of the world', None)), kicker='Country courses')
    return fn

if __name__ == '__main__':
    only_check = '--check' in sys.argv
    isos = [a.upper() for a in sys.argv[1:] if not a.startswith('--')] or sorted(p.name for p in D.iterdir() if p.is_dir())
    bad = 0
    for iso in isos:
        needs, courses, probs = load(iso, only_check)
        for x in probs: print(f'{iso}: {x}')
        bad += len(probs)
        if not only_check:
            for c in courses: build(c, needs['country'])
            hub(iso, needs, courses)
        print(f'{iso}: {len(courses)} courses ok, {len(probs)} problems')
    sys.exit(1 if bad and only_check else 0)
