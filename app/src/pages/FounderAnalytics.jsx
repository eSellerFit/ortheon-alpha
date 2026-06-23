import { useEffect, useMemo, useState } from "react";
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

const NEW_FLOW_BASELINE_AT = new Date("2026-06-22T20:10:00-04:00");

function filterByDate(events, range) {
  if (range === "all") return events;
  let cutoff;
  if (range === "new_flow") {
    cutoff = NEW_FLOW_BASELINE_AT;
  } else {
    cutoff = new Date();
    if (range === "24h") cutoff.setHours(cutoff.getHours() - 24);
    else if (range === "7d") cutoff.setDate(cutoff.getDate() - 7);
  }
  return events.filter((e) => {
    const ts = e.createdAt?.toDate?.() ?? (e.createdAt ? new Date(e.createdAt) : null);
    return ts && ts >= cutoff;
  });
}

const FUNNEL_STATUS_ORDER = [
  "founder_call_clicked",
  "feedback_call_clicked",
  "report_downloaded",
  "report_opened",
  "report_generated",
  "assessment_submitted",
  "assessment_started",
  "assessment_landed",
];

const STATUS_LABELS = {
  founder_call_clicked: "founder call clicked",
  feedback_call_clicked: "feedback clicked",
  report_downloaded: "report downloaded",
  report_opened: "report opened",
  report_generated: "report generated",
  assessment_submitted: "submitted",
  assessment_started: "started",
  assessment_landed: "landed",
};

const ASSESSMENT_FUNNEL_STEPS = [
  { label: "Basic Context",     viewedEvent: "basic_context_started",    completedEvent: "basic_context_submitted" },
  { label: "Career Anchors",    viewedEvent: "career_anchors_viewed",    completedEvent: "career_anchors_submitted" },
  { label: "Financial Reality", viewedEvent: "financial_reality_viewed", completedEvent: "financial_reality_submitted" },
  { label: "Constraints",       viewedEvent: "constraints_viewed",       completedEvent: "constraints_submitted" },
  { label: "Credentials",       viewedEvent: "credentials_viewed",       completedEvent: "credentials_submitted" },
  { label: "CV Upload",         viewedEvent: "cv_step_viewed",           completedEvents: ["cv_uploaded", "cv_skipped"] },
  { label: "Priority Weights",  viewedEvent: "priority_weights_viewed",  completedEvent: "priority_weights_submitted" },
  { label: "Report",            viewedEvent: "report_opened",            completedEvents: ["report_downloaded", "founder_call_clicked"] },
];

function stepCompleted(session, step) {
  if (step.completedEvents) return step.completedEvents.some((e) => session.events.has(e));
  return session.events.has(step.completedEvent);
}

function sessionStatus(eventSet) {
  for (const evt of FUNNEL_STATUS_ORDER) {
    if (eventSet.has(evt)) return STATUS_LABELS[evt];
  }
  return "landed";
}

const FUNNEL_STEPS = [
  { key: "assessment_landed",     label: "Landed" },
  { key: "assessment_started",    label: "Started" },
  { key: "assessment_submitted",  label: "Submitted" },
  { key: "report_generated",      label: "Report generated" },
  { key: "report_opened",         label: "Report opened" },
  { key: "feedback_call_clicked", label: "Feedback call clicked" },
];

const DATE_RANGES = [
  { label: "Since new flow launch", value: "new_flow" },
  { label: "Last 24 hours",         value: "24h" },
  { label: "Last 7 days",           value: "7d" },
  { label: "All time",              value: "all" },
];

