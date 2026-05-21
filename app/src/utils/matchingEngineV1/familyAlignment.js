// app/src/utils/matchingEngineV1/familyAlignment.js
// Family-to-profile alignment QA for Matching Engine v1 diagnostics.
//
// Bundle 1C scope:
// - Evaluate whether a recommendation's canonical family aligns to the
//   candidate's detected career spines.
// - Do not score, rank, suppress, or change live recommendations.

import {
  ALIGNMENT_ACTIONS,
  ALIGNMENT_SEVERITIES,
  ALIGNMENT_STATUSES,
  CONFIDENCE_LABELS,
  OWNERSHIP_LEVELS,
  PATH_TYPES,
  SPINE_MATCH_TYPES,
} from "./constants.js";
import { getCanonicalFamilyById } from "./familyRegistry.js";

const AI_TECHNOLOGY_SPINE_IDS = new Set([
  "product_technology",
  "it_enterprise_systems",
  "digital_transformation_ai",
  "data_analytics_bi",
]);

const STRONG_OWNERSHIP_LEVELS = new Set([
  OWNERSHIP_LEVELS.OWNED,
  OWNERSHIP_LEVELS.LED,
  OWNERSHIP_LEVELS.MANAGED,
]);

const AI_OWNERSHIP_TYPES = new Set([
  "ai_builder",
  "ai_transformation_owner",
  "ai_governance_risk_owner",
]);

