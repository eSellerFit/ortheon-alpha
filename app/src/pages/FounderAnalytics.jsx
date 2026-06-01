import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const SESSION_KEY = "ortheon_founder_access";
const ENV_KEY = import.meta.env.VITE_FOUNDER_ACCESS_KEY;

function checkAccess() {
  if (!ENV_KEY) return false;
  if (sessionStorage.getItem(SESSION_KEY) === ENV_KEY) return true;
  const params = new URLSearchParams(window.location.search);
  const keyParam = params.get("key");
  if (keyParam && keyParam === ENV_KEY) {
    sessionStorage.setItem(SESSION_KEY, ENV_KEY);
    window.history.replaceState(null, "", window.location.pathname);
    return true;
  }
  return false;
}

function formatTs(ts) {
  if (!ts) return "—";
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function pct(num, den) {
  if (!den || den === 0) return "—";
  return `${Math.round((num / den) * 100)}%`;
}

const FUNNEL_STEPS = [
  { key: "assessment_landed",       label: "Landed" },
  { key: "assessment_started",      label: "Started" },
  { key: "assessment_submitted",    label: "Submitted" },
  { key: "report_generated",        label: "Report generated" },
  { key: "report_opened",           label: "Report opened" },
  { key: "feedback_call_clicked",   label: "Feedback call clicked" },
];

export default function FounderAnalytics() {
  const [hasAccess] = useState(() => checkAccess());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasAccess) return;

    async function fetchEvents() {
      try {
        let snap;
        try {
          const q = query(
            collection(db, "analyticsEvents"),
            orderBy("createdAt", "desc"),
            limit(500)
          );
          snap = await getDocs(q);
        } catch {
          const q = query(collection(db, "analyticsEvents"), limit(500));
          snap = await getDocs(q);
        }
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setError(e.message || "Failed to load analytics events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [hasAccess]);

  if (!hasAccess) {
    return (
      <div style={S.gate}>
        <p style={S.gateText}>Founder access required.</p>
      </div>
    );
  }

  // ── Aggregate ──────────────────────────────────────────────────────────────────

  const countByEvent = {};
  const sessionMap = {};

  for (const e of events) {
    countByEvent[e.eventName] = (countByEvent[e.eventName] || 0) + 1;

    if (e.sessionId) {
      if (!sessionMap[e.sessionId]) {
        sessionMap[e.sessionId] = {
          sessionId: e.sessionId,
          assessmentId: null,
          events: [],
          firstAt: null,
          lastAt: null,
        };
      }
      const sess = sessionMap[e.sessionId];
      if (e.assessmentId && !sess.assessmentId) sess.assessmentId = e.assessmentId;
      sess.events.push(e.eventName);
      const ts = e.createdAt?.toDate?.() ?? (e.createdAt ? new Date(e.createdAt) : null);
      if (ts) {
        if (!sess.firstAt || ts < sess.firstAt) sess.firstAt = ts;
        if (!sess.lastAt || ts > sess.lastAt) sess.lastAt = ts;
      }
    }
  }

  const recentSessions = Object.values(sessionMap)
    .sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0))
    .slice(0, 20);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <h1 style={S.h1}>Analytics</h1>
          <span style={S.muted}>{loading ? "…" : `${events.length} events loaded`}</span>
        </div>
        <a href="/founder" style={S.navLink}>← Founder Inbox</a>
      </div>

      {error && <p style={S.errorMsg}>{error}</p>}
      {loading && !error && <p style={S.muted}>Loading…</p>}

      {!loading && !error && (
        <>
          {/* ── Funnel ── */}
          <div style={S.card}>
            <h2 style={S.h2}>Funnel</h2>
            <table style={S.table}>
              <thead>
                <tr>
                  {["Step", "Count", "vs. prev step", "vs. landed"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FUNNEL_STEPS.map((step, i) => {
                  const count = countByEvent[step.key] || 0;
                  const prevCount = i > 0 ? (countByEvent[FUNNEL_STEPS[i - 1].key] || 0) : null;
                  const landedCount = countByEvent["assessment_landed"] || 0;
                  return (
                    <tr key={step.key} style={S.tr}>
                      <td style={S.td}>{step.label}</td>
                      <td style={{ ...S.td, fontWeight: 700 }}>{count}</td>
                      <td style={{ ...S.td, color: "#6b7280" }}>
                        {prevCount !== null ? pct(count, prevCount) : "—"}
                      </td>
                      <td style={{ ...S.td, color: "#6b7280" }}>
                        {i > 0 ? pct(count, landedCount) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── CV step breakdown ── */}
          <div style={S.card}>
            <h2 style={S.h2}>CV Step</h2>
            <div style={S.grid}>
              {[
                ["cv_step_started",   "CV step started"],
                ["cv_uploaded",       "PDF uploaded"],
                ["cv_parse_started",  "Parse started"],
                ["cv_parse_succeeded","Parse succeeded"],
                ["cv_parse_failed",   "Parse failed"],
                ["cv_skipped",        "CV skipped"],
              ].map(([key, label]) => (
                <div key={key} style={S.statCell}>
                  <div style={S.statCount}>{countByEvent[key] || 0}</div>
                  <div style={S.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent sessions ── */}
          <div style={S.card}>
            <h2 style={S.h2}>Recent sessions <span style={S.muted}>({recentSessions.length})</span></h2>
            {recentSessions.length === 0 ? (
              <p style={S.muted}>No sessions found.</p>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["Session ID", "Assessment ID", "Last seen", "Events"].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((sess) => (
                      <tr key={sess.sessionId} style={S.tr}>
                        <td style={S.td}>
                          <span style={S.mono}>{sess.sessionId.slice(0, 24)}</span>
                        </td>
                        <td style={S.td}>
                          {sess.assessmentId ? (
                            <a href={`/founder/${sess.assessmentId}`} style={S.inlineLink}>
                              {sess.assessmentId.slice(0, 14)}…
                            </a>
                          ) : (
                            <span style={S.muted}>—</span>
                          )}
                        </td>
                        <td style={{ ...S.td }}>
                          <span style={S.mono}>{formatTs(sess.lastAt)}</span>
                        </td>
                        <td style={{ ...S.td, maxWidth: 360 }}>
                          <span style={S.eventPills}>
                            {[...new Set(sess.events)].join(" · ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  gate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--color-bg, #f7f6f3)",
    fontFamily: "var(--sans, system-ui)",
  },
  gateText: {
    fontSize: 16,
    color: "var(--color-text-muted, #6b7280)",
  },
  page: {
    minHeight: "100vh",
    background: "var(--color-bg, #f7f6f3)",
    padding: "32px 24px 64px",
    fontFamily: "var(--sans, system-ui)",
    maxWidth: 960,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  h1: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
  },
  h2: {
    margin: "0 0 16px",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
  },
  navLink: {
    fontSize: 13,
    color: "var(--color-accent, #245f73)",
    textDecoration: "none",
    fontWeight: 600,
  },
  card: {
    background: "var(--color-surface, #ffffff)",
    border: "1px solid var(--color-border, #e2e0da)",
    borderRadius: "var(--radius-lg, 16px)",
    padding: "20px 24px",
    marginBottom: 16,
    boxShadow: "var(--shadow-sm, 0 1px 3px rgba(17,24,39,0.07))",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    color: "var(--color-text, #374151)",
  },
  th: {
    padding: "8px 12px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--color-text-muted, #6b7280)",
    borderBottom: "1px solid var(--color-border, #e2e0da)",
    whiteSpace: "nowrap",
    background: "var(--color-surface-soft, #fafaf8)",
  },
  tr: {
    borderBottom: "1px solid var(--color-border, #e2e0da)",
  },
  td: {
    padding: "9px 12px",
    verticalAlign: "top",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: 12,
  },
  statCell: {
    padding: "12px 14px",
    background: "var(--color-bg, #f7f6f3)",
    borderRadius: "10px",
    border: "1px solid var(--color-border, #e2e0da)",
  },
  statCount: {
    fontSize: 28,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
    lineHeight: 1.1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "var(--color-text-muted, #6b7280)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    lineHeight: 1.4,
  },
  mono: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 11,
    color: "var(--color-text-muted, #6b7280)",
    whiteSpace: "nowrap",
  },
  muted: {
    color: "var(--color-text-muted, #6b7280)",
    fontSize: 13,
  },
  errorMsg: {
    color: "var(--color-error-text, #991b1b)",
    background: "var(--color-error-bg, #fef2f2)",
    border: "1px solid #fca5a5",
    borderRadius: "var(--radius-md, 10px)",
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
  },
  inlineLink: {
    color: "var(--color-accent, #245f73)",
    textDecoration: "none",
    fontWeight: 600,
    fontFamily: "var(--mono, monospace)",
    fontSize: 11,
  },
  eventPills: {
    fontSize: 11,
    color: "var(--color-text-muted, #6b7280)",
    lineHeight: 1.6,
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 360,
  },
};
