// app/src/data/directionFamilyRegistryV1.js
// Compact canonical registry for Ortheon Direction Family Library v1.0.
//
// This is intentionally small: IDs, names, spine metadata, and a few routing
// flags only. Full methodology remains in docs/ortheon.

export const directionFamilyRegistryVersion = "v1.0-final-candidate-compact";

const SPINES = {
  people_organization: "People & Organization",
  workforce_intelligence: "Workforce Intelligence / Talent Strategy",
  marketing_growth: "Marketing & Growth",
  commercial_sales_partnerships: "Commercial / Sales / Partnerships",
  operations_delivery: "Operations & Delivery",
  product_technology: "Product & Technology",
  it_enterprise_systems: "IT / Enterprise Systems",
  digital_transformation_ai: "Digital Transformation / Automation / AI Enablement",
  data_analytics_bi: "Data / Analytics / Business Intelligence",
  strategy_advisory: "Strategy & Advisory",
  finance_capital: "Finance & Capital",
  risk_compliance_governance: "Risk, Compliance & Governance",
  mission_public_education: "Mission / Public Sector / Education",
  independent_practice: "Independent Practice / Fractional Advisory",
  founder_builder_operator: "Founder / Builder / Operator",
  skilled_trade_licensed: "Skilled Trade & Licensed Practice",
};

function family({
  familyId,
  familyName,
  spineId,
  aiDigitalTreatment = null,
  credentialGateType = "none",
}) {
  return {
    familyId,
    familyName,
    spineId,
    spineName: SPINES[spineId],
    shortLabel: familyName,
    status: "canonical",
    aiDigitalTreatment,
    credentialGateType,
    adjacentFamilyIds: [],
    bridgeFamilyIds: [],
  };
}

