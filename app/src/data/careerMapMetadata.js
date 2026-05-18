export const MAP_QUADRANTS = {
  corporate_human: {
    label: "Corporate / Structured + Human / Creative",
    xSide: "corporate",
    ySide: "human",
  },

  corporate_operational: {
    label: "Corporate / Structured + Technical / Operational",
    xSide: "corporate",
    ySide: "operational",
  },

  autonomous_human: {
    label: "Entrepreneurial / Autonomous + Human / Creative",
    xSide: "autonomous",
    ySide: "human",
  },

  autonomous_operational: {
    label: "Entrepreneurial / Autonomous + Technical / Operational",
    xSide: "autonomous",
    ySide: "operational",
  },
};

export const MAP_CLUSTERS = {
  enterprise_leadership: "Enterprise Leadership",
  business_operations: "Business Operations",
  marketplace_platforms: "Marketplace / Platform Operations",

  technology_executive: "Technology Executive Leadership",
  engineering_leadership: "Engineering Leadership",
  platform_technology: "Platform / Software Technology",
  ai_transformation: "AI Transformation",

  people_operations: "People Operations / HR",
  workforce_intelligence: "Workforce Planning / Talent Intelligence",
  people_analytics_hr_tech: "People Analytics / HR Tech",

  independent_advisory: "Independent Advisory",
  learning_workforce_development: "Learning / Workforce Development",
  technical_engineering: "Technical / Engineering",
  creative_content: "Creative / Content",
  regulated_professional: "Regulated Professional",
  trades_field_operations: "Trades / Field Operations",
};

export const CAREER_MAP_METADATA = {
  // ============================================================
  // Technology executive / AI leadership directions
  // These IDs are used by the updated role library.
  // They are safe to keep even before those roles are added.
  // ============================================================

  "TE-1-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "technology_executive",
    mapTags: ["cto", "vp_engineering", "technology_leadership", "enterprise"],
  },

  "TE-2-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "ai_transformation",
    mapTags: ["chief_ai_officer", "ai", "genai", "transformation", "enterprise"],
  },

  "TE-3-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "technology_executive",
    mapTags: [
      "technology_strategy",
      "digital_transformation",
      "enterprise_architecture",
      "modernization",
    ],
  },

  "TE-4-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "independent_advisory",
    mapTags: ["fractional_cto", "technical_advisor", "technology_advisory"],
  },

  "TE-5-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "platform_technology",
    mapTags: [
      "enterprise_architecture",
      "platform_modernization",
      "cloud",
      "devops",
      "engineering",
    ],
  },

  // ============================================================
  // Existing Management directions
  // ============================================================

  "MG-1-E": {
    mapQuadrant: "corporate_human",
    mapCluster: "enterprise_leadership",
    mapTags: ["management", "leadership", "p_and_l", "enterprise"],
  },

  "MG-6-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "business_operations",
    mapTags: ["business_operations", "chief_of_staff", "execution", "enterprise"],
  },

  "MG-9-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "marketplace_platforms",
    mapTags: ["marketplace", "platform", "operations", "ecosystem"],
  },

  "MG-9-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "marketplace_platforms",
    mapTags: ["marketplace", "platform", "fractional", "advisory"],
  },

  "MG-7-IF": {
    mapQuadrant: "autonomous_human",
    mapCluster: "independent_advisory",
    mapTags: ["management_consulting", "advisory", "clients", "strategy"],
  },

  "MG-4-ST": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "enterprise_leadership",
    mapTags: ["startup", "founder", "early_operator", "entrepreneurship"],
  },

  // ============================================================
  // Business / Finance / People directions
  // ============================================================

  "BF-4-E": {
    mapQuadrant: "corporate_human",
    mapCluster: "people_operations",
    mapTags: ["hr", "people_operations", "talent", "organization"],
  },

  "BF-5-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "workforce_intelligence",
    mapTags: ["workforce", "talent_intelligence", "planning", "hr"],
  },

  "BF-6-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "people_analytics_hr_tech",
    mapTags: ["people_analytics", "hr_tech", "workforce", "analytics"],
  },

  "BF-7-IF": {
    mapQuadrant: "autonomous_human",
    mapCluster: "independent_advisory",
    mapTags: ["small_business", "advisor", "entrepreneurship", "clients"],
  },

  "BF-8-IF": {
    mapQuadrant: "autonomous_human",
    mapCluster: "independent_advisory",
    mapTags: ["career_strategy", "outplacement", "advisor", "career"],
  },

  // ============================================================
  // Computer / Mathematical directions
  // ============================================================

  "CM-2-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "platform_technology",
    mapTags: ["data_science", "analytics", "business_intelligence", "data"],
  },

  "CM-4-ST": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "ai_transformation",
    mapTags: ["ai", "machine_learning", "emerging_tech", "startup"],
  },

  "CM-5-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "ai_transformation",
    mapTags: ["ai", "transformation", "automation", "consulting"],
  },

  "CM-6-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "platform_technology",
    mapTags: ["product_operations", "technology", "platform", "enterprise"],
  },

  "CM-7-ST": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "ai_transformation",
    mapTags: ["ai_product", "llm", "startup", "product_operations"],
  },

  "CM-8-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "independent_advisory",
    mapTags: ["operations", "consulting", "advisory", "supply_chain"],
  },

  // ============================================================
  // Education / advisory directions
  // ============================================================

  "ED-3-IF": {
    mapQuadrant: "autonomous_human",
    mapCluster: "learning_workforce_development",
    mapTags: ["training", "learning", "l_and_d", "facilitation"],
  },

  "ED-4-IF": {
    mapQuadrant: "autonomous_human",
    mapCluster: "learning_workforce_development",
    mapTags: ["instructional_design", "e_learning", "education", "learning"],
  },

  "ED-5-IF": {
    mapQuadrant: "autonomous_human",
    mapCluster: "learning_workforce_development",
    mapTags: ["executive_coaching", "leadership_development", "coaching"],
  },

  // ============================================================
  // Engineering / technical directions
  // ============================================================

  "AE-4-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "technical_engineering",
    mapTags: ["engineering", "technical", "infrastructure", "advisory"],
  },

  "AE-5-E": {
    mapQuadrant: "corporate_operational",
    mapCluster: "engineering_leadership",
    mapTags: ["technical_program_management", "systems_engineering", "delivery"],
  },

  "IR-1-OV": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "trades_field_operations",
    mapTags: ["trades", "hvac", "field_operations", "technical_service"],
  },
};

