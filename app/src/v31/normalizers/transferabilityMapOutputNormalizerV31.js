/**
 * Ortheon MVP Cut v3.1 — Transferability Map Output Normalizer
 *
 * Purpose:
 * Convert raw Transferability Mapper output into a normalized
 * TransferabilityMapV31-shaped object and validate it.
 *
 * This prepares the system for a future real AI call without adding UI
 * integration or production flow dependencies.
 *
 * Bundle 10 rule:
 * - Local parser / normalizer only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import { validateTransferabilityMapV31 } from "../validators/transferabilityMapValidatorV31.js";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringOrNull(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function stringOrEmpty(value) {
  return stringOrNull(value) || "";
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function objectOrEmpty(value) {
  return isObject(value) ? value : {};
}

function normalizeStringArray(value) {
  return arrayOrEmpty(value)
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function parseRawOutput(rawOutput) {
  if (typeof rawOutput === "string") {
    try {
      return {
        parsed: JSON.parse(rawOutput),
        parseError: null,
      };
    } catch (error) {
      return {
        parsed: null,
        parseError: error,
      };
    }
  }

  return {
    parsed: rawOutput,
    parseError: null,
  };
}

function buildFallbackMap(fallbackAssessmentId = "") {
  return {
    version: "v3.1",
    stage: "transferability_mapping",
    assessmentId: fallbackAssessmentId,
    transferableAssets: [],
    credibilityBridges: [],
    nonTransferableOrRiskyAssumptions: [],
    possibleDirectionArenas: [],
    strongestTransferabilityThemes: [],
    weakestTransferabilityAreas: [],
    missingEvidence: [],
  };
}

function normalizeTransferableAsset(item) {
  const source = objectOrEmpty(item);

  return {
    assetName: stringOrEmpty(source.assetName),
    assetType: stringOrEmpty(source.assetType),
    evidence: normalizeStringArray(source.evidence),
    transferStrength: stringOrEmpty(source.transferStrength),
    explanation: stringOrEmpty(source.explanation),
    likelyDestinationArenas: normalizeStringArray(
      source.likelyDestinationArenas
    ),
  };
}

function normalizeCredibilityBridge(item) {
  const source = objectOrEmpty(item);

  return {
    fromAsset: stringOrEmpty(source.fromAsset),
    toArena: stringOrEmpty(source.toArena),
    bridgeLogic: stringOrEmpty(source.bridgeLogic),
    credibilityLevel: stringOrEmpty(source.credibilityLevel),
    evidence: normalizeStringArray(source.evidence),
    packagingNeeds: normalizeStringArray(source.packagingNeeds),
  };
}

function normalizeRiskyAssumption(item) {
  const source = objectOrEmpty(item);

  return {
    assumption: stringOrEmpty(source.assumption),
    whyRisky: stringOrEmpty(source.whyRisky),
    whatWouldBeNeeded: stringOrEmpty(source.whatWouldBeNeeded),
    relatedArena: stringOrNull(source.relatedArena),
  };
}

function normalizePossibleDirectionArena(item) {
  const source = objectOrEmpty(item);

  return {
    arena: stringOrEmpty(source.arena),
    whyPossible: stringOrEmpty(source.whyPossible),
    evidence: normalizeStringArray(source.evidence),
    risk: stringOrEmpty(source.risk),
    bridgeNeeded:
      typeof source.bridgeNeeded === "boolean" ? source.bridgeNeeded : false,
    credibilityLevel: stringOrEmpty(source.credibilityLevel),
    likelyWorkModels: normalizeStringArray(source.likelyWorkModels),
    likelyRouteTypes: normalizeStringArray(source.likelyRouteTypes),
  };
}

/**
 * Normalize raw output into TransferabilityMapV31 shape.
 *
 * @param {Object|string} rawOutput Raw object or JSON string.
 * @param {Object} options
 * @param {string} options.fallbackAssessmentId
 * @returns {{map: Object|null, validation: Object, errors: Array<Object>, parsedFromString: boolean}}
 */
export function normalizeTransferabilityMapOutputV31(rawOutput, options = {}) {
  const fallbackAssessmentId = stringOrEmpty(options.fallbackAssessmentId);
  const parsedResult = parseRawOutput(rawOutput);
  const parsedFromString = typeof rawOutput === "string";

  if (parsedResult.parseError) {
    const map = buildFallbackMap(fallbackAssessmentId);
    const validation = validateTransferabilityMapV31(map);

    return {
      map,
      validation,
      parsedFromString,
      errors: [
        {
          type: "json_parse_error",
          message: parsedResult.parseError.message,
        },
      ],
    };
  }

  const source = objectOrEmpty(parsedResult.parsed);
  const fallbackMap = buildFallbackMap(fallbackAssessmentId);

  const normalizedMap = {
    version: source.version === "v3.1" ? "v3.1" : fallbackMap.version,
    stage:
      source.stage === "transferability_mapping"
        ? "transferability_mapping"
        : fallbackMap.stage,
    assessmentId: stringOrNull(source.assessmentId) || fallbackMap.assessmentId,

    transferableAssets: arrayOrEmpty(source.transferableAssets).map((item) =>
      normalizeTransferableAsset(item)
    ),
    credibilityBridges: arrayOrEmpty(source.credibilityBridges).map((item) =>
      normalizeCredibilityBridge(item)
    ),
    nonTransferableOrRiskyAssumptions: arrayOrEmpty(
      source.nonTransferableOrRiskyAssumptions
    ).map((item) => normalizeRiskyAssumption(item)),
    possibleDirectionArenas: arrayOrEmpty(source.possibleDirectionArenas).map(
      (item) => normalizePossibleDirectionArena(item)
    ),
    strongestTransferabilityThemes: normalizeStringArray(
      source.strongestTransferabilityThemes
    ),
    weakestTransferabilityAreas: normalizeStringArray(
      source.weakestTransferabilityAreas
    ),
    missingEvidence: normalizeStringArray(source.missingEvidence),
  };

  const validation = validateTransferabilityMapV31(normalizedMap);

  return {
    map: normalizedMap,
    validation,
    parsedFromString,
    errors: [],
  };
}
