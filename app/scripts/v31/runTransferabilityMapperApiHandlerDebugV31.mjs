#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Transferability Mapper API Handler Debug Runner
 *
 * Purpose:
 * Test api/transferability-mapper-v31.js directly from Node without a local
 * dev server.
 *
 * Bundle 10 rule:
 * - Local debug runner only.
 * - Calls the isolated API handler directly.
 * - No UI integration.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import fs from "node:fs";
import path from "node:path";
import handler from "../../api/transferability-mapper-v31.js";
import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildTransferabilityMapperInputV31 } from "../../src/v31/adapters/transferabilityMapperInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
import { MOCK_SYNTHESIZED_PROFILE_V31 } from "../../src/v31/debug/mockSynthesizedProfileV31.js";

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
const transferabilityMapperInput = buildTransferabilityMapperInputV31(
  snapshot,
  MOCK_SYNTHESIZED_PROFILE_V31
);

const req = {
  method: "POST",
  body: {
    transferabilityMapperInput,
  },
};

const res = createMockResponse();

await handler(req, res);

const responseBody = res.body || {};

const summary = {
  envLocalLoaded: envLoadResult.loaded,
  httpStatus: res.statusCode,
  ok: res.statusCode >= 200 && res.statusCode < 300,
  error: responseBody.error || null,
  details: responseBody.details || null,

  transferabilityMap: responseBody.transferabilityMap
    ? {
        version: responseBody.transferabilityMap.version,
        stage: responseBody.transferabilityMap.stage,
        assessmentId: responseBody.transferabilityMap.assessmentId,
        transferableAssetCount:
          responseBody.transferabilityMap.transferableAssets?.length || 0,
        credibilityBridgeCount:
          responseBody.transferabilityMap.credibilityBridges?.length || 0,
        possibleDirectionArenaCount:
          responseBody.transferabilityMap.possibleDirectionArenas?.length || 0,
        riskyAssumptionCount:
          responseBody.transferabilityMap.nonTransferableOrRiskyAssumptions
            ?.length || 0,
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
