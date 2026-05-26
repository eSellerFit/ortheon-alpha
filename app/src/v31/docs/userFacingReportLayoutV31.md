# Ortheon MVP Cut v3.1 — User-Facing Report Layout and Information Hierarchy

**Bundle 18E — Layout spec only. No code changes.**

---

## Purpose

This document defines the layout structure and information hierarchy for the future v3.1 user-facing report. It supersedes the structural assumptions in `userFacingReportArchitectureV31.md` wherever they conflict and governs all future report component work.

The goal of this layout is to give the user a fast, scannable read of their results — lead with the answer, then show the reasoning, then show the detail only where it is worth reading.

---

## Core Design Principles

- **Cards over essays.** Each section is composed of short, structured cards. Long prose belongs only in the primary direction deep dive, and even there each list is capped at 3 bullets.
- **Answer first, reasoning second.** The Decision Dashboard appears before any direction text so the user gets the verdict immediately.
- **Signals before direction detail.** Input Signals appear before the Direction Portfolio so the user understands what the engine saw before they read where it sent them.
- **One deep dive, not three.** Only the primary direction receives full narrative treatment. All other directions use the compact card format.
- **No scores, fit bands, or income estimates.** Status labels (Credible now, Bridge required, etc.) replace numeric outputs.
- **No internal language.** The words `bridge_required`, `not_viable`, `guardrail status`, `canShowAsCredibleNow`, and similar internal identifiers never appear in the report.
- **No repeated financial warnings.** Financial realism is shown once, in the Decision Dashboard and Input Signals cards. It is not repeated in every direction card.
- **No debug metadata.** API cost, call count, pipeline status, source, quality notes, and raw JSON never appear.
- **No legacy fields.** `careerMap`, `directionRecommendations`, `primaryDirections`, `reportSections`, `report` are not used.

---

## Section 1 — Executive Summary

**Purpose:** Orient the user in two to four sentences before any detail.

**Contents:**

| Field | Source | Notes |
|---|---|---|
| Headline | `cover.headline` | One sentence, no direction names |
| Recommended strategy | `cover.recommendedStrategy` | One sentence |
| Main tension | `cover.mainTension` | One sentence — names the central trade-off the user faces |
| Summary paragraph | `cover.summary` | One short paragraph, no lists |

**What does not appear here:**

- Direction names or labels
- Risk lists or constraint lists
- Financial figures
- Confidence levels
- Any long direction explanation

---

## Section 2 — Decision Dashboard

**Purpose:** Give the user the answer fast. The dashboard is the first place direction names appear, but only as compact cards.

**Layout:** A row or grid of cards. Each card has a short label, a one-sentence explanation, and a status indicator where applicable.

### Card definitions

**Primary Direction card**
- Label: direction label
- Status badge: Credible now / Credible now, with caution
- Confidence: high / medium / low
- One sentence: `shortWhy` from the portfolio item

**Bridge-Required Options card**
- Count of bridge-required directions
- List of direction labels only — no explanation
- One sentence beneath: "These paths are viable but not the immediate move."

**Not-Now Directions card**
- Count of not-now / rejected directions
- List of direction labels only
- One sentence beneath: "These were considered and set aside for now."

**Financial Realism card**
- Source: `keySignals.financialRealitySignals` (max 2 items)
- One guardrail translation if `bridge_required` applies to the primary direction
- No duplication of this content elsewhere in the report

**Overall Confidence card**
- Source: `reportMeta.confidenceLevelSummary`
- Human-readable summary: e.g., "One direction at high confidence, two at medium."
- No raw counts or JSON

---

## Section 3 — Your Input Signals

**Purpose:** Show what the engine understood about the person before presenting direction detail. This helps the user verify the engine's read of them and builds trust in the directions that follow.

**Layout:** A grid of signal cards. Each card follows the same three-part pattern:

```
Signal       → what was present in the input data
Interpretation → what the engine made of it
Impact       → how it shaped the recommendations
```

