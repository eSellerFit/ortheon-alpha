// app/src/utils/directionV14/directionEngineV14.js
// Direction Engine v1.4 — Diagnostic Orchestrator
//
// Bundle 1B scope:
// - Adapt an existing assessment into the v1.4 evidence model.
// - Detect career spines.
// - Build a candidate direction set from current roleLibrary.
// - Evaluate candidates through eight lenses.
// - Apply hard gates.
// - Calibrate directions.
// - Return diagnostic output.
// - Do NOT replace the current scoring engine.
// - Do NOT create user-facing recommendations yet.

import { roleLibrary } from '../../data/roleLibrary.js';
import { salaryBenchmarks } from '../../data/salaryBenchmarks.js';
import { adaptAssessmentToEvidenceV14 } from './evidenceAdapterV14.js';
import { detectCareerSpinesV14 } from './careerSpineDetectorV14.js';
import { evaluateDirectionLensesV14 } from './directionLensesV14.js';
import { applyHardGatesV14 } from './directionGatesV14.js';
import { calibrateDirectionV14 } from './directionCalibrationV14.js';
import { buildMatchingEngineFoundationDiagnostics } from '../matchingEngineV1/foundationDiagnostics.js';

function normalize(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.toLowerCase();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).toLowerCase();
  if (Array.isArray(value)) return value.map(normalize).join(' ');
  if (typeof value === 'object') return Object.values(value).map(normalize).join(' ');
  return '';
}

function hasAny(text, terms = []) {
  return terms.some((term) => text.includes(String(term).toLowerCase()));
}

const SPINE_DIRECTION_HINTS = {
  people_hr_talent: [
    'people',
    'hr',
    'human resources',
    'talent',
    'workforce',
    'organization',
    'people analytics'
  ],
  marketing_brand_growth: [
    'marketing',
    'brand',
    'communications',
    'growth',
    'public affairs',
    'pr'
  ],
  sales_business_development: [
    'sales',
    'business development',
    'account',
    'revenue'
  ],
  operations_process_execution: [
    'operations',
    'program',
    'project',
    'chief of staff',
    'process',
    'marketplace',
    'platform'
  ],
  finance_accounting_risk: [
    'financial',
    'finance',
    'accounting',
    'risk',
    'wealth',
    'investment'
  ],
  legal_compliance: [
    'legal',
    'law',
    'compliance',
    'risk operations',
    'regulatory'
  ],
  education_training_learning: [
    'education',
    'training',
    'learning',
    'l&d',
    'teacher',
    'career',
    'outplacement'
  ],
  healthcare_care: [
    'health',
    'therapy',
    'clinical',
    'care',
    'mental health'
  ],
  creative_content_design: [
    'design',
    'creative',
    'content',
    'media',
    'ux'
  ],
  consulting_advisory: [
    'consulting',
    'advisor',
    'advisory',
    'fractional'
  ],
  entrepreneurship_founder_operator: [
    'startup',
    'founder',
    'entrepreneurial',
    'own venture',
    'operator'
  ],
  skilled_trade_technical_craft: [
    'skilled',
    'trade',
    'technical craft',
    'installation',
    'maintenance',
    'repair',
    'hvac'
  ],
  it_enterprise_systems: [
    'information technology',
    'it',
    'enterprise systems',
    'systems',
    'cloud',
    'infrastructure',
    'erp',
    'crm'
  ],
  digital_transformation_automation_ai: [
    'digital',
    'automation',
    'ai',
    'transformation',
    'workflow',
    'internal tools'
  ],
  data_analytics_bi: [
    'data',
    'analytics',
    'business intelligence',
    'bi',
    'people analytics'
  ],
  product_digital_platform: [
    'product',
    'digital product',
    'platform',
    'product operations'
  ],
  cybersecurity_technology_risk: [
    'cyber',
    'security',
    'technology risk',
    'information security'
  ]
};

function getSalaryBenchmark(directionId) {
  return salaryBenchmarks.find((item) => item.directionId === directionId) || null;
}

function scoreDirectionAgainstSpines(direction, spines = {}) {
  const directionText = normalize([
    direction.directionLabel,
    direction.metaDirection,
    direction.category,
    direction.context,
    direction.relevantDomains,
    direction.onetTitles,
    direction.d4EvolutionPath
  ]);

  const primarySpines = spines.primary || [];
  const secondarySpines = spines.secondary || [];
  const weakSpines = spines.weakSignals || [];

  let score = 0;
  const reasons = [];

  primarySpines.forEach((spine) => {
    const hints = SPINE_DIRECTION_HINTS[spine.id] || [];
    if (hasAny(directionText, hints)) {
      score += 100;
      reasons.push(`Matches primary spine: ${spine.label}`);
    }
  });

  secondarySpines.forEach((spine) => {
    const hints = SPINE_DIRECTION_HINTS[spine.id] || [];
    if (hasAny(directionText, hints)) {
      score += 60;
      reasons.push(`Matches secondary spine: ${spine.label}`);
    }
  });

  weakSpines.forEach((spine) => {
    const hints = SPINE_DIRECTION_HINTS[spine.id] || [];
    if (hasAny(directionText, hints)) {
      score += 15;
      reasons.push(`Only weak/noise spine signal: ${spine.label}`);
    }
  });

  return {
    score,
    reasons
  };
}

