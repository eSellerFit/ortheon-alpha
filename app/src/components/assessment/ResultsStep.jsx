import { useEffect, useRef, useState } from "react";
import { generateRecommendations } from "../../utils/scoring";
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

        await saveAssessmentResults(assessmentId, generatedRecommendations);

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
              <p className="eyebrow">{getOrdinal(recommendation.rank)} direction</p>

              <h3>{recommendation.directionLabel}</h3>

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
