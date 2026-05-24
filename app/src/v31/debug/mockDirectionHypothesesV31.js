/**
 * Ortheon MVP Cut v3.1 — Mock Direction Hypotheses
 *
 * Purpose:
 * Provide valid local-only DirectionHypothesisV31-shaped objects for testing
 * the Direction Hypothesis Generator local chain.
 *
 * Bundle 11B rule:
 * - Mock data only.
 * - No real user data.
 * - No AI calls.
 * - No production imports.
 */

export const MOCK_DIRECTION_HYPOTHESES_V31 = Object.freeze([
  {
    version: "v3.1",
    stage: "direction_hypothesis",
    assessmentId: "sample-assessment-v31",
    directionId: "hyp-people-workforce-systems-advisory",
    directionArena: "People and Workforce Systems Advisory",
    seniorityComplexityLevel: "senior advisory / systems builder",
    workModel: "consulting or fractional",
    routeType: "packaged bridge",
    sourceTransferableAssets: [
      "People and workforce systems experience",
      "Relationship-based influence",
    ],
    directionStatement:
      "A direction arena focused on advising organizations on workforce systems, hiring operations, and people-process design.",
    whyThisCouldWork: [
      "The sample profile shows senior people and talent systems experience.",
      "Relationship-based influence supports advisory and stakeholder-facing work.",
    ],
    requiredBridge:
      "Package concrete workforce systems case examples and define specific advisory problems.",
    credibilityLevel: "credible_with_packaging",
    mainRisks: [
      "Positioning could sound like generic HR consulting.",
      "Market proof and measurable outcomes are still thin.",
    ],
    evidence: [
      {
        evidenceType: "transferable_asset",
        evidenceText: "People and workforce systems experience",
        sourceField: "transferabilityMap.transferableAssets",
        strength: "strong",
      },
      {
        evidenceType: "credibility_bridge",
        evidenceText: "People and Workforce Systems Advisory",
        sourceField: "transferabilityMap.credibilityBridges",
        strength: "moderate",
      },
    ],
    financialSignal: {
      viable: null,
      first12MonthViability: "unknown",
      bridgeIncomeRequired: null,
      notes: "Financial viability is not modeled in this local hypothesis step.",
    },
    constraintSignal: {
      blocked: false,
      warnings: [],
      requiredDisclaimers: [],
    },
    validationQuestions: [
      "Which workforce systems outcomes can be shown with concrete examples?",
      "Which buyer problem is specific enough for advisory positioning?",
    ],
    firstProofSteps: [
      "Draft two workforce systems case examples.",
      "Test advisory positioning with three target buyers or operators.",
    ],
  },
  {
    version: "v3.1",
    stage: "direction_hypothesis",
    assessmentId: "sample-assessment-v31",
    directionId: "hyp-talent-operations-workforce-planning",
    directionArena: "Talent Operations / Workforce Planning",
    seniorityComplexityLevel: "senior operator",
    workModel: "employment or consulting",
    routeType: "direct or bridge",
    sourceTransferableAssets: [
      "People and workforce systems experience",
      "Operating model design in ambiguous contexts",
    ],
    directionStatement:
      "A direction arena centered on improving talent operations, workforce planning, and related operating systems.",
    whyThisCouldWork: [
      "The strongest transferability sits close to talent operations and workforce systems.",
      "Operating model design can support planning and implementation work.",
    ],
    requiredBridge:
      "Connect workforce planning experience to business outcomes and operating cadence.",
    credibilityLevel: "credible_now",
    mainRisks: [
      "The arena could become too narrow without business outcome framing.",
    ],
    evidence: [
      {
        evidenceType: "possible_direction_arena",
        evidenceText: "Talent Operations / Workforce Planning",
        sourceField: "transferabilityMap.possibleDirectionArenas",
        strength: "strong",
      },
    ],
    financialSignal: {
      viable: null,
      first12MonthViability: "unknown",
      bridgeIncomeRequired: null,
      notes: "Financial viability is deferred to deterministic modeling.",
    },
    constraintSignal: {
      blocked: false,
      warnings: [],
      requiredDisclaimers: [],
    },
    validationQuestions: [
      "Is the strongest market signal in workforce planning, talent operations, or broader people systems?",
    ],
    firstProofSteps: [
      "Map prior work into a talent operations problem portfolio.",
      "Identify roles or clients that value workforce planning systems experience.",
    ],
  },
  {
    version: "v3.1",
    stage: "direction_hypothesis",
    assessmentId: "sample-assessment-v31",
    directionId: "hyp-marketplace-operations-leadership",
    directionArena: "Marketplace Operations Leadership",
    seniorityComplexityLevel: "operator / bridge-needed leadership",
    workModel: "employment or consulting",
    routeType: "bridge",
    sourceTransferableAssets: [
      "Operating model design in ambiguous contexts",
      "Relationship-based influence",
    ],
    directionStatement:
      "A possible bridge arena moving from people systems into marketplace operations where labor model experience matters.",
    whyThisCouldWork: [
      "Marketplace-style labor systems create a plausible operating model bridge.",
      "Relationship-based influence can support cross-functional marketplace work.",
    ],
    requiredBridge:
      "Show marketplace execution outcomes and clarify the distinction from pure HR work.",
    credibilityLevel: "bridge_needed",
    mainRisks: [
      "Marketplace execution evidence may be too thin.",
      "Broad operator claims could overreach without clearer business scope.",
    ],
    evidence: [
      {
        evidenceType: "credibility_bridge",
        evidenceText: "Marketplace Operations Leadership",
        sourceField: "transferabilityMap.credibilityBridges",
        strength: "moderate",
      },
    ],
    financialSignal: {
      viable: null,
      first12MonthViability: "unknown",
      bridgeIncomeRequired: null,
      notes: "Financial risk is unknown until route and income model are tested.",
    },
    constraintSignal: {
      blocked: false,
      warnings: [
        "Requires stronger evidence of marketplace execution outcomes.",
      ],
      requiredDisclaimers: [],
    },
    validationQuestions: [
      "What marketplace-specific execution outcomes can be evidenced?",
      "Would this be more credible as a bridge role than a direct leadership claim?",
    ],
    firstProofSteps: [
      "List marketplace operating problems previously solved.",
      "Gather proof points that separate marketplace operations from HR operations.",
    ],
  },
]);
