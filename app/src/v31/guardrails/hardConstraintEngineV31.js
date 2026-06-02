/**
 * Ortheon MVP Cut v3.1 — Hard Constraint Engine
 *
 * Purpose:
 * Deterministically flag hard constraints and credential risks for direction
 * hypotheses. This layer does not remove hypotheses.
 *
 * Bundle 12A rule:
 * - Pure deterministic function only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

const REGULATED_TERMS = [
  "teacher",
  "teaching",
  "clinical",
  "legal",
  "lawyer",
  "attorney",
  "financial advisor",
  "real estate",
  "engineering",
  "licensed trade",
  "nursing",
  "nurse",
  "healthcare",
  "therapist",
  "counselor",
];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nullableString(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function getHypothesisId(hypothesis) {
  return (
    nullableString(hypothesis?.directionId) ||
    nullableString(hypothesis?.directionArena) ||
    ""
  );
}

function textIncludesAny(value, needles) {
  const normalized = String(value || "").toLowerCase();
  return needles.some((needle) => normalized.includes(needle));
}

function getHypothesisText(hypothesis) {
  return [
    hypothesis?.directionArena,
    hypothesis?.directionStatement,
    hypothesis?.routeType,
    hypothesis?.workModel,
    hypothesis?.requiredBridge,
    hypothesis?.credentialSignal,
  ].join(" ");
}

function hasCredentialEvidence(professionalCredentials) {
  if (!isObject(professionalCredentials)) return null;

  const hasRegulatedCredentials = nullableString(
    professionalCredentials.hasRegulatedCredentials
  );

  if (["yes", "true", "has_credentials"].includes(hasRegulatedCredentials)) {
    return true;
  }

  if (arrayOrEmpty(professionalCredentials.credentials).length > 0) {
    return true;
  }

  if (["no", "false", "none"].includes(hasRegulatedCredentials)) {
    return false;
  }

  return null;
}

function evaluateCredentialRisk(hypothesis, professionalCredentials, reasons) {
  const hypothesisText = getHypothesisText(hypothesis);
  const credentialEvidence = hasCredentialEvidence(professionalCredentials);
  const regulatedTermDetected = textIncludesAny(hypothesisText, REGULATED_TERMS);
  const explicitCredentialRoute = textIncludesAny(hypothesisText, [
    "credential",
    "license",
    "licensed",
    "regulated",
    "certification",
  ]);

  if (!regulatedTermDetected && !explicitCredentialRoute) {
    return "none_detected";
  }

  if (credentialEvidence === true) {
    reasons.push("Credential-sensitive language detected with some credential evidence present.");
    return "possible";
  }

  if (credentialEvidence === false) {
    reasons.push("Credential-sensitive language detected without credential evidence.");
    return regulatedTermDetected ? "likely_required" : "possible";
  }

  reasons.push("Credential-sensitive language detected but credential inputs are missing or unclear.");
  return "unknown";
}

function evaluateLocationRisk(transitionConstraints, reasons) {
  if (!isObject(transitionConstraints)) {
    reasons.push("Transition constraints are missing.");
    return "unknown";
  }

  const workAuthorizedUS = nullableString(transitionConstraints.workAuthorizedUS);
  const visaSponsorshipNeeded = nullableString(
    transitionConstraints.visaSponsorshipNeeded
  );
  const locationConstraint = nullableString(
    transitionConstraints.locationConstraint
  );

  if (!workAuthorizedUS && !visaSponsorshipNeeded && !locationConstraint) {
    reasons.push("Location and work authorization constraints are unclear.");
    return "unknown";
  }

  if (
    ["no", "false"].includes(workAuthorizedUS) ||
    ["yes", "true"].includes(visaSponsorshipNeeded)
  ) {
    reasons.push("Work authorization may constrain route feasibility.");
    return "possible";
  }

  return "none_detected";
}

function evaluateTimeRisk(hypothesis, transitionConstraints, reasons) {
  if (!isObject(transitionConstraints)) return "unknown";

  // A direct route does not require a training or credential bridge by definition.
  // requiredBridge wording on a direct-route hypothesis reflects positioning or
  // packaging guidance — not a retraining commitment. Without this guard, training-
  // adjacent words in requiredBridge ("certification", "training") would incorrectly
  // escalate constraintLevel to bridge_required for a route the person can pursue now.
  const rt = String(hypothesis?.routeType || "").toLowerCase();
  if (rt === "direct" || (rt.includes("direct") && !rt.includes("bridge"))) {
    return "none_detected";
  }

  const weeklyTimeAvailable = nullableNumber(
    transitionConstraints.weeklyTimeAvailable
  );
  const needsTraining = textIncludesAny(
    [hypothesis?.routeType, hypothesis?.requiredBridge].join(" "),
    ["retraining", "credential", "certification", "training", "education"]
  );

  if (weeklyTimeAvailable === null) return needsTraining ? "unknown" : "none_detected";

  if (weeklyTimeAvailable < 5 && needsTraining) {
    reasons.push("Limited weekly time may constrain retraining or credential route.");
    return "possible";
  }

  return "none_detected";
}

function buildConstraintSignal(
  hypothesis,
  transitionConstraints,
  professionalCredentials
) {
  const reasons = [];
  const credentialRisk = evaluateCredentialRisk(
    hypothesis,
    professionalCredentials,
    reasons
  );
  const locationRisk = evaluateLocationRisk(transitionConstraints, reasons);
  const timeRisk = evaluateTimeRisk(hypothesis, transitionConstraints, reasons);
  let hardBlock = false;
  let constraintLevel = "none_detected";

  if (credentialRisk === "likely_required") {
    constraintLevel = "bridge_required";
  }

  if (
    credentialRisk === "likely_required" &&
    textIncludesAny(getHypothesisText(hypothesis), ["must", "required"])
  ) {
    constraintLevel = "blocked";
    hardBlock = true;
    reasons.push("Credential requirement appears mandatory for this hypothesis.");
  }

  if (constraintLevel === "none_detected" && credentialRisk === "possible") {
    constraintLevel = "watch";
  }

  if (constraintLevel === "none_detected" && locationRisk === "possible") {
    constraintLevel = "watch";
  }

  if (
    ["none_detected", "watch"].includes(constraintLevel) &&
    timeRisk === "possible"
  ) {
    constraintLevel = "bridge_required";
  }

  if (
    constraintLevel === "none_detected" &&
    [credentialRisk, locationRisk, timeRisk].includes("unknown")
  ) {
    constraintLevel = "unknown";
  }

  return {
    hypothesisId: getHypothesisId(hypothesis),
    directionArena: nullableString(hypothesis?.directionArena) || "",
    hardBlock,
    constraintLevel,
    credentialRisk,
    locationRisk,
    timeRisk,
    reasons,
  };
}

/**
 * Evaluate hard constraints for direction hypotheses.
 *
 * @param {Object} assessmentSnapshot
 * @param {Array<Object>} directionHypotheses
 * @returns {Object}
 */
