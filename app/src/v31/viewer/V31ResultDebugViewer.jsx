/**
 * Ortheon MVP Cut v3.1 — Internal Result Debug Viewer
 *
 * Bundle 16C read-only internal viewer.
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

// ── Minimal local styles ───────────────────────────────────────────────────────

const S = {
  page: {
    fontFamily: "monospace",
    fontSize: "13px",
    maxWidth: "860px",
    margin: "0 auto",
    padding: "24px 16px 64px",
    color: "#1a1a1a",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    background: "#1a1a1a",
    color: "#f0f0f0",
    padding: "12px 16px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  h1: { margin: "0 0 6px", fontSize: "15px", fontWeight: "700" },
  meta: { margin: "2px 0", fontSize: "12px", color: "#aaa" },
  metaVal: { color: "#e0e0e0" },
  section: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    marginBottom: "16px",
    overflow: "hidden",
  },
  sectionHead: {
    background: "#f0f0f0",
    padding: "7px 12px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#555",
  },
  sectionBody: { padding: "12px 16px" },
  row: { margin: "4px 0", lineHeight: "1.5" },
  label: { color: "#888", marginRight: "6px" },
  pill: (color) => ({
    display: "inline-block",
    padding: "1px 7px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "600",
    background: color === "green" ? "#d4edda" : color === "red" ? "#f8d7da" : "#e2e3e5",
    color: color === "green" ? "#155724" : color === "red" ? "#721c24" : "#383d41",
  }),
  dirCard: {
    border: "1px solid #d0d0d0",
    borderRadius: "4px",
    marginBottom: "12px",
    overflow: "hidden",
  },
  dirCardHead: {
    background: "#e8eaf0",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    gap: "8px",
    alignItems: "baseline",
  },
  dirCardBody: { padding: "10px 14px" },
  listItems: (items) =>
    items.length === 0 ? null : (
      <ul style={{ margin: "2px 0 6px 18px", padding: 0, lineHeight: "1.5" }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ),
  subLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#666",
    marginTop: "8px",
    marginBottom: "2px",
  },
  warningBox: {
    background: "#fff8e1",
    border: "1px solid #ffe082",
    borderRadius: "4px",
    padding: "8px 12px",
    marginTop: "8px",
    fontSize: "12px",
  },
  errorBox: {
    background: "#fdecea",
    border: "1px solid #f5c6cb",
    borderRadius: "4px",
    padding: "12px 16px",
    color: "#721c24",
    marginTop: "16px",
  },
  usageBox: {
    background: "#e8f4fd",
    border: "1px solid #bee5eb",
    borderRadius: "4px",
    padding: "16px",
    color: "#0c5460",
    marginTop: "24px",
    fontFamily: "monospace",
  },
  loading: { padding: "32px 0", textAlign: "center", color: "#888" },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function FieldRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div style={S.row}>
      <span style={S.label}>{label}:</span>
      <span>{String(value)}</span>
    </div>
  );
}

function StringList({ label, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <>
      <span style={S.subLabel}>{label}</span>
      {S.listItems(items)}
    </>
  );
}

function DirectionCard({ direction, index }) {
  return (
    <div style={S.dirCard}>
      <div style={S.dirCardHead}>
        <span style={{ color: "#555" }}>#{direction.displayOrder || index + 1}</span>
        <span>{direction.label || direction.directionId || "Unnamed"}</span>
        {direction.recommendationType && (
          <span style={S.pill("default")}>{direction.recommendationType}</span>
        )}
        {direction.confidence && (
          <span style={S.pill("default")}>{direction.confidence}</span>
        )}
      </div>
      <div style={S.dirCardBody}>
        <FieldRow label="directionId" value={direction.directionId} />
        <FieldRow label="directionArena" value={direction.directionArena} />
        <FieldRow label="routeType" value={direction.routeType} />
        <FieldRow label="workModel" value={direction.workModel} />
        <FieldRow label="firstValidationStep" value={direction.firstValidationStep} />
        {direction.bridgeStrategy && (
          <FieldRow label="bridgeStrategy" value={direction.bridgeStrategy} />
        )}
        <StringList label="Why it fits" items={direction.whyItFits} />
        <StringList label="Why it is credible" items={direction.whyItIsCredible} />
        <StringList label="What makes it risky" items={direction.whatMakesItRisky} />
        <StringList label="Constraints & warnings" items={direction.constraintsAndWarnings} />
        <StringList label="Not recommended if" items={direction.notRecommendedIf} />
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
        <div style={S.row}>
          <span style={S.label}>passed:</span>
          <span style={S.pill(passed ? "green" : "red")}>
            {passed ? "PASS" : "FAIL"}
          </span>
        </div>
        {guardrailStatuses.length > 0 && (
          <>
            <span style={S.subLabel}>guardrailStatuses</span>
            {S.listItems(guardrailStatuses)}
          </>
        )}
        {canShowAsCredibleNowValues.length > 0 && (
          <div style={S.row}>
            <span style={S.label}>canShowAsCredibleNow:</span>
            <span>{canShowAsCredibleNowValues.map(String).join(", ")}</span>
          </div>
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

  if (!documentId) {
    return (
      <div style={S.page}>
        <div style={S.usageBox}>
          <strong>v3.1 Result Debug Viewer</strong>
          <br />
          <br />
          Provide a document ID as a query parameter:
          <br />
          <code>/internal/v31-result?documentId=&lt;assessmentId&gt;</code>
          <br />
          <br />
          Example:
          <br />
          <code>/internal/v31-result?documentId=FrpHpSzJ9KxeodhoWyJL</code>
        </div>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div style={S.page}>
        <div style={S.loading}>Loading v31Result for {documentId}…</div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.h1}>v3.1 Result Debug Viewer</h1>
          <p style={{ ...S.meta, margin: 0 }}>documentId: <span style={S.metaVal}>{documentId}</span></p>
        </div>
        <div style={S.errorBox}>
          <strong>Error:</strong> {state.error}
        </div>
      </div>
    );
  }

  if (state.status !== "ok" || !state.result?.viewModel) return null;

  const vm = state.result.viewModel;
  const { summary, directions, guardrails, metrics, caveats, qualityNotes, rejectedDirections, warnings, errors } = vm;

  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <div style={S.header}>
        <h1 style={S.h1}>v3.1 Result Debug Viewer</h1>
        <p style={S.meta}>assessmentId: <span style={S.metaVal}>{vm.assessmentId || documentId}</span></p>
        <p style={S.meta}>
          pipelineStatus:{" "}
          <span style={{ ...S.metaVal, ...S.pill(vm.pipelineStatus === "passed" ? "green" : "red") }}>
            {vm.pipelineStatus}
          </span>
        </p>
        <p style={S.meta}>generatedAt: <span style={S.metaVal}>{vm.generatedAt}</span></p>
        <p style={S.meta}>source: <span style={S.metaVal}>{vm.source}</span></p>
        <p style={S.meta}>
          totalEstimatedCostUsd: <span style={S.metaVal}>${metrics.totalEstimatedCostUsd}</span>
          {"  "}
          apiCallCount: <span style={S.metaVal}>{metrics.apiCallCount}</span>
        </p>
        <p style={S.meta}>
          directions: <span style={S.metaVal}>{metrics.finalDirectionCount}</span>
          {"  "}
          rejected: <span style={S.metaVal}>{metrics.rejectedDirectionCount}</span>
        </p>
      </div>

      {/* ── Summary ── */}
      {(summary.headline || summary.summary || summary.recommendedStrategy || summary.mainTension) && (
        <div style={S.section}>
          <div style={S.sectionHead}>Summary</div>
          <div style={S.sectionBody}>
            {summary.headline && (
              <div style={{ ...S.row, fontWeight: "600", marginBottom: "8px" }}>{summary.headline}</div>
            )}
            {summary.summary && (
              <div style={{ ...S.row, marginBottom: "8px" }}>{summary.summary}</div>
            )}
            <FieldRow label="recommendedStrategy" value={summary.recommendedStrategy} />
            <FieldRow label="mainTension" value={summary.mainTension} />
          </div>
        </div>
      )}

      {/* ── Directions ── */}
      {directions.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Directions ({directions.length})</div>
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
          <div style={S.sectionHead}>Caveats</div>
          <div style={S.sectionBody}>{S.listItems(caveats)}</div>
        </div>
      )}

      {/* ── Quality notes ── */}
      {qualityNotes.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Quality Notes</div>
          <div style={S.sectionBody}>{S.listItems(qualityNotes)}</div>
        </div>
      )}

      {/* ── Rejected directions ── */}
      {rejectedDirections.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionHead}>Rejected Directions ({rejectedDirections.length})</div>
          <div style={S.sectionBody}>
            {rejectedDirections.map((dir, i) => (
              <div key={dir.directionId || i} style={{ ...S.dirCard, marginBottom: "8px" }}>
                <div style={S.dirCardHead}>
                  <span>{dir.label || dir.directionId || "Unnamed"}</span>
                </div>
                <div style={S.dirCardBody}>
                  <FieldRow label="directionId" value={dir.directionId} />
                  <FieldRow label="reasonRejected" value={dir.reasonRejected} />
                  <StringList label="Supporting concerns" items={dir.supportingConcerns} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Warnings ── */}
      {warnings.length > 0 && (
        <div style={S.warningBox}>
          <strong>Warnings ({warnings.length}):</strong>
          {S.listItems(warnings)}
        </div>
      )}

      {/* ── Errors ── */}
      {errors.length > 0 && (
        <div style={S.errorBox}>
          <strong>Errors ({errors.length}):</strong>
          {S.listItems(errors.map((e) => (typeof e === "string" ? e : JSON.stringify(e))))}
        </div>
      )}
    </div>
  );
}
