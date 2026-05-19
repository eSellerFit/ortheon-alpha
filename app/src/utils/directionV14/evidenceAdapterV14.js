// app/src/utils/directionV14/evidenceAdapterV14.js
// Direction Engine v1.4 — Evidence Adapter
//
// Purpose:
// Convert the existing Ortheon assessment object into a stable v1.4 evidence model.
// This file does not score directions and does not change existing engine behavior.

const UNKNOWN = 'unknown';

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asArray(value) {
  if (value === null || value === undefined || value === '') return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function compact(values) {
  return asArray(values)
    .flatMap((value) => asArray(value))
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => (typeof value === 'string' ? value.trim() : value))
    .filter(Boolean);
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean).join(' ');
  if (isObject(value)) {
    return Object.values(value).map(normalizeText).filter(Boolean).join(' ');
  }
  return '';
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeCompetencySignals(cvProfile = {}) {
  const signals = asArray(cvProfile.competencySignals);

  return signals
    .map((signal) => {
      if (!isObject(signal)) return null;

      return {
        competencyId: signal.competencyId ?? signal.id ?? null,
        competencyName:
          signal.competencyName ??
          signal.name ??
          signal.label ??
          signal.competency ??
          '',
        signalStrength:
          signal.signalStrength ??
          signal.strength ??
          signal.level ??
          UNKNOWN,
        evidence:
          signal.evidence ??
          signal.reason ??
          signal.description ??
          '',
        source: signal.source ?? 'cv'
      };
    })
    .filter(Boolean);
}

function normalizeAnchors(assessment = {}) {
  const anchors = assessment.anchors || assessment.careerAnchors || {};

  return {
    technical: numberOrNull(anchors.technical ?? anchors.technicalFunctional),
    management: numberOrNull(anchors.management ?? anchors.generalManagerial),
    autonomy: numberOrNull(anchors.autonomy ?? anchors.independence),
    security: numberOrNull(anchors.security ?? anchors.stability),
    entrepreneurial: numberOrNull(anchors.entrepreneurial ?? anchors.entrepreneurialCreativity),
    impact: numberOrNull(anchors.impact ?? anchors.service ?? anchors.serviceDedication),
    challenge: numberOrNull(anchors.challenge ?? anchors.pureChallenge),
    workModel: numberOrNull(anchors.workModel ?? anchors.lifestyle ?? anchors.lifeStyle)
  };
}

function normalizeFinancialContext(assessment = {}) {
  const financial =
    assessment.financialReality ||
    assessment.financialContext ||
    assessment.financial ||
    {};

  const minimumMonthlyIncome = numberOrNull(
    financial.minimumMonthlyIncome ??
      financial.incomeFloorMonthly ??
      financial.monthlyIncomeNeed ??
      financial.minimumIncomeNeed
  );

  const savingsRunwayMonths = numberOrNull(
    financial.savingsRunwayMonths ??
      financial.runwayMonths ??
      financial.transitionRunwayMonths
  );

  return {
    minimumMonthlyIncome,
    annualIncomeFloor:
      minimumMonthlyIncome !== null ? minimumMonthlyIncome * 12 : null,
    savingsRunwayMonths,
    currentIncomeRange:
      financial.currentIncomeRange ??
      financial.recentIncomeRange ??
      financial.currentRecentIncomeRange ??
      UNKNOWN,
    toleranceForIncomeDrop:
      financial.toleranceForIncomeDrop ??
      financial.incomeDropTolerance ??
      UNKNOWN,
    householdDependency:
      financial.householdDependency ??
      financial.dependents ??
      UNKNOWN,
    needsStableIncome:
      financial.needsStableIncome ??
      financial.needForStableIncome ??
      UNKNOWN,
    needsBenefits:
      financial.needsBenefits ??
      financial.needForBenefits ??
      UNKNOWN,
    retrainingBudget:
      financial.retrainingBudget ??
      financial.trainingBudget ??
      UNKNOWN,
    raw: financial
  };
}

function normalizeConstraints(assessment = {}) {
  const constraints =
    assessment.transitionConstraints ||
    assessment.constraints ||
    assessment.practicalConstraints ||
    {};

  return {
    location:
      constraints.location ??
      assessment.location ??
      assessment.country ??
      UNKNOWN,
    workAuthorization:
      constraints.workAuthorization ??
      assessment.workAuthorization ??
      UNKNOWN,
    remotePreference:
      constraints.remotePreference ??
      constraints.workModelPreference ??
      constraints.remoteHybridOnsite ??
      UNKNOWN,
    familyConstraints:
      constraints.familyConstraints ??
      UNKNOWN,
    timeAvailablePerWeek:
      numberOrNull(
        constraints.timeAvailablePerWeek ??
          constraints.weeklyTimeAvailable
      ),
    retrainingWillingness:
      constraints.retrainingWillingness ??
      constraints.willingnessToRetrain ??
      UNKNOWN,
    networkingComfort:
      constraints.networkingComfort ??
      UNKNOWN,
    salesComfort:
      constraints.salesComfort ??
      constraints.businessDevelopmentComfort ??
      UNKNOWN,
    travelLimitations:
      constraints.travelLimitations ??
      UNKNOWN,
    riskTolerance:
      constraints.riskTolerance ??
      UNKNOWN,
    raw: constraints
  };
}