### Signal card definitions

**Career Anchors / Motivation Pattern**
- Signal: the anchor pattern that emerged (e.g., capability-led, identity-led, mixed, unclear)
- Interpretation: what that pattern suggests about where the person finds meaning or energy
- Impact: capability-based confidence may be stronger than motivation-based confidence when anchors are flat or unclear; directions may rely more on demonstrated competence than stated drive

**Financial Reality**
- Signal: financial context from the assessment (runway, income floor, flexibility)
- Interpretation: what the income situation allows or constrains
- Impact: which directions require bridge income; whether a longer ramp-up is realistic

**Work Model Preference**
- Signal: employment preference — employed, independent, fractional, open
- Interpretation: how strong the preference is and whether it aligns with the primary direction
- Impact: directions that conflict with the stated preference are flagged or pushed to exploratory

**Constraints**
- Signal: the binding constraints identified (capacity, timing, geography, credentials, financial floor)
- Interpretation: which constraints are hard limits vs soft preferences
- Impact: which directions were narrowed or eliminated by these constraints

**Credibility Assets**
- Signal: the strongest transferable experience clusters
- Interpretation: what roles or buyers would recognise these as relevant
- Impact: directions where credibility is strongest vs weakest; basis for `whyItIsCredible` ratings

**Missing Evidence**
- Signal: what data the engine could not find or assess (e.g., quantified outcomes, advisory relationships, client acquisition history)
- Interpretation: how this gap affects confidence
- Impact: which directions would improve most if this evidence were provided

---

## Section 4 — Direction Portfolio

**Purpose:** Let the user scan all directions at a glance before reading detail. Compact cards only — no full narrative here.

**Layout:** A horizontal scroll or stacked card list. One card per direction.

### Direction card fields

| Field | Notes |
|---|---|
| Title | Direction label |
| Status badge | Credible now / Credible now, with caution / Bridge required / Exploratory / Not now |
| Confidence | high / medium / low |
| Route type | employed / independent / fractional / advisory / etc. |
| Work model | full-time / part-time / consulting / etc. |
| Why this is here | One sentence only — `shortWhy` |
| Main risk | One sentence only — first item from `whatMakesItRisky` |
| First validation step | One action — `firstValidationStep` (first clause only) |

**What does not appear on portfolio cards:**

- Full `whyItFits` list
- Full `whyItIsCredible` list
- Full `constraintsAndWarnings` list
- `notRecommendedIf` list
- `whatWouldMakeItStronger` list
- Financial warnings (already in Decision Dashboard)

---

## Section 5 — Primary Direction Deep Dive

**Purpose:** Give the user enough detail to act on their primary direction. This is the only section with extended narrative.

**Applies to:** The single direction with `recommendationType: "primary"`. If no primary exists, the first direction by `displayOrder` is used.

### Fields

| Field | Max bullets | Notes |
|---|---|---|
| What this direction means | — | One paragraph from `whatThisDirectionMeans` |
| Why it fits | 3 | From `whyItFits` |
| Why it is credible | 3 | From `whyItIsCredible` |
| Main risks | 3 | From `whatMakesItRisky` |
| First validation step | — | Full `firstValidationStep` text (not truncated here) |
| What would make it stronger | 2 | From `whatWouldMakeItStronger` (practical suggestions, not copied risks) |
| Not recommended if | 3 | From `notRecommendedIf` |

**Guardrail note:** If a guardrail translation applies to this direction, show it once at the top of the deep dive as a callout. Do not repeat it within the risk or constraint lists.

---

## Section 6 — Other Directions

**Purpose:** Acknowledge bridge and secondary directions without over-explaining them.

**Applies to:** Directions with `recommendationType: "bridge"`, `"secondary"`, or `"exploratory"`.

### Compact format for each direction

