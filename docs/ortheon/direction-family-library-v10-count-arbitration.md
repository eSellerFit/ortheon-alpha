# Direction Family Library v1.0 Count Arbitration

Sources reviewed:

- `docs/ortheon/ortheon-direction-family-library-v10-candidate.md`
- `docs/ortheon/direction-family-library-v10-qa-notes.md`

Scope: taxonomy count arbitration only. No candidate-library edits, app-code edits, scoring logic, record deletion, or commit.

## Arbitration Question

The v1.0 candidate front matter says the library contains 63 families across 16 spines. The actual current-format family records and the completion-check inventory show 69 unique family IDs.

This note arbitrates whether the final canonical count should remain 63 or be accepted as 69.

Important constraint: `MG-06`, `OD-06`, `RC-01`, `RC-02`, `RC-03`, and `MP-05` are canonical unless an explicit taxonomy decision removes or merges them. They should not be treated as accidental non-canonical records.

## Current Actual Inventory By Spine

### Spine 1 — People & Organization

Count: 6

- PO-01 — People / HR Leadership
- PO-02 — HR Business Partnership
- PO-03 — Talent Acquisition Leadership
- PO-04 — Organizational Development & Change
- PO-05 — Learning & Development Leadership
- PO-06 — Compensation, Benefits & Total Rewards

### Spine 2 — Workforce Intelligence / Talent Strategy

Count: 4

- WI-01 — Workforce Planning & Talent Strategy
- WI-02 — People Analytics
- WI-03 — HR Technology & Systems
- WI-04 — Talent Intelligence & Market Research

### Spine 3 — Marketing & Growth

Count: 6

- MG-01 — Marketing / Growth Leadership
- MG-02 — Brand & Communications
- MG-03 — Performance & Growth Marketing
- MG-04 — Content, SEO & Editorial Strategy
- MG-05 — Lifecycle, CRM & Retention
- MG-06 — Product Marketing / GTM Strategy

### Spine 4 — Commercial / Sales / Partnerships

Count: 4

- CS-01 — Enterprise Sales Leadership
- CS-02 — Account Management & Customer Success
- CS-03 — Business Development & Partnerships
- CS-04 — Revenue Operations

### Spine 5 — Operations & Delivery

Count: 7

- OD-01 — Business Operations Leadership
- OD-02 — Program & Project Leadership
- OD-03 — Supply Chain & Logistics
- OD-04 — Customer Operations & Service Delivery
- OD-05 — Industrial / Manufacturing Operations
- OD-06 — Change Management & Adoption Leadership
- OD-07 — Healthcare Administration / Care Operations

### Spine 6 — Product & Technology

Count: 5

- PT-01 — Product Management
- PT-02 — Engineering Leadership
- PT-03 — Technical Craft (Senior IC)
- PT-04 — Design & User Experience
- PT-05 — Data Engineering & Platform

### Spine 7 — IT / Enterprise Systems

Count: 4

- IT-01 — Enterprise IT Leadership
- IT-02 — Information Security & Risk
- IT-03 — Cloud, Infrastructure & DevOps
- IT-04 — Business Systems & Enterprise Applications

### Spine 8 — Digital Transformation / Automation / AI Enablement

Count: 3

- DX-01 — Digital Transformation Program Leadership
- DX-02 — Business Process Automation
- DX-03 — Enterprise AI Enablement

### Spine 9 — Data / Analytics / Business Intelligence

Count: 3

- DA-01 — Analytics & Decision Support Leadership
- DA-02 — Data Science & Quantitative Methods
- DA-03 — Business Intelligence & Reporting

### Spine 10 — Strategy & Advisory

Count: 4

- SA-01 — Corporate Strategy & Internal Advisory
- SA-02 — Management Consulting
- SA-03 — M&A and Corporate Development
- SA-04 — Transformation Advisory

### Spine 11 — Finance & Capital

Count: 4

- FC-01 — Corporate Finance & FP&A Leadership
- FC-02 — Financial Advisory & Wealth Management
- FC-03 — Investment, Private Capital & Venture
- FC-04 — Accounting, Controllership & Audit

### Spine 12 — Risk, Compliance & Governance

Count: 3

- RC-01 — Compliance & Regulatory Operations
- RC-02 — Enterprise Risk Management
- RC-03 — Privacy, Data Governance & AI Governance

