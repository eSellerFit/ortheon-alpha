// app/src/utils/directionV14/directionLensesV14.js
// Direction Engine v1.4 — Eight-Lens Evaluation
//
// Purpose:
// Evaluate each candidate direction through Ortheon's eight mandatory lenses.
// This file does not replace the current scoring engine and does not render UI.

const UNKNOWN = 'unknown';

const DURABILITY_SCORE_MAP = {
  D4: 100,
  D3: 80,
  D2: 60,
  D1: 30,
  D0: 0
};

function normalize(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.toLowerCase();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).toLowerCase();
  if (Array.isArray(value)) return value.map(normalize).join(' ');
  if (typeof value === 'object') return Object.values(value).map(normalize).join(' ');
  return '';
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function hasAny(text, terms = []) {
  return terms.some((term) => text.includes(String(term).toLowerCase()));
}

function getAnnualIncomeFloor(evidenceModel = {}) {
  const direct = numberOrNull(evidenceModel.financialContext?.annualIncomeFloor);
  if (direct !== null) return direct;

  const monthly = numberOrNull(evidenceModel.financialContext?.minimumMonthlyIncome);
  if (monthly !== null) return monthly * 12;

  return null;
}

function getAvg12MonthIncome(salaryBenchmark = {}) {
  return numberOrNull(salaryBenchmark.financialPathway?.avg12month);
}

function getEvidenceText(evidenceModel = {}) {
  return normalize([
    evidenceModel.careerEvidence?.evidenceText,
    evidenceModel.careerEvidence?.careerSummary,
    evidenceModel.careerEvidence?.domainSignals,
    evidenceModel.careerEvidence?.roleTitles,
    evidenceModel.careerEvidence?.industries,
    evidenceModel.careerEvidence?.senioritySignal,
    evidenceModel.careerEvidence?.leadershipScope,
    evidenceModel.competencySignals,
    evidenceModel.credentials?.rawText
  ]);
}

function getDirectionText(direction = {}) {
  return normalize([
    direction.directionLabel,
    direction.metaDirection,
    direction.category,
    direction.context,
    direction.relevantDomains,
    direction.onetTitles,
    direction.d4EvolutionPath
  ]);
}

function getCareerEvidenceResult(candidate = {}, direction = {}, evidenceModel = {}) {
  const candidateScore = numberOrNull(candidate.candidateScore) ?? 0;
  const domainRequirement = direction.domainSpecificityRequired || 'low';
  const evidenceText = getEvidenceText(evidenceModel);
  const relevantDomains = direction.relevantDomains || [];
  const hasRelevantDomain =
    relevantDomains.length === 0 || hasAny(evidenceText, relevantDomains);

  let level = 'no_evidence';
  let score = 0;
  const reasons = [];

  if (candidateScore >= 100) {
    level = 'strong';
    score = 90;
  } else if (candidateScore >= 60) {
    level = 'moderate';
    score = 70;
  } else if (candidateScore > 0) {
    level = 'weak';
    score = 35;
  }

  if (candidate.candidateReasons?.length) {
    reasons.push(...candidate.candidateReasons);
  }

  if (domainRequirement === 'high' && !hasRelevantDomain) {
    score = Math.round(score * 0.45);
    level = score >= 50 ? 'moderate_with_domain_gap' : 'weak_with_domain_gap';
    reasons.push('Domain-heavy direction lacks clear matching domain evidence.');
  }

  if (domainRequirement === 'medium' && !hasRelevantDomain && relevantDomains.length > 0) {
    score = Math.round(score * 0.7);
    reasons.push('Direction has some domain specificity; domain evidence is limited.');
  }

  return {
    lens: 'career_evidence',
    question: 'What does the career history already show the market?',
    level,
    score,
    hasRelevantDomain,
    domainSpecificityRequired: domainRequirement,
    relevantDomains,
    reasons
  };
}

