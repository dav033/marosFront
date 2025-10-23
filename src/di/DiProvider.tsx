import React, { createContext, useContext, useMemo } from "react";

import type { ContactsAppContext } from "@/contact";
import { makeContactsAppContext } from "@/contact";
import { ContactHttpRepository } from "@/contact";
import type { LeadsAppContext } from "@/leads";
import { makeLeadsAppContext, SystemClock } from "@/leads";
import {
  ContactRepositoryAdapterForLeads,
  LeadHttpRepository,
  LeadNumberAvailabilityHttpService,
  ProjectTypeHttpRepository,
} from "@/leads";

const ContactsCtx = createContext<ContactsAppContext | null>(null);
const LeadsCtx = createContext<LeadsAppContext | null>(null);

export const useContactsApp = (): ContactsAppContext => {
  const ctx = useContext(ContactsCtx);
  if (!ctx) throw new Error("useContactsApp must be used within <DiProvider/>");
  return ctx;
};

export const useLeadsApp = (): LeadsAppContext => {
  const ctx = useContext(LeadsCtx);
  if (!ctx) throw new Error("useLeadsApp must be used within <DiProvider/>");
  return ctx;
};

export const DiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const contactsCtx = useMemo<ContactsAppContext>(() => {
    return makeContactsAppContext({
      repos: {
        contact: new ContactHttpRepository(),
      },
    });
  }, []);

    const leadsCtx = useMemo<LeadsAppContext>(() => {
    return makeLeadsAppContext({
      clock: SystemClock,
      repos: {
        lead: new LeadHttpRepository(),
        contact: new ContactRepositoryAdapterForLeads(),
        projectType: new ProjectTypeHttpRepository(),
      },
      services: {
        leadNumberAvailability: new LeadNumberAvailabilityHttpService(),
      },
    });
  }, []);

  return (
    <ContactsCtx.Provider value={contactsCtx}>
      <LeadsCtx.Provider value={leadsCtx}>{children}</LeadsCtx.Provider>
    </ContactsCtx.Provider>
  );
};
