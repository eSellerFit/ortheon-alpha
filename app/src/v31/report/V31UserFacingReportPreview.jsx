/**
 * Ortheon MVP Cut v3.1 — Internal Report Preview
 *
 * Bundle 18G — updated to card-based layout using 18F view model fields.
 * Route: /internal/v31-report?documentId=<id>
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls.
 * - Renders report view model only — no raw payload, no debug metadata.
 * - Does not replace ResultsStep, PdfReport, or CareerDirectionMap.
 * - Does not show API cost, pipeline status, source, qualityNotes, or raw IDs.
 */

import { useEffect, useState } from "react";
import { readV31UserFacingReportFromFirestoreV31 } from "./readV31UserFacingReportFromFirestore.js";

// ── Styles ─────────────────────────────────────────────────────────────────────

const S = {
  page: {
    fontFamily: "'system-ui', '-apple-system', 'Segoe UI', sans-serif",
    fontSize: "15px",
    lineHeight: "1.6",
    maxWidth: "860px",
    margin: "0 auto",
    padding: "32px 20px 96px",
    color: "#1a1a1a",
    background: "#f9f8f7",
    minHeight: "100vh",
  },

  // Brand strip
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#aaa",
  },
  brandName: { fontWeight: "800", color: "#1a1a1a", fontSize: "13px" },
  brandSep: { color: "#ccc" },
  brandTag: { color: "#888" },

  // Section divider + title
  divider: { borderTop: "1px solid #e8e5e0", margin: "36px 0 20px" },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#999",
    marginBottom: "16px",
  },

  // Executive Summary
  headline: {
    fontSize: "26px",
    fontWeight: "700",
    lineHeight: "1.3",
    color: "#111",
    marginBottom: "14px",
  },
  coverSummary: {
    fontSize: "16px",
    lineHeight: "1.75",
    color: "#333",
    marginBottom: "20px",
  },
  metaField: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "10px",
  },
  metaLabel: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#aaa",
    marginBottom: "4px",
  },
  metaValue: { fontSize: "15px", color: "#1a1a1a", lineHeight: "1.5" },
  statusMixRow: { display: "flex", flexWrap: "wrap", gap: "8px", margin: "10px 0 16px" },

  // Section 2: Decision Dashboard
  dashGrid: { display: "flex", flexWrap: "wrap", gap: "10px" },
  dashCard: {
    flex: "1 1 150px",
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "10px",
    padding: "16px 18px",
    minWidth: "140px",
    maxWidth: "240px",
  },
  dashCardLabel: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#aaa",
    marginBottom: "8px",
  },
  dashCardValue: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#111",
    marginBottom: "6px",
    lineHeight: "1.3",
  },
  dashCardDesc: { fontSize: "12px", color: "#666", lineHeight: "1.5", marginTop: "8px" },

  // Section 3: Input Signal Cards
  signalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "10px",
  },
  signalCard: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  signalCardTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "12px",
    lineHeight: "1.4",
  },
  signalRow: { marginBottom: "8px" },
  signalRowLabel: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#aaa",
    marginBottom: "3px",
  },
  signalRowText: { fontSize: "13px", color: "#444", lineHeight: "1.55" },

  // Section 4: Compact Direction Cards
  compactDirCard: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "8px",
  },
  compactDirHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "6px",
  },
  compactDirOrder: { fontSize: "12px", color: "#bbb", flexShrink: 0, paddingTop: "3px" },
  compactDirLabel: { fontWeight: "600", fontSize: "15px", flex: 1, lineHeight: "1.4" },
  compactDirBadges: { display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "8px" },
  compactDirWhy: { fontSize: "13px", color: "#555", lineHeight: "1.5", marginBottom: "6px" },
  compactDirRisk: { fontSize: "12px", color: "#b45309", lineHeight: "1.5", marginBottom: "5px" },
  compactDirStep: { fontSize: "12px", color: "#2563eb", fontStyle: "italic", lineHeight: "1.5" },

  // Section 5: Primary Direction Deep Dive
  primaryCard: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderLeft: "4px solid #16a34a",
    borderRadius: "8px",
    marginBottom: "10px",
    overflow: "hidden",
  },
  cardHead: { padding: "16px 20px 10px" },
  cardBody: { borderTop: "1px solid #f0ede8", padding: "14px 20px 18px" },
  dirTitle: { fontSize: "18px", fontWeight: "700", lineHeight: "1.3", marginBottom: "8px" },
  dirArena: { fontSize: "13px", color: "#888", marginTop: "4px" },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" },
  subTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#aaa",
    marginTop: "14px",
    marginBottom: "5px",
    display: "block",
  },
  bodyList: {
    margin: "0 0 0 16px",
    padding: 0,
    lineHeight: "1.7",
    fontSize: "14px",
    color: "#333",
  },
  bodyText: { fontSize: "14px", color: "#333", lineHeight: "1.6" },
  firstStepBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    padding: "10px 14px",
    marginTop: "12px",
  },
  firstStepBoxLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#1d4ed8",
    marginBottom: "4px",
  },
  bridgeBox: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "6px",
    padding: "10px 14px",
    marginTop: "10px",
  },
  bridgeBoxLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#92400e",
    marginBottom: "4px",
  },

  // Section 6: Other Directions Compact
  otherDirCard: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderLeft: "4px solid #d97706",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "8px",
  },
  otherDirHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" },
  otherDirLabel: { fontWeight: "600", fontSize: "14px", flex: 1, lineHeight: "1.4" },
  otherDirRowLabel: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#aaa",
    marginBottom: "3px",
  },
  otherDirRowText: { fontSize: "13px", color: "#444", lineHeight: "1.55", marginBottom: "8px" },
  otherDirConditionBox: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "6px",
    padding: "8px 12px",
    marginTop: "6px",
    marginBottom: "8px",
    fontSize: "13px",
    color: "#78350f",
    lineHeight: "1.5",
  },
  otherDirStep: { fontSize: "12px", color: "#2563eb", fontStyle: "italic" },

  // Section 7: Not-Now Directions
  notNowCard: {
    background: "#fafaf9",
    border: "1px solid #e2e8f0",
    borderLeft: "4px solid #cbd5e1",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "8px",
  },
  dirTitleSmall: { fontSize: "15px", fontWeight: "600", lineHeight: "1.4", marginBottom: "6px" },

  // Section 8: Validation Plan
  planContainer: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "8px",
    padding: "4px 20px",
    marginBottom: "12px",
  },
  planItem: {
    display: "flex",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid #f0ede8",
    alignItems: "flex-start",
  },
  planNum: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#bbb",
    minWidth: "22px",
    paddingTop: "2px",
    flexShrink: 0,
  },
  planText: { fontSize: "14px", color: "#333", lineHeight: "1.55" },
  planSubTitle: { fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "8px" },

  // Section 9: Confidence Notes
  confidenceContainer: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "8px",
    padding: "20px",
  },
  confidenceSubTitle: { fontSize: "12px", fontWeight: "700", color: "#555", marginBottom: "6px" },

  // States
  loadingText: { padding: "48px 0", textAlign: "center", color: "#aaa" },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "16px 20px",
    color: "#991b1b",
    margin: "20px 0",
  },
  usageBox: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "10px",
    padding: "28px",
    marginTop: "8px",
    lineHeight: "1.9",
    color: "#555",
  },
};