### Spine 13 — Mission / Public Sector / Education

Count: 5

- MP-01 — Nonprofit Leadership
- MP-02 — Education Leadership (K-12 & Higher Ed)
- MP-03 — Public Sector & Government
- MP-04 — Impact Investing & Social Enterprise Advisory
- MP-05 — Workforce Development / Adult Learning / Career Services

### Spine 14 — Independent Practice / Fractional Advisory

Count: 3

- IP-01 — Solo Advisory Practice
- IP-02 — Boutique Consulting Practice
- IP-03 — Expert-Led / Creator Practice

### Spine 15 — Founder / Builder / Operator

Count: 4

- FB-01 — Bootstrapped Service Business Builder
- FB-02 — Product / Software Venture Builder
- FB-03 — Marketplace / Platform Venture Builder
- FB-04 — Local / Main-Street Business Owner

### Spine 16 — Skilled Trade & Licensed Practice

Count: 4

- SL-01 — Skilled Trade Practice
- SL-02 — Clinical / Allied Health Practice
- SL-03 — Mental Health / Therapy Practice
- SL-04 — Licensed Professional Services

## Count Summary

| Spine | Count |
| --- | ---: |
| People & Organization | 6 |
| Workforce Intelligence / Talent Strategy | 4 |
| Marketing & Growth | 6 |
| Commercial / Sales / Partnerships | 4 |
| Operations & Delivery | 7 |
| Product & Technology | 5 |
| IT / Enterprise Systems | 4 |
| Digital Transformation / Automation / AI Enablement | 3 |
| Data / Analytics / Business Intelligence | 3 |
| Strategy & Advisory | 4 |
| Finance & Capital | 4 |
| Risk, Compliance & Governance | 3 |
| Mission / Public Sector / Education | 5 |
| Independent Practice / Fractional Advisory | 3 |
| Founder / Builder / Operator | 4 |
| Skilled Trade & Licensed Practice | 4 |
| **Total unique family IDs** | **69** |

## Duplicate ID Check

No duplicate current family IDs were found among current-format family headings.

There are repeated ID mentions elsewhere in prose, audit trail, adjacency fields, and the completion inventory, but those are references, not duplicate family records.

## Retired Historical ID Check

No retired historical IDs are present as current family records.

Retired/historical lineage to keep out of the canonical current-record set:

- Old `SL-04 — Healthcare Administration / Care Operations` is not present as a current record.
- Canonical `OD-07 — Healthcare Administration / Care Operations` is present and should remain.
- Old `SL-05 — Licensed Professional Services` is not present as a current record.
- Canonical `SL-04 — Licensed Professional Services` is present and should remain.
- Old broad `SL-02 — Clinical & Health Practice` is not present as a current record.
- Canonical `SL-02 — Clinical / Allied Health Practice` and `SL-03 — Mental Health / Therapy Practice` are present and should remain.

## Does 63 Still Hold?

Based on the current candidate file, the 63 count appears outdated or mathematically inconsistent with the canonical inventory now present.

Reasons:

- The current body contains 69 unique current-format family headings.
- The completion inventory also lists 69 unique current-format family IDs.
- The six IDs sometimes suspected as surplus, `MG-06`, `OD-06`, `RC-01`, `RC-02`, `RC-03`, and `MP-05`, are explicitly introduced in the audit trail as v0.2 additions and then preserved through v0.3/v0.4 updates.
- There are no duplicate current family IDs to collapse mechanically.
- Retired `SL-04` Healthcare Administration and `SL-05` Licensed Professional Services are not present as current records.

Therefore, retaining the number 63 requires an explicit taxonomy decision. It cannot be achieved as a QA cleanup by simply removing duplicates or retired historical records from the visible current inventory.

## Option A — Accept 69 As Canonical

Accept the current inventory as the canonical v1.0 taxonomy:

- Set family count to 69 across 16 spines.
- Update front matter, opening prose, and completion-check language from 63 to 69.
- Preserve all current family records, including MG-06, OD-06, RC-01, RC-02, RC-03, and MP-05.
- Keep retired-ID notes for the SL lineage so old `SL-04` Healthcare and old `SL-05` Licensed Professional Services do not reappear.

Rationale:

