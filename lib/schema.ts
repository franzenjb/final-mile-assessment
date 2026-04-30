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

const YESNO_OPTS = ["Yes", "No", "Partial", "N/A"];
const CADENCE_OPTS = ["Quarterly", "Every 6 months", "Annual", "Other"];

export const SCHEMA: Section[] = [
  {
    id: "overview",
    number: 1,
    title: "Regional Overview",
    intro:
      "Identify the region, leadership, and high-level risk context. Plans are due June 15, 2026; implementation begins July 1, 2026.",
    help: "Use this section to record who is accountable for the plan and the regional risk profile that drives the rest of the document.",
    subsections: [
      {
        title: "Region & Leadership",
        fields: [
          { id: "rdo", label: "Regional Disaster Officer (RDO)", type: "text" },
          { id: "coo", label: "Chief Operating Officer (COO)", type: "text" },
          {
            id: "executive_directors",
            label: "Executive Director(s)",
            type: "textarea",
            rows: 2,
            placeholder: "List each ED and chapter/territory",
          },
          {
            id: "regional_context",
            label: "Regional Context",
            type: "textarea",
            rows: 5,
            placeholder:
              "Describe regional risk profile, geography, common hazards, and any structural constraints…",
            help: "Capture historical incident frequency, primary hazards (hurricane, winter storm, flood, fire), and demographic considerations that shape readiness.",
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
    help: "The 2/4 standard is the core benchmark. Every answer in later sections should ladder up to whether the region can meet it.",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          {
            id: "likely_scenarios",
            label: "Most likely Level 1–3 disaster scenarios (historical & forecasted)",
            type: "textarea",
            rows: 4,
          },
          {
            id: "positioning",
            label:
              "Where must supplies, people, and equipment be positioned to meet the 2-hour / 4-hour standard?",
            type: "textarea",
            rows: 4,
          },
          {
            id: "blockers",
            label: "What currently prevents the Region from consistently meeting this standard?",
            type: "textarea",
            rows: 4,
          },
          {
            id: "changes_block_standard",
            label: "Would any of the proposed changes prevent the region from meeting the standard?",
            type: "yesno",
          },
          {
            id: "changes_block_specify",
            label: "If yes, specify",
            type: "textarea",
            rows: 3,
          },
          { id: "warehouse_rent", label: "Do you pay rent for a warehouse?", type: "yesno" },
          { id: "warehouse_rent_amount", label: "How much (annual rent)?", type: "currency" },
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
            rows: 5,
          },
          {
            id: "strategy_changes",
            label:
              "Changes from current state to meet the standard (right-sizing kits, relocating inventory, staffing model adjustments, etc.)",
            type: "textarea",
            rows: 5,
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
          },
          {
            id: "shelter_open_hours",
            label: "Current avg. time to shelter opening (hours)",
            type: "number",
          },
          {
            id: "events_meeting_pct",
            label: "% of events meeting the standard",
            type: "number",
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
    help: "A plan that lives only in someone's head is not a plan. Outside staff and volunteers must be able to execute it.",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "has_written_plan", label: "Does the Region currently have a written operational plan?", type: "yesno" },
          { id: "plan_specific_l13", label: "Is it specific to Level 1–3 events?", type: "yesno" },
          {
            id: "plan_understood",
            label: "Is it understood and usable by staff and volunteers outside the Region?",
            type: "yesno",
          },
        ],
      },
      {
        title: "Plan Components",
        description: "Check all components currently included in the plan.",
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
          { id: "plan_updates_needed", label: "Plan updates or development needed", type: "textarea", rows: 4 },
          { id: "plan_owner", label: "Who would own the plan?", type: "text" },
          {
            id: "plan_review_cadence",
            label: "Review cadence",
            type: "select",
            options: ["Quarterly", "Semi-annual", "Annual", "Other"],
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
    help: "Right-sized means inventory matches likely demand, is positioned to reach the Final Mile, and is counted and accurate.",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "inv_aligns_demand", label: "Does current inventory align with historical and forecasted demand?", type: "yesno" },
          { id: "nrt_exceeded", label: "Are National Readiness Targets (NRT) exceeded?", type: "yesno" },
          { id: "inv_positioned", label: "Is inventory positioned where it can support the Final Mile?", type: "yesno" },
        ],
      },
      {
        title: "Inventory Management Plan",
        fields: [
          {
            id: "mission_critical_skus",
            label: "Mission-critical SKUs (e.g., cots, blankets, comfort kits)",
            type: "textarea",
            rows: 4,
          },
          { id: "shelter_storage_possible", label: "Is shelter storage possible?", type: "yesno" },
          { id: "trailer_to_shelter", label: "Can some trailer storage be moved to shelters?", type: "yesno" },
          { id: "trailer_to_shelter_detail", label: "If yes, describe", type: "textarea", rows: 3 },
          { id: "trailer_to_warehouse", label: "Can some trailer storage be moved to warehouses or offices?", type: "yesno" },
          { id: "trailer_to_warehouse_detail", label: "If yes, describe", type: "textarea", rows: 3 },
          {
            id: "replenishment_strategy",
            label: "Replenishment strategy (replenishment from within before Coupa)",
            type: "textarea",
            rows: 4,
            help: "Describe how the region replenishes from internal sources (other chapters/regions) before placing a Coupa order.",
          },
          { id: "excess_inventory_share", label: "Do you have excess inventory that can be sent to other regions as needed?", type: "yesno" },
          { id: "excess_inventory_detail", label: "If yes, describe", type: "textarea", rows: 3 },
        ],
      },
      {
        title: "Inventory Control & Hygiene",
        fields: [
          { id: "rim_24h_plan", label: "Plan to enter RIM transactions within 24 business hours?", type: "yesno" },
          { id: "rim_24h_detail", label: "Describe the plan", type: "textarea", rows: 3 },
          {
            id: "cycle_counting_cadence",
            label: "Cycle counting cadence",
            type: "select",
            options: CADENCE_OPTS,
          },
          { id: "inventory_owners", label: "Assigned inventory owners", type: "textarea", rows: 3 },
          { id: "self_audit_process", label: "Self-audit and accountability process", type: "textarea", rows: 4 },
        ],
      },
    ],
  },
  {
    id: "shelter-strategy",
    number: 5,
    title: "Shelter Strategy & Capacity Alignment",
    objective: "Objective 4: Align Shelter Capacity with Risk, Not Population Alone",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "shelters_in_risk_areas", label: "Are primary and secondary shelters located in high-probability risk areas?", type: "yesno" },
          { id: "shelter_capacity_appropriate", label: "Are shelter capacities appropriate for historical Level 1–3 demand?", type: "yesno" },
          { id: "over_reliance_large_shelters", label: "Is there over-reliance on a small number of large shelters?", type: "yesno" },
        ],
      },
      {
        title: "Regional Shelter Plan",
        fields: [
          { id: "shelters_contacted_12mo", label: "Have all of your shelters been contacted in the last 12 months?", type: "yesno" },
          { id: "shelter_info_update_plan", label: "Plan to update shelter information", type: "textarea", rows: 4 },
          { id: "preferred_shelter_storage", label: "Preferred shelter storage opportunities", type: "textarea", rows: 4 },
          { id: "shelter_partner_coordination", label: "Coordination with jurisdictions and partners", type: "textarea", rows: 4 },
        ],
      },
    ],
  },
  {
    id: "transportation",
    number: 6,
    title: "Transportation & Asset Strategy",
    objective: "Objective 5: Reduce Trailer Dependency and Improve Mobility",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "trailers_active", label: "Trailers actively maintained, registered, and deployable (#)", type: "number" },
          { id: "trained_drivers_available", label: "Are trained drivers available to meet deployment timelines?", type: "yesno" },
          { id: "vans_suvs_or_shelter_storage", label: "Can inventory be transported using vans/SUVs or stored at shelters?", type: "yesno" },
          { id: "tow_vehicles_available", label: "Do you have the necessary tow vehicles?", type: "yesno" },
          { id: "trailer_decrease_needs_vehicles", label: "If trailer inventory was decreased, would you need additional vehicles?", type: "yesno" },
          { id: "additional_vehicles_count", label: "If yes, how many?", type: "number" },
          { id: "additional_vehicles_type", label: "What type? (van / SUV / box truck / other)", type: "text" },
          { id: "trailers_registered", label: "Are your trailers registered?", type: "yesno" },
          { id: "trailers_inspected", label: "Inspected?", type: "yesno" },
          { id: "preventive_maintenance_budget", label: "Do you have a Preventive Maintenance budget?", type: "yesno" },
          { id: "preventive_maintenance_amount", label: "Annual PM budget amount", type: "currency" },
        ],
      },
      {
        title: "Regional Asset Strategy",
        fields: [
          { id: "recommended_trailer_total", label: "Recommended total number of trailers", type: "number" },
          { id: "recommended_trailers_per_chapter", label: "Recommended number of trailers per chapter", type: "textarea", rows: 3, placeholder: "List by chapter" },
          {
            id: "recommended_trailer_size",
            label: "Recommended trailer size",
            type: "select",
            options: ["6x12", "7x14", "8.5x20", "8.5x24", "Mixed", "Other"],
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
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "have_managers_supervisors_sa", label: "Do you have the necessary Managers, Supervisors, and Service Associates?", type: "yesno" },
          { id: "single_points_of_failure", label: "Are there single points of failure in specialized roles?", type: "yesno" },
          { id: "single_points_detail", label: "If yes, describe", type: "textarea", rows: 3 },
          { id: "new_volunteer_experience_path", label: "How will new volunteers gain experience?", type: "textarea", rows: 4 },
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
            rows: 5,
          },
          { id: "recruitment_gaps", label: "Recruitment gaps", type: "textarea", rows: 4 },
          { id: "redundancy_strategies", label: "Redundancy strategies", type: "textarea", rows: 4 },
        ],
      },
      {
        title: "Training & Development",
        fields: [
          { id: "required_training", label: "Required logistics and systems training", type: "textarea", rows: 4 },
          { id: "byvtw_participation", label: "“Bring Your Volunteer to Work” mentorship participation?", type: "yesno" },
          { id: "byvtw_detail", label: "Describe participation", type: "textarea", rows: 3 },
          { id: "cross_training", label: "Cross-training and shadowing", type: "textarea", rows: 4 },
        ],
      },
    ],
  },
  {
    id: "partnerships",
    number: 8,
    title: "Partnerships & Community Integration",
    objective: "Objective 7: Leverage Community-Centered Storage and Support",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "partner_storage_sheltering", label: "What partners can support storage or sheltering?", type: "textarea", rows: 4 },
          { id: "shift_to_partner_locations", label: "Can inventory be shifted to in-kind or partner-supported locations?", type: "yesno" },
          { id: "shift_amount", label: "How much can be shifted?", type: "textarea", rows: 3 },
        ],
      },
    ],
  },
  {
    id: "governance",
    number: 9,
    title: "Governance, Monitoring & Continuous Improvement",
    subsections: [
      {
        title: "Key Questions",
        fields: [
          { id: "progress_monitoring", label: "How will progress be monitored?", type: "textarea", rows: 4 },
          { id: "gap_escalation", label: "How will gaps be escalated and addressed?", type: "textarea", rows: 4 },
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
          },
          {
            id: "trailer_inspection_cadence",
            label: "Trailer and equipment inspections cadence",
            type: "select",
            options: CADENCE_OPTS,
          },
          { id: "annual_workshop_participation", label: "Annual Readiness Workshop participation?", type: "yesno" },
        ],
      },
    ],
  },
  {
    id: "other",
    number: 10,
    title: "Other",
    subsections: [
      {
        title: "Other",
        fields: [
          { id: "other_issues", label: "What other issues need to be addressed?", type: "textarea", rows: 5 },
          { id: "questions", label: "Questions", type: "textarea", rows: 4 },
        ],
      },
    ],
  },
  {
    id: "summary",
    number: 11,
    title: "Regional Readiness Summary",
    subsections: [
      {
        title: "Summary",
        fields: [
          {
            id: "overall_readiness",
            label: "Overall Readiness Assessment",
            type: "select",
            options: ["Low", "Moderate", "High"],
          },
          { id: "top_strengths", label: "Top 3 Strengths", type: "triple" },
          { id: "top_gaps", label: "Top 3 Gaps / Risks", type: "triple" },
          { id: "priority_actions", label: "Priority Actions (Next 90–180 Days)", type: "textarea", rows: 6 },
        ],
      },
    ],
  },
  {
    id: "approval",
    number: 12,
    title: "Approval & Accountability",
    subsections: [
      {
        title: "Sign-off",
        fields: [
          { id: "prepared_by", label: "Prepared By", type: "text" },
          { id: "prepared_date", label: "Date prepared", type: "date" },
          { id: "reviewed_by", label: "Reviewed By (RDO / COO / ED)", type: "text" },
          { id: "reviewed_date", label: "Date reviewed", type: "date" },
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
