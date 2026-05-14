import { roleLibrary } from "../data/roleLibrary";
import { salaryBenchmarks } from "../data/salaryBenchmarks";
import { getCareerMapMetadata } from "../data/careerMapMetadata";

const competencyNames = {
  1: "Understanding and managing competing interests",
  2: "Being Resilient - bouncing back and adapting under pressure",
  3: "Generating new ideas and turning them into reality",
  4: "Seeing the bigger picture and positioning for long-term advantage",
  5: "Picking up new skills and knowledge quickly under real conditions",
  6: "Delivering outcomes fast with whatever is available",
  7: "Making sure commitments are kept by self and others",
  8: "Finding better, faster, smarter ways to get work done",
  9: "Understanding how money flows and decisions affect financial outcomes",
  10: "Aligning people through clear direction and meaningful purpose",
  11: "Inspiring and persuading people to grow and take action",
  12: "Navigating complexity to get things done within any structure",
  13: "Adjusting approach to fit what each moment actually needs",
  14: "Building and maintaining relationships that create future opportunities",
  15: "Selling ideas, services or products without institutional backing",
  16: "Mastering a specific craft, tool or physical system to a high standard",
  17: "Maintaining precision, quality and safety standards consistently",
  18: "Diagnosing and fixing problems in physical or technical systems",
  19: "Reading and working from technical specifications or blueprints",
  20: "Working effectively with AI tools to amplify personal output",
  21: "Thinking critically about information, data and AI-generated content",
  22: "Creating original content, ideas or solutions that AI cannot replicate",
  23: "Orchestrating AI, automation and human workflows to deliver outcomes at scale",
};

const anchorNames = {
  technicalFunctional: "Technical / Functional",
  technical_functional: "Technical / Functional",
  technical: "Technical / Functional",

  generalManagerial: "General Managerial",
  general_managerial: "General Managerial",
  managerial: "General Managerial",
  management: "General Managerial",

  autonomyIndependence: "Autonomy / Independence",
  autonomy_independence: "Autonomy / Independence",
  autonomy: "Autonomy / Independence",

  securityStability: "Security / Stability",
  security_stability: "Security / Stability",
  security: "Security / Stability",
  stability: "Security / Stability",

  entrepreneurialCreativity: "Entrepreneurial Creativity",
  entrepreneurial_creativity: "Entrepreneurial Creativity",
  entrepreneurship: "Entrepreneurial Creativity",
  entrepreneurial: "Entrepreneurial Creativity",

  serviceDedication: "Service / Dedication",
  service_dedication: "Service / Dedication",
  service: "Service / Dedication",
  impact: "Service / Dedication",

  pureChallenge: "Pure Challenge",
  pure_challenge: "Pure Challenge",
  challenge: "Pure Challenge",

  lifestyle: "Lifestyle",
};

const signalMap = {
  strong: 100,
  moderate: 70,
  weak: 30,
  absent: 0,
};

const talentAcquisitionKeywords = [
  "talent acquisition",
  "recruiting",
  "recruitment",
  "recruiter",
  "sourcing",
  "candidate",
  "candidates",
  "hiring",
  "staffing",
  "workforce planning",
  "talent planning",
  "talent intelligence",
  "talent pipeline",
  "pipeline",
  "full-cycle recruiting",
  "full cycle recruiting",
  "high-volume hiring",
  "high volume hiring",
  "executive search",
  "headhunting",
  "interviewing",
  "offer management",
  "ats",
  "applicant tracking",
  "employer brand",
  "employer branding",
  "talent strategy",
  "people analytics",
  "hr analytics",
  "recruiting operations",
  "recruitment operations",
  "vendor management",
  "hiring manager",
  "hiring managers",
];

const strongTalentAcquisitionKeywords = [
  "talent acquisition",
  "recruiting",
  "recruitment",
  "recruiter",
  "sourcing",
  "hiring",
  "staffing",
  "workforce planning",
  "talent planning",
  "talent intelligence",
  "full-cycle recruiting",
  "full cycle recruiting",
  "high-volume hiring",
  "high volume hiring",
  "executive search",
  "employer brand",
  "employer branding",
  "talent strategy",
  "people analytics",
  "hr analytics",
  "recruiting operations",
  "recruitment operations",
  "hiring manager",
  "hiring managers",
];

const marketplaceKeywords = [
  "marketplace",
  "platform",
  "e-commerce",
  "ecommerce",
  "two-sided market",
  "gig economy",
  "seller",
  "sellers",
  "merchant",
  "merchants",
  "amazon",
  "shopify",
  "etsy",
  "ebay",
  "poshmark",
  "wildberries",
];

const operationsSupplyChainKeywords = [
  "supply chain",
  "logistics",
  "warehouse",
  "warehousing",
  "inventory",
  "manufacturing",
  "procurement",
  "fulfillment",
  "lean",
  "process improvement",
];

const broadBusinessOwnershipKeywords = [
  "p&l",
  "p / l",
  "profit and loss",
  "business unit",
  "business-unit",
  "country manager",
  "regional manager",
  "regional director",
  "general manager",
  "managing director",
  "revenue ownership",
  "commercial accountability",
  "budget ownership",
  "owned budget",
  "owned revenue",
  "multi-function",
  "multifunction",
  "cross-functional business ownership",
  "business owner",
  "business ownership",
  "gm role",
];

const genericManagementDirectionIds = new Set([
  "MG-1-E",
  "MG-6-E",
  "MG-8-E",
  "MG-13-E",
]);

const talentDirectionIds = new Set([
  "BF-4-E",
  "BF-5-E",
  "BF-6-E",
  "BF-8-IF",
  "ED-5-IF",
]);

