# HFL member home (demo)

One signed-in home for LMS, EMS, AMS (Author), TMS, marketplace, workplace, tools, careers and PHYGITAL (physical, hybrid, digital).
Static page, demo data only, no sign-in wiring, nothing live. Open `index.html` in a browser.
Brand: Montserrat, #0F85DB, #3CC261, #F2EEE2 (Almost Ivory, "L156").
Layout follows lessons 18 to 28 of operating-model/playbook/how-we-build.md (draft PR 373), in our own words and design.
Careers links to ../career-tree/ (draft PR 374). Next: wire to the real sign-in and LMS data (HFL finish thread).

## Real sign-in (HFL Supabase)
`config.js` holds two PUBLIC values: `supabaseUrl` and `supabaseAnonKey` (the publishable key). Never a secret key.
- Both empty: demo mode (sample member, no sign-in).
- Both filled: shows an email and password sign-in, plus a one-tap email link. No typed codes. After sign-in the greeting, email and profile use the real account. Courses, classes and other lists stay demo until the real LMS tables are joined.
HFL only. Never point this at the AMS (Avyra) project.
Tested with a stand-in sign-in server (wrong password, one-tap link, good password, sign-out). Not yet tested against the real HFL project.