function getMarketCredibilityResult(direction = {}, careerEvidenceResult = {}) {
  const transitionCategory = direction.transitionCategory || UNKNOWN;
  const evidenceScore = careerEvidenceResult.score || 0;
  const reasons = [];

  let level = 'low_credibility';
  let score = 25;

  if (transitionCategory === 'open_transition' && evidenceScore >= 65) {
    level = 'credible_now';
    score = 85;
    reasons.push('Direction is structurally accessible and supported by evidence.');
  } else if (transitionCategory === 'bridge_friendly' && evidenceScore >= 50) {
    level = 'credible_with_bridge';
    score = 70;
    reasons.push('Direction is plausible but likely needs positioning or an intermediate step.');
  } else if (transitionCategory === 'domain_heavy' && careerEvidenceResult.hasRelevantDomain && evidenceScore >= 55) {
    level = 'credible_with_domain_evidence';
    score = 75;
    reasons.push('Domain-specific direction has relevant domain evidence.');
  } else if (transitionCategory === 'credentialed') {
    level = 'credential_dependent';
    score = 55;
    reasons.push('Market credibility depends on credential/license status.');
  } else if (evidenceScore >= 50) {
    level = 'credible_with_positioning';
    score = 60;
    reasons.push('Some evidence exists, but market story needs positioning.');
  } else {
    reasons.push('Evidence is too weak for strong market credibility.');
  }

  if (careerEvidenceResult.level?.includes('domain_gap')) {
    level = 'credibility_gap';
    score = Math.min(score, 45);
    reasons.push('Domain credibility gap limits market believability.');
  }

  return {
    lens: 'market_credibility',
    question: 'Would hiring managers, clients, or partners believe this direction?',
    level,
    score,
    transitionCategory,
    reasons
  };
}

function getAnchorFitResult(direction = {}, evidenceModel = {}) {
  const anchors = evidenceModel.anchors || {};
  const dominantAnchors = direction.dominantAnchors || [];
  const significantAnchors = direction.significantAnchors || [];

  const warnings = [];
  const missing = [];
  let totalWeightedDistance = 0;
  let totalWeight = 0;

  function evaluate(anchorConfig, weight) {
    const userValue = numberOrNull(anchors[anchorConfig.anchorId]);

    if (userValue === null) {
      missing.push(anchorConfig.anchorId);
      return;
    }

    const midpoint = (anchorConfig.idealMin + anchorConfig.idealMax) / 2;
    const distance = Math.abs(userValue - midpoint);

    totalWeightedDistance += distance * weight;
    totalWeight += weight;

    if (distance > 3) {
      warnings.push(anchorConfig.anchorId);
    }
  }

  dominantAnchors.forEach((anchor) => evaluate(anchor, 2));
  significantAnchors.forEach((anchor) => evaluate(anchor, 1));

  if (totalWeight === 0) {
    return {
      lens: 'career_anchors',
      question: 'Does this direction fit what actually matters to the person in work?',
      level: 'unknown',
      score: 50,
      warnings,
      missing,
      reasons: ['No anchor data available for this direction.']
    };
  }

  const averageDistance = totalWeightedDistance / totalWeight;
  const score = Math.max(0, Math.round(100 - averageDistance * 18));

  let level = 'weak_fit';
  if (score >= 80) level = 'strong_fit';
  else if (score >= 65) level = 'moderate_fit';
  else if (score >= 50) level = 'mixed_fit';

  return {
    lens: 'career_anchors',
    question: 'Does this direction fit what actually matters to the person in work?',
    level,
    score,
    warnings,
    missing,
    reasons: warnings.length
      ? [`Potential anchor tension: ${warnings.join(', ')}`]
      : ['No major anchor conflict detected.']
  };
}

