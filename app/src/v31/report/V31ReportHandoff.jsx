/**
 * Ortheon MVP Cut v3.1 — Report Handoff Screen
 *
 * Bundle 25A / 26A.
 * Final assessment step — replaces legacy ResultsStep.
 * Checks whether v31Result exists in Firestore; if missing, triggers
 * automatic generation via /api/v31-generate-report.
 *
 * Rules:
 * - Read only (Firestore check). No direct Firestore writes.
 * - No AI calls. No API keys in frontend.
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
// "loading"    — awaiting Firestore read
// "generating" — v31Result missing; /api/v31-generate-report in progress
// "ready"      — v31Result exists; show link
// "error"      — Firestore read failed, document missing, or generation failed
// "no-id"      — assessmentId prop is blank

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31ReportHandoff({ assessmentId }) {
  const [status, setStatus] = useState(assessmentId ? "loading" : "no-id");

  useEffect(() => {
    if (!assessmentId) {
      setStatus("no-id");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    readV31ResultViewModelFromFirestoreV31({ documentId: assessmentId })
      .then((result) => {
        if (cancelled) return;

        if (result.ok) {
          setStatus("ready");
          return;
        }

        if (result.documentExists && result.hasV31Result === false) {
          setStatus("generating");

          fetch("/api/v31-generate-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assessmentId }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (!cancelled) {
                setStatus(data.ok ? "ready" : "error");
              }
            })
            .catch(() => {
              if (!cancelled) setStatus("error");
            });

          return;
        }

        setStatus("error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div style={S.container}>
        <p style={S.loadingText}>Checking report status…</p>
      </div>
    );
  }

  // ── Generating ───────────────────────────────────────────────────────────────

  if (status === "generating") {
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Your report is being generated.</h2>
        <p style={S.body}>
          This usually takes a short moment. Please keep this page open.
        </p>
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

  // ── Error — Firestore read failed, document not found, or generation failed ──

  return (
    <div style={S.container}>
      <h2 style={S.heading}>Assessment submitted</h2>
      <p style={S.body}>
        Your assessment has been submitted. We could not generate the report
        automatically right now. You'll receive the report link shortly.
      </p>
    </div>
  );
}
