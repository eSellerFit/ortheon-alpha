// app/src/utils/matchingEngineV1/foundationDiagnostics.js
// Orchestrates Matching Engine v1 foundation diagnostics.
//
// Bundle 1 scope:
// - Build internal objects from current assessment and v1.4 diagnostics.
// - Run structural report QA.
// - Do not feed scoring or live report recommendations.

import { buildCandidateProfile } from "./candidateProfileAdapter.js";
import { buildEvidenceSignals } from "./evidenceSignals.js";
import { recommendationCandidateFromV14Diagnostic } from "./recommendationObjects.js";
import { runReportQa } from "./reportQa.js";

export function buildMatchingEngineFoundationDiagnostics({
  assessment = {},
  directionDiagnostics = {},
} = {}) {
  const candidateProfile = buildCandidateProfile({
    assessment,
    evidenceModel: directionDiagnostics.evidenceModel || {},
    directionDiagnostics,
  });

  const evidenceSignals = buildEvidenceSignals({
    candidateProfile,
    directionDiagnostics,
  });

  const diagnosticItems = [
    ...(directionDiagnostics.recommendations || []),
    ...(directionDiagnostics.suppressedDirections || []),
  ];

  const recommendationCandidates = diagnosticItems.map((item) =>
    recommendationCandidateFromV14Diagnostic({
      item,
      evidenceSignals,
    })
  );

  const reportQaResult = runReportQa({ recommendationCandidates });

  return {
    objectType: "MatchingEngineV1FoundationDiagnostics",
    diagnosticOnly: true,
    engineVersion: "matchingEngineV1.foundation.bundle1",
    sourceEngineVersion: directionDiagnostics.engineVersion ?? null,
    candidateProfile,
    evidenceSignals,
    recommendationCandidates,
    reportQaResult,
    notes: [
      "Foundation diagnostics are internal/debug-only.",
      "Canonical family IDs are not faked from legacy role-library IDs.",
      "Output does not feed current scoring or live report recommendations.",
    ],
  };
}

export const matchingEngineV1Foundation = {
  buildMatchingEngineFoundationDiagnostics,
};
