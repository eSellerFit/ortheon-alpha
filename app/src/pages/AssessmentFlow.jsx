import { useState } from "react";
import BasicContextStep from "../components/assessment/BasicContextStep";
import CareerAnchorsStep from "../components/assessment/CareerAnchorsStep";
import FinancialRealityStep from "../components/assessment/FinancialRealityStep";
import TransitionConstraintsStep from "../components/assessment/TransitionConstraintsStep";
import ProfessionalCredentialsStep from "../components/assessment/ProfessionalCredentialsStep";
import CVUploadStep from "../components/assessment/CVUploadStep";
import PriorityWeightsStep from "../components/assessment/PriorityWeightsStep";
import V31ReportHandoff from "../v31/report/V31ReportHandoff";

const TOTAL_STEPS = 8;

function AssessmentFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentId, setAssessmentId] = useState("");

  // Draft state — persists across Back/Next so forms don't reset
  const [basicDraft, setBasicDraft] = useState(null);
  const [anchorsDraft, setAnchorsDraft] = useState(null);
  const [financialDraft, setFinancialDraft] = useState(null);
  const [constraintsDraft, setConstraintsDraft] = useState(null);
  const [credentialsDraft, setCredentialsDraft] = useState(null);
  const [weightsDraft, setWeightsDraft] = useState(null);
  // CVUploadStep (step 6) draft not lifted — main Back only shows in idle state

  function goBack() {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }

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

  const isFinalStep = currentStep === 8;
  const pageTitle = isFinalStep
    ? "Your assessment is complete"
    : "Start your career direction assessment";
  const pageIntro = isFinalStep
    ? "Thank you for completing the Ortheon Alpha assessment. We're preparing your Career Direction Report based on your profile, constraints, priorities, and transition signals."
    : "Ortheon captures your career context, anchors, financial reality, practical constraints, professional credentials, CV signals, priority weights, and then generates direction recommendations.";

  return (
    <main className="page-shell">
      <a href="/" className="assessment-site-back">← Back to Ortheon</a>

      <section className="card">
        <p className="eyebrow">Ortheon Alpha</p>

        <h1>{pageTitle}</h1>

        <p className="intro">{pageIntro}</p>

        <p>
          Step {currentStep} of {TOTAL_STEPS}
        </p>

        {currentStep === 1 && (
          <BasicContextStep
            values={basicDraft}
            onValuesChange={setBasicDraft}
            onComplete={handleBasicContextComplete}
          />
        )}

        {currentStep === 2 && (
          <CareerAnchorsStep
            assessmentId={assessmentId}
            values={anchorsDraft}
            onValuesChange={setAnchorsDraft}
            onComplete={handleCareerAnchorsComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 3 && (
          <FinancialRealityStep
            assessmentId={assessmentId}
            values={financialDraft}
            onValuesChange={setFinancialDraft}
            onComplete={handleFinancialRealityComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 4 && (
          <TransitionConstraintsStep
            assessmentId={assessmentId}
            values={constraintsDraft}
            onValuesChange={setConstraintsDraft}
            onComplete={handleTransitionConstraintsComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 5 && (
          <ProfessionalCredentialsStep
            assessmentId={assessmentId}
            values={credentialsDraft}
            onValuesChange={setCredentialsDraft}
            onComplete={handleProfessionalCredentialsComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 6 && (
          <CVUploadStep
            assessmentId={assessmentId}
            onComplete={handleCVUploadComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 7 && (
          <PriorityWeightsStep
            assessmentId={assessmentId}
            values={weightsDraft}
            onValuesChange={setWeightsDraft}
            onComplete={handlePriorityWeightsComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 8 && <V31ReportHandoff assessmentId={assessmentId} />}
      </section>
    </main>
  );
}

export default AssessmentFlow;
