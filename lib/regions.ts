export const NORTHEAST_REGIONS = [
  { id: "ct-ri", name: "Connecticut & Rhode Island Region" },
  { id: "eastern-ny", name: "Eastern New York Region" },
  { id: "greater-ny", name: "Greater New York Region" },
  { id: "greater-pa", name: "Greater Pennsylvania Region" },
  { id: "massachusetts", name: "Massachusetts Region" },
  { id: "northern-new-england", name: "Northern New England Region" },
  { id: "south-central-pa", name: "South Central Pennsylvania Region" },
  { id: "western-ny", name: "Western New York Region" },
] as const;

export type RegionId = (typeof NORTHEAST_REGIONS)[number]["id"];
