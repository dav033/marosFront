import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Contacts, ContactsContextType } from "@/types";

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    // TODO: Implement actual API call
    setLoading(true);
    try {
      // Placeholder implementation
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contacts, 'id'>) => {
    // TODO: Implement actual API call
    const newContact: Contacts = {
      ...contact as Contacts,
      id: Date.now(), // Temporary ID generation
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const updateContact = async (id: number, contactUpdates: Partial<Contacts>) => {
    // TODO: Implement actual API call
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, ...contactUpdates } : contact
      )
    );
  };

  const deleteContact = async (id: number) => {
    // TODO: Implement actual API call
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const removeContact = (contactId: number) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
  };

  const clearError = () => {
    setError(null);
  };

  const refetch = async () => {
    await fetchContacts();
  };

  const value: ContactsContextType = {
    contacts,
    loading: isLoading,
    isLoading,
    error,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    clearError,
    refetch,
    setContacts,
    setLoading,
    setError,
    removeContact,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = (): ContactsContextType => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};
