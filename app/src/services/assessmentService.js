import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ROLE_LIBRARY_VERSION = "v2.2";
const SALARY_BENCHMARK_VERSION = "v2.2";
const SCORING_VERSION = "transition-realism-v1.3-hard-domain-gates";
const CAREER_MAP_VERSION = "career-map-v1.3-hard-hr-domain-gate";
const SOURCE = "ortheon-alpha-mvp";

export async function createAssessmentDraft(formData) {
  const payload = {
    firstName: formData.firstName.trim(),
    email: formData.email.trim().toLowerCase(),
    currentRole: formData.currentRole.trim(),
    currentSituation: formData.currentSituation,
    status: "intake_submitted",
    source: SOURCE,
    roleLibraryVersion: ROLE_LIBRARY_VERSION,
    salaryBenchmarkVersion: SALARY_BENCHMARK_VERSION,
    scoringVersion: SCORING_VERSION,
    careerMapVersion: CAREER_MAP_VERSION,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "assessments"), payload);

  return docRef.id;
}

export async function updateAssessmentAnchors(assessmentId, anchorsData) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    anchors: {
      technical: Number(anchorsData.technical),
      management: Number(anchorsData.management),
      autonomy: Number(anchorsData.autonomy),
      security: Number(anchorsData.security),
      impact: Number(anchorsData.impact),
      challenge: Number(anchorsData.challenge),
      workModel: Number(anchorsData.workModel),
      craft: Number(anchorsData.craft),
    },
    status: "anchors_submitted",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function updateAssessmentFinancialReality(assessmentId, formData) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    financialReality: {
      currentMonthlyIncome: Number(formData.currentMonthlyIncome),
      minimumMonthlyIncome: Number(formData.minimumMonthlyIncome),
      savingsRunwayMonths: Number(formData.savingsRunwayMonths),
      bridgeRoleWillingness: formData.bridgeRoleWillingness,
      retrainingInvestmentAbility: formData.retrainingInvestmentAbility,
    },
    status: "financial_reality_submitted",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function updateAssessmentConstraints(assessmentId, formData) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    transitionConstraints: {
      locationConstraint: formData.locationConstraint,
      workAuthorizedUS: formData.workAuthorizedUS,
      visaSponsorshipNeeded: formData.visaSponsorshipNeeded,
      weeklyTimeAvailable: Number(formData.weeklyTimeAvailable),
      retrainingWillingness: formData.retrainingWillingness,
    },
    status: "constraints_submitted",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function updateAssessmentProfessionalCredentials(
  assessmentId,
  formData
) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    professionalCredentials: {
      hasRegulatedCredentials: formData.hasRegulatedCredentials,
      credentials: formData.credentials || [],
    },
    status: "professional_credentials_submitted",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function saveAssessmentRawCVText(
  assessmentId,
  reviewedText,
  options = {}
) {
  const assessmentRef = doc(db, "assessments", assessmentId);
  const cleanedText = reviewedText.trim();

  const payload = {
    cvProfile: {
      cvSource: options.cvSource || "manual_paste",
      rawTextLength: cleanedText.length,
      reviewedText: cleanedText,
      pdfMetadata: options.pdfMetadata || null,
      reviewedAt: serverTimestamp(),
      parsed: false,
      skipped: false,
      confidence: {
        overall: "low",
        competencies: "low",
      },
      competencySignals: [],
      userCorrections: [],
    },
    status: "cv_text_reviewed",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function skipAssessmentCV(assessmentId, reason = "user_skipped") {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    cvProfile: {
      cvSource: "skipped",
      skipped: true,
      skippedAt: serverTimestamp(),
      reason,
      parsed: false,
      confidence: {
        overall: "low",
        competencies: "low",
      },
      competencySignals: [],
      userCorrections: [],
    },
    status: "cv_skipped",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function updateAssessmentCVProfile(
  assessmentId,
  parsedData,
  userCorrections = []
) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const correctedSignals = parsedData.competencySignals.map((signal) => {
    const correction = userCorrections.find(
      (item) => item.competencyId === signal.competencyId
    );

    if (correction) {
      return {
        ...signal,
        signalStrength: correction.correctedStrength,
        userCorrected: true,
      };
    }

    return signal;
  });

  const payload = {
    cvProfile: {
      cvSource: "claude_parsed",
      parsedAt: serverTimestamp(),
      careerSummary: parsedData.careerSummary,
      domainSignals: parsedData.domainSignals,
      senioritySignal: parsedData.senioritySignal,
      entrepreneurialSignals: parsedData.entrepreneurialSignals,
      tradeSignals: parsedData.tradeSignals,
      tenurePattern: parsedData.tenurePattern,
      leadershipScope: parsedData.leadershipScope,
      confidence: parsedData.confidence,
      apiUsage: parsedData.apiUsage || null,
      competencySignals: correctedSignals,
      userCorrections,
    },
    status: "cv_parsed",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function updateAssessmentPriorityWeights(assessmentId, weightsData) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const priorityWeights = {
    competencyFit: Number(weightsData.competencyFit),
    anchorFit: Number(weightsData.anchorFit),
    financialViability: Number(weightsData.financialViability),
    roleDurability: Number(weightsData.roleDurability),
  };

  const priorityWeightsTotal =
    priorityWeights.competencyFit +
    priorityWeights.anchorFit +
    priorityWeights.financialViability +
    priorityWeights.roleDurability;

  const payload = {
    priorityWeights,
    priorityWeightsTotal,
    status: "priority_weights_submitted",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}

export async function getAssessment(assessmentId) {
  const assessmentRef = doc(db, "assessments", assessmentId);
  const assessmentSnap = await getDoc(assessmentRef);

  if (!assessmentSnap.exists()) {
    throw new Error("Assessment not found");
  }

  return {
    id: assessmentSnap.id,
    ...assessmentSnap.data(),
  };
}

export async function saveAssessmentResults(
  assessmentId,
  recommendations,
  careerMap = null
) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    directionRecommendations: recommendations,
    careerMap,
    roleLibraryVersion: ROLE_LIBRARY_VERSION,
    salaryBenchmarkVersion: SALARY_BENCHMARK_VERSION,
    scoringVersion: SCORING_VERSION,
    careerMapVersion: careerMap?.version || CAREER_MAP_VERSION,
    resultsGeneratedAt: serverTimestamp(),
    status: "results_generated",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}