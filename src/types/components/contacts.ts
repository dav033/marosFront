// src/types/components/contacts.ts

import type { Contacts } from "../domain/entities";

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
  loading?: boolean;
  onRowClick?: (row: unknown) => void;
  onEdit?: (row: unknown) => void;
  onDelete?: (row: unknown) => void;
}

// Contact Form specific props for the form component
export interface ContactFormComponentProps {
  form: import("./form").ContactFormData;
  onChange: (field: keyof import("./form").ContactFormData, value: string) => void;
  error?: string | null;
}
