# Ortheon MVP Cut v3.1 — User-Facing Report Architecture

**Status:** Spec only — no UI changes have been made.
**Author:** Bundle 18A
**Date:** 2026-05-25

---

## 1. Product Positioning

The v3.1 report is not a ranked list of job titles with scores attached. It is a career decision report — a small, structured, evidence-grounded set of directions that explains what is realistically possible now, what requires a bridge, what is worth exploring but not ready to pursue, and what is not recommended and why.

The report answers five questions a thoughtful person would actually ask after doing a serious self-assessment:

1. What can I credibly move toward right now, given where I am?
2. What would take me longer, and what would the bridge look like?
3. What am I not ready for, and why?
4. What evidence is this based on?
5. What should I do in the next 30 days?

The distinction between "credible now" and "bridge required" is the central organizing logic — not a score, not a rank, not a fit band. Status badges replace numeric scores as the primary signal. Every direction comes with a first validation step, not a generic recommendation.

The report should feel like a considered opinion from a thoughtful advisor who actually read the person's profile, not a system output.

---

## 2. Design Principle

### Borrow from the old report's rhythm — do not bring back its logic

The legacy Career Direction Report has useful visual rhythms: page-based structure, brand strip, direction list with order indicators, Key Signals block, per-direction deep dive pages. These rhythms can carry over.

What must not carry over:

- **Score-first ordering.** The legacy report leads with "Score 100 · Strong Fit." The v3.1 report leads with status and reasoning. No numeric score is shown.
- **Fit band as a headline.** "Strong Fit" is not an honest signal when it is derived from keyword matching. The v3.1 report uses `recommendationType` (primary / secondary / bridge / exploratory / not_recommended) and `confidence` (high / medium / low / insufficient_data) as the primary labels.
- **Templated narrative.** The legacy PDF generates text like "Profile signals show marketplace, platform, or ecosystem operating experience" from a `mapCluster` string lookup. v3.1 generates personalized evidence from `whyItFits[]`, `whyItIsCredible[]`, `whatMakesItRisky[]` via Claude. The report should expose this personalized text, not generic replacements.
- **Income as a headline.** The legacy PDF shows `formatUsd(avg12month) est. year 1` next to direction rank. v3.1 does not generate income estimates at this stage. If income data appears in future, it must be clearly sourced and caveated — never shown as a confident headline.
- **AI durability rating as a prominent badge.** D0–D4 durability ratings are a legacy concept. v3.1 does not output an AI durability rating. If durability is relevant in future, it must be reframed and evidence-backed.
- **Pretending adjacent paths are equally recommended.** The legacy report shows adjacent directions with a "Nearby" badge that looks equivalent to primary paths. v3.1 distinguishes `exploratory` and `not_recommended` explicitly and explains each.

### Core principles

- **Honest over optimistic.** If the evidence is weak, say so. If confidence is medium, show medium.
- **Explainable over impressive.** Directions must come with reasoning that a person can evaluate. Not a score they have to accept.
- **Actionable over comprehensive.** The report should end with concrete next steps derived from `firstValidationStep` fields, not generic advice.
- **Status-first, not score-first.** The first thing a person sees about a direction is its status (credible now / bridge required / exploratory) and confidence, not a number.

---

## 3. Recommended Report Structure

The report is organized into eight sections. Sections A–C form the overview layer. Sections D–F are the direction deep dives. Sections G–H are the action and caveat layer.

---

### A. Cover / Executive Summary

**Purpose:** Give the person a confident, calibrated first read of their situation.

**Content:**

| Field | Source | Notes |
|-------|--------|-------|
| Headline | `finalPortfolio.userFacingNarrative.headline` | Large type. One sentence. |
| Summary paragraph | `finalPortfolio.userFacingNarrative.summary` | 2–4 sentences. Honest about what is and is not possible. |
| Recommended strategy | `finalPortfolio.portfolioSummary.recommendedStrategy` | 1–2 sentences. What is the smartest overall move. |
| Main tension | `finalPortfolio.portfolioSummary.mainTension` | What the person is navigating. |
| Direction count | `vm.metrics.finalDirectionCount` | "3 directions assessed" — neutral framing. |
| Status mix | Derived from `directions[].recommendationType` | e.g. "1 credible now · 1 bridge required · 1 exploratory" |

**What not to show here:**
- Total score, rank, fit band
- Income estimates
- API cost
- Raw direction IDs

