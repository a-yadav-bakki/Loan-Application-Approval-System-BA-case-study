# RACI Matrix

**R** = Responsible (does the work) · **A** = Accountable (owns the outcome, one per row) · **C** = Consulted · **I** = Informed

| Deliverable / decision | Head of Retail Lending | Credit Risk Manager | Compliance Officer | Business Analyst | Engineering Lead | Credit Officers | Operations (LMS) | Customer Support |
|---|---|---|---|---|---|---|---|---|
| Business objectives & scope | A | C | C | R | C | I | I | I |
| Stakeholder register | I | I | I | A/R | I | I | I | I |
| FRD | A | C | C | R | C | C | C | I |
| Business rules & thresholds | I | A | C | R | I | C | I | I |
| Interest-rate grid | A | R | C | C | I | I | I | I |
| User stories & acceptance criteria | I | C | C | A/R | C | C | I | I |
| Process flows (as-is / to-be) | I | C | C | A/R | C | R | C | C |
| MoSCoW prioritisation | A | C | C | R | C | I | I | I |
| KYC & data-privacy requirements | I | C | A | R | C | I | I | I |
| API contract | I | I | I | C | A/R | I | C | I |
| Clickable prototype | I | C | I | A/R | C | C | I | C |
| Test scenarios | I | C | C | A/R | C | C | C | I |
| LMS integration design | I | I | I | C | A/R | I | C | I |
| Notification templates | I | I | C | R | I | I | I | A |
| Requirements sign-off | A | R | R | R | R | I | I | I |
| Go-live decision | A | C | C | I | R | I | C | I |

## Notes
- The Compliance Officer is Accountable for KYC and privacy requirements because sign-off on regulatory adherence cannot be delegated.
- Customer Support is Accountable for notification wording because they own the applicant-facing tone and handle the resulting queries.
- Only one A per row, per RACI convention; where the BA both owns and produces an artifact, it is shown as A/R.
