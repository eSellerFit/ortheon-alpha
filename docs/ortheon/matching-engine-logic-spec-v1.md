# Ortheon Matching Engine Logic Specification v1

Methodology sources:

- `docs/ortheon/ortheon-direction-family-library-v10-final-candidate.md`
- `docs/ortheon/direction-library-pressure-test-plan.md`
- `docs/ortheon/pressure-tests/pressure-test-implementation-guardrails-v1.md`
- `docs/ortheon/pressure-tests/pressure-test-01-implementation-findings.md`
- `docs/ortheon/pressure-tests/pressure-test-02-implementation-findings.md`
- `docs/ortheon/pressure-tests/pressure-test-03-implementation-findings.md`

Scope: methodology and product logic only. This document does not implement code, define a final numeric scoring formula, edit the app, or modify the Direction Family Library.

## 1. Executive Summary

The Ortheon matching engine must translate candidate evidence into evidence-backed career direction recommendations using the canonical Direction Family Library.

The engine must take candidate evidence from:

- CV and career history
- assessment answers
- competency signals
- financial reality
- career anchors and motivation
- constraints
- credential and license status
- AI/digital signals
- source confidence and evidence confidence

It must evaluate direction families, suppress weak fits, classify path types, recommend directions with honest level bands and feasibility envelopes, and preserve the distinction between internal canonical family IDs and user-facing display labels.

The engine should not behave like a job-title matcher. It should behave like an evidence-gated direction classifier.

The engine's core responsibilities are:

- identify direction families with enough evidence to consider
- apply hard gates and credential gates
- evaluate family-specific core evidence requirements
- suppress false positives and weak cross-spine fits
- classify each considered family as Direct, Adjacent, Bridge-based, Conditional, or Suppressed
- translate native seniority into honest entry level by family
- apply financial feasibility, constraints, credentials, and transition realism
- treat AI/digital signals according to family-specific rules
- rank recommendations qualitatively
- generate display labels while storing canonical family IDs and path types internally

## 2. Core Principle

A recommendation is not a job title.

A recommendation equals:

Direction Family + Level Band + Path Type + Feasibility Envelope.

Job titles are examples only. They help the user understand how a direction may appear in the market, but they are not the taxonomy and should not drive the matching model.

For example, "HR Director," "VP Engineering," "Technology Executive," "AI Transformation Leader," or "Workforce Marketplace Operator" can be useful display language. Internally, each must map to one or more canonical Direction Family IDs with an evidence-backed path type and level band.

## 3. Main Inputs

### CV Profile / Career Evidence

Structured and unstructured evidence from the candidate's CV, profile, work history, titles, employers, industries, achievements, scope, management responsibility, tools, systems, credentials, and transitions.

### Competency Signals

Evidence of functional skill, domain depth, leadership capability, technical ability, analytical ability, operating capability, client-facing ability, commercial ability, or craft depth.

Competency signals must be tied to actual work evidence where possible. Self-description without evidence should be lower-confidence.

### Career Anchors / Motivation

Signals about desired work texture, values, preferred environment, mission orientation, autonomy, stability, income goals, risk appetite, lifestyle needs, geographic preferences, and desired identity.

Anchors should help choose among feasible directions. They should not override missing evidence or credential gates.

### Financial Reality

Evidence about income floor, runway, debt, dependents, savings, risk tolerance, training budget, ability to take a pay cut, and tolerance for variable income.

Financial reality is especially important for founder/operator, independent advisory, credentialed transitions, mission-compensated paths, and bridge-based paths.

### Transition Constraints

Constraints such as geography, remote/hybrid requirements, immigration/work authorization, schedule constraints, caregiving constraints, physical limitations, travel tolerance, timeline urgency, and willingness to retrain.

Constraints can suppress otherwise plausible paths if the required bridge is unrealistic.

### Credential / License Status

Current credentials, expired credentials, licenses, degrees, certifications, jurisdiction-specific eligibility, willingness to credential, credential timeline, and credential cost.

Credential gates override seniority when a field requires a hard or jurisdiction-specific credential.

### AI / Digital Signals

AI/digital evidence should be classified by substance:

