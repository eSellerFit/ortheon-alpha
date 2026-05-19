// app/src/utils/directionV14/directionGatesV14.js
// Direction Engine v1.4 — Hard Gates
//
// Purpose:
// Apply hard gates after eight-lens evaluation.
// Gates downgrade or suppress directions; they do not simply subtract points.

function addFlag(flags, flag, reason, severity = 'medium') {
  flags.push({ flag, reason, severity });
}

export function applyHardGatesV14({ direction, lensResults }) {
  const flags = [];
  const downgradeReasons = [];

  const careerEvidence = lensResults.careerEvidenceResult;
  const marketCredibility = lensResults.marketCredibilityResult;
  const financialReality = lensResults.financialRealityResult;
  const practicalConstraints = lensResults.practicalConstraintsResult;
  const credentials = lensResults.credentialsGateResult;
  const aiDurability = lensResults.aiDurabilityResult;

  let suppress = false;

  if (!careerEvidence || careerEvidence.score < 25) {
    addFlag(
      flags,
      'insufficient_career_evidence',
      'Career evidence is too weak for a visible recommendation.',
      'high'
    );
    suppress = true;
  }

  if (careerEvidence?.level?.includes('domain_gap')) {
    addFlag(
      flags,
      'domain_credibility_gap',
      'Direction requires domain evidence that is not clearly present.',
      'medium'
    );
    downgradeReasons.push('Domain credibility gap limits this path.');
  }

  if (marketCredibility?.level === 'low_credibility' || marketCredibility?.level === 'credibility_gap') {
    addFlag(
      flags,
      'low_market_credibility',
      'The market may not believe this direction without a bridge or stronger evidence.',
      'high'
    );
    downgradeReasons.push('Market credibility is limited.');
  }

  if (credentials?.level === 'credential_unknown_or_missing') {
    addFlag(
      flags,
      'credential_unknown_or_missing',
      'This path appears credential-dependent, but credential status is missing or unknown.',
      'high'
    );
    downgradeReasons.push('Credential/license gate prevents direct recommendation.');
  }

  if (credentials?.level === 'credential_review_required') {
    addFlag(
      flags,
      'credential_review_required',
      'Credential signals exist but require confirmation before direct recommendation.',
      'medium'
    );
    downgradeReasons.push('Credential/license status needs review.');
  }

  if (financialReality?.level === 'not_viable_now') {
    addFlag(
      flags,
      'income_floor_not_met',
      'Expected 12-month income path appears below the user’s income floor.',
      'high'
    );
    downgradeReasons.push('Financial floor is not met.');
  }

  if (financialReality?.level === 'financially_constrained') {
    addFlag(
      flags,
      'financially_constrained',
      'This path may be financially constrained during transition.',
      'medium'
    );
    downgradeReasons.push('Financial transition risk exists.');
  }

  if (practicalConstraints?.level === 'not_realistic_now') {
    addFlag(
      flags,
      'practical_constraints_block',
      'Practical constraints make this direction unrealistic now.',
      'high'
    );
    downgradeReasons.push('Practical constraints limit feasibility.');
  }

  if (practicalConstraints?.level === 'constrained') {
    addFlag(
      flags,
      'practical_constraints_limit',
      'Practical constraints may require adjustments or a bridge.',
      'medium'
    );
    downgradeReasons.push('Practical constraints require adjustment.');
  }

  if (aiDurability?.rating === 'D0') {
    addFlag(
      flags,
      'ai_exit_risk',
      'AI durability rating indicates declining or exit-risk direction.',
      'high'
    );
    suppress = true;
  }

  if (direction?.transitionCategory === 'credentialed' && credentials?.level !== 'credential_review_required') {
    downgradeReasons.push('Credentialed direction should not be direct without confirmed credentials.');
  }

  return {
    hardGateFlags: flags,
    downgradeReasons,
    suppress
  };
}

export const directionGatesV14 = {
  applyHardGatesV14
};
