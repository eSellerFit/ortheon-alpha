// app/src/utils/matchingEngineV1/candidateProfileAdapter.js
// Build the conceptual CandidateProfile used by Matching Engine v1 diagnostics.
//
// Bundle 1 scope:
// - Normalize currently available assessment and v1.4 evidence model data.
// - Track missing inputs internally.
// - Do not score or invent data.

import { AI_DIGITAL_TREATMENTS, CONFIDENCE_LABELS } from "./constants.js";

const UNKNOWN = "unknown";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isMissing(value) {
  if (value === null || value === undefined || value === "") return true;
  if (value === UNKNOWN) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

function compactObject(value = {}) {
  if (!isObject(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => !isMissing(entry))
  );
}

function collectMissingInputs(groups = {}) {
  const missingInputs = [];

  Object.entries(groups).forEach(([groupName, fields]) => {
    Object.entries(fields || {}).forEach(([fieldName, value]) => {
      if (isMissing(value)) {
        missingInputs.push({
          group: groupName,
          field: fieldName,
        });
      }
    });
  });

  return missingInputs;
}

function detectAiTreatment(assessment = {}, evidenceModel = {}) {
  const text = [
    assessment?.currentRole,
    assessment?.careerSituation,
    assessment?.cvProfile?.careerSummary,
    assessment?.cvProfile?.domainSignals,
    assessment?.cvProfile?.leadershipScope,
    evidenceModel?.careerEvidence?.evidenceText,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!text) {
    return {
      treatment: AI_DIGITAL_TREATMENTS.ASPIRATIONAL,
      confidence: CONFIDENCE_LABELS.LOW,
      signals: [],
    };
  }

  const deploymentTerms = [
    "ai agent",
    "ai agents",
    "machine learning",
    "ml",
    "llm",
    "genai",
    "generative ai",
    "rag",
    "automation",
    "digital transformation",
  ];

  const toolingTerms = ["chatgpt", "openai", "ollama", "langchain"];

  const matchedDeploymentTerms = deploymentTerms.filter((term) =>
    text.includes(term)
  );
  const matchedToolingTerms = toolingTerms.filter((term) => text.includes(term));

  if (matchedDeploymentTerms.length > 0) {
    return {
      treatment: AI_DIGITAL_TREATMENTS.MODIFIER,
      confidence: CONFIDENCE_LABELS.INFERRED,
      signals: matchedDeploymentTerms,
    };
  }

  if (matchedToolingTerms.length > 0) {
    return {
      treatment: AI_DIGITAL_TREATMENTS.TOOLING,
      confidence: CONFIDENCE_LABELS.INFERRED,
      signals: matchedToolingTerms,
    };
  }

  return {
    treatment: AI_DIGITAL_TREATMENTS.ASPIRATIONAL,
    confidence: CONFIDENCE_LABELS.LOW,
    signals: [],
  };
}

function buildSourceConfidence(assessment = {}, evidenceModel = {}) {
  const cvProfile = assessment.cvProfile || {};
  const hasParsedCv = Boolean(cvProfile.parsed || evidenceModel.careerEvidence?.parsed);
  const hasCompetencies =
    Array.isArray(evidenceModel.competencySignals) &&
    evidenceModel.competencySignals.length > 0;

  return {
    cvProfile: hasParsedCv ? CONFIDENCE_LABELS.MEDIUM : CONFIDENCE_LABELS.LOW,
    competencySignals: hasCompetencies
      ? CONFIDENCE_LABELS.MEDIUM
      : CONFIDENCE_LABELS.LOW,
    careerAnchors: isMissing(evidenceModel.anchors)
      ? CONFIDENCE_LABELS.LOW
      : CONFIDENCE_LABELS.MEDIUM,
    financialReality: isMissing(evidenceModel.financialContext)
      ? CONFIDENCE_LABELS.LOW
      : CONFIDENCE_LABELS.MEDIUM,
    transitionConstraints: isMissing(evidenceModel.constraints)
      ? CONFIDENCE_LABELS.LOW
      : CONFIDENCE_LABELS.MEDIUM,
    credentialStatus:
      evidenceModel.credentials?.status === "signals_detected"
        ? CONFIDENCE_LABELS.INFERRED
        : CONFIDENCE_LABELS.NEEDS_VALIDATION,
  };
}

export function buildCandidateProfile({
  assessment = {},
  evidenceModel = {},
  directionDiagnostics = {},
} = {}) {
  const cvProfile = {
    ...(assessment.cvProfile || {}),
    currentRole: assessment.currentRole ?? null,
    currentIndustry: assessment.currentIndustry ?? null,
    careerSituation: assessment.careerSituation ?? null,
    normalizedCareerEvidence: evidenceModel.careerEvidence || {},
  };

  const competencySignals = evidenceModel.competencySignals || [];
  const careerAnchors = compactObject(evidenceModel.anchors || {});
  const financialReality = compactObject(evidenceModel.financialContext || {});
  const transitionConstraints = compactObject(evidenceModel.constraints || {});
  const credentialStatus = evidenceModel.credentials || {};
  const aiDigitalSignals = detectAiTreatment(assessment, evidenceModel);
  const sourceConfidence = buildSourceConfidence(assessment, evidenceModel);

  const missingInputs = collectMissingInputs({
    cvProfile: {
      currentRole: cvProfile.currentRole,
      careerSummary: cvProfile.careerSummary,
    },
    careerAnchors: evidenceModel.anchors || {},
    financialReality: {
      annualIncomeFloor: evidenceModel.financialContext?.annualIncomeFloor,
      savingsRunwayMonths: evidenceModel.financialContext?.savingsRunwayMonths,
    },
    transitionConstraints: {
      remotePreference: evidenceModel.constraints?.remotePreference,
      retrainingWillingness: evidenceModel.constraints?.retrainingWillingness,
      riskTolerance: evidenceModel.constraints?.riskTolerance,
    },
    credentialStatus: {
      status: evidenceModel.credentials?.status,
    },
  });

  return {
    objectType: "CandidateProfile",
    source: "matching_engine_v1_foundation",
    assessmentId:
      assessment.id ?? assessment.assessmentId ?? evidenceModel.assessmentId ?? null,
    engineVersion: "matchingEngineV1.foundation",
    diagnosticSourceVersion: directionDiagnostics.engineVersion ?? null,
    cvProfile,
    competencySignals,
    careerAnchors,
    financialReality,
    transitionConstraints,
    credentialStatus,
    aiDigitalSignals,
    sourceConfidence,
    missingInputs,
  };
}
