// app/src/utils/matchingEngineV1/roleLibraryCoverageReadinessReport.js
// Debug-only rollup for role-library coverage and foundation readiness.
//
// Bundle 1I/J scope:
// - Combine display-safe selection, generation gaps, registry seeds, and
//   seed-to-legacy bridge diagnostics into a foundation readiness report.
// - Do not create live recommendations, mutate roleLibrary, or affect reports.

import { getCanonicalFamilyById } from "./familyRegistry.js";

const READINESS_STATUSES = {
  READY_FOR_FOUNDATION_VALIDATION: "ready_for_foundation_validation",
  GENERATED_NEEDS_DISPLAY_SAFETY: "generated_needs_display_safety",
  BRIDGE_AVAILABLE_GENERATION_GAP: "bridge_available_generation_gap",
  COMPOSITE_MAPPING_NEEDS_RESOLUTION: "composite_mapping_needs_resolution",
  ROLE_LIBRARY_GAP: "role_library_gap",
  SEED_EXCLUDED_PENDING_EVIDENCE: "seed_excluded_pending_evidence",
  UNKNOWN_GAP: "unknown_gap",
};

const NEXT_ACTIONS = {
  NO_ACTION_NEEDED: "no_action_needed",
  RESOLVE_DISPLAY_SAFETY_BLOCKERS: "resolve_display_safety_blockers",
  IMPROVE_CANDIDATE_GENERATION: "improve_candidate_generation",
  RESOLVE_COMPOSITE_MAPPING: "resolve_composite_mapping",
  ADD_OR_REFINE_LEGACY_DIRECTION: "add_or_refine_legacy_direction",
  REVIEW_EXCLUDED_SEED_EVIDENCE: "review_excluded_seed_evidence",
  INVESTIGATE_COVERAGE_GAP: "investigate_coverage_gap",
};

function uniqueByFamilyId(families = []) {
  const seen = new Set();
  const unique = [];

  families.forEach((family) => {
    if (!family?.familyId || seen.has(family.familyId)) return;
    seen.add(family.familyId);
    unique.push(family);
  });

  return unique;
}

function familyRef(familyId) {
  const family = getCanonicalFamilyById(familyId);

  if (!family) return null;

  return {
    familyId: family.familyId,
    familyName: family.familyName,
    spineId: family.spineId,
    spineName: family.spineName,
  };
}

function normalizeFamilyRef(family = {}) {
  if (!family.familyId) return null;

  return (
    familyRef(family.familyId) || {
      familyId: family.familyId,
      familyName: family.familyName ?? null,
      spineId: family.spineId ?? null,
      spineName: family.spineName ?? null,
    }
  );
}

function buildNeededFamilies({
  candidateGenerationGapDiagnostics = {},
  registrySeededCandidatePreview = {},
  seedToLegacyBridgeDiagnostics = {},
} = {}) {
  return uniqueByFamilyId(
    [
      ...(candidateGenerationGapDiagnostics.displaySafeFamilyCoverage || []),
      ...(candidateGenerationGapDiagnostics.generatedFamilyCoverage || []),
      ...(candidateGenerationGapDiagnostics.missingPrimarySpineFamilies || []),
      ...(candidateGenerationGapDiagnostics.missingSecondarySpineFamilies || []),
      ...(registrySeededCandidatePreview.alreadyCoveredFamilies || []),
      ...(registrySeededCandidatePreview.primarySpineSeedFamilies || []),
      ...(registrySeededCandidatePreview.secondarySpineSeedFamilies || []),
      ...(registrySeededCandidatePreview.excludedFamilies || []),
      ...(seedToLegacyBridgeDiagnostics.alreadyGeneratedSeeds || []),
      ...(seedToLegacyBridgeDiagnostics.bridgedSeeds || []),
      ...(seedToLegacyBridgeDiagnostics.unbridgedSeeds || []),
    ]
      .map(normalizeFamilyRef)
      .filter(Boolean)
  );
}

function familyIdSet(families = []) {
  return new Set(families.map((family) => family.familyId).filter(Boolean));
}

function buildBridgeMap(seedToLegacyBridgeDiagnostics = {}) {
  return new Map(
    [
      ...(seedToLegacyBridgeDiagnostics.alreadyGeneratedSeeds || []),
      ...(seedToLegacyBridgeDiagnostics.bridgedSeeds || []),
      ...(seedToLegacyBridgeDiagnostics.unbridgedSeeds || []),
    ].map((item) => [item.familyId, item])
  );
}