function normalizeCredentials(assessment = {}) {
  const directCredentials =
    assessment.credentials ||
    assessment.licenses ||
    assessment.certifications ||
    assessment.credentialStatus ||
    {};

  const cvProfile = assessment.cvProfile || {};
  const credentialText = normalizeText([
    directCredentials,
    cvProfile.credentials,
    cvProfile.certifications,
    cvProfile.licenses,
    cvProfile.education,
    cvProfile.careerSummary
  ]);

  const knownCredentialKeywords = [
    'license',
    'licensed',
    'certification',
    'certified',
    'certificate',
    'cpa',
    'rn',
    'nurse',
    'teacher certification',
    'teaching certificate',
    'series 65',
    'series 66',
    'finra',
    'ria',
    'real estate license',
    'hvac',
    'apprenticeship',
    'bar admission',
    'attorney',
    'therapist',
    'clinical'
  ];

  const lower = credentialText.toLowerCase();
  const detectedSignals = knownCredentialKeywords.filter((keyword) =>
    lower.includes(keyword)
  );

  return {
    status: detectedSignals.length > 0 ? 'signals_detected' : UNKNOWN,
    detectedSignals,
    provided: directCredentials,
    rawText: credentialText
  };
}

function extractCareerEvidence(assessment = {}) {
  const cvProfile = assessment.cvProfile || {};

  const domainSignals = compact([
    cvProfile.domainSignals,
    cvProfile.industrySignals,
    cvProfile.functionalSignals
  ]);

  const roleTitles = compact([
    cvProfile.roleTitles,
    cvProfile.titles,
    cvProfile.currentRole,
    assessment.currentRole
  ]);

  const industries = compact([
    cvProfile.industries,
    cvProfile.industry,
    assessment.currentIndustry,
    assessment.industry
  ]);

  const evidenceText = normalizeText([
    cvProfile.reviewedText,
    cvProfile.rawText,
    cvProfile.careerSummary,
    cvProfile.domainSignals,
    cvProfile.senioritySignal,
    cvProfile.entrepreneurialSignals,
    cvProfile.tradeSignals,
    cvProfile.tenurePattern,
    cvProfile.leadershipScope,
    cvProfile.achievements,
    roleTitles,
    industries,
    assessment.currentRole,
    assessment.currentIndustry,
    assessment.careerSituation
  ]);

  return {
    cvSource: cvProfile.cvSource ?? UNKNOWN,
    parsed: Boolean(cvProfile.parsed),
    skipped: Boolean(cvProfile.skipped),
    careerSummary: cvProfile.careerSummary ?? '',
    domainSignals,
    roleTitles,
    industries,
    senioritySignal: cvProfile.senioritySignal ?? UNKNOWN,
    leadershipScope: cvProfile.leadershipScope ?? UNKNOWN,
    tenurePattern: cvProfile.tenurePattern ?? UNKNOWN,
    entrepreneurialSignals: compact(cvProfile.entrepreneurialSignals),
    tradeSignals: compact(cvProfile.tradeSignals),
    advisorySignals: compact(cvProfile.advisorySignals),
    trainingSignals: compact(cvProfile.trainingSignals),
    achievements: compact(cvProfile.achievements),
    evidenceText
  };
}

export function adaptAssessmentToEvidenceV14(assessment = {}) {
  const cvProfile = assessment.cvProfile || {};
  const competencySignals = normalizeCompetencySignals(cvProfile);
  const careerEvidence = extractCareerEvidence(assessment);

  return {
    engineVersion: 'v1.4',
    assessmentId: assessment.id ?? assessment.assessmentId ?? null,
    status: assessment.status ?? UNKNOWN,
    careerEvidence,
    competencySignals,
    anchors: normalizeAnchors(assessment),
    financialContext: normalizeFinancialContext(assessment),
    constraints: normalizeConstraints(assessment),
    credentials: normalizeCredentials(assessment),
    rawAssessment: assessment
  };
}

export const evidenceAdapterV14 = {
  adaptAssessmentToEvidenceV14
};
