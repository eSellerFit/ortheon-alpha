/**
 * Ortheon MVP Cut v3.1 — Transferability Mapper Contracts
 *
 * The Transferability Mapper is AI Call 2.
 *
 * Purpose:
 * Map a person's career capital into credible direction arenas.
 *
 * This is the heart of v3.1:
 * - not job-title matching
 * - not role-library-led matching
 * - not a score-first recommendation engine
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
 */

/**
 * @typedef {Object} TransferabilityMapperInputV31
 * @property {"transferability_mapper_v31"} stage
 * @property {string} instructionsVersion
 * @property {AssessmentSnapshotV31} assessmentSnapshot
 * @property {SynthesizedProfileV31} synthesizedProfile
 */

/**
 * @typedef {"competency"|"domain_experience"|"industry_experience"|"leadership_pattern"|"operating_model"|"market_knowledge"|"credential"|"relationship_asset"|"execution_pattern"} TransferableAssetTypeV31
 */

/**
 * @typedef {"strong"|"moderate"|"weak"|"unproven"} TransferStrengthV31
 */

/**
 * @typedef {"credible_now"|"credible_with_packaging"|"bridge_needed"|"weak"|"not_credible_now"} ArenaCredibilityLevelV31
 */

/**
 * @typedef {Object} TransferableAssetV31
 * @property {string} assetName
 * @property {TransferableAssetTypeV31} assetType
 * @property {string[]} evidence
 * @property {TransferStrengthV31} transferStrength
 * @property {string} explanation
 * @property {string[]} likelyDestinationArenas
 */

/**
 * @typedef {Object} CredibilityBridgeV31
 * @property {string} fromAsset
 * @property {string} toArena
 * @property {string} bridgeLogic
 * @property {ArenaCredibilityLevelV31} credibilityLevel
 * @property {string[]} evidence
 * @property {string[]} packagingNeeds
 */

/**
 * @typedef {Object} RiskyTransferAssumptionV31
 * @property {string} assumption
 * @property {string} whyRisky
 * @property {string} whatWouldBeNeeded
 * @property {string|null} relatedArena
 */

/**
 * @typedef {Object} PossibleDirectionArenaV31
 * @property {string} arena
 * @property {string} whyPossible
 * @property {string[]} evidence
 * @property {string} risk
 * @property {boolean} bridgeNeeded
 * @property {ArenaCredibilityLevelV31} credibilityLevel
 * @property {string[]} likelyWorkModels
 * @property {string[]} likelyRouteTypes
 */

/**
 * @typedef {Object} TransferabilityMapV31
 * @property {"v3.1"} version
 * @property {"transferability_mapping"} stage
 * @property {string} assessmentId
 * @property {TransferableAssetV31[]} transferableAssets
 * @property {CredibilityBridgeV31[]} credibilityBridges
 * @property {RiskyTransferAssumptionV31[]} nonTransferableOrRiskyAssumptions
 * @property {PossibleDirectionArenaV31[]} possibleDirectionArenas
 * @property {string[]} strongestTransferabilityThemes
 * @property {string[]} weakestTransferabilityAreas
 * @property {string[]} missingEvidence
 */

/**
 * Empty input shape helper for documentation/testing.
 * Not used by production flow.
 */
export const TRANSFERABILITY_MAPPER_INPUT_V31_EMPTY = Object.freeze({
  stage: "transferability_mapper_v31",
  instructionsVersion: "transferability_mapper_v31_001",
  assessmentSnapshot: null,
  synthesizedProfile: null,
});

/**
 * Empty output shape helper for documentation/testing.
 * Not used by production flow.
 */
export const TRANSFERABILITY_MAP_V31_EMPTY = Object.freeze({
  version: "v3.1",
  stage: "transferability_mapping",
  assessmentId: "",
  transferableAssets: [],
  credibilityBridges: [],
  nonTransferableOrRiskyAssumptions: [],
  possibleDirectionArenas: [],
  strongestTransferabilityThemes: [],
  weakestTransferabilityAreas: [],
  missingEvidence: [],
});
