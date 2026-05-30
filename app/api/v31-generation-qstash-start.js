/**
 * Ortheon MVP Cut v3.1 — QStash Generation Start (temporary test endpoint)
 *
 * Bundle 27A.1.
 * POST /api/v31-generation-qstash-start
 * Body: { assessmentId }
 *
 * Publishes the first QStash advance message so the server-side generation
 * chain can be tested without modifying the assessment submit flow or UI.
 *
 * Rules:
 * - Does not run Claude.
 * - Does not run any generation stage directly.
 * - Does not expose QSTASH_TOKEN, signing keys, or secrets.
 * - Does not log secrets.
 */

import { publishNextV31Advance } from "../src/v31/pipeline/qstashV31Helper.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const { assessmentId } = req.body || {};

  if (!assessmentId || typeof assessmentId !== "string" || !assessmentId.trim()) {
    return res.status(400).json({ ok: false, error: "assessmentId is required." });
  }

  const resolvedId = assessmentId.trim();

  const result = await publishNextV31Advance(resolvedId);

  if (!result.ok) {
    console.error("[v31-generation-qstash-start] publish failed:", JSON.stringify({
      assessmentId: resolvedId,
      error: result.error,
    }));
    return res.status(500).json({
      ok: false,
      error: result.error || "Failed to enqueue generation job.",
    });
  }

  console.log("[v31-generation-qstash-start]", JSON.stringify({
    assessmentId: resolvedId,
    messageId: result.messageId,
  }));

  return res.status(200).json({
    ok: true,
    status: "queued",
    assessmentId: resolvedId,
    messageId: result.messageId,
  });
}
