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

const MAP_SHORT_LABELS = {
  "BF-1-E": "Financial Strategy",
  "BF-1-IF": "Financial Advisory",
  "BF-4-E": "HR & People Ops",
  "BF-5-E": "Workforce Planning",
  "BF-6-E": "People Analytics",
  "BF-7-IF": "Biz Advisory",
  "BF-8-IF": "Outplacement",
  "BF-9-E": "Compliance & Risk",
  "BF-10-IF": "Comms / PR",
  "BF-11-OV": "Wealth Mgmt",

  "MG-1-E": "General Mgmt",
  "MG-4-ST": "Startup Leadership",
  "MG-5-NP": "Nonprofit Ops",
  "MG-6-E": "Chief of Staff",
  "MG-7-IF": "Mgmt Consulting",
  "MG-8-E": "Program Mgmt",
  "MG-9-E": "Marketplace Ops",
  "MG-9-IF": "Marketplace Ops",
  "MG-10-NP": "Nonprofit Dev",
  "MG-11-OV": "Own Venture",
  "MG-12-OV": "Social Enterprise",
  "MG-13-E": "Government Mgmt",

  "SR-1-E": "Enterprise Sales",
  "SR-2-E": "Customer Success",
  "SR-3-E": "Seller Enablement",

  "CM-2-E": "Data & Analytics",
  "CM-4-ST": "AI & Emerging Tech",
  "CM-5-IF": "AI Consulting",
  "CM-6-E": "Product Ops",
  "CM-7-ST": "AI Product Ops",
  "CM-8-IF": "Ops Consulting",

  "TE-1-E": "CTO / VP Eng",
  "TE-2-E": "Chief AI Officer",
  "TE-3-E": "Tech Strategy",
  "TE-4-IF": "Fractional CTO",
  "TE-5-E": "Platform Modernization",

  "ED-3-IF": "L&D Consulting",
  "ED-4-IF": "Instructional Design",
  "ED-5-IF": "Exec Coaching",

  "HC-2-OV": "Coaching Practice",
  "HC-3-E": "Healthcare Admin",

  "LG-2-IF": "Fractional GC",
  "LG-3-IF": "Mediation",

  "AD-5-IF": "Fractional CMO",
  "AD-6-IF": "Content Strategy",
  "AD-7-IF": "UX / Product Design",

  "AE-4-IF": "Engineering Consulting",
  "AE-5-E": "Technical Program Mgmt",

  "IR-1-OV": "Skilled Trades",
};

function getMapShortLabel(node) {
  if (node.nodeType === "current") {
    return node.label || "Current profile";
  }

  if (node.directionId && MAP_SHORT_LABELS[node.directionId]) {
    return MAP_SHORT_LABELS[node.directionId];
  }

  const label = node.directionLabel || node.label || "";
  const stripped = label.split(" — ")[0];
  return stripped.length > 20 ? `${stripped.slice(0, 20)}…` : stripped;
}