- Standalone: AI/digital work is the family substance, such as DX-03 Enterprise AI Enablement.
- Modifier: AI/digital fluency strengthens another family.
- Tooling: tools used in work but not enough to define a direction.
- Aspirational: interest or desired title without substantive evidence.

Generic AI tooling should not create AI strategy, AI governance, data science, or AI enablement recommendations by itself.

### User Preferences And Risk Tolerance

Use preferences and risk tolerance only when actually collected.

Do not invent preferences. Do not fill unasked or missing fields with "not provided" in final report output. If important preference data is missing, the engine may mark confidence lower, name the missing input internally, or request follow-up.

### Source Confidence / Evidence Confidence

The engine should track whether evidence comes from:

- CV facts
- assessment answers
- inferred context
- self-described claims
- external validation, if available
- ambiguous or partial evidence

Confidence should affect recommendation strength and report language.

## 4. Evidence Model

The engine should classify candidate evidence into evidence types.

### Direct Ownership Evidence

Evidence that the candidate owned the work, function, program, team, outcome, client relationship, P&L, roadmap, system, credentialed practice, or operating model required by a family.

Direct ownership evidence is the strongest evidence type.

### Supporting Evidence

Evidence that strengthens a family fit but does not prove the family by itself. Examples include tools, certifications, adjacent domain experience, stakeholder exposure, partial project work, or related achievements.

### Weak / Noisy Evidence

Evidence that sounds relevant but may not transfer. Examples include broad titles, proximity to a function, generic leadership, tool usage, one-off projects, aspirational language, or keyword overlap.

### False-Positive Signal

Evidence that the family library explicitly warns can create mistaken recommendations. False-positive signals should trigger suppression checks.

### Credential Evidence

Licenses, certifications, degrees, clearances, apprenticeships, jurisdiction-specific eligibility, or required training.

Credential evidence can be hard, soft, or jurisdiction-specific depending on the family.

### Domain Evidence

Evidence that the candidate has worked in the target domain, industry, market, population, customer type, or regulated context.

Domain evidence matters when industry context is non-substitutable.

### Scale Evidence

Evidence of team size, revenue, budget, operating complexity, geography, customer volume, transaction volume, systems scale, or organizational altitude.

Scale evidence affects level band translation.

### Recency Evidence

Evidence of how recently the candidate practiced the work. Recency matters especially for technical craft, data, regulated fields, credentials, and fast-moving AI/digital work.

### Market Credibility Evidence

Evidence that the market would believe the candidate in the direction, such as recognized titles, portfolio, shipped work, client history, speaking/writing, references, credentials, prior firm tenure, or domain reputation.

Broad vocabulary is not evidence. Evidence must be tied to ownership, accountability, outcomes, scope, or credential.

## 5. Matching Pipeline

### Stage 1 - Normalize Candidate Evidence

Convert raw candidate material into structured evidence.

Normalize:

- titles
- roles
- industries
- employers
- dates and recency
- scope
- management size
- budget or revenue responsibility
- outcomes
- tools and systems
- credentials
- constraints
- financial reality
- anchors and preferences
- AI/digital signals

The goal is not to keyword-match. The goal is to identify evidence units that can be evaluated against family gates.

### Stage 2 - Generate Candidate Direction Families

Generate a broad initial set of possible families from:

- direct family evidence
- adjacent family evidence
- explicit user interest
- strong domain evidence
- bridgeable experience
- family adjacency lists
- pressure-test guardrails

This stage may be generous, but downstream stages must suppress weak fits.

### Stage 3 - Apply Hard Gates And Credential Gates

Apply credential, license, jurisdiction, physical, legal, or prerequisite gates before ranking.

If a hard gate blocks direct entry:

- suppress the path as a direct recommendation
- classify as Bridge-based only if a realistic credential bridge can be named
- include credential timeline and reset economics if surfaced

Credentialed paths must not inherit seniority from unrelated careers.

### Stage 4 - Evaluate Core Evidence Requirements

For each candidate family, compare evidence against the family's core evidence requirements.

Classify whether the profile has:

- enough core evidence for direct fit
- partial evidence for adjacent fit
- insufficient evidence but a named bridge
- possible fit only under a named condition
- evidence too weak or false-positive-dominated

Family-specific core evidence outweighs title similarity.

### Stage 5 - Apply False-Positive Suppression

