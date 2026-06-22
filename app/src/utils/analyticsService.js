/**
 * Ortheon MVP — Lightweight Firestore analytics service.
 *
 * Rules:
 * - Never logs PII: no name, email, phone, CV text, user answers, income, report content.
 * - All failures are non-blocking — analytics must never affect the assessment flow.
 * - Session ID is anonymous and persisted in localStorage.
 * - Events go to `analyticsEvents` Firestore collection.
 * - Assessment-level summary goes in the `analytics` sub-object of the assessment document.
 * - Attribution (source, medium, campaign, content, term, referrer, device) is automatically
 *   included on every event from localStorage — set once via captureAttribution().
 */

import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAttribution } from "./attributionService";

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
 * Attribution fields are automatically included from localStorage.
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
    const attr = getAttribution();
    const payload = {
      eventName,
      sessionId: getSessionId(),
      createdAt: serverTimestamp(),
      path: window.location.pathname,
      source: attr.source || "direct",
      medium: attr.medium || "",
      campaign: attr.campaign || "",
      content: attr.content || "",
      term: attr.term || "",
      referrer: attr.referrer || "",
      device: attr.device || "",
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
 * Record per-step progress on an assessment document.
 * Writes lastStep, lastEvent, lastEventAt, completedSteps (arrayUnion), stepTimestamps.{stepName}.
 *
 * @param {string} assessmentId
 * @param {string} stepName
 * @param {string} eventName
 */
export async function recordStepProgress(assessmentId, stepName, eventName) {
  if (!assessmentId || !stepName) return;
  try {
    await updateDoc(doc(db, "assessments", assessmentId), {
      "analytics.lastStep": stepName,
      "analytics.lastEvent": eventName || stepName,
      "analytics.lastEventAt": serverTimestamp(),
      "analytics.completedSteps": arrayUnion(stepName),
      [`analytics.stepTimestamps.${stepName}`]: serverTimestamp(),
    });
  } catch {
    // Non-blocking
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
