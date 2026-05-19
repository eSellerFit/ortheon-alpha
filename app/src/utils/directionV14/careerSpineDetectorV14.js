// app/src/utils/directionV14/careerSpineDetectorV14.js
// Direction Engine v1.4 — Career Spine Detector
//
// Purpose:
// Identify the user's dominant professional through-line before scoring directions.
// This prevents weak/noise signals from creating random recommendations.

function normalize(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.toLowerCase();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).toLowerCase();
  if (Array.isArray(value)) return value.map(normalize).join(' ');
  if (typeof value === 'object') return Object.values(value).map(normalize).join(' ');
  return '';
}

function countMatches(text, terms = []) {
  return terms.reduce((score, term) => {
    const normalizedTerm = term.toLowerCase();
    if (!normalizedTerm) return score;

    if (text.includes(normalizedTerm)) {
      return score + 1;
    }

    return score;
  }, 0);
}

export const CAREER_SPINES_V14 = [
  {
    id: 'people_hr_talent',
    label: 'People / HR / Talent',
    terms: [
      'human resources',
      'hr',
      'people operations',
      'people partner',
      'talent acquisition',
      'recruiting',
      'recruitment',
      'workforce planning',
      'employee relations',
      'organizational development',
      'leadership development',
      'hr transformation',
      'talent management',
      'performance management',
      'compensation',
      'benefits',
      'culture',
      'evp',
      'employer brand'
    ]
  },
  {
    id: 'marketing_brand_growth',
    label: 'Marketing / Brand / Growth',
    terms: [
      'marketing',
      'brand',
      'growth marketing',
      'demand generation',
      'performance marketing',
      'digital marketing',
      'content marketing',
      'communications',
      'public relations',
      'pr',
      'campaign',
      'crm',
      'lifecycle',
      'retention',
      'go-to-market',
      'gtm',
      'positioning'
    ]
  },
  {
    id: 'sales_business_development',
    label: 'Sales / Business Development',
    terms: [
      'sales',
      'business development',
      'account executive',
      'enterprise sales',
      'partnerships',
      'revenue',
      'pipeline',
      'prospecting',
      'client acquisition',
      'customer acquisition',
      'commercial',
      'deal',
      'quota'
    ]
  },
  {
    id: 'operations_process_execution',
    label: 'Operations / Process / Execution',
    terms: [
      'operations',
      'process',
      'execution',
      'workflow',
      'sop',
      'continuous improvement',
      'project management',
      'program management',
      'supply chain',
      'logistics',
      'fulfillment',
      'vendor management',
      'service delivery',
      'quality assurance'
    ]
  },
  {
    id: 'finance_accounting_risk',
    label: 'Finance / Accounting / Risk',
    terms: [
      'finance',
      'accounting',
      'fp&a',
      'financial planning',
      'financial analysis',
      'budget',
      'forecast',
      'audit',
      'risk',
      'investment',
      'banking',
      'wealth management',
      'cpa',
      'controller',
      'treasury'
    ]
  },
  {
    id: 'legal_compliance',
    label: 'Legal / Compliance',
    terms: [
      'legal',
      'law',
      'attorney',
      'counsel',
      'contract',
      'compliance',
      'regulatory',
      'governance',
      'privacy',
      'policy',
      'risk operations',
      'audit'
    ]
  },
  {
    id: 'education_training_learning',
    label: 'Education / Training / Learning',
    terms: [
      'education',
      'teacher',
      'teaching',
      'training',
      'learning',
      'curriculum',
      'instructional design',
      'facilitation',
      'adult learning',
      'l&d',
      'learning and development',
      'coach',
      'coaching',
      'workforce development'
    ]
  },
  {
    id: 'healthcare_care',
    label: 'Healthcare / Care',
    terms: [
      'healthcare',
      'clinical',
      'patient',
      'nurse',
      'nursing',
      'therapy',
      'therapist',
      'behavioral health',
      'mental health',
      'care',
      'medical',
      'physician',
      'public health'
    ]
  },
  {
    id: 'creative_content_design',
    label: 'Creative / Content / Design',
    terms: [
      'creative',
      'content',
      'copywriting',
      'writing',
      'design',
      'ux',
      'ui',
      'visual',
      'media',
      'video',
      'storytelling',
      'editorial',
      'brand design',
      'graphic'
    ]
  },
  {
    id: 'consulting_advisory',
    label: 'Consulting / Advisory',
    terms: [
      'consulting',
      'consultant',
      'advisor',
      'advisory',
      'fractional',
      'strategy',
      'transformation',
      'client engagement',
      'stakeholder advisory',
      'executive advisory'
    ]
  },
  {
    id: 'entrepreneurship_founder_operator',
    label: 'Entrepreneurship / Founder / Operator',
    terms: [
      'founder',
      'co-founder',
      'entrepreneur',
      'startup',
      'venture',
      'owner',
      'business owner',
      'operator',
      'launched',
      'built company',
      'own business'
    ]
  },
  {
    id: 'skilled_trade_technical_craft',
    label: 'Skilled Trade / Technical Craft',
    terms: [
      'skilled trade',
      'trade',
      'craft',
      'technician',
      'hvac',
      'electrician',
      'plumbing',
      'mechanic',
      'installation',
      'maintenance',
      'repair',
      'apprenticeship',
      'field service'
    ]
  },
  {
    id: 'it_enterprise_systems',
    label: 'Information Technology / Enterprise Systems',
    terms: [
      'information technology',
      'it',
      'enterprise systems',
      'systems administrator',
      'infrastructure',
      'cloud',
      'network',
      'help desk',
      'service desk',
      'it support',
      'erp',
      'crm',
      'salesforce',
      'workday',
      'sap',
      'oracle',
      'systems implementation',
      'technology governance',
      'vendor management'
    ]
  },
  {
    id: 'digital_transformation_automation_ai',
    label: 'Digital Transformation / Automation / AI Enablement',
    terms: [
      'digital transformation',
      'automation',
      'workflow automation',
      'process automation',
      'ai enablement',
      'ai implementation',
      'artificial intelligence',
      'no-code',
      'low-code',
      'internal tools',
      'business process digitization',
      'systems adoption',
      'change management',
      'transformation program'
    ]
  },
  {
    id: 'data_analytics_bi',
    label: 'Data / Analytics / Business Intelligence',
    terms: [
      'data',
      'analytics',
      'business intelligence',
      'bi',
      'dashboard',
      'reporting',
      'kpi',
      'metrics',
      'forecasting',
      'sql',
      'tableau',
      'power bi',
      'looker',
      'data analysis',
      'people analytics',
      'sales analytics',
      'operations analytics'
    ]
  },
  {
    id: 'product_digital_platform',
    label: 'Product / Digital Product / Platform',
    terms: [
      'product manager',
      'product management',
      'product owner',
      'roadmap',
      'feature prioritization',
      'customer discovery',
      'user research',
      'ux research',
      'product analytics',
      'platform',
      'digital product',
      'sprint',
      'backlog',
      'engineering team',
      'design team'
    ]
  },
  {
    id: 'cybersecurity_technology_risk',
    label: 'Cybersecurity / Technology Risk',
    terms: [
      'cybersecurity',
      'security',
      'information security',
      'infosec',
      'soc',
      'security operations',
      'threat',
      'vulnerability',
      'identity access',
      'iam',
      'risk assessment',
      'technology risk',
      'incident response'
    ]
  }
];

