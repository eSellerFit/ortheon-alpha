// validateLibraries.js
// Run before any commit that touches roleLibrary.js or salaryBenchmarks.js
// Usage: node validateLibraries.js
// Pass: all checks green, safe to commit
// Fail: specific errors listed, do not commit until fixed

import { roleLibrary } from './data/roleLibrary.js';
import { salaryBenchmarks } from './data/salaryBenchmarks.js';

const VALID_ANCHOR_IDS = [
  'technical', 'management', 'autonomy', 'security',
  'impact', 'challenge', 'workModel', 'craft'
];

const VALID_D_RATINGS = ['D0', 'D1', 'D2', 'D3', 'D4'];
const VALID_CONTEXT_CODES = ['E', 'SME', 'ST', 'NP', 'IF', 'OV'];
const VALID_TRANSITION_PATHWAYS = ['direct', 'bridge', 'stretch'];
const VALID_STRETCHABILITY = ['low', 'medium', 'high'];
const VALID_GATE_TYPES = ['hard', 'soft'];
const MIN_COMPETENCY_ID = 1;
const MAX_COMPETENCY_ID = 23;

const VALID_DATA_QUALITY = ['bls_validated', 'estimated', 'market_validated'];

let errors = [];
let warnings = [];

function error(msg) { errors.push(`  ✗ ${msg}`); }
function warn(msg)  { warnings.push(`  ⚠ ${msg}`); }

// ─── RULE SET 1: roleLibrary checks ───────────────────────────────────────

console.log('\n─── Validating roleLibrary.js ───');

const roleIds = roleLibrary.map(r => r.directionId);

// 1.1 No duplicate directionIds
const dupRoles = roleIds.filter((id, i) => roleIds.indexOf(id) !== i);
if (dupRoles.length > 0) {
  error(`Duplicate directionIds in roleLibrary: ${[...new Set(dupRoles)].join(', ')}`);
} else {
  console.log('  ✓ No duplicate directionIds');
}

