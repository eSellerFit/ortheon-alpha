/**
 * Ortheon MVP Cut v3.1 — Pipeline Service
 *
 * Bundle 26A.
 * Reusable server-side orchestrator for the full v3.1 pipeline.
 * Shared by the CLI debug runner and the /api/v31-generate-report route.
 *
 * Rules:
 * - No console.log.  console.error is allowed for unexpected errors.
 * - No process.exit.
 * - Returns structured result objects only.
 * - Idempotent: skips pipeline if v31Result already exists and force !== true.
 * - rawAssessment MUST NOT appear in the persisted payload.
 * - No PII, no raw Claude outputs, no stack traces in return values.
 */

import profileSynthesizerHandler from "../../../api/profile-synthesizer-v31.js";
import transferabilityMapperHandler from "../../../api/transferability-mapper-v31.js";
import directionHypothesisGeneratorHandler from "../../../api/direction-hypothesis-generator-v31.js";
import portfolioComposerHandler from "../../../api/portfolio-composer-v31.js";
import { buildAssessmentSnapshotV31 } from "../adapters/assessmentSnapshotAdapterV31.js";
import { buildProfileSynthesizerInputV31 } from "../adapters/profileSynthesizerInputAdapterV31.js";
import { buildTransferabilityMapperInputV31 } from "../adapters/transferabilityMapperInputAdapterV31.js";
import { buildDirectionHypothesisInputV31 } from "../adapters/directionHypothesisInputAdapterV31.js";
import { buildPortfolioComposerInputV31 } from "../adapters/portfolioComposerInputAdapterV31.js";
import { readAssessmentForV31ReplayV31 } from "../persistence/readAssessmentForV31Replay.js";
import {
  buildFinancialModelV31,
  buildGuardrailValidationV31,
  evaluateHardConstraintsV31,
  validateHypothesisQualityOverDiversityV31,
} from "../guardrails/index.js";
import { buildV31PipelineResultPayloadV31 } from "../persistence/buildV31PipelineResultPayload.js";
import { saveV31PipelineResultPayload } from "../persistence/v31FirestorePersistenceAdapter.js";
import { applyFinalPortfolioPolicyV31 } from "../portfolio/applyFinalPortfolioPolicyV31.js";

// ── Internal helpers ───────────────────────────────────────────────────────────

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
  const req = { method: "POST", body };
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

