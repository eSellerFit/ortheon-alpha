# Ortheon Matching Engine Implementation Design v1

Sources:

- `docs/ortheon/ortheon-direction-family-library-v10-final-candidate.md`
- `docs/ortheon/matching-engine-logic-spec-v1.md`
- `docs/ortheon/pressure-tests/pressure-test-implementation-guardrails-v1.md`

Scope: implementation-ready design only. This document prepares future implementation but does not create code, scoring logic, database migrations, UI changes, or report presentation changes.

## 1. Purpose and Scope

This document translates the Matching Engine Logic Specification into an implementation-ready design for the future Ortheon matching engine.

It defines the conceptual internal objects, evaluation flow, result states, suppression reasons, level-band translation design, canonical ID requirements, and report QA layer needed before app code is changed.

This is still not code. It intentionally avoids JavaScript, numeric scoring formulas, database schema, UI copy, API contracts, and production ranking weights. Its purpose is to make the future implementation small, testable, and auditable before any report presentation changes are made.

The future engine should:

- normalize candidate evidence
- evaluate each relevant Direction Family
- classify the path type
- suppress weak or false-positive fits
- translate native level to target entry level
- preserve canonical family IDs internally
- create display recommendations only after evidence-backed family classification
- run report QA before anything is shown to the user

## 2. Core Internal Objects

### CandidateProfile

The normalized candidate record used by the matching engine. It combines CV evidence, assessment answers, preferences, constraints, financial reality, credentials, AI/digital signals, evidence confidence, and missing inputs.

### EvidenceSignal

A structured evidence unit extracted from candidate materials. Each signal should describe what evidence exists, where it came from, how strong it is, how recent it is, whether it shows ownership, and which family IDs it may relate to.

### FamilyEvaluation

The engine's evaluation of one Direction Family against the CandidateProfile. It should include core evidence status, supporting evidence, false-positive signals, credential gates, bridge/condition availability, level translation, feasibility, AI/digital treatment, and final classification.

### PathClassification

The internal path result for a family: Direct, Adjacent, Bridge-based, Conditional, or Suppressed.

### LevelBandResult

The native-level and target-entry-level translation result for a family. It should explain whether seniority transfers, resets, or is blocked by credential or market credibility requirements.

### SuppressionReason

The explicit reason a family is not shown as a recommendation. Suppression is expected behavior, not an error.

### RecommendationCandidate

A family that survived evaluation strongly enough to be considered for display. It is still internal and may be ranked, merged into a composite display label, or held back by QA.

### DisplayRecommendation

The user-facing recommendation object. It may use a friendly label, but it must preserve canonical family mapping, path type, level band, rationale, risks, bridge/condition, and confidence internally.

### ReportQAResult

The final QA result for recommendations before report rendering. It should flag missing family IDs, missing bridges, missing conditions, missing credential checks, weak nearby trajectories, and untraceable composite labels.

## 3. CandidateProfile Structure

CandidateProfile should include:

- `cvProfile`: normalized career history, roles, titles, industries, employers, dates, achievements, scope, tools, systems, credentials, and transitions.
- `competencySignals`: structured signals about functional skill, domain depth, leadership capability, technical ability, analytical ability, operating capability, client-facing ability, commercial ability, and craft depth.
- `careerAnchors`: collected motivation and preference signals such as desired work texture, values, autonomy, mission orientation, stability, identity, lifestyle, geography, and risk appetite.
- `financialReality`: income floor, runway, debt/dependents if collected, pay-cut tolerance, training budget, variable-income tolerance, and financial constraints.
- `transitionConstraints`: geography, remote/hybrid needs, work authorization, schedule, caregiving, physical constraints, travel tolerance, timeline urgency, and retraining willingness.
- `credentialStatus`: current credentials, licenses, degrees, certifications, clearances, expired credentials, jurisdiction status, credential willingness, likely timeline, and cost.
- `aiDigitalSignals`: AI/digital evidence classified as Standalone, Modifier, Tooling, or Aspirational.
- `sourceConfidence`: confidence by source type, such as CV fact, assessment answer, inferred context, self-description, external validation, or ambiguous evidence.
- `missingInputs`: important inputs not collected or not inferable, such as financial reality, credential status, anchor preferences, risk tolerance, or geographic constraints.

