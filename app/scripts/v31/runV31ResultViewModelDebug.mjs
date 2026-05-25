#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Result View Model Debug Runner
 *
 * Purpose:
 * Build a mock V31PipelineResultPayload and convert it into a compact
 * UI-safe view model.
 *
 * Bundle 16B rule:
 * - Local mock runner only.
 * - No Firestore reads/writes.
 * - No AI calls.
 * - No API calls.
 */

import { MOCK_FINAL_DIRECTION_PORTFOLIO_V31 } from "../../src/v31/debug/mockFinalDirectionPortfolioV31.js";
import { buildV31PipelineResultPayloadV31 } from "../../src/v31/persistence/buildV31PipelineResultPayload.js";
import { buildV31ResultViewModelV31 } from "../../src/v31/viewer/buildV31ResultViewModel.js";

const payload = buildV31PipelineResultPayloadV31({
  assessmentId: MOCK_FINAL_DIRECTION_PORTFOLIO_V31.assessmentId,
  finalPortfolio: MOCK_FINAL_DIRECTION_PORTFOLIO_V31,
  source: "isolated_debug_runner",
  pipelineStatus: "passed",
  guardrailSummary: {
    passed: true,
    guardrailStatuses: ["bridge_required", "clear", "bridge_required"],
    canShowAsCredibleNowValues: [false, true, false],
  },
  apiUsageSummary: {
    totalEstimatedCostUsd: 0,
    callCount: 0,
  },
  warnings: [],
  errors: [],
});

const viewModel = buildV31ResultViewModelV31(payload);

const summary = {
  version: viewModel.version,
  stage: viewModel.stage,
  assessmentId: viewModel.assessmentId,
  pipelineStatus: viewModel.pipelineStatus,
  directionCount: viewModel.directions.length,
  labels: viewModel.directions.map((direction) => direction.label),
  displayOrders: viewModel.directions.map(
    (direction) => direction.displayOrder
  ),
  rejectedDirectionCount: viewModel.rejectedDirections.length,
  apiCallCount: viewModel.metrics.apiCallCount,
  totalEstimatedCostUsd: viewModel.metrics.totalEstimatedCostUsd,
  warningCount: viewModel.warnings.length,
  errorCount: viewModel.errors.length,
};

console.log(JSON.stringify(summary, null, 2));
