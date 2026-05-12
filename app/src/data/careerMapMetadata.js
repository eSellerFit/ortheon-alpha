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
  workforce_intelligence: "Workforce Planning / Talent Intelligence",
  people_analytics_hr_tech: "People Analytics / HR Tech",
  ai_transformation: "AI Transformation",
  independent_advisory: "Independent Advisory",
  learning_workforce_development: "Learning / Workforce Development",
  technical_engineering: "Technical / Engineering",
  creative_content: "Creative / Content",
  regulated_professional: "Regulated Professional",
  trades_field_operations: "Trades / Field Operations",
};

export const CAREER_MAP_METADATA = {
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

  "CM-8-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "independent_advisory",
    mapTags: ["operations", "consulting", "advisory", "supply_chain"],
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

  "BF-7-IF": {
    mapQuadrant: "corporate_operational",
    mapCluster: "workforce_intelligence",
    mapTags: ["workforce", "talent_intelligence", "planning", "hr"],
  },

  "BF-8-IF": {
    mapQuadrant: "corporate_operational",
    mapCluster: "people_analytics_hr_tech",
    mapTags: ["people_analytics", "hr_tech", "workforce", "analytics"],
  },

  "CM-5-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "ai_transformation",
    mapTags: ["ai", "transformation", "automation", "consulting"],
  },

  "AE-4-IF": {
    mapQuadrant: "autonomous_operational",
    mapCluster: "technical_engineering",
    mapTags: ["engineering", "technical", "infrastructure", "advisory"],
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
    label.includes("independent") ||
    label.includes("fractional") ||
    label.includes("founder") ||
    label.includes("startup");

  const isHuman =
    category === "Education & Library" ||
    category === "Arts, Design & Media" ||
    label.includes("coach") ||
    label.includes("teacher") ||
    label.includes("training") ||
    label.includes("learning") ||
    label.includes("people") ||
    label.includes("hr") ||
    label.includes("talent");

  const isOperational =
    category === "Computer & Mathematical" ||
    category === "Architecture & Engineering" ||
    category === "Installation, Maintenance & Repair" ||
    label.includes("operations") ||
    label.includes("analytics") ||
    label.includes("platform") ||
    label.includes("systems") ||
    label.includes("supply") ||
    metaDirection.includes("operations") ||
    metaDirection.includes("analytics");

  let mapQuadrant;

  if (isAutonomous && isHuman) {
    mapQuadrant = "autonomous_human";
  } else if (isAutonomous && (isOperational || !isHuman)) {
    mapQuadrant = "autonomous_operational";
  } else if (!isAutonomous && isHuman) {
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

  if (label.includes("marketplace") || label.includes("platform")) {
    return "marketplace_platforms";
  }

  if (
    label.includes("workforce") ||
    label.includes("talent intelligence") ||
    metaDirection.includes("workforce")
  ) {
    return "workforce_intelligence";
  }

  if (
    label.includes("people analytics") ||
    label.includes("hr tech") ||
    label.includes("hr")
  ) {
    return "people_analytics_hr_tech";
  }

  if (label.includes("ai") || label.includes("transformation")) {
    return "ai_transformation";
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