export function getCareerMapMetadata(direction) {
  const directMetadata = CAREER_MAP_METADATA[direction.directionId];

  if (directMetadata) {
    return directMetadata;
  }

  return inferCareerMapMetadata(direction);
}

function inferCareerMapMetadata(direction) {
  const contextCode = direction.contextCode;
  const category = direction.category;
  const label = direction.directionLabel?.toLowerCase() || "";
  const metaDirection = direction.metaDirection?.toLowerCase() || "";

  const isAutonomous =
    contextCode === "IF" ||
    contextCode === "ST" ||
    contextCode === "OV" ||
    label.includes("independent") ||
    label.includes("fractional") ||
    label.includes("founder") ||
    label.includes("startup") ||
    label.includes("own venture");

  const isTechnology =
    category === "Computer & Mathematical" ||
    label.includes("cto") ||
    label.includes("vp engineering") ||
    label.includes("engineering") ||
    label.includes("software") ||
    label.includes("platform") ||
    label.includes("architecture") ||
    label.includes("technology") ||
    label.includes("technical") ||
    metaDirection.includes("technology") ||
    metaDirection.includes("engineering") ||
    metaDirection.includes("software") ||
    metaDirection.includes("architecture");

  const isHuman =
    category === "Education & Library" ||
    category === "Arts, Design & Media" ||
    label.includes("coach") ||
    label.includes("teacher") ||
    label.includes("training") ||
    label.includes("learning") ||
    label.includes("career") ||
    label.includes("outplacement") ||
    label.includes("advisor");

  const isHrSpecific =
    label.includes("hr") ||
    label.includes("people operations") ||
    label.includes("people analytics") ||
    label.includes("talent acquisition") ||
    label.includes("workforce") ||
    label.includes("talent intelligence") ||
    metaDirection.includes("hr") ||
    metaDirection.includes("people") ||
    metaDirection.includes("workforce") ||
    metaDirection.includes("talent");

  const isOperational =
    isTechnology ||
    category === "Architecture & Engineering" ||
    category === "Installation, Maintenance & Repair" ||
    label.includes("operations") ||
    label.includes("analytics") ||
    label.includes("systems") ||
    label.includes("supply") ||
    metaDirection.includes("operations") ||
    metaDirection.includes("analytics");

  let mapQuadrant;

  if (isAutonomous && (isTechnology || isOperational)) {
    mapQuadrant = "autonomous_operational";
  } else if (isAutonomous && (isHuman || isHrSpecific)) {
    mapQuadrant = "autonomous_human";
  } else if (!isAutonomous && (isTechnology || isOperational)) {
    mapQuadrant = "corporate_operational";
  } else if (!isAutonomous && (isHuman || isHrSpecific)) {
    mapQuadrant = "corporate_human";
  } else {
    mapQuadrant = "corporate_operational";
  }

  return {
    mapQuadrant,
    mapCluster: inferMapCluster(direction),
    mapTags: inferMapTags(direction),
    inferred: true,
  };
}

