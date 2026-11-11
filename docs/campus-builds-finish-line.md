# Campus builds, climate annexes, LOD plan and BIM projects: finish line

Test-only preview. Nothing live. Stacked on the campus standards and BIM academy work (see `campus-standards-bim-finish-line.md`).
All numbers are planning values worked out from the standards data. Status: reference designs v0.1, draft for the owner's review.

What must work (each item click-tested at 1280 px and 390 px):
1. Hub `campus-builds.html` opens and links to six campus types, four climate annexes, the LOD stage plan, the campus builder and the project briefs.
2. Six campus type pages open (S1 mobile unit, S2 satellite pair, S4 studio satellite, S6 full satellite, BP business park, FL flagship): size, space schedule, coded element list with quantities, build order, file names, learner project.
3. Four climate annex pages open (hot and dry, hot and humid, temperate, cold): six changes, what never changes, three checks, one task.
4. `campus-lod-plan.html` opens: seven stages, level by element group, ten-point check sheet.
5. `campus-builder.html` works: a learner number gives the campus type, element list, file names, steps and climate checks. Copy button. No inline script.
6. `bim-projects.html` opens: seven briefs, L1 to L7, each linked to its campus type and its level page.
7. `career-pathways.html` and `pathways.html` show the section "Design campuses with BIM and LOD" with four links.
8. Element library now has 29 codes (six added: ramp, platform lift, shade canopy, fire-exit door, learner seat, emergency light group).
9. No supplier, maker, landlord, consultant or person names; no prices; no addresses; no logos. `tools/check_secrecy.py` passes.
10. `python3 tools/ci_check.py` passes.

Next list (not in this build): the owner's list of named campuses with their numbers; own drawings and pictures per campus type; country annexes for local rules; downloadable open-format practice models; paid access gate for L3 and up.
