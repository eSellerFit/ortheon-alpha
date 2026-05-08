import { useState } from "react";
import BasicContextStep from "../components/assessment/BasicContextStep";
import CareerAnchorsStep from "../components/assessment/CareerAnchorsStep";
import FinancialRealityStep from "../components/assessment/FinancialRealityStep";
import TransitionConstraintsStep from "../components/assessment/TransitionConstraintsStep";
import CVUploadStep from "../components/assessment/CVUploadStep";

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

  function handleTransitionConstraintsComplete() {
    setCurrentStep(5);
  }

  function handleCVUploadComplete() {
    setCurrentStep(6);
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
          <TransitionConstraintsStep
            assessmentId={assessmentId}
            onComplete={handleTransitionConstraintsComplete}
          />
        )}

        {currentStep === 5 && (
          <CVUploadStep
            assessmentId={assessmentId}
            onComplete={handleCVUploadComplete}
          />
        )}

        {currentStep === 6 && (
          <div className="form">
            <h2>Priority Weights</h2>
            <p>
              This step is not built yet. It will let the user set how much
              competency fit, anchor fit, financial viability, and AI durability
              should influence the final recommendation.
            </p>
            <p className="status success">
              CV step completed. Assessment ID: {assessmentId}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AssessmentFlow;
