#!/usr/bin/env node

/**
 * Ortheon MVP Cut v3.1 — Live Pipeline Replay Runner (Firestore Source)
 *
 * Purpose:
 * Read a real Firestore assessment document and run the full v3.1 pipeline
 * against it. Optionally persist the generated V31PipelineResultPayload to
 * assessments/{documentId}.v31Result.
 *
 * Bundle 17B rule:
 * - Debug-only runner.
 * - Reads real Firestore assessment data (not SAMPLE_ASSESSMENT_V31).
 * - Direct API handler calls only.
 * - Dry-run unless explicitly guarded.
 * - No UI or production result-flow integration.
 * - rawAssessment MUST NOT appear in the persisted payload.
 * - No PII, no raw Claude outputs, no secrets in printed output.
 */

import fs from "node:fs";
import path from "node:path";
import { runV31PipelineForAssessmentV31 } from "../../src/v31/pipeline/runV31PipelineForAssessmentV31.js";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    return {
      loaded: false,
      path: envPath,
    };
  }

  const content = fs.readFileSync(envPath, "utf8");

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) return;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });

  return {
    loaded: true,
    path: envPath,
  };
}

function parseArgs(argv) {
  return argv.reduce(
    (acc, arg) => {
      if (arg === "--write") {
        acc.write = true;
        return acc;
      }

      if (arg === "--dry-run") {
        acc.dryRun = true;
        return acc;
      }

      if (arg.startsWith("--document-id=")) {
        acc.documentId = arg.slice("--document-id=".length).trim();
        return acc;
      }

      if (arg.startsWith("--assessment-id=")) {
        acc.assessmentId = arg.slice("--assessment-id=".length).trim();
        return acc;
      }

      return acc;
    },
    {
      write: false,
      dryRun: false,
      documentId: null,
      assessmentId: null,
    }
  );
}

function printUsageAndFail(envLocalLoaded) {
  console.log(
    JSON.stringify(
      {
        envLocalLoaded,
        ok: false,
        usage:
          "node scripts/v31/runV31PipelineReplayFromFirestoreDebug.mjs --document-id=<assessmentDocId> [--assessment-id=<assessmentId>] [--write|--dry-run]",
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}

async function main() {
  const envLoadResult = loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));
  const writeRequested = args.write && !args.dryRun;
  const firestoreWriteEnabled =
    process.env.V31_ENABLE_FIRESTORE_WRITE === "true";

  if (!args.documentId) {
    printUsageAndFail(envLoadResult.loaded);
    return;
  }

  if (writeRequested && !firestoreWriteEnabled) {
    console.log(
      JSON.stringify(
        {
          envLocalLoaded: envLoadResult.loaded,
          documentId: args.documentId,
          assessmentId: args.assessmentId || args.documentId,
          writeRequested,
          firestoreWriteEnabled,
          finalStatus: "failed",
          error:
            "V31_ENABLE_FIRESTORE_WRITE=true is required for real write mode.",
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  const assessmentId = args.assessmentId || args.documentId;

  const cliEnvelope = {
    envLocalLoaded: envLoadResult.loaded,
    documentId: args.documentId,
    assessmentId,
    writeRequested,
    firestoreWriteEnabled,
    dataSource: "firestore",
  };

  const result = await runV31PipelineForAssessmentV31({
    documentId: args.documentId,
    assessmentId,
    write: args.write,
    dryRun: args.dryRun,
    force: false,
    source: "isolated_debug_runner",
  });

  if (!result.ok) {
    console.log(
      JSON.stringify(
        {
          ...cliEnvelope,
          finalStatus: "failed",
          error: result.error,
          ...(result.failedStep ? { failedStep: result.failedStep } : {}),
          ...(result.firestoreRead ? { firestoreRead: result.firestoreRead } : {}),
          ...(result.steps
            ? {
                steps: result.steps,
                totalEstimatedCostUsd: result.totalEstimatedCostUsd,
              }
            : {}),
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  if (result.skipped) {
    console.log(
      JSON.stringify(
        {
          ...cliEnvelope,
          finalStatus: "skipped",
          skipped: true,
          reason: result.reason,
          hasV31Result: result.hasV31Result,
          reportUrl: result.reportUrl,
          firestoreRead: result.firestoreRead,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(
    JSON.stringify(
      {
        ...cliEnvelope,
        finalStatus: "passed",
        steps: result.steps,
        totalEstimatedCostUsd: result.totalEstimatedCostUsd,
        firestoreRead: result.firestoreRead,
        finalPortfolioSummary: result.finalPortfolioSummary,
        pipelineResultPayload: result.pipelineResultPayload,
        persistence: result.persistence,
        reportUrl: result.reportUrl,
      },
      null,
      2
    )
  );
}

try {
  await main();
} catch (error) {
  console.log(
    JSON.stringify(
      {
        finalStatus: "failed",
        error: error.message,
      },
      null,
      2
    )
  );
  process.exitCode = 1;
}
