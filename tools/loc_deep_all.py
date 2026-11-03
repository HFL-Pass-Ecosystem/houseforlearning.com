#!/usr/bin/env python3
"""Build deeper local editions for the remaining 65 sectors x 4 places from tools/loc_deep_data_1..6.py."""
import sys, pathlib, importlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import flagship_loc_four as F, loc_deep as D
rows = []
for n in range(1, 7):
    try: rows += importlib.import_module(f'loc_deep_data_{n}').__dict__[f'S_{n}']
    except Exception as ex: print('skip chunk', n, ex)
ok = [r for r in rows if r[1] in F.TOPICS and len(r[2]) == 8]
cnt = 0
for L in F.LOCS:
    for sl, t, rw in ok: D.build(L, F.TOPICS.index(t) + 1, sl, t, rw); cnt += 1
print('sectors', len(ok), 'pages', cnt)
