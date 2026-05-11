// src/data/professionalCredentialsConfig.js
// Ortheon Professional Credentials Config v1.0
// Used for regulated / licensed career direction gates

export const credentialStatusOptions = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "in_progress",
    label: "In progress",
  },
];

export const professionalCredentialTypes = [
  {
    id: "legal_bar",
    label: "Legal / bar admission",
    description:
      "Law license or bar admission required to practice law in a jurisdiction.",
  },
  {
    id: "financial_advisory",
    label: "Financial advisory / securities license",
    description:
      "Credential or registration for regulated investment, financial advisory, or securities-related services.",
  },
  {
    id: "real_estate",
    label: "Real estate license",
    description:
      "License for real estate sales, brokerage, or related regulated real estate activity.",
  },
  {
    id: "healthcare_clinical",
    label: "Healthcare / clinical license",
    description:
      "Clinical, therapy, counseling, medical, nursing, or other healthcare practice license.",
  },
  {
    id: "engineering_pe",
    label: "Engineering / PE license",
    description:
      "Professional engineering license or equivalent regulated engineering credential.",
  },
  {
    id: "trade_license",
    label: "Trade license",
    description:
      "License for regulated trades such as HVAC, electrical, plumbing, contracting, or similar technical services.",
  },
  {
    id: "teaching_credential",
    label: "Teaching / education credential",
    description:
      "Credential required for regulated teaching, school administration, or formal education roles.",
  },
  {
    id: "other",
    label: "Other regulated credential",
    description:
      "Another professional license, certification, or credential required to practice in a regulated field.",
  },
];