for (const role of roleLibrary) {
  const id = role.directionId || '(missing id)';

  // 1.2 Required top-level fields
  const requiredFields = [
    'directionId', 'version', 'onetCodes', 'onetTitles',
    'category', 'metaDirection', 'context', 'contextCode',
    'directionLabel', 'aiDurabilityRating', 'aiExposureSource',
    'requiredCompetencies', 'preferredCompetencies',
    'dominantAnchors', 'significantAnchors',
    'stretchabilityRequired', 'transitionPathway', 'd4EvolutionPath'
  ];
  for (const field of requiredFields) {
    if (role[field] === undefined || role[field] === null) {
      error(`[${id}] Missing required field: ${field}`);
    }
  }

  // 1.3 financialPathway must NOT be in roleLibrary
  if (role.financialPathway !== undefined) {
    error(`[${id}] financialPathway found in roleLibrary — must be in salaryBenchmarks only`);
  }

  // 1.4 Valid D-rating
  if (!VALID_D_RATINGS.includes(role.aiDurabilityRating)) {
    error(`[${id}] Invalid aiDurabilityRating: '${role.aiDurabilityRating}' — must be D0-D4`);
  }

  // 1.5 Valid contextCode
  if (!VALID_CONTEXT_CODES.includes(role.contextCode)) {
    error(`[${id}] Invalid contextCode: '${role.contextCode}' — must be one of ${VALID_CONTEXT_CODES.join(', ')}`);
  }

  // 1.6 Valid transitionPathway
  if (!VALID_TRANSITION_PATHWAYS.includes(role.transitionPathway)) {
    error(`[${id}] Invalid transitionPathway: '${role.transitionPathway}'`);
  }

  // 1.7 Valid stretchabilityRequired
  if (!VALID_STRETCHABILITY.includes(role.stretchabilityRequired)) {
    error(`[${id}] Invalid stretchabilityRequired: '${role.stretchabilityRequired}'`);
  }

  // 1.8 Competency IDs in valid range
  for (const cid of (role.requiredCompetencies || [])) {
    if (cid < MIN_COMPETENCY_ID || cid > MAX_COMPETENCY_ID || !Number.isInteger(cid)) {
      error(`[${id}] Invalid competency ID in requiredCompetencies: ${cid} (must be integer 1-23)`);
    }
  }
  for (const cid of (role.preferredCompetencies || [])) {
    if (cid < MIN_COMPETENCY_ID || cid > MAX_COMPETENCY_ID || !Number.isInteger(cid)) {
      error(`[${id}] Invalid competency ID in preferredCompetencies: ${cid} (must be integer 1-23)`);
    }
  }

  // 1.9 At least 1 required competency
  if (!role.requiredCompetencies || role.requiredCompetencies.length === 0) {
    error(`[${id}] requiredCompetencies is empty — every direction needs at least 1`);
  }

  // 1.10 Anchor IDs valid
  for (const anchor of (role.dominantAnchors || [])) {
    if (!VALID_ANCHOR_IDS.includes(anchor.anchorId)) {
      error(`[${id}] Invalid anchorId in dominantAnchors: '${anchor.anchorId}'`);
    }
    if (typeof anchor.idealMin !== 'number' || typeof anchor.idealMax !== 'number') {
      error(`[${id}] dominantAnchor '${anchor.anchorId}' missing idealMin/idealMax`);
    }
    if (anchor.idealMin < 1 || anchor.idealMax > 10 || anchor.idealMin > anchor.idealMax) {
      error(`[${id}] dominantAnchor '${anchor.anchorId}' invalid range: ${anchor.idealMin}-${anchor.idealMax}`);
    }
  }
  for (const anchor of (role.significantAnchors || [])) {
    if (!VALID_ANCHOR_IDS.includes(anchor.anchorId)) {
      error(`[${id}] Invalid anchorId in significantAnchors: '${anchor.anchorId}'`);
    }
    if (typeof anchor.idealMin !== 'number' || typeof anchor.idealMax !== 'number') {
      error(`[${id}] significantAnchor '${anchor.anchorId}' missing idealMin/idealMax`);
    }
    if (anchor.idealMin < 1 || anchor.idealMax > 10 || anchor.idealMin > anchor.idealMax) {
      error(`[${id}] significantAnchor '${anchor.anchorId}' invalid range: ${anchor.idealMin}-${anchor.idealMax}`);
    }
  }

  // 1.11 At least 1 dominant anchor
  if (!role.dominantAnchors || role.dominantAnchors.length === 0) {
    error(`[${id}] dominantAnchors is empty — every direction needs at least 1`);
  }

  // 1.12 directionId format check: XX-N-XX
  if (!/^[A-Z]{2,4}-\d{1,2}-[A-Z]{1,3}$/.test(role.directionId || '')) {
    warn(`[${id}] directionId format unexpected — expected pattern like BF-1-E or MG-10-IF`);
  }

  // 1.13 Eligibility gate structure if present
  if (role.eligibility) {
    if (!VALID_GATE_TYPES.includes(role.eligibility.gateType)) {
      error(`[${id}] Invalid eligibility.gateType: '${role.eligibility.gateType}'`);
    }
    if (!Array.isArray(role.eligibility.acceptedCredentials) || role.eligibility.acceptedCredentials.length === 0) {
      error(`[${id}] eligibility.acceptedCredentials is missing or empty`);
    }
    if (!Array.isArray(role.eligibility.acceptedStatuses) || role.eligibility.acceptedStatuses.length === 0) {
      error(`[${id}] eligibility.acceptedStatuses is missing or empty`);
    }
    if (!role.eligibility.reason) {
      error(`[${id}] eligibility.reason is missing`);
    }
  }

  // 1.14 onetCodes must be array with at least 1 entry
  if (!Array.isArray(role.onetCodes) || role.onetCodes.length === 0) {
    error(`[${id}] onetCodes is missing or empty`);
  }

  // 1.15 D0 warning
  if (role.aiDurabilityRating === 'D0') {
    warn(`[${id}] D0 rating — this direction will NEVER be recommended by the engine. Intentional?`);
  }
}

console.log(`  Checked ${roleLibrary.length} directions`);

// ─── RULE SET 2: salaryBenchmarks checks ─────────────────────────────────

console.log('\n─── Validating salaryBenchmarks.js ───');

const salaryIds = salaryBenchmarks.map(s => s.directionId);

// 2.1 No duplicate directionIds
const dupSalary = salaryIds.filter((id, i) => salaryIds.indexOf(id) !== i);
if (dupSalary.length > 0) {
  error(`Duplicate directionIds in salaryBenchmarks: ${[...new Set(dupSalary)].join(', ')}`);
} else {
  console.log('  ✓ No duplicate directionIds');
}

