# Requirements Traceability Matrix

Links each functional requirement to its business objective, the user story that delivers it, the API operation that exposes it, the prototype screen that demonstrates it, and the test scenarios that verify it. Gaps are called out at the end.

| Requirement | Business objective | User story | API (api-contract.yaml) | Prototype screen | Test scenarios |
|---|---|---|---|---|---|
| FR-APP-01 | BO-3 | US-01 | `POST /auth/otp`, `POST /auth/verify` | Applicant · sign-in | TS-01, TS-02 |
| FR-APP-02 | BO-3 | US-02 | — | Applicant · steps 1–4 | — (UX review) |
| FR-APP-03 | BO-3 | US-03 | `PUT /applications/{ref}` | Applicant · sign-in → tracker | TS-07, TS-08 |
| FR-APP-04 | BO-2 | US-04 | `PUT /applications/{ref}` | Applicant · step 1 | TS-03 |
| FR-APP-05 | BO-2 | US-04 | `PUT /applications/{ref}` | Applicant · step 1 | TS-03 – TS-06 |
| FR-APP-06 | BO-3 | US-05 | `PUT /applications/{ref}` | Applicant · step 2 | TS-10 |
| FR-APP-07 | BO-3 | US-05 | client-side | Applicant · step 2 | TS-09 |
| FR-APP-08 | BO-3 | US-06 | client-side | Applicant · step 2 | TS-11, TS-12 |
| FR-APP-09 | BO-4 | US-07 | `POST /applications/{ref}/submit` | Applicant · step 4 | TS-13 |
| FR-APP-10 | BO-1 | US-07 | `POST /applications/{ref}/submit` | Applicant · tracker | TS-14 |
| FR-KYC-01 | BO-2 | US-11 | internal | Officer · review (KYC panel) | TS-19, TS-20 |
| FR-KYC-02 | BO-2 | US-11 | internal | Officer · review (KYC panel) | — (vendor test) |
| FR-KYC-03 | BO-3 | US-08 | `POST /applications/{ref}/documents` | Applicant · step 3 | TS-15, TS-16 |
| FR-KYC-04 | BO-3 | US-08 | `POST /applications/{ref}/documents` | Applicant · step 3 | TS-17, TS-18 |
| FR-KYC-05 | BO-2 | US-09 | `PATCH /applications/{ref}/documents/{id}` | Officer · review (documents) | TS-21 |
| FR-KYC-06 | BO-3 | US-09 | `PATCH /applications/{ref}/documents/{id}` | Applicant · tracker | TS-21, TS-22 |
| FR-KYC-07 | BO-1 | — (Could, unscheduled) | — | — | — |
| FR-DEC-01 | BO-1 | US-10 | internal | Officer · review (bureau) | TS-31 |
| FR-DEC-02 | BO-2 | US-11 | `GET /applications/{ref}/evaluation` | Officer · review (rules) | TS-23 – TS-30 |
| FR-DEC-03 | BO-1 | US-11 | internal | Officer · queue | TS-23, TS-27, TS-28 |
| FR-DEC-04 | BO-2 | US-11 | internal | Applicant · tracker | TS-25, TS-29, TS-30 |
| FR-DEC-05 | BO-2 | US-11 | internal | Officer · queue | TS-24, TS-28 |
| FR-DEC-06 | BO-2 | US-12 | `GET /applications/{ref}` | Officer · review | TS-23 |
| FR-DEC-07 | BO-4 | US-11 | `GET /applications/{ref}` | Applicant · tracker | TS-25 |
| FR-DEC-08 | BO-1 | US-09 | internal | — | TS-22 |
| FR-OFF-01 | BO-1 | US-13 | `GET /queue` | Officer · queue | TS-33, TS-34 |
| FR-OFF-02 | BO-2 | US-14 | `GET /applications/{ref}`, `/evaluation` | Officer · review | TS-35 |
| FR-OFF-03 | BO-2 | US-15 | `POST /applications/{ref}/decision` | Officer · review (actions) | TS-37 |
| FR-OFF-04 | BO-4 | US-15 | `POST /applications/{ref}/decision` | Officer · review (actions) | TS-36 |
| FR-OFF-05 | BO-2 | US-15 | `POST /applications/{ref}/decision` (403) | Officer · sign-in role, review (actions) | TS-38, TS-39 |
| FR-OFF-06 | BO-1 | US-13 | `POST /applications/{ref}/lock` | — | TS-40, TS-41 |
| FR-OFF-07 | BO-1 | — (Should, sprint 5) | `POST /queue/{ref}/reassign` | — | — |
| FR-OFF-08 | BO-3 | US-16 | `POST /applications/{ref}/offer-response` | Applicant · tracker | TS-37, TS-42, TS-43 |
| FR-NOT-01 | BO-3 | US-17 | `GET /applications/{ref}` | Applicant · tracker | TS-44 |
| FR-NOT-02 | BO-3 | US-18 | internal | — | TS-14, TS-21 |
| FR-NOT-03 | BO-1 | US-18 | internal (LMS) | — | TS-45, TS-46 |
| FR-NOT-04 | BO-3 | — (Could, unscheduled) | — | — | — |
| FR-ADM-01 | BO-2 | US-19 | `PUT /admin/rules` | — | TS-32 |
| FR-ADM-02 | BO-4 | US-19 | `GET /admin/rules/{version}` | — | TS-32 |
| FR-ADM-03 | BO-2 | US-12 | `PUT /admin/rate-grid` | — | TS-23 |
| FR-ADM-04 | BO-4 | US-20 | `GET /admin/audit` | — | TS-47, TS-48 |
| FR-ADM-05 | BO-1 | US-21 | `GET /admin/reports` | — | TS-49 |
| FR-ADM-06 | — | Won't | — | — | — |

## Gaps and actions

| Gap | Action | Owner |
|---|---|---|
| FR-KYC-02 has no internal test scenario | Add vendor-sandbox scenario once identity provider test credentials are available | QA Lead |
| FR-OFF-07 has no user story yet | Write US-22 when Should items are scheduled (sprint 5) | Business Analyst |
| Admin screens are not in the prototype | Prototype covers the two highest-traffic personas; admin screens to be wireframed in sprint 3 | Business Analyst |
| FR-APP-02 verified by UX review only | Acceptable — usability, not a functional rule; note in test plan | QA Lead |
