# Assessment key exposure and safe reactivation

## Finding (reviewed 19 November 2026)

The public `main` branch contained `netlify/functions/quizkeys.json` with 1,315 course-to-answer mappings. Treat every legacy mapping as compromised. The values must not be copied, restored or used for future grading.

This draft removes the file from its current branch tree and removes the LMS runtime dependency on it. That does not erase the values from the public `main` branch, earlier commits, forks, caches or downloads. At the time of review, `main` still contains the file. Removing it from a future current tree is containment, not historical erasure. Any public-history rewrite requires repository-owner coordination and a deliberate decision about forks and clones; this draft does not rewrite history or force-push.

The public quiz-content JSON files contain question text and options only in the inspected examples. They remain suitable only for browser-only practice/demo use. Authenticated final checks now load a versioned question set from the server alongside the matching private grading key.

## Private assessment model

- `lms_quiz_bank` stores the question set, answer sequence and assessment version together. The table has row-level security enabled and no learner-facing database policy.
- The Netlify function uses the service key server-side. Learner APIs return only question text, options, pass mark and the opaque version token. They never return the answer sequence.
- Quiz submissions must include the version token that was returned with the displayed questions. A stale page is rejected. Each stored attempt is tied to the active version, and certificate checks require a passed attempt on that exact version.
- Authored-course assessment content remains in the private course record. Learner responses omit answer fields; grading and version calculation remain server-side.

## Required reactivation steps

1. Do not seed the legacy mappings. Re-author or independently replace each affected assessment, including question wording, options, correct responses and the learning objective it measures. Verify the set against authoritative course materials and have a second reviewer check answer alignment.
2. Give every approved assessment revision a new, unique version. Change the version whenever question wording, option order, answer, question count or pass criteria change. Keep the question set and answer sequence in the same private row.
3. Load only approved new rows into `lms_quiz_bank` through a restricted server-side administrative process. Do not commit answer sequences to Git, place them in static assets, return them through learner APIs, or write them to browser logs.
4. Apply the migration and deploy the function and pages together. Confirm the learner receives the matching question version, old-version submissions are rejected, current-version grading is correct, and a certificate cannot be issued without a passed current-version attempt.
5. Keep certificate issuance paused for every course without a reviewed active private assessment. Previously recorded attempts against the `legacy` version do not count for a new version; learners must pass the replacement assessment.

The schema migration intentionally creates no seed rows. Until trusted replacement assessments are authored, reviewed and loaded, built-in final checks and certificate issuance fail closed.
