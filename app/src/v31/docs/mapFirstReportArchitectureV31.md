# Ortheon MVP Cut v3.1 — Map-First Report Architecture

**Bundle 18H — Spec only. No code changes.**

---

## 1. Product Decision

The v3.1 report should be **map-first, not text-first.**

The current card-based preview (Bundle 18G) is a meaningful improvement over the original prose format, but it still presents the result as a list of text blocks. The user reads downward through sections rather than seeing the overall picture first. This creates cognitive load before the user has orientation.

A map-first report leads with a visual overview of the career direction space: where the user sits now, which directions are in reach, how confident the engine is in each, and what separates them. Text sections then explain the map rather than carrying the full weight of the result on their own.

**Four decisions this spec establishes:**

1. The v3.1 report should render a visual hub-and-spoke career direction map as its primary orientation layer, appearing before any direction detail cards.
2. The old `CareerDirectionMap.jsx` component and its underlying `careerMap` data model should **not** be reused. Only the visual pattern is borrowed.
3. A new v3.1 map component should be built directly from the v3.1 report view model fields — specifically from `compactDirectionCards`, `notNowDirections`, and related fields — with no dependency on the v1.3 scoring output.
4. The map should guide reading. It tells the user which directions exist, how to think about them, and which to read more carefully. Sections below the map serve to explain what the map shows, not repeat it in prose.

---

## 2. Why Not Reuse the Legacy CareerDirectionMap Directly

`CareerDirectionMap.jsx` renders a `careerMap` object that is produced by `generateCareerMap()` in `scoring.js`. This object is the output of the v1.3 scoring pipeline and carries concepts that v3.1 intentionally removed.

**Specific dependencies that cannot carry forward:**

| Legacy field | Why it cannot carry forward |
|---|---|
| `careerMap.primaryNodes[].aiDurabilityTone` | v3.1 does not produce AI durability tone. Spec prohibits durability scores as primary decision logic. |
| `careerMap.primaryNodes[].aiDurabilityRating` | Same. No durability rating in v3.1 output. |
| `careerMap.primaryNodes[].mapCluster` | v1.3 cluster taxonomy (technology_executive, people_operations, etc.). v3.1 uses `routeType`, `workModel`, and `directionArena` instead. |
| `careerMap.primaryNodes[].rank` | Numeric rank derived from composite score. v3.1 does not rank by score — directions are recommended by type (primary / bridge / exploratory). |
| `careerMap.currentProfileNode` | A derived "You are here" node built from assessment input factors. v3.1 does not produce a structured current-profile node. |
| `careerMap.adjacentNodes[]` | Nearby directions from the v1.3 adjacency graph. v3.1 does not produce adjacency data. |
| Pre-computed `{ x, y }` positions | `primaryNodes` carry slot coordinates computed by `getRadialSlot()`. v3.1 directions have no map coordinates — position must be derived from `recommendationType` and `displayOrder`. |
| `careerMap.inputFactors` | Structured input data (careerAnchors with scores, financialReality with exact income figures, cvSignals, priorityWeights). v3.1 provides these as text signals in `inputSignalCards`, not as structured numeric data available to a map component. |

**The risk of adapting the old component:**

Adapting `CareerDirectionMap.jsx` to accept v3.1 data would require either: (a) generating fake v1.3-shaped data from v3.1 output, which would reintroduce scoring assumptions the v3.1 pipeline removed; or (b) rewriting the component so thoroughly that nothing meaningful from the original would remain. Option (a) is dangerous. Option (b) produces the same result as building fresh.

The right approach is to **borrow the visual pattern** — hub-and-spoke layout, SVG lines encoding path type, status-based node color, a legend — while building the component entirely against the v3.1 view model.

---

## 3. New v3.1 Map Data Source

The v3.1 map draws from fields already present in the user-facing report view model produced by `buildV31UserFacingReportViewModelV31`.

**Primary sources:**

