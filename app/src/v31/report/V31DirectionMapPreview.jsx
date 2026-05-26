/**
 * Ortheon MVP Cut v3.1 — Direction Map Preview
 *
 * Bundle 19A — new map component.
 * Renders report.directionMap as a hub-and-spoke visual.
 *
 * Rules:
 * - Pure React. No Firestore. No AI. No external libraries.
 * - Uses only report.directionMap (from Bundle 18I view model field).
 * - Does not reuse legacy careerMap, scoring, ranks, or AI durability.
 */

// ── Status → visual theme ──────────────────────────────────────────────────────

const NODE_THEMES = {
  "credible now": {
    bg: "#f0fdf4",
    border: "#16a34a",
    badgeBg: "#dcfce7",
    badgeColor: "#166534",
    lineColor: "#16a34a",
  },
  "credible now, with caution": {
    bg: "#fffbeb",
    border: "#d97706",
    badgeBg: "#fef3c7",
    badgeColor: "#92400e",
    lineColor: "#d97706",
  },
  "bridge required": {
    bg: "#fffbeb",
    border: "#b45309",
    badgeBg: "#fef9c3",
    badgeColor: "#78350f",
    lineColor: "#b45309",
  },
  "secondary option": {
    bg: "#eff6ff",
    border: "#1d4ed8",
    badgeBg: "#dbeafe",
    badgeColor: "#1e40af",
    lineColor: "#1d4ed8",
  },
  exploratory: {
    bg: "#f5f3ff",
    border: "#7c3aed",
    badgeBg: "#ede9fe",
    badgeColor: "#5b21b6",
    lineColor: "#7c3aed",
  },
  "not now": {
    bg: "#f8fafc",
    border: "#94a3b8",
    badgeBg: "#f1f5f9",
    badgeColor: "#475569",
    lineColor: "#cbd5e1",
  },
};

const FALLBACK_THEME = {
  bg: "#f9f8f7",
  border: "#cbd5e1",
  badgeBg: "#f1f5f9",
  badgeColor: "#475569",
  lineColor: "#cbd5e1",
};

function getNodeTheme(status) {
  return NODE_THEMES[String(status || "").toLowerCase()] || FALLBACK_THEME;
}

function getStrokeDash(lineStyle) {
  if (lineStyle === "dashed") return "2 1.5";
  if (lineStyle === "dotted") return "0.5 2";
  if (lineStyle === "muted") return "1 2";
  return undefined;
}

// ── Small badge ───────────────────────────────────────────────────────────────

function MapBadge({ label, bg, color, title }) {
  return (
    <span
      title={title}
      style={{
        display: "inline-block",
        padding: "2px 7px",
        borderRadius: "100px",
        fontSize: "10px",
        fontWeight: "600",
        background: bg,
        color,
        lineHeight: "1.4",
      }}
    >
      {label}
    </span>
  );
}

// ── Direction node card ───────────────────────────────────────────────────────

function DirectionNode({ node }) {
  const theme = getNodeTheme(node.status);
  const rawText = node.shortReason || node.mainRisk || "";
  const displayText = rawText.length > 72 ? rawText.slice(0, 70) + "…" : rawText;

  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        width: "160px",
        padding: "10px 11px",
        borderRadius: "11px",
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        zIndex: 3,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          lineHeight: "1.3",
          color: "#111",
          marginBottom: "6px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {node.label}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "3px",
          marginBottom: displayText ? "5px" : 0,
        }}
      >
        <MapBadge label={node.status} bg={theme.badgeBg} color={theme.badgeColor} />
        {node.confidence && (
          <MapBadge label={node.confidence} bg="#f1f5f9" color="#475569" />
        )}
        {(node.routeType || node.workModel) && (
          <MapBadge
            label={node.routeType || node.workModel}
            bg="#eff6ff"
            color="#1d4ed8"
          />
        )}
        {node.aiDurabilityRating && (
          <MapBadge
            label={`AI ${node.aiDurabilityRating}`}
            bg="#f0fdf4"
            color="#166534"
            title="AI durability: how this direction may hold up as AI changes work"
          />
        )}
      </div>
      {displayText && (
        <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: "1.4" }}>
          {displayText}
        </div>
      )}
    </div>
  );
}

// ── Center node ───────────────────────────────────────────────────────────────

