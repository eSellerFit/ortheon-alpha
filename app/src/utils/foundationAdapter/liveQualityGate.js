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
  "headcount modeling",
  "headcount planning",
  "labor supply planning",
  "labor supply",
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
  "ta hub",
  "ta hubs",
  "hr operations",
  "people technology",
  "workforce systems",
  "talent operations",
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

// Foundation family IDs that are safe/appropriate for workforce profiles
export const WORKFORCE_SAFE_FAMILY_IDS = new Set([
  "WI-01", "WI-02", "WI-03", "WI-04",
  "PO-01", "PO-02", "PO-03", "PO-04", "PO-05", "PO-06",
  "OD-01", "OD-02",
  "MP-05",
]);

// Role library direction IDs for workforce roles (for emergency injection)
const WORKFORCE_SAFE_LEGACY_IDS = [
  "BF-5-E",  // Workforce Planning / Talent Intelligence (WI-01 + WI-04)
  "BF-13-E", // Talent Acquisition Leadership / Recruiting Strategy (PO-03)
  "BF-4-E",  // HR & People Operations (PO-01)
  "BF-12-E", // Strategic HR Business Partner (PO-02)
  "BF-14-E", // Organizational Development / HR Transformation (PO-04)
  "BF-6-E",  // People Analytics / HR Tech (WI-02 + WI-03)
  "BF-15-E", // Learning & Development (PO-05)
  "BF-16-E", // Total Rewards (PO-06)
];

