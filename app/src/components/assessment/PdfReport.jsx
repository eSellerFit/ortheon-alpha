// Hidden PDF-only layout. Each .pdf-page is captured separately by html2canvas
// and assembled into a jsPDF document — no canvas slicing, clean page boundaries.

const SUMMARY_ICONS = {
  "Main pattern": "◈",
  "Transition style": "▶",
};

const durabilityLabels = {
  D0: "Declining",
  D1: "Pressured by AI",
  D2: "Transforming",
  D3: "Durable",
  D4: "Future-resilient",
};

const pathLabels = {
  direct: "Primary direction",
  bridge: "Primary direction",
  stretch: "Primary direction",
  longer_path: "Primary direction",
  credentialed: "Primary direction",
  credibility_gap: "Primary direction",
};

const transitionPathwayLabels = {
  direct: "Primary direction",
  bridge: "Primary direction",
  stretch: "Primary direction",
};

function getOrdinal(rank) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

function formatUsd(value) {
  const number = Number(value);
  if (!number) return "Not available";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
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

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getPrimaryMeaning(node) {
  if (node.mapCluster === "marketplace_platforms")
    return "Uses marketplace, platform, ecosystem, and operations experience as the center of gravity.";
  if (node.mapCluster === "enterprise_leadership")
    return "Points toward broader ownership of teams, execution, priorities, and business outcomes.";
  if (node.mapCluster === "business_operations")
    return "Focuses on connecting strategy, systems, people, and execution.";
  if (node.mapCluster === "independent_advisory")
    return "Turns experience into advisory, consulting, or fractional work.";
  return "A realistic career territory supported by your profile signals.";
}

function getWhyItFits(node) {
  if (node.mapCluster === "marketplace_platforms")
    return "Profile signals show marketplace, platform, or ecosystem operating experience.";
  if (node.mapCluster === "enterprise_leadership")
    return "Profile signals show management, execution, stakeholder, and leadership experience.";
  if (node.mapCluster === "business_operations")
    return "Profile signals show systems thinking, coordination, and operating rhythm.";
  if (node.mapCluster === "independent_advisory")
    return "Profile signals show advisory, consulting, or cross-functional problem-solving experience.";
  return "This direction matched experience, anchors, financial fit, and durability signals.";
}

function getCredibilityAction(node) {
  if (node.pathType === "stretch")
    return "Validate carefully with real market feedback before making it the main move.";
  if (node.mapCluster === "marketplace_platforms")
    return "Prepare 2–3 examples showing platform, marketplace, or ecosystem outcomes.";
  if (node.mapCluster === "enterprise_leadership")
    return "Translate past work into business outcomes: growth, cost, scale, process, or team performance.";
  return "Prepare evidence that makes this direction believable to a hiring manager, client, or partner.";
}

// ── Shared page brand strip ────────────────────────────────────────────────

function PdfBrand({ section }) {
  return (
    <div className="pdf-brand-row">
      <span className="pdf-brand-name">Ortheon</span>
      {section && <span className="pdf-brand-section">{section}</span>}
    </div>
  );
}

// ── Page 1: Career Direction Overview ─────────────────────────────────────

function PdfPage1({ careerMap, recommendations }) {
  const summary = careerMap?.summary || {};
  const primaryNodes = careerMap?.primaryNodes || [];

  const summaryItems = [
    ["Main pattern", summary.mainPattern],
    ["Transition style", summary.transitionStyle],
  ];

  return (
    <>
      <PdfBrand />

      <div className="pdf-p1-header">
        <h1 className="pdf-p1-title">Career Direction Report</h1>
        <p className="pdf-p1-sub">
          These are career directions, not fixed job titles. The map shows where
          your profile sits today and which primary directions are most realistic.
        </p>
      </div>

      {primaryNodes.length > 0 && (
        <div className="pdf-block">
          <h2 className="pdf-block-title">Your Career Directions</h2>
          <div className="pdf-dir-list">
            {primaryNodes.slice(0, 3).map((node, i) => {
              const rec = recommendations.find(
                (r) => r.directionId === node.directionId
              );
              return (
                <div key={node.directionId || i} className="pdf-dir-row">
                  <div className="pdf-dir-rank">#{i + 1}</div>
                  <div className="pdf-dir-info">
                    <strong>{node.directionLabel}</strong>
                    <span>
                      {pathLabels[node.pathType] || node.pathType}
                      {node.aiDurabilityRating &&
                        ` · ${node.aiDurabilityRating} — ${durabilityLabels[node.aiDurabilityRating] || ""}`}
                      {rec?.scores?.total !== undefined &&
                        ` · Score ${rec.scores.total}`}
                      {rec?.financialPathway?.avg12month &&
                        ` · ${formatUsd(rec.financialPathway.avg12month)} est. year 1`}
                    </span>
                  </div>
                  {rec?.fitBand && (
                    <div className="pdf-dir-band">{rec.fitBand}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="pdf-block">
        <h2 className="pdf-block-title">Key Signals</h2>
        <div className="pdf-summary-grid">
          {summaryItems.map(([label, value]) => (
            <div key={label} className="pdf-summary-card">
              <span className="pdf-summary-icon" aria-hidden="true">
                {SUMMARY_ICONS[label]}
              </span>
              <span className="pdf-summary-label">{label}</span>
              <strong className="pdf-summary-value">
                {value || "Not available"}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Pages 2–3: Direction Cards ─────────────────────────────────────────────

function PdfDirectionCard({ node }) {
  return (
    <div className="pdf-dcard">
      <div className="pdf-dcard-top">
        <strong className="pdf-dcard-title">{node.directionLabel}</strong>
        <span className="pdf-dcard-badge">
          {pathLabels[node.pathType] || "Primary direction"}
        </span>
      </div>

      {node.aiDurabilityRating && (
        <div className="pdf-dcard-meta">
          AI durability:{" "}
          <strong>{node.aiDurabilityRating}</strong>
          {durabilityLabels[node.aiDurabilityRating] &&
            ` — ${durabilityLabels[node.aiDurabilityRating]}`}
        </div>
      )}

      <div className="pdf-dcard-rows">
        <div className="pdf-dcard-row">
          <strong>What this direction means</strong>
          <p>{getPrimaryMeaning(node)}</p>
        </div>

        <div className="pdf-dcard-row">
          <strong>Why it fits</strong>
          <p>{getWhyItFits(node)}</p>
        </div>

        <div className="pdf-dcard-row">
          <strong>Credibility action</strong>
          <p>{getCredibilityAction(node)}</p>
        </div>
      </div>
    </div>
  );
}

function PdfPageDirections({ title, subtitle, section, nodes }) {
  return (
    <>
      <PdfBrand section={section} />
      <div className="pdf-page-heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="pdf-dcard-list">
        {nodes.map((node) => (
          <PdfDirectionCard
            key={node.directionId || node.directionLabel}
            node={node}
          />
        ))}
      </div>
    </>
  );
}

// ── Page 4: Assessment Signals ─────────────────────────────────────────────

function PdfSigItem({ label, value }) {
  return (
    <div className="pdf-sig-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PdfPageSignals({ careerMap }) {
  const inputFactors = careerMap?.inputFactors || {};
  const anchors = inputFactors.careerAnchors?.dominant || [];
  const financial = inputFactors.financialReality || {};
  const cv = inputFactors.cvSignals || {};
  const constraints = inputFactors.transitionConstraints || {};
  const weights = inputFactors.priorityWeights?.normalizedPercentages || {};
  const domains = cv.domainSignals || [];

  return (
    <>
      <PdfBrand section="What Drove These Results" />
      <div className="pdf-page-heading">
        <h2>What Drove These Results</h2>
        <p>
          The main inputs behind the map. They make the recommendation easier
          to understand and easier to correct later.
        </p>
      </div>

      <div className="pdf-sig-grid">
        <div className="pdf-sig-card">
          <h3>Career anchors</h3>
          <p>Dominant motivation signals.</p>
          <div className="pdf-sig-items">
            {anchors.length > 0 ? (
              anchors.map((anchor) => (
                <PdfSigItem
                  key={anchor.anchorId}
                  label={anchor.label}
                  value={`${anchor.score}/10`}
                />
              ))
            ) : (
              <PdfSigItem label="Anchors" value="Not provided" />
            )}
          </div>
        </div>

        <div className="pdf-sig-card">
          <h3>Financial reality</h3>
          <p>Income floor and transition buffer.</p>
          <div className="pdf-sig-items">
            <PdfSigItem
              label="Monthly floor"
              value={formatMoney(financial.monthlyIncomeFloor)}
            />
            <PdfSigItem
              label="Runway"
              value={
                financial.runwayMonths
                  ? `${financial.runwayMonths} months`
                  : "Not provided"
              }
            />
            <PdfSigItem
              label="Income drop"
              value={formatValue(financial.incomeDropTolerance)}
            />
          </div>
        </div>

        <div className="pdf-sig-card">
          <h3>CV / credibility signals</h3>
          <p>Experience patterns detected from CV.</p>
          {domains.length > 0 && (
            <div className="pdf-domain-chips">
              {domains.slice(0, 6).map((domain) => (
                <span key={domain} className="pdf-domain-chip">
                  {formatValue(domain)}
                </span>
              ))}
            </div>
          )}
          <div className="pdf-sig-items">
            <PdfSigItem
              label="Seniority"
              value={formatValue(cv.senioritySignal)}
            />
            <PdfSigItem
              label="Leadership"
              value={formatValue(cv.leadershipScope)}
            />
          </div>
        </div>

        <div className="pdf-sig-card">
          <h3>Transition constraints</h3>
          <p>Practical conditions affecting realism.</p>
          <div className="pdf-sig-items">
            <PdfSigItem
              label="Work mode"
              value={formatValue(constraints.workModePreference)}
            />
            <PdfSigItem
              label="Retraining"
              value={formatValue(constraints.retrainingWillingness)}
            />
            <PdfSigItem
              label="Weekly time"
              value={formatValue(constraints.timeAvailablePerWeek)}
            />
            <PdfSigItem
              label="Risk tolerance"
              value={formatValue(constraints.riskTolerance)}
            />
          </div>
        </div>

        <div className="pdf-sig-card pdf-sig-card-full">
          <h3>Priority weights</h3>
          <p>How the scoring logic balanced the main decision factors.</p>
          <div className="pdf-sig-items pdf-sig-items-4col">
            <PdfSigItem
              label="Competence"
              value={`${weights.competencyFit ?? "—"}%`}
            />
            <PdfSigItem
              label="Anchors"
              value={`${weights.anchorFit ?? "—"}%`}
            />
            <PdfSigItem
              label="Financial"
              value={`${weights.financialViability ?? "—"}%`}
            />
            <PdfSigItem
              label="Durability"
              value={`${weights.roleDurability ?? "—"}%`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Pages 5+: Detailed Direction Cards ────────────────────────────────────

function PdfDetailPage({ recommendation, total }) {
  const {
    rank,
    directionLabel,
    scores,
    fitBand,
    aiDurabilityRating,
    transitionPathway,
    financialPathway,
    category,
    context,
    transitionLabel,
    salarySources,
    salarySource,
    salaryLastUpdated,
    eligibilityWarning,
    financialFlag,
    anchorWarnings,
    cvConfidence,
    d4EvolutionPath,
  } = recommendation;

  const badgeClass = {
    main: "pdf-detail-badge-main",
    secondary: "pdf-detail-badge-secondary",
    flagged: "pdf-detail-badge-flagged",
  }[transitionLabel?.treatment] || "pdf-detail-badge-main";

  const warnings = [
    eligibilityWarning && `Credential note: ${eligibilityWarning}`,
    financialFlag === "financially_constrained" &&
      "This direction may be financially constrained in the first 12 months.",
    financialFlag === "financially_risky" &&
      "This direction may be financially risky based on your stated income floor.",
    anchorWarnings?.length > 0 &&
      `Anchor note: this direction may conflict with your ${anchorWarnings.join(", ")} preference.`,
    cvConfidence === "low" &&
      "Recommendation confidence is lower because no parsed CV data was available.",
  ].filter(Boolean);

  return (
    <>
      <PdfBrand section={`Direction ${rank} of ${total}`} />

      <div className="pdf-detail-header">
        <div>
          <div className="pdf-detail-eyebrow">{getOrdinal(rank)} direction</div>
          <h2 className="pdf-detail-title">{directionLabel}</h2>
        </div>
        <div className="pdf-detail-score-block">
          <span>Total score</span>
          <strong>{scores?.total}</strong>
        </div>
      </div>

      {transitionLabel && (
        <div className={`pdf-detail-badge ${badgeClass}`}>
          {transitionLabel.label}
          {transitionLabel.sublabel && (
            <small> · {transitionLabel.sublabel}</small>
          )}
        </div>
      )}

      <div className="pdf-detail-facts">
        <div className="pdf-detail-fact">
          <span>Fit band</span>
          <strong>{fitBand}</strong>
        </div>
        <div className="pdf-detail-fact">
          <span>AI durability</span>
          <strong>
            {aiDurabilityRating}
            {aiDurabilityRating && durabilityLabels[aiDurabilityRating]
              ? ` — ${durabilityLabels[aiDurabilityRating]}`
              : ""}
          </strong>
        </div>
        <div className="pdf-detail-fact">
          <span>Transition pathway</span>
          <strong>
            {transitionPathwayLabels[transitionPathway] || transitionPathway}
          </strong>
        </div>
        <div className="pdf-detail-fact">
          <span>Est. first-year income</span>
          <strong>{formatUsd(financialPathway?.avg12month)}</strong>
        </div>
        <div className="pdf-detail-fact">
          <span>Category</span>
          <strong>{category}</strong>
        </div>
        <div className="pdf-detail-fact">
          <span>Context</span>
          <strong>{context}</strong>
        </div>
      </div>

      {salarySources?.[0] && (
        <div className="pdf-detail-salary">
          BLS benchmark: {salarySources[0].occupationTitle} —{" "}
          {formatUsd(salarySources[0].medianAnnualWage)} median annual wage.
          {salarySource && ` Source: ${salarySource};`}
          {` Updated ${salaryLastUpdated || "unknown"}.`}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="pdf-detail-warnings">
          {warnings.map((w, i) => (
            <div key={i} className="pdf-detail-warning">
              {w}
            </div>
          ))}
        </div>
      )}

      {d4EvolutionPath && (
        <div className="pdf-detail-evolution">
          <strong>AI evolution path:</strong> {d4EvolutionPath}
        </div>
      )}
    </>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

function PdfReport({ careerMap, recommendations, containerRef }) {
  if (!careerMap || !recommendations || recommendations.length === 0) {
    return null;
  }

  const primaryNodes = careerMap.primaryNodes || [];
  return (
    <div
      ref={containerRef}
      className="pdf-report-container"
      aria-hidden="true"
    >
      <div className="pdf-page">
        <PdfPage1 careerMap={careerMap} recommendations={recommendations} />
      </div>

      {primaryNodes.length > 0 && (
        <div className="pdf-page">
          <PdfPageDirections
            title="Recommended Directions"
            section="Recommended Directions"
            subtitle="The strongest primary trajectories from the current assessment."
            nodes={primaryNodes}
          />
        </div>
      )}

      <div className="pdf-page">
        <PdfPageSignals careerMap={careerMap} />
      </div>

      {recommendations.map((rec) => (
        <div className="pdf-page" key={rec.directionId}>
          <PdfDetailPage
            recommendation={rec}
            total={recommendations.length}
          />
        </div>
      ))}
    </div>
  );
}

export default PdfReport;