// ── Badge helpers ──────────────────────────────────────────────────────────────

function badge(label, theme) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: "600",
        ...theme,
      }}
    >
      {label}
    </span>
  );
}

const STATUS_THEMES = {
  "credible now":               { background: "#dcfce7", color: "#166534" },
  "credible now, with caution": { background: "#fef3c7", color: "#92400e" },
  "bridge required":            { background: "#fef9c3", color: "#78350f" },
  "secondary option":           { background: "#e0f2fe", color: "#0369a1" },
  exploratory:                  { background: "#ede9fe", color: "#5b21b6" },
  "not now":                    { background: "#f1f5f9", color: "#475569" },
  "needs validation":           { background: "#f1f5f9", color: "#64748b" },
  clear:                        { background: "#dcfce7", color: "#166534" },
  caution:                      { background: "#fef3c7", color: "#92400e" },
  high:                         { background: "#dcfce7", color: "#166534" },
  medium:                       { background: "#fef3c7", color: "#92400e" },
  low:                          { background: "#fee2e2", color: "#991b1b" },
  mixed:                        { background: "#f5f3ff", color: "#5b21b6" },
  none:                         { background: "#f1f5f9", color: "#64748b" },
};

const CONFIDENCE_THEMES = {
  high:              { background: "#dcfce7", color: "#166534" },
  medium:            { background: "#fef3c7", color: "#92400e" },
  low:               { background: "#fee2e2", color: "#991b1b" },
  insufficient_data: { background: "#f1f5f9", color: "#64748b" },
};

