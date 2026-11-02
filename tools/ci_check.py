#!/usr/bin/env python3
"""Pull-request check. Run from the repo root:  python3 tools/ci_check.py
1. tools/rebuild_all.py must leave `git status` empty (pages match the builders).
2. tools/audit_course_pages.py must show no gap that is not already listed in audits/course-page-audit.md.
3. tools/check_links.py must pass (local files and #anchors exist; no Russia or other-brand links).
4. tools/audit_school_spec.py must exit 0 (skipped with a note while the file does not exist).
5. tools/check_secrecy.py must pass (banned words in data/secrecy-words.json).
Prints a short list of what is wrong and exits 1. No deploy, no secrets, no network."""
import subprocess, sys, re, pathlib, tempfile
ROOT = pathlib.Path(__file__).resolve().parent.parent
def run(*a):
    return subprocess.run(a, cwd=ROOT, capture_output=True, text=True)
problems = []

r = run(sys.executable, 'tools/rebuild_all.py')
st = run('git', 'status', '--short').stdout.splitlines()
failed = re.search(r'failed steps: (\[.*\])', r.stdout)
if failed and failed.group(1) != '[]' or r.returncode not in (0, 1):
    problems.append('A builder failed: ' + (failed.group(1) if failed else 'see log') + '. Run: python3 tools/rebuild_all.py')
if st:
    problems.append(f'Rebuild changes {len(st)} file(s). Run python3 tools/rebuild_all.py, check the diff, and commit it (or fix the builder). First files:')
    problems += ['    ' + s for s in st[:15]] + (['    ... and %d more' % (len(st) - 15)] if len(st) > 15 else [])

base = ROOT / 'audits' / 'course-page-audit.md'
known = set(re.findall(r'^- (\S+?): (.*)$', base.read_text(encoding='utf-8'), re.M)) if base.exists() else set()
with tempfile.TemporaryDirectory() as d:
    rep = pathlib.Path(d) / 'audit.md'
    a = run(sys.executable, 'tools/audit_course_pages.py', str(rep))
    if a.returncode != 0 or not rep.exists():
        problems.append('Audit did not run: ' + a.stderr.strip()[-300:])
    else:
        now = set(re.findall(r'^- (\S+?): (.*)$', rep.read_text(encoding='utf-8'), re.M))
        new = sorted(now - known)
        if new:
            problems.append(f'Audit: {len(new)} new gap(s) not in audits/course-page-audit.md:')
            problems += ['    %s: %s' % x for x in new[:20]] + (['    ... and %d more' % (len(new) - 20)] if len(new) > 20 else [])
        gone = known - now
        if gone:
            print(f'Note: {len(gone)} listed gap(s) are fixed; refresh audits/course-page-audit.md with python3 tools/audit_course_pages.py')

lk = run(sys.executable, 'tools/check_links.py')
if lk.returncode != 0:
    problems.append('Links: ' + '\n'.join(l for l in lk.stdout.strip().splitlines()[:40]))

sc = run(sys.executable, 'tools/check_secrecy.py')
if sc.returncode != 0:
    problems.append('Secrecy: ' + '\n'.join(sc.stdout.strip().splitlines()[:40]))

sp = ROOT / 'tools' / 'audit_school_spec.py'
if sp.exists():
    s = run(sys.executable, str(sp))
    if s.returncode != 0:
        problems.append('School spec audit failed:\n    ' + '\n    '.join((s.stdout + s.stderr).strip().splitlines()[-20:]))
else:
    print('Note: tools/audit_school_spec.py not found; school spec check skipped.')

if problems:
    print('CHECK FAILED\n' + '\n'.join(problems))
    sys.exit(1)
print('Check passed: rebuild is clean and the audit shows no new gaps.')
