/**
 * Ortheon MVP Cut v3.1 — Snapshot Debug Harness
 *
 * Purpose:
 * Run buildAssessmentSnapshotV31() against local sample or supplied assessment
 * data and return a simple debug result.
 *
 * Bundle 3 rule:
 * - Debug-only utility.
 * - No production imports.
 * - No UI integration.
 * - No Firestore reads/writes.
 */

import { buildAssessmentSnapshotV31 } from "../adapters/assessmentSnapshotAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "./sampleAssessmentV31.js";

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function validateSnapshotShape(snapshot) {
  const checks = [
    {
      id: "version",
      passed: snapshot.version === "v3.1",
      message: "Snapshot version should be v3.1.",
    },
    {
      id: "assessmentId",
      passed: hasValue(snapshot.assessmentId),
      message: "Snapshot should include assessmentId.",
    },
    {
      id: "sourceAssessment",
      passed: hasValue(snapshot.sourceAssessment?.source),
      message: "Snapshot should include sourceAssessment.source.",
    },
    {
      id: "identity.currentRole",
      passed: hasValue(snapshot.identity?.currentRole),
      message: "Snapshot should include identity.currentRole.",
    },
    {
      id: "anchors.scores",
      passed: hasValue(snapshot.anchors?.scores),
      message: "Snapshot should include normalized anchor scores.",
    },
    {
      id: "financialReality",
      passed: hasValue(snapshot.financialReality),
      message: "Snapshot should include financialReality when source has it.",
    },
    {
      id: "transitionConstraints",
      passed: hasValue(snapshot.transitionConstraints),
      message:
        "Snapshot should include transitionConstraints when source has them.",
    },
    {
      id: "professionalCredentials",
      passed: hasValue(snapshot.professionalCredentials),
      message:
        "Snapshot should include professionalCredentials when source has them.",
    },
    {
      id: "cvProfile",
      passed: hasValue(snapshot.cvProfile),
      message: "Snapshot should include cvProfile when source has it.",
    },
    {
      id: "rawAssessment",
      passed: hasValue(snapshot.rawAssessment),
      message: "Snapshot should preserve rawAssessment.",
    },
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks,
    failedChecks: checks.filter((check) => !check.passed),
  };
}

/**
 * Build and validate an AssessmentSnapshotV31 for local debugging.
 *
 * @param {Object} assessment Optional current-shape assessment object.
 * @returns {{snapshot: Object, validation: Object}}
 */
export function runSnapshotDebugV31(assessment = SAMPLE_ASSESSMENT_V31) {
  const snapshot = buildAssessmentSnapshotV31(assessment);
  const validation = validateSnapshotShape(snapshot);

  return {
    snapshot,
    validation,
  };
}

/**
 * Convenience export for checking the bundled sample fixture.
 * Not used by production flow.
 */
export const SAMPLE_SNAPSHOT_DEBUG_RESULT_V31 = Object.freeze(
  runSnapshotDebugV31(SAMPLE_ASSESSMENT_V31)
);
