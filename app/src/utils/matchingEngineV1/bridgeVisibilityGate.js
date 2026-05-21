// app/src/utils/matchingEngineV1/bridgeVisibilityGate.js
// Debug-only visibility gate for foundation bridge and conditional candidates.

const BRIDGE_VISIBILITY_STATUSES = {
  SHOW: "show_bridge",
  HIDE: "hide_bridge",
  NEEDS_CONFIRMATION: "needs_user_confirmation",
};

const SHOWABLE_MAPPING_CONFIDENCE = new Set([
  "exact",
  "composite_resolved_high",
]);

const HIDDEN_MAPPING_CONFIDENCE = new Set([
  "none",
  "weak",
  "composite",
]);

const STRONG_SPINE_MATCH_TYPES = new Set([
  "primary_spine",
  "secondary_spine",
]);

const GENERIC_EVIDENCE_TERMS = new Set([
  "administration",
  "business",
  "delivery",
  "enterprise",
  "leadership",
  "leader",
  "management",
  "operations",
  "program",
  "service",
  "strategy",
  "systems",
]);

function hasNamedTransition(candidate = {}) {
  const transition = candidate.bridge || candidate.condition;

  if (!transition) return false;
  if (typeof transition === "string") return transition.trim().length > 0;
  if (transition.label) return true;
  return Array.isArray(transition.options) && transition.options.length > 0;
}

function getFamilyEvidenceTerms(candidate = {}) {
  return [
    candidate.familyName,
    candidate.displayLabel,
  ]
    .filter(Boolean)
    .flatMap((label) => String(label).toLowerCase().split(/\W+/))
    .filter(
      (term) =>
        (term.length > 3 || term === "ai") &&
        !GENERIC_EVIDENCE_TERMS.has(term)
    );
}

