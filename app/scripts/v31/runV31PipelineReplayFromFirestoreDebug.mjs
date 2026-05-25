#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Live Pipeline Replay Runner (Firestore Source)
 *
 * Purpose:
 * Read a real Firestore assessment document and run the full v3.1 pipeline
 * against it. Optionally persist the generated V31PipelineResultPayload to
 * assessments/{documentId}.v31Result.
 *
 * Bundle 17B rule:
 * - Debug-only runner.
 * - Reads real Firestore assessment data (not SAMPLE_ASSESSMENT_V31).
 * - Direct API handler calls only.
 * - Dry-run unless explicitly guarded.
 * - No UI or production result-flow integration.
 * - rawAssessment MUST NOT appear in the persisted payload.
 * - No PII, no raw Claude outputs, no secrets in printed output.
 */

import fs from "node:fs";
import path from "node:path";
import profileSynthesizerHandler from "../../api/profile-synthesizer-v31.js";
import transferabilityMapperHandler from "../../api/transferability-mapper-v31.js";
import directionHypothesisGeneratorHandler from "../../api/direction-hypothesis-generator-v31.js";
import portfolioComposerHandler from "../../api/portfolio-composer-v31.js";
import { buildAssessmentSnapshotV31 } from "../../src/v31/adapters/assessmentSnapshotAdapterV31.js";
import { buildProfileSynthesizerInputV31 } from "../../src/v31/adapters/profileSynthesizerInputAdapterV31.js";
import { buildTransferabilityMapperInputV31 } from "../../src/v31/adapters/transferabilityMapperInputAdapterV31.js";
import { buildDirectionHypothesisInputV31 } from "../../src/v31/adapters/directionHypothesisInputAdapterV31.js";
import { buildPortfolioComposerInputV31 } from "../../src/v31/adapters/portfolioComposerInputAdapterV31.js";
import { readAssessmentForV31ReplayV31 } from "../../src/v31/persistence/readAssessmentForV31Replay.js";
import {
  buildFinancialModelV31,
  buildGuardrailValidationV31,
  evaluateHardConstraintsV31,
  validateHypothesisQualityOverDiversityV31,
} from "../../src/v31/guardrails/index.js";
import { buildV31PipelineResultPayloadV31 } from "../../src/v31/persistence/buildV31PipelineResultPayload.js";
import { saveV31PipelineResultPayload } from "../../src/v31/persistence/v31FirestorePersistenceAdapter.js";

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

