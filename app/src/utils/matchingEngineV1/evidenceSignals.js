// app/src/utils/matchingEngineV1/evidenceSignals.js
// Conservative EvidenceSignal builders for Matching Engine v1 diagnostics.
//
// Bundle 1 scope:
// - Build structural evidence signals from available assessment/diagnostic data.
// - Do not create final recommendations.
// - Do not over-infer ownership or family fit.

import {
  CONFIDENCE_LABELS,
  EVIDENCE_SIGNAL_TYPES,
  OWNERSHIP_LEVELS,
} from "./constants.js";

function asArray(value) {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function compact(values) {
  return asArray(values)
    .flatMap((value) => asArray(value))
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter(Boolean);
}

function normalizeText(value) {
  return compact(value).join(" ").toLowerCase();
}

function inferOwnershipLevel(text = "") {
  const normalized = text.toLowerCase();

  if (/\b(owned|accountable|p&l|profit and loss)\b/.test(normalized)) {
    return OWNERSHIP_LEVELS.OWNED;
  }

  if (/\b(led|headed|head of|director|vp|chief|cto|managed)\b/.test(normalized)) {
    return OWNERSHIP_LEVELS.LED;
  }

  if (/\b(supported|assisted|partnered|worked with)\b/.test(normalized)) {
    return OWNERSHIP_LEVELS.SUPPORTED;
  }

  if (/\b(used|tool|chatgpt)\b/.test(normalized)) {
    return OWNERSHIP_LEVELS.USED;
  }

  return OWNERSHIP_LEVELS.UNKNOWN;
}

function inferFalsePositiveRisk(text = "") {
  const normalized = text.toLowerCase();
  const risks = [];

  if (normalized.includes("platform")) risks.push("platform_keyword");
  if (normalized.includes("founder") || normalized.includes("startup")) {
    risks.push("founder_language");
  }
  if (normalized.includes("cto") || normalized.includes("chief technology")) {
    risks.push("cto_title_inflation");
  }
  if (normalized.includes("ai") || normalized.includes("chatgpt")) {
    risks.push("ai_over_interpretation");
  }
  if (normalized.includes("product")) risks.push("product_language");
  if (normalized.includes("marketplace")) risks.push("marketplace_language");

  return risks;
}

export function createEvidenceSignal({
  signalType,
  source,
  strength = "weak",
  recency = "unknown",
  ownershipLevel = OWNERSHIP_LEVELS.UNKNOWN,
  domain = null,
  scale = null,
  confidence = CONFIDENCE_LABELS.LOW,
  relatedFamilyIds = [],
  falsePositiveRisk = [],
  summary = "",
  raw = null,
} = {}) {
  return {
    objectType: "EvidenceSignal",
    signalType,
    source,
    strength,
    recency,
    ownershipLevel,
    domain,
    scale,
    confidence,
    relatedFamilyIds,
    falsePositiveRisk,
    summary,
    raw,
  };
}

function buildCareerEvidenceSignals(candidateProfile = {}) {
  const cvProfile = candidateProfile.cvProfile || {};
  const careerEvidence = cvProfile.normalizedCareerEvidence || {};
  const signals = [];

  const summaryText = normalizeText([
    cvProfile.careerSummary,
    careerEvidence.careerSummary,
    careerEvidence.leadershipScope,
  ]);

  if (summaryText) {
    signals.push(
      createEvidenceSignal({
        signalType: EVIDENCE_SIGNAL_TYPES.SUPPORTING,
        source: "cv_profile",
        strength: "moderate",
        recency: "unknown",
        ownershipLevel: inferOwnershipLevel(summaryText),
        domain: compact([careerEvidence.industries, cvProfile.industries]),
        scale: careerEvidence.leadershipScope || cvProfile.leadershipScope || null,
        confidence: candidateProfile.sourceConfidence?.cvProfile,
        falsePositiveRisk: inferFalsePositiveRisk(summaryText),
        summary: cvProfile.careerSummary || careerEvidence.careerSummary || "",
        raw: {
          roleTitles: careerEvidence.roleTitles,
          senioritySignal: careerEvidence.senioritySignal,
          leadershipScope: careerEvidence.leadershipScope,
        },
      })
    );
  }

  compact(careerEvidence.domainSignals).forEach((domain) => {
    signals.push(
      createEvidenceSignal({
        signalType: EVIDENCE_SIGNAL_TYPES.DOMAIN,
        source: "cv_domain_signals",
        strength: "moderate",
        domain,
        confidence: CONFIDENCE_LABELS.INFERRED,
        falsePositiveRisk: inferFalsePositiveRisk(String(domain)),
        summary: String(domain),
        raw: domain,
      })
    );
  });

  compact(careerEvidence.achievements).forEach((achievement) => {
    signals.push(
      createEvidenceSignal({
        signalType: EVIDENCE_SIGNAL_TYPES.SUPPORTING,
        source: "cv_achievement",
        strength: "moderate",
        ownershipLevel: inferOwnershipLevel(String(achievement)),
        confidence: CONFIDENCE_LABELS.INFERRED,
        falsePositiveRisk: inferFalsePositiveRisk(String(achievement)),
        summary: String(achievement),
        raw: achievement,
      })
    );
  });

  return signals;
}

function buildCompetencyEvidenceSignals(candidateProfile = {}) {
  return (candidateProfile.competencySignals || []).map((signal) =>
    createEvidenceSignal({
      signalType: EVIDENCE_SIGNAL_TYPES.SUPPORTING,
      source: signal.source || "competency_signal",
      strength: signal.signalStrength || "weak",
      ownershipLevel: inferOwnershipLevel(signal.evidence || ""),
      confidence: candidateProfile.sourceConfidence?.competencySignals,
      falsePositiveRisk: inferFalsePositiveRisk(signal.evidence || signal.competencyName || ""),
      summary: signal.evidence || signal.competencyName || "",
      raw: signal,
    })
  );
}

function buildCredentialEvidenceSignals(candidateProfile = {}) {
  const credentials = candidateProfile.credentialStatus || {};

  if (!credentials.detectedSignals?.length) {
    return [];
  }

  return credentials.detectedSignals.map((credential) =>
    createEvidenceSignal({
      signalType: EVIDENCE_SIGNAL_TYPES.CREDENTIAL,
      source: "credential_detection",
      strength: "moderate",
      confidence: CONFIDENCE_LABELS.INFERRED,
      summary: credential,
      raw: credential,
    })
  );
}

function buildAiEvidenceSignals(candidateProfile = {}) {
  const aiDigitalSignals = candidateProfile.aiDigitalSignals || {};

  if (!aiDigitalSignals.signals?.length) {
    return [];
  }

  return aiDigitalSignals.signals.map((signal) =>
    createEvidenceSignal({
      signalType: EVIDENCE_SIGNAL_TYPES.AI_DIGITAL,
      source: "ai_digital_detection",
      strength: "weak",
      ownershipLevel: OWNERSHIP_LEVELS.UNKNOWN,
      confidence: aiDigitalSignals.confidence || CONFIDENCE_LABELS.INFERRED,
      falsePositiveRisk: inferFalsePositiveRisk(String(signal)),
      summary: String(signal),
      raw: {
        signal,
        treatment: aiDigitalSignals.treatment,
      },
    })
  );
}

function buildFinancialAndConstraintSignals(candidateProfile = {}) {
  const signals = [];

  if (Object.keys(candidateProfile.financialReality || {}).length > 0) {
    signals.push(
      createEvidenceSignal({
        signalType: EVIDENCE_SIGNAL_TYPES.FINANCIAL,
        source: "assessment_financial_reality",
        strength: "moderate",
        confidence: candidateProfile.sourceConfidence?.financialReality,
        summary: "Financial reality input exists.",
        raw: candidateProfile.financialReality,
      })
    );
  }

  if (Object.keys(candidateProfile.transitionConstraints || {}).length > 0) {
    signals.push(
      createEvidenceSignal({
        signalType: EVIDENCE_SIGNAL_TYPES.CONSTRAINT,
        source: "assessment_transition_constraints",
        strength: "moderate",
        confidence: candidateProfile.sourceConfidence?.transitionConstraints,
        summary: "Transition constraint input exists.",
        raw: candidateProfile.transitionConstraints,
      })
    );
  }

  return signals;
}

export function buildEvidenceSignals({
  candidateProfile = {},
} = {}) {
  return [
    ...buildCareerEvidenceSignals(candidateProfile),
    ...buildCompetencyEvidenceSignals(candidateProfile),
    ...buildCredentialEvidenceSignals(candidateProfile),
    ...buildAiEvidenceSignals(candidateProfile),
    ...buildFinancialAndConstraintSignals(candidateProfile),
  ];
}
