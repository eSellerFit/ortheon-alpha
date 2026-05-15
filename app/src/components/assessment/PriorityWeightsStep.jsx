import { useState } from "react";
import { priorityWeightsConfig } from "../../data/priorityWeightsConfig";
import { updateAssessmentPriorityWeights } from "../../services/assessmentService";

const initialWeights = priorityWeightsConfig.reduce((accumulator, item) => {
  accumulator[item.id] = item.defaultValue;
  return accumulator;
}, {});

function PriorityWeightsStep({ assessmentId, onComplete, onBack, values, onValuesChange }) {
  const [weights, setWeights] = useState(values ?? initialWeights);
  const [status, setStatus] = useState("idle");

  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + Number(value),
    0
  );

  const financialWeight = Number(weights.financialViability);
  const isTotalValid = totalWeight === 100;
  const isFinancialBelowRecommended = financialWeight < 10;
  const canContinue = isTotalValid && !isFinancialBelowRecommended;

  function handleWeightChange(weightId, value) {
    setStatus("idle");

    const updated = { ...weights, [weightId]: Number(value) };
    setWeights(updated);
    onValuesChange?.(updated);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!assessmentId) {
      setStatus("missing_assessment");
      return;
    }

    if (!isTotalValid) {
      setStatus("invalid_total");
      return;
    }

    if (isFinancialBelowRecommended) {
      setStatus("financial_below_minimum");
      return;
    }

    try {
      setStatus("saving");

      await updateAssessmentPriorityWeights(assessmentId, weights);

      setStatus("success");
      onComplete();
    } catch (error) {
      console.error("Priority weights save failed:", error);
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
    <form onSubmit={handleSubmit} className="weights-step">
      {onBack && (
        <button type="button" className="step-back-button" onClick={onBack}>
          ← Back
        </button>
      )}

      <h2>Priority Weights</h2>

      <p className="helper-text">
        Set how much each dimension should influence your career direction
        recommendation. Total must equal 100.
      </p>

      <p className={isTotalValid ? "status success" : "status warning"}>
        Total: <strong>{totalWeight}</strong> / 100
      </p>

      <div className="weights-grid">
        {priorityWeightsConfig.map((item) => (
          <div key={item.id} className="weight-control">
            <label>
              <strong>{item.label}</strong>: {weights[item.id]}%
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights[item.id]}
                onChange={(event) =>
                  handleWeightChange(item.id, event.target.value)
                }
              />
            </label>

            <p className="helper-text">{item.description}</p>

            {item.id === "financialViability" &&
              isFinancialBelowRecommended && (
                <p className="status warning">
                  Financial Viability should be at least 10%.
                </p>
              )}
          </div>
        ))}
      </div>

      {!isTotalValid && (
        <p className="status warning">
          Adjust the weights so the total equals exactly 100.
        </p>
      )}

      {status === "missing_assessment" && (
        <p className="status error">
          Missing assessment ID. Please restart the assessment.
        </p>
      )}

      {status === "invalid_total" && (
        <p className="status warning">
          Total weight must equal exactly 100 before continuing.
        </p>
      )}

      {status === "financial_below_minimum" && (
        <p className="status warning">
          Financial Viability must be at least 10 before continuing.
        </p>
      )}

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving priority weights.
        </p>
      )}

      <div className="action-row">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "saving" || !canContinue}
        >
          {status === "saving" ? "Saving..." : "Save priority weights"}
        </button>
      </div>
    </form>
  );
}

export default PriorityWeightsStep;
