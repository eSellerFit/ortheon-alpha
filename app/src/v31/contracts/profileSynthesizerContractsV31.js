/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer Contracts
 *
 * The Profile Synthesizer is AI Call 1.
 *
 * Purpose:
 * Convert the normalized assessment snapshot into a coherent person profile.
 *
 * Important:
 * This layer does not generate career directions.
 * It only describes the person, their career capital, constraints, patterns,
 * risks, and missing information.
 *
 * Bundle 1 rule:
 * - Contract only.
 * - No prompt implementation.
 * - No API calls.
 * - No production imports.
 */

/**
 * @typedef {import("./assessmentSnapshotV31.js").AssessmentSnapshotV31} AssessmentSnapshotV31
 */

/**
 * @typedef {Object} ProfileSynthesizerInputV31
 * @property {"profile_synthesizer_v31"} stage
 * @property {string} instructionsVersion
 * @property {AssessmentSnapshotV31} assessmentSnapshot
 */

/**
 * @typedef {Object} SynthesizedProfileSummaryV31
 * @property {string} oneParagraphProfile
 * @property {string|null} careerStage
 * @property {string|null} senioritySignal
 * @property {string|null} marketIdentity
 * @property {string|null} dominantCareerPattern
 */

/**
 * @typedef {Object} CareerCapitalV31
 * @property {string[]} functionalExperience
 * @property {string[]} industryExperience
 * @property {string|null} leadershipScope
 * @property {string[]} operatingContexts
 * @property {string[]} domainAssets
 * @property {string[]} credibilitySignals
 * @property {string[]} distinctiveAssets
 */

/**
 * @typedef {Object} CompetencySignalSummaryV31
 * @property {Array<Object>} strongestCompetencies
 * @property {Array<Object>} supportingCompetencies
 * @property {Array<Object>} weakOrUnprovenCompetencies
 * @property {Object<string, Array<string>>} evidenceByCompetency
 */

/**
 * @typedef {Object} AnchorPatternV31
 * @property {string[]} dominantAnchors
 * @property {string[]} secondaryAnchors
 * @property {string[]} tensions
 * @property {string[]} likelyEnergizers
 * @property {string[]} likelyDrainers
 */

/**
 * @typedef {Object} TransitionContextV31
 * @property {string|null} urgency
 * @property {string|null} flexibility
 * @property {string|null} riskLevel
 * @property {string|null} constraintsSummary
 * @property {string|null} financialPressure
 * @property {string[]} bridgeNeeds
 */

/**
 * @typedef {Object} SynthesizedProfileV31
 * @property {"v3.1"} version
 * @property {"profile_synthesis"} stage
 * @property {string} assessmentId
 * @property {SynthesizedProfileSummaryV31} profileSummary
 * @property {CareerCapitalV31} careerCapital
 * @property {CompetencySignalSummaryV31} competencySignals
 * @property {AnchorPatternV31} anchorPattern
 * @property {TransitionContextV31} transitionContext
 * @property {string[]} profileRisks
 * @property {string[]} missingInformation
 * @property {string[]} evidenceLimitations
 */

/**
 * Empty input shape helper for documentation/testing.
 * Not used by production flow.
 */
export const PROFILE_SYNTHESIZER_INPUT_V31_EMPTY = Object.freeze({
  stage: "profile_synthesizer_v31",
  instructionsVersion: "profile_synthesizer_v31_001",
  assessmentSnapshot: null,
});

/**
 * Empty output shape helper for documentation/testing.
 * Not used by production flow.
 */
export const SYNTHESIZED_PROFILE_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "profile_synthesis",
  assessmentId: "",
  profileSummary: {
    oneParagraphProfile: "",
    careerStage: null,
    senioritySignal: null,
    marketIdentity: null,
    dominantCareerPattern: null,
  },
  careerCapital: {
    functionalExperience: [],
    industryExperience: [],
    leadershipScope: null,
    operatingContexts: [],
    domainAssets: [],
    credibilitySignals: [],
    distinctiveAssets: [],
  },
  competencySignals: {
    strongestCompetencies: [],
    supportingCompetencies: [],
    weakOrUnprovenCompetencies: [],
    evidenceByCompetency: {},
  },
  anchorPattern: {
    dominantAnchors: [],
    secondaryAnchors: [],
    tensions: [],
    likelyEnergizers: [],
    likelyDrainers: [],
  },
  transitionContext: {
    urgency: null,
    flexibility: null,
    riskLevel: null,
    constraintsSummary: null,
    financialPressure: null,
    bridgeNeeds: [],
  },
  profileRisks: [],
  missingInformation: [],
  evidenceLimitations: [],
});
