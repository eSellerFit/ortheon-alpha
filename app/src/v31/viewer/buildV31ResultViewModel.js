/**
 * Ortheon MVP Cut v3.1 — Result View Model Builder
 *
 * Purpose:
 * Convert a saved V31PipelineResultPayload-like object into a compact,
 * UI-safe read-only view model for a future internal/debug viewer.
 *
 * Bundle 16B rule:
 * - Pure deterministic function.
 * - No Firestore reads/writes.
 * - No AI calls.
 * - No API calls.
 * - No production imports.
 */

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function objectOrEmpty(value) {
  return isObject(value) ? value : {};
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function stringOrEmpty(value) {
  if (value === null || value === undefined) return "";

  return String(value);
}

function numberOrZero(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function booleanOrFalse(value) {
  return typeof value === "boolean" ? value : false;
}

function stringArray(value) {
  return arrayOrEmpty(value).map((item) => stringOrEmpty(item));
}

function normalizeDirection(direction) {
  const source = objectOrEmpty(direction);

  return {
    directionId: stringOrEmpty(source.directionId),
    displayOrder: numberOrZero(source.displayOrder),
    label: stringOrEmpty(source.label),
    directionArena: stringOrEmpty(source.directionArena),
    recommendationType: stringOrEmpty(source.recommendationType),
    confidence: stringOrEmpty(source.confidence),
    routeType: stringOrEmpty(source.routeType),
    workModel: stringOrEmpty(source.workModel),
    seniorityComplexityLevel: stringOrEmpty(source.seniorityComplexityLevel),
    whyItFits: stringArray(source.whyItFits),
    whyItIsCredible: stringArray(source.whyItIsCredible),
    whatMakesItRisky: stringArray(source.whatMakesItRisky),
    constraintsAndWarnings: stringArray(source.constraintsAndWarnings),
    firstValidationStep: stringOrEmpty(source.firstValidationStep),
    bridgeStrategy: stringOrEmpty(source.bridgeStrategy),
    notRecommendedIf: stringArray(source.notRecommendedIf),
    evidence: stringArray(source.evidence),
  };
}

function normalizeRejectedDirection(direction) {
  const source = objectOrEmpty(direction);

  return {
    directionId: stringOrEmpty(source.directionId),
    label: stringOrEmpty(source.label),
    reasonRejected: stringOrEmpty(source.reasonRejected),
    supportingConcerns: stringArray(source.supportingConcerns),
  };
}

/**
 * Build a compact read-only v3.1 result view model.
 *
 * @param {Object} v31Result V31PipelineResultPayload-like object.
 * @returns {Object}
 */
export function buildV31ResultViewModelV31(v31Result) {
  const source = objectOrEmpty(v31Result);
  const finalPortfolio = objectOrEmpty(source.finalPortfolio);
  const portfolioSummary = objectOrEmpty(finalPortfolio.portfolioSummary);
  const narrative = objectOrEmpty(finalPortfolio.userFacingNarrative);
  const apiUsageSummary = objectOrEmpty(source.apiUsageSummary);
  const guardrailSummary = objectOrEmpty(source.guardrailSummary);
  const directions = arrayOrEmpty(finalPortfolio.directions)
    .map((direction) => normalizeDirection(direction))
    .sort((left, right) => left.displayOrder - right.displayOrder);
  const rejectedDirections = arrayOrEmpty(finalPortfolio.rejectedDirections).map(
    (direction) => normalizeRejectedDirection(direction)
  );
  const warnings = stringArray(source.warnings);
  const errors = arrayOrEmpty(source.errors);

  return {
    version: stringOrEmpty(source.version),
    stage: "v31_result_view_model",
    assessmentId: stringOrEmpty(source.assessmentId),
    pipelineStatus: stringOrEmpty(source.pipelineStatus),
    generatedAt: stringOrEmpty(source.generatedAt),
    source: stringOrEmpty(source.source),
    summary: {
      headline: stringOrEmpty(narrative.headline),
      summary: stringOrEmpty(narrative.summary),
      nextStepAdvice: stringOrEmpty(narrative.nextStepAdvice),
      recommendedStrategy: stringOrEmpty(
        portfolioSummary.recommendedStrategy
      ),
      mainTension: stringOrEmpty(portfolioSummary.mainTension),
    },
    directions,
    rejectedDirections,
    caveats: stringArray(narrative.caveats),
    missingInputsAffectingConfidence: stringArray(
      finalPortfolio.missingInputsAffectingConfidence
    ),
    qualityNotes: stringArray(finalPortfolio.qualityNotes),
    metrics: {
      finalDirectionCount: directions.length,
      rejectedDirectionCount: rejectedDirections.length,
      apiCallCount: numberOrZero(apiUsageSummary.callCount),
      totalEstimatedCostUsd: numberOrZero(
        apiUsageSummary.totalEstimatedCostUsd
      ),
    },
    guardrails: {
      passed: booleanOrFalse(guardrailSummary.passed),
      guardrailStatuses: stringArray(guardrailSummary.guardrailStatuses),
      canShowAsCredibleNowValues: arrayOrEmpty(
        guardrailSummary.canShowAsCredibleNowValues
      ).map((value) => booleanOrFalse(value)),
    },
    warnings,
    errors,
  };
}
