/**
 * Ortheon MVP Cut v3.1 — Generation Advance
 *
 * Bundle 26G.
 * POST /api/v31-generation-advance
 * Body: { assessmentId }
 *
 * Reads current generation state, determines the next incomplete stage,
 * and runs exactly that one stage. Returns safe result metadata.
 *
 * Rules:
 * - Runs at most one Claude call per request.
 * - Never exposes raw prompts, raw Claude responses, or secrets.
 * - Never exposes stack traces.
 * - If v31Result already exists, returns ready immediately.
 * - On failure, writes a safe lastError record to Firestore (non-fatal).
 */

import { runV31PipelineStageForAssessmentV31 } from "../src/v31/pipeline/runV31PipelineStageForAssessmentV31.js";
import {
  readV31GenerationDocumentState,
  saveV31GenerationError,
} from "../src/v31/pipeline/v31StagedGenerationStateAdapter.js";

const STAGE_ORDER = ["profile", "transferability", "hypotheses", "portfolio"];

const INTERNAL_STAGE_NAME = {
  profile: "profileSynthesizer",
  transferability: "transferabilityMapper",
  hypotheses: "directionHypothesisGenerator",
  portfolio: "portfolioComposer",
};

/**
 * Derive completed stages and next stage from v31Generation.
 * Portfolio is done only when v31Generation.status === "complete" because
 * markV31GenerationComplete writes the top-level status field, not stages.portfolioComposer.
 */
function deriveCompletedAndNext(v31Generation) {
  const stages = v31Generation?.stages || {};
  const portfolioDone = v31Generation?.status === "complete";

  const completedStages = STAGE_ORDER.filter((s) => {
    if (s === "portfolio") return portfolioDone;
    return stages[INTERNAL_STAGE_NAME[s]]?.status === "complete";
  });

  const nextStage =
    STAGE_ORDER.find((s) => !completedStages.includes(s)) || null;

  return { completedStages, nextStage };
}

async function writeSafeError(documentId, stage, code, safeMessage) {
  try {
    await saveV31GenerationError({ documentId, stage, code, safeMessage });
  } catch {
    // Non-fatal — observability write only.
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const { assessmentId } = req.body || {};

  if (!assessmentId || typeof assessmentId !== "string" || !assessmentId.trim()) {
    return res.status(400).json({ ok: false, error: "assessmentId is required." });
  }

  const resolvedId = assessmentId.trim();
  const reportUrl = `/report?documentId=${encodeURIComponent(resolvedId)}`;

  // Read current state — one Firestore round-trip for routing.
  let state;
  try {
    state = await readV31GenerationDocumentState({ documentId: resolvedId });
  } catch {
    return res.status(500).json({ ok: false, error: "Failed to read assessment state." });
  }

  if (!state.ok) {
    return res.status(404).json({ ok: false, error: state.error || "Assessment not found." });
  }

  // If v31Result already exists, the pipeline is done.
  if (state.v31ResultExists) {
    return res.status(200).json({
      ok: true,
      status: "ready",
      completedStage: null,
      completedStages: [...STAGE_ORDER],
      nextStage: null,
      reportUrl,
    });
  }

  const { completedStages, nextStage } = deriveCompletedAndNext(state.v31Generation);

  // All stages appear complete but v31Result is missing — pipeline is in a broken state.
  if (!nextStage) {
    return res.status(200).json({
      ok: false,
      status: "failed",
      failedStage: "portfolio",
      error: {
        code: "INCOMPLETE_PIPELINE",
        safeMessage:
          "All stages completed but the final report is missing. Please retry.",
        retryable: true,
      },
    });
  }

  // Run exactly one stage — the next incomplete one.
  let result;
  try {
    result = await runV31PipelineStageForAssessmentV31({
      documentId: resolvedId,
      assessmentId: resolvedId,
      stage: nextStage,
      force: false,
    });
  } catch {
    await writeSafeError(
      resolvedId,
      nextStage,
      "STAGE_EXCEPTION",
      `An unexpected error occurred in the ${nextStage} stage.`
    );
    return res.status(500).json({
      ok: false,
      status: "failed",
      failedStage: nextStage,
      error: {
        code: "STAGE_EXCEPTION",
        safeMessage: `An unexpected error occurred in the ${nextStage} stage.`,
        retryable: true,
      },
    });
  }

  if (!result.ok) {
    await writeSafeError(
      resolvedId,
      nextStage,
      "STAGE_FAILED",
      result.error || `The ${nextStage} stage failed.`
    );
    return res.status(500).json({
      ok: false,
      status: "failed",
      failedStage: nextStage,
      error: {
        code: "STAGE_FAILED",
        safeMessage: result.error || `The ${nextStage} stage failed.`,
        retryable: true,
      },
    });
  }

  // Stage succeeded. Compute updated completed list without a second Firestore read.
  const nowCompleted = completedStages.includes(nextStage)
    ? completedStages
    : [...completedStages, nextStage];
  const newNextStage = STAGE_ORDER.find((s) => !nowCompleted.includes(s)) || null;

  // Portfolio complete → v31Result has been written.
  if (result.status === "ready") {
    return res.status(200).json({
      ok: true,
      status: "ready",
      completedStage: nextStage,
      completedStages: nowCompleted,
      nextStage: null,
      reportUrl: result.reportUrl || reportUrl,
    });
  }

  return res.status(200).json({
    ok: true,
    status: "stage_complete",
    completedStage: nextStage,
    completedStages: nowCompleted,
    nextStage: newNextStage,
    reportUrl: null,
  });
}
