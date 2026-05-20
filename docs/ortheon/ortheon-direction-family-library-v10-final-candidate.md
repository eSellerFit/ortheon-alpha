# Ortheon Direction Family Library v1.0 Final Candidate — Unified Canonical Library

A note on scope before we begin: a full consolidated library with all 69 families at the field depth we've established is a substantial document. To keep it usable as a reference rather than a wall of text, I'm organizing it in three layers — version metadata and operating principles up front, full family records as the body, and consolidated open-questions and forward path at the end. Per your instructions, I'm preserving strict evidence gates throughout, native-vs-entry level logic in every record, and suppression logic as a product feature.

Because this is the canonical document we'll work from going forward, I'll keep field structure rigorously consistent across all 69 families. Where v0.1, v0.2, or v0.3 used abbreviated records for some families, those are now expanded to the full field set.

Front Matter

Version Stamp

| Field | Value |
| --- | --- |
| Document | Ortheon Direction Family Library |
| Version | v1.0 Final Candidate |
| Status | Ready for pressure-testing against real CVs |
| Family count | 69 families across 16 spines |
| Owner | Gio (George Chakhidze) |
| Entity | eSellerFit LLC (DBA Ortheon) |
| Date | May 2026 |
| Supersedes | v0.1, v0.2, v0.3, v0.4 partial + continuation package |
| Next planned revision | v1.0 Final — after CV pressure-testing complete |

Count Arbitration Note

Earlier source materials referenced 63 families. QA and count arbitration accept 69 as the current canonical count for this final candidate because the consolidated file contains 69 unique current-format family records, no duplicate current family IDs, and no retired historical IDs presented as current records. Future pressure-testing may still lead to explicit merge or removal decisions, but this final candidate does not force the taxonomy back to 63 merely to match the older count.

Audit Trail

v0.1 → v0.2 changes

Added MG-06 (Product Marketing / GTM Strategy)

Added OD-06 (Change Management & Adoption Leadership) — placed in Operations spine, not DX

Added new spine: Risk, Compliance & Governance with three families (RC-01, RC-02, RC-03)

Split SL-02 (Clinical & Health Practice) into three families: Clinical/Allied Health, Mental Health/Therapy, Healthcare Administration

Added MP-05 (Workforce Development / Adult Learning / Career Services)

Strengthened level_logic_notes framework across all families

Added fractional_notes field where fractional work models are relevant

Family count recorded in earlier source materials: 56 → 63. Current v1.0 final candidate count after consolidation and arbitration: 69.

v0.2 → v0.3 changes

Moved Healthcare Administration from SL-04 to OD-07 (reframed as Operations discipline, not clinical sibling)

Renumbered v0.2 SL-05 → v0.3 SL-04 (Licensed Professional Services)

Added junior-tier interchangeability rule across RC-01, RC-02, RC-03 (Specialist and Senior Specialist levels share evidence; diverge at Manager+)

Sharpened MG-06 level_logic_notes for Sales-to-PMM strictness

Updated SL-02 and SL-03 adjacent_families pointers to reference OD-07

Family count recorded in earlier source materials: 63 (unchanged). Current v1.0 final candidate count after consolidation and arbitration: 69.

v0.3 → v0.4 changes

RC-03 ai_durability set to D3 with explicit trajectory note (per Q1 decision)

DX-03 / RC-03 boundary rule formalized and added to both records (per Q2 decision)

CS Ops routing rule documented in CS-04 and OD-04 (per Q3 decision)

MG-06 Specialist-level constraints formalized (per Q4 decision)

New optional field added: title_examples_by_context — populated only where generic titles would be misleading (per Q5 decision); applies to RC-01, RC-02, RC-03, OD-07, MP-02, MP-05, FC-02, SL-01, SL-02, SL-03, SL-04

All previously abbreviated families expanded to full field structure

Family count recorded in earlier source materials: 63 (unchanged). Current v1.0 final candidate count after consolidation and arbitration: 69.

v0.4 partial + continuation → v1.0 Final Candidate changes

Merged the partial canonical v0.4 file with the clean SA-03 → SL-04 continuation package. Replaced the cut-off SA-03 record with the clean rewritten SA-03 record. Removed continuation-package framing and converted the document into one unified v1.0 final candidate for pressure-testing.

Operating Principles

These principles govern every family record. They are not repeated inside each record because they apply universally.

Principle 1 — A recommendation is Direction Family + Level Band + Path Type + Feasibility Envelope. Job titles are optional market examples only. Never the headline.

Principle 2 — Suppression is a product feature, not a failure mode. The matching engine should suppress more often than it surfaces. A family that doesn't fit should not be downgraded into a weaker recommendation; it should be removed from the output.

Principle 3 — Native level ≠ entry level. A person's scope and seniority in their current spine do not transfer one-for-one into an adjacent or far spine. Translation factor penalties are explicit per family.

Principle 4 — Strict evidence gates always. Moving from roles to families does not loosen evidence requirements; it strengthens them. False-positive rules are non-negotiable.

Principle 5 — Credentials are gates, not weights. Hard credentials block direct entry regardless of other strengths. Soft credentials adjust credibility but don't block. Jurisdiction-specific credentials require intake data to evaluate.

Principle 6 — AI/digital signals get four-way treatment. Standalone (substantive tech depth), Modifier (AI/digital used inside another spine), Tooling (generic AI tool use, not evidence), or Aspirational (interest without substance). Aspirational AI signals never produce primary recommendations.

Principle 7 — Bridge-based paths must name the bridge. A Bridge-based recommendation without a specified bridge is a failed recommendation. Suppress it.

Principle 8 — Conditional paths must name the condition. Same rule. "Conditional on something unspecified" is noise.

Principle 9 — Fractional/Independent is a level band, not a duplicate family taxonomy. Substantive families carry fractional_notes where the fractional work model is realistic. The Independent Practice spine (IP-01, IP-02, IP-03) contains only families where the practice itself is the substantive work.

Principle 10 — Founder posture is preserved across industries. FB-01 through FB-04 describe operating models (bootstrapped service, software venture, marketplace/platform, local/main-street). Industry vertical is context, not a separate family.

Field Structure (applies to all 69 families)

Each family record contains the following fields, in this order:

family_id — unique identifier (SPINE-NUMBER format)

spine — which of the 16 spines this family belongs to

direction_family_name — substantive, plain-descriptive name

short_description — one to three sentences capturing the work

work_texture — what doing this work actually feels like

core_evidence_required — non-negotiable evidence for the family

supporting_evidence — patterns that strengthen the recommendation

false_positive_signals — patterns that look like evidence but aren't

level_bands_supported — which level bands this family enters at

level_logic_notes — what qualifies for each level; cross-spine penalties

direct_path_conditions — when this is a Direct path

adjacent_path_conditions — when this is an Adjacent path

bridge_path_conditions — when this is a Bridge-based path; named bridges

credential_gate — controlled vocabulary (None / Soft / Hard / Jurisdiction-Specific) + details

fractional_notes — when fractional/independent work is realistic (where applicable)

ai_digital_treatment — how AI/digital signals are classified for this family

ai_durability — D-scale rating with source flag (evidence_based / judgment_based / mixed)

financial_profile — qualitative + rough income bands

optional_title_examples — 4–6 generic market titles

title_examples_by_context — optional, only where generic titles mislead

adjacent_families — family_ids of natural adjacencies

bridge_families — family_ids that commonly serve as bridges

Spine 1 — People & Organization

PO-01 — People / HR Leadership

| Field | Content |
| --- | --- |
| spine | People & Organization |
| direction_family_name | People / HR Leadership |
| short_description | Senior ownership of the people function — setting people strategy, leading HR teams, partnering with executive leadership on workforce and organizational decisions. |
| work_texture | Cross-functional, high stakeholder management. Mix of strategy, organizational design, employee relations, and executive partnership. Cyclical (review and planning cycles). Crisis-prone (departures, conflicts, restructurings, M&A integration). |
| core_evidence_required | (1) Multi-year ownership of an HR function or major HR sub-function; (2) Direct reports in HR, typically 3+; (3) Executive partnership with C-suite or senior business leaders; (4) Demonstrated work across at least two of: comp/benefits, talent acquisition, employee relations, organizational design, performance management. |
| supporting_evidence | HRBP background scaled into leadership; multiple-company experience; involvement in significant org events (M&A integration, layoffs, restructurings, IPO prep). |
| false_positive_signals | (1) HR Coordinator/Specialist titles without leadership scope; (2) Recruiting-only background — route to PO-03; (3) Office Manager or EA roles with HR responsibilities; (4) Single-function HR (only comp, only L&D) — route to that sub-spine family; (5) "Worked in HR for 10 years" without leadership scope — tenure is not leadership evidence. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Manager: HR Manager with team of 2–5 and function or sub-function ownership; 6–10 years HR experience. Senior Manager: Multi-team HR leadership (10–20 reports) or single-function ownership at significant scale; 10–15 years. Director/Head: HR function ownership at significant business unit or company scale; executive partnership; 12+ years; team of teams. Executive (CHRO/CPO): Board-facing HR leadership at meaningful enterprise scale; 18+ years; prior Director/Head experience. Cross-spine penalty: A Director-level operator from another spine without HR domain depth enters at Manager or Senior Manager, not Director. HR domain is not absorbable from generic leadership. A Senior VP of Marketing entering HR is not recommended at SVP-equivalent level. |
| direct_path_conditions | Current or recent role with HR function ownership; entry at same or one band above native level; same or comparable industry size. |
| adjacent_path_conditions | Coming from HRBP or single-function HR (TA, L&D, Comp) with broader exposure; coming from adjacent operations or strategy role with people-leadership scope; enter at Manager or Senior Manager. |
| bridge_path_conditions | Coming from a non-HR spine with strong people management and organizational design exposure. Likely bridge: HRBP role at Senior Manager level, or interim HR leadership in smaller organization, before entering at Director scope. Named bridge required: "Senior HRBP role for 18–24 months" or "Head of People at sub-100 person company before larger Head of People role." |
| credential_gate | None. credential_details: SHRM-CP/SHRM-SCP or SPHR/PHR are soft credentials. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional Head of People is real and growing for sub-100 person companies. Credibility requires prior in-house People leadership at Director+ level, growth-phase scaling experience, pattern recognition across multiple companies. Fractional CHRO at larger companies is rare and typically requires prior CHRO experience. |
| ai_digital_treatment | Modifier. People analytics or HR systems exposure within HR leadership context strengthens this family but does not redirect to Spine 2. AI tooling for HR work is not standalone evidence. |
| ai_durability | D2 — Stable but Changing. source: mixed. HR leadership work is durable (human-judgment, stakeholder, organizational-political). HR operations and analytics are heavily AI-affected. Leadership tier remains stable. |
| financial_profile | Stable salaried, mid-high income. Manager $110–160K, Senior Manager $140–200K, Director/Head $180–280K, Executive (CHRO) $300K+. Bonuses and equity meaningful at Director+. |
| optional_title_examples | Head of People, VP People, VP Human Resources, CHRO, Director of HR, People Operations Director |
| adjacent_families | PO-02, PO-04, PO-05, WI-01 |
| bridge_families | PO-02 (HR Business Partnership) — most common bridge from generalist or cross-spine entry; PO-03 (Talent Acquisition Leadership) — for recruiting-heavy backgrounds; SA-04 (Transformation Advisory) — for strategy/consulting backgrounds with people focus |

PO-02 — HR Business Partnership

| Field | Content |
| --- | --- |
| spine | People & Organization |
| direction_family_name | HR Business Partnership |
| short_description | Embedded HR work supporting a specific business line — advising leaders, navigating organizational dynamics, applying HR practices in business context. |
| work_texture | Relational and embedded. Sits inside business units, partnering with line managers. Case-by-case work mixed with cyclical processes (reviews, planning, headcount). Politically sensitive. |
| core_evidence_required | (1) Embedded HRBP scope supporting a specific business or function; (2) Direct relationships with line managers and business leaders; (3) Case-based work involving organizational, performance, or employee relations matters; (4) Cycle ownership for the supported business (reviews, planning, comp cycle). |
| supporting_evidence | Prior HR generalist or specialist work; coaching certification; organizational behavior background; experience supporting multiple business types. |
| false_positive_signals | (1) HR Generalist labeled as HRBP without business-partnership scope; (2) "Worked with managers" — proximity is not partnership; (3) Recruiting-focused work labeled as HRBP — route to PO-03; (4) HR coordinator work scaled up retroactively. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Senior Specialist: HRBP supporting a small business or function; 3–7 years experience. Manager: Senior HRBP supporting larger function or multiple smaller ones; 7–12 years. Senior Manager: HRBP leadership across business units; 10–15 years. Director/Head: HRBP function leadership at scale. Cross-spine penalty: Significant — line management experience does not translate to HRBP. Cross-spine entrants typically enter at Senior Specialist with HR domain-building required. |
| direct_path_conditions | Current HRBP role; entry at same level; same or comparable industry. |
| adjacent_path_conditions | Coming from HR generalist or single-function HR with business-partnership exposure — enter at Senior Specialist or Manager. |
| bridge_path_conditions | Coming from line management with people-development focus: bridge through HR Generalist or HRBP role at smaller organization for 18–24 months. Coming from coaching: bridge through HRBP role with credentialing. |
| credential_gate | None. credential_details: SHRM credentials are soft signals. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional HRBP is uncommon — the embedded nature of the work makes it hard to fractionalize. Fractional People support more commonly takes the form of PO-01 (Head of People) fractional at smaller companies. |
| ai_digital_treatment | Modifier. AI tools are reshaping employee-relations documentation, case management, and performance work. Fluency is increasingly relevant but doesn't substitute for partnership skill. |
| ai_durability | D3 — Durable. source: judgment_based. HRBP work is heavily relational and judgment-based; resistant to automation. |
| financial_profile | Stable salaried, mid income. Senior Specialist $95–135K, Manager $120–170K, Senior Manager $150–210K, Director/Head $190–260K. |
| optional_title_examples | HR Business Partner, Senior HRBP, HRBP Manager, Director of HR Business Partners, Head of HRBP |
| adjacent_families | PO-01, PO-04, PO-05 |
| bridge_families | PO-01 (HR Leadership) — common progression; PO-04 (OD & Change) — for HRBPs specializing into OD work |

PO-03 — Talent Acquisition Leadership

| Field | Content |
| --- | --- |
| spine | People & Organization |
| direction_family_name | Talent Acquisition Leadership |
| short_description | Building and running hiring engines — sourcing, recruiting operations, talent brand, hiring strategy, candidate experience. |
| work_texture | High-volume, metric-driven, operationally intense. Mix of strategy (workforce hiring plans, employer brand) and execution (pipeline, interviews, offers). Cross-functional partnership with hiring managers and finance. |
| core_evidence_required | (1) Hiring ownership at scale — multiple-team or multiple-business-unit recruiting; (2) Recruiting team or process leadership; (3) Measurable hiring outcomes (time-to-fill, quality of hire, diversity, cost-per-hire); (4) Sourcing or talent-brand strategy ownership. |
| supporting_evidence | Background spanning corporate and agency recruiting; experience scaling hiring through growth phases; employer brand or talent intelligence work. |
| false_positive_signals | (1) Recruiter labeled as TA Leader without leadership scope; (2) Hiring manager who "did a lot of recruiting" — hiring participation is not TA function ownership; (3) HR generalist with recruiting exposure — route to PO-01 or PO-02. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Manager: TA Manager with team of recruiters and function ownership for a business line. Senior Manager: Multi-team TA leadership or specialty (executive search, tech recruiting). Director/Head: TA function ownership at company scale. Executive (VP Talent / CTAO): Enterprise TA leadership at large or fast-scaling companies. Cross-spine penalty: Large from non-HR spines; even strong line management experience doesn't translate. |
| direct_path_conditions | Current TA leadership role; entry at same level; same hiring scale or comparable. |
| adjacent_path_conditions | Coming from agency leadership with strong in-house exposure — enter at Manager level. Coming from HRBP with TA specialization — enter at Senior Manager. |
| bridge_path_conditions | Coming from non-TA HR backgrounds (Comp, L&D): bridge through TA Senior Manager role with hiring-scale ownership for 12–18 months. Coming from sales or operations leadership wanting TA: bridge through TA Manager role first. |
| credential_gate | None. credential_details: SHRM-CP/SCP, AIRS certifications are soft. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Talent is a real model for early-stage companies in hiring-growth phases. Typically Director-equivalent prior experience required. Often paired with embedded recruiter for delivery. |
| ai_digital_treatment | Modifier and increasingly core. AI is transforming sourcing, screening, and candidate communication. AI fluency increasingly expected; AI tooling alone doesn't establish TA leadership. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index shows recruiting and HR tasks as heavily exposed). Execution layer being transformed; leadership and senior hiring judgment durable. |
| financial_profile | Stable salaried, mid-high income. Manager $100–150K, Senior Manager $130–190K, Director/Head $170–260K, Executive (VP Talent) $260–400K+. Tech industry premium meaningful. |
| optional_title_examples | Head of Talent Acquisition, VP Talent, Director of Recruiting, Director of Talent, Chief Talent Officer |
| adjacent_families | PO-01, PO-02, WI-04 |
| bridge_families | PO-01 (HR Leadership) — for TA leaders broadening; WI-04 (Talent Intelligence) — for TA leaders specializing into market intelligence |

PO-04 — Organizational Development & Change

| Field | Content |
| --- | --- |
| spine | People & Organization |
| direction_family_name | Organizational Development & Change |
| short_description | Designing how organizations work — structure, culture, change programs, organizational interventions, leadership development at the system level. |
| work_texture | Strategic and program-shaped. Mix of design work (org models, operating models, culture frameworks), intervention work (change programs, team interventions), and executive partnership. |
| core_evidence_required | (1) OD program or intervention ownership — not just participation; (2) Organizational design work — structural or operating model design; (3) Change initiative leadership with measurable outcomes; (4) Executive partnership on org-level issues. |
| supporting_evidence | OD-specific graduate work (MA-OD, MS-OB); consulting background with OD practice; prior HR leadership with OD focus; psychology or organizational behavior background. |
| false_positive_signals | (1) "Worked on culture initiatives" without ownership; (2) Change communication labeled as OD; (3) Training delivery labeled as OD; (4) HR generalist with culture project exposure — route to PO-01 or PO-02. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: OD practitioner with intervention ownership in specific areas. Manager: OD program ownership across functions. Senior Manager: Enterprise OD function or major program leadership. Director/Head: OD function or Chief Talent/Culture Officer-equivalent. Cross-spine penalty: Significant from line management. OD requires specific methodological depth that doesn't transfer from generic leadership. |
| direct_path_conditions | Current OD role with intervention or program ownership; entry at same level. |
| adjacent_path_conditions | Coming from PO-01 (HR Leadership) with OD specialization — enter at Senior Specialist or Manager. Coming from SA-04 (Transformation Advisory) with OD focus — enter at Manager. Coming from PO-05 (L&D) with broader org-design work — enter at Senior Specialist. |
| bridge_path_conditions | Coming from generic HR backgrounds: bridge through OD-specific role plus credential (or graduate work) for 18–30 months. Coming from line management: bridge through OD certificate plus practitioner role first. |
| credential_gate | Soft. credential_details: NTL Institute, OD Network certifications, OD-focused graduate work are weighted soft credentials. typical_time_to_credential: 6–24 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional OD consultant is a real and established model. Practice-building often follows post-corporate OD leadership. Adjacent to IP-01 (Solo Advisory Practice). |
| ai_digital_treatment | Modifier. AI tools assist with culture analysis and survey work; OD intervention work remains human-systems work. AI fluency marginal. |
| ai_durability | D3 — Durable. source: judgment_based. OD work is heavily relational and judgment-based. |
| financial_profile | Stable salaried, mid-high income. Senior Specialist $110–150K, Manager $140–190K, Senior Manager $170–230K, Director/Head $210–300K. Consulting-side OD work has higher upside through SA-04 and IP-01 paths. |
| optional_title_examples | OD Consultant, Senior OD Consultant, Director of Organizational Development, Head of OD, Chief Culture Officer |
| adjacent_families | PO-01, PO-05, OD-06, SA-04 |
| bridge_families | PO-01 (HR Leadership) — common origin; SA-04 (Transformation Advisory) — for consulting-side path; OD-06 (Change Management) — for change-focused specialization |

PO-05 — Learning & Development Leadership

| Field | Content |
| --- | --- |
| spine | People & Organization |
| direction_family_name | Learning & Development Leadership |
| short_description | Building capability across organizations — learning strategy, leadership development, enablement programs, capability frameworks. |
| work_texture | Program-shaped and content-heavy. Mix of strategy (capability frameworks, learning architecture), design (curriculum, programs, modalities), and delivery oversight. Partnership with business leaders for capability alignment. |
| core_evidence_required | (1) L&D function or major program ownership; (2) Curriculum or capability framework development; (3) Measurable learning outcomes (capability uplift, adoption, retention); (4) Multi-modality work (live, digital, on-demand, social learning). |
| supporting_evidence | Instructional design background; adult learning credentials; prior learning leadership at scale; learning technology fluency. |
| false_positive_signals | (1) Trainer or facilitator labeled as L&D Leader; (2) "Designed training for my team" without program scope; (3) HR generalist with L&D exposure; (4) Coaching background labeled as L&D — route to IP-03 or remain in coaching context. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: L&D specialist with program ownership in a domain. Manager: L&D team or multi-program ownership. Senior Manager: L&D function for business unit or specialty (leadership development, technical training). Director/Head: L&D function ownership at company scale. Cross-spine penalty: Significant from non-HR spines; even strong training delivery background needs L&D-domain strategic work to enter at Manager+. |
| direct_path_conditions | Current L&D leadership role; entry at same level. |
| adjacent_path_conditions | Coming from PO-04 (OD&C) with learning specialization — enter at Manager. Coming from PO-01 (HR Leadership) with L&D focus — enter at Senior Manager. Coming from MP-05 (Workforce Development) with corporate transition — enter at Senior Specialist or Manager. |
| bridge_path_conditions | Coming from trainer or instructional designer roles: bridge through L&D Manager role with program ownership for 18–24 months. Coming from non-HR backgrounds: bridge through Senior L&D Specialist role first. |
| credential_gate | Soft. credential_details: ATD CPLP, CPTD, instructional design credentials, adult learning credentials. typical_time_to_credential: 3–12 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Learning is a real model for early-stage or growth-phase companies. Typically Director-equivalent prior experience required. Also adjacent to IP-01 advisory work. |
| ai_digital_treatment | Modifier and increasingly core. AI is rapidly transforming L&D — personalized learning, AI tutoring, content generation, adaptive paths. AI fluency strongly relevant; AI tooling alone doesn't establish L&D leadership. |
| ai_durability | D2 — Stable but Changing. source: mixed. L&D execution heavily AI-transformed; strategic L&D leadership and capability-design work remain durable. |
| financial_profile | Stable salaried, mid income. Senior Specialist $95–135K, Manager $120–170K, Senior Manager $150–210K, Director/Head $190–280K. |
| optional_title_examples | Head of L&D, VP Learning, Director of Learning, Chief Learning Officer, Head of Leadership Development |
| adjacent_families | PO-01, PO-04, MP-05 |
| bridge_families | PO-04 (OD & Change) — for OD-leaning paths; MP-05 (Workforce Development) — for mission-economy pivots; IP-03 (Expert-Led Practice) — for content-strong learning leaders pivoting independent |

PO-06 — Compensation, Benefits & Total Rewards

| Field | Content |
| --- | --- |
| spine | People & Organization |
| direction_family_name | Compensation, Benefits & Total Rewards |
| short_description | Designing pay, benefits, equity, and total-rewards systems — comp strategy, plan design, benefits architecture, equity programs. |
| work_texture | Quantitative and policy-shaped. Mix of analytical work (market data, internal equity, modeling), design (plans, structures, equity), and execution (cycles, communications, compliance). Cyclical (annual comp cycle, benefits renewal). |
| core_evidence_required | (1) Comp or total rewards function or major sub-function ownership; (2) Plan design experience — comp structures, incentive plans, equity programs, benefits design; (3) Market data and benchmarking fluency; (4) Regulatory familiarity (FLSA, ERISA, equity tax treatment). |
| supporting_evidence | CCP or comparable credentials; actuarial or quantitative background; M&A integration experience involving comp harmonization; equity-plan experience at growth-stage tech. |
| false_positive_signals | (1) HR generalist with comp exposure; (2) Finance background with payroll exposure — payroll is FC-04 territory; (3) "Worked with benefits broker" — broker collaboration is not benefits design; (4) Compensation analyst without plan design scope. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: comp analyst with plan-design involvement. Manager: comp manager with plan ownership for a function or geography. Senior Manager: total rewards leadership for a business unit. Director/Head: total rewards function ownership. Cross-spine penalty: Significant — comp is a specialized domain. Even Finance backgrounds enter at Senior Specialist without specific comp work. |
| direct_path_conditions | Current comp/total rewards role; entry at same level. |
| adjacent_path_conditions | Coming from FC-01 (Corporate Finance) with comp exposure — enter at Senior Specialist or Manager. Coming from PO-01 (HR Leadership) with comp specialization — enter at Manager. |
| bridge_path_conditions | Coming from non-comp HR backgrounds: bridge through Comp Analyst or Manager role plus CCP credential for 18–24 months. |
| credential_gate | Soft. credential_details: CCP (Certified Compensation Professional), CEBS, GRP are recognized. typical_time_to_credential: 6–18 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional comp advisor is a real model, especially for growth-stage companies harmonizing pay structures or designing equity plans. Adjacent to IP-01 advisory work. |
| ai_digital_treatment | Modifier. AI tools are reshaping comp benchmarking and pay equity analysis. AI fluency increasingly relevant. |
| ai_durability | D2 — Stable but Changing. source: mixed. Analytical and benchmarking work being transformed; plan design and executive partnership durable. |
| financial_profile | Stable salaried, mid-high income. Senior Specialist $100–140K, Manager $130–180K, Senior Manager $160–220K, Director/Head $200–290K. |
| optional_title_examples | Compensation Manager, Director of Total Rewards, Head of Compensation, VP Total Rewards |
| adjacent_families | PO-01, FC-01, WI-02 |
| bridge_families | PO-01 (HR Leadership); FC-01 (Corporate Finance) — for finance entrants; WI-02 (People Analytics) — for analytics-leaning comp specialists |

Spine 2 — Workforce Intelligence / Talent Strategy

WI-01 — Workforce Planning & Talent Strategy

| Field | Content |
| --- | --- |
| spine | Workforce Intelligence / Talent Strategy |
| direction_family_name | Workforce Planning & Talent Strategy |
| short_description | Forward-looking design of an organization's workforce — modeling capacity, capability gaps, scenario-planning workforce needs, translating business strategy into talent strategy. |
| work_texture | Analytical, planning-oriented, strategic. Quarterly or annual cycles tied to business planning. Cross-functional with Finance (headcount), HR (talent), business units (capacity). Less crisis-driven than HR Leadership; more cyclical and project-based. |
| core_evidence_required | (1) Workforce planning ownership — capacity, capability, or scenario modeling work consumed by senior leadership; (2) Quantitative or structured analytical orientation; (3) Bridge between business strategy and people function — evidence of working in both registers; (4) Multi-year horizon work, not just annual headcount budgeting. |
| supporting_evidence | People analytics experience; HR systems familiarity; strategic planning or FP&A adjacency; consulting background with workforce focus. |
| false_positive_signals | (1) Annual headcount budgeting alone — FP&A work, not workforce planning; (2) HRBP work labeled "strategic" — relational, not planning; (3) Recruiting forecasting alone — TA operations; (4) People analytics dashboards without strategic decision involvement — WI-02, not WI-01. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: workforce planning practitioner with project ownership. Manager: workforce planning function for business unit. Senior Manager: enterprise workforce planning or multi-program leadership. Director/Head: workforce planning function or Chief People Strategist-equivalent. Cross-spine penalty: Moderate from FP&A (FC-01) — financial planning is adjacent but not equivalent. Significant from generic HR. |
| direct_path_conditions | Current role with explicit workforce planning ownership and senior leadership consumption; entry at same level. |
| adjacent_path_conditions | Coming from WI-02 (People Analytics) with strategic exposure; from FC-01 (FP&A) with people-domain exposure; from SA-01 (Corporate Strategy) with talent focus. Enter at Manager or Senior Manager. |
| bridge_path_conditions | Coming from general HR leadership without analytical depth: bridge through People Analytics role or workforce-planning project sponsorship for 12–18 months. Coming from pure analytics without HR domain: bridge through People Analytics role first. |
| credential_gate | None. credential_details: SHRM, HCI workforce planning certifications, analytics credentials are soft. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional workforce strategist is emerging, especially for growth-stage companies and PE-backed portfolios. Credibility requires prior Director-equivalent workforce planning experience plus methodology depth. |
| ai_digital_treatment | Core and increasing. Workforce planning increasingly uses scenario modeling, talent market data, AI-assisted forecasting. Strong AI/analytics fluency strengthens this family materially. |
| ai_durability | D3 — Durable. source: mixed. Judgment work durable; modeling work being heavily augmented. |
| financial_profile | Stable salaried, mid-high income. Senior Specialist $110–150K, Manager $140–190K, Senior Manager $170–230K, Director/Head $210–300K. |
| optional_title_examples | Head of Workforce Planning, Director of Talent Strategy, VP Strategic Workforce Planning, Workforce Strategy Lead |
| adjacent_families | WI-02, WI-03, PO-01, SA-01 |
| bridge_families | WI-02 (People Analytics); PO-01 (HR Leadership); SA-01 (Corporate Strategy) |