function parseArgs(argv) {
  return argv.reduce(
    (acc, arg) => {
      if (arg === "--write") {
        acc.write = true;
        return acc;
      }

      if (arg === "--dry-run") {
        acc.dryRun = true;
        return acc;
      }

      if (arg.startsWith("--document-id=")) {
        acc.documentId = arg.slice("--document-id=".length).trim();
        return acc;
      }

      if (arg.startsWith("--assessment-id=")) {
        acc.assessmentId = arg.slice("--assessment-id=".length).trim();
        return acc;
      }

      return acc;
    },
    {
      write: false,
      dryRun: false,
      documentId: null,
      assessmentId: null,
    }
  );
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

async function callHandler(handler, body) {
  const req = {
    method: "POST",
    body,
  };
  const res = createMockResponse();

  await handler(req, res);

  return {
    httpStatus: res.statusCode,
    ok: res.statusCode >= 200 && res.statusCode < 300,
    body: res.body || {},
  };
}

function apiCost(responseBody) {
  return Number(responseBody?.apiUsage?.estimatedCostUsd) || 0;
}

function validationPassed(responseBody) {
  return responseBody?.validation?.passed === true;
}

function roundCost(value) {
  return Number(value.toFixed(6));
}

function buildFailedStepSummary(result) {
  return {
    httpStatus: result.httpStatus,
    ok: result.ok,
    validationPassed: validationPassed(result.body),
    error: result.body?.error || null,
    details: result.body?.details || null,
  };
}

function printUsageAndFail(envLocalLoaded) {
  console.log(
    JSON.stringify(
      {
        envLocalLoaded,
        ok: false,
        usage:
          "node scripts/v31/runV31PipelineReplayFromFirestoreDebug.mjs --document-id=<assessmentDocId> [--assessment-id=<assessmentId>] [--write|--dry-run]",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}

function printFailure(summary, failedStep, failedStepSummary) {
  console.log(
    JSON.stringify(
      {
        ...summary,
        failedStep,
        steps: {
          ...summary.steps,
          [failedStep]: {
            ...(summary.steps[failedStep] || {}),
            ...failedStepSummary,
          },
        },
        totalEstimatedCostUsd: roundCost(summary.totalEstimatedCostUsd || 0),
        finalStatus: "failed",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}

function buildPayloadSummary(payload) {
  return {
    version: payload.version,
    stage: payload.stage,
    assessmentId: payload.assessmentId,
    pipelineStatus: payload.pipelineStatus,
    source: payload.source,
    hasFinalPortfolio: Boolean(payload.finalPortfolio),
    finalDirectionCount: payload.finalPortfolio?.directions?.length || 0,
    warningCount: payload.warnings.length,
    errorCount: payload.errors.length,
  };
}

function buildPersistenceSummary(result) {
  return {
    ok: result.ok,
    dryRun: result.dryRun,
    wrote: result.wrote,
    collectionName: result.plan.collectionName,
    documentId: result.plan.documentId,
    nestedFieldPath: result.plan.nestedFieldPath,
    forbiddenLegacyFieldsTouched: result.plan.forbiddenLegacyFieldsTouched,
    documentExistsBeforeWrite: result.documentExistsBeforeWrite ?? null,
  };
}

async function main() {
  const envLoadResult = loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));
  const writeRequested = args.write && !args.dryRun;
  const firestoreWriteEnabled =
    process.env.V31_ENABLE_FIRESTORE_WRITE === "true";

  if (!args.documentId) {
    printUsageAndFail(envLoadResult.loaded);
    return;
  }

  if (writeRequested && !firestoreWriteEnabled) {
    console.log(
      JSON.stringify(
        {
          envLocalLoaded: envLoadResult.loaded,
          documentId: args.documentId,
          assessmentId: args.assessmentId || args.documentId,
          writeRequested,
          firestoreWriteEnabled,
          finalStatus: "failed",
          error:
            "V31_ENABLE_FIRESTORE_WRITE=true is required for real write mode.",
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  const assessmentId = args.assessmentId || args.documentId;

  const summary = {
    envLocalLoaded: envLoadResult.loaded,
    documentId: args.documentId,
    assessmentId,
    writeRequested,
    firestoreWriteEnabled,
    dataSource: "firestore",
    finalStatus: "failed",
    steps: {},
    totalEstimatedCostUsd: 0,
  };

  // Read real assessment from Firestore
  let readResult;
  try {
    readResult = await readAssessmentForV31ReplayV31({
      documentId: args.documentId,
    });
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          ...summary,
          finalStatus: "failed",
          firestoreRead: {
            ok: false,
            error: error.message,
          },
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  if (!readResult.ok) {
    console.log(
      JSON.stringify(
        {
          ...summary,
          finalStatus: "failed",
          firestoreRead: {
            ok: false,
            documentExists: readResult.documentExists,
            error: readResult.error,
          },
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  summary.firestoreRead = {
    ok: true,
    documentExists: readResult.documentExists,
    fieldCount: readResult.fieldCount,
    strippedFieldsPresent: readResult.strippedFieldsPresent,
  };

  // Build snapshot from real Firestore assessment data
  const baseSnapshot = buildAssessmentSnapshotV31(readResult.assessment);
  const assessmentSnapshot = {
    ...baseSnapshot,
    assessmentId,
  };

  const profileSynthesizerInput =
    buildProfileSynthesizerInputV31(assessmentSnapshot);
  const profileResult = await callHandler(profileSynthesizerHandler, {
    profileSynthesizerInput,
  });
  const synthesizedProfile = profileResult.body.synthesizedProfile || null;
  const profileCost = apiCost(profileResult.body);
  summary.totalEstimatedCostUsd += profileCost;
  summary.steps.profileSynthesizer = {
    httpStatus: profileResult.httpStatus,
    ok: profileResult.ok,
    validationPassed: validationPassed(profileResult.body),
    estimatedCostUsd: profileCost,
  };

  if (!profileResult.ok || !validationPassed(profileResult.body)) {
    printFailure(
      summary,
      "profileSynthesizer",
      buildFailedStepSummary(profileResult)
    );
    return;
  }

  const transferabilityMapperInput = buildTransferabilityMapperInputV31(
    assessmentSnapshot,
    synthesizedProfile
  );
  const transferabilityResult = await callHandler(transferabilityMapperHandler, {
    transferabilityMapperInput,
  });
  const transferabilityMap =
    transferabilityResult.body.transferabilityMap || null;
  const transferabilityCost = apiCost(transferabilityResult.body);
  summary.totalEstimatedCostUsd += transferabilityCost;
  summary.steps.transferabilityMapper = {
    httpStatus: transferabilityResult.httpStatus,
    ok: transferabilityResult.ok,
    validationPassed: validationPassed(transferabilityResult.body),
    estimatedCostUsd: transferabilityCost,
  };

  if (
    !transferabilityResult.ok ||
    !validationPassed(transferabilityResult.body)
  ) {
    printFailure(
      summary,
      "transferabilityMapper",
      buildFailedStepSummary(transferabilityResult)
    );
    return;
  }

  const directionHypothesisInput = buildDirectionHypothesisInputV31(
    assessmentSnapshot,
    synthesizedProfile,
    transferabilityMap
  );
  const directionHypothesisResult = await callHandler(
    directionHypothesisGeneratorHandler,
    {
      directionHypothesisInput,
    }
  );
  const directionHypotheses =
    directionHypothesisResult.body.directionHypotheses || [];
  const directionHypothesisCost = apiCost(directionHypothesisResult.body);
  summary.totalEstimatedCostUsd += directionHypothesisCost;
  summary.steps.directionHypothesisGenerator = {
    httpStatus: directionHypothesisResult.httpStatus,
    ok: directionHypothesisResult.ok,
    validationPassed: validationPassed(directionHypothesisResult.body),
    hypothesisCount: directionHypotheses.length,
    estimatedCostUsd: directionHypothesisCost,
  };

  if (
    !directionHypothesisResult.ok ||
    !validationPassed(directionHypothesisResult.body)
  ) {
    printFailure(
      summary,
      "directionHypothesisGenerator",
      buildFailedStepSummary(directionHypothesisResult)
    );
    return;
  }

  const financialModel = buildFinancialModelV31(
    assessmentSnapshot,
    directionHypotheses
  );
  const hardConstraints = evaluateHardConstraintsV31(
    assessmentSnapshot,
    directionHypotheses
  );
  const guardrailValidation = buildGuardrailValidationV31(
    assessmentSnapshot,
    directionHypotheses,
    financialModel,
    hardConstraints
  );
  const qualityOverDiversityValidation =
    validateHypothesisQualityOverDiversityV31(
      directionHypotheses,
      guardrailValidation
    );

  summary.steps.guardrails = {
    passed: guardrailValidation.passed,
    guardrailStatuses: guardrailValidation.directionGuardrails.map(
      (guardrail) => guardrail.guardrailStatus
    ),
    canShowAsCredibleNowValues: guardrailValidation.directionGuardrails.map(
      (guardrail) => guardrail.canShowAsCredibleNow
    ),
  };

  const portfolioComposerInput = buildPortfolioComposerInputV31({
    assessmentSnapshot,
    synthesizedProfile,
    transferabilityMap,
    directionHypotheses,
    financialModel,
    hardConstraints,
    guardrailValidation,
    qualityOverDiversityValidation,
  });
  const portfolioResult = await callHandler(portfolioComposerHandler, {
    portfolioComposerInput,
  });
  const finalPortfolio = portfolioResult.body.finalPortfolio || null;
  const finalDirections = finalPortfolio?.directions || [];
  const portfolioCost = apiCost(portfolioResult.body);
  summary.totalEstimatedCostUsd += portfolioCost;
  summary.steps.portfolioComposer = {
    httpStatus: portfolioResult.httpStatus,
    ok: portfolioResult.ok,
    validationPassed: validationPassed(portfolioResult.body),
    finalDirectionCount: finalDirections.length,
    estimatedCostUsd: portfolioCost,
  };

  if (!portfolioResult.ok || !validationPassed(portfolioResult.body)) {
    printFailure(
      summary,
      "portfolioComposer",
      buildFailedStepSummary(portfolioResult)
    );
    return;
  }

  summary.totalEstimatedCostUsd = roundCost(summary.totalEstimatedCostUsd);
  summary.finalStatus = "passed";

  const apiUsageSummary = {
    totalEstimatedCostUsd: summary.totalEstimatedCostUsd,
    callCount: 4,
    perStageEstimatedCostUsd: {
      profileSynthesizer: summary.steps.profileSynthesizer.estimatedCostUsd,
      transferabilityMapper:
        summary.steps.transferabilityMapper.estimatedCostUsd,
      directionHypothesisGenerator:
        summary.steps.directionHypothesisGenerator.estimatedCostUsd,
      portfolioComposer: summary.steps.portfolioComposer.estimatedCostUsd,
    },
  };

  const pipelineResultPayload = buildV31PipelineResultPayloadV31({
    assessmentId,
    finalPortfolio,
    pipelineSummary: summary.steps,
    guardrailSummary: summary.steps.guardrails,
    apiUsageSummary,
    auditTrail: [],
    warnings: [],
    errors: [],
    source: "isolated_debug_runner",
    pipelineStatus: "passed",
  });

  summary.pipelineResultPayload = buildPayloadSummary(pipelineResultPayload);

  try {
    const persistenceResult = await saveV31PipelineResultPayload(
      pipelineResultPayload,
      writeRequested
        ? {
            dryRun: false,
            confirmWrite: true,
            debugOnly: true,
            documentId: args.documentId,
            requireExistingDocument: true,
          }
        : {
            dryRun: true,
            documentId: args.documentId,
          }
    );

    summary.persistence = buildPersistenceSummary(persistenceResult);
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          ...summary,
          finalStatus: "failed",
          persistence: {
            ok: false,
            dryRun: !writeRequested,
            wrote: false,
            error: error.message,
          },
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify(summary, null, 2));
}

try {
  await main();
} catch (error) {
  console.log(
    JSON.stringify(
      {
        finalStatus: "failed",
        error: error.message,
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
