// app/src/utils/matchingEngineV1/foundationDiagnostics.js
// Orchestrates Matching Engine v1 foundation diagnostics.
//
// Bundle 1 scope:
// - Build internal objects from current assessment and v1.4 diagnostics.
// - Run structural report QA.
// - Do not feed scoring or live report recommendations.

import { buildCandidateProfile } from "./candidateProfileAdapter.js";
import { resolveCompositeFamilyMapping } from "./compositeFamilyResolver.js";
import { buildDisplaySafeCandidateSelection } from "./displaySafeSelector.js";
import { buildEvidenceSignals } from "./evidenceSignals.js";
import { evaluateFamilyAlignment } from "./familyAlignment.js";
import {
  applyCompositeResolutionToRecommendationCandidate,
  recommendationCandidateFromV14Diagnostic,
} from "./recommendationObjects.js";
import { runReportQa } from "./reportQa.js";
import {
  directionFamilyRegistryVersion,
} from "../../data/directionFamilyRegistryV1.js";
import { getCanonicalFamilyCount } from "./familyRegistry.js";

export function buildMatchingEngineFoundationDiagnostics({
  assessment = {},
  directionDiagnostics = {},
} = {}) {
  const candidateProfile = buildCandidateProfile({
    assessment,
    evidenceModel: directionDiagnostics.evidenceModel || {},
    directionDiagnostics,
  });

  const evidenceSignals = buildEvidenceSignals({
    candidateProfile,
  });

  const diagnosticItems = [
    ...(directionDiagnostics.recommendations || []),
    ...(directionDiagnostics.suppressedDirections || []),
  ];

  const recommendationCandidates = diagnosticItems.map((item) => {
    const initialRecommendationCandidate = recommendationCandidateFromV14Diagnostic({
      item,
      evidenceSignals,
    });
    const compositeResolutionResult = resolveCompositeFamilyMapping({
      candidateProfile,
      evidenceSignals,
      recommendationCandidate: initialRecommendationCandidate,
    });
    const recommendationCandidate = applyCompositeResolutionToRecommendationCandidate({
      recommendationCandidate: initialRecommendationCandidate,
      compositeResolutionResult,
    });

    return {
      ...recommendationCandidate,
      alignmentResult: evaluateFamilyAlignment({
        candidateProfile,
        evidenceSignals,
        recommendationCandidate,
      }),
    };
  });

  const reportQaResult = runReportQa({
    candidateProfile,
    evidenceSignals,
    recommendationCandidates,
  });
  const displaySafeCandidateSelection = buildDisplaySafeCandidateSelection({
    candidateProfile,
    evidenceSignals,
    recommendationCandidates,
    reportQaResult,
  });
  const selectionSummary =
    displaySafeCandidateSelection.selectionSummary || {};
  const mappedCandidateCount = recommendationCandidates.filter(
    (candidate) => Boolean(candidate.familyId)
  ).length;
  const compositeMappingCount = recommendationCandidates.filter(
    (candidate) => candidate.canonicalMappingConfidence === "composite"
  ).length;
  const weakMappingCount = recommendationCandidates.filter(
    (candidate) => candidate.canonicalMappingConfidence === "weak"
  ).length;
  const unmappedCandidateCount = recommendationCandidates.length - mappedCandidateCount;
  const compositeResolvedCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.compositeResolutionResult?.resolved &&
      candidate.compositeResolutionResult.resolutionStatus !==
        "exact_mapping_not_needed"
  ).length;
  const compositeUnresolvedCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.compositeResolutionResult &&
      candidate.canonicalMappingConfidence === "composite" &&
      !candidate.compositeResolutionResult.resolved
  ).length;
  const highConfidenceCompositeResolvedCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.compositeResolutionResult?.resolved &&
      candidate.compositeResolutionResult.resolutionStatus !==
        "exact_mapping_not_needed" &&
      candidate.compositeResolutionResult.resolutionConfidence === "high"
  ).length;
  const lowConfidenceCompositeResolvedCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.compositeResolutionResult?.resolved &&
      candidate.compositeResolutionResult.resolutionStatus !==
        "exact_mapping_not_needed" &&
      ["medium", "low"].includes(
        candidate.compositeResolutionResult.resolutionConfidence
      )
  ).length;
  const alignedCandidateCount = recommendationCandidates.filter(
    (candidate) => candidate.alignmentResult?.alignmentStatus === "aligned"
  ).length;
  const crossSpineCandidateCount = recommendationCandidates.filter(
    (candidate) => candidate.alignmentResult?.matchType === "cross_spine"
  ).length;
  const primaryCrossSpineCandidateCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.pathType === "Direct" &&
      candidate.alignmentResult?.matchType === "cross_spine"
  ).length;
  const familyAlignmentBlockingCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.alignmentResult?.alignmentSeverity === "blocking"
  ).length;
  const familyAlignmentWarningCount = recommendationCandidates.filter(
    (candidate) =>
      candidate.alignmentResult?.alignmentSeverity === "warning"
  ).length;

  return {
    objectType: "MatchingEngineV1FoundationDiagnostics",
    diagnosticOnly: true,
    engineVersion: "matchingEngineV1.foundation.bundle1",
    sourceEngineVersion: directionDiagnostics.engineVersion ?? null,
    registryVersion: directionFamilyRegistryVersion,
    canonicalFamilyCount: getCanonicalFamilyCount(),
    mappedCandidateCount,
    unmappedCandidateCount,
    compositeMappingCount,
    weakMappingCount,
    compositeResolvedCount,
    compositeUnresolvedCount,
    highConfidenceCompositeResolvedCount,
    lowConfidenceCompositeResolvedCount,
    alignedCandidateCount,
    crossSpineCandidateCount,
    primaryCrossSpineCandidateCount,
    familyAlignmentBlockingCount,
    familyAlignmentWarningCount,
    displaySafeCandidateCount:
      selectionSummary.displaySafeCandidateCount ?? 0,
    blockedCandidateCount: selectionSummary.blockedCandidateCount ?? 0,
    conditionalCandidateCount:
      selectionSummary.conditionalCandidateCount ?? 0,
    displaySafePrimaryCount: selectionSummary.displaySafePrimaryCount ?? 0,
    displaySafeAdjacentCount: selectionSummary.displaySafeAdjacentCount ?? 0,
    displaySafeBridgeCount: selectionSummary.displaySafeBridgeCount ?? 0,
    candidateProfile,
    evidenceSignals,
    recommendationCandidates,
    reportQaResult,
    displaySafeCandidateSelection,
    notes: [
      "Foundation diagnostics are internal/debug-only.",
      "Canonical family IDs are not faked from legacy role-library IDs.",
      "Output does not feed current scoring or live report recommendations.",
    ],
  };
}

export const matchingEngineV1Foundation = {
  buildMatchingEngineFoundationDiagnostics,
};
