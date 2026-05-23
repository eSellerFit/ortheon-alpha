// src/utils/foundationAdapter/directionValidityGate.js
// Generic metadata-driven guard against overclaiming specific directions.

import { ROLE_LIBRARY_V2_METADATA } from "../../data/roleLibraryV2Metadata.js";
import {
  buildRoutingEvidenceText,
  scoreDirectionMetadata,
} from "./primaryFamilyRouter.js";

const DEFAULT_CLAIM_LEVEL = "standard";
const DEFAULT_EVIDENCE_STRICTNESS = "normal";

const CLAIM_CAPS = {
  standard: 92,
  specialist: 88,
  executive: 86,
  emerging_executive: 84,
};

const PARTIAL_CAPS = {
  normal: 92,
  strict: 88,
  very_strict: 84,
};

const LEADERSHIP_SCOPE_TERMS = [
  "chief",
  "c-suite",
  "executive",
  "vp",
  "vice president",
  "director",
  "head of",
  "founder",
  "co-founder",
  "owned",
  "ownership",
  "led",
  "leadership",
  "strategy",
  "roadmap",
  "board",
  "enterprise",
  "function",
  "transformation",
];

function includesTerm(text, term) {
  return text.includes(String(term || "").toLowerCase());
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function getAssessmentComplexityBand(assessment, evidenceText) {
  const cv = assessment?.cvProfile || {};
  const titleAndSeniority = [
    assessment?.currentRole,
    cv.senioritySignal,
    cv.leadershipScope,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const explicitLeadership = LEADERSHIP_SCOPE_TERMS.some((term) =>
    includesTerm(titleAndSeniority, term)
  );

  if (explicitLeadership) return 3;
  if (
    evidenceText.includes("manager") ||
    evidenceText.includes("program") ||
    evidenceText.includes("project") ||
    evidenceText.includes("senior")
  ) {
    return 2;
  }

  return 1;
}

function getRequiredMustHaveCount(record) {
  const strictness = record.evidenceStrictness || DEFAULT_EVIDENCE_STRICTNESS;
  const claimLevel = record.claimLevel || DEFAULT_CLAIM_LEVEL;

  if (!Array.isArray(record.mustHaveEvidence) || record.mustHaveEvidence.length === 0) {
    return 0;
  }
  if (strictness === "very_strict" || claimLevel === "emerging_executive") return 1;
  if (strictness === "strict" || claimLevel === "executive") return 1;
  return 1;
}

function getEvidenceHitThreshold(record) {
  const strictness = record.evidenceStrictness || DEFAULT_EVIDENCE_STRICTNESS;
  const claimLevel = record.claimLevel || DEFAULT_CLAIM_LEVEL;

  if (strictness === "very_strict" || claimLevel === "emerging_executive") return 2;
  if (strictness === "strict" || claimLevel === "specialist" || claimLevel === "executive") {
    return 2;
  }
  return 1;
}

export function evaluateDirectionValidity(candidate, assessment, routerResult) {
  const record = ROLE_LIBRARY_V2_METADATA[candidate.legacyDirectionId];
  const scoreBeforeValidityGate = Number(candidate.overallLensScore) || 0;

  if (!record) {
    return {
      validityStatus: "metadata_missing",
      claimLevel: DEFAULT_CLAIM_LEVEL,
      evidenceStrictness: DEFAULT_EVIDENCE_STRICTNESS,
      mustHaveEvidenceHits: [],
      evidenceRequiredHits: [],
      negativeEvidenceHits: [],
      scoreBeforeValidityGate,
      scoreAfterValidityGate: Math.min(scoreBeforeValidityGate, CLAIM_CAPS.specialist),
      capApplied: scoreBeforeValidityGate > CLAIM_CAPS.specialist,
      suppressionReason: "No Role Library v2 metadata found for this direction.",
    };
  }

  const evidenceText = buildRoutingEvidenceText(assessment);
  const titleText = (assessment?.currentRole || "").toLowerCase();
  const metadataScore = scoreDirectionMetadata(record, evidenceText, titleText);
  const claimLevel = record.claimLevel || DEFAULT_CLAIM_LEVEL;
  const evidenceStrictness = record.evidenceStrictness || DEFAULT_EVIDENCE_STRICTNESS;
  const mustHaveEvidence = Array.isArray(record.mustHaveEvidence)
    ? record.mustHaveEvidence
    : [];
  const mustHaveEvidenceHits = uniqueValues(
    mustHaveEvidence.filter((term) => includesTerm(evidenceText, term))
  );
  const evidenceRequiredHits = uniqueValues(metadataScore.evidenceHits);
  const negativeEvidenceHits = uniqueValues(metadataScore.negativeEvidenceHits);
  const requiredMustHaveCount = getRequiredMustHaveCount(record);
  const evidenceHitThreshold = getEvidenceHitThreshold(record);
  const assessmentComplexityBand = getAssessmentComplexityBand(assessment, evidenceText);
  const requiredComplexityBand = Math.min(...record.complexityBands);
  const primaryDirectionIds = new Set(routerResult?.primaryDirectionIds || []);
  const isPrimaryFamily = candidate.familyId === routerResult?.primaryFamilyId;
  const isPrimaryDirection = primaryDirectionIds.has(candidate.legacyDirectionId);

  const debugBase = {
    validityStatus: "valid",
    claimLevel,
    evidenceStrictness,
    mustHaveEvidenceHits,
    evidenceRequiredHits,
    negativeEvidenceHits,
    scoreBeforeValidityGate,
    scoreAfterValidityGate: scoreBeforeValidityGate,
    capApplied: false,
    suppressionReason: null,
    assessmentComplexityBand,
    requiredComplexityBand,
    primaryFamilyMatched: isPrimaryFamily,
    primaryDirectionMatched: isPrimaryDirection,
  };

  if (negativeEvidenceHits.length >= evidenceRequiredHits.length && evidenceRequiredHits.length > 0) {
    return {
      ...debugBase,
      validityStatus: "capped_conflicting_evidence",
      scoreAfterValidityGate: Math.min(scoreBeforeValidityGate, CLAIM_CAPS[claimLevel]),
      capApplied: scoreBeforeValidityGate > CLAIM_CAPS[claimLevel],
      suppressionReason: "Required evidence is materially conflicted by negative evidence.",
    };
  }

  if (assessmentComplexityBand < requiredComplexityBand) {
    return {
      ...debugBase,
      validityStatus: "capped_complexity_mismatch",
      scoreAfterValidityGate: Math.min(scoreBeforeValidityGate, PARTIAL_CAPS[evidenceStrictness]),
      capApplied: scoreBeforeValidityGate > PARTIAL_CAPS[evidenceStrictness],
      suppressionReason:
        `Direction requires complexity band ${requiredComplexityBand}; assessment supports band ${assessmentComplexityBand}.`,
    };
  }

  if (mustHaveEvidenceHits.length < requiredMustHaveCount) {
    return {
      ...debugBase,
      validityStatus: "demoted_missing_must_have_evidence",
      scoreAfterValidityGate: Math.min(scoreBeforeValidityGate, CLAIM_CAPS[claimLevel]),
      capApplied: scoreBeforeValidityGate > CLAIM_CAPS[claimLevel],
      suppressionReason:
        `Missing required explicit evidence for ${claimLevel} claim: ` +
        `${mustHaveEvidence.join(", ") || "none configured"}.`,
    };
  }

  if (evidenceRequiredHits.length < evidenceHitThreshold && !isPrimaryDirection) {
    return {
      ...debugBase,
      validityStatus: "capped_partial_evidence",
      scoreAfterValidityGate: Math.min(scoreBeforeValidityGate, PARTIAL_CAPS[evidenceStrictness]),
      capApplied: scoreBeforeValidityGate > PARTIAL_CAPS[evidenceStrictness],
      suppressionReason:
        `Only ${evidenceRequiredHits.length} required evidence hit(s); ${evidenceHitThreshold} needed for this claim level.`,
    };
  }

  if (!isPrimaryFamily && claimLevel !== "standard") {
    return {
      ...debugBase,
      validityStatus: "capped_non_primary_family_claim",
      scoreAfterValidityGate: Math.min(scoreBeforeValidityGate, PARTIAL_CAPS[evidenceStrictness]),
      capApplied: scoreBeforeValidityGate > PARTIAL_CAPS[evidenceStrictness],
      suppressionReason: "High-claim direction is outside the router-selected primary family.",
    };
  }

  return debugBase;
}

export function applyDirectionValidityGate(candidate, assessment, routerResult) {
  const debug = evaluateDirectionValidity(candidate, assessment, routerResult);
  const scoreAfterValidityGate = debug.scoreAfterValidityGate;

  return {
    ...candidate,
    overallLensScore: scoreAfterValidityGate,
    validityStatus: debug.validityStatus,
    claimLevel: debug.claimLevel,
    evidenceStrictness: debug.evidenceStrictness,
    mustHaveEvidenceHits: debug.mustHaveEvidenceHits,
    scoreBeforeValidityGate: debug.scoreBeforeValidityGate,
    scoreAfterValidityGate: debug.scoreAfterValidityGate,
    capApplied: debug.capApplied,
    suppressionReason: debug.suppressionReason,
    _directionValidityGate: debug,
    _gateReasons: [
      ...(candidate._gateReasons || []),
      `Direction validity: ${debug.validityStatus}.`,
      ...(debug.suppressionReason ? [debug.suppressionReason] : []),
    ],
  };
}

export function applyDirectionValidityGateToCandidates(
  candidates,
  assessment,
  routerResult
) {
  return candidates.map((candidate) =>
    applyDirectionValidityGate(candidate, assessment, routerResult)
  );
}
