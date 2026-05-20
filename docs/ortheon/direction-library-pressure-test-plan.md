# Ortheon Direction Library Pressure-Test Plan

Source methodology: `docs/ortheon/ortheon-direction-family-library-v10-final-candidate.md`

Scope: manual validation plan only. Do not implement matching logic, create scoring rules, edit app code, or edit the library during pressure-testing.

## Purpose

The purpose of pressure-testing is to validate the 69-family Ortheon Direction Family Library against real CVs and profiles before writing matching-engine code.

The test should find:

- False positives: families that look plausible by title or keyword but lack required evidence.
- Missing directions: credible families that the library fails to surface.
- Unrealistic bridge paths: recommendations that name an implausible bridge, omit the bridge, or understate time/cost.
- Bad level resets: recommendations that over-credit native seniority when crossing spines.
- Suppression mistakes: families that should suppress but surface, or strong/adjacent families that suppress too aggressively.

The pressure test is not a scoring exercise. It is a qualitative calibration pass over evidence gates, path types, level bands, credential gates, AI/digital treatment, and suppression logic.

## Recommended First 3 Test Profiles

Start with three profiles that stress the library in different ways:

1. Senior HR / People profile
   - Tests People & Organization, Workforce Intelligence, Mission, Independent Practice, and adjacent Strategy/Advisory paths.
   - Watch for over-surfacing OD, L&D, HRBP, People Analytics, Workforce Planning, Coaching/Expert-Led, and nonprofit/workforce directions.

2. Broad hybrid profile: HR + marketplace + operations + advisory / founder signals
   - Tests cross-spine ambiguity, founder posture, marketplace/product/commercial adjacency, advisory signals, and over-crediting broad experience.
   - Watch for false positives in FB-02, FB-03, IP-01, SA-04, OD-01, CS-03, MG-06, and PT-01.

3. Senior Operations Manager — tech-enabled operations
   - Tests Operations & Delivery, Digital Transformation, RevOps/CS Ops routing, IT/Business Systems adjacency, and level resets into technical or product families.
   - Watch for confusion among OD-01, OD-02, OD-04, CS-04, DX-01, DX-02, IT-04, PT-01, and PT-02.

Run these first before expanding the profile set. They should expose whether the library is too generous, too narrow, or confused around bridge-based paths.

## Expanded 8-10 Profile Set

After the first three, expand to a balanced set of 8-10 real profiles:

1. People / HR leader
   - Senior HR, HRBP, TA, L&D, comp, OD, or people analytics background.
   - Purpose: validate PO and WI boundaries, fractional People paths, and HR-to-mission transitions.

2. Broad operations leader
   - Business operations, program leadership, service delivery, supply chain, manufacturing, or healthcare operations.
   - Purpose: validate OD family distinctions and prevent generic operations from being over-routed into specialized domains.

3. Product / technology profile
   - Product manager, engineering leader, senior technical IC, UX/design, data platform, IT, or cloud/infrastructure profile.
   - Purpose: validate PT, IT, DA, DX, and RC-03 boundaries, especially AI enablement versus AI governance.

4. Marketing / growth profile
   - Marketing leader, brand/comms, performance growth, content/SEO/editorial, lifecycle/CRM, or PMM/GTM profile.
   - Purpose: validate MG sub-family evidence gates and prevent generic marketing from absorbing PMM, lifecycle, or growth specifics.

5. Finance / risk / compliance profile
   - FP&A, corporate finance, wealth/advisory, investing, accounting/audit, compliance, risk, privacy, or AI governance.
   - Purpose: validate FC and RC distinctions, regulated-domain evidence, and audit/compliance/risk false positives.

6. Mission / nonprofit / education profile
   - Nonprofit leader, education administrator, public-sector professional, impact/ESG profile, or workforce development leader.
   - Purpose: validate mission-economy constraints, credential gates, fundraising/board evidence, and corporate-to-mission bridge realism.

7. Founder / operator profile
   - Bootstrapped services founder, software/product founder, marketplace/platform founder, or local/main-street business owner.
   - Purpose: validate founder operating-model distinctions and avoid treating aspiration as founder evidence.

8. Regulated career changer: trade / clinical / licensed path
   - Candidate considering skilled trades, nursing/allied health, therapy, law, CPA, real estate, financial advisory, or similar licensed work.
   - Purpose: validate hard credential gates, restart economics, realistic bridge timelines, and level resets to entry/junior where needed.