for (const bench of salaryBenchmarks) {
  const id = bench.directionId || '(missing id)';

  // 2.2 Required fields
  const requiredFields = [
    'directionId', 'version', 'lastUpdated', 'validUntil',
    'dataQuality', 'sources', 'financialPathway'
  ];
  for (const field of requiredFields) {
    if (bench[field] === undefined || bench[field] === null) {
      error(`[${id}] salaryBenchmarks missing required field: ${field}`);
    }
  }

  // 2.3 Valid dataQuality
  if (!VALID_DATA_QUALITY.includes(bench.dataQuality)) {
    error(`[${id}] Invalid dataQuality: '${bench.dataQuality}'`);
  }

  // 2.4 financialPathway structure
  const fp = bench.financialPathway || {};
  for (const key of ['months1to3', 'months4to6', 'months7to12', 'avg12month']) {
    if (typeof fp[key] !== 'number' || fp[key] <= 0) {
      error(`[${id}] financialPathway.${key} must be a positive number`);
    }
  }

  // 2.5 avg12month sanity check — should roughly equal weighted average of monthly phases
  if (fp.months1to3 && fp.months4to6 && fp.months7to12 && fp.avg12month) {
    const weightedAvg = (fp.months1to3 * 3 + fp.months4to6 * 3 + fp.months7to12 * 6) / 12;
    const delta = Math.abs(weightedAvg - fp.avg12month) / fp.avg12month;
    if (delta > 0.25) {
      warn(`[${id}] avg12month (${fp.avg12month}) deviates >25% from weighted phase average (${Math.round(weightedAvg)}) — check calculation`);
    }
  }

  // 2.6 At least one source
  if (!Array.isArray(bench.sources) || bench.sources.length === 0) {
    error(`[${id}] sources array is missing or empty`);
  }

  // 2.7 Source structure
  for (const source of (bench.sources || [])) {
    if (!source.name) error(`[${id}] source missing 'name'`);
    if (!source.occupationCode) error(`[${id}] source missing 'occupationCode'`);
    if (!source.occupationTitle) error(`[${id}] source missing 'occupationTitle'`);
    if (typeof source.medianAnnualWage !== 'number' || source.medianAnnualWage <= 0) {
      error(`[${id}] source.medianAnnualWage must be a positive number`);
    }
  }

  // 2.8 validUntil date is in the future
  if (bench.validUntil) {
    const expiry = new Date(bench.validUntil);
    const now = new Date();
    if (expiry < now) {
      warn(`[${id}] validUntil date ${bench.validUntil} is in the past — salary data may be stale`);
    }
  }
}

console.log(`  Checked ${salaryBenchmarks.length} salary entries`);

// ─── RULE SET 3: Cross-library consistency ────────────────────────────────

console.log('\n─── Cross-library consistency ───');

// 3.1 Every role has a matching salary entry
const missingInSalary = roleIds.filter(id => !salaryIds.includes(id));
if (missingInSalary.length > 0) {
  error(`Roles in roleLibrary with NO matching salaryBenchmarks entry:\n    ${missingInSalary.join('\n    ')}`);
} else {
  console.log('  ✓ Every role has a matching salary entry');
}

// 3.2 Every salary entry has a matching role
const missingInRoles = salaryIds.filter(id => !roleIds.includes(id));
if (missingInRoles.length > 0) {
  error(`Entries in salaryBenchmarks with NO matching roleLibrary entry:\n    ${missingInRoles.join('\n    ')}`);
} else {
  console.log('  ✓ Every salary entry has a matching role');
}

// 3.3 Count match
if (roleLibrary.length !== salaryBenchmarks.length) {
  warn(`Library count mismatch — roleLibrary: ${roleLibrary.length}, salaryBenchmarks: ${salaryBenchmarks.length}`);
} else {
  console.log(`  ✓ Library counts match (${roleLibrary.length} directions)`);
}

// ─── SUMMARY ─────────────────────────────────────────────────────────────

console.log('\n─── Validation Summary ───');

if (warnings.length > 0) {
  console.log(`\n⚠  ${warnings.length} warning(s):`);
  warnings.forEach(w => console.log(w));
}

if (errors.length > 0) {
  console.log(`\n✗  ${errors.length} error(s):`);
  errors.forEach(e => console.log(e));
  console.log('\n❌  VALIDATION FAILED — do not commit until all errors are resolved\n');
  process.exit(1);
} else {
  console.log(`\n✅  VALIDATION PASSED — ${roleLibrary.length} directions, all checks green\n`);
  process.exit(0);
}