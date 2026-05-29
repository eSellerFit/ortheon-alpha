/**
 * Ortheon MVP Cut v3.1 — Staged Generation State Adapter
 *
 * Bundle 26B.
 * Firestore R/W for assessments/{documentId}.v31Generation.
 * Single-read helper for staged pipeline orchestration.
 *
 * Rules:
 * - Reads are always allowed.
 * - Writes require V31_ENABLE_FIRESTORE_WRITE=true.
 * - Never stores rawAssessment, stack traces, or raw Claude response bodies.
 * - Never touches v31Result or legacy result fields.
 */

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

// Fields excluded when building the sanitized assessment for pipeline use.
// Mirrors readAssessmentForV31Replay.js + removes v31Generation.
const EXCLUDED_FROM_ASSESSMENT = new Set([
  "v31Result",
  "directionRecommendations",
  "careerMap",
  "primaryDirections",
  "reportSections",
  "report",
  "v31Generation",
]);

// Firestore internal stage key for each stage name.
const INTERNAL_STAGE_NAME = {
  profile: "profileSynthesizer",
  transferability: "transferabilityMapper",
  hypotheses: "directionHypothesisGenerator",
  portfolio: "portfolioComposer",
};

// What currentStage advances to after each stage completes.
const NEXT_STAGE = {
  profile: "transferability",
  transferability: "hypotheses",
  hypotheses: "portfolio",
  portfolio: "complete",
};

function writeEnabled() {
  return process.env.V31_ENABLE_FIRESTORE_WRITE === "true";
}

/**
 * Read the full document in one trip. Returns:
 * - v31ResultExists: whether assessments/{documentId}.v31Result is set
 * - v31Generation: the v31Generation field, or null
 * - assessment: sanitized assessment data (no result fields, no v31Generation)
 */
export async function readV31GenerationDocumentState({ documentId }) {
  if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
    return { ok: false, documentExists: false, error: "documentId required." };
  }

  const trimmedId = documentId.trim();
  const ref = doc(db, "assessments", trimmedId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { ok: false, documentExists: false, error: "Assessment not found." };
  }

  const data = snap.data();

  const assessment = { id: trimmedId };
  for (const [key, value] of Object.entries(data)) {
    if (!EXCLUDED_FROM_ASSESSMENT.has(key)) {
      assessment[key] = value;
    }
  }

  return {
    ok: true,
    documentExists: true,
    v31ResultExists: Boolean(data.v31Result),
    v31Generation: data.v31Generation || null,
    assessment,
  };
}

/**
 * Initialize the v31Generation tracking field on the document.
 * Call only when v31Generation is null (not yet created).
 * Safe with merge:true — does not touch other document fields.
 */
export async function initV31GenerationState({ documentId }) {
  if (!writeEnabled()) {
    throw new Error(
      "V31_ENABLE_FIRESTORE_WRITE=true is required for staged generation."
    );
  }

  const now = new Date().toISOString();
  const ref = doc(db, "assessments", documentId.trim());

  await setDoc(
    ref,
    {
      v31Generation: {
        status: "running",
        currentStage: "profile",
        startedAt: now,
        updatedAt: now,
        completedAt: null,
        errorMessage: null,
        stages: {
          profileSynthesizer: { status: "pending" },
          transferabilityMapper: { status: "pending" },
          directionHypothesisGenerator: { status: "pending" },
          portfolioComposer: { status: "pending" },
        },
      },
    },
    { merge: true }
  );
}

/**
 * Write a completed stage output using dot-notation updateDoc so other
 * nested v31Generation fields (e.g. sibling stages) are not overwritten.
 *
 * @param {Object} options
 * @param {string} options.documentId
 * @param {"profile"|"transferability"|"hypotheses"|"portfolio"} options.stage
 * @param {Object} options.output  Normalized stage output only (no raw Claude body).
 * @param {Object} options.apiUsage  Safe usage metadata.
 */
export async function saveV31StageOutput({
  documentId,
  stage,
  output,
  apiUsage,
}) {
  if (!writeEnabled()) {
    throw new Error(
      "V31_ENABLE_FIRESTORE_WRITE=true is required for staged generation."
    );
  }

  const internalName = INTERNAL_STAGE_NAME[stage];
  if (!internalName) {
    throw new Error(`Unknown stage: ${stage}`);
  }

  const now = new Date().toISOString();
  const nextStage = NEXT_STAGE[stage] || "complete";
  const ref = doc(db, "assessments", documentId.trim());

  await updateDoc(ref, {
    [`v31Generation.stages.${internalName}`]: {
      status: "complete",
      output,
      apiUsage,
      completedAt: now,
    },
    "v31Generation.currentStage": nextStage,
    "v31Generation.updatedAt": now,
    "v31Generation.status": "running",
  });
}

/**
 * Write a safe error record under v31Generation.lastError.
 * Called by advance endpoint on stage failure.
 * Non-fatal caller side — wrap in try/catch.
 *
 * @param {Object} options
 * @param {string} options.documentId
 * @param {string} options.stage       Public stage name ("profile" | …)
 * @param {string} options.code        Short error code string
 * @param {string} options.safeMessage User-safe message (no stack traces, no secrets)
 * @param {string} [options.detailHint] Optional non-sensitive diagnostic hint for ops (not exposed to frontend)
 */
export async function saveV31GenerationError({
  documentId,
  stage,
  code,
  safeMessage,
  detailHint,
}) {
  if (!writeEnabled()) {
    throw new Error(
      "V31_ENABLE_FIRESTORE_WRITE=true is required for staged generation."
    );
  }

  const now = new Date().toISOString();
  const ref = doc(db, "assessments", documentId.trim());

  await updateDoc(ref, {
    "v31Generation.status": "failed",
    "v31Generation.updatedAt": now,
    "v31Generation.lastError": {
      stage,
      code,
      safeMessage,
      failedAt: now,
      retryable: true,
      ...(detailHint ? { detailHint } : {}),
    },
  });
}

/**
 * Mark generation complete after v31Result has been written successfully.
 * Non-fatal if this fails — v31Result is the authoritative source.
 */
export async function markV31GenerationComplete({ documentId }) {
  if (!writeEnabled()) {
    throw new Error(
      "V31_ENABLE_FIRESTORE_WRITE=true is required for staged generation."
    );
  }

  const now = new Date().toISOString();
  const ref = doc(db, "assessments", documentId.trim());

  await updateDoc(ref, {
    "v31Generation.status": "complete",
    "v31Generation.currentStage": "complete",
    "v31Generation.completedAt": now,
    "v31Generation.updatedAt": now,
  });
}