function inferMapCluster(direction) {
  const label = direction.directionLabel?.toLowerCase() || "";
  const metaDirection = direction.metaDirection?.toLowerCase() || "";
  const category = direction.category;

  if (
    label.includes("cto") ||
    label.includes("vp engineering") ||
    label.includes("technology executive") ||
    label.includes("technical director") ||
    label.includes("technology strategy") ||
    metaDirection.includes("technology executive")
  ) {
    return "technology_executive";
  }

  if (
    label.includes("chief ai") ||
    label.includes("ai transformation") ||
    label.includes("genai") ||
    label.includes("llm") ||
    label.includes("ai product") ||
    metaDirection.includes("ai")
  ) {
    return "ai_transformation";
  }

  if (
    label.includes("enterprise architecture") ||
    label.includes("platform modernization") ||
    label.includes("software") ||
    label.includes("platform") ||
    label.includes("product operations") ||
    category === "Computer & Mathematical"
  ) {
    return "platform_technology";
  }

  if (
    label.includes("engineering leadership") ||
    label.includes("systems engineering") ||
    label.includes("technical program")
  ) {
    return "engineering_leadership";
  }

  if (label.includes("marketplace")) {
    return "marketplace_platforms";
  }

  if (
    label.includes("people analytics") ||
    label.includes("hr tech")
  ) {
    return "people_analytics_hr_tech";
  }

  if (
    label.includes("workforce") ||
    label.includes("talent intelligence") ||
    metaDirection.includes("workforce")
  ) {
    return "workforce_intelligence";
  }

  if (
    label.includes("hr") ||
    label.includes("people operations") ||
    label.includes("talent acquisition") ||
    metaDirection.includes("people, hr") ||
    metaDirection.includes("human resources")
  ) {
    return "people_operations";
  }

  if (
    label.includes("chief of staff") ||
    label.includes("business operations") ||
    label.includes("operations")
  ) {
    return "business_operations";
  }

  if (
    label.includes("consulting") ||
    label.includes("advisor") ||
    label.includes("advisory") ||
    label.includes("independent") ||
    label.includes("fractional")
  ) {
    return "independent_advisory";
  }

  if (
    category === "Management" ||
    label.includes("general management") ||
    label.includes("leadership")
  ) {
    return "enterprise_leadership";
  }

  if (category === "Education & Library") {
    return "learning_workforce_development";
  }

  if (category === "Architecture & Engineering") {
    return "technical_engineering";
  }

  if (category === "Arts, Design & Media") {
    return "creative_content";
  }

  if (category === "Healthcare Practitioners" || category === "Legal") {
    return "regulated_professional";
  }

  if (category === "Installation, Maintenance & Repair") {
    return "trades_field_operations";
  }

  return "business_operations";
}

function inferMapTags(direction) {
  const fields = [
    direction.directionLabel,
    direction.metaDirection,
    direction.category,
    direction.context,
  ];

  return fields
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 8);
}