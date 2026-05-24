#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Transferability Mapper Local Debug Runner
 *
 * Purpose:
 * Run the local chain:
 * sample assessment
 * → AssessmentSnapshotV31
 * → mock SynthesizedProfileV31
 * → TransferabilityMapperInputV31
 * → mock TransferabilityMapV31
 * → validation summary
 *
 * Bundle 9B rule:
 * - Local debug runner only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No UI integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildTransferabilityMapperInputV31 } from "../../src/v31/adapters/transferabilityMapperInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";
import { MOCK_TRANSFERABILITY_MAP_V31 } from "../../src/v31/debug/mockTransferabilityMapV31.js";
import { validateTransferabilityMapV31 } from "../../src/v31/validators/transferabilityMapValidatorV31.js";

const snapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);

const transferabilityMapperInput = buildTransferabilityMapperInputV31(
  snapshot,
  MOCK_SYNTHESIZED_PROFILE_V31
);

const validation = validateTransferabilityMapV31(
  MOCK_TRANSFERABILITY_MAP_V31
);

const summary = {
  input: {
    stage: transferabilityMapperInput.stage,
    instructionsVersion: transferabilityMapperInput.instructionsVersion,
    assessmentId: transferabilityMapperInput.assessmentSnapshot.assessmentId,
    synthesizedProfileStage:
      transferabilityMapperInput.synthesizedProfile.stage,
    marketIdentity:
      transferabilityMapperInput.synthesizedProfile.profileSummary
        .marketIdentity,
  },

  mockOutput: {
    version: MOCK_TRANSFERABILITY_MAP_V31.version,
    stage: MOCK_TRANSFERABILITY_MAP_V31.stage,
    assessmentId: MOCK_TRANSFERABILITY_MAP_V31.assessmentId,
    transferableAssetCount:
      MOCK_TRANSFERABILITY_MAP_V31.transferableAssets.length,
    credibilityBridgeCount:
      MOCK_TRANSFERABILITY_MAP_V31.credibilityBridges.length,
    possibleDirectionArenaCount:
      MOCK_TRANSFERABILITY_MAP_V31.possibleDirectionArenas.length,
    riskyAssumptionCount:
      MOCK_TRANSFERABILITY_MAP_V31.nonTransferableOrRiskyAssumptions.length,
  },

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
