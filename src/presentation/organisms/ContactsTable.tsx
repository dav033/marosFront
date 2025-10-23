import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";

import {
  contactsSearchConfig,
  contactsSearchPlaceholder,
} from "@/components";
import type { Contact } from "@/contact";
import { Button, ContactSection, contactTableColumns, SearchBoxWithDropdown } from "@/presentation";
import { useContactsApplication } from "@/presentation";
import { useSearch } from "@/shared";
import type { ContactFormData } from "@/types";
import { getErrorMessage } from "@/utils";

import CreateContactModal from "./CreateContactModal";

const EditContactModal = lazy(() => import("./EditContactModal.tsx"));

export type ContactsTableProps = {
  contacts: Contact[];
  onRefetch: () => Promise<void>;
};

export default function ContactsTable({
  contacts,
  onRefetch,
}: ContactsTableProps) {
  const app = useContactsApplication();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const create = React.useCallback(
    (draft: ContactFormData) => app.create(draft),
    [app]
  );
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | undefined>(undefined);

  const {
    searchTerm,
    selectedField,
    filteredData,
    searchFields,
    hasActiveSearch,
    setSearchTerm,
    setSelectedField,
    clearSearch,
  } = useSearch<Contact>(contacts, contactsSearchConfig);

  const memoColumns = useMemo(() => contactTableColumns, []);

  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleFieldChange = (field: string) =>
    setSelectedField(field as keyof Contact);

  const handleCreateClose = useCallback(
    async (shouldRefetch?: boolean) => {
      setIsCreateOpen(false);
      if (shouldRefetch) await onRefetch();
    },
    [onRefetch]
  );

  const handleEditClose = useCallback(
    async (shouldRefetch?: boolean) => {
      setIsEditOpen(false);
      setEditingContact(null);
      if (shouldRefetch) await onRefetch();
    },
    [onRefetch]
  );

  const handleEditOpen = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setIsEditOpen(true);
  }, []);

  const handleDeleteContact = useCallback(
    async (_contactId: number) => {
      await onRefetch();
    },
    [onRefetch]
  );
  const handleCreateSubmit = useCallback(
    async (_values: ContactFormData) => {
      try {
        setIsCreating(true);
        setCreateError(undefined);
        await create(_values);
        await onRefetch();
        setIsCreateOpen(false);
      } catch (err: unknown) {
        const msg =
          getErrorMessage(err) ||
          (err && typeof err === "object" && "message" in err
            ? String(
                (err as { message?: unknown }).message ??
                  "Failed to create contact"
              )
            : String(err ?? "Failed to create contact"));
        setCreateError(msg);
      } finally {
        setIsCreating(false);
      }
    },
    [onRefetch, create]
  );
  const handleContactUpdated = useCallback(
    async (_updated: Contact) => {
      await onRefetch();
      setIsEditOpen(false);
      setEditingContact(null);
    },
    [onRefetch]
  );

  return (
    <div
      className="w-full max-w-full mx-auto p-6"
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-light)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Create Contact
        </Button>

        <div className="flex-1 max-w-md">
          <SearchBoxWithDropdown
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedField={selectedField}
            onFieldChange={handleFieldChange}
            searchFields={searchFields.map(({ value, label }) => ({ key: value, label }))}
            onClearSearch={clearSearch}
            {...(contactsSearchPlaceholder
              ? { placeholder: contactsSearchPlaceholder }
              : {})}
            resultCount={filteredData.length}
            totalCount={contacts.length}
          />
        </div>
      </div>

      {/* Modales */}
      {isCreateOpen && (
        <Suspense fallback={null}>
          <CreateContactModal
            isOpen={true}
            onClose={handleCreateClose}
            onSubmit={handleCreateSubmit}
            submitting={isCreating}
            {...(createError ? { serverError: createError } : {})}
          />
        </Suspense>
      )}

      {isEditOpen && (
        <Suspense fallback={null}>
          <EditContactModal
            isOpen={isEditOpen}
            onClose={handleEditClose}
            contact={editingContact}
            onContactUpdated={handleContactUpdated}
          />
        </Suspense>
      )}

      {/* Tabla */}
      <ContactSection
        title={
          hasActiveSearch
            ? `Search Results (${filteredData.length})`
            : "All Contacts"
        }
        data={filteredData}
        columns={memoColumns}
        onEditContact={handleEditOpen}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  );
}
