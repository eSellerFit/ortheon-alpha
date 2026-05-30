/**
 * Ortheon MVP Cut v3.1 — Generation Advance
 *
 * Bundle 26G / 27A.
 * POST /api/v31-generation-advance
 * Body: { assessmentId } | { assessmentId, trigger: "qstash" }
 *
 * Reads current generation state, determines the next incomplete stage,
 * and runs exactly that one stage. Returns safe result metadata.
 *
 * QStash (Bundle 27A):
 * - When trigger="qstash" or upstash-signature header is present, verifies
 *   the QStash JWT signature before proceeding.
 * - After a successful stage_complete, enqueues the next QStash message so
 *   the pipeline continues server-side without the browser staying open.
 * - Manual/curl calls (no trigger, no signature header) are unchanged.
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
  saveV31GenerationTriggerMeta,
  saveV31GenerationRetryState,
} from "../src/v31/pipeline/v31StagedGenerationStateAdapter.js";
import {
  verifyQstashSignature,
  publishNextV31Advance,
} from "../src/v31/pipeline/qstashV31Helper.js";

const STAGE_ORDER = ["profile", "transferability", "hypotheses", "portfolio"];

// ── Stage-level retry policy ───────────────────────────────────────────────────

const MAX_STAGE_RETRY_ROUNDS = 3;
const STAGE_RETRY_DELAYS_SECONDS = [30, 90, 180];

// Codes that indicate a transient upstream/network failure worth retrying.
// STAGE_EXCEPTION is retryable only for the portfolio stage (heavyweight Claude call).
// PORTFOLIO_UNKNOWN is retryable only when the safe message confirms a Claude API failure.
const BASE_RETRYABLE_CODES = new Set([
  "CLAUDE_RATE_LIMIT",
  "CLAUDE_UPSTREAM_ERROR",
  "CLAUDE_NETWORK_ERROR",
  "CLAUDE_TIMEOUT",
  "CLAUDE_EMPTY_RESPONSE",
]);

function isRetryableCode(code, stage, safeMessage) {
  if (BASE_RETRYABLE_CODES.has(code)) return true;
  if (code === "STAGE_EXCEPTION" && stage === "portfolio") return true;
  if (
    code === "PORTFOLIO_UNKNOWN" &&
    typeof safeMessage === "string" &&
    safeMessage.includes("Claude API call failed")
  ) return true;
  return false;
}

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

async function writeSafeError(documentId, stage, code, safeMessage, detailHint) {
  try {
    await saveV31GenerationError({ documentId, stage, code, safeMessage, detailHint });
  } catch {
    // Non-fatal — observability write only.
  }
}

async function writeTriggerMeta(documentId, trigger, lastQstashMessageId) {
  try {
    await saveV31GenerationTriggerMeta({ documentId, trigger, lastQstashMessageId });
  } catch {
    // Non-fatal — observability write only.
  }
}

/**
 * Attempt to schedule a stage-level retry via a delayed QStash message.
 *
 * Returns { scheduled: true, retryRound, delaySeconds } on success,
 * or { scheduled: false } if not eligible or if QStash publish fails.
 *
 * Only fires for QStash-driven requests (isQstash=true) — manual/curl
 * calls fall through directly to the failure path.
 */
