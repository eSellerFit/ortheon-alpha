/**
 * Ortheon MVP Cut v3.1 — Portfolio Critic / Composer Contracts
 *
 * The Portfolio Critic / Composer is AI Call 4.
 *
 * Purpose:
 * Review direction hypotheses and compose the final direction portfolio.
 *
 * Important:
 * The final portfolio is not a ranked list of job titles.
 * It is a small, high-quality set of career direction recommendations.
 *
 * Bundle 1 rule:
 * - Contract only.
 * - No prompt implementation.
 * - No API calls.
 * - No production imports.
 */

/**
 * @typedef {import("./assessmentSnapshotV31.js").AssessmentSnapshotV31} AssessmentSnapshotV31
 * @typedef {import("./profileSynthesizerContractsV31.js").SynthesizedProfileV31} SynthesizedProfileV31
 * @typedef {import("./transferabilityContractsV31.js").TransferabilityMapV31} TransferabilityMapV31
 * @typedef {import("./directionHypothesisContractsV31.js").DirectionHypothesisV31} DirectionHypothesisV31
 * @typedef {import("./guardrailContractsV31.js").FinancialModelV31} FinancialModelV31
 * @typedef {import("./guardrailContractsV31.js").HardConstraintResultV31} HardConstraintResultV31
 * @typedef {import("./guardrailContractsV31.js").GuardrailValidationResultV31} GuardrailValidationResultV31
 */

/**
 * @typedef {Object} PortfolioCriticInputV31
 * @property {"portfolio_composer_v31"} stage
 * @property {string} instructionsVersion
 * @property {AssessmentSnapshotV31} assessmentSnapshot
 * @property {SynthesizedProfileV31} synthesizedProfile
 * @property {TransferabilityMapV31} transferabilityMap
 * @property {DirectionHypothesisV31[]} directionHypotheses
 * @property {FinancialModelV31|null} financialModel
 * @property {HardConstraintResultV31|null} hardConstraints
 * @property {GuardrailValidationResultV31|null} guardrailValidation
 * @property {Object|null} qualityOverDiversityValidation
 */

/**
 * @typedef {Object} PortfolioSummaryV31
 * @property {string} overallInterpretation
 * @property {string} mainTension
 * @property {string} recommendedStrategy
 * @property {string[]} portfolioLogic
 */

/**
 * Profile credibility for a final portfolio direction.
 * Reflects how well-evidenced the person is for this specific direction
 * based on experience, credentials, and transferable assets.
 * This is independent of financial risk or execution risk.
 *
 * @typedef {Object} ProfileCredibilityV31
 * @property {"high"|"medium"|"low"} level
 * @property {string} reason Short explanation grounded in evidence
 */

/**
 * Financial risk for a final portfolio direction.
 * Reflects income ramp risk, monetization uncertainty, or transition cost.
 * A direction can be high-credibility AND high-financial-risk simultaneously.
 *
 * @typedef {Object} DirectionFinancialRiskV31
 * @property {"low"|"medium"|"high"} level
 * @property {string} reason Short explanation of the specific financial risk
 */

/**
 * Execution risk for a final portfolio direction.
 * Reflects business development, market access, client acquisition, or
 * operational complexity risk independent of profile credibility.
 *
 * @typedef {Object} DirectionExecutionRiskV31
 * @property {"low"|"medium"|"high"} level
 * @property {string} reason Short explanation of the specific execution risk
 */

/**
 * AI Durability lens for a final portfolio direction.
 *
 * This is a diagnostic lens, not a score or ranking criterion.
 * It should not be used to rank directions or reintroduce legacy total scores.
 * Ratings: D0 = Declining/Exit Risk, D1 = Pressured, D2 = Stable but Changing,
 *          D3 = Durable, D4 = Future-Resilient.
 *
 * @typedef {Object} AiDurabilityV31
 * @property {"D0"|"D1"|"D2"|"D3"|"D4"} rating
 * @property {string} label Human-readable label, e.g. "Durable" or "Stable but changing"
 * @property {string} reason Short user-facing explanation of why this rating applies
 * @property {string} evolutionPath How this direction may evolve under AI/digital change
 */

