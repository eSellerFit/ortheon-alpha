// app/src/utils/matchingEngineV1/reportQa.js
// Structural QA checks for Matching Engine v1 foundation diagnostics.
//
// Bundle 1 scope:
// - Validate internal recommendation object integrity.
// - Do not render user-facing recommendations.
// - Do not score.

import {
  ALIGNMENT_SEVERITIES,
  ALIGNMENT_STATUSES,
  CONFIDENCE_LABELS,
  PATH_TYPES,
  SPINE_MATCH_TYPES,
} from "./constants.js";
import { hasCanonicalFamilyId } from "./familyRegistry.js";

function createIssue({
  code,
  severity = "blocking",
  recommendation,
  requiredFix,
  qaNote,
} = {}) {
  return {
    code,
    severity,
    recommendationIdsAffected: [
      recommendation?.familyId,
      recommendation?.legacyDirectionId,
      recommendation?.displayLabel,
    ].filter(Boolean),
    requiredFix,
    qaNotes: qaNote,
  };
}

function hasNamedBridge(recommendation = {}) {
  if (!recommendation.bridge) return false;
  if (typeof recommendation.bridge === "string") return recommendation.bridge.trim().length > 0;
  if (recommendation.bridge.label) return true;
  if (Array.isArray(recommendation.bridge.options)) {
    return recommendation.bridge.options.length > 0;
  }
  return false;
}

function hasNamedCondition(recommendation = {}) {
  if (!recommendation.condition) return false;
  if (typeof recommendation.condition === "string") {
    return recommendation.condition.trim().length > 0;
  }
  return Boolean(recommendation.condition.label);
}

function hasCredentialCheck(recommendation = {}) {
  return Boolean(recommendation.credentialGate?.checked);
}

function hasEvidenceMapping(recommendation = {}) {
  return Array.isArray(recommendation.evidenceMapping) && recommendation.evidenceMapping.length > 0;
}

const AI_TECHNOLOGY_SPINE_IDS = new Set([
  "product_technology",
  "it_enterprise_systems",
  "digital_transformation_ai",
  "data_analytics_bi",
]);

