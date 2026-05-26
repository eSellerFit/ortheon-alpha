#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — User-Facing Report View Model Debug Runner
 *
 * Bundle 18B — local debug only.
 * Uses mock portfolio data to test the user-facing report view model builder.
 *
 * Rules:
 * - No Firestore reads or writes.
 * - No AI calls.
 * - No API route calls.
 * - Uses MOCK_FINAL_DIRECTION_PORTFOLIO_V31 as input.
 * - Prints compact JSON summary only — no full view model output.
 */

import { MOCK_FINAL_DIRECTION_PORTFOLIO_V31 } from "../../src/v31/debug/mockFinalDirectionPortfolioV31.js";
import { buildV31PipelineResultPayloadV31 } from "../../src/v31/persistence/buildV31PipelineResultPayload.js";
import { buildV31ResultViewModelV31 } from "../../src/v31/viewer/buildV31ResultViewModel.js";
import { buildV31UserFacingReportViewModelV31 } from "../../src/v31/report/buildV31UserFacingReportViewModel.js";

// Build a mock V31PipelineResultPayload from the mock portfolio
const mockPayload = buildV31PipelineResultPayloadV31({
  assessmentId: MOCK_FINAL_DIRECTION_PORTFOLIO_V31.assessmentId,
  finalPortfolio: MOCK_FINAL_DIRECTION_PORTFOLIO_V31,
  pipelineSummary: {},
  guardrailSummary: {
    passed: true,
    guardrailStatuses: ["caution", "bridge_required", "bridge_required"],
    canShowAsCredibleNowValues: [true, false, false],
  },
  apiUsageSummary: {
    totalEstimatedCostUsd: 0,
    callCount: 0,
    perStageEstimatedCostUsd: {},
  },
  warnings: [],
  errors: [],
  source: "isolated_debug_runner",
  pipelineStatus: "passed",
});

// Build internal view model
const internalViewModel = buildV31ResultViewModelV31(mockPayload);

// Build user-facing report view model
const reportViewModel = buildV31UserFacingReportViewModelV31(internalViewModel);

// Print compact summary — no full view model, no raw data
const primaryDir = reportViewModel.primaryDirection;

console.log(
  JSON.stringify(
    {
      version: reportViewModel.version,
      stage: reportViewModel.stage,
      assessmentId: reportViewModel.assessmentId,
      directionCount: reportViewModel.reportMeta.directionCount,
      rejectedDirectionCount: reportViewModel.reportMeta.rejectedDirectionCount,
      primaryDirectionLabel: primaryDir?.label || null,
      bridgeDirectionCount: reportViewModel.bridgeDirections.length,
      exploratoryDirectionCount: reportViewModel.exploratoryDirections.length,
      statusMix: reportViewModel.cover.statusMix,
      next30DayActionCount: reportViewModel.validationPlan.next30Days.length,
      keySignalsCaveatCount: reportViewModel.keySignals.caveats.length,
      confidenceNotesCaveatCount: reportViewModel.confidenceNotes.caveats.length,
      confidenceNoteCount:
        reportViewModel.confidenceNotes.caveats.length +
        reportViewModel.confidenceNotes.missingEvidence.length +
        reportViewModel.confidenceNotes.lowConfidenceReasons.length,
    },
    null,
    2
  )
);
