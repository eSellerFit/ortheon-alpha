import { roleLibrary } from "../data/roleLibrary";
import { salaryBenchmarks } from "../data/salaryBenchmarks";

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

function calcCompetencyScore(competencySignals, direction) {
  const signalMap = {
    strong: 100,
    moderate: 70,
    weak: 30,
    absent: 0,
  };

  const signals = Array.isArray(competencySignals) ? competencySignals : [];

  function getStrength(competencyId) {
    const found = signals.find(
      (signal) => Number(signal.competencyId) === Number(competencyId)
    );

    if (!found) {
      return 0;
    }

    return signalMap[found.signalStrength] || 0;
  }

  const requiredScores = (direction.requiredCompetencies || []).map(getStrength);
  const preferredScores = (direction.preferredCompetencies || []).map(getStrength);

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

function calcAnchorScore(anchors, direction) {
  let penalty = 0;
  const warnings = [];

  const userAnchors = anchors || {};

  (direction.dominantAnchors || []).forEach((anchor) => {
    const userScore = Number(userAnchors[anchor.anchorId]) || 5;
    const midpoint = (anchor.idealMin + anchor.idealMax) / 2;
    const distance = Math.abs(userScore - midpoint);

    penalty += distance * 10;

    if (distance > 3) {
      warnings.push(anchor.anchorId);
    }
  });

  (direction.significantAnchors || []).forEach((anchor) => {
    const userScore = Number(userAnchors[anchor.anchorId]) || 5;
    const midpoint = (anchor.idealMin + anchor.idealMax) / 2;
    const distance = Math.abs(userScore - midpoint);

    penalty += distance * 5;
  });

  return {
    score: Math.max(0, Math.round(100 - penalty)),
    warnings,
  };
}

function calcFinancialScore(financialReality, direction) {
  const annualFloor =
    (Number(financialReality?.minimumMonthlyIncome) || 0) * 12;

  const avg12month = Number(direction.financialPathway?.avg12month) || 0;

  const ratio = annualFloor > 0 ? avg12month / annualFloor : 1;

  let score;
  let flag = null;

  if (ratio >= 1.2) {
    score = 100;
  } else if (ratio >= 1.0) {
    score = 70;
  } else if (ratio >= 0.8) {
    score = 40;
    flag = "financially_constrained";
  } else {
    score = 10;
    flag = "financially_risky";
  }

  const runway = Number(financialReality?.savingsRunwayMonths) || 0;

  if (runway >= 6) {
    score = Math.min(100, score + 10);
  }

  if (runway < 3) {
    score = Math.max(0, score - 20);
  }

  return {
    score,
    flag,
    annualFloor,
    avg12month,
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

export function generateRecommendations(assessment) {
  const weights = normalizeWeights(assessment?.priorityWeights);

  const competencySignals = assessment?.cvProfile?.competencySignals || [];
  const anchors = assessment?.anchors || {};
  const financialReality = assessment?.financialReality || {};

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

    const competencyScore = calcCompetencyScore(
      competencySignals,
      direction
    );

    const { score: anchorScore, warnings: anchorWarnings } =
      calcAnchorScore(anchors, direction);

    const {
      score: financialScore,
      flag: financialFlag,
      annualFloor,
      avg12month,
    } = calcFinancialScore(financialReality, direction);

    const durabilityScore = calcDurabilityScore(direction);

    const total = Math.round(
      competencyScore * weights.competencyFit +
        anchorScore * weights.anchorFit +
        financialScore * weights.financialViability +
        durabilityScore * weights.roleDurability
    );

    const fitBand = getFitBand(total, financialFlag);

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
      transitionPathway: direction.transitionPathway,
      stretchabilityRequired: direction.stretchabilityRequired,
      d4EvolutionPath: direction.d4EvolutionPath,
      salarySource: direction.salarySource,
      salarySources: direction.salarySources,
      salaryLastUpdated: direction.salaryLastUpdated,
      salaryValidUntil: direction.salaryValidUntil,
      salaryDataQuality: direction.salaryDataQuality,
      salaryBenchmarkVersion: direction.salaryBenchmarkVersion,
      financialPathway: direction.financialPathway,
      financialComparison: {
        annualFloor,
        avg12month,
      },
      scores: {
        competency: competencyScore,
        anchor: anchorScore,
        financial: financialScore,
        durability: durabilityScore,
        total,
      },
      fitBand,
      financialFlag,
      anchorWarnings,
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
