function getDurabilityClass(tone) {
  if (tone === "highly_durable") return "career-map-node-d4";
  if (tone === "durable") return "career-map-node-d3";
  if (tone === "transforming") return "career-map-node-d2";
  if (tone === "pressured") return "career-map-node-d1";
  return "career-map-node-default";
}

function getPathLabel(pathType) {
  const labels = {
    direct: "Credible now",
    bridge: "Bridge path",
    stretch: "Stretch",
    longer_path: "Longer path",
    credentialed: "Credentialed",
    credibility_gap: "Credibility gap",
  };

  return labels[pathType] || "Nearby path";
}

function getMapShortLabel(node) {
  const label = node.directionLabel || node.label || "";
  const lowerLabel = label.toLowerCase();

  if (node.nodeType === "current") {
    return node.label || "Current profile";
  }

  if (lowerLabel.includes("marketplace")) return "Marketplace Ops";
  if (lowerLabel.includes("general management")) return "General Mgmt";
  if (lowerLabel.includes("chief of staff")) return "Biz Ops / CoS";
  if (lowerLabel.includes("business operations")) return "Biz Ops / CoS";
  if (lowerLabel.includes("consulting")) return "Advisory";
  if (lowerLabel.includes("workforce")) return "Workforce Intel";
  if (lowerLabel.includes("people analytics")) return "People Analytics";
  if (lowerLabel.includes("hr tech")) return "HR Tech";
  if (lowerLabel.includes("ai")) return "AI Path";

  return label.length > 24 ? `${label.slice(0, 24)}…` : label;
}

function getClusterIcon(cluster) {
  const icons = {
    enterprise_leadership: "◆",
    business_operations: "◈",
    marketplace_platforms: "◇",
    workforce_intelligence: "◎",
    people_analytics_hr_tech: "▥",
    ai_transformation: "✦",
    independent_advisory: "●",
    learning_workforce_development: "◌",
    technical_engineering: "▲",
    creative_content: "✧",
    regulated_professional: "▣",
    trades_field_operations: "■",
  };

  return icons[cluster] || "●";
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(value) {
  const number = Number(value) || 0;

  if (!number) return "Not provided";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}

function getRadialSlot(index, total) {
  if (total === 1) {
    return { x: 50, y: 23 };
  }

  if (total === 2) {
    return [
      { x: 34, y: 30 },
      { x: 66, y: 30 },
    ][index];
  }

  return [
    { x: 50, y: 21 },
    { x: 76, y: 50 },
    { x: 24, y: 50 },
  ][index] || { x: 50, y: 21 };
}

function normalizePrimaryNodes(primaryNodes = []) {
  return primaryNodes.slice(0, 3).map((node, index) => {
    const slot = getRadialSlot(index, Math.min(primaryNodes.length, 3));

    return {
      ...node,
      nodeType: "primary",
      id: `primary-${node.directionId || index}`,
      x: slot.x,
      y: slot.y,
    };
  });
}

function normalizeAdjacentNodes(adjacentNodes = []) {
  return adjacentNodes.slice(0, 3).map((node, index) => ({
    ...node,
    nodeType: "adjacent",
    id: `adjacent-${node.directionId || index}`,
  }));
}

function buildCurrentNode(careerMap) {
  const current = careerMap.currentProfileNode;

  if (!current) {
    return null;
  }

  return {
    ...current,
    nodeType: "current",
    id: "current-profile",
    directionLabel: current.label || "Current profile",
    x: 50,
    y: 58,
  };
}

function buildMapNodes(careerMap) {
  const currentNode = buildCurrentNode(careerMap);
  const primaryNodes = normalizePrimaryNodes(careerMap.primaryNodes || []);

  return [...(currentNode ? [currentNode] : []), ...primaryNodes];
}

function getLineClass(node) {
  if (node.pathType === "direct") return "direct";
  if (node.pathType === "longer_path") return "longer";
  return "bridge";
}

function MapNode({ node }) {
  const isCurrent = node.nodeType === "current";
  const nodeClass = getDurabilityClass(node.aiDurabilityTone);

  return (
    <div
      className={`career-map-node ${nodeClass}`}
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        width: isCurrent ? 190 : 160,
        minHeight: 52,
        padding: "10px 12px",
        borderRadius: 16,
        background: isCurrent ? "#f2fbf8" : "#ffffff",
        border: isCurrent ? "1px solid #0f766e" : undefined,
        zIndex: 3,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
            background: isCurrent ? "#64748b" : "#0f766e",
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {isCurrent ? "●" : getClusterIcon(node.mapCluster)}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 6,
              alignItems: "center",
              marginBottom: 4,
              minHeight: 16,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "#64748b",
                background: "#eef2f6",
                borderRadius: 999,
                padding: "3px 6px",
                lineHeight: 1,
              }}
            >
              {isCurrent ? "You are here" : node.rank ? `#${node.rank}` : ""}
            </span>

            {!isCurrent && node.aiDurabilityRating && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: "#0f766e",
                  background: "#dff7ee",
                  borderRadius: 999,
                  padding: "3px 6px",
                  lineHeight: 1,
                }}
              >
                {node.aiDurabilityRating}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              lineHeight: 1.2,
              color: "#17212b",
            }}
          >
            {getMapShortLabel(node)}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              lineHeight: 1.2,
              color: "#667789",
            }}
          >
            {isCurrent
              ? "Current profile"
              : `${getPathLabel(node.pathType)}${
                  node.aiDurabilityRating ? ` · ${node.aiDurabilityRating}` : ""
                }`}
          </div>
        </div>
      </div>
    </div>
  );
}

