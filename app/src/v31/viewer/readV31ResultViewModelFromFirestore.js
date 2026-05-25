/**
 * Ortheon MVP Cut v3.1 — Firestore-to-View-Model Reader
 *
 * Bundle 16C read-only helper.
 * Reads assessments/{documentId}.v31Result from Firestore and returns
 * a fully-built view model via buildV31ResultViewModelV31.
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls.
 * - Does not return raw document data, legacy fields, or raw Claude outputs.
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { buildV31ResultViewModelV31 } from "./buildV31ResultViewModel.js";

/**
 * Read assessments/{documentId}.v31Result and build the view model.
 *
 * @param {Object} options
 * @param {string} options.documentId
 * @param {string} [options.collectionName="assessments"]
 * @returns {Promise<Object>}
 */
export async function readV31ResultViewModelFromFirestoreV31({
  documentId,
  collectionName = "assessments",
} = {}) {
  if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
    return {
      ok: false,
      error: "documentId must be a non-empty string.",
      documentExists: false,
    };
  }

  const trimmedId = documentId.trim();
  const assessmentRef = doc(db, collectionName, trimmedId);
  const assessmentSnap = await getDoc(assessmentRef);

  if (!assessmentSnap.exists()) {
    return {
      ok: false,
      error: "Target assessment document does not exist.",
      documentExists: false,
    };
  }

  const data = assessmentSnap.data();
  const v31Result = data?.v31Result;

  if (!v31Result) {
    return {
      ok: false,
      error: "v31Result is missing.",
      documentExists: true,
      hasV31Result: false,
    };
  }

  const viewModel = buildV31ResultViewModelV31(v31Result);

  return {
    ok: true,
    documentExists: true,
    hasV31Result: true,
    documentId: trimmedId,
    collectionName,
    viewModel,
  };
}
