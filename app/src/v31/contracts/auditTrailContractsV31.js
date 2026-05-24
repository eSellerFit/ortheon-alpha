/**
 * Ortheon MVP Cut v3.1 — Audit Trail Contracts
 *
 * AuditTrailEventV31 makes the future engine explainable and reviewable.
 *
 * Purpose:
 * - Track what happened at each v3.1 stage
 * - Preserve high-level input/output references
 * - Capture warnings and quality notes
 * - Support debugging and future B2B credibility
 *
 * Bundle 1 rule:
 * - Contract only.
 * - No logging implementation.
 * - No Firestore writes.
 * - No production imports.
 */

/**
 * @typedef {"snapshot"|"profile_synthesis"|"transferability_mapping"|"financial_modeling"|"hard_constraints"|"hypothesis_generation"|"portfolio_composition"|"validation"} AuditTrailStageV31
 */

/**
 * @typedef {"system"|"ai"|"deterministic_guardrail"|"human_reviewer"} AuditTrailActorV31
 */

/**
 * @typedef {Object} AuditTrailWarningV31
 * @property {string} message
 * @property {"low"|"medium"|"high"|"blocking"} severity
 * @property {string|null} relatedDirectionId
 * @property {string|null} relatedField
 */

/**
 * @typedef {Object} AuditTrailEventV31
 * @property {"v3.1"} version
 * @property {string} eventId
 * @property {string} assessmentId
 * @property {string} timestamp
 * @property {AuditTrailStageV31} stage
 * @property {AuditTrailActorV31} actor
 * @property {string|null} inputRef
 * @property {string|null} outputRef
 * @property {string} summary
 * @property {AuditTrailWarningV31[]} warnings
 * @property {Object|null} metadata
 */

/**
 * Empty audit trail event helper for documentation/testing.
 * Not used by production flow.
 */
export const AUDIT_TRAIL_EVENT_V31_EMPTY = Object.freeze({
  version: "v3.1",
  eventId: "",
  assessmentId: "",
  timestamp: "",
  stage: "snapshot",
  actor: "system",
  inputRef: null,
  outputRef: null,
  summary: "",
  warnings: [],
  metadata: null,
});
