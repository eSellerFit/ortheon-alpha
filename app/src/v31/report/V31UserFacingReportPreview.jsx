/**
 * Ortheon MVP Cut v3.1 — Internal Report Preview
 *
 * Bundle 18C internal read-only preview.
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "32px 20px 96px",
    color: "#1a1a1a",
    background: "#f9f8f7",
    minHeight: "100vh",
  },

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

  // Cover
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

  // Cards
  card: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "8px",
    marginBottom: "10px",
    overflow: "hidden",
  },
  cardPrimaryAccent: { borderLeft: "4px solid #16a34a" },
  cardBridgeAccent: { borderLeft: "4px solid #d97706" },
  cardExploratoryAccent: { borderLeft: "4px solid #7c3aed" },
  cardNotNowAccent: { background: "#fafaf9", borderLeft: "4px solid #cbd5e1" },

  cardHead: {
    padding: "16px 20px 10px",
  },
  cardBody: {
    padding: "0 20px 18px",
  },
  cardBodyTop: {
    borderTop: "1px solid #f0ede8",
    paddingTop: "14px",
  },

  // Direction cards
  dirTitle: {
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1.3",
    marginBottom: "8px",
  },
  dirTitleSmall: {
    fontSize: "15px",
    fontWeight: "600",
    lineHeight: "1.4",
    marginBottom: "6px",
  },
  badgeRow: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" },
  dirArena: { fontSize: "13px", color: "#888", marginTop: "4px" },

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

  // Portfolio row (compact)
  portRow: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "6px",
    padding: "14px 16px",
    marginBottom: "8px",
  },
  portHeader: { display: "flex", alignItems: "flex-start", gap: "10px" },
  portOrder: { fontSize: "12px", color: "#bbb", flexShrink: 0, paddingTop: "3px" },
  portLabel: { fontWeight: "600", fontSize: "15px", flex: 1, lineHeight: "1.4" },
  portShortWhy: {
    fontSize: "13px",
    color: "#666",
    marginTop: "6px",
    lineHeight: "1.5",
  },
  portFirstStep: {
    fontSize: "12px",
    color: "#2563eb",
    marginTop: "5px",
    fontStyle: "italic",
  },

  // Highlight boxes
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

  // Signal block
  signalBlock: { marginBottom: "16px" },
  signalBlockTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#555",
    marginBottom: "6px",
  },
  signalList: {
    margin: "0 0 0 16px",
    padding: 0,
    lineHeight: "1.7",
    fontSize: "14px",
    color: "#333",
  },

  // Status mix
  statusMixRow: { display: "flex", flexWrap: "wrap", gap: "8px", margin: "10px 0 4px" },

  // Validation plan item
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
  "credible now":              { background: "#dcfce7", color: "#166534" },
  "credible now, with caution":{ background: "#fef3c7", color: "#92400e" },
  "bridge required":           { background: "#fef9c3", color: "#78350f" },
  "secondary option":          { background: "#e0f2fe", color: "#0369a1" },
  exploratory:                 { background: "#ede9fe", color: "#5b21b6" },
  "not now":                   { background: "#f1f5f9", color: "#475569" },
  "needs validation":          { background: "#f1f5f9", color: "#64748b" },
};

const CONFIDENCE_THEMES = {
  high:              { background: "#dcfce7", color: "#166534" },
  medium:            { background: "#fef3c7", color: "#92400e" },
  low:               { background: "#fee2e2", color: "#991b1b" },
  insufficient_data: { background: "#f1f5f9", color: "#64748b" },
};

function statusBadge(status) {
  const key = String(status || "").toLowerCase();
  const theme = STATUS_THEMES[key] || { background: "#f1f5f9", color: "#64748b" };
  return badge(status, theme);
}

function confidenceBadge(confidence) {
  const key = String(confidence || "").toLowerCase();
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

// ── Status mix display ─────────────────────────────────────────────────────────

const STATUS_MIX_DEFS = [
  { key: "credibleNow",        label: "Credible now",     theme: STATUS_THEMES["credible now"] },
  { key: "credibleWithCaution",label: "With caution",     theme: STATUS_THEMES["credible now, with caution"] },
  { key: "bridgeRequired",     label: "Bridge required",  theme: STATUS_THEMES["bridge required"] },
  { key: "secondaryOption",    label: "Secondary",        theme: STATUS_THEMES["secondary option"] },
  { key: "exploratory",        label: "Exploratory",      theme: STATUS_THEMES.exploratory },
  { key: "notNow",             label: "Not now",          theme: STATUS_THEMES["not now"] },
];

function StatusMixBadges({ statusMix }) {
  if (!statusMix) return null;
  const nonZero = STATUS_MIX_DEFS.filter((d) => (statusMix[d.key] || 0) > 0);
  if (nonZero.length === 0) return null;
  return (
    <div style={S.statusMixRow}>
      {nonZero.map(({ key, label, theme }) => (
        <span key={key}>
          {badge(`${statusMix[key]} ${label}`, theme)}
        </span>
      ))}
    </div>
  );
}

// ── Reusable layout pieces ─────────────────────────────────────────────────────

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
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function SignalBlock({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div style={S.signalBlock}>
      <div style={S.signalBlockTitle}>{title}</div>
      <ul style={S.signalList}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
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

// ── Direction portfolio row (compact overview) ─────────────────────────────────

function DirectionPortfolioRow({ direction }) {
  return (
    <div style={S.portRow}>
      <div style={S.portHeader}>
        <span style={S.portOrder}>#{direction.displayOrder}</span>
        <span style={S.portLabel}>{direction.label}</span>
      </div>
      <div style={{ ...S.badgeRow, marginTop: "6px" }}>
        {statusBadge(direction.currentRealismStatus)}
        {confidenceBadge(direction.confidence)}
        {routeBadge(direction.routeType)}
        {workBadge(direction.workModel)}
      </div>
      {direction.shortWhy && (
        <div style={S.portShortWhy}>{direction.shortWhy}</div>
      )}
      {direction.firstValidationStep && (
        <div style={S.portFirstStep}>
          First step: {direction.firstValidationStep}
        </div>
      )}
    </div>
  );
}

// ── Direction deep dive card ───────────────────────────────────────────────────

function DirectionDeepDive({ direction, accentStyle }) {
  const cardStyle = { ...S.card, ...accentStyle };
  const hasNarrative =
    direction.whyItFits?.length > 0 ||
    direction.whyItIsCredible?.length > 0 ||
    direction.whatMakesItRisky?.length > 0 ||
    direction.constraintsAndWarnings?.length > 0 ||
    direction.notRecommendedIf?.length > 0 ||
    direction.whatWouldMakeItStronger?.length > 0;

  return (
    <div style={cardStyle}>
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

      <div style={{ ...S.cardBody, ...S.cardBodyTop }}>
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

        {hasNarrative && (
          <>
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
                <span style={S.subTitle}>What makes it risky</span>
                <BulletList items={direction.whatMakesItRisky} />
              </>
            )}
            {direction.constraintsAndWarnings?.length > 0 && (
              <>
                <span style={S.subTitle}>Constraints and warnings</span>
                <BulletList items={direction.constraintsAndWarnings} />
              </>
            )}
            {direction.notRecommendedIf?.length > 0 && (
              <>
                <span style={S.subTitle}>Not recommended if</span>
                <BulletList items={direction.notRecommendedIf} />
              </>
            )}
            {direction.whatWouldMakeItStronger?.length > 0 && (
              <>
                <span style={S.subTitle}>What would make it stronger</span>
                <BulletList items={direction.whatWouldMakeItStronger} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Not-now direction card ─────────────────────────────────────────────────────

function NotNowCard({ direction }) {
  return (
    <div style={{ ...S.card, ...S.cardNotNowAccent }}>
      <div style={S.cardHead}>
        <div style={S.dirTitleSmall}>{direction.label}</div>
      </div>
      <div style={{ ...S.cardBody, ...S.cardBodyTop }}>
        {direction.reason && (
          <div style={S.bodyText}>{direction.reason}</div>
        )}
        {direction.supportingConcerns?.length > 0 && (
          <>
            <span style={S.subTitle}>Supporting concerns</span>
            <BulletList items={direction.supportingConcerns} />
          </>
        )}
        {direction.whatWouldChangeThis && (
          <>
            <span style={S.subTitle}>What would change this</span>
            <div style={S.bodyText}>{direction.whatWouldChangeThis}</div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Validation plan item ───────────────────────────────────────────────────────

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
          setState({
            status: "ok",
            reportViewModel: result.reportViewModel,
            error: null,
          });
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
          <code style={{ fontFamily: "monospace", background: "#f0f0f0", padding: "2px 6px", borderRadius: "3px" }}>
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
    directionPortfolio,
    keySignals,
    primaryDirection,
    bridgeDirections,
    exploratoryDirections,
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
        <span style={{ fontFamily: "monospace", fontSize: "10px" }}>
          {assessmentId}
        </span>
      </div>

      {/* ── 1. Cover / Executive Summary ── */}
      {cover.headline && (
        <div style={S.headline}>{cover.headline}</div>
      )}
      {cover.summary && (
        <div style={S.coverSummary}>{cover.summary}</div>
      )}
      <StatusMixBadges statusMix={cover.statusMix} />

      {cover.recommendedStrategy && (
        <MetaField label="Recommended strategy" value={cover.recommendedStrategy} />
      )}
      {cover.mainTension && (
        <MetaField label="Main tension" value={cover.mainTension} />
      )}

      {/* ── 2. Direction Portfolio Overview ── */}
      {directionPortfolio.length > 0 && (
        <>
          <SectionDivider
            title={`Your directions — ${reportMeta.directionCount} assessed`}
          />
          {directionPortfolio.map((dir, i) => (
            <DirectionPortfolioRow key={i} direction={dir} />
          ))}
          {reportMeta.rejectedDirectionCount > 0 && (
            <div style={{ fontSize: "13px", color: "#aaa", marginTop: "6px" }}>
              + {reportMeta.rejectedDirectionCount} direction
              {reportMeta.rejectedDirectionCount !== 1 ? "s" : ""} not recommended at this time
            </div>
          )}
        </>
      )}

      {/* ── 3. Key Signals ── */}
      {(keySignals.strongestCredibilitySignals.length > 0 ||
        keySignals.guardrailSignals.length > 0 ||
        keySignals.constraintSignals.length > 0 ||
        keySignals.caveats.length > 0) && (
        <>
          <SectionDivider title="What drives this result" />
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e5e0",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <SignalBlock
              title="Strongest credibility signals"
              items={keySignals.strongestCredibilitySignals}
            />
            <SignalBlock
              title="Financial or stability considerations"
              items={keySignals.financialRealitySignals}
            />
            <SignalBlock
              title="Active constraints"
              items={keySignals.constraintSignals}
            />
            <SignalBlock
              title="What could strengthen this result"
              items={keySignals.missingEvidenceSignals}
            />
            <SignalBlock
              title="Guardrail guidance"
              items={keySignals.guardrailSignals}
            />
            <SignalBlock
              title="Caveats"
              items={keySignals.caveats}
            />
          </div>
        </>
      )}

      {/* ── 4. Primary Direction Deep Dive ── */}
      {primaryDirection && (
        <>
          <SectionDivider title="Primary direction" />
          <DirectionDeepDive
            direction={primaryDirection}
            accentStyle={S.cardPrimaryAccent}
          />
        </>
      )}

      {/* ── 5. Bridge Directions ── */}
      {bridgeDirections.length > 0 && (
        <>
          <SectionDivider
            title={`Bridge direction${bridgeDirections.length !== 1 ? "s" : ""}`}
          />
          {bridgeDirections.map((dir, i) => (
            <DirectionDeepDive
              key={i}
              direction={dir}
              accentStyle={S.cardBridgeAccent}
            />
          ))}
        </>
      )}

      {/* ── 5b. Exploratory Directions ── */}
      {exploratoryDirections.length > 0 && (
        <>
          <SectionDivider
            title={`Exploratory direction${exploratoryDirections.length !== 1 ? "s" : ""}`}
          />
          {exploratoryDirections.map((dir, i) => (
            <DirectionDeepDive
              key={i}
              direction={dir}
              accentStyle={S.cardExploratoryAccent}
            />
          ))}
        </>
      )}

      {/* ── 6. Not-Now Directions ── */}
      {notNowDirections.length > 0 && (
        <>
          <SectionDivider title="Not recommended at this time" />
          <div
            style={{
              fontSize: "13px",
              color: "#aaa",
              marginBottom: "12px",
            }}
          >
            These directions were considered but are not the right move given
            current evidence.
          </div>
          {notNowDirections.map((dir, i) => (
            <NotNowCard key={i} direction={dir} />
          ))}
        </>
      )}

      {/* ── 7. Validation Plan ── */}
      {validationPlan.next30Days.length > 0 && (
        <>
          <SectionDivider title="What to do in the next 30 days" />
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e5e0",
              borderRadius: "8px",
              padding: "4px 20px 4px",
              marginBottom: "12px",
            }}
          >
            {validationPlan.next30Days.map((action, i) => (
              <PlanItem key={i} number={i + 1} text={action} />
            ))}
          </div>

          {validationPlan.evidenceToBuild.length > 0 && (
            <>
              <div
                style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "8px" }}
              >
                Evidence to build
              </div>
              <BulletList items={validationPlan.evidenceToBuild} />
            </>
          )}

          {validationPlan.conversationsToHave.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#555",
                  marginTop: "14px",
                  marginBottom: "8px",
                }}
              >
                Conversations to have
              </div>
              <BulletList items={validationPlan.conversationsToHave} />
            </>
          )}

          {validationPlan.decisionsToMake.length > 0 && (
            <>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#555",
                  marginTop: "14px",
                  marginBottom: "8px",
                }}
              >
                Decisions to make
              </div>
              <BulletList items={validationPlan.decisionsToMake} />
            </>
          )}
        </>
      )}

      {/* ── 8. Confidence Notes ── */}
      {(confidenceNotes.caveats.length > 0 ||
        confidenceNotes.missingEvidence.length > 0 ||
        confidenceNotes.lowConfidenceReasons.length > 0) && (
        <>
          <SectionDivider title="Confidence and limitations" />
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e5e0",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <SignalBlock
              title="Caveats"
              items={confidenceNotes.caveats}
            />
            <SignalBlock
              title="Missing evidence affecting confidence"
              items={confidenceNotes.missingEvidence}
            />
            <SignalBlock
              title="Why some directions show lower confidence"
              items={confidenceNotes.lowConfidenceReasons}
            />
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
