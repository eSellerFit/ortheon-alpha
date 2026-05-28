/**
 * Ortheon MVP Cut v3.1 — Report Handoff Screen
 *
 * Bundle 25A.
 * Final assessment step — replaces legacy ResultsStep.
 * Checks whether v31Result exists in Firestore and shows the appropriate state.
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls. No v3.1 pipeline trigger.
 * - Does not render the report — links to /report?documentId=<assessmentId>.
 * - Does not import or reference ResultsStep, PdfReport, or CareerDirectionMap.
 */

import { useEffect, useState } from "react";
import { readV31ResultViewModelFromFirestoreV31 } from "../viewer/readV31ResultViewModelFromFirestore.js";

// ── Styles ─────────────────────────────────────────────────────────────────────

const S = {
  container: {
    paddingTop: "4px",
    paddingBottom: "16px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111",
    lineHeight: "1.3",
    margin: "0 0 12px",
  },
  body: {
    fontSize: "15px",
    color: "#444",
    lineHeight: "1.65",
    margin: "0 0 20px",
  },
  alphaNote: {
    fontSize: "13px",
    color: "#6b7280",
    background: "#f4f3f1",
    border: "1px solid #e2e0da",
    borderRadius: "7px",
    padding: "10px 14px",
    lineHeight: "1.55",
    marginTop: "16px",
  },
  ctaLink: {
    display: "inline-block",
    padding: "11px 26px",
    background: "#245f73",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    textDecoration: "none",
    marginTop: "4px",
    letterSpacing: "0.01em",
  },
  loadingText: {
    fontSize: "15px",
    color: "#aaa",
    paddingTop: "8px",
  },
};

// ── States ─────────────────────────────────────────────────────────────────────
// "loading"  — awaiting Firestore read
// "ready"    — v31Result exists; show link
// "pending"  — document exists, v31Result not yet written
// "error"    — Firestore read failed or document missing
// "no-id"    — assessmentId prop is blank

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31ReportHandoff({ assessmentId }) {
  const [status, setStatus] = useState(assessmentId ? "loading" : "no-id");

  useEffect(() => {
    if (!assessmentId) {
      setStatus("no-id");
      return;
    }

    setStatus("loading");

    readV31ResultViewModelFromFirestoreV31({ documentId: assessmentId })
      .then((result) => {
        if (result.ok) {
          setStatus("ready");
        } else if (result.documentExists && result.hasV31Result === false) {
          setStatus("pending");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [assessmentId]);

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div style={S.container}>
        <p style={S.loadingText}>Checking report status…</p>
      </div>
    );
  }

  // ── Missing assessmentId ─────────────────────────────────────────────────────

  if (status === "no-id") {
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Assessment submitted</h2>
        <p style={S.body}>
          Your assessment has been submitted. We could not open the report
          status automatically on this screen, but your assessment was received.
          You'll receive the report link shortly.
        </p>
      </div>
    );
  }

  // ── Report ready — v31Result exists ─────────────────────────────────────────

  if (status === "ready") {
    const reportUrl = `/report?documentId=${encodeURIComponent(assessmentId)}`;
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Your Career Direction Report is ready.</h2>
        <p style={S.body}>
          Your assessment has been processed and your report is available.
        </p>
        <a href={reportUrl} style={S.ctaLink}>
          View your report
        </a>
      </div>
    );
  }

  // ── Report pending — document exists but no v31Result yet ───────────────────

  if (status === "pending") {
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Your report is being prepared.</h2>
        <p style={S.body}>
          Thank you for completing the assessment. Your Career Direction Report
          is not ready yet. You'll receive the report link shortly.
        </p>
        <div style={S.alphaNote}>
          This alpha version includes a manual review step before the final
          report is released.
        </div>
      </div>
    );
  }

  // ── Error — Firestore read failed or document not found ──────────────────────

  return (
    <div style={S.container}>
      <h2 style={S.heading}>Assessment submitted</h2>
      <p style={S.body}>
        Your assessment has been submitted. We could not check the report status
        right now. You'll receive the report link shortly.
      </p>
    </div>
  );
}