const TYPE_LABELS = {
  bridge:          "Bridge",
  secondary:       "Secondary",
  exploratory:     "Exploratory",
  not_recommended: "Considered",
};

function statusBadge(status) {
  const key = String(status || "").toLowerCase();
  const theme = STATUS_THEMES[key] || { background: "#f1f5f9", color: "#64748b" };
  return badge(status, theme);
}

function confidenceBadge(confidence) {
  if (!confidence) return null;
  const key = String(confidence).toLowerCase();
  const theme = CONFIDENCE_THEMES[key] || { background: "#f1f5f9", color: "#64748b" };
  return badge(confidence + " confidence", theme);
}

function routeBadge(route) {
  if (!route) return null;
  return badge(route, { background: "#eff6ff", color: "#1d4ed8" });
}

function workBadge(work) {
  if (!work) return null;
  return badge(work, { background: "#f5f3ff", color: "#6d28d9" });
}

// ── Shared layout primitives ───────────────────────────────────────────────────

const STATUS_MIX_DEFS = [
  { key: "credibleNow",         label: "Credible now",    theme: STATUS_THEMES["credible now"] },
  { key: "credibleWithCaution", label: "With caution",    theme: STATUS_THEMES["credible now, with caution"] },
  { key: "bridgeRequired",      label: "Bridge required", theme: STATUS_THEMES["bridge required"] },
  { key: "secondaryOption",     label: "Secondary",       theme: STATUS_THEMES["secondary option"] },
  { key: "exploratory",         label: "Exploratory",     theme: STATUS_THEMES.exploratory },
  { key: "notNow",              label: "Not now",         theme: STATUS_THEMES["not now"] },
];

function StatusMixBadges({ statusMix }) {
  if (!statusMix) return null;
  const nonZero = STATUS_MIX_DEFS.filter((d) => (statusMix[d.key] || 0) > 0);
  if (nonZero.length === 0) return null;
  return (
    <div style={S.statusMixRow}>
      {nonZero.map(({ key, label, theme }) => (
        <span key={key}>{badge(`${statusMix[key]} ${label}`, theme)}</span>
      ))}
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <>
      <div style={S.divider} />
      <div style={S.sectionTitle}>{title}</div>
    </>
  );
}

function BulletList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <ul style={S.bodyList}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function MetaField({ label, value }) {
  if (!value) return null;
  return (
    <div style={S.metaField}>
      <div style={S.metaLabel}>{label}</div>
      <div style={S.metaValue}>{value}</div>
    </div>
  );
}

// ── Section 2: Decision Dashboard ─────────────────────────────────────────────

