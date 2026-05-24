/**
 * Ortheon MVP Cut v3.1 — Mock Transferability Map
 *
 * Purpose:
 * Provide a valid local-only TransferabilityMapV31-shaped object for testing
 * the Transferability Mapper local chain.
 *
 * Bundle 9B rule:
 * - Mock data only.
 * - No real user data.
 * - No AI calls.
 * - No production imports.
 */

export const MOCK_TRANSFERABILITY_MAP_V31 = Object.freeze({
  version: "v3.1",
  stage: "transferability_mapping",
  assessmentId: "sample-assessment-v31",

  transferableAssets: [
    {
      assetName: "People and workforce systems experience",
      assetType: "domain_experience",
      evidence: [
        "Senior people and talent leader",
        "workforce systems",
        "talent acquisition",
      ],
      transferStrength: "strong",
      explanation:
        "The sample profile shows repeated experience with people systems, hiring operations, and workforce-related operating models.",
      likelyDestinationArenas: [
        "People and Workforce Systems Advisory",
        "Talent Operations / Workforce Planning",
      ],
    },
    {
      assetName: "Operating model design in ambiguous contexts",
      assetType: "operating_model",
      evidence: [
        "builder contexts",
        "ambiguous operating environments",
        "marketplace-style labor systems",
      ],
      transferStrength: "moderate",
      explanation:
        "The profile suggests capability in structuring work systems across contexts, but future arenas would need clearer proof packaging.",
      likelyDestinationArenas: [
        "Marketplace Operations Leadership",
        "Workforce Transformation / Operating Model Support",
      ],
    },
    {
      assetName: "Relationship-based influence",
      assetType: "relationship_asset",
      evidence: [
        "Worked with business leaders, hiring teams, and external partners.",
      ],
      transferStrength: "moderate",
      explanation:
        "The profile includes stakeholder and relationship signals that can transfer into advisory, partnership, or client-facing arenas.",
      likelyDestinationArenas: [
        "People Advisory / Consulting",
        "Career Transition Support",
      ],
    },
  ],

  credibilityBridges: [
    {
      fromAsset: "People and workforce systems experience",
      toArena: "People and Workforce Systems Advisory",
      bridgeLogic:
        "The move is credible if the profile is packaged around workforce systems, hiring operations, and practical people-process design rather than generic HR leadership.",
      credibilityLevel: "credible_with_packaging",
      evidence: [
        "senior people/talent leadership signal",
        "workforce systems experience",
      ],
      packagingNeeds: [
        "clear advisory positioning",
        "case examples",
        "specific problem statements",
      ],
    },
    {
      fromAsset: "Operating model design in ambiguous contexts",
      toArena: "Marketplace Operations Leadership",
      bridgeLogic:
        "The transfer is plausible through the operating-model pattern, but would require stronger evidence of marketplace execution outcomes.",
      credibilityLevel: "bridge_needed",
      evidence: [
        "marketplace-style labor systems",
        "operating workflows in marketplace contexts",
      ],
      packagingNeeds: [
        "marketplace-specific proof",
        "metrics or project examples",
        "clear distinction from pure HR work",
      ],
    },
  ],

  nonTransferableOrRiskyAssumptions: [
    {
      assumption:
        "The person can move directly into any regulated education or clinical path.",
      whyRisky:
        "The sample profile does not include regulated licenses or credential evidence.",
      whatWouldBeNeeded:
        "Credential verification, licensing pathway analysis, or a bridge through non-regulated adjacent roles.",
      relatedArena: "Education / Career Transition Support",
    },
    {
      assumption:
        "The person is automatically credible as a broad startup executive.",
      whyRisky:
        "The profile has builder/operator signals, but broad executive credibility requires clearer evidence of full business ownership or P&L scope.",
      whatWouldBeNeeded:
        "Proof of executive operating scope, P&L ownership, or founder/operator outcomes.",
      relatedArena: "Startup / Operating Leadership",
    },
  ],

  possibleDirectionArenas: [
    {
      arena: "People and Workforce Systems Advisory",
      whyPossible:
        "The profile combines people operations, talent acquisition, workforce systems, and advisory influence.",
      evidence: [
        "people systems",
        "hiring operations",
        "workforce systems experience",
      ],
      risk:
        "The arena needs sharp positioning to avoid sounding like generic HR consulting.",
      bridgeNeeded: false,
      credibilityLevel: "credible_with_packaging",
      likelyWorkModels: ["consulting", "fractional", "employment"],
      likelyRouteTypes: ["bridge", "portfolio"],
    },
    {
      arena: "Talent Operations / Workforce Planning",
      whyPossible:
        "The profile's strongest transferability sits close to talent operations and workforce planning systems.",
      evidence: [
        "talent acquisition",
        "workforce planning",
        "operating model design",
      ],
      risk:
        "The direction may be too narrow if not connected to broader business or transformation outcomes.",
      bridgeNeeded: false,
      credibilityLevel: "credible_now",
      likelyWorkModels: ["employment", "consulting"],
      likelyRouteTypes: ["direct", "bridge"],
    },
    {
      arena: "Marketplace Operations Leadership",
      whyPossible:
        "Marketplace labor model exposure creates a possible bridge from people systems into marketplace operations.",
      evidence: [
        "marketplace operations",
        "marketplace-style labor systems",
        "operating workflows in marketplace contexts",
      ],
      risk:
        "The transfer could be overstated if marketplace execution evidence is thin.",
      bridgeNeeded: true,
      credibilityLevel: "bridge_needed",
      likelyWorkModels: ["employment", "consulting"],
      likelyRouteTypes: ["bridge"],
    },
  ],

  strongestTransferabilityThemes: [
    "people systems",
    "workforce operating models",
    "talent operations",
    "relationship-based influence",
  ],

  weakestTransferabilityAreas: [
    "regulated professional paths without credential evidence",
    "broad executive claims without P&L proof",
    "technical/craft paths without hands-on technical evidence",
  ],

  missingEvidence: [
    "specific measurable outcomes",
    "preferred work model",
    "target market proof",
    "confirmed credentials or licenses",
  ],
});