function HubMap({ careerMap }) {
  const nodes = buildMapNodes(careerMap);
  const currentNode = nodes.find((node) => node.nodeType === "current");
  const destinationNodes = nodes.filter((node) => node.nodeType === "primary");

  return (
    <div
      style={{
        position: "relative",
        minHeight: 360,
        border: "1px solid #d8e0e8",
        borderRadius: 18,
        background:
          "radial-gradient(circle at center, rgba(15, 118, 110, 0.06), rgba(255,255,255,0) 42%), #ffffff",
        overflow: "hidden",
        marginTop: 22,
      }}
    >
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
        {currentNode &&
          destinationNodes.map((node) => (
            <line
              key={`line-${node.id}`}
              x1={currentNode.x}
              y1={currentNode.y}
              x2={node.x}
              y2={node.y}
              stroke={node.pathType === "direct" ? "#17212b" : "#0f766e"}
              strokeWidth={node.pathType === "direct" ? 0.35 : 0.45}
              strokeDasharray={
                getLineClass(node) === "bridge"
                  ? "2 2"
                  : getLineClass(node) === "longer"
                    ? "1 2"
                    : "0"
              }
              opacity="0.9"
            />
          ))}
      </svg>

      {nodes.map((node) => (
        <MapNode key={node.id} node={node} />
      ))}
    </div>
  );
}

function MapLegend() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px 18px",
        marginTop: 12,
        padding: "10px 14px",
        border: "1px solid #d8e0e8",
        borderRadius: 14,
        background: "#ffffff",
        color: "#52616f",
        fontSize: 12,
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 28,
            height: 2,
            background: "#17212b",
            display: "inline-block",
          }}
        />
        Credible now
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 28,
            borderTop: "2px dashed #0f766e",
            display: "inline-block",
          }}
        />
        Bridge path
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 28,
            borderTop: "2px dotted #52616f",
            display: "inline-block",
          }}
        />
        Longer path
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <span>AI durability</span>
        {["#d99a22", "#e7c66a", "#a8d5bd", "#2a9d78", "#0f766e"].map(
          (color) => (
            <i
              key={color}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                display: "inline-block",
                background: color,
              }}
            />
          )
        )}
      </div>
    </div>
  );
}

