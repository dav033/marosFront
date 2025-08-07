import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  lazy,
  useEffect,
} from "react";
import { useContacts } from "src/contexts/ContactsContext";
import { ContactsService } from "src/services/ContactsService";
import { contactTableColumns } from "./ContactTableColumns";
import ContactSection from "./ContactSection";
import { GenericButton } from "@components/common/GenerictButton";
import { SearchBoxWithDropdown } from "@components/common/SearchBoxWithDropdown";
import { useSearch } from "src/hooks/useSearch";
import { contactsSearchConfig, contactsSearchPlaceholder } from "./contactsSearchConfig";
import type { Contacts } from "src/types/types";

// Try absolute imports for the modals
const CreateContactModal = lazy(() => import("src/components/contacts/CreateContactModal"));
const EditContactModal = lazy(() => import("src/components/contacts/EditContactModal"));

export default function InteractiveTable() {
  const {
    contacts,
    isLoading,
    error,
    setContacts,
    setLoading,
    setError,
  } = useContacts();

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const contactsData = await ContactsService.getAllContacts();
        console.log("✅ Contacts loaded:", contactsData);
        setContacts(contactsData);
      } catch (err) {
        console.error("❌ Error loading contacts:", err);
        setError((err as Error).message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contacts | null>(null);

  // Search functionality
  const {
    searchTerm,
    setSearchTerm,
    selectedField,
    setSelectedField,
    filteredData: filteredContacts,
    clearSearch,
    hasActiveSearch,
    searchFields,
  } = useSearch(contacts, contactsSearchConfig);

  const handleCreateOpen = useCallback(() => setIsCreateOpen(true), []);
  const handleCreateClose = useCallback(() => setIsCreateOpen(false), []);
  
  const handleEditOpen = useCallback((contact: Contacts) => {
    setEditingContact(contact);
    setIsEditOpen(true);
  }, []);
  
  const handleEditClose = useCallback(() => {
    setIsEditOpen(false);
    setEditingContact(null);
  }, []);

  const memoColumns = useMemo(() => contactTableColumns, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <GenericButton className="text-sm" onClick={handleCreateOpen}>
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
        <Suspense fallback={<div>Loading form…</div>}>
          <CreateContactModal
            isOpen={isCreateOpen}
            onClose={handleCreateClose}
          />
        </Suspense>
      )}

      {isEditOpen && (
        <Suspense fallback={<div>Loading edit form…</div>}>
          <EditContactModal
            isOpen={isEditOpen}
            onClose={handleEditClose}
            contact={editingContact}
          />
        </Suspense>
      )}

      {/* Contacts Table */}
      <ContactSection
        title={hasActiveSearch ? `Search Results (${filteredContacts.length})` : "All Contacts"}
        data={filteredContacts}
        columns={memoColumns}
        onEditContact={handleEditOpen}
      />
    </div>
  );
}
