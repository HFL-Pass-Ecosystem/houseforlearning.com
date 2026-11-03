"""Adds the '(Covered in module N: ...)' tag to a quiz answer when data/quiz_map/GL-NN.json exists.
The map file is a list of 10 module numbers (1-8), one per quiz question."""
import json, pathlib
_D = pathlib.Path(__file__).resolve().parents[1] / 'data' / 'quiz_map'

def tag(cid, i, answer, titles, standards):
    """i is the 0-based quiz index. Returns the answer with the tag appended (or unchanged)."""
    p = _D / f'{cid}.json'
    if not p.exists() or 'Covered in module' in answer:
        return answer
    n = json.loads(p.read_text())[i]
    return f'{answer} (Covered in module {n}: {titles[n-1]}{'' if titles[n-1][-1:] in '?!' else '.'} To pass that module: {standards[n-1]})'