function DashboardCard({ card }) {
  return (
    <div style={S.dashCard}>
      <div style={S.dashCardLabel}>{card.label}</div>
      <div style={S.dashCardValue}>{String(card.value)}</div>
      <div>{statusBadge(card.status)}</div>
      <div style={S.dashCardDesc}>{card.description}</div>
    </div>
  );
}

function DecisionDashboard({ cards }) {
  if (!Array.isArray(cards) || cards.length === 0) return null;
  return (
    <div style={S.dashGrid}>
      {cards.map((card) => (
        <DashboardCard key={card.id} card={card} />
      ))}
    </div>
  );
}

// ── Section 3: Input Signal Cards ─────────────────────────────────────────────

function InputSignalCard({ card }) {
  return (
    <div style={S.signalCard}>
      <div style={S.signalCardTitle}>{card.title}</div>
      {card.signal && (
        <div style={S.signalRow}>
          <div style={S.signalRowLabel}>Signal</div>
          <div style={S.signalRowText}>{card.signal}</div>
        </div>
      )}
      {card.interpretation && (
        <div style={S.signalRow}>
          <div style={S.signalRowLabel}>Interpretation</div>
          <div style={S.signalRowText}>{card.interpretation}</div>
        </div>
      )}
      {card.impact && (
        <div style={{ ...S.signalRow, marginBottom: 0 }}>
          <div style={S.signalRowLabel}>Impact</div>
          <div style={S.signalRowText}>{card.impact}</div>
        </div>
      )}
    </div>
  );
}

// ── Section 4: Compact Direction Cards ────────────────────────────────────────

function CompactDirectionCard({ dir }) {
  return (
    <div style={S.compactDirCard}>
      <div style={S.compactDirHeader}>
        <span style={S.compactDirOrder}>#{dir.displayOrder}</span>
        <span style={S.compactDirLabel}>{dir.label}</span>
      </div>
      <div style={S.compactDirBadges}>
        {statusBadge(dir.status)}
        {confidenceBadge(dir.confidence)}
        {routeBadge(dir.routeType)}
        {workBadge(dir.workModel)}
      </div>
      {dir.whyThisIsHere && (
        <div style={S.compactDirWhy}>{dir.whyThisIsHere}</div>
      )}
      {dir.mainRisk && (
        <div style={S.compactDirRisk}>
          <strong style={{ fontWeight: "600" }}>Risk:</strong> {dir.mainRisk}
        </div>
      )}
      {dir.firstValidationStep && (
        <div style={S.compactDirStep}>First step: {dir.firstValidationStep}</div>
      )}
    </div>
  );
}

// ── Section 5: Primary Direction Deep Dive ────────────────────────────────────

function PrimaryDeepDive({ direction }) {
  if (!direction) return null;
  return (
    <div style={S.primaryCard}>
      <div style={S.cardHead}>
        <div style={S.dirTitle}>{direction.label}</div>
        <div style={S.badgeRow}>
          {statusBadge(direction.currentRealismStatus)}
          {confidenceBadge(direction.confidence)}
          {routeBadge(direction.routeType)}
          {workBadge(direction.workModel)}
        </div>
        {direction.directionArena && (
          <div style={S.dirArena}>{direction.directionArena}</div>
        )}
      </div>

      <div style={S.cardBody}>
        {direction.whatThisDirectionMeans &&
          direction.whatThisDirectionMeans !== direction.directionArena && (
            <>
              <span style={S.subTitle}>What this direction means</span>
              <div style={S.bodyText}>{direction.whatThisDirectionMeans}</div>
            </>
          )}

        {direction.firstValidationStep && (
          <div style={S.firstStepBox}>
            <span style={S.firstStepBoxLabel}>First validation step</span>
            {direction.firstValidationStep}
          </div>
        )}

        {direction.bridgeStrategy && (
          <div style={S.bridgeBox}>
            <span style={S.bridgeBoxLabel}>Bridge strategy</span>
            {direction.bridgeStrategy}
          </div>
        )}

        {direction.whyItFits?.length > 0 && (
          <>
            <span style={S.subTitle}>Why it fits</span>
            <BulletList items={direction.whyItFits} />
          </>
        )}
        {direction.whyItIsCredible?.length > 0 && (
          <>
            <span style={S.subTitle}>Why it is credible</span>
            <BulletList items={direction.whyItIsCredible} />
          </>
        )}
        {direction.whatMakesItRisky?.length > 0 && (
          <>
            <span style={S.subTitle}>Main risks</span>
            <BulletList items={direction.whatMakesItRisky} />
          </>
        )}
        {direction.whatWouldMakeItStronger?.length > 0 && (
          <>
            <span style={S.subTitle}>What would make it stronger</span>
            <BulletList items={direction.whatWouldMakeItStronger} />
          </>
        )}
        {direction.notRecommendedIf?.length > 0 && (
          <>
            <span style={S.subTitle}>Not recommended if</span>
            <BulletList items={direction.notRecommendedIf} />
          </>
        )}
      </div>
    </div>
  );
}

