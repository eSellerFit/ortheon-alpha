import { useState } from "react";
import { anchorQuestions } from "../../data/anchorQuestions";
import { updateAssessmentAnchors } from "../../services/assessmentService";

const initialAnchors = {
  technical: 5,
  management: 5,
  autonomy: 5,
  security: 5,
  impact: 5,
  challenge: 5,
  workModel: 5,
  craft: 5,
};

const scoreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function CareerAnchorsStep({ assessmentId, onComplete }) {
  const [anchorIndex, setAnchorIndex] = useState(0);
  const [anchors, setAnchors] = useState(initialAnchors);
  const [status, setStatus] = useState("idle");

  const currentAnchor = anchorQuestions[anchorIndex];
  const currentScore = anchors[currentAnchor.id];

  function handleScoreSelect(score) {
    setAnchors((previous) => ({
      ...previous,
      [currentAnchor.id]: score,
    }));
  }

  function goPrevious() {
    setStatus("idle");

    if (anchorIndex > 0) {
      setAnchorIndex((previous) => previous - 1);
    }
  }

  async function goNext() {
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

      <p className="score-summary">
        Selected score: <strong>{currentScore}</strong> / 10
      </p>

      <div className="anchor-score-scale" role="radiogroup" aria-label={currentAnchor.name}>
        {scoreOptions.map((score) => (
          <button
            key={score}
            type="button"
            className={
              score === currentScore
                ? "anchor-score-option selected"
                : "anchor-score-option"
            }
            onClick={() => handleScoreSelect(score)}
            aria-pressed={score === currentScore}
          >
            <span className="score-circle">
              {score === currentScore ? "●" : "○"}
            </span>
            <span className="score-number">{score}</span>
          </button>
        ))}
      </div>

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

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving career anchors.
        </p>
      )}
    </div>
  );
}

export default CareerAnchorsStep;
