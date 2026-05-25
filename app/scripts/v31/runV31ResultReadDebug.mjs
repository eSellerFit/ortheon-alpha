#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Saved Result Read Debug Runner
 *
 * Purpose:
 * Read a compact, safe summary of a persisted v31Result.
 *
 * Bundle 16A rule:
 * - Read only.
 * - No Firestore writes.
 * - No live AI calls.
 * - No full v31Result or legacy result payload printed.
 */

import { readV31FirestoreResultSummary } from "../../src/v31/persistence/v31FirestorePersistenceAdapter.js";

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
          "node scripts/v31/runV31ResultReadDebug.mjs --document-id=<assessmentDocId> [--collection=assessments]",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
} else {
  const summary = await readV31FirestoreResultSummary({
    documentId: args.documentId,
    collectionName: args.collectionName,
    nestedFieldPath: "v31Result",
  });

  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}
