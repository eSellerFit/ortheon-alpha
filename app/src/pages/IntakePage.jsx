import { useState } from "react";
import {
  createAssessmentDraft,
  updateAssessmentFinancialReality,
} from "../services/assessmentService";

const initialBasicData = {
  firstName: "",
  email: "",
  currentRole: "",
  currentSituation: "",
  minimumMonthlyIncome: "",
};

const initialFinancialData = {
  currentMonthlyIncome: "",
  minimumMonthlyIncome: "",
  savingsRunwayMonths: "",
  incomeDropTolerance: "",
  stableIncomeNeed: "",
  bridgeRoleWillingness: "",
  retrainingInvestmentAbility: "",
};

function IntakePage() {
  const [step, setStep] = useState(1);
  const [basicData, setBasicData] = useState(initialBasicData);
  const [financialData, setFinancialData] = useState(initialFinancialData);
  const [status, setStatus] = useState("idle");
  const [assessmentId, setAssessmentId] = useState("");

  function handleBasicChange(event) {
    const { name, value } = event.target;

    setBasicData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "minimumMonthlyIncome") {
      setFinancialData((previous) => ({
        ...previous,
        minimumMonthlyIncome: value,
      }));
    }
  }

  function handleFinancialChange(event) {
    const { name, value } = event.target;

    setFinancialData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleBasicSubmit(event) {
    event.preventDefault();

    if (
      !basicData.firstName ||
      !basicData.email ||
      !basicData.currentRole ||
      !basicData.currentSituation ||
      !basicData.minimumMonthlyIncome
    ) {
      setStatus("missing_basic_fields");
      return;
    }

    try {
      setStatus("saving_basic");
      const newAssessmentId = await createAssessmentDraft(basicData);
      setAssessmentId(newAssessmentId);
      setStep(2);
      setStatus("basic_saved");
    } catch (error) {
      console.error("Basic intake save failed:", error);
      setStatus("error");
    }
  }

  async function handleFinancialSubmit(event) {
    event.preventDefault();

    if (
      !financialData.currentMonthlyIncome ||
      !financialData.minimumMonthlyIncome ||
      !financialData.savingsRunwayMonths ||
      !financialData.incomeDropTolerance ||
      !financialData.stableIncomeNeed ||
      !financialData.bridgeRoleWillingness ||
      !financialData.retrainingInvestmentAbility
    ) {
      setStatus("missing_financial_fields");
      return;
    }

    try {
      setStatus("saving_financial");
      await updateAssessmentFinancialReality(assessmentId, financialData);
      setStatus("financial_saved");
    } catch (error) {
      console.error("Financial reality save failed:", error);
      setStatus("error");
    }
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Ortheon Alpha</p>

        <h1>Start your career direction assessment</h1>

        <p className="intro">
          This first step captures basic context before we move into career anchors,
          CV analysis, financial reality, and direction scoring.
        </p>

        <p>
          Step {step} of 2
        </p>

        {step === 1 && (
          <form onSubmit={handleBasicSubmit} className="form">
            <label>
              First name
              <input
                name="firstName"
                value={basicData.firstName}
                onChange={handleBasicChange}
                placeholder="Name"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={basicData.email}
                onChange={handleBasicChange}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Current or most recent role
              <input
                name="currentRole"
                value={basicData.currentRole}
                onChange={handleBasicChange}
                placeholder="Role"
              />
            </label>

            <label>
              Current situation
              <select
                name="currentSituation"
                value={basicData.currentSituation}
                onChange={handleBasicChange}
              >
                <option value="">Select one</option>
                <option value="employed_exploring">Employed, but exploring options</option>
                <option value="recently_laid_off">Recently laid off / in transition</option>
                <option value="career_change">Considering a career change</option>
                <option value="returning_to_work">Returning to work</option>
                <option value="building_portfolio">Building portfolio / independent path</option>
              </select>
            </label>

            <label>
              Minimum monthly income needed
              <input
                name="minimumMonthlyIncome"
                type="number"
                min="0"
                value={basicData.minimumMonthlyIncome}
                onChange={handleBasicChange}
                placeholder="5000"
              />
            </label>

            <button type="submit" disabled={status === "saving_basic"}>
              {status === "saving_basic" ? "Saving..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleFinancialSubmit} className="form">
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
                onChange={handleFinancialChange}
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
                onChange={handleFinancialChange}
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
                onChange={handleFinancialChange}
                placeholder="6"
              />
            </label>

            <label>
              Tolerance for temporary income drop
              <select
                name="incomeDropTolerance"
                value={financialData.incomeDropTolerance}
                onChange={handleFinancialChange}
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
                onChange={handleFinancialChange}
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
                onChange={handleFinancialChange}
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
                onChange={handleFinancialChange}
              >
                <option value="">Select one</option>
                <option value="none">No budget now</option>
                <option value="limited">Limited budget</option>
                <option value="moderate">Moderate budget</option>
                <option value="strong">Strong ability to invest</option>
              </select>
            </label>

            <button type="submit" disabled={status === "saving_financial"}>
              {status === "saving_financial" ? "Saving..." : "Save financial reality"}
            </button>
          </form>
        )}

        {status === "missing_basic_fields" && (
          <p className="status warning">Please complete all basic fields.</p>
        )}

        {status === "missing_financial_fields" && (
          <p className="status warning">Please complete all financial fields.</p>
        )}

        {status === "basic_saved" && (
          <p className="status success">
            Basic intake saved. Continue to financial reality.
          </p>
        )}

        {status === "financial_saved" && (
          <p className="status success">
            Financial reality saved. Assessment ID: {assessmentId}
          </p>
        )}

        {status === "error" && (
          <p className="status error">
            Something went wrong while saving. Check the console and Firestore rules.
          </p>
        )}
      </section>
    </main>
  );
}

export default IntakePage;
