// app/src/utils/matchingEngineV1/registrySeededCandidatePreview.js
// Debug-only preview of canonical family seeds for a future matching engine.
//
// Bundle 1G scope:
// - Convert candidate-generation gaps into registry-backed seed candidates.
// - Do not create live recommendations, job titles, scores, or report output.

import { getCanonicalFamilyById } from "./familyRegistry.js";

const SEED_SOURCES = {
  MISSING_PRIMARY_SPINE_FAMILY: "missing_primary_spine_family",
  MISSING_SECONDARY_SPINE_FAMILY: "missing_secondary_spine_family",
  DISPLAY_SAFE_ALREADY_COVERED: "display_safe_already_covered",
};

const SEED_PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

const SEED_STATUSES = {
  SHOULD_CONSIDER: "should_consider",
  ALREADY_COVERED: "already_covered",
  EXCLUDED_FOR_NOW: "excluded_for_now",
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
    cvProfile.normalizedCareerEvidence?.roleTitles,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasCredentialEvidence(candidateProfile = {}) {
  const credentialStatus = candidateProfile.credentialStatus || {};
  return Boolean(
    credentialStatus.status === "signals_detected" ||
      credentialStatus.licenseStatus === "active" ||
      credentialStatus.licenseStatus === "confirmed" ||
      credentialStatus.detectedSignals?.length
  );
}

function hasIndependentPracticeEvidence(profileText = "") {
  return /\b(client acquisition|advisory services|consulting practice|independent consultant|solo advisory|portfolio career|book of business|runway)\b/.test(
    profileText
  );
}

function hasFounderEvidence(profileText = "") {
  return /\b(founder|co-founder|founded|venture|startup|bootstrapped|launched a business|business owner|gmv|fundraising|equity)\b/.test(
    profileText
  );
}

function shouldExcludeFamilyForNow({ family, candidateProfile }) {
  const profileText = getProfileText(candidateProfile);

  if (family.credentialGateType === "hard" && !hasCredentialEvidence(candidateProfile)) {
    return {
      excluded: true,
      reason:
        "Hard credential gate exists and candidate credential evidence is not confirmed.",
    };
  }

  if (
    family.credentialGateType === "jurisdiction_specific" &&
    !hasCredentialEvidence(candidateProfile)
  ) {
    return {
      excluded: true,
      reason:
        "Jurisdiction-specific credential path needs credential evidence before seeding.",
    };
  }

  if (
    family.spineId === "independent_practice" &&
    !hasIndependentPracticeEvidence(profileText)
  ) {
    return {
      excluded: true,
      reason:
        "Independent practice families need practice, client, pipeline, or runway evidence before seeding.",
    };
  }

  if (
    family.spineId === "founder_builder_operator" &&
    !hasFounderEvidence(profileText)
  ) {
    return {
      excluded: true,
      reason:
        "Founder / builder families need founder, venture, ownership, or business-building evidence before seeding.",
    };
  }

  return {
    excluded: false,
    reason: null,
  };
}

function buildSeedFamily({
  family,
  seedSource,
  seedPriority,
  seedStatus = SEED_STATUSES.SHOULD_CONSIDER,
  reasons = [],
}) {
  return {
    familyId: family.familyId,
    familyName: family.familyName,
    spineId: family.spineId,
    spineName: family.spineName,
    seedSource,
    seedPriority,
    seedStatus,
    reasons,
  };
}

function buildMissingFamilySeeds({
  families = [],
  seedSource,
  seedPriority,
  alreadyCoveredFamilyIds,
  candidateProfile,
}) {
  const seeds = [];
  const excluded = [];

  uniqueByFamilyId(families).forEach((familyRef) => {
    if (alreadyCoveredFamilyIds.has(familyRef.familyId)) return;

    const family = getCanonicalFamilyById(familyRef.familyId);
    if (!family) return;

    const exclusion = shouldExcludeFamilyForNow({ family, candidateProfile });

    if (exclusion.excluded) {
      excluded.push(
        buildSeedFamily({
          family,
          seedSource,
          seedPriority: SEED_PRIORITIES.LOW,
          seedStatus: SEED_STATUSES.EXCLUDED_FOR_NOW,
          reasons: [exclusion.reason],
        })
      );
      return;
    }

    seeds.push(
      buildSeedFamily({
        family,
        seedSource,
        seedPriority,
        reasons: [
          seedSource === SEED_SOURCES.MISSING_PRIMARY_SPINE_FAMILY
            ? "Canonical family belongs to a detected primary spine but was missing from v1.4 generated candidates."
            : "Canonical family belongs to a detected secondary spine but was missing from v1.4 generated candidates.",
        ],
      })
    );
  });

  return { seeds, excluded };
}

function buildAlreadyCoveredFamilies(displaySafeSelection = {}) {
  return uniqueByFamilyId(
    [
      ...(displaySafeSelection.displaySafeCandidates || []),
      ...(displaySafeSelection.conditionalCandidates || []),
    ]
      .map((candidate) => getCanonicalFamilyById(candidate.familyId))
      .filter(Boolean)
  ).map((family) =>
    buildSeedFamily({
      family,
      seedSource: SEED_SOURCES.DISPLAY_SAFE_ALREADY_COVERED,
      seedPriority: SEED_PRIORITIES.LOW,
      seedStatus: SEED_STATUSES.ALREADY_COVERED,
      reasons: [
        "Family is already represented by a display-safe or conditional diagnostic candidate.",
      ],
    })
  );
}

export function buildRegistrySeededCandidatePreview({
  candidateProfile = {},
  candidateGenerationGapDiagnostics = {},
  displaySafeSelection = {},
  recommendationCandidates = [],
} = {}) {
  void recommendationCandidates;

  const alreadyCoveredFamilies = buildAlreadyCoveredFamilies(displaySafeSelection);
  const alreadyCoveredFamilyIds = new Set(
    alreadyCoveredFamilies.map((family) => family.familyId)
  );
  const primarySeedResult = buildMissingFamilySeeds({
    families:
      candidateGenerationGapDiagnostics.missingPrimarySpineFamilies || [],
    seedSource: SEED_SOURCES.MISSING_PRIMARY_SPINE_FAMILY,
    seedPriority: SEED_PRIORITIES.HIGH,
    alreadyCoveredFamilyIds,
    candidateProfile,
  });
  const secondarySeedResult = buildMissingFamilySeeds({
    families:
      candidateGenerationGapDiagnostics.missingSecondarySpineFamilies || [],
    seedSource: SEED_SOURCES.MISSING_SECONDARY_SPINE_FAMILY,
    seedPriority: SEED_PRIORITIES.MEDIUM,
    alreadyCoveredFamilyIds,
    candidateProfile,
  });

  const primarySpineSeedFamilies = primarySeedResult.seeds;
  const secondarySpineSeedFamilies = secondarySeedResult.seeds;
  const excludedFamilies = [
    ...primarySeedResult.excluded,
    ...secondarySeedResult.excluded,
  ];

  return {
    objectType: "RegistrySeededCandidatePreview",
    primarySpineSeedFamilies,
    secondarySpineSeedFamilies,
    alreadyCoveredFamilies,
    excludedFamilies,
    previewSummary: {
      primarySeedFamilyCount: primarySpineSeedFamilies.length,
      secondarySeedFamilyCount: secondarySpineSeedFamilies.length,
      alreadyCoveredSeedFamilyCount: alreadyCoveredFamilies.length,
      excludedSeedFamilyCount: excludedFamilies.length,
    },
  };
}
