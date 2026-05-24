# Ortheon MVP Cut v3.1 — Isolated Architecture Layer

This folder contains isolated v3.1 data contracts and constants for the Ortheon transferability-first career direction engine.

## Scope

This folder is part of Bundle 1:

- Create isolated v3.1 data contracts
- Define stable object shapes
- Define shared enums/constants
- Avoid production-flow changes

## What v3.1 is

Ortheon v3.1 is a transferability-first career direction engine.

It is not:

- A job-title matcher
- A role-library-led recommender
- A skills-only matching engine
- A fake-precision fit-score generator

## Target engine architecture

v3.1 is expected to use four AI calls:

1. Profile Synthesizer
2. Transferability Mapper
3. Direction Hypothesis Generator
4. Portfolio Critic / Composer

And deterministic guardrails:

- Financial Modeler
- Hard Constraint Engine
- Guardrail Validator
- Quality-over-diversity Validator
- Audit Trail Logger

## Direction output model

Directions should eventually be structured as:

- Direction arena
- Seniority / complexity level
- Work model
- Route type

## Important isolation rule

Files in this folder must not be imported into production flow during Bundle 1.

Do not import from `src/v31` into:

- `src/utils/scoring.js`
- `src/utils/directionV14/directionEngineV14.js`
- `src/components/assessment/ResultsStep.jsx`
- `src/components/assessment/PdfReport.jsx`
- `src/components/assessment/CareerDirectionMap.jsx`
- `src/utils/foundationAdapter/featureFlags.js`

## Current status

Bundle 1 creates contracts only.

No engine logic.
No AI prompts.
No Firestore writes.
No UI integration.
No production result generation.
