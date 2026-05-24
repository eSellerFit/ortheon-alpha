#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer Local Debug Runner
 *
 * Purpose:
 * Run the local chain:
 * sample assessment
 * → AssessmentSnapshotV31
 * → ProfileSynthesizerInputV31
 * → mock SynthesizedProfileV31
 * → validation summary
 *
 * Bundle 6 rule:
 * - Local debug runner only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No UI integration.
 */

import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildProfileSynthesizerInputV31 } from "../../src/v31/adapters/profileSynthesizerInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";
import { validateSynthesizedProfileV31 } from "../../src/v31/validators/profileSynthesizerValidatorV31.js";

const snapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);
const profileSynthesizerInput = buildProfileSynthesizerInputV31(snapshot);
const validation = validateSynthesizedProfileV31(MOCK_SYNTHESIZED_PROFILE_V31);

const summary = {
  input: {
    stage: profileSynthesizerInput.stage,
    instructionsVersion: profileSynthesizerInput.instructionsVersion,
    assessmentId: profileSynthesizerInput.assessmentSnapshot.assessmentId,
    currentRole: profileSynthesizerInput.assessmentSnapshot.identity.currentRole,
  },
  mockOutput: {
    version: MOCK_SYNTHESIZED_PROFILE_V31.version,
    stage: MOCK_SYNTHESIZED_PROFILE_V31.stage,
    assessmentId: MOCK_SYNTHESIZED_PROFILE_V31.assessmentId,
    marketIdentity:
      MOCK_SYNTHESIZED_PROFILE_V31.profileSummary.marketIdentity,
    strongestCompetencyCount:
      MOCK_SYNTHESIZED_PROFILE_V31.competencySignals.strongestCompetencies
        .length,
    careerCapitalFunctionalExperienceCount:
      MOCK_SYNTHESIZED_PROFILE_V31.careerCapital.functionalExperience.length,
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