Apply the family record's false_positive_signals and the pressure-test guardrails.

Suppress when broad or noisy evidence creates a plausible-sounding but unsupported direction.

Examples:

- HR leadership should not create marketplace or product recommendations.
- CTO title should not create Product Management, Founder, Data Platform, or AI Governance recommendations.
- Platform language should not create Marketplace / Platform Venture Builder without marketplace mechanics.
- AI tooling should not create AI governance or AI strategy recommendations.

### Stage 6 - Classify Path Type

Classify each considered family as:

- Direct
- Adjacent
- Bridge-based
- Conditional
- Suppressed

Each classification must be explainable with evidence.

### Stage 7 - Apply Level Band Translation And Level Reset

Translate native level into honest entry level for the target family.

Use:

- same-family transfer rules
- same-spine adjacency
- cross-spine distance
- credential gates
- market credibility
- recency
- scale
- bridge requirements

The engine must avoid preserving seniority across unrelated families merely because the candidate has a senior title.

### Stage 8 - Apply Financial Feasibility And Transition Constraints

Evaluate whether the recommendation is feasible given:

- income floor
- runway
- pay-cut tolerance
- retraining cost
- credential timeline
- geography
- schedule
- travel
- caregiving constraints
- timeline urgency
- variable-income tolerance

If financial or constraint data is missing, do not invent it. Mark the recommendation as lower-confidence or condition-dependent when feasibility cannot be evaluated.

### Stage 9 - Apply AI / Digital Treatment

Classify AI/digital evidence as Standalone, Modifier, Tooling, or Aspirational.

Apply family-specific AI rules:

- DX-03 requires AI deployment, adoption, workflow integration, and measurable outcomes.
- RC-03 requires privacy, data governance, AI governance, regulatory, risk, policy, or responsible-AI control evidence.
- Tool usage strengthens but does not define most families.
- AI interest without evidence should not create AI recommendations.

### Stage 10 - Rank Recommendations

Rank conceptually using qualitative factors, not a final numeric formula.

Ranking should favor recommendations with:

- strong core evidence
- recent ownership
- clear outcomes
- domain fit
- credible level transfer
- financial feasibility
- credential feasibility
- low bridge cost
- strong motivation/anchor fit
- high market credibility
- clear evidence confidence

### Stage 11 - Create Report Display Labels While Preserving Canonical Family IDs

Generate user-friendly display labels only after canonical family classification is complete.

Display labels may be composite, but internal data must retain:

- canonical family_id
- family name
- path type
- level band
- evidence mapping
- bridge or condition, if applicable
- confidence

A display label cannot replace family classification.

## 6. Suppression Logic

Suppression is a product-quality feature.

The engine should not try to show every imaginable nearby path. A good report is credible because it excludes weak fits.

Suppress when:

- core evidence is missing
- false-positive signals dominate
- credential gate blocks entry and no realistic bridge can be named
- bridge path cannot be named
- condition cannot be named
- evidence is only aspirational
- evidence is only tool usage or keyword overlap
- broad-profile vocabulary creates weak cross-spine fit
- title inflation creates false seniority
- financial or constraint reality makes the path unrealistic and no feasible bridge exists
- user preference conflicts with a path and the preference has actually been collected

Suppressed directions do not need to be shown to the user as recommendations. They can be logged internally with suppression reason for QA, debugging, and future report review.

## 7. Path Type Logic

### Direct

Strong current or recent evidence in the family.

Direct requires:

- core evidence requirements substantially met
- direct ownership or accountability
- level band supported by scope and scale
- no blocking credential gate
- no dominant false-positive signal

### Adjacent

Evidence from a neighboring family or spine with partial transfer and level reset.

Adjacent requires:

- credible overlap in work texture, domain, or family adjacency
- partial but not complete core evidence
- clear explanation of what transfers and what does not
- honest level reset

### Bridge-based

Possible direction, but only through a named bridge step.

Bridge-based requires:

- a specific bridge role, credential, portfolio, client path, training pathway, or experience-building step
- realistic transition time
- clear reset economics
- enough motivation, constraints, and feasibility to make the bridge plausible

No bridge-based path should appear without a named bridge.

### Conditional

Possible only if a specific condition is met.

Conditions may include:

