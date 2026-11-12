#!/usr/bin/env python3
"""Build site/assets/course-index.json for the "Find a course" page (find.html).

Reads every site/assets/quiz/*.json (course, title, pass, questions[]) and writes a small list:
  {"c": course page file, "t": title, "q": number of questions, "a": area}
Only courses whose page site/<course> exists are kept. No question text goes in.
Run:  python3 tools/build_course_index.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
QUIZ = os.path.join(SITE, 'assets', 'quiz')
OUT = os.path.join(SITE, 'assets', 'course-index.json')

# First match wins, so longer prefixes come first.
AREAS = [
    ('learn-flagship-', 'Full courses'),
    ('learn-deep-', 'Deep editions'),
    ('learn-loc-', 'Local editions'),
    ('learn-gl-', 'Global courses'),
    ('course-gl-', 'Global courses'),
    ('learn-eu-', 'Europe courses'),
    ('course-eu-', 'Europe courses'),
    ('learn-ca-', 'Canada courses'),
    ('learn-brazil-', 'Brazil courses'),
    ('learn-ent-', 'Workplace tracks'),
    ('executive-module-', 'Executive programme'),
    ('school-grade-', 'School grades'),
    ('school-esl-', 'English as a second language'),
    ('cpd-', 'Professional development'),
    ('career-launch', 'Career Launch'),
    ('ai-side-income', 'AI side income'),
    ('ai-income', 'AI side income'),
    ('electrical-academy', 'Electrical academy'),
]


def area_of(name):
    for prefix, label in AREAS:
        if name.startswith(prefix):
            return label
    return 'Other courses'


def main():
    rows, skipped = [], 0
    for fn in sorted(os.listdir(QUIZ)):
        if not fn.endswith('.json'):
            continue
        try:
            with open(os.path.join(QUIZ, fn), encoding='utf-8') as f:
                d = json.load(f)
        except (OSError, ValueError):
            skipped += 1
            continue
        course = d.get('course') or fn[:-5]
        if '/' in course or '..' in course or not os.path.isfile(os.path.join(SITE, course)):
            skipped += 1
            continue
        rows.append({'c': course, 't': (d.get('title') or course).strip(),
                     'q': len(d.get('questions') or []), 'a': area_of(course)})
    rows.sort(key=lambda r: (r['a'], r['t'].lower()))
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False, separators=(',', ':'))
        f.write('\n')
    print(f'wrote {OUT}: {len(rows)} courses, {skipped} skipped, {os.path.getsize(OUT)} bytes', file=sys.stderr)


if __name__ == '__main__':
    main()
