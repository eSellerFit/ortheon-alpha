/**
 * Ortheon MVP Cut v3.1 — Firestore-to-Report-View-Model Reader
 *
 * Bundle 18C read-only helper.
 * Chains the existing internal view model reader with the user-facing
 * report view model builder.
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls.
 * - Does not return raw Firestore document, raw v31Result, or legacy fields.
 * - Does not return raw Claude output.
 */

import { readV31ResultViewModelFromFirestoreV31 } from "../viewer/readV31ResultViewModelFromFirestore.js";
import { buildV31UserFacingReportViewModelV31 } from "./buildV31UserFacingReportViewModel.js";

/**
 * Read assessments/{documentId}.v31Result and return a user-facing report view model.
 *
 * @param {Object} options
 * @param {string} options.documentId
 * @param {string} [options.collectionName="assessments"]
 * @returns {Promise<Object>}
 */
export async function readV31UserFacingReportFromFirestoreV31({
  documentId,
  collectionName = "assessments",
} = {}) {
  const readResult = await readV31ResultViewModelFromFirestoreV31({
    documentId,
    collectionName,
  });

  if (!readResult.ok) {
    return {
      ok: false,
      documentId: readResult.documentId || (typeof documentId === "string" ? documentId.trim() : ""),
      collectionName,
      error: readResult.error,
      documentExists: readResult.documentExists,
      hasV31Result: readResult.hasV31Result,
    };
  }

  const reportViewModel = buildV31UserFacingReportViewModelV31(
    readResult.viewModel
  );

  return {
    ok: true,
    documentId: readResult.documentId,
    collectionName: readResult.collectionName,
    reportViewModel,
  };
}
