#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Firestore Persistence Dry-Run Debug Runner
 *
 * Purpose:
 * Build a sample v3.1 pipeline result payload and verify the Firestore
 * persistence adapter plan without writing anything.
 *
 * Bundle 15C-1 rule:
 * - Dry-run only.
 * - No live AI calls.
 * - No Firestore writes.
 * - No UI or production result-flow integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_FINAL_DIRECTION_PORTFOLIO_V31 } from "../../src/v31/debug/mockFinalDirectionPortfolioV31.js";
import { buildV31PipelineResultPayloadV31 } from "../../src/v31/persistence/buildV31PipelineResultPayload.js";
import { saveV31PipelineResultPayload } from "../../src/v31/persistence/v31FirestorePersistenceAdapter.js";

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

const result = await saveV31PipelineResultPayload(payload, { dryRun: true });
const plan = result.plan;

const summary = {
  ok: result.ok,
  dryRun: result.dryRun,
  wrote: result.wrote,
  assessmentId: plan.assessmentId,
  collectionName: plan.collectionName,
  documentId: plan.documentId,
  nestedFieldPath: plan.nestedFieldPath,
  forbiddenLegacyFieldsTouched: plan.forbiddenLegacyFieldsTouched,
  pipelineStatus: plan.payloadSummary.pipelineStatus,
  hasFinalPortfolio: plan.payloadSummary.hasFinalPortfolio,
  finalDirectionCount: plan.payloadSummary.finalDirectionCount,
};

console.log(JSON.stringify(summary, null, 2));
