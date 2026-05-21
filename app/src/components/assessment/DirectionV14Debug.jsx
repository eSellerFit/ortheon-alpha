// app/src/components/assessment/DirectionV14Debug.jsx
// Internal localhost/debug page for Direction Engine v1.4.
//
// Purpose:
// Test v1.4 career spine detection, candidate directions, eight-lens diagnostics,
// hard gates, suppressed directions, and final calibration without completing
// the full assessment flow.

import { useMemo, useState } from "react";
import { generateDirectionDiagnosticsV14 } from "../../utils/directionV14/directionEngineV14.js";

const SAMPLE_PROFILES = [
  {
    key: "senior-hr",
    label: "Senior HR / People Leader",
    description:
      "Senior HR profile with people leadership, talent strategy, organizational development, and transformation signals.",
    assessment: {
      id: "debug-senior-hr",
      status: "cv_parsed",
      currentRole: "HR Director / Head of People",
      currentIndustry: "Consumer goods / technology-enabled business",
      careerSituation: "Considering senior HR, talent strategy, or transformation directions.",
      anchors: {
        technical: 6,
        management: 8,
        autonomy: 6,
        security: 7,
        entrepreneurial: 4,
        impact: 8,
        challenge: 7,
        workModel: 6,
      },
      financialReality: {
        minimumMonthlyIncome: 9000,
        savingsRunwayMonths: 5,
        toleranceForIncomeDrop: "low",
        householdDependency: "medium",
        needsStableIncome: true,
        needsBenefits: true,
      },
      transitionConstraints: {
        remotePreference: "hybrid",
        workAuthorization: "authorized",
        retrainingWillingness: "medium",
        networkingComfort: "medium",
        salesComfort: "low",
        riskTolerance: "medium",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Senior HR and People leader with experience in human resources, talent acquisition, workforce planning, employer brand, organizational development, leadership development, HR transformation, employee experience, and stakeholder advisory.",
        domainSignals: [
          "human resources",
          "talent acquisition",
          "workforce planning",
          "organizational development",
          "HR transformation",
          "leadership development",
        ],
        roleTitles: [
          "HR Director",
          "Head of People",
          "Talent Strategy Lead",
        ],
        industries: ["consumer goods", "technology", "retail"],
        senioritySignal: "director / head of function",
        leadershipScope:
          "Led HR programs, advised senior stakeholders, managed people processes, talent systems, and organizational change.",
        competencySignals: [
          {
            competencyId: 10,
            competencyName: "People leadership",
            signalStrength: "strong",
            evidence: "Led HR and people programs across multiple functions.",
          },
          {
            competencyId: 11,
            competencyName: "Coaching and development",
            signalStrength: "strong",
            evidence: "Built leadership development and capability programs.",
          },
          {
            competencyId: 1,
            competencyName: "Communication and stakeholder management",
            signalStrength: "strong",
            evidence: "Advised senior leaders and managed HR communication.",
          },
          {
            competencyId: 8,
            competencyName: "Business and financial judgment",
            signalStrength: "moderate",
            evidence: "Connected workforce planning to business priorities.",
          },
        ],
      },
    },
  },
  {
    key: "marketing-growth",
    label: "Marketing / Growth Leader",
    description:
      "Marketing profile with brand, growth, demand generation, lifecycle, and GTM signals.",
    assessment: {
      id: "debug-marketing-growth",
      status: "cv_parsed",
      currentRole: "Marketing Director",
      currentIndustry: "B2B SaaS",
      careerSituation: "Exploring marketing leadership, growth, or fractional advisory.",
      anchors: {
        technical: 5,
        management: 7,
        autonomy: 8,
        security: 4,
        entrepreneurial: 7,
        impact: 7,
        challenge: 8,
        workModel: 7,
      },
      financialReality: {
        minimumMonthlyIncome: 7500,
        savingsRunwayMonths: 8,
        toleranceForIncomeDrop: "medium",
        householdDependency: "low",
        needsStableIncome: false,
        needsBenefits: false,
      },
      transitionConstraints: {
        remotePreference: "remote",
        workAuthorization: "authorized",
        retrainingWillingness: "medium",
        networkingComfort: "high",
        salesComfort: "medium",
        riskTolerance: "medium-high",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Marketing and growth leader with experience in brand strategy, demand generation, lifecycle marketing, digital marketing, campaign management, GTM positioning, customer segmentation, and revenue pipeline support.",
        domainSignals: [
          "marketing",
          "brand",
          "growth marketing",
          "demand generation",
          "digital marketing",
          "go-to-market",
          "positioning",
        ],
        roleTitles: [
          "Marketing Director",
          "Growth Marketing Lead",
          "Brand Strategy Lead",
        ],
        industries: ["B2B SaaS", "technology"],
        senioritySignal: "director",
        leadershipScope:
          "Owned marketing strategy, campaign execution, GTM messaging, and revenue growth initiatives.",
        competencySignals: [
          {
            competencyId: 3,
            competencyName: "Creative and strategic communication",
            signalStrength: "strong",
            evidence: "Built messaging, brand, and campaign strategy.",
          },
          {
            competencyId: 4,
            competencyName: "Strategic thinking",
            signalStrength: "strong",
            evidence: "Owned marketing strategy and GTM positioning.",
          },
          {
            competencyId: 14,
            competencyName: "Client and stakeholder influence",
            signalStrength: "moderate",
            evidence: "Worked with sales, product, and leadership teams.",
          },
        ],
      },
    },
  },
  {
    key: "it-enterprise",
    label: "IT / Enterprise Systems",
    description:
      "IT profile with enterprise systems, infrastructure, cloud, service delivery, and vendor management signals.",
    assessment: {
      id: "debug-it-enterprise",
      status: "cv_parsed",
      currentRole: "IT Manager",
      currentIndustry: "Healthcare services",
      careerSituation: "Exploring IT leadership, enterprise systems, or technology operations.",
      anchors: {
        technical: 9,
        management: 7,
        autonomy: 5,
        security: 8,
        entrepreneurial: 3,
        impact: 6,
        challenge: 6,
        workModel: 5,
      },
      financialReality: {
        minimumMonthlyIncome: 8500,
        savingsRunwayMonths: 4,
        toleranceForIncomeDrop: "low",
        householdDependency: "medium",
        needsStableIncome: true,
        needsBenefits: true,
      },
      transitionConstraints: {
        remotePreference: "hybrid",
        workAuthorization: "authorized",
        retrainingWillingness: "medium",
        networkingComfort: "medium",
        salesComfort: "low",
        riskTolerance: "low",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Information technology manager with experience in enterprise systems, infrastructure, cloud migration, service desk, IT support, ERP, CRM, systems implementation, technology governance, vendor management, and security coordination.",
        domainSignals: [
          "information technology",
          "enterprise systems",
          "infrastructure",
          "cloud",
          "ERP",
          "CRM",
          "systems implementation",
          "technology governance",
        ],
        roleTitles: ["IT Manager", "Enterprise Systems Lead"],
        industries: ["healthcare", "professional services"],
        senioritySignal: "manager / senior manager",
        leadershipScope:
          "Managed IT service delivery, vendor relationships, enterprise applications, and systems implementation projects.",
        competencySignals: [
          {
            competencyId: 9,
            competencyName: "Analytical and systems thinking",
            signalStrength: "strong",
            evidence: "Managed enterprise systems and IT infrastructure.",
          },
          {
            competencyId: 7,
            competencyName: "Compliance and risk awareness",
            signalStrength: "moderate",
            evidence: "Supported security and governance requirements.",
          },
          {
            competencyId: 12,
            competencyName: "Operational execution",
            signalStrength: "strong",
            evidence: "Owned IT delivery, service desk, and vendor execution.",
          },
        ],
      },
    },
  },
  {
    key: "digital-transformation",
    label: "Digital Transformation / Automation",
    description:
      "Business-technology bridge profile with automation, workflow redesign, AI enablement, and change management signals.",
    assessment: {
      id: "debug-digital-transformation",
      status: "cv_parsed",
      currentRole: "Digital Transformation Lead",
      currentIndustry: "Operations / professional services",
      careerSituation: "Exploring digital transformation, automation, and AI enablement.",
      anchors: {
        technical: 7,
        management: 7,
        autonomy: 7,
        security: 5,
        entrepreneurial: 6,
        impact: 8,
        challenge: 8,
        workModel: 6,
      },
      financialReality: {
        minimumMonthlyIncome: 8000,
        savingsRunwayMonths: 6,
        toleranceForIncomeDrop: "medium",
        householdDependency: "medium",
        needsStableIncome: true,
        needsBenefits: false,
      },
      transitionConstraints: {
        remotePreference: "hybrid",
        workAuthorization: "authorized",
        retrainingWillingness: "high",
        networkingComfort: "medium",
        salesComfort: "medium",
        riskTolerance: "medium",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Digital transformation and automation leader working between business and technology. Experience includes workflow automation, process automation, AI enablement, systems adoption, internal tools, change management, and business process digitization.",
        domainSignals: [
          "digital transformation",
          "automation",
          "workflow automation",
          "AI enablement",
          "systems adoption",
          "internal tools",
          "change management",
        ],
        roleTitles: [
          "Digital Transformation Lead",
          "Automation Program Manager",
        ],
        industries: ["professional services", "operations"],
        senioritySignal: "senior manager",
        leadershipScope:
          "Led cross-functional transformation projects, adoption programs, and process redesign initiatives.",
        competencySignals: [
          {
            competencyId: 5,
            competencyName: "Innovation and learning agility",
            signalStrength: "strong",
            evidence: "Introduced automation and AI enablement initiatives.",
          },
          {
            competencyId: 6,
            competencyName: "Project and program management",
            signalStrength: "strong",
            evidence: "Led transformation programs across teams.",
          },
          {
            competencyId: 4,
            competencyName: "Strategic thinking",
            signalStrength: "strong",
            evidence: "Connected digital work to business process outcomes.",
          },
        ],
      },
    },
  },
  {
    key: "skilled-trade-hvac",
    label: "Skilled Trade / HVAC-like",
    description:
      "Technical craft profile with HVAC/maintenance signals and missing credential status to test gates.",
    assessment: {
      id: "debug-skilled-trade",
      status: "cv_parsed",
      currentRole: "Maintenance Technician",
      currentIndustry: "Facilities services",
      careerSituation: "Exploring HVAC, skilled trade, field service, or small business path.",
      anchors: {
        technical: 9,
        management: 5,
        autonomy: 7,
        security: 6,
        entrepreneurial: 6,
        impact: 5,
        challenge: 6,
        workModel: 5,
      },
      financialReality: {
        minimumMonthlyIncome: 6500,
        savingsRunwayMonths: 3,
        toleranceForIncomeDrop: "low",
        householdDependency: "medium",
        needsStableIncome: true,
        needsBenefits: true,
      },
      transitionConstraints: {
        remotePreference: "onsite",
        workAuthorization: "authorized",
        retrainingWillingness: "medium",
        networkingComfort: "medium",
        salesComfort: "low",
        riskTolerance: "medium",
      },
      credentials: {
        licenseStatus: "unknown",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Hands-on technical craft profile with maintenance, repair, field service, installation, facilities operations, troubleshooting, and HVAC exposure. License and apprenticeship status are not confirmed.",
        domainSignals: [
          "maintenance",
          "repair",
          "installation",
          "field service",
          "HVAC",
          "technical craft",
          "facilities",
        ],
        tradeSignals: ["HVAC exposure", "maintenance", "repair", "installation"],
        roleTitles: ["Maintenance Technician", "Field Service Technician"],
        industries: ["facilities services", "property operations"],
        senioritySignal: "specialist / technician",
        leadershipScope:
          "Hands-on technical execution with limited people management.",
        competencySignals: [
          {
            competencyId: 12,
            competencyName: "Operational execution",
            signalStrength: "strong",
            evidence: "Performed field maintenance and repair work.",
          },
          {
            competencyId: 9,
            competencyName: "Troubleshooting and systems thinking",
            signalStrength: "strong",
            evidence: "Diagnosed and resolved technical issues.",
          },
        ],
      },
    },
  },
  {
    key: "high-financial-pressure",
    label: "Career Changer / High Financial Pressure",
    description:
      "General business profile with short runway and high income floor to test financial protection mode.",
    assessment: {
      id: "debug-high-financial-pressure",
      status: "cv_parsed",
      currentRole: "Operations Manager",
      currentIndustry: "Retail operations",
      careerSituation:
        "Recently laid off and considering several transition options, but needs income stability.",
      anchors: {
        technical: 5,
        management: 7,
        autonomy: 5,
        security: 9,
        entrepreneurial: 3,
        impact: 6,
        challenge: 5,
        workModel: 5,
      },
      financialReality: {
        minimumMonthlyIncome: 10000,
        savingsRunwayMonths: 2,
        toleranceForIncomeDrop: "very low",
        householdDependency: "high",
        needsStableIncome: true,
        needsBenefits: true,
      },
      transitionConstraints: {
        remotePreference: "hybrid",
        workAuthorization: "authorized",
        retrainingWillingness: "low",
        networkingComfort: "medium",
        salesComfort: "low",
        riskTolerance: "low",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Operations manager with experience in process improvement, service delivery, vendor management, project management, team leadership, reporting, and execution. Looking for stable next move with minimal income drop.",
        domainSignals: [
          "operations",
          "process improvement",
          "service delivery",
          "vendor management",
          "project management",
          "team leadership",
        ],
        roleTitles: ["Operations Manager", "Service Delivery Manager"],
        industries: ["retail", "services"],
        senioritySignal: "manager",
        leadershipScope:
          "Managed teams, vendors, service delivery, and operational execution.",
        competencySignals: [
          {
            competencyId: 12,
            competencyName: "Operational execution",
            signalStrength: "strong",
            evidence: "Managed daily operations and service delivery.",
          },
          {
            competencyId: 6,
            competencyName: "Project management",
            signalStrength: "strong",
            evidence: "Led process improvement and implementation work.",
          },
          {
            competencyId: 10,
            competencyName: "People leadership",
            signalStrength: "moderate",
            evidence: "Managed frontline teams.",
          },
        ],
      },
    },
  },
  {
    key: "portfolio-consulting",
    label: "Portfolio / Consulting-Oriented",
    description:
      "Senior advisor profile with autonomy, advisory, consulting, and business development comfort.",
    assessment: {
      id: "debug-portfolio-consulting",
      status: "cv_parsed",
      currentRole: "Strategy / Operations Advisor",
      currentIndustry: "Marketplace / small business advisory",
      careerSituation:
        "Considering independent consulting, advisory work, and portfolio career path.",
      anchors: {
        technical: 7,
        management: 6,
        autonomy: 9,
        security: 4,
        entrepreneurial: 8,
        impact: 8,
        challenge: 8,
        workModel: 8,
      },
      financialReality: {
        minimumMonthlyIncome: 7000,
        savingsRunwayMonths: 9,
        toleranceForIncomeDrop: "medium",
        householdDependency: "low",
        needsStableIncome: false,
        needsBenefits: false,
      },
      transitionConstraints: {
        remotePreference: "remote",
        workAuthorization: "authorized",
        retrainingWillingness: "medium",
        networkingComfort: "high",
        salesComfort: "high",
        riskTolerance: "high",
      },
      cvProfile: {
        cvSource: "debug_sample",
        parsed: true,
        careerSummary:
          "Senior operator and advisor with experience in marketplace operations, small business advisory, consulting, strategy, platform operations, seller ecosystem, vendor ecosystem, process design, and founder support.",
        domainSignals: [
          "consulting",
          "advisory",
          "marketplace",
          "platform operations",
          "small business advisory",
          "strategy",
          "seller ecosystem",
          "vendor ecosystem",
        ],
        entrepreneurialSignals: [
          "founder support",
          "business owner advisory",
          "launched advisory services",
        ],
        advisorySignals: ["consulting", "advisor", "client engagement"],
        roleTitles: [
          "Strategy Advisor",
          "Marketplace Operations Lead",
          "Small Business Consultant",
        ],
        industries: ["marketplace", "e-commerce", "small business"],
        senioritySignal: "senior advisor / operator",
        leadershipScope:
          "Advised founders, designed operating systems, and supported marketplace growth.",
        competencySignals: [
          {
            competencyId: 4,
            competencyName: "Strategic thinking",
            signalStrength: "strong",
            evidence: "Built advisory and operating models.",
          },
          {
            competencyId: 14,
            competencyName: "Client relationship management",
            signalStrength: "strong",
            evidence: "Advised clients and founders.",
          },
          {
            competencyId: 15,
            competencyName: "Business development",
            signalStrength: "strong",
            evidence: "Comfortable with client acquisition and consulting.",
          },
        ],
      },
    },
  },
];