- This matches the actual current candidate inventory.
- It avoids weakening the taxonomy to satisfy an inherited count.
- The six contested families are methodologically substantive: PMM/GTM, change adoption, compliance, risk, privacy/data/AI governance, and workforce development each have distinct evidence gates, false-positive risks, labor-market patterns, and routing implications.
- It preserves methodology quality and avoids hiding meaningful domains inside broader families.

## Option B — Force 63 Through Explicit Merges Or Removals

Forcing the library to 63 requires removing or merging exactly six current canonical-looking families. This should be treated as a taxonomy arbitration decision, not a QA cleanup.

The mathematically direct merge/removal candidates are the six v0.2 additions, because removing them returns the inventory to 63. This is not recommended as a default move, and these IDs should not be labeled accidental or non-canonical. They can only be removed if the taxonomy owner decides that the narrower family should collapse into broader routing.

Possible forced-63 merge decisions:

- Merge `MG-06 — Product Marketing / GTM Strategy` into `MG-01`, `MG-02`, `MG-04`, `PT-01`, and `CS-04` routing notes.
  - Why this would be possible: PMM touches marketing leadership, brand, content, product, and RevOps.
  - Methodology cost: PMM has distinct launch, positioning, sales-enablement, and product-market evidence gates. Merging it increases false positives for sales, content, and product backgrounds.

- Merge `OD-06 — Change Management & Adoption Leadership` into `PO-04`, `PO-05`, `OD-02`, `DX-01`, and `SA-04`.
  - Why this would be possible: change/adoption often appears inside OD, L&D, program leadership, transformation, and advisory work.
  - Methodology cost: adoption leadership has distinct evidence around behavioral uptake, readiness, enablement, resistance management, and measured change outcomes. Merging it weakens suppression logic for generic project managers and internal comms profiles.

- Merge `RC-01 — Compliance & Regulatory Operations` into `FC-04`, `IT-02`, `SL-04`, `OD-07`, and regulated-industry routing notes.
  - Why this would be possible: compliance often sits adjacent to audit, security, legal/licensed work, and healthcare operations.
  - Methodology cost: compliance is a distinct function with regulator-facing and control-design evidence. Merging it would blur compliance with audit participation, legal exposure, or security controls.

- Merge `RC-02 — Enterprise Risk Management` into `FC-04`, `FC-03`, `IT-02`, and operations risk notes.
  - Why this would be possible: risk work overlaps with audit, finance, investment, security, and operations.
  - Methodology cost: ERM has separate risk-framework, governance, quantification, and board-facing evidence. Merging it makes enterprise risk look like generic project risk or audit adjacency.

- Merge `RC-03 — Privacy, Data Governance & AI Governance` into `DX-03`, `IT-02`, `DA-02`, and `RC-01`-style compliance routing.
  - Why this would be possible: privacy/data/AI governance touches AI enablement, security, data science, and compliance.
  - Methodology cost: governance and enablement are intentionally different. Collapsing RC-03 into DX-03 would confuse deploying AI with governing AI, one of the candidate library's explicit boundary rules.

- Merge `MP-05 — Workforce Development / Adult Learning / Career Services` into `MP-01`, `MP-02`, `PO-05`, `PO-03`, and `IP-03`.
  - Why this would be possible: workforce development overlaps with nonprofit leadership, education, L&D, talent acquisition, and expert-led practice.
  - Methodology cost: workforce development has distinct adult-learning, employer-partnership, grant/funder, placement-outcome, and mission-economy evidence. Merging it would blur corporate L&D, career coaching, and workforce-program leadership.

Alternative forced-63 approach:

- Choose a different six current families for merger/removal.
- This would still require explicit written taxonomy decisions and updated adjacency/routing notes.
- It should not be represented as correcting duplicate IDs, because the candidate does not currently show duplicate current IDs.

## Recommendation

Recommendation: choose Option A unless there is a strong product or governance reason to cap the library at 63.

The methodology should preserve meaningful evidence gates and suppression boundaries over matching an old count number. The current candidate presents 69 unique, current-format family records with no duplicate current IDs and no retired historical IDs present as current records. The cleanest arbitration is to accept 69 as the correct canonical count and update the front matter and QA notes accordingly.

If leadership insists on 63, then Option B must be handled as a deliberate taxonomy compression exercise. The six families to merge or remove must be named explicitly, with rationale and downstream changes to adjacency, bridge, false-positive, and boundary rules. It should not be framed as cleanup of accidental records.

