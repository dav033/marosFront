// src/types/components/contacts.ts (updated)

import type { Contacts } from "../domain/entities";
import type { ContactFormData } from "./form";

export interface ContactsTableProps {
  contacts: Contacts[];
  onRefetch: () => Promise<void>;
}

export interface ContactSectionProps {
  title: string;
  data: Contacts[];
  columns: import("../components/table").Column<Contacts>[];
  onEditContact?: (contact: Contacts) => void;
  onDeleteContact?: (contactId: number) => void;
}

export interface CreateContactModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
}

export interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contacts | null;
  onContactUpdated: (contact: Contacts) => void;
}

export interface ContactsTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export interface InteractiveTableProps {
  data: unknown[];
  columns: unknown[];
  onRowClick?: (item: unknown) => void;
  loading?: boolean;
}

// Contact Form specific props for the form component
export interface ContactFormComponentProps {
  form: ContactFormData;
  onChange: (field: keyof ContactFormData, value: string) => void;
  error?: string | null;
}
