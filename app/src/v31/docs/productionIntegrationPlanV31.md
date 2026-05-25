# Ortheon MVP Cut v3.1 — Production Integration Plan

**Status:** Planning only — no production changes have been made.  
**Author:** Bundle 17A  
**Date:** 2026-05-25  

---

## 1. Current State

The following pieces are fully working and tested in isolation:

| Component | Status | Notes |
|-----------|--------|-------|
| v3.1 pipeline engine | ✅ Working | 4 Claude API calls: profile synthesizer → transferability mapper → direction hypothesis generator → portfolio composer |
| `buildAssessmentSnapshotV31()` | ✅ Working | Pure adapter converts any Firestore assessment document into `AssessmentSnapshotV31`. Zero side effects. |
| Deterministic guardrails | ✅ Working | Financial modeler, hard constraint engine, guardrail validator, quality-over-diversity validator — all pure, no AI calls |
| `buildV31PipelineResultPayloadV31()` | ✅ Working | Builds typed `V31PipelineResultPayload` with version, stage, guardrailSummary, apiUsageSummary, finalPortfolio |
| `saveV31PipelineResultPayload()` | ✅ Working | Writes only to `assessments/{id}.v31Result`. Hard guards against legacy fields. Dry-run by default. Requires `V31_ENABLE_FIRESTORE_WRITE=true`. |
| `readV31ResultViewModelFromFirestoreV31()` | ✅ Working | Read-only Firestore reader. Returns typed view model. |
| Internal debug viewer | ✅ Working | Route `/internal/v31-result?documentId=<id>`. Read-only. Shows pipeline status, directions, guardrails, cost. |
| `runV31PipelineWriteDebug.mjs` | ✅ Working (fixture data) | CLI runner with `--document-id`, `--write`, `--dry-run` flags. Currently uses `SAMPLE_ASSESSMENT_V31` fixture, not real Firestore reads. |
| Legacy result flow | ✅ Untouched | `ResultsStep` → `generateLiveRecommendations()` → `saveAssessmentResults()` writes `directionRecommendations`/`careerMap` to document root. Unchanged. |

**Key gap:** `runV31PipelineWriteDebug.mjs` reads from a hardcoded fixture (`SAMPLE_ASSESSMENT_V31`), not from a real Firestore assessment document. Bundle 17B closes this gap.

---

## 2. Integration Principle

These constraints are non-negotiable through all integration phases:

1. **v3.1 must not overwrite legacy fields.** `directionRecommendations`, `careerMap`, `primaryDirections`, `reportSections`, and `report` at the document root must remain untouched. The persistence adapter already enforces this with a hard blocklist.

2. **v3.1 result lives under `assessments/{assessmentId}.v31Result` only.** This is a nested field, isolated from the legacy result shape. No other fields are written.

3. **Legacy `ResultsStep` remains the production fallback** until v3.1 result quality is explicitly approved through internal review. It is never removed or bypassed prematurely.

4. **All generation and write paths must be behind explicit feature flags or internal-only gates.** No user-facing change happens before the flags are intentionally enabled.

5. **Every integration step must be fully reversible.** If v3.1 generation is disabled or removed, the legacy flow must continue working exactly as before without any code change in production-facing files.

---

## 3. Proposed Rollout Phases

### Phase 17B — Internal production-like replay (next bundle)

**Scope:** CLI-only. No UI changes. No user-facing impact.

- Extend `runV31PipelineWriteDebug.mjs` (or create a new sibling script) to read a real Firestore assessment document using `getAssessment(documentId)` from `assessmentService.js` (or equivalently via `getDoc(db, "assessments", documentId)`).
- Pass the real document through `buildAssessmentSnapshotV31()` — the adapter already handles the real document shape.
- Run the full v3.1 pipeline against real assessment data.
- Optionally write result to `v31Result` with existing write guards.
- View result in the internal debug viewer at `/internal/v31-result?documentId=<id>`.
- Compare v3.1 directions/portfolio against the legacy result stored in `directionRecommendations`.
- **No changes to `ResultsStep`, `assessmentService.js`, or any production file.**

**Deliverable:** At least 3–5 real assessment documents processed through v3.1 pipeline. Results reviewed in internal viewer.

