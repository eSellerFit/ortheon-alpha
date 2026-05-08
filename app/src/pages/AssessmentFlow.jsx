import { useState } from "react";
import BasicContextStep from "../components/assessment/BasicContextStep";
import CareerAnchorsStep from "../components/assessment/CareerAnchorsStep";
import FinancialRealityStep from "../components/assessment/FinancialRealityStep";

const TOTAL_STEPS = 7;

function AssessmentFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentId, setAssessmentId] = useState("");

  function handleBasicContextComplete({ assessmentId: newAssessmentId }) {
    setAssessmentId(newAssessmentId);
    setCurrentStep(2);
  }

  function handleCareerAnchorsComplete() {
    setCurrentStep(3);
  }

  function handleFinancialRealityComplete() {
    setCurrentStep(4);
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Ortheon Alpha</p>

        <h1>Start your career direction assessment</h1>

        <p className="intro">
          Ortheon captures your career context, anchors, financial reality,
          practical constraints, CV signals, priority weights, and then generates
          direction recommendations.
        </p>

        <p>
          Step {currentStep} of {TOTAL_STEPS}
        </p>

        {currentStep === 1 && (
          <BasicContextStep onComplete={handleBasicContextComplete} />
        )}

        {currentStep === 2 && (
          <CareerAnchorsStep
            assessmentId={assessmentId}
            onComplete={handleCareerAnchorsComplete}
          />
        )}

        {currentStep === 3 && (
          <FinancialRealityStep
            assessmentId={assessmentId}
            onComplete={handleFinancialRealityComplete}
          />
        )}

        {currentStep === 4 && (
          <div className="form">
            <h2>Transition Constraints</h2>
            <p>
              This step is not built yet. The next module will capture practical
              constraints such as location, work authorization, family constraints,
              weekly time available, and retraining willingness.
            </p>
            <p className="status success">
              Financial Reality has been saved. Assessment ID: {assessmentId}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AssessmentFlow;
