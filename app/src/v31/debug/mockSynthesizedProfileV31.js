/**
 * Ortheon MVP Cut v3.1 — Mock Synthesized Profile
 *
 * Purpose:
 * Provide a valid local-only SynthesizedProfileV31-shaped object for testing
 * the Profile Synthesizer local chain.
 *
 * Bundle 6 rule:
 * - Mock data only.
 * - No real user data.
 * - No AI calls.
 * - No production imports.
 */

export const MOCK_SYNTHESIZED_PROFILE_V31 = Object.freeze({
  version: "v3.1",
  stage: "profile_synthesis",
  assessmentId: "sample-assessment-v31",

  profileSummary: {
    oneParagraphProfile:
      "This profile reflects a senior people and talent leader with experience across workforce systems, talent acquisition, people operations, and marketplace-style labor models. The strongest pattern is not a narrow job-title identity, but the ability to build and operate people-related systems across changing business contexts.",
    careerStage: "senior_operator_or_advisory_stage",
    senioritySignal: "director_head_of",
    marketIdentity: "people_and_workforce_systems_operator",
    dominantCareerPattern: "operator_builder_with_people_systems_focus",
  },

  careerCapital: {
    functionalExperience: [
      "talent acquisition",
      "people operations",
      "workforce planning",
      "stakeholder management",
      "operating model design",
    ],
    industryExperience: [
      "human resources",
      "marketplace operations",
      "technology-enabled workforce models",
    ],
    leadershipScope: "cross-functional leadership and advisory influence",
    operatingContexts: [
      "corporate environments",
      "builder contexts",
      "marketplace-style labor systems",
      "ambiguous operating environments",
    ],
    domainAssets: [
      "people systems",
      "hiring operations",
      "workforce marketplaces",
      "career transition logic",
    ],
    credibilitySignals: [
      "senior people/talent leadership signal",
      "workforce systems experience",
      "marketplace labor model exposure",
    ],
    distinctiveAssets: [
      "combination of talent acquisition and marketplace operations",
      "ability to translate people problems into operating systems",
    ],
  },

  competencySignals: {
    strongestCompetencies: [
      {
        competencyId: 10,
        competencyName:
          "Aligning people through clear direction and meaningful purpose",
        signalStrength: "strong",
        evidence: [
          "Led people/talent initiatives across complex organizations.",
        ],
      },
      {
        competencyId: 14,
        competencyName:
          "Building and maintaining relationships that create future opportunities",
        signalStrength: "strong",
        evidence: [
          "Worked with business leaders, hiring teams, and external partners.",
        ],
      },
    ],
    supportingCompetencies: [
      {
        competencyId: 23,
        competencyName:
          "Orchestrating AI, automation and human workflows to deliver outcomes at scale",
        signalStrength: "moderate",
        evidence: [
          "Designed systems and operating workflows in marketplace contexts.",
        ],
      },
    ],
    weakOrUnprovenCompetencies: [
      {
        competencyId: null,
        competencyName: "Regulated clinical or licensed professional practice",
        reason: "No regulated credential evidence is present in the sample.",
      },
    ],
    evidenceByCompetency: {
      "Aligning people through clear direction and meaningful purpose": [
        "Led people/talent initiatives across complex organizations.",
      ],
      "Building and maintaining relationships that create future opportunities": [
        "Worked with business leaders, hiring teams, and external partners.",
      ],
      "Orchestrating AI, automation and human workflows to deliver outcomes at scale": [
        "Designed systems and operating workflows in marketplace contexts.",
      ],
    },
  },

  anchorPattern: {
    dominantAnchors: ["impact", "management", "workModel"],
    secondaryAnchors: ["autonomy", "challenge"],
    tensions: [
      "impact and autonomy may conflict with highly rigid corporate environments",
      "security is present but not dominant in the sample anchor pattern",
    ],
    likelyEnergizers: [
      "building useful systems",
      "helping people navigate work transitions",
      "operating with autonomy",
    ],
    likelyDrainers: [
      "purely administrative work",
      "low-impact execution without ownership",
      "roles with no room to shape the system",
    ],
  },

  transitionContext: {
    urgency: "moderate",
    flexibility: "moderate",
    riskLevel: "moderate",
    constraintsSummary:
      "The sample profile is work-authorized, prefers New York or remote options, and has limited weekly time for retraining.",
    financialPressure:
      "The sample has a stated income floor and should avoid long unpaid transition routes.",
    bridgeNeeds: [
      "market-facing positioning",
      "proof of credibility for any non-HR direction",
    ],
  },

  profileRisks: [
    "The profile may be too broad if not packaged around a clear market-facing identity.",
    "Directions outside people/workforce systems would require stronger proof.",
  ],
  missingInformation: [
    "specific target market",
    "preferred work model beyond current sample constraints",
  ],
  evidenceLimitations: [
    "This is local mock data and should not be treated as a real assessment.",
  ],
});
