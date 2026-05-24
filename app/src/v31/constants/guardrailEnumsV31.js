/**
 * Ortheon MVP Cut v3.1 guardrail-related enums.
 *
 * These constants define deterministic guardrail vocabulary.
 * They are data-contract helpers only.
 *
 * Bundle 1 rule:
 * - Do not import this file into production flow yet.
 */

export const CONSTRAINT_TYPES_V31 = Object.freeze({
  LICENSE: "license",
  CREDENTIAL: "credential",
  WORK_AUTHORIZATION: "work_authorization",
  GEOGRAPHY: "geography",
  FINANCIAL: "financial",
  TIME: "time",
  EDUCATION: "education",
  EXPERIENCE: "experience",
  HEALTH_SAFETY: "health_safety",
  OTHER: "other",
});

export const GUARDRAIL_SEVERITY_V31 = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  BLOCKING: "blocking",
});

export const FINANCIAL_VIABILITY_V31 = Object.freeze({
  VIABLE: "viable",
  TIGHT: "tight",
  NOT_VIABLE: "not_viable",
  UNKNOWN: "unknown",
});

export const RAMP_PATTERNS_V31 = Object.freeze({
  STABLE: "stable",
  DIP_THEN_RECOVER: "dip_then_recover",
  LONG_RAMP: "long_ramp",
  UNCERTAIN: "uncertain",
});

export const VALIDATION_ISSUE_TYPES_V31 = Object.freeze({
  UNSUPPORTED_CLAIM: "unsupported_claim",
  BLOCKED_DIRECTION: "blocked_direction",
  FINANCIAL_CONFLICT: "financial_conflict",
  CREDENTIAL_CONFLICT: "credential_conflict",
  FAKE_PRECISION: "fake_precision",
  TOO_MANY_WEAK_DIRECTIONS: "too_many_weak_directions",
  MISSING_EVIDENCE: "missing_evidence",
  MISSING_REQUIRED_INPUT: "missing_required_input",
});
