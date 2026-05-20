# Pressure Test Implementation Guardrails v1

Source notes:

- `docs/ortheon/pressure-tests/pressure-test-01-implementation-findings.md`
- `docs/ortheon/pressure-tests/pressure-test-02-implementation-findings.md`
- `docs/ortheon/pressure-tests/pressure-test-03-implementation-findings.md`

Scope: implementation guardrails only. This note does not modify the library, define scoring logic, edit app code, or specify detailed matching-engine implementation.

## 1. Purpose

These guardrails consolidate implementation-relevant findings from the first three manual pressure tests of the Ortheon Direction Family Library.

They are not library taxonomy changes. The first three pressure tests found that the 69-family taxonomy contains the needed families and boundary rules. The recurring risks are in future matching, scoring, and report presentation:

- weak recommendations surfacing from broad language
- title seniority transferring into unrelated families
- nearby trajectories appearing without enough evidence
- composite display labels hiding canonical family IDs
- AI, platform, founder, product, and advisory language being over-interpreted

Use this note as a QA and implementation requirements layer before drafting matching-engine logic.

## 2. Cross-Test Findings

Repeated risks across the first three pressure tests:

- Broad-profile over-crediting: candidates with real achievements across several domains can be treated as senior in too many adjacent families.
- Title inflation: senior labels such as HR Director, Founder, CTO, Chief AI Officer, Advisor, or Head of Platform can imply more family readiness than the evidence supports.
- Weak cross-spine recommendations: broad enterprise seniority can incorrectly trigger marketplace, product, operations, marketing, sales, consulting, data, founder, or governance paths.
- Composite labels hiding canonical family IDs: user-facing labels such as "people operations," "workforce marketplace operator," "technology executive," or "AI transformation leader" can obscure which canonical family is actually being recommended.
- Nearby trajectories surfacing without enough evidence: "nearby" should mean evidence-supported but not direct, not merely imaginable.
- Seniority transfer risk: seniority should preserve inside native evidence families, but adjacent or bridge-based families need honest level resets.
- AI over-interpretation: AI tooling, AI interest, or AI-adjacent systems should not automatically create AI enablement, AI strategy, data science, or AI governance recommendations.

## 3. Evidence Gate Rules

### HR / People Profiles

Strong senior HR profiles should surface native People & Organization families when evidence supports them, especially:

- PO-01 - People / HR Leadership
- PO-02 - HR Business Partnership
- PO-03 - Talent Acquisition Leadership, when hiring-scale or TA leadership evidence exists
- PO-04 - Organizational Development & Change, when OD or org design ownership exists
- PO-05 - Learning & Development Leadership, when learning program ownership exists

Evidence gates:

- Preserve seniority inside native HR families when function ownership, business partnership, people strategy, HR operations, or leadership scope is clear.
- Do not treat people management as HR evidence.
- Do not surface marketplace, product, operations, marketing, customer operations, or founder paths from HR vocabulary alone.
- Treat IP-01 and SA-04 as conditional or bridge-based unless advisory offer, pipeline, runway, client-facing delivery, or transformation advisory evidence exists.

### Broad Hybrid Profiles

Broad hybrid profiles need explicit over-crediting controls.

Evidence gates:

- Preserve seniority only inside evidence-native families.
- Require family-specific ownership before surfacing product, engineering, marketing, sales, generic operations, consulting, or founder paths.
- Separate true direct fit from adjacent, conditional, and bridge-based fit.
- Apply level resets when the candidate crosses spines or moves from operator evidence into advisory, founder, product, or technical leadership claims.

### Marketplace / Platform Profiles

Marketplace evidence must be typed.

Evidence types:

- Marketplace participation: used or participated in a marketplace; weak evidence.
- Marketplace operations exposure: worked inside or adjacent to a marketplace context; partial evidence.
- Marketplace operating leadership: owned supply, demand, matching, economics, seller/contractor ecosystems, or platform operations; strong evidence.
- Marketplace venture building: founded or built a marketplace/platform business; strongest FB-03 evidence.

Evidence gates:

- FB-03 - Marketplace / Platform Venture Builder should surface only for real marketplace builders or operators.
- Do not treat "platform" as marketplace evidence by itself.
- Do not treat adtech, internal platform, SaaS platform, data platform, or workflow platform language as FB-03 unless marketplace mechanics are present.

### Founder / Operator Paths

Founder/operator paths require real operating evidence, not entrepreneurial language.

Evidence gates:

- Require founder/operator responsibility, market thesis, customer or client acquisition, team or co-founder context, revenue/GMV/customer scale, venture-building proof, service-business proof, runway, or risk-tolerance evidence.
- Do not surface FB families only because a profile says founder, startup, builder, entrepreneurial, advisor, platform, or launch.
- Distinguish FB-01 service business, FB-02 product/software venture, FB-03 marketplace/platform venture, and FB-04 local/main-street ownership by operating model.

### CTO / IT Profiles

CTO / IT profiles need seniority-context guardrails.

Evidence gates:

- CTO title should be interpreted by role context, company scale, function ownership, and evidence type.
- A CTO title should not automatically mean enterprise CIO/CTO, VP Engineering, Product Leader, Technical Founder, AI Leader, Data Platform Leader, and Transformation Advisor at the same time.
- Map internal technology backbone, IT services, infrastructure, vendors, cybersecurity, and business systems to IT families.
- Map engineering teams, software delivery, technical standards, architecture, and delivery accountability to PT-02.
- Apply level resets or conditional treatment to adjacent data, product, founder, governance, or advisory paths.