| View model field | What it provides to the map |
|---|---|
| `report.compactDirectionCards` | One entry per direction: label, status, confidence, routeType, workModel, whyThisIsHere, mainRisk, firstValidationStep, displayOrder |
| `report.primaryDirectionDeepDive` | Full detail on the primary direction; used to populate the primary node's expanded state |
| `report.otherDirectionsCompact` | Bridge, secondary, exploratory directions: whyInteresting, whyNotPrimaryNow, bridgeOrValidationCondition, firstValidationStep |
| `report.notNowDirections` | Rejected directions: label, reason, whatWouldChangeThis — shown separately or muted |
| `report.decisionDashboard` | Summary counts (bridge count, not-now count) and financial realism status — useful for map subtitle or legend |
| `report.inputSignalCards` | Signal cards explaining why the map looks the way it does — shown beside or below the map |

**Per-node fields that are most useful for map rendering:**

- `label` — shown inside the node
- `status` — determines node color and line style
- `confidence` — shown as a small badge on the node
- `routeType` — shown as a secondary label or badge (employed / independent / fractional / advisory)
- `workModel` — shown as a tertiary badge if space allows
- `whyThisIsHere` — the node's one-sentence reason; shown on hover or in node body
- `mainRisk` — the node's one-sentence risk; shown as a muted sub-line
- `firstValidationStep` — shown as a call-to-action below the node or in an expanded state

---

## 4. Proposed v3.1 Map Concept

The map uses a hub-and-spoke layout. A center node ("Your current profile") anchors the bottom-centre of the canvas. Direction nodes radiate outward. Lines connect the center to each direction node and encode the realism status of the path.

**Node placement by type:**

```
                    [ Primary ]
                         |
         [ Bridge ]     ( )     [ Bridge ]
              \           |           /
               ·  [ Your Profile ]  ·
              /           |           \
    [ Exploratory ]       ·       [ Exploratory ]
                          |
              ·  ·  ·  Not Now  ·  ·  ·
```

- **Primary direction** — top-centre; the most prominent node
- **Bridge-required directions** — left and right of center, second ring; dashed lines
- **Exploratory directions** — further out or lower ring; dotted lines
- **Not-now directions** — visually separated: either in a muted lane below the main map area, or rendered as greyed-out nodes with no line to the center

**Line styles by status:**

| Status | Line style |
|---|---|
| Credible now | Solid, dark |
| Credible now, with caution | Solid, slightly lighter |
| Bridge required | Dashed |
| Exploratory | Dotted |
| Not now | No line, or muted grey dashed |

**Node colors by status:**

| Status | Color family |
|---|---|
| Credible now | Green (`#16a34a` family) |
| Credible now, with caution | Amber (`#d97706` family) |
| Bridge required | Amber / warm yellow (`#92400e` family) |
| Exploratory | Purple / blue (`#5b21b6` family) |
| Not now | Grey (`#94a3b8` family), reduced opacity |

---

## 5. What the Map Should Show

**Each node should show only:**
- Direction label (main text)
- Status badge
- Confidence (small badge: high / medium / low)
- Route type or work model (one small badge)
- One short reason (`whyThisIsHere`) or main risk (`mainRisk`) — one sentence maximum

**The map should not show:**
- Long bullet lists (those belong in the cards below)
- Total scores or numeric rankings
- Income estimates as a primary node label or position signal
- AI durability scores or colour gradients
- Raw guardrail values (`bridge_required`, `not_viable`, `canShowAsCredibleNow`)
- Debug metadata (pipeline status, API cost, assessment ID in node text)
- `constraintsAndWarnings` lists
- `notRecommendedIf` lists

The map is a navigation layer, not a reading layer. A user glancing at the map for five seconds should understand: how many directions there are, which one is primary, which require more time to reach, and roughly why. The full explanation lives in the cards beneath the map.

---

## 6. Relationship Between Map and Cards

Each section of the report has a distinct role. They should not repeat each other.

