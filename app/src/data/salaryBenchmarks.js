// src/data/salaryBenchmarks.js
// Ortheon Salary Benchmarks v2.2 — Domain-Gated Master
// 49 entries matching roleLibrary.js v2.2
// Primary source: BLS OEWS May 2024 where available.
// All figures USD annual. BLS covers employed workers only.
// Fractional/Own Venture = estimated 12-month average including ramp-up.
// Next update: May 2027 after BLS May 2025 data releases.

export const salaryBenchmarks = [
  // ============================================================
  // BUSINESS & FINANCE — 10 entries
  // ============================================================

  {
    directionId: "BF-1-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm",
        occupationCode: "13-2051",
        occupationTitle: "Financial and Investment Analysts",
        medianAnnualWage: 101350,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 90000,
      months4to6: 100000,
      months7to12: 110000,
      avg12month: 102000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $101,350. Enterprise range reflects mid to senior financial analyst level.",
    },
  },

  {
    directionId: "BF-1-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/personal-financial-advisors.htm",
        occupationCode: "13-2052",
        occupationTitle: "Personal Financial Advisors",
        medianAnnualWage: 102140,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 20000,
      months4to6: 50000,
      months7to12: 90000,
      avg12month: 55000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $102,140 for employed advisors. Fractional ramp-up heavily weighted to months 7-12. BLS does not cover self-employed.",
    },
  },

  {
    directionId: "BF-4-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/human-resources-specialists.htm",
        occupationCode: "13-1071",
        occupationTitle: "Human Resources Specialists",
        medianAnnualWage: 72910,
        pulledAt: "2026-05-11",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/human-resources-managers.htm",
        occupationCode: "11-3121",
        occupationTitle: "Human Resources Managers",
        medianAnnualWage: 140030,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 80000,
      months4to6: 88000,
      months7to12: 95000,
      avg12month: 88000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS range: HR Specialist $72,910 to HR Manager $140,030. Enterprise direction targets HR Manager/Director level.",
    },
  },

  {
    directionId: "BF-5-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/human-resources-specialists.htm",
        occupationCode: "13-1071",
        occupationTitle: "Human Resources Specialists",
        medianAnnualWage: 72910,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 85000,
      months4to6: 95000,
      months7to12: 110000,
      avg12month: 98000,
      currency: "USD",
      market: "US_national",
      notes:
        "Workforce planning/talent intelligence roles blend HR and analytics ranges. Dedicated WFP/TI directors at enterprise level typically $90k-$130k.",
    },
  },

  {
    directionId: "BF-6-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/math/data-scientists.htm",
        occupationCode: "15-2051",
        occupationTitle: "Data Scientists",
        medianAnnualWage: 112590,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 90000,
      months4to6: 100000,
      months7to12: 120000,
      avg12month: 105000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS data scientist median $112,590. People analytics blends data science and HR manager ranges. Senior people analytics leaders at large enterprises typically $120k-$160k.",
    },
  },

  {
    directionId: "BF-7-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/management-analysts.htm",
        occupationCode: "13-1111",
        occupationTitle: "Management Analysts",
        medianAnnualWage: 99410,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 25000,
      months4to6: 55000,
      months7to12: 90000,
      avg12month: 60000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS management analyst median $99,410. Small business advisory practice ramp-up is slow. SCORE, SBA, SBDC networks accelerate pipeline.",
    },
  },

  {
    directionId: "BF-8-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/community-and-social-service/school-and-career-counselors.htm",
        occupationCode: "21-1012",
        occupationTitle: "Educational, Guidance, and Career Counselors and Advisors",
        medianAnnualWage: 62320,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 30000,
      months4to6: 60000,
      months7to12: 100000,
      avg12month: 65000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $62,320 for employed career counselors. Independent outplacement consultants contracting with firms earn $80k-$150k once established.",
    },
  },

  {
    directionId: "BF-9-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/compliance-officers.htm",
        occupationCode: "13-1041",
        occupationTitle: "Compliance Officers",
        medianAnnualWage: 79290,
        pulledAt: "2026-05-11",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm",
        occupationCode: "13-2054",
        occupationTitle: "Financial Risk Specialists",
        medianAnnualWage: 106000,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 85000,
      months4to6: 95000,
      months7to12: 105000,
      avg12month: 97000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS range: compliance officer $79,290 to financial risk specialist $106,000. Financial services sector commands highest premium.",
    },
  },

  {
    directionId: "BF-10-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/advertising-promotions-and-marketing-managers.htm",
        occupationCode: "11-2011",
        occupationTitle: "Advertising and Promotions Managers",
        medianAnnualWage: 126960,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 35000,
      months4to6: 70000,
      months7to12: 110000,
      avg12month: 73000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS advertising/promotions managers median $126,960. Fractional comms/PR consultant ramp-up.",
    },
  },

  {
    directionId: "BF-11-OV",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/personal-financial-advisors.htm",
        occupationCode: "13-2052",
        occupationTitle: "Personal Financial Advisors",
        medianAnnualWage: 102140,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 20000,
      months4to6: 60000,
      months7to12: 110000,
      avg12month: 65000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $102,140 for employed advisors. Own practice ramp-up slower than employed path. Requires FINRA registration or RIA status.",
    },
  },

  // ============================================================
  // MANAGEMENT — 12 entries
  // ============================================================

  {
    directionId: "MG-1-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 120000,
      months4to6: 130000,
      months7to12: 140000,
      avg12month: 133000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $133,120. Senior general management level.",
    },
  },

  {
    directionId: "MG-4-ST",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1011",
        occupationTitle: "Chief Executives",
        medianAnnualWage: 262930,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 20000,
      months4to6: 50000,
      months7to12: 80000,
      avg12month: 50000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS CEO median $262,930 is not representative of startup founder. Early founders often take minimal cash. Equity upside not reflected.",
    },
  },

  {
    directionId: "MG-5-NP",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/social-and-community-service-managers.htm",
        occupationCode: "11-9151",
        occupationTitle: "Social and Community Service Managers",
        medianAnnualWage: 78240,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 68000,
      months4to6: 72000,
      months7to12: 78000,
      avg12month: 73000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $78,240. Nonprofit context typically at or slightly below BLS median.",
    },
  },

  {
    directionId: "MG-6-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 110000,
      months4to6: 125000,
      months7to12: 140000,
      avg12month: 128000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $133,120 for operations managers. Chief of Staff roles cluster at senior end. Typically requires prior ops or strategy experience.",
    },
  },

  {
    directionId: "MG-7-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/management-analysts.htm",
        occupationCode: "13-1111",
        occupationTitle: "Management Analysts",
        medianAnnualWage: 99410,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 30000,
      months4to6: 70000,
      months7to12: 130000,
      avg12month: 80000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $99,410 for employed analysts. Independent consultant ramp-up 6-12 months. BLS does not cover self-employed.",
    },
  },

  {
    directionId: "MG-8-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/project-management-specialists.htm",
        occupationCode: "13-1082",
        occupationTitle: "Project Management Specialists",
        medianAnnualWage: 98580,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 88000,
      months4to6: 95000,
      months7to12: 105000,
      avg12month: 97000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $98,580. Senior program managers at enterprise typically $110k-$140k.",
    },
  },

  {
    directionId: "MG-9-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 105000,
      months4to6: 120000,
      months7to12: 140000,
      avg12month: 125000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $133,120. Marketplace/platform ops at tech companies typically $120k-$170k.",
    },
  },

  {
    directionId: "MG-9-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 30000,
      months4to6: 70000,
      months7to12: 120000,
      avg12month: 75000,
      currency: "USD",
      market: "US_national",
      notes:
        "No BLS category for fractional marketplace ops. Fractional COO/ops advisors for marketplace startups typically ramp over 6-12 months.",
    },
  },

  {
    directionId: "MG-10-NP",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/social-and-community-service-managers.htm",
        occupationCode: "11-9151",
        occupationTitle: "Social and Community Service Managers",
        medianAnnualWage: 78240,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 65000,
      months4to6: 72000,
      months7to12: 80000,
      avg12month: 73000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $78,240 for social/community service managers. Nonprofit development directors typically $70k-$100k.",
    },
  },

  {
    directionId: "MG-11-OV",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 20000,
      months4to6: 50000,
      months7to12: 80000,
      avg12month: 52000,
      currency: "USD",
      market: "US_national",
      notes:
        "No single BLS category for small service business owners. Year 1 typically below employed equivalent.",
    },
  },

  {
    directionId: "MG-12-OV",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/social-and-community-service-managers.htm",
        occupationCode: "11-9151",
        occupationTitle: "Social and Community Service Managers",
        medianAnnualWage: 78240,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 15000,
      months4to6: 40000,
      months7to12: 75000,
      avg12month: 45000,
      currency: "USD",
      market: "US_national",
      notes:
        "Social enterprise income highly variable. Year 1 cash compensation typically low while building model and funding.",
    },
  },

  {
    directionId: "MG-13-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 90000,
      months4to6: 100000,
      months7to12: 110000,
      avg12month: 103000,
      currency: "USD",
      market: "US_national",
      notes:
        "Government and public sector management salaries typically below private sector equivalent.",
    },
  },

  // ============================================================
  // SALES & RELATED — 3 entries
  // ============================================================

  {
    directionId: "SR-1-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm",
        occupationCode: "41-4011",
        occupationTitle:
          "Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
        medianAnnualWage: 100070,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 80000,
      months4to6: 100000,
      months7to12: 130000,
      avg12month: 105000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $100,070 for technical/scientific sales reps. Total comp including commission can be higher for enterprise roles.",
    },
  },

  {
    directionId: "SR-2-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/sales/sales-managers.htm",
        occupationCode: "11-2022",
        occupationTitle: "Sales Managers",
        medianAnnualWage: 135160,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 80000,
      months4to6: 95000,
      months7to12: 115000,
      avg12month: 98000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $135,160 for sales managers. CS/AM roles at enterprise level typically $80k-$130k base plus bonus.",
    },
  },

  {
    directionId: "SR-3-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/training-and-development-specialists.htm",
        occupationCode: "13-1151",
        occupationTitle: "Training and Development Specialists",
        medianAnnualWage: 65850,
        pulledAt: "2026-05-11",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/sales/sales-managers.htm",
        occupationCode: "11-2022",
        occupationTitle: "Sales Managers",
        medianAnnualWage: 135160,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 80000,
      months4to6: 92000,
      months7to12: 105000,
      avg12month: 95000,
      currency: "USD",
      market: "US_national",
      notes:
        "Seller enablement sits between T&D specialist and sales manager. Dedicated enablement directors at enterprise typically $90k-$130k.",
    },
  },

  // ============================================================
  // COMPUTER & MATHEMATICAL — 6 entries
  // ============================================================

  {
    directionId: "CM-2-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/math/data-scientists.htm",
        occupationCode: "15-2051",
        occupationTitle: "Data Scientists",
        medianAnnualWage: 112590,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 100000,
      months4to6: 110000,
      months7to12: 120000,
      avg12month: 112000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $112,590. Financial pathway aligned with BLS data.",
    },
  },

  {
    directionId: "CM-4-ST",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/computer-and-information-technology/computer-and-information-research-scientists.htm",
        occupationCode: "15-1221",
        occupationTitle: "Computer and Information Research Scientists",
        medianAnnualWage: 145080,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 130000,
      months4to6: 150000,
      months7to12: 180000,
      avg12month: 157000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $145,080. Startup AI roles command premium. Equity upside not reflected.",
    },
  },

  {
    directionId: "CM-5-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "15-1299",
        occupationTitle: "Computer Occupations, All Other",
        medianAnnualWage: 118290,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 30000,
      months4to6: 80000,
      months7to12: 160000,
      avg12month: 95000,
      currency: "USD",
      market: "US_national",
      notes:
        "No dedicated BLS category for AI transformation consulting. Independent AI consultants ramp up steeply but have high upside.",
    },
  },

  {
    directionId: "CM-6-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 100000,
      months4to6: 115000,
      months7to12: 130000,
      avg12month: 118000,
      currency: "USD",
      market: "US_national",
      notes:
        "No dedicated BLS category for product operations. Product ops managers at mid-to-large tech companies typically earn $110k-$160k.",
    },
  },

  {
    directionId: "CM-7-ST",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "15-1299",
        occupationTitle: "Computer Occupations, All Other",
        medianAnnualWage: 118290,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 110000,
      months4to6: 130000,
      months7to12: 160000,
      avg12month: 140000,
      currency: "USD",
      market: "US_national",
      notes:
        "No BLS category for AI product ops. AI product ops roles at funded startups typically $130k-$200k plus equity.",
    },
  },

  {
    directionId: "CM-8-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/management-analysts.htm",
        occupationCode: "13-1111",
        occupationTitle: "Management Analysts",
        medianAnnualWage: 99410,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 40000,
      months4to6: 90000,
      months7to12: 150000,
      avg12month: 95000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS management analyst median $99,410. Operations/supply chain consulting commands premium for specialized domain.",
    },
  },

  // ============================================================
  // TECHNOLOGY EXECUTIVE — 5 entries
  // ============================================================

  {
    directionId: "TE-1-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm",
        occupationCode: "11-3021",
        occupationTitle: "Computer and Information Systems Managers",
        medianAnnualWage: 169510,
        pulledAt: "2026-05-18",
      },
    ],
    financialPathway: {
      months1to3: 145000,
      months4to6: 165000,
      months7to12: 190000,
      avg12month: 170000,
      currency: "USD",
      market: "US_national",
      notes:
        "Technology executive benchmark anchored to Computer and Information Systems Managers. CTO / VP Engineering compensation varies widely by company size, market, equity, and industry.",
    },
  },

  {
    directionId: "TE-2-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm",
        occupationCode: "11-3021",
        occupationTitle: "Computer and Information Systems Managers",
        medianAnnualWage: 169510,
        pulledAt: "2026-05-18",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/computer-and-information-technology/computer-and-information-research-scientists.htm",
        occupationCode: "15-1221",
        occupationTitle: "Computer and Information Research Scientists",
        medianAnnualWage: 145080,
        pulledAt: "2026-05-18",
      },
    ],
    financialPathway: {
      months1to3: 150000,
      months4to6: 175000,
      months7to12: 210000,
      avg12month: 185000,
      currency: "USD",
      market: "US_national",
      notes:
        "No mature BLS category for Chief AI Officer. Estimate blends senior technology management, AI leadership, and transformation executive compensation.",
    },
  },

  {
    directionId: "TE-3-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm",
        occupationCode: "11-3021",
        occupationTitle: "Computer and Information Systems Managers",
        medianAnnualWage: 169510,
        pulledAt: "2026-05-18",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/management-analysts.htm",
        occupationCode: "13-1111",
        occupationTitle: "Management Analysts",
        medianAnnualWage: 99410,
        pulledAt: "2026-05-18",
      },
    ],
    financialPathway: {
      months1to3: 135000,
      months4to6: 155000,
      months7to12: 185000,
      avg12month: 160000,
      currency: "USD",
      market: "US_national",
      notes:
        "Digital transformation executive benchmark blends technology management and management analyst/strategy roles. Enterprise-level roles may be substantially higher.",
    },
  },

  {
    directionId: "TE-4-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm",
        occupationCode: "11-3021",
        occupationTitle: "Computer and Information Systems Managers",
        medianAnnualWage: 169510,
        pulledAt: "2026-05-18",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/management-analysts.htm",
        occupationCode: "13-1111",
        occupationTitle: "Management Analysts",
        medianAnnualWage: 99410,
        pulledAt: "2026-05-18",
      },
    ],
    financialPathway: {
      months1to3: 45000,
      months4to6: 110000,
      months7to12: 190000,
      avg12month: 115000,
      currency: "USD",
      market: "US_national",
      notes:
        "Fractional CTO / technical advisory income depends heavily on client acquisition. Year-1 ramp-up is usually uneven; established advisors can exceed employed benchmarks.",
    },
  },

  {
    directionId: "TE-5-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm",
        occupationCode: "11-3021",
        occupationTitle: "Computer and Information Systems Managers",
        medianAnnualWage: 169510,
        pulledAt: "2026-05-18",
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "15-1299",
        occupationTitle: "Computer Occupations, All Other",
        medianAnnualWage: 118290,
        pulledAt: "2026-05-18",
      },
    ],
    financialPathway: {
      months1to3: 125000,
      months4to6: 145000,
      months7to12: 170000,
      avg12month: 148000,
      currency: "USD",
      market: "US_national",
      notes:
        "Enterprise architecture / platform modernization benchmark blends senior systems architecture and technology management compensation.",
    },
  },

  // ============================================================
  // EDUCATION & LIBRARY — 3 entries
  // ============================================================

  {
    directionId: "ED-3-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/training-and-development-specialists.htm",
        occupationCode: "13-1151",
        occupationTitle: "Training and Development Specialists",
        medianAnnualWage: 65850,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 30000,
      months4to6: 60000,
      months7to12: 90000,
      avg12month: 62000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $65,850 for employed specialists. Independent L&D consultant ramp-up.",
    },
  },

  {
    directionId: "ED-4-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators.htm",
        occupationCode: "25-9031",
        occupationTitle: "Instructional Coordinators",
        medianAnnualWage: 74620,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 35000,
      months4to6: 65000,
      months7to12: 95000,
      avg12month: 68000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS instructional coordinator median $74,620. Freelance instructional designers earn more once established.",
    },
  },

  {
    directionId: "ED-5-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "estimated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/human-resources-managers.htm",
        occupationCode: "11-3121",
        occupationTitle: "Human Resources Managers",
        medianAnnualWage: 140030,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 25000,
      months4to6: 70000,
      months7to12: 130000,
      avg12month: 72000,
      currency: "USD",
      market: "US_national",
      notes:
        "No dedicated BLS category for executive coaching. Year 1 can be slow while building client base.",
    },
  },

  // ============================================================
  // HEALTHCARE PRACTITIONERS — 2 entries
  // ============================================================

  {
    directionId: "HC-2-OV",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/community-and-social-service/substance-abuse-behavioral-disorder-and-mental-health-counselors.htm",
        occupationCode: "21-1014",
        occupationTitle:
          "Substance Abuse, Behavioral Disorder, and Mental Health Counselors",
        medianAnnualWage: 59190,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 25000,
      months4to6: 50000,
      months7to12: 80000,
      avg12month: 55000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $59,190 for employed counselors. Own practice ramp-up. Requires clinical license.",
    },
  },

  {
    directionId: "HC-3-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/medical-and-health-services-managers.htm",
        occupationCode: "11-9111",
        occupationTitle: "Medical and Health Services Managers",
        medianAnnualWage: 110680,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 95000,
      months4to6: 105000,
      months7to12: 118000,
      avg12month: 108000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $110,680 for medical/health services managers. Hospital systems and large health networks at senior level typically higher.",
    },
  },

  // ============================================================
  // LEGAL — 2 entries
  // ============================================================

  {
    directionId: "LG-2-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/legal/lawyers.htm",
        occupationCode: "23-1011",
        occupationTitle: "Lawyers",
        medianAnnualWage: 151160,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 60000,
      months4to6: 100000,
      months7to12: 150000,
      avg12month: 105000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $151,160 for employed lawyers. Fractional GC ramp-up while building client base.",
    },
  },

  {
    directionId: "LG-3-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/oes/current/oes231022.htm",
        occupationCode: "23-1022",
        occupationTitle: "Arbitrators, Mediators, and Conciliators",
        medianAnnualWage: 75740,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 25000,
      months4to6: 55000,
      months7to12: 100000,
      avg12month: 60000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $75,740 for mediators/arbitrators. Independent practice ramp-up slow.",
    },
  },

  // ============================================================
  // ARTS, DESIGN & MEDIA — 3 entries
  // ============================================================

  {
    directionId: "AD-5-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/advertising-promotions-and-marketing-managers.htm",
        occupationCode: "11-2021",
        occupationTitle: "Marketing Managers",
        medianAnnualWage: 161030,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 40000,
      months4to6: 80000,
      months7to12: 130000,
      avg12month: 85000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $161,030 for employed marketing managers. Fractional CMO ramp-up lower initially.",
    },
  },

  {
    directionId: "AD-6-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/media-and-communication/technical-writers.htm",
        occupationCode: "27-3042",
        occupationTitle: "Technical Writers",
        medianAnnualWage: 81060,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 35000,
      months4to6: 65000,
      months7to12: 100000,
      avg12month: 68000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $81,060 for technical writers. Established fractional content strategists can earn more.",
    },
  },

  {
    directionId: "AD-7-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/arts-and-design/web-developers.htm",
        occupationCode: "15-1255",
        occupationTitle: "Web and Digital Interface Designers",
        medianAnnualWage: 92750,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 40000,
      months4to6: 80000,
      months7to12: 130000,
      avg12month: 85000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS web/digital interface designers median $92,750. Independent UX/product design consultants with strong portfolio may earn more.",
    },
  },

  // ============================================================
  // ARCHITECTURE & ENGINEERING — 2 entries
  // ============================================================

  {
    directionId: "AE-4-IF",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "17-2051",
        occupationTitle: "Civil Engineers",
        medianAnnualWage: 116380,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 60000,
      months4to6: 100000,
      months7to12: 150000,
      avg12month: 107000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS mean $116,380 for civil engineers. Independent engineering consulting rates higher for senior specialists.",
    },
  },

  {
    directionId: "AE-5-E",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "17-2051",
        occupationTitle: "Civil Engineers",
        medianAnnualWage: 116380,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 110000,
      months4to6: 125000,
      months7to12: 140000,
      avg12month: 128000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS civil engineer mean $116,380. Technical program managers at aerospace, defense, and large engineering firms typically $120k-$160k.",
    },
  },

  // ============================================================
  // INSTALLATION, MAINTENANCE & REPAIR — 1 entry
  // ============================================================

  {
    directionId: "IR-1-OV",
    version: "v2.2",
    lastUpdated: "2026-05-18",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm",
        occupationCode: "49-9021",
        occupationTitle:
          "Heating, Air Conditioning, and Refrigeration Mechanics and Installers",
        medianAnnualWage: 59810,
        pulledAt: "2026-05-11",
      },
    ],
    financialPathway: {
      months1to3: 40000,
      months4to6: 60000,
      months7to12: 80000,
      avg12month: 63000,
      currency: "USD",
      market: "US_national",
      notes:
        "BLS median $59,810 for employed HVAC technicians. Own business revenue higher once established. Licensing required in most states.",
    },
  },
];