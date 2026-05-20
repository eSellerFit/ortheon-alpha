// app/src/utils/matchingEngineV1/recommendationObjects.js
// Structural factories for Matching Engine v1 foundation diagnostics.
//
// Bundle 1 scope:
// - Normalize internal objects.
// - Use only explicit conservative legacy-to-canonical mappings.
// - Do not score.

import { CONFIDENCE_LABELS, PATH_TYPES } from "./constants.js";
import { getCanonicalFamilyById } from "./familyRegistry.js";
import { getLegacyDirectionFamilyMapping } from "./legacyDirectionFamilyMap.js";

function asArray(value) {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) return value;
  return [value];
}

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
  displayLabel = null,
  primaryFamilyId = null,
  supportingFamilyIds = [],
  legacyDirectionId = null,
  canonicalMappingConfidence = "none",
  canonicalMappingNotes = null,
  pathType = PATH_TYPES.CONDITIONAL,
  evidenceMapping = [],
  levelBandResult = createLevelBandResult(),
  bridge = null,
  condition = null,
  credentialGate = { checked: false, status: "unknown" },
  suppressionReason = null,
  confidence = CONFIDENCE_LABELS.NEEDS_VALIDATION,
  sourceDiagnostic = null,
} = {}) {
  return {
    objectType: "RecommendationCandidate",
    familyId,
    familyName,
    spine,
    displayLabel,
    primaryFamilyId,
    supportingFamilyIds,
    legacyDirectionId,
    canonicalMappingConfidence,
    canonicalMappingNotes,
    pathType,
    evidenceMapping,
    levelBandResult,
    bridge,
    condition,
    credentialGate,
    suppressionReason,
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
    pathType: candidate.pathType ?? null,
    levelBandResult: candidate.levelBandResult ?? null,
    evidenceMapping: candidate.evidenceMapping || [],
    bridge: candidate.bridge ?? null,
    condition: candidate.condition ?? null,
    confidence: candidate.confidence ?? CONFIDENCE_LABELS.NEEDS_VALIDATION,
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

  return {
    mapping,
    familyId: primaryFamily?.familyId ?? null,
    familyName: primaryFamily?.familyName ?? item?.directionLabel ?? null,
    spine: primaryFamily?.spineName ?? item?.category ?? null,
    primaryFamilyId: primaryFamily?.familyId ?? null,
    supportingFamilyIds: validSupportingFamilyIds,
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

function getEvidenceMapping(item = {}, evidenceSignals = []) {
  const directionId = item.directionId;
  const text = [
    item.directionLabel,
    item.category,
    item.context,
    item.metaDirection,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return evidenceSignals
    .filter((signal) => {
      if (signal.relatedFamilyIds?.includes(directionId)) return true;
      return asArray(signal.falsePositiveRisk).some((risk) =>
        text.includes(String(risk).replaceAll("_", " "))
      );
    })
    .slice(0, 6);
}

export function recommendationCandidateFromV14Diagnostic({
  item,
  evidenceSignals = [],
} = {}) {
  const pathType = mapV14Classification(item?.finalClassification);
  const evidenceMapping = getEvidenceMapping(item, evidenceSignals);
  const credentialGate = getCredentialGateFromDiagnostic(item);
  const bridge = getBridgeFromDiagnostic(item);
  const condition = getConditionFromDiagnostic(item);
  const canonicalMapping = getCanonicalMappingForDiagnostic(item);

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
    displayLabel: item?.directionLabel ?? null,
    primaryFamilyId: item?.familyId ?? canonicalMapping.primaryFamilyId,
    supportingFamilyIds: canonicalMapping.supportingFamilyIds,
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
    },
  });
}
