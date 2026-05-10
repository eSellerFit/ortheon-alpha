export const priorityWeightsConfig = [
  {
    id: "competencyFit",
    label: "Competency Fit",
    description:
      "How much the recommendation should depend on what the person can actually do based on CV and competency signals.",
    defaultValue: 35,
  },
  {
    id: "anchorFit",
    label: "Anchor Fit",
    description:
      "How much the recommendation should depend on psychological fit, motivation, values, and career anchors.",
    defaultValue: 35,
  },
  {
    id: "financialViability",
    label: "Financial Viability",
    description:
      "How much the recommendation should respect income needs, runway, bridge role willingness, and retraining resources.",
    defaultValue: 15,
    minimumRecommendedValue: 10,
  },
  {
    id: "roleDurability",
    label: "AI / Role Durability",
    description:
      "How much the recommendation should consider whether a role is durable in an AI-shaped labor market.",
    defaultValue: 15,
  },
];
