// src/utils/foundationAdapter/liveRecommendationAdapter.js
// Adapter layer for Phase 2E/2G: foundation-selected recommendations → live report shape.
//
// When FOUNDATION_LIVE_SELECTION_ENABLED is false (default), all calls fall through
// to scoring.js unchanged. No foundation engine code is imported or executed.
//
// When the flag is enabled:
// - generateDirectionDiagnosticsV14 is loaded via dynamic import.
// - A strict live quality gate (Phase 2G) filters candidates before adaptation.
// - False-positive family blocks prevent tech/commercial/marketing directions from
//   appearing when there is no explicit supporting evidence.
// - Workforce/people profiles get priority calibration toward WI-01, PO-03, PO-01/02/04/05.
// - showableBridgeRecommendations are used for conservative fallback widening.
// - On any failure or too-few results, falls back to scoring.js automatically.

import {
  generateCareerMap,
  generateRecommendations,
} from "../scoring.js";
import { roleLibrary } from "../../data/roleLibrary.js";
import { salaryBenchmarks } from "../../data/salaryBenchmarks.js";
import {
  FOUNDATION_LIVE_SELECTION_ENABLED,
  FOUNDATION_MIN_LIVE_COUNT,
} from "./featureFlags.js";
import { applyLiveQualityGate, buildLiveProfile } from "./liveQualityGate.js";
import { sanitizeFoundationCareerMap } from "./foundationCareerMapAdapter.js";

// ── Fit band derivation ────────────────────────────────────────────────────────

function deriveFitBandFromLensScore(score, financialFlag) {
  const total = Number(score) || 0;

  if (financialFlag === "financially_risky" && total >= 65) {
    return "Strong Alignment — Financially Constrained";
  }

  if (total >= 80) return "Strong Fit";
  if (total >= 65) return "Conditional Fit";
  if (total >= 50) return "Stretch Path";
  return "Bridge Required";
}

// ── Financial flag mapping ─────────────────────────────────────────────────────

function mapFinancialFlag(financialRealityLevel) {
  if (financialRealityLevel === "not_viable_now") return "financially_risky";
  if (financialRealityLevel === "financially_constrained")
    return "financially_constrained";
  return null;
}

// ── TransitionLabel reconstruction ────────────────────────────────────────────

function buildTransitionLabelFromFoundation(
  candidate,
  sourceDiagnostic,
  hasBridges
) {
  const classification = candidate.recommendedDisplayClassification;
  const transitionCategory = sourceDiagnostic.transitionCategory;
  const transitionPathway = sourceDiagnostic.transitionPathway;
  const isHighFinancialRisk =
    sourceDiagnostic.financialRealityLevel === "not_viable_now";

  if (transitionCategory === "credentialed") {
    return {
      label: "Requires credential",
      sublabel: "Regulated license or certification needed",
      treatment: "flagged",
      showBridges: hasBridges,
    };
  }

  if (classification === "Primary") {
    return {
      label: isHighFinancialRisk
        ? "Credible now — high financial risk"
        : "Credible now",
      sublabel: "Direct transition with existing background",
      treatment: "main",
      showBridges: false,
    };
  }

  if (classification === "Adjacent / Nearby") {
    if (transitionPathway === "bridge") {
      return {
        label: isHighFinancialRisk
          ? "Bridge path — high financial risk"
          : "Bridge path",
        sublabel: hasBridges
          ? "Credible via intermediate step"
          : "Repositioning of existing experience needed",
        treatment: "main",
        showBridges: hasBridges,
      };
    }

    if (transitionPathway === "stretch") {
      return {
        label: isHighFinancialRisk
          ? "Stretch path — high financial risk"
          : "Stretch path",
        sublabel: "Repositioning of existing experience needed",
        treatment: "main",
        showBridges: false,
      };
    }

    return {
      label: isHighFinancialRisk
        ? "Credible now — high financial risk"
        : "Credible now",
      sublabel: "Direct transition with existing background",
      treatment: "main",
      showBridges: false,
    };
  }

  return {
    label: isHighFinancialRisk
      ? "Credible now — high financial risk"
      : "Credible now",
    sublabel: "Direct transition with existing background",
    treatment: "main",
    showBridges: false,
  };
}

// ── Bridge/longer-path resolution from role library ───────────────────────────

function resolveBridgeIds(directionIds) {
  if (!Array.isArray(directionIds)) return [];

  return directionIds
    .map((id) => {
      const found = roleLibrary.find((r) => r.directionId === id);
      return found
        ? { directionId: id, directionLabel: found.directionLabel }
        : null;
    })
    .filter(Boolean);
}

// ── Core adapter: one foundation candidate → live recommendation shape ─────────

