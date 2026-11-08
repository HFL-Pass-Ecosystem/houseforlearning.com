# Campus standards and BIM academy: finish line

Test-only preview. Nothing live. Source: owner's Drive folder on the first campus design. Only the design and technical parts were used; licences, bank, tax, lease, invoice and people folders were left out.

What must work (each item click-tested at 1280 px and 390 px):
1. Hub `campus-standards.html` opens and links to all nine standards.
2. Nine standards pages open: tiers and sites, space programme, modular shell, interiors, furniture kit, building services, safety and access, element library (23 coded elements), BIM and LOD rules (six levels).
3. `bim-academy.html` opens and links to seven level pages L1 to L7 (modules, worked examples, activity, standard, five checks with model answers, jobs).
4. `bim-career-pathways.html` opens: five steps, six roles by level, portfolio, global use.
5. Menu: Learn now shows Campus standards and BIM academy.
6. No supplier, maker, landlord, consultant or person names; no prices; no addresses; no logos. Checked by `tools/check_secrecy.py` and by hand.
7. `python3 tools/ci_check.py` passes.

Next list (not in this build): own drawings and pictures of the element library; step-by-step video lessons; country annexes; paid access gate for L3 and up; real drawing files behind sign-in.