function clampScore(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/[^\w\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function textIncludesAny(text, keywords) {
  const normalizedText = normalizeText(text);

  return keywords.some((keyword) =>
    normalizedText.includes(normalizeText(keyword))
  );
}

function countKeywordMatches(text, keywords) {
  const normalizedText = normalizeText(text);

  return keywords.filter((keyword) =>
    normalizedText.includes(normalizeText(keyword))
  ).length;
}

function buildAssessmentSearchText(assessment) {
  const cvProfile = assessment?.cvProfile || {};
  const competencySignals = Array.isArray(cvProfile.competencySignals)
    ? cvProfile.competencySignals
    : [];

  const competencyEvidence = competencySignals
    .map((signal) => signal.evidence || "")
    .join(" ");

  const competencyNamesText = competencySignals
    .map((signal) => signal.competencyName || "")
    .join(" ");

  const domainSignals = Array.isArray(cvProfile.domainSignals)
    ? cvProfile.domainSignals.join(" ")
    : "";

  const entrepreneurialSignals = Array.isArray(cvProfile.entrepreneurialSignals)
    ? cvProfile.entrepreneurialSignals.join(" ")
    : "";

  const tradeSignals = Array.isArray(cvProfile.tradeSignals)
    ? cvProfile.tradeSignals.join(" ")
    : "";

  return normalizeText(
    [
      assessment?.currentRole,
      assessment?.currentIndustry,
      cvProfile.careerSummary,
      domainSignals,
      entrepreneurialSignals,
      tradeSignals,
      cvProfile.senioritySignal,
      cvProfile.leadershipScope,
      cvProfile.tenurePattern,
      competencyEvidence,
      competencyNamesText,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function hasTalentAcquisitionProfile(assessment) {
  const profileText = buildAssessmentSearchText(assessment);
  const domainSignals = assessment?.cvProfile?.domainSignals || [];

  const hasHrDomain = domainSignals.some((domain) =>
    [
      "human_resources",
      "human resources",
      "hr",
      "people",
      "talent",
      "recruiting",
      "recruitment",
      "staffing",
      "workforce",
      "workforce planning",
    ].includes(normalizeText(domain))
  );

  const strongKeywordMatchCount = countKeywordMatches(
    profileText,
    strongTalentAcquisitionKeywords
  );

  return hasHrDomain || strongKeywordMatchCount >= 2;
}

function hasMarketplaceProfile(assessment) {
  return textIncludesAny(
    buildAssessmentSearchText(assessment),
    marketplaceKeywords
  );
}

function hasOperationsSupplyChainProfile(assessment) {
  return textIncludesAny(
    buildAssessmentSearchText(assessment),
    operationsSupplyChainKeywords
  );
}

function hasBroadBusinessOwnershipEvidence(assessment) {
  return textIncludesAny(
    buildAssessmentSearchText(assessment),
    broadBusinessOwnershipKeywords
  );
}

function directionSearchText(direction) {
  return normalizeText(
    [
      direction?.directionId,
      direction?.directionLabel,
      direction?.category,
      direction?.metaDirection,
      direction?.context,
      direction?.transitionCategory,
      direction?.transitionPathway,
      ...(direction?.relevantDomains || []),
      ...(direction?.onetTitles || []),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function isTalentDirection(direction) {
  if (!direction) {
    return false;
  }

  if (talentDirectionIds.has(direction.directionId)) {
    return true;
  }

  const text = directionSearchText(direction);

  return textIncludesAny(text, [
    "talent",
    "human resources",
    "people operations",
    "workforce planning",
    "talent intelligence",
    "people analytics",
    "hr tech",
    "career",
    "outplacement",
    "leadership development",
  ]);
}

function isMarketplaceDirection(direction) {
  return textIncludesAny(directionSearchText(direction), marketplaceKeywords);
}

function isSupplyChainDirection(direction) {
  return textIncludesAny(directionSearchText(direction), [
    "supply chain",
    "logistics",
    "operations consulting",
    "manufacturing",
  ]);
}

function isGenericManagementDirection(direction) {
  return genericManagementDirectionIds.has(direction?.directionId);
}

function getFullDirection(directionId) {
  const role = roleLibrary.find((item) => item.directionId === directionId);
  const salary = salaryBenchmarks.find(
    (item) => item.directionId === directionId
  );

  if (!role) {
    return null;
  }

  return {
    ...role,
    financialPathway: salary?.financialPathway || null,
    salarySource: salary?.sources?.[0]?.name || "unknown",
    salarySources: salary?.sources || [],
    salaryLastUpdated: salary?.lastUpdated || null,
    salaryValidUntil: salary?.validUntil || null,
    salaryDataQuality: salary?.dataQuality || "unknown",
    salaryBenchmarkVersion: salary?.version || null,
  };
}

function getDisplayDirectionLabel(direction, assessment) {
  if (!hasTalentAcquisitionProfile(assessment)) {
    return direction.directionLabel;
  }

  if (direction.directionId === "BF-4-E") {
    return "Talent Acquisition / People Operations — Enterprise";
  }

  if (direction.directionId === "BF-5-E") {
    return "Workforce Planning / Talent Intelligence — Enterprise";
  }

  if (direction.directionId === "BF-6-E") {
    return "People Analytics / HR Tech — Enterprise";
  }

  if (direction.directionId === "BF-8-IF") {
    return "Career / Outplacement Strategy — Independent";
  }

  return direction.directionLabel;
}

function evaluateEligibility(professionalCredentials, direction) {
  const eligibility = direction.eligibility;

  if (!eligibility) {
    return {
      gateType: "none",
      passed: true,
      warning: null,
      reason: null,
      matchedCredential: null,
    };
  }

  const credentials = Array.isArray(professionalCredentials?.credentials)
    ? professionalCredentials.credentials
    : [];

  const matchedCredential = credentials.find((credential) => {
    const typeMatches = eligibility.acceptedCredentials.includes(
      credential.type
    );

    const statusMatches = eligibility.acceptedStatuses.includes(
      credential.status
    );

    return typeMatches && statusMatches;
  });

  if (matchedCredential) {
    return {
      gateType: eligibility.gateType,
      passed: true,
      warning: null,
      reason: eligibility.reason,
      matchedCredential,
    };
  }

  if (eligibility.gateType === "hard") {
    return {
      gateType: "hard",
      passed: false,
      warning: null,
      reason: eligibility.reason,
      matchedCredential: null,
    };
  }

  return {
    gateType: "soft",
    passed: true,
    warning: eligibility.reason,
    reason: eligibility.reason,
    matchedCredential: null,
  };
}

function normalizeWeights(weights) {
  const fallbackWeights = {
    competencyFit: 35,
    anchorFit: 35,
    financialViability: 15,
    roleDurability: 15,
  };

  const source = weights || fallbackWeights;
  const financial = Math.max(Number(source.financialViability) || 15, 10);

  const adjusted = {
    competencyFit: Number(source.competencyFit) || fallbackWeights.competencyFit,
    anchorFit: Number(source.anchorFit) || fallbackWeights.anchorFit,
    financialViability: financial,
    roleDurability:
      Number(source.roleDurability) || fallbackWeights.roleDurability,
  };

  const total =
    adjusted.competencyFit +
    adjusted.anchorFit +
    adjusted.financialViability +
    adjusted.roleDurability;

  if (!total || total <= 0) {
    return {
      competencyFit: 0.35,
      anchorFit: 0.35,
      financialViability: 0.15,
      roleDurability: 0.15,
    };
  }

  return {
    competencyFit: adjusted.competencyFit / total,
    anchorFit: adjusted.anchorFit / total,
    financialViability: adjusted.financialViability / total,
    roleDurability: adjusted.roleDurability / total,
  };
}

function getSignalDetail(competencySignals, competencyId) {
  const signals = Array.isArray(competencySignals) ? competencySignals : [];

  const found = signals.find(
    (signal) => Number(signal.competencyId) === Number(competencyId)
  );

  const signalStrength = found?.signalStrength || "absent";
  const score = signalMap[signalStrength] || 0;

  return {
    competencyId,
    competencyName:
      found?.competencyName ||
      competencyNames[competencyId] ||
      `Competency ${competencyId}`,
    signalStrength,
    score,
    evidence: found?.evidence || null,
    isMatched: signalStrength === "strong" || signalStrength === "moderate",
  };
}

function buildCompetencyExplanation(competencySignals, direction) {
  const required = (direction.requiredCompetencies || []).map((competencyId) =>
    getSignalDetail(competencySignals, competencyId)
  );

  const preferred = (direction.preferredCompetencies || []).map((competencyId) =>
    getSignalDetail(competencySignals, competencyId)
  );

  return {
    matchedRequiredCompetencies: required.filter((item) => item.isMatched),
    missingRequiredCompetencies: required.filter((item) => !item.isMatched),
    matchedPreferredCompetencies: preferred.filter((item) => item.isMatched),
    missingPreferredCompetencies: preferred.filter((item) => !item.isMatched),
  };
}

function calcCompetencyScore(competencySignals, direction) {
  const requiredScores = (direction.requiredCompetencies || []).map(
    (competencyId) => getSignalDetail(competencySignals, competencyId).score
  );

  const preferredScores = (direction.preferredCompetencies || []).map(
    (competencyId) => getSignalDetail(competencySignals, competencyId).score
  );

  const requiredAverage =
    requiredScores.length > 0
      ? requiredScores.reduce((sum, value) => sum + value, 0) /
        requiredScores.length
      : 100;

  const preferredAverage =
    preferredScores.length > 0
      ? preferredScores.reduce((sum, value) => sum + value, 0) /
        preferredScores.length
      : 100;

  return Math.round(requiredAverage * 0.7 + preferredAverage * 0.3);
}

function evaluateAnchor(anchor, userScore, importance) {
  const midpoint = (anchor.idealMin + anchor.idealMax) / 2;
  const distance = Math.abs(userScore - midpoint);
  const isInIdealRange =
    userScore >= anchor.idealMin && userScore <= anchor.idealMax;
  const isConflict = distance > 3;

  return {
    anchorId: anchor.anchorId,
    userScore,
    idealMin: anchor.idealMin,
    idealMax: anchor.idealMax,
    importance,
    distance: Number(distance.toFixed(1)),
    isInIdealRange,
    isConflict,
  };
}

function calcAnchorScore(anchors, direction) {
  let penalty = 0;
  const warnings = [];
  const anchorMatches = [];
  const anchorConflicts = [];

  const userAnchors = anchors || {};

  (direction.dominantAnchors || []).forEach((anchor) => {
    const userScore = Number(userAnchors[anchor.anchorId]) || 5;
    const evaluation = evaluateAnchor(anchor, userScore, "dominant");

    penalty += evaluation.distance * 10;

    if (evaluation.isInIdealRange) {
      anchorMatches.push(evaluation);
    }

    if (evaluation.isConflict) {
      warnings.push(anchor.anchorId);
      anchorConflicts.push(evaluation);
    }
  });

  (direction.significantAnchors || []).forEach((anchor) => {
    const userScore = Number(userAnchors[anchor.anchorId]) || 5;
    const evaluation = evaluateAnchor(anchor, userScore, "significant");

    penalty += evaluation.distance * 5;

    if (evaluation.isInIdealRange) {
      anchorMatches.push(evaluation);
    }

    if (evaluation.isConflict) {
      anchorConflicts.push(evaluation);
    }
  });

  return {
    score: Math.max(0, Math.round(100 - penalty)),
    warnings,
    anchorMatches,
    anchorConflicts,
  };
}

function calcFinancialScore(financialReality, direction) {
  const annualFloor =
    (Number(financialReality?.minimumMonthlyIncome) || 0) * 12;

  const avg12month = Number(direction.financialPathway?.avg12month) || 0;
  const ratio = annualFloor > 0 ? avg12month / annualFloor : 1;

  let score;
  let flag = null;
  let explanation;

  if (ratio >= 1.2) {
    score = 100;
    explanation =
      "Estimated first-year income is comfortably above the stated income floor.";
  } else if (ratio >= 1.0) {
    score = 70;
    explanation =
      "Estimated first-year income meets the stated income floor, but with limited buffer.";
  } else if (ratio >= 0.8) {
    score = 40;
    flag = "financially_constrained";
    explanation =
      "Estimated first-year income is below the stated income floor, but may be manageable with runway or a bridge plan.";
  } else {
    score = 10;
    flag = "financially_risky";
    explanation =
      "Estimated first-year income is materially below the stated income floor.";
  }

  const runway = Number(financialReality?.savingsRunwayMonths) || 0;
  let runwayAdjustment = 0;

  if (runway >= 6) {
    score = Math.min(100, score + 10);
    runwayAdjustment = 10;
  }

  if (runway < 3) {
    score = Math.max(0, score - 20);
    runwayAdjustment = -20;
  }

  return {
    score,
    flag,
    annualFloor,
    avg12month,
    ratio: Number(ratio.toFixed(2)),
    runwayMonths: runway,
    runwayAdjustment,
    explanation,
  };
}

function calcDurabilityScore(direction) {
  const map = {
    D4: 100,
    D3: 80,
    D2: 60,
    D1: 30,
    D0: 0,
  };

  return map[direction.aiDurabilityRating] || 0;
}

function getFitBand(total, financialFlag) {
  if (financialFlag === "financially_risky" && total >= 65) {
    return "Strong Alignment — Financially Constrained";
  }

  if (total >= 80) {
    return "Strong Fit";
  }

  if (total >= 65) {
    return "Conditional Fit";
  }

  if (total >= 50) {
    return "Stretch Path";
  }

  return "Bridge Required";
}

function hasDomainMatch(direction, assessment) {
  if (!direction.relevantDomains || direction.relevantDomains.length === 0) {
    return true;
  }

  if (direction.domainSpecificityRequired === "low") {
    return true;
  }

  const relevantDomains = direction.relevantDomains.map((domain) =>
    normalizeText(domain)
  );

  const domainSignals =
    assessment?.cvProfile?.domainSignals?.map((domain) =>
      normalizeText(domain)
    ) || [];

  const domainSignalMatch = relevantDomains.some((domain) =>
    domainSignals.some(
      (signal) => signal.includes(domain) || domain.includes(signal)
    )
  );

  if (domainSignalMatch) {
    return true;
  }

  const profileText = buildAssessmentSearchText(assessment);

  const textMatch = relevantDomains.some((domain) =>
    profileText.includes(domain)
  );

  if (textMatch) {
    return true;
  }

  if (direction.domainSpecificityRequired === "high") {
    return false;
  }

  return false;
}

function getTransitionLabel(direction, flags, totalScore, fitBand) {
  const isHighFinancialRisk = direction.financialRiskLevel === "high";

  if (
    fitBand === "Bridge Required" &&
    direction.transitionCategory === "open_transition"
  ) {
    return {
      label: "Market-credible path",
      sublabel: "Structurally accessible but low overall fit",
      treatment: "secondary",
      showBridges: false,
    };
  }

  if (flags.includes("domain_credibility_gap")) {
    return {
      label: "Credibility gap",
      sublabel: "Domain-specific experience not detected",
      treatment: "secondary",
      showBridges: true,
    };
  }

  if (direction.transitionCategory === "credentialed") {
    return {
      label: "Requires credential",
      sublabel: "Regulated license or certification needed",
      treatment: "flagged",
      showBridges: direction.bridgeDirections?.length > 0,
    };
  }

  if (direction.transitionCategory === "bridge_friendly") {
    if (direction.transitionPathway === "stretch") {
      return {
        label: isHighFinancialRisk
          ? "Stretch path — high financial risk"
          : "Stretch path",
        sublabel:
          "Significant gap in autonomy, ambiguity tolerance, or execution pressure",
        treatment: "secondary",
        showBridges: direction.bridgeDirections?.length > 0,
      };
    }

    return {
      label: "Bridge path",
      sublabel:
        direction.bridgeDirections?.length > 0
          ? "Credible via intermediate step"
          : "Repositioning of existing experience needed",
      treatment: "main",
      showBridges: direction.bridgeDirections?.length > 0,
    };
  }

  if (direction.transitionCategory === "domain_heavy") {
    return {
      label: "Credible now",
      sublabel: "Strong domain background confirmed",
      treatment: "main",
      showBridges: false,
    };
  }

  return {
    label: isHighFinancialRisk
      ? "Credible now — high financial risk"
      : "Credible now",
    sublabel: "Direct transition with existing background",
    treatment: "main",
    showBridges: false,
  };
}

function resolveBridgeDirections(directionIds, library, assessment = null) {
  if (!directionIds || directionIds.length === 0) {
    return [];
  }

  return directionIds
    .map((id) => {
      const found = library.find((role) => role.directionId === id);

      if (!found) {
        return null;
      }

      return {
        directionId: id,
        directionLabel: assessment
          ? getDisplayDirectionLabel(found, assessment)
          : found.directionLabel,
      };
    })
    .filter(Boolean);
}

function buildScoreBreakdown(scores, weights) {
  return {
    competency: {
      score: scores.competency,
      weight: Number((weights.competencyFit * 100).toFixed(1)),
      contribution: Number(
        (scores.competency * weights.competencyFit).toFixed(1)
      ),
    },
    anchor: {
      score: scores.anchor,
      weight: Number((weights.anchorFit * 100).toFixed(1)),
      contribution: Number((scores.anchor * weights.anchorFit).toFixed(1)),
    },
    financial: {
      score: scores.financial,
      weight: Number((weights.financialViability * 100).toFixed(1)),
      contribution: Number(
        (scores.financial * weights.financialViability).toFixed(1)
      ),
    },
    durability: {
      score: scores.durability,
      weight: Number((weights.roleDurability * 100).toFixed(1)),
      contribution: Number(
        (scores.durability * weights.roleDurability).toFixed(1)
      ),
    },
  };
}

function getAiDurabilityTone(aiDurabilityRating) {
  if (aiDurabilityRating === "D4") {
    return "highly_durable";
  }

  if (aiDurabilityRating === "D3") {
    return "durable";
  }

  if (aiDurabilityRating === "D2") {
    return "transforming";
  }

  if (aiDurabilityRating === "D1") {
    return "pressured";
  }

  return "avoid_or_declining";
}

function getPathType(recommendation) {
  if (recommendation.transitionFlags?.includes("domain_credibility_gap")) {
    return "credibility_gap";
  }

  if (recommendation.transitionCategory === "credentialed") {
    return "credentialed";
  }

  if (recommendation.transitionPathway === "bridge") {
    return "bridge";
  }

  if (recommendation.transitionPathway === "stretch") {
    return "stretch";
  }

  return "direct";
}

function normalizeLabelFromKey(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getAnchorName(anchorId) {
  return anchorNames[anchorId] || normalizeLabelFromKey(anchorId);
}

function buildAnchorInputFactors(anchors) {
  const entries = Object.entries(anchors || {})
    .map(([anchorId, value]) => ({
      anchorId,
      label: getAnchorName(anchorId),
      score: Number(value) || 0,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    dominant: entries.slice(0, 3),
    secondary: entries.slice(3, 5),
    all: entries,
  };
}

function buildFinancialInputFactors(financialReality) {
  const monthlyIncomeFloor =
    Number(financialReality?.minimumMonthlyIncome) || 0;

  return {
    monthlyIncomeFloor,
    annualIncomeFloor: monthlyIncomeFloor * 12,
    runwayMonths: Number(financialReality?.savingsRunwayMonths) || 0,
    incomeDropTolerance:
      financialReality?.incomeDropTolerance ||
      financialReality?.toleranceForIncomeDrop ||
      null,
    stableIncomeNeed:
      financialReality?.stableIncomeNeed ||
      financialReality?.needForStableIncome ||
      null,
    bridgeRoleWillingness:
      financialReality?.bridgeRoleWillingness ||
      financialReality?.willingnessToUseBridgeRole ||
      null,
    retrainingInvestmentCapacity:
      financialReality?.retrainingInvestmentCapacity ||
      financialReality?.abilityToInvestInRetraining ||
      null,
  };
}

function buildTransitionInputFactors(assessment) {
  const constraints =
    assessment?.transitionConstraints ||
    assessment?.constraints ||
    assessment?.practicalConstraints ||
    {};

  return {
    locationConstraints:
      constraints.locationConstraints ||
      constraints.location ||
      assessment?.locationConstraints ||
      null,
    workAuthorization:
      constraints.workAuthorization || assessment?.workAuthorization || null,
    timeAvailablePerWeek:
      constraints.timeAvailablePerWeek ||
      constraints.weeklyTimeAvailable ||
      null,
    workModePreference:
      constraints.workModePreference ||
      constraints.remoteHybridOnsitePreference ||
      constraints.remotePreference ||
      null,
    retrainingWillingness:
      constraints.retrainingWillingness ||
      constraints.willingnessToRetrain ||
      null,
    bridgeRoleWillingness:
      constraints.bridgeRoleWillingness ||
      constraints.willingnessToUseBridgeRole ||
      assessment?.financialReality?.bridgeRoleWillingness ||
      null,
    networkingComfort:
      constraints.networkingComfort || constraints.salesComfort || null,
    riskTolerance: constraints.riskTolerance || assessment?.riskTolerance || null,
  };
}

function buildCvInputFactors(assessment) {
  const cvProfile = assessment?.cvProfile || {};
  const competencySignals = Array.isArray(cvProfile.competencySignals)
    ? cvProfile.competencySignals
    : [];

  const topCompetencySignals = competencySignals
    .filter(
      (signal) =>
        signal.signalStrength === "strong" ||
        signal.signalStrength === "moderate"
    )
    .slice(0, 6)
    .map((signal) => ({
      competencyId: signal.competencyId,
      competencyName:
        signal.competencyName ||
        competencyNames[signal.competencyId] ||
        `Competency ${signal.competencyId}`,
      signalStrength: signal.signalStrength,
      evidence: signal.evidence || null,
    }));

  return {
    cvSource: cvProfile.cvSource || null,
    confidence: cvProfile.confidence || null,
    careerSummary: cvProfile.careerSummary || null,
    domainSignals: cvProfile.domainSignals || [],
    senioritySignal: cvProfile.senioritySignal || null,
    leadershipScope: cvProfile.leadershipScope || null,
    entrepreneurialSignals: cvProfile.entrepreneurialSignals || [],
    tradeSignals: cvProfile.tradeSignals || [],
    tenurePattern: cvProfile.tenurePattern || null,
    topCompetencySignals,
  };
}

function buildCredentialInputFactors(professionalCredentials) {
  const credentials = Array.isArray(professionalCredentials?.credentials)
    ? professionalCredentials.credentials
    : [];

  return {
    hasCredentials:
      professionalCredentials?.hasCredentials ||
      professionalCredentials?.hasProfessionalCredentials ||
      credentials.length > 0 ||
      false,
    credentials: credentials.map((credential) => ({
      type: credential.type || null,
      status: credential.status || null,
      jurisdiction: credential.jurisdiction || null,
    })),
  };
}

function buildPriorityWeightInputFactors(priorityWeights) {
  const normalized = normalizeWeights(priorityWeights);

  return {
    raw: priorityWeights || null,
    normalizedPercentages: {
      competencyFit: Number((normalized.competencyFit * 100).toFixed(1)),
      anchorFit: Number((normalized.anchorFit * 100).toFixed(1)),
      financialViability: Number(
        (normalized.financialViability * 100).toFixed(1)
      ),
      roleDurability: Number((normalized.roleDurability * 100).toFixed(1)),
    },
  };
}

function buildAssessmentInputFactors(assessment) {
  return {
    careerAnchors: buildAnchorInputFactors(assessment?.anchors || {}),
    financialReality: buildFinancialInputFactors(
      assessment?.financialReality || {}
    ),
    transitionConstraints: buildTransitionInputFactors(assessment),
    cvSignals: buildCvInputFactors(assessment),
    professionalCredentials: buildCredentialInputFactors(
      assessment?.professionalCredentials || {}
    ),
    priorityWeights: buildPriorityWeightInputFactors(
      assessment?.priorityWeights || null
    ),
  };
}

function buildCurrentProfileNode(assessment) {
  const domainSignals = assessment?.cvProfile?.domainSignals || [];
  const senioritySignal = assessment?.cvProfile?.senioritySignal || null;
  const leadershipScope = assessment?.cvProfile?.leadershipScope || null;
  const isTalentProfile = hasTalentAcquisitionProfile(assessment);

  const labelParts = [];

  if (isTalentProfile) {
    labelParts.push("Talent");
  }

  if (domainSignals.includes("human_resources")) {
    labelParts.push("People");
  }

  if (domainSignals.includes("operations")) {
    labelParts.push("Operations");
  }

  if (domainSignals.includes("technology")) {
    labelParts.push("Technology");
  }

  if (domainSignals.includes("entrepreneurship")) {
    labelParts.push("Entrepreneurship");
  }

  if (domainSignals.includes("consulting")) {
    labelParts.push("Advisory");
  }

  const label =
    labelParts.length > 0
      ? [...new Set(labelParts)].slice(0, 3).join(" / ")
      : assessment?.currentRole || "Current profile";

  return {
    type: "current_profile",
    label,
    mapQuadrant: "corporate_operational",
    mapCluster: isTalentProfile
      ? "workforce_intelligence"
      : "business_operations",
    description:
      "Current profile position based on CV domain signals, seniority, and career history.",
    domainSignals,
    senioritySignal,
    leadershipScope,
  };
}

function buildPrimaryMapNode(recommendation) {
  const mapMetadata = getCareerMapMetadata(recommendation);

  return {
    type: "primary_direction",
    rank: recommendation.rank,
    directionId: recommendation.directionId,
    directionLabel: recommendation.directionLabel,
    mapQuadrant: mapMetadata.mapQuadrant,
    mapCluster: mapMetadata.mapCluster,
    mapTags: mapMetadata.mapTags || [],
    aiDurabilityRating: recommendation.aiDurabilityRating,
    aiDurabilityTone: getAiDurabilityTone(recommendation.aiDurabilityRating),
    transitionCategory: recommendation.transitionCategory,
    transitionPathway: recommendation.transitionPathway,
    transitionLabel: recommendation.transitionLabel,
    pathType: getPathType(recommendation),
    fitBand: recommendation.fitBand,
    totalScore: recommendation.scores?.total,
    financialPathway: recommendation.financialPathway,
    context: recommendation.context,
  };
}

function directionLooksCredentialedOrLicensed(direction) {
  if (!direction) {
    return false;
  }

  if (direction.eligibility) {
    return true;
  }

  if (direction.transitionCategory === "credentialed") {
    return true;
  }

  const text = directionSearchText(direction);

  const licensedKeywords = [
    "therapy",
    "therapist",
    "counseling",
    "counselor",
    "clinical",
    "psychology",
    "psychologist",
    "social worker",
    "financial planning",
    "financial planner",
    "wealth management",
    "investment advisor",
    "registered investment",
    "legal",
    "lawyer",
    "attorney",
    "medical",
    "physician",
    "nursing",
    "nurse",
    "accounting",
    "cpa",
    "tax practice",
  ];

  return licensedKeywords.some((keyword) => text.includes(keyword));
}

function hasMatchingCredentialForDirection(assessment, direction) {
  const professionalCredentials = assessment?.professionalCredentials || {};
  const credentials = Array.isArray(professionalCredentials?.credentials)
    ? professionalCredentials.credentials
    : [];

  if (credentials.length === 0) {
    return false;
  }

  if (direction.eligibility) {
    const eligibilityResult = evaluateEligibility(
      professionalCredentials,
      direction
    );

    return Boolean(eligibilityResult.matchedCredential);
  }

  return false;
}

function canShowAsAdjacentDirection(assessment, direction) {
  const requiresCredential = directionLooksCredentialedOrLicensed(direction);

  if (!requiresCredential) {
    return true;
  }

  return hasMatchingCredentialForDirection(assessment, direction);
}

function isBroadEntrepreneurialAdjacent(direction) {
  if (!direction) {
    return false;
  }

  const text = directionSearchText(direction);

  const broadEntrepreneurialKeywords = [
    "startup leadership",
    "founder",
    "early operator",
    "own venture",
    "service business",
    "local business",
  ];

  return broadEntrepreneurialKeywords.some((keyword) => text.includes(keyword));
}

function canShowAsNearbyTrajectory(direction) {
  if (!direction) {
    return false;
  }

  if (isBroadEntrepreneurialAdjacent(direction)) {
    return false;
  }

  const mapMetadata = getCareerMapMetadata(direction);

  const preferredNearbyClusters = new Set([
    "marketplace_platforms",
    "workforce_intelligence",
    "people_analytics_hr_tech",
    "ai_transformation",
    "business_operations",
  ]);

  return preferredNearbyClusters.has(mapMetadata.mapCluster);
}

function hasMapRelevance(direction, assessment, primaryClusterSet) {
  const mapMetadata = getCareerMapMetadata(direction);
  const domainSignals = assessment?.cvProfile?.domainSignals || [];
  const profileText = buildAssessmentSearchText(assessment);
  const tags = mapMetadata.mapTags || [];
  const isTalentProfile = hasTalentAcquisitionProfile(assessment);

  const tagMatchesDomain = tags.some((tag) =>
    domainSignals.some((domain) =>
      normalizeText(tag).includes(normalizeText(domain))
    )
  );

  const tagMatchesSummary = tags.some((tag) =>
    profileText.includes(normalizeText(tag))
  );

  const clusterMatchesPrimary = primaryClusterSet.has(mapMetadata.mapCluster);

  const talentRelevant =
    isTalentProfile &&
    [
      "workforce_intelligence",
      "people_analytics_hr_tech",
      "ai_transformation",
      "business_operations",
    ].includes(mapMetadata.mapCluster);

  const strategicallyRelevantClusters = new Set([
    "marketplace_platforms",
    "workforce_intelligence",
    "people_analytics_hr_tech",
    "ai_transformation",
    "business_operations",
    "independent_advisory",
  ]);

  const strategicallyRelevant =
    strategicallyRelevantClusters.has(mapMetadata.mapCluster) &&
    (domainSignals.includes("operations") ||
      domainSignals.includes("human_resources") ||
      domainSignals.includes("technology") ||
      domainSignals.includes("consulting") ||
      domainSignals.includes("entrepreneurship"));

  return (
    tagMatchesDomain ||
    tagMatchesSummary ||
    clusterMatchesPrimary ||
    talentRelevant ||
    strategicallyRelevant
  );
}

function buildAdjacentMapNodes(assessment, primaryRecommendations, limit = 5) {
  const primaryIds = new Set(
    primaryRecommendations.map((recommendation) => recommendation.directionId)
  );

  const primaryClusterSet = new Set(
    primaryRecommendations.map(
      (recommendation) => getCareerMapMetadata(recommendation).mapCluster
    )
  );

  const isTalentProfile = hasTalentAcquisitionProfile(assessment);

  const adjacentCandidates = roleLibrary
    .filter((direction) => !primaryIds.has(direction.directionId))
    .filter((direction) => direction.aiDurabilityRating !== "D0")
    .filter((direction) => canShowAsAdjacentDirection(assessment, direction))
    .filter((direction) => canShowAsNearbyTrajectory(direction))
    .filter((direction) =>
      hasMapRelevance(direction, assessment, primaryClusterSet)
    )
    .map((direction) => {
      const mapMetadata = getCareerMapMetadata(direction);

      let relevanceScore = 0;

      if (primaryClusterSet.has(mapMetadata.mapCluster)) {
        relevanceScore += 30;
      }

      if (
        [
          "marketplace_platforms",
          "workforce_intelligence",
          "people_analytics_hr_tech",
          "ai_transformation",
        ].includes(mapMetadata.mapCluster)
      ) {
        relevanceScore += 25;
      }

      if (
        isTalentProfile &&
        [
          "workforce_intelligence",
          "people_analytics_hr_tech",
          "ai_transformation",
        ].includes(mapMetadata.mapCluster)
      ) {
        relevanceScore += 30;
      }

      if (
        isTalentProfile &&
        isMarketplaceDirection(direction) &&
        !hasMarketplaceProfile(assessment)
      ) {
        relevanceScore -= 25;
      }

      if (direction.aiDurabilityRating === "D4") {
        relevanceScore += 20;
      } else if (direction.aiDurabilityRating === "D3") {
        relevanceScore += 15;
      }

      if (
        direction.transitionCategory === "bridge_friendly" ||
        direction.transitionPathway === "bridge"
      ) {
        relevanceScore += 10;
      }

      return {
        type: "adjacent_trajectory",
        directionId: direction.directionId,
        directionLabel: getDisplayDirectionLabel(direction, assessment),
        mapQuadrant: mapMetadata.mapQuadrant,
        mapCluster: mapMetadata.mapCluster,
        mapTags: mapMetadata.mapTags || [],
        aiDurabilityRating: direction.aiDurabilityRating,
        aiDurabilityTone: getAiDurabilityTone(direction.aiDurabilityRating),
        transitionCategory: direction.transitionCategory,
        transitionPathway: direction.transitionPathway,
        pathType: direction.transitionPathway || "adjacent",
        relevanceScore,
        reason: getAdjacentRouteReason(mapMetadata.mapCluster),
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return adjacentCandidates;
}

function getAdjacentRouteReason(mapCluster) {
  const reasons = {
    marketplace_platforms:
      "Nearby route supported by marketplace, platform, and ecosystem operating experience.",
    workforce_intelligence:
      "Nearby route supported by workforce planning, talent systems, and people operations signals.",
    people_analytics_hr_tech:
      "Nearby route supported by HR, analytics, AI tools, and workforce systems experience.",
    ai_transformation:
      "Nearby route supported by AI workflow, automation, and operating model experience.",
    business_operations:
      "Nearby route supported by business operations, execution, and cross-functional leadership.",
    independent_advisory:
      "Nearby route supported by consulting, advisory, and client-facing experience.",
  };

  return (
    reasons[mapCluster] || "Nearby trajectory supported by the profile signals."
  );
}

function buildLongerPathNodes(primaryRecommendations, assessment) {
  const primaryIds = new Set(
    primaryRecommendations.map((recommendation) => recommendation.directionId)
  );

  const longerPathMap = new Map();

  primaryRecommendations.forEach((recommendation) => {
    const longerPathOptions = recommendation.longerPathOptions || [];

    longerPathOptions.forEach((option) => {
      if (primaryIds.has(option.directionId)) {
        return;
      }

      const fullDirection = roleLibrary.find(
        (direction) => direction.directionId === option.directionId
      );

      if (!fullDirection) {
        return;
      }

      if (!canShowAsAdjacentDirection(assessment, fullDirection)) {
        return;
      }

      if (!canShowAsNearbyTrajectory(fullDirection)) {
        return;
      }

      const mapMetadata = getCareerMapMetadata(fullDirection);

      longerPathMap.set(option.directionId, {
        type: "longer_path",
        directionId: option.directionId,
        directionLabel: getDisplayDirectionLabel(fullDirection, assessment),
        connectedFrom: recommendation.directionId,
        connectedFromLabel: recommendation.directionLabel,
        mapQuadrant: mapMetadata.mapQuadrant,
        mapCluster: mapMetadata.mapCluster,
        mapTags: mapMetadata.mapTags || [],
        aiDurabilityRating: fullDirection.aiDurabilityRating,
        aiDurabilityTone: getAiDurabilityTone(fullDirection.aiDurabilityRating),
        pathType: "longer_path",
        reason: `May become more realistic after building credibility through ${recommendation.directionLabel}.`,
      });
    });
  });

  return Array.from(longerPathMap.values());
}

function buildCareerMapSummary(primaryNodes, adjacentNodes, longerPathNodes) {
  const primaryClusters = [
    ...new Set(primaryNodes.map((node) => node.mapCluster)),
  ];

  const allVisibleNodes = [
    ...primaryNodes,
    ...adjacentNodes,
    ...longerPathNodes,
  ];

  const hasMarketplace = allVisibleNodes.some(
    (node) => node.mapCluster === "marketplace_platforms"
  );

  const hasWorkforce = allVisibleNodes.some(
    (node) =>
      node.mapCluster === "workforce_intelligence" ||
      node.mapCluster === "people_analytics_hr_tech"
  );

  const hasIndependent = allVisibleNodes.some(
    (node) =>
      node.mapQuadrant === "autonomous_operational" ||
      node.mapQuadrant === "autonomous_human"
  );

  let mainPattern = "Business operations and leadership";

  if (hasMarketplace && hasWorkforce) {
    mainPattern =
      "Marketplace operations, workforce systems, and business leadership";
  } else if (hasMarketplace) {
    mainPattern = "Marketplace operations and business systems";
  } else if (hasWorkforce) {
    mainPattern = "Workforce intelligence and people systems";
  } else if (primaryClusters.includes("enterprise_leadership")) {
    mainPattern = "Enterprise leadership and business operations";
  }

  const transitionStyle = hasIndependent
    ? "Direct enterprise paths with adjacent independent trajectories"
    : "Mostly direct enterprise paths";

  return {
    mainPattern,
    transitionStyle,
    bridgeGoal:
      "Use the strongest current directions to strengthen credibility for adjacent trajectories.",
    mainCaution:
      "Adjacent routes are not final recommendations; they are nearby paths worth validating.",
  };
}

function getDomainCalibrationAdjustment(direction, assessment) {
  const isTalentProfile = hasTalentAcquisitionProfile(assessment);

  if (!isTalentProfile) {
    return {
      adjustment: 0,
      reasons: [],
    };
  }

  let adjustment = 0;
  const reasons = [];

  if (direction.directionId === "BF-5-E") {
    adjustment += 30;
    reasons.push(
      "Talent acquisition profile strongly supports workforce planning / talent intelligence."
    );
  }

  if (direction.directionId === "BF-6-E") {
    adjustment += 28;
    reasons.push(
      "Talent acquisition profile supports people analytics and HR technology."
    );
  }

  if (direction.directionId === "BF-4-E") {
    adjustment += 30;
    reasons.push(
      "Talent acquisition profile supports HR / people operations leadership."
    );
  }

  if (direction.directionId === "BF-8-IF") {
    adjustment += 12;
    reasons.push(
      "Talent acquisition experience can support career and outplacement strategy."
    );
  }

  if (direction.directionId === "ED-5-IF") {
    adjustment += 8;
    reasons.push(
      "People leadership experience can support leadership development paths."
    );
  }

  if (isGenericManagementDirection(direction)) {
    const hasBusinessOwnership = hasBroadBusinessOwnershipEvidence(assessment);
    adjustment += hasBusinessOwnership ? -8 : -30;
    reasons.push(
      hasBusinessOwnership
        ? "Generic management direction reduced because a more specific expertise path is available."
        : "Generic management direction reduced because broader business ownership evidence was not detected."
    );
  }

  if (isMarketplaceDirection(direction) && !hasMarketplaceProfile(assessment)) {
    adjustment -= 24;
    reasons.push(
      "Marketplace direction reduced because marketplace/platform evidence was not detected."
    );
  }

  if (
    isSupplyChainDirection(direction) &&
    !hasOperationsSupplyChainProfile(assessment)
  ) {
    adjustment -= 22;
    reasons.push(
      "Supply chain / operations consulting direction reduced because specific domain evidence was not detected."
    );
  }

  if (
    direction.directionId === "CM-5-IF" &&
    !textIncludesAny(buildAssessmentSearchText(assessment), [
      "ai",
      "automation",
      "digital transformation",
      "workflow automation",
      "hr tech",
      "people analytics",
    ])
  ) {
    adjustment -= 10;
    reasons.push(
      "AI transformation direction reduced because direct AI / automation evidence was limited."
    );
  }

  return {
    adjustment,
    reasons,
  };
}

function isDomainSpecificRecommendation(recommendation, assessment) {
  if (hasTalentAcquisitionProfile(assessment)) {
    return isTalentDirection(recommendation);
  }

  return false;
}

function shouldSuppressPrimaryForDomainProfile(recommendation, assessment) {
  if (!hasTalentAcquisitionProfile(assessment)) {
    return false;
  }

  if (isTalentDirection(recommendation)) {
    return false;
  }

  if (
    isGenericManagementDirection(recommendation) &&
    !hasBroadBusinessOwnershipEvidence(assessment)
  ) {
    return true;
  }

  if (
    isMarketplaceDirection(recommendation) &&
    !hasMarketplaceProfile(assessment)
  ) {
    return true;
  }

  if (
    isSupplyChainDirection(recommendation) &&
    !hasOperationsSupplyChainProfile(assessment)
  ) {
    return true;
  }

  return false;
}

function sortRecommendationsByScore(recommendations) {
  return [...recommendations].sort((a, b) => b.scores.total - a.scores.total);
}

function pushUniqueRecommendation(target, recommendation) {
  if (!recommendation) {
    return;
  }

  if (target.some((item) => item.directionId === recommendation.directionId)) {
    return;
  }

  target.push(recommendation);
}

function selectFinalRecommendations(results, assessment, limit = 3) {
  const sorted = sortRecommendationsByScore(results);

  if (!hasTalentAcquisitionProfile(assessment)) {
    return sorted.slice(0, limit).map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
  }

  const selected = [];

  const domainSpecificCandidates = sorted.filter((recommendation) =>
    isDomainSpecificRecommendation(recommendation, assessment)
  );

  const acceptableDomainCandidates = domainSpecificCandidates.filter(
    (recommendation) => recommendation.scores.total >= 45
  );

  acceptableDomainCandidates.slice(0, 3).forEach((recommendation) => {
    pushUniqueRecommendation(selected, recommendation);
  });

  const nonSuppressedCandidates = sorted.filter(
    (recommendation) =>
      !shouldSuppressPrimaryForDomainProfile(recommendation, assessment)
  );

  for (const recommendation of nonSuppressedCandidates) {
    if (selected.length >= limit) {
      break;
    }

    pushUniqueRecommendation(selected, recommendation);
  }

  if (selected.length < limit && hasBroadBusinessOwnershipEvidence(assessment)) {
    const generalCandidates = sorted.filter((recommendation) =>
      isGenericManagementDirection(recommendation)
    );

    for (const recommendation of generalCandidates) {
      if (selected.length >= limit) {
        break;
      }

      pushUniqueRecommendation(selected, recommendation);
    }
  }

  for (const recommendation of sorted) {
    if (selected.length >= limit) {
      break;
    }

    pushUniqueRecommendation(selected, recommendation);
  }

  return selected.slice(0, limit).map((result, index) => ({
    ...result,
    rank: index + 1,
  }));
}

export function generateRecommendations(assessment) {
  const weights = normalizeWeights(assessment?.priorityWeights);

  const competencySignals = assessment?.cvProfile?.competencySignals || [];
  const anchors = assessment?.anchors || {};
  const financialReality = assessment?.financialReality || {};
  const professionalCredentials = assessment?.professionalCredentials || {};

  const cvAvailable =
    assessment?.cvProfile?.cvSource === "claude_parsed" &&
    Array.isArray(competencySignals) &&
    competencySignals.length > 0;

  const fullDirections = roleLibrary
    .map((role) => getFullDirection(role.directionId))
    .filter(Boolean);

  const results = [];

  for (const direction of fullDirections) {
    if (direction.aiDurabilityRating === "D0") {
      continue;
    }

    if (!direction.financialPathway) {
      continue;
    }

    const eligibilityResult = evaluateEligibility(
      professionalCredentials,
      direction
    );

    if (!eligibilityResult.passed) {
      continue;
    }

    const flags = [];

    let competencyScore = calcCompetencyScore(competencySignals, direction);

    if (
      direction.transitionCategory === "domain_heavy" &&
      direction.domainSpecificityRequired === "high" &&
      !hasDomainMatch(direction, assessment)
    ) {
      competencyScore = Math.round(competencyScore * 0.45);
      flags.push("domain_credibility_gap");
    }

    const domainCalibration = getDomainCalibrationAdjustment(
      direction,
      assessment
    );

    if (domainCalibration.adjustment > 0) {
      flags.push("domain_boost");
    }

    if (domainCalibration.adjustment < 0) {
      flags.push("domain_penalty");
    }

    const competencyExplanation = buildCompetencyExplanation(
      competencySignals,
      direction
    );

    const {
      score: anchorScore,
      warnings: anchorWarnings,
      anchorMatches,
      anchorConflicts,
    } = calcAnchorScore(anchors, direction);

    const financialResult = calcFinancialScore(financialReality, direction);
    const durabilityScore = calcDurabilityScore(direction);

    const scores = {
      competency: competencyScore,
      anchor: anchorScore,
      financial: financialResult.score,
      durability: durabilityScore,
    };

    const baseTotal = Math.round(
      scores.competency * weights.competencyFit +
        scores.anchor * weights.anchorFit +
        scores.financial * weights.financialViability +
        scores.durability * weights.roleDurability
    );

    const total = clampScore(baseTotal + domainCalibration.adjustment);
    const fitBand = getFitBand(total, financialResult.flag);

    const scoreBreakdown = buildScoreBreakdown(
      {
        ...scores,
        total: baseTotal,
      },
      weights
    );

    results.push({
      rank: 0,
      directionId: direction.directionId,
      directionLabel: getDisplayDirectionLabel(direction, assessment),
      category: direction.category,
      metaDirection: direction.metaDirection,
      context: direction.context,
      contextCode: direction.contextCode,
      onetCodes: direction.onetCodes,
      onetTitles: direction.onetTitles,
      aiDurabilityRating: direction.aiDurabilityRating,
      aiExposureSource: direction.aiExposureSource,
      transitionCategory: direction.transitionCategory,
      transitionPathway: direction.transitionPathway,
      stretchabilityRequired: direction.stretchabilityRequired,
      domainSpecificityRequired: direction.domainSpecificityRequired,
      financialRiskLevel: direction.financialRiskLevel,
      transitionFlags: flags,
      transitionLabel: getTransitionLabel(direction, flags, total, fitBand),
      bridgeDirections: resolveBridgeDirections(
        direction.bridgeDirections || [],
        roleLibrary,
        assessment
      ),
      longerPathOptions: resolveBridgeDirections(
        direction.longerPathOptions || [],
        roleLibrary,
        assessment
      ),
      d4EvolutionPath: direction.d4EvolutionPath,
      salarySource: direction.salarySource,
      salarySources: direction.salarySources,
      salaryLastUpdated: direction.salaryLastUpdated,
      salaryValidUntil: direction.salaryValidUntil,
      salaryDataQuality: direction.salaryDataQuality,
      salaryBenchmarkVersion: direction.salaryBenchmarkVersion,
      financialPathway: direction.financialPathway,
      financialComparison: {
        annualFloor: financialResult.annualFloor,
        avg12month: financialResult.avg12month,
        ratio: financialResult.ratio,
      },
      scores: {
        ...scores,
        baseTotal,
        total,
      },
      scoreBreakdown,
      domainCalibration,
      fitBand,
      financialFlag: financialResult.flag,
      eligibility: eligibilityResult,
      eligibilityWarning: eligibilityResult.warning,
      financialExplanation: {
        explanation: financialResult.explanation,
        annualFloor: financialResult.annualFloor,
        avg12month: financialResult.avg12month,
        ratio: financialResult.ratio,
        runwayMonths: financialResult.runwayMonths,
        runwayAdjustment: financialResult.runwayAdjustment,
      },
      anchorWarnings,
      anchorMatches,
      anchorConflicts,
      ...competencyExplanation,
      cvConfidence: cvAvailable ? "full" : "low",
      roleLibraryVersion: direction.version,
    });
  }

  return selectFinalRecommendations(results, assessment, 3);
}

export function generateCareerMap(assessment, recommendations) {
  const primaryRecommendations = Array.isArray(recommendations)
    ? recommendations
    : [];

  const currentProfileNode = buildCurrentProfileNode(assessment);
  const primaryNodes = primaryRecommendations.map(buildPrimaryMapNode);
  const adjacentNodes = buildAdjacentMapNodes(assessment, primaryRecommendations);
  const longerPathNodes = buildLongerPathNodes(
    primaryRecommendations,
    assessment
  );
  const inputFactors = buildAssessmentInputFactors(assessment);

  return {
    version: "career-map-v1.0",
    currentProfileNode,
    primaryNodes,
    adjacentNodes,
    longerPathNodes,
    inputFactors,
    summary: buildCareerMapSummary(
      primaryNodes,
      adjacentNodes,
      longerPathNodes
    ),
  };
}