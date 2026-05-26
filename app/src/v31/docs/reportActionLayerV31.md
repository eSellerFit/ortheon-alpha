# Report Action Layer — v3.1 Spec

Bundle 20A — specification only. No implementation code.

---

## 1. Product Decision

The v3.1 report should keep user actions. A report without any action path leaves users with no clear next step after reading.

Actions must support the map-first v3.1 experience, not pull users back into the legacy score-based flow. The old report was built around a total fit score, ranked directions, and an AI durability label — none of which exist in v3.1. Any action that surfaces or implies those legacy concepts would misrepresent the new report.

Download Report and Book Feedback Session should remain part of the user-facing experience. Both were present in the old report for good reasons: download supports sharing and saving; feedback session supports alpha validation and direct qualitative signal. Both are worth preserving.

The current `/internal/v31-report` preview should not automatically become production just because an action layer is added. The internal preview is a diagnostic and development tool. Adding actions to it is a testing step, not a production launch. A separate decision is required before v3.1 results and the report are exposed to production users.

---

## 2. Actions to Preserve

### A. Download Report

**Purpose:** Allow users to save and share their v3.1 result.

The download must produce the new v3.1 map-first report. It must not produce the old score-based report. The old `PdfReport` component is built around `careerMap`, `rank`, `aiDurabilityTone`, and a total fit score — none of which exist in v3.1. Using `PdfReport` as-is would produce a document that contradicts the on-screen report.

The first implementation may be browser print-to-PDF or a dedicated `V31PdfReport` component. Both are viable starting points. The choice is deferred to Bundle 20C.

- Button label: **"Download report"**
- Optional secondary label: "PDF version"
- Must not appear as active until a working v3.1 export path exists.

### B. Book 30-Minute Feedback Session

**Purpose:** Support alpha validation and collect qualitative feedback from first users.

This is especially important during the alpha phase. Direct sessions with early users are the fastest way to understand whether the report is clear, whether directions feel accurate, and what is missing or confusing.

- Button label: **"Book feedback session"**
- Suggested supporting copy:
  > "For early alpha users, I'm offering a free 30-minute session to review your report and understand what was useful, unclear, or missing."
- Link target: George's Google Calendar appointment scheduler.
- Calendly is not assumed — link type is decided later (see Section 7).
- No backend call required. No Firestore write required.

### C. Optional Share Feedback

A lightweight feedback form (text field + submit) could complement the session CTA for users who prefer async feedback.

Not required for the first implementation. If the feedback session CTA is sufficient for alpha, this can be deferred. Revisit after first round of sessions.

---

## 3. Recommended Placement

### A. Top Action Bar

**Placement:** Near the top of the report, after the executive summary and direction map, or immediately below the map.

**Actions:**
- Download report
- Book feedback session

**Purpose:** Visible immediately on load. Users who scan rather than read the full report will still see the actions. Captures high-intent users early.

### B. Bottom CTA Block

**Placement:** After the 30-Day Validation Plan, or at the very end of the report before the footer.

**Purpose:** Invites users to take the next step after reading the full report. This placement catches users who read thoroughly and are ready to act.

**Suggested heading:**
> "Want to review this with George?"

**Suggested copy:**
> "For the first alpha users, George is offering a free 30-minute feedback session to review the report, check what feels accurate, and understand what should be improved."

**Actions:**
- Book feedback session (primary)
- Download report (secondary)

---

## 4. Alpha vs Future Production Behavior

### Alpha

- Feedback session CTA is visible and active.
- Download Report is active only when a working v3.1 PDF/export path exists.
- If download is not yet ready, either hide the button entirely or show it in a clearly disabled/placeholder state with a note that it is coming soon.
- Do not show a button that silently downloads the old score-based report. That would misrepresent the v3.1 result and confuse users.

### Future Production

- Download Report becomes a standard feature once the v3.1 export is stable.
- The feedback session CTA may be replaced, time-limited, made optional, or converted to a paid coaching or advisory CTA.
- The action layer should be configurable — which actions appear and in what state should not be hardcoded across multiple components.

---

## 5. Relationship to Current Internal Preview

The current `/internal/v31-report` route is internal. It is used for development and diagnostic review, not for production users.

The action layer may first be tested and refined inside the internal preview. This is a reasonable approach: it allows the CTA layout, copy, and link behavior to be validated before any production exposure.

The internal preview must not become a production surface just because actions are wired up. A separate decision must explicitly move the report to a production route and make it available to real users.