function getClusterIcon(cluster) {
  const icons = {
    enterprise_leadership: "◆",
    business_operations: "◈",
    marketplace_platforms: "◇",

    technology_executive: "⬡",
    engineering_leadership: "▲",
    platform_technology: "▧",
    ai_transformation: "✦",

    people_operations: "◉",
    workforce_intelligence: "◎",
    people_analytics_hr_tech: "▥",

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
    return { x: 50, y: 22 };
  }

  if (total === 2) {
    return [
      { x: 28, y: 40 },
      { x: 72, y: 40 },
    ][index];
  }

  return [
    { x: 50, y: 14 },
    { x: 76, y: 50 },
    { x: 24, y: 50 },
  ][index] || { x: 50, y: 14 };
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
    y: 76,
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
        width: isCurrent ? 186 : 164,
        minHeight: 56,
        padding: "11px 13px",
        borderRadius: 13,
        background: isCurrent ? "#eef3f5" : "#ffffff",
        border: isCurrent ? "1px solid #245f73" : undefined,
        zIndex: 3,
        boxShadow: "0 2px 8px rgba(17, 24, 39, 0.06)",
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
            width: 22,
            height: 22,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
            background: isCurrent ? "#64748b" : "#245f73",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 700,
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
                fontWeight: 700,
                color: "#6b7280",
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
                  fontWeight: 600,
                  color: "#52616f",
                  background: "#eef3f5",
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
              fontWeight: 700,
              lineHeight: 1.25,
              color: "#111827",
            }}
          >
            {getMapShortLabel(node)}
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 11,
              lineHeight: 1.2,
              color: "#6b7280",
            }}
          >
            {isCurrent ? "Current profile" : getPathLabel(node.pathType)}
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
        minHeight: 520,
        border: "1px solid #dbd8d0",
        borderRadius: 16,
        background:
          "radial-gradient(ellipse at 50% 76%, rgba(36, 95, 115, 0.04), transparent 52%), #f9f8f6",
        overflow: "hidden",
        marginTop: 20,
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
              stroke={node.pathType === "direct" ? "#374151" : "#3a7d8c"}
              strokeWidth={node.pathType === "direct" ? 0.4 : 0.5}
              strokeDasharray={
                getLineClass(node) === "bridge"
                  ? "2 2"
                  : getLineClass(node) === "longer"
                    ? "1 2"
                    : "0"
              }
              opacity="0.6"
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
        gap: "10px 18px",
        marginTop: 10,
        padding: "9px 14px",
        border: "1px solid #dbd8d0",
        borderRadius: 12,
        background: "#f9f8f6",
        color: "#6b7280",
        fontSize: 12,
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 26,
            height: 1.5,
            background: "#374151",
            display: "inline-block",
          }}
        />
        Credible now
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 26,
            borderTop: "1.5px dashed #3a7d8c",
            display: "inline-block",
          }}
        />
        Bridge path
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 26,
            borderTop: "1.5px dotted #6b7280",
            display: "inline-block",
          }}
        />
        Longer path
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span>AI durability</span>
        {["#9a7070", "#8a7a5a", "#8a9aaa", "#3a7d8c", "#245f73"].map(
          (color) => (
            <i
              key={color}
              style={{
                width: 9,
                height: 9,
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

const SUMMARY_CARD_ICONS = {
  "Main pattern": "◈",
  "Transition style": "▶",
  "Bridge goal": "◎",
  "Main caution": "△",
};

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
          <span className="career-map-summary-icon" aria-hidden="true">
            {SUMMARY_CARD_ICONS[label]}
          </span>
          <span>{label}</span>
          <strong>{value || "Not available"}</strong>
        </div>
      ))}
    </div>
  );
}

function getPrimaryMeaning(node) {
  if (node.mapCluster === "technology_executive") {
    return "Uses technology leadership, engineering scale, architecture, and executive decision-making as the center of gravity.";
  }

  if (node.mapCluster === "engineering_leadership") {
    return "Focuses on leading technical teams, delivery systems, and complex engineering execution.";
  }

  if (node.mapCluster === "platform_technology") {
    return "Points toward software, platform, architecture, infrastructure, and modernization work.";
  }

  if (node.mapCluster === "ai_transformation") {
    return "Uses AI, automation, and digital transformation evidence as the main direction signal.";
  }

  if (node.mapCluster === "marketplace_platforms") {
    return "Uses marketplace, platform, ecosystem, and operations experience as the center of gravity.";
  }

  if (node.mapCluster === "enterprise_leadership") {
    return "Points toward broader ownership of teams, execution, priorities, and business outcomes.";
  }

  if (node.mapCluster === "business_operations") {
    return "Focuses on connecting strategy, systems, people, and execution.";
  }

  if (node.mapCluster === "people_operations") {
    return "Uses HR, people operations, talent, and organizational work as the center of gravity.";
  }

  if (node.mapCluster === "workforce_intelligence") {
    return "Focuses on workforce planning, talent systems, skills mapping, and people strategy.";
  }

  if (node.mapCluster === "people_analytics_hr_tech") {
    return "Focuses on HR technology, people analytics, and workforce data systems.";
  }

  if (node.mapCluster === "independent_advisory") {
    return "Turns experience into advisory, consulting, or fractional work.";
  }

  return "A realistic career territory supported by your profile signals.";
}