/**
 * @typedef {Object} FinalPortfolioDirectionV31
 * @property {string} directionId
 * @property {number} displayOrder Presentation order only; not a score, rank, or fit metric.
 * @property {string} directionArena
 * @property {string} seniorityComplexityLevel
 * @property {string} workModel
 * @property {string} routeType
 * @property {string} label
 * @property {"primary"|"secondary"|"bridge"|"exploratory"|"not_recommended"} recommendationType
 * @property {"high"|"medium"|"low"|"insufficient_data"} confidence Evidence-based profile credibility strength; not financial or overall life viability.
 * @property {ProfileCredibilityV31|null} profileCredibility Optional structured credibility lens. Null on older saved documents.
 * @property {DirectionFinancialRiskV31|null} financialRisk Optional financial risk lens. Independent of profileCredibility.
 * @property {DirectionExecutionRiskV31|null} executionRisk Optional execution/BD risk lens. Independent of profileCredibility.
 * @property {string} [pathFamily] Optional path family classifier. Groups directions by career move type.
 *   Allowed values: enterprise_employment | interim_fractional | consulting_advisory |
 *   entrepreneurial_operator | regulated_profession | education_training |
 *   nonprofit_public | technical_specialist | operations_leadership | other.
 *   Not a score. Optional and backward compatible.
 * @property {string[]} [targetRoleExamples] Optional market-facing role examples under this direction. Max 6 items. Not separate recommendations.
 * @property {string[]} whyItFits
 * @property {string[]} whyItIsCredible
 * @property {string[]} whatMakesItRisky
 * @property {string} firstValidationStep
 * @property {string} bridgeStrategy
 * @property {string[]} notRecommendedIf
 * @property {string[]} evidence
 * @property {string[]} constraintsAndWarnings
 * @property {AiDurabilityV31|null} aiDurability Diagnostic lens only; not a ranking score.
 */

/**
 * @typedef {Object} RejectedDirectionV31
 * @property {string} label
 * @property {string|null} directionId
 * @property {string} reasonRejected
 * @property {string[]} supportingConcerns
 */

/**
 * @typedef {Object} UserFacingNarrativeV31
 * @property {string} headline
 * @property {string} summary
 * @property {string} nextStepAdvice
 * @property {string[]} caveats
 */

/**
 * @typedef {Object} FinalDirectionPortfolioV31
 * @property {"v3.1"} version
 * @property {"final_direction_portfolio"} stage
 * @property {string} assessmentId
 * @property {PortfolioSummaryV31} portfolioSummary
 * @property {FinalPortfolioDirectionV31[]} directions
 * @property {RejectedDirectionV31[]} rejectedDirections
 * @property {UserFacingNarrativeV31} userFacingNarrative
 * @property {string[]} qualityNotes
 * @property {string[]} missingInputsAffectingConfidence
 */

/**
 * Empty input shape helper for documentation/testing.
 * Not used by production flow.
 */
export const PORTFOLIO_CRITIC_INPUT_V31_EMPTY = Object.freeze({
  stage: "portfolio_composer_v31",
  instructionsVersion: "portfolio_composer_v31_001",
  assessmentSnapshot: null,
  synthesizedProfile: null,
  transferabilityMap: null,
  directionHypotheses: [],
  financialModel: null,
  hardConstraints: null,
  guardrailValidation: null,
  qualityOverDiversityValidation: null,
});

/**
 * Empty final portfolio shape helper for documentation/testing.
 * Not used by production flow.
 */
export const FINAL_DIRECTION_PORTFOLIO_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "final_direction_portfolio",
  assessmentId: "",
  portfolioSummary: {
    overallInterpretation: "",
    mainTension: "",
    recommendedStrategy: "",
    portfolioLogic: [],
  },
  directions: [],
  rejectedDirections: [],
  userFacingNarrative: {
    headline: "",
    summary: "",
    nextStepAdvice: "",
    caveats: [],
  },
  qualityNotes: [],
  missingInputsAffectingConfidence: [],
});
