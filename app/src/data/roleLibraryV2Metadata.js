// app/src/data/roleLibraryV2Metadata.js
// Role Library v2 metadata overlay — read-only, additive.
//
// Adds routing architecture fields to all 64 existing directions without
// modifying roleLibrary.js. This is the authoritative source for:
//   functionId, familyId, primarySubfamilyId, complexityBands,
//   primaryEvidenceDomain, evidenceRequired, negativeEvidence,
//   falsePositiveRisks, titleAliases
//
// complexityBands: 1=Practitioner/Specialist, 2=Program Owner/Senior Practitioner,
//                  3=Function Leader/Strategic Advisor
//
// Do not import scoring.js, liveQualityGate.js, or any engine here.
// Do not modify roleLibrary.js, scoring.js, or any protected file.

const ROLE_LIBRARY_V2_METADATA = {

  // ── PEOPLE ────────────────────────────────────────────────────────────────────

  "BF-4-E": {
    directionId: "BF-4-E",
    functionId: "PEOPLE",
    familyId: "PO-01",
    primarySubfamilyId: "HR_LEADERSHIP",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "HR leadership or people operations as primary professional domain, not merely managing a team",
    evidenceRequired: [
      "human resources",
      "hr leadership",
      "people operations",
      "talent management",
      "employee relations",
    ],
    negativeEvidence: [
      "workforce planning",
      "headcount modeling",
      "labor forecasting",
    ],
    falsePositiveRisks: [
      "WI-01 — prefer when ≥2 explicit workforce planning keywords dominate",
    ],
    titleAliases: [
      "chro",
      "chief people officer",
      "vp hr",
      "head of people",
      "hr director",
      "people director",
    ],
  },

  "BF-5-E": {
    directionId: "BF-5-E",
    functionId: "PEOPLE",
    familyId: "WI-01",
    primarySubfamilyId: "WORKFORCE_PLANNING",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Workforce analytics, labor forecasting, or headcount planning as the operational core",
    evidenceRequired: [
      "workforce planning",
      "headcount",
      "labor forecasting",
      "capacity planning",
    ],
    negativeEvidence: [
      "hr generalist",
      "employee relations",
      "talent acquisition operations",
    ],
    falsePositiveRisks: [
      "PO-01 — prefer for broad HR leaders without explicit workforce planning evidence",
    ],
    titleAliases: [
      "workforce planning director",
      "talent intelligence director",
      "vp workforce planning",
    ],
  },

  "BF-6-E": {
    directionId: "BF-6-E",
    functionId: "PEOPLE",
    familyId: "WI-02",
    primarySubfamilyId: "PEOPLE_ANALYTICS_HR_TECH",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Quantitative HR analytics, HRIS systems, or people data science as core function",
    evidenceRequired: [
      "people analytics",
      "hr analytics",
      "hris",
      "hr data",
    ],
    negativeEvidence: [
      "general hr management",
      "employee relations",
      "talent acquisition only",
    ],
    falsePositiveRisks: [
      "PO-01 — prefer for HR managers who use analytics tools but don't own the analytics function",
    ],
    titleAliases: [
      "people analytics manager",
      "hr analytics director",
      "hris manager",
    ],
  },

  "BF-12-E": {
    directionId: "BF-12-E",
    functionId: "PEOPLE",
    familyId: "PO-02",
    primarySubfamilyId: "STRATEGIC_HRBP",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Direct HR advisory partnership to business leaders as the defining relationship",
    evidenceRequired: [
      "hr business partner",
      "hrbp",
      "people partner",
      "business advisory",
    ],
    negativeEvidence: [
      "workforce planning",
      "talent acquisition operations",
      "general hr admin",
    ],
    falsePositiveRisks: [
      "PO-01 — prefer for generalist HR leaders; HRBP requires explicit partner-to-leader evidence",
    ],
    titleAliases: [
      "hr business partner",
      "hrbp",
      "people partner",
      "hr advisor",
      "senior hrbp",
    ],
  },

  "BF-13-E": {
    directionId: "BF-13-E",
    functionId: "PEOPLE",
    familyId: "PO-03",
    primarySubfamilyId: "TALENT_ACQUISITION",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Recruiting operations, hiring strategy, or talent sourcing leadership as primary function",
    evidenceRequired: [
      "talent acquisition",
      "recruiting",
      "hiring strategy",
      "sourcing",
    ],
    negativeEvidence: [
      "workforce forecasting",
      "hr generalist",
      "people operations only",
    ],
    falsePositiveRisks: [
      "WI-01 — TA fills positions; WI-01 models demand",
      "PO-01 — prefer for HR leaders where TA was one of many domains",
    ],
    titleAliases: [
      "talent acquisition director",
      "head of recruiting",
      "vp talent acquisition",
      "global head of recruiting",
    ],
  },

  "BF-14-E": {
    directionId: "BF-14-E",
    functionId: "PEOPLE",
    familyId: "PO-04",
    primarySubfamilyId: "OD_TRANSFORMATION",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Organizational design, culture change, or HR operating model transformation as primary work",
    evidenceRequired: [
      "organizational development",
      "org design",
      "change management",
      "hr transformation",
    ],
    negativeEvidence: [
      "talent acquisition",
      "people analytics",
      "employee relations",
    ],
    falsePositiveRisks: [
      "PO-01 — OD requires methodology evidence, not just having managed change projects",
    ],
    titleAliases: [
      "od director",
      "organizational development director",
      "change management director",
      "hr transformation lead",
    ],
  },

  "BF-15-E": {
    directionId: "BF-15-E",
    functionId: "PEOPLE",
    familyId: "PO-05",
    primarySubfamilyId: "LEARNING_DEVELOPMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise learning programs, leadership development, or capability building as owned function",
    evidenceRequired: [
      "learning and development",
      "l&d",
      "leadership development",
      "training",
    ],
    negativeEvidence: [
      "talent acquisition",
      "workforce forecasting",
      "compliance",
    ],
    falsePositiveRisks: [
      "PO-01 — L&D requires program ownership evidence, not just having run training",
    ],
    titleAliases: [
      "l&d director",
      "head of learning",
      "director of leadership development",
      "chief learning officer",
    ],
  },

  "BF-16-E": {
    directionId: "BF-16-E",
    functionId: "PEOPLE",
    familyId: "PO-06",
    primarySubfamilyId: "TOTAL_REWARDS",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Compensation design, benefits strategy, or total rewards leadership as professional core",
    evidenceRequired: [
      "total rewards",
      "compensation",
      "benefits",
      "pay equity",
    ],
    negativeEvidence: [
      "general hr",
      "talent acquisition",
      "workforce planning",
    ],
    falsePositiveRisks: [
      "PO-01 — prefer for HR generalists who also managed comp; Total Rewards is a specialist function",
    ],
    titleAliases: [
      "total rewards director",
      "compensation director",
      "head of total rewards",
      "vp compensation and benefits",
    ],
  },

  // ── EDUCATION ─────────────────────────────────────────────────────────────────

  "BF-8-IF": {
    directionId: "BF-8-IF",
    functionId: "EDUCATION",
    familyId: "MP-05",
    primarySubfamilyId: "LEARNING_DEVELOPMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent career advisory, outplacement consulting, or workforce transition advisory",
    evidenceRequired: [
      "career coaching",
      "outplacement",
      "career advisory",
      "workforce transition",
    ],
    negativeEvidence: [
      "enterprise hr operations",
      "talent acquisition",
      "general management",
    ],
    falsePositiveRisks: [
      "PO-01 — advisory is independent delivery; prefer PO-01 for enterprise HR leaders",
    ],
    titleAliases: [
      "career coach",
      "outplacement consultant",
      "career strategist",
      "workforce transition advisor",
    ],
  },

  "ED-3-IF": {
    directionId: "ED-3-IF",
    functionId: "EDUCATION",
    familyId: "PO-05",
    primarySubfamilyId: "LEARNING_DEVELOPMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent corporate training delivery, L&D program consulting, or learning facilitation",
    evidenceRequired: [
      "training",
      "learning and development",
      "l&d",
      "facilitation",
    ],
    negativeEvidence: [
      "enterprise employed hr",
      "talent acquisition",
      "workforce planning",
    ],
    falsePositiveRisks: [
      "BF-15-E — independent L&D consulting is advisory delivery; BF-15-E is function ownership",
    ],
    titleAliases: [
      "l&d consultant",
      "learning consultant",
      "corporate trainer",
      "training consultant",
    ],
  },

  "ED-4-IF": {
    directionId: "ED-4-IF",
    functionId: "EDUCATION",
    familyId: "PO-05",
    primarySubfamilyId: "LEARNING_DEVELOPMENT",
    complexityBands: [1, 2],
    primaryEvidenceDomain: "Freelance instructional design, e-learning development, or curriculum design for corporate clients",
    evidenceRequired: [
      "instructional design",
      "e-learning",
      "curriculum",
      "learning design",
    ],
    negativeEvidence: [
      "enterprise management",
      "sales",
      "compliance",
    ],
    falsePositiveRisks: [
      "ED-3-IF — instructional design is craft/production; L&D consulting is strategy and delivery",
    ],
    titleAliases: [
      "instructional designer",
      "e-learning developer",
      "learning experience designer",
      "curriculum designer",
    ],
  },

  "ED-5-IF": {
    directionId: "ED-5-IF",
    functionId: "EDUCATION",
    familyId: "IP-03",
    primarySubfamilyId: "COACHING_PRACTICE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent executive coaching, leadership coaching, or organizational leadership development advisory",
    evidenceRequired: [
      "executive coaching",
      "coaching",
      "leadership development",
      "leadership coaching",
    ],
    negativeEvidence: [
      "enterprise employed hr",
      "talent acquisition",
      "compliance",
    ],
    falsePositiveRisks: [
      "BF-15-E — executive coaching is independent practitioner; BF-15-E is employed function leadership",
    ],
    titleAliases: [
      "executive coach",
      "leadership coach",
      "organizational coach",
      "leadership advisor",
    ],
  },

  // ── TECHNOLOGY ────────────────────────────────────────────────────────────────

  "TE-1-E": {
    directionId: "TE-1-E",
    functionId: "TECHNOLOGY",
    familyId: "PT-02",
    primarySubfamilyId: "SOFTWARE_ENGINEERING_LEADERSHIP",
    complexityBands: [3],
    primaryEvidenceDomain: "Software engineering leadership or technical platform ownership at senior executive level",
    evidenceRequired: [
      "engineering leadership",
      "software engineering",
      "technical leadership",
      "platform",
    ],
    negativeEvidence: [
      "hr",
      "it operations without software",
      "general management only",
    ],
    falsePositiveRisks: [
      "IT-01 — CTO/VP Engineering builds software; CIO/IT Director runs IT operations",
    ],
    titleAliases: [
      "cto",
      "chief technology officer",
      "vp engineering",
      "vp of engineering",
      "head of engineering",
    ],
  },

  "TE-2-E": {
    directionId: "TE-2-E",
    functionId: "TECHNOLOGY",
    familyId: "DX-03",
    primarySubfamilyId: "DIGITAL_TRANSFORMATION_AUTOMATION",
    complexityBands: [3],
    primaryEvidenceDomain: "Executive ownership of AI strategy, adoption roadmap, or enterprise AI deployment",
    evidenceRequired: [
      "ai strategy",
      "ai transformation",
      "ai adoption",
      "generative ai",
    ],
    negativeEvidence: [
      "data analyst",
      "it operations",
      "general management",
    ],
    falsePositiveRisks: [
      "PT-02 — Chief AI Officers own adoption strategy; distinct from VPs of Engineering who also use AI",
    ],
    titleAliases: [
      "chief ai officer",
      "vp ai",
      "head of ai",
      "ai transformation executive",
    ],
  },

  "TE-4-IF": {
    directionId: "TE-4-IF",
    functionId: "TECHNOLOGY",
    familyId: "PT-02",
    primarySubfamilyId: "SOFTWARE_ENGINEERING_LEADERSHIP",
    complexityBands: [3],
    primaryEvidenceDomain: "Independent fractional technical leadership or startup technical advisory",
    evidenceRequired: [
      "fractional cto",
      "technical advisory",
      "software engineering",
      "architecture",
    ],
    negativeEvidence: [
      "full-time enterprise employment",
      "it operations",
    ],
    falsePositiveRisks: [
      "IP-01 — Fractional CTO is technical-domain advisory; generic solo advisory routes to IP-01",
    ],
    titleAliases: [
      "fractional cto",
      "technical advisor",
      "cto in residence",
      "technical co-founder",
    ],
  },

  "CM-2-E": {
    directionId: "CM-2-E",
    functionId: "TECHNOLOGY",
    familyId: "DA-02",
    primarySubfamilyId: "PRODUCT_PLATFORM_TECH",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Quantitative data science, machine learning applications, or advanced analytics as primary technical role",
    evidenceRequired: [
      "data science",
      "analytics",
      "machine learning",
      "statistics",
    ],
    negativeEvidence: [
      "general hr",
      "general management",
      "sales",
    ],
    falsePositiveRisks: [
      "WI-02 — People analytics is domain-specific; route to WI-02 when HR is primary domain",
    ],
    titleAliases: [
      "data scientist",
      "analytics lead",
      "head of data science",
      "director of analytics",
    ],
  },

  "CM-4-ST": {
    directionId: "CM-4-ST",
    functionId: "TECHNOLOGY",
    familyId: "FB-02",
    primarySubfamilyId: "PRODUCT_PLATFORM_TECH",
    complexityBands: [3],
    primaryEvidenceDomain: "AI/ML research or product building in a startup or frontier tech context",
    evidenceRequired: [
      "machine learning",
      "ai",
      "llm",
      "artificial intelligence",
    ],
    negativeEvidence: [
      "enterprise it operations",
      "general management",
      "hr",
    ],
    falsePositiveRisks: [
      "DX-03 — AI/ML startup building is not enterprise AI adoption",
    ],
    titleAliases: [
      "ai engineer",
      "ml engineer",
      "ai researcher",
      "data scientist startup",
      "ai/ml specialist",
    ],
  },

  "CM-5-IF": {
    directionId: "CM-5-IF",
    functionId: "TECHNOLOGY",
    familyId: "DX-03",
    primarySubfamilyId: "DIGITAL_TRANSFORMATION_AUTOMATION",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent consulting on AI adoption, automation strategy, or digital transformation",
    evidenceRequired: [
      "ai transformation",
      "consulting",
      "automation",
      "ai adoption",
    ],
    negativeEvidence: [
      "enterprise employment",
      "software engineering team leadership",
    ],
    falsePositiveRisks: [
      "IP-01 — AI consulting requires explicit technical AI evidence, not just management consulting",
    ],
    titleAliases: [
      "ai consultant",
      "transformation consultant",
      "digital transformation advisor",
      "automation consultant",
    ],
  },

  "CM-6-E": {
    directionId: "CM-6-E",
    functionId: "TECHNOLOGY",
    familyId: "PT-01",
    primarySubfamilyId: "PRODUCT_PLATFORM_TECH",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Product management operations, SaaS platform ownership, or product lifecycle management",
    evidenceRequired: [
      "product operations",
      "product management",
      "saas",
      "platform",
    ],
    negativeEvidence: [
      "general operations",
      "supply chain",
      "hr",
    ],
    falsePositiveRisks: [
      "OD-01 — Product Ops requires explicit product/SaaS evidence; generic operations routes to OD-01",
    ],
    titleAliases: [
      "product operations manager",
      "director of product operations",
      "vp product operations",
    ],
  },

  "CM-7-ST": {
    directionId: "CM-7-ST",
    functionId: "TECHNOLOGY",
    familyId: "FB-02",
    primarySubfamilyId: "PRODUCT_PLATFORM_TECH",
    complexityBands: [3],
    primaryEvidenceDomain: "Building and operating AI-native products or LLM applications in a startup context",
    evidenceRequired: [
      "ai product",
      "llm",
      "generative ai",
      "startup",
    ],
    negativeEvidence: [
      "enterprise it",
      "general product management without ai",
      "hr",
    ],
    falsePositiveRisks: [
      "DX-03 — AI product startup building is not enterprise AI adoption leadership",
    ],
    titleAliases: [
      "ai product manager",
      "head of ai product",
      "llm product lead",
    ],
  },

  "AD-7-IF": {
    directionId: "AD-7-IF",
    functionId: "TECHNOLOGY",
    familyId: "PT-04",
    primarySubfamilyId: "PRODUCT_PLATFORM_TECH",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "User experience design, product design research, or interaction design in a consulting context",
    evidenceRequired: [
      "ux",
      "product design",
      "user research",
      "ui",
    ],
    negativeEvidence: [
      "hr",
      "enterprise sales",
      "general management",
    ],
    falsePositiveRisks: [
      "PT-01 — UX consulting is design craft; product management is ownership and roadmap",
    ],
    titleAliases: [
      "ux director",
      "product design consultant",
      "head of design",
      "ux consultant",
      "design director",
    ],
  },

  // ── IT_ENTERPRISE ─────────────────────────────────────────────────────────────

  "TE-3-E": {
    directionId: "TE-3-E",
    functionId: "IT_ENTERPRISE",
    familyId: "DX-01",
    primarySubfamilyId: "DIGITAL_TRANSFORMATION_AUTOMATION",
    complexityBands: [3],
    primaryEvidenceDomain: "Enterprise digital transformation program leadership or technology strategy at executive level",
    evidenceRequired: [
      "digital transformation",
      "technology strategy",
      "enterprise transformation",
    ],
    negativeEvidence: [
      "hr generalist",
      "sales",
      "general management without technology",
    ],
    falsePositiveRisks: [
      "PT-02 — Digital transformation executive requires transformation program ownership, not product building",
    ],
    titleAliases: [
      "chief digital officer",
      "vp digital transformation",
      "digital transformation director",
      "technology strategy director",
    ],
  },

  "TE-5-E": {
    directionId: "TE-5-E",
    functionId: "IT_ENTERPRISE",
    familyId: "IT-03",
    primarySubfamilyId: "ENTERPRISE_ARCHITECTURE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise architecture, systems design, or platform modernization program ownership",
    evidenceRequired: [
      "enterprise architecture",
      "platform",
      "architecture",
      "modernization",
    ],
    negativeEvidence: [
      "hr",
      "general management",
      "sales",
    ],
    falsePositiveRisks: [
      "PT-02 — Enterprise architects govern systems design; they don't build software teams",
    ],
    titleAliases: [
      "enterprise architect",
      "chief architect",
      "head of enterprise architecture",
      "platform modernization director",
    ],
  },

  "TE-7-E": {
    directionId: "TE-7-E",
    functionId: "IT_ENTERPRISE",
    familyId: "IT-03",
    primarySubfamilyId: "CLOUD_INFRA_DEVOPS",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Cloud operations, infrastructure engineering, or DevOps/SRE leadership as primary function",
    evidenceRequired: [
      "cloud",
      "infrastructure",
      "devops",
      "sre",
    ],
    negativeEvidence: [
      "hr",
      "sales",
      "general management",
    ],
    falsePositiveRisks: [
      "IT-04 — Cloud/infra is platform operations; business systems is application ownership",
    ],
    titleAliases: [
      "vp infrastructure",
      "head of cloud",
      "devops director",
      "cloud engineering director",
      "head of sre",
    ],
  },

  "TE-8-E": {
    directionId: "TE-8-E",
    functionId: "IT_ENTERPRISE",
    familyId: "IT-04",
    primarySubfamilyId: "BUSINESS_SYSTEMS_ENTERPRISE_APPS",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "ERP, CRM, HRIS, or enterprise application ownership and implementation leadership",
    evidenceRequired: [
      "erp",
      "enterprise systems",
      "business applications",
      "hris",
    ],
    negativeEvidence: [
      "software engineering",
      "devops",
      "cloud operations",
    ],
    falsePositiveRisks: [
      "IT-03 — Business systems ownership is application delivery; IT-03 is infrastructure operations",
    ],
    titleAliases: [
      "vp enterprise systems",
      "director of business applications",
      "erp director",
      "hris director",
    ],
  },

  "TE-9-E": {
    directionId: "TE-9-E",
    functionId: "IT_ENTERPRISE",
    familyId: "DX-02",
    primarySubfamilyId: "DIGITAL_TRANSFORMATION_AUTOMATION",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise workflow automation, RPA, or business process digitization program ownership",
    evidenceRequired: [
      "process automation",
      "workflow automation",
      "rpa",
      "automation",
    ],
    negativeEvidence: [
      "hr",
      "general management",
      "sales",
    ],
    falsePositiveRisks: [
      "DX-01 — Automation leadership is execution-focused; digital transformation executive is strategy-focused",
    ],
    titleAliases: [
      "automation director",
      "head of business process automation",
      "rpa director",
      "digital process lead",
    ],
  },

  "TE-10-E": {
    directionId: "TE-10-E",
    functionId: "IT_ENTERPRISE",
    familyId: "DX-03",
    primarySubfamilyId: "DIGITAL_TRANSFORMATION_AUTOMATION",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise AI adoption program leadership, GenAI deployment, or AI change management",
    evidenceRequired: [
      "ai adoption",
      "ai enablement",
      "genai",
      "ai implementation",
    ],
    negativeEvidence: [
      "ai research",
      "machine learning engineering",
      "general management",
    ],
    falsePositiveRisks: [
      "TE-2-E — AI enablement program leaders are not Chief AI Officers; distinguish by C-suite scope",
    ],
    titleAliases: [
      "ai enablement lead",
      "head of ai adoption",
      "enterprise ai program director",
      "genai enablement manager",
    ],
  },

  // ── RISK_SECURITY ─────────────────────────────────────────────────────────────

  "TE-6-E": {
    directionId: "TE-6-E",
    functionId: "RISK_SECURITY",
    familyId: "IT-02",
    primarySubfamilyId: "INFORMATION_SECURITY_LEADERSHIP",
    complexityBands: [3],
    primaryEvidenceDomain: "CISO-level security leadership, cyber risk management, or security program ownership",
    evidenceRequired: [
      "cybersecurity",
      "information security",
      "security governance",
      "ciso",
    ],
    negativeEvidence: [
      "general it management",
      "business systems",
      "hr",
    ],
    falsePositiveRisks: [
      "RC-01 — Security leadership requires security engineering evidence; GRC directors without technical security should route to RC-01",
    ],
    titleAliases: [
      "ciso",
      "chief information security officer",
      "vp cybersecurity",
      "vp information security",
      "director of security",
    ],
  },

  "BF-9-E": {
    directionId: "BF-9-E",
    functionId: "RISK_SECURITY",
    familyId: "RC-01",
    primarySubfamilyId: "REGULATORY_COMPLIANCE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Compliance operations, regulatory controls, or internal audit leadership as professional core",
    evidenceRequired: [
      "compliance",
      "regulatory",
      "audit",
      "controls",
    ],
    negativeEvidence: [
      "software engineering",
      "hr",
      "sales",
    ],
    falsePositiveRisks: [
      "IT-02 — Compliance operations does not require cybersecurity technical evidence",
    ],
    titleAliases: [
      "chief compliance officer",
      "compliance director",
      "regulatory director",
      "vp compliance",
      "head of compliance",
    ],
  },

  "BF-17-E": {
    directionId: "BF-17-E",
    functionId: "RISK_SECURITY",
    familyId: "RC-02",
    primarySubfamilyId: "ENTERPRISE_RISK",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise-wide risk framework ownership, board risk advisory, or operational risk leadership",
    evidenceRequired: [
      "enterprise risk",
      "risk management",
      "risk governance",
      "operational risk",
    ],
    negativeEvidence: [
      "hr",
      "sales",
      "digital transformation",
    ],
    falsePositiveRisks: [
      "RC-01 — ERM is cross-enterprise risk governance; compliance operations is a subset",
    ],
    titleAliases: [
      "chief risk officer",
      "cro",
      "vp enterprise risk",
      "head of risk management",
      "enterprise risk director",
    ],
  },

  "BF-18-E": {
    directionId: "BF-18-E",
    functionId: "RISK_SECURITY",
    familyId: "RC-03",
    primarySubfamilyId: "PRIVACY_DATA_AI_GOVERNANCE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Data privacy, AI governance, or responsible AI program ownership as primary function",
    evidenceRequired: [
      "data governance",
      "privacy",
      "ai governance",
      "responsible ai",
    ],
    negativeEvidence: [
      "general compliance without data focus",
      "hr",
    ],
    falsePositiveRisks: [
      "RC-01 — prefer RC-01 for traditional compliance leaders without data/AI evidence",
    ],
    titleAliases: [
      "chief privacy officer",
      "data protection officer",
      "dpo",
      "head of ai governance",
      "vp data governance",
    ],
  },

  // ── FINANCE ───────────────────────────────────────────────────────────────────

  "BF-1-E": {
    directionId: "BF-1-E",
    functionId: "FINANCE",
    familyId: "FC-01",
    primarySubfamilyId: "CORPORATE_FINANCE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Corporate finance, financial analysis, FP&A, or investment advisory in an enterprise setting",
    evidenceRequired: [
      "finance",
      "financial analysis",
      "investment",
      "corporate finance",
    ],
    negativeEvidence: [
      "hr",
      "sales",
      "general management without finance",
    ],
    falsePositiveRisks: [
      "FC-02 — Corporate finance is employed advisory; wealth management requires independent practice evidence",
    ],
    titleAliases: [
      "vp finance",
      "director of finance",
      "financial strategist",
      "head of corporate finance",
    ],
  },

  "BF-1-IF": {
    directionId: "BF-1-IF",
    functionId: "FINANCE",
    familyId: "FC-02",
    primarySubfamilyId: "FINANCIAL_ADVISORY",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Fractional or independent financial advisory to businesses or high-net-worth individuals",
    evidenceRequired: [
      "financial advisory",
      "fractional cfo",
      "financial planning",
      "independent finance",
    ],
    negativeEvidence: [
      "enterprise employed finance",
      "compliance",
    ],
    falsePositiveRisks: [
      "FC-01 — Independent financial advisory requires market/client evidence; employed FP&A maps to FC-01",
    ],
    titleAliases: [
      "fractional cfo",
      "financial advisor",
      "financial consultant",
      "independent cfo",
    ],
  },

  "BF-11-OV": {
    directionId: "BF-11-OV",
    functionId: "FINANCE",
    familyId: "FC-02",
    primarySubfamilyId: "WEALTH_MANAGEMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent wealth management practice requiring regulated financial advisory credentials",
    evidenceRequired: [
      "financial planning",
      "wealth management",
      "investment advisory",
      "financial services",
    ],
    negativeEvidence: [
      "corporate finance employed",
      "general management",
    ],
    falsePositiveRisks: [
      "FC-01 — Wealth management practice requires FINRA/RIA credentials and client-facing evidence",
    ],
    titleAliases: [
      "financial planner",
      "wealth manager",
      "cfp",
      "registered investment advisor",
    ],
  },

  // ── COMMERCIAL ────────────────────────────────────────────────────────────────

  "SR-1-E": {
    directionId: "SR-1-E",
    functionId: "COMMERCIAL",
    familyId: "CS-01",
    primarySubfamilyId: "ENTERPRISE_SALES",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise B2B sales, deal management, or revenue generation in complex sales cycles",
    evidenceRequired: [
      "enterprise sales",
      "account executive",
      "sales",
      "revenue",
    ],
    negativeEvidence: [
      "hr",
      "digital transformation",
      "product management",
    ],
    falsePositiveRisks: [
      "CS-02 — Enterprise sales is new business hunting; CS-02 is retention and expansion",
    ],
    titleAliases: [
      "enterprise account executive",
      "sales director",
      "vp sales",
      "regional sales director",
    ],
  },

  "SR-2-E": {
    directionId: "SR-2-E",
    functionId: "COMMERCIAL",
    familyId: "CS-02",
    primarySubfamilyId: "ACCOUNT_MANAGEMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Customer success, account retention, or relationship-led revenue expansion",
    evidenceRequired: [
      "customer success",
      "account management",
      "client retention",
      "expansion revenue",
    ],
    negativeEvidence: [
      "new logo sales",
      "marketing",
      "hr",
    ],
    falsePositiveRisks: [
      "CS-01 — CS/AM is retention-focused; enterprise sales is new-business focused",
    ],
    titleAliases: [
      "customer success manager",
      "vp customer success",
      "account manager",
      "head of customer success",
    ],
  },

  "SR-3-E": {
    directionId: "SR-3-E",
    functionId: "COMMERCIAL",
    familyId: "CS-03",
    primarySubfamilyId: "SELLER_ENABLEMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Sales team enablement, partner channel management, or seller capability development",
    evidenceRequired: [
      "sales enablement",
      "partner success",
      "seller enablement",
      "revenue enablement",
    ],
    negativeEvidence: [
      "direct quota-carrying sales",
      "hr",
      "l&d without sales context",
    ],
    falsePositiveRisks: [
      "CS-01 — Enablement is not quota-carrying sales; distinguish by absence of personal quota evidence",
    ],
    titleAliases: [
      "sales enablement director",
      "partner success director",
      "revenue enablement lead",
      "head of seller enablement",
    ],
  },

  // ── MARKETING ─────────────────────────────────────────────────────────────────

  "AD-5-IF": {
    directionId: "AD-5-IF",
    functionId: "MARKETING",
    familyId: "MG-01",
    primarySubfamilyId: "MARKETING_LEADERSHIP",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Fractional CMO, independent brand strategy, or marketing advisory for growth-stage companies",
    evidenceRequired: [
      "marketing",
      "brand",
      "fractional cmo",
      "marketing advisor",
    ],
    negativeEvidence: [
      "enterprise employed marketing",
      "hr",
    ],
    falsePositiveRisks: [
      "IP-01 — Fractional CMO requires marketing domain evidence; generic advisory routes to IP-01",
    ],
    titleAliases: [
      "fractional cmo",
      "brand strategist",
      "marketing advisor",
      "independent cmo",
    ],
  },

  "AD-6-IF": {
    directionId: "AD-6-IF",
    functionId: "MARKETING",
    familyId: "MG-04",
    primarySubfamilyId: "CONTENT_STRATEGY",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Content strategy, knowledge management, or editorial strategy in a fractional/independent context",
    evidenceRequired: [
      "content strategy",
      "knowledge management",
      "technical writing",
      "editorial",
    ],
    negativeEvidence: [
      "hr",
      "enterprise sales",
      "software engineering",
    ],
    falsePositiveRisks: [
      "MG-01 — Content strategy is editorial; marketing leadership is brand/growth strategy",
    ],
    titleAliases: [
      "content strategist",
      "head of content",
      "knowledge manager",
      "editorial director",
    ],
  },

  "AD-8-E": {
    directionId: "AD-8-E",
    functionId: "MARKETING",
    familyId: "MG-01",
    primarySubfamilyId: "MARKETING_LEADERSHIP",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Marketing leadership, brand strategy, or revenue marketing at enterprise or scale-up level",
    evidenceRequired: [
      "marketing",
      "brand strategy",
      "growth marketing",
      "go-to-market",
    ],
    negativeEvidence: [
      "hr",
      "software engineering",
      "compliance",
    ],
    falsePositiveRisks: [
      "MG-03 — Marketing leadership is strategy/brand; performance marketing is analytical/channel-specific",
    ],
    titleAliases: [
      "cmo",
      "chief marketing officer",
      "vp marketing",
      "head of marketing",
      "marketing director",
    ],
  },

  "AD-9-E": {
    directionId: "AD-9-E",
    functionId: "MARKETING",
    familyId: "MG-03",
    primarySubfamilyId: "PERFORMANCE_MARKETING",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Performance marketing, demand generation, or paid digital channel ownership",
    evidenceRequired: [
      "performance marketing",
      "demand generation",
      "paid acquisition",
      "growth marketing",
    ],
    negativeEvidence: [
      "brand strategy",
      "hr",
      "general management",
    ],
    falsePositiveRisks: [
      "MG-01 — Performance marketing is channel execution; marketing leadership includes brand and strategy",
    ],
    titleAliases: [
      "performance marketing director",
      "head of demand generation",
      "growth marketing manager",
    ],
  },

  "AD-10-E": {
    directionId: "AD-10-E",
    functionId: "MARKETING",
    familyId: "MG-06",
    primarySubfamilyId: "PRODUCT_MARKETING",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Product marketing, GTM strategy, positioning, or launch execution",
    evidenceRequired: [
      "product marketing",
      "go-to-market",
      "gtm",
      "positioning",
    ],
    negativeEvidence: [
      "general marketing without product focus",
      "hr",
      "software engineering",
    ],
    falsePositiveRisks: [
      "MG-01 — Product marketing is product-aligned; general marketing leadership is brand-aligned",
    ],
    titleAliases: [
      "head of product marketing",
      "vp product marketing",
      "gtm director",
      "product marketing director",
    ],
  },

  "BF-10-IF": {
    directionId: "BF-10-IF",
    functionId: "MARKETING",
    familyId: "MG-02",
    primarySubfamilyId: "COMMUNICATIONS_PR",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Corporate communications, public relations, or PR advisory in fractional/independent capacity",
    evidenceRequired: [
      "communications",
      "public relations",
      "pr",
      "corporate communications",
    ],
    negativeEvidence: [
      "hr",
      "sales",
      "digital transformation",
    ],
    falsePositiveRisks: [
      "MG-01 — Corporate communications is PR/reputation; marketing leadership is brand/revenue",
    ],
    titleAliases: [
      "communications director",
      "pr director",
      "head of communications",
      "vp communications",
    ],
  },

  // ── OPERATIONS ────────────────────────────────────────────────────────────────

  "MG-1-E": {
    directionId: "MG-1-E",
    functionId: "OPERATIONS",
    familyId: "OD-01",
    primarySubfamilyId: "GENERAL_MANAGEMENT",
    complexityBands: [3],
    primaryEvidenceDomain: "P&L ownership, general management, or multi-function leadership in an enterprise",
    evidenceRequired: [
      "general management",
      "p&l",
      "operations leadership",
      "executive leadership",
    ],
    negativeEvidence: [
      "specialist function without P&L",
      "hr only",
      "marketing only",
    ],
    falsePositiveRisks: [
      "MG-6-E — General management includes P&L ownership; Chief of Staff/BizOps is coordination without direct P&L",
    ],
    titleAliases: [
      "general manager",
      "managing director",
      "vp general management",
      "country manager",
      "regional vp",
    ],
  },

  "MG-6-E": {
    directionId: "MG-6-E",
    functionId: "OPERATIONS",
    familyId: "OD-01",
    primarySubfamilyId: "BUSINESS_OPERATIONS",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Business operations strategy, chief of staff advisory, or operational execution in senior enterprise role",
    evidenceRequired: [
      "business operations",
      "chief of staff",
      "strategy",
      "operations",
    ],
    negativeEvidence: [
      "specialist function only",
      "technical software engineering",
      "hr",
    ],
    falsePositiveRisks: [
      "MG-1-E — Chief of Staff is coordination/advisory; General Manager owns P&L directly",
    ],
    titleAliases: [
      "chief of staff",
      "vp business operations",
      "head of operations",
      "director of business operations",
    ],
  },

  "MG-7-IF": {
    directionId: "MG-7-IF",
    functionId: "OPERATIONS",
    familyId: "SA-02",
    primarySubfamilyId: "MANAGEMENT_CONSULTING",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent management consulting, strategy advisory, or organizational advisory",
    evidenceRequired: [
      "consulting",
      "management consulting",
      "strategy advisory",
      "advisory",
    ],
    negativeEvidence: [
      "enterprise employed management",
      "sales quota carrying",
    ],
    falsePositiveRisks: [
      "IP-01 — Management consulting is domain-led advisory; generic solo practice is IP-01",
    ],
    titleAliases: [
      "management consultant",
      "strategy consultant",
      "independent consultant",
      "fractional strategist",
    ],
  },

  "MG-8-E": {
    directionId: "MG-8-E",
    functionId: "OPERATIONS",
    familyId: "OD-02",
    primarySubfamilyId: "PROGRAM_MANAGEMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Enterprise program or project delivery, portfolio management, or transformation execution",
    evidenceRequired: [
      "program management",
      "project management",
      "delivery",
      "pmo",
    ],
    negativeEvidence: [
      "product management",
      "hr",
      "sales",
    ],
    falsePositiveRisks: [
      "OD-01 — Program management is delivery execution; business operations is strategy and coordination",
    ],
    titleAliases: [
      "program director",
      "vp program management",
      "director of pmo",
      "head of delivery",
    ],
  },

  "MG-9-E": {
    directionId: "MG-9-E",
    functionId: "OPERATIONS",
    familyId: "OD-01",
    primarySubfamilyId: "MARKETPLACE_OPERATIONS",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Marketplace, platform, or two-sided market operations leadership in a corporate setting",
    evidenceRequired: [
      "marketplace",
      "platform operations",
      "two-sided market",
      "e-commerce",
    ],
    negativeEvidence: [
      "hr",
      "financial advisory",
      "software engineering team",
    ],
    falsePositiveRisks: [
      "FB-03 — Platform operations leadership is employed management; marketplace venture building is founder territory",
    ],
    titleAliases: [
      "marketplace operations director",
      "vp platform",
      "head of marketplace",
    ],
  },

  "MG-9-IF": {
    directionId: "MG-9-IF",
    functionId: "OPERATIONS",
    familyId: "SA-04",
    primarySubfamilyId: "MARKETPLACE_OPERATIONS",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Fractional marketplace or platform operations advisory for growth-stage companies",
    evidenceRequired: [
      "marketplace",
      "platform",
      "fractional",
      "operations advisory",
    ],
    negativeEvidence: [
      "full-time enterprise employment",
      "software engineering",
    ],
    falsePositiveRisks: [
      "MG-9-E — Fractional requires independent delivery evidence; employed platform ops routes to MG-9-E",
    ],
    titleAliases: [
      "fractional coo",
      "marketplace advisor",
      "platform operations advisor",
    ],
  },

  "AE-4-IF": {
    directionId: "AE-4-IF",
    functionId: "OPERATIONS",
    familyId: "PT-03",
    primarySubfamilyId: "ENGINEERING_CRAFT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent civil, mechanical, or structural engineering consulting requiring PE licensure or equivalent",
    evidenceRequired: [
      "engineering",
      "civil engineering",
      "mechanical engineering",
      "consulting",
    ],
    negativeEvidence: [
      "hr",
      "sales",
      "general management",
    ],
    falsePositiveRisks: [
      "MG-7-IF — Engineering consulting is technical craft; management consulting is strategy/advisory without engineering domain",
    ],
    titleAliases: [
      "pe engineer",
      "licensed engineer",
      "consulting engineer",
      "structural engineer",
    ],
  },

  "AE-5-E": {
    directionId: "AE-5-E",
    functionId: "OPERATIONS",
    familyId: "OD-02",
    primarySubfamilyId: "TECHNICAL_PROGRAM_MANAGEMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Technical program management, systems engineering, or engineering delivery program leadership",
    evidenceRequired: [
      "technical program management",
      "systems engineering",
      "engineering program",
      "technical delivery",
    ],
    negativeEvidence: [
      "general project management",
      "hr",
      "sales",
    ],
    falsePositiveRisks: [
      "PT-02 — TPM is delivery coordination; VP Engineering is team-building and technical leadership",
    ],
    titleAliases: [
      "technical program manager",
      "director of tpm",
      "systems engineer",
      "engineering program director",
    ],
  },

  "CM-8-IF": {
    directionId: "CM-8-IF",
    functionId: "OPERATIONS",
    familyId: "SA-04",
    primarySubfamilyId: "OPERATIONS_CONSULTING",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent consulting on operational efficiency, supply chain, or process improvement",
    evidenceRequired: [
      "operations consulting",
      "supply chain",
      "process improvement",
      "logistics",
    ],
    negativeEvidence: [
      "hr",
      "product management",
      "software engineering",
    ],
    falsePositiveRisks: [
      "OD-01 — Operations consulting is advisory; operational leadership is OD-01 employed",
    ],
    titleAliases: [
      "operations consultant",
      "supply chain consultant",
      "lean consultant",
      "operations advisor",
    ],
  },

  // ── MISSION_PUBLIC ────────────────────────────────────────────────────────────

  "MG-5-NP": {
    directionId: "MG-5-NP",
    functionId: "MISSION_PUBLIC",
    familyId: "MP-01",
    primarySubfamilyId: "NONPROFIT_LEADERSHIP",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Nonprofit program management, community service leadership, or mission organization operations",
    evidenceRequired: [
      "nonprofit",
      "program management",
      "community",
      "social impact",
    ],
    negativeEvidence: [
      "for-profit commercial",
      "financial advisory",
      "hr specialist",
    ],
    falsePositiveRisks: [
      "MG-10-NP — Program management is delivery; fundraising/development is a separate nonprofit function",
    ],
    titleAliases: [
      "program director nonprofit",
      "executive director",
      "director of programs",
      "nonprofit director",
    ],
  },

  "MG-10-NP": {
    directionId: "MG-10-NP",
    functionId: "MISSION_PUBLIC",
    familyId: "MP-01",
    primarySubfamilyId: "NONPROFIT_DEVELOPMENT",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Nonprofit fundraising, donor relations, or development program leadership",
    evidenceRequired: [
      "fundraising",
      "development",
      "donor relations",
      "grants",
    ],
    negativeEvidence: [
      "for-profit sales",
      "hr",
      "digital transformation",
    ],
    falsePositiveRisks: [
      "MG-5-NP — Development is revenue-generating within nonprofits; program management is delivery",
    ],
    titleAliases: [
      "development director",
      "head of fundraising",
      "vp development",
      "chief development officer",
    ],
  },

  "MG-12-OV": {
    directionId: "MG-12-OV",
    functionId: "MISSION_PUBLIC",
    familyId: "MP-04",
    primarySubfamilyId: "SOCIAL_ENTERPRISE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Social enterprise founding, impact venture building, or mission-driven business creation",
    evidenceRequired: [
      "social enterprise",
      "social impact",
      "impact venture",
      "mission organization",
    ],
    negativeEvidence: [
      "for-profit tech startup",
      "financial advisory",
      "hr",
    ],
    falsePositiveRisks: [
      "FB-01 — Social enterprise has a mission layer; pure bootstrapped business building is FB-01",
    ],
    titleAliases: [
      "social enterprise founder",
      "impact entrepreneur",
      "impact venture founder",
    ],
  },

  "MG-13-E": {
    directionId: "MG-13-E",
    functionId: "MISSION_PUBLIC",
    familyId: "MP-03",
    primarySubfamilyId: "PUBLIC_SECTOR",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Public sector program management, government operations, or policy implementation leadership",
    evidenceRequired: [
      "government",
      "public sector",
      "policy",
      "public administration",
    ],
    negativeEvidence: [
      "private sector commercial",
      "financial advisory",
      "hr specialist",
    ],
    falsePositiveRisks: [
      "OD-01 — Government management is public-sector specific; business operations is private-sector",
    ],
    titleAliases: [
      "government director",
      "public sector manager",
      "senior policy officer",
      "government program director",
    ],
  },

  // ── ENTREPRENEURSHIP ──────────────────────────────────────────────────────────

  "MG-4-ST": {
    directionId: "MG-4-ST",
    functionId: "ENTREPRENEURSHIP",
    familyId: "FB-01",
    primarySubfamilyId: "STARTUP_FOUNDER",
    complexityBands: [3],
    primaryEvidenceDomain: "Startup founding, early-stage company building, or founding-team operator roles",
    evidenceRequired: [
      "startup",
      "founder",
      "early stage",
      "entrepreneurship",
    ],
    negativeEvidence: [
      "enterprise corporate employment",
      "general management only",
      "compliance",
    ],
    falsePositiveRisks: [
      "FB-02 — Startup leadership is general founding; product/software venture building requires product-specific evidence",
    ],
    titleAliases: [
      "founder",
      "co-founder",
      "startup ceo",
      "ceo at startup",
      "early operator",
    ],
  },

  "MG-11-OV": {
    directionId: "MG-11-OV",
    functionId: "ENTREPRENEURSHIP",
    familyId: "FB-01",
    primarySubfamilyId: "SERVICE_BUSINESS_OWNER",
    complexityBands: [1, 2],
    primaryEvidenceDomain: "Owner-operator of a local or service business, not technology or mission-led",
    evidenceRequired: [
      "small business",
      "service business",
      "local business",
      "self-employed",
    ],
    negativeEvidence: [
      "enterprise corporate",
      "nonprofit mission",
      "technology startup",
    ],
    falsePositiveRisks: [
      "MG-12-OV — Local service businesses are commercial; social enterprise has mission-driven evidence",
    ],
    titleAliases: [
      "business owner",
      "owner operator",
      "small business owner",
      "franchise owner",
    ],
  },

  "BF-7-IF": {
    directionId: "BF-7-IF",
    functionId: "ENTREPRENEURSHIP",
    familyId: "IP-01",
    primarySubfamilyId: "ADVISORY_PRACTICE",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Independent advisory to small businesses or entrepreneurs, not direct ownership",
    evidenceRequired: [
      "small business advisory",
      "consulting",
      "business advisor",
      "sme advisory",
    ],
    negativeEvidence: [
      "direct enterprise employment",
      "technical software engineering",
    ],
    falsePositiveRisks: [
      "MG-11-OV — Small business advisory is client-facing consulting; own venture service business is direct ownership",
    ],
    titleAliases: [
      "business advisor",
      "small business consultant",
      "sme advisor",
      "entrepreneur advisor",
    ],
  },

  // ── HEALTHCARE ────────────────────────────────────────────────────────────────

  "HC-2-OV": {
    directionId: "HC-2-OV",
    functionId: "HEALTHCARE",
    familyId: "SL-03",
    primarySubfamilyId: "CLINICAL_PRACTICE",
    complexityBands: [1, 2],
    primaryEvidenceDomain: "Licensed mental health practice, therapy, or behavioral health in an independent practice setting",
    evidenceRequired: [
      "therapy",
      "mental health",
      "counseling",
      "clinical",
    ],
    negativeEvidence: [
      "management without clinical",
      "enterprise hr",
      "sales",
    ],
    falsePositiveRisks: [
      "ED-5-IF — Therapy requires clinical licensure; executive coaching is not therapy",
    ],
    titleAliases: [
      "therapist",
      "psychotherapist",
      "lpc",
      "lcsw",
      "mft",
      "mental health counselor",
    ],
  },

  "HC-3-E": {
    directionId: "HC-3-E",
    functionId: "HEALTHCARE",
    familyId: "OD-07",
    primarySubfamilyId: "HEALTHCARE_ADMINISTRATION",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Healthcare administration, hospital operations, or health system management leadership",
    evidenceRequired: [
      "healthcare",
      "hospital",
      "health system",
      "clinical operations",
    ],
    negativeEvidence: [
      "general management without healthcare",
      "financial advisory",
      "hr specialist",
    ],
    falsePositiveRisks: [
      "OD-01 — Healthcare administration has sector-specific regulatory requirements not present in generic operations",
    ],
    titleAliases: [
      "hospital administrator",
      "director of operations healthcare",
      "vp healthcare operations",
      "coo healthcare",
    ],
  },

  // ── LEGAL ─────────────────────────────────────────────────────────────────────

  "LG-2-IF": {
    directionId: "LG-2-IF",
    functionId: "LEGAL",
    familyId: "SL-04",
    primarySubfamilyId: "LEGAL_ADVISORY",
    complexityBands: [2, 3],
    primaryEvidenceDomain: "Fractional general counsel, independent legal advisory, or in-house legal leadership requiring active bar admission",
    evidenceRequired: [
      "legal",
      "general counsel",
      "corporate law",
      "attorney",
    ],
    negativeEvidence: [
      "compliance without legal qualification",
      "hr",
      "sales",
    ],
    falsePositiveRisks: [
      "RC-01 — Fractional GC requires bar admission; compliance directors without legal credentials should route to RC-01",
    ],
    titleAliases: [
      "general counsel",
      "fractional gc",
      "attorney",
      "counsel",
      "chief legal officer",
    ],
  },

  "LG-3-IF": {
    directionId: "LG-3-IF",
    functionId: "LEGAL",
    familyId: "SL-04",
    primarySubfamilyId: "MEDIATION_CONFLICT",
    complexityBands: [1, 2],
    primaryEvidenceDomain: "Independent mediation, arbitration, or conflict resolution practice, often legally adjacent",
    evidenceRequired: [
      "mediation",
      "conflict resolution",
      "arbitration",
      "negotiation",
    ],
    negativeEvidence: [
      "corporate employment",
      "sales",
      "hr management",
    ],
    falsePositiveRisks: [
      "LG-2-IF — Mediation is not full legal practice; may not require bar admission in all jurisdictions",
    ],
    titleAliases: [
      "mediator",
      "arbitrator",
      "conflict resolution specialist",
      "cmc certified mediator",
    ],
  },

  // ── TRADES ────────────────────────────────────────────────────────────────────

  "IR-1-OV": {
    directionId: "IR-1-OV",
    functionId: "TRADES",
    familyId: "SL-01",
    primarySubfamilyId: "SKILLED_TRADES",
    complexityBands: [1, 2],
    primaryEvidenceDomain: "HVAC, mechanical, or technical trades business ownership requiring state trade licensing",
    evidenceRequired: [
      "hvac",
      "trades",
      "mechanical",
      "installation",
    ],
    negativeEvidence: [
      "general management",
      "software engineering",
      "hr",
    ],
    falsePositiveRisks: [
      "MG-11-OV — Skilled trades is licensed technical work; service business is non-licensed general business",
    ],
    titleAliases: [
      "hvac technician",
      "hvac contractor",
      "trades contractor",
      "licensed tradesperson",
    ],
  },
};

