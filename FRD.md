# Functional Requirements Document (FRD)
## Loan Application & Approval System (LAAS)

| Field | Value |
|---|---|
| Version | 1.0 |
| Status | Baselined for stakeholder review |
| Product | Unsecured personal loan origination (digital-first) |
| Prepared by | Business Analyst |
| Related documents | [user-stories.md](user-stories.md) · [process-flows.md](process-flows.md) · [business-rules.md](business-rules.md) · [api-contract.yaml](api-contract.yaml) · [test-scenarios.md](test-scenarios.md) |

---

## 1. Introduction

### 1.1 Purpose
This document describes the functional and non-functional requirements for a Loan Application & Approval System used by a mid-sized non-banking financial company (NBFC) to originate unsecured personal loans. It is the single reference for what the system must do, agreed between business stakeholders, the technology team and the compliance function.

### 1.2 Background
Today, personal loan applications are received through branch walk-ins and a basic web form, then processed manually in spreadsheets and email. This causes:

- Average turnaround of 5–7 working days from application to decision
- Inconsistent decisions, because eligibility rules live in officers' heads rather than in a system
- Poor audit trail, which creates regulatory risk during inspections
- High drop-off (roughly 40%) from applicants who never complete the paper-based document step

### 1.3 Business objectives

| # | Objective | Success measure |
|---|---|---|
| BO-1 | Reduce application-to-decision turnaround | ≤ 24 hours for auto-decisioned applications, ≤ 3 working days for manual review |
| BO-2 | Standardise credit decisions | 100% of applications evaluated against a configurable rule set |
| BO-3 | Improve applicant completion rate | ≥ 70% of started applications submitted |
| BO-4 | Provide a complete audit trail | Every decision traceable to rule outcomes and officer actions |

### 1.4 Scope

**In scope**
- Applicant self-service portal (web, mobile-responsive)
- KYC capture and verification (PAN, Aadhaar-based identity, address)
- Loan details, EMI calculation and eligibility pre-check
- Document upload and verification
- Automated rule-based decisioning with manual review fallback
- Credit officer console (queue, review, decision, request more information)
- Application status tracking and notifications
- Admin configuration of eligibility rules and interest-rate grid
- Audit logging and reporting

**Out of scope (this release)**
- Loan disbursement and repayment collection (handled by the existing Loan Management System)
- Secured loan products (home, vehicle, gold)
- Co-applicant / guarantor flows
- Direct integration with a specific credit bureau beyond a defined interface

### 1.5 Definitions

| Term | Meaning |
|---|---|
| Applicant | Individual applying for a personal loan |
| KYC | Know Your Customer — regulatory identity and address verification |
| Bureau score | Credit score returned by a credit bureau (300–900 scale) |
| FOIR | Fixed Obligation to Income Ratio — total monthly EMIs ÷ net monthly income |
| EMI | Equated Monthly Instalment |
| STP | Straight-Through Processing — application decided without human intervention |
| Credit Officer | Staff member authorised to review and decide applications |
| LMS | Loan Management System (existing downstream system) |

---

## 2. Stakeholders

| Stakeholder | Role in project | Interest | Influence |
|---|---|---|---|
| Head of Retail Lending | Sponsor, owns business objectives | High | High |
| Credit Risk Manager | Owns eligibility rules and risk appetite | High | High |
| Compliance Officer | Ensures KYC, data-privacy and regulatory adherence | High | High |
| Credit Officers (6) | Day-to-day users of the officer console | High | Medium |
| Applicants (customers) | End users of the self-service portal | High | Low |
| IT / Engineering Lead | Builds and integrates the solution | Medium | High |
| Customer Support Lead | Handles applicant queries about status | Medium | Low |
| Operations (LMS team) | Receives approved loans for disbursement | Medium | Medium |

A RACI matrix for key deliverables is in [raci.md](raci.md).

---

## 3. User roles and permissions

| Role | Can do | Cannot do |
|---|---|---|
| Applicant | Create/edit own application, upload documents, view own status | View other applications, change decision |
| Credit Officer | View assigned queue, review any application, record decision within their approval limit, request documents | Change rules, approve above their limit |
| Senior Credit Officer | Everything an officer can, plus approve up to the senior limit and reassign queue items | Change rules |
| Admin | Configure rules, rate grid, user roles; view audit logs and reports | Record credit decisions |

---

## 4. Functional requirements

Requirements use the ID format `FR-<module>-<number>`. Priority follows MoSCoW; see [prioritization-moscow.md](prioritization-moscow.md) for rationale.

### 4.1 Application capture (APP)

