/**
 * Ortheon MVP Cut v3.1 — Assessment Snapshot Adapter
 *
 * Purpose:
 * Convert the current Firestore assessment document shape into
 * AssessmentSnapshotV31.
 *
 * This is the first adapter between the existing Ortheon MVP data model
 * and the isolated v3.1 architecture layer.
 *
 * Bundle 2 rule:
 * - Pure adapter only.
 * - No AI calls.
 * - No Firestore reads/writes.
 * - No production imports.
 * - No changes to live assessment flow.
 * - No changes to ResultsStep, PdfReport, CareerDirectionMap, scoring.js,
 *   directionEngineV14, or featureFlags.
 */

/**
 * @typedef {import("../contracts/assessmentSnapshotV31.js").AssessmentSnapshotV31} AssessmentSnapshotV31
 */

function nullableString(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function objectOrNull(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value;
}

function objectOrEmpty(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function normalizeAnchorScores(anchors = {}) {
  const source = objectOrEmpty(anchors);

  return Object.entries(source).reduce((acc, [key, value]) => {
    const number = Number(value);

    if (Number.isFinite(number)) {
      acc[key] = number;
    }

    return acc;
  }, {});
}

function normalizeFinancialReality(financialReality) {
  if (!objectOrNull(financialReality)) return null;

  return {
    currentMonthlyIncome: nullableNumber(financialReality.currentMonthlyIncome),
    minimumMonthlyIncome: nullableNumber(financialReality.minimumMonthlyIncome),
    savingsRunwayMonths: nullableNumber(financialReality.savingsRunwayMonths),
    bridgeRoleWillingness: nullableString(financialReality.bridgeRoleWillingness),
    retrainingInvestmentAbility: nullableString(
      financialReality.retrainingInvestmentAbility
    ),
  };
}

function normalizeTransitionConstraints(transitionConstraints) {
  if (!objectOrNull(transitionConstraints)) return null;

  return {
    locationConstraint: nullableString(transitionConstraints.locationConstraint),
    workAuthorizedUS: nullableString(transitionConstraints.workAuthorizedUS),
    visaSponsorshipNeeded: nullableString(
      transitionConstraints.visaSponsorshipNeeded
    ),
    weeklyTimeAvailable: nullableNumber(
      transitionConstraints.weeklyTimeAvailable
    ),
    retrainingWillingness: nullableString(
      transitionConstraints.retrainingWillingness
    ),
  };
}

function normalizeProfessionalCredentials(professionalCredentials) {
  if (!objectOrNull(professionalCredentials)) return null;

  return {
    hasRegulatedCredentials: nullableString(
      professionalCredentials.hasRegulatedCredentials
    ),
    credentials: arrayOrEmpty(professionalCredentials.credentials),
  };
}

function normalizeCvProfile(cvProfile) {
  if (!objectOrNull(cvProfile)) return null;

  return {
    cvSource: nullableString(cvProfile.cvSource),
    parsed:
      typeof cvProfile.parsed === "boolean" ? cvProfile.parsed : null,
    skipped:
      typeof cvProfile.skipped === "boolean" ? cvProfile.skipped : null,
    rawTextLength: nullableNumber(cvProfile.rawTextLength),
    reviewedText: nullableString(cvProfile.reviewedText),
    pdfMetadata: objectOrNull(cvProfile.pdfMetadata),
    careerSummary: nullableString(cvProfile.careerSummary),
    domainSignals: cvProfile.domainSignals || null,
    senioritySignal: cvProfile.senioritySignal || null,
    entrepreneurialSignals: cvProfile.entrepreneurialSignals || null,
    tradeSignals: cvProfile.tradeSignals || null,
    tenurePattern: cvProfile.tenurePattern || null,
    leadershipScope: cvProfile.leadershipScope || null,
    confidence: objectOrNull(cvProfile.confidence),
    competencySignals: arrayOrEmpty(cvProfile.competencySignals),
    userCorrections: arrayOrEmpty(cvProfile.userCorrections),
  };
}

/**
 * Build a normalized v3.1 assessment snapshot from the current assessment
 * document shape.
 *
 * @param {Object} assessment Current assessment object, usually returned by getAssessment().
 * @returns {AssessmentSnapshotV31}
 */
export function buildAssessmentSnapshotV31(assessment = {}) {
  const source = objectOrEmpty(assessment);

  return {
    version: "v3.1",
    assessmentId: nullableString(source.id || source.assessmentId) || "",

    sourceAssessment: {
      source: nullableString(source.source) || "ortheon-alpha-mvp",
      roleLibraryVersion: nullableString(source.roleLibraryVersion),
      salaryBenchmarkVersion: nullableString(source.salaryBenchmarkVersion),
      scoringVersion: nullableString(source.scoringVersion),
      careerMapVersion: nullableString(source.careerMapVersion),
      currentStatus: nullableString(source.status),
    },

    identity: {
      firstName: nullableString(source.firstName),
      email: nullableString(source.email),
      currentRole: nullableString(source.currentRole),
      currentSituation: nullableString(source.currentSituation),
      targetMarket: nullableString(source.targetMarket),
      countryOrRegion: nullableString(source.countryOrRegion),
    },

    anchors: {
      model: "ortheon_anchor_model",
      scores: normalizeAnchorScores(source.anchors),
      dominantAnchors: [],
      secondaryAnchors: [],
      tensions: [],
    },

    financialReality: normalizeFinancialReality(source.financialReality),

    transitionConstraints: normalizeTransitionConstraints(
      source.transitionConstraints
    ),

    professionalCredentials: normalizeProfessionalCredentials(
      source.professionalCredentials
    ),

    cvProfile: normalizeCvProfile(source.cvProfile),

    legacyPriorityWeights: objectOrNull(source.priorityWeights),

    rawAssessment: source,
  };
}
