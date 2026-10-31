#!/bin/sh
# Copies the online MBA test programme from the ahfl-workspace repo (folder learning/mba, e.g. PR branch) into site/mba
# and makes it fit our no-inline-style rule. Usage: tools/sync_mba.sh /path/to/ahfl-workspace <git-ref>
set -e
SRC="$1"; REF="${2:-HEAD}"; OUT="$(dirname "$0")/../site/mba"
mkdir -p "$OUT/deep"
for f in index.html app.js data.js style.css $(git -C "$SRC" ls-tree -r --name-only "$REF" learning/mba/deep | sed 's#learning/mba/##'); do
  git -C "$SRC" show "$REF:learning/mba/$f" > "$OUT/$f"
done
cd "$OUT"
perl -0pi -e 's/class="item" style="padding:6px 0;border:0"/class="item flat"/g; s/<h2 style="margin-top:\.6em">/<h2 class="mt6">/g; s/<h2 style="margin-top:0">/<h2 class="mt0">/g; s/<h2 style=\x27margin-top:0\x27>/<h2 class=\x27mt0\x27>/g; s/style="width:\x27 \+ (pct\([a-z]+\)) \+ \x27%"/data-w="\x27 + $1 + \x27"/g; s/function layout\(sideHtml, html\) \{ side.innerHTML = sideHtml; main.innerHTML = html; \}/function layout(sideHtml, html) { side.innerHTML = sideHtml; main.innerHTML = html; document.querySelectorAll("[data-w]").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; }); }/' app.js
grep -q "\.mt6{" style.css || printf "\n.mt6{margin-top:.6em}.mt0{margin-top:0}.flat{padding:6px 0;border:0}\n" >> style.css
sed -i 's#<meta name="description"#<meta name="robots" content="noindex">\n<meta name="description"#' index.html
if grep -n 'style=' app.js data.js deep/*.js; then echo "inline styles left: fix before pushing"; exit 1; fi
