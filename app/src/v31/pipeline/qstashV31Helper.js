/**
 * Ortheon MVP Cut v3.1 — QStash Helper
 *
 * Bundle 27A.4.
 * QStash signature verification and message publishing using the official
 * @upstash/qstash SDK.
 *
 * Rules:
 * - Never log or expose QSTASH_TOKEN, signing keys, or secrets.
 * - All exports return { ok, ... } result objects — never throw.
 *
 * Raw body note:
 * Vercel pre-parses JSON request bodies before the handler runs, consuming the
 * stream. Raw body access is not available in standard Vercel Node.js functions
 * (export const config is a Next.js-only feature). Callers must pass
 * JSON.stringify(req.body) as the rawBodyStr — this is stable because we control
 * the exact JSON format we publish.
 */

import { Client, Receiver } from "@upstash/qstash";

// ── Exports ────────────────────────────────────────────────────────────────────

/**
 * Verify the upstash-signature JWT from a QStash delivery.
 *
 * Uses the official Receiver which handles CURRENT/NEXT key rotation,
 * JWT expiry checks, issuer checks, and body hash verification internally.
 *
 * @param {string} signatureJwt  Value of the upstash-signature request header.
 * @param {string} rawBodyStr    Raw request body — pass JSON.stringify(req.body).
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function verifyQstashSignature(signatureJwt, rawBodyStr) {
  if (!signatureJwt || typeof signatureJwt !== "string") {
    return { ok: false, reason: "missing_signature_header" };
  }

  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey && !nextKey) {
    return { ok: false, reason: "signing_keys_not_configured" };
  }

  const receiver = new Receiver({
    currentSigningKey: currentKey || "",
    nextSigningKey: nextKey || "",
  });

  const baseUrl = process.env.APP_BASE_URL;
  const url = baseUrl
    ? `${baseUrl.replace(/\/+$/, "")}/api/v31-generation-advance`
    : undefined;

  try {
    await receiver.verify({
      signature: signatureJwt,
      body: rawBodyStr,
      url,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: String(err?.message || "verification_failed").slice(0, 100),
    };
  }
}

/**
 * Publish one POST /api/v31-generation-advance message via QStash.
 *
 * Requires env vars:
 *   QSTASH_TOKEN   — Upstash QStash API token
 *   QSTASH_URL     — Upstash regional API endpoint (e.g. https://qstash-us-east-1.upstash.io)
 *   APP_BASE_URL   — e.g. https://www.ortheon.app
 *
 * @param {string} assessmentId
 * @returns {Promise<{ ok: boolean, messageId?: string | null, error?: string }>}
 */
export async function publishNextV31Advance(assessmentId) {
  const token = process.env.QSTASH_TOKEN;
  const appBaseUrl = process.env.APP_BASE_URL;

  if (!token || !appBaseUrl) {
    return {
      ok: false,
      error: "QStash not configured (QSTASH_TOKEN or APP_BASE_URL missing).",
    };
  }

  // Use QSTASH_URL env var for the regional Upstash API endpoint.
  // Defaults to US East — override with QSTASH_URL for other regions.
  const qstashBaseUrl = (process.env.QSTASH_URL || "https://qstash-us-east-1.upstash.io").replace(/\/+$/, "");
  const dest = `${appBaseUrl.replace(/\/+$/, "")}/api/v31-generation-advance`;

  try {
    const client = new Client({ token, baseUrl: qstashBaseUrl });
    const result = await client.publishJSON({
      url: dest,
      body: { assessmentId, trigger: "qstash" },
    });
    const messageId = result?.messageId ?? result?.messageID ?? null;
    console.log("[qstashV31Helper] published:", JSON.stringify({
      qstashHost: new URL(qstashBaseUrl).host,
      destPath: "/api/v31-generation-advance",
      messageId,
    }));
    return { ok: true, messageId };
  } catch (err) {
    return {
      ok: false,
      error: `QStash publish error: ${String(err?.message || "").slice(0, 100)}`,
    };
  }
}
