import { roleLibrary } from "../data/roleLibrary";
import { salaryBenchmarks } from "../data/salaryBenchmarks";

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

const signalMap = {
  strong: 100,
  moderate: 70,
  weak: 30,
  absent: 0,
};

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
    roleDurability: Number(source.roleDurability) || fallbackWeights.roleDurability,
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
    (competencyId) =>
      getSignalDetail(competencySignals, competencyId).score
  );

  const preferredScores = (direction.preferredCompetencies || []).map(
    (competencyId) =>
      getSignalDetail(competencySignals, competencyId).score
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
    explanation = "Estimated first-year income is comfortably above the stated income floor.";
  } else if (ratio >= 1.0) {
    score = 70;
    explanation = "Estimated first-year income meets the stated income floor, but with limited buffer.";
  } else if (ratio >= 0.8) {
    score = 40;
    flag = "financially_constrained";
    explanation = "Estimated first-year income is below the stated income floor, but may be manageable with runway or a bridge plan.";
  } else {
    score = 10;
    flag = "financially_risky";
    explanation = "Estimated first-year income is materially below the stated income floor.";
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

  const domainSignals = assessment?.cvProfile?.domainSignals || [];

  const competencyEvidence =
    assessment?.cvProfile?.competencySignals
      ?.filter(
        (signal) =>
          signal.signalStrength === "strong" ||
          signal.signalStrength === "moderate"
      )
      ?.map((signal) => signal.evidence || "") || [];

  const userDomainText = [...domainSignals, ...competencyEvidence]
    .join(" ")
    .toLowerCase();

  if (!userDomainText || userDomainText.trim() === "") {
    return false;
  }

  return direction.relevantDomains.some((domain) =>
    userDomainText.includes(String(domain).toLowerCase())
  );
}

function getTransitionLabel(direction, flags) {
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

function resolveBridgeDirections(directionIds, library) {
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
        directionLabel: found.directionLabel,
      };
    })
    .filter(Boolean);
}

function buildScoreBreakdown(scores, weights) {
  return {
    competency: {
      score: scores.competency,
      weight: Number((weights.competencyFit * 100).toFixed(1)),
      contribution: Number((scores.competency * weights.competencyFit).toFixed(1)),
    },
    anchor: {
      score: scores.anchor,
      weight: Number((weights.anchorFit * 100).toFixed(1)),
      contribution: Number((scores.anchor * weights.anchorFit).toFixed(1)),
    },
    financial: {
      score: scores.financial,
      weight: Number((weights.financialViability * 100).toFixed(1)),
      contribution: Number((scores.financial * weights.financialViability).toFixed(1)),
    },
    durability: {
      score: scores.durability,
      weight: Number((weights.roleDurability * 100).toFixed(1)),
      contribution: Number((scores.durability * weights.roleDurability).toFixed(1)),
    },
  };
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

    let competencyScore = calcCompetencyScore(
      competencySignals,
      direction
    );

    if (
      direction.transitionCategory === "domain_heavy" &&
      direction.domainSpecificityRequired === "high" &&
      !hasDomainMatch(direction, assessment)
    ) {
      competencyScore = Math.round(competencyScore * 0.45);
      flags.push("domain_credibility_gap");
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

    const total = Math.round(
      scores.competency * weights.competencyFit +
        scores.anchor * weights.anchorFit +
        scores.financial * weights.financialViability +
        scores.durability * weights.roleDurability
    );

    const fitBand = getFitBand(total, financialResult.flag);

    const scoreBreakdown = buildScoreBreakdown(
      {
        ...scores,
        total,
      },
      weights
    );

    results.push({
      rank: 0,
      directionId: direction.directionId,
      directionLabel: direction.directionLabel,
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
      transitionLabel: getTransitionLabel(direction, flags),
      bridgeDirections: resolveBridgeDirections(
        direction.bridgeDirections || [],
        roleLibrary
      ),
      longerPathOptions: resolveBridgeDirections(
        direction.longerPathOptions || [],
        roleLibrary
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
        total,
      },
      scoreBreakdown,
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

  return results
    .sort((a, b) => b.scores.total - a.scores.total)
    .slice(0, 3)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
}
