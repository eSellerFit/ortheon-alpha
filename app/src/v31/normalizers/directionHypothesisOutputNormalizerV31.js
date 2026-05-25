/**
 * Ortheon MVP Cut v3.1 — Direction Hypothesis Output Normalizer
 *
 * Purpose:
 * Convert raw Direction Hypothesis Generator output into normalized
 * DirectionHypothesisV31-shaped objects and validate them.
 *
 * Bundle 11C rule:
 * - Local parser / normalizer only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import { validateDirectionHypothesesV31 } from "../validators/directionHypothesisValidatorV31.js";

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

function normalizeEvidenceItem(item) {
  const source = objectOrEmpty(item);

  return {
    evidenceType: stringOrEmpty(source.evidenceType),
    evidenceText: stringOrEmpty(source.evidenceText),
    sourceField: stringOrNull(source.sourceField),
    strength: stringOrEmpty(source.strength),
  };
}

function normalizeFinancialSignal(value) {
  const source = objectOrEmpty(value);

  return {
    viable: typeof source.viable === "boolean" ? source.viable : null,
    first12MonthViability: stringOrNull(source.first12MonthViability),
    bridgeIncomeRequired:
      typeof source.bridgeIncomeRequired === "boolean"
        ? source.bridgeIncomeRequired
        : null,
    notes: stringOrEmpty(source.notes),
  };
}

function normalizeConstraintSignal(value) {
  const source = objectOrEmpty(value);

  return {
    blocked: typeof source.blocked === "boolean" ? source.blocked : false,
    warnings: normalizeStringArray(source.warnings),
    requiredDisclaimers: normalizeStringArray(source.requiredDisclaimers),
  };
}

function normalizeDirectionHypothesis(item, fallbackAssessmentId) {
  const source = objectOrEmpty(item);

  return {
    version: source.version === "v3.1" ? "v3.1" : "v3.1",
    stage:
      source.stage === "direction_hypothesis"
        ? "direction_hypothesis"
        : "direction_hypothesis",
    assessmentId: stringOrNull(source.assessmentId) || fallbackAssessmentId,
    directionId: stringOrEmpty(source.directionId),
    directionArena: stringOrEmpty(source.directionArena),
    seniorityComplexityLevel: stringOrEmpty(
      source.seniorityComplexityLevel
    ),
    workModel: stringOrEmpty(source.workModel),
    routeType: stringOrEmpty(source.routeType),
    sourceTransferableAssets: normalizeStringArray(
      source.sourceTransferableAssets
    ),
    directionStatement: stringOrEmpty(source.directionStatement),
    whyThisCouldWork: normalizeStringArray(source.whyThisCouldWork),
    requiredBridge: stringOrEmpty(source.requiredBridge),
    credibilityLevel: stringOrEmpty(source.credibilityLevel),
    mainRisks: normalizeStringArray(source.mainRisks),
    evidence: arrayOrEmpty(source.evidence).map((evidenceItem) =>
      normalizeEvidenceItem(evidenceItem)
    ),
    financialSignal: normalizeFinancialSignal(source.financialSignal),
    constraintSignal: normalizeConstraintSignal(source.constraintSignal),
    validationQuestions: normalizeStringArray(source.validationQuestions),
    firstProofSteps: normalizeStringArray(source.firstProofSteps),
  };
}

function extractDirectionHypotheses(parsed) {
  if (Array.isArray(parsed)) return parsed;

  const source = objectOrEmpty(parsed);
  return arrayOrEmpty(source.directionHypotheses);
}

/**
 * Normalize raw output into DirectionHypothesisV31[] shape.
 *
 * @param {Object|string} rawOutput Raw object, array, or JSON string.
 * @param {Object} options
 * @param {string} options.fallbackAssessmentId
 * @returns {{directionHypotheses: Array<Object>, validation: Object, parsedFromString: boolean, errors: Array<Object>}}
 */
export function normalizeDirectionHypothesisOutputV31(
  rawOutput,
  options = {}
) {
  const fallbackAssessmentId = stringOrEmpty(options.fallbackAssessmentId);
  const parsedResult = parseRawOutput(rawOutput);
  const parsedFromString = typeof rawOutput === "string";

  if (parsedResult.parseError) {
    const directionHypotheses = [];
    const validation = validateDirectionHypothesesV31(directionHypotheses);

    return {
      directionHypotheses,
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

  const directionHypotheses = extractDirectionHypotheses(parsedResult.parsed).map(
    (item) => normalizeDirectionHypothesis(item, fallbackAssessmentId)
  );

  const validation = validateDirectionHypothesesV31(directionHypotheses);

  return {
    directionHypotheses,
    validation,
    parsedFromString,
    errors: [],
  };
}