function SummaryGrid({ summary }) {
  const items = [
    ["Main pattern", summary.mainPattern],
    ["Transition style", summary.transitionStyle],
    ["Bridge goal", summary.bridgeGoal],
    ["Main caution", summary.mainCaution],
  ];

  return (
    <div className="career-map-summary-grid" style={{ marginTop: 18 }}>
      {items.map(([label, value]) => (
        <div key={label} className="career-map-summary-card">
          <span>{label}</span>
          <strong>{value || "Not available"}</strong>
        </div>
      ))}
    </div>
  );
}

function getPrimaryMeaning(node) {
  if (node.mapCluster === "marketplace_platforms") {
    return "Uses marketplace, platform, ecosystem, and operations experience as the center of gravity.";
  }

  if (node.mapCluster === "enterprise_leadership") {
    return "Points toward broader ownership of teams, execution, priorities, and business outcomes.";
  }

  if (node.mapCluster === "business_operations") {
    return "Focuses on connecting strategy, systems, people, and execution.";
  }

  if (node.mapCluster === "independent_advisory") {
    return "Turns experience into advisory, consulting, or fractional work.";
  }

  return "A realistic career territory supported by your profile signals.";
}

function getWhyItFits(node) {
  if (node.mapCluster === "marketplace_platforms") {
    return "Profile signals show marketplace, platform, or ecosystem operating experience.";
  }

  if (node.mapCluster === "enterprise_leadership") {
    return "Profile signals show management, execution, stakeholder, and leadership experience.";
  }

  if (node.mapCluster === "business_operations") {
    return "Profile signals show systems thinking, coordination, and operating rhythm.";
  }

  if (node.mapCluster === "independent_advisory") {
    return "Profile signals show advisory, consulting, or cross-functional problem-solving experience.";
  }

  return "This direction matched experience, anchors, financial fit, and durability signals.";
}

function getCredibilityAction(node) {
  if (node.pathType === "bridge") {
    return "Build clearer proof points, case examples, and positioning before treating this as fully direct.";
  }

  if (node.pathType === "stretch") {
    return "Validate carefully with real market feedback before making it the main move.";
  }

  if (node.mapCluster === "marketplace_platforms") {
    return "Prepare 2–3 examples showing platform, marketplace, or ecosystem outcomes.";
  }

  if (node.mapCluster === "enterprise_leadership") {
    return "Translate past work into business outcomes: growth, cost, scale, process, or team performance.";
  }

  return "Prepare evidence that makes this direction believable to a hiring manager, client, or partner.";
}