---

### B. Direction Portfolio Overview

**Purpose:** A compact, scannable list of all final directions. One row per direction. No deep dive here — just enough to orient the person.

**Content per row:**

| Field | Source |
|-------|--------|
| Display order | `direction.displayOrder` — shown as an order indicator (#1, #2, #3), not a rank or score |
| Label | `direction.label` |
| Recommendation type badge | `direction.recommendationType` — primary / secondary / bridge / exploratory / not_recommended |
| Confidence badge | `direction.confidence` — high / medium / low / insufficient_data |
| Route type | `direction.routeType` — e.g. "direct", "fractional", "consulting" |
| Work model | `direction.workModel` — e.g. "employed", "independent", "hybrid" |
| Current realism status | Derived from `direction.recommendationType` — "Credible now" / "Bridge required" / "Exploratory" / "Not now" |
| First validation step | `direction.firstValidationStep` — shown in compact form |

**What not to show here:**
- Numeric scores
- Ranking language ("top match", "best fit", "highest scoring")
- Income estimates
- Full deep-dive narrative (that belongs in sections D–F)

---

### C. Key Signals — What Drove This Result

**Purpose:** Show the person what evidence their result is based on. Replace the legacy "Key Signals" block (mainPattern, transitionStyle, bridgeGoal, mainCaution) with v3.1 evidence signals that are honest about what is known and what is missing.

**Content:**

| Signal | Source |
|--------|--------|
| Career capital / strongest transferable assets | `synthesizedProfile.careerCapital` fields (summarized at display layer) — or from `portfolioSummary.overallInterpretation` |
| Financial reality | `transitionContext.financialPressure` (from profile synthesizer, if surfaced in portfolio) |
| Hard constraints | `guardrailSummary` — passed/caution/bridge_required flags |
| Credibility signals used | `direction.whyItIsCredible[]` — cross-direction roll-up |
| Missing evidence affecting confidence | `finalPortfolio.missingInputsAffectingConfidence[]` |
| Guardrails fired | `guardrailSummary.guardrailStatuses[]` — translated into plain language (not raw status strings) |
| Caveats | `finalPortfolio.userFacingNarrative.caveats[]` |

**What not to show here:**
- Raw guardrail status strings (e.g. "bridge_required" as a raw field label)
- `canShowAsCredibleNow` boolean values as raw output
- API cost, call count, pipeline diagnostics
- Quality notes (internal only — see Section 5)
- Raw JSON

**Translation guidance:**
- `guardrailStatus: "caution"` → "Proceed with caution — this direction has credibility or financial considerations to resolve."
- `guardrailStatus: "bridge_required"` → "This direction requires bridging work before it is a direct move."
- `canShowAsCredibleNow: false` → "Not ready to pursue directly — see bridge strategy."

---

### D. Primary Direction Deep Dive

**Purpose:** A full-page treatment of the highest-confidence / most credible direction (typically `displayOrder: 1` where `recommendationType` is "primary" or "secondary").

**Content:**

| Block | Source | Notes |
|-------|--------|-------|
| Direction title | `direction.label` | Large, clear |
| Status + confidence badges | `direction.recommendationType`, `direction.confidence` | Replace score |
| Arena and route | `direction.directionArena`, `direction.routeType`, `direction.workModel` | Context line |
| What this direction means | Derived from `direction.directionArena` + narrative context | Not raw field dump |
| Why it fits | `direction.whyItFits[]` | Bulleted list — personalized evidence |
| Why it is credible | `direction.whyItIsCredible[]` | Bulleted list |
| What makes it risky | `direction.whatMakesItRisky[]` | Honest, not alarming |
| Constraints and warnings | `direction.constraintsAndWarnings[]` | Surfaced clearly |
| First validation step | `direction.firstValidationStep` | Highlighted box — concrete, specific |
| What would make it stronger | From `qualityNotes[]` if direction-relevant, or from `missingInputsAffectingConfidence[]` | "What evidence would raise confidence" framing |
| Not recommended if | `direction.notRecommendedIf[]` | Important honesty signal |

**What not to show here:**
- Score
- Income estimate (unless sourced and caveated)
- Direction ID as user-facing text
- Bridge strategy (that belongs in Section E)

---

### E. Bridge / Secondary Direction Deep Dives

**Purpose:** Full treatment of directions where `recommendationType` is "bridge" or "secondary." These are interesting and achievable but require work before they become primary paths.

**Content:**

| Block | Source | Notes |
|-------|--------|-------|
| Direction title + status | `direction.label`, `direction.recommendationType` | "Bridge required" badge |
| Why it is interesting | `direction.whyItFits[]` | What the person has that makes this worth considering |
| Why it is not primary now | `direction.whatMakesItRisky[]` + `direction.constraintsAndWarnings[]` | Honest framing |
| Bridge strategy | `direction.bridgeStrategy` | Highlighted box — what the path to this direction looks like |
| Financial or credibility constraints | `direction.constraintsAndWarnings[]` — filtered for finance/credibility themes | Surfaced clearly |
| First validation step | `direction.firstValidationStep` | Concrete action |
| Not recommended if | `direction.notRecommendedIf[]` | Conditions that would disqualify this path |

**Framing guidance:**
- "Bridge required" should not feel like a rejection. It means "this is real, but requires deliberate intermediate steps."
- Show the bridge strategy prominently — it is the most useful information for someone at this stage.
- Do not show the bridge direction as equivalent to the primary. The visual hierarchy should reflect the difference.

---

### F. Exploratory / Not-Now Directions

**Purpose:** Show rejected or exploratory directions respectfully. A "not now" is not a permanent rejection — it reflects current evidence and constraints. The person should understand what would change the decision.

**Content:**

| Block | Source | Notes |
|-------|--------|-------|
| Direction label | `direction.label` or `rejectedDirection.label` | |
| Why not now | `direction.reasonRejected` or `direction.constraintsAndWarnings[]` | Honest but not harsh |
| Supporting concerns | `rejectedDirection.supportingConcerns[]` | Brief |
| What would change this | From `missingInputsAffectingConfidence[]` or `qualityNotes[]` if relevant | "If X were present, this would be revisited" framing |

**Framing guidance:**
- Do not make users feel "rejected" by a system. Frame as "not the right moment, based on current evidence."
- If a direction is exploratory (present in `directions[]` with `recommendationType: "exploratory"`), show it as a genuine future possibility, not a consolation prize.
- If a direction is in `rejectedDirections[]`, show it only if the person asked about it or it is a natural expectation based on their background. Do not surface every rejected direction.

**Volume guidance:**
- Show all exploratory directions from `directions[]` where `recommendationType: "exploratory"` or `"not_recommended"`.
- Show `rejectedDirections[]` selectively — 1–3 maximum. If there are many, collapse and offer "see full list" interaction.

---

### G. Validation Plan — Next 30 Days

**Purpose:** End the report with 3–5 concrete, personalized actions derived directly from `firstValidationStep` fields and `nextStepAdvice`. No generic career advice.

**Content:**

| Item | Source | Notes |
|------|--------|-------|
| Primary direction next step | `directions[0].firstValidationStep` | Concrete and specific |
| Bridge direction next step | Bridge direction's `firstValidationStep` | If present |
| Exploratory step | Exploratory direction's `firstValidationStep` | If relevant |
| General next step advice | `finalPortfolio.userFacingNarrative.nextStepAdvice` | Closing framing |

**Rules:**
- Every action item must be sourced from a `firstValidationStep` or `nextStepAdvice` field — no generic filler.
- Actions must be evidence-building or market-validation oriented: "Arrange two conversations with people in X role," "Draft a positioning statement for Y," "Research bridge credential options for Z."
- Do not say "Update your LinkedIn" or "Revise your resume" unless the `firstValidationStep` specifically says so.
- Limit to 5 items. If `firstValidationStep` fields are missing or empty, show fewer items rather than filling with generic advice.

---

### H. Caveats / Confidence Notes

**Purpose:** Be transparent about what the system does not know, what assumptions it made, and what the person can do to improve future accuracy.

**Content:**

| Item | Source | Notes |
|------|--------|-------|
| Missing evidence | `finalPortfolio.missingInputsAffectingConfidence[]` | "Your result would be more precise if..." framing |
| Confidence limitations | `finalPortfolio.userFacingNarrative.caveats[]` | Already written by portfolio composer |
| Financial assumption notes | From `guardrailSummary` or `constraintsAndWarnings[]` | e.g. "Financial realism assessment was based on stated income requirements" |
| Credential assumptions | From `qualityNotes[]` if credential-relevant | e.g. "No credential data was present — directions requiring specific credentials were flagged accordingly" |
| Correction pathway | UX guidance | "You can correct missing information by re-submitting your assessment with updated inputs" — not in v3.1 data, added as static UX copy |

---

## 4. Mapping From v31Result Data

The user-facing report should be built from a **clean report view model** derived from the `v31Result` view model — not directly from raw `v31Result`. The view model built by `buildV31ResultViewModelV31` is the correct starting point.

### Primary field mapping

| Report element | v31Result / view model field |
|----------------|------------------------------|
| Headline | `finalPortfolio.userFacingNarrative.headline` → `vm.summary.headline` |
| Summary paragraph | `finalPortfolio.userFacingNarrative.summary` → `vm.summary.summary` |
| Recommended strategy | `finalPortfolio.portfolioSummary.recommendedStrategy` → `vm.summary.recommendedStrategy` |
| Main tension | `finalPortfolio.portfolioSummary.mainTension` → `vm.summary.mainTension` |
| Direction list | `finalPortfolio.directions[]` → `vm.directions[]` (sorted by `displayOrder`) |
| Rejected directions | `finalPortfolio.rejectedDirections[]` → `vm.rejectedDirections[]` |
| Caveats | `finalPortfolio.userFacingNarrative.caveats[]` → `vm.caveats[]` |
| Quality notes | `finalPortfolio.qualityNotes[]` → `vm.qualityNotes[]` — **internal only, not user-facing** |
| Guardrail summary | `v31Result.guardrailSummary` → `vm.guardrails` — translate to plain language before showing |
| Missing inputs | `finalPortfolio.missingInputsAffectingConfidence[]` — not yet surfaced in view model builder; add to report view model |
| Next step advice | `finalPortfolio.userFacingNarrative.nextStepAdvice` — not yet surfaced in view model builder; add to report view model |
| Portfolio logic | `finalPortfolio.portfolioSummary.portfolioLogic[]` — not yet surfaced; add to report view model if needed |
| Warnings | `v31Result.warnings[]` → `vm.warnings[]` — translate or hide |
| Pipeline errors | `v31Result.errors[]` → `vm.errors[]` — never show raw errors to users |
| API cost | `v31Result.apiUsageSummary` → `vm.metrics.totalEstimatedCostUsd` — **never show to users** |

### Fields not in current view model that report view model should add

The following fields exist in `FinalDirectionPortfolioV31` / `UserFacingNarrativeV31` / `PortfolioSummaryV31` but are not currently exposed by `buildV31ResultViewModelV31`. Bundle 18B should add them:

- `finalPortfolio.userFacingNarrative.nextStepAdvice`
- `finalPortfolio.portfolioSummary.overallInterpretation`
- `finalPortfolio.portfolioSummary.portfolioLogic[]`
- `finalPortfolio.missingInputsAffectingConfidence[]`
- Per-direction: `direction.evidence[]`, `direction.seniorityComplexityLevel`

### Per-direction field mapping

| Direction element | Field |
|------------------|-------|
| Label | `direction.label` |
| Display order | `direction.displayOrder` |
| Recommendation type | `direction.recommendationType` |
| Confidence | `direction.confidence` |
| Route type | `direction.routeType` |
| Work model | `direction.workModel` |
| Arena | `direction.directionArena` |
| Why it fits | `direction.whyItFits[]` |
| Why it is credible | `direction.whyItIsCredible[]` |
| What makes it risky | `direction.whatMakesItRisky[]` |
| Constraints and warnings | `direction.constraintsAndWarnings[]` |
| First validation step | `direction.firstValidationStep` |
| Bridge strategy | `direction.bridgeStrategy` |
| Not recommended if | `direction.notRecommendedIf[]` |
| Evidence | `direction.evidence[]` — not yet in view model; add in 18B |

---

## 5. Internal Viewer vs User-Facing Report

The internal debug viewer (`/internal/v31-result`) and the user-facing report serve different purposes and must not be confused.

| Dimension | Internal viewer | User-facing report |
|-----------|----------------|-------------------|
| Audience | Internal team, developers | The person who completed the assessment |
| Tone | Diagnostic, technical, monospace | Calm, considered, human |
| Layout | Dense field rows, card grid, all fields visible | Page-like, selective, with clear hierarchy |
| Data shown | All view model fields including quality notes, guardrail booleans, direction IDs, pipeline metadata | Selected report fields only — no quality notes, no raw IDs, no pipeline diagnostics |
| Error handling | Shows raw error messages | Graceful fallback — "we could not generate a complete result" language |
| Guardrail display | Raw `guardrailStatus` strings (`caution`, `bridge_required`), `canShowAsCredibleNow` booleans | Translated to plain-language explanation |
| Cost display | `$0.345213` visible | Never shown |
| Pipeline status | `pipelineStatus: passed/failed` visible | Never shown directly |
| Quality notes | Shown in a dedicated section | Internal only — not shown to users |
| Source field | `isolated_debug_runner` / `production_pipeline` visible | Never shown |
| Direction IDs | `BF-4-E`, `MG-7-IF` etc. visible | Hidden — label only |

The user-facing report view model (built in Bundle 18B) must enforce these distinctions at the data layer, not at the rendering layer. The report component should receive a cleaned view model that does not contain internal fields — it should not need to conditionally hide them.

---

## 6. Visual Direction

The v3.1 user-facing report should borrow the visual rhythm of the legacy PDF report while shifting the information hierarchy from scores to status.

### Page-like structure
- The report reads as a series of pages or sections, not a data dashboard.
- Each section has a clear purpose and a clear boundary.
- Use the same brand strip pattern (`Ortheon` + section label) from the legacy PDF.

### Cards
- Each direction gets its own card or page.
- The primary direction card is visually larger or more prominent than bridge/exploratory cards.
- Rejected direction cards are visually quieter — smaller type, muted tones.

### Status badges replace numeric scores
- `recommendationType: primary` → green "Primary" badge
- `recommendationType: bridge` → amber "Bridge required" badge
- `recommendationType: exploratory` → blue "Exploratory" badge
- `recommendationType: not_recommended` → muted "Not now" badge
- `confidence: high` → green confidence indicator
- `confidence: medium` → amber confidence indicator
- `confidence: low` → red confidence indicator
- `confidence: insufficient_data` → grey "Insufficient data" label

### Typography
- Section headers: clear, moderate weight, not aggressive
- Direction labels: large, prominent
- Evidence bullets: smaller, readable, not compressed
- First validation step: distinguished — box with accent color (blue, as in internal viewer)
- Bridge strategy: distinguished — box with warm accent (amber, as in internal viewer)

### Spacing and rhythm
- Generous paragraph spacing — this is a decision document, not a data dump
- Soft dividers between sections — not heavy rules
- No raw JSON anywhere in the user-facing view

### Direction deep-dive rhythm (from legacy PDF)
The legacy PDF direction card shows: title, badge (Credible now / Bridge path / Stretch), durability, why it fits, credibility action. The v3.1 version can follow the same card rhythm with these substitutions:
- `badge` → `recommendationType` status badge (not "Credible now" hardcoded — derived from data)
- `durabilityRating` → removed
- `getWhyItFits()` (generic template) → `direction.whyItFits[]` (personalized)
- `getCredibilityAction()` (generic template) → `direction.firstValidationStep` (specific)
- Score removed entirely

---

## 7. What Not To Bring Back From Legacy Report

This section is a hard list. These elements must not appear in the v3.1 user-facing report.

| Legacy element | Why it must not return |
|----------------|----------------------|
| **Total score** (e.g. "Score 100") | v3.1 does not produce scores. Scores were derived from keyword matching — they were precise but not accurate. `recommendationType` + `confidence` are the replacement. |
| **Score as a ranking signal** ("Score 100 · 99 · 87") | Numeric ranking creates false precision and makes the lowest-ranked direction feel like a failure. `displayOrder` is a presentation order, not a ranking. |
| **"Strong Fit" / "Good Fit" fit band** | Fit bands were derived from score thresholds, not genuine fit assessment. If confidence is high, the badge shows "high confidence" — that is enough. |
| **Income estimate as a prominent headline** | `formatUsd(avg12month)` in the legacy report shows income next to the direction title. v3.1 has no income estimates at this stage. If income data is added in future, it must appear in a caveated supporting block, not as a headline. |
| **AI durability rating as a badge** (D0–D4) | v3.1 does not produce durability ratings. If durability is relevant, it would need to be evidence-backed and framed as a qualitative judgment, not a D-score. |
| **Templated narrative** (e.g. `getPrimaryMeaning(mapCluster)`) | The legacy PDF generates identical boilerplate for all directions in the same cluster. v3.1 generates personalized `whyItFits[]`, `whyItIsCredible[]`, `whatMakesItRisky[]`. Use these. |
| **Adjacent directions presented as equally recommended** | The legacy map shows "Nearby" directions that look almost identical to primary paths. v3.1 has `exploratory` and `not_recommended` types — these must be visually subordinate. |
| **False certainty about bridge paths** | The legacy report's "Bridge path" badge does not explain what the bridge is. v3.1's `bridgeStrategy` field contains the actual bridge. It must be shown. |
| **"Declining / avoid recommending"** durability language | Harsh automated verdicts without explanation. v3.1 does not produce durability verdicts. |
| **Rank language** ("Your #1 direction", "Top match") | Ranking language implies scoring. Use "primary direction," "first direction," or the label directly. |

---

## 8. Open Product Questions

The following questions must be resolved before building the user-facing report component (Phase 20A).

| Question | Priority | Notes |
|----------|----------|-------|
| Should primary / bridge / exploratory / not-now be the main organizing structure — or should it be a simpler "recommended / not recommended" split? | High | Current spec assumes a 4-level structure. Simpler may be clearer for users who are not familiar with "bridge" terminology. |
| Should "bridge required" directions come before or after a full primary deep dive? | High | Recommendation: primary deep dive first, then bridge. But if the user has no primary (all bridge), the structure changes. |
| How much of rejected / not-now directions should users see? | High | Internal viewer shows all. User report may want to collapse or limit to 1–3 most relevant. Showing too many could undermine confidence in the primary result. |
| Should financial realism get its own visible badge on a direction card? | Medium | `constraintsAndWarnings[]` often includes financial concerns. A "financial caution" badge could surface this clearly without being alarming. |
| Should quality notes be surfaced to users in any form? | Medium | Quality notes are currently internal. Some may be genuinely useful ("Result confidence is affected by limited CV data"). Define what threshold of quality note is user-safe. |
| How should missing evidence be corrected? | Medium | The caveats section can note what is missing. But is there a way for users to re-submit or update inputs? This is a product question about the assessment flow, not solvable in the report spec. |
| How should the report handle multiple directions with the same recommendation type? | Medium | e.g. two "bridge" directions — does each get a full deep dive or a condensed card? |
| Should API cost ever be shown? | Low | No. Cost is never user-facing. |
| How should the report behave if `pipelineStatus` is "partial" or `guardrails.passed` is false? | High | The report should not render with a failed or partial result. Define fallback UX: "Your result is still being finalized" or fall back to legacy report. |
| Should the user-facing report ever link to the internal debug viewer? | Low | No. The internal viewer is internal-only. |
| Should `portfolioSummary.portfolioLogic[]` be shown to users in any form? | Low | These are the portfolio composer's reasoning steps. May be too technical. Consider showing a simplified "How we decided this" section if quality is high. |

---

## 9. Recommended Next Bundle

**Bundle 18B — v3.1 User-Facing Report View Model Builder**

**Purpose:**
Convert the existing `V31ResultViewModelV31` (built by `buildV31ResultViewModelV31`) into a cleaner, user-safe report view model that:

- Exposes all fields needed for the user-facing report.
- Strips internal-only fields (`qualityNotes`, `apiUsageSummary`, `source`, `pipelineStatus`, internal direction IDs as user-visible text).
- Adds fields currently missing from the view model: `nextStepAdvice`, `overallInterpretation`, `portfolioLogic`, `missingInputsAffectingConfidence`, per-direction `evidence[]` and `seniorityComplexityLevel`.
- Derives computed display fields: `statusLabel`, `statusMix` (count of directions per recommendationType), `credibleNowDirections`, `bridgeDirections`, `exploratoryDirections`, `notNowDirections`.
- Translates guardrail status strings into user-safe plain-language strings.

**Constraints:**
- No UI yet. Pure function, no Firestore reads or writes, no AI calls.
- Output: `V31ReportViewModelV31` — a new typed object distinct from `V31ResultViewModelV31`.
- File: `src/v31/viewer/buildV31ReportViewModel.js` (or `src/v31/report/buildV31ReportViewModel.js`).
- Does not replace `buildV31ResultViewModelV31` — both coexist.
- Does not modify `ResultsStep`, `PdfReport`, or `CareerDirectionMap`.
- Does not modify any existing API handlers.

**Deliverable:** A working `buildV31ReportViewModelV31(viewModel)` function, tests against at least one real result, and a short inspection of output shape in the debug viewer.
