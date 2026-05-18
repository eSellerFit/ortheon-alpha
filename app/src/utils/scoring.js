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

const restrictedHrWorkforceDirectionIds = new Set([
  "BF-4-E",
  "BF-5-E",
  "BF-6-E",
  "BF-8-IF",
]);

const talentDirectionIds = new Set([
  "BF-4-E",
  "BF-5-E",
  "BF-6-E",
  "BF-8-IF",
]);

const technologyExecutiveDirectionIds = new Set([
  "TE-1-E",
  "TE-2-E",
  "TE-3-E",
  "TE-4-IF",
  "TE-5-E",
]);

const genericManagementDirectionIds = new Set([
  "MG-1-E",
  "MG-6-E",
  "MG-8-E",
  "MG-13-E",
]);

const allowedHrDomainSignals = new Set([
  "human resources",
  "human_resources",
  "people operations",
  "people_operations",
  "talent acquisition",
  "talent_acquisition",
  "talent management",
  "talent_management",
  "workforce planning",
  "workforce_planning",
  "people analytics",
  "people_analytics",
  "hr analytics",
  "hr_analytics",
  "hr tech",
  "hr_tech",
  "hris",
  "recruiting",
  "recruitment",
  "staffing",
  "outplacement",
]);

const explicitHrTitlePhrases = [
  "hr manager",
  "hr director",
  "human resources manager",
  "human resources director",
  "hr business partner",
  "hrbp",
  "people partner",
  "people operations manager",
  "people operations director",
  "talent acquisition manager",
  "talent acquisition director",
  "recruiting manager",
  "recruitment manager",
  "recruiter",
  "sourcer",
  "talent partner",
  "workforce planning manager",
  "people analytics manager",
  "hris manager",
  "compensation manager",
  "total rewards manager",
  "learning and development manager",
  "l&d manager",
  "outplacement consultant",
  "career transition consultant",
];

const technologyDomainSignals = new Set([
  "technology",
  "software engineering",
  "software_engineering",
  "data science",
  "data_science",
  "ai",
  "artificial intelligence",
  "machine learning",
  "product",
  "startup",
  "operations",
]);

const technologyKeywords = [
  "cto",
  "chief technology officer",
  "chief technical officer",
  "chief of ai",
  "vp engineering",
  "vp of technology",
  "vp technology",
  "technical director",
  "technology director",
  "head of engineering",
  "head of development",
  "software engineering",
  "software development",
  "architecture",
  "enterprise architecture",
  "platform architecture",
  "platform modernization",
  "cloud",
  "devops",
  "data center",
  "infrastructure",
  "cybersecurity",
  "ai",
  "artificial intelligence",
  "genai",
  "generative ai",
  "llm",
  "machine learning",
  "digital transformation",
];

const studentProfileKeywords = [
  "high school",
  "9th grade",
  "10th grade",
  "11th grade",
  "12th grade",
  "expected graduation",
  "summer job",
  "school student",
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
  "amazon",
  "shopify",
  "etsy",
  "wildberries",
];

const operationsSupplyChainKeywords = [
  "supply chain",
  "logistics",
  "warehouse",
  "inventory",
  "manufacturing",
  "procurement",
  "fulfillment",
  "lean",
  "process improvement",
];

const broadBusinessOwnershipKeywords = [
  "p&l",
  "profit and loss",
  "business unit",
  "country manager",
  "regional manager",
  "regional director",
  "general manager",
  "managing director",
  "revenue ownership",
  "budget ownership",
  "business ownership",
];

const smallBusinessAdvisorKeywords = [
  "small business",
  "business advisor",
  "business mentor",
  "score mentor",
  "startup advisor",
  "entrepreneurship education",
  "smb",
  "local business",
];

const nonprofitFundraisingKeywords = [
  "nonprofit",
  "non-profit",
  "fundraising",
  "development leadership",
  "donor",
  "grant writing",
  "grants",
  "mission organization",
  "philanthropy",
];

const trainingLndKeywords = [
  "training",
  "trainer",
  "learning and development",
  "l&d",
  "corporate training",
  "curriculum",
  "instructional design",
  "facilitation",
  "workshop",
  "teaching",
  "education",
  "coaching",
  "leadership development",
];

