/**
 * Ortheon MVP — Lightweight Firestore analytics service.
 *
 * Rules:
 * - Never logs PII: no name, email, phone, CV text, user answers, income, report content.
 * - All failures are non-blocking — analytics must never affect the assessment flow.
 * - Session ID is anonymous and persisted in localStorage.
 * - Events go to `analyticsEvents` Firestore collection.
 * - Assessment-level summary goes in the `analytics` sub-object of the assessment document.
 */

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const SESSION_STORAGE_KEY = "ortheon_session_id";

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable — return ephemeral ID (still useful for session grouping)
    return generateSessionId();
  }
}

/**
 * Log a funnel event to analyticsEvents.
 *
 * @param {string} eventName
 * @param {Object} [opts]
 * @param {string} [opts.assessmentId]
 * @param {number} [opts.stepId]
 * @param {string} [opts.stepName]
 * @param {Object} [opts.metadata]  Non-sensitive technical fields only.
 */
export async function logEvent(eventName, opts = {}) {
  try {
    const { assessmentId, stepId, stepName, metadata } = opts;
    const payload = {
      eventName,
      sessionId: getSessionId(),
      createdAt: serverTimestamp(),
      path: window.location.pathname,
    };
    if (assessmentId) payload.assessmentId = assessmentId;
    if (stepId != null) payload.stepId = stepId;
    if (stepName) payload.stepName = stepName;
    if (metadata && typeof metadata === "object") payload.metadata = metadata;
    await addDoc(collection(db, "analyticsEvents"), payload);
  } catch {
    // Non-blocking — do not rethrow
  }
}

/**
 * Update the `analytics` sub-object on an assessment document.
 * Always sets lastEventAt to serverTimestamp unless explicitly overridden.
 *
 * @param {string} assessmentId
 * @param {Object} fields  Keys become analytics.<key> paths.
 */
export async function updateAssessmentAnalytics(assessmentId, fields) {
  if (!assessmentId || typeof fields !== "object") return;
  try {
    const updates = { "analytics.lastEventAt": serverTimestamp() };
    for (const [k, v] of Object.entries(fields)) {
      updates[`analytics.${k}`] = v;
    }
    await updateDoc(doc(db, "assessments", assessmentId), updates);
  } catch {
    // Non-blocking — do not rethrow
  }
}
