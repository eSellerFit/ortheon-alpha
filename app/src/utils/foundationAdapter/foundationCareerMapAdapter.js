// src/utils/foundationAdapter/foundationCareerMapAdapter.js
// Phase 2G: Foundation-aware career map sanitization.
//
// Takes a base career map from scoring.js generateCareerMap and:
// - Filters adjacent / longer-path nodes that fail the live profile check.
// - Fixes currentProfileNode cluster/label when the profile is workforce-primary.
// - Replaces a tech-heavy mainPattern with a workforce-aligned one.
//
// Does not modify CareerDirectionMap.jsx or scoring.js.

// ── Adjacent node filters ──────────────────────────────────────────────────────

const TECH_EXEC_ADJACENT_CLUSTERS = new Set([
  "technology_executive",
  "engineering_leadership",
  "platform_technology",
  "ai_transformation",
]);

function isLegacyTechExecDirection(directionId) {
  return typeof directionId === "string" && directionId.startsWith("TE-");
}

function isLegacySellerDirection(directionId) {
  return typeof directionId === "string" && directionId.startsWith("SR-");
}

function shouldIncludeAdjacentNode(node, liveProfile) {
  const { workforce, techExec, sales } = liveProfile;

  if (workforce.isWorkforce && !techExec.isTechExec) {
    if (TECH_EXEC_ADJACENT_CLUSTERS.has(node.mapCluster)) return false;
    if (isLegacyTechExecDirection(node.directionId)) return false;
  }

  if (!sales.hasSales && isLegacySellerDirection(node.directionId)) {
    return false;
  }

  return true;
}

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
  if (!liveProfile.workforce.isWorkforce) return summary;
  if (!isTechHeavySummary(summary.mainPattern)) return summary;

  return {
    ...summary,
    mainPattern: buildWorkforceMainPattern(primaryNodes),
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function sanitizeFoundationCareerMap(baseMap, liveProfile) {
  if (!baseMap || !liveProfile) return baseMap;

  const adjacentNodes = (baseMap.adjacentNodes || []).filter((node) =>
    shouldIncludeAdjacentNode(node, liveProfile)
  );

  const longerPathNodes = (baseMap.longerPathNodes || []).filter((node) =>
    shouldIncludeAdjacentNode(node, liveProfile)
  );

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
    adjacentNodes,
    longerPathNodes,
    summary,
    _foundationSanitized: true,
  };
}
