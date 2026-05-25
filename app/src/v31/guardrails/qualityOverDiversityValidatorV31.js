/**
 * Ortheon MVP Cut v3.1 — Quality-over-Diversity Validator
 *
 * Purpose:
 * Flag weak, redundant, or thinly grounded hypotheses before the future
 * Portfolio Composer. This layer does not delete hypotheses.
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

function normalizeArena(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sourceAssetKey(hypothesis) {
  return arrayOrEmpty(hypothesis?.sourceTransferableAssets)
    .map((asset) => String(asset).toLowerCase().trim())
    .sort()
    .join("|");
}

function findGuardrail(guardrailValidation, hypothesis) {
  const hypothesisId = getHypothesisId(hypothesis);
  return arrayOrEmpty(guardrailValidation?.directionGuardrails).find(
    (guardrail) =>
      guardrail.hypothesisId === hypothesisId ||
      guardrail.directionArena === hypothesis?.directionArena
  );
}

function detectRedundantIndexes(directionHypotheses) {
  const seen = new Map();
  const redundant = new Set();
  const redundancyWarnings = [];

  arrayOrEmpty(directionHypotheses).forEach((hypothesis, index) => {
    const key = `${normalizeArena(hypothesis?.directionArena)}::${sourceAssetKey(
      hypothesis
    )}`;

    if (!key || key === "::") return;

    if (seen.has(key)) {
      const firstIndex = seen.get(key);
      redundant.add(index);
      redundant.add(firstIndex);
      redundancyWarnings.push(
        `Hypotheses ${firstIndex + 1} and ${index + 1} share the same arena and source assets.`
      );
      return;
    }

    seen.set(key, index);
  });

  return {
    redundant,
    redundancyWarnings,
  };
}

function buildQualitySignal(hypothesis, index, guardrail, redundantIndexes) {
  const sourceAssets = arrayOrEmpty(hypothesis?.sourceTransferableAssets);
  const evidence = arrayOrEmpty(hypothesis?.evidence);
  const risks = arrayOrEmpty(hypothesis?.mainRisks);
  const reasons = [];
  let qualityStatus = "unknown";

  if (sourceAssets.length === 0) {
    qualityStatus = "weak";
    reasons.push("No sourceTransferableAssets are present.");
  } else if (redundantIndexes.has(index)) {
    qualityStatus = "redundant";
    reasons.push("Hypothesis overlaps another hypothesis with the same source assets.");
  } else if (guardrail?.guardrailStatus === "blocked") {
    qualityStatus = "weak";
    reasons.push("Guardrails marked this hypothesis as blocked.");
  } else if (sourceAssets.length >= 2 && evidence.length >= 2) {
    qualityStatus = "strong";
    reasons.push("Multiple source assets and evidence items are present.");
  } else {
    qualityStatus = "acceptable";
    reasons.push("Hypothesis has grounding and no blocking guardrail.");
  }

  if (guardrail?.guardrailStatus === "unknown") {
    reasons.push("Guardrail certainty is limited by missing data.");
  }

  return {
    hypothesisId: getHypothesisId(hypothesis),
    directionArena: nullableString(hypothesis?.directionArena) || "",
    qualityStatus,
    hasSourceTransferableAssets: sourceAssets.length > 0,
    sourceAssetCount: sourceAssets.length,
    riskCount: risks.length,
    reasons,
  };
}

/**
 * Validate hypothesis quality-over-diversity.
 *
 * @param {Array<Object>} directionHypotheses
 * @param {Object} guardrailValidation
 * @returns {Object}
 */
export function validateHypothesisQualityOverDiversityV31(
  directionHypotheses,
  guardrailValidation
) {
  const { redundant, redundancyWarnings } =
    detectRedundantIndexes(directionHypotheses);

  const hypothesisQualitySignals = arrayOrEmpty(directionHypotheses).map(
    (hypothesis, index) =>
      buildQualitySignal(
        hypothesis,
        index,
        findGuardrail(guardrailValidation, hypothesis),
        redundant
      )
  );

  const globalQualityWarnings = [];

  if (
    hypothesisQualitySignals.filter((signal) =>
      ["strong", "acceptable"].includes(signal.qualityStatus)
    ).length === 0 &&
    hypothesisQualitySignals.length > 0
  ) {
    globalQualityWarnings.push(
      "No strong or acceptable hypotheses detected after quality review."
    );
  }

  if (hypothesisQualitySignals.length > 5) {
    globalQualityWarnings.push(
      "More than five hypotheses are present; future composer should prefer fewer credible options."
    );
  }

  return {
    version: "v3.1",
    stage: "quality_over_diversity_validation",
    hypothesisQualitySignals,
    redundancyWarnings,
    globalQualityWarnings,
  };
}
