/**
 * Ortheon MVP Cut v3.1 — Transferability Map Validator
 *
 * Purpose:
 * Validate that a TransferabilityMapV31-shaped object is structurally safe
 * before later stages consume it.
 *
 * Bundle 9B rule:
 * - Local validation only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

const ALLOWED_ASSET_TYPES = new Set([
  "competency",
  "domain_experience",
  "industry_experience",
  "leadership_pattern",
  "operating_model",
  "market_knowledge",
  "credential",
  "relationship_asset",
  "execution_pattern",
]);

const ALLOWED_TRANSFER_STRENGTHS = new Set([
  "strong",
  "moderate",
  "weak",
  "unproven",
]);

const ALLOWED_CREDIBILITY_LEVELS = new Set([
  "credible_now",
  "credible_with_packaging",
  "bridge_needed",
  "weak",
  "not_credible_now",
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

function validateTransferableAsset(asset, index, issues) {
  if (!isObject(asset)) {
    pushIssue(
      issues,
      `transferableAssets.${index}`,
      "Each transferable asset must be an object.",
      "high"
    );
    return;
  }

  if (!hasString(asset.assetName)) {
    pushIssue(
      issues,
      `transferableAssets.${index}.assetName`,
      "assetName must be a non-empty string."
    );
  }

  if (!ALLOWED_ASSET_TYPES.has(asset.assetType)) {
    pushIssue(
      issues,
      `transferableAssets.${index}.assetType`,
      "assetType is not allowed."
    );
  }

  if (!isArray(asset.evidence)) {
    pushIssue(
      issues,
      `transferableAssets.${index}.evidence`,
      "evidence must be an array."
    );
  }

  if (!ALLOWED_TRANSFER_STRENGTHS.has(asset.transferStrength)) {
    pushIssue(
      issues,
      `transferableAssets.${index}.transferStrength`,
      "transferStrength is not allowed."
    );
  }

  if (!hasString(asset.explanation)) {
    pushIssue(
      issues,
      `transferableAssets.${index}.explanation`,
      "explanation must be a non-empty string."
    );
  }

  if (!isArray(asset.likelyDestinationArenas)) {
    pushIssue(
      issues,
      `transferableAssets.${index}.likelyDestinationArenas`,
      "likelyDestinationArenas must be an array."
    );
  }
}

function validateCredibilityBridge(bridge, index, issues) {
  if (!isObject(bridge)) {
    pushIssue(
      issues,
      `credibilityBridges.${index}`,
      "Each credibility bridge must be an object.",
      "high"
    );
    return;
  }

  ["fromAsset", "toArena", "bridgeLogic"].forEach((field) => {
    if (!hasString(bridge[field])) {
      pushIssue(
        issues,
        `credibilityBridges.${index}.${field}`,
        `${field} must be a non-empty string.`
      );
    }
  });

  if (!ALLOWED_CREDIBILITY_LEVELS.has(bridge.credibilityLevel)) {
    pushIssue(
      issues,
      `credibilityBridges.${index}.credibilityLevel`,
      "credibilityLevel is not allowed."
    );
  }

  if (!isArray(bridge.evidence)) {
    pushIssue(
      issues,
      `credibilityBridges.${index}.evidence`,
      "evidence must be an array."
    );
  }

  if (!isArray(bridge.packagingNeeds)) {
    pushIssue(
      issues,
      `credibilityBridges.${index}.packagingNeeds`,
      "packagingNeeds must be an array."
    );
  }
}

function validateRiskyAssumption(assumption, index, issues) {
  if (!isObject(assumption)) {
    pushIssue(
      issues,
      `nonTransferableOrRiskyAssumptions.${index}`,
      "Each risky assumption must be an object.",
      "high"
    );
    return;
  }

  ["assumption", "whyRisky", "whatWouldBeNeeded"].forEach((field) => {
    if (!hasString(assumption[field])) {
      pushIssue(
        issues,
        `nonTransferableOrRiskyAssumptions.${index}.${field}`,
        `${field} must be a non-empty string.`
      );
    }
  });
}

function validatePossibleDirectionArena(arena, index, issues) {
  if (!isObject(arena)) {
    pushIssue(
      issues,
      `possibleDirectionArenas.${index}`,
      "Each possible direction arena must be an object.",
      "high"
    );
    return;
  }

  ["arena", "whyPossible", "risk"].forEach((field) => {
    if (!hasString(arena[field])) {
      pushIssue(
        issues,
        `possibleDirectionArenas.${index}.${field}`,
        `${field} must be a non-empty string.`
      );
    }
  });

  if (!isArray(arena.evidence)) {
    pushIssue(
      issues,
      `possibleDirectionArenas.${index}.evidence`,
      "evidence must be an array."
    );
  }

  if (typeof arena.bridgeNeeded !== "boolean") {
    pushIssue(
      issues,
      `possibleDirectionArenas.${index}.bridgeNeeded`,
      "bridgeNeeded must be a boolean."
    );
  }

  if (!ALLOWED_CREDIBILITY_LEVELS.has(arena.credibilityLevel)) {
    pushIssue(
      issues,
      `possibleDirectionArenas.${index}.credibilityLevel`,
      "credibilityLevel is not allowed."
    );
  }

  if (!isArray(arena.likelyWorkModels)) {
    pushIssue(
      issues,
      `possibleDirectionArenas.${index}.likelyWorkModels`,
      "likelyWorkModels must be an array."
    );
  }

  if (!isArray(arena.likelyRouteTypes)) {
    pushIssue(
      issues,
      `possibleDirectionArenas.${index}.likelyRouteTypes`,
      "likelyRouteTypes must be an array."
    );
  }
}

/**
 * Validate TransferabilityMapV31 basic contract shape.
 *
 * This is intentionally structural. It does not judge methodology quality yet.
 *
 * @param {Object} transferabilityMap
 * @returns {{passed: boolean, issues: Array<Object>, issueCount: number}}
 */
