/**
 * Ortheon MVP Cut v3.1 — Staged Pipeline Service
 *
 * Bundle 26B.
 * Runs one stage of the v3.1 pipeline per call.
 * Each stage reads state from Firestore, checks idempotency, calls one
 * Claude handler, and writes normalized output back to Firestore.
 *
 * Stages: "profile" | "transferability" | "hypotheses" | "portfolio"
 *
 * Rules:
 * - No console.log. console.error for unexpected errors only.
 * - No process.exit.
 * - Returns structured result objects only.
 * - If v31Result already exists, always returns ready without running Claude.
 * - If stage already complete and force !== true, returns skipped.
 * - rawAssessment MUST NOT appear in persisted output.
 * - No stack traces in return values.
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
import {
  buildFinancialModelV31,
  buildGuardrailValidationV31,
  evaluateHardConstraintsV31,
  validateHypothesisQualityOverDiversityV31,
} from "../guardrails/index.js";
import { buildV31PipelineResultPayloadV31 } from "../persistence/buildV31PipelineResultPayload.js";
import { saveV31PipelineResultPayload } from "../persistence/v31FirestorePersistenceAdapter.js";
import { applyFinalPortfolioPolicyV31 } from "../portfolio/applyFinalPortfolioPolicyV31.js";
import {
  readV31GenerationDocumentState,
  initV31GenerationState,
  saveV31StageOutput,
  markV31GenerationComplete,
} from "./v31StagedGenerationStateAdapter.js";

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

function validationPassed(responseBody) {
  return responseBody?.validation?.passed === true;
}

function safeApiUsage(responseBody) {
  const u = responseBody?.apiUsage || {};
  return {
    model: u.model || null,
    inputTokens: Number(u.inputTokens) || 0,
    outputTokens: Number(u.outputTokens) || 0,
    estimatedCostUsd: Number(u.estimatedCostUsd) || 0,
    calculatedAt: u.calculatedAt || null,
  };
}

const VALID_STAGES = ["profile", "transferability", "hypotheses", "portfolio"];

// ── Stage handlers ─────────────────────────────────────────────────────────────

async function runProfileStage({
  state,
  resolvedDocumentId,
  resolvedAssessmentId,
  force,
}) {
  const gen = state.v31Generation;
  const stageData = gen?.stages?.profileSynthesizer;

  if (stageData?.status === "complete" && !force) {
    return { ok: true, status: "stage_complete", stage: "profile", skipped: true };
  }

  // Initialize tracking state on first run
  if (!gen) {
    try {
      await initV31GenerationState({ documentId: resolvedDocumentId });
    } catch (err) {
      console.error("[v31-stage-service] init error:", err.message);
      return { ok: false, error: "Failed to initialize generation state.", stage: "profile" };
    }
  }

  const assessmentSnapshot = {
    ...buildAssessmentSnapshotV31(state.assessment),
    assessmentId: resolvedAssessmentId,
  };

  const result = await callHandler(profileSynthesizerHandler, {
    profileSynthesizerInput: buildProfileSynthesizerInputV31(assessmentSnapshot),
  });

  if (!result.ok || !validationPassed(result.body)) {
    return { ok: false, error: "Profile synthesis failed.", stage: "profile" };
  }

  try {
    await saveV31StageOutput({
      documentId: resolvedDocumentId,
      stage: "profile",
      output: { synthesizedProfile: result.body.synthesizedProfile },
      apiUsage: safeApiUsage(result.body),
    });
  } catch (err) {
    console.error("[v31-stage-service] profile write error:", err.message);
    return { ok: false, error: "Failed to save profile stage output.", stage: "profile" };
  }

  return { ok: true, status: "stage_complete", stage: "profile", skipped: false };
}

async function runTransferabilityStage({
  state,
  resolvedDocumentId,
  resolvedAssessmentId,
  force,
}) {
  const gen = state.v31Generation;
  const stageData = gen?.stages?.transferabilityMapper;

  if (stageData?.status === "complete" && !force) {
    return { ok: true, status: "stage_complete", stage: "transferability", skipped: true };
  }

  const synthesizedProfile = gen?.stages?.profileSynthesizer?.output?.synthesizedProfile;
  if (!synthesizedProfile) {
    return {
      ok: false,
      error: "Profile stage output missing. Run profile stage first.",
      stage: "transferability",
    };
  }

  const assessmentSnapshot = {
    ...buildAssessmentSnapshotV31(state.assessment),
    assessmentId: resolvedAssessmentId,
  };

  const result = await callHandler(transferabilityMapperHandler, {
    transferabilityMapperInput: buildTransferabilityMapperInputV31(
      assessmentSnapshot,
      synthesizedProfile
    ),
  });

  if (!result.ok || !validationPassed(result.body)) {
    return { ok: false, error: "Transferability mapping failed.", stage: "transferability" };
  }

  try {
    await saveV31StageOutput({
      documentId: resolvedDocumentId,
      stage: "transferability",
      output: { transferabilityMap: result.body.transferabilityMap },
      apiUsage: safeApiUsage(result.body),
    });
  } catch (err) {
    console.error("[v31-stage-service] transferability write error:", err.message);
    return { ok: false, error: "Failed to save transferability stage output.", stage: "transferability" };
  }

  return { ok: true, status: "stage_complete", stage: "transferability", skipped: false };
}

async function runHypothesesStage({
  state,
  resolvedDocumentId,
  resolvedAssessmentId,
  force,
}) {
  const gen = state.v31Generation;
  const stageData = gen?.stages?.directionHypothesisGenerator;

  if (stageData?.status === "complete" && !force) {
    return { ok: true, status: "stage_complete", stage: "hypotheses", skipped: true };
  }

  const synthesizedProfile = gen?.stages?.profileSynthesizer?.output?.synthesizedProfile;
  const transferabilityMap = gen?.stages?.transferabilityMapper?.output?.transferabilityMap;

  if (!synthesizedProfile) {
    return { ok: false, error: "Profile stage output missing.", stage: "hypotheses" };
  }
  if (!transferabilityMap) {
    return { ok: false, error: "Transferability stage output missing.", stage: "hypotheses" };
  }

  const assessmentSnapshot = {
    ...buildAssessmentSnapshotV31(state.assessment),
    assessmentId: resolvedAssessmentId,
  };

  const result = await callHandler(directionHypothesisGeneratorHandler, {
    directionHypothesisInput: buildDirectionHypothesisInputV31(
      assessmentSnapshot,
      synthesizedProfile,
      transferabilityMap
    ),
  });

  if (!result.ok || !validationPassed(result.body)) {
    return { ok: false, error: "Direction hypothesis generation failed.", stage: "hypotheses" };
  }

  try {
    await saveV31StageOutput({
      documentId: resolvedDocumentId,
      stage: "hypotheses",
      output: { directionHypotheses: result.body.directionHypotheses || [] },
      apiUsage: safeApiUsage(result.body),
    });
  } catch (err) {
    console.error("[v31-stage-service] hypotheses write error:", err.message);
    return { ok: false, error: "Failed to save hypotheses stage output.", stage: "hypotheses" };
  }

  return { ok: true, status: "stage_complete", stage: "hypotheses", skipped: false };
}

async function runPortfolioStage({
  state,
  resolvedDocumentId,
  resolvedAssessmentId,
  reportUrl,
}) {
  const gen = state.v31Generation;

  const synthesizedProfile = gen?.stages?.profileSynthesizer?.output?.synthesizedProfile;
  const transferabilityMap = gen?.stages?.transferabilityMapper?.output?.transferabilityMap;
  const directionHypotheses = gen?.stages?.directionHypothesisGenerator?.output?.directionHypotheses;

  if (!synthesizedProfile) {
    return { ok: false, error: "Profile stage output missing.", stage: "portfolio" };
  }
  if (!transferabilityMap) {
    return { ok: false, error: "Transferability stage output missing.", stage: "portfolio" };
  }
  if (!Array.isArray(directionHypotheses)) {
    return { ok: false, error: "Hypotheses stage output missing.", stage: "portfolio" };
  }

  const assessmentSnapshot = {
    ...buildAssessmentSnapshotV31(state.assessment),
    assessmentId: resolvedAssessmentId,
  };

  // Deterministic guardrails
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

  const result = await callHandler(portfolioComposerHandler, {
    portfolioComposerInput: buildPortfolioComposerInputV31({
      assessmentSnapshot,
      synthesizedProfile,
      transferabilityMap,
      directionHypotheses,
      financialModel,
      hardConstraints,
      guardrailValidation,
      qualityOverDiversityValidation,
    }),
  });

  if (!result.ok || !validationPassed(result.body)) {
    return { ok: false, error: "Portfolio composition failed.", stage: "portfolio" };
  }

  const rawFinalPortfolio = result.body.finalPortfolio || null;
  const finalPortfolio = rawFinalPortfolio
    ? applyFinalPortfolioPolicyV31(rawFinalPortfolio)
    : null;

  const portfolioApiUsage = safeApiUsage(result.body);

  const apiUsageSummary = {
    totalEstimatedCostUsd:
      (gen?.stages?.profileSynthesizer?.apiUsage?.estimatedCostUsd || 0) +
      (gen?.stages?.transferabilityMapper?.apiUsage?.estimatedCostUsd || 0) +
      (gen?.stages?.directionHypothesisGenerator?.apiUsage?.estimatedCostUsd || 0) +
      (portfolioApiUsage.estimatedCostUsd || 0),
    callCount: 4,
    perStageEstimatedCostUsd: {
      profileSynthesizer: gen?.stages?.profileSynthesizer?.apiUsage?.estimatedCostUsd || 0,
      transferabilityMapper: gen?.stages?.transferabilityMapper?.apiUsage?.estimatedCostUsd || 0,
      directionHypothesisGenerator:
        gen?.stages?.directionHypothesisGenerator?.apiUsage?.estimatedCostUsd || 0,
      portfolioComposer: portfolioApiUsage.estimatedCostUsd || 0,
    },
  };

  const pipelineResultPayload = buildV31PipelineResultPayloadV31({
    assessmentId: resolvedAssessmentId,
    finalPortfolio,
    pipelineSummary: {
      profileSynthesizer: {
        ok: true,
        validationPassed: true,
        estimatedCostUsd: gen?.stages?.profileSynthesizer?.apiUsage?.estimatedCostUsd || 0,
      },
      transferabilityMapper: {
        ok: true,
        validationPassed: true,
        estimatedCostUsd: gen?.stages?.transferabilityMapper?.apiUsage?.estimatedCostUsd || 0,
      },
      directionHypothesisGenerator: {
        ok: true,
        validationPassed: true,
        estimatedCostUsd:
          gen?.stages?.directionHypothesisGenerator?.apiUsage?.estimatedCostUsd || 0,
      },
      portfolioComposer: {
        ok: true,
        validationPassed: true,
        estimatedCostUsd: portfolioApiUsage.estimatedCostUsd || 0,
      },
    },
    guardrailSummary: {
      passed: guardrailValidation.passed,
      guardrailStatuses: guardrailValidation.directionGuardrails.map(
        (g) => g.guardrailStatus
      ),
      canShowAsCredibleNowValues: guardrailValidation.directionGuardrails.map(
        (g) => g.canShowAsCredibleNow
      ),
    },
    apiUsageSummary,
    auditTrail: [],
    warnings: [],
    errors: [],
    source: "production_pipeline",
    pipelineStatus: "passed",
  });

  try {
    await saveV31PipelineResultPayload(pipelineResultPayload, {
      dryRun: false,
      confirmWrite: true,
      debugOnly: true,
      documentId: resolvedDocumentId,
      requireExistingDocument: true,
    });
  } catch (err) {
    console.error("[v31-stage-service] v31Result write error:", err.message);
    return { ok: false, error: "Failed to save final report.", stage: "portfolio" };
  }

  // Mark generation complete — non-fatal if this fails (v31Result is the source of truth)
  try {
    await markV31GenerationComplete({ documentId: resolvedDocumentId });
  } catch (err) {
    console.error("[v31-stage-service] mark complete error (non-fatal):", err.message);
  }

  return { ok: true, status: "ready", skipped: false, reportUrl };
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * Run a single stage of the v3.1 pipeline.
 *
 * @param {Object} options
 * @param {string}  options.documentId     Firestore document ID.
 * @param {string}  [options.assessmentId] Assessment ID (defaults to documentId).
 * @param {"profile"|"transferability"|"hypotheses"|"portfolio"} options.stage
 * @param {boolean} [options.force]        Re-run even if stage is already complete.
 * @returns {Promise<Object>}
 */
