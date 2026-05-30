/**
 * Ortheon MVP Cut v3.1 — QStash Helper
 *
 * Bundle 27A.
 * QStash signature verification and message publishing for the v3.1 generation pipeline.
 *
 * Rules:
 * - Never log or expose QSTASH_TOKEN, signing keys, or secrets.
 * - Signature verification tries CURRENT key then NEXT key (rotation support).
 * - All exports return { ok, ... } result objects — never throw.
 * - No external npm dependencies — uses Node.js built-in crypto and global fetch.
 */

import { createHmac, createHash, timingSafeEqual } from "crypto";

const QSTASH_PUBLISH_BASE = "https://qstash.upstash.io/v2/publish/";

// ── JWT helpers ────────────────────────────────────────────────────────────────

function base64UrlDecode(str) {
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/**
 * Verify a HS256 JWT against a single signing key.
 * Returns { ok: true, payload } or { ok: false, reason }.
 */
function verifyJwtWithKey(token, signingKey) {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed_jwt" };

  const [headerB64, payloadB64, signatureB64] = parts;
  const data = `${headerB64}.${payloadB64}`;

  const expected = createHmac("sha256", signingKey).update(data).digest();

  let actual;
  try {
    actual = base64UrlDecode(signatureB64);
  } catch {
    return { ok: false, reason: "bad_signature_encoding" };
  }

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { ok: false, reason: "signature_invalid" };
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
  } catch {
    return { ok: false, reason: "bad_payload" };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && nowSec > payload.exp) return { ok: false, reason: "jwt_expired" };
  if (payload.nbf && nowSec < payload.nbf) return { ok: false, reason: "jwt_not_yet_valid" };
  if (payload.iss !== "Upstash") return { ok: false, reason: "wrong_issuer" };

  return { ok: true, payload };
}

// ── Exports ────────────────────────────────────────────────────────────────────

/**
 * Verify the upstash-signature JWT from a QStash delivery.
 *
 * Tries QSTASH_CURRENT_SIGNING_KEY then QSTASH_NEXT_SIGNING_KEY for key rotation.
 * Also verifies the body hash claim (SHA-256 of rawBodyStr, base64-encoded).
 *
 * rawBodyStr must be the exact JSON string the endpoint received — reconstruct
 * from req.body via JSON.stringify(req.body) since Vercel pre-parses JSON bodies.
 *
 * @param {string} signatureJwt  Value of the upstash-signature request header.
 * @param {string} rawBodyStr    Raw request body as a string.
 * @returns {{ ok: boolean, reason?: string, jti?: string | null }}
 */
export function verifyQstashSignature(signatureJwt, rawBodyStr) {
  if (!signatureJwt || typeof signatureJwt !== "string") {
    return { ok: false, reason: "missing_signature_header" };
  }

  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey && !nextKey) {
    return { ok: false, reason: "signing_keys_not_configured" };
  }

  // Try current key, then next key
  let result = null;
  if (currentKey) result = verifyJwtWithKey(signatureJwt, currentKey);
  if ((!result || !result.ok) && nextKey) result = verifyJwtWithKey(signatureJwt, nextKey);

  if (!result || !result.ok) return result || { ok: false, reason: "signature_invalid" };

  // Verify body hash if the claim is present.
  // QStash encodes it as standard base64(SHA-256(rawBodyBytes)).
  const bodyHashClaim = result.payload?.body;
  if (bodyHashClaim && rawBodyStr != null) {
    const actualHash = createHash("sha256").update(rawBodyStr, "utf8").digest("base64");
    if (bodyHashClaim !== actualHash) {
      return { ok: false, reason: "body_hash_mismatch" };
    }
  }

  return { ok: true, jti: result.payload?.jti || null };
}

/**
 * Publish one POST /api/v31-generation-advance message via QStash.
 *
 * Requires env vars:
 *   QSTASH_TOKEN     — Upstash QStash API token
 *   APP_BASE_URL     — e.g. https://www.ortheon.app
 *
 * @param {string} assessmentId
 * @returns {Promise<{ ok: boolean, messageId?: string | null, error?: string }>}
 */
export async function publishNextV31Advance(assessmentId) {
  const token = process.env.QSTASH_TOKEN;
  const baseUrl = process.env.APP_BASE_URL;

  if (!token || !baseUrl) {
    return {
      ok: false,
      error: "QStash not configured (QSTASH_TOKEN or APP_BASE_URL missing).",
    };
  }

  const dest = `${baseUrl.replace(/\/$/, "")}/api/v31-generation-advance`;
  const body = JSON.stringify({ assessmentId, trigger: "qstash" });

  let resp;
  let data;
  try {
    resp = await fetch(`${QSTASH_PUBLISH_BASE}${encodeURIComponent(dest)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });
    data = await resp.json().catch(() => ({}));
  } catch (err) {
    return {
      ok: false,
      error: `QStash publish network error: ${String(err?.message || "").slice(0, 100)}`,
    };
  }

  if (!resp.ok) {
    return {
      ok: false,
      error: `QStash publish failed (HTTP ${resp.status}).`,
    };
  }

  return { ok: true, messageId: data?.messageId || null };
}