function DirectionCard({ node, variant = "primary" }) {
  const isAdjacent = variant === "adjacent";

  return (
    <article
      style={{
        padding: 18,
        border: "1px solid #d8e0e8",
        borderRadius: 18,
        background: "#ffffff",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#0f766e",
            color: "#ffffff",
            fontWeight: 800,
          }}
        >
          {getClusterIcon(node.mapCluster)}
        </div>

        <span
          style={{
            padding: "7px 10px",
            borderRadius: 999,
            background: "#dff7ee",
            color: "#0f766e",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {isAdjacent ? "Nearby path" : getPathLabel(node.pathType)}
        </span>
      </div>

      <h4 style={{ margin: "0 0 10px", fontSize: 18, lineHeight: 1.25 }}>
        {node.directionLabel}
      </h4>

      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <strong style={{ display: "block", marginBottom: 4 }}>
            {isAdjacent ? "Why it is nearby" : "What this direction means"}
          </strong>
          <p style={{ margin: 0, color: "#52616f", lineHeight: 1.45 }}>
            {isAdjacent ? node.reason || getWhyItFits(node) : getPrimaryMeaning(node)}
          </p>
        </div>

        {!isAdjacent && (
          <div>
            <strong style={{ display: "block", marginBottom: 4 }}>
              Why it fits
            </strong>
            <p style={{ margin: 0, color: "#52616f", lineHeight: 1.45 }}>
              {getWhyItFits(node)}
            </p>
          </div>
        )}

        <div>
          <strong style={{ display: "block", marginBottom: 4 }}>
            {isAdjacent ? "What would make it stronger" : "Credibility action"}
          </strong>
          <p style={{ margin: 0, color: "#52616f", lineHeight: 1.45 }}>
            {isAdjacent
              ? "More evidence, stronger positioning, or a bridge project would make this path more credible."
              : getCredibilityAction(node)}
          </p>
        </div>
      </div>
    </article>
  );
}

function DirectionCards({ title, subtitle, nodes, variant }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ marginBottom: 14 }}>
        <h4 style={{ margin: "0 0 6px", fontSize: 22 }}>{title}</h4>
        {subtitle && (
          <p style={{ margin: 0, color: "#667789", fontSize: 15 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        {nodes.map((node) => (
          <DirectionCard
            key={`${variant}-${node.directionId}`}
            node={node}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

function SignalItem({ label, value }) {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #e2e8ef",
        borderRadius: 12,
        background: "#ffffff",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: 4,
          color: "#6b7a89",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <strong style={{ color: "#17212b", fontSize: 13, lineHeight: 1.3 }}>
        {value}
      </strong>
    </div>
  );
}

function AssessmentSignals({ careerMap }) {
  const inputFactors = careerMap?.inputFactors;

  if (!inputFactors) return null;

  const anchors = inputFactors.careerAnchors?.dominant || [];
  const financial = inputFactors.financialReality || {};
  const cv = inputFactors.cvSignals || {};
  const constraints = inputFactors.transitionConstraints || {};
  const weights = inputFactors.priorityWeights?.normalizedPercentages || {};
  const domains = cv.domainSignals || [];

  return (
    <div
      style={{
        marginTop: 28,
        padding: 20,
        border: "1px solid #d8e0e8",
        borderRadius: 18,
        background: "#ffffff",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 6px", fontSize: 22 }}>
          Your assessment signals
        </h4>
        <p style={{ margin: 0, color: "#667789", fontSize: 15 }}>
          These are the main inputs behind the map. They make the recommendation
          easier to understand and easier to correct later.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        <article style={signalCardStyle}>
          <h5 style={signalTitleStyle}>Career anchors</h5>
          <p style={signalTextStyle}>Dominant motivation signals.</p>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {anchors.length > 0 ? (
              anchors.map((anchor) => (
                <SignalItem
                  key={anchor.anchorId}
                  label={anchor.label}
                  value={`${anchor.score}/10`}
                />
              ))
            ) : (
              <SignalItem label="Anchors" value="Not provided" />
            )}
          </div>
        </article>

        <article style={signalCardStyle}>
          <h5 style={signalTitleStyle}>Financial reality</h5>
          <p style={signalTextStyle}>Income floor and transition buffer.</p>
          <div style={signalGridStyle}>
            <SignalItem
              label="Monthly floor"
              value={formatMoney(financial.monthlyIncomeFloor)}
            />
            <SignalItem
              label="Runway"
              value={
                financial.runwayMonths
                  ? `${financial.runwayMonths} months`
                  : "Not provided"
              }
            />
            <SignalItem
              label="Income drop"
              value={formatValue(financial.incomeDropTolerance)}
            />
            <SignalItem
              label="Bridge role"
              value={formatValue(financial.bridgeRoleWillingness)}
            />
          </div>
        </article>

        <article style={signalCardStyle}>
          <h5 style={signalTitleStyle}>CV / credibility signals</h5>
          <p style={signalTextStyle}>Experience patterns detected from CV.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
            {domains.length > 0 ? (
              domains.slice(0, 6).map((domain) => (
                <span
                  key={domain}
                  style={{
                    display: "inline-flex",
                    padding: "6px 9px",
                    borderRadius: 999,
                    background: "#e4f7f0",
                    color: "#0f766e",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {formatValue(domain)}
                </span>
              ))
            ) : (
              <SignalItem label="Domains" value="Not provided" />
            )}
          </div>

          <div style={signalGridStyle}>
            <SignalItem
              label="Seniority"
              value={formatValue(cv.senioritySignal)}
            />
            <SignalItem
              label="Leadership"
              value={formatValue(cv.leadershipScope)}
            />
          </div>
        </article>

        <article style={signalCardStyle}>
          <h5 style={signalTitleStyle}>Transition constraints</h5>
          <p style={signalTextStyle}>Practical conditions affecting realism.</p>
          <div style={signalGridStyle}>
            <SignalItem
              label="Work mode"
              value={formatValue(constraints.workModePreference)}
            />
            <SignalItem
              label="Retraining"
              value={formatValue(constraints.retrainingWillingness)}
            />
            <SignalItem
              label="Weekly time"
              value={formatValue(constraints.timeAvailablePerWeek)}
            />
            <SignalItem
              label="Risk tolerance"
              value={formatValue(constraints.riskTolerance)}
            />
          </div>
        </article>

        <article style={{ ...signalCardStyle, gridColumn: "1 / -1" }}>
          <h5 style={signalTitleStyle}>Priority weights</h5>
          <p style={signalTextStyle}>
            How the scoring logic balanced the main decision factors.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 8,
              marginTop: 12,
            }}
          >
            <SignalItem
              label="Competence"
              value={`${weights.competencyFit ?? "—"}%`}
            />
            <SignalItem label="Anchors" value={`${weights.anchorFit ?? "—"}%`} />
            <SignalItem
              label="Financial"
              value={`${weights.financialViability ?? "—"}%`}
            />
            <SignalItem
              label="Durability"
              value={`${weights.roleDurability ?? "—"}%`}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

const signalCardStyle = {
  padding: 16,
  border: "1px solid #e2e8ef",
  borderRadius: 16,
  background: "#fbfcfd",
};

const signalTitleStyle = {
  margin: "0 0 4px",
  color: "#17212b",
  fontSize: 15,
  lineHeight: 1.25,
};

const signalTextStyle = {
  margin: 0,
  color: "#667085",
  fontSize: 13,
  lineHeight: 1.4,
};

const signalGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
  marginTop: 12,
};

function CareerDirectionMap({ careerMap }) {
  if (!careerMap) {
    return null;
  }

  const summary = careerMap.summary || {};
  const primaryNodes = careerMap.primaryNodes || [];
  const adjacentNodes = normalizeAdjacentNodes(careerMap.adjacentNodes || []);

  return (
    <section className="career-map-section">
      <div className="career-map-header">
        <div>
          <p className="eyebrow">Career map</p>
          <h3>Your Career Direction Map</h3>
          <p className="career-map-intro">
            These are career directions, not fixed job titles. The map shows
            where your profile sits today, which primary trajectories are most
            realistic, and which nearby paths may be worth validating.
          </p>
        </div>

        <div className="career-map-version">
          {careerMap.version || "career-map-v1.0"}
        </div>
      </div>

      <HubMap careerMap={careerMap} />
      <MapLegend />
      <SummaryGrid summary={summary} />

      <DirectionCards
        title="Recommended directions"
        subtitle="The strongest primary trajectories from the current assessment."
        nodes={primaryNodes}
        variant="primary"
      />

      <DirectionCards
        title="Nearby trajectories to explore"
        subtitle="Adjacent paths that may become stronger with more evidence, bridge work, or clearer positioning."
        nodes={adjacentNodes}
        variant="adjacent"
      />

      <AssessmentSignals careerMap={careerMap} />
    </section>
  );
}

export default CareerDirectionMap;