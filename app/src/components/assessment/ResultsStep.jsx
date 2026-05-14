import { useEffect, useRef, useState } from "react";
import CareerDirectionMap from "./CareerDirectionMap";
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
    <div className="result-detail-block">
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
    <div className="result-detail-block">
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
    <div className="score-breakdown-grid">
      <div>
        <span>Competency</span>
        <strong>{breakdown.competency.score}</strong>
        <small>{breakdown.competency.weight}% weight</small>
      </div>

      <div>
        <span>Anchor</span>
        <strong>{breakdown.anchor.score}</strong>
        <small>{breakdown.anchor.weight}% weight</small>
      </div>

      <div>
        <span>Financial</span>
        <strong>{breakdown.financial.score}</strong>
        <small>{breakdown.financial.weight}% weight</small>
      </div>

      <div>
        <span>AI durability</span>
        <strong>{breakdown.durability.score}</strong>
        <small>{breakdown.durability.weight}% weight</small>
      </div>
    </div>
  );
}

function TransitionBadge({ transitionLabel }) {
  if (!transitionLabel) {
    return null;
  }

  const classMap = {
    main: "transition-badge-main",
    secondary: "transition-badge-secondary",
    flagged: "transition-badge-flagged",
  };

  const className = classMap[transitionLabel.treatment] || classMap.main;

  return (
    <div className={`transition-badge ${className}`}>
      <span>{transitionLabel.label}</span>

      {transitionLabel.sublabel && <small>{transitionLabel.sublabel}</small>}
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
    <div className="bridge-suggestions">
      {hasBridges && (
        <div>
          <span className="bridge-label">Consider first</span>

          <div className="bridge-chip-row">
            {bridgeDirections.map((bridge) => (
              <span key={bridge.directionId} className="bridge-chip">
                {bridge.directionLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasLonger && (
        <div>
          <span className="bridge-label">Longer path option</span>

          <div className="bridge-chip-row">
            {longerPathOptions.map((option) => (
              <span key={option.directionId} className="bridge-chip">
                {option.directionLabel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ recommendation }) {
  return (
    <section className="result-card">
      <div className="result-card-header">
        <div>
          <p className="eyebrow">{getOrdinal(recommendation.rank)} direction</p>
          <h3>{recommendation.directionLabel}</h3>
        </div>

        <div className="result-score">
          <span>Total score</span>
          <strong>{recommendation.scores.total}</strong>
        </div>
      </div>

      <TransitionBadge transitionLabel={recommendation.transitionLabel} />

      {recommendation.transitionLabel?.showBridges && (
        <BridgePathSuggestions
          bridgeDirections={recommendation.bridgeDirections}
          longerPathOptions={recommendation.longerPathOptions}
        />
      )}

      <div className="result-facts-grid">
        <div>
          <span>Fit band</span>
          <strong>{recommendation.fitBand}</strong>
        </div>

        <div>
          <span>AI durability</span>
          <strong>
            {recommendation.aiDurabilityRating} —{" "}
            {durabilityLabels[recommendation.aiDurabilityRating] ||
              "Not classified"}
          </strong>
        </div>

        <div>
          <span>Transition pathway</span>
          <strong>
            {transitionLabels[recommendation.transitionPathway] ||
              recommendation.transitionPathway}
          </strong>
        </div>

        <div>
          <span>Estimated first-year income</span>
          <strong>{formatUsd(recommendation.financialPathway?.avg12month)}</strong>
        </div>

        <div>
          <span>Category</span>
          <strong>{recommendation.category}</strong>
        </div>

        <div>
          <span>Context</span>
          <strong>{recommendation.context}</strong>
        </div>
      </div>

      {recommendation.salarySources?.[0] && (
        <p className="helper-text">
          BLS benchmark: {recommendation.salarySources[0].occupationTitle} —{" "}
          {formatUsd(recommendation.salarySources[0].medianAnnualWage)} median
          annual wage. Source: {recommendation.salarySource}; updated{" "}
          {recommendation.salaryLastUpdated || "unknown"}.
        </p>
      )}

      {recommendation.eligibilityWarning && (
        <p className="status warning">
          Credential note: {recommendation.eligibilityWarning}
        </p>
      )}

      {recommendation.financialFlag === "financially_constrained" && (
        <p className="status warning">
          This direction may be financially constrained in the first 12 months.
        </p>
      )}

      {recommendation.financialFlag === "financially_risky" && (
        <p className="status warning">
          This direction may be financially risky based on your stated income
          floor.
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

      {recommendation.d4EvolutionPath && (
        <p className="ai-evolution">
          <strong>AI evolution path:</strong> {recommendation.d4EvolutionPath}
        </p>
      )}

      <details className="debug-details">
        <summary>Why this direction appeared</summary>

        <ScoreBreakdown breakdown={recommendation.scoreBreakdown} />

        {recommendation.eligibility?.gateType &&
          recommendation.eligibility.gateType !== "none" && (
            <div className="result-detail-block">
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
          <div className="result-detail-block">
            <p>
              <strong>Financial explanation</strong>
            </p>

            <p>{recommendation.financialExplanation.explanation}</p>

            <ul>
              <li>
                Income floor:{" "}
                {formatUsd(recommendation.financialExplanation.annualFloor)}
              </li>
              <li>
                Estimated first-year income:{" "}
                {formatUsd(recommendation.financialExplanation.avg12month)}
              </li>
              <li>Ratio: {recommendation.financialExplanation.ratio}</li>
              <li>
                Runway: {recommendation.financialExplanation.runwayMonths}{" "}
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
  );
}

function ResultsStep({ assessmentId }) {
  const [status, setStatus] = useState("loading");
  const [recommendations, setRecommendations] = useState([]);
  const [careerMap, setCareerMap] = useState(null);
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
        setCareerMap(generatedCareerMap);
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
      <div className="results-page">
        <h2>Results</h2>
        <p className="status error">
          Missing assessment ID. Please complete the assessment first.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="results-page">
        <h2>Results</h2>
        <p>Generating your career direction recommendations...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="results-page">
        <h2>Results</h2>
        <p className="status error">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-hero">
        <p className="eyebrow">Step 8 of 8</p>
        <h2>Your Career Direction Results</h2>
        <p>
          Ortheon compared your career anchors, financial reality, practical
          constraints, CV signals, and priority weights against the current
          direction library.
        </p>
      </div>

      <CareerDirectionMap careerMap={careerMap} />

      {recommendations.length === 0 ? (
        <p className="status warning">
          No recommendations could be generated from the current assessment data.
        </p>
      ) : (
        <div className="results-list">
          {recommendations.map((recommendation) => (
            <ResultCard
              key={recommendation.directionId}
              recommendation={recommendation}
            />
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