function asArray(value) {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function collectCanonicalSpineIds(spines = []) {
  return unique(
    spines.flatMap((spine) => asArray(spine.canonicalSpineIds))
  );
}

function isPrimaryRecommendation(recommendationCandidate = {}) {
  return recommendationCandidate.pathType === PATH_TYPES.DIRECT;
}

function getDetectedSpineSummary(candidateProfile = {}) {
  const primaryDetectedSpines = candidateProfile.primaryCareerSpines || [];
  const secondaryDetectedSpines = candidateProfile.secondaryCareerSpines || [];
  const weakDetectedSpines = candidateProfile.weakCareerSpines || [];

  return {
    primaryDetectedSpines,
    secondaryDetectedSpines,
    weakDetectedSpines,
    primarySpineIds: collectCanonicalSpineIds(primaryDetectedSpines),
    secondarySpineIds: collectCanonicalSpineIds(secondaryDetectedSpines),
    weakSpineIds: collectCanonicalSpineIds(weakDetectedSpines),
  };
}

function textIncludesAny(text = "", terms = []) {
  const normalized = String(text).toLowerCase();
  return terms.some((term) => normalized.includes(String(term).toLowerCase()));
}

function getFamilyTerms(family = {}) {
  return unique([
    family.familyName,
    family.shortLabel,
    family.spineName,
    family.spineId,
    ...String(family.familyName || "")
      .split(/\W+/)
      .filter((term) => term.length > 3),
  ]);
}

function getProfileText(candidateProfile = {}) {
  const cvProfile = candidateProfile.cvProfile || {};

  return [
    cvProfile.currentRole,
    cvProfile.currentIndustry,
    cvProfile.careerSituation,
    cvProfile.careerSummary,
    cvProfile.leadershipScope,
    cvProfile.domainSignals,
    cvProfile.roleTitles,
    cvProfile.normalizedCareerEvidence?.careerSummary,
    cvProfile.normalizedCareerEvidence?.leadershipScope,
    cvProfile.normalizedCareerEvidence?.domainSignals,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findProfileOwnershipOverride({
  candidateProfile = {},
  evidenceSignals = [],
  family = {},
}) {
  const familyTerms = getFamilyTerms(family);
  const profileText = getProfileText(candidateProfile);
  const aiRelationshipType =
    candidateProfile.aiDigitalSignals?.aiRelationshipType ||
    "aspirational_or_none";

  const matchingSignals = evidenceSignals.filter((signal) => {
    if (!STRONG_OWNERSHIP_LEVELS.has(signal.ownershipLevel)) return false;

    const signalText = [
      signal.summary,
      signal.domain,
      signal.raw?.leadershipScope,
      signal.raw?.senioritySignal,
      signal.raw?.roleTitles,
    ]
      .flat()
      .filter(Boolean)
      .join(" ");

    return textIncludesAny(signalText, familyTerms);
  });

  if (matchingSignals.length > 0) {
    return {
      hasStrongOverride: true,
      overrideType: "profile_ownership_signal",
      confidence: CONFIDENCE_LABELS.INFERRED,
      evidenceSignals: matchingSignals.slice(0, 3),
    };
  }

  if (
    AI_TECHNOLOGY_SPINE_IDS.has(family.spineId) &&
    AI_OWNERSHIP_TYPES.has(aiRelationshipType)
  ) {
    return {
      hasStrongOverride: true,
      overrideType: aiRelationshipType,
      confidence: candidateProfile.aiDigitalSignals?.confidence || CONFIDENCE_LABELS.INFERRED,
      evidenceSignals: evidenceSignals
        .filter((signal) => signal.signalType === "ai_digital")
        .slice(0, 3),
    };
  }

  if (
    family.spineId &&
    textIncludesAny(profileText, [family.spineName]) &&
    /\b(owned|led|managed|built|deployed|implemented|director|head|vp|chief)\b/.test(
      profileText
    )
  ) {
    return {
      hasStrongOverride: true,
      overrideType: "profile_text_spine_ownership",
      confidence: CONFIDENCE_LABELS.INFERRED,
      evidenceSignals: [],
    };
  }

  return {
    hasStrongOverride: false,
    overrideType: null,
    confidence: CONFIDENCE_LABELS.LOW,
    evidenceSignals: [],
  };
}

function buildBaseResult({
  recommendationCandidate = {},
  family = null,
  detectedSpines,
  overrideEvidence,
}) {
  return {
    objectType: "FamilyAlignmentResult",
    alignmentStatus: ALIGNMENT_STATUSES.UNMAPPED,
    alignmentSeverity: ALIGNMENT_SEVERITIES.BLOCKING,
    matchType: SPINE_MATCH_TYPES.UNMAPPED,
    recommendedAction: ALIGNMENT_ACTIONS.BLOCK_DISPLAY,
    familyId: recommendationCandidate.familyId ?? null,
    familyName: family?.familyName ?? recommendationCandidate.familyName ?? null,
    familySpineId: family?.spineId ?? recommendationCandidate.familySpineId ?? null,
    familySpineName:
      family?.spineName ?? recommendationCandidate.familySpineName ?? null,
    primaryDetectedSpines: detectedSpines.primaryDetectedSpines,
    secondaryDetectedSpines: detectedSpines.secondaryDetectedSpines,
    weakDetectedSpines: detectedSpines.weakDetectedSpines,
    overrideEvidence,
    reasons: [],
  };
}

export function evaluateFamilyAlignment({
  candidateProfile = {},
  evidenceSignals = [],
  recommendationCandidate = {},
} = {}) {
  const detectedSpines = getDetectedSpineSummary(candidateProfile);
  const isPrimary = isPrimaryRecommendation(recommendationCandidate);
  const isComposite =
    recommendationCandidate.canonicalMappingConfidence === "composite";
  const family = recommendationCandidate.familyId
    ? getCanonicalFamilyById(recommendationCandidate.familyId)
    : null;
  const overrideEvidence = family
    ? findProfileOwnershipOverride({
        candidateProfile,
        evidenceSignals,
        family,
      })
    : {
        hasStrongOverride: false,
        overrideType: null,
        confidence: CONFIDENCE_LABELS.LOW,
        evidenceSignals: [],
      };

  const result = buildBaseResult({
    recommendationCandidate,
    family,
    detectedSpines,
    overrideEvidence,
  });

  if (!family && isComposite) {
    return {
      ...result,
      alignmentStatus: ALIGNMENT_STATUSES.COMPOSITE_UNRESOLVED,
      matchType: SPINE_MATCH_TYPES.COMPOSITE,
      reasons: [
        "Legacy recommendation has a composite canonical mapping and is not display-safe until a primary family is resolved.",
      ],
    };
  }

  if (!family) {
    return {
      ...result,
      reasons: [
        "Recommendation has no canonical family ID, so family-to-profile alignment cannot be verified.",
      ],
    };
  }

  if (detectedSpines.primarySpineIds.includes(family.spineId)) {
    return {
      ...result,
      alignmentStatus: ALIGNMENT_STATUSES.ALIGNED,
      alignmentSeverity: ALIGNMENT_SEVERITIES.NONE,
      matchType: SPINE_MATCH_TYPES.PRIMARY,
      recommendedAction: ALIGNMENT_ACTIONS.ALLOW,
      reasons: [
        "Canonical family spine matches one of the candidate's primary detected career spines.",
      ],
    };
  }

  if (detectedSpines.secondarySpineIds.includes(family.spineId)) {
    return {
      ...result,
      alignmentStatus: ALIGNMENT_STATUSES.RELATED,
      alignmentSeverity: isPrimary
        ? ALIGNMENT_SEVERITIES.BLOCKING
        : ALIGNMENT_SEVERITIES.INFO,
      matchType: SPINE_MATCH_TYPES.SECONDARY,
      recommendedAction: isPrimary
        ? ALIGNMENT_ACTIONS.DOWNGRADE_TO_ADJACENT
        : ALIGNMENT_ACTIONS.ALLOW_ADJACENT,
      reasons: [
        isPrimary
          ? "Family spine is secondary for this profile and should not be displayed as Primary without override evidence."
          : "Family spine is secondary for this profile and can be reviewed as adjacent or bridge-based.",
      ],
    };
  }

  if (detectedSpines.weakSpineIds.includes(family.spineId)) {
    return {
      ...result,
      alignmentStatus: ALIGNMENT_STATUSES.WEAK_SPINE,
      alignmentSeverity: isPrimary
        ? ALIGNMENT_SEVERITIES.BLOCKING
        : ALIGNMENT_SEVERITIES.WARNING,
      matchType: SPINE_MATCH_TYPES.WEAK,
      recommendedAction: isPrimary
        ? ALIGNMENT_ACTIONS.BLOCK_DISPLAY
        : ALIGNMENT_ACTIONS.REQUIRE_BRIDGE_OR_CONDITION,
      reasons: [
        isPrimary
          ? "Family spine appears only as weak/noisy evidence and cannot justify a Primary recommendation."
          : "Family spine appears only as weak/noisy evidence and requires a named bridge or condition.",
      ],
    };
  }

  if (overrideEvidence.hasStrongOverride) {
    return {
      ...result,
      alignmentStatus: ALIGNMENT_STATUSES.RELATED,
      alignmentSeverity: isPrimary
        ? ALIGNMENT_SEVERITIES.WARNING
        : ALIGNMENT_SEVERITIES.INFO,
      matchType: SPINE_MATCH_TYPES.CROSS_SPINE,
      recommendedAction: isPrimary
        ? ALIGNMENT_ACTIONS.DOWNGRADE_TO_ADJACENT
        : ALIGNMENT_ACTIONS.ALLOW_ADJACENT,
      reasons: [
        "Family spine is outside detected profile spines, but explicit ownership evidence creates a possible override.",
      ],
    };
  }

  return {
    ...result,
    alignmentStatus: ALIGNMENT_STATUSES.CROSS_SPINE,
    alignmentSeverity: isPrimary
      ? ALIGNMENT_SEVERITIES.BLOCKING
      : ALIGNMENT_SEVERITIES.WARNING,
    matchType: SPINE_MATCH_TYPES.CROSS_SPINE,
    recommendedAction: isPrimary
      ? ALIGNMENT_ACTIONS.BLOCK_DISPLAY
      : ALIGNMENT_ACTIONS.REQUIRE_BRIDGE_OR_CONDITION,
    reasons: [
      isPrimary
        ? "Primary recommendation is outside the candidate's primary career spine and has no strong override evidence."
        : "Recommendation is outside detected profile spines and should be bridge-based or conditional before display.",
    ],
  };
}