export const directionFamilyRegistryV1 = [
  family({ familyId: "PO-01", familyName: "People / HR Leadership", spineId: "people_organization", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "PO-02", familyName: "HR Business Partnership", spineId: "people_organization", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "PO-03", familyName: "Talent Acquisition Leadership", spineId: "people_organization", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "PO-04", familyName: "Organizational Development & Change", spineId: "people_organization", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "PO-05", familyName: "Learning & Development Leadership", spineId: "people_organization", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "PO-06", familyName: "Compensation, Benefits & Total Rewards", spineId: "people_organization", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),

  family({ familyId: "WI-01", familyName: "Workforce Planning & Talent Strategy", spineId: "workforce_intelligence", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "WI-02", familyName: "People Analytics", spineId: "workforce_intelligence", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "WI-03", familyName: "HR Technology & Systems", spineId: "workforce_intelligence", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "WI-04", familyName: "Talent Intelligence & Market Research", spineId: "workforce_intelligence", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),

  family({ familyId: "MG-01", familyName: "Marketing / Growth Leadership", spineId: "marketing_growth", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "MG-02", familyName: "Brand & Communications", spineId: "marketing_growth", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "MG-03", familyName: "Performance & Growth Marketing", spineId: "marketing_growth", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "MG-04", familyName: "Content, SEO & Editorial Strategy", spineId: "marketing_growth", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "MG-05", familyName: "Lifecycle, CRM & Retention", spineId: "marketing_growth", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "MG-06", familyName: "Product Marketing / GTM Strategy", spineId: "marketing_growth", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),

  family({ familyId: "CS-01", familyName: "Enterprise Sales Leadership", spineId: "commercial_sales_partnerships", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "CS-02", familyName: "Account Management & Customer Success", spineId: "commercial_sales_partnerships", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "CS-03", familyName: "Business Development & Partnerships", spineId: "commercial_sales_partnerships", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "CS-04", familyName: "Revenue Operations", spineId: "commercial_sales_partnerships", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),

  family({ familyId: "OD-01", familyName: "Business Operations Leadership", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "OD-02", familyName: "Program & Project Leadership", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "OD-03", familyName: "Supply Chain & Logistics", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "OD-04", familyName: "Customer Operations & Service Delivery", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "OD-05", familyName: "Industrial / Manufacturing Operations", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "OD-06", familyName: "Change Management & Adoption Leadership", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "OD-07", familyName: "Healthcare Administration / Care Operations", spineId: "operations_delivery", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),

  family({ familyId: "PT-01", familyName: "Product Management", spineId: "product_technology", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "PT-02", familyName: "Engineering Leadership", spineId: "product_technology", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "PT-03", familyName: "Technical Craft / Senior IC", spineId: "product_technology", aiDigitalTreatment: "Standalone", credentialGateType: "none" }),
  family({ familyId: "PT-04", familyName: "Design & User Experience", spineId: "product_technology", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "PT-05", familyName: "Data Engineering & Platform", spineId: "product_technology", aiDigitalTreatment: "Standalone", credentialGateType: "soft" }),

  family({ familyId: "IT-01", familyName: "Enterprise IT Leadership", spineId: "it_enterprise_systems", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "IT-02", familyName: "Information Security & Risk", spineId: "it_enterprise_systems", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "IT-03", familyName: "Cloud, Infrastructure & DevOps", spineId: "it_enterprise_systems", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "IT-04", familyName: "Business Systems & Enterprise Applications", spineId: "it_enterprise_systems", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),

  family({ familyId: "DX-01", familyName: "Digital Transformation Program Leadership", spineId: "digital_transformation_ai", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "DX-02", familyName: "Business Process Automation", spineId: "digital_transformation_ai", aiDigitalTreatment: "Standalone", credentialGateType: "soft" }),
  family({ familyId: "DX-03", familyName: "Enterprise AI Enablement", spineId: "digital_transformation_ai", aiDigitalTreatment: "Standalone", credentialGateType: "none" }),

  family({ familyId: "DA-01", familyName: "Analytics & Decision Support Leadership", spineId: "data_analytics_bi", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "DA-02", familyName: "Data Science & Quantitative Methods", spineId: "data_analytics_bi", aiDigitalTreatment: "Standalone", credentialGateType: "soft" }),
  family({ familyId: "DA-03", familyName: "Business Intelligence & Reporting", spineId: "data_analytics_bi", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),

  family({ familyId: "SA-01", familyName: "Corporate Strategy & Internal Advisory", spineId: "strategy_advisory", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "SA-02", familyName: "Management Consulting", spineId: "strategy_advisory", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "SA-03", familyName: "M&A and Corporate Development", spineId: "strategy_advisory", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "SA-04", familyName: "Transformation Advisory", spineId: "strategy_advisory", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),

  family({ familyId: "FC-01", familyName: "Corporate Finance & FP&A Leadership", spineId: "finance_capital", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "FC-02", familyName: "Financial Advisory & Wealth Management", spineId: "finance_capital", aiDigitalTreatment: "Modifier", credentialGateType: "hard" }),
  family({ familyId: "FC-03", familyName: "Investment, Private Capital & Venture", spineId: "finance_capital", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "FC-04", familyName: "Accounting, Controllership & Audit", spineId: "finance_capital", aiDigitalTreatment: "Modifier", credentialGateType: "hard" }),

  family({ familyId: "RC-01", familyName: "Compliance & Regulatory Operations", spineId: "risk_compliance_governance", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "RC-02", familyName: "Enterprise Risk Management", spineId: "risk_compliance_governance", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "RC-03", familyName: "Privacy, Data Governance & AI Governance", spineId: "risk_compliance_governance", aiDigitalTreatment: "Standalone", credentialGateType: "soft" }),

  family({ familyId: "MP-01", familyName: "Nonprofit Leadership", spineId: "mission_public_education", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),
  family({ familyId: "MP-02", familyName: "Education Leadership (K-12 & Higher Ed)", spineId: "mission_public_education", aiDigitalTreatment: "Modifier", credentialGateType: "jurisdiction_specific" }),
  family({ familyId: "MP-03", familyName: "Public Sector & Government", spineId: "mission_public_education", aiDigitalTreatment: "Modifier", credentialGateType: "jurisdiction_specific" }),
  family({ familyId: "MP-04", familyName: "Impact Investing & Social Enterprise Advisory", spineId: "mission_public_education", aiDigitalTreatment: "Modifier", credentialGateType: "soft" }),
  family({ familyId: "MP-05", familyName: "Workforce Development / Adult Learning / Career Services", spineId: "mission_public_education", aiDigitalTreatment: "Modifier", credentialGateType: "none" }),

  family({ familyId: "IP-01", familyName: "Solo Advisory Practice", spineId: "independent_practice", aiDigitalTreatment: "Modifier", credentialGateType: "unknown" }),
  family({ familyId: "IP-02", familyName: "Boutique Consulting Practice", spineId: "independent_practice", aiDigitalTreatment: "Modifier", credentialGateType: "unknown" }),
  family({ familyId: "IP-03", familyName: "Expert-Led / Creator Practice", spineId: "independent_practice", aiDigitalTreatment: "Modifier", credentialGateType: "unknown" }),

  family({ familyId: "FB-01", familyName: "Bootstrapped Service Business Builder", spineId: "founder_builder_operator", aiDigitalTreatment: "Modifier", credentialGateType: "unknown" }),
  family({ familyId: "FB-02", familyName: "Product / Software Venture Builder", spineId: "founder_builder_operator", aiDigitalTreatment: "Standalone", credentialGateType: "none" }),
  family({ familyId: "FB-03", familyName: "Marketplace / Platform Venture Builder", spineId: "founder_builder_operator", aiDigitalTreatment: "Standalone", credentialGateType: "none" }),
  family({ familyId: "FB-04", familyName: "Local / Main-Street Business Owner", spineId: "founder_builder_operator", aiDigitalTreatment: "Modifier", credentialGateType: "unknown" }),

  family({ familyId: "SL-01", familyName: "Skilled Trade Practice", spineId: "skilled_trade_licensed", aiDigitalTreatment: null, credentialGateType: "jurisdiction_specific" }),
  family({ familyId: "SL-02", familyName: "Clinical / Allied Health Practice", spineId: "skilled_trade_licensed", aiDigitalTreatment: "Modifier", credentialGateType: "jurisdiction_specific" }),
  family({ familyId: "SL-03", familyName: "Mental Health / Therapy Practice", spineId: "skilled_trade_licensed", aiDigitalTreatment: "Modifier", credentialGateType: "jurisdiction_specific" }),
  family({ familyId: "SL-04", familyName: "Licensed Professional Services", spineId: "skilled_trade_licensed", aiDigitalTreatment: "Modifier", credentialGateType: "jurisdiction_specific" }),
];

export const directionFamilyRegistryById = Object.fromEntries(
  directionFamilyRegistryV1.map((record) => [record.familyId, record])
);