---

### Phase 18A — v3.1 generation trigger design

**Scope:** Decision only. Possibly a new internal admin UI or CLI extension.

- Decide *when* the v3.1 pipeline should run in production (see Section 4).
- Define what assessment completeness means: status `results_generated` as the trigger signal (assessment already has `directionRecommendations`).
- Design the function signature for the trigger: `triggerV31PipelineForAssessment(assessmentId, options)`.
- Define behavior when `v31Result` already exists: default to skip unless `force: true` is passed (idempotency).
- **No actual production trigger implemented yet.**

---

### Phase 18B — Backend/service integration

**Scope:** New controlled service wrapper. No changes to existing production files.

- Create `src/v31/service/v31PipelineService.js` (new file, does not replace anything).
- This service wraps the full pipeline: read assessment → build snapshot → run 4 API calls → validate → write `v31Result`.
- Error handling: if any step fails, `v31Result` is not written. Legacy result is never affected.
- Write only when `V31_WRITE_ENABLED` flag is true and `V31_GENERATION_ENABLED` flag is true.
- If `v31Result` already exists and `force` is not passed, return early without generating.
- Log all failures explicitly. Never throw errors that could bubble up to the legacy user flow.
- **`assessmentService.js` is not modified.** The new service imports `getAssessment()` from it but does not add to it.

---

### Phase 19A — Internal reviewer UI

**Scope:** Internal-only UI additions. No changes to production user flow.

- Create an internal assessment list page at `/internal/assessments` that reads documents from the `assessments` collection (admin-only, not public).
- For each document, show: assessmentId, `status`, whether `v31Result` exists, `pipelineStatus` if present.
- Clicking an assessment opens the existing internal viewer at `/internal/v31-result?documentId=<id>`.
- Add a side-by-side view that shows v3.1 directions alongside the legacy `directionRecommendations` for the same document.
- **No changes to `ResultsStep`, `PdfReport`, `CareerDirectionMap`.**

---

### Phase 20A — User-facing v3.1 result preview

**Scope:** Opt-in user-facing change. Behind `V31_USER_FACING_ENABLED` flag.

- When `V31_USER_FACING_ENABLED` is true and `v31Result` exists for the assessment, `ResultsStep` reads and displays v3.1 directions instead of the legacy result.
- `ResultsStep` does NOT regenerate v3.1 on page load — it reads the pre-generated `v31Result.finalPortfolio` from Firestore.
- Legacy `directionRecommendations` remain in Firestore as the fallback. If `v31Result` is missing or invalid, `ResultsStep` falls back to the legacy result silently.
- **No PDF integration yet** — `PdfReport` continues to use the legacy result shape.

---

### Phase 21A — PDF/report adaptation

**Scope:** Only after Phase 20A is stable and quality is approved through internal review.

- Transform `v31Result.finalPortfolio` directions into the report section shape expected by `PdfReport`.
- Create a separate adapter function — do not modify `PdfReport` internals.
- Keep the adapter in `src/v31/adapters/` to maintain isolation.
- Gate behind `V31_PDF_ENABLED` flag.

---

## 4. Production Trigger Options

### Option A — Manual admin/debug trigger (CLI or internal UI button)

**Description:** An authorized internal user explicitly triggers v3.1 generation for a specific assessment document, either via CLI script or an internal admin UI action.

**Pros:**
- Complete control over which assessments are processed.
- Zero risk of accidental generation or cost overrun.
- Easy to test and audit one document at a time.
- No changes to the production user flow.

**Risks:**
- Does not scale to production volume.
- Requires manual effort for every assessment.
- Cannot be the long-term strategy.

**Recommendation:** Use this as the sole trigger through Phases 17B and 18B. Establish a stable, repeatable process before automating.

---

### Option B — Automatic trigger after legacy result generation

**Description:** When `saveAssessmentResults()` completes successfully (setting `status: "results_generated"`), automatically trigger v3.1 pipeline in the background.

**Pros:**
- Every completed assessment gets a v3.1 result automatically.
- User is already waiting for results — background work can start immediately.

