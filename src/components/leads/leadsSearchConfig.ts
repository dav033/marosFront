import type { SearchConfig } from "../../hooks/useSearch";
import type { Lead } from "@/types";
export const leadsSearchConfig: SearchConfig<Lead> = {
  searchableFields: [
    { value: "leadNumber", label: "Lead Number" },
    { value: "name", label: "Lead Name" },
    { value: "location", label: "Location" },
    { value: "contact.name", label: "Contact Name" },
    { value: "contact.companyName", label: "Company Name" },
    { value: "projectType.name", label: "Project Type" },
  ],
  caseSensitive: false,
  searchType: "includes",
  defaultField: "name",
};

export const leadsSearchPlaceholder = "Search leads...";
