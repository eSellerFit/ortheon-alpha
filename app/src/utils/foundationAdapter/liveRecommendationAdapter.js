// src/utils/foundationAdapter/liveRecommendationAdapter.js
// Adapter layer for Phase 2E: foundation-selected recommendations → live report shape.
//
// When FOUNDATION_LIVE_SELECTION_ENABLED is false (default), all calls fall through
// to scoring.js unchanged. No foundation engine code is imported or executed.
//
// When the flag is enabled:
// - generateDirectionDiagnosticsV14 is loaded via dynamic import (not bundled
//   into the normal live path).
// - Only foundationSelectedRecommendations.selectedRecommendations is used
//   (clean display-safe lane). Bridge, needs-confirmation, and hidden bridge
//   candidates are never exposed.
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

// ── Fit band derivation ────────────────────────────────────────────────────

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

// ── Financial flag mapping ─────────────────────────────────────────────────

function mapFinancialFlag(financialRealityLevel) {
  if (financialRealityLevel === "not_viable_now") return "financially_risky";
  if (financialRealityLevel === "financially_constrained") return "financially_constrained";
  return null;
}

// ── TransitionLabel reconstruction ────────────────────────────────────────

function buildTransitionLabelFromFoundation(candidate, sourceDiagnostic, hasBridges) {
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

// ── Bridge/longer-path resolution from role library ───────────────────────

function resolveBridgeIds(directionIds) {
  if (!Array.isArray(directionIds)) return [];

  return directionIds
    .map((id) => {
      const found = roleLibrary.find((r) => r.directionId === id);
      return found ? { directionId: id, directionLabel: found.directionLabel } : null;
    })
    .filter(Boolean);
}

// ── Core adapter: one foundation candidate → live recommendation shape ────

function adaptCandidateToLiveShape(candidate, assessment) {
  const directionId = candidate.legacyDirectionId;
  if (!directionId) return null;

  const fullDirection = roleLibrary.find((r) => r.directionId === directionId);
  if (!fullDirection) return null;

  const salaryEntry = salaryBenchmarks.find((s) => s.directionId === directionId) || null;
  const financialPathway = salaryEntry?.financialPathway || null;

  const sourceDiagnostic = candidate.sourceDiagnostic || {};

  // overallLensScore is on the candidate directly (from displaySafeSelector buildSelectedCandidate)
  // and also mirrored inside sourceDiagnostic. Prefer the top-level value.
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
  const ratio = annualFloor > 0 ? Number((avg12month / annualFloor).toFixed(2)) : 1;

  const cvConfidence =
    assessment?.cvProfile?.cvSource === "claude_parsed" ? "full" : "low";

  return {
    rank: candidate.rank,
    directionId,
    directionLabel: candidate.displayLabel || fullDirection.directionLabel,
    category: fullDirection.category || null,
    metaDirection: fullDirection.metaDirection || null,
    context: sourceDiagnostic.context || fullDirection.context || null,
    contextCode: fullDirection.contextCode || null,
    onetCodes: fullDirection.onetCodes || [],
    onetTitles: fullDirection.onetTitles || [],
    aiDurabilityRating: fullDirection.aiDurabilityRating || null,
    aiExposureSource: fullDirection.aiExposureSource || null,

    transitionCategory:
      sourceDiagnostic.transitionCategory || fullDirection.transitionCategory || null,
    transitionPathway:
      sourceDiagnostic.transitionPathway || fullDirection.transitionPathway || null,
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
      engineVersion: "liveAdapter-2E",
      legacyDirectionId: directionId,
      familyId: candidate.familyId || null,
      recommendedDisplayClassification:
        candidate.recommendedDisplayClassification || null,
      overallLensScore: lensScore,
      candidateScore:
        candidate.candidateScore ?? sourceDiagnostic.candidateScore ?? null,
    },
  };
}

// ── Foundation live path (only runs when flag is true) ─────────────────────

async function runFoundationPath(assessment) {
  // Dynamic import keeps the v1.4 diagnostics engine out of the normal
  // live bundle when the flag is false.
  const { generateDirectionDiagnosticsV14 } = await import(
    "../directionV14/directionEngineV14.js"
  );

  const diagnostics = generateDirectionDiagnosticsV14(assessment, {
    maxCandidates: 20,
    maxRecommendations: 7,
  });

  const selectedRecommendations =
    diagnostics?.matchingEngineV1Foundation
      ?.foundationSelectedRecommendations?.selectedRecommendations;

  if (
    !Array.isArray(selectedRecommendations) ||
    selectedRecommendations.length < FOUNDATION_MIN_LIVE_COUNT
  ) {
    console.warn(
      "[liveAdapter] Foundation returned too few candidates — falling back to scoring.js.",
      { count: selectedRecommendations?.length ?? 0 }
    );
    return null;
  }

  const adapted = selectedRecommendations
    .map((candidate) => adaptCandidateToLiveShape(candidate, assessment))
    .filter(Boolean);

  if (adapted.length < FOUNDATION_MIN_LIVE_COUNT) {
    console.warn(
      "[liveAdapter] Adaptation produced too few results — falling back to scoring.js.",
      { adaptedCount: adapted.length }
    );
    return null;
  }

  return adapted;
}

// ── Public API ─────────────────────────────────────────────────────────────

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
  return generateCareerMap(assessment, recommendations);
}
