/**
 * Ortheon MVP Cut v3.1 — Firestore Persistence Adapter
 *
 * Purpose:
 * Build and optionally execute an isolated v3.1 result persistence plan.
 *
 * Important:
 * - Dry-run is the default.
 * - Writes target only the isolated nested v31Result field by default.
 * - This adapter does not write legacy result fields such as
 *   directionRecommendations, careerMap, primaryDirections, or report sections.
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const FORBIDDEN_LEGACY_FIELDS = new Set([
  "directionRecommendations",
  "careerMap",
  "primaryDirections",
  "reportSections",
  "report",
  "legacyResults",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringOrNull(value) {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function countFinalDirections(payload) {
  return payload?.finalPortfolio?.directions?.length || 0;
}

function touchesForbiddenLegacyField(fieldPath) {
  const topLevelField = String(fieldPath || "").split(".")[0];
  return FORBIDDEN_LEGACY_FIELDS.has(topLevelField);
}

function buildNestedPayload(fieldPath, value) {
  return String(fieldPath)
    .split(".")
    .filter(Boolean)
    .reverse()
    .reduce((current, field) => ({ [field]: current }), value);
}

function realWriteEnabled(options) {
  return (
    options.dryRun === false &&
    options.confirmWrite === true &&
    options.debugOnly === true &&
    process.env.V31_ENABLE_FIRESTORE_WRITE === "true"
  );
}

/**
 * Build a dry-run Firestore persistence plan for a v3.1 pipeline result.
 *
 * @param {Object} payload V31PipelineResultPayload
 * @param {Object} options
 * @returns {Object}
 */
export function buildV31FirestorePersistencePlan(payload, options = {}) {
  if (!isObject(payload)) {
    throw new Error(
      "buildV31FirestorePersistencePlan expected a V31PipelineResultPayload object."
    );
  }

  if (payload.version !== "v3.1") {
    throw new Error(
      "buildV31FirestorePersistencePlan expected payload.version to be v3.1."
    );
  }

  if (payload.stage !== "v31_pipeline_result") {
    throw new Error(
      "buildV31FirestorePersistencePlan expected payload.stage to be v31_pipeline_result."
    );
  }

  const assessmentId = stringOrNull(payload.assessmentId);

  if (!assessmentId) {
    throw new Error(
      "buildV31FirestorePersistencePlan expected payload.assessmentId to be a non-empty string."
    );
  }

  const collectionName =
    stringOrNull(options.collectionName) || "assessments";
  const documentId = stringOrNull(options.documentId) || assessmentId;
  const nestedFieldPath =
    stringOrNull(options.nestedFieldPath) || "v31Result";
  const mode = stringOrNull(options.mode) || "merge";
  const forbiddenLegacyFieldsTouched =
    touchesForbiddenLegacyField(nestedFieldPath);

  return {
    version: "v3.1",
    stage: "v31_firestore_persistence_plan",
    assessmentId,
    collectionName,
    documentId,
    nestedFieldPath,
    mode,
    willWriteFields: [nestedFieldPath],
    forbiddenLegacyFieldsTouched,
    payloadSummary: {
      pipelineStatus: payload.pipelineStatus,
      hasFinalPortfolio: Boolean(payload.finalPortfolio),
      finalDirectionCount: countFinalDirections(payload),
      generatedAt: payload.generatedAt,
      source: payload.source,
    },
  };
}

/**
 * Save a v3.1 pipeline result payload, or return the write plan in dry-run mode.
 *
 * @param {Object} payload V31PipelineResultPayload
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export async function saveV31PipelineResultPayload(payload, options = {}) {
  const plan = buildV31FirestorePersistencePlan(payload, options);

  if (options.dryRun !== false) {
    return {
      ok: true,
      dryRun: true,
      plan,
      wrote: false,
    };
  }

  if (!realWriteEnabled(options)) {
    throw new Error(
      "Real Firestore write is blocked. Enable dryRun:false, confirmWrite:true, debugOnly:true, and V31_ENABLE_FIRESTORE_WRITE=true."
    );
  }

  if (plan.forbiddenLegacyFieldsTouched) {
    throw new Error(
      "Refusing to write v3.1 pipeline result into a legacy result field."
    );
  }

  if (plan.nestedFieldPath !== "v31Result") {
    throw new Error(
      "Real Firestore write is restricted to nestedFieldPath v31Result."
    );
  }

  const assessmentRef = doc(db, plan.collectionName, plan.documentId);
  const assessmentSnap = await getDoc(assessmentRef);
  const documentExistsBeforeWrite = assessmentSnap.exists();

  if (
    options.requireExistingDocument !== false &&
    !documentExistsBeforeWrite
  ) {
    throw new Error(
      "Target assessment document does not exist. Refusing to create a new document from v31 persistence adapter."
    );
  }

  const writePayload = buildNestedPayload(plan.nestedFieldPath, payload);

  await setDoc(assessmentRef, writePayload, { merge: true });

  return {
    ok: true,
    dryRun: false,
    plan,
    wrote: true,
    documentExistsBeforeWrite,
  };
}
