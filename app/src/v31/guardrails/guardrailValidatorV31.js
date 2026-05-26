/**
 * Ortheon MVP Cut v3.1 — Guardrail Validator / Combiner
 *
 * Purpose:
 * Combine deterministic financial and hard-constraint signals into a per-
 * hypothesis guardrail validation result.
 *
 * Bundle 12A rule:
 * - Pure deterministic function only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 */

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

function isRiskyRoute(hypothesis) {
  const text = [
    hypothesis?.routeType,
    hypothesis?.workModel,
    hypothesis?.directionArena,
  ]
    .join(" ")
    .toLowerCase();

  return [
    "exploratory",
    "entrepreneur",
    "portfolio",
    "consulting",
    "fractional",
    "bridge",
    "startup",
  ].some((term) => text.includes(term));
}

function findSignal(signals, hypothesis) {
  const hypothesisId = getHypothesisId(hypothesis);
  return arrayOrEmpty(signals).find(
    (signal) =>
      signal.hypothesisId === hypothesisId ||
      signal.directionArena === hypothesis?.directionArena
  );
}

function buildDirectionGuardrail(
  hypothesis,
  financialSignal,
  constraintSignal
) {
  const reasons = [];
  let guardrailStatus = "clear";
  let canShowAsCredibleNow = true;
  let requiredDowngrade = false;
  let downgradeReason = null;

  if (!financialSignal && !constraintSignal) {
    return {
      hypothesisId: getHypothesisId(hypothesis),
      directionArena: nullableString(hypothesis?.directionArena) || "",
      guardrailStatus: "unknown",
      canShowAsCredibleNow: false,
      requiredDowngrade: false,
      downgradeReason: "Guardrail signals are missing.",
      financialBridgeLikelyRequired: false,
      reasons: ["Guardrail signals are missing."],
    };
  }

  if (constraintSignal?.hardBlock) {
    guardrailStatus = "blocked";
    canShowAsCredibleNow = false;
    requiredDowngrade = true;
    downgradeReason = "Hard constraint block detected.";
    reasons.push("Hard constraint block detected.");
  } else if (constraintSignal?.constraintLevel === "bridge_required") {
    guardrailStatus = "bridge_required";
    canShowAsCredibleNow = false;
    requiredDowngrade = true;
    downgradeReason = "Constraint review requires a bridge before credible-now display.";
    reasons.push("Constraint review requires a bridge.");
  } else if (constraintSignal?.constraintLevel === "unknown") {
    guardrailStatus = "unknown";
    canShowAsCredibleNow = false;
    reasons.push("Constraint certainty is limited by missing data.");
  } else if (constraintSignal?.constraintLevel === "watch") {
    guardrailStatus = "caution";
    reasons.push("Constraint warning detected.");
  }

  if (
    financialSignal?.financialViability === "risky" &&
    isRiskyRoute(hypothesis)
  ) {
    if (guardrailStatus === "clear") {
      guardrailStatus = "caution";
    }
    canShowAsCredibleNow = false;
    requiredDowngrade = true;
    downgradeReason =
      downgradeReason ||
      "Financial risk prevents credible-now display without validation.";
    reasons.push("Financial risk detected for a higher-ramp route.");
  }

  // Financial bridge-likely signals income ramp risk, not a capability or
  // credibility gap. It raises caution and blocks credible-now display, but
  // does NOT elevate guardrailStatus to bridge_required. That status is
  // reserved for true capability/credential/proof bridges from hard constraints.
  // The financialBridgeLikelyRequired flag is surfaced separately so the
  // portfolio composer can communicate financial risk without conflating it
  // with a missing capability bridge.
  if (financialSignal?.bridgeLikelyRequired) {
    if (guardrailStatus === "clear") {
      guardrailStatus = "caution";
    }
    canShowAsCredibleNow = false;
    requiredDowngrade = true;
    downgradeReason =
      downgradeReason || "Bridge income or income ramp is likely required.";
    reasons.push("Bridge income or income ramp is likely required for this transition route.");
  }

  if (financialSignal?.financialViability === "not_enough_data") {
    if (guardrailStatus === "clear") {
      guardrailStatus = "unknown";
    }
    canShowAsCredibleNow = false;
    reasons.push("Financial viability has insufficient data.");
  }

  if (hypothesis?.credibilityLevel !== "credible_now") {
    canShowAsCredibleNow = false;
  }

  if (reasons.length === 0) {
    reasons.push("No deterministic guardrail issue detected.");
  }

  return {
    hypothesisId: getHypothesisId(hypothesis),
    directionArena: nullableString(hypothesis?.directionArena) || "",
    guardrailStatus,
    canShowAsCredibleNow,
    requiredDowngrade,
    downgradeReason,
    financialBridgeLikelyRequired: Boolean(financialSignal?.bridgeLikelyRequired),
    reasons,
  };
}

/**
 * Build combined guardrail validation for direction hypotheses.
 *
 * @param {Object} assessmentSnapshot
 * @param {Array<Object>} directionHypotheses
 * @param {Object} financialModel
 * @param {Object} hardConstraintResult
 * @returns {Object}
 */
export function buildGuardrailValidationV31(
  assessmentSnapshot,
  directionHypotheses,
  financialModel,
  hardConstraintResult
) {
  const directionGuardrails = arrayOrEmpty(directionHypotheses).map(
    (hypothesis) =>
      buildDirectionGuardrail(
        hypothesis,
        findSignal(financialModel?.directionFinancialSignals, hypothesis),
        findSignal(hardConstraintResult?.directionConstraintSignals, hypothesis)
      )
  );

  const globalWarnings = [
    ...arrayOrEmpty(financialModel?.financialWarnings),
    ...arrayOrEmpty(hardConstraintResult?.globalConstraintWarnings),
  ];
  const missingInputs = [
    ...arrayOrEmpty(financialModel?.missingFinancialInputs),
    ...arrayOrEmpty(hardConstraintResult?.missingConstraintInputs),
  ];
  const passed = !directionGuardrails.some(
    (guardrail) => guardrail.guardrailStatus === "blocked"
  );

  return {
    version: "v3.1",
    assessmentId: nullableString(assessmentSnapshot?.assessmentId) || "",
    stage: "guardrail_validation",
    passed,
    directionGuardrails,
    globalWarnings,
    missingInputs,
  };
}
