/**
 * Ortheon MVP Cut v3.1 — Auto Report Generation API Route
 *
 * Bundle 26A.
 * POST /api/v31-generate-report
 * Body: { assessmentId }
 *
 * Rules:
 * - POST only.
 * - No API keys, no stack traces, no raw pipeline output returned to client.
 * - Idempotent: returns ok if v31Result already exists (skipped = true).
 * - Requires V31_ENABLE_FIRESTORE_WRITE=true in server environment.
 */

import { runV31PipelineForAssessmentV31 } from "../src/v31/pipeline/runV31PipelineForAssessmentV31.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const { assessmentId } = req.body || {};

  if (
    !assessmentId ||
    typeof assessmentId !== "string" ||
    !assessmentId.trim()
  ) {
    return res.status(400).json({ ok: false, error: "assessmentId is required." });
  }

  const resolvedId = assessmentId.trim();

  let result;
  try {
    result = await runV31PipelineForAssessmentV31({
      documentId: resolvedId,
      assessmentId: resolvedId,
      write: true,
      dryRun: false,
      force: false,
      source: "v31_auto_generation",
    });
  } catch {
    return res.status(500).json({ ok: false, error: "Report generation failed." });
  }

  if (!result.ok) {
    return res.status(500).json({ ok: false, error: "Report generation failed." });
  }

  return res.status(200).json({
    ok: true,
    status: "ready",
    skipped: result.skipped,
    reportUrl: result.reportUrl,
  });
}