function buildSeedMap(registrySeededCandidatePreview = {}) {
  return new Map(
    [
      ...(registrySeededCandidatePreview.alreadyCoveredFamilies || []),
      ...(registrySeededCandidatePreview.primarySpineSeedFamilies || []),
      ...(registrySeededCandidatePreview.secondarySpineSeedFamilies || []),
      ...(registrySeededCandidatePreview.excludedFamilies || []),
    ].map((item) => [item.familyId, item])
  );
}

function getCoverageSource({
  familyId,
  primaryMissingFamilyIds,
  secondaryMissingFamilyIds,
  seed,
}) {
  if (seed?.seedSource) return seed.seedSource;
  if (primaryMissingFamilyIds.has(familyId)) return "missing_primary_spine_family";
  if (secondaryMissingFamilyIds.has(familyId)) return "missing_secondary_spine_family";
  return "generated_or_display_safe_family";
}

function chooseReadiness({
  familyId,
  generatedFamilyIds,
  displaySafeFamilyIds,
  missingFamilyIds,
  bridge,
  seed,
}) {
  if (displaySafeFamilyIds.has(familyId)) {
    return {
      foundationReadinessStatus:
        READINESS_STATUSES.READY_FOR_FOUNDATION_VALIDATION,
      recommendedNextAction: NEXT_ACTIONS.NO_ACTION_NEEDED,
      reasons: [
        "Family is represented by display-safe or conditional diagnostics.",
      ],
    };
  }

  if (generatedFamilyIds.has(familyId)) {
    return {
      foundationReadinessStatus:
        READINESS_STATUSES.GENERATED_NEEDS_DISPLAY_SAFETY,
      recommendedNextAction: NEXT_ACTIONS.RESOLVE_DISPLAY_SAFETY_BLOCKERS,
      reasons: [
        "Family appears in generated candidates but is not currently display-safe.",
      ],
    };
  }

  if (seed?.seedStatus === "excluded_for_now") {
    return {
      foundationReadinessStatus:
        READINESS_STATUSES.SEED_EXCLUDED_PENDING_EVIDENCE,
      recommendedNextAction: NEXT_ACTIONS.REVIEW_EXCLUDED_SEED_EVIDENCE,
      reasons: seed.reasons || [
        "Seed family is excluded until stronger evidence is available.",
      ],
    };
  }

  if (bridge?.bridgeStatus === "bridge_available_not_generated") {
    return {
      foundationReadinessStatus:
        READINESS_STATUSES.BRIDGE_AVAILABLE_GENERATION_GAP,
      recommendedNextAction: NEXT_ACTIONS.IMPROVE_CANDIDATE_GENERATION,
      reasons: bridge.reasons || [
        "Legacy bridge exists but candidate generation did not produce it.",
      ],
    };
  }

  if (
    bridge?.bridgeStatus === "composite_bridge_available" ||
    bridge?.bridgeStatus === "weak_bridge_only"
  ) {
    return {
      foundationReadinessStatus:
        READINESS_STATUSES.COMPOSITE_MAPPING_NEEDS_RESOLUTION,
      recommendedNextAction:
        bridge.recommendedNextStep || NEXT_ACTIONS.RESOLVE_COMPOSITE_MAPPING,
      reasons: bridge.reasons || [
        "Only composite or weak legacy bridge coverage exists.",
      ],
    };
  }

  if (bridge?.bridgeStatus === "no_legacy_direction_available") {
    return {
      foundationReadinessStatus: READINESS_STATUSES.ROLE_LIBRARY_GAP,
      recommendedNextAction: NEXT_ACTIONS.ADD_OR_REFINE_LEGACY_DIRECTION,
      reasons: bridge.reasons || [
        "No legacy direction currently represents this canonical family.",
      ],
    };
  }

  if (missingFamilyIds.has(familyId)) {
    return {
      foundationReadinessStatus: READINESS_STATUSES.UNKNOWN_GAP,
      recommendedNextAction: NEXT_ACTIONS.INVESTIGATE_COVERAGE_GAP,
      reasons: [
        "Family is expected from detected spine coverage but has no clear bridge diagnostic.",
      ],
    };
  }

  return {
    foundationReadinessStatus: READINESS_STATUSES.UNKNOWN_GAP,
    recommendedNextAction: NEXT_ACTIONS.INVESTIGATE_COVERAGE_GAP,
    reasons: ["Family coverage state needs review."],
  };
}

