/**
 * Ortheon MVP Cut v3.1 — Direction Hypothesis Validator
 *
 * Purpose:
 * Validate that DirectionHypothesisV31-shaped objects are structurally safe
 * before later stages consume them.
 *
 * Bundle 11B rule:
 * - Local validation only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

const ALLOWED_CREDIBILITY_LEVELS = new Set([
  "credible_now",
  "credible_with_packaging",
  "bridge_needed",
  "stretch",
  "exploratory",
  "not_credible_now",
]);

const ALLOWED_FINANCIAL_VIABILITY = new Set([
  "viable",
  "tight",
  "not_viable",
  "unknown",
  null,
]);

const ALLOWED_EVIDENCE_STRENGTHS = new Set(["strong", "moderate", "weak"]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function hasString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pushIssue(issues, id, message, severity = "high") {
  issues.push({
    id,
    message,
    severity,
  });
}

function validateStringArray(value, id, issues, options = {}) {
  if (!isArray(value)) {
    pushIssue(issues, id, `${id} must be an array.`);
    return;
  }

  if (options.requireNonEmpty && value.length === 0) {
    pushIssue(issues, id, `${id} must contain at least one item.`);
  }

  value.forEach((item, index) => {
    if (!hasString(item)) {
      pushIssue(
        issues,
        `${id}.${index}`,
        `${id} must contain only non-empty strings.`
      );
    }
  });
}

function validateEvidenceItem(evidenceItem, hypothesisIndex, evidenceIndex, issues) {
  const id = `directionHypotheses.${hypothesisIndex}.evidence.${evidenceIndex}`;

  if (!isObject(evidenceItem)) {
    pushIssue(issues, id, "Each evidence item must be an object.");
    return;
  }

  ["evidenceType", "evidenceText"].forEach((field) => {
    if (!hasString(evidenceItem[field])) {
      pushIssue(issues, `${id}.${field}`, `${field} must be a non-empty string.`);
    }
  });

  if (
    evidenceItem.sourceField !== null &&
    evidenceItem.sourceField !== undefined &&
    typeof evidenceItem.sourceField !== "string"
  ) {
    pushIssue(
      issues,
      `${id}.sourceField`,
      "sourceField must be a string or null."
    );
  }

  if (!ALLOWED_EVIDENCE_STRENGTHS.has(evidenceItem.strength)) {
    pushIssue(issues, `${id}.strength`, "strength is not allowed.");
  }
}

function validateFinancialSignal(signal, hypothesisIndex, issues) {
  const id = `directionHypotheses.${hypothesisIndex}.financialSignal`;

  if (!isObject(signal)) {
    pushIssue(issues, id, "financialSignal must be an object.");
    return;
  }

  if (
    signal.viable !== null &&
    signal.viable !== undefined &&
    typeof signal.viable !== "boolean"
  ) {
    pushIssue(issues, `${id}.viable`, "viable must be a boolean or null.");
  }

  if (!ALLOWED_FINANCIAL_VIABILITY.has(signal.first12MonthViability)) {
    pushIssue(
      issues,
      `${id}.first12MonthViability`,
      "first12MonthViability is not allowed."
    );
  }

  if (
    signal.bridgeIncomeRequired !== null &&
    signal.bridgeIncomeRequired !== undefined &&
    typeof signal.bridgeIncomeRequired !== "boolean"
  ) {
    pushIssue(
      issues,
      `${id}.bridgeIncomeRequired`,
      "bridgeIncomeRequired must be a boolean or null."
    );
  }

  if (typeof signal.notes !== "string") {
    pushIssue(issues, `${id}.notes`, "notes must be a string.");
  }
}

function validateConstraintSignal(signal, hypothesisIndex, issues) {
  const id = `directionHypotheses.${hypothesisIndex}.constraintSignal`;

  if (!isObject(signal)) {
    pushIssue(issues, id, "constraintSignal must be an object.");
    return;
  }

  if (typeof signal.blocked !== "boolean") {
    pushIssue(issues, `${id}.blocked`, "blocked must be a boolean.");
  }

  validateStringArray(signal.warnings, `${id}.warnings`, issues);
  validateStringArray(
    signal.requiredDisclaimers,
    `${id}.requiredDisclaimers`,
    issues
  );
}

function validateDirectionHypothesis(hypothesis, index, issues) {
  const id = `directionHypotheses.${index}`;

  if (!isObject(hypothesis)) {
    pushIssue(issues, id, "Each direction hypothesis must be an object.");
    return;
  }

  if (hypothesis.version !== "v3.1") {
    pushIssue(issues, `${id}.version`, "version must be v3.1.");
  }

  if (hypothesis.stage !== "direction_hypothesis") {
    pushIssue(
      issues,
      `${id}.stage`,
      "stage must be direction_hypothesis."
    );
  }

  [
    "assessmentId",
    "directionId",
    "directionArena",
    "seniorityComplexityLevel",
    "workModel",
    "routeType",
    "directionStatement",
    "requiredBridge",
  ].forEach((field) => {
    if (!hasString(hypothesis[field])) {
      pushIssue(issues, `${id}.${field}`, `${field} must be a non-empty string.`);
    }
  });

  validateStringArray(hypothesis.sourceTransferableAssets, `${id}.sourceTransferableAssets`, issues, {
    requireNonEmpty: true,
  });

  validateStringArray(hypothesis.whyThisCouldWork, `${id}.whyThisCouldWork`, issues);
  validateStringArray(hypothesis.mainRisks, `${id}.mainRisks`, issues);
  validateStringArray(
    hypothesis.validationQuestions,
    `${id}.validationQuestions`,
    issues
  );
  validateStringArray(hypothesis.firstProofSteps, `${id}.firstProofSteps`, issues);

  if (!ALLOWED_CREDIBILITY_LEVELS.has(hypothesis.credibilityLevel)) {
    pushIssue(
      issues,
      `${id}.credibilityLevel`,
      "credibilityLevel is not allowed."
    );
  }

  if (!isArray(hypothesis.evidence)) {
    pushIssue(issues, `${id}.evidence`, "evidence must be an array.");
  } else {
    hypothesis.evidence.forEach((evidenceItem, evidenceIndex) =>
      validateEvidenceItem(evidenceItem, index, evidenceIndex, issues)
    );
  }

  validateFinancialSignal(hypothesis.financialSignal, index, issues);
  validateConstraintSignal(hypothesis.constraintSignal, index, issues);
}

/**
 * Validate DirectionHypothesisV31 basic contract shape.
 *
 * This is intentionally structural. It does not judge methodology quality yet.
 *
 * @param {Array<Object>} directionHypotheses
 * @returns {{passed: boolean, issues: Array<Object>, issueCount: number}}
 */
export function validateDirectionHypothesesV31(directionHypotheses) {
  const issues = [];

  if (!isArray(directionHypotheses)) {
    pushIssue(
      issues,
      "directionHypotheses",
      "Direction hypotheses must be an array.",
      "blocking"
    );

    return {
      passed: false,
      issues,
      issueCount: issues.length,
    };
  }

  directionHypotheses.forEach((hypothesis, index) =>
    validateDirectionHypothesis(hypothesis, index, issues)
  );

  return {
    passed: issues.length === 0,
    issues,
    issueCount: issues.length,
  };
}
