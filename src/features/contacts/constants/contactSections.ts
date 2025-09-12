import type { Contacts } from "src/types";

export const CONTACT_SECTIONS: Array<{
  title: string;
  filter: (contact: Contacts) => boolean;
}> = [
  { 
    title: "Active Contacts", 
    filter: (contact) => contact.isActive !== false 
  },
  { 
    title: "All Contacts", 
    filter: () => true 
  },
];
