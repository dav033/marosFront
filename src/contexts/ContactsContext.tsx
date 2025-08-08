import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Contacts } from "../types/types";

interface ContactsContextType {
  contacts: Contacts[];
  isLoading: boolean;
  error: string | null;
  setContacts: (contacts: Contacts[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addContact: (contact: Contacts) => void;
  updateContact: (contact: Contacts) => void;
  removeContact: (contactId: number) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContact = (contact: Contacts) => {
    setContacts((prev) => [...prev, contact]);
  };

  const updateContact = (updatedContact: Contacts) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  const removeContact = (contactId: number) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
  };

  const value: ContactsContextType = {
    contacts,
    isLoading,
    error,
    setContacts,
    setLoading,
    setError,
    addContact,
    updateContact,
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