export default function FounderAnalytics() {
  const [hasAccess] = useState(() => checkAccess());
  const [events, setEvents] = useState([]);
  const [assessmentLinks, setAssessmentLinks] = useState([]); // { assessmentId, sessionId }[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("new_flow");

  useEffect(() => {
    if (!hasAccess) return;
    async function fetchEvents() {
      try {
        let snap;
        try {
          const q = query(
            collection(db, "analyticsEvents"),
            orderBy("createdAt", "desc"),
            limit(2000)
          );
          snap = await getDocs(q);
        } catch {
          const q = query(collection(db, "analyticsEvents"), limit(2000));
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

  // Fetch assessment docs to enrich session→assessmentId links as a fallback
  // for cases where the assessment_started event fails or has a drifted sessionId.
  useEffect(() => {
    if (!hasAccess) return;
    async function fetchAssessmentLinks() {
      try {
        const q = query(
          collection(db, "assessments"),
          orderBy("createdAt", "desc"),
          limit(500)
        );
        const snap = await getDocs(q);
        const links = [];
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.sessionId) links.push({ assessmentId: d.id, sessionId: data.sessionId });
        });
        setAssessmentLinks(links);
      } catch {
        // Non-blocking — event-based linking still works without this
      }
    }
    fetchAssessmentLinks();
  }, [hasAccess]);

  const filtered = useMemo(() => filterByDate(events, dateRange), [events, dateRange]);

  // Build per-session aggregates from filtered events
  const { sessionList, countByEvent } = useMemo(() => {
    const sessMap = {};
    const countByEvent = {};

    for (const e of filtered) {
      countByEvent[e.eventName] = (countByEvent[e.eventName] || 0) + 1;
      if (!e.sessionId) continue;
      if (!sessMap[e.sessionId]) {
        sessMap[e.sessionId] = {
          sessionId: e.sessionId,
          source: e.source || "direct",
          medium: e.medium || "",
          campaign: e.campaign || "",
          content: e.content || "",
          assessmentId: null,
          events: new Set(),
          eventCount: 0,
          lastAt: null,
        };
      }
      const s = sessMap[e.sessionId];
      s.events.add(e.eventName);
      s.eventCount++;
      if (e.assessmentId && !s.assessmentId) s.assessmentId = e.assessmentId;
      // Enrich attribution from events if initial session record was sparse
      if ((!s.source || s.source === "direct") && e.source && e.source !== "direct") {
        s.source = e.source;
      }
      if (!s.medium && e.medium) s.medium = e.medium;
      if (!s.campaign && e.campaign) s.campaign = e.campaign;
      if (!s.content && e.content) s.content = e.content;
      const ts = e.createdAt?.toDate?.() ?? (e.createdAt ? new Date(e.createdAt) : null);
      if (ts && (!s.lastAt || ts > s.lastAt)) s.lastAt = ts;
    }

    // Enrich sessions with assessment-doc links (fallback for when events alone don't link)
    for (const link of assessmentLinks) {
      if (link.sessionId && sessMap[link.sessionId] && !sessMap[link.sessionId].assessmentId) {
        sessMap[link.sessionId].assessmentId = link.assessmentId;
      }
    }

    return { sessionList: Object.values(sessMap), countByEvent };
  }, [filtered, assessmentLinks]);

  // Top-line metrics
  const metrics = useMemo(() => {
    const uniqueVisitors = sessionList.length;
    const starts    = sessionList.filter((s) => s.events.has("assessment_started")).length;
    const submitted = sessionList.filter((s) => s.events.has("assessment_submitted")).length;
    const generated = sessionList.filter((s) => s.events.has("report_generated")).length;
    const opened    = sessionList.filter((s) => s.events.has("report_opened")).length;
    const feedbackClicks = sessionList.filter(
      (s) => s.events.has("feedback_call_clicked") || s.events.has("founder_call_clicked")
    ).length;
    return {
      uniqueVisitors,
      starts,
      submitted,
      generated,
      opened,
      feedbackClicks,
      startRate:      pct(starts, uniqueVisitors),
      completionRate: pct(submitted, starts),
      reportOpenRate: pct(opened, generated),
    };
  }, [sessionList, countByEvent]);

  // Source performance
  const sourceRows = useMemo(() => {
    const map = {};
    for (const s of sessionList) {
      const src = s.source || "direct";
      if (!map[src]) map[src] = { source: src, visitors: 0, starts: 0, submitted: 0, reports: 0, opened: 0, feedbackClicks: 0 };
      const r = map[src];
      r.visitors++;
      if (s.events.has("assessment_started"))    r.starts++;
      if (s.events.has("assessment_submitted"))   r.submitted++;
      if (s.events.has("report_generated"))       r.reports++;
      if (s.events.has("report_opened"))          r.opened++;
      if (s.events.has("feedback_call_clicked"))  r.feedbackClicks++;
    }
    return Object.values(map).sort((a, b) => b.visitors - a.visitors);
  }, [sessionList]);

  // Campaign / Creative
  const campaignRows = useMemo(() => {
    const map = {};
    for (const s of sessionList) {
      const campaign = s.campaign || "(none)";
      const content  = s.content  || "(none)";
      const key = `${campaign}|||${content}`;
      if (!map[key]) map[key] = { campaign, content, visitors: 0, starts: 0, submitted: 0, reports: 0 };
      const r = map[key];
      r.visitors++;
      if (s.events.has("assessment_started"))   r.starts++;
      if (s.events.has("assessment_submitted"))  r.submitted++;
      if (s.events.has("report_generated"))      r.reports++;
    }
    return Object.values(map).sort((a, b) => b.visitors - a.visitors);
  }, [sessionList]);

  // Assessment step funnel
  const assessmentFunnelRows = useMemo(() => {
    return ASSESSMENT_FUNNEL_STEPS.map((step) => {
      const entered = sessionList.filter((s) => s.events.has(step.viewedEvent)).length;
      const completed = sessionList.filter((s) => stepCompleted(s, step)).length;
      const dropOff = entered - completed;
      return { label: step.label, entered, completed, dropOff, convPct: pct(completed, entered) };
    });
  }, [sessionList]);

  // Whether any campaign/content data exists (hide table if everything is "(none)")
  const hasCampaignData = useMemo(
    () => campaignRows.some((r) => r.campaign !== "(none)" || r.content !== "(none)"),
    [campaignRows]
  );

  // Recent sessions
  const recentSessions = useMemo(
    () => [...sessionList].sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0)).slice(0, 25),
    [sessionList]
  );

  if (!hasAccess) {
    return (
      <div style={S.gate}>
        <p style={S.gateText}>Founder access required.</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <h1 style={S.h1}>Analytics</h1>
          <span style={S.muted}>{loading ? "…" : `${filtered.length} events · ${sessionList.length} sessions`}</span>
        </div>
        <a href={`/founder${getFounderSearch()}`} style={S.navLink}>← Founder Inbox</a>
      </div>

      {/* Date filter */}
      <div style={S.filterRow}>
        {DATE_RANGES.map((r) => (
          <button
            key={r.value}
            style={dateRange === r.value ? S.filterBtnActive : S.filterBtn}
            onClick={() => setDateRange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {dateRange === "new_flow" && (
        <p style={S.baselineNote}>
          Showing data since new flow launch. Historical test data is preserved but hidden by default.
        </p>
      )}

      {error && <p style={S.errorMsg}>{error}</p>}
      {loading && !error && <p style={S.muted}>Loading…</p>}

      {!loading && !error && (
        <>
          {/* ── Summary cards ── */}
          <div style={S.card}>
            <h2 style={S.h2}>Summary</h2>
            <div style={S.metricsGrid}>
              {[
                { label: "Unique sessions",   value: metrics.uniqueVisitors },
                { label: "Assessment starts",  value: metrics.starts },
                { label: "Submitted",          value: metrics.submitted },
                { label: "Reports generated",  value: metrics.generated },
                { label: "Start rate",         value: metrics.startRate },
                { label: "Completion rate",    value: metrics.completionRate },
                { label: "Report open rate",   value: metrics.reportOpenRate },
                { label: "Feedback clicks",    value: metrics.feedbackClicks },
              ].map(({ label, value }) => (
                <div key={label} style={S.metricCell}>
                  <div style={S.metricValue}>{value}</div>
                  <div style={S.metricLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Overall funnel ── */}
          <div style={S.card}>
            <h2 style={S.h2}>Funnel (all sources)</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Step", "Sessions", "vs. prev step", "vs. landed"].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FUNNEL_STEPS.map((step, i) => {
                    const count = sessionList.filter((s) => s.events.has(step.key)).length;
                    const prevCount = i > 0
                      ? sessionList.filter((s) => s.events.has(FUNNEL_STEPS[i - 1].key)).length
                      : null;
                    const landedCount = sessionList.filter((s) => s.events.has("assessment_landed")).length || sessionList.length;
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
          </div>

          {/* ── Assessment step funnel ── */}
          <div style={S.card}>
            <h2 style={S.h2}>Assessment Funnel</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Step", "Entered / Viewed", "Completed", "Drop-off", "Conversion %"].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assessmentFunnelRows.map((row) => (
                    <tr key={row.label} style={S.tr}>
                      <td style={{ ...S.td, fontWeight: 600 }}>{row.label}</td>
                      <td style={{ ...S.td, fontWeight: 700 }}>{row.entered}</td>
                      <td style={S.td}>{row.completed}</td>
                      <td style={{ ...S.td, color: row.dropOff > 0 ? "#dc2626" : "#6b7280" }}>
                        {row.dropOff > 0 ? `−${row.dropOff}` : "—"}
                      </td>
                      <td style={{ ...S.td, color: "#6b7280" }}>{row.convPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Source performance ── */}
          <div style={S.card}>
            <h2 style={S.h2}>Source performance</h2>
            {sourceRows.length === 0 ? (
              <p style={S.muted}>No data yet.</p>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["Source", "Visitors", "Starts", "Submitted", "Reports", "Opened", "Feedback clicks", "Start rate", "Submit rate", "Report rate"].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sourceRows.map((r) => (
                      <tr key={r.source} style={S.tr}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{r.source}</td>
                        <td style={S.td}>{r.visitors}</td>
                        <td style={S.td}>{r.starts}</td>
                        <td style={S.td}>{r.submitted}</td>
                        <td style={S.td}>{r.reports}</td>
                        <td style={S.td}>{r.opened}</td>
                        <td style={S.td}>{r.feedbackClicks}</td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{pct(r.starts, r.visitors)}</td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{pct(r.submitted, r.starts)}</td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{pct(r.reports, r.submitted)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Campaign / Creative — only shown when data exists ── */}
          {hasCampaignData && (
            <div style={S.card}>
              <h2 style={S.h2}>Campaign / Creative</h2>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["Campaign", "Content / Creative", "Visitors", "Starts", "Submitted", "Reports", "Start rate", "Report rate"].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaignRows.map((r, i) => (
                      <tr key={i} style={S.tr}>
                        <td style={S.td}>{r.campaign}</td>
                        <td style={S.td}>{r.content}</td>
                        <td style={S.td}>{r.visitors}</td>
                        <td style={S.td}>{r.starts}</td>
                        <td style={S.td}>{r.submitted}</td>
                        <td style={S.td}>{r.reports}</td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{pct(r.starts, r.visitors)}</td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{pct(r.reports, r.submitted)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Funnel by source ── */}
          {sourceRows.length > 0 && (
            <div style={S.card}>
              <h2 style={S.h2}>Funnel by source</h2>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {["Source", "Landed", "Started", "Submitted", "Report gen.", "Report opened"].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sourceRows.map((r) => (
                      <tr key={r.source} style={S.tr}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{r.source}</td>
                        <td style={S.td}>{r.visitors}</td>
                        <td style={S.td}>{r.starts} <span style={S.dimPct}>({pct(r.starts, r.visitors)})</span></td>
                        <td style={S.td}>{r.submitted} <span style={S.dimPct}>({pct(r.submitted, r.visitors)})</span></td>
                        <td style={S.td}>{r.reports} <span style={S.dimPct}>({pct(r.reports, r.visitors)})</span></td>
                        <td style={S.td}>{r.opened} <span style={S.dimPct}>({pct(r.opened, r.visitors)})</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CV step breakdown ── */}
          <div style={S.card}>
            <h2 style={S.h2}>CV Step</h2>
            <div style={S.metricsGrid}>
              {[
                ["cv_step_started",    "CV step started"],
                ["cv_uploaded",        "PDF uploaded"],
                ["cv_parse_started",   "Parse started"],
                ["cv_parse_succeeded", "Parse succeeded"],
                ["cv_parse_failed",    "Parse failed"],
                ["cv_skipped",         "CV skipped"],
              ].map(([key, label]) => (
                <div key={key} style={S.metricCell}>
                  <div style={S.metricValue}>{countByEvent[key] || 0}</div>
                  <div style={S.metricLabel}>{label}</div>
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
                      {["Session ID", "Source", "Campaign", "Content", "Assessment ID", "Status", "Last seen", "Events"].map((h) => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((sess) => (
                      <tr key={sess.sessionId} style={S.tr}>
                        <td style={S.td}>
                          <span style={S.mono}>{sess.sessionId.slice(0, 22)}…</span>
                        </td>
                        <td style={S.td}>
                          <span style={S.sourcePill}>{sess.source || "direct"}</span>
                        </td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{sess.campaign || "—"}</td>
                        <td style={{ ...S.td, color: "#6b7280" }}>{sess.content || "—"}</td>
                        <td style={S.td}>
                          {sess.assessmentId ? (
                            <a href={`/founder/${sess.assessmentId}${getFounderSearch()}`} style={S.inlineLink}>
                              {sess.assessmentId.slice(0, 14)}…
                            </a>
                          ) : (
                            <span style={S.muted}>—</span>
                          )}
                        </td>
                        <td style={S.td}>
                          <span style={S.statusPill}>{sessionStatus(sess.events)}</span>
                        </td>
                        <td style={S.td}>
                          <span style={S.mono}>{formatTs(sess.lastAt)}</span>
                        </td>
                        <td style={{ ...S.td, color: "#6b7280", fontSize: 12 }}>{sess.eventCount}</td>
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
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
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
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    background: "var(--color-surface, #ffffff)",
    border: "1px solid var(--color-border, #e2e0da)",
    borderRadius: 8,
    cursor: "pointer",
    color: "var(--color-text-muted, #6b7280)",
  },
  filterBtnActive: {
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit",
    background: "var(--color-text-strong, #111827)",
    border: "1px solid var(--color-text-strong, #111827)",
    borderRadius: 8,
    cursor: "pointer",
    color: "#ffffff",
  },
  card: {
    background: "var(--color-surface, #ffffff)",
    border: "1px solid var(--color-border, #e2e0da)",
    borderRadius: "var(--radius-lg, 16px)",
    padding: "20px 24px",
    marginBottom: 16,
    boxShadow: "var(--shadow-sm, 0 1px 3px rgba(17,24,39,0.07))",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: 12,
  },
  metricCell: {
    padding: "12px 14px",
    background: "var(--color-bg, #f7f6f3)",
    borderRadius: 10,
    border: "1px solid var(--color-border, #e2e0da)",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "var(--color-text-strong, #111827)",
    lineHeight: 1.1,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "var(--color-text-muted, #6b7280)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    lineHeight: 1.4,
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
    verticalAlign: "middle",
  },
  muted: {
    color: "var(--color-text-muted, #6b7280)",
    fontSize: 13,
  },
  dimPct: {
    fontSize: 11,
    color: "#9ca3af",
    marginLeft: 3,
  },
  mono: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 11,
    color: "var(--color-text-muted, #6b7280)",
    whiteSpace: "nowrap",
  },
  sourcePill: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    background: "#e0f2fe",
    color: "#0369a1",
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  statusPill: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    background: "#f0fdf4",
    color: "#166534",
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  baselineNote: {
    fontSize: 12,
    color: "#6b7280",
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: 8,
    padding: "8px 14px",
    marginBottom: 16,
    lineHeight: 1.5,
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
};