- credential or license completion
- runway
- portfolio
- product ownership confirmation
- advisory pipeline
- willingness to sell
- user preference
- geographic flexibility
- income flexibility
- technical recency

No conditional path should appear without a named condition.

### Suppressed

Not shown to the user as a recommendation, but reason can be logged internally.

Suppressed applies when evidence is too weak, false-positive-dominated, blocked by gates, aspirational only, financially unrealistic, or impossible to classify with a named bridge or condition.

## 8. Level Band Translation

The engine must distinguish native level from target entry level.

Native level is the candidate's likely level in their current or proven family.

Entry level is the honest recommended level in the target direction family.

Rules:

- Same family: native level may transfer when evidence is current and comparable in scale.
- Same spine, different family: possible 0-1 band reset depending on evidence overlap and family-specific requirements.
- Adjacent spine: usually 1-2 band reset because work texture and market credibility partially transfer but do not fully substitute.
- Far spine: usually 2-3 band reset or suppression unless there is strong bridge evidence.
- Credentialed path: credential gate overrides seniority; a senior executive without required license enters through the credential pathway.
- CTO / Founder / VP titles do not automatically transfer seniority across families.
- Founder/operator experience does not automatically transfer into product, operations, marketplace, or consulting seniority unless family-specific evidence exists.
- Advisory potential does not equal advisory readiness.
- Tool fluency does not equal functional seniority.

Level translation should be visible in the report rationale whenever there is a reset.

## 9. Guardrails From Pressure Tests

### Senior HR / People Profiles

Implementation guardrails:

- Surface HR/People families where evidence supports them.
- Preserve seniority inside PO-01 and PO-02 when HR leadership and HRBP evidence are strong.
- Surface PO-03, PO-04, PO-05, WI-01, MP-05, IP-01, or SA-04 only when their evidence gates are met.
- Suppress marketplace, product, operations, marketing, customer operations, and founder paths unless evidence is strong.
- Do not let composite HR labels hide canonical family IDs.

### Broad Hybrid Profiles

Implementation guardrails:

- Prevent over-crediting across too many families.
- Preserve strong native evidence.
- Require family-specific ownership evidence before surfacing weak product, engineering, marketing, sales, operations, consulting, or founder paths.
- Apply explicit level resets for adjacent and bridge-based paths.
- Treat broad vocabulary as a prompt for evaluation, not as evidence.

### Marketplace / Platform

Implementation guardrails:

- Distinguish marketplace participation, marketplace exposure, marketplace operating leadership, and marketplace venture building.
- Surface FB-03 only for real marketplace builders or operators.
- Do not treat "platform" as marketplace evidence by itself.
- Require supply/demand, matching, network effects, marketplace economics, seller/contractor ecosystems, or venture-building evidence.

### Founder / Operator

Implementation guardrails:

- Require real operating evidence, not entrepreneurial language.
- Look for market thesis, client/customer acquisition, revenue/GMV/customer scale, team/co-founder context, venture-building proof, service-business proof, runway, or risk tolerance.
- Distinguish FB-01, FB-02, FB-03, and FB-04 by business model.

### CTO / IT

Implementation guardrails:

- Prevent CTO title inflation.
- Separate IT-01, PT-02, IT-03, IT-04, DX-01, DX-02, and DX-03.
- Route internal technology backbone, IT services, infrastructure, business systems, cybersecurity, vendors, and enterprise operations to IT families.
- Route engineering teams, software/platform delivery, architecture, technical standards, and delivery accountability to PT-02.
- Route cloud, infrastructure, DevOps, reliability, monitoring, CI/CD, Kubernetes, and data centers to IT-03.
- Route CRM, ERP, enterprise apps, integrations, and business systems to IT-04.
- Route transformation, adoption, process redesign, and measurable business outcomes to DX-01 or DX-02.
- Route AI deployment and business adoption to DX-03.
- Suppress Product Management unless product ownership is explicit.

### AI

Implementation guardrails:

- Separate AI deployment from AI governance.
- Generic AI tools are tooling, not standalone evidence.
- AI deployment evidence maps to DX-03 when there are real deployments, adoption, workflow integration, and outcomes.
- AI governance maps to RC-03 only with governance, privacy, policy, regulatory, risk, data governance, or responsible-AI control evidence.
- AI interest or desired AI title should not create recommendations by itself.

