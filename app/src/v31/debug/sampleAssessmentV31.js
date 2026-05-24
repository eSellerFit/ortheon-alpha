/**
 * Ortheon MVP Cut v3.1 — Sample Assessment Fixture
 *
 * Purpose:
 * Provide a realistic local-only assessment object for testing
 * buildAssessmentSnapshotV31().
 *
 * Bundle 3 rule:
 * - Debug fixture only.
 * - No production imports.
 * - No Firestore reads/writes.
 * - No real user data.
 */

export const SAMPLE_ASSESSMENT_V31 = Object.freeze({
  id: "sample-assessment-v31",
  firstName: "Sample",
  email: "sample@example.com",
  currentRole: "Senior People Operations / Talent Leader",
  currentSituation: "Exploring realistic next career direction",
  status: "priority_weights_submitted",
  source: "ortheon-alpha-mvp",
  roleLibraryVersion: "v2.2",
  salaryBenchmarkVersion: "v2.2",
  scoringVersion: "transition-realism-v1.3-hard-domain-gates",
  careerMapVersion: "career-map-v1.3-hard-hr-domain-gate",

  anchors: {
    technical: 6,
    management: 8,
    autonomy: 7,
    security: 5,
    impact: 9,
    challenge: 7,
    workModel: 8,
    craft: 6,
  },

  financialReality: {
    currentMonthlyIncome: 12000,
    minimumMonthlyIncome: 8000,
    savingsRunwayMonths: 6,
    bridgeRoleWillingness: "open_to_bridge_role",
    retrainingInvestmentAbility: "moderate",
  },

  transitionConstraints: {
    locationConstraint: "New York / remote preferred",
    workAuthorizedUS: "yes",
    visaSponsorshipNeeded: "no",
    weeklyTimeAvailable: 8,
    retrainingWillingness: "moderate",
  },

  professionalCredentials: {
    hasRegulatedCredentials: "no",
    credentials: [],
  },

  cvProfile: {
    cvSource: "claude_parsed",
    parsed: true,
    skipped: false,
    rawTextLength: 8500,
    reviewedText: "Sample reviewed CV text for local debug only.",
    pdfMetadata: {
      fileName: "sample-cv.pdf",
      pageCount: 3,
      extractedCharacterCount: 8500,
    },
    careerSummary:
      "Senior people and talent leader with experience in workforce systems, hiring operations, and marketplace-style labor models.",
    domainSignals: [
      "human_resources",
      "talent_acquisition",
      "workforce_planning",
      "marketplace_operations",
    ],
    senioritySignal: "director_head_of",
    entrepreneurialSignals: ["built_new_programs", "worked_in_early_stage_contexts"],
    tradeSignals: [],
    tenurePattern: "mixed_corporate_and_builder_pattern",
    leadershipScope: "cross-functional leadership and advisory influence",
    confidence: {
      overall: "medium",
      competencies: "medium",
    },
    competencySignals: [
      {
        competencyId: 10,
        competencyName:
          "Aligning people through clear direction and meaningful purpose",
        signalStrength: "strong",
        evidence: "Led people/talent initiatives across complex organizations.",
      },
      {
        competencyId: 14,
        competencyName:
          "Building and maintaining relationships that create future opportunities",
        signalStrength: "strong",
        evidence: "Worked with business leaders, hiring teams, and external partners.",
      },
      {
        competencyId: 23,
        competencyName:
          "Orchestrating AI, automation and human workflows to deliver outcomes at scale",
        signalStrength: "moderate",
        evidence: "Designed systems and operating workflows in marketplace contexts.",
      },
    ],
    userCorrections: [],
  },

  priorityWeights: {
    competencyFit: 30,
    anchorFit: 25,
    financialViability: 25,
    roleDurability: 20,
  },
});
