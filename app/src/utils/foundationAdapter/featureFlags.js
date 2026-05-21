// src/utils/foundationAdapter/featureFlags.js
// Feature flags for the foundation live integration path.
//
// Phase 2E: flag is OFF. Live behavior is identical to the old scoring.js path.
// To enable: set FOUNDATION_LIVE_SELECTION_ENABLED = true.
// Fallback to scoring.js is automatic on failure or too-few results.

export const FOUNDATION_LIVE_SELECTION_ENABLED = false;

// Minimum number of foundation-selected recommendations required before
// the adapter will use the foundation path. Falls back to scoring.js if fewer.
export const FOUNDATION_MIN_LIVE_COUNT = 2;
