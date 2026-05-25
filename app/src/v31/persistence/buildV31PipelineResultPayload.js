/**
 * Ortheon MVP Cut v3.1 — Pipeline Result Payload Builder
 *
 * Purpose:
 * Build a safe isolated v3.1 pipeline result payload for future persistence.
 *
 * Bundle 15A rule:
 * - Pure deterministic builder.
 * - No Firestore writes.
 * - No API calls.
 * - No AI calls.
 * - No production imports.
 */

function hasString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function objectOrEmpty(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSource(value) {
  if (
    [
      "isolated_debug_runner",
      "internal_pipeline",
      "production_pipeline",
    ].includes(value)
  ) {
    return value;
  }

  return "isolated_debug_runner";
}

function normalizePipelineStatus(value, finalPortfolio) {
  if (["passed", "failed", "partial"].includes(value)) {
    return value;
  }

  return finalPortfolio ? "passed" : "partial";
}

/**
 * Build a V31PipelineResultPayload object.
 *
 * @param {Object} params
 * @param {string} params.assessmentId
 * @param {Object|null} params.finalPortfolio
 * @param {Object} params.pipelineSummary
 * @param {Object} params.guardrailSummary
 * @param {Object} params.apiUsageSummary
 * @param {Array<Object>} params.auditTrail
 * @param {string[]} params.warnings
 * @param {Array<Object>} params.errors
 * @param {"isolated_debug_runner"|"internal_pipeline"|"production_pipeline"} params.source
 * @param {"passed"|"failed"|"partial"} params.pipelineStatus
 * @param {string} params.generatedAt
 * @returns {Object}
 */
export function buildV31PipelineResultPayloadV31({
  assessmentId,
  finalPortfolio = null,
  pipelineSummary = {},
  guardrailSummary = {},
  apiUsageSummary = {},
  auditTrail = [],
  warnings = [],
  errors = [],
  source = "isolated_debug_runner",
  pipelineStatus,
  generatedAt,
} = {}) {
  if (!hasString(assessmentId)) {
    throw new Error(
      "buildV31PipelineResultPayloadV31 expected a non-empty assessmentId."
    );
  }

  const normalizedFinalPortfolio = finalPortfolio || null;

  return {
    version: "v3.1",
    stage: "v31_pipeline_result",
    assessmentId: assessmentId.trim(),
    generatedAt: hasString(generatedAt)
      ? generatedAt.trim()
      : new Date().toISOString(),
    source: normalizeSource(source),
    pipelineStatus: normalizePipelineStatus(
      pipelineStatus,
      normalizedFinalPortfolio
    ),
    finalPortfolio: normalizedFinalPortfolio,
    pipelineSummary: objectOrEmpty(pipelineSummary),
    guardrailSummary: objectOrEmpty(guardrailSummary),
    apiUsageSummary: objectOrEmpty(apiUsageSummary),
    auditTrail: arrayOrEmpty(auditTrail),
    warnings: arrayOrEmpty(warnings).filter((item) => typeof item === "string"),
    errors: arrayOrEmpty(errors).filter(
      (item) => Boolean(item) && typeof item === "object" && !Array.isArray(item)
    ),
  };
}
