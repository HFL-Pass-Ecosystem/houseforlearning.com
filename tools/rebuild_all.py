#!/usr/bin/env python3
"""Rebuild every generated page in the right order, then show what changed.

Run from the repo root:  python3 tools/rebuild_all.py
On a clean checkout where the pages are up to date, `git status` afterwards is empty (a zero-diff rebuild).
Order matters: base course pages first, then the specialised course builders, the regional and location pages, the hubs and
index pages, the gates and patches, and the site-wide navigation layer last.
Nothing is deleted. Each step is a script in tools/ run as its own process, so one failing step is reported and the rest still run."""
import subprocess, sys, pathlib, time
ROOT = pathlib.Path(__file__).resolve().parents[1]
STEPS = [
    'build_full_courses',      # adult, enterprise-style base pages, hubs, learner groups
    'build_school_deep',       # school-*.html (deep pages overwrite nothing from the step above)
    'build_courses',
    'build_cpd',
    'build_enterprise_courses',
    'flagship_gl_a', 'flagship_gl_b', 'build_flagship_gl',      # GL flagships
    'flagship_eu_a', 'flagship_eu_b',                           # Europe flagships
    'flagship_nl_sg_au', 'flagship_uae', 'flagship_brazil', 'flagship_canada', 'flagship_in',
    'flagship_career_launch', 'flagship_earthing', 'build_flagship_cv', 'build_flagship_lms',
    'build_electrical_academy', 'build_executive',
    'loc_deep', 'loc_deep_all', 'loc_editions', 'flagship_loc_four',   # four-place location pages
    'build_regional_hubs', 'build_courses_all',
    'build_access_pages', 'add_series_gate', 'patch_audience_pages',
    'build_services', 'build_support', 'build_wix_content', 'build_org_pages', 'build_home', 'build_timetool',
    'build_ai_income',          # AI side-income path: hub + 15 lessons (own words, no outside names)
    'build_my_learning', 'build_welcome_map',        # signed-in learning home (test only)
    'build_start_here',        # start-a-course page: real courses a visitor can join and take
    'build_nav',               # site-wide navigation layer
    'build_sitemap',           # sitemap from the indexable pages: after all page builders
    'build_seo',               # titles at most 70 characters, unique, and real meta descriptions: always last
    'sync_share_tags',         # share tags follow each page's own title, description and address: always last
    'externalise_inline_scripts',   # the site's security rule blocks inline scripts: move them to site/assets/inline
]
def main(argv):
    only_check = '--status-only' in argv
    bad = []
    if not only_check:
        for s in STEPS:
            t = time.time()
            r = subprocess.run([sys.executable, str(ROOT / 'tools' / f'{s}.py')], cwd=ROOT, capture_output=True, text=True,
                               env={**__import__('os').environ, 'PYTHONDONTWRITEBYTECODE': '1'})
            print(f'{"ok " if r.returncode == 0 else "FAIL"} {s} ({time.time() - t:.1f}s)')
            if r.returncode != 0:
                bad.append(s); print(r.stderr[-400:])
    st = subprocess.run(['git', 'status', '--short'], cwd=ROOT, capture_output=True, text=True).stdout
    n = len([l for l in st.splitlines() if l.strip()])
    print(st[:3000] if n else 'git status: clean (zero diff)')
    print(f'{n} changed files; failed steps: {bad or "none"}')
    return 1 if (bad or n) else 0
if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