function adaptCandidateToLiveShape(candidate, assessment, liveProfile) {
  const directionId = candidate.legacyDirectionId;
  if (!directionId) return null;

  const fullDirection = roleLibrary.find((r) => r.directionId === directionId);
  if (!fullDirection) return null;

  const salaryEntry =
    salaryBenchmarks.find((s) => s.directionId === directionId) || null;
  const financialPathway = salaryEntry?.financialPathway || null;

  const sourceDiagnostic = candidate.sourceDiagnostic || {};

  const lensScore =
    candidate.overallLensScore ?? sourceDiagnostic.overallLensScore ?? 0;

  const financialFlag = mapFinancialFlag(sourceDiagnostic.financialRealityLevel);
  const fitBand = deriveFitBandFromLensScore(lensScore, financialFlag);

  const hasBridges =
    Array.isArray(fullDirection.bridgeDirections) &&
    fullDirection.bridgeDirections.length > 0;
  const transitionLabel = buildTransitionLabelFromFoundation(
    candidate,
    sourceDiagnostic,
    hasBridges
  );

  const annualFloor =
    (Number(assessment?.financialReality?.minimumMonthlyIncome) || 0) * 12;
  const avg12month = Number(financialPathway?.avg12month) || 0;
  const ratio =
    annualFloor > 0 ? Number((avg12month / annualFloor).toFixed(2)) : 1;

  const cvConfidence =
    assessment?.cvProfile?.cvSource === "claude_parsed" ? "full" : "low";

  return {
    rank: candidate.rank,
    directionId,
    directionLabel:
      candidate.displayLabel || fullDirection.directionLabel,
    category: fullDirection.category || null,
    metaDirection: fullDirection.metaDirection || null,
    context:
      sourceDiagnostic.context || fullDirection.context || null,
    contextCode: fullDirection.contextCode || null,
    onetCodes: fullDirection.onetCodes || [],
    onetTitles: fullDirection.onetTitles || [],
    aiDurabilityRating: fullDirection.aiDurabilityRating || null,
    aiExposureSource: fullDirection.aiExposureSource || null,

    transitionCategory:
      sourceDiagnostic.transitionCategory ||
      fullDirection.transitionCategory ||
      null,
    transitionPathway:
      sourceDiagnostic.transitionPathway ||
      fullDirection.transitionPathway ||
      null,
    transitionLabel,
    transitionFlags: [],
    stretchabilityRequired: fullDirection.stretchabilityRequired || null,
    domainSpecificityRequired: fullDirection.domainSpecificityRequired || null,
    financialRiskLevel: fullDirection.financialRiskLevel || null,

    financialPathway,
    financialComparison: { annualFloor, avg12month, ratio },
    financialFlag,
    financialExplanation: null,

    salarySource: salaryEntry?.sources?.[0]?.name || "unknown",
    salarySources: salaryEntry?.sources || [],
    salaryLastUpdated: salaryEntry?.lastUpdated || null,
    salaryValidUntil: salaryEntry?.validUntil || null,
    salaryDataQuality: salaryEntry?.dataQuality || "unknown",
    salaryBenchmarkVersion: salaryEntry?.version || null,

    scores: {
      competency: null,
      anchor: null,
      financial: null,
      durability: null,
      baseTotal: null,
      total: lensScore,
    },
    scoreBreakdown: null,
    fitBand,

    bridgeDirections: resolveBridgeIds(fullDirection.bridgeDirections),
    longerPathOptions: resolveBridgeIds(fullDirection.longerPathOptions),
    d4EvolutionPath: fullDirection.d4EvolutionPath || null,

    eligibility: null,
    eligibilityWarning: null,

    anchorWarnings: [],
    anchorMatches: [],
    anchorConflicts: [],
    domainCalibration: null,

    matchedRequiredCompetencies: [],
    missingRequiredCompetencies: [],
    matchedPreferredCompetencies: [],
    missingPreferredCompetencies: [],

    cvConfidence,
    roleLibraryVersion: fullDirection.version || null,

    _foundationSource: {
      engineVersion: "liveAdapter-2G",
      legacyDirectionId: directionId,
      familyId: candidate.familyId || null,
      familyName: candidate.familyName || null,
      familySpineId: candidate.familySpineId || null,
      recommendedDisplayClassification:
        candidate.recommendedDisplayClassification || null,
      overallLensScore: lensScore,
      candidateScore:
        candidate.candidateScore ??
        sourceDiagnostic.candidateScore ??
        null,
    },
    _foundationLiveGate: {
      status: candidate._gateStatus || "unknown",
      reasons: candidate._gateReasons || [],
      originalRank: candidate.rank || null,
      familyId: candidate.familyId || null,
      familyName: candidate.familyName || null,
      familySpineId: candidate.familySpineId || null,
      alignmentMatchType: candidate.alignmentMatchType || null,
      displaySafeStatus: candidate.displaySafeStatus || null,
      canonicalMappingConfidence:
        candidate.canonicalMappingConfidence || null,
      widenedFromBridge: candidate._widenedFromBridge || false,
      workforceScoreCalibrated: candidate._workforceScoreCalibrated || false,
      originalScore: candidate._originalScoreBeforeCalibration ?? null,
      calibratedScore: candidate._workforceScoreCalibrated
        ? (Number(candidate.overallLensScore) || null)
        : null,
      calibrationReason: candidate._calibrationReason || null,
    },
  };
}