Design note:

- Missing inputs should be stored explicitly for internal use.
- Missing inputs should not produce user-facing "not provided" fields for questions that were not asked.
- Missing critical inputs may lower confidence, create Conditional classification, or trigger a future follow-up prompt.

## 4. EvidenceSignal Structure

EvidenceSignal should include:

- `signalType`: direct ownership, supporting, weak/noisy, false-positive, credential, domain, scale, recency, market credibility, AI/digital, financial, constraint, preference.
- `source`: CV, assessment answer, inferred context, self-description, external validation, system-derived normalization, or manual QA note.
- `strength`: qualitative strength such as strong, moderate, weak, ambiguous, or conflicting.
- `recency`: current, recent, dated, stale, unknown, or not applicable.
- `ownershipLevel`: owned, led, managed, contributed, supported, observed, used, participated, aspirational, or unknown.
- `domain`: relevant industry, function, market, population, customer type, regulated context, or operating context.
- `scale`: team size, budget, revenue, customer volume, transaction volume, systems scale, geography, enterprise size, or scope.
- `confidence`: high, medium, low, inferred, or needs validation.
- `relatedFamilyIds`: one or more possible Direction Family IDs the signal may support or falsely trigger.
- `falsePositiveRisk`: none, low, medium, high, or specific named false-positive risk.

Design note:

- Broad vocabulary is not evidence unless tied to ownership, accountability, outcomes, scope, or credential.
- EvidenceSignal should distinguish "worked near" from "owned."
- A single EvidenceSignal can support one family while creating false-positive risk for another.

## 5. FamilyEvaluation Flow

For each relevant family, the engine should create a FamilyEvaluation.

Evaluation steps:

1. Identify family record.
   - Use canonical family_id, family name, spine, core evidence requirements, supporting evidence, false-positive signals, level bands, direct/adjacent/bridge conditions, credential gate, AI/digital treatment, and adjacent/bridge families.

2. Gather related evidence.
   - Attach EvidenceSignals that directly support, weakly support, or falsely trigger the family.

3. Evaluate core evidence met.
   - Determine whether the candidate meets the family-specific core evidence requirements through ownership, accountability, outcomes, scope, credential, or market credibility.

4. Evaluate supporting evidence.
   - Identify supporting evidence that strengthens the case but does not prove the family by itself.

5. Evaluate false-positive signals.
   - Check whether noisy vocabulary, title inflation, generic leadership, proximity, tool usage, aspiration, or weak cross-spine evidence is dominating the match.

6. Evaluate credential gate.
   - Identify whether the family has hard, soft, jurisdiction-specific, or no credential gate.
   - If blocked, determine whether a credential bridge can be named.

7. Evaluate bridge availability.
   - If direct or adjacent evidence is insufficient, identify a named bridge such as credential pathway, portfolio, junior role, intermediate function, advisory project, product ownership, marketplace operating role, or technical recency-building.

8. Evaluate condition availability.
   - If the family is possible only under a condition, name the condition clearly.
   - Conditions may include runway, credential, portfolio, advisory pipeline, product ownership confirmation, user preference, geography, income flexibility, or technical recency.

9. Evaluate level translation.
   - Compare native level to target entry level.
   - Apply same-family, same-spine, adjacent-spine, far-spine, credential, recency, scale, and market credibility rules.

10. Evaluate financial feasibility.
   - Check income floor, runway, pay-cut tolerance, retraining cost, credential time, variable-income tolerance, and constraints when collected.
   - If missing, lower confidence or mark condition-dependent rather than inventing data.

