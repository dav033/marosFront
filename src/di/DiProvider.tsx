import React, { createContext, useContext, useMemo } from "react";
import { makeContactsAppContext } from "./contactsAppContext";
import { makeLeadsAppContext } from "@/features/leads/application";
import { SystemClock } from "@/features/leads/domain";
import { LeadHttpRepository, LeadNumberAvailabilityHttpService } from "@/features/leads/infra";

import type { ContactsAppContext } from "@/features/contact/application";
import type { LeadsAppContext } from "@/features/leads/application";

const ContactsCtx = createContext<ContactsAppContext | null>(null);
const LeadsCtx = createContext<LeadsAppContext | null>(null);

export const useContactsApp = () => {
  const ctx = useContext(ContactsCtx);
  if (!ctx) throw new Error("useContactsApp must be used within <DiProvider/>");
  return ctx;
};

export const useLeadsApp = () => {
  const ctx = useContext(LeadsCtx);
  if (!ctx) throw new Error("useLeadsApp must be used within <DiProvider/>");
  return ctx;
};

export const DiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const contactsCtx = useMemo(() => makeContactsAppContext(), []);
  const leadsCtx = useMemo<LeadsAppContext>(() => {
    return makeLeadsAppContext({
      clock: SystemClock,
      repos: { lead: new LeadHttpRepository() },
      services: { leadNumberAvailability: new LeadNumberAvailabilityHttpService() },
    });
  }, []);

  return (
    <ContactsCtx.Provider value={contactsCtx}>
      <LeadsCtx.Provider value={leadsCtx}>{children}</LeadsCtx.Provider>
    </ContactsCtx.Provider>
  );
};
