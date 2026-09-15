# Test Scenarios

High-level test scenarios derived from the user stories and business rules. Each scenario links to the requirement it verifies; detailed test cases and data sets are produced by QA from these.

Legend: **P** = positive path · **N** = negative / validation · **E** = edge case

---

## 1. Applicant registration and capture

| ID | Type | Scenario | Steps | Expected result | Verifies |
|---|---|---|---|---|---|
| TS-01 | P | Register with valid mobile and OTP | Enter mobile, request OTP, enter correct OTP | Registration succeeds; step 1 opens | FR-APP-01 / US-01 |
| TS-02 | N | Three wrong OTP attempts | Enter wrong OTP three times, then a fourth | Fourth attempt blocked; 15-minute lockout message shown | FR-APP-01 / US-01 |
| TS-03 | N | Invalid PAN format | Enter `ABC123` in PAN field, tab out | Inline error with expected format; Continue disabled | FR-APP-05 / US-04 |
| TS-04 | E | Applicant exactly 21 today | DOB = today minus 21 years | Accepted | FR-APP-05 / US-04 |
| TS-05 | E | Applicant turns 61 tomorrow | DOB = tomorrow minus 61 years | Accepted (still 60 at submission) | FR-APP-05 / US-04 |
| TS-06 | N | Applicant aged 20 | DOB = today minus 20 years | Error: must be 21–60 | FR-APP-05 / US-04 |
| TS-07 | P | Draft auto-save and resume | Complete step 1, close browser, log in next day | "Continue application" offered; step 1 data intact | FR-APP-03 / US-03 |
| TS-08 | E | Draft older than 30 days | Draft last updated 31 days ago | Draft marked expired; new application starts | FR-APP-03 / US-03 |
| TS-09 | P | Live EMI recalculates | Move amount slider from ₹3L to ₹4L at 36 months | EMI updates within 200 ms and matches formula at grade-B rate | FR-APP-07 / US-05 |
| TS-10 | N | Amount outside range | Attempt ₹20,00,000 | Capped at ₹15,00,000; helper text shown | FR-APP-06 / US-05 |
| TS-11 | P | Soft eligibility "Likely" | Income ₹80,000, existing EMI ₹5,000, ₹3L / 36m | Indicator = Likely eligible (FOIR ≈ 19%) | FR-APP-08 / US-06 |
| TS-12 | P | Soft eligibility "Borderline" | Income ₹40,000, EMI ₹8,000, ₹4L / 36m | Indicator = Borderline (FOIR ≈ 54%) | FR-APP-08 / US-06 |
| TS-13 | N | Submit without bureau consent | Leave consent unticked, click Submit | Submission blocked; checkbox highlighted | FR-APP-09 / US-07 |
| TS-14 | P | Successful submission | Tick consent, submit | Reference `LN-2026-NNNNNN` shown; SMS + email received; status tracker replaces form | FR-APP-10, FR-NOT-02 / US-07 |

## 2. Documents and KYC

| ID | Type | Scenario | Steps | Expected result | Verifies |
|---|---|---|---|---|---|
| TS-15 | P | Salaried document slots | Employment type = Salaried, open Documents | Slots: ID proof, address proof, 3 bank statements, salary slip | FR-KYC-03 / US-08 |
| TS-16 | P | Self-employed document slots | Employment type = Self-employed | Salary slip replaced by 2 years' ITR | FR-KYC-03 / US-08 |
| TS-17 | N | Oversized file | Upload 7 MB PDF | Rejected with size/format message | FR-KYC-04 / US-08 |
| TS-18 | N | Wrong file type | Upload .docx | Rejected with size/format message | FR-KYC-04 / US-08 |
| TS-19 | P | PAN verified automatically | Submit with valid PAN and matching name | PAN status = Verified with timestamp | FR-KYC-01 |
| TS-20 | N | PAN name mismatch | Name on form differs from PAN record | Hard rule BR-H05 fails → Auto-reject `KYC_FAILED` | FR-KYC-01, FR-DEC-04 |
| TS-21 | P | Officer requests re-upload | Officer marks salary slip "Re-upload requested — Unreadable" | Status = Docs requested; applicant notified; only Documents step reopened | FR-KYC-05, 06 / US-09 |
| TS-22 | P | Re-upload returns to verification | Applicant uploads new slip | Status = Verification; decisioning re-runs | FR-KYC-06, FR-DEC-08 |

## 3. Automated decisioning (uses examples in business-rules.md §7)

| ID | Type | Scenario | Input | Expected result | Verifies |
|---|---|---|---|---|---|
| TS-23 | P | STP auto-approve | Example 1: salaried, 32, ₹80k income, ₹3L/36m, bureau 780 | Approved; grade A; rate 12.0%; decided < 60 s; all rule outcomes stored | FR-DEC-02, 03, 06 / US-11 |
| TS-24 | P | Manual review — senior queue | Example 2: self-employed, ₹8L/48m, bureau 720 | Under review; grade C; assigned to senior queue; flagged high risk | FR-DEC-05 / US-11 |
| TS-25 | P | Auto-reject on score | Example 3: bureau 640 | Rejected; reason `SCORE_BELOW_MIN`; applicant notified with disclosable reason | FR-DEC-04, 07 / US-11 |
| TS-26 | E | Bureau score exactly 650 | Bureau 650, all else passing | BR-H03 passes (≥ 650) | BR-H03 |
| TS-27 | E | Bureau score exactly 750, FOIR 40%, amount ₹5,00,000 | Boundary STP inputs | Auto-approved (all STP conditions inclusive) | FR-DEC-03 |
| TS-28 | E | Amount ₹5,05,000 with STP-quality profile | Bureau 800, FOIR 20% | Not STP (amount > ₹5L) → Under review, senior queue | FR-DEC-03, 05 |
| TS-29 | N | FOIR above 60% | Income ₹30k, existing EMI ₹10k, ₹5L/60m | BR-H07 fails → Auto-reject `FOIR_EXCEEDED` | BR-H07 |
| TS-30 | N | Recent default | Bureau report shows write-off 12 months ago | BR-H04 fails → Auto-reject `RECENT_DEFAULT` | BR-H04 |
| TS-31 | E | Bureau unavailable | Simulate bureau timeout ×3 | Routed to manual review with "Bureau unavailable" flag | US-10 |
| TS-32 | P | Rule set versioning | Submit under v1.0; admin publishes v1.1 (score cut-off 700); re-evaluate | v1.0 still applied to that application | FR-ADM-02 / US-19 |

