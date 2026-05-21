// src/pages/DebugResultReplay.jsx
// Debug-only result replay page.
//
// Route: /debug/result/:assessmentId
//
// Renders ResultsStep against an existing saved Firestore assessment ID
// without running the full assessment flow or triggering CV parsing.
// Does not create or modify any assessment data.

import ResultsStep from "../components/assessment/ResultsStep";

function DebugResultReplay({ assessmentId }) {
  const params = new URLSearchParams(window.location.search);
  const forceRegenerate = params.get("forceRegenerate") === "1";
  const noSave = params.get("noSave") === "1";

  if (!assessmentId) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Debug · Result Replay</p>
          <h1 style={styles.title}>No assessment ID</h1>
          <p style={styles.subtitle}>
            Open <code>/debug/result/&lt;assessmentId&gt;</code> with a valid
            Firestore assessment ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <p style={styles.eyebrow}>Debug · Result Replay</p>
          <h1 style={styles.title}>Result Replay</h1>
          <p style={styles.subtitle}>
            Assessment ID:{" "}
            <code style={styles.code}>{assessmentId}</code>
          </p>
          <p style={styles.warning}>
            Debug page — local only. Does not create or modify assessments.
          </p>

          {(forceRegenerate || noSave) && (
            <div style={styles.chipRow}>
              {forceRegenerate && (
                <span style={styles.chipBlue}>Force regenerate ON</span>
              )}
              {noSave && (
                <span style={styles.chipAmber}>No-save mode</span>
              )}
            </div>
          )}
        </div>
        <a href="/" style={styles.homeLink}>
          Back to site
        </a>
      </div>

      <ResultsStep
        assessmentId={assessmentId}
        forceRegenerate={forceRegenerate}
        disableResultSave={noSave}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    maxWidth: 1180,
    margin: "0 auto",
    padding: "24px 28px 16px",
    borderBottom: "1px solid #dfe6ef",
    marginBottom: 0,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  eyebrow: {
    margin: 0,
    color: "#667085",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#18202f",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: 0,
    color: "#526071",
    fontSize: 13,
  },
  code: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    background: "#eef2f7",
    padding: "1px 6px",
    borderRadius: 5,
    color: "#18202f",
  },
  warning: {
    margin: 0,
    color: "#b54708",
    fontSize: 12,
    fontWeight: 600,
  },
  homeLink: {
    color: "#2f5f9f",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    whiteSpace: "nowrap",
    marginTop: 4,
  },
  chipRow: {
    display: "flex",
    gap: 8,
    marginTop: 6,
  },
  chipBlue: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    background: "#dbeafe",
    color: "#1e40af",
    letterSpacing: "0.04em",
  },
  chipAmber: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    background: "#fef3c7",
    color: "#92400e",
    letterSpacing: "0.04em",
  },
};

export default DebugResultReplay;
