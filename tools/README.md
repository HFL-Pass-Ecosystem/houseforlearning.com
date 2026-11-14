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
Same as the GitHub check "Check pages" on pull requests into `ahfl/hfl-courses`. It fails if the rebuild changes any file, if the audit shows a gap not already listed in `audits/course-page-audit.md`, if `tools/check_links.py` finds a broken link, if `tools/check_secrecy.py` finds a banned word, or if `tools/audit_school_spec.py` fails (skipped while that file does not exist). It prints a short list of what to fix. It does not deploy and needs no secrets.

## Link check
```
python3 tools/check_links.py
```
Every local `href`/`src` must point to an existing file, every `#anchor` must exist in its target page, and no page may link to a Russia page or to another domain (allowed hosts are listed at the top of the script). Fix a broken link in the builder, then rebuild.

## Secrecy check
```
python3 tools/check_secrecy.py
```
Scans everything the browser receives (`site/`: pages, scripts, styles, data; comments included) for the words and patterns in `data/secrecy-words.json`: private names, other brand names, internal owner remarks, group wording, Russia "HELD" lines, the shared mailbox, fee amounts on CPD pages, Career Launch percentages, and USD 39/79 outside the six membership pages. To change what is banned, edit the JSON, not the script. Fix a hit in the builder, then rebuild.

## Pay-flow check (browser)
```
npm i --no-save playwright && npx playwright install chromium
node tools/check_payflow.js
```
Opens a sample of pages from each course family (school, CPD, GL flagship, four-place editions, executive, Electrical academy and Career Launch lessons) at 1280 px and 390 px. It checks signed out, signed in, the test payment and Members > My courses, and exits with 1 if any page fails. Options: `--per-family N`, `--widths 1280,390`, `--family school,cpd`, `--pages a.html,b.html`. The GitHub check "Check pay flow" runs it by hand (Run workflow) and on pull requests that change `access.js` or `courses.css`. It is not part of "Check pages", which stays Python-only. Test only: no real money, no secrets.

## How to read the CI results (for the owner)

Every pull request into `ahfl/hfl-courses` gets a check called **Check pages**. It is a robot that rebuilds the whole site and looks for mistakes. You do not need to run anything.

**Where to look**
1. Open the pull request on GitHub and scroll to the box at the bottom, headed "Checks".
2. A **green tick** next to "Check pages" means: safe on these points. A **red cross** means: do not fold yet. A yellow dot means it is still running (about a minute).
3. To see why it is red, click **Details**, then open the step **Run python3 tools/ci_check.py**. The text starts with `CHECK FAILED` and then lists each problem in short lines.
4. To check the newest folded work without a pull request: GitHub > Actions > Check pages > **Run workflow**, pick the branch `ahfl/hfl-courses`, and open the run when it finishes.

**What each message means**
| Message starts with | Meaning | Who fixes it |
|---|---|---|
| `Rebuild changes N file(s)` | A page was edited by hand, or a builder changed, and the pages no longer match. Pages must be made by the builders. | The thread that opened the PR runs `python3 tools/rebuild_all.py` and commits. |
| `A builder failed` | One build step crashed. | The thread that opened the PR. |
| `Audit: N new gap(s)` | A course page is missing something it must have (modules, worked examples, ten checks, ladder, job links). | The thread that owns that course. |
| `Links:` | A link points to a missing page or `#anchor`, to a Russia page, or to another company's domain. | The thread that opened the PR. |
| `Secrecy:` | A banned word is on a served page, script or style: a private name, another brand, an internal note, a fee on a CPD page, and so on. | The thread that opened the PR. The word list is `data/secrecy-words.json`. |
| `School spec audit failed` | A school page does not meet the school spec. | The School thread. |

**Good to know**
- The check only reads files. It does not publish anything, uses no passwords, and cannot change the live site.
- Green does not mean the wording is right. It means rebuilds are clean, links work, nothing secret shows, and the audit found no new gap. Proofreading is still a person's job.
- If a red run looks wrong to you, send the link to the run. Do not re-run it again and again; a second red run means the problem is real.
