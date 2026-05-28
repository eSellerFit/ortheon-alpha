/**
 * Ortheon MVP Cut v3.1 — Report Handoff Screen
 *
 * Bundle 25A / 26A / 26B.
 * Final assessment step — replaces legacy ResultsStep.
 * Checks whether v31Result exists in Firestore; if missing, orchestrates
 * the four staged generation API calls sequentially.
 *
 * Rules:
 * - Read only (Firestore check). No direct Firestore writes.
 * - No AI calls. No API keys in frontend.
 * - Does not render the report — links to /report?documentId=<assessmentId>.
 * - Does not import or reference ResultsStep, PdfReport, or CareerDirectionMap.
 */

import { useEffect, useState } from "react";
import { readV31ResultViewModelFromFirestoreV31 } from "../viewer/readV31ResultViewModelFromFirestore.js";

// ── Stage configuration ────────────────────────────────────────────────────────

const STAGE_ENDPOINTS = [
  "/api/v31-generation-profile",
  "/api/v31-generation-transferability",
  "/api/v31-generation-hypotheses",
  "/api/v31-generation-portfolio",
];

const STAGE_LABELS = [
  "Analyzing your profile",
  "Mapping transferable directions",
  "Building direction hypotheses",
  "Composing your final report",
];

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
  stepText: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.55",
    margin: "0 0 8px",
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
// "loading"    — awaiting Firestore check
// "generating" — orchestrating staged generation (generatingStep: 1-4)
// "ready"      — v31Result exists; show link
// "error"      — generation failed or document not found
// "no-id"      — assessmentId prop is blank

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31ReportHandoff({ assessmentId }) {
  const [status, setStatus] = useState(assessmentId ? "loading" : "no-id");
  const [generatingStep, setGeneratingStep] = useState(0);

  useEffect(() => {
    if (!assessmentId) {
      setStatus("no-id");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setGeneratingStep(0);

    async function run() {
      let firestoreResult;
      try {
        firestoreResult = await readV31ResultViewModelFromFirestoreV31({
          documentId: assessmentId,
        });
      } catch {
        if (!cancelled) setStatus("error");
        return;
      }

      if (cancelled) return;

      if (firestoreResult.ok) {
        setStatus("ready");
        return;
      }

      if (!firestoreResult.documentExists || firestoreResult.hasV31Result !== false) {
        setStatus("error");
        return;
      }

      // Document exists, no v31Result — orchestrate staged generation
      setStatus("generating");

      for (let i = 0; i < STAGE_ENDPOINTS.length; i++) {
        if (cancelled) return;

        setGeneratingStep(i + 1);

        let data;
        try {
          const resp = await fetch(STAGE_ENDPOINTS[i], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assessmentId }),
          });
          data = await resp.json();
        } catch {
          if (!cancelled) setStatus("error");
          return;
        }

        if (cancelled) return;

        if (!data.ok) {
          setStatus("error");
          return;
        }

        if (data.status === "ready") {
          setStatus("ready");
          return;
        }

        // data.status === "stage_complete" → continue to next stage
      }

      // Portfolio stage always returns "ready"; if loop exhausts without it, something is wrong
      if (!cancelled) setStatus("error");
    }

    run();

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
    const label = generatingStep > 0 ? STAGE_LABELS[generatingStep - 1] : "";
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Generating your report</h2>
        {generatingStep > 0 && (
          <p style={S.stepText}>
            Step {generatingStep} of {STAGE_ENDPOINTS.length}: {label}
          </p>
        )}
        <p style={S.body}>
          Please keep this page open. This usually takes a minute or two.
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

  // ── Error — generation failed or document not found ──────────────────────────

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
