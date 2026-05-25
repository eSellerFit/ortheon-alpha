#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Firestore Target Verify Debug Runner
 *
 * Purpose:
 * Read-only verification of a target assessment document before any manual
 * v3.1 persistence write.
 *
 * Bundle 15C-4 rule:
 * - Read only.
 * - No Firestore writes.
 * - No live AI calls.
 * - No full document data printed.
 */

import { verifyV31FirestoreTargetDocument } from "../../src/v31/persistence/v31FirestorePersistenceAdapter.js";

function parseArgs(argv) {
  return argv.reduce(
    (acc, arg) => {
      if (arg.startsWith("--document-id=")) {
        acc.documentId = arg.slice("--document-id=".length).trim();
        return acc;
      }

      if (arg.startsWith("--collection=")) {
        acc.collectionName = arg.slice("--collection=".length).trim();
        return acc;
      }

      return acc;
    },
    {
      documentId: null,
      collectionName: "assessments",
    }
  );
}

const args = parseArgs(process.argv.slice(2));

if (!args.documentId) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        readOnly: true,
        usage:
          "node scripts/v31/runV31PersistenceTargetVerifyDebug.mjs --document-id=<assessmentDocId> [--collection=assessments]",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
} else {
  const result = await verifyV31FirestoreTargetDocument({
    documentId: args.documentId,
    collectionName: args.collectionName,
    nestedFieldPath: "v31Result",
  });

  const summary = {
    ok: result.ok,
    readOnly: result.readOnly,
    collectionName: result.collectionName,
    documentId: result.documentId,
    nestedFieldPath: result.nestedFieldPath,
    documentExists: result.documentExists,
    hasV31Result: result.hasV31Result,
    hasLegacyDirectionRecommendations:
      result.hasLegacyDirectionRecommendations,
    hasLegacyCareerMap: result.hasLegacyCareerMap,
    hasLegacyPrimaryDirections: result.hasLegacyPrimaryDirections,
    topLevelKeyCount: result.topLevelKeys.length,
    topLevelKeys: result.topLevelKeys,
  };

  console.log(JSON.stringify(summary, null, 2));
}
