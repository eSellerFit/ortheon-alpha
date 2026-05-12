function getDurabilityClass(tone) {
  if (tone === "highly_durable") return "career-map-node-d4";
  if (tone === "durable") return "career-map-node-d3";
  if (tone === "transforming") return "career-map-node-d2";
  if (tone === "pressured") return "career-map-node-d1";
  return "career-map-node-default";
}

function getPathLabel(pathType) {
  const labels = {
    direct: "Direct",
    bridge: "Bridge",
    stretch: "Stretch",
    longer_path: "Longer path",
    credentialed: "Credentialed",
    credibility_gap: "Credibility gap",
  };

  return labels[pathType] || "Adjacent";
}

function getQuadrantNodes(careerMap, quadrant) {
  const primaryNodes = careerMap?.primaryNodes || [];
  const adjacentNodes = careerMap?.adjacentNodes || [];
  const longerPathNodes = careerMap?.longerPathNodes || [];

  return {
    primary: primaryNodes.filter((node) => node.mapQuadrant === quadrant),
    adjacent: adjacentNodes.filter((node) => node.mapQuadrant === quadrant),
    longer: longerPathNodes.filter((node) => node.mapQuadrant === quadrant),
  };
}

function CurrentProfileNode({ node }) {
  if (!node) return null;

  return (
    <div className="career-map-current-node">
      <div className="career-map-current-dot" />
      <div>
        <div className="career-map-node-label">You are here</div>
        <div className="career-map-current-title">{node.label}</div>
        {node.domainSignals?.length > 0 && (
          <div className="career-map-node-meta">
            {node.domainSignals.slice(0, 4).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}

function DirectionNode({ node, variant }) {
  const className = [
    "career-map-node",
    variant === "primary" ? "career-map-node-primary" : "",
    variant === "adjacent" ? "career-map-node-adjacent" : "",
    variant === "longer" ? "career-map-node-longer" : "",
    getDurabilityClass(node.aiDurabilityTone),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className="career-map-node-topline">
        {variant === "primary" && node.rank && (
          <span className="career-map-rank">#{node.rank}</span>
        )}

        {variant === "adjacent" && (
          <span className="career-map-node-type">Adjacent</span>
        )}

        {variant === "longer" && (
          <span className="career-map-node-type">Longer path</span>
        )}

        {node.aiDurabilityRating && (
          <span className="career-map-durability">{node.aiDurabilityRating}</span>
        )}
      </div>

      <div className="career-map-node-title">{node.directionLabel}</div>

      <div className="career-map-node-meta">
        {getPathLabel(node.pathType)}
        {node.totalScore ? ` · Score ${node.totalScore}` : ""}
        {node.fitBand ? ` · ${node.fitBand}` : ""}
      </div>

      {node.reason && (
        <div className="career-map-node-reason">{node.reason}</div>
      )}
    </div>
  );
}

function Quadrant({ title, subtitle, quadrantKey, careerMap }) {
  const nodes = getQuadrantNodes(careerMap, quadrantKey);

  const hasAnyNodes =
    nodes.primary.length > 0 ||
    nodes.adjacent.length > 0 ||
    nodes.longer.length > 0;

  return (
    <div className="career-map-quadrant">
      <div className="career-map-quadrant-header">
        <div className="career-map-quadrant-title">{title}</div>
        <div className="career-map-quadrant-subtitle">{subtitle}</div>
      </div>

      {!hasAnyNodes ? (
        <div className="career-map-empty">No mapped directions yet</div>
      ) : (
        <div className="career-map-node-stack">
          {nodes.primary.map((node) => (
            <DirectionNode
              key={`primary-${node.directionId}`}
              node={node}
              variant="primary"
            />
          ))}

          {nodes.adjacent.map((node) => (
            <DirectionNode
              key={`adjacent-${node.directionId}`}
              node={node}
              variant="adjacent"
            />
          ))}

          {nodes.longer.map((node) => (
            <DirectionNode
              key={`longer-${node.directionId}`}
              node={node}
              variant="longer"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CareerDirectionMap({ careerMap }) {
  if (!careerMap) {
    return null;
  }

  const summary = careerMap.summary || {};

  return (
    <section className="career-map-section">
      <div className="career-map-header">
        <div>
          <p className="eyebrow">Career map</p>
          <h3>Your Career Direction Map</h3>
          <p className="career-map-intro">
            These are career directions, not fixed job titles. The map shows
            where your profile sits today, which trajectories are strongest,
            and which adjacent routes may be worth validating.
          </p>
        </div>

        <div className="career-map-version">
          {careerMap.version || "career-map-v1.0"}
        </div>
      </div>

      <div className="career-map-summary-grid">
        <div className="career-map-summary-card">
          <span>Main pattern</span>
          <strong>{summary.mainPattern || "Not available"}</strong>
        </div>

        <div className="career-map-summary-card">
          <span>Transition style</span>
          <strong>{summary.transitionStyle || "Not available"}</strong>
        </div>

        <div className="career-map-summary-card">
          <span>Bridge goal</span>
          <strong>{summary.bridgeGoal || "Not available"}</strong>
        </div>

        <div className="career-map-summary-card">
          <span>Main caution</span>
          <strong>{summary.mainCaution || "Not available"}</strong>
        </div>
      </div>

      <div className="career-map-axis-frame">
        <div className="career-map-y-label career-map-y-top">
          Human / Creative
        </div>

        <div className="career-map-y-label career-map-y-bottom">
          Technical / Operational
        </div>

        <div className="career-map-x-label career-map-x-left">
          Corporate / Structured
        </div>

        <div className="career-map-x-label career-map-x-right">
          Entrepreneurial / Autonomous
        </div>

        <div className="career-map-grid">
          <Quadrant
            title="Corporate + Human"
            subtitle="Leadership, people, learning, influence"
            quadrantKey="corporate_human"
            careerMap={careerMap}
          />

          <Quadrant
            title="Autonomous + Human"
            subtitle="Advisory, coaching, facilitation, client work"
            quadrantKey="autonomous_human"
            careerMap={careerMap}
          />

          <Quadrant
            title="Corporate + Operational"
            subtitle="Systems, operations, platforms, analytics"
            quadrantKey="corporate_operational"
            careerMap={careerMap}
          />

          <Quadrant
            title="Autonomous + Operational"
            subtitle="Fractional, marketplace, operations advisory"
            quadrantKey="autonomous_operational"
            careerMap={careerMap}
          />
        </div>

        <CurrentProfileNode node={careerMap.currentProfileNode} />
      </div>

      <div className="career-map-legend">
        <div>
          <span className="legend-dot legend-primary" />
          Primary direction
        </div>

        <div>
          <span className="legend-dot legend-adjacent" />
          Adjacent trajectory
        </div>

        <div>
          <span className="legend-dot legend-longer" />
          Longer path
        </div>

        <div>
          <span className="legend-dot legend-d3" />
          D3/D4 more durable
        </div>

        <div>
          <span className="legend-dot legend-d2" />
          D2 transforming
        </div>
      </div>
    </section>
  );
}

export default CareerDirectionMap;