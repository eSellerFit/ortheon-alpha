#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 - Portfolio Composer API Handler Debug Runner
 *
 * Purpose:
 * Test api/portfolio-composer-v31.js directly from Node without a local dev
 * server.
 *
 * Bundle 13C rule:
 * - Local debug runner only.
 * - Calls the isolated API handler directly.
 * - No UI integration.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import fs from "node:fs";
import path from "node:path";
import handler from "../../api/portfolio-composer-v31.js";
import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildPortfolioComposerInputV31 } from "../../src/v31/adapters/portfolioComposerInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";
import { MOCK_TRANSFERABILITY_MAP_V31 } from "../../src/v31/debug/mockTransferabilityMapV31.js";
import { MOCK_DIRECTION_HYPOTHESES_V31 } from "../../src/v31/debug/mockDirectionHypothesesV31.js";
import {
  buildFinancialModelV31,
  buildGuardrailValidationV31,
  evaluateHardConstraintsV31,
  validateHypothesisQualityOverDiversityV31,
} from "../../src/v31/guardrails/index.js";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return {
      loaded: false,
      path: envPath,
    };
  }

  const content = fs.readFileSync(envPath, "utf8");

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) return;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });

  return {
    loaded: true,
    path: envPath,
  };
}

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

const envLoadResult = loadEnvLocal();

const snapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);
const financialModel = buildFinancialModelV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31
);
const hardConstraints = evaluateHardConstraintsV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31
);
const guardrailValidation = buildGuardrailValidationV31(
  snapshot,
  MOCK_DIRECTION_HYPOTHESES_V31,
  financialModel,
  hardConstraints
);
const qualityOverDiversityValidation =
  validateHypothesisQualityOverDiversityV31(
    MOCK_DIRECTION_HYPOTHESES_V31,
    guardrailValidation
  );

const portfolioComposerInput = buildPortfolioComposerInputV31({
  assessmentSnapshot: snapshot,
  synthesizedProfile: MOCK_SYNTHESIZED_PROFILE_V31,
  transferabilityMap: MOCK_TRANSFERABILITY_MAP_V31,
  directionHypotheses: MOCK_DIRECTION_HYPOTHESES_V31,
  financialModel,
  hardConstraints,
  guardrailValidation,
  qualityOverDiversityValidation,
});

const req = {
  method: "POST",
  body: {
    portfolioComposerInput,
  },
};

const res = createMockResponse();

await handler(req, res);

const responseBody = res.body || {};
const finalPortfolio = responseBody.finalPortfolio || null;
const directions = finalPortfolio?.directions || [];

const summary = {
  envLocalLoaded: envLoadResult.loaded,
  httpStatus: res.statusCode,
  ok: res.statusCode >= 200 && res.statusCode < 300,
  error: responseBody.error || null,
  details: responseBody.details || null,

  finalPortfolio: finalPortfolio
    ? {
        version: finalPortfolio.version,
        stage: finalPortfolio.stage,
        assessmentId: finalPortfolio.assessmentId,
        finalDirectionCount: directions.length,
        displayOrders: directions.map((direction) => direction.displayOrder),
        directionArenas: directions.map(
          (direction) => direction.directionArena
        ),
      }
    : null,

  validation: responseBody.validation
    ? {
        passed: responseBody.validation.passed,
        issueCount: responseBody.validation.issueCount,
        issues: responseBody.validation.issues,
      }
    : null,

  apiUsage: responseBody.apiUsage || null,
  rawOutputMetadata: responseBody.rawOutputMetadata || null,
};

console.log(JSON.stringify(summary, null, 2));

if (res.statusCode < 200 || res.statusCode >= 300) {
  process.exitCode = 1;
}

if (responseBody.validation?.passed === false) {
  process.exitCode = 1;
}
