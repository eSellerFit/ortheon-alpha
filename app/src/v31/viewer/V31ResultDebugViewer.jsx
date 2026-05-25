/**
 * Ortheon MVP Cut v3.1 — Internal Result Debug Viewer
 *
 * Bundle 16C/16D read-only internal viewer.
 * Route: /internal/v31-result?documentId=<id>
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls.
 * - Renders view model only — not raw payload, not raw Claude output.
 * - Does not replace ResultsStep, PdfReport, or CareerDirectionMap.
 */

import { useEffect, useState } from "react";
import { readV31ResultViewModelFromFirestoreV31 } from "./readV31ResultViewModelFromFirestore.js";

// ── Pill colors ────────────────────────────────────────────────────────────────

const PILL_THEMES = {
  green:   { background: "#d4edda", color: "#155724" },
  red:     { background: "#f8d7da", color: "#721c24" },
  amber:   { background: "#fff3cd", color: "#856404" },
  blue:    { background: "#d1ecf1", color: "#0c5460" },
  purple:  { background: "#e9d6f5", color: "#5a1e8c" },
  default: { background: "#e2e3e5", color: "#383d41" },
};

function pillColorFor(field, value) {
  const v = String(value || "").toLowerCase();
  if (field === "recommendationType") {
    if (v === "primary") return "green";
    if (v === "bridge") return "amber";
    if (v.includes("explor")) return "blue";
    return "default";
  }
  if (field === "confidence") {
    if (v === "high") return "green";
    if (v === "medium" || v === "moderate") return "amber";
    if (v === "low") return "red";
    return "default";
  }
  if (field === "routeType") return "blue";
  if (field === "workModel") return "purple";
  return "default";
}

// ── Local styles ───────────────────────────────────────────────────────────────

const S = {
  page: {
    fontFamily: "monospace",
    fontSize: "13px",
    maxWidth: "880px",
    margin: "0 auto",
    padding: "28px 16px 72px",
    color: "#1a1a1a",
    background: "#f5f5f5",
    minHeight: "100vh",
  },

  // Header block (dark bar at top)
  header: {
    background: "#1a1a1a",
    color: "#f0f0f0",
    padding: "14px 18px",
    borderRadius: "5px",
    marginBottom: "22px",
  },
  h1: { margin: "0 0 10px", fontSize: "15px", fontWeight: "700", letterSpacing: "0.02em" },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    rowGap: "3px",
    fontSize: "12px",
    color: "#aaa",
  },
  metaKey: { color: "#777" },
  metaVal: { color: "#e0e0e0" },
  metaDivider: { gridColumn: "1 / -1", borderTop: "1px solid #333", margin: "7px 0" },

  // Section card
  section: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    marginBottom: "20px",
    overflow: "hidden",
  },
  sectionHead: {
    background: "#efefef",
    padding: "7px 14px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#555",
    borderBottom: "1px solid #e0e0e0",
  },
  sectionBody: { padding: "14px 16px" },

  // Field rows
  fieldRow: {
    display: "flex",
    gap: "8px",
    margin: "5px 0",
    lineHeight: "1.5",
  },
  fieldLabel: {
    color: "#888",
    minWidth: "150px",
    flexShrink: 0,
  },
  fieldValue: { color: "#1a1a1a" },

  // Sub-section label (for lists inside cards)
  subLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#666",
    marginTop: "12px",
    marginBottom: "3px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  // Direction card
  dirCard: {
    border: "1px solid #d0d0d0",
    borderRadius: "5px",
    marginBottom: "14px",
    overflow: "hidden",
  },
  dirCardHead: {
    background: "#eaecf4",
    padding: "8px 14px 6px",
    borderBottom: "1px solid #d0d0d0",
  },
  dirCardTitle: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginBottom: "5px",
  },
  dirCardOrder: { color: "#777", fontSize: "12px", flexShrink: 0 },
  dirCardLabel: { fontWeight: "700", fontSize: "13px" },
  dirCardBadges: { display: "flex", flexWrap: "wrap", gap: "5px" },
  dirCardArena: {
    fontSize: "11px",
    color: "#666",
    marginTop: "3px",
  },
  dirCardBody: { padding: "12px 16px" },
  dirCardDivider: {
    borderTop: "1px solid #ebebeb",
    margin: "10px 0",
  },

  // First validation step highlight
  firstStepBox: {
    background: "#f0f7ff",
    border: "1px solid #c2d9f0",
    borderRadius: "4px",
    padding: "7px 10px",
    marginTop: "10px",
  },
  firstStepLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: "3px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  // Bridge strategy highlight
  bridgeBox: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "4px",
    padding: "7px 10px",
    marginTop: "8px",
  },
  bridgeLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    color: "#92400e",
    marginBottom: "3px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  // List
  ul: { margin: "3px 0 4px 18px", padding: 0, lineHeight: "1.6" },

  // Status/misc boxes
  warningBox: {
    background: "#fff8e1",
    border: "1px solid #ffe082",
    borderRadius: "4px",
    padding: "10px 14px",
    marginBottom: "16px",
    fontSize: "12px",
  },
  errorBox: {
    background: "#fdecea",
    border: "1px solid #f5c6cb",
    borderRadius: "4px",
    padding: "12px 16px",
    color: "#721c24",
    marginBottom: "16px",
  },
  usageBox: {
    background: "#e8f4fd",
    border: "1px solid #bee5eb",
    borderRadius: "5px",
    padding: "20px",
    color: "#0c5460",
    marginTop: "28px",
    lineHeight: "1.8",
  },
  loading: { padding: "40px 0", textAlign: "center", color: "#888" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function pill(value, field) {
  const theme = PILL_THEMES[pillColorFor(field, value)] || PILL_THEMES.default;
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 8px",
      borderRadius: "10px",
      fontSize: "11px",
      fontWeight: "600",
      ...theme,
    }}>
      {value}
    </span>
  );
}

