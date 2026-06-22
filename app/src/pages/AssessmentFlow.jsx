import { useEffect, useState } from "react";
import StartScreen from "../components/assessment/StartScreen";
import BasicContextStep from "../components/assessment/BasicContextStep";
import CareerAnchorsStep from "../components/assessment/CareerAnchorsStep";
import FinancialRealityStep from "../components/assessment/FinancialRealityStep";
import TransitionConstraintsStep from "../components/assessment/TransitionConstraintsStep";
import ProfessionalCredentialsStep from "../components/assessment/ProfessionalCredentialsStep";
import CVUploadStep from "../components/assessment/CVUploadStep";
import PriorityWeightsStep from "../components/assessment/PriorityWeightsStep";
import V31ReportHandoff from "../v31/report/V31ReportHandoff";
import { logEvent, updateAssessmentAnalytics, getSessionId } from "../utils/analyticsService";
import { captureAttribution, getAttribution } from "../utils/attributionService";
import { createAnonymousAssessment } from "../services/assessmentService";

const TOTAL_STEPS = 8;

const STEP_NAMES = {
  0: "start_screen",
  1: "basic_context",
  2: "career_anchors",
  3: "financial_reality",
  4: "transition_constraints",
  5: "professional_credentials",
  6: "cv_upload",
  7: "priority_weights",
  8: "report_handoff",
};

function AssessmentFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentId, setAssessmentId] = useState("");
  const [startStatus, setStartStatus] = useState("idle"); // idle | creating | error

  // Draft state — persists across Back/Next so forms don't reset
  const [basicDraft, setBasicDraft] = useState(null);
  const [anchorsDraft, setAnchorsDraft] = useState(null);
  const [financialDraft, setFinancialDraft] = useState(null);
  const [constraintsDraft, setConstraintsDraft] = useState(null);
  const [credentialsDraft, setCredentialsDraft] = useState(null);
  const [weightsDraft, setWeightsDraft] = useState(null);

  // Capture attribution on mount, fire page view
  useEffect(() => {
    captureAttribution();
    logEvent("assessment_page_viewed");
  }, []);

  // assessment_step_viewed on steps 2+ (step 0 = page_viewed on mount, step 1 fires on start click)
  useEffect(() => {
    if (currentStep <= 1) return;
    logEvent("assessment_step_viewed", {
      assessmentId: assessmentId || undefined,
      stepId: currentStep,
      stepName: STEP_NAMES[currentStep],
    });
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  function goBack() {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }

  async function handleStartClick() {
    setStartStatus("creating");
    try {
      const attr = getAttribution();
      const newAssessmentId = await createAnonymousAssessment({
        utmSource: attr.source,
        utmMedium: attr.medium,
        utmCampaign: attr.campaign,
      });
      logEvent("assessment_started", { assessmentId: newAssessmentId, stepId: 0, stepName: STEP_NAMES[0] });
      updateAssessmentAnalytics(newAssessmentId, {
        sessionId: getSessionId(),
        startedAt: new Date().toISOString(),
        lastStep: STEP_NAMES[0],
      });
      setAssessmentId(newAssessmentId);
      setStartStatus("idle");
      setCurrentStep(1);
    } catch (err) {
      console.error("[AssessmentFlow] Failed to create anonymous assessment:", err?.message);
      setStartStatus("error");
    }
  }

  function handleBasicContextComplete() {
    logEvent("assessment_step_completed", {
      assessmentId,
      stepId: 1,
      stepName: STEP_NAMES[1],
    });
    updateAssessmentAnalytics(assessmentId, { lastStep: STEP_NAMES[1] });
    setCurrentStep(2);
  }

  function handleCareerAnchorsComplete() {
    logEvent("assessment_step_completed", { assessmentId, stepId: 2, stepName: STEP_NAMES[2] });
    updateAssessmentAnalytics(assessmentId, { lastStep: STEP_NAMES[2] });
    setCurrentStep(3);
  }

  function handleFinancialRealityComplete() {
    logEvent("assessment_step_completed", { assessmentId, stepId: 3, stepName: STEP_NAMES[3] });
    updateAssessmentAnalytics(assessmentId, { lastStep: STEP_NAMES[3] });
    setCurrentStep(4);
  }

  function handleTransitionConstraintsComplete() {
    logEvent("assessment_step_completed", { assessmentId, stepId: 4, stepName: STEP_NAMES[4] });
    updateAssessmentAnalytics(assessmentId, { lastStep: STEP_NAMES[4] });
    setCurrentStep(5);
  }

  function handleProfessionalCredentialsComplete() {
    logEvent("assessment_step_completed", { assessmentId, stepId: 5, stepName: STEP_NAMES[5] });
    updateAssessmentAnalytics(assessmentId, { lastStep: STEP_NAMES[5] });
    setCurrentStep(6);
  }

  function handleCVUploadComplete() {
    logEvent("assessment_step_completed", { assessmentId, stepId: 6, stepName: STEP_NAMES[6] });
    updateAssessmentAnalytics(assessmentId, { lastStep: STEP_NAMES[6] });
    setCurrentStep(7);
  }

  async function handlePriorityWeightsComplete() {
    logEvent("assessment_step_completed", { assessmentId, stepId: 7, stepName: STEP_NAMES[7] });
    logEvent("assessment_submitted", { assessmentId });
    logEvent("report_generation_started", { assessmentId });
    updateAssessmentAnalytics(assessmentId, {
      lastStep: STEP_NAMES[7],
      completedAt: new Date().toISOString(),
    });

    try {
      await fetch("/api/v31-generation-advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, action: "start-qstash" }),
      });
    } catch (err) {
      console.warn("[AssessmentFlow] QStash start failed (non-fatal):", err?.message);
    }
    setCurrentStep(8);
  }

  const isFinalStep = currentStep === 8;
  const pageTitle = isFinalStep
    ? "Your assessment is complete"
    : "Career direction assessment";
  const pageIntro = isFinalStep
    ? "Thank you for completing the Ortheon Alpha assessment. We're preparing your Career Direction Report based on your profile, constraints, priorities, and transition signals."
    : "Ortheon captures your career context, anchors, financial reality, practical constraints, professional credentials, CV signals, priority weights, and then generates direction recommendations.";

  return (
    <main className="page-shell">
      <a href="/" className="assessment-site-back">← Back to Ortheon</a>

      <section className="card">
        <p className="eyebrow">Ortheon Alpha</p>

        {/* Step 0: Start screen — no outer header */}
        {currentStep === 0 && (
          <StartScreen onStart={handleStartClick} status={startStatus} />
        )}

        {/* Steps 2–8: outer header + step counter */}
        {currentStep > 1 && (
          <>
            <h1>{pageTitle}</h1>
            <p className="intro">{pageIntro}</p>
            <p>Step {currentStep} of {TOTAL_STEPS}</p>
          </>
        )}

        {currentStep === 1 && (
          <BasicContextStep
            assessmentId={assessmentId}
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
