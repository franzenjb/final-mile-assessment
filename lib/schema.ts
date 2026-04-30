/**
 * Form schema for the Northeast Division Final Mile Assessment Regional Template.
 * Mirrors the official PDF; each field carries optional help text used by the help modal.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "select"
  | "yesno"
  | "checklist"
  | "triple";

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
  rows?: number;
};

export type Subsection = {
  title: string;
  description?: string;
  fields: Field[];
};

export type Section = {
  id: string;
  number: number;
  title: string;
  objective?: string;
  intro?: string;
  help?: string;
  subsections: Subsection[];
};

const CADENCE_OPTS = ["Quarterly", "Every 6 months", "Annual", "Other"];

export const SCHEMA: Section[] = [
  {
    id: "overview",
    number: 1,
    title: "Regional Overview",
    intro:
      "Identify the region, leadership, and high-level risk context. Plans are due June 15, 2026; implementation begins July 1, 2026.",
    help: `This section names the people accountable for the plan and frames the regional risk picture that drives every choice that follows.

WHY IT MATTERS
Division leadership reads Section 1 first to understand who to call, what hazards the region actually faces, and whether the strategy in later sections is grounded in that reality. A vague Regional Context here makes the rest of the plan harder to evaluate.

WHAT TO INCLUDE IN REGIONAL CONTEXT
• Geographic scope (states, counties, total population served)
• Top 3 historical hazards by frequency and by cost (last 10 years)
• Forecasted/emerging risk shifts (e.g. wildfire creep, coastal flooding)
• Demographic considerations: dense urban cores, vulnerable populations, language access, isolated rural pockets
• Structural constraints unique to the region (mountains, islands, jurisdictional fragmentation, mutual-aid agreements)

GOOD vs. WEAK ANSWERS
Weak: "Region experiences various weather events."
Good: "Region covers 6.2M people across 47 counties. Top hazards: nor'easters (8 declared events in 10 yrs), residential fires (~280/yr), riverine flooding (3 of last 5 yrs). Two coastal counties account for 60% of shelter demand."`,
    subsections: [
      {
        title: "Region & Leadership",
        fields: [
          {
            id: "rdo",
            label: "Regional Disaster Officer (RDO)",
            type: "text",
            help: "Full name of the RDO accountable for this plan. The RDO is the primary signatory and owns delivery against the 2/4 standard.",
          },
          {
            id: "coo",
            label: "Chief Operating Officer (COO)",
            type: "text",
            help: "Regional COO name. The COO partners with the RDO on resource allocation and signs off on the plan.",
          },
          {
            id: "executive_directors",
            label: "Executive Director(s)",
            type: "textarea",
            rows: 2,
            placeholder: "List each ED and chapter/territory",
            help: "List every Executive Director in the region with their chapter/territory. EDs are accountable for community relationships, partner agreements, and shelter validation in their footprint.",
          },
          {
            id: "regional_context",
            label: "Regional Context",
            type: "textarea",
            rows: 6,
            placeholder:
              "Geography, hazards, demographics, structural constraints…",
            help: `Describe the operational environment that shapes this plan. Aim for 150–250 words covering:

GEOGRAPHY: states/counties served, population, urban vs. rural mix
HAZARDS: top 3 by historical frequency and by cost
TRENDS: forecasted shifts (climate, demographic, infrastructure)
CONSTRAINTS: terrain, jurisdictional complexity, partner saturation, transportation chokepoints
EQUITY: vulnerable populations, language access needs, areas with thin volunteer networks

This is the only section where free-form context lives. Be specific — numbers, county names, real risks.`,
          },
        ],
      },
    ],
  },
  {
    id: "readiness-standard",
    number: 2,
    title: "Readiness Standard & Final Mile Objectives",
    objective: "Objective 1: Achieve the 2-Hour / 4-Hour Final Mile Standard",
    intro:
      "Readiness means trained volunteers, pre-positioned supplies, approved shelters, and maintained equipment — capable of responding within 2 hours and establishing shelter within 4 hours for Level 3 and below events.",
    help: `Section 2 is the heart of the assessment. Every other section ladders up to whether the region can meet the 2/4 standard.

THE STANDARD, RESTATED
• Mobilization in 2 hours: trained workforce activated, supplies in motion, shelter team rolling
• Shelter open in 4 hours: a Red Cross shelter is registered, staffed, and accepting clients

This applies to Level 1–3 events. Larger events (Level 4–5) operate under National coordination, but the regional 2/4 capability is the foundation that makes scale-up possible.

HOW TO ANSWER THIS SECTION
1. Be honest about the gap between current state and the 2/4 standard. Division leadership prefers a clear gap with a credible plan over an optimistic "we're fine."
2. Tie every commitment back to a measurable change (kit count, location, staffing, partner agreement).
3. Surface tradeoffs early — if hitting 2/4 means closing or relocating a warehouse, say so here.

THE 3 MEASURES OF SUCCESS
• Time to mobilization (hours): clock starts at activation, ends when the response team has departed staging
• Time to shelter opening (hours): clock starts at activation, ends when a shelter is registered open
• % of events meeting standard: of last 12 months of Level 1–3 events, what share hit both clocks`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "likely_scenarios",
            label: "Most likely Level 1–3 disaster scenarios (historical & forecasted)",
            type: "textarea",
            rows: 5,
            help: `List the 3–5 scenarios the region is most likely to respond to. For each, note:
• Historical frequency (events per year)
• Typical scale (clients displaced, shelters opened)
• Seasonality if any (e.g. nor'easter Dec–Mar)
• Forecasted change in risk (climate, infrastructure)

Examples to draw from: residential fires, nor'easters, ice storms, riverine flooding, hurricanes / tropical remnants, wildland-urban interface fires, transportation incidents, large-building fires.`,
          },
          {
            id: "positioning",
            label:
              "Where must supplies, people, and equipment be positioned to meet the 2-hour / 4-hour standard?",
            type: "textarea",
            rows: 5,
            help: `Translate hazard geography into positioning requirements. Think in three layers:

SUPPLIES — name the cities, chapters, or partner facilities where pre-positioned kits must live for any high-probability area to be reachable in 2 hours.
PEOPLE — where do trained shelter teams need to live or stage? Single points of failure (one chapter holding all DST volunteers) belong in Section 7.
EQUIPMENT — trailers, ERVs, generators: positioned at the edge of risk areas, not the office in the geographic center.

Bonus: include a one-line rationale tying each location to a specific historical event or hazard zone.`,
          },
          {
            id: "blockers",
            label: "What currently prevents the Region from consistently meeting this standard?",
            type: "textarea",
            rows: 5,
            help: `Be specific and candid. Common blockers Division has seen across regions:

• Inventory concentrated in one warehouse, hours from highest-risk areas
• Trailer fleet larger than the trained-driver pool can move
• Workforce gaps — single shelter manager covering multiple territories
• No written activation plan, so first hour is spent improvising
• Partner agreements (school districts, churches) not refreshed in 12+ months
• Equipment maintenance backlog parking trailers on flat tires

Listing blockers here is required — you'll address them in the Strategy block below.`,
          },
          {
            id: "changes_block_standard",
            label: "Would any of the proposed changes prevent the region from meeting the standard?",
            type: "yesno",
            help: "Are any proposed changes (e.g., reducing trailers, closing a warehouse) a NET NEGATIVE for the 2/4 standard? Honest 'Yes' here is fine — Division would rather know.",
          },
          {
            id: "changes_block_specify",
            label: "If yes, specify",
            type: "textarea",
            rows: 3,
            help: "Name the specific change and the specific scenario where it could threaten the 2/4 standard. Then describe the mitigation you'd put in place.",
          },
          {
            id: "warehouse_rent",
            label: "Do you pay rent for a warehouse?",
            type: "yesno",
            help: "Tracking warehouse spend is part of the right-sizing analysis. 'Yes' means a leased external facility (not space in a Red Cross-owned chapter).",
          },
          {
            id: "warehouse_rent_amount",
            label: "How much (annual rent)?",
            type: "currency",
            help: "Annual rent in USD for the warehouse, including triple-net charges if applicable. Round to nearest thousand.",
          },
        ],
      },
      {
        title: "Regional Strategy",
        fields: [
          {
            id: "strategy_positioning",
            label:
              "How the Region will position supplies, shelters, staff, volunteers, and transport assets to meet the standard",
            type: "textarea",
            rows: 6,
            help: `Describe the future-state operating posture. Cover all five asset classes:

SUPPLIES — where kits will live (chapters, partner facilities, shelters-as-storage)
SHELTERS — primary + secondary list anchored in risk geography (Section 5 is the deep dive)
STAFF — paid roles by location and function
VOLUNTEERS — distribution by territory; redundancy approach
TRANSPORT — trailer reduction, vehicle additions, driver pool

End with a one-paragraph "first-hour playbook" — what happens between activation and the 2-hour mark.`,
          },
          {
            id: "strategy_changes",
            label:
              "Changes from current state to meet the standard (right-sizing kits, relocating inventory, staffing model adjustments, etc.)",
            type: "textarea",
            rows: 6,
            help: `List the specific deltas from today to the target state. Use bullet points; for each change include:
• What changes (specific item, location, count)
• Why (which standard or blocker it addresses)
• When (target date inside the July 1 – Dec 31, 2026 window)
• Owner (named person)

Examples:
• Move 200 cots from Albany warehouse to Plattsburgh chapter by Aug 15 — closes North Country gap. Owner: J. Smith.
• Reduce trailer fleet from 12 to 8; add 2 cargo vans; retrain 4 drivers on van protocol by Sep 30. Owner: K. Lee.`,
          },
        ],
      },
      {
        title: "Measures of Success",
        fields: [
          {
            id: "mobilization_hours",
            label: "Current avg. time to mobilization (hours)",
            type: "number",
            help: "Average across the last 12 months of Level 1–3 events. If you don't measure this today, write 'unknown' in the next field and commit to start tracking in Section 9.",
          },
          {
            id: "shelter_open_hours",
            label: "Current avg. time to shelter opening (hours)",
            type: "number",
            help: "Average across last 12 months. Clock starts at activation; stops when the shelter is registered open in the system.",
          },
          {
            id: "events_meeting_pct",
            label: "% of events meeting the standard",
            type: "number",
            help: "Of last 12 months of Level 1–3 events, what share met BOTH the 2-hour mobilization clock and the 4-hour shelter clock. This is the headline metric Division will track.",
          },
        ],
      },
    ],
  },
  {
    id: "operational-planning",
    number: 3,
    title: "Operational Planning (Written & Standardized)",
    objective: "Objective 2: Maintain a Written Regional Operating Plan for Level 3 and Below Events",
    help: `A plan that lives only in someone's head is not a plan. The test: can a volunteer or staff member from a NEIGHBORING region read your document and run a Level 2 response in your territory without you on the phone?

WHAT THIS PLAN IS NOT
• It is not a National doctrine restated. Reference doctrine; don't re-paste it.
• It is not the Regional Disaster Plan (RDP). The RDP is broader and longer; this is the operational fast-path.
• It is not a one-time deliverable. Section 9 covers the review cadence.

WHAT GOOD LOOKS LIKE
A 10–25 page document that on Page 1 has: activation triggers, the named person on the call, and the first-hour task list. The rest is appendix-style detail.

THE 7 COMPONENTS
Each checkbox corresponds to a required component. If your plan is missing one, that's a Section 11 priority action.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "has_written_plan",
            label: "Does the Region currently have a written operational plan?",
            type: "yesno",
            help: "'Yes' only if a current document exists, accessible to staff, with the required components. A draft on someone's laptop is 'No.'",
          },
          {
            id: "plan_specific_l13",
            label: "Is it specific to Level 1–3 events?",
            type: "yesno",
            help: "L1–3 events are operationally different from L4–5: smaller teams, faster decisions, less National involvement. The plan should be tuned to that pace.",
          },
          {
            id: "plan_understood",
            label: "Is it understood and usable by staff and volunteers outside the Region?",
            type: "yesno",
            help: "Could an inbound DST volunteer from another region pick this up cold and execute? If language depends on regional jargon or undocumented relationships, the answer is 'Partial' or 'No.'",
          },
        ],
      },
      {
        title: "Plan Components",
        description:
          "Check every component currently included in the plan. Anything unchecked becomes a Section 11 priority action.",
        fields: [
          {
            id: "plan_components",
            label: "Components included",
            type: "checklist",
            options: [
              "Activation triggers and decision authority",
              "Command and coordination structure",
              "Pre-identified shelter locations",
              "Supply chain & fulfillment workflows",
              "Transportation and fleet usage",
              "Workforce mobilization",
              "Workforce training",
            ],
          },
        ],
      },
      {
        title: "Regional Actions",
        fields: [
          {
            id: "plan_updates_needed",
            label: "Plan updates or development needed",
            type: "textarea",
            rows: 4,
            help: "List specific edits or new content needed, with target completion dates. Examples: 'Add updated shelter list (target Aug 1)', 'Rewrite activation triggers to align with new 2/4 standard (Sept 1)'.",
          },
          {
            id: "plan_owner",
            label: "Who would own the plan?",
            type: "text",
            help: "A single named person — typically the RDO or a designated DPM. Not a committee.",
          },
          {
            id: "plan_review_cadence",
            label: "Review cadence",
            type: "select",
            options: ["Quarterly", "Semi-annual", "Annual", "Other"],
            help: "How often will the plan be reviewed and re-adopted? Annual is the floor; semi-annual is recommended for regions with active personnel turnover or evolving risk.",
          },
        ],
      },
    ],
  },
  {
    id: "supply-readiness",
    number: 4,
    title: "Supply Readiness & Inventory Management",
    objective: "Objective 3: Right-Size Inventory and Improve Inventory Accuracy",
    help: `Right-sized means three things at once:
1. INVENTORY MATCHES DEMAND — you stock what your region's hazards actually require, not a uniform national kit list.
2. INVENTORY IS POSITIONED FOR THE FINAL MILE — pre-staged near risk, not centralized for accounting convenience.
3. INVENTORY IS COUNTED AND ACCURATE — what RIM says you have is what's on the floor.

WHY DIVISION CARES
National Readiness Targets (NRT) define a floor. Many regions sit well above their NRT in some SKUs and below in others — that's a misalignment that ties up capital and slows response. Right-sizing frees money, space, and attention to invest in what's missing.

THE REPLENISHMENT RULE
Before opening a Coupa requisition, check whether another region in the division (or another chapter in your region) has excess. Internal transfer is faster, cheaper, and builds the muscle for cross-region mutual aid.

THE 24-HOUR RIM RULE
Every transaction (receipt, issue, transfer) should be entered in RIM within 24 business hours. Beyond that, your inventory record drifts from reality and the region loses the ability to make confident pre-positioning decisions.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "inv_aligns_demand",
            label: "Does current inventory align with historical and forecasted demand?",
            type: "yesno",
            help: "Compare your kit counts to the average demand over the last 3 years of Level 1–3 events. If you've been opening 5 shelters/year averaging 40 clients but stock 1,000 cots, you're misaligned.",
          },
          {
            id: "nrt_exceeded",
            label: "Are National Readiness Targets (NRT) exceeded?",
            type: "yesno",
            help: "NRT is the National-set floor by region size. 'Yes' = you have more than the NRT for one or more SKUs. Excess isn't automatically wrong, but it should be intentional and named.",
          },
          {
            id: "inv_positioned",
            label: "Is inventory positioned where it can support the Final Mile?",
            type: "yesno",
            help: "Final Mile = within reach of likely shelter sites in 2–4 hours of activation. A central warehouse 5 hours from your top risk county is not Final Mile positioning.",
          },
        ],
      },
      {
        title: "Inventory Management Plan",
        fields: [
          {
            id: "mission_critical_skus",
            label: "Mission-critical SKUs (e.g., cots, blankets, comfort kits)",
            type: "textarea",
            rows: 5,
            help: `List your top 8–12 SKUs by criticality (not just count). For each, note:
• Current on-hand quantity
• NRT target for your region size
• Position (warehouse / chapter / shelter / partner)
• Replenishment lead time

Example row: "Cots — 380 on-hand / NRT 250 / Albany warehouse / 3-day Coupa lead time"

This is the basis for the right-sizing analysis.`,
          },
          {
            id: "shelter_storage_possible",
            label: "Is shelter storage possible?",
            type: "yesno",
            help: "Some shelter agreements include dedicated lockable storage (a closet, cage, or trailer at the site). This is the shortest possible Final Mile — supplies are already at the shelter when you open it.",
          },
          {
            id: "trailer_to_shelter",
            label: "Can some trailer storage be moved to shelters?",
            type: "yesno",
            help: "If shelter agreements allow on-site storage, you can shift inventory from trailers (which need to be towed to event) to shelters (already in place). This is the single biggest lever for hitting the 4-hour shelter clock.",
          },
          {
            id: "trailer_to_shelter_detail",
            label: "If yes, describe",
            type: "textarea",
            rows: 3,
            help: "Name the shelters where storage is feasible and roughly what would move (e.g., '50 cots and 100 blankets to Saratoga HS shelter cage; 30 comfort kits to Plattsburgh church basement').",
          },
          {
            id: "trailer_to_warehouse",
            label: "Can some trailer storage be moved to warehouses or offices?",
            type: "yesno",
            help: "Inventory currently in trailers (parked, requiring tow) could move to a warehouse or chapter office for easier access, lower deterioration, and reduced trailer maintenance load.",
          },
          {
            id: "trailer_to_warehouse_detail",
            label: "If yes, describe",
            type: "textarea",
            rows: 3,
            help: "Specify which trailers, what inventory, and the destination facility. Mention any space constraints at the destination.",
          },
          {
            id: "replenishment_strategy",
            label: "Replenishment strategy (replenishment from within before Coupa)",
            type: "textarea",
            rows: 5,
            help: `Describe how the region replenishes from internal sources BEFORE Coupa. Walk through the decision tree:

1. Local chapter pull (within region) — who calls whom?
2. Adjacent chapter pull
3. Sister region (within NE Division) — what's the inter-region escalation path?
4. Coupa as last resort

Name the role accountable at each step. The goal is to make Coupa a backstop, not the default.`,
          },
          {
            id: "excess_inventory_share",
            label: "Do you have excess inventory that can be sent to other regions as needed?",
            type: "yesno",
            help: "Excess = above NRT and not positioned for a region-specific risk. Naming excess here lets Division pool resources across regions during high-tempo periods.",
          },
          {
            id: "excess_inventory_detail",
            label: "If yes, describe",
            type: "textarea",
            rows: 3,
            help: "List SKU + quantity + current location. Example: '120 cots above NRT, available from Hartford chapter, 24-hour notice required.'",
          },
        ],
      },
      {
        title: "Inventory Control & Hygiene",
        fields: [
          {
            id: "rim_24h_plan",
            label: "Plan to enter RIM transactions within 24 business hours?",
            type: "yesno",
            help: "Beyond 24 business hours, RIM stops being a reliable inventory record. 'Yes' requires a named owner, a backup, and a process — not just intent.",
          },
          {
            id: "rim_24h_detail",
            label: "Describe the plan",
            type: "textarea",
            rows: 3,
            help: "Who enters transactions? What is the backup when they're out? How is compliance audited? This is one of the cheapest, highest-leverage hygiene investments.",
          },
          {
            id: "cycle_counting_cadence",
            label: "Cycle counting cadence",
            type: "select",
            options: CADENCE_OPTS,
            help: "How often is physical inventory reconciled against RIM. Quarterly is the recommended cadence for regions with active inventory movement; semi-annual is the floor.",
          },
          {
            id: "inventory_owners",
            label: "Assigned inventory owners",
            type: "textarea",
            rows: 3,
            help: "Each location with material inventory should have a named owner — the person who knows what's there, signs off on counts, and approves transfers.",
          },
          {
            id: "self_audit_process",
            label: "Self-audit and accountability process",
            type: "textarea",
            rows: 4,
            help: "What's the internal check that catches drift before Division audit does? Examples: spot-check by RDO every quarter, paired counts between chapters, surprise visits.",
          },
        ],
      },
    ],
  },
  {
    id: "shelter-strategy",
    number: 5,
    title: "Shelter Strategy & Capacity Alignment",
    objective: "Objective 4: Align Shelter Capacity with Risk, Not Population Alone",
    help: `Risk-aligned, not population-aligned. A county with 500K people and zero historical disaster incidents needs less shelter capacity than a county with 80K people and 4 declared events in 5 years.

THE THREE TESTS
1. ARE PRIMARY/SECONDARY SHELTERS IN HIGH-PROBABILITY RISK AREAS? — proximity to flood plains, wildfire interface zones, dense building stock that suffers structure fires, transportation corridors prone to incidents.
2. ARE CAPACITIES RIGHT-SIZED? — total capacity should reflect realistic Level 1–3 demand (typically 25–250 clients per event), not theoretical worst case.
3. IS THERE OVER-RELIANCE ON A FEW LARGE SHELTERS? — single point of failure. If your "primary" shelter is unavailable on the day of an event (other event, school in session, partner unwilling), the 4-hour clock dies.

12-MONTH CONTACT RULE
Every approved shelter should have been contacted in the last 12 months — not just a passive agreement on file. Phone call, walkthrough, or partner check-in. Surfaces stale agreements before you need the space.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "shelters_in_risk_areas",
            label: "Are primary and secondary shelters located in high-probability risk areas?",
            type: "yesno",
            help: "Compare your shelter map to your hazard map. Shelters concentrated where Red Cross has historic relationships (rather than where risk is highest) is a common alignment gap.",
          },
          {
            id: "shelter_capacity_appropriate",
            label: "Are shelter capacities appropriate for historical Level 1–3 demand?",
            type: "yesno",
            help: "Look at the size distribution of shelters opened in the last 24 months. If most events used <100 cots but your primary list is all 500+ cot facilities, you're over-sized for typical events and under-flexible for small ones.",
          },
          {
            id: "over_reliance_large_shelters",
            label: "Is there over-reliance on a small number of large shelters?",
            type: "yesno",
            help: "Test: if your top 2 shelters are both unavailable, what happens? If the answer is 'we improvise,' you're over-reliant. Goal: 3+ approved options for every high-risk geography.",
          },
        ],
      },
      {
        title: "Regional Shelter Plan",
        fields: [
          {
            id: "shelters_contacted_12mo",
            label: "Have all of your shelters been contacted in the last 12 months?",
            type: "yesno",
            help: "Active contact = phone call, walkthrough, or partner check-in. Just having the agreement on file does not count.",
          },
          {
            id: "shelter_info_update_plan",
            label: "Plan to update shelter information",
            type: "textarea",
            rows: 4,
            help: "How will you systematically refresh shelter records? Cadence, owner, what gets verified each pass (capacity, key contact, ADA features, generator, pet policy, COVID-era updates).",
          },
          {
            id: "preferred_shelter_storage",
            label: "Preferred shelter storage opportunities",
            type: "textarea",
            rows: 4,
            help: "Which shelters could host pre-positioned inventory? Note site name, what it could hold, partner relationship status, and any access constraints (e.g., 'after-hours key requires call-out').",
          },
          {
            id: "shelter_partner_coordination",
            label: "Coordination with jurisdictions and partners",
            type: "textarea",
            rows: 4,
            help: "How does the region coordinate with emergency managers, school districts, faith communities, and CBOs? Naming the partnership cadence (annual exercise, quarterly check-in, etc.) is more useful than naming every partner.",
          },
        ],
      },
    ],
  },
  {
    id: "transportation",
    number: 6,
    title: "Transportation & Asset Strategy",
    objective: "Objective 5: Reduce Trailer Dependency and Improve Mobility",
    help: `Trailers were the right answer in an era when shelter inventory was bulky and shelter sites were unpredictable. They are increasingly a liability:

• Each trailer requires a tow vehicle and a trained tow-rated driver.
• Trailers depreciate, need registration, inspection, tires, and PM.
• Pre-positioned trailers spend 99% of their life parked.
• Cargo vans/SUVs cover most Level 1–3 needs faster and with broader driver pools.

GOAL: REDUCE TRAILER COUNT, INCREASE MOBILITY
The right number is rarely zero, but it is almost always lower than today. The remaining trailers should be strategically placed (e.g., one large trailer per high-risk corridor) rather than evenly distributed.

THE BUDGET CHECK
PM (preventive maintenance) is non-optional. If you don't have a PM budget, the fleet is decaying — answer 'No' here even if uncomfortable. It's an honest signal Division can act on.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "trailers_active",
            label: "Trailers actively maintained, registered, and deployable (#)",
            type: "number",
            help: "Count ONLY trailers that are: (a) registered and current, (b) inspected, (c) have a trained driver assigned, (d) verified deployable in the last 6 months. Do not count parked unknowns.",
          },
          {
            id: "trained_drivers_available",
            label: "Are trained drivers available to meet deployment timelines?",
            type: "yesno",
            help: "Test: at 2 a.m. on a Tuesday, can you reach a trained tow-rated driver within the 2-hour mobilization window? If your driver pool is one or two people, the answer is 'Partial' at best.",
          },
          {
            id: "vans_suvs_or_shelter_storage",
            label: "Can inventory be transported using vans/SUVs or stored at shelters?",
            type: "yesno",
            help: "For most Level 1–3 events, a cargo van or full-size SUV moves enough kit to open a small-medium shelter. Combined with shelter-stored inventory, you may not need a trailer at all.",
          },
          {
            id: "tow_vehicles_available",
            label: "Do you have the necessary tow vehicles?",
            type: "yesno",
            help: "Tow vehicles must match trailer GVWR. A common gap: trailers rated for a 3/4-ton tow paired with a half-ton SUV. Document the vehicle-to-trailer pairing.",
          },
          {
            id: "trailer_decrease_needs_vehicles",
            label: "If trailer inventory was decreased, would you need additional vehicles?",
            type: "yesno",
            help: "Reducing trailers without adding van/SUV capacity creates a coverage gap. If 'Yes', specify count and type below — that becomes a Division budget request.",
          },
          {
            id: "additional_vehicles_count",
            label: "If yes, how many?",
            type: "number",
            help: "Number of additional vehicles needed to maintain coverage after trailer reduction.",
          },
          {
            id: "additional_vehicles_type",
            label: "What type? (van / SUV / box truck / other)",
            type: "text",
            help: "Specific vehicle class (cargo van, passenger van, SUV with tow rating, box truck, etc.). Note any mission-specific requirements (4WD, lift gate, etc.).",
          },
          {
            id: "trailers_registered",
            label: "Are your trailers registered?",
            type: "yesno",
            help: "Every active trailer should have current registration. Lapsed registrations create legal exposure when crossing state lines during response.",
          },
          {
            id: "trailers_inspected",
            label: "Inspected?",
            type: "yesno",
            help: "Annual safety inspection (state-required where applicable, plus internal walk-around). Lapsed inspection = trailer is parked, not deployable.",
          },
          {
            id: "preventive_maintenance_budget",
            label: "Do you have a Preventive Maintenance budget?",
            type: "yesno",
            help: "Dedicated line item for PM (tires, brakes, bearings, lights). Without it, maintenance is reactive and the fleet decays.",
          },
          {
            id: "preventive_maintenance_amount",
            label: "Annual PM budget amount",
            type: "currency",
            help: "Total annual PM dollars across the trailer fleet. Industry rule of thumb: ~$300–600 per trailer per year for routine PM.",
          },
        ],
      },
      {
        title: "Regional Asset Strategy",
        fields: [
          {
            id: "recommended_trailer_total",
            label: "Recommended total number of trailers",
            type: "number",
            help: "Your target trailer count after right-sizing. Tie this number to a coverage rationale (e.g., 'one trailer per high-risk corridor + 1 reserve').",
          },
          {
            id: "recommended_trailers_per_chapter",
            label: "Recommended number of trailers per chapter",
            type: "textarea",
            rows: 4,
            help: "Distribution by chapter. Example: 'Albany 2, Plattsburgh 1, Syracuse 2, Rochester 1, Buffalo 2 = 8 total.' Match risk geography, not chapter HQ count.",
          },
          {
            id: "recommended_trailer_size",
            label: "Recommended trailer size",
            type: "select",
            options: ["6x12", "7x14", "8.5x20", "8.5x24", "Mixed", "Other"],
            help: "Smaller trailers are easier to tow and park; larger ones move more. 'Mixed' is common — small for chapter-level, large for divisional surge. Avoid over-standardizing if your geography is varied.",
          },
        ],
      },
    ],
  },
  {
    id: "workforce",
    number: 7,
    title: "Workforce Readiness & Training",
    objective: "Objective 6: Build a Sustainable Logistics Workforce (Blue Sky & Grey Sky)",
    help: `BLUE SKY = the steady state. Workforce planning, training, recruitment, mentorship.
GREY SKY = active response. Activation, deployment, in-the-moment decisions.

A region with a great Grey Sky team but no Blue Sky pipeline is one retirement away from collapse. A region with deep Blue Sky bench but no recent Grey Sky reps loses muscle memory.

THE FIVE LOGISTICS FUNCTIONS
Facilities — the buildings (warehouses, chapter offices, fleet yards)
Fulfillment — picking, packing, kitting
Sourcing — buying, vendor relationships, donated goods
Transportation — drivers, fleet, dispatch
Warehousing — receipt, storage, inventory hygiene

Every region needs at least one trained person in each function, plus a backup. "Single points of failure" means one person in any function with no understudy.

"BRING YOUR VOLUNTEER TO WORK"
The mentorship program where a volunteer shadows a paid staff member or experienced volunteer during real (Blue Sky) operations. It's how the next generation gains reps without waiting for a disaster.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "have_managers_supervisors_sa",
            label: "Do you have the necessary Managers, Supervisors, and Service Associates?",
            type: "yesno",
            help: "Manager = function lead (paid); Supervisor = shift/role lead (paid or experienced volunteer); Service Associate = front-line role. 'Partial' is common and honest — name where the gaps are below.",
          },
          {
            id: "single_points_of_failure",
            label: "Are there single points of failure in specialized roles?",
            type: "yesno",
            help: "One specialist (forklift operator, RIM admin, fleet manager) with no understudy = single point of failure. Almost every region has at least one. Naming it is the first step.",
          },
          {
            id: "single_points_detail",
            label: "If yes, describe",
            type: "textarea",
            rows: 3,
            help: "Name the role and the gap. Example: 'Only one trained forklift operator in the Albany warehouse — covers all inbound. No backup. Mitigation: train 2 volunteers this fall.'",
          },
          {
            id: "new_volunteer_experience_path",
            label: "How will new volunteers gain experience?",
            type: "textarea",
            rows: 4,
            help: "Walk through the path from sign-up to deployment-ready. What training, what mentorship, what first reps? Programs to mention if used: BYVTW, cross-training rotations, regional exercises, in-process shadowing.",
          },
        ],
      },
      {
        title: "Staffing Plan",
        fields: [
          {
            id: "roles_by_function",
            label:
              "Roles needed by function (Facilities, Fulfillment, Sourcing, Transportation, Warehousing)",
            type: "textarea",
            rows: 6,
            help: `For each of the five functions, list:
• Manager (1 needed) — name or 'open'
• Supervisor (1–2) — name or 'open'
• Service Associates (count) — current vs. target

Example:
TRANSPORTATION: Mgr — J. Doe; Sup — open; SA — 4 of 6 trained drivers.

This becomes the recruitment-gap baseline for the next field.`,
          },
          {
            id: "recruitment_gaps",
            label: "Recruitment gaps",
            type: "textarea",
            rows: 4,
            help: "Where you're under target. Be specific: function, role, count needed, target date. 'We need more volunteers' is not actionable; '2 trained tow drivers in Plattsburgh by Sept' is.",
          },
          {
            id: "redundancy_strategies",
            label: "Redundancy strategies",
            type: "textarea",
            rows: 4,
            help: "How you eliminate single points of failure. Cross-training matrices, paired roles, sister-chapter coverage agreements, leveraging adjacent regions for surge support.",
          },
        ],
      },
      {
        title: "Training & Development",
        fields: [
          {
            id: "required_training",
            label: "Required logistics and systems training",
            type: "textarea",
            rows: 4,
            help: "List the training matrix — by role, what courses are required (RIM, Coupa, ICS-100/200, shelter ops, fleet, forklift, etc.). Note current completion rate.",
          },
          {
            id: "byvtw_participation",
            label: "“Bring Your Volunteer to Work” mentorship participation?",
            type: "yesno",
            help: "BYVTW pairs volunteers with paid staff during real Blue Sky operations. 'Yes' means you have an active program with named pairs and a cadence.",
          },
          {
            id: "byvtw_detail",
            label: "Describe participation",
            type: "textarea",
            rows: 3,
            help: "Number of pairs, function coverage, frequency of mentor sessions, completion goal. If you're not running it yet, name a target start date.",
          },
          {
            id: "cross_training",
            label: "Cross-training and shadowing",
            type: "textarea",
            rows: 4,
            help: "How volunteers and staff broaden their function exposure. Examples: rotate fulfillment volunteers through warehousing for a quarter; supervisor shadowing during exercises.",
          },
        ],
      },
    ],
  },
  {
    id: "partnerships",
    number: 8,
    title: "Partnerships & Community Integration",
    objective: "Objective 7: Leverage Community-Centered Storage and Support",
    help: `Red Cross does not have to own everything. Partner-supported storage and sheltering is faster to stand up, closer to the affected community, and frees Red Cross capital for higher-leverage uses.

GOOD PARTNER CANDIDATES
• School districts — large, predictable, often willing
• Faith communities — distributed, community-trusted, frequently underused
• Community-based organizations (CBOs) — embedded relationships in vulnerable populations
• Municipal facilities (rec centers, senior centers) — emergency-management aligned
• Corporate logistics partners — donated warehousing, transportation

WHAT TO MEASURE
Not just "we have partners" — but how much of your storage / shelter capacity could shift to partner-supported. A region that could shift 30%+ of inventory to in-kind locations is operating at a different cost structure than one stuck with a leased warehouse.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "partner_storage_sheltering",
            label: "What partners can support storage or sheltering?",
            type: "textarea",
            rows: 5,
            help: "List named partners (org, contact, status). Group by type: schools, faith communities, CBOs, municipal, corporate. Indicate which have signed MOUs vs. handshake.",
          },
          {
            id: "shift_to_partner_locations",
            label: "Can inventory be shifted to in-kind or partner-supported locations?",
            type: "yesno",
            help: "'Yes' if you have at least one partner agreement that could host pre-positioned inventory. 'Partial' if you have candidates but no formal agreement.",
          },
          {
            id: "shift_amount",
            label: "How much can be shifted?",
            type: "textarea",
            rows: 3,
            help: "Estimate as a percentage of total inventory and/or specific SKU counts. Example: '~25% of comfort kits to 4 partner faith communities; ~10% of cots to 2 school district storage rooms.'",
          },
        ],
      },
    ],
  },
  {
    id: "governance",
    number: 9,
    title: "Governance, Monitoring & Continuous Improvement",
    help: `A plan that isn't reviewed becomes fiction. Section 9 is about how the region holds itself accountable between annual assessments.

THE THREE LAYERS
1. OPERATIONAL CADENCE — inventory cycle counts, roster reviews, trailer inspections. Measured in weeks/months.
2. STRATEGIC CADENCE — quarterly readiness reviews, annual readiness workshop. Measured in quarters/years.
3. INCIDENT-DRIVEN — after-action reviews after every event, with a closeout that updates the plan.

HOW GAPS GET ESCALATED
Be explicit. "Issues are escalated to the RDO" is weak. "Gaps that threaten the 2/4 standard are flagged within 24 hours to the RDO; gaps unresolved in 30 days are escalated to COO and Division" is strong.`,
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "progress_monitoring",
            label: "How will progress be monitored?",
            type: "textarea",
            rows: 4,
            help: "What recurring meetings, reports, or dashboards track delivery against this plan? Name the artifact, the cadence, and the audience (RDO weekly, COO monthly, Division quarterly, etc.).",
          },
          {
            id: "gap_escalation",
            label: "How will gaps be escalated and addressed?",
            type: "textarea",
            rows: 4,
            help: "Specific escalation path with timeframes. Cover: who flags, who owns resolution, when does it go up the chain, what's the remedy menu.",
          },
        ],
      },
      {
        title: "Governance & Cadence",
        fields: [
          {
            id: "inventory_roster_review_cadence",
            label: "Inventory and roster reviews cadence",
            type: "select",
            options: CADENCE_OPTS,
            help: "Combined cadence for inventory cycle counts and workforce roster review. Quarterly recommended for active regions; semi-annual is the floor.",
          },
          {
            id: "trailer_inspection_cadence",
            label: "Trailer and equipment inspections cadence",
            type: "select",
            options: CADENCE_OPTS,
            help: "Inspection cadence for trailers and major equipment. Quarterly walk-around + annual deep inspection is the standard.",
          },
          {
            id: "annual_workshop_participation",
            label: "Annual Readiness Workshop participation?",
            type: "yesno",
            help: "Division-hosted readiness workshop. Active participation by RDO + key staff is expected; sending one delegate occasionally is 'Partial.'",
          },
        ],
      },
    ],
  },
  {
    id: "other",
    number: 10,
    title: "Other",
    help: "Catch-all for issues, dependencies, or open questions that don't fit cleanly into Sections 1–9. Division reads this section last but takes it seriously — it often surfaces regional-specific blockers leadership can help unstick.",
    subsections: [
      {
        title: "Other",
        fields: [
          {
            id: "other_issues",
            label: "What other issues need to be addressed?",
            type: "textarea",
            rows: 5,
            help: "Anything you've thought about that doesn't fit elsewhere. Common themes: facility leases expiring, partner relationship transitions, leadership succession, region-specific funding constraints.",
          },
          {
            id: "questions",
            label: "Questions",
            type: "textarea",
            rows: 4,
            help: "Open questions for Division leadership. Use this for things you actively want a response on, not rhetorical concerns. Each question should be specific enough to answer.",
          },
        ],
      },
    ],
  },
  {
    id: "summary",
    number: 11,
    title: "Regional Readiness Summary",
    help: `The executive summary. RDO/COO/ED reviewers read this first. Make it count.

OVERALL READINESS
• LOW = cannot meet 2/4 today; significant gaps in multiple sections
• MODERATE = meets 2/4 most events; named gaps with credible plans
• HIGH = consistently meets 2/4; refining for efficiency

Be honest. "Moderate with a clear path to High" is more credible than "High" with shaky data.

TOP 3 STRENGTHS / GAPS / PRIORITY ACTIONS
Discipline yourself to three. The point of three is forced prioritization. A list of 10 strengths means nothing is the strength.`,
    subsections: [
      {
        title: "Summary",
        fields: [
          {
            id: "overall_readiness",
            label: "Overall Readiness Assessment",
            type: "select",
            options: ["Low", "Moderate", "High"],
            help: "Honest self-assessment. Division calibrates against measured 2/4 performance — overstating here is detected and undermines credibility.",
          },
          {
            id: "top_strengths",
            label: "Top 3 Strengths",
            type: "triple",
            help: "Three things this region does well that other regions could learn from. Specific > generic. 'Strong volunteer culture' is generic; 'BYVTW pipeline produces 8–10 deployment-ready volunteers/year' is specific.",
          },
          {
            id: "top_gaps",
            label: "Top 3 Gaps / Risks",
            type: "triple",
            help: "Three biggest risks to meeting the standard, ranked. Each should be addressable in the priority-actions block below.",
          },
          {
            id: "priority_actions",
            label: "Priority Actions (Next 90–180 Days)",
            type: "textarea",
            rows: 6,
            help: `The 5–8 specific actions to take in the next 90–180 days. For each:
• Action (verb-first, specific)
• Owner (named person)
• Target completion date
• Success metric

These actions become the basis for the next quarterly review.`,
          },
        ],
      },
    ],
  },
  {
    id: "approval",
    number: 12,
    title: "Approval & Accountability",
    help: "Sign-off makes the plan real. The RDO prepares; the COO/ED/Division reviews. Without dated signatures, this is a draft.",
    subsections: [
      {
        title: "Sign-off",
        fields: [
          {
            id: "prepared_by",
            label: "Prepared By",
            type: "text",
            help: "Full name and title of the person who prepared this plan — typically the Regional Disaster Officer.",
          },
          {
            id: "prepared_date",
            label: "Date prepared",
            type: "date",
            help: "Date the plan was finalized for review. Plans are due June 15, 2026.",
          },
          {
            id: "reviewed_by",
            label: "Reviewed By (RDO / COO / ED)",
            type: "text",
            help: "Full name(s) and title(s) of reviewer(s). Multiple reviewers can be listed if the plan was reviewed by RDO + COO + ED separately.",
          },
          {
            id: "reviewed_date",
            label: "Date reviewed",
            type: "date",
            help: "Date of final review and approval. Implementation begins July 1, 2026.",
          },
        ],
      },
    ],
  },
];

export type FormValues = Record<string, string | string[] | number | undefined>;

export function emptyFormValues(): FormValues {
  const v: FormValues = {};
  for (const s of SCHEMA) {
    for (const sub of s.subsections) {
      for (const f of sub.fields) {
        if (f.type === "checklist") v[f.id] = [];
        else if (f.type === "triple") {
          v[`${f.id}_1`] = "";
          v[`${f.id}_2`] = "";
          v[`${f.id}_3`] = "";
        } else v[f.id] = "";
      }
    }
  }
  return v;
}
