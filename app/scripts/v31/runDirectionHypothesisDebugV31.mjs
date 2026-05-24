#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Direction Hypothesis Local Debug Runner
 *
 * Purpose:
 * Run the local chain:
 * sample assessment
 * → AssessmentSnapshotV31
 * → mock SynthesizedProfileV31
 * → mock TransferabilityMapV31
 * → DirectionHypothesisInputV31
 * → mock DirectionHypothesisV31[]
 * → validation summary
 *
 * Bundle 11B rule:
 * - Local debug runner only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No UI integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildDirectionHypothesisInputV31 } from "../../src/v31/adapters/directionHypothesisInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";
import { MOCK_TRANSFERABILITY_MAP_V31 } from "../../src/v31/debug/mockTransferabilityMapV31.js";
import { MOCK_DIRECTION_HYPOTHESES_V31 } from "../../src/v31/debug/mockDirectionHypothesesV31.js";
import { validateDirectionHypothesesV31 } from "../../src/v31/validators/directionHypothesisValidatorV31.js";

const snapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);

const directionHypothesisInput = buildDirectionHypothesisInputV31(
  snapshot,
  MOCK_SYNTHESIZED_PROFILE_V31,
  MOCK_TRANSFERABILITY_MAP_V31
);

const validation = validateDirectionHypothesesV31(
  MOCK_DIRECTION_HYPOTHESES_V31
);

const summary = {
  input: {
    stage: directionHypothesisInput.stage,
    instructionsVersion: directionHypothesisInput.instructionsVersion,
    assessmentId: directionHypothesisInput.assessmentSnapshot.assessmentId,
    synthesizedProfileStage: directionHypothesisInput.synthesizedProfile.stage,
    transferabilityMapStage: directionHypothesisInput.transferabilityMap.stage,
  },

  hypothesisCount: MOCK_DIRECTION_HYPOTHESES_V31.length,
  sourceTransferableAssetCounts: MOCK_DIRECTION_HYPOTHESES_V31.map(
    (hypothesis) => hypothesis.sourceTransferableAssets.length
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