Action buttons must not call AI or write to Firestore by themselves. They are navigation and utility actions only.

---

## 6. Download Report Technical Options

### Option A — Browser Print / Print-to-PDF

**How:** Call `window.print()`. The browser renders the current page as a PDF using print media queries.

**Pros:**
- Fastest path from button to working download.
- Low implementation complexity.
- Renders the current v3.1 map-first report without a separate component.

**Cons:**
- Requires dedicated print CSS to suppress navigation, brand strip, and non-essential UI.
- Pagination may be rough — cards and the map may split awkwardly across pages.
- The SVG hub-and-spoke map may not export cleanly in all browsers.
- Limited control over header/footer in PDF output.

### Option B — Dedicated V31PdfReport Component

**How:** Build a `V31PdfReport` component (similar in role to the existing `PdfReport`) using `jsPDF` + `html2canvas` or a similar approach, but built from scratch against v3.1 view model fields.

**Pros:**
- Full control over PDF layout, pagination, and content ordering.
- Screen report and PDF report can differ — for example, the PDF may present the map as a legend-only summary rather than a pixel-rendered SVG.
- No legacy score logic can accidentally enter from `PdfReport`.

**Cons:**
- More implementation work than Option A.
- Must avoid duplicating view model transformation logic that already exists in `buildV31UserFacingReportViewModel.js`.

### Option C — Reuse Old PdfReport

**How:** Pass v3.1 data into the existing `PdfReport` component.

**Pros:**
- Existing code, no new component needed.

**Cons:**
- `PdfReport` is built around `careerMap`, `rank`, `aiDurabilityTone`, total fit score, and direction ranking — none of which exist in v3.1.
- Reusing it as-is would produce a document with wrong structure, missing fields, or legacy scoring concepts.
- Not recommended without a full audit and adaptation.

### Recommendation

Do not reuse `PdfReport` as-is.

For the first implementation: add the action layer and CTA (Bundle 20B) with a download placeholder. Then decide between Option A and Option B in Bundle 20C based on how the map renders in print preview and how much layout control is needed.

---

## 7. Feedback Session Technical Options

- Use an external Google Calendar appointment scheduler link (e.g., a Google Calendar appointment page or Google Meet booking link).
- Store the scheduler URL in a single config constant, not spread across multiple components. This makes it easy to update the link without a codebase search.
- Do not build custom scheduling logic. No backend call is needed.
- The button should render as a standard external link (`target="_blank"`, `rel="noopener noreferrer"`).
- No Firestore write is needed for the MVP. If tracking session bookings in Firestore becomes useful later, that is a separate decision.
- Calendly is not ruled out, but is not assumed. The decision is deferred until the link is ready.

---

## 8. Proposed Implementation Sequence

### Bundle 20B — Add internal report action bar / CTA block

- Add a top action bar to `/internal/v31-report` preview.
- Add a bottom CTA block.
- Wire up the Book Feedback Session button as an external link.
- Add Download Report as a placeholder only if a safe export path is available. Otherwise keep it clearly disabled or hidden.
- No PDF generation in this bundle.
- No production route changes.

### Bundle 20C — Decide and implement v3.1 print/export strategy

- Test `window.print()` against the current v3.1 report. Assess map rendering and pagination.
- If print-to-PDF is acceptable: add print CSS and activate the download button.
- If a dedicated PDF component is needed: scope `V31PdfReport` and build it.
- Do not reuse `PdfReport` without a full adaptation audit.

### Bundle 20D — Activate v3.1 downloadable report

- Active download button pointing to working v3.1 export.
- Verify the map renders correctly in the exported output.
- Confirm no legacy score or AI durability content appears in the download.
- No legacy score logic.

---

## 9. Safety Rules

- Do not show the old score-based report as the v3.1 report.
- Do not show "Strong Fit", total fit scores, or AI durability labels anywhere in the v3.1 report or its download.
- Do not show API cost, `pipelineStatus`, `source`, `qualityNotes`, `directionId`, or debug metadata in any user-facing surface.
- Do not expose internal route names (e.g. `/internal/v31-report`) to production users.
- Do not require login or authentication just to book a feedback session. The link is external.
- Do not trigger AI calls from action buttons.
- Do not write to Firestore from action buttons unless explicitly designed and approved in a future bundle.
- Do not modify `ResultsStep.jsx`, `PdfReport.jsx`, `CareerDirectionMap.jsx`, `scoring.js`, `directionEngineV14.js`, or `featureFlags.js` as part of the action layer work.
