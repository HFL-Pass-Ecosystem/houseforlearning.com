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

def slides_html(slug, L, esc, deep=None):
    """Seven <details> slides for a sector, or '' when none is written.
    deep = optional list of 7 (module, (question, answer) or None) from the page's own modules and checks; the slide then also carries that module's key points, example, activity, standard and check question."""
    sl = LAD.get(slug)
    if not sl: return ''
    if deep:
        from ladder_common import deep_slide
        rows = []
        for i, ((t, b, n), (mod, qa)) in enumerate(zip(sl, deep), 1):
            on, nt = deep_slide(i, _fill(b, L).rstrip().rstrip('.'), _fill(n, L).removeprefix('Notes:').strip(), mod, qa)
            rows.append(f'<details class="mod"><summary><span class="mn">Slide {i}</span> {LN[i-1]}: {esc(_fill(t, L))}</summary><p>{esc(on)}</p><p class="ws-note"><strong>Speaker notes.</strong> {esc(nt)}</p></details>')
        return '<h3 class="ws-h3">Slide by slide</h3><p>Seven slides, one per level. Open each for the slide text and the speaker notes.</p>' + ''.join(rows)
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

_ROLES = [('L2', 'Entry', '{t} assistant', 'helps with set tasks, keeps records and follows the checklist.'),
          ('L3', 'Junior', 'Junior {t} coordinator', 'runs small jobs end to end and reports each week.'),
          ('L4', 'Practitioner', '{t} practitioner', 'plans and delivers the work alone, with a mentor check.'),
          ('L5', 'Specialist', '{t} specialist', 'goes deep in one area, such as rules, numbers or customers.'),
          ('L6', 'Advanced', '{t} team lead or manager', 'leads people and partners, owns the plan and the data.'),
          ('L7', 'Senior', 'Senior {t} adviser or mentor', 'designs the whole system, reviews others and publishes cases.')]

def roles_html(t, esc):
    """Six generic roles from entry to senior, linked to the pathways pages."""
    return ('<h3 class="ws-h3">Six steps from entry to senior</h3><ol class="blm">'
            + ''.join(f'<li><strong>{esc(n.format(t=t)[0].upper() + n.format(t=t)[1:])} ({lv}, {lab}).</strong> {esc(d)}</li>' for lv, lab, n, d in _ROLES)
            + '</ol><p>See how these steps connect to study and work in <a href="career-pathways.html">Career pathways</a> and <a href="pathways.html">Pathways</a>.</p>')

_PNOTES = ['Show a one-page glossary with ten local terms; the learner reads each aloud and gives the meaning in {place}.',
           'Ask the learner to explain the market of {place} in one page; check that each fact has a source and a date.',
           'Give a sample sector and ask for a licence table; check the issuer, the cost in {cur} and the date checked.',
           'Run the 20-person test with the learner and check the sums in {cur}, including a worse case 25 per cent lower.',
           'Review a cluster checklist; each rule has a public source and a question for a local expert.',
           'Review the team plan: roles, partners, data map and the monthly review; ask what changes if a rule changes.',
           'Read the published case against the evidence list; a mentor and a peer must both agree it meets the standard.']

def place_slides_html(L, esc, names, ev):
    return ('<h3 class="ws-h3">Slide by slide</h3><p>Seven slides, one per level. Open each for the slide text and the speaker notes.</p>'
            + ''.join(f'<details class="mod"><summary><span class="mn">Slide {i+1}</span> {esc(names[i])}</summary><p>{esc(L["ladder"][i])}</p><p class="ws-note"><strong>Speaker notes.</strong> {esc(_fill(_PNOTES[i], L))} Evidence to collect: {esc(ev[i])}</p></details>' for i in range(7)))
