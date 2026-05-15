import { useState } from "react";
import CareerDirectionMap from "./CareerDirectionMap";
import { getAssessment } from "../../services/assessmentService";
import {
  generateCareerMap,
  generateRecommendations,
} from "../../utils/scoring";

const showDebug = false;

function CareerMapPreview() {
  const [assessmentId, setAssessmentId] = useState("");
  const [careerMap, setCareerMap] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLoadMap(event) {
    event.preventDefault();

    const cleanedId = assessmentId.trim();

    if (!cleanedId) {
      setErrorMessage("Please enter an assessment ID.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      setCareerMap(null);
      setAssessment(null);
      setRecommendations([]);

      const loadedAssessment = await getAssessment(cleanedId);

      /*
        IMPORTANT:
        For preview/testing we intentionally ignore:
        - loadedAssessment.careerMap
        - loadedAssessment.directionRecommendations

        Otherwise map-preview keeps showing old Firebase-saved results
        and new scoring.js changes will not be visible.
      */
      const regeneratedRecommendations =
        generateRecommendations(loadedAssessment);

      const regeneratedCareerMap = generateCareerMap(
        loadedAssessment,
        regeneratedRecommendations
      );

      setAssessment(loadedAssessment);
      setRecommendations(regeneratedRecommendations);
      setCareerMap(regeneratedCareerMap);
      setStatus("success");
    } catch (error) {
      console.error("Career map preview failed:", error);
      setErrorMessage(
        error.message || "Something went wrong while loading the career map."
      );
      setStatus("error");
    }
  }

  return (
    <div className="results-page">
      <aside className="preview-controls-panel">
        <p className="preview-controls-label">Internal preview · Career Map Preview</p>

        <form className="preview-controls-form" onSubmit={handleLoadMap}>
          <input
            id="assessmentId"
            type="text"
            value={assessmentId}
            onChange={(event) => setAssessmentId(event.target.value)}
            placeholder="Paste Firebase assessment ID"
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Regenerating…" : "Regenerate"}
          </button>
        </form>

        {status === "error" && (
          <p
            className="status error"
            style={{ fontSize: 12, padding: "6px 10px", margin: 0 }}
          >
            {errorMessage}
          </p>
        )}

        {status === "success" && assessment && (
          <div className="preview-controls-meta">
            <span>
              ID: <strong>{assessment.id}</strong>
            </span>
            <span>
              Status: <strong>{assessment.status || "unknown"}</strong>
            </span>
            <span>
              Source: <strong>Regenerated locally</strong>
            </span>
            <span>
              Version: <strong>{careerMap?.version || "unknown"}</strong>
            </span>
          </div>
        )}
      </aside>

      {showDebug && status === "success" && recommendations.length > 0 && (
        <div
          style={{
            padding: 14,
            border: "1px solid #d8e0e8",
            borderRadius: 12,
            background: "#ffffff",
            fontSize: 12,
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#6b7280" }}>
            Debug: regenerated primary
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.directionId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 90px 120px",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <strong>{recommendation.directionId}</strong>
                <span>{recommendation.directionLabel}</span>
                <span>Score: {recommendation.scores?.total}</span>
                <span>
                  {recommendation.transitionFlags?.join(", ") || "no flags"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <CareerDirectionMap careerMap={careerMap} />
    </div>
  );
}

export default CareerMapPreview;