| ID | Requirement | Priority |
|---|---|---|
| FR-APP-01 | The system shall allow an applicant to register using a mobile number verified by OTP. | Must |
| FR-APP-02 | The system shall present the application as a four-step guided form: Personal & KYC → Loan details → Documents → Review & submit. | Must |
| FR-APP-03 | The system shall save the application as a draft automatically on each step change, so an applicant can resume within 30 days. | Must |
| FR-APP-04 | The system shall capture: full name (as per PAN), date of birth, PAN, Aadhaar-linked identity confirmation, current address, employment type, employer name, net monthly income and existing monthly EMIs. | Must |
| FR-APP-05 | The system shall validate PAN format (`AAAAA9999A`) and date of birth (applicant must be 21–60 years on submission). | Must |
| FR-APP-06 | The system shall allow the applicant to specify loan amount (₹50,000 – ₹15,00,000 in ₹5,000 steps) and tenure (12–60 months). | Must |
| FR-APP-07 | The system shall display an indicative EMI in real time as amount or tenure changes, using the indicative rate for the applicant's segment. | Should |
| FR-APP-08 | The system shall show a soft eligibility indicator (Likely eligible / Borderline / Unlikely) before submission, based on declared income and FOIR only. | Should |
| FR-APP-09 | The system shall require explicit consent to fetch the applicant's credit bureau report before submission. | Must |
| FR-APP-10 | The system shall generate a unique application reference (format `LN-YYYY-NNNNNN`) on submission and display it to the applicant. | Must |

### 4.2 KYC and document verification (KYC)

| ID | Requirement | Priority |
|---|---|---|
| FR-KYC-01 | The system shall verify PAN against the PAN verification service and store the verification result and timestamp. | Must |
| FR-KYC-02 | The system shall support Aadhaar-based identity verification through the approved provider interface, storing only the masked Aadhaar (last four digits) and verification status. | Must |
| FR-KYC-03 | The system shall require upload of: identity proof, address proof, last three months' bank statements, and latest salary slip (salaried) or last two years' ITR (self-employed). | Must |
| FR-KYC-04 | The system shall accept PDF, JPG and PNG files up to 5 MB each and reject other formats with a clear message. | Must |
| FR-KYC-05 | The system shall allow a credit officer to mark each document as Verified, Rejected (with reason) or Re-upload requested. | Must |
| FR-KYC-06 | The system shall notify the applicant when a re-upload is requested and reopen only the Documents step. | Must |
| FR-KYC-07 | The system should extract salary and employer name from salary slips using OCR to pre-fill verification fields. | Could |

### 4.3 Automated decisioning (DEC)

| ID | Requirement | Priority |
|---|---|---|
| FR-DEC-01 | On submission, the system shall request the applicant's bureau score and report through the bureau interface. | Must |
| FR-DEC-02 | The system shall evaluate the application against the active rule set defined in [business-rules.md](business-rules.md) and record the outcome of every rule. | Must |
| FR-DEC-03 | The system shall automatically approve applications that pass all hard rules and meet the STP criteria (bureau score ≥ 750, FOIR ≤ 40%, amount ≤ ₹5,00,000). | Must |
| FR-DEC-04 | The system shall automatically reject applications that fail any hard rule (age, minimum income, bureau score < 650, active default in last 24 months). | Must |
| FR-DEC-05 | The system shall route all other applications to the manual review queue with a system-generated risk grade (A–D). | Must |
| FR-DEC-06 | The system shall determine the applicable interest rate from the rate grid based on risk grade and tenure. | Must |
| FR-DEC-07 | The system shall record a human-readable reason for every automated rejection, drawn from an approved reason list. | Must |
| FR-DEC-08 | The system should re-run decisioning automatically when a requested document is re-uploaded and verified. | Should |

### 4.4 Credit officer console (OFF)

| ID | Requirement | Priority |
|---|---|---|
| FR-OFF-01 | The system shall display a work queue of applications awaiting review, sortable by submission date, amount and risk grade, and filterable by status. | Must |
| FR-OFF-02 | The system shall show, for each application, a review screen with: applicant summary, loan request, rule evaluation results, bureau summary, uploaded documents and activity history. | Must |
| FR-OFF-03 | The system shall allow an officer to Approve, Reject, Request documents, or Counter-offer (different amount or tenure). | Must |
| FR-OFF-04 | The system shall require a reason from the approved list, plus optional free-text notes, for every Reject and Counter-offer. | Must |
| FR-OFF-05 | The system shall enforce approval limits: Credit Officer up to ₹5,00,000; Senior Credit Officer up to ₹15,00,000. Applications above an officer's limit shall be escalated automatically. | Must |
| FR-OFF-06 | The system shall lock an application to the officer who opens it for 30 minutes to prevent duplicate work. | Should |
| FR-OFF-07 | The system shall allow a Senior Credit Officer to reassign queue items between officers. | Should |
| FR-OFF-08 | The system shall present a counter-offer to the applicant for acceptance or decline within 7 days, after which it expires. | Should |

### 4.5 Status tracking and notifications (NOT)