function SectionCard({ title, children }) {
  return (
    <section style={styles.card}>
      <h2 style={styles.cardTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Pill({ children, tone = "neutral" }) {
  return (
    <span style={{ ...styles.pill, ...styles.pillTones[tone] }}>
      {children}
    </span>
  );
}

function formatText(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).replaceAll("_", " ");
}

function getClassificationTone(classification) {
  if (classification === "Primary") return "green";
  if (classification === "Adjacent / Nearby") return "blue";
  if (classification === "Bridge-based") return "amber";
  if (classification === "Conditional") return "purple";
  if (classification === "Longer-term") return "gray";
  if (classification === "Suppressed") return "red";
  return "neutral";
}

function getFoundationCandidate(diagnostic, directionId) {
  return diagnostic.matchingEngineV1Foundation?.recommendationCandidates?.find(
    (candidate) => candidate.legacyDirectionId === directionId
  );
}

function DirectionV14Debug() {
  const [selectedKey, setSelectedKey] = useState(SAMPLE_PROFILES[0].key);
  const [showRawJson, setShowRawJson] = useState(false);

  const selectedProfile = SAMPLE_PROFILES.find(
    (profile) => profile.key === selectedKey
  );

  const diagnosticResult = useMemo(() => {
    try {
      return {
        ok: true,
        data: generateDirectionDiagnosticsV14(selectedProfile.assessment, {
          maxCandidates: 20,
          maxRecommendations: 7,
        }),
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }, [selectedProfile]);

  const diagnostic = diagnosticResult.ok ? diagnosticResult.data : null;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Internal debug · Direction Engine v1.4</p>
          <h1 style={styles.title}>Lens-Based Direction Diagnostics</h1>
          <p style={styles.subtitle}>
            Test career spine detection, candidate directions, eight lenses,
            hard gates, suppressed paths, and final calibration without running
            the full assessment flow.
          </p>
        </div>

        <a href="/" style={styles.homeLink}>
          Back to site
        </a>
      </header>

      <SectionCard title="Sample profile">
        <div style={styles.profileGrid}>
          <label style={styles.label}>
            Choose profile
            <select
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value)}
              style={styles.select}
            >
              {SAMPLE_PROFILES.map((profile) => (
                <option key={profile.key} value={profile.key}>
                  {profile.label}
                </option>
              ))}
            </select>
          </label>

          <div style={styles.profileSummary}>
            <h3 style={styles.profileTitle}>{selectedProfile.label}</h3>
            <p style={styles.profileDescription}>
              {selectedProfile.description}
            </p>
            <div style={styles.metaRow}>
              <Pill>Role: {selectedProfile.assessment.currentRole}</Pill>
              <Pill>
                Income floor: $
                {selectedProfile.assessment.financialReality.minimumMonthlyIncome}
                /mo
              </Pill>
              <Pill>
                Runway:{" "}
                {selectedProfile.assessment.financialReality.savingsRunwayMonths}
                mo
              </Pill>
            </div>
          </div>
        </div>
      </SectionCard>

      {!diagnosticResult.ok && (
        <SectionCard title="Error">
          <pre style={styles.errorBox}>
            {diagnosticResult.error?.stack ||
              diagnosticResult.error?.message ||
              String(diagnosticResult.error)}
          </pre>
        </SectionCard>
      )}

      {diagnostic && (
        <>
          <SectionCard title="Engine summary">
            <div style={styles.summaryGrid}>
              <div>
                <p style={styles.mutedLabel}>Engine version</p>
                <strong>{diagnostic.engineVersion}</strong>
              </div>
              <div>
                <p style={styles.mutedLabel}>Stage</p>
                <strong>{diagnostic.stage}</strong>
              </div>
              <div>
                <p style={styles.mutedLabel}>Recommendations</p>
                <strong>{diagnostic.recommendations.length}</strong>
              </div>
              <div>
                <p style={styles.mutedLabel}>Suppressed</p>
                <strong>{diagnostic.suppressedDirections.length}</strong>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Matching Engine v1 foundation diagnostics">
            {diagnostic.matchingEngineV1Foundation ? (
              <>
                <div style={styles.summaryGrid}>
                  <div>
                    <p style={styles.mutedLabel}>Diagnostic mode</p>
                    <strong>
                      {diagnostic.matchingEngineV1Foundation.diagnosticOnly
                        ? "debug-only"
                        : "unknown"}
                    </strong>
                  </div>
                  <div>
                    <p style={styles.mutedLabel}>Evidence signals</p>
                    <strong>
                      {
                        diagnostic.matchingEngineV1Foundation.evidenceSignals
                          .length
                      }
                    </strong>
                  </div>
                  <div>
                    <p style={styles.mutedLabel}>
                      Recommendation candidates
                    </p>
                    <strong>
                      {
                        diagnostic.matchingEngineV1Foundation
                          .recommendationCandidates.length
                      }
                    </strong>
                  </div>
                  <div>
                    <p style={styles.mutedLabel}>Report QA</p>
                    <strong>
                      {diagnostic.matchingEngineV1Foundation.reportQaResult
                        .passed
                        ? "passed"
                        : "blocked"}
                    </strong>
                  </div>
                </div>

                <div style={styles.foundationGrid}>
                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>Canonical registry</h3>
                    <p style={styles.debugLine}>
                      Version:{" "}
                      {formatText(
                        diagnostic.matchingEngineV1Foundation.registryVersion
                      )}
                    </p>
                    <p style={styles.debugLine}>
                      Canonical families:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .canonicalFamilyCount
                      }
                    </p>
                  </div>

                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>Legacy mapping status</h3>
                    <p style={styles.debugLine}>
                      Mapped candidates:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .mappedCandidateCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Unmapped candidates:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .unmappedCandidateCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Composite mappings:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .compositeMappingCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Weak mappings:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation.weakMappingCount
                      }
                    </p>
                  </div>
                </div>

                <div style={styles.foundationGrid}>
                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>Composite resolution</h3>
                    <p style={styles.debugLine}>
                      Resolved composites:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .compositeResolvedCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Unresolved composites:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .compositeUnresolvedCount
                      }
                    </p>
                  </div>

                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>Resolution confidence</h3>
                    <p style={styles.debugLine}>
                      High-confidence resolved:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .highConfidenceCompositeResolvedCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Medium/low-confidence resolved:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .lowConfidenceCompositeResolvedCount
                      }
                    </p>
                  </div>
                </div>

                <div style={styles.foundationGrid}>
                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>Family alignment</h3>
                    <p style={styles.debugLine}>
                      Aligned candidates:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .alignedCandidateCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Cross-spine candidates:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .crossSpineCandidateCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Primary cross-spine candidates:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .primaryCrossSpineCandidateCount
                      }
                    </p>
                  </div>

                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>Alignment QA</h3>
                    <p style={styles.debugLine}>
                      Alignment blocking issues:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .familyAlignmentBlockingCount
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Alignment warnings:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation
                          .familyAlignmentWarningCount
                      }
                    </p>
                  </div>
                </div>

                <div style={styles.foundationGrid}>
                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>CandidateProfile</h3>
                    <p style={styles.debugLine}>
                      Assessment:{" "}
                      {formatText(
                        diagnostic.matchingEngineV1Foundation.candidateProfile
                          .assessmentId
                      )}
                    </p>
                    <p style={styles.debugLine}>
                      Current role:{" "}
                      {formatText(
                        diagnostic.matchingEngineV1Foundation.candidateProfile
                          .cvProfile.currentRole
                      )}
                    </p>
                    <p style={styles.debugLine}>
                      Missing inputs:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation.candidateProfile
                          .missingInputs.length
                      }
                    </p>
                    <p style={styles.debugLine}>
                      AI treatment:{" "}
                      {formatText(
                        diagnostic.matchingEngineV1Foundation.candidateProfile
                          .aiDigitalSignals.treatment
                      )}
                    </p>
                  </div>

                  <div style={styles.foundationPanel}>
                    <h3 style={styles.smallTitle}>ReportQAResult</h3>
                    <p style={styles.debugLine}>
                      Blocking issues:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation.reportQaResult
                          .blockingIssues.length
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Warnings:{" "}
                      {
                        diagnostic.matchingEngineV1Foundation.reportQaResult
                          .warnings.length
                      }
                    </p>
                    <p style={styles.debugLine}>
                      Required fix:{" "}
                      {formatText(
                        diagnostic.matchingEngineV1Foundation.reportQaResult
                          .requiredFix
                      )}
                    </p>
                  </div>
                </div>

                <details style={styles.details}>
                  <summary>Foundation QA details</summary>
                  <pre style={styles.jsonBox}>
                    {JSON.stringify(
                      diagnostic.matchingEngineV1Foundation.reportQaResult,
                      null,
                      2
                    )}
                  </pre>
                </details>
              </>
            ) : (
              <p style={styles.emptyText}>
                Matching Engine v1 foundation diagnostics are not available.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Career spine detection">
            <div style={styles.columns}>
              <div>
                <h3 style={styles.smallTitle}>Primary</h3>
                {diagnostic.careerSpines.primary.length === 0 ? (
                  <p style={styles.emptyText}>No primary spine detected.</p>
                ) : (
                  diagnostic.careerSpines.primary.map((spine) => (
                    <div key={spine.id} style={styles.spineItem}>
                      <strong>{spine.label}</strong>
                      <span>Score: {spine.score}</span>
                      <small>Matched: {spine.matched.join(", ")}</small>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h3 style={styles.smallTitle}>Secondary</h3>
                {diagnostic.careerSpines.secondary.length === 0 ? (
                  <p style={styles.emptyText}>No secondary spine detected.</p>
                ) : (
                  diagnostic.careerSpines.secondary.map((spine) => (
                    <div key={spine.id} style={styles.spineItem}>
                      <strong>{spine.label}</strong>
                      <span>Score: {spine.score}</span>
                      <small>Matched: {spine.matched.join(", ")}</small>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h3 style={styles.smallTitle}>Weak / noise</h3>
                {diagnostic.careerSpines.weakSignals.length === 0 ? (
                  <p style={styles.emptyText}>No weak signals.</p>
                ) : (
                  diagnostic.careerSpines.weakSignals.slice(0, 6).map((spine) => (
                    <div key={spine.id} style={styles.spineItem}>
                      <strong>{spine.label}</strong>
                      <span>Score: {spine.score}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {diagnostic.careerSpines.notes.length > 0 && (
              <div style={styles.noteBox}>
                {diagnostic.careerSpines.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Final calibrated recommendations">
            <div style={styles.directionList}>
              {diagnostic.recommendations.map((item) => {
                const foundationCandidate = getFoundationCandidate(
                  diagnostic,
                  item.directionId
                );
                const alignment = foundationCandidate?.alignmentResult;
                const compositeResolution =
                  foundationCandidate?.compositeResolutionResult;

                return (
                  <article key={item.directionId} style={styles.directionCard}>
                    <div style={styles.directionHeader}>
                      <div>
                        <p style={styles.rank}>#{item.rank}</p>
                        <h3 style={styles.directionTitle}>
                          {item.directionLabel}
                        </h3>
                        <p style={styles.directionMeta}>
                          {item.category} · {item.context} · AI{" "}
                          {item.aiDurabilityRating}
                        </p>
                      </div>

                      <Pill tone={getClassificationTone(item.finalClassification)}>
                        {item.finalClassification}
                      </Pill>
                    </div>

                    <div style={styles.scoreGrid}>
                      <span>Overall: {item.overallLensScore}</span>
                      <span>Candidate: {item.candidateScore}</span>
                      <span>Context: {formatText(item.decisionContext)}</span>
                    </div>

                    {foundationCandidate && (
                      <div style={styles.alignmentBox}>
                        <strong>Family alignment:</strong>{" "}
                        {formatText(alignment?.alignmentStatus)} ·{" "}
                        {formatText(alignment?.recommendedAction)}
                        <div style={styles.debugLine}>
                          Canonical family:{" "}
                          {formatText(
                            foundationCandidate.familyId ||
                              foundationCandidate.canonicalMappingConfidence
                          )}
                          {foundationCandidate.familyName
                            ? ` · ${foundationCandidate.familyName}`
                            : ""}
                        </div>
                        <div style={styles.debugLine}>
                          Family spine:{" "}
                          {formatText(
                            alignment?.familySpineName ||
                              foundationCandidate.familySpineName
                          )}
                        </div>
                        {alignment?.reasons?.length > 0 && (
                          <ul style={styles.reasonList}>
                            {alignment.reasons.map((reason) => (
                              <li key={reason}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {compositeResolution && (
                      <div style={styles.resolutionBox}>
                        <strong>Composite resolution:</strong>{" "}
                        {formatText(compositeResolution.resolutionStatus)} ·{" "}
                        {formatText(compositeResolution.resolutionConfidence)}
                        <div style={styles.debugLine}>
                          Resolved family:{" "}
                          {compositeResolution.resolved
                            ? `${compositeResolution.resolvedFamilyId} · ${compositeResolution.resolvedFamilyName}`
                            : "unresolved"}
                        </div>
                        {compositeResolution.reasons?.length > 0 && (
                          <ul style={styles.reasonList}>
                            {compositeResolution.reasons.map((reason) => (
                              <li key={reason}>{reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {item.calibration.reasons.length > 0 && (
                      <ul style={styles.reasonList}>
                        {item.calibration.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    )}

                    {item.gates.hardGateFlags.length > 0 && (
                      <div style={styles.flagBox}>
                        <strong>Gate flags:</strong>{" "}
                        {item.gates.hardGateFlags
                          .map((flag) => flag.flag)
                          .join(", ")}
                      </div>
                    )}

                    <details style={styles.details}>
                      <summary>Eight-lens diagnostics</summary>
                      <div style={styles.lensGrid}>
                        {Object.entries(item.lensResults).map(([key, value]) => (
                          <div key={key} style={styles.lensItem}>
                            <strong>{formatText(key)}</strong>
                            <span>Level: {formatText(value?.level)}</span>
                            <span>Score: {formatText(value?.score)}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Suppressed directions">
            {diagnostic.suppressedDirections.length === 0 ? (
              <p style={styles.emptyText}>No directions suppressed.</p>
            ) : (
              <div style={styles.directionList}>
                {diagnostic.suppressedDirections.map((item) => (
                  <article key={item.directionId} style={styles.suppressedCard}>
                    <h3 style={styles.directionTitle}>{item.directionLabel}</h3>
                    <p style={styles.directionMeta}>
                      {item.category} · {item.context}
                    </p>
                    <div style={styles.flagBox}>
                      {item.gates.hardGateFlags
                        .map((flag) => `${flag.flag}: ${flag.reason}`)
                        .join(" | ")}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Raw diagnostic JSON">
            <button
              type="button"
              onClick={() => setShowRawJson((current) => !current)}
              style={styles.secondaryButton}
            >
              {showRawJson ? "Hide JSON" : "Show JSON"}
            </button>

            {showRawJson && (
              <pre style={styles.jsonBox}>
                {JSON.stringify(diagnostic, null, 2)}
              </pre>
            )}
          </SectionCard>
        </>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    color: "#18202f",
    padding: "28px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "flex-start",
    maxWidth: 1180,
    margin: "0 auto 20px",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#667085",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    maxWidth: 780,
    margin: "12px 0 0",
    color: "#526071",
    fontSize: 16,
    lineHeight: 1.55,
  },
  homeLink: {
    color: "#2f5f9f",
    textDecoration: "none",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  card: {
    maxWidth: 1180,
    margin: "0 auto 16px",
    background: "#ffffff",
    border: "1px solid #dfe6ef",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: 19,
    letterSpacing: "-0.01em",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 18,
  },
  label: {
    display: "grid",
    gap: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#475467",
  },
  select: {
    width: "100%",
    border: "1px solid #cad5e1",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    background: "#ffffff",
  },
  profileSummary: {
    background: "#f8fafc",
    border: "1px solid #e5eaf1",
    borderRadius: 14,
    padding: 14,
  },
  profileTitle: {
    margin: "0 0 6px",
    fontSize: 18,
  },
  profileDescription: {
    margin: "0 0 12px",
    color: "#526071",
    lineHeight: 1.5,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },
  foundationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 14,
  },
  foundationPanel: {
    border: "1px solid #e5eaf1",
    borderRadius: 14,
    padding: 12,
    background: "#f8fafc",
  },
  debugLine: {
    margin: "6px 0",
    color: "#344054",
    fontSize: 13,
    lineHeight: 1.45,
  },
  mutedLabel: {
    margin: "0 0 4px",
    color: "#667085",
    fontSize: 12,
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  smallTitle: {
    margin: "0 0 10px",
    color: "#344054",
    fontSize: 14,
  },
  spineItem: {
    display: "grid",
    gap: 4,
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e5eaf1",
    background: "#f8fafc",
    marginBottom: 8,
    fontSize: 13,
  },
  noteBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "#fff8e6",
    color: "#7a4b00",
    fontSize: 13,
  },
  directionList: {
    display: "grid",
    gap: 12,
  },
  directionCard: {
    border: "1px solid #dfe6ef",
    borderRadius: 16,
    padding: 16,
    background: "#ffffff",
  },
  suppressedCard: {
    border: "1px solid #f0c4c4",
    borderRadius: 16,
    padding: 16,
    background: "#fffafa",
  },
  directionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  },
  rank: {
    margin: "0 0 4px",
    color: "#667085",
    fontSize: 12,
    fontWeight: 700,
  },
  directionTitle: {
    margin: 0,
    fontSize: 17,
  },
  directionMeta: {
    margin: "6px 0 0",
    color: "#667085",
    fontSize: 13,
  },
  scoreGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    color: "#344054",
    fontSize: 13,
  },
  reasonList: {
    margin: "12px 0 0",
    paddingLeft: 18,
    color: "#344054",
    fontSize: 13,
    lineHeight: 1.5,
  },
  flagBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background: "#fff8e6",
    color: "#7a4b00",
    fontSize: 13,
  },
  alignmentBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background: "#f0f7ff",
    color: "#18416c",
    fontSize: 13,
    border: "1px solid #c7ddf4",
  },
  resolutionBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background: "#f6f4ff",
    color: "#3e2f73",
    fontSize: 13,
    border: "1px solid #d8d0ff",
  },
  details: {
    marginTop: 12,
    fontSize: 13,
  },
  lensGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    marginTop: 10,
  },
  lensItem: {
    display: "grid",
    gap: 4,
    padding: 10,
    border: "1px solid #e5eaf1",
    borderRadius: 12,
    background: "#f8fafc",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "5px 9px",
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid transparent",
  },
  pillTones: {
    neutral: {
      background: "#f2f4f7",
      color: "#344054",
      borderColor: "#e4e7ec",
    },
    green: {
      background: "#ecfdf3",
      color: "#027a48",
      borderColor: "#abefc6",
    },
    blue: {
      background: "#eff8ff",
      color: "#175cd3",
      borderColor: "#b2ddff",
    },
    amber: {
      background: "#fffaeb",
      color: "#b54708",
      borderColor: "#fedf89",
    },
    purple: {
      background: "#f4f3ff",
      color: "#5925dc",
      borderColor: "#d9d6fe",
    },
    gray: {
      background: "#f2f4f7",
      color: "#475467",
      borderColor: "#d0d5dd",
    },
    red: {
      background: "#fef3f2",
      color: "#b42318",
      borderColor: "#fecdca",
    },
  },
  emptyText: {
    color: "#667085",
    fontSize: 13,
    margin: 0,
  },
  secondaryButton: {
    border: "1px solid #cad5e1",
    borderRadius: 12,
    background: "#ffffff",
    padding: "9px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  jsonBox: {
    marginTop: 12,
    maxHeight: 560,
    overflow: "auto",
    background: "#111827",
    color: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    fontSize: 12,
    lineHeight: 1.45,
  },
  errorBox: {
    background: "#fff1f0",
    color: "#9f1d1d",
    borderRadius: 12,
    padding: 12,
    overflow: "auto",
  },
};

export default DirectionV14Debug;
