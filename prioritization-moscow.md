# MoSCoW Prioritisation

Prioritisation was agreed in a workshop with the Head of Retail Lending (sponsor), Credit Risk Manager, Compliance Officer and Engineering Lead. The guiding question for each item was: *"If this is missing at launch, can we still take an application to a compliant, auditable decision?"*

Release 1 (MVP) contains all Must-haves and as many Should-haves as the 12-week window allows.

---

## Must have — Release 1 cannot launch without these

| Requirement | Why it is a Must |
|---|---|
| FR-APP-01 to FR-APP-06, FR-APP-09, FR-APP-10 | Without capture, validation, consent and a reference number there is no application. Bureau consent is a regulatory obligation, not a feature. |
| FR-KYC-01 to FR-KYC-06 | KYC is mandated by the RBI KYC Master Direction; no lending can occur without it. Document rejection/re-upload is needed to avoid the current 40% drop-off. |
| FR-DEC-01 to FR-DEC-07 | Automated, recorded rule evaluation is the core of BO-2 (standardised decisions) and BO-4 (audit trail). |
| FR-OFF-01 to FR-OFF-05 | Officers must be able to review and decide non-STP cases with reasons and within their limits — this is the manual fallback that makes STP safe. |
| FR-NOT-01 to FR-NOT-03 | Applicants must know their status (reduces support load) and approved loans must reach the LMS or the process ends in a dead end. |
| FR-ADM-01 to FR-ADM-04 | Rule configuration without deployment was the Credit Risk Manager's top ask; immutable audit was the Compliance Officer's condition for sign-off. |
| NFR-01, 03, 04, 05, 06 | Security, privacy and regulatory NFRs are non-negotiable for a lending product. |

## Should have — important, but a workaround exists for a short time

| Requirement | Why it is a Should | Workaround if deferred |
|---|---|---|
| FR-APP-07 Live EMI | Strong driver of completion rate (BO-3), but the application can be completed without it. | Show a static EMI table per amount band. |
| FR-APP-08 Soft eligibility indicator | Reduces wasted effort by applicants and officers; not required for a decision. | Publish eligibility criteria on the landing page. |
| FR-DEC-08 Auto re-run after re-upload | Saves officer time; officers can trigger re-evaluation manually. | Manual "Re-evaluate" button. |
| FR-OFF-06 Application locking | Prevents duplicate work; low risk with six officers at launch. | Officers coordinate through queue assignment. |
| FR-OFF-07 Queue reassignment | Useful for leave cover; volume is manageable manually at launch. | Senior officer works the item directly. |
| FR-OFF-08 Counter-offer to applicant | Increases approval rate, but officers can reject and invite reapplication initially. | Officer notes revised terms in rejection reason; applicant reapplies. |
| FR-ADM-05 Operational reports | Needed to measure the business objectives, but data can be extracted from the database for the first month. | Weekly SQL extract by engineering. |
| NFR-02, 07, 08 | Availability, usability and scalability targets shape design choices but can be measured and tuned after launch. | Monitor and iterate. |

## Could have — nice to have if time allows

| Requirement | Why it is a Could |
|---|---|
| FR-KYC-07 OCR of salary slips | Speeds verification but introduces a new vendor and accuracy risk; officers can read slips manually. |
| FR-NOT-04 Draft reminder | Small completion-rate uplift; cheap to add later once notification templates exist. |
| NFR-09 Localisation groundwork | Externalising strings is inexpensive if done from the start; translation itself is a later release. |

## Won't have (this release) — explicitly agreed as out of scope

| Item | Why it is a Won't |
|---|---|
| FR-ADM-06 A/B testing of rule sets | Compliance concern about treating applicants inconsistently; requires a policy decision first. |
| Co-applicant / guarantor flows | Doubles data-model complexity; personal loans at launch are single-applicant only. |
| Secured loan products | Different valuation and collateral processes; separate project. |
| Disbursement and collections | Remain in the existing LMS. |
| Video KYC | Pending OQ-2; provider selection not started. |

---

## Summary

| Category | Functional requirements | Share |
|---|---|---|
| Must | 34 | 77% |
| Should | 7 | 16% |
| Could | 2 | 5% |
| Won't | 1 | 2% |

A Must share above ~60% is a sign of scope pressure. The workshop accepted this because most Musts are regulatory rather than discretionary, but the Engineering Lead flagged that the Should items are the first candidates to slip if the 12-week window is at risk.
