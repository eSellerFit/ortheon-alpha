/**
 * Ortheon MVP Cut v3.1 — Report Handoff Screen
 *
 * Bundle 25A / 26A / 26B / 26H / 27C / 27D.
 * Final assessment step — replaces legacy ResultsStep.
 *
 * Poll-only (Bundle 27C): never calls /advance automatically.
 * Polls /api/v31-generation-status every 4 seconds.
 * Retry calls /api/v31-generation-advance with action:"start-qstash" only.
 *
 * Bundle 27D: improved generation UX — spinner, updated copy, calmer tone.
 *
 * Rules:
 * - No direct Firestore reads/writes. All state via API.
 * - No AI calls. No API keys in frontend.
 * - Does not render the report — links to /report?documentId=<assessmentId>.
 * - Does not import or reference ResultsStep, PdfReport, or CareerDirectionMap.
 * - Does NOT call /api/v31-generation-advance automatically.
 */

import { useEffect, useState } from "react";

// ── Stage configuration ────────────────────────────────────────────────────────

const STAGE_KEYS = ["profile", "transferability", "hypotheses", "portfolio"];

const STAGE_LABELS = {
  profile: "Reading your profile",
  transferability: "Mapping transferable strengths",
  hypotheses: "Testing realistic directions",
  portfolio: "Composing your report",
};

const POLL_INTERVAL_MS = 4000;

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
  spinnerWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "28px",
    marginTop: "8px",
  },
  spinner: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#245f73",
    animation: "v31-spin 1.1s linear infinite",
    flexShrink: 0,
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111",
    lineHeight: "1.3",
    margin: "0 0 10px",
  },
  subtext: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.65",
    margin: "0 0 20px",
  },
  reassurance: {
    fontSize: "13px",
    color: "#888",
    lineHeight: "1.6",
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
    margin: "0 0 16px",
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
// "loading"    — awaiting initial status check
// "generating" — polling /status; stages updating as QStash completes them
// "ready"      — v31Result exists; show report link
// "failed"     — pipeline failed; show retry button
// "retrying"   — retry start-qstash in flight
// "no-id"      — assessmentId prop is blank

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31ReportHandoff({ assessmentId }) {
  const [uiState, setUiState] = useState(assessmentId ? "loading" : "no-id");
  const [completedStages, setCompletedStages] = useState([]);
  const [nextStage, setNextStage] = useState(null);
  const [failedStage, setFailedStage] = useState(null);
  const [pollKey, setPollKey] = useState(0);
  const [elapsedSecs, setElapsedSecs] = useState(0);

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
      // 1. Initial status check.
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

      if (statusData.status === "failed") {
        setCompletedStages(statusData.completedStages || []);
        setFailedStage(statusData.failedStage || null);
        setUiState("failed");
        return;
      }

      // Generation is running/partial/idle — show progress and start polling.
      setCompletedStages(statusData.completedStages || []);
      setNextStage(statusData.nextStage || null);
      setElapsedSecs(0);
      setUiState("generating");

      // 2. Poll /status until ready, failed, or component unmounts.
      //    Never calls /advance — QStash drives generation server-side.
      for (;;) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        if (cancelled) return;

        let pollData;
        try {
          pollData = await postJSON("/api/v31-generation-status", { assessmentId });
        } catch {
          // Network hiccup — keep polling rather than failing immediately.
          continue;
        }
        if (cancelled) return;

        if (!pollData.ok) {
          setUiState("failed");
          return;
        }

        if (pollData.status === "ready") {
          setUiState("ready");
          return;
        }

        if (pollData.status === "failed") {
          setCompletedStages(pollData.completedStages || []);
          setFailedStage(pollData.failedStage || null);
          setUiState("failed");
          return;
        }

        // Still generating — update progress display.
        setCompletedStages(pollData.completedStages || []);
        setNextStage(pollData.nextStage || null);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [assessmentId, pollKey]);

  useEffect(() => {
    if (uiState !== "generating") return;
    const interval = setInterval(() => setElapsedSecs((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [uiState]);

  async function handleRetry() {
    setUiState("retrying");
    setFailedStage(null);

    try {
      const result = await postJSON("/api/v31-generation-advance", {
        assessmentId,
        action: "start-qstash",
      });
      if (!result.ok) {
        setUiState("failed");
        return;
      }
    } catch {
      setUiState("failed");
      return;
    }

    // QStash message queued — re-enter polling loop.
    setPollKey((k) => k + 1);
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
        {/* Keyframe injected inline — no external CSS dependency */}
        <style>{`@keyframes v31-spin { to { transform: rotate(360deg); } }`}</style>

        <div style={S.spinnerWrap}>
          <div style={S.spinner} />
        </div>

        <h2 style={S.heading}>Preparing your Career Direction Report</h2>
        <p style={S.subtext}>
          We're turning your assessment into a structured direction report. This
          can take a few minutes.
        </p>

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

        {elapsedSecs >= 180 ? (
          <p style={S.reassurance}>
            You can leave this page and come back later — your report will keep
            processing in the background.
          </p>
        ) : elapsedSecs >= 90 ? (
          <p style={S.reassurance}>
            This is taking a little longer than usual, but your report is still
            being prepared.
          </p>
        ) : null}
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
        <p style={S.subtext}>
          Your assessment has been submitted. We could not open the report
          status automatically on this screen, but your assessment was received.
          You'll receive the report link shortly.
        </p>
      </div>
    );
  }

  // ── Retrying ──────────────────────────────────────────────────────────────────

  if (uiState === "retrying") {
    return (
      <div style={S.container}>
        <p style={S.loadingText}>Restarting generation…</p>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────────────────────────

  return (
    <div style={S.container}>
      <h2 style={S.heading}>We paused while preparing your report.</h2>
      <p style={S.subtext}>
        Your assessment is saved. You can retry from the last completed step.
      </p>
      <button type="button" style={S.retryBtn} onClick={handleRetry}>
        Retry generation
      </button>
    </div>
  );
}
