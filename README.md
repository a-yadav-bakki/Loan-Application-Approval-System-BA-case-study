# Loan Application & Approval System — Business Analysis Case Study

A complete business-analysis package for a digital personal-loan origination system at a mid-sized Indian NBFC: from problem statement and stakeholder analysis through functional requirements, business rules, user stories, process flows, prioritisation, API contract and test scenarios — plus a clickable prototype that runs the actual credit rules in the browser.

**Live prototype:** open (https://a-yadav-bakki.github.io/Loan-Application-Approval-System-BA-case-study/)in a browser, or enable GitHub Pages on this repo and use the published link. Two separate apps — a customer portal and an officer console — share one rule engine and one set of demo data.

---

## The problem

Personal loan applications arrive through branch walk-ins and a basic web form, then move through spreadsheets and email. Turnaround is 5–7 working days, decisions vary by officer, roughly 40% of applicants drop off at the paper-based document step, and the audit trail is weak enough to be a regulatory risk.

## The solution, in one paragraph

A self-service applicant portal captures the application in four guided steps with live EMI and a soft eligibility check. On submission the system verifies KYC, fetches a bureau score and evaluates a **versioned, configurable rule set**: clean cases are approved straight through, hard-rule failures are rejected with a disclosable reason, and everything else lands in a **credit officer console** with a risk grade, full rule results and one-screen decisioning within approval limits. Approved loans hand off to the existing Loan Management System, and every action is written to an immutable audit log.

---

## What's in this repository

| File | What it is | BA technique demonstrated |
|---|---|---|
| [FRD.md](FRD.md) | Functional Requirements Document — objectives, scope, stakeholders, roles, 43 functional and 9 non-functional requirements, interfaces, data, open questions | Requirements specification, stakeholder register |
| [business-rules.md](business-rules.md) | Hard rules, scoring rules, decision-routing table, rate grid, approval limits, worked examples | Decision tables, business rules analysis |
| [user-stories.md](user-stories.md) | 21 user stories across 6 epics with Gherkin acceptance criteria and story points | Agile requirements, INVEST, story mapping |
| [process-flows.md](process-flows.md) | As-is vs to-be flows, swimlane, state machine, sequence diagram, context diagram (Mermaid) | Process modelling, gap analysis |
| [prioritization-moscow.md](prioritization-moscow.md) | MoSCoW classification with rationale and workarounds for deferred items | MoSCoW prioritisation, scope negotiation |
| [raci.md](raci.md) | Responsibility matrix across 8 stakeholder groups and 16 deliverables | RACI |
| [traceability-matrix.md](traceability-matrix.md) | Requirement → objective → story → API → screen → test, with gaps called out | Requirements traceability |
| [api-contract.yaml](api-contract.yaml) | OpenAPI 3.0 contract for 18 endpoints with schemas and error codes | Interface specification |
| [test-scenarios.md](test-scenarios.md) | 54 scenarios (positive, negative, edge) linked to requirements | Test design from requirements |
| [index.html](index.html) | Prototype landing page — links to the two apps below | Prototyping / validation |
| [applicant.html](applicant.html) | Customer portal: OTP sign-in, four-step application, status tracker, counter-offer and re-upload | Prototyping / validation |
| [officer.html](officer.html) | Credit officer console: role-based sign-in, queue, review screen, decisioning within limits | Prototyping / validation |
| [shared.js](shared.js) · [shared.css](shared.css) | The rule engine from business-rules.md, executable; shared demo data store and styles | Rules validation |
| [screenshots/](screenshots) | Captures of each prototype screen | — |

---

## Using the prototype

The prototype is plain HTML and JavaScript with no back end. Demo data lives in your browser's local storage only; nothing is sent anywhere. Use **Reset demo data** on the landing page to start over.

### Sign-in details

| App | Credentials | Notes |
|---|---|---|
| Customer portal (`applicant.html`) | Any 10-digit mobile starting 6–9; OTP is shown on screen (`482913`) | A number with an existing application opens its tracker; a new number starts a fresh application. Three wrong OTPs lock the number. |
| Officer console (`officer.html`) | `m.iyer` / `demo` — Credit Officer, limit ₹5,00,000<br>`r.kulkarni` / `demo` — Senior Credit Officer, limit ₹15,00,000 | Role drives which decision actions are available. |

Seeded applicants you can sign in as: `9820011111` (Rohan, under review — senior queue), `9820044444` (Sunita, document requested).

### Steering the outcome

The default profile (Priya, ₹80,000 income, ₹3,00,000 over 36 months) is approved automatically. To see other paths:

| To trigger | Do this |
|---|---|
| Auto-reject (low bureau score) | Change the PAN so it ends in **Z**, e.g. `ABCDE1234Z` |
| Auto-reject (recent default) | Change the PAN so it ends in **X** |
| Auto-reject (FOIR) | Set income to ₹25,000 and amount to ₹6,00,000 |
| Manual review, officer queue | Set income to ₹45,000 (score drops below 750) |
| Manual review, senior queue | Request more than ₹5,00,000 |
| Validation errors | Enter a PAN like `ABC123` or a date of birth under 21 |

### A full walkthrough

1. In the customer portal, sign in with a new mobile number and submit an application that lands in manual review (income ₹45,000).
2. Sign out, sign in again with the same number — the tracker opens instead of the form (US-03, US-17).
3. In the officer console, sign in as `m.iyer`, open the application, verify documents, and counter-offer a lower amount with a reason.
4. Back in the customer portal, the tracker now shows the original and revised terms side by side; accept it.
5. Open Rohan Mehta (₹8,00,000) as `m.iyer` — Approve is disabled above the limit; escalate, then sign in as `r.kulkarni` to decide.

The demo bureau score is derived from income so reviewers can steer outcomes without a real bureau; this is the only place the prototype deviates from the FRD.

### Prototype screens and what they validate

| Screen | Validates |
|---|---|
| Applicant sign-in (OTP) | US-01 · FR-APP-01 |
| Step 1 Personal & KYC | US-02, US-04 · FR-APP-02, 04, 05 |
| Step 2 Loan details with live EMI and eligibility | US-05, US-06 · FR-APP-06, 07, 08 |
| Step 3 Documents | US-08 · FR-KYC-03, 04 |
| Step 4 Review & consent | US-07 · FR-APP-09, 10 |
| Status tracker (incl. counter-offer, re-upload) | US-16, US-17 · FR-NOT-01, FR-OFF-08, FR-KYC-06 |
| Officer sign-in | §3 Roles · FR-OFF-05 |
| Review queue | US-13 · FR-OFF-01 |
| Review screen and decision | US-09, US-14, US-15 · FR-OFF-02, 03, 04, 05, FR-KYC-05 |

## How this was produced

1. **Problem framing** — business objectives with measurable success criteria (FRD §1.3).
2. **Stakeholder analysis** — register with interest/influence, then RACI.
3. **As-is process mapping** — to locate the pain points the solution must remove.
4. **Elicitation** — requirements written as if gathered from workshops with Credit Risk, Compliance, Officers and Engineering; open questions recorded rather than assumed away.
5. **Rules before screens** — the decision logic was written as decision tables first, then the prototype implements them so stakeholders can validate rules by clicking, not by reading.
6. **Prioritisation and traceability** — MoSCoW agreed against a 12-week window; traceability matrix used to expose gaps (two Could items unscheduled, admin screens not yet prototyped).

## Assumptions

- Unsecured personal loans only; single applicant; Indian residents with PAN and Aadhaar.
- Thresholds in the rule set are illustrative starting values owned by Credit Risk.
- Disbursement and collections stay in the existing LMS.

## Related project

This is the second case study in a series. The first, an **Order Management System**(https://github.com/a-yadav-bakki/Order-Management-System), follows the same structure and can be found in my other repositories. 

## Licence

MIT — see [LICENSE](LICENSE).
