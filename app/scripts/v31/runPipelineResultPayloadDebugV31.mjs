#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Pipeline Result Payload Debug Runner
 *
 * Purpose:
 * Build a sample isolated v3.1 persistence payload using local mock data.
 *
 * Bundle 15A rule:
 * - Local debug runner only.
 * - No live AI calls.
 * - No API calls.
 * - No Firestore writes.
 * - No production result-flow integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_FINAL_DIRECTION_PORTFOLIO_V31 } from "../../src/v31/debug/mockFinalDirectionPortfolioV31.js";
import { buildV31PipelineResultPayloadV31 } from "../../src/v31/persistence/buildV31PipelineResultPayload.js";

const assessmentSnapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);

const payload = buildV31PipelineResultPayloadV31({
  assessmentId: assessmentSnapshot.assessmentId,
  finalPortfolio: MOCK_FINAL_DIRECTION_PORTFOLIO_V31,
  source: "isolated_debug_runner",
  pipelineStatus: "passed",
  pipelineSummary: {
    profileSynthesizer: { validationPassed: true },
    transferabilityMapper: { validationPassed: true },
    directionHypothesisGenerator: { validationPassed: true },
    guardrails: { passed: true },
    portfolioComposer: { validationPassed: true },
  },
  apiUsageSummary: {
    totalEstimatedCostUsd: 0,
    callCount: 0,
  },
  warnings: [],
  errors: [],
});

const summary = {
  version: payload.version,
  stage: payload.stage,
  assessmentId: payload.assessmentId,
  pipelineStatus: payload.pipelineStatus,
  source: payload.source,
  hasFinalPortfolio: Boolean(payload.finalPortfolio),
  finalDirectionCount: payload.finalPortfolio?.directions?.length || 0,
  auditTrailCount: payload.auditTrail.length,
  warningCount: payload.warnings.length,
  errorCount: payload.errors.length,
};

console.log(JSON.stringify(summary, null, 2));
