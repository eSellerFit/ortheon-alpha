import { useState } from "react";
import CareerDirectionMap from "./CareerDirectionMap";
import { getAssessment } from "../../services/assessmentService";
import {
  generateRecommendations,
  generateCareerMap,
} from "../../utils/scoring";

function CareerMapPreview() {
  const [assessmentId, setAssessmentId] = useState("");
  const [careerMap, setCareerMap] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mapSource, setMapSource] = useState("");

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
      setMapSource("");

      const loadedAssessment = await getAssessment(cleanedId);

      let recommendationsToUse = [];

      if (
        Array.isArray(loadedAssessment.directionRecommendations) &&
        loadedAssessment.directionRecommendations.length > 0
      ) {
        recommendationsToUse = loadedAssessment.directionRecommendations;
      } else {
        recommendationsToUse = generateRecommendations(loadedAssessment);
      }

      let mapToRender = null;

      if (recommendationsToUse.length > 0) {
        mapToRender = generateCareerMap(loadedAssessment, recommendationsToUse);
        setMapSource("Generated locally from assessment data");
      }

      if (!mapToRender && loadedAssessment.careerMap) {
        mapToRender = loadedAssessment.careerMap;
        setMapSource("Loaded saved careerMap from Firebase");
      }

      if (!mapToRender) {
        throw new Error(
          "No careerMap could be generated or loaded for this assessment."
        );
      }

      setAssessment(loadedAssessment);
      setCareerMap(mapToRender);
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
          Load an existing Firebase assessment and preview the career map without
          running the full assessment flow or CV parsing again.
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
          {status === "loading" ? "Loading..." : "Load map"}
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
            <span>Role library</span>
            <strong>{assessment.roleLibraryVersion || "unknown"}</strong>
          </div>

          <div>
            <span>Career map</span>
            <strong>{careerMap?.version || "unknown"}</strong>
          </div>

          <div>
            <span>Map source</span>
            <strong>{mapSource || "unknown"}</strong>
          </div>

          <div>
            <span>Input factors</span>
            <strong>{careerMap?.inputFactors ? "available" : "missing"}</strong>
          </div>
        </div>
      )}

      <CareerDirectionMap careerMap={careerMap} />
    </div>
  );
}

export default CareerMapPreview;