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

function CareerAnchorsStep({ assessmentId, onComplete, onBack, values, onValuesChange }) {
  const [anchors, setAnchors] = useState(values ?? initialAnchors);
  const [status, setStatus] = useState("idle");

  function handleSliderChange(id, rawValue) {
    const updated = { ...anchors, [id]: Number(rawValue) };
    setAnchors(updated);
    onValuesChange?.(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!assessmentId) {
      setStatus("missing_assessment");
      return;
    }
    setStatus("saving");
    try {
      await updateAssessmentAnchors(assessmentId, anchors);
      setStatus("success");
      onComplete();
    } catch (err) {
      console.error("Career anchors save failed:", err);
      setStatus("error");
    }
  }

  if (!assessmentId) {
    return (
      <div className="form">
        <p className="status error">
          Missing assessment ID. Please complete the first step first.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ca-step {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          text-align: left;
        }
        .ca-step h2 { margin: 0; }
        .ca-helper {
          font-size: 14px;
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1.55;
        }
        .ca-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--space-3);
        }
        .ca-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: var(--space-4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
        }
        .ca-card-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
        }
        .ca-card-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-text-strong);
          line-height: 1.3;
        }
        .ca-card-score {
          font-size: 13px;
          font-weight: 700;
          color: #155E75;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ca-question {
          font-size: 13px;
          color: var(--color-text);
          line-height: 1.5;
          margin: 0;
        }
        .ca-slider {
          width: 100%;
          accent-color: #155E75;
          cursor: pointer;
          height: 4px;
        }
        .ca-lowhigh {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .ca-lowhigh-item {
          font-size: 11px;
          color: var(--color-text-muted);
          line-height: 1.45;
          padding: 6px 8px;
          background: var(--color-bg-subtle);
          border-radius: var(--radius-sm);
        }
        .ca-lowhigh-item strong {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        @media (max-width: 640px) {
          .ca-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="ca-step">
        {onBack && (
          <button type="button" className="step-back-button" onClick={onBack}>
            ← Back
          </button>
        )}

        <h2>Career Anchors</h2>
        <p className="ca-helper">
          Rate how important each anchor is to you, from 1 (not important) to 10 (essential). These shape which directions are recommended.
        </p>

        <div className="ca-grid">
          {anchorQuestions.map((anchor) => (
            <div key={anchor.id} className="ca-card">
              <div className="ca-card-header">
                <span className="ca-card-name">{anchor.name}</span>
                <span className="ca-card-score">{anchors[anchor.id]} / 10</span>
              </div>
              <p className="ca-question">{anchor.question}</p>
              <input
                type="range"
                className="ca-slider"
                min="1"
                max="10"
                step="1"
                value={anchors[anchor.id]}
                onChange={(e) => handleSliderChange(anchor.id, e.target.value)}
                aria-label={anchor.name}
              />
              <div className="ca-lowhigh">
                <div className="ca-lowhigh-item">
                  <strong>Low</strong>
                  {anchor.low}
                </div>
                <div className="ca-lowhigh-item">
                  <strong>High</strong>
                  {anchor.high}
                </div>
              </div>
            </div>
          ))}
        </div>

        {status === "missing_assessment" && (
          <p className="status error">Missing assessment ID. Please restart the assessment.</p>
        )}
        {status === "error" && (
          <p className="status error">Something went wrong while saving career anchors. Please try again.</p>
        )}

        <div className="action-row">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Saving…" : "Save career anchors"}
          </button>
        </div>
      </form>
    </>
  );
}

export default CareerAnchorsStep;