WI-02 — People Analytics

| Field | Content |
| --- | --- |
| spine | Workforce Intelligence / Talent Strategy |
| direction_family_name | People Analytics |
| short_description | Quantitative analysis of the workforce — measurement frameworks, data infrastructure, analytical outputs that inform people decisions. |
| work_texture | Project-based mixed with ongoing reporting. Stakeholders are HR leaders, business leaders, sometimes executives. Heavy technical work (SQL, statistical methods, increasingly ML) combined with HR domain knowledge and communication. |
| core_evidence_required | (1) Demonstrable analytical work specifically in people/HR domain; (2) Technical depth — SQL minimum, often Python/R, statistical methods; (3) HR domain knowledge — employee lifecycle, comp, engagement, attrition; (4) Outputs consumed by HR or business leadership. |
| supporting_evidence | Analytics or data science background with HR pivot; HR background with quantitative graduate work; HR Tech vendor work with analytical exposure. |
| false_positive_signals | (1) "Built dashboards in HR" — could be operational reporting without analytical substance; (2) Used HR analytics tools (Visier, Tableau) without designing analyses; (3) Survey administration without analysis; (4) Pure data science without HR domain — route to DA-02. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: entry analyst with project work. Senior Specialist: strong IC with cross-functional projects. Manager: people analytics manager with team ownership. Senior Manager: people analytics function leadership. Director/Head: enterprise people analytics function. Cross-spine penalty: From DA-02 (Data Science): small if HR domain interest evident; otherwise route to DA-02. From PO spines: bridge required (technical depth must be built). |
| direct_path_conditions | Current people analytics role with ownership; technical and domain evidence both present; entry at same level. |
| adjacent_path_conditions | From BI/analytics with HR domain pivot evidence; from HR Tech with analytical work; from data science with HR project exposure. Enter at Specialist or Senior Specialist if domain depth thin. |
| bridge_path_conditions | Pure HR background without technical depth: bridge through analytics credential plus project ownership for 12–18 months. Pure analytics background without HR domain: bridge through HR Tech role or HRBP-with-analytics scope. |
| credential_gate | None. credential_details: HR Analytics certifications (HCI, AIHR) are soft signals; statistical/data science credentials add credibility. typical_time_to_credential: 3–12 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional People Analytics is uncommon but emerging for early-stage companies. Typically delivered as project-based advisory rather than ongoing fractional role. |
| ai_digital_treatment | Core. Sits at intersection of HR and data; AI tools reshaping the work directly. Strong AI fluency strengthens the family. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: analyst roles heavily exposed, with substantial augmentation). Junior analytical work most exposed; senior interpretive and stakeholder work more durable. |
| financial_profile | Stable salaried, mid-high income. Specialist $90–120K, Senior Specialist $110–150K, Manager $140–180K, Senior Manager $170–220K, Director $220–300K. Tech and finance premium. |
| optional_title_examples | People Analytics Manager, Head of People Analytics, Director of HR Analytics, Workforce Analytics Lead |
| adjacent_families | WI-01, WI-03, DA-01, DA-02 |
| bridge_families | WI-03 (HR Tech); DA-02 (Data Science); PO-01 (HR Leadership) |

WI-03 — HR Technology & Systems

| Field | Content |
| --- | --- |
| spine | Workforce Intelligence / Talent Strategy |
| direction_family_name | HR Technology & Systems |
| short_description | Strategy and operation of HR systems — HRIS, ATS, LMS, people-data architecture, vendor selection and implementation. |
| work_texture | Implementation-shaped and vendor-heavy. Mix of strategy (architecture, vendor selection), implementation (configuration, integration), and operations (running the stack). Cross-functional with IT and HR sub-functions. |
| core_evidence_required | (1) HR systems ownership or substantial implementation experience; (2) Vendor selection or implementation decisions owned; (3) Integration architecture work; (4) Multi-platform fluency or deep platform expertise. |
| supporting_evidence | Workday, SAP SuccessFactors, Oracle HCM certifications; prior HR Tech vendor work; IT background with HR systems specialization. |
| false_positive_signals | (1) "Used HRIS" — system usage is not system ownership; (2) HR generalist who participated in implementation without owning decisions; (3) IT generalist with HR systems exposure — route based on whether IT spine (IT-04) or HR spine (WI-03) is the better fit. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: HR systems analyst with implementation exposure. Senior Specialist: systems specialist with platform depth. Manager: HR systems team or function ownership. Senior Manager: HR Tech function leadership. Director/Head: Chief HR Technology Officer-equivalent. Cross-spine penalty: From IT-04: small (significant overlap). From PO spines without systems work: bridge required. |
| direct_path_conditions | Current HR Tech role with systems ownership; entry at same level. |
| adjacent_path_conditions | From IT-04 (Business Systems) with HR systems specialization — enter at Manager. From PO-01 with HR Tech sponsorship — enter at Senior Specialist. |
| bridge_path_conditions | From generic HR: bridge through HRIS Analyst role plus platform certification for 12–18 months. From IT: bridge through HR Tech role with HR domain learning. |
| credential_gate | Soft. credential_details: Workday, SAP SuccessFactors, Oracle HCM, UKG certifications. typical_time_to_credential: 3–9 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional HR Tech advisor common for implementation projects. Often project-based rather than ongoing fractional. |
| ai_digital_treatment | Core. HR Tech is being heavily AI-transformed. AI fluency expected; AI tooling alone doesn't establish systems credibility. |
| ai_durability | D2 — Stable but Changing. source: mixed. Systems implementation work durable; many configuration tasks being AI-augmented. |
| financial_profile | Stable salaried, mid-high income. Specialist $90–130K, Senior Specialist $115–160K, Manager $140–190K, Senior Manager $170–230K, Director/Head $200–290K. |
| optional_title_examples | HRIS Manager, Head of HR Technology, Director of People Systems, HR Tech Lead, VP HR Technology |
| adjacent_families | WI-01, WI-02, IT-04, PO-01 |
| bridge_families | IT-04 (Business Systems); WI-02 (People Analytics); PO-01 (HR Leadership) |

WI-04 — Talent Intelligence & Market Research

| Field | Content |
| --- | --- |
| spine | Workforce Intelligence / Talent Strategy |
| direction_family_name | Talent Intelligence & Market Research |
| short_description | External labor market analysis — competitive intelligence, talent market mapping, compensation benchmarking research, talent landscape outputs. |
| work_texture | Research-shaped and analytical. Mix of structured data work (labor market data, comp surveys), qualitative research (sourcing intelligence), and stakeholder communication (briefing executives on talent landscape). |
| core_evidence_required | (1) Talent intelligence outputs consumed by senior leadership; (2) Market mapping or competitive intelligence work; (3) Data fluency — labor market datasets, comp surveys, scraping; (4) Research methodology. |
| supporting_evidence | Sourcing background with research depth; market research credentials; consulting background with talent practice; analytics or research graduate work. |
| false_positive_signals | (1) Sourcing recruiter labeled as talent intelligence — sourcing is execution, intelligence is research; (2) "Did some research for hiring" — incidental research is not the function; (3) HR generalist with research projects. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: talent intelligence analyst. Senior Specialist: TI specialist with project ownership. Manager: TI function or team leadership. Senior Manager: enterprise TI function. Director/Head: Head of Talent Intelligence-equivalent (still rare as a role). Cross-spine penalty: Moderate from PO-03 (TA Leadership) without research depth. |
| direct_path_conditions | Current TI role; entry at same level. |
| adjacent_path_conditions | From PO-03 (TA Leadership) with sourcing intelligence depth — enter at Senior Specialist. From SA-04 (Transformation Advisory) with talent practice — enter at Manager. |
| bridge_path_conditions | From generic recruiting: bridge through sourcing role with research scope, then TI Specialist role. |
| credential_gate | None. credential_details: market research credentials, sourcing certifications are soft. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Talent Intelligence advisor real for specific market entry or talent mapping projects. Usually project-based. |
| ai_digital_treatment | Core and increasing. AI is transforming labor market data analysis. AI fluency increasingly relevant. |
| ai_durability | D2 — Stable but Changing. source: mixed. Heavy augmentation of research work; judgment and stakeholder briefing durable. |
| financial_profile | Stable salaried, mid income. Specialist $80–115K, Senior Specialist $105–140K, Manager $135–175K, Senior Manager $160–210K, Director/Head $200–270K. |
| optional_title_examples | Talent Intelligence Analyst, Head of Talent Intelligence, Director of Market Research (Talent), Talent Strategy Researcher |
| adjacent_families | WI-01, WI-02, PO-03 |
| bridge_families | PO-03 (TA Leadership); WI-02 (People Analytics); SA-01 (Corporate Strategy) |

Spine 3 — Marketing & Growth

MG-01 — Marketing / Growth Leadership

| Field | Content |
| --- | --- |
| spine | Marketing & Growth |
| direction_family_name | Marketing / Growth Leadership |
| short_description | Senior ownership of the marketing function — strategy, team leadership, multi-channel orchestration, revenue accountability. |
| work_texture | Cross-functional. Mix of strategic (positioning, planning, brand) and operational (campaigns, channels, performance) work. Heavy partnership with Sales and Product. Often revenue-accountable. Frequent C-suite stakeholder management. |
| core_evidence_required | (1) Function-level ownership of marketing for meaningful business unit or company; (2) Multi-channel leadership — not single-channel specialist scaled up; (3) Team leadership across multiple marketing disciplines; (4) Demonstrated business outcomes — revenue, pipeline, growth metrics. |
| supporting_evidence | Background spanning brand and performance; experience scaling marketing through growth phase; cross-industry pattern recognition. |
| false_positive_signals | (1) Single-channel deep expertise labeled as "marketing leadership"; (2) Brand-only background recommended into growth leadership; (3) Sales background with "marketing oversight"; (4) Agency account leadership confused with in-house marketing leadership. |
| level_bands_supported | Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Senior Manager: marketing leadership for business unit or specialty function. Director/Head: marketing function ownership at company scale. Executive (CMO): enterprise marketing leadership. Cross-spine penalty: Large from Sales (CS-01) — sales-led marketing leadership is a known mismatch. Moderate from MG sub-spines (specialists need cross-functional broadening). |
| direct_path_conditions | Current marketing leadership role with function ownership; entry at same or one band above. |
| adjacent_path_conditions | From sub-spine (Brand, Performance, Lifecycle, PMM, Content) with cross-functional exposure and team leadership; enter at Senior Manager or Director. |
| bridge_path_conditions | From agency leadership: bridge through Senior Marketing Manager or Marketing Director role in-house for 18–24 months. From Sales or Product: bridge through head-of-marketing role in smaller organization first. |
| credential_gate | None. credential_details: no meaningful credential gating. blocks_direct_entry: no. |
| fractional_notes | Fractional CMO is established and growing, especially for early-stage and PE-backed companies. Credibility requires prior in-house marketing leadership at Director+ level, multi-company pattern recognition, named launches or growth outcomes. |
| ai_digital_treatment | Modifier and increasingly core. Marketing is one of the most AI-affected functions. AI fluency increasingly expected at leadership tier; AI tooling alone doesn't make a marketing leader. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: marketing tasks heavily exposed). Leadership and judgment durable; execution layer heavily transformed. |
| financial_profile | Stable salaried with significant bonus/equity at senior levels. Senior Manager $140–200K, Director/Head $200–300K, Executive (CMO) $300K+. Tech-industry premium meaningful. |
| optional_title_examples | VP Marketing, CMO, Head of Marketing, Head of Growth, VP Growth, Chief Growth Officer |
| adjacent_families | MG-02, MG-03, MG-04, MG-05, MG-06 |
| bridge_families | MG-02 through MG-06 — sub-spine specialists building cross-functional scope; CS-01 — for revenue-heavy GTM transitions (rare); SA-02 — for consultants entering marketing leadership |

MG-02 — Brand & Communications

| Field | Content |
| --- | --- |
| spine | Marketing & Growth |
| direction_family_name | Brand & Communications |
| short_description | Brand strategy, positioning, narrative, corporate communications. The shaping of how an organization is perceived. |
| work_texture | Creative-strategic. Mix of strategy (positioning, narrative architecture), execution (campaigns, content), and stakeholder work (executive comms, PR, internal narrative). Often C-suite-facing. |
| core_evidence_required | (1) Brand work ownership — positioning frameworks, brand architecture, brand strategy; (2) Substantive comms work — narrative ownership, executive communications, or PR program ownership; (3) Multi-cycle brand work, not one-off rebranding; (4) Cross-functional partnership evidence. |
| supporting_evidence | Agency brand background with in-house experience; communications graduate work; founder-CMO experience with brand emphasis. |
| false_positive_signals | (1) "Worked on brand guidelines" — guidelines maintenance is not brand strategy; (2) PR coordinator labeled as comms leader; (3) Social media management labeled as brand work; (4) Marketing generalist with brand exposure. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: brand specialist with project ownership. Manager: brand or comms team leadership. Senior Manager: brand or comms function for business unit. Director/Head: brand or corporate comms function ownership. Cross-spine penalty: Significant from non-marketing spines. PR/comms-only background entering brand leadership: bridge often required. |
| direct_path_conditions | Current brand or comms leadership role; entry at same level. |
| adjacent_path_conditions | From MG-01 (Marketing Leadership) with brand emphasis — enter at Senior Manager. From PR firm with in-house exposure — enter at Manager. |
| bridge_path_conditions | From generic marketing into brand leadership: bridge through brand-focused Senior Manager role. From journalism or content into corporate comms: bridge through PR or comms specialist role first. |
| credential_gate | None. credential_details: PRSA, APR are soft credentials for PR-leaning paths. typical_time_to_credential: 6–18 months. blocks_direct_entry: no. |
| fractional_notes | Fractional brand strategist and fractional Head of Comms real for early-stage and growth-phase companies. Often delivered through consulting practice (IP-01). |
| ai_digital_treatment | Modifier. AI rapidly transforming brand content production. Strategic brand work (positioning, architecture) remains durable. AI fluency increasingly relevant. |
| ai_durability | D2 — Stable but Changing. source: mixed. Content production heavily transformed; strategic brand work durable. |
| financial_profile | Stable salaried, mid-high income. Senior Specialist $90–130K, Manager $120–170K, Senior Manager $150–210K, Director/Head $190–280K, VP Brand $250–400K. |
| optional_title_examples | Brand Director, Head of Brand, VP Brand, Director of Communications, Chief Brand Officer, Head of Corporate Communications |
| adjacent_families | MG-01, MG-04, MG-06 |
| bridge_families | MG-01 (Marketing Leadership); MG-04 (Content/SEO/Editorial); MG-06 (PMM) — for brand specialists building product fluency |

MG-03 — Performance & Growth Marketing

| Field | Content |
| --- | --- |
| spine | Marketing & Growth |
| direction_family_name | Performance & Growth Marketing |
| short_description | Paid acquisition, performance channels, growth experimentation, funnel optimization. The measurable revenue-accountable side of marketing. |
| work_texture | Quantitative and channel-driven. Mix of media buying (paid channels), analytics (funnel, LTV, attribution), and experimentation (growth tests). Tight feedback loops with revenue. |
| core_evidence_required | (1) Paid channel ownership at scale — meaningful budget; (2) Measurable acquisition outcomes (CAC, CAC payback, LTV); (3) Growth experimentation framework; (4) Funnel or revenue accountability. |
| supporting_evidence | Background spanning multiple paid channels; programmatic media experience; SaaS or D2C growth background; agency-to-in-house transition. |
| false_positive_signals | (1) "Ran social media campaigns" — organic social is not paid acquisition; (2) "Managed Google Ads account" — small-account management without budget scale; (3) Marketing analyst with growth exposure but no channel ownership. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: channel specialist with paid ownership. Senior Specialist: multi-channel paid ownership. Manager: growth marketing team leadership. Senior Manager: growth function leadership. Director/Head: Head of Growth or growth function ownership. Cross-spine penalty: Significant from non-marketing without paid channel experience. Brand background entering growth: bridge required. |
| direct_path_conditions | Current growth marketing role with paid ownership; entry at same level. |
| adjacent_path_conditions | From MG-05 (Lifecycle) with paid acquisition experience — enter at Senior Specialist. From DA-01 (Analytics) with marketing analytics — enter at Specialist. |
| bridge_path_conditions | From brand background: bridge through performance role at smaller company. From product or sales: bridge through growth marketing role with channel ownership for 12–18 months. |
| credential_gate | None. credential_details: Google Ads, Meta Blueprint certifications are soft signals. typical_time_to_credential: 1–3 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Growth real and common for early-stage SaaS and D2C. Credibility requires prior in-house growth leadership with measurable outcomes. Adjacent to IP-01. |
| ai_digital_treatment | Core. Performance marketing heavily AI-driven (bidding, creative, audience). AI fluency expected. |
| ai_durability | D2 — Stable but Changing. source: mixed. Heavy automation of execution; strategy and channel orchestration durable. |
| financial_profile | Stable salaried with bonus and equity. Specialist $90–130K, Senior Specialist $115–165K, Manager $140–200K, Senior Manager $170–240K, Director/Head $210–320K, VP Growth $280–450K. |
| optional_title_examples | Growth Marketing Manager, Performance Marketing Manager, Head of Growth, VP Growth Marketing, Director of Performance Marketing |
| adjacent_families | MG-01, MG-05, DA-01 |
| bridge_families | MG-01 (Marketing Leadership); MG-05 (Lifecycle); DA-02 (Data Science) — for analytics-heavy growth specialists |

MG-04 — Content, SEO & Editorial Strategy

| Field | Content |
| --- | --- |
| spine | Marketing & Growth |
| direction_family_name | Content, SEO & Editorial Strategy |
| short_description | Owned media, content systems, SEO, editorial direction. The strategy and execution of organic content as a marketing channel. |
| work_texture | Editorial and operational. Mix of strategy (editorial calendar, content architecture), execution (production, distribution), and optimization (SEO, performance). Stakeholder mix includes Marketing, Product, Sales. |
| core_evidence_required | (1) Content strategy ownership — not just content production; (2) Editorial direction at meaningful scale; (3) SEO outcomes or content performance metrics; (4) Content operations — workflow, production systems. |
| supporting_evidence | Journalism or editorial background; SEO specialist with strategic broadening; content marketing certifications. |
| false_positive_signals | (1) Blog writing labeled as content strategy; (2) Social media management labeled as content strategy; (3) PR with content side; (4) SEO technical work without editorial direction. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Specialist: content specialist or SEO specialist. Senior Specialist: editorial lead or senior SEO with strategy ownership. Manager: content team leadership. Senior Manager: content function leadership. Director/Head: Head of Content or Director of Editorial. Cross-spine penalty: Moderate from journalism (editorial skills transfer; SEO and marketing context need building). |
| direct_path_conditions | Current content/SEO leadership role; entry at same level. |
| adjacent_path_conditions | From MG-02 (Brand) with content focus — enter at Senior Specialist. From journalism with corporate transition — enter at Senior Specialist or Manager. |
| bridge_path_conditions | From writing or journalism: bridge through content marketing role first. From SEO technical: bridge through editorial-focused content role. |
| credential_gate | None. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Content real for early-stage companies. Often paired with embedded production support. |
| ai_digital_treatment | Core. AI is rapidly transforming content production. AI fluency essential; AI tooling alone doesn't establish editorial leadership. |
| ai_durability | D1 — Pressured. source: mixed (Anthropic Economic Index: content tasks among most exposed). Content production heavily AI-affected. Strategic editorial direction more durable but pressured. |
| financial_profile | Stable salaried, mid income. Specialist $75–110K, Senior Specialist $100–140K, Manager $130–180K, Senior Manager $160–210K, Director/Head $190–280K. |
| optional_title_examples | Content Marketing Manager, Editorial Director, Head of Content, Director of SEO, VP Content Marketing |
| adjacent_families | MG-01, MG-02, MG-06 |
| bridge_families | MG-02 (Brand); MG-06 (PMM) — for content specialists building product fluency; IP-03 (Expert-Led Practice) — for content leaders pivoting independent |

MG-05 — Lifecycle, CRM & Retention

| Field | Content |
| --- | --- |
| spine | Marketing & Growth |
| direction_family_name | Lifecycle, CRM & Retention |
| short_description | Customer marketing across the lifecycle — email, retention, loyalty, segmentation, customer journey optimization. |
| work_texture | Operational and data-driven. Mix of segmentation work (data-led), channel work (email, in-app, push), and journey design. Cross-functional with Product and CS. |
| core_evidence_required | (1) Lifecycle program ownership — not just email execution; (2) CRM platform work (Braze, Iterable, HubSpot, Salesforce Marketing Cloud); (3) Retention outcomes or LTV impact; (4) Segmentation and journey design. |
| supporting_evidence | CRM tool certifications; D2C or SaaS retention background; data-leaning marketing background. |
| false_positive_signals | (1) Email coordinator labeled as lifecycle lead; (2) "Worked on retention" — incidental retention work; (3) Generic marketing manager. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: lifecycle specialist with channel ownership. Senior Specialist: multi-channel lifecycle work. Manager: lifecycle team leadership. Senior Manager: lifecycle function. Director/Head: Head of Lifecycle / Head of CRM. Cross-spine penalty: Moderate from generic marketing; significant from non-marketing. |
| direct_path_conditions | Current lifecycle role with program ownership; entry at same level. |
| adjacent_path_conditions | From MG-03 (Performance) with retention focus — enter at Senior Specialist. From CS-02 (Account Management) with retention work — enter at Specialist. |
| bridge_path_conditions | From email coordinator role: bridge through lifecycle specialist role with platform certification. |
| credential_gate | None. credential_details: CRM platform certifications are soft signals. typical_time_to_credential: 1–3 months. |
| fractional_notes | Fractional Head of Lifecycle/CRM real for growth-stage SaaS and D2C. Project-based engagements common. |
| ai_digital_treatment | Core. Lifecycle marketing heavily AI-driven (predictive churn, content personalization, send-time optimization). |
| ai_durability | D2 — Stable but Changing. source: mixed. Execution heavily automated; strategy and segmentation work durable. |
| financial_profile | Stable salaried, mid income. Specialist $80–120K, Senior Specialist $105–145K, Manager $130–180K, Senior Manager $160–215K, Director/Head $195–280K. |
| optional_title_examples | Lifecycle Marketing Manager, Head of Lifecycle, Director of CRM, VP Retention, Head of Customer Marketing |
| adjacent_families | MG-01, MG-03, CS-02 |
| bridge_families | MG-03 (Performance); MG-01 (Marketing Leadership); CS-02 (Account Management) |

MG-06 — Product Marketing / GTM Strategy

| Field | Content |
| --- | --- |
| spine | Marketing & Growth |
| direction_family_name | Product Marketing / GTM Strategy |
| short_description | Translating products into markets and markets into products — positioning, launch strategy, competitive narrative, customer insight, sales enablement. Sits at the seam between Product, Marketing, and Sales. |
| work_texture | Cross-functional and translational. Heavy partnership with PM, Sales, Marketing leadership. Mix of strategic (positioning, segmentation, narrative) and operational (launches, enablement, content). Cyclical around launches and QBRs. |
| core_evidence_required | (1) Direct ownership of product launches or GTM motions — not adjacent participation; (2) Positioning or messaging frameworks the person authored; (3) Sales enablement work tied to measurable adoption or revenue outcomes; (4) Customer or market insight work feeding back into product or GTM decisions. |
| supporting_evidence | Background spanning Product and Marketing; prior consulting with GTM focus; founder/operator with personally owned GTM. |
| false_positive_signals | (1) "Worked closely with product" — proximity is not ownership; (2) Sales enablement support without strategy ownership; (3) Content marketing labeled as PMM; (4) PM collaboration framed as PMM; (5) "Owned GTM" without measurable launch outcomes. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Specialist: PMM work on sub-scope — feature launch, positioning support, specific segment, enablement package, research-to-positioning. Entry at Specialist primarily for Marketing-spine candidates moving from MG-02, MG-04, MG-05 into PMM specialization. Cross-spine Specialist entry should be uncommon. Senior Specialist: full product launch and segment-level positioning ownership. Common entry point from PT-01 (PM). Manager: multi-product or multi-segment PMM with team leadership. Senior Manager: PMM team leadership across product lines. Director/Head: PMM function ownership. Cross-spine penalty (Sales-to-PMM): Large and intentionally strict. Rule: Sales background with substantive PMM-adjacent work (authored positioning, owned competitive narratives, ran launches with PMM) can enter at Senior Specialist — not higher, regardless of native Sales level. Sales background without PMM evidence — even at VP-Sales native level — should either suppress or route Bridge-based at Specialist. This strictness prevents the systematic "Senior AE becomes Senior PMM" mismatch. Cross-spine penalty (PT-01 PM-to-PMM): Small — natural transition. Cross-spine penalty (other MG sub-families): Small to moderate. Cross-spine penalty (non-marketing, non-product, non-sales): Large — typically suppress. |
| direct_path_conditions | Current PMM role with launch ownership; entry at same level; same product category or comparable. |
| adjacent_path_conditions | From PT-01 with PMM-adjacent work — enter at Senior Specialist or Manager. From MG-02 (Brand) with product launches — enter at Senior Specialist. From MG-04 (Content) with positioning ownership — enter at Specialist or Senior Specialist. |
| bridge_path_conditions | From Sales: bridge through Senior PMM role (or PMM Specialist if early-career) with positioning and launch ownership for 12–18 months. From Marketing Leadership (MG-01) generalist: bridge through Director of PMM role. From non-marketing: typically suppress or recommend longer path through MG-04 first. |
| credential_gate | None. credential_details: Pragmatic Institute, PMA certifications are soft signals only. typical_time_to_credential: 1–6 months. blocks_direct_entry: no. can_be_bridge_path: marginal. |
| fractional_notes | Fractional PMM real and rising, especially for early-stage tech companies. Credibility requires prior in-house PMM at Director+ level, portfolio of launches across companies, clear positioning IP. Without these, fractional positioning is aspirational. |
| ai_digital_treatment | Modifier and increasingly core. AI tools heavily reshaping PMM workflows (research synthesis, content generation, competitive analysis). AI-product PMM is a distinct sub-domain with real demand. AI tooling alone does not establish PMM capability. |
| ai_durability | D2 — Stable but Changing. source: mixed. Execution layer being heavily AI-transformed; judgment work — positioning, competitive narrative, customer insight, stakeholder alignment — remains durable. |
| financial_profile | Stable salaried with bonus and equity in tech. Specialist $110–150K, Senior Specialist $140–180K, Manager $160–210K, Senior Manager $190–250K, Director/Head $230–320K, VP PMM $300–450K. Tech-industry premium meaningful. |
| optional_title_examples | Product Marketing Manager, Senior PMM, Group PMM, Director of Product Marketing, Head of PMM, VP Product Marketing, Head of GTM |
| adjacent_families | MG-01, MG-02, MG-04, PT-01, CS-04 |
| bridge_families | PT-01 (Product Management) — common pre-PMM path; MG-02 (Brand); MG-04 (Content); SA-02 (Management Consulting) — for consultants with GTM engagement experience |

Spine 4 — Commercial / Sales / Partnerships

CS-01 — Enterprise Sales Leadership

| Field | Content |
| --- | --- |
| spine | Commercial / Sales / Partnerships |
| direction_family_name | Enterprise Sales Leadership |
| short_description | Senior responsibility for complex, high-value B2B sales — strategy, team leadership, large deals, quota ownership at enterprise scale. |
| work_texture | Revenue-accountable, deal-shaped, customer-facing at executive levels. Mix of strategy (territory, account plans), execution (deal management), and team leadership (recruiting, coaching, forecasting). Quarterly cadence with annual planning. |
| core_evidence_required | (1) Quota carrying at enterprise level — substantial deal sizes and complex sales cycles; (2) Team leadership with hiring and coaching responsibility; (3) Multi-year deal or account ownership; (4) Demonstrated revenue outcomes against quota. |
| supporting_evidence | Background in MEDDIC/MEDDICC, Sandler, Challenger, or comparable sales methodologies; multi-industry sales experience; sales engineering or solutions background. |
| false_positive_signals | (1) Inside sales or SMB sales labeled as enterprise; (2) Account management labeled as enterprise sales — route to CS-02; (3) Business development labeled as sales — route to CS-03; (4) Sales support or sales ops — route to CS-04. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Manager: Sales Manager with team of 3–8 AEs and quota responsibility. Senior Manager: Senior Manager or Director with multi-team responsibility. Director/Head: Sales Director / VP Sales with regional or function-wide responsibility. Executive (CRO/CSO): Enterprise revenue leadership. Cross-spine penalty: Large from non-sales spines. Even strong account management background (CS-02) enters Sales Leadership at Manager only with explicit transition. |
| direct_path_conditions | Current enterprise sales leadership role; entry at same level; same industry segment. |
| adjacent_path_conditions | From CS-02 (Account Management) with revenue ownership — enter at Manager. From CS-03 (BD) with sales transition — enter at Manager. |
| bridge_path_conditions | From non-sales backgrounds: bridge through AE or Senior AE role with quota for 18–24 months. From marketing or product: bridge through PMM (MG-06) at Senior Manager level, then sales role. |
| credential_gate | None. credential_details: sales methodology certifications are soft signals. blocks_direct_entry: no. |
| fractional_notes | Fractional VP Sales is real and growing for early-stage companies. Credibility requires prior in-house enterprise sales leadership at Director+, multi-company sales scaling pattern, named revenue outcomes. |
| ai_digital_treatment | Modifier and increasingly core. AI is transforming sales prospecting, deal forecasting, and revenue intelligence. AI fluency increasingly relevant; AI tools alone don't establish sales credibility. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: sales tasks moderately exposed). Execution and prospecting heavily transformed; deal-making and relationship work durable at enterprise level. |
| financial_profile | OTE-based with significant variable comp. Manager $200–300K OTE, Senior Manager $250–400K, Director/Head $350–600K, Executive (CRO) $500K–$2M+. Heavy industry and company-stage variation. |
| optional_title_examples | Sales Director, VP Sales, Head of Sales, CRO, Chief Sales Officer, VP Enterprise Sales |
| adjacent_families | CS-02, CS-03, CS-04, MG-01 |
| bridge_families | CS-02 (Account Management); CS-03 (BD & Partnerships); CS-04 (RevOps) — for ops-leaning sales transitions |

