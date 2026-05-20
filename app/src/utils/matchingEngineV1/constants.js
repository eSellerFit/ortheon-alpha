// app/src/utils/matchingEngineV1/constants.js
// Matching Engine v1 foundation constants.
//
// Bundle 1 scope:
// - Define shared labels for internal recommendation objects and QA.
// - Do not score.
// - Do not alter user-facing recommendations.

export const PATH_TYPES = {
  DIRECT: "Direct",
  ADJACENT: "Adjacent",
  BRIDGE_BASED: "Bridge-based",
  CONDITIONAL: "Conditional",
  SUPPRESSED: "Suppressed",
};

export const SUPPRESSION_REASONS = {
  MISSING_CORE_EVIDENCE: "missing_core_evidence",
  FALSE_POSITIVE_DOMINATED: "false_positive_dominated",
  CREDENTIAL_GATE_BLOCKED: "credential_gate_blocked",
  BRIDGE_NOT_NAMED: "bridge_not_named",
  CONDITION_NOT_NAMED: "condition_not_named",
  ASPIRATIONAL_ONLY: "aspirational_only",
  WEAK_CROSS_SPINE_FIT: "weak_cross_spine_fit",
  TITLE_INFLATION: "title_inflation",
  FINANCIAL_INFEASIBLE: "financial_infeasible",
  MISSING_CRITICAL_INPUT: "missing_critical_input",
};

export const AI_DIGITAL_TREATMENTS = {
  STANDALONE: "Standalone",
  MODIFIER: "Modifier",
  TOOLING: "Tooling",
  ASPIRATIONAL: "Aspirational",
};

export const CONFIDENCE_LABELS = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  INFERRED: "inferred",
  NEEDS_VALIDATION: "needs_validation",
};

export const EVIDENCE_SIGNAL_TYPES = {
  DIRECT_OWNERSHIP: "direct_ownership",
  SUPPORTING: "supporting",
  WEAK_NOISY: "weak_noisy",
  FALSE_POSITIVE: "false_positive",
  CREDENTIAL: "credential",
  DOMAIN: "domain",
  SCALE: "scale",
  RECENCY: "recency",
  MARKET_CREDIBILITY: "market_credibility",
  AI_DIGITAL: "ai_digital",
  FINANCIAL: "financial",
  CONSTRAINT: "constraint",
  PREFERENCE: "preference",
};

export const OWNERSHIP_LEVELS = {
  OWNED: "owned",
  LED: "led",
  MANAGED: "managed",
  CONTRIBUTED: "contributed",
  SUPPORTED: "supported",
  OBSERVED: "observed",
  USED: "used",
  PARTICIPATED: "participated",
  ASPIRATIONAL: "aspirational",
  UNKNOWN: "unknown",
};
