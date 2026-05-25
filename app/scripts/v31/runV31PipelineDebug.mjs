#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 - End-to-End Isolated Pipeline Debug Runner
 *
 * Purpose:
 * Execute the full isolated v3.1 debug pipeline from SAMPLE_ASSESSMENT_V31
 * through the direct API handlers and deterministic guardrails.
 *
 * Bundle 14 rule:
 * - Local debug runner only.
 * - Direct handler calls only.
 * - No localhost fetch.
 * - No Firestore reads/writes.
 * - No UI or production result-flow integration.
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
import { SAMPLE_ASSESSMENT_V31 } from "../../src/v31/debug/sampleAssessmentV31.js";
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

function printAndFail(summary, failedStep, failedStepSummary) {
  const failedSummary = {
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
  };

  console.log(JSON.stringify(failedSummary, null, 2));
  process.exitCode = 1;
}

async function main() {
  const envLoadResult = loadEnvLocal();
  const assessmentSnapshot = buildAssessmentSnapshotV31(SAMPLE_ASSESSMENT_V31);

  const summary = {
    envLocalLoaded: envLoadResult.loaded,
    assessmentId: assessmentSnapshot.assessmentId,
    steps: {},
    totalEstimatedCostUsd: 0,
    finalStatus: "failed",
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
    marketIdentity:
      synthesizedProfile?.profileSummary?.marketIdentity || null,
    estimatedCostUsd: profileCost,
  };

  if (!profileResult.ok || !validationPassed(profileResult.body)) {
    printAndFail(
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
    transferableAssetCount:
      transferabilityMap?.transferableAssets?.length || 0,
    possibleDirectionArenaCount:
      transferabilityMap?.possibleDirectionArenas?.length || 0,
    estimatedCostUsd: transferabilityCost,
  };

  if (!transferabilityResult.ok || !validationPassed(transferabilityResult.body)) {
    printAndFail(
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
    printAndFail(
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
    financialPressureLevel: financialModel.financialPressureLevel,
    guardrailStatuses: guardrailValidation.directionGuardrails.map(
      (guardrail) => guardrail.guardrailStatus
    ),
    canShowAsCredibleNowValues: guardrailValidation.directionGuardrails.map(
      (guardrail) => guardrail.canShowAsCredibleNow
    ),
    qualityStatuses:
      qualityOverDiversityValidation.hypothesisQualitySignals.map(
        (signal) => signal.qualityStatus
      ),
    missingInputCounts: {
      financial:
        financialModel.missingFinancialInputs?.length || 0,
      constraints:
        hardConstraints.missingConstraintInputs?.length || 0,
      guardrails: guardrailValidation.missingInputs?.length || 0,
    },
    passed: guardrailValidation.passed,
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
    displayOrders: finalDirections.map((direction) => direction.displayOrder),
    directionArenas: finalDirections.map(
      (direction) => direction.directionArena
    ),
    estimatedCostUsd: portfolioCost,
  };

  if (!portfolioResult.ok || !validationPassed(portfolioResult.body)) {
    printAndFail(
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
      profileSynthesizer:
        summary.steps.profileSynthesizer.estimatedCostUsd,
      transferabilityMapper:
        summary.steps.transferabilityMapper.estimatedCostUsd,
      directionHypothesisGenerator:
        summary.steps.directionHypothesisGenerator.estimatedCostUsd,
      portfolioComposer:
        summary.steps.portfolioComposer.estimatedCostUsd,
    },
  };

  const pipelineResultPayload = buildV31PipelineResultPayloadV31({
    assessmentId: assessmentSnapshot.assessmentId,
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

  summary.pipelineResultPayload = {
    version: pipelineResultPayload.version,
    stage: pipelineResultPayload.stage,
    assessmentId: pipelineResultPayload.assessmentId,
    pipelineStatus: pipelineResultPayload.pipelineStatus,
    source: pipelineResultPayload.source,
    hasFinalPortfolio: Boolean(pipelineResultPayload.finalPortfolio),
    finalDirectionCount:
      pipelineResultPayload.finalPortfolio?.directions?.length || 0,
    auditTrailCount: pipelineResultPayload.auditTrail.length,
    warningCount: pipelineResultPayload.warnings.length,
    errorCount: pipelineResultPayload.errors.length,
  };

  const persistenceDryRun = await saveV31PipelineResultPayload(
    pipelineResultPayload,
    { dryRun: true }
  );
  const persistencePlan = persistenceDryRun.plan;

  summary.persistenceDryRun = {
    ok: persistenceDryRun.ok,
    dryRun: persistenceDryRun.dryRun,
    wrote: persistenceDryRun.wrote,
    assessmentId: persistencePlan.assessmentId,
    collectionName: persistencePlan.collectionName,
    documentId: persistencePlan.documentId,
    nestedFieldPath: persistencePlan.nestedFieldPath,
    forbiddenLegacyFieldsTouched:
      persistencePlan.forbiddenLegacyFieldsTouched,
  };

  console.log(JSON.stringify(summary, null, 2));
}

try {
  await main();
} catch (error) {
  console.log(
    JSON.stringify(
      {
        envLocalLoaded: Boolean(process.env.ANTHROPIC_API_KEY),
        assessmentId: null,
        failedStep: "unexpected",
        error: error.message,
        steps: {},
        totalEstimatedCostUsd: 0,
        finalStatus: "failed",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
