import { useState } from "react";
import BasicContextStep from "../components/assessment/BasicContextStep";
import CareerAnchorsStep from "../components/assessment/CareerAnchorsStep";
import FinancialRealityStep from "../components/assessment/FinancialRealityStep";
import TransitionConstraintsStep from "../components/assessment/TransitionConstraintsStep";
import ProfessionalCredentialsStep from "../components/assessment/ProfessionalCredentialsStep";
import CVUploadStep from "../components/assessment/CVUploadStep";
import PriorityWeightsStep from "../components/assessment/PriorityWeightsStep";
import ResultsStep from "../components/assessment/ResultsStep";

const TOTAL_STEPS = 8;

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

  function handleProfessionalCredentialsComplete() {
    setCurrentStep(6);
  }

  function handleCVUploadComplete() {
    setCurrentStep(7);
  }

  function handlePriorityWeightsComplete() {
    setCurrentStep(8);
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Ortheon Alpha</p>

        <h1>Start your career direction assessment</h1>

        <p className="intro">
          Ortheon captures your career context, anchors, financial reality,
          practical constraints, professional credentials, CV signals, priority
          weights, and then generates direction recommendations.
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
          <ProfessionalCredentialsStep
            assessmentId={assessmentId}
            onComplete={handleProfessionalCredentialsComplete}
          />
        )}

        {currentStep === 6 && (
          <CVUploadStep
            assessmentId={assessmentId}
            onComplete={handleCVUploadComplete}
          />
        )}

        {currentStep === 7 && (
          <PriorityWeightsStep
            assessmentId={assessmentId}
            onComplete={handlePriorityWeightsComplete}
          />
        )}

        {currentStep === 8 && <ResultsStep assessmentId={assessmentId} />}
      </section>
    </main>
  );
}

export default AssessmentFlow;