| Field | Notes |
|---|---|
| Title | Direction label |
| Status badge | As defined in Section 4 |
| Why it is interesting | One sentence — first item from `whyItFits` |
| Why it is not the primary move now | One sentence — first item from `whatMakesItRisky` or `constraintsAndWarnings` |
| Bridge condition or validation condition | `bridgeStrategy` or `firstValidationStep` — one sentence |
| First validation step | One action |

**What does not appear:**

- Full risk and credibility lists
- `constraintsAndWarnings` in full
- `notRecommendedIf`
- `whatWouldMakeItStronger`

A future UI expansion may allow the user to tap into any bridge direction for a full deep dive matching Section 5. That expansion is not in scope for Bundle 18F.

---

## Section 7 — Not-Now Directions

**Purpose:** Show rejected directions respectfully. The user deserves to know they were considered.

**Applies to:** Directions in `notNowDirections[]` (from `rejectedDirections` in the view model).

### Format

| Field | Notes |
|---|---|
| Considered direction | Direction label |
| Why not now | One sentence from `reason` — no internal terms |
| What would need to change | `whatWouldChangeThis` if populated; otherwise omit |

**Tone guidance:**

- Do not use language that implies permanent rejection.
- Do not show risk lists for not-now directions.
- "Not now" is the correct framing — "not recommended" or "rejected" should not appear in user-facing text.

---

## Section 8 — 30-Day Validation Plan

**Purpose:** Send the user away with concrete next steps rather than an abstract picture.

**Constraints:**

- Maximum 3 actions total.
- Each action must start with a verb.
- Actions come from `validationPlan.next30Days`, which is sourced from `firstValidationStep` fields across directions.
- No caveats in this section — caveats belong in Section 9.
- No financial warnings in this section — shown already.

### Optional sub-sections (show only if populated)

| Sub-section | Source | Max items |
|---|---|---|
| Evidence to build | `validationPlan.evidenceToBuild` | 3 |
| Conversations to have | `validationPlan.conversationsToHave` | 2 |
| Decisions to make | `validationPlan.decisionsToMake` | 2 |

If any sub-section is empty, omit it entirely rather than showing an empty list.

---

## Section 9 — Confidence and Limitations

**Purpose:** Be honest about what the engine could and could not assess. Short section only.

**Contents:**

| Field | Source | Notes |
|---|---|---|
| Missing evidence | `confidenceNotes.missingEvidence` | Max 3 items |
| Assumptions affecting confidence | `confidenceNotes.lowConfidenceReasons` | Max 3 items |
| What the user could correct later | `confidenceNotes.caveats` | Max 3 items — only items not already shown in Section 3 (Input Signals) |

**Do not repeat:**

- Caveats already shown in the Input Signals cards (Section 3)
- Financial warnings already shown in Sections 2 and 3
- Direction-level risks already shown in Section 5

---

## Information Hierarchy Summary

```
Section 1  Executive Summary        ← orient
Section 2  Decision Dashboard       ← answer fast
Section 3  Input Signals            ← show the engine's read of the person
Section 4  Direction Portfolio      ← scannable overview of all directions
Section 5  Primary Direction        ← only full narrative block
Section 6  Other Directions         ← compact cards, no full narrative
Section 7  Not-Now Directions       ← respectful, brief
Section 8  30-Day Validation Plan   ← concrete actions
Section 9  Confidence & Limitations ← honest, short, non-repetitive
```

---

## Source Mapping

