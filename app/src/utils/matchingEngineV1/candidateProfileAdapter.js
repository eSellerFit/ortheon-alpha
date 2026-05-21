// app/src/utils/matchingEngineV1/candidateProfileAdapter.js
// Build the conceptual CandidateProfile used by Matching Engine v1 diagnostics.
//
// Bundle 1 scope:
// - Normalize currently available assessment and v1.4 evidence model data.
// - Track missing inputs internally.
// - Do not score or invent data.

import { AI_DIGITAL_TREATMENTS, CONFIDENCE_LABELS } from "./constants.js";

const UNKNOWN = "unknown";

const AI_RELATIONSHIP_TYPES = {
  AI_BUILDER: "ai_builder",
  AI_TRANSFORMATION_OWNER: "ai_transformation_owner",
  AI_GOVERNANCE_RISK_OWNER: "ai_governance_risk_owner",
  AI_TOOL_USER: "ai_tool_user",
  ASPIRATIONAL_OR_NONE: "aspirational_or_none",
};

const CANONICAL_SPINE_BY_DETECTOR_ID = {
  people_hr_talent: ["people_organization", "workforce_intelligence"],
  marketing_brand_growth: ["marketing_growth"],
  sales_business_development: ["commercial_sales_partnerships"],
  operations_process_execution: ["operations_delivery"],
  finance_accounting_risk: ["finance_capital", "risk_compliance_governance"],
  legal_compliance: ["risk_compliance_governance", "skilled_trade_licensed"],
  education_training_learning: ["mission_public_education", "people_organization"],
  healthcare_care: ["operations_delivery", "skilled_trade_licensed"],
  creative_content_design: ["product_technology", "marketing_growth"],
  consulting_advisory: ["strategy_advisory", "independent_practice"],
  entrepreneurship_founder_operator: [
    "founder_builder_operator",
    "independent_practice",
  ],
  skilled_trade_technical_craft: ["skilled_trade_licensed"],
  it_enterprise_systems: ["it_enterprise_systems"],
  digital_transformation_automation_ai: ["digital_transformation_ai"],
  data_analytics_bi: ["data_analytics_bi"],
  product_digital_platform: ["product_technology"],
  cybersecurity_technology_risk: [
    "it_enterprise_systems",
    "risk_compliance_governance",
  ],
};

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
      aiRelationshipType: AI_RELATIONSHIP_TYPES.ASPIRATIONAL_OR_NONE,
      confidence: CONFIDENCE_LABELS.LOW,
      signals: [],
    };
  }

  const deploymentTerms = [
    "ai agent",
    "ai agents",
    "ai enablement",
    "ai transformation",
    "machine learning",
    "ml",
    "llm",
    "genai",
    "generative ai",
    "rag",
    "automation",
    "digital transformation",
  ];

  const toolingTerms = [
    "chatgpt",
    "openai",
    "ollama",
    "langchain",
    "llamaindex",
  ];

  const ownershipTerms = [
    "owned",
    "led",
    "built",
    "deployed",
    "implemented",
    "launched",
    "managed",
    "transformed",
    "adoption",
    "enablement",
  ];

  const governanceTerms = [
    "ai governance",
    "responsible ai",
    "privacy",
    "data governance",
    "model governance",
    "risk",
    "policy",
    "regulatory",
    "compliance",
  ];

  const matchedDeploymentTerms = deploymentTerms.filter((term) =>
    text.includes(term)
  );
  const matchedToolingTerms = toolingTerms.filter((term) => text.includes(term));
  const hasOwnershipTerm = ownershipTerms.some((term) => text.includes(term));
  const hasBuilderTerm = /\b(built|engineered|developed|architecture|architected|deployed|implemented)\b/.test(text);
  const hasGovernanceTerm = governanceTerms.some((term) => text.includes(term));

  if (hasGovernanceTerm && text.includes("ai")) {
    return {
      treatment: AI_DIGITAL_TREATMENTS.MODIFIER,
      aiRelationshipType: AI_RELATIONSHIP_TYPES.AI_GOVERNANCE_RISK_OWNER,
      confidence: CONFIDENCE_LABELS.INFERRED,
      signals: governanceTerms.filter((term) => text.includes(term)),
    };
  }

  if (matchedDeploymentTerms.length > 0) {
    return {
      treatment: AI_DIGITAL_TREATMENTS.MODIFIER,
      aiRelationshipType: hasOwnershipTerm
        ? hasBuilderTerm
          ? AI_RELATIONSHIP_TYPES.AI_BUILDER
          : AI_RELATIONSHIP_TYPES.AI_TRANSFORMATION_OWNER
        : AI_RELATIONSHIP_TYPES.AI_TOOL_USER,
      confidence: CONFIDENCE_LABELS.INFERRED,
      signals: matchedDeploymentTerms,
    };
  }

  if (matchedToolingTerms.length > 0) {
    return {
      treatment: AI_DIGITAL_TREATMENTS.TOOLING,
      aiRelationshipType: AI_RELATIONSHIP_TYPES.AI_TOOL_USER,
      confidence: CONFIDENCE_LABELS.INFERRED,
      signals: matchedToolingTerms,
    };
  }

  return {
    treatment: AI_DIGITAL_TREATMENTS.ASPIRATIONAL,
    aiRelationshipType: AI_RELATIONSHIP_TYPES.ASPIRATIONAL_OR_NONE,
    confidence: CONFIDENCE_LABELS.LOW,
    signals: [],
  };
}

function normalizeDetectedSpine(spine = {}, matchBucket) {
  const detectorSpineId = spine.id ?? spine.spineId ?? null;

  return {
    detectorSpineId,
    detectorSpineLabel: spine.label ?? spine.spineName ?? detectorSpineId,
    canonicalSpineIds: CANONICAL_SPINE_BY_DETECTOR_ID[detectorSpineId] || [],
    score: spine.score ?? null,
    matched: spine.matched || [],
    matchBucket,
  };
}

function normalizeCareerSpines(careerSpines = {}) {
  const primaryCareerSpines = (careerSpines.primary || []).map((spine) =>
    normalizeDetectedSpine(spine, "primary")
  );
  const secondaryCareerSpines = (careerSpines.secondary || []).map((spine) =>
    normalizeDetectedSpine(spine, "secondary")
  );
  const weakCareerSpines = (careerSpines.weakSignals || []).map((spine) =>
    normalizeDetectedSpine(spine, "weak")
  );

  const careerSpineScores = Object.fromEntries(
    [
      ...primaryCareerSpines,
      ...secondaryCareerSpines,
      ...weakCareerSpines,
    ]
      .filter((spine) => spine.detectorSpineId)
      .map((spine) => [
        spine.detectorSpineId,
        {
          score: spine.score,
          canonicalSpineIds: spine.canonicalSpineIds,
          matchBucket: spine.matchBucket,
        },
      ])
  );

  return {
    careerSpines,
    primaryCareerSpines,
    secondaryCareerSpines,
    weakCareerSpines,
    careerSpineScores,
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
  const normalizedCareerSpines = normalizeCareerSpines(
    directionDiagnostics.careerSpines || {}
  );

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
    ...normalizedCareerSpines,
  };
}
