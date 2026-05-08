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
    minimumMonthlyIncome: Number(formData.minimumMonthlyIncome),
    status: "intake_submitted",
    source: "ortheon-alpha-mvp",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "assessments"), payload);

  return docRef.id;
}

export async function updateAssessmentFinancialReality(assessmentId, formData) {
  const assessmentRef = doc(db, "assessments", assessmentId);

  const payload = {
    financialReality: {
      currentMonthlyIncome: Number(formData.currentMonthlyIncome),
      minimumMonthlyIncome: Number(formData.minimumMonthlyIncome),
      savingsRunwayMonths: Number(formData.savingsRunwayMonths),
      incomeDropTolerance: formData.incomeDropTolerance,
      stableIncomeNeed: formData.stableIncomeNeed,
      bridgeRoleWillingness: formData.bridgeRoleWillingness,
      retrainingInvestmentAbility: formData.retrainingInvestmentAbility,
    },
    status: "financial_reality_submitted",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(assessmentRef, payload);
}
