/**
 * Ortheon MVP Cut v3.1 — Pipeline Result Contracts
 *
 * Purpose:
 * Define the isolated v3.1 pipeline payload shape for future persistence.
 *
 * Important:
 * This contract is intentionally separate from legacy result fields. It does
 * not target directionRecommendations, careerMap, primaryDirections, report
 * sections, or any other production result-flow field.
 *
 * Bundle 15A rule:
 * - Contract only.
 * - No Firestore writes.
 * - No API calls.
 * - No production imports.
 */

/**
 * @typedef {import("./portfolioContractsV31.js").FinalDirectionPortfolioV31} FinalDirectionPortfolioV31
 * @typedef {import("./auditTrailContractsV31.js").AuditTrailEventV31} AuditTrailEventV31
 */

/**
 * @typedef {"isolated_debug_runner"|"internal_pipeline"|"production_pipeline"} V31PipelineResultSource
 */

/**
 * @typedef {"passed"|"failed"|"partial"} V31PipelineStatus
 */

/**
 * @typedef {Object} V31PipelineResultPayload
 * @property {"v3.1"} version
 * @property {"v31_pipeline_result"} stage
 * @property {string} assessmentId
 * @property {string} generatedAt
 * @property {V31PipelineResultSource} source
 * @property {V31PipelineStatus} pipelineStatus
 * @property {FinalDirectionPortfolioV31|null} finalPortfolio
 * @property {Object} pipelineSummary
 * @property {Object} guardrailSummary
 * @property {Object} apiUsageSummary
 * @property {AuditTrailEventV31[]} auditTrail
 * @property {string[]} warnings
 * @property {Object[]} errors
 */

/**
 * Empty v3.1 pipeline result payload helper for documentation/testing.
 *
 * This shape excludes rawAssessment, raw Claude responses, secrets, and legacy
 * production result-field targets by default.
 */
export const V31_PIPELINE_RESULT_PAYLOAD_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "v31_pipeline_result",
  assessmentId: "",
  generatedAt: "",
  source: "isolated_debug_runner",
  pipelineStatus: "partial",
  finalPortfolio: null,
  pipelineSummary: {},
  guardrailSummary: {},
  apiUsageSummary: {},
  auditTrail: [],
  warnings: [],
  errors: [],
});
