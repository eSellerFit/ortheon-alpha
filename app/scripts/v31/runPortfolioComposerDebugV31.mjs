#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Portfolio Composer Local Debug Runner
 *
 * Purpose:
 * Run the local chain through PortfolioComposerInputV31 and validate a mock
 * FinalDirectionPortfolioV31.
 *
 * Bundle 13B rule:
 * - Local debug runner only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No UI integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildPortfolioComposerInputV31 } from "../../src/v31/adapters/portfolioComposerInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";
import { MOCK_TRANSFERABILITY_MAP_V31 } from "../../src/v31/debug/mockTransferabilityMapV31.js";
import { MOCK_DIRECTION_HYPOTHESES_V31 } from "../../src/v31/debug/mockDirectionHypothesesV31.js";
import { MOCK_FINAL_DIRECTION_PORTFOLIO_V31 } from "../../src/v31/debug/mockFinalDirectionPortfolioV31.js";
import {
  buildFinancialModelV31,
  evaluateHardConstraintsV31,
  buildGuardrailValidationV31,
  validateHypothesisQualityOverDiversityV31,
} from "../../src/v31/guardrails/index.js";
import { validateFinalDirectionPortfolioV31 } from "../../src/v31/validators/finalPortfolioValidatorV31.js";

const snapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);

const financialModel = buildFinancialModelV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31
);

const hardConstraints = evaluateHardConstraintsV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31
);

const guardrailValidation = buildGuardrailValidationV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31,
  financialModel,
  hardConstraints
);

const qualityOverDiversityValidation =
  validateHypothesisQualityOverDiversityV31(
    MOCK_DIRECTION_HYPOTHESES_V31,
    guardrailValidation
  );

const portfolioComposerInput = buildPortfolioComposerInputV31({
  assessmentSnapshot: snapshot,
  synthesizedProfile: MOCK_SYNTHESIZED_PROFILE_V31,
  transferabilityMap: MOCK_TRANSFERABILITY_MAP_V31,
  directionHypotheses: MOCK_DIRECTION_HYPOTHESES_V31,
  financialModel,
  hardConstraints,
  guardrailValidation,
  qualityOverDiversityValidation,
});

const validation = validateFinalDirectionPortfolioV31(
  MOCK_FINAL_DIRECTION_PORTFOLIO_V31
);

const guardrailStatusCounts =
  guardrailValidation.directionGuardrails.reduce((acc, guardrail) => {
    acc[guardrail.guardrailStatus] =
      (acc[guardrail.guardrailStatus] || 0) + 1;
    return acc;
  }, {});

const summary = {
  input: {
    stage: portfolioComposerInput.stage,
    instructionsVersion: portfolioComposerInput.instructionsVersion,
    assessmentId: portfolioComposerInput.assessmentSnapshot.assessmentId,
  },
  directionHypothesisCount: portfolioComposerInput.directionHypotheses.length,
  guardrailStatusCounts,
  finalDirectionCount: MOCK_FINAL_DIRECTION_PORTFOLIO_V31.directions.length,
  displayOrders: MOCK_FINAL_DIRECTION_PORTFOLIO_V31.directions.map(
    (direction) => direction.displayOrder
  ),
  validation: {
    passed: validation.passed,
    issueCount: validation.issueCount,
    issues: validation.issues,
  },
};

console.log(JSON.stringify(summary, null, 2));

if (!validation.passed) {
  process.exitCode = 1;
}