### Product Management

Product Management should not surface from product/platform vocabulary alone.

Evidence gates for PT-01:

- product roadmap ownership
- customer discovery
- prioritization authority
- product strategy
- commercial product accountability
- lifecycle ownership beyond technical delivery

Implementation guardrail:

- CTO-led delivery, shipped applications, MVPs, platforms, or "full product cycle" wording may strengthen PT-02, IT-04, DX-01, DX-02, or DX-03.
- They should not create native PT-01 unless product-management ownership is explicit.

### AI Enablement vs AI Governance

AI deployment and AI governance must remain separate.

DX-03 - Enterprise AI Enablement evidence:

- substantive AI deployments
- business adoption
- workflow integration
- measurable outcomes
- AI use-case ownership
- AI implementation leadership

RC-03 - Privacy, Data Governance & AI Governance evidence:

- privacy program ownership
- data governance framework ownership
- AI governance policy
- responsible-AI controls
- regulatory/risk oversight
- model governance or vendor governance
- privacy, data, or AI compliance depth

Implementation guardrail:

- Generic AI tooling should not create AI strategy, AI governance, or Chief AI Officer recommendations.
- AI deployment evidence should map to DX-03.
- AI governance / RC-03 should require governance, privacy, policy, regulatory, risk, or responsible-AI evidence.

### Data Platform

Data-stack vocabulary is not enough for PT-05 - Data Engineering & Platform.

Evidence gates:

- dedicated data platform ownership
- pipeline architecture ownership
- data engineering function ownership
- infrastructure-as-code or data infrastructure leadership
- substantive data engineering depth

Implementation guardrail:

- Kafka, Airflow, databases, ML stacks, RTB systems, analytics-heavy platforms, or data-driven language should not create PT-05 as a primary recommendation by themselves.
- If evidence is cloud/infrastructure/reliability, route to IT-03.
- If evidence is engineering organization leadership, route to PT-02.
- If evidence is analytics or data science without engineering function ownership, route to the relevant DA family only when those evidence gates are met.

### Consulting / Advisory Paths

Consulting/advisory recommendations need separation.

Evidence categories:

- Advisory potential: domain expertise that could become advisory work.
- Actual consulting delivery: client-facing engagements and delivery responsibility.
- Solo advisory practice readiness: offer, pipeline, business development, runway, and willingness to sell.
- Boutique consulting firm-building: team, multi-client revenue model, repeatable methodology, and firm operations.

Implementation guardrail:

- SA-02 should not surface from internal strategy, advisory language, or one-off advisory exposure alone.
- SA-04 should require transformation advisory or a clear bridge from in-house transformation.
- IP-01 should require pipeline, offer, runway, and business-development appetite.
- IP-02 should generally require firm-building evidence, not solo or informal advisory evidence.

## 4. Report Presentation Guardrails

Every displayed recommendation must map to a canonical Direction Family ID.

Report presentation requirements:

- Display label must be separate from underlying family classification.
- Every recommendation must have a path type: Direct, Adjacent, Bridge-based, Conditional, or Suppressed.
- Composite labels must retain primary and supporting canonical family IDs internally.
- No recommendation should appear without evidence-backed family mapping.
- Report QA should be able to inspect why a direction appeared, which evidence supported it, and what path type was assigned.

Composite labels may be useful for readability, for example:

- Talent Acquisition / People Operations - Enterprise
- Workforce marketplace operator
- Technology executive
- AI transformation leader
- Platform leader
- Workforce transformation advisor

But these labels must not become hidden taxonomy objects. They should be display language layered on top of canonical family classification.

## 5. Suppression Guardrails

Suppress weak marketplace/product/operations paths when:

- marketplace evidence is only participation, keyword, or proximity
- product evidence is delivery without product ownership
- operations evidence is cross-functional work without function-level ownership
- platform evidence is technical platform work without marketplace mechanics

Suppress weak founder paths when:

- entrepreneurial language is present without operating proof
- there is no customer/client acquisition evidence
- there is no market thesis, runway, revenue, ownership, or venture/service-business proof
- founder appetite is aspirational only

Suppress weak CTO-to-product/founder/data/governance paths when:

- CTO title is the main evidence
- product/platform delivery lacks Product Management ownership
- data-stack vocabulary lacks data platform ownership
- AI deployment lacks governance, privacy, policy, or responsible-AI evidence
- startup/launch language lacks founder/operator evidence

Suppress weak HR-to-marketplace/operations paths when:

- HR leadership is mistaken for marketplace or platform operations
- people operations language is mistaken for generic business operations
- talent/workforce language lacks supply/demand marketplace ownership
- advisory potential lacks client, offer, pipeline, or runway evidence

## 6. Future Engine Requirements

High-level future engine requirements:

- broad-profile over-crediting guardrail
- CTO title inflation guardrail
- marketplace evidence typing
- founder/operator evidence gates
- AI deployment vs AI governance separation
- product delivery vs Product Management separation
- cloud/infrastructure vs data platform ownership separation
- consulting/advisory readiness separation
- weak cross-spine suppression rules
- explicit level reset handling for adjacent and bridge-based paths
- canonical family ID stored internally for every recommendation
- path type stored internally for every recommendation
- display label stored separately from underlying family classification
- report QA rule: no recommendation shown without evidence-backed family mapping

Next step: use this guardrails note to draft the matching-engine logic specification after additional pressure tests or after choosing to proceed with implementation.
