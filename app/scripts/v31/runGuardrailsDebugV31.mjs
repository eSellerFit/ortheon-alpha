#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Guardrails Local Debug Runner
 *
 * Purpose:
 * Run the local deterministic guardrail chain over mock direction hypotheses.
 *
 * Bundle 12A rule:
 * - Local debug runner only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No UI integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_DIRECTION_HYPOTHESES_V31 } from "../../src/v31/debug/mockDirectionHypothesesV31.js";
import {
  buildFinancialModelV31,
  evaluateHardConstraintsV31,
  buildGuardrailValidationV31,
  validateHypothesisQualityOverDiversityV31,
} from "../../src/v31/guardrails/index.js";

const snapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);

const financialModel = buildFinancialModelV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31
);

const hardConstraintResult = evaluateHardConstraintsV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31
);

const guardrailValidation = buildGuardrailValidationV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31,
  financialModel,
  hardConstraintResult
);

const qualityValidation = validateHypothesisQualityOverDiversityV31(
  MOCK_DIRECTION_HYPOTHESES_V31,
  guardrailValidation
);

const structuralFailure =
  !financialModel ||
  !hardConstraintResult ||
  !guardrailValidation ||
  !qualityValidation;

const summary = {
  assessmentId: snapshot.assessmentId,
  hypothesisCount: MOCK_DIRECTION_HYPOTHESES_V31.length,
  financialPressureLevel: financialModel?.financialPressureLevel || null,
  financialWarningsCount: financialModel?.financialWarnings?.length || 0,
  hardConstraintWarningCount:
    hardConstraintResult?.globalConstraintWarnings?.length || 0,
  guardrailStatuses: guardrailValidation?.directionGuardrails?.map(
    (guardrail) => guardrail.guardrailStatus
  ),
  canShowAsCredibleNowValues: guardrailValidation?.directionGuardrails?.map(
    (guardrail) => guardrail.canShowAsCredibleNow
  ),
  qualityStatuses: qualityValidation?.hypothesisQualitySignals?.map(
    (signal) => signal.qualityStatus
  ),
  passed: guardrailValidation?.passed === true && !structuralFailure,
  missingInputCounts: {
    financial: financialModel?.missingFinancialInputs?.length || 0,
    constraint: hardConstraintResult?.missingConstraintInputs?.length || 0,
    guardrail: guardrailValidation?.missingInputs?.length || 0,
  },
};

console.log(JSON.stringify(summary, null, 2));

if (structuralFailure) {
  process.exitCode = 1;
}
