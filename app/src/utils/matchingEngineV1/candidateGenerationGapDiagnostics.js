// app/src/utils/matchingEngineV1/candidateGenerationGapDiagnostics.js
// Debug-only diagnostics for legacy candidate-generation coverage gaps.
//
// Bundle 1F scope:
// - Compare detected profile spines with canonical registry families, v1.4
//   generated recommendation candidates, and display-safe selection.
// - Do not generate live recommendations or alter scoring/report output.

import {
  getCanonicalFamiliesBySpine,
  getCanonicalFamilyById,
} from "./familyRegistry.js";

const COVERAGE_STATUSES = {
  COVERED_BY_DISPLAY_SAFE: "covered_by_display_safe",
  GENERATED_BUT_NOT_DISPLAY_SAFE: "generated_but_not_display_safe",
  MISSING_FROM_GENERATED_CANDIDATES: "missing_from_generated_candidates",
  NO_EXPECTED_FAMILIES_DEFINED: "no_expected_families_defined",
};

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function canonicalSpineEntries(detectedSpines = []) {
  const entries = [];
  const seen = new Set();

  detectedSpines.forEach((detectedSpine) => {
    (detectedSpine.canonicalSpineIds || []).forEach((spineId) => {
      if (seen.has(spineId)) return;
      seen.add(spineId);
      entries.push({
        spineId,
        detectorSpineId: detectedSpine.detectorSpineId,
        detectorSpineLabel: detectedSpine.detectorSpineLabel,
        score: detectedSpine.score,
      });
    });
  });

  return entries;
}

function familyRefs(familyIds = []) {
  return familyIds
    .map((familyId) => getCanonicalFamilyById(familyId))
    .filter(Boolean)
    .map((family) => ({
      familyId: family.familyId,
      familyName: family.familyName,
      spineId: family.spineId,
      spineName: family.spineName,
    }));
}

function getGeneratedFamilyIds(recommendationCandidates = []) {
  return unique(
    recommendationCandidates.flatMap((candidate) => [
      candidate.familyId,
      ...(candidate.supportingFamilyIds || []),
    ])
  );
}

function getDisplaySafeFamilyIds(displaySafeSelection = {}) {
  return unique(
    [
      ...(displaySafeSelection.displaySafeCandidates || []),
      ...(displaySafeSelection.conditionalCandidates || []),
    ].map((candidate) => candidate.familyId)
  );
}

function getBlockedGeneratedFamilyIds(displaySafeSelection = {}) {
  return unique(
    (displaySafeSelection.blockedCandidates || []).flatMap((candidate) => [
      candidate.familyId,
    ])
  );
}

function buildCoverageItem({
  spineEntry,
  generatedFamilyIds,
  displaySafeFamilyIds,
  blockedGeneratedFamilyIds,
}) {
  const expectedFamilies = getCanonicalFamiliesBySpine(spineEntry.spineId);
  const expectedFamilyIds = expectedFamilies.map((family) => family.familyId);
  const generatedExpectedFamilyIds = expectedFamilyIds.filter((familyId) =>
    generatedFamilyIds.includes(familyId)
  );
  const displaySafeExpectedFamilyIds = expectedFamilyIds.filter((familyId) =>
    displaySafeFamilyIds.includes(familyId)
  );
  const blockedExpectedFamilyIds = expectedFamilyIds.filter((familyId) =>
    blockedGeneratedFamilyIds.includes(familyId)
  );
  const missingFamilyIds = expectedFamilyIds.filter(
    (familyId) => !generatedFamilyIds.includes(familyId)
  );

  let coverageStatus = COVERAGE_STATUSES.NO_EXPECTED_FAMILIES_DEFINED;
  const notes = [];

  if (expectedFamilyIds.length === 0) {
    notes.push("No canonical families are defined for this detected spine.");
  } else if (displaySafeExpectedFamilyIds.length > 0) {
    coverageStatus = COVERAGE_STATUSES.COVERED_BY_DISPLAY_SAFE;
    notes.push(
      "At least one expected canonical family is represented by a display-safe or conditional candidate."
    );
  } else if (generatedExpectedFamilyIds.length > 0 || blockedExpectedFamilyIds.length > 0) {
    coverageStatus = COVERAGE_STATUSES.GENERATED_BUT_NOT_DISPLAY_SAFE;
    notes.push(
      "Expected canonical family evidence appeared in generated candidates, but none survived display-safe selection."
    );
  } else {
    coverageStatus = COVERAGE_STATUSES.MISSING_FROM_GENERATED_CANDIDATES;
    notes.push(
      "Detected spine has canonical families, but v1.4 candidate generation did not produce those families."
    );
  }

  const firstFamily = expectedFamilies[0] || null;

  return {
    spineId: spineEntry.spineId,
    spineName: firstFamily?.spineName || spineEntry.detectorSpineLabel || null,
    detectorSpineId: spineEntry.detectorSpineId,
    detectorSpineLabel: spineEntry.detectorSpineLabel,
    expectedFamilyIds,
    expectedFamilies: familyRefs(expectedFamilyIds),
    generatedFamilyIds: generatedExpectedFamilyIds,
    displaySafeFamilyIds: displaySafeExpectedFamilyIds,
    missingFamilyIds,
    missingFamilies: familyRefs(missingFamilyIds),
    coverageStatus,
    notes,
  };
}

