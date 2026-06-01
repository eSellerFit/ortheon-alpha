import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const SESSION_KEY = "ortheon_founder_access";
const ENV_KEY = import.meta.env.VITE_FOUNDER_ACCESS_KEY;

// ── Access gate (same logic as FounderInbox) ──────────────────────────────────

function checkAccess() {
  if (!ENV_KEY) return false;
  if (sessionStorage.getItem(SESSION_KEY) === ENV_KEY) return true;
  const params = new URLSearchParams(window.location.search);
  const keyParam = params.get("key");
  if (keyParam && keyParam === ENV_KEY) {
    sessionStorage.setItem(SESSION_KEY, ENV_KEY);
    const clean = window.location.pathname;
    window.history.replaceState(null, "", clean);
    return true;
  }
  return false;
}

// ── Defensive field extractors ────────────────────────────────────────────────

function extractName(d) {
  return d.firstName || d.name || d.userProfile?.name || d.profile?.name || d.intake?.name || null;
}

function extractEmail(d) {
  return d.email || d.userProfile?.email || d.profile?.email || d.intake?.email || null;
}

function extractCurrentRole(d) {
  return d.currentRole || d.role || d.currentJob || null;
}

function extractStatus(d) {
  return d.v31Generation?.status || d.status || d.reportStatus || d.generationStatus || null;
}

function extractV31PipelineStatus(d) {
  return d.v31Result?.pipelineStatus || null;
}

function extractDirections(d) {
  return (
    d.v31Result?.finalPortfolio?.directions ||
    d.reportData?.directions ||
    d.recommendedDirections ||
    d.finalDirections ||
    d.portfolio?.directions ||
    d.directions ||
    null
  );
}

