/**
 * Ortheon MVP Cut v3.1 — Final Portfolio Validator
 *
 * Purpose:
 * Validate FinalDirectionPortfolioV31 structural shape before future
 * presentation or persistence layers consume it.
 *
 * Bundle 13B rule:
 * - Local validation only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

const ALLOWED_RECOMMENDATION_TYPES = new Set([
  "primary",
  "secondary",
  "bridge",
  "exploratory",
  "not_recommended",
]);

const ALLOWED_CONFIDENCE_LEVELS = new Set([
  "high",
  "medium",
  "low",
  "insufficient_data",
]);

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

function validateStringArray(value, id, issues) {
  if (!isArray(value)) {
    pushIssue(issues, id, `${id} must be an array.`);
    return;
  }

  value.forEach((item, index) => {
    if (typeof item !== "string") {
      pushIssue(issues, `${id}.${index}`, `${id} must contain strings.`);
    }
  });
}

function validatePortfolioSummary(summary, issues) {
  if (!isObject(summary)) {
    pushIssue(issues, "portfolioSummary", "portfolioSummary must be an object.");
    return;
  }

  ["overallInterpretation", "mainTension", "recommendedStrategy"].forEach(
    (field) => {
      if (!hasString(summary[field])) {
        pushIssue(
          issues,
          `portfolioSummary.${field}`,
          `${field} must be a non-empty string.`
        );
      }
    }
  );

  validateStringArray(
    summary.portfolioLogic,
    "portfolioSummary.portfolioLogic",
    issues
  );
}

function validatePortfolioDirection(direction, index, issues) {
  const id = `directions.${index}`;

  if (!isObject(direction)) {
    pushIssue(issues, id, "Each final portfolio direction must be an object.");
    return;
  }

  [
    "directionId",
    "directionArena",
    "seniorityComplexityLevel",
    "workModel",
    "routeType",
    "label",
    "firstValidationStep",
    "bridgeStrategy",
  ].forEach((field) => {
    if (!hasString(direction[field])) {
      pushIssue(issues, `${id}.${field}`, `${field} must be a non-empty string.`);
    }
  });

  if (typeof direction.displayOrder !== "number") {
    pushIssue(issues, `${id}.displayOrder`, "displayOrder must be a number.");
  }

  if (!ALLOWED_RECOMMENDATION_TYPES.has(direction.recommendationType)) {
    pushIssue(
      issues,
      `${id}.recommendationType`,
      "recommendationType is not allowed."
    );
  }

  if (!ALLOWED_CONFIDENCE_LEVELS.has(direction.confidence)) {
    pushIssue(issues, `${id}.confidence`, "confidence is not allowed.");
  }

  [
    "whyItFits",
    "whyItIsCredible",
    "whatMakesItRisky",
    "notRecommendedIf",
    "evidence",
    "constraintsAndWarnings",
  ].forEach((field) => {
    validateStringArray(direction[field], `${id}.${field}`, issues);
  });
}

function validateRejectedDirection(direction, index, issues) {
  const id = `rejectedDirections.${index}`;

  if (!isObject(direction)) {
    pushIssue(issues, id, "Each rejected direction must be an object.");
    return;
  }

  ["label", "reasonRejected"].forEach((field) => {
    if (!hasString(direction[field])) {
      pushIssue(issues, `${id}.${field}`, `${field} must be a non-empty string.`);
    }
  });

  if (
    direction.directionId !== null &&
    direction.directionId !== undefined &&
    typeof direction.directionId !== "string"
  ) {
    pushIssue(issues, `${id}.directionId`, "directionId must be a string or null.");
  }

  validateStringArray(
    direction.supportingConcerns,
    `${id}.supportingConcerns`,
    issues
  );
}

function validateUserFacingNarrative(narrative, issues) {
  if (!isObject(narrative)) {
    pushIssue(
      issues,
      "userFacingNarrative",
      "userFacingNarrative must be an object."
    );
    return;
  }

  ["headline", "summary", "nextStepAdvice"].forEach((field) => {
    if (!hasString(narrative[field])) {
      pushIssue(
        issues,
        `userFacingNarrative.${field}`,
        `${field} must be a non-empty string.`
      );
    }
  });

  validateStringArray(narrative.caveats, "userFacingNarrative.caveats", issues);
}

/**
 * Validate FinalDirectionPortfolioV31 basic contract shape.
 *
 * This is intentionally structural. It does not judge methodology quality yet.
 *
 * @param {Object} finalPortfolio
 * @returns {{passed: boolean, issues: Array<Object>, issueCount: number}}
 */
export function validateFinalDirectionPortfolioV31(finalPortfolio) {
  const issues = [];

  if (!isObject(finalPortfolio)) {
    pushIssue(
      issues,
      "finalPortfolio.object",
      "Final direction portfolio must be an object.",
      "blocking"
    );

    return {
      passed: false,
      issues,
      issueCount: issues.length,
    };
  }

  if (finalPortfolio.version !== "v3.1") {
    pushIssue(issues, "finalPortfolio.version", "version must be v3.1.");
  }

  if (finalPortfolio.stage !== "final_direction_portfolio") {
    pushIssue(
      issues,
      "finalPortfolio.stage",
      "stage must be final_direction_portfolio."
    );
  }

  if (!hasString(finalPortfolio.assessmentId)) {
    pushIssue(
      issues,
      "finalPortfolio.assessmentId",
      "assessmentId must be a non-empty string."
    );
  }

  validatePortfolioSummary(finalPortfolio.portfolioSummary, issues);

  if (!isArray(finalPortfolio.directions)) {
    pushIssue(issues, "finalPortfolio.directions", "directions must be an array.");
  } else {
    finalPortfolio.directions.forEach((direction, index) =>
      validatePortfolioDirection(direction, index, issues)
    );
  }

  if (!isArray(finalPortfolio.rejectedDirections)) {
    pushIssue(
      issues,
      "finalPortfolio.rejectedDirections",
      "rejectedDirections must be an array."
    );
  } else {
    finalPortfolio.rejectedDirections.forEach((direction, index) =>
      validateRejectedDirection(direction, index, issues)
    );
  }

  validateUserFacingNarrative(finalPortfolio.userFacingNarrative, issues);
  validateStringArray(finalPortfolio.qualityNotes, "qualityNotes", issues);
  validateStringArray(
    finalPortfolio.missingInputsAffectingConfidence,
    "missingInputsAffectingConfidence",
    issues
  );

  return {
    passed: issues.length === 0,
    issues,
    issueCount: issues.length,
  };
}
