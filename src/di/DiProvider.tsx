import React, { createContext, useContext, useMemo } from "react";

import type { ContactsAppContext } from "@/features/contact/application";
import { makeContactsAppContext } from "@/features/contact/application/context";
import {
  ContactHttpRepository,
  ContactUniquenessHttpService,
} from "@/features/contact/infra";

import type { LeadsAppContext } from "@/features/leads/application";
import { makeLeadsAppContext } from "@/features/leads/application";
import { SystemClock } from "@/features/leads/domain";
import {
  LeadHttpRepository,
  LeadNumberAvailabilityHttpService,
} from "@/features/leads/infra";
import { ProjectTypeHttpRepository } from "@/features/leads/infra/http/ProjectTypeHttpRepository";
import { ContactRepositoryAdapterForLeads } from "@/features/leads/infra/adapters/ContactRepositoryAdapterForLeads";

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