## 4. Officer console

| ID | Type | Scenario | Steps | Expected result | Verifies |
|---|---|---|---|---|---|
| TS-33 | P | Queue default order | Open console with 5 items of different ages | Oldest first; columns as specified | FR-OFF-01 / US-13 |
| TS-34 | P | Sort by amount | Click Amount header | Descending by amount; no page reload | FR-OFF-01 / US-13 |
| TS-35 | P | Review screen completeness | Open TS-24 application | Summary, request with EMI/FOIR, rule results with fail highlights, bureau, documents, history all visible | FR-OFF-02 / US-14 |
| TS-36 | N | Reject without reason | Choose Reject, leave reason blank, Save | Blocked; reason required | FR-OFF-04 / US-15 |
| TS-37 | P | Counter-offer | Officer offers ₹6L → ₹4L / 48m | Status = Counter-offered; applicant sees old vs new terms; 7-day expiry set | FR-OFF-03, 08 / US-15, 16 |
| TS-38 | N | Approve above limit | Credit Officer opens ₹7L application | Approve disabled; "Escalate to senior officer" shown | FR-OFF-05 / US-15 |
| TS-39 | N | Counter-offer above limit | Credit Officer counter-offers ₹5,50,000 | Blocked: exceeds ₹5,00,000 limit | FR-OFF-05 / US-15 |
| TS-40 | E | Concurrent review | Officer A opens item; Officer B opens same item within 30 min | B sees "Being reviewed by A"; decision buttons disabled | FR-OFF-06 / US-13 |
| TS-41 | E | Lock expiry | Officer A opens item, idle 31 minutes; B opens | B can decide | FR-OFF-06 |
| TS-42 | P | Applicant accepts counter-offer | Applicant clicks Accept within 7 days | Status = Approved with revised terms; sent to LMS | FR-OFF-08 / US-16 |
| TS-43 | E | Counter-offer expires | No response for 7 days | Status = Expired; applicant notified | FR-OFF-08 / US-16 |

## 5. Notifications, LMS and audit

| ID | Type | Scenario | Steps | Expected result | Verifies |
|---|---|---|---|---|---|
| TS-44 | P | Status tracker stages | Track TS-23 application | Submitted → Verification → Decision shown with dates; Under review skipped for STP | FR-NOT-01 / US-17 |
| TS-45 | P | LMS hand-off | Approve application | Payload sent; LMS ack stored; status = Sent to LMS | FR-NOT-03 / US-18 |
| TS-46 | N | LMS timeout | Simulate LMS down | Three retries; operations flag raised with error | US-18 |
| TS-47 | P | Audit completeness | Perform submit, doc reject, counter-offer, accept | Four audit events with actor, timestamp, before/after | FR-ADM-04 / US-20 |
| TS-48 | N | Audit immutability | Attempt to edit or delete an audit row through API and DB role | Rejected; no interface permits modification | NFR-06 / US-20 |
| TS-49 | P | Report accuracy | Generate approval-rate report for a seeded data set | Figures match seeded totals | FR-ADM-05 / US-21 |

## 6. Non-functional

| ID | Type | Scenario | Method | Expected result | Verifies |
|---|---|---|---|---|---|
| TS-50 | P | Page load on 4G | Throttled network profile, applicant steps | ≤ 2 s per page | NFR-01 |
| TS-51 | P | Decision latency under load | 200 concurrent submissions | 95% decided within 60 s | NFR-01, NFR-08 |
| TS-52 | P | Encryption at rest | Inspect stored PAN and documents | Encrypted; masked Aadhaar only | NFR-03 |
| TS-53 | P | Role enforcement | Log in as Admin, attempt to approve | Denied | §3 Roles |
| TS-54 | P | Accessibility | Keyboard-only walkthrough; contrast check | All steps completable; contrast meets WCAG 2.1 AA | NFR-07 |

---

## Coverage summary

| Area | Scenarios | Requirements covered |
|---|---|---|
| Capture | 14 | FR-APP-01 to 10 |
| KYC & documents | 8 | FR-KYC-01 to 06, FR-DEC-08 |
| Decisioning | 10 | FR-DEC-01 to 07, FR-ADM-02, BR-H03/04/07 |
| Officer console | 11 | FR-OFF-01 to 08 |
| Notifications & audit | 6 | FR-NOT-01 to 03, FR-ADM-04, 05 |
| Non-functional | 5 | NFR-01, 03, 06, 07, 08 |
| **Total** | **54** | |