11. Evaluate AI/digital treatment.
   - Classify AI/digital evidence as Standalone, Modifier, Tooling, or Aspirational for this family.
   - Apply DX-03 vs RC-03, tooling vs evidence, and AI-interest suppression rules.

12. Assign final classification.
   - Classify as Direct, Adjacent, Bridge-based, Conditional, or Suppressed.
   - Store rationale and suppression reason if applicable.

## 6. Path Classification Design

### Direct

Internal result state for families where strong current or recent evidence meets core family requirements.

Direct should require:

- core evidence substantially met
- direct ownership or accountability
- no blocking credential gate
- level band supported by scope and scale
- no dominant false-positive signal

### Adjacent

Internal result state for families with credible transfer from a neighboring family or spine.

Adjacent should require:

- partial core evidence
- strong family adjacency or work-texture overlap
- named transfer logic
- honest level reset
- manageable missing evidence

### Bridge-based

Internal result state for possible directions that require a named bridge before entry.

Bridge-based should require:

- named bridge step
- plausible timeline
- realistic reset economics
- enough evidence or motivation to make the bridge plausible
- no hard blocker that makes the bridge impossible

### Conditional

Internal result state for possible directions that depend on a named condition.

Conditional should require:

- named condition
- clear reason the condition matters
- outcome if condition is met
- outcome if condition is not met

### Suppressed

Internal result state for families not eligible to display as recommendations.

Suppressed should be used when evidence is missing, false-positive-dominated, aspirational only, blocked by credential/financial/constraint reality, impossible to bridge, or too weak to present credibly.

## 7. Suppression Design

Suppression reasons should be explicit and auditable.

Recommended SuppressionReason values:

- `missing_core_evidence`: family-specific core evidence is not present.
- `false_positive_dominated`: false-positive signals outweigh support.
- `credential_gate_blocked`: required credential/license is missing and no direct entry is possible.
- `bridge_not_named`: possible only through a bridge, but no realistic bridge can be named.
- `condition_not_named`: possible only conditionally, but condition is vague or unavailable.
- `aspirational_only`: evidence is interest, desired title, or self-description without substantive proof.
- `weak_cross_spine_fit`: adjacent/far-spine fit is too weak to recommend.
- `title_inflation`: senior title creates apparent fit without family-specific ownership evidence.
- `financial_infeasible`: financial reality blocks the path and no viable bridge exists.
- `missing_critical_input`: a critical input required for feasibility is missing.

Suppression should be logged internally with:

- family_id
- family name
- triggering evidence
- suppression reason
- supporting notes
- whether future evidence could reopen the family

Suppressed directions should not be shown as user-facing recommendations unless a future product decision creates a separate "not recommended because..." feature.

## 8. Level Band Translation Design

Native level and target entry level should be stored separately.

LevelBandResult should include:

- `nativeLevelBand`: candidate's level in current/proven family.
- `targetEntryLevelBand`: recommended entry level in evaluated family.
- `levelReset`: none, 0-1 band, 1-2 bands, 2-3 bands, credential reset, suppressed.
- `levelResetReason`: same family, same spine, adjacent spine, far spine, credential gate, recency gap, scale mismatch, market credibility gap, title inflation, or missing evidence.
- `scaleEvidence`: team, budget, revenue, systems, geography, customer, or organizational scope supporting the level.
- `recencyEvidence`: current, recent, dated, stale, or unknown.
- `credentialOverride`: whether credential gate overrides seniority.
- `confidence`: confidence in the level translation.

Design rules:

- Same family may preserve native level if evidence is current and comparable.
- Same spine, different family may apply a 0-1 band reset.
- Adjacent spine usually applies a 1-2 band reset.
- Far spine usually applies a 2-3 band reset or suppression.
- Credentialed paths override prior seniority.
- CTO, Founder, VP, Director, Advisor, and Chief titles do not automatically transfer seniority across families.

## 9. Canonical Family ID vs Display Label

Every recommendation must preserve canonical family classification internally.

RecommendationCandidate should include:

