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

export const ALIGNMENT_STATUSES = {
  ALIGNED: "aligned",
  RELATED: "related",
  CROSS_SPINE: "cross_spine",
  WEAK_SPINE: "weak_spine",
  UNMAPPED: "unmapped",
  COMPOSITE_UNRESOLVED: "composite_unresolved",
};

export const ALIGNMENT_SEVERITIES = {
  NONE: "none",
  INFO: "info",
  WARNING: "warning",
  BLOCKING: "blocking",
};

export const ALIGNMENT_ACTIONS = {
  ALLOW: "allow",
  ALLOW_ADJACENT: "allow_adjacent",
  DOWNGRADE_TO_ADJACENT: "downgrade_to_adjacent",
  REQUIRE_BRIDGE_OR_CONDITION: "require_bridge_or_condition",
  BLOCK_DISPLAY: "block_display",
};

export const SPINE_MATCH_TYPES = {
  PRIMARY: "primary_spine",
  SECONDARY: "secondary_spine",
  WEAK: "weak_spine",
  CROSS_SPINE: "cross_spine",
  UNMAPPED: "unmapped",
  COMPOSITE: "composite",
};

export const COMPOSITE_RESOLUTION_STATUSES = {
  EXACT_MAPPING_NOT_NEEDED: "exact_mapping_not_needed",
  RESOLVED_FROM_PRIMARY_SPINE: "resolved_from_primary_spine",
  RESOLVED_FROM_SECONDARY_SPINE: "resolved_from_secondary_spine",
  UNRESOLVED_MULTIPLE_PLAUSIBLE: "unresolved_multiple_plausible",
  UNRESOLVED_NO_SPINE_SUPPORT: "unresolved_no_spine_support",
  UNRESOLVED_WEAK_SPINE_ONLY: "unresolved_weak_spine_only",
  UNRESOLVED_MISSING_SUPPORTING_FAMILIES:
    "unresolved_missing_supporting_families",
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
