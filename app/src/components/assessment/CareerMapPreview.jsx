import { useState } from "react";
import CareerDirectionMap from "./CareerDirectionMap";
import { getAssessment } from "../../services/assessmentService";
import {
  generateCareerMap,
  generateRecommendations,
} from "../../utils/scoring";

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
      <div className="results-hero">
        <p className="eyebrow">Internal preview</p>
        <h2>Career Map Preview</h2>
        <p>
          Load an existing Firebase assessment and regenerate the career map
          locally from the current scoring logic, without running the full
          assessment flow again.
        </p>
      </div>

      <form className="map-preview-form" onSubmit={handleLoadMap}>
        <label htmlFor="assessmentId">
          Assessment ID
          <input
            id="assessmentId"
            type="text"
            value={assessmentId}
            onChange={(event) => setAssessmentId(event.target.value)}
            placeholder="Paste Firebase assessment ID"
          />
        </label>

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Regenerating..." : "Regenerate map"}
        </button>
      </form>

      {status === "error" && (
        <p className="status error map-preview-status">{errorMessage}</p>
      )}

      {status === "success" && assessment && (
        <div className="map-preview-meta">
          <div>
            <span>Assessment ID</span>
            <strong>{assessment.id}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{assessment.status || "unknown"}</strong>
          </div>

          <div>
            <span>Preview source</span>
            <strong>Regenerated locally</strong>
          </div>

          <div>
            <span>Career map</span>
            <strong>{careerMap?.version || "unknown"}</strong>
          </div>
        </div>
      )}

      {status === "success" && recommendations.length > 0 && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            border: "1px solid #d8e0e8",
            borderRadius: 16,
            background: "#ffffff",
          }}
        >
          <h4 style={{ margin: "0 0 10px" }}>Debug: regenerated primary</h4>

          <div style={{ display: "grid", gap: 8 }}>
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.directionId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 90px 120px",
                  gap: 10,
                  alignItems: "center",
                  fontSize: 13,
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