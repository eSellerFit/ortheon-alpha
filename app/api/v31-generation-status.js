/**
 * Ortheon MVP Cut v3.1 — Generation Status
 *
 * Bundle 26G.
 * POST /api/v31-generation-status
 * Body: { assessmentId }
 *
 * Read-only. Returns safe generation state derived from Firestore.
 * Never runs Claude. Never exposes raw stage outputs, raw assessment, or secrets.
 */

import { readV31GenerationDocumentState } from "../src/v31/pipeline/v31StagedGenerationStateAdapter.js";

const STAGE_ORDER = ["profile", "transferability", "hypotheses", "portfolio"];

const INTERNAL_STAGE_NAME = {
  profile: "profileSynthesizer",
  transferability: "transferabilityMapper",
  hypotheses: "directionHypothesisGenerator",
  portfolio: "portfolioComposer",
};

/**
 * Derive completed stages and next pending stage from v31Generation.
 *
 * Note: the portfolio stage uses markV31GenerationComplete (top-level status field)
 * rather than saveV31StageOutput (stages.portfolioComposer). Portfolio is therefore
 * considered done only when v31Generation.status === "complete".
 */
function deriveStagesSummary(v31Generation) {
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

function deriveStatus(v31Generation, completedStages) {
  if (!v31Generation) return "idle";
  // "retrying" checked before lastError — a retry clears lastError but sets status="retrying".
  // A stale lastError from a previous attempt must not flip the UI to failed during retry.
  if (v31Generation.status === "retrying") return "generating";
  if (v31Generation.lastError || v31Generation.status === "failed") return "failed";
  if (completedStages.length > 0) return "partial";
  if (v31Generation.status === "running") return "running";
  return "idle";
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

  let state;
  try {
    state = await readV31GenerationDocumentState({ documentId: resolvedId });
  } catch {
    return res.status(500).json({ ok: false, error: "Failed to read generation state." });
  }

  if (!state.ok) {
    return res.status(404).json({ ok: false, error: state.error || "Assessment not found." });
  }

  const v31Gen = state.v31Generation;
  const m = v31Gen?.metrics;
  const safeMetrics = m
    ? {
        totalMs: m.totalMs ?? null,
        outcome: m.outcome ?? null,
        stages: {
          profile: {
            lastDurationMs: m.stages?.profile?.lastDurationMs ?? null,
            attempts: m.stages?.profile?.attempts ?? null,
          },
          transferability: {
            lastDurationMs: m.stages?.transferability?.lastDurationMs ?? null,
            attempts: m.stages?.transferability?.attempts ?? null,
          },
          hypotheses: {
            lastDurationMs: m.stages?.hypotheses?.lastDurationMs ?? null,
            attempts: m.stages?.hypotheses?.attempts ?? null,
          },
          portfolio: {
            lastDurationMs: m.stages?.portfolio?.lastDurationMs ?? null,
            attempts: m.stages?.portfolio?.attempts ?? null,
            retryRounds: m.stages?.portfolio?.retryRounds ?? null,
          },
        },
      }
    : null;

  if (state.v31ResultExists) {
    return res.status(200).json({
      ok: true,
      status: "ready",
      hasV31Result: true,
      completedStages: [...STAGE_ORDER],
      nextStage: null,
      metrics: safeMetrics,
      reportUrl,
    });
  }

  const { completedStages, nextStage } = deriveStagesSummary(v31Gen);
  const lastError = v31Gen?.lastError || null;
  const status = deriveStatus(v31Gen, completedStages);

  return res.status(200).json({
    ok: true,
    status,
    hasV31Result: false,
    currentStage: v31Gen?.currentStage || null,
    completedStages,
    nextStage,
    failedStage: lastError?.stage || null,
    lastError,
    metrics: safeMetrics,
    reportUrl: null,
  });
}
