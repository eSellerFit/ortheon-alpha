/**
 * Ortheon MVP Cut v3.1 — User-Facing Report View Model Builder
 *
 * Bundle 18B / 18D.
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
 * - Same item never appears in more than one section.
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

function clamp(items, max) {
  return items.slice(0, max);
}

// ── Near-match deduplication ───────────────────────────────────────────────────

const DEDUP_PREFIX_LEN = 100;

function normalizeForDedup(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function dedupByNearMatch(items) {
  const seenFull = new Set();
  const seenPrefix = new Set();

  return items.filter((item) => {
    const norm = normalizeForDedup(item);
    const prefix = norm.slice(0, DEDUP_PREFIX_LEN);
    if (seenFull.has(norm) || seenPrefix.has(prefix)) return false;
    seenFull.add(norm);
    seenPrefix.add(prefix);
    return true;
  });
}

function excludeAlreadySeen(items, seenItems) {
  const seenNorms = new Set(seenItems.map(normalizeForDedup));
  const seenPrefixes = new Set(
    seenItems.map((s) => normalizeForDedup(s).slice(0, DEDUP_PREFIX_LEN))
  );
  return items.filter((item) => {
    const norm = normalizeForDedup(item);
    return (
      !seenNorms.has(norm) && !seenPrefixes.has(norm.slice(0, DEDUP_PREFIX_LEN))
    );
  });
}

// ── Text sanitization — strip internal guardrail / technical language ──────────

const INTERNAL_TERM_PATTERNS = [
  /\bbridge_required\b/i,
  /\bnot_viable\b/i,
  /\bcanShowAsCredibleNow\b/i,
  /\bcan show as credible now\b/i,
  /^guardrail\s*(status)?:/i,
  /^financial viability:/i,
];

function containsInternalTerm(text) {
  return INTERNAL_TERM_PATTERNS.some((p) => p.test(text));
}

function sanitizeConstraintText(text) {
  const s = String(text || "").trim();
  if (!s || !containsInternalTerm(s)) return s;

  const lower = s.toLowerCase();

  // bridge_required + financial context
  if (
    (lower.includes("bridge_required") || lower.includes("bridge required")) &&
    (lower.includes("financial") ||
      lower.includes("runway") ||
      lower.includes("income"))
  ) {
    return "The ramp-up period may be longer than your current financial runway allows.";
  }

  // not_viable in first year context
  if (
    lower.includes("not_viable") &&
    (lower.includes("12") ||
      lower.includes("first year") ||
      lower.includes("month"))
  ) {
    return "This path may not be financially realistic in the first year without stable bridge income.";
  }

  // bridge_required — general
  if (lower.includes("bridge_required")) {
    return "This direction requires bridging work before it can be pursued directly.";
  }

  // not_viable — general
  if (lower.includes("not_viable")) {
    return "This path may not be financially viable without additional preparation.";
  }

  // canShowAsCredibleNow → suppress
  if (
    lower.includes("canshowascrediblenow") ||
    lower.includes("can show as credible now")
  ) {
    return "";
  }

  // guardrail status: label
  if (/^guardrail\s*(status)?:/i.test(s)) {
    if (lower.includes("financial") || lower.includes("risky")) {
      return "The ramp-up period may be longer than your current financial runway allows.";
    }
    return "";
  }

  // financial viability: label
  if (/^financial viability:/i.test(s)) {
    if (lower.includes("risky") || lower.includes("not_viable")) {
      return "The ramp-up period may be longer than your current financial runway allows.";
    }
    return "";
  }

  return s;
}

function sanitizeTextArray(items) {
  return items.map((item) => sanitizeConstraintText(item)).filter(Boolean);
}

// ── Guardrail translation ──────────────────────────────────────────────────────

const GUARDRAIL_TRANSLATIONS = {
  caution:
    "Proceed with caution — this direction has credibility or financial considerations to resolve.",
  bridge_required:
    "This path should not be treated as the main move yet because it may take longer to become financially stable than your current runway allows.",
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

// ── shortWhy (one sentence only) ─────────────────────────────────────────────

function deriveShortWhy(direction) {
  const fits = sanitizeTextArray(stringArray(direction.whyItFits));
  if (fits.length > 0) return fits[0];
  const credible = sanitizeTextArray(stringArray(direction.whyItIsCredible));
  if (credible.length > 0) return credible[0];
  return "";
}

// ── whatThisDirectionMeans ────────────────────────────────────────────────────

function deriveWhatThisDirectionMeans(direction) {
  const arena = stringOrEmpty(direction.directionArena);
  if (arena) return arena;
  return stringOrEmpty(direction.label);
}

// ── Improvement conditions (practical, not copied from risks) ─────────────────

const IMPROVEMENT_SIGNALS = [
  {
    keywords: ["market", "buyer", "target", "niche", "client"],
    suggestion: "Define a clearer target market and specific buyer problem.",
  },
  {
    keywords: ["quantif", "measurable", "outcome", "result", "impact", "evidence", "proof"],
    suggestion: "Gather stronger quantified outcome examples from prior work.",
  },
  {
    keywords: ["financial", "runway", "income", "bridge income", "stable"],
    suggestion: "Secure bridge income before treating this as the primary path.",
  },
  {
    keywords: ["positioning", "generic", "differentiat", "distinct", "broad"],
    suggestion: "Develop clearer positioning to differentiate from general consulting.",
  },
  {
    keywords: ["advisory", "demand", "acquisition", "buyer proof"],
    suggestion: "Build evidence of client acquisition or advisory demand.",
  },
  {
    keywords: ["recruit", "compensation", "timeline", "salary", "market rate", "hire"],
    suggestion: "Validate compensation and timeline with recruiters or hiring managers.",
  },
  {
    keywords: ["bridge", "longer path", "longer-path", "incremental"],
    suggestion: "Treat this as a longer-path bridge and build toward it incrementally.",
  },
];

function deriveImprovementConditions(direction) {
  const allText = sanitizeTextArray([
    ...stringArray(direction.whatMakesItRisky),
    ...stringArray(direction.constraintsAndWarnings),
    stringOrEmpty(direction.bridgeStrategy),
  ])
    .join(" ")
    .toLowerCase();

  const matched = [];

  for (const { keywords, suggestion } of IMPROVEMENT_SIGNALS) {
    if (keywords.some((kw) => allText.includes(kw))) {
      matched.push(suggestion);
      if (matched.length >= 2) break;
    }
  }

  if (matched.length === 0) {
    const conf = stringOrEmpty(direction.confidence).toLowerCase();
    if (conf === "low" || conf === "insufficient_data") {
      matched.push(
        "Validate compensation and timeline with recruiters or hiring managers."
      );
    }
  }

  return dedupByNearMatch(matched);
}

// ── cleanFirstStep — take first clause of a multi-clause step ─────────────────

function cleanFirstStep(text) {
  const s = sanitizeConstraintText(String(text || "").trim());
  if (!s) return "";

  // If text has multiple sentences (". " followed by non-digit), take first only
  const dotIdx = s.indexOf(". ");
  if (dotIdx > 20 && dotIdx < s.length - 10 && !/^\d/.test(s[dotIdx + 2] || "")) {
    return s.slice(0, dotIdx + 1).trim();
  }

  return s;
}

// ── Named aliases (Task 8 — more readable names for common operations) ────────

const dedupeList = dedupByNearMatch;
const capList = clamp;
const translateInternalLanguage = sanitizeConstraintText;

// ── shortenSentence — first sentence of a longer string ───────────────────────

function shortenSentence(text) {
  const s = String(text || "").trim();
  if (!s) return "";
  const dotIdx = s.indexOf(". ");
  if (dotIdx > 0 && dotIdx < s.length - 2) return s.slice(0, dotIdx + 1).trim();
  return s;
}

// ── deriveFinancialRealismStatus ──────────────────────────────────────────────

function deriveFinancialRealismStatus(keySignals) {
  if (arrayOrEmpty(keySignals.guardrailSignals).length > 0) return "Bridge required";
  if (arrayOrEmpty(keySignals.financialRealitySignals).length > 0) return "Caution";
  return "Clear";
}

// ── deriveOverallConfidenceLevel ──────────────────────────────────────────────

function deriveOverallConfidenceLevel(summary) {
  const s = objectOrEmpty(summary);
  const high = numberOrZero(s.high);
  const medium = numberOrZero(s.medium);
  const low = numberOrZero(s.low);
  const insufficient = numberOrZero(s.insufficient_data);
  const total = high + medium + low + insufficient;

  if (total === 0) {
    return { value: "Mixed", description: "Confidence could not be assessed from available data." };
  }
  if (high >= total) {
    return {
      value: "High",
      description: `All ${high} direction${high !== 1 ? "s" : ""} assessed at high confidence.`,
    };
  }
  if (high > total / 2) {
    return {
      value: "High",
      description: `${high} of ${total} direction${total !== 1 ? "s" : ""} at high confidence.`,
    };
  }
  if (medium > low + insufficient && medium >= total / 2) {
    return {
      value: "Medium",
      description: `${medium} of ${total} direction${total !== 1 ? "s" : ""} at medium confidence.`,
    };
  }
  if (low + insufficient >= total / 2) {
    return {
      value: "Low",
      description: `${low + insufficient} of ${total} direction${total !== 1 ? "s" : ""} show low confidence or insufficient data.`,
    };
  }
  const parts = [];
  if (high > 0) parts.push(`${high} high`);
  if (medium > 0) parts.push(`${medium} medium`);
  if (low > 0) parts.push(`${low} low`);
  if (insufficient > 0) parts.push(`${insufficient} insufficient data`);
  return { value: "Mixed", description: `Directions rated: ${parts.join(", ")}.` };
}

// ── buildDashboardCards ───────────────────────────────────────────────────────

function buildDashboardCards(
  primaryPortfolioItem,
  bridgeDirs,
  notNowDirs,
  keySignals,
  confidenceLevelSummary
) {
  const bridgeCount = arrayOrEmpty(bridgeDirs).length;
  const notNowCount = arrayOrEmpty(notNowDirs).length;

  const financialStatus = deriveFinancialRealismStatus(keySignals);
  const financialDescription =
    sanitizeConstraintText(
      arrayOrEmpty(keySignals.guardrailSignals)[0] ||
        arrayOrEmpty(keySignals.financialRealitySignals)[0] ||
        ""
    ) || "No significant financial constraints identified.";

  const confidence = deriveOverallConfidenceLevel(confidenceLevelSummary);

  return [
    {
      id: "primaryDirection",
      label: "Primary direction",
      value: primaryPortfolioItem
        ? stringOrEmpty(primaryPortfolioItem.label)
        : "Not available",
      status: primaryPortfolioItem
        ? stringOrEmpty(primaryPortfolioItem.currentRealismStatus)
        : "Needs validation",
      description: primaryPortfolioItem
        ? stringOrEmpty(primaryPortfolioItem.shortWhy) ||
          "Your strongest direction given current evidence."
        : "No primary direction could be identified from available evidence.",
    },
    {
      id: "bridgeRequired",
      label: "Bridge-required options",
      value: bridgeCount,
      status: bridgeCount > 0 ? "Bridge required" : "Clear",
      description:
        bridgeCount > 0
          ? `${bridgeCount} path${bridgeCount !== 1 ? "s are" : " is"} viable but not the immediate move.`
          : "No bridge-required directions identified.",
    },
    {
      id: "notNow",
      label: "Not-now options",
      value: notNowCount,
      status: notNowCount > 0 ? "Not now" : "None",
      description:
        notNowCount > 0
          ? `${notNowCount} direction${notNowCount !== 1 ? "s were" : " was"} considered and set aside for now.`
          : "No directions were set aside at this time.",
    },
    {
      id: "financialRealism",
      label: "Financial realism",
      value: financialStatus,
      status: financialStatus,
      description: financialDescription,
    },
    {
      id: "overallConfidence",
      label: "Overall confidence",
      value: confidence.value,
      status: confidence.value,
      description: confidence.description,
    },
  ];
}

// ── buildInputSignalCards ─────────────────────────────────────────────────────

function buildInputSignalCards(keySignals, directions) {
  const credibilitySignals = arrayOrEmpty(keySignals.strongestCredibilitySignals);
  const financialSignals = arrayOrEmpty(keySignals.financialRealitySignals);
  const guardrailSignals = arrayOrEmpty(keySignals.guardrailSignals);
  const constraintSignals = arrayOrEmpty(keySignals.constraintSignals);
  const missingSignals = arrayOrEmpty(keySignals.missingEvidenceSignals);

  const hasStrongCredibility = credibilitySignals.length > 0;
  const hasFinancialRisk = guardrailSignals.length > 0;
  const hasFinancialCaution = financialSignals.length > 0;
  const hasConstraints = constraintSignals.length > 0;
  const hasMissing = missingSignals.length > 0;

  const workModels = directions.map((d) => stringOrEmpty(d.workModel)).filter(Boolean);
  const uniqueWorkModels = [...new Set(workModels)];

  return [
    {
      id: "careerAnchors",
      title: "Career anchors / motivation pattern",
      signal: hasStrongCredibility
        ? credibilitySignals[0]
        : "Motivation pattern needs further validation.",
      interpretation: hasStrongCredibility
        ? "Your strongest career signals are experience-based. Directions lean on demonstrated competence."
        : "Career anchors are not clearly defined from available data. Directions rely on what can be credibly demonstrated.",
      impact: hasStrongCredibility
        ? "Capability-based confidence supports the primary direction. Focus on what you can demonstrate to buyers or employers."
        : "Without clear anchors, recommendations are driven by transferable competencies. Adding clearer motivation context would improve direction fit.",
    },
    {
      id: "financialReality",
      title: "Financial reality",
      signal: sanitizeConstraintText(
        guardrailSignals[0] ||
          financialSignals[0] ||
          "No significant financial constraints identified."
      ),
      interpretation: hasFinancialRisk
        ? "Some directions may take longer than a typical runway to become financially stable."
        : hasFinancialCaution
          ? "Financial context introduces some caution around which paths are immediately realistic."
          : "Your financial context does not appear to block any of the recommended directions.",
      impact: hasFinancialRisk
        ? "Paths requiring bridge income are flagged. Prioritise directions with faster income potential."
        : hasFinancialCaution
          ? "Some paths may require bridge income. Consider sequencing rather than switching all at once."
          : "Financial constraints are not a limiting factor for the primary direction.",
    },
    {
      id: "workModelPreference",
      title: "Work model preference",
      signal:
        uniqueWorkModels.length > 0
          ? uniqueWorkModels.slice(0, 2).join(" and ") + " roles appear most realistic."
          : "Work model preference not clearly indicated.",
      interpretation:
        uniqueWorkModels.length > 1
          ? "Multiple work models appear across your directions, suggesting flexibility."
          : uniqueWorkModels.length === 1
            ? `Directions are aligned toward ${uniqueWorkModels[0]} work.`
            : "Work model preference could not be derived from available data.",
      impact:
        "Directions that conflict with your preferred work model are deprioritised or flagged as exploratory.",
    },
    {
      id: "constraints",
      title: "Constraints",
      signal: sanitizeConstraintText(constraintSignals[0] || "No hard constraints identified."),
      interpretation: hasConstraints
        ? "Active constraints limit which directions are immediately viable."
        : "No binding constraints were identified from the available information.",
      impact: hasConstraints
        ? "Some directions are narrowed or deprioritised based on these constraints."
        : "Constraints are not a limiting factor for the current recommendations.",
    },
    {
      id: "credibilityAssets",
      title: "Credibility assets",
      signal: credibilitySignals[0] || "Credibility assets not yet established.",
      interpretation: hasStrongCredibility
        ? "These are the experience signals that buyers or employers are most likely to recognise."
        : "Strong credibility signals were not identified. Directions rely on transferable rather than established experience.",
      impact: hasStrongCredibility
        ? "These assets directly support the primary direction's credibility rating."
        : "Building credibility evidence in the primary direction would improve overall confidence.",
    },
    {
      id: "missingEvidence",
      title: "Missing evidence",
      signal: sanitizeConstraintText(
        missingSignals[0] || "No significant missing evidence identified."
      ),
      interpretation: hasMissing
        ? "This gap affects confidence in one or more directions."
        : "The available evidence was sufficient to assess all directions.",
      impact: hasMissing
        ? "Adding this evidence would improve direction confidence and narrow recommendations."
        : "No additional evidence is required to refine these recommendations.",
    },
  ];
}

// ── buildCompactDirectionCard ─────────────────────────────────────────────────

function buildCompactDirectionCard(direction, guardrailStatus, canShowAsCredibleNow) {
  const mainRiskRaw =
    stringArray(direction.whatMakesItRisky)[0] ||
    stringArray(direction.constraintsAndWarnings)[0] ||
    "";

  return {
    displayOrder: numberOrZero(direction.displayOrder),
    label: stringOrEmpty(direction.label),
    status: deriveCurrentRealismStatus(direction, guardrailStatus, canShowAsCredibleNow),
    confidence: stringOrEmpty(direction.confidence),
    routeType: stringOrEmpty(direction.routeType),
    workModel: stringOrEmpty(direction.workModel),
    whyThisIsHere: shortenSentence(deriveShortWhy(direction)),
    mainRisk: shortenSentence(sanitizeConstraintText(mainRiskRaw)),
    firstValidationStep: cleanFirstStep(stringOrEmpty(direction.firstValidationStep)),
  };
}

// ── buildOtherDirectionCompact ────────────────────────────────────────────────

function buildOtherDirectionCompact(direction, guardrailStatus, canShowAsCredibleNow) {
  const whyInteresting = shortenSentence(
    sanitizeConstraintText(stringArray(direction.whyItFits)[0] || "")
  );
  const whyNotPrimaryNow = shortenSentence(
    sanitizeConstraintText(
      stringArray(direction.whatMakesItRisky)[0] ||
        stringArray(direction.constraintsAndWarnings)[0] ||
        ""
    )
  );
  const rawBridge = sanitizeConstraintText(stringOrEmpty(direction.bridgeStrategy));
  const rawStep = cleanFirstStep(stringOrEmpty(direction.firstValidationStep));

  return {
    label: stringOrEmpty(direction.label),
    type: stringOrEmpty(direction.recommendationType),
    status: deriveCurrentRealismStatus(direction, guardrailStatus, canShowAsCredibleNow),
    whyInteresting,
    whyNotPrimaryNow,
    bridgeOrValidationCondition: rawBridge || rawStep,
    firstValidationStep: rawStep,
  };
}

// ── buildPrimaryDirectionDeepDive — tighter caps than buildDirectionDeepDive ──

function buildPrimaryDirectionDeepDive(direction, guardrailStatus, canShowAsCredibleNow) {
  const sanitizedConstraints = clamp(
    dedupByNearMatch(sanitizeTextArray(stringArray(direction.constraintsAndWarnings))),
    2
  );
  const bridgeStrategy =
    sanitizeConstraintText(stringOrEmpty(direction.bridgeStrategy)) || null;

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
    whyItFits: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.whyItFits))),
      3
    ),
    whyItIsCredible: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.whyItIsCredible))),
      3
    ),
    whatMakesItRisky: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.whatMakesItRisky))),
      2
    ),
    constraintsAndWarnings: sanitizedConstraints,
    firstValidationStep: sanitizeConstraintText(stringOrEmpty(direction.firstValidationStep)),
    bridgeStrategy,
    notRecommendedIf: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.notRecommendedIf))),
      2
    ),
    whatWouldMakeItStronger: deriveImprovementConditions(direction),
  };
}

// ── Bundle 18I — directionMap helpers ────────────────────────────────────────

const MAP_SLOTS = {
  primary: [{ x: 50, y: 18 }],
  secondary: [
    { x: 30, y: 32 },
    { x: 70, y: 32 },
  ],
  bridge: [
    { x: 22, y: 42 },
    { x: 78, y: 42 },
    { x: 50, y: 46 },
  ],
  exploratory: [
    { x: 18, y: 62 },
    { x: 82, y: 62 },
    { x: 50, y: 64 },
  ],
};

function deriveNodeType(status, displayOrder) {
  if (displayOrder === 1) return "primary";
  const s = String(status || "").toLowerCase();
  if (s.includes("bridge")) return "bridge";
  if (s.includes("exploratory")) return "exploratory";
  if (s.includes("credible")) return "secondary";
  return "direction";
}

function getMapSlot(nodeType, index) {
  const slots = MAP_SLOTS[nodeType] || MAP_SLOTS.exploratory;
  return slots[Math.min(index, slots.length - 1)];
}

function deriveLineStyle(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("bridge")) return "dashed";
  if (s.includes("exploratory")) return "dotted";
  if (s.includes("not now")) return "muted";
  return "solid";
}

function deriveEdgeLabel(lineStyle) {
  if (lineStyle === "dashed") return "Bridge required";
  if (lineStyle === "dotted") return "Exploratory";
  if (lineStyle === "muted") return "Needs validation";
  return "Direct path";
}

const MAP_LEGEND_ITEMS = [
  { lineStyle: "solid", label: "Credible now", colorMeaning: "Green — immediately actionable" },
  {
    lineStyle: "dashed",
    label: "Bridge required",
    colorMeaning: "Amber — viable after a step",
  },
  { lineStyle: "dotted", label: "Exploratory", colorMeaning: "Blue — worth investigating" },
  {
    lineStyle: "muted",
    label: "Not recommended now",
    colorMeaning: "Grey — set aside for now",
  },
];

function buildMapLegend(lineStylesPresent) {
  const present = new Set(lineStylesPresent);
  return MAP_LEGEND_ITEMS.filter((item) => present.has(item.lineStyle));
}

function buildNotNowLane(notNowDirs) {
  return {
    label: "Not recommended now",
    items: notNowDirs.map((d) => ({
      label: stringOrEmpty(d.label),
      reason: stringOrEmpty(d.reason),
      whatWouldChangeThis: stringOrEmpty(d.whatWouldChangeThis),
    })),
  };
}

function buildDirectionMap(compactCards, notNowDirs) {
  const centerNode = {
    id: "current-profile",
    label: "Your current profile",
    subtitle: "Starting point",
    x: 50,
    y: 76,
  };

  const typeCounts = {};
  const nodes = [];
  const edges = [];
  const lineStylesUsed = [];

  for (const card of compactCards) {
    const nodeType = deriveNodeType(card.status, card.displayOrder);
    const typeIndex = typeCounts[nodeType] ?? 0;
    typeCounts[nodeType] = typeIndex + 1;

    const slot = getMapSlot(nodeType, typeIndex);
    const lineStyle = deriveLineStyle(card.status);
    lineStylesUsed.push(lineStyle);

    const nodeId = `direction-${card.displayOrder}`;
    nodes.push({
      id: nodeId,
      displayOrder: card.displayOrder,
      label: card.label,
      status: card.status,
      confidence: card.confidence,
      routeType: card.routeType,
      workModel: card.workModel,
      nodeType,
      x: slot.x,
      y: slot.y,
      shortReason: card.whyThisIsHere,
      mainRisk: card.mainRisk,
    });

    edges.push({
      from: "current-profile",
      to: nodeId,
      lineStyle,
      label: deriveEdgeLabel(lineStyle),
    });
  }

  const legend = buildMapLegend(lineStylesUsed);
  const notNowLane = buildNotNowLane(notNowDirs);

  return { centerNode, nodes, edges, legend, notNowLane };
}

// ── directionPortfolioItem (compact overview) ─────────────────────────────────

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
    firstValidationStep: cleanFirstStep(stringOrEmpty(direction.firstValidationStep)),
  };
}

// ── directionDeepDive ─────────────────────────────────────────────────────────

function buildDirectionDeepDive(direction, guardrailStatus, canShowAsCredibleNow) {
  const sanitizedConstraints = clamp(
    dedupByNearMatch(sanitizeTextArray(stringArray(direction.constraintsAndWarnings))),
    3
  );

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
    whyItFits: clamp(dedupByNearMatch(sanitizeTextArray(stringArray(direction.whyItFits))), 3),
    whyItIsCredible: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.whyItIsCredible))),
      3
    ),
    whatMakesItRisky: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.whatMakesItRisky))),
      3
    ),
    constraintsAndWarnings: sanitizedConstraints,
    firstValidationStep: cleanFirstStep(stringOrEmpty(direction.firstValidationStep)),
    bridgeStrategy: sanitizeConstraintText(stringOrEmpty(direction.bridgeStrategy)),
    notRecommendedIf: clamp(
      dedupByNearMatch(sanitizeTextArray(stringArray(direction.notRecommendedIf))),
      3
    ),
    whatWouldMakeItStronger: deriveImprovementConditions(direction),
  };
}

// ── notNowDirection ───────────────────────────────────────────────────────────

function buildNotNowDirection(rejectedDirection) {
  const supportingConcerns = clamp(
    dedupByNearMatch(
      sanitizeTextArray(stringArray(rejectedDirection.supportingConcerns))
    ),
    3
  );

  return {
    label: stringOrEmpty(rejectedDirection.label),
    reason: sanitizeConstraintText(stringOrEmpty(rejectedDirection.reasonRejected)),
    supportingConcerns,
    whatWouldChangeThis:
      supportingConcerns.length > 0
        ? "Revisit this path if the conditions above change."
        : "",
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
  "runway",
];

const EVIDENCE_KEYWORDS = [
  "missing",
  "incomplete",
  "not provided",
  "absent",
  "no data",
  "insufficient",
  "unclear",
  "limited",
];

/**
 * @param {Array} directions
 * @param {Object} guardrails
 * @param {string[]} topCaveats - already-limited caveats; used as keySignals.caveats
 *                                and excluded from missingEvidenceSignals
 * @param {string[]} allCaveats - full caveats list for evidence filtering
 */