function getFinancialRealityResult(direction = {}, salaryBenchmark = {}, evidenceModel = {}) {
  const annualFloor = getAnnualIncomeFloor(evidenceModel);
  const avg12month = getAvg12MonthIncome(salaryBenchmark);
  const runwayMonths = numberOrNull(evidenceModel.financialContext?.savingsRunwayMonths);
  const financialRiskLevel = direction.financialRiskLevel || UNKNOWN;

  const reasons = [];

  if (annualFloor === null || avg12month === null) {
    return {
      lens: 'financial_reality',
      question: 'Can this path work against income floor and transition runway?',
      level: 'unknown',
      score: 50,
      annualFloor,
      avg12month,
      runwayMonths,
      financialRiskLevel,
      reasons: ['Income floor or salary benchmark is missing.']
    };
  }

  const ratio = annualFloor > 0 ? avg12month / annualFloor : 1;
  let score = 50;
  let level = 'financially_constrained';

  if (ratio >= 1.2) {
    score = 95;
    level = 'financially_viable_now';
  } else if (ratio >= 1.0) {
    score = 75;
    level = 'financially_viable';
  } else if (ratio >= 0.8) {
    score = 45;
    level = 'financially_constrained';
  } else {
    score = 20;
    level = 'not_viable_now';
  }

  if (runwayMonths !== null && runwayMonths >= 6) {
    score = Math.min(100, score + 10);
    reasons.push('Runway improves transition feasibility.');
  }

  if (runwayMonths !== null && runwayMonths < 3) {
    score = Math.max(0, score - 20);
    reasons.push('Short runway increases financial risk.');
  }

  if (financialRiskLevel === 'high') {
    score = Math.max(0, score - 10);
    reasons.push('Direction has high financial ramp-up risk.');
  }

  if (financialRiskLevel === 'medium') {
    reasons.push('Direction has medium financial ramp-up risk.');
  }

  return {
    lens: 'financial_reality',
    question: 'Can this path work against income floor and transition runway?',
    level,
    score,
    annualFloor,
    avg12month,
    ratio: Math.round(ratio * 100) / 100,
    runwayMonths,
    financialRiskLevel,
    reasons
  };
}

function getPracticalConstraintsResult(direction = {}, evidenceModel = {}) {
  const constraints = evidenceModel.constraints || {};
  const context = normalize(direction.context);
  const reasons = [];
  let score = 75;
  let level = 'practically_feasible';

  const salesComfort = normalize(constraints.salesComfort);
  const riskTolerance = normalize(constraints.riskTolerance);
  const retrainingWillingness = normalize(constraints.retrainingWillingness);
  const independentLike =
    context.includes('independent') ||
    context.includes('fractional') ||
    context.includes('own venture') ||
    context.includes('startup');

  if (independentLike && (salesComfort.includes('low') || salesComfort.includes('avoid'))) {
    score -= 25;
    reasons.push('Independent/fractional path may conflict with low sales or business development comfort.');
  }

  if (independentLike && (riskTolerance.includes('low') || riskTolerance.includes('avoid'))) {
    score -= 20;
    reasons.push('Independent/startup path may conflict with low risk tolerance.');
  }

  if (
    direction.transitionCategory === 'credentialed' &&
    (retrainingWillingness.includes('low') || retrainingWillingness.includes('no'))
  ) {
    score -= 25;
    reasons.push('Credentialed path may require retraining or formal qualification work.');
  }

  if (score >= 75) level = 'practically_feasible';
  else if (score >= 55) level = 'feasible_with_adjustments';
  else if (score >= 35) level = 'constrained';
  else level = 'not_realistic_now';

  return {
    lens: 'practical_constraints',
    question: 'Is this realistic under current life and work conditions?',
    level,
    score: Math.max(0, score),
    reasons: reasons.length ? reasons : ['No major practical constraint detected from available data.'],
    constraintsSnapshot: {
      remotePreference: constraints.remotePreference,
      salesComfort: constraints.salesComfort,
      riskTolerance: constraints.riskTolerance,
      retrainingWillingness: constraints.retrainingWillingness,
      workAuthorization: constraints.workAuthorization
    }
  };
}

function getCredentialsGateResult(direction = {}, evidenceModel = {}) {
  const eligibility = direction.eligibility || null;
  const transitionCategory = direction.transitionCategory || UNKNOWN;
  const credentials = evidenceModel.credentials || {};
  const credentialText = normalize(credentials.rawText);
  const detectedSignals = credentials.detectedSignals || [];
  const reasons = [];

  const requiresCredential =
    transitionCategory === 'credentialed' ||
    Boolean(eligibility) ||
    hasAny(getDirectionText(direction), [
      'teacher',
      'therapy',
      'therapist',
      'nurse',
      'legal',
      'law',
      'attorney',
      'financial planning',
      'wealth management',
      'real estate',
      'hvac',
      'clinical',
      'licensed'
    ]);

  if (!requiresCredential) {
    return {
      lens: 'credentials_gates',
      question: 'Does this path require licenses, certifications, or formal qualifications?',
      level: 'not_required',
      score: 100,
      requiresCredential: false,
      gateType: 'none',
      reasons: ['No required credential gate detected for this direction.']
    };
  }

  if (detectedSignals.length > 0 || credentialText.length > 0) {
    reasons.push('Credential-related signals were detected, but v1.4 Bundle 1B does not yet verify sufficiency or jurisdiction.');
    return {
      lens: 'credentials_gates',
      question: 'Does this path require licenses, certifications, or formal qualifications?',
      level: 'credential_review_required',
      score: 60,
      requiresCredential: true,
      gateType: eligibility?.gateType || 'review',
      detectedSignals,
      acceptedCredentials: eligibility?.acceptedCredentials || [],
      reasons
    };
  }

  return {
    lens: 'credentials_gates',
    question: 'Does this path require licenses, certifications, or formal qualifications?',
    level: 'credential_unknown_or_missing',
    score: 20,
    requiresCredential: true,
    gateType: eligibility?.gateType || 'hard',
    detectedSignals,
    acceptedCredentials: eligibility?.acceptedCredentials || [],
    reasons: ['This direction appears credential-dependent, but no credential signal is available.']
  };
}

