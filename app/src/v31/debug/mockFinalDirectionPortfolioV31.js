/**
 * Ortheon MVP Cut v3.1 — Mock Final Direction Portfolio
 *
 * Purpose:
 * Provide a valid local-only FinalDirectionPortfolioV31-shaped object for
 * testing the Portfolio Composer local chain.
 *
 * Bundle 13B rule:
 * - Mock data only.
 * - No real user data.
 * - No AI calls.
 * - No production imports.
 */

export const MOCK_FINAL_DIRECTION_PORTFOLIO_V31 = Object.freeze({
  version: "v3.1",
  stage: "final_direction_portfolio",
  assessmentId: "sample-assessment-v31",

  portfolioSummary: {
    overallInterpretation:
      "The strongest directions stay close to people systems, talent operations, and workforce operating models.",
    mainTension:
      "The profile has credible people-system assets, but consulting and marketplace paths need proof packaging.",
    recommendedStrategy:
      "Lead with the clearest workforce systems direction and treat broader marketplace operations as a bridge path.",
    portfolioLogic: [
      "Prioritize directions grounded in people and workforce systems experience.",
      "Keep bridge-heavy directions conditional until proof is clearer.",
    ],
  },

  directions: [
    {
      directionId: "hyp-talent-operations-workforce-planning",
      displayOrder: 1,
      directionArena: "Talent Operations / Workforce Planning",
      seniorityComplexityLevel: "senior operator",
      workModel: "employment or consulting",
      routeType: "direct or bridge",
      label: "Talent Operations / Workforce Planning",
      recommendationType: "primary",
      confidence: "medium",
      whyItFits: [
        "This direction is closest to the strongest workforce systems evidence.",
        "It can use both people systems and operating model design assets.",
      ],
      whyItIsCredible: [
        "The mock transferability map marks this arena as credible_now.",
      ],
      whatMakesItRisky: [
        "The direction needs clear business outcome framing.",
        "Financial route details are still incomplete.",
      ],
      firstValidationStep:
        "Map prior work into a talent operations problem portfolio.",
      bridgeStrategy:
        "Use bridge positioning if the opportunity requires broader transformation proof.",
      notRecommendedIf: [
        "The target role requires workforce analytics depth that is not evidenced.",
      ],
      evidence: [
        "People and workforce systems experience",
        "Operating model design in ambiguous contexts",
      ],
      constraintsAndWarnings: [
        "Guardrails indicate bridge income or route validation may be needed.",
      ],
    },
    {
      directionId: "hyp-people-workforce-systems-advisory",
      displayOrder: 2,
      directionArena: "People and Workforce Systems Advisory",
      seniorityComplexityLevel: "senior advisory / systems builder",
      workModel: "consulting or fractional",
      routeType: "packaged bridge",
      label: "People and Workforce Systems Advisory",
      recommendationType: "bridge",
      confidence: "medium",
      whyItFits: [
        "The direction uses people systems experience and relationship-based influence.",
      ],
      whyItIsCredible: [
        "It is credible with packaging rather than as an untested broad advisory claim.",
      ],
      whatMakesItRisky: [
        "Positioning could become generic HR consulting.",
        "Market proof is still thin.",
      ],
      firstValidationStep:
        "Test advisory positioning with target buyers or operators.",
      bridgeStrategy:
        "Package concrete workforce systems case examples before treating this as a primary path.",
      notRecommendedIf: [
        "No specific buyer problem can be defined.",
        "The person needs immediate stable income without bridge work.",
      ],
      evidence: [
        "People and workforce systems experience",
        "Relationship-based influence",
      ],
      constraintsAndWarnings: [
        "Consulting or fractional work should not be treated as immediately stable.",
      ],
    },
    {
      directionId: "hyp-marketplace-operations-leadership",
      displayOrder: 3,
      directionArena: "Marketplace Operations Leadership",
      seniorityComplexityLevel: "operator / bridge-needed leadership",
      workModel: "employment or consulting",
      routeType: "bridge",
      label: "Marketplace Operations Leadership",
      recommendationType: "bridge",
      confidence: "low",
      whyItFits: [
        "The direction uses operating model design in ambiguous contexts.",
      ],
      whyItIsCredible: [
        "It is plausible as a bridge path from people systems into labor marketplace operations.",
      ],
      whatMakesItRisky: [
        "Marketplace execution evidence may be too thin.",
        "Broad operator claims could overreach without business scope proof.",
      ],
      firstValidationStep:
        "Gather proof points that separate marketplace operations from HR operations.",
      bridgeStrategy:
        "Treat this as a longer-path bridge until marketplace-specific outcomes are documented.",
      notRecommendedIf: [
        "No marketplace-specific execution outcomes can be evidenced.",
      ],
      evidence: [
        "Operating model design in ambiguous contexts",
        "Relationship-based influence",
      ],
      constraintsAndWarnings: [
        "Bridge-required direction; do not present as immediately credible.",
      ],
    },
  ],

  rejectedDirections: [],

  userFacingNarrative: {
    headline: "A focused people-systems portfolio with bridge options",
    summary:
      "The portfolio should stay anchored in workforce systems and talent operations while testing broader advisory or marketplace paths carefully.",
    nextStepAdvice:
      "Validate the primary direction with concrete examples, then test bridge paths only where proof is strong.",
    caveats: [
      "Financial details are incomplete.",
      "Bridge paths should not be treated as immediate stable-income options.",
    ],
  },

  qualityNotes: [
    "The portfolio keeps all directions close to sourced transferable assets.",
    "Bridge-heavy options are labeled as bridge directions, not credible-now claims.",
  ],

  missingInputsAffectingConfidence: [
    "income drop tolerance",
    "specific measurable outcomes",
    "target market proof",
  ],
});
