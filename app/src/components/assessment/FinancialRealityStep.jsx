import { useState } from "react";
import { updateAssessmentFinancialReality } from "../../services/assessmentService";

const initialFinancialData = {
  currentMonthlyIncome: "",
  minimumMonthlyIncome: "",
  savingsRunwayMonths: "",
  riskTolerance: "",
  incomeDropTolerance: "",
  stableIncomeNeed: "",
  bridgeRoleWillingness: "",
  retrainingInvestmentAbility: "",
};

function FinancialRealityStep({ assessmentId, initialMinimumMonthlyIncome, onComplete }) {
  const [financialData, setFinancialData] = useState({
    ...initialFinancialData,
    minimumMonthlyIncome: initialMinimumMonthlyIncome || "",
  });

  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;

    setFinancialData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !assessmentId ||
      !financialData.currentMonthlyIncome ||
      !financialData.minimumMonthlyIncome ||
      !financialData.savingsRunwayMonths ||
      !financialData.riskTolerance ||
      !financialData.incomeDropTolerance ||
      !financialData.stableIncomeNeed ||
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
      <h2>Financial Reality</h2>

      <p>
        Assessment ID: {assessmentId}
      </p>

      <label>
        Current or recent monthly income
        <input
          name="currentMonthlyIncome"
          type="number"
          min="0"
          value={financialData.currentMonthlyIncome}
          onChange={handleChange}
          placeholder="7000"
        />
      </label>

      <label>
        Minimum monthly income needed
        <input
          name="minimumMonthlyIncome"
          type="number"
          min="0"
          value={financialData.minimumMonthlyIncome}
          onChange={handleChange}
          placeholder="5000"
        />
      </label>

      <label>
        Savings runway, in months
        <input
          name="savingsRunwayMonths"
          type="number"
          min="0"
          value={financialData.savingsRunwayMonths}
          onChange={handleChange}
          placeholder="6"
        />
      </label>

      <label>
        General risk tolerance
        <select
          name="riskTolerance"
          value={financialData.riskTolerance}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label>
        Tolerance for temporary income drop
        <select
          name="incomeDropTolerance"
          value={financialData.incomeDropTolerance}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="none">No income drop possible</option>
          <option value="small">Small drop acceptable</option>
          <option value="moderate">Moderate drop acceptable</option>
          <option value="high">High drop acceptable if direction is right</option>
        </select>
      </label>

      <label>
        Need for stable income
        <select
          name="stableIncomeNeed"
          value={financialData.stableIncomeNeed}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="very_high">Very high</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <label>
        Willingness to use a bridge role
        <select
          name="bridgeRoleWillingness"
          value={financialData.bridgeRoleWillingness}
          onChange={handleChange}
        >
          <option value="">Select one</option>
          <option value="yes">Yes</option>
          <option value="maybe">Maybe, if it is clearly temporary</option>
          <option value="no">No</option>
        </select>
      </label>

      <label>
        Ability to invest in retraining or certification
        <select
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
      </label>

      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save financial reality"}
      </button>

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
