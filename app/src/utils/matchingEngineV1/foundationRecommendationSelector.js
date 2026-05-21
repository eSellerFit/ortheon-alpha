// app/src/utils/matchingEngineV1/foundationRecommendationSelector.js
// Debug-only cleaner recommendation selection from foundation safety outputs.
//
// Phase 2C scope:
// - Select safe foundation recommendation candidates from v1.4 diagnostics.
// - Preserve raw v1.4 recommendations for comparison.
// - Do not feed scoring, live results, or reports.

import { evaluateBridgeVisibility } from "./bridgeVisibilityGate.js";

const DISPLAY_SAFE_STATUSES = new Set([
  "display_safe",
  "display_safe_with_warning",
]);

const CONDITIONAL_STATUS = "conditional_only";

const CLASSIFICATION_PRIORITY = {
  Primary: 0,
  "Adjacent / Nearby": 1,
  "Bridge-based": 2,
  Conditional: 3,
};

function mappingPriority(candidate = {}) {
  if (candidate.canonicalMappingConfidence === "exact") return 0;
  if (candidate.canonicalMappingConfidence === "composite_resolved_high") {
    return 1;
  }
  if (candidate.canonicalMappingConfidence === "composite_resolved") {
    return 2;
  }
  return 3;
}

function statusPriority(candidate = {}) {
  return candidate.displaySafeStatus === "display_safe" ? 0 : 1;
}