export function runReportQa({
  candidateProfile = {},
  evidenceSignals = [],
  recommendationCandidates = [],
} = {}) {
  const blockingIssues = [];
  const warnings = [];
  const profilePrimarySpineIds = new Set(
    (candidateProfile.primaryCareerSpines || []).flatMap(
      (spine) => spine.canonicalSpineIds || []
    )
  );

  void evidenceSignals;

  recommendationCandidates.forEach((recommendation) => {
    const hasFamilyId = Boolean(recommendation.familyId);
    const familyIdIsKnown = hasFamilyId
      ? hasCanonicalFamilyId(recommendation.familyId)
      : false;
    const isCompositeMapping =
      recommendation.canonicalMappingConfidence === "composite";
    const isWeakMapping = recommendation.canonicalMappingConfidence === "weak";
    const compositeResolution = recommendation.compositeResolutionResult;

    if (hasFamilyId && !familyIdIsKnown) {
      blockingIssues.push(
        createIssue({
          code: "unknown_family_id",
          recommendation,
          requiredFix:
            "Use a canonical family_id that exists in the compact family registry.",
          qaNote: "Canonical family IDs must validate against the registry.",
        })
      );
    }

    if (!hasFamilyId) {
      blockingIssues.push(
        createIssue({
          code: "missing_family_id",
          recommendation,
          requiredFix:
            "Attach a canonical family_id before this recommendation can be displayed.",
          qaNote:
            "Bundle 1 intentionally does not fake canonical IDs from legacy role-library IDs.",
        })
      );
    }

    if (isCompositeMapping) {
      warnings.push(
        createIssue({
          code: "canonical_mapping_composite",
          severity: "warning",
          recommendation,
          requiredFix:
            "Resolve composite mapping before this can become a clean displayed recommendation.",
          qaNote:
            recommendation.canonicalMappingNotes ||
            "Legacy direction maps to multiple possible canonical families.",
        })
      );
    }

    if (isWeakMapping) {
      warnings.push(
        createIssue({
          code: "canonical_mapping_weak",
          severity: "warning",
          recommendation,
          requiredFix:
            "Require stronger evidence or a more explicit canonical mapping.",
          qaNote:
            recommendation.canonicalMappingNotes ||
            "Legacy direction has only weak canonical mapping confidence.",
        })
      );
    }

    if (
      compositeResolution?.resolved &&
      [CONFIDENCE_LABELS.MEDIUM, CONFIDENCE_LABELS.LOW].includes(
        compositeResolution.resolutionConfidence
      )
    ) {
      warnings.push(
        createIssue({
          code: "composite_resolution_confidence_review",
          severity: "warning",
          recommendation,
          requiredFix:
            "Review medium/low confidence composite resolution before display.",
          qaNote:
            compositeResolution.reasons?.join(" ") ||
            "Composite mapping resolved but confidence is not high.",
        })
      );
    }

    if (
      recommendation.pathType === PATH_TYPES.BRIDGE_BASED &&
      !hasNamedBridge(recommendation)
    ) {
      blockingIssues.push(
        createIssue({
          code: "bridge_based_path_missing_bridge",
          recommendation,
          requiredFix: "Name the bridge step or suppress this path.",
          qaNote: "Bridge-based recommendations must explain the bridge.",
        })
      );
    }

    if (
      recommendation.pathType === PATH_TYPES.CONDITIONAL &&
      !hasNamedCondition(recommendation)
    ) {
      blockingIssues.push(
        createIssue({
          code: "conditional_path_missing_condition",
          recommendation,
          requiredFix: "Name the condition or suppress this path.",
          qaNote: "Conditional recommendations must name the condition.",
        })
      );
    }

    const looksCredentialed =
      recommendation.credentialGate?.status &&
      recommendation.credentialGate.status !== "unknown";

    if (looksCredentialed && !hasCredentialCheck(recommendation)) {
      blockingIssues.push(
        createIssue({
          code: "credentialed_path_missing_credential_check",
          recommendation,
          requiredFix:
            "Run and attach credential/license gate status before display.",
          qaNote: "Credentialed paths require an explicit credential check.",
        })
      );
    }

    if (recommendation.displayLabel && !familyIdIsKnown) {
      blockingIssues.push(
        createIssue({
          code: "display_only_composite_recommendation",
          recommendation,
          requiredFix:
            "Separate display label from canonical family classification.",
          qaNote:
            "A display label cannot replace evidence-backed family mapping.",
        })
      );
    }

    if (
      recommendation.pathType === PATH_TYPES.ADJACENT &&
      !hasEvidenceMapping(recommendation)
    ) {
      blockingIssues.push(
        createIssue({
          code: "weak_nearby_trajectory_without_evidence",
          recommendation,
          requiredFix:
            "Attach evidence mapping for the nearby trajectory or suppress it.",
          qaNote:
            "Nearby should mean evidence-supported, not merely imaginable.",
        })
      );
    }

    if (recommendation.pathType !== PATH_TYPES.SUPPRESSED && !hasEvidenceMapping(recommendation)) {
      warnings.push(
        createIssue({
          code: "recommendation_missing_evidence_mapping",
          severity: "warning",
          recommendation,
          requiredFix: "Attach supporting EvidenceSignal records.",
          qaNote:
            "This may be acceptable for early diagnostics but should not ship.",
        })
      );
    }

    const alignment = recommendation.alignmentResult;

    if (!alignment) {
      warnings.push(
        createIssue({
          code: "family_alignment_missing",
          severity: "warning",
          recommendation,
          requiredFix:
            "Run family-to-profile alignment before QA-signing recommendations.",
          qaNote: "Bundle 1C expects every RecommendationCandidate to carry alignmentResult.",
        })
      );
      return;
    }

    const isPrimaryPath = recommendation.pathType === PATH_TYPES.DIRECT;
    const alignmentIssue =
      alignment.alignmentSeverity === ALIGNMENT_SEVERITIES.BLOCKING
        ? blockingIssues
        : warnings;

    if (
      alignment.alignmentStatus === ALIGNMENT_STATUSES.COMPOSITE_UNRESOLVED
    ) {
      blockingIssues.push(
        createIssue({
          code: "composite_mapping_not_display_safe",
          recommendation,
          requiredFix:
            "Resolve a primary canonical family before display.",
          qaNote:
            "Composite mappings can be diagnostic evidence but are not display-ready recommendations.",
        })
      );
    }

    if (
      isPrimaryPath &&
      alignment.matchType !== SPINE_MATCH_TYPES.PRIMARY &&
      alignment.matchType !== SPINE_MATCH_TYPES.COMPOSITE &&
      alignment.matchType !== SPINE_MATCH_TYPES.UNMAPPED
    ) {
      alignmentIssue.push(
        createIssue({
          code: "primary_recommendation_outside_primary_spine",
          severity: alignment.alignmentSeverity,
          recommendation,
          requiredFix:
            "Downgrade, bridge, condition, or suppress the recommendation before display.",
          qaNote:
            "Primary recommendations must match the candidate's primary career spine or have strong override evidence.",
        })
      );
    }

    if (
      isPrimaryPath &&
      alignment.matchType === SPINE_MATCH_TYPES.CROSS_SPINE &&
      !alignment.overrideEvidence?.hasStrongOverride
    ) {
      blockingIssues.push(
        createIssue({
          code: "primary_cross_spine_without_override",
          recommendation,
          requiredFix:
            "Suppress or downgrade this Primary recommendation unless explicit ownership evidence is added.",
          qaNote:
            "The family spine is outside the detected profile and no strong override evidence was found.",
        })
      );
    }

    if (
      isPrimaryPath &&
      [SPINE_MATCH_TYPES.SECONDARY, SPINE_MATCH_TYPES.WEAK].includes(
        alignment.matchType
      )
    ) {
      blockingIssues.push(
        createIssue({
          code: "secondary_or_weak_spine_used_as_primary",
          recommendation,
          requiredFix:
            "Use Adjacent, Bridge-based, or Conditional treatment instead of Primary.",
          qaNote:
            "Secondary or weak career spine evidence cannot justify an automatic Primary recommendation.",
        })
      );
    }

    if (
      isPrimaryPath &&
      AI_TECHNOLOGY_SPINE_IDS.has(alignment.familySpineId) &&
      !profilePrimarySpineIds.has(alignment.familySpineId) &&
      !alignment.overrideEvidence?.hasStrongOverride
    ) {
      blockingIssues.push(
        createIssue({
          code: "ai_technology_primary_without_ai_technology_spine",
          recommendation,
          requiredFix:
            "Require explicit AI or technology ownership evidence, or downgrade/suppress.",
          qaNote:
            "AI/technology families cannot become Primary for a non-AI/non-technology profile from broad vocabulary alone.",
        })
      );
    }
  });

  const passed = blockingIssues.length === 0;

  return {
    objectType: "ReportQAResult",
    passed,
    blockingIssues,
    warnings,
    recommendationIdsAffected: [
      ...blockingIssues,
      ...warnings,
    ].flatMap((issue) => issue.recommendationIdsAffected || []),
    requiredFix: passed
      ? null
      : "Resolve blocking recommendation object issues before display.",
    qaNotes: passed
      ? "No blocking structural QA issues found."
      : "Structural QA found blocking issues. This output is diagnostic-only.",
  };
}