function buildFinalPortfolioSummary(directions, policyApplied, policyNotes) {
  if (!Array.isArray(directions) || directions.length === 0) {
    return { directionCount: 0, policyApplied: Boolean(policyApplied), policyNotes: [] };
  }
  const seenFamilies = {};
  const duplicatePathFamilies = [];
  directions.forEach((d) => {
    const pf = typeof d.pathFamily === "string" ? d.pathFamily.toLowerCase().trim() : "";
    if (!pf || pf === "other") return;
    if (seenFamilies[pf] !== undefined) {
      if (!duplicatePathFamilies.includes(pf)) duplicatePathFamilies.push(pf);
    } else {
      seenFamilies[pf] = true;
    }
  });
  return {
    policyApplied: Boolean(policyApplied),
    policyNotes: Array.isArray(policyNotes) ? policyNotes : [],
    directionCount: directions.length,
    finalDirectionLabels: directions.map((d) => d.label || ""),
    pathFamilies: directions.map((d) => d.pathFamily || null),
    duplicatePathFamilies,
    recommendationTypes: directions.map((d) => d.recommendationType || ""),
    routeTypes: directions.map((d) => d.routeType || ""),
    confidenceValues: directions.map((d) => d.confidence || ""),
    profileCredibilityLevels: directions.map((d) => d.profileCredibility?.level || null),
    financialRiskLevels: directions.map((d) => d.financialRisk?.level || null),
    executionRiskLevels: directions.map((d) => d.executionRisk?.level || null),
    targetRoleExampleCounts: directions.map((d) =>
      Array.isArray(d.targetRoleExamples) ? d.targetRoleExamples.length : 0
    ),
    primaryTargetRoleExamples: Array.isArray(directions[0]?.targetRoleExamples)
      ? directions[0].targetRoleExamples
      : [],
    aiDurabilityRatings: directions.map((d) => d.aiDurability?.rating || null),
    aiDurabilityLabels: directions.map((d) => d.aiDurability?.label || null),
    firstValidationStepsShort: directions.map((d) => {
      const step = String(d.firstValidationStep || "").trim();
      return step.length > 60 ? step.slice(0, 58) + "…" : step;
    }),
  };
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

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * Run the full v3.1 pipeline for a given assessment document.
 *
 * @param {Object} options
 * @param {string}  options.documentId     Firestore document ID to read and write.
 * @param {string}  [options.assessmentId] Assessment ID embedded in the result (defaults to documentId).
 * @param {boolean} [options.write]        Whether to persist the result to Firestore.
 * @param {boolean} [options.dryRun]       When true, skips real write even if write is true.
 * @param {boolean} [options.force]        When true, regenerates even if v31Result already exists.
 * @param {string}  [options.source]       Source label stored in the result payload.
 * @returns {Promise<Object>}
 */
export async function runV31PipelineForAssessmentV31({
  documentId,
  assessmentId,
  write = false,
  dryRun = true,
  force = false,
  source = "v31_auto_generation",
} = {}) {
  if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
    return {
      ok: false,
      skipped: false,
      error: "documentId must be a non-empty string.",
    };
  }

  const resolvedDocumentId = documentId.trim();
  const resolvedAssessmentId =
    typeof assessmentId === "string" && assessmentId.trim()
      ? assessmentId.trim()
      : resolvedDocumentId;
  const reportUrl = `/report?documentId=${encodeURIComponent(resolvedDocumentId)}`;
  const writeEnabled = write === true && dryRun !== true;

  // ── Read assessment from Firestore ─────────────────────────────────────────

  let readResult;
  try {
    readResult = await readAssessmentForV31ReplayV31({ documentId: resolvedDocumentId });
  } catch (err) {
    console.error("[v31-pipeline-service] Firestore read error:", err.message);
    return {
      ok: false,
      skipped: false,
      error: "Firestore read failed.",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
    };
  }

  if (!readResult.ok) {
    return {
      ok: false,
      skipped: false,
      error: readResult.error,
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      documentExists: readResult.documentExists,
    };
  }

  const firestoreRead = {
    ok: true,
    documentExists: readResult.documentExists,
    fieldCount: readResult.fieldCount,
    strippedFieldsPresent: readResult.strippedFieldsPresent,
  };

  // ── Idempotency check ──────────────────────────────────────────────────────

  const v31ResultAlreadyExists =
    Array.isArray(readResult.strippedFieldsPresent) &&
    readResult.strippedFieldsPresent.includes("v31Result");

  if (v31ResultAlreadyExists && !force) {
    return {
      ok: true,
      skipped: true,
      reason: "v31Result already exists",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      hasV31Result: true,
      reportUrl,
      firestoreRead,
    };
  }

  // ── Build assessment snapshot ──────────────────────────────────────────────

  const baseSnapshot = buildAssessmentSnapshotV31(readResult.assessment);
  const assessmentSnapshot = { ...baseSnapshot, assessmentId: resolvedAssessmentId };

  let totalEstimatedCostUsd = 0;
  const steps = {};

  // ── Stage 1: Profile synthesizer ──────────────────────────────────────────

  const profileSynthesizerInput = buildProfileSynthesizerInputV31(assessmentSnapshot);
  const profileResult = await callHandler(profileSynthesizerHandler, {
    profileSynthesizerInput,
  });
  const synthesizedProfile = profileResult.body.synthesizedProfile || null;
  const profileCost = apiCost(profileResult.body);
  totalEstimatedCostUsd += profileCost;
  steps.profileSynthesizer = {
    httpStatus: profileResult.httpStatus,
    ok: profileResult.ok,
    validationPassed: validationPassed(profileResult.body),
    estimatedCostUsd: profileCost,
  };

  if (!profileResult.ok || !validationPassed(profileResult.body)) {
    return {
      ok: false,
      skipped: false,
      error: "Profile synthesizer failed.",
      failedStep: "profileSynthesizer",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      firestoreRead,
      steps,
      totalEstimatedCostUsd: roundCost(totalEstimatedCostUsd),
    };
  }

  // ── Stage 2: Transferability mapper ───────────────────────────────────────

  const transferabilityMapperInput = buildTransferabilityMapperInputV31(
    assessmentSnapshot,
    synthesizedProfile
  );
  const transferabilityResult = await callHandler(transferabilityMapperHandler, {
    transferabilityMapperInput,
  });
  const transferabilityMap = transferabilityResult.body.transferabilityMap || null;
  const transferabilityCost = apiCost(transferabilityResult.body);
  totalEstimatedCostUsd += transferabilityCost;
  steps.transferabilityMapper = {
    httpStatus: transferabilityResult.httpStatus,
    ok: transferabilityResult.ok,
    validationPassed: validationPassed(transferabilityResult.body),
    estimatedCostUsd: transferabilityCost,
  };

  if (!transferabilityResult.ok || !validationPassed(transferabilityResult.body)) {
    return {
      ok: false,
      skipped: false,
      error: "Transferability mapper failed.",
      failedStep: "transferabilityMapper",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      firestoreRead,
      steps,
      totalEstimatedCostUsd: roundCost(totalEstimatedCostUsd),
    };
  }

  // ── Stage 3: Direction hypothesis generator ────────────────────────────────

  const directionHypothesisInput = buildDirectionHypothesisInputV31(
    assessmentSnapshot,
    synthesizedProfile,
    transferabilityMap
  );
  const directionHypothesisResult = await callHandler(
    directionHypothesisGeneratorHandler,
    { directionHypothesisInput }
  );
  const directionHypotheses = directionHypothesisResult.body.directionHypotheses || [];
  const hypothesisCost = apiCost(directionHypothesisResult.body);
  totalEstimatedCostUsd += hypothesisCost;
  steps.directionHypothesisGenerator = {
    httpStatus: directionHypothesisResult.httpStatus,
    ok: directionHypothesisResult.ok,
    validationPassed: validationPassed(directionHypothesisResult.body),
    hypothesisCount: directionHypotheses.length,
    estimatedCostUsd: hypothesisCost,
  };

  if (!directionHypothesisResult.ok || !validationPassed(directionHypothesisResult.body)) {
    return {
      ok: false,
      skipped: false,
      error: "Direction hypothesis generator failed.",
      failedStep: "directionHypothesisGenerator",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      firestoreRead,
      steps,
      totalEstimatedCostUsd: roundCost(totalEstimatedCostUsd),
    };
  }

  // ── Guardrails ─────────────────────────────────────────────────────────────

  const financialModel = buildFinancialModelV31(assessmentSnapshot, directionHypotheses);
  const hardConstraints = evaluateHardConstraintsV31(assessmentSnapshot, directionHypotheses);
  const guardrailValidation = buildGuardrailValidationV31(
    assessmentSnapshot,
    directionHypotheses,
    financialModel,
    hardConstraints
  );
  const qualityOverDiversityValidation = validateHypothesisQualityOverDiversityV31(
    directionHypotheses,
    guardrailValidation
  );

  steps.guardrails = {
    passed: guardrailValidation.passed,
    guardrailStatuses: guardrailValidation.directionGuardrails.map(
      (g) => g.guardrailStatus
    ),
    canShowAsCredibleNowValues: guardrailValidation.directionGuardrails.map(
      (g) => g.canShowAsCredibleNow
    ),
  };

  // ── Stage 4: Portfolio composer ────────────────────────────────────────────

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
  const rawFinalPortfolio = portfolioResult.body.finalPortfolio || null;
  const finalPortfolio = rawFinalPortfolio
    ? applyFinalPortfolioPolicyV31(rawFinalPortfolio)
    : null;
  const finalDirections = finalPortfolio?.directions || [];
  const portfolioCost = apiCost(portfolioResult.body);
  totalEstimatedCostUsd += portfolioCost;
  steps.portfolioComposer = {
    httpStatus: portfolioResult.httpStatus,
    ok: portfolioResult.ok,
    validationPassed: validationPassed(portfolioResult.body),
    finalDirectionCount: finalDirections.length,
    estimatedCostUsd: portfolioCost,
  };

  if (!portfolioResult.ok || !validationPassed(portfolioResult.body)) {
    return {
      ok: false,
      skipped: false,
      error: "Portfolio composer failed.",
      failedStep: "portfolioComposer",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      firestoreRead,
      steps,
      totalEstimatedCostUsd: roundCost(totalEstimatedCostUsd),
    };
  }

  totalEstimatedCostUsd = roundCost(totalEstimatedCostUsd);

  // ── Build pipeline result payload ──────────────────────────────────────────

  const apiUsageSummary = {
    totalEstimatedCostUsd,
    callCount: 4,
    perStageEstimatedCostUsd: {
      profileSynthesizer: steps.profileSynthesizer.estimatedCostUsd,
      transferabilityMapper: steps.transferabilityMapper.estimatedCostUsd,
      directionHypothesisGenerator: steps.directionHypothesisGenerator.estimatedCostUsd,
      portfolioComposer: steps.portfolioComposer.estimatedCostUsd,
    },
  };

  const pipelineResultPayload = buildV31PipelineResultPayloadV31({
    assessmentId: resolvedAssessmentId,
    finalPortfolio,
    pipelineSummary: steps,
    guardrailSummary: steps.guardrails,
    apiUsageSummary,
    auditTrail: [],
    warnings: [],
    errors: [],
    source,
    pipelineStatus: "passed",
  });

  // ── Persist ────────────────────────────────────────────────────────────────

  const persistenceOptions = writeEnabled
    ? {
        dryRun: false,
        confirmWrite: true,
        debugOnly: true,
        documentId: resolvedDocumentId,
        requireExistingDocument: true,
      }
    : {
        dryRun: true,
        documentId: resolvedDocumentId,
      };

  let persistenceResult;
  try {
    persistenceResult = await saveV31PipelineResultPayload(
      pipelineResultPayload,
      persistenceOptions
    );
  } catch (err) {
    console.error("[v31-pipeline-service] persistence error:", err.message);
    return {
      ok: false,
      skipped: false,
      error: "Firestore write failed.",
      documentId: resolvedDocumentId,
      assessmentId: resolvedAssessmentId,
      firestoreRead,
      steps,
      totalEstimatedCostUsd,
      pipelineResultPayload: buildPayloadSummary(pipelineResultPayload),
    };
  }

  return {
    ok: true,
    skipped: false,
    documentId: resolvedDocumentId,
    assessmentId: resolvedAssessmentId,
    hasV31Result: true,
    reportUrl,
    pipelineStatus: "passed",
    totalEstimatedCostUsd,
    firestoreRead,
    steps,
    finalPortfolioSummary: buildFinalPortfolioSummary(
      finalDirections,
      finalPortfolio?.policyApplied,
      finalPortfolio?.policyNotes
    ),
    pipelineResultPayload: buildPayloadSummary(pipelineResultPayload),
    persistence: buildPersistenceSummary(persistenceResult),
  };
}