function getAiDurabilityResult(direction = {}) {
  const rating = direction.aiDurabilityRating || UNKNOWN;
  const score = DURABILITY_SCORE_MAP[rating] ?? 0;

  let level = 'unknown';
  if (rating === 'D4') level = 'future_resilient';
  else if (rating === 'D3') level = 'durable';
  else if (rating === 'D2') level = 'stable_but_changing';
  else if (rating === 'D1') level = 'pressured';
  else if (rating === 'D0') level = 'declining_or_exit_risk';

  return {
    lens: 'ai_durability',
    question: 'How may this direction change as AI reshapes the market?',
    level,
    score,
    rating,
    d4EvolutionPath: direction.d4EvolutionPath || '',
    reasons: [
      rating === 'D0'
        ? 'Direction has high AI disruption or exit risk.'
        : `AI durability rating is ${rating}.`
    ]
  };
}

function getDirectionCalibrationInput(direction = {}, lensResults = {}) {
  const averageScore = Math.round(
    (
      (lensResults.careerEvidenceResult?.score || 0) +
      (lensResults.marketCredibilityResult?.score || 0) +
      (lensResults.anchorFitResult?.score || 0) +
      (lensResults.financialRealityResult?.score || 0) +
      (lensResults.practicalConstraintsResult?.score || 0) +
      (lensResults.credentialsGateResult?.score || 0) +
      (lensResults.aiDurabilityResult?.score || 0)
    ) / 7
  );

  return {
    lens: 'direction_calibration',
    question: 'Which paths are direct, bridge-based, nearby, conditional, longer-term, or suppressed?',
    preliminaryScore: averageScore,
    transitionCategory: direction.transitionCategory || UNKNOWN,
    transitionPathway: direction.transitionPathway || UNKNOWN,
    financialRiskLevel: direction.financialRiskLevel || UNKNOWN
  };
}

export function evaluateDirectionLensesV14({
  candidate,
  direction,
  salaryBenchmark,
  evidenceModel
}) {
  const careerEvidenceResult = getCareerEvidenceResult(candidate, direction, evidenceModel);
  const marketCredibilityResult = getMarketCredibilityResult(direction, careerEvidenceResult);
  const anchorFitResult = getAnchorFitResult(direction, evidenceModel);
  const financialRealityResult = getFinancialRealityResult(direction, salaryBenchmark, evidenceModel);
  const practicalConstraintsResult = getPracticalConstraintsResult(direction, evidenceModel);
  const credentialsGateResult = getCredentialsGateResult(direction, evidenceModel);
  const aiDurabilityResult = getAiDurabilityResult(direction);

  const directionCalibrationInput = getDirectionCalibrationInput(direction, {
    careerEvidenceResult,
    marketCredibilityResult,
    anchorFitResult,
    financialRealityResult,
    practicalConstraintsResult,
    credentialsGateResult,
    aiDurabilityResult
  });

  return {
    directionId: direction.directionId,
    directionLabel: direction.directionLabel,
    careerEvidenceResult,
    marketCredibilityResult,
    anchorFitResult,
    financialRealityResult,
    practicalConstraintsResult,
    credentialsGateResult,
    aiDurabilityResult,
    directionCalibrationInput
  };
}

export const directionLensesV14 = {
  evaluateDirectionLensesV14
};
