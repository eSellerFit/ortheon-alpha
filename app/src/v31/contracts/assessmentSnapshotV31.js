/**
 * Ortheon MVP Cut v3.1 — Assessment Snapshot Contract
 *
 * AssessmentSnapshotV31 is the normalized input package for the v3.1 engine.
 *
 * It adapts the existing Firestore assessment document into a stable structure
 * that future v3.1 modules can consume.
 *
 * Bundle 1 rule:
 * - Contract only.
 * - No engine logic.
 * - No Firestore writes.
 * - No production imports.
 */

/**
 * @typedef {Object} AssessmentSourceMetadataV31
 * @property {string} source
 * @property {string|null} roleLibraryVersion
 * @property {string|null} salaryBenchmarkVersion
 * @property {string|null} scoringVersion
 * @property {string|null} careerMapVersion
 * @property {string|null} currentStatus
 */

/**
 * @typedef {Object} AssessmentIdentityV31
 * @property {string|null} firstName
 * @property {string|null} email
 * @property {string|null} currentRole
 * @property {string|null} currentSituation
 * @property {string|null} targetMarket
 * @property {string|null} countryOrRegion
 */

/**
 * @typedef {Object} AnchorProfileV31
 * @property {"ortheon_anchor_model"} model
 * @property {Object<string, number>} scores
 * @property {string[]} dominantAnchors
 * @property {string[]} secondaryAnchors
 * @property {string[]} tensions
 */

/**
 * @typedef {Object} FinancialRealityV31
 * @property {number|null} currentMonthlyIncome
 * @property {number|null} minimumMonthlyIncome
 * @property {number|null} savingsRunwayMonths
 * @property {string|null} bridgeRoleWillingness
 * @property {string|null} retrainingInvestmentAbility
 */

/**
 * @typedef {Object} TransitionConstraintsV31
 * @property {string|null} locationConstraint
 * @property {string|null} workAuthorizedUS
 * @property {string|null} visaSponsorshipNeeded
 * @property {number|null} weeklyTimeAvailable
 * @property {string|null} retrainingWillingness
 */

/**
 * @typedef {Object} ProfessionalCredentialsV31
 * @property {string|null} hasRegulatedCredentials
 * @property {Array<Object>} credentials
 */

/**
 * @typedef {Object} CvProfileSnapshotV31
 * @property {string|null} cvSource
 * @property {boolean|null} parsed
 * @property {boolean|null} skipped
 * @property {number|null} rawTextLength
 * @property {string|null} reviewedText
 * @property {Object|null} pdfMetadata
 * @property {string|null} careerSummary
 * @property {Array|Object|null} domainSignals
 * @property {string|Object|null} senioritySignal
 * @property {Array|Object|null} entrepreneurialSignals
 * @property {Array|Object|null} tradeSignals
 * @property {string|Object|null} tenurePattern
 * @property {string|Object|null} leadershipScope
 * @property {Object|null} confidence
 * @property {Array} competencySignals
 * @property {Array} userCorrections
 */

/**
 * @typedef {Object} AssessmentSnapshotV31
 * @property {"v3.1"} version
 * @property {string} assessmentId
 * @property {AssessmentSourceMetadataV31} sourceAssessment
 * @property {AssessmentIdentityV31} identity
 * @property {AnchorProfileV31} anchors
 * @property {FinancialRealityV31|null} financialReality
 * @property {TransitionConstraintsV31|null} transitionConstraints
 * @property {ProfessionalCredentialsV31|null} professionalCredentials
 * @property {CvProfileSnapshotV31|null} cvProfile
 * @property {Object|null} legacyPriorityWeights
 * @property {Object} rawAssessment
 */

/**
 * Empty shape helper for documentation/testing.
 * Not used by production flow.
 */
export const ASSESSMENT_SNAPSHOT_V31_EMPTY = Object.freeze({
  version: "v3.1",
  assessmentId: "",
  sourceAssessment: {
    source: "ortheon-alpha-mvp",
    roleLibraryVersion: null,
    salaryBenchmarkVersion: null,
    scoringVersion: null,
    careerMapVersion: null,
    currentStatus: null,
  },
  identity: {
    firstName: null,
    email: null,
    currentRole: null,
    currentSituation: null,
    targetMarket: null,
    countryOrRegion: null,
  },
  anchors: {
    model: "ortheon_anchor_model",
    scores: {},
    dominantAnchors: [],
    secondaryAnchors: [],
    tensions: [],
  },
  financialReality: null,
  transitionConstraints: null,
  professionalCredentials: null,
  cvProfile: null,
  legacyPriorityWeights: null,
  rawAssessment: {},
});
