#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Guarded Firestore Write Debug Runner
 *
 * Purpose:
 * Manually test v3.1 result persistence behavior without live AI calls.
 *
 * Bundle 15C-3 rule:
 * - Default mode is dry-run.
 * - Real write requires --write plus adapter guards and
 *   V31_ENABLE_FIRESTORE_WRITE=true.
 * - No UI or production result-flow integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_FINAL_DIRECTION_PORTFOLIO_V31 } from "../../src/v31/debug/mockFinalDirectionPortfolioV31.js";
import { buildV31PipelineResultPayloadV31 } from "../../src/v31/persistence/buildV31PipelineResultPayload.js";
import { saveV31PipelineResultPayload } from "../../src/v31/persistence/v31FirestorePersistenceAdapter.js";

function parseArgs(argv) {
  return argv.reduce(
    (acc, arg) => {
      if (arg === "--write") {
        acc.write = true;
        return acc;
      }

      if (arg.startsWith("--document-id=")) {
        acc.documentId = arg.slice("--document-id=".length).trim();
        return acc;
      }

      if (arg.startsWith("--assessment-id=")) {
        acc.assessmentId = arg.slice("--assessment-id=".length).trim();
        return acc;
      }

      return acc;
    },
    {
      write: false,
      documentId: null,
      assessmentId: null,
    }
  );
}

const args = parseArgs(process.argv.slice(2));
const assessmentSnapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);
const assessmentId = args.assessmentId || assessmentSnapshot.assessmentId;
const documentId = args.documentId || assessmentId;

const finalPortfolio = {
  ...MOCK_FINAL_DIRECTION_PORTFOLIO_V31,
  assessmentId,
};

const payload = buildV31PipelineResultPayloadV31({
  assessmentId,
  finalPortfolio,
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

const result = args.write
  ? await saveV31PipelineResultPayload(payload, {
      dryRun: false,
      confirmWrite: true,
      debugOnly: true,
      documentId,
      requireExistingDocument: true,
    })
  : await saveV31PipelineResultPayload(payload, {
      dryRun: true,
      documentId,
    });

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
  documentExistsBeforeWrite: result.documentExistsBeforeWrite ?? null,
  pipelineStatus: plan.payloadSummary.pipelineStatus,
  hasFinalPortfolio: plan.payloadSummary.hasFinalPortfolio,
  finalDirectionCount: plan.payloadSummary.finalDirectionCount,
};

console.log(JSON.stringify(summary, null, 2));
