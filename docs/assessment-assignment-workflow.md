# HFL assignment and rubric workflow

## Learner and facilitator flow

1. A course author saves an assignment draft from Author Studio. Each task includes directions, one or more observable outcomes, and two to eight point-based criteria.
2. The author sends the draft to a facilitator. It remains private until approved.
3. A facilitator approves it or requests changes with a note. Approval publishes the assignment.
4. An enrolled learner submits written work and may add one optional HTTPS evidence link. A resubmission is recorded as a new attempt.
5. The course author or a facilitator scores every criterion and leaves feedback. The learner sees the score, rubric breakdown and feedback on returning to the assignment page.

The automatic final check remains separate from the practical assignment. This preserves a clear distinction between machine-scored recall and human-reviewed applied work. A course certificate is issued only when all course units and the final check are complete and every assignment marked as certificate-required is published and passed on the learner's latest graded attempt. New assignments default to a 70% rubric pass mark; authors can make a task optional or set another threshold from 1% to 100%.

## Stored model

- `lms_assignments`: course, author, title, directions, outcomes, rubric, review state and review note.
- `lms_assignment_submissions`: learner, attempt number, written response, optional evidence URL, criterion scores, feedback, total score and grader.
- Rubric criteria have stable IDs, a label, evidence guidance and a maximum point value. Scores are validated against those maxima on the server. Each assignment also records whether it gates the certificate and the minimum required percentage.
- The learner page receives only published tasks and that learner's latest attempt. Authors and facilitators can view submissions; the browser never receives the Supabase service key.

## Privacy and operational controls

- Both tables have row-level security enabled and no browser access policies. Requests pass through the authenticated Netlify function.
- Evidence is text plus an HTTPS link; the workflow does not accept file uploads.
- Learners are warned not to submit confidential or sensitive personal information. Facilitators see a short pseudonymous learner label rather than an email address.
- Supabase changes are idempotent and are included in `supabase/lms.sql`; the standalone migration is `supabase/migrations/20261119_assignment_rubrics.sql`.
- Before deployment, apply the schema and deploy the Netlify function and static pages together.

## Interoperability boundary

Author Studio can export trainer-approved courses as a basic SCORM 1.2 ZIP package with one SCO and one course-level result. This is a content export, not a direct Canvas, Absorb, Expertus or Articulate integration. External image and video references are not packaged, and SCORM 1.2 exposes only one lesson status. The SCORM package contains a browser-side answer key, and its external-media limitation makes the export unsuitable for high-stakes HFL awards. The HFL server remains authoritative for rubric assignments, learner identity, credit and HFL certificates.

The current package has not been validated against the SCORM XML schemas or imported into a target LMS. Read docs/scorm-export.md for its reporting model, limits and validation work required before learner release.

## Issuer identity

- Verified HFL certificates persist the issuer key, display name and domain with each award, so later branding changes do not rewrite the public record.
- The public certificate page displays the issuer-named seal and issuer name. PAVER and browser-only practice credentials remain visibly labelled as demos and do not represent academic credit or an accredited qualification.

## Assessment key protection

Authenticated final checks now receive sanitized questions and an opaque version from the LMS server. The answer sequence stays private, submissions are graded server-side, and each attempt is tied to the version that was shown. Built-in assessments without a reviewed active private bank row fail closed, including certificate issuance. Browser-only practice files are demos and do not confer HFL credit.

The public repository previously contained legacy answer mappings. Do not reuse them; this draft removes the file from its branch tree but cannot remove it from public Git history. See [assessment-key-incident.md](assessment-key-incident.md) for containment, replacement and reactivation requirements.