// ── Section 6: Other Directions Compact ───────────────────────────────────────

function OtherDirectionCard({ dir }) {
  const typeLabel = TYPE_LABELS[dir.type] || dir.type;
  return (
    <div style={S.otherDirCard}>
      <div style={S.otherDirHeader}>
        <span style={S.otherDirLabel}>{dir.label}</span>
        {badge(typeLabel, { background: "#f5f3ff", color: "#5b21b6" })}
        {statusBadge(dir.status)}
      </div>
      {dir.whyInteresting && (
        <>
          <div style={S.otherDirRowLabel}>Why it is interesting</div>
          <div style={S.otherDirRowText}>{dir.whyInteresting}</div>
        </>
      )}
      {dir.whyNotPrimaryNow && (
        <>
          <div style={S.otherDirRowLabel}>Why not primary now</div>
          <div style={S.otherDirRowText}>{dir.whyNotPrimaryNow}</div>
        </>
      )}
      {dir.bridgeOrValidationCondition && (
        <div style={S.otherDirConditionBox}>{dir.bridgeOrValidationCondition}</div>
      )}
      {dir.firstValidationStep && (
        <div style={S.otherDirStep}>First step: {dir.firstValidationStep}</div>
      )}
    </div>
  );
}

// ── Section 7: Not-Now Direction Card ─────────────────────────────────────────

function NotNowCard({ direction }) {
  return (
    <div style={S.notNowCard}>
      <div style={S.dirTitleSmall}>{direction.label}</div>
      {direction.reason && <div style={S.bodyText}>{direction.reason}</div>}
      {direction.supportingConcerns?.length > 0 && (
        <>
          <span style={{ ...S.subTitle, marginTop: "10px" }}>Supporting concerns</span>
          <BulletList items={direction.supportingConcerns} />
        </>
      )}
      {direction.whatWouldChangeThis && (
        <>
          <span style={{ ...S.subTitle, marginTop: "10px" }}>What would change this</span>
          <div style={S.bodyText}>{direction.whatWouldChangeThis}</div>
        </>
      )}
    </div>
  );
}

// ── Section 8: Validation Plan Item ───────────────────────────────────────────