| Section | Role |
|---|---|
| Career Direction Map | Orientation — shows the shape of the result at a glance |
| Decision Dashboard | State summary — 5 compact cards answering: primary, bridge count, not-now count, financial realism, overall confidence |
| Input Signal Cards | Explanation — why the map looks the way it does; what the engine saw about the person |
| Compact Direction Cards | Readable detail — one card per direction with short fields; no long lists |
| Primary Direction Deep Dive | The one section with fuller narrative — only for the primary direction |
| Other Directions | Short bridge/exploratory/not-now explanations; not repeated from map nodes |
| 30-Day Validation Plan | Action layer — what to do next; max 3 items |

**Reading flow the map creates:**

The user sees the map → understands which directions exist and how to orient → reads the dashboard cards to confirm the key facts → reads the signal cards to understand why → reads compact direction cards for a bit more detail → dives into the primary direction if interested → reads the validation plan to know what to do.

Without the map, the user starts reading text immediately and forms their mental model much later — or not at all.

---

## 7. Page Structure After Map-First Redesign

Proposed section order for a future report component:

**A. Executive Summary**
- Headline, one-paragraph summary, recommended strategy, main tension
- No direction names, no lists
- Keeps the user grounded before the map appears

**B. Career Direction Map**
- Visual hub-and-spoke SVG component
- Center node: "Your current profile"
- Direction nodes arranged by `recommendationType` and `displayOrder`
- Lines encode status
- Node bodies: label, status badge, confidence, one short line
- Legend: line styles + status colors
- This is the first place direction names appear

**C. Decision Dashboard**
- 5 compact answer cards (primary direction, bridge count, not-now count, financial realism, overall confidence)
- Sits just below the map, provides quick confirmation of what the map shows

**D. Input Signal Cards**
- 6 signal cards (career anchors, financial reality, work model preference, constraints, credibility assets, missing evidence)
- Each card: signal / interpretation / impact
- Explains why the map looks the way it does
- On desktop: can sit in a two-column grid alongside the map or directly below it

**E. Compact Direction Cards**
- One card per direction: status, confidence, route type, work model, whyThisIsHere, mainRisk, firstValidationStep
- No long lists; single-sentence fields only
- Not repeated from the map — adds the text detail the map nodes omit

**F. Primary Direction Deep Dive**
- Only for the primary direction
- whatThisDirectionMeans, whyItFits (max 3), whyItIsCredible (max 3), whatMakesItRisky (max 2), whatWouldMakeItStronger (max 2), notRecommendedIf (max 2), firstValidationStep

**G. Other Directions**
- Bridge, exploratory, not-now — short cards only
- whyInteresting, whyNotPrimaryNow, bridgeOrValidationCondition, firstValidationStep
- No full deep dive unless expanded in a future UI

**H. 30-Day Validation Plan**
- Max 3 concrete actions from `firstValidationStep` fields
- Optional sub-sections: evidence to build, conversations to have, decisions to make — only if populated

Confidence and limitations (from `confidenceNotes`) can be collapsed or appended as a lightweight final note rather than a full section, since the input signal cards already surface the most relevant evidence gaps.

---

## 8. Data Model Needed for the Map

A new derived field `report.directionMap` should be added to the user-facing report view model in Bundle 18I. It is computed deterministically from existing fields — no AI calls, no Firestore reads.

**Proposed shape:**