function getWhyItFits(node) {
  if (node.mapCluster === "technology_executive") {
    return "Profile signals show senior technology, software, AI, architecture, or engineering leadership experience.";
  }

  if (node.mapCluster === "engineering_leadership") {
    return "Profile signals show technical execution, delivery ownership, and engineering management experience.";
  }

  if (node.mapCluster === "platform_technology") {
    return "Profile signals show software, systems, architecture, platform, or infrastructure experience.";
  }

  if (node.mapCluster === "ai_transformation") {
    return "Profile signals show AI, automation, digital transformation, or technology change experience.";
  }

  if (node.mapCluster === "marketplace_platforms") {
    return "Profile signals show marketplace, platform, or ecosystem operating experience.";
  }

  if (node.mapCluster === "enterprise_leadership") {
    return "Profile signals show management, execution, stakeholder, and leadership experience.";
  }

  if (node.mapCluster === "business_operations") {
    return "Profile signals show systems thinking, coordination, and operating rhythm.";
  }

  if (node.mapCluster === "people_operations") {
    return "Profile signals show HR, talent, people operations, or organizational work.";
  }

  if (node.mapCluster === "workforce_intelligence") {
    return "Profile signals show workforce, talent planning, people systems, or HR strategy experience.";
  }

  if (node.mapCluster === "people_analytics_hr_tech") {
    return "Profile signals show HR data, people analytics, workforce systems, or HR technology experience.";
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

  if (node.mapCluster === "technology_executive") {
    return "Prepare examples showing technology strategy, engineering scale, architecture decisions, AI adoption, and business outcomes.";
  }

  if (node.mapCluster === "engineering_leadership") {
    return "Prepare examples showing delivery ownership, team leadership, technical decisions, and measurable engineering outcomes.";
  }

  if (node.mapCluster === "platform_technology") {
    return "Prepare examples showing architecture, platform modernization, cloud, infrastructure, or software delivery impact.";
  }

  if (node.mapCluster === "ai_transformation") {
    return "Prepare examples showing AI use cases, automation impact, adoption strategy, and operating-model change.";
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
      className="pdf-avoid-break"
      style={{
        padding: isAdjacent ? 14 : 20,
        border: "1px solid #dbd8d0",
        borderRadius: isAdjacent ? 13 : 16,
        background: isAdjacent ? "#fafaf8" : "#ffffff",
        boxShadow: isAdjacent ? "none" : "0 1px 4px rgba(17, 24, 39, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "flex-start",
          marginBottom: isAdjacent ? 10 : 14,
        }}
      >
        <div
          style={{
            width: isAdjacent ? 26 : 32,
            height: isAdjacent ? 26 : 32,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: isAdjacent ? "#6b7280" : "#245f73",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: isAdjacent ? 12 : 15,
            flexShrink: 0,
          }}
        >
          {getClusterIcon(node.mapCluster)}
        </div>

        <span
          style={{
            padding: isAdjacent ? "4px 8px" : "6px 10px",
            borderRadius: 999,
            background: isAdjacent ? "#eeece8" : "#e7f1f3",
            color: isAdjacent ? "#6b7280" : "#245f73",
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {isAdjacent ? "Nearby" : getPathLabel(node.pathType)}
        </span>
      </div>

      <h4
        style={{
          margin: isAdjacent ? "0 0 8px" : "0 0 12px",
          fontSize: isAdjacent ? 15 : 17,
          lineHeight: 1.3,
          color: "#111827",
          fontWeight: isAdjacent ? 600 : 700,
        }}
      >
        {node.directionLabel}
      </h4>

      <div style={{ display: "grid", gap: isAdjacent ? 8 : 12 }}>
        <div>
          <strong
            style={{
              display: "block",
              marginBottom: 3,
              fontSize: isAdjacent ? 12 : 13,
              color: "#374151",
            }}
          >
            {isAdjacent ? "Why it is nearby" : "What this direction means"}
          </strong>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: 1.5,
              fontSize: isAdjacent ? 13 : 14,
            }}
          >
            {isAdjacent
              ? node.reason || getWhyItFits(node)
              : getPrimaryMeaning(node)}
          </p>
        </div>

        {!isAdjacent && (
          <div>
            <strong
              style={{
                display: "block",
                marginBottom: 3,
                fontSize: 13,
                color: "#374151",
              }}
            >
              Why it fits
            </strong>
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                lineHeight: 1.5,
                fontSize: 14,
              }}
            >
              {getWhyItFits(node)}
            </p>
          </div>
        )}

        <div>
          <strong
            style={{
              display: "block",
              marginBottom: 3,
              fontSize: isAdjacent ? 12 : 13,
              color: "#374151",
            }}
          >
            {isAdjacent ? "What would make it stronger" : "Credibility action"}
          </strong>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              lineHeight: 1.5,
              fontSize: isAdjacent ? 13 : 14,
            }}
          >
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

  const isPrimary = variant === "primary";

  return (
    <div
      style={{ marginTop: 32 }}
      className={isPrimary ? "pdf-recommended-section" : "pdf-nearby-section"}
    >
      <div style={{ marginBottom: 16 }}>
        <h4
          style={{
            margin: "0 0 6px",
            fontSize: isPrimary ? 20 : 17,
            color: "#111827",
          }}
        >
          {title}
        </h4>
        {subtitle && (
          <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="pdf-direction-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isPrimary
            ? "repeat(auto-fill, minmax(300px, 1fr))"
            : "repeat(auto-fill, minmax(260px, 1fr))",
          gap: isPrimary ? 16 : 12,
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
        border: "1px solid #e2e0da",
        borderRadius: 10,
        background: "#ffffff",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: 3,
          color: "#6b7280",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <strong
        style={{
          color: "#111827",
          fontSize: 13,
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
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
      className="pdf-signals-section"
      style={{
        marginTop: 28,
        padding: 20,
        border: "1px solid #dbd8d0",
        borderRadius: 16,
        background: "#f9f8f6",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ margin: "0 0 6px", fontSize: 20, color: "#111827" }}>
          What drove these results
        </h4>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          The main inputs behind the map. They make the recommendation easier to
          understand and easier to correct later.
        </p>
      </div>

      <div
        className="pdf-signals-grid"
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginTop: 12,
            }}
          >
            {domains.length > 0 ? (
              domains.slice(0, 6).map((domain) => (
                <span
                  key={domain}
                  style={{
                    display: "inline-flex",
                    padding: "5px 9px",
                    borderRadius: 999,
                    background: "#e7f1f3",
                    color: "#245f73",
                    fontSize: 12,
                    fontWeight: 600,
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
  border: "1px solid #e2e0da",
  borderRadius: 14,
  background: "#ffffff",
};

const signalTitleStyle = {
  margin: "0 0 4px",
  color: "#111827",
  fontSize: 14,
  lineHeight: 1.25,
  fontWeight: 600,
};

const signalTextStyle = {
  margin: 0,
  color: "#6b7280",
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
          <p className="eyebrow">Career Direction Map</p>
          <h3>Your Career Direction Map</h3>
          <p className="career-map-intro">
            These are career directions, not fixed job titles. The map shows
            where your profile sits today, which primary trajectories are most
            realistic, and which nearby paths may be worth validating.
          </p>
        </div>

        <div className="career-map-version">
          {careerMap.version || "career-map-v1.3-hard-hr-domain-gate"}
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
        title="Nearby trajectories"
        subtitle="Adjacent paths that may become stronger with more evidence, bridge work, or clearer positioning."
        nodes={adjacentNodes}
        variant="adjacent"
      />

      <AssessmentSignals careerMap={careerMap} />
    </section>
  );
}

export default CareerDirectionMap;