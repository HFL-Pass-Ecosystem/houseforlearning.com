#!/bin/sh
# Copies the online MBA test programme from the ahfl-workspace repo (folder learning/mba, e.g. PR branch) into site/mba
# and makes it fit our no-inline-style rule. Usage: tools/sync_mba.sh /path/to/ahfl-workspace <git-ref>
set -e
SRC="$1"; REF="${2:-HEAD}"; OUT="$(cd "$(dirname "$0")/.." && pwd)/site/mba"
mkdir -p "$OUT/deep"
for f in index.html app.js data.js assign.js style.css $(git -C "$SRC" ls-tree -r --name-only "$REF" learning/mba/deep | sed 's#learning/mba/##'); do
  git -C "$SRC" show "$REF:learning/mba/$f" > "$OUT/$f"
done
cd "$OUT"
perl -0pi -e 's/class="item" style="padding:6px 0;border:0"/class="item flat"/g; s/<h2 style="margin-top:\.6em">/<h2 class="mt6">/g; s/<h2 style="margin-top:0">/<h2 class="mt0">/g; s/<h2 style=\x27margin-top:0\x27>/<h2 class=\x27mt0\x27>/g; s/style="width:\x27 \+ (pct\([a-z]+\)) \+ \x27%"/data-w="\x27 + $1 + \x27"/g; s/function layout\(sideHtml, html\) \{ side.innerHTML = sideHtml; main.innerHTML = html; \}/function layout(sideHtml, html) { side.innerHTML = sideHtml; main.innerHTML = html; document.querySelectorAll("[data-w]").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; }); }/' app.js
grep -q "\.mt6{" style.css || printf "\n.mt6{margin-top:.6em}.mt0{margin-top:0}.flat{padding:6px 0;border:0}\n" >> style.css
sed -i 's#<meta name="description"#<meta name="robots" content="noindex">\n<meta name="description"#' index.html

# Language picker: reuse the site's own component (assets/lang.js) with the lang-* rules from site.css.
python3 - "$OUT" <<'PY'
import re, sys, pathlib
out = pathlib.Path(sys.argv[1]); css = (out.parent / 'assets' / 'site.css').read_text()
rules = [l for l in css.splitlines() if re.match(r'(\.lang-|@media[^{]*\{\.lang-|html\[dir)', l)]
vars_ = ':root{--acc:var(--blue);--f-body:inherit;--f-display:inherit;--panel:var(--card);--surface:var(--card);--muted:var(--mute);--r:8px;--r-lg:12px}'
(out / 'lang.css').write_text('/* lang-* rules copied from assets/site.css by tools/sync_mba.sh */\n' + vars_ + '\n' + '\n'.join(rules) + '\n')
h = (out / 'index.html').read_text()
if 'lang.css' not in h:
    h = h.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css">\n<link rel="stylesheet" href="lang.css">')
    if 'data-lang-toggle' not in h: h = h.replace('<span class="test">TEST</span>', '<button class="btn" type="button" data-lang-toggle aria-haspopup="dialog" aria-controls="lang-panel" aria-expanded="false">Language</button> <span class="test">TEST</span>')
    h = h.replace('<script src="app.js"></script>', '<script src="app.js"></script>\n<script src="../assets/lang.js" defer></script>')
    (out / 'index.html').write_text(h)
PY
if grep -n 'style=' app.js data.js deep/*.js; then echo "inline styles left: fix before pushing"; exit 1; fi