function buildCandidateDirectionsV14(spines = {}) {
  return roleLibrary
    .map((direction) => {
      const match = scoreDirectionAgainstSpines(direction, spines);
      const salaryBenchmark = getSalaryBenchmark(direction.directionId);

      return {
        direction,
        salaryBenchmark,
        summary: {
          directionId: direction.directionId,
          directionLabel: direction.directionLabel,
          category: direction.category,
          metaDirection: direction.metaDirection,
          context: direction.context,
          aiDurabilityRating: direction.aiDurabilityRating,
          transitionCategory: direction.transitionCategory,
          transitionPathway: direction.transitionPathway,
          financialRiskLevel: direction.financialRiskLevel,
          bridgeDirections: direction.bridgeDirections || [],
          longerPathOptions: direction.longerPathOptions || [],
          candidateScore: match.score,
          candidateReasons: match.reasons
        }
      };
    })
    .filter((candidate) => candidate.summary.candidateScore > 0)
    .sort((a, b) => b.summary.candidateScore - a.summary.candidateScore);
}

function evaluateCandidateV14(candidate, evidenceModel) {
  const lensResults = evaluateDirectionLensesV14({
    candidate: candidate.summary,
    direction: candidate.direction,
    salaryBenchmark: candidate.salaryBenchmark,
    evidenceModel
  });

  const gates = applyHardGatesV14({
    direction: candidate.direction,
    lensResults,
    evidenceModel
  });

  const calibration = calibrateDirectionV14({
    direction: candidate.direction,
    lensResults,
    gates,
    evidenceModel
  });

  return {
    ...candidate.summary,
    lensResults,
    gates,
    calibration,
    finalClassification: calibration.finalClassification,
    overallLensScore: calibration.overallLensScore,
    decisionContext: calibration.decisionContext
  };
}

function sortCalibratedDirections(a, b) {
  if (a.calibration.classificationPriority !== b.calibration.classificationPriority) {
    return a.calibration.classificationPriority - b.calibration.classificationPriority;
  }

  if (a.overallLensScore !== b.overallLensScore) {
    return b.overallLensScore - a.overallLensScore;
  }

  return b.candidateScore - a.candidateScore;
}

export function generateDirectionDiagnosticsV14(assessment = {}, options = {}) {
  const evidenceModel = adaptAssessmentToEvidenceV14(assessment);
  const careerSpines = detectCareerSpinesV14(evidenceModel);
  const candidateDirectionsRaw = buildCandidateDirectionsV14(careerSpines);

  const maxCandidates =
    Number.isFinite(options.maxCandidates) && options.maxCandidates > 0
      ? options.maxCandidates
      : 20;

  const maxRecommendations =
    Number.isFinite(options.maxRecommendations) && options.maxRecommendations > 0
      ? options.maxRecommendations
      : 5;

  const evaluated = candidateDirectionsRaw
    .slice(0, maxCandidates)
    .map((candidate) => evaluateCandidateV14(candidate, evidenceModel))
    .sort(sortCalibratedDirections);

  const suppressedDirections = evaluated.filter(
    (item) => item.finalClassification === 'Suppressed'
  );

  const recommendations = evaluated
    .filter((item) => item.finalClassification !== 'Suppressed')
    .slice(0, maxRecommendations)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  const diagnostics = {
    engineVersion: 'v1.4',
    stage: 'bundle_1b_eight_lenses_gates_calibration',
    generatedAt: new Date().toISOString(),
    assessmentId: evidenceModel.assessmentId,
    status: evidenceModel.status,
    evidenceModel,
    careerSpines,
    candidateDirections: candidateDirectionsRaw
      .slice(0, maxCandidates)
      .map((candidate) => candidate.summary),
    lensDiagnostics: evaluated,
    suppressedDirections,
    recommendations,
    notes: [
      'Bundle 1B adds eight-lens diagnostics, hard gates, and calibration.',
      'Existing scoring engine and user-facing results are still unchanged.',
      'v1.4 output is diagnostic only until connected behind a debug page or feature flag.'
    ]
  };

  return {
    ...diagnostics,
    matchingEngineV1Foundation: buildMatchingEngineFoundationDiagnostics({
      assessment,
      directionDiagnostics: diagnostics
    })
  };
}

export const directionEngineV14 = {
  generateDirectionDiagnosticsV14
};