async function tryScheduleRetry({ isQstash, resolvedId, nextStage, code, safeMessage, detailHint, state }) {
  if (!isQstash) return { scheduled: false };
  if (!isRetryableCode(code, nextStage, safeMessage)) return { scheduled: false };

  const currentRound = state.v31Generation?.retry?.round || 0;
  const retryRound = currentRound + 1;
  if (retryRound > MAX_STAGE_RETRY_ROUNDS) return { scheduled: false };

  const delaySeconds = STAGE_RETRY_DELAYS_SECONDS[retryRound - 1];
  const publishResult = await publishNextV31Advance(resolvedId, { delaySeconds });

  if (!publishResult.ok) {
    console.error("[v31-generation-advance] retry publish failed:", JSON.stringify({
      assessmentId: resolvedId,
      stage: nextStage,
      retryRound,
      error: publishResult.error,
    }));
    return { scheduled: false };
  }

  const now = new Date().toISOString();
  const nextAttemptAt = new Date(Date.now() + delaySeconds * 1000).toISOString();
  try {
    await saveV31GenerationRetryState({
      documentId: resolvedId,
      stage: nextStage,
      round: retryRound,
      scheduledAt: now,
      nextAttemptAt,
      reason: code,
      messageId: publishResult.messageId || null,
      lastRetryableError: {
        code,
        failedAt: now,
        ...(detailHint ? { detailHint } : {}),
      },
    });
  } catch {
    // Non-fatal — observability write only. Retry is still scheduled.
  }

  console.log("[v31-generation-advance] retry_scheduled:", JSON.stringify({
    assessmentId: resolvedId,
    stage: nextStage,
    retryRound,
    delaySeconds,
    messageId: publishResult.messageId,
  }));

  return { scheduled: true, retryRound, delaySeconds };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const { assessmentId, trigger, action } = req.body || {};

  // ── QStash start action ────────────────────────────────────────────────────
  // Publishes the first QStash advance message without running any stage.
  // Used to kick off server-side generation from curl or a future submit hook.

  if (action === "start-qstash") {
    if (!assessmentId || typeof assessmentId !== "string" || !assessmentId.trim()) {
      return res.status(400).json({ ok: false, error: "assessmentId is required." });
    }
    const startId = assessmentId.trim();
    const result = await publishNextV31Advance(startId);
    if (!result.ok) {
      console.error("[v31-generation-advance] start-qstash publish failed:", JSON.stringify({
        assessmentId: startId,
        error: result.error,
      }));
      return res.status(500).json({ ok: false, error: result.error || "Failed to enqueue generation job." });
    }
    console.log("[v31-generation-advance] start-qstash queued:", JSON.stringify({
      assessmentId: startId,
      messageId: result.messageId,
    }));
    return res.status(200).json({
      ok: true,
      status: "queued",
      assessmentId: startId,
      messageId: result.messageId,
    });
  }

  if (!assessmentId || typeof assessmentId !== "string" || !assessmentId.trim()) {
    return res.status(400).json({ ok: false, error: "assessmentId is required." });
  }

  const resolvedId = assessmentId.trim();
  const resolvedTrigger = trigger === "qstash" ? "qstash" : "manual";
  const reportUrl = `/report?documentId=${encodeURIComponent(resolvedId)}`;

  // ── QStash signature verification ──────────────────────────────────────────
  // Required when trigger="qstash" or upstash-signature header is present.
  // Manual/curl calls (no trigger, no header) skip verification.

  const signatureHeader = req.headers?.["upstash-signature"] || "";
  const isQstash = resolvedTrigger === "qstash" || !!signatureHeader;

  if (isQstash) {
    if (!signatureHeader) {
      // Claimed to be a QStash request but no signature supplied.
      return res.status(401).json({ ok: false, error: "QStash signature header required." });
    }

    // Reconstruct raw body string for body-hash verification.
    // Vercel pre-parses JSON bodies so the stream is consumed; JSON.stringify(req.body)
    // reproduces the exact bytes because we control the published message format.
    const rawBodyStr = JSON.stringify(req.body);

    const verification = await verifyQstashSignature(signatureHeader, rawBodyStr);

    if (!verification.ok) {
      console.error("[v31-generation-advance] QStash verification failed:", JSON.stringify({
        assessmentId: resolvedId,
        reason: verification.reason,
      }));
      // Return 401 so QStash does not retry (4xx = no retry in QStash).
      return res.status(401).json({ ok: false, error: "QStash signature verification failed." });
    }
  }

  // ── Read current state ─────────────────────────────────────────────────────

  let state;
  try {
    state = await readV31GenerationDocumentState({ documentId: resolvedId });
  } catch {
    return res.status(500).json({ ok: false, error: "Failed to read assessment state." });
  }

  if (!state.ok) {
    return res.status(404).json({ ok: false, error: state.error || "Assessment not found." });
  }

  // If v31Result already exists, the pipeline is done — do not enqueue another message.
  if (state.v31ResultExists) {
    console.log("[v31-generation-advance]", JSON.stringify({
      assessmentId: resolvedId,
      trigger: resolvedTrigger,
      status: "ready",
      qstashEnqueued: false,
    }));
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

  // All stages appear complete but v31Result is missing — broken pipeline state.
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

  // ── Run exactly one stage ──────────────────────────────────────────────────

  let result;
  try {
    result = await runV31PipelineStageForAssessmentV31({
      documentId: resolvedId,
      assessmentId: resolvedId,
      stage: nextStage,
      force: false,
    });
  } catch (stageErr) {
    const code = "STAGE_EXCEPTION";
    const safeMessage = `An unexpected error occurred in the ${nextStage} stage.`;
    const exceptionHint = `${stageErr?.name || "Error"}: ${String(stageErr?.message || "").slice(0, 100)}`;
    console.error("[v31-generation-advance] stage exception:", JSON.stringify({
      assessmentId: resolvedId,
      stage: nextStage,
      trigger: resolvedTrigger,
      code,
      errorName: stageErr?.name,
      errorMessage: String(stageErr?.message || "").slice(0, 200),
    }));
    const retryResult = await tryScheduleRetry({
      isQstash, resolvedId, nextStage, code, safeMessage, detailHint: exceptionHint, state,
    });
    if (retryResult.scheduled) {
      return res.status(200).json({
        ok: true,
        status: "retry_scheduled",
        retryRound: retryResult.retryRound,
        delaySeconds: retryResult.delaySeconds,
      });
    }
    await writeSafeError(resolvedId, nextStage, code, safeMessage, exceptionHint);
    return res.status(500).json({
      ok: false,
      status: "failed",
      failedStage: nextStage,
      error: { code, safeMessage, retryable: true },
    });
  }

  if (!result.ok) {
    const code = result.code || "STAGE_FAILED";
    const safeMessage = result.error || `The ${nextStage} stage failed.`;
    const detailHint = result.detailHint || null;
    console.error("[v31-generation-advance] stage failed:", JSON.stringify({
      assessmentId: resolvedId,
      stage: nextStage,
      trigger: resolvedTrigger,
      code,
      detailHint,
      safeMessage: String(safeMessage).slice(0, 200),
    }));
    const retryResult = await tryScheduleRetry({
      isQstash, resolvedId, nextStage, code, safeMessage, detailHint, state,
    });
    if (retryResult.scheduled) {
      return res.status(200).json({
        ok: true,
        status: "retry_scheduled",
        retryRound: retryResult.retryRound,
        delaySeconds: retryResult.delaySeconds,
      });
    }
    await writeSafeError(resolvedId, nextStage, code, safeMessage, detailHint);
    return res.status(500).json({
      ok: false,
      status: "failed",
      failedStage: nextStage,
      error: { code, safeMessage, retryable: true },
    });
  }

  // ── Stage succeeded ────────────────────────────────────────────────────────

  const nowCompleted = completedStages.includes(nextStage)
    ? completedStages
    : [...completedStages, nextStage];
  const newNextStage = STAGE_ORDER.find((s) => !nowCompleted.includes(s)) || null;

  // Portfolio complete → v31Result written → pipeline done.
  if (result.status === "ready") {
    console.log("[v31-generation-advance]", JSON.stringify({
      assessmentId: resolvedId,
      trigger: resolvedTrigger,
      completedStage: nextStage,
      status: "ready",
      qstashEnqueued: false,
    }));
    await writeTriggerMeta(resolvedId, resolvedTrigger, null);
    return res.status(200).json({
      ok: true,
      status: "ready",
      completedStage: nextStage,
      completedStages: nowCompleted,
      nextStage: null,
      reportUrl: result.reportUrl || reportUrl,
    });
  }

  // ── Enqueue next QStash message ────────────────────────────────────────────
  // Only when QStash is driving and there is a next stage to run.

  let qstashEnqueued = false;
  let qstashMessageId = null;

  if (isQstash && newNextStage) {
    const publishResult = await publishNextV31Advance(resolvedId);
    if (publishResult.ok) {
      qstashEnqueued = true;
      qstashMessageId = publishResult.messageId || null;
    } else {
      console.error("[v31-generation-advance] QStash publish failed:", JSON.stringify({
        assessmentId: resolvedId,
        nextStage: newNextStage,
        error: publishResult.error,
      }));
      // Non-fatal for the response — the browser/handoff UI can still drive
      // the next stage manually if QStash publish fails.
    }
  }

  console.log("[v31-generation-advance]", JSON.stringify({
    assessmentId: resolvedId,
    trigger: resolvedTrigger,
    completedStage: nextStage,
    nextStage: newNextStage,
    status: "stage_complete",
    qstashEnqueued,
    qstashMessageId,
  }));

  await writeTriggerMeta(resolvedId, resolvedTrigger, qstashMessageId);

  return res.status(200).json({
    ok: true,
    status: "stage_complete",
    completedStage: nextStage,
    completedStages: nowCompleted,
    nextStage: newNextStage,
    reportUrl: null,
  });
}