function CenterNode({ node }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        width: "168px",
        padding: "11px 13px",
        borderRadius: "12px",
        background: "#eef3f5",
        border: "1.5px solid #245f73",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        zIndex: 4,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#245f73",
          marginBottom: "4px",
        }}
      >
        {node.subtitle}
      </div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: "#111",
          lineHeight: "1.3",
        }}
      >
        {node.label}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND_LINE_PREVIEW = {
  solid: (
    <span
      style={{
        width: 26,
        height: 2,
        background: "#16a34a",
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: 1,
      }}
    />
  ),
  dashed: (
    <span
      style={{
        width: 26,
        height: 0,
        borderTop: "2px dashed #b45309",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  ),
  dotted: (
    <span
      style={{
        width: 26,
        height: 0,
        borderTop: "2px dotted #7c3aed",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  ),
  muted: (
    <span
      style={{
        width: 26,
        height: 0,
        borderTop: "2px dashed #cbd5e1",
        display: "inline-block",
        verticalAlign: "middle",
        opacity: 0.6,
      }}
    />
  ),
};

function MapLegend({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 20px",
        marginTop: "10px",
        padding: "9px 14px",
        border: "1px solid #e2e0da",
        borderRadius: "10px",
        background: "#f9f8f6",
        fontSize: "12px",
        color: "#6b7280",
      }}
    >
      {items.map((item) => (
        <div
          key={item.lineStyle}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          {LEGEND_LINE_PREVIEW[item.lineStyle] || LEGEND_LINE_PREVIEW.muted}
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ── AI Durability legend ──────────────────────────────────────────────────────

const AI_DURABILITY_SCALE = [
  { rating: "D0", label: "Declining" },
  { rating: "D1", label: "Pressured" },
  { rating: "D2", label: "Changing" },
  { rating: "D3", label: "Durable" },
  { rating: "D4", label: "Future-resilient" },
];

function AiDurabilityLegend({ nodes }) {
  if (!Array.isArray(nodes) || !nodes.some((n) => n.aiDurabilityRating)) return null;
  return (
    <div
      style={{
        marginTop: "8px",
        padding: "10px 14px",
        border: "1px solid #e2e0da",
        borderRadius: "10px",
        background: "#f9f8f6",
        fontSize: "12px",
        color: "#6b7280",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#374151",
          marginBottom: "5px",
        }}
      >
        AI Durability
      </div>
      <div style={{ marginBottom: "8px", lineHeight: "1.5", color: "#555" }}>
        AI durability shows how this direction may hold up as AI changes work.
        D3 = Durable: the role remains valuable, but tools and workflows will become more AI-enabled.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px" }}>
        {AI_DURABILITY_SCALE.map(({ rating, label }) => (
          <span
            key={rating}
            style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
          >
            <span
              style={{
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
                borderRadius: "3px",
                padding: "1px 5px",
                fontSize: "10px",
                fontWeight: "700",
              }}
            >
              {rating}
            </span>
            <span>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Not-now lane ──────────────────────────────────────────────────────────────

function NotNowLane({ lane }) {
  if (!lane || !Array.isArray(lane.items) || lane.items.length === 0) return null;
  return (
    <div
      style={{
        marginTop: "10px",
        padding: "12px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#94a3b8",
          marginBottom: "10px",
        }}
      >
        {lane.label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {lane.items.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: item.reason ? "3px" : 0,
              }}
            >
              {item.label}
            </div>
            {item.reason && (
              <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
                {item.reason.length > 60 ? item.reason.slice(0, 58) + "…" : item.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function V31DirectionMapPreview({ directionMap }) {
  if (!directionMap || !Array.isArray(directionMap.nodes)) return null;

  const { centerNode, nodes, edges, legend, notNowLane } = directionMap;

  return (
    <div>
      {/* Hub map canvas */}
      <div
        style={{
          position: "relative",
          minHeight: "480px",
          border: "1px solid #dbd8d0",
          borderRadius: "16px",
          background:
            "radial-gradient(ellipse at 50% 76%, rgba(36,95,115,0.05), transparent 55%), #f9f8f6",
          overflow: "hidden",
        }}
      >
        {/* SVG edge layer — viewBox 0 0 100 100 maps 1:1 to CSS % positions */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          {Array.isArray(edges) &&
            edges.map((edge) => {
              const target = nodes.find((n) => n.id === edge.to);
              if (!target || !centerNode) return null;
              const theme = getNodeTheme(target.status);
              const dash = getStrokeDash(edge.lineStyle);
              return (
                <line
                  key={`edge-${edge.to}`}
                  x1={centerNode.x}
                  y1={centerNode.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={theme.lineColor}
                  strokeWidth="0.4"
                  strokeDasharray={dash}
                  opacity={edge.lineStyle === "muted" ? 0.35 : 0.55}
                />
              );
            })}
        </svg>

        {/* Direction nodes */}
        {nodes.map((node) => (
          <DirectionNode key={node.id} node={node} />
        ))}

        {/* Center node */}
        {centerNode && <CenterNode node={centerNode} />}
      </div>

      {/* Legend strip */}
      <MapLegend items={legend} />

      {/* AI Durability legend — shown only when nodes carry durability ratings */}
      <AiDurabilityLegend nodes={nodes} />

      {/* Not-now lane (shown only if populated) */}
      <NotNowLane lane={notNowLane} />
    </div>
  );
}
