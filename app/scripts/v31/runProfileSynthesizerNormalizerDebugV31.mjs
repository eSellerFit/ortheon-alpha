#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer Normalizer Debug Runner
 *
 * Purpose:
 * Test raw object and raw JSON-string output normalization for
 * SynthesizedProfileV31.
 *
 * Bundle 7 rule:
 * - Local debug runner only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No UI integration.
 */

import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";
import { normalizeProfileSynthesizerOutputV31 } from "../../src/v31/normalizers/profileSynthesizerOutputNormalizerV31.js";

const rawObjectResult = normalizeProfileSynthesizerOutputV31(
  MOCK_SYNTHESIZED_PROFILE_V31,
  {
    fallbackAssessmentId: "sample-assessment-v31",
  }
);

const rawJsonResult = normalizeProfileSynthesizerOutputV31(
  JSON.stringify(MOCK_SYNTHESIZED_PROFILE_V31),
  {
    fallbackAssessmentId: "sample-assessment-v31",
  }
);

const malformedJsonResult = normalizeProfileSynthesizerOutputV31(
  "{not valid json",
  {
    fallbackAssessmentId: "sample-assessment-v31",
  }
);

const summary = {
  rawObject: {
    passed: rawObjectResult.validation.passed,
    issueCount: rawObjectResult.validation.issueCount,
    errorCount: rawObjectResult.errors.length,
    parsedFromString: rawObjectResult.parsedFromString,
  },
  rawJsonString: {
    passed: rawJsonResult.validation.passed,
    issueCount: rawJsonResult.validation.issueCount,
    errorCount: rawJsonResult.errors.length,
    parsedFromString: rawJsonResult.parsedFromString,
  },
  malformedJsonString: {
    passed: malformedJsonResult.validation.passed,
    issueCount: malformedJsonResult.validation.issueCount,
    errorCount: malformedJsonResult.errors.length,
    parsedFromString: malformedJsonResult.parsedFromString,
    firstErrorType: malformedJsonResult.errors[0]?.type || null,
  },
};

console.log(JSON.stringify(summary, null, 2));

if (!rawObjectResult.validation.passed || !rawJsonResult.validation.passed) {
  process.exitCode = 1;
}
