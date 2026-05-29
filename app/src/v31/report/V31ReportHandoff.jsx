/**
 * Ortheon MVP Cut v3.1 — Report Handoff Screen
 *
 * Bundle 25A / 26A / 26B / 26H.
 * Final assessment step — replaces legacy ResultsStep.
 * Drives the v3.1 staged generation pipeline via status/advance endpoints.
 * Resumable: reads current Firestore state on mount and continues from
 * the last completed stage rather than restarting from scratch.
 *
 * Rules:
 * - No direct Firestore reads/writes. All state via API.
 * - No AI calls. No API keys in frontend.
 * - Does not render the report — links to /report?documentId=<assessmentId>.
 * - Does not import or reference ResultsStep, PdfReport, or CareerDirectionMap.
 */

import { useEffect, useState } from "react";

// ── Stage configuration ────────────────────────────────────────────────────────

const STAGE_KEYS = ["profile", "transferability", "hypotheses", "portfolio"];

const STAGE_LABELS = {
  profile: "Analyzing your profile",
  transferability: "Mapping transferable directions",
  hypotheses: "Building direction hypotheses",
  portfolio: "Composing your final report",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

async function postJSON(path, body) {
  const resp = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return resp.json();
}

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
  retryBtn: {
    display: "inline-block",
    padding: "11px 26px",
    background: "#245f73",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.01em",
  },
  loadingText: {
    fontSize: "15px",
    color: "#aaa",
    paddingTop: "8px",
  },
  stageList: {
    listStyle: "none",
    margin: "0 0 20px",
    padding: 0,
  },
  stageRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 0",
    fontSize: "14px",
  },
  stageIcon: {
    width: "20px",
    textAlign: "center",
    flexShrink: 0,
  },
};

// ── Stage row ──────────────────────────────────────────────────────────────────

function StageRow({ stageKey, isCompleted, isActive, isFailed }) {
  let icon, iconColor;
  if (isFailed) {
    icon = "✕";
    iconColor = "#dc2626";
  } else if (isCompleted) {
    icon = "✓";
    iconColor = "#16a34a";
  } else if (isActive) {
    icon = "▸";
    iconColor = "#245f73";
  } else {
    icon = "○";
    iconColor = "#d1d5db";
  }

  const labelColor = isFailed
    ? "#dc2626"
    : isActive
    ? "#111"
    : isCompleted
    ? "#444"
    : "#9ca3af";

  return (
    <li style={S.stageRow}>
      <span style={{ ...S.stageIcon, color: iconColor }}>{icon}</span>
      <span style={{ color: labelColor, fontWeight: isActive ? "600" : "400" }}>
        {STAGE_LABELS[stageKey]}
      </span>
    </li>
  );
}

// ── States ─────────────────────────────────────────────────────────────────────
// "loading"    — awaiting status check
// "generating" — advance loop running; stages updating from backend
// "ready"      — v31Result exists; show report link
// "failed"     — a stage failed; show retry button
// "no-id"      — assessmentId prop is blank

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31ReportHandoff({ assessmentId }) {
  const [uiState, setUiState] = useState(assessmentId ? "loading" : "no-id");
  const [completedStages, setCompletedStages] = useState([]);
  const [nextStage, setNextStage] = useState(null);
  const [failedStage, setFailedStage] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!assessmentId) {
      setUiState("no-id");
      return;
    }

    let cancelled = false;
    setUiState("loading");
    setCompletedStages([]);
    setNextStage(null);
    setFailedStage(null);

    async function run() {
      // 1. Read current generation state — no Claude call.
      let statusData;
      try {
        statusData = await postJSON("/api/v31-generation-status", { assessmentId });
      } catch {
        if (!cancelled) setUiState("failed");
        return;
      }
      if (cancelled) return;

      if (!statusData.ok) {
        setUiState("failed");
        return;
      }

      if (statusData.status === "ready") {
        setUiState("ready");
        return;
      }

      // Initialize progress display from server state so the UI reflects
      // any stages already completed in a prior session.
      setCompletedStages(statusData.completedStages || []);
      setNextStage(statusData.nextStage || null);
      setUiState("generating");

      // 2. Advance loop — one Claude call per iteration.
      // Runs until ready, failed, or the component unmounts.
      for (;;) {
        if (cancelled) return;

        let advData;
        try {
          advData = await postJSON("/api/v31-generation-advance", { assessmentId });
        } catch {
          if (!cancelled) setUiState("failed");
          return;
        }
        if (cancelled) return;

        if (!advData.ok) {
          setFailedStage(advData.failedStage || null);
          setUiState("failed");
          return;
        }

        setCompletedStages(advData.completedStages || []);
        setNextStage(advData.nextStage || null);

        if (advData.status === "ready") {
          setUiState("ready");
          return;
        }

        // stage_complete — brief pause before calling advance for the next stage.
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [assessmentId, retryKey]);

  function handleRetry() {
    setRetryKey((k) => k + 1);
  }

  const reportUrl = assessmentId
    ? `/report?documentId=${encodeURIComponent(assessmentId)}`
    : "/report";

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (uiState === "loading") {
    return (
      <div style={S.container}>
        <p style={S.loadingText}>Checking report status…</p>
      </div>
    );
  }

  // ── Generating ───────────────────────────────────────────────────────────────

  if (uiState === "generating") {
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Generating your Career Direction Report</h2>
        <ul style={S.stageList}>
          {STAGE_KEYS.map((key) => (
            <StageRow
              key={key}
              stageKey={key}
              isCompleted={completedStages.includes(key)}
              isActive={nextStage === key}
              isFailed={failedStage === key}
            />
          ))}
        </ul>
        <p style={S.body}>
          Please keep this page open. If you leave and come back, we'll continue
          from the last completed step.
        </p>
      </div>
    );
  }

  // ── Ready ─────────────────────────────────────────────────────────────────────

  if (uiState === "ready") {
    return (
      <div style={S.container}>
        <h2 style={S.heading}>Your Career Direction Report is ready.</h2>
        <a href={reportUrl} style={S.ctaLink}>
          View your report
        </a>
      </div>
    );
  }

  // ── Missing assessmentId ──────────────────────────────────────────────────────

  if (uiState === "no-id") {
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

  // ── Failed ────────────────────────────────────────────────────────────────────

  return (
    <div style={S.container}>
      <h2 style={S.heading}>We paused while generating your report.</h2>
      <p style={S.body}>
        Your assessment is saved. You can retry from the last completed step.
      </p>
      <button type="button" style={S.retryBtn} onClick={handleRetry}>
        Retry generation
      </button>
    </div>
  );
}
