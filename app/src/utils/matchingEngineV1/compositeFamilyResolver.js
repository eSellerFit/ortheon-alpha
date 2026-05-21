// app/src/utils/matchingEngineV1/compositeFamilyResolver.js
// Debug-only composite canonical family resolver.
//
// Bundle 1D scope:
// - Resolve composite legacy-to-canonical mappings only when profile evidence
//   clearly points to one supporting canonical family.
// - Do not perform full matching, scoring, or live recommendation changes.

import {
  COMPOSITE_RESOLUTION_STATUSES,
  CONFIDENCE_LABELS,
  OWNERSHIP_LEVELS,
  SPINE_MATCH_TYPES,
} from "./constants.js";
import { getCanonicalFamilyById } from "./familyRegistry.js";

const FAMILY_EVIDENCE_TERMS = {
  "WI-01": [
    "workforce planning",
    "talent strategy",
    "talent planning",
    "headcount planning",
    "succession planning",
    "workforce strategy",
  ],
  "WI-02": [
    "people analytics",
    "hr analytics",
    "workforce analytics",
    "talent analytics",
    "people data",
    "hr data",
  ],
  "WI-03": [
    "hris",
    "hr tech",
    "hr technology",
    "workday",
    "greenhouse",
    "lever",
    "ats",
    "hr systems implementation",
  ],
  "WI-04": [
    "talent intelligence",
    "market research",
    "labor market",
    "talent market",
    "competitive intelligence",
    "market mapping",
  ],
  "PO-05": [
    "learning and development",
    "l&d",
    "leadership development",
    "executive coaching",
    "coaching",
    "training",
    "capability programs",
  ],
  "IP-01": [
    "independent consultant",
    "solo advisory",
    "fractional",
    "client acquisition",
    "advisory services",
    "consulting practice",
    "pipeline",
    "runway",
  ],
  "IP-03": [
    "creator practice",
    "expert-led",
    "coaching practice",
    "training products",
    "content business",
  ],
  "PT-02": [
    "engineering leadership",
    "vp engineering",
    "software engineering",
    "development teams",
    "architecture",
    "technical standards",
  ],
  "IT-01": [
    "enterprise it",
    "it leadership",
    "it operations",
    "infrastructure",
    "vendor management",
    "service desk",
  ],
  "DX-03": [
    "ai enablement",
    "ai transformation",
    "ai agents",
    "machine learning",
    "llm",
    "rag",
    "genai",
  ],
  "SA-04": [
    "transformation advisory",
    "consulting engagement",
    "client transformation",
    "transformation consultant",
    "change advisory",
  ],
};

const BUSINESS_MODEL_FAMILY_IDS = new Set(["IP-01", "IP-02", "IP-03"]);

