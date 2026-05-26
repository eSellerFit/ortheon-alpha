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
 *
 * Regression expectations (Bundle 21A) — for a senior HR executive profile
 * with regional/interim CHRO evidence:
 *
 * Direction 1 — Senior HR Leadership / Talent Operations:
 *   recommendationType: primary
 *   routeType: direct
 *   profileCredibility.level: high
 *   confidence: high or medium
 *   financialRisk may be low or medium
 *   executionRisk may be low or medium
 *
 * Direction 2 — HR Transformation Consulting / Advisory:
 *   routeType: bridge (consulting proof and BD proof are genuinely missing)
 *   profileCredibility.level: medium or high depending on evidence
 *   financialRisk may be high
 *   executionRisk may be high
 *   confidence should NOT be low solely because BD is hard
 *
 * Direction 3 — Interim / Fractional CHRO:
 *   routeType: direct or portfolio — NOT bridge (prior CHRO-level evidence exists)
 *   profileCredibility.level: high (prior interim CHRO evidence)
 *   financialRisk: high (income ramp, client acquisition)
 *   executionRisk: high (client acquisition, market visibility)
 *   confidence: medium — NOT low solely because income ramp is hard
 *
 * Key invariant: financial risk must not force routeType=bridge or confidence=low
 * when profile credibility evidence is strong.
 *
 * Bundle 21A — Prioritization regression expectations:
 * For a senior HR executive with multinational/regional/interim CHRO evidence:
 *
 * 1. Enterprise Senior HR Leadership (direct, lower financial/execution risk) should
 *    usually be displayOrder 1 / recommendationType primary over Interim CHRO
 *    (direct, high financial/execution risk) unless there is clear current client
 *    pipeline or employer demand for the fractional path.
 *
 * 2. Interim/Fractional CHRO can be secondary with profileCredibility high,
 *    routeType direct, confidence medium — high financialRisk does not demote it
 *    to bridge or low confidence, but does make it secondary in priority.
 *
 * 3. HR Transformation Consulting/Advisory should be bridge or secondary when
 *    consulting proof or business development evidence is absent.
 *
 * 4. Enterprise HR sub-tracks (Regional CHRO, HRBP Leader, Workforce Planning,
 *    HR Transformation, People Analytics) should appear as targetRoleExamples
 *    under the primary enterprise direction, not as separate final directions.
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
      pathFamily: "enterprise_employment",
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
      profileCredibility: {
        level: "high",
        reason: "Direct workforce systems and talent operations experience across complex organisations.",
      },
      financialRisk: {
        level: "low",
        reason: "Employment route is stable; consulting variant carries income ramp risk.",
      },
      executionRisk: {
        level: "medium",
        reason: "Requires clear business outcome framing; financial route details still incomplete.",
      },
      targetRoleExamples: [
        "Head of Talent Operations / Workforce Planning",
        "Senior HRBP or People Partner Leader",
        "Workforce Planning or Talent Intelligence Leader",
        "HR Transformation or Shared Services Leader",
      ],
      aiDurability: {
        rating: "D3",
        label: "Durable",
        reason: "Workforce planning relies on organizational judgment, stakeholder alignment, and contextual decision-making that are not easily automated.",
        evolutionPath: "The role will increasingly require AI fluency — interpreting workforce analytics, managing AI-augmented planning cycles, and advising on automation impact.",
      },
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
      pathFamily: "consulting_advisory",
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
      targetRoleExamples: [],
      profileCredibility: {
        level: "medium",
        reason: "People systems experience is present but consulting packaging and buyer proof are still thin.",
      },
      financialRisk: {
        level: "high",
        reason: "Consulting or fractional income is variable and ramp time is uncertain.",
      },
      executionRisk: {
        level: "high",
        reason: "No specific buyer problem defined yet; business development proof is missing.",
      },
      aiDurability: {
        rating: "D3",
        label: "Durable",
        reason: "Advisory work depends on trust, relationship context, and the interpretation of ambiguous organizational situations — areas where human judgment remains central.",
        evolutionPath: "Demand is likely to shift toward AI-integration advisory as organizations restructure around automation. Advisors who understand both people systems and AI tooling will be better positioned.",
      },
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
      pathFamily: "interim_fractional",
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
      targetRoleExamples: [],
      profileCredibility: {
        level: "low",
        reason: "Marketplace-specific execution outcomes are not yet evidenced; transition from HR operations is a stretch.",
      },
      financialRisk: {
        level: "high",
        reason: "Bridge path with uncertain monetisation and long ramp to stable income.",
      },
      executionRisk: {
        level: "high",
        reason: "Marketplace operations scope is broad; differentiating from HR operations without proof points is difficult.",
      },
      aiDurability: {
        rating: "D2",
        label: "Stable but changing",
        reason: "Marketplace operations leadership faces moderate automation pressure as platform logistics and structured processes become increasingly AI-managed.",
        evolutionPath: "Leadership in this space will require stronger AI fluency — managing AI-driven matching, demand forecasting, and automated compliance — while focusing on the human and political dimensions of marketplace governance.",
      },
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
