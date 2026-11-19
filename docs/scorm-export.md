# SCORM 1.2 export

Author Studio can download a trainer-approved or published course as a SCORM 1.2 ZIP package. The ZIP contains an imsmanifest.xml at its root, one SCO, the course player, styles and assessment data.

## What the package reports

- Current lesson bookmark and completed lesson indexes through cmi.core.lesson_location and cmi.suspend_data.
- Final-check score (0–100) and one SCORM 1.2 lesson status: incomplete, passed or failed.
- A passing threshold of 70%, matching the current HFL Author Studio final check.

The package is scored in the learner's browser. Its assessment answer key is part of the downloadable course files. Use this export for ordinary formative learning and cross-platform delivery, not for a high-stakes or fraud-resistant HFL award.

## What stays in HFL

The SCORM package does not contain learner identity or HFL account data. It does not send progress back to HFL, create an HFL enrolment, transfer rubric-assignment submissions, verify HFL credits, or issue an HFL certificate. The HFL server remains authoritative for HFL learner records and issuer-verified credentials.

## Media and portability

Text, callouts, scenarios and flashcards travel with the package. Author-provided image and video URLs remain external references: images load only after a learner chooses to load them, and video opens separately. This requires a network connection and means the media is not self-contained. Some LMSs reject or fail to play packages that depend on external content. Absorb's current guidance explicitly warns that external content URLs inside SCORM packages are unsupported. A self-contained asset-upload and packaging workflow is still required before HFL can claim reliable Absorb portability.

## LMS compatibility boundary

This is a basic SCORM 1.2 package export, not a direct Canvas, Absorb, Expertus, Articulate or other vendor integration. An LMS administrator may need to enable its SCORM import feature. Instructure documents SCORM import in Canvas Career when the SCORM LTI is enabled; support and setup can vary by Canvas product and account. Absorb documents import for SCORM 1.2 and SCORM 2004. Articulate notes that status interpretation varies between LMSs, especially for SCORM 1.2. The SCORM 1.2 format exposes one lesson status, so it cannot independently report completion and success as separate fields.

The current HFL export has not been validated against the SCORM XML schemas or imported into SCORM Cloud, Canvas, Absorb, Expertus or Articulate. Do not describe it as certified or conformant. Before learner release, validate the package and verify launch, bookmark, score, pass/fail and relaunch behavior in each target LMS.

## Limits in the current exporter

- 1–200 lessons and 1–60 final-check questions.
- One SCO with a single course-level result.
- Multiple-choice questions only; correct answers are included in the package.
- No item-level grade passback, proctoring, question randomization, rubric review, xAPI/cmi5 statements, LTI 1.3 launch, payment or credential synchronization.
- Media assets are not copied into the ZIP yet.

## References

- [Instructure: Import SCORM files in Canvas Career](https://community.instructure.com/en/kb/articles/664388-how-do-i-import-scorm-files-in-canvas-career)
- [Absorb: Third-party courses (SCORM, AICC and Tin Can)](https://support.absorblms.com/hc/en-us/articles/4946744843539-Third-Party-Courses-SCORM-AICC-Tin-Can)
- [Articulate: Completion and success statuses in an LMS](https://www.articulatesupport.com/article/how-to-report-completion-status-and-success-status-to-an-lms)
