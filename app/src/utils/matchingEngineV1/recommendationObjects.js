// app/src/utils/matchingEngineV1/recommendationObjects.js
// Structural factories for Matching Engine v1 foundation diagnostics.
//
// Bundle 1 scope:
// - Normalize internal objects.
// - Use only explicit conservative legacy-to-canonical mappings.
// - Do not score.

import {
  COMPOSITE_RESOLUTION_STATUSES,
  CONFIDENCE_LABELS,
  PATH_TYPES,
} from "./constants.js";
import {
  getCanonicalFamilyById,
  getCanonicalFamilyRef,
} from "./familyRegistry.js";
import { getLegacyDirectionFamilyMapping } from "./legacyDirectionFamilyMap.js";

function mapV14Classification(classification) {
  if (classification === "Primary") return PATH_TYPES.DIRECT;
  if (classification === "Adjacent / Nearby") return PATH_TYPES.ADJACENT;
  if (classification === "Bridge-based") return PATH_TYPES.BRIDGE_BASED;
  if (classification === "Conditional") return PATH_TYPES.CONDITIONAL;
  if (classification === "Suppressed") return PATH_TYPES.SUPPRESSED;
  if (classification === "Longer-term") return PATH_TYPES.BRIDGE_BASED;
  return PATH_TYPES.CONDITIONAL;
}

export function createLevelBandResult({
  nativeLevelBand = null,
  targetEntryLevelBand = null,
  levelReset = "unknown",
  levelResetReason = null,
  scaleEvidence = null,
  recencyEvidence = null,
  credentialOverride = false,
  confidence = CONFIDENCE_LABELS.NEEDS_VALIDATION,
} = {}) {
  return {
    objectType: "LevelBandResult",
    nativeLevelBand,
    targetEntryLevelBand,
    levelReset,
    levelResetReason,
    scaleEvidence,
    recencyEvidence,
    credentialOverride,
    confidence,
  };
}

export function createFamilyEvaluation({
  familyId = null,
  familyName = null,
  legacyDirectionId = null,
  spine = null,
  coreEvidenceMet = false,
  supportingEvidence = [],
  falsePositiveSignals = [],
  credentialGate = { checked: false, status: "unknown" },
  bridge = null,
  condition = null,
  levelBandResult = createLevelBandResult(),
  financialFeasibility = { checked: false, status: "unknown" },
  aiDigitalTreatment = null,
  finalClassification = PATH_TYPES.CONDITIONAL,
  suppressionReason = null,
  rationale = [],
} = {}) {
  return {
    objectType: "FamilyEvaluation",
    familyId,
    familyName,
    legacyDirectionId,
    spine,
    coreEvidenceMet,
    supportingEvidence,
    falsePositiveSignals,
    credentialGate,
    bridge,
    condition,
    levelBandResult,
    financialFeasibility,
    aiDigitalTreatment,
    finalClassification,
    suppressionReason,
    rationale,
  };
}

export function createRecommendationCandidate({
  familyId = null,
  familyName = null,
  spine = null,
  familyRef = null,
  familySpineId = null,
  familySpineName = null,
  displayLabel = null,
  primaryFamilyId = null,
  supportingFamilyIds = [],
  supportingFamilyRefs = [],
  legacyDirectionId = null,
  canonicalMappingConfidence = "none",
  canonicalMappingNotes = null,
  compositeResolutionResult = null,
  pathType = PATH_TYPES.CONDITIONAL,
  evidenceMapping = [],
  levelBandResult = createLevelBandResult(),
  bridge = null,
  condition = null,
  credentialGate = { checked: false, status: "unknown" },
  suppressionReason = null,
  alignmentResult = null,
  confidence = CONFIDENCE_LABELS.NEEDS_VALIDATION,
  sourceDiagnostic = null,
} = {}) {
  return {
    objectType: "RecommendationCandidate",
    familyId,
    familyName,
    spine,
    familyRef,
    familySpineId,
    familySpineName,
    displayLabel,
    primaryFamilyId,
    supportingFamilyIds,
    supportingFamilyRefs,
    legacyDirectionId,
    canonicalMappingConfidence,
    canonicalMappingNotes,
    compositeResolutionResult,
    pathType,
    evidenceMapping,
    levelBandResult,
    bridge,
    condition,
    credentialGate,
    suppressionReason,
    alignmentResult,
    confidence,
    sourceDiagnostic,
  };
}

