// app/src/utils/matchingEngineV1/displaySafeSelector.js
// Debug-only display-safe candidate selector for Matching Engine v1.
//
// Bundle 1E scope:
// - Select which internal RecommendationCandidates are safe to display after
//   canonical mapping, composite resolution, alignment QA, and structural QA.
// - Do not change live report recommendations or ranking.

import {
  ALIGNMENT_ACTIONS,
  PATH_TYPES,
} from "./constants.js";

const DISPLAY_SAFE_STATUSES = {
  DISPLAY_SAFE: "display_safe",
  DISPLAY_SAFE_WITH_WARNING: "display_safe_with_warning",
  CONDITIONAL_ONLY: "conditional_only",
  BLOCKED: "blocked",
};

const DISPLAY_CLASSIFICATIONS = {
  PRIMARY: "Primary",
  ADJACENT: "Adjacent / Nearby",
  BRIDGE_BASED: "Bridge-based",
  CONDITIONAL: "Conditional",
  SUPPRESSED: "Suppressed / Do not display",
};

const DOWNGRADEABLE_ALIGNMENT_BLOCKERS = new Set([
  "primary_recommendation_outside_primary_spine",
  "secondary_or_weak_spine_used_as_primary",
]);

function issueAffectsCandidate(issue = {}, candidate = {}) {
  const affected = new Set(issue.recommendationIdsAffected || []);

  return [
    candidate.familyId,
    candidate.legacyDirectionId,
    candidate.displayLabel,
  ]
    .filter(Boolean)
    .some((id) => affected.has(id));
}

function getCandidateIssues(reportQaResult = {}, candidate = {}) {
  return {
    blockingIssues: (reportQaResult.blockingIssues || []).filter((issue) =>
      issueAffectsCandidate(issue, candidate)
    ),
    warnings: (reportQaResult.warnings || []).filter((issue) =>
      issueAffectsCandidate(issue, candidate)
    ),
  };
}

function hasNamedBridge(candidate = {}) {
  if (!candidate.bridge) return false;
  if (typeof candidate.bridge === "string") return candidate.bridge.trim().length > 0;
  if (candidate.bridge.label) return true;
  return Array.isArray(candidate.bridge.options) && candidate.bridge.options.length > 0;
}

function hasNamedCondition(candidate = {}) {
  if (!candidate.condition) return false;
  if (typeof candidate.condition === "string") {
    return candidate.condition.trim().length > 0;
  }
  return Boolean(candidate.condition.label);
}

function getBaseDisplayClassification(candidate = {}) {
  if (candidate.pathType === PATH_TYPES.DIRECT) return DISPLAY_CLASSIFICATIONS.PRIMARY;
  if (candidate.pathType === PATH_TYPES.ADJACENT) return DISPLAY_CLASSIFICATIONS.ADJACENT;
  if (candidate.pathType === PATH_TYPES.BRIDGE_BASED) {
    return DISPLAY_CLASSIFICATIONS.BRIDGE_BASED;
  }
  if (candidate.pathType === PATH_TYPES.CONDITIONAL) {
    return DISPLAY_CLASSIFICATIONS.CONDITIONAL;
  }
  return DISPLAY_CLASSIFICATIONS.SUPPRESSED;
}

function buildSelectedCandidate({
  candidate = {},
  displaySafeStatus,
  recommendedDisplayClassification,
  reasons = [],
  blockingReasons = [],
  warnings = [],
} = {}) {
  return {
    legacyDirectionId: candidate.legacyDirectionId ?? null,
    displayLabel: candidate.displayLabel ?? null,
    familyId: candidate.familyId ?? null,
    familyName: candidate.familyName ?? null,
    familySpineId: candidate.familySpineId ?? null,
    familySpineName: candidate.familySpineName ?? null,
    originalPathType: candidate.pathType ?? null,
    originalFinalClassification:
      candidate.sourceDiagnostic?.finalClassification ?? null,
    overallLensScore: candidate.sourceDiagnostic?.overallLensScore ?? null,
    candidateScore: candidate.sourceDiagnostic?.candidateScore ?? null,
    displaySafeStatus,
    recommendedDisplayClassification,
    reasons,
    blockingReasons,
    warnings,
  };
}

