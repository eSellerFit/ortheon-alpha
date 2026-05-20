# Pressure Test #1: Implementation Findings

Source pressure test: `docs/ortheon/pressure-tests/pressure-test-01-senior-hr-people-profile.md`

Scope: implementation-relevant findings only. This note does not modify the library, define scoring logic, or specify app code changes.

## Summary

Pressure Test #1 did not find a current Direction Family Library taxonomy problem. The 69-family library has the right evidence gates for a senior HR / People profile.

The implementation risk is that report generation or matching behavior may surface weak cross-spine paths, hide canonical family IDs behind broad display labels, or under-present the strongest People & Organization families.

## 1. Marketplace / Platform Directions Need Stronger Suppression

Marketplace / Platform directions should not surface as nearby unless there is strong marketplace or platform operating evidence.

For this senior HR profile, the visible evidence supports enterprise HR leadership, HR business partnership, people operations, change management, and some adjacent workforce intelligence. It does not support marketplace/platform operating experience, network-effects work, supply/demand orchestration, marketplace growth, founder evidence, or platform venture-building.

Finding:

- The pressure test flagged "Marketplace / Platform Operations - Enterprise" as an unsupported nearby trajectory.
- This is a false-positive implementation concern, not a library taxonomy concern.
- FB-03 already has strict evidence gates. The issue is likely that the engine/report layer is allowing weak or noisy cross-spine signals to become nearby recommendations.

## 2. Report Labels Should Map To Canonical Direction Family IDs

Every displayed recommendation should have an underlying canonical Direction Family ID.

The report label "Talent Acquisition / People Operations - Enterprise" is useful as human-facing language, but it obscures whether the recommendation is driven by:

- PO-01 - People / HR Leadership
- PO-02 - HR Business Partnership
- PO-03 - Talent Acquisition Leadership
- another adjacent family

Implementation finding:

- Display labels can be flexible, but internal classification must remain auditable.
- Report QA should be able to inspect the canonical family ID behind each displayed direction.
- Composite direction labels should not be treated as taxonomy objects unless they map cleanly to one or more explicit canonical family IDs.

## 3. Composite Labels Should Not Hide Family-Level Classification

Composite labels are especially risky for HR profiles because several nearby families share vocabulary:

- People operations can mean PO-01, PO-02, or HR operations-style work.
- Talent can mean PO-03, WI-01, WI-04, or general people strategy.
- Learning can mean PO-05 or MP-05 depending on whether the context is corporate L&D or workforce development / adult learning.
- Advisory can mean IP-01, SA-04, or a fractional level inside a substantive family.

Implementation finding:

- A displayed recommendation should separate the user-facing label from the underlying family classification.
- If a label combines multiple families, the report should still preserve the primary family ID and any secondary supporting family IDs.
- The user-facing report should not make PO-01, PO-02, PO-05, MP-05, IP-01, or SA-04 indistinguishable from each other.

## 4. Senior HR Profiles Should Surface People Leadership

Senior HR profiles should be able to surface HR Director / HR VP / People Leadership when evidence supports it.

For this profile, the strongest canonical directions are:

- PO-01 - People / HR Leadership
- PO-02 - HR Business Partnership

The report can use title-like examples such as HR Director, VP HR, VP People, Head of People, or People Operations Director, but those should remain display examples under canonical families rather than replacing the family mapping.

Implementation finding:

- If the report does not clearly surface PO-01 or PO-02 for a senior HR advisor / director profile, that is likely an engine/scoring or report-presentation issue.
- Seniority should be preserved inside the native HR spine where evidence supports it.
- Seniority should not automatically transfer into weak cross-spine paths.

## 5. Nearby Trajectories Need More Discipline

Nearby trajectories should be evidence-bounded. They should not include weak or noisy cross-spine paths simply because a candidate has broad enterprise seniority or adjacent vocabulary.

For this profile, credible nearby / bridge paths include:

- PO-03 - Talent Acquisition Leadership, if TA center-of-excellence and hiring-scale evidence is confirmed.
- PO-04 - Organizational Development & Change, if OD intervention / org design ownership is confirmed.
- PO-05 - Learning & Development Leadership, if learning program ownership and outcomes are confirmed.
- WI-01 - Workforce Planning & Talent Strategy, as a bridge from HR strategy into workforce planning / talent intelligence.
- MP-05 - Workforce Development / Adult Learning / Career Services, only as a cautious bridge or conditional path.
- IP-01 - Solo Advisory Practice, only if pipeline, runway, offer clarity, and business-development appetite exist.
- SA-04 - Transformation Advisory, only with a named advisory or transformation bridge.

Paths that should suppress unless new evidence appears:

- Marketplace / platform operations or venture-building.
- Product management.
- Marketing / growth.
- Customer operations / service delivery.
- Generic business operations leadership.
- Founder / builder paths.

Implementation finding:

- Nearby should not mean "loosely imaginable."
- Nearby should mean "supported by evidence, but not yet direct."
- Weak cross-spine paths should suppress or be held out of the displayed report.

## 6. Issue Classification

These findings are engine/scoring/report-presentation issues, not current library taxonomy issues.

No immediate library changes are recommended from Pressure Test #1. The library already has the relevant family boundaries and suppression logic. The implementation should honor those gates more strictly and make report output more auditable.

## Recommended future implementation fixes:

- strengthen suppression for weak cross-spine marketplace/product/operations paths
- expose canonical family ID internally for every displayed recommendation
- separate display label from underlying family classification
- add report QA rule: no recommendation shown without evidence-backed family mapping