function getCompetenceEvidenceText(signal = {}) {
  return [
    signal.summary,
    signal.raw?.roleTitles,
    signal.raw?.senioritySignal,
    signal.raw?.leadershipScope,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function signalHasFamilySpecificText(signal = {}, candidate = {}) {
  const terms = getFamilyEvidenceTerms(candidate);
  const signalText = getCompetenceEvidenceText(signal);

  return terms.some((term) => signalText.includes(term));
}

function hasExplicitFamilyEvidence(candidate = {}) {
  return (candidate.evidenceMapping || []).some(
    (signal) =>
      signal.signalType !== "financial" &&
      signal.signalType !== "constraint" &&
      signalHasFamilySpecificText(signal, candidate)
  );
}

function hasStrongOwnershipEvidence(candidate = {}) {
  const overrideEvidence = candidate.alignmentOverrideEvidence || {};

  if (!overrideEvidence.hasStrongOverride) return false;

  return (overrideEvidence.evidenceSignals || []).some((signal) =>
    signalHasFamilySpecificText(signal, candidate)
  );
}

function hasFinancialBlock(candidate = {}) {
  const level = candidate.sourceDiagnostic?.financialRealityLevel;

  return (
    level === "not_viable_now" ||
    (candidate.sourceDiagnostic?.hardGateFlags || []).some(
      (flag) => flag.flag === "income_floor_not_met"
    )
  );
}

function hasPracticalBlock(candidate = {}) {
  const level = candidate.sourceDiagnostic?.practicalConstraintsLevel;

  return (
    level === "not_realistic_now" ||
    (candidate.sourceDiagnostic?.hardGateFlags || []).some(
      (flag) => flag.flag === "practical_constraints_block"
    )
  );
}

function hasConstrainedOrUnknownFinancials(candidate = {}) {
  return ["unknown", "financially_constrained"].includes(
    candidate.sourceDiagnostic?.financialRealityLevel
  );
}

function hasConstrainedOrUnknownPracticalFit(candidate = {}) {
  return ["unknown", "constrained"].includes(
    candidate.sourceDiagnostic?.practicalConstraintsLevel
  );
}

function isIndependentLike(candidate = {}) {
  const context = [
    candidate.sourceDiagnostic?.context,
    candidate.sourceDiagnostic?.transitionCategory,
    candidate.sourceDiagnostic?.transitionPathway,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return ["independent", "fractional", "consult", "own venture"].some((term) =>
    context.includes(term)
  );
}

function hasIndependentReadiness(candidateProfile = {}) {
  const constraints = candidateProfile.transitionConstraints || {};
  const cvProfile = candidateProfile.cvProfile || {};
  const commercialText = [
    cvProfile.careerSummary,
    cvProfile.leadershipScope,
    cvProfile.domainSignals,
    cvProfile.advisorySignals,
    cvProfile.entrepreneurialSignals,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const salesComfort = String(constraints.salesComfort || "").toLowerCase();
  const runway = candidateProfile.financialReality?.savingsRunwayMonths;
  const hasCommercialSignal = [
    "advisory",
    "advisor",
    "consult",
    "client",
    "pipeline",
    "business development",
    "fractional",
  ].some((term) => commercialText.includes(term));

  return (
    ["high", "medium-high"].some((level) => salesComfort.includes(level)) &&
    Number.isFinite(runway) &&
    runway >= 6 &&
    hasCommercialSignal
  );
}

function buildResult(status, reasons = [], missingInputs = []) {
  return {
    objectType: "BridgeVisibilityResult",
    diagnosticOnly: true,
    status,
    reasons,
    missingInputs,
  };
}

export function evaluateBridgeVisibility({
  candidate = {},
  candidateProfile = {},
} = {}) {
  const reasons = [];
  const missingInputs = [];
  const hasExplicitEvidence = hasExplicitFamilyEvidence(candidate);
  const hasOwnershipEvidence = hasStrongOwnershipEvidence(candidate);
  const hasStrongSpineConnection = STRONG_SPINE_MATCH_TYPES.has(
    candidate.alignmentMatchType
  );

  if (
    HIDDEN_MAPPING_CONFIDENCE.has(candidate.canonicalMappingConfidence) ||
    !candidate.familyId
  ) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate does not have a resolved display-safe canonical mapping.",
    ]);
  }

  if (candidate.compositeResolutionStatus?.startsWith("unresolved")) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate has an unresolved composite family mapping.",
    ]);
  }

  if (candidate.alignmentMatchType === "weak_spine") {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate depends on weak or noisy spine support.",
    ]);
  }

  if (
    candidate.alignmentMatchType === "cross_spine" &&
    !hasOwnershipEvidence
  ) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate is cross-domain without strong ownership evidence.",
    ]);
  }

  if (!hasNamedTransition(candidate)) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate has no named transition bridge or condition.",
    ]);
  }

  if (!hasExplicitEvidence && !hasOwnershipEvidence) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate has no explicit family evidence or ownership override.",
    ]);
  }

  if (hasFinancialBlock(candidate)) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate is financially blocked by v1.4 diagnostics.",
    ]);
  }

  if (hasPracticalBlock(candidate)) {
    return buildResult(BRIDGE_VISIBILITY_STATUSES.HIDE, [
      "Bridge candidate is blocked by practical transition constraints.",
    ]);
  }

  if (!SHOWABLE_MAPPING_CONFIDENCE.has(candidate.canonicalMappingConfidence)) {
    missingInputs.push("Confirm the canonical family mapping before display.");
  }

  if (!hasStrongSpineConnection && hasOwnershipEvidence) {
    reasons.push(
      "Strong ownership evidence makes this cross-spine bridge plausible."
    );
  }

  if (hasConstrainedOrUnknownFinancials(candidate)) {
    missingInputs.push("Confirm financial transition feasibility.");
  }

  if (hasConstrainedOrUnknownPracticalFit(candidate)) {
    missingInputs.push("Confirm practical transition constraints.");
  }

  if (isIndependentLike(candidate) && !hasIndependentReadiness(candidateProfile)) {
    missingInputs.push(
      "Confirm client pipeline, commercial comfort, and transition runway."
    );
  }

  if (!hasExplicitEvidence && hasOwnershipEvidence) {
    missingInputs.push("Confirm direct family-specific evidence.");
  }

  if (missingInputs.length > 0) {
    return buildResult(
      BRIDGE_VISIBILITY_STATUSES.NEEDS_CONFIRMATION,
      [
        ...reasons,
        "Bridge candidate is plausible but needs confirmation before display.",
      ],
      missingInputs
    );
  }

  return buildResult(BRIDGE_VISIBILITY_STATUSES.SHOW, [
    ...reasons,
    "Bridge candidate has strong mapping, evidence, transition explanation, and feasible diagnostics.",
  ]);
}

export const bridgeVisibilityGate = {
  evaluateBridgeVisibility,
};
