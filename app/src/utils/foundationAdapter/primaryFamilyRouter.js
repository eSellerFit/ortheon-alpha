// src/utils/foundationAdapter/primaryFamilyRouter.js
// Metadata-driven primary family router — Role Library v2.
//
// All routing logic derives from ROLE_LIBRARY_V2_METADATA.
// No subfamily taxonomy lists, family priority maps, or calibrated score
// tables are hardcoded here. Adding or changing a metadata record is
// immediately visible to the router without touching this file.
//
// Exports:
//   routePrimaryFamily(assessment)  → RouterResult
//   getDirectionsByFamily(familyId) → Array<{ directionId, functionId, primarySubfamilyId }>
//   buildRoutingEvidenceText(assessment) → string   (exposed for debug/testing)
//   scoreDirectionMetadata(record, evidenceText, titleText) → ScoreResult (same)

import { ROLE_LIBRARY_V2_METADATA } from "../../data/roleLibraryV2Metadata.js";

// ── Generic scoring constants (only allowed hardcoding) ────────────────────────

const EVIDENCE_REQUIRED_WEIGHT = 2;      // score per evidenceRequired term hit
const NEGATIVE_EVIDENCE_PENALTY = 2;     // score reduction per negativeEvidence hit
const TITLE_ALIAS_WEIGHT = 1;            // bonus per titleAlias hit (requires evidence)
const CONFIDENCE_HIGH_THRESHOLD = 3;     // min score margin (winner − runner-up) for "high"
const CONFIDENCE_MODERATE_THRESHOLD = 1; // min margin for "moderate"

// ── Metadata indexes — built once at module load ───────────────────────────────

const BY_SUBFAMILY = new Map(); // primarySubfamilyId → [record, ...]
const BY_FAMILY    = new Map(); // familyId           → [record, ...]

for (const record of Object.values(ROLE_LIBRARY_V2_METADATA)) {
  if (!BY_SUBFAMILY.has(record.primarySubfamilyId)) {
    BY_SUBFAMILY.set(record.primarySubfamilyId, []);
  }
  BY_SUBFAMILY.get(record.primarySubfamilyId).push(record);

  if (!BY_FAMILY.has(record.familyId)) {
    BY_FAMILY.set(record.familyId, []);
  }
  BY_FAMILY.get(record.familyId).push(record);
}

// ── Assessment text extraction ─────────────────────────────────────────────────

