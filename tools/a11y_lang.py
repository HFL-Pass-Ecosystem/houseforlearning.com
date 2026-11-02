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
