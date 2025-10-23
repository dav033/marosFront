
import type { Contact } from "@/contact";

import type { Column } from ".";
import type { ContactFormData } from "./form";

export interface ContactsTableProps {
  contacts: Contact[];
  onRefetch: () => Promise<void>;
}
export type ContactTableProps = ContactsTableProps;

export interface ContactSectionProps {
  title: string;
  data: Contact[];
  columns: Column<Contact>[];
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contactId: number) => void;
}
export type ContactTableSkeletonProps = ContactsTableSkeletonProps;

export interface CreateContactModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
}

export interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onContactUpdated: (contact: Contact) => void;
}

export interface ContactsTableSkeletonProps {
  rows?: number;
  columns?: number;
}
export interface ContactFormComponentProps {
  form: ContactFormData;
  onChange: (field: keyof ContactFormData, value: string) => void;
  error?: string | null;
}