function classificationPriority(candidate = {}) {
  return (
    CLASSIFICATION_PRIORITY[candidate.recommendedDisplayClassification] ?? 4
  );
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function compareCandidates(a, b) {
  if (classificationPriority(a) !== classificationPriority(b)) {
    return classificationPriority(a) - classificationPriority(b);
  }

  if (mappingPriority(a) !== mappingPriority(b)) {
    return mappingPriority(a) - mappingPriority(b);
  }

  if (statusPriority(a) !== statusPriority(b)) {
    return statusPriority(a) - statusPriority(b);
  }

  if (numberOrZero(a.overallLensScore) !== numberOrZero(b.overallLensScore)) {
    return numberOrZero(b.overallLensScore) - numberOrZero(a.overallLensScore);
  }

  if (numberOrZero(a.candidateScore) !== numberOrZero(b.candidateScore)) {
    return numberOrZero(b.candidateScore) - numberOrZero(a.candidateScore);
  }

  return String(a.legacyDirectionId || "").localeCompare(
    String(b.legacyDirectionId || "")
  );
}

function compareFamilyRepresentatives(a, b) {
  if (mappingPriority(a) !== mappingPriority(b)) {
    return mappingPriority(a) - mappingPriority(b);
  }

  return compareCandidates(a, b);
}

function buildCandidateIndex(recommendationCandidates = []) {
  return new Map(
    recommendationCandidates
      .filter((candidate) => candidate.legacyDirectionId)
      .map((candidate) => [candidate.legacyDirectionId, candidate])
  );
}

function selectionReasonForMapping(candidate = {}) {
  if (candidate.canonicalMappingConfidence === "exact") {
    return "Exact canonical family mapping survived display-safe selection.";
  }

  if (
    ["composite_resolved_high", "composite_resolved"].includes(
      candidate.canonicalMappingConfidence
    )
  ) {
    return "Composite mapping resolved before display-safe selection.";
  }

  return "Candidate survived display-safe selection.";
}

function isEligibleFoundationCandidate(candidate = {}) {
  if (!candidate.familyId) return false;
  if (candidate.canonicalMappingConfidence === "weak") return false;
  if (candidate.canonicalMappingConfidence === "none") return false;

  if (
    candidate.canonicalMappingConfidence === "composite" &&
    !candidate.compositeResolutionResult?.resolved
  ) {
    return false;
  }

  return true;
}

function enrichSelectedCandidate(selected = {}, candidateIndex) {
  const sourceCandidate = candidateIndex.get(selected.legacyDirectionId);

  if (!sourceCandidate || !isEligibleFoundationCandidate(sourceCandidate)) {
    return null;
  }

  return {
    ...selected,
    canonicalMappingConfidence: sourceCandidate.canonicalMappingConfidence,
    canonicalMappingNotes: sourceCandidate.canonicalMappingNotes ?? null,
    alignmentStatus: sourceCandidate.alignmentResult?.alignmentStatus ?? null,
    alignmentAction: sourceCandidate.alignmentResult?.recommendedAction ?? null,
    alignmentMatchType: sourceCandidate.alignmentResult?.matchType ?? null,
    compositeResolutionStatus:
      sourceCandidate.compositeResolutionResult?.resolutionStatus ?? null,
    compositeResolutionConfidence:
      sourceCandidate.compositeResolutionResult?.resolutionConfidence ?? null,
    evidenceMapping: sourceCandidate.evidenceMapping || [],
    bridge: sourceCandidate.bridge ?? null,
    condition: sourceCandidate.condition ?? null,
    alignmentOverrideEvidence:
      sourceCandidate.alignmentResult?.overrideEvidence ?? null,
    sourcePathType: sourceCandidate.pathType ?? null,
    sourceDiagnostic: sourceCandidate.sourceDiagnostic ?? null,
    selectionReasons: [
      selectionReasonForMapping(sourceCandidate),
      ...(selected.reasons || []),
    ],
  };
}

function dedupeByFamily(candidates = []) {
  const deduped = [];
  const excluded = [];
  const selectedByFamily = new Map();

  [...candidates].sort(compareFamilyRepresentatives).forEach((candidate) => {
    const current = selectedByFamily.get(candidate.familyId);

    if (!current) {
      selectedByFamily.set(candidate.familyId, candidate);
      deduped.push(candidate);
      return;
    }

    excluded.push({
      ...candidate,
      exclusionReason: `A stronger candidate already represents ${candidate.familyId}.`,
      selectedLegacyDirectionId: current.legacyDirectionId,
    });
  });

  return {
    candidates: deduped,
    excluded,
  };
}

function withRanks(candidates = []) {
  return candidates.map((candidate, index) => ({
    ...candidate,
    rank: index + 1,
  }));
}

function buildBlockedExclusions(displaySafeSelection = {}) {
  return (displaySafeSelection.blockedCandidates || []).map((candidate) => ({
    ...candidate,
    exclusionReason:
      candidate.blockingReasons?.[0] || "Blocked by display-safe selection.",
  }));
}

export function buildFoundationSelectedRecommendations({
  displaySafeSelection = {},
  recommendationCandidates = [],
  candidateProfile = {},
} = {}) {
  const candidateIndex = buildCandidateIndex(recommendationCandidates);
  const displaySafeCandidates = (displaySafeSelection.displaySafeCandidates || [])
    .filter((candidate) => DISPLAY_SAFE_STATUSES.has(candidate.displaySafeStatus))
    .map((candidate) => enrichSelectedCandidate(candidate, candidateIndex))
    .filter(Boolean);
  const bridgeOrConditionalCandidates = (
    displaySafeSelection.conditionalCandidates || []
  )
    .filter((candidate) => candidate.displaySafeStatus === CONDITIONAL_STATUS)
    .map((candidate) => enrichSelectedCandidate(candidate, candidateIndex))
    .filter(Boolean);
  const primarySelection = dedupeByFamily(displaySafeCandidates);
  const conditionalSelection = dedupeByFamily(bridgeOrConditionalCandidates);
  const selectedRecommendations = withRanks(
    primarySelection.candidates.sort(compareCandidates)
  );
  const bridgeOrConditionalRecommendations = withRanks(
    conditionalSelection.candidates.sort(compareCandidates)
  );
  const gatedBridgeCandidates = bridgeOrConditionalRecommendations.map(
    (candidate) => ({
      ...candidate,
      bridgeVisibilityResult: evaluateBridgeVisibility({
        candidate,
        candidateProfile,
      }),
    })
  );
  const showableBridgeRecommendations = gatedBridgeCandidates.filter(
    (candidate) =>
      candidate.bridgeVisibilityResult.status === "show_bridge"
  );
  const needsConfirmationBridgeRecommendations = gatedBridgeCandidates.filter(
    (candidate) =>
      candidate.bridgeVisibilityResult.status === "needs_user_confirmation"
  );
  const hiddenBridgeCandidates = gatedBridgeCandidates.filter(
    (candidate) =>
      candidate.bridgeVisibilityResult.status === "hide_bridge"
  );
  const excludedCandidates = [
    ...buildBlockedExclusions(displaySafeSelection),
    ...primarySelection.excluded,
    ...conditionalSelection.excluded,
  ];

  return {
    objectType: "FoundationSelectedRecommendations",
    diagnosticOnly: true,
    selectedRecommendations,
    bridgeOrConditionalRecommendations,
    excludedCandidates,
    selectionSummary: {
      selectedRecommendationCount: selectedRecommendations.length,
      primaryRecommendationCount: selectedRecommendations.filter(
        (candidate) =>
          candidate.recommendedDisplayClassification === "Primary"
      ).length,
      adjacentRecommendationCount: selectedRecommendations.filter(
        (candidate) =>
          candidate.recommendedDisplayClassification === "Adjacent / Nearby"
      ).length,
      bridgeOrConditionalRecommendationCount:
        bridgeOrConditionalRecommendations.length,
      showableBridgeRecommendationCount: showableBridgeRecommendations.length,
      needsConfirmationBridgeRecommendationCount:
        needsConfirmationBridgeRecommendations.length,
      hiddenBridgeCandidateCount: hiddenBridgeCandidates.length,
      excludedCandidateCount: excludedCandidates.length,
    },
    showableBridgeRecommendations,
    needsConfirmationBridgeRecommendations,
    hiddenBridgeCandidates,
    notes: [
      "Foundation-selected recommendations are debug-only.",
      "Blocked, unmapped, weak, and unresolved composite candidates are excluded.",
      "Only show_bridge candidates are a bridge visibility lane candidate for future live review.",
      "Raw v1.4 recommendations remain unchanged for comparison.",
    ],
  };
}
