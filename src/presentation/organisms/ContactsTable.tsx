// src/components/contacts/ContactsTable.tsx
import React, { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { contactTableColumns } from "@/presentation/molecules/ContactTableColumns";
import ContactSection from "@/presentation/organisms/ContactSection";
import { SearchBoxWithDropdown } from "../molecules/SearchBoxWithDropdown.tsx";
import { useSearch } from "@/hooks/useSearch";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import type { ContactFormData } from "@/types";
import CreateContactModal from "./CreateContactModal";
import {
  contactsSearchConfig,
  contactsSearchPlaceholder,
} from "@/components/contacts/contactsSearchConfig";
import { Button } from "../atoms/index.ts";

const EditContactModal = lazy(() => import("./EditContactModal.tsx"));

export type ContactsTableProps = {
  contacts: Contacts[];
  onRefetch: () => Promise<void>;
};

export default function ContactsTable({ contacts, onRefetch }: ContactsTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contacts | null>(null);

  // creación
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
  } = useSearch<Contacts>(contacts, contactsSearchConfig);

  const memoColumns = useMemo(() => contactTableColumns, []);

  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleFieldChange = (field: string) =>
    setSelectedField(field as keyof Contacts);

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

  const handleEditOpen = useCallback((contact: Contacts) => {
    setEditingContact(contact);
    setIsEditOpen(true);
  }, []);

  const handleDeleteContact = useCallback(
    async (contactId: number) => {
      // TODO: deleteContact(contactId)
      await onRefetch();
    },
    [onRefetch]
  );

  // ⬇️ faltaba onSubmit para crear
  const handleCreateSubmit = useCallback(
    async (values: ContactFormData) => {
      try {
        setIsCreating(true);
        setCreateError(undefined);
        // TODO: createContact(values)
        await onRefetch();
        setIsCreateOpen(false);
      } catch (err: any) {
        setCreateError(err?.message ?? "Failed to create contact");
      } finally {
        setIsCreating(false);
      }
    },
    [onRefetch]
  );

  // ⬇️ NUEVO: handler requerido por EditContactModal
  const handleContactUpdated = useCallback(
    async (updated: Contacts) => {
      // puedes hacer optimista aquí si quieres
      await onRefetch();
      setIsEditOpen(false);
      setEditingContact(null);
    },
    [onRefetch]
  );

  return (
    <div
      className="w-full max-w-full mx-auto p-6"
      style={{ backgroundColor: "var(--color-dark)", color: "var(--color-light)" }}
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
            searchFields={searchFields}
            onClearSearch={clearSearch}
            placeholder={contactsSearchPlaceholder}
            hasActiveSearch={hasActiveSearch}
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
            serverError={createError}
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
