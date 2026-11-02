"""Mark runs of Arabic and Devanagari text with lang (and dir for Arabic) so screen readers pick the right voice.
mark(html) works on text between tags only; it leaves attributes, scripts and styles alone and is safe to run twice."""
import re
_AR = r'[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]'
_HI = r'[ऀ-ॿ]'
_RUNS = [('ar', re.compile(rf'{_AR}(?:[{_AR[1:-1]}\s،؛؟\d.,:;!?()\-«»\'"]*{_AR})?'), ' dir="rtl"'),
         ('hi', re.compile(rf'{_HI}(?:[{_HI[1:-1]}\s।॥,.;:!?()\-\d]*{_HI})?'), '')]
_SKIP = re.compile(r'(<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)', re.S)

def mark(html):
    parts = _SKIP.split(html)
    inside = False
    for i, p in enumerate(parts):
        if i % 2 == 1:
            continue  # tag, script or style
        if re.search(r'<[^>]+>', p) is None and p.strip():
            for lang, rx, extra in _RUNS:
                p = rx.sub(lambda m: f'<span lang="{lang}"{extra}>{m.group(0)}</span>', p)
            parts[i] = p
    out = ''.join(parts)
    # undo double wrapping on a second run
    return re.sub(r'<span lang="(ar|hi)"( dir="rtl")?><span lang="\1"( dir="rtl")?>(.*?)</span></span>', r'<span lang="\1"\2>\4</span>', out)


# French passages (Latin script, so found by word list). Only used on the French school pages.
import json as _json, pathlib as _pl
_FR = _json.load(open(_pl.Path(__file__).parent / 'fr_words.json'))
_FRW, _FRB = set(_FR['words']), set(_FR['bridge'])
_ACC = re.compile('[àâäçéèêëîïôöùûüœÀÂÇÉÈÊËÎÏÔÙÛ]')
_APOS = r"(?:&#x27;|'|’)"
_TOK = re.compile(rf"[A-Za-zÀ-ÿœ]+(?:{_APOS}[A-Za-zÀ-ÿœ]+)*")
_JOIN = re.compile(r"^[\s,.;:!?\-…«»\"]*$|^[\s,.;:!?\-]*(?:&#x27;|'|’|&quot;)[\s,.;:!?\-]*$")

_TRIM = {'a', 'as', 'on', 'en', 'me', 'si', 'y', 'plus', 'bien', 'tout', 'tous', 'fait', 'que', 'sur', 'ou', 'et', 'des', 'les', 'ces', 'mois', 'temps', 'pays', 'livre', 'classe', 'ville', 'bon', 'nuit', 'jour', 'il', 'tu', 'l', 'd', 'j', 'n', 's', 'm', 't', 'c', 'qu'}

def _class(tok):
    parts = re.split(_APOS, tok)
    res = []
    for p in parts:
        lo = p.lower()
        if lo in _FRW or _ACC.search(lo): res.append('F')
        elif lo in _FRB: res.append('B')
        else: res.append('E')
    return res

def _mark_text_fr(text):
    toks = list(_TOK.finditer(text))
    cls = []
    for m in toks:
        c = _class(m.group(0))
        cls.append('E' if 'E' in c else ('F' if 'F' in c else 'B'))
    runs, i = [], 0
    while i < len(toks):
        if cls[i] == 'E': i += 1; continue
        j = i
        while j + 1 < len(toks) and cls[j + 1] != 'E' and _JOIN.match(text[toks[j].end():toks[j + 1].start()]): j += 1
        while i <= j and cls[i] == 'B' and toks[i].group(0).lower() in _TRIM: i += 1
        k = j
        while k >= i and cls[k] == 'B': k -= 1
        if i <= k and cls[i:k + 1].count('F') >= 1: runs.append((toks[i].start(), toks[k].end()))
        i = j + 1
    for a, b in reversed(runs):
        text = text[:a] + '<span lang="fr">' + text[a:b] + '</span>' + text[b:]
    return text

def mark_fr(html):
    parts = _SKIP.split(html)
    for i in range(0, len(parts), 2):
        if parts[i].strip(): parts[i] = _mark_text_fr(parts[i])
    out = ''.join(parts)
    return re.sub(r'<span lang="fr"><span lang="fr">(.*?)</span></span>', r'<span lang="fr">\1</span>', out)