export function validateTransferabilityMapV31(transferabilityMap) {
  const issues = [];

  if (!isObject(transferabilityMap)) {
    pushIssue(
      issues,
      "transferabilityMap.object",
      "Transferability map must be an object.",
      "blocking"
    );

    return {
      passed: false,
      issues,
      issueCount: issues.length,
    };
  }

  if (transferabilityMap.version !== "v3.1") {
    pushIssue(
      issues,
      "transferabilityMap.version",
      "Transferability map version must be v3.1.",
      "blocking"
    );
  }

  if (transferabilityMap.stage !== "transferability_mapping") {
    pushIssue(
      issues,
      "transferabilityMap.stage",
      "Transferability map stage must be transferability_mapping.",
      "blocking"
    );
  }

  if (!hasString(transferabilityMap.assessmentId)) {
    pushIssue(
      issues,
      "transferabilityMap.assessmentId",
      "Transferability map must include assessmentId.",
      "blocking"
    );
  }

  if (!isArray(transferabilityMap.transferableAssets)) {
    pushIssue(
      issues,
      "transferabilityMap.transferableAssets",
      "transferableAssets must be an array.",
      "blocking"
    );
  } else {
    transferabilityMap.transferableAssets.forEach((asset, index) =>
      validateTransferableAsset(asset, index, issues)
    );
  }

  if (!isArray(transferabilityMap.credibilityBridges)) {
    pushIssue(
      issues,
      "transferabilityMap.credibilityBridges",
      "credibilityBridges must be an array.",
      "blocking"
    );
  } else {
    transferabilityMap.credibilityBridges.forEach((bridge, index) =>
      validateCredibilityBridge(bridge, index, issues)
    );
  }

  if (!isArray(transferabilityMap.nonTransferableOrRiskyAssumptions)) {
    pushIssue(
      issues,
      "transferabilityMap.nonTransferableOrRiskyAssumptions",
      "nonTransferableOrRiskyAssumptions must be an array.",
      "blocking"
    );
  } else {
    transferabilityMap.nonTransferableOrRiskyAssumptions.forEach(
      (assumption, index) =>
        validateRiskyAssumption(assumption, index, issues)
    );
  }

  if (!isArray(transferabilityMap.possibleDirectionArenas)) {
    pushIssue(
      issues,
      "transferabilityMap.possibleDirectionArenas",
      "possibleDirectionArenas must be an array.",
      "blocking"
    );
  } else {
    transferabilityMap.possibleDirectionArenas.forEach((arena, index) =>
      validatePossibleDirectionArena(arena, index, issues)
    );
  }

  [
    "strongestTransferabilityThemes",
    "weakestTransferabilityAreas",
    "missingEvidence",
  ].forEach((field) => {
    if (!isArray(transferabilityMap[field])) {
      pushIssue(
        issues,
        `transferabilityMap.${field}`,
        `${field} must be an array.`,
        "high"
      );
    }
  });

  return {
    passed: issues.length === 0,
    issues,
    issueCount: issues.length,
  };
}