function getCompetencyText(competencySignals = []) {
  return competencySignals
    .map((signal) => [
      signal.competencyName,
      signal.signalStrength,
      signal.evidence
    ].filter(Boolean).join(' '))
    .join(' ');
}

function getEvidenceText(evidenceModel = {}) {
  return normalize([
    evidenceModel.careerEvidence?.evidenceText,
    evidenceModel.careerEvidence?.careerSummary,
    evidenceModel.careerEvidence?.domainSignals,
    evidenceModel.careerEvidence?.roleTitles,
    evidenceModel.careerEvidence?.industries,
    evidenceModel.careerEvidence?.senioritySignal,
    evidenceModel.careerEvidence?.leadershipScope,
    evidenceModel.careerEvidence?.entrepreneurialSignals,
    evidenceModel.careerEvidence?.tradeSignals,
    getCompetencyText(evidenceModel.competencySignals)
  ]);
}

function classifySpineScore(score, maxScore) {
  if (score <= 0) return 'absent';
  if (score === maxScore && score >= 3) return 'primary';
  if (score >= 3) return 'secondary';
  if (score >= 1) return 'weak';
  return 'absent';
}

export function detectCareerSpinesV14(evidenceModel = {}) {
  const text = getEvidenceText(evidenceModel);

  const scored = CAREER_SPINES_V14
    .map((spine) => {
      const score = countMatches(text, spine.terms);

      return {
        id: spine.id,
        label: spine.label,
        score,
        matched: spine.terms.filter((term) => text.includes(term.toLowerCase()))
      };
    })
    .sort((a, b) => b.score - a.score);

  const maxScore = scored[0]?.score || 0;

  const primary = [];
  const secondary = [];
  const weakSignals = [];

  scored.forEach((spine) => {
    const classification = classifySpineScore(spine.score, maxScore);

    if (classification === 'primary') primary.push(spine);
    if (classification === 'secondary') secondary.push(spine);
    if (classification === 'weak') weakSignals.push(spine);
  });

  const notes = [];

  if (primary.length === 0 && secondary.length > 0) {
    notes.push('No dominant spine detected; strongest signals are treated as secondary until more evidence is available.');
  }

  if (primary.some((spine) => spine.id === 'product_digital_platform')) {
    notes.push('Product / Digital Product spine requires product ownership evidence; generic digital exposure alone should not create Product Manager recommendations.');
  }

  if (
    secondary.some((spine) => spine.id === 'digital_transformation_automation_ai') ||
    weakSignals.some((spine) => spine.id === 'digital_transformation_automation_ai')
  ) {
    notes.push('Digital transformation may be a standalone spine or a cross-spine enhancer depending on evidence strength.');
  }

  return {
    primary,
    secondary,
    weakSignals,
    scores: scored,
    notes,
    evidenceTextLength: text.length
  };
}

export const careerSpineDetectorV14 = {
  CAREER_SPINES_V14,
  detectCareerSpinesV14
};
