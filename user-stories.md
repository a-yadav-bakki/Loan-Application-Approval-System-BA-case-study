# User Stories — Loan Application & Approval System

Stories are grouped into epics and written in the standard format with Gherkin-style acceptance criteria. Each story links back to the FRD requirement(s) it delivers; the full mapping is in [traceability-matrix.md](traceability-matrix.md).

Story points use a modified Fibonacci scale (1, 2, 3, 5, 8, 13).

---

## Epic 1 — Applicant onboarding & application capture

### US-01 · Register with mobile OTP
**As an** applicant, **I want** to register using my mobile number and an OTP, **so that** I can start an application without creating a password.

*Traces to:* FR-APP-01 · *Priority:* Must · *Points:* 3

**Acceptance criteria**
- Given I enter a valid 10-digit Indian mobile number, when I request an OTP, then a 6-digit OTP is sent within 30 seconds and is valid for 5 minutes.
- Given I enter an incorrect OTP three times, when I try a fourth time, then I am blocked for 15 minutes and shown the retry time.
- Given the OTP is verified, when registration completes, then I land on step 1 of the application form.

### US-02 · Guided four-step application form
**As an** applicant, **I want** the application split into clear steps with a progress indicator, **so that** I know how much is left and don't feel overwhelmed.

*Traces to:* FR-APP-02 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given I am on any step, when I view the page, then I see the step names Personal & KYC, Loan details, Documents, Review & submit, with the current one highlighted.
- Given required fields on the current step are incomplete, when I click Continue, then I stay on the step and each missing field is highlighted with a message.
- Given I click Back, when the previous step loads, then my previously entered values are preserved.

### US-03 · Resume a saved draft
**As an** applicant, **I want** my progress saved automatically, **so that** I can return later without re-entering details.

*Traces to:* FR-APP-03 · *Priority:* Must · *Points:* 3

**Acceptance criteria**
- Given I move between steps, when the step changes, then the draft is saved and a "Saved" indicator is shown.
- Given I log in with a draft under 30 days old, when I open the portal, then I am offered "Continue application" with the draft's last-updated date.
- Given a draft is older than 30 days, when I log in, then the draft is marked expired and I start a new application.

### US-04 · Capture personal and KYC details with validation
**As an** applicant, **I want** immediate feedback on PAN and date-of-birth errors, **so that** I don't submit an application that will be rejected on a technicality.

*Traces to:* FR-APP-04, FR-APP-05 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given I enter a PAN not matching `AAAAA9999A`, when I leave the field, then I see "Enter PAN in the format ABCDE1234F".
- Given my date of birth makes me under 21 or over 60, when I leave the field, then I see "Applicants must be between 21 and 60 years old".
- Given all fields are valid, when I click Continue, then I proceed to Loan details.

### US-05 · Choose loan amount and tenure with live EMI
**As an** applicant, **I want** to see my monthly EMI update as I change the amount or tenure, **so that** I can pick something I can afford.

*Traces to:* FR-APP-06, FR-APP-07 · *Priority:* Should · *Points:* 5

**Acceptance criteria**
- Given the amount slider is between ₹50,000 and ₹15,00,000 in ₹5,000 steps and tenure between 12 and 60 months, when I change either, then the indicative EMI recalculates within 200 ms.
- Given the indicative EMI is shown, when I hover or tap the info icon, then I see that the rate is indicative and the final rate depends on assessment.

### US-06 · Soft eligibility check before submitting
**As an** applicant, **I want** an early indication of whether I'm likely to be eligible, **so that** I don't waste time uploading documents for an application that won't be approved.

*Traces to:* FR-APP-08 · *Priority:* Should · *Points:* 3

**Acceptance criteria**
- Given my declared income and EMIs give a post-loan FOIR ≤ 40%, when I finish Loan details, then I see "Likely eligible".
- Given FOIR is 41–60%, then I see "Borderline — consider a lower amount or longer tenure".
- Given FOIR > 60%, then I see "Unlikely to be approved at this amount" and can still proceed.
- The indicator states clearly that it is not a decision.

### US-07 · Give bureau consent and submit
**As an** applicant, **I want** to review everything and consent to a credit check before submitting, **so that** I know what I'm agreeing to.

*Traces to:* FR-APP-09, FR-APP-10 · *Priority:* Must · *Points:* 3

**Acceptance criteria**
- Given the consent checkbox is unticked, when I click Submit application, then submission is blocked and the checkbox is highlighted.
- Given consent is ticked, when I submit, then I see my reference number in the format `LN-YYYY-NNNNNN` and receive it by SMS and email.
- Given the application is submitted, when I return to the portal, then I see the status tracker rather than the form.

