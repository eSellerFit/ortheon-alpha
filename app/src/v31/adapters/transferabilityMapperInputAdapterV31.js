/**
 * Ortheon MVP Cut v3.1 — Transferability Mapper Input Adapter
 *
 * Purpose:
 * Build a TransferabilityMapperInputV31 object from:
 * - AssessmentSnapshotV31
 * - SynthesizedProfileV31
 *
 * This prepares the input package for AI Call 2, but does not call AI.
 *
 * Bundle 9B rule:
 * - Pure adapter only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

/**
 * @typedef {import("../contracts/assessmentSnapshotV31.js").AssessmentSnapshotV31} AssessmentSnapshotV31
 * @typedef {import("../contracts/profileSynthesizerContractsV31.js").SynthesizedProfileV31} SynthesizedProfileV31
 * @typedef {import("../contracts/transferabilityContractsV31.js").TransferabilityMapperInputV31} TransferabilityMapperInputV31
 */

import { TRANSFERABILITY_MAPPER_PROMPT_SPEC_V31 } from "../prompts/transferabilityMapperPromptSpecV31.js";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Build the local input package for Transferability Mapper.
 *
 * @param {AssessmentSnapshotV31} assessmentSnapshot
 * @param {SynthesizedProfileV31} synthesizedProfile
 * @returns {TransferabilityMapperInputV31}
 */
export function buildTransferabilityMapperInputV31(
  assessmentSnapshot,
  synthesizedProfile
) {
  if (!isObject(assessmentSnapshot)) {
    throw new Error(
      "buildTransferabilityMapperInputV31 expected an AssessmentSnapshotV31 object."
    );
  }

  if (assessmentSnapshot.version !== "v3.1") {
    throw new Error(
      "buildTransferabilityMapperInputV31 expected assessmentSnapshot.version to be v3.1."
    );
  }

  if (!isObject(synthesizedProfile)) {
    throw new Error(
      "buildTransferabilityMapperInputV31 expected a SynthesizedProfileV31 object."
    );
  }

  if (synthesizedProfile.version !== "v3.1") {
    throw new Error(
      "buildTransferabilityMapperInputV31 expected synthesizedProfile.version to be v3.1."
    );
  }

  if (synthesizedProfile.stage !== "profile_synthesis") {
    throw new Error(
      "buildTransferabilityMapperInputV31 expected synthesizedProfile.stage to be profile_synthesis."
    );
  }

  if (synthesizedProfile.assessmentId !== assessmentSnapshot.assessmentId) {
    throw new Error(
      "buildTransferabilityMapperInputV31 expected synthesizedProfile.assessmentId to match assessmentSnapshot.assessmentId."
    );
  }

  return {
    stage: "transferability_mapper_v31",
    instructionsVersion: TRANSFERABILITY_MAPPER_PROMPT_SPEC_V31.id,
    assessmentSnapshot,
    synthesizedProfile,
  };
}
