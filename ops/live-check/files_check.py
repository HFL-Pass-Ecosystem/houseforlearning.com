#!/usr/bin/env python3
"""List work that sits in drafts but is not in any branch a site is served from.
usage: audit.py <repo_dir> <out.tsv> <deployed_branch> [<deployed_branch> ...]
"""
import subprocess, sys, collections, re
repo, out, deployed = sys.argv[1], sys.argv[2], sys.argv[3:]
SINCE = "2026-10-16"
def g(*a):
    return subprocess.run(["git", "-C", repo, *a], capture_output=True, text=True).stdout
dep = ["origin/" + d for d in deployed]
dep = [d for d in dep if g("rev-parse", "-q", "--verify", d).strip()]
live_blobs, live_paths = set(), collections.defaultdict(set)
for d in dep:
    for line in g("ls-tree", "-r", d).splitlines():
        meta, path = line.split("\t", 1)
        b = meta.split()[2]
        live_blobs.add(b); live_paths[path].add(b)
# every file version that was EVER on a served line (catches squash merges and later edits)
for line in g("rev-list", "--objects", "--missing=print", *dep).splitlines():
    live_blobs.add(line.split(" ", 1)[0].lstrip("?"))
pulls = {}
for line in g("ls-remote", "origin", "refs/pull/*/head").splitlines():
    sha, ref = line.split()
    pulls.setdefault(sha, ref.split("/")[2])
CONTENT = re.compile(r"\.(html?|md|txt|png|jpe?g|svg|webp|gif)$", re.I)
rows = []
for br in g("for-each-ref", "refs/remotes/origin", "--format=%(refname:short)").split():
    if br in dep or br.endswith("/HEAD") or br == "origin": continue
    date, subj = g("log", "-1", "--format=%cs\t%s", br).rstrip("\n").split("\t", 1)
    if date < SINCE: continue
    sha = g("rev-parse", br).strip()
    uniq = g("rev-list", "--count", br, "--not", *dep).strip()
    if uniq == "0":
        rows.append((br, date, pulls.get(sha, ""), "LIVE-LINE", 0, 0, 0, 0, subj, "", "")); continue
    touched = set(g("log", "--format=", "--name-only", br, "--not", *dep).split("\n")) - {""}
    tree = {}
    for line in g("ls-tree", "-r", br).splitlines():
        meta, path = line.split("\t", 1); tree[path] = meta.split()[2]
    same = missing = differs = 0; miss_content = []; diff_content = []
    for p in touched:
        b = tree.get(p)
        if b is None: continue            # deleted on the branch
        if b in live_blobs: same += 1
        elif p not in live_paths:
            missing += 1
            if CONTENT.search(p): miss_content.append(p)
        else:
            differs += 1
            if CONTENT.search(p): diff_content.append(p)
    status = "ALL-CONTENT-LIVE" if missing == 0 and differs == 0 else ("NOT-LIVE" if same == 0 else "PARTLY-LIVE")
    rows.append((br, date, pulls.get(sha, ""), status, int(uniq), same, missing, differs, subj, " | ".join(sorted(miss_content)[:40]), " | ".join(sorted(diff_content)[:40])))
rows.sort(key=lambda r: (r[3], r[1]))
with open(out, "w") as f:
    f.write("branch\tlast_change\tpr\tstatus\tunique_commits\tfiles_live\tfiles_missing\tfiles_differ\tlast_commit\tmissing_content_files\tchanged_content_files_not_live\n")
    for r in rows: f.write("\t".join(str(x) for x in r) + "\n")
c = collections.Counter(r[3] for r in rows)
print(repo, dict(c), "deployed:", dep)