---

## Epic 2 — KYC and documents

### US-08 · Upload required documents
**As an** applicant, **I want** to upload documents from my phone with clear guidance on what's needed, **so that** my application isn't delayed.

*Traces to:* FR-KYC-03, FR-KYC-04 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given I am salaried, when I open the Documents step, then I see slots for identity proof, address proof, 3 months' bank statements and latest salary slip.
- Given I am self-employed, then the salary-slip slot is replaced by 2 years' ITR.
- Given I upload a 7 MB file or a .docx, when the upload starts, then it is rejected with "Use PDF, JPG or PNG under 5 MB".
- Given a required slot is empty, when I click Continue, then I cannot proceed.

### US-09 · Officer verifies documents
**As a** credit officer, **I want** to mark each document verified or rejected with a reason, **so that** the applicant knows exactly what to fix.

*Traces to:* FR-KYC-05, FR-KYC-06 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given I open a document, when I choose Reject, then I must select a reason (Unreadable, Wrong document, Expired, Name mismatch, Other).
- Given I choose Re-upload requested, when I save, then the application status becomes `Docs requested` and the applicant receives SMS and email.
- Given the applicant re-uploads, when they submit, then only the Documents step is reopened and the application returns to `Verification`.

---

## Epic 3 — Automated decisioning

### US-10 · Fetch bureau score on submission
**As the** system, **I want** to retrieve the applicant's bureau score immediately on submission, **so that** decisioning can start without delay.

*Traces to:* FR-DEC-01 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given a submitted application with consent, when the bureau call succeeds, then score, report summary and fetch timestamp are stored against the application.
- Given the bureau call fails, when three retries fail within 5 minutes, then the application is routed to manual review with the flag "Bureau unavailable".

### US-11 · Evaluate rules and auto-decide
**As a** credit risk manager, **I want** every application evaluated against the active rule set with each outcome recorded, **so that** decisions are consistent and explainable.

*Traces to:* FR-DEC-02, FR-DEC-03, FR-DEC-04, FR-DEC-05, FR-DEC-07 · *Priority:* Must · *Points:* 13

**Acceptance criteria**
- Given any hard rule fails, when evaluation completes, then status becomes `Rejected` with the mapped reason code, and the applicant is notified.
- Given all hard rules pass and STP criteria are met, then status becomes `Approved` with grade and rate set from the grid.
- Given all hard rules pass and STP criteria are not met, then status becomes `Under review` with a risk grade A–D and the correct queue (officer or senior) assigned.
- Every rule evaluation stores input value, threshold and pass/fail, viewable on the review screen.
- Decisioning completes within 60 seconds of submission (NFR-01).

### US-12 · Assign interest rate from grid
**As a** credit risk manager, **I want** the rate to come from a configurable grid by grade and tenure, **so that** pricing is consistent with risk.

*Traces to:* FR-DEC-06, FR-ADM-03 · *Priority:* Must · *Points:* 3

**Acceptance criteria**
- Given grade B and tenure 36 months, when the rate is assigned, then it equals the grid cell for B / 25–48 months.
- Given the grid is changed with an effective date, when an application submitted before that date is decided, then the earlier grid is used.

---

## Epic 4 — Credit officer console

### US-13 · Work queue
**As a** credit officer, **I want** a sortable, filterable queue of applications awaiting my review, **so that** I can work oldest or highest-value items first.

*Traces to:* FR-OFF-01, FR-OFF-06 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given I open the console, when the queue loads, then I see reference, applicant name, amount, tenure, risk grade, age in queue and status, sorted oldest first by default.
- Given I sort by amount or grade, then the order updates without a page reload.
- Given another officer opened an application within the last 30 minutes, when I open it, then I see a "Being reviewed by <name>" banner and the decision buttons are disabled.

### US-14 · Review screen
**As a** credit officer, **I want** all the information for a decision on one screen, **so that** I don't have to jump between systems.

*Traces to:* FR-OFF-02 · *Priority:* Must · *Points:* 8

**Acceptance criteria**
- Given I open an application, then I see: applicant summary, loan request with EMI and FOIR, rule evaluation results with pass/fail, bureau score and summary, document list with status, and activity history.
- Given a rule failed or was borderline, then it is visually highlighted.

### US-15 · Record a decision
**As a** credit officer, **I want** to approve, reject, counter-offer or request documents with a mandatory reason, **so that** every decision is explainable to the applicant and to auditors.