function buildFamilyCoverageRows({
  neededFamilies,
  candidateGenerationGapDiagnostics,
  registrySeededCandidatePreview,
  seedToLegacyBridgeDiagnostics,
}) {
  const generatedFamilyIds = familyIdSet(
    candidateGenerationGapDiagnostics.generatedFamilyCoverage || []
  );
  const displaySafeFamilyIds = familyIdSet(
    candidateGenerationGapDiagnostics.displaySafeFamilyCoverage || []
  );
  const primaryMissingFamilyIds = familyIdSet(
    candidateGenerationGapDiagnostics.missingPrimarySpineFamilies || []
  );
  const secondaryMissingFamilyIds = familyIdSet(
    candidateGenerationGapDiagnostics.missingSecondarySpineFamilies || []
  );
  const missingFamilyIds = new Set([
    ...primaryMissingFamilyIds,
    ...secondaryMissingFamilyIds,
  ]);
  const bridgeMap = buildBridgeMap(seedToLegacyBridgeDiagnostics);
  const seedMap = buildSeedMap(registrySeededCandidatePreview);

  return neededFamilies.map((family) => {
    const bridge = bridgeMap.get(family.familyId) || null;
    const seed = seedMap.get(family.familyId) || null;
    const readiness = chooseReadiness({
      familyId: family.familyId,
      generatedFamilyIds,
      displaySafeFamilyIds,
      missingFamilyIds,
      bridge,
      seed,
    });

    return {
      familyId: family.familyId,
      familyName: family.familyName,
      spineId: family.spineId,
      spineName: family.spineName,
      coverageSource: getCoverageSource({
        familyId: family.familyId,
        primaryMissingFamilyIds,
        secondaryMissingFamilyIds,
        seed,
      }),
      generated: generatedFamilyIds.has(family.familyId),
      displaySafe: displaySafeFamilyIds.has(family.familyId),
      missing: missingFamilyIds.has(family.familyId),
      legacyBridgeStatus: bridge?.bridgeStatus ?? "not_evaluated",
      matchingLegacyDirectionIds: bridge?.matchingLegacyDirectionIds || [],
      recommendedNextAction: readiness.recommendedNextAction,
      foundationReadinessStatus: readiness.foundationReadinessStatus,
      reasons: readiness.reasons,
    };
  });
}

export function buildRoleLibraryCoverageReadinessReport({
  displaySafeSelection = {},
  candidateGenerationGapDiagnostics = {},
  registrySeededCandidatePreview = {},
  seedToLegacyBridgeDiagnostics = {},
} = {}) {
  void displaySafeSelection;

  const neededCanonicalFamilies = buildNeededFamilies({
    candidateGenerationGapDiagnostics,
    registrySeededCandidatePreview,
    seedToLegacyBridgeDiagnostics,
  });
  const generatedFamilies =
    candidateGenerationGapDiagnostics.generatedFamilyCoverage || [];
  const displaySafeFamilies =
    candidateGenerationGapDiagnostics.displaySafeFamilyCoverage || [];
  const missingFamilies = uniqueByFamilyId([
    ...(candidateGenerationGapDiagnostics.missingPrimarySpineFamilies || []),
    ...(candidateGenerationGapDiagnostics.missingSecondarySpineFamilies || []),
  ]);
  const familyCoverageRows = buildFamilyCoverageRows({
    neededFamilies: neededCanonicalFamilies,
    candidateGenerationGapDiagnostics,
    registrySeededCandidatePreview,
    seedToLegacyBridgeDiagnostics,
  });
  const readinessCount = (status) =>
    familyCoverageRows.filter(
      (row) => row.foundationReadinessStatus === status
    ).length;

  return {
    objectType: "RoleLibraryCoverageFoundationReadinessReport",
    neededCanonicalFamilies,
    generatedFamilies,
    displaySafeFamilies,
    missingFamilies,
    familyCoverageRows,
    readinessSummary: {
      neededCanonicalFamilyCount: neededCanonicalFamilies.length,
      generatedFamilyCount: generatedFamilies.length,
      displaySafeFamilyCount: displaySafeFamilies.length,
      missingFamilyCount: missingFamilies.length,
      foundationReadyFamilyCount: readinessCount(
        READINESS_STATUSES.READY_FOR_FOUNDATION_VALIDATION
      ),
      displaySafetyGapFamilyCount: readinessCount(
        READINESS_STATUSES.GENERATED_NEEDS_DISPLAY_SAFETY
      ),
      candidateGenerationGapFamilyCount: readinessCount(
        READINESS_STATUSES.BRIDGE_AVAILABLE_GENERATION_GAP
      ),
      compositeBridgeFamilyCount: readinessCount(
        READINESS_STATUSES.COMPOSITE_MAPPING_NEEDS_RESOLUTION
      ),
      roleLibraryGapFamilyCount: readinessCount(
        READINESS_STATUSES.ROLE_LIBRARY_GAP
      ),
      excludedPendingEvidenceFamilyCount: readinessCount(
        READINESS_STATUSES.SEED_EXCLUDED_PENDING_EVIDENCE
      ),
    },
  };
}
