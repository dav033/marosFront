import type { SearchConfig } from "@/types";
import type { Lead } from "@/types";
export const leadsSearchConfig: SearchConfig<Lead> = {
  searchableFields: [
    { key: "leadNumber", label: "Lead Number" },
    { key: "name", label: "Lead Name" },
    { key: "location", label: "Location" },
    { key: "contact.name", label: "Contact Name" },
    { key: "contact.companyName", label: "Company Name" },
    { key: "projectType.name", label: "Project Type" },
  ],
  caseSensitive: false,
  searchType: "includes",
  defaultField: "name",
  fields: []
};

export const leadsSearchPlaceholder = "Search leads...";
