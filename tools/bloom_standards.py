#!/usr/bin/env python3
"""Give every "Standard to meet." line an opening Bloom verb.

Adult course standards are written as outcome clauses ("Every line has a source and a date; ..."). This step runs late in
rebuild_all and puts "Show that" (or "Show" before a plain noun phrase) in front, so each standard opens with a verb on the
project list (data/verbs.json plus data/verbs-extra.json). A standard that already opens with a listed verb, or with the
"Task:" label, is left alone. Safe to run twice."""
import re, glob, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
def load():
    out = set()
    for fn in ('verbs.json', 'verbs-extra.json'):
        p = ROOT / 'data' / fn
        if p.exists():
            for lv in json.loads(p.read_text(encoding='utf-8'))['levels'].values():
                ws = lv if isinstance(lv, list) else lv['core'] + lv['more']
                out |= {w.lower().split()[0] for w in ws}
    return out
S = load()
FIN = re.compile(r"\b(is|are|has|have|had|was|were|shows?|can|could|will|must|should|matches|match|includes?|lists?|states?|names?|uses?|covers?|keeps?|gives?|ends?|passes|pass|meets?|contains?|reads?|works?|sits|stays|fits|holds|says?|explains?|mentions?|reaches|reach|lets|let|needs?|means|equals?|falls?|rises?|agrees?|differ|differs|comes?|sums?|adds?|totals?|ties|tie|appears?|follows?|supports?|carries|carry|helps?|stops?|starts?|confirms?|approves?|signs?|checks?|records?|calculates?|explains?|answers?|completes?|chooses?|writes?|finds?|decides?|passes|picks?|sets?|makes?|gets?|takes?|spots?|runs?|wins?|stays?)\b")
PAT = re.compile(r'(<strong>Standard to meet\.?</strong>\s*)([^<]+)')
def fix(m):
    pre, s = m.group(1), m.group(2)
    st = s.lstrip()
    first = re.match(r"[A-Za-z-]+", st)
    if st.startswith('Task:'): return m.group(0)
    w = first.group(0) if first else ''
    if w and w.lower() in S and not st[len(w):len(w) + 1] == ',': return m.group(0)
    clause = re.split(r'[;:.]', st)[0]
    lead = 'Show that ' if FIN.search(clause) else 'Show '
    keep = not w or len(w) > 1 and (w.isupper() or any(c.isupper() for c in w[1:]))
    body = st if keep else st[0].lower() + st[1:]
    return pre + lead + body
for f in sorted(glob.glob(str(ROOT / 'site' / '*.html'))):
    t = open(f, encoding='utf-8').read()
    n = PAT.sub(fix, t)
    if n != t: open(f, 'w', encoding='utf-8').write(n)