```js
report.directionMap = {
  centerNode: {
    id: "current-profile",
    label: "Your current profile",
    subtitle: "Starting point"
  },

  nodes: [
    {
      id,           // string — e.g. "dir-0", "dir-1"
      displayOrder, // number — from compactDirectionCards
      label,        // string — direction name
      status,       // string — "Credible now" | "Bridge required" | etc.
      confidence,   // string — "high" | "medium" | "low"
      routeType,    // string — "employed" | "independent" | etc.
      workModel,    // string
      nodeType,     // string — "primary" | "bridge" | "exploratory" | "notNow"
      x,            // number — percentage (0–100), derived from nodeType + displayOrder
      y,            // number — percentage (0–100), derived from nodeType + displayOrder
      shortReason,  // string — whyThisIsHere (one sentence)
      mainRisk,     // string — mainRisk (one sentence)
    }
  ],

  edges: [
    {
      from,      // string — "current-profile" (always the center)
      to,        // string — node id
      lineStyle, // string — "solid" | "dashed" | "dotted" | "muted"
      label      // string — optional; e.g. "Credible now"
    }
  ],

  legend: [
    {
      label,       // string — "Credible now"
      lineStyle,   // string — "solid"
      colorMeaning // string — "Green — credible given current evidence"
    }
  ]
}
```

**Derivation rules:**

- `nodeType` maps directly from `recommendationType`: `primary` → `"primary"`, `bridge` → `"bridge"`, `exploratory` or `not_recommended` → `"exploratory"`, rejected directions → `"notNow"`
- `x` and `y` are computed by a deterministic layout function based on `nodeType` and `displayOrder` — no physics, no external library (see Section 9)
- `lineStyle` maps from `status`: Credible now → `"solid"`, Bridge required → `"dashed"`, Exploratory → `"dotted"`, Not now → `"muted"`
- `shortReason` comes from `whyThisIsHere` (already one sentence in `compactDirectionCards`)
- `mainRisk` comes from `mainRisk` (already one sentence in `compactDirectionCards`)
- `edges` are always `from: "current-profile"` — no direction-to-direction edges in this layout

---

## 9. Layout Rules

Node positions are derived deterministically — no physics engine, no force-directed layout, no external graph library.

**Slot assignment by node type:**

| Node type | Default position |
|---|---|
| Primary | Top-centre — `{ x: 50, y: 16 }` |
| Bridge (1 of 1) | Centre-left — `{ x: 28, y: 42 }` |
| Bridge (1 of 2) | Left — `{ x: 20, y: 42 }` |
| Bridge (2 of 2) | Right — `{ x: 80, y: 42 }` |
| Exploratory (1 of 1) | Centre-right — `{ x: 72, y: 42 }` |
| Exploratory (1 of 2) | Far left — `{ x: 14, y: 58 }` |
| Exploratory (2 of 2) | Far right — `{ x: 86, y: 58 }` |
| Center node (current profile) | Bottom-centre — `{ x: 50, y: 76 }` |
| Not-now (all) | Muted lane below center, horizontal list, no SVG lines |

**Overflow rules:**
- Maximum 4 nodes in the main radial layout (1 primary + up to 3 bridge/exploratory)
- If there are more than 3 bridge or exploratory directions combined, show the first 3 by `displayOrder`; list remaining as text below the map
- Not-now directions never enter the radial layout; they appear in the muted lane or a separate not-now section
- If there is no primary direction, promote the first bridge direction to the top-centre slot and label it "Best available direction" rather than leaving the slot empty

**Visual constraints:**
- SVG viewBox: `0 0 100 100`, `preserveAspectRatio="none"`, stretched to container width
- Nodes are positioned with `position: absolute`, `left: {x}%`, `top: {y}%`, `transform: translate(-50%, -50%)`
- Node width: fixed at approximately 160–180px; text truncated with ellipsis if label overflows
- No animation in the initial implementation
- No zoom or pan
- No click-to-expand in Bundle 18J (deferred to a future bundle)

---

## 10. Open Questions

These decisions are deliberately left open for the product and design review after Bundle 18J produces a working prototype.

1. **Should not-now directions appear on the map or only below it?**
   The current proposal places them below the map in a muted lane. An alternative is to render them as greyed-out nodes on the lower edge of the radial canvas with no line to the center. The muted-lane approach is safer for a first implementation.

2. **Should input signal cards sit beside the map on desktop?**
   On wider screens, placing the input signal card grid in a right column beside the map would create a natural "map + context" layout. This requires a two-column shell that does not exist in the current preview. Deferred to Bundle 18J or later.