export function buildRoutingEvidenceText(assessment) {
  const cv = assessment?.cvProfile || {};

  const domainText = Array.isArray(cv.domainSignals)
    ? cv.domainSignals.join(" ")
    : "";

  const competencyText = Array.isArray(cv.competencySignals)
    ? cv.competencySignals
        .map((s) => (typeof s === "string" ? s : s?.evidence || ""))
        .join(" ")
    : "";

  // Include raw parsed CV text when available for richer signal coverage.
  const parsedText = cv.parsedText || cv.cvText || "";

  return [
    assessment?.currentRole,
    assessment?.currentIndustry,
    cv.careerSummary,
    domainText,
    cv.senioritySignal,
    cv.leadershipScope,
    cv.tenurePattern,
    competencyText,
    parsedText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getTitleText(assessment) {
  return (assessment?.currentRole || "").toLowerCase();
}

// ── Direction-level scoring ────────────────────────────────────────────────────
//
// Rules:
// 1. evidenceRequired hits are the primary positive signal.
// 2. negativeEvidence hits reduce the score.
// 3. titleAliases contribute a weak bonus ONLY when evidenceRequired already fired.
//    A direction cannot route solely from a title match.

export function scoreDirectionMetadata(record, evidenceText, titleText) {
  const evidenceHits = [];
  const negativeEvidenceHits = [];
  const titleAliasHits = [];

  for (const term of record.evidenceRequired) {
    if (evidenceText.includes(term.toLowerCase())) {
      evidenceHits.push(term);
    }
  }

  for (const term of record.negativeEvidence) {
    if (evidenceText.includes(term.toLowerCase())) {
      negativeEvidenceHits.push(term);
    }
  }

  for (const alias of record.titleAliases) {
    if (titleText.includes(alias.toLowerCase())) {
      titleAliasHits.push(alias);
    }
  }

  // Title bonus only activates when there is at least one evidence hit.
  const titleBonus = evidenceHits.length > 0
    ? titleAliasHits.length * TITLE_ALIAS_WEIGHT
    : 0;

  const rawScore =
    evidenceHits.length * EVIDENCE_REQUIRED_WEIGHT
    - negativeEvidenceHits.length * NEGATIVE_EVIDENCE_PENALTY
    + titleBonus;

  const score = Math.max(0, rawScore);

  const confidence =
    score === 0
      ? "none"
      : evidenceHits.length === 0
      ? "title_only"
      : negativeEvidenceHits.length >= evidenceHits.length
      ? "conflicted"
      : score >= EVIDENCE_REQUIRED_WEIGHT * 3
      ? "high"
      : score >= EVIDENCE_REQUIRED_WEIGHT * 2
      ? "moderate"
      : "low";

  return { score, evidenceHits, negativeEvidenceHits, titleAliasHits, confidence };
}

// ── Primary family routing ─────────────────────────────────────────────────────

export function routePrimaryFamily(assessment) {
  const evidenceText = buildRoutingEvidenceText(assessment);
  const titleText    = getTitleText(assessment);

  // 1. Score every direction in the metadata.
  const directionScores = new Map(); // directionId → ScoreResult
  for (const record of Object.values(ROLE_LIBRARY_V2_METADATA)) {
    directionScores.set(
      record.directionId,
      scoreDirectionMetadata(record, evidenceText, titleText)
    );
  }

  // 2. Aggregate scores by (familyId × subfamilyId).
  //    Key is compound because multiple families can share the same subfamilyId
  //    label (e.g. DX-01, DX-02, DX-03 all use DIGITAL_TRANSFORMATION_AUTOMATION).
  //    Using a compound key keeps each family's score isolated so that
  //    high-scoring directions in one family cannot inflate a different family's rank.
  //    Primary sort key: maxScore (best single direction in the bucket).
  //    Using max instead of sum prevents inflating buckets with more directions.
  const subfamilyAgg = new Map(); // "familyId:subfamilyId" → SubfamilyAgg
  for (const record of Object.values(ROLE_LIBRARY_V2_METADATA)) {
    const result = directionScores.get(record.directionId);
    const key = `${record.familyId}:${record.primarySubfamilyId}`;

    if (!subfamilyAgg.has(key)) {
      subfamilyAgg.set(key, {
        subfamilyId: record.primarySubfamilyId,
        familyId:    record.familyId,
        functionId:  record.functionId,
        maxScore:    0,
        totalScore:  0,
        evidenceHits:         new Set(),
        negativeEvidenceHits: new Set(),
        titleAliasHits:       new Set(),
      });
    }

    const agg = subfamilyAgg.get(key);
    if (result.score > agg.maxScore) agg.maxScore = result.score;
    agg.totalScore += result.score;
    result.evidenceHits.forEach((h)         => agg.evidenceHits.add(h));
    result.negativeEvidenceHits.forEach((h) => agg.negativeEvidenceHits.add(h));
    result.titleAliasHits.forEach((h)       => agg.titleAliasHits.add(h));
  }

  // 3. Rank subfamilies.
  const rankedSubfamilies = [...subfamilyAgg.values()].sort(
    (a, b) => b.maxScore - a.maxScore || b.totalScore - a.totalScore
  );

  const primary   = rankedSubfamilies[0];
  const runnerUp  = rankedSubfamilies[1];
  const margin    = primary.maxScore - (runnerUp?.maxScore ?? 0);

  const routerConfidence =
    primary.maxScore === 0
      ? "none"
      : primary.evidenceHits.size === 0
      ? "title_only"
      : margin >= CONFIDENCE_HIGH_THRESHOLD
      ? "high"
      : margin >= CONFIDENCE_MODERATE_THRESHOLD
      ? "moderate"
      : "low";

  // 4. Build ranked family list.
  //    A family's rank = position of its best-scoring subfamily.
  //    First-occurrence wins so each family appears exactly once.
  const rankedFamilies = [];
  const seenFamilies   = new Set();
  for (const entry of rankedSubfamilies) {
    if (!seenFamilies.has(entry.familyId)) {
      rankedFamilies.push({ familyId: entry.familyId, functionId: entry.functionId });
      seenFamilies.add(entry.familyId);
    }
  }

  // 5. Primary direction IDs = directions in the winning family+subfamily,
  //    ordered by their individual direction score descending.
  //    Filter by familyId so cross-family directions that share the same
  //    subfamilyId label are excluded.
  const primaryDirectionIds = (BY_SUBFAMILY.get(primary.subfamilyId) || [])
    .filter((record) => record.familyId === primary.familyId)
    .map((record) => ({
      directionId: record.directionId,
      score: directionScores.get(record.directionId)?.score ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ directionId }) => directionId);

  return {
    primaryFamilyId:    primary.familyId,
    primarySubfamilyId: primary.subfamilyId,
    primaryFunctionId:  primary.functionId,
    routerConfidence,
    rankedFamilies,
    primaryDirectionIds,
    evidenceHits:         [...primary.evidenceHits],
    negativeEvidenceHits: [...primary.negativeEvidenceHits],
    titleAliasHits:       [...primary.titleAliasHits],
    usedMetadataDrivenRouter: true,
    // debug
    _primaryMaxScore:      primary.maxScore,
    _margin:               margin,
    _runnerUpSubfamilyId:  runnerUp?.subfamilyId  ?? null,
    _runnerUpScore:        runnerUp?.maxScore      ?? 0,
  };
}

// ── Helper: direction lookup by family ────────────────────────────────────────
// Returns minimal records so callers can filter by functionId/subfamilyId
// without importing ROLE_LIBRARY_V2_METADATA directly.

export function getDirectionsByFamily(familyId) {
  return (BY_FAMILY.get(familyId) || []).map((r) => ({
    directionId:        r.directionId,
    functionId:         r.functionId,
    primarySubfamilyId: r.primarySubfamilyId,
  }));
}