CS-02 — Account Management & Customer Success

| Field | Content |
| --- | --- |
| spine | Commercial / Sales / Partnerships |
| direction_family_name | Account Management & Customer Success |
| short_description | Post-sale account ownership — expansion, retention, strategic accounts, customer relationships as primary work with revenue accountability. |
| work_texture | Relational and revenue-accountable. Named account work with structured cadence (QBRs, account plans, expansion conversations). Mix of strategic (account planning), tactical (executing within accounts), and partnership (working with Sales, CS Ops, Product). |
| core_evidence_required | (1) Named account ownership — specific accounts, not generic CS work; (2) Expansion or retention outcomes; (3) Customer relationship work at executive levels; (4) Revenue accountability (renewal, expansion, NPS or comparable). |
| supporting_evidence | Strategic account management background; prior enterprise sales experience; consulting background with client retention focus. |
| false_positive_signals | (1) Customer support labeled as customer success — route to OD-04; (2) "Worked with customers" — proximity not ownership; (3) Project management of customer projects without revenue accountability; (4) Sales engineering — route to CS-01 or PT-03 depending on technical depth. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Specialist: CSM with smaller account portfolio. Senior Specialist: Strategic Account Manager with enterprise accounts. Manager: CS Manager with team. Senior Manager: CS function for business unit. Director/Head: CS function or VP CS. Executive (Chief Customer Officer): Enterprise customer leadership. Cross-spine penalty: Moderate from non-revenue backgrounds; significant from support-only roles. |
| direct_path_conditions | Current AM/CS role with account ownership; entry at same level. |
| adjacent_path_conditions | From CS-01 (Sales) with post-sale specialization — enter at Manager. From CS-03 (BD) with account focus — enter at Specialist. |
| bridge_path_conditions | From support or operations backgrounds: bridge through CSM role with named accounts for 12–18 months. |
| credential_gate | None. blocks_direct_entry: no. |
| fractional_notes | Fractional VP Customer Success real for growth-stage SaaS. Credibility requires prior in-house CS leadership at Director+. |
| ai_digital_treatment | Modifier. AI tools reshaping CS health scores, expansion prediction, customer communication. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable. source: mixed. Relationship and judgment work durable; execution and analysis being augmented. |
| financial_profile | OTE-based with variable comp. Specialist $90–130K OTE, Senior Specialist $120–170K, Manager $150–220K, Senior Manager $190–280K, Director/Head $240–380K, Chief Customer Officer $350K+. |
| optional_title_examples | Customer Success Manager, Strategic Account Manager, Director of Customer Success, VP CS, Chief Customer Officer |
| adjacent_families | CS-01, CS-03, CS-04, OD-04 |
| bridge_families | CS-01 (Enterprise Sales); CS-04 (RevOps) — for ops-leaning AM/CS specialists; MG-05 (Lifecycle) — for retention-leaning paths |

CS-03 — Business Development & Partnerships

| Field | Content |
| --- | --- |
| spine | Commercial / Sales / Partnerships |
| direction_family_name | Business Development & Partnerships |
| short_description | Non-direct revenue growth — alliances, channel partnerships, strategic partnerships, BD deals that create value through relationships rather than direct sales. |
| work_texture | Deal-shaped and relationship-driven. Mix of strategy (partnership models, alliance design), execution (negotiation, deal structuring), and ongoing partnership management. Often C-suite-facing. |
| core_evidence_required | (1) Partnership deal ownership — substantive deals, not introductory meetings; (2) Channel or alliance program work; (3) Multi-party deal structuring experience; (4) Revenue or strategic outcomes from partnerships. |
| supporting_evidence | Investment banking or corp dev background; consulting with partnership practice; prior founder/operator with partnership emphasis. |
| false_positive_signals | (1) "Built relationships" without deals; (2) Sales role labeled as BD; (3) Vendor management labeled as partnership; (4) "Networked extensively" — networking is not partnership work. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Specialist: BD specialist with deal involvement. Senior Specialist: BD lead with deal ownership. Manager: BD team or channel program leadership. Senior Manager: BD function for business unit. Director/Head: Head of BD or partnerships. Executive: Chief Partnership Officer or comparable. Cross-spine penalty: Moderate from CS-01 (Sales); significant from non-commercial spines. |
| direct_path_conditions | Current BD role with deal ownership; entry at same level. |
| adjacent_path_conditions | From CS-01 with partnership-adjacent deal work — enter at Manager. From SA-03 (M&A/Corp Dev) — enter at Manager or Senior Manager. |
| bridge_path_conditions | From sales backgrounds: bridge through BD specialist role first. From non-commercial: bridge through BD role with deal exposure. |
| credential_gate | None. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Partnerships emerging for early-stage and growth-stage companies. Often paired with named partnership pipeline. |
| ai_digital_treatment | Modifier. AI is reshaping partnership analytics and deal sourcing. Core deal work remains relational. |
| ai_durability | D3 — Durable. source: judgment_based. Deal-making and partnership strategy heavily relational and judgment-based. |
| financial_profile | OTE-based. Specialist $100–145K OTE, Senior Specialist $130–185K, Manager $160–230K, Senior Manager $200–290K, Director/Head $260–400K, Executive $350K+. |
| optional_title_examples | Business Development Manager, Director of Partnerships, Head of Strategic Alliances, VP BD, Chief Partnerships Officer |
| adjacent_families | CS-01, CS-02, SA-03 |
| bridge_families | CS-01 (Enterprise Sales); SA-03 (M&A/Corp Dev); MG-01 (Marketing Leadership) — for partnership marketing transitions |

CS-04 — Revenue Operations

| Field | Content |
| --- | --- |
| spine | Commercial / Sales / Partnerships |
| direction_family_name | Revenue Operations |
| short_description | The systems and processes behind revenue teams — pipeline, forecasting, tooling, enablement infrastructure, RevOps strategy. |
| work_texture | Operational and systems-heavy. Mix of analytics (pipeline, forecasting), systems (CRM, sales tools), process (sales motion design), and enablement (training, content). Cross-functional with Sales, Marketing, CS, Finance. |
| core_evidence_required | (1) RevOps function or major sub-function ownership; (2) Sales tech architecture work — CRM, sales tools stack; (3) Pipeline or forecasting system ownership; (4) Sales process design or enablement program. |
| supporting_evidence | Salesforce admin or consultant background; prior business operations with revenue focus; analytics background with sales/marketing transition. |
| false_positive_signals | (1) Salesforce admin labeled as RevOps Leader — admin is a tool role; (2) Sales analyst labeled as RevOps Manager — analytics is sub-scope; (3) "Worked on CRM" — proximity not ownership. CS Ops routing note: Customer Success Operations can route to CS-04 if revenue-systems/pipeline/forecasting/GTM operations is dominant in the evidence. If service delivery/support operations/SLA/process infrastructure is dominant, route to OD-04 instead. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: RevOps analyst or specialist. Senior Specialist: RevOps with cross-functional projects. Manager: RevOps team leadership. Senior Manager: RevOps function for business unit. Director/Head: Head of RevOps or VP RevOps. Cross-spine penalty: Moderate from generic analytics or systems backgrounds; significant from generic sales without ops orientation. |
| direct_path_conditions | Current RevOps role with function ownership; entry at same level. |
| adjacent_path_conditions | From OD-01 (Business Operations) with revenue focus — enter at Manager. From DA-01 (Analytics) with revenue analytics — enter at Senior Specialist. |
| bridge_path_conditions | From Salesforce admin: bridge through RevOps Specialist role with strategy work. From generic sales: bridge through RevOps Manager role. |
| credential_gate | None. credential_details: Salesforce certifications are soft signals. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. |
| fractional_notes | Fractional RevOps real for early-stage and growth-stage companies. Often delivered as project (CRM implementation, forecasting setup) rather than ongoing fractional. |
| ai_digital_treatment | Core. RevOps heavily AI-driven (forecasting, lead scoring, revenue intelligence). AI fluency expected. |
| ai_durability | D2 — Stable but Changing. source: mixed. Execution heavily automated; strategy and architecture work durable. |
| financial_profile | Stable salaried with bonus. Specialist $90–130K, Senior Specialist $115–165K, Manager $140–200K, Senior Manager $170–240K, Director/Head $210–310K, VP RevOps $280–420K. |
| optional_title_examples | RevOps Manager, Sales Operations Manager, Head of Revenue Operations, Director of Sales Operations, VP RevOps |
| adjacent_families | CS-01, CS-02, DA-01, OD-01 |
| bridge_families | OD-01 (Business Operations); CS-01 (Sales Leadership); DA-01 (Analytics Leadership) |

Spine 5 — Operations & Delivery

OD-01 — Business Operations Leadership

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Business Operations Leadership |
| short_description | General operational leadership — running the business engine across functions, owning cross-functional operational accountability, translating strategy into execution. |
| work_texture | Cross-functional and highly integrative. Mix of strategy execution, operating cadence (planning, reviews, OKRs), special projects, generalist execution partnership to CEO/leadership team. Often Chief of Staff scaled up, or COO scaled down. |
| core_evidence_required | (1) Cross-functional operational ownership; (2) Operating cadence or business operations system ownership; (3) Direct partnership with senior leadership; (4) Pattern of taking ambiguous, cross-functional problems and operationalizing them. |
| supporting_evidence | Background spanning multiple functions; Chief of Staff experience; consulting-to-operating transition; founder-operator experience. |
| false_positive_signals | (1) Single-function operations labeled as Business Operations; (2) Project Manager labeled as Business Operations; (3) EA scaled up; (4) "Helped operationalize strategy" without ownership. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Senior Specialist: Chief of Staff at smaller orgs. Manager: Business Operations Manager with cross-functional scope. Senior Manager: Business Operations function for business unit. Director/Head: Head of Business Operations or COO at smaller company. Executive (COO): enterprise operations leadership. Cross-spine penalty: Moderate from consulting (SA-02); significant from single-function leadership. |
| direct_path_conditions | Current business ops role with cross-functional scope; entry at same level. |
| adjacent_path_conditions | From SA-02 (Consulting) with operating accountability — enter at Manager or Senior Manager. From specific ops sub-family with cross-functional broadening — enter at Senior Manager. |
| bridge_path_conditions | From functional leadership: bridge through Chief of Staff role for 12–18 months. From non-operational: typically suppress or recommend specific ops family. |
| credential_gate | None. credential_details: MBA is soft positive signal; PMP, Six Sigma marginal. blocks_direct_entry: no. |
| fractional_notes | Fractional COO is established and growing for PE-backed and early-stage companies. Credibility requires prior in-house COO/Head-of-Ops experience plus multi-company pattern recognition. |
| ai_digital_treatment | Modifier. AI transforming operational toolkit; AI tooling alone doesn't establish ops scope. |
| ai_durability | D3 — Durable. source: mixed. Judgment-based and cross-functional work durable. |
| financial_profile | Stable salaried with bonus/equity. Senior Specialist $120–170K, Manager $140–200K, Senior Manager $180–250K, Director/Head $220–320K, COO $300K+. |
| optional_title_examples | Head of Business Operations, VP Operations, Chief of Staff (at scale), Director of Operations, COO |
| adjacent_families | OD-02, SA-01, SA-02, FC-01 |
| bridge_families | SA-02 (Management Consulting); OD-02 (Program & Project Leadership); SA-01 (Corporate Strategy) |

OD-02 — Program & Project Leadership

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Program & Project Leadership |
| short_description | Delivering complex programs across teams — large initiatives, transformation programs, multi-team delivery with budget and timeline accountability. |
| work_texture | Program-shaped and structured. Mix of planning (scope, schedule, resources), execution (delivery management), and governance (steering committees, status reporting). Heavy stakeholder management. |
| core_evidence_required | (1) Program ownership at scale — multiple teams, complex scope; (2) Budget and timeline accountability; (3) Delivery against scope; (4) Multi-program or portfolio leadership at senior tier. |
| supporting_evidence | PMP, PgMP, PRINCE2 credentials; PMO experience; consulting background with program delivery. |
| false_positive_signals | (1) Project coordinator labeled as program leader; (2) "Led projects" without scope; (3) Engineering team lead labeled as program manager. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: PM with project ownership. Senior Specialist: Senior PM or Program Manager. Manager: PMO Manager or multi-program leadership. Senior Manager: PMO function leadership. Director/Head: Head of PMO or VP Programs. Cross-spine penalty: Moderate from technical leadership without delivery scope. |
| direct_path_conditions | Current program leadership role; entry at same level. |
| adjacent_path_conditions | From OD-01 (Business Ops) with program focus — enter at Manager. From SA-02 with engagement leadership — enter at Senior Specialist or Manager. |
| bridge_path_conditions | From technical roles: bridge through program management role with credential. From PM without scale: bridge through Senior PM role. |
| credential_gate | Soft. credential_details: PMP, PgMP, PRINCE2 widely recognized. typical_time_to_credential: 3–9 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional Program Director real for specific large initiatives. Often paired with named program (M&A integration, transformation, system implementation). |
| ai_digital_treatment | Modifier. AI tools reshaping planning, status reporting, risk management. AI fluency increasingly useful. |
| ai_durability | D2 — Stable but Changing. source: mixed. Heavy AI augmentation; coordination and judgment work durable. |
| financial_profile | Stable salaried, mid income. Specialist $85–125K, Senior Specialist $110–155K, Manager $135–185K, Senior Manager $165–225K, Director/Head $200–290K. |
| optional_title_examples | Program Manager, Senior Program Manager, Director of Programs, Head of PMO, VP Programs |
| adjacent_families | OD-01, OD-06, DX-01, SA-04 |
| bridge_families | OD-01 (Business Operations); OD-06 (Change Management); DX-01 (Digital Transformation) |

OD-03 — Supply Chain & Logistics

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Supply Chain & Logistics |
| short_description | End-to-end physical or digital supply operations — sourcing, planning, fulfillment, logistics, supplier management. |
| work_texture | Operational and metric-driven. Mix of planning (demand, inventory, capacity), execution (fulfillment, logistics), and supplier work. Cross-functional with Finance, Sales, Operations. |
| core_evidence_required | (1) Supply chain function or major sub-function ownership; (2) Planning or fulfillment ownership at scale; (3) Supplier management at scale; (4) Measurable supply chain outcomes (cost, service level, inventory turns). |
| supporting_evidence | CSCP, CPIM, CLTD credentials; manufacturing background; e-commerce fulfillment experience; consulting with supply chain practice. |
| false_positive_signals | (1) Procurement coordinator labeled as supply chain leader; (2) Operations generalist with logistics exposure; (3) "Worked with suppliers" — proximity not ownership. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Specialist: SC specialist or analyst. Senior Specialist: SC specialist with multi-domain exposure. Manager: SC manager for function. Senior Manager: SC function for business unit. Director/Head: SC function ownership. Executive (Chief Supply Chain Officer): enterprise SC leadership. Cross-spine penalty: Significant from generic operations without SC-specific experience. |
| direct_path_conditions | Current SC role with function ownership; entry at same level; same industry. |
| adjacent_path_conditions | From OD-05 (Industrial Ops) with SC scope — enter at Manager. From SA-02 with SC practice — enter at Senior Manager. |
| bridge_path_conditions | From generic operations: bridge through SC Manager role plus credential. |
| credential_gate | Soft. credential_details: CSCP, CPIM, CLTD (APICS), Six Sigma supply chain. typical_time_to_credential: 6–12 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Supply Chain real for growth-stage e-commerce and CPG. Often project-shaped engagements. |
| ai_digital_treatment | Modifier and increasingly core. AI is reshaping demand planning, inventory optimization, logistics. AI fluency increasingly important. |
| ai_durability | D2 — Stable but Changing. source: mixed. Planning and analytics heavily augmented; supplier relationships and strategic SC work durable. |
| financial_profile | Stable salaried. Specialist $80–115K, Senior Specialist $105–145K, Manager $130–180K, Senior Manager $160–220K, Director/Head $200–290K, Chief SC Officer $300K+. |
| optional_title_examples | Supply Chain Manager, Director of Supply Chain, VP Supply Chain, Head of Logistics, Chief Supply Chain Officer |
| adjacent_families | OD-01, OD-05, FC-01 |
| bridge_families | OD-05 (Industrial Operations); OD-01 (Business Operations); SA-02 (Consulting) — for SC consultants entering operating roles |

OD-04 — Customer Operations & Service Delivery

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Customer Operations & Service Delivery |
| short_description | Operational service delivery — support operations, service centers, customer operations infrastructure, SLA management, support process and tooling. |
| work_texture | Operations-shaped and metric-driven. Mix of process (queue management, SLA design), people (support team management), and tooling (support stack, knowledge base, automation). Different from CS-02 — operationally accountable for service delivery, not commercially accountable for accounts. |
| core_evidence_required | (1) Support or service operations leadership; (2) Process and SLA ownership; (3) Team management at scale; (4) Operational metrics (CSAT, resolution time, deflection, cost-to-serve). |
| supporting_evidence | Customer support leadership background; service operations methodology; contact center experience. |
| false_positive_signals | (1) Customer success labeled as customer operations — route to CS-02; (2) Support agent labeled as ops leader; (3) "Managed support" without operational scope. CS Ops routing note: Customer Success Operations routes here if service delivery/support operations/SLA/process infrastructure is dominant. If revenue-systems/pipeline/forecasting/GTM operations is dominant, route to CS-04 instead. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: support operations specialist. Senior Specialist: support ops with cross-functional scope. Manager: support operations or service delivery manager. Senior Manager: customer operations function. Director/Head: VP Customer Operations or Head of Support. Cross-spine penalty: Moderate from CS-02 (account management) without operational orientation; significant from non-operations spines. |
| direct_path_conditions | Current customer operations leadership role; entry at same level. |
| adjacent_path_conditions | From CS-02 with operational focus — enter at Manager. From OD-01 with customer focus — enter at Manager. |
| bridge_path_conditions | From support agent or coordinator: bridge through Support Manager role with operational scope. |
| credential_gate | None. blocks_direct_entry: no. |
| fractional_notes | Fractional VP Customer Operations real for growth-stage SaaS. Often project-shaped (support transformation, tooling implementation). |
| ai_digital_treatment | Core. Customer operations heavily AI-affected (deflection, automated resolution, AI agents). AI fluency essential. |
| ai_durability | D1 — Pressured. source: mixed (Anthropic Economic Index: customer service heavily exposed). Routine support work pressured; leadership and complex case work more durable. |
| financial_profile | Stable salaried. Specialist $75–110K, Senior Specialist $100–140K, Manager $125–175K, Senior Manager $155–215K, Director/Head $190–280K. |
| optional_title_examples | Support Operations Manager, Director of Customer Operations, Head of Support, VP Customer Operations, Director of Service Delivery |
| adjacent_families | OD-01, OD-07, CS-02, CS-04 |
| bridge_families | CS-02 (Account Management); OD-01 (Business Operations); IT-04 (Business Systems) — for support tooling specialists |

OD-05 — Industrial / Manufacturing Operations

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Industrial / Manufacturing Operations |
| short_description | Plant, production, or industrial operations — production management, quality, EHS, manufacturing engineering. |
| work_texture | Physical and process-shaped. Mix of production management, quality systems, safety, and continuous improvement. Often shift-based; cross-functional with Supply Chain, Engineering, Quality. |
| core_evidence_required | (1) Plant or production line ownership; (2) Manufacturing or industrial operations work; (3) Quality and safety system experience; (4) Production team management at scale. |
| supporting_evidence | Six Sigma, Lean Manufacturing credentials; engineering background; military leadership transition; CPIM or similar. |
| false_positive_signals | (1) "Worked in a factory" without operational ownership; (2) Manufacturing engineering labeled as operations — route to PT spine depending on technical depth; (3) Procurement labeled as manufacturing — route to OD-03. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Specialist: Production Supervisor. Senior Specialist: Senior Supervisor or Manufacturing Engineer with operational role. Manager: Plant Manager or Production Manager. Senior Manager: Operations Manager for multi-line or multi-plant. Director/Head: Director of Manufacturing. Executive (VP Manufacturing, Chief Manufacturing Officer): enterprise manufacturing leadership. Cross-spine penalty: Large from non-industrial spines. Manufacturing requires specific operational and safety credibility. |
| direct_path_conditions | Current manufacturing role with operational ownership; entry at same level; same industry segment. |
| adjacent_path_conditions | From OD-03 (Supply Chain) with manufacturing focus — enter at Manager. From engineering with manufacturing focus — enter at Senior Specialist or Manager. |
| bridge_path_conditions | From non-manufacturing: bridge through manufacturing supervisor role. Cross-industry penalty within manufacturing (food production to aerospace, etc.) significant. |
| credential_gate | Soft. credential_details: Six Sigma Black Belt, Lean credentials, CPIM, EHS certifications. typical_time_to_credential: 6–18 months. blocks_direct_entry: no. |
| fractional_notes | Fractional manufacturing advisor real for specific plant turnarounds. Project-based engagements. |
| ai_digital_treatment | Modifier and increasingly core. Industry 4.0, predictive maintenance, AI quality control reshaping work. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable for leadership tier; pressured for routine line work. source: mixed. Physical and judgment work durable; routine production work being automated. |
| financial_profile | Stable salaried, mid-high income. Specialist $80–115K, Senior Specialist $100–140K, Manager $120–170K, Senior Manager $150–210K, Director/Head $190–280K, Executive $280K+. |
| optional_title_examples | Production Supervisor, Plant Manager, Director of Manufacturing, VP Operations, Chief Manufacturing Officer |
| adjacent_families | OD-01, OD-03 |
| bridge_families | OD-03 (Supply Chain); PT-03 (Technical Craft) — for manufacturing engineering pivots; SL-01 (Skilled Trade) — for trade-craft origins |

OD-06 — Change Management & Adoption Leadership

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Change Management & Adoption Leadership |
| short_description | Leading organizational adoption of change — not the technology program itself, but the human, operational, and behavioral side. Stakeholder readiness, training and enablement, communication design, measurable adoption outcomes. |
| work_texture | Program-shaped, stakeholder-intensive, communication-heavy. Mix of strategy (adoption design, readiness assessment), execution (rollout, training, enablement), and measurement (adoption metrics, behavior change). Cross-functional. |
| core_evidence_required | (1) Ownership of change adoption — not just delivery of a project, but measurable behavioral or operational adoption; (2) Stakeholder readiness work — assessments, communication design, resistance management; (3) Training and enablement program ownership; (4) Documented adoption outcomes — usage rates, behavior change, operating model adoption. |
| supporting_evidence | Prosci or comparable credential; consulting with change focus; multi-program track record across change types. |
| false_positive_signals | (1) Project communication labeled as change management; (2) Training delivery alone; (3) System implementation labeled as transformation ownership — route to IT-04 or PT-02; (4) "Helped people adopt the new system" without measurement; (5) Internal comms labeled as change leadership. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: adoption workstream ownership within larger program. Manager: full adoption program ownership. Senior Manager: portfolio of adoption programs. Director/Head: enterprise change management office. Cross-spine penalty: Significant from Marketing or Communications (partial skills); moderate from HR (PO-04 OD&C adjacent). Fractional/Independent realistic at Director+ equivalent. |
| direct_path_conditions | Current change management leadership role with measurable adoption outcomes; entry at same level. |
| adjacent_path_conditions | From PO-04 (OD&C) with adoption-program ownership — enter at Manager. From OD-02 (Program Leadership) with change focus — enter at Manager. From PO-05 (L&D) with measurable enablement-driven adoption — enter at Senior Specialist. |
| bridge_path_conditions | From internal comms or generic HR: bridge through dedicated change management role with Prosci certification for 12–24 months. From project management without change focus: bridge through change manager role on specific transformation. |
| credential_gate | Soft. credential_details: Prosci ADKAR most recognized; CCMP also recognized. typical_time_to_credential: 1–3 months for Prosci. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional change management real, typically Director-equivalent. Multi-program portfolio and recognized credential required. Often deployed during M&A, technology transformation, or operating model changes. |
| ai_digital_treatment | Modifier. Change management work increasingly involves AI adoption specifically. Core work is human-systems work. AI tooling alone irrelevant; AI adoption as the change being managed strengthens this family. |
| ai_durability | D3 — Durable. source: judgment_based. Heavily human-systems work; stakeholder navigation, behavioral change, organizational politics. |
| financial_profile | Stable salaried, mid-high income. Senior Specialist $110–150K, Manager $140–190K, Senior Manager $170–230K, Director/Head $210–290K. Consulting-side change leaders earn substantially more (SA-04). |
| optional_title_examples | Change Management Lead, Senior Change Manager, Head of Change Management, Director of Adoption, Director of Organizational Change |
| adjacent_families | PO-04, OD-02, DX-01, SA-04 |
| bridge_families | PO-04 (OD & Change); OD-02 (Program Leadership); DX-01 (Digital Transformation); PO-05 (L&D Leadership) |

OD-07 — Healthcare Administration / Care Operations

| Field | Content |
| --- | --- |
| spine | Operations & Delivery |
| direction_family_name | Healthcare Administration / Care Operations |
| short_description | Non-clinical leadership in healthcare delivery — practice administration, hospital operations, care delivery management, healthcare program leadership. The operational and administrative discipline of running healthcare delivery. |
| work_texture | Operational, regulated, multi-stakeholder. Mix of operations management, regulatory navigation (HIPAA, Medicare/Medicaid, state facility licensure), workforce management (often heavy clinical workforce), and financial management (complex healthcare reimbursement). Operations work practiced inside a heavily regulated industry. |
| core_evidence_required | (1) Healthcare operations or administration experience — directly in healthcare delivery setting; (2) Regulatory awareness and competence (HIPAA, healthcare reimbursement, state facility licensure); (3) Healthcare workforce management — managing clinical staff, even as non-clinician; (4) Healthcare economics literacy. |
| supporting_evidence | MHA, MPH, or healthcare-focused MBA; healthcare consulting practice; clinical-to-administrative transition; prior payer or pharma operations. |
| false_positive_signals | (1) Generic operations management labeled as healthcare administration — healthcare specificity matters; (2) "Worked on a healthcare project" at consulting firm; (3) Patient or family caregiver experience; (4) Healthcare technology vendor experience — route to PT or CS in healthcare context; (5) Generic OD-01 background labeled as healthcare admin — most common false positive. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Specialist: practice administrator at small practice, healthcare operations analyst. Senior Specialist: experienced administrator with multi-site exposure. Manager: practice manager, clinic manager, healthcare program manager. Senior Manager: multi-clinic or service-line operational ownership. Director/Head: hospital department or large practice ownership; healthcare program leadership at health system or payer. Executive: hospital COO, health system VP, healthcare practice CEO. Cross-spine penalty (from OD-01): Moderate — generic operations leadership requires healthcare regulatory and clinical-workforce credibility-building; Director-level OD-01 entrants typically enter OD-07 at Manager or Senior Manager. Cross-spine penalty (from SL-02/SL-03 clinical): Small — clinical experience with administrative responsibility translates well. Cross-spine penalty (from far spines): Large — typically Specialist or Senior Specialist regardless of native level, MHA/MPH near-prerequisite. |
| direct_path_conditions | Current healthcare administration role; entry at same level; same healthcare segment (ambulatory, acute care, post-acute, payer-side). |
| adjacent_path_conditions | From SL-02 or SL-03 (clinical) with administrative responsibility — enter at Manager or Senior Manager. From SA-02 (Consulting) with healthcare practice — enter at Manager or Senior Manager. From healthcare payer or pharma operations — enter at Manager. |
| bridge_path_conditions | From non-healthcare operations: bridge through Healthcare Operations Manager role with MHA/MPH for 18–30 months. From corporate administrative roles: bridge through Specialist or Senior Specialist healthcare role first; large native-level downgrade typical. |
| credential_gate | Soft, sometimes Jurisdiction-Specific. credential_details: MHA/MPH soft-but-heavily-weighted at Manager+. LNHA (state-licensed nursing home administrator) Hard-gated for that segment. FACHE soft for senior administration. typical_time_to_credential: 2 years for MHA/MPH; 6–12 months for LNHA. blocks_direct_entry: only for specific segments (nursing home administration). can_be_bridge_path: yes. |
| fractional_notes | Fractional healthcare administration real for small practices and specialty advisory (revenue cycle, regulatory readiness, value-based care transition). Requires healthcare-specific operational depth. Fractional credibility at Director-equivalent minimum. |
| ai_digital_treatment | Modifier and increasingly relevant. Healthcare AI adoption accelerating in administrative areas (revenue cycle, prior auth, scheduling). AI fluency increasingly relevant; AI background without healthcare depth doesn't substitute. |
| ai_durability | D3 — Durable. source: mixed (Anthropic Economic Index: medical records and healthcare administrative roles moderate-to-high exposure). Operations being AI-affected; leadership and regulatory work durable. Healthcare regulation slows AI displacement relative to other administrative work. |
| financial_profile | Stable salaried, mid-high income. Specialist $60–95K, Senior Specialist $85–125K, Manager $100–145K, Senior Manager $130–180K, Director/Head $170–250K, Executive $250K–$500K+. |
| optional_title_examples | Practice Manager, Healthcare Operations Manager, Director of Clinical Operations, Hospital VP, Chief Operating Officer (Healthcare), Director of Healthcare Services |
| title_examples_by_context | Ambulatory practice: Practice Manager, Practice Administrator, Director of Operations. Hospital / acute care: Department Director, VP Operations, Hospital COO. Health system: VP Operations, SVP Operations, COO. Payer-side: Director of Provider Operations, Director of Network Operations. FQHC / community health: Operations Director, Chief Operating Officer (FQHC). Post-acute / home health: Administrator (state-licensed in some states), Director of Operations. |
| adjacent_families | OD-01, SL-02, SL-03, MP-01, RC-01 |
| bridge_families | OD-01 (Business Operations); SL-02 (Clinical / Allied Health); SA-02 (Management Consulting); MP-01 (Nonprofit Leadership) |