// ── Lookup helper ──────────────────────────────────────────────────────────────

export function getRoleV2Metadata(directionId) {
  return ROLE_LIBRARY_V2_METADATA[directionId] || null;
}

// ── Validation helper ──────────────────────────────────────────────────────────

const REQUIRED_FIELDS = [
  "directionId",
  "functionId",
  "familyId",
  "primarySubfamilyId",
  "complexityBands",
  "primaryEvidenceDomain",
  "evidenceRequired",
  "negativeEvidence",
  "falsePositiveRisks",
  "titleAliases",
];

export function validateRoleLibraryV2Metadata(roleLibrary) {
  const metadataIds = new Set(Object.keys(ROLE_LIBRARY_V2_METADATA));
  const libraryIds = new Set(
    (roleLibrary || [])
      .map((r) => r.directionId)
      .filter(Boolean)
  );

  const missingIds = [...libraryIds].filter((id) => !metadataIds.has(id));
  const extraIds = [...metadataIds].filter((id) => !libraryIds.has(id));

  const fieldErrors = [];
  for (const [id, record] of Object.entries(ROLE_LIBRARY_V2_METADATA)) {
    for (const field of REQUIRED_FIELDS) {
      const value = record[field];
      if (value === undefined || value === null) {
        fieldErrors.push({ directionId: id, field, issue: "missing" });
        continue;
      }
      if (
        (field === "complexityBands" ||
          field === "evidenceRequired" ||
          field === "negativeEvidence" ||
          field === "falsePositiveRisks" ||
          field === "titleAliases") &&
        (!Array.isArray(value) || value.length === 0)
      ) {
        fieldErrors.push({ directionId: id, field, issue: "empty array" });
      }
    }

    if (
      Array.isArray(record.evidenceRequired) &&
      record.evidenceRequired.length > 5
    ) {
      fieldErrors.push({
        directionId: id,
        field: "evidenceRequired",
        issue: "exceeds max of 5 signals",
      });
    }

    if (
      Array.isArray(record.negativeEvidence) &&
      record.negativeEvidence.length > 3
    ) {
      fieldErrors.push({
        directionId: id,
        field: "negativeEvidence",
        issue: "exceeds max of 3 signals",
      });
    }
  }

  return {
    valid: missingIds.length === 0 && extraIds.length === 0 && fieldErrors.length === 0,
    metadataCount: metadataIds.size,
    libraryCount: libraryIds.size,
    missingIds,
    extraIds,
    fieldErrors,
  };
}

export { ROLE_LIBRARY_V2_METADATA };