function buildKeySignals(directions, guardrails, topCaveats, allCaveats) {
  const guardrailStatuses = arrayOrEmpty(guardrails.guardrailStatuses);

  const primaryOrFirst =
    directions.find(
      (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "primary"
    ) ||
    directions[0] ||
    null;

  const strongestCredibilitySignals = clamp(
    dedupByNearMatch(
      sanitizeTextArray(stringArray(primaryOrFirst?.whyItIsCredible))
    ),
    3
  );

  const allConstraints = dedupByNearMatch(
    sanitizeTextArray(
      directions.flatMap((d) => stringArray(d.constraintsAndWarnings))
    )
  );

  const financialRealitySignals = clamp(
    allConstraints.filter((item) =>
      FINANCIAL_KEYWORDS.some((kw) => item.toLowerCase().includes(kw))
    ),
    2
  );

  const financialNorms = new Set(financialRealitySignals.map(normalizeForDedup));

  const constraintSignals = clamp(
    allConstraints.filter((item) => !financialNorms.has(normalizeForDedup(item))),
    3
  );

  const topCaveatsNorms = new Set(topCaveats.map(normalizeForDedup));

  const missingEvidenceSignals = clamp(
    dedupByNearMatch(
      allCaveats
        .filter((c) =>
          EVIDENCE_KEYWORDS.some((kw) => c.toLowerCase().includes(kw))
        )
        .filter((c) => !topCaveatsNorms.has(normalizeForDedup(c)))
    ),
    3
  );

  const guardrailSignals = clamp(
    dedupByNearMatch(
      guardrailStatuses
        .map((gs) => translateGuardrailStatus(gs))
        .filter(Boolean)
    ),
    2
  );

  return {
    strongestCredibilitySignals,
    financialRealitySignals,
    constraintSignals,
    missingEvidenceSignals,
    guardrailSignals,
    caveats: topCaveats,
  };
}

// ── validationPlan ────────────────────────────────────────────────────────────

function buildValidationPlan(summary, directions) {
  const sorted = [...directions].sort(
    (a, b) => numberOrZero(a.displayOrder) - numberOrZero(b.displayOrder)
  );

  // Primary/secondary first, then bridge, then others
  const prioritized = [
    ...sorted.filter((d) =>
      ["primary", "secondary"].includes(
        stringOrEmpty(d.recommendationType).toLowerCase()
      )
    ),
    ...sorted.filter(
      (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "bridge"
    ),
    ...sorted.filter(
      (d) =>
        !["primary", "secondary", "bridge"].includes(
          stringOrEmpty(d.recommendationType).toLowerCase()
        )
    ),
  ];

  const next30Days = clamp(
    dedupByNearMatch(
      prioritized
        .map((d) => cleanFirstStep(stringOrEmpty(d.firstValidationStep)))
        .filter(Boolean)
    ),
    3
  );

  // evidenceToBuild: from primary direction's risks only (caveats shown elsewhere)
  const primaryOrFirst = prioritized[0] || null;
  const evidenceToBuild = clamp(
    dedupByNearMatch(
      sanitizeTextArray(stringArray(primaryOrFirst?.whatMakesItRisky))
    ),
    3
  );

  // conversationsToHave: bridge directions' first steps, excluding already in next30Days
  const bridgeDirs = sorted.filter(
    (d) => stringOrEmpty(d.recommendationType).toLowerCase() === "bridge"
  );

  const conversationsToHave = clamp(
    dedupByNearMatch(
      excludeAlreadySeen(
        bridgeDirs
          .map((d) => cleanFirstStep(stringOrEmpty(d.firstValidationStep)))
          .filter(Boolean),
        next30Days
      )
    ),
    2
  );

  // decisionsToMake: mainTension + bridge strategies, max 2
  const mainTension = stringOrEmpty(summary.mainTension);
  const bridgeStrategies = clamp(
    dedupByNearMatch(
      bridgeDirs
        .map((d) => sanitizeConstraintText(stringOrEmpty(d.bridgeStrategy)))
        .filter(Boolean)
    ),
    2
  );

  const decisionsToMake = clamp(
    dedupByNearMatch([mainTension, ...bridgeStrategies].filter(Boolean)),
    2
  );

  return { next30Days, evidenceToBuild, conversationsToHave, decisionsToMake };
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

/**
 * @param {Array} directions
 * @param {string[]} allCaveats - full deduped caveats list
 * @param {string[]} shownCaveats - caveats already shown in keySignals; exclude from output
 */
function buildConfidenceNotes(directions, allCaveats, shownCaveats) {
  const remainingCaveats = clamp(
    dedupByNearMatch(excludeAlreadySeen(allCaveats, shownCaveats)),
    3
  );

  const lowConfidenceDirs = directions.filter((d) =>
    ["low", "insufficient_data"].includes(
      stringOrEmpty(d.confidence).toLowerCase()
    )
  );

  const lowConfidenceReasons = clamp(
    dedupByNearMatch(
      sanitizeTextArray(
        lowConfidenceDirs.flatMap((d) => [
          ...stringArray(d.whatMakesItRisky).slice(0, 1),
          ...stringArray(d.constraintsAndWarnings).slice(0, 1),
        ])
      )
    ),
    3
  );

  // missingEvidence: from low-confidence direction constraints (not caveats, already shown above)
  const missingEvidence = clamp(
    dedupByNearMatch(
      excludeAlreadySeen(
        sanitizeTextArray(
          lowConfidenceDirs.flatMap((d) =>
            stringArray(d.constraintsAndWarnings)
          )
        ).filter((item) =>
          MISSING_KEYWORDS.some((kw) => item.toLowerCase().includes(kw))
        ),
        [...shownCaveats, ...remainingCaveats]
      )
    ),
    3
  );

  return {
    caveats: remainingCaveats,
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
  const guardrails = objectOrEmpty(vm.guardrails);
  const metrics = objectOrEmpty(vm.metrics);
  const warnings = stringArray(vm.warnings);

  const guardrailStatuses = arrayOrEmpty(guardrails.guardrailStatuses);
  const canShowAsCredibleNowValues = arrayOrEmpty(
    guardrails.canShowAsCredibleNowValues
  );

  // Pre-compute deduped caveats; shared between keySignals and confidenceNotes
  // so the same caveat never appears in both sections.
  const allCaveats = dedupByNearMatch(stringArray(vm.caveats));
  const topCaveats = clamp(allCaveats, 3);

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

  // reportMeta
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

  // directionPortfolio — compact overview
  const directionPortfolio = directions.map((dir, i) =>
    buildDirectionPortfolioItem(dir, getGuardrailStatus(i), getCanShow(i))
  );

  // keySignals — topCaveats passed so missingEvidenceSignals excludes them
  const keySignals = buildKeySignals(directions, guardrails, topCaveats, allCaveats);

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

  // exploratoryDirections deep dives
  const exploratoryDirectionDeepDives = exploratoryDirs.map((dir) =>
    buildDirectionDeepDive(
      dir,
      getGuardrailStatus(getDirIndex(dir)),
      getCanShow(getDirIndex(dir))
    )
  );

  // notNowDirections — from rejectedDirections[] only
  const notNowDirections = rejectedDirections.map(buildNotNowDirection);

  // validationPlan — no longer uses caveats (shown in keySignals)
  const validationPlan = buildValidationPlan(summary, directions);

  // confidenceNotes — receives topCaveats as already-shown set to avoid repeats
  const confidenceNotes = buildConfidenceNotes(directions, allCaveats, topCaveats);

  // ── New card-based fields (Bundle 18F — additive, existing shape preserved) ─

  const primaryPortfolioItem =
    directionPortfolio.find(
      (item) => stringOrEmpty(item.recommendationType).toLowerCase() === "primary"
    ) ||
    directionPortfolio.find(
      (item) => stringOrEmpty(item.recommendationType).toLowerCase() === "secondary"
    ) ||
    directionPortfolio[0] ||
    null;

  const decisionDashboard = {
    cards: buildDashboardCards(
      primaryPortfolioItem,
      bridgeDirs,
      notNowDirections,
      keySignals,
      reportMeta.confidenceLevelSummary
    ),
  };

  const inputSignalCards = buildInputSignalCards(keySignals, directions);

  const compactDirectionCards = directions.map((dir, i) =>
    buildCompactDirectionCard(dir, getGuardrailStatus(i), getCanShow(i))
  );

  const compactPrimaryDeepDive = primaryDir
    ? buildPrimaryDirectionDeepDive(
        primaryDir,
        getGuardrailStatus(getDirIndex(primaryDir)),
        getCanShow(getDirIndex(primaryDir))
      )
    : null;

  const OTHER_TYPES_COMPACT = new Set([
    "bridge",
    "secondary",
    "exploratory",
    "not_recommended",
  ]);
  const otherDirectionsCompact = directions
    .filter((d) =>
      OTHER_TYPES_COMPACT.has(stringOrEmpty(d.recommendationType).toLowerCase())
    )
    .map((dir) =>
      buildOtherDirectionCompact(
        dir,
        getGuardrailStatus(getDirIndex(dir)),
        getCanShow(getDirIndex(dir))
      )
    );

  // directionMap — Bundle 18I (additive, existing fields preserved)
  const directionMap = buildDirectionMap(compactDirectionCards, notNowDirections);

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
    decisionDashboard,
    inputSignalCards,
    compactDirectionCards,
    primaryDirectionDeepDive: compactPrimaryDeepDive,
    otherDirectionsCompact,
    directionMap,
  };
}