export function createDisplayRecommendation({
  recommendationCandidate,
  displayLabel = null,
} = {}) {
  const candidate = recommendationCandidate || {};

  return {
    objectType: "DisplayRecommendation",
    familyId: candidate.familyId ?? null,
    familyName: candidate.familyName ?? null,
    displayLabel: displayLabel ?? candidate.displayLabel ?? candidate.familyName ?? null,
    primaryFamilyId: candidate.primaryFamilyId ?? candidate.familyId ?? null,
    supportingFamilyIds: candidate.supportingFamilyIds || [],
    familyRef: candidate.familyRef ?? null,
    supportingFamilyRefs: candidate.supportingFamilyRefs || [],
    pathType: candidate.pathType ?? null,
    levelBandResult: candidate.levelBandResult ?? null,
    evidenceMapping: candidate.evidenceMapping || [],
    bridge: candidate.bridge ?? null,
    condition: candidate.condition ?? null,
    confidence: candidate.confidence ?? CONFIDENCE_LABELS.NEEDS_VALIDATION,
  };
}

export function applyCompositeResolutionToRecommendationCandidate({
  recommendationCandidate,
  compositeResolutionResult,
} = {}) {
  const candidate = recommendationCandidate || {};

  if (!compositeResolutionResult?.resolved) {
    return {
      ...candidate,
      compositeResolutionResult: compositeResolutionResult ?? null,
    };
  }

  if (
    compositeResolutionResult.resolutionStatus ===
    COMPOSITE_RESOLUTION_STATUSES.EXACT_MAPPING_NOT_NEEDED
  ) {
    return {
      ...candidate,
      compositeResolutionResult,
    };
  }

  const familyRef = getCanonicalFamilyRef(
    compositeResolutionResult.resolvedFamilyId
  );

  return {
    ...candidate,
    familyId: familyRef.familyId,
    familyName: familyRef.familyName,
    spine: familyRef.spineName,
    familyRef,
    familySpineId: familyRef.spineId,
    familySpineName: familyRef.spineName,
    primaryFamilyId: familyRef.familyId,
    canonicalMappingConfidence:
      compositeResolutionResult.resolutionConfidence === CONFIDENCE_LABELS.HIGH
        ? "composite_resolved_high"
        : "composite_resolved",
    canonicalMappingNotes: [
      candidate.canonicalMappingNotes,
      ...(compositeResolutionResult.reasons || []),
    ]
      .filter(Boolean)
      .join(" "),
    compositeResolutionResult,
  };
}

function getCanonicalMappingForDiagnostic(item = {}) {
  const mapping = getLegacyDirectionFamilyMapping(item.directionId);
  const primaryFamily =
    mapping.primaryFamilyId && mapping.mappingConfidence === "exact"
      ? getCanonicalFamilyById(mapping.primaryFamilyId)
      : null;

  const validSupportingFamilyIds = (mapping.supportingFamilyIds || []).filter(
    (familyId) => Boolean(getCanonicalFamilyById(familyId))
  );
  const familyRef = primaryFamily
    ? getCanonicalFamilyRef(primaryFamily.familyId)
    : null;
  const supportingFamilyRefs = validSupportingFamilyIds.map((familyId) =>
    getCanonicalFamilyRef(familyId)
  );

  return {
    mapping,
    familyId: primaryFamily?.familyId ?? null,
    familyName: primaryFamily?.familyName ?? item?.directionLabel ?? null,
    spine: primaryFamily?.spineName ?? item?.category ?? null,
    familyRef,
    familySpineId: primaryFamily?.spineId ?? null,
    familySpineName: primaryFamily?.spineName ?? null,
    primaryFamilyId: primaryFamily?.familyId ?? null,
    supportingFamilyIds: validSupportingFamilyIds,
    supportingFamilyRefs,
  };
}

function getCredentialGateFromDiagnostic(item = {}) {
  const flags = item.gates?.hardGateFlags || [];
  const credentialFlag = flags.find((flag) =>
    String(flag.flag || "").includes("credential")
  );

  return {
    checked: Boolean(item.lensResults?.credentialsGateResult || credentialFlag),
    status: credentialFlag ? credentialFlag.flag : item.lensResults?.credentialsGateResult?.level ?? "unknown",
    reason: credentialFlag?.reason ?? null,
  };
}

function getBridgeFromDiagnostic(item = {}) {
  const bridgeDirections = item.bridgeDirections || [];

  if (bridgeDirections.length === 0) {
    return null;
  }

  return {
    label: "Existing v1.4 bridge direction",
    options: bridgeDirections.map((bridge) => ({
      legacyDirectionId: bridge.directionId,
      label: bridge.directionLabel,
    })),
  };
}

function getConditionFromDiagnostic(item = {}) {
  const credentialGate = getCredentialGateFromDiagnostic(item);

  if (item.finalClassification === "Conditional" && credentialGate.status !== "unknown") {
    return {
      label: "Credential or license status confirmation",
      source: "v1.4 calibration",
    };
  }

  return null;
}

