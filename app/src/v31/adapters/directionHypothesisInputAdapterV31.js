/**
 * Ortheon MVP Cut v3.1 — Direction Hypothesis Generator Input Adapter
 *
 * Purpose:
 * Build a DirectionHypothesisInputV31 object from:
 * - AssessmentSnapshotV31
 * - SynthesizedProfileV31
 * - TransferabilityMapV31
 *
 * This prepares the local input package for AI Call 3, but does not call AI.
 *
 * Bundle 11B rule:
 * - Pure adapter only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

/**
 * @typedef {import("../contracts/assessmentSnapshotV31.js").AssessmentSnapshotV31} AssessmentSnapshotV31
 * @typedef {import("../contracts/profileSynthesizerContractsV31.js").SynthesizedProfileV31} SynthesizedProfileV31
 * @typedef {import("../contracts/transferabilityContractsV31.js").TransferabilityMapV31} TransferabilityMapV31
 * @typedef {import("../contracts/directionHypothesisContractsV31.js").DirectionHypothesisInputV31} DirectionHypothesisInputV31
 */

import { DIRECTION_HYPOTHESIS_GENERATOR_PROMPT_SPEC_V31 } from "../prompts/directionHypothesisGeneratorPromptSpecV31.js";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Build the local input package for Direction Hypothesis Generator.
 *
 * @param {AssessmentSnapshotV31} assessmentSnapshot
 * @param {SynthesizedProfileV31} synthesizedProfile
 * @param {TransferabilityMapV31} transferabilityMap
 * @returns {DirectionHypothesisInputV31}
 */
export function buildDirectionHypothesisInputV31(
  assessmentSnapshot,
  synthesizedProfile,
  transferabilityMap
) {
  if (!isObject(assessmentSnapshot)) {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected an AssessmentSnapshotV31 object."
    );
  }

  if (assessmentSnapshot.version !== "v3.1") {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected assessmentSnapshot.version to be v3.1."
    );
  }

  if (!isObject(synthesizedProfile)) {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected a SynthesizedProfileV31 object."
    );
  }

  if (synthesizedProfile.version !== "v3.1") {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected synthesizedProfile.version to be v3.1."
    );
  }

  if (synthesizedProfile.stage !== "profile_synthesis") {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected synthesizedProfile.stage to be profile_synthesis."
    );
  }

  if (!isObject(transferabilityMap)) {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected a TransferabilityMapV31 object."
    );
  }

  if (transferabilityMap.version !== "v3.1") {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected transferabilityMap.version to be v3.1."
    );
  }

  if (transferabilityMap.stage !== "transferability_mapping") {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected transferabilityMap.stage to be transferability_mapping."
    );
  }

  if (synthesizedProfile.assessmentId !== assessmentSnapshot.assessmentId) {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected synthesizedProfile.assessmentId to match assessmentSnapshot.assessmentId."
    );
  }

  if (transferabilityMap.assessmentId !== assessmentSnapshot.assessmentId) {
    throw new Error(
      "buildDirectionHypothesisInputV31 expected transferabilityMap.assessmentId to match assessmentSnapshot.assessmentId."
    );
  }

  return {
    stage: "direction_hypothesis_generator_v31",
    instructionsVersion: DIRECTION_HYPOTHESIS_GENERATOR_PROMPT_SPEC_V31.id,
    assessmentSnapshot,
    synthesizedProfile,
    transferabilityMap,
  };
}
