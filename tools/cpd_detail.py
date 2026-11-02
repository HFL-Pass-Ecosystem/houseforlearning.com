"""Parse CPD detail + flagship markdown (data/cpd-detail) into per-course blocks keyed by code (e.g. ACC-001)."""
import pathlib, re, html
e = html.escape
D = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'cpd-detail'
CODES = [f'{s}-00{n}' for s in 'MED SOC TCH ACC FIN BUS ENG BLD ITC LEG SCI BEA'.split() for n in (1, 2, 3)]
def inline(t):
    t = e(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    return re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
def sections(path):
    out = {}; cur = None
    for line in path.read_text().splitlines():
        m = re.match(r'## (?:CPD-)?([A-Z]{3}-\d{3}) ', line)
        if m: cur = m.group(1); out[cur] = []; continue
        if line.startswith('## ') or line.startswith('# '): cur = None; continue
        if cur and line.strip(): out[cur].append(line.rstrip())
    return out
def blocks(lines):
    bl = []
    for l in lines:
        m = re.match(r'\*\*(.+?):?\*\*:?\s*(.*)', l)
        if m: bl.append([m.group(1).rstrip(':'), [m.group(2)] if m.group(2) else []])
        elif bl: bl[-1][1].append(l)
    return bl
def load():
    res = {c: {'detail': [], 'flag': []} for c in CODES}
    for p in sorted(D.glob('detail-*.md')):
        for k, v in sections(p).items():
            if k in res: res[k]['detail'] = blocks(v)
    for p in sorted(D.glob('flagship-*.md')):
        for k, v in sections(p).items():
            if k in res: res[k]['flag'] = blocks(v)
    return res
def checks_html(text):
    items = re.findall(r'(?:^|\s)\d+\.?\s+(.+?)\s+\*(.+?)\*(?=\s+\d+\.?\s|\s*$)', ' '.join(text) if isinstance(text, list) else text)
    return ''.join(f'<details class="loc"><summary>{inline(q)}</summary><p><strong>Model answer:</strong> {inline(a)}</p></details>' for q, a in items), len(items)
def modules(text):
    t = ' '.join(text)
    return re.findall(r'\d+\s+(.+?)\s+\((\d+)\)', t)
def render_lines(lines):
    ls = [l for l in lines if l.strip()]
    if all(re.match(r'\s*[-*] ', l) for l in ls[1:]) and len(ls) > 2:
        head = ls[0]; li = ''.join(f'<li>{inline(re.sub(r"^\s*[-*] ", "", l))}</li>' for l in ls[1:])
        return f'<p>{inline(head)}</p><ul>{li}</ul>'
    return '<p>' + inline(' '.join(l.strip() for l in ls)) + '</p>'
