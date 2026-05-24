/**
 * Ortheon MVP Cut v3.1 direction-related enums.
 *
 * These constants define the vocabulary for v3.1 direction outputs.
 * They are data-contract helpers only.
 *
 * Bundle 1 rule:
 * - Do not import this file into production flow yet.
 * - Do not connect this file to ResultsStep, scoring.js, directionEngineV14,
 *   PdfReport, CareerDirectionMap, or featureFlags.
 */

export const ROUTE_TYPES_V31 = Object.freeze({
  DIRECT: "direct",
  BRIDGE: "bridge",
  RETRAINING: "retraining",
  CREDENTIAL_REQUIRED: "credential_required",
  PORTFOLIO: "portfolio",
  ENTREPRENEURIAL: "entrepreneurial",
  EXPLORATORY: "exploratory",
});

export const WORK_MODELS_V31 = Object.freeze({
  EMPLOYMENT: "employment",
  FRACTIONAL: "fractional",
  CONSULTING: "consulting",
  ENTREPRENEURIAL: "entrepreneurial",
  HYBRID_PORTFOLIO: "hybrid_portfolio",
  NONPROFIT: "nonprofit",
  PUBLIC_SECTOR: "public_sector",
  EDUCATION: "education",
});

export const SENIORITY_COMPLEXITY_LEVELS_V31 = Object.freeze({
  ENTRY_BRIDGE: "entry_bridge",
  INDIVIDUAL_CONTRIBUTOR: "individual_contributor",
  SENIOR_SPECIALIST: "senior_specialist",
  MANAGER_LEAD: "manager_lead",
  DIRECTOR_HEAD_OF: "director_head_of",
  EXECUTIVE: "executive",
  FOUNDER_OPERATOR: "founder_operator",
  ADVISOR_EXPERT: "advisor_expert",
});

export const CREDIBILITY_LEVELS_V31 = Object.freeze({
  CREDIBLE_NOW: "credible_now",
  CREDIBLE_WITH_PACKAGING: "credible_with_packaging",
  BRIDGE_NEEDED: "bridge_needed",
  STRETCH: "stretch",
  EXPLORATORY: "exploratory",
  NOT_CREDIBLE_NOW: "not_credible_now",
});

export const RECOMMENDATION_TYPES_V31 = Object.freeze({
  PRIMARY: "primary",
  SECONDARY: "secondary",
  BRIDGE: "bridge",
  EXPLORATORY: "exploratory",
  NOT_RECOMMENDED: "not_recommended",
});

export const CONFIDENCE_LEVELS_V31 = Object.freeze({
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  INSUFFICIENT_DATA: "insufficient_data",
});
