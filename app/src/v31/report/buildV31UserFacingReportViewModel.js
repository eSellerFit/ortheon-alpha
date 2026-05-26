/**
 * Ortheon MVP Cut v3.1 — User-Facing Report View Model Builder
 *
 * Bundle 18B.
 * Converts the internal V31ResultViewModelV31 into a cleaner, user-safe
 * V31UserFacingReportViewModel for future report components.
 *
 * Rules:
 * - Pure deterministic function.
 * - No Firestore reads/writes.
 * - No AI calls. No API calls.
 * - Does not mutate input.
 * - No scores, fit bands, raw IDs, cost, pipeline diagnostics in output.
 * - qualityNotes, apiCost, source, pipelineStatus, directionId never reach user.
 */

// ── Utilities ──────────────────────────────────────────────────────────────────

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function objectOrEmpty(value) {
  return isObject(value) ? value : {};
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function stringOrEmpty(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function numberOrZero(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function boolOrFalse(value) {
  return typeof value === "boolean" ? value : false;
}

function stringArray(value) {
  return arrayOrEmpty(value).filter(
    (item) => typeof item === "string" && item.trim() !== ""
  );
}

function dedup(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function clamp(items, max) {
  return items.slice(0, max);
}

// ── Guardrail translation ──────────────────────────────────────────────────────

const GUARDRAIL_TRANSLATIONS = {
  caution:
    "Proceed with caution — this direction has credibility or financial considerations to resolve.",
  bridge_required:
    "This direction requires bridging work before it can be pursued directly.",
};

function translateGuardrailStatus(status) {
  const s = stringOrEmpty(status).toLowerCase();
  return GUARDRAIL_TRANSLATIONS[s] || null;
}

// ── currentRealismStatus ───────────────────────────────────────────────────────

function deriveCurrentRealismStatus(direction, guardrailStatus, canShowAsCredibleNow) {
  const rt = stringOrEmpty(direction.recommendationType).toLowerCase();
  const gs = stringOrEmpty(guardrailStatus).toLowerCase();

  if (rt === "primary") {
    if (gs === "caution") return "Credible now, with caution";
    if (gs === "bridge_required") return "Bridge required";
    return "Credible now";
  }

  if (rt === "bridge" || gs === "bridge_required") return "Bridge required";
  if (rt === "secondary") return "Secondary option";
  if (rt === "exploratory") return "Exploratory";
  if (rt === "not_recommended") return "Not now";

  return "Needs validation";
}

// ── statusMix ─────────────────────────────────────────────────────────────────

function deriveStatusMix(
  directions,
  rejectedDirections,
  guardrailStatuses,
  canShowAsCredibleNowValues
) {
  const mix = {
    credibleNow: 0,
    credibleWithCaution: 0,
    bridgeRequired: 0,
    secondaryOption: 0,
    exploratory: 0,
    notNow: 0,
  };

  directions.forEach((dir, i) => {
    const status = deriveCurrentRealismStatus(
      dir,
      stringOrEmpty(guardrailStatuses[i]),
      boolOrFalse(canShowAsCredibleNowValues[i])
    );
    if (status === "Credible now") mix.credibleNow += 1;
    else if (status === "Credible now, with caution") mix.credibleWithCaution += 1;
    else if (status === "Bridge required") mix.bridgeRequired += 1;
    else if (status === "Secondary option") mix.secondaryOption += 1;
    else if (status === "Exploratory") mix.exploratory += 1;
    else if (status === "Not now") mix.notNow += 1;
  });

  mix.notNow += arrayOrEmpty(rejectedDirections).length;

  return mix;
}

// ── confidenceLevelSummary ────────────────────────────────────────────────────

function deriveConfidenceLevelSummary(directions) {
  const counts = { high: 0, medium: 0, low: 0, insufficient_data: 0 };
  directions.forEach((dir) => {
    const conf = stringOrEmpty(dir.confidence).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(counts, conf)) {
      counts[conf] += 1;
    }
  });
  return counts;
}

// ── shortWhy ─────────────────────────────────────────────────────────────────

function deriveShortWhy(direction) {
  const fits = stringArray(direction.whyItFits);
  if (fits.length > 0) return fits[0];
  const credible = stringArray(direction.whyItIsCredible);
  if (credible.length > 0) return credible[0];
  return "";
}

// ── whatThisDirectionMeans ────────────────────────────────────────────────────

function deriveWhatThisDirectionMeans(direction) {
  const arena = stringOrEmpty(direction.directionArena);
  if (arena) return arena;
  return stringOrEmpty(direction.label);
}

// ── whatWouldMakeItStronger ───────────────────────────────────────────────────

function deriveWhatWouldMakeItStronger(direction) {
  const candidates = [];

  const risks = stringArray(direction.whatMakesItRisky);
  if (risks.length > 0) candidates.push(risks[0]);

  const bridge = stringOrEmpty(direction.bridgeStrategy);
  if (bridge && candidates.length < 2) candidates.push(bridge);

  const constraints = stringArray(direction.constraintsAndWarnings);
  if (constraints.length > 0 && candidates.length < 2) {
    candidates.push(constraints[0]);
  }

  const step = stringOrEmpty(direction.firstValidationStep);
  if (step && candidates.length < 2) candidates.push(step);

  return clamp(dedup(candidates), 3);
}

// ── directionPortfolioItem (compact) ─────────────────────────────────────────

function buildDirectionPortfolioItem(direction, guardrailStatus, canShowAsCredibleNow) {
  return {
    displayOrder: numberOrZero(direction.displayOrder),
    label: stringOrEmpty(direction.label),
    recommendationType: stringOrEmpty(direction.recommendationType),
    confidence: stringOrEmpty(direction.confidence),
    routeType: stringOrEmpty(direction.routeType),
    workModel: stringOrEmpty(direction.workModel),
    directionArena: stringOrEmpty(direction.directionArena),
    currentRealismStatus: deriveCurrentRealismStatus(
      direction,
      guardrailStatus,
      canShowAsCredibleNow
    ),
    shortWhy: deriveShortWhy(direction),
    firstValidationStep: stringOrEmpty(direction.firstValidationStep),
  };
}

// ── directionDeepDive ─────────────────────────────────────────────────────────

function buildDirectionDeepDive(direction, guardrailStatus, canShowAsCredibleNow) {
  return {
    displayOrder: numberOrZero(direction.displayOrder),
    label: stringOrEmpty(direction.label),
    recommendationType: stringOrEmpty(direction.recommendationType),
    confidence: stringOrEmpty(direction.confidence),
    routeType: stringOrEmpty(direction.routeType),
    workModel: stringOrEmpty(direction.workModel),
    directionArena: stringOrEmpty(direction.directionArena),
    currentRealismStatus: deriveCurrentRealismStatus(
      direction,
      guardrailStatus,
      canShowAsCredibleNow
    ),
    whatThisDirectionMeans: deriveWhatThisDirectionMeans(direction),
    whyItFits: stringArray(direction.whyItFits),
    whyItIsCredible: stringArray(direction.whyItIsCredible),
    whatMakesItRisky: stringArray(direction.whatMakesItRisky),
    constraintsAndWarnings: stringArray(direction.constraintsAndWarnings),
    firstValidationStep: stringOrEmpty(direction.firstValidationStep),
    bridgeStrategy: stringOrEmpty(direction.bridgeStrategy),
    notRecommendedIf: stringArray(direction.notRecommendedIf),
    whatWouldMakeItStronger: deriveWhatWouldMakeItStronger(direction),
  };
}

// ── notNowDirection ───────────────────────────────────────────────────────────

function buildNotNowDirection(rejectedDirection) {
  return {
    label: stringOrEmpty(rejectedDirection.label),
    reason: stringOrEmpty(rejectedDirection.reasonRejected),
    supportingConcerns: stringArray(rejectedDirection.supportingConcerns),
    whatWouldChangeThis: "",
  };
}

// ── keySignals ────────────────────────────────────────────────────────────────

const FINANCIAL_KEYWORDS = [
  "financial",
  "income",
  "money",
  "salary",
  "stable",
  "consulting",
  "freelance",
  "independent",
  "cost",
];

function buildKeySignals(directions, guardrails, caveats) {
  const guardrailStatuses = arrayOrEmpty(guardrails.guardrailStatuses);

  const primaryOrFirst =
    directions.find(
      (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "primary"
    ) || directions[0] || null;

  const strongestCredibilitySignals = clamp(
    stringArray(primaryOrFirst?.whyItIsCredible),
    3
  );

  const allConstraints = dedup(
    directions.flatMap((d) => stringArray(d.constraintsAndWarnings))
  );

  const financialRealitySignals = clamp(
    allConstraints.filter((item) =>
      FINANCIAL_KEYWORDS.some((kw) => item.toLowerCase().includes(kw))
    ),
    3
  );

  const constraintSignals = clamp(allConstraints, 5);

  const missingEvidenceSignals = clamp(stringArray(caveats), 5);

  const guardrailSignals = clamp(
    dedup(
      guardrailStatuses
        .map((gs) => translateGuardrailStatus(gs))
        .filter(Boolean)
    ),
    3
  );

  return {
    strongestCredibilitySignals,
    financialRealitySignals,
    constraintSignals,
    missingEvidenceSignals,
    guardrailSignals,
    caveats: clamp(stringArray(caveats), 5),
  };
}

// ── validationPlan ────────────────────────────────────────────────────────────

function buildValidationPlan(summary, directions, caveats) {
  const sorted = [...directions].sort(
    (a, b) => numberOrZero(a.displayOrder) - numberOrZero(b.displayOrder)
  );

  const allFirstSteps = dedup(
    sorted.map((d) => stringOrEmpty(d.firstValidationStep)).filter(Boolean)
  );

  const bridgeAndExploratory = sorted.filter((d) =>
    ["bridge", "exploratory"].includes(
      stringOrEmpty(d.recommendationType).toLowerCase()
    )
  );

  const allRisks = dedup(
    sorted.flatMap((d) => stringArray(d.whatMakesItRisky))
  );

  const allBridgeStrategies = dedup(
    sorted.map((d) => stringOrEmpty(d.bridgeStrategy)).filter(Boolean)
  );

  const mainTension = stringOrEmpty(summary.mainTension);

  return {
    next30Days: clamp(allFirstSteps, 5),
    evidenceToBuild: clamp(
      dedup([...stringArray(caveats), ...allRisks]),
      5
    ),
    conversationsToHave: clamp(
      dedup(
        bridgeAndExploratory
          .map((d) => stringOrEmpty(d.firstValidationStep))
          .filter(Boolean)
      ),
      3
    ),
    decisionsToMake: clamp(
      dedup([mainTension, ...allBridgeStrategies].filter(Boolean)),
      5
    ),
  };
}

// ── confidenceNotes ───────────────────────────────────────────────────────────

const MISSING_KEYWORDS = [
  "missing",
  "absent",
  "no ",
  "not provided",
  "incomplete",
  "unknown",
  "unclear",
  "limited",
];

function buildConfidenceNotes(directions, caveats) {
  const caveatsArray = stringArray(caveats);

  const lowConfidenceDirs = directions.filter((d) =>
    ["low", "insufficient_data"].includes(
      stringOrEmpty(d.confidence).toLowerCase()
    )
  );

  const lowConfidenceReasons = clamp(
    dedup(
      lowConfidenceDirs.flatMap((d) => [
        ...stringArray(d.whatMakesItRisky).slice(0, 1),
        ...stringArray(d.constraintsAndWarnings).slice(0, 1),
      ])
    ),
    3
  );

  const missingEvidence = clamp(
    dedup(
      [
        ...caveatsArray,
        ...lowConfidenceDirs.flatMap((d) =>
          stringArray(d.constraintsAndWarnings)
        ),
      ].filter((item) =>
        MISSING_KEYWORDS.some((kw) => item.toLowerCase().includes(kw))
      )
    ),
    3
  );

  return {
    caveats: caveatsArray,
    missingEvidence,
    lowConfidenceReasons,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Convert an internal V31ResultViewModelV31 into a user-safe report view model.
 *
 * @param {Object} internalViewModel Output of buildV31ResultViewModelV31.
 * @returns {Object} V31UserFacingReportViewModel
 */
export function buildV31UserFacingReportViewModelV31(internalViewModel) {
  const vm = objectOrEmpty(internalViewModel);
  const summary = objectOrEmpty(vm.summary);
  const directions = arrayOrEmpty(vm.directions);
  const rejectedDirections = arrayOrEmpty(vm.rejectedDirections);
  const caveats = stringArray(vm.caveats);
  const guardrails = objectOrEmpty(vm.guardrails);
  const metrics = objectOrEmpty(vm.metrics);
  const warnings = stringArray(vm.warnings);

  const guardrailStatuses = arrayOrEmpty(guardrails.guardrailStatuses);
  const canShowAsCredibleNowValues = arrayOrEmpty(
    guardrails.canShowAsCredibleNowValues
  );

  // Index-based guardrail lookup — correlates with directions[] order from view model
  const getGuardrailStatus = (i) => stringOrEmpty(guardrailStatuses[i]);
  const getCanShow = (i) => boolOrFalse(canShowAsCredibleNowValues[i]);
  const getDirIndex = (dir) => directions.indexOf(dir);

  // Classify directions by recommendationType
  const primaryDir =
    directions.find(
      (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "primary"
    ) ||
    directions.find(
      (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "secondary"
    ) ||
    null;

  const bridgeDirs = directions.filter(
    (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "bridge"
  );

  const exploratoryDirs = directions.filter((d) =>
    ["exploratory", "not_recommended"].includes(
      stringOrEmpty(d.recommendationType).toLowerCase()
    )
  );

  // reportMeta — expose counts and confidence summary; never expose cost or call count
  const primaryCount = directions.filter(
    (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "primary"
  ).length;

  const reportMeta = {
    directionCount: numberOrZero(metrics.finalDirectionCount),
    rejectedDirectionCount: numberOrZero(metrics.rejectedDirectionCount),
    primaryCount,
    bridgeRequiredCount: bridgeDirs.length,
    exploratoryCount: exploratoryDirs.length,
    hasWarnings: warnings.length > 0,
    confidenceLevelSummary: deriveConfidenceLevelSummary(directions),
  };

  // cover
  const statusMix = deriveStatusMix(
    directions,
    rejectedDirections,
    guardrailStatuses,
    canShowAsCredibleNowValues
  );

  const cover = {
    headline: stringOrEmpty(summary.headline),
    summary: stringOrEmpty(summary.summary),
    recommendedStrategy: stringOrEmpty(summary.recommendedStrategy),
    mainTension: stringOrEmpty(summary.mainTension),
    statusMix,
  };

  // directionPortfolio — compact overview of all directions
  const directionPortfolio = directions.map((dir, i) =>
    buildDirectionPortfolioItem(dir, getGuardrailStatus(i), getCanShow(i))
  );

  // keySignals
  const keySignals = buildKeySignals(directions, guardrails, caveats);

  // primaryDirection deep dive
  const primaryDirectionDeepDive = primaryDir
    ? buildDirectionDeepDive(
        primaryDir,
        getGuardrailStatus(getDirIndex(primaryDir)),
        getCanShow(getDirIndex(primaryDir))
      )
    : null;

  // bridgeDirections deep dives
  const bridgeDirectionDeepDives = bridgeDirs.map((dir) =>
    buildDirectionDeepDive(
      dir,
      getGuardrailStatus(getDirIndex(dir)),
      getCanShow(getDirIndex(dir))
    )
  );

  // exploratoryDirections deep dives (includes not_recommended from directions[])
  const exploratoryDirectionDeepDives = exploratoryDirs.map((dir) =>
    buildDirectionDeepDive(
      dir,
      getGuardrailStatus(getDirIndex(dir)),
      getCanShow(getDirIndex(dir))
    )
  );

  // notNowDirections — from rejectedDirections[] only
  const notNowDirections = rejectedDirections.map(buildNotNowDirection);

  // validationPlan
  const validationPlan = buildValidationPlan(summary, directions, caveats);

  // confidenceNotes
  const confidenceNotes = buildConfidenceNotes(directions, caveats);

  return {
    version: "v3.1",
    stage: "v31_user_facing_report_view_model",
    assessmentId: stringOrEmpty(vm.assessmentId),
    generatedAt: stringOrEmpty(vm.generatedAt),
    reportMeta,
    cover,
    directionPortfolio,
    keySignals,
    primaryDirection: primaryDirectionDeepDive,
    bridgeDirections: bridgeDirectionDeepDives,
    exploratoryDirections: exploratoryDirectionDeepDives,
    notNowDirections,
    validationPlan,
    confidenceNotes,
  };
}
