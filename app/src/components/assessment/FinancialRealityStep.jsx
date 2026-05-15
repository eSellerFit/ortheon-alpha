import { useState } from "react";
import { updateAssessmentFinancialReality } from "../../services/assessmentService";

const initialFinancialData = {
  currentMonthlyIncome: "",
  minimumMonthlyIncome: "",
  savingsRunwayMonths: "",
  bridgeRoleWillingness: "",
  retrainingInvestmentAbility: "",
};

function FinancialRealityStep({ assessmentId, onComplete, onBack, values, onValuesChange }) {
  const [financialData, setFinancialData] = useState(values ?? initialFinancialData);
  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;
    const updated = { ...financialData, [name]: value };
    setFinancialData(updated);
    onValuesChange?.(updated);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !assessmentId ||
      !financialData.currentMonthlyIncome ||
      !financialData.minimumMonthlyIncome ||
      !financialData.savingsRunwayMonths ||
      !financialData.bridgeRoleWillingness ||
      !financialData.retrainingInvestmentAbility
    ) {
      setStatus("missing_fields");
      return;
    }

    try {
      setStatus("saving");

      await updateAssessmentFinancialReality(assessmentId, financialData);

      setStatus("success");

      onComplete();
    } catch (error) {
      console.error("Financial reality save failed:", error);
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
    <form onSubmit={handleSubmit} className="form">
      {onBack && (
        <button type="button" className="step-back-button" onClick={onBack}>
          ← Back
        </button>
      )}

      <h2>Financial Reality</h2>

      <p>
        This step helps Ortheon understand which career directions are financially realistic,
        not just interesting.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="currentMonthlyIncome">
            Current or recent monthly income
          </label>
          <input
            id="currentMonthlyIncome"
            className="form-input"
            name="currentMonthlyIncome"
            type="number"
            min="0"
            value={financialData.currentMonthlyIncome}
            onChange={handleChange}
            placeholder="7000"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="minimumMonthlyIncome">
            Minimum monthly income needed
          </label>
          <input
            id="minimumMonthlyIncome"
            className="form-input"
            name="minimumMonthlyIncome"
            type="number"
            min="0"
            value={financialData.minimumMonthlyIncome}
            onChange={handleChange}
            placeholder="5000"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="savingsRunwayMonths">
            Savings runway, in months
          </label>
          <input
            id="savingsRunwayMonths"
            className="form-input"
            name="savingsRunwayMonths"
            type="number"
            min="0"
            value={financialData.savingsRunwayMonths}
            onChange={handleChange}
            placeholder="6"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="bridgeRoleWillingness">
            Willingness to use a bridge role
          </label>
          <select
            id="bridgeRoleWillingness"
            className="form-select"
            name="bridgeRoleWillingness"
            value={financialData.bridgeRoleWillingness}
            onChange={handleChange}
          >
            <option value="">Select one</option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe, if it is clearly temporary</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="retrainingInvestmentAbility">
            Ability to invest in retraining or certification
          </label>
          <select
            id="retrainingInvestmentAbility"
            className="form-select"
            name="retrainingInvestmentAbility"
            value={financialData.retrainingInvestmentAbility}
            onChange={handleChange}
          >
            <option value="">Select one</option>
            <option value="none">No budget now</option>
            <option value="limited">Limited budget</option>
            <option value="moderate">Moderate budget</option>
            <option value="strong">Strong ability to invest</option>
          </select>
        </div>
      </div>

      <div className="action-row">
        <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save financial reality"}
        </button>
      </div>

      {status === "missing_fields" && (
        <p className="status warning">Please complete all financial fields.</p>
      )}

      {status === "error" && (
        <p className="status error">
          Something went wrong while saving financial reality.
        </p>
      )}

      {status === "success" && (
        <p className="status success">
          Financial reality saved.
        </p>
      )}
    </form>
  );
}

export default FinancialRealityStep;
