import { useEffect, useRef, useState } from "react";
import {
  generateCareerMap,
  generateRecommendations,
} from "../../utils/scoring";
import {
  getAssessment,
  saveAssessmentResults,
} from "../../services/assessmentService";

const durabilityLabels = {
  D0: "Declining / avoid recommending",
  D1: "Pressured by AI and automation",
  D2: "Transforming but still viable",
  D3: "Durable with AI adaptation",
  D4: "Future-resilient / AI-native path",
};

const transitionLabels = {
  direct: "Direct path",
  bridge: "Bridge path",
  stretch: "Stretch path",
};

function getOrdinal(rank) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

function formatUsd(value) {
  const number = Number(value);

  if (!number) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatSignal(signalStrength) {
  if (!signalStrength) {
    return "absent";
  }

  return signalStrength.charAt(0).toUpperCase() + signalStrength.slice(1);
}

function CompetencyList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div>
      <p>
        <strong>{title}</strong>
      </p>

      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.competencyId}`}>
            {item.competencyName} — {formatSignal(item.signalStrength)}
            {item.evidence && (
              <span className="helper-text"> · Evidence: “{item.evidence}”</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnchorList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div>
      <p>
        <strong>{title}</strong>
      </p>

      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.anchorId}`}>
            {item.anchorId}: user score {item.userScore}, ideal range{" "}
            {item.idealMin}–{item.idealMax}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreBreakdown({ breakdown }) {
  if (!breakdown) {
    return null;
  }

  return (
    <div>
      <p>
        <strong>Score breakdown</strong>
      </p>

      <ul>
        <li>
          Competency: {breakdown.competency.score} ×{" "}
          {breakdown.competency.weight}% ={" "}
          {breakdown.competency.contribution}
        </li>
        <li>
          Anchor: {breakdown.anchor.score} × {breakdown.anchor.weight}% ={" "}
          {breakdown.anchor.contribution}
        </li>
        <li>
          Financial: {breakdown.financial.score} ×{" "}
          {breakdown.financial.weight}% ={" "}
          {breakdown.financial.contribution}
        </li>
        <li>
          AI durability: {breakdown.durability.score} ×{" "}
          {breakdown.durability.weight}% ={" "}
          {breakdown.durability.contribution}
        </li>
      </ul>
    </div>
  );
}

function TransitionBadge({ transitionLabel }) {
  if (!transitionLabel) {
    return null;
  }

  const styleMap = {
    main: {
      background: "#E8F5E9",
      color: "#2E7D32",
      border: "1px solid #A5D6A7",
    },
    secondary: {
      background: "#FFF8E1",
      color: "#F57F17",
      border: "1px solid #FFE082",
    },
    flagged: {
      background: "#FFF3E0",
      color: "#E65100",
      border: "1px solid #FFCC80",
    },
  };

  const style = styleMap[transitionLabel.treatment] || styleMap.main;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        padding: "4px 10px",
        borderRadius: "6px",
        marginBottom: "8px",
        ...style,
      }}
    >
      <span style={{ fontSize: "12px", fontWeight: 600 }}>
        {transitionLabel.label}
      </span>

      {transitionLabel.sublabel && (
        <span style={{ fontSize: "11px", opacity: 0.8, marginTop: "1px" }}>
          {transitionLabel.sublabel}
        </span>
      )}
    </div>
  );
}