const STRONG_OWNERSHIP_LEVELS = new Set([
  OWNERSHIP_LEVELS.OWNED,
  OWNERSHIP_LEVELS.LED,
  OWNERSHIP_LEVELS.MANAGED,
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
  return unique(spines.flatMap((spine) => asArray(spine.canonicalSpineIds)));
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

function getEvidenceText(evidenceSignals = []) {
  return evidenceSignals
    .map((signal) =>
      [
        signal.summary,
        signal.domain,
        signal.raw?.roleTitles,
        signal.raw?.leadershipScope,
        signal.raw?.senioritySignal,
      ]
        .flat()
        .filter(Boolean)
        .join(" ")
    )
    .join(" ")
    .toLowerCase();
}

function getFamilyEvidenceTerms(family = {}) {
  return [
    ...(FAMILY_EVIDENCE_TERMS[family.familyId] || []),
    family.familyName,
  ].filter(Boolean);
}

function findMatchedTerms(text = "", terms = []) {
  return unique(
    terms.filter((term) => text.includes(String(term).toLowerCase()))
  );
}

function getSpineMatchType(family = {}, candidateProfile = {}) {
  const primarySpineIds = collectCanonicalSpineIds(
    candidateProfile.primaryCareerSpines || []
  );
  const secondarySpineIds = collectCanonicalSpineIds(
    candidateProfile.secondaryCareerSpines || []
  );
  const weakSpineIds = collectCanonicalSpineIds(
    candidateProfile.weakCareerSpines || []
  );

  if (primarySpineIds.includes(family.spineId)) return SPINE_MATCH_TYPES.PRIMARY;
  if (secondarySpineIds.includes(family.spineId)) {
    return SPINE_MATCH_TYPES.SECONDARY;
  }
  if (weakSpineIds.includes(family.spineId)) return SPINE_MATCH_TYPES.WEAK;
  return SPINE_MATCH_TYPES.CROSS_SPINE;
}

function hasStrongOwnershipEvidence(family = {}, evidenceSignals = []) {
  const terms = getFamilyEvidenceTerms(family);

  return evidenceSignals.some((signal) => {
    if (!STRONG_OWNERSHIP_LEVELS.has(signal.ownershipLevel)) return false;

    const signalText = [
      signal.summary,
      signal.domain,
      signal.raw?.leadershipScope,
      signal.raw?.roleTitles,
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return findMatchedTerms(signalText, terms).length > 0;
  });
}

function buildCandidateFamilyOptions({
  recommendationCandidate = {},
  candidateProfile = {},
  evidenceSignals = [],
}) {
  const profileText = getProfileText(candidateProfile);
  const evidenceText = getEvidenceText(evidenceSignals);
  const combinedText = `${profileText} ${evidenceText}`;

  return (recommendationCandidate.supportingFamilyRefs || [])
    .map((familyRef) => getCanonicalFamilyById(familyRef.familyId))
    .filter(Boolean)
    .map((family) => {
      const matchedTerms = findMatchedTerms(
        combinedText,
        getFamilyEvidenceTerms(family)
      );
      const spineMatchType = getSpineMatchType(family, candidateProfile);
      const hasOwnershipEvidence = hasStrongOwnershipEvidence(
        family,
        evidenceSignals
      );
      const hasBusinessModelSpecificity = BUSINESS_MODEL_FAMILY_IDS.has(
        family.familyId
      )
        ? matchedTerms.some((term) =>
            [
              "independent consultant",
              "solo advisory",
              "fractional",
              "client acquisition",
              "advisory services",
              "consulting practice",
              "pipeline",
              "runway",
              "creator practice",
              "coaching practice",
            ].includes(term)
          )
        : true;

      return {
        familyId: family.familyId,
        familyName: family.familyName,
        familySpineId: family.spineId,
        familySpineName: family.spineName,
        spineMatchType,
        evidenceMatches: matchedTerms,
        hasOwnershipEvidence,
        hasBusinessModelSpecificity,
        plausible:
          matchedTerms.length > 0 &&
          hasBusinessModelSpecificity &&
          spineMatchType !== SPINE_MATCH_TYPES.WEAK &&
          spineMatchType !== SPINE_MATCH_TYPES.CROSS_SPINE,
      };
    });
}

function getResolutionConfidence(option = {}) {
  if (
    option.spineMatchType === SPINE_MATCH_TYPES.PRIMARY &&
    option.evidenceMatches.length >= 1
  ) {
    return CONFIDENCE_LABELS.HIGH;
  }

  if (
    option.spineMatchType === SPINE_MATCH_TYPES.SECONDARY &&
    option.evidenceMatches.length >= 2 &&
    option.hasOwnershipEvidence
  ) {
    return CONFIDENCE_LABELS.MEDIUM;
  }

  if (
    option.spineMatchType === SPINE_MATCH_TYPES.SECONDARY &&
    option.evidenceMatches.length >= 1
  ) {
    return CONFIDENCE_LABELS.LOW;
  }

  return "none";
}

function unresolved({
  recommendationCandidate = {},
  status,
  candidateFamilyOptions = [],
  reasons = [],
}) {
  return {
    objectType: "CompositeFamilyResolutionResult",
    resolved: false,
    resolvedFamilyId: null,
    resolvedFamilyName: null,
    resolvedFamilySpineId: null,
    resolvedFamilySpineName: null,
    resolutionConfidence: "none",
    resolutionStatus: status,
    candidateFamilyOptions,
    reasons,
    legacyDirectionId: recommendationCandidate.legacyDirectionId ?? null,
  };
}

export function resolveCompositeFamilyMapping({
  candidateProfile = {},
  evidenceSignals = [],
  recommendationCandidate = {},
} = {}) {
  if (recommendationCandidate.canonicalMappingConfidence !== "composite") {
    return {
      objectType: "CompositeFamilyResolutionResult",
      resolved: Boolean(recommendationCandidate.familyId),
      resolvedFamilyId: recommendationCandidate.familyId ?? null,
      resolvedFamilyName: recommendationCandidate.familyName ?? null,
      resolvedFamilySpineId: recommendationCandidate.familySpineId ?? null,
      resolvedFamilySpineName: recommendationCandidate.familySpineName ?? null,
      resolutionConfidence: recommendationCandidate.familyId
        ? CONFIDENCE_LABELS.HIGH
        : "none",
      resolutionStatus:
        COMPOSITE_RESOLUTION_STATUSES.EXACT_MAPPING_NOT_NEEDED,
      candidateFamilyOptions: [],
      reasons: ["Recommendation does not require composite mapping resolution."],
      legacyDirectionId: recommendationCandidate.legacyDirectionId ?? null,
    };
  }

  const candidateFamilyOptions = buildCandidateFamilyOptions({
    recommendationCandidate,
    candidateProfile,
    evidenceSignals,
  });

  if (candidateFamilyOptions.length === 0) {
    return unresolved({
      recommendationCandidate,
      status:
        COMPOSITE_RESOLUTION_STATUSES.UNRESOLVED_MISSING_SUPPORTING_FAMILIES,
      candidateFamilyOptions,
      reasons: ["Composite mapping has no valid supporting canonical families."],
    });
  }

  const primaryPlausibleOptions = candidateFamilyOptions.filter(
    (option) =>
      option.spineMatchType === SPINE_MATCH_TYPES.PRIMARY &&
      option.evidenceMatches.length > 0 &&
      option.hasBusinessModelSpecificity
  );

  if (primaryPlausibleOptions.length === 1) {
    const resolvedOption = primaryPlausibleOptions[0];

    return {
      objectType: "CompositeFamilyResolutionResult",
      resolved: true,
      resolvedFamilyId: resolvedOption.familyId,
      resolvedFamilyName: resolvedOption.familyName,
      resolvedFamilySpineId: resolvedOption.familySpineId,
      resolvedFamilySpineName: resolvedOption.familySpineName,
      resolutionConfidence: getResolutionConfidence(resolvedOption),
      resolutionStatus:
        COMPOSITE_RESOLUTION_STATUSES.RESOLVED_FROM_PRIMARY_SPINE,
      candidateFamilyOptions,
      reasons: [
        `Exactly one supporting family matched the candidate's primary spine with evidence: ${resolvedOption.evidenceMatches.join(", ")}.`,
      ],
      legacyDirectionId: recommendationCandidate.legacyDirectionId ?? null,
    };
  }

  if (primaryPlausibleOptions.length > 1) {
    return unresolved({
      recommendationCandidate,
      status: COMPOSITE_RESOLUTION_STATUSES.UNRESOLVED_MULTIPLE_PLAUSIBLE,
      candidateFamilyOptions,
      reasons: [
        "Multiple supporting families matched the candidate's primary spine, so a single primary family cannot be resolved safely.",
      ],
    });
  }

  const secondaryPlausibleOptions = candidateFamilyOptions.filter(
    (option) =>
      option.spineMatchType === SPINE_MATCH_TYPES.SECONDARY &&
      option.evidenceMatches.length >= 2 &&
      option.hasOwnershipEvidence &&
      option.hasBusinessModelSpecificity
  );

  if (secondaryPlausibleOptions.length === 1) {
    const resolvedOption = secondaryPlausibleOptions[0];

    return {
      objectType: "CompositeFamilyResolutionResult",
      resolved: true,
      resolvedFamilyId: resolvedOption.familyId,
      resolvedFamilyName: resolvedOption.familyName,
      resolvedFamilySpineId: resolvedOption.familySpineId,
      resolvedFamilySpineName: resolvedOption.familySpineName,
      resolutionConfidence: getResolutionConfidence(resolvedOption),
      resolutionStatus:
        COMPOSITE_RESOLUTION_STATUSES.RESOLVED_FROM_SECONDARY_SPINE,
      candidateFamilyOptions,
      reasons: [
        `Exactly one supporting family matched a secondary spine with ownership evidence: ${resolvedOption.evidenceMatches.join(", ")}.`,
      ],
      legacyDirectionId: recommendationCandidate.legacyDirectionId ?? null,
    };
  }

  if (secondaryPlausibleOptions.length > 1) {
    return unresolved({
      recommendationCandidate,
      status: COMPOSITE_RESOLUTION_STATUSES.UNRESOLVED_MULTIPLE_PLAUSIBLE,
      candidateFamilyOptions,
      reasons: [
        "Multiple supporting families matched secondary spine evidence, so the composite remains unresolved.",
      ],
    });
  }

  const weakOnlyOptions = candidateFamilyOptions.filter(
    (option) =>
      option.spineMatchType === SPINE_MATCH_TYPES.WEAK &&
      option.evidenceMatches.length > 0
  );

  if (weakOnlyOptions.length > 0) {
    return unresolved({
      recommendationCandidate,
      status: COMPOSITE_RESOLUTION_STATUSES.UNRESOLVED_WEAK_SPINE_ONLY,
      candidateFamilyOptions,
      reasons: [
        "Only weak/noisy spine evidence supported this composite, so it cannot be resolved as display-safe.",
      ],
    });
  }

  return unresolved({
    recommendationCandidate,
    status: COMPOSITE_RESOLUTION_STATUSES.UNRESOLVED_NO_SPINE_SUPPORT,
    candidateFamilyOptions,
    reasons: [
      "No supporting family had enough primary or secondary spine evidence to resolve the composite.",
    ],
  });
}
