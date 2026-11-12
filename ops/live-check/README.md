# Live check: which drafts are not on a site yet

**Why this exists.** On 12 Nov 2026 the owner found that proofread pages had sat in
drafts for days and never reached a live site. A draft is not "done". Only work that
is on the line a site is served from is done. This check names every draft that is not.

**Run it:** `sh ops/live-check/run.sh` then open `ops/live-check/out/not-live.tsv`.

**How it decides.**
1. `served-lines.txt` lists the branches the live and test sites are served from
   (taken from the hosting dashboards). Keep it up to date when a site changes line.
2. `files_check.py` marks a draft live when every file it changed is, or once was, on a served line.
3. `words_check.py` then checks the words: the sentences a draft added must appear in
   the served files. Verdict: LIVE (95%+), MOSTLY LIVE, PARTLY LIVE, NOT LIVE.

**Rule for every thread.** Before saying work is finished, run this check and add the
row to the master register with "live: yes" only after the page opens on the site.