| ID | Requirement | Priority |
|---|---|---|
| FR-NOT-01 | The system shall show the applicant a status tracker with the stages: Submitted → Verification → Under review → Decision → Sent for disbursement. | Must |
| FR-NOT-02 | The system shall send SMS and email notifications on: submission, document request, decision, counter-offer and expiry. | Must |
| FR-NOT-03 | The system shall send an approved-application payload to the LMS through the defined interface and record the LMS acknowledgement. | Must |
| FR-NOT-04 | The system should send a reminder if a draft application has been inactive for 3 days. | Could |

### 4.6 Administration and audit (ADM)

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | The system shall allow an Admin to edit rule thresholds (score cut-offs, FOIR limit, age band, minimum income) with an effective date, without a code deployment. | Must |
| FR-ADM-02 | The system shall version every rule change and apply the rule set that was active at the time of submission. | Must |
| FR-ADM-03 | The system shall allow an Admin to maintain the interest-rate grid by risk grade and tenure band. | Must |
| FR-ADM-04 | The system shall log every state change, decision and data edit with user, timestamp and before/after values, retained for 8 years. | Must |
| FR-ADM-05 | The system shall provide reports: applications by status, approval rate by risk grade, average turnaround time, and officer productivity. | Should |
| FR-ADM-06 | The system could support A/B testing of rule sets on a percentage of traffic. | Won't (this release) |

---

## 5. Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | Applicant pages shall load within 2 seconds on a 4G connection; automated decision shall complete within 60 seconds of submission. |
| NFR-02 | Availability | 99.5% availability during 06:00–23:00 IST; planned maintenance outside this window. |
| NFR-03 | Security | All data in transit over TLS 1.2+; PAN, Aadhaar reference and bank statements encrypted at rest; role-based access control. |
| NFR-04 | Data privacy | Comply with the Digital Personal Data Protection Act: explicit consent capture, purpose limitation, and data deletion for withdrawn applications after the retention period. |
| NFR-05 | Regulatory | KYC process shall follow the applicable RBI KYC Master Direction; decision reasons must be disclosable to the applicant on request. |
| NFR-06 | Auditability | Audit log shall be immutable (append-only) and exportable for inspection. |
| NFR-07 | Usability | Applicant journey shall be completable on a mobile browser in under 12 minutes with documents at hand; WCAG 2.1 AA for colour contrast and keyboard access. |
| NFR-08 | Scalability | Support 2,000 submissions per day at launch, scaling to 10,000 without architectural change. |
| NFR-09 | Localisation | English at launch; UI text externalised for Hindi and Marathi in a later release. |

---

## 6. Interfaces

| Interface | Direction | Purpose | Notes |
|---|---|---|---|
| PAN verification service | Outbound | Validate PAN and name match | Synchronous |
| Aadhaar-based identity verification | Outbound | Identity confirmation | Through approved provider; masked storage only |
| Credit bureau | Outbound | Score and report | Consent required; cached for 30 days |
| SMS / email gateway | Outbound | Notifications | Templated messages |
| Loan Management System (LMS) | Outbound | Hand-off of approved loans | Asynchronous, with acknowledgement |
| Document storage | Internal | Encrypted object store | Virus scan on upload |

The REST API exposed to the front end is specified in [api-contract.yaml](api-contract.yaml).

---

## 7. Data requirements (key entities)

| Entity | Key attributes |
|---|---|
| Applicant | applicant_id, mobile (verified), email, name, dob, pan (encrypted), aadhaar_last4, address, employment_type, employer, net_monthly_income, existing_emi |
| Application | application_ref, applicant_id, amount, tenure_months, purpose, status, risk_grade, interest_rate, submitted_at, decided_at, rule_set_version |
| Document | document_id, application_ref, type, file_ref, uploaded_at, verification_status, reviewer_id, rejection_reason |
| Decision | decision_id, application_ref, type (auto/manual), outcome, reason_code, notes, decided_by, decided_at, counter_amount, counter_tenure |
| RuleEvaluation | application_ref, rule_id, input_value, threshold, result |
| AuditEvent | event_id, entity, entity_id, action, actor, timestamp, before, after |

Application status values: `Draft`, `Submitted`, `Verification`, `Under review`, `Docs requested`, `Approved`, `Counter-offered`, `Rejected`, `Withdrawn`, `Expired`, `Sent to LMS`.

---

## 8. Assumptions and constraints

- Applicants are Indian residents with a valid PAN and Aadhaar.
- Bureau, PAN and identity-verification providers are already contracted; only integration is in scope.
- Disbursement remains in the LMS; this system hands off approved loans and does not move money.
- Eligibility thresholds in this document are illustrative starting values owned by Credit Risk and will be tuned in production.

## 9. Open questions

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-1 | Should a rejected applicant be allowed to reapply within 90 days? | Credit Risk Manager | Open |
| OQ-2 | Is video KYC required for amounts above ₹10,00,000? | Compliance Officer | Open |
| OQ-3 | Will counter-offers require a fresh consent for the changed terms? | Compliance Officer | Open |

## 10. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Sponsor — Head of Retail Lending | | | |
| Credit Risk Manager | | | |
| Compliance Officer | | | |
| IT / Engineering Lead | | | |
