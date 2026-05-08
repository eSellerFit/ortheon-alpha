import { useState } from "react";
import { updateAssessmentFinancialReality } from "../../services/assessmentService";

const initialFinancialData = {
  currentMonthlyIncome: "",
  minimumMonthlyIncome: "",
  savingsRunwayMonths: "",
  bridgeRoleWillingness: "",
  retrainingInvestmentAbility: "",
};

function FinancialRealityStep({ assessmentId, onComplete }) {
  const [financialData, setFinancialData] = useState(initialFinancialData);
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
        This step helps Ortheon understand which career directions are financially realistic,
        not just interesting.
      </p>

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
