import type { Contact } from "@/features/contact/domain/models/Contact";
import type { SearchConfig } from "@/shared/search/useSearch";

export const contactsSearchPlaceholder = "Search contacts…";

export const contactsSearchConfig: SearchConfig<Contact> = {
  fields: [
    { key: "companyName", label: "Company" },
    { key: "name", label: "Contact Name" },
    { key: "occupation", label: "Occupation" },
    { key: "product", label: "Product" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "lastContact", label: "Last Contact" },
    { key: "id", label: "ID" },
  ],
  defaultField: "name",
  normalize: (s) => s.toLowerCase().trim(),
};
