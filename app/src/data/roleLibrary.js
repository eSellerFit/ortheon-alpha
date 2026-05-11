// src/data/roleLibrary.js
// Ortheon Role Library v1.0
// Direction definitions linked to O*NET occupation codes
// Salary data is NOT here - see salaryBenchmarks.js
// O*NET database: https://www.onetonline.org

export const roleLibrary = [

  // ============================================================
  // BUSINESS & FINANCE
  // ============================================================

  {
    directionId: "BF-1-E",
    version: "v1.0",
    onetCodes: ["13-2051.00", "13-2054.00"],
    onetTitles: ["Financial and Investment Analysts", "Financial Risk Specialists"],
    category: "Business & Finance",
    metaDirection: "Financial Strategy & Advisory",
    context: "Enterprise",
    contextCode: "E",
    directionLabel: "Financial Strategy & Advisory — Enterprise",
    aiDurabilityRating: "D1",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [8, 4, 9],
    preferredCompetencies: [5, 1, 7],
    dominantAnchors: [
      { anchorId: "technical", idealMin: 7, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "security", idealMin: 5, idealMax: 10 },
      { anchorId: "challenge", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "low",
    transitionPathway: "direct",
    d4EvolutionPath: "AI-augmented financial strategist using AI for all analysis while focusing on judgment and client relationships"
  },

  {
    directionId: "BF-1-IF",
    version: "v1.0",
    onetCodes: ["13-2051.00", "13-2052.00"],
    onetTitles: ["Financial and Investment Analysts", "Personal Financial Advisors"],
    category: "Business & Finance",
    metaDirection: "Financial Strategy & Advisory",
    context: "Independent / Fractional",
    contextCode: "IF",
    directionLabel: "Financial Strategy & Advisory — Independent/Fractional",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [8, 4, 14, 15],
    preferredCompetencies: [5, 1, 20],
    dominantAnchors: [
      { anchorId: "autonomy", idealMin: 7, idealMax: 10 },
      { anchorId: "technical", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "challenge", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "bridge",
    d4EvolutionPath: "AI-powered fractional CFO serving more clients at higher value using AI leverage"
  },

  {
    directionId: "BF-4-E",
    version: "v1.0",
    onetCodes: ["13-1071.00", "11-3121.00"],
    onetTitles: ["Human Resources Specialists", "Human Resources Managers"],
    category: "Business & Finance",
    metaDirection: "People, HR & Organization",
    context: "Enterprise",
    contextCode: "E",
    directionLabel: "HR & People Operations — Enterprise",
    aiDurabilityRating: "D2",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [10, 11, 1],
    preferredCompetencies: [12, 6, 5],
    dominantAnchors: [
      { anchorId: "impact", idealMin: 6, idealMax: 10 },
      { anchorId: "management", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "security", idealMin: 6, idealMax: 10 },
      { anchorId: "workModel", idealMin: 4, idealMax: 10 }
    ],
    stretchabilityRequired: "low",
    transitionPathway: "direct",
    d4EvolutionPath: "AI-enabled people strategist using AI for admin and analytics while focusing on culture, leadership development, and organizational design"
  },

  // ============================================================
  // MANAGEMENT
  // ============================================================

  {
    directionId: "MG-1-E",
    version: "v1.0",
    onetCodes: ["11-1021.00"],
    onetTitles: ["General and Operations Managers"],
    category: "Management",
    metaDirection: "General Management & P&L Ownership",
    context: "Enterprise",
    contextCode: "E",
    directionLabel: "General Management — Enterprise",
    aiDurabilityRating: "D2",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [4, 10, 11, 12],
    preferredCompetencies: [8, 1, 6, 9],
    dominantAnchors: [
      { anchorId: "management", idealMin: 7, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "impact", idealMin: 5, idealMax: 10 },
      { anchorId: "challenge", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "medium",
    transitionPathway: "direct",
    d4EvolutionPath: "AI-augmented executive using AI for reporting and scenario modeling while focusing on strategy and people leadership"
  },

  {
    directionId: "MG-4-ST",
    version: "v1.0",
    onetCodes: ["11-1011.00", "11-1011.03"],
    onetTitles: ["Chief Executives", "Chief Sustainability Officers"],
    category: "Management",
    metaDirection: "Entrepreneurial & Startup Leadership",
    context: "Startup",
    contextCode: "ST",
    directionLabel: "Startup Leadership — Founder / Early Operator",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [3, 5, 14, 15, 6],
    preferredCompetencies: [4, 8, 9],
    dominantAnchors: [
      { anchorId: "autonomy", idealMin: 7, idealMax: 10 },
      { anchorId: "impact", idealMin: 7, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "challenge", idealMin: 7, idealMax: 10 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "stretch",
    d4EvolutionPath: "AI-native founder operating at 10x leverage with minimal headcount"
  },

  {
    directionId: "MG-5-NP",
    version: "v1.0",
    onetCodes: ["11-9151.00", "11-9031.00"],
    onetTitles: ["Social and Community Service Managers", "Education Administrators, Preschool and Childcare Center/Program"],
    category: "Management",
    metaDirection: "Nonprofit & Mission Leadership",
    context: "Nonprofit / Mission",
    contextCode: "NP",
    directionLabel: "Nonprofit Program Management — Mission Organization",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [10, 1, 4],
    preferredCompetencies: [6, 11, 13],
    dominantAnchors: [
      { anchorId: "impact", idealMin: 8, idealMax: 10 },
      { anchorId: "management", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "security", idealMin: 5, idealMax: 10 },
      { anchorId: "workModel", idealMin: 4, idealMax: 10 }
    ],
    stretchabilityRequired: "medium",
    transitionPathway: "direct",
    d4EvolutionPath: "AI-enabled mission leader using AI for impact measurement and reporting while focusing on community, advocacy, and organizational strategy"
  },

  // ============================================================
  // SALES & RELATED
  // ============================================================

  {
    directionId: "SR-1-E",
    version: "v1.0",
    onetCodes: ["41-4011.00", "41-9031.00"],
    onetTitles: ["Sales Representatives, Wholesale and Manufacturing", "Sales Engineers"],
    category: "Sales & Related",
    metaDirection: "Enterprise & Complex Sales",
    context: "Enterprise",
    contextCode: "E",
    directionLabel: "Enterprise & Complex Sales — Corporate",
    aiDurabilityRating: "D2",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [14, 15, 1, 11],
    preferredCompetencies: [10, 4, 13],
    dominantAnchors: [
      { anchorId: "impact", idealMin: 6, idealMax: 10 },
      { anchorId: "challenge", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "autonomy", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "low",
    transitionPathway: "direct",
    d4EvolutionPath: "AI-augmented strategic seller using AI for prospecting and CRM while focusing on high-value relationships and complex negotiations"
  },

  // ============================================================
  // COMPUTER & MATHEMATICAL
  // ============================================================

  {
    directionId: "CM-2-E",
    version: "v1.0",
    onetCodes: ["15-2051.00", "15-2051.01", "15-2051.02"],
    onetTitles: ["Data Scientists", "Business Intelligence Analysts", "Data Warehousing Specialists"],
    category: "Computer & Mathematical",
    metaDirection: "Data Science & Analytics",
    context: "Enterprise",
    contextCode: "E",
    directionLabel: "Data Science & Analytics — Enterprise",
    aiDurabilityRating: "D1",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [9, 4, 8],
    preferredCompetencies: [5, 20, 22],
    dominantAnchors: [
      { anchorId: "technical", idealMin: 7, idealMax: 10 },
      { anchorId: "challenge", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "workModel", idealMin: 4, idealMax: 10 }
    ],
    stretchabilityRequired: "low",
    transitionPathway: "direct",
    d4EvolutionPath: "AI-powered data strategist using AI for all routine analysis while focusing on insight generation and strategic decision support"
  },

  {
    directionId: "CM-4-ST",
    version: "v1.0",
    onetCodes: ["15-1221.00", "15-2031.00"],
    onetTitles: ["Computer and Information Research Scientists", "Operations Research Analysts"],
    category: "Computer & Mathematical",
    metaDirection: "AI, ML & Emerging Tech",
    context: "Startup",
    contextCode: "ST",
    directionLabel: "AI & Emerging Tech — Startup",
    aiDurabilityRating: "D4",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [5, 3, 23, 22],
    preferredCompetencies: [4, 20, 8],
    dominantAnchors: [
      { anchorId: "technical", idealMin: 8, idealMax: 10 },
      { anchorId: "challenge", idealMin: 8, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "autonomy", idealMin: 6, idealMax: 10 }
    ],
    stretchabilityRequired: "medium",
    transitionPathway: "direct",
    d4EvolutionPath: "This IS the D4 path. Building the AI tools that transform other occupations."
  },

  // ============================================================
  // EDUCATION & LIBRARY
  // ============================================================

  {
    directionId: "ED-3-IF",
    version: "v1.0",
    onetCodes: ["13-1151.00", "25-9031.00"],
    onetTitles: ["Training and Development Specialists", "Instructional Coordinators"],
    category: "Education & Library",
    metaDirection: "Corporate Training & L&D",
    context: "Independent / Fractional",
    contextCode: "IF",
    directionLabel: "Corporate Training & L&D — Independent Consultant",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [11, 10, 8],
    preferredCompetencies: [5, 13, 23],
    dominantAnchors: [
      { anchorId: "impact", idealMin: 7, idealMax: 10 },
      { anchorId: "autonomy", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "workModel", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "bridge",
    d4EvolutionPath: "AI-powered learning designer using AI for content creation while focusing on facilitation and organizational learning strategy"
  },

  // ============================================================
  // HEALTHCARE PRACTITIONERS
  // ============================================================

  {
    directionId: "HC-2-OV",
    version: "v1.0",
    onetCodes: ["21-1014.00", "21-1013.00"],
    onetTitles: ["Mental Health Counselors", "Marriage and Family Therapists"],
    category: "Healthcare Practitioners",
    metaDirection: "Mental Health & Behavioral Health",
    context: "Own Venture",
    contextCode: "OV",
    directionLabel: "Therapy & Coaching Practice — Own Venture",
    aiDurabilityRating: "D4",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [11, 13, 14],
    preferredCompetencies: [1, 10, 5],
    dominantAnchors: [
      { anchorId: "impact", idealMin: 8, idealMax: 10 },
      { anchorId: "autonomy", idealMin: 7, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "workModel", idealMin: 6, idealMax: 10 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "bridge",
    eligibility: {
      gateType: "hard",
      acceptedCredentials: ["healthcare_clinical"],
      acceptedStatuses: ["active"],
      reason: "This direction requires an active clinical or healthcare practice credential."
    },
    d4EvolutionPath: "AI-augmented therapist using AI for admin and progress tracking while focusing entirely on therapeutic relationship"
  },

  // ============================================================
  // LEGAL
  // ============================================================

  {
    directionId: "LG-2-IF",
    version: "v1.0",
    onetCodes: ["23-1011.00"],
    onetTitles: ["Lawyers"],
    category: "Legal",
    metaDirection: "Corporate & Transactional Law",
    context: "Independent / Fractional",
    contextCode: "IF",
    directionLabel: "Fractional General Counsel",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [9, 1, 12, 14],
    preferredCompetencies: [4, 7, 15],
    dominantAnchors: [
      { anchorId: "technical", idealMin: 7, idealMax: 10 },
      { anchorId: "autonomy", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "security", idealMin: 4, idealMax: 8 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "bridge",
    eligibility: {
      gateType: "hard",
      acceptedCredentials: ["legal_bar"],
      acceptedStatuses: ["active"],
      reason: "This direction requires active legal authorization."
    },
    d4EvolutionPath: "AI-powered legal strategist using AI for research and drafting while focusing on strategic counsel and client relationships"
  },

  // ============================================================
  // ARTS, DESIGN & MEDIA
  // ============================================================

  {
    directionId: "AD-5-IF",
    version: "v1.0",
    onetCodes: ["11-2021.00", "27-3031.00"],
    onetTitles: ["Marketing Managers", "Public Relations Specialists"],
    category: "Arts, Design & Media",
    metaDirection: "Marketing, PR & Brand",
    context: "Independent / Fractional",
    contextCode: "IF",
    directionLabel: "Fractional CMO / Brand Strategy",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [3, 4, 14, 15],
    preferredCompetencies: [10, 11, 20],
    dominantAnchors: [
      { anchorId: "autonomy", idealMin: 7, idealMax: 10 },
      { anchorId: "impact", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "challenge", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "bridge",
    d4EvolutionPath: "AI-augmented brand strategist using AI for content production while focusing on strategy and client relationships"
  },

  // ============================================================
  // ARCHITECTURE & ENGINEERING
  // ============================================================

  {
    directionId: "AE-4-IF",
    version: "v1.0",
    onetCodes: ["17-2051.00", "11-9041.00"],
    onetTitles: ["Civil Engineers", "Architectural and Engineering Managers"],
    category: "Architecture & Engineering",
    metaDirection: "Technical Consulting & Engineering Advisory",
    context: "Independent / Fractional",
    contextCode: "IF",
    directionLabel: "Engineering Consulting — Independent",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [4, 14, 15, 12],
    preferredCompetencies: [9, 8, 1],
    dominantAnchors: [
      { anchorId: "technical", idealMin: 8, idealMax: 10 },
      { anchorId: "autonomy", idealMin: 7, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "challenge", idealMin: 6, idealMax: 10 }
    ],
    stretchabilityRequired: "high",
    transitionPathway: "bridge",
    eligibility: {
      gateType: "soft",
      acceptedCredentials: ["engineering_pe"],
      acceptedStatuses: ["active", "in_progress"],
      reason: "Some engineering consulting work may require a PE license depending on services offered and jurisdiction."
    },
    d4EvolutionPath: "AI-powered engineering advisor using AI for analysis and modeling while focusing on strategic technical direction"
  },

  // ============================================================
  // INSTALLATION, MAINTENANCE & REPAIR
  // ============================================================

  {
    directionId: "IR-1-OV",
    version: "v1.0",
    onetCodes: ["49-9021.00", "49-9071.00"],
    onetTitles: ["Heating, Air Conditioning, and Refrigeration Mechanics and Installers", "Maintenance and Repair Workers, General"],
    category: "Installation, Maintenance & Repair",
    metaDirection: "Skilled Trades & Technical Services",
    context: "Own Venture",
    contextCode: "OV",
    directionLabel: "Skilled Trades Practice — Own Venture (HVAC / Technical)",
    aiDurabilityRating: "D3",
    aiExposureSource: "Anthropic Economic Index 2026",
    requiredCompetencies: [16, 17, 18],
    preferredCompetencies: [6, 7, 14],
    dominantAnchors: [
      { anchorId: "craft", idealMin: 7, idealMax: 10 },
      { anchorId: "autonomy", idealMin: 6, idealMax: 10 }
    ],
    significantAnchors: [
      { anchorId: "security", idealMin: 5, idealMax: 10 }
    ],
    stretchabilityRequired: "medium",
    transitionPathway: "bridge",
    eligibility: {
      gateType: "soft",
      acceptedCredentials: ["trade_license"],
      acceptedStatuses: ["active", "in_progress"],
      reason: "Some trade businesses require state or local licensing depending on the service and jurisdiction."
    },
    d4EvolutionPath: "AI-augmented trades business owner using AI for scheduling, quoting, and customer management while focusing on craft and service quality"
  }

];
