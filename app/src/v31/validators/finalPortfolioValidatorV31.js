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

function validateOptionalCredibility(value, id, issues) {
  if (value === null || value === undefined) return;
  if (!isObject(value)) {
    pushIssue(issues, `${id}.profileCredibility`, "profileCredibility must be an object or null.", "medium");
    return;
  }
  if (!VALID_CREDIBILITY_LEVELS.has(value.level)) {
    pushIssue(issues, `${id}.profileCredibility.level`, "profileCredibility.level must be high, medium, or low.", "medium");
  }
  if (!hasString(value.reason)) {
    pushIssue(issues, `${id}.profileCredibility.reason`, "profileCredibility.reason must be a non-empty string.", "medium");
  }
}

function validateOptionalRiskDimension(value, fieldName, id, issues) {
  if (value === null || value === undefined) return;
  if (!isObject(value)) {
    pushIssue(issues, `${id}.${fieldName}`, `${fieldName} must be an object or null.`, "medium");
    return;
  }
  if (!VALID_RISK_LEVELS.has(value.level)) {
    pushIssue(issues, `${id}.${fieldName}.level`, `${fieldName}.level must be low, medium, or high.`, "medium");
  }
  if (!hasString(value.reason)) {
    pushIssue(issues, `${id}.${fieldName}.reason`, `${fieldName}.reason must be a non-empty string.`, "medium");
  }
}

const LABEL_STATUS_PARENTHETICALS = [
  "(bridge)",
  "(bridge required)",
  "(high risk)",
  "(longer path)",
  "(longer-path)",
  "(exploratory)",
  "(caution)",
  "(not recommended)",
];

function warnIfLabelContainsStatusParenthetical(label, id, issues) {
  if (typeof label !== "string") return;
  const lower = label.toLowerCase();
  const match = LABEL_STATUS_PARENTHETICALS.find((term) => lower.includes(term));
  if (match) {
    pushIssue(
      issues,
      `${id}.label`,
      `Direction label contains a status parenthetical '${match}'. Status should go in recommendationType, routeType, financialRisk, or constraintsAndWarnings, not inside the label.`,
      "low"
    );
  }
}

function validateAiDurability(value, id, issues) {
  // aiDurability is optional — absent on older saved v31Result documents.
  if (value === null || value === undefined) return;
  if (!isObject(value)) {
    pushIssue(issues, `${id}.aiDurability`, "aiDurability must be an object or null.", "medium");
    return;
  }
  if (!VALID_AI_DURABILITY_RATINGS.has(value.rating)) {
    pushIssue(issues, `${id}.aiDurability.rating`, "aiDurability.rating must be D0, D1, D2, D3, or D4.", "medium");
  }
  ["label", "reason", "evolutionPath"].forEach((field) => {
    if (!hasString(value[field])) {
      pushIssue(issues, `${id}.aiDurability.${field}`, `aiDurability.${field} must be a non-empty string.`, "medium");
    }
  });
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
  ].forEach((field) => {
    if (!hasString(direction[field])) {
      pushIssue(issues, `${id}.${field}`, `${field} must be a non-empty string.`);
    }
  });

  warnIfLabelContainsStatusParenthetical(direction.label, id, issues);

  if (direction.pathFamily !== undefined && direction.pathFamily !== null && direction.pathFamily !== "") {
    if (typeof direction.pathFamily !== "string") {
      pushIssue(issues, `${id}.pathFamily`, "pathFamily must be a string if present.", "low");
    } else if (!KNOWN_PATH_FAMILIES.has(direction.pathFamily.toLowerCase().trim())) {
      pushIssue(issues, `${id}.pathFamily`, `pathFamily "${direction.pathFamily}" is not a known value. Use a known value or "other".`, "low");
    }
  }

  if (typeof direction.bridgeStrategy !== "string") {
    pushIssue(issues, `${id}.bridgeStrategy`, "bridgeStrategy must be a string.");
  }

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

  validateAiDurability(direction.aiDurability, id, issues);
  validateOptionalCredibility(direction.profileCredibility, id, issues);
  validateOptionalRiskDimension(direction.financialRisk, "financialRisk", id, issues);
  validateOptionalRiskDimension(direction.executionRisk, "executionRisk", id, issues);

  if (direction.targetRoleExamples !== undefined && direction.targetRoleExamples !== null) {
    if (!isArray(direction.targetRoleExamples)) {
      pushIssue(issues, `${id}.targetRoleExamples`, "targetRoleExamples must be an array if present.", "low");
    } else {
      if (direction.targetRoleExamples.length > 6) {
        pushIssue(issues, `${id}.targetRoleExamples`, "targetRoleExamples should contain at most 6 items.", "low");
      }
      direction.targetRoleExamples.forEach((item, j) => {
        if (typeof item !== "string" || item.trim() === "") {
          pushIssue(issues, `${id}.targetRoleExamples.${j}`, "Each targetRoleExamples item must be a non-empty string.", "low");
        }
      });
    }
  }
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

  // Soft cross-direction pathFamily duplicate warning: two final directions with the
  // same non-empty pathFamily may indicate unnecessary splitting of one path family
  // into multiple directions. Low severity — backward compatible.
  if (isArray(finalPortfolio.directions) && finalPortfolio.directions.length > 1) {
    const familySeen = {};
    finalPortfolio.directions.forEach((d, i) => {
      const pf = typeof d.pathFamily === "string" ? d.pathFamily.toLowerCase().trim() : "";
      if (!pf || pf === "other") return;
      if (familySeen[pf] !== undefined) {
        pushIssue(
          issues,
          `directions.${i}.pathFamily`,
          `directions.${i} and directions.${familySeen[pf]} share pathFamily "${pf}". Consider consolidating them into one direction with targetRoleExamples unless they represent genuinely different career moves.`,
          "low"
        );
      } else {
        familySeen[pf] = i;
      }
    });
  }

  // Soft cross-direction overlap warning: if a targetRoleExample under one direction
  // closely matches the label of another final direction, flag it so the model learns
  // to keep directions distinct. Low severity — backward compatible.
  if (isArray(finalPortfolio.directions) && finalPortfolio.directions.length > 1) {
    const directionLabels = finalPortfolio.directions
      .map((d) => (typeof d.label === "string" ? d.label.toLowerCase().trim() : ""))
      .filter(Boolean);

    finalPortfolio.directions.forEach((direction, i) => {
      if (!isArray(direction.targetRoleExamples)) return;
      direction.targetRoleExamples.forEach((example) => {
        if (typeof example !== "string") return;
        const exampleLower = example.toLowerCase().trim();
        directionLabels.forEach((otherLabel, j) => {
          if (j === i) return;
          if (
            otherLabel.length > 6 &&
            (exampleLower.includes(otherLabel.slice(0, 20)) ||
              otherLabel.includes(exampleLower.slice(0, 20)))
          ) {
            pushIssue(
              issues,
              `directions.${i}.targetRoleExamples`,
              `targetRoleExample "${example}" appears to overlap with the label of directions.${j} ("${finalPortfolio.directions[j].label}"). Final directions should be distinct from targetRoleExamples across the portfolio.`,
              "low"
            );
          }
        });
      });
    });
  }

  return {
    passed: !issues.some((i) => i.severity === "high" || i.severity === "blocking"),
    issues,
    issueCount: issues.length,
  };
}