function ItemList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <ul style={S.ul}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FieldRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div style={S.fieldRow}>
      <span style={S.fieldLabel}>{label}</span>
      <span style={S.fieldValue}>{String(value)}</span>
    </div>
  );
}

function SubSection({ label, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <>
      <span style={S.subLabel}>{label}</span>
      <ItemList items={items} />
    </>
  );
}

function DirectionCard({ direction, index }) {
  const hasNarrative =
    direction.whyItFits.length > 0 ||
    direction.whyItIsCredible.length > 0 ||
    direction.whatMakesItRisky.length > 0 ||
    direction.constraintsAndWarnings.length > 0 ||
    direction.notRecommendedIf.length > 0;

  return (
    <div style={S.dirCard}>
      {/* Card header: order + label + badges */}
      <div style={S.dirCardHead}>
        <div style={S.dirCardTitle}>
          <span style={S.dirCardOrder}>#{direction.displayOrder || index + 1}</span>
          <span style={S.dirCardLabel}>{direction.label || direction.directionId || "Unnamed"}</span>
        </div>
        <div style={S.dirCardBadges}>
          {direction.recommendationType && pill(direction.recommendationType, "recommendationType")}
          {direction.confidence && pill(direction.confidence, "confidence")}
          {direction.routeType && pill(direction.routeType, "routeType")}
          {direction.workModel && pill(direction.workModel, "workModel")}
        </div>
        {direction.directionArena && (
          <div style={S.dirCardArena}>Arena: {direction.directionArena}</div>
        )}
      </div>

      {/* Card body */}
      <div style={S.dirCardBody}>
        <FieldRow label="directionId" value={direction.directionId} />

        {/* First validation step — highlighted */}
        {direction.firstValidationStep && (
          <div style={S.firstStepBox}>
            <span style={S.firstStepLabel}>First Validation Step</span>
            {direction.firstValidationStep}
          </div>
        )}

        {/* Bridge strategy — highlighted */}
        {direction.bridgeStrategy && (
          <div style={S.bridgeBox}>
            <span style={S.bridgeLabel}>Bridge Strategy</span>
            {direction.bridgeStrategy}
          </div>
        )}

        {/* Narrative lists */}
        {hasNarrative && <div style={S.dirCardDivider} />}
        <SubSection label="Why it fits" items={direction.whyItFits} />
        <SubSection label="Why it is credible" items={direction.whyItIsCredible} />
        <SubSection label="What makes it risky" items={direction.whatMakesItRisky} />
        <SubSection label="Constraints & warnings" items={direction.constraintsAndWarnings} />
        <SubSection label="Not recommended if" items={direction.notRecommendedIf} />
      </div>
    </div>
  );
}