// Family ID → spine mapping for injected workforce candidates
const WORKFORCE_FAMILY_SPINE = {
  "WI-01": "workforce_intelligence",
  "WI-02": "workforce_intelligence",
  "WI-03": "workforce_intelligence",
  "WI-04": "workforce_intelligence",
  "PO-01": "people_operations",
  "PO-02": "people_operations",
  "PO-03": "people_operations",
  "PO-04": "people_operations",
  "PO-05": "people_operations",
  "PO-06": "people_operations",
  "OD-01": "organizational_development",
  "OD-02": "organizational_development",
  "MP-05": "mission_social",
};

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
  const workforce = detectWorkforceProfile(assessment);
  const techExec = detectTechExecutiveProfile(assessment);
  const sales = detectSalesProfile(assessment);
  const marketing = detectMarketingProfile(assessment);

  // workforcePeopleProfile: true when workforce is clearly primary and technology
  // context is not strong enough to override it. "technology" domain signal alone
  // (without multiple tech-executive role keywords) is treated as a modifier,
  // not as evidence of a technology executive profile.
  const workforcePeopleProfile =
    workforce.isWorkforce &&
    workforce.strength !== "weak" &&
    (workforce.strength === "strong" || techExec.matchCount < 3);

  return { workforce, techExec, sales, marketing, workforcePeopleProfile };
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

  if (profile.workforcePeopleProfile) {
    // Hard-block all tech-spine families for confirmed workforce-primary profiles.
    // "technology" domain signal alone does not constitute technology executive
    // evidence — AI tools, workforce systems, and automation are modifiers.
    if (TECH_SPINES.has(familySpineId)) {
      return {
        blocked: true,
        reason: `Hard-blocked for workforcePeopleProfile: ${familyId} (spine: ${familySpineId}). Technology-domain signal alone does not override strong workforce evidence.`,
      };
    }
    // Also block by legacy direction ID prefix (TE-* roles)
    if (legacyDirectionId && /^TE-/.test(legacyDirectionId)) {
      return {
        blocked: true,
        reason: `Hard-blocked TE-* direction ${legacyDirectionId} for workforcePeopleProfile.`,
      };
    }
  } else if (
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

// ── Workforce score calibration ───────────────────────────────────────────────
//
// When a workforce-primary profile's candidates arrive via workforce_safe_widening
// or workforce_injected (with conservative default scores), lift overallLensScore
// to a domain-appropriate floor so fitBand and UI labels reflect real fit.
//
// Only fires when:
// - workforcePeopleProfile === true
// - the candidate's familyId is in the calibration table
// - at least 2 specific evidence keywords are confirmed in the assessment text

const WORKFORCE_MIN_CALIBRATED_SCORES = {
  "WI-01": 84,
  "WI-04": 80,
  "WI-02": 78,
  "WI-03": 78,
  "PO-03": 82,
  "PO-01": 78,
  "PO-02": 78,
  "PO-04": 76,
  "PO-05": 76,
  "PO-06": 76,
  "OD-01": 76,
  "OD-02": 76,
  "MP-05": 74,
};

const WORKFORCE_CALIBRATION_EVIDENCE_KEYWORDS = [
  "workforce planning",
  "labor forecasting",
  "capacity planning",
  "staffing model",
  "headcount modeling",
  "talent acquisition",
  "recruiting operations",
  "frontline workforce",
  "contractor workforce",
  "gig workforce",
  "labor supply planning",
  "rfl",
  "reach frequency length",
  "ta hub",
  "ta hubs",
  "hr operations",
  "people operations",
];

export function getWorkforceCalibrationEvidenceCount(assessment) {
  const text = buildSearchText(assessment);
  return WORKFORCE_CALIBRATION_EVIDENCE_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;
}

function calibrateWorkforceCandidateScore(candidate, profile, evidenceCount) {
  if (!profile.workforcePeopleProfile) return candidate;

  const minScore = WORKFORCE_MIN_CALIBRATED_SCORES[candidate.familyId];
  if (!minScore) return candidate; // family not in calibration table

  // Require at least 2 domain-specific evidence keywords to calibrate.
  // Prevents inflation for profiles that are only weakly workforce-oriented.
  if (evidenceCount < 2) return candidate;

  const currentScore = Number(candidate.overallLensScore) || 0;
  if (currentScore >= minScore) return candidate; // already at or above floor

  return {
    ...candidate,
    overallLensScore: minScore,
    _originalScoreBeforeCalibration: currentScore,
    _workforceScoreCalibrated: true,
    _calibrationReason: `Workforce score floor applied: familyId=${candidate.familyId}, evidenceCount=${evidenceCount}, original=${currentScore}, floor=${minScore}.`,
  };
}

// ── Workforce-safe widening ────────────────────────────────────────────────────

// For workforcePeopleProfile, accept rejected WI/PO/OD candidates with relaxed
// mapping-confidence requirements. Only requires displaySafeStatus = "display_safe".
function tryWorkforceSafeWidening(passed, rejected, profile, minCount) {
  if (!profile.workforcePeopleProfile) return passed;
  if (passed.length >= minCount) return passed;

  const existingIds = new Set(
    passed.map((c) => c.legacyDirectionId).filter(Boolean)
  );
  const widened = [...passed];

  const workforceRejected = rejected
    .filter(
      (c) =>
        (WORKFORCE_SAFE_FAMILY_IDS.has(c.familyId) ||
          (c.legacyDirectionId &&
            WORKFORCE_SAFE_LEGACY_IDS.includes(c.legacyDirectionId))) &&
        !existingIds.has(c.legacyDirectionId) &&
        c.legacyDirectionId &&
        c.displaySafeStatus === "display_safe"
    )
    .sort(rankForWorkforceProfile);

  for (const candidate of workforceRejected) {
    widened.push({
      ...candidate,
      _widenedFromWorkforceSafe: true,
      _gateStatus: "workforce_safe_widening",
      _gateReasons: [
        `Workforce-safe widening: ${candidate.familyId || candidate.legacyDirectionId} accepted for workforcePeopleProfile. Original rejection: ${(candidate._gateReasons || []).join("; ")}`,
      ],
    });
    existingIds.add(candidate.legacyDirectionId);
    if (widened.length >= minCount) break;
  }

  return widened;
}

// Emergency injection: when the foundation engine produced no WI/PO candidates
// at all, create minimal synthetic candidates from known role library IDs so
// we never fall back to scoring.js for workforce profiles.
function buildWorkforceInjectedCandidates() {
  const defs = [
    { legacyDirectionId: "BF-5-E",  familyId: "WI-01", score: 68 },
    { legacyDirectionId: "BF-13-E", familyId: "PO-03", score: 65 },
    { legacyDirectionId: "BF-4-E",  familyId: "PO-01", score: 62 },
    { legacyDirectionId: "BF-12-E", familyId: "PO-02", score: 60 },
    { legacyDirectionId: "BF-14-E", familyId: "PO-04", score: 58 },
  ];

  return defs.map((def) => ({
    legacyDirectionId: def.legacyDirectionId,
    familyId: def.familyId,
    familySpineId: WORKFORCE_FAMILY_SPINE[def.familyId] || "people_operations",
    displaySafeStatus: "display_safe",
    canonicalMappingConfidence: "exact",
    alignmentMatchType: "primary_spine",
    overallLensScore: def.score,
    recommendedDisplayClassification: "Primary",
    sourceDiagnostic: {},
    compositeResolutionStatus: null,
    _workforceInjected: true,
    _gateStatus: "workforce_injected",
    _gateReasons: [
      "Emergency workforce injection: no foundation WI/PO candidates available for workforcePeopleProfile.",
    ],
  }));
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
  const blockedTeCandidates = [];

  for (const candidate of selectedRecommendations) {
    const result = evaluateCandidateLiveGate(candidate, profile);
    if (result.passes) {
      passed.push({
        ...candidate,
        _gateStatus: result.gateStatus,
        _gateReasons: result.reasons,
      });
    } else {
      const tagged = {
        ...candidate,
        _gateStatus: result.gateStatus,
        _gateReasons: result.reasons,
      };
      rejected.push(tagged);

      if (
        result.gateStatus === "rejected_false_positive" &&
        profile.workforcePeopleProfile &&
        (TECH_SPINES.has(candidate.familySpineId) ||
          /^TE-/.test(candidate.legacyDirectionId || ""))
      ) {
        blockedTeCandidates.push({
          legacyDirectionId: candidate.legacyDirectionId,
          familyId: candidate.familyId,
          reason: result.reasons[0],
        });
      }
    }
  }

  let fallbackType = "foundation_strict";
  let widened = [...passed];

  // For workforce-primary profiles: widen from rejected WI/PO/OD candidates
  // before trying bridge widening, to avoid pulling in tech directions.
  if (profile.workforcePeopleProfile && widened.length < minCount) {
    widened = tryWorkforceSafeWidening(passed, rejected, profile, minCount);
    if (widened.length > passed.length) {
      fallbackType = "workforce_safe_widening";
    }
  }

  // Emergency injection when foundation produced no usable WI/PO candidates.
  if (profile.workforcePeopleProfile && widened.length < minCount) {
    const preInjectionLength = widened.length;
    const existingIds = new Set(
      widened.map((c) => c.legacyDirectionId).filter(Boolean)
    );
    for (const inj of buildWorkforceInjectedCandidates()) {
      if (!existingIds.has(inj.legacyDirectionId) && widened.length < minCount) {
        widened.push(inj);
        existingIds.add(inj.legacyDirectionId);
      }
    }
    if (widened.length > preInjectionLength) {
      fallbackType = "workforce_injected";
    }
  }

  // Bridge widening only for non-workforce profiles (or workforce that still needs more)
  widened = tryWidenWithBridges(widened, showableBridges || [], profile, minCount);

  // Calibrate scores for workforce-primary profiles before the final sort.
  // This lifts conservative default scores from workforce_injected / workforce_safe_widening
  // candidates to domain-appropriate floors so fitBand reflects real fit.
  const workforceEvidenceCount = profile.workforcePeopleProfile
    ? getWorkforceCalibrationEvidenceCount(assessment)
    : 0;

  if (profile.workforcePeopleProfile && workforceEvidenceCount >= 2) {
    widened = widened.map((c) =>
      calibrateWorkforceCandidateScore(c, profile, workforceEvidenceCount)
    );
  }

  if (profile.workforce.isWorkforce && profile.workforce.strength !== "weak") {
    widened.sort(rankForWorkforceProfile);
  }

  const rankedPassed = widened.map((c, idx) => ({ ...c, rank: idx + 1 }));

  const debugMeta = {
    workforcePeopleProfile: profile.workforcePeopleProfile,
    fallbackType,
    blockedTeCandidates,
    workforceStrength: profile.workforce.strength,
    workforceTotalMatches: profile.workforce.totalMatches,
    techExecMatchCount: profile.techExec.matchCount,
    techExecIsTechExec: profile.techExec.isTechExec,
    workforceEvidenceCount,
    passedCount: rankedPassed.length,
    rejectedCount: rejected.length,
  };

  return { passed: rankedPassed, rejected, profile, debugMeta };
}