Spine 6 — Product & Technology

PT-01 — Product Management

| Field | Content |
| --- | --- |
| spine | Product & Technology |
| direction_family_name | Product Management |
| short_description | Ownership of products — discovery, definition, delivery, lifecycle. The triangulation of engineering, design, and business stakeholders. |
| work_texture | Cross-functional. Mix of analytical (data, user research), strategic (roadmap, positioning), operational (sprints, prioritization). Outcome-accountable rather than output-accountable. |
| core_evidence_required | (1) Direct product ownership — "owned product X," not "worked with product team"; (2) Roadmap or strategy accountability; (3) Cross-functional team leadership without formal authority; (4) Shipped product work that can be discussed substantively. |
| supporting_evidence | Engineering or design background with product transition; consulting with product domain pivot; founder experience with product as core work. |
| false_positive_signals | (1) "Worked closely with product" — proximity not ownership; (2) Project Management labeled as Product Management; (3) Marketing or Sales with "product input"; (4) Single-feature ownership labeled as PM — Specialist level at most. |
| level_bands_supported | Specialist, Senior Specialist, Manager (Senior PM), Senior Manager (Group/Lead PM), Director / Head, Executive |
| level_logic_notes | Specialist: APM or PM with feature/sub-product ownership. Senior Specialist: Senior PM with full product or major area ownership. Manager: Group/Lead PM with multi-product or large product ownership. Senior Manager: PM team leadership. Director/Head: Product function or major area ownership. Executive (CPO): enterprise product leadership. Cross-spine penalty: Significant from non-product. Engineering background helps; design background helps; consulting helps. |
| direct_path_conditions | Current PM role with product ownership; entry at same level; same product type and scale. |
| adjacent_path_conditions | From engineering, design, or technical roles with product ownership exposure; from product marketing with build-side involvement. Enter at Senior Specialist or Manager. |
| bridge_path_conditions | From non-product (consulting, strategy, sales): bridge through APM/PM at smaller company or internal pivot to PM with mentor support. Cross-industry PM moves (B2C to B2B, infrastructure to consumer): bridge through senior IC PM role at target product type. |
| credential_gate | None. credential_details: PM credentials (Reforge, Pragmatic) are soft signals only. typical_time_to_credential: 1–6 months. blocks_direct_entry: no. can_be_bridge_path: marginal. |
| fractional_notes | Fractional PM is real for early-stage companies. Often delivered as project-shaped product strategy engagements. Credibility requires multi-product launch portfolio. |
| ai_digital_treatment | Core. AI fluency increasingly expected; AI-product PM specifically is genuine evidence (not aspirational). |
| ai_durability | D2 — Stable but Changing. source: mixed. PM work being transformed by AI tooling. Junior PM work most exposed; senior judgment, stakeholder work, product strategy durable. AI-product PM rising. |
| financial_profile | Stable salaried with significant equity in tech. Specialist $130–170K, Senior PM $160–220K, Group/Lead PM $200–280K, Director $250–350K, VP $350–500K+, CPO $400K+. |
| optional_title_examples | Product Manager, Senior PM, Group PM, Lead PM, Principal PM, Director of Product, VP Product, CPO |
| adjacent_families | PT-02, PT-04, MG-06, SA-01 |
| bridge_families | PT-04 (Design); PT-02 (Engineering Leadership); SA-02 (Management Consulting) |

PT-02 — Engineering Leadership

| Field | Content |
| --- | --- |
| spine | Product & Technology |
| direction_family_name | Engineering Leadership |
| short_description | Engineering management — leading engineering teams, technical strategy, delivery quality, hiring and mentorship at scale. |
| work_texture | Management-shaped with technical depth. Mix of people management (hiring, coaching, performance), technical decisions (architecture, technical strategy), and delivery (planning, prioritization). Cross-functional with Product, Design, Operations. |
| core_evidence_required | (1) Engineering team management at scale; (2) Technical decision authority — not just delegating; (3) Delivery accountability — shipping things; (4) Multi-team or multi-domain leadership at senior tier. |
| supporting_evidence | Strong IC engineering before management; multi-stack experience; prior CTO or VP Engineering at smaller scale before bigger scale; technical conference speaking or thought leadership. |
| false_positive_signals | (1) Tech lead labeled as engineering manager without people responsibility; (2) Project manager for engineering team labeled as engineering manager; (3) "Managed engineers" without technical decision authority. |
| level_bands_supported | Manager (Engineering Manager), Senior Manager (Sr EM / Director-track), Director / Head, Executive (VP Eng / CTO) |
| level_logic_notes | Manager: EM with team of 4–10 engineers. Senior Manager: Sr EM with multi-team responsibility (manager of managers). Director/Head: Engineering Director with significant scope (function or major business unit). Executive (VP Eng / CTO): enterprise engineering leadership. Cross-spine penalty: Large from non-engineering. Technical depth is non-substitutable. |
| direct_path_conditions | Current engineering leadership role; entry at same level; same technical domain. |
| adjacent_path_conditions | From PT-03 (Senior IC) wanting management — enter at Manager level even with strong IC background. From IT-03 (Cloud/Infrastructure) with engineering management — enter at Manager. |
| bridge_path_conditions | From non-engineering: typically suppress unless substantial engineering background exists. Pure management background doesn't bridge into engineering leadership. |
| credential_gate | None. blocks_direct_entry: no. |
| fractional_notes | Fractional VP Engineering / Head of Engineering real for early-stage companies. Credibility requires prior in-house engineering leadership at Director+, multi-company scaling experience. |
| ai_digital_treatment | Core. AI engineering and AI-augmented engineering are reshaping the discipline. AI fluency increasingly expected at leadership tier. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: software engineering most-exposed category). IC engineering being transformed; engineering leadership work durable. |
| financial_profile | Stable salaried with significant equity in tech. Manager $200–300K total comp, Senior Manager $250–400K, Director $300–500K, VP Eng $400–700K, CTO $500K+. |
| optional_title_examples | Engineering Manager, Senior EM, Director of Engineering, VP Engineering, CTO |
| adjacent_families | PT-01, PT-03, IT-03, IT-01 |
| bridge_families | PT-03 (Technical Craft) — common origin; IT-03 (Cloud/Infrastructure); IT-01 (Enterprise IT Leadership) — for engineering leaders broadening into enterprise IT |

PT-03 — Technical Craft (Senior IC)

| Field | Content |
| --- | --- |
| spine | Product & Technology |
| direction_family_name | Technical Craft (Senior Individual Contributor) |
| short_description | Deep technical individual contribution at senior level — Staff, Principal, Distinguished engineering; technical architecture leadership without management responsibility. |
| work_texture | Hands-on technical work with technical influence and mentorship. Architectural decisions, technical strategy, hard problems. Less management overhead than engineering leadership. Often a deliberately-IC career choice. |
| core_evidence_required | (1) Multi-year senior IC engineering experience; (2) Technical depth in recognizable stack or domain; (3) Architectural or technical decision authority at scale; (4) Technical influence beyond own team. |
| supporting_evidence | Open source contributions; technical publications, talks, recognized expertise; track record of solving genuinely hard technical problems. |
| false_positive_signals | (1) "Senior Software Engineer" with no architectural scope — Senior Specialist, not Staff-level; (2) Long tenure mistaken for seniority; (3) Engineering Manager who "still codes" — that's PT-02; (4) Consultant without recognized domain depth. |
| level_bands_supported | Senior Specialist, Manager (Staff), Senior Manager (Principal), Director / Head (Distinguished / Fellow) |
| level_logic_notes | Senior Specialist: Senior Engineer with multi-year depth. Manager (Staff): technical leadership across team. Senior Manager (Principal): technical leadership across organization. Director/Head (Distinguished/Fellow): technical leadership at company level. Cross-spine penalty: Reputation and recognized work are the credentials; cross-spine entry requires technical recency-building. |
| direct_path_conditions | Current Staff+ engineering role; entry at same level; similar technical domain. |
| adjacent_path_conditions | From PT-02 (Engineering Leadership) wanting return to IC: enter at Staff or Principal depending on technical recency. |
| bridge_path_conditions | From non-IC back to senior IC: bridge through Senior Engineer role with technical recency-building. Cross-domain moves: bridge through specialist role in target domain. |
| credential_gate | None. Reputation and demonstrated work are the credentials. blocks_direct_entry: no. |
| fractional_notes | Fractional Principal/Staff Engineer real for specific technical engagements. Often project-shaped (architecture, technical leadership for specific build). |
| ai_digital_treatment | Core. AI engineering specifically (AI-fluent senior ICs, ML platform, AI tooling) is a distinct sub-domain. |
| ai_durability | D3 — Durable for senior tier; D1–D2 for adjacent junior tiers. source: mixed. Senior architectural and judgment work durable. AI engineering specifically is D4 — Future-Resilient. |
| financial_profile | Stable salaried with significant equity in tech. Senior Specialist $180–250K, Staff $250–380K, Principal $350–500K+, Distinguished/Fellow $500K+. |
| optional_title_examples | Staff Engineer, Principal Engineer, Distinguished Engineer, Architect, Tech Lead, Fellow |
| adjacent_families | PT-02, PT-05, IT-03, DA-02 |
| bridge_families | PT-02 (Engineering Leadership) — for managers returning to IC; PT-05 (Data Engineering) — for engineering-to-data specialization |

PT-04 — Design & User Experience

| Field | Content |
| --- | --- |
| spine | Product & Technology |
| direction_family_name | Design & User Experience |
| short_description | Product design, UX, design leadership — visual design, interaction design, user research, design systems. |
| work_texture | Craft-shaped and cross-functional. Mix of design work (visual, interaction, IA), research (user research, usability), and partnership (with PM, Engineering). Often portfolio-driven. |
| core_evidence_required | (1) Design work in product context with shipped outcomes; (2) UX ownership — research, design, or both; (3) Portfolio with substantive work; (4) Multi-product or multi-platform experience at senior level. |
| supporting_evidence | Design education or comparable portfolio; design system work; research methods depth; design management experience. |
| false_positive_signals | (1) Graphic design labeled as product design; (2) Marketing design without product context; (3) "Worked with designers" — proximity not design work. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Specialist: Product Designer with shipped work. Senior Specialist: Senior Designer with strong portfolio. Manager: Design Manager with team. Senior Manager: Design function for product line. Director/Head: Head of Design. Executive (Chief Design Officer): enterprise design leadership. Cross-spine penalty: Significant from marketing/graphic design without product context. |
| direct_path_conditions | Current design role with product context; entry at same level. |
| adjacent_path_conditions | From research role (user research) with design crossover — enter at Senior Specialist. From front-end engineering with design transition — enter at Specialist. |
| bridge_path_conditions | From graphic design or marketing design: bridge through product design role with portfolio-building. From research: bridge through design role. |
| credential_gate | None. Portfolio is the credential. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Design real for early-stage companies. Often project-shaped (design system, product redesign). |
| ai_digital_treatment | Core. AI design tools rapidly transforming the discipline. AI fluency expected; AI tooling alone doesn't establish design capability. |
| ai_durability | D2 — Stable but Changing. source: mixed. Execution heavily AI-transformed; design judgment, strategy, and research durable. |
| financial_profile | Stable salaried with equity in tech. Specialist $115–155K, Senior Specialist $145–195K, Manager $170–230K, Senior Manager $200–280K, Director/Head $230–340K, Executive $300K+. |
| optional_title_examples | Product Designer, Senior Designer, Staff Designer, Design Manager, Head of Design, VP Design, Chief Design Officer |
| adjacent_families | PT-01, PT-02, MG-02 |
| bridge_families | PT-01 (Product Management) — for designer-to-PM transitions; MG-02 (Brand) — for design leaders broadening into brand; IP-03 (Expert-Led Practice) — for design leaders pivoting independent |

PT-05 — Data Engineering & Platform

| Field | Content |
| --- | --- |
| spine | Product & Technology |
| direction_family_name | Data Engineering & Platform |
| short_description | Data infrastructure, pipelines, platform engineering for data — the engineering side of data work. |
| work_texture | Engineering-shaped, infrastructure-heavy. Mix of pipeline work, platform architecture, and reliability. Cross-functional with Data Science, Analytics, Product Engineering. |
| core_evidence_required | (1) Data platform ownership; (2) Pipeline architecture work; (3) Infrastructure-as-code experience; (4) Substantive data engineering depth. |
| supporting_evidence | Cloud certifications (AWS, GCP, Azure data services); strong software engineering background with data specialization; Spark, Kafka, dbt experience. |
| false_positive_signals | (1) SQL analyst labeled as data engineer; (2) Data science with some engineering exposure — route to DA-02; (3) Generic backend engineer without data platform work. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: Data Engineer with platform involvement. Senior Specialist: Senior Data Engineer with architectural decisions. Manager: Data Platform Engineering Manager. Senior Manager: Data Engineering function for business unit. Director/Head: Head of Data Engineering. Cross-spine penalty: Moderate from software engineering without data depth; significant from analytics without engineering depth. |
| direct_path_conditions | Current data engineering role; entry at same level; same technical stack. |
| adjacent_path_conditions | From PT-03 (Senior IC) with data focus — enter at Senior Specialist or Manager. From IT-03 (Cloud/Infrastructure) with data specialization — enter at Manager. |
| bridge_path_conditions | From analyst or data scientist roles: bridge through data engineering role with engineering depth-building. |
| credential_gate | None. credential_details: cloud certifications are soft signals. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Data Engineering Lead real for specific build projects. Project-shaped. |
| ai_digital_treatment | Core. AI-related data infrastructure is a rising sub-domain. AI fluency expected. |
| ai_durability | D3 — Durable. source: mixed. Senior engineering work durable; some pipeline work being AI-augmented. |
| financial_profile | Stable salaried with equity in tech. Specialist $140–185K, Senior Specialist $170–230K, Manager $200–270K, Senior Manager $240–320K, Director/Head $290–400K. |
| optional_title_examples | Data Engineer, Senior Data Engineer, Staff Data Engineer, Data Platform Engineering Manager, Head of Data Engineering, VP Data Platform |
| adjacent_families | PT-02, PT-03, IT-03, DA-02 |
| bridge_families | PT-03 (Technical Craft); IT-03 (Cloud/Infrastructure); DA-02 (Data Science) — for data scientists adding engineering depth |

Spine 7 — IT / Enterprise Systems

IT-01 — Enterprise IT Leadership

| Field | Content |
| --- | --- |
| spine | IT / Enterprise Systems |
| direction_family_name | Enterprise IT Leadership |
| short_description | IT function leadership — strategy, governance, IT operations across the business, vendor management, the technology backbone running the company. |
| work_texture | Cross-functional, vendor-heavy, governance-oriented. Mix of strategy (IT roadmap, architecture), operations (running IT services), and partnership (business systems, security, infrastructure). Different texture from Product & Technology — serves internal business, not external customers. |
| core_evidence_required | (1) IT function ownership (full or significant sub-function); (2) Vendor and budget management at scale; (3) Multi-team IT leadership; (4) Work spanning at least two of: business systems, infrastructure, security, IT operations, end-user services. |
| supporting_evidence | Background spanning multiple IT domains; experience leading IT through significant business changes (M&A, growth, transformation); cross-industry IT leadership. |
| false_positive_signals | (1) Software engineering or product engineering background — that's PT, not IT; (2) IT Support Manager labeled as IT Leadership; (3) Project Manager who delivered IT projects; (4) Business Systems Analyst without leadership scope. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive (CIO), Independent / Fractional Advisor |
| level_logic_notes | Manager: IT Manager with sub-function ownership. Senior Manager: Multi-team IT leadership. Director/Head: IT function ownership. Executive (CIO): enterprise IT leadership. Cross-spine penalty: Significant from PT spines (different work texture). Moderate from sub-IT specialties. |
| direct_path_conditions | Current IT leadership role with function ownership; same or comparable industry scale; entry at same level. |
| adjacent_path_conditions | From IT sub-spine (Security, Infrastructure, Business Systems) with broader exposure — enter at Manager or Senior Manager. |
| bridge_path_conditions | From Product/Tech engineering leadership: bridge through Head of IT in smaller organization or CIO-of-business-unit role. From non-IT with technology project leadership: bridge through Business Systems leadership (IT-04). |
| credential_gate | Soft. credential_details: ITIL, CISSP, TOGAF, vendor certifications (AWS, Microsoft) are soft signals. typical_time_to_credential: 3–12 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional CIO real for early-stage and PE-backed companies. Credibility requires prior in-house IT leadership at Director+, multi-company pattern recognition. |
| ai_digital_treatment | Core and increasing. Enterprise IT leaders increasingly accountable for AI infrastructure, AI governance, AI enablement. AI fluency becoming table stakes. |
| ai_durability | D2 — Stable but Changing. source: mixed. IT operations work heavily AI-affected; IT leadership work (vendor strategy, governance, business partnership) durable. |
| financial_profile | Stable salaried, mid-high income. Manager $120–170K, Senior Manager $150–220K, Director/Head $200–300K, CIO $300K+. Heavy variation by company size and industry. |
| optional_title_examples | IT Director, VP IT, CIO, Head of IT, Director of Enterprise Technology, VP Information Technology |
| adjacent_families | IT-02, IT-03, IT-04, DX-01 |
| bridge_families | IT-04 (Business Systems); PT-02 (Engineering Leadership); DX-01 (Digital Transformation) |

IT-02 — Information Security & Risk

| Field | Content |
| --- | --- |
| spine | IT / Enterprise Systems |
| direction_family_name | Information Security & Risk |
| short_description | Security leadership — programs, controls, compliance, risk, security architecture, security operations. The technical-and-operational side of information security. Note: corporate compliance lives in RC-01; this family is the technical security discipline. |
| work_texture | Risk-and-control-shaped. Mix of strategy (security program), architecture (controls, infrastructure security), operations (SOC, incident response), and compliance (frameworks, audits). Cross-functional with IT, Legal, Compliance, Engineering. |
| core_evidence_required | (1) Security program ownership or significant sub-function ownership; (2) Compliance work (SOC 2, ISO 27001, HIPAA security rule, PCI-DSS); (3) Security architecture or operations leadership; (4) Multi-domain security experience. |
| supporting_evidence | CISSP, CISM, CISA credentials; security architecture experience; incident response leadership; consulting with security practice. |
| false_positive_signals | (1) "Worked on security project" without function ownership; (2) IT generalist with security exposure; (3) Security analyst without leadership scope; (4) Compliance work labeled as security leadership — RC-01 territory if compliance-leaning. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive (CISO), Independent / Fractional Advisor |
| level_logic_notes | Specialist: Security Analyst with program involvement. Senior Specialist: Senior Security Engineer or Senior Analyst. Manager: Security Manager. Senior Manager: Security function for major sub-domain. Director/Head: Director of Security. Executive (CISO): enterprise security leadership. Cross-spine penalty: Significant from non-IT spines. Moderate from IT generalist without security depth. |
| direct_path_conditions | Current security leadership role; entry at same level; same industry. |
| adjacent_path_conditions | From IT-03 (Cloud/Infrastructure) with security focus — enter at Manager. From RC-01 (Compliance) with technical security crossover — enter at Manager. |
| bridge_path_conditions | From IT generalist or compliance: bridge through Security Manager role with credential (CISSP). |
| credential_gate | Soft, near-Hard at senior levels. credential_details: CISSP, CISM, CISA widely expected at Manager+; CCSP, OSCP, vendor certifications complement. typical_time_to_credential: 3–12 months. blocks_direct_entry: no but functional barrier. can_be_bridge_path: yes. |
| fractional_notes | Fractional CISO is established and growing, especially for fintech, healthtech, and growth-stage companies. Credibility requires CISSP plus prior in-house CISO or Director of Security experience. |
| ai_digital_treatment | Core and increasing. AI security (model security, AI-related threats) is rising sub-domain. AI fluency increasingly expected. |
| ai_durability | D3 — Durable. source: mixed. Security leadership and judgment work durable; SOC analyst work being heavily AI-augmented. |
| financial_profile | Stable salaried, mid-high to high income. Specialist $95–135K, Senior Specialist $125–175K, Manager $150–210K, Senior Manager $185–270K, Director/Head $230–340K, CISO $300K–$500K+. |
| optional_title_examples | Security Engineer, Senior Security Engineer, Security Manager, Director of Security, CISO, Head of Information Security |
| adjacent_families | IT-01, IT-03, RC-01, RC-03 |
| bridge_families | IT-01 (Enterprise IT Leadership); IT-03 (Cloud/Infrastructure); RC-01 (Compliance) — for compliance-leaning security paths |

IT-03 — Cloud, Infrastructure & DevOps

| Field | Content |
| --- | --- |
| spine | IT / Enterprise Systems |
| direction_family_name | Cloud, Infrastructure & DevOps |
| short_description | Infrastructure architecture, cloud, platform reliability — the foundational technology layer running applications and services. |
| work_texture | Engineering-and-operations-shaped. Mix of architecture (cloud design, infrastructure-as-code), operations (reliability, incidents), and platform (developer platforms). Cross-functional with Engineering, Security, IT. |
| core_evidence_required | (1) Infrastructure ownership at scale; (2) Cloud architecture decisions owned; (3) SRE/DevOps function work; (4) Reliability outcomes (uptime, incident management). |
| supporting_evidence | AWS Solutions Architect, GCP, Azure certifications; SRE methodology; container/Kubernetes depth; Terraform/IaC experience. |
| false_positive_signals | (1) "Used AWS" — usage not architecture; (2) Sysadmin labeled as DevOps; (3) Software engineer with some infra work — route to PT-03. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: Cloud/DevOps Engineer. Senior Specialist: Senior SRE or Cloud Architect. Manager: Infrastructure Engineering Manager. Senior Manager: Platform/Infrastructure function leadership. Director/Head: Head of Infrastructure or Head of Platform Engineering. Cross-spine penalty: Moderate from PT-02 (Engineering Leadership) without infrastructure depth. |
| direct_path_conditions | Current infrastructure role with architectural ownership; entry at same level. |
| adjacent_path_conditions | From PT-03 (Senior IC) with infrastructure focus — enter at Senior Specialist or Manager. From IT-01 with cloud transformation work — enter at Manager. |
| bridge_path_conditions | From sysadmin or operations: bridge through Cloud Engineer role plus certification. |
| credential_gate | Soft. credential_details: AWS, GCP, Azure certifications; CKA (Kubernetes); RHCA. typical_time_to_credential: 3–9 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Infrastructure real for early-stage companies. Often project-shaped (cloud migration, reliability remediation). |
| ai_digital_treatment | Core. AI infrastructure is rising sub-domain. AI fluency increasingly expected. |
| ai_durability | D3 — Durable for leadership; D2 for IC. source: mixed. Senior architecture and reliability work durable; some routine ops work being augmented. |
| financial_profile | Stable salaried with equity in tech. Specialist $130–175K, Senior Specialist $165–225K, Manager $195–270K, Senior Manager $235–320K, Director/Head $285–400K. |
| optional_title_examples | Cloud Engineer, Senior SRE, Cloud Architect, Infrastructure Engineering Manager, Director of Platform Engineering, VP Infrastructure |
| adjacent_families | IT-01, IT-02, PT-02, PT-03, PT-05 |
| bridge_families | PT-02 (Engineering Leadership); PT-05 (Data Engineering); IT-01 (Enterprise IT Leadership) |

IT-04 — Business Systems & Enterprise Applications

| Field | Content |
| --- | --- |
| spine | IT / Enterprise Systems |
| direction_family_name | Business Systems & Enterprise Applications |
| short_description | Owning the business application stack — ERP, CRM, HRIS, integrations, the systems that run business operations. |
| work_texture | Implementation-and-integration-shaped. Mix of strategy (systems architecture), implementation (configuration, integration), and operations (running and supporting the stack). Cross-functional with all business functions. |
| core_evidence_required | (1) Business systems ownership; (2) ERP/CRM implementation or operation; (3) Integration architecture; (4) Multi-platform fluency or deep platform expertise. |
| supporting_evidence | Salesforce, NetSuite, Workday, SAP, Oracle, Microsoft Dynamics certifications; prior systems integrator background; consulting with systems practice. |
| false_positive_signals | (1) "Used Salesforce" — system usage not system ownership; (2) Business analyst with systems exposure; (3) IT generalist with ERP project participation. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: Business Systems Analyst with implementation work. Senior Specialist: Senior BSA or Solution Architect. Manager: Business Systems Manager. Senior Manager: Business Systems function for major platform. Director/Head: Head of Business Systems or VP Enterprise Applications. Cross-spine penalty: Moderate from IT-01 generalists; significant from non-IT. |
| direct_path_conditions | Current business systems role; entry at same level. |
| adjacent_path_conditions | From WI-03 (HR Tech) with broader systems scope — enter at Manager. From IT-01 with systems focus — enter at Manager. |
| bridge_path_conditions | From business analyst roles: bridge through Senior BSA role plus platform certification. |
| credential_gate | Soft. credential_details: Salesforce, Workday, SAP, NetSuite certifications. typical_time_to_credential: 3–9 months. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Business Systems real for growth-stage companies and PE portfolio companies. Often project-shaped (ERP implementation, CRM redesign). |
| ai_digital_treatment | Core. Business systems being heavily AI-affected (intelligent automation, AI-augmented configuration). AI fluency increasingly relevant. |
| ai_durability | D2 — Stable but Changing. source: mixed. Configuration and routine implementation being augmented; architecture and integration work durable. |
| financial_profile | Stable salaried. Specialist $90–130K, Senior Specialist $115–160K, Manager $140–195K, Senior Manager $170–230K, Director/Head $205–295K. |
| optional_title_examples | Business Systems Analyst, Senior BSA, Solution Architect, Business Systems Manager, Director of Enterprise Applications, VP Business Systems |
| adjacent_families | IT-01, IT-03, WI-03 |
| bridge_families | IT-01 (Enterprise IT Leadership); WI-03 (HR Tech); CS-04 (RevOps) — for CRM-centric specialists |

Spine 8 — Digital Transformation / Automation / AI Enablement

DX-01 — Digital Transformation Program Leadership

