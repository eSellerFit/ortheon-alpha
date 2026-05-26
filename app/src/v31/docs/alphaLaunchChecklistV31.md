# Ortheon v3.1 — Alpha Launch Checklist

## 1. Current MVP state

| Component | Status |
|-----------|--------|
| v3.1 AI pipeline (4 stages) | Complete |
| Deterministic portfolio policy | Complete |
| User-facing report page (`/report`) | Complete |
| Internal report preview (`/internal/v31-report`) | Complete |
| PDF download | Complete (enabled) |
| 30-minute review booking CTA | Complete |
| AI Durability ratings (D0–D4) | Complete |
| Career direction map | Complete |
| 30-day validation plan | Complete |

---

## 2. Alpha user flow

1. User completes assessment (existing flow, unchanged)
2. Founder runs v3.1 pipeline manually to generate `v31Result`
3. Founder sends user a report link:
   `https://[domain]/report?documentId=[assessmentId]`
4. User opens report, reviews directions and validation plan
5. User downloads PDF (optional)
6. User books 30-minute review session via CTA
7. Founder conducts review session and collects feedback

---

## 3. Manual operating process

**Sending a report link:**
- Retrieve the `assessmentId` from Firestore
- Send link: `/report?documentId=<assessmentId>`
- No login or account required on the user side

**Running the v3.1 pipeline:**
```
node scripts/v31/runV31IsolatedDebugRunner.mjs \
  --document-id=<assessmentId> \
  --write
```
Only run with `--write` after reviewing dry-run output.

**Checking pipeline output (dry run, no write):**
```
node scripts/v31/runV31IsolatedDebugRunner.mjs \
  --document-id=<assessmentId>
```

**Verifying a result is stored:**
```
node scripts/v31/runV31ResultReadDebug.mjs \
  --document-id=<assessmentId>
```
Expect: `hasV31Result: true`, `pipelineStatus: "passed"`, `finalDirectionCount >= 1`

---

## 4. What is intentionally not automated yet

- Automatic email delivery of report links
- Admin dashboard or queue for pending assessments
- Full user account system (login, saved reports)
- Analytics funnel (funnel drop-off, report engagement)
- Report regeneration UI (currently CLI only)
- Mentor or coach dashboard
- PDF styling v2 (visual polish)
- Automated quality gates on pipeline output beyond existing validators

---

## 5. Pre-launch checklist

Before sending the first alpha report link, verify:

- [ ] Firestore result exists for the target `assessmentId`  
      (`runV31ResultReadDebug.mjs --document-id=...` → `hasV31Result: true`)
- [ ] Pipeline status is `passed` and `finalDirectionCount >= 1`
- [ ] Report loads at `/report?documentId=...`
- [ ] Direction map renders with correct directions
- [ ] AI Durability ratings appear on map nodes and direction cards
- [ ] 30-day validation plan has at least one action item
- [ ] PDF download button is active and generates a clean file
- [ ] Booking CTA opens calendar link in new tab
- [ ] Report loads without console errors

---

## 6. Known limitations

- Report link access is not gated by auth — anyone with the link can view
- PDF is a 4-page static layout; no branded cover page yet
- Only one pipeline run per assessment (no re-run UI)
- Report is in English only
- AI Durability ratings require `aiDurability` field in `v31Result`; older results may not have it
- The direction map uses fixed slot positions; layout is optimised for 2 directions

---

## 7. Stop rules / do-not-polish rules

**Do not change before alpha users:**
- Pipeline methodology or prompts
- Portfolio policy logic
- Firestore data model
- Report view model builder
- AI Durability scale or labels

**Do not add before alpha feedback:**
- New report sections
- New UI features
- New pipeline stages
- Admin tooling
- Account/auth system

**Resume polish only if:**
- A user cannot understand what a direction means
- A user cannot use the PDF or booking CTA
- Output from the pipeline is demonstrably wrong for a real case

Everything else waits for alpha feedback.
