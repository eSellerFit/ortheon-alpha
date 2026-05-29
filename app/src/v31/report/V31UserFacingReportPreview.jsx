/**
 * Ortheon MVP Cut v3.1 — Internal Report Preview
 *
 * Bundle 22A/22B — UX redesign.
 * Route: /internal/v31-report?documentId=<id>
 *
 * Rules:
 * - Read only. No Firestore writes.
 * - No AI calls. No API calls.
 * - Renders report view model only — no raw payload, no debug metadata.
 * - Does not replace ResultsStep, PdfReport, or CareerDirectionMap.
 * - Does not show API cost, pipeline status, source, qualityNotes, or raw IDs.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { readV31UserFacingReportFromFirestoreV31 } from "./readV31UserFacingReportFromFirestore.js";
import V31DirectionMapPreview from "./V31DirectionMapPreview.jsx";
import {
  V31_REPORT_REVIEW_BOOKING_URL,
  V31_DOWNLOAD_REPORT_ENABLED,
} from "./reportActionConfigV31.js";
import V31PdfReportLayout from "./V31PdfReportLayout.jsx";

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
    marginBottom: "20px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#aaa",
  },
  brandName: { fontWeight: "800", color: "#1a1a1a", fontSize: "13px" },
  brandSep: { color: "#ccc" },
  brandTag: { color: "#888" },

  // Action area
  actionRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  actionNote: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "28px",
    lineHeight: "1.5",
  },
  actionLinkBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 20px",
    borderRadius: "8px",
    background: "#245f73",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.01em",
    textDecoration: "none",
  },
  actionBtnDisabled: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 20px",
    borderRadius: "8px",
    background: "transparent",
    color: "#aaa",
    fontSize: "13px",
    fontWeight: "600",
    border: "1.5px solid #ddd",
    cursor: "not-allowed",
    letterSpacing: "0.01em",
  },

  // Section divider + title
  divider: { borderTop: "1px solid #e8e5e0", margin: "40px 0 0" },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#374151",
    marginBottom: "16px",
    marginTop: "16px",
    display: "block",
  },

  // Accordion trigger button
  accordionTrigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    background: "none",
    border: "none",
    padding: "16px 0 0",
    cursor: "pointer",
    textAlign: "left",
  },
  accordionChevron: {
    fontSize: "11px",
    color: "#94a3b8",
    marginLeft: "8px",
    flexShrink: 0,
  },

  // Executive Summary
  productTitle: {
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.3",
    color: "#111",
    margin: "0 0 16px",
  },
  overallReadCard: {
    background: "#f8f9fa",
    border: "1px solid #e2e8ed",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "14px",
  },
  overallReadLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "6px",
  },
  overallReadText: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.6",
    margin: 0,
  },

  // Stronger strategy / tension cards
  strategyCard: {
    background: "#f0f7fa",
    border: "1px solid #b0d0dc",
    borderLeft: "4px solid #245f73",
    borderRadius: "8px",
    padding: "16px 20px",
    marginBottom: "12px",
  },
  strategyCardLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#245f73",
    marginBottom: "8px",
  },
  strategyCardValue: {
    fontSize: "16px",
    color: "#111",
    lineHeight: "1.55",
    fontWeight: "500",
  },

  // Input Signal Cards
  signalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "12px",
  },
  signalCard: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderLeft: "3px solid #245f73",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  signalCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
  },
  signalCardIcon: {
    fontSize: "14px",
    color: "#245f73",
    fontWeight: "700",
    lineHeight: 1,
    flexShrink: 0,
  },
  signalCardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111",
    lineHeight: "1.4",
  },
  signalRow: { marginBottom: "10px" },
  signalRowLabel: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#555",
    marginBottom: "4px",
  },
  signalRowText: { fontSize: "13px", color: "#333", lineHeight: "1.6" },

  // Unified direction cards
  dirCard: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderRadius: "10px",
    marginBottom: "10px",
    overflow: "hidden",
  },
  dirCardPrimary: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderLeft: "4px solid #16a34a",
    borderRadius: "10px",
    marginBottom: "10px",
    overflow: "hidden",
  },
  dirCardSummary: {
    padding: "16px 18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  dirCardSummaryContent: { flex: 1, minWidth: 0 },
  dirCardOrder: {
    fontSize: "11px",
    color: "#bbb",
    flexShrink: 0,
    paddingTop: "3px",
    minWidth: "20px",
  },
  dirCardLabel: {
    fontWeight: "700",
    fontSize: "16px",
    lineHeight: "1.35",
    color: "#111",
    marginBottom: "8px",
  },
  dirCardBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginBottom: "8px",
  },
  dirCardWhy: {
    fontSize: "13px",
    color: "#444",
    lineHeight: "1.55",
    marginBottom: "6px",
    marginTop: "8px",
  },
  dirCardRisk: {
    fontSize: "12px",
    color: "#b45309",
    lineHeight: "1.5",
    marginBottom: "5px",
  },
  dirCardFirstStep: {
    fontSize: "12px",
    color: "#2563eb",
    fontStyle: "italic",
    lineHeight: "1.5",
  },
  dirExpandBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    color: "#64748b",
    cursor: "pointer",
    flexShrink: 0,
    alignSelf: "flex-start",
    marginTop: "2px",
    whiteSpace: "nowrap",
  },

  // Expanded detail panel
  dirExpandedPanel: {
    borderTop: "1px solid #e8e5e0",
    padding: "16px 20px 18px",
    background: "#fafaf9",
  },
  subTitle: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#555",
    marginTop: "14px",
    marginBottom: "5px",
    display: "block",
  },
  bodyList: {
    margin: "0 0 0 16px",
    padding: 0,
    lineHeight: "1.7",
    fontSize: "13px",
    color: "#333",
  },
  bodyText: { fontSize: "13px", color: "#333", lineHeight: "1.6" },
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
  targetRolesWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginTop: "8px",
  },
  targetRoleChip: {
    background: "#f4f3f1",
    border: "1px solid #e2e0da",
    borderRadius: "4px",
    padding: "3px 9px",
    fontSize: "12px",
    color: "#374151",
  },

  // Not-now directions
  notNowCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "8px",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  notNowDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#cbd5e1",
    flexShrink: 0,
    marginTop: "6px",
  },
  dirTitleSmall: {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.4",
    marginBottom: "5px",
    color: "#374151",
  },

  // 30-day validation plan
  planItem: {
    display: "flex",
    gap: "14px",
    padding: "14px 16px",
    background: "#fff",
    border: "1px solid #e2e0da",
    borderRadius: "8px",
    marginBottom: "8px",
    alignItems: "flex-start",
  },
  planNum: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#245f73",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  planText: { fontSize: "14px", color: "#1a1a1a", lineHeight: "1.6", fontWeight: "500" },
  planSubGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "10px",
    marginTop: "10px",
  },
  planSubSectionEvidence: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderLeft: "3px solid #245f73",
    borderRadius: "8px",
    padding: "14px 16px",
  },
  planSubSectionDecisions: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderLeft: "3px solid #92400e",
    borderRadius: "8px",
    padding: "14px 16px",
  },
  planSubSectionConversations: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderLeft: "3px solid #6366f1",
    borderRadius: "8px",
    padding: "14px 16px",
    marginTop: "10px",
  },
  planSubTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#374151",
    marginBottom: "10px",
  },

  // Confidence Notes
  confidenceWrapper: {
    background: "#fff",
    border: "1px solid #d4d0ca",
    borderLeft: "3px solid #245f73",
    borderRadius: "10px",
    padding: "16px 20px 18px",
  },
  confidenceContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "8px",
  },
  confidenceChip: {
    background: "#f4f3f1",
    border: "1px solid #bbb8b2",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#1f2937",
    lineHeight: "1.5",
  },
  confidenceGroupLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#374151",
    marginBottom: "8px",
  },

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

// ── AI Durability Badge ────────────────────────────────────────────────────────

function AiDurabilityBadge({ aiDurability }) {
  if (!aiDurability?.rating) return null;
  const label = aiDurability.label
    ? `${aiDurability.rating} · ${aiDurability.label}`
    : aiDurability.rating;
  const tooltip =
    aiDurability.description ||
    "AI durability shows how this direction may hold up as AI changes work. " +
    "D0 Declining · D1 Pressured · D2 Changing · D3 Durable · D4 Future-resilient";
  return (
    <span
      title={tooltip}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "600",
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
        marginTop: "4px",
        cursor: "help",
      }}
    >
      {label}
    </span>
  );
}

// ── Shared layout primitives ───────────────────────────────────────────────────

function SectionDivider({ title }) {
  return (
    <>
      <div style={S.divider} />
      <div style={S.sectionTitle}>{title}</div>
    </>
  );
}

function AccordionSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <div style={S.divider} />
      <button
        onClick={() => setOpen((o) => !o)}
        style={S.accordionTrigger}
        aria-expanded={open}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#374151",
          }}
        >
          {title}
        </span>
        <span style={S.accordionChevron}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ marginTop: "16px" }}>{children}</div>}
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

function TargetRoles({ roles }) {
  if (!Array.isArray(roles) || roles.length === 0) return null;
  return (
    <div style={S.targetRolesWrap}>
      {roles.map((r, i) => (
        <span key={i} style={S.targetRoleChip}>{r}</span>
      ))}
    </div>
  );
}

// ── Stronger strategy / tension card ─────────────────────────────────────────

function StrategyCard({ label, value }) {
  if (!value) return null;
  const icons = { "Recommended strategy": "→", "Main tension": "⊘" };
  const icon = icons[label];
  return (
    <div style={S.strategyCard}>
      <div style={S.strategyCardLabel}>{icon ? `${icon}  ` : ""}{label}</div>
      <div style={S.strategyCardValue}>{value}</div>
    </div>
  );
}

// ── Expanded panels for direction cards ───────────────────────────────────────

function PrimaryExpandedPanel({ d }) {
  if (!d) return null;
  return (
    <div style={S.dirExpandedPanel}>
      {d.whatThisDirectionMeans && d.whatThisDirectionMeans !== d.directionArena && (
        <>
          <span style={S.subTitle}>What this direction means</span>
          <div style={S.bodyText}>{d.whatThisDirectionMeans}</div>
        </>
      )}
      {d.firstValidationStep && (
        <div style={S.firstStepBox}>
          <span style={S.firstStepBoxLabel}>First validation step</span>
          {d.firstValidationStep}
        </div>
      )}
      {d.bridgeStrategy && (
        <div style={S.bridgeBox}>
          <span style={S.bridgeBoxLabel}>Bridge strategy</span>
          {d.bridgeStrategy}
        </div>
      )}
      {d.whyItFits?.length > 0 && (
        <>
          <span style={S.subTitle}>Why it fits</span>
          <BulletList items={d.whyItFits} />
        </>
      )}
      {d.whyItIsCredible?.length > 0 && (
        <>
          <span style={S.subTitle}>Why it is credible</span>
          <BulletList items={d.whyItIsCredible} />
        </>
      )}
      {d.whatMakesItRisky?.length > 0 && (
        <>
          <span style={S.subTitle}>Main risks</span>
          <BulletList items={d.whatMakesItRisky} />
        </>
      )}
      {d.whatWouldMakeItStronger?.length > 0 && (
        <>
          <span style={S.subTitle}>What would make it stronger</span>
          <BulletList items={d.whatWouldMakeItStronger} />
        </>
      )}
      {d.targetRoleExamples?.length > 0 && (
        <>
          <span style={S.subTitle}>Target role examples</span>
          <TargetRoles roles={d.targetRoleExamples} />
        </>
      )}
    </div>
  );
}

function OtherExpandedPanel({ d, card }) {
  if (!d) return null;
  return (
    <div style={S.dirExpandedPanel}>
      {d.whyInteresting && (
        <>
          <span style={S.subTitle}>Why it is interesting</span>
          <div style={S.bodyText}>{d.whyInteresting}</div>
        </>
      )}
      {d.whyNotPrimaryNow && (
        <>
          <span style={S.subTitle}>Why not primary now</span>
          <div style={S.bodyText}>{d.whyNotPrimaryNow}</div>
        </>
      )}
      {d.bridgeOrValidationCondition && (
        <div style={{ ...S.bridgeBox, marginTop: "12px" }}>
          <span style={S.bridgeBoxLabel}>Condition to pursue</span>
          {d.bridgeOrValidationCondition}
        </div>
      )}
      {d.firstValidationStep && (
        <div style={S.firstStepBox}>
          <span style={S.firstStepBoxLabel}>First validation step</span>
          {d.firstValidationStep}
        </div>
      )}
      {card?.targetRoleExamples?.length > 0 && (
        <>
          <span style={S.subTitle}>Target role examples</span>
          <TargetRoles roles={card.targetRoleExamples} />
        </>
      )}
    </div>
  );
}

// ── Unified expandable direction card ─────────────────────────────────────────

function ExpandableDirectionCard({ card, detail, isPrimary }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!detail;

  return (
    <div style={isPrimary ? S.dirCardPrimary : S.dirCard}>
      <div style={S.dirCardSummary}>
        <span style={S.dirCardOrder}>#{card.displayOrder}</span>
        <div style={S.dirCardSummaryContent}>
          <div style={S.dirCardLabel}>{card.label}</div>
          <div style={S.dirCardBadges}>
            {statusBadge(card.status)}
            {confidenceBadge(card.confidence)}
            {routeBadge(card.routeType)}
            {workBadge(card.workModel)}
          </div>
          {card.aiDurability && <AiDurabilityBadge aiDurability={card.aiDurability} />}
          {card.whyThisIsHere && (
            <div style={S.dirCardWhy}>{card.whyThisIsHere}</div>
          )}
          {card.mainRisk && (
            <div style={S.dirCardRisk}>
              <strong style={{ fontWeight: "600" }}>Risk:</strong> {card.mainRisk}
            </div>
          )}
          {!expanded && card.firstValidationStep && (
            <div style={S.dirCardFirstStep}>First step: {card.firstValidationStep}</div>
          )}
        </div>
        {hasDetail && (
          <button
            onClick={() => setExpanded((e) => !e)}
            style={S.dirExpandBtn}
            aria-expanded={expanded}
          >
            {expanded ? "Less ▲" : "Detail ▼"}
          </button>
        )}
      </div>
      {expanded && hasDetail && (
        isPrimary
          ? <PrimaryExpandedPanel d={detail} />
          : <OtherExpandedPanel d={detail} card={card} />
      )}
    </div>
  );
}

// ── Not-Now Direction Card ─────────────────────────────────────────────────────

function NotNowCard({ direction }) {
  return (
    <div style={S.notNowCard}>
      <div style={S.notNowDot} />
      <div>
        <div style={S.dirTitleSmall}>{direction.label}</div>
        {direction.reason && (
          <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.55" }}>
            {direction.reason}
          </div>
        )}
        {direction.whatWouldChangeThis && (
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px", fontStyle: "italic" }}>
            {direction.whatWouldChangeThis}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Validation Plan Item ───────────────────────────────────────────────────────

function PlanItem({ number, text }) {
  return (
    <div style={S.planItem}>
      <span style={S.planNum}>{number}</span>
      <span style={S.planText}>{text}</span>
    </div>
  );
}

// ── Input Signal Card ──────────────────────────────────────────────────────────

const SIGNAL_ICONS = {
  careerAnchors: "◇",
  financialReality: "$",
  workModelPreference: "⚙",
  constraints: "!",
  credibilityAssets: "✓",
  missingEvidence: "?",
};

function InputSignalCard({ card }) {
  const icon = SIGNAL_ICONS[card.id] || "◉";
  return (
    <div style={S.signalCard}>
      <div style={S.signalCardHeader}>
        <span style={S.signalCardIcon}>{icon}</span>
        <span style={S.signalCardTitle}>{card.title}</span>
      </div>
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function V31UserFacingReportPreview() {
  const params = new URLSearchParams(window.location.search);
  const documentId = params.get("documentId") || "";

  const [state, setState] = useState({
    status: "idle",
    reportViewModel: null,
    error: null,
  });
  const [pdfStatus, setPdfStatus] = useState("idle");
  const pdfContainerRef = useRef(null);

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

  async function handleDownloadPdf() {
    if (!pdfContainerRef.current) return;
    setPdfStatus("generating");
    const container = pdfContainerRef.current;
    const savedLeft = container.style.left;
    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default ?? html2canvasModule;
      const { jsPDF } = await import("jspdf");
      const pages = Array.from(
        container.querySelectorAll('[data-v31-pdf-page="true"]')
      );
      if (pages.length === 0) throw new Error("No PDF pages found");
      container.style.left = "0px";
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 1200,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const naturalH = (canvas.height / canvas.width) * pdfWidth;
        if (i > 0) pdf.addPage();
        if (naturalH <= pdfHeight) {
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, naturalH);
        } else {
          const scale = pdfHeight / naturalH;
          const scaledW = pdfWidth * scale;
          pdf.addImage(
            imgData,
            "JPEG",
            (pdfWidth - scaledW) / 2,
            0,
            scaledW,
            pdfHeight
          );
        }
      }
      pdf.save("ortheon-v31-career-report.pdf");
      setPdfStatus("idle");
    } catch (err) {
      console.error("[V31 PDF] generation failed:", err.message);
      setPdfStatus("error");
    } finally {
      container.style.left = savedLeft;
    }
  }

  // ── No documentId ──────────────────────────────────────────────────────────

  if (!documentId) {
    const isUserRoute = window.location.pathname === "/report";
    return (
      <div style={S.page}>
        <div style={S.brand}>
          <span style={S.brandName}>Ortheon</span>
          <span style={S.brandSep}>·</span>
          <span style={S.brandTag}>Career Report</span>
        </div>
        <div style={S.usageBox}>
          {isUserRoute ? (
            <>
              <strong style={{ color: "#1a1a1a" }}>
                Report link is missing an assessment ID.
              </strong>
              <br />
              Please use the link you received to access your report.
            </>
          ) : (
            <>
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
            </>
          )}
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
    directionMap,
    inputSignalCards,
    compactDirectionCards,
    primaryDirectionDeepDive,
    otherDirectionsCompact,
    notNowDirections,
    validationPlan,
    confidenceNotes,
  } = vm;

  // Pair each compact card with its deep dive detail.
  // Primary is always card[0] when primaryDirectionDeepDive exists.
  // otherDirectionsCompact[i] maps to compactDirectionCards[i + offset].
  const primaryDeepDiveExists = !!primaryDirectionDeepDive;
  const otherOffset = primaryDeepDiveExists ? 1 : 0;

  const hasConfidenceNotes =
    confidenceNotes.caveats.length > 0 ||
    confidenceNotes.missingEvidence.length > 0 ||
    confidenceNotes.lowConfidenceReasons.length > 0;

  const hasPlanSubSections =
    validationPlan.evidenceToBuild.length > 0 ||
    validationPlan.decisionsToMake.length > 0;

  // ── Report ─────────────────────────────────────────────────────────────────

  return (
    <>
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
      <h1 style={S.productTitle}>Your Career Direction Report</h1>
      {cover.headline && (
        <div style={S.overallReadCard}>
          <div style={S.overallReadLabel}>Overall read</div>
          <p style={S.overallReadText}>{cover.headline}</p>
        </div>
      )}
      {cover.recommendedStrategy && (
        <StrategyCard label="Recommended strategy" value={cover.recommendedStrategy} />
      )}
      {cover.mainTension && (
        <StrategyCard label="Main tension" value={cover.mainTension} />
      )}

      {/* Action area */}
      <div style={{ ...S.actionRow, marginTop: "20px" }}>
        <a
          href={V31_REPORT_REVIEW_BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          style={S.actionLinkBtn}
        >
          Book 30-minute report review
        </a>
        {V31_DOWNLOAD_REPORT_ENABLED ? (
          <button
            onClick={handleDownloadPdf}
            disabled={pdfStatus === "generating"}
            style={
              pdfStatus === "generating" ? S.actionBtnDisabled : S.actionLinkBtn
            }
            title={
              pdfStatus === "error"
                ? "PDF generation failed — try again"
                : undefined
            }
          >
            {pdfStatus === "generating"
              ? "Generating PDF…"
              : pdfStatus === "error"
                ? "Error — try again"
                : "Download report"}
          </button>
        ) : (
          <span
            style={S.actionBtnDisabled}
            title="PDF download is not yet available"
          >
            Download report — coming soon
          </span>
        )}
      </div>
      <div style={S.actionNote}>
        Use the same email you used for the assessment when booking.
      </div>

      {/* ── 2. Career Direction Map ── */}
      {directionMap && (
        <>
          <SectionDivider title="Career direction map" />
          <V31DirectionMapPreview directionMap={directionMap} />
        </>
      )}

      {/* ── 3. Your Directions — unified expandable cards ── */}
      {compactDirectionCards?.length > 0 && (
        <>
          <SectionDivider
            title={`Your directions — ${reportMeta.directionCount || compactDirectionCards.length} assessed`}
          />
          {compactDirectionCards.map((card, i) => {
            const isPrimary = i === 0 && primaryDeepDiveExists;
            const detail = isPrimary
              ? primaryDirectionDeepDive
              : otherDirectionsCompact[i - otherOffset] || null;
            return (
              <ExpandableDirectionCard
                key={i}
                card={card}
                detail={detail}
                isPrimary={isPrimary}
              />
            );
          })}
          {reportMeta.rejectedDirectionCount > 0 && (
            <div style={{ fontSize: "13px", color: "#aaa", marginTop: "6px" }}>
              + {reportMeta.rejectedDirectionCount} direction
              {reportMeta.rejectedDirectionCount !== 1 ? "s" : ""} not recommended at this time
            </div>
          )}
        </>
      )}

      {/* ── 4. Not-Now Directions ── */}
      {notNowDirections?.length > 0 && (
        <>
          <SectionDivider title="Not recommended at this time" />
          {notNowDirections.map((dir, i) => (
            <NotNowCard key={i} direction={dir} />
          ))}
        </>
      )}

      {/* ── 5. Your Input Signals — collapsed accordion ── */}
      {inputSignalCards?.length > 0 && (
        <AccordionSection title="Your input signals" defaultOpen={false}>
          <div style={S.signalGrid}>
            {inputSignalCards.map((card) => (
              <InputSignalCard key={card.id} card={card} />
            ))}
          </div>
        </AccordionSection>
      )}

      {/* ── 6. 30-Day Validation Plan — stronger sub-section visuals ── */}
      {validationPlan.next30Days.length > 0 && (
        <>
          <SectionDivider title="What to do in the next 30 days" />
          {validationPlan.next30Days.map((action, i) => (
            <PlanItem key={i} number={i + 1} text={action} />
          ))}
          {hasPlanSubSections && (
            <div style={S.planSubGrid}>
              {validationPlan.evidenceToBuild.length > 0 && (
                <div style={S.planSubSectionEvidence}>
                  <div style={S.planSubTitle}>Evidence to build</div>
                  <BulletList items={validationPlan.evidenceToBuild} />
                </div>
              )}
              {validationPlan.decisionsToMake.length > 0 && (
                <div style={S.planSubSectionDecisions}>
                  <div style={S.planSubTitle}>Decisions to make</div>
                  <BulletList items={validationPlan.decisionsToMake} />
                </div>
              )}
            </div>
          )}
          {validationPlan.conversationsToHave.length > 0 && (
            <div style={S.planSubSectionConversations}>
              <div style={S.planSubTitle}>Conversations to have</div>
              <BulletList items={validationPlan.conversationsToHave} />
            </div>
          )}
        </>
      )}

      {/* ── 7. Confidence & Limitations — collapsed accordion at bottom ── */}
      {hasConfidenceNotes && (
        <AccordionSection title="Confidence and limitations" defaultOpen={false}>
          <div style={S.confidenceWrapper}>
            {confidenceNotes.missingEvidence.length > 0 && (
              <div>
                <div style={S.confidenceGroupLabel}>Missing evidence</div>
                <div style={S.confidenceContainer}>
                  {confidenceNotes.missingEvidence.map((item, i) => (
                    <div key={i} style={S.confidenceChip}>{item}</div>
                  ))}
                </div>
              </div>
            )}
            {confidenceNotes.lowConfidenceReasons.length > 0 && (
              <div style={{ marginTop: confidenceNotes.missingEvidence.length > 0 ? "16px" : 0 }}>
                <div style={S.confidenceGroupLabel}>Why some directions show lower confidence</div>
                <div style={S.confidenceContainer}>
                  {confidenceNotes.lowConfidenceReasons.map((item, i) => (
                    <div key={i} style={S.confidenceChip}>{item}</div>
                  ))}
                </div>
              </div>
            )}
            {confidenceNotes.caveats.length > 0 && (
              <div
                style={{
                  marginTop:
                    confidenceNotes.missingEvidence.length > 0 ||
                    confidenceNotes.lowConfidenceReasons.length > 0
                      ? "16px"
                      : 0,
                }}
              >
                <div style={S.confidenceGroupLabel}>Additional caveats</div>
                <div style={S.confidenceContainer}>
                  {confidenceNotes.caveats.map((item, i) => (
                    <div key={i} style={S.confidenceChip}>{item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionSection>
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
    {createPortal(
      <V31PdfReportLayout vm={vm} containerRef={pdfContainerRef} />,
      document.body
    )}
    </>
  );
}