// ── Foundation live path (only runs when flag is true) ─────────────────────────

async function runFoundationPath(assessment) {
  const { generateDirectionDiagnosticsV14 } = await import(
    "../directionV14/directionEngineV14.js"
  );

  const diagnostics = generateDirectionDiagnosticsV14(assessment, {
    maxCandidates: 20,
    maxRecommendations: 7,
  });

  const foundationResult =
    diagnostics?.matchingEngineV1Foundation
      ?.foundationSelectedRecommendations;

  const selectedRecommendations = foundationResult?.selectedRecommendations;
  const showableBridges =
    foundationResult?.showableBridgeRecommendations || [];

  if (
    !Array.isArray(selectedRecommendations) ||
    selectedRecommendations.length === 0
  ) {
    console.warn(
      "[liveAdapter] Foundation returned no candidates — falling back to scoring.js."
    );
    return null;
  }

  const { passed, rejected, profile, debugMeta } = applyLiveQualityGate(
    selectedRecommendations,
    showableBridges,
    assessment,
    FOUNDATION_MIN_LIVE_COUNT
  );

  console.log("[liveAdapter] Quality gate result:", {
    passed: passed.length,
    rejected: rejected.length,
    workforcePeopleProfile: profile.workforcePeopleProfile,
    workforceStrength: profile.workforce.strength,
    techExec: profile.techExec.isTechExec,
    fallbackType: debugMeta?.fallbackType,
    blockedTe: debugMeta?.blockedTeCandidates?.length,
  });

  if (passed.length < FOUNDATION_MIN_LIVE_COUNT) {
    // For confirmed workforce-primary profiles, do NOT fall back to scoring.js —
    // it uses "technology" domain signal to produce TE-* results.
    // Accept whatever workforce candidates the gate produced.
    if (profile.workforcePeopleProfile && passed.length > 0) {
      console.warn(
        "[liveAdapter] Workforce profile: using available gate-passed candidates instead of scoring.js fallback.",
        debugMeta
      );
      // continue with what we have
    } else {
      console.warn(
        "[liveAdapter] Quality gate returned too few candidates — falling back to scoring.js.",
        { passedCount: passed.length, rejectedCount: rejected.length }
      );
      return null;
    }
  }

  const adapted = passed
    .map((candidate) =>
      adaptCandidateToLiveShape(candidate, assessment, profile)
    )
    .filter(Boolean);

  if (adapted.length < FOUNDATION_MIN_LIVE_COUNT) {
    if (profile.workforcePeopleProfile && adapted.length > 0) {
      console.warn(
        "[liveAdapter] Workforce profile: adaptation produced few results but not falling back.",
        { adaptedCount: adapted.length }
      );
      // continue — don't fall back to scoring.js
    } else {
      console.warn(
        "[liveAdapter] Adaptation produced too few results — falling back to scoring.js.",
        { adaptedCount: adapted.length }
      );
      return null;
    }
  }

  // Attach gate debug metadata to the first result for observability
  if (adapted.length > 0 && debugMeta) {
    adapted[0] = {
      ...adapted[0],
      _liveGateDebug: debugMeta,
    };
  }

  return adapted;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function generateLiveRecommendations(assessment) {
  if (!FOUNDATION_LIVE_SELECTION_ENABLED) {
    return generateRecommendations(assessment);
  }

  try {
    const result = await runFoundationPath(assessment);
    if (result !== null) return result;
  } catch (error) {
    console.error(
      "[liveAdapter] Foundation path threw — falling back to scoring.js:",
      error
    );
  }

  return generateRecommendations(assessment);
}

export function generateLiveCareerMap(assessment, recommendations) {
  const baseMap = generateCareerMap(assessment, recommendations);
  const liveProfile = buildLiveProfile(assessment);

  const hasFoundationSource =
    Array.isArray(recommendations) &&
    recommendations.length > 0 &&
    recommendations[0]?._foundationSource;

  // Always sanitize for confirmed workforce-primary profiles regardless of
  // whether recommendations came from the foundation path or scoring.js fallback.
  if (hasFoundationSource || liveProfile.workforcePeopleProfile) {
    return sanitizeFoundationCareerMap(baseMap, liveProfile);
  }

  return baseMap;
}