| Field | Content |
| --- | --- |
| spine | Digital Transformation / Automation / AI Enablement |
| direction_family_name | Digital Transformation Program Leadership |
| short_description | Leading large-scale, technology-driven business change — multi-year, cross-functional programs combining technology adoption, process redesign, and organizational change. |
| work_texture | Program-shaped, multi-year, multi-stakeholder. Mix of strategy (defining the change), execution (running the programs), change leadership (bringing the organization along). Often C-suite-facing. |
| core_evidence_required | (1) Ownership of substantive transformation program — multi-year, multi-function, measurable business outcomes; (2) Change management depth; (3) Technology fluency without necessarily being a technologist; (4) Documented business outcomes from transformation work. |
| supporting_evidence | Background spanning consulting and operating roles; experience in multiple transformation programs; M&A integration experience; PMO or transformation office leadership. |
| false_positive_signals | (1) "Led digital projects" — project delivery is not transformation; (2) IT implementation labeled as transformation; (3) Consultant on transformation engagements without execution accountability; (4) "Used AI tools to transform workflow" — tooling adoption is not transformation; (5) Generic operational leadership labeled retroactively as "transformation." |
| level_bands_supported | Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Senior Manager: transformation program leadership for major initiative. Director/Head: Head of Transformation. Executive: Chief Transformation Officer. Cross-spine penalty: From IT-01: significant — IT leadership and transformation leadership are different work. From SA-02: small — consulting transformation work is closely adjacent. |
| direct_path_conditions | Current transformation leadership role with program ownership; same industry; entry at same level. |
| adjacent_path_conditions | From SA-02 with transformation engagement experience and operating accountability — enter at Senior Manager or Director. From OD-02 with large-scale transformation exposure — enter at Senior Manager. |
| bridge_path_conditions | From IT Leadership: bridge through transformation program ownership inside current role for 18–24 months. From business operations: bridge through Head of Transformation or Chief of Staff with explicit transformation mandate. This family suppresses heavily — many candidates' transformation evidence is too thin. |
| credential_gate | None. credential_details: PMP, Prosci, transformation-specific credentials are soft signals only. typical_time_to_credential: 3–6 months. blocks_direct_entry: no. can_be_bridge_path: marginal. |
| fractional_notes | Fractional Chief Transformation Officer real for specific transformation engagements. Often project-shaped (M&A integration, technology-driven transformation). |
| ai_digital_treatment | Standalone spine — but only when transformation evidence is substantive. DX-03 (AI Enablement) is the AI-specific sibling. Aspirational AI signals should never produce this family — suppress instead. |
| ai_durability | D3 — Durable. source: mixed. Transformation leadership work is heavily judgment-based and stakeholder-intensive. The substantive work (technology adoption, process design) is what's being transformed by AI, but leading transformation is itself durable. |
| financial_profile | Stable salaried, mid-high to high income. Senior Manager $160–220K, Director/Head $220–320K, Executive (Chief Transformation Officer) $300K+. Consulting-firm premium significant for SA-04 variants. |
| optional_title_examples | Head of Transformation, VP Digital Transformation, Chief Transformation Officer, Director of Strategic Programs, Transformation Program Lead |
| adjacent_families | DX-02, DX-03, IT-01, SA-04, OD-02, OD-06 |
| bridge_families | SA-02 (Management Consulting); OD-02 (Program Leadership); IT-01 (Enterprise IT Leadership); OD-06 (Change Management) |

DX-02 — Business Process Automation

| Field | Content |
| --- | --- |
| spine | Digital Transformation / Automation / AI Enablement |
| direction_family_name | Business Process Automation |
| short_description | Process redesign and automation — workflow design, RPA, integration, business process management. The discipline of making business operations more efficient through technology. |
| work_texture | Process-shaped and implementation-heavy. Mix of process analysis (current state, future state), design (automation design), and implementation (workflow tools, RPA, integration). |
| core_evidence_required | (1) Implemented automation programs with measurable outcomes; (2) Process redesign ownership; (3) Workflow or RPA tool experience (UiPath, Automation Anywhere, Power Automate); (4) Measurable process outcomes (cycle time, cost, throughput). |
| supporting_evidence | Six Sigma, Lean Six Sigma credentials; RPA tool certifications; BPM (Business Process Management) credentials; consulting with process practice. |
| false_positive_signals | (1) "Used Power Automate" — usage not implementation at scale; (2) Process documentation labeled as process automation; (3) IT person who "automated some tasks" without scope. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: Automation Specialist or RPA Developer. Senior Specialist: Senior Automation specialist with multi-process ownership. Manager: Automation Manager or Center of Excellence lead. Senior Manager: Automation function leadership. Director/Head: Head of Automation or BPM. Cross-spine penalty: Moderate from generic process improvement (OD-02 territory); significant from non-process backgrounds. |
| direct_path_conditions | Current process automation role with implementation ownership; entry at same level. |
| adjacent_path_conditions | From OD-02 (Program Leadership) with automation focus — enter at Manager. From IT-04 (Business Systems) with automation specialization — enter at Manager. |
| bridge_path_conditions | From operations or business roles: bridge through Automation Specialist role plus tool certification. |
| credential_gate | Soft. credential_details: Six Sigma Black Belt, RPA tool certifications, BPM credentials. typical_time_to_credential: 3–12 months. blocks_direct_entry: no. |
| fractional_notes | Fractional automation lead real for specific process redesign projects. Project-shaped. |
| ai_digital_treatment | Core. AI automation (intelligent process automation, AI-augmented workflows) is the rising direction within this family. AI fluency expected. |
| ai_durability | D2 — Stable but Changing. source: mixed. Routine automation work itself being augmented by AI; strategic automation work and process redesign judgment durable. |
| financial_profile | Stable salaried. Specialist $85–125K, Senior Specialist $110–155K, Manager $135–185K, Senior Manager $165–225K, Director/Head $200–290K. |
| optional_title_examples | Automation Specialist, RPA Developer, Process Automation Manager, Head of Automation, Director of Business Process Management |
| adjacent_families | DX-01, DX-03, IT-04, OD-02 |
| bridge_families | OD-02 (Program Leadership); IT-04 (Business Systems); SA-04 (Transformation Advisory) |

DX-03 — Enterprise AI Enablement

| Field | Content |
| --- | --- |
| spine | Digital Transformation / Automation / AI Enablement |
| direction_family_name | Enterprise AI Enablement |
| short_description | Bringing AI into business operations — use case identification, deployment, change management, business outcomes from AI. The deployment-and-adoption side of AI inside organizations. |
| work_texture | Implementation-and-adoption-shaped. Mix of use case strategy, deployment (often partnering with engineering), change management (the people side of AI adoption), and outcomes measurement. |
| core_evidence_required | (1) Substantive AI implementation work — not theoretical interest, but deployments; (2) AI deployment with business adoption — measurable usage, not just go-live; (3) Change management around AI; (4) Business outcomes from AI work — productivity, revenue, cost. |
| supporting_evidence | Prior consulting with AI practice; software/data background with AI specialization; transformation leader with AI program focus. |
| false_positive_signals | (1) "Used ChatGPT for work" — tool usage not AI enablement; (2) "Implemented an AI tool" without business adoption; (3) Aspirational AI interest without sustained AI work; (4) AI research without deployment focus — route to DA-02. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: AI use case ownership with deployment. Manager: AI enablement program for function. Senior Manager: AI enablement function leadership. Director/Head: Head of AI Enablement, Chief AI Officer at smaller companies. Cross-spine penalty: Significant from non-implementation backgrounds. AI fluency without deployment evidence suppresses. |
| direct_path_conditions | Current AI enablement leadership role with deployment outcomes; entry at same level. |
| adjacent_path_conditions | From DX-01 (Digital Transformation) with AI focus — enter at Manager. From PT-02 (Engineering Leadership) with AI implementation — enter at Manager. |
| bridge_path_conditions | From transformation or program leadership: bridge through AI program ownership for 12–18 months with measurable adoption. Aspirational entries suppress. |
| credential_gate | None. Soft credentials emerging (vendor certifications, AI-specific programs) but immature market. blocks_direct_entry: no. |
| fractional_notes | Fractional AI advisor and fractional Head of AI Enablement emerging. Credibility requires named AI deployment portfolio; many candidates claiming this work lack the deployment evidence. Maturing as a category. |
| ai_digital_treatment | Standalone — this family is about deploying AI. Boundary rule with RC-03: DX-03 is about enabling AI — use cases, deployment, workflow integration, business adoption, implementation, change management, operational outcomes. RC-03 is about governing AI — policy, oversight, risk, privacy, controls, responsible AI, regulatory compliance. If a person has both, classify by dominant evidence: deployment/adoption evidence → DX-03 leads; policy/governance/oversight evidence → RC-03 leads; both strong → one primary, the other adjacent. |
| ai_durability | D4 — Future-Resilient. source: mixed. Strong demand trajectory and the work itself is about deploying AI rather than being displaced by it. The labor market for AI enablement leadership is growing rapidly. |
| financial_profile | Stable salaried with significant premium currently. Senior Specialist $140–195K, Manager $175–240K, Senior Manager $215–290K, Director/Head $260–370K, Head of AI Enablement / Chief AI Officer $300K+. AI premium currently meaningful but unclear how durable. |
| optional_title_examples | AI Program Manager, Head of AI Enablement, Director of AI Transformation, Chief AI Officer (smaller companies), VP AI Implementation |
| adjacent_families | DX-01, DX-02, RC-03, PT-02, SA-04 |
| bridge_families | DX-01 (Digital Transformation); PT-02 (Engineering Leadership) — for engineering leaders pivoting; SA-02 (Management Consulting) — for consultants with AI practice |

Spine 9 — Data / Analytics / Business Intelligence

DA-01 — Analytics & Decision Support Leadership

| Field | Content |
| --- | --- |
| spine | Data / Analytics / Business Intelligence |
| direction_family_name | Analytics & Decision Support Leadership |
| short_description | Leading analytics functions that serve business decisions — BI, embedded analytics, reporting infrastructure, analytical decision support consumed by leadership. |
| work_texture | Mix of technical work (data, methods, infrastructure) and business partnership (translating analysis into decisions). Often serves multiple business functions. Heavy stakeholder management with non-technical leaders. |
| core_evidence_required | (1) Analytics function ownership; (2) Outputs consumed by senior leadership for decisions, not just reporting; (3) Technical depth or strong technical leadership credibility; (4) Cross-functional business partnership. |
| supporting_evidence | Background spanning multiple analytical domains (finance, marketing, ops, people); experience scaling analytics through company growth; consulting analytics background. |
| false_positive_signals | (1) BI/reporting work labeled as analytics leadership — DA-03 territory; (2) Data science IC work without leadership scope — DA-02; (3) "Used analytics tools"; (4) Domain-specific analytics (people, marketing) — route to domain family. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Manager: analytics team or function ownership. Senior Manager: analytics function for business unit. Director/Head: enterprise analytics function. Executive (Chief Analytics Officer): enterprise analytics leadership. Cross-spine penalty: Moderate from non-analytics backgrounds; pure business background entering analytics leadership typically suppresses. |
| direct_path_conditions | Current analytics leadership role; entry at same level; same or comparable industry. |
| adjacent_path_conditions | From domain-specific analytics with cross-functional broadening — enter at Manager or Senior Manager. From DA-02 with leadership transition — enter at Manager. |
| bridge_path_conditions | From non-analytics: bridge through analytics manager role with credential and technical credibility. Pure business background into analytics leadership: typically suppress. |
| credential_gate | None. credential_details: analytics credentials, statistics graduate work, data science certifications are soft signals. blocks_direct_entry: no. |
| fractional_notes | Fractional Head of Analytics real for growth-stage companies. Often paired with embedded analyst team. |
| ai_digital_treatment | Core. Heavily transformed by AI. Strong AI fluency table stakes. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: analytical roles among most exposed). Leadership tier durable; technical execution heavily transformed. |
| financial_profile | Stable salaried, mid-high income. Manager $150–200K, Senior Manager $180–250K, Director/Head $220–320K, VP/Chief Analytics Officer $300K+. Tech and finance premium. |
| optional_title_examples | Head of Analytics, VP Analytics, Director of Business Intelligence, Chief Analytics Officer, Head of Decision Sciences |
| adjacent_families | DA-02, DA-03, WI-02, FC-01, PT-05 |
| bridge_families | DA-02 (Data Science); DA-03 (BI & Reporting); SA-01 (Corporate Strategy) |

DA-02 — Data Science & Quantitative Methods

| Field | Content |
| --- | --- |
| spine | Data / Analytics / Business Intelligence |
| direction_family_name | Data Science & Quantitative Methods |
| short_description | Applied data science — modeling, prediction, experimentation, machine learning at the application layer. |
| work_texture | Quantitative and project-shaped. Mix of methodology (modeling, statistical methods, ML), engineering (productionizing models), and communication (translating to stakeholders). Cross-functional with Product, Engineering, Business. |
| core_evidence_required | (1) Shipped data science work — models deployed or experiments run; (2) Statistical or ML methodology depth; (3) Experimentation ownership; (4) Quantitative outputs that drove decisions. |
| supporting_evidence | Graduate work in quantitative field; published research; Kaggle or comparable; ML engineering crossover. |
| false_positive_signals | (1) Data analyst labeled as data scientist — route to DA-01 or DA-03; (2) "Used Python" — tool usage not data science; (3) BI work labeled as data science. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: Data Scientist with project ownership. Senior Specialist: Senior Data Scientist with methodology depth. Manager: Data Science Manager. Senior Manager: Data Science function for business unit. Director/Head: Head of Data Science. Cross-spine penalty: Significant from non-quantitative backgrounds. |
| direct_path_conditions | Current data science role with shipped work; entry at same level. |
| adjacent_path_conditions | From DA-01 (Analytics Leadership) with quantitative depth — enter at Senior Specialist or Manager. From PT-05 (Data Engineering) with modeling work — enter at Senior Specialist. |
| bridge_path_conditions | From analytics or BI: bridge through Data Science Specialist role plus quantitative credential. |
| credential_gate | None. credential_details: graduate degree (MS/PhD) in quantitative field is heavily weighted soft credential; bootcamps marginal. typical_time_to_credential: 1–4 years. blocks_direct_entry: no but functional barrier at senior levels. |
| fractional_notes | Fractional data scientist real for specific projects. Project-shaped. |
| ai_digital_treatment | Core. AI/ML is the substance of this family. Strong evidence-based depth required; tool usage doesn't substitute. |
| ai_durability | D2 — Stable but Changing. source: mixed. Modeling work being heavily AI-augmented; senior methodology and judgment durable; AI engineering specifically rising. |
| financial_profile | Stable salaried with equity in tech. Specialist $140–195K, Senior Specialist $175–240K, Manager $210–290K, Senior Manager $255–350K, Director/Head $310–430K. Premium for ML engineering. |
| optional_title_examples | Data Scientist, Senior Data Scientist, Staff Data Scientist, Data Science Manager, Director of Data Science, VP Data Science |
| adjacent_families | DA-01, DA-03, PT-05, WI-02 |
| bridge_families | DA-01 (Analytics Leadership); PT-05 (Data Engineering); PT-03 (Technical Craft) |

DA-03 — Business Intelligence & Reporting

| Field | Content |
| --- | --- |
| spine | Data / Analytics / Business Intelligence |
| direction_family_name | Business Intelligence & Reporting |
| short_description | Operational reporting and BI — dashboards, reporting systems, metric definition, BI architecture. |
| work_texture | Implementation-and-systems-shaped. Mix of metric definition (KPI frameworks), implementation (BI tools, dashboards), and stakeholder partnership (understanding what business needs). |
| core_evidence_required | (1) BI ownership — not just dashboard building, but framework design; (2) Reporting infrastructure work; (3) Metric framework development; (4) Multi-platform BI experience or deep platform. |
| supporting_evidence | Tableau, Power BI, Looker certifications; SQL depth; data modeling experience. |
| false_positive_signals | (1) "Built dashboards" without framework or infrastructure scope; (2) Data analyst with BI exposure; (3) Excel-heavy reporting without BI platform depth. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head |
| level_logic_notes | Specialist: BI Analyst. Senior Specialist: Senior BI with framework ownership. Manager: BI Manager. Senior Manager: BI function. Director/Head: Head of BI. Cross-spine penalty: Moderate from generic analytics. |
| direct_path_conditions | Current BI role with framework ownership; entry at same level. |
| adjacent_path_conditions | From DA-01 (Analytics Leadership) with BI focus — enter at Senior Specialist. From IT-04 with reporting work — enter at Senior Specialist. |
| bridge_path_conditions | From data analyst: bridge through Senior BI Analyst with platform certification. |
| credential_gate | None. credential_details: Tableau, Power BI, Looker certifications are soft. typical_time_to_credential: 1–3 months. blocks_direct_entry: no. |
| fractional_notes | Fractional BI lead real for specific implementation projects. |
| ai_digital_treatment | Core. AI is reshaping BI (natural language queries, automated insights). AI fluency expected. |
| ai_durability | D1 — Pressured. source: mixed (Anthropic Economic Index: BI and reporting roles heavily exposed). Routine reporting heavily affected; framework and architecture work more durable. |
| financial_profile | Stable salaried, mid income. Specialist $80–115K, Senior Specialist $105–145K, Manager $130–180K, Senior Manager $160–215K, Director/Head $195–280K. |
| optional_title_examples | BI Analyst, Senior BI Developer, BI Manager, Head of BI, Director of Reporting & Analytics |
| adjacent_families | DA-01, DA-02, IT-04 |
| bridge_families | DA-01 (Analytics Leadership); DA-02 (Data Science); IT-04 (Business Systems) |

Spine 10 — Strategy & Advisory

SA-01 — Corporate Strategy & Internal Advisory

| Field | Content |
| --- | --- |
| spine | Strategy & Advisory |
| direction_family_name | Corporate Strategy & Internal Advisory |
| short_description | Internal strategy work — strategic planning, market entry, competitive analysis, internal consulting. The strategy function inside operating companies. |
| work_texture | Project-shaped and analytical. Mix of strategy work (planning, market analysis), advisory (advising senior leadership), and execution support (translating strategy into operating plans). Often C-suite-facing. |
| core_evidence_required | (1) Strategy function work — not just "strategic" projects but dedicated strategy work; (2) Strategic planning ownership; (3) Senior leadership-facing analysis; (4) Multi-domain strategy work. |
| supporting_evidence | MBA from top program; prior consulting (MBB or comparable) before in-house transition; investment banking transition. |
| false_positive_signals | (1) "Strategic projects" without strategy function scope; (2) Marketing strategy labeled as corporate strategy — route to MG-01; (3) Business operations labeled as corporate strategy — route to OD-01. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head, Executive (Chief Strategy Officer) |
| level_logic_notes | Senior Specialist: strategy associate or analyst with project ownership. Manager: strategy manager. Senior Manager: strategy function for business unit. Director/Head: corporate strategy function. Executive: CSO. Cross-spine penalty: Moderate from consulting (SA-02) — closely adjacent; significant from non-strategy operating roles. |
| direct_path_conditions | Current corporate strategy role; entry at same level. |
| adjacent_path_conditions | From SA-02 (Management Consulting) with in-house experience — enter at Manager or Senior Manager. From OD-01 with strategic projects — enter at Senior Specialist. |
| bridge_path_conditions | From non-strategy roles: bridge through strategy manager role with MBA or consulting credential. |
| credential_gate | None. credential_details: MBA from top program is heavily weighted soft credential. blocks_direct_entry: no. |
| fractional_notes | Fractional CSO real for growth-stage and PE-backed companies. Often paired with specific strategic initiative. |
| ai_digital_treatment | Modifier and increasingly core. AI tools transforming strategy research, modeling, scenario work. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable. source: mixed. Analytical work heavily augmented; strategic judgment and stakeholder work durable. |
| financial_profile | Stable salaried with significant bonus. Senior Specialist $140–195K, Manager $170–240K, Senior Manager $210–290K, Director/Head $260–380K, CSO $350K+. |
| optional_title_examples | Strategy Manager, Director of Corporate Strategy, VP Strategy, Head of Strategy, Chief Strategy Officer |
| adjacent_families | SA-02, SA-03, OD-01, WI-01 |
| bridge_families | SA-02 (Management Consulting); OD-01 (Business Operations); FC-01 (Corporate Finance) |

SA-02 — Management Consulting

| Field | Content |
| --- | --- |
| spine | Strategy & Advisory |
| direction_family_name | Management Consulting |
| short_description | External consulting — client-facing strategy and operational engagements, typically within a consulting firm structure, with partner-track career economics. |
| work_texture | Project-shaped (weeks to months per engagement). Heavy client-facing work. Travel-prone historically, hybrid now. Mix of analytical work, stakeholder management, and firm-building at senior levels. Intense work culture. |
| core_evidence_required | (1) Prior consulting firm experience (or genuinely comparable client-engagement experience); (2) Engagement leadership — not just team-member contribution; (3) Client relationship ownership at senior levels; (4) Industry or functional specialization that the market recognizes. |
| supporting_evidence | MBA from recognized program; prior firm tenure at MBB, Big 4, or strong boutique; published thought leadership. |
| false_positive_signals | (1) Internal consulting / corporate strategy labeled as management consulting — route to SA-01; (2) Boutique advisory labeled as management consulting — route to SA-04 or IP-01; (3) "Advisor" labeling without firm context; (4) Implementation work labeled as strategy consulting. |
| level_bands_supported | Specialist (Associate/Consultant), Senior Specialist (Senior Associate/Senior Consultant), Manager (Engagement Manager), Senior Manager (Principal/Senior Manager), Director / Head (Partner), Executive (Senior Partner/MD), Independent / Fractional Advisor |
| level_logic_notes | Specialist: Associate at consulting firm. Senior Specialist: Senior Associate. Manager: Engagement Manager / Project Lead. Senior Manager: Principal / Senior Manager. Director/Head: Partner. Executive: Senior Partner / MD. Cross-spine penalty: Significant for cross-firm-tier moves (consulting recruiting is selective). Industry-to-consulting moves at senior level very rare. |
| direct_path_conditions | Current consulting role; lateral move within consulting tier; same or comparable firm tier. |
| adjacent_path_conditions | From industry into consulting: typically only at Senior Specialist or Manager with industry expertise as entry value. From SA-01 (Corporate Strategy) with deep industry depth — enter at Manager. |
| bridge_path_conditions | Cross-firm-tier moves: bridge through demonstrated case interviews and recruiting cycle. Industry-to-consulting moves at senior level: very rare; bridge through Partner-track lateral with deep functional expertise. Suppresses for most mid-career generalists. |
| credential_gate | Soft. credential_details: MBA from top program is heavily weighted soft credential. blocks_direct_entry: no but material market disadvantage without. can_be_bridge_path: yes for industry entrants. |
| fractional_notes | Most fractional/independent consulting work lives in IP-01 (Solo Advisory) post-firm. Within-firm fractional is not the standard work model. |
| ai_digital_treatment | Modifier and increasingly core. AI fluency rapidly becoming baseline expectation. AI-focused consulting practices growing. |
| ai_durability | D3 — Durable. source: mixed (Anthropic Economic Index: analytical/strategic work exposed but augmented). Consulting heavily judgment-based, client-relationship-driven. Execution being transformed; partnership and judgment work durable. |
| financial_profile | Stable salaried with significant bonus, scaling steeply at senior levels. Associate $150–200K total comp, Senior Associate $200–280K, Manager $250–350K, Principal $350–500K, Partner $500K–$1M+. |
| optional_title_examples | Associate, Senior Associate, Manager, Principal, Partner, Senior Partner, Managing Director (consulting) |
| adjacent_families | SA-01, SA-03, SA-04, IP-01 |
| bridge_families | SA-01 (Corporate Strategy); SA-04 (Transformation Advisory); IP-01 (Solo Advisory Practice) — typical post-firm path |

SA-03 — M&A and Corporate Development

| Field | Content |
| --- | --- |
| family_id | SA-03 |
| spine | Strategy & Advisory |
| direction_family_name | M&A and Corporate Development |
| short_description | Deal-led growth — acquisitions, divestitures, integrations, investment decisions at the corporate level. The corporate side of deal work, distinct from advisory or investor-side work. |
| work_texture | Deal-shaped and analytical. Mix of strategy (target identification, market screening), execution (deal management, due diligence, negotiation), and post-deal (integration, value creation, synergy tracking). Cross-functional with Finance, Legal, Strategy, and operating leadership. Long-cycle outcomes; cyclical workload around active deals. |
| core_evidence_required | (1) M&A deal experience as principal (corporate buyer or seller) — not advisor; (2) Corporate development function work — pipeline, target screening, deal execution; (3) Integration program leadership or post-deal value-creation work; (4) Investment thesis development. |
| supporting_evidence | Investment banking transition; MBA from recognized program; private equity transition with corporate exit; corporate strategy background with sustained deal exposure; CFA. |
| false_positive_signals | (1) "Worked on an acquisition" without deal-process accountability — proximity is not ownership; (2) Investment banker with no in-house experience labeled as Corp Dev — banking and Corp Dev are different work textures despite analytical overlap; (3) Strategy work that mentioned M&A in passing; (4) Post-merger operating role labeled as integration program leadership without explicit integration mandate; (5) Single-deal exposure scaled up to function ownership. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive (Chief Corporate Development Officer) |
| level_logic_notes | Specialist: Corp Dev Analyst with deal-process involvement. Senior Specialist: Senior Associate with deal ownership components. Manager: Corp Dev Manager with named deal leadership. Senior Manager: Corp Dev function for business unit or major sub-function (e.g., integration office leadership). Director/Head: Head of Corporate Development. Executive: Chief Corporate Development Officer or comparable. Cross-spine penalty: From investment banking (closely adjacent to FC-03): small at Specialist and Senior Specialist; banker-to-Corp-Dev moves at senior level still require operating-context credibility. From SA-01 (Corporate Strategy): moderate — closely adjacent but deal-execution depth matters. From other spines: significant — Corp Dev requires specific deal-process fluency that doesn't transfer from generic strategy or operating work. |
| direct_path_conditions | Current Corp Dev role with deal ownership; entry at same level; same industry. |
| adjacent_path_conditions | From investment banking with sustained M&A practice — enter at Senior Specialist or Manager depending on deal scale. From FC-03 (PE/Investing) with corporate transition — enter at Manager. From SA-01 (Corporate Strategy) with explicit M&A involvement — enter at Senior Specialist. |
| bridge_path_conditions | From non-deal backgrounds: bridge through Corp Dev Specialist role with MBA or deal experience-building for 18–24 months. From operating-only roles (no deal exposure): typically suppress at senior levels; can route Bridge-based at Specialist with explicit credentialing. |
| credential_gate | None. credential_details: MBA from recognized program and CFA are soft but heavily weighted credentials at Manager+ levels. blocks_direct_entry: no. can_be_bridge_path: yes — MBA serves as common bridge for cross-spine entrants. |
| fractional_notes | Fractional Head of Corp Dev is real for specific acquisition processes — typically project-shaped (12–24 months around a named transaction or integration). Credibility requires prior in-house Corp Dev or banking experience at Director-equivalent. Less mature as ongoing fractional category than fractional CFO. |
| ai_digital_treatment | Modifier and increasingly core. AI tools are transforming target screening, due diligence acceleration, and integration analytics. AI fluency increasingly relevant for Corp Dev leaders; AI tooling alone doesn't establish deal credibility. |
| ai_durability | D3 — Durable. source: mixed. Deal-making, negotiation, and integration leadership are heavily judgment-based and relational. Routine due diligence and analytical work being augmented; senior deal work and post-deal integration durable. |
| financial_profile | Stable salaried with significant bonus, scaling with deal scale and company size. Specialist $130–180K total comp, Senior Specialist $170–250K, Manager $230–330K, Senior Manager $300–430K, Director/Head $400–600K, Executive (Chief Corporate Development Officer) $500K+. Heavy industry variation; financial services and tech premiums significant. |
| optional_title_examples | Corporate Development Manager, Senior Manager Corporate Development, Director of Corporate Development, VP Corporate Development, Head of M&A, Chief Corporate Development Officer |
| adjacent_families | SA-01, SA-02, FC-01, FC-03 |
| bridge_families | SA-02 (Management Consulting); FC-03 (Investment, Private Capital & Venture); FC-01 (Corporate Finance & FP&A Leadership) |

SA-04 — Transformation Advisory

| Field | Content |
| --- | --- |
| spine | Strategy & Advisory |
| direction_family_name | Transformation Advisory |
| short_description | Specialized advisory work — operational, organizational, or technology transformation as an advisor. The consulting work focused on substantive transformation, distinct from general strategy consulting. |
| work_texture | Project-shaped with longer engagement horizons than strategy consulting. Mix of advisory work (advising clients on transformation), implementation oversight (often paired with execution work), and partnership with client teams. |
| core_evidence_required | (1) Advisory engagements on transformation; (2) Specialist domain depth (operations, technology, organizational, financial); (3) Client-facing transformation work with execution accountability; (4) Multi-engagement track record. |
| supporting_evidence | Prior consulting tenure (Big 4 transformation practice, boutique transformation firm); prior in-house transformation leadership transitioning to advisory; published methodology. |
| false_positive_signals | (1) Strategy consulting without transformation specialization — route to SA-02; (2) "Worked on transformation projects" without advisory accountability; (3) Internal transformation labeled as advisory — route to DX-01. |
| level_bands_supported | Senior Specialist, Manager, Senior Manager, Director / Head (Partner), Independent / Fractional Advisor |
| level_logic_notes | Senior Specialist: Senior Consultant with transformation focus. Manager: Engagement Manager. Senior Manager: Principal. Director/Head: Partner. Independent/Fractional: post-firm advisory. Cross-spine penalty: From SA-02 (general consulting): small. From in-house transformation (DX-01): moderate — advisory work has different texture. |
| direct_path_conditions | Current transformation advisory role; entry at same level. |
| adjacent_path_conditions | From SA-02 with transformation specialization — enter at Manager. From DX-01 with consulting transition — enter at Manager. |
| bridge_path_conditions | From operations or HR leadership: bridge through senior advisory role with named methodology. |
| credential_gate | None. credential_details: MBA, Prosci, Lean Six Sigma are soft credentials. blocks_direct_entry: no. |
| fractional_notes | Most transformation advisory at senior levels is delivered as independent practice (IP-01) or boutique firm (IP-02). |
| ai_digital_treatment | Modifier and increasingly core. AI is reshaping transformation methodologies. AI fluency increasingly expected. |
| ai_durability | D3 — Durable. source: judgment_based. Advisory work heavily judgment-based and relational. |
| financial_profile | Stable salaried with significant bonus at firms; variable at independent level. Senior Specialist $160–230K, Manager $220–320K, Senior Manager $290–420K, Partner $450K–$800K+. |
| optional_title_examples | Senior Consultant (transformation), Engagement Manager, Principal, Partner, Transformation Advisor, Specialist Partner |
| adjacent_families | SA-02, DX-01, OD-06, PO-04 |
| bridge_families | SA-02 (Management Consulting); DX-01 (Digital Transformation); IP-01 (Solo Advisory Practice) |

