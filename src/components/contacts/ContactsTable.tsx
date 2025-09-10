import React, { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { contactTableColumns } from "./ContactTableColumns";
import ContactSection from "./ContactSection";
import { GenericButton } from "@components/common/GenericButton";
import { SearchBoxWithDropdown } from "@components/common/SearchBoxWithDropdown";
import { useSearch } from "@/hooks/useSearch";
import {
  contactsSearchConfig,
  contactsSearchPlaceholder,
} from "./contactsSearchConfig";
import type { Contacts, ContactsTableProps } from "@/types";

// Try absolute imports for the modals
const CreateContactModal = lazy(
  () => import("src/components/contacts/CreateContactModal")
);
const EditContactModal = lazy(
  () => import("src/components/contacts/EditContactModal")
);

export default function ContactsTable({
  contacts,
  onRefetch,
}: ContactsTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contacts | null>(null);

  const {
    searchTerm,
    selectedField,
    filteredData: filteredContacts,
    searchFields,
    hasActiveSearch,
    setSearchTerm,
    setSelectedField,
    clearSearch,
  } = useSearch(contacts, contactsSearchConfig);

  const memoColumns = useMemo(() => contactTableColumns, []);

  const handleCreateClose = useCallback(
    async (shouldRefetch?: boolean) => {
      setIsCreateOpen(false);
      if (shouldRefetch) {
        await onRefetch();
      }
    },
    [onRefetch]
  );

  const handleEditClose = useCallback(
    async (shouldRefetch?: boolean) => {
      setIsEditOpen(false);
      setEditingContact(null);
      if (shouldRefetch) {
        await onRefetch();
      }
    },
    [onRefetch]
  );

  const handleEditOpen = useCallback((contact: Contacts) => {
    setEditingContact(contact);
    setIsEditOpen(true);
  }, []);

  const handleDeleteContact = useCallback(
    async (contactId: number) => {
      // Refetch data after deletion
      await onRefetch();
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
        <GenericButton
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Create Contact
        </GenericButton>

        <div className="flex-1 max-w-md">
          <SearchBoxWithDropdown
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedField={selectedField}
            onFieldChange={setSelectedField}
            searchFields={searchFields}
            onClearSearch={clearSearch}
            placeholder={contactsSearchPlaceholder}
            hasActiveSearch={hasActiveSearch}
            resultCount={filteredContacts.length}
            totalCount={contacts.length}
          />
        </div>
      </div>

      {isCreateOpen && (
        <Suspense fallback={null}>
          <CreateContactModal
            isOpen={isCreateOpen}
            onClose={handleCreateClose}
          />
        </Suspense>
      )}

      {isEditOpen && (
        <Suspense fallback={null}>
          <EditContactModal
            isOpen={isEditOpen}
            onClose={handleEditClose}
            contact={editingContact}
          />
        </Suspense>
      )}

      {/* Contacts Table */}
      <ContactSection
        title={
          hasActiveSearch
            ? `Search Results (${filteredContacts.length})`
            : "All Contacts"
        }
        data={filteredContacts}
        columns={memoColumns}
        onEditContact={handleEditOpen}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  );
}
