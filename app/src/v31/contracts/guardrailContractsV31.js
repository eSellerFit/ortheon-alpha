/**
 * Ortheon MVP Cut v3.1 — Guardrail Contracts
 *
 * Guardrails are deterministic review layers around the AI-generated outputs.
 *
 * Purpose:
 * - Check financial survivability
 * - Detect hard constraints
 * - Block impossible or irresponsible directions
 * - Prevent fake precision
 * - Prevent unsupported recommendations
 *
 * Bundle 1 rule:
 * - Contract only.
 * - No guardrail implementation.
 * - No production imports.
 */

/**
 * @typedef {Object} DirectionFinancialCheckV31
 * @property {string} directionId
 * @property {"stable"|"dip_then_recover"|"long_ramp"|"uncertain"} estimatedRampPattern
 * @property {"viable"|"tight"|"not_viable"|"unknown"} first12MonthViability
 * @property {boolean} bridgeIncomeRequired
 * @property {string} notes
 */

/**
 * @typedef {Object} FinancialModelV31
 * @property {"v3.1"} version
 * @property {"financial_model"} stage
 * @property {string} assessmentId
 * @property {number|null} incomeFloor
 * @property {number|null} currentMonthlyIncome
 * @property {number|null} currentAnnualIncomeEstimate
 * @property {number|null} runwayMonths
 * @property {string|null} incomeDropTolerance
 * @property {DirectionFinancialCheckV31[]} directionFinancialChecks
 * @property {string[]} financialRisks
 * @property {string[]} missingFinancialInputs
 */

/**
 * @typedef {Object} BlockedDirectionV31
 * @property {string} directionId
 * @property {string} reason
 * @property {"license"|"credential"|"work_authorization"|"geography"|"financial"|"time"|"education"|"experience"|"health_safety"|"other"} constraintType
 * @property {"high"|"blocking"} severity
 */

/**
 * @typedef {Object} ConstraintWarningV31
 * @property {string} directionId
 * @property {string} warning
 * @property {"low"|"medium"|"high"} severity
 * @property {string|null} constraintType
 */

/**
 * @typedef {Object} HardConstraintResultV31
 * @property {"v3.1"} version
 * @property {"hard_constraints"} stage
 * @property {string} assessmentId
 * @property {BlockedDirectionV31[]} blockedDirections
 * @property {ConstraintWarningV31[]} warnings
 * @property {string[]} requiredDisclaimers
 * @property {string[]} missingConstraintInputs
 */

/**
 * @typedef {Object} GuardrailValidationIssueV31
 * @property {"unsupported_claim"|"blocked_direction"|"financial_conflict"|"credential_conflict"|"fake_precision"|"too_many_weak_directions"|"missing_evidence"|"missing_required_input"} issueType
 * @property {"low"|"medium"|"high"|"blocking"} severity
 * @property {string|null} directionId
 * @property {string} message
 * @property {string|null} suggestedFix
 */

/**
 * @typedef {Object} GuardrailValidationResultV31
 * @property {"v3.1"} version
 * @property {"guardrail_validation"} stage
 * @property {string} assessmentId
 * @property {boolean} passed
 * @property {GuardrailValidationIssueV31[]} issues
 * @property {string[]} requiredFixes
 * @property {boolean} safeToDisplay
 */

/**
 * Empty financial model helper for documentation/testing.
 * Not used by production flow.
 */
export const FINANCIAL_MODEL_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "financial_model",
  assessmentId: "",
  incomeFloor: null,
  currentMonthlyIncome: null,
  currentAnnualIncomeEstimate: null,
  runwayMonths: null,
  incomeDropTolerance: null,
  directionFinancialChecks: [],
  financialRisks: [],
  missingFinancialInputs: [],
});

/**
 * Empty hard constraint result helper for documentation/testing.
 * Not used by production flow.
 */
export const HARD_CONSTRAINT_RESULT_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "hard_constraints",
  assessmentId: "",
  blockedDirections: [],
  warnings: [],
  requiredDisclaimers: [],
  missingConstraintInputs: [],
});

/**
 * Empty guardrail validation result helper for documentation/testing.
 * Not used by production flow.
 */
export const GUARDRAIL_VALIDATION_RESULT_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "guardrail_validation",
  assessmentId: "",
  passed: false,
  issues: [],
  requiredFixes: [],
  safeToDisplay: false,
});