const technologyPrimaryPriority = {
  "TE-1-E": 1,
  "TE-2-E": 2,
  "TE-3-E": 3,
  "TE-5-E": 4,
  "TE-4-IF": 5,
  "CM-5-IF": 6,
  "CM-7-ST": 7,
  "CM-6-E": 8,
};

const talentPrimaryPriority = {
  "BF-4-E": 1,
  "BF-5-E": 2,
  "BF-6-E": 3,
  "BF-8-IF": 4,
  "ED-5-IF": 5,
};

function clampScore(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasExactWord(text, word) {
  const normalizedText = normalizeText(text);
  const normalizedWord = normalizeText(word);

  if (!normalizedText || !normalizedWord) {
    return false;
  }

  const regex = new RegExp(
    `(^|\\s|/)${escapeRegExp(normalizedWord)}($|\\s|/)`,
    "i"
  );

  return regex.test(normalizedText);
}

function hasExactPhrase(text, phrase) {
  const normalizedText = ` ${normalizeText(text)} `;
  const normalizedPhrase = ` ${normalizeText(phrase)} `;

  return normalizedText.includes(normalizedPhrase);
}

function textIncludesAny(text, keywords) {
  return keywords.some((keyword) => hasExactPhrase(text, keyword));
}

function getDomainSignals(assessment) {
  return Array.isArray(assessment?.cvProfile?.domainSignals)
    ? assessment.cvProfile.domainSignals.map((domain) => normalizeText(domain))
    : [];
}

function buildAssessmentSearchText(assessment) {
  const cvProfile = assessment?.cvProfile || {};
  const competencySignals = Array.isArray(cvProfile.competencySignals)
    ? cvProfile.competencySignals
    : [];

  const competencyEvidence = competencySignals
    .map((signal) => signal.evidence || "")
    .join(" ");

  const domainSignals = Array.isArray(cvProfile.domainSignals)
    ? cvProfile.domainSignals.join(" ")
    : "";

  return normalizeText(
    [
      assessment?.currentRole,
      assessment?.currentIndustry,
      cvProfile.careerSummary,
      domainSignals,
      cvProfile.senioritySignal,
      cvProfile.leadershipScope,
      cvProfile.tenurePattern,
      competencyEvidence,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function hasStudentProfile(assessment) {
  const profileText = buildAssessmentSearchText(assessment);
  const seniority = normalizeText(assessment?.cvProfile?.senioritySignal);

  const hasStudentText = textIncludesAny(profileText, studentProfileKeywords);

  const looksLikeHighSchool =
    hasStudentText &&
    (hasExactPhrase(profileText, "high school") ||
      hasExactPhrase(profileText, "9th grade") ||
      hasExactPhrase(profileText, "10th grade") ||
      hasExactPhrase(profileText, "11th grade") ||
      hasExactPhrase(profileText, "12th grade") ||
      hasExactPhrase(profileText, "expected graduation"));

  return looksLikeHighSchool || (seniority === "junior" && hasStudentText);
}

function hasHrWorkforceDomainEvidence(assessment) {
  const domainSignals = getDomainSignals(assessment);

  const hasExplicitHrDomain = domainSignals.some((domain) =>
    allowedHrDomainSignals.has(domain)
  );

  if (hasExplicitHrDomain) {
    return true;
  }

  const currentRole = normalizeText(assessment?.currentRole || "");
  const currentIndustry = normalizeText(assessment?.currentIndustry || "");
  const roleOrIndustryText = `${currentRole} ${currentIndustry}`;

  if (hasExactWord(roleOrIndustryText, "hr")) {
    return true;
  }

  return explicitHrTitlePhrases.some((phrase) =>
    hasExactPhrase(roleOrIndustryText, phrase)
  );
}

function hasTalentAcquisitionProfile(assessment) {
  return hasHrWorkforceDomainEvidence(assessment);
}

function hasTechnologyDomainEvidence(assessment) {
  const domainSignals = getDomainSignals(assessment);
  const profileText = buildAssessmentSearchText(assessment);

  const hasDomainSignal = domainSignals.some((domain) =>
    technologyDomainSignals.has(domain)
  );

  return hasDomainSignal || textIncludesAny(profileText, technologyKeywords);
}

function hasTechnologyExecutiveProfile(assessment) {
  const profileText = buildAssessmentSearchText(assessment);
  const seniority = normalizeText(assessment?.cvProfile?.senioritySignal);
  const leadershipScope = normalizeText(assessment?.cvProfile?.leadershipScope);

  const hasExecutiveSeniority =
    seniority === "executive" || seniority === "senior";

  const hasLeadershipScope =
    leadershipScope === "department" ||
    leadershipScope === "organization" ||
    leadershipScope === "cross organization";

  const hasExecutiveTechTitle = textIncludesAny(profileText, [
    "cto",
    "chief technology officer",
    "chief technical officer",
    "chief of ai",
    "technical director",
    "technology director",
    "vp engineering",
    "vp of technology",
    "vp technology",
    "head of engineering",
    "head of development",
  ]);

  return (
    hasTechnologyDomainEvidence(assessment) &&
    (hasExecutiveTechTitle || (hasExecutiveSeniority && hasLeadershipScope))
  );
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

function hasSmallBusinessAdvisorEvidence(assessment) {
  return textIncludesAny(
    buildAssessmentSearchText(assessment),
    smallBusinessAdvisorKeywords
  );
}

function hasNonprofitFundraisingEvidence(assessment) {
  return textIncludesAny(
    buildAssessmentSearchText(assessment),
    nonprofitFundraisingKeywords
  );
}

function hasTrainingLndEvidence(assessment) {
  return textIncludesAny(buildAssessmentSearchText(assessment), trainingLndKeywords);
}

function hasAiTransformationEvidence(assessment) {
  return textIncludesAny(buildAssessmentSearchText(assessment), [
    "ai",
    "artificial intelligence",
    "genai",
    "generative ai",
    "llm",
    "machine learning",
    "automation",
    "digital transformation",
    "ai agents",
    "ai product",
  ]);
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

function isRestrictedHrWorkforceDirection(direction) {
  return restrictedHrWorkforceDirectionIds.has(direction?.directionId);
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
    "human resources",
    "people operations",
    "workforce planning",
    "talent intelligence",
    "people analytics",
    "hr tech",
    "talent acquisition",
    "outplacement",
  ]);
}

function isTechnologyExecutiveDirection(direction) {
  return technologyExecutiveDirectionIds.has(direction?.directionId);
}

function isTechnologyDirection(direction) {
  if (!direction) {
    return false;
  }

  if (isTechnologyExecutiveDirection(direction)) {
    return true;
  }

  const text = directionSearchText(direction);

  return textIncludesAny(text, [
    "technology",
    "software",
    "engineering",
    "platform",
    "ai",
    "machine learning",
    "digital transformation",
    "product operations",
    "data science",
    "technical program",
    "systems engineering",
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

function isSmallBusinessAdvisorDirection(direction) {
  return textIncludesAny(directionSearchText(direction), [
    "small business advisor",
    "small business",
    "business advisor",
    "local business",
  ]);
}

function isNonprofitFundraisingDirection(direction) {
  return textIncludesAny(directionSearchText(direction), [
    "nonprofit fundraising",
    "fundraising",
    "development leadership",
    "mission organization",
    "nonprofit",
  ]);
}

function isCorporateTrainingDirection(direction) {
  return textIncludesAny(directionSearchText(direction), [
    "corporate training",
    "training",
    "l&d",
    "learning development",
    "learning and development",
    "instructional design",
    "education",
  ]);
}

function isAiTransformationDirection(direction) {
  return textIncludesAny(directionSearchText(direction), [
    "ai transformation",
    "chief ai",
    "ai",
    "automation",
    "digital transformation",
  ]);
}

function isAiStartupDirection(direction) {
  return textIncludesAny(directionSearchText(direction), [
    "ai & emerging tech",
    "ai product operations",
    "emerging tech",
    "startup",
  ]);
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
  if (isRestrictedHrWorkforceDirection(direction)) {
    return hasHrWorkforceDomainEvidence(assessment);
  }

  if (isTechnologyExecutiveDirection(direction)) {
    return hasTechnologyDomainEvidence(assessment);
  }

  if (!direction.relevantDomains || direction.relevantDomains.length === 0) {
    return true;
  }

  if (direction.domainSpecificityRequired === "low") {
    return true;
  }

  const relevantDomains = direction.relevantDomains.map((domain) =>
    normalizeText(domain)
  );

  const domainSignals = getDomainSignals(assessment);

  const domainSignalMatch = relevantDomains.some((domain) =>
    domainSignals.some(
      (signal) => signal.includes(domain) || domain.includes(signal)
    )
  );

  if (domainSignalMatch) {
    return true;
  }

  const profileText = buildAssessmentSearchText(assessment);

  return relevantDomains.some((domain) => hasExactPhrase(profileText, domain));
}

function getTransitionLabel(direction, flags, totalScore, fitBand) {
  const isHighFinancialRisk = direction.financialRiskLevel === "high";

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
    return {
      label:
        direction.transitionPathway === "stretch"
          ? isHighFinancialRisk
            ? "Stretch path — high financial risk"
            : "Stretch path"
          : "Bridge path",
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
  const isTechExecutive = hasTechnologyExecutiveProfile(assessment);
  const isStudent = hasStudentProfile(assessment);

  if (isStudent) {
    return {
      type: "current_profile",
      label: "Student / Early work profile",
      mapQuadrant: "corporate_human",
      mapCluster: "business_operations",
      description:
        "This appears to be a student or summer-job profile. Adult career-transition recommendations are not generated from this profile type.",
      domainSignals,
      senioritySignal,
      leadershipScope,
      unsupportedProfileType: "high_school_student",
    };
  }

  const labelParts = [];

  if (isTechExecutive) {
    labelParts.push("Technology Executive");
  } else if (domainSignals.includes("technology")) {
    labelParts.push("Technology");
  }

  if (domainSignals.includes("software_engineering")) {
    labelParts.push("Software Engineering");
  }

  if (domainSignals.includes("data_science")) {
    labelParts.push("Data / AI");
  }

  if (isTalentProfile) {
    labelParts.push("People / Workforce");
  }

  if (domainSignals.includes("operations")) {
    labelParts.push("Operations");
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
    mapQuadrant: isTechExecutive
      ? "corporate_operational"
      : isTalentProfile
      ? "corporate_human"
      : "corporate_operational",
    mapCluster: isTechExecutive
      ? "technology_executive"
      : isTalentProfile
      ? "people_operations"
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
    "financial planning",
    "wealth management",
    "investment advisor",
    "legal",
    "lawyer",
    "attorney",
    "medical",
    "nursing",
    "cpa",
  ];

  return textIncludesAny(text, licensedKeywords);
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

  return textIncludesAny(text, [
    "startup leadership",
    "founder",
    "early operator",
    "own venture",
    "service business",
    "local business",
  ]);
}

function canShowAsNearbyTrajectory(direction, assessment) {
  if (!direction) {
    return false;
  }

  if (hasStudentProfile(assessment)) {
    return false;
  }

  if (isBroadEntrepreneurialAdjacent(direction)) {
    return false;
  }

  if (
    isRestrictedHrWorkforceDirection(direction) &&
    !hasHrWorkforceDomainEvidence(assessment)
  ) {
    return false;
  }

  if (!hasTalentAcquisitionProfile(assessment) && isTalentDirection(direction)) {
    return false;
  }

  if (
    isTechnologyExecutiveDirection(direction) &&
    !hasTechnologyDomainEvidence(assessment)
  ) {
    return false;
  }

  if (
    isSmallBusinessAdvisorDirection(direction) &&
    !hasSmallBusinessAdvisorEvidence(assessment)
  ) {
    return false;
  }

  if (
    isNonprofitFundraisingDirection(direction) &&
    !hasNonprofitFundraisingEvidence(assessment)
  ) {
    return false;
  }

  if (
    isCorporateTrainingDirection(direction) &&
    !hasTrainingLndEvidence(assessment)
  ) {
    return false;
  }

  if (
    isAiTransformationDirection(direction) &&
    !hasAiTransformationEvidence(assessment)
  ) {
    return false;
  }

  if (
    isAiStartupDirection(direction) &&
    !hasAiTransformationEvidence(assessment)
  ) {
    return false;
  }

  const mapMetadata = getCareerMapMetadata(direction);

  const preferredNearbyClusters = new Set([
    "technology_executive",
    "engineering_leadership",
    "platform_technology",
    "marketplace_platforms",
    "ai_transformation",
    "business_operations",
    "independent_advisory",
    "people_operations",
    "workforce_intelligence",
    "people_analytics_hr_tech",
  ]);

  return preferredNearbyClusters.has(mapMetadata.mapCluster);
}

function hasMapRelevance(direction, assessment, primaryClusterSet) {
  const mapMetadata = getCareerMapMetadata(direction);
  const domainSignals = assessment?.cvProfile?.domainSignals || [];
  const profileText = buildAssessmentSearchText(assessment);
  const tags = mapMetadata.mapTags || [];
  const isTalentProfile = hasTalentAcquisitionProfile(assessment);
  const isTechProfile = hasTechnologyDomainEvidence(assessment);

  if (
    isRestrictedHrWorkforceDirection(direction) &&
    !hasHrWorkforceDomainEvidence(assessment)
  ) {
    return false;
  }

  if (!isTalentProfile && isTalentDirection(direction)) {
    return false;
  }

  if (
    isTechnologyExecutiveDirection(direction) &&
    !hasTechnologyDomainEvidence(assessment)
  ) {
    return false;
  }

  const tagMatchesDomain = tags.some((tag) =>
    domainSignals.some((domain) =>
      normalizeText(tag).includes(normalizeText(domain))
    )
  );

  const tagMatchesSummary = tags.some((tag) => hasExactPhrase(profileText, tag));

  const clusterMatchesPrimary = primaryClusterSet.has(mapMetadata.mapCluster);

  const techRelevant =
    isTechProfile &&
    [
      "technology_executive",
      "engineering_leadership",
      "platform_technology",
      "ai_transformation",
      "business_operations",
      "independent_advisory",
    ].includes(mapMetadata.mapCluster);

  const talentRelevant =
    isTalentProfile &&
    [
      "people_operations",
      "workforce_intelligence",
      "people_analytics_hr_tech",
      "ai_transformation",
      "business_operations",
    ].includes(mapMetadata.mapCluster);

  return (
    tagMatchesDomain ||
    tagMatchesSummary ||
    clusterMatchesPrimary ||
    techRelevant ||
    talentRelevant
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
  const isTechProfile = hasTechnologyDomainEvidence(assessment);

  return roleLibrary
    .filter((direction) => !primaryIds.has(direction.directionId))
    .filter((direction) => direction.aiDurabilityRating !== "D0")
    .filter((direction) => canShowAsAdjacentDirection(assessment, direction))
    .filter((direction) => canShowAsNearbyTrajectory(direction, assessment))
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
          "technology_executive",
          "engineering_leadership",
          "platform_technology",
          "marketplace_platforms",
          "ai_transformation",
        ].includes(mapMetadata.mapCluster)
      ) {
        relevanceScore += 25;
      }

      if (
        isTechProfile &&
        [
          "technology_executive",
          "engineering_leadership",
          "platform_technology",
          "ai_transformation",
        ].includes(mapMetadata.mapCluster)
      ) {
        relevanceScore += 35;
      }

      if (
        isTalentProfile &&
        [
          "people_operations",
          "workforce_intelligence",
          "people_analytics_hr_tech",
          "ai_transformation",
        ].includes(mapMetadata.mapCluster)
      ) {
        relevanceScore += 30;
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
}

function getAdjacentRouteReason(mapCluster) {
  const reasons = {
    technology_executive:
      "Nearby route supported by technology leadership and executive decision-making signals.",
    engineering_leadership:
      "Nearby route supported by technical delivery and engineering leadership signals.",
    platform_technology:
      "Nearby route supported by software, platform, architecture, and product technology signals.",
    marketplace_platforms:
      "Nearby route supported by marketplace, platform, and ecosystem operating experience.",
    people_operations:
      "Nearby route supported by HR, people operations, and organizational leadership signals.",
    workforce_intelligence:
      "Nearby route supported by workforce planning, talent systems, and people operations signals.",
    people_analytics_hr_tech:
      "Nearby route supported by HR, analytics, AI tools, and workforce systems experience.",
    ai_transformation:
      "Nearby route supported by AI workflow, automation, and operating model experience.",
    business_operations:
      "Nearby route supported by business operations and cross-functional leadership.",
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

      if (!canShowAsNearbyTrajectory(fullDirection, assessment)) {
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

function buildCareerMapSummary(
  assessment,
  primaryNodes,
  adjacentNodes,
  longerPathNodes
) {
  const primaryClusters = [
    ...new Set(primaryNodes.map((node) => node.mapCluster)),
  ];

  const primaryLabels = primaryNodes
    .map((node) => normalizeText(node.directionLabel))
    .join(" ");

  const allVisibleNodes = [
    ...primaryNodes,
    ...adjacentNodes,
    ...longerPathNodes,
  ];

  const hasIndependent = allVisibleNodes.some(
    (node) =>
      node.mapQuadrant === "autonomous_operational" ||
      node.mapQuadrant === "autonomous_human"
  );

  const isStudent = hasStudentProfile(assessment);
  const isTalentProfile = hasTalentAcquisitionProfile(assessment);
  const isTechExecutive = hasTechnologyExecutiveProfile(assessment);

  if (isStudent) {
    return {
      mainPattern: "Student profile outside current adult career-transition scope",
      transitionStyle: "No adult career-transition map generated",
      bridgeGoal:
        "Use this profile for early work strengths, not adult career direction recommendations.",
      mainCaution:
        "This version of Ortheon is designed for adult career-transition profiles.",
    };
  }

  const hasPrimaryTechnology =
    primaryClusters.includes("technology_executive") ||
    primaryClusters.includes("engineering_leadership") ||
    primaryClusters.includes("platform_technology") ||
    textIncludesAny(primaryLabels, [
      "cto",
      "vp engineering",
      "technology",
      "engineering",
      "architecture",
      "platform",
      "digital transformation",
    ]);

  const hasPrimaryAi =
    primaryClusters.includes("ai_transformation") ||
    textIncludesAny(primaryLabels, [
      "ai",
      "chief ai",
      "ai transformation",
      "ai product",
    ]);

  const hasPrimaryWorkforce =
    isTalentProfile &&
    (primaryClusters.includes("people_operations") ||
      primaryClusters.includes("workforce_intelligence") ||
      primaryClusters.includes("people_analytics_hr_tech"));

  const hasPrimaryMarketplace =
    primaryClusters.includes("marketplace_platforms") ||
    textIncludesAny(primaryLabels, ["marketplace", "platform", "seller"]);

  const hasPrimaryAdvisory =
    primaryClusters.includes("independent_advisory") ||
    textIncludesAny(primaryLabels, ["consultant", "fractional", "advisor"]);

  let mainPattern = "Business operations and leadership";

  if (isTechExecutive && hasPrimaryAi) {
    mainPattern =
      "Technology leadership, AI transformation, and platform-scale execution";
  } else if (isTechExecutive || hasPrimaryTechnology) {
    mainPattern =
      "Technology leadership, software/platform strategy, and enterprise execution";
  } else if (hasPrimaryWorkforce && hasPrimaryAi) {
    mainPattern =
      "HR, talent systems, workforce intelligence, and AI-enabled people operations";
  } else if (hasPrimaryWorkforce) {
    mainPattern =
      "HR, talent systems, workforce intelligence, and people operations";
  } else if (hasPrimaryAi && hasPrimaryAdvisory) {
    mainPattern = "AI transformation, product strategy, and advisory paths";
  } else if (hasPrimaryAi) {
    mainPattern = "AI transformation, product operations, and emerging technology";
  } else if (hasPrimaryMarketplace) {
    mainPattern = "Marketplace operations and business systems";
  } else if (hasPrimaryAdvisory) {
    mainPattern = "Independent advisory, strategy, and client-facing expertise";
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
  let adjustment = 0;
  const reasons = [];

  const isTalentProfile = hasTalentAcquisitionProfile(assessment);
  const isTechExecutive = hasTechnologyExecutiveProfile(assessment);
  const hasTechDomain = hasTechnologyDomainEvidence(assessment);

  if (isRestrictedHrWorkforceDirection(direction) && !isTalentProfile) {
    adjustment -= 500;
    reasons.push(
      "HR / workforce direction suppressed because HR-domain evidence was not detected."
    );
  }

  if (isTechnologyExecutiveDirection(direction)) {
    if (isTechExecutive) {
      adjustment += 34;
      reasons.push(
        "Technology executive profile directly supports CTO / technology leadership direction."
      );
    } else if (hasTechDomain) {
      adjustment += 14;
      reasons.push(
        "Technology domain evidence supports this direction, though executive scope may need validation."
      );
    } else {
      adjustment -= 80;
      reasons.push(
        "Technology executive direction reduced because technology-domain evidence was not detected."
      );
    }
  }

  if (isTalentProfile) {
    if (direction.directionId === "BF-4-E") {
      adjustment += 28;
    }

    if (direction.directionId === "BF-5-E") {
      adjustment += 26;
    }

    if (direction.directionId === "BF-6-E") {
      adjustment += 20;
    }

    if (direction.directionId === "BF-8-IF") {
      adjustment += 12;
    }
  }

  if (
    isTechExecutive &&
    isGenericManagementDirection(direction) &&
    !isTechnologyExecutiveDirection(direction)
  ) {
    adjustment -= 18;
    reasons.push(
      "Generic management direction reduced because more specific technology executive paths are available."
    );
  }

  if (isGenericManagementDirection(direction)) {
    const hasBusinessOwnership = hasBroadBusinessOwnershipEvidence(assessment);

    if (!hasBusinessOwnership && !isTechExecutive) {
      adjustment -= 24;
      reasons.push(
        "Generic management direction reduced because broader business ownership evidence was not detected."
      );
    }
  }

  if (isMarketplaceDirection(direction) && !hasMarketplaceProfile(assessment)) {
    adjustment -= 24;
  }

  if (
    isSupplyChainDirection(direction) &&
    !hasOperationsSupplyChainProfile(assessment)
  ) {
    adjustment -= 22;
  }

  if (
    direction.directionId === "CM-5-IF" &&
    !hasAiTransformationEvidence(assessment)
  ) {
    adjustment -= 18;
  }

  if (
    isTechExecutive &&
    isAiTransformationDirection(direction) &&
    hasAiTransformationEvidence(assessment)
  ) {
    adjustment += 14;
  }

  return {
    adjustment,
    reasons,
  };
}

function isDomainSpecificRecommendation(recommendation, assessment) {
  if (hasTechnologyExecutiveProfile(assessment)) {
    return (
      isTechnologyExecutiveDirection(recommendation) ||
      recommendation.directionId === "CM-5-IF" ||
      recommendation.directionId === "CM-7-ST" ||
      recommendation.directionId === "CM-6-E"
    );
  }

  if (hasTalentAcquisitionProfile(assessment)) {
    return isTalentDirection(recommendation);
  }

  return false;
}

function shouldSuppressPrimaryForDomainProfile(recommendation, assessment) {
  if (hasStudentProfile(assessment)) {
    return true;
  }

  if (
    isRestrictedHrWorkforceDirection(recommendation) &&
    !hasHrWorkforceDomainEvidence(assessment)
  ) {
    return true;
  }

  if (!hasTalentAcquisitionProfile(assessment) && isTalentDirection(recommendation)) {
    return true;
  }

  if (
    isTechnologyExecutiveDirection(recommendation) &&
    !hasTechnologyDomainEvidence(assessment)
  ) {
    return true;
  }

  if (hasTechnologyExecutiveProfile(assessment)) {
    if (isTechnologyExecutiveDirection(recommendation)) {
      return false;
    }

    if (
      isTalentDirection(recommendation) &&
      !hasHrWorkforceDomainEvidence(assessment)
    ) {
      return true;
    }
  }

  if (hasTalentAcquisitionProfile(assessment)) {
    if (isTalentDirection(recommendation)) {
      return false;
    }
  }

  if (
    isGenericManagementDirection(recommendation) &&
    !hasBroadBusinessOwnershipEvidence(assessment) &&
    !hasTechnologyExecutiveProfile(assessment)
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

function sortTalentDomainRecommendations(recommendations) {
  return [...recommendations].sort((a, b) => {
    const priorityA = talentPrimaryPriority[a.directionId] || 99;
    const priorityB = talentPrimaryPriority[b.directionId] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return b.scores.total - a.scores.total;
  });
}

function sortTechnologyDomainRecommendations(recommendations) {
  return [...recommendations].sort((a, b) => {
    const priorityA = technologyPrimaryPriority[a.directionId] || 99;
    const priorityB = technologyPrimaryPriority[b.directionId] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return b.scores.total - a.scores.total;
  });
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
  if (hasStudentProfile(assessment)) {
    return [];
  }

  const sorted = sortRecommendationsByScore(results);

  if (hasTechnologyExecutiveProfile(assessment)) {
    const selected = [];

    const technologySpecificCandidates = sorted.filter((recommendation) =>
      isDomainSpecificRecommendation(recommendation, assessment)
    );

    const acceptableTechnologyCandidates = sortTechnologyDomainRecommendations(
      technologySpecificCandidates.filter(
        (recommendation) => recommendation.scores.total >= 35
      )
    );

    acceptableTechnologyCandidates.slice(0, 3).forEach((recommendation) => {
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

    return selected.slice(0, limit).map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
  }

  if (hasTalentAcquisitionProfile(assessment)) {
    const selected = [];

    const domainSpecificCandidates = sorted.filter((recommendation) =>
      isDomainSpecificRecommendation(recommendation, assessment)
    );

    const acceptableDomainCandidates = sortTalentDomainRecommendations(
      domainSpecificCandidates.filter(
        (recommendation) => recommendation.scores.total >= 45
      )
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

    return selected.slice(0, limit).map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
  }

  return sorted
    .filter(
      (recommendation) =>
        !shouldSuppressPrimaryForDomainProfile(recommendation, assessment)
    )
    .slice(0, limit)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
}

function shouldSkipDirectionBeforeScoring(direction, assessment) {
  if (hasStudentProfile(assessment)) {
    return true;
  }

  if (
    isRestrictedHrWorkforceDirection(direction) &&
    !hasHrWorkforceDomainEvidence(assessment)
  ) {
    return true;
  }

  if (!hasTalentAcquisitionProfile(assessment) && isTalentDirection(direction)) {
    return true;
  }

  if (
    isTechnologyExecutiveDirection(direction) &&
    !hasTechnologyDomainEvidence(assessment)
  ) {
    return true;
  }

  return false;
}

export function generateRecommendations(assessment) {
  if (hasStudentProfile(assessment)) {
    return [];
  }

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

    if (shouldSkipDirectionBeforeScoring(direction, assessment)) {
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

    if (
      direction.transitionCategory === "open_transition" &&
      direction.domainSpecificityRequired === "medium" &&
      !hasDomainMatch(direction, assessment)
    ) {
      competencyScore = Math.round(competencyScore * 0.65);
      flags.push("domain_credibility_gap");
    }

    if (
      direction.transitionCategory === "bridge_friendly" &&
      direction.domainSpecificityRequired === "medium" &&
      !hasDomainMatch(direction, assessment)
    ) {
      competencyScore = Math.round(competencyScore * 0.7);
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
    version: "career-map-v1.3-hard-hr-domain-gate",
    currentProfileNode,
    primaryNodes,
    adjacentNodes,
    longerPathNodes,
    inputFactors,
    summary: buildCareerMapSummary(
      assessment,
      primaryNodes,
      adjacentNodes,
      longerPathNodes
    ),
  };
}