**Risks:**
- Any bug in the v3.1 trigger path could affect the legacy result flow if not isolated carefully.
- Adds latency risk if triggered synchronously inside `saveAssessmentResults()`.
- Cost implications: $0.30–0.50 per assessment × all assessments = significant spend if triggered broadly.
- `assessmentService.js` would need modification, making it a protected file violation risk.

**Recommendation:** Only adopt after Phases 18B is stable. Trigger via a Firestore `onUpdate` Cloud Function watching `status == "results_generated"`, not by modifying `assessmentService.js`.

---

### Option C — Async background generation via Cloud Function

**Description:** A Firestore-triggered Cloud Function fires when `status` changes to `results_generated`. The function calls the v3.1 pipeline API handlers serverside and writes `v31Result`.

**Pros:**
- Fully decoupled from the client-side user flow.
- No changes required to any client-side file.
- Client never waits on v3.1 generation.

**Risks:**
- Requires Cloud Functions infrastructure to be set up and secured.
- Errors are harder to surface to internal reviewers without additional logging.
- Cold start latency means `v31Result` may not be available for several minutes after assessment completion.

**Recommendation:** This is the correct long-term architecture. Plan for Phase 18B+ after manual trigger is proven stable.

---

### Option D — On-demand generation when user opens results

**Description:** `ResultsStep` checks whether `v31Result` exists. If missing, triggers generation on page load.

**Pros:**
- Simple to implement — logic stays in `ResultsStep`.

**Risks:**
- Blocks the user while generation runs (4 API calls, 30–90 seconds).
- Could trigger duplicate runs if the user refreshes.
- `ResultsStep` is a protected file.
- Generation cost is incurred on every user session if not cached.

**Recommendation:** Do not use. Violates the principle that the user flow must not be blocked or modified by v3.1 integration.

---

### Recommended Trigger Sequence

1. **Phases 17B–18B**: Manual admin/CLI trigger only.
2. **Phase 19A+**: Internal UI trigger (button in admin reviewer).
3. **Phase 20A+**: Async Firestore-triggered Cloud Function on `status == "results_generated"`.
4. **Never**: On-demand generation on user page load.

---

## 5. Data Model

### Firestore target

```
Collection:  assessments
Document:    {assessmentId}
Field:       v31Result        ← only field written by v3.1
```

### v31Result field shape

| Field | Type | Description |
|-------|------|-------------|
| `v31Result.version` | `"v3.1"` | Schema version |
| `v31Result.stage` | `"v31_pipeline_result"` | Always this value |
| `v31Result.pipelineStatus` | `"passed" \| "failed"` | Overall pipeline outcome |
| `v31Result.assessmentId` | string | Links back to the source document |
| `v31Result.generatedAt` | ISO string | Timestamp of generation |
| `v31Result.source` | string | e.g. `"production_pipeline"`, `"isolated_debug_runner"` |
| `v31Result.finalPortfolio` | object | Contains `directions[]`, `rejectedDirections[]`, `userFacingNarrative`, `portfolioSummary`, `qualityNotes` |
| `v31Result.pipelineSummary` | object | Per-step outcome: profileSynthesizer, transferabilityMapper, directionHypothesisGenerator, portfolioComposer |
| `v31Result.guardrailSummary` | object | `passed`, `guardrailStatuses[]`, `canShowAsCredibleNowValues[]` |
| `v31Result.apiUsageSummary` | object | `callCount`, `totalEstimatedCostUsd`, `perStageEstimatedCostUsd` |
| `v31Result.warnings` | string[] | Non-fatal pipeline warnings |
| `v31Result.errors` | any[] | Fatal pipeline errors |

### Legacy fields that must never be written by v3.1

The persistence adapter already hard-blocks these. Document here for clarity:

- `directionRecommendations` — written only by `saveAssessmentResults()` in the legacy flow
- `careerMap` — same
- `primaryDirections` — same
- `reportSections` — same
- `report` — same

---

## 6. Feature Flag / Gate Strategy

All flags default to `false`. They should live in a new file `src/v31/featureFlagsV31.js` (not in the existing `featureFlags.js`, which governs the foundation adapter).

