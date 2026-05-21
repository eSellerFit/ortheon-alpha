// app/src/utils/matchingEngineV1/seedToLegacyBridgeDiagnostics.js
// Debug-only bridge diagnostics from canonical seed families to legacy directions.
//
// Bundle 1H scope:
// - Identify whether registry-seeded canonical families have corresponding
//   legacy direction mappings and whether v1.4 generated them.
// - Do not create recommendations, mutate mappings, or affect live output.

import { legacyDirectionFamilyMap } from "./legacyDirectionFamilyMap.js";

const BRIDGE_STATUSES = {
  ALREADY_GENERATED: "already_generated",
  BRIDGE_AVAILABLE_NOT_GENERATED: "bridge_available_not_generated",
  NO_LEGACY_DIRECTION_AVAILABLE: "no_legacy_direction_available",
  COMPOSITE_BRIDGE_AVAILABLE: "composite_bridge_available",
  WEAK_BRIDGE_ONLY: "weak_bridge_only",
};

const NEXT_STEPS = {
  NO_ACTION_NEEDED: "no_action_needed",
  IMPROVE_CANDIDATE_GENERATION: "improve_candidate_generation",
  ADD_OR_REFINE_LEGACY_DIRECTION: "add_or_refine_legacy_direction",
  RESOLVE_COMPOSITE_MAPPING: "resolve_composite_mapping",
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

function getSeedFamilies(registrySeededCandidatePreview = {}) {
  return uniqueByFamilyId([
    ...(registrySeededCandidatePreview.alreadyCoveredFamilies || []),
    ...(registrySeededCandidatePreview.primarySpineSeedFamilies || []),
    ...(registrySeededCandidatePreview.secondarySpineSeedFamilies || []),
    ...(registrySeededCandidatePreview.excludedFamilies || []),
  ]);
}

function getGeneratedLegacyDirectionIds(recommendationCandidates = []) {
  return new Set(
    recommendationCandidates
      .map((candidate) => candidate.legacyDirectionId)
      .filter(Boolean)
  );
}

function getDirectGeneratedFamilyIds(recommendationCandidates = []) {
  return new Set(
    recommendationCandidates
      .flatMap((candidate) => [
        candidate.familyId,
        candidate.primaryFamilyId,
      ])
      .filter(Boolean)
  );
}

function findLegacyDirectionMatches(familyId) {
  return Object.values(legacyDirectionFamilyMap).filter((mapping) => {
    if (mapping.primaryFamilyId === familyId) return true;
    return (mapping.supportingFamilyIds || []).includes(familyId);
  });
}

function chooseBridgeStatus({
  familyId,
  matchingLegacyDirections = [],
  directGeneratedFamilyIds,
  generatedLegacyDirectionIds,
}) {
  const generatedMatches = matchingLegacyDirections.filter((mapping) =>
    generatedLegacyDirectionIds.has(mapping.legacyDirectionId)
  );

  const generatedExactMatches = generatedMatches.filter(
    (mapping) =>
      mapping.mappingConfidence === "exact" &&
      mapping.primaryFamilyId === familyId
  );
  const generatedCompositeMatches = generatedMatches.filter(
    (mapping) => mapping.mappingConfidence === "composite"
  );
  const generatedWeakMatches = generatedMatches.filter(
    (mapping) => mapping.mappingConfidence === "weak"
  );

  if (
    directGeneratedFamilyIds.has(familyId) ||
    generatedExactMatches.length > 0
  ) {
    return {
      bridgeStatus: BRIDGE_STATUSES.ALREADY_GENERATED,
      recommendedNextStep: NEXT_STEPS.NO_ACTION_NEEDED,
      reasons: [
        "Canonical family is already represented by a generated legacy diagnostic candidate.",
      ],
    };
  }

  if (generatedCompositeMatches.length > 0) {
    return {
      bridgeStatus: BRIDGE_STATUSES.COMPOSITE_BRIDGE_AVAILABLE,
      recommendedNextStep: NEXT_STEPS.RESOLVE_COMPOSITE_MAPPING,
      reasons: [
        "A generated legacy candidate includes this family only through a composite bridge; mapping resolution is still needed.",
      ],
    };
  }

  if (generatedWeakMatches.length > 0) {
    return {
      bridgeStatus: BRIDGE_STATUSES.WEAK_BRIDGE_ONLY,
      recommendedNextStep: NEXT_STEPS.ADD_OR_REFINE_LEGACY_DIRECTION,
      reasons: [
        "A generated legacy candidate includes this family only through a weak bridge; the legacy direction or mapping needs refinement.",
      ],
    };
  }

  const exactMatches = matchingLegacyDirections.filter(
    (mapping) => mapping.mappingConfidence === "exact"
  );
  const compositeMatches = matchingLegacyDirections.filter(
    (mapping) => mapping.mappingConfidence === "composite"
  );
  const weakMatches = matchingLegacyDirections.filter(
    (mapping) => mapping.mappingConfidence === "weak"
  );

  if (exactMatches.length > 0) {
    return {
      bridgeStatus: BRIDGE_STATUSES.BRIDGE_AVAILABLE_NOT_GENERATED,
      recommendedNextStep: NEXT_STEPS.IMPROVE_CANDIDATE_GENERATION,
      reasons: [
        "An exact legacy bridge exists, but v1.4 candidate generation did not produce it for this profile.",
      ],
    };
  }

  if (compositeMatches.length > 0) {
    return {
      bridgeStatus: BRIDGE_STATUSES.COMPOSITE_BRIDGE_AVAILABLE,
      recommendedNextStep: NEXT_STEPS.RESOLVE_COMPOSITE_MAPPING,
      reasons: [
        "Only composite legacy bridges exist; future generation needs mapping resolution before display.",
      ],
    };
  }

  if (weakMatches.length > 0) {
    return {
      bridgeStatus: BRIDGE_STATUSES.WEAK_BRIDGE_ONLY,
      recommendedNextStep: NEXT_STEPS.ADD_OR_REFINE_LEGACY_DIRECTION,
      reasons: [
        "Only weak legacy bridges exist; this family likely needs a cleaner legacy direction or mapping.",
      ],
    };
  }

  return {
    bridgeStatus: BRIDGE_STATUSES.NO_LEGACY_DIRECTION_AVAILABLE,
    recommendedNextStep: NEXT_STEPS.ADD_OR_REFINE_LEGACY_DIRECTION,
    reasons: [
      "No legacy direction mapping currently represents this canonical family.",
    ],
  };
}

function buildBridgeItem({
  seedFamily,
  recommendationCandidates = [],
  directGeneratedFamilyIds,
  generatedLegacyDirectionIds,
}) {
  void recommendationCandidates;

  const matchingLegacyDirections = findLegacyDirectionMatches(
    seedFamily.familyId
  );
  const bridgeDecision = chooseBridgeStatus({
    familyId: seedFamily.familyId,
    matchingLegacyDirections,
    directGeneratedFamilyIds,
    generatedLegacyDirectionIds,
  });

  return {
    familyId: seedFamily.familyId,
    familyName: seedFamily.familyName,
    spineId: seedFamily.spineId,
    spineName: seedFamily.spineName,
    seedPriority: seedFamily.seedPriority,
    seedStatus: seedFamily.seedStatus,
    matchingLegacyDirectionIds: matchingLegacyDirections.map(
      (mapping) => mapping.legacyDirectionId
    ),
    matchingLegacyDirections: matchingLegacyDirections.map((mapping) => ({
      legacyDirectionId: mapping.legacyDirectionId,
      mappingConfidence: mapping.mappingConfidence,
      primaryFamilyId: mapping.primaryFamilyId,
      supportingFamilyIds: mapping.supportingFamilyIds || [],
      notes: mapping.notes,
    })),
    bridgeStatus: bridgeDecision.bridgeStatus,
    recommendedNextStep: bridgeDecision.recommendedNextStep,
    reasons: bridgeDecision.reasons,
  };
}

export function buildSeedToLegacyBridgeDiagnostics({
  registrySeededCandidatePreview = {},
  recommendationCandidates = [],
} = {}) {
  const seedFamilies = getSeedFamilies(registrySeededCandidatePreview);
  const directGeneratedFamilyIds =
    getDirectGeneratedFamilyIds(recommendationCandidates);
  const generatedLegacyDirectionIds =
    getGeneratedLegacyDirectionIds(recommendationCandidates);

  const bridgeItems = seedFamilies.map((seedFamily) =>
    buildBridgeItem({
      seedFamily,
      recommendationCandidates,
      directGeneratedFamilyIds,
      generatedLegacyDirectionIds,
    })
  );

  const alreadyGeneratedSeeds = bridgeItems.filter(
    (item) => item.bridgeStatus === BRIDGE_STATUSES.ALREADY_GENERATED
  );
  const unbridgedSeeds = bridgeItems.filter(
    (item) =>
      item.bridgeStatus === BRIDGE_STATUSES.NO_LEGACY_DIRECTION_AVAILABLE
  );
  const bridgedSeeds = bridgeItems.filter((item) =>
    [
      BRIDGE_STATUSES.BRIDGE_AVAILABLE_NOT_GENERATED,
      BRIDGE_STATUSES.COMPOSITE_BRIDGE_AVAILABLE,
      BRIDGE_STATUSES.WEAK_BRIDGE_ONLY,
    ].includes(item.bridgeStatus)
  );

  return {
    objectType: "SeedToLegacyBridgeDiagnostics",
    bridgedSeeds,
    unbridgedSeeds,
    alreadyGeneratedSeeds,
    bridgeSummary: {
      bridgedSeedCount: bridgedSeeds.length,
      unbridgedSeedCount: unbridgedSeeds.length,
      alreadyGeneratedSeedCount: alreadyGeneratedSeeds.length,
      bridgeAvailableNotGeneratedCount: bridgedSeeds.filter(
        (item) =>
          item.bridgeStatus ===
          BRIDGE_STATUSES.BRIDGE_AVAILABLE_NOT_GENERATED
      ).length,
      noLegacyDirectionAvailableCount: unbridgedSeeds.length,
    },
  };
}
