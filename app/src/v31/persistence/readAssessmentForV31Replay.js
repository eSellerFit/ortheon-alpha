/**
 * Ortheon MVP Cut v3.1 — Real Assessment Reader for Pipeline Replay
 *
 * Bundle 17B read-only helper.
 * Reads assessments/{documentId} from Firestore and returns a sanitized
 * assessment object safe for v3.1 pipeline replay.
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls.
 * - Strips all v31Result and legacy result fields before returning.
 * - Never logs or prints raw document data or PII.
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const STRIPPED_FIELDS = [
  "v31Result",
  "directionRecommendations",
  "careerMap",
  "primaryDirections",
  "reportSections",
  "report",
];

/**
 * Read assessments/{documentId} and return a sanitized assessment object
 * suitable as input to buildAssessmentSnapshotV31.
 *
 * @param {Object} options
 * @param {string} options.documentId
 * @param {string} [options.collectionName="assessments"]
 * @returns {Promise<Object>}
 */
export async function readAssessmentForV31ReplayV31({
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

  const rawData = assessmentSnap.data();

  const sanitized = { id: trimmedId };
  for (const [key, value] of Object.entries(rawData)) {
    if (!STRIPPED_FIELDS.includes(key)) {
      sanitized[key] = value;
    }
  }

  const strippedFieldsPresent = STRIPPED_FIELDS.filter((f) =>
    Object.prototype.hasOwnProperty.call(rawData, f)
  );

  return {
    ok: true,
    documentExists: true,
    documentId: trimmedId,
    collectionName,
    fieldCount: Object.keys(sanitized).length,
    strippedFieldsPresent,
    assessment: sanitized,
  };
}
