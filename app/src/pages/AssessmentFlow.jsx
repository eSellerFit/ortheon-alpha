import { useState } from "react";
import BasicContextStep from "../components/assessment/BasicContextStep";
import CareerAnchorsStep from "../components/assessment/CareerAnchorsStep";
import FinancialRealityStep from "../components/assessment/FinancialRealityStep";
import TransitionConstraintsStep from "../components/assessment/TransitionConstraintsStep";

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
          <div className="form">
            <h2>CV Upload</h2>
            <p>
              This step is not built yet. The next module will upload a PDF resume,
              extract text, send it to a secure Vercel API route, and create a CV
              profile for user review.
            </p>
            <p className="status success">
              Transition Constraints have been saved. Assessment ID: {assessmentId}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AssessmentFlow;