function RejectedDirectionCard({ direction }) {
  return (
    <div style={{ ...S.dirCard, marginBottom: "10px" }}>
      <div style={{ ...S.dirCardHead, background: "#f5e9e9" }}>
        <div style={S.dirCardTitle}>
          <span style={S.dirCardLabel}>{direction.label || direction.directionId || "Unnamed"}</span>
          {direction.directionId && (
            <span style={{ ...S.dirCardOrder, fontSize: "11px" }}>{direction.directionId}</span>
          )}
        </div>
      </div>
      <div style={S.dirCardBody}>
        <FieldRow label="reasonRejected" value={direction.reasonRejected} />
        <SubSection label="Supporting concerns" items={direction.supportingConcerns} />
      </div>
    </div>
  );
}

function GuardrailsSection({ guardrails }) {
  const { passed, guardrailStatuses, canShowAsCredibleNowValues } = guardrails;
  return (
    <div style={S.section}>
      <div style={S.sectionHead}>Guardrails</div>
      <div style={S.sectionBody}>
        <div style={S.fieldRow}>
          <span style={S.fieldLabel}>passed</span>
          {pill(passed ? "PASS" : "FAIL", passed ? "green" : "red")}
        </div>
        {canShowAsCredibleNowValues.length > 0 && (
          <FieldRow
            label="canShowAsCredibleNow"
            value={canShowAsCredibleNowValues.map(String).join(", ")}
          />
        )}
        {guardrailStatuses.length > 0 && (
          <>
            <span style={S.subLabel}>Guardrail Statuses</span>
            <ItemList items={guardrailStatuses} />
          </>
        )}
      </div>
    </div>
  );
}

// ── Main viewer ────────────────────────────────────────────────────────────────

