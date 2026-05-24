#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Snapshot Debug Runner
 *
 * Purpose:
 * Run the local v3.1 snapshot debug harness from Node and print a compact
 * validation summary.
 *
 * Bundle 4 rule:
 * - Local debug runner only.
 * - No production imports.
 * - No UI integration.
 * - No Firestore reads/writes.
 * - No AI calls.
 */

import { runSnapshotDebugV31 } from "../../src/v31/debug/snapshotDebugHarnessV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";

const result = runSnapshotDebugV31(SAMPLE_ASSESSMENT_V31);

const summary = {
  passed: result.validation.passed,
  assessmentId: result.snapshot.assessmentId,
  version: result.snapshot.version,
  source: result.snapshot.sourceAssessment.source,
  currentRole: result.snapshot.identity.currentRole,
  anchorScoreCount: Object.keys(result.snapshot.anchors.scores || {}).length,
  hasFinancialReality: Boolean(result.snapshot.financialReality),
  hasTransitionConstraints: Boolean(result.snapshot.transitionConstraints),
  hasProfessionalCredentials: Boolean(result.snapshot.professionalCredentials),
  hasCvProfile: Boolean(result.snapshot.cvProfile),
  failedChecks: result.validation.failedChecks.map((check) => ({
    id: check.id,
    message: check.message,
  })),
};

console.log(JSON.stringify(summary, null, 2));

if (!result.validation.passed) {
  process.exitCode = 1;
}
