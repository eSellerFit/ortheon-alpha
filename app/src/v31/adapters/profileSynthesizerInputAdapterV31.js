/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer Input Adapter
 *
 * Purpose:
 * Build a ProfileSynthesizerInputV31 object from an AssessmentSnapshotV31.
 *
 * This prepares the input package for AI Call 1, but does not call AI.
 *
 * Bundle 6 rule:
 * - Pure adapter only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

/**
 * @typedef {import("../contracts/assessmentSnapshotV31.js").AssessmentSnapshotV31} AssessmentSnapshotV31
 * @typedef {import("../contracts/profileSynthesizerContractsV31.js").ProfileSynthesizerInputV31} ProfileSynthesizerInputV31
 */

import { PROFILE_SYNTHESIZER_PROMPT_SPEC_V31 } from "../prompts/profileSynthesizerPromptSpecV31.js";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Build the local input package for Profile Synthesizer.
 *
 * @param {AssessmentSnapshotV31} assessmentSnapshot
 * @returns {ProfileSynthesizerInputV31}
 */
export function buildProfileSynthesizerInputV31(assessmentSnapshot) {
  if (!isObject(assessmentSnapshot)) {
    throw new Error(
      "buildProfileSynthesizerInputV31 expected an AssessmentSnapshotV31 object."
    );
  }

  if (assessmentSnapshot.version !== "v3.1") {
    throw new Error(
      "buildProfileSynthesizerInputV31 expected assessmentSnapshot.version to be v3.1."
    );
  }

  return {
    stage: "profile_synthesizer_v31",
    instructionsVersion: PROFILE_SYNTHESIZER_PROMPT_SPEC_V31.id,
    assessmentSnapshot,
  };
}
