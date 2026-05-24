/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer Output Normalizer
 *
 * Purpose:
 * Convert raw Profile Synthesizer output into a normalized
 * SynthesizedProfileV31-shaped object and validate it.
 *
 * This prepares the system for a future real AI call without adding the AI call yet.
 *
 * Bundle 7 rule:
 * - Local parser / normalizer only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import { validateSynthesizedProfileV31 } from "../validators/profileSynthesizerValidatorV31.js";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringOrNull(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function stringOrEmpty(value) {
  return stringOrNull(value) || "";
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function objectOrEmpty(value) {
  return isObject(value) ? value : {};
}

function normalizeEvidenceArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

function normalizeCompetencyItem(item, fallbackStrength = "unproven") {
  const source = objectOrEmpty(item);

  return {
    competencyId:
      source.competencyId === undefined ? null : source.competencyId,
    competencyName: stringOrEmpty(source.competencyName),
    signalStrength: stringOrNull(source.signalStrength) || fallbackStrength,
    evidence: normalizeEvidenceArray(source.evidence),
    reason: stringOrNull(source.reason),
  };
}

function normalizeEvidenceByCompetency(value) {
  const source = objectOrEmpty(value);

  return Object.entries(source).reduce((acc, [key, evidence]) => {
    acc[key] = normalizeEvidenceArray(evidence);
    return acc;
  }, {});
}

function parseRawOutput(rawOutput) {
  if (typeof rawOutput === "string") {
    try {
      return {
        parsed: JSON.parse(rawOutput),
        parseError: null,
      };
    } catch (error) {
      return {
        parsed: null,
        parseError: error,
      };
    }
  }

  return {
    parsed: rawOutput,
    parseError: null,
  };
}

function buildFallbackProfile(fallbackAssessmentId = "") {
  return {
    version: "v3.1",
    stage: "profile_synthesis",
    assessmentId: fallbackAssessmentId,
    profileSummary: {
      oneParagraphProfile: "",
      careerStage: null,
      senioritySignal: null,
      marketIdentity: null,
      dominantCareerPattern: null,
    },
    careerCapital: {
      functionalExperience: [],
      industryExperience: [],
      leadershipScope: null,
      operatingContexts: [],
      domainAssets: [],
      credibilitySignals: [],
      distinctiveAssets: [],
    },
    competencySignals: {
      strongestCompetencies: [],
      supportingCompetencies: [],
      weakOrUnprovenCompetencies: [],
      evidenceByCompetency: {},
    },
    anchorPattern: {
      dominantAnchors: [],
      secondaryAnchors: [],
      tensions: [],
      likelyEnergizers: [],
      likelyDrainers: [],
    },
    transitionContext: {
      urgency: null,
      flexibility: null,
      riskLevel: null,
      constraintsSummary: null,
      financialPressure: null,
      bridgeNeeds: [],
    },
    profileRisks: [],
    missingInformation: [],
    evidenceLimitations: [],
  };
}

/**
 * Normalize raw output into SynthesizedProfileV31 shape.
 *
 * @param {Object|string} rawOutput Raw object or JSON string.
 * @param {Object} options
 * @param {string} options.fallbackAssessmentId
 * @returns {{profile: Object|null, validation: Object, errors: Array<Object>, parsedFromString: boolean}}
 */
export function normalizeProfileSynthesizerOutputV31(rawOutput, options = {}) {
  const fallbackAssessmentId = stringOrEmpty(options.fallbackAssessmentId);
  const parsedResult = parseRawOutput(rawOutput);
  const parsedFromString = typeof rawOutput === "string";

  if (parsedResult.parseError) {
    const profile = buildFallbackProfile(fallbackAssessmentId);
    const validation = validateSynthesizedProfileV31(profile);

    return {
      profile,
      validation,
      parsedFromString,
      errors: [
        {
          type: "json_parse_error",
          message: parsedResult.parseError.message,
        },
      ],
    };
  }

  const source = objectOrEmpty(parsedResult.parsed);
  const fallbackProfile = buildFallbackProfile(fallbackAssessmentId);

  const normalizedProfile = {
    version: source.version === "v3.1" ? "v3.1" : fallbackProfile.version,
    stage:
      source.stage === "profile_synthesis"
        ? "profile_synthesis"
        : fallbackProfile.stage,
    assessmentId:
      stringOrNull(source.assessmentId) || fallbackProfile.assessmentId,

    profileSummary: {
      oneParagraphProfile: stringOrEmpty(
        source.profileSummary?.oneParagraphProfile
      ),
      careerStage: stringOrNull(source.profileSummary?.careerStage),
      senioritySignal: stringOrNull(source.profileSummary?.senioritySignal),
      marketIdentity: stringOrNull(source.profileSummary?.marketIdentity),
      dominantCareerPattern: stringOrNull(
        source.profileSummary?.dominantCareerPattern
      ),
    },

    careerCapital: {
      functionalExperience: arrayOrEmpty(
        source.careerCapital?.functionalExperience
      ),
      industryExperience: arrayOrEmpty(
        source.careerCapital?.industryExperience
      ),
      leadershipScope: stringOrNull(source.careerCapital?.leadershipScope),
      operatingContexts: arrayOrEmpty(source.careerCapital?.operatingContexts),
      domainAssets: arrayOrEmpty(source.careerCapital?.domainAssets),
      credibilitySignals: arrayOrEmpty(
        source.careerCapital?.credibilitySignals
      ),
      distinctiveAssets: arrayOrEmpty(source.careerCapital?.distinctiveAssets),
    },

    competencySignals: {
      strongestCompetencies: arrayOrEmpty(
        source.competencySignals?.strongestCompetencies
      ).map((item) => normalizeCompetencyItem(item, "strong")),
      supportingCompetencies: arrayOrEmpty(
        source.competencySignals?.supportingCompetencies
      ).map((item) => normalizeCompetencyItem(item, "moderate")),
      weakOrUnprovenCompetencies: arrayOrEmpty(
        source.competencySignals?.weakOrUnprovenCompetencies
      ).map((item) => normalizeCompetencyItem(item, "unproven")),
      evidenceByCompetency: normalizeEvidenceByCompetency(
        source.competencySignals?.evidenceByCompetency
      ),
    },

    anchorPattern: {
      dominantAnchors: arrayOrEmpty(source.anchorPattern?.dominantAnchors),
      secondaryAnchors: arrayOrEmpty(source.anchorPattern?.secondaryAnchors),
      tensions: arrayOrEmpty(source.anchorPattern?.tensions),
      likelyEnergizers: arrayOrEmpty(source.anchorPattern?.likelyEnergizers),
      likelyDrainers: arrayOrEmpty(source.anchorPattern?.likelyDrainers),
    },

    transitionContext: {
      urgency: stringOrNull(source.transitionContext?.urgency),
      flexibility: stringOrNull(source.transitionContext?.flexibility),
      riskLevel: stringOrNull(source.transitionContext?.riskLevel),
      constraintsSummary: stringOrNull(
        source.transitionContext?.constraintsSummary
      ),
      financialPressure: stringOrNull(
        source.transitionContext?.financialPressure
      ),
      bridgeNeeds: arrayOrEmpty(source.transitionContext?.bridgeNeeds),
    },

    profileRisks: arrayOrEmpty(source.profileRisks),
    missingInformation: arrayOrEmpty(source.missingInformation),
    evidenceLimitations: arrayOrEmpty(source.evidenceLimitations),
  };

  const validation = validateSynthesizedProfileV31(normalizedProfile);

  return {
    profile: normalizedProfile,
    validation,
    parsedFromString,
    errors: [],
  };
}