- `familyId`: canonical family_id from the library.
- `familyName`: canonical direction family name.
- `spine`: canonical spine.
- `displayLabel`: user-facing label generated after family evaluation.
- `primaryFamilyId`: primary canonical family_id.
- `supportingFamilyIds`: secondary family IDs when display label is composite.
- `pathType`: Direct, Adjacent, Bridge-based, Conditional, or Suppressed.
- `evidenceMapping`: evidence signals supporting the recommendation.
- `levelBandResult`: native and target entry level translation.
- `bridge`: named bridge if Bridge-based.
- `condition`: named condition if Conditional.
- `suppressionReason`: reason if Suppressed internally.
- `confidence`: confidence level.

DisplayRecommendation should include user-facing language, but it must remain traceable to RecommendationCandidate.

Rules:

- Display label cannot replace family classification.
- Display label cannot exist without a canonical family_id.
- Composite labels must retain primary/supporting family mapping.
- Job titles are examples, not recommendation objects.
- Report QA should reject recommendations that cannot be traced to evidence-backed family IDs.

## 10. Report QA Layer

ReportQAResult should run before report rendering.

QA checks:

- no recommendation without family ID
- no bridge-based path without named bridge
- no conditional path without named condition
- no credentialed path without credential check
- no "not provided" fields for questions not asked
- no weak nearby trajectories without evidence
- no display-only composite recommendation
- no Product Management recommendation from delivery language alone
- no AI governance recommendation from AI deployment or AI tooling alone
- no marketplace recommendation from platform language alone
- no founder recommendation from entrepreneurial language alone
- no seniority transfer across families without level translation

ReportQAResult should include:

- `passed`: yes/no
- `blockingIssues`: issues that must be fixed before display
- `warnings`: issues that lower confidence but may not block display
- `recommendationIdsAffected`: internal IDs for affected recommendations
- `requiredFix`: what must be corrected
- `qaNotes`: human-readable explanation for QA review

QA should be treated as part of product quality, not a separate afterthought.

## 11. Implementation Guardrails

Future implementation must preserve the pressure-test guardrails.

### Broad-profile over-crediting

Broad profiles should not be treated as senior in every adjacent family. Require family-specific ownership evidence, apply level resets, and suppress weak cross-spine fits.

### CTO title inflation

CTO title should not automatically create Enterprise CIO/CTO, VP Engineering, Product Leader, Technical Founder, AI Leader, Data Platform Leader, and Transformation Advisor recommendations at once.

### Marketplace evidence typing

Distinguish marketplace participation, marketplace exposure, marketplace operating leadership, and marketplace venture building. Do not treat "platform" as marketplace evidence by itself.

### Founder/operator gates

Founder paths require real operating evidence: market thesis, customer/client acquisition, revenue or GMV, team/co-founder context, runway, ownership, venture-building proof, or service-business proof.

### AI deployment vs AI governance

AI deployment maps to DX-03 when there are deployments, adoption, workflow integration, and outcomes. AI governance maps to RC-03 only with governance, privacy, policy, regulatory, risk, data governance, or responsible-AI control evidence.

### Product delivery vs Product Management

Delivery of products, platforms, MVPs, or applications does not equal PT-01 Product Management. Require roadmap, customer discovery, prioritization authority, product strategy, and commercial product accountability.

### Data-stack vocabulary vs data platform ownership

Kafka, Airflow, databases, ML stacks, RTB systems, analytics-heavy platforms, and data-driven language should not create PT-05 by themselves. Require data platform ownership, pipeline architecture ownership, or data engineering function ownership.

## 12. Non-Goals

This document does not include:

- code
- JavaScript
- final numeric formula
- scoring code
- database migration
- UI changes
- report copy changes
- API contract
- production ranking weights
- automated labor-market integration
- edits to the Direction Family Library
- edits to pressure-test files

## 13. Next Step After This Document

After review, the next step is a small implementation bundle that introduces internal recommendation objects and QA checks before changing report presentation.