Spine 11 — Finance & Capital

FC-01 — Corporate Finance & FP&A Leadership

| Field | Content |
| --- | --- |
| spine | Finance & Capital |
| direction_family_name | Corporate Finance & FP&A Leadership |
| short_description | Senior finance leadership inside operating businesses — FP&A, finance business partnership, finance strategy, the analytical and planning function of the office of the CFO. |
| work_texture | Cyclical (planning, forecasting, reporting cycles). Mix of analytical (modeling, analysis), partnership (business support), and leadership (team, process). Heavy executive partnership. Different from accounting (FC-04) — forward-looking and decision-supporting. |
| core_evidence_required | (1) FP&A or corporate finance leadership ownership; (2) Multi-year financial planning experience; (3) Business partnership evidence; (4) Team or process ownership. |
| supporting_evidence | Background spanning investment banking, consulting, accounting before FP&A; MBA or CFA; experience scaling finance through growth phases. |
| false_positive_signals | (1) Accounting or controllership labeled as FP&A — FC-04; (2) "Worked with finance"; (3) Business analyst without business partnership; (4) Single-cycle FP&A. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive (CFO), Independent / Fractional Advisor |
| level_logic_notes | Manager: FP&A Manager with team. Senior Manager: Senior FP&A. Director/Head: Director of FP&A or VP Finance. Executive (CFO): enterprise finance leadership. Cross-spine penalty: Significant from non-finance. Accounting-to-FP&A is a bridge, not adjacent. |
| direct_path_conditions | Current FP&A leadership role; entry at same level. |
| adjacent_path_conditions | From investment banking, consulting, controllership with FP&A exposure — enter at Manager or Senior Manager. From SA-01 with financial modeling depth — enter at Manager. |
| bridge_path_conditions | From non-finance: bridge through FP&A Manager role with credential. From accounting (FC-04): bridge through Senior FP&A role for 12–18 months. |
| credential_gate | Soft. credential_details: MBA, CFA, CPA are soft but heavily weighted. typical_time_to_credential: 1–4 years. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional CFO is established and widespread. Credibility requires prior in-house finance leadership at Director+, multi-company experience, named outcomes (fundraising, M&A, scaling). |
| ai_digital_treatment | Modifier and increasingly core. FP&A heavily transformed by AI. Strong AI fluency strengthens family materially. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: financial analyst roles heavily exposed). Execution (modeling, reporting) heavily transformed; leadership and partnership work durable. |
| financial_profile | Stable salaried with bonus, often significant equity. Manager $130–180K, Senior Manager $170–240K, Director $220–320K, VP Finance $300–500K, CFO $400K+. |
| optional_title_examples | FP&A Manager, Director of FP&A, VP Finance, Head of Finance, CFO, Chief Financial Officer |
| adjacent_families | FC-02, FC-03, FC-04, SA-01, DA-01 |
| bridge_families | SA-02 (Management Consulting); FC-04 (Accounting); SA-03 (M&A/Corp Dev) |

FC-02 — Financial Advisory & Wealth Management

| Field | Content |
| --- | --- |
| spine | Finance & Capital |
| direction_family_name | Financial Advisory & Wealth Management |
| short_description | Client-facing financial advisory — wealth management, financial planning, advisory practice. Licensed work with client books. |
| work_texture | Client-facing and licensed. Mix of advisory work (financial planning, investment management), relationship management, and (for independent advisors) practice management. Regulatory-heavy. |
| core_evidence_required | (1) Licensed advisory work (Series 7, 65, 66, CFP, or comparable); (2) Client book or AUM; (3) Planning or wealth management experience; (4) Compliance discipline. |
| supporting_evidence | CFP, CFA, CHFC credentials; firm tenure (Edward Jones, Merrill, RIA); insurance licenses (Life, Health, Variable Annuity). |
| false_positive_signals | (1) "Interested in finance" — interest without credential; (2) Personal investing labeled as advisory; (3) Insurance sales labeled as wealth management without licenses. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Licensed / Credentialed Specialist, Independent / Fractional Advisor, Founder / Operator (practice ownership) |
| level_logic_notes | Specialist: licensed advisor with small book. Senior Specialist: advisor with established book. Manager: advisor manager / branch manager. Senior Manager: regional leadership. Director/Head: RIA leadership or branch leader. Licensed/Credentialed Specialist: established independent advisor. Founder/Operator: RIA founder or practice owner. Cross-spine penalty: Hard credential gate — cross-spine entry requires credentialing pathway. |
| direct_path_conditions | Current advisory practice with active licenses; entry at same level. |
| adjacent_path_conditions | From FC-01 (Corporate Finance) with advisory transition — enter at Specialist with credentialing. From FC-04 (Accounting) with CFP — enter at Specialist or Senior Specialist. |
| bridge_path_conditions | From non-finance backgrounds: bridge through Series 7 + 65/66 (3–6 months) + Specialist role with client-book-building (often 3–5 years to viable income). Honest financial disclosure required — early years often below market. |
| credential_gate | Hard, Jurisdiction-Specific. credential_details: Series 7, 65, 66; CFP, CFA, CHFC; state insurance licenses where applicable. typical_time_to_credential: 3–9 months for licenses; 18+ months for CFP. blocks_direct_entry: yes. can_be_bridge_path: the credentialing process IS the bridge. |
| fractional_notes | Independent advisory is the typical mature operating model — not "fractional" in the C-suite sense, but RIA ownership and solo practice are core to the family. |
| ai_digital_treatment | Modifier. AI tools transforming planning, portfolio analytics, client communication. AI fluency increasingly relevant; doesn't substitute for licenses and trust-building. |
| ai_durability | D3 — Durable. source: judgment_based. Relationship and trust-based work durable; portfolio analytics and planning being augmented. |
| financial_profile | Credential-delayed income. Year 1–3 at established firm: $50–100K total comp. Established advisor with book: $100K–$500K+. RIA owner: $150K–$1M+. Significant ramp risk during book-building. |
| optional_title_examples | Financial Advisor, Wealth Manager, Senior Financial Advisor, Financial Planner, Wealth Management Advisor, RIA Principal |
| title_examples_by_context | Wirehouse (Merrill, Morgan Stanley, etc.): Financial Advisor, Senior Financial Advisor, Wealth Management Advisor. Independent broker-dealer (Edward Jones, LPL): Financial Advisor, Associate Advisor. RIA: Wealth Manager, Senior Wealth Manager, Principal. Bank-affiliated: Private Banker, Wealth Advisor. Insurance-affiliated: Financial Planner, Insurance Agent (when licensed). |
| adjacent_families | FC-01, FC-03, FC-04, IP-01 |
| bridge_families | FC-04 (Accounting) — for accountants adding CFP; FC-01 (Corporate Finance) — for finance professionals transitioning; IP-01 (Solo Advisory Practice) — for RIA path |

FC-03 — Investment, Private Capital & Venture

| Field | Content |
| --- | --- |
| spine | Finance & Capital |
| direction_family_name | Investment, Private Capital & Venture |
| short_description | Investing capital — PE, VC, hedge funds, family offices, principal investing. The asset-side of finance. |
| work_texture | Deal-shaped and analytical. Mix of sourcing (deal flow), diligence, deal execution, and portfolio management. Long-cycle outcomes; high-volatility income (especially carry). |
| core_evidence_required | (1) Investment role experience — analyst, associate, principal at fund; (2) Deal-led decision authority or portfolio work; (3) Investment thesis development; (4) Multi-deal experience or fund work. |
| supporting_evidence | Investment banking transition; MBA from top program; CFA; founder/operator with investing transition; prior portfolio company operating experience. |
| false_positive_signals | (1) Personal investing labeled as investment work; (2) "Worked with VCs/investors" — proximity not investing; (3) Stock trading labeled as professional investing. |
| level_bands_supported | Specialist (Analyst), Senior Specialist (Associate), Manager (Vice President), Senior Manager (Principal), Director / Head (Partner), Executive (Managing Partner) |
| level_logic_notes | Specialist: Investment Analyst. Senior Specialist: Associate / Senior Associate. Manager: Vice President. Senior Manager: Principal. Director/Head: Partner. Executive: Managing Partner / Founding Partner. Cross-spine penalty: Significant from non-investing backgrounds. Operator-to-investor transitions typically enter at Senior Specialist with operating expertise as entry value. |
| direct_path_conditions | Current investment role; entry at same level; same investment strategy. |
| adjacent_path_conditions | From SA-03 (M&A/Corp Dev) — enter at Manager. From investment banking — enter at Senior Specialist or Manager. From FC-01 with corp dev exposure — enter at Senior Specialist. |
| bridge_path_conditions | From operating roles: bridge through Senior Operator at PE-owned company before investor role, or direct lateral with operating expertise. Bridge often takes 12–24 months. |
| credential_gate | None. credential_details: MBA, CFA are heavily weighted soft credentials. blocks_direct_entry: no but functional barrier. |
| fractional_notes | Independent investing (angel investing, advisory) is a real model post-fund. Not "fractional" in the standard sense. |
| ai_digital_treatment | Modifier and increasingly core. AI tools transforming sourcing, diligence, portfolio analytics. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable for partner tier. source: mixed. Senior investing work is heavily judgment and relationship-based; junior analytical work being augmented. |
| financial_profile | Lumpy / high-upside. Analyst $130–200K total comp, Associate $180–280K, VP $250–450K, Principal $400–700K, Partner $700K–$5M+ (heavily carry-dependent). |
| optional_title_examples | Investment Analyst, Associate, Vice President, Principal, Partner, Managing Partner, Director of Investments |
| adjacent_families | FC-01, FC-02, SA-03 |
| bridge_families | SA-03 (M&A/Corp Dev); FC-01 (Corporate Finance); SA-02 (Management Consulting) |

FC-04 — Accounting, Controllership & Audit

| Field | Content |
| --- | --- |
| spine | Finance & Capital |
| direction_family_name | Accounting, Controllership & Audit |
| short_description | Technical accounting work — controllership, audit, financial reporting, tax. The control-and-reporting side of finance. |
| work_texture | Cyclical (close, audit, reporting cycles) and rule-based. Mix of accounting work (reporting, GAAP, controls), audit (internal or external), and team leadership at senior levels. |
| core_evidence_required | (1) Accounting function ownership or substantial sub-function (controller, audit, tax, reporting); (2) GAAP or IFRS depth; (3) Multi-year accounting experience; (4) Team or process leadership at senior tier. |
| supporting_evidence | CPA; prior Big 4 audit experience; MAcc or comparable; controllership experience at multiple companies. |
| false_positive_signals | (1) Bookkeeping labeled as accounting leadership; (2) Finance generalist with accounting exposure; (3) Tax preparer without controllership scope. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive (Chief Accounting Officer) |
| level_logic_notes | Specialist: Staff Accountant or Auditor. Senior Specialist: Senior Accountant or Senior Auditor. Manager: Accounting or Audit Manager. Senior Manager: Senior Manager or Controller. Director/Head: Director of Accounting / Controller / Chief Accountant. Executive: Chief Accounting Officer or CFO at smaller orgs. Cross-spine penalty: Significant from non-finance. |
| direct_path_conditions | Current accounting role; entry at same level. |
| adjacent_path_conditions | From FC-01 with accounting transition — enter at Senior Specialist or Manager. From audit firm transitioning in-house — enter at Manager or Senior Manager. |
| bridge_path_conditions | From non-accounting: bridge through accounting role plus CPA credential pathway (12–36 months). |
| credential_gate | Soft, near-Hard at senior levels. credential_details: CPA widely expected at Manager+ for controllership. Other credentials: CMA, CIA. typical_time_to_credential: 1–2 years for CPA. blocks_direct_entry: no but functional barrier. can_be_bridge_path: yes. |
| fractional_notes | Fractional Controller real and widespread for small companies. Credibility requires CPA plus prior in-house controllership. |
| ai_digital_treatment | Modifier and increasingly core. Accounting heavily AI-affected (close acceleration, reconciliation, audit). AI fluency increasingly relevant. |
| ai_durability | D2 — Stable but Changing. source: mixed (Anthropic Economic Index: accounting tasks heavily exposed). Routine accounting being heavily augmented; controllership judgment and SOX-equivalent work durable. |
| financial_profile | Stable salaried. Specialist $65–95K, Senior Specialist $85–125K, Manager $115–170K, Senior Manager $150–215K, Director/Head $190–290K, Executive $280K+. |
| optional_title_examples | Staff Accountant, Senior Accountant, Accounting Manager, Controller, Senior Controller, Director of Accounting, VP Accounting, Chief Accounting Officer |
| adjacent_families | FC-01, FC-02, RC-01, RC-02 |
| bridge_families | FC-01 (Corporate Finance) — common cross-functional path; RC-01 (Compliance) — for audit/controllership-to-compliance paths; RC-02 (Risk) — for audit-to-risk paths |

Spine 12 — Risk, Compliance & Governance

RC-01 — Compliance & Regulatory Operations

| Field | Content |
| --- | --- |
| spine | Risk, Compliance & Governance |
| direction_family_name | Compliance & Regulatory Operations |
| short_description | Building and running compliance functions — interpreting regulations, designing controls, managing examinations and audits, operating the compliance machinery of regulated organizations. |
| work_texture | Regulation-grounded. Mix of interpretation (translating regulations into operational requirements), program design (policies, controls, procedures), and operations (monitoring, examinations, remediation). Stakeholder altitude includes regulators directly. Cyclical (examinations, reporting). |
| core_evidence_required | (1) Substantive compliance function work — program ownership or significant sub-function ownership; (2) Regulatory framework depth in at least one regime (HIPAA, GDPR, SOX, BSA/AML, FDA, FINRA); (3) Examination, audit, or regulator-facing experience; (4) Control design or policy authorship. |
| supporting_evidence | JD or compliance-specific credentials (CCEP, CRCM, CAMS); industry-specific regulatory experience; consulting with compliance practice; in-house counsel with compliance focus. |
| false_positive_signals | (1) "Worked with compliance"; (2) Policy exposure framed as policy ownership; (3) Audit participation (as auditee) labeled as audit experience; (4) Legal collaboration labeled as compliance expertise; (5) Risk awareness or training completion framed as risk function work. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive (CCO), Independent / Fractional Advisor, Licensed / Credentialed Specialist |
| level_logic_notes | Specialist: substantive compliance work in specific area. Senior Specialist: subject matter expertise. Manager: compliance program ownership for function. Senior Manager: multi-program leadership. Director/Head: enterprise compliance function. Executive (CCO): board-facing leadership at regulated entities. Junior-tier interchangeability rule (Spine 12 cross-family): At Specialist and Senior Specialist levels, RC-01, RC-02, RC-03 share substantial work texture. A candidate with evidence in any one is recommendable across all three with no cross-family translation penalty at these levels. At Manager+, families diverge sharply; cross-family moves trigger standard Bridge-based logic. Cross-spine penalty: Significant from FC, SA, PO without regulatory depth; smaller from Legal or Audit. Industry-switching penalty material — fintech compliance and healthcare compliance are different. |
| direct_path_conditions | Current compliance role with regulatory ownership; same regulatory regime and industry; entry at same level. |
| adjacent_path_conditions | From Legal with compliance focus — enter at Manager or Senior Manager. From FC-04 (Audit) with regulatory work — enter at Senior Specialist or Manager. From RC-02 with regulatory specialization at Manager+ — Bridge-based. |
| bridge_path_conditions | From operations or business roles in regulated industries: bridge through Compliance Specialist or Manager role plus relevant credential for 18–24 months. Industry-switching: bridge through Specialist role in new regime even at senior level. |
| credential_gate | Soft, sometimes Hard depending on context. credential_details: CCEP, CRCM, CAMS, CHC, CIPP/E, CIPP/US widely recognized. JD often functions as soft credential. Some designated compliance officer roles require specific credentials (Hard). typical_time_to_credential: 6–12 months. blocks_direct_entry: rarely for Hard. can_be_bridge_path: yes. |
| fractional_notes | Fractional Chief Compliance Officer real and growing, especially for fintech and digital health startups. Credibility requires prior in-house compliance leadership at regulated entity, industry-specific regulatory depth, clean record. |
| ai_digital_treatment | Modifier and increasingly core. AI governance (RC-03) is rising adjacent. Compliance technology (RegTech) reshaping work. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable. source: judgment_based. Compliance work heavily judgment-based, regulator-facing. Routine compliance operations (transaction monitoring, document review) heavily AI-affected; leadership and regulator-facing work durable. |
| financial_profile | Stable salaried, mid-high to high income. Specialist $80–120K, Senior Specialist $110–160K, Manager $140–200K, Senior Manager $180–250K, Director/Head $220–320K, CCO $280K–$500K+. Heavy financial services premium. |
| optional_title_examples | Compliance Manager, Senior Compliance Manager, Director of Compliance, Head of Compliance, Chief Compliance Officer, Compliance Officer |
| title_examples_by_context | Financial Services / Banking: AML Compliance Manager, BSA Officer, Chief Compliance Officer. Healthcare: HIPAA Privacy Officer, Compliance Officer, Director of Healthcare Compliance. Fintech: Compliance Manager, Head of Compliance, CCO. Life Sciences / Pharma: Compliance Officer, Director of Regulatory Compliance. AI / Tech: Head of Compliance, Director of Regulatory Affairs (emerging). |
| adjacent_families | RC-02, RC-03, FC-04, IT-02 |
| bridge_families | FC-04 (Audit/Controllership); IT-02 (InfoSec) — for security-side compliance; RC-02 (Risk Management); SA-02 (Management Consulting) |

RC-02 — Enterprise Risk Management

| Field | Content |
| --- | --- |
| spine | Risk, Compliance & Governance |
| direction_family_name | Enterprise Risk Management |
| short_description | Identifying, assessing, and managing the risk exposure of an organization — operational risk, financial risk, strategic risk, third-party risk, business continuity, risk governance frameworks. |
| work_texture | Analytical and judgment-based. Mix of risk identification, quantification, treatment, and governance (committees, board work). Cross-functional. |
| core_evidence_required | (1) Substantive risk function work — risk identification, assessment, management as primary responsibility; (2) Risk framework or methodology ownership; (3) Risk quantification or assessment work with leadership consumption; (4) Risk governance experience. |
| supporting_evidence | FRM, PRM, or comparable; insurance, banking, or institutional investment background with risk depth; consulting with risk practice; prior internal audit with risk focus. |
| false_positive_signals | (1) "Risk awareness training completed"; (2) Project risk management labeled as enterprise risk — OD-02 territory; (3) "Identified risks in my role"; (4) Insurance brokering labeled as enterprise risk; (5) Generic operational management labeled as operational risk. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive (CRO), Independent / Fractional Advisor |
| level_logic_notes | Specialist: focused risk analyst. Senior Specialist: subject matter expertise in risk domain. Manager: risk program ownership. Senior Manager: multi-domain risk leadership. Director/Head: enterprise risk function. Executive (CRO): board-facing risk leadership. Junior-tier interchangeability rule (Spine 12 cross-family): At Specialist and Senior Specialist levels, RC-01, RC-02, RC-03 share substantial work texture. A candidate with evidence in any one is recommendable across all three with no cross-family translation penalty at these levels. At Manager+, families diverge sharply; cross-family moves trigger standard Bridge-based logic. Cross-spine penalty: Significant from non-financial-services FC, OD, IT. Investment/banking entrants shorter penalty due to risk-domain adjacency. |
| direct_path_conditions | Current ERM role with function ownership; entry at same level; same industry. |
| adjacent_path_conditions | From FC-04 (Audit) with risk focus — enter at Manager or Senior Manager. From RC-01 (Compliance) at Specialist/Senior Specialist level via junior-tier rule; at Manager+ Bridge-based. From IT-02 (InfoSec) with operational risk crossover — enter at Senior Specialist. |
| bridge_path_conditions | From operations, finance, or business roles: bridge through Risk Analyst or Risk Manager role plus risk credential for 18–30 months. Cross-industry: bridge through Specialist or Senior Specialist in new industry. |
| credential_gate | Soft. credential_details: FRM, PRM, CRM, CRMA, RIMS-CRMP recognized. Industry-specific credentials matter (CRC for banking). typical_time_to_credential: 6–18 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional CRO emerging, especially for mid-market financial services and high-growth fintech. Less mature as fractional category than fractional CFO or CCO. |
| ai_digital_treatment | Modifier and increasingly core. AI risk is rising sub-domain (RC-03 covers AI governance). Risk technology (modeling, monitoring) being heavily AI-transformed. |
| ai_durability | D3 — Durable. source: judgment_based. Risk leadership heavily judgment-based and stakeholder-intensive. Quantitative risk modeling being AI-augmented; risk judgment, governance, board-facing work durable. |
| financial_profile | Stable salaried, mid-high to high income. Specialist $90–130K, Senior Specialist $120–170K, Manager $150–210K, Senior Manager $180–260K, Director/Head $230–340K, CRO $300K–$700K+. Financial services premium very high. |
| optional_title_examples | Risk Manager, Senior Risk Manager, Director of Risk, Head of Enterprise Risk, Chief Risk Officer, Operational Risk Lead |
| title_examples_by_context | Banking / Financial Services: Credit Risk Manager, Market Risk Manager, Operational Risk Manager, CRO. Insurance: Risk Manager, Director of Risk, CRO. Healthcare: Risk Management Director, Patient Safety / Risk Officer. Corporate (non-FS): Enterprise Risk Manager, Director of ERM, VP Risk. Investment Management: Risk Officer, Chief Risk Officer. |
| adjacent_families | RC-01, RC-03, FC-04, IT-02, FC-03 |
| bridge_families | FC-04 (Audit); RC-01 (Compliance); IT-02 (InfoSec) |

RC-03 — Privacy, Data Governance & AI Governance

| Field | Content |
| --- | --- |
| spine | Risk, Compliance & Governance |
| direction_family_name | Privacy, Data Governance & AI Governance |
| short_description | The governance side of data and AI — privacy programs, data governance frameworks, AI policy and oversight, operational implementation of privacy and AI regulations (GDPR, CCPA, EU AI Act, sectoral privacy laws). |
| work_texture | Cross-functional and increasingly board-facing. Mix of legal-adjacent work (regulation interpretation), program work (privacy programs, data governance frameworks), operational work (data subject rights, AI model governance, vendor management). Fast-moving as AI regulation matures. |
| core_evidence_required | (1) Substantive privacy, data governance, or AI governance function work; (2) Regulatory framework depth in at least one regime; (3) Program ownership — privacy program, data governance framework, AI governance framework; (4) Cross-functional partnership evidence. |
| supporting_evidence | CIPP/E, CIPP/US, CIPM, CIPT, AIGP; legal background with privacy specialization; data engineering or data science with governance focus; prior compliance with privacy specialization. |
| false_positive_signals | (1) "Worked on privacy compliance"; (2) Data engineer who "implemented privacy controls" without governance ownership — PT-05; (3) "Used AI responsibly" or "thought about AI ethics"; (4) Legal background that mentioned privacy in passing; (5) "Built AI models" labeled as AI governance. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Specialist: privacy analyst, data governance analyst, AI governance analyst. Senior Specialist: subject matter expert across multiple regimes or deep expertise in one. Manager: privacy or data governance program ownership. Senior Manager: multi-program leadership. Director/Head: privacy or data governance function. Executive level (CPO / Chief AI Officer) rare and typically requires Director/Head tenure. Junior-tier interchangeability rule (Spine 12 cross-family): At Specialist and Senior Specialist levels, RC-01, RC-02, RC-03 share substantial work texture. A candidate with evidence in any one is recommendable across all three with no cross-family translation penalty at these levels. At Manager+, families diverge sharply; cross-family moves trigger standard Bridge-based logic. Cross-spine penalty: Significant from PT, DA, RC-01 without specific privacy/AI governance depth. |
| direct_path_conditions | Current privacy/data governance/AI governance role with program ownership; entry at same level. |
| adjacent_path_conditions | From RC-01 (Compliance) with privacy specialization at Specialist/Senior Specialist via junior-tier rule; at Manager+ Bridge-based. From Legal with privacy practice — enter at Senior Specialist or Manager. From DA-02 with governance specialization — enter at Specialist or Senior Specialist. |
| bridge_path_conditions | From non-governance: bridge through privacy or data governance Specialist role plus credential (CIPP series) for 12–18 months. Generic compliance to AI-specific governance: bridge through AI governance role with AI literacy-building. AI governance is most credential-light area; willingness to enter at Specialist level often necessary. |
| credential_gate | Soft. credential_details: CIPP/E, CIPP/US, CIPM, CIPT (privacy); CDMP (data governance); AIGP, IAPP AI Governance certifications (emerging). typical_time_to_credential: 3–6 months. blocks_direct_entry: no but material market disadvantage. can_be_bridge_path: yes. |
| fractional_notes | Fractional Privacy Officer / DPO real and growing, especially for European-facing US companies and high-growth startups. Fractional AI Governance Advisor emerging but immature. Credibility requires prior in-house program leadership plus current credential. |
| ai_digital_treatment | Standalone — this family is about AI governance, not AI tool usage. Substantive evidence is regulatory and program-design depth, not AI tool usage. Aspirational AI governance signals (without privacy or governance program experience) typically suppress. Boundary rule with DX-03: DX-03 is about enabling AI — use cases, deployment, workflow integration, business adoption, implementation, change management, operational outcomes. RC-03 is about governing AI — policy, oversight, risk, privacy, controls, responsible AI, regulatory compliance. If one person has both: deployment/adoption evidence → DX-03 leads; policy/governance/oversight evidence → RC-03 leads; both strong → one primary, other adjacent. |
| ai_durability | D3 — Durable. trajectory: Rising / potential D4. source: judgment_based. Strong future-resilient trajectory, but still an immature labor-market category. AI regulation is accelerating; privacy regulation continues to expand globally. The work itself involves governing AI rather than being displaced by it. |
| financial_profile | Stable salaried, mid-high income with strong growth trajectory. Specialist $100–140K, Senior Specialist $130–180K, Manager $160–210K, Senior Manager $190–260K, Director/Head $230–320K, Chief Privacy Officer $280–450K. AI Governance leadership commanding premium currently. |
| optional_title_examples | Privacy Manager, Senior Privacy Counsel, Data Governance Lead, Director of Privacy, Chief Privacy Officer, AI Governance Lead, Head of Responsible AI |
| title_examples_by_context | Privacy / Data: Privacy Counsel, Privacy Manager, Director of Privacy, DPO (EU-context), CPO. Data Governance: Data Governance Lead, Director of Data Governance. AI Governance (emerging): AI Governance Lead, Head of Responsible AI, AI Ethics Officer, Chief AI Officer (governance variant). Healthcare-specific privacy: HIPAA Privacy Officer. Financial services privacy: Data Privacy Officer, BSA/AML & Privacy Officer (combined roles common). |
| adjacent_families | RC-01, RC-02, IT-02, DX-03 |
| bridge_families | RC-01 (Compliance); IT-02 (InfoSec); DA-02 (Data Science) — for data-side AI governance entrants; SA-02 (Management Consulting) |

Spine 13 — Mission / Public Sector / Education

MP-01 — Nonprofit Leadership

| Field | Content |
| --- | --- |
| spine | Mission / Public Sector / Education |
| direction_family_name | Nonprofit Leadership |
| short_description | Senior leadership in mission-driven organizations — Executive Director, CEO, program leadership, senior fundraising/development at nonprofits and foundations. |
| work_texture | Mission-mediated. Mix of program leadership, fundraising, board management, external relations. Resource-constrained relative to corporate equivalents. Higher emotional and stakeholder load. |
| core_evidence_required | (1) Nonprofit leadership experience OR demonstrably equivalent mission-context leadership; (2) Fundraising experience or aptitude (essential at ED/CEO); (3) Board management or governance experience; (4) Mission-economy fluency. |
| supporting_evidence | Sustained nonprofit board service; consulting with nonprofits; corporate role with significant social impact responsibility. |
| false_positive_signals | (1) "Volunteered for nonprofits" — volunteering is not leadership; (2) Corporate executive looking for "meaningful work" without nonprofit context; (3) "Mission-aligned" corporate work labeled as nonprofit experience; (4) Small ED role assumptionally scaled up to large nonprofit CEO scope. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive (ED/CEO), Independent / Fractional Advisor |
| level_logic_notes | Manager: Program Manager. Senior Manager: Senior Program Manager. Director/Head: Director of Programs, VP Development. Executive (ED/CEO): Executive Director or CEO. Cross-spine penalty: Significant from corporate. Corporate executives looking for "meaningful work" typically enter at Manager or Senior Manager (rarely higher) without nonprofit-specific experience and fundraising track. |
| direct_path_conditions | Current nonprofit leadership role; entry at same level; same nonprofit type and scale. |
| adjacent_path_conditions | From corporate with significant nonprofit board service or sustained engagement — enter at Manager or Senior Manager (rarely higher). |
| bridge_path_conditions | Corporate-to-nonprofit: bridge through nonprofit board service (2+ years), consulting with nonprofits, or operational role at nonprofit before leadership. Often longer bridge than candidates expect. Fundraising element hardest to build through bridges. |
| credential_gate | None. credential_details: MNA, MPA, MBA-nonprofit-focus are soft positive signals. CFRE for development professionals meaningful. typical_time_to_credential: 1–2 years. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional ED real for small organizations during transitions. Fractional development director also real. Both require prior in-house nonprofit leadership. |
| ai_digital_treatment | Modifier. Nonprofits adopting AI more slowly than corporate. AI fluency becoming more relevant for fundraising operations, program analytics; doesn't establish nonprofit leadership credibility. |
| ai_durability | D3 — Durable. source: judgment_based. Nonprofit leadership heavily relational, governance-driven, judgment-based. |
| financial_profile | Mission-compensated / below-market for most contexts. Manager $60–95K, Senior Manager $80–130K, Director $100–160K, ED/CEO $120–250K (very high variance by organization size; large hospitals, foundations, major social-service orgs pay corporate-comparable). Equity not present. |
| optional_title_examples | Executive Director, CEO (nonprofit), Chief Program Officer, VP Development, Director of Programs, Chief Impact Officer |
| adjacent_families | MP-02, MP-03, MP-04, MP-05, PO-01 |
| bridge_families | OD-01 (Business Operations); SA-02 (Management Consulting); MP-04 (Impact Advisory) |

