import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function createAssessmentDraft(formData) {
  const payload = {
    firstName: formData.firstName.trim(),
    email: formData.email.trim().toLowerCase(),
    currentRole: formData.currentRole.trim(),
    currentSituation: formData.currentSituation,
    status: "intake_submitted",
    source: "ortheon-alpha-mvp",
    roleLibraryVersion: "v1.0",
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
