# Process Flows

Diagrams use Mermaid and render directly on GitHub. Each flow is annotated with the FRD requirements it realises.

---

## 1. Current state (as-is)

The manual process the system replaces. Pain points are marked ⚠.

```mermaid
flowchart LR
    A[Applicant fills paper / basic web form] --> B[Branch staff email form to credit team]
    B --> C["Officer keys details into spreadsheet ⚠ re-keying errors"]
    C --> D[Officer emails applicant for documents]
    D --> E{"Documents received? ⚠ 40% drop-off"}
    E -- No --> D
    E -- Yes --> F[Officer requests bureau report manually]
    F --> G["Officer applies rules from memory ⚠ inconsistent"]
    G --> H{Decision}
    H -- Approve --> I[Email to LMS team for disbursement]
    H -- Reject --> J["Email rejection ⚠ no reason recorded"]
    I --> K["Update spreadsheet ⚠ weak audit trail"]
```

---

## 2. Future state (to-be) — end-to-end application lifecycle

```mermaid
flowchart TD
    S([Applicant registers with OTP<br/>FR-APP-01]) --> F1[Step 1 · Personal & KYC<br/>FR-APP-04, 05]
    F1 --> F2[Step 2 · Loan details + live EMI<br/>FR-APP-06, 07, 08]
    F2 --> F3[Step 3 · Documents<br/>FR-KYC-03, 04]
    F3 --> F4[Step 4 · Review, consent, submit<br/>FR-APP-09, 10]
    F4 --> V[Automated KYC checks<br/>FR-KYC-01, 02]
    V --> B[Fetch bureau score<br/>FR-DEC-01]
    B --> R[Evaluate rule set<br/>FR-DEC-02]
    R --> D{Decision routing<br/>business-rules.md §4}
    D -- Hard rule failed --> RJ[Auto-reject with reason<br/>FR-DEC-04, 07]
    D -- STP criteria met --> AP[Auto-approve at grid rate<br/>FR-DEC-03, 06]
    D -- Otherwise --> Q[Manual review queue<br/>FR-DEC-05]
    Q --> O[Officer reviews<br/>FR-OFF-01, 02]
    O --> OD{Officer decision<br/>FR-OFF-03}
    OD -- Approve --> AP
    OD -- Reject --> RJ
    OD -- Request documents --> DR[Docs requested<br/>FR-KYC-06]
    DR --> F3
    OD -- Counter-offer --> CO[Counter-offer to applicant<br/>FR-OFF-08]
    CO --> CA{Applicant response<br/>within 7 days}
    CA -- Accept --> AP
    CA -- Decline --> RJ
    CA -- No response --> EX([Expired])
    AP --> L[Send to LMS<br/>FR-NOT-03]
    L --> END([Sent for disbursement])
    RJ --> N([Applicant notified<br/>FR-NOT-02])
```

---

## 3. Swimlane — manual review

```mermaid
flowchart LR
    subgraph System
        S1[Route to queue with risk grade] --> S2[Lock application on open · 30 min]
        S4[Validate reason and approval limit] --> S5[Write audit event]
        S5 --> S6[Notify applicant]
    end
    subgraph Credit Officer
        C1[Pick from queue] --> C2[Review summary, rules, bureau, documents]
        C2 --> C3{Within my limit?}
        C3 -- No --> C4[Escalate to senior officer]
        C3 -- Yes --> C5[Approve / Reject / Counter-offer / Request docs]
    end
    subgraph Senior Credit Officer
        E1[Review escalated item] --> E2[Decide up to ₹15L]
    end
    subgraph Applicant
        A1[Receive notification] --> A2[Accept / decline offer or re-upload]
    end
    S1 --> C1
    C1 --> S2
    C4 --> E1
    C5 --> S4
    E2 --> S4
    S6 --> A1
```

---

## 4. Application state machine

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted : submit with consent
    Draft --> Expired : 30 days inactive
    Submitted --> Verification : KYC checks start
    Verification --> Rejected : KYC failed (hard rule)
    Verification --> UnderReview : rules passed, not STP
    Verification --> Approved : STP criteria met
    Verification --> Rejected : hard rule failed
    UnderReview --> DocsRequested : officer requests re-upload
    DocsRequested --> Verification : applicant re-uploads
    UnderReview --> Approved : officer approves
    UnderReview --> Rejected : officer rejects
    UnderReview --> CounterOffered : officer counter-offers
    CounterOffered --> Approved : applicant accepts
    CounterOffered --> Rejected : applicant declines
    CounterOffered --> Expired : 7 days, no response
    Approved --> SentToLMS : LMS acknowledges
    Draft --> Withdrawn : applicant withdraws
    Submitted --> Withdrawn : applicant withdraws
    UnderReview --> Withdrawn : applicant withdraws
    SentToLMS --> [*]
    Rejected --> [*]
    Expired --> [*]
    Withdrawn --> [*]
```

---

## 5. Sequence — submission to automated decision

```mermaid
sequenceDiagram
    actor Applicant
    participant Portal
    participant API
    participant KYC as PAN / Identity services
    participant Bureau
    participant Rules as Rule engine
    participant Notify as SMS / Email

    Applicant->>Portal: Submit application (consent ticked)
    Portal->>API: POST /applications/{ref}/submit
    API-->>Portal: 202 Accepted, status=Submitted
    Portal-->>Applicant: Show reference LN-2026-000123
    API->>KYC: Verify PAN, identity
    KYC-->>API: Verified
    API->>Bureau: Request score (consent ref)
    Bureau-->>API: Score 780, report summary
    API->>Rules: Evaluate rule set v1.0
    Rules-->>API: All hard rules pass, grade A, STP=true
    API->>API: status=Approved, rate=12.0%
    API->>Notify: Decision notification
    Notify-->>Applicant: SMS + email
```

---

## 6. Context diagram

```mermaid
flowchart LR
    APP((Applicant)) --> LAAS[Loan Application &<br/>Approval System]
    OFF((Credit Officer)) --> LAAS
    ADM((Admin)) --> LAAS
    LAAS --> PAN[PAN verification]
    LAAS --> AAD[Identity verification]
    LAAS --> BUR[Credit bureau]
    LAAS --> MSG[SMS / Email gateway]
    LAAS --> LMS[Loan Management System]
    LAAS --> DOC[(Encrypted document store)]
```
