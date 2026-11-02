"""Shared L1-L7 ladder section for flagship builders."""
import html
import build_full_courses as B
e = html.escape
LV = {1: 'L1 Basic', 2: 'L2 Awareness', 3: 'L3 Foundation', 4: 'L4 Practitioner', 5: 'L5 Specialist', 6: 'L6 Advanced', 7: 'L7 Super expert'}
def ladder_sec(slides, cls='alt'):
    assert len(slides) == 7
    body = ''.join(f'<details class="mod"><summary>Slide {i}. {LV[i]}: {e(t)}</summary><p><strong>On the slide:</strong> {LV[i]} · {e(t)}</p><p><strong>Notes:</strong> {e(n)}</p></details>' for i, (t, n) in enumerate(slides, 1))
    return B.sec(cls, 'ld', 'ladder L1 to L7', 'Slide by slide, with notes', '<p>Seven slides, one for each level. Step in at your level and move up; credits stack.</p>' + body)