```js
// src/v31/featureFlagsV31.js  (to be created in a future bundle)

// Controls whether the v3.1 pipeline generation can be triggered at all.
// When false: no generation runs, no API calls, no Firestore writes.
export const V31_GENERATION_ENABLED = false;

// Controls whether a generated v31Result can be written to Firestore.
// Requires V31_GENERATION_ENABLED = true. Dry-run only when false.
export const V31_WRITE_ENABLED = false;

// Controls whether the internal /internal/v31-result viewer is reachable.
// Already implemented (Bundle 16C). Exposed only to internal users for now.
export const V31_VIEWER_ENABLED = true;

// Controls whether ResultsStep reads from v31Result instead of legacy directionRecommendations.
// Must not be enabled until quality review is complete (Phase 20A).
export const V31_USER_FACING_ENABLED = false;

// Controls whether PdfReport is adapted to use v31Result data.
// Must not be enabled until Phase 21A.
export const V31_PDF_ENABLED = false;
```

### Gate enforcement

- `V31_GENERATION_ENABLED` is checked first. If false, nothing else matters.
- `V31_WRITE_ENABLED` is checked at persistence time. The pipeline can still run in dry-run mode without it.
- `V31_USER_FACING_ENABLED` is checked in `ResultsStep` before reading from `v31Result`. The check must be defensive: if `v31Result` is missing or malformed, fall back to legacy silently.
- Internal admin/debug routes should be restricted by URL convention (`/internal/`) and may later be protected by auth token. Do not expose `/internal/v31-result` in public navigation.

---

## 7. Error Handling / Fallback

The v3.1 integration must never degrade the user's experience of the existing legacy flow. These rules apply at every phase:

| Scenario | Expected behavior |
|----------|-----------------|
| v3.1 generation fails at any step | Legacy result is unaffected. `v31Result` is not written (or written with `pipelineStatus: "failed"`). |
| `v31Result` is missing when user opens results | `ResultsStep` falls back to legacy `directionRecommendations` silently. No error shown to user. |
| `v31Result` exists but is invalid/malformed | Do not regenerate automatically. Log internally. Fall back to legacy result. |
| v3.1 write succeeds but `finalPortfolio` is empty | Log as a warning. Mark `pipelineStatus: "failed"`. Do not show to users. |
| Repeated trigger for an assessment that already has `v31Result` | Return early without generating. Check `v31Result` existence before running pipeline. |
| Any unexpected exception in the v3.1 trigger path | Catch and log. Never let it propagate to `ResultsStep` or `assessmentService.js`. |

**Key rule:** Assessment completion (`status: "results_generated"`) must never depend on v3.1 success. The legacy `saveAssessmentResults()` call must complete before v3.1 generation is triggered, and v3.1 failure must never roll back or affect the legacy result.

---

## 8. Cost / Performance Considerations

| Item | Detail |
|------|--------|
| Cost per v3.1 run | ~$0.30–0.50 (4 Claude API calls observed at $0.3047 in debug run with `FrpHpSzJ9KxeodhoWyJL`) |
| API call count | 4 (profile synthesizer, transferability mapper, direction hypothesis generator, portfolio composer) |
| Firestore storage | Negligible — a single nested field merge write |
| Firestore read cost | Negligible — one `getDoc` per viewer load |

**Idempotency is required.** Before running the pipeline, check whether `v31Result` already exists and `pipelineStatus == "passed"`. If so, skip unless `force: true` is explicitly passed. This prevents accidental re-runs that would cost $0.30–0.50 each time.

**Do not trigger on page load.** The viewer reads from a pre-generated `v31Result`. It must never trigger generation.

**Do not trigger on assessment reads.** `getAssessment()` and `readV31FirestoreResultSummary()` are read-only. No generation side effects allowed on read paths.

**Consider a generation lock.** Before writing `v31Result`, write a `v31GenerationStatus: "in_progress"` marker to prevent concurrent duplicate runs. Clear it on success or failure.

---

## 9. Security / Privacy Considerations

1. **Do not expose the internal viewer publicly.** `/internal/v31-result` is reachable by URL today without authentication. Before any real-user data is processed at scale, add route protection (e.g., check for an internal-only query token or Firebase Auth UID whitelist).

