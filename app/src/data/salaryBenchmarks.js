// src/data/salaryBenchmarks.js
// Ortheon Salary Benchmarks v1.1
// Source: BLS Occupational Employment and Wage Statistics (OEWS), May 2024
// Released: April 2, 2025 by BLS
// All figures USD annual (employed workers only)
// Fractional/Own Venture = estimated 12-month average including ramp-up
// BLS does not cover self-employed workers - those figures are Ortheon estimates
// Next update: May 2027 after BLS May 2025 data releases May 15, 2026

export const salaryBenchmarks = [

  {
    directionId: "BF-1-E",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm",
        occupationCode: "13-2051",
        occupationTitle: "Financial and Investment Analysts",
        medianAnnualWage: 101350,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 90000,
      months4to6: 100000,
      months7to12: 110000,
      avg12month: 102000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $101,350 for employed financial analysts. Enterprise range reflects mid to senior level."
    }
  },

  {
    directionId: "BF-1-IF",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/personal-financial-advisors.htm",
        occupationCode: "13-2052",
        occupationTitle: "Personal Financial Advisors",
        medianAnnualWage: 102140,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 20000,
      months4to6: 50000,
      months7to12: 90000,
      avg12month: 55000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $102,140 for employed advisors. Fractional/independent ramp-up significantly lower in months 1-6. BLS does not cover self-employed."
    }
  },

  {
    directionId: "BF-4-E",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/human-resources-specialists.htm",
        occupationCode: "13-1071",
        occupationTitle: "Human Resources Specialists",
        medianAnnualWage: 72910,
        pulledAt: "2026-05-10"
      },
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/human-resources-managers.htm",
        occupationCode: "11-3121",
        occupationTitle: "Human Resources Managers",
        medianAnnualWage: 140030,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 80000,
      months4to6: 88000,
      months7to12: 95000,
      avg12month: 88000,
      currency: "USD",
      market: "US_national",
      notes: "BLS range: HR Specialist $72,910 to HR Manager $140,030. Enterprise direction targets HR Manager/Director level."
    }
  },

  {
    directionId: "MG-1-E",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1021",
        occupationTitle: "General and Operations Managers",
        medianAnnualWage: 133120,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 120000,
      months4to6: 130000,
      months7to12: 140000,
      avg12month: 133000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $133,120. SIGNIFICANT UPDATE from v1.0 estimate of $107k. Actual BLS data significantly higher."
    }
  },

  {
    directionId: "MG-4-ST",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "11-1011",
        occupationTitle: "Chief Executives",
        medianAnnualWage: 262930,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 20000,
      months4to6: 50000,
      months7to12: 80000,
      avg12month: 50000,
      currency: "USD",
      market: "US_national",
      notes: "BLS CEO median $262,930 is NOT representative of startup founder path. Early stage founders take minimal cash salary. Equity upside not reflected in BLS data. Financial pathway reflects realistic startup founder compensation year 1."
    }
  },

  {
    directionId: "MG-5-NP",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/social-and-community-service-managers.htm",
        occupationCode: "11-9151",
        occupationTitle: "Social and Community Service Managers",
        medianAnnualWage: 78240,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 68000,
      months4to6: 72000,
      months7to12: 78000,
      avg12month: 73000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $78,240 for social and community service managers. Nonprofit context typically at or slightly below BLS median."
    }
  },

  {
    directionId: "SR-1-E",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm",
        occupationCode: "41-4011",
        occupationTitle: "Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
        medianAnnualWage: 100070,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 80000,
      months4to6: 100000,
      months7to12: 130000,
      avg12month: 105000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $100,070 for technical/scientific sales reps (base only). Enterprise complex sales includes significant commission on top. Total comp substantially higher for experienced reps. SIGNIFICANT UPDATE from v1.0 estimate of $72k."
    }
  },

  {
    directionId: "CM-2-E",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/math/data-scientists.htm",
        occupationCode: "15-2051",
        occupationTitle: "Data Scientists",
        medianAnnualWage: 112590,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 100000,
      months4to6: 110000,
      months7to12: 120000,
      avg12month: 112000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $112,590. Financial pathway aligned with BLS data. Confirmed accurate."
    }
  },

  {
    directionId: "CM-4-ST",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/computer-and-information-technology/computer-and-information-research-scientists.htm",
        occupationCode: "15-1221",
        occupationTitle: "Computer and Information Research Scientists",
        medianAnnualWage: 145080,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 130000,
      months4to6: 150000,
      months7to12: 180000,
      avg12month: 157000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $145,080. Startup AI roles command premium above BLS median. Equity upside not reflected. Confirmed directionally accurate."
    }
  },

  {
    directionId: "ED-3-IF",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/business-and-financial/training-and-development-specialists.htm",
        occupationCode: "13-1151",
        occupationTitle: "Training and Development Specialists",
        medianAnnualWage: 65850,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 30000,
      months4to6: 60000,
      months7to12: 90000,
      avg12month: 62000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $65,850 for employed specialists. Independent consultant ramp-up starts lower but reaches higher rates once established. BLS does not cover self-employed."
    }
  },

  {
    directionId: "HC-2-OV",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/community-and-social-service/substance-abuse-behavioral-disorder-and-mental-health-counselors.htm",
        occupationCode: "21-1014",
        occupationTitle: "Substance Abuse, Behavioral Disorder, and Mental Health Counselors",
        medianAnnualWage: 59190,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 25000,
      months4to6: 50000,
      months7to12: 80000,
      avg12month: 55000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $59,190 for employed counselors. Own practice ramp-up. Private practice rates higher once established. Licensing required. BLS does not cover self-employed."
    }
  },

  {
    directionId: "LG-2-IF",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/legal/lawyers.htm",
        occupationCode: "23-1011",
        occupationTitle: "Lawyers",
        medianAnnualWage: 151160,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 60000,
      months4to6: 100000,
      months7to12: 150000,
      avg12month: 105000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $151,160 for employed lawyers. Fractional GC ramp-up starts lower while building client base. BLS does not cover self-employed lawyers."
    }
  },

  {
    directionId: "AD-5-IF",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/management/advertising-promotions-and-marketing-managers.htm",
        occupationCode: "11-2021",
        occupationTitle: "Marketing Managers",
        medianAnnualWage: 161030,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 40000,
      months4to6: 80000,
      months7to12: 130000,
      avg12month: 85000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $161,030 for employed marketing managers. SIGNIFICANT UPDATE from v1.0 estimate of $140k. Fractional CMO ramp-up lower initially. Full-time CMO rate approaches BLS median when established."
    }
  },

  {
    directionId: "AE-4-IF",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/news.release/ocwage.t01.htm",
        occupationCode: "17-2051",
        occupationTitle: "Civil Engineers",
        medianAnnualWage: 116380,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 60000,
      months4to6: 100000,
      months7to12: 150000,
      avg12month: 107000,
      currency: "USD",
      market: "US_national",
      notes: "BLS mean $116,380 for civil engineers. SIGNIFICANT UPDATE from v1.0 estimate of $96k. Independent engineering consultant rates higher for senior specialists."
    }
  },

  {
    directionId: "IR-1-OV",
    version: "v1.1",
    lastUpdated: "2026-05-10",
    validUntil: "2027-05-15",
    dataQuality: "bls_validated",
    sources: [
      {
        name: "BLS OEWS May 2024",
        url: "https://www.bls.gov/ooh/installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm",
        occupationCode: "49-9021",
        occupationTitle: "Heating, Air Conditioning, and Refrigeration Mechanics and Installers",
        medianAnnualWage: 59810,
        pulledAt: "2026-05-10"
      }
    ],
    financialPathway: {
      months1to3: 40000,
      months4to6: 60000,
      months7to12: 80000,
      avg12month: 63000,
      currency: "USD",
      market: "US_national",
      notes: "BLS median $59,810 for employed HVAC technicians. Own business revenue higher once established. Licensing required in most states. BLS does not cover self-employed."
    }
  }

];