function buildCoverage({
  detectedSpines = [],
  generatedFamilyIds = [],
  displaySafeFamilyIds = [],
  blockedGeneratedFamilyIds = [],
}) {
  return canonicalSpineEntries(detectedSpines).map((spineEntry) =>
    buildCoverageItem({
      spineEntry,
      generatedFamilyIds,
      displaySafeFamilyIds,
      blockedGeneratedFamilyIds,
    })
  );
}

function buildUnsafeGeneratedCandidates(displaySafeSelection = {}) {
  return (displaySafeSelection.blockedCandidates || []).map((candidate) => ({
    legacyDirectionId: candidate.legacyDirectionId,
    displayLabel: candidate.displayLabel,
    familyId: candidate.familyId,
    familyName: candidate.familyName,
    originalPathType: candidate.originalPathType,
    originalFinalClassification: candidate.originalFinalClassification,
    blockingReasons: candidate.blockingReasons,
  }));
}

export function buildCandidateGenerationGapDiagnostics({
  candidateProfile = {},
  recommendationCandidates = [],
  displaySafeSelection = {},
} = {}) {
  const generatedFamilyIds = getGeneratedFamilyIds(recommendationCandidates);
  const displaySafeFamilyIds = getDisplaySafeFamilyIds(displaySafeSelection);
  const blockedGeneratedFamilyIds =
    getBlockedGeneratedFamilyIds(displaySafeSelection);

  const primarySpineCoverage = buildCoverage({
    detectedSpines: candidateProfile.primaryCareerSpines || [],
    generatedFamilyIds,
    displaySafeFamilyIds,
    blockedGeneratedFamilyIds,
  });
  const secondarySpineCoverage = buildCoverage({
    detectedSpines: candidateProfile.secondaryCareerSpines || [],
    generatedFamilyIds,
    displaySafeFamilyIds,
    blockedGeneratedFamilyIds,
  });
  const missingPrimarySpineFamilies = primarySpineCoverage.flatMap(
    (coverage) => coverage.missingFamilies
  );
  const missingSecondarySpineFamilies = secondarySpineCoverage.flatMap(
    (coverage) => coverage.missingFamilies
  );
  const unsafeGeneratedCandidates =
    buildUnsafeGeneratedCandidates(displaySafeSelection);

  return {
    objectType: "CandidateGenerationGapDiagnostics",
    primarySpineCoverage,
    secondarySpineCoverage,
    generatedFamilyCoverage: familyRefs(generatedFamilyIds),
    displaySafeFamilyCoverage: familyRefs(displaySafeFamilyIds),
    missingPrimarySpineFamilies,
    missingSecondarySpineFamilies,
    unsafeGeneratedCandidates,
    gapSummary: {
      primarySpineCoverageGapCount: primarySpineCoverage.filter(
        (coverage) =>
          coverage.coverageStatus ===
          COVERAGE_STATUSES.MISSING_FROM_GENERATED_CANDIDATES
      ).length,
      secondarySpineCoverageGapCount: secondarySpineCoverage.filter(
        (coverage) =>
          coverage.coverageStatus ===
          COVERAGE_STATUSES.MISSING_FROM_GENERATED_CANDIDATES
      ).length,
      missingPrimaryFamilyCount: missingPrimarySpineFamilies.length,
      generatedUnsafeCandidateCount: unsafeGeneratedCandidates.length,
    },
  };
}
