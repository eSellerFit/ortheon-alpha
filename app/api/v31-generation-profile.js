/**
 * Ortheon MVP Cut v3.1 — Staged Generation: Profile Stage
 *
 * Bundle 26B.
 * POST /api/v31-generation-profile
 * Body: { assessmentId }
 *
 * Runs the profile synthesizer stage.
 * Idempotent: if stage is already complete, returns stage_complete without
 * calling Claude. If v31Result already exists, returns ready immediately.
 */

import { runV31PipelineStageForAssessmentV31 } from "../src/v31/pipeline/runV31PipelineStageForAssessmentV31.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const { assessmentId } = req.body || {};

  if (!assessmentId || typeof assessmentId !== "string" || !assessmentId.trim()) {
    return res.status(400).json({ ok: false, error: "assessmentId is required." });
  }

  const resolvedId = assessmentId.trim();

  let result;
  try {
    result = await runV31PipelineStageForAssessmentV31({
      documentId: resolvedId,
      assessmentId: resolvedId,
      stage: "profile",
      force: false,
    });
  } catch {
    return res.status(500).json({ ok: false, error: "Profile stage generation failed." });
  }

  if (!result.ok) {
    return res.status(500).json({ ok: false, error: "Profile stage generation failed." });
  }

  return res.status(200).json({
    ok: true,
    status: result.status,
    stage: "profile",
    skipped: Boolean(result.skipped),
    ...(result.reportUrl ? { reportUrl: result.reportUrl } : {}),
  });
}
