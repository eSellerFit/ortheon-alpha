// app/src/utils/directionV14/directionCalibrationV14.js
// Direction Engine v1.4 — Direction Calibration
//
// Purpose:
// Convert lens results and hard gates into an honest recommendation classification.

const CLASSIFICATION_PRIORITY = {
  Primary: 1,
  'Adjacent / Nearby': 2,
  'Bridge-based': 3,
  Conditional: 4,
  'Longer-term': 5,
  Suppressed: 6
};

function hasFlag(gates = {}, flagName) {
  return (gates.hardGateFlags || []).some((item) => item.flag === flagName);
}

function getOverallLensScore(lensResults = {}) {
  const values = [
    lensResults.careerEvidenceResult?.score,
    lensResults.marketCredibilityResult?.score,
    lensResults.anchorFitResult?.score,
    lensResults.financialRealityResult?.score,
    lensResults.practicalConstraintsResult?.score,
    lensResults.credentialsGateResult?.score,
    lensResults.aiDurabilityResult?.score
  ].filter((value) => Number.isFinite(value));

  if (values.length === 0) return 0;

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getDecisionContext(evidenceModel = {}) {
  const financial = evidenceModel.financialContext || {};
  const constraints = evidenceModel.constraints || {};
  const anchors = evidenceModel.anchors || {};

  const runway = financial.savingsRunwayMonths;
  const monthlyFloor = financial.minimumMonthlyIncome;
  const security = anchors.security;
  const autonomy = anchors.autonomy;
  const salesComfort = String(constraints.salesComfort || '').toLowerCase();

  if (
    (Number.isFinite(monthlyFloor) && monthlyFloor >= 8000) ||
    (Number.isFinite(runway) && runway < 3)
  ) {
    return 'financial_protection_mode';
  }

  if (Number.isFinite(security) && security >= 8) {
    return 'stability_risk_reduction_mode';
  }

  if (
    Number.isFinite(autonomy) &&
    autonomy >= 8 &&
    !salesComfort.includes('low')
  ) {
    return 'portfolio_independent_path_mode';
  }

  return 'balanced_direction_mode';
}

export function calibrateDirectionV14({
  direction,
  lensResults,
  gates,
  evidenceModel
}) {
  const overallScore = getOverallLensScore(lensResults);
  const decisionContext = getDecisionContext(evidenceModel);

  const reasons = [];
  let finalClassification = 'Adjacent / Nearby';

  const transitionCategory = direction.transitionCategory || 'unknown';
  const transitionPathway = direction.transitionPathway || 'unknown';

  if (gates?.suppress) {
    finalClassification = 'Suppressed';
    reasons.push('Suppressed by hard gate.');
  } else if (
    hasFlag(gates, 'credential_unknown_or_missing') ||
    hasFlag(gates, 'credential_review_required')
  ) {
    finalClassification = 'Conditional';
    reasons.push('Credential or license status must be confirmed before direct recommendation.');
  } else if (hasFlag(gates, 'income_floor_not_met')) {
    finalClassification = 'Longer-term';
    reasons.push('Income floor is not met without a stronger bridge or runway.');
  } else if (
    hasFlag(gates, 'low_market_credibility') ||
    hasFlag(gates, 'domain_credibility_gap')
  ) {
    finalClassification = 'Bridge-based';
    reasons.push('Market credibility requires a bridge or stronger positioning.');
  } else if (
    transitionCategory === 'bridge_friendly' ||
    transitionPathway === 'bridge' ||
    transitionPathway === 'stretch'
  ) {
    finalClassification = 'Bridge-based';
    reasons.push('Direction is plausible but should be framed as bridge-based.');
  } else if (
    overallScore >= 72 &&
    lensResults.careerEvidenceResult?.score >= 65 &&
    lensResults.marketCredibilityResult?.score >= 65 &&
    lensResults.financialRealityResult?.score >= 60
  ) {
    finalClassification = 'Primary';
    reasons.push('Strong enough across evidence, credibility, and financial reality.');
  } else if (overallScore >= 55) {
    finalClassification = 'Adjacent / Nearby';
    reasons.push('Related and plausible, but not strong enough to lead.');
  } else {
    finalClassification = 'Longer-term';
    reasons.push('Possible only as a longer-term path or after additional validation.');
  }

  if (decisionContext === 'financial_protection_mode' && finalClassification === 'Primary') {
    if (lensResults.financialRealityResult?.score < 75) {
      finalClassification = 'Bridge-based';
      reasons.push('Financial protection mode downgrades this from Primary due to income risk.');
    }
  }

  if (decisionContext === 'stability_risk_reduction_mode') {
    const context = String(direction.context || '').toLowerCase();
    if (
      finalClassification === 'Primary' &&
      (context.includes('independent') ||
        context.includes('fractional') ||
        context.includes('startup') ||
        context.includes('own venture'))
    ) {
      finalClassification = 'Bridge-based';
      reasons.push('Stability/risk reduction mode downgrades independent or startup paths.');
    }
  }

  return {
    finalClassification,
    classificationPriority: CLASSIFICATION_PRIORITY[finalClassification] || 99,
    overallLensScore: overallScore,
    decisionContext,
    reasons,
    downgradeReasons: gates?.downgradeReasons || [],
    hardGateFlags: gates?.hardGateFlags || []
  };
}

export const directionCalibrationV14 = {
  calibrateDirectionV14
};
