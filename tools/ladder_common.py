"""Shared L1-L7 ladder section for flagship builders."""
import html
import build_full_courses as B
e = html.escape
LV = {1: 'L1 Basic', 2: 'L2 Awareness', 3: 'L3 Foundation', 4: 'L4 Practitioner', 5: 'L5 Specialist', 6: 'L6 Advanced', 7: 'L7 Super expert'}
def ladder_sec(slides, cls='alt'):
    assert len(slides) == 7
    body = ''.join(f'<details class="mod"><summary>Slide {i}. {LV[i]}: {e(t)}</summary><p><strong>On the slide:</strong> {LV[i]} · {e(t)}</p><p><strong>Notes:</strong> {e(n)}</p></details>' for i, (t, n) in enumerate(slides, 1))
    return B.sec(cls, 'ld', 'ladder L1 to L7', 'Slide by slide, with notes', '<p>Seven slides, one for each level. Step in at your level and move up; credits stack.</p>' + body)


# Ladder slides built from the course's own module and check question (no new facts).
LADDER_MODULE_IDX = [0, 1, 2, 3, 4, 6, 7]


def deep_slide(level, title, notes, mod, qa):
    """mod = (title, bloom, hours, intro, points, example, activity, standard); qa = (question, answer)."""
    t, bl, h, intro, pts, ex, act, std = mod
    on = (f'{title}. Focus module: {t} ({bl}, {h} h). {intro} Key points: ' + ' '.join(p if p.rstrip().endswith(('.', '?', '!')) else p.rstrip() + '.' for p in pts))
    nt = f'{notes} Teach: open with the worked example. {ex} Then set the activity: {act} Mark against the standard: {std}'
    if qa:
        q, ans = qa
        ans = ans.split(' (Covered in module')[0].strip()
        nt += f' Check at this level: {q} Model answer: {ans}'
    return on, nt


def quiz_for_module(quiz, module_no):
    """First check question whose answer lives in this module, as (question, answer), or None."""
    for item in quiz:
        if item[2] == module_no:
            return item[0], item[1]
    return None


def pick_module(mods_text, title, notes, default_idx, used):
    """Index of the module whose own words best match the slide's title (weighted) and notes; falls back to the default."""
    import re
    stop = set('the a an and or of to in for on with is are be your you their it as at by from that this which can will how what'.split())
    def words(s): return {w for w in re.findall(r'[a-z]{3,}', s.lower()) if w not in stop}
    tw, nw = words(title), words(notes)
    best, bi = 0, default_idx
    for i, txt in enumerate(mods_text):
        mw = words(txt)
        mt = words(txt.split(' || ')[0])
        sc = 3 * len(tw & mt) + len(tw & mw) + len(nw & mw) * 0.5 + (0.75 if i == default_idx else 0) - 4 * list(used).count(i)
        if sc > best: best, bi = sc, i
    return bi


# Hand-checked module picks (0-based) where the automatic word match chose a weaker module.
MODULE_OVERRIDE = {
    ('EU-01', 6): 1, ('EU-02', 6): 2, ('EU-07', 7): 6,
    ('EU-08', 6): 5, ('EU-08', 7): 6, ('EU-09', 6): 5, ('EU-09', 7): 6,
}
