#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Profile Synthesizer API Handler Debug Runner
 *
 * Purpose:
 * Test api/profile-synthesizer-v31.js directly from Node without running
 * `vercel dev`.
 *
 * Bundle 8B rule:
 * - Local debug runner only.
 * - Calls the isolated API handler directly.
 * - No UI integration.
 * - No Firestore reads/writes.
 * - No production imports.
 */

import fs from "node:fs";
import path from "node:path";
import handler from "../../api/profile-synthesizer-v31.js";
import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildProfileSynthesizerInputV31 } from "../../src/v31/adapters/profileSynthesizerInputAdapterV31.js";
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";

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
const profileSynthesizerInput = buildProfileSynthesizerInputV31(snapshot);

const req = {
  method: "POST",
  body: {
    profileSynthesizerInput,
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

  synthesizedProfile: responseBody.synthesizedProfile
    ? {
        version: responseBody.synthesizedProfile.version,
        stage: responseBody.synthesizedProfile.stage,
        assessmentId: responseBody.synthesizedProfile.assessmentId,
        marketIdentity:
          responseBody.synthesizedProfile.profileSummary?.marketIdentity ||
          null,
        profileSummaryLength:
          responseBody.synthesizedProfile.profileSummary?.oneParagraphProfile
            ?.length || 0,
        strongestCompetencyCount:
          responseBody.synthesizedProfile.competencySignals
            ?.strongestCompetencies?.length || 0,
        careerCapitalFunctionalExperienceCount:
          responseBody.synthesizedProfile.careerCapital?.functionalExperience
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
