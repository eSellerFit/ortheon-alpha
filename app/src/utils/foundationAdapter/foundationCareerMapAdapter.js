// src/utils/foundationAdapter/foundationCareerMapAdapter.js
// Phase 2G: Foundation-aware career map sanitization.
//
// Takes a base career map from scoring.js generateCareerMap and:
// - Removes non-primary map nodes for the MVP report surface.
// - Fixes currentProfileNode cluster/label when the profile is workforce-primary.
// - Replaces a tech-heavy mainPattern with a workforce-aligned one.
//
// Does not modify CareerDirectionMap.jsx or scoring.js.

// ── Current profile node fix ───────────────────────────────────────────────────

const WORKFORCE_PROFILE_CLUSTERS = new Set([
  "people_operations",
  "workforce_intelligence",
  "people_analytics_hr_tech",
]);

const TECH_LABEL_PARTS = new Set([
  "Technology",
  "Technology Executive",
  "Data / AI",
  "Software Engineering",
]);

function sanitizeCurrentProfileNode(currentProfileNode, liveProfile) {
  if (!currentProfileNode) return currentProfileNode;
  if (!liveProfile.workforce.isWorkforce) return currentProfileNode;
  if (WORKFORCE_PROFILE_CLUSTERS.has(currentProfileNode.mapCluster)) {
    return currentProfileNode;
  }

  const { strength } = liveProfile.workforce;
  if (strength !== "strong" && strength !== "moderate") return currentProfileNode;

  const rawLabel = currentProfileNode.label || "";
  const cleanedLabel = liveProfile.techExec.isTechExec
    ? rawLabel
    : rawLabel
        .split(" / ")
        .filter((part) => !TECH_LABEL_PARTS.has(part))
        .join(" / ") || rawLabel;

  return {
    ...currentProfileNode,
    label: cleanedLabel,
    mapQuadrant: "corporate_human",
    mapCluster: liveProfile.workforce.hasExplicitDomain
      ? "workforce_intelligence"
      : "people_operations",
  };
}

// ── Map summary fix ────────────────────────────────────────────────────────────

const TECH_HEAVY_SUMMARY_TERMS = [
  "technology leadership",
  "software/platform",
  "platform strategy",
  "engineering leadership",
  "ai transformation",
  "enterprise execution",
  "platform-scale execution",
  "digital transformation",
  "platform modernization",
  "technology strategy",
  "technology executive",
];

function isTechHeavySummary(mainPattern) {
  if (!mainPattern) return false;
  const lower = mainPattern.toLowerCase();
  return TECH_HEAVY_SUMMARY_TERMS.some((term) => lower.includes(term));
}

function buildWorkforceMainPattern(primaryNodes) {
  const clusters = new Set((primaryNodes || []).map((n) => n.mapCluster));

  if (
    clusters.has("workforce_intelligence") &&
    clusters.has("people_operations")
  ) {
    return "Workforce planning, talent systems, people operations, and capacity strategy";
  }
  if (clusters.has("workforce_intelligence")) {
    return "Workforce planning, talent intelligence, and people strategy";
  }
  if (clusters.has("people_operations") && clusters.has("people_analytics_hr_tech")) {
    return "People operations, HR business partnership, and talent systems";
  }
  if (clusters.has("people_operations")) {
    return "HR leadership, people operations, and talent management";
  }
  return "People strategy, workforce planning, and talent operations";
}

function sanitizeSummary(summary, liveProfile, primaryNodes) {
  if (!summary) return summary;
  const baseSummary = {
    ...summary,
    bridgeGoal: null,
    mainCaution: null,
  };

  if (!liveProfile.workforce.isWorkforce) return baseSummary;
  if (!isTechHeavySummary(summary.mainPattern)) return baseSummary;

  return {
    ...baseSummary,
    mainPattern: buildWorkforceMainPattern(primaryNodes),
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function sanitizeFoundationCareerMap(baseMap, liveProfile) {
  if (!baseMap || !liveProfile) return baseMap;

  const currentProfileNode = sanitizeCurrentProfileNode(
    baseMap.currentProfileNode,
    liveProfile
  );

  const summary = sanitizeSummary(
    baseMap.summary,
    liveProfile,
    baseMap.primaryNodes || []
  );

  return {
    ...baseMap,
    currentProfileNode,
    adjacentNodes: [],
    longerPathNodes: [],
    nearbyTrajectories: [],
    nearbyDirections: [],
    nearby: [],
    summary,
    _foundationSanitized: true,
    _mvpPrimaryOnly: true,
  };
}
