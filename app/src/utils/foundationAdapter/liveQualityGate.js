// src/utils/foundationAdapter/liveQualityGate.js
// Phase 2G: Live recommendation quality gate + workforce/people profile calibration.
//
// Applies a strict display-safe gate before foundation candidates are adapted to
// the live recommendation shape, followed by false-positive family blocks and
// workforce-priority reranking.
//
// Public API:
//   buildLiveProfile(assessment) → profile object used by gate and map adapter
//   applyLiveQualityGate(selectedRecommendations, showableBridges, assessment, minCount)

// ── Spine constants ────────────────────────────────────────────────────────────

const TECH_SPINES = new Set([
  "product_technology",
  "it_enterprise_systems",
  "digital_transformation_ai",
]);

const COMMERCIAL_SPINE = "commercial_sales_partnerships";
const MARKETING_SPINE = "marketing_growth";

// ── Profile search text ────────────────────────────────────────────────────────

function buildSearchText(assessment) {
  const cv = assessment?.cvProfile || {};
  const competencyEvidence = Array.isArray(cv.competencySignals)
    ? cv.competencySignals.map((s) => s.evidence || "").join(" ")
    : "";
  const domainText = Array.isArray(cv.domainSignals)
    ? cv.domainSignals.join(" ")
    : "";
  return [
    assessment?.currentRole,
    assessment?.currentIndustry,
    cv.careerSummary,
    domainText,
    cv.senioritySignal,
    cv.leadershipScope,
    cv.tenurePattern,
    competencyEvidence,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getDomainSignals(assessment) {
  return Array.isArray(assessment?.cvProfile?.domainSignals)
    ? assessment.cvProfile.domainSignals.map((d) => String(d).toLowerCase())
    : [];
}

// ── Workforce / People / Talent profile detection ──────────────────────────────

const WORKFORCE_DOMAIN_SIGNALS = new Set([
  "human resources",
  "human_resources",
  "people operations",
  "people_operations",
  "talent acquisition",
  "talent_acquisition",
  "talent management",
  "talent_management",
  "workforce planning",
  "workforce_planning",
  "people analytics",
  "people_analytics",
  "hr analytics",
  "hr_analytics",
  "hr tech",
  "hr_tech",
  "hris",
  "recruiting",
  "recruitment",
  "staffing",
  "outplacement",
]);

const WORKFORCE_STRONG_KEYWORDS = [
  "workforce planning",
  "labor forecasting",
  "capacity planning",
  "staffing model",
  "headcount model",
  "headcount planning",
  "labor supply planning",
  "workforce intelligence",
  "talent intelligence",
  "people analytics",
  "hr analytics",
  "hris",
  "workforce strategy",
  "workforce data",
  "labor demand",
  "rfl",
  "reach frequency length",
  "contractor workforce",
  "gig workforce",
  "frontline workforce",
  "workforce forecasting",
];

const HR_PEOPLE_KEYWORDS = [
  "talent acquisition",
  "recruiting operations",
  "recruiting",
  "recruitment",
  "hr business partner",
  "hrbp",
  "people partner",
  "people operations",
  "human resources",
  "organizational development",
  "org design",
  "total rewards",
  "compensation and benefits",
  "learning and development",
  "l&d",
  "employee relations",
  "employer brand",
  "onboarding",
  "hr transformation",
  "talent management",
  "performance management",
  "hr strategy",
];

const HR_TITLE_PHRASES = [
  "hr manager",
  "hr director",
  "human resources manager",
  "human resources director",
  "hr business partner",
  "hrbp",
  "people partner",
  "people operations manager",
  "people operations director",
  "talent acquisition manager",
  "talent acquisition director",
  "recruiting manager",
  "recruitment manager",
  "recruiter",
  "sourcer",
  "talent partner",
  "workforce planning manager",
  "people analytics manager",
  "hris manager",
  "compensation manager",
  "total rewards manager",
  "learning and development manager",
  "l&d manager",
  "head of people",
  "head of hr",
  "chief people officer",
  "chief hr officer",
  "chro",
  "vp people",
  "vp hr",
  "vp of hr",
  "director of people",
  "director of hr",
];

export function detectWorkforceProfile(assessment) {
  const text = buildSearchText(assessment);
  const domainSignals = getDomainSignals(assessment);

  const hasExplicitDomain = domainSignals.some((d) =>
    WORKFORCE_DOMAIN_SIGNALS.has(d)
  );
  const hasHrTitle = HR_TITLE_PHRASES.some((phrase) => text.includes(phrase));
  const workforceStrongMatches = WORKFORCE_STRONG_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;
  const hrPeopleMatches = HR_PEOPLE_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;

  const totalMatches =
    workforceStrongMatches +
    hrPeopleMatches +
    (hasExplicitDomain ? 3 : 0) +
    (hasHrTitle ? 2 : 0);

  const isWorkforce =
    hasExplicitDomain || hasHrTitle || totalMatches >= 2;
  const strength =
    totalMatches >= 7 ? "strong" : totalMatches >= 3 ? "moderate" : "weak";

  return { isWorkforce, strength, totalMatches, hasExplicitDomain, hasHrTitle };
}

// ── Technology executive profile detection ─────────────────────────────────────

const TECH_EXEC_STRONG_KEYWORDS = [
  "cto",
  "chief technology officer",
  "chief technical officer",
  "vp engineering",
  "vp of technology",
  "vp technology",
  "head of engineering",
  "head of development",
  "technical director",
  "technology director",
  "chief of ai",
  "chief ai officer",
  "software engineering",
  "software development",
  "enterprise architecture",
  "platform architecture",
  "platform modernization",
  "cloud architecture",
  "devops",
  "infrastructure engineering",
  "cybersecurity",
];

const TECH_DOMAIN_SIGNAL_SET = new Set([
  "technology",
  "software engineering",
  "software_engineering",
  "data science",
  "data_science",
  "ai",
  "artificial intelligence",
  "machine learning",
]);

export function detectTechExecutiveProfile(assessment) {
  const text = buildSearchText(assessment);
  const domainSignals = getDomainSignals(assessment);

  const hasTechDomain = domainSignals.some((d) =>
    TECH_DOMAIN_SIGNAL_SET.has(d)
  );
  const matchCount = TECH_EXEC_STRONG_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;

  const isTechExec = hasTechDomain && matchCount >= 2;
  const strength =
    matchCount >= 4 ? "strong" : matchCount >= 2 ? "moderate" : "weak";

  return { isTechExec, strength, matchCount, hasTechDomain };
}

// ── Commercial / Sales profile detection ──────────────────────────────────────

const SALES_KEYWORDS = [
  "enterprise sales",
  "account management",
  "customer success",
  "revenue operations",
  "business development",
  "partner success",
  "seller enablement",
  "account executive",
  "quota",
  "sales leadership",
  "commercial leadership",
  "b2b sales",
  "pipeline management",
  "revenue growth",
  "deal closing",
  "channel partnerships",
];

export function detectSalesProfile(assessment) {
  const text = buildSearchText(assessment);
  const matchCount = SALES_KEYWORDS.filter((kw) => text.includes(kw)).length;
  return { hasSales: matchCount >= 2, matchCount };
}

// ── Marketing / Communications profile detection ───────────────────────────────

const MARKETING_KEYWORDS = [
  "marketing leadership",
  "brand strategy",
  "growth marketing",
  "performance marketing",
  "go-to-market",
  "gtm strategy",
  "product marketing",
  "demand generation",
  "content marketing",
  "marketing operations",
  "seo strategy",
];

const COMMUNICATIONS_PR_KEYWORDS = [
  "public relations",
  "communications director",
  "corporate communications",
  "public affairs",
  "media relations",
  "pr strategy",
  "crisis communications",
  "external communications",
];

export function detectMarketingProfile(assessment) {
  const text = buildSearchText(assessment);
  const marketingMatches = MARKETING_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;
  const commsPRMatches = COMMUNICATIONS_PR_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;
  return {
    hasMarketing: marketingMatches >= 2,
    hasCommunicationsPR: commsPRMatches >= 1,
    marketingMatches,
    commsPRMatches,
  };
}

// ── Composite profile ──────────────────────────────────────────────────────────

export function buildLiveProfile(assessment) {
  return {
    workforce: detectWorkforceProfile(assessment),
    techExec: detectTechExecutiveProfile(assessment),
    sales: detectSalesProfile(assessment),
    marketing: detectMarketingProfile(assessment),
  };
}

// ── Strict display-safe gate ───────────────────────────────────────────────────

const STRICT_MAPPING_CONFIDENCE = new Set([
  "exact",
  "composite_resolved_high",
]);

const STRICT_ALIGNMENT_TYPES = new Set([
  "primary_spine",
  "secondary_spine",
]);

function passesStrictDisplaySafeGate(candidate) {
  if (candidate.displaySafeStatus !== "display_safe") {
    return {
      passes: false,
      reason: `displaySafeStatus is "${candidate.displaySafeStatus}" — requires "display_safe".`,
    };
  }
  if (!STRICT_MAPPING_CONFIDENCE.has(candidate.canonicalMappingConfidence)) {
    return {
      passes: false,
      reason: `canonicalMappingConfidence is "${candidate.canonicalMappingConfidence}" — requires "exact" or "composite_resolved_high".`,
    };
  }
  if (!candidate.familyId) {
    return {
      passes: false,
      reason: "No resolved canonical family ID.",
    };
  }
  if (candidate.compositeResolutionStatus?.startsWith("unresolved")) {
    return {
      passes: false,
      reason: `compositeResolutionStatus is "${candidate.compositeResolutionStatus}".`,
    };
  }
  const matchType = candidate.alignmentMatchType;
  if (matchType && !STRICT_ALIGNMENT_TYPES.has(matchType)) {
    return {
      passes: false,
      reason: `alignmentMatchType is "${matchType}" — requires "primary_spine" or "secondary_spine".`,
    };
  }
  return { passes: true, reason: null };
}

// ── False-positive family blocks ───────────────────────────────────────────────

function evaluateFalsePositiveBlocks(candidate, profile) {
  const { familyId, familySpineId, legacyDirectionId } = candidate;

  if (
    TECH_SPINES.has(familySpineId) &&
    profile.workforce.isWorkforce &&
    !profile.techExec.isTechExec
  ) {
    return {
      blocked: true,
      reason: `Tech-spine family ${familyId} (${familySpineId}) blocked: profile is workforce/people-primary without technology executive evidence.`,
    };
  }

  if (familySpineId === COMMERCIAL_SPINE && !profile.sales.hasSales) {
    return {
      blocked: true,
      reason: `Commercial/sales family ${familyId} blocked: no explicit sales, account management, or customer success evidence.`,
    };
  }

  if (familySpineId === MARKETING_SPINE && !profile.marketing.hasMarketing) {
    return {
      blocked: true,
      reason: `Marketing family ${familyId} blocked: no explicit marketing, brand, or GTM evidence.`,
    };
  }

  if (
    (familyId === "MG-02" || legacyDirectionId === "BF-10-IF") &&
    !profile.marketing.hasCommunicationsPR
  ) {
    return {
      blocked: true,
      reason: `Brand & Communications (${legacyDirectionId || familyId}) blocked: no explicit PR or corporate communications evidence.`,
    };
  }

  return { blocked: false, reason: null };
}

// ── Candidate gate evaluation ──────────────────────────────────────────────────

function evaluateCandidateLiveGate(candidate, profile) {
  const strictResult = passesStrictDisplaySafeGate(candidate);
  if (!strictResult.passes) {
    return {
      passes: false,
      gateStatus: "rejected_strict_gate",
      reasons: [strictResult.reason],
    };
  }

  const fpResult = evaluateFalsePositiveBlocks(candidate, profile);
  if (fpResult.blocked) {
    return {
      passes: false,
      gateStatus: "rejected_false_positive",
      reasons: [fpResult.reason],
    };
  }

  return {
    passes: true,
    gateStatus: "passed",
    reasons: [
      "Passed strict display-safe gate.",
      "Passed false-positive block checks.",
    ],
  };
}

// Bridge candidates already passed evaluateBridgeVisibility — skip displaySafeStatus check.
function evaluateBridgeCandidateLiveGate(candidate, profile) {
  if (!STRICT_MAPPING_CONFIDENCE.has(candidate.canonicalMappingConfidence)) {
    return {
      passes: false,
      gateStatus: "rejected_weak_bridge_mapping",
      reasons: [
        `Bridge candidate mapping confidence "${candidate.canonicalMappingConfidence}" not high enough for live widening.`,
      ],
    };
  }

  const fpResult = evaluateFalsePositiveBlocks(candidate, profile);
  if (fpResult.blocked) {
    return {
      passes: false,
      gateStatus: "rejected_false_positive",
      reasons: [fpResult.reason],
    };
  }

  return {
    passes: true,
    gateStatus: "passed_bridge",
    reasons: [
      "Bridge candidate passed mapping confidence check and false-positive blocks.",
    ],
  };
}

// ── Workforce priority ranking ─────────────────────────────────────────────────

const WORKFORCE_FAMILY_PRIORITY = {
  "WI-01": 0,
  "WI-04": 1,
  "WI-02": 2,
  "WI-03": 3,
  "PO-03": 4,
  "PO-01": 5,
  "PO-02": 6,
  "PO-04": 7,
  "PO-05": 8,
  "PO-06": 9,
  "MP-05": 10,
  "OD-01": 20,
};

function numberOrZero(v) {
  return Number.isFinite(Number(v)) ? Number(v) : 0;
}

function rankForWorkforceProfile(a, b) {
  const aPriority = WORKFORCE_FAMILY_PRIORITY[a.familyId] ?? 12;
  const bPriority = WORKFORCE_FAMILY_PRIORITY[b.familyId] ?? 12;
  if (aPriority !== bPriority) return aPriority - bPriority;
  return numberOrZero(b.overallLensScore) - numberOrZero(a.overallLensScore);
}

// ── Conservative fallback widening ────────────────────────────────────────────

function tryWidenWithBridges(passed, showableBridges, profile, minCount) {
  if (passed.length >= minCount) return passed;

  const existingIds = new Set(
    passed.map((c) => c.legacyDirectionId).filter(Boolean)
  );
  const widened = [...passed];

  for (const bridge of showableBridges) {
    if (existingIds.has(bridge.legacyDirectionId)) continue;

    const gateResult = evaluateBridgeCandidateLiveGate(bridge, profile);
    if (gateResult.passes) {
      widened.push({
        ...bridge,
        _widenedFromBridge: true,
        _gateStatus: gateResult.gateStatus,
        _gateReasons: gateResult.reasons,
      });
      existingIds.add(bridge.legacyDirectionId);
    }

    if (widened.length >= minCount) break;
  }

  return widened;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function applyLiveQualityGate(
  selectedRecommendations,
  showableBridges,
  assessment,
  minCount = 2
) {
  const profile = buildLiveProfile(assessment);

  const passed = [];
  const rejected = [];

  for (const candidate of selectedRecommendations) {
    const result = evaluateCandidateLiveGate(candidate, profile);
    if (result.passes) {
      passed.push({
        ...candidate,
        _gateStatus: result.gateStatus,
        _gateReasons: result.reasons,
      });
    } else {
      rejected.push({
        ...candidate,
        _gateStatus: result.gateStatus,
        _gateReasons: result.reasons,
      });
    }
  }

  const widened = tryWidenWithBridges(
    passed,
    showableBridges || [],
    profile,
    minCount
  );

  if (profile.workforce.isWorkforce && profile.workforce.strength !== "weak") {
    widened.sort(rankForWorkforceProfile);
  }

  const rankedPassed = widened.map((c, idx) => ({ ...c, rank: idx + 1 }));

  return { passed: rankedPassed, rejected, profile };
}
