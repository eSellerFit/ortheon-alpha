// app/src/utils/matchingEngineV1/legacyDirectionFamilyMap.js
// Conservative temporary map from legacy roleLibrary direction IDs to
// canonical Direction Family IDs.
//
// This is diagnostic-only. Composite and weak mappings must not masquerade as
// exact canonical family recommendations.

const mappings = [
  ["BF-1-E", "exact", "FC-01", [], "Legacy enterprise financial strategy maps cleanly to corporate finance / FP&A leadership."],
  ["BF-1-IF", "composite", null, ["FC-02", "IP-01"], "Independent financial strategy blends financial advisory and solo advisory practice."],
  ["BF-4-E", "exact", "PO-01", [], "Legacy HR & People Operations enterprise maps to People / HR Leadership."],
  ["BF-5-E", "composite", null, ["WI-01", "WI-04"], "Legacy workforce planning / talent intelligence blends two canonical workforce intelligence families."],
  ["BF-6-E", "composite", null, ["WI-02", "WI-03"], "Legacy people analytics / HR tech blends analytics and HR systems families."],
  ["BF-12-E", "exact", "PO-02", [], "Strategic HR Business Partner / People Partner maps cleanly to HR Business Partnership."],
  ["BF-13-E", "exact", "PO-03", [], "Talent Acquisition Leadership / Recruiting Strategy maps cleanly to Talent Acquisition Leadership."],
  ["BF-14-E", "exact", "PO-04", [], "Organizational Development / Change & HR Transformation maps cleanly to Organizational Development & Change."],
  ["BF-15-E", "exact", "PO-05", [], "Learning & Development / Leadership Development maps cleanly to Learning & Development Leadership."],
  ["BF-16-E", "exact", "PO-06", [], "Total Rewards / Compensation & Benefits maps cleanly to Compensation, Benefits & Total Rewards."],
  ["BF-7-IF", "composite", null, ["IP-01", "FB-01"], "Small business advisory can be advisory practice or service business depending evidence."],
  ["BF-8-IF", "exact", "MP-05", [], "Career / outplacement strategy maps to workforce development / adult learning / career services."],
  ["BF-9-E", "exact", "RC-01", [], "Compliance / Regulatory Operations maps cleanly to Compliance & Regulatory Operations."],
  ["BF-17-E", "exact", "RC-02", [], "Enterprise Risk Management maps cleanly to Enterprise Risk Management."],
  ["BF-18-E", "exact", "RC-03", [], "Privacy / Data Governance / AI Governance maps cleanly to Privacy, Data Governance & AI Governance."],
  ["BF-10-IF", "exact", "MG-02", [], "Corporate communications / PR maps to Brand & Communications."],
  ["BF-11-OV", "exact", "FC-02", [], "Financial planning / wealth management practice maps to Financial Advisory & Wealth Management."],

  ["MG-1-E", "exact", "OD-01", [], "General management / P&L ownership maps most closely to business operations leadership."],
  ["MG-4-ST", "composite", null, ["FB-01", "FB-02"], "Startup leadership can mean several founder/operator models."],
  ["MG-5-NP", "exact", "MP-01", [], "Nonprofit program management maps to Nonprofit Leadership."],
  ["MG-6-E", "exact", "OD-01", [], "Business operations / chief of staff maps to Business Operations Leadership."],
  ["MG-7-IF", "composite", null, ["SA-02", "IP-01"], "Independent management consulting blends consulting delivery and solo practice."],
  ["MG-8-E", "exact", "OD-02", [], "Program / project management maps to Program & Project Leadership."],
  ["MG-9-E", "weak", null, ["FB-03", "OD-01"], "Marketplace/platform operations is not the same as marketplace venture building."],
  ["MG-9-IF", "weak", null, ["FB-03", "IP-01"], "Fractional marketplace/platform operations needs evidence before canonical mapping."],
  ["MG-10-NP", "composite", null, ["MP-01", "CS-03"], "Nonprofit fundraising blends nonprofit leadership and partnerships/development."],
  ["MG-11-OV", "composite", null, ["FB-01", "FB-04"], "Own venture service/local business can map to two founder/operator families."],
  ["MG-12-OV", "composite", null, ["MP-04", "FB-01"], "Social enterprise / impact venture blends mission advisory and founder/operator evidence."],
  ["MG-13-E", "exact", "MP-03", [], "Government / public sector management maps to Public Sector & Government."],

  ["SR-1-E", "exact", "CS-01", [], "Enterprise & complex sales maps to Enterprise Sales Leadership."],
  ["SR-2-E", "exact", "CS-02", [], "Customer success / account management maps to Account Management & Customer Success."],
  ["SR-3-E", "exact", "CS-03", [], "Seller enablement / partner success maps to Business Development & Partnerships."],

  ["CM-2-E", "composite", null, ["DA-01", "DA-02"], "Data science & analytics blends analytics leadership and data science."],
  ["CM-4-ST", "composite", null, ["FB-02", "DX-03"], "AI/ML emerging tech startup blends product venture and AI enablement evidence."],
  ["CM-5-IF", "composite", null, ["DX-03", "SA-04", "IP-01"], "AI transformation consulting blends AI enablement, transformation advisory, and solo practice."],
  ["CM-6-E", "weak", null, ["PT-01", "OD-01"], "Product operations is not enough for Product Management without explicit product ownership."],
  ["CM-7-ST", "weak", null, ["DX-03", "PT-01"], "AI product operations needs clearer ownership before canonical mapping."],
  ["CM-8-IF", "composite", null, ["SA-04", "OD-03"], "Operations/supply chain advisory blends transformation advisory and supply chain."],

  ["TE-1-E", "composite", null, ["PT-02", "IT-01"], "CTO / VP Engineering blends engineering leadership and enterprise IT leadership."],
  ["TE-2-E", "composite", null, ["DX-03", "PT-02"], "Chief AI Officer / AI transformation leadership blends enterprise AI enablement and senior technical/product leadership; use only with clear executive AI ownership evidence."],
  ["TE-3-E", "exact", "DX-01", [], "Technology strategy / digital transformation maps to Digital Transformation Program Leadership."],
  ["TE-4-IF", "composite", null, ["IP-01", "PT-02", "IT-01"], "Fractional CTO / technical advisory blends advisory practice and technology leadership."],
  ["TE-5-E", "composite", null, ["IT-03", "IT-04", "PT-02"], "Enterprise architecture / platform modernization blends infrastructure, systems, and engineering leadership."],
  ["TE-6-E", "exact", "IT-02", [], "Information Security & Cyber Risk Leadership maps cleanly to Information Security & Risk."],
  ["TE-7-E", "exact", "IT-03", [], "Cloud / Infrastructure / DevOps Leadership maps cleanly to Cloud, Infrastructure & DevOps."],
  ["TE-8-E", "exact", "IT-04", [], "Business Systems / Enterprise Applications Leadership maps cleanly to Business Systems & Enterprise Applications."],
  ["TE-9-E", "exact", "DX-02", [], "Business Process Automation Leadership maps cleanly to Business Process Automation."],
  ["TE-10-E", "exact", "DX-03", [], "Enterprise AI Enablement / Adoption Leadership maps cleanly to Enterprise AI Enablement."],

  ["ED-3-IF", "composite", null, ["PO-05", "IP-01"], "Corporate training & L&D independent blends L&D leadership and advisory practice."],
  ["ED-4-IF", "composite", null, ["PO-05", "IP-01"], "Instructional design / e-learning is closest to L&D plus advisory practice."],
  ["ED-5-IF", "composite", null, ["IP-03", "PO-05"], "Executive coaching / leadership development blends creator/expert practice and L&D."],

  ["HC-2-OV", "exact", "SL-03", [], "Therapy & coaching practice maps to Mental Health / Therapy Practice when licensed."],
  ["HC-3-E", "exact", "OD-07", [], "Healthcare administration maps to Healthcare Administration / Care Operations."],

  ["LG-2-IF", "exact", "SL-04", [], "Fractional general counsel maps to Licensed Professional Services."],
  ["LG-3-IF", "weak", null, ["SL-04", "IP-01"], "Mediation/conflict resolution may require licensing or advisory evidence depending context."],

  ["AD-5-IF", "composite", null, ["MG-01", "MG-02", "IP-01"], "Fractional CMO / brand strategy blends marketing leadership, brand, and advisory practice."],
  ["AD-6-IF", "exact", "MG-04", [], "Knowledge management / content strategy maps to Content, SEO & Editorial Strategy."],
  ["AD-7-IF", "exact", "PT-04", [], "UX / product design consulting maps to Design & User Experience."],
  ["AD-8-E", "exact", "MG-01", [], "Marketing / Growth Leadership maps cleanly to Marketing / Growth Leadership."],
  ["AD-9-E", "exact", "MG-03", [], "Performance / Growth Marketing maps cleanly to Performance & Growth Marketing."],
  ["AD-10-E", "exact", "MG-06", [], "Product Marketing / GTM Strategy maps cleanly to Product Marketing / GTM Strategy."],

  ["AE-4-IF", "composite", null, ["PT-03", "IP-01"], "Engineering consulting blends technical craft and solo advisory practice."],
  ["AE-5-E", "composite", null, ["OD-02", "PT-03"], "Technical program management / systems engineering blends program leadership and technical craft."],
  ["IR-1-OV", "composite", null, ["SL-01", "FB-04"], "Skilled trades own venture blends skilled trade practice and local business ownership."],
];

export const legacyDirectionFamilyMap = Object.fromEntries(
  mappings.map(([
    legacyDirectionId,
    mappingConfidence,
    primaryFamilyId,
    supportingFamilyIds,
    notes,
  ]) => [
    legacyDirectionId,
    {
      legacyDirectionId,
      mappingConfidence,
      primaryFamilyId,
      supportingFamilyIds,
      notes,
    },
  ])
);

export function getLegacyDirectionFamilyMapping(legacyDirectionId) {
  if (!legacyDirectionId) {
    return {
      legacyDirectionId: null,
      mappingConfidence: "none",
      primaryFamilyId: null,
      supportingFamilyIds: [],
      notes: "No legacy direction ID provided.",
    };
  }

  return (
    legacyDirectionFamilyMap[legacyDirectionId] || {
      legacyDirectionId,
      mappingConfidence: "none",
      primaryFamilyId: null,
      supportingFamilyIds: [],
      notes: "No conservative canonical mapping exists yet.",
    }
  );
}