3. **Should map nodes be clickable or expandable in the future?**
   Clicking a node to expand it into the compact card view (or scroll-link to the corresponding card section) would reduce the need for the card list below the map. Not in scope for Bundle 18I or 18J; noted for future consideration.

4. **Should financial realism appear as an overlay or annotation on the map?**
   The decision dashboard card already carries financial realism status. A map annotation (e.g., an amber badge on bridge nodes that specifically have a financial constraint) could help without repeating text. Feasible to add in Bundle 18J without a new model field — `status` is sufficient to drive the color.

5. **Should route type or work model affect node position?**
   The current proposal positions nodes by `recommendationType` only. An alternative is to place employed-route directions on one side and independent-route directions on the other, creating a "path type" axis. This would require more layout logic and may reduce legibility for small direction counts. Not recommended for the first implementation.

6. **How much text should each node contain?**
   The current proposal: label + status badge + confidence + one short line (`shortReason` or `mainRisk`). An alternative is label-only nodes with no text, relying entirely on the cards below. Label-only is cleaner but loses the one-sentence anchor that helps the user understand the node before reading the cards. Recommend keeping one short line per node and validating with a real assessment result in Bundle 18J.

---

## 11. Recommended Next Bundles

### Bundle 18I — Add `directionMap` field to the user-facing report view model

**File to modify:** `src/v31/report/buildV31UserFacingReportViewModel.js`

**Purpose:** Derive `report.directionMap` from existing `compactDirectionCards` and `notNowDirections` fields and add it to the top-level view model output as an additive field.

**Specific tasks:**

1. Add a `buildDirectionMap(compactDirectionCards, notNowDirections)` helper that:
   - Constructs `centerNode` (hardcoded label, no data dependency)
   - Maps each `compactDirectionCard` to a `node` with derived `nodeType`, `x`, `y`, `lineStyle`, `shortReason`, `mainRisk`
   - Constructs `edges` from `"current-profile"` to each non-not-now node
   - Constructs a static `legend` array based on which line styles are present
2. Apply the slot assignment rules from Section 9 of this spec
3. Return `directionMap` as a new top-level field (additive — existing shape unchanged)
4. Update the debug runner to confirm `directionMap.nodes.length`, `directionMap.edges.length`, and `directionMap.centerNode` exist

**Constraints:**
- Pure deterministic function — no Firestore, no AI, no API calls
- Does not mutate input
- Protected files remain untouched
- No UI changes in this bundle — model only
- Max 4 nodes in `directionMap.nodes` (not-now directions do not enter the node array)

### Bundle 18J — Render v3.1 map component in the internal report preview

**File to modify:** `src/v31/report/V31UserFacingReportPreview.jsx`

**Purpose:** Build a new `V31DirectionMap` React component that renders `report.directionMap` as an SVG hub-and-spoke canvas and insert it as Section B of the report preview (after the Executive Summary, before the Decision Dashboard).

**Specific tasks:**

1. Create `V31DirectionMap` component inside `V31UserFacingReportPreview.jsx` (or as a co-located file if too large):
   - Renders an SVG for edges (lines from center to nodes)
   - Renders absolutely-positioned node cards over the SVG canvas
   - Center node: label + subtitle, distinct style
   - Direction nodes: label, status badge, confidence, one short line
   - Line styles: solid / dashed / dotted / muted based on `edge.lineStyle`
   - Node colors: by `status` using the STATUS_THEMES already defined in the preview
2. Insert `V31DirectionMap` between the Executive Summary and the Decision Dashboard sections
3. Add a map legend below the canvas
4. Validate in the browser at `/internal/v31-report?documentId=FrpHpSzJ9KxeodhoWyJL`
5. Run `npm run build` and `git diff --check`

**Constraints:**
- No external graph or physics libraries
- No changes to protected files
- No production integration
- No replacement of `CareerDirectionMap.jsx` or any legacy component
- Internal preview only