function evaluateCandidateForSelection({
  candidate = {},
  reportQaResult = {},
} = {}) {
  const alignment = candidate.alignmentResult || {};
  const { blockingIssues, warnings } = getCandidateIssues(
    reportQaResult,
    candidate
  );
  const nonDowngradeableBlockingIssues = blockingIssues.filter(
    (issue) => !DOWNGRADEABLE_ALIGNMENT_BLOCKERS.has(issue.code)
  );
  const downgradeableBlockingIssues = blockingIssues.filter((issue) =>
    DOWNGRADEABLE_ALIGNMENT_BLOCKERS.has(issue.code)
  );
  const reasons = [
    ...(alignment.reasons || []),
    ...(candidate.compositeResolutionResult?.reasons || []),
  ];
  const warningMessages = [
    ...warnings.map((issue) => `${issue.code}: ${issue.qaNotes}`),
    ...downgradeableBlockingIssues.map(
      (issue) => `${issue.code}: ${issue.qaNotes}`
    ),
  ];

  if (candidate.pathType === PATH_TYPES.SUPPRESSED) {
    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
      reasons,
      blockingReasons: ["Candidate is already suppressed by v1.4 diagnostics."],
      warnings: warningMessages,
    });
  }

  if (nonDowngradeableBlockingIssues.length > 0) {
    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
      reasons,
      blockingReasons: nonDowngradeableBlockingIssues.map(
        (issue) => `${issue.code}: ${issue.qaNotes}`
      ),
      warnings: warningMessages,
    });
  }

  if (!candidate.familyId) {
    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
      reasons,
      blockingReasons: ["Candidate has no resolved canonical family ID."],
      warnings: warningMessages,
    });
  }

  if (alignment.recommendedAction === ALIGNMENT_ACTIONS.BLOCK_DISPLAY) {
    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
      reasons,
      blockingReasons: [
        "Family alignment action is block_display.",
        ...(alignment.reasons || []),
      ],
      warnings: warningMessages,
    });
  }

  if (
    alignment.recommendedAction ===
    ALIGNMENT_ACTIONS.REQUIRE_BRIDGE_OR_CONDITION
  ) {
    if (hasNamedBridge(candidate)) {
      return buildSelectedCandidate({
        candidate,
        displaySafeStatus: DISPLAY_SAFE_STATUSES.CONDITIONAL_ONLY,
        recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.BRIDGE_BASED,
        reasons,
        blockingReasons: [],
        warnings: warningMessages,
      });
    }

    if (hasNamedCondition(candidate)) {
      return buildSelectedCandidate({
        candidate,
        displaySafeStatus: DISPLAY_SAFE_STATUSES.CONDITIONAL_ONLY,
        recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.CONDITIONAL,
        reasons,
        blockingReasons: [],
        warnings: warningMessages,
      });
    }

    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
      reasons,
      blockingReasons: [
        "Family alignment requires bridge or condition, but none is named.",
      ],
      warnings: warningMessages,
    });
  }

  if (alignment.recommendedAction === ALIGNMENT_ACTIONS.DOWNGRADE_TO_ADJACENT) {
    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.DISPLAY_SAFE_WITH_WARNING,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.ADJACENT,
      reasons,
      blockingReasons: [],
      warnings: warningMessages.length
        ? warningMessages
        : ["Primary classification downgraded to Adjacent / Nearby."],
    });
  }

  if (candidate.pathType === PATH_TYPES.BRIDGE_BASED) {
    if (!hasNamedBridge(candidate)) {
      return buildSelectedCandidate({
        candidate,
        displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
        recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
        reasons,
        blockingReasons: ["Bridge-based candidate has no named bridge."],
        warnings: warningMessages,
      });
    }

    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.CONDITIONAL_ONLY,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.BRIDGE_BASED,
      reasons,
      blockingReasons: [],
      warnings: warningMessages,
    });
  }

  if (candidate.pathType === PATH_TYPES.CONDITIONAL) {
    if (!hasNamedCondition(candidate)) {
      return buildSelectedCandidate({
        candidate,
        displaySafeStatus: DISPLAY_SAFE_STATUSES.BLOCKED,
        recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.SUPPRESSED,
        reasons,
        blockingReasons: ["Conditional candidate has no named condition."],
        warnings: warningMessages,
      });
    }

    return buildSelectedCandidate({
      candidate,
      displaySafeStatus: DISPLAY_SAFE_STATUSES.CONDITIONAL_ONLY,
      recommendedDisplayClassification: DISPLAY_CLASSIFICATIONS.CONDITIONAL,
      reasons,
      blockingReasons: [],
      warnings: warningMessages,
    });
  }

  return buildSelectedCandidate({
    candidate,
    displaySafeStatus: warningMessages.length
      ? DISPLAY_SAFE_STATUSES.DISPLAY_SAFE_WITH_WARNING
      : DISPLAY_SAFE_STATUSES.DISPLAY_SAFE,
    recommendedDisplayClassification: getBaseDisplayClassification(candidate),
    reasons,
    blockingReasons: [],
    warnings: warningMessages,
  });
}

export function buildDisplaySafeCandidateSelection({
  candidateProfile = {},
  evidenceSignals = [],
  recommendationCandidates = [],
  reportQaResult = {},
} = {}) {
  void candidateProfile;
  void evidenceSignals;

  const selectedCandidates = recommendationCandidates.map((candidate) =>
    evaluateCandidateForSelection({
      candidate,
      reportQaResult,
    })
  );

  const displaySafeCandidates = selectedCandidates.filter((candidate) =>
    [
      DISPLAY_SAFE_STATUSES.DISPLAY_SAFE,
      DISPLAY_SAFE_STATUSES.DISPLAY_SAFE_WITH_WARNING,
    ].includes(candidate.displaySafeStatus)
  );
  const conditionalCandidates = selectedCandidates.filter(
    (candidate) => candidate.displaySafeStatus === DISPLAY_SAFE_STATUSES.CONDITIONAL_ONLY
  );
  const blockedCandidates = selectedCandidates.filter(
    (candidate) => candidate.displaySafeStatus === DISPLAY_SAFE_STATUSES.BLOCKED
  );

  return {
    objectType: "DisplaySafeCandidateSelection",
    displaySafeCandidates,
    blockedCandidates,
    conditionalCandidates,
    selectionSummary: {
      displaySafeCandidateCount: displaySafeCandidates.length,
      blockedCandidateCount: blockedCandidates.length,
      conditionalCandidateCount: conditionalCandidates.length,
      displaySafePrimaryCount: displaySafeCandidates.filter(
        (candidate) =>
          candidate.recommendedDisplayClassification ===
          DISPLAY_CLASSIFICATIONS.PRIMARY
      ).length,
      displaySafeAdjacentCount: displaySafeCandidates.filter(
        (candidate) =>
          candidate.recommendedDisplayClassification ===
          DISPLAY_CLASSIFICATIONS.ADJACENT
      ).length,
      displaySafeBridgeCount: conditionalCandidates.filter(
        (candidate) =>
          candidate.recommendedDisplayClassification ===
          DISPLAY_CLASSIFICATIONS.BRIDGE_BASED
      ).length,
    },
  };
}
