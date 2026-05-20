# Direction Family Library v1.0 Candidate QA Notes

Source reviewed: `docs/ortheon/ortheon-direction-family-library-v10-candidate.md`

Scope: inventory QA only. No rewrite of the candidate library, no app-code changes, no scoring logic, no commit.

## Corrected Summary Finding

The earlier QA interpretation was wrong: the six v0.2 additions below are canonical and must remain in the v1.0 family taxonomy.

- MG-06 — Product Marketing / GTM Strategy
- OD-06 — Change Management & Adoption Leadership
- RC-01 — Compliance & Regulatory Operations
- RC-02 — Enterprise Risk Management
- RC-03 — Privacy, Data Governance & AI Governance
- MP-05 — Workforce Development / Adult Learning / Career Services

The QA issue is not that these IDs are non-canonical. The audit trail says they were added in v0.2 and preserved through v0.4 as part of the intended 63-family taxonomy.

The likely QA issue is that the v1.0 candidate merge retained historical duplicate records, retired version sections, or stale inventory artifacts from v0.2/v0.3. Those duplicate/historical sections should be removed or clearly marked historical, while the current canonical IDs above should remain.

Important reconciliation note: the current candidate's completion check lists 69 family entries. The visible inventory uses current-looking canonical headings, so the final 63 cannot be recovered by demoting MG-06, OD-06, RC-01, RC-02, RC-03, or MP-05. Cleanup should instead target duplicated historical sections and retired IDs, especially the old `SL-04` / `SL-05` lineage.

## Canonical Family IDs To Keep

These IDs are canonical and should remain in the final v1.0 taxonomy:

- PO-01 — People / HR Leadership
- PO-02 — HR Business Partnership
- PO-03 — Talent Acquisition Leadership
- PO-04 — Organizational Development & Change
- PO-05 — Learning & Development Leadership
- PO-06 — Compensation, Benefits & Total Rewards
- WI-01 — Workforce Planning & Talent Strategy
- WI-02 — People Analytics
- WI-03 — HR Technology & Systems
- WI-04 — Talent Intelligence & Market Research
- MG-01 — Marketing / Growth Leadership
- MG-02 — Brand & Communications
- MG-03 — Performance & Growth Marketing
- MG-04 — Content, SEO & Editorial Strategy
- MG-05 — Lifecycle, CRM & Retention
- MG-06 — Product Marketing / GTM Strategy
- CS-01 — Enterprise Sales Leadership
- CS-02 — Account Management & Customer Success
- CS-03 — Business Development & Partnerships
- CS-04 — Revenue Operations
- OD-01 — Business Operations Leadership
- OD-02 — Program & Project Leadership
- OD-03 — Supply Chain & Logistics
- OD-04 — Customer Operations & Service Delivery
- OD-05 — Industrial / Manufacturing Operations
- OD-06 — Change Management & Adoption Leadership
- OD-07 — Healthcare Administration / Care Operations
- PT-01 — Product Management
- PT-02 — Engineering Leadership
- PT-03 — Technical Craft (Senior IC)
- PT-04 — Design & User Experience
- PT-05 — Data Engineering & Platform
- IT-01 — Enterprise IT Leadership
- IT-02 — Information Security & Risk
- IT-03 — Cloud, Infrastructure & DevOps
- IT-04 — Business Systems & Enterprise Applications
- DX-01 — Digital Transformation Program Leadership
- DX-02 — Business Process Automation
- DX-03 — Enterprise AI Enablement
- DA-01 — Analytics & Decision Support Leadership
- DA-02 — Data Science & Quantitative Methods
- DA-03 — Business Intelligence & Reporting
- SA-01 — Corporate Strategy & Internal Advisory
- SA-02 — Management Consulting
- SA-03 — M&A and Corporate Development
- SA-04 — Transformation Advisory
- FC-01 — Corporate Finance & FP&A Leadership
- FC-02 — Financial Advisory & Wealth Management
- FC-03 — Investment, Private Capital & Venture
- FC-04 — Accounting, Controllership & Audit
- RC-01 — Compliance & Regulatory Operations
- RC-02 — Enterprise Risk Management
- RC-03 — Privacy, Data Governance & AI Governance
- MP-01 — Nonprofit Leadership
- MP-02 — Education Leadership (K-12 & Higher Ed)
- MP-03 — Public Sector & Government
- MP-04 — Impact Investing & Social Enterprise Advisory
- MP-05 — Workforce Development / Adult Learning / Career Services
- IP-01 — Solo Advisory Practice
- IP-02 — Boutique Consulting Practice
- IP-03 — Expert-Led / Creator Practice
- FB-01 — Bootstrapped Service Business Builder
- FB-02 — Product / Software Venture Builder
- FB-03 — Marketplace / Platform Venture Builder
- FB-04 — Local / Main-Street Business Owner
- SL-01 — Skilled Trade Practice
- SL-02 — Clinical / Allied Health Practice
- SL-03 — Mental Health / Therapy Practice
- SL-04 — Licensed Professional Services

