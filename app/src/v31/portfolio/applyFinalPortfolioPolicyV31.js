/**
 * Ortheon MVP Cut v3.1 — Deterministic Final Portfolio Policy
 *
 * Purpose:
 * Apply deterministic post-composer cleanup to a normalized FinalDirectionPortfolioV31.
 * Enforces path-family consolidation, practical-priority ordering, recommendation-type
 * consistency, label cleanliness, and cross-direction targetRoleExample deduplication.
 *
 * Bundle 21B rule:
 * - Deterministic cleanup only.
 * - No AI calls.
 * - No API calls.
 * - No Firestore reads/writes.
 * - No production imports.
 * - Does not mutate the input object.
 *
 * Regression expectations (Bundle 21A / 21B):
 * For a senior HR executive with multinational/regional/interim CHRO evidence, the
 * policy should produce:
 *
 * 1. Enterprise Senior HR Leadership
 *    pathFamily: enterprise_employment
 *    recommendationType: primary
 *    routeType: direct
 *    profileCredibility: high
 *    financialRisk: low or medium
 *    executionRisk: low or medium
 *    targetRoleExamples: CHRO/CPO, Regional HR Leader, HR Operations/Shared Services,
 *      HR Transformation, Workforce Planning, People Analytics, Talent Management
 *
 * 2. Interim / Fractional CHRO
 *    pathFamily: interim_fractional
 *    recommendationType: secondary
 *    routeType: direct or portfolio
 *    profileCredibility: high
 *    financialRisk: high
 *    executionRisk: high
 *
 * 3. HR Transformation / Change Advisory (if present)
 *    pathFamily: consulting_advisory
 *    recommendationType: secondary or bridge (depending on consulting proof)
 *    financialRisk / executionRisk: medium or high
 *
 * Key invariants:
 * - Financial risk must not force routeType=bridge or confidence=low when
 *   profile credibility is strong.
 * - The deterministic policy enforces ordering and consolidation regardless of
 *   how the AI model arranges its output.
 * - Policy does not invent new directions or modify evidence/risk rationale text.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const CREDIBILITY_SCORE = { high: 6, medium: 3, low: 0 };
const RISK_SCORE = { low: 4, medium: 2, high: 0 };

const LABEL_PARENTHETICAL_RE =
  /\s*\((bridge( required)?|high risk|longer-?path|exploratory|caution|not recommended|secondary)\)/gi;

const NEAR_MATCH_PREFIX = 20;

// ─── Utilities ─────────────────────────────────────────────────────────────────

function str(value) {
  return typeof value === "string" ? value.trim() : "";
}

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function routeTypeScore(routeType) {
  const s = str(routeType).toLowerCase();
  if (s === "direct") return 4;
  // "direct or bridge" / "direct/bridge" — has a direct option; not a pure bridge
  if (s.includes("direct") && s.includes("bridge")) return 3;
  if (s.includes("portfolio")) return 3;
  // Pure bridge routes (not preceded by "direct")
  if (s.includes("bridge") && !s.includes("direct")) return 1;
  if (s.includes("exploratory")) return 0;
  return 2;
}

function directionScore(d) {
  const cred = CREDIBILITY_SCORE[str(d.profileCredibility?.level)] ?? 1;
  const route = routeTypeScore(str(d.routeType));
  const fin = RISK_SCORE[str(d.financialRisk?.level)] ?? 2;
  const exec = RISK_SCORE[str(d.executionRisk?.level)] ?? 2;
  return cred + route + fin + exec;
}

function workModelCategory(wm) {
  const s = str(wm).toLowerCase();
  if (s.includes("employ")) return "employed";
  if (s.includes("fractional") || s.includes("interim") || s.includes("portfolio")) return "fractional";
  if (s.includes("consult") || s.includes("advisor")) return "consulting";
  return "other";
}

function normalizeForMatch(text) {
  return str(text).toLowerCase().replace(/\s+/g, " ");
}

function nearMatch(a, b) {
  const na = normalizeForMatch(a);
  const nb = normalizeForMatch(b);
  if (!na || !nb || na.length < 4 || nb.length < 4) return false;
  const prefixA = na.slice(0, NEAR_MATCH_PREFIX);
  const prefixB = nb.slice(0, NEAR_MATCH_PREFIX);
  return prefixA === prefixB || na.includes(prefixB) || nb.includes(prefixA);
}

function cleanLabel(label) {
  return str(label).replace(LABEL_PARENTHETICAL_RE, "").trim();
}

// ─── Step 1: Path-family consolidation ────────────────────────────────────────

function shouldConsolidatePair(dirA, dirB) {
  const wmA = workModelCategory(str(dirA.workModel));
  const wmB = workModelCategory(str(dirB.workModel));
  // Keep separate when clearly different income/work models despite same pathFamily
  // (e.g. AI assigned same pathFamily but one is employed, other is fractional)
  if (wmA === "employed" && (wmB === "fractional" || wmB === "consulting")) return false;
  if (wmB === "employed" && (wmA === "fractional" || wmA === "consulting")) return false;

  // Keep separate when route types differ meaningfully — a direct path (available now)
  // and a bridge/portfolio path (requires proof, credentials, or positioning first)
  // are distinct career moves regardless of shared pathFamily.
  const rtA = str(dirA.routeType);
  const rtB = str(dirB.routeType);
  if (
    rtA !== rtB &&
    (rtA === "bridge" ||
      rtB === "bridge" ||
      rtA === "portfolio" ||
      rtB === "portfolio")
  ) {
    return false;
  }

  return true;
}

function mergeTargetRoleExamples(keptDir, removedDir, policyNotes) {
  const existing = arr(keptDir.targetRoleExamples);
  const keptLabelNorm = normalizeForMatch(keptDir.label);
  const additions = [];

  // The removed direction's own label is a candidate targetRoleExample
  const removedClean = cleanLabel(removedDir.label);
  if (
    removedClean &&
    !nearMatch(keptLabelNorm, removedClean) &&
    !existing.some((ex) => nearMatch(ex, removedClean))
  ) {
    additions.push(removedClean);
  }

  // Non-duplicate targetRoleExamples from the removed direction
  for (const ex of arr(removedDir.targetRoleExamples)) {
    if (!ex || typeof ex !== "string") continue;
    if (nearMatch(ex, keptDir.label)) continue;
    if (existing.some((e) => nearMatch(e, ex))) continue;
    if (additions.some((a) => nearMatch(a, ex))) continue;
    additions.push(ex);
  }

  if (additions.length > 0) {
    policyNotes.push(
      `Merged ${additions.length} targetRoleExample(s) from "${removedDir.label}" into "${keptDir.label}".`
    );
  }

  return [...existing, ...additions].slice(0, 6);
}

function consolidateByPathFamily(directions, policyNotes) {
  const pfKey = (d) => str(d.pathFamily).toLowerCase();

  // Group directions by pathFamily (exclude "other" and empty — no consolidation for these)
  const groups = {};
  for (const d of directions) {
    const family = pfKey(d);
    if (!family || family === "other") continue;
    if (!groups[family]) groups[family] = [];
    groups[family].push(d);
  }

  const toRemove = new Set();
  // Map from direction reference to its merged targetRoleExamples
  const mergedExamples = new Map();

  for (const group of Object.values(groups)) {
    if (group.length <= 1) continue;

    // Highest-scoring direction is the one to keep
    const sorted = [...group].sort((a, b) => directionScore(b) - directionScore(a));
    const kept = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const candidate = sorted[i];
      if (!shouldConsolidatePair(kept, candidate)) continue;

      toRemove.add(candidate);
      policyNotes.push(
        `Consolidated same-family directions (${pfKey(kept)}): kept "${kept.label}", merged "${candidate.label}".`
      );

      // Accumulate merged examples on the kept direction (may be updated in multiple passes)
      const currentKept = { ...kept, targetRoleExamples: mergedExamples.get(kept) || arr(kept.targetRoleExamples) };
      mergedExamples.set(kept, mergeTargetRoleExamples(currentKept, candidate, policyNotes));
    }
  }

  return directions
    .filter((d) => !toRemove.has(d))
    .map((d) => {
      if (mergedExamples.has(d)) {
        return { ...d, targetRoleExamples: mergedExamples.get(d) };
      }
      return d;
    });
}

// ─── Step 2: Sort by practical priority ───────────────────────────────────────

function sortByPracticalPriority(directions, policyNotes) {
  const originalLabels = directions.map((d) => str(d.label));
  const sorted = [...directions].sort((a, b) => directionScore(b) - directionScore(a));
  const sortedLabels = sorted.map((d) => str(d.label));

  if (JSON.stringify(originalLabels) !== JSON.stringify(sortedLabels)) {
    policyNotes.push(
      "Reordered directions by practical priority (profileCredibility + routeType + financialRisk + executionRisk)."
    );
  }

  return sorted;
}

// ─── Step 2b: Cap at three ────────────────────────────────────────────────────
// The portfolio should present at most 3 distinct paths. Directions are already
// sorted by practical priority score, so slice(0, 3) keeps the strongest ones.
// A distinct third path family (e.g. consulting_advisory) is preserved as long as
// it survived consolidation — this cap only triggers when the AI returns 4+.

function capAtThree(directions, policyNotes) {
  if (directions.length <= 3) return directions;
  policyNotes.push(
    `Capped directions from ${directions.length} to 3 (kept top 3 by practical priority score).`
  );
  return directions.slice(0, 3);
}

// ─── Step 3: Assign recommendationType ────────────────────────────────────────

function deriveRecommendationType(direction, positionIndex) {
  const rt = str(direction.routeType).toLowerCase();
  const profCred = str(direction.profileCredibility?.level).toLowerCase();
  const finRisk = str(direction.financialRisk?.level).toLowerCase();
  const execRisk = str(direction.executionRisk?.level).toLowerCase();
  const conf = str(direction.confidence).toLowerCase();

  // Bridge routeType = real capability/credential/proof gap — always bridge.
  // "direct or bridge" is NOT a pure bridge; it means the person has a direct option.
  // Only treat as bridge when the route is exclusively bridge (not "direct or bridge").
  if (rt.includes("bridge") && !rt.includes("direct")) return "bridge";

  // Exploratory routeType
  if (rt.includes("exploratory")) return "exploratory";

  // Low profile credibility or insufficient data → exploratory at any position.
  // Policy never assigns "not_recommended" — that is reserved for the AI's own assessment
  // or blocked/hard-constrained directions. High financial or execution risk alone does
  // not make a direction disappear.
  if (profCred === "low" || conf === "insufficient_data") return "exploratory";

  // Position 0: primary when evidence supports it
  if (positionIndex === 0 && (profCred === "high" || profCred === "medium")) {
    return "primary";
  }

  // Position 1: secondary for any credible direction
  if (positionIndex === 1) {
    return "secondary";
  }

  // Position 2+ (third direction — typically a distinct consulting/advisory or
  // transformation path preserved because it has a different pathFamily):
  // - high credibility → secondary (a strong but lower-priority alternative)
  // - medium credibility + BOTH financial and execution risk high → exploratory
  //   (the path is worth considering but not immediately actionable)
  // - medium credibility otherwise → secondary
  if (profCred === "high") return "secondary";
  if (profCred === "medium") {
    if (finRisk === "high" && execRisk === "high") return "exploratory";
    return "secondary";
  }

  return "exploratory";
}

function applyRecommendationTypes(directions, policyNotes) {
  const changes = [];

  const result = directions.map((d, i) => {
    const newType = deriveRecommendationType(d, i);
    if (newType !== str(d.recommendationType)) {
      changes.push(`"${d.label}": ${d.recommendationType} → ${newType}`);
    }
    return { ...d, recommendationType: newType };
  });

  if (changes.length > 0) {
    policyNotes.push(`Reassigned recommendationType — ${changes.join("; ")}.`);
  }

  return result;
}

// ─── Step 4: Label cleanup ────────────────────────────────────────────────────

function applyLabelCleanup(directions, policyNotes) {
  const changes = [];

  const result = directions.map((d) => {
    const cleaned = cleanLabel(d.label);
    if (cleaned !== str(d.label)) {
      changes.push(`"${d.label}" → "${cleaned}"`);
      return { ...d, label: cleaned };
    }
    return d;
  });

  if (changes.length > 0) {
    policyNotes.push(`Cleaned direction label(s): ${changes.join("; ")}.`);
  }

  return result;
}

// ─── Step 5: Cross-direction targetRoleExamples dedup ─────────────────────────

function applyTargetRoleExamplesDedup(directions, policyNotes) {
  const allLabels = directions.map((d) => str(d.label));
  let removedCount = 0;

  const result = directions.map((d, i) => {
    const otherLabels = allLabels.filter((_, j) => j !== i);
    const original = arr(d.targetRoleExamples);
    const filtered = original.filter((ex) => {
      const conflicts = otherLabels.some((other) => nearMatch(ex, other));
      if (conflicts) removedCount++;
      return !conflicts;
    });
    const capped = filtered.slice(0, 6);
    return capped.length !== original.length ? { ...d, targetRoleExamples: capped } : d;
  });

  if (removedCount > 0) {
    policyNotes.push(
      `Removed ${removedCount} targetRoleExample(s) that duplicated a standalone direction label.`
    );
  }

  return result;
}

// ─── Step 6: Rewrite displayOrder ────────────────────────────────────────────

function applyDisplayOrderRewrite(directions) {
  return directions.map((d, i) => ({ ...d, displayOrder: i + 1 }));
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Apply deterministic portfolio policy to a normalized FinalDirectionPortfolioV31.
 * Returns a new object — does not mutate the input.
 *
 * Policy steps (in order):
 * 1. Consolidate directions sharing the same pathFamily (keeps highest-scoring, merges examples)
 * 2. Sort by practical priority (profileCredibility + route + financialRisk + executionRisk)
 * 2b. Cap at 3 directions (defensive ceiling; distinct path families survive consolidation)
 * 3. Assign recommendationType — primary/secondary/exploratory based on position and dimensions;
 *    policy never assigns "not_recommended"; high financial/execution risk does not drop a
 *    direction with medium/high profileCredibility
 * 4. Clean direction labels (remove status parentheticals)
 * 5. Remove targetRoleExamples that duplicate a standalone direction label
 * 6. Rewrite displayOrder sequentially (1, 2, 3…)
 *
 * @param {Object} finalPortfolio Normalized, validated FinalDirectionPortfolioV31.
 * @returns {Object} Policy-applied portfolio with policyApplied=true and policyNotes[].
 */
export function applyFinalPortfolioPolicyV31(finalPortfolio) {
  if (
    !finalPortfolio ||
    typeof finalPortfolio !== "object" ||
    Array.isArray(finalPortfolio)
  ) {
    return finalPortfolio;
  }

  const policyNotes = [];

  // Shallow-clone each direction so later steps can spread without mutation
  let directions = arr(finalPortfolio.directions).map((d) => ({ ...d }));

  directions = consolidateByPathFamily(directions, policyNotes);
  directions = sortByPracticalPriority(directions, policyNotes);
  directions = capAtThree(directions, policyNotes);
  directions = applyRecommendationTypes(directions, policyNotes);
  directions = applyLabelCleanup(directions, policyNotes);
  directions = applyTargetRoleExamplesDedup(directions, policyNotes);
  directions = applyDisplayOrderRewrite(directions);

  return {
    ...finalPortfolio,
    directions,
    policyApplied: true,
    policyNotes,
  };
}
