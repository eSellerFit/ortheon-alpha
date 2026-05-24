/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer Validator
 *
 * Purpose:
 * Validate that a SynthesizedProfileV31-shaped object is structurally safe
 * before later stages consume it.
 *
 * Bundle 6 rule:
 * - Local validation only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

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

/**
 * Validate SynthesizedProfileV31 basic contract shape.
 *
 * This is intentionally structural. It does not judge methodology quality yet.
 *
 * @param {Object} profile
 * @returns {{passed: boolean, issues: Array<Object>, issueCount: number}}
 */
export function validateSynthesizedProfileV31(profile) {
  const issues = [];

  if (!isObject(profile)) {
    pushIssue(
      issues,
      "profile.object",
      "Synthesized profile must be an object.",
      "blocking"
    );

    return {
      passed: false,
      issues,
      issueCount: issues.length,
    };
  }

  if (profile.version !== "v3.1") {
    pushIssue(
      issues,
      "profile.version",
      "Synthesized profile version must be v3.1.",
      "blocking"
    );
  }

  if (profile.stage !== "profile_synthesis") {
    pushIssue(
      issues,
      "profile.stage",
      "Synthesized profile stage must be profile_synthesis.",
      "blocking"
    );
  }

  if (!hasString(profile.assessmentId)) {
    pushIssue(
      issues,
      "profile.assessmentId",
      "Synthesized profile must include assessmentId.",
      "blocking"
    );
  }

  if (!isObject(profile.profileSummary)) {
    pushIssue(
      issues,
      "profile.profileSummary",
      "profileSummary must be an object.",
      "blocking"
    );
  } else if (!hasString(profile.profileSummary.oneParagraphProfile)) {
    pushIssue(
      issues,
      "profile.profileSummary.oneParagraphProfile",
      "profileSummary.oneParagraphProfile should be a non-empty string.",
      "high"
    );
  }

  if (!isObject(profile.careerCapital)) {
    pushIssue(
      issues,
      "profile.careerCapital",
      "careerCapital must be an object.",
      "blocking"
    );
  } else {
    [
      "functionalExperience",
      "industryExperience",
      "operatingContexts",
      "domainAssets",
      "credibilitySignals",
      "distinctiveAssets",
    ].forEach((field) => {
      if (!isArray(profile.careerCapital[field])) {
        pushIssue(
          issues,
          `profile.careerCapital.${field}`,
          `careerCapital.${field} must be an array.`,
          "high"
        );
      }
    });
  }

  if (!isObject(profile.competencySignals)) {
    pushIssue(
      issues,
      "profile.competencySignals",
      "competencySignals must be an object.",
      "blocking"
    );
  } else {
    [
      "strongestCompetencies",
      "supportingCompetencies",
      "weakOrUnprovenCompetencies",
    ].forEach((field) => {
      if (!isArray(profile.competencySignals[field])) {
        pushIssue(
          issues,
          `profile.competencySignals.${field}`,
          `competencySignals.${field} must be an array.`,
          "high"
        );
      }
    });

    if (!isObject(profile.competencySignals.evidenceByCompetency)) {
      pushIssue(
        issues,
        "profile.competencySignals.evidenceByCompetency",
        "competencySignals.evidenceByCompetency must be an object.",
        "high"
      );
    }
  }

  if (!isObject(profile.anchorPattern)) {
    pushIssue(
      issues,
      "profile.anchorPattern",
      "anchorPattern must be an object.",
      "blocking"
    );
  } else {
    [
      "dominantAnchors",
      "secondaryAnchors",
      "tensions",
      "likelyEnergizers",
      "likelyDrainers",
    ].forEach((field) => {
      if (!isArray(profile.anchorPattern[field])) {
        pushIssue(
          issues,
          `profile.anchorPattern.${field}`,
          `anchorPattern.${field} must be an array.`,
          "high"
        );
      }
    });
  }

  if (!isObject(profile.transitionContext)) {
    pushIssue(
      issues,
      "profile.transitionContext",
      "transitionContext must be an object.",
      "blocking"
    );
  } else if (!isArray(profile.transitionContext.bridgeNeeds)) {
    pushIssue(
      issues,
      "profile.transitionContext.bridgeNeeds",
      "transitionContext.bridgeNeeds must be an array.",
      "high"
    );
  }

  ["profileRisks", "missingInformation", "evidenceLimitations"].forEach(
    (field) => {
      if (!isArray(profile[field])) {
        pushIssue(
          issues,
          `profile.${field}`,
          `${field} must be an array.`,
          "high"
        );
      }
    }
  );

  return {
    passed: issues.length === 0,
    issues,
    issueCount: issues.length,
  };
}
