"""Frozen sections: the founder approved these words and asked that they never be removed or changed.
Fails if a frozen block is missing, moved off its page, or edited. To change one on purpose, the founder must say so first;
then update the hash here in the same change."""
import hashlib, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FROZEN = {
    # name: (page, sha256 of the block from its opening FROZEN comment to its closing one), approved 13 Nov 2026, revised by the founder 13 Nov 2026
    'family-roots': ('site/about.html', 'b3b3ed6dd4e9854038a0b9f7d7bfb84c239d4384ab9625328043ba47762ee57b'),
}
bad = 0
for name, (page, want) in FROZEN.items():
    text = (ROOT / page).read_text(encoding='utf-8')
    m = re.search(r'<!-- FROZEN: %s\b.*?<!-- /FROZEN: %s -->' % (re.escape(name), re.escape(name)), text, re.S)
    if not m:
        print('FROZEN section "%s" is missing from %s' % (name, page)); bad += 1; continue
    got = hashlib.sha256(m.group(0).encode('utf-8')).hexdigest()
    if got != want:
        print('FROZEN section "%s" in %s was changed (%s)' % (name, page, got)); bad += 1
print('frozen sections OK' if not bad else '%d frozen problem(s)' % bad)
sys.exit(1 if bad else 0)
