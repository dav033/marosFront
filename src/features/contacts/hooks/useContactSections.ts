import { useMemo } from "react";
import type { Contacts } from "src/types";
import { CONTACT_SECTIONS } from "src/features/contacts/constants/contactSections";

export type ContactSectionData = {
  title: string;
  data: Contacts[];
};

export function useContactSections(contacts: Contacts[] = []): ContactSectionData[] {
  return useMemo(
    () =>
      CONTACT_SECTIONS.map(({ title, filter }) => ({
        title,
        data: contacts.filter(filter),
      })),
    [contacts]
  );
}
