// src/types/components/contacts.ts
/* eslint-disable simple-import-sort/imports */

import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Column } from "../components/table";
import type { ContactFormData } from "./form";

export interface ContactsTableProps {
  contacts: Contact[];
  onRefetch: () => Promise<void>;
}

// Singular aliases for gradual migration
export type ContactTableProps = ContactsTableProps;

export interface ContactSectionProps {
  title: string;
  data: Contact[];
  columns: Column<Contact>[];
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contactId: number) => void;
}

// Alias for contacts table skeleton (singular)
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

// Contact Form specific props for the form component
export interface ContactFormComponentProps {
  form: ContactFormData;
  onChange: (field: keyof ContactFormData, value: string) => void;
  error?: string | null;
}