export default function V31ResultDebugViewer() {
  const params = new URLSearchParams(window.location.search);
  const documentId = params.get("documentId") || "";

  const [state, setState] = useState({ status: "idle", result: null, error: null });

  useEffect(() => {
    if (!documentId) return;

    setState({ status: "loading", result: null, error: null });

    readV31ResultViewModelFromFirestoreV31({ documentId })
      .then((result) => {
        if (result.ok) {
          setState({ status: "ok", result, error: null });
        } else {
          setState({ status: "error", result, error: result.error });
        }
      })
      .catch((err) => {
        setState({
          status: "error",
          result: null,
          error: err?.message || "Unexpected error loading result.",
        });
      });
  }, [documentId]);

  // ── No documentId ──
  if (!documentId) {
    return (
      <div style={S.page}>
        <div style={S.usageBox}>
          <strong>v3.1 Result Debug Viewer</strong>
          <br />
          Provide a document ID as a query parameter:
          <br />
          <code>/internal/v31-result?documentId=&lt;assessmentId&gt;</code>
          <br />
          Example:
          <br />
          <code>/internal/v31-result?documentId=FrpHpSzJ9KxeodhoWyJL</code>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (state.status === "loading") {
    return (
      <div style={S.page}>
        <div style={S.loading}>Loading v31Result for {documentId}…</div>
      </div>
    );
  }

  // ── Error ──
  if (state.status === "error") {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.h1}>v3.1 Result Debug Viewer</h1>
          <div style={S.metaGrid}>
            <span style={S.metaKey}>documentId</span>
            <span style={S.metaVal}>{documentId}</span>
          </div>
        </div>
        <div style={S.errorBox}>
          <strong>Error:</strong> {state.error}
        </div>
      </div>
    );
  }

  if (state.status !== "ok" || !state.result?.viewModel) return null;

  const vm = state.result.viewModel;
  const {
    summary,
    directions,
    guardrails,
    metrics,
    caveats,
    qualityNotes,
    rejectedDirections,
    warnings,
    errors,
  } = vm;

  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <div style={S.header}>
        <h1 style={S.h1}>v3.1 Result Debug Viewer</h1>
        <div style={S.metaGrid}>
          <span style={S.metaKey}>assessmentId</span>
          <span style={S.metaVal}>{vm.assessmentId || documentId}</span>

          <span style={S.metaKey}>pipelineStatus</span>
          <span>{pill(vm.pipelineStatus, "pipelineStatus")}</span>

          <span style={S.metaKey}>generatedAt</span>
          <span style={S.metaVal}>{vm.generatedAt}</span>

          <span style={S.metaKey}>source</span>
          <span style={S.metaVal}>{vm.source}</span>

          <div style={S.metaDivider} />

          <span style={S.metaKey}>estimatedCost</span>
          <span style={S.metaVal}>${metrics.totalEstimatedCostUsd}</span>

          <span style={S.metaKey}>apiCallCount</span>
          <span style={S.metaVal}>{metrics.apiCallCount}</span>

          <span style={S.metaKey}>directions</span>
          <span style={S.metaVal}>
            {metrics.finalDirectionCount} final
            {metrics.rejectedDirectionCount > 0
              ? `,  ${metrics.rejectedDirectionCount} rejected`
              : ""}
          </span>
        </div>
      </div>

      {/* ── Summary ── */}
      {(summary.headline || summary.summary || summary.recommendedStrategy || summary.mainTension) && (
        <div style={S.section}>
          <div style={S.sectionHead}>Summary</div>
          <div style={S.sectionBody}>
            {summary.headline && (
              <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "8px", lineHeight: "1.4" }}>
                {summary.headline}
              </div>
            )}
            {summary.summary && (
              <div style={{ marginBottom: "12px", lineHeight: "1.6", color: "#333" }}>
                {summary.summary}
              </div>
            )}
            <FieldRow label="recommendedStrategy" value={summary.recommendedStrategy} />
            <FieldRow label="mainTension" value={summary.mainTension} />
          </div>
        </div>
      )}

      {/* ── Directions ── */}
      {directions.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Directions — {directions.length}</div>
          <div style={S.sectionBody}>
            {directions.map((dir, i) => (
              <DirectionCard key={dir.directionId || i} direction={dir} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Guardrails ── */}
      <GuardrailsSection guardrails={guardrails} />

      {/* ── Caveats ── */}
      {caveats.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Caveats — {caveats.length}</div>
          <div style={S.sectionBody}>
            <ItemList items={caveats} />
          </div>
        </div>
      )}

      {/* ── Quality notes ── */}
      {qualityNotes.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Quality Notes — {qualityNotes.length}</div>
          <div style={S.sectionBody}>
            <ItemList items={qualityNotes} />
          </div>
        </div>
      )}

      {/* ── Rejected directions ── */}
      {rejectedDirections.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Rejected Directions — {rejectedDirections.length}</div>
          <div style={S.sectionBody}>
            {rejectedDirections.map((dir, i) => (
              <RejectedDirectionCard key={dir.directionId || i} direction={dir} />
            ))}
          </div>
        </div>
      )}

      {/* ── Warnings ── */}
      {warnings.length > 0 && (
        <div style={S.warningBox}>
          <strong>Warnings ({warnings.length})</strong>
          <ItemList items={warnings} />
        </div>
      )}

      {/* ── Errors ── */}
      {errors.length > 0 && (
        <div style={S.errorBox}>
          <strong>Errors ({errors.length})</strong>
          <ItemList items={errors.map((e) => (typeof e === "string" ? e : JSON.stringify(e)))} />
        </div>
      )}

    </div>
  );
}