MP-02 — Education Leadership (K-12 & Higher Ed)

| Field | Content |
| --- | --- |
| spine | Mission / Public Sector / Education |
| direction_family_name | Education Leadership (K-12 & Higher Ed) |
| short_description | Leadership in formal education contexts — K-12 administration, higher education leadership, institutional accountability for educational outcomes. |
| work_texture | Cyclical (academic year). Mix of program leadership, stakeholder management (faculty, students, families, boards), regulatory navigation, resource management. Mission-and-budget tension. Longer timelines than corporate. |
| core_evidence_required | (1) Education leadership role or comparable institutional accountability; (2) Program or institution ownership; (3) Stakeholder management across educators, learners, external constituents; (4) Demonstrated educational outcomes. |
| supporting_evidence | Teaching background scaled into administration; nonprofit leadership in education context; consulting or policy work in education. |
| false_positive_signals | (1) Corporate L&D labeled as education leadership — route to PO-05; (2) "Mentored employees" framed as education; (3) Single-program leadership without institutional scope; (4) EdTech vendor work labeled as education leadership. |
| level_bands_supported | Manager, Senior Manager, Director / Head, Executive |
| level_logic_notes | Manager: Assistant Principal, Department Chair (K-12 or higher ed). Senior Manager: Principal, Associate Dean. Director/Head: Head of School, Dean. Executive: Superintendent, President, Provost. Cross-spine penalty: Significant from corporate; education context is non-substitutable. |
| direct_path_conditions | Current education leadership role; entry at same level; same education segment. |
| adjacent_path_conditions | From teaching with administrative experience — enter at Manager or Senior Manager. From nonprofit leadership with education focus — enter at Director. |
| bridge_path_conditions | From corporate into education leadership: bridge through education-adjacent role (EdTech, education nonprofit, corporate L&D scaled up) for 18–36 months. Corporate-to-education direct moves frequently fail without intermediate steps. |
| credential_gate | Jurisdiction-Specific. credential_details: K-12 administration requires state administrator credentials; higher education leadership often requires advanced degrees (PhD/EdD for senior roles); workforce development may require none. typical_time_to_credential: 1–4 years for advanced degrees; 1–2 years for administrator credentials. blocks_direct_entry: yes for some segments. can_be_bridge_path: yes. |
| fractional_notes | Fractional education leadership less common than other sectors. Interim heads of school, interim deans more typical than ongoing fractional. |
| ai_digital_treatment | Modifier with significant emerging importance. EdTech and AI-in-education reshaping field. AI fluency increasingly relevant; doesn't substitute for education leadership scope. |
| ai_durability | D3 — Durable. source: judgment_based. Education leadership heavily relational, regulatory, judgment-based. Execution layers being transformed by AI; leadership tier durable. |
| financial_profile | Mission-compensated / below-market for K-12 and most nonprofits; competitive for higher education executive roles. Manager $70–110K, Senior Manager $90–140K, Director $120–180K, Executive $150–300K (higher ed presidents and well-funded charter networks pay more). |
| optional_title_examples | Principal, Head of School, Dean, Provost, President (higher ed), Director of Education, Executive Director (education nonprofit), Chief Academic Officer |
| title_examples_by_context | K-12 public: Principal, Assistant Superintendent, Superintendent. K-12 private / independent: Head of School, Division Head, Director of Admissions. Higher Ed (research): Department Chair, Dean, Provost, President. Higher Ed (community college): Dean, Vice President, President. Charter networks: Head of School, Regional Director, CEO. Online/EdTech-adjacent leadership: Chief Academic Officer, Head of Curriculum. |
| adjacent_families | MP-01, MP-03, MP-05, PO-05 |
| bridge_families | MP-01 (Nonprofit Leadership); PO-05 (L&D); MP-05 (Workforce Development); MP-03 (Public Sector) |

MP-03 — Public Sector & Government

| Field | Content |
| --- | --- |
| spine | Mission / Public Sector / Education |
| direction_family_name | Public Sector & Government |
| short_description | Government roles — civil service, policy, public agency leadership, government programs. The institutional side of public service. |
| work_texture | Procedural and accountability-heavy. Mix of program management (government programs), policy work (analysis, implementation), and stakeholder navigation (legislative, agency, public). Civil service constraints. |
| core_evidence_required | (1) Public sector experience — direct government role or agency-equivalent; (2) Program or policy work in government context; (3) Agency or program accountability; (4) Public-process fluency (procurement, FOIA, civil service). |
| supporting_evidence | MPA, MPP, public administration graduate work; prior consulting with government practice; political appointment or staff role; military leadership transition. |
| false_positive_signals | (1) "Worked with government" — vendor or contractor experience is not government work in the public sector sense; (2) "Volunteered on a campaign"; (3) Government contractor labeled as government employee. |
| level_bands_supported | Specialist (GS-11 to 12), Senior Specialist (GS-13 to 14), Manager (GS-15), Senior Manager (SES), Director / Head, Executive |
| level_logic_notes | Specialist: GS-11/12 or equivalent. Senior Specialist: GS-13/14. Manager: GS-15. Senior Manager: Senior Executive Service. Director/Head: Agency Director or Deputy Director. Executive: Cabinet-level or Agency Head. Cross-spine penalty: Significant from private sector. Civil service has procedural barriers. |
| direct_path_conditions | Current government role; entry at same level; same agency or comparable. |
| adjacent_path_conditions | From government contracting with substantive program work — enter at Specialist. From nonprofit with policy work — enter at Specialist or Senior Specialist. |
| bridge_path_conditions | From private sector: bridge through government role at Specialist level (often via political appointment or competitive application), or government affairs role first. Senior-level entry typically requires political appointment or board appointments. |
| credential_gate | Jurisdiction-Specific. credential_details: Federal civil service has specific entry pathways. State and local vary. Some roles require security clearances (Hard gates). MPA/MPP soft positive credentials. typical_time_to_credential: 1–2 years (MPA); variable for clearances. blocks_direct_entry: yes for cleared roles. can_be_bridge_path: yes. |
| fractional_notes | Generally not applicable. Government roles are full-time positions; consulting with government is FC-spine or SA-spine work. |
| ai_digital_treatment | Modifier with growing importance. AI policy and AI in government are rising areas. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable. source: judgment_based. Public sector leadership relational, procedural, judgment-based. Routine government administrative work being augmented; leadership and policy work durable. |
| financial_profile | Stable salaried, mid income with strong benefits. Specialist $75–110K, Senior Specialist $95–145K, Manager $130–180K, SES $180–250K. Federal SES caps lower than equivalent corporate. |
| optional_title_examples | Program Manager, Senior Advisor, Branch Chief, Division Director, Deputy Assistant Secretary, Assistant Secretary, Director (agency) |
| adjacent_families | MP-01, MP-02, MP-04, SA-01 |
| bridge_families | MP-01 (Nonprofit Leadership); MP-04 (Impact Advisory); SA-02 (Management Consulting) — for consultants entering government |

MP-04 — Impact Investing & Social Enterprise Advisory

| Field | Content |
| --- | --- |
| spine | Mission / Public Sector / Education |
| direction_family_name | Impact Investing & Social Enterprise Advisory |
| short_description | Mission-aligned investment and advisory — impact investing, social enterprise leadership, ESG strategy, sustainable finance. |
| work_texture | Mix of investment work (impact funds, blended finance), advisory (ESG, sustainability consulting), and operating (social enterprise leadership). Cross-functional with traditional finance and mission work. |
| core_evidence_required | (1) Impact-domain work — impact investing, ESG, social enterprise; (2) Investment, advisory, or operating role with impact focus; (3) Multi-year domain commitment; (4) Mission and financial fluency in both registers. |
| supporting_evidence | MBA with sustainability focus; CFA + impact specialization; prior philanthropy work; foundation program officer experience. |
| false_positive_signals | (1) "Interested in ESG"; (2) Corporate sustainability project labeled as impact investing; (3) Volunteer board work labeled as impact advisory. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Independent / Fractional Advisor |
| level_logic_notes | Specialist: Impact Analyst. Senior Specialist: Senior Impact Associate. Manager: Impact Manager. Senior Manager: Director of Impact. Director/Head: Head of Impact or ESG. Cross-spine penalty: Moderate from FC-03 (Investment) without impact specialization; from MP-01 (Nonprofit) without investment depth. |
| direct_path_conditions | Current impact role; entry at same level. |
| adjacent_path_conditions | From FC-03 (PE/VC) with impact specialization — enter at Manager. From MP-01 with investment-adjacent work — enter at Specialist. From SA-04 with sustainability practice — enter at Manager. |
| bridge_path_conditions | From traditional finance: bridge through impact-focused role plus credential. From nonprofit: bridge through impact analyst role plus financial credential (CFA or MBA). |
| credential_gate | None. credential_details: CFA, ESG-specific credentials (SASB, GRI, CESG) are soft. typical_time_to_credential: 6–18 months. blocks_direct_entry: no. |
| fractional_notes | Fractional ESG/Impact advisor real for companies developing ESG strategy. Project-shaped engagements common. |
| ai_digital_treatment | Modifier. AI tools transforming ESG data and impact measurement. AI fluency increasingly relevant. |
| ai_durability | D3 — Durable. source: judgment_based. Impact work heavily relational and judgment-based. |
| financial_profile | Mixed — varies widely. Impact investing at major funds: comparable to FC-03 (lower than top-tier PE). Social enterprise leadership: mission-compensated. ESG advisory: comparable to SA-04. Specialist $80–130K, Senior Specialist $110–180K, Manager $150–230K, Senior Manager $200–290K, Director/Head $250–400K. |
| optional_title_examples | Impact Analyst, Senior Impact Manager, Director of Impact, Head of ESG, Chief Sustainability Officer, Impact Investor |
| adjacent_families | MP-01, MP-03, FC-03, SA-04 |
| bridge_families | FC-03 (Investment); MP-01 (Nonprofit Leadership); SA-04 (Transformation Advisory) |

MP-05 — Workforce Development / Adult Learning / Career Services

| Field | Content |
| --- | --- |
| spine | Mission / Public Sector / Education |
| direction_family_name | Workforce Development / Adult Learning / Career Services |
| short_description | Programs that help working-age adults navigate, enter, or change careers — workforce development initiatives, adult learning programs, career services, reskilling/upskilling programs, employability programs, outplacement services. |
| work_texture | Program-shaped and learner-facing. Mix of program design, partnership (employers, funders, community), delivery oversight, and outcomes measurement (placement, wage gain, completion). Funding mix often includes government grants, philanthropy, earned revenue. |
| core_evidence_required | (1) Program leadership or substantive program ownership in adult learning, workforce development, or career services context; (2) Outcomes orientation — measurable learner or worker outcomes; (3) Partnership ecosystem evidence; (4) Adult learning fluency. |
| supporting_evidence | Background spanning corporate L&D and mission work; consulting in workforce development; prior community college or workforce board experience; outplacement firm experience. |
| false_positive_signals | (1) "Mentored employees" framed as workforce development; (2) Corporate training delivery alone; (3) "Interested in helping people with their careers"; (4) Coaching practice without program and measurable cohort outcomes; (5) K-12 or higher ed leadership without adult-learning context; (6) Volunteer career counseling labeled as career services leadership. |
| level_bands_supported | Specialist, Senior Specialist, Manager, Senior Manager, Director / Head, Executive, Independent / Fractional Advisor |
| level_logic_notes | Specialist: program coordinator, career coach within program. Senior Specialist: senior program staff with cohort-level ownership. Manager: program ownership for specific workforce program. Senior Manager: multi-program leadership or workforce service portfolio. Director/Head: workforce development function or major workforce program. Executive: workforce development organization leadership. Cross-spine penalty: Moderate from PO-05 (L&D) — corporate L&D credibility transfers partially; mission economics and learner population are different. Significant from MG, CS, PT without sustained workforce-domain bridge. |
| direct_path_conditions | Current workforce development leadership role; entry at same level; same workforce segment. |
| adjacent_path_conditions | From PO-05 (L&D) with adult learning depth and mission-economy willingness — enter at Manager or Senior Manager. From MP-01 (Nonprofit Leadership) with workforce-program focus — enter at Director. From PO-03 (TA) with employer-partnership focus — enter at Manager. |
| bridge_path_conditions | From corporate roles: bridge through workforce development manager role at nonprofit or workforce board for 18–24 months. From coaching practice: bridge through program-design role with measurable cohort outcomes for 12–18 months. From corporate executive purpose pivot: bridge through workforce board service plus consulting work with workforce nonprofits before operational entry. |
| credential_gate | None to Soft. credential_details: CWDP and similar are soft signals. Adult learning credentials (CAEL etc.) supportive. typical_time_to_credential: 3–12 months. blocks_direct_entry: no. can_be_bridge_path: yes. |
| fractional_notes | Fractional workforce development advisor real, especially for employer-side workforce strategy, philanthropy advising, workforce intermediary consulting. Credibility requires prior in-house workforce development leadership at Director+ equivalent. |
| ai_digital_treatment | Modifier and increasingly relevant. AI tools reshaping career services delivery. AI fluency increasingly relevant; doesn't substitute for workforce-domain experience. |
| ai_durability | D3 — Durable. source: judgment_based. Workforce development heavily relational, contextual, outcome-driven. AI augmenting components; program leadership, partnership work, outcome accountability durable. |
| financial_profile | Mission-compensated / below-market in most contexts. Specialist $50–75K, Senior Specialist $65–95K, Manager $80–120K, Senior Manager $100–145K, Director/Head $120–180K, Executive $150–280K. Outplacement firm leadership and well-funded workforce intermediaries can exceed. |
| optional_title_examples | Career Services Manager, Director of Workforce Development, Head of Adult Learning, Workforce Program Director, Career Coach (Specialist tier), Executive Director (workforce nonprofit), Director of Career Services |
| title_examples_by_context | Public workforce system: Workforce Development Director, WIOA Program Manager, One-Stop Career Center Director. Community college / continuing ed: Director of Workforce Development, Dean of Continuing Education. Workforce nonprofit: ED, COO, Director of Programs. Outplacement firm: Career Consultant, Senior Career Consultant, Director of Career Services. Employer-side workforce: Director of Talent Pipelines, Head of Apprenticeship Programs. Reskilling/upskilling vendors: Head of Learner Success, Director of Career Outcomes. |
| adjacent_families | MP-01, MP-02, PO-05, PO-03 |
| bridge_families | PO-05 (L&D Leadership); PO-03 (Talent Acquisition); MP-01 (Nonprofit Leadership); IP-03 (Expert-Led Practice) |

Spine 14 — Independent Practice / Fractional Advisory

IP-01 — Solo Advisory Practice

| Field | Content |
| --- | --- |
| spine | Independent Practice / Fractional Advisory |
| direction_family_name | Solo Advisory Practice |
| short_description | Building and running an independent advisory practice as the primary business — not fractional work inside a substantive spine, but the practice itself as the work: client acquisition, methodology development, practice operations. |
| work_texture | Self-directed. Mix of client work (advisory engagements), business development (pipeline, marketing, positioning), and practice operations. Highly variable income, especially early. Loneliness-prone. Often combined with adjacent revenue (speaking, content, courses). |
| core_evidence_required | (1) Substantive prior expertise in a recognizable domain; (2) Demonstrated client acquisition or strong pre-existing network; (3) Operating runway sufficient for ramp; (4) Willingness/capability for business development. |
| supporting_evidence | Post-firm consulting transition; post-executive advisory; existing speaking, writing, or content platform; prior practice ownership experience. |
| false_positive_signals | (1) "Did some consulting on the side"; (2) Recently unemployed with advisory aspirations and no pipeline; (3) Strong domain expertise without BD experience or willingness; (4) Wants advisory practice while needing immediate income floor practice can't deliver. |
| level_bands_supported | Independent / Fractional Advisor, Founder / Operator (when scaling to firm) |
| level_logic_notes | Independent / Fractional Advisor: established solo practice. Founder / Operator: scaling to firm. Cross-spine penalty: Solo Advisory Practice requires both substantive expertise AND business development capability — many corporate executives have the first but not the second. |
| direct_path_conditions | Substantive domain expertise; existing or credible pipeline; runway of 6–12 months. |
| adjacent_path_conditions | From senior corporate role with strong network: practice can be Direct if pipeline is real, Adjacent if pipeline needs building. |
| bridge_path_conditions | From non-advisory: bridge through advisory work alongside current role for 12–18 months to build pipeline; or bridge through boutique firm or consulting firm tenure first. Aspirational solo practice without bridge suppresses or routes Longer-term. |
| credential_gate | Domain-specific. credential_details: depends on substantive domain. Some (financial advisory FC-02) have hard credential gates. typical_time_to_credential: domain-specific. blocks_direct_entry: domain-specific. can_be_bridge_path: yes. |
| fractional_notes | This family is the fractional/independent work itself when the practice is the substantive work. Adjacent to fractional-level entries in substantive families. |
| ai_digital_treatment | Modifier and increasingly core. AI tools dramatically expand what solo practitioner can deliver. AI-augmented solo practice is rising operating model. |
| ai_durability | D3 — Durable for substantive advisory work in high-judgment domains. source: mixed. Work heavily relational, judgment-based, trust-driven. |
| financial_profile | Independent practice ramp risk. Highly variable. Year 1 commonly $30–100K; established practices $150–500K+. Lumpy and unpredictable until 18+ months in. Hard income floor checks required — fails for Stability Seekers. |
| optional_title_examples | Independent Advisor, Principal, Founder & Principal, Independent Consultant, Senior Advisor, Strategic Advisor |
| adjacent_families | IP-02, IP-03, SA-02, FB-01 |
| bridge_families | SA-02 (Management Consulting); FB-01 (Bootstrapped Service); substantive spine at fractional level |

IP-02 — Boutique Consulting Practice

| Field | Content |
| --- | --- |
| spine | Independent Practice / Fractional Advisory |
| direction_family_name | Boutique Consulting Practice |
| short_description | Building a small consulting firm — team of advisors, repeatable methodology, firm operations. Scaled solo practice into a small firm. |
| work_texture | Firm-shaped. Mix of client work, team leadership, business development, methodology development, firm operations. Different from solo practice — significant operational overhead. |
| core_evidence_required | (1) Firm-building work — actual team, multiple clients; (2) Team leadership in advisory context; (3) Methodology development — productized service or repeatable methodology; (4) Multi-client revenue model. |
| supporting_evidence | Prior firm leadership (Partner-track); existing methodology IP; team-recruitment capability. |
| false_positive_signals | (1) Solo practice with one collaborator labeled as boutique firm; (2) "Built a consulting business" without team — that's IP-01; (3) Service business labeled as consulting — could be FB-01 instead. |
| level_bands_supported | Founder / Operator, Independent / Fractional Advisor (Senior Partner-equivalent) |
| level_logic_notes | Founder / Operator: firm founder running the operation. Independent / Fractional Advisor: senior partner with named book. Cross-spine penalty: Boutique firm building requires firm-management capability that solo advisors often lack. |
| direct_path_conditions | Current boutique firm operator; same domain. |
| adjacent_path_conditions | From IP-01 (Solo Advisory) wanting to scale — Adjacent with team-recruitment capability evidence. From SA-02 Partner exiting to boutique — Direct. |
| bridge_path_conditions | From corporate without firm experience: bridge through IP-01 first or boutique role first. |
| credential_gate | Domain-specific. Same as IP-01. |
| fractional_notes | The firm operating model itself includes fractional engagement structures. Not "fractional" in standard sense. |
| ai_digital_treatment | Modifier and increasingly core. AI dramatically reshaping how small firms deliver work. |
| ai_durability | D3 — Durable. source: judgment_based. Firm-building work judgment-based and relational. |
| financial_profile | Lumpy / high-upside with operational risk. Founders typically $150K–$1M+ depending on firm scale and profitability. Significant variability. |
| optional_title_examples | Founding Partner, Managing Partner, Principal, Founder & Principal, CEO (boutique firm) |
| adjacent_families | IP-01, IP-03, SA-02, FB-01 |
| bridge_families | IP-01 (Solo Advisory); SA-02 (Management Consulting); FB-01 (Bootstrapped Service Business) |

IP-03 — Expert-Led / Creator Practice

| Field | Content |
| --- | --- |
| spine | Independent Practice / Fractional Advisory |
| direction_family_name | Expert-Led / Creator Practice |
| short_description | Authority-built independent practice — combining expertise, content, advisory, and product income. The creator/expert economy model. |
| work_texture | Content-heavy and platform-built. Mix of content creation (writing, video, podcast, courses), audience building, advisory work, and product creation (courses, books, programs). Multi-revenue-stream by design. |
| core_evidence_required | (1) Audience or platform — even if small, demonstrable; (2) Expertise monetization — content, products, or services tied to expertise; (3) Multi-stream expert income or clear pathway to it; (4) Content production track record. |
| supporting_evidence | Published book; popular podcast; large LinkedIn or Twitter following; course business; speaking circuit; prior media work. |
| false_positive_signals | (1) "I'd like to be a thought leader" — aspiration without audience; (2) Occasional LinkedIn posts framed as creator practice; (3) Coaching practice without content or audience component — route to IP-01. |
| level_bands_supported | Independent / Fractional Advisor, Founder / Operator |
| level_logic_notes | Independent / Fractional Advisor: established expert with monetized audience. Founder / Operator: scaled into education/product business. Cross-spine penalty: Requires authority-building work that doesn't transfer from corporate expertise alone. Audience-building is the differentiating capability. |
| direct_path_conditions | Existing audience and monetized expertise; entry at same level. |
| adjacent_path_conditions | From IP-01 with audience-building emphasis — Adjacent. From MG-04 (Content) with personal brand — Adjacent. |
| bridge_path_conditions | From corporate expert without audience: bridge through content creation and audience-building for 18–36 months while still employed. Aspirational creator paths without audience evidence suppress or route Longer-term. |
| credential_gate | None. Authority and audience are the credentials. blocks_direct_entry: no. |
| fractional_notes | Often combined with substantive spine fractional work (e.g., expert-led practice + fractional advisor role at companies in expertise domain). |
| ai_digital_treatment | Core. AI dramatically transforming content production and audience-building. AI fluency essential. |
| ai_durability | D2 — Stable but Changing. source: mixed. Content production heavily AI-affected; authority and trust-building work more durable but pressured. |
| financial_profile | Lumpy and variable. Range: $40K (early) to $1M+ (established creator). Highly dependent on audience size, monetization model. Long ramp typical. |
| optional_title_examples | Author, Educator, Independent Expert, Creator, Founder (course business), Principal & Author |
| adjacent_families | IP-01, IP-02, MG-04, MP-05 |
| bridge_families | IP-01 (Solo Advisory); MG-04 (Content/SEO); substantive spine families for expertise grounding |

Spine 15 — Founder / Builder / Operator

FB-01 — Bootstrapped Service Business Builder

| Field | Content |
| --- | --- |
| spine | Founder / Builder / Operator |
| direction_family_name | Bootstrapped Service Business Builder |
| short_description | Building a services-based company without outside capital — agency, professional services firm, services-led business. Founder posture: services-led, profitability-led. |
| work_texture | Founder-shaped without venture pressure. Mix of client delivery, business development, team building, operational management. Profitability prioritized over growth. |
| core_evidence_required | (1) Service business ownership or substantial operating experience; (2) Client acquisition capability; (3) Team building experience; (4) Profitable operating discipline. |
| supporting_evidence | Prior agency or services-firm experience; sales or BD background with services delivery; prior consulting Partner experience. |
| false_positive_signals | (1) "Did some freelance work" — solo work without business-building; (2) Aspirational founder framing without clear service offering; (3) Wants services business while needing immediate large salary. |
| level_bands_supported | Founder / Operator |
| level_logic_notes | Founder / Operator: services business founder. Profitability and team-building capability central. Cross-spine penalty: lower than venture-scale founder paths because service businesses can be built incrementally. |
| direct_path_conditions | Existing service business or clear thesis; runway for 6–12 months; client acquisition capability evident. |
| adjacent_path_conditions | From IP-01 (Solo Advisory) scaling beyond solo with team-recruitment — Adjacent. From SA-02 Partner exiting to firm-building — Direct or Adjacent depending on services-firm vs. advisory-firm distinction. |
| bridge_path_conditions | From corporate without services experience: bridge through IP-01 first or services role at agency. |
| credential_gate | None. Domain-specific credentials may apply (e.g., licensed contractor for services). |
| fractional_notes | Service businesses are not "fractional" in the standard sense, but interim leadership of struggling agencies is real. |
| ai_digital_treatment | Modifier and increasingly core. AI dramatically reshaping services economics. AI fluency increasingly important. |
| ai_durability | D3 — Durable for founder tier. source: mixed. Founder work durable; services delivery being augmented. |
| financial_profile | Variable with ramp. Years 1–2 often $60–120K founder pay (below market). Established services businesses $150K–$500K+ founder income. Lower upside than venture-scale but lower risk. |
| optional_title_examples | Founder, Principal, Founder & CEO, Managing Partner, Owner |
| adjacent_families | IP-01, IP-02, FB-04 |
| bridge_families | IP-01 (Solo Advisory); SA-02 (Management Consulting); CS-03 (BD & Partnerships) |

FB-02 — Product / Software Venture Builder

| Field | Content |
| --- | --- |
| spine | Founder / Builder / Operator |
| direction_family_name | Product / Software Venture Builder |
| short_description | Founding and building a venture-scale software product business — typically growth-funded or aggressively bootstrapped. Founder posture: product-and-engineering-led, growth-oriented. |
| work_texture | All-encompassing in early stages. Mix of product, engineering (build or partner), customer development, capital/operating. High-volatility, high-stress, often multi-year before viability. |
| core_evidence_required | (1) Product/technology depth OR strong technical co-founder context; (2) Customer development capability or aptitude; (3) Risk tolerance and runway alignment; (4) Domain expertise; (5) Realistic understanding of venture economics. |
| supporting_evidence | Prior product or engineering leadership; prior founder experience (including failed); deep domain expertise supporting specific thesis; existing investor or customer network. |
| false_positive_signals | (1) "I have an idea for an app"; (2) Corporate background without technical depth or co-founder context; (3) Aspirational founder framing without clear thesis, runway, or customer signal; (4) Domain expertise without product/technology fluency — route to FB-01 or IP-01. |
| level_bands_supported | Founder / Operator |
| level_logic_notes | Founder / Operator: software venture founder. Cross-spine penalty: Substantial. Most corporate executives without prior founder or technical background should not be recommended into FB-02 directly. |
| direct_path_conditions | Strong product/technology background; clear thesis with customer signal; runway for 12–24 months; willingness to accept founder economics. |
| adjacent_path_conditions | Strong domain expertise with technical co-founder: Adjacent with named co-founder context. |
| bridge_path_conditions | Non-technical founder without technical co-founder: bridge through co-founder search (6–12 months) or technical bootcamp + MVP build (12–18 months). Or bridge through joining early-stage startup as operator/PM (12–24 months). |
| credential_gate | None. Network and demonstrated capability are the only credentials. |
| fractional_notes | Not applicable in standard sense. |
| ai_digital_treatment | Core. Technology-product spine by definition. AI-product founders are distinct sub-domain with rising importance. |
| ai_durability | D4 — Future-Resilient at founder tier. source: judgment_based. Founder work inherently judgment-based and adaptive. |
| financial_profile | Lumpy / high-upside. Year 1 founder salary: $0–80K. Equity-based wealth creation if successful; high failure rate. Requires runway of 18+ months. Hard suppression for Stability Seekers. |
| optional_title_examples | Founder, Co-founder, CEO (founder-CEO), Founding Engineer/PM (founding team variant) |
| adjacent_families | FB-01, FB-03, PT-01, PT-02 |
| bridge_families | PT-01 (Product Management); PT-02 (Engineering Leadership); FB-01 (Bootstrapped Service Business); FB-03 (Marketplace/Platform) |

FB-03 — Marketplace / Platform Venture Builder

