# Tools: rebuild and audit

The pages in `site/` are made by the Python builders in this folder. Edit the builder (or its data file), then rebuild. Do not fix a page by hand, because the next rebuild would undo it.

## Rebuild everything
```
python3 tools/rebuild_all.py
```
Runs every builder in the right order (`build_nav.py` is last) and prints ok or FAIL for each step, then `git status`. A clean tree means the pages match the builders. Commit whatever it changes. `--status-only` only shows `git status`.

New builder? Add it to `STEPS` in `rebuild_all.py` after the builders whose pages it patches.

## Audit the course pages
```
python3 tools/audit_course_pages.py
```
Checks every course page for the flagship standard (Bloom verbs, task/condition/standard, 8 modules, 8 worked examples, rubric, 10 checks with answers, L1-L7 ladder, job links), CPD pages (no fees, module tags) and school pages (10 checks, unit tags). It writes the gap list to `audits/course-page-audit.md`.

## Pull-request check
```
python3 tools/ci_check.py
```
Same as the GitHub check "Check pages" on pull requests into `claude/hfl-courses`. It fails if the rebuild changes any file, or if the audit shows a gap not already listed in `audits/course-page-audit.md`. It prints a short list of what to fix. It does not deploy and needs no secrets.
