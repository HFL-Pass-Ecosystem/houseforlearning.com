#!/usr/bin/env python3
"""Text-level check: are the words a draft added present on any served line?
usage: textaudit.py <repo_dir> <in.tsv from audit.py> <out.tsv> <served_branch> ..."""
import subprocess, sys, re, csv, html
repo, inp, out, served = sys.argv[1], sys.argv[2], sys.argv[3], ["origin/" + s for s in sys.argv[4:]]
def g(*a, raw=False):
    r = subprocess.run(["git", "-C", repo, *a], capture_output=True)
    return r.stdout if raw else r.stdout.decode("utf-8", "replace")
served = [s for s in served if g("rev-parse", "-q", "--verify", s).strip()]
TEXT = re.compile(r"\.(html?|md|txt|json|js|py|java|tsv|csv|yml|yaml|sql|css)$", re.I)
TAG = re.compile(r"<[^>]+>"); WS = re.compile(r"\s+")
def chunks(text):
    text = html.unescape(TAG.sub("\n", text))
    for part in re.split(r"[\n\r]+|(?<=[.!?])\s+", text):
        p = WS.sub(" ", part).strip().lower()
        if len(p) >= 40 and re.search(r"[a-z]{4,} [a-z]{3,} [a-z]{3,}", p): yield p[:200]
corpus = set(); seen = set()
for s in served:
    want = []
    for line in g("ls-tree", "-r", s).splitlines():
        meta, path = line.split("\t", 1); b = meta.split()[2]
        if TEXT.search(path) and b not in seen: seen.add(b); want.append(b)
    p = subprocess.Popen(["git", "-C", repo, "cat-file", "--batch"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    data, _ = p.communicate(("\n".join(want) + "\n").encode())
    i = 0
    while i < len(data):
        j = data.index(b"\n", i); hdr = data[i:j].split()
        if len(hdr) < 3: i = j + 1; continue
        n = int(hdr[2]); body = data[j+1:j+1+n]; i = j + 2 + n
        if n < 3_000_000: corpus.update(chunks(body.decode("utf-8", "replace")))
print(repo, "served text chunks:", len(corpus), file=sys.stderr)
rows = list(csv.DictReader(open(inp), delimiter="\t"))
w = csv.writer(open(out, "w"), delimiter="\t")
w.writerow(["branch", "last_change", "pr", "file_status", "text_added", "text_live", "pct_live", "verdict", "last_commit", "pages_with_missing_text", "sample_missing_text"])
for r in rows:
    b = r["branch"]
    if r["status"] in ("LIVE-LINE", "ALL-CONTENT-LIVE"):
        w.writerow([b, r["last_change"], r["pr"], r["status"], "", "", "100", "LIVE", r["last_commit"], "", ""]); continue
    best = min(served, key=lambda s: int(g("rev-list", "--count", b, "^" + s).strip() or 10**9))
    mb = g("merge-base", b, best).strip()
    d = g("diff", "--no-color", "-U0", "--no-renames", mb, b) if mb else ""
    added = {}; cur = ""
    for line in d.splitlines():
        if line.startswith("+++ b/"): cur = line[6:]
        elif line.startswith("+") and not line.startswith("+++") and TEXT.search(cur):
            for c in chunks(line[1:]): added.setdefault(c, cur)
    live = sum(1 for c in added if c in corpus)
    n = len(added); pct = round(100 * live / n) if n else 100
    miss = [(c, f) for c, f in added.items() if c not in corpus]
    files = {}
    for c, f in miss: files[f] = files.get(f, 0) + 1
    top = sorted(files.items(), key=lambda x: -x[1])[:8]
    verdict = "LIVE" if pct >= 95 else ("MOSTLY LIVE" if pct >= 60 else ("PARTLY LIVE" if pct >= 20 else "NOT LIVE"))
    w.writerow([b, r["last_change"], r["pr"], r["status"], n, live, pct, verdict, r["last_commit"],
                " | ".join(f"{f} ({k})" for f, k in top), " || ".join(c[:120] for c, _ in miss[:3])])