function BridgePathSuggestions({ bridgeDirections, longerPathOptions }) {
  const hasBridges = bridgeDirections?.length > 0;
  const hasLonger = longerPathOptions?.length > 0;

  if (!hasBridges && !hasLonger) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "10px",
        marginBottom: "12px",
        padding: "8px 12px",
        background: "#F8F9FA",
        borderRadius: "6px",
        borderLeft: "3px solid #90A4AE",
      }}
    >
      {hasBridges && (
        <div style={{ marginBottom: hasLonger ? "6px" : 0 }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#546E7A",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Consider first:
          </span>

          <div
            style={{
              marginTop: "4px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {bridgeDirections.map((bridge) => (
              <span
                key={bridge.directionId}
                style={{
                  fontSize: "12px",
                  background: "#ECEFF1",
                  color: "#37474F",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {bridge.directionLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasLonger && (
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#546E7A",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Longer path option:
          </span>

          <div
            style={{
              marginTop: "4px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {longerPathOptions.map((option) => (
              <span
                key={option.directionId}
                style={{
                  fontSize: "12px",
                  background: "#ECEFF1",
                  color: "#37474F",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {option.directionLabel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsStep({ assessmentId }) {
  const [status, setStatus] = useState("loading");
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    async function loadAndGenerateResults() {
      if (!assessmentId || hasGeneratedRef.current) {
        return;
      }

      hasGeneratedRef.current = true;

      try {
        setStatus("loading");
        setErrorMessage("");

        const assessment = await getAssessment(assessmentId);
        const generatedRecommendations = generateRecommendations(assessment);
        const generatedCareerMap = generateCareerMap(
          assessment,
          generatedRecommendations
        );

        await saveAssessmentResults(
          assessmentId,
          generatedRecommendations,
          generatedCareerMap
        );

        setRecommendations(generatedRecommendations);
        setStatus("success");
      } catch (error) {
        console.error("Results generation failed:", error);
        setErrorMessage(
          error.message || "Something went wrong while generating results."
        );
        setStatus("error");
      }
    }

    loadAndGenerateResults();
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <div className="form">
        <h2>Results</h2>
        <p className="status error">
          Missing assessment ID. Please complete the assessment first.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="form">
        <h2>Results</h2>
        <p>Generating your career direction recommendations...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="form">
        <h2>Results</h2>
        <p className="status error">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="form">
      <h2>Your Career Direction Results</h2>

      <p>
        Ortheon compared your career anchors, financial reality, practical
        constraints, CV signals, and priority weights against the current
        direction library.
      </p>

      {recommendations.length === 0 ? (
        <p className="status warning">
          No recommendations could be generated from the current assessment data.
        </p>
      ) : (
        <div className="results-list">
          {recommendations.map((recommendation) => (
            <section key={recommendation.directionId} className="result-card">
              <p className="eyebrow">
                {getOrdinal(recommendation.rank)} direction
              </p>

              <h3>{recommendation.directionLabel}</h3>

              <TransitionBadge transitionLabel={recommendation.transitionLabel} />

              {recommendation.transitionLabel?.showBridges && (
                <BridgePathSuggestions
                  bridgeDirections={recommendation.bridgeDirections}
                  longerPathOptions={recommendation.longerPathOptions}
                />
              )}

              <p>
                <strong>Fit band:</strong> {recommendation.fitBand}
              </p>

              <p>
                <strong>Total score:</strong> {recommendation.scores.total}
              </p>

              <p>
                <strong>AI durability:</strong>{" "}
                {recommendation.aiDurabilityRating} —{" "}
                {durabilityLabels[recommendation.aiDurabilityRating] ||
                  "Not classified"}
              </p>

              <p>
                <strong>Transition pathway:</strong>{" "}
                {transitionLabels[recommendation.transitionPathway] ||
                  recommendation.transitionPathway}
              </p>

              <p>
                <strong>Category:</strong> {recommendation.category}
              </p>

              <p>
                <strong>Context:</strong> {recommendation.context}
              </p>

              <p>
                <strong>Estimated first-year pathway income:</strong>{" "}
                {formatUsd(recommendation.financialPathway?.avg12month)}
              </p>

              {recommendation.salarySources?.[0] && (
                <p>
                  <strong>BLS benchmark:</strong>{" "}
                  {recommendation.salarySources[0].occupationTitle} —{" "}
                  {formatUsd(recommendation.salarySources[0].medianAnnualWage)}{" "}
                  median annual wage
                </p>
              )}

              <p className="helper-text">
                <strong>Source:</strong> {recommendation.salarySource}; updated{" "}
                {recommendation.salaryLastUpdated || "unknown"}.
              </p>

              {recommendation.eligibilityWarning && (
                <p className="status warning">
                  Credential note: {recommendation.eligibilityWarning}
                </p>
              )}

              {recommendation.financialFlag === "financially_constrained" && (
                <p className="status warning">
                  This direction may be financially constrained in the first 12
                  months.
                </p>
              )}

              {recommendation.financialFlag === "financially_risky" && (
                <p className="status warning">
                  This direction may be financially risky based on your stated
                  income floor.
                </p>
              )}

              {recommendation.anchorWarnings?.length > 0 && (
                <p className="status warning">
                  Anchor note: this direction may conflict with your{" "}
                  {recommendation.anchorWarnings.join(", ")} preference.
                </p>
              )}

              {recommendation.cvConfidence === "low" && (
                <p className="status warning">
                  Recommendation confidence is lower because no parsed CV data was
                  available.
                </p>
              )}

              <p>
                <strong>AI evolution path:</strong>{" "}
                {recommendation.d4EvolutionPath}
              </p>

              <details className="debug-details" open>
                <summary>Why this direction appeared</summary>

                <ScoreBreakdown breakdown={recommendation.scoreBreakdown} />

                {recommendation.eligibility?.gateType &&
                  recommendation.eligibility.gateType !== "none" && (
                    <div>
                      <p>
                        <strong>Credential gate</strong>
                      </p>

                      <p>Gate type: {recommendation.eligibility.gateType}</p>

                      <p>
                        {recommendation.eligibility.matchedCredential
                          ? `Matched credential: ${recommendation.eligibility.matchedCredential.type} (${recommendation.eligibility.matchedCredential.status}, ${recommendation.eligibility.matchedCredential.jurisdiction})`
                          : recommendation.eligibility.reason}
                      </p>
                    </div>
                  )}

                <CompetencyList
                  title="Matched required competencies"
                  items={recommendation.matchedRequiredCompetencies}
                />

                <CompetencyList
                  title="Missing required competencies"
                  items={recommendation.missingRequiredCompetencies}
                />

                <CompetencyList
                  title="Matched preferred competencies"
                  items={recommendation.matchedPreferredCompetencies}
                />

                <CompetencyList
                  title="Missing preferred competencies"
                  items={recommendation.missingPreferredCompetencies}
                />

                <AnchorList
                  title="Anchor matches"
                  items={recommendation.anchorMatches}
                />

                <AnchorList
                  title="Anchor conflicts"
                  items={recommendation.anchorConflicts}
                />

                {recommendation.financialExplanation && (
                  <div>
                    <p>
                      <strong>Financial explanation</strong>
                    </p>

                    <p>{recommendation.financialExplanation.explanation}</p>

                    <ul>
                      <li>
                        Income floor:{" "}
                        {formatUsd(
                          recommendation.financialExplanation.annualFloor
                        )}
                      </li>
                      <li>
                        Estimated first-year income:{" "}
                        {formatUsd(
                          recommendation.financialExplanation.avg12month
                        )}
                      </li>
                      <li>
                        Ratio: {recommendation.financialExplanation.ratio}
                      </li>
                      <li>
                        Runway:{" "}
                        {recommendation.financialExplanation.runwayMonths}{" "}
                        months
                      </li>
                      <li>
                        Runway adjustment:{" "}
                        {recommendation.financialExplanation.runwayAdjustment}
                      </li>
                    </ul>
                  </div>
                )}
              </details>
            </section>
          ))}
        </div>
      )}

      <p className="status success">
        Results generated and saved. Assessment ID: {assessmentId}
      </p>
    </div>
  );
}

export default ResultsStep;