export function evaluateHardConstraintsV31(
  assessmentSnapshot,
  directionHypotheses
) {
  const transitionConstraints = assessmentSnapshot?.transitionConstraints;
  const professionalCredentials = assessmentSnapshot?.professionalCredentials;
  const missingConstraintInputs = [];
  const globalConstraintWarnings = [];

  if (!isObject(transitionConstraints)) {
    missingConstraintInputs.push("transitionConstraints");
    globalConstraintWarnings.push("Transition constraints are missing.");
  }

  if (!isObject(professionalCredentials)) {
    missingConstraintInputs.push("professionalCredentials");
    globalConstraintWarnings.push("Professional credential inputs are missing.");
  }

  const directionConstraintSignals = arrayOrEmpty(directionHypotheses).map(
    (hypothesis) =>
      buildConstraintSignal(
        hypothesis,
        transitionConstraints,
        professionalCredentials
      )
  );

  if (
    directionConstraintSignals.some(
      (signal) => signal.credentialRisk === "likely_required"
    )
  ) {
    globalConstraintWarnings.push(
      "At least one hypothesis may require credential verification."
    );
  }

  return {
    version: "v3.1",
    assessmentId: nullableString(assessmentSnapshot?.assessmentId) || "",
    stage: "hard_constraint_evaluation",
    directionConstraintSignals,
    globalConstraintWarnings,
    missingConstraintInputs,
  };
}
