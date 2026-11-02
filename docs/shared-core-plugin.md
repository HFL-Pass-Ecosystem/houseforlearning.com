# HFL plug-in sheet for the shared core (contract v0.1, PR #234)

HFL stays in family HFL. Own tenant `hfl`, own store, own sign-in. No public link to any other brand. Scorecard pages are owner-only and noindex.

## Site file keys HFL expects (config/sites/hfl.properties)
| Key | Value now in PR | HFL asks |
|---|---|---|
| currency | INR | USD (learner prices are in USD; INR shown as a convenience only) |
| languages | en | list all supported languages (picker offers all world languages; English default) |
| mimo.on | MI11 | keep; add the HFL signals below if the core adds them |
| weight / target | TE02=3 (80), TE04=2 | keep |

## HFL measures mapped to the shared catalogue
| HFL need | Shared id | Note |
|---|---|---|
| Learners' repeat enrolments | CI02 | ok |
| Form to reply time | CI04 | ok, fed by `reply.sent` |
| Support tickets in time | TE05 | ok |
| Certified teacher share | TE02 | ok |
| Reused knowledge articles | TE04 | ok |
| Service uptime | OE05 | ok |
| Partner and author settlements on time | OE06 | ok (90/10) |
| Partner agreements signed after review | LG01 | ok |
| Revenue, margin, cash | FN01, FN02, FN03 | ok |

## Gaps: measures HFL needs that are not in the catalogue
1. Course completion rate (%, higher, CUSTOMER/INTIMACY, MIS) 
2. Active learners this month (count, higher, CUSTOMER/INTIMACY, MIS)
3. Content published on time (%, higher, CUSTOMER/EXCELLENCE, MIS)
4. Partner onboarding time (days, lower, CUSTOMER/EXCELLENCE, CRM)
5. Languages offered (count, higher, CUSTOMER/INTIMACY, MIS)

## Hook differences
- `enrolment.completed` is defined as "taught by a certified expert" (feeds TE02). HFL also needs a plain `course.completed` (1 = learner finished) for measure 1, and `enrolment.started` for measure 2. Suggest renaming the current event `enrolment.checked` or keeping it and adding the two new ones.
- Add `form.received` (CRM, value 1) so every contact, message and partner form counts as a lead event, and `partner.onboarded` (value = days) for measure 4.
- Existing HFL forms in test: contact, message, partner (six fields), language request, opinions.

## MIMO signals for HFL (uncontrollable, not scored)
Demand by sector and country, regulation and skills-mission changes, competitor offers, exam and academic calendar. Use existing MI ids where they fit.

## Not built yet on HFL
Scorecard screen, CRM pipeline, MIS dashboards, F&O ledger, automation journeys. They wait for the core to be wired into the Platform services.
