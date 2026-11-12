#!/bin/sh
# Lists every draft (work line) that is NOT yet on a line a site is served from.
# Run from the repo root:  sh ops/live-check/run.sh
# Result: ops/live-check/out/not-live.tsv  (open it in Excel or Google Sheets)
set -e
here="$(cd "$(dirname "$0")" && pwd)"; root="$(git -C "$here" rev-parse --show-toplevel)"
served="$(grep -v '^#' "$here/served-lines.txt" | awk 'NF{print $1}' | tr '\n' ' ')"
mkdir -p "$here/out"
git -C "$root" fetch -q origin '+refs/heads/*:refs/remotes/origin/*'
python3 "$here/files_check.py" "$root" "$here/out/files.tsv" $served
python3 "$here/words_check.py" "$root" "$here/out/files.tsv" "$here/out/not-live.tsv" $served
echo; echo "Verdicts:"; cut -f8 "$here/out/not-live.tsv" | sort | uniq -c