*Traces to:* FR-OFF-03, FR-OFF-04, FR-OFF-05 · *Priority:* Must · *Points:* 8

**Acceptance criteria**
- Given I choose Reject or Counter-offer, when I try to save without a reason, then saving is blocked.
- Given I choose Counter-offer, then I must enter a new amount and/or tenure within my approval limit, and the applicant receives the offer with a 7-day expiry.
- Given the requested amount exceeds my limit, when I open the application, then Approve is disabled and an "Escalate to senior officer" action is shown.
- Given I save a decision, then the status, reason, notes, my user ID and timestamp are written to the audit log.

### US-16 · Applicant accepts or declines a counter-offer
**As an** applicant, **I want** to accept or decline a revised offer, **so that** I stay in control of what I borrow.

*Traces to:* FR-OFF-08 · *Priority:* Should · *Points:* 5

**Acceptance criteria**
- Given a counter-offer exists, when I open the portal, then I see the original and revised terms side by side with the new EMI.
- Given I accept, then status becomes `Approved` with the revised terms.
- Given I decline or 7 days pass, then status becomes `Rejected` (declined) or `Expired`.

---

## Epic 5 — Status tracking and notifications

### US-17 · Status tracker
**As an** applicant, **I want** to see where my application is, **so that** I don't need to call support.

*Traces to:* FR-NOT-01 · *Priority:* Must · *Points:* 3

**Acceptance criteria**
- Given a submitted application, when I open the portal, then I see the five stages with completed, current and upcoming states clearly distinguished, plus the date each stage was reached.
- Given a decision has been made, then the tracker shows the outcome and, for rejections, the disclosable reason.

### US-18 · Notifications and LMS hand-off
**As an** operations team member, **I want** approved applications sent to the LMS automatically, **so that** disbursement can begin without manual re-keying.

*Traces to:* FR-NOT-02, FR-NOT-03 · *Priority:* Must · *Points:* 8

**Acceptance criteria**
- Given an application is approved, when the LMS accepts the payload, then status becomes `Sent to LMS` and the LMS loan ID is stored.
- Given the LMS rejects or times out, then the application is flagged for operations with the error, and retried up to three times.
- SMS and email are sent on submission, document request, decision, counter-offer and expiry using approved templates.

---

## Epic 6 — Administration and audit

### US-19 · Configure rules without deployment
**As an** admin, **I want** to change thresholds with an effective date, **so that** risk appetite changes can go live quickly and safely.

*Traces to:* FR-ADM-01, FR-ADM-02 · *Priority:* Must · *Points:* 8

**Acceptance criteria**
- Given I edit a threshold, when I save with a future effective date, then a new rule-set version is created and the current one stays active until then.
- Given an application was submitted under version 1.0, when it is re-evaluated after version 1.1 goes live, then version 1.0 is still applied.
- Every change records who made it and when.

### US-20 · Immutable audit log
**As a** compliance officer, **I want** an append-only log of every action, **so that** I can evidence decisions during a regulatory inspection.

*Traces to:* FR-ADM-04, NFR-06 · *Priority:* Must · *Points:* 5

**Acceptance criteria**
- Given any status change, decision or data edit, then an audit event with actor, timestamp, before and after values is written.
- Given I filter by application reference or date range, then I can export the results as CSV.
- Audit events cannot be edited or deleted through any interface.

### US-21 · Operational reports
**As the** head of retail lending, **I want** approval rate, turnaround time and officer productivity reports, **so that** I can track the business objectives.

*Traces to:* FR-ADM-05 · *Priority:* Should · *Points:* 5

**Acceptance criteria**
- Given I select a date range, then I see applications by status, approval rate by risk grade, average and 90th-percentile turnaround, and decisions per officer.
- Reports can be exported as CSV.

---

## Story map summary

| Epic | Stories | Must | Should | Could | Total points |
|---|---|---|---|---|---|
| 1 Onboarding & capture | US-01 – US-07 | 5 | 2 | 0 | 27 |
| 2 KYC & documents | US-08 – US-09 | 2 | 0 | 0 | 10 |
| 3 Automated decisioning | US-10 – US-12 | 3 | 0 | 0 | 21 |
| 4 Officer console | US-13 – US-16 | 3 | 1 | 0 | 26 |
| 5 Status & notifications | US-17 – US-18 | 2 | 0 | 0 | 11 |
| 6 Admin & audit | US-19 – US-21 | 2 | 1 | 0 | 18 |
| **Total** | 21 | 17 | 4 | 0 | **113** |
