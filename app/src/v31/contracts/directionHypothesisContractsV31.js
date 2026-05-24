/**
 * Ortheon MVP Cut v3.1 — Direction Hypothesis Contracts
 *
 * The Direction Hypothesis Generator is AI Call 3.
 *
 * Purpose:
 * Generate possible career direction hypotheses from synthesized profile,
 * transferability map, financial model, and hard constraints.
 *
 * Important:
 * These are not final recommendations.
 * They are candidate hypotheses to be reviewed by the Portfolio Critic / Composer.
 *
 * Bundle 1 rule:
 * - Contract only.
 * - No prompt implementation.
 * - No API calls.
 * - No production imports.
 */

/**
 * @typedef {import("./profileSynthesizerContractsV31.js").SynthesizedProfileV31} SynthesizedProfileV31
 * @typedef {import("./transferabilityContractsV31.js").TransferabilityMapV31} TransferabilityMapV31
 */

/**
 * @typedef {Object} DirectionHypothesisInputV31
 * @property {"direction_hypothesis_generator_v31"} stage
 * @property {string} instructionsVersion
 * @property {SynthesizedProfileV31} synthesizedProfile
 * @property {TransferabilityMapV31} transferabilityMap
 * @property {Object|null} financialModel
 * @property {Object|null} hardConstraints
 */

/**
 * @typedef {Object} DirectionFinancialSignalV31
 * @property {boolean|null} viable
 * @property {"viable"|"tight"|"not_viable"|"unknown"|null} first12MonthViability
 * @property {boolean|null} bridgeIncomeRequired
 * @property {string} notes
 */

/**
 * @typedef {Object} DirectionConstraintSignalV31
 * @property {boolean} blocked
 * @property {string[]} warnings
 * @property {string[]} requiredDisclaimers
 */

/**
 * @typedef {Object} DirectionEvidenceItemV31
 * @property {string} evidenceType
 * @property {string} evidenceText
 * @property {string|null} sourceField
 * @property {"strong"|"moderate"|"weak"} strength
 */

/**
 * @typedef {Object} DirectionHypothesisV31
 * @property {"v3.1"} version
 * @property {"direction_hypothesis"} stage
 * @property {string} assessmentId
 * @property {string} directionId
 * @property {string} directionArena
 * @property {string} seniorityComplexityLevel
 * @property {string} workModel
 * @property {string} routeType
 * @property {string} directionStatement
 * @property {string[]} whyThisCouldWork
 * @property {string} requiredBridge
 * @property {"credible_now"|"credible_with_packaging"|"bridge_needed"|"stretch"|"exploratory"|"not_credible_now"} credibilityLevel
 * @property {string[]} mainRisks
 * @property {DirectionEvidenceItemV31[]} evidence
 * @property {DirectionFinancialSignalV31} financialSignal
 * @property {DirectionConstraintSignalV31} constraintSignal
 * @property {string[]} validationQuestions
 * @property {string[]} firstProofSteps
 */

/**
 * Empty input shape helper for documentation/testing.
 * Not used by production flow.
 */
export const DIRECTION_HYPOTHESIS_INPUT_V31_EMPTY = Object.freeze({
  stage: "direction_hypothesis_generator_v31",
  instructionsVersion: "direction_hypothesis_generator_v31_001",
  synthesizedProfile: null,
  transferabilityMap: null,
  financialModel: null,
  hardConstraints: null,
});

/**
 * Empty hypothesis shape helper for documentation/testing.
 * Not used by production flow.
 */
export const DIRECTION_HYPOTHESIS_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "direction_hypothesis",
  assessmentId: "",
  directionId: "",
  directionArena: "",
  seniorityComplexityLevel: "",
  workModel: "",
  routeType: "",
  directionStatement: "",
  whyThisCouldWork: [],
  requiredBridge: "",
  credibilityLevel: "exploratory",
  mainRisks: [],
  evidence: [],
  financialSignal: {
    viable: null,
    first12MonthViability: null,
    bridgeIncomeRequired: null,
    notes: "",
  },
  constraintSignal: {
    blocked: false,
    warnings: [],
    requiredDisclaimers: [],
  },
  validationQuestions: [],
  firstProofSteps: [],
});
