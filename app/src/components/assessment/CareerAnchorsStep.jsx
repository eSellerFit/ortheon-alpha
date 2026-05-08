import { useState } from "react";
import { anchorQuestions } from "../../data/anchorQuestions";
import { updateAssessmentAnchors } from "../../services/assessmentService";

const initialAnchors = {
  technical: null,
  management: null,
  autonomy: null,
  security: null,
  impact: null,
  challenge: null,
  workModel: null,
  craft: null,
};

function CareerAnchorsStep({ assessmentId, onComplete }) {
  const [anchorIndex, setAnchorIndex] = useState(0);
  const [anchors, setAnchors] = useState(initialAnchors);
  const [status, setStatus] = useState("idle");

  const currentAnchor = anchorQuestions[anchorIndex];
  const currentScore = anchors[currentAnchor.id];

  function handleAnchorChange(event) {
    setAnchors((previous) => ({
      ...previous,
      [currentAnchor.id]: Number(event.target.value),
    }));
  }

  function goPrevious() {
    setStatus("idle");

    if (anchorIndex > 0) {
      setAnchorIndex((previous) => previous - 1);
    }
  }

  async function goNext() {
    if (currentScore === null) {
      setStatus("missing_anchor");
      return;
    }

    setStatus("idle");

    if (anchorIndex < anchorQuestions.length - 1) {
      setAnchorIndex((previous) => previous + 1);
      return;
    }

    try {
      setStatus("saving");
      await updateAssessmentAnchors(assessmentId, anchors);
      setStatus("success");
      onComplete();
    } catch (error) {
      console.error("Career anchors save failed:", error);
      setStatus("error");
    }
  }

  if (!assessmentId) {
    return (
      <div className="form">
        <p className="status error">
          Missing assessment ID. Please complete Basic Context first.
        </p>
      </div>
    );
  }

  return (
    <div className="form">
      <h2>Career Anchors</h2>

      <p>
        Anchor {anchorIndex + 1} of {anchorQuestions.length}
      </p>

      <h3>{currentAnchor.name}</h3>

      <p>
        <strong>{currentAnchor.question}</strong>
      </p>

      <label>
        Score: {currentScore === null ? "Not selected yet" : currentScore}
        <input
          type="range"
          min="1"
          max="10"
          value={currentScore ?? 5}
          onChange={handleAnchorChange}
        />
      </label>

      <p>
        <strong>Low:</strong> {currentAnchor.low}
      </p>

      <p>
        <strong>High:</strong> {currentAnchor.high}
      </p>

      <div>
        <button type="button" onClick={goPrevious} disabled={anchorIndex === 0}>
          Previous
        </button>

        <button type="button" onClick={goNext} disabled={status === "saving"}>
          {status === "saving"
            ? "Saving..."
            : anchorIndex === anchorQuestions.length - 1
              ? "Save anchors"
              : "Next"}
        </button>
      </div>

      {status === "missing_anchor" && (
        <p className="status warning">
          Please select a score before continuing.
        </p>
      )}

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving career anchors.
        </p>
      )}
    </div>
  );
}

export default CareerAnchorsStep;