| Field | Content |
| --- | --- |
| spine | Founder / Builder / Operator |
| direction_family_name | Marketplace / Platform Venture Builder |
| short_description | Building two-sided marketplaces or platform businesses — network-effects models, supply/demand orchestration, platform economics. |
| work_texture | Founder-shaped with specific marketplace dynamics. Mix of supply-side work (acquiring supply, often the chicken-or-egg problem), demand-side work (acquiring demand), and platform mechanics. |
| core_evidence_required | (1) Marketplace or platform experience — operating or building; (2) Network-effects business understanding; (3) Supply/demand operating work; (4) Domain expertise relevant to the marketplace. |
| supporting_evidence | Prior marketplace operating experience (Uber, Airbnb, eBay, etc.); marketplace investor relationships; deep domain expertise in the marketplace category. |
| false_positive_signals | (1) "Want to build the Uber of X" without marketplace understanding; (2) Marketplace participation labeled as marketplace building; (3) E-commerce store labeled as marketplace. |
| level_bands_supported | Founder / Operator |
| level_logic_notes | Founder / Operator: marketplace founder. Cross-spine penalty: Marketplace economics are specific; corporate or product backgrounds without marketplace exposure typically suppress. |
| direct_path_conditions | Marketplace operating experience plus clear thesis; runway; co-founder or team. |
| adjacent_path_conditions | From PT-01 (PM) at marketplace company with founder transition — Adjacent. |
| bridge_path_conditions | From non-marketplace backgrounds: bridge through marketplace operating role (BD, ops, growth at marketplace company) for 12–24 months. |
| credential_gate | None. |
| fractional_notes | Not applicable. |
| ai_digital_treatment | Core. AI reshaping marketplace dynamics (matching, pricing, supply optimization). AI fluency expected. |
| ai_durability | D3 — Durable for founder tier. source: judgment_based. |
| financial_profile | Lumpy / high-upside. Similar to FB-02. Founder pay variable; equity-based wealth creation if successful. |
| optional_title_examples | Founder, Co-founder, CEO (marketplace founder) |
| adjacent_families | FB-02, FB-01, CS-03 |
| bridge_families | FB-02 (Product Venture); PT-01 (Product Management); CS-03 (BD & Partnerships) |

FB-04 — Local / Main-Street Business Owner

| Field | Content |
| --- | --- |
| spine | Founder / Builder / Operator |
| direction_family_name | Local / Main-Street Business Owner |
| short_description | Building geographically-rooted small businesses — local services, retail, hospitality, trades-based businesses. The Main Street founder posture. |
| work_texture | Local and operational. Mix of operations management (running the business day-to-day), team building (often hourly workforce), local community work (customer base, supplier relationships), and ownership work (financial, regulatory, real estate). |
| core_evidence_required | (1) Local business operating experience OR clear capital and operating commitment; (2) Operational accountability evidence; (3) Geographic anchor — willingness or ability to be physically present; (4) Realistic capital and runway. |
| supporting_evidence | Prior franchise ownership; family business background; military leadership transition (significant cross-over); trades or services background scaled into ownership. Trade-business ownership: explicit progression from SL-01 (skilled trade practice) into FB-04 is common — skilled tradespeople moving from craft into business ownership. |
| false_positive_signals | (1) "Want to open a coffee shop" without operating experience, capital, or location; (2) Aspirational entrepreneurship without specific business or community ties; (3) Real estate investing labeled as local business ownership. |
| level_bands_supported | Founder / Operator |
| level_logic_notes | Founder / Operator: local business owner. Cross-spine penalty: Local business ownership is operationally intensive; corporate executives often underestimate the operational reality. |
| direct_path_conditions | Existing local business or franchise; clear capital and operating thesis. |
| adjacent_path_conditions | From SL-01 (Skilled Trade Practice) scaling to business ownership — Direct or Adjacent. From FB-01 (Bootstrapped Service Business) with local emphasis — Adjacent. |
| bridge_path_conditions | From corporate: bridge through operating experience in target business type (working in restaurant before owning restaurant, for example) or franchise ownership for 12–24 months. Capital and operational commitment must be substantial. |
| credential_gate | Domain-specific. Some businesses require licenses (food service, alcohol service, contractor licenses). credential_details: vary by business type. blocks_direct_entry: yes for licensed businesses. |
| fractional_notes | Not applicable. |
| ai_digital_treatment | Modifier. AI reshaping small business operations (booking, marketing, accounting). AI fluency increasingly useful but not gating. |
| ai_durability | D4 — Future-Resilient. source: judgment_based. Local businesses heavily location-bound and human-relational. Some operational components being augmented; core business durable. |
| financial_profile | Variable. Often below-market in early years; established local businesses can range $60K–$500K+ owner income depending on type, scale, market. Often combined with real estate ownership for wealth creation. |
| optional_title_examples | Owner, Founder & Owner, Proprietor, Franchise Owner, President (small business) |
| adjacent_families | FB-01, SL-01 |
| bridge_families | SL-01 (Skilled Trade Practice) — common progression from craft to ownership; FB-01 (Bootstrapped Service); OD-05 (Industrial Operations) for trades-based business ownership |

Spine 16 — Skilled Trade & Licensed Practice

SL-01 — Skilled Trade Practice

| Field | Content |
| --- | --- |
| spine | Skilled Trade & Licensed Practice |
| direction_family_name | Skilled Trade Practice |
| short_description | Licensed or certified skilled trade work — HVAC, electrical, plumbing, construction trades, automotive technical work, related skilled-craft directions. |
| work_texture | Hands-on, physical, often outdoors or in field settings. Apprenticeship-based credentialing pathway. Mix of technical work, customer interaction, and (at later career stages) crew leadership or business ownership. Schedules often non-traditional. Geographic flexibility limited by licensing. |
| core_evidence_required | (1) Existing trade credential/license OR explicit willingness to enter apprenticeship pathway; (2) Physical capability for the trade; (3) Aptitude evidence — mechanical aptitude, hands-on capability, problem-solving in physical contexts; (4) Geographic and lifestyle alignment with the trade's working conditions. |
| supporting_evidence | Prior hands-on work (military technical specialties, vocational training, hobbyist craftwork); family or community connection to the trade; physical fitness; willingness to relocate for apprenticeship. |
| false_positive_signals | (1) "Likes working with hands" without sustained hands-on evidence; (2) Frustration with knowledge work misread as desire for trades; (3) Older candidates without honest assessment of physical demands; (4) Aspirational trade interest without willingness to enter at apprentice level and pay. |
| level_bands_supported | Entry / Junior (Apprentice), Specialist (Journeyman), Senior Specialist (Master Tradesperson), Licensed / Credentialed Specialist, Founder / Operator (trade-based business owner) |
| level_logic_notes | Entry/Junior (Apprentice): in apprenticeship pathway. Specialist (Journeyman): licensed and practicing. Senior Specialist (Master): master certification. Licensed/Credentialed Specialist: established trade work. Founder/Operator: trade business ownership (progression to FB-04). Cross-spine entry: Entry/Junior level only, regardless of prior career level. Credential gate absolute. |
| direct_path_conditions | Existing trade credential and current trade work; entry at same level. |
| adjacent_path_conditions | Existing credential but career restart in same trade: enter at Specialist or Senior Specialist depending on recency. |
| bridge_path_conditions | Career changer with no trade background: bridge through apprenticeship program (2–5 years depending on trade); enter at Entry/Junior level with explicit acknowledgment of restart economics. Critical: this family must never be recommended at higher level for career changers — the credential pathway is the entry. |
| credential_gate | Hard, Jurisdiction-Specific. credential_details: state-by-state and trade-by-trade — most trades require apprenticeship (2–5 years) followed by journeyman certification, then master certification for business ownership in some trades. typical_time_to_credential: 2–5 years for full credentialing. blocks_direct_entry: yes for licensed work. can_be_bridge_path: the credentialing process IS the bridge. |
| fractional_notes | Not applicable. Travel and seasonal work patterns exist but aren't "fractional" in advisory sense. |
| ai_digital_treatment | Largely not applicable to core work. Some trades using AI for diagnostics, scheduling, customer management; substantive physical work is not displaceable. AI fluency is a marginal modifier. |
| ai_durability | D4 — Future-Resilient. source: mixed (Anthropic Economic Index: physical trade work among least exposed). Physical, location-bound, regulated work is highly AI-durable. |
| financial_profile | Credential-delayed income. Apprentice income: $30–55K. Journeyman: $55–95K (geography-dependent). Master tradesperson or trade-business owner: $80K–$250K+. Total income trajectory delayed by credentialing time but reaches stable mid-high levels at senior tiers. Trade-business ownership variant has high upside. |
| optional_title_examples | HVAC Apprentice/Technician/Master, Electrician (Apprentice/Journeyman/Master), Plumber, Carpenter, Welder, Automotive Technician |
| title_examples_by_context | Construction trades: Apprentice, Journeyman, Master Electrician/Plumber/Carpenter, Foreman, Superintendent (for crew leadership). HVAC: Apprentice, HVAC Technician, Senior Technician, Master HVAC Mechanic. Automotive: Apprentice, Mechanic, Master Mechanic, Lead Technician. Welding: Apprentice, Certified Welder, Master Welder. Trade business ownership (progression to FB-04): Owner, President (small trade business). |
| adjacent_families | SL-02 (Clinical & Allied Health Practice — different credentialed pathway), FB-04 (Local / Main-Street Business Owner — for trade business ownership variant) |
| bridge_families | FB-04 (Local / Main-Street Business Owner) — natural progression to trade-business ownership; OD-05 (Industrial / Manufacturing Operations) — for adjacent industrial pathways |

SL-02 — Clinical / Allied Health Practice

| Field | Content |
| --- | --- |
| spine | Skilled Trade & Licensed Practice |
| direction_family_name | Clinical / Allied Health Practice |
| short_description | Licensed clinical practice in nursing, allied health (physical therapy, occupational therapy, respiratory therapy, radiology technologists, etc.), or medical practice. Hands-on patient or client care work requiring credentialed licensure. |
| work_texture | Patient-facing, often shift-based, physically demanding, emotionally intense. Mix of direct care, documentation, care coordination, and (for some allied health) interdisciplinary teamwork. Schedules often non-traditional. Geographic flexibility limited by state licensing. |
| core_evidence_required | (1) Existing clinical credential/license OR explicit credentialing pathway commitment with prerequisites in hand; (2) Clinical or healthcare exposure for career changers; (3) Realistic awareness of credentialing time, cost, clinical training demands; (4) Physical and emotional capacity for clinical work. |
| supporting_evidence | Prior healthcare-adjacent work (medical scribe, EMT, CNA); relevant undergraduate prerequisites; military medical specialty; family or community connection to healthcare. |
| false_positive_signals | (1) "Wants to help people" without clinical-specific motivation; (2) "Considering nursing" without prerequisite coursework or any healthcare exposure; (3) Older candidates without honest assessment of physical and shift-work demands; (4) Tech-burnout candidates assuming clinical work will be more meaningful — high failure rate without bridge; (5) "Did a healthcare project at consulting firm" labeled as healthcare experience. |
| level_bands_supported | Entry / Junior (Student/Trainee), Specialist (early-career clinician), Senior Specialist (experienced clinician), Manager (Charge nurse, clinical lead), Senior Manager (clinical operations management), Licensed / Credentialed Specialist |
| level_logic_notes | Entry/Junior: nursing or allied health student / new graduate. Specialist: licensed clinician with 0–5 years post-licensure. Senior Specialist: 5–15 years clinical depth, often with specialty certification. Manager: charge nurse, unit manager, clinical lead — requires both clinical depth and management responsibility. Senior Manager+: typically transitions toward OD-07 (Healthcare Administration). Cross-spine entry: Entry/Junior level only, regardless of prior career level. Credential gate absolute. |
| direct_path_conditions | Current clinical practice with active license; entry at same level; same clinical specialty. |
| adjacent_path_conditions | Existing license but career restart in same clinical specialty: enter at Specialist or Senior Specialist depending on recency. Lapsed-license return-to-practice with refresher: Specialist level with relicensure pathway. |
| bridge_path_conditions | Career changer with no clinical background: bridge through degree program (2–4 years for nursing, 2–6 years for allied health, longer for medical practice). Enter at Entry/Junior level with explicit acknowledgment of restart economics. Career-changer credibility is high for nursing (especially accelerated BSN for prior bachelor's holders) but cost and time must be transparent. |
| credential_gate | Hard, Jurisdiction-Specific. credential_details: state-by-state nursing licensure (RN, LPN); national certifications and state licensure for allied health; medical licensure for physician/PA/NP. typical_time_to_credential: 2–4 years for accelerated nursing (with prior bachelor's), 4 years for traditional BSN, 6+ years for PA/NP, longer for physician. blocks_direct_entry: yes — absolutely. can_be_bridge_path: the credentialing process IS the bridge. |
| fractional_notes | Travel nursing and locum tenens are work models but are not "fractional" in advisory sense. |
| ai_digital_treatment | Modifier with growing operational presence (clinical decision support, documentation assistance, scheduling). Core patient care remains hands-on. |
| ai_durability | D4 — Future-Resilient. source: mixed (Anthropic Economic Index: clinical and direct-care work among least exposed). Physical patient care, clinical judgment, and human-trust work are highly AI-durable. |
| financial_profile | Credential-delayed income. Nursing: Entry $65–95K, Specialist (RN with experience) $80–120K, Senior Specialist $95–140K, Manager $100–160K. Allied health: $60–110K range typical. Medical practice (physician): substantially higher but with substantially longer credential pathway and substantial debt. |
| optional_title_examples | Registered Nurse (RN), Licensed Practical Nurse (LPN), Nurse Practitioner (NP), Physical Therapist (PT), Occupational Therapist (OT), Physician Assistant (PA), Respiratory Therapist (RT), Radiologic Technologist |
| title_examples_by_context | Hospital / acute care nursing: RN, Charge Nurse, Clinical Nurse Specialist, Nurse Manager. Outpatient / community nursing: RN, NP. Advanced practice: NP, CRNA (Nurse Anesthetist), CNM (Nurse-Midwife). Allied health: PT, OT, RT, MRI Tech, Radiologic Tech. Physician/PA: MD/DO, PA (Physician Assistant). |
| adjacent_families | SL-03 (Mental Health / Therapy Practice), OD-07 (Healthcare Administration / Care Operations) |
| bridge_families | The credential pathway is the bridge — no career bridges into clinical practice; only the educational/credentialing pathway. Post-clinical bridges into OD-07 (Healthcare Administration) or back into broader leadership are common at senior career stages. |

SL-03 — Mental Health / Therapy Practice

| Field | Content |
| --- | --- |
| spine | Skilled Trade & Licensed Practice |
| direction_family_name | Mental Health / Therapy Practice |
| short_description | Licensed clinical mental health work — psychotherapy, counseling, clinical social work, marriage and family therapy, addiction counseling, related credentialed therapy practice. |
| work_texture | Client-facing, relational, emotionally demanding. Mix of direct client work, case documentation, supervision (early career) or supervising others (later career), and (for independent practice) practice management. Often scheduled with substantial autonomy after initial supervised hours. |
| core_evidence_required | (1) Existing therapy credential/license (LCSW, LMFT, LPC, LPCC, psychologist, addiction counselor) OR explicit credentialing pathway commitment with prerequisites and graduate program identified; (2) Self-awareness about emotional capacity for therapy work; (3) Realistic understanding of supervised hours requirements and time-to-independent practice. |
| supporting_evidence | Prior counseling-adjacent work; coaching practice with willingness to credentialize; psychology or social work undergraduate background; community mental health experience; lived experience in addiction recovery (for addiction counseling specifically). |
| false_positive_signals | (1) "I'm a good listener"; (2) Informal "people come to me for advice" reframed as therapy aptitude; (3) Coach who wants to "do real therapy" without credential commitment; (4) Tech or corporate burnout assuming therapy will be calmer work — therapy is emotionally demanding in different ways; (5) Existing coach who labels work as "therapy" — significant legal and ethical issue if not credentialed. |
| level_bands_supported | Entry / Junior (Pre-license/supervised), Specialist (Licensed independent), Senior Specialist (Established practice or specialty), Independent / Fractional Advisor, Licensed / Credentialed Specialist, Founder / Operator (practice ownership) |
| level_logic_notes | Entry/Junior: pre-licensed therapist accruing supervised hours (often 2–3 years post-master's). Specialist: independently licensed therapist with established caseload. Senior Specialist: 7–15+ years with specialty depth, clinical supervision of others, or recognized expertise. Independent / Fractional: established private practice; not entered at this level by career changers. Founder / Operator: group practice ownership. Cross-spine entry: Entry/Junior only via credentialing pathway — credential gate is absolute. |
| direct_path_conditions | Current therapy practice with active license; entry at same level; same modality/specialty. |
| adjacent_path_conditions | Existing license with practice restart: enter at Specialist level with caseload-building. Licensed in different state: enter at Specialist with relicensure. |
| bridge_path_conditions | Career changer with no mental health background: bridge through master's program in counseling, social work, or marriage/family therapy (2–3 years), followed by supervised hours (2–3 years), enter at Entry/Junior throughout. Total bridge often 4–6 years. Existing coaches transitioning: similar pathway, can leverage some prior client work but credentialing is non-negotiable. Must surface honest economic implications — practice often involves 3–5+ years of below-market income during training and licensure. |
| credential_gate | Hard, Jurisdiction-Specific. credential_details: state-by-state licensure for LCSW, LMFT, LPC, psychologist; significant variance in title and scope by state. typical_time_to_credential: 4–6 years from start (2–3 years for master's + 2–3 years for supervised hours). Doctoral path (PsyD/PhD) is 5–7 years plus internship. blocks_direct_entry: yes — absolutely. can_be_bridge_path: the credentialing pathway IS the bridge. |
| fractional_notes | Most therapy practice is independent or group practice — the work model is inherently "independent practice" at Specialist+ levels. Fractional therapy doesn't apply. |
| ai_digital_treatment | Modifier. AI mental health tools growing (AI-augmented documentation, mood tracking, AI chatbots for mild issues). Licensed clinical therapy remains hands-on and relational. |
| ai_durability | D4 — Future-Resilient. source: mixed. Therapeutic relationship is fundamentally human-trust work. AI augmenting peripheral components (documentation, intake, mild-symptom support); core clinical therapy durable. Demand trajectory strongly positive given mental health demand and supply shortage. |
| financial_profile | Credential-delayed income. Pre-license / supervised: $40–65K. Newly licensed: $55–85K (community mental health) to $70–120K (insurance-based private practice ramp). Established private practice: $80–200K+ depending on geography, specialty, self-pay/insurance mix. Group practice ownership: $150–400K+. Variable income; insurance vs. self-pay economics differ substantially. |
| optional_title_examples | LCSW, LMFT, LPC, LPCC, Psychologist (PsyD/PhD), Licensed Addiction Counselor, Clinical Social Worker, Marriage and Family Therapist |
| title_examples_by_context | Private practice solo: LCSW, LMFT, LPC in private practice; Therapist; Psychotherapist. Group practice: Therapist, Clinical Director (for senior leadership). Community mental health: Clinical Social Worker, Mental Health Counselor, Behavioral Health Specialist. Hospital-based: Clinical Social Worker, Psychiatric Social Worker. Addiction-specific: LADC, CADC, Substance Abuse Counselor. |
| adjacent_families | SL-02, OD-07, IP-01, IP-03 |
| bridge_families | The credentialing pathway is the bridge. Post-licensure bridges into IP-01 (independent therapy practice as solo business), OD-07 (Healthcare Administration), or MP-01 (Nonprofit Leadership in mental health context) are common. |

SL-04 — Licensed Professional Services

| Field | Content |
| --- | --- |
| spine | Skilled Trade & Licensed Practice |
| direction_family_name | Licensed Professional Services |
| short_description | Bar-admitted law, CPA, licensed real estate, licensed financial advisory practice. Credentialed professional services requiring specific licensure. |
| work_texture | Credential-bound, client-facing, regulatory-aware. Each licensed profession has distinct work patterns but shared characteristics: regulatory ethics, client trust, billable hour or commission economics in many cases. |
| core_evidence_required | (1) License held or credible credential pathway; (2) Jurisdiction-specific status; (3) Realistic understanding of credential pathway costs and time; (4) Professional ethics fluency. |
| supporting_evidence | Prior pre-professional work (paralegal for law; bookkeeping for CPA; real estate apprenticeship); academic prerequisites; willingness to commit to credentialing timeline. |
| false_positive_signals | (1) "Considering law school"; (2) "Want to become a CPA" without prerequisite accounting credits; (3) Real estate as side interest without licensure or apprenticeship; (4) Financial advisory aspirations without licensing commitment — route to FC-02. |
| level_bands_supported | Entry / Junior (pre-credential or just credentialed), Specialist (early-career licensed), Senior Specialist (experienced practitioner), Manager (firm management roles in larger firms), Senior Manager, Director / Head, Licensed / Credentialed Specialist, Independent / Fractional Advisor, Founder / Operator (firm ownership) |
| level_logic_notes | Entry/Junior: new attorney, new CPA, new real estate agent. Specialist: 2–5 years post-licensure. Senior Specialist: 5–15 years with specialty depth. Manager+: firm management or partnership-track at larger firms. Founder/Operator: firm ownership. Cross-spine entry: Entry/Junior level via credential pathway. Credential gate absolute. |
| direct_path_conditions | Current licensed practice; entry at same level; same jurisdiction. |
| adjacent_path_conditions | Existing license restarting after pause: enter at Specialist with practice-rebuilding. Licensed in different state: enter at Specialist with relicensure pathway. |
| bridge_path_conditions | Career changer with no professional services background: bridge through credential pathway (3 years for law, 1–2 years for CPA, 1–6 months for real estate licensing, 6–12 months for financial advisory licensure). Honest economic disclosure required — many credentialed pathways have substantial cost and below-market income during ramp. |
| credential_gate | Hard, Jurisdiction-Specific. credential_details: Bar admission for law (state-specific); CPA license (state-specific, 150 credit hours + exam + experience); real estate license (state-specific); FINRA Series for securities. typical_time_to_credential: 3 years + bar (law); 1–2 years + experience (CPA); 1–6 months (real estate); 3–9 months (financial advisory). blocks_direct_entry: yes. can_be_bridge_path: the credentialing process IS the bridge. |
| fractional_notes | Fractional General Counsel real and growing for fintech and growth-stage companies. Fractional CFO with CPA is common (FC-01). Real estate brokerage often involves multi-role structures. Variable by sub-domain. |
| ai_digital_treatment | Modifier and increasingly core. AI tools reshaping legal research, document drafting, due diligence, real estate research. AI fluency increasingly relevant. |
| ai_durability | D2 — Stable but Changing for some sub-domains (legal research heavily exposed); D3 — Durable for others (trial work, complex transactions, fiduciary work). source: mixed (Anthropic Economic Index: legal tasks heavily exposed). |
| financial_profile | Variable by sub-domain. Law: Entry (new associate) $80–230K (depending on firm tier); Senior $150–500K+; Partner $300K–$3M+. CPA: Entry $55–80K; Senior $90–150K; Partner $200–600K. Real estate: Highly commission-variable. Financial advisory: Covered in FC-02. |
| optional_title_examples | Attorney, Associate Attorney, Partner, CPA, Senior CPA, Tax Manager, Real Estate Agent, Realtor, Real Estate Broker |
| title_examples_by_context | Law: Associate, Senior Associate, Counsel, Partner, Of Counsel (boutique vs. AmLaw vs. in-house vs. solo all have different patterns). Accounting: Staff, Senior, Manager, Senior Manager, Partner (Big 4 vs. mid-tier vs. solo). Real Estate: Real Estate Agent, Realtor, Real Estate Broker, Principal Broker. Specialized real estate: Commercial Real Estate Broker, Investment Sales Broker. |
| adjacent_families | FC-02, FC-04, RC-01 |
| bridge_families | The credentialing pathway is the bridge. Post-credentialing bridges into FC-02 (Financial Advisory), FC-04 (Accounting / Controllership), RC-01 (Compliance) are common at senior career stages. |

Back Matter

Open Questions Carried into Pressure-Testing

The library is internally consistent and ready for pressure-testing. The following items are deliberately deferred until pressure-testing reveals whether they materialize as real problems:

CS Ops as its own family. Deferred to post-pilot evidence (Q3 in v0.4). CS-04 and OD-04 both carry the routing rule.

Sub-domain title patterns within SL-04. Law, CPA, real estate, and financial advisory licensure have distinct economics. If pressure-testing reveals systematic mismatch, may split in v1.0.

MP-04 (Impact Investing) and FC-03 boundary. Impact investing at major funds vs. ESG advisory are different work textures. May refine if pressure-testing reveals systematic issues.

Industry-specific founder family expansion. Discipline held at 4 generic founder families. Will revisit only if pressure-testing reveals systematic founder-recommendation failures.

Suppression as Product Quality

A reminder, since this is the most counterintuitive design principle in the library: a properly-functioning Ortheon recommendation engine should suppress more often than it surfaces. For a given candidate, most of the 69 families will not fit. The engine should be ruthless about removing weak fits rather than soft-pedaling them into the output. The audit trail of suppressed directions (per the methodology document) is a quiet credibility asset and a calibration tool.

The library is designed so that:

Strong matches surface as clear recommendations

Adjacent fits surface as "directions worth knowing about"

Weak fits suppress with reason logged internally

Bridge-based paths only surface when the bridge is named and credible

Conditional paths only surface when the condition is specific

---

# Completion Check

This unified v1.0 final candidate contains **69 family records** across **16 spines**.

Accepted canonical family count: 69.
Actual unique current-format family IDs detected: 69.

Duplicate current family IDs: None detected.
Retired historical IDs as current records: None detected.
Pressure-testing status: Ready for CV pressure-testing.

## Family Inventory

- PO-01 — People / HR Leadership
- PO-02 — HR Business Partnership
- PO-03 — Talent Acquisition Leadership
- PO-04 — Organizational Development & Change
- PO-05 — Learning & Development Leadership
- PO-06 — Compensation, Benefits & Total Rewards
- WI-01 — Workforce Planning & Talent Strategy
- WI-02 — People Analytics
- WI-03 — HR Technology & Systems
- WI-04 — Talent Intelligence & Market Research
- MG-01 — Marketing / Growth Leadership
- MG-02 — Brand & Communications
- MG-03 — Performance & Growth Marketing
- MG-04 — Content, SEO & Editorial Strategy
- MG-05 — Lifecycle, CRM & Retention
- MG-06 — Product Marketing / GTM Strategy
- CS-01 — Enterprise Sales Leadership
- CS-02 — Account Management & Customer Success
- CS-03 — Business Development & Partnerships
- CS-04 — Revenue Operations
- OD-01 — Business Operations Leadership
- OD-02 — Program & Project Leadership
- OD-03 — Supply Chain & Logistics
- OD-04 — Customer Operations & Service Delivery
- OD-05 — Industrial / Manufacturing Operations
- OD-06 — Change Management & Adoption Leadership
- OD-07 — Healthcare Administration / Care Operations
- PT-01 — Product Management
- PT-02 — Engineering Leadership
- PT-03 — Technical Craft (Senior IC)
- PT-04 — Design & User Experience
- PT-05 — Data Engineering & Platform
- IT-01 — Enterprise IT Leadership
- IT-02 — Information Security & Risk
- IT-03 — Cloud, Infrastructure & DevOps
- IT-04 — Business Systems & Enterprise Applications
- DX-01 — Digital Transformation Program Leadership
- DX-02 — Business Process Automation
- DX-03 — Enterprise AI Enablement
- DA-01 — Analytics & Decision Support Leadership
- DA-02 — Data Science & Quantitative Methods
- DA-03 — Business Intelligence & Reporting
- SA-01 — Corporate Strategy & Internal Advisory
- SA-02 — Management Consulting
- SA-03 — M&A and Corporate Development
- SA-04 — Transformation Advisory
- FC-01 — Corporate Finance & FP&A Leadership
- FC-02 — Financial Advisory & Wealth Management
- FC-03 — Investment, Private Capital & Venture
- FC-04 — Accounting, Controllership & Audit
- RC-01 — Compliance & Regulatory Operations
- RC-02 — Enterprise Risk Management
- RC-03 — Privacy, Data Governance & AI Governance
- MP-01 — Nonprofit Leadership
- MP-02 — Education Leadership (K-12 & Higher Ed)
- MP-03 — Public Sector & Government
- MP-04 — Impact Investing & Social Enterprise Advisory
- MP-05 — Workforce Development / Adult Learning / Career Services
- IP-01 — Solo Advisory Practice
- IP-02 — Boutique Consulting Practice
- IP-03 — Expert-Led / Creator Practice
- FB-01 — Bootstrapped Service Business Builder
- FB-02 — Product / Software Venture Builder
- FB-03 — Marketplace / Platform Venture Builder
- FB-04 — Local / Main-Street Business Owner
- SL-01 — Skilled Trade Practice
- SL-02 — Clinical / Allied Health Practice
- SL-03 — Mental Health / Therapy Practice
- SL-04 — Licensed Professional Services

# Remaining Work

The next step is to pressure-test this unified v1.0 final candidate against real CVs before implementation. After pressure-testing, apply any taxonomy corrections, lock the canonical v1.0 final, and then proceed to the matching-engine logic specification.