QA caveat: this list reflects all current canonical-looking IDs in the candidate. It totals 69 as written in the candidate inventory. To produce the locked 63-family final, the next QA pass must identify which six counted records are duplicated historical sections rather than unique canonical families. The six v0.2 additions named at the top of this note are not those removals.

## Historical Duplicate Records / Sections To Remove

Remove duplicate historical sections if they appear as standalone family records, stale inventory rows, or continuation-package leftovers:

- Any duplicate v0.2/v0.3 record for `MG-06` separate from the current v1.0 `MG-06 — Product Marketing / GTM Strategy` record.
- Any duplicate v0.2/v0.3 record for `OD-06` separate from the current v1.0 `OD-06 — Change Management & Adoption Leadership` record.
- Any duplicate v0.2/v0.3 records for `RC-01`, `RC-02`, or `RC-03` separate from their current v1.0 records.
- Any duplicate v0.2/v0.3 record for `MP-05` separate from the current v1.0 `MP-05 — Workforce Development / Adult Learning / Career Services` record.
- Any continuation-package wrapper, partial-canonical fragment, or duplicate SA-03-to-SL-04 section that was merged into the candidate as content rather than used only as replacement source material.

These records should not be deleted because the domains are invalid. They should be removed only if they are duplicate historical copies of records that already exist in canonical v1.0 form.

## Retired IDs / Labels To Treat As Historical

These should not appear as canonical final records:

- v0.2 `SL-04 — Healthcare Administration / Care Operations`
- v0.2 `SL-05 — Licensed Professional Services`
- v0.1/v0.2 broad `SL-02 — Clinical & Health Practice` label, if present as a standalone record

Current canonical replacements:

- `OD-07 — Healthcare Administration / Care Operations` is canonical.
- `SL-04 — Licensed Professional Services` is canonical.
- The old broad clinical/health bucket is superseded by `SL-02 — Clinical / Allied Health Practice`, `SL-03 — Mental Health / Therapy Practice`, and `OD-07 — Healthcare Administration / Care Operations`.

## Canonical IDs To Preserve During Final Inventory Cleanup

The final locked inventory should contain 63 canonical families across the 16 spines. The following spine structure reflects the current canonical-looking records that must be preserved unless a later taxonomy decision explicitly retires one. As currently visible in the candidate, this list still totals 69, so it should be treated as the preserve list for cleanup, not as a reconciled 63-count lock.

### Spine 1 — People & Organization

- PO-01 — People / HR Leadership
- PO-02 — HR Business Partnership
- PO-03 — Talent Acquisition Leadership
- PO-04 — Organizational Development & Change
- PO-05 — Learning & Development Leadership
- PO-06 — Compensation, Benefits & Total Rewards

### Spine 2 — Workforce Intelligence / Talent Strategy

- WI-01 — Workforce Planning & Talent Strategy
- WI-02 — People Analytics
- WI-03 — HR Technology & Systems
- WI-04 — Talent Intelligence & Market Research

### Spine 3 — Marketing & Growth

- MG-01 — Marketing / Growth Leadership
- MG-02 — Brand & Communications
- MG-03 — Performance & Growth Marketing
- MG-04 — Content, SEO & Editorial Strategy
- MG-05 — Lifecycle, CRM & Retention
- MG-06 — Product Marketing / GTM Strategy

### Spine 4 — Commercial / Sales / Partnerships

- CS-01 — Enterprise Sales Leadership
- CS-02 — Account Management & Customer Success
- CS-03 — Business Development & Partnerships
- CS-04 — Revenue Operations

### Spine 5 — Operations & Delivery

- OD-01 — Business Operations Leadership
- OD-02 — Program & Project Leadership
- OD-03 — Supply Chain & Logistics
- OD-04 — Customer Operations & Service Delivery
- OD-05 — Industrial / Manufacturing Operations
- OD-06 — Change Management & Adoption Leadership
- OD-07 — Healthcare Administration / Care Operations

### Spine 6 — Product & Technology

- PT-01 — Product Management
- PT-02 — Engineering Leadership
- PT-03 — Technical Craft (Senior IC)
- PT-04 — Design & User Experience
- PT-05 — Data Engineering & Platform

### Spine 7 — IT / Enterprise Systems

- IT-01 — Enterprise IT Leadership
- IT-02 — Information Security & Risk
- IT-03 — Cloud, Infrastructure & DevOps
- IT-04 — Business Systems & Enterprise Applications

### Spine 8 — Digital Transformation / Automation / AI Enablement

- DX-01 — Digital Transformation Program Leadership
- DX-02 — Business Process Automation
- DX-03 — Enterprise AI Enablement

### Spine 9 — Data / Analytics / Business Intelligence

- DA-01 — Analytics & Decision Support Leadership
- DA-02 — Data Science & Quantitative Methods
- DA-03 — Business Intelligence & Reporting

