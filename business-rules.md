# Business Rules & Decision Tables

Credit decisions are driven by a versioned rule set owned by the Credit Risk Manager. Each rule is either a **hard rule** (fails → automatic rejection) or a **scoring rule** (contributes to the risk grade). All thresholds below are illustrative starting values (rule set `v1.0`) and are editable by an Admin under FR-ADM-01.

## 1. Derived values

| Value | Formula |
|---|---|
| Age | Completed years between date of birth and submission date |
| Proposed EMI | Standard reducing-balance EMI: `P × r × (1+r)^n ÷ ((1+r)^n − 1)` where `r` = monthly rate, `n` = tenure in months |
| FOIR | `(existing monthly EMIs + proposed EMI) ÷ net monthly income` |
| Loan-to-income (LTI) | `loan amount ÷ (net monthly income × 12)` |

## 2. Hard rules (any failure → automatic reject)

| Rule ID | Check | Threshold | Rejection reason code |
|---|---|---|---|
| BR-H01 | Age at submission | 21 ≤ age ≤ 60 | `AGE_OUT_OF_RANGE` |
| BR-H02 | Net monthly income | ≥ ₹20,000 (salaried) / ≥ ₹30,000 (self-employed) | `INCOME_BELOW_MIN` |
| BR-H03 | Bureau score | ≥ 650 | `SCORE_BELOW_MIN` |
| BR-H04 | Active default or write-off in last 24 months | None | `RECENT_DEFAULT` |
| BR-H05 | PAN verification | Verified and name matches | `KYC_FAILED` |
| BR-H06 | Identity verification | Verified | `KYC_FAILED` |
| BR-H07 | FOIR (post-loan) | ≤ 60% | `FOIR_EXCEEDED` |
| BR-H08 | Applicant on internal negative list | Not present | `NEGATIVE_LIST` |

## 3. Scoring rules → risk grade

Points are summed; the total maps to a grade.

| Rule ID | Factor | Condition | Points |
|---|---|---|---|
| BR-S01 | Bureau score | ≥ 800 | 40 |
| | | 750–799 | 30 |
| | | 700–749 | 20 |
| | | 650–699 | 10 |
| BR-S02 | FOIR (post-loan) | ≤ 30% | 25 |
| | | 31–40% | 18 |
| | | 41–50% | 10 |
| | | 51–60% | 3 |
| BR-S03 | Employment | Salaried with a listed employer, > 2 yrs tenure | 20 |
| | | Salaried, other | 14 |
| | | Self-employed, > 3 yrs in business | 12 |
| | | Self-employed, other | 6 |
| BR-S04 | Loan-to-income | ≤ 1.0 | 15 |
| | | 1.01–2.0 | 10 |
| | | > 2.0 | 4 |

| Total points | Risk grade |
|---|---|
| 85–100 | A |
| 70–84 | B |
| 55–69 | C |
| < 55 | D |

## 4. Decision routing (decision table)

| Condition | Rule | Outcome |
|---|---|---|
| Any hard rule fails | — | **Auto-reject** with reason code |
| All hard rules pass AND score ≥ 750 AND FOIR ≤ 40% AND amount ≤ ₹5,00,000 | STP | **Auto-approve** at grid rate |
| All hard rules pass AND grade A or B AND amount ≤ ₹5,00,000 (STP not met) | — | **Manual review** — Credit Officer queue |
| All hard rules pass AND amount > ₹5,00,000 | — | **Manual review** — Senior Credit Officer queue |
| All hard rules pass AND grade C or D | — | **Manual review** — Credit Officer queue, flagged "high risk" |

## 5. Interest-rate grid (`v1.0`, % per annum, reducing balance)

| Risk grade | 12–24 months | 25–48 months | 49–60 months |
|---|---|---|---|
| A | 11.5 | 12.0 | 12.5 |
| B | 13.0 | 13.5 | 14.0 |
| C | 15.5 | 16.0 | 16.5 |
| D | 18.0 | 18.5 | 19.0 |

Indicative EMI shown to the applicant before decisioning (FR-APP-07) uses the grade **B** rate as a conservative estimate.

## 6. Approval limits

| Role | Maximum approvable amount |
|---|---|
| Credit Officer | ₹5,00,000 |
| Senior Credit Officer | ₹15,00,000 |

Counter-offers must stay within the officer's limit.

## 7. Worked examples

**Example 1 — STP approval**
Salaried 4 yrs with a listed employer, age 32, income ₹80,000, existing EMI ₹5,000, requests ₹3,00,000 over 36 months, bureau 780.
Indicative EMI at 13.5% ≈ ₹10,180 → FOIR = (5,000 + 10,180) ÷ 80,000 = 19%; LTI = 3,00,000 ÷ 9,60,000 = 0.31. All hard rules pass; score ≥ 750, FOIR ≤ 40%, amount ≤ ₹5L → **Auto-approve**. Points: 30 + 25 + 20 + 15 = 90 → Grade A → 12.0% p.a.

**Example 2 — Manual review**
Self-employed 4 yrs, age 45, income ₹1,20,000, existing EMI ₹30,000, requests ₹8,00,000 over 48 months, bureau 720.
Indicative EMI at 13.5% ≈ ₹21,660 → FOIR = 43%; LTI = 8,00,000 ÷ 14,40,000 = 0.56. Hard rules pass; amount > ₹5L → **Senior Credit Officer queue**, flagged high risk. Points: 20 + 10 + 12 + 15 = 57 → Grade C → 16.0% p.a. (officer may counter-offer a lower amount).

**Example 3 — Auto-reject**
Salaried, age 26, income ₹25,000, requests ₹4,00,000 over 60 months, bureau 640.
BR-H03 fails (score < 650) → **Auto-reject**, reason `SCORE_BELOW_MIN`.
