"""Frozen sections: the founder approved these words and asked that they never be removed or changed.
Fails if a frozen block is missing, moved off its page, or edited. To change one on purpose, the founder must say so first;
then update the hash here in the same change."""
import hashlib, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FROZEN = {
    # name: (page, sha256 of the block from its opening FROZEN comment to its closing one), approved 13 Nov 2026, revised by the founder 13 Nov 2026 (21:19Z: the section 'Sri. V.R. Raghavendra Acharya and the family today' removed on his word; 21:12Z: 'Design and development of the Indian Institute of Science.' on his word; again 20:09Z: 'Gold Medalist Civil Engineer'; 20:13Z: his exact words 'Handpicked and hired by J.R.D. Tata for the design and development of the Indian Institute of Science.')
    'family-roots': ('site/about.html', 'c18886c4f474312a0504b68c535b8ae6849d90c6379469ba3c5d3efb4fe39b4c'),
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