### Data

Implementation guardrails:

- Data-stack vocabulary is not enough for PT-05.
- Require data platform ownership, pipeline architecture ownership, data engineering function ownership, or substantive data engineering depth.
- Route cloud/infrastructure evidence to IT-03 when data-platform ownership is absent.
- Route engineering organization leadership to PT-02 when data evidence is supporting rather than primary.

### Consulting / Advisory

Implementation guardrails:

- Separate advisory potential from actual consulting delivery and solo practice readiness.
- SA-02 requires consulting firm or comparable client-engagement evidence.
- SA-04 requires transformation advisory evidence or a named bridge from in-house transformation.
- IP-01 requires offer, pipeline, runway, business-development appetite, and credible expertise.
- IP-02 requires firm-building evidence, team or multi-client model, and repeatable methodology.

## 10. Canonical Family ID And Display Label Logic

Every internal recommendation must store canonical family_id.

Display labels can be user-friendly composites. They may combine evidence across families for readability, but they cannot replace family classification.

Internal recommendation records should preserve:

- canonical family_id
- canonical family name
- display label
- primary family vs supporting family status
- path type
- level band
- evidence mapping
- bridge or condition, if applicable
- suppression reason, if suppressed internally
- confidence level

Rules:

- Every displayed recommendation must have evidence-backed family mapping.
- A display label cannot exist without at least one canonical family_id.
- Composite display labels must retain primary and supporting family IDs.
- Report QA should reject untraceable recommendations.
- Job titles should be stored as examples, not as the recommendation object itself.

## 11. Ranking Logic - Conceptual Only

This version does not define numeric formulas.

Conceptual ranking factors:

- core evidence strength
- evidence recency
- ownership level
- domain fit
- motivation/anchor fit
- financial feasibility
- credential feasibility
- transition cost
- AI durability
- market credibility
- confidence level
- clarity of bridge or condition
- suppression risk
- level reset severity
- source confidence

Higher-ranked recommendations should generally have stronger core evidence, fewer unresolved gates, more realistic level translation, better financial feasibility, and clearer market credibility.

Ranking should not simply reward keyword density, title seniority, or number of adjacent signals.

## 12. Output Requirements

Each recommended direction should include:

- canonical family_id
- canonical family name
- display label
- path type
- level band
- fit rationale
- main evidence
- main risk
- bridge or condition, if applicable
- financial reality note
- AI durability note
- next validation step
- confidence level

Output should also preserve internally, even if not fully displayed:

- evidence source
- evidence confidence
- suppression checks applied
- credential gate status
- level reset rationale
- display-label mapping

## 13. Report QA Rules

Report QA rules:

- no recommendation without canonical family ID
- no bridge-based path without named bridge
- no conditional path without named condition
- no credentialed path without credential check
- no display-only composite recommendation
- no "not provided" fields for questions not asked
- no weak nearby trajectories without evidence
- no Product Management recommendation from delivery language alone
- no AI governance recommendation from AI deployment or AI tooling alone
- no marketplace recommendation from platform language alone
- no founder recommendation from entrepreneurial language alone
- no seniority transfer across families without level translation
- no recommendation that fails financial or credential feasibility without naming the blocker

## 14. Non-Goals For v1

This v1 specification does not include:

- code implementation
- JavaScript implementation
- final numeric scoring formula
- automated labor-market data integration
- job-title matching as primary mechanism
- resume keyword matching as the core model
- final report copy
- database schema
- API contract
- production ranking weights
- automated suppression thresholds

The v1 goal is to define product logic clearly enough to support a future implementation-ready design document.

## 15. Open Questions Before Implementation

Open items:

- how many primary directions to show
- how many adjacent / nearby directions to show
- whether suppressed directions are logged only internally or partially surfaced
- how to represent confidence
- how to handle missing financial / anchor / credential data
- how to version family logic over time
- how to handle candidate-stated interests that conflict with evidence
- how to handle report personalization without inventing uncollected preferences
- how much evidence detail to expose to the user vs retain internally
- how to handle ties between closely adjacent families
- how to audit recommendations across pressure-test profiles
- how to update logic when family records change in future library versions

Next step:
Review this spec, then create an implementation-ready matching engine design document before changing code.