### Spine 10 — Strategy & Advisory

- SA-01 — Corporate Strategy & Internal Advisory
- SA-02 — Management Consulting
- SA-03 — M&A and Corporate Development
- SA-04 — Transformation Advisory

### Spine 11 — Finance & Capital

- FC-01 — Corporate Finance & FP&A Leadership
- FC-02 — Financial Advisory & Wealth Management
- FC-03 — Investment, Private Capital & Venture
- FC-04 — Accounting, Controllership & Audit

### Spine 12 — Risk, Compliance & Governance

- RC-01 — Compliance & Regulatory Operations
- RC-02 — Enterprise Risk Management
- RC-03 — Privacy, Data Governance & AI Governance

### Spine 13 — Mission / Public Sector / Education

- MP-01 — Nonprofit Leadership
- MP-02 — Education Leadership (K-12 & Higher Ed)
- MP-03 — Public Sector & Government
- MP-04 — Impact Investing & Social Enterprise Advisory
- MP-05 — Workforce Development / Adult Learning / Career Services

### Spine 14 — Independent Practice / Fractional Advisory

- IP-01 — Solo Advisory Practice
- IP-02 — Boutique Consulting Practice
- IP-03 — Expert-Led / Creator Practice

### Spine 15 — Founder / Builder / Operator

- FB-01 — Bootstrapped Service Business Builder
- FB-02 — Product / Software Venture Builder
- FB-03 — Marketplace / Platform Venture Builder
- FB-04 — Local / Main-Street Business Owner

### Spine 16 — Skilled Trade & Licensed Practice

- SL-01 — Skilled Trade Practice
- SL-02 — Clinical / Allied Health Practice
- SL-03 — Mental Health / Therapy Practice
- SL-04 — Licensed Professional Services

## Count Reconciliation Status

| Item | Count |
| --- | ---: |
| Expected final family count from front matter | 63 |
| Candidate completion-check count | 69 |
| Current visible canonical-looking inventory entries | 69 |
| Known canonical v0.2 additions wrongly demoted in prior QA note | 6 |
| Known retired historical IDs/labels to remove if present | SL-04 Healthcare Administration, SL-05 Licensed Professional Services, broad SL-02 Clinical & Health Practice |

Current status: unresolved from the notes file alone. The corrected QA position is that the six named v0.2 additions must be kept. The 69-to-63 reduction should come from removing duplicate historical sections or retired-version artifacts, not from removing canonical current IDs.

## Final 63-Family Inventory Status

The final 63-family inventory is not safely derivable from the current candidate text without additional taxonomy confirmation. The candidate's visible family headings and inventory present 69 current-format IDs; the known retired lineage (`SL-04` Healthcare Administration, `SL-05` Licensed Professional Services, and broad `SL-02` Clinical & Health Practice) explains version conflicts, but those retired records are not visible as separate canonical headings in the current candidate.

Therefore the QA note should not invent six removals. The next cleanup pass should first remove duplicate/historical record sections if present outside the visible inventory, then regenerate the inventory. If the regenerated inventory still contains 69 distinct current-format records, the taxonomy needs an explicit decision about which six current-looking records are duplicate artifacts.

## Duplicate / Conflict Notes

- `MG-06`, `OD-06`, `RC-01`, `RC-02`, `RC-03`, and `MP-05` are canonical. Do not treat their current v1.0 records as surplus.
- `OD-07` and current `SL-04` are both canonical and not duplicates. Their conflict is historical only.
- Old `SL-04` meant Healthcare Administration / Care Operations. That ID usage is retired; Healthcare Administration now lives at canonical `OD-07`.
- Old `SL-05` meant Licensed Professional Services. That ID is retired; Licensed Professional Services now lives at canonical `SL-04`.
- If duplicate historical copies of records were merged into the body, remove those duplicate copies while preserving the current canonical record.
- The candidate body includes an explicit `family_id` table row only for `SA-03`. This looks like a continuation-package formatting artifact and should not be counted as a separate family record.

## Recommended Cleanup Plan

1. Keep MG-06, OD-06, RC-01, RC-02, RC-03, and MP-05 as canonical families.
2. Search the candidate for duplicate record blocks, stale inventory blocks, and continuation-package leftovers from v0.2/v0.3/v0.4 partial merges.
3. Remove or mark historical any old `SL-04 — Healthcare Administration / Care Operations` record. Preserve canonical `OD-07`.
4. Remove or mark historical any old `SL-05 — Licensed Professional Services` record. Preserve current canonical `SL-04`.
5. Remove or mark historical any old broad `SL-02 — Clinical & Health Practice` record. Preserve current `SL-02`, `SL-03`, and `OD-07`.
6. Regenerate the completion check from a fixed expected 63-family baseline, not from whatever headings happen to be present after the merge.
7. If the body still shows 69 distinct current-format records after duplicate/historical sections are removed, escalate for taxonomy confirmation rather than demoting the six v0.2 canonical additions.