const GENERIC_EVIDENCE_TERMS = new Set([
  "enterprise",
  "leadership",
  "leader",
  "business",
  "strategy",
  "management",
  "operations",
  "transformation",
]);

function getEvidenceTermsForMapping(canonicalMapping = {}) {
  const familyRefs = [
    canonicalMapping.familyRef,
    ...(canonicalMapping.supportingFamilyRefs || []),
  ].filter(Boolean);

  return [
    ...familyRefs.flatMap((familyRef) => [
      familyRef.familyName,
      familyRef.spineName,
      ...String(familyRef.familyName || "")
        .split(/\W+/)
        .filter((term) => term.length > 3)
        .filter((term) => !GENERIC_EVIDENCE_TERMS.has(term.toLowerCase())),
    ]),
  ].filter(Boolean);
}

function getEvidenceMapping(canonicalMapping = {}, evidenceSignals = []) {
  const evidenceTerms = getEvidenceTermsForMapping(canonicalMapping);

  if (evidenceTerms.length === 0) {
    return [];
  }

  return evidenceSignals
    .filter((signal) => {
      const signalText = [
        signal.summary,
        signal.domain,
        signal.raw?.roleTitles,
        signal.raw?.senioritySignal,
        signal.raw?.leadershipScope,
      ]
        .flat()
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return evidenceTerms.some((term) =>
        signalText.includes(String(term).toLowerCase())
      );
    })
    .slice(0, 6);
}

export function recommendationCandidateFromV14Diagnostic({
  item,
  evidenceSignals = [],
} = {}) {
  const pathType = mapV14Classification(item?.finalClassification);
  const credentialGate = getCredentialGateFromDiagnostic(item);
  const bridge = getBridgeFromDiagnostic(item);
  const condition = getConditionFromDiagnostic(item);
  const canonicalMapping = getCanonicalMappingForDiagnostic(item);
  const evidenceMapping = getEvidenceMapping(canonicalMapping, evidenceSignals);

  const levelBandResult = createLevelBandResult({
    nativeLevelBand: item?.category ?? null,
    targetEntryLevelBand: item?.finalClassification ?? null,
    levelReset: pathType === PATH_TYPES.DIRECT ? "none" : "needs_review",
    levelResetReason: item?.calibration?.reasons?.[0] ?? null,
    scaleEvidence: item?.context ?? null,
    recencyEvidence: "unknown",
    credentialOverride: credentialGate.status?.includes("credential") ?? false,
    confidence: CONFIDENCE_LABELS.NEEDS_VALIDATION,
  });

  return createRecommendationCandidate({
    familyId: item?.familyId ?? canonicalMapping.familyId,
    familyName: item?.familyName ?? canonicalMapping.familyName,
    spine: canonicalMapping.spine,
    familyRef: canonicalMapping.familyRef,
    familySpineId: canonicalMapping.familySpineId,
    familySpineName: canonicalMapping.familySpineName,
    displayLabel: item?.directionLabel ?? null,
    primaryFamilyId: item?.familyId ?? canonicalMapping.primaryFamilyId,
    supportingFamilyIds: canonicalMapping.supportingFamilyIds,
    supportingFamilyRefs: canonicalMapping.supportingFamilyRefs,
    legacyDirectionId: item?.directionId ?? null,
    canonicalMappingConfidence:
      canonicalMapping.mapping.mappingConfidence ?? "none",
    canonicalMappingNotes: canonicalMapping.mapping.notes ?? null,
    pathType,
    evidenceMapping,
    levelBandResult,
    bridge,
    condition,
    credentialGate,
    suppressionReason: pathType === PATH_TYPES.SUPPRESSED ? "v14_suppressed" : null,
    confidence: CONFIDENCE_LABELS.NEEDS_VALIDATION,
    sourceDiagnostic: {
      engineVersion: "v1.4",
      finalClassification: item?.finalClassification ?? null,
      overallLensScore: item?.overallLensScore ?? null,
      candidateScore: item?.candidateScore ?? null,
      context: item?.context ?? null,
      decisionContext: item?.decisionContext ?? null,
      transitionCategory: item?.transitionCategory ?? null,
      transitionPathway: item?.transitionPathway ?? null,
      financialRealityLevel:
        item?.lensResults?.financialRealityResult?.level ?? null,
      practicalConstraintsLevel:
        item?.lensResults?.practicalConstraintsResult?.level ?? null,
      hardGateFlags: item?.gates?.hardGateFlags || [],
    },
  });
}