export async function runV31PipelineStageForAssessmentV31({
  documentId,
  assessmentId,
  stage,
  force = false,
} = {}) {
  if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
    return { ok: false, error: "documentId must be a non-empty string." };
  }

  if (!VALID_STAGES.includes(stage)) {
    return { ok: false, error: `Invalid stage: ${stage}. Must be one of: ${VALID_STAGES.join(", ")}.` };
  }

  const resolvedDocumentId = documentId.trim();
  const resolvedAssessmentId =
    typeof assessmentId === "string" && assessmentId.trim()
      ? assessmentId.trim()
      : resolvedDocumentId;
  const reportUrl = `/report?documentId=${encodeURIComponent(resolvedDocumentId)}`;

  let state;
  try {
    state = await readV31GenerationDocumentState({ documentId: resolvedDocumentId });
  } catch (err) {
    console.error("[v31-stage-service] read error:", err.message);
    return { ok: false, error: "Failed to read assessment state." };
  }

  if (!state.ok) {
    return { ok: false, error: state.error || "Assessment not found." };
  }

  // If v31Result already exists, no work needed regardless of stage
  if (state.v31ResultExists) {
    return { ok: true, status: "ready", skipped: true, reportUrl };
  }

  const ctx = { state, resolvedDocumentId, resolvedAssessmentId, force, reportUrl };

  switch (stage) {
    case "profile":
      return runProfileStage(ctx);
    case "transferability":
      return runTransferabilityStage(ctx);
    case "hypotheses":
      return runHypothesesStage(ctx);
    case "portfolio":
      return runPortfolioStage(ctx);
    default:
      return { ok: false, error: `Unhandled stage: ${stage}` };
  }
}
