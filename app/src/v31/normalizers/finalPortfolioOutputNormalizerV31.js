/**
 * Ortheon MVP Cut v3.1 — Final Portfolio Output Normalizer
 *
 * Purpose:
 * Convert raw Portfolio Composer output into FinalDirectionPortfolioV31 shape
 * and validate it before any downstream layer consumes it.
 *
 * Bundle 13C rule:
 * - Local parser / normalizer only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import { FINAL_DIRECTION_PORTFOLIO_V31_EMPTY } from "../contracts/portfolioContractsV31.js";
import { validateFinalDirectionPortfolioV31 } from "../validators/finalPortfolioValidatorV31.js";

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

function numberOrZero(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
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

function buildFallbackPortfolio(fallbackAssessmentId) {
  return {
    ...FINAL_DIRECTION_PORTFOLIO_V31_EMPTY,
    assessmentId: fallbackAssessmentId,
    portfolioSummary: {
      ...FINAL_DIRECTION_PORTFOLIO_V31_EMPTY.portfolioSummary,
    },
    directions: [],
    rejectedDirections: [],
    userFacingNarrative: {
      ...FINAL_DIRECTION_PORTFOLIO_V31_EMPTY.userFacingNarrative,
    },
    qualityNotes: [],
    missingInputsAffectingConfidence: [],
  };
}

function normalizePortfolioSummary(value) {
  const source = objectOrEmpty(value);

  return {
    overallInterpretation: stringOrEmpty(source.overallInterpretation),
    mainTension: stringOrEmpty(source.mainTension),
    recommendedStrategy: stringOrEmpty(source.recommendedStrategy),
    portfolioLogic: normalizeStringArray(source.portfolioLogic),
  };
}

const VALID_AI_DURABILITY_RATINGS = new Set(["D0", "D1", "D2", "D3", "D4"]);
const VALID_CREDIBILITY_LEVELS = new Set(["high", "medium", "low"]);
const VALID_RISK_LEVELS = new Set(["low", "medium", "high"]);
const KNOWN_PATH_FAMILIES = new Set([
  "enterprise_employment",
  "interim_fractional",
  "consulting_advisory",
  "entrepreneurial_operator",
  "regulated_profession",
  "education_training",
  "nonprofit_public",
  "technical_specialist",
  "operations_leadership",
  "other",
]);

function normalizePathFamily(value) {
  const s = stringOrNull(value);
  if (!s) return "";
  const lower = s.toLowerCase().trim();
  return KNOWN_PATH_FAMILIES.has(lower) ? lower : "other";
}

function normalizeProfileCredibility(value) {
  if (!isObject(value)) return null;
  const level = stringOrNull(value.level);
  if (!level || !VALID_CREDIBILITY_LEVELS.has(level)) return null;
  return { level, reason: stringOrEmpty(value.reason) };
}

function normalizeDirectionRisk(value) {
  if (!isObject(value)) return null;
  const level = stringOrNull(value.level);
  if (!level || !VALID_RISK_LEVELS.has(level)) return null;
  return { level, reason: stringOrEmpty(value.reason) };
}

function normalizeAiDurability(value) {
  if (!isObject(value)) return null;
  const rating = stringOrNull(value.rating);
  if (!rating || !VALID_AI_DURABILITY_RATINGS.has(rating)) return null;
  return {
    rating,
    label: stringOrEmpty(value.label),
    reason: stringOrEmpty(value.reason),
    evolutionPath: stringOrEmpty(value.evolutionPath),
  };
}

function normalizePortfolioDirection(item) {
  const source = objectOrEmpty(item);

  return {
    directionId: stringOrEmpty(source.directionId),
    displayOrder: numberOrZero(source.displayOrder),
    directionArena: stringOrEmpty(source.directionArena),
    seniorityComplexityLevel: stringOrEmpty(
      source.seniorityComplexityLevel
    ),
    workModel: stringOrEmpty(source.workModel),
    routeType: stringOrEmpty(source.routeType),
    label: stringOrEmpty(source.label),
    recommendationType: stringOrEmpty(source.recommendationType),
    confidence: stringOrEmpty(source.confidence),
    profileCredibility: normalizeProfileCredibility(source.profileCredibility),
    financialRisk: normalizeDirectionRisk(source.financialRisk),
    executionRisk: normalizeDirectionRisk(source.executionRisk),
    pathFamily: normalizePathFamily(source.pathFamily),
    targetRoleExamples: normalizeStringArray(source.targetRoleExamples).slice(0, 6),
    whyItFits: normalizeStringArray(source.whyItFits),
    whyItIsCredible: normalizeStringArray(source.whyItIsCredible),
    whatMakesItRisky: normalizeStringArray(source.whatMakesItRisky),
    firstValidationStep: stringOrEmpty(source.firstValidationStep),
    bridgeStrategy: stringOrEmpty(source.bridgeStrategy),
    notRecommendedIf: normalizeStringArray(source.notRecommendedIf),
    evidence: normalizeStringArray(source.evidence),
    constraintsAndWarnings: normalizeStringArray(
      source.constraintsAndWarnings
    ),
    aiDurability: normalizeAiDurability(source.aiDurability),
  };
}

function normalizeRejectedDirection(item) {
  const source = objectOrEmpty(item);

  return {
    label: stringOrEmpty(source.label),
    directionId: stringOrNull(source.directionId),
    reasonRejected: stringOrEmpty(source.reasonRejected),
    supportingConcerns: normalizeStringArray(source.supportingConcerns),
  };
}

function normalizeUserFacingNarrative(value) {
  const source = objectOrEmpty(value);

  return {
    headline: stringOrEmpty(source.headline),
    summary: stringOrEmpty(source.summary),
    nextStepAdvice: stringOrEmpty(source.nextStepAdvice),
    caveats: normalizeStringArray(source.caveats),
  };
}

function normalizeFinalPortfolio(parsed, fallbackAssessmentId) {
  const source = objectOrEmpty(parsed);

  return {
    version: source.version === "v3.1" ? "v3.1" : "v3.1",
    stage:
      source.stage === "final_direction_portfolio"
        ? "final_direction_portfolio"
        : "final_direction_portfolio",
    assessmentId: stringOrNull(source.assessmentId) || fallbackAssessmentId,
    portfolioSummary: normalizePortfolioSummary(source.portfolioSummary),
    directions: arrayOrEmpty(source.directions).map((direction) =>
      normalizePortfolioDirection(direction)
    ),
    rejectedDirections: arrayOrEmpty(source.rejectedDirections).map(
      (direction) => normalizeRejectedDirection(direction)
    ),
    userFacingNarrative: normalizeUserFacingNarrative(
      source.userFacingNarrative
    ),
    qualityNotes: normalizeStringArray(source.qualityNotes),
    missingInputsAffectingConfidence: normalizeStringArray(
      source.missingInputsAffectingConfidence
    ),
  };
}

/**
 * Normalize raw output into FinalDirectionPortfolioV31 shape.
 *
 * @param {Object|string} rawOutput Raw object or JSON string.
 * @param {Object} options
 * @param {string} options.fallbackAssessmentId
 * @returns {{finalPortfolio: Object, validation: Object, parsedFromString: boolean, errors: Array<Object>}}
 */
export function normalizeFinalPortfolioOutputV31(rawOutput, options = {}) {
  const fallbackAssessmentId = stringOrEmpty(options.fallbackAssessmentId);
  const parsedResult = parseRawOutput(rawOutput);
  const parsedFromString = typeof rawOutput === "string";

  if (parsedResult.parseError) {
    const finalPortfolio = buildFallbackPortfolio(fallbackAssessmentId);
    const validation = validateFinalDirectionPortfolioV31(finalPortfolio);

    return {
      finalPortfolio,
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

  const finalPortfolio = normalizeFinalPortfolio(
    parsedResult.parsed,
    fallbackAssessmentId
  );
  const validation = validateFinalDirectionPortfolioV31(finalPortfolio);

  return {
    finalPortfolio,
    validation,
    parsedFromString,
    errors: [],
  };
}
