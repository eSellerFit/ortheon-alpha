import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
