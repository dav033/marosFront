import type { Contacts, SearchConfig } from "@/types";

export const contactsSearchConfig: SearchConfig<Contacts> = {
  searchableFields: [
    { key: "companyName", label: "Company Name" },
    { key: "name", label: "Contact Name" },
  ],
  caseSensitive: false,
  searchType: "includes",
  defaultField: "companyName",
  fields: []
};

export const contactsSearchPlaceholder = "Search contacts...";
