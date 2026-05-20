# Pressure Test #2: Implementation Findings

Source pressure test: `docs/ortheon/pressure-tests/pressure-test-02-broad-hybrid-profile.md`

Scope: implementation-relevant findings only. This note does not modify the library, define scoring logic, or specify app code changes.

## Summary

Pressure Test #2 found no current Direction Family Library taxonomy issue. The library has the right family boundaries for a broad hybrid profile with workforce planning, talent acquisition, marketplace/platform, operations, advisory, and founder/operator evidence.

The implementation risk is over-crediting. A broad profile with real achievements across several domains can easily trigger weak product, engineering, marketing, sales, generic operations, or consulting recommendations unless the engine requires family-specific ownership evidence.

## 1. Broad Hybrid Profiles Need Over-Crediting Guardrails

Broad hybrid profiles should not be treated as senior in every adjacent family.

For this profile, strong native evidence exists in workforce planning, talent acquisition leadership, and workforce marketplace/platform building. But the same evidence should not automatically transfer into:

- Product Management
- Engineering Leadership
- Marketing / Growth Leadership
- Enterprise Sales Leadership
- Generic Business Operations Leadership
- Management Consulting or Transformation Advisory at senior firm-track level

Implementation finding:

- Seniority should be preserved only inside evidence-native families.
- Adjacent paths need explicit level resets.
- Weak cross-spine paths should suppress or be held as bridge-only.

## 2. Strong Directions For This Profile

The strongest implementation mappings from Pressure Test #2 are:

- WI-01 - Workforce Planning & Talent Strategy
- PO-03 - Talent Acquisition Leadership
- FB-03 - Marketplace / Platform Venture Builder, specifically in workforce marketplace/platform contexts

FB-03 should surface only when marketplace/platform operating evidence is strong. In this profile, that evidence is strong because QUGO includes founder/CEO responsibility, contractor acquisition, supply/demand operations, 100K+ contractors, marketplace labor engine design, and platform economics.

Implementation finding:

- Marketplace/platform paths should not be globally suppressed after Pressure Test #1.
- They should require stronger evidence typing.
- FB-03 should surface for real marketplace builders, not for people who merely worked near a marketplace.

## 3. Marketplace / Platform Evidence Must Be Typed

Marketplace/platform evidence should be separated into evidence types:

- Marketplace participation: used or participated in a marketplace; weak evidence.
- Marketplace operations exposure: worked inside or adjacent to a marketplace context; partial evidence.
- Marketplace operating leadership: owned supply, demand, matching, economics, seller/contractor ecosystems, or platform operations; strong evidence.
- Marketplace venture building: founded or built a marketplace/platform business; strongest FB-03 evidence.

Implementation finding:

- Wildberries context is marketplace operations exposure / possible operating leadership depending on exact scope.
- QUGO is marketplace venture-building evidence.
- A future engine should not collapse these into one undifferentiated "marketplace" signal.

## 4. Founder / Operator Paths Need Evidence Gates

Founder/operator paths should not surface only because the profile uses entrepreneurial language.

FB families should require evidence such as:

- Real operating responsibility
- Market thesis
- Client/customer acquisition
- Team or co-founder context
- Revenue, GMV, contractor, seller, or customer scale
- Venture-building or service-business proof
- Runway or risk-tolerance compatibility for new-founder recommendations

Implementation finding:

- QUGO supports founder/operator credibility.
- That does not mean every founder path should surface.
- FB-03 is strongest for this profile; FB-01 can be adjacent/conditional; FB-02 should not surface without product/technical/co-founder evidence.

## 5. Generic Operations Paths Need Function-Level Ownership

Generic operations paths should not surface merely because a candidate has cross-functional work.

OD-01 requires function-level or cross-functional business operations ownership, not just:

- Workforce planning
- Labor operations
- Cross-functional stakeholder partnership
- Process mapping
- Working with Operations, Finance, Product, or Analytics

Implementation finding:

- OD-01 may surface as adjacent/conditional for this profile because there is strong labor operations and operating-model evidence.
- OD-01 should not be over-leveled into COO / broad business operations unless broader operating cadence, business operations systems, or multi-function ownership is explicit.

## 6. Consulting / Advisory Paths Need Separation

Consulting/advisory recommendations should distinguish:

- Advisory potential: domain expertise that could become advisory work.
- Actual consulting delivery: client-facing consulting engagements and delivery responsibility.
- Solo advisory practice readiness: offer, pipeline, business development, runway, and willingness to sell.
- Boutique consulting firm-building: team, multi-client revenue model, repeatable methodology, and firm operations.

Implementation finding:

- SA-02 should not be over-leveled into senior consulting-firm equivalence from GHUB/SCORE/advisory evidence alone.
- SA-04 can be adjacent or bridge-based where workforce transformation and labor operations methodology are packaged for clients.
- IP-01 can be direct/conditional if pipeline and offer exist.
- IP-02 should generally be bridge-based unless firm-building evidence exists.

## 7. AI / Digital Signals Need Correct Treatment

AI/digital signals should be treated as modifier/tooling unless there is substantive AI enablement, AI governance, data, or technical evidence.

This profile has real AI-enabled recruiting and workforce-system evidence, including AI-driven CV scoring, offer probability prediction, candidate assessment tools, workflow optimization, and algorithmic labor capacity models.

Implementation finding:

- AI evidence strengthens WI-01, PO-03, WI-04, and workforce marketplace/platform paths.
- It should not automatically create Product Management, Engineering Leadership, Data Science, AI Governance, or generic AI Strategy recommendations.
- Product/Analytics partnership is not product ownership or technical leadership.

## 8. Composite Report Labels Need Canonical Mapping

Composite report labels must map internally to canonical family IDs.

This profile is especially vulnerable to vague composite labels such as:

- Workforce marketplace operator
- Labor platform strategist
- Talent operations leader
- Workforce transformation advisor
- Founder/operator

Those labels may be useful in the user-facing report, but internally they must map to explicit canonical families such as:

- WI-01
- PO-03
- FB-03
- WI-04
- OD-01
- SA-04
- IP-01
- IP-02
- FB-01
- MP-05

Implementation finding:

- Display labels should not replace family classification.
- Every displayed recommendation should carry a canonical family ID and path type.
- QA should be able to identify whether a recommendation is direct, adjacent, bridge-based, conditional, or suppressed.

## Issue Classification

These findings are engine/scoring/report-presentation issues, not current library taxonomy issues.

No immediate library changes are recommended from Pressure Test #2. The taxonomy already contains the relevant families and boundaries. Implementation should honor the gates, separate evidence types, expose canonical IDs, and avoid allowing broad-profile vocabulary to become broad-profile over-recommendation.

## Recommended future implementation fixes:

- add broad-profile over-crediting guardrail
- require evidence type separation for marketplace/platform paths
- require founder/operator evidence gates before surfacing FB families
- strengthen suppression for weak product/engineering/marketing/sales paths
- expose canonical family ID internally for every displayed recommendation
- separate display label from underlying family classification