function formatTs(ts) {
  if (!ts) return "—";
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

// Convert Firestore Timestamps to ISO strings for clean JSON rendering
function serializeForDisplay(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(serializeForDisplay);
  if (typeof obj.toDate === "function") return obj.toDate().toISOString();
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = serializeForDisplay(v);
  }
  return out;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FounderDocumentView({ documentId }) {
  const [hasAccess] = useState(() => checkAccess());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    if (!hasAccess || !documentId) return;

    async function fetchDoc() {
      try {
        const snap = await getDoc(doc(db, "assessments", documentId));
        if (!snap.exists()) {
          setError(`Document "${documentId}" not found in assessments collection.`);
        } else {
          setData({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        setError(e.message || "Failed to load document.");
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
  }, [hasAccess, documentId]);

  if (!hasAccess) {
    return (
      <div style={S.gate}>
        <p style={S.gateText}>Founder access required.</p>
      </div>
    );
  }

  const reportUrl = `/report?documentId=${documentId}`;

  return (
    <div style={S.page}>
      {/* Nav bar */}
      <div style={S.nav}>
        <a href="/founder" style={S.navLink}>← Founder Inbox</a>
        <a href={reportUrl} target="_blank" rel="noopener noreferrer" style={S.btnPrimary}>
          Open Report ↗
        </a>
      </div>

      <h1 style={S.h1}>Assessment: <span style={S.docId}>{documentId}</span></h1>

      {loading && <p style={S.muted}>Loading…</p>}
      {error && <p style={S.errorMsg}>{error}</p>}

      {data && (
        <>
          {/* Summary card */}
          <div style={S.card}>
            <h2 style={S.h2}>Summary</h2>
            <div style={S.grid}>
              <SummaryRow label="Name" value={extractName(data)} />
              <SummaryRow label="Email" value={extractEmail(data)} />
              <SummaryRow label="Current role" value={extractCurrentRole(data)} />
              <SummaryRow label="Generation status" value={extractStatus(data)} />
              <SummaryRow label="Pipeline status" value={extractV31PipelineStatus(data)} />
              <SummaryRow label="Created" value={formatTs(data.createdAt)} />
              <SummaryRow label="Updated" value={formatTs(data.updatedAt)} />
            </div>

            {/* Directions */}
            {(() => {
              const dirs = extractDirections(data);
              if (!Array.isArray(dirs) || dirs.length === 0) return null;
              return (
                <div style={{ marginTop: 20 }}>
                  <p style={S.sectionLabel}>Recommended directions ({dirs.length})</p>
                  <ol style={S.dirList}>
                    {dirs.map((d, i) => (
                      <li key={i} style={S.dirItem}>
                        <strong style={S.dirLabel}>
                          {d?.label || d?.directionArena || d?.title || `Direction ${i + 1}`}
                        </strong>
                        {d?.recommendationType && (
                          <span style={S.tag}>{d.recommendationType}</span>
                        )}
                        {d?.routeType && (
                          <span style={S.tagGray}>{d.routeType}</span>
                        )}
                        {d?.confidence && (
                          <span style={S.tagGray}>confidence: {d.confidence}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })()}
          </div>

          {/* Raw JSON */}
          <div style={S.card}>
            <button
              style={S.toggleBtn}
              onClick={() => setRawOpen((v) => !v)}
              aria-expanded={rawOpen}
            >
              {rawOpen ? "▾ Hide raw document" : "▸ Show raw document"}
            </button>
            {rawOpen && (
              <pre style={S.pre}>
                {JSON.stringify(serializeForDisplay(data), null, 2)}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={S.rowValue}>{value || <span style={S.muted}>—</span>}</span>
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
  },
  gateText: {
    fontFamily: "var(--sans, system-ui)",
    fontSize: 16,
    color: "var(--color-text-muted, #6b7280)",
  },
  page: {
    minHeight: "100vh",
    background: "var(--color-bg, #f7f6f3)",
    padding: "24px 24px 64px",
    fontFamily: "var(--sans, system-ui)",
    maxWidth: 1000,
    margin: "0 auto",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navLink: {
    fontSize: 13,
    color: "var(--color-accent, #245f73)",
    textDecoration: "none",
    fontWeight: 600,
  },
  h1: {
    margin: "0 0 20px",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
    wordBreak: "break-all",
  },
  docId: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 16,
    fontWeight: 400,
    color: "var(--color-text-muted, #6b7280)",
  },
  h2: {
    margin: "0 0 16px",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
  },
  card: {
    background: "var(--color-surface, #ffffff)",
    border: "1px solid var(--color-border, #e2e0da)",
    borderRadius: "var(--radius-lg, 16px)",
    padding: "20px 24px",
    marginBottom: 16,
    boxShadow: "var(--shadow-sm, 0 1px 3px rgba(17,24,39,0.07))",
  },
  grid: {
    display: "grid",
    gap: 8,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: 12,
    alignItems: "baseline",
    fontSize: 13,
  },
  rowLabel: {
    fontWeight: 600,
    color: "var(--color-text-muted, #6b7280)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  rowValue: {
    color: "var(--color-text-strong, #111827)",
  },
  sectionLabel: {
    margin: "0 0 10px",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--color-text-muted, #6b7280)",
  },
  dirList: {
    margin: 0,
    padding: "0 0 0 20px",
    display: "grid",
    gap: 8,
  },
  dirItem: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "var(--color-text, #374151)",
  },
  dirLabel: {
    color: "var(--color-text-strong, #111827)",
  },
  tag: {
    display: "inline-block",
    padding: "1px 7px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    background: "var(--color-accent-bg, #e7f1f3)",
    color: "var(--color-accent-text, #245f73)",
  },
  tagGray: {
    display: "inline-block",
    padding: "1px 7px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    background: "#f3f4f6",
    color: "#374151",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--sans, system-ui)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--color-accent, #245f73)",
    padding: 0,
  },
  pre: {
    marginTop: 14,
    padding: 16,
    background: "var(--color-bg-subtle, #f0eeea)",
    borderRadius: "var(--radius-md, 10px)",
    fontSize: 11,
    fontFamily: "var(--mono, monospace)",
    lineHeight: 1.55,
    overflowX: "auto",
    color: "var(--color-text, #374151)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  btnPrimary: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "var(--radius-md, 10px)",
    background: "var(--color-accent, #245f73)",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
  },
  errorMsg: {
    color: "var(--color-error-text, #991b1b)",
    background: "var(--color-error-bg, #fef2f2)",
    border: "1px solid #fca5a5",
    borderRadius: "var(--radius-md, 10px)",
    padding: "10px 14px",
    fontSize: 13,
  },
  muted: {
    color: "var(--color-text-muted, #6b7280)",
    fontSize: 14,
  },
};
