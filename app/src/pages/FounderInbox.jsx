import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const SESSION_KEY = "ortheon_founder_access";
const ENV_KEY = import.meta.env.VITE_FOUNDER_ACCESS_KEY;

const getFounderSearch = () => {
  const search = window.location.search;
  if (search) return search;
  const storedKey = sessionStorage.getItem(SESSION_KEY);
  return storedKey ? `?key=${encodeURIComponent(storedKey)}` : "";
};

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

function extractTopDirection(d) {
  const dirs = extractDirections(d);
  if (!Array.isArray(dirs) || dirs.length === 0) return null;
  const top = dirs[0];
  return top?.label || top?.directionArena || top?.title || null;
}

function extractDirectionCount(d) {
  const dirs = extractDirections(d);
  return Array.isArray(dirs) ? dirs.length : null;
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

// ── Access gate ───────────────────────────────────────────────────────────────

function checkAccess() {
  if (!ENV_KEY) return false;
  if (sessionStorage.getItem(SESSION_KEY) === ENV_KEY) return true;
  const params = new URLSearchParams(window.location.search);
  const keyParam = params.get("key");
  if (keyParam && keyParam === ENV_KEY) {
    sessionStorage.setItem(SESSION_KEY, ENV_KEY);
    // Strip the key from the URL without reloading
    const clean = window.location.pathname;
    window.history.replaceState(null, "", clean);
    return true;
  }
  return false;
}

// ── Status badge color ────────────────────────────────────────────────────────

function statusColor(s) {
  if (!s) return "#6b7280";
  const v = s.toLowerCase();
  if (v === "complete" || v === "passed") return "#166534";
  if (v.includes("error") || v.includes("fail")) return "#991b1b";
  if (v.includes("progress") || v.includes("pending") || v.includes("running")) return "#92400e";
  return "#374151";
}

function statusBg(s) {
  if (!s) return "#f3f4f6";
  const v = s.toLowerCase();
  if (v === "complete" || v === "passed") return "#f0fdf4";
  if (v.includes("error") || v.includes("fail")) return "#fef2f2";
  if (v.includes("progress") || v.includes("pending") || v.includes("running")) return "#fffbeb";
  return "#f3f4f6";
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FounderInbox() {
  const [hasAccess] = useState(() => checkAccess());
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasAccess) return;

    async function fetchDocs() {
      try {
        // Try ordered query first; fall back if index missing
        let snap;
        try {
          const q = query(
            collection(db, "assessments"),
            orderBy("createdAt", "desc"),
            limit(50)
          );
          snap = await getDocs(q);
        } catch {
          // Index not available — fetch without order, sort client-side
          const q = query(collection(db, "assessments"), limit(50));
          snap = await getDocs(q);
        }

        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Client-side sort by createdAt descending as fallback
        rows.sort((a, b) => {
          const ta = a.createdAt?.toDate?.() ?? new Date(a.createdAt ?? 0);
          const tb = b.createdAt?.toDate?.() ?? new Date(b.createdAt ?? 0);
          return tb - ta;
        });

        setDocs(rows);
      } catch (e) {
        setError(e.message || "Failed to load assessments.");
      } finally {
        setLoading(false);
      }
    }

    fetchDocs();
  }, [hasAccess]);

  if (!hasAccess) {
    return (
      <div style={S.gate}>
        <p style={S.gateText}>Founder access required.</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Founder Inbox</h1>
        <span style={S.count}>{loading ? "…" : `${docs.length} assessments`}</span>
        <a href={`/founder/analytics${getFounderSearch()}`} style={S.analyticsLink}>Analytics →</a>
      </div>

      {error && <p style={S.errorMsg}>{error}</p>}

      {loading && !error && <p style={S.muted}>Loading…</p>}

      {!loading && !error && docs.length === 0 && (
        <p style={S.muted}>No assessments found.</p>
      )}

      {!loading && !error && docs.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {[
                  "Created",
                  "Name",
                  "Email",
                  "Current role",
                  "Generation",
                  "Pipeline",
                  "Top direction",
                  "Dirs",
                  "",
                ].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => {
                const gen = extractStatus(d);
                const pipeline = extractV31PipelineStatus(d);
                const topDir = extractTopDirection(d);
                const dirCount = extractDirectionCount(d);
                const reportUrl = `/report?documentId=${d.id}`;
                const rawUrl = `/founder/${d.id}${getFounderSearch()}`;

                return (
                  <tr key={d.id} style={S.tr}>
                    <td style={S.td}>
                      <span style={S.mono}>{formatTs(d.createdAt)}</span>
                    </td>
                    <td style={S.td}>{extractName(d) || <span style={S.muted}>—</span>}</td>
                    <td style={S.td}>
                      <span style={S.small}>{extractEmail(d) || "—"}</span>
                    </td>
                    <td style={S.td}>
                      <span style={S.small}>{extractCurrentRole(d) || "—"}</span>
                    </td>
                    <td style={S.td}>
                      {gen ? (
                        <span style={{ ...S.badge, background: statusBg(gen), color: statusColor(gen) }}>
                          {gen}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={S.td}>
                      {pipeline ? (
                        <span style={{ ...S.badge, background: statusBg(pipeline), color: statusColor(pipeline) }}>
                          {pipeline}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ ...S.td, maxWidth: 220 }}>
                      <span style={S.dirLabel}>{topDir || "—"}</span>
                    </td>
                    <td style={{ ...S.td, textAlign: "center" }}>
                      {dirCount !== null ? dirCount : "—"}
                    </td>
                    <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                      <a href={reportUrl} target="_blank" rel="noopener noreferrer" style={S.btnPrimary}>
                        Report
                      </a>
                      {" "}
                      <a href={rawUrl} style={S.btnSecondary}>
                        Raw
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
  },
  gateText: {
    fontFamily: "var(--sans, system-ui)",
    fontSize: 16,
    color: "var(--color-text-muted, #6b7280)",
  },
  page: {
    minHeight: "100vh",
    background: "var(--color-bg, #f7f6f3)",
    padding: "32px 24px 64px",
    fontFamily: "var(--sans, system-ui)",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 24,
  },
  h1: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
  },
  count: {
    fontSize: 13,
    color: "var(--color-text-muted, #6b7280)",
  },
  analyticsLink: {
    marginLeft: "auto",
    fontSize: 13,
    color: "var(--color-accent, #245f73)",
    textDecoration: "none",
    fontWeight: 600,
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "var(--radius-lg, 16px)",
    border: "1px solid var(--color-border, #e2e0da)",
    background: "var(--color-surface, #ffffff)",
    boxShadow: "var(--shadow-sm, 0 1px 3px rgba(17,24,39,0.07))",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    color: "var(--color-text, #374151)",
  },
  th: {
    padding: "10px 14px",
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
    padding: "10px 14px",
    verticalAlign: "top",
    color: "var(--color-text, #374151)",
  },
  mono: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 11,
    color: "var(--color-text-muted, #6b7280)",
    whiteSpace: "nowrap",
  },
  small: {
    fontSize: 12,
    color: "var(--color-text-muted, #6b7280)",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  dirLabel: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 12,
  },
  btnPrimary: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "var(--radius-md, 10px)",
    background: "var(--color-accent, #245f73)",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  btnSecondary: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "var(--radius-md, 10px)",
    background: "transparent",
    border: "1px solid var(--color-border-strong, #c9c7c0)",
    color: "var(--color-text, #374151)",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    whiteSpace: "nowrap",
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
  muted: {
    color: "var(--color-text-muted, #6b7280)",
    fontSize: 14,
  },
};