| Report section | View model source |
|---|---|
| Executive Summary | `cover.headline`, `cover.recommendedStrategy`, `cover.mainTension`, `cover.summary` |
| Decision Dashboard — primary card | `primaryDirection`, `directionPortfolio[0]` |
| Decision Dashboard — bridge card | `bridgeDirections`, `reportMeta.bridgeRequiredCount` |
| Decision Dashboard — not-now card | `notNowDirections`, `reportMeta.rejectedDirectionCount` |
| Decision Dashboard — financial | `keySignals.financialRealitySignals` |
| Decision Dashboard — confidence | `reportMeta.confidenceLevelSummary` |
| Input Signals — anchors | Derived from `cover.summary` and direction `whyItFits` patterns — **not yet in view model; see Bundle 18F** |
| Input Signals — financial | `keySignals.financialRealitySignals`, `keySignals.guardrailSignals` |
| Input Signals — work model | Direction `workModel` fields, `directionPortfolio` |
| Input Signals — constraints | `keySignals.constraintSignals` |
| Input Signals — credibility assets | `keySignals.strongestCredibilitySignals` |
| Input Signals — missing evidence | `keySignals.missingEvidenceSignals` |
| Direction Portfolio cards | `directionPortfolio[]` — all fields already present |
| Primary Deep Dive | `primaryDirection` — all fields already present |
| Other Directions | `bridgeDirections[]`, `exploratoryDirections[]` |
| Not-Now Directions | `notNowDirections[]` |
| Validation Plan | `validationPlan` — all sub-sections already present |
| Confidence & Limitations | `confidenceNotes` |

### View model gaps requiring Bundle 18F

The current `V31UserFacingReportViewModel` produced by `buildV31UserFacingReportViewModelV31` does not yet include:

- **Dashboard cards** — a structured `dashboardCards` array for the Decision Dashboard
- **Input signal cards** — a structured `inputSignals` object with the six signal cards defined in Section 3 above; the career anchors card in particular requires new derivation logic since the internal view model does not surface a motivation pattern field directly
- **Compressed portfolio card format** — the current `directionPortfolio` items contain enough data; the compression is a rendering concern, but the `shortWhy` and single-risk fields should be verified as consistently populated
- **`whatWouldChangeThis`** — currently set to `""` in `notNowDirections`; Bundle 18F should attempt to derive this from the direction's `bridgeStrategy` or `whatMakesItRisky`

---

## Recommended Next Bundle

### Bundle 18F — Adapt User-Facing Report View Model to Support Card-Based Layout

**File to modify:** `src/v31/report/buildV31UserFacingReportViewModel.js`

**Purpose:** Update the view model builder so that the rendered report can use the card-based layout defined in this spec without requiring the UI layer to derive or rearrange data.

**Specific tasks:**

1. Add `dashboardCards` to the top-level view model output:
   - `primaryDirectionCard` — label, status, confidence, shortWhy
   - `bridgeOptionsCard` — count, labels[]
   - notNowCard — count, labels[]
   - `financialRealismCard` — up to 2 signals, guardrail translation if applicable
   - `overallConfidenceCard` — human-readable summary string

2. Add `inputSignals` object to the top-level view model output, with six cards:
   - `careerAnchors` — signal, interpretation, impact; derived from `cover.summary` pattern matching or a fixed placeholder if the data is not yet available
   - `financialReality` — signal, interpretation, impact; from `keySignals.financialRealitySignals` and guardrail translation
   - `workModelPreference` — signal, interpretation, impact; from direction `workModel` distribution
   - `constraints` — signal, interpretation, impact; from `keySignals.constraintSignals`
   - `credibilityAssets` — signal, interpretation, impact; from `keySignals.strongestCredibilitySignals`
   - `missingEvidence` — signal, interpretation, impact; from `keySignals.missingEvidenceSignals`

3. Populate `whatWouldChangeThis` in `notNowDirections` — attempt derivation from `bridgeStrategy`, falling back to the first item in `whatMakesItRisky`.

4. Verify that `directionPortfolio` items consistently have `shortWhy` and a first-item risk available; add `mainRisk` as a separate field (first item of `whatMakesItRisky`, sanitized) so the UI does not have to re-derive it.

5. Update the debug runner (`scripts/v31/runV31UserFacingReportViewModelDebug.mjs`) to confirm `dashboardCards` and `inputSignals` keys exist in the output.

**Constraints:**
- Pure deterministic function — no Firestore, no AI, no API calls.
- Does not mutate input.
- Protected files remain untouched.
- No UI changes in this bundle — model only.
- Structural shape is additive; existing fields are not renamed or removed.
