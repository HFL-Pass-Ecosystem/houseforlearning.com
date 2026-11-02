"""Slide-by-slide L1-L7 notes and task/condition/standard per sector, merged from loc_ladder_A/B/C.py (own wording)."""
import importlib
LAD, TCS = {}, {}
for _n in 'ABC':
    try:
        _m = importlib.import_module(f'loc_ladder_{_n}')
        LAD.update(getattr(_m, f'LAD_{_n}')); TCS.update(getattr(_m, f'TCS_{_n}'))
    except Exception as _ex:
        print('skip ladder', _n, _ex)
LN = ['L1 Basic', 'L2 Awareness', 'L3 Foundation', 'L4 Practitioner', 'L5 Specialist', 'L6 Advanced', 'L7 Super expert']

def _fill(s, L):
    return s.replace('{place}', L['name']).replace('{cur}', L['cur'].split(' or ')[0])

def slides_html(slug, L, esc):
    """Seven <details> slides for a sector, or '' when none is written."""
    sl = LAD.get(slug)
    if not sl: return ''
    return ('<h3 class="ws-h3">Slide by slide</h3><p>Seven slides, one per level. Open each for the slide text and the speaker notes.</p>'
            + ''.join(f'<details class="mod"><summary><span class="mn">Slide {i}</span> {LN[i-1]}: {esc(_fill(t, L))}</summary><p>{esc(_fill(b, L))}</p><p class="ws-note"><strong>Speaker notes.</strong> {esc(_fill(n, L).removeprefix('Notes:').strip())}</p></details>' for i, (t, b, n) in enumerate(sl, 1)))

def tcs_html(slug, L, esc):
    t = TCS.get(slug)
    if not t: return ''
    return ('<h3 class="ws-h3">Task, condition and standard</h3><div class="tcs">'
            f'<div><h4>Task</h4><p>{esc(_fill(t[0], L))}</p></div><div><h4>Condition</h4><p>{esc(_fill(t[1], L))}</p></div><div><h4>Standard</h4><p>{esc(_fill(t[2], L))}</p></div></div>')

_T2S = {}
def topic_slug(t):
    """Sector slug for a global topic name (as used by loc_deep / loc_deep_data_N)."""
    if not _T2S:
        import loc_deep
        rows = list(loc_deep.S)
        for n in range(1, 7):
            try: rows += importlib.import_module(f'loc_deep_data_{n}').__dict__[f'S_{n}']
            except Exception: pass
        for r in rows: _T2S[r[1]] = r[0]
        _T2S['e- Commerce'] = 'ecommerce'
    return _T2S.get(t)