function PlanItem({ number, text }) {
  return (
    <div style={S.planItem}>
      <span style={S.planNum}>{number}.</span>
      <span style={S.planText}>{text}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31UserFacingReportPreview() {
  const params = new URLSearchParams(window.location.search);
  const documentId = params.get("documentId") || "";

  const [state, setState] = useState({
    status: "idle",
    reportViewModel: null,
    error: null,
  });

  useEffect(() => {
    if (!documentId) return;
    setState({ status: "loading", reportViewModel: null, error: null });
    readV31UserFacingReportFromFirestoreV31({ documentId })
      .then((result) => {
        if (result.ok) {
          setState({ status: "ok", reportViewModel: result.reportViewModel, error: null });
        } else {
          setState({
            status: "error",
            reportViewModel: null,
            error: result.error || "Could not load report.",
          });
        }
      })
      .catch((err) => {
        setState({
          status: "error",
          reportViewModel: null,
          error: err?.message || "Unexpected error loading report.",
        });
      });
  }, [documentId]);

  // ── No documentId ──────────────────────────────────────────────────────────

  if (!documentId) {
    return (
      <div style={S.page}>
        <div style={S.brand}>
          <span style={S.brandName}>Ortheon</span>
          <span style={S.brandSep}>·</span>
          <span style={S.brandTag}>Career Report Preview</span>
        </div>
        <div style={S.usageBox}>
          <strong style={{ color: "#1a1a1a" }}>v3.1 Report Preview</strong>
          <br />
          Provide a document ID to load a saved v3.1 result:
          <br />
          <code
            style={{
              fontFamily: "monospace",
              background: "#f0f0f0",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            /internal/v31-report?documentId=&lt;assessmentId&gt;
          </code>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (state.status === "loading") {
    return (
      <div style={S.page}>
        <div style={S.loadingText}>Loading report for {documentId}…</div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (state.status === "error") {
    return (
      <div style={S.page}>
        <div style={S.brand}>
          <span style={S.brandName}>Ortheon</span>
          <span style={S.brandSep}>·</span>
          <span style={S.brandTag}>Career Report Preview</span>
        </div>
        <div style={S.errorBox}>
          <strong>Could not load report</strong>
          <br />
          {state.error}
        </div>
      </div>
    );
  }

  if (state.status !== "ok" || !state.reportViewModel) return null;

  const vm = state.reportViewModel;
  const {
    assessmentId,
    generatedAt,
    reportMeta,
    cover,
    decisionDashboard,
    inputSignalCards,
    compactDirectionCards,
    primaryDirectionDeepDive,
    otherDirectionsCompact,
    notNowDirections,
    validationPlan,
    confidenceNotes,
  } = vm;

  // ── Report ─────────────────────────────────────────────────────────────────

  return (
    <div style={S.page}>
      {/* Brand strip */}
      <div style={S.brand}>
        <span style={S.brandName}>Ortheon</span>
        <span style={S.brandSep}>·</span>
        <span style={S.brandTag}>Career Report Preview</span>
        <span style={S.brandSep}>·</span>
        <span style={{ fontFamily: "monospace", fontSize: "10px" }}>{assessmentId}</span>
      </div>

      {/* ── 1. Executive Summary ── */}
      {cover.headline && <div style={S.headline}>{cover.headline}</div>}
      {cover.summary && <div style={S.coverSummary}>{cover.summary}</div>}
      <StatusMixBadges statusMix={cover.statusMix} />
      {cover.recommendedStrategy && (
        <MetaField label="Recommended strategy" value={cover.recommendedStrategy} />
      )}
      {cover.mainTension && (
        <MetaField label="Main tension" value={cover.mainTension} />
      )}

      {/* ── 2. Decision Dashboard ── */}
      {decisionDashboard?.cards?.length > 0 && (
        <>
          <SectionDivider title="Decision dashboard" />
          <DecisionDashboard cards={decisionDashboard.cards} />
        </>
      )}

      {/* ── 3. Your Input Signals ── */}
      {inputSignalCards?.length > 0 && (
        <>
          <SectionDivider title="Your input signals" />
          <div style={S.signalGrid}>
            {inputSignalCards.map((card) => (
              <InputSignalCard key={card.id} card={card} />
            ))}
          </div>
        </>
      )}

      {/* ── 4. Direction Portfolio ── */}
      {compactDirectionCards?.length > 0 && (
        <>
          <SectionDivider
            title={`Your directions — ${reportMeta.directionCount} assessed`}
          />
          {compactDirectionCards.map((dir, i) => (
            <CompactDirectionCard key={i} dir={dir} />
          ))}
          {reportMeta.rejectedDirectionCount > 0 && (
            <div style={{ fontSize: "13px", color: "#aaa", marginTop: "6px" }}>
              + {reportMeta.rejectedDirectionCount} direction
              {reportMeta.rejectedDirectionCount !== 1 ? "s" : ""} not recommended at this time
            </div>
          )}
        </>
      )}

      {/* ── 5. Primary Direction Deep Dive ── */}
      {primaryDirectionDeepDive && (
        <>
          <SectionDivider title="Primary direction" />
          <PrimaryDeepDive direction={primaryDirectionDeepDive} />
        </>
      )}

      {/* ── 6. Other Directions ── */}
      {otherDirectionsCompact?.length > 0 && (
        <>
          <SectionDivider
            title={`Other direction${otherDirectionsCompact.length !== 1 ? "s" : ""}`}
          />
          {otherDirectionsCompact.map((dir, i) => (
            <OtherDirectionCard key={i} dir={dir} />
          ))}
        </>
      )}

      {/* ── 7. Not-Now Directions ── */}
      {notNowDirections?.length > 0 && (
        <>
          <SectionDivider title="Not recommended at this time" />
          <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "12px" }}>
            These directions were considered but are not the right move given current evidence.
          </div>
          {notNowDirections.map((dir, i) => (
            <NotNowCard key={i} direction={dir} />
          ))}
        </>
      )}

      {/* ── 8. 30-Day Validation Plan ── */}
      {validationPlan.next30Days.length > 0 && (
        <>
          <SectionDivider title="What to do in the next 30 days" />
          <div style={S.planContainer}>
            {validationPlan.next30Days.map((action, i) => (
              <PlanItem key={i} number={i + 1} text={action} />
            ))}
          </div>
          {validationPlan.evidenceToBuild.length > 0 && (
            <>
              <div style={S.planSubTitle}>Evidence to build</div>
              <BulletList items={validationPlan.evidenceToBuild} />
            </>
          )}
          {validationPlan.conversationsToHave.length > 0 && (
            <>
              <div style={{ ...S.planSubTitle, marginTop: "14px" }}>
                Conversations to have
              </div>
              <BulletList items={validationPlan.conversationsToHave} />
            </>
          )}
          {validationPlan.decisionsToMake.length > 0 && (
            <>
              <div style={{ ...S.planSubTitle, marginTop: "14px" }}>Decisions to make</div>
              <BulletList items={validationPlan.decisionsToMake} />
            </>
          )}
        </>
      )}

      {/* ── 9. Confidence and Limitations ── */}
      {(confidenceNotes.caveats.length > 0 ||
        confidenceNotes.missingEvidence.length > 0 ||
        confidenceNotes.lowConfidenceReasons.length > 0) && (
        <>
          <SectionDivider title="Confidence and limitations" />
          <div style={S.confidenceContainer}>
            {confidenceNotes.missingEvidence.length > 0 && (
              <>
                <div style={S.confidenceSubTitle}>Missing evidence</div>
                <BulletList items={confidenceNotes.missingEvidence} />
              </>
            )}
            {confidenceNotes.lowConfidenceReasons.length > 0 && (
              <>
                <div
                  style={{ ...S.confidenceSubTitle, marginTop: "12px" }}
                >
                  Why some directions show lower confidence
                </div>
                <BulletList items={confidenceNotes.lowConfidenceReasons} />
              </>
            )}
            {confidenceNotes.caveats.length > 0 && (
              <>
                <div style={{ ...S.confidenceSubTitle, marginTop: "12px" }}>
                  Additional caveats
                </div>
                <BulletList items={confidenceNotes.caveats} />
              </>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "48px",
          fontSize: "11px",
          color: "#ccc",
          textAlign: "center",
        }}
      >
        Ortheon v3.1 · Internal preview ·{" "}
        {generatedAt
          ? new Date(generatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </div>
    </div>
  );
}
