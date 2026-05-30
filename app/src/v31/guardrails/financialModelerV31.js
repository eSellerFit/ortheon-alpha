/**
 * Ortheon MVP Cut v3.1 — Financial Modeler
 *
 * Purpose:
 * Deterministically assess transition financial realism for direction
 * hypotheses without creating, ranking, or recommending directions.
 *
 * Bundle 12A rule:
 * - Pure deterministic function only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nullableString(value) {
  if (value === null || value === undefined) return null;

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function getHypothesisId(hypothesis) {
  return (
    nullableString(hypothesis?.directionId) ||
    nullableString(hypothesis?.directionArena) ||
    ""
  );
}

function textIncludesAny(value, needles) {
  const normalized = String(value || "").toLowerCase();
  return needles.some((needle) => normalized.includes(needle));
}

function isRiskyRoute(hypothesis) {
  return textIncludesAny(
    [
      hypothesis?.routeType,
      hypothesis?.workModel,
      hypothesis?.directionArena,
    ].join(" "),
    [
      "exploratory",
      "entrepreneur",
      "portfolio",
      "consulting",
      "fractional",
      "bridge",
      "startup",
    ]
  );
}

function inferFinancialPressure(financialReality, stableIncomeNeeded) {
  if (!isObject(financialReality)) return "unknown";

  const runwayMonths = nullableNumber(financialReality.savingsRunwayMonths);
  const minimumMonthlyIncome = nullableNumber(
    financialReality.minimumMonthlyIncome
  );
  const currentMonthlyIncome = nullableNumber(
    financialReality.currentMonthlyIncome
  );

  if (runwayMonths !== null && runwayMonths <= 3) return "high";

  if (
    minimumMonthlyIncome !== null &&
    currentMonthlyIncome !== null &&
    minimumMonthlyIncome >= currentMonthlyIncome * 0.8
  ) {
    if (runwayMonths === null) return "moderate";
    if (runwayMonths <= 6) return "high";
    return "moderate";
  }

  if (stableIncomeNeeded) return "moderate";
  if (runwayMonths !== null && runwayMonths <= 6) return "moderate";
  if (runwayMonths !== null && runwayMonths >= 9) return "low";

  return "unknown";
}

function inferStableIncomeNeeded(financialReality) {
  if (!isObject(financialReality)) return null;

  const runwayMonths = nullableNumber(financialReality.savingsRunwayMonths);
  const minimumMonthlyIncome = nullableNumber(
    financialReality.minimumMonthlyIncome
  );
  const bridgeRoleWillingness = nullableString(
    financialReality.bridgeRoleWillingness
  );

  if (runwayMonths !== null && runwayMonths <= 6) return true;

  if (bridgeRoleWillingness && runwayMonths !== null && runwayMonths > 6) return false;

  if (minimumMonthlyIncome !== null && minimumMonthlyIncome > 0) return true;

  if (bridgeRoleWillingness) return false;

  return null;
}

function buildDirectionFinancialSignal(
  hypothesis,
  financialReality,
  financialPressureLevel,
  stableIncomeNeeded,
  incomeDropToleranceKnown
) {
  const riskyRoute = isRiskyRoute(hypothesis);
  const reasons = [];
  let financialViability = "not_enough_data";
  let bridgeLikelyRequired = false;

  if (!isObject(financialReality)) {
    reasons.push("Financial reality inputs are missing.");
  } else if (financialPressureLevel === "unknown") {
    reasons.push("Financial pressure cannot be determined from available data.");
  }

  if (stableIncomeNeeded && riskyRoute) {
    bridgeLikelyRequired = true;
    financialViability = "viable_with_bridge";
    reasons.push(
      "Stable income appears important and this route may involve ramp risk."
    );
  }

  if (!incomeDropToleranceKnown && riskyRoute) {
    if (financialViability === "not_enough_data") {
      financialViability = "risky";
    }
    reasons.push("Income drop tolerance is unknown for a riskier transition.");
  }

  if (financialPressureLevel === "high" && riskyRoute) {
    financialViability = "risky";
    bridgeLikelyRequired = true;
    reasons.push("High financial pressure makes this transition route risky.");
  }

  if (financialViability === "not_enough_data" && isObject(financialReality)) {
    financialViability =
      financialPressureLevel === "low" ? "likely_viable" : "unknown";
    reasons.push("Available data does not show a clear financial block.");
  }

  return {
    hypothesisId: getHypothesisId(hypothesis),
    directionArena: nullableString(hypothesis?.directionArena) || "",
    financialViability,
    bridgeLikelyRequired,
    reasons,
  };
}

/**
 * Build a deterministic financial model for direction hypotheses.
 *
 * @param {Object} assessmentSnapshot
 * @param {Array<Object>} directionHypotheses
 * @returns {Object}
 */
export function buildFinancialModelV31(
  assessmentSnapshot,
  directionHypotheses
) {
  const financialReality = assessmentSnapshot?.financialReality;
  const missingFinancialInputs = [];
  const financialWarnings = [];

  if (!isObject(financialReality)) {
    missingFinancialInputs.push("financialReality");
    financialWarnings.push("Financial reality inputs are missing.");
  }

  const minimumMonthlyIncome = nullableNumber(
    financialReality?.minimumMonthlyIncome
  );
  const savingsRunwayMonths = nullableNumber(
    financialReality?.savingsRunwayMonths
  );
  const incomeDropTolerance = nullableString(
    financialReality?.incomeDropTolerance
  );
  const stableIncomeNeeded = inferStableIncomeNeeded(financialReality);
  const incomeDropToleranceKnown = Boolean(incomeDropTolerance);

  if (minimumMonthlyIncome === null) {
    missingFinancialInputs.push("financialReality.minimumMonthlyIncome");
  }

  if (savingsRunwayMonths === null) {
    missingFinancialInputs.push("financialReality.savingsRunwayMonths");
  }

  if (!incomeDropToleranceKnown) {
    missingFinancialInputs.push("financialReality.incomeDropTolerance");
  }

  const financialPressureLevel = inferFinancialPressure(
    financialReality,
    stableIncomeNeeded
  );

  if (financialPressureLevel === "high") {
    financialWarnings.push(
      "High financial pressure detected; transition routes may need bridge income."
    );
  }

  const directionFinancialSignals = arrayOrEmpty(directionHypotheses).map(
    (hypothesis) =>
      buildDirectionFinancialSignal(
        hypothesis,
        financialReality,
        financialPressureLevel,
        stableIncomeNeeded,
        incomeDropToleranceKnown
      )
  );

  return {
    version: "v3.1",
    assessmentId: nullableString(assessmentSnapshot?.assessmentId) || "",
    stage: "financial_modeling",
    financialPressureLevel,
    incomeFloorKnown: minimumMonthlyIncome !== null,
    runwayKnown: savingsRunwayMonths !== null,
    stableIncomeNeeded,
    incomeDropToleranceKnown,
    directionFinancialSignals,
    missingFinancialInputs,
    financialWarnings,
  };
}