9. Broad hard-to-position executive
   - Senior generalist with mixed leadership, strategy, operations, advisory, board, people, and founder signals.
   - Purpose: test suppression discipline and prevent "senior everywhere" recommendations.

10. Early-career or mid-career transitioner
   - Candidate with partial evidence, emerging specialization, internships/projects, bootcamp/certification, or career-change motivation.
   - Purpose: validate junior-level entry, bridge naming, and whether the library can recommend adjacent directions without inflating readiness.

If only eight profiles are available, keep profiles 1-8. Add profiles 9 and 10 when ambiguity and transition behavior need more stress-testing.

## Manual Test Template

Create one filled-out note per profile later. Use this template for each manual pressure test:

### Profile Name

Candidate summary:

- Current / recent role:
- Seniority and scope:
- Industries:
- Years of experience:
- Management scope:
- Notable transitions:

Strong evidence signals:

- Function ownership:
- Measurable outcomes:
- Domain depth:
- Stakeholder altitude:
- Credential / license evidence:
- Tools, systems, or technical depth:

Weak or noisy signals:

- Titles that may overstate scope:
- One-off projects:
- Aspirational interests:
- Generic leadership claims:
- Keyword-only signals:

Financial constraints:

- Minimum income needs:
- Willingness to take a pay cut:
- Runway:
- Equity / variable-comp tolerance:
- Training or credential budget:

Career anchors / motivation signals:

- Desired work texture:
- Values or mission signals:
- Preferred risk level:
- Lifestyle constraints:
- Geographic constraints:
- Founder / independent appetite:

Constraints and credential gates:

- Hard credentials required:
- Soft credentials helpful:
- Jurisdiction-specific requirements:
- Time-to-credential:
- Direct-entry blockers:

Families that should surface:

- Primary direct fits:
- Adjacent fits:
- Bridge-based fits:
- Conditional fits:

Families that should suppress:

- Suppressed family:
- Suppression reason:
- Evidence missing:

Direct / Adjacent / Bridge-based path classification:

- Family:
- Path type:
- Named bridge, if bridge-based:
- Bridge duration:
- Bridge feasibility:

Level band recommendation:

- Native level:
- Recommended entry level by family:
- Level reset rationale:
- Over-leveling risks:

AI durability treatment:

- AI/digital signal type: Standalone / Modifier / Tooling / Aspirational
- Relevant family:
- Durability notes:
- Misclassification risk:

False positives found:

- Family incorrectly surfaced:
- Why it is a false positive:
- Library field implicated:
- Suggested fix:

Missing direction families:

- Family that should have surfaced:
- Evidence supporting it:
- Why it may have been missed:
- Suggested fix:

Recommended library adjustment, if any:

- No change / wording tweak / boundary note / credential note / level logic note / new open question:
- Specific family record affected:
- Proposed adjustment:
- Priority:

## Evaluation Rules

For each profile, evaluate the library against these rules:

- Does the library surface credible directions?
- Does it suppress weak fits?
- Does it avoid title-matching mistakes?
- Does it avoid over-crediting broad experience?
- Are credential gates respected?
- Are bridge paths named and realistic?
- Are level resets honest?
- Are AI/digital signals classified correctly: standalone, modifier, tooling, or aspirational?
- Are direct, adjacent, bridge-based, and conditional paths clearly separated?
- Are financial constraints and restart economics visible where they matter?
- Are founder, independent, and fractional signals treated as work-model evidence rather than generic ambition?
- Are regulated or licensed paths blocked when credentials are absent?
- Are mission-sector paths tested for fundraising, board, public-sector, education, or workforce-domain evidence rather than motivation alone?

## Output Format

This document is only the plan.

For execution, create one pressure-test note per profile later. Each note should:

- Use the manual test template above.
- Include the source CV/profile text or a structured summary.
- List surfaced and suppressed families explicitly.
- Record at least one pass/fail judgment for evidence gates, level band, bridge realism, and suppression quality.
- End with a concise library adjustment recommendation: no change, revise existing record, add boundary note, add open question, or escalate taxonomy decision.

Do not create implementation specs, scoring rules, or automated matching logic until the first manual pressure-test results are reviewed.

Next step: run the first three profiles manually before creating any implementation spec.

