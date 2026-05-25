/**
 * Ortheon MVP Cut v3.1 — Portfolio Composer Input Adapter
 *
 * Purpose:
 * Build a PortfolioCriticInputV31 object from the completed local v3.1 chain.
 *
 * Bundle 13B rule:
 * - Pure adapter only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

/**
 * @typedef {import("../contracts/portfolioContractsV31.js").PortfolioCriticInputV31} PortfolioCriticInputV31
 */

import { PORTFOLIO_COMPOSER_PROMPT_SPEC_V31 } from "../prompts/portfolioComposerPromptSpecV31.js";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertAssessmentIdMatches(value, assessmentId, label) {
  if (!value || !isObject(value) || !value.assessmentId) return;

  if (value.assessmentId !== assessmentId) {
    throw new Error(
      `buildPortfolioComposerInputV31 expected ${label}.assessmentId to match assessmentSnapshot.assessmentId.`
    );
  }
}

/**
 * Build the local input package for Portfolio Composer.
 *
 * @param {Object} params
 * @returns {PortfolioCriticInputV31}
 */
export function buildPortfolioComposerInputV31({
  assessmentSnapshot,
  synthesizedProfile,
  transferabilityMap,
  directionHypotheses,
  financialModel = null,
  hardConstraints = null,
  guardrailValidation = null,
  qualityOverDiversityValidation = null,
}) {
  if (!isObject(assessmentSnapshot)) {
    throw new Error(
      "buildPortfolioComposerInputV31 expected an AssessmentSnapshotV31 object."
    );
  }

  if (assessmentSnapshot.version !== "v3.1") {
    throw new Error(
      "buildPortfolioComposerInputV31 expected assessmentSnapshot.version to be v3.1."
    );
  }

  if (!isObject(synthesizedProfile)) {
    throw new Error(
      "buildPortfolioComposerInputV31 expected a SynthesizedProfileV31 object."
    );
  }

  if (synthesizedProfile.version !== "v3.1") {
    throw new Error(
      "buildPortfolioComposerInputV31 expected synthesizedProfile.version to be v3.1."
    );
  }

  if (synthesizedProfile.stage !== "profile_synthesis") {
    throw new Error(
      "buildPortfolioComposerInputV31 expected synthesizedProfile.stage to be profile_synthesis."
    );
  }

  if (!isObject(transferabilityMap)) {
    throw new Error(
      "buildPortfolioComposerInputV31 expected a TransferabilityMapV31 object."
    );
  }

  if (transferabilityMap.version !== "v3.1") {
    throw new Error(
      "buildPortfolioComposerInputV31 expected transferabilityMap.version to be v3.1."
    );
  }

  if (transferabilityMap.stage !== "transferability_mapping") {
    throw new Error(
      "buildPortfolioComposerInputV31 expected transferabilityMap.stage to be transferability_mapping."
    );
  }

  if (!Array.isArray(directionHypotheses)) {
    throw new Error(
      "buildPortfolioComposerInputV31 expected directionHypotheses to be an array."
    );
  }

  const assessmentId = assessmentSnapshot.assessmentId;

  assertAssessmentIdMatches(
    synthesizedProfile,
    assessmentId,
    "synthesizedProfile"
  );
  assertAssessmentIdMatches(
    transferabilityMap,
    assessmentId,
    "transferabilityMap"
  );
  assertAssessmentIdMatches(financialModel, assessmentId, "financialModel");
  assertAssessmentIdMatches(hardConstraints, assessmentId, "hardConstraints");
  assertAssessmentIdMatches(
    guardrailValidation,
    assessmentId,
    "guardrailValidation"
  );

  directionHypotheses.forEach((hypothesis, index) => {
    if (
      isObject(hypothesis) &&
      hypothesis.assessmentId &&
      hypothesis.assessmentId !== assessmentId
    ) {
      throw new Error(
        `buildPortfolioComposerInputV31 expected directionHypotheses.${index}.assessmentId to match assessmentSnapshot.assessmentId.`
      );
    }
  });

  return {
    stage: "portfolio_composer_v31",
    instructionsVersion: PORTFOLIO_COMPOSER_PROMPT_SPEC_V31.id,
    assessmentSnapshot,
    synthesizedProfile,
    transferabilityMap,
    directionHypotheses,
    financialModel,
    hardConstraints,
    guardrailValidation,
    qualityOverDiversityValidation,
  };
}