2. **Do not print raw Claude responses in any UI.** The view model builder (`buildV31ResultViewModelV31`) strips raw Claude outputs. The viewer renders only view model fields. This must remain true in all future viewer work.

3. **Do not store `rawAssessment` in `v31Result`.** `buildAssessmentSnapshotV31()` includes `rawAssessment: source` in the snapshot for pipeline use. Ensure this field is stripped before persistence — it must not appear in the `v31Result` Firestore field.

4. **Do not store raw API response bodies.** The `apiUsageSummary` in `v31Result` stores only aggregated cost and call count, not the raw Claude response content.

5. **PII awareness.** Assessment documents contain `firstName`, `email`, `currentRole`. The v3.1 pipeline sends this data to Claude via the profile synthesizer. Confirm that Anthropic API data handling policies are acceptable for this use before enabling in production at scale.

6. **Protect admin/debug routes before real-user launch.** `/internal/assessments`, `/internal/v31-result`, and any admin trigger UI must be behind authentication before the product reaches real users.

---

## 10. Recommended Next Bundle: Bundle 17B

**Bundle 17B — Production-like replay runner using real Firestore assessment data**

**Objective:** Close the gap between the existing debug runner (which uses `SAMPLE_ASSESSMENT_V31` fixture) and a real production replay using an actual Firestore assessment document.

**Scope:**

1. Create a new script: `app/scripts/v31/runV31PipelineFromFirestoreDebug.mjs`
   - Accepts `--document-id=<assessmentId>` (required).
   - Reads the real Firestore assessment document using `getDoc(db, "assessments", documentId)`.
   - Checks that the document exists and has `status: "results_generated"` (or a configurable status check).
   - Passes the real document data through `buildAssessmentSnapshotV31()`.
   - Runs the full 4-call v3.1 pipeline.
   - Builds the pipeline result payload.
   - Writes to `v31Result` with existing write guards (dry-run by default; `--write` flag + `V31_ENABLE_FIRESTORE_WRITE=true` for real write).
   - Prints a structured JSON summary.

2. Strip `rawAssessment` from the snapshot before writing to `v31Result` (add a filter in `buildV31PipelineResultPayloadV31` or in the script itself).

3. Run against at least 3 real assessment documents. View results in `/internal/v31-result?documentId=<id>`. Compare v3.1 directions against legacy `directionRecommendations`.

**Constraints:**
- Do not modify `assessmentService.js`.
- Do not modify `ResultsStep`, `PdfReport`, `CareerDirectionMap`, `scoring.js`, `directionEngineV14`, `featureFlags.js`.
- Do not modify any existing API handlers.
- Do not commit real assessment IDs or `rawAssessment` data to the repository.

**Deliverable:** A working script, 3–5 real replays, and internal review of the v3.1 output quality vs. legacy output.

---

## 11. Open Questions

The following questions must be answered before Phase 18A (trigger design) begins:

| Question | Priority | Notes |
|----------|----------|-------|
| How do we identify internal/admin users for the viewer and admin UI? | High | Firebase Auth UID allowlist? Internal-only token? |
| Should v3.1 generation run synchronously (blocking the user) or asynchronously (background)? | High | Recommendation: async only. See Section 4. |
| How do we handle a user refreshing the results page mid-generation? | Medium | Generation lock / `v31GenerationStatus` marker needed. |
| How do we systematically compare v3.1 and legacy output quality? | Medium | Need a comparison rubric: direction count, label match, quality of reasoning text. |
| Should both `v31Result` and legacy `directionRecommendations` be kept in Firestore indefinitely? | Low | Storage cost is negligible. Keep both until v3.1 is the sole production source. |
| When does v3.1 become the sole production result — replacing the legacy flow entirely? | Low | Only after Phase 21A is complete and PDF is adapted. |
| Should `rawAssessment` be stripped before writing to Firestore or before running the pipeline? | High | Before writing. Confirm in Bundle 17B. |
| What is the minimum acceptable `pipelineStatus` and `guardrailSummary.passed` for a result to be shown to a user? | High | Must be `passed` for both. Define fallback behavior if `canShowAsCredibleNow` is false for all directions. |
